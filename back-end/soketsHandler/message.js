const Message = require("../models/messageModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected to chat:", socket.id);
    const user = socket.data.user;
    socket.on("typing", ({ roomId }) => {
      socket.to(roomId).emit("user-typing", {
        userId: user.id,
        name: user.name
      });
    });
    socket.on("stop-typing", ({ roomId }) => {
      socket.to(roomId).emit("user-stopped-typing", {
        userId: user.id,
      });
    });
    socket.on("send-message", async ({ roomId, message,senderId }) => {
      if (!user || !roomId) return;
      try {
        const newMessage = await Message.create({
          roomId,
          senderId: senderId,
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
        console.error("Error sending message:", err);
      }
    });
    socket.on("delete-message", async ({ messageId, roomId }) => {
      try {
        await Message.findByIdAndDelete(messageId);
        io.to(roomId).emit("message-deleted", { messageId });
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    });
    socket.on("edit-message", async ({ messageId, newText, roomId }) => {
      try {
        const updated = await Message.findByIdAndUpdate(
          messageId,
          { text: newText },
          { new: true }
        );
        io.to(roomId).emit("message-edited", {
          messageId: updated._id,
          newText: updated.text,
        });
      } catch (err) {
        console.error("Error editing message:", err);
      }
    });
    socket.on("get-messages", async ({ roomId }) => {
      try {
        const messages = await Message.find({ roomId })
          .populate("senderId", "name avatar role")
          .sort({ sentAt: 1 });

        socket.emit(
          "message-history",
          messages.map((msg) => ({
            _id: msg._id,
            text: msg.text,
            roomId: msg.roomId,
            sender: {
              id: msg.senderId._id,
              name: msg.senderId.name,
              avatar: msg.senderId.avatar,
              role: msg.senderId.role,
            },
            timestamp: msg.sentAt,
          }))
        );
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
