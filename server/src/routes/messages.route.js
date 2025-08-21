import express from "express";
import Message from "../models/Message.model.js";

const router = express.Router();

// POST a new message
router.post("/", async (req, res) => {
  try {
    const { room, text, senderName } = req.body;
    if (!room?.trim() || !text?.trim() || !senderName?.trim()) {
      return res.status(400).json({ error: "room, text, senderName are required" });
    }

    const message = await Message.create({ room, text: text.trim(), senderName: senderName.trim() });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all messages of a room
router.get("/:room", async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
