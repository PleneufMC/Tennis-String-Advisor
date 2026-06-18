'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        setLoading(false);
        return;
      }

      // Inscription réussie : on connecte directement l'utilisateur.
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (signInRes?.error) {
        // Inscription OK mais connexion auto échouée : on renvoie vers la connexion.
        window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
        return;
      }

      window.location.href = callbackUrl;
    } catch {
      setError('Une erreur réseau est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-200">
          Nom (facultatif)
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre nom"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

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
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8 caractères minimum"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? 'Création du compte…' : 'Créer mon compte'}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-slate-400">
        Déjà un compte ?{' '}
        <Link href="/auth/signin" className="font-medium text-green-600 hover:text-green-700 dark:text-tennis-green-400">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
