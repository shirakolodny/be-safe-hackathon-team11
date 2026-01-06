import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();


const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/situation.json");

router.get("/questions", (req, res) => {
    try {
        const rawData = fs.readFileSync(dataPath, "utf-8");
        const questions = JSON.parse(rawData);
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load questions" });
    }
});

export default router;