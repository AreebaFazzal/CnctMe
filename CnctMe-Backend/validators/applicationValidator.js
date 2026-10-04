const { body } = require("express-validator");

const applicationValidator = [
  body("coverLetter")
    .trim()
    .notEmpty()
    .withMessage("Cover letter is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Cover letter must be between 20 and 2000 characters"),
];

module.exports = applicationValidator;
