#!/usr/bin/env node
/**
 * Fusion Supabase -> src/data/strings-database.ts
 * =============================================================================
 * POURQUOI CE SCRIPT EXISTE (et pas l'inverse)
 * -----------------------------------------------------------------------------
 * Le site ne lit JAMAIS la base : aucune référence à `public.strings` ni à
 * `from('strings')` dans src/. Les pages importent `stringsDatabase` depuis
 * src/data/strings-database.ts. Un script TS -> base (comme
 * migrations/2026-08-04__resync_ts_to_supabase.sql) nettoie donc la base sans
 * qu'aucun visiteur ne voie la moindre différence.
 * Le sens utile pour le site est : base -> TS. C'est ce que fait ce script.
 *
 * GARANTIES
 * -----------------------------------------------------------------------------
 * - ADDITIF SEUL : aucune entrée existante n'est modifiée ni supprimée. Les 46
 *   conflits de valeurs TS/base restent donc en attente d'arbitrage, sans
 *   bloquer cet import.
 * - IDEMPOTENT : relancer le script ne duplique rien (filtrage sur id ET sur
 *   couple brand+model normalisé).
 * - AUCUNE DONNÉE FABRIQUÉE : `versatility` et `innovation` sont absents du
 *   schéma Supabase ; ils sont optionnels dans l'interface et simplement omis.
 *   Aucune moyenne inventée n'est écrite dans une base qui conseille des achats.
 * - VÉRIFIÉ AVANT ÉCRITURE : unités (tensions en kg des deux côtés, rigidité en
 *   lb/in des deux côtés), doublons, bornes, échappement.
 *
 * Usage :
 *   node scripts/merge-db-to-ts.mjs --dry-run   # rapport seul, n'écrit rien
 *   node scripts/merge-db-to-ts.mjs             # applique la fusion
 *   node scripts/merge-db-to-ts.mjs --from-file /tmp/db_strings.json
 *
 * Après application, lancer impérativement :
 *   node scripts/qa-database.mjs && npx tsc --noEmit && npm run build
 */

import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(process.cwd());
const TS_FILE = join(ROOT, 'src', 'data', 'strings-database.ts');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const fromFileIdx = args.indexOf('--from-file');
const FROM_FILE = fromFileIdx !== -1 ? args[fromFileIdx + 1] : null;

// Identifiants publics (anon) déjà présents dans scripts/create-tables.js.
const SUPABASE_URL = 'https://yhhdkllbaxuhwrfpsmev.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGRrbGxiYXh1aHdyZnBzbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjI0MDEsImV4cCI6MjA4MTMzODQwMX0.2aC_gYZf0xxz6MXi5zcaCH2S64RBaQvXU7a5qiuD0_k';

const log = (...a) => console.log(...a);
const fail = (msg) => {
  console.error(`\n✗ ARRÊT : ${msg}`);
  process.exit(1);
};

// ---------------------------------------------------------------------------
// 1. Lecture de la source de vérité TS (via tsc, jamais par regex)
// ---------------------------------------------------------------------------
async function loadTsDatabase() {
  const tmp = mkdtempSync(join(tmpdir(), 'merge-db-'));
  try {
    execSync(
      `npx tsc "${TS_FILE}" --outDir "${tmp}" --module esnext --target es2020 --moduleResolution node --skipLibCheck`,
      { stdio: 'pipe' }
    );
  } catch (e) {
    fail(`transpilation de strings-database.ts impossible : ${e.message || e}`);
  }
  const js = join(tmp, 'strings-database.js');
  const mjs = join(tmp, 'strings-database.mjs');
  execSync(`mv "${js}" "${mjs}"`);
  const mod = await import(pathToFileURL(mjs).href);
  if (!Array.isArray(mod.stringsDatabase)) fail('export `stringsDatabase` introuvable');
  return mod.stringsDatabase;
}

// ---------------------------------------------------------------------------
// 2. Lecture de la base
// ---------------------------------------------------------------------------
function loadDbRows() {
  if (FROM_FILE) {
    if (!existsSync(FROM_FILE)) fail(`fichier introuvable : ${FROM_FILE}`);
    log(`  source : ${FROM_FILE} (mode hors ligne)`);
    return JSON.parse(readFileSync(FROM_FILE, 'utf8'));
  }
  log('  source : API PostgREST Supabase');
  const url = `${SUPABASE_URL}/rest/v1/strings?select=*&limit=2000`;
  let out;
  try {
    out = execSync(
      `curl -s --fail-with-body -H "apikey: ${SUPABASE_ANON_KEY}" -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" "${url}"`,
      { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }
    );
  } catch (e) {
    fail(`appel Supabase échoué : ${e.stdout || e.message}`);
  }
  let rows;
  try {
    rows = JSON.parse(out);
  } catch {
    fail(`réponse Supabase illisible : ${String(out).slice(0, 300)}`);
  }
  if (!Array.isArray(rows)) fail(`réponse inattendue : ${JSON.stringify(rows).slice(0, 300)}`);
  return rows;
}

