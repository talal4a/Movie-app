const Message = require("../models/messageModel");
const User = require("../models/userModel");
const roomHosts = {};
module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected to chat:", socket.id);
    socket.on("join-room", async ({ roomId, userId }) => {
      try {
        const user = await User.findById(userId).select("name avatar role");
        if (!user) {
          console.error(`User with ID ${userId} not found`);
          return;
        }
        if (!roomHosts[roomId]) {
          roomHosts[roomId] = userId;
          console.log(`Assigned ${user.name} as host of room ${roomId}`);
        }
        const roleInRoom =
          roomHosts[roomId] === userId ? "host" : "participant";
        socket.join(roomId);
        socket.data.user = {
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          role: roleInRoom,
          socketId: socket.id,
        };
        console.log(
          `User ${user.name} joined room: ${roomId} as ${roleInRoom}`
        );
        socket.to(roomId).emit("user-joined", {
          id: socket.id,
          name: user.name,
          avatar: user.avatar,
          role: roleInRoom,
        });
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });
    const mongoose = require("mongoose");
    socket.on("send-message", async ({ roomId, message }) => {
      const user = socket.data.user;

      if (!user) {
        console.warn("Message send attempted without valid user context.");
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        console.error("Invalid roomId provided:", roomId);
        return;
      }

      try {
        const newMessage = await Message.create({
          roomId: new mongoose.Types.ObjectId(roomId),
          senderId: user.id,
          text: message,
        });

        io.to(roomId).emit("receive-message", {
          _id: newMessage._id,
          roomId,
          message: newMessage.text,
          sender: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
          timestamp: newMessage.sentAt,
        });
      } catch (err) {
        console.error("Error saving message to DB:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
