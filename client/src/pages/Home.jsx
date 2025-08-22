// src/pages/Home.jsx
import { Paper, Typography } from "@mui/material";
import JoinForm from "../components/JoinForm";

export default function Home({ onJoin }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      <Paper
        elevation={10}
        sx={{
          p: 6,
          borderRadius: 4,
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #6366F1, #9333EA, #EC4899)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🚀 Welcome to Real-Time Chat
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your name and a room to start chatting!
        </Typography>

        <JoinForm onJoin={onJoin} />
      </Paper>
    </div>
  );
}
