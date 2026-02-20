import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loadingService = inject(LoadingService);

  // Keep the global loader tied to request lifecycle for consistent UX feedback.
  loadingService.beginHttpRequest();

  return next(request).pipe(
    finalize(() => {
      loadingService.endHttpRequest();
    })
  );
};
