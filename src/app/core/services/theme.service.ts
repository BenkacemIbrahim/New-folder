import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';

import { APP_THEME_CONFIG, APP_THEMES, AppTheme } from '../config/theme.config';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly _theme = signal<AppTheme>(APP_THEME_CONFIG.defaultTheme);

  readonly theme = this._theme.asReadonly();
  readonly themeChanges$ = toObservable(this.theme).pipe(skip(1));
  readonly isDarkTheme = computed<boolean>(() => this.theme() === 'dark');

  initialize(): void {
    const resolvedTheme = this.resolveInitialTheme();
    this.applyTheme(resolvedTheme, false);
  }

  setTheme(theme: AppTheme): void {
    this.applyTheme(theme, true);
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(theme: AppTheme, persist: boolean): void {
    this._theme.set(theme);

    const htmlElement = this.document.documentElement;
    htmlElement.setAttribute(APP_THEME_CONFIG.htmlAttribute, theme);
    htmlElement.style.colorScheme = theme;

    if (persist) {
      this.safeSetStorage(APP_THEME_CONFIG.storageKey, theme);
    }
  }

  private resolveInitialTheme(): AppTheme {
    const storedTheme = this.safeGetStorage(APP_THEME_CONFIG.storageKey);
    return this.isTheme(storedTheme) ? storedTheme : APP_THEME_CONFIG.defaultTheme;
  }

  private isTheme(theme: string | null): theme is AppTheme {
    return !!theme && APP_THEMES.includes(theme as AppTheme);
  }

  private safeGetStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private safeSetStorage(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      return;
    }
  }
}
