import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/tasks-page.component').then((m) => m.TasksPageComponent),
    data: {
      animation: 'tasks',
      seo: {
        title: 'Tasks',
        description:
          'Premium Kanban board with drag-and-drop task management, side-drawer details, and delivery status intelligence.'
      }
    }
  }
];
