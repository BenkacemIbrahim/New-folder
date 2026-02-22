import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { SHELL_BREAKPOINT } from '../../core/config/app.constants';
import { LayoutService } from '../../core/services/layout.service';
import { routeTransitionAnimation } from '../../shared/animations/route-transition.animation';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  animations: [routeTransitionAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  protected readonly layout = inject(LayoutService);
  protected readonly appTitle = '';
  protected readonly currentUrl = signal('');
  protected readonly hideLanguageSwitcher = computed(() => this.currentUrl().startsWith('/dashboard'));
  @ViewChild(MatSidenavContainer) private sidenavContainer?: MatSidenavContainer;
  private marginSyncFrameId: number | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  constructor() {
    this.currentUrl.set(this.router.url);

    this.breakpointObserver
      .observe(SHELL_BREAKPOINT)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((breakpointState) => this.layout.setMobileState(breakpointState.matches));

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));

    this.destroyRef.onDestroy(() => {
      if (this.marginSyncFrameId !== null) {
        cancelAnimationFrame(this.marginSyncFrameId);
      }
    });
  }

  protected onSidebarToggle(): void {
    this.layout.toggleSidebar();

    if (!this.layout.isMobile()) {
      this.syncMarginsDuringSidebarAnimation();
    }
  }

  protected onSidebarNavigate(): void {
    this.layout.closeMobileSidebar();
  }

  protected prepareRoute(outlet: RouterOutlet): string {
    const animationKey = outlet.activatedRouteData['animation'];
    return typeof animationKey === 'string' ? animationKey : 'none';
  }

  private syncMarginsDuringSidebarAnimation(): void {
    if (this.marginSyncFrameId !== null) {
      cancelAnimationFrame(this.marginSyncFrameId);
    }

    const syncStart = performance.now();
    const syncDuration = 260;

    const step = (now: number): void => {
      this.sidenavContainer?.updateContentMargins();

      if (now - syncStart < syncDuration) {
        this.marginSyncFrameId = requestAnimationFrame(step);
        return;
      }

      this.marginSyncFrameId = null;
      this.sidenavContainer?.updateContentMargins();
    };

    this.marginSyncFrameId = requestAnimationFrame(step);
  }
}
