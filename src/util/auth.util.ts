import { deleteCookie, getCookie, setCookie } from "./cookie.util";

// Token management
export const setToken = (token: string) => setCookie("auth_token", token);
export const getToken = () => getCookie("auth_token");
export const clearToken = () => deleteCookie("auth_token");
