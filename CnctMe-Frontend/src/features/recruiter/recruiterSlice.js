import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

// ==================================================
// DEFAULT SETTINGS
// ==================================================

const defaultSettings = {
  emailNotifications: true,
  applicationNotifications: true,
  interviewNotifications: true,
};

// ==================================================
// INITIAL STATE
// ==================================================

const initialState = {
  // Dashboard
  dashboard: null,
  recentJobs: [],
  recentApplicants: [],
  upcomingInterviews: [],
  analytics: null,

  // Profile
  profile: null,
  profileLoading: false,
  profileUpdating: false,
  profileError: null,

  // Settings
  settings: null,
  settingsLoading: false,
  settingsUpdating: false,
  settingsError: null,

  // Password
  passwordChanging: false,
  passwordChangeError: null,

  // Account
  accountDeleting: false,
  accountDeleteError: null,

  // Jobs
  myJobs: [],
  myJobsPagination: null,

  // Applications
  jobApplicants: [],
  currentApplicant: null,

  // Candidate profile
  currentCandidateProfile: null,

  // Interviews
  createdInterview: null,
  interviews: [],

  // Loading states
  loading: false,
  applicationsLoading: false,
  applicantDetailsLoading: false,
  candidateProfileLoading: false,
  statusUpdating: false,
  closeJobLoading: false,

  createInterviewLoading: false,
  interviewsLoading: false,
  updateInterviewLoading: false,
  completeInterviewLoading: false,
  cancelInterviewLoading: false,
  rescheduleInterviewLoading: false,

  // Errors
  error: null,
  applicationsError: null,
  applicantDetailsError: null,
  candidateProfileError: null,

  createInterviewError: null,
  interviewsError: null,
  updateInterviewError: null,
  completeInterviewError: null,
  cancelInterviewError: null,
  rescheduleInterviewError: null,
};

// ==================================================
// DASHBOARD
// ==================================================

export const getDashboard = createAsyncThunk(
  "recruiter/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/recruiter/dashboard");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getRecentJobs = createAsyncThunk(
  "recruiter/getRecentJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/recruiter/recent-jobs");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getRecentApplicants = createAsyncThunk(
  "recruiter/getRecentApplicants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/recruiter/recent-applicants");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getUpcomingInterviews = createAsyncThunk(
  "recruiter/getUpcomingInterviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/recruiter/upcoming-interviews");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getRecruiterAnalytics = createAsyncThunk(
  "recruiter/getRecruiterAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/recruiter/analytics");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// JOBS
// ==================================================

