import { Routes } from '@angular/router';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/analytics-page.component').then((m) => m.AnalyticsPageComponent),
    data: {
      animation: 'analytics',
      seo: {
        title: 'Analytics',
        description:
          'Enterprise analytics suite for operational insights, portfolio trend tracking, and executive reporting.'
      }
    }
  }
];
