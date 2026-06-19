// server/src/routes/messages.route.js
import express from "express";
import mongoose from "mongoose";
import Message from "../models/Message.model.js";
import { authMiddleware } from "../middleware/auth.js";
import { verifyConversationAccess } from "../middleware/verifyConversationAccess.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/messages/:room
// LEGACY: Get all messages in a public room
// ─────────────────────────────────────────────────────────────────────────────
router.get("/:room", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:room/messages", async (req, res, next) => {
  try {
    const { room } = req.params;
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.get("/:room/count", async (req, res, next) => {
  try {
    const { room } = req.params;
    const count = await Message.countDocuments({ room });
    res.json({ room, count });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/messages/:messageId
// Edit a conversation message (sender only)
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/:messageId", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: "Content is required" });

    const msg = await Message.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    if (msg.senderId?.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only the sender can edit this message" });
    }

    if (msg.isDeleted) return res.status(400).json({ error: "Cannot edit deleted message" });

    msg.content = content.trim();
    msg.isEdited = true;
    await msg.save();

    return res.json(msg);
  } catch (err) {
    console.error("[PATCH /messages/:id]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/messages/:messageId
// Delete a conversation message (soft delete) (sender only)
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/:messageId", authMiddleware, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    if (msg.senderId?.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only the sender can delete this message" });
    }

    msg.isDeleted = true;
    msg.content = "This message was deleted"; // scrub content
    await msg.save();

    return res.json({ message: "Message deleted", msg });
  } catch (err) {
    console.error("[DELETE /messages/:id]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
