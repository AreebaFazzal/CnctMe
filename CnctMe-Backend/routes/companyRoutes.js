const express = require("express");

const router = express.Router();

const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  getMyCompany,
} = require("../controllers/companyController");

const companyValidator = require("../validators/companyValidator");
const validationMiddleware = require("../middleware/validationMiddleware");

const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const asyncHandler = require("../utils/asyncHandler");
const uploadImage = require("../middleware/uploadImageMiddleware");

// ======================================================
// Recruiter + Jobseeker + Admin
// ======================================================
router.get("/", asyncHandler(getCompanies));

// ======================================================
// Recruiter
// ======================================================
router.post(
  "/",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  uploadImage.single("logo"),
  companyValidator,
  validationMiddleware,
  asyncHandler(createCompany),
);

router.get(
  "/my",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  asyncHandler(getMyCompany),
);

router.put(
  "/my",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  uploadImage.single("logo"),
  companyValidator,
  validationMiddleware,
  asyncHandler(updateCompany),
);

router.delete(
  "/my",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["recruiter"]),
  asyncHandler(deleteCompany),
);

// ======================================================
// Job Seeker + Recruiter
// ======================================================
router.get(
  "/:companyId",
  userMiddleware,
  verifiedMiddleware,
  asyncHandler(getCompany),
);

module.exports = router;
