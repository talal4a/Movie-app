const mongoose = require("mongoose");
const Movie = require("./movieModel");
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review cannot be empty"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: [true, "Review must belong to a movie"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"],
  },
});
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  this.populate("user", "name avatar");
  next();
});
reviewSchema.statics.calcAverageRatings = async function (movieId) {
  const stats = await this.aggregate([
    { $match: { movie: movieId } },
    {
      $group: {
        _id: "$movie",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Movie.findByIdAndUpdate(movieId, {
      "ratings.averageUserRating": stats[0].avgRating,
      "ratings.userRatingCount": stats[0].count,
    });
  } else {
    await Movie.findByIdAndUpdate(movieId, {
      "ratings.averageUserRating": 0,
      "ratings.userRatingCount": 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.movie);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) await doc.constructor.calcAverageRatings(doc.movie);
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) await doc.constructor.calcAverageRatings(doc.movie);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
