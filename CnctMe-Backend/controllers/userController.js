const mongoose = require("mongoose");
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");

const createError = require("../utils/createError");

const { createAccessToken, createRefreshToken } = require("../utils/token");

const hashToken = require("../utils/hashToken");

const {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require("../utils/refreshCookies");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Application = require("../models/applicationModel");
const SavedJob = require("../models/savedJobsModel");
const Company = require("../models/companyModel");
const Job = require("../models/jobModel");
const Interview = require("../models/interviewModel");
const Notification = require("../models/notificationModel");

// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const allowedRoles = ["jobseeker", "recruiter"];

  if (!allowedRoles.includes(role)) {
    throw createError(
      "Invalid role. You can only register as a jobseeker or recruiter",
      400,
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw createError("Email already exists", 409);
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const verificationTokenHash = hashToken(verificationToken);

  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const hashedPassword = await bcrypt.hash(password, 12);

  const verificationCleanupAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const user = new User({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    isVerified: false,
    verificationToken: verificationTokenHash,
    verificationTokenExpires,
    verificationCleanupAt,
  });

  const savedUser = await user.save();

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  await sendVerificationEmail({
    email: savedUser.email,
    verificationLink,
  });

  return res.status(201).json({
    success: true,

    message:
      "Registration successful. Please check your email to verify your account.",

    user: {
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
      isVerified: savedUser.isVerified,
    },
  });
};

// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw createError("Invalid email or password", 401);
  }

  if (!user.isVerified) {
    throw createError("Please verify your email before logging in", 403);
  }

  if (user.status === "blocked") {
    throw createError("Your account has been blocked", 403);
  }

  const accessToken = createAccessToken(user);

  const refreshToken = createRefreshToken(user._id);

  const refreshTokenHash = hashToken(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json({
    success: true,

    message: "Login successful",

    accessToken,

    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

// ==========================================
// GET PROFILE
// ==========================================

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId)
    .select("-password")
    .select("-profilePicture.data");

  if (!user) {
    throw createError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    user,
  });
};

// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  if (req.body.firstName !== undefined) {
    user.firstName = req.body.firstName.trim();
  }

  if (req.body.lastName !== undefined) {
    user.lastName = req.body.lastName.trim();
  }

  if (req.body.phoneNumber !== undefined) {
    user.phoneNumber = req.body.phoneNumber.trim();
  }

  if (req.body.position !== undefined) {
    user.position = req.body.position.trim();
  }

  if (req.body.bio !== undefined) {
    user.bio = req.body.bio.trim();
  }

  if (req.body.linkedin !== undefined) {
    user.linkedin = req.body.linkedin.trim();
  }

  if (req.body.location !== undefined) {
    user.location = req.body.location.trim();
  }

  if (req.body.skills !== undefined) {
    user.skills = req.body.skills;
  }

  if (req.body.education !== undefined) {
    user.education = req.body.education;
  }

  if (req.body.experience !== undefined) {
    user.experience = req.body.experience;
  }

  if (req.body.github !== undefined) {
    user.github = req.body.github.trim();
  }

  if (req.file) {
    user.profilePicture = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
  }

  await user.save();

  const updatedUser = await User.findById(user._id)
    .select("-password")
    .select("-profilePicture.data");

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
};

// ==========================================
// GET PROFILE PICTURE
// ==========================================

const getProfilePicture = async (req, res) => {
  const user = await User.findById(req.user.userId).select("profilePicture");

  if (!user) {
    throw createError("User not found", 404);
  }

  if (!user.profilePicture || !user.profilePicture.data) {
    throw createError("Profile picture not found", 404);
  }

  res.set("Content-Type", user.profilePicture.contentType);

  return res.send(user.profilePicture.data);
};

// ==========================================
// REFRESH TOKEN
// ==========================================

const refreshToken = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    throw createError("Refresh token not found", 401);
  }

  const oldRefreshTokenHash = hashToken(oldRefreshToken);

  const storedToken = await RefreshToken.findOne({
    tokenHash: oldRefreshTokenHash,
    expiresAt: {
      $gt: new Date(),
    },
  });

  if (!storedToken) {
    clearRefreshTokenCookie(res);

    throw createError("Refresh token is invalid or expired", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });

    clearRefreshTokenCookie(res);

    throw createError("Refresh token is invalid or expired", 401);
  }

  if (storedToken.userId.toString() !== decoded.userId.toString()) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });

    clearRefreshTokenCookie(res);

    throw createError("Invalid refresh token", 401);
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });

    clearRefreshTokenCookie(res);

    throw createError("User no longer exists", 401);
  }

  if (user.status === "blocked") {
    await RefreshToken.deleteMany({
      userId: user._id,
    });

    clearRefreshTokenCookie(res);

    throw createError("Your account has been blocked", 403);
  }

  // Rotate refresh token
  await RefreshToken.deleteOne({
    _id: storedToken._id,
  });

  const newAccessToken = createAccessToken(user);

  const newRefreshToken = createRefreshToken(user._id);

  const newRefreshTokenHash = hashToken(newRefreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: newRefreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setRefreshTokenCookie(res, newRefreshToken);

  return res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
};

