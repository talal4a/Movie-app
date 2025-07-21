const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = require("./app");
app.use(express.json());

const port = process.env.PORT || 8000;

const DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.acmappa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingTimeout: 10000,
  pingInterval: 5000,
});
io.use((socket, next) => {
  const token =
    socket.handshake.auth.token ||
    socket.handshake.headers["authorization"]?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = decoded;
    next();
  } catch (err) {
    console.log("JWT error:", err.message);
    return next(new Error("Invalid token"));
  }
});

require("./soketsHandler/room")(io);
require("./soketsHandler/message")(io);
require("./soketsHandler/video")(io);

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
