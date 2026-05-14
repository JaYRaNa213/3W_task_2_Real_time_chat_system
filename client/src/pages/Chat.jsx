
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Badge,
  Divider,
  useMediaQuery,
  Drawer,
  IconButton,
  Avatar,
  Chip,
  Paper,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Casino as CasinoIcon,
  Room as RoomIcon,
  Message as MessageIcon,
  Star as StarIcon,
  Notifications as NotificationsIcon,
  Online as OnlineIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import RoomsSidebar from "../components/RoomsSidebar";
import ChatRoom from "../components/ChatRoom/ChatRoom";
import { useSocket } from "../context/SocketContext";
import CreateRoomDialog from "../components/CreateRoomButton";
import http from "../api/http"; 

const Chat = () => {
  const theme = useTheme();
  const location = useLocation();
  const username =
    location.state?.username || localStorage.getItem("username") || "Guest";

  const [room, setRoom] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentRooms, setRecentRooms] = useState([]);
  const [activeRooms, setActiveRooms] = useState({});
  const [unread, setUnread] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useMediaQuery("(max-width:768px)");
  const socket = useSocket();

  const USERS_KEY = "chat_online_users";
  const ROOMS_KEY = "chat_rooms";
  const MESSAGES_KEY = "chat_messages";

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);



  // ---- Load Rooms and Messages ----
  useEffect(() => {
  const fetchRoomsAndCounts = async () => {
    try {
      // 1. Fetch rooms
      const { data: roomsData } = await http.get("/api/rooms");
      const rooms = roomsData.map((r) => r.name);

      setRecentRooms(rooms);

      // 2. Fetch counts for each room
      const counts = {};
      for (const room of rooms) {
        const { data } = await http.get(`/api/messages/${room}/count`);
        counts[room] = data.count;
      }

      // 3. Save to state
      setActiveRooms(counts);

      // 4. Cache
      localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(counts));
    } catch (err) {
      console.error("Error fetching rooms/counts:", err);
    }
  };

  fetchRoomsAndCounts();
}, []);


  // ---- Join Room ----
  const joinRoom = (roomName) => {
    setRoom(roomName);

    setRecentRooms((prev) => {
      const updated = [roomName, ...prev.filter((r) => r !== roomName)];
      localStorage.setItem(ROOMS_KEY, JSON.stringify(updated));
      return updated;
    });

    setUnread((prev) => ({ ...prev, [roomName]: 0 }));

    if (isMobile) setDrawerOpen(false);
  };


  // Get user avatar color
  const getAvatarColor = (name) => {
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
      "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        <Box sx={{ textAlign: "center", color: "white" }}>
          <ChatIcon sx={{ fontSize: 80, mb: 2, animation: "pulse 2s infinite" }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            Loading Chat...
          </Typography>
          <LinearProgress
            sx={{
              width: 300,
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha("#fff", 0.3),
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#fff"
              }
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
    }}>
      <Navbar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          p: 2,
          gap: 2,
          position: "relative",
        }}
      >
        {/* Mobile Sidebar Drawer */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                background: "linear-gradient(145deg, #667eea 0%, #764ba2 100%)",
                color: "white"
              }
            }}
          >
            <RoomsSidebar onSelectRoom={joinRoom} recentRooms={recentRooms} unread={unread} />
          </Drawer>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Slide direction="right" in={true} timeout={800}>
            <Paper
              elevation={10}
              sx={{
                width: 300,
                background: "linear-gradient(145deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 4,
                p: 3,
                height: "100%",
                overflowY: "auto",
                color: "white",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(255,255,255,0.05)"

                }
              }}
            >
              <RoomsSidebar onSelectRoom={joinRoom} recentRooms={recentRooms} unread={unread} />
            </Paper>
          </Slide>
        )}

        {/* Chat Window */}
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={10}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              overflow: "hidden",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            {/* Mobile Menu Button */}
            {isMobile && !room && (
              <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  sx={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #764ba2, #667eea)",
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            {room ? (

              <ChatRoom me={username} room={room} onBack={() => setRoom(null)} />

            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  p: 4,
                  textAlign: "center"
                }}
              >
                {/* Welcome Header */}
                <Zoom in={true} timeout={1000}>
                  <Box>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: getAvatarColor(username),
                        fontSize: "3rem",
                        fontWeight: "bold",
                        mx: "auto",
                        mb: 3,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        border: "4px solid white"
                      }}
                    >
                      {username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        backgroundClip: "text",
                        color: "transparent",
                        mb: 1
                      }}
                    >
                      Welcome, {username}!
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ maxWidth: 600, mx: "auto" }}
                    >
                      Connect with friends and colleagues in real-time. Select a room or create your own to get started.
                    </Typography>
                  </Box>
                </Zoom>

                {/* Quick Actions */}
                {/* Quick Actions */}
                <Slide direction="up" in={true} timeout={1200}>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
                    <CreateRoomDialog
                      onRoomCreated={(roomName) => {
                        setRecentRooms((prev) => {
                          const updated = [roomName, ...prev];
                          localStorage.setItem("chat_rooms", JSON.stringify(updated));
                          return updated;
                        });
                        joinRoom(roomName);
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<CasinoIcon />}
                      onClick={() => {
                        if (recentRooms.length > 0) {
                          const rand = recentRooms[Math.floor(Math.random() * recentRooms.length)];
                          joinRoom(rand);
                        }
                      }}
                      sx={{
                        borderColor: "#667eea",
                        color: "#667eea",
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        borderWidth: 2,
                        "&:hover": {
                          background: "linear-gradient(45deg, #667eea, #764ba2)",
                          color: "white",
                          borderColor: "transparent",
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)"
                        },
                        transition: "all 0.3s ease"
                      }}
                    >
                      Join Random
                    </Button>
                  </Box>
                </Slide>


                {/* Dashboard Grid */}
                <Fade in={true} timeout={1500}>
                  <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    maxWidth="lg"
                    sx={{ mt: 2 }}
                  >
                    {/* Online Users Card */}
                    <Grid item xs={12} md={6}>
                      <Card
                        sx={{
                          borderRadius: 4,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 25px 50px rgba(102, 126, 234, 0.4)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                              <PeopleIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                              Online Users
                            </Typography>
                          </Box>

                          {/* ✅ only count */}
                          <Typography variant="h3" fontWeight="bold">
                            {onlineUsers.length}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Recent Rooms Card */}
                    <Grid item xs={12} md={6}>
                      <Card
                        sx={{
                          borderRadius: 4,
                          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                          color: "white",
                          boxShadow: "0 20px 40px rgba(76, 175, 80, 0.3)",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 25px 50px rgba(76, 175, 80, 0.4)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                              <RoomIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                              Recent Rooms
                            </Typography>
                          </Box>

                          <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 2 }} />

                          <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
                            {recentRooms.map((roomName, idx) => (
                              <ListItem
                                key={idx}
                                button
                                onClick={() => joinRoom(roomName)}
                                sx={{
                                  borderRadius: 2,
                                  mb: 1,
                                  "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.1)",
                                  },
                                }}
                              >
                                <RoomIcon sx={{ mr: 2, fontSize: 20 }} />
                               <Badge
  color="error"
  badgeContent={activeRooms[roomName] || 0}
  invisible={!activeRooms[roomName]}
>
  <ListItemText
    primary={roomName}
    primaryTypographyProps={{ fontWeight: 500 }}
  />
</Badge>


                              </ListItem>
                            ))}
</List>
</CardContent>
</Card>
                    </Grid>
                  </Grid>
                </Fade>
              </Box>
            )}
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Chat;


         
