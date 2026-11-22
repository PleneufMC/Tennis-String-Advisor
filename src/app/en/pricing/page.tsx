import type { Metadata } from 'next';
import PricingPage from '@/app/pricing/page';
import { resolveSiteUrl } from '@/lib/seo/route-metadata';

/**
 * Page Premium anglaise (22/11/2026, décision de Pierre : « Il n'y a aucune raison de ne pas faire une page de paiement en
 * anglais pour le premium en incluant les mêmes liens Stripe »).
 *
 * Cette route rend LE MÊME composant que `/pricing` : mêmes trois Payment Links, mêmes prix en euros, même rattachement du
 * paiement au compte du site (`client_reference_id` = id Prisma `User`, que le webhook sait activer). Seuls les textes changent,
 * choisis par l'URL (`src/lib/i18n/pricing.ts`). Elle remplace `/en/premium.html` (Supabase Auth, paiement fermé depuis le
 * 09/10/2026 faute de pouvoir activer un compte Supabase), redirigée ici en 301 (`next.config.js`).
 *
 * Métadonnées en miroir de `src/app/pricing/layout.tsx` (blocs de `tsa-acquisition`, §5 du CLAUDE.md) : même grappe hreflang
 * fr-FR / en-US, canonical sur elle-même, mêmes robots (ceux du layout racine, aucun ajout).
 */
const siteUrl = resolveSiteUrl();
const canonical = `${siteUrl}/en/pricing`;
const french = `${siteUrl}/pricing`;
const title = 'Premium plan';
const description =
  'Unlimited saved setups, advanced RCS analysis and PDF export of your setups (in French). The configurator and the RCS calculation stay free, with no account needed.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
    languages: { 'fr-FR': french, 'en-US': canonical },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_FR',
    url: canonical,
    siteName: 'Tennis String Advisor',
    title,
    description,
  },
  twitter: { card: 'summary_large_image', title, description },
};

export default function EnglishPricingPage() {
  return <PricingPage />;
}
