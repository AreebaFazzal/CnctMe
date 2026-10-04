const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");

const createError = require("../utils/createError");

const {
  sendApplicationReceivedEmail,
  sendApplicationShortlistedEmail,
  sendApplicationRejectedEmail,
  sendCandidateSelectedEmail,
} = require("../services/emailService");

const { createNotification } = require("../services/notificationService");

// ======================================================
// APPLY FOR JOB
// ======================================================

const applyForJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.jobId;

  const { coverLetter } = req.body;

  if (!req.file) {
    throw createError("Resume is required", 400);
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw createError("Job not found", 404);
  }

  if (job.status !== "active") {
    throw createError("This job is no longer accepting applications", 400);
  }

  if (job.createdBy.toString() === userId) {
    throw createError("You cannot apply to your own job", 400);
  }

  const candidate = await User.findById(userId);

  if (!candidate) {
    throw createError("Candidate not found", 404);
  }

  const recruiter = await User.findById(job.createdBy);

  if (!recruiter) {
    throw createError("Recruiter not found", 404);
  }

  const existingApplication = await Application.findOne({
    user: userId,
    job: jobId,
  });

  if (existingApplication) {
    throw createError("You have already applied for this job", 409);
  }

  const application = await Application.create({
    user: userId,
    job: jobId,

    resume: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      originalName: req.file.originalname,
    },

    coverLetter,

    status: "Applied",
  });

  // ======================================================
  // EMAIL NOTIFICATION
  // ======================================================

  if (recruiter.settings?.emailNotifications !== false) {
    await sendApplicationReceivedEmail({
      recruiterEmail: recruiter.email,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      jobTitle: job.title,
    });
  }

  // ======================================================
  // IN-APP APPLICATION NOTIFICATION
  // ======================================================

  if (recruiter.settings?.applicationNotifications !== false) {
    await createNotification({
      recipient: recruiter._id,
      type: "APPLICATION_RECEIVED",
      title: "New Application Received",
      message: `${candidate.firstName} ${candidate.lastName} applied for your job "${job.title}".`,
      relatedJob: job._id,
      relatedApplication: application._id,
    });
  }

  return res.status(201).json({
    success: true,
    message: "Job application submitted successfully",

    application: {
      id: application._id,
      job: application.job,
      user: application.user,
      status: application.status,
      appliedAt: application.createdAt,
    },
  });
};

// ======================================================
// GET MY APPLICATIONS
// ======================================================
const getMyApplications = async (req, res) => {
  const userId = req.user.userId;

  const page = Math.max(Number(req.query.page) || 1, 1);

  const limit = Math.min(Number(req.query.limit) || 10, 100);

  const skip = (page - 1) * limit;

  const total = await Application.countDocuments({
    user: userId,
  });

  const applications = await Application.find({
    user: userId,
  })
    .populate({
      path: "job",
      select:
        "title location salaryMin salaryMax jobType workMode status company",
      populate: {
        path: "company",
        select: "companyName logo",
      },
    })
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,

    applications,

    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalApplications: total,
      limit,
    },
  });
};
// ======================================================
// GET SINGLE APPLICATION
// ======================================================

const getMyApplicationDetails = async (req, res) => {
  const userId = req.user.userId;

  const applicationId = req.params.id || req.params.applicationId;

  if (!applicationId) {
    throw createError("Application ID is required", 400);
  }

  const application = await Application.findOne({
    _id: applicationId,
    user: userId,
  }).populate({
    path: "job",
    select:
      "title description location salaryMin salaryMax category jobType workMode skills status company createdBy",
    populate: {
      path: "company",
      select: "companyName description website location",
    },
  });

  if (!application) {
    throw createError("Application not found", 404);
  }

  return res.status(200).json({
    success: true,

    application: {
      id: application._id,

      job: application.job,

      resume: {
        originalName: application.resume.originalName,
        contentType: application.resume.contentType,
      },

      coverLetter: application.coverLetter,

      status: application.status,

      appliedAt: application.createdAt,

      updatedAt: application.updatedAt,
    },
  });
};

