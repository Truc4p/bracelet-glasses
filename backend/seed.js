import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Shade } from './models/Shade.js';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bino-foundry';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Read the original json file
    const shadeMapPath = join(__dirname, 'shadeMap.json');
    const rawData = fs.readFileSync(shadeMapPath, 'utf-8');
    const shadeMap = JSON.parse(rawData);

    // Clear existing data
    await Shade.deleteMany({});
    console.log('Cleared existing shades');

    // Prepare data for insertion
    const dataToInsert = Object.keys(shadeMap).map((baseColor) => ({
      baseColor,
      lenses: shadeMap[baseColor],
    }));

    await Shade.insertMany(dataToInsert);
    console.log('Successfully seeded database with shadeMap data');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
