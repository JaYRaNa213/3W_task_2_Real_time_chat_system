import { useState } from "react";

export default function JoinForm({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");

  const handleJoin = () => {
    const cleanUsername = username.trim();
    const cleanRoom = room.trim().toLowerCase(); // force lowercase
    if (!cleanUsername || !cleanRoom) return;
    onJoin({ username: cleanUsername, room: cleanRoom });
  };

  return (
    <div className="join-form">
      <h3>Join a Room</h3>
      <div style={{ display: "grid", gap: 8 }}>
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room (e.g. general)"
          value={room}
          onChange={e => setRoom(e.target.value)}
        />
        <button
          className="button"
          onClick={handleJoin}
          disabled={!username.trim() || !room.trim()}
        >
          Join
        </button>
      </div>
    </div>
  );
}
