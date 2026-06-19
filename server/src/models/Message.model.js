// server/src/models/Message.model.js
// UPDATED: Added conversationId, replyTo, readBy, reactions
// Legacy fields (room, text, senderName) are KEPT for backward compatibility
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // --- Legacy fields (community/room chat) --- kept for backward compat
    room:       { type: String, trim: true, index: true },
    text:       { type: String, trim: true },
    senderName: { type: String, trim: true },
    senderId:   { type: String, trim: true }, // string kept for legacy socket.id support

    // --- New fields for DM / Group conversations ---
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", index: true },
    content:        { type: String, trim: true },     // preferred over 'text' for new messages
    replyTo:        { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    readBy:         [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // IDs of readers
    reactions:      { type: Map, of: [String], default: {} }, // emoji -> [userId]
    isEdited:       { type: Boolean, default: false },
    isDeleted:      { type: Boolean, default: false }, // soft delete
  },
  { timestamps: true }
);

// Compound index for fast conversation history queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
// Legacy room index kept
messageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
