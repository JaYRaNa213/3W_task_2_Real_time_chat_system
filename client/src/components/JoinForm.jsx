import { useState } from "react";

export default function JoinForm({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");

  const handleJoin = (e) => {
    e.preventDefault(); // prevent page reload
    const cleanUsername = username.trim();
    const cleanRoom = room.trim().toLowerCase().replace(/\s+/g, "-"); // normalize
    if (!cleanUsername || !cleanRoom) return;
    onJoin({ username: cleanUsername, room: cleanRoom });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Title */}
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Join a Chat Room
        </h3>

        {/* Form */}
        <form onSubmit={handleJoin} className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Room
            </label>
            <input
              type="text"
              placeholder="Room (e.g. general)"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={!username.trim() || !room.trim()}
            className="w-full py-2 px-4 mt-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
