// src/components/OnlineUsersList.jsx
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Box,
} from "@mui/material";
import { User } from "lucide-react";

export default function OnlineUsersList({ users = [] }) {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 2,
        width: 280,
        borderRadius: 3,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Online Users
        </Typography>
        <Typography
          variant="caption"
          sx={{
            bgcolor: "grey.800",
            color: "grey.300",
            px: 1.2,
            py: 0.2,
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          {users.length}
        </Typography>
      </Box>

      {/* User List */}
      <List
        dense
        sx={{
          flex: 1,
          overflowY: "auto",
          maxHeight: 300,
          pr: 1,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "grey.700",
            borderRadius: 2,
          },
        }}
      >
        {users.length > 0 ? (
          users.map((u, i) => (
            <ListItem
              key={u.id || u.username || i}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: "grey.900",
                "&:hover": { bgcolor: "grey.800" },
              }}
            >
              {/* Avatar with online badge */}
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  sx={{
                    "& .MuiBadge-dot": {
                      bgcolor: "green.400",
                      border: "2px solid #1e1e1e",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                    },
                  }}
                >
                  {u.avatar ? (
                    <Avatar src={u.avatar} alt={u.username} />
                  ) : (
                    <Avatar
                      sx={{ bgcolor: "grey.700" }}
                      alt={u.username || "User"}
                    >
                      <User size={18} />
                    </Avatar>
                  )}
                </Badge>
              </ListItemAvatar>

              {/* Username */}
              <ListItemText
                primary={u.username || u}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "text.primary",
                }}
              />
            </ListItem>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic", p: 1 }}
          >
            No one online
          </Typography>
        )}
      </List>
    </Paper>
  );
}
