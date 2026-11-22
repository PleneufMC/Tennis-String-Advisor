import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthErrorText, AuthString } from '../auth-text';

export const metadata: Metadata = {
  title: 'Erreur de connexion',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// Messages par code NextAuth, FR et EN : `../auth-text.tsx`.
export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error || 'Default';

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-lg dark:border-red-400/30 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-400/15">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white"><AuthString k="errorTitle" /></h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400"><AuthErrorText error={error} /></p>
          <Link
            href="/auth/signin"
            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            <AuthString k="retry" />
          </Link>
        </div>
      </div>
    </div>
  );
}
