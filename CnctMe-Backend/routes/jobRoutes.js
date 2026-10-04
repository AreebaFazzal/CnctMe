const express = require("express");

const router = express.Router();

const {
  createJob,
  getMyJobs,
  getJob,
  updateJob,
  closeJob,
  deleteJob,
  getAllJobs,
} = require("../controllers/jobController");

const jobValidator = require("../validators/jobValidator");
const validationMiddleware = require("../middleware/validationMiddleware");
const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const roleMiddleware = require("../middleware/roleMiddleware");
const requireCompany = require("../middleware/requireCompanyMiddleware");

// ===================
//  PUBLIC ROUTES
//  ====================

router.get("/", asyncHandler(getAllJobs));

// ====================
// PROTECTED RECRUITER ROUTES
// ====================

router.get(
  "/my-jobs",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(getMyJobs),
);

router.post(
  "/",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  jobValidator,
  validationMiddleware,
  asyncHandler(createJob),
);

router.put(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  jobValidator,
  validationMiddleware,
  asyncHandler(updateJob),
);

router.patch(
  "/:id/close",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(closeJob),
);

router.delete(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  requireCompany,
  asyncHandler(deleteJob),
);

// ====================
// PUBLIC SINGLE JOB
//  ====================

router.get("/:id", asyncHandler(getJob));

module.exports = router;
