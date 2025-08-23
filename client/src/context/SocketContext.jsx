import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      autoConnect: true,
    });

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
    });

    s.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [SOCKET_URL]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
