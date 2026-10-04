const mongoose = require("mongoose");

const Interview = require("../models/interviewModel");
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");

const createError = require("../utils/createError");
const asyncHandler = require("../utils/asyncHandler");

const {
  sendInterviewScheduledEmail,
  sendInterviewUpdatedEmail,
  sendInterviewCancelledEmail,
} = require("../services/emailService");

const { createNotification } = require("../services/notificationService");

// ======================================================
// HELPER: GET POPULATED INTERVIEW
// ======================================================

const getPopulatedInterview = async (interviewId) => {
  return Interview.findById(interviewId)
    .populate(
      "candidate",
      "firstName lastName email phoneNumber profilePicture",
    )
    .populate({
      path: "application",
      select: "status coverLetter createdAt user job",
      populate: {
        path: "job",
        select: "title location jobType workMode category salaryMin salaryMax",
      },
    })
    .populate("recruiter", "firstName lastName email");
};

// ======================================================
// SCHEDULE INTERVIEW
// POST /api/interviews/applications/:applicationId
// ======================================================

const scheduleInterview = asyncHandler(async (req, res) => {
  const recruiterId = req.user.userId;
  const applicationId = req.params.applicationId;

  const { date, time, meetingLink } = req.body;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw createError("Invalid application ID", 400);
  }

  if (!date || !time || !meetingLink) {
    throw createError("Date, time and meeting link are required", 400);
  }

  const interviewDate = new Date(date);

  if (Number.isNaN(interviewDate.getTime())) {
    throw createError("Invalid interview date", 400);
  }

  if (interviewDate <= new Date()) {
    throw createError("Interview date must be in the future", 400);
  }

  const trimmedTime = String(time).trim();
  const trimmedMeetingLink = String(meetingLink).trim();

  if (!trimmedTime) {
    throw createError("Interview time is required", 400);
  }

  if (!trimmedMeetingLink) {
    throw createError("Meeting link is required", 400);
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
    throw createError("You are not authorized to schedule this interview", 403);
  }

  if (application.status !== "Shortlisted") {
    throw createError(
      "Interview can only be scheduled for shortlisted candidates",
      400,
    );
  }

  const existingInterview = await Interview.findOne({
    application: applicationId,
  });

  if (existingInterview) {
    throw createError("Interview already exists for this application", 400);
  }

  const conflictingInterview = await Interview.findOne({
    recruiter: recruiterId,
    date: interviewDate,
    time: trimmedTime,
    status: "Scheduled",
  });

  if (conflictingInterview) {
    throw createError(
      "You already have an interview scheduled at this time",
      400,
    );
  }

  const candidate = await User.findById(application.user);

  if (!candidate) {
    throw createError("Candidate not found", 404);
  }

  const interview = await Interview.create({
    application: applicationId,
    recruiter: recruiterId,
    candidate: application.user,
    date: interviewDate,
    time: trimmedTime,
    meetingLink: trimmedMeetingLink,
    status: "Scheduled",
  });

  application.status = "Interview";

  await application.save();

  const candidateName =
    `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
    "Candidate";

  // ======================================================
  // EMAIL NOTIFICATION
  // ======================================================

  if (candidate.settings?.emailNotifications !== false) {
    await sendInterviewScheduledEmail({
      candidateEmail: candidate.email,
      candidateName,
      jobTitle: job.title,
      date: interviewDate,
      time: trimmedTime,
      meetingLink: trimmedMeetingLink,
    });
  }

  // ======================================================
  // IN-APP INTERVIEW NOTIFICATION
  // ======================================================

  if (candidate.settings?.interviewNotifications !== false) {
    await createNotification({
      recipient: candidate._id,
      type: "INTERVIEW_SCHEDULED",
      title: "Interview Scheduled",
      message: `Your interview for "${job.title}" has been scheduled for ${interviewDate.toLocaleDateString()} at ${trimmedTime}.`,
      relatedJob: job._id,
      relatedApplication: application._id,
      relatedInterview: interview._id,
    });
  }

  const populatedInterview = await getPopulatedInterview(interview._id);

  return res.status(201).json({
    success: true,
    message: "Interview scheduled successfully",
    interview: populatedInterview,
  });
});

// ======================================================
// GET ALL RECRUITER INTERVIEWS
// GET /api/interviews
// ======================================================

const getAllInterviews = asyncHandler(async (req, res) => {
  const recruiterId = req.user.userId;

  const interviews = await Interview.find({
    recruiter: recruiterId,
  })
    .populate(
      "candidate",
      "firstName lastName email phoneNumber profilePicture",
    )
    .populate({
      path: "application",
      select: "status coverLetter createdAt user job",
      populate: {
        path: "job",
        select: "title location jobType workMode category salaryMin salaryMax",
      },
    })
    .populate("recruiter", "firstName lastName email")
    .sort({
      date: 1,
      time: 1,
    });

  return res.status(200).json({
    success: true,
    count: interviews.length,
    interviews,
  });
});

// ======================================================
// GET SINGLE INTERVIEW
// GET /api/interviews/:interviewId
// ======================================================

const getInterview = asyncHandler(async (req, res) => {
  const recruiterId = req.user.userId;
  const interviewId = req.params.interviewId;

  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
    throw createError("Invalid interview ID", 400);
  }

  const interview = await Interview.findOne({
    _id: interviewId,
    recruiter: recruiterId,
  })
    .populate(
      "candidate",
      "firstName lastName email phoneNumber profilePicture",
    )
    .populate({
      path: "application",
      select: "status coverLetter createdAt user job",
      populate: {
        path: "job",
        select: "title location jobType workMode category salaryMin salaryMax",
      },
    })
    .populate("recruiter", "firstName lastName email");

  if (!interview) {
    throw createError("Interview not found", 404);
  }

  return res.status(200).json({
    success: true,
    interview,
  });
});

// ======================================================
// UPDATE INTERVIEW
// PUT /api/interviews/:interviewId
// ======================================================

const updateInterview = asyncHandler(async (req, res) => {
  const recruiterId = req.user.userId;
  const interviewId = req.params.interviewId;

  const { date, time, meetingLink } = req.body;

  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
    throw createError("Invalid interview ID", 400);
  }

  const interview = await Interview.findOne({
    _id: interviewId,
    recruiter: recruiterId,
  });

  if (!interview) {
    throw createError("Interview not found", 404);
  }

  if (interview.status === "Cancelled") {
    throw createError("Cancelled interview cannot be updated", 400);
  }

  if (interview.status === "Completed") {
    throw createError("Completed interview cannot be updated", 400);
  }

  if (date === undefined && time === undefined && meetingLink === undefined) {
    throw createError(
      "At least one interview field is required to update",
      400,
    );
  }

  if (date !== undefined) {
    const updatedDate = new Date(date);

    if (Number.isNaN(updatedDate.getTime())) {
      throw createError("Invalid interview date", 400);
    }

    if (updatedDate <= new Date()) {
      throw createError("Interview date must be in the future", 400);
    }

    interview.date = updatedDate;
  }

  if (time !== undefined) {
    const trimmedTime = String(time).trim();

    if (!trimmedTime) {
      throw createError("Interview time cannot be empty", 400);
    }

    interview.time = trimmedTime;
  }

  if (meetingLink !== undefined) {
    const trimmedMeetingLink = String(meetingLink).trim();

    if (!trimmedMeetingLink) {
      throw createError("Meeting link cannot be empty", 400);
    }

    interview.meetingLink = trimmedMeetingLink;
  }

  const conflictingInterview = await Interview.findOne({
    _id: { $ne: interviewId },
    recruiter: recruiterId,
    date: interview.date,
    time: interview.time,
    status: "Scheduled",
  });

  if (conflictingInterview) {
    throw createError(
      "You already have another interview scheduled at this time",
      400,
    );
  }

  await interview.save();

  const application = await Application.findById(interview.application);

  if (!application) {
    throw createError("Application not found", 404);
  }

  const job = await Job.findById(application.job);

  if (!job) {
    throw createError("Job not found", 404);
  }

  const candidate = await User.findById(interview.candidate);

  if (!candidate) {
    throw createError("Candidate not found", 404);
  }

  const candidateName =
    `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
    "Candidate";

  // ======================================================
  // EMAIL NOTIFICATION
  // ======================================================

  if (candidate.settings?.emailNotifications !== false) {
    await sendInterviewUpdatedEmail({
      candidateEmail: candidate.email,
      candidateName,
      jobTitle: job.title,
      date: interview.date,
      time: interview.time,
      meetingLink: interview.meetingLink,
    });
  }

  // ======================================================
  // IN-APP INTERVIEW NOTIFICATION
  // ======================================================

  if (candidate.settings?.interviewNotifications !== false) {
    await createNotification({
      recipient: interview.candidate,
      type: "INTERVIEW_UPDATED",
      title: "Interview Updated",
      message: `The interview details for "${job.title}" have been updated.`,
      relatedJob: job._id,
      relatedApplication: application._id,
      relatedInterview: interview._id,
    });
  }

  const populatedInterview = await getPopulatedInterview(interview._id);

  return res.status(200).json({
    success: true,
    message: "Interview updated successfully",
    interview: populatedInterview,
  });
});

