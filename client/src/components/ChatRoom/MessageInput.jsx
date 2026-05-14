import React, { useState } from "react";
import { Box, InputBase, IconButton } from "@mui/material";
import { Send, Smile, Paperclip } from "lucide-react";
import { motion } from "framer-motion";

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping(true);
    // basic debounce simulation for stopping typing
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText("");
      onTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSend}
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "rgba(255, 255, 255, 0.03)",
        borderRadius: "24px",
        p: "6px 12px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(10px)",
        transition: "all 0.2s ease",
        "&:focus-within": {
          borderColor: "primary.main",
          boxShadow: "0 0 0 2px rgba(126, 87, 194, 0.2)",
          bgcolor: "rgba(255, 255, 255, 0.05)",
        },
      }}
    >
      <IconButton size="small" sx={{ color: "text.secondary", mr: 1, "&:hover": { color: "text.primary", bgcolor: "transparent" } }}>
        <Paperclip size={20} />
      </IconButton>
      
      <InputBase
        placeholder="Message..."
        fullWidth
        multiline
        maxRows={4}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        sx={{
          color: "text.primary",
          fontSize: "0.95rem",
          py: 1,
          "& .MuiInputBase-input": {
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }
        }}
      />

      <IconButton size="small" sx={{ color: "text.secondary", mx: 1, "&:hover": { color: "text.primary", bgcolor: "transparent" } }}>
        <Smile size={20} />
      </IconButton>

      <motion.div whileTap={{ scale: 0.9 }}>
        <IconButton
          type="submit"
          disabled={!text.trim()}
          sx={{
            bgcolor: text.trim() ? "primary.main" : "rgba(255,255,255,0.05)",
            color: text.trim() ? "#fff" : "text.disabled",
            p: 1.2,
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: text.trim() ? "primary.dark" : "rgba(255,255,255,0.05)",
            },
          }}
        >
          <Send size={18} />
        </IconButton>
      </motion.div>
    </Box>
  );
}
