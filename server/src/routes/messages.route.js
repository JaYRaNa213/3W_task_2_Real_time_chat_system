import express from "express";
import Message from "../models/Message.model.js";

const router = express.Router();

// Get all messages in a room
router.get("/:room", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new message (optional if using socket.io)
router.post("/", async (req, res) => {
  try {
    const { room, text, senderName } = req.body;
    if (!room || !text || !senderName) return res.status(400).json({ error: "Missing fields" });

    const message = await Message.create({ room, text, senderName });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
