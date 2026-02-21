import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthApiService } from '../services/auth-api.service';
import { JwtService } from '../services/jwt.service';

const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const jwtService = inject(JwtService);
  const authApiService = inject(AuthApiService);
  const router = inject(Router);

  const isApiRequest = request.url.startsWith('/api');
  const isAuthRequest = AUTH_ENDPOINTS.some((endpoint) => request.url.includes(endpoint));
  const accessToken = jwtService.getAccessToken();

  const authenticatedRequest =
    isApiRequest && !isAuthRequest && accessToken
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      : request;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status !== 401 || !isApiRequest || isAuthRequest) {
        return throwError(() => error);
      }

      const refreshToken = jwtService.getRefreshToken();
      if (!refreshToken) {
        jwtService.clearTokens();
        void router.navigate(['/auth/login']);
        return throwError(() => error);
      }

      return authApiService.refreshToken(refreshToken).pipe(
        switchMap((refreshResponse) => {
          jwtService.setTokens(refreshResponse.tokens);

          const retryRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${refreshResponse.tokens.accessToken}`
            }
          });

          return next(retryRequest);
        }),
        catchError((refreshError) => {
          jwtService.clearTokens();
          void router.navigate(['/auth/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
