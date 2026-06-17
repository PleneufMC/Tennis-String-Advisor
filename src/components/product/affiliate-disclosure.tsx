import React from 'react';
import { cn } from '@/lib/utils';

interface AffiliateDisclosureProps {
  className?: string;
  /** Variante compacte (1 ligne) pour le footer, ou bloc complet en page. */
  variant?: 'inline' | 'block';
}

/**
 * Mention d'affiliation (Audit #3.0).
 *
 * Obligation légale (transparence consommateur FR / lignes directrices Google) :
 * informer l'utilisateur que certains liens « Voir le prix » sont des liens
 * partenaires pouvant générer une commission, sans surcoût pour lui.
 */
export function AffiliateDisclosure({ className, variant = 'inline' }: AffiliateDisclosureProps) {
  const text =
    'Certains liens « Voir le prix » sont des liens partenaires (affiliation). ' +
    'Si vous effectuez un achat via ces liens, nous pouvons percevoir une ' +
    'commission, sans aucun surcoût pour vous. Cela soutient le site et ' +
    "n'influence pas nos recommandations, fondées sur des critères techniques.";

  if (variant === 'block') {
    return (
      <aside
        className={cn(
          'rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
          className
        )}
        role="note"
      >
        <p className="font-semibold text-gray-700 dark:text-slate-200">Transparence affiliation</p>
        <p className="mt-1 leading-relaxed">{text}</p>
      </aside>
    );
  }

  return (
    <p className={cn('text-xs leading-5 text-gray-500', className)}>{text}</p>
  );
}
