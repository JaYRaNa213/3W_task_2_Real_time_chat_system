import { useContext, useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { SocketContext } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom"; // if React Router
import {
  Box,
  Typography,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Collapse,
  useMediaQuery,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function ChatRoom({ me, room,onBack }) {
  const socket = useContext(SocketContext);
  const scrollRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const navigate = useNavigate();

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
    const onOnlineUsers = (list) => setOnline(Array.isArray(list) ? list : []);
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

  const isPrevSameUser = (index) => {
    if (index === 0) return false;
    return messages[index - 1].senderName === messages[index].senderName;
  };

  return (
    <Paper
      elevation={6}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "#fdfdfd",
      }}
    >
      {/* HEADER */}
      <AppBar
        position="sticky"
        sx={{
          borderRadius: 0,
          background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={onBack} size="small">
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={600}>
              #{room}
            </Typography>
            <Typography
              variant="body2"
              sx={{ opacity: 0.8, ml: 1, fontSize: isMobile ? 11 : 13 }}
            >
              Signed in as {me}
            </Typography>
          </Box>

          <IconButton
            color="inherit"
            onClick={() => setSidebarOpen((prev) => !prev)}
            size="medium"
          >
            <PeopleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* MAIN CONTENT */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* CHAT MESSAGES */}
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: isMobile ? 1.2 : 2,
            bgcolor: "#f4f6fb",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg, index) => {
            const isMe = msg.senderName === me;
            const prevSameUser = isPrevSameUser(index);
            const altBg = !isMe && index % 2 === 0 ? "#d6d6d6" : "#e0e0e0";

            return (
              <Box
                key={msg._id}
                sx={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  bgcolor: isMe ? "#1976d2" : altBg,
                  color: isMe ? "#fff" : "#000",
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: isMobile ? "90%" : "65%",
                  wordBreak: "break-word",
                  boxShadow: 1,
                  animation: "fadeIn 0.2s",
                  mt: prevSameUser ? 0.3 : 1,
                }}
              >
                {!prevSameUser && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: isMe ? "#bbdefb" : "#1976d2",
                      display: "block",
                      mb: 0.3,
                    }}
                  >
                    {msg.senderName}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ fontSize: isMobile ? 14 : 15 }}>
                  {msg.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.6,
                    mt: 0.5,
                    display: "block",
                    textAlign: "right",
                    fontSize: isMobile ? 10 : 11,
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* SIDEBAR - ONLINE USERS */}
        <Collapse
          in={sidebarOpen}
          orientation="horizontal"
          sx={{ zIndex: isMobile ? 1200 : 1 }}
        >
          <Paper
            sx={{
              width: isMobile ? "70vw" : 260,
              bgcolor: "#ffffff",
              borderLeft: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              position: isMobile ? "absolute" : "relative",
              right: 0,
              top: 0,
              height: "100%",
              boxShadow: isMobile ? "0 0 15px rgba(0,0,0,0.15)" : "none",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Online Users ({online.length})
              </Typography>
            </Box>
            {online.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderBottom: "1px solid #f2f2f2",
                  gap: 1.5,
                  "&:hover": { bgcolor: "#f9f9f9" },
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#2575fc" }}>
                  {user.username[0]}
                </Avatar>
                <Typography variant="body2">{user.username}</Typography>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "green",
                    ml: "auto",
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Collapse>
      </Box>

      {/* TYPING INDICATOR */}
      <Box sx={{ px: 2, pb: 1 }}>
        <TypingIndicator typingUsers={typingUsers} />
      </Box>

      <Divider />

      {/* INPUT AREA */}
      <Box
        sx={{
          p: 1,
          bgcolor: "#fff",
          boxShadow: "0 -3px 8px rgba(0,0,0,0.1)",
        }}
      >
        <MessageInput onSend={send} onTyping={onTypingChange} />
      </Box>
    </Paper>
  );
}
