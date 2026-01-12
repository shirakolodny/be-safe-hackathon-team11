import mongoose from 'mongoose';

// 1. תבנית עזר לשאלה (נשאר אותו דבר)
const QuestionSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, default: 'open_question' }
}, { _id: false });


// --- השינוי הגדול הוא כאן ---
// הגדרת מבנה הניקוד לנושא בודד
const TopicScoreSchema = new mongoose.Schema({
    total: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
}, { _id: false }); // _id: false חוסך מקום ב-DB, אנחנו לא צריכים ID לכל ציון


// 2. תבנית עזר לתלמיד (Submission)
const StudentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    
    // שינוי: מפה שמכילה את המבנה החדש שהגדרנו למעלה
    // המפתח יהיה שם הנושא (למשל 'Privacy'), והערך יהיה { total, count }
    scoresByTopic: { 
        type: Map, 
        of: TopicScoreSchema, 
        default: {} 
    }, 
    
    answeredIds: [Number], 
    
    questionsQueue: [QuestionSchema], 
    
    finished: { type: Boolean, default: false },
    finalScore: { type: Number, default: 0 }
});


// 3. המודל הראשי של המשחק (Game) - ללא שינוי
const GameSchema = new mongoose.Schema({
    gameCode: { type: String, required: true, unique: true },
    topics: [String],
    isActive: { type: Boolean, default: true },
    questions: [QuestionSchema],
    submissions: [StudentSchema]
}, { timestamps: true });

export default mongoose.model('Game', GameSchema);