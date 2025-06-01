import mongoose, { Mongoose } from "mongoose";

const rawUri = process.env.MONGODB_URL;

if (!rawUri) {
  throw new Error("Please define the MONGODB_URL environment variable.");
}

const MONGODB_URL: string = rawUri; // Now guaranteed to be string

interface GlobalMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var _mongoose: GlobalMongoose | undefined;
}

const globalCache: GlobalMongoose = global._mongoose ?? {
  conn: null,
  promise: null,
};

async function connectDB(): Promise<Mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
      ssl: true,
      retryWrites: true,
      serverSelectionTimeoutMS: 10000,
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
