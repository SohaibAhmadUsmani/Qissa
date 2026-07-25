import mongoose from "mongoose";
import { env } from "./env.js";

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!env.MONGO_URI) {
    console.warn("MONGO_URI not set. Starting server without database connection.");
    return null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGO_URI).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    cached.promise = null;

    if (env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Starting server without database connection so development can continue.");
    return null;
  }
}
