import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import adminRoutes from './routes/admin.js';
import gamesRoutes from "./routes/games.js";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors());

// ... אחרי ה-imports ...

console.log("⏳ Attempting to connect to MongoDB...");

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ Connected to MongoDB");
//     return; // <--- הוספתי את זה כדי להשתיק את שגיאת ה-then
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err.message);
//   });

mongoose.connect(process.env.MONGO_URI, { dbName: 'test' }) // <--- הוספתי את זה
  .then(() => {
    console.log("✅ Connected to MongoDB (test database)");
    return; // <--- הוספתי את זה כדי להשתיק את שגיאת ה-then
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ... המשך הקוד ...

// Routes
app.use('/admin', adminRoutes);
console.log("Admin routes mounted successfully");

app.use("/games", gamesRoutes);
console.log("Games routes mounted successfully");


// Start server
const PORT = process.env.PORT ||5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});