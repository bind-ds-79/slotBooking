import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error(" Please add your Mongo URI in .env.local");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log(" MongoDB already connected");
      return;
    }

    await mongoose.connect(MONGO_URI, {
      dbName: "slot-book", 
    });

    console.log(" MongoDB connected successfully");
    console.log("Connection state:", mongoose.connection.readyState); 
   
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    throw error;
  }
};
