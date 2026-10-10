#!/usr/bin/env node
/**
 * QA COMPTAGES DU CATALOGUE — plus aucun total périmé dans les pages (tsa-acquisition, 10/10/2026).
 *
 * Origine. Le catalogue est passé de 181 à 179 cordages (fusion de deux doublons, PR #107) ; des
 * totaux écrits à la main dans des pages EN statiques (accueil, catalogue, FAQ, connexion, JSON-LD
 * `numberOfItems`) annonçaient encore 181, et rien ne le signalait. Avant cela : « 190 cordages »
 * (28/09), puis 174, puis 107 / 173 (tables Supabase). Une fois corrigé, le même défaut revient au
 * prochain ajout ou retrait de fiche. Principe retenu (10/10/2026) : PAS de comptage exact écrit à
 * la main quand on peut l'éviter — soit lu dans le catalogue (FR : calculé au build ; EN : pages qui
 * chargent déjà catalog.json), soit une borne basse VRAIE (« more than 170 strings », « 170+ »).
 * Ce script est le filet : il échoue si une page annonce un total que le catalogue ne soutient pas.
 *
 * Source de vérité. Les deux totaux (raquettes, cordages) sont lus dans src/data/ par le chargeur
 * de public/data/catalog.json (scripts/catalog/catalog-json.mjs, `loadTsCatalog`) : le même nombre
 * que le FR et que les pages EN. Aucune valeur n'est écrite dans ce fichier.
 *
 * Ce qui est une « annonce de total ». Un nombre N de 100 à 250 suivi d'un nom de produit :
 * (cordages|strings|raquettes|racquets), éventuellement séparé par un adjectif neutre (« tennis »,
 * « analyzed », « different »…), y compris quand le nombre et le mot sont dans deux éléments
 * voisins (tuile de statistique `<div>181</div><div>Strings</div>`) ; aussi « 181 fiches cordages »
 * et « 181 string pages » (une fiche par produit = le total). Un adjectif qui désigne une
 * sous-famille (« 102 polyester strings », « 102 polyesters ») n'est PAS un total et ne déclenche
 * rien. Lecture de la formule :
 *   - exacte (« 181 strings »)            → N doit être égal au total du catalogue ;
 *   - borne basse (« more than 170 strings », « over », « plus de », « 170+ », « at least »,
 *     « au moins »)                        → la borne doit être VRAIE (total > N, ou ≥ N) ;
 *   - borne haute (« fewer than », « moins de », « up to »)  → idem dans l'autre sens.
 *   Un JSON-LD `numberOfItems` de 100 à 250 doit être l'un des deux totaux.
 *
 * Périmètre (échec) : tout texte que le visiteur ou un moteur peut lire dans
 *   - public/ hors blog : HTML (texte visible, attributs meta/alt/title/aria-label, JSON-LD, chaînes
 *     des scripts en ligne), public/js/*.js (chaînes), .txt, .xml ;
 *   - src/app, src/components, src/lib, src/types : chaînes, gabarits et texte JSX, y compris les
 *     blocs `metadata`, `generateMetadata` et le JSON-LD construit en TS (analyse syntaxique : les
 *     commentaires n'en font pas partie — l'histoire d'un chiffre peut s'y raconter) ;
 *   - scripts/en-products (gabarits des fiches EN) ;
 *   - la sortie de `npm run build` (.next/server/app) quand elle est présente et plus récente que
 *     src/data : c'est là que les blocs `metadata` calculés (`${stringsDatabase.length}`) deviennent
 *     du texte ; absente ou périmée = AVERT, pas d'échec.
 * Périmètre (AVERT seulement) : public/blog et public/en/blog. Les chiffres d'un article sont
 * datés (« au 9 octobre 2026 ») : une divergence y est signalée au rédacteur, jamais bloquante.
 * Le message dit si la phrase porte une date proche.
 *
 * Exceptions. Constante EXCEPTIONS ci-dessous : explicites, datées, motivées ; une exception qui ne
 * correspond plus à rien échoue (une exception qui survit à son motif est une dette cachée).
 *
 * Tests négatifs permanents (section finale, exécutés à chaque lancement) : pages altérées avec
 * 190, 181, 174, 173 (cordages) et 107, 104, 130, 128 (raquettes) → échec ; total courant → passe ;
 * « 102 polyesters » et « 102 polyester strings » ne déclenchent rien ; bornes vraies passent,
 * bornes fausses échouent ; stat tile, entités, méta, JSON-LD, script en ligne, JSX, gabarit TS ;
 * commentaires ignorés ; blog = AVERT ; exceptions. Un garde-fou muet échoue.
 *
 * Périmètre du script : `tsa-measure` (scripts/qa-*), écrit par tsa-acquisition — signalé dans la PR.
 *
 * Usage : node scripts/qa-comptages-catalogue.mjs    (npm run audit:comptages)
 * Sortie : 0 si conforme, 1 sinon.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { loadTsCatalog } from './catalog/catalog-json.mjs';

const ROOT = process.cwd();
const ts = createRequire(path.join(ROOT, 'package.json'))('typescript');

let failures = 0;
let warnings = 0;
const ok = (msg) => process.stdout.write(`  OK    ${msg}\n`);
const fail = (msg) => {
  failures++;
  process.stdout.write(`  ECHEC ${msg}\n`);
};
const warn = (msg) => {
  warnings++;
  process.stdout.write(`  AVERT ${msg}\n`);
};

// Caractères invisibles : toujours par leur nom, jamais littéraux dans le source.
const NBSP = String.fromCharCode(0xa0);
const NNBSP = String.fromCharCode(0x202f);
const SPACES_RE = new RegExp(`[${NBSP}${NNBSP}]`, 'g'); // espaces insécables -> espace
const HOLE = String.fromCharCode(1); // tient la place d'une expression (gabarit, JSX) : ni chiffre ni mot

// ---------------------------------------------------------------------------
// Totaux du catalogue : src/data, via le chargeur de catalog.json
// ---------------------------------------------------------------------------
const { racquetsDatabase, stringsDatabase } = await loadTsCatalog(ROOT);
const COUNTS = { racquets: racquetsDatabase.length, strings: stringsDatabase.length };
const NOUN_FR = { strings: 'cordages', racquets: 'raquettes' };

// Un « total » plausible : 100 à 250 (consigne du 10/10/2026). Si le catalogue sort de cette
// plage (moins 20 / plus 20 de marge), le garde-fou lui-même est à revoir : il échoue.
const RANGE = { min: 100, max: 250, margin: 20 };
const rangeCovers = (counts, range = RANGE) =>
  Object.values(counts).every((n) => n - range.margin >= range.min && n + range.margin <= range.max);

// ---------------------------------------------------------------------------
// Exceptions : explicites, datées, motivées. Aucune à ce jour.
//   { file: 'public/en/xxx.html', contains: '181 strings', date: '2026-10-10',
//     reason: 'pourquoi ce total est légitime ici (ex. citation historique datée)' }
// `contains` est le texte de l'annonce telle que ce script la rapporte (« 181 strings »).
// ---------------------------------------------------------------------------
const EXCEPTIONS = [];

function exceptionProblems(list) {
  const problems = [];
  list.forEach((e, i) => {
    const id = `exception n° ${i + 1}${e?.file ? ` (${e.file})` : ''}`;
    if (!e || typeof e.file !== 'string' || !e.file.trim()) problems.push(`${id} : « file » manquant`);
    if (!e || typeof e.contains !== 'string' || !e.contains.trim()) problems.push(`${id} : « contains » manquant`);
    if (!e || typeof e.reason !== 'string' || e.reason.trim().length < 15) problems.push(`${id} : « reason » absent ou trop court (15 caractères au moins : un motif, pas une étiquette)`);
    if (!e || typeof e.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || Number.isNaN(Date.parse(e.date))) problems.push(`${id} : « date » absente ou invalide (AAAA-MM-JJ)`);
  });
  return problems;
}

/** Retire les constats couverts par une exception ; renvoie aussi les exceptions inutilisées. */
function applyExceptions(findings, list) {
  const used = new Set();
  const kept = findings.filter((f) => {
    if (f.severity !== 'fail') return true;
    const idx = list.findIndex((e) => e && e.file === f.file && typeof f.text === 'string' && f.text.includes(e.contains));
    if (idx < 0) return true;
    used.add(idx);
    return false;
  });
  const unused = list.filter((_, i) => !used.has(i));
  return { kept, unused };
}

