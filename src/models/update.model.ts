import mongoose from "mongoose";

const UpdateScheme = new mongoose.Schema({
  version: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  releaseDate: {
    type: Date,
    default: Date.now
  },
  fileUrl: {
    type: String,
    required: true
  },
});

export default mongoose.model("Update", UpdateScheme)
