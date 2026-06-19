// client/src/components/Groups/GroupCard.jsx
// Single group item in the sidebar list

import React, { useContext } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { ConversationContext } from "../../context/ConversationContext";

const MotionBox = motion.create(Box);

export default function GroupCard({ conversation, active, onClick }) {
  const { unreadCounts } = useContext(ConversationContext);
  const unread = unreadCounts[conversation._id] || 0;
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
      <Avatar
        sx={{
          width: 38,
          height: 38,
          bgcolor: active ? "primary.dark" : "rgba(255,255,255,0.08)",
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        {conversation.avatar ? (
          <img src={conversation.avatar} alt={conversation.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Users size={18} color={active ? "#fff" : "rgba(255,255,255,0.5)"} />
        )}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" fontWeight={unread > 0 ? 700 : 500} noWrap>
            {conversation.name}
          </Typography>
          {lastMsg?.createdAt && (
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 0.5, fontSize: "0.7rem" }}>
              {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
            {conversation.participants?.length || 0} members
            {lastMsg?.content ? ` · ${lastMsg.content}` : ""}
          </Typography>
          {unread > 0 && (
            <Box sx={{ ml: 0.5, minWidth: 18, height: 18, borderRadius: 9, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
