import React from "react";
import { Box, Typography, styled } from "@mui/material";
import { Hash } from "lucide-react";
import { motion } from "framer-motion";

const RoomItem = styled(motion.div)(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "4px",
  transition: "all 0.2s ease",
  backgroundColor: active ? "rgba(126, 87, 194, 0.15)" : "transparent",
  color: active ? "#fff" : theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: active ? "rgba(126, 87, 194, 0.2)" : "rgba(255,255,255,0.05)",
    color: "#fff",
  },
}));

export default function RoomsSidebar({ onSelectRoom, recentRooms, activeRoom }) {
  if (!recentRooms || recentRooms.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
        No rooms available.
      </Typography>
    );
  }

  return (
    <Box>
      {recentRooms.map((roomName) => {
        const isActive = activeRoom === roomName;
        return (
          <RoomItem
            key={roomName}
            active={isActive ? 1 : 0}
            onClick={() => onSelectRoom(roomName)}
            whileTap={{ scale: 0.98 }}
          >
            <Hash size={18} style={{ marginRight: 10, opacity: isActive ? 1 : 0.7 }} />
            <Typography variant="body2" fontWeight={isActive ? 600 : 500} sx={{ flex: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
              {roomName}
            </Typography>
          </RoomItem>
        );
      })}
    </Box>
  );
}