// ---------------------------------------------------------------------------
// 3. Garde-fous sur les unités — un écart silencieux corromprait les conseils
// ---------------------------------------------------------------------------
function assertUnits(tsRows, dbRows) {
  const problems = [];

  // 3a. Tensions : le TS documente des kg et string-card.tsx affiche « kg ».
  // Des lbs (≈ 40-70) doivent être refusés catégoriquement.
  const tensions = dbRows.flatMap((r) => [r.tension_min, r.tension_max]).filter((v) => typeof v === 'number');
  const outside = tensions.filter((v) => v < 15 || v > 35);
  if (outside.length) {
    problems.push(
      `tensions hors plage kg (15-35) : ${outside.length} valeur(s), ex. ${outside.slice(0, 5).join(', ')}. ` +
        `Suspicion de valeurs en lbs — conversion requise avant import.`
    );
  }

  // 3b. Rigidité : lb/in des deux côtés (TS ~95-265).
  const stiff = dbRows.map((r) => r.stiffness).filter((v) => typeof v === 'number');
  const badStiff = stiff.filter((v) => v < 60 || v > 280);
  if (badStiff.length) {
    problems.push(`rigidités hors bornes lb/in (60-280) : ${badStiff.slice(0, 5).join(', ')}`);
  }

  // 3c. Recoupement sur les ids communs : un facteur ~2.2 trahirait des lbs.
  const tsById = new Map(tsRows.map((s) => [s.id, s]));
  const ratios = [];
  for (const r of dbRows) {
    const t = tsById.get(r.id);
    if (t?.recommendedTension?.min && r.tension_min) ratios.push(r.tension_min / t.recommendedTension.min);
  }
  if (ratios.length) {
    const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    log(`  ratio moyen des tensions base/TS sur ${ratios.length} ids communs : ${mean.toFixed(3)}`);
    if (mean < 0.75 || mean > 1.35) {
      problems.push(`ratio moyen des tensions = ${mean.toFixed(3)} : incohérence d'unité probable`);
    }
  }

  if (problems.length) fail(`contrôle des unités :\n   - ${problems.join('\n   - ')}`);
  log('  ✓ unités cohérentes : tensions en kg, rigidité en lb/in');
}

// ---------------------------------------------------------------------------
// 4. Normalisation et conversion base -> TennisString
// ---------------------------------------------------------------------------
const normalizeName = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// La base contient « Synthetic Gut », hors enum TS. Le projet a déjà ce
// précédent : `Synthetic Gut Duraflex` y est typé 'Synthetic'. On aligne.
const TYPE_MAP = {
  'Synthetic Gut': 'Synthetic',
};
const VALID_TS_TYPES = new Set(['Polyester', 'Multifilament', 'Natural Gut', 'Synthetic', 'Hybrid', 'Biodegradable']);

/**
 * Les descriptions en base ont la forme :
 *   "Texte principal.\n\nRigidité par jauge: 1.15mm: 225 lb/in, ..."
 * `string-card.tsx` rend `{string.description}` en texte JSX brut : les \n ne
 * produisent AUCUN saut de ligne en HTML, le bloc annexe s'afficherait donc
 * collé à la phrase. On ne conserve que la partie principale, et l'annexe est
 * remontée dans le rapport pour information.
 */
function cleanDescription(raw) {
  const text = String(raw || '').trim();
  const main = text.split(/\n\s*\n/)[0].trim();
  return main.replace(/\s+/g, ' ');
}

function toTennisString(row) {
  const type = TYPE_MAP[row.type] || row.type;
  const entry = {
    id: row.id,
    brand: row.brand,
    model: row.model,
    type,
    gauges: Array.isArray(row.gauges) ? row.gauges.map(String) : [],
    stiffness: row.stiffness,
    performance: row.performance,
    control: row.control,
    comfort: row.comfort,
    durability: row.durability,
    // versatility / innovation : absents du schéma Supabase, volontairement omis.
    spin: row.spin,
    power: row.power,
    recommendedTension: { min: row.tension_min, max: row.tension_max },
    price: { europe: row.price_eur, usa: row.price_usd },
    description: cleanDescription(row.description),
  };
  if (row.pro_usage) entry.proUsage = String(row.pro_usage).trim();
  if (row.color) entry.color = String(row.color).trim();
  return entry;
}

