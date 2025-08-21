import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import createSocketServer from "./socket.js";
import roomsRouter from "./routes/rooms.route.js";
import messagesRouter from "./routes/messages.route.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));

app.get("/", (_req, res) => res.json({ ok: true, service: "chat-server" }));

app.use("/api/rooms", roomsRouter);

app.use("/api/messages", messagesRouter);

const server = http.createServer(app);
createSocketServer(server, process.env.CLIENT_ORIGIN || "http://localhost:3000");

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
