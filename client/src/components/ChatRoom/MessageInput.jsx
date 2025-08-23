import React, { useState, useContext } from "react";
import { Box, TextField, Button } from "@mui/material";
import { SocketContext } from "../../context/SocketContext";

const MessageInput = ({ roomId, username }) => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && socket) {
      socket.emit("chatMessage", { roomId, username, message });
      setMessage("");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { username, roomId, isTyping: e.target.value.length > 0 });
  };

  return (
    <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #ddd" }}>
      <TextField
        value={message}
        onChange={handleTyping}
        fullWidth
        placeholder="Type a message..."
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <Button onClick={handleSend} variant="contained" sx={{ ml: 1 }}>
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
