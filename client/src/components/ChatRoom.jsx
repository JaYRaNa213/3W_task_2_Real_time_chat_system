import { useEffect, useRef, useState } from "react";
import { api } from "../api/http";
import { socket } from "../socket";
import MessageInput from "./MessageInput";
import OnlineUsersList from "./OnlineUsersList";
import TypingIndicator from "./TypingIndicator";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

export default function ChatRoom({ me, room }) {
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [typing, setTyping] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function loadHistory() {
      const { data } = await api.get(`/api/messages/${room}?limit=50`);
      setMessages(data);
      scrollToBottom();
    }
    loadHistory();
  }, [room]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", { username: me, room });

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });
    socket.on("onlineUsers", (list) => setOnline(list));
    socket.on("typing", ({ username, isTyping }) => {
      setTyping((prev) => {
        const set = new Set(prev);
        if (isTyping) set.add(username);
        else set.delete(username);
        return Array.from(set).filter((u) => u !== me);
      });
    });

    return () => {
      socket.off("chatMessage");
      socket.off("onlineUsers");
      socket.off("typing");
      socket.disconnect();
    };
  }, [room, me]);

  function send(text) {
    socket.emit("chatMessage", { room, text, senderName: me });
  }

  function onTyping(isTyping) {
    socket.emit("typing", { room, username: me, isTyping });
  }

  function scrollToBottom() {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  }

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
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <List>
          {messages.map((m, i) => {
            const mine = m.senderName === me;
            return (
              <ListItem
                key={m._id || m.createdAt + m.senderName + i}
                sx={{
                  display: "flex",
                  justifyContent: mine ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    maxWidth: "70%",
                    bgcolor: mine ? "primary.main" : "grey.200",
                    color: mine ? "white" : "text.primary",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", mb: 0.5 }}
                  >
                    {mine ? "You" : m.senderName}
                  </Typography>
                  <Typography variant="body1">{m.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "right", opacity: 0.7 }}
                  >
                    {new Date(m.createdAt || Date.now()).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Typing Indicator */}
      <Box sx={{ px: 2, pb: 1 }}>
        <TypingIndicator typing={typing} />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2, bgcolor: "grey.50" }}>
        <MessageInput onSend={send} onTyping={onTyping} />
      </Box>
    </Paper>
  );
}
