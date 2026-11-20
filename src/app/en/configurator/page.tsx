import type { Metadata } from 'next';
import ConfiguratorPage from '@/app/configurator/page';
import { resolveSiteUrl } from '@/lib/seo/route-metadata';

/**
 * Configurateur anglais (20/11/2026, demande de Pierre : « Le configurator en anglais doit être le même qu'en français »).
 *
 * Cette route rend LE MÊME composant que `/configurator` : même parcours, mêmes fonctions, même calcul, mêmes alertes. Seuls les
 * textes changent, choisis par l'URL (`src/lib/i18n/configurator.ts`). Elle remplace la page statique `/en/configurator.html`
 * (questionnaire en quatre étapes, moteur `public/js/rcs-calculator-en.js`), retirée et redirigée ici en 301 (`next.config.js`).
 */
const siteUrl = resolveSiteUrl();
const canonical = `${siteUrl}/en/configurator`;
const french = `${siteUrl}/configurator`;
const title = 'String and tension configurator';
const description =
  "Combine racquet, string and tension and read your setup's RCS index. The RCS score flags setups that are too firm, at risk of tennis elbow.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
    languages: { 'fr-FR': french, 'en-US': canonical, 'x-default': french },
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

// Données structurées reprises de l'ancienne page statique, décrivant ce que fait désormais la page (même parcours que le FR).
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tennis String Advisor Configurator',
    description:
      'Configurator for your own tennis setup (racquet, string, gauge, tension), with the RCS firmness index and its arm-alert thresholds',
    url: canonical,
    inLanguage: 'en',
    applicationCategory: 'SportsApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Free analysis; a free account saves up to 3 setups, Premium from €4.99 per month for unlimited setups',
    },
    featureList: [
      'RCS firmness index of your racquet, string and tension',
      'Arm alert from index 35, or from 32 if a sensitive arm is declared',
      'Hybrid setups (different main and cross strings)',
      'Stringing log',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/en/` },
      { '@type': 'ListItem', position: 2, name: 'Configurator', item: canonical },
    ],
  },
];

export default function EnglishConfiguratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ConfiguratorPage />
    </>
  );
}
