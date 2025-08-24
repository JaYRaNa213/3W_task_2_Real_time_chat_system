
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
  const [openCreate, setOpenCreate] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
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

  // ---- Manage Online Users ----
  // Listen for online users from backend
useEffect(() => {
  if (!socket) return;

  // always join lobby when connected
  socket.emit("joinRoom", { username, room: "General" });

  const handleOnlineUsers = (users) => setOnlineUsers(users);
  socket.on("onlineUsers", handleOnlineUsers);

  return () => {
    socket.off("onlineUsers", handleOnlineUsers);
  };
}, [socket, username]);

  

  // ---- Load Rooms and Messages ----
  useEffect(() => {
    const rooms = JSON.parse(localStorage.getItem(ROOMS_KEY)) || ["General"];
    setRecentRooms(rooms);

    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || {};
    setActiveRooms(
      Object.fromEntries(
        rooms.map((r) => [r, messages[r]?.length || 0])
      )
    );
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

  // ---- Create Room ----
  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    const updated = [newRoomName, ...recentRooms];
    setRecentRooms(updated);
    localStorage.setItem(ROOMS_KEY, JSON.stringify(updated));
    setOpenCreate(false);
    setNewRoomName("");
    joinRoom(newRoomName);
  };

  // ---- Fake Notifications ----
  useEffect(() => {
    const interval = setInterval(() => {
      if (!room && recentRooms.length > 0) {
        const target =
          recentRooms[Math.floor(Math.random() * recentRooms.length)];
        setUnread((prev) => ({
          ...prev,
          [target]: (prev[target] || 0) + 1,
        }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [room, recentRooms]);

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
                <Slide direction="up" in={true} timeout={1200}>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenCreate(true)}
                      sx={{
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #764ba2, #667eea)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 15px 35px rgba(102, 126, 234, 0.6)"
                        },
                        transition: "all 0.3s ease"
                      }}
                    >
                      Create Room
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<CasinoIcon />}
                      onClick={() => {
                        if (recentRooms.length > 0) {
                          const rand =
                            recentRooms[
                              Math.floor(Math.random() * recentRooms.length)
                            ];
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
                    <Grid item xs={12} md={4}>
                      <Card 
  sx={{ 
    borderRadius: 4,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 25px 50px rgba(102, 126, 234, 0.4)"
    }
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
                    <Grid item xs={12} md={4}>
                      <Card 
                        sx={{ 
                          borderRadius: 4,
                          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                          color: "white",
                          boxShadow: "0 20px 40px rgba(76, 175, 80, 0.3)",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 25px 50px rgba(76, 175, 80, 0.4)"
                          }
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
                          
                          <List dense sx={{ maxHeight: 240, overflowY: "auto" }}>
                            {recentRooms.map((roomName, idx) => (
                              <ListItem
                                key={idx}
                                button
                                onClick={() => joinRoom(roomName)}
                                sx={{
                                  borderRadius: 2,
                                  mb: 1,
                                  "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.1)"
                                  }
                                }}
                              >
                                <RoomIcon sx={{ mr: 2, fontSize: 20 }} />
                                <Badge
                                  color="error"
                                  badgeContent={unread[roomName] || 0}
                                  invisible={!unread[roomName]}
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

                    {/* Active Rooms Card */}
                    <Grid item xs={12} md={4}>
                      <Card 
                        sx={{ 
                          borderRadius: 4,
                          background: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
                          color: "white",
                          boxShadow: "0 20px 40px rgba(255, 152, 0, 0.3)",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 25px 50px rgba(255, 152, 0, 0.4)"
                          }
                        }}
                      >
                        {/* <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                              <MessageIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                              Room Activity
                            </Typography>
                          </Box>
                          
                          <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 2 }} />
                          
                          <List dense sx={{ maxHeight: 240, overflowY: "auto" }}>
                            {Object.entries(activeRooms).map(([roomName, count]) => (
                              <ListItem key={roomName} sx={{ px: 0 }}>
                                <MessageIcon sx={{ mr: 2, fontSize: 20 }} />
                                <ListItemText
                                  primary={roomName}
                                  secondary={
                                    <Chip
                                      label={`${count} messages`}
                                      size="small"
                                      sx={{
                                        bgcolor: "rgba(255,255,255,0.2)",
                                        color: "white",
                                        mt: 1
                                      }}
                                    />
                                  }
                                  primaryTypographyProps={{ fontWeight: 500 }}
                                  secondaryTypographyProps={{ color: "inherit" }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent> */}
                      </Card>
                    </Grid>
                  </Grid>
                </Fade>
              </Box>
            )}
          </Paper>
        </Fade>
      </Box>

      {/* Enhanced Create Room Dialog */}
      <Dialog 
        open={openCreate} 
        onClose={() => setOpenCreate(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: "center", 
          fontSize: "1.5rem", 
          fontWeight: "bold",
          pb: 1
        }}>
          <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "rgba(255,255,255,0.2)" }}>
            <AddIcon />
          </Avatar>
          Create New Room
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Room Name"
            variant="outlined"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.8)" },
                "&.Mui-focused fieldset": { borderColor: "white" },
                color: "white"
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.8)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "white" }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setOpenCreate(false)}
            sx={{ 
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateRoom} 
            variant="contained"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            Create Room
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
