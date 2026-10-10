#!/usr/bin/env node
/**
 * QA NATURE DES NOTES DES CORDAGES — surfaces EN (tsa-acquisition, 10/10/2026).
 *
 * Principe décidé par Pierre le 10/10/2026 : « Cordages : garder les notes et les
 * étiqueter partout. » Constat d'origine (PR #103, docs/arbitrages/2026-10-10_provenance-
 * notes-cordages.html) : les notes /10 des cordages ne viennent pas de Tennis Warehouse
 * (12 reprises sur 1 182) ; l'origine de 1 062 d'entre elles est inconnue. La rigidité
 * (lb/in), indiquée à part, est la donnée du cordage que le RCS utilise ; qu'elle soit
 * « mesurée » n'est pas assuré pour les 181 fiches (PR #105, règle 3) : aucune surface ne
 * l'affirme. Ni les chaînes de testeurs ni Tennis Warehouse ne sont cités comme auteurs
 * de ces notes. Ce script vérifie, sans rien modifier :
 *
 *  1. LIBELLÉS DE RÉFÉRENCE — public/js/rating-labels.js porte, MOT POUR MOT, les trois
 *     libellés et la mention courte de la constante CONTRACT ci-dessous (libellés arrêtés
 *     le 10/10/2026 ; le principe est celui de Pierre, la formulation exacte est à
 *     valider par lui). Changer un libellé impose de changer le contrat ici : un
 *     glissement de vocabulaire est toujours un diff visible.
 *  2. CORDAGES HARMONISÉS — trois lectures indépendantes de la même liste doivent
 *     s'accorder : le tableau de src/data/tester-ratings.ts lu par expression régulière,
 *     le même tableau évalué par le générateur, et public/data/string-rating-basis.json
 *     (si généré). Chaque id existe au catalogue et porte des notes.
 *  3. FICHES /en/strings/<id>.html — pour chaque cordage : le libellé de sa nature est
 *     présent UNE fois, AVANT la première note, et c'est le bon (harmonisé / éditorial /
 *     « Not published ») ; les cinq notes affichées sont celles du catalogue, dans l'ordre ;
 *     la mention courte accompagne les notes ; aucune note /10 hors du bloc étiqueté ;
 *     aucune chaîne de testeurs ni Tennis Warehouse dans le bloc. Les fiches sont
 *     rendues en mémoire par le générateur ; celles du disque (si générées) doivent leur
 *     être identiques (sinon : périmées, relancer npm run build:en-products).
 *  4. MÉTADONNÉES — ni title, ni description, ni og:*, ni twitter:*, ni JSON-LD d'aucune
 *     page EN (hors blog) ne contient une note, un mot « rating », un type de note
 *     (aggregateRating, reviewRating…) ni une propriété structurée portant une note.
 *  5. SURFACES DYNAMIQUES — toute page EN ou script de public/js qui affiche une note
 *     de cordage (…, '/10') charge rating-labels.js et l'appelle (label/basis).
 *  6. MÉTADONNÉES FR — generateMetadata de src/app/tennis-strings/[slug]/page.tsx ne lit
 *     aucun champ de note et ne contient aucun « /10 » ; et, si la sortie de `npm run
 *     build` (.next) est présente et plus récente que ce fichier, les pages FR qu'elle a
 *     produites n'ont ni note dans title/description/og/twitter ni propriété de note
 *     dans leur JSON-LD (sortie périmée : AVERT, pas d'échec).
 *  7. MENTION FR ET FORMULE ÉCARTÉE — (a) toute occurrence, dans src/, de la première
 *     phrase de la mention FR de référence (CONTRACT.noteFr, pour l'agent FR) est suivie
 *     du texte entier (apostrophes, entités JSX et espaces normalisés) ; aucune
 *     occurrence = étiquetage FR pas encore fusionné, contrôle inactif (AVERT) ; (b) aucune
 *     surface (fiches et pages EN, public/js, src/) n'affirme que la rigidité est « la
 *     grandeur mesurée » : pas assuré pour les 181 fiches.
 *  8. TESTS NÉGATIFS — chaque garde-fou est éprouvé sur une altération qui DOIT échouer
 *     (libellé retiré, faux libellé, libellé placé après les notes, note modifiée, note
 *     dans une meta, aggregateRating, note hors bloc, page sans libellés, liste
 *     incomplète, note dans la meta FR, libellé reformulé, ancienne mention rétablie,
 *     mention FR altérée…) et sur un témoin qui DOIT passer. Un garde-fou muet échoue.
 *
 * Ce script n'ouvre pas de navigateur : l'affichage des pages dynamiques (catalogue,
 * comparateur, configurateur) est vérifié en exécution par la PR, pas ici.
 *
 * Usage : node scripts/qa-string-rating-labels.mjs
 * Sortie : 0 si conforme, 1 sinon. Les fiches générées absentes sont signalées en AVERT.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { buildCatalog, loadTsCatalog } from './catalog/catalog-json.mjs';
import { loadProductImages } from './catalog/product-images.mjs';
import { BASIS_JSON_PATH, RATING_LABELS, TESTER_RATINGS_TS, harmonisedStringIds } from './en-products/rating-basis.mjs';
import { stringPage } from './en-products/build-en-product-pages.mjs';

const ROOT = process.cwd();
const FICHES_DIR = 'public/en/strings';
const LABELS_JS = 'public/js/rating-labels.js';
const FR_PAGE = 'src/app/tennis-strings/[slug]/page.tsx';

// Constante de référence : libellés arrêtés le 10/10/2026. Le principe (étiqueter les notes)
// est décidé par Pierre ; la formulation exacte reste à valider par lui : ne pas lui
// attribuer les mots. Le contrôle est mot pour mot par rapport à cette constante.
const CONTRACT = {
  editorial: 'TSA editorial rating',
  harmonised: 'TSA editorial rating, harmonised with tester reviews',
  none: 'Not published',
  note: 'Team assessment, not laboratory-measured. Stiffness (lb/in), shown separately, is the string data the RCS uses.',
  // Même mention en français, pour l'étiquetage des surfaces FR (agent FR) : sert au seul contrôle de dérive.
  noteFr: "Appréciation de l'équipe, non mesurée en laboratoire. La rigidité (lb/in), indiquée à part, est la donnée du cordage utilisée par le RCS.",
};
// Première phrase de la mention FR : repère les occurrences dans src/.
const NOTE_FR_LEAD = "Appréciation de l'équipe";
// Formules écartées : « la rigidité est la grandeur mesurée » n'est pas assurée pour les 181 fiches.
const DISCARDED_RE = /measured quantity|grandeur mesur[ée]e/i;
const NOTE_FIELDS = ['control', 'comfort', 'spin', 'power', 'durability'];

let failures = 0;
let warnings = 0;
const fail = (msg) => {
  failures++;
  process.stdout.write(`  ECHEC ${msg}\n`);
};
const warn = (msg) => {
  warnings++;
  process.stdout.write(`  AVERT ${msg}\n`);
};
const ok = (msg) => process.stdout.write(`  OK    ${msg}\n`);

// ---------------------------------------------------------------------------
// Outils HTML (le HTML contrôlé est le nôtre : généré, ou écrit à la main dans public/en)
// ---------------------------------------------------------------------------
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? m[1] : null;
};
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html) => decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

// Une note : « 9.5/10 », « 6,6 / 10 », « out of 10 », « sur 10 » (pas une date : 10/10/2026).
const NOTE_RE = /\d(?:[.,]\d+)?\s*\/\s*10\b(?!\/\d)|\bout of 10\b|\bsur 10\b/i;
const RATING_WORD = /\bratings?\b/i;
const JSONLD_RATING_KEYS = /^(aggregateRating|review|reviews|reviewRating|ratingValue|ratingCount|reviewCount|bestRating|worstRating|rating)$/i;
const NOTE_PROPERTY = /\b(control|comfort|spin|power|durability|performance|versatility|innovation)\b/i;

// Affichage d'une note par une page dynamique : TSACatalog.display(valeur, '/10').
const DISPLAYS_NOTE = /,\s*(['"`])\/10\1\s*\)/;

const walkJson = (node, onKey, onString) => {
  if (Array.isArray(node)) node.forEach((n) => walkJson(n, onKey, onString));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      onKey(k, v);
      walkJson(v, onKey, onString);
    }
  } else if (typeof node === 'string') onString(node);
};

function metadataProblems(html, where) {
  const problems = [];
  const bits = [];
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (title) bits.push(['title', decode(title[1])]);
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = attr(tag, 'name') ?? attr(tag, 'property');
    if (key && /^(description|og:title|og:description|twitter:title|twitter:description)$/i.test(key)) bits.push([key, decode(attr(tag, 'content') ?? '')]);
  }
  for (const [key, value] of bits) {
    if (NOTE_RE.test(value) || RATING_WORD.test(value)) problems.push(`${where} : « ${key} » annonce une note (« ${value.slice(0, 90)} »)`);
  }
  for (const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      problems.push(`${where} : JSON-LD invalide (${e.message})`);
      continue;
    }
    walkJson(
      data,
      (k, v) => {
        if (JSONLD_RATING_KEYS.test(k)) problems.push(`${where} : JSON-LD porte « ${k} »`);
        if (k === 'additionalProperty') {
          // propriété structurée nommée d'après une note (Control, Comfort…) : une note n'est pas une donnée structurée
          for (const prop of [v].flat()) {
            if (prop && typeof prop.name === 'string' && NOTE_PROPERTY.test(prop.name)) problems.push(`${where} : JSON-LD déclare une propriété « ${prop.name} » (nom d'une note)`);
          }
        }
      },
      (s) => {
        if (NOTE_RE.test(s) || RATING_WORD.test(s)) problems.push(`${where} : JSON-LD contient une note (« ${s.slice(0, 80)} »)`);
      },
    );
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Fiches /en/strings/<id>.html
// ---------------------------------------------------------------------------
function ratingsSection(html) {
  const i = html.indexOf('Playing ratings (out of 10)');
  if (i < 0) return null;
  const start = html.lastIndexOf('<section', i);
  const endTag = html.indexOf('</section>', i);
  if (start < 0 || endTag < 0) return null;
  const end = endTag + '</section>'.length;
  return { start, end, html: html.slice(start, end) };
}

function ficheProblems(html, { id, row, expected }) {
  const problems = [];
  const sec = ratingsSection(html);
  if (!sec) return [`${id} : bloc « Playing ratings (out of 10) » introuvable`];
  const s = sec.html;
  const bars = [...s.matchAll(/aria-label="([A-Za-z]+): ([0-9.]+) out of 10"/g)].map((m) => [m[1].toLowerCase(), m[2]]);
  const basisTags = [...s.matchAll(/<p\b[^>]*\bdata-rating-basis="([a-z]+)"[^>]*>([\s\S]*?)<\/p>/g)];
  const noteTags = [...s.matchAll(/<p\b[^>]*\bdata-rating-note\b[^>]*>([\s\S]*?)<\/p>/g)];
  if (basisTags.length !== 1) problems.push(`${id} : ${basisTags.length} libellé(s) de nature dans le bloc des notes, 1 attendu`);
  else {
    const [, basis, inner] = basisTags[0];
    if (basis !== expected) problems.push(`${id} : nature « ${basis} » affichée, « ${expected} » attendue (liste des harmonisés, notes publiées)`);
    const shown = textOf(inner);
    if (shown !== CONTRACT[basis]) problems.push(`${id} : libellé « ${shown} », « ${CONTRACT[basis]} » attendu`);
  }
  if (expected === 'none') {
    if (bars.length > 0) problems.push(`${id} : ${bars.length} note(s) affichée(s) pour un cordage sans note publiée`);
    if (noteTags.length > 0) problems.push(`${id} : mention « équipe » affichée alors qu'aucune note n'est publiée`);
  } else {
    if (bars.length !== NOTE_FIELDS.length) problems.push(`${id} : ${bars.length} note(s) affichée(s), ${NOTE_FIELDS.length} attendues`);
    NOTE_FIELDS.forEach((f, i) => {
      const b = bars[i];
      if (!b || b[0] !== f || b[1] !== String(row[f])) problems.push(`${id} : ${f} affiché « ${b ? `${b[0]} ${b[1]}` : 'rien'} », catalogue « ${row[f]} »`);
    });
    if (noteTags.length !== 1 || textOf(noteTags[0][1]) !== CONTRACT.note) problems.push(`${id} : mention courte absente ou reformulée`);
    const label = s.indexOf('data-rating-basis');
    const firstNote = s.search(/aria-label="[A-Za-z]+: [0-9.]+ out of 10"/);
    if (!(label >= 0 && firstNote >= 0 && label < firstNote)) problems.push(`${id} : le libellé ne précède pas la première note`);
  }
  const outside = html.slice(0, sec.start) + html.slice(sec.end);
  if (NOTE_RE.test(outside.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''))) problems.push(`${id} : une note /10 apparaît hors du bloc étiqueté`);
  if (/tennisnerd|tenncom|rackets and runners|tennis ?warehouse/i.test(s)) problems.push(`${id} : une chaîne de testeurs ou Tennis Warehouse est nommée dans le bloc des notes`);
  return problems;
}

// ---------------------------------------------------------------------------
// Pages dynamiques, métadonnées FR, liste des harmonisés
// ---------------------------------------------------------------------------
function wiringProblems(file, src) {
  const problems = [];
  const isHtml = file.endsWith('.html');
  const displaysNote = DISPLAYS_NOTE.test(src);
  if (!displaysNote) return problems;
  if (isHtml && !/<script\b[^>]*\bsrc="\/js\/rating-labels\.js"[^>]*>/.test(src)) problems.push(`${file} : affiche des notes de cordage sans charger /js/rating-labels.js`);
  if (!/TSARatingLabels\.(label|basis)\(/.test(src)) problems.push(`${file} : affiche des notes de cordage sans appeler TSARatingLabels.label/basis`);
  return problems;
}

function frMetadataProblems(src) {
  const start = src.indexOf('export function generateMetadata');
  const end = src.indexOf('export default function', start);
  if (start < 0 || end < 0) return [`${FR_PAGE} : generateMetadata introuvable (garde-fou à adapter)`];
  const code = src
    .slice(start, end)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  const problems = [];
  if (/\/10\b|sur 10\b/.test(code)) problems.push(`${FR_PAGE} : generateMetadata contient « /10 »`);
  const field = code.match(/\bstring\.(performance|control|comfort|durability|versatility|innovation|spin|power)\b/);
  if (field) problems.push(`${FR_PAGE} : generateMetadata lit la note « ${field[1]} »`);
  return problems;
}

function basisFileProblems(json, expectedIds) {
  const problems = [];
  if (!json || !Array.isArray(json.harmonised)) return [`${BASIS_JSON_PATH} : format inattendu`];
  const got = [...json.harmonised].sort();
  const want = [...expectedIds].sort();
  for (const id of want) if (!got.includes(id)) problems.push(`${BASIS_JSON_PATH} : « ${id} » (harmonisé) absent`);
  for (const id of got) if (!want.includes(id)) problems.push(`${BASIS_JSON_PATH} : « ${id} » listé mais non harmonisé`);
  if (new Set(got).size !== got.length) problems.push(`${BASIS_JSON_PATH} : identifiant en double`);
  return problems;
}

function testerIdsFromSource(src) {
  const start = src.indexOf('export const STRING_TESTER_RATINGS');
  if (start < 0) throw new Error(`${TESTER_RATINGS_TS} : STRING_TESTER_RATINGS introuvable`);
  return [...src.slice(start).matchAll(/^\s{1,4}['"]([a-z0-9-]+)['"]\s*:\s*\{/gm)].map((m) => m[1]);
}

function labelsContractProblems(labels) {
  const problems = [];
  for (const k of ['editorial', 'harmonised', 'none']) {
    if (labels.LABEL[k] !== CONTRACT[k]) problems.push(`${LABELS_JS} : libellé « ${k} » = « ${labels.LABEL[k]} », « ${CONTRACT[k]} » attendu`);
  }
  if (labels.NOTE !== CONTRACT.note) problems.push(`${LABELS_JS} : mention courte = « ${labels.NOTE} », « ${CONTRACT.note} » attendue`);
  if (labels.NOTE_FIELDS.join() !== NOTE_FIELDS.join()) problems.push(`${LABELS_JS} : NOTE_FIELDS = ${labels.NOTE_FIELDS.join()}, ${NOTE_FIELDS.join()} attendu`);
  // Les pages lisent l'URL ; le générateur écrit le chemin : les deux doivent désigner le même fichier.
  const served = `/${BASIS_JSON_PATH.replace(/^public\//, '')}`;
  if (labels.BASIS_URL !== served) problems.push(`${LABELS_JS} : BASIS_URL = ${labels.BASIS_URL}, le générateur écrit ${BASIS_JSON_PATH} (servi sur ${served})`);
  return problems;
}

// Normalisation pour comparer la mention FR écrite dans du code (JSX, chaînes, entités) à la référence.
const normFr = (s) =>
  s
    .replace(/\\(['"`])/g, '$1') // apostrophe échappée dans une chaîne
    .replace(/['"`]\s*\+\s*['"`]/g, '') // chaînes littérales mises bout à bout
    .replace(/\{\s*(['"`])\s\1\s*\}/g, ' ') // {' '} de JSX
    .replace(/&apos;|&#39;|&#x27;|&rsquo;|[’‘]/g, "'")
    .replace(/&nbsp;|[  ]/g, ' ')
    .replace(/\s+/g, ' ');

/** Chaque occurrence de la première phrase de la mention FR doit être suivie du texte de référence entier. */
function frMentionProblems(files) {
  const ref = normFr(CONTRACT.noteFr);
  const lead = normFr(NOTE_FR_LEAD);
  const problems = [];
  let found = 0;
  for (const { path: p, src } of files) {
    const n = normFr(src);
    for (let i = n.indexOf(lead); i !== -1; i = n.indexOf(lead, i + 1)) {
      found++;
      const fragment = n.slice(i, i + ref.length);
      if (fragment !== ref) problems.push(`${p} : « ${fragment.slice(0, 80)}… » diffère de la mention FR de référence`);
    }
  }
  return { problems, found };
}

