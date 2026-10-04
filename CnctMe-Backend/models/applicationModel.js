const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    resume: {
      data: {
        type: Buffer,
        required: true,
      },

      contentType: {
        type: String,
        required: true,
      },

      originalName: {
        type: String,
        required: true,
        trim: true,
      },
    },

    coverLetter: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,

      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],

      default: "Applied",
    },
  },

  {
    timestamps: true,
  },
);

applicationSchema.index(
  {
    user: 1,
    job: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Application", applicationSchema);