export const closeJob = createAsyncThunk(
  "recruiter/closeJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/jobs/${jobId}/close`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getMyJobs = createAsyncThunk(
  "recruiter/getMyJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/jobs/my-jobs");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const deleteJob = createAsyncThunk(
  "recruiter/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);

      return {
        ...response.data,
        jobId,
      };
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// APPLICATIONS
// ==================================================

export const getJobApplicants = createAsyncThunk(
  "recruiter/getJobApplicants",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${jobId}/applications`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getApplicantDetails = createAsyncThunk(
  "recruiter/getApplicantDetails",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/recruiter/applications/${applicationId}`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  "recruiter/updateApplicationStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/applications/${applicationId}/status`, {
        status,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getApplicantResume = createAsyncThunk(
  "recruiter/getApplicantResume",
  async ({ applicationId, download = false }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/recruiter/applications/${applicationId}/resume`,
        {
          responseType: "blob",
        },
      );

      const contentType = response.headers["content-type"] || "application/pdf";

      const blob = new Blob([response.data], {
        type: contentType,
      });

      const url = window.URL.createObjectURL(blob);

      if (download) {
        const contentDisposition = response.headers["content-disposition"];

        let fileName = "resume";

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/i);

          if (match?.[1]) {
            fileName = match[1];
          }
        }

        const link = document.createElement("a");

        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        return;
      }

      window.open(url, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// CANDIDATE PROFILE
// ==================================================
export const getApplicantProfile = createAsyncThunk(
  "recruiter/getApplicantProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const userId = typeof payload === "string" ? payload : payload.userId;
      const isAdmin = typeof payload === "object" && payload.isAdmin;

      const url = isAdmin
        ? `/users/recruiter/profile/${userId}` // your existing admin URL
        : `/recruiter/candidates/${userId}`;

      const response = await api.get(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// INTERVIEWS
// ==================================================

export const createInterview = createAsyncThunk(
  "recruiter/createInterview",
  async ({ applicationId, date, time, meetingLink }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/interviews/applications/${applicationId}`,
        {
          date,
          time,
          meetingLink,
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getAllInterviews = createAsyncThunk(
  "recruiter/getAllInterviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/interviews");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const getInterview = createAsyncThunk(
  "recruiter/getInterview",
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/interviews/${interviewId}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const updateInterview = createAsyncThunk(
  "recruiter/updateInterview",
  async ({ interviewId, date, time, meetingLink }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/interviews/${interviewId}`, {
        date,
        time,
        meetingLink,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const completeInterview = createAsyncThunk(
  "recruiter/completeInterview",
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/interviews/${interviewId}/complete`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const cancelInterview = createAsyncThunk(
  "recruiter/cancelInterview",
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/interviews/${interviewId}/cancel`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// RESCHEDULE INTERVIEW
// ==================================================

export const rescheduleInterview = createAsyncThunk(
  "recruiter/rescheduleInterview",
  async ({ interviewId, date, time, meetingLink }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/interviews/${interviewId}/reschedule`,
        {
          date,
          time,
          meetingLink,
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// RECRUITER PROFILE
// ==================================================

export const getRecruiterProfile = createAsyncThunk(
  "recruiter/getRecruiterProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/profile");

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const updateRecruiterProfile = createAsyncThunk(
  "recruiter/updateRecruiterProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put("/users/profile", formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// RECRUITER SETTINGS
// ==================================================

export const updateRecruiterSettings = createAsyncThunk(
  "recruiter/updateRecruiterSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const response = await api.patch("/users/settings", settings);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// CHANGE PASSWORD
// ==================================================

export const changeRecruiterPassword = createAsyncThunk(
  "recruiter/changeRecruiterPassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.patch("/users/change-password", {
        currentPassword,
        newPassword,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// DELETE RECRUITER ACCOUNT
// ==================================================

export const deleteRecruiterAccount = createAsyncThunk(
  "recruiter/deleteRecruiterAccount",
  async (confirmation, { rejectWithValue }) => {
    try {
      const response = await api.delete("/users/account", {
        data: {
          confirmation,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==================================================
// SLICE
// ==================================================

const recruiterSlice = createSlice({
  name: "recruiter",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
      state.applicationsError = null;
      state.applicantDetailsError = null;
      state.candidateProfileError = null;

      state.profileError = null;
      state.settingsError = null;
      state.passwordChangeError = null;
      state.accountDeleteError = null;

      state.createInterviewError = null;
      state.interviewsError = null;
      state.updateInterviewError = null;
      state.completeInterviewError = null;
      state.cancelInterviewError = null;
      state.rescheduleInterviewError = null;
    },

    clearCurrentApplicant: (state) => {
      state.currentApplicant = null;
      state.applicantDetailsError = null;
    },

    clearCandidateProfile: (state) => {
      state.currentCandidateProfile = null;
      state.candidateProfileLoading = false;
      state.candidateProfileError = null;
    },

    clearCreatedInterview: (state) => {
      state.createdInterview = null;
      state.createInterviewError = null;
    },
  },

  extraReducers: (builder) => {
    // ==================================================
    // DASHBOARD
    // ==================================================

    builder
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.dashboard = action.payload.dashboard || null;
      })

      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to load recruiter dashboard.",
        };
      });

    builder
      .addCase(getRecentJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getRecentJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.recentJobs = action.payload.jobs || [];
      })

      .addCase(getRecentJobs.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to load recent jobs.",
        };
      });

    builder
      .addCase(getRecentApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getRecentApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.recentApplicants = action.payload.applicants || [];
      })

      .addCase(getRecentApplicants.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to load recent applicants.",
        };
      });

    builder
      .addCase(getUpcomingInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUpcomingInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.upcomingInterviews = action.payload.interviews || [];
      })

      .addCase(getUpcomingInterviews.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to load upcoming interviews.",
        };
      });

    builder
      .addCase(getRecruiterAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getRecruiterAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.analytics = action.payload.analytics || null;
      })

      .addCase(getRecruiterAnalytics.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to load recruiter analytics.",
        };
      });

    // ==================================================
    // JOBS
    // ==================================================

    builder
      .addCase(getMyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.myJobs = action.payload.jobs || [];

        state.myJobsPagination = {
          totalJobs: action.payload.totalJobs || 0,
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          totalPages: action.payload.totalPages || 1,
        };
      })

      .addCase(getMyJobs.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to load your jobs.",
        };
      });

    builder
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.myJobs = state.myJobs.filter(
          (job) => job._id !== action.payload.jobId,
        );

        if (state.myJobsPagination) {
          state.myJobsPagination.totalJobs = Math.max(
            0,
            state.myJobsPagination.totalJobs - 1,
          );

          state.myJobsPagination.totalPages = Math.max(
            1,
            Math.ceil(
              state.myJobsPagination.totalJobs / state.myJobsPagination.limit,
            ),
          );
        }
      })

      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          general: "Unable to delete the job.",
        };
      });

    // ==================================================
    // APPLICATIONS
    // ==================================================

    builder
      .addCase(getJobApplicants.pending, (state) => {
        state.applicationsLoading = true;
        state.applicationsError = null;
      })

      .addCase(getJobApplicants.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.applicationsError = null;

        state.jobApplicants = action.payload.applications || [];
      })

      .addCase(getJobApplicants.rejected, (state, action) => {
        state.applicationsLoading = false;

        state.applicationsError = action.payload || {
          general: "Unable to load applicants.",
        };

        state.jobApplicants = [];
      });

    builder
      .addCase(getApplicantDetails.pending, (state) => {
        state.applicantDetailsLoading = true;
        state.applicantDetailsError = null;
      })

      .addCase(getApplicantDetails.fulfilled, (state, action) => {
        state.applicantDetailsLoading = false;
        state.applicantDetailsError = null;

        state.currentApplicant = action.payload.application || null;
      })

      .addCase(getApplicantDetails.rejected, (state, action) => {
        state.applicantDetailsLoading = false;

        state.applicantDetailsError = action.payload || {
          general: "Unable to load applicant details.",
        };

        state.currentApplicant = null;
      });

    // ==================================================
    // UPDATE APPLICATION STATUS
    // ==================================================

    builder
      .addCase(updateApplicationStatus.pending, (state) => {
        state.statusUpdating = true;
        state.applicationsError = null;
      })

      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.statusUpdating = false;
        state.applicationsError = null;

        const updatedApplication = action.payload.application;

        if (!updatedApplication) {
          return;
        }

        const updatedId = updatedApplication._id || updatedApplication.id;

        const index = state.jobApplicants.findIndex(
          (application) =>
            application._id === updatedId || application.id === updatedId,
        );

        if (index !== -1) {
          state.jobApplicants[index] = {
            ...state.jobApplicants[index],
            ...updatedApplication,
            _id: updatedId,
          };
        }

        if (state.currentApplicant) {
          const currentId =
            state.currentApplicant._id || state.currentApplicant.id;

          if (currentId === updatedId) {
            state.currentApplicant = {
              ...state.currentApplicant,
              ...updatedApplication,
              _id: updatedId,
            };
          }
        }
      })

      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.statusUpdating = false;

        state.applicationsError = action.payload || {
          general: "Unable to update application status.",
        };
      });

    // ==================================================
    // CANDIDATE PROFILE
    // ==================================================

    builder
      .addCase(getApplicantProfile.pending, (state) => {
        state.candidateProfileLoading = true;
        state.candidateProfileError = null;
        state.currentCandidateProfile = null;
      })

      .addCase(getApplicantProfile.fulfilled, (state, action) => {
        state.candidateProfileLoading = false;
        state.candidateProfileError = null;

        state.currentCandidateProfile = action.payload.profile || null;
      })

      .addCase(getApplicantProfile.rejected, (state, action) => {
        state.candidateProfileLoading = false;

        state.candidateProfileError = action.payload || {
          general: "Unable to load candidate profile.",
        };

        state.currentCandidateProfile = null;
      });

    // ==================================================
    // CREATE INTERVIEW
    // ==================================================

    builder
      .addCase(createInterview.pending, (state) => {
        state.createInterviewLoading = true;
        state.createInterviewError = null;
      })

      .addCase(createInterview.fulfilled, (state, action) => {
        state.createInterviewLoading = false;
        state.createInterviewError = null;

        state.createdInterview = action.payload.interview || null;

        if (action.payload.interview) {
          state.interviews.unshift(action.payload.interview);
        }
      })

      .addCase(createInterview.rejected, (state, action) => {
        state.createInterviewLoading = false;

        state.createInterviewError = action.payload || {
          general: "Unable to schedule interview.",
        };
      });

    // ==================================================
    // GET ALL INTERVIEWS
    // ==================================================

    builder
      .addCase(getAllInterviews.pending, (state) => {
        state.interviewsLoading = true;
        state.interviewsError = null;
      })

      .addCase(getAllInterviews.fulfilled, (state, action) => {
        state.interviewsLoading = false;
        state.interviewsError = null;

        state.interviews = action.payload.interviews || [];
      })

      .addCase(getAllInterviews.rejected, (state, action) => {
        state.interviewsLoading = false;

        state.interviewsError = action.payload || {
          general: "Unable to load interviews.",
        };

        state.interviews = [];
      });

    // ==================================================
    // UPDATE INTERVIEW
    // ==================================================

    builder
      .addCase(updateInterview.pending, (state) => {
        state.updateInterviewLoading = true;
        state.updateInterviewError = null;
      })

      .addCase(updateInterview.fulfilled, (state, action) => {
        state.updateInterviewLoading = false;
        state.updateInterviewError = null;

        const updatedInterview = action.payload.interview;

        if (!updatedInterview) {
          return;
        }

        const index = state.interviews.findIndex(
          (interview) => interview._id === updatedInterview._id,
        );

        if (index !== -1) {
          state.interviews[index] = updatedInterview;
        }
      })

      .addCase(updateInterview.rejected, (state, action) => {
        state.updateInterviewLoading = false;

        state.updateInterviewError = action.payload || {
          general: "Unable to update interview.",
        };
      });

    // ==================================================
    // COMPLETE INTERVIEW
    // ==================================================

    builder
      .addCase(completeInterview.pending, (state) => {
        state.completeInterviewLoading = true;
        state.completeInterviewError = null;
      })

      .addCase(completeInterview.fulfilled, (state, action) => {
        state.completeInterviewLoading = false;
        state.completeInterviewError = null;

        const completedInterview = action.payload.interview;

        if (!completedInterview) {
          return;
        }

        const index = state.interviews.findIndex(
          (interview) => interview._id === completedInterview._id,
        );

        if (index !== -1) {
          state.interviews[index] = completedInterview;
        }
      })

      .addCase(completeInterview.rejected, (state, action) => {
        state.completeInterviewLoading = false;

        state.completeInterviewError = action.payload || {
          general: "Unable to complete interview.",
        };
      });

    // ==================================================
    // CANCEL INTERVIEW
    // ==================================================

    builder
      .addCase(cancelInterview.pending, (state) => {
        state.cancelInterviewLoading = true;
        state.cancelInterviewError = null;
      })

      .addCase(cancelInterview.fulfilled, (state, action) => {
        state.cancelInterviewLoading = false;
        state.cancelInterviewError = null;

        const cancelledInterview = action.payload.interview;

        if (!cancelledInterview) {
          return;
        }

        const index = state.interviews.findIndex(
          (interview) => interview._id === cancelledInterview._id,
        );

        if (index !== -1) {
          state.interviews[index] = cancelledInterview;
        }
      })

      .addCase(cancelInterview.rejected, (state, action) => {
        state.cancelInterviewLoading = false;

        state.cancelInterviewError = action.payload || {
          general: "Unable to cancel interview.",
        };
      });

    // ==================================================
    // RESCHEDULE INTERVIEW
    // ==================================================

    builder
      .addCase(rescheduleInterview.pending, (state) => {
        state.rescheduleInterviewLoading = true;
        state.rescheduleInterviewError = null;
      })

      .addCase(rescheduleInterview.fulfilled, (state, action) => {
        state.rescheduleInterviewLoading = false;
        state.rescheduleInterviewError = null;

        const updatedInterview = action.payload.interview;

        if (!updatedInterview) {
          return;
        }

        const index = state.interviews.findIndex(
          (interview) => interview._id === updatedInterview._id,
        );

        if (index !== -1) {
          state.interviews[index] = updatedInterview;
        } else {
          state.interviews.unshift(updatedInterview);
        }
      })

      .addCase(rescheduleInterview.rejected, (state, action) => {
        state.rescheduleInterviewLoading = false;

        state.rescheduleInterviewError = action.payload || {
          general: "Unable to reschedule interview.",
        };
      });

    // ==================================================
    // CLOSE JOB
    // ==================================================

    builder
      .addCase(closeJob.pending, (state) => {
        state.closeJobLoading = true;
        state.error = null;
      })

      .addCase(closeJob.fulfilled, (state, action) => {
        state.closeJobLoading = false;
        state.error = null;

        const closedJob = action.payload.job;

        if (!closedJob) {
          return;
        }

        const index = state.myJobs.findIndex(
          (job) => job._id === closedJob._id,
        );

        if (index !== -1) {
          state.myJobs[index] = {
            ...state.myJobs[index],
            ...closedJob,
          };
        }
      })

      .addCase(closeJob.rejected, (state, action) => {
        state.closeJobLoading = false;

        state.error = action.payload || {
          general: "Unable to close the job.",
        };
      });

    // ==================================================
    // RECRUITER PROFILE
    // ==================================================

    builder
      .addCase(getRecruiterProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
        state.settingsLoading = true;
        state.settingsError = null;
      })

      .addCase(getRecruiterProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileError = null;

        state.settingsLoading = false;
        state.settingsError = null;

        state.profile = action.payload.user || null;

        state.settings = action.payload.user?.settings || defaultSettings;
      })

      .addCase(getRecruiterProfile.rejected, (state, action) => {
        state.profileLoading = false;

        state.profileError = action.payload || {
          general: "Unable to load your profile.",
        };

        state.settingsLoading = false;

        state.settingsError = action.payload || {
          general: "Unable to load your settings.",
        };

        state.profile = null;
        state.settings = null;
      });

    // ==================================================
    // UPDATE RECRUITER PROFILE
    // ==================================================

    builder
      .addCase(updateRecruiterProfile.pending, (state) => {
        state.profileUpdating = true;
        state.profileError = null;
      })

      .addCase(updateRecruiterProfile.fulfilled, (state, action) => {
        state.profileUpdating = false;
        state.profileError = null;

        state.profile = action.payload.user || null;

        if (action.payload.user?.settings) {
          state.settings = action.payload.user.settings;
        }
      })

      .addCase(updateRecruiterProfile.rejected, (state, action) => {
        state.profileUpdating = false;

        state.profileError = action.payload || {
          general: "Unable to update your profile.",
        };
      });

    // ==================================================
    // UPDATE SETTINGS
    // ==================================================

    builder
      .addCase(updateRecruiterSettings.pending, (state) => {
        state.settingsUpdating = true;
        state.settingsError = null;
      })

      .addCase(updateRecruiterSettings.fulfilled, (state, action) => {
        state.settingsUpdating = false;
        state.settingsError = null;

        state.settings = action.payload.settings || defaultSettings;

        if (state.profile) {
          state.profile.settings = action.payload.settings || defaultSettings;
        }
      })

      .addCase(updateRecruiterSettings.rejected, (state, action) => {
        state.settingsUpdating = false;

        state.settingsError = action.payload || {
          general: "Unable to update settings.",
        };
      });

    // ==================================================
    // CHANGE PASSWORD
    // ==================================================

    builder
      .addCase(changeRecruiterPassword.pending, (state) => {
        state.passwordChanging = true;
        state.passwordChangeError = null;
      })

      .addCase(changeRecruiterPassword.fulfilled, (state) => {
        state.passwordChanging = false;
        state.passwordChangeError = null;
      })

      .addCase(changeRecruiterPassword.rejected, (state, action) => {
        state.passwordChanging = false;

        state.passwordChangeError = action.payload || {
          general: "Unable to change password.",
        };
      });

    // ==================================================
    // DELETE ACCOUNT
    // ==================================================

    builder
      .addCase(deleteRecruiterAccount.pending, (state) => {
        state.accountDeleting = true;
        state.accountDeleteError = null;
      })

      .addCase(deleteRecruiterAccount.fulfilled, (state) => {
        state.accountDeleting = false;
        state.accountDeleteError = null;

        state.profile = null;
        state.settings = null;
        state.dashboard = null;
        state.myJobs = [];
        state.myJobsPagination = null;
        state.jobApplicants = [];
        state.currentApplicant = null;
        state.currentCandidateProfile = null;
        state.interviews = [];
        state.createdInterview = null;
      })

      .addCase(deleteRecruiterAccount.rejected, (state, action) => {
        state.accountDeleting = false;

        state.accountDeleteError = action.payload || {
          general: "Unable to delete your account.",
        };
      });
  },
});

