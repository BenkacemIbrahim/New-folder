import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, of } from 'rxjs';

import {
  AuthResponse,
  AuthTokens,
  AuthUser,
  LoginRequest,
  RefreshResponse,
  RegisterRequest
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', payload).pipe(
      catchError(() => this.mockLoginResponse(payload.email))
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', payload).pipe(
      catchError(() => this.mockRegisterResponse(payload))
    );
  }

  refreshToken(refreshToken: string): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>('/api/auth/refresh', { refreshToken }).pipe(
      catchError(() => this.mockRefreshResponse())
    );
  }

  private mockLoginResponse(email: string): Observable<AuthResponse> {
    const displayName = this.toDisplayName(email);

    const response: AuthResponse = this.createAuthResponse({
      fullName: displayName,
      email,
      organization: 'Enterprise Academy',
      role: 'manager'
    });

    return of(response).pipe(delay(550));
  }

  private mockRegisterResponse(payload: RegisterRequest): Observable<AuthResponse> {
    const response: AuthResponse = this.createAuthResponse({
      fullName: payload.fullName,
      email: payload.email,
      organization: payload.organization,
      role: 'admin'
    });

    return of(response).pipe(delay(720));
  }

  private mockRefreshResponse(): Observable<RefreshResponse> {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const tokens: AuthTokens = {
      accessToken: this.createMockJwt('team@enterprise.io', 'manager', exp),
      refreshToken: this.createMockJwt('team@enterprise.io', 'manager', exp + 60 * 60 * 24),
      expiresAt: exp * 1000
    };

    return of({ tokens }).pipe(delay(260));
  }

  private createAuthResponse(userSeed: Omit<AuthUser, 'id'>): AuthResponse {
    const expirationSeconds = Math.floor(Date.now() / 1000) + 60 * 60;
    const user: AuthUser = {
      ...userSeed,
      id: crypto.randomUUID()
    };

    return {
      user,
      tokens: {
        accessToken: this.createMockJwt(user.email, user.role, expirationSeconds),
        refreshToken: this.createMockJwt(user.email, user.role, expirationSeconds + 60 * 60 * 24),
        expiresAt: expirationSeconds * 1000
      }
    };
  }

  private createMockJwt(subject: string, role: AuthUser['role'], exp: number): string {
    const header = this.toBase64Url({ alg: 'HS256', typ: 'JWT' });
    const payload = this.toBase64Url({
      sub: subject,
      role,
      exp,
      iat: Math.floor(Date.now() / 1000),
      iss: 'enterprise-workspace-demo'
    });

    return `${header}.${payload}.demo-signature`;
  }

  private toDisplayName(email: string): string {
    const [nameSeed] = email.split('@');
    const words = nameSeed.split(/[._-]/g);

    return words
      .filter((part) => part.trim().length > 0)
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(' ');
  }

  private toBase64Url(payload: Record<string, unknown>): string {
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    const binary = Array.from(bytes)
      .map((byte) => String.fromCharCode(byte))
      .join('');

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
