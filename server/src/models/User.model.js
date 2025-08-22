// server/src/models/User.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true }, // hash
}, { timestamps: true });

export default mongoose.model("User", userSchema);
