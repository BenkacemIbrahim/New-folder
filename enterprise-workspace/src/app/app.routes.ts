import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
        data: { animation: 'auth-login' }
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register-page/register-page.component').then(
            (m) => m.RegisterPageComponent
          ),
        data: { animation: 'auth-register' }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      }
    ]
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page.component').then(
            (m) => m.DashboardPageComponent
          ),
        data: { animation: 'dashboard' }
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/pages/projects-page.component').then(
            (m) => m.ProjectsPageComponent
          ),
        data: { animation: 'projects' }
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/pages/tasks-page.component').then((m) => m.TasksPageComponent),
        data: { animation: 'tasks' }
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/pages/analytics-page.component').then(
            (m) => m.AnalyticsPageComponent
          ),
        data: { animation: 'analytics' }
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
    redirectTo: ''
  }
];
