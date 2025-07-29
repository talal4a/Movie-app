const axios = require("axios");
const Movie = require("../models/movieModel");
const cloudinary = require("../config/cloudnary");
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const tmp = require("tmp");
const fs = require("fs");
const mongoose = require("mongoose");
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
exports.getGroupedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ collection: { $ne: null } });
    const grouped = {};
    movies.forEach((movie) => {
      const collectionName = movie.collection;
      if (!grouped[collectionName]) {
        grouped[collectionName] = [];
      }
      if (!grouped[collectionName].some((m) => m._id.equals(movie._id))) {
        grouped[collectionName].push(movie);
      }
    });
    res.json(grouped);
  } catch (err) {
    console.error("Error grouping movies:", err);
    res.status(500).json({ error: "Failed to fetch grouped movies" });
  }
};

exports.getMoviesOfSameCollection = async (req, res) => {
  try {
    const movieId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      console.log("Invalid ObjectId");
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    if (!movie.collection) {
      console.log("Movie has no collection");
      return res.status(200).json({ data: [] });
    }

    const relatedMovies = await Movie.find({
      collection: movie.collection,
      _id: { $ne: movie._id },
    });

    res.status(200).json(relatedMovies);
  } catch (error) {
    console.error("Error fetching related movies:", error);
    res.status(500).json({ error: "Failed to fetch related movies" });
  }
};

exports.uploadTrailerToCloudinary = async (req, res) => {
  try {
    const { movieIds } = req.body;
    if (!Array.isArray(movieIds) || movieIds.length === 0) {
      return res.status(400).json({ error: "No movie IDs provided" });
    }
    const uploaded = [];
    for (const id of movieIds) {
      try {
        const movie = await Movie.findById(id);
        if (!movie || movie.previewTrailer) continue;
        const tmdbUrl = `https://api.themoviedb.org/3/movie/${movie.tmdbId}/videos?api_key=${process.env.TMDB_API_KEY}`;
        const response = await axios.get(tmdbUrl);
        const trailer = response.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (!trailer) continue;
        const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        const tmpInput = tmp.tmpNameSync({ postfix: ".mp4" });
        const tmpOutput = tmp.tmpNameSync({ postfix: ".mp4" });
        const videoStream = ytdl(youtubeUrl, {
          quality: "highest",
          filter: "audioandvideo",
        });
        const writeStream = fs.createWriteStream(tmpInput);
        await new Promise((resolve, reject) => {
          videoStream.pipe(writeStream);
          videoStream.on("end", resolve);
          videoStream.on("error", reject);
        });
        await new Promise((resolve, reject) => {
          ffmpeg(tmpInput)
            .setStartTime(10)
            .setDuration(18)
            .videoCodec("libx264")
            .audioCodec("aac")
            .outputOptions([
              "-vf scale=1280:720,unsharp=5:5:1.0:5:5:0.0",
              "-crf 22",
              "-preset slow",
              "-b:a 128k",
              "-movflags +faststart",
            ])
            .output(tmpOutput)
            .on("end", resolve)
            .on("error", reject)
            .run();
        });
        const cloudinaryUpload = await cloudinary.uploader.upload(tmpOutput, {
          resource_type: "video",
          folder: "trailers",
          public_id: trailer.key,
        });
        movie.previewTrailer = cloudinaryUpload.secure_url;
        await movie.save();
        uploaded.push({
          movieId: movie._id,
          url: cloudinaryUpload.secure_url,
        });
        fs.unlinkSync(tmpInput);
        fs.unlinkSync(tmpOutput);
      } catch (innerErr) {
        console.warn(`⚠️ Failed for movie ID ${id}: ${innerErr.message}`);
        continue;
      }
    }
    res.status(200).json({
      message: `✅ Uploaded ${uploaded.length} trailers`,
      trailers: uploaded,
    });
  } catch (err) {
    console.error("❌ uploadSelectedTrailersToCloudinary Error:", err.message);
    res.status(500).json({ error: "Bulk trailer upload failed" });
  }
};
