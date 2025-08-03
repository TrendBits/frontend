import api, { type CustomAxiosRequestConfig } from "../util/api.util";

export const generateSummary = async (prompt:string) => {
  return await api.post(`prompt/summary`, { prompt }, { addToken: true } as CustomAxiosRequestConfig);
}
