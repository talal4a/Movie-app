const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
exports.createReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const movieId = req.params.movieId;
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid movie ID format",
      });
    }
    const newReview = await Review.create({
      review,
      rating,
      movie: movieId,
      user: req.user.id,
    });
    await Review.calcAverageRatings(movieId);
    res.status(201).json({
      status: "success",
      data: newReview,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getMovieReviews = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid movie ID format",
      });
    }
    const reviews = await Review.find({ movie: movieId })
      .populate("user", "name email")
      .sort("-createdAt");
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.upsertReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const movieId = req.params.movieId;
    const userId = req.user.id;
    const updatedReview = await Review.findOneAndUpdate(
      { movie: movieId, user: userId },
      { review, rating },
      { new: true, upsert: true, runValidators: true }
    );
    await Review.calcAverageRatings(movieId);

    res.status(200).json({
      status: "success",
      data: updatedReview,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.deleteReview = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const userId = req.user.id;
    const deleted = await Review.findOneAndDelete({
      movie: movieId,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found or not authorized to delete",
      });
    }

    await Review.calcAverageRatings(movieId);

    res.status(204).json({
      status: "success",
      message: "Review deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
