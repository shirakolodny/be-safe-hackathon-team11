import mongoose from 'mongoose';

const situationSchema = new mongoose.Schema({
  id: Number,
  category: String,
  title: String,
  description: String, 
  question: String,
  type: String
});

export default mongoose.model('Situation', situationSchema);