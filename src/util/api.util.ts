import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { clearToken, getToken, getGuestSessionId, clearGuestData } from "./auth.util";
import { handleApiError, handleApiResponse } from "./response.util";
import { toast } from "sonner";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  addToken?: boolean;
  allowGuest?: boolean;
  headers: any;
}

// Create API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token or guest session to requests
api.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  if (config.addToken) {
    const token = getToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  
  // Add guest session ID for guest requests
  if (config.allowGuest) {
    const guestSessionId = getGuestSessionId();
    if (guestSessionId) {
      config.headers.set("X-Guest-Session", guestSessionId);
    }
  }

  return config;
});

// Enhanced error handling
api.interceptors.response.use(
  (response) => handleApiResponse(response) as unknown as AxiosResponse,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      clearGuestData();
      toast.error("Session expired. Please log in again.");
      window.location.href = "/auth/login";
    } else if (error.response?.status === 429) {
      const message = error.response?.data?.message || "Rate limit exceeded. Please try again later.";
      toast.error(message);
    } else if (error.response?.status === 403) {
      const message = error.response?.data?.message || "Guest limit reached. Please sign up to continue.";
      toast.error(message);
    }

    return Promise.reject(handleApiError(error));
  }
);

export default api;
