const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  movieUrl: {
    type: String,
    default: "",
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Made optional
  },
  hostType: {
    type: String,
    enum: ['user', 'system'],
    default: 'user',
  },
  participants: [{
    type: String, // Changed to String to handle both ObjectIds and 'system'
    required: true
  }],
  currentTime: {
    type: Number,
    default: 0,
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook to handle system users
roomSchema.pre('save', function(next) {
  // If host is not provided and this is a new room, set it as a system room
  if (!this.host && this.isNew) {
    this.hostType = 'system';
    this.participants = ['system'];
  }
  next();
});

module.exports = mongoose.model("Room", roomSchema);
