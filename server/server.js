import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';

import rubberDuckRoutes from './routes/rubberDucks.js'; // Import the routes
import adminRoutes from './routes/admin.js';



const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));


// Routes
app.use('/ducks', rubberDuckRoutes);
app.use('/admin', adminRoutes);
console.log("admin routes mounted");

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});