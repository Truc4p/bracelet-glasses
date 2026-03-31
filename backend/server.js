import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import { Shade } from './models/Shade.js';
import { Image } from './models/Image.js';
import { Frame } from './models/Frame.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bino-foundry';

// Multer storage configuration using memory storage for direct MongoDB upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Bino Foundry Backend API is running! 🚀<br>Go to <a href="/api/shades">/api/shades</a> to see the data.');
});

app.get('/api/shades', async (req, res) => {
  try {
    const shades = await Shade.find({});
    // Format to match the original JSON structure
    const shadeMap = {};
    shades.forEach(shade => {
      // transform Map to plain object, handle null defaults
      const lensesObj = Object.fromEntries(shade.lenses);
      shadeMap[shade.baseColor] = lensesObj;
    });
    res.json(shadeMap);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shades', error: error.message });
  }
});

// Frames Endpoints
app.get('/api/frames', async (req, res) => {
  try {
    const frames = await Frame.find({});
    res.json(frames);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching frames', error: error.message });
  }
});

app.post('/api/frames', async (req, res) => {
  try {
    const newFrame = new Frame(req.body);
    await newFrame.save();
    res.status(201).json(newFrame);
  } catch (error) {
    res.status(500).json({ message: 'Error saving frame', error: error.message });
  }
});

app.put('/api/frames/:id', async (req, res) => {
  try {
    const updated = await Frame.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating frame', error: error.message });
  }
});

app.delete('/api/frames/:id', async (req, res) => {
  try {
    const frame = await Frame.findOne({ id: req.params.id });
    if (!frame) return res.status(404).json({ message: 'Frame not found' });

    // Helper to extract MongoDB ObjectId from the image URL
    const extractImageId = (url) => {
      if (!url) return null;
      const match = url.match(/\/api\/images\/([a-f0-9]{24})$/i);
      return match ? match[1] : null;
    };

    const imageIdsToDelete = [];
    
    if (frame.images && Array.isArray(frame.images)) {
      for (const url of frame.images) {
        const id = extractImageId(url);
        if (id) imageIdsToDelete.push(id);
      }
    }

    // Delete the associated images from the Image collection
    if (imageIdsToDelete.length > 0) {
      await Image.deleteMany({ _id: { $in: imageIdsToDelete } });
    }

    // Finally delete the frame itself
    await Frame.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting frame', error: error.message });
  }
});

// Image Upload Endpoint (saves directly to MongoDB)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  try {
    const newImage = new Image({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });
    
    const savedImage = await newImage.save();
    
    // Base URL calculation
    const backendUrl = process.env.VITE_BACKEND_URL || `http://localhost:${PORT}`;
    const imageUrl = `${backendUrl}/api/images/${savedImage._id}`;
    
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error saving image to MongoDB:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

// GET Image Endpoint
app.get('/api/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).send('Image not found');
    }
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    res.status(500).send('Error retrieving image');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
