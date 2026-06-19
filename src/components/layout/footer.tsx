'use client';

import Link from 'next/link';
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
  const { t } = useLanguage();
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
            <Link href="/" className="flex items-center space-x-2 group">
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
                        href={item.href}
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
                        href={item.href}
                        className="text-sm leading-6 text-gray-400 hover:text-white transition-colors"
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a
                      href="/en/"
                      className="text-sm leading-6 text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      🇬🇧 English
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="max-w-md">
              <h3 className="text-sm font-semibold leading-6 text-white">
                {t('footer.newsletter.title')}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                {t('footer.newsletter.desc')}
              </p>
            </div>
            <form className="mt-6 sm:flex sm:max-w-md md:mt-0">
              <label htmlFor="email-address" className="sr-only">
                {t('footer.newsletter.emailLabel')}
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-lg border-0 bg-white/5 px-3 py-2 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                placeholder={t('footer.newsletter.placeholder')}
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 transition-colors"
                >
                  {t('footer.newsletter.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Affiliate disclosure (Audit #3.0) */}
        <div className="mt-8 border-t border-gray-800 pt-8">
          <AffiliateDisclosure className="text-gray-500 max-w-3xl" />
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
