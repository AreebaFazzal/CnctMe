const { body } = require("express-validator");

const applicationStatusValidator = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ])
    .withMessage("Invalid application status"),
];

module.exports = applicationStatusValidator;
