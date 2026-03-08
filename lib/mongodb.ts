import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URL!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGO_DB_URL in your .env file");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "shadow-founder",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
