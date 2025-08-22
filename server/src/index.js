// server/src/index.js
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import Redis from "ioredis";
import dotenv from "dotenv";
import {authMiddleware }from "./middleware/auth.js";
import createSocketServer from "./socket.js";
import roomsRouter from "./routes/rooms.route.js";
import messagesRouter from "./routes/messages.route.js";
import authRouter from "./routes/auth.route.js"; // 

dotenv.config();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://jayrana0909:jay0000@religiouscluster0.kjqo7ay.mongodb.net/3W_Real_time_Chat_System_collection?retryWrites=true&w=majority";

const REDIS_URL =
  process.env.REDIS_URL ||
  "redis://default:m7tx77PBfE1AaO26VOxqXydJpHwyqJ1U@redis-17330.c61.us-east-1-3.ec2.redns.redis-cloud.com:17330";

console.log("🔗 Using Redis URL:", REDIS_URL);
const redis = new Redis(REDIS_URL, {
  retryStrategy(times) {
    console.error(`Redis retry attempt #${times}`);
    return Math.min(times * 50, 2000);
  },
});


redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

const app = express();
app.use(express.json());
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ ok: true, service: "chat-server" }));

// Routes
app.use("/api/rooms", roomsRouter);
app.use("/api/messages",authMiddleware, messagesRouter);

app.use("/api/auth", authRouter); 

const server = http.createServer(app);
createSocketServer(server, CLIENT_ORIGIN);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
      console.log(`🌐 Allowed client origin: ${CLIENT_ORIGIN}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

export { redis };
