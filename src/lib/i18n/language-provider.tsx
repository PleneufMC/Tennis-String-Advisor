'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { isEnglishPath } from './route-map';
import {
  dictionaries,
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  type TranslationKey,
} from './dictionaries';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'tennis-advisor-locale';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [storedLocale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);
  // Route anglaise de l'application (`/en/configurator`, 20/11/2026) : la langue de l'URL l'emporte sur la langue stockée, pour
  // que l'en-tête et le pied de page suivent la page. Ailleurs, comportement inchangé (langue stockée, sinon navigateur).
  const pathname = usePathname();
  const locale: Locale = isEnglishPath(pathname || '/') ? 'en' : storedLocale;

  React.useEffect(() => {
    // 1) langue stockée, sinon 2) langue du navigateur, sinon défaut
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && LOCALES.includes(stored)) {
      setLocaleState(stored);
      return;
    }
    const browser = navigator.language.slice(0, 2).toLowerCase();
    if (browser === 'en') {
      setLocaleState('en');
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleLocale = React.useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = React.useCallback(
    (key: TranslationKey) => dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key,
    [locale]
  );

  const value = React.useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
