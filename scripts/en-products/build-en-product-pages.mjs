#!/usr/bin/env node
/**
 * Fiches produit anglaises — générées au build depuis src/data (tsa-acquisition, 09/10/2026).
 *
 * Sortie : public/en/racquets/<id>.html (129) et public/en/strings/<id>.html (181),
 * non versionnées (cf. .gitignore), régénérées à chaque `npm run build` (prebuild)
 * et `npm run dev` (predev), exactement comme public/data/catalog.json (C3).
 *
 * Pourquoi du HTML statique et pas une route Next `src/app/en/…` : le layout racine
 * (verrou partagé) impose <html lang="fr">, l'en-tête/pied FR et un dictionnaire
 * résolu côté client — une fiche EN servie par l'app afficherait du français au
 * premier rendu, celui que lisent Bing et Google. L'univers EN est statique
 * (public/en/*.html) : les fiches en font partie, avec la même navigation.
 *
 * Données : le catalogue TS (fait foi) est chargé par le module de tsa-core
 * (scripts/catalog/catalog-json.mjs, importé, non modifié) — même sérialisation
 * que catalog.json, donc mêmes valeurs que les pages EN existantes et que le FR.
 *
 * Règles appliquées :
 *  - règle 3 : un champ absent s'affiche « Not published », jamais comblé ;
 *    le RA estimé (médiane) des fiches FR n'est pas affiché ici, seulement signalé ;
 *  - descriptions du catalogue (rédigées en français) non reprises ; l'usage pro
 *    n'est repris que s'il se traduit sans ajout (sinon omis) ;
 *  - JSON-LD Product sans offers, aggregateRating, review ni image ;
 *  - aucun lien d'achat (règles 1-2, périmètre tsa-revenue) : la fiche renvoie au
 *    configurateur EN, qui calcule le RCS et affiche l'alerte bras.
 *
 * Usage : npm run build:en-products
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCatalog, loadTsCatalog } from '../catalog/catalog-json.mjs';

const SITE = 'https://tennisstringadvisor.org';
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const EN_RACQUET_DIR = 'public/en/racquets';
export const EN_STRING_DIR = 'public/en/strings';
export const enRacquetPath = (id) => `/en/racquets/${id}.html`;
export const enStringPath = (id) => `/en/strings/${id}.html`;
const frRacquetPath = (id) => `/racquets/${id}`;
const frStringPath = (id) => `/tennis-strings/${id}`;

const esc = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const has = (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
// JSON-LD inline : on neutralise « </ » pour qu'aucune valeur ne ferme le <script>.
const ld = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

/**
 * Usage professionnel : la donnée est rédigée en français. On ne traduit que des
 * qualificatifs fermés ; toute mention qui reste en français (affirmation
 * qualitative du type « populaire chez… », « recommandé en sortie de
 * tendinite ») est omise plutôt que traduite librement.
 */
const PRO_TRANSLATIONS = [
  [/^Héritage (.+)$/u, '$1 (legacy)'],
  [/\(héritage\)/gu, '(legacy)'],
  [/\(ancien\)/gu, '(former)'],
  [/\(retraité\)/gu, '(retired)'],
  [/\(customisée\)/gu, '(customised)'],
  [/^Joueurs ATP$/u, 'ATP players'],
];
const FRENCH_MARKERS = /\b(des|chez|joueurs|jeunes|populaire|recommandé|sortie|tendinite|ancien|retraité|héritage|customisée)\b/iu;
export function proUsageEn(value) {
  if (!has(value)) return null;
  let out = value;
  for (const [re, rep] of PRO_TRANSLATIONS) out = out.replace(re, rep);
  return FRENCH_MARKERS.test(out) ? null : out;
}

const NP = '<span class="italic text-gray-500 dark:text-gray-400">Not published</span>';

