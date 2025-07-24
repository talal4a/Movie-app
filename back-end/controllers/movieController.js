const axios = require("axios");
const Movie = require("../models/movieModel");
const TMDB_API_KEY = process.env.TMDB_API_KEY;
exports.createMovie = async (req, res) => {
  try {
    const { title, embedUrl, tmdbId } = req.body;

    if (!tmdbId || !embedUrl || !title) {
      return res.status(400).json({
        status: "fail",
        message: "Title, TMDb ID, and embed URL are required",
      });
    }

    const existingMovie = await Movie.findOne({ tmdbId });
    if (existingMovie) {
      return res.status(400).json({
        status: "fail",
        message: "Movie already exists",
      });
    }

    const detailsRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}`,
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
    const details = detailsRes.data;

    const creditsRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
    const credits = creditsRes.data;

    const cast = credits.cast.slice(0, 5).map((member) => ({
      name: member.name,
      character: member.character || "N/A",
      avatar: member.profile_path
        ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
        : null,
    }));

    const collection = details.belongs_to_collection
      ? details.belongs_to_collection.name
      : null;

    const genres = details.genres.map((g) => g.name);

    const newMovie = await Movie.create({
      tmdbId,
      title: title || details.title,
      collection,
      description: details.overview,
      releaseYear: parseInt(details.release_date.split("-")[0]),
      runtime: `${details.runtime} min`,
      genres,
      poster: `https://image.tmdb.org/t/p/original${details.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/original${details.backdrop_path}`,
      embedUrl,
      cast,
      tmdbRatings: {
        average: details.vote_average,
        count: details.vote_count,
      },
      userRatings: {
        average: 0,
        count: 0,
      },
    });

    res.status(201).json({ status: "success", data: newMovie });
  } catch (err) {
    console.error("Create Movie Error:", err.message);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const queryObj = {};
    if (req.query.genre) {
      queryObj.genres = { $in: [req.query.genre] };
    }
    if (req.query.year) {
      queryObj.releaseYear = +req.query.year;
    }
    if (req.query.search) {
      queryObj.title = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.excludeCollection === "true") {
      queryObj.collection = { $exists: false };
    }
    let sortBy = "-createdAt";
    if (req.query.sort) {
      sortBy = req.query.sort.split(",").join(" ");
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const movies = await Movie.find(queryObj)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      status: "success",
      results: movies.length,
      data: movies,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res
        .status(404)
        .json({ status: "fail", message: "Movie not found" });
    }
    res.status(200).json({ status: "success", data: movie });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.updateMovie = async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.getFeaturedMovie = async (req, res) => {
  try {
    const featured = await Movie.findOne().sort({ createdAt: 1 });
    res.status(200).json({
      status: "success",
      data: featured,
    });
  } catch (err) {
    console.error("Error in getFeaturedMovie:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch featured movie",
    });
  }
};
exports.getMoviesWithCollection = async (req, res) => {
  try {
    const movies = await Movie.find({
      collection: { $exists: true, $ne: "" },
    });
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies with collection" });
  }
};
