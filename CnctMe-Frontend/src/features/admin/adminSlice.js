import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  // Dashboard
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,

  // Users
  users: [],
  usersPagination: {
    currentPage: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 0,
  },
  usersLoading: false,
  usersError: null,

  // Companies
  companies: [],
  companiesPagination: {
    currentPage: 1,
    limit: 10,
    totalCompanies: 0,
    totalPages: 0,
  },
  companiesLoading: false,
  companiesError: null,

  // Jobs
  jobs: [],
  jobsPagination: {
    currentPage: 1,
    limit: 10,
    totalJobs: 0,
    totalPages: 0,
  },
  jobsLoading: false,
  jobsError: null,

  // Applications
  applications: [],
  applicationsPagination: {
    currentPage: 1,
    limit: 10,
    totalApplications: 0,
    totalPages: 0,
  },
  applicationsLoading: false,
  applicationsError: null,

  // Reports
  reports: [],
  pagination: {
    currentPage: 1,
    limit: 10,
    totalReports: 0,
    totalPages: 0,
  },
  reportsLoading: false,
  reportsError: null,

  // Selected details
  selectedUser: null,
  selectedCompany: null,
  selectedJob: null,
  selectedApplication: null,
  selectedReport: null,

  // Detail loading
  userDetailsLoading: false,
  companyDetailsLoading: false,
  jobDetailsLoading: false,
  applicationDetailsLoading: false,
  reportDetailsLoading: false,

  // Detail errors
  userDetailsError: null,
  companyDetailsError: null,
  jobDetailsError: null,
  applicationDetailsError: null,
  reportDetailsError: null,

  // Actions
  userActionLoading: false,
  companyActionLoading: false,
  jobActionLoading: false,
  reportUpdateLoading: false,

  userActionError: null,
  companyActionError: null,
  jobActionError: null,
  reportUpdateError: null,

  error: null,
};

// ==========================================
// DASHBOARD
// ==========================================

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/dashboard");

      return response.data.dashboard;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==========================================
// USERS
// ==========================================

