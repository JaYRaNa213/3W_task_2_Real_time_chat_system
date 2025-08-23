import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

const MessageList = ({ messages, me }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
      {messages.map((m, idx) => {
        const mine = m.senderName === me;
        const isSystem = m.senderName === "System"; // ✅ define inside map

        return (
          <Box
            key={m._id || `${m.createdAt}-${m.senderName}-${idx}`}
            sx={{ mb: 1, textAlign: mine ? "right" : "left" }}
          >
            <Typography variant="caption" color="text.secondary">
              {mine ? "You" : m.senderName}
            </Typography>
            <Typography
              sx={{
                display: "inline-block",
                bgcolor: isSystem ? "#f0f0f0" : mine ? "#1976d2" : "#e0e0e0",
                color: isSystem ? "#555" : mine ? "white" : "black",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "70%",
                fontStyle: isSystem ? "italic" : "normal",
              }}
            >
              {m.text}
            </Typography>
          </Box>
        );
      })}
      <div ref={bottomRef} />
    </Box>
  );
};

export default MessageList;
