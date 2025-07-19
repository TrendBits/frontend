import api from "../util/api.util";
import type { AuthUserInputType } from "./api.types";

export const loginUser = async (userInfo: AuthUserInputType) => {
  await api.post("auth/login", userInfo);
};

export const registerUser = async (userInfo: AuthUserInputType) => {
  await api.post("auth/register", userInfo);
};
