import Game from '../models/Game.js'; 

// --- יצירת קוד רנדומלי ---
const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// --- יצירת משחק חדש (Create) ---
export const createGame = async (topics, questions) => {
    try {
        let gameCode = generateGameCode();
        
        // בדיקת כפילויות מול ה-DB
        let existingGame = await Game.findOne({ gameCode: gameCode });
        while (existingGame) {
            gameCode = generateGameCode();
            existingGame = await Game.findOne({ gameCode: gameCode });
        }

        // יצירת האובייקט לפי הסכמה
        const newGame = new Game({
            gameCode: gameCode,
            topics: topics,
            questions: questions,
            isActive: true,
            submissions: [] 
        });

        // שמירה פיזית ב-DB
        await newGame.save();
        console.log(`[MongoDB] Game created: ${gameCode}`);
        return newGame;

    } catch (error) {
        console.error("Error creating game:", error);
        throw error;
    }
};

// --- קבלת משחק (Get) ---
export const getGame = async (gameCode) => {
    try {
        const game = await Game.findOne({ gameCode: gameCode });
        return game;
    } catch (error) {
        console.error("Error fetching game:", error);
        return null;
    }
};

// --- עדכון/הוספת תשובות תלמיד (Update) ---
export const addStudentAnswer = async (gameCode, username, answers) => {
    try {
        // 1. מביאים את המשחק
        const game = await Game.findOne({ gameCode: gameCode });
        if (!game) return null;

        // 2. מחפשים את התלמיד
        let student = game.submissions.find(s => s.username === username);

        if (!student) {
            // אם התלמיד לא קיים (נדיר, כי בדרך כלל עושים Join קודם), ניצור אותו עם המבנה הנכון
            student = {
                username,
                scoresByTopic: {},
                answeredIds: [], // שימי לב: שינינו ל-answeredIds כדי להתאים לסכמה
                questionsQueue: [...game.questions], // מאתחלים את התור
                finished: false,
                finalScore: 0
            };
            game.submissions.push(student);
        }

        // 3. עדכון הנתונים (מסנכרנים מול השדות בסכמה)
        // אם 'answers' מכיל IDs של שאלות, נשמור אותם ב-answeredIds
        if (Array.isArray(answers)) {
            student.answeredIds = answers; 
        }

        // 4. הודעה למונגו שהמערך השתנה (קריטי לעדכונים עמוקים)
        game.markModified('submissions');

        // 5. שמירה
        await game.save();
        
        // מחזירים את התלמיד המעודכן
        // שולפים מחדש מהמערך המעודכן כדי לוודא שהכל שם
        return game.submissions.find(s => s.username === username);

    } catch (error) {
        console.error("Error saving answer:", error);
        return null;
    }
};