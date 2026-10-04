const express = require("express");

const router = express.Router();

const {
  getAllJobs,
  getJobById,
  removeJob,
} = require("../controllers/adminJobController");

const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getAllJobs),
);

router.get(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getJobById),
);

router.delete(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(removeJob),
);

module.exports = router;
