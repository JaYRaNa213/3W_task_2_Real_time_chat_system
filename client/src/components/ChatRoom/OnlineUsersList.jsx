import React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";

const OnlineUsersList = ({ users }) => {
  // Ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <Box sx={{ p: 1, textAlign: "right" }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        Online: {safeUsers.length}
      </Typography>

      <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
        {safeUsers.length > 0 ? (
          safeUsers.map((user) => (
            <ListItem key={user.id} sx={{ py: 0.5 }}>
              <Typography variant="body2">
                {String(user.username)} ({String(user.room)})
              </Typography>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <Typography variant="body2" color="textSecondary">
              No users online
            </Typography>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default OnlineUsersList;
