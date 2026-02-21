import { NavItem } from '../models/nav-item.model';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard'
  },
  {
    label: 'Projects',
    icon: 'workspaces',
    route: '/projects',
    badge: '12'
  },
  {
    label: 'Tasks',
    icon: 'task_alt',
    route: '/tasks',
    badge: '8'
  },
  {
    label: 'Analytics',
    icon: 'insert_chart',
    route: '/analytics'
  }
];
