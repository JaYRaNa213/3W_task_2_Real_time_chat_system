import { useState } from "react";

export default function JoinForm({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");

  return (
    <div>
      <h3>Join a Room</h3>
      <div style={{ display: "grid", gap: 8 }}>
        <input placeholder="Your name" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="Room (e.g. general)" value={room} onChange={e=>setRoom(e.target.value)} />
        <button className="button" onClick={() => onJoin({ username: username.trim(), room: room.trim() })} disabled={!username.trim() || !room.trim()}>
          Join
        </button>
      </div>
    </div>
  );
}
