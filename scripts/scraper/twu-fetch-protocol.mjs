#!/usr/bin/env node
/**
 * Relevé TWU complet pour le prototype du protocole de notes base 100.
 *
 * Complète `twu-fetch-strings.mjs` (rigidité, perte de tension, spin) par les
 * autres grandeurs que la page `reporter2.php` propose réellement dans son
 * formulaire (colonnes lues sur la page le 29/09/2026, pas devinées) :
 *   - Energy Return (percent)            -> xenergy
 *   - Impact Duration (ms) = dwell time  -> xduration
 *   - Impact Deflection (mm à l'affichage) -> xdeflection
 *   - Peak Transverse Force (lbs)        -> xpeak_force
 *   - String-to-String Friction (COF)    -> xstringCOF
 *   - String-to-Ball Friction (COF)      -> xballCOF
 *   - Gauge actual                        -> xgauge_actual
 *
 * Une requête par condition. Par défaut : la condition de référence de la
 * base (51 lbs, Fast). Avec `--all-conditions`, les 9 couples tension x
 * vitesse (40/51/62 lbs x Slow/Medium/Fast), pour mesurer la sensibilité des
 * classements à la condition — 9 requêtes au total, espacées de 3 s.
 *
 * Écrit UNIQUEMENT dans scripts/scraper/out/ (non versionné).
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT_DIR = fileURLToPath(new URL('./out/', import.meta.url));
const URL_DB = 'https://twu.tennis-warehouse.com/learning_center/reporter2.php';

const DISPLAY = [
  'xbrand', 'xstring', 'xref_tension', 'xhammer', 'xmaterial',
  'xgauge_nominal', 'xgauge_actual', 'xduration', 'xdeflection', 'xpeak_force',
  'xstiffness', 'xloss_percent', 'xenergy', 'xstringCOF', 'xballCOF', 'xspinratio',
];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const stripTags = (s) => s.replace(/<[^>]+>/g, '');
const unescapeHtml = (s) =>
  s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#x?[0-9A-Fa-f]+;/g, '');
const numOrNull = (s) => {
  const m = String(s ?? '').match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Lit les valeurs d'option réelles des <select> de tension et de vitesse. */
async function readFormOptions() {
  const res = await fetch(URL_DB, { headers: HEADERS });
  if (!res.ok) throw new Error(`TWU inaccessible (HTTP ${res.status})`);
  const html = await res.text();
  const opts = (id) => {
    const m = html.match(new RegExp(`<select[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)</select>`));
    if (!m) throw new Error(`select ${id} introuvable`);
    return [...m[1].matchAll(/<option[^>]*value=["']?([^"'>\s]*)["']?[^>]*>([^<]*)/g)].map((o) => ({
      value: o[1],
      label: o[2].trim(),
    }));
  };
  return { tension: opts('zref_tension'), speed: opts('zhammer') };
}