export const {
  clearError,
  clearCurrentApplicant,
  clearCandidateProfile,
  clearCreatedInterview,
} = recruiterSlice.actions;

// ==================================================
// SELECTORS
// ==================================================

// DASHBOARD SELECTORS
export const selectDashboard = (state) => state.recruiter.dashboard;

export const selectDashboardLoading = (state) => state.recruiter.loading;

export const selectDashboardError = (state) => state.recruiter.error;

export const selectTotalJobs = (state) =>
  state.recruiter.dashboard?.totalJobs || 0;

export const selectActiveJobs = (state) =>
  state.recruiter.dashboard?.activeJobs || 0;

export const selectClosedJobs = (state) =>
  state.recruiter.dashboard?.closedJobs || 0;

export const selectTotalApplicants = (state) =>
  state.recruiter.dashboard?.totalApplicants || 0;

export const selectShortlistedApplicants = (state) =>
  state.recruiter.dashboard?.shortlistedApplicants || 0;

export const selectInterview = (state) =>
  state.recruiter.dashboard?.interview || 0;

export const selectSelectedCandidates = (state) =>
  state.recruiter.dashboard?.selectedCandidates || 0;

// RECENT
export const selectRecentJobs = (state) => state.recruiter.recentJobs;

export const selectRecentApplicants = (state) =>
  state.recruiter.recentApplicants;

