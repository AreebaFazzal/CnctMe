const { body } = require("express-validator");

const reportValidator = [
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Report reason is required")
    .isLength({ max: 200 })
    .withMessage("Report reason cannot exceed 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Report description is required")
    .isLength({ min: 10 })
    .withMessage("Report description must be at least 10 characters")
    .isLength({ max: 2000 })
    .withMessage("Report description cannot exceed 2000 characters"),
];

module.exports = reportValidator;
