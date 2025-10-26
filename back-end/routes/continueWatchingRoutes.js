const express = require("express");
const {
  markAsWatched,
  getContinueWatching,
  removeFromContinueWatching,
} = require("../controllers/continueWatchingController");
const { protect } = require("../controllers/authController");
const router = express.Router();
router.post("/", protect, markAsWatched);
router.get("/", protect, getContinueWatching);
router.delete("/:movieId", protect, removeFromContinueWatching);
module.exports = router;
