const User = require("../models/userModel");
const Movie = require("../models/movieModel");
exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.movieId;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const user = await User.findById(userId);

    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    user.watchlist.push(movieId);
    await user.save();

    // Return the full movie object so the frontend can update immediately
    res.status(200).json({ message: "Movie added to watchlist", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.movieId;
    const user = await User.findById(userId);
    user.watchlist = user.watchlist.filter(
      (id) => id.toString() !== movieId.toString()
    );
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Movie removed from watchlist",
      watchlist: user.watchlist,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get user’s full watchlist with movie details
exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("watchlist");
    res.status(200).json({
      status: "success",
      results: user.watchlist.length,
      data: user.watchlist,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
