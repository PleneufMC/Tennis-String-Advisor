#!/usr/bin/env node
/**
 * QA A3 — garde-fou de l'instrument « taux blog → configurateur ».
 *
 * La mesure A3 (reports/a3-blog-vers-configurateur.md) repose sur le
 * `page_referrer` GA4 : un clic d'article (HTML statique) vers le
 * configurateur est une navigation complète same-origin, le navigateur
 * transmet donc l'URL de l'article en referrer, et GA4 la collecte
 * automatiquement avec le page_view d'arrivée. Aucun code custom — mais
 * personne ne verrait cette chaîne se casser : GA4 continuerait de compter
 * des page_view, seul le croisement referrer × destination deviendrait
 * silencieusement vide ou faux.
 *
 * Ce script échoue si l'un des maillons disparaît :
 *  1. chaque page de blog FR/EN charge le loader gtag et /js/analytics.js,
 *     une seule fois chacun ;
 *  2. aucune page de blog ne configure gtag une seconde fois en inline —
 *     l'unique gtag('config') vit dans analytics.js (un doublon = double
 *     page_view = dénominateur gonflé, c'est le bug corrigé le 13/08 côté
 *     React) ;
 *  3. chaque article contient au moins un lien vers son configurateur
 *     (FR → /configurator, EN → /en/configurator.html) ;
 *  4. aucun de ces liens ne porte rel="noreferrer" ni referrerpolicy :
 *     le referrer serait supprimé et le numérateur tomberait à zéro sans
 *     qu'aucun chiffre ne paraisse anormal ;
 *  5. le layout Next garde send_page_view:false et monte <Analytics> —
 *     c'est ce qui garantit UN page_view par arrivée sur /configurator ;
 *  6. le configurateur EN statique charge analytics (sinon l'univers EN
 *     sort de la mesure sans le dire).
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

let failures = 0;
let warnings = 0;
const ok = (msg) => process.stdout.write(`  OK    ${msg}\n`);
const fail = (msg) => {
  failures++;
  process.stdout.write(`  ECHEC ${msg}\n`);
};
// Un avertissement ne casse pas audit:all : un article sans lien vers le
// configurateur est une lacune d'entonnoir (propriété tsa-acquisition), pas
// une casse d'instrument — la mesure A3 reste interprétable, l'article
// contribue simplement zéro.
const warn = (msg) => {
  warnings++;
  process.stdout.write(`  AVERT ${msg}\n`);
};

const count = (haystack, re) => (haystack.match(re) ?? []).length;

const listPages = (dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => ({ path: join(dir, f), name: f, isIndex: f === 'index.html' }));

const UNIVERSES = [
  { label: 'FR', dir: 'public/blog', configuratorHref: /href="(https:\/\/tennisstringadvisor\.org)?\/configurator\/?"/ },
  { label: 'EN', dir: 'public/en/blog', configuratorHref: /href="(https:\/\/tennisstringadvisor\.org)?\/en\/configurator\.html"/ },
];

process.stdout.write('--- qa-blog-funnel : instrument A3 (blog -> configurateur) ---\n');

for (const { label, dir, configuratorHref } of UNIVERSES) {
  const pages = listPages(dir);
  if (pages.length === 0) {
    fail(`${dir} : aucune page HTML trouvée — le glob est-il encore le bon ?`);
    continue;
  }

  const failuresBefore = failures;
  for (const page of pages) {
    const html = readFileSync(page.path, 'utf8');
    const rel = `${dir}/${page.name}`;

    // 1. GA4 chargé, une seule fois
    const loaders = count(html, /googletagmanager\.com\/gtag\/js/g);
    const helpers = count(html, /src="\/js\/analytics\.js"/g);
    if (loaders !== 1) fail(`${rel} : loader gtag chargé ${loaders} fois (attendu : 1)`);
    if (helpers !== 1) fail(`${rel} : /js/analytics.js chargé ${helpers} fois (attendu : 1)`);

    // 2. pas de gtag('config') inline en doublon de analytics.js
    if (/gtag\(\s*['"]config['"]/.test(html)) {
      fail(`${rel} : gtag('config') inline — double page_view, le dénominateur A3 est gonflé`);
    }

    // 3 + 4. liens vers le configurateur : présence (articles) et referrer intact (tous)
    const anchors = html.match(/<a\b[^>]*href="[^"]*configurator[^"]*"[^>]*>/g) ?? [];
    if (!page.isIndex && !anchors.some((a) => configuratorHref.test(a))) {
      warn(`${rel} : aucun lien vers le configurateur ${label} — l'article est hors entonnoir A3 (à traiter par tsa-acquisition)`);
    }
    for (const a of anchors) {
      if (/noreferrer/.test(a)) fail(`${rel} : lien configurateur en rel="noreferrer" — page_referrer supprimé`);
      if (/referrerpolicy/.test(a)) fail(`${rel} : lien configurateur avec referrerpolicy — page_referrer altéré`);
    }
  }
  if (failures === failuresBefore) {
    ok(`${dir} : ${pages.length} pages contrôlées (GA4 unique, referrer intact)`);
  }
}

// analytics.js : l'unique gtag('config') du monde statique vit ici
{
  const js = readFileSync('public/js/analytics.js', 'utf8');
  const configs = count(js, /gtag\(\s*['"]config['"]/g);
  if (configs !== 1) fail(`public/js/analytics.js : ${configs} gtag('config') (attendu : 1)`);
  else ok(`public/js/analytics.js : un seul gtag('config')`);
}

// 5. côté Next : un seul page_view par arrivée sur /configurator
{
  const layout = readFileSync('src/app/layout.tsx', 'utf8');
  if (!/send_page_view:\s*false/.test(layout)) {
    fail(`src/app/layout.tsx : send_page_view:false a disparu — double page_view sur /configurator`);
  } else if (!/<Analytics\b/.test(layout)) {
    fail(`src/app/layout.tsx : composant <Analytics> non monté — plus aucun page_view SPA`);
  } else {
    ok(`src/app/layout.tsx : send_page_view:false + <Analytics> montés`);
  }
}

// 6. le configurateur EN statique reste dans la mesure
{
  const conf = readFileSync('public/en/configurator.html', 'utf8');
  if (!/analytics\.js/.test(conf)) {
    fail(`public/en/configurator.html : analytics.js non chargé — l'univers EN sort de la mesure A3`);
  } else {
    ok(`public/en/configurator.html : analytics chargé`);
  }
}

if (warnings > 0) {
  process.stdout.write(`\n${warnings} avertissement(s) — lacunes d'entonnoir, la mesure reste valide\n`);
}
process.stdout.write(
  failures === 0
    ? '\ninstrument A3 intact : la lecture GA4 referrer -> configurateur reste valide\n'
    : `\n${failures} maillon(s) cassé(s) — les chiffres A3 lus dans GA4 ne sont plus interprétables\n`
);
process.exit(failures === 0 ? 0 : 1);
