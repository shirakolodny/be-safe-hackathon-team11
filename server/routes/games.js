import express from "express";
// Import the shared store!
import { getGame, addStudentAnswer } from "../utils/gameStore.js";

const router = express.Router();

// 1. GET Diagnostic Questions (For Students)
// Instead of looking in a local Map, it asks the shared gameStore
router.get("/:code/diagnostic", (req, res) => {
  const code = req.params.code;
  const game = getGame(code);

  if (!game) {
    return res.status(404).json({ error: "game_not_found", questions: [] });
  }

  return res.json({ questions: game.questions });
});

// 2. POST Answers (For Students)
router.post("/:code/diagnostic/answers", (req, res) => {
  const code = req.params.code;
  const { username, answers } = req.body;

  if (!username || !Array.isArray(answers)) {
    return res.status(400).json({ error: "bad_request" });
  }

  // Save to the shared store
  const result = addStudentAnswer(code, username, answers);

  if (!result) {
    return res.status(404).json({ error: "game_not_found" });
  }

  return res.json({ ok: true });
});

export default router;