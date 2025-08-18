const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlistController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.post("/:movieId", watchlistController.addToWatchlist);

router.get("/", watchlistController.getWatchlist);

router.delete("/:movieId", watchlistController.removeFromWatchlist);

module.exports = router;
