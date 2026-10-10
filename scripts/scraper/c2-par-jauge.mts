/**
 * Rigidité PAR JAUGE (chantier D1, 10/10/2026) : génère les lignes `stiffnessByGauge` / `stiffnessByGaugeSuspect` de
 * src/data/strings-database.ts depuis le relevé TWU COMPLET versionné (data/reference/twu-releve-complet.json, D0).
 * HORS LIGNE : aucune requête réseau, aucune valeur saisie à la main.
 *
 *   npx tsx scripts/scraper/c2-par-jauge.mts           vérifie que strings-database.ts porte EXACTEMENT les lignes générées (code 1 sinon)
 *   npx tsx scripts/scraper/c2-par-jauge.mts --write   réécrit ces lignes (juste après `stiffness:` de chaque fiche)
 *   npx tsx scripts/scraper/c2-par-jauge.mts --liste   couverture, séries suspectes, quarantaines, règle C (pour les PR et les arbitrages)
 *   npx tsx scripts/scraper/c2-par-jauge.mts --apercu-d4   ESTIMATION de l'effet de D4 sur l'alerte bras (rien n'est écrit ni adopté)
 *
 * APPARIEMENT STRICT, comme #110 (résultat identique à l'appariement de #110 sur les 179 fiches, mesuré le 10/10/2026) : une ligne apparie une jauge si
 * son modèle est EXACTEMENT celui de la fiche (marque comprise ; casse, accents et tirets sans effet), si son intitulé porte un suffixe
 * de calibre ou de jauge reconnu, si sa jauge nominale TWU (arrondie au centième) est cette jauge, et si sa matière est celle du type
 * de la fiche. Mis en quarantaine, jamais écrits : deux lignes pour la même jauge (ambiguë), matière différente. Aucune tolérance de
 * jauge, aucune interpolation : une jauge sans ligne n'a pas de valeur (champ absent).
 *
 * SÉRIE SUSPECTE : une jauge plus épaisse mesurée plus souple (toute inversion, tolérance 0), sur TOUTES les lignes du modèle de même
 * matière, jauges hors fiche comprises (NXT 1.35 plus souple que 1.30). Les valeurs restent dans la table, marquées ; stringStiffnessAt
 * n'en tire aucune valeur de calcul avant l'arbitrage de Pierre (D4).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { stringsDatabase, stringStiffnessAt, type TennisString } from '../../src/data/strings-database';
import { racquetsDatabase } from '../../src/data/racquets-database';
import { calculateAdvancedRcs, stringTypeToFamily } from '../../src/lib/advanced-rcs';
import { effectiveRacquetRA } from '../../src/lib/racquet-scoring';
import { STIFFNESS_SOURCE } from '../../src/data/string-stiffness-provenance';

const TS_FILE = 'src/data/strings-database.ts';
interface Rec { name: string; model: string; suffix: string | null; material: string | null; gaugeNominalMm: number | null; stiffnessLbIn: number }
const records = (JSON.parse(readFileSync(STIFFNESS_SOURCE.fullSurvey.file, 'utf8')) as { records: Rec[] }).records;
const fold = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
// TWU range multifilaments et synthétiques sous « Nylon… » : la matière se vérifie par famille (même table que le contrôle 13 ter).
const FAMILY: Partial<Record<TennisString['type'], RegExp>> = { Polyester: /^Polyester$/, 'Natural Gut': /^Gut$/, Multifilament: /^(Nylon|Polyolefin)/, Synthetic: /^(Nylon|Polyolefin)/ };

interface Analysis { table: Record<string, number>; suspect: boolean; inversions: string[]; quarantine: string[]; series: string }
function analyse(s: TennisString): Analysis {
  const lines = records.filter((r) => r.suffix !== null && r.gaugeNominalMm !== null && fold(r.model) === fold(`${s.brand} ${s.model}`));
  const sameMaterial = (r: Rec) => FAMILY[s.type]?.test(r.material ?? '') === true;
  const table: Record<string, number> = {};
  const quarantine: string[] = [];
  for (const g of s.gauges) {
    const l = lines.filter((r) => r.gaugeNominalMm!.toFixed(2) === g);
    if (l.length > 1) quarantine.push(`${g} : ${l.length} lignes pour la même jauge (${l.map((r) => `${r.name} = ${r.stiffnessLbIn}`).join(' ; ')})`);
    else if (l.length === 1 && !sameMaterial(l[0])) quarantine.push(`${g} : matière TWU « ${l[0].material} » ≠ ${s.type} (${l[0].name} = ${l[0].stiffnessLbIn})`);
    else if (l.length === 1) table[g] = l[0].stiffnessLbIn;
  }
  const byGauge = new Map<number, number[]>();
  for (const r of lines.filter(sameMaterial)) byGauge.set(r.gaugeNominalMm!, [...(byGauge.get(r.gaugeNominalMm!) ?? []), r.stiffnessLbIn]);
  const gs = [...byGauge.keys()].sort((a, b) => a - b);
  const mark = (g: number) => `${g.toFixed(2)}${s.gauges.includes(g.toFixed(2)) ? '' : '*'}`;
  // Inversion = la valeur la plus haute d'une jauge dépasse la plus basse de la jauge épaisse suivante (suffit pour toutes les paires).
  const inversions = gs.slice(1).flatMap((g, i) => {
    const hi = Math.max(...byGauge.get(gs[i])!), lo = Math.min(...byGauge.get(g)!);
    return hi > lo ? [`${mark(gs[i])} ${hi} > ${mark(g)} ${lo} (−${(hi - lo).toFixed(1)})`] : [];
  });
  return { table, suspect: Object.keys(table).length > 0 && inversions.length > 0, inversions, quarantine, series: gs.map((g) => `${mark(g)}=${byGauge.get(g)!.join('/')}`).join(' ') };
}

const plan = new Map(stringsDatabase.map((s) => [s.id, analyse(s)]));
const generated = (id: string): string => {
  const a = plan.get(id)!;
  const entries = Object.entries(a.table).sort((x, y) => Number(x[0]) - Number(y[0])).map(([g, v]) => `'${g}': ${v}`).join(', ');
  return entries === '' ? '' : `    stiffnessByGauge: { ${entries} },\n${a.suspect ? '    stiffnessByGaugeSuspect: true,\n' : ''}`;
};
/** Source de strings-database.ts avec exactement les lignes générées (retire les anciennes, insère après `stiffness:` de chaque fiche). */
function patch(src: string): string {
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  return src.replace(/\r\n/g, '\n').replace(/^ {4}stiffnessByGauge(?:Suspect)?: .*\n/gm, '')
    .replace(/(\n {4}id: '([^']+)',[\s\S]*?\n {4}stiffness: [\d.]+,\n)/g, (_m, head: string, id: string) => head + generated(id))
    .replace(/\n/g, eol);
}

