const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: [true, "TMDb ID is required"],
    unique: true,
  },
  title: {
    type: String,
    required: [true, "Movie title is required"],
  },
  collection: String,
  description: {
    type: String,
    required: [true, "Movie description is required"],
  },
  releaseYear: {
    type: Number,
    required: [true, "Release year is required"],
  },
  runtime: {
    type: String,
    required: [true, "Runtime is required"],
  },
  genres: {
    type: [String],
    required: [true, "Genres are required"],
  },
  poster: {
    type: String,
    required: [true, "Poster URL is required"],
  },
  backdrop: {
    type: String,
    required: [true, "Backdrop image URL is required"],
  },
  embedUrl: {
    type: String,
    required: [true, "Embed video URL is required"],
  },
  cast: [
    {
      name: { type: String, required: true },
      character: { type: String, required: true },
      avatar: String,
    },
  ],
  tmdbRatings: {
    average: { type: Number },
    count: { type: Number },
  },
  userRatings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
