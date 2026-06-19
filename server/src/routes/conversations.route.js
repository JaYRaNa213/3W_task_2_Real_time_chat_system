// server/src/routes/conversations.route.js
// NEW ROUTE: DM, Group, Community conversation management
// All routes require JWT. Access-sensitive ones use verifyConversationAccess.

import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/auth.js";
import { verifyConversationAccess } from "../middleware/verifyConversationAccess.js";
import Conversation from "../models/Conversation.model.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/conversations
// Returns all conversations the logged-in user participates in
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username avatar lastSeen")
      .sort({ "lastMessage.createdAt": -1, updatedAt: -1 })
      .lean();

    return res.json(conversations);
  } catch (err) {
    console.error("[GET /conversations]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/conversations/dm
// Start or return an existing DM between two users.
// Unique rule: only one DM per pair. Blocked users cannot DM each other.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/dm", authMiddleware, async (req, res) => {
  try {
    const myId = req.user.id;
    const { targetUserId } = req.body;

    // Validate target
    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ error: "Invalid targetUserId" });
    }
    if (targetUserId === myId) {
      return res.status(400).json({ error: "Cannot DM yourself" });
    }

    // Load both users to check block list
    const [me, target] = await Promise.all([
      User.findById(myId).lean(),
      User.findById(targetUserId).lean(),
    ]);
    if (!target) return res.status(404).json({ error: "User not found" });

    // Block check (mutual)
    const iBlockedThem = me?.blockedUsers?.some((id) => id.toString() === targetUserId);
    const theyBlockedMe = target?.blockedUsers?.some((id) => id.toString() === myId);
    if (iBlockedThem || theyBlockedMe) {
      return res.status(403).json({ error: "Cannot start DM: user is blocked" });
    }

    // Find existing DM between the two users
    const existing = await Conversation.findOne({
      type: "direct_message",
      participants: { $all: [myId, targetUserId], $size: 2 },
    }).populate("participants", "username avatar lastSeen");

    if (existing) return res.json(existing);

    // Create new DM
    const dm = await Conversation.create({
      type: "direct_message",
      name: "",          // no display name for DMs (use peer's username in UI)
      ownerId: null,
      participants: [myId, targetUserId],
      visibility: "private",
    });

    const populated = await dm.populate("participants", "username avatar lastSeen");
    return res.status(201).json(populated);
  } catch (err) {
    console.error("[POST /conversations/dm]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/conversations/group
// Create a new invite-only group. Creator is added as participant + owner.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/group", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, description, participantIds = [] } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }

    // Validate participant IDs
    const validParticipants = participantIds.filter(
      (id) => mongoose.Types.ObjectId.isValid(id) && id !== ownerId
    );

    // Ensure owner is always included
    const participants = [ownerId, ...validParticipants];

    const group = await Conversation.create({
      type: "group",
      name: name.trim(),
      description: description?.trim() || "",
      ownerId,
      participants,
      visibility: "invite_only",
    });

    const populated = await group.populate("participants", "username avatar");
    return res.status(201).json(populated);
  } catch (err) {
    console.error("[POST /conversations/group]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/conversations/community
// Create a public community channel. Authenticated users can join.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/community", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Community name is required" });
    }

    const existing = await Conversation.findOne({
      type: "community",
      name: name.trim(),
    });
    if (existing) {
      return res.status(409).json({ error: "Community already exists" });
    }

    const community = await Conversation.create({
      type: "community",
      name: name.trim(),
      description: description?.trim() || "",
      ownerId,
      participants: [ownerId],
      visibility: "public",
    });

    return res.status(201).json(community);
  } catch (err) {
    console.error("[POST /conversations/community]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/conversations/communities
// List all public community conversations (no auth needed to browse)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/communities", authMiddleware, async (req, res) => {
  try {
    const communities = await Conversation.find({ type: "community", visibility: "public" })
      .select("name description avatar participants createdAt")
      .sort({ createdAt: 1 })
      .lean();
    return res.json(communities);
  } catch (err) {
    console.error("[GET /conversations/communities]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/conversations/:conversationId/join
// Join a public community (any authenticated user)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/:conversationId/join", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: "Invalid conversationId" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ error: "Not found" });

    if (conversation.visibility !== "public") {
      return res.status(403).json({ error: "Not a public community" });
    }

    // Add user if not already a member
    if (!conversation.participants.some((p) => p.toString() === userId)) {
      conversation.participants.push(userId);
      await conversation.save();
    }

    return res.json({ message: "Joined", conversationId });
  } catch (err) {
    console.error("[POST /conversations/:id/join]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/conversations/:conversationId/messages
// Load message history for a conversation (paginated, newest first)
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  "/:conversationId/messages",
  verifyConversationAccess, // verifies JWT + membership
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      const before = req.query.before; // cursor-based pagination

      const query = { conversationId, isDeleted: false };
      if (before && mongoose.Types.ObjectId.isValid(before)) {
        query._id = { $lt: before };
      }

      const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("replyTo", "content senderName")
        .lean();

      return res.json(messages.reverse()); // return chronological order
    } catch (err) {
      console.error("[GET /conversations/:id/messages]", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/conversations/:conversationId
// Update group name/description/avatar (owner only)
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  "/:conversationId",
  verifyConversationAccess,
  async (req, res) => {
    try {
      const conversation = req.conversation;
      const userId = req.user.id;

      // Only the owner can update
      if (conversation.ownerId?.toString() !== userId) {
        return res.status(403).json({ error: "Only the owner can update this conversation" });
      }

      const { name, description, avatar } = req.body;
      if (name?.trim())        conversation.name = name.trim();
      if (description != null) conversation.description = description.trim();
      if (avatar != null)      conversation.avatar = avatar;

      await conversation.save();
      return res.json(conversation);
    } catch (err) {
      console.error("[PATCH /conversations/:id]", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/conversations/:conversationId/members
// Add or remove participants (owner only for groups)
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  "/:conversationId/members",
  verifyConversationAccess,
  async (req, res) => {
    try {
      const conversation = req.conversation;
      const userId = req.user.id;
      const { action, memberId } = req.body; // action: "add" | "remove"

      if (!["add", "remove"].includes(action) || !mongoose.Types.ObjectId.isValid(memberId)) {
        return res.status(400).json({ error: "Invalid action or memberId" });
      }

      // Only owner can add/remove (for groups)
      if (conversation.type === "group" && conversation.ownerId?.toString() !== userId) {
        return res.status(403).json({ error: "Only the owner can manage members" });
      }

      if (action === "add") {
        if (!conversation.participants.some((p) => p.toString() === memberId)) {
          conversation.participants.push(memberId);
        }
      } else {
        // Cannot remove the owner
        if (memberId === conversation.ownerId?.toString()) {
          return res.status(400).json({ error: "Cannot remove the group owner" });
        }
        conversation.participants = conversation.participants.filter(
          (p) => p.toString() !== memberId
        );
      }

      await conversation.save();
      return res.json(conversation);
    } catch (err) {
      console.error("[PATCH /conversations/:id/members]", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/conversations/:conversationId
// Delete conversation (owner only; for DMs, either participant can delete)
// ─────────────────────────────────────────────────────────────────────────────
router.delete(
  "/:conversationId",
  verifyConversationAccess,
  async (req, res) => {
    try {
      const conversation = req.conversation;
      const userId = req.user.id;

      const canDelete =
        conversation.type === "direct_message"
          ? conversation.participants.some((p) => p.toString() === userId)
          : conversation.ownerId?.toString() === userId;

      if (!canDelete) {
        return res.status(403).json({ error: "Not authorized to delete" });
      }

      // Soft-delete all messages
      await Message.updateMany(
        { conversationId: conversation._id },
        { isDeleted: true }
      );
      await conversation.deleteOne();

      return res.json({ message: "Conversation deleted" });
    } catch (err) {
      console.error("[DELETE /conversations/:id]", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/conversations/:conversationId/pin
// Toggle pin for the current user
// ─────────────────────────────────────────────────────────────────────────────
router.post("/:conversationId/pin", verifyConversationAccess, async (req, res) => {
  try {
    const conversation = req.conversation;
    const userId = req.user.id;

    const isPinned = conversation.pinnedBy?.some((id) => id.toString() === userId);
    if (isPinned) {
      conversation.pinnedBy = conversation.pinnedBy.filter((id) => id.toString() !== userId);
    } else {
      conversation.pinnedBy.push(userId);
    }
    await conversation.save();
    return res.json({ pinned: !isPinned });
  } catch (err) {
    console.error("[POST /conversations/:id/pin]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/conversations/:conversationId/mute
// Toggle mute for the current user
// ─────────────────────────────────────────────────────────────────────────────
router.post("/:conversationId/mute", verifyConversationAccess, async (req, res) => {
  try {
    const conversation = req.conversation;
    const userId = req.user.id;

    const isMuted = conversation.mutedBy?.some((id) => id.toString() === userId);
    if (isMuted) {
      conversation.mutedBy = conversation.mutedBy.filter((id) => id.toString() !== userId);
    } else {
      conversation.mutedBy.push(userId);
    }
    await conversation.save();
    return res.json({ muted: !isMuted });
  } catch (err) {
    console.error("[POST /conversations/:id/mute]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
