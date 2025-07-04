import { useEffect, useState } from "react";
import throttle from "lodash.throttle";

// Map color to avatar emoji
const COLOR_AVATAR_MAP = {
  black: "🖤",
  red: "❤️",
  blue: "💙",
  green: "💚",
};

function UserCursors({ socket }) {
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    // Throttled function to update cursor data
    const throttledUpdate = throttle(({ id, x, y, color }) => {
      setCursors((prev) => ({
        ...prev,
        [id]: {
          x,
          y,
          color,
          lastActive: Date.now(),
        },
      }));
    }, 16); // ~60fps

    // Listen to cursor updates
    socket.on("cursor-update", throttledUpdate);

    // Remove inactive cursors after 5s
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const active = {};
        for (const id in prev) {
          if (now - prev[id].lastActive < 5000) {
            active[id] = prev[id];
          }
        }
        return active;
      });
    }, 5000);

    return () => {
      socket.off("cursor-update", throttledUpdate);
      clearInterval(interval);
    };
  }, [socket]);

  return (
    <>
      {Object.entries(cursors).map(([id, { x, y, color }]) => {
        const avatar = COLOR_AVATAR_MAP[color] || "👤";
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -100%)",
              pointerEvents: "none",
              zIndex: 9999,
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            <div>{avatar}</div>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: color || "gray",
                margin: "2px auto 0",
              }}
            />
          </div>
        );
      })}
    </>
  );
}

export default UserCursors;
