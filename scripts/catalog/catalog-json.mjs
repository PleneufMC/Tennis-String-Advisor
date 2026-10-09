/**
 * Catalogue servi aux pages EN statiques — généré depuis le TypeScript.
 *
 * Chantier C3 (09/10/2026) : `src/data/*.ts` fait foi. Les pages `public/en/`
 * ne lisent plus les tables Supabase `racquets` / `strings` ; elles lisent
 * `public/data/catalog.json`, produit par ce module à chaque build (`prebuild`)
 * et jamais édité à la main (fichier non versionné, cf. .gitignore).
 *
 * Le schéma de sortie reprend les noms de colonnes Supabase (snake_case) que les
 * pages EN consommaient déjà : la bascule ne touche que le chargement.
 *
 * Règles :
 *   - aucune valeur comblée : un champ absent du TS vaut `null` dans le JSON ;
 *   - aucune provenance testeurs : seuls `racquetsDatabase` et `stringsDatabase`
 *     sont sérialisés (les fichiers *tester-ratings* ne sont pas lus) ;
 *   - sortie déterministe (pas d'horodatage) : `audit:ratings` la régénère en
 *     mémoire et la compare octet pour octet au fichier servi.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const CATALOG_JSON_PATH = 'public/data/catalog.json';
export const CATALOG_SCHEMA_VERSION = 1;

const n = (v) => (v === undefined ? null : v);

/** TennisRacquet (TS) -> ligne au schéma des pages EN. */
export function toEnRacquet(r) {
  return {
    id: r.id,
    brand: r.brand,
    model: r.model,
    variant: n(r.variant),
    stiffness: n(r.stiffness),
    weight: n(r.weight),
    head_size: n(r.headSize),
    string_pattern: n(r.stringPattern),
    category: n(r.category),
    player_level: n(r.playerLevel),
    description: n(r.description),
    pro_usage: n(r.proUsage),
    price_eur: n(r.price?.europe),
    price_usd: n(r.price?.usa),
    // Champs TS absents du schéma Supabase (exposés tels quels, null si absents).
    balance: n(r.balance),
    length: n(r.length),
    swing_weight: n(r.swingWeight),
  };
}

/** TennisString (TS) -> ligne au schéma des pages EN. */
export function toEnString(s) {
  return {
    id: s.id,
    brand: s.brand,
    model: s.model,
    type: s.type,
    gauges: n(s.gauges),
    stiffness: s.stiffness,
    performance: n(s.performance),
    control: n(s.control),
    comfort: n(s.comfort),
    durability: n(s.durability),
    spin: n(s.spin),
    power: n(s.power),
    versatility: n(s.versatility),
    innovation: n(s.innovation),
    tension_min: n(s.recommendedTension?.min),
    tension_max: n(s.recommendedTension?.max),
    price_eur: n(s.price?.europe),
    price_usd: n(s.price?.usa),
    description: n(s.description),
    pro_usage: n(s.proUsage),
    color: n(s.color),
  };
}

// Tri équivalent à l'ancien `.order('brand, model')` des requêtes Supabase,
// avec l'id en dernier critère pour une sortie stable.
const byBrandModel = (a, b) =>
  a.brand.localeCompare(b.brand, 'en') || a.model.localeCompare(b.model, 'en') || a.id.localeCompare(b.id, 'en');

export function buildCatalog(racquetsDatabase, stringsDatabase) {
  const racquets = racquetsDatabase.map(toEnRacquet).sort(byBrandModel);
  const strings = stringsDatabase.map(toEnString).sort(byBrandModel);
  return {
    meta: {
      schema_version: CATALOG_SCHEMA_VERSION,
      generated_from: ['src/data/racquets-database.ts', 'src/data/strings-database.ts'],
      generator: 'scripts/catalog/build-catalog-json.mjs',
      notice: 'Generated at build time from the TypeScript catalogue. Do not edit by hand.',
      counts: { racquets: racquets.length, strings: strings.length },
    },
    racquets,
    strings,
  };
}

export const serializeCatalog = (catalog) => `${JSON.stringify(catalog)}\n`;

/**
 * Charge les deux modules de données TS sans dépendance supplémentaire :
 * transpilation par le compilateur `typescript` déjà présent, puis import.
 * Les fichiers de données n'importent rien ; si cela change, on échoue
 * bruyamment plutôt que de servir un catalogue partiel.
 */
export async function loadTsCatalog(repoRoot) {
  const require = createRequire(path.join(repoRoot, 'package.json'));
  const ts = require('typescript');
  const load = async (rel) => {
    const src = readFileSync(path.join(repoRoot, rel), 'utf8');
    const js = ts.transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
      fileName: rel,
    }).outputText;
    if (/^\s*import\s/m.test(js)) throw new Error(`${rel} importe un autre module : générateur à adapter`);
    const dir = path.join(tmpdir(), 'tsa-catalog-json');
    mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${path.basename(rel, '.ts')}-${process.pid}-${Date.now()}.mjs`);
    writeFileSync(file, js);
    try {
      return await import(pathToFileURL(file).href);
    } finally {
      rmSync(file, { force: true });
    }
  };
  const { racquetsDatabase } = await load('src/data/racquets-database.ts');
  const { stringsDatabase } = await load('src/data/strings-database.ts');
  if (!Array.isArray(racquetsDatabase) || !Array.isArray(stringsDatabase)) {
    throw new Error('racquetsDatabase / stringsDatabase introuvables après transpilation');
  }
  return { racquetsDatabase, stringsDatabase };
}
