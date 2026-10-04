const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  getProfilePicture,
  refreshToken,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  getUserProfilePictureById,
  updateSettings,
  uploadResume,
  getResume,
  deleteResume,
  getApplicantProfile,
  deleteAccount,
} = require("../controllers/userController");

const {
  getPublicUsers,
  getPublicUserProfile,
  getPublicUserProfilePicture,
} = require("../controllers/publicUserController");

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  resendVerificationValidation,
} = require("../validators/userValidator");

const userProfileValidator = require("../validators/userProfileValidator");

const validationMiddleware = require("../middleware/validationMiddleware");

const userMiddleware = require("../middleware/userMiddleware");

const verifiedMiddleware = require("../middleware/verifiedMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const uploadImage = require("../middleware/uploadImageMiddleware");

const uploadResumeMiddleware = require("../middleware/uploadResumeMiddleware");

const parseProfileData = require("../middleware/parseProfileDataMiddleware");

const asyncHandler = require("../utils/asyncHandler");

const {
  loginLimiter,
  forgotPasswordLimiter,
  resendVerificationLimiter,
  registerLimiter,
  refreshLimiter,
} = require("../middleware/rateLimitMiddleware");

// ==========================================
// PUBLIC AUTH ROUTES
// ==========================================

router.post(
  "/register",
  registerLimiter,
  registerValidation,
  validationMiddleware,
  asyncHandler(register),
);

router.post(
  "/login",
  loginLimiter,
  loginValidation,
  validationMiddleware,
  asyncHandler(login),
);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordValidation,
  validationMiddleware,
  asyncHandler(forgotPassword),
);

router.post(
  "/reset-password",
  resetPasswordValidation,
  validationMiddleware,
  asyncHandler(resetPassword),
);

router.post(
  "/resend-verification",
  resendVerificationLimiter,
  resendVerificationValidation,
  validationMiddleware,
  asyncHandler(resendVerification),
);

router.get("/verify-email/:token", asyncHandler(verifyEmail));

router.post("/refresh", refreshLimiter, asyncHandler(refreshToken));

router.post("/logout", asyncHandler(logout));

// ==========================================
// PUBLIC PEOPLE ROUTES
// ==========================================

router.get("/public", asyncHandler(getPublicUsers));

router.get(
  "/public/:userId/profile-picture",
  asyncHandler(getPublicUserProfilePicture),
);

// ==========================================
// AUTHENTICATED PROFILE ROUTES
// ==========================================

router.get(
  "/profile",
  userMiddleware,
  verifiedMiddleware,
  asyncHandler(getProfile),
);

router.put(
  "/profile",
  userMiddleware,
  verifiedMiddleware,
  uploadImage.single("profilePicture"),
  parseProfileData,
  userProfileValidator,
  validationMiddleware,
  asyncHandler(updateProfile),
);

router.get(
  "/profile-picture",
  userMiddleware,
  verifiedMiddleware,
  asyncHandler(getProfilePicture),
);

router.get(
  "/public/:userId",
  userMiddleware,
  verifiedMiddleware,
  asyncHandler(getPublicUserProfile),
);

router.get(
  "/:userId/profile-picture",
  userMiddleware,
  verifiedMiddleware,
  asyncHandler(getUserProfilePictureById),
);

// ==========================================
// RECRUITER / ADMIN CANDIDATE PROFILE
// ==========================================

router.get(
  "/recruiter/profile/:userId",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter", "admin"]),
  asyncHandler(getApplicantProfile),
);

router.patch(
  "/change-password",
  userMiddleware,
  verifiedMiddleware,
  changePasswordValidation,
  validationMiddleware,
  asyncHandler(changePassword),
);

router.patch(
  "/settings",
  userMiddleware,
  verifiedMiddleware,
  asyncHandler(updateSettings),
);

router.post(
  "/resume",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker"]),
  uploadResumeMiddleware.single("resume"),
  asyncHandler(uploadResume),
);

router.get(
  "/resume",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker"]),
  asyncHandler(getResume),
);

router.delete(
  "/resume",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker"]),
  asyncHandler(deleteResume),
);

router.delete(
  "/account",
  userMiddleware,
  verifiedMiddleware,
  asyncHandler(deleteAccount),
);

module.exports = router;
