const mongoose = require("mongoose");

const Company = require("../models/companyModel");
const createError = require("../utils/createError");

// ==========================================
// GET ALL COMPANIES
// ==========================================

const getAllCompanies = async (req, res) => {
  const {
    search = "",
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};

  if (search.trim()) {
    filter.companyName = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  const allowedSortFields = ["createdAt", "companyName", "location"];

  if (!allowedSortFields.includes(sort)) {
    throw createError("Invalid sort field", 400);
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const [companies, totalCompanies] = await Promise.all([
    Company.find(filter)
      .sort({
        [sort]: sortOrder,
      })
      .skip(skip)
      .limit(limitNumber),

    Company.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,

    companies,

    pagination: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalCompanies,
      totalPages: Math.ceil(totalCompanies / limitNumber),
    },
  });
};

// ==========================================
// GET SINGLE COMPANY
// ==========================================

const getCompanyById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid company ID", 400);
  }

  const company = await Company.findById(id);

  if (!company) {
    throw createError("Company not found", 404);
  }

  return res.status(200).json({
    success: true,
    company,
  });
};

// ==========================================
// DELETE COMPANY
// ==========================================

const deleteCompany = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid company ID", 400);
  }

  const company = await Company.findById(id);

  if (!company) {
    throw createError("Company not found", 404);
  }

  await Company.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Company deleted successfully",
  });
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  deleteCompany,
};
