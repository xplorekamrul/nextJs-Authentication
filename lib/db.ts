import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("Please define the MONGODB_URL environment variable.");
}

// Extend global to include _mongoose cache
interface GlobalMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // Avoid global var redeclaration
  var _mongoose: GlobalMongoose | undefined;
}

const globalCache: GlobalMongoose = global._mongoose ?? {
  conn: null,
  promise: null,
};

async function connectDB(): Promise<Mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URL as string, {
      bufferCommands: false,
      // Add ssl: false only if using local MongoDB and SSL issues exist
      // ssl: false,
    });
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (err) {
    globalCache.promise = null;
    throw err;
  }

  global._mongoose = globalCache;
  return globalCache.conn;
}

export default connectDB;
