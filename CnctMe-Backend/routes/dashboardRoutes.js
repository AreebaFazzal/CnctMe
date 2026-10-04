const express = require("express");

const router = express.Router();

const { getJobSeekerDashboard } = require("../controllers/dashboardController");

const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/jobseeker",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["jobseeker"]),
  asyncHandler(getJobSeekerDashboard),
);

module.exports = router;
