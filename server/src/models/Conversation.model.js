// server/src/models/Conversation.model.js
// NEW MODEL: Handles DM, Group, and Community conversation types
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // Type of conversation
    type: {
      type: String,
      enum: ["direct_message", "group", "community"],
      required: true,
    },

    // Display name (required for group/community, auto-generated for DM)
    name: { type: String, trim: true, default: "" },

    // Description (for groups/communities)
    description: { type: String, trim: true, default: "" },

    // Avatar / cover image URL
    avatar: { type: String, default: "" },

    // Owner (creator) — null for DMs
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // All participants (both users for DM, members for Group/Community)
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Visibility rules:
    //  public      → anyone authenticated can join (communities)
    //  private     → invite only (groups)
    //  invite_only → same as private but explicit
    visibility: {
      type: String,
      enum: ["public", "private", "invite_only"],
      default: "private",
    },

    // Last message preview (for sidebar listing)
    lastMessage: {
      content:   { type: String, default: "" },
      senderId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      createdAt: { type: Date, default: null },
    },

    // Pinned by user IDs
    pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Muted by user IDs
    mutedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Unique constraint: only one DM per pair of users
// Enforced in application logic (not DB unique index, because array order varies)
conversationSchema.index({ type: 1, participants: 1 });

export default mongoose.model("Conversation", conversationSchema);
