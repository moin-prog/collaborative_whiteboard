const Room = require("../models/room");

function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User joined room ${roomId}`);
      io.to(roomId).emit("user-count", getUserCount(io, roomId));
    });


    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      io.to(roomId).emit("user-count", getUserCount(io, roomId));
      console.log(`User left room ${roomId}`);
    });

  
    socket.on("draw", (data) => {
      socket.to(data.roomId).emit("draw", data);
    });


    socket.on("cursor-update", ({ roomId, x, y, color }) => {
      socket.to(roomId).emit("cursor-update", {
        id: socket.id,
        x,
        y,
        color, 
      });
    });

    socket.on("disconnecting", () => {
      const rooms = Array.from(socket.rooms);
      rooms.forEach((roomId) => {
        socket.to(roomId).emit("user-count", getUserCount(io, roomId));
        socket.to(roomId).emit("user-left", socket.id);
      });
    });

    
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}


function getUserCount(io, roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? room.size : 0;
}

module.exports = setupSocketHandlers;
