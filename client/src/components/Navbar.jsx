import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, loginAsGuest, logout } = useContext(AuthContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isLoggedIn = !!user && !user.isGuest;
  const isGuest = !!user && user.isGuest;
  const username = user?.username ?? null;

  const handleLogout = () => {
    logout();
    navigate("/"); // back to home after any logout
  };

  const handleSwitchGuest = () => {
    const newGuest = `G${Math.floor(1000 + Math.random() * 9000)}`;
    loginAsGuest(newGuest);
    navigate("/chat");
  };

  // Base routes everyone can see
  const baseNav = [
    { label: "Home", path: "/" },
    { label: "Chat", path: "/chat" },
  ];

  // Only show Login/Register when not logged-in (unauth or guest)
  const authNav = (!isLoggedIn)
    ? [
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ]
    : [];

  const navItems = [...baseNav, ...authNav];

  return (
    <>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            3W Real Time Chat
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}

              {/* Logged-in user controls */}
              {isLoggedIn && (
                <>
                  <Typography variant="body1" sx={{ mx: 2, fontWeight: "bold" }}>
                    {username}
                  </Typography>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}

              {/* Guest controls */}
              {isGuest && (
                <>
                  <Typography variant="body1" sx={{ mx: 2, fontWeight: "bold" }}>
                    {username} (Guest)
                  </Typography>
                  <Button color="inherit" onClick={handleSwitchGuest}>
                    Switch Guest
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout Guest
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, display: "flex", flexDirection: "column", height: "100%" }}>
          <List>
            {[...navItems].map((item) => (
              <ListItem
                key={item.label}
                button
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            {/* Logged-in user */}
            {isLoggedIn && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText primary={username} />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}

            {/* Guest user */}
            {isGuest && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText primary={`${username} (Guest)`} />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    handleSwitchGuest();
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary="Switch Guest" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary="Logout Guest" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
