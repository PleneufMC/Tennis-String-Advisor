/**
 * Effet des rigidités de laboratoire (C2) sur l'alerte bras avancée. Rejouable :
 *   npx tsx scripts/scraper/c2-effet-alertes.mts                 AVANT = rigidités `before` de la provenance (avant C2)
 *   npx tsx scripts/scraper/c2-effet-alertes.mts --base=3e2e058  AVANT = catalogue à ce commit (effet d'une PR)
 *
 * Grille du contrôle 5 de `audit:ratings` (raquettes × cordages × 6 tensions, profils standard et sensible), APRÈS =
 * catalogue. Règle 2 : les alertes DISPARUES combinaison par combinaison doivent valoir 0 (sinon code de sortie 1).
 * Aucun accès réseau.
 */
import { execFileSync } from 'node:child_process';
import { racquetsDatabase } from '../../src/data/racquets-database';
import { stringsDatabase } from '../../src/data/strings-database';
import { STRING_STIFFNESS_PROVENANCE } from '../../src/data/string-stiffness-provenance';
import { calculateAdvancedRcs, stringTypeToFamily } from '../../src/lib/advanced-rcs';
import { effectiveRacquetRA } from '../../src/lib/racquet-scoring';

const TENSIONS = [18, 20, 22, 24, 26, 28];
type Counts = { combos: number; standard: number; sensitive: number };
const isArmWarning = (w: string) => /bras|elbow/i.test(w);

function evaluate(overrides: Record<string, number>): { total: Counts; byString: Map<string, Counts>; flags: number[] } {
  const total: Counts = { combos: 0, standard: 0, sensitive: 0 };
  const byString = new Map<string, Counts>();
  const flags: number[] = [];
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
        const std = calculateAdvancedRcs({ ...input, profile: { armSensitive: false } }).warnings.some(isArmWarning);
        const sen = calculateAdvancedRcs({ ...input, profile: { armSensitive: true } }).warnings.some(isArmWarning);
        if (std) c.standard++;
        if (sen) c.sensitive++;
        flags.push(+std, +sen);
      }
    }
    byString.set(s.id, c);
    total.combos += c.combos; total.standard += c.standard; total.sensitive += c.sensitive;
  }
  return { total, byString, flags };
}

const pct = (n: number, d: number) => `${((n / d) * 100).toFixed(2)} %`;
const signed = (n: number) => `${n >= 0 ? '+' : ''}${n}`;
const entries = Object.entries(STRING_STIFFNESS_PROVENANCE);
const ref = process.argv.find((a) => a.startsWith('--base='))?.slice('--base='.length);
const base: Record<string, number> = ref
  ? Object.fromEntries([...execFileSync('git', ['show', `${ref}:src/data/strings-database.ts`], { encoding: 'utf8', maxBuffer: 1 << 26 })
      .matchAll(/\n\s+id: '([^']+)',[\s\S]*?\n\s+stiffness: ([\d.]+),/g)].map((m) => [m[1], Number(m[2])]))
  : Object.fromEntries(entries.map(([id, e]) => [id, e.before]));
const current = evaluate({});
const avant = evaluate(base);
const say = (label: string, r: Counts, ref?: Counts) =>
  console.log(`${label.padEnd(34)} standard ${pct(r.standard, r.combos)} (${r.standard})  sensible ${pct(r.sensitive, r.combos)} (${r.sensitive})` +
    (ref ? `   Δ ${signed(r.standard - ref.standard)} / ${signed(r.sensitive - ref.sensitive)}` : ''));

console.log(`Grille : ${racquetsDatabase.length} raquettes × ${stringsDatabase.length} cordages × ${TENSIONS.length} tensions = ${current.total.combos} combinaisons`);
say(ref ? `AVANT (catalogue à ${ref})` : 'AVANT (rigidités `before`)', avant.total);
say('APRÈS (catalogue)', current.total, avant.total);
const per = current.flags.length / stringsDatabase.length;
const goneIds = new Set<string>();
avant.flags.forEach((f, i) => { if (f && !current.flags[i]) goneIds.add(stringsDatabase[Math.floor(i / per)].id); });
const gone = avant.flags.filter((f, i) => f && !current.flags[i]).length;
console.log(`Alertes apparues : ${current.flags.filter((f, i) => f && !avant.flags[i]).length} ; DISPARUES : ${gone}${gone ? ` (${[...goneIds].join(', ')})` : ''} (règle 2 : doit valoir 0)`);
console.log('\nPar fiche dont la rigidité change (combinaisons par fiche : ' + racquetsDatabase.length * TENSIONS.length + ') :');
for (const [id, e] of entries) {
  const s = stringsDatabase.find((x) => x.id === id);
  if (!s || base[id] === undefined || base[id] === s.stiffness) continue;
  const a = avant.byString.get(id)!, b = current.byString.get(id)!;
  console.log(`  ${id.padEnd(28)} ${e.status.padEnd(13)} rigidité ${String(base[id]).padStart(5)} -> ${String(s.stiffness).padStart(5)}   ` +
    `standard ${a.standard} -> ${b.standard}   sensible ${a.sensitive} -> ${b.sensitive}`);
}
process.exit(gone === 0 ? 0 : 1);
