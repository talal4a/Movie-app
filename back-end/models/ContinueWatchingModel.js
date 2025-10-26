const mongoose = require("mongoose");
const continueWatchingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now,
  },
});
continueWatchingSchema.index({ user: 1, movie: 1 }, { unique: true });
module.exports = mongoose.model("ContinueWatching", continueWatchingSchema);
