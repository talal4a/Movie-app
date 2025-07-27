const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authController = require("../controllers/authController");
router.get("/featured", movieController.getFeaturedMovie);
router.use(authController.protect);
router.get(
  "/collection/:collectionName",
  authController.restrictTo("admin"),
  movieController.getMoviesWithCollection
);
router.get(
  "/grouped",
  authController.restrictTo("admin"),
  movieController.getGroupedMovies
);
router
  .route("/")
  .get(movieController.getAllMovies)
  .post(authController.restrictTo("admin"), movieController.createMovie);
router.get(
  "/related/:id",
  authController.restrictTo("admin"),
  movieController.getMoviesOfSameCollection
);
router.post("/upload-trailer", movieController.uploadTrailerToCloudinary);
router
  .route("/:id")
  .get(movieController.getMovieById)
  .patch(authController.restrictTo("admin"), movieController.updateMovie)
  .delete(authController.restrictTo("admin"), movieController.deleteMovie);
module.exports = router;
