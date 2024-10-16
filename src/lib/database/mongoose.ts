import mongoose, { Mongoose } from "mongoose";

const MONGO_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the NodeJS global interface to include the mongoose property
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  if (!MONGO_URL) throw new Error('Missing MONGODB_URL');

  try {
    cached.promise = cached.promise || mongoose.connect(MONGO_URL, { dbName: 'picgenie', bufferCommands: false });
    cached.conn = await cached.promise;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to the database');
  }

  global.mongoose = cached; // Store the connection in the global object

  return cached.conn;
};