function liste(): void {
  const rows = stringsDatabase.map((s) => [s, plan.get(s.id)!] as const);
  const withTable = rows.filter(([, a]) => Object.keys(a.table).length > 0);
  const flat = stringsDatabase.filter((s) => s.type !== 'Hybrid');
  const measured = flat.reduce((n, s) => n + Object.keys(plan.get(s.id)!.table).length, 0);
  console.log(`Fiches avec table : ${withTable.length}/${stringsDatabase.length} ; jauges mesurées : ${measured}/${flat.reduce((n, s) => n + s.gauges.length, 0)} (hors hybrides)`);
  const sus = withTable.filter(([, a]) => a.suspect);
  console.log(`\nSéries suspectes (${sus.length}) ; jauge* = hors des jauges de la fiche ; valeurs jauge=lb/in :`);
  for (const [s, a] of sus) console.log(`  ${s.id.padEnd(30)} ${a.series}\n${' '.repeat(34)}inversions : ${a.inversions.join(' ; ')}`);
  console.log('\nQuarantaines (aucune valeur écrite) :');
  for (const [s, a] of rows) for (const q of a.quarantine) console.log(`  ${s.id} : ${q}`);
  const c = { egale: 0, ficheSupérieure: 0, ficheInférieure: 0 };
  for (const [s, a] of withTable) {
    const top = Math.max(...Object.values(a.table));
    c[top === s.stiffness ? 'egale' : top < s.stiffness ? 'ficheSupérieure' : 'ficheInférieure']++;
  }
  console.log(`\nRègle C (maximum de la table) contre la rigidité de la fiche : égale ${c.egale} ; fiche supérieure (une baisse, GO de Pierre) ${c.ficheSupérieure} ; fiche inférieure (une hausse) ${c.ficheInférieure}`);
}

