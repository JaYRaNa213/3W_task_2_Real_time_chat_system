import React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";

const OnlineUsersList = ({ users }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Online Users
      </Typography>
      <List>
        {users.map((user, idx) => (
          <ListItem key={idx}>{user}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default OnlineUsersList;
