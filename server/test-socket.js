// server/test-socket.js
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:5000";
const ROOM_ID = "room1";
const NUM_USERS = 10; // number of simulated users
const MESSAGE_INTERVAL = 3000; // ms

const users = [];

// Helper to generate random usernames
const randomUsername = () => `User${Math.floor(Math.random() * 1000)}`;

for (let i = 0; i < NUM_USERS; i++) {
  const username = randomUsername();
  const socket = io(SERVER_URL);

  socket.on("connect", () => {
    console.log(`✅ ${username} connected: ${socket.id}`);

    // ✅ Fixed: use "room" instead of "roomId"
    socket.emit("joinRoom", { room: ROOM_ID, username });
    console.log(`➡️ ${username} joined room: ${ROOM_ID}`);

    // Start sending messages periodically
    let msgCount = 1;
    const msgInterval = setInterval(() => {
      const text = `Hello from ${username} #${msgCount++}`;
      // ✅ Fixed: use "room", "text", "senderName"
      socket.emit("chatMessage", {
        room: ROOM_ID,
        text,
        senderName: username,
      });
      console.log(`💬 ${username} sent: "${text}"`);
    }, MESSAGE_INTERVAL);

    // Typing simulation (✅ use correct payload)
    const typingInterval = setInterval(() => {
      socket.emit("typing", { room: ROOM_ID, username, isTyping: true });
      console.log(`⌨️ ${username} typing...`);
      setTimeout(() => {
        socket.emit("typing", { room: ROOM_ID, username, isTyping: false });
        console.log(`⌨️ ${username} stopped typing`);
      }, 1000);
    }, MESSAGE_INTERVAL * 2);

    // Listen for chat messages from others
    socket.on("chatMessage", (data) => {
      console.log(`📨 ${username} received:`, data);
    });

    // Listen for online users
    socket.on("onlineUsers", (data) => {
      console.log(`🟢 ${username} online users:`, data);
    });

    // Save user with both intervals
    users.push({ username, socket, msgInterval, typingInterval });
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${username} disconnected`);
  });
}

// Later, disconnect all users after 30 seconds
setTimeout(() => {
  users.forEach(({ username, socket, msgInterval, typingInterval }) => {
    clearInterval(msgInterval);
    clearInterval(typingInterval);
    socket.disconnect();
    console.log(`🛑 ${username} disconnected`);
  });
}, 30000);
