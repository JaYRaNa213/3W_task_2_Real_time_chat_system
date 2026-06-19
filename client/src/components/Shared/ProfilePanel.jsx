// client/src/components/Shared/ProfilePanel.jsx
// Right sidebar panel: shows profile, members, and settings for active conversation

import React, { useContext, useState } from "react";
import { Box, Typography, Avatar, Divider, IconButton, Tooltip, Button, Chip } from "@mui/material";
import { UserX, Trash2, UserPlus, Pin, PinOff, Bell, BellOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { ConversationContext } from "../../context/ConversationContext";
import { toggleBlock } from "../../api/users";
import { deleteConversation, togglePin, toggleMute } from "../../api/conversations";
import InviteUserModal from "../Groups/InviteUserModal";

export default function ProfilePanel({ onConversationDeleted }) {
  const { user } = useContext(AuthContext);
  const { activeConversation, onlineUsers } = useContext(ConversationContext);
  const [inviteOpen, setInviteOpen] = useState(false);

  if (!activeConversation) return null;

  const conv = activeConversation;
  const isOwner = conv.ownerId?.toString() === user?._id || conv.ownerId === user?.id;
  const isGroup = conv.type === "group";
  const isDM = conv.type === "direct_message";

  const peer = isDM
    ? conv.participants?.find((p) => p._id !== user?._id && p.username !== user?.username)
    : null;

  const onlineSet = new Set(onlineUsers[conv._id] || []);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await deleteConversation(user.token, conv._id);
      if (onConversationDeleted) onConversationDeleted(conv._id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleBlock = async () => {
    if (!peer?._id) return;
    try {
      await toggleBlock(user.token, peer._id);
    } catch (err) {
      console.error("Block failed:", err);
    }
  };

  const isPinned = conv.pinnedBy?.some((id) => id.toString() === (user?._id || user?.id));
  const isMuted = conv.mutedBy?.some((id) => id.toString() === (user?._id || user?.id));

  const handleTogglePin = async () => {
    try {
      await togglePin(user.token, conv._id);
    } catch (err) {
      console.error("Pin toggle failed:", err);
    }
  };

  const handleToggleMute = async () => {
    try {
      await toggleMute(user.token, conv._id);
    } catch (err) {
      console.error("Mute toggle failed:", err);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2, overflowY: "auto" }}>
      {/* Conversation Info */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2, mb: 1 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: "primary.main",
            fontSize: "1.5rem",
            fontWeight: 700,
            mb: 1.5,
            borderRadius: isGroup ? 3 : "50%",
          }}
        >
          {isDM
            ? peer?.username?.charAt(0).toUpperCase() || "?"
            : conv.name?.charAt(0).toUpperCase() || "#"}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={700}>
          {isDM ? peer?.username : conv.name}
        </Typography>
        {isDM && peer?.lastSeen && (
          <Typography variant="caption" color="text.secondary">
            Last seen: {new Date(peer.lastSeen).toLocaleDateString()}
          </Typography>
        )}
        {!isDM && conv.description && (
          <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 0.5 }}>
            {conv.description}
          </Typography>
        )}
        <Chip
          label={conv.type.replace("_", " ")}
          size="small"
          sx={{
            mt: 1,
            bgcolor: "rgba(126,87,194,0.15)",
            color: "primary.light",
            fontSize: "0.65rem",
            textTransform: "capitalize",
            fontWeight: 600,
          }}
        />
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 2 }} />

      {/* Members (for groups/communities) */}
      {!isDM && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem" }}>
              Members — {conv.participants?.length || 0}
            </Typography>
            {isGroup && isOwner && (
              <Tooltip title="Invite Member">
                <IconButton size="small" onClick={() => setInviteOpen(true)} sx={{ color: "primary.main" }}>
                  <UserPlus size={16} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            {(conv.participants || []).map((p) => {
              const pid = p._id || p;
              const isOnline = onlineSet.has(pid?.toString());
              const isMe = pid?.toString() === (user?._id || user?.id);
              return (
                <Box
                  key={pid}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.75, px: 1, borderRadius: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar sx={{ width: 30, height: 30, bgcolor: isMe ? "primary.main" : "rgba(255,255,255,0.1)", fontSize: "0.8rem", fontWeight: 600 }}>
                      {p.username?.charAt(0).toUpperCase() || "?"}
                    </Avatar>
                    <Box sx={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", bgcolor: isOnline ? "#10B981" : "#6b7280", border: "2px solid #121212" }} />
                  </Box>
                  <Typography variant="body2" fontWeight={isMe ? 600 : 400} sx={{ flex: 1 }} noWrap>
                    {p.username || "Unknown"}{isMe ? " (you)" : ""}
                  </Typography>
                  {conv.ownerId?.toString() === pid?.toString() && (
                    <Chip label="Owner" size="small" sx={{ fontSize: "0.6rem", height: 18, bgcolor: "rgba(126,87,194,0.2)", color: "primary.light" }} />
                  )}
                </Box>
              );
            })}
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 2 }} />
        </>
      )}

      {/* Actions */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          startIcon={isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          variant="outlined"
          size="small"
          onClick={handleTogglePin}
          sx={{ borderColor: "rgba(255,255,255,0.12)", color: "text.primary", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
        >
          {isPinned ? "Unpin Conversation" : "Pin Conversation"}
        </Button>

        <Button
          startIcon={isMuted ? <Bell size={16} /> : <BellOff size={16} />}
          variant="outlined"
          size="small"
          onClick={handleToggleMute}
          sx={{ borderColor: "rgba(255,255,255,0.12)", color: "text.primary", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
        >
          {isMuted ? "Unmute Conversation" : "Mute Conversation"}
        </Button>

        {isDM && (
          <Button
            startIcon={<UserX size={16} />}
            variant="outlined"
            size="small"
            onClick={handleBlock}
            sx={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444", "&:hover": { bgcolor: "rgba(239,68,68,0.08)", borderColor: "#ef4444" } }}
          >
            Block User
          </Button>
        )}
        <Button
          startIcon={<Trash2 size={16} />}
          variant="outlined"
          size="small"
          onClick={handleDelete}
          sx={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444", "&:hover": { bgcolor: "rgba(239,68,68,0.08)", borderColor: "#ef4444" } }}
        >
          {isDM ? "Delete Chat" : isOwner ? "Delete Group" : "Leave Group"}
        </Button>
      </Box>

      {/* Invite modal */}
      {isGroup && (
        <InviteUserModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
          conversationId={conv._id}
          conversationName={conv.name}
        />
      )}
    </Box>
  );
}
