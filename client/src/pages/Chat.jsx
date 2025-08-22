// src/pages/Home.jsx
import { Container, Paper, Typography, Box } from "@mui/material";
import JoinForm from "../components/JoinForm";

export default function Home({ onJoin }) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          Welcome to Real-Time Chat 🚀
        </Typography>

        <Box mt={3}>
          <JoinForm onJoin={onJoin} />
        </Box>
      </Paper>
    </Container>
  );
}
