import React, {
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import { io } from "socket.io-client";

// Create context
export const SocketContext = createContext(null);

// Provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const SOCKET_URL =
    process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    s.on("connect", () => console.log("✅ Socket connected:", s.id));
    s.on("disconnect", () => console.log("🔌 Socket disconnected"));

    setSocket(s);

    return () => {
      s.off("connect");
      s.off("disconnect");
      // optional: disconnect socket completely if provider unmounts
      // s.disconnect();
    };
  }, [SOCKET_URL]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Custom hook
export const useSocket = () => {
  return useContext(SocketContext);
};
