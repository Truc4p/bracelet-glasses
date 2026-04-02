import express from 'express';
import Frame from '../models/Frame.js';

const router = express.Router();

// GET all frames
router.get('/', async (req, res) => {
  try {
    const frames = await Frame.find({});
    res.json(frames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single frame by ID
router.get('/:id', async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.id);
    if (!frame) {
      return res.status(404).json({ message: 'Frame not found' });
    }
    res.json(frame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new frame
router.post('/', async (req, res) => {
  try {
    const newFrame = new Frame(req.body);
    const savedFrame = await newFrame.save();
    res.status(201).json(savedFrame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a frame
router.put('/:id', async (req, res) => {
  try {
    const updatedFrame = await Frame.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedFrame) {
      return res.status(404).json({ message: 'Frame not found' });
    }
    res.json(updatedFrame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a frame
router.delete('/:id', async (req, res) => {
  try {
    const deletedFrame = await Frame.findByIdAndDelete(req.params.id);
    if (!deletedFrame) {
      return res.status(404).json({ message: 'Frame not found' });
    }
    res.json({ message: 'Frame deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
