import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import adminRoutes from './routes/admin.js';
import gamesRoutes from "./routes/games.js";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors());



// Routes
app.use('/admin', adminRoutes);
console.log("Admin routes mounted successfully");

app.use("/games", gamesRoutes);
console.log("Games routes mounted successfully");


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});