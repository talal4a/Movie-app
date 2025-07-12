const mongoose = require("mongoose");
// Define the schema
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

// ✅ Prevent duplicate reviews (1 review per movie per user)
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

// ✅ Auto-populate user's name when fetching reviews
reviewSchema.pre(/^find/, function (next) {
  this.populate("user", "name");
  next();
});

// ✅ Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function (movieId) {
  const stats = await this.aggregate([
    { $match: { movie: movieId } },
    {
      $group: {
        _id: "$movie",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await mongoose.model("Movie").findByIdAndUpdate(movieId, {
    "ratings.voteCount": stats[0]?.nRatings || 0,
    "ratings.voteAverage": stats[0]?.avgRating || 0,
  });
};

// ✅ Recalculate on review save
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.movie);
});

// ✅ Recalculate on review delete
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) await doc.constructor.calcAverageRatings(doc.movie);
});

// ✅ Recalculate on review update (optional)
reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) await doc.constructor.calcAverageRatings(doc.movie);
});

// Export the model
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
