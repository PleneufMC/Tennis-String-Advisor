import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Vérifiez vos e-mails',
  robots: { index: false, follow: false },
};

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-400/15">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Vérifiez vos e-mails</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            Un lien de connexion vient de vous être envoyé. Cliquez dessus pour
            accéder à votre compte. Pensez à vérifier vos courriers indésirables.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex font-medium text-green-600 hover:text-green-700 dark:text-tennis-green-400"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