// ==========================================
// LOGOUT
// ==========================================

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const refreshTokenHash = hashToken(refreshToken);

    await RefreshToken.deleteOne({
      tokenHash: refreshTokenHash,
    });
  }

  clearRefreshTokenCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// ==========================================
// VERIFY EMAIL
// ==========================================

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw createError("Verification token is required", 400);
  }

  const verificationTokenHash = hashToken(token);

  const user = await User.findOne({
    verificationToken: verificationTokenHash,

    verificationTokenExpires: {
      $gt: new Date(),
    },
  });

  if (!user) {
    throw createError("Invalid or expired verification token", 400);
  }

  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpires = null;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
};

// ==========================================
// RESEND VERIFICATION EMAIL
// ==========================================

const resendVerification = async (req, res) => {
  const normalizedEmail = req.body.email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    return res.status(200).json({
      success: true,

      message:
        "If an account exists with this email, a verification email has been sent.",
    });
  }

  if (user.isVerified) {
    return res.status(200).json({
      success: true,
      message: "Email is already verified",
    });
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const verificationTokenHash = hashToken(verificationToken);

  user.verificationToken = verificationTokenHash;

  user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.save();

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  await sendVerificationEmail({
    email: user.email,
    verificationLink,
  });

  return res.status(200).json({
    success: true,

    message:
      "If an account exists with this email, a verification email has been sent.",
  });
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword = async (req, res) => {
  const normalizedEmail = req.body.email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    return res.status(200).json({
      success: true,

      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenHash = hashToken(resetToken);

  user.resetPasswordToken = resetTokenHash;

  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendPasswordResetEmail({
    email: user.email,
    resetLink,
  });

  return res.status(200).json({
    success: true,

    message:
      "If an account exists with this email, a password reset link has been sent.",
  });
};

// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token) {
    throw createError("Reset token is required", 400);
  }

  const resetTokenHash = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,

    resetPasswordExpires: {
      $gt: new Date(),
    },
  });

  if (!user) {
    throw createError("Invalid or expired reset token", 400);
  }

  const isSamePassword = await bcrypt.compare(password, user.password);

  if (isSamePassword) {
    throw createError(
      "New password must be different from your previous password",
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user.password = hashedPassword;

  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  await RefreshToken.deleteMany({
    userId: user._id,
  });

  clearRefreshTokenCookie(res);

  return res.status(200).json({
    success: true,
    message: "Password reset successfully. Please log in again.",
  });
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw createError("Current password is incorrect", 401);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw createError(
      "New password must be different from current password",
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;

  await user.save();

  await RefreshToken.deleteMany({
    userId: user._id,
  });

  clearRefreshTokenCookie(res);

  return res.status(200).json({
    success: true,
    message: "Password changed successfully. Please log in again.",
  });
};

// ==========================================
// UPLOAD / UPDATE RESUME
// ==========================================

const uploadResume = async (req, res) => {
  const userId = req.user.userId;

  if (!req.file) {
    throw createError("Resume PDF is required", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  user.resume = {
    data: req.file.buffer,
    contentType: req.file.mimetype,
    originalName: req.file.originalname,
  };

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
  });
};

// ==========================================
// GET RESUME
// ==========================================

const getResume = async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).select("resume");

  if (!user) {
    throw createError("User not found", 404);
  }

  if (!user.resume || !user.resume.data) {
    throw createError("Resume not found", 404);
  }

  res.set({
    "Content-Type": user.resume.contentType,

    "Content-Disposition": `inline; filename="${user.resume.originalName}"`,
  });

  return res.send(user.resume.data);
};

// ==========================================
// DELETE RESUME
// ==========================================

const deleteResume = async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  if (!user.resume || !user.resume.data) {
    throw createError("Resume not found", 404);
  }

  user.resume = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
};

// ==========================================
// RECRUITER: GET APPLICANT PROFILE
// ==========================================

const getApplicantProfile = async (req, res) => {
  const requesterRole = req.user.role;
  const candidateId = req.params.userId;

  const candidate = await User.findById(candidateId).select(
    "firstName lastName email phoneNumber profilePicture position bio location skills education experience linkedin github role status createdAt",
  );

  if (!candidate) {
    throw createError("Candidate not found", 404);
  }

  if (candidate.status === "blocked") {
    throw createError("This candidate is not available", 404);
  }

  if (requesterRole === "admin") {
    return res.status(200).json({
      success: true,
      profile: candidate,
    });
  }

  if (requesterRole !== "recruiter") {
    throw createError(
      "You do not have permission to access this resource",
      403,
    );
  }

  const recruiterId = req.user.userId;

  const application = await Application.findOne({
    user: candidateId,
  }).populate({
    path: "job",
    select: "createdBy",
  });

  if (!application) {
    throw createError("Candidate application not found", 404);
  }

  if (!application.job) {
    throw createError("Associated job not found", 404);
  }

  if (application.job.createdBy.toString() !== recruiterId.toString()) {
    throw createError(
      "You are not authorized to view this candidate profile",
      403,
    );
  }

  if (candidate.role !== "jobseeker") {
    throw createError("This user is not a jobseeker", 400);
  }

  return res.status(200).json({
    success: true,
    profile: candidate,
  });
};

