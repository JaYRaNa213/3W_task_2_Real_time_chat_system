import React, { useContext } from "react";
import { Box, Typography, Button, Container, Grid, useTheme, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { MessageSquare, Zap, Users, Shield, ArrowRight } from "lucide-react";

const MotionBox = motion.create(Box);

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <MotionBox
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    sx={{
      p: 4,
      borderRadius: 4,
      bgcolor: "rgba(255, 255, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 2,
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        bgcolor: "rgba(255, 255, 255, 0.04)",
        borderColor: "primary.main",
        boxShadow: "0 10px 40px rgba(126, 87, 194, 0.15)",
      },
    }}
  >
    <Box
      sx={{
        p: 1.5,
        borderRadius: 3,
        bgcolor: "rgba(126, 87, 194, 0.1)",
        color: "primary.light",
      }}
    >
      <Icon size={28} />
    </Box>
    <Typography variant="h5" fontWeight="700">
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
      {desc}
    </Typography>
  </MotionBox>
);

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { loginAsGuest } = useContext(AuthContext);

  const handleContinueAsGuest = () => {
    const guestName = `G${Math.floor(1000 + Math.random() * 9000)}`;
    loginAsGuest(guestName);
    navigate("/chat");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Background Gradients */}
      <Box
        sx={{
          position: "fixed",
          top: "-20%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "-20%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      {/* Navbar Minimal */}
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
        <Box
          sx={{
            py: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7E57C2 0%, #00E5FF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare size={18} color="#fff" />
            </Box>
            <Typography variant="h6" fontWeight="800" sx={{ letterSpacing: "-0.5px" }}>
              RT Chat
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => navigate("/login")}
              sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
            >
              Sign In
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10, pt: { xs: 8, md: 16 }, pb: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 0.75,
                  borderRadius: "full",
                  bgcolor: "rgba(126, 87, 194, 0.1)",
                  border: "1px solid rgba(126, 87, 194, 0.3)",
                  mb: 3,
                }}
              >
                <Typography variant="body2" color="primary.light" fontWeight="600">
                  ✨ The Next Generation of Messaging
                </Typography>
              </Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "3rem", md: "5rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  background: "linear-gradient(to right, #fff, #9CA3AF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Connect faster. <br />
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #B085F5 0%, #00E5FF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Collaborate better.
                </Box>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 5, maxWidth: "90%", lineHeight: 1.6, fontWeight: 400 }}
              >
                Experience real-time communication with unparalleled speed, beautiful design, and absolute security.
                Built for teams who demand the best.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/register")}
                  endIcon={<ArrowRight />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    borderRadius: "14px",
                  }}
                >
                  Start Chatting Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleContinueAsGuest}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    borderRadius: "14px",
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.5)",
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  Try as Guest
                </Button>
              </Box>
            </MotionBox>
          </Grid>
          
          <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              sx={{ perspective: 1000 }}
            >
              {/* Mock Chat UI */}
              <Box
                sx={{
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "linear-gradient(145deg, rgba(25,25,30,0.8) 0%, rgba(10,10,12,0.9) 100%)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                  overflow: "hidden",
                  transform: "rotate3d(1, -1, 0, 15deg)",
                }}
              >
                <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#ef4444" }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#eab308" }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#22c55e" }} />
                </Box>
                <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "primary.main", opacity: 0.8 }} />
                    <Box sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 3, p: 2 }}>
                      <Box sx={{ width: "40%", height: 12, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 1, mb: 1 }} />
                      <Box sx={{ width: "80%", height: 12, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1 }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, flexDirection: "row-reverse" }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "secondary.main", opacity: 0.8 }} />
                    <Box sx={{ width: "60%", bgcolor: "primary.dark", borderRadius: 3, p: 2 }}>
                      <Box sx={{ width: "100%", height: 12, bgcolor: "rgba(255,255,255,0.3)", borderRadius: 1, mb: 1 }} />
                      <Box sx={{ width: "70%", height: 12, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 1 }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "primary.main", opacity: 0.8 }} />
                    <Box sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 3, p: 2 }}>
                      <Box sx={{ width: "50%", height: 12, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 1 }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 12, position: "relative", zIndex: 10, bgcolor: "rgba(0,0,0,0.3)" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h2" fontWeight="800" sx={{ mb: 2 }}>
              Everything you need.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
              Powerful features packed into an elegant, distraction-free interface.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                desc="Built on WebSockets for instant message delivery. No more waiting, refreshing, or delayed notifications."
                delay={0.1}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={Users}
                title="Multi-Room Workspaces"
                desc="Organize conversations into channels. Switch between contexts seamlessly with zero lag."
                delay={0.3}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={Shield}
                title="Secure by Default"
                desc="Enterprise-grade JWT authentication and secure database storage keeps your conversations private."
                delay={0.5}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
