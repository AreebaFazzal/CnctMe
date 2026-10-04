const express = require("express");
const router = express.Router();

const {
  createReport,
  getMyReports,
} = require("../controllers/reportController");

const reportValidator = require("../validators/reportValidator");
const validationMiddleware = require("../middleware/validationMiddleware");
const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/my-reports",
  userMiddleware,
  verifiedMiddleware,
  asyncHandler(getMyReports),
);

router.post(
  "/",
  userMiddleware,
  verifiedMiddleware,
  reportValidator,
  validationMiddleware,
  asyncHandler(createReport),
);

module.exports = router;
