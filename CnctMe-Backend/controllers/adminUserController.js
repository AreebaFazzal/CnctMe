const mongoose = require("mongoose");

const User = require("../models/userModel");
const createError = require("../utils/createError");

// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res) => {
  const {
    search = "",
    role,
    status,
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};

  if (search.trim()) {
    filter.$or = [
      {
        firstName: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        email: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (role) {
    if (!["admin", "recruiter", "jobseeker"].includes(role)) {
      throw createError("Invalid role filter", 400);
    }

    filter.role = role;
  }

  if (status) {
    if (!["active", "blocked"].includes(status)) {
      throw createError("Invalid status filter", 400);
    }

    filter.status = status;
  }

  const allowedSortFields = ["createdAt", "firstName", "lastName", "email"];

  if (!allowedSortFields.includes(sort)) {
    throw createError("Invalid sort field", 400);
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .select(
        "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires -resume.data",
      )
      .sort({
        [sort]: sortOrder,
      })
      .skip(skip)
      .limit(limitNumber),

    User.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,

    users,

    pagination: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNumber),
    },
  });
};

// ==========================================
// GET SINGLE USER
// ==========================================

const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid user ID", 400);
  }

  const user = await User.findById(id).select(
    "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires -resume.data",
  );

  if (!user) {
    throw createError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    user,
  });
};

// ==========================================
// BLOCK USER
// ==========================================

const blockUser = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid user ID", 400);
  }

  if (id === adminId) {
    throw createError("Admin cannot block their own account", 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw createError("User not found", 404);
  }

  if (user.role === "admin") {
    throw createError("Admin accounts cannot be blocked", 403);
  }

  if (user.status === "blocked") {
    throw createError("User is already blocked", 400);
  }

  user.status = "blocked";

  await user.save();

  return res.status(200).json({
    success: true,
    message: "User blocked successfully",
  });
};

// ==========================================
// UNBLOCK USER
// ==========================================

const unblockUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid user ID", 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw createError("User not found", 404);
  }

  if (user.status === "active") {
    throw createError("User is already active", 400);
  }

  user.status = "active";

  await user.save();

  return res.status(200).json({
    success: true,
    message: "User unblocked successfully",
  });
};

// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid user ID", 400);
  }

  if (id === adminId) {
    throw createError("Admin cannot delete their own account", 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw createError("User not found", 404);
  }

  if (user.role === "admin") {
    throw createError("Admin accounts cannot be deleted", 403);
  }

  await User.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
};
