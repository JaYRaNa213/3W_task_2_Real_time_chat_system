// src/components/RoomsSidebar.jsx
import { useEffect, useState } from "react";
import { api } from "../api/http";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function RoomsSidebar({ currentRoom, onSwitch }) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");

  // Load rooms from backend
  async function loadRooms() {
    try {
      const { data } = await api.get("/api/rooms");
      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
    } catch (err) {
      console.error("Failed to load rooms:", err);
      setRooms([]);
    }
  }

  // Create a new room
  async function createRoom() {
    if (!newRoom.trim()) return;
    try {
      const { data } = await api.post("/api/rooms", { name: newRoom.trim() });
      setNewRoom("");
      await loadRooms();
      if (data?.name) onSwitch(data.name);
    } catch (err) {
      console.error("Failed to create room:", err);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          bgcolor: "grey.900",
          color: "white",
          borderRight: "none",
          p: 2,
        },
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          💬 Chat Rooms
        </Typography>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

        {/* Rooms List */}
        <List sx={{ flexGrow: 1, maxHeight: "60vh", overflowY: "auto" }}>
          {rooms.length > 0 ? (
            rooms.map((r) => (
              <ListItemButton
                key={r._id}
                selected={currentRoom === r.name}
                onClick={() => onSwitch(r.name)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                }}
              >
                <ListItemText primary={`#${r.name}`} />
              </ListItemButton>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic", px: 1 }}
            >
              No rooms yet
            </Typography>
          )}
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />

        {/* Create Room */}
        <Stack spacing={1.5}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="New room name"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            fullWidth
            InputProps={{
              sx: { bgcolor: "grey.800", borderRadius: 2, color: "white" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={createRoom}
            disabled={!newRoom.trim()}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            ➕ Create Room
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
