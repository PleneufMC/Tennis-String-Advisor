/**
 * Effet des rigidités de laboratoire (C2) sur les alertes bras. Rejouable :
 *   npx tsx scripts/scraper/c2-effet-alertes.mts                 AVANT = rigidités `before` de la provenance (avant C2)
 *   npx tsx scripts/scraper/c2-effet-alertes.mts --base=3e2e058  AVANT = catalogue à ce commit (effet d'une PR)
 *
 * Grille du contrôle 5 de `audit:ratings` (raquettes × cordages × 6 tensions), APRÈS = catalogue. Trois mesures :
 *   - l'alerte bras du module AVANCÉ, profils standard et sensible (contrôle 5) ;
 *   - l'alerte bras de `calculateCompatibility` (autre module, contrôle 4) ;
 *   - le palier « Très Ferme » du RCS (contrôle 8, tensions 19 à 29).
 * Règle 2 : une alerte DISPARUE combinaison par combinaison (avancé standard, avancé sensible, calculateCompatibility) ou une rigidité
 * en BAISSE par rapport à l'état de référence fait sortir le script en code 1. Sont listés : toutes les fiches dont la rigidité change,
 * puis des montages témoins (RCS et alerte, avant → après). Aucun accès réseau.
 */
import { execFileSync } from 'node:child_process';
import { racquetsDatabase, calculateCompatibility } from '../../src/data/racquets-database';
import { stringsDatabase, calculateRCS, getStringRecommendation } from '../../src/data/strings-database';
import { STRING_STIFFNESS_PROVENANCE } from '../../src/data/string-stiffness-provenance';
import { calculateAdvancedRcs, stringTypeToFamily } from '../../src/lib/advanced-rcs';
import { effectiveRacquetRA } from '../../src/lib/racquet-scoring';

const TENSIONS = [18, 20, 22, 24, 26, 28];
const RCS_TENSIONS = [19, 21, 23, 25, 27, 29]; // celles du contrôle 8 (palier « Très Ferme »)
type Counts = { combos: number; standard: number; sensitive: number; compat: number; veryFirm: number; veryFirmCombos: number };
const isArmWarning = (w: string) => /bras|elbow/i.test(w);
const isCompatArm = (recommendation: string) => /tennis elbow|problèmes de bras/i.test(recommendation);
const empty = (): Counts => ({ combos: 0, standard: 0, sensitive: 0, compat: 0, veryFirm: 0, veryFirmCombos: 0 });

/** flags : par combinaison (cordage, raquette, tension), [avancé standard, avancé sensible, calculateCompatibility]. */
function evaluate(overrides: Record<string, number>): { total: Counts; byString: Map<string, Counts>; flags: number[] } {
  const total = empty();
  const byString = new Map<string, Counts>();
  const flags: number[] = [];
  for (const s of stringsDatabase) {
    const c = empty();
    const stiffness = overrides[s.id] ?? s.stiffness;
    for (const r of racquetsDatabase) {
      for (const t of TENSIONS) {
        const input = {
          racquetStiffness: effectiveRacquetRA(r), racquetWeight: r.weight, racquetHeadSize: r.headSize,
          mainStringStiffness: stiffness, mainStringFamily: stringTypeToFamily(s.type),
          mainRatings: { control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability },
          mainTension: t,
        };
        c.combos++;
        const std = calculateAdvancedRcs({ ...input, profile: { armSensitive: false } }).warnings.some(isArmWarning);
        const sen = calculateAdvancedRcs({ ...input, profile: { armSensitive: true } }).warnings.some(isArmWarning);
        const compat = isCompatArm(calculateCompatibility(r, stiffness, t).recommendation);
        if (std) c.standard++;
        if (sen) c.sensitive++;
        if (compat) c.compat++;
        flags.push(+std, +sen, +compat);
      }
      for (const t of RCS_TENSIONS) {
        c.veryFirmCombos++;
        if (getStringRecommendation(calculateRCS(effectiveRacquetRA(r), stiffness, t)).level === 'Très Ferme') c.veryFirm++;
      }
    }
    byString.set(s.id, c);
    for (const k of Object.keys(total) as Array<keyof Counts>) total[k] += c[k];
  }
  return { total, byString, flags };
}

