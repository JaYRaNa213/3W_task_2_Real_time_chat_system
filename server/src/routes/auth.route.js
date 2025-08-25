import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const router = express.Router();

function signToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });

    // Option A: require user to login after register
    // return res.json({ id: user._id, username: user.username });

    // Option B: auto-login after register
    const token = signToken({ id: user._id, username: user.username });
    return res.json({ token, username: user.username });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = signToken({ id: user._id, username });
    return res.json({ token, username });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
