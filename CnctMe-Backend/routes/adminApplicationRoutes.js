const express = require("express");

const router = express.Router();

const {
  getAllApplications,
  getApplicationById,
  getAdminApplicationResume,
} = require("../controllers/adminApplicationController");

const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getAllApplications),
);

router.get(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getApplicationById),
);

router.get("/applications/:applicationId/resume", getAdminApplicationResume);

module.exports = router;
