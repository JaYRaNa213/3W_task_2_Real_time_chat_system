// client/src/components/DirectMessages/DirectMessageItem.jsx
// Single DM list item with avatar, name, last message, unread badge, and online dot

import React, { useContext } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { ConversationContext } from "../../context/ConversationContext";

const MotionBox = motion.create(Box);

export default function DirectMessageItem({ conversation, active, onClick }) {
  const { user } = useContext(AuthContext);
  const { unreadCounts, onlineUsers } = useContext(ConversationContext);

  // Determine the peer (the other person in DM)
  const peer = conversation.participants?.find(
    (p) => p._id !== user?._id && p.username !== user?.username
  );
  const displayName = peer?.username || conversation.name || "Unknown";
  const initials = displayName.charAt(0).toUpperCase();

  const unread = unreadCounts[conversation._id] || 0;
  const isOnline = onlineUsers[conversation._id]?.includes(peer?._id);
  const lastMsg = conversation.lastMessage;

  return (
    <MotionBox
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 1,
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: active ? "rgba(126,87,194,0.15)" : "transparent",
        border: active ? "1px solid rgba(126,87,194,0.3)" : "1px solid transparent",
        transition: "all 0.15s ease",
        "&:hover": {
          bgcolor: active ? "rgba(126,87,194,0.18)" : "rgba(255,255,255,0.04)",
        },
        mb: 0.5,
      }}
    >
      {/* Avatar with online indicator */}
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: active ? "primary.main" : "rgba(255,255,255,0.12)",
            fontSize: "0.95rem",
            fontWeight: 700,
          }}
        >
          {peer?.avatar ? (
            <img src={peer.avatar} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : initials}
        </Avatar>
        {/* Online dot */}
        <Box
          sx={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: isOnline ? "#10B981" : "#6b7280",
            border: "2px solid #121212",
          }}
        />
      </Box>

      {/* Text */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="body2"
            fontWeight={unread > 0 ? 700 : 500}
            sx={{ color: active ? "#fff" : "text.primary", noWrap: true }}
            noWrap
          >
            {displayName}
          </Typography>
          {lastMsg?.createdAt && (
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 0.5, fontSize: "0.7rem" }}>
              {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
            {lastMsg?.content || "No messages yet"}
          </Typography>
          {unread > 0 && (
            <Box
              sx={{
                ml: 0.5,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontSize: "0.65rem", color: "#fff", fontWeight: 700, px: 0.5 }}>
                {unread > 99 ? "99+" : unread}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </MotionBox>
  );
}

// Cache invalidation comment
