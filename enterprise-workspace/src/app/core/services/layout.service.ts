import { computed, Injectable, signal } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly _isMobile = signal(false);
  private readonly _isSidebarCollapsed = signal(false);
  private readonly _isMobileSidebarOpen = signal(false);

  readonly isMobile = this._isMobile.asReadonly();
  readonly isSidebarCollapsed = this._isSidebarCollapsed.asReadonly();
  readonly isMobileSidebarOpen = this._isMobileSidebarOpen.asReadonly();

  readonly sidenavMode = computed<MatDrawerMode>(() => (this._isMobile() ? 'over' : 'side'));
  readonly sidenavOpened = computed<boolean>(() =>
    this._isMobile() ? this._isMobileSidebarOpen() : true
  );

  setMobileState(isMobile: boolean): void {
    this._isMobile.set(isMobile);

    if (!isMobile) {
      this._isMobileSidebarOpen.set(false);
    }
  }

  toggleSidebar(): void {
    if (this._isMobile()) {
      this._isMobileSidebarOpen.update((currentState) => !currentState);
      return;
    }

    this._isSidebarCollapsed.update((currentState) => !currentState);
  }

  closeMobileSidebar(): void {
    if (this._isMobile()) {
      this._isMobileSidebarOpen.set(false);
    }
  }
}
