import "server-only"

import mongoose from 'mongoose';
mongoose.set('autoIndex', false);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mymenu';

let isConnected: boolean = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
}
