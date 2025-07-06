// cron/cleanupRooms.js
const Room = require("../models/room");

async function cleanupInactiveRooms() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const result = await Room.deleteMany({ lastActivity: { $lt: cutoff } });
  console.log(`Cleaned up ${result.deletedCount} inactive rooms`);
}

module.exports = cleanupInactiveRooms;
