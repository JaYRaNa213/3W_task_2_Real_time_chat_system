// client/src/components/DirectMessages/DirectMessagesList.jsx
// Lists all DM conversations for the logged-in user

import React, { useState, useContext } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Plus } from "lucide-react";
import DirectMessageItem from "./DirectMessageItem";
import NewChatModal from "./NewChatModal";
import { ConversationContext } from "../../context/ConversationContext";

export default function DirectMessagesList({ activeConversationId }) {
  const { conversations, openConversation } = useContext(ConversationContext);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter only DMs
  const dms = conversations.filter((c) => c.type === "direct_message");

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
          Direct Messages
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
      {dms.length === 0 ? (
        <Box
          onClick={() => setModalOpen(true)}
          sx={{
            px: 1.5,
            py: 2,
            borderRadius: 2,
            border: "1px dashed rgba(255,255,255,0.1)",
            textAlign: "center",
            cursor: "pointer",
            "&:hover": { border: "1px dashed rgba(126,87,194,0.4)", bgcolor: "rgba(126,87,194,0.04)" },
            transition: "all 0.2s",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            No messages yet. Click + to start a chat.
          </Typography>
        </Box>
      ) : (
        dms.map((conv) => (
          <DirectMessageItem
            key={conv._id}
            conversation={conv}
            active={conv._id === activeConversationId}
            onClick={() => openConversation(conv)}
          />
        ))
      )}

      {/* New Chat Modal */}
      <NewChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
