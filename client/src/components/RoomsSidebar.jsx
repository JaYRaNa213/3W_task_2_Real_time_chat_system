import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  Typography,
  IconButton,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import http from "../api/http"; // axios instance

const RoomsSidebar = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");

  const isMobile = useMediaQuery("(max-width:600px)");

  // fetch rooms
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
    if (isMobile) setOpen(false); // collapsed by default on mobile
  }, [isMobile]);

  const toggleSidebar = () => setOpen((prev) => !prev);

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
      fetchRooms(); // refresh list
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  return (
    <Box
      sx={{
        width: open ? (isMobile ? "70vw" : 250) : 60,
        position: isMobile ? "fixed" : "relative",
        left: open ? 0 : isMobile ? "-70vw" : 0,
        top: 0,
        zIndex: 20,
        borderRight: "1px solid #ddd",
        transition: "all 0.3s",
        p: 2,
        bgcolor: "#386077ff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toggle Sidebar */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "absolute",
          top: 10,
          right: open ? -20 : -10,
          bgcolor: "#fff",
          border: "1px solid #ddd",
          "&:hover": { bgcolor: "#eee" },
          zIndex: 25,
        }}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Rooms List */}
      <Collapse in={open} sx={{ flex: 1, overflowY: "auto" }}>
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
                onClick={() => {
                  onSelectRoom(room.name);
                  if (isMobile) setOpen(false); // close sidebar after selecting room on mobile
                }}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  "&:hover": {
                    bgcolor: "#e0f7fa",
                    color: "#006064",
                    transform: "scale(1.03)",
                    transition: "all 0.2s",
                  },
                  fontSize: isMobile ? "0.9rem" : "inherit",
                }}
              >
                {room.name}
              </ListItemButton>
            ))}
          </List>
        )}
      </Collapse>

      {/* Create Room Button at Bottom */}
      {open && (
        <Box sx={{ mt: "auto" }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: 2,
              bgcolor: "#006064",
              "&:hover": { bgcolor: "#004d4d" },
            }}
            onClick={() => setOpenDialog(true)}
          >
            + Create Room
          </Button>
        </Box>
      )}

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