/**
 * Aperçu de D4 : taux d'alerte bras (grille du contrôle 5) sur les couples (fiche, jauge), une pondération égale par jauge, selon la
 * rigidité utilisée. ESTIMATION : aucune surface ne lit la table et rien n'est adopté ; chaque baisse réelle exigera le GO de Pierre.
 */
function apercu(): void {
  const policies: Array<[string, (s: TennisString, g: string) => number]> = [
    ['actuel : rigidité de la fiche pour toutes les jauges', (s) => s.stiffness],
    ['séries saines adoptées (stringStiffnessAt : hausses et baisses)', (s, g) => stringStiffnessAt(s, g).lbIn],
    ['séries saines, hausses seules', (s, g) => Math.max(s.stiffness, stringStiffnessAt(s, g).lbIn)],
    ['séries saines, baisses seules', (s, g) => Math.min(s.stiffness, stringStiffnessAt(s, g).lbIn)],
    ['toutes les mesures, séries suspectes comprises', (s, g) => s.stiffnessByGauge?.[g] ?? s.stiffness],
  ];
  const isArm = (w: string) => /bras|elbow/i.test(w);
  for (const [label, rigidity] of policies) {
    let n = 0, standard = 0, sensitive = 0;
    for (const s of stringsDatabase) for (const g of s.gauges) for (const r of racquetsDatabase) for (const t of [18, 20, 22, 24, 26, 28]) {
      const input = {
        racquetStiffness: effectiveRacquetRA(r), racquetWeight: r.weight, racquetHeadSize: r.headSize, mainStringStiffness: rigidity(s, g), mainStringFamily: stringTypeToFamily(s.type),
        mainRatings: { control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability }, mainTension: t,
      };
      n++;
      if (calculateAdvancedRcs({ ...input, profile: { armSensitive: false } }).warnings.some(isArm)) standard++;
      if (calculateAdvancedRcs({ ...input, profile: { armSensitive: true } }).warnings.some(isArm)) sensitive++;
    }
    console.log(`${label.padEnd(66)} standard ${((standard / n) * 100).toFixed(2)} %   sensible ${((sensitive / n) * 100).toFixed(2)} %   (${n} combinaisons)`);
  }
}

const src = readFileSync(TS_FILE, 'utf8');
if (process.argv.includes('--liste')) liste();
else if (process.argv.includes('--apercu-d4')) apercu();
else if (process.argv.includes('--write')) {
  writeFileSync(TS_FILE, patch(src));
  console.log(`${TS_FILE} réécrit : ${[...plan.values()].filter((a) => Object.keys(a.table).length > 0).length} tables, ${[...plan.values()].filter((a) => a.suspect).length} séries suspectes`);
} else if (patch(src) !== src) {
  const stale = stringsDatabase.filter((s) => JSON.stringify(s.stiffnessByGauge ?? null) !== JSON.stringify(Object.keys(plan.get(s.id)!.table).length ? plan.get(s.id)!.table : null) || Boolean(s.stiffnessByGaugeSuspect) !== plan.get(s.id)!.suspect);
  console.error(`${TS_FILE} n'est pas à jour avec le relevé versionné${stale.length ? ` (${stale.length} fiche(s) : ${stale.slice(0, 8).map((s) => s.id).join(', ')}…)` : ' (mise en forme)'} : relancer avec --write`);
  process.exit(1);
} else console.log(`ok : ${TS_FILE} porte exactement les lignes générées depuis ${STIFFNESS_SOURCE.fullSurvey.file}`);
