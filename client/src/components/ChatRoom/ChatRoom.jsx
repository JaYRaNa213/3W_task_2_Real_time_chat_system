import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, Avatar, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { Hash, Users, PanelRightClose, PanelRightOpen, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SocketContext } from "../../context/SocketContext";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

const MotionBox = motion.create(Box);

export default function ChatRoom({ me, room, onBack }) {
  const theme = useTheme();
  const socket = useContext(SocketContext);
  const scrollRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) setRightSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("joinRoom", { username: me, room });

    const onLoadHistory = (history) => {
      setMessages(history || []);
      scrollToBottom();
    };
    
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
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const send = (text) => {
    if (!text.trim() || !socket) return;
    socket.emit("chatMessage", { room, text, senderName: me });
  };

  const onTypingChange = (isTyping) => {
    if (!socket) return;
    socket.emit("typing", { room, username: me, isTyping });
  };

  // Grouping logic
  const isPrevSameUser = (index) => {
    if (index === 0) return false;
    const current = messages[index];
    const prev = messages[index - 1];
    
    if (current.senderName === "System" || prev.senderName === "System") return false;
    
    const timeDiff = new Date(current.createdAt) - new Date(prev.createdAt);
    return current.senderName === prev.senderName && timeDiff < 60000 * 5; // 5 min grouping
  };

  return (
    <Box sx={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
      
      {/* Center Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "background.default", position: "relative" }}>
        
        {/* Chat Header */}
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", bgcolor: "rgba(10, 10, 10, 0.8)", backdropFilter: "blur(20px)", zIndex: 10 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton onClick={onBack} size="small" sx={{ mr: 1, color: "text.secondary" }}>
                <ArrowLeft size={20} />
              </IconButton>
            )}
            <Hash size={24} color={theme.palette.text.secondary} />
            <Typography variant="h6" fontWeight="700">{room}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Toggle Members">
              <IconButton onClick={() => setRightSidebarOpen(!rightSidebarOpen)} sx={{ color: rightSidebarOpen ? "primary.main" : "text.secondary" }}>
                {rightSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Message List */}
        <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", p: { xs: 2, md: 4 }, display: "flex", flexDirection: "column" }}>
          
          <Box sx={{ mt: "auto" }}> {/* Push to bottom naturally if few msgs */}
            
            {messages.map((msg, index) => {
              const isSystem = msg.senderName === "System";
              const isMe = msg.senderName === me;
              const prevSame = isPrevSameUser(index);

              if (isSystem) {
                return (
                  <Box key={msg._id || index} sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                    <Typography variant="caption" sx={{ px: 2, py: 0.5, borderRadius: "full", bgcolor: "rgba(255,255,255,0.05)", color: "text.secondary", fontSize: "0.75rem" }}>
                      {msg.text}
                    </Typography>
                  </Box>
                );
              }

              return (
                <MotionBox
                  key={msg._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  sx={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", mb: prevSame ? 0.5 : 2, mt: prevSame ? 0 : 2 }}
                >
                  {!prevSame && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, ml: isMe ? 0 : 1, mr: isMe ? 1 : 0, flexDirection: isMe ? "row-reverse" : "row" }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: isMe ? "primary.main" : "rgba(255,255,255,0.1)", fontSize: "0.75rem", fontWeight: 700 }}>
                        {msg.senderName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="caption" fontWeight="600" color={isMe ? "primary.light" : "text.secondary"}>
                        {msg.senderName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.5, fontSize: "0.7rem" }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      maxWidth: "75%",
                      px: 2.5,
                      py: 1.5,
                      borderRadius: 3,
                      borderTopLeftRadius: !isMe && !prevSame ? 4 : 24,
                      borderTopRightRadius: isMe && !prevSame ? 4 : 24,
                      bgcolor: isMe ? "primary.main" : "rgba(255, 255, 255, 0.05)",
                      color: "#fff",
                      boxShadow: isMe ? "0 4px 14px rgba(126, 87, 194, 0.2)" : "none",
                      border: isMe ? "none" : "1px solid rgba(255,255,255,0.05)",
                      lineHeight: 1.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    {msg.text}
                  </Box>
                </MotionBox>
              );
            })}
          </Box>
          <TypingIndicator typingUsers={typingUsers} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: { xs: 2, md: 3 }, pt: 0, bgcolor: "transparent" }}>
          <MessageInput onSend={send} onTyping={onTypingChange} />
        </Box>
      </Box>

      {/* Right Sidebar (Online Users) */}
      <AnimatePresence>
        {rightSidebarOpen && (
          <MotionBox
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? "100%" : 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            sx={{
              borderLeft: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: isMobile ? "absolute" : "relative",
              right: 0,
              top: 0,
              height: "100%",
              zIndex: 50,
            }}
          >
            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid", borderColor: "divider" }}>
              <Users size={18} color={theme.palette.text.secondary} />
              <Typography variant="subtitle2" fontWeight="700" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "1px" }}>
                Members — {online.length}
              </Typography>
              {isMobile && (
                <IconButton size="small" onClick={() => setRightSidebarOpen(false)} sx={{ ml: "auto" }}>
                  <PanelRightClose size={18} />
                </IconButton>
              )}
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
              {online.map((u) => (
                <Box key={u.id} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1, borderRadius: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }, cursor: "pointer", transition: "background 0.2s" }}>
                  <Box sx={{ position: "relative" }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.1)", fontSize: "0.85rem", fontWeight: 600 }}>
                      {u.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", bgcolor: "#10B981", border: "2px solid #121212" }} />
                  </Box>
                  <Typography variant="body2" fontWeight="500" sx={{ flex: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {u.username}
                  </Typography>
                </Box>
              ))}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

    </Box>
  );
}
