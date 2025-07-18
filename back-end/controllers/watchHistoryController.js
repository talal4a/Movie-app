const WatchHistoryModel = require("../models/watchHistoryModel");
exports.watchHistory = async (req, res) => {
  const { movieId, progressInSeconds } = req.body;
  const userId = req.user.id;
  try {
    let history = await WatchHistoryModel.findOne({ user: userId, movie: movieId });
    if (history) {
      history.progress = progressInSeconds;
      history.lastWatchedAt = new Date();
    } else {
      history = new WatchHistory({
        user: userId,
        movie: movieId,
        progress: progressInSeconds,
        lastWatchedAt: new Date(),
      });
    }
    await history.save();
    res.status(200).json({ status: "success", data: history });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
