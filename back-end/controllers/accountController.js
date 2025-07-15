const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");
exports.updateMe = async (req, res) => {
  try {
    if (req.body.password || req.body.confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "This route is not for password updates.",
      });
    }
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.file) updates.avatar = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.updateMyPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    const isCorrect = await user.correctPassword(req.body.currentPassword);
    if (!isCorrect) {
      return res
        .status(401)
        .json({ status: "fail", message: "Current password is wrong" });
    }

    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;

    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.deleteMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.avatar && user.avatar !== "default.jpg") {
      const avatarPath = path.join(
        __dirname,
        "..",
        "public",
        "img",
        "users",
        user.avatar
      );
      fs.unlink(avatarPath, (err) => {
        if (err) console.warn("Avatar deletion failed:", err.message);
      });
    }
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({
      status: "success",
      message: "Your account and data have been permanently deleted.",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
