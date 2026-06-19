'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { racquetsDatabase } from '@/data/racquets-database';
import { stringsDatabase } from '@/data/strings-database';
import { exportConfigurationPdf } from '@/lib/pdf-export';

interface ServerConfiguration {
  id: string;
  name: string;
  racquetId: string;
  mainStringId: string;
  crossStringId: string | null;
  mainGauge: string;
  crossGauge: string;
  mainTension: number;
  crossTension: number;
  rating: number;
  notes: string | null;
  rcsScore: number;
  compatibility: number;
  createdAt: string;
}

interface Quota {
  used: number;
  limit: number;
  isPremium: boolean;
  freeLimit: number;
}

function racquetLabel(id: string): string {
  const r = racquetsDatabase.find((x) => x.id === id);
  return r ? `${r.brand} ${r.model} ${r.variant}`.trim() : id;
}

function stringLabel(id: string | null): string | null {
  if (!id) return null;
  const s = stringsDatabase.find((x) => x.id === id);
  return s ? `${s.brand} ${s.model}`.trim() : id;
}

/**
 * Bandeau de quota. Pour les comptes premium : message « illimité ».
 * Pour les comptes gratuits : jauge « X/3 » + CTA Premium si la limite est
 * atteinte.
 */
function QuotaBanner({ quota }: { quota: Quota | null }) {
  if (!quota) return null;

  if (quota.isPremium) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
        ⭐ <span className="font-semibold">Premium actif</span> — journal de cordage{' '}
        <span className="font-semibold">illimité</span>.
      </div>
    );
  }

  const { used, freeLimit } = quota;
  const reached = used >= freeLimit;
  const pct = Math.min(100, Math.round((used / freeLimit) * 100));

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        reached
          ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300'
          : 'border-gray-200 bg-white text-gray-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span>
          Plan gratuit : <span className="font-semibold">{used}/{freeLimit}</span>{' '}
          configuration{freeLimit > 1 ? 's' : ''} enregistrée{used > 1 ? 's' : ''}.
        </span>
        <Link
          href="/pricing"
          className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
        >
          Passer Premium
        </Link>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${reached ? 'bg-amber-500' : 'bg-green-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {reached && (
        <p className="mt-2 text-xs">
          Limite atteinte. Supprimez une configuration ou passez Premium pour un
          journal illimité.
        </p>
      )}
    </div>
  );
}

export function ConfigurationsClient() {
  const router = useRouter();
  const [configs, setConfigs] = useState<ServerConfiguration[]>([]);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const isPremium = quota?.isPremium ?? false;

  const handleExport = async (c: ServerConfiguration) => {
    // Garde Premium : un compte gratuit est redirigé vers l'offre.
    if (!isPremium) {
      router.push('/pricing');
      return;
    }
    setExportingId(c.id);
    setError(null);
    try {
      await exportConfigurationPdf({
        name: c.name,
        racquetLabel: racquetLabel(c.racquetId),
        mainStringLabel: stringLabel(c.mainStringId) ?? c.mainStringId,
        crossStringLabel: stringLabel(c.crossStringId),
        mainGauge: c.mainGauge,
        crossGauge: c.crossGauge,
        mainTension: c.mainTension,
        crossTension: c.crossTension,
        rating: c.rating,
        notes: c.notes,
        rcsScore: c.rcsScore,
        compatibility: c.compatibility,
        createdAt: c.createdAt,
      });
    } catch {
      setError("L'export PDF a échoué. Réessayez.");
    } finally {
      setExportingId(null);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/configurations');
      if (!res.ok) throw new Error('fetch failed');
      const data = (await res.json()) as {
        configurations: ServerConfiguration[];
        quota?: Quota;
      };
      setConfigs(data.configurations);
      setQuota(data.quota ?? null);
    } catch {
      setError('Impossible de charger vos configurations. Réessayez.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement cette configuration ?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/configurations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      setConfigs((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('La suppression a échoué. Réessayez.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">
        {error}
        <button onClick={load} className="ml-2 font-semibold underline">
          Réessayer
        </button>
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <div className="space-y-4">
        <QuotaBanner quota={quota} />
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 text-4xl">📚</div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Votre journal est vide
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-slate-400">
            Sauvegardez vos configurations depuis le configurateur pour les
            retrouver ici, sur tous vos appareils.
          </p>
          <Link
            href="/configurator"
            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            Ouvrir le configurateur
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <QuotaBanner quota={quota} />
      <p className="text-sm text-gray-500 dark:text-slate-400">
        {configs.length} configuration{configs.length > 1 ? 's' : ''} enregistrée
        {configs.length > 1 ? 's' : ''}.
      </p>

      <ul className="space-y-3">
        {configs.map((c) => {
          const cross = stringLabel(c.crossStringId);
          return (
            <li
              key={c.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{c.name}</h3>
                    {c.rating > 0 && (
                      <span className="text-xs text-amber-500">
                        {'★'.repeat(c.rating)}
                        <span className="text-gray-300 dark:text-slate-600">
                          {'★'.repeat(5 - c.rating)}
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                    🎾 {racquetLabel(c.racquetId)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    🎯 {stringLabel(c.mainStringId)} {c.mainGauge}mm
                    {cross && ` / ${cross} ${c.crossGauge}mm`}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                    Tension {c.mainTension}/{c.crossTension} kg · RCS {c.rcsScore.toFixed(1)} ·
                    Compatibilité {c.compatibility.toFixed(0)}% ·{' '}
                    {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  {c.notes && (
                    <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs italic text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                      {c.notes}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleExport(c)}
                    disabled={exportingId === c.id}
                    title={
                      isPremium
                        ? 'Exporter cette configuration en PDF'
                        : 'Export PDF réservé au plan Premium'
                    }
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                      isPremium
                        ? 'border-green-200 text-green-700 hover:bg-green-50 dark:border-green-400/30 dark:text-green-400 dark:hover:bg-green-400/10'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {exportingId === c.id
                      ? 'Export…'
                      : isPremium
                        ? '📄 Export PDF'
                        : '🔒 Export PDF'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-400/30 dark:text-red-400 dark:hover:bg-red-400/10"
                  >
                    {deletingId === c.id ? 'Suppression…' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
