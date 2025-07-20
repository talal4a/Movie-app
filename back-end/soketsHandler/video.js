module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected to video control");
    socket.on("video:play", ({ roomId, currentTime }) => {
      socket.to(roomId).emit("video:play", { currentTime });
    });
    socket.on("video:pause", ({ roomId, currentTime }) => {
      socket.to(roomId).emit("video:pause", { currentTime });
    });
    socket.on("video:seek", ({ roomId, currentTime }) => {
      socket.to(roomId).emit("video:seek", { currentTime });
    });
    socket.on("video:join", (roomId) => {
      socket.join(roomId);
      console.log(`User joined video room: ${roomId}`);
    });
    socket.on("video:requestSync", ({ roomId }) => {
      socket.to(roomId).emit("video:sendSync", { socketId: socket.id });
    });
    socket.on("video:syncToUser", ({ socketId, currentTime, isPlaying }) => {
      io.to(socketId).emit("video:sync", { currentTime, isPlaying });
    });
  });
};
