// server/src/routes/users.route.js
// NEW ROUTE: User search, profile updates, and block management

import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.model.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/users/search?q=<query>
// Search users by username (partial match, case-insensitive)
// Returns: id, username, avatar, lastSeen (no password)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { q = "" } = req.query;

    if (!q.trim()) {
      // Return all users if query is empty
      const allUsers = await User.find({ _id: { $ne: req.user.id } })
        .select("username avatar lastSeen")
        .sort({ lastSeen: -1 })
        .limit(50)
        .lean();
      return res.json(allUsers);
    }

    // Sanitize: escape regex special chars
    const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const users = await User.find({
      username: { $regex: escaped, $options: "i" },
      _id: { $ne: req.user.id }, // exclude self
    })
      .select("username avatar lastSeen")
      .limit(20)
      .lean();

    return res.json(users);
  } catch (err) {
    console.error("[GET /users/search]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/users/me
// Get current user profile
// ─────────────────────────────────────────────────────────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("username avatar lastSeen blockedUsers createdAt")
      .lean();

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("[GET /users/me]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/users/profile
// Update avatar (lastSeen is auto-updated by the server)
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const { avatar } = req.body;

    const update = {};
    if (avatar != null) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      select: "username avatar lastSeen",
    });

    return res.json(user);
  } catch (err) {
    console.error("[PATCH /users/profile]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/users/block/:targetId
// Toggle block on a user. If already blocked → unblock. Else → block.
// Blocked users cannot DM, invite, or see each other.
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/block/:targetId", authMiddleware, async (req, res) => {
  try {
    const myId = req.user.id;
    const { targetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ error: "Invalid targetId" });
    }
    if (targetId === myId) {
      return res.status(400).json({ error: "Cannot block yourself" });
    }

    const me = await User.findById(myId);
    if (!me) return res.status(404).json({ error: "User not found" });

    const alreadyBlocked = me.blockedUsers.some((id) => id.toString() === targetId);

    if (alreadyBlocked) {
      // Unblock
      me.blockedUsers = me.blockedUsers.filter((id) => id.toString() !== targetId);
      await me.save();
      return res.json({ message: "User unblocked", blocked: false });
    } else {
      // Block
      me.blockedUsers.push(targetId);
      await me.save();
      return res.json({ message: "User blocked", blocked: true });
    }
  } catch (err) {
    console.error("[PATCH /users/block/:id]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
