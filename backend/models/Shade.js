import mongoose from 'mongoose';

const shadeSchema = new mongoose.Schema({
  baseColor: {
    type: String,
    required: true,
    unique: true
  },
  lenses: {
    type: Map,
    of: String
  }
}, { timestamps: true });

export const Shade = mongoose.model('Shade', shadeSchema);
