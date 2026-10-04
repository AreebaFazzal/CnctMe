const mongoose = require("mongoose");
const User = require("../models/userModel");
const createError = require("../utils/createError");

const PUBLIC_USER_SELECT =
  "firstName lastName role position bio location skills education experience linkedin github createdAt";

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ==========================================
// GET PUBLIC USERS
// ==========================================

const getPublicUsers = async (req, res) => {
  const { role, search } = req.query;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);

  const skip = (page - 1) * limit;

  const filter = {
    role: { $in: ["jobseeker", "recruiter"] },
    status: "active",
    isVerified: true,
  };

  if (role === "jobseeker" || role === "recruiter") {
    filter.role = role;
  }

  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");

    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { position: regex },
      { location: regex },
      { skills: regex },
    ];
  }

  const totalUsers = await User.countDocuments(filter);

  const totalPages = Math.ceil(totalUsers / limit);

  const currentPage = totalPages > 0 ? Math.min(page, totalPages) : 1;

  const currentSkip = (currentPage - 1) * limit;

  const users = await User.find(filter)
    .select(PUBLIC_USER_SELECT)
    .sort({ createdAt: -1 })
    .skip(currentSkip)
    .limit(limit);

  return res.status(200).json({
    success: true,

    users,

    total: totalUsers,

    pagination: {
      currentPage,
      totalPages,
      totalUsers,

      hasNextPage: currentPage < totalPages,

      hasPreviousPage: currentPage > 1,
    },
  });
};

// ==========================================
// GET PUBLIC USER PROFILE
// ==========================================

const getPublicUserProfile = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError("Invalid user ID", 400);
  }

  const user = await User.findOne({
    _id: userId,
    role: { $in: ["jobseeker", "recruiter"] },
    status: "active",
    isVerified: true,
  }).select(PUBLIC_USER_SELECT);

  if (!user) {
    throw createError("Profile not found", 404);
  }

  return res.status(200).json({
    success: true,
    profile: user,
  });
};

// ==========================================
// GET PUBLIC USER PROFILE PICTURE
// ==========================================

const getPublicUserProfilePicture = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError("Invalid user ID", 400);
  }

  const user = await User.findOne({
    _id: userId,
    role: { $in: ["jobseeker", "recruiter"] },
    status: "active",
    isVerified: true,
  }).select("profilePicture");

  if (!user) {
    throw createError("User not found", 404);
  }

  if (
    !user.profilePicture ||
    !user.profilePicture.data ||
    !user.profilePicture.contentType
  ) {
    throw createError("Profile picture not found", 404);
  }

  const imageBuffer = Buffer.isBuffer(user.profilePicture.data)
    ? user.profilePicture.data
    : Buffer.from(user.profilePicture.data);

  res.set("Content-Type", user.profilePicture.contentType);
  res.set("Cache-Control", "public, max-age=3600");

  return res.send(imageBuffer);
};

module.exports = {
  getPublicUsers,
  getPublicUserProfile,
  getPublicUserProfilePicture,
};
