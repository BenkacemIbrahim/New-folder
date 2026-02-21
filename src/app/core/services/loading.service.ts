import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly httpCounter = signal(0);
  private readonly navigationCounter = signal(0);

  readonly isLoading = computed<boolean>(
    () => this.httpCounter() > 0 || this.navigationCounter() > 0
  );

  beginHttpRequest(): void {
    this.httpCounter.update((value) => value + 1);
  }

  endHttpRequest(): void {
    this.httpCounter.update((value) => Math.max(0, value - 1));
  }

  beginNavigation(): void {
    this.navigationCounter.update((value) => value + 1);
  }

  endNavigation(): void {
    this.navigationCounter.update((value) => Math.max(0, value - 1));
  }
}