async function fetchCondition(tensionValue, speedValue) {
  const form = new URLSearchParams([
    ['zbrand', 'all'],
    ['zstring[]', 'all'],
    ['zref_tension', tensionValue],
    ['zhammer', speedValue],
    ['zmaterial', 'all'],
    ...DISPLAY.map((v) => ['display[]', v]),
    ['sort1', 'brand'], ['sort2', 'model'], ['sort3', 'gauge_nominal'], ['sort4', ''], ['sort5', ''],
  ]);
  const res = await fetch(URL_DB, {
    method: 'POST',
    headers: { ...HEADERS, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  if (!res.ok) throw new Error(`TWU inaccessible (HTTP ${res.status})`);
  const html = await res.text();
  const rows = [...html.matchAll(/<tr>(.*?)<\/tr>/gs)].map((m) =>
    [...m[1].matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gs)].map((c) =>
      unescapeHtml(stripTags(c[1])).replace(/\s+/g, ' ').trim(),
    ),
  );
  const header = rows.find((c) => c[0] === 'Item' && c.includes('String'));
  if (!header) throw new Error('En-tête TWU introuvable');
  const col = (label) => {
    const i = header.findIndex((h) => h.startsWith(label));
    if (i < 0) throw new Error(`Colonne TWU absente : ${label} (en-têtes : ${header.join(' | ')})`);
    return i;
  };
  const C = {
    name: col('String'), ref: col('Ref. Ten.'), speed: col('Swing Speed'),
    material: col('Material'), gaugeNom: col('Gauge Nominal'), gaugeAct: col('Gauge Acutal'), // sic, coquille TWU
    dwell: col('Dwell Time'), deflection: col('Deflection'), peakForce: col('Peak Perp. Force'),
    stiffness: col('Stiffness'), loss: col('Tension Loss'), energy: col('Energy Return'),
    ssCof: col('String/String COF'), sbCof: col('String/Ball COF'), spin: col('Spin Potential'),
  };
  const out = [];
  for (const cells of rows) {
    if (cells.length !== header.length || !/^\d+$/.test(cells[0])) continue;
    const g = numOrNull(cells[C.gaugeNom]);
    out.push({
      name: cells[C.name],
      refTensionLbs: numOrNull(cells[C.ref]),
      swingSpeed: cells[C.speed] || null,
      material: cells[C.material] || null,
      gaugeNominalMm: g ? g : null, // TWU publie « 0 » quand la jauge n'est pas renseignée
      gaugeActualMm: numOrNull(cells[C.gaugeAct]) || null,
      dwellTimeMs: numOrNull(cells[C.dwell]),
      deflectionMm: numOrNull(cells[C.deflection]),
      peakForceLbs: numOrNull(cells[C.peakForce]),
      stiffnessLbIn: numOrNull(cells[C.stiffness]),
      tensionLossPct: numOrNull(cells[C.loss]),
      energyReturnPct: numOrNull(cells[C.energy]),
      stringToStringCof: numOrNull(cells[C.ssCof]),
      stringToBallCof: numOrNull(cells[C.sbCof]),
      spinPotential: numOrNull(cells[C.spin]),
    });
  }
  return { header, records: out };
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const all = process.argv.includes('--all-conditions');
  const form = await readFormOptions();
  const tensions = form.tension.filter((o) => /\d+\s*lbs/.test(o.label));
  const speeds = form.speed.filter((o) => /^(Fast|Medium|Slow)$/.test(o.label));
  const conds = [];
  for (const t of tensions) for (const s of speeds) {
    const isRef = /51/.test(t.label) && s.label === 'Fast';
    if (all || isRef) conds.push({ t, s, isRef });
  }
  const fetchedAt = new Date().toISOString();
  const result = { source: URL_DB, method: 'POST', fetchedAt, formOptions: form, conditions: [] };
  for (const [i, c] of conds.entries()) {
    if (i > 0) await sleep(3000);
    const { header, records } = await fetchCondition(c.t.value, c.s.value);
    console.log(`${c.t.label} / ${c.s.label} : ${records.length} lignes`);
    result.conditions.push({ tension: c.t.label, speed: c.s.label, isReference: c.isRef, header, records });
  }
  const file = all ? 'twu-protocol-all-conditions.json' : 'twu-protocol-ref.json';
  writeFileSync(`${OUT_DIR}${file}`, JSON.stringify(result, null, 1));
  const ref = result.conditions.find((c) => c.isReference);
  if (ref) {
    const filled = (k) => ref.records.filter((r) => r[k] !== null && r[k] !== 0).length;
    console.log(`\nCondition de référence : ${ref.records.length} lignes`);
    for (const k of ['stiffnessLbIn', 'tensionLossPct', 'spinPotential', 'energyReturnPct', 'dwellTimeMs',
      'stringToStringCof', 'stringToBallCof', 'gaugeNominalMm', 'gaugeActualMm'])
      console.log(`  ${k.padEnd(20)} renseigné ${filled(k)}`);
  }
  console.log(`-> out/${file}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
