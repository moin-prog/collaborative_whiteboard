import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RoomJoin() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      alert("Please enter a room code");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/rooms/join", { roomId: roomCode });
      navigate(`/whiteboard/${roomCode}`);
    } catch (error) {
      console.error("Join failed:", error);
      alert("Failed to join room");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎨 Join a Whiteboard Room</h2>
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleJoin} style={styles.button}>
        Join Room
      </button>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "15%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    width: "250px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default RoomJoin;