// ======================================================
// MARK INTERVIEW AS COMPLETED
// PATCH /api/interviews/:interviewId/complete
// ======================================================

const completeInterview = asyncHandler(async (req, res) => {
  const recruiterId = req.user.userId;
  const interviewId = req.params.interviewId;

  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
    throw createError("Invalid interview ID", 400);
  }

  const interview = await Interview.findOne({
    _id: interviewId,
    recruiter: recruiterId,
  });

  if (!interview) {
    throw createError("Interview not found", 404);
  }

  if (interview.status === "Completed") {
    throw createError("Interview is already completed", 400);
  }

  if (interview.status === "Cancelled") {
    throw createError("Cancelled interview cannot be completed", 400);
  }

  if (interview.status !== "Scheduled") {
    throw createError("Only scheduled interviews can be completed", 400);
  }

  interview.status = "Completed";

  await interview.save();

  const application = await Application.findById(interview.application);

  if (!application) {
    throw createError("Application not found", 404);
  }


  const populatedInterview = await getPopulatedInterview(interview._id);

  return res.status(200).json({
    success: true,
    message: "Interview marked as completed",
    interview: populatedInterview,
    applicationStatus: application.status,
  });
});

// ======================================================
// CANCEL INTERVIEW
// PATCH /api/interviews/:interviewId/cancel
// ======================================================

