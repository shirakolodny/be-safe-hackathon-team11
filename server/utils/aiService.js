// server/utils/aiService.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeAnswerWithAI = async (question, studentAnswer, category) => {
  try {
    console.log(`[AI Service] Analyzing answer for category: ${category}`);

    // Using gpt-4o-mini for better cost-efficiency and intelligence compared to 3.5
    const model = "gpt-4o-mini"; 

    const prompt = `
      You are a wise and empathetic educational mentor for teenagers learning about Cyber Safety.
      Your goal is to grade the student's answer based on logic, safety, and RELEVANCE to the specific question asked.

      ---
      CONTEXT:
      Category: ${category}
      Question: "${question}"
      Student Answer: "${studentAnswer}"
      ---

      INSTRUCTIONS FOR GRADING (Follow in order):

      1. **RELEVANCE CHECK (Crucial):**
         - Does the answer actually address the specific problem posed in the question?
         - If the answer is unrelated (e.g., talking about passwords when the question is about bullying) OR is gibberish/nonsense -> Score: 0-2. Feedback: "זה לא ממש עונה על השאלה שנשאלה. נסה להתייחס ל..."
         - If the answer is "I don't know" -> Score: 0. Feedback: "נסה לחשוב מה היית עושה לו זה קרה לך..."

      2. **SAFETY & ETHICS CHECK:**
         - Does the answer suggest REVENGE, VIOLENCE, or SHAMING back?
         - If YES -> Score: 1-3. Feedback MUST validate the emotion but correct the action (e.g., "אני מבין שזה מכעיס, אבל להחזיר באותה מטבע רק יחמיר את המצב ויפגע בך. עדיף ל...").

      3. **QUALITY OF SOLUTION (If relevant and safe):**
         - **Excellent (9-10):** A smart, proactive solution that solves the specific problem (e.g., reporting, blocking, telling an adult, changing settings).
         - **Good (7-8):** A correct direction but maybe passive or missing a detail.
         - **Weak (4-6):** Too general (e.g., just saying "ignore it" when the situation requires action).

      FEEDBACK GUIDELINES:
      - **Connect to the answer:** explicitly reference what the student wrote. Don't be generic.
      - **Tone:** Conversational, encouraging, natural Hebrew. Not robotic.
      - **Length:** 1-2 sentences.

      Output strictly in JSON format:
      {
        "score": number,
        "feedback": "string"
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful grading assistant. Output valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: model,
      response_format: { type: "json_object" },
      temperature: 0.3, // Low temperature to ensure consistent grading logic
    });

    const content = completion.choices[0].message.content;
    
    // Safety check to handle cases where parsing might fail
    try {
        const result = JSON.parse(content);
        return result;
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        // Fallback in case of parsing error
        return { score: 5, feedback: "התשובה נקלטה, אך היה קושי בעיבוד המשוב האוטומטי." };
    }

  } catch (error) {
    console.error("[AI Service] Error:", error);
    // General error fallback
    return {
      score: 8, 
      feedback: "תשובה נקלטה! נמשיך לשאלה הבאה."
    };
  }
};


/**
 * Generates a pedagogical summary for the teacher based on class performance.
 * @param {Object} stats - The calculated statistics per topic.
 */
export const generateClassSummary = async (stats) => {
  try {
    // --- FIX START: Filter out unattempted topics ---
    
    // Create a new object containing only topics with a score > 0
    const activeStats = {};
    let hasActivity = false;

    if (stats) {
        for (const [topic, score] of Object.entries(stats)) {
            // We assume a score of 0 means "no answers" or "not reached yet"
            if (Number(score) > 0) {
                activeStats[topic] = score;
                hasActivity = true;
            }
        }
    }

    // If no topics have activity, return a static message immediately
    if (!hasActivity) {
        return "לא נענו עדיין שאלות בשום נושא, ולכן לא ניתן להפיק דוח פדגוגי כרגע.";
    }

    // --- FIX END ---

    const model = "gpt-4o-mini";

    const prompt = `
      You are an expert pedagogical consultant for a Cyber Safety curriculum.
      Analyze the following class performance data (Topic: Average Score out of 10).
      
      IMPORTANT: Only topics with actual data are included below. 
      Ignore any missing topics.

      Data:
      ${JSON.stringify(activeStats)}

      Your task:
      1. Identify the topics where students struggled the most (lowest scores).
      2. Provide a brief summary of the class status.
      3. Suggest 2-3 specific discussion points or activities to reinforce the weak topics.

      Output language: Hebrew (Natural, professional tone).
      Keep it concise (max 4-5 sentences).
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful teaching assistant." },
        { role: "user", content: prompt }
      ],
      model: model,
      temperature: 0.5,
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("[AI Service] Summary Error:", error);
    return "לא ניתן היה ליצור סיכום כרגע. אנא נסה שנית מאוחר יותר.";
  }
};