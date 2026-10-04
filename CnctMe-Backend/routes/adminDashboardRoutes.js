const express = require("express");

const router = express.Router();

const {
  getAdminDashboard,
} = require("../controllers/adminDashboardController");

const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getAdminDashboard),
);

module.exports = router;
