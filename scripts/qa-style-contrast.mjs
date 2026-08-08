#!/usr/bin/env node
/**
 * qa-style-contrast.mjs
 * ---------------------------------------------------------------------------
 * Garde-fou contre le défaut « texte de la même couleur que son fond ».
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * `qa-contrast.mjs` ne teste que les PAIRES DÉCLARÉES dans globals.css
 * (--tint-amber-bg avec --tint-amber-fg, etc.). Il sortait donc en code 0
 * pendant que cinq encarts du site étaient à 1,00:1 en thème sombre : le
 * texte avait été converti en `var(--tint-*-fg)` mais le fond était resté un
 * dégradé en dur. En sombre, --tint-amber-fg vaut #fde68a … exactement la
 * couleur du dégradé en dur. Texte jaune sur fond jaune.
 *
 * Tester les paires déclarées ne suffit pas : il faut tester les paires
 * RÉELLEMENT UTILISÉES dans le JSX. C'est ce que fait ce script.
 *
 * MÉTHODE
 * -------
 * 1. Lecture des variables CSS de globals.css pour les deux thèmes
 *    (:root = clair, .dark = sombre), avec résolution récursive des
 *    `var(--x)` imbriqués.
 * 2. Parsing des fichiers .tsx via le compilateur TypeScript (AST, pas de
 *    regex : une regex m'avait déjà fait manquer 1 entrée sur 69 dans un
 *    audit précédent).
 * 3. Pour chaque élément JSX portant `style={{ ... }}`, on suit la chaîne des
 *    parents pour trouver le fond effectif hérité, puis on calcule le
 *    contraste avec la couleur de texte de l'élément, DANS LES DEUX THÈMES.
 * 4. Échec si un ratio passe sous le seuil WCAG applicable.
 *
 * LIMITES ASSUMÉES (documentées pour ne pas donner de fausse assurance)
 * --------------------------------------------------------------------
 * - Les couleurs issues d'expressions dynamiques (ternaires, variables) sont
 *   évaluées quand toutes les branches sont des littéraux, sinon ignorées.
 * - Les classes Tailwind ne sont pas couvertes ici : c'est le rôle de
 *   `qa-inherited-text.mjs`, qui lit le HTML servi.
 * - Les dégradés sont réduits à leurs arrêts de couleur : chaque arrêt est
 *   testé, car le texte peut se trouver au-dessus de n'importe lequel.
 */

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const CSS_FILE = path.join(ROOT, 'src/app/globals.css');
const SRC_DIR = path.join(ROOT, 'src');

/* Seuil WCAG 2.1 AA : 4.5:1 pour le texte normal, 3:1 pour le grand texte
   (>=24px, ou >=18.66px en gras). */
const AA_NORMAL = 4.5;
const AA_LARGE = 3.0;

/* --------------------------------------------------------------------------
 * 1. Couleurs : parsing et contraste
 * ------------------------------------------------------------------------ */

const NAMED = {
  white: '#ffffff', black: '#000000', transparent: null,
  red: '#ff0000', blue: '#0000ff', green: '#008000', gray: '#808080',
  grey: '#808080', inherit: null, currentcolor: null, unset: null, initial: null,
};

/** #abc / #aabbcc / rgb() / rgba() / nom -> {r,g,b,a} ou null si indécidable. */
function parseColor(input) {
  if (input == null) return null;
  let s = String(input).trim().toLowerCase();
  if (!s) return null;

  if (Object.prototype.hasOwnProperty.call(NAMED, s)) {
    const hex = NAMED[s];
    if (!hex) return null;
    s = hex;
  }

  if (s.startsWith('#')) {
    const h = s.slice(1);
    if (h.length === 3) {
      return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16), a: 1 };
    }
    if (h.length === 6) {
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
    }
    if (h.length === 8) {
      return {
        r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16), a: parseInt(h.slice(6, 8), 16) / 255,
      };
    }
    return null;
  }

  const m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (parts.length >= 3 && parts.slice(0, 3).every((n) => Number.isFinite(n))) {
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 && Number.isFinite(parts[3]) ? parts[3] : 1 };
    }
  }
  return null;
}

