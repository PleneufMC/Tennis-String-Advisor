#!/usr/bin/env node
/**
 * QA NATURE DES NOTES DES CORDAGES — surfaces EN (tsa-acquisition, 10/10/2026).
 *
 * Principe décidé par Pierre le 10/10/2026 : « Cordages : garder les notes et les
 * étiqueter partout. » Constat d'origine (PR #103, docs/arbitrages/2026-10-10_provenance-
 * notes-cordages.html) : les notes /10 des cordages ne viennent pas de Tennis Warehouse
 * (12 reprises sur 1 182) ; l'origine de 1 062 d'entre elles est inconnue. La rigidité
 * (lb/in) est la donnée du cordage que le RCS utilise ; qu'elle soit
 * « mesurée » n'est pas assuré pour les 181 fiches (PR #105, règle 3) : aucune surface ne
 * l'affirme. Ni les chaînes de testeurs ni Tennis Warehouse ne sont cités comme auteurs
 * de ces notes. Ce script vérifie, sans rien modifier :
 *
 *  1. LIBELLÉS DE RÉFÉRENCE — public/js/rating-labels.js porte, MOT POUR MOT, les quatre
 *     libellés et la mention courte de la constante CONTRACT ci-dessous (principe de Pierre
 *     du 10/10/2026, formulation tranchée par Opus 5.5 le 23/10/2026 ; jamais « measured »
 *     sans négation). Changer un libellé impose de changer le contrat ici : un
 *     glissement de vocabulaire est toujours un diff visible.
 *  2. CORDAGES HARMONISÉS — trois lectures indépendantes de la même liste doivent
 *     s'accorder : le tableau de src/data/tester-ratings.ts lu par expression régulière,
 *     le même tableau évalué par le générateur, et public/data/string-rating-basis.json
 *     (si généré). Chaque id existe au catalogue et porte des notes.
 *  3. FICHES /en/strings/<id>.html — pour chaque cordage : le libellé de sa nature est
 *     présent UNE fois, AVANT la première note, et c'est le bon (harmonisé / note reprise /
 *     équipe / « Not published ») ; les cinq notes affichées sont celles du catalogue, dans l'ordre ;
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
 *  7 bis. EXPORT public/data/catalog.json (22/10/2026) — il publie les notes : chaque cordage
 *     y porte sa nature (`rating_basis`, celle de sa fiche) et `meta` les libellés et la
 *     mention de référence, en mémoire comme sur disque (si généré).
 *  7 ter. REPLI DU CHARGEUR EN (23/10/2026) — public/js/rating-labels.js exécuté tel quel avec une liste des
 *     natures injoignable, puis d'un ancien format sans `third_party` : toute note porte « Rating not measured »,
 *     jamais une nature attribuée (« équipe » par défaut serait attribuer à TSA une note reprise d'un tiers).
 *  2 bis. D2 (23/10/2026) — les cordages dont la note de confort a été recalée sur la rigidité
 *     mesurée (src/data/comfort-recalibration.ts) portent, en plus du libellé de leur nature,
 *     la mention CONTRACT.recalibrated, mot pour mot ; les autres ne la portent pas. La liste
 *     lue par le générateur est celle de string-rating-basis.json (« comfort_recalibrated »). Seule
 *     exception, exacte, à « measured » sans négation : « measured stiffness (TWU) » de cette mention
 *     (la rigidité TWU est mesurée, la note ne l'est pas). Le chargeur EN lu (pages dynamiques) ajoute
 *     la mention aux fiches recalées et à elles seules ; un fichier sans « comfort_recalibrated » est
 *     un format inattendu : repli 7 ter.
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
import vm from 'node:vm';
import { buildCatalog, loadTsCatalog } from './catalog/catalog-json.mjs';
import { loadProductImages } from './catalog/product-images.mjs';
import { BASIS_JSON_PATH, COMFORT_RECALIBRATION_TS, RATING_LABELS, TESTER_RATINGS_TS, THIRD_PARTY_TS, harmonisedStringIds, recalibratedStringIds, thirdPartyStringIds } from './en-products/rating-basis.mjs';
import { stringPage } from './en-products/build-en-product-pages.mjs';

const ROOT = process.cwd();
const FICHES_DIR = 'public/en/strings';
const LABELS_JS = 'public/js/rating-labels.js';
const FR_PAGE = 'src/app/tennis-strings/[slug]/page.tsx';

// Constante de référence. Le principe (étiqueter les notes) est décidé par Pierre le 10/10/2026 ;
// la formulation est tranchée par Opus 5.5 le 23/10/2026 (délégation de l'orchestrateur) : ne pas
// l'attribuer à Pierre. Le contrôle est mot pour mot par rapport à cette constante.
const CONTRACT = {
  editorial: 'TSA team rating, not measured',
  harmonised: 'Average of the TSA team rating and published tester reviews, not measured',
  third_party: "Rating taken, in whole or in part, from a retailer's published test, not measured",
  // Repli si la liste des natures est injoignable : aucune nature attribuée, aucun auteur nommé (jamais « équipe »).
  unknown: 'Rating not measured',
  none: 'Not published',
  // D2 du 23/10/2026 : mention ajoutée au libellé des cordages dont la note de confort a été recalée sur la rigidité mesurée.
  recalibrated: 'comfort rating recalibrated on measured stiffness (TWU)',
  note: 'Ratings out of 10 are not measured; each rating shows its basis. The RCS index and the arm alert use stiffness (lb/in) only.',
  // Mention française (src/lib/string-rating-nature.ts) : sert au seul contrôle de dérive.
  noteFr: "Notes /10 non mesurées : la nature de chaque note est indiquée à côté. L'indice RCS n'utilise que la rigidité (lb/in) ; l'alerte bras peut aussi se déclencher sur la note de confort.",
};
const BASES = ['editorial', 'harmonised', 'third_party', 'unknown', 'none'];
// Première phrase de la mention FR : repère les occurrences dans src/.
const NOTE_FR_LEAD = 'Notes /10 non mesurées';
// Aucune note /10 n'est une mesure : « measured » sans négation est refusé dans les libellés et la mention.
const AFFIRMS_MEASURE = /(?<!not )(?<!not laboratory-)measured/i;
// Seule exception, exacte et unique : la mention D2, où « measured stiffness (TWU) » qualifie la rigidité TWU, jamais la note.
const D2_MEASURED_STIFFNESS = 'measured stiffness (TWU)';
const recalibratedAffirmsMeasure = (t) => AFFIRMS_MEASURE.test(t.split(D2_MEASURED_STIFFNESS).join(''));
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

function ficheProblems(html, { id, row, expected, recal = false }) {
  const problems = [];
  const sec = ratingsSection(html);
  if (!sec) return [`${id} : bloc « Playing ratings (out of 10) » introuvable`];
  const s = sec.html;
  const bars = [...s.matchAll(/aria-label="([A-Za-z]+): ([0-9.]+) out of 10"/g)].map((m) => [m[1].toLowerCase(), m[2]]);
  const basisTags = [...s.matchAll(/<p\b[^>]*\bdata-rating-basis="([a-z_]+)"[^>]*>([\s\S]*?)<\/p>/g)];
  const noteTags = [...s.matchAll(/<p\b[^>]*\bdata-rating-note\b[^>]*>([\s\S]*?)<\/p>/g)];
  if (basisTags.length !== 1) problems.push(`${id} : ${basisTags.length} libellé(s) de nature dans le bloc des notes, 1 attendu`);
  else {
    const [, basis, inner] = basisTags[0];
    if (basis !== expected) problems.push(`${id} : nature « ${basis} » affichée, « ${expected} » attendue (liste des harmonisés, notes publiées)`);
    const shown = textOf(inner);
    const want = recal && expected !== 'none' ? `${CONTRACT[basis]}; ${CONTRACT.recalibrated}` : CONTRACT[basis];
    if (shown !== want) problems.push(`${id} : libellé « ${shown} », « ${want} » attendu`);
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

function basisFileProblems(json, expectedIds, expectedThirdParty = [], expectedRecalibrated = [...recalibratedStringIds(ROOT)]) {
  const problems = [];
  if (!json || !Array.isArray(json.harmonised)) return [`${BASIS_JSON_PATH} : format inattendu`];
  if ([...(json.third_party ?? [])].sort().join() !== [...expectedThirdParty].sort().join()) problems.push(`${BASIS_JSON_PATH} : liste des notes reprises ≠ ${THIRD_PARTY_TS}`);
  const recal = Array.isArray(json.comfort_recalibrated) ? [...json.comfort_recalibrated].sort().join() : null;
  if (recal !== [...expectedRecalibrated].sort().join()) problems.push(`${BASIS_JSON_PATH} : « comfort_recalibrated » = ${recal ?? 'absent'}, ${[...expectedRecalibrated].sort().join()} attendu (${COMFORT_RECALIBRATION_TS})`);
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
  for (const k of BASES) {
    if (labels.LABEL[k] !== CONTRACT[k]) problems.push(`${LABELS_JS} : libellé « ${k} » = « ${labels.LABEL[k]} », « ${CONTRACT[k]} » attendu`);
  }
  if (labels.RECALIBRATED !== CONTRACT.recalibrated) problems.push(`${LABELS_JS} : mention D2 = « ${labels.RECALIBRATED} », « ${CONTRACT.recalibrated} » attendue`);
  for (const t of [...Object.values(labels.LABEL), labels.NOTE]) if (AFFIRMS_MEASURE.test(t)) problems.push(`${LABELS_JS} : « ${t} » présente une note comme mesurée`);
  if (recalibratedAffirmsMeasure(labels.RECALIBRATED)) problems.push(`${LABELS_JS} : mention D2 « ${labels.RECALIBRATED} » présente une note comme mesurée (seule « ${D2_MEASURED_STIFFNESS} » est admise)`);
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

/** Export catalog.json : nature de chaque cordage (celle de sa fiche), libellés et mention de référence dans `meta`. */
function catalogExportProblems(catalog, expectedBasis, where) {
  const problems = [];
  const meta = catalog?.meta ?? {};
  for (const k of BASES) {
    if (meta.rating_labels?.[k] !== CONTRACT[k]) problems.push(`${where} : meta.rating_labels.${k} = « ${meta.rating_labels?.[k]} », « ${CONTRACT[k]} » attendu`);
  }
  if (meta.ratings_notice !== CONTRACT.note) problems.push(`${where} : meta.ratings_notice absente ou reformulée`);
  for (const r of catalog?.strings ?? []) {
    if (r.rating_basis !== expectedBasis(r)) problems.push(`${where} : ${r.id} exporté avec la nature « ${r.rating_basis} », « ${expectedBasis(r)} » attendue`);
  }
  return problems;
}