function specRows(specs) {
  return specs
    .map(([label, value, unit]) => {
      const shown = has(value) ? `<span class="font-semibold tabular-nums">${esc(value)}${unit ? ` ${esc(unit)}` : ''}</span>` : NP;
      return `<div class="flex items-baseline justify-between gap-4 border-b border-gray-200 dark:border-gray-700 py-2"><dt class="text-sm text-gray-600 dark:text-gray-400">${esc(label)}</dt><dd class="text-sm text-right text-gray-900 dark:text-gray-100">${shown}</dd></div>`;
    })
    .join('\n          ');
}

function ratingRow(label, value) {
  if (!has(value)) {
    return `<div class="flex items-center gap-3 py-1"><span class="w-28 shrink-0 text-sm text-gray-600 dark:text-gray-400">${label}</span>${NP}</div>`;
  }
  const pct = Math.max(0, Math.min(100, value * 10));
  return `<div class="flex items-center gap-3 py-1"><span class="w-28 shrink-0 text-sm text-gray-600 dark:text-gray-400">${label}</span><div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700" role="img" aria-label="${label}: ${esc(value)} out of 10"><div class="h-full rounded-full bg-green-600" style="width: ${pct}%"></div></div><span class="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">${esc(value)}</span></div>`;
}

function page({ title, description, enPath, frPath, section, sectionHref, name, jsonLd, body }) {
  const url = `${SITE}${enPath}`;
  const frUrl = `${SITE}${frPath}`;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/en/` },
      { '@type': 'ListItem', position: 2, name: section, item: `${SITE}${sectionHref}` },
      { '@type': 'ListItem', position: 3, name },
    ],
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | Tennis String Advisor</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en-US" href="${url}">
  <link rel="alternate" hreflang="fr-FR" href="${frUrl}">
  <link rel="alternate" hreflang="x-default" href="${frUrl}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <script type="application/ld+json">${ld(jsonLd)}</script>
  <script type="application/ld+json">${ld(breadcrumb)}</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = { darkMode: 'class' }</script>
  <link rel="stylesheet" href="/css/dark-mode.css">
  <script src="/js/theme.js"></script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-YSSLHJ5WYD"></script>
  <script src="/js/analytics.js"></script>
</head>
<body class="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
      <a href="/en/" class="flex items-center gap-2 min-w-0"><span class="text-2xl" aria-hidden="true">🎾</span><span class="font-bold text-lg sm:text-xl truncate">Tennis String Advisor</span></a>
      <nav class="hidden md:flex items-center gap-5 text-sm" aria-label="Main">
        <a href="/en/configurator.html" class="text-gray-600 dark:text-gray-300 hover:text-green-600">Configurator</a>
        <a href="/en/racquets.html" class="${section === 'Racquets' ? 'text-green-700 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-300 hover:text-green-600'}">Racquets</a>
        <a href="/en/strings.html" class="${section === 'Strings' ? 'text-green-700 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-300 hover:text-green-600'}">Strings</a>
        <a href="/en/blog/" class="text-gray-600 dark:text-gray-300 hover:text-green-600">Blog</a>
      </nav>
      <div class="flex items-center gap-2 shrink-0">
        <a href="${frPath}" hreflang="fr" lang="fr" class="px-3 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Version française">FR</a>
        <button onclick="toggleDarkMode()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Toggle dark mode"><span class="theme-icon text-xl">🌙</span></button>
      </div>
    </div>
  </header>

  <main class="max-w-3xl mx-auto px-4 py-10">
    <nav aria-label="Breadcrumb" class="mb-6 text-sm text-gray-600 dark:text-gray-400">
      <a href="/en/" class="hover:underline">Home</a><span aria-hidden="true"> › </span><a href="${sectionHref}" class="hover:underline">${section}</a><span aria-hidden="true"> › </span><span class="text-gray-900 dark:text-gray-100">${esc(name)}</span>
    </nav>
${body}
  </main>

  <footer class="bg-gray-900 text-gray-300 mt-16">
    <div class="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm">
      <nav class="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
        <a href="/en/" class="hover:text-white">Home</a>
        <a href="/en/configurator.html" class="hover:text-white">Configurator</a>
        <a href="/en/racquets.html" class="hover:text-white">Racquets</a>
        <a href="/en/strings.html" class="hover:text-white">Strings</a>
        <a href="/en/faq.html" class="hover:text-white">FAQ</a>
      </nav>
      <p>© 2026 Tennis String Advisor</p>
    </div>
  </footer>
</body>
</html>
`;
}

