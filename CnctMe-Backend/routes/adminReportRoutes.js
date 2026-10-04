const express = require("express");

const router = express.Router();

const {
  getAllReports,
  getReportById,
  updateReportStatus,
} = require("../controllers/adminReportController");

const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getAllReports),
);

router.get(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getReportById),
);

router.put(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(updateReportStatus),
);

module.exports = router;
