import axios, { type InternalAxiosRequestConfig } from "axios";
import { handleApiError } from "./error.util";
import { clearToken, getToken } from "./auth.util";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  addToken?: boolean;
}

// Create API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  if (config.addToken) {
    const token = getToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
    }

    return Promise.reject(handleApiError(error));
  }
);

export default api;
