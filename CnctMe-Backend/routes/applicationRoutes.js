const express = require("express");

const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  getMyApplicationDetails,
  cancelApplication,
  getJobApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const userMiddleware = require("../middleware/userMiddleware");

const verifiedMiddleware = require("../middleware/verifiedMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const uploadResume = require("../middleware/uploadResumeMiddleware");

const validationMiddleware = require("../middleware/validationMiddleware");

const asyncHandler = require("../utils/asyncHandler");

const applicationValidator = require("../validators/applicationValidator");

const requireCompany = require("../middleware/requireCompanyMiddleware");

// ======================================================
// JOB SEEKER ROUTES
// ======================================================

router.post(
  "/jobs/:jobId/apply",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker"]),
  uploadResume.single("resume"),
  applicationValidator,
  validationMiddleware,
  asyncHandler(applyForJob),
);

router.get(
  "/applications/my",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker"]),
  asyncHandler(getMyApplications),
);

router.get(
  "/applications/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker"]),
  asyncHandler(getMyApplicationDetails),
);

router.delete(
  "/applications/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker"]),
  asyncHandler(cancelApplication),
);

// ======================================================
// RECRUITER ROUTES
// ======================================================

router.get(
  "/jobs/:jobId/applications",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(getJobApplicants),
);

router.put(
  "/applications/:applicationId/status",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(updateApplicationStatus),
);

module.exports = router;
