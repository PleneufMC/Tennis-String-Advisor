'use client';

import React from 'react';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { trackAffiliateClick } from '@/components/analytics/analytics';
import {
  buildProductLink,
  getMerchantLabel,
  DEFAULT_MERCHANT,
  type MerchantKey,
} from '@/lib/affiliate';

interface BuyButtonProps {
  /** Marque du produit (ex. "Babolat"). */
  brand: string;
  /** Modèle du produit (ex. "RPM Blast"). */
  model: string;
  /** Marchand ciblé (par défaut Tennis-Point). */
  merchant?: MerchantKey;
  /** Style du bouton. */
  variant?: 'default' | 'outline';
  /** Taille du bouton. */
  size?: 'sm' | 'default' | 'lg';
  /** Afficher l'icône panier. */
  showIcon?: boolean;
  className?: string;
}

/**
 * Bouton d'affiliation « Voir le prix » (Audit #3.0).
 *
 * - Lien externe vers la boutique du marchand (recherche du produit).
 * - rel="sponsored noopener noreferrer" : obligatoire pour un lien affilié
 *   (conformité Google + sécurité target=_blank).
 * - Émet l'événement GA4 `affiliate_click` au clic (helper déjà branché).
 * - Si l'affiliation n'est pas encore activée (pas d'ID Awin), le lien reste
 *   fonctionnel en direct (non tracké) → aucune régression UX.
 */
export function BuyButton({
  brand,
  model,
  merchant = DEFAULT_MERCHANT,
  variant = 'default',
  size = 'sm',
  showIcon = true,
  className,
}: BuyButtonProps) {
  const href = buildProductLink(brand, model, merchant);
  const merchantLabel = getMerchantLabel(merchant);
  const productName = [brand, model].filter(Boolean).join(' ').trim();

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={() => trackAffiliateClick(merchant, productName)}
      className={cn(
        buttonVariants({ variant, size }),
        'group/buy gap-1.5 no-underline',
        className
      )}
      aria-label={`Voir le prix de ${productName} sur ${merchantLabel} (lien partenaire)`}
    >
      {showIcon && <ShoppingCart className="h-4 w-4" aria-hidden="true" />}
      <span>Voir le prix sur {merchantLabel}</span>
      <ExternalLink
        className="h-3.5 w-3.5 opacity-70 transition-transform group-hover/buy:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
