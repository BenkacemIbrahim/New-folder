import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
    data: {
      animation: 'auth-login',
      seo: {
        title: 'Sign In',
        description:
          'Sign in to Enterprise Workspace to access portfolio dashboards, projects, and Kanban execution boards.',
        robots: 'noindex,nofollow'
      }
    }
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then((m) => m.RegisterPageComponent),
    data: {
      animation: 'auth-register',
      seo: {
        title: 'Create Account',
        description:
          'Create an enterprise account to onboard teams and start managing delivery operations in Enterprise Workspace.',
        robots: 'noindex,nofollow'
      }
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];
