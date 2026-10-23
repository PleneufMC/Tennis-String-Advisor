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
// Date de dernière modification de chaque article : celle de son JSON-LD (`dateModified`),
// que le rédacteur met à jour quand un chiffre ou une phrase du corps change. C'est la seule
// `lastmod` du sitemap : une date que rien n'établit (ou la date du build) n'est pas publiée.
// `npm run audit:jsonld` échoue si une date diffère de celle de l'article ou si un article manque.
const BLOG_ARTICLES: Array<{ slug: string; modified: string }> = [
  // Comparatif Gravity MP vs Tour retiré le 10/10/2026 (décision de Pierre) :
  // 301 vers le classement 2026, cf. redirects() de next.config.js.
  { slug: 'plan-de-cordage-tennis.html', modified: '2026-06-01' },
  { slug: 'jauge-cordage-tennis.html', modified: '2026-06-01' },
  { slug: 'guide-tension-cordage-tennis.html', modified: '2026-10-21' },
  { slug: 'cordage-tennis-elbow.html', modified: '2026-10-22' },
  { slug: 'guide-materiel-tennis.html', modified: '2026-10-21' },
  { slug: 'analyse-setups-atp-top-20.html', modified: '2025-12-21' },
  { slug: 'nouveautes-equipement-tennis-2025-2026.html', modified: '2026-01-06' },
  { slug: 'cordage-terre-battue.html', modified: '2026-10-21' },
  { slug: 'challengers-sinner-alcaraz-2026.html', modified: '2026-10-10' },
  { slug: 'actualite-materiel-tennis-2026-guerre-du-spin.html', modified: '2026-10-10' },
  { slug: 'cordage-mono-vs-multifilament.html', modified: '2026-10-21' },
  { slug: 'cordage-tennis-chaleur.html', modified: '2026-08-28' },
  { slug: 'tension-cordage-hiver.html', modified: '2026-10-01' },
  { slug: 'raquette-point-fort-ou-point-faible.html', modified: '2026-08-27' },
  // Adapté de l'EN next-gen (01/10/2026), appairé en hreflang.
  { slug: 'materiel-next-gen-fonseca-mensik-cobolli-jodar.html', modified: '2026-10-10' },
  { slug: 'combien-de-temps-dure-un-cordage.html', modified: '2026-10-01' },
  // Classement polyester 2026 (09/10/2026), appairé en hreflang.
  { slug: 'meilleur-cordage-polyester-2026.html', modified: '2026-10-10' },
  // Meilleures raquettes 2026 par profil (09/10/2026), appairé en hreflang.
  { slug: 'meilleures-raquettes-tennis-2026.html', modified: '2026-10-10' },
  // Polyester et tennis elbow, tri par rigidité (09/10/2026), appairé en hreflang.
  { slug: 'cordage-polyester-tennis-elbow.html', modified: '2026-10-22' },
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
// Même règle de date que BLOG_ARTICLES (dateModified du JSON-LD de l'article).
const EN_BLOG_ARTICLES: Array<{ slug: string; modified: string }> = [
  { slug: 'challengers-sinner-alcaraz-2026.html', modified: '2026-10-10' },
  { slug: 'next-gen-tennis-racquets-fonseca-mensik-cobolli-jodar.html', modified: '2026-10-01' },
  // Guides evergreen adaptés du français (14/08/2026), appairés en hreflang
  // avec leur source FR.
  { slug: 'tennis-string-gauge.html', modified: '2026-08-14' },
  { slug: 'tennis-string-pattern.html', modified: '2026-08-14' },
  { slug: 'polyester-vs-multifilament-strings.html', modified: '2026-10-21' },
  { slug: 'tennis-string-tension-guide.html', modified: '2026-10-21' },
  // Article chaleur (28/08/2026), appairé en hreflang avec
  // /blog/cordage-tennis-chaleur.html.
  { slug: 'tennis-strings-heat-tension.html', modified: '2026-08-28' },
  // Adapté du FR raquette-point-fort-ou-point-faible (27/08/2026), appairé en hreflang.
  { slug: 'racquet-strengths-or-weaknesses.html', modified: '2026-08-27' },
  // Pilier durée de vie (01/10/2026), appairé en hreflang avec
  // /blog/combien-de-temps-dure-un-cordage.html.
  { slug: 'how-long-do-tennis-strings-last.html', modified: '2026-10-01' },
  // Adapté du FR meilleur-cordage-polyester-2026 (09/10/2026), appairé en hreflang.
  { slug: 'best-polyester-tennis-strings-2026.html', modified: '2026-10-10' },
  // Adapté du FR tension-cordage-hiver (09/10/2026), appairé en hreflang.
  { slug: 'tennis-string-tension-cold-weather.html', modified: '2026-10-09' },
  // Adapté du FR cordage-tennis-elbow (09/10/2026), réécrit sur le catalogue, appairé en hreflang.
  { slug: 'best-tennis-strings-for-tennis-elbow.html', modified: '2026-10-22' },
  // Adapté du FR meilleures-raquettes-tennis-2026 (09/10/2026), appairé en hreflang.
  { slug: 'best-tennis-racquets-2026.html', modified: '2026-10-10' },
  // Adapté du FR cordage-polyester-tennis-elbow (09/10/2026), appairé en hreflang.
  { slug: 'polyester-strings-tennis-elbow.html', modified: '2026-10-22' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const appEntries: MetadataRoute.Sitemap = APP_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog/`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = BLOG_ARTICLES.map(({ slug, modified }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: modified,
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
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Fiches produit EN statiques (09/10/2026), une par id du catalogue, générées
  // au build par scripts/en-products/ à partir de la même base : même garantie
  // qu'au-dessus, aucune URL sans page.
  const enProductEntries: MetadataRoute.Sitemap = [
    ...racquetsDatabase.map((r) => `/en/racquets/${r.id}.html`),
    ...stringsDatabase.map((s) => `/en/strings/${s.id}.html`),
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const enPageEntries: MetadataRoute.Sitemap = EN_PAGES.map((p) => ({
    url: `${BASE_URL}${p.path}`,
    changeFrequency: 'monthly',
    priority: p.priority,
  }));

  const enBlogIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/en/blog/`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  const enBlogEntries: MetadataRoute.Sitemap = EN_BLOG_ARTICLES.map(({ slug, modified }) => ({
    url: `${BASE_URL}/en/blog/${slug}`,
    lastModified: modified,
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
    ...enProductEntries,
  ];
}
