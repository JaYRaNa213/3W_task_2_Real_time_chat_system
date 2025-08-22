// src/components/JoinForm.jsx
import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
} from "@mui/material";

export default function JoinForm({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");
  const [error, setError] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const cleanRoom = room.trim().toLowerCase().replace(/\s+/g, "-");

    if (!cleanUsername || !cleanRoom) {
      setError("Both fields are required!");
      return;
    }

    if (typeof onJoin === "function") {
      onJoin({ username: cleanUsername, room: cleanRoom });
      setError("");
    } else {
      console.warn("⚠️ onJoin prop not provided!");
      setError("Join action is not available right now.");
    }
  };

  return (
    <Box component="form" onSubmit={handleJoin} sx={{ mt: 1 }}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Your Name"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Room"
          variant="outlined"
          fullWidth
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!username.trim() || !room.trim()}
          sx={{
            borderRadius: 3,
            py: 1.4,
            textTransform: "none",
            fontWeight: "bold",
            background:
              "linear-gradient(90deg, #6366F1 0%, #9333EA 50%, #EC4899 100%)",
            "&:hover": {
              background:
                "linear-gradient(90deg, #4F46E5 0%, #7E22CE 50%, #DB2777 100%)",
            },
          }}
          fullWidth
        >
          Join
        </Button>
      </Stack>
    </Box>
  );
}
