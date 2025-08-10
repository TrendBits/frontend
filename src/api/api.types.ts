export interface AuthUserInputType {
  email: string;
  password: string;
}

export interface GuestInfo {
  requests_used: number;
  requests_remaining: number;
  requires_signup: boolean;
}

export interface ArticleReference {
  title: string;
  url: string;
  source: string;
  date: string;
}

export interface SummaryResponse {
  headline: string;
  summary: string;
  key_points: string[];
  call_to_action: string;
  references: ArticleReference[];
  searchTerm: string;
  saved_to_history: boolean;
  summary_id: string | null;
  guest_info?: GuestInfo;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type AuthState = 'authenticated' | 'guest' | 'unauthenticated';
