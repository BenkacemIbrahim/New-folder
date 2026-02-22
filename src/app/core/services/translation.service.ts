import { DOCUMENT, registerLocaleData } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { skip, take } from 'rxjs';
import localeAr from '@angular/common/locales/ar';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';

import {
  APP_I18N_CONFIG,
  APP_LANGUAGE_LOOKUP,
  APP_LANGUAGES,
  AppLanguageCode,
  AppLanguageDefinition,
  AppTextDirection
} from '../config/i18n.config';

type TranslationParams = Record<string, string | number | boolean>;

function registerSupportedLocales(): void {
  registerLocaleData(localeEn, 'en');
  registerLocaleData(localeEn, 'en-US');
  registerLocaleData(localeFr, 'fr');
  registerLocaleData(localeFr, 'fr-FR');
  registerLocaleData(localeEs, 'es');
  registerLocaleData(localeEs, 'es-ES');
  registerLocaleData(localeDe, 'de');
  registerLocaleData(localeDe, 'de-DE');
  registerLocaleData(localeAr, 'ar');
  registerLocaleData(localeAr, 'ar-SA');
  registerLocaleData(localeIt, 'it');
  registerLocaleData(localeIt, 'it-IT');
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly document = inject(DOCUMENT);
  private readonly translateService = inject(TranslateService);

  private readonly _currentLanguage = signal<AppLanguageCode>(APP_I18N_CONFIG.defaultLanguage);

  readonly currentLanguage = this._currentLanguage.asReadonly();
  readonly languageChanges$ = toObservable(this.currentLanguage).pipe(skip(1));
  readonly supportedLanguages = APP_LANGUAGES;

  readonly currentLanguageMeta = computed<AppLanguageDefinition>(
    () => APP_LANGUAGE_LOOKUP[this.currentLanguage()]
  );
  readonly currentDirection = computed<AppTextDirection>(() => this.currentLanguageMeta().direction);
  readonly currentLocale = computed<string>(() => this.currentLanguageMeta().locale);
  readonly isRtl = computed<boolean>(() => this.currentDirection() === 'rtl');

  constructor() {
    registerSupportedLocales();
  }

  initialize(): void {
    this.translateService.addLangs(APP_LANGUAGES.map((language) => language.code));
    this.translateService.setDefaultLang(APP_I18N_CONFIG.fallbackLanguage);

    const initialLanguage = this.resolveInitialLanguage();
    this.applyLanguage(initialLanguage, false);
  }

  setLanguage(language: string): void {
    const normalizedLanguage = this.normalizeLanguage(language) ?? APP_I18N_CONFIG.defaultLanguage;
    this.applyLanguage(normalizedLanguage, true);
  }

  translate(key: string, params?: TranslationParams): string {
    return this.translateService.instant(key, params);
  }

  private applyLanguage(language: AppLanguageCode, persist: boolean): void {
    this._currentLanguage.set(language);
    this.applyDocumentDirection(language);

    this.translateService.use(language).pipe(take(1)).subscribe({
      error: () => {
        if (language !== APP_I18N_CONFIG.fallbackLanguage) {
          this.applyLanguage(APP_I18N_CONFIG.fallbackLanguage, persist);
          return;
        }

        this._currentLanguage.set(APP_I18N_CONFIG.defaultLanguage);
        this.applyDocumentDirection(APP_I18N_CONFIG.defaultLanguage);
      }
    });

    if (persist) {
      this.safeSetStorage(APP_I18N_CONFIG.storageKey, language);
    }
  }

  private resolveInitialLanguage(): AppLanguageCode {
    const storedLanguage = this.normalizeLanguage(this.safeGetStorage(APP_I18N_CONFIG.storageKey));
    if (storedLanguage) {
      return storedLanguage;
    }

    const browserLanguage = this.normalizeLanguage(
      this.translateService.getBrowserCultureLang() ?? this.translateService.getBrowserLang()
    );
    if (browserLanguage) {
      return browserLanguage;
    }

    return APP_I18N_CONFIG.defaultLanguage;
  }

  private applyDocumentDirection(language: AppLanguageCode): void {
    const languageMeta = APP_LANGUAGE_LOOKUP[language];
    const htmlElement = this.document.documentElement;

    htmlElement.setAttribute('lang', languageMeta.locale);
    htmlElement.setAttribute('dir', languageMeta.direction);

    const bodyElement = this.document.body;
    if (bodyElement) {
      bodyElement.setAttribute('dir', languageMeta.direction);
      bodyElement.classList.toggle('is-rtl', languageMeta.direction === 'rtl');
    }
  }

  private normalizeLanguage(language: string | null | undefined): AppLanguageCode | null {
    if (!language) {
      return null;
    }

    const normalizedLanguage = language.toLowerCase().split('-')[0];
    return this.isSupportedLanguage(normalizedLanguage) ? normalizedLanguage : null;
  }

  private isSupportedLanguage(language: string): language is AppLanguageCode {
    return APP_LANGUAGES.some((item) => item.code === language);
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
