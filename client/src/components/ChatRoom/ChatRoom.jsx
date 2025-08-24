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

export default function ChatRoom({ me, room }) {
  const socket = useContext(SocketContext);
  const scrollRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  
  const navigate = useNavigate();


  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

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

  // const send = (text) => {
  //   if (!text.trim() || !socket) return;

  //   const tempId = Date.now().toString();
  //   const newMsg = {
  //     _id: tempId,
  //     senderName: me,
  //     text,
  //     createdAt: new Date().toISOString(),
  //   };
  //   setMessages((prev) => [...prev, newMsg]);
  //   scrollToBottom();

  //   socket.emit("chatMessage", { room, text, senderName: me });
  // };


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
      <AppBar position="sticky" color="#1976d2" sx={{ borderRadius: 0 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <IconButton
      color="inherit"
      onClick={() => navigate("/chat")} // Goes back to welcome page
      size={isMobile ? "small" : "medium"}
    >
      ←
    </IconButton>
    <Typography variant={isMobile ? "subtitle1" : "h6"}>#{room}</Typography>
    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: isMobile ? 12 : "inherit" }}>
      Signed in as {me}
    </Typography>
  </Box>

  <IconButton
    color="inherit"
    onClick={() => setSidebarOpen((prev) => !prev)}
    size={isMobile ? "small" : "medium"}
  >
    <PeopleIcon />
  </IconButton>
</Toolbar>


      </AppBar>

      {/* Main content */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Chat messages */}
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: isMobile ? 1 : 2,
            bgcolor: "#386077ff",
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
                  maxWidth: isMobile ? "100%" : "70%",
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
                <Typography variant="body1" sx={{ fontSize: isMobile ? 14 : "inherit" }}>
                  {msg.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.6,
                    mt: 0.5,
                    display: "block",
                    textAlign: "right",
                    fontSize: isMobile ? 10 : "0.65rem",
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>

                {/* Typing indicator */}
                {typingUsers.includes(msg.senderName) && (
                  <Typography
                    variant="caption"
                    sx={{ fontStyle: "italic", opacity: 0.7 }}
                  >
                    typing...
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Collapsible online users sidebar */}
        <Collapse in={sidebarOpen && !isMobile ? true : sidebarOpen} orientation="horizontal">
          <Paper
            sx={{
              width: isMobile ? "60vw" : 250,
              bgcolor: "#f5f5f5",
              borderLeft: "1px solid #ccc",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              position: isMobile ? "absolute" : "relative",
              right: 0,
              top: 0,
              height: "100%",
              zIndex: 10,
            }}
          >
            <Box sx={{ p: 1, borderBottom: "1px solid #ccc" }}>
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
                  p: 1,
                  borderBottom: "1px solid #eee",
                  gap: 1,
                }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>{user.username[0]}</Avatar>
                <Typography variant="body2">{user.username}</Typography>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
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

      {/* Typing indicator at bottom */}
      <Box sx={{ px: 2, pb: 1 }}>
        <TypingIndicator typingUsers={typingUsers} />
      </Box>

      <Divider />

      {/* Input */}
      <Box
        sx={{
          p: 1,
          bgcolor: "white",
          boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <MessageInput onSend={send} onTyping={onTypingChange} />
      </Box>
    </Paper>
  );
}
