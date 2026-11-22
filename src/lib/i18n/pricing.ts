/**
 * Textes de la page Premium, FR et EN (22/11/2026, décision de Pierre : « Il n'y a aucune raison de ne pas faire une page de
 * paiement en anglais pour le premium en incluant les mêmes liens Stripe »).
 *
 * UNE SEULE PAGE : `src/app/pricing/page.tsx` est rendu tel quel sur `/pricing` (FR) et sur `/en/pricing` (EN), comme le
 * configurateur. Ce fichier ne porte que des TEXTES : les Payment Links, les prix, le drapeau `CHECKOUT_DISPONIBLE` et la logique
 * `client_reference_id` restent dans la page (contrôle « aucun lien de paiement hors des deux circuits » de
 * `audit:stripe-webhook`). Les valeurs FR sont celles de la page avant extraction, à l'identique.
 */
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isEnglishPath } from './route-map';
import { useLanguage } from './language-provider';

export type PricingLocale = 'fr' | 'en';

/** Langue de la page Premium : celle de l'URL (`/en/…` = anglais), jamais la langue stockée du visiteur. */
export function usePricingLocale(): PricingLocale {
  const pathname = usePathname();
  return isEnglishPath(pathname || '/') ? 'en' : 'fr';
}

// L'URL de retour des Payment Links est fixée dans Stripe : `/payment-success` est la même pour un achat lancé depuis `/pricing`
// ou depuis `/en/pricing`. La langue de la page d'où part le paiement est donc notée au clic, et relue au retour.
const CHECKOUT_LOCALE_KEY = 'tsa-checkout-locale';

export function rememberCheckoutLocale(locale: PricingLocale): void {
  try {
    localStorage.setItem(CHECKOUT_LOCALE_KEY, locale);
  } catch {
    /* Stockage indisponible : le retour suivra la langue du site. */
  }
}

/** Langue des pages de retour de paiement : celle de la page d'achat si elle est connue, sinon celle du site. */
export function useCheckoutReturnLocale(): PricingLocale {
  const { locale } = useLanguage();
  const [remembered, setRemembered] = useState<PricingLocale | null>(null);
  useEffect(() => {
    try {
      const value = localStorage.getItem(CHECKOUT_LOCALE_KEY);
      if (value === 'fr' || value === 'en') setRemembered(value);
    } catch {
      /* Stockage indisponible : langue du site. */
    }
  }, []);
  return remembered ?? locale;
}

const FR = {
  homeHref: '/',
  signinHref: '/auth/signin?callbackUrl=/pricing',
  title: 'Choisissez votre plan',
  subtitle: 'Débloquez toutes les fonctionnalités premium pour optimiser votre jeu',
  monthly: 'Mensuel',
  yearly: 'Annuel',
  // « 2 MOIS GRATUITS » corrigé le 21/11/2026 : 12 × 4,99 € − 49,99 € = 9,89 € d'économie, soit 1,98 mois, pas 2.
  yearlyBadge: 'PRÈS DE 2 MOIS OFFERTS',
  back: '← Retour',
  // Audit 13/08/2026 : ne lister que ce que le code garde réellement (quota serveur premium.ts + export PDF). Les promesses sans
  // implémentation (rappels, stats, support prioritaire) sont retirées.
  free: {
    name: 'Gratuit',
    features: [
      '✅ Configurateur complet',
      '✅ Calcul RCS',
      // Sans nombre écrit en dur : « 190 cordages » avait vieilli (181).
      '✅ Catalogue complet des raquettes et des cordages',
      '✅ 3 configurations sauvegardées dans votre compte',
      '❌ Configurations illimitées',
      '❌ Analyse RCS avancée',
      '❌ Export PDF',
    ],
    button: 'Version actuelle',
  },
  premium: {
    name: 'Premium',
    savings: 'près de 2 mois offerts',
    features: ['✅ Tout du plan gratuit', '✅ Configurations illimitées', '✅ Analyse RCS avancée', '✅ Export PDF professionnel'],
    button: 'Passer Premium',
  },
  // « Prix réservé aux 200 premiers » retiré le 21/11/2026 : aucune limite n'est posée sur le Payment Link dans Stripe, et
  // `LIFETIME_SEATS` (premium.ts) ne fait que cesser d'AFFICHER l'offre ; il ne réserve aucun prix. Ne pas rétablir une rareté
  // que rien n'applique.
  lifetime: {
    name: 'À vie',
    features: [
      '✅ Tout du plan Premium',
      '✅ Payé une seule fois, sans abonnement',
      '✅ Configurations illimitées',
      '✅ Analyse RCS avancée',
      '✅ Export PDF professionnel',
    ],
    button: 'Accès à vie',
  },
  oneTime: 'une fois',
  perMonth: '/mois',
  perYear: '/an',
  accountRequired: 'Un compte gratuit est nécessaire pour souscrire.',
  save: (amount: string, savings: string) => `💰 Économisez €${amount} (${savings})`,
  unavailable: 'Abonnement temporairement indisponible',
  loading: 'Chargement...',
  closedNotice: 'La souscription est momentanément fermée. Le configurateur et le calcul RCS restent gratuits et complets.',
  whyTitle: 'Pourquoi passer Premium ?',
  unlimitedTitle: 'Illimité',
  unlimitedText: 'Sauvegardez toutes vos configurations',
  pdfTitle: 'Export PDF',
  pdfText: 'Imprimez vos configurations',
  rcsTitle: 'RCS Avancé',
  rcsText: 'Recommandations personnalisées',
  // Mention propre à l'anglais (voir EN) : aucune en français.
  languageNote: null as string | null,
  secureTitle: 'Paiement Sécurisé',
  secureText: 'Stripe & SSL',
  cancelTitle: 'Résiliation sur demande',
  cancelText: 'par e-mail :',
  activationTitle: 'Activation automatique',
  activationText: "dès l'encaissement du paiement",
};

