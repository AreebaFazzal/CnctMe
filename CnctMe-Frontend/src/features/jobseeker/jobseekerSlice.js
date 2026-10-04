import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

const initialState = {
  dashboard: {
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    interviewApplications: 0,
    selectedApplications: 0,
    savedJobs: 0,
    applicationsTrend: [],
    applicationStatus: [],
  },

  recentApplications: [],
  recentApplicationsLoading: false,
  recentApplicationsError: null,

  upcomingInterviews: [],
  upcomingInterviewsLoading: false,
  upcomingInterviewsError: null,

  loading: false,
  error: null,
};

export const getJobseekerDashboard = createAsyncThunk(
  "jobseeker/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/jobseeker");

      return response.data.dashboard;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getRecentApplications = createAsyncThunk(
  "jobseeker/getRecentApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/applications/my", {
        params: {
          page: 1,
          limit: 5,
        },
      });

      return response.data.applications;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getUpcomingInterviews = createAsyncThunk(
  "jobseeker/getUpcomingInterviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/interviews/my/upcoming");

      return response.data.interviews;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

const jobseekerSlice = createSlice({
  name: "jobseeker",

  initialState,

  reducers: {
    clearJobseekerError: (state) => {
      state.error = null;
    },

    clearRecentApplicationsError: (state) => {
      state.recentApplicationsError = null;
    },

    clearUpcomingInterviewsError: (state) => {
      state.upcomingInterviewsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Jobseeker Dashboard
      .addCase(getJobseekerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getJobseekerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })

      .addCase(getJobseekerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Recent Applications
      .addCase(getRecentApplications.pending, (state) => {
        state.recentApplicationsLoading = true;
        state.recentApplicationsError = null;
      })

      .addCase(getRecentApplications.fulfilled, (state, action) => {
        state.recentApplicationsLoading = false;
        state.recentApplications = action.payload;
      })

      .addCase(getRecentApplications.rejected, (state, action) => {
        state.recentApplicationsLoading = false;
        state.recentApplicationsError = action.payload;
      })

      // Upcoming Interviews
      .addCase(getUpcomingInterviews.pending, (state) => {
        state.upcomingInterviewsLoading = true;
        state.upcomingInterviewsError = null;
      })

      .addCase(getUpcomingInterviews.fulfilled, (state, action) => {
        state.upcomingInterviewsLoading = false;
        state.upcomingInterviews = action.payload;
      })

      .addCase(getUpcomingInterviews.rejected, (state, action) => {
        state.upcomingInterviewsLoading = false;
        state.upcomingInterviewsError = action.payload;
      });
  },
});

export const selectJobseekerDashboard = (state) => state.jobseeker.dashboard;

export const selectJobseekerDashboardLoading = (state) =>
  state.jobseeker.loading;

export const selectJobseekerDashboardError = (state) => state.jobseeker.error;

export const selectTotalApplications = (state) =>
  state.jobseeker.dashboard.totalApplications;

export const selectPendingApplications = (state) =>
  state.jobseeker.dashboard.pendingApplications;

export const selectShortlistedApplications = (state) =>
  state.jobseeker.dashboard.shortlistedApplications;

export const selectInterviewApplications = (state) =>
  state.jobseeker.dashboard.interviewApplications;

export const selectSelectedApplications = (state) =>
  state.jobseeker.dashboard.selectedApplications;

export const selectSavedJobs = (state) => state.jobseeker.dashboard.savedJobs;

export const selectApplicationsTrend = (state) =>
  state.jobseeker.dashboard.applicationsTrend;

export const selectApplicationStatus = (state) =>
  state.jobseeker.dashboard.applicationStatus;

export const selectRecentApplications = (state) =>
  state.jobseeker.recentApplications;

export const selectRecentApplicationsLoading = (state) =>
  state.jobseeker.recentApplicationsLoading;

export const selectRecentApplicationsError = (state) =>
  state.jobseeker.recentApplicationsError;

export const selectUpcomingInterviews = (state) =>
  state.jobseeker.upcomingInterviews;

export const selectUpcomingInterviewsLoading = (state) =>
  state.jobseeker.upcomingInterviewsLoading;

export const selectUpcomingInterviewsError = (state) =>
  state.jobseeker.upcomingInterviewsError;

export const {
  clearJobseekerError,
  clearRecentApplicationsError,
  clearUpcomingInterviewsError,
} = jobseekerSlice.actions;

export default jobseekerSlice.reducer;
