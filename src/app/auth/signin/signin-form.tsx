'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

interface SignInFormProps {
  hasGoogle: boolean;
  hasEmail: boolean;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export function SignInForm({ hasGoogle, hasEmail }: SignInFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<'google' | 'email' | null>(null);

  const handleGoogle = async () => {
    setLoading('google');
    await signIn('google', { callbackUrl });
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading('email');
    await signIn('email', { email, callbackUrl });
  };

  if (!hasGoogle && !hasEmail) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
        La connexion sera disponible très prochainement. Aucun fournisseur
        d&apos;authentification n&apos;est encore configuré.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasGoogle && (
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <GoogleIcon className="h-5 w-5" />
          {loading === 'google' ? 'Redirection…' : 'Continuer avec Google'}
        </button>
      )}

      {hasGoogle && hasEmail && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
          <span className="text-xs text-gray-400 dark:text-slate-500">ou</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
        </div>
      )}

      {hasEmail && (
        <form onSubmit={handleEmail} className="space-y-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-200">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={loading !== null}
            className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {loading === 'email' ? 'Envoi du lien…' : 'Recevoir un lien de connexion'}
          </button>
        </form>
      )}
    </div>
  );
}
