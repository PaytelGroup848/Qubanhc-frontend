import axios from "axios";
import toast from "react-hot-toast";

// const API_BASE_URL = 'https://qubanhygienecare.com/api/v1';
const API_BASE_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];
let lastToastMessage = "";
let lastToastAt = 0;

const getApiErrorMessage = (error) => {
  const data = error?.response?.data;

  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const firstError = data.errors[0];
    if (typeof firstError === "string") return firstError;
    if (firstError?.message) return firstError.message;
  }

  if (error?.message === "Network Error") {
    return "Not connected with server";
  }

  return error?.message || "Something went wrong. Please try again.";
};

const showGlobalApiErrorToast = (error) => {
  const status = error?.response?.status;
  const url = error?.config?.url || "";

  // Auth refresh route ke noisy errors avoid.
  if (url.includes("/auth/refresh-token")) return;

  // Login redirect wale 401 ko spam mat karo.
  if (status === 401) {
    const message = getApiErrorMessage(error);
    if (
      message.toLowerCase().includes("jwt") ||
      message.toLowerCase().includes("token") ||
      message.toLowerCase().includes("not authorized")
    ) {
      return;
    }
  }

  const message = getApiErrorMessage(error);
  const now = Date.now();

  // Same error baar-baar aaye to toast spam avoid.
  if (message === lastToastMessage && now - lastToastAt < 2500) return;

  lastToastMessage = message;
  lastToastAt = now;

  toast.error(message);
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    if (error.response?.status !== 401 || originalRequest._retry) {
      showGlobalApiErrorToast(error);
      return Promise.reject(error);
    }

    if (
      error.response?.data?.message === "jwt expired" ||
      error.response?.status === 401
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        );

        const { accessToken } = response.data.data;

        localStorage.setItem("accessToken", accessToken);
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        sessionStorage.clear();

        showGlobalApiErrorToast(refreshError);

        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    showGlobalApiErrorToast(error);
    return Promise.reject(error);
  },
);

export default api;