const fullName = (r) => [r.brand, r.model, r.variant].filter(Boolean).join(' ').trim();
const levelEn = (lv) => (has(lv) ? lv.join(', ') : null);

export function racquetPage(r) {
  const name = fullName(r);
  const raPublished = has(r.stiffness);
  const facts = [
    has(r.weight) ? `${r.weight} g unstrung` : null,
    has(r.head_size) ? `${r.head_size} sq in head` : null,
    raPublished ? `RA ${r.stiffness}` : 'RA not published by the manufacturer',
    has(r.string_pattern) ? `${r.string_pattern} string pattern` : null,
  ].filter(Boolean);
  const title = `${name}: specs, RA stiffness and string advice`;
  const description = `${name}: ${facts.join(', ')}. Find the string and tension that suit this racquet and your arm.`;
  const pro = proUsageEn(r.pro_usage);
  const enPath = enRacquetPath(r.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    brand: { '@type': 'Brand', name: r.brand },
    category: 'Tennis racquet',
    url: `${SITE}${enPath}`,
    additionalProperty: [
      ...(has(r.weight) ? [{ '@type': 'PropertyValue', name: 'Weight (unstrung)', value: `${r.weight} g` }] : []),
      ...(has(r.head_size) ? [{ '@type': 'PropertyValue', name: 'Head size', value: `${r.head_size} sq in` }] : []),
      ...(raPublished ? [{ '@type': 'PropertyValue', name: 'Stiffness (RA)', value: String(r.stiffness) }] : []),
      ...(has(r.string_pattern) ? [{ '@type': 'PropertyValue', name: 'String pattern', value: r.string_pattern }] : []),
    ],
  };

  const specs = [
    ['Weight (unstrung)', r.weight, 'g'],
    ['Head size', r.head_size, 'sq in'],
    ['Stiffness (RA)', r.stiffness],
    ['String pattern', r.string_pattern],
    ['Balance', r.balance, 'mm'],
    ['Length', r.length, 'in'],
    ['Swingweight', r.swing_weight],
    ['Category', r.category],
    ['Level', levelEn(r.player_level)],
    ['Indicative price', r.price_eur, '€'],
  ];

  const body = `    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">${esc(name)}</h1>
    <p class="mt-3 text-lg leading-relaxed text-gray-600 dark:text-gray-300">${esc(name)}: ${esc(facts.join(', '))}.</p>
${pro ? `    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Used on tour by: ${esc(pro)}</p>\n` : ''}
    <section class="mt-10">
      <h2 class="mb-3 text-xl font-semibold">Specifications</h2>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          ${specRows(specs)}
      </dl>
${raPublished ? '' : `      <p class="mt-3 text-xs text-gray-600 dark:text-gray-400">The manufacturer does not publish the RA stiffness of this model. We do not fill it in: the configurator uses the catalogue median only to give an indicative comfort score, and says so.</p>\n`}    </section>

    <section class="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h2 class="text-lg font-semibold">Which string for this racquet?</h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">How firm a setup feels depends on the racquet, the string and the tension together. The configurator computes the RCS comfort score of the full combination and flags setups that are risky for your arm.</p>
      <a href="/en/configurator.html" class="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800">Configure my strings</a>
    </section>

    <p class="mt-10 text-sm"><a href="/en/racquets.html" class="text-green-700 dark:text-green-400 hover:underline">← Back to the racquet catalog</a></p>`;

  return page({ title, description, enPath, frPath: frRacquetPath(r.id), section: 'Racquets', sectionHref: '/en/racquets.html', name, jsonLd, body });
}

