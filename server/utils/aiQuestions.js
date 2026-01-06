// server/aiQuestions.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Load the situations database safely
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const situationsPath = path.join(__dirname, '..', 'data', 'situations.json');
// Read and parse the JSON file
let allQuestions = [];
try {
    const data = fs.readFileSync(situationsPath, 'utf8');
    allQuestions = JSON.parse(data);
    console.log(`[aiQuestions] Loaded ${allQuestions.length} situations from DB.`);
} catch (err) {
    console.error("[aiQuestions] Error loading situations.json:", err);
    allQuestions = [];
}

/**
 * Helper function to shuffle an array (Fisher-Yates Shuffle)
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Filters questions ensuring an EVEN distribution among selected topics.
 * @param {Object} profile - Contains { topics: ['Cyberbullying', 'Privacy'...] }
 * @returns {Array} - Top 10 matching questions (Balanced mix)
 */
export function getQuestionsForClass(profile) {
    // 1. Get the list of selected topics
    const selectedTopics = Array.isArray(profile.topics) 
        ? profile.topics 
        : (profile.focus ? [profile.focus] : []);

    if (selectedTopics.length === 0) {
        console.log("[aiQuestions] No topics selected.");
        return [];
    }

    console.log(`[aiQuestions] Balancing questions for: ${selectedTopics.join(', ')}`);

    // 2. Prepare buckets for each topic
    const TOTAL_LIMIT = 10;
    const questionsByTopic = {};

    // Group available questions by their category
    selectedTopics.forEach(topic => {
        // Filter questions for this specific topic
        const pool = allQuestions.filter(q => q.category === topic);
        // Shuffle the pool immediately so we pick random ones from this category
        questionsByTopic[topic] = shuffleArray(pool);
    });

    // 3. Calculate quota per topic
    // Example: 10 questions / 3 topics = 3 base quota per topic. Remainder = 1.
    const baseQuota = Math.floor(TOTAL_LIMIT / selectedTopics.length);
    let remainder = TOTAL_LIMIT % selectedTopics.length;

    let finalSelection = [];

    // 4. Collect questions based on quota
    selectedTopics.forEach(topic => {
        let countToTake = baseQuota;
        
        // Distribute the remainder (give 1 extra question to the first few topics)
        if (remainder > 0) {
            countToTake++;
            remainder--;
        }

        const pool = questionsByTopic[topic] || [];
        
        // Take the needed amount (or less if the pool is small)
        const selected = pool.slice(0, countToTake);
        finalSelection = finalSelection.concat(selected);
    });

    // 5. Final Shuffle
    // Mix them up so the student doesn't see "3 Privacy questions" then "3 Cyber questions" in a row
    return shuffleArray(finalSelection);
}