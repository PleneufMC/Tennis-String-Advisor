/**
 * Effet des rigidités de laboratoire (C2) sur l'alerte bras avancée. Rejouable :
 *   npx tsx scripts/scraper/c2-effet-alertes.mts
 *
 * Grille du contrôle 5 de `audit:ratings` (raquettes × cordages × 6 tensions, profils standard et sensible).
 * AVANT = rigidités `before` de la provenance, APRÈS = catalogue ; puis, POUR INFORMATION et sans rien appliquer,
 * ce que donnerait chaque règle de jauge de référence (décision de produit non tranchée). Aucun accès réseau.
 */
import { racquetsDatabase } from '../../src/data/racquets-database';
import { stringsDatabase } from '../../src/data/strings-database';
import { STRING_STIFFNESS_PROVENANCE } from '../../src/data/string-stiffness-provenance';
import { calculateAdvancedRcs, stringTypeToFamily } from '../../src/lib/advanced-rcs';
import { effectiveRacquetRA } from '../../src/lib/racquet-scoring';

const TENSIONS = [18, 20, 22, 24, 26, 28];
type Counts = { combos: number; standard: number; sensitive: number };
const isArmWarning = (w: string) => /bras|elbow/i.test(w);

function evaluate(overrides: Record<string, number>): { total: Counts; byString: Map<string, Counts> } {
  const total: Counts = { combos: 0, standard: 0, sensitive: 0 };
  const byString = new Map<string, Counts>();
  for (const s of stringsDatabase) {
    const c: Counts = { combos: 0, standard: 0, sensitive: 0 };
    for (const r of racquetsDatabase) {
      for (const t of TENSIONS) {
        const input = {
          racquetStiffness: effectiveRacquetRA(r), racquetWeight: r.weight, racquetHeadSize: r.headSize,
          mainStringStiffness: overrides[s.id] ?? s.stiffness, mainStringFamily: stringTypeToFamily(s.type),
          mainRatings: { control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability },
          mainTension: t,
        };
        c.combos++;
        if (calculateAdvancedRcs({ ...input, profile: { armSensitive: false } }).warnings.some(isArmWarning)) c.standard++;
        if (calculateAdvancedRcs({ ...input, profile: { armSensitive: true } }).warnings.some(isArmWarning)) c.sensitive++;
      }
    }
    byString.set(s.id, c);
    total.combos += c.combos; total.standard += c.standard; total.sensitive += c.sensitive;
  }
  return { total, byString };
}

const pct = (n: number, d: number) => `${((n / d) * 100).toFixed(2)} %`;
const signed = (n: number) => `${n >= 0 ? '+' : ''}${n}`;
const entries = Object.entries(STRING_STIFFNESS_PROVENANCE);
const current = evaluate({});
const avant = evaluate(Object.fromEntries(entries.map(([id, e]) => [id, e.before])));
const say = (label: string, r: Counts, ref?: Counts) =>
  console.log(`${label.padEnd(34)} standard ${pct(r.standard, r.combos)} (${r.standard})  sensible ${pct(r.sensitive, r.combos)} (${r.sensitive})` +
    (ref ? `   Δ ${signed(r.standard - ref.standard)} / ${signed(r.sensitive - ref.sensitive)}` : ''));

console.log(`Grille : ${racquetsDatabase.length} raquettes × ${stringsDatabase.length} cordages × ${TENSIONS.length} tensions = ${current.total.combos} combinaisons`);
say('AVANT (rigidités `before`)', avant.total);
say('APRÈS (catalogue)', current.total, avant.total);
console.log('\nPar fiche en provenance (combinaisons par fiche : ' + racquetsDatabase.length * TENSIONS.length + ') :');
for (const [id, e] of entries) {
  const s = stringsDatabase.find((x) => x.id === id)!;
  const a = avant.byString.get(id)!, b = current.byString.get(id)!;
  console.log(`  ${id.padEnd(28)} ${e.status.padEnd(13)} rigidité ${String(e.before).padStart(5)} -> ${String(s.stiffness).padStart(5)}   ` +
    `standard ${a.standard} -> ${b.standard}   sensible ${a.sensitive} -> ${b.sensitive}`);
}

// Pour information : règles de jauge de référence appliquées aux fiches qui ont des mesures.
const rules: Array<[string, (gauges: string[], m: Array<{ gauge: string; lbIn: number }>) => number | undefined]> = [
  ['A. jauge listée en premier', (g, m) => m.find((x) => x.gauge === g[0])?.lbIn],
  ['B. jauge la plus proche de 1,25 mm', (_g, m) => [...m].sort((x, y) => Math.abs(Number(x.gauge) - 1.25) - Math.abs(Number(y.gauge) - 1.25) || Number(x.gauge) - Number(y.gauge))[0]?.lbIn],
  ['C. jauge la plus rigide mesurée', (_g, m) => (m.length ? Math.max(...m.map((x) => x.lbIn)) : undefined)],
];
console.log('\nPOUR INFORMATION, rien n\'est appliqué : règle de jauge de référence sur les fiches mesurées (écart global vs AVANT ; écart par fiche vs APRÈS)');
for (const [name, pick] of rules) {
  const over: Record<string, number> = {};
  for (const [id, e] of entries) {
    const s = stringsDatabase.find((x) => x.id === id)!;
    const v = pick(s.gauges, [...e.measures]);
    if (v !== undefined) over[id] = v;
  }
  const r = evaluate(over);
  say(name, r.total, avant.total);
  for (const [id, v] of Object.entries(over)) {
    const s = stringsDatabase.find((x) => x.id === id)!, a = current.byString.get(id)!, b = r.byString.get(id)!;
    console.log(`     ${id.padEnd(28)} ${String(s.stiffness).padStart(5)} -> ${String(v).padStart(5)} ${v < s.stiffness ? '(BAISSE)' : v > s.stiffness ? '(hausse)' : '        '} standard ${a.standard} -> ${b.standard}  sensible ${a.sensitive} -> ${b.sensitive}`);
  }
}
