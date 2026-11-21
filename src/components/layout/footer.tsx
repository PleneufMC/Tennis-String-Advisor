'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAlternateUrl, isEnglishPath, localizeHref } from '@/lib/i18n/route-map';
import { useLanguage, type TranslationKey } from '@/lib/i18n';
import { AffiliateDisclosure } from '@/components/product/affiliate-disclosure';

// Footer navigation (labels are translation keys resolved at render time)
//
// Règle (cf. Audit v1.1 §1.1/§1.2) : on ne référence QUE des liens qui
// résolvent réellement, pour ne plus exposer de 404.
//  - Routes Next réelles : /configurator, /racquets, /tennis-strings, /compare,
//    /pricing, /statistics.
//  - "Recommandations" -> /configurator (la reco RCS s'y trouve).
//  - "Guides" -> /blog/ (les guides vivent dans le blog statique).
//
// Liens RETIRÉS car les pages n'existent pas encore : /faq, /glossary,
// /about, /contact, /press, /careers (colonne "company"), et les pages
// légales /privacy, /terms, /cookies, /legal.
// ⚠️ Les pages légales (confidentialité / CGU / cookies) DOIVENT être
// recréées et réintégrées ici — prérequis RGPD (cf. Audit §0.4), surtout
// avant la pose de cookies tiers d'affiliation.
const footerNavigation = {
  product: [
    { key: 'footer.link.configurator' as TranslationKey, href: '/configurator' },
    { key: 'footer.link.racquets' as TranslationKey, href: '/racquets' },
    { key: 'footer.link.strings' as TranslationKey, href: '/tennis-strings' },
    { key: 'footer.link.compare' as TranslationKey, href: '/compare' },
    { key: 'footer.link.recommendations' as TranslationKey, href: '/configurator' },
  ],
  resources: [
    { key: 'footer.link.guides' as TranslationKey, href: '/blog/' },
    { key: 'footer.link.blog' as TranslationKey, href: '/blog/' },
    { key: 'footer.link.pricing' as TranslationKey, href: '/pricing' },
    { key: 'footer.link.statistics' as TranslationKey, href: '/statistics' },
  ],
};

function TennisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M2 12h20M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function Footer() {
  const { t, locale } = useLanguage();
  // Route anglaise de l'application (`/en/configurator`, 20/11/2026) : liens vers les pages EN équivalentes.
  const pathname = usePathname() || '/';
  const onEnglish = isEnglishPath(pathname);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-slate-950 border-t border-transparent dark:border-slate-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="container-tennis py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8">
            <Link href={localizeHref('/', pathname)} className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                <TennisIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">Tennis String</span>
                <span className="text-lg font-bold text-green-400"> Advisor</span>
              </div>
            </Link>
            <p className="text-sm leading-6 text-gray-300 max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Navigation sections */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">{t('footer.col.product')}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.product.map((item) => (
                    <li key={item.key}>
                      <Link
                        href={localizeHref(item.href, pathname)}
                        className="text-sm leading-6 text-gray-400 hover:text-white transition-colors"
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">{t('footer.col.resources')}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.resources.map((item) => (
                    <li key={item.key}>
                      <Link
                        // Premium reste /pricing en anglais aussi : seul circuit de paiement ouvert, celui qui débloque
                        // l'analyse avancée du configurateur (le paiement de /en/premium.html est fermé).
                        href={item.href === '/pricing' ? item.href : localizeHref(item.href, pathname)}
                        className="text-sm leading-6 text-gray-400 hover:text-white transition-colors"
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  ))}
                  {/* TennisMatchFinder, même propriétaire. Le §1 du CLAUDE.md
                      présentait ce canal croisé comme sous-exploité — il
                      n'existait en réalité dans AUCUN fichier du dépôt, dans
                      aucun des deux sens. L'UTM permet de mesurer ce que le
                      canal rapporte réellement, au lieu de le supposer. */}
                  <li>
                    <a
                      href="https://tennismatchfinder.net/?utm_source=tennisstringadvisor&utm_medium=footer&utm_campaign=cross_site"
                      target="_blank"
                      rel="noopener"
                      className="text-sm leading-6 text-gray-400 hover:text-white transition-colors"
                    >
                      {t('footer.link.tmf')}
                    </a>
                  </li>
                  <li>
                    <a
                      href={onEnglish ? getAlternateUrl(pathname, 'fr') : '/en/'}
                      className="text-sm leading-6 text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      {onEnglish ? '🇫🇷 Français' : '🇬🇧 English'}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire « newsletter » retiré le 21/11/2026 : ni action, ni
            onSubmit, aucun backend, aucun inscrit. Une soumission rechargeait
            la page avec ?email-address=… dans l'URL, que le page_view GA4
            reprenait (page_path). Ne le rétablir qu'avec un vrai traitement
            (stockage, consentement, désinscription) et une page de
            confidentialité. */}

        {/* Mention de transparence des liens « Voir le prix » (Audit #3.0), dans la langue du reste du pied de page. */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <AffiliateDisclosure className="text-gray-500 max-w-3xl" locale={locale} />
        </div>

        {/* Bottom bar */}
        <div className="mt-6 md:flex md:items-center md:justify-between">
          <p className="text-xs leading-5 text-gray-500">
            &copy; {currentYear} Tennis String Advisor. {t('footer.rights')}
          </p>
          <p className="mt-4 text-xs leading-5 text-gray-500 md:mt-0">
            {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}
