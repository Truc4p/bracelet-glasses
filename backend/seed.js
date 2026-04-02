import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Frame from './models/Frame.js';
import Crystal from './models/Crystal.js';

dotenv.config({ path: '../.env' }); // Make sure we read from root .env if it is situated there

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bino-foundry';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing frames for a fresh start (optional, be careful in production!)
    // await Frame.deleteMany({});
    
    const sampleFrame = new Frame({
      name: 'Classic Aviator',
      price: 120.00,
      description: 'Timeless aviator styling with premium metal construction.',
      frameImages: [
        'https://example.com/images/aviator-front.jpg',
        'https://example.com/images/aviator-side.jpg'
      ],
      lensColors: [
        {
          colorName: 'Midnight Black',
          image: 'https://example.com/images/aviator-black-lens.jpg'
        },
        {
          colorName: 'Ocean Blue',
          image: 'https://example.com/images/aviator-blue-lens.jpg'
        }
      ]
    });

    await sampleFrame.save();
    console.log('Sample frame successfully saved to MongoDB Atlas!');

    // Clear existing crystals for a fresh start
    // await Crystal.deleteMany({});

    const sampleCrystal = new Crystal({
      name: 'Amethyst',
      price: 3.50,
      image: '/crystals/amethyst.svg',
      description: 'A violet variety of quartz. Known for calming energy.',
    });

    await sampleCrystal.save();
    console.log('Sample crystal successfully saved to MongoDB Atlas!');

    // Disconnect when done
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
};

seedDatabase();
