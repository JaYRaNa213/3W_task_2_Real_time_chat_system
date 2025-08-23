import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import { SocketContext } from "../../context/SocketContext";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import OnlineUsersList from "./OnlineUsersList";
import axios from "axios";

const ChatRoom = ({ roomId, username, onCreateRoom, onJoinGeneral }) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Load chat history when a room is selected
  useEffect(() => {
    if (roomId) {
      axios.get(`http://localhost:5000/api/messages/${roomId}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error(err));
    }
  }, [roomId]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ username, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping
          ? [...new Set([...prev, username])]
          : prev.filter((u) => u !== username)
      );
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("typing");
      socket.off("onlineUsers");
    };
  }, [socket]);

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", bgcolor: "#f9f9fb" }}>
      {/* Chat Window */}
      <Box sx={{ flex: 3, display: "flex", flexDirection: "column", p: 2 }}>
        {!roomId ? (
          // Show Welcome Center when no room selected
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              p: 3,
              color: "gray",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              👋 Welcome back, {username}!
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Select a room from the left or create your own to start chatting.
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary" onClick={onCreateRoom}>
                + Create Room
              </Button>
              <Button variant="outlined" color="secondary" onClick={onJoinGeneral}>
                Join General
              </Button>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body2">
                💡 Tip: You can see who’s online in the right sidebar.
              </Typography>
            </Box>
          </Box>
        ) : (
          // Show chat when room selected
          <>
            {messages.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: "gray",
                }}
              >
                <Typography variant="h6">No messages yet 🚀</Typography>
                <Typography variant="body2">
                  Start the conversation and break the silence!
                </Typography>
              </Box>
            ) : (
              <MessageList messages={messages} username={username} />
            )}
            <TypingIndicator typingUsers={typingUsers} />
            <Divider />
            <MessageInput roomId={roomId} username={username} />
          </>
        )}
      </Box>

      {/* Online Users */}
      <Box
        sx={{
          flex: 1,
          borderLeft: "1px solid #ddd",
          bgcolor: "#fff",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Online Users
        </Typography>
        <OnlineUsersList users={onlineUsers} />
      </Box>
    </Box>
  );
};

export default ChatRoom;
