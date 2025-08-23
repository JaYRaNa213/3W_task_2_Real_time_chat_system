import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, trim: true, index: true },
    text: { type: String, trim: true },
    senderName: { type: String, trim: true },
    senderId: { type: String, trim: true }, // can store socket.id or real user ID
  },
  { timestamps: true }
);

messageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
