'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

type LoadingState = 'google' | 'credentials' | 'magic' | null;

export function SignInForm({ hasGoogle, hasEmail }: SignInFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<LoadingState>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading('google');
    await signIn('google', { callbackUrl });
  };

  // Connexion e-mail / mot de passe (CredentialsProvider).
  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return;
    setLoading('credentials');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    if (res?.error) {
      setError('E-mail ou mot de passe incorrect.');
      setLoading(null);
      return;
    }
    window.location.href = callbackUrl;
  };

  // Connexion par lien magique (EmailProvider) — réutilise l'e-mail saisi.
  const handleMagicLink = async () => {
    setError(null);
    if (!email) {
      setError('Saisissez votre adresse e-mail pour recevoir un lien.');
      return;
    }
    setLoading('magic');
    await signIn('email', { email, callbackUrl });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">
          {error}
        </div>
      )}

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

      {hasGoogle && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
          <span className="text-xs text-gray-400 dark:text-slate-500">ou</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
        </div>
      )}

      {/* Connexion e-mail / mot de passe (toujours disponible) */}
      <form onSubmit={handleCredentials} className="space-y-3">
        <div className="space-y-1">
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
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-200">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading !== null}
          className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
        >
          {loading === 'credentials' ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      {/* Lien magique (si SMTP configuré) — réutilise l'e-mail saisi ci-dessus */}
      {hasEmail && (
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={loading !== null}
          className="w-full rounded-xl border border-green-600 px-4 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50 disabled:opacity-60 dark:border-green-500/60 dark:text-green-400 dark:hover:bg-green-400/10"
        >
          {loading === 'magic' ? 'Envoi du lien…' : 'Recevoir un lien de connexion par e-mail'}
        </button>
      )}

      <p className="text-center text-sm text-gray-500 dark:text-slate-400">
        Pas encore de compte ?{' '}
        <Link href="/auth/signup" className="font-medium text-green-600 hover:text-green-700 dark:text-tennis-green-400">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