export const selectUpcomingInterviews = (state) =>
  state.recruiter.upcomingInterviews;

// ANALYTICS
export const selectApplicationsTrend = (state) =>
  state.recruiter.analytics?.applicationsTrend || [];

export const selectApplicationStatus = (state) =>
  state.recruiter.analytics?.applicationStatus || [];

export const selectJobPerformance = (state) =>
  state.recruiter.analytics?.jobPerformance || [];

// MY JOBS
export const selectMyJobs = (state) => state.recruiter.myJobs;

export const selectMyJobsLoading = (state) => state.recruiter.loading;

export const selectMyJobsError = (state) => state.recruiter.error;

export const selectMyJobsPagination = (state) =>
  state.recruiter.myJobsPagination;

// APPLICATIONS
export const selectJobApplicants = (state) => state.recruiter.jobApplicants;

export const selectApplicationsLoading = (state) =>
  state.recruiter.applicationsLoading;

export const selectApplicationsError = (state) =>
  state.recruiter.applicationsError;

export const selectCurrentApplicant = (state) =>
  state.recruiter.currentApplicant;

export const selectApplicantDetailsLoading = (state) =>
  state.recruiter.applicantDetailsLoading;

export const selectApplicantDetailsError = (state) =>
  state.recruiter.applicantDetailsError;

