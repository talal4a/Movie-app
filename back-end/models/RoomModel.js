const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema({
  roomCode: String,
  movieId: String,
  createdAt: { type: Date, default: Date.now },
  users: [String],
  playbackState: {
    time: Number,
    isPlaying: Boolean,
  },
});
module.exports = mongoose.model("Room", roomSchema);
