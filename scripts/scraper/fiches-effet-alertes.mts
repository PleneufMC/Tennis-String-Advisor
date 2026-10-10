/**
 * Effet de l'alignement des fiches désynchronisées (veille du 10/10/2026) sur les alertes bras. Rejouable :
 *   npx tsx scripts/scraper/fiches-effet-alertes.mts
 *
 * Grille du contrôle 5 de `audit:ratings` (raquettes × cordages × 6 tensions) : alerte bras avancée (profils standard
 * et sensible) et verdict de `calculateCompatibility`. AVANT = catalogue dont les champs de `RACQUET_ALIGNMENT`
 * reprennent leur valeur `before` ; APRÈS = catalogue. Puis, POUR INFORMATION et sans rien appliquer, l'effet de chaque
 * RA resté en signal (« held »). Les jauges et coloris des cordages n'entrent pas dans la grille. Aucun accès réseau.
 */
import { racquetsDatabase, calculateCompatibility, type TennisRacquet } from '../../src/data/racquets-database';
import { stringsDatabase } from '../../src/data/strings-database';
import { RACQUET_ALIGNMENT } from '../../src/data/racquet-alignment-provenance';
import { calculateAdvancedRcs, stringTypeToFamily } from '../../src/lib/advanced-rcs';
import { effectiveRacquetRA } from '../../src/lib/racquet-scoring';

const TENSIONS = [18, 20, 22, 24, 26, 28];
type C = { combos: number; standard: number; sensitive: number; compat: number };
const isArm = (w: string) => /bras|elbow/i.test(w);

function measure(r: TennisRacquet): C {
  const c: C = { combos: 0, standard: 0, sensitive: 0, compat: 0 };
  for (const s of stringsDatabase) {
    for (const t of TENSIONS) {
      const input = {
        racquetStiffness: effectiveRacquetRA(r), racquetWeight: r.weight, racquetHeadSize: r.headSize,
        mainStringStiffness: s.stiffness, mainStringFamily: stringTypeToFamily(s.type),
        mainRatings: { control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability },
        mainTension: t,
      };
      c.combos++;
      if (calculateAdvancedRcs({ ...input, profile: { armSensitive: false } }).warnings.some(isArm)) c.standard++;
      if (calculateAdvancedRcs({ ...input, profile: { armSensitive: true } }).warnings.some(isArm)) c.sensitive++;
      if (/tennis elbow|problèmes de bras/i.test(calculateCompatibility(r, s.stiffness, t).recommendation)) c.compat++;
    }
  }
  return c;
}
const sum = (list: C[]): C => list.reduce((a, c) => ({ combos: a.combos + c.combos, standard: a.standard + c.standard, sensitive: a.sensitive + c.sensitive, compat: a.compat + c.compat }), { combos: 0, standard: 0, sensitive: 0, compat: 0 });
const pct = (n: number, d: number) => `${((n / d) * 100).toFixed(2)} %`;
const sg = (n: number) => `${n >= 0 ? '+' : ''}${n}`;
const FIELDS = ['stiffness', 'weight', 'headSize', 'stringPattern', 'balance', 'variant'] as const;

const before = (r: TennisRacquet): TennisRacquet => {
  const a = RACQUET_ALIGNMENT[r.id];
  if (!a) return r;
  const o: Record<string, unknown> = { ...r };
  for (const f of FIELDS) if (a.changes[f]) o[f] = a.changes[f]!.before;
  return o as unknown as TennisRacquet;
};
const AVANT = racquetsDatabase.map((r) => measure(before(r)));
const APRES = racquetsDatabase.map((r) => measure(r));
const T0 = sum(AVANT), T1 = sum(APRES);
const line = (label: string, a: C, b: C) =>
  `${label.padEnd(34)} standard ${a.standard} -> ${b.standard} (${sg(b.standard - a.standard)})  sensible ${a.sensitive} -> ${b.sensitive} (${sg(b.sensitive - a.sensitive)})  compatibilité ${a.compat} -> ${b.compat} (${sg(b.compat - a.compat)})`;

console.log(`Grille : ${racquetsDatabase.length} raquettes × ${stringsDatabase.length} cordages × ${TENSIONS.length} tensions = ${T1.combos} combinaisons`);
console.log(`AVANT  standard ${pct(T0.standard, T0.combos)}  sensible ${pct(T0.sensitive, T0.combos)}  compatibilité ${pct(T0.compat, T0.combos)}`);
console.log(`APRÈS  standard ${pct(T1.standard, T1.combos)}  sensible ${pct(T1.sensitive, T1.combos)}  compatibilité ${pct(T1.compat, T1.combos)}`);
console.log(line('GLOBAL', T0, T1));
console.log(`\nPar raquette modifiée (${stringsDatabase.length * TENSIONS.length} combinaisons par fiche) :`);
const lowered: string[] = [];
racquetsDatabase.forEach((r, i) => {
  const a = RACQUET_ALIGNMENT[r.id];
  if (!a || Object.keys(a.changes).length === 0) return;
  console.log('  ' + line(r.id, AVANT[i], APRES[i]) + `   [${Object.keys(a.changes).join(', ')}]`);
  if (APRES[i].standard < AVANT[i].standard || APRES[i].sensitive < AVANT[i].sensitive || APRES[i].compat < AVANT[i].compat) lowered.push(r.id);
});
console.log(`\nBAISSES d'alerte (une ou plusieurs mesures en recul) : ${lowered.length ? lowered.join(', ') : 'aucune'}`);

// POUR INFORMATION : RA restés en signal, chacun appliqué seul sur le catalogue APRÈS. Rien n'est appliqué.
const SIGNALS: Array<[string, number, string]> = [
  ['yonex-ezone-105', 66, 'TW US 2025, L2 seul'], ['yonex-vcore-98-tour', 64, 'TW US, L2 seul'], ['tecnifibre-tf40-305', 64, 'TW US, L2 seul'],
  ['head-extreme-standard', 66, '2024, mesure TWU L1'], ['head-extreme-standard', 67, '2026, TW US L2 seul'], ['head-speed-mp', 60, '2024 TWU L1 = 2026 TW US'],
  ['head-instinct-mp', 64, '2025 TWU L1 + TW US'], ['babolat-pure-aero-team', 66, 'Gen9/2026, TW US L2 seul'], ['wilson-clash-100-v2', 54, 'V3, mesure TWU L1'],
  ['wilson-clash-100l-v3', 54, 'TW US, L2 seul'],
];
console.log('\nPOUR INFORMATION, rien n\'est appliqué : RA resté en signal, appliqué seul (écart vs APRÈS, sur la fiche)');
for (const [id, ra, why] of SIGNALS) {
  const i = racquetsDatabase.findIndex((r) => r.id === id);
  const r = racquetsDatabase[i];
  const c = measure({ ...r, stiffness: ra });
  console.log(`  ${id.padEnd(26)} RA ${r.stiffness} -> ${ra} ${ra < (r.stiffness as number) ? '(BAISSE)' : '(hausse)'} ${why.padEnd(26)} standard ${sg(c.standard - APRES[i].standard)}  sensible ${sg(c.sensitive - APRES[i].sensitive)}  compatibilité ${sg(c.compat - APRES[i].compat)}`);
}