export const selectStatusUpdating = (state) => state.recruiter.statusUpdating;

// CANDIDATE PROFILE
export const selectCurrentCandidateProfile = (state) =>
  state.recruiter.currentCandidateProfile;

export const selectCandidateProfileLoading = (state) =>
  state.recruiter.candidateProfileLoading;

export const selectCandidateProfileError = (state) =>
  state.recruiter.candidateProfileError;

// INTERVIEWS
export const selectCreatedInterview = (state) =>
  state.recruiter.createdInterview;

export const selectCreateInterviewLoading = (state) =>
  state.recruiter.createInterviewLoading;

export const selectCreateInterviewError = (state) =>
  state.recruiter.createInterviewError;

export const selectInterviews = (state) => state.recruiter.interviews;

export const selectInterviewsLoading = (state) =>
  state.recruiter.interviewsLoading;

export const selectInterviewsError = (state) => state.recruiter.interviewsError;

export const selectUpdateInterviewLoading = (state) =>
  state.recruiter.updateInterviewLoading;

export const selectUpdateInterviewError = (state) =>
  state.recruiter.updateInterviewError;

export const selectCompleteInterviewLoading = (state) =>
  state.recruiter.completeInterviewLoading;

export const selectCompleteInterviewError = (state) =>
  state.recruiter.completeInterviewError;

