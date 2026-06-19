// server/src/routes/invitations.route.js
// NEW ROUTE: Group invitation lifecycle — send, accept, reject, list

import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/auth.js";
import Invitation from "../models/Invitation.model.js";
import Conversation from "../models/Conversation.model.js";
import User from "../models/User.model.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/invitations
// Get all pending invitations for the logged-in user
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const invites = await Invitation.find({
      receiverId: req.user.id,
      status: "pending",
    })
      .populate("senderId", "username avatar")
      .populate("conversationId", "name type")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(invites);
  } catch (err) {
    console.error("[GET /invitations]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/invitations/send
// Send an invite to join a group conversation.
// Only group owners/members can send invites (configurable per group type).
// Blocked users and existing members are rejected.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { conversationId, receiverId, message } = req.body;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(conversationId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid conversationId or receiverId" });
    }
    if (receiverId === senderId) {
      return res.status(400).json({ error: "Cannot invite yourself" });
    }

    // Load conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || conversation.type === "direct_message") {
      return res.status(404).json({ error: "Group/Community not found" });
    }

    // Sender must be a member
    const senderIsMember = conversation.participants.some(
      (p) => p.toString() === senderId
    );
    if (!senderIsMember) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    // Check receiver exists
    const receiver = await User.findById(receiverId).lean();
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    // Block check
    const senderDoc = await User.findById(senderId).lean();
    const blocked =
      senderDoc?.blockedUsers?.some((id) => id.toString() === receiverId) ||
      receiver?.blockedUsers?.some((id) => id.toString() === senderId);
    if (blocked) {
      return res.status(403).json({ error: "Cannot invite: user is blocked" });
    }

    // Already a member?
    if (conversation.participants.some((p) => p.toString() === receiverId)) {
      return res.status(409).json({ error: "User is already a member" });
    }

    // Duplicate pending invite?
    const existing = await Invitation.findOne({
      conversationId,
      receiverId,
      status: "pending",
    });
    if (existing) {
      return res.status(409).json({ error: "Invitation already pending" });
    }

    const invite = await Invitation.create({
      conversationId,
      senderId,
      receiverId,
      message: message?.trim() || "",
    });

    const populated = await invite.populate([
      { path: "senderId",       select: "username avatar" },
      { path: "conversationId", select: "name type" },
    ]);

    return res.status(201).json(populated);
  } catch (err) {
    console.error("[POST /invitations/send]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/invitations/accept
// Accept a pending invitation → adds user to conversation participants
// ─────────────────────────────────────────────────────────────────────────────
router.post("/accept", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { invitationId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(invitationId)) {
      return res.status(400).json({ error: "Invalid invitationId" });
    }

    const invite = await Invitation.findById(invitationId);
    if (!invite) return res.status(404).json({ error: "Invitation not found" });

    // Only the receiver can accept
    if (invite.receiverId.toString() !== userId) {
      return res.status(403).json({ error: "Not your invitation" });
    }
    if (invite.status !== "pending") {
      return res.status(400).json({ error: `Invitation is already ${invite.status}` });
    }

    // Add user to conversation
    const conversation = await Conversation.findById(invite.conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (!conversation.participants.some((p) => p.toString() === userId)) {
      conversation.participants.push(userId);
      await conversation.save();
    }

    invite.status = "accepted";
    await invite.save();

    return res.json({ message: "Invitation accepted", conversationId: conversation._id });
  } catch (err) {
    console.error("[POST /invitations/accept]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/invitations/reject
// Reject a pending invitation
// ─────────────────────────────────────────────────────────────────────────────
router.post("/reject", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { invitationId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(invitationId)) {
      return res.status(400).json({ error: "Invalid invitationId" });
    }

    const invite = await Invitation.findById(invitationId);
    if (!invite) return res.status(404).json({ error: "Invitation not found" });

    if (invite.receiverId.toString() !== userId) {
      return res.status(403).json({ error: "Not your invitation" });
    }
    if (invite.status !== "pending") {
      return res.status(400).json({ error: `Invitation is already ${invite.status}` });
    }

    invite.status = "rejected";
    await invite.save();

    return res.json({ message: "Invitation rejected" });
  } catch (err) {
    console.error("[POST /invitations/reject]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
