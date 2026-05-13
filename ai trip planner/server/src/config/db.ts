import mongoose from 'mongoose';
import { env } from './env';

export async function connectDb() {
  if (!env.mongoUri) {
    console.warn('MONGO_URI not set, skipping MongoDB connection.');
    return;
  }

  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB');
}

