
import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">ChatFlow</Typography>
        <Box>
          <Typography variant="body1" sx={{ mr: 2, display: "inline" }}>
            {username}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
