const express = require("express");
const { watchHistory } = require("../controllers/watchHistoryController");
const router = express.Router();
const authController = require("../controllers/authController");
const watchHistoryModel = require("../models/watchHistoryModel");
router.post("/update-progress", authController.protect, watchHistory);
router.get("/progress/:movieId", authController.protect, async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  const record = await watchHistoryModel.findOne({ user: userId, movie: movieId });
  res.json({ progress: record?.progress || 0 });
});
module.exports = router;
