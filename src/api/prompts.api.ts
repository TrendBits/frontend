import api, { type CustomAxiosRequestConfig } from "../util/api.util";
import type { SummaryResponse } from "./api.types";
import { getAuthState } from "../util/auth.util";

export const generateSummary = async (prompt: string): Promise<{ data: SummaryResponse }> => {
  const authState = getAuthState();
  const isAuthenticated = authState === 'authenticated';
  
  const config: CustomAxiosRequestConfig = {
    addToken: isAuthenticated,
    allowGuest: !isAuthenticated,
    headers: {}
  };
  
  return await api.post(`prompt/summary`, { prompt }, config);
};

export const getPromptHistoryList = async (options?: {
  id?: string;
  q?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  if (options?.id) params.append('id', options.id);
  if (options?.q) params.append('q', options.q);
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());

  return await api.get(`prompt/history${params.toString() ? `?${params.toString()}` : ''}`, 
    { addToken: true } as CustomAxiosRequestConfig
  );
};

export const getPromptHistoryDetail = async (id: string) => {
  return await api.get(`prompt/history/${id}`, { addToken: true } as CustomAxiosRequestConfig);
};
