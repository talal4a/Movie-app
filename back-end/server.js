const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

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
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", { username });
  });
  socket.on("video-control", ({ roomId, action, time }) => {
    socket.to(roomId).emit("sync-video", { action, time });
  });
  socket.on("send-message", ({ roomId, message, username }) => {
    socket.to(roomId).emit("receive-message", { message, username });
  });
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
