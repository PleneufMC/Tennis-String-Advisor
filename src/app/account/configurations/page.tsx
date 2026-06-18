import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ConfigurationsClient } from './configurations-client';

export const metadata: Metadata = {
  title: 'Mon journal de cordage',
  description: 'Retrouvez toutes vos configurations de cordage sauvegardées, synchronisées sur tous vos appareils.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AccountConfigurationsPage() {
  const session = await getServerSession(authOptions);

  // Fonctionnalité réservée aux utilisateurs connectés.
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/account/configurations');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            📚 Mon journal de cordage
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Vos configurations sauvegardées, accessibles depuis tous vos appareils.
          </p>
        </div>
        <Link
          href="/configurator"
          className="inline-flex rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          + Nouvelle configuration
        </Link>
      </div>

      <ConfigurationsClient />
    </div>
  );
}
