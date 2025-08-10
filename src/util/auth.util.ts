import { deleteCookie, getCookie, setCookie } from "./cookie.util";
import type { AuthState, ValidationResult } from "../api/api.types";

// Token management
export const setToken = (token: string) => setCookie("auth_token", token);
export const getToken = () => getCookie("auth_token");
export const clearToken = () => deleteCookie("auth_token");

// Guest user management
const GUEST_DATA_KEY = 'guest_user_data';
const GUEST_SESSION_KEY = 'guest_session_id';

export interface GuestUserData {
  sessionId: string;
  requestsUsed: number;
  requestsRemaining: number;
  lastRequestTime: number;
}

export const initializeGuestSession = (): string => {
  const sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const guestData: GuestUserData = {
    sessionId,
    requestsUsed: 0,
    requestsRemaining: 2,
    lastRequestTime: 0
  };
  
  localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(guestData));
  setCookie(GUEST_SESSION_KEY, sessionId);
  return sessionId;
};

export const getGuestData = (): GuestUserData | null => {
  try {
    const data = localStorage.getItem(GUEST_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const updateGuestData = (data: Partial<GuestUserData>) => {
  const currentData = getGuestData();
  if (currentData) {
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(updatedData));
  }
};

export const clearGuestData = () => {
  localStorage.removeItem(GUEST_DATA_KEY);
  deleteCookie(GUEST_SESSION_KEY);
};

export const getGuestSessionId = () => getCookie(GUEST_SESSION_KEY);

// Enhanced authentication state detection
export const getAuthState = (): AuthState => {
  const token = getToken();
  if (token) return 'authenticated';
  
  const guestData = getGuestData();
  if (guestData) return 'guest';
  
  return 'unauthenticated';
};

export const isAuthenticated = () => getToken() !== null;
export const isGuest = () => {
  const authState = getAuthState();
  return authState === 'guest';
};
export const canMakeRequest = () => {
  const authState = getAuthState();
  if (authState === 'authenticated') return true;
  if (authState === 'guest') {
    const guestData = getGuestData();
    return guestData ? guestData.requestsRemaining > 0 : false;
  }
  return false;
};

// Input validation utilities
export const validatePromptInput = (input: string): ValidationResult => {
  const trimmedInput = input.trim();
  
  if (!trimmedInput) {
    return { valid: false, error: "Prompt cannot be empty" };
  }
  
  if (trimmedInput.length > 1000) {
    return { valid: false, error: "Prompt too long (max 1000 characters)" };
  }
  
  // Basic XSS prevention
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(trimmedInput))) {
    return { valid: false, error: "Invalid content detected" };
  }
  
  return { valid: true };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>"'&]/g, (match) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    });
};
