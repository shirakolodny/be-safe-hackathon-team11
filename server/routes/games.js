import express from "express";
import { getGame } from "../utils/gameStore.js";
import { analyzeAnswerWithAI } from "../utils/aiService.js";
import { getQuestionsForClass } from "../utils/aiQuestions.js";

const router = express.Router();

// --- 0. JOIN GAME (Check availability & Reserve username) ---
router.post("/:code/join", (req, res) => {
    const code = req.params.code;
    const { username } = req.body;

    const game = getGame(code);
    if (!game) return res.status(404).json({ error: "Game not found" });

    // Check if username already exists in this game
    const existingStudent = game.students.find(s => s.username === username);
    
    if (existingStudent) {
        // Return 409 Conflict if name is taken
        return res.status(409).json({ error: "Username already taken" });
    }

    // Create the student entry immediately
    const newStudent = { 
        username, 
        scoresByTopic: {}, 
        answeredIds: [], 
        questionsQueue: [...game.questions], 
        finished: false,
        finalScore: 0
    };
    game.students.push(newStudent);

    res.status(200).json({ message: "Joined successfully" });
});

// --- 1. START/RESUME GAME (Fetch current state) ---
router.get("/:code/start", (req, res) => {
  const code = req.params.code;
  const { username } = req.query;
  
  const game = getGame(code);
  if (!game) return res.status(404).json({ error: "Game not found" });

  let student = game.students.find(s => s.username === username);
  
  // Fallback: If student doesn't exist (e.g. server restart), recreate them
  if (!student) {
      student = { 
          username, 
          scoresByTopic: {}, 
          answeredIds: [], 
          questionsQueue: [...game.questions], 
          finished: false,
          finalScore: 0
      };
      game.students.push(student);
  }

  // Get the next question in line
  const nextQ = student.questionsQueue.length > 0 ? student.questionsQueue[0] : null;

  res.json({ 
      nextQuestion: nextQ,
      // Critical for resuming: tell client how many were already answered
      answeredCount: student.answeredIds.length, 
      finished: student.finished
  });
});

// --- 2. SUBMIT ANSWER (Analyze & Adapt) ---
router.post("/:code/answer", async (req, res) => {
  const code = req.params.code;
  const { username, questionId, answerText } = req.body;
  
  const game = getGame(code);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const student = game.students.find(s => s.username === username);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const currentQ = student.questionsQueue.find(q => q.id === questionId);
  if (!currentQ) {
      return res.status(400).json({ error: "Question not valid or already answered" });
  }

  // AI Analysis
  const aiResult = await analyzeAnswerWithAI(currentQ.question, answerText, currentQ.category);
  const { score, feedback, suggestedAnswer } = aiResult;
  const topic = currentQ.category;

  // Update Stats
  if (!student.scoresByTopic[topic]) student.scoresByTopic[topic] = { total: 0, count: 0 };
  student.scoresByTopic[topic].total += score;
  student.scoresByTopic[topic].count += 1;

  // Mark as answered and remove from queue
  student.answeredIds.push(questionId);
  student.questionsQueue.shift();

  // Adaptive Logic (Checkpoints)
  const totalAnswered = student.answeredIds.length;
  
  if (totalAnswered >= 10 && totalAnswered < 30 && totalAnswered % 5 === 0) {
      const weakTopics = [];
      Object.keys(student.scoresByTopic).forEach(t => {
          const stats = student.scoresByTopic[t];
          // If average score is below 7.5, mark as weak
          if ((stats.total / stats.count) < 7.5) weakTopics.push(t);
      });

      if (weakTopics.length > 0) {
          console.log(`[Adaptive] Adding questions for: ${weakTopics.join(', ')}`);
          const remediationBatch = getQuestionsForClass({ topics: weakTopics })
              .filter(q => !student.answeredIds.includes(q.id)) 
              .slice(0, 5); 
          student.questionsQueue.push(...remediationBatch);
      }
  }

  // Check Completion Status
  let isFinished = false;
  if (student.questionsQueue.length === 0 || totalAnswered >= 30) {
      isFinished = true;
      student.finished = true;
      student.finalScore = calculateFinalScore(student.scoresByTopic);
  }

  res.json({
      feedback,
      suggestedAnswer,
      score,
      nextQuestion: !isFinished ? student.questionsQueue[0] : null,
      finished: isFinished,
      totalAnswered: totalAnswered 
  });
});

function calculateFinalScore(scoresMap) {
    let total = 0, count = 0;
    Object.values(scoresMap).forEach(v => { total += v.total; count += v.count; });
    return count === 0 ? 0 : Math.round((total / count) * 10) / 10;
}

// --- 3. GET RESULTS (Teacher View) ---
router.get("/:code/results", (req, res) => {
    const code = req.params.code;
    const game = getGame(code);
    if (!game) return res.status(404).json({ error: "Game not found" });

    return res.json({
        gameCode: code,
        students: game.students.map(s => ({
            username: s.username,
            finished: s.finished,
            score: s.finalScore,
            scoresByTopic: s.scoresByTopic
        }))
    });
});

export default router;