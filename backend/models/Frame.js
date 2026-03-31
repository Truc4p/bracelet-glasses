import mongoose from 'mongoose';

const frameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dimensions: { type: String },
  description: { type: String },
  images: [{ type: String }]
}, { timestamps: true });

export const Frame = mongoose.model('Frame', frameSchema);