// ---------------------------------------------------------------------------
// 5. Validation d'une entrée convertie
// ---------------------------------------------------------------------------
function validateEntry(e) {
  const errs = [];
  for (const f of ['id', 'brand', 'model', 'type', 'description']) {
    if (!e[f] || typeof e[f] !== 'string') errs.push(`champ texte manquant: ${f}`);
  }
  if (!VALID_TS_TYPES.has(e.type)) errs.push(`type hors enum TS: ${e.type}`);
  if (!e.gauges.length) errs.push('gauges vide');
  for (const f of ['stiffness', 'performance', 'control', 'comfort', 'durability', 'spin', 'power']) {
    if (typeof e[f] !== 'number' || Number.isNaN(e[f])) errs.push(`note non numérique: ${f}`);
    else if (f !== 'stiffness' && (e[f] < 0 || e[f] > 10)) errs.push(`note ${f}=${e[f]} hors [0-10]`);
  }
  if (e.stiffness < 60 || e.stiffness > 280) errs.push(`rigidité ${e.stiffness} hors [60-280]`);
  const { min, max } = e.recommendedTension;
  if (typeof min !== 'number' || typeof max !== 'number') errs.push('tension non numérique');
  else if (min > max) errs.push(`tension min(${min}) > max(${max})`);
  if (typeof e.price.europe !== 'number' || typeof e.price.usa !== 'number') errs.push('prix non numérique');
  return errs;
}

