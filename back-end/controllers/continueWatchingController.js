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
  const { movieId } = req.params;

  if (!movieId) {
    return res.status(400).json({ message: "Movie ID is required." });
  }

  await ContinueWatching.findOneAndDelete({
    user: req.user.id,
    movie: movieId,
  });

  res.status(200).json({ message: "Removed from Continue Watching" });
};
