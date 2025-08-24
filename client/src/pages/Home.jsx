// Home.jsx
import React from "react";
import { Box, Typography, Grid, Card, Stack, Button } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    const guestName = `G${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem("username", guestName);
    localStorage.setItem("guest", "true");
    navigate("/chat");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f6fa",
          px: 2,
          py: 4,
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            3W Real Time Chat
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth={600}
            mx="auto"
          >
            Connect, communicate, and collaborate in real-time. Join conversations
            that matter with people around the world.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center" mb={4}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
              <BoltIcon sx={{ fontSize: 40, color: "#6c63ff", mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Real-time Messaging
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Instant message delivery with typing indicators and live updates
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
              <PeopleIcon sx={{ fontSize: 40, color: "#6c63ff", mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Multiple Rooms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join different chat rooms and switch between conversations seamlessly
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
              <PersonIcon sx={{ fontSize: 40, color: "#6c63ff", mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Guest Access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Jump right in without registration or create an account for personalization
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
            sx={{ minWidth: 150 }}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/register")}
            sx={{ minWidth: 150 }}
          >
            Register
          </Button>

          <Button
            variant="contained"
            onClick={handleContinueAsGuest}
            sx={{
              minWidth: 150,
              bgcolor: "#1e1e2f",
              "&:hover": { bgcolor: "#35355d" },
            }}
          >
            Continue as Guest
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
