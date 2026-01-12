import express from "express";
import Game from "../models/Game.js"; 
import { analyzeAnswerWithAI } from "../utils/aiService.js";
import { getQuestionsForClass } from "../utils/aiQuestions.js";

const router = express.Router();

// --- 0. JOIN GAME ---
router.post("/:code/join", async (req, res) => {
    try {
        const code = req.params.code;
        const { username } = req.body;

        const game = await Game.findOne({ gameCode: code });
        if (!game) return res.status(404).json({ error: "Game not found" });

    // NEW: Check if game is locked by the teacher
    if (!game.isActive) {
        // We check if the student ALREADY exists. 
        // If they exist, we might allow them to rejoin (to see results/locked screen).
        // If they are new, we block them.
        const existing = game.students.find(s => s.username === username);
        if (!existing) {
             return res.status(403).json({ error: "Game is locked by the teacher." });
        }
    }

    // Check if username already exists in this game
    // const existingStudent = game.students.find(s => s.username === username);
        const existingStudent = (game.submissions || []).find(s => s.username === username);

        if (existingStudent) {
            return res.status(409).json({ error: "Username already taken" });
        }

        const newStudent = {
            username,
            scoresByTopic: {}, // Mongoose ימיר את זה ל-Map באופן אוטומטי
            answeredIds: [],
            questionsQueue: [...game.questions],
            finished: false,
            finalScore: 0
        };

        game.submissions.push(newStudent);
        await game.save();

        res.status(200).json({ message: "Joined successfully" });
    } catch (error) {
        console.error("Join error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- 1. START/RESUME GAME ---
router.get("/:code/start", async (req, res) => {
    try {
        const code = req.params.code;
        const { username } = req.query;

        const game = await Game.findOne({ gameCode: code });
        if (!game) return res.status(404).json({ error: "Game not found" });

        let student = (game.submissions || []).find(s => s.username === username);

        // אם התלמיד לא קיים - יוצרים אותו (למקרה שלא עבר דרך Join)
        if (!student) {
            student = {
                username,
                scoresByTopic: {},
                answeredIds: [],
                questionsQueue: [...game.questions],
                finished: false,
                finalScore: 0
            };
            game.submissions.push(student);
            await game.save();
            // שולפים מחדש את התלמיד אחרי השמירה כדי שיהיה אובייקט מונגו תקין
            student = game.submissions.find(s => s.username === username);
        }

        const nextQ = student.questionsQueue.length > 0 ? student.questionsQueue[0] : null;

        res.json({
            nextQuestion: nextQ,
            answeredCount: student.answeredIds.length,
            finished: student.finished
        });
    } catch (error) {
        console.error("Start error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- 2. SUBMIT ANSWER ---
router.post("/:code/answer", async (req, res) => {
    try {
        const code = req.params.code;
        const { username, questionId, answerText } = req.body;

        const game = await Game.findOne({ gameCode: code });
        if (!game) return res.status(404).json({ error: "Game not found" });

        const student = (game.submissions || []).find(s => s.username === username);
        if (!student) return res.status(404).json({ error: "Student not found" });

        const currentQ = student.questionsQueue.find(q => q.id == questionId);
        
        if (!currentQ) {
            return res.status(400).json({ error: "Question not valid or already answered" });
        }

        // ניתוח ה-AI
        const aiResult = await analyzeAnswerWithAI(currentQ.question, answerText, currentQ.category);
        const { score, feedback, suggestedAnswer } = aiResult;
        const topic = currentQ.category;

        // --- עדכון סטטיסטיקות (מותאם ל-Map) ---
        // 1. שימוש ב-get כדי להביא נתונים קיימים
        let topicStats = student.scoresByTopic.get(topic);
        if (!topicStats) {
            topicStats = { total: 0, count: 0 };
        }
        
        // 2. עדכון הנתונים
        topicStats.total += score;
        topicStats.count += 1;

        // 3. שמירה חזרה (חובה!)
        student.scoresByTopic.set(topic, topicStats);
        // ----------------------------------------

        student.answeredIds.push(questionId);
        student.questionsQueue.shift();

        // לוגיקה אדפטיבית (הוספת שאלות במקרה הצורך)
        const totalAnswered = student.answeredIds.length;
        if (totalAnswered >= 10 && totalAnswered < 30 && totalAnswered % 5 === 0) {
            const weakTopics = [];
            // שימוש בלולאת for..of על ה-Map
            for (const [t, stats] of student.scoresByTopic) {
                if (stats.count > 0 && (stats.total / stats.count) < 7.5) {
                    weakTopics.push(t);
                }
            }

            if (weakTopics.length > 0) {
                console.log(`[Adaptive] Adding questions for: ${weakTopics.join(', ')}`);
                const newQuestions = await getQuestionsForClass({ topics: weakTopics });
                const remediationBatch = newQuestions
                    .filter(q => !student.answeredIds.includes(q.id))
                    .slice(0, 5);
                if (remediationBatch.length > 0) {
                     student.questionsQueue.push(...remediationBatch);
                }
            }
        }

        // --- בדיקת סיום וחישוב ציון סופי ---
        let isFinished = false;
        
        // התנאי לסיום: נגמרו השאלות בתור או שהגענו ל-30 שאלות
        if (student.questionsQueue.length === 0 || totalAnswered >= 30) {
            isFinished = true;
            student.finished = true;
            
            // חישוב הציון הסופי (כאן היה הבאג)
            student.finalScore = calculateFinalScore(student.scoresByTopic);
            console.log(`[Game] Student ${username} finished. Final Score: ${student.finalScore}`);
        }

        // --- שמירה ---
        game.markModified('submissions'); // קריטי לעדכון המערך
        await game.save();

        res.json({
            feedback,
            suggestedAnswer,
            score,
            nextQuestion: !isFinished ? student.questionsQueue[0] : null,
            finished: isFinished,
            totalAnswered: totalAnswered,
            finalScore: isFinished ? student.finalScore : null // מחזירים את הציון גם ללקוח
        });

    } catch (error) {
        console.error("Answer error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- הפונקציה המתוקנת לחישוב ציון ---
function calculateFinalScore(scoresMap) {
    if (!scoresMap) return 0;

    let total = 0, count = 0;
    
    // בדיקה: האם זה Map של מונגו או אובייקט רגיל?
    // אם זה Map, יש לו פונקציית .values(). אם זה אובייקט, נשתמש ב-Object.values
    const iterator = (typeof scoresMap.values === 'function') 
        ? scoresMap.values() 
        : Object.values(scoresMap);

    for (const stats of iterator) {
        total += stats.total;
        count += stats.count;
    }
    
    // ממוצע משוקלל (סך כל הניקוד חלקי סך כל השאלות שענו עליהן)
    return count === 0 ? 0 : Math.round((total / count) * 10) / 10;
}

// --- 3. GET RESULTS ---
router.get("/:code/results", async (req, res) => {
    try {
        const code = req.params.code;
        const game = await Game.findOne({ gameCode: code });
        if (!game) return res.status(404).json({ error: "Game not found" });

        return res.json({
            gameCode: code,
            students: (game.submissions || []).map(s => ({
                username: s.username,
                finished: s.finished,
                score: s.finalScore,
                scoresByTopic: s.scoresByTopic // זה יוחזר כאובייקט JSON רגיל ללקוח
            }))
        });
    } catch (error) {
        console.error("Results error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;