const cancelInterview = asyncHandler(async (req, res) => {
  const recruiterId = req.user.userId;
  const interviewId = req.params.interviewId;

  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
    throw createError("Invalid interview ID", 400);
  }

  const interview = await Interview.findOne({
    _id: interviewId,
    recruiter: recruiterId,
  });

  if (!interview) {
    throw createError("Interview not found", 404);
  }

  if (interview.status === "Cancelled") {
    throw createError("Interview is already cancelled", 400);
  }

  if (interview.status === "Completed") {
    throw createError("Completed interview cannot be cancelled", 400);
  }

  const application = await Application.findById(interview.application);

  if (!application) {
    throw createError("Application not found", 404);
  }

  const job = await Job.findById(application.job);

  if (!job) {
    throw createError("Job not found", 404);
  }

  const candidate = await User.findById(interview.candidate);

  if (!candidate) {
    throw createError("Candidate not found", 404);
  }

  interview.status = "Cancelled";

  await interview.save();

  const candidateName =
    `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
    "Candidate";

  // ======================================================
  // EMAIL NOTIFICATION
  // ======================================================

  if (candidate.settings?.emailNotifications !== false) {
    await sendInterviewCancelledEmail({
      candidateEmail: candidate.email,
      candidateName,
      jobTitle: job.title,
    });
  }

  // ======================================================
  // IN-APP INTERVIEW NOTIFICATION
  // ======================================================

  if (candidate.settings?.interviewNotifications !== false) {
    await createNotification({
      recipient: interview.candidate,
      type: "INTERVIEW_CANCELLED",
      title: "Interview Cancelled",
      message: `Your interview for "${job.title}" has been cancelled.`,
      relatedJob: job._id,
      relatedApplication: application._id,
      relatedInterview: interview._id,
    });
  }


  const populatedInterview = await getPopulatedInterview(interview._id);

  return res.status(200).json({
    success: true,
    message: "Interview cancelled successfully",
    interview: populatedInterview,
  });
});

// ======================================================
// RESCHEDULE INTERVIEW
// PATCH /api/interviews/:interviewId/reschedule
// ======================================================

const rescheduleInterview = asyncHandler(async (req, res) => {
  const recruiterId = req.user.userId;
  const interviewId = req.params.interviewId;

  const { date, time, meetingLink } = req.body;

  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
    throw createError("Invalid interview ID", 400);
  }

  if (!date || !time || !meetingLink) {
    throw createError("Date, time and meeting link are required", 400);
  }

  const interviewDate = new Date(date);

  if (Number.isNaN(interviewDate.getTime())) {
    throw createError("Invalid interview date", 400);
  }

  if (interviewDate <= new Date()) {
    throw createError("Interview date must be in the future", 400);
  }

  const trimmedTime = String(time).trim();
  const trimmedMeetingLink = String(meetingLink).trim();

  if (!trimmedTime) {
    throw createError("Interview time is required", 400);
  }

  if (!trimmedMeetingLink) {
    throw createError("Meeting link is required", 400);
  }

  const interview = await Interview.findOne({
    _id: interviewId,
    recruiter: recruiterId,
  });

  if (!interview) {
    throw createError("Interview not found", 404);
  }

  if (interview.status !== "Cancelled") {
    throw createError("Only cancelled interviews can be rescheduled", 400);
  }

  const conflictingInterview = await Interview.findOne({
    _id: { $ne: interviewId },
    recruiter: recruiterId,
    date: interviewDate,
    time: trimmedTime,
    status: "Scheduled",
  });

  if (conflictingInterview) {
    throw createError(
      "You already have another interview scheduled at this time",
      400,
    );
  }

  const application = await Application.findById(interview.application);

  if (!application) {
    throw createError("Application not found", 404);
  }

  const job = await Job.findById(application.job);

  if (!job) {
    throw createError("Job not found", 404);
  }

  const candidate = await User.findById(interview.candidate);

  if (!candidate) {
    throw createError("Candidate not found", 404);
  }

  interview.date = interviewDate;
  interview.time = trimmedTime;
  interview.meetingLink = trimmedMeetingLink;
  interview.status = "Scheduled";

  await interview.save();

  // Keep application in Interview status.
  if (application.status !== "Interview") {
    application.status = "Interview";
    await application.save();
  }

  const candidateName =
    `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
    "Candidate";

  // ======================================================
  // EMAIL NOTIFICATION
  // ======================================================

  if (candidate.settings?.emailNotifications !== false) {
    await sendInterviewUpdatedEmail({
      candidateEmail: candidate.email,
      candidateName,
      jobTitle: job.title,
      date: interviewDate,
      time: trimmedTime,
      meetingLink: trimmedMeetingLink,
    });
  }

  // ======================================================
  // IN-APP INTERVIEW NOTIFICATION
  // ======================================================

  if (candidate.settings?.interviewNotifications !== false) {
    await createNotification({
      recipient: interview.candidate,
      type: "INTERVIEW_UPDATED",
      title: "Interview Rescheduled",
      message: `Your interview for "${job.title}" has been rescheduled to ${interviewDate.toLocaleDateString()} at ${trimmedTime}.`,
      relatedJob: job._id,
      relatedApplication: application._id,
      relatedInterview: interview._id,
    });
  }

  const populatedInterview = await getPopulatedInterview(interview._id);

  return res.status(200).json({
    success: true,
    message: "Interview rescheduled successfully",
    interview: populatedInterview,
  });
});

// ======================================================
// GET UPCOMING JOBSEEKER INTERVIEWS
// GET /api/interviews/my/upcoming
// ======================================================
const getUpcomingJobseekerInterviews = asyncHandler(async (req, res) => {
  const candidateId = req.user.userId;

  const now = new Date();

  const interviews = await Interview.find({
    candidate: candidateId,
    status: "Scheduled",
    date: {
      $gte: now,
    },
  })
    .populate({
      path: "application",
      select: "status createdAt job",
      populate: {
        path: "job",
        select: "title location jobType workMode company",
        populate: {
          path: "company",
          select: "companyName logo",
        },
      },
    })
    .populate("recruiter", "firstName lastName email profilePicture")
    .sort({
      date: 1,
      time: 1,
    })
    .limit(5);

  return res.status(200).json({
    success: true,
    count: interviews.length,
    interviews,
  });
});

module.exports = {
  scheduleInterview,
  getAllInterviews,
  getInterview,
  updateInterview,
  completeInterview,
  cancelInterview,
  rescheduleInterview,
  getUpcomingJobseekerInterviews,
};