export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchAdminUsers",
  async (
    {
      search = "",
      role = "",
      status = "",
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get("/admin/users", {
        params: {
          search,
          role,
          status,
          page,
          limit,
          sort,
          order,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const fetchAdminUserById = createAsyncThunk(
  "admin/fetchAdminUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const blockAdminUser = createAsyncThunk(
  "admin/blockAdminUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}/block`);

      return {
        userId,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const unblockAdminUser = createAsyncThunk(
  "admin/unblockAdminUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}/unblock`);

      return {
        userId,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const deleteAdminUser = createAsyncThunk(
  "admin/deleteAdminUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);

      return {
        userId,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==========================================
// COMPANIES
// ==========================================

export const fetchAdminCompanies = createAsyncThunk(
  "admin/fetchAdminCompanies",
  async (
    {
      search = "",
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get("/admin/companies", {
        params: {
          search,
          page,
          limit,
          sort,
          order,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const fetchAdminCompanyById = createAsyncThunk(
  "admin/fetchAdminCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/companies/${companyId}`);

      return response.data.company;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const deleteAdminCompany = createAsyncThunk(
  "admin/deleteAdminCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/companies/${companyId}`);

      return {
        companyId,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==========================================
// JOBS
// ==========================================

export const fetchAdminJobs = createAsyncThunk(
  "admin/fetchAdminJobs",
  async (
    {
      search = "",
      status = "",
      jobType = "",
      workMode = "",
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get("/admin/jobs", {
        params: {
          search,
          status,
          jobType,
          workMode,
          page,
          limit,
          sort,
          order,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const fetchAdminJobById = createAsyncThunk(
  "admin/fetchAdminJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/jobs/${jobId}`);

      return response.data.job;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const removeAdminJob = createAsyncThunk(
  "admin/removeAdminJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/jobs/${jobId}`);

      return {
        jobId,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==========================================
// APPLICATIONS
// ==========================================

export const fetchAdminApplications = createAsyncThunk(
  "admin/fetchAdminApplications",
  async (
    {
      status = "",
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get("/admin/applications", {
        params: {
          status,
          page,
          limit,
          sort,
          order,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const fetchAdminApplicationById = createAsyncThunk(
  "admin/fetchAdminApplicationById",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/applications/${applicationId}`);

      return response.data.application;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==========================================
// REPORTS
// ==========================================

export const fetchAdminReports = createAsyncThunk(
  "admin/fetchAdminReports",
  async (
    {
      status = "",
      search = "",
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get("/admin/reports", {
        params: {
          status,
          search,
          page,
          limit,
          sort,
          order,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const fetchAdminReportById = createAsyncThunk(
  "admin/fetchAdminReportById",
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/reports/${reportId}`);

      return response.data.report;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const updateAdminReportStatus = createAsyncThunk(
  "admin/updateAdminReportStatus",
  async ({ reportId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/reports/${reportId}`, {
        status,
      });

      return response.data.report;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==========================================
// SLICE
// ==========================================

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },

    clearUsersError: (state) => {
      state.usersError = null;
      state.userActionError = null;
      state.userDetailsError = null;
    },

    clearCompaniesError: (state) => {
      state.companiesError = null;
      state.companyActionError = null;
      state.companyDetailsError = null;
    },

    clearJobsError: (state) => {
      state.jobsError = null;
      state.jobActionError = null;
      state.jobDetailsError = null;
    },

    clearApplicationsError: (state) => {
      state.applicationsError = null;
      state.applicationDetailsError = null;
    },

    clearReportsError: (state) => {
      state.reportsError = null;
      state.reportDetailsError = null;
      state.reportUpdateError = null;
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.userDetailsError = null;
    },

    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
      state.companyDetailsError = null;
    },

    clearSelectedJob: (state) => {
      state.selectedJob = null;
      state.jobDetailsError = null;
    },

    clearSelectedApplication: (state) => {
      state.selectedApplication = null;
      state.applicationDetailsError = null;
    },

    clearSelectedReport: (state) => {
      state.selectedReport = null;
      state.reportDetailsError = null;
    },
  },

  extraReducers: (builder) => {
    // ==========================================
    // DASHBOARD
    // ==========================================

    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })

      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })

      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      });

    // ==========================================
    // USERS
    // ==========================================

    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })

      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;

        state.users = action.payload.users || [];

        state.usersPagination = action.payload.pagination || {
          currentPage: 1,
          limit: 10,
          totalUsers: 0,
          totalPages: 0,
        };
      })

      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })

      .addCase(fetchAdminUserById.pending, (state) => {
        state.userDetailsLoading = true;
        state.userDetailsError = null;
      })

      .addCase(fetchAdminUserById.fulfilled, (state, action) => {
        state.userDetailsLoading = false;
        state.selectedUser = action.payload;
      })

      .addCase(fetchAdminUserById.rejected, (state, action) => {
        state.userDetailsLoading = false;
        state.userDetailsError = action.payload;
      })

      .addCase(blockAdminUser.pending, (state) => {
        state.userActionLoading = true;
        state.userActionError = null;
      })

      .addCase(blockAdminUser.fulfilled, (state, action) => {
        state.userActionLoading = false;

        const user = state.users.find(
          (item) => item._id === action.payload.userId,
        );

        if (user) {
          user.status = "blocked";
        }

        if (
          state.selectedUser &&
          state.selectedUser._id === action.payload.userId
        ) {
          state.selectedUser.status = "blocked";
        }
      })

      .addCase(blockAdminUser.rejected, (state, action) => {
        state.userActionLoading = false;
        state.userActionError = action.payload;
      })

      .addCase(unblockAdminUser.pending, (state) => {
        state.userActionLoading = true;
        state.userActionError = null;
      })

      .addCase(unblockAdminUser.fulfilled, (state, action) => {
        state.userActionLoading = false;

        const user = state.users.find(
          (item) => item._id === action.payload.userId,
        );

        if (user) {
          user.status = "active";
        }

        if (
          state.selectedUser &&
          state.selectedUser._id === action.payload.userId
        ) {
          state.selectedUser.status = "active";
        }
      })

      .addCase(unblockAdminUser.rejected, (state, action) => {
        state.userActionLoading = false;
        state.userActionError = action.payload;
      })

      .addCase(deleteAdminUser.pending, (state) => {
        state.userActionLoading = true;
        state.userActionError = null;
      })

      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.userActionLoading = false;

        state.users = state.users.filter(
          (user) => user._id !== action.payload.userId,
        );

        if (
          state.selectedUser &&
          state.selectedUser._id === action.payload.userId
        ) {
          state.selectedUser = null;
        }

        if (state.usersPagination.totalUsers > 0) {
          state.usersPagination.totalUsers -= 1;
        }
      })

      .addCase(deleteAdminUser.rejected, (state, action) => {
        state.userActionLoading = false;
        state.userActionError = action.payload;
      });

    // ==========================================
    // COMPANIES
    // ==========================================

    builder
      .addCase(fetchAdminCompanies.pending, (state) => {
        state.companiesLoading = true;
        state.companiesError = null;
      })

      .addCase(fetchAdminCompanies.fulfilled, (state, action) => {
        state.companiesLoading = false;

        state.companies = action.payload.companies || [];

        state.companiesPagination = action.payload.pagination || {
          currentPage: 1,
          limit: 10,
          totalCompanies: 0,
          totalPages: 0,
        };
      })

      .addCase(fetchAdminCompanies.rejected, (state, action) => {
        state.companiesLoading = false;
        state.companiesError = action.payload;
      })

      .addCase(fetchAdminCompanyById.pending, (state) => {
        state.companyDetailsLoading = true;
        state.companyDetailsError = null;
      })

      .addCase(fetchAdminCompanyById.fulfilled, (state, action) => {
        state.companyDetailsLoading = false;
        state.selectedCompany = action.payload;
      })

      .addCase(fetchAdminCompanyById.rejected, (state, action) => {
        state.companyDetailsLoading = false;
        state.companyDetailsError = action.payload;
      })

      .addCase(deleteAdminCompany.pending, (state) => {
        state.companyActionLoading = true;
        state.companyActionError = null;
      })

      .addCase(deleteAdminCompany.fulfilled, (state, action) => {
        state.companyActionLoading = false;

        state.companies = state.companies.filter(
          (company) => company._id !== action.payload.companyId,
        );

        if (
          state.selectedCompany &&
          state.selectedCompany._id === action.payload.companyId
        ) {
          state.selectedCompany = null;
        }

        if (state.companiesPagination.totalCompanies > 0) {
          state.companiesPagination.totalCompanies -= 1;
        }
      })

      .addCase(deleteAdminCompany.rejected, (state, action) => {
        state.companyActionLoading = false;
        state.companyActionError = action.payload;
      });

    // ==========================================
    // JOBS
    // ==========================================

    builder
      .addCase(fetchAdminJobs.pending, (state) => {
        state.jobsLoading = true;
        state.jobsError = null;
      })

      .addCase(fetchAdminJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;

        state.jobs = action.payload.jobs || [];

        state.jobsPagination = action.payload.pagination || {
          currentPage: 1,
          limit: 10,
          totalJobs: 0,
          totalPages: 0,
        };
      })

      .addCase(fetchAdminJobs.rejected, (state, action) => {
        state.jobsLoading = false;
        state.jobsError = action.payload;
      })

      .addCase(fetchAdminJobById.pending, (state) => {
        state.jobDetailsLoading = true;
        state.jobDetailsError = null;
      })

      .addCase(fetchAdminJobById.fulfilled, (state, action) => {
        state.jobDetailsLoading = false;
        state.selectedJob = action.payload;
      })

      .addCase(fetchAdminJobById.rejected, (state, action) => {
        state.jobDetailsLoading = false;
        state.jobDetailsError = action.payload;
      })

      .addCase(removeAdminJob.pending, (state) => {
        state.jobActionLoading = true;
        state.jobActionError = null;
      })

      .addCase(removeAdminJob.fulfilled, (state, action) => {
        state.jobActionLoading = false;

        const job = state.jobs.find(
          (item) => item._id === action.payload.jobId,
        );

        if (job) {
          job.status = "closed";
        }

        if (
          state.selectedJob &&
          state.selectedJob._id === action.payload.jobId
        ) {
          state.selectedJob.status = "closed";
        }
      })

      .addCase(removeAdminJob.rejected, (state, action) => {
        state.jobActionLoading = false;
        state.jobActionError = action.payload;
      });

    // ==========================================
    // APPLICATIONS
    // ==========================================

    builder
      .addCase(fetchAdminApplications.pending, (state) => {
        state.applicationsLoading = true;
        state.applicationsError = null;
      })

      .addCase(fetchAdminApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;

        state.applications = action.payload.applications || [];

        state.applicationsPagination = action.payload.pagination || {
          currentPage: 1,
          limit: 10,
          totalApplications: 0,
          totalPages: 0,
        };
      })

      .addCase(fetchAdminApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.applicationsError = action.payload;
      })

      .addCase(fetchAdminApplicationById.pending, (state) => {
        state.applicationDetailsLoading = true;
        state.applicationDetailsError = null;
      })

      .addCase(fetchAdminApplicationById.fulfilled, (state, action) => {
        state.applicationDetailsLoading = false;
        state.selectedApplication = action.payload;
      })

      .addCase(fetchAdminApplicationById.rejected, (state, action) => {
        state.applicationDetailsLoading = false;
        state.applicationDetailsError = action.payload;
      });

    // ==========================================
    // REPORTS
    // ==========================================

    builder
      .addCase(fetchAdminReports.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })

      .addCase(fetchAdminReports.fulfilled, (state, action) => {
        state.reportsLoading = false;

        state.reports = action.payload.reports || [];

        state.pagination = action.payload.pagination || {
          currentPage: 1,
          limit: 10,
          totalReports: 0,
          totalPages: 0,
        };
      })

      .addCase(fetchAdminReports.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload;
      })

      .addCase(fetchAdminReportById.pending, (state) => {
        state.reportDetailsLoading = true;
        state.reportDetailsError = null;
      })

      .addCase(fetchAdminReportById.fulfilled, (state, action) => {
        state.reportDetailsLoading = false;
        state.selectedReport = action.payload;
      })

      .addCase(fetchAdminReportById.rejected, (state, action) => {
        state.reportDetailsLoading = false;
        state.reportDetailsError = action.payload;
      })

      .addCase(updateAdminReportStatus.pending, (state) => {
        state.reportUpdateLoading = true;
        state.reportUpdateError = null;
      })

      .addCase(updateAdminReportStatus.fulfilled, (state, action) => {
        state.reportUpdateLoading = false;

        const updatedReport = action.payload;

        const index = state.reports.findIndex(
          (report) => report._id === updatedReport._id,
        );

        if (index !== -1) {
          state.reports[index] = {
            ...state.reports[index],
            ...updatedReport,
          };
        }

        if (
          state.selectedReport &&
          state.selectedReport._id === updatedReport._id
        ) {
          state.selectedReport = {
            ...state.selectedReport,
            ...updatedReport,
          };
        }
      })

      .addCase(updateAdminReportStatus.rejected, (state, action) => {
        state.reportUpdateLoading = false;
        state.reportUpdateError = action.payload;
      });
  },
});

// ==========================================
// ACTIONS
// ==========================================

export const {
  clearAdminError,
  clearUsersError,
  clearCompaniesError,
  clearJobsError,
  clearApplicationsError,
  clearReportsError,
  clearSelectedUser,
  clearSelectedCompany,
  clearSelectedJob,
  clearSelectedApplication,
  clearSelectedReport,
} = adminSlice.actions;

// Compatibility aliases used by existing admin pages
export const clearUserDetails = clearSelectedUser;
export const clearCompanyDetails = clearSelectedCompany;
export const clearJobDetails = clearSelectedJob;
export const clearApplicationDetails = clearSelectedApplication;
export const clearReportDetails = clearSelectedReport;

// ==========================================
// DASHBOARD SELECTORS
// ==========================================

export const selectAdminDashboard = (state) => state.admin.dashboard;

export const selectAdminDashboardLoading = (state) =>
  state.admin.dashboardLoading;

export const selectAdminDashboardError = (state) => state.admin.dashboardError;

// ==========================================
// USER SELECTORS
// ==========================================

export const selectAdminUsers = (state) => state.admin.users;

export const selectAdminUsersPagination = (state) =>
  state.admin.usersPagination;

export const selectAdminUsersLoading = (state) => state.admin.usersLoading;

export const selectAdminUsersError = (state) => state.admin.usersError;

export const selectAdminUser = (state) => state.admin.selectedUser;

export const selectAdminSelectedUser = (state) => state.admin.selectedUser;

export const selectAdminUserDetailsLoading = (state) =>
  state.admin.userDetailsLoading;

export const selectAdminUserDetailsError = (state) =>
  state.admin.userDetailsError;

export const selectAdminUserActionLoading = (state) =>
  state.admin.userActionLoading;

export const selectAdminUserActionError = (state) =>
  state.admin.userActionError;

// ==========================================
// COMPANY SELECTORS
// ==========================================

export const selectAdminCompanies = (state) => state.admin.companies;

export const selectAdminCompaniesPagination = (state) =>
  state.admin.companiesPagination;

export const selectAdminCompaniesLoading = (state) =>
  state.admin.companiesLoading;

export const selectAdminCompaniesError = (state) => state.admin.companiesError;

export const selectAdminCompany = (state) => state.admin.selectedCompany;

export const selectAdminSelectedCompany = (state) =>
  state.admin.selectedCompany;

export const selectAdminCompanyDetailsLoading = (state) =>
  state.admin.companyDetailsLoading;

export const selectAdminCompanyDetailsError = (state) =>
  state.admin.companyDetailsError;

export const selectAdminCompanyActionLoading = (state) =>
  state.admin.companyActionLoading;

export const selectAdminCompanyActionError = (state) =>
  state.admin.companyActionError;

// ==========================================
// JOB SELECTORS
// ==========================================

export const selectAdminJobs = (state) => state.admin.jobs;

export const selectAdminJobsPagination = (state) => state.admin.jobsPagination;

export const selectAdminJobsLoading = (state) => state.admin.jobsLoading;

export const selectAdminJobsError = (state) => state.admin.jobsError;

export const selectAdminJob = (state) => state.admin.selectedJob;

export const selectAdminSelectedJob = (state) => state.admin.selectedJob;

export const selectAdminJobDetailsLoading = (state) =>
  state.admin.jobDetailsLoading;

export const selectAdminJobDetailsError = (state) =>
  state.admin.jobDetailsError;

export const selectAdminJobActionLoading = (state) =>
  state.admin.jobActionLoading;

export const selectAdminJobActionError = (state) => state.admin.jobActionError;

// ==========================================
// APPLICATION SELECTORS
// ==========================================

export const selectAdminApplications = (state) => state.admin.applications;

export const selectAdminApplicationsPagination = (state) =>
  state.admin.applicationsPagination;

export const selectAdminApplicationsLoading = (state) =>
  state.admin.applicationsLoading;

export const selectAdminApplicationsError = (state) =>
  state.admin.applicationsError;

export const selectAdminApplication = (state) =>
  state.admin.selectedApplication;

export const selectAdminSelectedApplication = (state) =>
  state.admin.selectedApplication;

export const selectAdminApplicationDetailsLoading = (state) =>
  state.admin.applicationDetailsLoading;

export const selectAdminApplicationDetailsError = (state) =>
  state.admin.applicationDetailsError;

// ==========================================
// REPORT SELECTORS
// ==========================================

export const selectAdminReports = (state) => state.admin.reports;

export const selectAdminReportsPagination = (state) => state.admin.pagination;

// Compatibility alias
export const selectAdminPagination = (state) => state.admin.pagination;

export const selectAdminReportsLoading = (state) => state.admin.reportsLoading;

export const selectAdminReportsError = (state) => state.admin.reportsError;

export const selectAdminReport = (state) => state.admin.selectedReport;

export const selectSelectedAdminReport = (state) => state.admin.selectedReport;

export const selectAdminSelectedReport = (state) => state.admin.selectedReport;

export const selectAdminReportDetailsLoading = (state) =>
  state.admin.reportDetailsLoading;

export const selectAdminReportDetailsError = (state) =>
  state.admin.reportDetailsError;

export const selectAdminReportUpdateLoading = (state) =>
  state.admin.reportUpdateLoading;

export const selectAdminReportUpdateError = (state) =>
  state.admin.reportUpdateError;

// ==========================================
// GENERAL SELECTORS
// ==========================================

export const selectAdmin = (state) => state.admin;

export const selectAdminError = (state) => state.admin.error;

// ==========================================
// REDUCER
// ==========================================

export default adminSlice.reducer;
