const express = require("express");

const router = express.Router();

const {
  saveJob,
  unsaveJob,
  getSavedJobs,
} = require("../controllers/savedJobsController");

const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const asyncHandler = require("../utils/asyncHandler");

router.post(
  "/jobs/:jobId/save",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker", "recruiter"]),
  asyncHandler(saveJob),
);

router.delete(
  "/jobs/:jobId/save",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker", "recruiter"]),
  asyncHandler(unsaveJob),
);

router.get(
  "/saved-jobs",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker", "recruiter"]),
  asyncHandler(getSavedJobs),
);

module.exports = router;
