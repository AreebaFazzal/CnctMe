const SavedJob = require("../models/savedJobsModel");
const Job = require("../models/jobModel");
const createError = require("../utils/createError");
const getPagination = require("../utils/getPagination");

// =========================
// SAVE JOB
// =========================

const saveJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.userId;

  const job = await Job.findOne({
    _id: jobId,
    status: "active",
  });

  if (!job) {
    throw createError("Job not found or is no longer active", 404);
  }

  const existingSavedJob = await SavedJob.findOne({
    user: userId,
    job: jobId,
  });

  if (existingSavedJob) {
    throw createError("Job is already saved", 409);
  }

  const savedJob = await SavedJob.create({
    user: userId,
    job: jobId,
  });

  return res.status(201).json({
    success: true,
    message: "Job saved successfully",
    savedJob,
  });
};

// =========================
// UNSAVE JOB
// =========================

const unsaveJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.userId;

  const deletedSavedJob = await SavedJob.findOneAndDelete({
    user: userId,
    job: jobId,
  });

  if (!deletedSavedJob) {
    throw createError("Saved job not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Job removed from saved jobs",
  });
};

// =========================
// GET SAVED JOBS
// =========================

const getSavedJobs = async (req, res) => {
  const userId = req.user.userId;

  const { page, limit, skip } = getPagination(req);

  const savedJobs = await SavedJob.find({
    user: userId,
  })
    .populate({
      path: "job",
      populate: {
        path: "company",
        select: "companyName logo",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalSavedJobs = await SavedJob.countDocuments({
    user: userId,
  });

  return res.status(200).json({
    success: true,
    message: "Saved jobs retrieved successfully",
    totalSavedJobs,
    page,
    limit,
    totalPages: Math.ceil(totalSavedJobs / limit),
    savedJobs,
  });
};

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
};
