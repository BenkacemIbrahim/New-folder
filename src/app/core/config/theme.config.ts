export type AppTheme = 'light' | 'dark';

export const APP_THEME_CONFIG = {
  defaultTheme: 'light' as AppTheme,
  storageKey: 'enterprise-workspace.theme',
  htmlAttribute: 'data-theme'
} as const;

export const APP_THEMES: readonly AppTheme[] = ['light', 'dark'];
