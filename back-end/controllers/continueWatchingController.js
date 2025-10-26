const ContinueWatching = require("../models/ContinueWatchingModel");
exports.markAsWatched = async (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ message: "Movie ID is required." });
  }
  await ContinueWatching.findOneAndUpdate(
    { user: req.user.id, movie: movieId },
    { lastWatchedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(200).json({ message: "Marked as watched" });
};
exports.getContinueWatching = async (req, res) => {
  const list = await ContinueWatching.find({ user: req.user.id })
    .populate("movie")
    .sort({ lastWatchedAt: -1 });
  res.status(200).json({ list });
};
exports.removeFromContinueWatching = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;
    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required." });
    }
    console.log(`Attempting to remove movie ${movieId} for user ${userId}`);
    const result = await ContinueWatching.findOneAndDelete({
      user: userId,
      movie: movieId,
    });
    if (!result) {
      console.log(`No record found for user ${userId} and movie ${movieId}`);
      return res.status(404).json({ message: "Record not found" });
    }
    console.log(`Successfully removed movie ${movieId} for user ${userId}`);
    res.status(200).json({ 
      success: true,
      message: "Removed from Continue Watching" 
    });
  } catch (error) {
    console.error('Error in removeFromContinueWatching:', error);
    res.status(500).json({ 
      success: false,
      message: "Error removing from Continue Watching",
      error: error.message 
    });
  }
};
