import React from "react";
import { Typography, Box } from "@mui/material";

const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
      </Typography>
    </Box>
  );
};

export default TypingIndicator;
