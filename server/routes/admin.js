// import express from 'express';
// // Import the question generator
// import { getQuestionsForClass } from '../utils/aiQuestions.js';
// // Import the game store
// import { createGame, getGame } from '../utils/gameStore.js';

// const router = express.Router();

// router.post('/questions', (req, res) => {
//     const profile = req.body;

//     // Validate input
//     if (!profile || !profile.focus) {
//         return res.status(400).json({ error: 'Missing class profile' });
//     }

//     // 1. Generate real questions using your existing logic
//     const questions = getQuestionsForClass(profile);

//     // 2. Create the game instance and save it to the store
//     const newGame = createGame(profile.topics, questions);

//     // 3. Return the response with the Game Code and Questions
//     res.json({
//         success: true,
//         gameCode: newGame.id,
//         questions: newGame.questions
//     });
// });

// router.get('/game/:code', (req, res) => {
//     const game = getGame(req.params.code);
//     if (!game) return res.status(404).json({ error: 'Game not found' });

//     res.json({
//         gameCode: game.id,
//         topics: game.topics, // Return the array
//         studentsCount: game.students.length,
//         students: game.students
//     });
// });

// export default router;

// import express from 'express';
// // Import the question generator
// import { getQuestionsForClass } from '../utils/aiQuestions.js';
// // Import the game store
// import { createGame, getGame } from '../utils/gameStore.js'; // או מאיפה שזה מגיע (gameLogic.js?)

// const router = express.Router();

// // --- POST: יצירת משחק חדש ---
// router.post('/questions', async (req, res) => { // <--- 1. הוספנו async
//     try {
//         const profile = req.body;

//         // Validate input
//         if (!profile || !profile.focus) {
//             return res.status(400).json({ error: 'Missing class profile' });
//         }

//         // 1. Generate real questions
//         const questions = getQuestionsForClass(profile);

//         // 2. Create the game instance in DB
//         // <--- 2. הוספנו await כי זה פונה לדאטה בייס
//         const newGame = await createGame(profile.topics, questions);

//         // 3. Return the response
//         res.status(201).json({
//             success: true,
//             gameCode: newGame.gameCode, // <--- 3. שינינו ל-gameCode (לפי הסכמה שיצרנו)
//             gameId: newGame._id,        // אפשר להחזיר גם את ה-ID הפנימי ליתר ביטחון
//             questions: newGame.questions
//         });

//     } catch (error) {
//         console.error("Error in create route:", error);
//         res.status(500).json({ error: "Server error while creating game" });
//     }
// });

// // --- GET: קבלת פרטי משחק (שימי לב שגם פה נצטרך לטפל בהמשך) ---
// router.get('/game/:code', async (req, res) => { // גם פה כדאי להוסיף async
//     try {
//         // הערה: אם getGame עדיין לא עודכן לעבוד עם מונגו, זה יעשה בעיות.
//         // בהנחה שגם getGame יעודכן להיות async:
//         const game = await getGame(req.params.code); 
//         console.log("Fetched game:", game);
//         if (!game) return res.status(404).json({ error: 'Game not found' });

//         res.json({
//             gameCode: game.gameCode,
//             topics: game.topics,
//             studentsCount: game.submissions ? game.submissions.length : 0,
//             students: game.submissions // שינינו ל-submissions לפי הסכמה
//         });
//     } catch (error) {
//         console.error("Error fetching game:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// export default router;

import express from 'express';
// Import the question generator
import { getQuestionsForClass } from '../utils/aiQuestions.js';
// Import the game store
import { createGame, getGame } from '../utils/gameStore.js';

const router = express.Router();

// 1. הוספנו async כאן
router.post('/questions', async (req, res) => { 
    try {
        const profile = req.body;

        if (!profile || !profile.focus) {
            return res.status(400).json({ error: 'Missing class profile' });
        }

        // 2. הוספנו await כאן! (זה התיקון הקריטי)
        // בלי זה - אנחנו מקבלים Promise במקום מערך שאלות
        const questions = await getQuestionsForClass(profile);

        // 3. הוספנו await גם כאן ליצירת המשחק
        const newGame = await createGame(profile.topics, questions);

        res.status(201).json({
            success: true,
            gameCode: newGame.gameCode,
            gameId: newGame._id,
            questions: newGame.questions
        });

    } catch (error) {
        console.error("Error in create route:", error);
        res.status(500).json({ error: "Server error while creating game" });
    }
});

router.get('/game/:code', async (req, res) => {
    try {
        const game = await getGame(req.params.code);
        if (!game) return res.status(404).json({ error: 'Game not found' });

        res.json({
            gameCode: game.gameCode,
            topics: game.topics,
            studentsCount: game.submissions ? game.submissions.length : 0,
            students: game.submissions
        });
    } catch (error) {
        console.error("Error fetching game:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;