import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

// =========================
// Initial State
// =========================
const initialState = {
  companies: [],
  currentCompany: null,

  loading: true,
  detailsLoading: false,

  error: null,
  detailsError: null,

  currentPage: 1,
  totalCompanies: 0,
  totalPages: 0,
  limit: 9,
};

// =========================
// Get All Companies
// =========================
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async ({ page = 1, search = "" } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const limit = state.companies.limit;

      const params = {
        page,
        limit,
      };

      const trimmedSearch = search.trim();

      if (trimmedSearch) {
        params.search = trimmedSearch;
      }

      const response = await api.get("/companies", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// =========================
// Get Single Company
// =========================
export const fetchCompanyDetails = createAsyncThunk(
  "companies/fetchCompanyDetails",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/companies/${companyId}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// =========================
// Get My Company
// =========================
export const fetchMyCompany = createAsyncThunk(
  "companies/fetchMyCompany",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/companies/my");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// =========================
// Create Company
// =========================
export const createCompany = createAsyncThunk(
  "companies/createCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await api.post("/companies", companyData);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// =========================
// Update Company
// =========================
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await api.put("/companies/my", companyData);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// =========================
// Delete Company
// =========================
export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/companies/my");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// =========================
// Companies Slice
// =========================
const companiesSlice = createSlice({
  name: "companies",

  initialState,

  reducers: {
    // Clear general error
    clearCompanyError: (state) => {
      state.error = null;
    },

    // Clear details error
    clearCompanyDetailsError: (state) => {
      state.detailsError = null;
    },

    // Clear current company
    clearCurrentCompany: (state) => {
      state.currentCompany = null;
    },

    // Clear companies
    clearCompanies: (state) => {
      state.companies = [];
    },
  },

  extraReducers: (builder) => {
    // ==================================
    // Fetch All Companies
    // ==================================
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.companies = action.payload.companies || [];

        state.currentPage = action.payload.page || 1;

        state.totalCompanies = action.payload.totalCompanies || 0;

        state.totalPages = action.payload.totalPages || 0;

        state.limit = action.payload.limit || state.limit;
      })

      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to load companies. Please try again.",
        };
      });

    // ==================================
    // Fetch Company Details
    // ==================================
    builder
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = null;

        state.currentCompany = action.payload.companyInfo || null;
      })

      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.detailsLoading = false;

        state.detailsError = action.payload || {
          general: "Unable to load company details. Please try again.",
        };
      });

    // ==================================
    // Fetch My Company
    // ==================================
    builder
      .addCase(fetchMyCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.currentCompany = action.payload.companyInfo || null;
      })

      .addCase(fetchMyCompany.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to load your company. Please try again.",
        };
      });

    // ==================================
    // Create Company
    // ==================================
    builder
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const company = action.payload.company;

        state.currentCompany = company || null;

        if (company) {
          state.companies.push(company);
        }
      })

      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to create company. Please try again.",
        };
      });

    // ==================================
    // Update Company
    // ==================================
    builder
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedCompany = action.payload.company;

        state.currentCompany = updatedCompany || null;

        if (updatedCompany?._id) {
          const index = state.companies.findIndex(
            (company) => company._id === updatedCompany._id,
          );

          if (index !== -1) {
            state.companies[index] = updatedCompany;
          }
        }
      })

      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to update company. Please try again.",
        };
      });

    // ==================================
    // Delete Company
    // ==================================
    builder
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCompany.fulfilled, (state) => {
        state.loading = false;
        state.error = null;

        state.currentCompany = null;
      })

      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to delete company. Please try again.",
        };
      });
  },
});

export const {
  clearCompanyError,
  clearCompanyDetailsError,
  clearCurrentCompany,
  clearCompanies,
} = companiesSlice.actions;

// =========================
// Selectors
// =========================
export const selectCompanies = (state) => state.companies.companies;

export const selectCurrentCompany = (state) => state.companies.currentCompany;

export const selectCompanyLoading = (state) => state.companies.loading;

export const selectCompanyDetailsLoading = (state) =>
  state.companies.detailsLoading;

export const selectCompanyError = (state) => state.companies.error;

export const selectCompanyDetailsError = (state) =>
  state.companies.detailsError;

export const selectCurrentCompanyPage = (state) => state.companies.currentPage;

export const selectTotalCompanies = (state) => state.companies.totalCompanies;

export const selectTotalCompanyPages = (state) => state.companies.totalPages;

export default companiesSlice.reducer;
