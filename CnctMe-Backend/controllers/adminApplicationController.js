const mongoose = require("mongoose");

const Application = require("../models/applicationModel");
const createError = require("../utils/createError");

// ==========================================
// GET ALL APPLICATIONS
// ==========================================

const getAllApplications = async (req, res) => {
  const {
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

  if (status) {
    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      throw createError("Invalid application status", 400);
    }

    filter.status = status;
  }

  if (!["createdAt", "updatedAt"].includes(sort)) {
    throw createError("Invalid sort field", 400);
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const [applications, totalApplications] = await Promise.all([
    Application.find(filter)
      .populate("user", "firstName lastName email phoneNumber profilePicture")
      .populate({
        path: "job",
        select:
          "title location salaryMin salaryMax category experienceMin experienceMax jobType workMode skills status createdBy company",
        populate: {
          path: "company",
          select:
            "companyName description logo website location industry companySize createdBy",
        },
      })
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limitNumber),

    Application.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    applications,
    pagination: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalApplications,
      totalPages: Math.ceil(totalApplications / limitNumber),
    },
  });
};

// ==========================================
// GET SINGLE APPLICATION
// ==========================================

const getApplicationById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid application ID", 400);
  }

  const application = await Application.findById(id)
    .populate({
      path: "user",
      select:
        "firstName lastName email phoneNumber position bio linkedin location skills education experience profilePicture",
    })
    .populate({
      path: "job",
      select:
        "title description location salaryMin salaryMax category experienceMin experienceMax jobType workMode skills status createdBy company",
      populate: {
        path: "company",
        select:
          "companyName description logo website location industry companySize createdBy",
      },
    });

  if (!application) {
    throw createError("Application not found", 404);
  }

  return res.status(200).json({
    success: true,
    application,
  });
};

// ==========================================
// GET ADMIN APPLICATION RESUME
// ==========================================

const getAdminApplicationResume = async (req, res) => {
  const applicationId = req.params.applicationId;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw createError("Invalid application ID", 400);
  }

  const application =
    await Application.findById(applicationId).select("resume");

  if (!application) {
    throw createError("Application not found", 404);
  }

  if (!application.resume?.data) {
    throw createError("Resume not found", 404);
  }

  res.set(
    "Content-Type",
    application.resume.contentType || "application/octet-stream",
  );

  if (application.resume.originalName) {
    res.set(
      "Content-Disposition",
      `inline; filename="${application.resume.originalName}"`,
    );
  }

  return res.send(application.resume.data);
};

module.exports = {
  getAllApplications,
  getApplicationById,
  getAdminApplicationResume,
};
