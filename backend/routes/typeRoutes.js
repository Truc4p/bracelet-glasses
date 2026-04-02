import express from 'express';
import Type from '../models/Type.js';

const router = express.Router();

// GET all types
router.get('/', async (req, res) => {
  try {
    const types = await Type.find({});
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET type by id
router.get('/:id', async (req, res) => {
  try {
    let type = await Type.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Type not found' });
    }
    res.json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new type
router.post('/', async (req, res) => {
  const type = new Type({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newType = await type.save();
    res.status(201).json(newType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update type
router.put('/:id', async (req, res) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type not found' });

    if (req.body.name !== undefined) type.name = req.body.name;
    if (req.body.description !== undefined) type.description = req.body.description;

    const updatedType = await type.save();
    res.json(updatedType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE type
router.delete('/:id', async (req, res) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type not found' });

    await Type.deleteOne({ _id: req.params.id });
    res.json({ message: 'Type removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;