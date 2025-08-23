import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

const MessageList = ({ messages, username }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
      {messages.map((msg, idx) => (
        <Box
          key={idx}
          sx={{
            mb: 1,
            textAlign: msg.username === username ? "right" : "left",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {msg.username}
          </Typography>
          <Typography
            sx={{
              display: "inline-block",
              bgcolor: msg.username === username ? "#1976d2" : "#e0e0e0",
              color: msg.username === username ? "white" : "black",
              px: 2,
              py: 1,
              borderRadius: 2,
              maxWidth: "70%",
            }}
          >
            {msg.message}
          </Typography>
        </Box>
      ))}
      <div ref={bottomRef} />
    </Box>
  );
};

export default MessageList;
