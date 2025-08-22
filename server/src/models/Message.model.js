import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true, trim: true, index: true },
    text: { type: String, trim: true },
    senderName: { type: String, trim: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional link
  },
  { timestamps: true }
);

// fast history queries: newest first
messageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
