import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI!;

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔐 2-Level Encryption Active`);
      console.log(`   Level 1: Frontend AES`);
      console.log(`   Level 2: Backend AES`);
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);

    process.exit(1);
  }
}

startServer();