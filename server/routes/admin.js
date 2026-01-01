import express from 'express';

const router = express.Router();

router.post('/questions', (req, res) => {
    const profile = req.body;
    
    if (!profile || !profile.focus) {
        return res.status(400).json({ error: 'Missing class profile' });
    }

    console.log(`Received request for topic: ${profile.focus}`);
    
    res.json({ 
        questions: [], 
        message: "AI logic is currently disabled" 
    });
});

export default router;