// ---------------------------------------------------------------------------
// Annonces de total : repérage dans un texte
// ---------------------------------------------------------------------------
// Adjectifs qui ne restreignent pas l'ensemble : « 181 tennis strings », « 129 analyzed tennis
// racquets ». Tout autre mot entre le nombre et le nom (polyester, multifilament, Babolat, junior…)
// désigne une sous-famille : ce n'est pas un total.
const NEUTRAL = String.raw`tennis|analy[sz]ed|analys[ée]e?s?|different|distinct|available|listed|catalogu?ed`;
// En français l'adjectif suit le nom : « 102 cordages polyester » est une sous-famille, pas un total.
const RESTRICTIVE_AFTER = String.raw`polyesters?|multifilaments?|hybrid(?:e|es|s)?|natur(?:el|els|elle|elles|al)|synth[ée]tiques?|synthetic|juniors?`;
const CLAIM_RE = new RegExp(
  String.raw`(?<![\d.,]|\d[${NBSP}${NNBSP}])(?<num>\d{3})(?<plus>\+)?(?![\d]|[.,]\d)\s*(?:(?:${NEUTRAL})\s+){0,2}(?:(?<noun>strings|cordages|racquets|rackets|raquettes)|(?:fiches?|pages?)\s+(?:de\s+)?(?<noun2>cordages?|raquettes?|strings?|racquets?|rackets?)|(?<noun3>strings?|racquets?|rackets?|cordages?|raquettes?)\s+pages?)(?![\p{L}])(?!\s+(?:${RESTRICTIVE_AFTER})(?![\p{L}]))`,
  'giu',
);
const QUALIFIERS = [
  ['gt', /\b(?:more than|over|above|beyond|plus de|plus d['’])\s*$/i],
  ['ge', /\b(?:at least|au moins|a minimum of)\s*$/i],
  ['lt', /\b(?:fewer than|less than|under|below|moins de)\s*$/i],
  ['le', /\b(?:up to|at most|jusqu['’]à|jusqu['’]a|au plus)\s*$/i],
];
const KIND_FR = { exact: '', gt: ' (borne « plus de »)', ge: ' (borne « au moins »)', lt: ' (borne « moins de »)', le: " (borne « jusqu'à »)" };
const holds = (kind, n, actual) => ({ exact: n === actual, gt: actual > n, ge: actual >= n, lt: actual < n, le: actual <= n })[kind];

/** Annonces de total d'un texte. */
function claimsIn(text, counts = COUNTS) {
  const out = [];
  for (const m of text.matchAll(CLAIM_RE)) {
    const n = Number(m.groups.num);
    if (n < RANGE.min || n > RANGE.max) continue;
    const noun = /^(?:strings?|cordages?)$/i.test(m.groups.noun ?? m.groups.noun2 ?? m.groups.noun3) ? 'strings' : 'racquets';
    let kind = m.groups.plus ? 'ge' : 'exact';
    if (!m.groups.plus) {
      const before = text.slice(Math.max(0, m.index - 24), m.index);
      for (const [k, re] of QUALIFIERS) {
        if (re.test(before)) {
          kind = k;
          break;
        }
      }
    }
    const actual = counts[noun];
    out.push({ index: m.index, n, kind, noun, actual, ok: holds(kind, n, actual), text: m[0].replace(/\s+/g, ' ').trim() });
  }
  return out;
}

// Les mêmes totaux, côté JSON-LD : `numberOfItems` de 100 à 250 = l'un des deux totaux.
const itemsOk = (n, counts = COUNTS) => n < RANGE.min || n > RANGE.max || n === counts.racquets || n === counts.strings;

// ---------------------------------------------------------------------------
// Constats
// ---------------------------------------------------------------------------
const lineStarts = (text) => {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1);
  return starts;
};
const lineAt = (starts, offset) => {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
};

// Un constat : { severity: 'fail'|'warn', file, line, where, kind, text, noun, actual, ok?, dated? }
function claimFinding(base, c, where, extra = {}) {
  if (c.ok) return null;
  return { ...base, where, kind: c.kind, text: c.text, noun: c.noun, actual: c.actual, ...extra };
}
function itemsFinding(base, n, where, counts = COUNTS) {
  if (itemsOk(n, counts)) return null;
  return { ...base, where, kind: 'items', text: `numberOfItems: ${n}`, noun: null, actual: `${counts.racquets} raquettes ou ${counts.strings} cordages` };
}

const MONTHS = 'january|february|march|april|may|june|july|august|september|october|november|december|janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[ée]cembre';
const DATE_RE = new RegExp(
  String.raw`\b(?:\d{1,2}(?:st|nd|rd|th|er)?\s+(?:${MONTHS})\s+20\d\d|(?:${MONTHS})\s+\d{1,2}(?:st|nd|rd|th)?,?\s+20\d\d|20\d\d-\d\d-\d\d)\b`,
  'i',
);
const datedNear = (text, index) => DATE_RE.test(text.slice(Math.max(0, index - 220), index + 220));

function describe(f) {
  const place = `${f.file}:${f.line}`;
  if (f.kind === 'jsonld-invalide') return `${place} JSON-LD illisible (${f.text}) : les totaux qu'il annonce ne sont pas vérifiables`;
  if (f.kind === 'items') return `${place} ${f.where} « ${f.text} » alors que le catalogue compte ${f.actual}`;
  const date = f.severity === 'warn' ? (f.dated ? ' [phrase datée : acceptable si la date est visible]' : ' [SANS DATE : à corriger par le rédacteur]') : '';
  return `${place} ${f.where} annonce « ${f.text} »${KIND_FR[f.kind]} alors que le catalogue compte ${f.actual} ${NOUN_FR[f.noun]}${date}`;
}

// ---------------------------------------------------------------------------
// Code (TS, TSX, JS) : chaînes, gabarits, texte JSX — jamais les commentaires
// ---------------------------------------------------------------------------
class Unit {
  constructor() {
    this.text = '';
    this.anchors = [];
  }
  add(str, pos) {
    this.anchors.push({ flat: this.text.length, pos });
    this.text += str;
  }
  posAt(i) {
    let a = this.anchors[0];
    for (const x of this.anchors) {
      if (x.flat <= i) a = x;
      else break;
    }
    return a.pos + (i - a.flat);
  }
}
const scriptKindOf = (file) =>
  /\.tsx$/i.test(file) ? ts.ScriptKind.TSX : /\.(?:ts|mts|cts)$/i.test(file) ? ts.ScriptKind.TS : ts.ScriptKind.JS;

/** Les textes qu'un fichier de code peut émettre, et ses `numberOfItems` numériques. */
function codeUnits(src, fileName) {
  const sf = ts.createSourceFile(fileName, src, ts.ScriptTarget.Latest, true, scriptKindOf(fileName));
  const units = [];
  const items = [];
  const single = (text, pos) => {
    const u = new Unit();
    u.add(text, pos);
    units.push(u);
  };
  // Texte d'un élément JSX mis bout à bout : `<strong>{181}</strong> cordages` se lit « 181 cordages ».
  const flatten = (n, u) => {
    for (const child of n.children) {
      if (ts.isJsxText(child)) u.add(child.text, child.pos);
      else if (ts.isJsxExpression(child)) {
        const e = child.expression;
        if (e && (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e) || ts.isNumericLiteral(e))) u.add(e.text, e.getStart(sf));
        else u.add(HOLE, child.getStart(sf));
      } else if (ts.isJsxElement(child) || ts.isJsxFragment(child)) {
        u.add(' ', child.getStart(sf));
        flatten(child, u);
        u.add(' ', child.end);
      } else u.add(' ', child.getStart(sf));
    }
  };
  const visit = (node, inJsx) => {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      if (!inJsx) {
        const u = new Unit();
        flatten(node, u);
        units.push(u);
      }
      ts.forEachChild(node, (c) => visit(c, true));
      return;
    }
    if (ts.isJsxText(node)) return; // lu via flatten
    if (ts.isJsxExpression(node)) {
      ts.forEachChild(node, (c) => visit(c, false)); // une expression peut contenir un nouvel arbre JSX
      return;
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      single(node.text, node.getStart(sf));
      return;
    }
    if (ts.isTemplateExpression(node)) {
      const u = new Unit();
      u.add(node.head.text, node.head.getStart(sf));
      for (const span of node.templateSpans) {
        u.add(HOLE, span.expression.getStart(sf));
        u.add(span.literal.text, span.literal.getStart(sf));
      }
      units.push(u);
      ts.forEachChild(node, (c) => visit(c, inJsx));
      return;
    }
    if (ts.isPropertyAssignment(node) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) && node.name.text === 'numberOfItems' && ts.isNumericLiteral(node.initializer)) {
      items.push({ n: Number(node.initializer.text), pos: node.initializer.getStart(sf) });
    }
    ts.forEachChild(node, (c) => visit(c, inJsx));
  };
  visit(sf, false);
  return { sf, units, items };
}

