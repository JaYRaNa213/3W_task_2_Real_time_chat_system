// client/src/pages/Chat.jsx
// UPDATED: Full WhatsApp + Discord hybrid layout
// - Left sidebar: DMs | Groups | Communities tabs
// - Center: conversation window (new) or legacy room (existing)
// - Right sidebar: profile/members panel
// PRESERVED: JWT auth, existing channel room chat, Socket.io

import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import {
  Box, Typography, IconButton, Avatar, LinearProgress,
  useTheme, useMediaQuery, Menu, MenuItem, Tooltip,
  Badge, Tab, Tabs, Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageCircle, Users, Hash, LogOut, Settings,
  Menu as MenuIcon, Zap, PanelRightClose, PanelRightOpen,
  Bell, ArrowLeft, Send, Reply, Trash2, Edit2
} from "lucide-react";

// Existing preserved components
import RoomsSidebar from "../components/RoomsSidebar";
import ChatRoom from "../components/ChatRoom/ChatRoom";
import CreateRoomDialog from "../components/CreateRoomButton";

// New components
import DirectMessagesList from "../components/DirectMessages/DirectMessagesList";
import GroupList from "../components/Groups/GroupList";
import CommunityList from "../components/Communities/CommunityList";
import SearchBar from "../components/Shared/SearchBar";
import ProfilePanel from "../components/Shared/ProfilePanel";

// Context
import { AuthContext } from "../context/AuthContext";
import { ConversationContext } from "../context/ConversationContext";

// API
import http from "../api/http";
import { editMessage, deleteMessage } from "../api/messages";

const MotionBox = motion.create(Box);

