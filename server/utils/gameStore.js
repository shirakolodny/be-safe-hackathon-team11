// server/utils/gameStore.js

/**
 * In-memory database.
 * Key: Game Code, Value: Game Object
 */
const games = {}; 

const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createGame = (topics, questions) => {
    let gameCode = generateGameCode();
    while (games[gameCode]) {
        gameCode = generateGameCode();
    }

    games[gameCode] = {
        id: gameCode,
        topics: topics, 
        isActive: true, 
        students: [], // [{ username, answers: [] }]
        questions: questions,
        createdAt: new Date().toISOString()
    };
    
    console.log(`[GameStore] Game created: ${gameCode}`);
    return games[gameCode];
};

export const getGame = (gameCode) => {
    return games[gameCode];
};

// --- Support Student Actions ---

export const addStudentAnswer = (gameCode, username, answers) => {
    const game = games[gameCode];
    if (!game) return null;

    // Check if student exists, if not create one
    let student = game.students.find(s => s.username === username);
    if (!student) {
        student = { username, answers: [], submittedAt: null };
        game.students.push(student);
    }

    student.answers = answers;
    student.submittedAt = new Date().toISOString();
    
    return student;
};