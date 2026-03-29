import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String
}, { timestamps: true });

export const Image = mongoose.model('Image', imageSchema);