/**
 * Repli de public/js/rating-labels.js quand string-rating-basis.json est injoignable : le source donné est exécuté tel quel
 * (contexte isolé, `fetch` qui échoue), puis chaque cordage est étiqueté. Attendu : « Rating not measured » pour toute note,
 * « Not published » sans note, jamais une nature attribuée (« équipe », « moyenne », « reprise »), et une erreur en console.
 */
async function fallbackProblems(labelsSrc, catalogRows, fetchImpl = () => Promise.reject(new Error('liste injoignable (test)'))) {
  const errors = [];
  const ctx = { console: { error: (m) => errors.push(String(m)), log() {}, warn() {} }, fetch: fetchImpl };
  vm.createContext(ctx);
  vm.runInContext(labelsSrc, ctx, { filename: LABELS_JS });
  const api = ctx.TSARatingLabels;
  await api.load();
  const problems = [];
  for (const r of catalogRows) {
    const got = api.label(r);
    const want = hasRating(r) ? CONTRACT.unknown : CONTRACT.none;
    if (got !== want) problems.push(`${LABELS_JS}, liste injoignable : ${r.id} étiqueté « ${got} », « ${want} » attendu (aucune nature attribuée)`);
  }
  if (errors.length === 0) problems.push(`${LABELS_JS}, liste injoignable : aucune erreur journalisée en console`);
  return problems;
}

