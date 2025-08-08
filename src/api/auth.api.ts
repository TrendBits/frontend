import api, { type CustomAxiosRequestConfig } from "../util/api.util";
import type { AuthUserInputType } from "./api.types";

export const loginUser = async (userInfo: AuthUserInputType) => {
  return await api.post("auth/login", userInfo);
};

export const registerUser = async (userInfo: AuthUserInputType) => {
  return await api.post("auth/register", userInfo);
};

export const validateToken = async () => {
  return await api.get("auth/validate", { addToken: true } as CustomAxiosRequestConfig);
};

export const requestResetPass = async (email: string) => {
  return await api.post("auth/request-reset-password", { email });
}

export const verifyResetPassToken = async (token: string) => {
  return await api.get(`auth/verify-reset-token`, { params: { token } });
};

export const resetPassword = async (email: string, password: string) => {
  return await api.post(`auth/reset-password`, { email, password });
}

export const getUserProfile = async () => {
  return await api.get("auth/profile", { addToken: true } as CustomAxiosRequestConfig);
};

export const updateUsername = async (username: string) => {
  return await api.put("auth/profile/username", { username }, { addToken: true } as CustomAxiosRequestConfig);
};
