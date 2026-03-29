import mongoose from 'mongoose';

const frameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String },
  dimensions: { type: String },
  image: { type: String },
  clearImage: { type: String },
  shades: {
    type: Map,
    of: String // maps lens ID to image URL
  }
}, { timestamps: true });

export const Frame = mongoose.model('Frame', frameSchema);