/** Aplatit une couleur semi-transparente sur son fond (voiles rgba). */
function flatten(fg, bg) {
  if (!fg) return null;
  if (fg.a >= 1) return fg;
  if (!bg) return null;
  const a = fg.a;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

function luminance({ r, g, b }) {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* --------------------------------------------------------------------------
 * 2. Variables CSS des deux thèmes
 * ------------------------------------------------------------------------ */

/**
 * Extrait les déclarations `--x: valeur` de chaque bloc de globals.css.
 * On fusionne TOUS les blocs `:root` (et tous les `.dark`) car le projet en
 * contient plusieurs (héritage shadcn) ; les blocs plus bas écrasent.
 */
function readCssVars() {
  const css = fs.readFileSync(CSS_FILE, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  const light = {};
  const dark = {};

  const blockRe = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = blockRe.exec(css))) {
    const selector = m[1].trim();
    const body = m[2];
    let target = null;
    if (/(^|,)\s*:root\s*(,|$)/.test(selector)) target = light;
    else if (/(^|,)\s*\.dark\s*(,|$)/.test(selector)) target = dark;
    if (!target) continue;

    const declRe = /(--[\w-]+)\s*:\s*([^;]+)/g;
    let d;
    while ((d = declRe.exec(body))) target[d[1]] = d[2].trim();
  }
  // Le thème sombre hérite du clair pour toute variable non redéfinie.
  return { light, dark: { ...light, ...dark } };
}

/** Résout `var(--x, fallback)` récursivement dans un thème donné. */
function resolveVars(value, vars, depth = 0) {
  if (value == null || depth > 12) return value;
  let out = String(value);
  let guard = 0;
  while (out.includes('var(') && guard++ < 12) {
    out = out.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/g, (_all, name, fallback) => {
      if (Object.prototype.hasOwnProperty.call(vars, name)) return vars[name];
      return fallback != null ? fallback.trim() : '__UNRESOLVED__';
    });
  }
  return out;
}

