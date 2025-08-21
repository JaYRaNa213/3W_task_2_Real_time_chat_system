import { useEffect, useState } from "react";
import { api } from "../api/http";

export default function RoomsSidebar({ currentRoom, onSwitch }) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");

  // Load rooms from backend
  async function loadRooms() {
    try {
      const { data } = await api.get("/api/rooms");
      // Ensure we always get an array
      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
    } catch (err) {
      console.error("Failed to load rooms:", err);
      setRooms([]);
    }
  }

  // Create a new room
  async function createRoom() {
    if (!newRoom.trim()) return;
    try {
      const { data } = await api.post("/api/rooms", { name: newRoom.trim() });
      setNewRoom("");
      await loadRooms();
      if (data?.name) onSwitch(data.name); // switch to the newly created room
    } catch (err) {
      console.error("Failed to create room:", err);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <div className="sidebar">
      <h3>Rooms</h3>
      <div style={{ marginTop: 10 }}>
        {(Array.isArray(rooms) ? rooms : []).map((r) => (
          <div
            key={r._id}
            className={`room-item ${currentRoom === r.name ? "active" : ""}`}
            onClick={() => onSwitch(r.name)}
          >
            #{r.name}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <input
          placeholder="New room name"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
        />
        <button
          className="button"
          onClick={createRoom}
          style={{ marginTop: 8 }}
        >
          Create
        </button>
      </div>
    </div>
  );
  
}
