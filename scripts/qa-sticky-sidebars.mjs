#!/usr/bin/env node
/**
 * QA COLONNES COLLANTES — un élément `sticky` plus haut que la fenêtre rend son
 * bas inatteignable : il reste collé en haut pendant que la page défile, et sa
 * fin ne réapparaît qu'au bout du conteneur parent.
 *
 * Incident du 10/10/2026 : sur /racquets à 1280 × 800, la colonne de filtres
 * (`lg:sticky lg:top-24`, 800 px de haut) laissait « Caractéristiques » à
 * 836 px, hors écran, jusqu'à 33 200 px de défilement sur 33 909. /tennis-strings
 * portait déjà la borne (`lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`) depuis
 * 304589b ; /racquets ne l'avait jamais reçue.
 *
 * 1. Statique (toujours) : dans src/, toute classe `sticky` (préfixée ou non)
 *    doit être accompagnée d'une hauteur bornée (`max-h-`) et d'un défilement
 *    interne (`overflow-y-auto|scroll`) sous le même préfixe de point de
 *    rupture. Exception : les barres `top-0` (en-tête), de hauteur fixe.
 * 2. En navigateur (si `--url <base>`) : sur chaque catalogue, à 1280 × 800 et
 *    1024 × 700, le dernier contrôle de `#catalog-filters` doit pouvoir être
 *    amené à l'écran — par la molette, comme un visiteur — sans dépasser 25 %
 *    du défilement de la page. Requiert Google Chrome (channel 'chrome').
 *
 * Usage : node scripts/qa-sticky-sidebars.mjs [--url http://localhost:3000]
 * Sortie : 0 si conforme, 1 sinon.
 */

import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'src');
const failures = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(tsx|jsx)$/.test(e.name) ? [p] : [];
  });
}

// --- 1. Statique -----------------------------------------------------------
let stickyCount = 0;
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/className\s*=\s*(?:\{`|["'`])([^"'`]*\bsticky\b[^"'`]*)/g)) {
    const classes = m[1].split(/\s+/);
    for (const cls of classes) {
      const sm = cls.match(/^((?:[a-z0-9]+:)*)sticky$/);
      if (!sm) continue;
      stickyCount++;
      const prefix = sm[1];
      const has = (re) => classes.some((c) => c.startsWith(prefix) && re.test(c.slice(prefix.length)));
      if (has(/^top-0$/)) continue; // barre d'en-tête, hauteur fixe
      const bounded = has(/^max-h-/) && has(/^overflow-y-(auto|scroll)$/);
      const line = text.slice(0, m.index).split('\n').length;
      const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
      if (!bounded) {
        failures.push(`${rel}:${line} — « ${prefix}sticky » sans ${prefix}max-h-… ni ${prefix}overflow-y-auto : le bas de l'élément peut sortir de l'écran`);
      } else {
        console.log(`OK  ${rel}:${line} — ${prefix}sticky borné`);
      }
    }
  }
}
console.log(`Statique : ${stickyCount} classe(s) sticky examinée(s).`);

// --- 2. En navigateur --------------------------------------------------------
const urlIdx = process.argv.indexOf('--url');
if (urlIdx !== -1) {
  const base = process.argv[urlIdx + 1].replace(/\/$/, '');
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const route of ['/racquets', '/tennis-strings']) {
      for (const [w, h] of [[1280, 800], [1024, 700]]) {
        const page = await browser.newPage({ viewport: { width: w, height: h } });
        await page.goto(base + route, { waitUntil: 'load' });
        await page.waitForSelector('#catalog-filters input');
        // Déplie toutes les sections repliées de la colonne : c'est le pire cas.
        // Clic par le DOM : un clic souris échouerait justement quand le bouton
        // est hors écran, ce que l'on cherche à mesurer ensuite.
        await page.evaluate(() => {
          for (const b of document.querySelectorAll('#catalog-filters button[class*="justify-between"]')) {
            if (!b.nextElementSibling) b.click();
          }
        });
        await page.waitForTimeout(200);
        let reached = null;
        for (let i = 0; i < 400; i++) {
          const s = await page.evaluate(() => {
            const all = document.querySelectorAll('#catalog-filters input, #catalog-filters button');
            const last = all[all.length - 1];
            const panel = document.querySelector('#catalog-filters > div');
            // Un visiteur fait défiler la colonne elle-même si elle défile.
            if (panel && panel.scrollHeight > panel.clientHeight) panel.scrollTop = panel.scrollHeight;
            const b = last.getBoundingClientRect();
            return { vis: b.top >= 0 && b.bottom <= innerHeight, y: scrollY, max: document.documentElement.scrollHeight - innerHeight };
          });
          if (s.vis) { reached = s; break; }
          if (s.y >= s.max) break;
          await page.mouse.wheel(0, 400);
          await page.waitForTimeout(20);
        }
        const tag = `${route} @ ${w}×${h}`;
        if (!reached) failures.push(`${tag} — dernier contrôle des filtres jamais visible`);
        else if (reached.y > 0.25 * reached.max) failures.push(`${tag} — dernier contrôle des filtres visible seulement à ${reached.y}/${reached.max} px`);
        else console.log(`OK  ${tag} — dernier contrôle des filtres visible à ${reached.y}/${reached.max} px`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

if (failures.length) {
  console.error(`\n❌ ${failures.length} défaut(s) :`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('\n✅ Colonnes collantes : toutes bornées et atteignables.');
