const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlistController");
const authController = require("../controllers/authController");

// All routes below this line require authentication
router.use(authController.protect);

// Add a movie to watchlist
router.post("/:movieId", watchlistController.addToWatchlist);

// Get all movies in watchlist
router.get("/", watchlistController.getWatchlist);

// Remove a movie from watchlist
router.delete("/:movieId", watchlistController.removeFromWatchlist);

module.exports = router;
