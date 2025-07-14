const axios = require("axios");
const Movie = require("../models/movieModel");
const TMDB_API_KEY = process.env.TMDB_API_KEY;
exports.createMovie = async (req, res) => {
  try {
    const { title, embedUrl } = req.body;

    // 1. Search movie by title
    const searchRes = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: { api_key: TMDB_API_KEY, query: title },
      }
    );

    const movie = searchRes.data.results[0];
    if (!movie) {
      return res
        .status(404)
        .json({ status: "fail", message: "Movie not found in TMDb" });
    }

    const movieId = movie.id;

    // 2. Get full movie details
    const detailsRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
    const details = detailsRes.data;

    // 3. Get cast information
    const creditsRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
    const credits = creditsRes.data;
    const cast = credits.cast.slice(0, 5).map((member) => ({
      name: member.name,
      character: member.character || "N/A",
    }));

    // Extract genres as array of strings
    const genres = details.genres.map((g) => g.name);

    // 4. Create and save the movie
    const newMovie = await Movie.create({
      tmdbId: movieId,
      title,
      description: details.overview,
      releaseYear: parseInt(details.release_date.split("-")[0]),
      runtime: `${details.runtime} min`,
      genres,
      poster: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/original${details.backdrop_path}`,
      embedUrl,
      cast,
      ratings: {
        voteAverage: details.vote_average,
        voteCount: details.vote_count,
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

    // 1. Filter by genre
    if (req.query.genre) {
      queryObj.genres = { $in: [req.query.genre] };
    }

    // 2. Filter by year
    if (req.query.year) {
      queryObj.releaseYear = +req.query.year;
    }

    // 3. Search by title (case-insensitive)
    if (req.query.search) {
      queryObj.title = { $regex: req.query.search, $options: "i" };
    }

    // 4. Sorting (default: newest first)
    let sortBy = "-createdAt";
    if (req.query.sort) {
      sortBy = req.query.sort.split(",").join(" ");
    }

    // 5. Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Final query
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
