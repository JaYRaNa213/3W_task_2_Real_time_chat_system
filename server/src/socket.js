// server/src/socket.js
// UPDATED: Added joinConversation, leaveConversation, sendMessage, messageRead
// KEPT:    joinRoom, chatMessage, typing, disconnect (legacy community/room chat)
// SECURITY: JWT verified for every new conversation socket event

import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { redis, joinUser, leaveUser, getRoomUsers } from "./utils/users.js";
import Message from "./models/Message.model.js";
import Conversation from "./models/Conversation.model.js";
import User from "./models/User.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Verify JWT inside socket events (never trust client)
// Returns decoded payload or null on failure.
// ─────────────────────────────────────────────────────────────────────────────
function verifySocketJWT(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Check if user has access to a conversation
// Public → always yes; private/invite_only → must be participant
// ─────────────────────────────────────────────────────────────────────────────
async function canAccessConversation(userId, conversationId) {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) return false;
  const conv = await Conversation.findById(conversationId).lean();
  if (!conv) return false;
  if (conv.visibility === "public") return true;
  return conv.participants.some((p) => p.toString() === userId);
}

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

    // ────────────────────────────────────────────────────────────────────────
    // LEGACY: joinRoom — kept for community/room backward compatibility
    // ────────────────────────────────────────────────────────────────────────
    socket.on("joinRoom", async ({ username, room }) => {
      username = String(username || "").trim();
      room = String(room || "").trim();
      if (!username || !room) return;

      if (username.toLowerCase() === "guest") {
        username = `Guest-${socket.id.slice(0, 5)}`;
      }

      socket.join(room);
      await joinUser(socket.id, username, room);

      const onlineUsers = await getRoomUsers(room);
      io.to(room).emit("onlineUsers", onlineUsers);

      socket.to(room).emit("chatMessage", {
        room,
        senderName: "System",
        text: `${username} joined`,
        createdAt: new Date().toISOString(),
      });

      // Send last 50 messages (legacy room messages)
      const messages = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      socket.emit("loadHistory", messages.reverse());
    });

    // ────────────────────────────────────────────────────────────────────────
    // LEGACY: chatMessage — kept for community/room messages
    // ────────────────────────────────────────────────────────────────────────
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

    // ────────────────────────────────────────────────────────────────────────
    // NEW: joinConversation
    // Replaces joinRoom for DM, Group, Community conversations.
    // Verifies JWT and membership before joining.
    // ────────────────────────────────────────────────────────────────────────
    socket.on("joinConversation", async ({ token, conversationId }) => {
      // 1. Verify JWT
      const user = verifySocketJWT(token);
      if (!user) {
        return socket.emit("error", { event: "joinConversation", message: "Unauthorized" });
      }

      // 2. Check access
      const hasAccess = await canAccessConversation(user.id, conversationId);
      if (!hasAccess) {
        return socket.emit("error", { event: "joinConversation", message: "Access denied" });
      }

      // 3. Join the socket room (using conversationId as room name)
      socket.join(conversationId);
      socket.conversationId = conversationId; // track for disconnect
      socket.userId = user.id;
      socket.username = user.username;

      // 4. Send last 50 messages for this conversation
      const messages = await Message.find({
        conversationId,
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("replyTo", "content senderName")
        .lean();

      socket.emit("conversationHistory", messages.reverse());

      // 5. Notify others this user is online in the conversation
      socket.to(conversationId).emit("userOnline", {
        userId: user.id,
        username: user.username,
      });

      console.log(`[Socket] ${user.username} joined conversation ${conversationId}`);
    });

    // ────────────────────────────────────────────────────────────────────────
    // NEW: leaveConversation
    // ────────────────────────────────────────────────────────────────────────
    socket.on("leaveConversation", async ({ token, conversationId }) => {
      const user = verifySocketJWT(token);
      if (!user) return;

      socket.leave(conversationId);
      socket.to(conversationId).emit("userOffline", { userId: user.id });
      console.log(`[Socket] ${user.username} left conversation ${conversationId}`);
    });

    // ────────────────────────────────────────────────────────────────────────
    // NEW: sendMessage
    // Handles DM/Group/Community message sending with access verification.
    // Payload: { token, conversationId, content, replyTo? }
    // ────────────────────────────────────────────────────────────────────────
    socket.on("sendMessage", async ({ token, conversationId, content, replyTo }) => {
      // 1. Verify JWT
      const user = verifySocketJWT(token);
      if (!user) {
        return socket.emit("error", { event: "sendMessage", message: "Unauthorized" });
      }

      // 2. Validate input
      if (!content?.trim()) {
        return socket.emit("error", { event: "sendMessage", message: "Empty message" });
      }

      // 3. Verify membership (never broadcast without check)
      const hasAccess = await canAccessConversation(user.id, conversationId);
      if (!hasAccess) {
        return socket.emit("error", { event: "sendMessage", message: "Access denied" });
      }

      // 4. Load sender's block list to prevent blocked user messages
      const senderDoc = await User.findById(user.id).select("blockedUsers").lean();

      // 5. Load conversation for block check (DM) + lastMessage update
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      // 6. For DMs, check if the other participant has blocked the sender
      if (conversation.type === "direct_message") {
        const otherId = conversation.participants.find(
          (p) => p.toString() !== user.id
        );
        if (otherId) {
          const otherDoc = await User.findById(otherId).select("blockedUsers").lean();
          const blocked =
            senderDoc?.blockedUsers?.some((id) => id.toString() === otherId.toString()) ||
            otherDoc?.blockedUsers?.some((id) => id.toString() === user.id);
          if (blocked) {
            return socket.emit("error", { event: "sendMessage", message: "User is blocked" });
          }
        }
      }

      // 7. Save message to DB
      const msgData = {
        conversationId,
        content: content.trim(),
        senderName: user.username,
        senderId: user.id,
        readBy: [user.id], // sender has read their own message
      };

      // Optional reply-to
      if (replyTo && mongoose.Types.ObjectId.isValid(replyTo)) {
        msgData.replyTo = replyTo;
      }

      const doc = await Message.create(msgData);

      // 8. Update conversation lastMessage preview
      conversation.lastMessage = {
        content: content.trim().substring(0, 100),
        senderId: user.id,
        createdAt: doc.createdAt,
      };
      await conversation.save();

      // 9. Broadcast to all in conversation room
      const message = {
        _id: doc._id.toString(),
        conversationId,
        content: doc.content,
        senderName: doc.senderName,
        senderId: doc.senderId,
        replyTo: doc.replyTo || null,
        readBy: doc.readBy,
        reactions: {},
        createdAt: doc.createdAt.toISOString(),
      };

      io.to(conversationId).emit("newMessage", message);
      console.log(`[Socket] Message in ${conversationId} from ${user.username}`);
    });

    // ────────────────────────────────────────────────────────────────────────
    // NEW: messageRead
    // Mark messages as read by the current user.
    // Payload: { token, conversationId, messageIds: [string] }
    // ────────────────────────────────────────────────────────────────────────
    socket.on("messageRead", async ({ token, conversationId, messageIds }) => {
      const user = verifySocketJWT(token);
      if (!user) return;

      if (!Array.isArray(messageIds) || messageIds.length === 0) return;

      const validIds = messageIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

      // Add user to readBy array for each message (if not already there)
      await Message.updateMany(
        {
          _id: { $in: validIds },
          conversationId,
          readBy: { $ne: user.id },
        },
        { $addToSet: { readBy: user.id } }
      );

      // Notify others in the conversation about the read receipt
      socket.to(conversationId).emit("messagesRead", {
        userId: user.id,
        messageIds: validIds,
        conversationId,
      });
    });

    // ────────────────────────────────────────────────────────────────────────
    // typing — Works for both legacy rooms and new conversations
    // Payload: { room?, conversationId?, username, isTyping, token? }
    // ────────────────────────────────────────────────────────────────────────
    socket.on("typing", ({ room, conversationId, username, isTyping, token }) => {
      // If it's a conversation event, verify token
      if (conversationId) {
        const user = verifySocketJWT(token);
        if (!user) return;
        socket.to(conversationId).emit("typing", { username: user.username, isTyping });
        return;
      }
      // Legacy room typing (no token required, matches existing behavior)
      if (room) {
        socket.to(room).emit("typing", { username, isTyping });
      }
    });

    // ────────────────────────────────────────────────────────────────────────
    // disconnect — update lastSeen + clean up both legacy and new rooms
    // ────────────────────────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      // Legacy room cleanup
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

      // Update lastSeen for authenticated users
      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });

        // Notify conversation members this user went offline
        if (socket.conversationId) {
          socket.to(socket.conversationId).emit("userOffline", {
            userId: socket.userId,
          });
        }
      }

      console.log("🔌 User disconnected:", socket.id);
    });
  });

  return io;
}
