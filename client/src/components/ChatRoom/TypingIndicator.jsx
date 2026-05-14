import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function TypingIndicator({ typingUsers }) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : typingUsers.length === 2
      ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
      : `${typingUsers.length} people are typing...`;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 2, pt: 1, pb: 0.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic", display: "flex", alignItems: "center" }}>
        {text}
        <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </Box>
      </Typography>
    </Box>
  );
}
