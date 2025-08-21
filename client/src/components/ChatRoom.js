import { useEffect, useRef, useState } from "react";
import { api } from "../api/http";
import { socket } from "../socket";
import MessageInput from "./MessageInput";
import OnlineUsersList from "./OnlineUsersList";
import TypingIndicator from "./TypingIndicator";

export default function ChatRoom({ me, room }) {
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [typing, setTyping] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function loadHistory() {
      const { data } = await api.get(`/api/rooms/${room}/messages?limit=50`);
      setMessages(data);
      scrollToBottom();
    }
    loadHistory();
  }, [room]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", { username: me, room });

    socket.on("chatMessage", msg => {
      setMessages(prev => [...prev, msg]);
      scrollToBottom();
    });
    socket.on("onlineUsers", list => setOnline(list));
    socket.on("typing", ({ username, isTyping }) => {
      setTyping(prev => {
        const set = new Set(prev);
        if (isTyping) set.add(username);
        else set.delete(username);
        return Array.from(set).filter(u => u !== me);
      });
    });

    return () => {
      socket.off("chatMessage");
      socket.off("onlineUsers");
      socket.off("typing");
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [room, me]);

  function send(text) {
    socket.emit("chatMessage", { room, text, senderName: me });
  }

  function onTyping(isTyping) {
    socket.emit("typing", { room, username: me, isTyping });
  }

  function scrollToBottom() {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 0);
  }

  return (
    <div className="content">
      <div className="header">
        <strong>#{room}</strong> — Signed in as <strong>{me}</strong>
        <OnlineUsersList users={online} />
      </div>

      <div className="messages" ref={scrollRef}>
        {messages.map(m => (
          <div className="message" key={m._id || m.createdAt + m.senderName + m.text}>
            <span className="sender">{m.senderName}:</span>
            <span>{m.text}</span><br/>
            <span className="tag">{new Date(m.createdAt || Date.now()).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <TypingIndicator typing={typing} />
      <MessageInput onSend={send} onTyping={onTyping} />
    </div>
  );
}
