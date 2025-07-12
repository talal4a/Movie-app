const express = require("express");
const { protect } = require("../controllers/authController");
const {
  createReview,
  getMovieReviews,
  upsertReview,
  deleteReview,
} = require("../controllers/reviewController");
const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(getMovieReviews)
  .post(protect, createReview)
  .patch(protect, upsertReview)
  .delete(protect, deleteReview);
module.exports = router;
