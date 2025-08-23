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

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", { username: me, room });

    const onLoadHistory = (history) => setMessages(history || []);

    const onChatMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id && m.senderName === msg.senderName)) return prev;
        return [...prev, msg];
      });
      scrollToBottom();
    };

    const onOnlineUsers = (list) => {
      setOnline(Array.isArray(list) ? list : []);
    };

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
    };
  }, [room, me, socket]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  };

    const send = (text) => {
    if (!text.trim() || !socket) return;

    socket.emit("chatMessage", { room, text, senderName: me });
  };


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

      <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto" }}>
        <MessageList messages={messages} me={me} />
      </Box>

      <Box sx={{ px: 2, pb: 1 }}>
        <TypingIndicator typingUsers={typingUsers} />
      </Box>

      <Divider />

      <Box sx={{ p: 2, bgcolor: "grey.50" }}>
        <MessageInput onSend={send} onTyping={onTypingChange} />
      </Box>
    </Paper>
  );
}
