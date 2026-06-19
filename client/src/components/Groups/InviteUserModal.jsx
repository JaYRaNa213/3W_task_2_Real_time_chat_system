// client/src/components/Groups/InviteUserModal.jsx
// Modal to invite a user to a group conversation

import React, { useState, useContext } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, TextField, Box,
} from "@mui/material";
import { UserPlus } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { sendInvitation } from "../../api/invitations";
import SearchBar from "../Shared/SearchBar";

export default function InviteUserModal({ open, onClose, conversationId, conversationName }) {
  const { user } = useContext(AuthContext);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async () => {
    if (!receiverId.trim()) { setError("Enter a user ID"); return; }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await sendInvitation(user.token, { conversationId, receiverId: receiverId.trim(), message });
      setSuccess("Invitation sent!");
      setReceiverId("");
      setMessage("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => { onClose(); setSuccess(""); setError(""); }}
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
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid rgba(255,255,255,0.06)", pb: 2 }}>
        <UserPlus size={20} color="#7e57c2" />
        <Typography variant="h6" fontWeight={700}>Invite to {conversationName}</Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        {error && <Typography color="error.main" variant="body2" sx={{ mb: 1 }}>{error}</Typography>}
        {success && <Typography color="success.main" variant="body2" sx={{ mb: 1 }}>{success}</Typography>}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use the search bar to find a user, then copy their ID to invite them.
        </Typography>
        <Box sx={{ mb: 2 }}>
          <SearchBar placeholder="Search users..." />
        </Box>
        <TextField
          label="User ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Paste user's ID here"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Personal message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          size="small"
          inputProps={{ maxLength: 200 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={loading || !receiverId.trim()}
          sx={{ bgcolor: "primary.main", fontWeight: 600 }}
        >
          {loading ? "Sending…" : "Send Invite"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
