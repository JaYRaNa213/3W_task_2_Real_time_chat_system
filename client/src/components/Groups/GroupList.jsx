// client/src/components/Groups/GroupList.jsx
// Sidebar section listing all group conversations with create button

import React, { useState, useContext } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Plus } from "lucide-react";
import GroupCard from "./GroupCard";
import CreateGroupModal from "./CreateGroupModal";
import { ConversationContext } from "../../context/ConversationContext";

export default function GroupList({ activeConversationId }) {
  const { conversations, openConversation } = useContext(ConversationContext);
  const [modalOpen, setModalOpen] = useState(false);

  const groups = conversations.filter((c) => c.type === "group");

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, px: 0.5 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem" }}
        >
          Groups
        </Typography>
        <Tooltip title="Create Group">
          <IconButton
            size="small"
            onClick={() => setModalOpen(true)}
            sx={{ color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "rgba(126,87,194,0.1)" } }}
          >
            <Plus size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      {groups.length === 0 ? (
        <Box
          onClick={() => setModalOpen(true)}
          sx={{
            px: 1.5, py: 2, borderRadius: 2,
            border: "1px dashed rgba(255,255,255,0.1)",
            textAlign: "center", cursor: "pointer",
            "&:hover": { border: "1px dashed rgba(126,87,194,0.4)", bgcolor: "rgba(126,87,194,0.04)" },
            transition: "all 0.2s",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            No groups yet. Click + to create one.
          </Typography>
        </Box>
      ) : (
        groups.map((conv) => (
          <GroupCard
            key={conv._id}
            conversation={conv}
            active={conv._id === activeConversationId}
            onClick={() => openConversation(conv)}
          />
        ))
      )}

      <CreateGroupModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
