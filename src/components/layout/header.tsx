'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage, type TranslationKey } from '@/lib/i18n';
import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';
import { trackPremiumCtaClick } from '@/components/analytics/analytics';

// Navigation items (libellés via clés i18n)
const navigation: { key: TranslationKey; href: string }[] = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.configurator', href: '/configurator' },
  { key: 'nav.racquets', href: '/racquets' },
  { key: 'nav.strings', href: '/tennis-strings' },
  { key: 'nav.compare', href: '/compare' },
];

// NB : on ne référence que des routes qui résolvent réellement.
// - "Guides" pointe vers le blog (les guides y vivent en `public/blog/*.html`).
// - "FAQ" est retiré tant qu'aucune page /faq n'existe (évite un 404).
const secondaryNavigation: { key: TranslationKey; href: string }[] = [
  { key: 'nav.guides', href: '/blog/' },
];

// Icons
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

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

// UserIcon retiré : le bouton de connexion est masqué tant que l'auth est
// désactivée (cf. Audit v1.1 §3.2). À restaurer avec le chantier abonnement.

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <nav className="container-tennis" aria-label="Navigation principale">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <TennisIcon className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Tennis String</span>
                <span className="text-lg font-bold text-green-600 dark:text-tennis-green-400"> Advisor</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-1">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-green-100 text-green-700 dark:bg-tennis-green-500/15 dark:text-tennis-green-400'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-gray-200 mx-2 dark:bg-slate-700" />
            
            {secondaryNavigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'text-green-700 dark:text-tennis-green-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Right side - CTA & User */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Toggles langue + thème */}
            <LanguageToggle />
            <ThemeToggle />

            {/* Premium CTA - Hidden on mobile */}
            <Link
              href="/pricing"
              onClick={() => trackPremiumCtaClick('header_desktop')}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors dark:bg-amber-400/15 dark:text-amber-300 dark:hover:bg-amber-400/25"
            >
              <SparklesIcon className="w-4 h-4" />
              {t('nav.premium')}
            </Link>

            {/* User/Login button : masqué tant que l'auth est désactivée
                (cf. Audit v1.1 §3.2 — auth/checkout en .disabled, route
                /auth/signin -> 404). À réactiver avec le chantier abonnement. */}

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={t('nav.openMenu')}
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-slide-down dark:border-slate-800">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'bg-green-100 text-green-700 dark:bg-tennis-green-500/15 dark:text-tennis-green-400'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
              
              <div className="my-3 border-t border-gray-200 dark:border-slate-800" />
              
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'text-green-700 dark:text-tennis-green-400'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
              
              <div className="my-3 border-t border-gray-200 dark:border-slate-800" />
              
              {/* Mobile Premium CTA */}
              <Link
                href="/pricing"
                onClick={() => {
                  trackPremiumCtaClick('header_mobile');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-amber-700 bg-amber-50 rounded-lg dark:bg-amber-400/10 dark:text-amber-300"
              >
                <SparklesIcon className="w-5 h-5" />
                {t('nav.discoverPremium')}
              </Link>
              
              {/* Sign In mobile masqué : auth désactivée (cf. Audit §3.2). */}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
