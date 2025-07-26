import mongoose from "mongoose";
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB IS CONNECTED");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDb;
