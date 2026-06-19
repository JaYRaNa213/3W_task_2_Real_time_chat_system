// server/src/models/Invitation.model.js
// NEW MODEL: Group invite system — send/accept/reject invitations
import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    // Which conversation this invite is for (group or community)
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    // Who sent the invite
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Who receives the invite
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Invite status lifecycle
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // Optional personal message with the invite
    message: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Prevent duplicate pending invites for the same conversation + receiver
invitationSchema.index(
  { conversationId: 1, receiverId: 1, status: 1 },
  { unique: false } // handled in app logic to give better error messages
);

export default mongoose.model("Invitation", invitationSchema);