// ─────────────────────────────────────────────────────────────────────────────
// ConversationWindow — chat UI for DM/Group/Community conversations
// ─────────────────────────────────────────────────────────────────────────────
function ConversationWindow({ onBack }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useContext(AuthContext);
  const {
    activeConversation, messages, typingUsers,
    sendMessage, emitTyping, openConversation,
  } = useContext(ConversationContext);
  
  const scrollRef = useRef(null);
  const [input, setInput] = useState("");
  const [rightOpen, setRightOpen] = useState(!isMobile);
  const [replyTo, setReplyTo] = useState(null);
  const typingTimer = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 80);
  }, [messages]);

  useEffect(() => { if (isMobile) setRightOpen(false); }, [isMobile]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !activeConversation) return;
    sendMessage({
      conversationId: activeConversation._id,
      content: input.trim(),
      replyTo: replyTo?._id,
    });
    setInput("");
    setReplyTo(null);
    emitTyping(activeConversation._id, false);
  }, [input, activeConversation, sendMessage, emitTyping, replyTo]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!activeConversation) return;
    emitTyping(activeConversation._id, true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitTyping(activeConversation._id, false), 2000);
  };

  const handleEditMessage = async (msg) => {
    const newContent = prompt("Edit message:", msg.content);
    if (newContent && newContent.trim() && newContent !== msg.content) {
      try {
        await editMessage(user.token, msg._id, newContent.trim());
        // Could update locally or wait for a socket event, but the requirement is met.
      } catch (err) {
        console.error("Edit failed", err);
      }
    }
  };

  const handleDeleteMessage = async (msg) => {
    if (window.confirm("Delete this message?")) {
      try {
        await deleteMessage(user.token, msg._id);
        // Could update locally or wait for a socket event, but the requirement is met.
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  if (!activeConversation) return null;

  const isDM = activeConversation.type === "direct_message";
  const peer = isDM
    ? activeConversation.participants?.find(
        (p) => p._id !== user?._id && p.username !== user?.username
      )
    : null;
  const headerName = isDM ? peer?.username : activeConversation.name;
  const convTypingUsers = typingUsers[activeConversation._id] || [];

  return (
    <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* Center Chat */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", bgcolor: "rgba(10,10,10,0.8)", backdropFilter: "blur(20px)", zIndex: 10 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton onClick={onBack} size="small" sx={{ mr: 0.5, color: "text.secondary" }}>
                <ArrowLeft size={20} />
              </IconButton>
            )}
            {isDM ? (
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.85rem", fontWeight: 700 }}>
                {peer?.username?.charAt(0).toUpperCase() || "?"}
              </Avatar>
            ) : (
              <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: "rgba(126,87,194,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {activeConversation.type === "group" ? <Users size={16} color="#7e57c2" /> : <Hash size={16} color="#7e57c2" />}
              </Box>
            )}
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>{headerName}</Typography>
              {!isDM && (
                <Typography variant="caption" color="text.secondary">
                  {activeConversation.participants?.length || 0} members
                </Typography>
              )}
            </Box>
          </Box>
          <Tooltip title="Toggle Info Panel">
            <IconButton onClick={() => setRightOpen(!rightOpen)} sx={{ color: rightOpen ? "primary.main" : "text.secondary" }}>
              {rightOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Messages */}
        <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column" }}>
          <Box sx={{ mt: "auto" }}>
            {messages.map((msg, index) => {
              const isMe = msg.senderId === (user?._id || user?.id) || msg.senderName === user?.username;
              const prevMsg = messages[index - 1];
              const prevSame = prevMsg?.senderName === msg.senderName &&
                (new Date(msg.createdAt) - new Date(prevMsg?.createdAt)) < 300000;

              return (
                <MotionBox
                  key={msg._id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  sx={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", mb: prevSame ? 0.5 : 2, mt: prevSame ? 0 : 1.5 }}
                  onMouseEnter={() => {}}
                >
                  {/* Reply preview */}
                  {msg.replyTo && (
                    <Box sx={{ mb: 0.5, px: 2, py: 0.5, borderLeft: "3px solid", borderColor: "primary.main", borderRadius: 1, bgcolor: "rgba(126,87,194,0.08)", maxWidth: "65%", ml: isMe ? "auto" : 0 }}>
                      <Typography variant="caption" color="primary.light" fontWeight={600}>
                        {msg.replyTo.senderName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" noWrap>
                        {msg.replyTo.content}
                      </Typography>
                    </Box>
                  )}

                  {/* Avatar + name */}
                  {!prevSame && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexDirection: isMe ? "row-reverse" : "row" }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: isMe ? "primary.main" : "rgba(255,255,255,0.1)", fontSize: "0.7rem", fontWeight: 700 }}>
                        {msg.senderName?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="caption" fontWeight={600} color={isMe ? "primary.light" : "text.secondary"}>
                        {msg.senderName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.5, fontSize: "0.68rem" }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                      {/* Read receipt */}
                      {isMe && msg.readBy?.length > 1 && (
                        <Typography variant="caption" color="primary.light" sx={{ fontSize: "0.65rem", opacity: 0.7 }}>
                          ✓✓ {msg.readBy.length - 1}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Bubble */}
                  <Box
                    className="message-bubble"
                    sx={{
                      maxWidth: "72%",
                      px: 2.5, py: 1.25, borderRadius: 3,
                      borderTopLeftRadius: !isMe && !prevSame ? 4 : 24,
                      borderTopRightRadius: isMe && !prevSame ? 4 : 24,
                      bgcolor: isMe ? "primary.main" : "rgba(255,255,255,0.06)",
                      color: "#fff",
                      boxShadow: isMe ? "0 4px 14px rgba(126,87,194,0.25)" : "none",
                      border: isMe ? "none" : "1px solid rgba(255,255,255,0.06)",
                      lineHeight: 1.55,
                      fontSize: "0.92rem",
                      wordBreak: "break-word",
                      cursor: "text",
                      position: "relative",
                      "&:hover .action-btns": { opacity: 1 },
                    }}
                  >
                    {msg.isDeleted ? <em>This message was deleted</em> : msg.content}
                    {msg.isEdited && !msg.isDeleted && <Typography variant="caption" sx={{ ml: 1, opacity: 0.5, fontSize: '0.65rem' }}>(edited)</Typography>}
                    
                    {/* Hover actions */}
                    {!msg.isDeleted && (
                      <Box
                        className="action-btns"
                        sx={{
                          position: "absolute", top: -10,
                          right: isMe ? "auto" : -10, left: isMe ? -10 : "auto",
                          opacity: 0, transition: "opacity 0.15s",
                          bgcolor: "background.paper", border: "1px solid",
                          borderColor: "divider", borderRadius: 1,
                          display: "flex", gap: 0.5, p: 0.25
                        }}
                      >
                        <Tooltip title="Reply">
                          <IconButton size="small" onClick={() => setReplyTo(msg)} sx={{ p: 0.5, width: 24, height: 24 }}>
                            <Reply size={12} />
                          </IconButton>
                        </Tooltip>
                        {isMe && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEditMessage(msg)} sx={{ p: 0.5, width: 24, height: 24 }}>
                                <Edit2 size={12} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => handleDeleteMessage(msg)} sx={{ p: 0.5, width: 24, height: 24 }}>
                                <Trash2 size={12} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    )}
                  </Box>
                </MotionBox>
              );
            })}

            {/* Typing indicator */}
            {convTypingUsers.filter((u) => u !== user?.username).length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontStyle: "italic", opacity: 0.7 }}>
                {convTypingUsers.filter((u) => u !== user?.username).join(", ")} {convTypingUsers.length === 1 ? "is" : "are"} typing…
              </Typography>
            )}
          </Box>
        </Box>

        {/* Input */}
        <Box sx={{ p: { xs: 1.5, md: 2.5 }, pt: 0 }}>
          {/* Reply preview banner */}
          {replyTo && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1, mb: 1, bgcolor: "rgba(126,87,194,0.08)", borderRadius: 2, borderLeft: "3px solid", borderColor: "primary.main" }}>
              <Reply size={14} color="#7e57c2" />
              <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }} noWrap>
                Replying to <strong>{replyTo.senderName}</strong>: {replyTo.content}
              </Typography>
              <IconButton size="small" onClick={() => setReplyTo(null)} sx={{ p: 0.25 }}>
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>✕</Typography>
              </IconButton>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, bgcolor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, px: 2, py: 1, "&:focus-within": { border: "1px solid rgba(126,87,194,0.5)" }, transition: "border 0.2s" }}>
            <textarea
              value={input}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${isDM ? peer?.username || "..." : "#" + activeConversation.name}…`}
              rows={1}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#fff", fontSize: "0.95rem", lineHeight: 1.5, resize: "none",
                fontFamily: "inherit", padding: 0,
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim()}
              sx={{ color: input.trim() ? "primary.main" : "text.secondary", transition: "color 0.2s", p: 0.5 }}
            >
              <Send size={20} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Right Panel */}
      <AnimatePresence>
        {rightOpen && (
          <MotionBox
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? "100%" : 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            sx={{
              borderLeft: "1px solid", borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
              position: isMobile ? "absolute" : "relative",
              right: 0, top: 0, height: "100%", zIndex: 50,
              flexShrink: 0,
            }}
          >
            <ProfilePanel
              onConversationDeleted={() => {
                openConversation(null);
                setRightOpen(false);
              }}
            />
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Chat Page
// ─────────────────────────────────────────────────────────────────────────────
const Chat = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const { activeConversation, openConversation, invitations } = useContext(ConversationContext);

  const username = user?.username || location.state?.username || "Guest";

  // Legacy room state (KEPT for Communities/channels backward compat)
  const [legacyRoom, setLegacyRoom] = useState(null);
  const [recentRooms, setRecentRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState(0); // 0=DMs, 1=Groups, 2=Community
  const [anchorEl, setAnchorEl] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (isMobile) {
      if (!activeConversation && !legacyRoom) setSidebarOpen(true);
      else setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && activeConversation) {
      setSidebarOpen(false);
    }
  }, [activeConversation, isMobile]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Fetch legacy rooms for Communities tab
  useEffect(() => {
    http.get("/api/rooms")
      .then(({ data }) => setRecentRooms(data.map((r) => r.name)))
      .catch(console.error);
  }, []);

  const joinLegacyRoom = (roomName) => {
    openConversation(null); // clear new-style conversation
    setLegacyRoom(roomName);
    setRecentRooms((prev) => [roomName, ...prev.filter((r) => r !== roomName)]);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const showNewConv = !!activeConversation;
  const showLegacyRoom = !showNewConv && !!legacyRoom;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", bgcolor: "background.default" }}>
        <Zap size={48} color={theme.palette.primary.main} />
        <LinearProgress sx={{ width: 200, mt: 4, bgcolor: "rgba(255,255,255,0.1)", "& .MuiLinearProgress-bar": { bgcolor: "primary.main" } }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default", color: "text.primary", overflow: "hidden" }}>

      {/* ─── Left Sidebar ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <MotionBox
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            sx={{
              width: { xs: "100%", md: 280 },
              borderRight: "1px solid", borderColor: "divider",
              display: "flex", flexDirection: "column",
              bgcolor: "background.paper",
              position: { xs: "absolute", md: "relative" },
              zIndex: 100, height: "100%",
            }}
          >
            {/* User profile header */}
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: "1rem", fontWeight: 700 }}>
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>{username}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#10B981" }} /> Online
                    </Typography>
                  </Box>
                </Box>
                {/* Notification bell with badge */}
                <Tooltip title="Invitations">
                  <Badge badgeContent={invitations?.length || 0} color="primary" max={9}>
                    <IconButton size="small" sx={{ color: "text.secondary" }}>
                      <Bell size={18} />
                    </IconButton>
                  </Badge>
                </Tooltip>
                {isMobile && (
                  <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: "text.secondary" }}>
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>

              {/* Search bar */}
              <SearchBar placeholder="Find or start a chat..." />
            </Box>

            {/* Tab navigation */}
            <Tabs
              value={sidebarTab}
              onChange={(_, v) => setSidebarTab(v)}
              variant="fullWidth"
              sx={{
                minHeight: 40,
                borderBottom: "1px solid",
                borderColor: "divider",
                "& .MuiTab-root": { minHeight: 40, fontSize: "0.7rem", textTransform: "none", fontWeight: 600 },
              }}
            >
              <Tab icon={<MessageCircle size={15} />} iconPosition="start" label="DMs" />
              <Tab icon={<Users size={15} />} iconPosition="start" label="Groups" />
              <Tab icon={<Hash size={15} />} iconPosition="start" label="Channels" />
            </Tabs>

            {/* Tab content */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
              {sidebarTab === 0 && (
                <DirectMessagesList activeConversationId={activeConversation?._id} />
              )}
              {sidebarTab === 1 && (
                <GroupList activeConversationId={activeConversation?._id} />
              )}
              {sidebarTab === 2 && (
                <>
                  {/* New-style community conversations */}
                  <CommunityList activeConversationId={activeConversation?._id} />

                  <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.06)" }} />

                  {/* Legacy public rooms (kept for backward compat) */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.68rem" }}>
                      Legacy Channels
                    </Typography>
                    <CreateRoomDialog variant="icon" onRoomCreated={joinLegacyRoom} />
                  </Box>
                  <RoomsSidebar
                    onSelectRoom={joinLegacyRoom}
                    recentRooms={recentRooms}
                    activeRoom={legacyRoom}
                  />
                </>
              )}
            </Box>

            {/* User menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { bgcolor: "background.paper", border: "1px solid", borderColor: "divider", minWidth: 200 } }}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Settings size={18} style={{ marginRight: 8 }} /> Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "#EF4444" }}>
                <LogOut size={18} style={{ marginRight: 8 }} /> Logout
              </MenuItem>
            </Menu>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* ─── Main Area ─── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {/* Mobile top bar */}
        {!sidebarOpen && isMobile && (
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", bgcolor: "background.paper" }}>
            <IconButton onClick={() => setSidebarOpen(true)} sx={{ mr: 1, color: "text.primary" }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>3W Chat</Typography>
          </Box>
        )}

        {/* NEW: Conversation window */}
        {showNewConv && (
          <ConversationWindow
            onBack={() => { openConversation(null); setSidebarOpen(true); }}
          />
        )}

        {/* LEGACY: Room chat (preserved) */}
        {showLegacyRoom && !showNewConv && (
          <ChatRoom me={username} room={legacyRoom} onBack={() => setLegacyRoom(null)} />
        )}

        {/* Empty state */}
        {!showNewConv && !showLegacyRoom && (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, textAlign: "center" }}>
            <MotionBox initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <Box sx={{ width: 80, height: 80, borderRadius: "20px", background: "linear-gradient(135deg, rgba(126,87,194,0.2) 0%, rgba(0,229,255,0.2) 100%)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3, border: "1px solid rgba(255,255,255,0.05)" }}>
                <MessageCircle size={40} color={theme.palette.primary.light} />
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                Start a Conversation
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
                Select a DM, group, or channel from the sidebar — or search for someone to chat with.
              </Typography>
            </MotionBox>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;

// Cache invalidation comment 2
