const companyModel = require("../models/companyModel");

const requireCompany = async (req, res, next) => {
  try {
    const company = await companyModel.findOne({
      createdBy: req.user.userId,
    });

    if (!company) {
      return res.status(403).json({
        success: false,
        message:
          "Please create your company profile before accessing this feature",
        code: "COMPANY_REQUIRED",
      });
    }

    req.company = company;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireCompany;
