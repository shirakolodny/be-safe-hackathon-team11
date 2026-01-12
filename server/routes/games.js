import express from "express";
import Game from "../models/Game.js"; 
// Added generateClassSummary to imports
import { analyzeAnswerWithAI, generateClassSummary } from "../utils/aiService.js";
import { getQuestionsForClass } from "../utils/aiQuestions.js";

const router = express.Router();

// --- 0. JOIN GAME ---
router.post("/:code/join", async (req, res) => {
    try {
        const code = req.params.code;
        const { username } = req.body;

        const game = await Game.findOne({ gameCode: code });
        if (!game) return res.status(404).json({ error: "Game not found" });

        // Check if game is locked by the teacher
        if (!game.isActive) {
            // We check if the student ALREADY exists. 
            // If they exist, we allow them to rejoin (to see results/locked screen).
            // If they are new, we block them.
            const existing = (game.submissions || []).find(s => s.username === username);
            if (!existing) {
                 return res.status(403).json({ error: "Game is locked by the teacher." });
            }
        }

        // Check if username already exists in this game
        const existingStudent = (game.submissions || []).find(s => s.username === username);

        if (existingStudent) {
            return res.status(409).json({ error: "Username already taken" });
        }

        const newStudent = {
            username,
            scoresByTopic: {}, // Mongoose will automatically convert this to a Map
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

        // If student doesn't exist - create them (in case they didn't go through Join)
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
            // Refetch student after save to ensure valid Mongoose object
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

        // AI Analysis
        const aiResult = await analyzeAnswerWithAI(currentQ.question, answerText, currentQ.category);
        const { score, feedback, suggestedAnswer } = aiResult;
        const topic = currentQ.category;

        // --- Update Statistics (Map compatible) ---
        // 1. Use .get() to retrieve existing data
        let topicStats = student.scoresByTopic.get(topic);
        if (!topicStats) {
            topicStats = { total: 0, count: 0 };
        }
        
        // 2. Update data
        topicStats.total += score;
        topicStats.count += 1;

        // 3. Save back (Required!)
        student.scoresByTopic.set(topic, topicStats);
        // ----------------------------------------

        student.answeredIds.push(questionId);
        student.questionsQueue.shift();

        // Adaptive logic (add questions if needed)
        const totalAnswered = student.answeredIds.length;
        if (totalAnswered >= 10 && totalAnswered < 30 && totalAnswered % 5 === 0) {
            const weakTopics = [];
            // Use for..of loop on the Map
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

        // --- Check completion and calculate final score ---
        let isFinished = false;
        
        // Completion condition: Queue empty or reached 30 questions
        if (student.questionsQueue.length === 0 || totalAnswered >= 30) {
            isFinished = true;
            student.finished = true;
            
            // Calculate final score
            student.finalScore = calculateFinalScore(student.scoresByTopic);
            console.log(`[Game] Student ${username} finished. Final Score: ${student.finalScore}`);
        }

        // --- Save ---
        game.markModified('submissions'); // Critical for array update
        await game.save();

        res.json({
            feedback,
            suggestedAnswer,
            score,
            nextQuestion: !isFinished ? student.questionsQueue[0] : null,
            finished: isFinished,
            totalAnswered: totalAnswered,
            finalScore: isFinished ? student.finalScore : null // Return score to client as well
        });

    } catch (error) {
        console.error("Answer error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- Function to calculate score ---
function calculateFinalScore(scoresMap) {
    if (!scoresMap) return 0;

    let total = 0, count = 0;
    
    // Check: Is this a Mongoose Map or regular object?
    // If Map, use .values(). If Object, use Object.values
    const iterator = (typeof scoresMap.values === 'function') 
        ? scoresMap.values() 
        : Object.values(scoresMap);

    for (const stats of iterator) {
        total += stats.total;
        count += stats.count;
    }
    
    // Weighted average (total score divided by total answered questions)
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
            topics: game.topics,
            isActive: game.isActive,
            students: (game.submissions || []).map(s => ({
                username: s.username,
                finished: s.finished,
                score: s.finalScore,
                scoresByTopic: s.scoresByTopic // Returned as regular JSON object to client
            }))
        });
    } catch (error) {
        console.error("Results error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- 4. TOGGLE GAME LOCK ---
router.post("/:code/toggle-lock", async (req, res) => {
    try {
        const code = req.params.code;
        const game = await Game.findOne({ gameCode: code });
        if (!game) return res.status(404).json({ error: "Game not found" });

        // Toggle status
        game.isActive = !game.isActive;
        
        // Mark modified just in case
        game.markModified('isActive');
        
        await game.save();

        console.log(`Game ${code} lock status changed to: ${game.isActive}`);
        res.json({ success: true, isActive: game.isActive });
    } catch (error) {
        console.error("Toggle lock error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- 5. GET CLASS SUMMARY (AI) --- (THIS WAS MISSING)
router.get("/:code/summary", async (req, res) => {
    try {
        const code = req.params.code;
        const game = await Game.findOne({ gameCode: code });
        if (!game) return res.status(404).json({ error: "Game not found" });

        // Calculate class average per topic for the AI
        const topicAggregates = {}; // { topic: { totalScore: 0, totalCount: 0 } }

        (game.submissions || []).forEach(student => {
            const scores = student.scoresByTopic;
            
            // Helper to process topic stats
            const processEntry = (topic, data) => {
                if (!topicAggregates[topic]) {
                    topicAggregates[topic] = { totalScore: 0, totalCount: 0 };
                }
                topicAggregates[topic].totalScore += data.total;
                topicAggregates[topic].totalCount += data.count;
            };

            // Handle Map (Mongoose) vs Object (Lean)
            if (scores && typeof scores.forEach === 'function') {
                scores.forEach((data, topic) => processEntry(topic, data));
            } else if (scores) {
                Object.entries(scores).forEach(([topic, data]) => processEntry(topic, data));
            }
        });

        // Convert to format expected by AI service: { "Topic": "Average Score" }
        const statsForAI = {};
        Object.keys(topicAggregates).forEach(topic => {
            const agg = topicAggregates[topic];
            if (agg.totalCount > 0) {
                statsForAI[topic] = (agg.totalScore / agg.totalCount).toFixed(1);
            }
        });

        // Call AI Service
        const summary = await generateClassSummary(statsForAI);
        res.json({ summary });

    } catch (error) {
        console.error("Summary route error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;