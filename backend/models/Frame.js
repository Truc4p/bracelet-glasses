import mongoose from 'mongoose';

const lensColorSchema = new mongoose.Schema({
  colorName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

const frameSchema = new mongoose.Schema({
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
  description: {
    type: String,
    trim: true
  },
  frameImages: [{
    type: String
  }],
  lensColors: [lensColorSchema]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Frame = mongoose.model('Frame', frameSchema);

export default Frame;