/** Formule écartée (« la rigidité est la grandeur mesurée ») dans un texte de surface. */
function discardedPhraseProblems(where, text) {
  const m = DISCARDED_RE.exec(text);
  return m ? [`${where} : formule écartée « ${m[0]} » (la rigidité mesurée n'est pas assurée pour les 181 fiches, règle 3)`] : [];
}

// ---------------------------------------------------------------------------
// Exécution
// ---------------------------------------------------------------------------
process.stdout.write('QA nature des notes des cordages (EN)\n');

// 1. Libellés ---------------------------------------------------------------
{
  const problems = labelsContractProblems(RATING_LABELS);
  if (problems.length) problems.forEach(fail);
  else ok('libellés : les trois libellés et la mention courte sont conformes, mot pour mot, aux libellés de référence arrêtés le 10/10/2026 (principe décidé par Pierre)');
}

// 2. Cordages harmonisés ----------------------------------------------------
const { racquetsDatabase, stringsDatabase } = await loadTsCatalog(ROOT);
const rows = buildCatalog(racquetsDatabase, stringsDatabase).strings;
const rowById = new Map(rows.map((r) => [r.id, r]));
const hasRating = (r) => NOTE_FIELDS.some((f) => r[f] !== null && r[f] !== undefined);

const fromRegex = testerIdsFromSource(readFileSync(path.join(ROOT, TESTER_RATINGS_TS), 'utf8'));
const fromGenerator = [...harmonisedStringIds(ROOT)];
let fromFile = null;
{
  const before = failures;
  const a = [...fromRegex].sort().join();
  const b = [...fromGenerator].sort().join();
  if (fromRegex.length === 0) fail(`${TESTER_RATINGS_TS} : aucun cordage lu par expression régulière (format du fichier modifié ?)`);
  if (a !== b) fail(`cordages harmonisés : la lecture par expression régulière (${fromRegex.length}) et celle du générateur (${fromGenerator.length}) divergent`);
  for (const id of fromGenerator) {
    const r = rowById.get(id);
    if (!r) fail(`cordage harmonisé « ${id} » absent du catalogue`);
    else if (!hasRating(r)) fail(`cordage harmonisé « ${id} » sans aucune note publiée`);
  }
  const file = path.join(ROOT, BASIS_JSON_PATH);
  if (existsSync(file)) {
    fromFile = JSON.parse(readFileSync(file, 'utf8'));
    basisFileProblems(fromFile, fromGenerator).forEach(fail);
  } else {
    warn(`${BASIS_JSON_PATH} absent (généré par npm run build:en-products) : liste non vérifiée sur disque`);
  }
  const tracked = execFileSync('git', ['ls-files', '--', BASIS_JSON_PATH], { encoding: 'utf8' }).trim();
  if (tracked) fail(`${BASIS_JSON_PATH} est versionné : il doit rester généré (.gitignore)`);
  const ignore = readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
  if (!ignore.includes(BASIS_JSON_PATH)) fail(`.gitignore ne liste pas ${BASIS_JSON_PATH}`);
  const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  if (!/build:en-products/.test(pkg.scripts?.prebuild ?? '')) fail('prebuild ne génère plus les fiches EN ni la liste des cordages harmonisés (Netlify servirait un fichier absent)');
  if (failures === before) {
    ok(`cordages harmonisés : ${fromGenerator.length}, lecture régulière = générateur${fromFile ? ' = string-rating-basis.json' : ''}, tous au catalogue avec notes, fichier généré non versionné`);
  }
}

