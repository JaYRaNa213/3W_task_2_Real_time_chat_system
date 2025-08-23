import { useContext, useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import OnlineUsersList from "./OnlineUsersList";
import TypingIndicator from "./TypingIndicator";
import MessageList from "./MessageList";
import { SocketContext } from "../../context/SocketContext";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";

export default function ChatRoom({ me, room }) {
  const socket = useContext(SocketContext);
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Join room & setup listeners
  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) socket.connect();

    socket.emit("joinRoom", { username: me, room });

    const onLoadHistory = (history) => setMessages(history || []);

    const onChatMessage = (msg) => {
      setMessages((prev) => {
        // avoid duplicates (optimistic messages)
        if (prev.some((m) => m._id === msg._id && m.senderName === msg.senderName)) return prev;
        return [...prev, msg];
      });
      scrollToBottom();
    };

    const onOnlineUsers = (list) =>
  setOnline(list?.map((u) => ({ id: u, username: u })) || []);


    const onTyping = ({ username, isTyping }) => {
      setTypingUsers((prev) => {
        const set = new Set(prev);
        if (isTyping) set.add(username);
        else set.delete(username);
        return Array.from(set).filter((u) => u !== me);
      });
    };

    socket.on("loadHistory", onLoadHistory);
    socket.on("chatMessage", onChatMessage);
    socket.on("onlineUsers", onOnlineUsers);
    socket.on("typing", onTyping);

    return () => {
      socket.off("loadHistory", onLoadHistory);
      socket.off("chatMessage", onChatMessage);
      socket.off("onlineUsers", onOnlineUsers);
      socket.off("typing", onTyping);
      socket.disconnect();
      setMessages([]);
      setOnline([]);
      setTypingUsers([]);
    };
  }, [room, me, socket]);

  // Scroll helper
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  };

  // Handle sending message
  const send = (text) => {
    if (!text.trim() || !socket) return;

    const tempId = Date.now().toString();
    const newMsg = {
      senderName: me,
      text,
      createdAt: new Date().toISOString(),
      _id: tempId,
    };

    // Optimistically add
    setMessages((prev) => [...prev, newMsg]);
    scrollToBottom();

    // Emit to server
    socket.emit("chatMessage", { room, text, senderName: me });
  };

  // Handle typing indicator
  const onTypingChange = (isTyping) => {
    if (!socket) return;
    socket.emit("typing", { room, username: me, isTyping });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <AppBar position="sticky" color="primary" sx={{ borderRadius: 0 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6">#{room}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Signed in as {me}
            </Typography>
          </Box>
          <OnlineUsersList users={online} />
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto" }}>
        <MessageList messages={messages} me={me} />
      </Box>

      {/* Typing Indicator */}
      <Box sx={{ px: 2, pb: 1 }}>
        <TypingIndicator typingUsers={typingUsers} />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2, bgcolor: "grey.50" }}>
        <MessageInput onSend={send} onTyping={onTypingChange} />
      </Box>
    </Paper>
  );
}
