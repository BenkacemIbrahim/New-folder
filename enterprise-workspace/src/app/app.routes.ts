import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./features/system/pages/error-page/error-page.component').then(
        (m) => m.ErrorPageComponent
      ),
    data: {
      animation: 'error',
      seo: {
        title: 'Error',
        description:
          'An operational error occurred in Enterprise Workspace. Use the recovery actions to continue safely.',
        robots: 'noindex,nofollow'
      }
    }
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES)
      },
      {
        path: 'tasks',
        loadChildren: () => import('./features/tasks/tasks.routes').then((m) => m.TASKS_ROUTES)
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('./features/analytics/analytics.routes').then((m) => m.ANALYTICS_ROUTES)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/system/pages/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent
      ),
    data: {
      animation: 'not-found',
      seo: {
        title: 'Page Not Found',
        description:
          'The requested route was not found in Enterprise Workspace. Navigate back to active modules.',
        robots: 'noindex,nofollow'
      }
    }
  }
];
