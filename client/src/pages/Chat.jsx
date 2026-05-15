import React, { useEffect, useState, useContext } from "react";
import {
  Box, Typography, IconButton, Avatar,
  LinearProgress, useTheme, useMediaQuery,
  Menu, MenuItem
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Hash, LogOut, Settings, Menu as MenuIcon, Zap } from "lucide-react";
import RoomsSidebar from "../components/RoomsSidebar";
import ChatRoom from "../components/ChatRoom/ChatRoom";
import CreateRoomDialog from "../components/CreateRoomButton";
import { AuthContext } from "../context/AuthContext";
import http from "../api/http";

const MotionBox = motion.create(Box);

const Chat = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  
  const username = user?.username || location.state?.username || localStorage.getItem("username") || "Guest";

  const [room, setRoom] = useState(null);
  const [recentRooms, setRecentRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchRoomsAndCounts = async () => {
      try {
        const { data: roomsData } = await http.get("/api/rooms");
        const rooms = roomsData.map((r) => r.name);
        setRecentRooms(rooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRoomsAndCounts();
  }, []);

  const joinRoom = (roomName) => {
    setRoom(roomName);
    setRecentRooms((prev) => {
      const updated = [roomName, ...prev.filter((r) => r !== roomName)];
      return updated;
    });
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
      
      {/* Left Sidebar (Rooms & Profile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <MotionBox
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            sx={{
              width: { xs: "100%", md: 280 },
              borderRight: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              position: { xs: "absolute", md: "relative" },
              zIndex: 100,
              height: "100%",
            }}
          >
            {/* User Profile Header */}
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }} onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: "1rem", fontWeight: 700 }}>
                  {username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="700" sx={{ lineHeight: 1.2 }}>{username}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#10B981" }} /> Online
                  </Typography>
                </Box>
              </Box>
              {isMobile && (
                <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: "text.secondary" }}>
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
            
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { bgcolor: "background.paper", border: "1px solid", borderColor: "divider", minWidth: 200 } }}>
              <MenuItem onClick={() => setAnchorEl(null)}><Settings size={18} style={{ marginRight: 8 }} /> Settings</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "#EF4444" }}><LogOut size={18} style={{ marginRight: 8 }} /> Logout</MenuItem>
            </Menu>

            {/* Channels List */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "1px" }}>
                  Channels
                </Typography>
                <CreateRoomDialog variant="icon" onRoomCreated={joinRoom} />
              </Box>
              <RoomsSidebar onSelectRoom={joinRoom} recentRooms={recentRooms} activeRoom={room} />
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Main Workspace Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        
        {/* Top bar for mobile to toggle sidebar */}
        {!sidebarOpen && isMobile && (
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", bgcolor: "background.paper" }}>
            <IconButton onClick={() => setSidebarOpen(true)} sx={{ mr: 1, color: "text.primary" }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="700">RT Chat</Typography>
          </Box>
        )}

        {room ? (
          <ChatRoom me={username} room={room} onBack={() => setRoom(null)} />
        ) : (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, textAlign: "center" }}>
            <MotionBox initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <Box sx={{ width: 80, height: 80, borderRadius: "20px", background: "linear-gradient(135deg, rgba(126, 87, 194, 0.2) 0%, rgba(0, 229, 255, 0.2) 100%)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3, border: "1px solid rgba(255,255,255,0.05)" }}>
                <Hash size={40} color={theme.palette.primary.light} />
              </Box>
              <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>Select a Channel</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 4 }}>
                Choose a channel from the sidebar to start collaborating, or create a new one to bring your team together.
              </Typography>
              <CreateRoomDialog onRoomCreated={joinRoom} />
            </MotionBox>
          </Box>
        )}
      </Box>

    </Box>
  );
};

export default Chat;