function scanCode(src, { file, severity = 'fail', counts = COUNTS }) {
  const { sf, units, items } = codeUnits(src, file);
  const seen = new Set();
  const out = [];
  const lineOfPos = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
  for (const u of units) {
    for (const c of claimsIn(u.text.replace(SPACES_RE, ' '), counts)) {
      const line = lineOfPos(u.posAt(c.index));
      const key = `${line}|${c.text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const f = claimFinding({ severity, file, line }, c, 'texte du code');
      if (f) out.push(f);
    }
  }
  for (const it of items) {
    const f = itemsFinding({ severity, file, line: lineOfPos(it.pos) }, it.n, 'JSON-LD du code', counts);
    if (f) out.push(f);
  }
  return out;
}

// ---------------------------------------------------------------------------
// HTML : texte visible, attributs de texte, JSON-LD, scripts en ligne
// ---------------------------------------------------------------------------
const TAG_RE = /<\/?[a-zA-Z](?:[^>"']|"[^"]*"|'[^']*')*>/g;
const NBSP_ENT_RE = /&(?:nbsp|thinsp|ensp|emsp|#160|#8201|#8239|#xa0|#x202f);/gi;
const TEXT_ATTRS = new Set(['content', 'alt', 'title', 'aria-label', 'placeholder']);
const blank = (s) => s.replace(/[^\n]/g, ' '); // même longueur, mêmes retours à la ligne : les décalages restent exacts
const decodeAttr = (s) => s.replace(NBSP_ENT_RE, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');

function scanHtml(html, { file, severity = 'fail', inlineJs = true, counts = COUNTS }) {
  const out = [];
  const starts = lineStarts(html);
  const base = (offset) => ({ severity, file, line: lineAt(starts, offset) });
  const dateOf = (text, index) => (severity === 'warn' ? { dated: datedNear(text, index) } : {});

  // 1. Blocs <script> : JSON-LD (lu comme du JSON), JavaScript en ligne (lu comme du code)
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    const body = m[2];
    const bodyOffset = m.index + m[0].length - '</script>'.length - body.length;
    if (/\btype\s*=\s*["']?application\/ld\+json/i.test(attrs)) {
      try {
        JSON.parse(body);
      } catch (e) {
        out.push({ ...base(bodyOffset), where: 'JSON-LD', kind: 'jsonld-invalide', text: e.message });
        continue;
      }
      const json = body.replace(/\\u00a0|\\u202f/gi, ' '.repeat(6));
      for (const c of claimsIn(json, counts)) {
        const f = claimFinding(base(bodyOffset + c.index), c, 'JSON-LD', dateOf(json, c.index));
        if (f) out.push(f);
      }
      for (const n of body.matchAll(/"numberOfItems"\s*:\s*"?(\d+)"?/g)) {
        const f = itemsFinding(base(bodyOffset + n.index), Number(n[1]), 'JSON-LD', counts);
        if (f) out.push(f);
      }
    } else if (inlineJs && !/\bsrc\s*=/i.test(attrs) && body.trim() && (!/\btype\s*=/i.test(attrs) || /\btype\s*=\s*["']?(?:text\/javascript|module)/i.test(attrs))) {
      const { units, items } = codeUnits(body, 'inline.js');
      for (const u of units) {
        for (const c of claimsIn(u.text.replace(SPACES_RE, ' '), counts)) {
          const f = claimFinding(base(bodyOffset + u.posAt(c.index)), c, 'script en ligne', dateOf(u.text, c.index));
          if (f) out.push(f);
        }
      }
      for (const it of items) {
        const f = itemsFinding(base(bodyOffset + it.pos), it.n, 'script en ligne', counts);
        if (f) out.push(f);
      }
    }
  }

  // 2. Texte visible : tout ce qui n'est ni balise, ni commentaire, ni script, ni style (les balises
  //    deviennent des espaces : « 181 » et « Strings » dans deux <div> voisins se lisent ensemble)
  const withoutBlocks = html.replace(/<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, blank);
  const visible = withoutBlocks.replace(TAG_RE, blank).replace(NBSP_ENT_RE, blank);
  for (const c of claimsIn(visible, counts)) {
    const f = claimFinding(base(c.index), c, 'texte visible', dateOf(visible, c.index));
    if (f) out.push(f);
  }

  // 3. Attributs qui portent du texte lu : meta content (description, og:*, twitter:*), alt, title…
  for (const t of withoutBlocks.matchAll(TAG_RE)) {
    const tag = t[0];
    const name = (tag.match(/^<\/?([a-zA-Z][\w:-]*)/) ?? [])[1]?.toLowerCase();
    const label = (tag.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i) ?? [])[1];
    for (const a of tag.matchAll(/([a-zA-Z:_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      const attr = a[1].toLowerCase();
      if (!TEXT_ATTRS.has(attr)) continue;
      const value = decodeAttr(a[2] ?? a[3] ?? '');
      for (const c of claimsIn(value, counts)) {
        const f = claimFinding(base(t.index + a.index), c, `<${name}${label ? ` ${label}` : ''}> ${attr}`, dateOf(value, c.index));
        if (f) out.push(f);
      }
    }
  }
  return out;
}

function scanPlain(text, { file, severity = 'fail', counts = COUNTS }) {
  const starts = lineStarts(text);
  return claimsIn(text.replace(SPACES_RE, ' '), counts)
    .map((c) => claimFinding({ severity, file, line: lineAt(starts, c.index) }, c, 'texte'))
    .filter(Boolean);
}

function scanFile(file, text, opts = {}) {
  if (/\.html?$/i.test(file)) return scanHtml(text, { file, ...opts });
  if (/\.(?:tsx?|mts|cts|mjs|cjs|js)$/i.test(file)) return scanCode(text, { file, ...opts });
  return scanPlain(text, { file, ...opts });
}

// ---------------------------------------------------------------------------
// Parcours des fichiers
// ---------------------------------------------------------------------------
function walk(dir, { exts, skipDirs = [] }) {
  const abs = path.join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    const relPath = `${dir}/${e.name}`;
    if (e.isDirectory()) {
      if (!skipDirs.includes(relPath)) out.push(...walk(relPath, { exts, skipDirs }));
    } else if (exts.some((x) => e.name.endsWith(x))) out.push(relPath);
  }
  return out;
}
const read = (f) => readFileSync(path.join(ROOT, f), 'utf8');
const scanFiles = (files, opts) => files.flatMap((f) => scanFile(f, read(f), opts));

// ---------------------------------------------------------------------------
// Exécution
// ---------------------------------------------------------------------------
process.stdout.write(`Catalogue (src/data, chargeur de catalog.json) : ${COUNTS.racquets} raquettes, ${COUNTS.strings} cordages\n`);

// 0. La plage de détection couvre-t-elle le catalogue ?
if (rangeCovers(COUNTS)) ok(`plage de détection ${RANGE.min}..${RANGE.max} : couvre ${COUNTS.racquets} et ${COUNTS.strings} avec ${RANGE.margin} de marge`);
else fail(`plage de détection ${RANGE.min}..${RANGE.max} à revoir : le catalogue (${COUNTS.racquets} raquettes, ${COUNTS.strings} cordages) approche ses bornes — un total périmé pourrait y échapper`);

// 1. Exceptions bien formées
{
  const problems = exceptionProblems(EXCEPTIONS);
  if (problems.length) problems.forEach((p) => fail(`EXCEPTIONS : ${p}`));
  else ok(`exceptions : ${EXCEPTIONS.length} déclarée(s), toutes datées et motivées`);
}

// 2. Pages et code : échec
const failScopes = [
  { name: 'public/ hors blog', files: walk('public', { exts: ['.html', '.js', '.txt', '.xml'], skipDirs: ['public/blog', 'public/en/blog', 'public/data', 'public/images'] }) },
  { name: 'src/ (app, components, lib, types)', files: ['src/app', 'src/components', 'src/lib', 'src/types'].flatMap((d) => walk(d, { exts: ['.ts', '.tsx', '.js', '.mjs'] })) },
  { name: 'scripts/en-products (gabarits des fiches EN)', files: walk('scripts/en-products', { exts: ['.mjs'] }) },
];
const failFindings = [];
for (const scope of failScopes) {
  failFindings.push(...scanFiles(scope.files, { severity: 'fail' }));
}

// 2 bis. Sortie du build Next : les blocs `metadata` calculés y sont du texte
const NEXT_DIR = '.next/server/app';
let nextScanned = 0;
{
  const buildId = path.join(ROOT, '.next/BUILD_ID');
  const newestData = Math.max(...['src/data/racquets-database.ts', 'src/data/strings-database.ts'].map((f) => statSync(path.join(ROOT, f)).mtimeMs));
  if (!existsSync(path.join(ROOT, NEXT_DIR)) || !existsSync(buildId)) {
    warn('.next absent (npm run build) : métadonnées FR calculées au build non vérifiées sur la sortie');
  } else if (statSync(buildId).mtimeMs < newestData) {
    warn('.next plus ancien que src/data : relancer npm run build pour vérifier les métadonnées FR sur la sortie');
  } else {
    const files = walk(NEXT_DIR, { exts: ['.html'] });
    nextScanned = files.length;
    failFindings.push(...scanFiles(files, { severity: 'fail', inlineJs: false }));
  }
}

// 3. Exceptions appliquées
const { kept: failKept, unused } = applyExceptions(failFindings, EXCEPTIONS);
unused.forEach((e) => fail(`exception inutilisée (${e.file} : « ${e.contains} », ${e.date}) : le texte a changé ou a été corrigé, la retirer`));
for (const f of failKept) fail(describe(f));
if (failKept.length === 0) {
  for (const scope of failScopes) ok(`${scope.name} : ${scope.files.length} fichiers lus, aucun total périmé`);
  if (nextScanned) ok(`${NEXT_DIR} (sortie du build) : ${nextScanned} pages lues, aucun total périmé`);
} else {
  process.stdout.write(
    '\n  Correction : ne pas écrire de total à la main quand on peut l\'éviter.\n' +
      '    - soit lire le nombre dans le catalogue (EN : TSACatalog.load() de public/js/catalog.js ; Next : stringsDatabase.length) ;\n' +
      '    - soit écrire une borne VRAIE (« more than 170 strings », « 170+ strings », « plus de 120 raquettes »).\n' +
      `    Catalogue actuel : ${COUNTS.racquets} raquettes, ${COUNTS.strings} cordages.\n\n`,
  );
}

// 4. Articles du blog : AVERT seulement (les chiffres d'un article sont datés)
{
  const files = walk('public/blog', { exts: ['.html'] }).concat(walk('public/en/blog', { exts: ['.html'] }));
  const found = scanFiles(files, { severity: 'warn' });
  for (const f of found) warn(describe(f));
  if (found.length === 0) ok(`blog : ${files.length} pages lues, aucun total divergent`);
  else process.stdout.write(`        (blog : ${files.length} pages lues, ${found.length} divergence(s) signalée(s) au rédacteur, jamais bloquantes)\n`);
}

// 5. catalog.json servi aux pages EN : à jour ?
{
  const p = 'public/data/catalog.json';
  if (!existsSync(path.join(ROOT, p))) warn(`${p} absent (npm run build:catalog) : pages EN dynamiques non vérifiables en local`);
  else {
    const counts = JSON.parse(read(p)).meta?.counts ?? {};
    if (counts.racquets !== COUNTS.racquets || counts.strings !== COUNTS.strings) warn(`${p} périmé (${counts.racquets} raquettes, ${counts.strings} cordages) : relancer npm run build:catalog`);
    else ok(`${p} : mêmes totaux que src/data (${counts.racquets} / ${counts.strings})`);
  }
}

// ---------------------------------------------------------------------------
// 6. Tests négatifs permanents : chaque garde-fou est éprouvé sur une altération qui DOIT échouer
//    et sur un témoin qui DOIT passer. Un garde-fou muet échoue.
// ---------------------------------------------------------------------------
{
  const before = failures;
  const S = COUNTS.strings;
  const R = COUNTS.racquets;
  const BS = String.fromCharCode(92); // une barre oblique inverse (échappement JSON d'une espace insécable)
  const STALE_STRINGS = [190, 181, 174, 173].filter((n) => n !== S);
  const STALE_RACQUETS = [107, 104, R + 1, R - 1].filter((n) => n !== R);
  const page = (head, body) => `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n${head}\n<title>Test</title>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
  const html = (head, body, opts = {}) => scanHtml(page(head, body), { file: 'public/en/test.html', ...opts });
  const code = (src, file = 'src/app/x/page.tsx', opts = {}) => scanCode(src, { file, ...opts });
  const meta = (content) => `<meta name="description" content="${content}">`;
  const ld = (json) => `<script type="application/ld+json">${typeof json === 'string' ? json : JSON.stringify(json)}</script>`;
  const real = existsSync(path.join(ROOT, 'public/en/index.html')) ? read('public/en/index.html') : null;
  // Page réelle + une insertion : seuls les constats AJOUTÉS comptent (la page peut en porter d'autres).
  const realWith = (where, add) => {
    const modified = real.replace(where, () => `${add}\n${where}`);
    if (modified === real) throw new Error(`insertion sans effet avant ${where}`);
    const key = (f) => `${f.where}|${f.text}`;
    const remaining = new Map();
    for (const f of scanHtml(real, { file: 'public/en/index.html' })) remaining.set(key(f), (remaining.get(key(f)) ?? 0) + 1);
    return scanHtml(modified, { file: 'public/en/index.html' }).filter((f) => {
      const left = remaining.get(key(f)) ?? 0;
      if (left > 0) {
        remaining.set(key(f), left - 1);
        return false;
      }
      return true;
    });
  };
  const fails = (findings) => findings.some((f) => f.severity === 'fail');
  const clean = (findings) => findings.length === 0;

  // [nom, constats, attendu] — attendu : 'echec' | 'propre' | 'avert'
  const cases = [];
  const add = (name, run, expected) => cases.push([name, run, expected]);

  // -- Totaux périmés (page HTML) : DOIVENT échouer --------------------------------------------
  for (const n of STALE_STRINGS) {
    add(`${n} strings dans le texte`, () => html('', `<p>Our database of ${n} strings</p>`), 'echec');
    add(`<strong>${n} cordages</strong> (français, balisage)`, () => html('', `<p>Base de <strong>${n} cordages</strong>.</p>`), 'echec');
    add(`${n} tennis strings (adjectif neutre)`, () => html('', `<p>${n} tennis strings analyzed</p>`), 'echec');
    add(`${n}&nbsp;cordages (espace insécable)`, () => html('', `<p>${n}&nbsp;cordages</p>`), 'echec');
    add(`${n} cordages (U+00A0)`, () => html('', `<p>${n}${NBSP}cordages</p>`), 'echec');
    add(`${n} cordages (U+202F)`, () => html('', `<p>${n}${NNBSP}cordages</p>`), 'echec');
    add(`${n} strings dans un JSON-LD (U+00A0 échappé)`, () => html(ld(`{"description":"${n}${BS}u00a0strings"}`), ''), 'echec');
    add(`${n} strings dans meta description`, () => html(meta(`Catalog of ${n} tennis strings. Filter by brand.`), ''), 'echec');
    add(`${n} strings dans og:description`, () => html(`<meta property="og:description" content="${n} tennis strings. Filter by brand.">`, ''), 'echec');
    add(`${n} strings dans twitter:description`, () => html(`<meta name="twitter:description" content="${n} strings">`, ''), 'echec');
    add(`${n} strings dans une tuile (deux <div> voisins)`, () => html('', `<div class="t">${n}</div>\n<div class="l">Strings</div>`), 'echec');
    add(`${n} strings dans un alt`, () => html('', `<img src="a.png" alt="Chart of ${n} strings">`), 'echec');
    add(`${n} strings dans un script en ligne`, () => html('', `<script>document.getElementById('x').textContent = '${n} strings';</script>`), 'echec');
    add(`${n} strings dans un gabarit de script en ligne`, () => html('', '<script>const t = `${a} and ' + n + ' strings`;</script>'), 'echec');
    add(`${n} strings dans une description JSON-LD`, () => html(ld({ '@type': 'ItemList', description: `${n} strings analyzed` }), ''), 'echec');
    add(`numberOfItems ${n} dans le JSON-LD`, () => html(ld({ '@type': 'ItemList', numberOfItems: n }), ''), 'echec');
  }
  for (const n of STALE_RACQUETS) {
    add(`${n} racquets dans le texte`, () => html('', `<p>${n} racquets with their specs</p>`), 'echec');
    add(`${n} raquettes (français)`, () => html('', `<p>${n} raquettes</p>`), 'echec');
    add(`${n} analyzed tennis racquets (deux adjectifs neutres)`, () => html(meta(`Catalog of ${n} analyzed tennis racquets.`), ''), 'echec');
    add(`${n} racquets dans une tuile`, () => html('', `<div>${n}</div><div>Racquets</div>`), 'echec');
    add(`numberOfItems ${n} (raquettes)`, () => html(ld(`{"@type":"ItemList","numberOfItems":"${n}"}`), ''), 'echec');
  }
  add(`« ${STALE_STRINGS[0]} fiches cordages » (français, fiches = total)`, () => html('', `<p>${STALE_STRINGS[0]} fiches cordages, état au 9 octobre</p>`), 'echec');
  add(`« ${STALE_STRINGS[0]} string pages » (anglais, pages = total)`, () => html('', `<p>catalogue, ${STALE_STRINGS[0]} string pages</p>`), 'echec');
  add(`« ${STALE_RACQUETS[0]} racquet pages »`, () => html('', `<p>${STALE_RACQUETS[0]} racquet pages</p>`), 'echec');
  add(`« ${STALE_RACQUETS[0]} fiches de raquettes »`, () => html('', `<p>${STALE_RACQUETS[0]} fiches de raquettes</p>`), 'echec');
  add('page réelle (accueil EN) + total périmé dans le corps', () => realWith('</body>', `<p>${STALE_STRINGS[0]} strings</p>`), 'echec');
  add('page réelle (accueil EN) + total périmé dans la méta', () => realWith('</head>', meta(`${STALE_STRINGS[1] ?? STALE_STRINGS[0]} tennis strings`)), 'echec');
  add('page réelle (accueil EN) + numberOfItems périmé', () => realWith('</head>', ld({ numberOfItems: STALE_STRINGS[0] })), 'echec');
  add('JSON-LD illisible (comptages non vérifiables)', () => html(ld('{"@type":"ItemList",'), ''), 'echec');

  // -- Totaux courants : DOIVENT passer ----------------------------------------------------------
  add(`${S} strings (total courant)`, () => html('', `<p>${S} strings</p>`), 'propre');
  add(`${R} racquets (total courant)`, () => html('', `<p>${R} racquets</p>`), 'propre');
  add(`${S} fiches cordages, ${S} string pages, ${R} racquet pages (totaux courants)`, () => html('', `<p>${S} fiches cordages, ${S} string pages, ${R} racquet pages</p>`), 'propre');
  add(`${S} cordages et ${R} raquettes (français)`, () => html(meta(`${S} cordages, ${R} raquettes`), `<strong>${S}</strong> cordages`), 'propre');
  add('totaux courants dans une tuile', () => html('', `<div>${S}</div><div>Strings</div><div>${R}</div><div>Racquets</div>`), 'propre');
  add(`numberOfItems ${S} / ${R}`, () => html(ld({ numberOfItems: S }) + ld({ numberOfItems: R }), ''), 'propre');
  add('numberOfItems 2 (liste d’exemples)', () => html(ld({ '@type': 'ItemList', numberOfItems: 2 }), ''), 'propre');
  add('page réelle (accueil EN) + total courant', () => realWith('</body>', `<p>${S} strings</p>`), 'propre');

  // -- Sous-familles et faux amis : ne DOIVENT PAS déclencher -------------------------------------
  add('« 102 polyesters » (pas un nom de produit du motif)', () => html('', '<p>102 polyesters in the catalogue</p>'), 'propre');
  add('« 102 polyester strings » (sous-famille)', () => html('', '<p>102 polyester strings</p>'), 'propre');
  add('« 102 cordages polyester » (le mot suivant ne compte pas)', () => html('', '<p>102 cordages polyester</p>'), 'propre');
  add('« 150 Babolat strings » (marque = sous-famille)', () => html('', '<p>150 Babolat strings</p>'), 'propre');
  add('nombres hors plage (18 racquets, 29 raquettes, 300 strings)', () => html('', '<p>18 racquets, 29 raquettes, 300 strings, 99 cordages</p>'), 'propre');
  add('« 29 raquettes sur 129, » (le total n’est pas accolé à un nom)', () => html('', '<p>29 raquettes sur 129, soit 22 %</p>'), 'propre');
  add('« 147 060 combinaisons », « 1 181 cordages » (séparateur de milliers insécable)', () => html('', `<p>147${NBSP}060 combinaisons, 1${NBSP}181 cordages, 1${NNBSP}181 strings</p>`), 'propre');
  add('« 102 fiches cordages polyester » (adjectif après le nom)', () => html('', '<p>102 fiches cordages polyester, 102 polyester string pages</p>'), 'propre');
  add('« 102 cordages polyester », « 45 cordages multifilament », « 102 cordages hybrides » (adjectif après le nom)', () => html('', '<p>102 cordages polyester, 145 cordages multifilament, 102 cordages hybrides</p>'), 'propre');
  add('« 1181 strings » (nombre plus long)', () => html('', '<p>1181 strings</p>'), 'propre');
  add('« 129.5 strings » (décimale)', () => html('', '<p>129.5 strings</p>'), 'propre');
  add('« 181 stringsDatabase » (identifiant, pas un mot)', () => html('', '<p>181 stringsDatabase</p>'), 'propre');
  add('commentaire HTML', () => html('', `<!-- ${STALE_STRINGS[0]} strings -->`), 'propre');
  add('commentaire de script en ligne', () => html('', `<script>// ${STALE_STRINGS[0]} strings\n/* ${STALE_STRINGS[0]} cordages */ var a = 1;</script>`), 'propre');
  add('style en ligne', () => html('', `<style>.a::after{content:"${STALE_STRINGS[0]} strings"}</style>`), 'propre');
  add('script externe (src) sans corps', () => html('<script src="/js/x.js"></script>', ''), 'propre');
  add('nom de classe ou identifiant (attribut non textuel)', () => html('', `<div class="x-${STALE_STRINGS[0]}-strings" id="n${STALE_STRINGS[0]}strings"></div>`), 'propre');

  // -- Bornes : vraies = passent, fausses = échouent ---------------------------------------------
  add(`« more than ${S - 9} strings » (borne vraie)`, () => html('', `<p>more than ${S - 9} strings</p>`), 'propre');
  add(`« ${S - 9}+ strings » (borne vraie)`, () => html('', `<p>${S - 9}+ strings</p>`), 'propre');
  add(`« over ${R - 9} racquets » (borne vraie)`, () => html('', `<p>Over ${R - 9} racquets</p>`), 'propre');
  add(`« ${R - 9}+ » en tuile`, () => html('', `<div>${R - 9}+</div><div>Racquets</div>`), 'propre');
  add(`« at least ${S} strings » (borne vraie, égalité)`, () => html('', `<p>at least ${S} strings</p>`), 'propre');
  add(`« plus de ${R - 9} raquettes » (français)`, () => html('', `<p>plus de ${R - 9} raquettes</p>`), 'propre');
  add(`« more than <strong>${S - 9}</strong> strings » (balise entre la borne et le nombre)`, () => html('', `<p>more than <strong>${S - 9}</strong> strings</p>`), 'propre');
  add(`« fewer than ${S + 20} strings » (borne haute vraie)`, () => html('', `<p>fewer than ${S + 20} strings</p>`), 'propre');
  add(`« more than ${S} strings » (borne fausse : ${S} n'est pas plus que ${S})`, () => html('', `<p>more than ${S} strings</p>`), 'echec');
  add(`« more than ${S + 11} strings » (borne fausse)`, () => html('', `<p>more than ${S + 11} strings</p>`), 'echec');
  add(`« ${S + 1}+ strings » (borne fausse)`, () => html('', `<p>${S + 1}+ strings</p>`), 'echec');
  add(`« ${R + 1}+ racquets » en tuile (borne fausse)`, () => html('', `<div>${R + 1}+</div><div>Racquets</div>`), 'echec');
  add(`« au moins ${R + 1} raquettes » (borne fausse)`, () => html('', `<p>au moins ${R + 1} raquettes</p>`), 'echec');
  add(`« fewer than ${S - 10} strings » (borne haute fausse)`, () => html('', `<p>fewer than ${S - 10} strings</p>`), 'echec');
  add(`« moins de ${S} cordages » (borne haute fausse, égalité)`, () => html('', `<p>moins de ${S} cordages</p>`), 'echec');
  add(`« ${STALE_STRINGS[0]} strings » après le mot « moreover » (pas une borne)`, () => html('', `<p>moreover ${STALE_STRINGS[0]} strings</p>`), 'echec');

  // -- Autres formes : balises en majuscules, texte brut (.txt, .xml), fichiers non HTML -----------
  add('balises et attributs en majuscules', () => html(`<META NAME="description" CONTENT="${STALE_STRINGS[0]} tennis strings">`, ''), 'echec');
  add('texte brut (.txt, .xml) périmé', () => scanPlain(`Catalogue : ${STALE_STRINGS[0]} cordages`, { file: 'public/x.txt' }), 'echec');
  add('texte brut : total courant', () => scanPlain(`Catalogue : ${S} cordages`, { file: 'public/x.txt' }), 'propre');
  add('entité numérique d’une espace fine (&#8239;)', () => html('', `<p>${STALE_STRINGS[0]}&#8239;cordages</p>`), 'echec');

  // -- Sortie du build Next (HTML prérendu, scripts en ligne ignorés) -----------------------------
  add('sortie du build : meta périmée détectée sans lire les scripts', () => html(meta(`${STALE_STRINGS[0]} cordages comparés : polyester.`), '', { inlineJs: false }), 'echec');
  add('sortie du build : texte visible périmé', () => html('', `<h2>${STALE_STRINGS[0]} cordages de 22 marques différentes</h2>`, { inlineJs: false }), 'echec');
  add('sortie du build : totaux courants dans la meta et le texte', () => html(meta(`${S} cordages comparés`), `<h2>${R} raquettes de 8 marques différentes</h2>`, { inlineJs: false }), 'propre');
  add('sortie du build : charge utile des scripts (RSC) non lue', () => html('', `<script>self.__next_f.push([1,"${STALE_STRINGS[0]} cordages"])</script>`, { inlineJs: false }), 'propre');
  // -- Code (TS, TSX) ----------------------------------------------------------------------------
  const tsx = (body) => `export default function P() { return (${body}); }\n`;
  add('texte JSX périmé', () => code(tsx(`<p>${STALE_STRINGS[0]} cordages</p>`)), 'echec');
  add('texte JSX imbriqué périmé (<strong>)', () => code(tsx(`<p><strong>${STALE_STRINGS[0]}</strong> cordages</p>`)), 'echec');
  add('nombre JSX littéral {181} + mot', () => code(tsx(`<p>{${STALE_STRINGS[0]}} cordages</p>`)), 'echec');
  add('chaîne dans une expression JSX', () => code(tsx(`<p>{'${STALE_STRINGS[0]} cordages'}</p>`)), 'echec');
  add('texte JSX dans une expression conditionnelle', () => code(tsx(`<div>{ok && <p>${STALE_STRINGS[0]} cordages</p>}</div>`)), 'echec');
  add('attribut JSX périmé', () => code(tsx(`<Card description="${STALE_STRINGS[0]} cordages comparés" />`)), 'echec');
  add('bloc metadata périmé', () => code(`export const metadata = { description: '${STALE_STRINGS[0]} cordages comparés : polyester.' };\n`, 'src/app/tennis-strings/layout.tsx'), 'echec');
  add('generateMetadata avec gabarit périmé', () => code(`export function generateMetadata() { return { description: \`\${x} et ${STALE_STRINGS[0]} cordages\` }; }\n`, 'src/app/x/page.tsx'), 'echec');
  add('JSON-LD TS : numberOfItems numérique périmé', () => code(`const jsonLd = { '@type': 'ItemList', numberOfItems: ${STALE_STRINGS[0]} };\n`), 'echec');
  add('JSON-LD TS : numberOfItems entre guillemets (nom de propriété)', () => code(`const jsonLd = { 'numberOfItems': ${R + 1} };\n`), 'echec');
  add('JSON-LD TS : description périmée', () => code(`const jsonLd = { description: 'Catalogue de ${STALE_STRINGS[0]} cordages' };\n`), 'echec');
  add('script du site (public/js) : chaîne périmée', () => code(`el.textContent = '${STALE_STRINGS[0]} strings';\n`, 'public/js/x.js'), 'echec');
  add('total courant dans un bloc metadata', () => code(`export const metadata = { description: '${S} cordages comparés' };\n`), 'propre');
  add('nombre calculé au build (gabarit)', () => code('export const metadata = { description: `${stringsDatabase.length} cordages comparés` };\n'), 'propre');
  add('nombre calculé dans le JSX', () => code(tsx('<p>{stringsDatabase.length} cordages de {brands.length} marques</p>')), 'propre');
  add('numberOfItems calculé', () => code('const jsonLd = { numberOfItems: stringsDatabase.length };\n'), 'propre');
  add('numberOfItems 2 en TS', () => code("const jsonLd = { numberOfItems: 2 };\n"), 'propre');
  add('commentaire de ligne (histoire d’un chiffre)', () => code(`// « ${STALE_STRINGS[0]} cordages » avait vieilli (${S}).\nexport const a = 1;\n`), 'propre');
  add('commentaire de bloc et JSDoc', () => code(`/**\n * Le site exposait ${STALE_STRINGS[0]} cordages.\n */\n/* ${STALE_STRINGS[1] ?? STALE_STRINGS[0]} raquettes */\nexport const a = 1;\n`), 'propre');
  add('29 raquettes sur 129 (TSX, pas un total accolé)', () => code(tsx('<p>Quand le fabricant ne le publie pas (29 raquettes sur 129, dont les 27 juniors)</p>')), 'propre');
  add('sous-famille en TSX (« 102 cordages polyester »)', () => code(tsx('<p>102 cordages polyester</p>')), 'propre');

  // -- Blog : AVERT seulement, daté ou non --------------------------------------------------------
  add('blog : total périmé = AVERT, pas échec', () => html('', `<p>${STALE_STRINGS[0]} strings</p>`, { severity: 'warn' }), 'avert');
  add('blog : borne fausse = AVERT', () => html('', `<p>more than ${S + 11} strings</p>`, { severity: 'warn' }), 'avert');
  add('blog : total courant = rien', () => html('', `<p>${S} strings</p>`, { severity: 'warn' }), 'propre');
  add('blog : phrase datée = AVERT', () => html('', `<p>Source: catalogue, ${STALE_STRINGS[0]} strings, as of October 9, 2026.</p>`, { severity: 'warn' }), 'avert');

  // Exécution des cas
  let nFail = 0;
  let nClean = 0;
  let nWarn = 0;
  for (const [name, run, expected] of cases) {
    let found;
    try {
      found = run();
    } catch (e) {
      fail(`test négatif « ${name} » inexécutable : ${e.message}`);
      continue;
    }
    if (expected === 'echec') {
      nFail++;
      if (!fails(found)) fail(`test négatif : garde-fou muet sur « ${name} » (échec attendu, ${found.length} constat(s))`);
    } else if (expected === 'propre') {
      nClean++;
      if (!clean(found)) fail(`témoin positif refusé : « ${name} » → ${found.map(describe).join(' ; ')}`);
    } else {
      nWarn++;
      if (found.length === 0 || found.some((f) => f.severity !== 'warn')) fail(`test négatif (blog) : « ${name} » doit donner des AVERT et aucun échec (${found.length} constat(s))`);
    }
  }

  // Datation des phrases du blog : une phrase datée et une phrase sans date sont distinguées
  {
    const f = html('', `<p>Source: catalogue, ${STALE_STRINGS[0]} string pages, as of October 9, 2026.</p>`, { severity: 'warn' });
    const g = html('', `<p>Explore ${STALE_STRINGS[0]} strings and their stiffness.</p>`, { severity: 'warn' });
    if (!(f.length === 1 && f[0].dated === true)) fail('test négatif (blog) : la date « as of October 9, 2026 » n’est pas reconnue');
    if (!(g.length === 1 && g[0].dated === false)) fail('test négatif (blog) : une phrase sans date est prise pour une phrase datée');
  }

  // Numéros de ligne : le constat pointe la bonne ligne
  {
    const f = scanHtml('<html>\n<head>\n</head>\n<body>\n<p>ok</p>\n<p>Base: 181 strings</p>\n</body>\n</html>\n', { file: 'x.html', counts: { racquets: R, strings: 179 } });
    if (!(f.length === 1 && f[0].line === 6)) fail(`numéro de ligne : 6 attendu, ${f[0]?.line ?? 'aucun constat'} obtenu`);
    const g = scanCode("const a = 1;\n\nexport const m = {\n  description: '181 cordages',\n};\n", { file: 'x.ts', counts: { racquets: R, strings: 179 } });
    if (!(g.length === 1 && g[0].line === 4)) fail(`numéro de ligne (code) : 4 attendu, ${g[0]?.line ?? 'aucun constat'} obtenu`);
    const jsx = scanCode('export default function P() {\n  return (\n    <div>\n      <p>\n        Base : 181 cordages\n      </p>\n    </div>\n  );\n}\n', { file: 'x.tsx', counts: { racquets: R, strings: 179 } });
    if (!(jsx.length === 1 && jsx[0].line === 5)) fail(`numéro de ligne (JSX) : 5 attendu, ${jsx[0]?.line ?? 'aucun constat'} obtenu`);
  }

  // Indépendance du garde-fou vis-à-vis du catalogue courant : mêmes tests, autres totaux
  {
    const counts = { racquets: 140, strings: 200 };
    const a = scanHtml(page(meta('Catalog of 181 tennis strings'), '<p>129 racquets</p>'), { file: 'x.html', counts });
    const b = scanHtml(page(meta('Catalog of 200 tennis strings'), '<p>140 racquets, more than 190 strings</p>'), { file: 'x.html', counts });
    if (a.length !== 2) fail(`totaux simulés (140 / 200) : 2 constats attendus sur 181 strings et 129 racquets, ${a.length} obtenu(s)`);
    if (b.length !== 0) fail(`totaux simulés (140 / 200) : totaux justes refusés (${b.map(describe).join(' ; ')})`);
  }

  // Plage de détection
  if (!rangeCovers({ racquets: 129, strings: 179 })) fail('plage : 129 / 179 devraient être couverts');
  if (rangeCovers({ racquets: 129, strings: 235 })) fail('plage : un catalogue de 235 cordages (marge 20) devrait être refusé');
  if (rangeCovers({ racquets: 115, strings: 179 })) fail('plage : un catalogue de 115 raquettes (marge 20) devrait être refusé');

  // Exceptions : une exception valide retire le constat, une inutilisée échoue, une mal formée est refusée
  {
    const fk = html('', `<p>${STALE_STRINGS[0]} strings</p>`);
    const good = [{ file: 'public/en/test.html', contains: `${STALE_STRINGS[0]} strings`, date: '2026-10-10', reason: 'citation historique datée, voulue ici' }];
    const r = applyExceptions(fk, good);
    if (!(r.kept.length === 0 && r.unused.length === 0)) fail('exception valide : le constat devrait être retiré et l’exception comptée comme utilisée');
    const other = applyExceptions(fk, [{ ...good[0], file: 'public/en/autre.html' }]);
    if (!(other.kept.length === 1 && other.unused.length === 1)) fail('exception d’un autre fichier : ne doit rien retirer et doit être signalée inutilisée');
    const stale = applyExceptions([], good);
    if (stale.unused.length !== 1) fail('exception sans constat : doit être signalée inutilisée');
    if (exceptionProblems(good).length !== 0) fail('exception valide refusée par la validation');
    if (exceptionProblems([{ ...good[0], reason: '' }]).length === 0) fail('exception sans motif acceptée');
    if (exceptionProblems([{ ...good[0], reason: 'trop court' }]).length === 0) fail('exception au motif d’une étiquette acceptée');
    if (exceptionProblems([{ ...good[0], date: '10/10/2026' }]).length === 0) fail('exception à la date mal formée acceptée');
    if (exceptionProblems([{ ...good[0], date: undefined }]).length === 0) fail('exception sans date acceptée');
    if (exceptionProblems([{ ...good[0], file: '' }]).length === 0) fail('exception sans fichier acceptée');
    // une exception ne couvre jamais un AVERT du blog ni un autre texte du même fichier
    const mixed = applyExceptions([...fk, ...html('', `<p>${STALE_STRINGS[1] ?? 175} cordages</p>`)], good);
    if (mixed.kept.length !== 1) fail('exception : ne doit couvrir que le texte nommé');
  }

  if (failures === before) {
    ok(
      `tests négatifs : ${nFail} altérations détectées (totaux périmés 190/181/174/173 et 107/104/±1, méta, og, JSON-LD, tuile, entités, script, JSX, metadata TS, bornes fausses), ` +
        `${nClean} témoins acceptés (totaux courants, bornes vraies, sous-familles « 102 polyesters », commentaires, nombres calculés), ` +
        `${nWarn} cas blog en AVERT seulement ; lignes, totaux simulés, plage et exceptions éprouvés`,
    );
  }
}

process.stdout.write(`\n${failures === 0 ? 'Conforme' : 'NON CONFORME'} — ${failures} échec(s), ${warnings} avertissement(s)\n`);
process.exit(failures === 0 ? 0 : 1);
