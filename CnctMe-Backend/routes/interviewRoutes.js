const express = require("express");

const router = express.Router();

const {
  scheduleInterview,
  getAllInterviews,
  getInterview,
  updateInterview,
  completeInterview,
  cancelInterview,
  rescheduleInterview,
  getUpcomingJobseekerInterviews,
} = require("../controllers/interviewController");

const updateInterviewValidator = require("../validators/updateInterviewValidator");

const asyncHandler = require("../utils/asyncHandler");

const validationMiddleware = require("../middleware/validationMiddleware");

const userMiddleware = require("../middleware/userMiddleware");

const verifiedMiddleware = require("../middleware/verifiedMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const requireCompany = require("../middleware/requireCompanyMiddleware");

router.post(
  "/applications/:applicationId",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  updateInterviewValidator,
  validationMiddleware,
  asyncHandler(scheduleInterview),
);

router.get(
  "/",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(getAllInterviews),
);

router.get(
  "/my/upcoming",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker"]),
  asyncHandler(getUpcomingJobseekerInterviews),
);

router.get(
  "/:interviewId",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(getInterview),
);

router.put(
  "/:interviewId",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  updateInterviewValidator,
  validationMiddleware,
  asyncHandler(updateInterview),
);

router.patch(
  "/:interviewId/complete",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(completeInterview),
);

router.patch(
  "/:interviewId/reschedule",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(rescheduleInterview),
);

router.patch(
  "/:interviewId/cancel",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(cancelInterview),
);

module.exports = router;
