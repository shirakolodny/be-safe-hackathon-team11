import express from 'express';

const router = express.Router();
import { getQuestionsForClass } from '../aiQuestions.js';

router.post('/questions', (req, res) => {
    const profile = req.body;
    console.log("profile", profile)
    if (!profile || !profile.focus) {
        return res.status(400).json({ error: 'Missing class profile' });
    }

    console.log(`Received request for topic: ${profile.focus}`);
    
    // res.json({ 
    //     questions: [], 
    //     message: "AI logic is currently disabled" 
    // });

    const questions = getQuestionsForClass(profile);
    res.json({ questions });
});

export default router;