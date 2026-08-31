import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { racquetsDatabase } from '@/data/racquets-database';
import { BuyButton } from '@/components/product/buy-button';
import { SpecList, type Spec } from '@/components/product/spec-list';
import { resolveSiteUrl } from '@/lib/seo/route-metadata';
import { effectiveRacquetRA, isRacquetStiffnessEstimated } from '@/lib/racquet-scoring';

/**
 * Fiche raquette individuelle (Phase 3 SEO, audit du 13/08/2026).
 *
 * Même logique que les fiches cordage : 129 raquettes n'existaient que dans
 * une page de liste, donc aucune surface pour les requêtes de modèle.
 *
 * Point de vigilance : `stiffness` (RA) est absent sur 29 des 129 fiches. On
 * n'affiche JAMAIS la médiane de repli comme une donnée constructeur — le
 * champ est marqué « estimé » via `isRacquetStiffnessEstimated` (règle 3 §4).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return racquetsDatabase.map((r) => ({ slug: r.id }));
}

function getRacquet(slug: string) {
  return racquetsDatabase.find((r) => r.id === slug);
}

function fullName(r: { brand: string; model: string; variant?: string }) {
  return [r.brand, r.model, r.variant].filter(Boolean).join(' ').trim();
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const racquet = getRacquet(params.slug);
  if (!racquet) return {};

  const name = fullName(racquet);
  const title = `${name} — caractéristiques et cordage adapté`;
  const raText =
    racquet.stiffness === null
      ? 'RA non communiqué'
      : `RA ${racquet.stiffness}`;
  const description =
    `${name} : ${racquet.weight} g, tamis ${racquet.headSize} in², ${raText}` +
    `${racquet.stringPattern ? `, plan ${racquet.stringPattern}` : ''}. ` +
    `Trouvez le cordage et la tension adaptés à cette raquette et à votre bras.`;
  const canonical = `${resolveSiteUrl()}/racquets/${racquet.id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: 'website', locale: 'fr_FR', url: canonical, title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function RacquetPage({ params }: { params: { slug: string } }) {
  const racquet = getRacquet(params.slug);
  if (!racquet) notFound();

  const name = fullName(racquet);
  const siteUrl = resolveSiteUrl();
  const raEstimated = isRacquetStiffnessEstimated(racquet);

  const specs: Spec[] = [
    { label: 'Poids (non cordé)', value: racquet.weight, unit: 'g' },
    { label: 'Tamis', value: racquet.headSize, unit: 'in²' },
    {
      label: 'Rigidité (RA)',
      value: raEstimated ? effectiveRacquetRA(racquet) : racquet.stiffness,
      estimated: raEstimated,
    },
    { label: 'Plan de cordage', value: racquet.stringPattern },
    { label: 'Équilibre', value: racquet.balance, unit: 'mm' },
    { label: 'Longueur', value: racquet.length, unit: 'pouces' },
    { label: 'Swingweight', value: racquet.swingWeight },
    { label: 'Catégorie', value: racquet.category },
    { label: 'Niveau', value: racquet.playerLevel?.join(', ') },
    { label: 'Prix indicatif', value: racquet.price?.europe, unit: '€' },
  ];

  // Pas d'`offers` : nous ne vendons pas, et les prix de la base sont
  // indicatifs (69 raquettes ont price.europe === price.usa).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    brand: { '@type': 'Brand', name: racquet.brand },
    category: 'Raquette de tennis',
    ...(racquet.description ? { description: racquet.description } : {}),
    url: `${siteUrl}/racquets/${racquet.id}`,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Poids', value: `${racquet.weight} g` },
      { '@type': 'PropertyValue', name: 'Tamis', value: `${racquet.headSize} in²` },
      // Le RA n'est déclaré que s'il vient du constructeur : une estimation
      // n'a pas sa place dans des données structurées.
      ...(racquet.stiffness !== null
        ? [{ '@type': 'PropertyValue', name: 'Rigidité RA', value: String(racquet.stiffness) }]
        : []),
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Raquettes', item: `${siteUrl}/racquets` },
      { '@type': 'ListItem', position: 3, name },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <nav aria-label="Fil d'ariane" className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        <Link href="/" className="hover:underline">
          Accueil
        </Link>
        <span aria-hidden="true"> › </span>
        <Link href="/racquets" className="hover:underline">
          Raquettes
        </Link>
        <span aria-hidden="true"> › </span>
        <span className="text-slate-900 dark:text-slate-100">{name}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {name}
      </h1>
      {racquet.description && (
        <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          {racquet.description}
        </p>
      )}
      {racquet.proUsage && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Usage professionnel : {racquet.proUsage}
        </p>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
          Caractéristiques
        </h2>
        <SpecList specs={specs} />
        {raEstimated && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            La rigidité RA n&apos;est pas publiée par le constructeur pour ce modèle.
            La valeur affichée est la médiane mesurée sur le catalogue, utilisée
            uniquement pour permettre un calcul indicatif — ce n&apos;est pas une
            donnée constructeur.
          </p>
        )}
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Quel cordage pour cette raquette ?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          La fermeté d&apos;un setup dépend de la raquette, du cordage et de la
          tension à la fois. Le configurateur calcule le score RCS de la
          combinaison complète et signale les montages à risque pour le bras.
        </p>
        <Link
          href="/configurator"
          className="mt-4 inline-block rounded-lg bg-tennis-green-600 px-5 py-2.5 font-semibold text-white hover:bg-tennis-green-700"
        >
          Configurer mon cordage
        </Link>
      </section>

      {/* Lien partenaire APRÈS l'information produit — règle 1 du §4. */}
      <section className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
        <h2 className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">
          Où acheter — lien partenaire
        </h2>
        {/* `catalog_card` : la fiche détail relève de la surface catalogue —
            l'union de `location` ne distingue que configurateur vs catalogue. */}
        <BuyButton brand={racquet.brand} model={racquet.model} variant="outline" location="catalog_card" />
      </section>

      <p className="mt-10 text-sm">
        <Link href="/racquets" className="text-tennis-green-700 hover:underline dark:text-tennis-green-400">
          ← Retour au catalogue des raquettes
        </Link>
      </p>
    </main>
  );
}