// ==========================================
// GET USER PROFILE PICTURE BY ID
// ==========================================

const getUserProfilePictureById = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError("Invalid user ID", 400);
  }

  const user = await User.findById(userId).select(
    "profilePicture.data profilePicture.contentType",
  );

  if (!user) {
    throw createError("User not found", 404);
  }

  if (!user.profilePicture || !user.profilePicture.data) {
    throw createError("Profile picture not found", 404);
  }

  const imageBuffer = Buffer.from(user.profilePicture.data);

  res.set("Content-Type", user.profilePicture.contentType || "image/jpeg");

  res.set("Cache-Control", "private, max-age=3600");

  return res.end(imageBuffer);
};

// ==========================================
// UPDATE SETTINGS
// ==========================================

const updateSettings = async (req, res) => {
  const {
    emailNotifications,
    applicationNotifications,
    interviewNotifications,
  } = req.body;

  const user = await User.findById(req.user.userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  if (!user.settings) {
    user.settings = {};
  }

  if (emailNotifications !== undefined) {
    user.settings.emailNotifications = emailNotifications === true;
  }

  if (applicationNotifications !== undefined) {
    user.settings.applicationNotifications = applicationNotifications === true;
  }

  if (interviewNotifications !== undefined) {
    user.settings.interviewNotifications = interviewNotifications === true;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    settings: user.settings,
  });
};

// ==========================================
// DELETE ACCOUNT PERMANENTLY
// ==========================================

const deleteAccount = async (req, res) => {
  const { confirmation } = req.body;

  if (confirmation !== "DELETE") {
    throw createError(
      "Please type DELETE to permanently delete your account",
      400,
    );
  }

  const userId = req.user.userId;

  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  // ======================================================
  // JOBSEEKER ACCOUNT DELETION
  // ======================================================

  if (user.role === "jobseeker") {
    const applications = await Application.find({
      user: userId,
    }).select("_id");

    const applicationIds = applications.map((application) => application._id);

    await Notification.deleteMany({
      $or: [
        {
          recipient: userId,
        },
        {
          relatedApplication: {
            $in: applicationIds,
          },
        },
      ],
    });

    await Interview.deleteMany({
      $or: [
        {
          candidate: userId,
        },
        {
          application: {
            $in: applicationIds,
          },
        },
      ],
    });

    if (applicationIds.length > 0) {
      await Application.deleteMany({
        _id: {
          $in: applicationIds,
        },
      });
    }

    await SavedJob.deleteMany({
      user: userId,
    });

    await RefreshToken.deleteMany({
      userId,
    });

    await User.deleteOne({
      _id: userId,
    });

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "Your account and associated data have been permanently deleted",
    });
  }

  // ======================================================
  // RECRUITER ACCOUNT DELETION
  // ======================================================

  if (user.role === "recruiter") {
    const jobs = await Job.find({
      createdBy: userId,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: {
        $in: jobIds,
      },
    }).select("_id");

    const applicationIds = applications.map((application) => application._id);

    const interviews = await Interview.find({
      $or: [
        {
          recruiter: userId,
        },
        {
          application: {
            $in: applicationIds,
          },
        },
      ],
    }).select("_id");

    const interviewIds = interviews.map((interview) => interview._id);

    await Notification.deleteMany({
      $or: [
        {
          recipient: userId,
        },
        {
          relatedJob: {
            $in: jobIds,
          },
        },
        {
          relatedApplication: {
            $in: applicationIds,
          },
        },
        {
          relatedInterview: {
            $in: interviewIds,
          },
        },
      ],
    });

    await Interview.deleteMany({
      $or: [
        {
          recruiter: userId,
        },
        {
          application: {
            $in: applicationIds,
          },
        },
      ],
    });

    if (jobIds.length > 0) {
      await Application.deleteMany({
        job: {
          $in: jobIds,
        },
      });
    }

    await Job.deleteMany({
      createdBy: userId,
    });

    await Company.deleteMany({
      createdBy: userId,
    });

    await RefreshToken.deleteMany({
      userId,
    });

    await User.deleteOne({
      _id: userId,
    });

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "Your account and associated data have been permanently deleted",
    });
  }

  throw createError("Unable to delete this account", 403);
};

module.exports = {
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
};