/** Extrait les arrêts de couleur d'un `background` (gère les dégradés). */
function backgroundStops(raw) {
  if (raw == null) return [];
  const s = String(raw).trim();
  if (!s || s === 'none' || s === 'transparent') return [];

  if (/gradient\(/i.test(s)) {
    const stops = [];
    // #hex, rgb()/rgba(), ou mots-clés simples
    const re = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;
    let m;
    while ((m = re.exec(s))) {
      const c = parseColor(m[0]);
      if (c) stops.push(c);
    }
    return stops;
  }
  const c = parseColor(s);
  return c ? [c] : [];
}

/* --------------------------------------------------------------------------
 * 3. Parsing JSX : extraction des styles inline avec leur chaîne de parents
 * ------------------------------------------------------------------------ */

/** Évalue un nœud d'expression en chaîne littérale, si possible. */
function literal(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

/**
 * Une valeur de style peut être un ternaire dont toutes les branches sont
 * littérales : on renvoie toutes les possibilités pour les tester chacune.
 *
 * Chaque candidat porte la SIGNATURE de sa condition et la branche dont il
 * vient. C'est indispensable pour ne pas croiser des branches corrélées :
 *   backgroundColor: actif ? 'white' : 'transparent'
 *   color:           actif ? '#2d7a3d' : 'white'
 * Croiser naïvement produirait « blanc sur blanc », combinaison qui n'existe
 * jamais à l'exécution. On n'apparie donc que les branches compatibles.
 */
function literalCandidates(node) {
  if (!node) return [];
  const lit = literal(node);
  if (lit != null) return [{ value: lit, cond: null, branch: null }];
  if (ts.isConditionalExpression(node)) {
    const sig = node.condition.getText().replace(/\s+/g, '');
    const t = literalCandidates(node.whenTrue).map((c) => ({
      value: c.value, cond: c.cond ?? sig, branch: c.branch ?? true,
    }));
    const f = literalCandidates(node.whenFalse).map((c) => ({
      value: c.value, cond: c.cond ?? sig, branch: c.branch ?? false,
    }));
    return [...t, ...f];
  }
  return [];
}

/** Deux candidats sont incompatibles s'ils viennent de branches opposées
 *  de la MÊME condition : cette paire n'existe jamais à l'écran. */
function compatible(a, b) {
  if (!a || !b) return true;
  if (a.cond == null || b.cond == null) return true;
  if (a.cond !== b.cond) return true;
  return a.branch === b.branch;
}

/** Lit l'objet passé à style={{...}} -> { background:[...], color:[...], fontSize, fontWeight } */
function readStyleObject(objLiteral) {
  const out = { bgCandidates: [], colorCandidates: [], fontSize: null, fontWeight: null };
  if (!objLiteral || !ts.isObjectLiteralExpression(objLiteral)) return out;

  for (const prop of objLiteral.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)
      ? prop.name.text
      : null;
    if (!name) continue;

    if (name === 'background' || name === 'backgroundColor' || name === 'backgroundImage') {
      out.bgCandidates.push(...literalCandidates(prop.initializer));
    } else if (name === 'color') {
      out.colorCandidates.push(...literalCandidates(prop.initializer));
    } else if (name === 'fontSize') {
      out.fontSize = literal(prop.initializer);
    } else if (name === 'fontWeight') {
      const l = literal(prop.initializer);
      out.fontWeight = l != null
        ? l
        : (ts.isNumericLiteral(prop.initializer) ? prop.initializer.text : null);
    }
  }
  return out;
}

/** fontSize CSS -> px (rem = 16px). */
function toPx(fontSize) {
  if (!fontSize) return null;
  const m = String(fontSize).match(/^([\d.]+)\s*(px|rem|em)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const unit = m[2] || 'px';
  return unit === 'px' ? n : n * 16;
}

function isBold(fontWeight) {
  if (!fontWeight) return false;
  const s = String(fontWeight);
  if (s === 'bold' || s === 'bolder') return true;
  const n = parseInt(s, 10);
  return Number.isFinite(n) && n >= 700;
}

/**
 * Parcourt un fichier .tsx et renvoie la liste des textes stylés inline,
 * chacun avec la pile des fonds déclarés par ses ancêtres.
 */
function collectStyledText(file) {
  const source = fs.readFileSync(file, 'utf-8');
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = [];

  /** @param {ts.Node} node @param {string[][]} bgStack pile des fonds ancêtres */
  function walk(node, bgStack) {
    let nextStack = bgStack;

    const isJsxEl = ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node);
    if (isJsxEl) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const styleAttr = opening.attributes.properties.find(
        (a) => ts.isJsxAttribute(a) && a.name && ts.isIdentifier(a.name) && a.name.text === 'style',
      );

      if (styleAttr && styleAttr.initializer && ts.isJsxExpression(styleAttr.initializer)) {
        const st = readStyleObject(styleAttr.initializer.expression);

        if (st.bgCandidates.length) nextStack = [...bgStack, st.bgCandidates];

        if (st.colorCandidates.length) {
          const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
          found.push({
            file,
            line: line + 1,
            colors: st.colorCandidates,
            // fond le plus proche déclaré par un ancêtre (ou par soi-même)
            bgChain: nextStack,
            px: toPx(st.fontSize),
            bold: isBold(st.fontWeight),
            snippet: source.slice(node.getStart(sf), node.getStart(sf) + 90).replace(/\s+/g, ' '),
          });
        }
      }
    }

    node.forEachChild((c) => walk(c, nextStack));
  }

  walk(sf, []);
  return found;
}

