import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

const initialState = {
  jobs: [],

  filters: {
    search: "",
    location: "",
    jobType: [],
    workMode: "",
    experienceMin: "",
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    category: "",
    sorting: "",
  },

  loading: false,
  error: null,

  currentPage: 1,
  totalJobs: 0,
  totalPages: 0,
  limit: 10,
};

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (payload = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const filters = payload.filters || state.jobs.filters;

      const currentPage = payload.currentPage || state.jobs.currentPage;

      const limit = state.jobs.limit;

      const params = {
        page: currentPage,
        limit,
      };

      if (filters.search?.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.location?.trim()) {
        params.location = filters.location.trim();
      }

      if (filters.jobType?.length > 0) {
        params.jobType = filters.jobType[0];
      }

      if (filters.workMode) {
        params.workMode = filters.workMode;
      }

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.experienceMin !== undefined && filters.experienceMin !== "") {
        params.experienceMin = filters.experienceMin;
      }

      if (filters.experienceMax !== undefined && filters.experienceMax !== "") {
        params.experienceMax = filters.experienceMax;
      }

      if (filters.salaryMin !== undefined && filters.salaryMin !== "") {
        params.salaryMin = filters.salaryMin;
      }

      if (filters.salaryMax !== undefined && filters.salaryMax !== "") {
        params.salaryMax = filters.salaryMax;
      }

      if (filters.sorting) {
        params.sorting = filters.sorting;
      }

      const response = await api.get("/jobs", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

const jobsSlice = createSlice({
  name: "jobs",

  initialState,

  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },

    setLocation: (state, action) => {
      state.filters.location = action.payload;
    },

    setJobType: (state, action) => {
      state.filters.jobType = action.payload;
    },

    setWorkMode: (state, action) => {
      state.filters.workMode = action.payload;
    },

    setExperience: (state, action) => {
      const { min, max } = action.payload;

      state.filters.experienceMin = min;
      state.filters.experienceMax = max;
    },

    setSalaryRange: (state, action) => {
      const { min, max } = action.payload;

      state.filters.salaryMin = min;
      state.filters.salaryMax = max;
    },

    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },

    setSorting: (state, action) => {
      state.filters.sorting = action.payload;
    },

    clearFilters: (state) => {
      state.filters = {
        ...initialState.filters,
      };

      state.currentPage = 1;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchJobs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;

      state.jobs = action.payload.allJobs || [];

      state.totalJobs = action.payload.totalJobs || 0;

      state.totalPages = action.payload.totalPages || 0;

      state.currentPage = action.payload.page || state.currentPage;
    });

    builder.addCase(fetchJobs.rejected, (state, action) => {
      state.loading = false;

      state.error = action.payload || {
        general: "Unable to load jobs. Please try again.",
      };
    });
  },
});

export const {
  setSearch,
  setLocation,
  setJobType,
  setWorkMode,
  setExperience,
  setSalaryRange,
  setCategory,
  setSorting,
  clearFilters,
  setCurrentPage,
  clearError,
} = jobsSlice.actions;

export const selectJobs = (state) => state.jobs.jobs;

export const selectJobFilters = (state) => state.jobs.filters;

export const selectJobLoading = (state) => state.jobs.loading;

export const selectJobError = (state) => state.jobs.error;

export const selectCurrentPage = (state) => state.jobs.currentPage;

export const selectTotalJobs = (state) => state.jobs.totalJobs;

export const selectTotalPages = (state) => state.jobs.totalPages;

export default jobsSlice.reducer;
