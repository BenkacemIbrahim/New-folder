import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterOutlet
} from '@angular/router';

import { LoadingService } from './core/services/loading.service';
import { SeoService } from './core/services/seo.service';
import { GlobalLoaderComponent } from './shared/ui/global-loader/global-loader.component';
import { ToastOutletComponent } from './shared/ui/toast-outlet/toast-outlet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlobalLoaderComponent, ToastOutletComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loadingService = inject(LoadingService);
  private readonly seoService = inject(SeoService);

  constructor() {
    this.bindNavigationLoading();
    this.seoService.initialize();
  }

  private bindNavigationLoading(): void {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart || event instanceof RouteConfigLoadStart) {
        this.loadingService.beginNavigation();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof RouteConfigLoadEnd
      ) {
        this.loadingService.endNavigation();
      }
    });
  }
}
