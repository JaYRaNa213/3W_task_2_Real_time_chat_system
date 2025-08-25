// server/src/index.js
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import Redis from "ioredis";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware/auth.js";
import createSocketServer from "./socket.js";
import roomsRouter from "./routes/rooms.route.js";
import messagesRouter from "./routes/messages.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// ✅ Allow multiple origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:3000",
  "https://real-time-chat-system-lyart.vercel.app",
];

const MONGO_URI =
  process.env.MONGO_URI;

const REDIS_URL =
  process.env.REDIS_URL;

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

// CORS config with whitelist
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Disable caching for API routes
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});


app.use(morgan("dev"));

// Health check
app.get("/", (_req, res) => res.json({ ok: true, service: "chat-server" }));

// Routes
app.use("/api/rooms", roomsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/auth", authRouter);

const server = http.createServer(app);

// ✅ Pass allowedOrigins to socket server
createSocketServer(server, allowedOrigins);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected");
    server.listen(PORT, () => {
      console.log(` Server listening on http://localhost:${PORT}`);
      console.log(` Allowed client origins: ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

export { redis };
