import React, { useState } from "react";
import { Box, Typography, Button, Card, CardContent, Grid, List, ListItem, ListItemText } from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import RoomsSidebar from "../components/RoomsSidebar";
import ChatRoom from "../components/ChatRoom/ChatRoom";

const Chat = () => {
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "Guest";

  const [roomId, setRoomId] = useState(null);

  // Dummy data (replace with API later if needed)
  const recentRooms = ["General", "Private Room", "NewRoomName", "Fun Room"];
  const onlineCount = 8; // example count

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", bgcolor: "#f5f6fa" }}>
        {/* Rooms Sidebar */}
        <RoomsSidebar setRoomId={setRoomId} />

        {/* Chat Window */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {roomId ? (
            <ChatRoom roomId={roomId} username={username} />
          ) : (
            // 📌 Dashboard when no room is selected
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                bgcolor: "#fff",
                borderRadius: 2,
                m: 2,
              }}
            >
              <Typography variant="h4" sx={{ mb: 2 }}>
                👋 Welcome, {username}!
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
                Select a room from the left or create one to get started.
              </Typography>

              {/* Quick Actions */}
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Button variant="contained" color="primary">
                  + Create Room
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setRoomId("General")}>
                  Join General
                </Button>
              </Box>

              {/* Dashboard Grid */}
              <Grid container spacing={3} justifyContent="center" maxWidth="md">
                {/* Card 1: Stats */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6">Online Users</Typography>
                      <Typography variant="h4" color="primary">
                        {onlineCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Card 2: Recent Rooms */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Recent Rooms
                      </Typography>
                      <List dense>
                        {recentRooms.map((room, idx) => (
                          <ListItem
                            key={idx}
                            button
                            onClick={() => setRoomId(room)}
                          >
                            <ListItemText primary={room} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Card 3: Tips */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        💡 Tips
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        - Create private rooms for group discussions.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        - Use emojis to make chats fun 🎉
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        - See who’s online in the right sidebar.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
