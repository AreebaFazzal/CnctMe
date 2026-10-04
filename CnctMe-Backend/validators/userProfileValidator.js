const { body } = require("express-validator");

const userProfileValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("phoneNumber")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("profilePicture")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Profile picture must be a valid URL"),

  body("position")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Position cannot exceed 100 characters"),

  body("bio")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("location")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),

  body("skills").optional().isArray().withMessage("Skills must be an array"),

  body("skills.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Each skill cannot exceed 50 characters"),

  body("education")
    .optional()
    .isArray()
    .withMessage("Education must be an array"),

  body("education.*.degree")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Degree is required")
    .isLength({ max: 100 })
    .withMessage("Degree cannot exceed 100 characters"),

  body("education.*.institution")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Institution is required")
    .isLength({ max: 150 })
    .withMessage("Institution cannot exceed 150 characters"),

  body("education.*.fieldOfStudy")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Field of study is required")
    .isLength({ max: 100 })
    .withMessage("Field of study cannot exceed 100 characters"),

  body("education.*.startYear")
    .optional({ values: "falsy" })
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Start year must be between 1900 and 2100"),

  body("education.*.endYear")
    .optional({ values: "falsy" })
    .isInt({ min: 1900, max: 2100 })
    .withMessage("End year must be between 1900 and 2100"),

  body("experience")
    .optional()
    .isArray()
    .withMessage("Experience must be an array"),

  body("experience.*.jobTitle")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 })
    .withMessage("Job title cannot exceed 100 characters"),

  body("experience.*.company")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Company is required")
    .isLength({ max: 150 })
    .withMessage("Company cannot exceed 150 characters"),

  body("experience.*.startDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("experience.*.endDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("End date must be a valid date"),

  body("experience.*.description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Experience description cannot exceed 1000 characters"),

  body("linkedin")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("LinkedIn must be a valid URL"),

  body("github")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("GitHub must be a valid URL"),
];

module.exports = userProfileValidator;
