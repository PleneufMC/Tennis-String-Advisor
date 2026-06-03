'use client';

import { useLanguage } from '@/lib/i18n';

export function LanguageToggle() {
  const { locale, toggleLocale, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t('a11y.toggleLanguage')}
      title={t('a11y.toggleLanguage')}
      className="inline-flex h-10 items-center justify-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <span className={locale === 'fr' ? 'text-green-600 dark:text-tennis-green-400' : ''}>FR</span>
      <span className="text-gray-300 dark:text-slate-600">/</span>
      <span className={locale === 'en' ? 'text-green-600 dark:text-tennis-green-400' : ''}>EN</span>
    </button>
  );
}
