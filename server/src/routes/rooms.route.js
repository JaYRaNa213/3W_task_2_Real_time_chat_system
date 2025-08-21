import express from "express";
import Room from "../models/Room.model.js";

const router = express.Router();

// GET all rooms
router.get("/", async (_req, res) => {
  try {
    const rooms = await Room.find({}).sort({ createdAt: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Room name required" });

    const existing = await Room.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ error: "Room already exists" });

    const room = await Room.create({ name: name.trim() });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// router.post("/", async (req, res) => {
//   try {
//     const { room, text, senderName } = req.body;
//     if (!room?.trim() || !text?.trim() || !senderName?.trim()) {
//       return res.status(400).json({ error: "room, text, senderName are required" });
//     }

//     const message = await Message.create({ room, text: text.trim(), senderName: senderName.trim() });
//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



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
