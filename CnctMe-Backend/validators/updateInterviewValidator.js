const { body } = require("express-validator");

const updateInterviewValidator = [
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Valid interview date is required"),

  body("time")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Interview time cannot be empty"),

  body("meetingLink")
    .optional()
    .trim()
    .isURL()
    .withMessage("Valid meeting link is required"),
];

module.exports = updateInterviewValidator;
