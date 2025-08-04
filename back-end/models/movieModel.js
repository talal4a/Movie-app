const mongoose = require("mongoose");
const slugify = require("slugify");
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
  previewTrailer: {
    type: String,
    default: "",
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
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

movieSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

movieSchema.statics.updateAllSlugs = async function () {
  try {
    const movies = await this.find({});
    let updatedCount = 0;

    for (const movie of movies) {
      const newSlug = slugify(movie.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      if (movie.slug !== newSlug) {
        movie.slug = newSlug;
        await movie.save();
        updatedCount++;
        console.log(`Updated slug for: ${movie.title} -> ${newSlug}`);
      }
    }

    return {
      totalMovies: movies.length,
      updated: updatedCount,
      message: `Successfully updated ${updatedCount} out of ${movies.length} movies`,
    };
  } catch (error) {
    console.error("Error updating movie slugs:", error);
    throw error;
  }
};

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
