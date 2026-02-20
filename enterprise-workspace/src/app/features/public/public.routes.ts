import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/marketing-home-page/marketing-home-page.component').then(
        (m) => m.MarketingHomePageComponent
      ),
    data: {
      animation: 'public-home',
      seo: {
        title: 'Enterprise Workspace',
        description:
          'Enterprise Workspace helps teams manage work, deliver outcomes, and scale operations with premium workflow intelligence.',
        keywords:
          'enterprise workspace, project management, kanban, delivery analytics, saas workflow platform'
      }
    }
  }
];

