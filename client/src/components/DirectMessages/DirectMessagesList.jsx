// client/src/components/DirectMessages/DirectMessagesList.jsx
// Lists all DM conversations for the logged-in user

import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, IconButton, Tooltip, Avatar, CircularProgress } from "@mui/material";
import { Plus } from "lucide-react";
import DirectMessageItem from "./DirectMessageItem";
import NewChatModal from "./NewChatModal";
import { ConversationContext } from "../../context/ConversationContext";
import { AuthContext } from "../../context/AuthContext";
import { searchUsers } from "../../api/users";
import { startDM } from "../../api/conversations";

export default function DirectMessagesList({ activeConversationId }) {
  const { user } = useContext(AuthContext);
  const { conversations, addConversation, openConversation } = useContext(ConversationContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Filter only DMs
  const dms = conversations.filter((c) => c.type === "direct_message");

  // Fetch all users on mount
  useEffect(() => {
    if (!user?.token) return;
    setLoadingUsers(true);
    searchUsers(user.token, "")
      .then((res) => {
        // Filter out users that already have a DM with me
        const existingPeerIds = new Set(
          dms.flatMap(c => c.participants.map(p => p._id || p))
        );
        const filtered = (res.data || []).filter(u => !existingPeerIds.has(u._id));
        setOtherUsers(filtered);
      })
      .catch(console.error)
      .finally(() => setLoadingUsers(false));
  }, [user?.token, dms]);

  const handleStartDM = async (targetUser) => {
    if (!user?.token) return;
    try {
      const res = await startDM(user.token, targetUser._id);
      addConversation(res.data);
      openConversation(res.data);
    } catch (err) {
      console.error("Failed to start DM", err);
    }
  };

  return (
    <>
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          px: 0.5,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem" }}
        >
          Active DMs
        </Typography>
        <Tooltip title="New Chat">
          <IconButton
            size="small"
            onClick={() => setModalOpen(true)}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main", bgcolor: "rgba(126,87,194,0.1)" },
            }}
          >
            <Plus size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* DM list */}
      {dms.map((conv) => (
        <DirectMessageItem
          key={conv._id}
          conversation={conv}
          active={conv._id === activeConversationId}
          onClick={() => openConversation(conv)}
        />
      ))}

      {/* Other Users list */}
      {otherUsers.length > 0 && (
        <>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem", display: "block", mt: 2, mb: 1, px: 0.5 }}
          >
            All Users
          </Typography>
          {otherUsers.map((u) => (
            <Box
              key={u._id}
              onClick={() => handleStartDM(u)}
              sx={{
                display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1,
                borderRadius: 2, cursor: "pointer", mb: 0.5,
                border: "1px solid transparent",
                transition: "all 0.15s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }
              }}
            >
              <Avatar sx={{ width: 38, height: 38, bgcolor: "rgba(255,255,255,0.12)", fontSize: "0.95rem", fontWeight: 700 }}>
                {u.avatar ? (
                  <img src={u.avatar} alt={u.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  u.username.charAt(0).toUpperCase()
                )}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500} noWrap color="text.primary">
                  {u.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tap to chat
                </Typography>
              </Box>
            </Box>
          ))}
        </>
      )}

      {dms.length === 0 && otherUsers.length === 0 && !loadingUsers && (
        <Box sx={{ px: 1.5, py: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            No other users found.
          </Typography>
        </Box>
      )}

      {loadingUsers && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={20} sx={{ color: "text.secondary" }} />
        </Box>
      )}

      {/* New Chat Modal */}
      <NewChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

// Cache invalidation comment