// ---------------------------------------------------------------------------
// 6. Sérialisation TS (échappement strict)
// ---------------------------------------------------------------------------
// 22 descriptions contiennent une apostrophe ; 0 contient backtick ou
// antislash. On échappe malgré tout antislash + apostrophe, et on refuse tout
// caractère de contrôle résiduel.
function q(str) {
  const s = String(str);
  if (/[\u0000-\u001f]/.test(s)) fail(`caractère de contrôle résiduel dans : ${s.slice(0, 80)}`);
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function serializeEntry(e) {
  const L = [];
  L.push('  {');
  L.push(`    id: ${q(e.id)},`);
  L.push(`    brand: ${q(e.brand)},`);
  L.push(`    model: ${q(e.model)},`);
  L.push(`    type: ${q(e.type)},`);
  L.push(`    gauges: [${e.gauges.map(q).join(', ')}],`);
  L.push(`    stiffness: ${e.stiffness},`);
  L.push(`    performance: ${e.performance},`);
  L.push(`    control: ${e.control},`);
  L.push(`    comfort: ${e.comfort},`);
  L.push(`    durability: ${e.durability},`);
  L.push(`    spin: ${e.spin},`);
  L.push(`    power: ${e.power},`);
  L.push(`    recommendedTension: { min: ${e.recommendedTension.min}, max: ${e.recommendedTension.max} },`);
  L.push(`    price: { europe: ${e.price.europe}, usa: ${e.price.usa} },`);
  L.push(`    description: ${q(e.description)},`);
  if (e.proUsage) L.push(`    proUsage: ${q(e.proUsage)},`);
  if (e.color) L.push(`    color: ${q(e.color)},`);
  // Retire la virgule finale de la dernière propriété.
  L[L.length - 1] = L[L.length - 1].replace(/,$/, '');
  L.push('  }');
  return L.join('\n');
}

// ---------------------------------------------------------------------------
// 7. Insertion dans le fichier, avant la fermeture du tableau
// ---------------------------------------------------------------------------
function insertIntoFile(source, entries) {
  const marker = '\n];\n';
  const idx = source.indexOf(marker);
  if (idx === -1) fail('fin du tableau `stringsDatabase` (`\\n];`) introuvable');
  // Contrôle : le marqueur doit bien fermer le tableau de données, pas un autre.
  const before = source.slice(0, idx);
  if (!before.includes('export const stringsDatabase')) {
    fail('le marqueur trouvé ne ferme pas `stringsDatabase`');
  }
  const banner =
    `\n\n  // ==========================================================================\n` +
    `  // Cordages importés depuis Supabase par scripts/merge-db-to-ts.mjs\n` +
    `  // versatility / innovation absents du schéma Supabase : volontairement omis\n` +
    `  // (optionnels dans l'interface, non lus par l'UI) plutôt que fabriqués.\n` +
    `  // ==========================================================================`;
  const block = banner + '\n' + entries.map(serializeEntry).join(',\n');
  return before + ',' + block + marker + source.slice(idx + marker.length);
}

// ---------------------------------------------------------------------------
// Programme principal
// ---------------------------------------------------------------------------
log('═══ Fusion Supabase → strings-database.ts ═══\n');
if (DRY_RUN) log('MODE --dry-run : aucun fichier ne sera modifié.\n');

log('1. Lecture de src/data/strings-database.ts');
const tsRows = await loadTsDatabase();
log(`   ${tsRows.length} cordages présents sur le site`);

log('\n2. Lecture de la base');
const dbRows = loadDbRows();
log(`   ${dbRows.length} lignes en base`);

log('\n3. Contrôle des unités');
assertUnits(tsRows, dbRows);

log('\n4. Détection des absents');
const tsIds = new Set(tsRows.map((s) => s.id));
const tsByName = new Map();
for (const s of tsRows) {
  const k = normalizeName(`${s.brand} ${s.model}`);
  if (!tsByName.has(k)) tsByName.set(k, []);
  tsByName.get(k).push(s.id);
}

const skippedById = [];
const skippedByName = [];
const candidates = [];
const seen = new Set();

for (const row of dbRows) {
  if (!row.id) continue;
  if (tsIds.has(row.id)) {
    skippedById.push(row.id);
    continue;
  }
  const key = normalizeName(`${row.brand} ${row.model}`);
  if (tsByName.has(key)) {
    // Même produit sous un id différent : l'importer créerait un doublon visible.
    skippedByName.push({ dbId: row.id, tsId: tsByName.get(key).join(', '), key });
    continue;
  }
  if (seen.has(key) || seen.has(row.id)) {
    skippedByName.push({ dbId: row.id, tsId: '(doublon interne base)', key });
    continue;
  }
  seen.add(key);
  seen.add(row.id);
  candidates.push(row);
}

log(`   déjà présents (même id)            : ${skippedById.length}`);
log(`   écartés (même produit, autre id)   : ${skippedByName.length}`);
for (const d of skippedByName) log(`      · base «${d.dbId}» = site «${d.tsId}»`);
log(`   nouveaux produits à importer       : ${candidates.length}`);

if (!candidates.length) {
  log('\n✓ Rien à importer : le site est déjà à jour vis-à-vis de la base.');
  process.exit(0);
}

log('\n5. Conversion et validation');
const converted = [];
const rejected = [];
let annexDropped = 0;
let typeRemapped = 0;
for (const row of candidates) {
  const e = toTennisString(row);
  if (String(row.description || '').includes('\n')) annexDropped++;
  if (TYPE_MAP[row.type]) typeRemapped++;
  const errs = validateEntry(e);
  if (errs.length) rejected.push({ id: row.id, errs });
  else converted.push(e);
}
if (annexDropped) {
  log(`   ${annexDropped} description(s) : bloc « Rigidité par jauge » retiré`);
  log(`      (rendu en texte JSX brut, les \\n ne créent pas de saut de ligne)`);
}
if (typeRemapped) log(`   ${typeRemapped} type(s) « Synthetic Gut » → « Synthetic »`);

if (rejected.length) {
  log(`\n   ✗ ${rejected.length} entrée(s) rejetée(s) :`);
  for (const r of rejected) log(`      · ${r.id} : ${r.errs.join(' | ')}`);
  fail('des entrées sont invalides ; aucune écriture effectuée.');
}
log(`   ✓ ${converted.length} entrées valides`);

const byType = {};
for (const e of converted) byType[e.type] = (byType[e.type] || 0) + 1;
log('\n   répartition par type :');
for (const [t, n] of Object.entries(byType).sort((a, b) => b[1] - a[1])) log(`      ${t.padEnd(16)} ${n}`);

if (DRY_RUN) {
  log(`\n✓ --dry-run terminé : ${converted.length} cordages seraient ajoutés (${tsRows.length} → ${tsRows.length + converted.length}).`);
  log('  Relancer sans --dry-run pour appliquer.');
  process.exit(0);
}

log('\n6. Écriture');
const source = readFileSync(TS_FILE, 'utf8');
const backup = `${TS_FILE}.bak`;
copyFileSync(TS_FILE, backup);
log(`   sauvegarde : ${backup}`);
const updated = insertIntoFile(source, converted);
writeFileSync(TS_FILE, updated, 'utf8');
log(`   ✓ ${converted.length} cordages ajoutés (${tsRows.length} → ${tsRows.length + converted.length})`);

log('\n7. Relecture de contrôle');
const reloaded = await loadTsDatabase();
if (reloaded.length !== tsRows.length + converted.length) {
  fail(`relecture incohérente : ${reloaded.length} entrées au lieu de ${tsRows.length + converted.length}. Restaurer ${backup}`);
}
const dupIds = reloaded.map((s) => s.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupIds.length) fail(`ids dupliqués après fusion : ${dupIds.join(', ')}. Restaurer ${backup}`);
log(`   ✓ ${reloaded.length} entrées, aucun id dupliqué`);

log('\n✓ Fusion terminée. Lancer maintenant :');
log('   node scripts/qa-database.mjs && npx tsc --noEmit && npm run build');
