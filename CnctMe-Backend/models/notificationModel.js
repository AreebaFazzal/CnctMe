const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,

      enum: [
        "APPLICATION_RECEIVED",
        "APPLICATION_SHORTLISTED",
        "APPLICATION_REJECTED",
        "CANDIDATE_SELECTED",
        "INTERVIEW_SCHEDULED",
        "INTERVIEW_UPDATED",
        "INTERVIEW_CANCELLED",
        "REPORT_CREATED",
        "USER_REPORTED",
        "JOB_REPORTED",
      ],

      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },

    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },

    relatedInterview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", notificationSchema);
