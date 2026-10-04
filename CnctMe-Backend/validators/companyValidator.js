const { body } = require("express-validator");

const createCompanyValidator = [
  body("companyName").trim().notEmpty().withMessage("Company name is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Company description is required"),

  body("website")
    .trim()
    .notEmpty()
    .withMessage("Company website is required")
    .isURL()
    .withMessage("Please provide a valid website URL"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Company location is required"),

  body("industry").trim().notEmpty().withMessage("Industry is required"),

  body("companySize").trim().notEmpty().withMessage("Company size is required"),
];

module.exports = createCompanyValidator;
