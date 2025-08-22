import { useEffect, useRef, useState } from "react";
import { TextField, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const typingTimeout = useRef(null);

  function handleChange(e) {
    setText(e.target.value);
    onTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => onTyping(false), 800);
  }

  function submit() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    onTyping(false);
  }

  useEffect(() => () => clearTimeout(typingTimeout.current), []);

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: "30px",
      }}
    >
      <TextField
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
        variant="standard"
        fullWidth
        onKeyDown={(e) => (e.key === "Enter" ? submit() : null)}
        InputProps={{ disableUnderline: true }}
        sx={{ marginRight: "10px" }}
      />
      <IconButton color="primary" onClick={submit}>
        <SendIcon />
      </IconButton>
    </Paper>
  );
}
