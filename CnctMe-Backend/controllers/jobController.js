const jobModel = require("../models/jobModel");
const companyModel = require("../models/companyModel");
const createError = require("../utils/createError");
const getPagination = require("../utils/getPagination");
const applicationModel = require("../models/applicationModel");

// =========================
// CREATE JOB
// =========================

const createJob = async (req, res, next) => {
  const {
    title,
    description,
    location,
    salaryMin,
    salaryMax,
    category,
    experienceMin,
    experienceMax,
    jobType,
    workMode,
    skills,
  } = req.body;

  const company = await companyModel.findOne({
    createdBy: req.user.userId,
  });

  if (!company) {
    throw createError("You must create a company before posting a job", 404);
  }

  const job = await jobModel.create({
    title,
    description,
    location,
    salaryMin,
    salaryMax,
    category,
    experienceMin,
    experienceMax,
    jobType,
    workMode,
    skills,
    company: company._id,
    createdBy: req.user.userId,
  });

  return res.status(201).json({
    success: true,
    message: "Job has been created successfully",
    job,
  });
};

// =========================
// VIEW OWN JOBS
// =========================

const getMyJobs = async (req, res, next) => {
  const { page, limit, skip } = getPagination(req);

  const jobs = await jobModel
    .find({
      createdBy: req.user.userId,
    })
    .populate("company", "companyName logo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalJobs = await jobModel.countDocuments({
    createdBy: req.user.userId,
  });

  const jobsWithApplicants = await Promise.all(
    jobs.map(async (job) => {
      const applicantCount = await applicationModel.countDocuments({
        job: job._id,
      });

      return {
        ...job.toObject(),
        applicantCount,
      };
    }),
  );

  return res.status(200).json({
    success: true,
    message: "Your jobs",
    totalJobs,
    page,
    limit,
    totalPages: Math.ceil(totalJobs / limit),
    jobs: jobsWithApplicants,
  });
};

// =========================
// VIEW SINGLE JOB
// =========================

const getJob = async (req, res, next) => {
  const { id } = req.params;

  const job = await jobModel
    .findById(id)
    .populate(
      "company",
      "companyName description website location industry companySize logo",
    );

  if (!job) {
    throw createError("Job doesn't exist", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Job information",
    job,
  });
};

// =========================
// UPDATE OWN JOB
// =========================

const updateJob = async (req, res, next) => {
  const { id } = req.params;

  const {
    title,
    description,
    location,
    salaryMin,
    salaryMax,
    category,
    experienceMin,
    experienceMax,
    jobType,
    workMode,
    skills,
  } = req.body;

  const job = await jobModel.findOne({
    _id: id,
    createdBy: req.user.userId,
  });

  if (!job) {
    throw createError(
      "Job doesn't exist or you don't have permission to update it",
      404,
    );
  }

  job.title = title;
  job.description = description;
  job.location = location;
  job.salaryMin = salaryMin;
  job.salaryMax = salaryMax;
  job.category = category;
  job.experienceMin = experienceMin;
  job.experienceMax = experienceMax;
  job.jobType = jobType;
  job.workMode = workMode;
  job.skills = skills;

  const updatedJob = await job.save();

  return res.status(200).json({
    success: true,
    message: "Job has been updated successfully",
    job: updatedJob,
  });
};

// =========================
// CLOSE OWN JOB
// =========================

const closeJob = async (req, res, next) => {
  const { id } = req.params;

  const job = await jobModel.findOne({
    _id: id,
    createdBy: req.user.userId,
  });

  if (!job) {
    throw createError(
      "Job doesn't exist or you don't have permission to close it",
      404,
    );
  }

  if (job.status === "closed") {
    throw createError("This job is already closed", 400);
  }

  job.status = "closed";

  const updatedJob = await job.save();

  return res.status(200).json({
    success: true,
    message: "Job has been closed successfully",
    job: updatedJob,
  });
};

// =========================
// DELETE OWN JOB
// =========================

const deleteJob = async (req, res, next) => {
  const { id } = req.params;

  const deletedJob = await jobModel.findOneAndDelete({
    _id: id,
    createdBy: req.user.userId,
  });

  if (!deletedJob) {
    throw createError(
      "Job doesn't exist or you don't have permission to delete it",
      404,
    );
  }

  return res.status(200).json({
    success: true,
    message: "Job has been deleted successfully",
  });
};

// =========================
// GET ALL ACTIVE JOBS:
// SEARCH + FILTER + SORTING + PAGINATION
// =========================

const getAllJobs = async (req, res, next) => {
  const {
    search,
    location,
    jobType,
    workMode,
    category,
    experienceMin,
    experienceMax,
    salaryMin,
    salaryMax,
    sorting,
    company,
  } = req.query;

  const { page, limit, skip } = getPagination(req);

  const filter = {
    status: "active",
  };

  if (search && search.trim()) {
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
        skills: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (location && location.trim()) {
    filter.location = {
      $regex: location.trim(),
      $options: "i",
    };
  }

  if (jobType && jobType.trim()) {
    filter.jobType = jobType.trim();
  }

  if (workMode && workMode.trim()) {
    filter.workMode = workMode.trim();
  }

  if (category && category.trim()) {
    filter.category = {
      $regex: `^${category.trim()}$`,
      $options: "i",
    };
  }

  if (company && company.trim()) {
    filter.company = company.trim();
  }

  if (experienceMin !== undefined && experienceMin !== "") {
    filter.experienceMax = {
      $gte: Number(experienceMin),
    };
  }

  if (experienceMax !== undefined && experienceMax !== "") {
    filter.experienceMin = {
      $lte: Number(experienceMax),
    };
  }

  if (salaryMin !== undefined && salaryMin !== "") {
    filter.salaryMax = {
      $gte: Number(salaryMin),
    };
  }

  if (salaryMax !== undefined && salaryMax !== "") {
    filter.salaryMin = {
      $lte: Number(salaryMax),
    };
  }

  let sort = {
    createdAt: -1,
  };

  if (sorting === "oldest") {
    sort = {
      createdAt: 1,
    };
  }

  if (sorting === "salary-high") {
    sort = {
      salaryMax: -1,
    };
  }

  if (sorting === "salary-low") {
    sort = {
      salaryMin: 1,
    };
  }

  const allJobs = await jobModel
    .find(filter)
    .populate("company", "companyName logo")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalJobs = await jobModel.countDocuments(filter);

  return res.status(200).json({
    success: true,
    message: "All jobs have been sent successfully",
    totalJobs,
    page,
    limit,
    totalPages: Math.ceil(totalJobs / limit),
    allJobs,
  });
};

module.exports = {
  createJob,
  getMyJobs,
  getJob,
  updateJob,
  closeJob,
  deleteJob,
  getAllJobs,
};