// 3. Fiches -----------------------------------------------------------------
const harmonised = new Set(fromGenerator);
const expectedOf = (r) => (!hasRating(r) ? 'none' : harmonised.has(r.id) ? 'harmonised' : 'editorial');
const { images } = await loadProductImages(ROOT);
const rendered = new Map(rows.map((r) => [r.id, stringPage(r, images)]));
{
  const before = failures;
  const census = { harmonised: 0, editorial: 0, none: 0 };
  let notes = 0;
  let onDisk = 0;
  for (const r of rows) {
    const expected = expectedOf(r);
    census[expected]++;
    if (expected !== 'none') notes += NOTE_FIELDS.length;
    const html = rendered.get(r.id);
    ficheProblems(html, { id: r.id, row: r, expected }).forEach(fail);
    const file = path.join(ROOT, FICHES_DIR, `${r.id}.html`);
    if (existsSync(file)) {
      onDisk++;
      if (readFileSync(file, 'utf8') !== html) {
        fail(`${r.id} : la fiche générée sur disque diffère du rendu actuel — relancer npm run build:en-products`);
      }
    }
  }
  if (onDisk === 0) warn(`${FICHES_DIR}/ absent (généré par npm run build:en-products) : contrôle sur le rendu en mémoire seulement`);
  else if (onDisk !== rows.length) fail(`${FICHES_DIR}/ : ${onDisk} fiches sur disque, ${rows.length} cordages au catalogue`);
  if (failures === before) {
    ok(
      `fiches : ${rows.length} cordages = ${census.harmonised} harmonisés + ${census.editorial} éditoriaux + ${census.none} sans note ; libellé avant la première note, ` +
        `${notes} notes identiques au catalogue, mention courte présente, aucune note hors du bloc${onDisk ? `, ${onDisk} fiches du disque identiques au rendu` : ''}`,
    );
  }
}

