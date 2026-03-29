import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Shade } from './models/Shade.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bino-foundry';

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
