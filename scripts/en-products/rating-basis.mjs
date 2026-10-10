/**
 * Nature des notes /10 des cordages, côté générateur des fiches EN
 * (tsa-acquisition, 10/10/2026 — décision de Pierre : « garder les notes et les
 * étiqueter partout »).
 *
 * Deux choses :
 *  1. les libellés, lus TELS QUELS dans public/js/rating-labels.js (source unique,
 *     aussi chargée par les pages dynamiques) ;
 *  2. la liste des cordages « harmonisés avec des avis de testeurs », lue dans
 *     src/data/tester-ratings.ts à chaque génération. Le catalogue EN
 *     (public/data/catalog.json, scripts/catalog/ de tsa-core) ne porte pas ce
 *     drapeau ; en attendant qu'il le porte (question posée à tsa-core), cette
 *     liste est le repère exact et contrôlé : elle n'est jamais saisie à la main,
 *     et le build échoue si elle ne colle pas au catalogue.
 *
 * La lecture du TypeScript suit la technique de scripts/catalog/catalog-json.mjs
 * (transpilation par le compilateur `typescript` déjà présent). Elle est
 * synchrone et isolée (module `vm`, aucun accès à `require` ni au système) pour
 * que `stringPage(s)` reste appelable sans contexte (audit:ratings l'appelle
 * ainsi) et donne toujours le même libellé.
 *
 * La provenance détaillée (chaînes de testeurs, pondérations, décalages
 * d'ancrage, revues Tennis Warehouse) n'est JAMAIS lue ici : seuls les
 * identifiants du tableau STRING_TESTER_RATINGS le sont (charte F5, F6).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const nodeRequire = createRequire(import.meta.url);

/** { LABEL, NOTE, NOTE_STIFFNESS, hasRating, basisOf, … } — public/js/rating-labels.js, non modifié ici. */
export const RATING_LABELS = nodeRequire('../../public/js/rating-labels.js');

export const BASIS_JSON_PATH = 'public/data/string-rating-basis.json';
export const TESTER_RATINGS_TS = 'src/data/tester-ratings.ts';

const cache = new Map();

/** Identifiants des cordages harmonisés (Set), lus dans le TypeScript ; échec bruyant sinon. */
export function harmonisedStringIds(repoRoot = defaultRoot) {
  if (cache.has(repoRoot)) return cache.get(repoRoot);
  const requireFromRepo = createRequire(path.join(repoRoot, 'package.json'));
  const ts = requireFromRepo('typescript');
  const src = readFileSync(path.join(repoRoot, TESTER_RATINGS_TS), 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: TESTER_RATINGS_TS,
  }).outputText;
  if (/^\s*import\s|\brequire\(/m.test(js)) {
    throw new Error(`${TESTER_RATINGS_TS} importe un autre module : lecteur des cordages harmonisés à adapter`);
  }
  const sandbox = { exports: {} };
  vm.runInNewContext(js, sandbox, { filename: TESTER_RATINGS_TS, timeout: 5000 });
  const table = sandbox.exports.STRING_TESTER_RATINGS;
  if (!table || typeof table !== 'object') throw new Error(`${TESTER_RATINGS_TS} : STRING_TESTER_RATINGS introuvable après transpilation`);
  const ids = Object.keys(table);
  if (ids.length === 0) throw new Error(`${TESTER_RATINGS_TS} : STRING_TESTER_RATINGS est vide`);
  const set = new Set(ids);
  cache.set(repoRoot, set);
  return set;
}

/** 'none' | 'editorial' | 'harmonised' pour une ligne du catalogue (snake_case) ou une entrée TS. */
export function ratingBasisOf(s, repoRoot = defaultRoot) {
  return RATING_LABELS.basisOf(s, harmonisedStringIds(repoRoot));
}

/**
 * Contenu de public/data/string-rating-basis.json, lu par les pages dynamiques
 * (public/js/rating-labels.js). Déterministe : pas d'horodatage, ids triés.
 * Échoue si un cordage harmonisé est absent du catalogue ou n'a aucune note :
 * ce serait une dérive entre les deux sources.
 */
export function buildBasisFile(strings, repoRoot = defaultRoot) {
  const ids = [...harmonisedStringIds(repoRoot)].sort();
  const byId = new Map(strings.map((s) => [s.id, s]));
  for (const id of ids) {
    const s = byId.get(id);
    if (!s) throw new Error(`cordage harmonisé absent du catalogue : ${id} (src/data/tester-ratings.ts)`);
    if (!RATING_LABELS.hasRating(s)) throw new Error(`cordage harmonisé sans aucune note publiée : ${id}`);
  }
  const payload = {
    meta: {
      schema_version: 1,
      generated_from: TESTER_RATINGS_TS,
      generator: 'scripts/en-products/build-en-product-pages.mjs',
      notice: 'Generated at build time. Do not edit by hand. Lists the strings whose ratings were harmonised with tester reviews.',
      count: ids.length,
    },
    harmonised: ids,
  };
  return `${JSON.stringify(payload)}\n`;
}
