const jwt = require("jsonwebtoken");

// CREATE ACCESS TOKEN
const createAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

// CREATE REFRESH TOKEN
const createRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
