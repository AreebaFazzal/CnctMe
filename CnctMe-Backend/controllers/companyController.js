const companyModel = require("../models/companyModel");
const createError = require("../utils/createError");

// ======================================================
// CREATE COMPANY
// ======================================================
const createCompany = async (req, res, next) => {
  const { companyName, description, website, location, industry, companySize } =
    req.body;

  if (!req.file) {
    throw createError("Company logo is required", 400);
  }

  const existingCompany = await companyModel.findOne({
    createdBy: req.user.userId,
  });

  if (existingCompany) {
    throw createError("You already have a company", 409);
  }

  const existingCompanyName = await companyModel.findOne({
    companyName,
  });

  if (existingCompanyName) {
    throw createError("Company name already exists", 409);
  }

  const company = new companyModel({
    companyName,
    description,

    logo: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    },

    website,
    location,
    industry,
    companySize,

    createdBy: req.user.userId,
  });

  const savedCompanyInfo = await company.save();

  return res.status(201).json({
    status: true,
    message: "Company has been created successfully",

    company: {
      _id: savedCompanyInfo._id,
      companyName: savedCompanyInfo.companyName,
      description: savedCompanyInfo.description,
      website: savedCompanyInfo.website,
      location: savedCompanyInfo.location,
      industry: savedCompanyInfo.industry,
      companySize: savedCompanyInfo.companySize,
      createdBy: savedCompanyInfo.createdBy,
      logo: savedCompanyInfo.logo,
      createdAt: savedCompanyInfo.createdAt,
      updatedAt: savedCompanyInfo.updatedAt,
    },
  });
};

// ======================================================
// GET ALL COMPANIES
// ======================================================
const getCompanies = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.max(Number(req.query.limit) || 9, 1);

    const search = req.query.search?.trim() || "";

    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      filter.$or = [
        {
          companyName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          industry: {
            $regex: search,
            $options: "i",
          },
        },
        {
          location: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const totalCompanies = await companyModel.countDocuments(filter);

    const companies = await companyModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCompanies / limit);

    return res.status(200).json({
      status: true,
      message: "Companies information",

      companies,

      page,
      limit,
      totalCompanies,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET SINGLE COMPANY
// ======================================================
const getCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const companyInfo = await companyModel.findById(companyId);

    if (!companyInfo) {
      throw createError("Company doesn't exist", 404);
    }

    return res.status(200).json({
      status: true,
      message: "Company information",

      companyInfo,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE COMPANY
// ======================================================
const updateCompany = async (req, res, next) => {
  const { companyName, description, website, location, industry, companySize } =
    req.body;

  const companyInfo = await companyModel.findOne({
    createdBy: req.user.userId,
  });

  if (!companyInfo) {
    throw createError("Company doesn't exist", 404);
  }

  if (companyName && companyName !== companyInfo.companyName) {
    const existingCompanyName = await companyModel.findOne({
      companyName,
      _id: {
        $ne: companyInfo._id,
      },
    });

    if (existingCompanyName) {
      throw createError("Company name already exists", 409);
    }
  }

  if (companyName !== undefined) {
    companyInfo.companyName = companyName;
  }

  if (description !== undefined) {
    companyInfo.description = description;
  }

  if (website !== undefined) {
    companyInfo.website = website;
  }

  if (location !== undefined) {
    companyInfo.location = location;
  }

  if (industry !== undefined) {
    companyInfo.industry = industry;
  }

  if (companySize !== undefined) {
    companyInfo.companySize = companySize;
  }

  if (req.file) {
    companyInfo.logo = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
  }

  const updatedCompany = await companyInfo.save();

  return res.status(200).json({
    status: true,

    message: "Your company information has been updated successfully",

    company: {
      _id: updatedCompany._id,
      companyName: updatedCompany.companyName,
      description: updatedCompany.description,
      website: updatedCompany.website,
      location: updatedCompany.location,
      industry: updatedCompany.industry,
      companySize: updatedCompany.companySize,
      createdBy: updatedCompany.createdBy,
      logo: updatedCompany.logo,
      createdAt: updatedCompany.createdAt,
      updatedAt: updatedCompany.updatedAt,
    },
  });
};

// ======================================================
// DELETE COMPANY
// ======================================================
const deleteCompany = async (req, res, next) => {
  const companyInfo = await companyModel.findOneAndDelete({
    createdBy: req.user.userId,
  });

  if (!companyInfo) {
    throw createError("Company doesn't exist", 404);
  }

  return res.status(200).json({
    status: true,
    message: "Your company has been deleted successfully",
  });
};

// ======================================================
// GET MY COMPANY
// ======================================================
const getMyCompany = async (req, res, next) => {
  const companyInfo = await companyModel.findOne({
    createdBy: req.user.userId,
  });

  if (!companyInfo) {
    throw createError("You haven't created a company yet", 404);
  }

  return res.status(200).json({
    status: true,
    message: "This is your company",

    companyInfo,
  });
};

module.exports = {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  getMyCompany,
};
