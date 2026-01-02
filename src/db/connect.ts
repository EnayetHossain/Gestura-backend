import mongoose from "mongoose";

const connectDB = (url: string): Promise<mongoose.Mongoose> => {
  return mongoose.connect(url)
}

export default connectDB;