export type PricingText = typeof FR;

// Anglais : mêmes offres, mêmes prix en euros (ceux que Stripe encaisse), mêmes Payment Links. Le PDF exporté et l'espace compte
// n'existent qu'en français : l'acheteur anglais le lit avant de payer, plutôt que de le découvrir après.
const EN: PricingText = {
  homeHref: '/en/',
  signinHref: '/auth/signin?callbackUrl=/en/pricing',
  title: 'Choose your plan',
  subtitle: 'Unlock all premium features to optimize your game',
  monthly: 'Monthly',
  yearly: 'Yearly',
  yearlyBadge: 'NEARLY 2 MONTHS FREE',
  back: '← Back',
  free: {
    name: 'Free',
    features: [
      '✅ Full configurator',
      '✅ RCS calculation',
      '✅ Full racquet and string catalog',
      '✅ 3 setups saved in your account',
      '❌ Unlimited setups',
      '❌ Advanced RCS analysis',
      '❌ PDF export',
    ],
    button: 'Current plan',
  },
  premium: {
    name: 'Premium',
    savings: 'nearly 2 months free',
    features: [
      '✅ Everything in the free plan',
      '✅ Unlimited setups',
      '✅ Advanced RCS analysis',
      '✅ Professional PDF export (in French)',
    ],
    button: 'Go Premium',
  },
  lifetime: {
    name: 'Lifetime',
    features: [
      '✅ Everything in Premium',
      '✅ Paid once, no subscription',
      '✅ Unlimited setups',
      '✅ Advanced RCS analysis',
      '✅ Professional PDF export (in French)',
    ],
    button: 'Lifetime access',
  },
  oneTime: 'one-time',
  perMonth: '/month',
  perYear: '/year',
  accountRequired: 'A free account is required to purchase.',
  save: (amount, savings) => `💰 Save €${amount} (${savings})`,
  unavailable: 'Subscription temporarily unavailable',
  loading: 'Loading...',
  closedNotice: 'Purchasing is temporarily closed. The configurator and the RCS calculation remain free and complete.',
  whyTitle: 'Why go Premium?',
  unlimitedTitle: 'Unlimited',
  unlimitedText: 'Save all your setups',
  pdfTitle: 'PDF export',
  pdfText: 'Print your setups (PDF in French)',
  rcsTitle: 'Advanced RCS',
  rcsText: 'Personalized recommendations',
  languageNote:
    'Prices are in euros, as charged by Stripe. The configurator is in English; the PDF export and the account page are in French for now.',
  secureTitle: 'Secure payment',
  secureText: 'Stripe & SSL',
  cancelTitle: 'Cancellation on request',
  cancelText: 'by email:',
  activationTitle: 'Automatic activation',
  activationText: 'as soon as the payment is collected',
};

export const PRICING_TEXT: Record<PricingLocale, PricingText> = { fr: FR, en: EN };
