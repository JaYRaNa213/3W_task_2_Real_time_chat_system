// socket.js
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { redis, joinUser, leaveUser, getRoomUsers } from "./utils/users.js";
import Message from "./models/Message.model.js";

export default function createSocketServer(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, methods: ["GET", "POST"] },
  });

  // Setup Redis adapter if Redis is available
  if (redis) {
    const pubClient = redis;
    const subClient = redis.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    console.log("✅ Socket.io Redis adapter connected");
  } else {
    console.log("⚡ Using local in-memory storage for users");
  }

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Join room
    socket.on("joinRoom", async ({ username, room }) => {
      username = String(username || "").trim();
      room = String(room || "").trim();
      if (!username || !room) return;

      // Force unique guest names if duplicate
      if (username.toLowerCase() === "guest") {
        username = `Guest-${socket.id.slice(0, 5)}`;
      }

      socket.join(room);
      await joinUser(socket.id, username, room);

      // Emit updated users
      const onlineUsers = await getRoomUsers(room);
      io.to(room).emit("onlineUsers", onlineUsers);

      socket.to(room).emit("chatMessage", {
        room,
        senderName: "System",
        text: `${username} joined`,
        createdAt: new Date().toISOString(),
      });

      // Send last 50 messages
      const messages = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      socket.emit("loadHistory", messages.reverse());
    });

    // Handle chat messages
    socket.on("chatMessage", async ({ room, text, senderName, senderId }) => {
      if (!text?.trim() || !room?.trim() || !senderName?.trim()) return;

      const doc = await Message.create({
        room: room.trim(),
        text: text.trim(),
        senderName: senderName.trim(),
        senderId: senderId || socket.id,
      });

      const message = {
        _id: doc._id.toString(),
        room: doc.room,
        text: doc.text,
        senderName: doc.senderName,
        senderId: doc.senderId,
        createdAt: doc.createdAt.toISOString(),
      };

      io.to(room).emit("chatMessage", message);
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      const left = await leaveUser(socket.id);
      if (left?.room) {
        const { room, username } = left;

        const onlineUsers = await getRoomUsers(room);
        io.to(room).emit("onlineUsers", onlineUsers);

        socket.to(room).emit("chatMessage", {
          room,
          senderName: "System",
          text: `${username} left`,
          createdAt: new Date().toISOString(),
        });
      }
    });
  });

  return io;
}
