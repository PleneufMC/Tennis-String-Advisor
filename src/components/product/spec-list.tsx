import React from 'react';

/**
 * Tableau de caractéristiques d'une fiche produit.
 *
 * RÈGLE 3 (§4 CLAUDE.md) : « jamais une valeur comblée présentée comme une
 * donnée constructeur ». Une spec absente n'est pas masquée ni remplacée par
 * une estimation silencieuse — elle est affichée comme « non communiqué ».
 * Une valeur dérivée passe `estimated` et porte une mention explicite.
 */
export interface Spec {
  label: string;
  /** `null` / `undefined` => affiché « non communiqué ». */
  value: string | number | null | undefined;
  unit?: string;
  /** Valeur dérivée ou estimée, pas une donnée constructeur. */
  estimated?: boolean;
}

export function SpecList({ specs }: { specs: Spec[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
      {specs.map((spec) => {
        const missing = spec.value === null || spec.value === undefined || spec.value === '';
        return (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-2 dark:border-slate-700"
          >
            <dt className="text-sm text-slate-600 dark:text-slate-400">{spec.label}</dt>
            <dd
              className={
                missing
                  ? 'text-sm italic text-slate-500 dark:text-slate-500'
                  : 'text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100'
              }
            >
              {missing ? (
                'non communiqué'
              ) : (
                <>
                  {spec.value}
                  {spec.unit ? ` ${spec.unit}` : ''}
                  {spec.estimated && (
                    <span className="ml-1 font-normal text-slate-500 dark:text-slate-400">
                      (estimé)
                    </span>
                  )}
                </>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/** Note sur 10, affichée en barre. Valeur absente => rien (pas de zéro inventé). */
export function RatingBar({ label, value }: { label: string; value?: number | null }) {
  if (value === null || value === undefined) return null;
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="w-28 shrink-0 text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
        role="img"
        aria-label={`${label} : ${value} sur 10`}
      >
        <div className="h-full rounded-full bg-tennis-green-600" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}