/**
 * Chargeur EN, liste des natures lue : chaque cordage porte le libellé de sa nature, plus la mention D2 s'il est recalé et
 * affiche une note de confort (pages dynamiques : catalogue, comparateur, configurateur).
 */
async function loadedLabelProblems(labelsSrc, catalogRows, fetchImpl) {
  const ctx = { console: { error() {}, log() {}, warn() {} }, fetch: fetchImpl };
  vm.createContext(ctx);
  vm.runInContext(labelsSrc, ctx, { filename: LABELS_JS });
  const api = ctx.TSARatingLabels;
  await api.load();
  const problems = [];
  for (const r of catalogRows) {
    const basis = expectedOf(r);
    const want = recalOf(r) ? `${CONTRACT[basis]}; ${CONTRACT.recalibrated}` : CONTRACT[basis];
    const got = api.label(r);
    if (got !== want) problems.push(`${LABELS_JS}, liste lue : ${r.id} étiqueté « ${got} », « ${want} » attendu`);
  }
  return problems;
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
  else ok('libellés : les quatre libellés, la mention D2 et la mention courte sont conformes, mot pour mot, aux libellés de référence (principe de Pierre du 10/10/2026, formulation tranchée par Opus 5.5 le 23/10/2026), aucun ne présente une note comme mesurée (seule exception, exacte : « measured stiffness (TWU) » de la mention D2)');
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
    basisFileProblems(fromFile, fromGenerator, [...thirdPartyStringIds(ROOT)]).forEach(fail);
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
const thirdParty = thirdPartyStringIds(ROOT);
const expectedOf = (r) => (!hasRating(r) ? 'none' : thirdParty.has(r.id) ? 'third_party' : harmonised.has(r.id) ? 'harmonised' : 'editorial');
// D2 : mention attendue sur une fiche recalée qui affiche une note de confort.
const recalibratedIds = recalibratedStringIds(ROOT);
const recalOf = (r) => recalibratedIds.has(r.id) && r.comfort !== null && r.comfort !== undefined && hasRating(r);
{
  const before = failures;
  for (const id of recalibratedIds) {
    const r = rowById.get(id);
    if (!r) fail(`cordage recalé (D2) « ${id} » absent du catalogue`);
    else if (!recalOf(r)) fail(`cordage recalé (D2) « ${id} » sans note de confort publiée`);
  }
  if (recalibratedIds.size === 0) fail(`${COMFORT_RECALIBRATION_TS} : aucune fiche recalée lue (format du fichier modifié ?)`);
  if (failures === before) ok(`D2 : ${recalibratedIds.size} cordages à note de confort recalée, tous au catalogue avec une note de confort ; mention « ${CONTRACT.recalibrated} » attendue sur eux seuls`);
}
const { images } = await loadProductImages(ROOT);
const rendered = new Map(rows.map((r) => [r.id, stringPage(r, images)]));
{
  const before = failures;
  const census = { harmonised: 0, editorial: 0, third_party: 0, none: 0 };
  let notes = 0;
  let onDisk = 0;
  for (const r of rows) {
    const expected = expectedOf(r);
    census[expected]++;
    if (expected !== 'none') notes += NOTE_FIELDS.length;
    const html = rendered.get(r.id);
    ficheProblems(html, { id: r.id, row: r, expected, recal: recalOf(r) }).forEach(fail);
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
      `fiches : ${rows.length} cordages = ${census.harmonised} harmonisés + ${census.third_party} à note reprise + ${census.editorial} de l'équipe + ${census.none} sans note ; libellé avant la première note, ` +
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

// 7 bis. Export catalog.json ------------------------------------------------------
// Nature attendue relue indépendamment du générateur : listes des harmonisés et des notes reprises lues par expression régulière.
const harmonisedByRegex = new Set(fromRegex);
const thirdPartySrc = readFileSync(path.join(ROOT, THIRD_PARTY_TS), 'utf8');
const thirdPartyByRegex = new Set(
  [...thirdPartySrc.slice(thirdPartySrc.indexOf('THIRD_PARTY_RATED_STRING_IDS')).split('];')[0].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]),
);
const exportBasis = (r) =>
  !hasRating(r) ? 'none' : thirdPartyByRegex.has(r.id) ? 'third_party' : harmonisedByRegex.has(r.id) ? 'harmonised' : 'editorial';
const catalogMem = buildCatalog(racquetsDatabase, stringsDatabase);
{
  const before = failures;
  catalogExportProblems(catalogMem, exportBasis, 'catalog.json (rendu)').forEach(fail);
  const file = path.join(ROOT, 'public/data/catalog.json');
  if (existsSync(file)) catalogExportProblems(JSON.parse(readFileSync(file, 'utf8')), exportBasis, 'public/data/catalog.json').forEach(fail);
  else warn('public/data/catalog.json absent (npm run build:catalog) : export vérifié sur le rendu en mémoire seulement');
  if (failures === before) {
    const n = (b) => catalogMem.strings.filter((r) => r.rating_basis === b).length;
    ok(`export catalog.json : ${catalogMem.strings.length} cordages exportés avec leur nature (${n('harmonised')} harmonisés, ${n('third_party')} à note reprise, ${n('editorial')} de l'équipe, ${n('none')} « Not published »), libellés et mention de référence dans meta${existsSync(file) ? ', fichier du disque conforme' : ''}`);
  }
}

// 7 ter. Repli du chargeur EN : liste des natures injoignable, ou d'un ancien format (sans `third_party`) ----------
// Aucune nature attribuée, jamais « équipe » par défaut : ce serait attribuer à TSA une note reprise d'un tiers (règle 3).
const labelsSrc = readFileSync(path.join(ROOT, LABELS_JS), 'utf8');
const basisFetch = (data) => () => Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
const oldFormatFetch = basisFetch({ harmonised: [...fromGenerator], comfort_recalibrated: [...recalibratedIds] });
// D2 : sans « comfort_recalibrated », une note recalée perdrait sa mention : format inattendu, même repli.
const noRecalFetch = basisFetch({ harmonised: [...fromGenerator], third_party: [...thirdParty] });
const fullFetch = basisFetch({ harmonised: [...fromGenerator], third_party: [...thirdParty], comfort_recalibrated: [...recalibratedIds] });
const fallbackUnreachable = await fallbackProblems(labelsSrc, rows);
const fallbackOldFormat = await fallbackProblems(labelsSrc, rows, oldFormatFetch);
const fallbackNoRecal = await fallbackProblems(labelsSrc, rows, noRecalFetch);
[...fallbackUnreachable, ...fallbackOldFormat, ...fallbackNoRecal].forEach(fail);
if (fallbackUnreachable.length + fallbackOldFormat.length + fallbackNoRecal.length === 0) {
  ok(`repli de ${LABELS_JS} (liste injoignable, sans third_party ou sans comfort_recalibrated) : ${rows.filter(hasRating).length} cordages notés étiquetés « ${CONTRACT.unknown} », aucune nature attribuée, ${rows.filter((r) => !hasRating(r)).length} « ${CONTRACT.none} », erreur en console`);
}
// Liste lue : mention D2 sur les fiches recalées et elles seules.
{
  const loaded = await loadedLabelProblems(labelsSrc, rows, fullFetch);
  loaded.forEach(fail);
  if (loaded.length === 0) ok(`chargeur ${LABELS_JS}, liste lue : ${rows.filter(recalOf).length} cordages recalés étiquetés avec la mention D2, aucun autre`);
}
// Altérations du repli, mesurées ici (le chargeur est asynchrone) et rejouées parmi les tests négatifs.
const fallbackToTeam = await fallbackProblems(labelsSrc.replace("if (!state.ok) return hasRating(s) ? 'unknown' : 'none';", ''), rows);
const fallbackOldFormatAccepted = await fallbackProblems(
  labelsSrc.replace(' || !Array.isArray(data.third_party)', '').replace('new Set(data.third_party)', 'new Set(data.third_party || [])'),
  rows,
  oldFormatFetch,
);
const fallbackNoRecalAccepted = await fallbackProblems(
  labelsSrc.replace(' || !Array.isArray(data.comfort_recalibrated)', '').replace('new Set(data.comfort_recalibrated)', 'new Set(data.comfort_recalibrated || [])'),
  rows,
  noRecalFetch,
);
const loadedWithoutD2 = await loadedLabelProblems(labelsSrc.replace('state.ok ? state.recalibrated : null', 'null'), rows, fullFetch);

// 8. Tests négatifs -----------------------------------------------------------
{
  const before = failures;
  const pick = (kind) => rows.find((r) => expectedOf(r) === kind);
  const H = pick('harmonised');
  const E = pick('editorial');
  const N = pick('none');
  const T = pick('third_party');
  if (!H || !E || !N || !T) {
    fail('tests négatifs : il faut au moins un cordage harmonisé, un éditorial et un sans note au catalogue pour éprouver les garde-fous');
    process.stdout.write(`\nNON CONFORME — ${failures} échec(s), ${warnings} avertissement(s)\n`);
    process.exit(1);
  }
  const ctx = (r) => ({ id: r.id, row: r, expected: expectedOf(r), recal: recalOf(r) });
  const R = rows.find((r) => recalOf(r));
  const rHtml = R ? rendered.get(R.id) : null;
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
  const LABEL_P = /<p\b[^>]*\bdata-rating-basis="[a-z_]+"[^>]*>[\s\S]*?<\/p>/;
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
    ['mention D2 retirée d\'une fiche recalée', () => ficheProblems(inSection(rHtml, (s) => swap(s, `; ${CONTRACT.recalibrated}`, '')), ctx(R))],
    ['mention D2 sur une fiche non recalée', () => ficheProblems(inSection(eHtml, (s) => swap(s, `>${CONTRACT.editorial}<`, `>${CONTRACT.editorial}; ${CONTRACT.recalibrated}<`)), ctx(E))],
    ['mention D2 reformulée', () => ficheProblems(inSection(rHtml, (s) => swap(s, CONTRACT.recalibrated, 'comfort rating measured (TWU)')), ctx(R))],
    ['liste des recalées absente du fichier', () => basisFileProblems({ harmonised: fromGenerator }, fromGenerator)],
    ['mention D2 du contrat modifiée', () => labelsContractProblems({ ...RATING_LABELS, RECALIBRATED: 'comfort rating measured by TWU' })],
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
      () => frMentionProblems([{ path: 'src/x.tsx', src: '<p>Notes /10 non mesurées : la nature de chaque note est indiquée à côté. L’indice RCS et l’alerte bras n’utilisent que la rigidité (lb/in).</p>' }]).problems,
    ],
    ['export : nature retirée d’un cordage', () => catalogExportProblems({ ...catalogMem, strings: catalogMem.strings.map(({ rating_basis, ...r }) => (r.id === H.id ? r : { ...r, rating_basis })) }, exportBasis, 'export')],
    ['export : cordage harmonisé exporté « editorial »', () => catalogExportProblems({ ...catalogMem, strings: catalogMem.strings.map((r) => (r.id === H.id ? { ...r, rating_basis: 'editorial' } : r)) }, exportBasis, 'export')],
    ['export : cordage sans note exporté « editorial »', () => catalogExportProblems({ ...catalogMem, strings: catalogMem.strings.map((r) => (r.id === N.id ? { ...r, rating_basis: 'editorial' } : r)) }, exportBasis, 'export')],
    ['export sans la mention', () => catalogExportProblems({ ...catalogMem, meta: { ...catalogMem.meta, ratings_notice: undefined } }, exportBasis, 'export')],
    ['export : Triax (note reprise) exporté « editorial »', () => catalogExportProblems({ ...catalogMem, strings: catalogMem.strings.map((r) => (r.id === 'tecnifibre-triax' ? { ...r, rating_basis: 'editorial' } : r)) }, exportBasis, 'export')],
    ['fiche : note reprise étiquetée « editorial »', () => ficheProblems(inSection(rendered.get(T.id), (s) => swap(s, 'data-rating-basis="third_party"', 'data-rating-basis="editorial"')), ctx(T))],
    ['liste des notes reprises absente du fichier de nature', () => basisFileProblems({ harmonised: fromGenerator }, fromGenerator, [...thirdParty])],
    ['libellé affirmant une note mesurée', () => labelsContractProblems({ ...RATING_LABELS, LABEL: { ...RATING_LABELS.LABEL, editorial: 'TSA team rating, laboratory measured' } })],
    ['liste injoignable : repli sur « équipe »', () => fallbackToTeam.filter((m) => m.includes(T.id) && m.includes(CONTRACT.editorial))],
    ['liste sans third_party acceptée : note reprise étiquetée « équipe »', () => fallbackOldFormatAccepted.filter((m) => m.includes(T.id) && m.includes(CONTRACT.editorial))],
    ['liste sans comfort_recalibrated acceptée : nature attribuée à une fiche recalée', () => fallbackNoRecalAccepted.filter((m) => m.includes(R.id))],
    ['chargeur lu : mention D2 absente des pages dynamiques', () => loadedWithoutD2.filter((m) => m.includes(R.id))],
    ['mention D2 : note de confort dite mesurée', () => (recalibratedAffirmsMeasure('comfort rating measured (TWU)') ? ['measured'] : [])],
    ['mention D2 : « measured stiffness » sans « (TWU) »', () => (recalibratedAffirmsMeasure('comfort rating recalibrated on measured stiffness') ? ['measured'] : [])],
    [
      'mention FR tronquée dans src/',
      () => frMentionProblems([{ path: 'src/x.tsx', src: "const NOTE = 'Notes /10 non mesurées : la nature de chaque note est indiquée à côté.';" }]).problems,
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
    ["JSX avec &apos; et {' '}", `<p>\n  ${CONTRACT.noteFr.replace(/'/g, '&apos;').replace(' (lb/in) ;', " (lb/in){' '}\n  ;")}\n</p>`],
    ['apostrophe typographique', `<p>${CONTRACT.noteFr.replace(/'/g, '’')}</p>`],
    ['chaînes mises bout à bout', `const NOTE = '${CONTRACT.noteFr.replace(/'/g, '’').replace('à côté. ', "à côté. ' + '")}';`],
    ['apostrophe échappée', `const NOTE = '${CONTRACT.noteFr.replace(/'/g, "\\'")}';`],
  ];
  for (const [name, src] of controls) {
    const r = frMentionProblems([{ path: 'src/x.tsx', src }]);
    if (r.problems.length > 0 || r.found !== 1) fail(`témoin positif « ${name} » : la mention FR correcte est refusée ou introuvable (${r.problems[0] ?? `${r.found} occurrence(s)`})`);
  }
  if (failures === before) {
    ok(
      `tests négatifs : ${negatives.length} altérations détectées (libellé, nature, ordre, note, meta, JSON-LD, page dynamique, liste, meta FR, contrat, ancienne mention, mention FR, export, notes reprises, « mesurée », repli, D2) ; ` +
        `${controls.length} témoins positifs acceptés (mention FR bien écrite)`,
    );
  }
}

process.stdout.write(`\n${failures === 0 ? 'Conforme' : 'NON CONFORME'} — ${failures} échec(s), ${warnings} avertissement(s)\n`);
process.exit(failures === 0 ? 0 : 1);
