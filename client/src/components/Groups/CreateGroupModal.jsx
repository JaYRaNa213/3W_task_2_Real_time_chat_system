// client/src/components/Groups/CreateGroupModal.jsx
// Dialog to create a new invite-only group conversation

import React, { useState, useContext } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography,
} from "@mui/material";
import { Users } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { ConversationContext } from "../../context/ConversationContext";
import { createGroup } from "../../api/conversations";

export default function CreateGroupModal({ open, onClose }) {
  const { user } = useContext(AuthContext);
  const { addConversation, openConversation } = useContext(ConversationContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) { setError("Group name is required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await createGroup(user.token, {
        name: name.trim(),
        description: description.trim(),
        participantIds: [],
      });
      addConversation(res.data);
      openConversation(res.data);
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

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
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid rgba(255,255,255,0.06)", pb: 2 }}>
        <Users size={20} color="#7e57c2" />
        <Typography variant="h6" fontWeight={700}>Create Group</Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        {error && (
          <Typography variant="body2" color="error.main" sx={{ mb: 1.5 }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          required
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 60 }}
        />
        <TextField
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 200 }}
        />
        <Typography variant="caption" color="text.secondary">
          You can invite members after creating the group.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ borderColor: "rgba(255,255,255,0.12)" }}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={loading || !name.trim()}
          sx={{ bgcolor: "primary.main", fontWeight: 600 }}
        >
          {loading ? "Creating…" : "Create Group"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Cache invalidation comment
