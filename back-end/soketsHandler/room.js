const Room = require("../models/RoomModel");
const { v4: uuidv4 } = require("uuid");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

 
    socket.on("create-room", async ({ roomName, host }) => {
      const roomId = uuidv4(); 
      socket.join(roomId);

      try {
        const newRoom = await Room.create({
          roomId,
          roomName,
          host,
          participants: [host],
        });

        socket.emit("room-created", { roomId, roomName });
        console.log(`Room created: ${roomId}, Name: ${roomName}`);
      } catch (err) {
        console.error("Error creating room in DB:", err);
        socket.emit("error", { message: "Room creation failed." });
      }
    });

    // Join Room
    socket.on("join-room", async ({ roomId, user }) => {
      socket.join(roomId);
      socket.emit("room-joined", { roomId });
      console.log(`User ${user} joined room: ${roomId}`);

      try {
        await Room.findOneAndUpdate(
          { roomId },
          { $addToSet: { participants: user } }
        );
      } catch (err) {
        console.error("Error updating room participants:", err);
      }
    });

    // Leave Room
    socket.on("leave-room", async ({ roomId, user }) => {
      socket.leave(roomId);
      socket.emit("room-left", { roomId });
      console.log(`User ${user} left room: ${roomId}`);

      try {
        await Room.findOneAndUpdate(
          { roomId },
          { $pull: { participants: user } }
        );
      } catch (err) {
        console.error("Error removing user from room:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
