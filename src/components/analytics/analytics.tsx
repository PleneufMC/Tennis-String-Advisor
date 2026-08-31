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

/**
 * LE DÉNOMINATEUR — pourquoi deux événements et non un seul.
 *
 * `configurator_complete` était émis à CHAQUE recalcul, sa signature de
 * déduplication incluant les tensions. Un joueur qui essaie cinq tensions sur
 * la même raquette produisait donc cinq « complétions ». Le compteur mesurait
 * *les configurations explorées*, pas *les utilisateurs qui aboutissent* — et
 * c'est ce compteur gonflé qui sert de dénominateur à l'objectif du §8
 * (`affiliate_click / configurator_complete`) et à son critère d'arrêt.
 *
 * Séparation :
 *   - `configurator_result_view` : chaque affichage de résultat, y compris un
 *     simple changement de tension. Mesure l'exploration.
 *   - `configurator_complete` : une fois par couple raquette + cordages,
 *     SANS les tensions dans la signature. Mesure l'aboutissement.
 *
 * ⚠️ Le compteur `configurator_complete` va donc BAISSER par construction.
 * Ce n'est pas une régression : c'est la même réalité, enfin comptée
 * correctement. Toute comparaison avec les chiffres d'avant le 14/08/2026
 * est invalide.
 */
export const trackConfiguratorComplete = (rcsScore: number, compatibility?: number) => {
  gaEvent('configurator_complete', {
    rcs_score: Math.round(rcsScore),
    compatibility: compatibility !== undefined ? Math.round(compatibility) : undefined,
  });
};

/** Affichage d'un résultat RCS, y compris après un simple ajustement de tension. */
export const trackConfiguratorResultView = (rcsScore: number) => {
  gaEvent('configurator_result_view', { rcs_score: Math.round(rcsScore) });
};

/**
 * Entrée dans le parcours : première sélection faite par l'utilisateur.
 * `configurator_step` n'était émis QUE par le configurateur anglais statique —
 * le taux de complétion rapportait donc un numérateur venu des deux univers à
 * un dénominateur venu d'un seul.
 */
export const trackConfiguratorStart = (step: string) => {
  gaEvent('configurator_step', { step_name: step });
};

/**
 * Un avertissement de risque bras a été AFFICHÉ à l'écran.
 *
 * Sans cet événement, le respect de la règle 2 n'est vérifiable que par
 * lecture du code — et c'est précisément ce qui a permis à l'alerte de rester
 * invisible pendant des mois derrière un flou CSS, sans que rien ne le signale.
 */
export const trackArmWarningShown = (rcsScore: number, armSensitive: boolean) => {
  gaEvent('arm_warning_shown', {
    rcs_score: Math.round(rcsScore),
    arm_sensitive: armSensitive,
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
/**
 * `location` distingue la SURFACE d'émission du clic — `configurator_result`
 * vs `catalog_card` — sans quoi l'indicateur du §8
 * (`affiliate_click / configurator_complete`) mélange des clics qui n'ont pas
 * le même dénominateur. Rôle distinct de `link_type`, qui reste la preuve
 * d'activation Awin et ne doit jamais servir à porter la surface.
 *
 * PAS de valeur par défaut, volontairement : l'unique appelant (`BuyButton`)
 * sert déjà les deux surfaces — un défaut `catalog_card` étiquetterait à tort
 * les clics du configurateur tant que l'appelant ne passe rien. Absent, GA4
 * affiche « (not set) » : ça se lit comme « émetteur pas encore migré », pas
 * comme une fausse donnée.
 */
export const trackAffiliateClick = (
  merchant: string,
  product?: string,
  linkType: 'awin' | 'direct' = 'direct',
  location?: 'configurator_result' | 'catalog_card'
) => {
  gaEvent('affiliate_click', { merchant, product, link_type: linkType, location });
};

// Clic sur un CTA Premium (audit #0.3).
export const trackPremiumCtaClick = (location: string) => {
  gaEvent('premium_cta_click', { cta_location: location });
};