'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

/**
 * Bouton de connexion / menu compte dans le header.
 *
 * - Non connecté → bouton "Se connecter" vers /auth/signin.
 * - Connecté → avatar + menu déroulant (compte, déconnexion).
 * - Chargement → placeholder discret pour éviter le flash.
 *
 * Variante mobile (`mobile`) : rendu en pleine largeur pour le menu burger.
 */
export function AuthButton({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // État de chargement : évite le clignotement connecté/déconnecté.
  if (status === 'loading') {
    return <div className={cn('h-9 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse', mobile ? 'w-full' : 'w-24')} />;
  }

  // Non connecté
  if (!session?.user) {
    if (mobile) {
      return (
        <Link
          href="/auth/signin"
          onClick={onNavigate}
          className="flex items-center gap-2 px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <UserIcon className="w-5 h-5" />
          {t('nav.signin')}
        </Link>
      );
    }
    return (
      <Link
        href="/auth/signin"
        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <UserIcon className="w-4 h-4" />
        {t('nav.signin')}
      </Link>
    );
  }

  // Connecté
  const displayName = session.user.name || session.user.email || '';
  const initial = (displayName || '?').charAt(0).toUpperCase();

  if (mobile) {
    return (
      <div className="px-4 py-2">
        <div className="flex items-center gap-3 mb-2">
          <Avatar image={session.user.image} initial={initial} />
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</span>
        </div>
        <Link
          href="/account/configurations"
          onClick={onNavigate}
          className="block w-full px-0 py-2 text-base font-medium text-gray-700 hover:text-green-700 dark:text-slate-200"
        >
          {t('nav.myConfigurations')}
        </Link>
        <button
          type="button"
          onClick={() => { onNavigate?.(); signOut({ callbackUrl: '/' }); }}
          className="w-full text-left px-0 py-2 text-base font-medium text-red-600 hover:text-red-700"
        >
          {t('nav.signout')}
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/40"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('nav.account')}
      >
        <Avatar image={session.user.image} initial={initial} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
            {session.user.isPremium && (
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                ★ Premium
              </span>
            )}
          </div>
          <Link
            href="/account/configurations"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {t('nav.myConfigurations')}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-400/10"
          >
            {t('nav.signout')}
          </button>
        </div>
      )}
    </div>
  );
}

function Avatar({ image, initial }: { image?: string | null; initial: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />;
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-sm font-semibold text-white">
      {initial}
    </span>
  );
}
