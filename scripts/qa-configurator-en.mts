/**
 * QA — configurateur anglais (20/11/2026, tsa-acquisition ; propriétaire : tsa-measure).
 *
 * `/en/configurator` rend le composant de `/configurator` (même calcul, mêmes alertes). Les textes du moteur restent écrits en
 * français dans `advanced-rcs.ts` et `strings-database.ts` ; la page anglaise les traduit à l'affichage
 * (`src/lib/i18n/configurator.ts`). Un texte du moteur qu'aucun motif ne reconnaît s'afficherait en français : rien n'est masqué,
 * mais la parité serait rompue sans bruit. Ce script l'empêche :
 *  (a) sur la grille du catalogue (toutes les raquettes × tous les cordages non hybrides × tensions 15 à 35 kg, deux profils,
 *      plus des hybrides), chaque alerte, recommandation, synthèse et mention d'hybride du moteur a sa traduction ;
 *  (b) chaque traduction garde les nombres de l'original, dans le même ordre (0,5 → 0.5), et une alerte bras traduite cite le
 *      seuil et renvoie vers un professionnel de santé ;
 *  (c) chaque palier de `getStringRecommendation` (indices 0 à 60) a sa traduction ;
 *  (d) la page passe bien par la traduction pour les alertes, recommandations, synthèse, mention d'hybride et paliers ;
 *  (e) tests négatifs : un texte du moteur modifié est détecté comme non traduit.
 */
import { readFileSync } from 'node:fs';
import { racquetsDatabase } from '../src/data/racquets-database';
import { stringsDatabase, getStringRecommendation } from '../src/data/strings-database';
import { calculateAdvancedRcs, stringTypeToFamily, parseGaugeMm, type AdvancedRcsInput } from '../src/lib/advanced-rcs';
import { effectiveRacquetRA } from '../src/lib/racquet-scoring';
import { CONFIGURATOR_TEXT, translateEngineText } from '../src/lib/i18n/configurator';

let failures = 0;
const ok = (m: string) => process.stdout.write(`  OK    ${m}\n`);
const fail = (m: string) => {
  failures++;
  process.stdout.write(`  ECHEC ${m}\n`);
};
process.stdout.write('--- qa-configurator-en : parité du configurateur anglais ---\n');

const EN = CONFIGURATOR_TEXT.en;
const nums = (t: string) => [...t.replace(/(\d),(\d)/g, '$1.$2').matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0]);

// (a) Textes du moteur sur la grille.
const texts = new Map<string, string>(); // texte -> origine
const ratingsOf = (s: (typeof stringsDatabase)[number]) => ({
  control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability,
});
const strings = stringsDatabase.filter((s) => s.type !== 'Hybrid');
let combos = 0;
for (const r of racquetsDatabase) {
  for (const s of strings) {
    for (let t = 15; t <= 35; t++) {
      const input: AdvancedRcsInput = {
        racquetStiffness: effectiveRacquetRA(r),
        racquetWeight: r.weight,
        racquetHeadSize: r.headSize,
        mainStringStiffness: s.stiffness,
        mainStringFamily: stringTypeToFamily(s.type),
        mainRatings: ratingsOf(s),
        mainGaugeMm: parseGaugeMm(s.gauges?.[0]),
        mainTension: t,
        crossTension: t,
      };
      for (const armSensitive of [false, true]) {
        const res = calculateAdvancedRcs({ ...input, profile: { armSensitive } });
        combos++;
        for (const w of res.warnings) texts.set(w, 'alerte');
        for (const x of res.recommendations) texts.set(x, 'recommandation');
        texts.set(res.summary, 'synthèse');
      }
    }
  }
}
// Hybrides : chaque cordage en travers d'un échantillon de montants, travers à -2, 0 et +2 kg.
const mainsSample = strings.filter((_, i) => i % 7 === 0);
for (const r of racquetsDatabase.filter((_, i) => i % 5 === 0)) {
  for (const m of mainsSample) {
    for (const c of strings) {
      if (c.id === m.id) continue;
      for (const d of [-2, 0, 2]) {
        const res = calculateAdvancedRcs({
          racquetStiffness: effectiveRacquetRA(r), racquetWeight: r.weight, racquetHeadSize: r.headSize,
          mainStringStiffness: m.stiffness, mainStringFamily: stringTypeToFamily(m.type), mainRatings: ratingsOf(m),
          crossStringStiffness: c.stiffness, crossStringFamily: stringTypeToFamily(c.type), crossRatings: ratingsOf(c),
          mainTension: 24, crossTension: 24 + d, profile: { armSensitive: d === 0 },
        });
        combos++;
        if (res.hybrid) texts.set(res.hybrid.note, 'mention hybride');
        for (const w of res.warnings) texts.set(w, 'alerte');
        for (const x of res.recommendations) texts.set(x, 'recommandation');
        texts.set(res.summary, 'synthèse');
      }
    }
  }
}
// Recommandations de profil (non posées par la page aujourd'hui, traduites quand même).
for (const level of ['beginner', 'pro'] as const) {
  for (const s of strings.slice(0, 40)) {
    const res = calculateAdvancedRcs({
      racquetStiffness: 66, mainStringStiffness: s.stiffness, mainStringFamily: stringTypeToFamily(s.type), mainRatings: ratingsOf(s),
      mainTension: 24, profile: { level, style: 'baseline' } as any,
    });
    for (const x of res.recommendations) texts.set(x, 'recommandation');
  }
}