export const selectCancelInterviewLoading = (state) =>
  state.recruiter.cancelInterviewLoading;

export const selectCancelInterviewError = (state) =>
  state.recruiter.cancelInterviewError;

export const selectRescheduleInterviewLoading = (state) =>
  state.recruiter.rescheduleInterviewLoading;

export const selectRescheduleInterviewError = (state) =>
  state.recruiter.rescheduleInterviewError;

export const selectTotalInterviews = (state) =>
  state.recruiter.dashboard?.interviews || 0;

export const selectCloseJobLoading = (state) => state.recruiter.closeJobLoading;

// PROFILE
export const selectRecruiterProfile = (state) => state.recruiter.profile;

export const selectRecruiterProfileLoading = (state) =>
  state.recruiter.profileLoading;

export const selectRecruiterProfileUpdating = (state) =>
  state.recruiter.profileUpdating;

export const selectRecruiterProfileError = (state) =>
  state.recruiter.profileError;

// SETTINGS
export const selectRecruiterSettings = (state) => state.recruiter.settings;

export const selectRecruiterSettingsLoading = (state) =>
  state.recruiter.settingsLoading;

export const selectRecruiterSettingsUpdating = (state) =>
  state.recruiter.settingsUpdating;

export const selectRecruiterSettingsError = (state) =>
  state.recruiter.settingsError;

// PASSWORD
export const selectPasswordChanging = (state) =>
  state.recruiter.passwordChanging;

export const selectPasswordChangeError = (state) =>
  state.recruiter.passwordChangeError;

// DELETE ACCOUNT
export const selectAccountDeleting = (state) => state.recruiter.accountDeleting;

export const selectAccountDeleteError = (state) =>
  state.recruiter.accountDeleteError;

export default recruiterSlice.reducer;
