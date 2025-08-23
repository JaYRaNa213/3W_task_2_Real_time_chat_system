import React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";

const OnlineUsersList = ({ users }) => {
  // users are objects: { id, username, room }
  return (
    <Box sx={{ p: 1, textAlign: "right" }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Online: {users?.length || 0}
      </Typography>
      <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
  {(users || []).map((u) => (
    <ListItem key={u.id || u.username} sx={{ py: 0.2 }}>
      {u.username || u}
    </ListItem>
  ))}
</List>

    </Box>
  );
};

export default OnlineUsersList;
