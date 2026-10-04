const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      default: "jobseeker",
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // EMAIL VERIFICATION
    verificationToken: {
      type: String,
      default: null,
    },

    verificationTokenExpires: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // Automatically delete unverified accounts
    verificationCleanupAt: {
      type: Date,
      default: null,
      index: true,
      expires: 0,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    profilePicture: {
      data: Buffer,
      contentType: String,
    },

    position: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    linkedin: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    skills: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    education: {
      type: [
        {
          degree: {
            type: String,
            trim: true,
          },
          institution: {
            type: String,
            trim: true,
          },
          fieldOfStudy: {
            type: String,
            trim: true,
          },
          startYear: {
            type: Number,
          },
          endYear: {
            type: Number,
          },
        },
      ],
      default: [],
    },
    experience: {
      type: [
        {
          jobTitle: {
            type: String,
            trim: true,
          },
          company: {
            type: String,
            trim: true,
          },
          startDate: {
            type: Date,
          },
          endDate: {
            type: Date,
          },
          description: {
            type: String,
            trim: true,
          },
        },
      ],
      default: [],
    },

    github: {
      type: String,
      trim: true,
    },

    resume: {
      data: {
        type: Buffer,
      },

      contentType: {
        type: String,
      },

      originalName: {
        type: String,
        trim: true,
      },
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },

      applicationNotifications: {
        type: Boolean,
        default: true,
      },

      interviewNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },

  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
