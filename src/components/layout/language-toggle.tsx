'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { getAlternateUrl } from '@/lib/i18n/route-map';

/**
 * Sélecteur de langue.
 *
 * La version anglaise du site est un ensemble de pages statiques sous `/en/`
 * (hors application Next). Basculer en EN doit donc *naviguer* vers la page
 * anglaise équivalente — sinon le contenu EN (dont le blog) reste inaccessible.
 *
 * Ce composant n'est rendu que dans l'app (servie en FR à la racine) : il gère
 * donc le sens FR -> EN. Le retour EN -> FR est assuré par les liens « 🇫🇷 FR »
 * présents dans les pages statiques anglaises.
 */
export function LanguageToggle() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const enHref = getAlternateUrl(pathname || '/', 'en');

  return (
    <a
      href={enHref}
      aria-label={t('a11y.toggleLanguage')}
      title={t('a11y.toggleLanguage')}
      className="inline-flex h-10 items-center justify-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <span className="text-green-600 dark:text-tennis-green-400">FR</span>
      <span className="text-gray-300 dark:text-slate-600">/</span>
      <span>EN</span>
    </a>
  );
}
