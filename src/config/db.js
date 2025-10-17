const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the provided URI.
 */
const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI in config.env.');
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    console.log('[db] MongoDB connected');
  } catch (error) {
    console.error('[db] Mongo connection error:', error.message);
    throw error;
  }
};

module.exports = connectDB;
