// components/Navbar.jsx
import React, { useState } from "react";
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

const Navbar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get username and guest flag from localStorage
  const username = localStorage.getItem("username");
  const isGuest = localStorage.getItem("guest") === "true";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Logout function (clears all user info)
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("guest");
    navigate("/login");
  };

  // Optional: Switch guest to a new guest user
  const handleSwitchGuest = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("guest");
    const newGuest = `G${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem("username", newGuest);
    localStorage.setItem("guest", "true");
    navigate("/chat");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Chat", path: "/chat" },
    { label: "Login", path: "/login" },
    { label: "Register", path: "/register" },
  ];

  return (
    <>
      <AppBar
  position="static"
  sx={{
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }}
>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    {/* App name */}
    <Typography
      variant="h6"
      sx={{ cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      3W Real Time Chat
    </Typography>

    {/* Desktop Navigation */}
    {!isMobile && (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {navItems.map((item) => (
          <Button
            key={item.label}
            color="inherit"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        ))}

        {username && !isGuest && (
          <>
            <Typography
              variant="body1"
              sx={{ mr: 2, ml: 2, fontWeight: "bold" }}
            >
              {username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}

        {isGuest && (
          <Typography
            variant="body1"
            sx={{ mr: 2, ml: 2, fontWeight: "bold" }}
          >
            {username} (Guest)
          </Typography>
        )}
      </Box>
    )}

    {/* Mobile Hamburger Menu */}
    {isMobile && (
      <IconButton
        color="inherit"
        edge="end"
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </IconButton>
    )}
  </Toolbar>
</AppBar>


      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            {/* Registered user logout */}
            {username && !isGuest && (
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

            {/* Guest display */}
            {isGuest && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText primary={`${username} (Guest)`} />
                </ListItem>
                <ListItem button onClick={handleSwitchGuest}>
                  <ListItemText primary="Switch Guest" />
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
