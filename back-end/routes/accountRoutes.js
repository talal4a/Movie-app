const upload = require("../middleware/upload");
const express = require("express");
const { protect } = require("../controllers/authController");
const {
  updateMe,
  updateMyPassword,
  deleteMe,
} = require("../controllers/accountController");
const router = express.Router();
router.patch("/updateMe", protect, upload.single("avatar"), updateMe);
router.patch("/updateMyPassword", protect, updateMyPassword);
router.delete("/deleteMe", protect, deleteMe);
module.exports = router;
