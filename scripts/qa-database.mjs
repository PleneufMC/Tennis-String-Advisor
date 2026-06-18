#!/usr/bin/env node
/**
 * QA Database Audit Script
 * Audite racquets-database.ts et strings-database.ts sans dépendances externes.
 * Stratégie : transpile les fichiers TS via le tsc du projet vers un dossier temp,
 * puis importe les tableaux exportés et applique les règles de validation.
 *
 * Usage: node scripts/qa-database.mjs
 */

import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(process.cwd());
const SRC = join(ROOT, 'src', 'data');

// ---------- Transpilation TS -> JS (ESM) ----------
const tmp = mkdtempSync(join(tmpdir(), 'tsa-qa-'));
function transpile(file) {
  const out = join(tmp, file.replace(/\.ts$/, '.mjs'));
  execSync(
    `npx tsc "${join(SRC, file)}" --outDir "${tmp}" --module esnext --target es2020 --moduleResolution node --skipLibCheck`,
    { stdio: 'pipe' }
  );
  // tsc produit .js ; renomme en .mjs pour import ESM
  const js = join(tmp, file.replace(/\.ts$/, '.js'));
  execSync(`mv "${js}" "${out}"`);
  return out;
}

let racquetsDatabase, stringsDatabase;
try {
  const rFile = transpile('racquets-database.ts');
  const sFile = transpile('strings-database.ts');
  ({ racquetsDatabase } = await import(pathToFileURL(rFile).href));
  ({ stringsDatabase } = await import(pathToFileURL(sFile).href));
} catch (e) {
  console.error('Erreur de transpilation/import:', e.message || e);
  process.exit(1);
} finally {
  // nettoyage différé après import OK
}

// ---------- Collecteur d'issues ----------
const issues = [];
function add(severity, category, entity, id, msg) {
  issues.push({ severity, category, entity, id, msg });
}

// ============================================================
// VALIDATION RAQUETTES
// ============================================================
// Bornes physiques réalistes — distinctes pour adultes vs juniors.
// Les raquettes junior ont par nature un poids/longueur/tamis/SW réduits.
const RACQUET_RULES_ADULT = {
  weight: { min: 250, max: 360, label: 'poids (g, non cordé)' },
  headSize: { min: 85, max: 125, label: 'tamis (sq in)' },
  stiffness: { min: 50, max: 75, label: 'RA' },
  length: { min: 26.5, max: 29, label: 'longueur (pouces)' },
  balance: { min: 290, max: 400, label: 'équilibre (mm)' },
  swingWeight: { min: 250, max: 380, label: 'swingweight' },
};
const RACQUET_RULES_JUNIOR = {
  weight: { min: 150, max: 280, label: 'poids junior (g)' },
  headSize: { min: 78, max: 110, label: 'tamis junior (sq in)' },
  stiffness: { min: 50, max: 75, label: 'RA' },
  length: { min: 19, max: 27, label: 'longueur junior (pouces)' },
  balance: { min: 260, max: 400, label: 'équilibre junior (mm)' },
  swingWeight: { min: 180, max: 360, label: 'swingweight junior' },
};
const isJunior = (r) =>
  r.category === 'Junior' ||
  /junior/i.test(r.id || '') ||
  /junior/i.test(r.variant || '');

// Patterns de cordage valides connus
const VALID_PATTERNS = new Set([
  '16x18', '16x19', '16x20', '18x19', '18x20', '16x17', '14x18', '16x15', '18x16',
]);

const seenRacquetIds = new Map();
const optionalMissing = {}; // compteur agrégé des champs optionnels absents
const REQUIRED_RACQUET = ['id', 'brand', 'model', 'variant', 'weight', 'headSize'];

