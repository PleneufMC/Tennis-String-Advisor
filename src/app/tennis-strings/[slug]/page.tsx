import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { stringsDatabase } from '@/data/strings-database';
import { BuyButton } from '@/components/product/buy-button';
import { SpecList, RatingBar, type Spec } from '@/components/product/spec-list';
import { resolveSiteUrl } from '@/lib/seo/route-metadata';

/**
 * Fiche cordage individuelle (Phase 3 SEO, audit du 13/08/2026).
 *
 * Le site exposait 190 cordages dans une seule page de liste : aucune surface
 * indexable pour les requêtes d'achat (« Luxilon ALU Power tension »). Cette
 * route génère une page statique par référence à partir de la donnée déjà
 * présente dans `src/data`, sans nouvelle source ni valeur inventée.
 *
 * Server component : contrairement aux pages de catalogue ('use client'), elle
 * peut exporter `generateMetadata` et rendre son JSON-LD côté serveur.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return stringsDatabase.map((s) => ({ slug: s.id }));
}

function getString(slug: string) {
  return stringsDatabase.find((s) => s.id === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const string = getString(params.slug);
  if (!string) return {};

  const name = `${string.brand} ${string.model}`;
  const title = `${name} — cordage ${string.type.toLowerCase()}`;
  const description =
    `${name} : rigidité ${string.stiffness} lb/in, tension recommandée ` +
    `${string.recommendedTension.min}-${string.recommendedTension.max} kg, ` +
    `jauges ${string.gauges.join(', ')} mm. Contrôle ${string.control}/10, ` +
    `confort ${string.comfort}/10. Calculez le RCS de ce cordage avec votre raquette.`;
  const canonical = `${resolveSiteUrl()}/tennis-strings/${string.id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: 'website', locale: 'fr_FR', url: canonical, title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function StringPage({ params }: { params: { slug: string } }) {
  const string = getString(params.slug);
  if (!string) notFound();

  const name = `${string.brand} ${string.model}`;
  const siteUrl = resolveSiteUrl();

  const specs: Spec[] = [
    { label: 'Type', value: string.type },
    { label: 'Rigidité', value: string.stiffness, unit: 'lb/in' },
    {
      label: 'Tension recommandée',
      value: `${string.recommendedTension.min} – ${string.recommendedTension.max}`,
      unit: 'kg',
    },
    { label: 'Jauges disponibles', value: string.gauges.join(', '), unit: 'mm' },
    { label: 'Couleur', value: string.color },
    { label: 'Prix indicatif', value: string.price?.europe, unit: '€' },
  ];

  // JSON-LD volontairement SANS `offers` : nous ne vendons pas ce produit et
  // les prix de la base sont indicatifs (l'audit a relevé price.europe ===
  // price.usa sur 45 cordages). Déclarer une offre serait une donnée fabriquée.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    brand: { '@type': 'Brand', name: string.brand },
    category: `Cordage de tennis ${string.type}`,
    description: string.description,
    url: `${siteUrl}/tennis-strings/${string.id}`,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Rigidité', value: `${string.stiffness} lb/in` },
      {
        '@type': 'PropertyValue',
        name: 'Tension recommandée',
        value: `${string.recommendedTension.min}-${string.recommendedTension.max} kg`,
      },
      { '@type': 'PropertyValue', name: 'Jauges', value: string.gauges.join(', ') + ' mm' },
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Cordages', item: `${siteUrl}/tennis-strings` },
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
        <Link href="/tennis-strings" className="hover:underline">
          Cordages
        </Link>
        <span aria-hidden="true"> › </span>
        <span className="text-slate-900 dark:text-slate-100">{name}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {name}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        {string.description}
      </p>
      {string.proUsage && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Usage professionnel : {string.proUsage}
        </p>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
          Caractéristiques
        </h2>
        <SpecList specs={specs} />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
          Notes de jeu
        </h2>
        <RatingBar label="Contrôle" value={string.control} />
        <RatingBar label="Confort" value={string.comfort} />
        <RatingBar label="Effet" value={string.spin} />
        <RatingBar label="Puissance" value={string.power} />
        <RatingBar label="Durabilité" value={string.durability} />
      </section>

      {/* Le RCS dépend de la raquette ET de la tension : on ne peut pas
          l'afficher ici sans inventer une raquette. On envoie donc au
          configurateur, qui le calcule sur le setup réel du joueur. */}
      <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Ce cordage convient-il à votre bras ?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          La fermeté ressentie dépend de votre raquette et de votre tension, pas du
          cordage seul. Le configurateur calcule le score RCS de votre setup complet
          et signale les combinaisons à risque de tennis elbow.
        </p>
        <Link
          href="/configurator"
          className="mt-4 inline-block rounded-lg bg-tennis-green-600 px-5 py-2.5 font-semibold text-white hover:bg-tennis-green-700"
        >
          Calculer le RCS de mon setup
        </Link>
      </section>

      {/* Lien partenaire APRÈS l'information produit — règle 1 du §4. */}
      <section className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
        <h2 className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">
          Où acheter — lien partenaire
        </h2>
        {/* `catalog_card` : la fiche détail relève de la surface catalogue —
            l'union de `location` ne distingue que configurateur vs catalogue. */}
        <BuyButton brand={string.brand} model={string.model} variant="outline" location="catalog_card" />
      </section>

      <p className="mt-10 text-sm">
        <Link href="/tennis-strings" className="text-tennis-green-700 hover:underline dark:text-tennis-green-400">
          ← Retour au catalogue des cordages
        </Link>
      </p>
    </main>
  );
}
