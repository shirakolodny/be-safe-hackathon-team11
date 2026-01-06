import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();


const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../data/situation.json");

const gamesByCode = new Map();
const answersByGame = new Map();

function generateGameCode(length = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < length; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

function createUniqueCode() {
    let code;
    do {
        code = generateGameCode(6);
    } while (gamesByCode.has(code));
    return code;
}

router.post("/", (req, res) => {
    const profile = req.body;

    if (!profile || !profile.focus) {
        return res.status(400).json({ error: "Missing class profile" });
    }

    let allQuestions = [];
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        allQuestions = JSON.parse(raw);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to load questions" });
    }

    const X = Number(profile.x) > 0 ? Number(profile.x) : 10;
    const diagnosticQuestions = allQuestions.slice(0, X);

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

router.get("/:code/diagnostic", (req, res) => {
    const game = gamesByCode.get(req.params.code);

    if (!game) {
        return res.status(404).json({ error: "game_not_found", questions: [] });
    }

    return res.json({ questions: game.questions });
});

router.post("/:code/diagnostic/answers", (req, res) => {
    const game = gamesByCode.get(req.params.code);
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

    const list = answersByGame.get(req.params.code) || [];
    list.push(record);
    answersByGame.set(req.params.code, list);

    return res.json({ ok: true });
});

router.get("/:code/results", (req, res) => {
    if (!gamesByCode.has(req.params.code)) {
        return res.status(404).json({ error: "game_not_found" });
    }

    return res.json({
        gameCode: req.params.code,
        submissions: answersByGame.get(req.params.code) || [],
    });
});

export default router;