for (const r of racquetsDatabase) {
  const id = r.id || '(no-id)';

  // Doublons d'id
  if (seenRacquetIds.has(id)) {
    add('HIGH', 'duplicate', 'racquet', id, `id dupliqué (déjà vu à l'index ${seenRacquetIds.get(id)})`);
  } else {
    seenRacquetIds.set(id, racquetsDatabase.indexOf(r));
  }

  // Champs requis
  for (const f of REQUIRED_RACQUET) {
    if (r[f] === undefined || r[f] === null || r[f] === '') {
      add('HIGH', 'missing-field', 'racquet', id, `champ requis manquant: ${f}`);
    }
  }

  // stiffness peut être null légitimement (ND), sinon vérifier bornes
  let RULES = isJunior(r) ? RACQUET_RULES_JUNIOR : RACQUET_RULES_ADULT;
  // Les raquettes Power/Light pour débutants sont légitimement très légères (220g+)
  if (!isJunior(r) && (r.category === 'Power' || r.category === 'Light')) {
    RULES = { ...RULES, weight: { min: 220, max: 360, label: 'poids Power/Light (g)' } };
  }
  for (const [field, rule] of Object.entries(RULES)) {
    const v = r[field];
    if (v === undefined || v === null) {
      // champ optionnel absent -> agrégé (voir compteur global) pour réduire le bruit
      if (['balance', 'swingWeight', 'length', 'stiffness'].includes(field)) {
        optionalMissing[field] = (optionalMissing[field] || 0) + 1;
      }
      continue;
    }
    if (typeof v !== 'number' || Number.isNaN(v)) {
      add('HIGH', 'type', 'racquet', id, `${field} n'est pas un nombre valide: ${v}`);
      continue;
    }
    if (v < rule.min || v > rule.max) {
      add('MEDIUM', 'out-of-range', 'racquet', id, `${rule.label}=${v} hors bornes [${rule.min}-${rule.max}]`);
    }
  }

  // stringPattern
  if (!r.stringPattern) {
    add('MEDIUM', 'missing-field', 'racquet', id, 'stringPattern manquant');
  } else {
    if (!/^\d{2}x\d{2}$/.test(r.stringPattern)) {
      add('MEDIUM', 'format', 'racquet', id, `stringPattern format invalide: ${r.stringPattern}`);
    } else if (!VALID_PATTERNS.has(r.stringPattern)) {
      add('MEDIUM', 'suspect-pattern', 'racquet', id, `stringPattern inhabituel: ${r.stringPattern}`);
    }
    // Cohérence pattern <-> headSize : petits tamis (<95) rarement 16x20 large
    const m = r.stringPattern && /^(\d{2})x(\d{2})$/.exec(r.stringPattern);
    if (m && r.headSize) {
      const mains = +m[1], crosses = +m[2];
      // Tamis large (>=105) avec plan très dense (18x20) = incohérent
      if (r.headSize >= 105 && mains >= 18) {
        add('MEDIUM', 'pattern-headsize', 'racquet', id, `tamis ${r.headSize} large avec plan dense ${r.stringPattern} (incohérent)`);
      }
      // mains > crosses (anormal sauf "Spin Effect" Wilson, légitime)
      const SPIN_EFFECT_OK = new Set(['wilson-burn-100ls-v5']);
      if (mains > crosses && !SPIN_EFFECT_OK.has(id)) {
        add('LOW', 'pattern-shape', 'racquet', id, `plan ${r.stringPattern}: montants > travers (inhabituel)`);
      }
    }
  }

  // Prix
  if (r.price) {
    if (typeof r.price.europe !== 'number' || r.price.europe <= 0) {
      add('LOW', 'price', 'racquet', id, `prix europe invalide: ${r.price.europe}`);
    }
  } else {
    add('LOW', 'missing-optional', 'racquet', id, 'price absent');
  }

  // Cohérence catégorie poids
  if (r.category === 'Junior' && r.weight > 270) {
    add('LOW', 'category', 'racquet', id, `catégorie Junior mais poids élevé ${r.weight}g`);
  }
}

// ============================================================
// COHÉRENCE INTRA-GAMME (même brand+model -> specs cohérentes par variante)
// ============================================================
const families = new Map();
for (const r of racquetsDatabase) {
  const key = `${r.brand} ${r.model}`;
  if (!families.has(key)) families.set(key, []);
  families.get(key).push(r);
}
// Signale les familles dont les patterns varient de façon suspecte (info)
const familyReport = [];
for (const [key, members] of families) {
  if (members.length < 2) continue;
  const patterns = [...new Set(members.map(m => m.stringPattern).filter(Boolean))];
  if (patterns.length > 1) {
    familyReport.push({ key, count: members.length, patterns, variants: members.map(m => `${m.variant}:${m.stringPattern}`) });
  }
}

// ============================================================
// VALIDATION CORDAGES
// ============================================================
const STRING_RULES = {
  stiffness: { min: 60, max: 280, label: 'rigidité (lb/in)' },
};
const RATING_FIELDS = ['performance', 'control', 'comfort', 'durability', 'versatility', 'innovation', 'spin', 'power'];
const VALID_TYPES = new Set(['Polyester', 'Multifilament', 'Natural Gut', 'Synthetic', 'Hybrid', 'Biodegradable']);
const REQUIRED_STRING = ['id', 'brand', 'model', 'type', 'gauges', 'stiffness', 'recommendedTension', 'price', 'description'];