// 4. Métadonnées de toutes les pages EN (hors blog) -------------------------
const topLevelPages = readdirSync(path.join(ROOT, 'public/en')).filter((f) => f.endsWith('.html')).map((f) => `public/en/${f}`);
{
  const before = failures;
  for (const r of rows) metadataProblems(rendered.get(r.id), `fiche EN ${r.id}`).forEach(fail);
  for (const f of topLevelPages) metadataProblems(readFileSync(path.join(ROOT, f), 'utf8'), f).forEach(fail);
  if (failures === before) ok(`métadonnées : ${rows.length} fiches + ${topLevelPages.length} pages EN sans note, sans « rating » ni type de note, JSON-LD valide`);
}

// 5. Surfaces dynamiques ----------------------------------------------------
const wiredFiles = [...topLevelPages, ...readdirSync(path.join(ROOT, 'public/js')).filter((f) => f.endsWith('.js') && f !== 'rating-labels.js').map((f) => `public/js/${f}`)];
{
  const before = failures;
  const wired = [];
  for (const f of wiredFiles) {
    const src = readFileSync(path.join(ROOT, f), 'utf8');
    wiringProblems(f, src).forEach(fail);
    if (DISPLAYS_NOTE.test(src)) wired.push(f.replace('public/en/', ''));
  }
  if (wired.length === 0) fail('surfaces dynamiques : aucune page EN n\'affiche plus de note de cordage — garde-fou à revoir');
  if (failures === before) ok(`surfaces dynamiques : ${wired.join(', ')} chargent rating-labels.js et l'appellent avant d'afficher une note`);
}

