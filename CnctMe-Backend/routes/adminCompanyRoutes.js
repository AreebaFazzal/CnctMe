const express = require("express");

const router = express.Router();

const {
  getAllCompanies,
  getCompanyById,
  deleteCompany,
} = require("../controllers/adminCompanyController");

const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getAllCompanies),
);

router.get(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getCompanyById),
);

router.delete(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(deleteCompany),
);

module.exports = router;
