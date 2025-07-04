import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Toolbar from "./Toolbar";
import DrawingCanvas from "./DrawingCanvas";
import UserCursors from "./UserCursors";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Whiteboard() {
  const { roomId } = useParams();
  const [color, setColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [tool, setTool] = useState("pen");
  const [userCount, setUserCount] = useState(1);
  const [connectionStatus, setConnectionStatus] = useState("🟢 Connected");

  const handleUndo = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) canvas.dispatchEvent(new Event("undo"));
  };

  // Handle connection/disconnection and user count updates
  useEffect(() => {
    socket.on("user-count", setUserCount);

    socket.on("connect", () => setConnectionStatus("🟢 Connected"));
    socket.on("disconnect", () => setConnectionStatus("🔌 Disconnected"));

    return () => {
      socket.off("user-count", setUserCount);
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div>
      <div style={styles.banner}>
        🧑‍🎨 Room: <strong>{roomId}</strong>
        <span style={{ float: "right" }}>
          {connectionStatus} | 👥 Users: {userCount}
        </span>
      </div>

      <Toolbar
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        tool={tool}
        setTool={setTool}
        onUndo={handleUndo}
      />

      <DrawingCanvas
        socket={socket}
        roomId={roomId}
        color={tool === "eraser" ? "white" : color}
        strokeWidth={strokeWidth}
      />

      <UserCursors socket={socket} roomId={roomId} />
    </div>
  );
}

const styles = {
  banner: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: "12px 20px",
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default Whiteboard;
