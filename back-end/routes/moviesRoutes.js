const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authController = require("../controllers/authController");
router.use(authController.protect);
router.get("/featured", movieController.getFeaturedMovie);
router.get(
  "/generate-slugs",
  authController.restrictTo("admin"),
  movieController.generateSlugsForAllMovies
);
router.get(
  "/collection/:collectionName",
  authController.protect,
  movieController.getMoviesWithCollection
);
router.get(
  "/grouped",
  authController.protect,
  movieController.getGroupedMovies
);
router
  .route("/")
  .get(movieController.getAllMovies)
  .post(authController.restrictTo("admin"), movieController.createMovie);
router.get(
  "/related/:id",
  authController.protect,
  movieController.getMoviesOfSameCollection
);
router.post(
  "/upload-trailer",
  authController.restrictTo("admin"),
  movieController.uploadTrailerToCloudinary
);
router
  .route("/:id")
  .get(movieController.getMovieById)
  .patch(authController.restrictTo("admin"), movieController.updateMovie)
  .delete(authController.restrictTo("admin"), movieController.deleteMovie);
module.exports = router;
