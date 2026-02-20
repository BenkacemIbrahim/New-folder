import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../models/auth.model';
import { AuthApiService } from './auth-api.service';
import { JwtService } from './jwt.service';
import { ToastService } from './toast.service';

const USER_STORAGE_KEY = 'enterprise-workspace.user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly authApiService = inject(AuthApiService);
  private readonly jwtService = inject(JwtService);
  private readonly toastService = inject(ToastService);

  private readonly _user = signal<AuthUser | null>(this.restoreUser());
  private readonly _isAuthenticated = signal<boolean>(this.jwtService.hasValidAccessToken());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed<boolean>(
    () => this._isAuthenticated() && this.jwtService.hasValidAccessToken()
  );
  readonly statusLabel = computed<string>(() => (this.isAuthenticated() ? 'Online' : 'Offline'));

  constructor() {
    if (!this.jwtService.hasValidAccessToken()) {
      this.clearSession({ navigate: false });
    }
  }

  login(payload: LoginRequest): Observable<AuthUser> {
    return this.authApiService.login(payload).pipe(
      tap((response) => {
        this.hydrateSession(response);
        this.toastService.success('Welcome back', 'You are now signed in and ready to work.');
      }),
      map((response) => response.user)
    );
  }

  register(payload: RegisterRequest): Observable<AuthUser> {
    return this.authApiService.register(payload).pipe(
      tap((response) => {
        this.hydrateSession(response);
        this.toastService.success(
          'Account created',
          'Your workspace was provisioned successfully.'
        );
      }),
      map((response) => response.user)
    );
  }

  refreshSession(): Observable<boolean> {
    const refreshToken = this.jwtService.getRefreshToken();
    if (!refreshToken) {
      return of(false);
    }

    return this.authApiService.refreshToken(refreshToken).pipe(
      tap((response) => this.jwtService.setTokens(response.tokens)),
      map(() => true),
      catchError(() => {
        this.clearSession({ navigate: false });
        return of(false);
      })
    );
  }

  logout(): void {
    this.clearSession({ navigate: true });
    this.toastService.info('Session closed', 'You have been signed out of Enterprise Workspace.');
  }

  private hydrateSession(response: AuthResponse): void {
    this.jwtService.setTokens(response.tokens);
    this._user.set(response.user);
    this._isAuthenticated.set(true);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
  }

  private clearSession(options: { navigate: boolean }): void {
    this.jwtService.clearTokens();
    this._user.set(null);
    this._isAuthenticated.set(false);
    localStorage.removeItem(USER_STORAGE_KEY);

    if (options.navigate) {
      void this.router.navigate(['/auth/login']);
    }
  }

  private restoreUser(): AuthUser | null {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      return null;
    }
  }
}
