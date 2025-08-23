import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true, // let provider auto-connect
      reconnection: true,
      reconnectionAttempts: 5,
    });

    s.on("connect", () => console.log("✅ Socket connected:", s.id));
    s.on("disconnect", () => console.log("🔌 Socket disconnected"));

    setSocket(s);

    return () => {
      // Only cleanup listeners, do NOT disconnect here if multiple components use it
      s.off("connect");
      s.off("disconnect");
    };
  }, [SOCKET_URL]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
