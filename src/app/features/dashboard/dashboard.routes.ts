import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard-page.component').then((m) => m.DashboardPageComponent),
    data: {
      animation: 'dashboard',
      seo: {
        title: 'Dashboard',
        description:
          'Enterprise KPI dashboard with animated counters, delivery charts, timeline visibility, and theme switching.',
        keywords: 'enterprise dashboard,kpi,analytics,delivery'
      }
    }
  }
];
