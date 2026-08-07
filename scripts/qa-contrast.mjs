#!/usr/bin/env node
/**
 * QA CONTRASTE — vérifie que la palette "surface" respecte WCAG AA (>= 4.5:1)
 * dans le thème clair ET dans le thème sombre.
 *
 * Contexte : 5 pages (configurator, statistics, pricing, payment-success,
 * payment-cancelled) sont écrites en styles inline, qui ne peuvent pas porter
 * de variante `dark:` Tailwind. Elles consomment donc les variables CSS
 * définies dans src/app/globals.css. Ce script relit ces variables à la source
 * et recalcule les contrastes, pour empêcher toute régression du type
 * "texte blanc sur carte blanche".
 *
 * Usage : node scripts/qa-contrast.mjs
 * Sortie : code 0 si tout est conforme, 1 sinon.
 */

import fs from 'node:fs';
import path from 'node:path';

const CSS_FILE = path.join(process.cwd(), 'src/app/globals.css');
const THRESHOLD = 4.5; // WCAG 2.1 AA, texte normal

/**
 * Extrait les déclarations `--var: valeur;` du bloc `selector`.
 *
 * globals.css contient plusieurs blocs `:root` et `.dark` (shadcn en définit
 * déjà un jeu). On ne retient donc que le bloc qui déclare `--surface-card`,
 * marqueur de notre palette : viser le premier `:root` venu lirait le mauvais.
 */
function readBlock(css, selector) {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${esc}\\s*\\{([^{}]*)\\}`, 'g');
  for (const m of css.matchAll(re)) {
    if (!m[1].includes('--surface-card')) continue;
    // Les paires teinte fond/texte sont déclarées sur une même ligne :
    // on balaie donc tout le bloc, pas ligne par ligne.
    const body = m[1].replace(/\/\*[\s\S]*?\*\//g, '');
    const vars = {};
    for (const mm of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      vars[mm[1]] = mm[2].trim();
    }
    return vars;
  }
  return null;
}

function luminance(hex) {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.substr(i, 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Paires (premier plan, arrière-plan) réellement combinées dans l'UI. */
const PAIRS = [
  ['--text-strong', '--surface-card', 'Texte principal sur carte'],
  ['--text-muted', '--surface-card', 'Texte secondaire sur carte'],
  ['--text-faint', '--surface-card', 'Texte discret sur carte'],
  ['--text-strong', '--surface-muted', 'Titre sur en-tête de section'],
  ['--text-muted', '--surface-muted', 'Libellé sur en-tête de section'],
  ['--text-strong', '--surface-input', 'Saisie dans un champ'],
  ['--tint-blue-fg', '--tint-blue-bg', 'Pastille Polyester'],
  ['--tint-green-fg', '--tint-green-bg', 'Pastille Multifilament'],
  ['--tint-amber-fg', '--tint-amber-bg', 'Pastille ambre'],
  ['--tint-red-fg', '--tint-red-bg', 'Pastille rouge'],
];

function main() {
  if (!fs.existsSync(CSS_FILE)) {
    console.error(`Fichier introuvable : ${CSS_FILE}`);
    process.exit(1);
  }
  const css = fs.readFileSync(CSS_FILE, 'utf8');
  const themes = [
    ['CLAIR', readBlock(css, ':root')],
    ['SOMBRE', readBlock(css, '.dark')],
  ];

  console.log('='.repeat(66));
  console.log('  QA CONTRASTE — palette surface (WCAG AA, seuil 4.5:1)');
  console.log('='.repeat(66));

  let failures = 0;

  for (const [name, vars] of themes) {
    console.log(`\n  THÈME ${name}`);
    if (!vars) {
      console.log('    !! bloc de variables introuvable dans globals.css');
      failures++;
      continue;
    }
    for (const [fg, bg, label] of PAIRS) {
      const a = vars[fg];
      const b = vars[bg];
      if (!a || !b) {
        console.log(`    ?? ${label} — variable manquante (${!a ? fg : bg})`);
        failures++;
        continue;
      }
      const r = contrast(a, b);
      const ok = r >= THRESHOLD;
      if (!ok) failures++;
      console.log(
        `    ${ok ? 'OK  ' : 'FAIL'} ${label.padEnd(32)}` +
          ` ${a.padEnd(8)} / ${b.padEnd(8)} = ${r.toFixed(2)}:1`
      );
    }
  }

  console.log('\n' + '-'.repeat(66));
  if (failures === 0) {
    console.log('  Résultat : toutes les paires respectent WCAG AA.');
  } else {
    console.log(`  Résultat : ${failures} problème(s) de contraste détecté(s).`);
  }
  console.log('-'.repeat(66));
  process.exit(failures === 0 ? 0 : 1);
}

main();
