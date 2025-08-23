import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("http://localhost:5000", {
      transports: ["websocket"],   // 🚀 skip polling
      reconnection: true,
      reconnectionAttempts: 5,
    });

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
    });

    setSocket(s);

    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
