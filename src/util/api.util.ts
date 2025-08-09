import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { clearToken, getToken } from "./auth.util";
import { handleApiError, handleApiResponse } from "./response.util";
import { toast } from "sonner";

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
  (response) => handleApiResponse(response) as unknown as AxiosResponse,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      toast.error("Oops! You're not authenticated. Please log in.");
    }

    return Promise.reject(handleApiError(error));
  }
);

export default api;
