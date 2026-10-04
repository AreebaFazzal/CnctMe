const User = require("../models/userModel");

const verifiedMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("isVerified");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = verifiedMiddleware;
