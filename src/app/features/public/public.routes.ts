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
          'Enterprise Workspace gives product and operations teams one place to plan work, run delivery, and report outcomes.',
        keywords:
          'enterprise workspace, project management, kanban, delivery analytics, saas workflow platform'
      }
    }
  }
];
