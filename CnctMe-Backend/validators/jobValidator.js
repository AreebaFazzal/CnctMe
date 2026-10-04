const { body } = require("express-validator");

const jobValidator = [
  body("title").trim().notEmpty().withMessage("Job title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required"),

  body("location").trim().notEmpty().withMessage("Job location is required"),

  body("salaryMin")
    .notEmpty()
    .withMessage("Minimum salary is required")
    .isNumeric()
    .withMessage("Minimum salary must be a number")
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error("Minimum salary cannot be negative");
      }
      return true;
    }),

  body("salaryMax")
    .notEmpty()
    .withMessage("Maximum salary is required")
    .isNumeric()
    .withMessage("Maximum salary must be a number")
    .custom((value, { req }) => {
      if (Number(value) < Number(req.body.salaryMin)) {
        throw new Error(
          "Maximum salary must be greater than or equal to minimum salary",
        );
      }
      return true;
    }),

  body("category").trim().notEmpty().withMessage("Job category is required"),

  body("experienceMin")
    .notEmpty()
    .withMessage("Minimum experience is required")
    .isNumeric()
    .withMessage("Minimum experience must be a number"),

  body("experienceMax")
    .notEmpty()
    .withMessage("Maximum experience is required")
    .isNumeric()
    .withMessage("Maximum experience must be a number"),

  body("jobType")
    .trim()
    .notEmpty()
    .withMessage("Job type is required")
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid job type"),

  body("workMode")
    .trim()
    .notEmpty()
    .withMessage("Work mode is required")
    .isIn(["on-site", "remote", "hybrid"])
    .withMessage("Invalid work mode"),

  body("skills")
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),

  body("skills.*").trim().notEmpty().withMessage("Skill cannot be empty"),
];

module.exports = jobValidator;
