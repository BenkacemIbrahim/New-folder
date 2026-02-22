export type AppLanguageCode = 'en' | 'fr' | 'es' | 'de' | 'ar' | 'it';
export type AppTextDirection = 'ltr' | 'rtl';

export interface AppLanguageDefinition {
  code: AppLanguageCode;
  locale: string;
  direction: AppTextDirection;
  labelKey: string;
  nativeLabel: string;
  flagAssetPath: string;
}

export const APP_I18N_CONFIG = {
  defaultLanguage: 'en' as AppLanguageCode,
  fallbackLanguage: 'en' as AppLanguageCode,
  storageKey: 'enterprise-workspace.language'
} as const;

export const APP_LANGUAGES: readonly AppLanguageDefinition[] = [
  {
    code: 'en',
    locale: 'en-US',
    direction: 'ltr',
    labelKey: 'COMMON.LANGUAGES.ENGLISH',
    nativeLabel: 'English',
    flagAssetPath: '/assets/flags/en.svg'
  },
  {
    code: 'fr',
    locale: 'fr-FR',
    direction: 'ltr',
    labelKey: 'COMMON.LANGUAGES.FRENCH',
    nativeLabel: 'Français',
    flagAssetPath: '/assets/flags/fr.svg'
  },
  {
    code: 'es',
    locale: 'es-ES',
    direction: 'ltr',
    labelKey: 'COMMON.LANGUAGES.SPANISH',
    nativeLabel: 'Español',
    flagAssetPath: '/assets/flags/es.svg'
  },
  {
    code: 'de',
    locale: 'de-DE',
    direction: 'ltr',
    labelKey: 'COMMON.LANGUAGES.GERMAN',
    nativeLabel: 'Deutsch',
    flagAssetPath: '/assets/flags/de.svg'
  },
  {
    code: 'ar',
    locale: 'ar-SA',
    direction: 'rtl',
    labelKey: 'COMMON.LANGUAGES.ARABIC',
    nativeLabel: 'العربية',
    flagAssetPath: '/assets/flags/ar.svg'
  },
  {
    code: 'it',
    locale: 'it-IT',
    direction: 'ltr',
    labelKey: 'COMMON.LANGUAGES.ITALIAN',
    nativeLabel: 'Italiano',
    flagAssetPath: '/assets/flags/it.svg'
  }
];

export const APP_LANGUAGE_LOOKUP = APP_LANGUAGES.reduce(
  (lookup, language) => {
    lookup[language.code] = language;
    return lookup;
  },
  {} as Record<AppLanguageCode, AppLanguageDefinition>
);
