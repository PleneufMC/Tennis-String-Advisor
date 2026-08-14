'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface AnalyticsProps {
  measurementId?: string;
}

function AnalyticsInner({ measurementId }: AnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined' || !window.gtag) {
      return;
    }

    // searchParams n'est jamais null (ReadonlyURLSearchParams) : on teste la chaîne.
    const search = searchParams.toString();
    const url = search ? `${pathname}?${search}` : pathname;

    // Un seul page_view par navigation — l'init du layout est en send_page_view: false,
    // un second gtag('config') ici provoquait un double comptage au chargement initial.
    window.gtag('event', 'page_view', {
      page_path: url,
    });
  }, [pathname, searchParams, measurementId]);

  // Analytics script is loaded in layout.tsx head
  return null;
}

export function Analytics({ measurementId }: AnalyticsProps) {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner measurementId={measurementId} />
    </Suspense>
  );
}

// --- Events du funnel (nomenclature GA4 de l'audit #0.3) ---------------------
// Envoi bas-niveau d'un event GA4 avec des paramètres nommés (recommandé GA4),
// plutôt que la convention event_category/label de l'ancien helper.
const gaEvent = (name: string, params: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
};

// Recommandation RCS calculée / configurateur complété.
// À marquer comme « key event » (conversion) dans GA4.
export const trackConfiguratorComplete = (rcsScore: number, compatibility?: number) => {
  gaEvent('configurator_complete', {
    rcs_score: Math.round(rcsScore),
    compatibility: compatibility !== undefined ? Math.round(compatibility) : undefined,
  });
};

// Clic sur un lien d'affiliation « où acheter » (cf. ticket #3 / audit #3.0).
// À marquer comme « key event » (conversion) dans GA4.
/**
 * `link_type` distingue un deep-link Awin tracké d'un lien direct non rémunéré.
 *
 * C'est la SEULE preuve lisible depuis la production que l'activation Awin a
 * bien pris : les variables `NEXT_PUBLIC_AWIN_*` sont inlinées au build, donc
 * les renseigner dans Netlify sans redéployer ne change rien — et rien à
 * l'écran ne le signalerait. Si les clics continuent d'arriver en `direct`
 * après le déploiement d'activation, c'est que le build n'a pas été relancé.
 */
export const trackAffiliateClick = (
  merchant: string,
  product?: string,
  linkType: 'awin' | 'direct' = 'direct'
) => {
  gaEvent('affiliate_click', { merchant, product, link_type: linkType });
};

// Clic sur un CTA Premium (audit #0.3).
export const trackPremiumCtaClick = (location: string) => {
  gaEvent('premium_cta_click', { cta_location: location });
};