// 6. Métadonnées FR ----------------------------------------------------------
const frSource = readFileSync(path.join(ROOT, FR_PAGE), 'utf8');
{
  const problems = frMetadataProblems(frSource);
  if (problems.length) problems.forEach(fail);
  else ok('métadonnées FR : generateMetadata de la fiche cordage ne lit aucune note et ne contient aucun « /10 »');
}

// 6 bis. Sortie du build Next (si présente et à jour) : les pages FR réellement produites
const FR_BUILD_DIR = '.next/server/app/tennis-strings';
let frBuilt = null;
// Page FR minimale au format de la sortie de Next (balises meta auto-fermantes), pour éprouver
// le garde-fou même quand .next est absent : le nombre de tests négatifs ne dépend pas du build.
const FR_PAGE_SAMPLE =
  '<html><head><title>Head Lynx Tour — cordage polyester</title><meta name="description" content="Head Lynx Tour : cordage polyester, rigidité 210 lb/in."/></head><body></body></html>';
{
  const dir = path.join(ROOT, FR_BUILD_DIR);
  const buildId = path.join(ROOT, '.next/BUILD_ID');
  if (!existsSync(dir) || !existsSync(buildId)) {
    warn('.next absent (npm run build) : métadonnées FR non vérifiées sur la sortie du build');
  } else if (statSync(path.join(ROOT, FR_PAGE)).mtimeMs > statSync(buildId).mtimeMs) {
    warn(`.next plus ancien que ${FR_PAGE} : relancer npm run build pour vérifier les métadonnées FR sur la sortie`);
  } else {
    const before = failures;
    const files = readdirSync(dir).filter((f) => f.endsWith('.html'));
    if (files.length !== rows.length) fail(`${FR_BUILD_DIR} : ${files.length} pages FR, ${rows.length} cordages au catalogue`);
    for (const f of files) {
      const html = readFileSync(path.join(dir, f), 'utf8');
      frBuilt ??= html;
      metadataProblems(html, `page FR ${f}`).forEach(fail);
    }
    if (failures === before) ok(`métadonnées FR (sortie du build) : ${files.length} pages sans note dans title/description/og/twitter, JSON-LD valide et sans propriété de note`);
  }
}