const seenStringIds = new Map();
for (const s of stringsDatabase) {
  const id = s.id || '(no-id)';
  if (seenStringIds.has(id)) {
    add('HIGH', 'duplicate', 'string', id, `id dupliqué`);
  } else {
    seenStringIds.set(id, true);
  }

  for (const f of REQUIRED_STRING) {
    if (s[f] === undefined || s[f] === null || s[f] === '' || (Array.isArray(s[f]) && s[f].length === 0)) {
      add('HIGH', 'missing-field', 'string', id, `champ requis manquant/vide: ${f}`);
    }
  }

  if (s.type && !VALID_TYPES.has(s.type)) {
    add('MEDIUM', 'enum', 'string', id, `type invalide: ${s.type}`);
  }

  for (const [field, rule] of Object.entries(STRING_RULES)) {
    const v = s[field];
    if (typeof v === 'number' && (v < rule.min || v > rule.max)) {
      add('MEDIUM', 'out-of-range', 'string', id, `${rule.label}=${v} hors bornes [${rule.min}-${rule.max}]`);
    }
  }

  for (const f of RATING_FIELDS) {
    const v = s[f];
    if (v === undefined || v === null) {
      add('LOW', 'missing-optional', 'string', id, `note absente: ${f}`);
    } else if (typeof v !== 'number' || v < 0 || v > 10) {
      add('MEDIUM', 'out-of-range', 'string', id, `note ${f}=${v} hors [0-10]`);
    }
  }

  if (s.recommendedTension) {
    const { min, max } = s.recommendedTension;
    if (typeof min === 'number' && typeof max === 'number') {
      if (min > max) add('MEDIUM', 'logic', 'string', id, `tension min(${min}) > max(${max})`);
      if (min < 15 || max > 35) add('LOW', 'out-of-range', 'string', id, `tension [${min}-${max}] inhabituelle (attendu ~17-32 kg)`);
    }
  }

  if (s.gauges && Array.isArray(s.gauges)) {
    for (const g of s.gauges) {
      // format simple "1.25" ou hybride "1.25/1.30"
      if (!/^\d\.\d{2}(\/\d\.\d{2})?$/.test(g)) add('LOW', 'format', 'string', id, `jauge format inhabituel: ${g}`);
    }
  }

  if (s.price && (typeof s.price.europe !== 'number' || s.price.europe <= 0)) {
    add('LOW', 'price', 'string', id, `prix europe invalide: ${s.price.europe}`);
  }
}

// ============================================================
// RAPPORT
// ============================================================
const bySev = { HIGH: [], MEDIUM: [], LOW: [] };
for (const i of issues) bySev[i.severity].push(i);

console.log('\n' + '='.repeat(70));
console.log('  QA DATABASE AUDIT — Tennis String Advisor');
console.log('='.repeat(70));
console.log(`  Raquettes auditées : ${racquetsDatabase.length}`);
console.log(`  Cordages audités   : ${stringsDatabase.length}`);
console.log(`  Total problèmes    : ${issues.length}  (HIGH:${bySev.HIGH.length} MEDIUM:${bySev.MEDIUM.length} LOW:${bySev.LOW.length})`);
console.log('='.repeat(70));

for (const sev of ['HIGH', 'MEDIUM', 'LOW']) {
  if (!bySev[sev].length) continue;
  console.log(`\n### ${sev} (${bySev[sev].length})`);
  for (const i of bySev[sev]) {
    console.log(`  [${i.entity}] ${i.id} :: ${i.category} :: ${i.msg}`);
  }
}

console.log('\n' + '='.repeat(70));
console.log('  COHÉRENCE INTRA-GAMME (familles à patterns multiples — INFO)');
console.log('='.repeat(70));
for (const f of familyReport) {
  console.log(`  ${f.key} (${f.count} variantes) -> ${f.variants.join(', ')}`);
}

// Distribution marques (couverture)
console.log('\n' + '='.repeat(70));
console.log('  COUVERTURE PAR MARQUE');
console.log('='.repeat(70));
const brandCount = {};
for (const r of racquetsDatabase) brandCount[r.brand] = (brandCount[r.brand] || 0) + 1;
for (const [b, c] of Object.entries(brandCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${b.padEnd(14)} ${c}`);
}

// Complétude des champs optionnels (agrégé)
console.log('\n' + '='.repeat(70));
console.log('  COMPLÉTUDE — champs optionnels absents (raquettes)');
console.log('='.repeat(70));
for (const [f, c] of Object.entries(optionalMissing).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${f.padEnd(14)} absent sur ${c}/${racquetsDatabase.length} raquettes`);
}

// Export JSON pour le doc
writeFileSync(join(tmp, 'report.json'), JSON.stringify({ issues, familyReport, brandCount, optionalMissing, counts: { racquets: racquetsDatabase.length, strings: stringsDatabase.length } }, null, 2));
console.log(`\nRapport JSON: ${join(tmp, 'report.json')}`);

// nettoyage des .mjs transpilés (garde report.json référencé via stdout)
try { rmSync(join(tmp, 'racquets-database.mjs'), { force: true }); rmSync(join(tmp, 'strings-database.mjs'), { force: true }); } catch {}
