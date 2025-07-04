const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const roomRoutes = require("./routes/roomRoutes");
const setupSocketHandlers = require("./socket/socketHandler");

dotenv.config();

const app = express();
const server = http.createServer(app);


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}));
app.use(express.json());


app.use("/api/rooms", roomRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
setupSocketHandlers(io);

const cleanupInactiveRooms = require("./cron/cleanupRooms");
setInterval(() => {
  cleanupInactiveRooms();
}, 6 * 60 * 60 * 1000);



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Backend running");
});

