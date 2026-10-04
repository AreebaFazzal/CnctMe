import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

// ==========================================
// HELPER
// ==========================================

const getNotificationsFromResponse = (response) => {
  const data = response?.data;

  if (Array.isArray(data?.notifications)) {
    return data.notifications;
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

// ==========================================
// FETCH ALL NOTIFICATIONS
// ==========================================

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications");

      const notifications = getNotificationsFromResponse(response);

      return notifications;
    } catch (error) {
      return rejectWithValue(
        getApiError(error) || "Failed to load notifications.",
      );
    }
  },
);

// ==========================================
// FETCH UNREAD NOTIFICATIONS
// ==========================================

export const fetchUnreadNotifications = createAsyncThunk(
  "notifications/fetchUnreadNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/unread");

      const notifications = getNotificationsFromResponse(response);

      return notifications;
    } catch (error) {
      return rejectWithValue(
        getApiError(error) || "Failed to load unread notifications.",
      );
    }
  },
);

// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);

      return response.data?.notification;
    } catch (error) {
      return rejectWithValue(
        getApiError(error) || "Failed to mark notification as read.",
      );
    }
  },
);

// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await api.patch("/notifications/read-all");

      return true;
    } catch (error) {
      return rejectWithValue(
        getApiError(error) || "Failed to mark all notifications as read.",
      );
    }
  },
);

// ==========================================
// DELETE NOTIFICATION
// ==========================================

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${notificationId}`);

      return notificationId;
    } catch (error) {
      return rejectWithValue(
        getApiError(error) || "Failed to delete notification.",
      );
    }
  },
);

// ==========================================
// DELETE ALL NOTIFICATIONS
// ==========================================

export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/notifications");

      return true;
    } catch (error) {
      return rejectWithValue(
        getApiError(error) || "Failed to delete all notifications.",
      );
    }
  },
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  actionLoading: null,
};

// ==========================================
// SLICE
// ==========================================

const notificationsSlice = createSlice({
  name: "notifications",

  initialState,

  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
      state.loading = false;
      state.actionLoading = null;
    },
  },

  extraReducers: (builder) => {
    // ==========================================
    // FETCH ALL NOTIFICATIONS
    // ==========================================

    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications = Array.isArray(action.payload)
          ? action.payload
          : [];

        state.error = null;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to load notifications.";
      });

    // ==========================================
    // FETCH UNREAD NOTIFICATIONS
    // ==========================================

    builder
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.error = null;
      })

      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        const unreadNotifications = Array.isArray(action.payload)
          ? action.payload
          : [];

        const unreadIds = new Set(
          unreadNotifications.map((notification) => notification._id),
        );

        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: unreadIds.has(notification._id) ? false : notification.isRead,
        }));

        if (state.notifications.length === 0) {
          state.notifications = unreadNotifications;
        }

        state.error = null;
      })

      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.error = action.payload || "Failed to load unread notifications.";
      });

    // ==========================================
    // MARK ONE AS READ
    // ==========================================

    builder
      .addCase(markNotificationAsRead.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
        state.error = null;
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.actionLoading = null;

        const updatedNotification = action.payload;

        if (!updatedNotification?._id) {
          return;
        }

        const index = state.notifications.findIndex(
          (notification) => notification._id === updatedNotification._id,
        );

        if (index !== -1) {
          state.notifications[index] = {
            ...state.notifications[index],
            ...updatedNotification,
            isRead: true,
          };
        }

        state.error = null;
      })

      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.actionLoading = null;

        state.error = action.payload || "Failed to mark notification as read.";
      });

    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    builder
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.actionLoading = "all";
        state.error = null;
      })

      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.actionLoading = null;

        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));

        state.error = null;
      })

      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.actionLoading = null;

        state.error =
          action.payload || "Failed to mark all notifications as read.";
      });

    // ==========================================
    // DELETE NOTIFICATION
    // ==========================================

    builder
      .addCase(deleteNotification.pending, (state, action) => {
        state.actionLoading = `delete-${action.meta.arg}`;
        state.error = null;
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.actionLoading = null;

        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.payload,
        );

        state.error = null;
      })

      .addCase(deleteNotification.rejected, (state, action) => {
        state.actionLoading = null;

        state.error = action.payload || "Failed to delete notification.";
      });

    // ==========================================
    // DELETE ALL NOTIFICATIONS
    // ==========================================

    builder
      .addCase(deleteAllNotifications.pending, (state) => {
        state.actionLoading = "delete-all";
        state.error = null;
      })

      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.actionLoading = null;
        state.notifications = [];
        state.error = null;
      })

      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.actionLoading = null;

        state.error = action.payload || "Failed to delete all notifications.";
      });
  },
});

export const { clearNotificationError, clearNotifications } =
  notificationsSlice.actions;

// ==========================================
// SELECTORS
// ==========================================

export const selectNotifications = (state) => state.notifications.notifications;

export const selectNotificationLoading = (state) => state.notifications.loading;

export const selectNotificationError = (state) => state.notifications.error;

export const selectNotificationActionLoading = (state) =>
  state.notifications.actionLoading;

export const selectUnreadNotificationCount = (state) =>
  state.notifications.notifications.filter(
    (notification) => !notification.isRead,
  ).length;

export default notificationsSlice.reducer;
