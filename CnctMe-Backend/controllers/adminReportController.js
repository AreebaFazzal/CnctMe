const mongoose = require("mongoose");

const Report = require("../models/reportModel");

const createError = require("../utils/createError");

// ==========================================
// GET ALL REPORTS
// ==========================================

const getAllReports = async (req, res) => {
  const {
    status,
    search = "",
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};

  if (status) {
    if (!["pending", "reviewed", "resolved", "rejected"].includes(status)) {
      throw createError("Invalid report status", 400);
    }

    filter.status = status;
  }

  if (search.trim()) {
    filter.$or = [
      {
        reason: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        description: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (!["createdAt", "updatedAt"].includes(sort)) {
    throw createError("Invalid sort field", 400);
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const [reports, totalReports] = await Promise.all([
    Report.find(filter)
      .populate(
        "reporter",
        "firstName lastName email role profilePicture.contentType",
      )
      .populate(
        "reportedUser",
        "firstName lastName email role status profilePicture.contentType",
      )
      .populate("job", "title location status")
      .populate("company", "companyName location website")
      .sort({
        [sort]: sortOrder,
      })
      .skip(skip)
      .limit(limitNumber),

    Report.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,

    reports,

    pagination: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalReports,
      totalPages: Math.ceil(totalReports / limitNumber),
    },
  });
};

// ==========================================
// GET SINGLE REPORT
// ==========================================

const getReportById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid report ID", 400);
  }

  const report = await Report.findById(id)
    .populate(
      "reporter",
      "firstName lastName email role profilePicture.contentType",
    )
    .populate(
      "reportedUser",
      "firstName lastName email role status profilePicture.contentType",
    )
    .populate("job", "title description location status createdBy company")
    .populate("company", "companyName description website location");

  if (!report) {
    throw createError("Report not found", 404);
  }

  return res.status(200).json({
    success: true,
    report,
  });
};

// ==========================================
// UPDATE REPORT STATUS
// ==========================================

const updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid report ID", 400);
  }

  const allowedStatuses = ["pending", "reviewed", "resolved", "rejected"];

  if (!allowedStatuses.includes(status)) {
    throw createError("Invalid report status", 400);
  }

  const report = await Report.findById(id);

  if (!report) {
    throw createError("Report not found", 404);
  }

  report.status = status;

  await report.save();

  return res.status(200).json({
    success: true,
    message: "Report status updated successfully",
    report,
  });
};

module.exports = {
  getAllReports,
  getReportById,
  updateReportStatus,
};
