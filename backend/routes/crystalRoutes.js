import express from 'express';
import Crystal from '../models/Crystal.js';

const router = express.Router();

// GET all crystals
router.get('/', async (req, res) => {
  try {
    const crystals = await Crystal.find({});
    res.json(crystals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET crystal by id
router.get('/:id', async (req, res) => {
  try {
    let crystal = await Crystal.findOne({ id: req.params.id });
    if (!crystal) {
      return res.status(404).json({ message: 'Crystal not found' });
    }
    res.json(crystal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new crystal
router.post('/', async (req, res) => {
  const crystal = new Crystal({
    id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    description: req.body.description,
  });

  try {
    const newCrystal = await crystal.save();
    res.status(201).json(newCrystal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update crystal
router.put('/:id', async (req, res) => {
  try {
    const crystal = await Crystal.findOne({ id: req.params.id });
    if (!crystal) return res.status(404).json({ message: 'Crystal not found' });

    if (req.body.name) crystal.name = req.body.name;
    if (req.body.price != null) crystal.price = req.body.price;
    if (req.body.image !== undefined) crystal.image = req.body.image;
    if (req.body.description !== undefined) crystal.description = req.body.description;

    const updatedCrystal = await crystal.save();
    res.json(updatedCrystal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE crystal
router.delete('/:id', async (req, res) => {
  try {
    const crystal = await Crystal.findOne({ id: req.params.id });
    if (!crystal) return res.status(404).json({ message: 'Crystal not found' });

    await Crystal.deleteOne({ id: req.params.id });
    res.json({ message: 'Crystal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
