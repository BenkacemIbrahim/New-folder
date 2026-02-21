export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  role: 'admin' | 'manager' | 'member';
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  organization: string;
  password: string;
  acceptTerms: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: AuthUser;
}

export interface RefreshResponse {
  tokens: AuthTokens;
}
