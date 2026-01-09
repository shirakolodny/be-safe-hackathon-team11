import express from 'express';
// Import the question generator
import { getQuestionsForClass } from '../utils/aiQuestions.js';
// Import the game store
import { createGame, getGame } from '../utils/gameStore.js';

const router = express.Router();

router.post('/questions', (req, res) => {
    const profile = req.body;

    // Validate input
    if (!profile || !profile.focus) {
        return res.status(400).json({ error: 'Missing class profile' });
    }

    // 1. Generate real questions using your existing logic
    const questions = getQuestionsForClass(profile);

    // 2. Create the game instance and save it to the store
    const newGame = createGame(profile.topics, questions);

    // 3. Return the response with the Game Code and Questions
    res.json({
        success: true,
        gameCode: newGame.id,
        questions: newGame.questions
    });
});

router.get('/game/:code', (req, res) => {
    const game = getGame(req.params.code);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    res.json({
        gameCode: game.id,
        topics: game.topics, // Return the array
        studentsCount: game.students.length,
        students: game.students
    });
});

export default router;