/* --------------------------------------------------------------------------
 * 4. Évaluation
 * ------------------------------------------------------------------------ */

function listTsx(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      out.push(...listTsx(full));
    } else if (entry.name.endsWith('.tsx')) {
      out.push(full);
    }
  }
  return out;
}

const themes = readCssVars();
const files = listTsx(SRC_DIR);

const problems = [];
let pairsTested = 0;
let skipped = 0;

for (const file of files) {
  let entries;
  try {
    entries = collectStyledText(file);
  } catch (err) {
    console.error(`  ! parsing impossible : ${path.relative(ROOT, file)} (${err.message})`);
    continue;
  }

  for (const e of entries) {
    const threshold = (e.px && (e.px >= 24 || (e.px >= 18.66 && e.bold))) ? AA_LARGE : AA_NORMAL;

    for (const themeName of ['clair', 'sombre']) {
      const vars = themeName === 'clair' ? themes.light : themes.dark;

      // Fonds effectifs : on remonte du plus proche au plus lointain et on
      // s'arrête au premier fond opaque exploitable.
      // Fond effectif : on remonte les ancêtres, du plus proche au plus
      // lointain, et on retient le premier niveau qui donne une couleur
      // exploitable. Chaque fond garde son candidat d'origine pour le test
      // de compatibilité de branche.
      let bgResolved = null;
      for (let i = e.bgChain.length - 1; i >= 0 && !bgResolved; i--) {
        const level = [];
        for (const cand of e.bgChain[i]) {
          const stops = backgroundStops(resolveVars(cand.value, vars));
          if (!stops.length) continue;
          for (const s of stops) {
            if (s.a >= 1) { level.push({ color: s, cand }); continue; }
            // Voile semi-transparent : on l'aplatit sur le fond du dessous.
            let under = null;
            for (let j = i - 1; j >= 0 && !under; j--) {
              for (const c2 of e.bgChain[j]) {
                const s2 = backgroundStops(resolveVars(c2.value, vars)).find((x) => x.a >= 1);
                if (s2) { under = s2; break; }
              }
            }
            const flat = flatten(s, under);
            if (flat) level.push({ color: flat, cand });
          }
        }
        if (level.length) bgResolved = level;
      }

      if (!bgResolved) { skipped++; continue; }

      for (const colorCand of e.colors) {
        const resolved = resolveVars(colorCand.value, vars);
        if (String(resolved).includes('__UNRESOLVED__')) { skipped++; continue; }
        const fgParsed = parseColor(resolved);
        if (!fgParsed) { skipped++; continue; }

        for (const { color: bg, cand: bgCand } of bgResolved) {
          // On ignore les paires qui ne coexistent jamais à l'exécution.
          if (!compatible(colorCand, bgCand)) continue;

          const fg = flatten(fgParsed, bg);
          if (!fg) { skipped++; continue; }
          pairsTested++;
          const ratio = contrast(fg, bg);
          if (ratio < threshold) {
            problems.push({
              file: path.relative(ROOT, e.file),
              line: e.line,
              theme: themeName,
              color: colorCand.value,
              colorResolved: resolved,
              bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`,
              ratio,
              threshold,
              snippet: e.snippet,
            });
          }
        }
      }
    }
  }
}

/* --------------------------------------------------------------------------
 * 5. Rapport
 * ------------------------------------------------------------------------ */

console.log('=== Contraste des styles inline (paires réellement utilisées) ===\n');
console.log(`Fichiers .tsx analysés : ${files.length}`);
console.log(`Paires texte/fond testées : ${pairsTested} (dans les 2 thèmes)`);
console.log(`Paires non décidables (couleur dynamique ou fond non résolu) : ${skipped}\n`);

// Dédoublonnage : une même ligne peut ressortir via plusieurs arrêts de dégradé.
const seen = new Set();
const unique = problems.filter((p) => {
  const key = `${p.file}:${p.line}:${p.theme}:${p.color}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
}).sort((a, b) => a.ratio - b.ratio);

/* --------------------------------------------------------------------------
 * Référence de base (baseline)
 * --------------------------------------------------------------------------
 * Le site comporte des défauts de contraste ANTÉRIEURS au thème sombre :
 * du blanc sur vert de marque (#10b981 -> 2,54:1), du gris clair sur blanc…
 * Ils échouent identiquement dans les DEUX thèmes : ce ne sont pas des
 * régressions de thème mais des choix de charte à arbitrer avec le
 * propriétaire du site.
 *
 * Les geler dans une baseline permet au garde-fou d'échouer sur toute
 * NOUVELLE occurrence sans être noyé par l'existant. `--update-baseline`
 * régénère le fichier ; `--strict` ignore la baseline et exige 0 défaut.
 *
 * Une clé volontairement INDÉPENDANTE du numéro de ligne (fichier + couleur
 * + fond + thème) : un simple ajout de ligne au-dessus ne doit pas faire
 * réapparaître un défaut déjà connu.
 */
const BASELINE_FILE = path.join(ROOT, 'scripts/qa-style-contrast.baseline.json');
const keyOf = (p) => `${p.file}|${p.theme}|${p.color}|${p.bg}`;

const strict = process.argv.includes('--strict');
const updating = process.argv.includes('--update-baseline');

let baseline = new Set();
if (!strict && fs.existsSync(BASELINE_FILE)) {
  try {
    baseline = new Set(JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf-8')).known ?? []);
  } catch {
    console.error('  ! baseline illisible, elle est ignorée');
  }
}

if (updating) {
  const known = [...new Set(unique.map(keyOf))].sort();
  fs.writeFileSync(BASELINE_FILE, `${JSON.stringify({
    comment: 'Défauts de contraste préexistants (échouent dans les 2 thèmes). '
      + 'Ne pas ajouter de nouvelle entrée sans arbitrage : régénérer avec '
      + 'node scripts/qa-style-contrast.mjs --update-baseline',
    generated: new Date().toISOString().slice(0, 10),
    known,
  }, null, 2)}\n`);
  console.log(`Baseline écrite : ${known.length} défaut(s) préexistant(s) gelé(s).`);
  process.exit(0);
}

const fresh = unique.filter((p) => !baseline.has(keyOf(p)));
const known = unique.length - fresh.length;

if (known) {
  console.log(`ℹ️  ${known} défaut(s) préexistant(s) ignoré(s) via la baseline `
    + '(échouent dans les 2 thèmes, à arbitrer côté charte graphique).');
  console.log('   Pour les afficher : node scripts/qa-style-contrast.mjs --strict\n');
}

if (!fresh.length) {
  console.log('✅ Aucune NOUVELLE paire texte/fond sous le seuil WCAG AA.');
  process.exit(0);
}

console.log(`❌ ${fresh.length} paire(s) illisible(s) :\n`);
for (const p of fresh) {
  const verdict = p.ratio < 1.5 ? 'INVISIBLE' : 'ILLISIBLE';
  console.log(`  ${p.file}:${p.line}  [${p.theme}]  ${p.ratio.toFixed(2)}:1 ` +
              `(seuil ${p.threshold}:1)  ${verdict}`);
  console.log(`    texte ${p.color}` +
              (p.colorResolved !== p.color ? ` -> ${p.colorResolved}` : '') +
              `  sur fond ${p.bg}`);
  console.log(`    ${p.snippet}\n`);
}

console.log('Correctif : utiliser une paire de variables cohérente');
console.log('(--tint-X-bg avec --tint-X-fg), jamais une couleur en dur d\'un côté');
console.log('et une variable de l\'autre — c\'est ainsi qu\'on obtient du jaune sur jaune.');
process.exit(1);