// (b bis) Sens des alertes bras : un nombre conservé ne suffit pas. Chaque clause qui porte un sens (seuil atteint ou dépassé,
// profil appliqué, sous / reste sous, cause, effet de la tension) doit avoir son équivalent anglais, et seulement quand l'original
// la porte ; les nombres capturés sont les mêmes de part et d'autre.
const ALERT_SENSE: Array<[string, RegExp, RegExp]> = [
  ['seuil dépassé', /seuil d'alerte de (\d+) dépassé/, /alert threshold of (\d+) exceeded/],
  ['seuil atteint', /seuil d'alerte de (\d+) atteint/, /alert threshold of (\d+) reached/],
  ['profil bras sensible', /\(bras sensible déclaré\)/, /\(sensitive arm declared\)/],
  ['profil standard', /\(profil standard\)/, /\(standard profile\)/],
  ['points à retirer', /Il faut (\d+) points? d'indice de moins pour repasser sous (\d+)/, /must drop by (\d+) points? to get back under (\d+)/],
  ['note de confort sous la limite', /note de confort calculée du montage sous (\d+) sur 100/, /comfort rating is below (\d+) out of 100/],
  ['affichée à la limite', /avant arrondi, affichée (\d+)/, /before rounding, shown as (\d+)/],
  ['indice qui reste sous le seuil', /l'indice \((\d+)\) reste sous le seuil de (\d+)/, /the index \((\d+)\) stays under the threshold of (\d+)/],
  ['raison du seuil', /fixé par le site pour le risque de tennis elbow/, /set by the site for the risk of tennis elbow/],
  ['note non mesurée', /note de confort de l'équipe, non mesurée/, /comfort rating, not measured/],
  ['effet de la tension', /1 kg de tension en moins retire 0,5 point/, /1 kg less tension removes 0\.5 point/],
];
const alertSenseIssues = (fr: string, en: string): string[] => {
  const out: string[] = [];
  for (const [name, reFr, reEn] of ALERT_SENSE) {
    const a = reFr.exec(fr);
    const b = reEn.exec(en);
    if (!a && !b) continue;
    if (a && !b) out.push(`clause « ${name} » perdue à la traduction`);
    else if (!a && b) out.push(`clause « ${name} » ajoutée par la traduction`);
    else if (a!.slice(1).join(' ') !== b!.slice(1).join(' ')) out.push(`clause « ${name} » : nombres changés (${a!.slice(1).join(' ')} → ${b!.slice(1).join(' ')})`);
  }
  return out;
};

const byKind = new Map<string, number>();
let untranslated = 0;
for (const [fr, kind] of texts) {
  byKind.set(kind, (byKind.get(kind) ?? 0) + 1);
  const en = translateEngineText(fr);
  if (en === null) {
    untranslated++;
    if (untranslated <= 10) fail(`${kind} sans traduction (s'afficherait en français) : « ${fr.slice(0, 140)} »`);
    continue;
  }
  // (b) mêmes nombres, même ordre.
  const a = nums(fr).join(' ');
  const b = nums(en).join(' ');
  if (a !== b) fail(`${kind} : nombres changés par la traduction (${a} → ${b}) : « ${en.slice(0, 120)} »`);
  if (kind === 'alerte') {
    alertSenseIssues(fr, en).forEach((i) => fail(`alerte : ${i} : « ${en.slice(0, 100)} »`));
    if (!/^Arm alert: /.test(en)) fail(`alerte traduite sans « Arm alert: » : « ${en.slice(0, 80)} »`);
    if (!/see a health professional\.$/.test(en)) fail(`alerte traduite sans renvoi vers un professionnel de santé : « ${en.slice(0, 80)} »`);
    if (!/threshold of \d+|alert threshold of \d+/.test(en)) fail(`alerte traduite sans seuil : « ${en.slice(0, 80)} »`);
  }
  if (/[àâçéèêëîïôûùü]|\b(?:seuil|indice|cordage|montants|travers|tension en moins)\b/i.test(en)) {
    fail(`${kind} : traduction avec du français résiduel : « ${en.slice(0, 120)} »`);
  }
}
if (untranslated === 0) {
  ok(
    `${texts.size} textes distincts du moteur sur ${combos} montages (${[...byKind].map(([k, n]) => `${n} ${k}`).join(', ')}) : ` +
      'tous traduits, nombres conservés, alertes avec seuil et renvoi vers un professionnel de santé'
  );
} else fail(`${untranslated} texte(s) du moteur sans traduction`);

// (c) Paliers.
const levels = new Set<string>();
for (let i = 0; i <= 60; i++) {
  const rec = getStringRecommendation(i);
  const en = EN.stringLevel(rec.level, rec.description);
  levels.add(rec.level);
  if (en.level === rec.level && en.level !== 'Standard') fail(`palier « ${rec.level} » (indice ${i}) sans traduction`);
  if (en.description === rec.description) fail(`description du palier « ${rec.level} » sans traduction`);
}
ok(`${levels.size} paliers de getStringRecommendation traduits (${[...levels].join(', ')})`);

// (d) La page passe par la traduction.
const page = readFileSync('src/app/configurator/page.tsx', 'utf8');
const NEED: Array<[RegExp, string]> = [
  [/⚠️ \{tx\.engine\(w\)\}/, 'alertes bras (tx.engine(w))'],
  [/💡 \{tx\.engine\(rec\)\}/, 'recommandations (tx.engine(rec))'],
  [/\{tx\.engine\(advancedRcs\.summary\)\}/, 'synthèse (tx.engine(advancedRcs.summary))'],
  [/tx\.engine\(rcsData\.hybrid\.note\)/, "mention d'hybride (tx.engine(rcsData.hybrid.note))"],
  [/tx\.stringLevel\(rcsData\.recommendation\.level, rcsData\.recommendation\.description\)/, 'palier (tx.stringLevel)'],
];
const missing = NEED.filter(([re]) => !re.test(page)).map(([, what]) => what);
if (missing.length) missing.forEach((m) => fail(`configurator/page.tsx n'affiche plus via la traduction : ${m}`));
else ok(`configurator/page.tsx : ${NEED.length} affichages du moteur passent par la traduction`);
const route = readFileSync('src/app/en/configurator/page.tsx', 'utf8');
if (!/import ConfiguratorPage from '@\/app\/configurator\/page'/.test(route) || !/<ConfiguratorPage \/>/.test(route)) {
  fail('src/app/en/configurator/page.tsx ne rend plus le composant FR : la parité ne tient plus par construction');
} else ok('src/app/en/configurator/page.tsx rend le composant de configurator/page.tsx (une seule source)');

// (e) Tests négatifs : un texte du moteur modifié n'est pas reconnu.
const sample = [...texts.keys()].find((t) => t.startsWith('Alerte bras : indice'));
const NEG: Array<[string, string | undefined]> = [
  ['seuil reformulé dans une alerte', sample?.replace("seuil d'alerte de", "limite d'alerte de")],
  ['renvoi santé retiré d\'une alerte', sample?.replace(' Douleur persistante : consultez un professionnel de santé.', '')],
  ['synthèse reformulée', 'Bon compromis général, quelques ajustements possibles.'],
];
let detected = 0;
for (const [name, mutated] of NEG) {
  if (!mutated) { fail(`test négatif « ${name} » : prémisse absente (aucune alerte d'indice sur la grille)`); continue; }
  if (translateEngineText(mutated) === null) detected++;
  else fail(`garde-fou muet sur « ${name} »`);
}
if (detected === NEG.length) ok(`${detected} tests négatifs détectés (texte du moteur modifié = non traduit)`);

// (e bis) Tests négatifs du sens : une traduction qui inverse ou retire une clause d'alerte est détectée.
const idxAlerts = [...texts.keys()].filter((t) => t.startsWith('Alerte bras : indice'));
const comfortAlert = [...texts.keys()].find((t) => t.startsWith('Alerte bras : note de confort'));
const reachedFr = idxAlerts.find((t) => t.includes(' atteint ('));
const exceededFr = idxAlerts.find((t) => t.includes(' dépassé ('));
const SENSE_NEG: Array<[string, string | undefined, (en: string) => string]> = [
  ['atteint traduit « exceeded »', reachedFr, (en) => en.replace(' reached (', ' exceeded (')],
  ['dépassé traduit « reached »', exceededFr, (en) => en.replace(' exceeded (', ' reached (')],
  ['profil inversé', reachedFr, (en) => en.replace(/\((sensitive arm declared|standard profile)\)/, (_m, p) => (p === 'standard profile' ? '(sensitive arm declared)' : '(standard profile)'))],
  ['« below » devenu « above »', comfortAlert, (en) => en.replace('is below ', 'is above ')],
  ['« stays under » devenu « exceeds »', comfortAlert, (en) => en.replace('stays under the threshold of', 'exceeds the threshold of')],
  ['raison du seuil retirée', exceededFr, (en) => en.replace(', a threshold set by the site for the risk of tennis elbow.', '.')],
];
let senseDetected = 0;
for (const [name, fr, mutate] of SENSE_NEG) {
  const en = fr ? translateEngineText(fr) : null;
  if (!fr || en === null) { fail(`test négatif du sens « ${name} » : prémisse absente`); continue; }
  const mutated = mutate(en);
  if (mutated === en) { fail(`test négatif du sens « ${name} » : mutation sans effet (motif absent)`); continue; }
  if (alertSenseIssues(fr, mutated).length > 0) senseDetected++;
  else fail(`garde-fou du sens muet sur « ${name} »`);
}
// (f) Textes fixes de la page (seuils cités en dur : « Prudence dès 32 … 35 », paliers, aide de la case bras sensible) : la
//     version anglaise cite les mêmes nombres que la française.
const FRD = CONFIGURATOR_TEXT.fr as Record<string, unknown>;
const END = EN as unknown as Record<string, unknown>;
const fixedPairs: Array<[string, string, string]> = Object.keys(FRD)
  .filter((k) => typeof FRD[k] === 'string' && typeof END[k] === 'string')
  .map((k) => [k, FRD[k] as string, END[k] as string]);
const constOf = (name: string) => new RegExp(`const ${name} =\\s*\\n?\\s*(["'])(.*?)\\1;`, 's').exec(page)?.[2] ?? null;
fixedPairs.push(['ARM_SENSITIVE_HELP', constOf('ARM_SENSITIVE_HELP') ?? '', constOf('ARM_SENSITIVE_HELP_EN') ?? '']);
const fixedBad = fixedPairs.filter(([, fr, en]) => fr === '' || en === '' || nums(fr).join(' ') !== nums(en).join(' '));
fixedBad.forEach(([k, fr, en]) => fail(`texte fixe « ${k} » : nombres différents entre FR et EN (${nums(fr).join(' ')} → ${nums(en).join(' ')})`));
if (fixedBad.length === 0) ok(`${fixedPairs.length} textes fixes FR/EN : mêmes nombres (dont « ${EN.tennisElbowText} » et l'aide de la case bras sensible)`);

if (senseDetected === SENSE_NEG.length) ok(`${senseDetected} tests négatifs du sens des alertes détectés (${ALERT_SENSE.length} clauses relues sur chaque alerte)`);

process.stdout.write(failures === 0 ? '\nconfigurateur EN : parité des textes du moteur vérifiée\n' : `\n${failures} échec(s)\n`);
process.exit(failures === 0 ? 0 : 1);
