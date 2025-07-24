const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authController = require("../controllers/authController");
router.get("/featured", movieController.getFeaturedMovie);
router.use(authController.protect);
router
  .route("/")
  .get(movieController.getAllMovies)
  .post(authController.restrictTo("admin"), movieController.createMovie);
router
  .route("/:id")
  .get(movieController.getMovieById)
  .patch(authController.restrictTo("admin"), movieController.updateMovie)
  .delete(authController.restrictTo("admin"), movieController.deleteMovie);
router.get(
  "/collection/:collectionName",
  authController.restrictTo("admin"),
  movieController.getMoviesWithCollection
);
module.exports = router;
