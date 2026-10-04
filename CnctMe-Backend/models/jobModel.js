const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    salaryMin: {
      type: Number,
      required: true,
      min: 0,
    },

    salaryMax: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value >= this.salaryMin;
        },
        message:
          "Maximum salary must be greater than or equal to minimum salary",
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    experienceMin: {
      type: Number,
      required: true,
      min: 0,
    },

    experienceMax: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value >= this.experienceMin;
        },
        message:
          "Maximum experience must be greater than or equal to minimum experience",
      },
    },

    jobType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "contract", "internship"],
    },

    workMode: {
      type: String,
      required: true,
      enum: ["on-site", "remote", "hybrid"],
    },

    skills: {
      type: [String],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Job", jobSchema);
