import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { ToastService } from '../services/toast.service';

const HANDLED_ERROR_STATUSES = new Set([0, 403, 404]);

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const isApiRequest = request.url.startsWith('/api');
      if (!isApiRequest || error.status === 401) {
        return throwError(() => error);
      }

      if (error.status >= 500) {
        toastService.error(
          'Server unavailable',
          'Something went wrong while processing your request. Please retry in a moment.'
        );

        if (router.url !== '/error') {
          void router.navigate(['/error'], {
            state: {
              statusCode: error.status,
              statusText: error.statusText
            }
          });
        }

        return throwError(() => error);
      }

      if (HANDLED_ERROR_STATUSES.has(error.status)) {
        if (error.status === 0) {
          toastService.error(
            'Network disconnected',
            'Unable to reach the platform. Check your connection and retry.'
          );
        }

        if (error.status === 403) {
          toastService.warning(
            'Access restricted',
            'Your account does not have the required permission for this action.'
          );
        }

        if (error.status === 404) {
          toastService.info(
            'Resource not found',
            'The requested resource no longer exists or the URL is incorrect.'
          );
        }
      }

      return throwError(() => error);
    })
  );
};
