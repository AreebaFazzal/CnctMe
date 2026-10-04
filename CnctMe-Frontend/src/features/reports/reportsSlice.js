import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

// =========================
// GET MY REPORTS
// =========================
export const fetchMyReports = createAsyncThunk(
  "reports/fetchMyReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports/my-reports");

      return response.data?.reports || [];
    } catch (error) {
      return rejectWithValue(
        getApiError(error) || "Failed to load your reports.",
      );
    }
  },
);

// =========================
// INITIAL STATE
// =========================
const initialState = {
  reports: [],
  loading: false,
  error: null,
};

// =========================
// REPORTS SLICE
// =========================
const reportsSlice = createSlice({
  name: "reports",
  initialState,

  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },

    clearReports: (state) => {
      state.reports = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchMyReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load your reports.";
      });
  },
});

export const { clearReportsError, clearReports } = reportsSlice.actions;

// =========================
// SELECTORS
// =========================
export const selectReports = (state) => state.reports?.reports || [];

export const selectReportsLoading = (state) => state.reports?.loading || false;

export const selectReportsError = (state) => state.reports?.error || null;

export default reportsSlice.reducer;
