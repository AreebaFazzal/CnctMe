const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// PREVENT DUPLICATE USER REPORTS
reportSchema.index(
  {
    reporter: 1,
    reportedUser: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      reportedUser: {
        $type: "objectId",
      },
    },
  },
);

// PREVENT DUPLICATE JOB REPORTS
reportSchema.index(
  {
    reporter: 1,
    job: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      job: {
        $type: "objectId",
      },
    },
  },
);

// PREVENT DUPLICATE COMPANY REPORTS
reportSchema.index(
  {
    reporter: 1,
    company: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      company: {
        $type: "objectId",
      },
    },
  },
);

module.exports = mongoose.model("Report", reportSchema);
