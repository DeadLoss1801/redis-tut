import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://arpitverma2410:sheela2005@cluster0.espfs10.mongodb.net/';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};