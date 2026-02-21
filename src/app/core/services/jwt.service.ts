import { Injectable } from '@angular/core';

import { AuthTokens } from '../models/auth.model';

const ACCESS_TOKEN_KEY = 'enterprise-workspace.access-token';
const REFRESH_TOKEN_KEY = 'enterprise-workspace.refresh-token';
const TOKEN_EXPIRATION_KEY = 'enterprise-workspace.expires-at';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getStoredExpiration(): number | null {
    const storedValue = localStorage.getItem(TOKEN_EXPIRATION_KEY);
    if (!storedValue) {
      return null;
    }

    const expiresAt = Number(storedValue);
    return Number.isFinite(expiresAt) ? expiresAt : null;
  }

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(TOKEN_EXPIRATION_KEY, String(tokens.expiresAt));
  }

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRATION_KEY);
  }

  hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    return !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    const payload = this.parsePayload(token);
    if (!payload) {
      return true;
    }

    const exp = payload['exp'];
    if (typeof exp !== 'number') {
      return true;
    }

    return Date.now() >= exp * 1000;
  }

  private parsePayload(token: string): Record<string, unknown> | null {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    try {
      const payloadPart = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = payloadPart.padEnd(Math.ceil(payloadPart.length / 4) * 4, '=');
      const decodedPayload = atob(paddedPayload);
      return JSON.parse(decodedPayload) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
