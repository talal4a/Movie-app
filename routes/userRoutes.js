const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();
router.use(protect);
router.use(restrictTo("admin"));
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUserRole);
router.delete("/:id", deleteUser);
module.exports = router;
