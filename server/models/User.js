// server/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,  // מוודא שלא יהיו שני משתמשים עם אותו שם
    trim: true     // מוחק רווחים מיותרים בהתחלה ובסוף (כמו הפונקציה trim בקוד שלך)
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true,
    enum: ['teacher', 'student'], // (אופציונלי) מגביל את התפקידים רק למה שקיים
    default: 'student'
  },
  displayName: { 
    type: String, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);