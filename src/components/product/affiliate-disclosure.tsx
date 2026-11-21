import React from 'react';
import { cn } from '@/lib/utils';
import { isAffiliateEnabled } from '@/lib/affiliate';
import type { Locale } from '@/lib/i18n/dictionaries';

interface AffiliateDisclosureProps {
  className?: string;
  /** Variante compacte (1 ligne) pour le footer, ou bloc complet en page. */
  variant?: 'inline' | 'block';
  /**
   * Langue de la mention : celle du reste du pied de page (`useLanguage().locale`, où la langue de l'URL l'emporte sur `/en/…`).
   * Français par défaut.
   */
  locale?: Locale;
}

/**
 * Textes par langue. Le bouton d'achat (`buy-button.tsx`) reste libellé en français sur les pages anglaises : la version anglaise
 * le cite donc tel qu'il s'affiche, « Voir le prix », avec sa traduction. À revoir si le bouton est traduit.
 */
const TEXTS: Record<Locale, { affiliate: string; direct: string; titleAffiliate: string; titleDirect: string }> = {
  fr: {
    // Affiliation active (variables Awin renseignées au build).
    affiliate:
      'Certains liens « Voir le prix » sont des liens partenaires (affiliation). ' +
      'Si vous effectuez un achat via ces liens, nous pouvons percevoir une ' +
      'commission, sans aucun surcoût pour vous. Cela soutient le site et ' +
      "n'influence pas nos recommandations, fondées sur des critères techniques.",
    // Affiliation inactive : les liens partent en direct, sans rémunération.
    direct:
      'Les liens « Voir le prix » mènent directement chez un revendeur. Ils ne ' +
      'sont pas rémunérés : nous ne percevons aucune commission. Nos ' +
      'recommandations reposent sur des critères techniques.',
    titleAffiliate: 'Transparence affiliation',
    titleDirect: 'Transparence des liens',
  },
  en: {
    affiliate:
      'Some “Voir le prix” (see price) links are partner (affiliate) links. ' +
      'If you buy through them, we may earn a commission at no extra cost to ' +
      'you. This supports the site and does not influence our recommendations, ' +
      'which are based on technical criteria.',
    direct:
      'The “Voir le prix” (see price) links take you directly to a retailer. ' +
      'They are not paid: we earn no commission. Our recommendations are based ' +
      'on technical criteria.',
    titleAffiliate: 'Affiliate disclosure',
    titleDirect: 'About our links',
  },
};

/**
 * Mention de transparence des liens « Voir le prix » (Audit #3.0).
 *
 * Le texte suit l'état RÉEL de l'affiliation (`isAffiliateEnabled`) : tant
 * qu'aucun accord n'existe (production au 21/11/2026), annoncer une commission
 * serait faux. Il bascule seul sur la mention d'affiliation le jour où les
 * variables Awin sont renseignées et le site reconstruit. Même condition dans
 * les deux langues.
 */
export function AffiliateDisclosure({ className, variant = 'inline', locale = 'fr' }: AffiliateDisclosureProps) {
  const affiliate = isAffiliateEnabled();
  const texts = TEXTS[locale] ?? TEXTS.fr;
  const text = affiliate ? texts.affiliate : texts.direct;

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
          {affiliate ? texts.titleAffiliate : texts.titleDirect}
        </p>
        <p className="mt-1 leading-relaxed">{text}</p>
      </aside>
    );
  }

  return (
    <p className={cn('text-xs leading-5 text-gray-500', className)}>{text}</p>
  );
}
