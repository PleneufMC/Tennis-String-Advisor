import type { MetadataRoute } from 'next';

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

const BASE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || 'https://tennisstringadvisor.org'
).replace(/\/$/, '');

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
  'guide-tension-cordage-tennis.html',
  'cordage-tennis-elbow.html',
  'guide-materiel-tennis.html',
  'analyse-setups-atp-top-20.html',
  'nouveautes-equipement-tennis-2025-2026.html',
  'cordage-terre-battue.html',
  'challengers-sinner-alcaraz-2026.html',
  'actualite-materiel-tennis-2026-guerre-du-spin.html',
];

// Articles de blog anglais réellement présents dans `public/en/blog/*.html`.
const EN_BLOG_SLUGS: string[] = [
  'challengers-sinner-alcaraz-2026.html',
  'next-gen-tennis-racquets-fonseca-mensik-cobolli-jodar.html',
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
    ...blogIndex,
    ...blogEntries,
    ...enBlogIndex,
    ...enBlogEntries,
  ];
}
