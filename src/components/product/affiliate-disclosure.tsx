import React from 'react';
import { cn } from '@/lib/utils';
import { isAffiliateEnabled } from '@/lib/affiliate';

interface AffiliateDisclosureProps {
  className?: string;
  /** Variante compacte (1 ligne) pour le footer, ou bloc complet en page. */
  variant?: 'inline' | 'block';
}

/** Mention quand l'affiliation est active (variables Awin renseignées au build). */
const TEXT_AFFILIATE =
  'Certains liens « Voir le prix » sont des liens partenaires (affiliation). ' +
  'Si vous effectuez un achat via ces liens, nous pouvons percevoir une ' +
  'commission, sans aucun surcoût pour vous. Cela soutient le site et ' +
  "n'influence pas nos recommandations, fondées sur des critères techniques.";

/** Mention quand l'affiliation est inactive : les liens partent en direct, sans rémunération. */
const TEXT_DIRECT =
  'Les liens « Voir le prix » mènent directement chez un revendeur. Ils ne ' +
  'sont pas rémunérés : nous ne percevons aucune commission. Nos ' +
  'recommandations reposent sur des critères techniques.';

/**
 * Mention de transparence des liens « Voir le prix » (Audit #3.0).
 *
 * Le texte suit l'état RÉEL de l'affiliation (`isAffiliateEnabled`) : tant
 * qu'aucun accord n'existe (production au 21/11/2026), annoncer une commission
 * serait faux. Il bascule seul sur la mention d'affiliation le jour où les
 * variables Awin sont renseignées et le site reconstruit.
 */
export function AffiliateDisclosure({ className, variant = 'inline' }: AffiliateDisclosureProps) {
  const affiliate = isAffiliateEnabled();
  const text = affiliate ? TEXT_AFFILIATE : TEXT_DIRECT;

  if (variant === 'block') {
    return (
      <aside
        className={cn(
          'rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
          className
        )}
        role="note"
      >
        <p className="font-semibold text-gray-700 dark:text-slate-200">
          {affiliate ? 'Transparence affiliation' : 'Transparence des liens'}
        </p>
        <p className="mt-1 leading-relaxed">{text}</p>
      </aside>
    );
  }

  return (
    <p className={cn('text-xs leading-5 text-gray-500', className)}>{text}</p>
  );
}
