import express from "express";
import Room from "../models/Room.model.js";
import Message from "../models/Message.model.js";
import { getRoomUsers } from "../utils/users.js";

const router = express.Router();

// list rooms
router.get("/", async (_req, res, next) => {
  try {
    const rooms = await Room.find({}).sort({ createdAt: 1 });
    res.json(rooms);
  } catch (err) { next(err); }
});

// create room
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Room name required" });
    const existing = await Room.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ error: "Room already exists" });
    const room = await Room.create({ name: name.trim(), description });
    res.status(201).json(room);
  } catch (err) { next(err); }
});

// messages in room (REST alt to socket history)
router.get("/:room/messages", async (req, res, next) => {
  try {
    const { room } = req.params;
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) { next(err); }
});

// ✅ online users in a room
router.get("/:room/users", async (req, res, next) => {
  try {
    const users = await getRoomUsers(req.params.room);
    res.json(users);
  } catch (err) { next(err); }
});

export default router;
