const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const createError = require("../utils/createError");

const userMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createError("Authorization header is required", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw createError("Invalid authorization format", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw createError("Authentication token is required", 401);
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError("Your session has expired. Please login again.", 401);
      }

      if (error.name === "JsonWebTokenError") {
        throw createError(
          "Invalid authentication token. Please login again.",
          401,
        );
      }

      throw createError("Authentication failed. Please login again.", 401);
    }

    const user = await User.findById(decoded.userId).select("status");

    if (!user) {
      throw createError("User not found", 401);
    }

    if (user.status === "blocked") {
      throw createError("Your account has been blocked", 403);
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userMiddleware;
