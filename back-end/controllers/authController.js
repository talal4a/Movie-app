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
    //1-Check if email is exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(200).json({
        status: "fail",
        message: "Email already exists",
      });
    }
    //2.if user is not exist create user
    const newUser = await User.create({
      email,
      password,
      name,
      confirmPassword,
      role,
    });
    //3.create token
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
    // 1. Get user by email
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with that email address.",
      });
    }

    // 2. Generate reset token and save to DB
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. Create reset URL
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPassword/${resetToken}`;

    // 4. Email content
    const message = `Hi ${user.name},\n\nYou requested a password reset.\nPlease click the link below to reset your password:\n\n${resetURL}\n\nIf you didn't request this, you can safely ignore this email.\n\n– Movie Website Support`;

    // 5. Send the email
    await sendEmail({
      email: user.email,
      subject: "Reset your password (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset token sent to your email!",
    });
  } catch (err) {
    console.error("Email sending error:", err.message);

    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      status: "fail",
      message: "Error sending email. Try again later.",
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
