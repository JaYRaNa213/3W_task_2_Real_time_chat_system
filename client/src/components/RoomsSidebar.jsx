import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import http from "../api/http"; // use your axios instance

const RoomsSidebar = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    http
      .get("/api/rooms")
      .then((res) => setRooms(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <Box
      sx={{
        width: open ? 250 : 60,
        borderRight: "1px solid #ddd",
        transition: "width 0.3s",
        p: 2,
        position: "relative",
        bgcolor: "#f5f5f5",
        height: "100vh",
      }}
    >
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "absolute",
          top: 10,
          right: open ? -20 : -10,
          bgcolor: "#fff",
          border: "1px solid #ddd",
          "&:hover": { bgcolor: "#eee" },
        }}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <Collapse in={open}>
        <Typography variant="h6" gutterBottom>
          Rooms
        </Typography>

        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading rooms...
          </Typography>
        ) : (
          <List>
            {rooms.map((room) => (
              <ListItemButton
                key={room._id}
                onClick={() => onSelectRoom(room.name)} // use NAME as room key
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  "&:hover": {
                    bgcolor: "#e0f7fa",
                    color: "#006064",
                    transform: "scale(1.03)",
                    transition: "all 0.2s",
                  },
                }}
              >
                {room.name}
              </ListItemButton>
            ))}
          </List>
        )}
      </Collapse>
    </Box>
  );
};

export default RoomsSidebar;
