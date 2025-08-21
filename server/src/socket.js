import { Server } from "socket.io";
import Message from "./models/Message.model.js";
import { joinUser, leaveUser, getRoomUsers } from "./utils/users.js";

export default function createSocketServer(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room
    socket.on("joinRoom", async ({ username, room }) => {
      username = String(username || "").trim();
      room = String(room || "").trim();
      if (!username || !room) return;

      socket.join(room);
      joinUser(socket.id, username, room);

      // Emit online users
      io.to(room).emit("onlineUsers", getRoomUsers(room));

      // Optional system message
      socket.to(room).emit("chatMessage", {
        room,
        senderName: "System",
        text: `${username} joined`,
        createdAt: new Date().toISOString(),
      });

      // Load last 50 messages and send to this client
      const messages = await Message.find({ room }).sort({ createdAt: 1 }).limit(50);
      socket.emit("loadHistory", messages);
    });

    // Broadcast chat message
    socket.on("chatMessage", async ({ room, text, senderName }) => {
      if (!text?.trim() || !room?.trim() || !senderName?.trim()) return;
      const doc = await Message.create({ room, text: text.trim(), senderName: senderName.trim() });
      io.to(room).emit("chatMessage", doc);
    });

    // Typing indicator
    socket.on("typing", ({ room, username, isTyping }) => {
      if (!room) return;
      socket.to(room).emit("typing", { username, isTyping: !!isTyping });
    });

    // Disconnect
    socket.on("disconnect", () => {
      const left = leaveUser(socket.id);
      if (left?.room) {
        const { room, username } = left;
        io.to(room).emit("onlineUsers", getRoomUsers(room));
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