// 7. Mention FR de référence et formule écartée --------------------------------
const walkSrc = (dir) =>
  readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) return walkSrc(rel);
    return /\.(tsx?|mts|jsx?|mjs)$/.test(e.name) ? [rel] : [];
  });
{
  const before = failures;
  const srcFiles = walkSrc('src').map((p) => ({ path: p, src: readFileSync(path.join(ROOT, p), 'utf8') }));
  const fr = frMentionProblems(srcFiles);
  fr.problems.forEach(fail);
  if (fr.found === 0) warn('mention FR de référence absente de src/ (étiquetage FR pas encore fusionné) : contrôle de dérive inactif');
  const jsFiles = readdirSync(path.join(ROOT, 'public/js')).filter((f) => f.endsWith('.js')).map((f) => `public/js/${f}`);
  let scanned = 0;
  for (const r of rows) {
    scanned++;
    discardedPhraseProblems(`fiche EN ${r.id}`, rendered.get(r.id)).forEach(fail);
  }
  for (const f of [...topLevelPages, ...jsFiles, ...srcFiles.map((s) => s.path)]) {
    scanned++;
    const text = srcFiles.find((s) => s.path === f)?.src ?? readFileSync(path.join(ROOT, f), 'utf8');
    discardedPhraseProblems(f, text).forEach(fail);
  }
  if (failures === before) {
    ok(
      `mention FR et formule écartée : ${fr.found} occurrence(s) de la mention FR dans src/${fr.found ? ', conformes' : ''} ; ` +
        `aucune des ${scanned} surfaces (fiches et pages EN, public/js, src/) n'affirme « grandeur mesurée »`,
    );
  }
}

