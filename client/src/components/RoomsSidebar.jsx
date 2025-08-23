import React, { useEffect, useState, useContext } from "react";
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
import axios from "axios";
import { SocketContext } from "../context/SocketContext";

const RoomsSidebar = ({ setRoomId }) => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(true);
  const  socket = useContext(SocketContext);
 

  const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  axios
    .get("http://localhost:5000/api/rooms")
    .then((res) => setRooms(res.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);

  const handleJoinRoom = (roomId) => {
  if (!socket || !socket.connected) {
    console.warn("Socket not ready yet");
    return;
  }
  socket.emit("joinRoom", roomId);
  setRoomId(roomId);
};


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
        onClick={() => handleJoinRoom(room._id)}
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

{!socket || !socket.connected ? (
  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
    Connecting to server...
  </Typography>
) : null}


  
</Collapse>

    </Box>
  );
};

export default RoomsSidebar;
