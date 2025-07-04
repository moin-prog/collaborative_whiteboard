import React, { useEffect, useRef, useState } from "react";

function DrawingCanvas({ socket, roomId, color, strokeWidth }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const paths = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 120;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    socket.emit("join-room", roomId);

    // Receive and draw from others
    socket.on("draw", ({ x, y, color, strokeWidth, type }) => {
      if (type === "start") {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (type === "move") {
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });

    // Redraw on undo
    canvas.addEventListener("undo", () => {
      paths.current.pop();
      redrawAll(ctx);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.off("draw");
    };
  }, []);

  const redrawAll = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    paths.current.forEach((path) => {
      ctx.beginPath();
      path.points.forEach((p, i) => {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.strokeWidth;
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });
    });
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    socket.emit("draw", { x: offsetX, y: offsetY, color, strokeWidth, roomId, type: "start" });

    paths.current.push({
      color,
      strokeWidth,
      points: [{ x: offsetX, y: offsetY }],
    });
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    // Emit cursor update with current color
    socket.emit("cursor-update", {
      id: socket.id,
      roomId,
      x: offsetX,
      y: offsetY,
      color,
    });

    if (!drawing) return;

    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = strokeWidth;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();

    socket.emit("draw", {
      x: offsetX,
      y: offsetY,
      color,
      strokeWidth,
      roomId,
      type: "move",
    });

    const currentPath = paths.current[paths.current.length - 1];
    currentPath.points.push({ x: offsetX, y: offsetY });
  };

  const handleMouseUp = () => {
    setDrawing(false);
    ctxRef.current.closePath();
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        position: "absolute",
        top: "90px",
        left: 0,
        zIndex: 1,
        cursor: "crosshair",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}

export default DrawingCanvas;
