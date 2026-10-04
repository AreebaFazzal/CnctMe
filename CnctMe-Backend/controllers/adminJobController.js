const mongoose = require("mongoose");

const Job = require("../models/jobModel");
const createError = require("../utils/createError");

// ==========================================
// GET ALL JOBS
// ==========================================

const getAllJobs = async (req, res) => {
  const {
    search = "",
    status,
    jobType,
    workMode,
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
        title: {
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
      {
        location: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (status) {
    if (!["active", "closed"].includes(status)) {
      throw createError("Invalid job status", 400);
    }

    filter.status = status;
  }

  if (jobType) {
    if (
      !["full-time", "part-time", "contract", "internship"].includes(jobType)
    ) {
      throw createError("Invalid job type", 400);
    }

    filter.jobType = jobType;
  }

  if (workMode) {
    if (!["on-site", "remote", "hybrid"].includes(workMode)) {
      throw createError("Invalid work mode", 400);
    }

    filter.workMode = workMode;
  }

  const allowedSortFields = ["createdAt", "title", "salaryMin", "salaryMax"];

  if (!allowedSortFields.includes(sort)) {
    throw createError("Invalid sort field", 400);
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const [jobs, totalJobs] = await Promise.all([
    Job.find(filter)
      .populate("company", "companyName location website")
      .populate("createdBy", "firstName lastName email")
      .sort({
        [sort]: sortOrder,
      })
      .skip(skip)
      .limit(limitNumber),

    Job.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,

    jobs,

    pagination: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limitNumber),
    },
  });
};

// ==========================================
// GET SINGLE JOB
// ==========================================

const getJobById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid job ID", 400);
  }

  const job = await Job.findById(id)
    .populate("company", "companyName description website location")
    .populate("createdBy", "firstName lastName email");

  if (!job) {
    throw createError("Job not found", 404);
  }

  return res.status(200).json({
    success: true,
    job,
  });
};

// ==========================================
// REMOVE JOB
// ==========================================

const removeJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid job ID", 400);
  }

  const job = await Job.findById(id);

  if (!job) {
    throw createError("Job not found", 404);
  }

  job.status = "closed";

  await job.save();

  return res.status(200).json({
    success: true,
    message: "Job removed successfully",
  });
};

module.exports = {
  getAllJobs,
  getJobById,
  removeJob,
};
