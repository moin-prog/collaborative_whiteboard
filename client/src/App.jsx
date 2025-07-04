import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomJoin from "./components/RoomJoin.jsx";
import Whiteboard from "./components/WhiteBoard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomJoin />} />
        <Route path="/whiteboard/:roomId" element={<Whiteboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
