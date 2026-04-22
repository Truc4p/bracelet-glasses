import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import frameRoutes from './routes/frameRoutes.js';
import crystalRoutes from './routes/crystalRoutes.js';
import typeRoutes from './routes/typeRoutes.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Use in-memory storage — files are uploaded to Cloudinary, not saved to disk
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'bracelet-glasses' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Error uploading to Cloudinary', error: error.message });
      }
      res.json({ imageUrl: result.secure_url });
    }
  );

  uploadStream.end(req.file.buffer);
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bracelet-glasses';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/frames', frameRoutes);
app.use('/api/crystals', crystalRoutes);
app.use('/api/types', typeRoutes);

app.get('/', (req, res) => {
  res.send('Bino Foundry Backend API is running! 🚀<br>Go to <a href="/api/status">/api/status</a> to see the status.');
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