export function stringPage(s) {
  const name = `${s.brand} ${s.model}`;
  const tension = has(s.tension_min) && has(s.tension_max) ? `${s.tension_min} – ${s.tension_max}` : null;
  const gauges = has(s.gauges) ? s.gauges.join(', ') : null;
  const notes = [has(s.control) ? `control ${s.control}/10` : null, has(s.comfort) ? `comfort ${s.comfort}/10` : null].filter(Boolean);
  const title = `${name}: ${s.type.toLowerCase()} string stiffness, tension and gauges`;
  const description =
    `${name}: stiffness ${s.stiffness} lb/in` +
    (tension ? `, recommended tension ${s.tension_min}-${s.tension_max} kg` : '') +
    (gauges ? `, gauges ${gauges} mm` : '') +
    '.' +
    (notes.length ? ` Ratings: ${notes.join(', ')}.` : '') +
    ' Check the RCS comfort score with your racquet.';
  const pro = proUsageEn(s.pro_usage);
  const enPath = enStringPath(s.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    brand: { '@type': 'Brand', name: s.brand },
    category: `${s.type} tennis string`,
    url: `${SITE}${enPath}`,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Stiffness', value: `${s.stiffness} lb/in` },
      ...(tension ? [{ '@type': 'PropertyValue', name: 'Recommended tension', value: `${s.tension_min}-${s.tension_max} kg` }] : []),
      ...(gauges ? [{ '@type': 'PropertyValue', name: 'Gauges', value: `${gauges} mm` }] : []),
    ],
  };

  const specs = [
    ['Type', s.type],
    ['Stiffness', s.stiffness, 'lb/in'],
    ['Recommended tension', tension, 'kg'],
    ['Available gauges', gauges, 'mm'],
    ['Colour', s.color],
    ['Indicative price', s.price_eur, '€'],
  ];

  const body = `    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">${esc(name)}</h1>
    <p class="mt-3 text-lg leading-relaxed text-gray-600 dark:text-gray-300">${esc(s.type)} string, stiffness ${esc(s.stiffness)} lb/in${tension ? `, recommended tension ${esc(tension)} kg` : ''}.</p>
${pro ? `    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Used on tour by: ${esc(pro)}</p>\n` : ''}
    <section class="mt-10">
      <h2 class="mb-3 text-xl font-semibold">Specifications</h2>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          ${specRows(specs)}
      </dl>
    </section>

    <section class="mt-10">
      <h2 class="mb-3 text-xl font-semibold">Playing ratings (out of 10)</h2>
      ${['Control', 'Comfort', 'Spin', 'Power', 'Durability'].map((l) => ratingRow(l, s[l.toLowerCase()])).join('\n      ')}
    </section>

    <section class="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h2 class="text-lg font-semibold">Is this string right for your arm?</h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">How firm a string feels depends on your racquet and your tension, not on the string alone. The configurator computes the RCS comfort score of your full setup and flags combinations with a tennis elbow risk.</p>
      <a href="/en/configurator.html" class="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800">Check my setup's RCS</a>
    </section>

    <p class="mt-10 text-sm"><a href="/en/strings.html" class="text-green-700 dark:text-green-400 hover:underline">← Back to the string catalog</a></p>`;

  return page({ title, description, enPath, frPath: frStringPath(s.id), section: 'Strings', sectionHref: '/en/strings.html', name, jsonLd, body });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { racquetsDatabase, stringsDatabase } = await loadTsCatalog(repoRoot);
  const { racquets, strings } = buildCatalog(racquetsDatabase, stringsDatabase);
  const SAFE_ID = /^[a-z0-9-]+$/;
  for (const [dir, list, render] of [
    [EN_RACQUET_DIR, racquets, racquetPage],
    [EN_STRING_DIR, strings, stringPage],
  ]) {
    const abs = path.join(repoRoot, dir);
    rmSync(abs, { recursive: true, force: true }); // dossiers générés, propres à ce script
    mkdirSync(abs, { recursive: true });
    for (const item of list) {
      if (!SAFE_ID.test(item.id)) throw new Error(`id hors format URL : ${item.id}`);
      writeFileSync(path.join(abs, `${item.id}.html`), render(item));
    }
  }
  console.log(`fiches EN : ${racquets.length} raquettes -> ${EN_RACQUET_DIR}/, ${strings.length} cordages -> ${EN_STRING_DIR}/`);
}
