import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
// import NotFound from "./pages/NotFound";

function App() {
  const [me, setMe] = useState(null);
  const [room, setRoom] = useState(null);

  const handleJoin = ({ username, room: joinedRoom }) => {
  setMe(username);
  setRoom(joinedRoom);
};


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={me && room ? (
            <Chat me={me} room={room} onSwitch={setRoom} />
          ) : (
            <Home onJoin={handleJoin} />
          )}
        />
        
      </Routes>
    </Router>
  );
}
export default App;



