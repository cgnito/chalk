import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("chalk_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("chalk_token");
      localStorage.removeItem("chalk_school");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);