// client/src/components/Communities/CommunityList.jsx
// Lists public community channels the user can join and browse

import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, IconButton, Tooltip, Avatar, Button } from "@mui/material";
import { Hash, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { ConversationContext } from "../../context/ConversationContext";
import { getCommunities, joinCommunity } from "../../api/conversations";

const MotionBox = motion.create(Box);

export default function CommunityList({ activeConversationId }) {
  const { user } = useContext(AuthContext);
  const { conversations, addConversation, openConversation } = useContext(ConversationContext);
  const [allCommunities, setAllCommunities] = useState([]);
  const [loading, setLoading] = useState(false);

  // My joined communities from context
  const joined = conversations.filter((c) => c.type === "community");

  // Fetch public communities on mount
  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    getCommunities(user.token)
      .then((res) => setAllCommunities(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.token]);

  const handleJoin = async (community) => {
    try {
      await joinCommunity(user.token, community._id);
      addConversation({ ...community, participants: [...(community.participants || []), user._id] });
      openConversation(community);
    } catch (err) {
      console.error("Join failed:", err);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, px: 0.5 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem" }}
        >
          Communities
        </Typography>
      </Box>

      {/* My joined communities */}
      {joined.map((conv) => (
        <MotionBox
          key={conv._id}
          onClick={() => openConversation(conv)}
          whileTap={{ scale: 0.98 }}
          sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            px: 1.5, py: 1, borderRadius: 2, cursor: "pointer",
            bgcolor: conv._id === activeConversationId ? "rgba(126,87,194,0.15)" : "transparent",
            border: conv._id === activeConversationId ? "1px solid rgba(126,87,194,0.3)" : "1px solid transparent",
            "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
            mb: 0.5, transition: "all 0.15s",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 1, bgcolor: "rgba(126,87,194,0.2)" }}>
            <Hash size={14} color="#7e57c2" />
          </Box>
          <Typography variant="body2" fontWeight={500} noWrap sx={{ flex: 1 }}>
            {conv.name}
          </Typography>
        </MotionBox>
      ))}

      {/* Discoverable communities */}
      {allCommunities.filter((c) => !joined.some((j) => j._id === c._id)).length > 0 && (
        <>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ px: 0.5, mt: 1.5, mb: 0.5, display: "block", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            Discover
          </Typography>
          {allCommunities
            .filter((c) => !joined.some((j) => j._id === c._id))
            .map((community) => (
              <Box
                key={community._id}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  px: 1.5, py: 1, borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.05)",
                  bgcolor: "rgba(255,255,255,0.02)",
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 1, bgcolor: "rgba(255,255,255,0.06)" }}>
                  <Hash size={14} color="rgba(255,255,255,0.4)" />
                </Box>
                <Typography variant="body2" sx={{ flex: 1 }} noWrap color="text.secondary">
                  {community.name}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleJoin(community)}
                  sx={{ fontSize: "0.7rem", py: 0.25, px: 1, borderColor: "rgba(126,87,194,0.4)", color: "primary.light", minWidth: 0 }}
                >
                  Join
                </Button>
              </Box>
            ))}
        </>
      )}

      {joined.length === 0 && allCommunities.length === 0 && !loading && (
        <Typography variant="caption" color="text.secondary" sx={{ px: 1, display: "block" }}>
          No communities available.
        </Typography>
      )}
    </>
  );
}
