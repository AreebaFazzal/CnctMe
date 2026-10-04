const mongoose = require("mongoose");
const User = require("../models/userModel");
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");
const Interview = require("../models/interviewModel");
const createError = require("../utils/createError");

// =========================================================
// GET RECRUITER PROFILE
// =========================================================
const getRecruiterProfile = async (req, res) => {
  const recruiterId = req.user.userId;

  const recruiter = await User.findById(recruiterId).select(
    "firstName lastName email phoneNumber profilePicture position bio linkedin role verified",
  );

  if (!recruiter) {
    throw createError("Recruiter not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Recruiter profile retrieved successfully",
    recruiter,
  });
};

// =========================================================
// UPDATE RECRUITER PROFILE
// =========================================================
const updateRecruiterProfile = async (req, res) => {
  const recruiterId = req.user.userId;

  const recruiter = await User.findById(recruiterId);

  if (!recruiter) {
    throw createError("Recruiter not found", 404);
  }

  const { firstName, lastName, phoneNumber, position, bio, linkedin } =
    req.body;

  if (firstName !== undefined) recruiter.firstName = firstName;
  if (lastName !== undefined) recruiter.lastName = lastName;
  if (phoneNumber !== undefined) recruiter.phoneNumber = phoneNumber;
  if (position !== undefined) recruiter.position = position;
  if (bio !== undefined) recruiter.bio = bio;
  if (linkedin !== undefined) recruiter.linkedin = linkedin;

  if (req.file) {
    recruiter.profilePicture = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
  }

  await recruiter.save();

  return res.status(200).json({
    success: true,
    message: "Recruiter profile updated successfully",
    recruiter: {
      _id: recruiter._id,
      firstName: recruiter.firstName,
      lastName: recruiter.lastName,
      email: recruiter.email,
      phoneNumber: recruiter.phoneNumber,
      profilePicture: recruiter.profilePicture,
      position: recruiter.position,
      bio: recruiter.bio,
      linkedin: recruiter.linkedin,
      role: recruiter.role,
      verified: recruiter.verified,
    },
  });
};

// =========================================================
// GET RECRUITER PROFILE PICTURE
// =========================================================
const getRecruiterProfilePicture = async (req, res) => {
  const recruiterId = req.user.userId;

  const recruiter = await User.findById(recruiterId).select("profilePicture");

  if (!recruiter) {
    throw createError("Recruiter not found", 404);
  }

  if (!recruiter.profilePicture?.data) {
    throw createError("Profile picture not found", 404);
  }

  res.set("Content-Type", recruiter.profilePicture.contentType || "image/jpeg");

  return res.send(recruiter.profilePicture.data);
};

// =========================================================
// GET RECRUITER DASHBOARD
// =========================================================
const getRecruiterDashboard = async (req, res) => {
  const recruiterId = req.user.userId;

  const jobs = await Job.find({
    createdBy: recruiterId,
  }).select("_id status");

  const jobIds = jobs.map((job) => job._id);

  const [
    totalApplicants,
    shortlistedApplicants,
    interviews,
    selectedCandidates,
  ] = await Promise.all([
    Application.countDocuments({
      job: { $in: jobIds },
    }),

    Application.countDocuments({
      job: { $in: jobIds },
      status: "Shortlisted",
    }),

    Interview.countDocuments({
      recruiter: recruiterId,
    }),

    Application.countDocuments({
      job: { $in: jobIds },
      status: "Selected",
    }),
  ]);

  const totalJobs = jobs.length;

  const activeJobs = jobs.filter((job) => job.status === "active").length;

  const closedJobs = jobs.filter((job) => job.status === "closed").length;

  return res.status(200).json({
    success: true,
    dashboard: {
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplicants,
      shortlistedApplicants,
      interviews,
      selectedCandidates,
    },
  });
};

// =========================================================
// GET APPLICANT DETAILS
// =========================================================
const getApplicantDetails = async (req, res) => {
  const recruiterId = req.user.userId;
  const applicationId = req.params.applicationId;

  const application = await Application.findById(applicationId)
    .populate({
      path: "user",
      select:
        "firstName lastName email phoneNumber profilePicture position bio linkedin",
    })
    .populate({
      path: "job",
      select:
        "_id title description company location salaryMin salaryMax category experienceMin experienceMax jobType workMode skills createdBy",
      populate: {
        path: "company",
        select: "companyName logo",
      },
    });

  if (!application) {
    throw createError("Application not found", 404);
  }

  if (!application.job) {
    throw createError(
      "Job associated with this application was not found",
      404,
    );
  }

  if (application.job.createdBy.toString() !== recruiterId.toString()) {
    throw createError("You are not authorized to access this application", 403);
  }

  return res.status(200).json({
    success: true,
    message: "Applicant details retrieved successfully",
    application,
  });
};

// =========================================================
// GET CANDIDATE PROFILE (recruiter view)
// =========================================================
const getCandidateProfile = async (req, res) => {
  const recruiterId = req.user.userId;
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw createError("Invalid user id", 400);
  }

  const jobs = await Job.find({ createdBy: recruiterId }).select("_id");
  const jobIds = jobs.map((job) => job._id);

  const hasApplied = await Application.exists({
    user: userId,
    job: { $in: jobIds },
  });

  if (!hasApplied) {
    throw createError(
      "You are not authorized to view this candidate profile",
      403,
    );
  }

  const user = await User.findById(userId).select("-password").lean();

  if (!user) {
    throw createError("Candidate not found", 404);
  }

  const profile = {
    ...user,
    phone: user.phoneNumber,
  };

  return res.status(200).json({
    success: true,
    message: "Candidate profile retrieved successfully",
    profile,
  });
};

