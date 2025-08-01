const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = async (req, res) => {
  try {
    const { name, password, email, confirmPassword, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(200).json({
        status: "fail",
        message: "Email already exists",
      });
    }

    const newUser = await User.create({
      email,
      password,
      name,
      confirmPassword,
      role,
    });

    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    const isMatch = await user.correctPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does not exist.",
      });
    }
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token",
    });
  }
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({
        status: "success",
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
  <div style="font-family: sans-serif; padding: 20px;">
    <h2>Password Reset Requested</h2>
    <p>Hi ${user.name},</p>
    <p>You requested to reset your password. Click the button below to reset:</p>
    <a href="${resetURL}" 
       style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
      Verify & Reset Password
    </a>
    <p>If you didn’t request this, ignore this email.</p>
  </div>
`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset your password (valid for 10 minutes)",
        html: message,
      });

      res.status(200).json({
        status: "success",
        message: "Password reset token sent to your email!",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);

      res.status(200).json({
        status: "success",
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });

      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
  } catch (err) {
    console.error("Password reset error:", err);

    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      status: "error",
      message:
        "There was an error processing your request. Please try again later.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};
