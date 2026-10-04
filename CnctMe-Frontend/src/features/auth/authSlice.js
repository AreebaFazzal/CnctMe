import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

// ============================================================
// Get Stored Authentication Data
// ============================================================

const storedToken = localStorage.getItem("accessToken");

const storedUser = localStorage.getItem("user");

// ============================================================
// Parse Stored User
// ============================================================

let parsedUser = null;

if (storedUser) {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch (error) {
    console.log("Unable to parse stored user:", error);

    localStorage.removeItem("user");

    parsedUser = null;
  }
}

// ============================================================
// Initial State
// ============================================================

const initialState = {
  accessToken: storedToken || null,

  user: parsedUser,

  isAuthenticated: Boolean(parsedUser),

  loading: false,

  error: null,
};

// ============================================================
// Login Async Thunk
// ============================================================

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      const { accessToken, user } = response.data;

      dispatch(
        loginSuccess({
          accessToken,
          user,
        }),
      );

      return {
        accessToken,
        user,
      };
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ============================================================
// Logout Async Thunk
// ============================================================

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",

  async (_, { dispatch }) => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logout());
    }
  },
);

// ============================================================
// Register Async Thunk
// ============================================================

export const registerUser = createAsyncThunk(
  "auth/registerUser",

  async (
    { firstName, lastName, email, password, confirmPassword, role },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/users/register", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  },
);

// ============================================================
// Auth Slice
// ============================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // ========================================================
    // Login Success
    // ========================================================

    loginSuccess: (state, action) => {
      const { accessToken, user } = action.payload;

      state.accessToken = accessToken;

      state.user = user;

      state.isAuthenticated = true;

      state.error = null;

      // ------------------------------------------------------
      // Store authentication data
      // ------------------------------------------------------

      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem("user", JSON.stringify(user));
    },

    // ========================================================
    // Logout
    // ========================================================

    logout: (state) => {
      state.accessToken = null;

      state.user = null;

      state.isAuthenticated = false;

      state.error = null;

      // ------------------------------------------------------
      // Remove authentication data
      // ------------------------------------------------------

      localStorage.removeItem("accessToken");

      localStorage.removeItem("user");
    },

    // ========================================================
    // Update User
    // ========================================================

    updateUser: (state, action) => {
      state.user = action.payload;

      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    // ========================================================
    // Update Access Token
    // ========================================================

    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;

      localStorage.setItem("accessToken", action.payload);
    },

    // ========================================================
    // Clear Auth Error
    // ========================================================

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  // ==========================================================
  // Async Thunk States
  // ==========================================================

  extraReducers: (builder) => {
    // ========================================================
    // LOGIN
    // ========================================================

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;

      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state) => {
      state.loading = false;

      state.error = null;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;

      state.error = action.payload || {
        general: "Unable to login. Please try again.",
      };
    });

    // ========================================================
    // REGISTER
    // ========================================================

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;

      state.error = null;
    });

    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;

      state.error = null;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;

      state.error = action.payload || {
        general: "Unable to create your account. Please try again.",
      };
    });

    // ========================================================
    // LOGOUT
    // ========================================================

    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;

      state.error = null;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;

      state.error = null;
    });

    builder.addCase(logoutUser.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  loginSuccess,
  logout,
  updateUser,
  updateAccessToken,
  clearAuthError,
} = authSlice.actions;

// ============================================================
// Selectors
// ============================================================

export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectAccessToken = (state) => state.auth.accessToken;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