// 8. Tests négatifs -----------------------------------------------------------
{
  const before = failures;
  const pick = (kind) => rows.find((r) => expectedOf(r) === kind);
  const H = pick('harmonised');
  const E = pick('editorial');
  const N = pick('none');
  if (!H || !E || !N) {
    fail('tests négatifs : il faut au moins un cordage harmonisé, un éditorial et un sans note au catalogue pour éprouver les garde-fous');
    process.stdout.write(`\nNON CONFORME — ${failures} échec(s), ${warnings} avertissement(s)\n`);
    process.exit(1);
  }
  const ctx = (r) => ({ id: r.id, row: r, expected: expectedOf(r) });
  // Une altération qui ne trouve pas sa cible ne prouverait rien : elle échoue bruyamment.
  const swap = (text, pattern, replacement) => {
    const hit = typeof pattern === 'string' ? text.includes(pattern) : pattern.test(text);
    if (!hit) throw new Error(`test négatif sans effet : « ${String(pattern).slice(0, 70)} » introuvable`);
    return text.replace(pattern, replacement);
  };
  // Altère le seul bloc des notes d'une fiche.
  const inSection = (html, fn) => {
    const sec = ratingsSection(html);
    return html.slice(0, sec.start) + fn(sec.html) + html.slice(sec.end);
  };
  const LABEL_P = /<p\b[^>]*\bdata-rating-basis="[a-z]+"[^>]*>[\s\S]*?<\/p>/;
  const NOTE_P = /<p\b[^>]*\bdata-rating-note\b[^>]*>[\s\S]*?<\/p>/;
  const stringsHtml = readFileSync(path.join(ROOT, 'public/en/strings.html'), 'utf8');
  const hHtml = rendered.get(H.id);
  const eHtml = rendered.get(E.id);
  const nHtml = rendered.get(N.id);
  const withLd = (html, node) => swap(html, '</head>', `<script type="application/ld+json">${JSON.stringify(node)}</script></head>`);
  const negatives = [
    ['libellé retiré de la fiche', () => ficheProblems(inSection(hHtml, (s) => swap(s, LABEL_P, '')), ctx(H))],
    [
      'cordage harmonisé étiqueté « éditorial »',
      () => ficheProblems(inSection(hHtml, (s) => swap(swap(s, CONTRACT.harmonised, CONTRACT.editorial), 'data-rating-basis="harmonised"', 'data-rating-basis="editorial"')), ctx(H)),
    ],
    [
      'cordage éditorial étiqueté « harmonisé »',
      () => ficheProblems(inSection(eHtml, (s) => swap(swap(s, CONTRACT.editorial, CONTRACT.harmonised), 'data-rating-basis="editorial"', 'data-rating-basis="harmonised"')), ctx(E)),
    ],
    [
      'libellé placé après les notes',
      () => ficheProblems(inSection(hHtml, (s) => swap(swap(s, LABEL_P, ''), '</section>', `${s.match(LABEL_P)[0]}</section>`)), ctx(H)),
    ],
    ['libellé reformulé', () => ficheProblems(inSection(hHtml, (s) => swap(s, CONTRACT.harmonised, 'TSA rating, based on tester reviews')), ctx(H))],
    ['mention courte retirée', () => ficheProblems(inSection(hHtml, (s) => swap(s, NOTE_P, '')), ctx(H))],
    ['note modifiée de 0,1', () => ficheProblems(swap(hHtml, `aria-label="Control: ${H.control} out of 10"`, `aria-label="Control: ${Math.round((H.control + 0.1) * 10) / 10} out of 10"`), ctx(H))],
    [
      'cordage sans note étiqueté « éditorial »',
      () => ficheProblems(inSection(nHtml, (s) => swap(swap(s, CONTRACT.none, CONTRACT.editorial), 'data-rating-basis="none"', 'data-rating-basis="editorial"')), ctx(N)),
    ],
    ['cordage sans note affichant une note', () => ficheProblems(inSection(nHtml, (s) => swap(s, '</section>', '<div role="img" aria-label="Control: 9 out of 10"></div></section>')), ctx(N))],
    ['note répétée hors du bloc étiqueté', () => ficheProblems(swap(hHtml, '<h1', `<p>Control ${H.control}/10</p><h1`), ctx(H))],
    ['chaîne de testeurs nommée dans le bloc', () => ficheProblems(inSection(hHtml, (s) => swap(s, CONTRACT.note, `${CONTRACT.note} Source: TennisNerd.`)), ctx(H))],
    ['note dans la meta description', () => metadataProblems(swap(hHtml, '<meta name="description" content="', `<meta name="description" content="Ratings: control ${H.control}/10. `), 'fiche')],
    ['note dans og:description', () => metadataProblems(swap(eHtml, '<meta property="og:description" content="', `<meta property="og:description" content="Control ${E.control}/10. `), 'fiche')],
    ['aggregateRating dans le JSON-LD', () => metadataProblems(withLd(hHtml, { '@type': 'Product', aggregateRating: { ratingValue: 4.8 } }), 'fiche')],
    ['propriété structurée « Control »', () => metadataProblems(withLd(hHtml, { '@type': 'Product', additionalProperty: [{ '@type': 'PropertyValue', name: 'Control', value: '9' }] }), 'fiche')],
    ['JSON-LD invalide', () => metadataProblems(swap(withLd(hHtml, { a: 1 }), '{"a":1}', '{"a":'), 'fiche')],
    ['page dynamique sans le script des libellés', () => wiringProblems('public/en/strings.html', swap(stringsHtml, /<script\b[^>]*src="\/js\/rating-labels\.js"[^>]*><\/script>/, ''))],
    ['page dynamique sans appel aux libellés', () => wiringProblems('public/en/strings.html', swap(stringsHtml, /TSARatingLabels\.(label|basis)\(/g, 'noop('))],
    ['liste des harmonisés incomplète', () => basisFileProblems({ harmonised: fromGenerator.slice(1) }, fromGenerator)],
    ['cordage non harmonisé dans la liste', () => basisFileProblems({ harmonised: [...fromGenerator, E.id] }, fromGenerator)],
    ['note dans la meta FR', () => frMetadataProblems(swap(frSource, 'Calculez le RCS de ce cordage avec votre raquette.`', 'Contrôle ${string.control}/10. Calculez le RCS de ce cordage avec votre raquette.`'))],
    ["note dans la meta d'une page FR construite", () => metadataProblems(swap(frBuilt ?? FR_PAGE_SAMPLE, /(<meta name="description" content=")/, '$1Contrôle 9/10. '), 'page FR')],
    ['libellé du contrat modifié', () => labelsContractProblems({ ...RATING_LABELS, LABEL: { ...RATING_LABELS.LABEL, harmonised: 'TSA rating, harmonised' } })],
    ['URL de la liste des harmonisés ≠ fichier généré', () => labelsContractProblems({ ...RATING_LABELS, BASIS_URL: '/data/harmonised.json' })],
    [
      'ancienne mention (« measured quantity ») rétablie dans une fiche',
      () => ficheProblems(inSection(hHtml, (s) => swap(s, CONTRACT.note, 'Team assessment, not laboratory-measured. Stiffness (lb/in) is the measured quantity behind the RCS.')), ctx(H)),
    ],
    [
      'ancienne mention rétablie dans la constante des libellés',
      () => labelsContractProblems({ ...RATING_LABELS, NOTE: 'Team assessment, not laboratory-measured. Stiffness (lb/in) is the measured quantity behind the RCS.' }),
    ],
    ['formule écartée dans une page EN', () => discardedPhraseProblems('page', swap(stringsHtml, '</body>', '<p>Stiffness is the measured quantity behind the RCS.</p></body>'))],
    ['formule écartée en français', () => discardedPhraseProblems('src/x.tsx', 'La rigidité est la grandeur mesurée derrière le RCS.')],
    [
      'mention FR altérée dans src/',
      () => frMentionProblems([{ path: 'src/x.tsx', src: '<p>Appréciation de l’équipe, non mesurée en laboratoire. La rigidité est la grandeur mesurée derrière le RCS.</p>' }]).problems,
    ],
    [
      'mention FR tronquée dans src/',
      () => frMentionProblems([{ path: 'src/x.tsx', src: "const NOTE = 'Appréciation de l\\'équipe, non mesurée en laboratoire.';" }]).problems,
    ],
  ];
  for (const [name, run] of negatives) {
    let found;
    try {
      found = run();
    } catch (e) {
      fail(`test négatif « ${name} » inexécutable : ${e.message}`);
      continue;
    }
    if (found.length === 0) fail(`test négatif : garde-fou muet sur « ${name} »`);
  }
  // Témoins positifs : la mention FR correctement écrite (JSX avec entité et {' '}, apostrophe
  // typographique, chaînes mises bout à bout, apostrophe échappée) DOIT passer, une fois chacune.
  const controls = [
    ["JSX avec &apos; et {' '}", "<p>\n  Appréciation de l&apos;équipe, non mesurée en laboratoire. La rigidité (lb/in),{' '}\n  indiquée à part, est la donnée du cordage utilisée par le RCS.\n</p>"],
    ['apostrophe typographique', `<p>${CONTRACT.noteFr.replace("l'équipe", 'l’équipe')}</p>`],
    ['chaînes mises bout à bout', `const NOTE = 'Appréciation de l’équipe, non mesurée en laboratoire. ' + 'La rigidité (lb/in), indiquée à part, est la donnée du cordage utilisée par le RCS.';`],
    ['apostrophe échappée', `const NOTE = '${CONTRACT.noteFr.replace("l'équipe", "l\\'équipe")}';`],
  ];
  for (const [name, src] of controls) {
    const r = frMentionProblems([{ path: 'src/x.tsx', src }]);
    if (r.problems.length > 0 || r.found !== 1) fail(`témoin positif « ${name} » : la mention FR correcte est refusée ou introuvable (${r.problems[0] ?? `${r.found} occurrence(s)`})`);
  }
  if (failures === before) {
    ok(
      `tests négatifs : ${negatives.length} altérations détectées (libellé, nature, ordre, note, meta, JSON-LD, page dynamique, liste, meta FR, contrat, ancienne mention, mention FR) ; ` +
        `${controls.length} témoins positifs acceptés (mention FR bien écrite)`,
    );
  }
}

process.stdout.write(`\n${failures === 0 ? 'Conforme' : 'NON CONFORME'} — ${failures} échec(s), ${warnings} avertissement(s)\n`);
process.exit(failures === 0 ? 0 : 1);
