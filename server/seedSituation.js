import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// import situationsModels from "../models/Situation.js";
import situationsModels from "./models/Situation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const situations = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "situations.json"),
    "utf-8"
  )
);

// const MONGO_URI = process.env.MONGO_URI;
const MONGO_URI="mongodb+srv://admin:12124545@safetyprojectdb.skprjgw.mongodb.net/?appName=SafetyProjectDB"

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    await situationsModels.deleteMany();
    console.log("🧹 Collection cleaned");

    await situationsModels.insertMany(situations);
    console.log("🌱 Situations seeded successfully");

    // process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    // process.exit(1);
  }
}

seedDB();