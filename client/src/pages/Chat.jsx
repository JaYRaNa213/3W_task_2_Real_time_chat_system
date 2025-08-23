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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import RoomsSidebar from "../components/RoomsSidebar";
import ChatRoom from "../components/ChatRoom/ChatRoom";

const Chat = () => {
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

  const isMobile = useMediaQuery("(max-width:768px)");

  const USERS_KEY = "chat_online_users";
  const ROOMS_KEY = "chat_rooms";
  const MESSAGES_KEY = "chat_messages";

  // ---- Manage Online Users ----
  useEffect(() => {
    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    if (!users.includes(username)) {
      users.push(username);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    setOnlineUsers(users);

    const syncUsers = () => {
      setOnlineUsers(JSON.parse(localStorage.getItem(USERS_KEY)) || []);
    };
    window.addEventListener("storage", syncUsers);

    return () => {
      users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
      users = users.filter((u) => u !== username);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      window.removeEventListener("storage", syncUsers);
    };
  }, [username]);

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

    if (isMobile) setDrawerOpen(false); // close sidebar on mobile after selecting room
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          bgcolor: "#f0f2f5",
          position: "relative",
        }}
      >
        {/* Mobile Sidebar Drawer */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <RoomsSidebar onSelectRoom={joinRoom} recentRooms={recentRooms} unread={unread} />
          </Drawer>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: 250,
              bgcolor: "#fff",
              borderRadius: 3,
              boxShadow: 2,
              p: 2,
              height: "100%",
              overflowY: "auto",
            }}
          >
            <RoomsSidebar onSelectRoom={joinRoom} recentRooms={recentRooms} unread={unread} />
          </Box>
        )}

        {/* Chat Window */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: 2,
            p: 2,
            overflow: "hidden",
          }}
        >
          {/* Mobile Menu Button */}
          {isMobile && !room && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ mb: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {room ? (
            <ChatRoom me={username} room={room} />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                p: 2,
              }}
            >
              <Typography variant="h4" textAlign="center">
                Welcome, {username}!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Select a room from the left or create one to get started.
              </Typography>

              {/* Quick Actions */}
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={isMobile}
                  onClick={() => setOpenCreate(true)}
                >
                  + Create Room
                </Button>
                <Button
                  variant="outlined"
                  fullWidth={isMobile}
                  onClick={() => {
                    if (recentRooms.length > 0) {
                      const rand =
                        recentRooms[
                          Math.floor(Math.random() * recentRooms.length)
                        ];
                      joinRoom(rand);
                    }
                  }}
                >
                  🎲 Join Random
                </Button>
              </Box>

              {/* Dashboard Grid */}
              <Grid
                container
                spacing={3}
                justifyContent="center"
                maxWidth="md"
              >
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6">Online Users</Typography>
                      <Typography variant="h4" color="primary">
                        {onlineUsers.length}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <List dense>
                        {onlineUsers.map((u, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={u} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Recent Rooms
                      </Typography>
                      <Divider sx={{ mb: 1 }} />
                      <List dense>
                        {recentRooms.map((r, idx) => (
                          <ListItem
                            key={idx}
                            button
                            onClick={() => joinRoom(r)}
                          >
                            <Badge
                              color="secondary"
                              badgeContent={unread[r] || 0}
                              invisible={!unread[r]}
                            >
                              <ListItemText primary={r} />
                            </Badge>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Active Rooms
                      </Typography>
                      <Divider sx={{ mb: 1 }} />
                      <List dense>
                        {Object.entries(activeRooms).map(([r, count]) => (
                          <ListItem key={r}>
                            <ListItemText
                              primary={`${r} (${count} messages)`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>

      {/* Create Room Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create a Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Room Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreateRoom} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
