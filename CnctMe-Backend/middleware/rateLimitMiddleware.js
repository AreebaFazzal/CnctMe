const rateLimit = require("express-rate-limit");

// ==========================================
// LOGIN RATE LIMIT
// ==========================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// ==========================================
// FORGOT PASSWORD RATE LIMIT
// ==========================================

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many password reset requests. Please try again later.",
  },
});

// ==========================================
// RESEND VERIFICATION RATE LIMIT
// ==========================================

const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many verification requests. Please try again later.",
  },
});

// ==========================================
// REGISTER RATE LIMIT
// ==========================================

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

// ==========================================
// REFRESH TOKEN RATE LIMIT
// ==========================================

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many refresh requests. Please try again later.",
  },
});

module.exports = {
  loginLimiter,
  forgotPasswordLimiter,
  resendVerificationLimiter,
  registerLimiter,
  refreshLimiter,
};
