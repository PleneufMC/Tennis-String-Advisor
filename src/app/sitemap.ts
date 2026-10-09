import type { MetadataRoute } from 'next';
import { stringsDatabase } from '@/data/strings-database';
import { racquetsDatabase } from '@/data/racquets-database';

/**
 * Sitemap natif Next.js (App Router).
 *
 * Remplace l'ancien `public/sitemap.xml` qui déclarait ~35 URL fantômes en
 * `.html` (pages inexistantes dans l'app -> soft-404, autorité SEO diluée).
 *
 * Règle : on ne référence QUE des URL qui résolvent réellement.
 *  - Routes Next réelles (sans `.html`).
 *  - Articles de blog : fichiers statiques réels servis sous `/blog/*.html`.
 *
 * Source de vérité : les `page.tsx` de `src/app` et les fichiers de
 * `public/blog/*.html`. À mettre à jour quand une route/un article est ajouté.
 */

// Même garde que le layout racine : une NEXT_PUBLIC_APP_URL pointant sur
// localhost (valeur par défaut de .env.example) publierait un sitemap entier
// d'URL localhost. Le repli sur le domaine canonique doit donc couvrir ce cas,
// pas seulement l'absence de variable.
const CANONICAL_BASE = 'https://tennisstringadvisor.org';
const BASE_URL = (() => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(envUrl)) {
    return envUrl.replace(/\/$/, '');
  }
  return CANONICAL_BASE;
})();

// Routes applicatives réelles (cf. `find src/app -name page.tsx`).
// Les routes purement transactionnelles (payment-success/cancelled) sont
// volontairement exclues du sitemap.
const APP_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/configurator', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/racquets', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/tennis-strings', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/compare', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/statistics', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.6 },
];

// Articles de blog réellement présents dans `public/blog/*.html`.
// (Liste explicite : pas d'accès filesystem au runtime sur l'edge.)
const BLOG_SLUGS: string[] = [
  'head-gravity-mp-vs-gravity-tour-2025.html',
  'plan-de-cordage-tennis.html',
  'jauge-cordage-tennis.html',
  'guide-tension-cordage-tennis.html',
  'cordage-tennis-elbow.html',
  'guide-materiel-tennis.html',
  'analyse-setups-atp-top-20.html',
  'nouveautes-equipement-tennis-2025-2026.html',
  'cordage-terre-battue.html',
  'challengers-sinner-alcaraz-2026.html',
  'actualite-materiel-tennis-2026-guerre-du-spin.html',
  'cordage-mono-vs-multifilament.html',
  'cordage-tennis-chaleur.html',
  'tension-cordage-hiver.html',
  'raquette-point-fort-ou-point-faible.html',
  // Adapté de l'EN next-gen (01/10/2026), appairé en hreflang.
  'materiel-next-gen-fonseca-mensik-cobolli-jodar.html',
  'combien-de-temps-dure-un-cordage.html',
  // Classement polyester 2026 (09/10/2026), appairé en hreflang.
  'meilleur-cordage-polyester-2026.html',
  // Meilleures raquettes 2026 par profil (09/10/2026), appairé en hreflang.
  'meilleures-raquettes-tennis-2026.html',
  // Polyester et tennis elbow, tri par rigidité (09/10/2026), appairé en hreflang.
  'cordage-polyester-tennis-elbow.html',
];

// Pages anglaises statiques publiques (`public/en/*.html`).
// Elles étaient absentes du sitemap alors que trois d'entre elles portent un
// JSON-LD produit riche (racquets, strings, configurator). Les pages
// utilitaires (account, auth, setups) sont volontairement exclues : elles
// sont en `noindex`.
const EN_PAGES: Array<{ path: string; priority: number }> = [
  { path: '/en/', priority: 0.9 },
  { path: '/en/configurator.html', priority: 0.8 },
  { path: '/en/racquets.html', priority: 0.7 },
  { path: '/en/strings.html', priority: 0.7 },
  { path: '/en/compare.html', priority: 0.6 },
  { path: '/en/rcs-calculator.html', priority: 0.6 },
  { path: '/en/faq.html', priority: 0.5 },
  { path: '/en/premium.html', priority: 0.5 },
];

// Articles de blog anglais réellement présents dans `public/en/blog/*.html`.
const EN_BLOG_SLUGS: string[] = [
  'challengers-sinner-alcaraz-2026.html',
  'next-gen-tennis-racquets-fonseca-mensik-cobolli-jodar.html',
  // Guides evergreen adaptés du français (14/08/2026), appairés en hreflang
  // avec leur source FR.
  'tennis-string-gauge.html',
  'tennis-string-pattern.html',
  'polyester-vs-multifilament-strings.html',
  'tennis-string-tension-guide.html',
  // Article chaleur (28/08/2026), appairé en hreflang avec
  // /blog/cordage-tennis-chaleur.html.
  'tennis-strings-heat-tension.html',
  // Adapté du FR raquette-point-fort-ou-point-faible (27/08/2026), appairé en hreflang.
  'racquet-strengths-or-weaknesses.html',
  // Pilier durée de vie (01/10/2026), appairé en hreflang avec
  // /blog/combien-de-temps-dure-un-cordage.html.
  'how-long-do-tennis-strings-last.html',
  // Adapté du FR meilleur-cordage-polyester-2026 (09/10/2026), appairé en hreflang.
  'best-polyester-tennis-strings-2026.html',
  // Adapté du FR tension-cordage-hiver (09/10/2026), appairé en hreflang.
  'tennis-string-tension-cold-weather.html',
  // Adapté du FR cordage-tennis-elbow (09/10/2026), réécrit sur le catalogue, appairé en hreflang.
  'best-tennis-strings-for-tennis-elbow.html',
  // Adapté du FR meilleures-raquettes-tennis-2026 (09/10/2026), appairé en hreflang.
  'best-tennis-racquets-2026.html',
  // Adapté du FR cordage-polyester-tennis-elbow (09/10/2026), appairé en hreflang.
  'polyester-strings-tennis-elbow.html',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const appEntries: MetadataRoute.Sitemap = APP_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Fiches produit individuelles (routes [slug] pré-générées). La source est
  // la base elle-même : impossible qu'une URL du sitemap ne corresponde pas à
  // une page réelle, puisque generateStaticParams lit exactement ces ids.
  const productEntries: MetadataRoute.Sitemap = [
    ...racquetsDatabase.map((r) => `/racquets/${r.id}`),
    ...stringsDatabase.map((s) => `/tennis-strings/${s.id}`),
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const enPageEntries: MetadataRoute.Sitemap = EN_PAGES.map((p) => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: p.priority,
  }));

  const enBlogIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/en/blog/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  const enBlogEntries: MetadataRoute.Sitemap = EN_BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/en/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...appEntries,
    ...productEntries,
    ...blogIndex,
    ...blogEntries,
    ...enPageEntries,
    ...enBlogIndex,
    ...enBlogEntries,
  ];
}
