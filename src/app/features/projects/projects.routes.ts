import { Routes } from '@angular/router';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/projects-list-page/projects-list-page.component').then(
        (m) => m.ProjectsListPageComponent
      ),
    data: {
      animation: 'projects-list',
      seo: {
        title: 'Projects',
        description:
          'Explore project portfolios with enterprise filters, animated status signals, and collaborative workflow controls.'
      }
    }
  },
  {
    path: ':projectId',
    loadComponent: () =>
      import('./pages/project-details-page/project-details-page.component').then(
        (m) => m.ProjectDetailsPageComponent
      ),
    data: {
      animation: 'projects-details',
      seo: {
        title: 'Project Details',
        description:
          'Project detail workspace with tabbed navigation, reusable modal system, and reactive form workflows.'
      }
    }
  }
];
