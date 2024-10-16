import mongoose, {Mongoose} from "mongoose";

const MONGO_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn:  Mongoose | null;
  promise: Promise<Mongoose> | null;

}

let cached: MongooseConnection = (global as any).mongoose

if(!cached){
  cached = (global as any).mongoose = {
    conn: null, promise: null
  }
}

export const connectToDatabase = async ()=>{
  if(cached.conn) return cached.conn;
  if(!MONGO_URL) throw new Error('Missing MONGODB_URL');

  try {
    cached.promise = cached.promise || mongoose.connect(MONGO_URL, { dbName: 'picgenie', bufferCommands: false });
    cached.conn = await cached.promise;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to the database');
  }
  return cached.conn;
}