import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Main Axios Client
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Separate Axios Client for Refresh Token
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let refreshPromise = null;

const isAuthEndpoint = (url = "") => {
  const authEndpoints = [
    "/users/login",
    "/users/register",
    "/users/refresh",
    "/users/logout",
    "/users/forgot-password",
    "/users/reset-password",
    "/users/change-password",
    "/users/verify-email",
    "/users/resend-verification",
  ];

  return authEndpoints.some((endpoint) => url.includes(endpoint));
};

// Clear Frontend Authentication
const clearAuthentication = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

// Refresh Access Token
const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/users/refresh")
      .then((response) => {
        const newAccessToken = response.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("New access token was not returned.");
        }

        localStorage.setItem("accessToken", newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = config.headers || {};

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    const currentAccessToken = localStorage.getItem("accessToken");

    if (!currentAccessToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers = originalRequest.headers || {};

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthentication();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;
