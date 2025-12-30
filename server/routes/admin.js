import express from 'express';
import { getQuestionsForClass } from '../aiQuestions.js';

const router = express.Router();

router.post('/questions', (req, res) => {
    const profile = req.body;
    if (!profile || !profile.focus) {
        return res.status(400).json({ error: 'Missing class profile' });
    }

    const questions = getQuestionsForClass(profile);
    res.json({ questions });
});

export default router;