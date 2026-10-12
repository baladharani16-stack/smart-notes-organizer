import mongoose from 'mongoose';

/**
 * Global cache for MongoDB connection across serverless invocations.
 * In serverless environments (like Vercel), module scope persists across warm invocations.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI is not defined in environment variables. Database features will be unavailable until configured.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('🔄 [MongoDB] Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log('✅ [MongoDB] Connected successfully to MongoDB Atlas');
      return m;
    }).catch((err) => {
      console.error('❌ [MongoDB] Connection error:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}

export default connectDB;
