import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

// ==========================================
// GET PUBLIC USERS
// ==========================================

export const getPublicUsers = createAsyncThunk(
  "people/getPublicUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/public", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ==========================================
// GET PUBLIC USER PROFILE
// ==========================================

export const getPublicUserProfile = createAsyncThunk(
  "people/getPublicUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/public/${userId}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

export const fetchPeople = getPublicUsers;

export const fetchPublicUserProfile = getPublicUserProfile;

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  users: [],

  currentProfile: null,

  loading: false,

  profileLoading: false,

  error: null,

  profileError: null,

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

// ==========================================
// SLICE
// ==========================================

const peopleSlice = createSlice({
  name: "people",

  initialState,

  reducers: {
    clearPublicUserProfile: (state) => {
      state.currentProfile = null;
      state.profileLoading = false;
      state.profileError = null;
    },

    clearPeopleError: (state) => {
      state.error = null;
    },

    clearPublicUserProfileError: (state) => {
      state.profileError = null;
    },

    clearPeople: (state) => {
      state.users = [];
      state.error = null;

      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // PUBLIC USERS
      // ==========================================

      .addCase(getPublicUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPublicUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.users = action.payload?.users || [];

        state.pagination = {
          currentPage: action.payload?.pagination?.currentPage || 1,
          totalPages: action.payload?.pagination?.totalPages || 1,
          totalUsers: action.payload?.pagination?.totalUsers || 0,
          hasNextPage: action.payload?.pagination?.hasNextPage || false,
          hasPreviousPage: action.payload?.pagination?.hasPreviousPage || false,
        };
      })

      .addCase(getPublicUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load people.";

        state.users = [];

        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          totalUsers: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      })

      // ==========================================
      // PUBLIC PROFILE
      // ==========================================

      .addCase(getPublicUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
        state.currentProfile = null;
      })

      .addCase(getPublicUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileError = null;
        state.currentProfile = action.payload?.profile || null;
      })

      .addCase(getPublicUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || "Failed to load profile.";
        state.currentProfile = null;
      });
  },
});

export const {
  clearPublicUserProfile,
  clearPeopleError,
  clearPublicUserProfileError,
  clearPeople,
} = peopleSlice.actions;

// ==========================================
// SELECTORS
// ==========================================

export const selectPeople = (state) => state.people?.users || [];

export const selectPeopleLoading = (state) => state.people?.loading || false;

export const selectPeopleError = (state) => state.people?.error || null;

export const selectPeoplePagination = (state) =>
  state.people?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

export const selectPublicUserProfile = (state) =>
  state.people?.currentProfile || null;

export const selectPublicUserProfileLoading = (state) =>
  state.people?.profileLoading || false;

export const selectPublicUserProfileError = (state) =>
  state.people?.profileError || null;

export default peopleSlice.reducer;
