const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getCurrentUser,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();
router.use(protect);
router.get("/me", getCurrentUser);
router.use(restrictTo("admin"));
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUserRole);
router.delete("/:id", deleteUser);
module.exports = router;
