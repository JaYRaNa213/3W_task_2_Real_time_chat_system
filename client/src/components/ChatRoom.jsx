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
      const { data } = await api.get(`/api/messages/${room}?limit=50`);
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
  }, [room, me]);

  function send(text) {
    socket.emit("chatMessage", { room, text, senderName: me });
  }

  function onTyping(isTyping) {
    socket.emit("typing", { room, username: me, isTyping });
  }

  function scrollToBottom() {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  }

  return (
    <div className="flex flex-col h-full max-h-screen bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-indigo-600 text-white sticky top-0 z-10">
        <div>
          <strong className="text-lg">#{room}</strong>
          <span className="ml-2 text-sm opacity-80">Signed in as {me}</span>
        </div>
        <OnlineUsersList users={online} />
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-white"
        ref={scrollRef}
      >
        {messages.map((m, i) => {
          const mine = m.senderName === me;
          return (
            <div
              key={m._id || m.createdAt + m.senderName + m.text + i}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-xl shadow 
                ${mine ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-900"}`}
              >
                <div className="text-sm font-semibold">
                  {mine ? "You" : m.senderName}
                </div>
                <div className="text-base">{m.text}</div>
                <div className="text-[10px] opacity-70 text-right mt-1">
                  {new Date(m.createdAt || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Typing Indicator */}
      <div className="px-4">
        <TypingIndicator typing={typing} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <MessageInput onSend={send} onTyping={onTyping} />
      </div>
    </div>
  );
}
