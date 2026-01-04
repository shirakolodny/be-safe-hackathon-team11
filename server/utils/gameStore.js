// server/utils/gameStore.js

/**
 * In-memory database to store active games.
 * Key: Game Code (string), Value: Game Object
 */
const games = {}; 

/**
 * Generates a random 6-character alphanumeric code.
 */
const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Creates a new game instance.
 * @param {Array} topics - Array of selected topics
 * @param {Array} questions - Array of questions
 */
export const createGame = (topics, questions) => {
    let gameCode = generateGameCode();
    while (games[gameCode]) {
        gameCode = generateGameCode();
    }

    games[gameCode] = {
        id: gameCode,
        topics: topics, 
        isActive: true, 
        students: [],
        questions: questions
    };
    
    console.log(`[GameStore] Game created: ${gameCode}`);
    return games[gameCode];
};

/**
 * Retrieves a game object by its code.
 */
export const getGame = (gameCode) => {
    return games[gameCode];
};

/**
 * Helper: Adds a student to a game (To be connected with Socket/Login logic later)
 */
export const addStudent = (gameCode, username) => {
    const game = games[gameCode];
    if (!game) return null;

    const newStudent = {
        username: username,
        score: 0,
        finished: false
    };
    
    game.students.push(newStudent);
    return newStudent;
};