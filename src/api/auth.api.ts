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
