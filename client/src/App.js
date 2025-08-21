import { useState } from "react";
import "./styles.css";
import JoinForm from "./components/JoinForm";
import RoomsSidebar from "./components/RoomsSidebar";
import ChatRoom from "./components/ChatRoom";

export default function App() {
  const [me, setMe] = useState("");
  const [room, setRoom] = useState("general");
  const [joined, setJoined] = useState(false);

  function handleJoin({ username, room }) {
    setMe(username);
    setRoom(room);
    setJoined(true);
  }

  return (
    <div className="app">
      <RoomsSidebar currentRoom={room} onSwitch={(r) => setRoom(r)} />
      <div className="content">
        {!joined ? (
          <div style={{ padding: 24 }}>
            <JoinForm onJoin={handleJoin} />
          </div>
        ) : (
          <ChatRoom me={me} room={room} />
        )}
      </div>
    </div>
  );
}
