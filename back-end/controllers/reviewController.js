const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
exports.createReview = async (req, res) => {
  try {
    console.log('Creating review with data:', {
      body: req.body,
      params: req.params,
      user: req.user
    });

    const { review, rating } = req.body;
    const movieId = req.params.movieId;
    
    if (!review || rating === undefined) {
      console.error('Missing required fields:', { review, rating });
      return res.status(400).json({
        status: "error",
        message: "Review and rating are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      console.error('Invalid movie ID:', movieId);
      return res.status(400).json({
        status: "error",
        message: "Invalid movie ID format"
      });
    }

    if (!req.user?.id) {
      console.error('No user ID in request');
      return res.status(401).json({
        status: "error",
        message: "User not authenticated"
      });
    }

    const reviewData = {
      review,
      rating: Number(rating),
      movie: movieId,
      user: req.user.id
    };

    console.log('Attempting to create review:', reviewData);
    
    const newReview = await Review.create(reviewData);
    console.log('Review created successfully:', newReview);
    
    try {
      await Review.calcAverageRatings(movieId);
      console.log('Successfully updated average ratings');
    } catch (calcError) {
      console.error('Error updating average ratings:', calcError);
      // Don't fail the request if just the average update fails
    }
    
    res.status(201).json({
      status: "success",
      data: newReview,
    });
  } catch (err) {
    console.error('Error in createReview:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
    
    // Handle duplicate key error (same user reviewing same movie twice)
    if (err.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "You have already reviewed this movie. Please update your existing review instead."
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        status: "error",
        message: `Validation error: ${messages.join(', ')}`
      });
    }
    
    res.status(500).json({
      status: "error",
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'An error occurred while creating the review'
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
      .populate({
        path: 'user',
        select: 'name email avatar',
        populate: {
          path: 'avatar',
          select: 'url'
        }
      })
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
