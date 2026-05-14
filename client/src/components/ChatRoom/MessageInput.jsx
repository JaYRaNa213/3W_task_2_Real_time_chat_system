import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const MessageInput = ({ onSend, onTyping }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    onSend(text);
    setMessage("");
    onTyping(false);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setMessage(val);
    onTyping(val.length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        fullWidth
        placeholder="Type a message..."
      />
      <Button onClick={handleSend} variant="contained">
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
