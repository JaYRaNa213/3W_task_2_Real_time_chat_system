import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import http from "../api/http";

const RoomsSidebar = ({ onSelectRoom, recentRooms = [], unread = {} }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");

  // fetch rooms from server
  const fetchRooms = () => {
    setLoading(true);
    http
      .get("/api/rooms")
      .then((res) => setRooms(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      await http.post("/api/rooms", {
        name: newRoomName,
        description: newRoomDesc,
      });
      setNewRoomName("");
      setNewRoomDesc("");
      setOpenDialog(false);
      fetchRooms();
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Rooms
      </Typography>

      {loading ? (
        <Typography variant="body2" color="text.secondary">
          Loading rooms...
        </Typography>
      ) : (
        <List sx={{ flex: 1, overflowY: "auto" }}>
          {rooms.map((room) => (
            <ListItemButton
              key={room._id}
              onClick={() => onSelectRoom(room.name)}
              sx={{
                borderRadius: 1,
                mb: 1,
                "&:hover": { bgcolor: "#e0f7fa", color: "#006064" },
              }}
            >
              {room.name}
            </ListItemButton>
          ))}
        </List>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, borderRadius: 2, bgcolor: "#006064" }}
        onClick={() => setOpenDialog(true)}
      >
        + Create Room
      </Button>

      {/* Create Room Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create a New Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Room Name"
            margin="dense"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description (optional)"
            margin="dense"
            value={newRoomDesc}
            onChange={(e) => setNewRoomDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRoom}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomsSidebar;
