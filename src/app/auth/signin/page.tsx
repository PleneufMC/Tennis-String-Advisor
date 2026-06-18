import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { SignInForm } from './signin-form';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à Tennis String Advisor pour sauvegarder vos configurations et accéder aux fonctionnalités Premium.',
  robots: { index: false, follow: false },
};

// Page dynamique : dépend des providers configurés (variables d'env runtime).
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  const hasGoogle = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  const hasEmail = Boolean(
    process.env.EMAIL_SERVER_HOST &&
      process.env.EMAIL_SERVER_USER &&
      process.env.EMAIL_SERVER_PASSWORD
  );

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700">
              <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M2 12h20M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connexion</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Accédez à vos configurations et au Premium.
            </p>
          </div>

          <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />}>
            <SignInForm hasGoogle={hasGoogle} hasEmail={hasEmail} />
          </Suspense>

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-500">
            En vous connectant, vous acceptez nos conditions d&apos;utilisation et
            notre politique de confidentialité.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
          <Link href="/" className="font-medium text-green-600 hover:text-green-700 dark:text-tennis-green-400">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