// =========================================================
// GET APPLICATION RESUME
// =========================================================
const getApplicationResume = async (req, res) => {
  const recruiterId = req.user.userId;
  const applicationId = req.params.applicationId;

  const application = await Application.findById(applicationId)
    .populate({
      path: "job",
      select: "createdBy",
    })
    .select("resume job");

  if (!application) {
    throw createError("Application not found", 404);
  }

  if (!application.job) {
    throw createError("Job not found", 404);
  }

  if (application.job.createdBy.toString() !== recruiterId.toString()) {
    throw createError("You are not authorized to access this resume", 403);
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

// =========================================================
// GET RECENT JOBS
// =========================================================

const getRecentJobs = async (req, res) => {
  const recruiterId = req.user.userId;

  const jobs = await Job.find({
    createdBy: recruiterId,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: "company",
      select: "companyName logo",
    })
    .lean();

  const jobIds = jobs.map((job) => job._id);

  const applicantCounts = await Application.aggregate([
    {
      $match: {
        job: { $in: jobIds },
      },
    },
    {
      $group: {
        _id: "$job",
        applicantCount: {
          $sum: 1,
        },
      },
    },
  ]);

  const applicantCountMap = new Map(
    applicantCounts.map((item) => [item._id.toString(), item.applicantCount]),
  );

  const jobsWithApplicantCount = jobs.map((job) => ({
    ...job,
    applicantCount: applicantCountMap.get(job._id.toString()) || 0,
  }));

  return res.status(200).json({
    success: true,
    jobs: jobsWithApplicantCount,
  });
};

// =========================================================
// GET RECENT APPLICANTS
// =========================================================
const getRecentApplicants = async (req, res) => {
  const recruiterId = req.user.userId;

  const jobs = await Job.find({
    createdBy: recruiterId,
  }).select("_id");

  const jobIds = jobs.map((job) => job._id);

  const applications = await Application.find({
    job: { $in: jobIds },
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: "user",
      select: "firstName lastName email profilePicture",
    })
    .populate({
      path: "job",
      select: "title company",
      populate: {
        path: "company",
        select: "companyName logo",
      },
    });

  return res.status(200).json({
    success: true,
    applicants: applications,
  });
};

// =========================================================
// GET UPCOMING INTERVIEWS
// =========================================================
const getUpcomingInterviews = async (req, res) => {
  const recruiterId = req.user.userId;

  const interviews = await Interview.find({
    recruiter: recruiterId,
    status: "Scheduled",
  })
    .sort({ date: 1, time: 1 })
    .limit(10)
    .populate({
      path: "candidate",
      select: "firstName lastName email profilePicture",
    })
    .populate({
      path: "application",
      populate: {
        path: "job",
        select: "title company",
        populate: {
          path: "company",
          select: "companyName logo",
        },
      },
    });

  return res.status(200).json({
    success: true,
    interviews,
  });
};

// =========================================================
// GET RECRUITER ANALYTICS
// =========================================================

const getRecruiterAnalytics = async (req, res) => {
  const recruiterId = req.user.userId;

  const jobs = await Job.find({
    createdBy: recruiterId,
  }).select("_id title");

  const jobIds = jobs.map((job) => job._id);

  const applicationStatus = await Application.aggregate([
    {
      $match: {
        job: {
          $in: jobIds,
        },
      },
    },
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);

  const sixMonthsAgo = new Date();

  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const applicationsTrend = await Application.aggregate([
    {
      $match: {
        job: {
          $in: jobIds,
        },
        createdAt: {
          $gte: sixMonthsAgo,
        },
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        applications: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            {
              $arrayElemAt: [
                [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                "$_id.month",
              ],
            },
            " ",
            {
              $toString: "$_id.year",
            },
          ],
        },
        applications: 1,
      },
    },
  ]);

  const jobPerformance = await Application.aggregate([
    {
      $match: {
        job: {
          $in: jobIds,
        },
      },
    },
    {
      $group: {
        _id: "$job",
        applicants: {
          $sum: 1,
        },
      },
    },
  ]);

  const jobPerformanceMap = new Map(
    jobPerformance.map((item) => [item._id.toString(), item.applicants]),
  );

  const jobPerformanceData = jobs.map((job) => ({
    title: job.title,
    applicants: jobPerformanceMap.get(job._id.toString()) || 0,
  }));

  const totalApplications = await Application.countDocuments({
    job: {
      $in: jobIds,
    },
  });

  return res.status(200).json({
    success: true,

    analytics: {
      totalApplications,

      applicationsTrend,

      applicationStatus,

      jobPerformance: jobPerformanceData,
    },
  });
};

module.exports = {
  getRecruiterProfile,
  updateRecruiterProfile,
  getRecruiterProfilePicture,
  getRecruiterDashboard,
  getApplicantDetails,
  getCandidateProfile,
  getApplicationResume,
  getRecentJobs,
  getRecentApplicants,
  getUpcomingInterviews,
  getRecruiterAnalytics,
};
