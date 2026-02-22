import { NavItem } from '../models/nav-item.model';

export const NAV_ITEMS: NavItem[] = [
  {
    labelKey: 'NAVBAR.NAV_ITEMS.DASHBOARD',
    icon: 'dashboard',
    route: '/dashboard'
  },
  {
    labelKey: 'NAVBAR.NAV_ITEMS.PROJECTS',
    icon: 'workspaces',
    route: '/projects',
    badge: '12'
  },
  {
    labelKey: 'NAVBAR.NAV_ITEMS.TASKS',
    icon: 'task_alt',
    route: '/tasks',
    badge: '8'
  },
  {
    labelKey: 'NAVBAR.NAV_ITEMS.ANALYTICS',
    icon: 'insert_chart',
    route: '/analytics'
  }
];
