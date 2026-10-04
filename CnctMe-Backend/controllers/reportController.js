const mongoose = require("mongoose");

const Report = require("../models/reportModel");
const User = require("../models/userModel");
const Job = require("../models/jobModel");
const Company = require("../models/companyModel");

const createError = require("../utils/createError");

const { createNotification } = require("../services/notificationService");

// ==========================================
// CREATE REPORT
// ==========================================

const createReport = async (req, res) => {
  const reporterId = req.user.userId;
  const reporterRole = req.user.role;

  const { reportedUser, job, company, reason, description } = req.body;

  if (!reportedUser && !job && !company) {
    throw createError("You must report a user, job, or company", 400);
  }

  const targetCount = [reportedUser, job, company].filter(Boolean).length;

  if (targetCount > 1) {
    throw createError(
      "You can only report one user, job, or company at a time",
      400,
    );
  }

  if (reporterRole === "recruiter" && job) {
    throw createError("Recruiters can only report users or companies", 403);
  }

  if (reportedUser && reporterId.toString() === reportedUser.toString()) {
    throw createError("You cannot report yourself", 400);
  }

  if (reportedUser) {
    if (!mongoose.Types.ObjectId.isValid(reportedUser)) {
      throw createError("Invalid reported user ID", 400);
    }

    const user = await User.findById(reportedUser);

    if (!user) {
      throw createError("Reported user not found", 404);
    }
  }

  if (job) {
    if (!mongoose.Types.ObjectId.isValid(job)) {
      throw createError("Invalid job ID", 400);
    }

    const existingJob = await Job.findById(job);

    if (!existingJob) {
      throw createError("Job not found", 404);
    }
  }

  if (company) {
    if (!mongoose.Types.ObjectId.isValid(company)) {
      throw createError("Invalid company ID", 400);
    }

    const existingCompany = await Company.findById(company);

    if (!existingCompany) {
      throw createError("Company not found", 404);
    }

    if (
      reporterRole === "recruiter" &&
      existingCompany.createdBy &&
      existingCompany.createdBy.toString() === reporterId.toString()
    ) {
      throw createError("You cannot report your own company", 400);
    }
  }

  const duplicateConditions = [];

  if (reportedUser) {
    duplicateConditions.push({
      reporter: reporterId,
      reportedUser,
    });
  }

  if (job) {
    duplicateConditions.push({
      reporter: reporterId,
      job,
    });
  }

  if (company) {
    duplicateConditions.push({
      reporter: reporterId,
      company,
    });
  }

  if (duplicateConditions.length > 0) {
    const existingReport = await Report.findOne({
      $or: duplicateConditions,
    });

    if (existingReport) {
      throw createError(
        "You have already reported this. Our admin team will review your existing report.",
        409,
      );
    }
  }

  let report;

  try {
    report = await Report.create({
      reporter: reporterId,
      reportedUser: reportedUser || null,
      job: job || null,
      company: company || null,
      reason,
      description,
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw createError(
        "You have already reported this. Our admin team will review your existing report.",
        409,
      );
    }

    throw error;
  }

  const admins = await User.find({
    role: "admin",
  }).select("_id");

  for (const admin of admins) {
    await createNotification({
      recipient: admin._id,
      type: "REPORT_CREATED",
      title: "New Report Submitted",
      message: `A new report has been submitted: ${reason}`,
      relatedJob: job || null,
    });
  }

  return res.status(201).json({
    success: true,
    message: "Report submitted successfully",
    report,
  });
};

// ==========================================
// GET MY REPORTS
// ==========================================

const getMyReports = async (req, res) => {
  const reporterId = req.user.userId;

  const reports = await Report.find({ reporter: reporterId })
    .populate("reportedUser", "firstName lastName email profilePicture")
    .populate("job", "title location")
    .populate("company", "companyName logo")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    reports,
  });
};

module.exports = {
  createReport,
  getMyReports,
};