const pct = (n: number, d: number) => `${((n / d) * 100).toFixed(2)} %`;
const signed = (n: number) => `${n >= 0 ? '+' : ''}${n}`;
const ref = process.argv.find((a) => a.startsWith('--base='))?.slice('--base='.length);
const base: Record<string, number> = ref
  ? Object.fromEntries([...execFileSync('git', ['show', `${ref}:src/data/strings-database.ts`], { encoding: 'utf8', maxBuffer: 1 << 26 })
      .matchAll(/\n\s+id: '([^']+)',[\s\S]*?\n\s+stiffness: ([\d.]+),/g)].map((m) => [m[1], Number(m[2])]))
  : Object.fromEntries(Object.entries(STRING_STIFFNESS_PROVENANCE).map(([id, e]) => [id, e.before]));
const current = evaluate({});
const avant = evaluate(base);
const label = ref ? `AVANT (catalogue à ${ref})` : 'AVANT (rigidités `before`)';
const say = (name: string, r: Counts, prev?: Counts) =>
  console.log(`${name.padEnd(34)} standard ${pct(r.standard, r.combos)} (${r.standard})  sensible ${pct(r.sensitive, r.combos)} (${r.sensitive})  ` +
    `calculateCompatibility ${pct(r.compat, r.combos)} (${r.compat})  Très Ferme ${pct(r.veryFirm, r.veryFirmCombos)}` +
    (prev ? `   Δ ${signed(r.standard - prev.standard)} / ${signed(r.sensitive - prev.sensitive)} / ${signed(r.compat - prev.compat)}` : ''));

console.log(`Grille : ${racquetsDatabase.length} raquettes × ${stringsDatabase.length} cordages × ${TENSIONS.length} tensions = ${current.total.combos} combinaisons`);
say(label, avant.total);
say('APRÈS (catalogue)', current.total, avant.total);

// Alertes apparues / DISPARUES, combinaison par combinaison, pour chacun des trois indicateurs.
const NAMES = ['avancé standard', 'avancé sensible', 'calculateCompatibility'];
let goneTotal = 0;
for (let k = 0; k < 3; k++) {
  let appeared = 0, gone = 0;
  const goneIds = new Set<string>();
  for (let i = k; i < avant.flags.length; i += 3) {
    if (current.flags[i] && !avant.flags[i]) appeared++;
    if (avant.flags[i] && !current.flags[i]) { gone++; goneIds.add(stringsDatabase[Math.floor(i / 3 / (racquetsDatabase.length * TENSIONS.length))].id); }
  }
  goneTotal += gone;
  console.log(`Alertes ${NAMES[k].padEnd(22)} apparues : ${String(appeared).padStart(5)} ; DISPARUES : ${gone}${gone ? ` (${[...goneIds].join(', ')})` : ''} (règle 2 : doit valoir 0)`);
}

console.log('\nPar fiche dont la rigidité change (combinaisons par fiche : ' + racquetsDatabase.length * TENSIONS.length + ') ; alertes avant -> après [standard | sensible | calculateCompatibility] :');
const lowered: string[] = [];
for (const s of stringsDatabase) {
  if (base[s.id] === undefined || base[s.id] === s.stiffness) continue;
  const a = avant.byString.get(s.id)!, b = current.byString.get(s.id)!;
  if (s.stiffness < base[s.id]) lowered.push(`${s.id} ${base[s.id]} -> ${s.stiffness}`);
  const status = STRING_STIFFNESS_PROVENANCE[s.id]?.status ?? 'hors provenance';
  console.log(`  ${s.id.padEnd(30)} ${status.padEnd(13)} rigidité ${String(base[s.id]).padStart(5)} -> ${String(s.stiffness).padStart(5)}   ` +
    `standard ${String(a.standard).padStart(3)} -> ${String(b.standard).padStart(3)}   sensible ${String(a.sensitive).padStart(3)} -> ${String(b.sensitive).padStart(3)}   compat ${String(a.compat).padStart(3)} -> ${String(b.compat).padStart(3)}`);
}
console.log(`\nRigidités en BAISSE par rapport à l'état de référence : ${lowered.length}${lowered.length ? ` (${lowered.join(' ; ')})` : ''} (règle 2 : doit valoir 0 sans GO de Pierre)`);

// Montages témoins : RCS (tension 22, 24, 26 kg) et alerte bras avancée, avant -> après.
const WITNESSES: Array<[string, string, string]> = [
  ['babolat-pure-drive-standard', 'luxilon-4g', 'Pure Drive (RA 69) + Luxilon 4G'],
  ['babolat-pure-drive-standard', 'babolat-revenge', 'Pure Drive (RA 69) + Babolat Revenge'],
  ['babolat-pure-drive-standard', 'babolat-rpm-team', 'Pure Drive (RA 69) + Babolat RPM Team'],
  ['yonex-ezone-100', 'solinco-mach-10', 'EZONE 100 (RA 68) + Solinco Mach-10'],
  ['wilson-pro-staff-97-v14', 'tecnifibre-razor-soft', 'Pro Staff 97 v14 (RA 66) + Razor Soft'],
  ['babolat-pure-aero-standard', 'luxilon-element', 'Pure Aero (RA 66) + Luxilon Element'],
  ['wilson-blade-98-16x19-v9', 'yonex-poly-tour-spin', 'Blade 98 16x19 v9 (RA 64) + Poly Tour Spin'],
  ['wilson-pro-staff-97-v14', 'signum-pro-x-perience', 'Pro Staff 97 v14 (RA 66) + Signum Pro X-Perience'],
  ['head-gravity-mp', 'head-lynx-tour', 'Gravity MP (RA 57) + Head Lynx Tour'],
  ['babolat-pure-drive-standard', 'tecnifibre-tgv', 'Pure Drive (RA 69) + Tecnifibre TGV'],
];
const alertLabel = (rid: string, sid: string, t: number, stiffness: number) => {
  const r = racquetsDatabase.find((x) => x.id === rid)!, s = stringsDatabase.find((x) => x.id === sid)!;
  const input = {
    racquetStiffness: effectiveRacquetRA(r), racquetWeight: r.weight, racquetHeadSize: r.headSize,
    mainStringStiffness: stiffness, mainStringFamily: stringTypeToFamily(s.type),
    mainRatings: { control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability }, mainTension: t,
  };
  const std = calculateAdvancedRcs({ ...input, profile: { armSensitive: false } }).warnings.some(isArmWarning);
  const sen = calculateAdvancedRcs({ ...input, profile: { armSensitive: true } }).warnings.some(isArmWarning);
  return { rcs: calculateRCS(effectiveRacquetRA(r), stiffness, t), label: std ? 'alerte standard' : sen ? 'alerte sensible' : 'aucune alerte' };
};
console.log('\nMontages témoins (RCS ; seuils d\'alerte : 32 sensible, 35 standard ; avant -> après) :');
for (const [rid, sid, name] of WITNESSES) {
  const s = stringsDatabase.find((x) => x.id === sid);
  if (!s || !racquetsDatabase.some((r) => r.id === rid)) { console.log(`| ${name} | introuvable (${rid} / ${sid}) |`); continue; }
  const from = base[sid] ?? s.stiffness;
  const cells = [22, 24, 26].map((t) => {
    const a = alertLabel(rid, sid, t, from), b = alertLabel(rid, sid, t, s.stiffness);
    return `${a.rcs} -> ${b.rcs}` + (a.label !== b.label ? ` : ${a.label} -> ${b.label}` : ` (${b.label})`);
  });
  console.log(`| ${name} (${from} -> ${s.stiffness}) | ${cells.join(' | ')} |`);
}
process.exit(goneTotal === 0 && lowered.length === 0 ? 0 : 1);
