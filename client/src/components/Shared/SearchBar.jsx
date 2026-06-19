// client/src/components/Shared/SearchBar.jsx
// Reusable debounced search input with results dropdown

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box, InputBase, Paper, Typography, Avatar,
  IconButton, CircularProgress, Tooltip,
} from "@mui/material";
import { Search, X, MessageCircle } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ConversationContext } from "../../context/ConversationContext";
import { searchUsers } from "../../api/users";
import { startDM } from "../../api/conversations";

export default function SearchBar({ placeholder = "Search users..." }) {
  const { user } = useContext(AuthContext);
  const { addConversation, openConversation } = useContext(ConversationContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Debounced search
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchUsers(user?.token, val.trim());
        setResults(res.data || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleStartChat = async (targetUser) => {
    if (!user?.token) return;
    try {
      const res = await startDM(user.token, targetUser._id);
      addConversation(res.data);
      openConversation(res.data);
    } catch (err) {
      console.error("DM error:", err);
    }
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <Box ref={containerRef} sx={{ position: "relative", width: "100%" }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          "&:hover": { border: "1px solid rgba(255,255,255,0.15)" },
          transition: "border 0.2s",
        }}
      >
        {loading ? (
          <CircularProgress size={16} sx={{ color: "text.secondary", mr: 1 }} />
        ) : (
          <Search size={16} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
        )}
        <InputBase
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={() => results.length > 0 && setOpen(true)}
          sx={{ flex: 1, fontSize: "0.875rem", color: "text.primary" }}
        />
        {query && (
          <IconButton
            size="small"
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            sx={{ p: 0.25 }}
          >
            <X size={14} color="rgba(255,255,255,0.4)" />
          </IconButton>
        )}
      </Paper>

      {/* Results Dropdown */}
      {open && results.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 999,
            bgcolor: "#1e1e2e",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 2,
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          {results.map((u) => (
            <Box
              key={u._id}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1.5,
                py: 1,
                gap: 1.5,
                "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
                cursor: "default",
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.8rem" }}>
                {u.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {u.username}
                </Typography>
                {u.lastSeen && (
                  <Typography variant="caption" color="text.secondary">
                    Last seen: {new Date(u.lastSeen).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
              <Tooltip title="Start DM">
                <IconButton
                  size="small"
                  onClick={() => handleStartChat(u)}
                  sx={{
                    color: "primary.main",
                    "&:hover": { bgcolor: "rgba(126,87,194,0.15)" },
                  }}
                >
                  <MessageCircle size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Paper>
      )}

      {open && results.length === 0 && !loading && query && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 999,
            bgcolor: "#1e1e2e",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 2,
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No users found for "{query}"
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