// ======================================================
// WITHDRAW / CANCEL APPLICATION
// ======================================================

const cancelApplication = async (req, res) => {
  const userId = req.user.userId;

  const applicationId = req.params.id || req.params.applicationId;

  if (!applicationId) {
    throw createError("Application ID is required", 400);
  }

  const application = await Application.findOne({
    _id: applicationId,
    user: userId,
  });

  if (!application) {
    throw createError("Application not found", 404);
  }

  const allowedStatuses = ["Applied", "Under Review"];

  if (!allowedStatuses.includes(application.status)) {
    throw createError(
      "You cannot withdraw this application after it has been processed",
      400,
    );
  }

  await Application.findByIdAndDelete(applicationId);

  return res.status(200).json({
    success: true,
    message: "Application withdrawn successfully",
  });
};

// ======================================================
// RECRUITER: GET ALL APPLICANTS FOR A JOB
// ======================================================

const getJobApplicants = async (req, res) => {
  const recruiterId = req.user.userId;
  const jobId = req.params.jobId;

  const job = await Job.findById(jobId);

  if (!job) {
    throw createError("Job not found", 404);
  }

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw createError("You are not authorized to view these applications", 403);
  }

  const applications = await Application.find({
    job: jobId,
  })
    .populate({
      path: "user",
      select:
        "firstName lastName email phoneNumber profilePicture position bio location skills education experience linkedin github role status",
    })
    .populate({
      path: "job",
      select: "title location company",
      populate: {
        path: "company",
        select: "companyName",
      },
    })
    .sort({
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,
    applications,
  });
};

// ======================================================
// RECRUITER: GET APPLICANT DETAILS
// ======================================================

const getApplicantDetails = async (req, res) => {
  const recruiterId = req.user.userId;

  const applicationId = req.params.id || req.params.applicationId;

  if (!applicationId) {
    throw createError("Application ID is required", 400);
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    throw createError("Application not found", 404);
  }


  const job = await Job.findById(application.job);

  if (!job) {
    throw createError("Job not found", 404);
  }


  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw createError("You are not authorized to view this application", 403);
  }

  const populatedApplication = await Application.findById(applicationId)
    .populate({
      path: "user",
      select:
        "firstName lastName email phoneNumber profilePicture position bio location skills education experience linkedin github role status",
    })
    .populate({
      path: "job",
      select:
        "title description location salaryMin salaryMax category jobType workMode skills status company createdBy",
      populate: {
        path: "company",
        select: "companyName description website location industry companySize",
      },
    });

  if (!populatedApplication) {
    throw createError("Application not found", 404);
  }


  if (!populatedApplication.user) {
    throw createError(
      "Candidate information is not available for this application",
      404,
    );
  }

  const candidate = populatedApplication.user;

  return res.status(200).json({
    success: true,

    application: {
      _id: populatedApplication._id,

      status: populatedApplication.status,

      coverLetter: populatedApplication.coverLetter,

      createdAt: populatedApplication.createdAt,

      updatedAt: populatedApplication.updatedAt,

      resume: populatedApplication.resume
        ? {
            originalName: populatedApplication.resume.originalName,

            contentType: populatedApplication.resume.contentType,
          }
        : null,


      user: {
        _id: candidate._id,

        firstName: candidate.firstName,

        lastName: candidate.lastName,

        email: candidate.email,

        phoneNumber: candidate.phoneNumber || "",

        profilePicture: candidate.profilePicture || null,

        position: candidate.position || "",

        bio: candidate.bio || "",

        location: candidate.location || "",

        skills: candidate.skills || [],

        education: candidate.education || [],

        experience: candidate.experience || [],

        linkedin: candidate.linkedin || "",

        github: candidate.github || "",

        role: candidate.role,

        status: candidate.status,
      },


      job: populatedApplication.job,
    },
  });
};

// ======================================================
// RECRUITER UPDATES APPLICATION STATUS
// ======================================================

