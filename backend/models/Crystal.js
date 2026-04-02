import mongoose from 'mongoose';

const crystalSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ""
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type'
  },
  description: {
    type: String,
    trim: true,
    default: ""
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      // we already have ret.id
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Crystal = mongoose.model('Crystal', crystalSchema);

export default Crystal;
