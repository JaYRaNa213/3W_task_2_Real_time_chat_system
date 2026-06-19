// client/src/components/DirectMessages/NewChatModal.jsx
// Modal to search for a user and start a new DM conversation

import React, { useState, useContext } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, CircularProgress,
} from "@mui/material";
import { MessageCirclePlus } from "lucide-react";
import SearchBar from "../Shared/SearchBar";
import { AuthContext } from "../../context/AuthContext";
import { ConversationContext } from "../../context/ConversationContext";

export default function NewChatModal({ open, onClose }) {
  const { user } = useContext(AuthContext);
  const { conversations } = useContext(ConversationContext);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1a1a2e",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 3,
          boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          pb: 2,
        }}
      >
        <MessageCirclePlus size={20} color="#7e57c2" />
        <Typography variant="h6" fontWeight={700}>
          New Direct Message
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Search for a user to start a private conversation.
        </Typography>
        {/* SearchBar handles user search + DM creation internally */}
        <SearchBar placeholder="Search by username..." />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>
          Click the message icon next to a user to open the chat.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderColor: "rgba(255,255,255,0.12)" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
