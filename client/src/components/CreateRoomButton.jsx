import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import http from "../api/http";

const CreateRoomDialog = ({ onRoomCreated }) => {
  const [open, setOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      await http.post("/api/rooms", {
        name: newRoomName,
        description: newRoomDesc,
      });
      setNewRoomName("");
      setNewRoomDesc("");
      setOpen(false);
      if (onRoomCreated) onRoomCreated(newRoomName); // pass back the created room
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="contained"
        size="large"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 3,
          px: 4,
          py: 1.5,
          fontSize: "1.1rem",
          fontWeight: "bold",
          bgcolor: "#006064",
          borderWidth: 2,
          "&:hover": {
            background: "linear-gradient(45deg, #006064, #0097a7)",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 25px rgba(0, 96, 100, 0.3)",
          },
          transition: "all 0.3s ease",
        }}
      >
        + Create Room
      </Button>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRoom}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateRoomDialog;
