import { useEffect, useRef, useState } from "react";

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
    <div className="inputRow">
      <input value={text} onChange={handleChange} placeholder="Type a message..." onKeyDown={e => e.key === "Enter" ? submit() : null} />
      <button className="button" onClick={submit}>Send</button>
    </div>
  );
}
