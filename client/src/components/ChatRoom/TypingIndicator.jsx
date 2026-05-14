import React from "react";
import { Typography, Box } from "@mui/material";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const TypingIndicator = ({ typingUsers = [] }) => {
  if (!typingUsers || typingUsers.length === 0) return null;

  let usersText = typingUsers[0];
  if (typingUsers.length === 2) {
    usersText = `${typingUsers[0]} and ${typingUsers[1]}`;
  } else if (typingUsers.length > 2) {
    usersText = `${typingUsers[0]} and ${typingUsers.length - 1} others`;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        p: 1,
        background: "rgba(0,0,0,0.05)",
        borderRadius: 2,
        maxWidth: "fit-content",
        mt: 1,
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {usersText} {typingUsers.length > 1 ? "are" : "is"} typing
      </Typography>

      {/* Animated Dots */}
      <Box display="flex" gap={0.5}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "gray",
              animation: `${bounce} 1.4s infinite ease-in-out`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingIndicator;
