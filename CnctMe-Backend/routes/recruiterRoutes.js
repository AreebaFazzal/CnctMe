const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/recruiterController");

const recruiterProfileValidator = require("../validators/recruiterProfileValidator");
const asyncHandler = require("../utils/asyncHandler");
const validationMiddleware = require("../middleware/validationMiddleware");
const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const uploadImage = require("../middleware/uploadImageMiddleware");
const requireCompany = require("../middleware/requireCompanyMiddleware");

// ==========================================
// RECRUITER PROFILE
// ==========================================

router.get(
  "/profile",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  asyncHandler(getRecruiterProfile),
);

router.put(
  "/profile",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  uploadImage.single("profilePicture"),
  recruiterProfileValidator,
  validationMiddleware,
  asyncHandler(updateRecruiterProfile),
);

router.get(
  "/profile-picture",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  asyncHandler(getRecruiterProfilePicture),
);

// ==========================================
// RECRUITER DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  asyncHandler(getRecruiterDashboard),
);

router.get(
  "/recent-jobs",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  asyncHandler(getRecentJobs),
);

router.get(
  "/recent-applicants",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  asyncHandler(getRecentApplicants),
);

router.get(
  "/upcoming-interviews",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  asyncHandler(getUpcomingInterviews),
);

router.get(
  "/analytics",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  asyncHandler(getRecruiterAnalytics),
);

// ==========================================
// APPLICANT DETAILS
// ==========================================

router.get(
  "/applications/:applicationId",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(getApplicantDetails),
);

// ==========================================
// APPLICATION RESUME
// ==========================================

router.get(
  "/applications/:applicationId/resume",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(getApplicationResume),
);

// ==========================================
// CANDIDATE PROFILE
// ==========================================

router.get(
  "/candidates/:userId",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(getCandidateProfile),
);

module.exports = router;