const updateApplicationStatus = async (req, res) => {
  const recruiterId = req.user.userId;

  const applicationId = req.params.applicationId || req.params.id;

  const { status } = req.body;

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

  if (!applicationId) {
    throw createError("Application ID is required", 400);
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    throw createError("Application not found", 404);
  }

  const job = await Job.findById(application.job);

  if (!job) {
    throw createError("Job not found", 404);
  }

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw createError("You are not authorized to update this application", 403);
  }

  const oldStatus = application.status;

  application.status = status;

  await application.save();

  const candidate = await User.findById(application.user);

  if (!candidate) {
    throw createError("Candidate not found", 404);
  }

  // ======================================================
  // SHORTLISTED
  // ======================================================

  if (status === "Shortlisted" && oldStatus !== status) {
    if (candidate.settings?.emailNotifications !== false) {
      await sendApplicationShortlistedEmail({
        candidateEmail: candidate.email,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        jobTitle: job.title,
      });
    }

    if (candidate.settings?.applicationNotifications !== false) {
      await createNotification({
        recipient: candidate._id,
        type: "APPLICATION_SHORTLISTED",
        title: "Application Shortlisted",
        message: `Your application for "${job.title}" has been shortlisted.`,
        relatedJob: job._id,
        relatedApplication: application._id,
      });
    }
  }

  // ======================================================
  // REJECTED
  // ======================================================

  if (status === "Rejected" && oldStatus !== status) {
    if (candidate.settings?.emailNotifications !== false) {
      await sendApplicationRejectedEmail({
        candidateEmail: candidate.email,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        jobTitle: job.title,
      });
    }

    if (candidate.settings?.applicationNotifications !== false) {
      await createNotification({
        recipient: candidate._id,
        type: "APPLICATION_REJECTED",
        title: "Application Update",
        message: `Your application for "${job.title}" was not selected for the next stage.`,
        relatedJob: job._id,
        relatedApplication: application._id,
      });
    }
  }

  // ======================================================
  // SELECTED
  // ======================================================

  if (status === "Selected" && oldStatus !== status) {
    if (candidate.settings?.emailNotifications !== false) {
      await sendCandidateSelectedEmail({
        candidateEmail: candidate.email,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        jobTitle: job.title,
      });
    }

    if (candidate.settings?.applicationNotifications !== false) {
      await createNotification({
        recipient: candidate._id,
        type: "CANDIDATE_SELECTED",
        title: "Congratulations!",
        message: `Congratulations! You have been selected for "${job.title}".`,
        relatedJob: job._id,
        relatedApplication: application._id,
      });
    }
  }

  return res.status(200).json({
    success: true,

    message: "Application status updated successfully",

    application: {
      id: application._id,
      status: application.status,
      updatedAt: application.updatedAt,
    },
  });
};

// ======================================================
// RECRUITER: VIEW / DOWNLOAD APPLICANT RESUME
// ======================================================

const getApplicantResume = async (req, res) => {
  const recruiterId = req.user.userId;

  const applicationId = req.params.id || req.params.applicationId;

  if (!applicationId) {
    throw createError("Application ID is required", 400);
  }

  const application =
    await Application.findById(applicationId).select("resume job");

  if (!application) {
    throw createError("Application not found", 404);
  }

  const job = await Job.findById(application.job).select("createdBy");

  if (!job) {
    throw createError("Job not found", 404);
  }

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw createError("You are not authorized to view this resume", 403);
  }

  if (!application.resume?.data) {
    throw createError("Resume not found", 404);
  }

  res.set({
    "Content-Type": application.resume.contentType,

    "Content-Disposition": `inline; filename="${application.resume.originalName}"`,
  });

  return res.send(application.resume.data);
};


module.exports = {
  applyForJob,
  getMyApplications,
  getMyApplicationDetails,
  cancelApplication,
  getJobApplicants,
  getApplicantDetails,
  updateApplicationStatus,
  getApplicantResume,
};
