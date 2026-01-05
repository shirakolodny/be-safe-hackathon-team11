import express from "express";
import { getQuestionsForClass } from "../aiQuestions.js";

const router = express.Router();

// ===== In-memory storage =====
// gamesByCode: code -> { questions: [...], profile, createdAt }
const gamesByCode = new Map();

// answersByGame: code -> [ { username, answers: [...], submittedAt } ]
const answersByGame = new Map();

function generateGameCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function createUniqueCode() {
  let code;
  do {
    code = generateGameCode(6);
  } while (gamesByCode.has(code));
  return code;
}

// 1) Teacher creates a game (and we store X diagnostic questions)
router.post("/", (req, res) => {
  const profile = req.body;

  if (!profile || !profile.focus) {
    return res.status(400).json({ error: "Missing class profile" });
  }

  // Get questions from your existing logic
  const allQuestions = getQuestionsForClass(profile);

  // Choose first X questions for diagnostic
  const X = Number(profile.x) > 0 ? Number(profile.x) : 5; // default 5, or allow teacher to pass x
  const diagnosticQuestions = Array.isArray(allQuestions) ? allQuestions.slice(0, X) : [];

  const gameCode = createUniqueCode();

  gamesByCode.set(gameCode, {
    questions: diagnosticQuestions,
    profile,
    createdAt: new Date().toISOString(),
  });

  return res.json({
    gameCode,
    questions: diagnosticQuestions,
  });
});

// 2) Student fetches diagnostic questions by code
router.get("/:code/diagnostic", (req, res) => {
  const code = req.params.code;
  const game = gamesByCode.get(code);

  if (!game) {
    return res.status(404).json({ error: "game_not_found", questions: [] });
  }

  return res.json({ questions: game.questions });
});

// 3) Student submits answers
router.post("/:code/diagnostic/answers", (req, res) => {
  const code = req.params.code;
  const game = gamesByCode.get(code);

  if (!game) {
    return res.status(404).json({ error: "game_not_found" });
  }

  const { username, answers } = req.body;

  if (!username || !Array.isArray(answers)) {
    return res.status(400).json({ error: "bad_request" });
  }

  const record = {
    username,
    answers,
    submittedAt: new Date().toISOString(),
  };

  const list = answersByGame.get(code) || [];
  list.push(record);
  answersByGame.set(code, list);

  return res.json({ ok: true });
});

router.get("/:code/results", (req, res) => {
  const code = req.params.code;

  if (!gamesByCode.has(code)) {
    return res.status(404).json({ error: "game_not_found" });
  }

  return res.json({
    gameCode: code,
    submissions: answersByGame.get(code) || [],
  });
});

export default router;
