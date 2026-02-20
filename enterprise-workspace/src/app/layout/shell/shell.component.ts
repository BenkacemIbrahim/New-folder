import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { APP_TITLE, SHELL_BREAKPOINT } from '../../core/config/app.constants';
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
  animations: [routeTransitionAnimation]
})
export class ShellComponent {
  protected readonly layout = inject(LayoutService);
  protected readonly appTitle = APP_TITLE;

  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver
      .observe(SHELL_BREAKPOINT)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((breakpointState) => this.layout.setMobileState(breakpointState.matches));
  }

  protected onSidebarToggle(): void {
    this.layout.toggleSidebar();
  }

  protected onSidebarNavigate(): void {
    this.layout.closeMobileSidebar();
  }

  protected prepareRoute(outlet: RouterOutlet): string {
    const animationKey = outlet.activatedRouteData['animation'];
    return typeof animationKey === 'string' ? animationKey : 'none';
  }
}
