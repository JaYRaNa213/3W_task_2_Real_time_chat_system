import React, { useState } from "react";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography, IconButton, useTheme
} from "@mui/material";
import { X, Hash, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import http from "../api/http";

export default function CreateRoomDialog({ onRoomCreated, variant = "button" }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      await http.post("/api/rooms", {
        name: newRoomName.replace(/\s+/g, '-').toLowerCase(), // format as channel name
        description: newRoomDesc,
      });
      const finalName = newRoomName.replace(/\s+/g, '-').toLowerCase();
      setNewRoomName("");
      setNewRoomDesc("");
      setOpen(false);
      if (onRoomCreated) onRoomCreated(finalName);
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <IconButton size="small" onClick={() => setOpen(true)} sx={{ color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: "rgba(255,255,255,0.05)" } }}>
          <Plus size={16} />
        </IconButton>
      ) : (
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setOpen(true)}>
          Create New Channel
        </Button>
      )}

      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
              component: motion.div,
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.95 },
              sx: {
                bgcolor: "background.paper",
                backgroundImage: "none",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                width: "100%",
                maxWidth: 400,
                m: 2,
              }
            }}
          >
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography variant="h6" fontWeight="700">Create a Channel</Typography>
              <IconButton size="small" onClick={() => setOpen(false)}>
                <X size={20} />
              </IconButton>
            </Box>
            
            <DialogContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Channels are where your team communicates. They're best when organized around a topic — #marketing, for example.
              </Typography>
              
              <Box sx={{ display: "flex", alignItems: "flex-end", mb: 3 }}>
                <Hash size={20} color={theme.palette.text.secondary} style={{ marginBottom: 12, marginRight: 8 }} />
                <TextField
                  autoFocus
                  fullWidth
                  label="Name"
                  variant="standard"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. plan-budget"
                />
              </Box>
              
              <TextField
                fullWidth
                label="Description (optional)"
                variant="standard"
                value={newRoomDesc}
                onChange={(e) => setNewRoomDesc(e.target.value)}
                sx={{ mb: 1 }}
              />
            </DialogContent>
            
            <DialogActions sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", bgcolor: "rgba(255,255,255,0.02)" }}>
              <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
              <Button onClick={handleCreateRoom} variant="contained" disabled={!newRoomName.trim()} sx={{ px: 3 }}>
                Create
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
