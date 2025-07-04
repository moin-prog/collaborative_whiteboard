const express = require("express");
const Room = require("../models/room");
const router = express.Router();

router.post("/join", async (req, res) => {
  const { roomId } = req.body;

  if (!roomId) return res.status(400).json({ error: "roomId required" });

  try {
    let room = await Room.findOne({ roomId });

    if (!room) {
      room = new Room({ roomId });
      await room.save();
    }

    res.status(200).json({ roomId: room.roomId });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
