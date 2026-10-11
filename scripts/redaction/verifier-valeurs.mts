/**
 * Vérificateur des valeurs produit citées dans un article — outil du pigiste
 * pour le fact-check final (docs/redaction/README.md, étape 4).
 *
 * POURQUOI : le 10/10/2026, l'article « Gravity MP vs Gravity Tour » a dû être
 * retiré. Ses notes ne correspondaient plus à la base, puis, une fois
 * réalignées, il comparait un profil dérivé des specs à un profil combiné avec
 * des avis de testeurs. Chaque agent écrivait jusque-là son propre script de
 * conformité ; celui-ci est le contrôle commun (charte, règles F1 et F2).
 *
 * ENTRÉE : le dossier de rédaction (docs/redaction/<slug>.md). Le pigiste y
 * recopie, dans un ou plusieurs blocs ```valeurs-produit, CHAQUE valeur produit
 * que l'article FR ou EN affiche, telle qu'elle est écrite :
 *
 *   raquette head-gravity-tour           | ra              | 59
 *   raquette head-gravity-tour           | profil.controle | 5,2
 *   raquette head-gravity-tour           | testeurs20      | 13,6
 *   cordage head-lynx-tour               | rigidite        | 210
 *   rcs head-gravity-tour + head-lynx-tour @ 22 | rcs      | 27
 *   raquette head-gravity-mp             | equilibre       | non publié
 *
 * Une 4e colonne libre (où la valeur apparaît) est permise ; `#` commente.
 *
 * RÈGLES : la valeur citée doit être celle de la base à la précision écrite,
 * avec au moins la précision de la fiche (une note /10 s'écrit avec une
 * décimale : « 7 » pour 7,4 échoue). « non publié » / « not published » n'est
 * valide que si la base n'a pas la donnée — et un chiffre cité là où la base
 * n'en a pas échoue (règle 3). Les profils cités doivent tous être de même
 * nature (dérivé des specs, ou combiné avec des avis) : sinon ECHEC (charte F2).
 *
 * Usage : npm run redaction:valeurs -- docs/redaction/<slug>.md
 * Sortie : 0 si tout est conforme, 1 sinon, 2 si l'entrée est inutilisable.
 */
import { readFileSync, existsSync } from 'node:fs';
import { racquetsDatabase, type TennisRacquet } from '../../src/data/racquets-database';
import { stringsDatabase, calculateRCS, type TennisString } from '../../src/data/strings-database';
import { rankRacquetsByTesterAverage, effectiveRacquetRA } from '../../src/lib/racquet-scoring';
import { RACQUET_TESTER_RATINGS } from '../../src/data/racquet-tester-ratings';
import { STRING_TESTER_RATINGS } from '../../src/data/tester-ratings';

type Base = { value: number | string | null | undefined; decimals?: number; nature?: string };

const file = process.argv[2];
if (!file || !existsSync(file)) {
  console.error('usage : npm run redaction:valeurs -- docs/redaction/<slug>.md');
  process.exit(2);
}

const ABSENT = /^(non publié|non communiqué|not published|n\/a|—|-)$/i;

/** Rang « de compétition » (égalité exacte -> même rang), comme /statistics. */
function competitionRank<T>(sorted: readonly T[], avg: (t: T) => number, isTarget: (t: T) => boolean): number | null {
  let rank = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0 || Math.abs(avg(sorted[i]) - avg(sorted[i - 1])) >= 1e-9) rank = i + 1;
    if (isTarget(sorted[i])) return rank;
  }
  return null;
}

const rankedRacquets = rankRacquetsByTesterAverage(racquetsDatabase);
const rankedStrings = stringsDatabase
  .filter((s) => STRING_TESTER_RATINGS[s.id] !== undefined)
  .sort((a, b) => STRING_TESTER_RATINGS[b.id].docxAverage20 - STRING_TESTER_RATINGS[a.id].docxAverage20 || a.id.localeCompare(b.id));

function racquetField(r: TennisRacquet, field: string): Base | string {
  // Correctif du 10/10/2026 : `racquetProfile` (profil « combiné ») n'existe plus dans racquet-scoring.ts depuis
  // « aucune note de raquette déduite des caractéristiques » (CLAUDE.md v2.3.1) ; l'import cassé rendait tout le
  // contrôle inutilisable. Un profil de raquette n'est plus affiché nulle part : on refuse (échec fermé) au lieu de
  // valider un chiffre qui n'existe plus ; citer `testeurs20` (avis de testeurs) ou une caractéristique.
  if (field.startsWith('profil.')) {
    return "plus aucun profil de raquette n'est affiché sur le site (CLAUDE.md v2.3.1) : citer « testeurs20 » ou une caractéristique";
  }
  const entry = RACQUET_TESTER_RATINGS[r.id];
  switch (field) {
    case 'ra': return { value: r.stiffness };
    case 'poids': return { value: r.weight };
    case 'tamis': return { value: r.headSize };
    case 'plan': return { value: r.stringPattern };
    case 'equilibre': return { value: r.balance };
    case 'swingweight': return { value: r.swingWeight };
    case 'longueur': return { value: r.length };
    case 'prix_eur': return { value: r.price?.europe };
    case 'prix_usd': return { value: r.price?.usa };
    case 'testeurs20': return { value: entry?.docxAverage20, decimals: 1 };
    case 'palier': return { value: entry?.tier };
    case 'rang_testeurs':
      return { value: entry ? competitionRank(rankedRacquets, (x) => x.testerAverage20, (x) => x.racquet.id === r.id) : undefined };
    default: return `champ raquette inconnu : ${field}`;
  }
}

const STRING_RATING_FIELDS: Record<string, keyof TennisString> = {
  controle: 'control', confort: 'comfort', puissance: 'power', effet: 'spin',
  durabilite: 'durability', polyvalence: 'versatility', performance: 'performance', innovation: 'innovation',
};

function stringField(s: TennisString, field: string): Base | string {
  if (STRING_RATING_FIELDS[field]) return { value: s[STRING_RATING_FIELDS[field]] as number | undefined, decimals: 1 };
  const entry = STRING_TESTER_RATINGS[s.id];
  switch (field) {
    case 'rigidite': return { value: s.stiffness };
    case 'type': return { value: s.type };
    case 'tension_min': return { value: s.recommendedTension?.min };
    case 'tension_max': return { value: s.recommendedTension?.max };
    case 'prix_eur': return { value: s.price?.europe };
    case 'prix_usd': return { value: s.price?.usa };
    case 'testeurs20': return { value: entry?.docxAverage20, decimals: 1 };
    case 'palier': return { value: entry?.tier };
    case 'rang_testeurs':
      return { value: entry ? competitionRank(rankedStrings, (x) => STRING_TESTER_RATINGS[x.id].docxAverage20, (x) => x.id === s.id) : undefined };
    default: return `champ cordage inconnu : ${field}`;
  }
}

function resolve(subject: string, field: string): Base | string {
  const [kind, ...rest] = subject.trim().split(/\s+/);
  if (kind === 'raquette') {
    const r = racquetsDatabase.find((x) => x.id === rest[0]);
    return r ? racquetField(r, field) : `raquette inconnue : ${rest[0]} (id de src/data/racquets-database.ts)`;
  }
  if (kind === 'cordage') {
    const s = stringsDatabase.find((x) => x.id === rest[0]);
    return s ? stringField(s, field) : `cordage inconnu : ${rest[0]} (id de src/data/strings-database.ts)`;
  }
  if (kind === 'rcs') {
    const m = rest.join(' ').match(/^(\S+)\s*\+\s*(\S+)\s*@\s*([\d.,]+)$/);
    if (!m || field !== 'rcs') return 'syntaxe : rcs <raquette> + <cordage> @ <tension kg> | rcs | <valeur>';
    const r = racquetsDatabase.find((x) => x.id === m[1]);
    const s = stringsDatabase.find((x) => x.id === m[2]);
    if (!r || !s) return `montage inconnu : ${!r ? m[1] : m[2]}`;
    const note = r.stiffness == null ? ` (RA absent : ${effectiveRacquetRA(r)} par défaut, à dire dans l'article)` : '';
    return { value: calculateRCS(effectiveRacquetRA(r), s.stiffness, Number(m[3].replace(',', '.'))), nature: note || undefined };
  }
  return `sujet inconnu : « ${kind} » (raquette, cordage ou rcs)`;
}

const md = readFileSync(file, 'utf8');
const blocks = [...md.matchAll(/```valeurs-produit\s*\n([\s\S]*?)```/g)].map((m) => m[1]);
if (blocks.length === 0) {
  console.error(`${file} : aucun bloc \`\`\`valeurs-produit — le fact-check ne peut pas être outillé`);
  process.exit(2);
}

let failures = 0;
let checked = 0;
const natures = new Map<string, string[]>();

for (const raw of blocks.join('\n').split(/\r?\n/)) {
  const line = raw.replace(/#.*$/, '').trim();
  if (!line) continue;
  const cols = line.split('|').map((c) => c.trim());
  if (cols.length < 3) {
    failures++;
    console.log(`  ECHEC « ${line} » : 3 colonnes attendues (sujet | champ | valeur citée)`);
    continue;
  }
  const [subject, field, cited] = cols;
  checked++;
  const base = resolve(subject, field);
  if (typeof base === 'string') {
    failures++;
    console.log(`  ECHEC ${subject} | ${field} : ${base}`);
    continue;
  }
  const absentInBase = base.value === null || base.value === undefined || base.value === '';
  let verdict: string | null = null;
  if (ABSENT.test(cited)) {
    if (!absentInBase) verdict = `la base a une valeur (${base.value}) : l'écrire, pas « ${cited} »`;
  } else if (absentInBase) {
    verdict = `la base n'a pas cette donnée : « ${cited} » est une valeur comblée (règle 3) — écrire « non publié »`;
  } else if (typeof base.value === 'number') {
    const num = Number(cited.replace(/\s/g, '').replace(',', '.').replace(/[^\d.+-]/g, ''));
    const decimals = (cited.replace(',', '.').split('.')[1] ?? '').replace(/\D/g, '').length;
    if (Number.isNaN(num)) verdict = `« ${cited} » n'est pas un nombre`;
    else if (decimals < (base.decimals ?? 0)) verdict = `écrire ${base.decimals} décimale(s), comme la fiche (base : ${base.value})`;
    else if (Math.abs(num - base.value) > 0.5 * 10 ** -decimals + 1e-9) verdict = `base : ${base.value}`;
  } else if (String(base.value).toLowerCase() !== cited.toLowerCase()) {
    verdict = `base : ${base.value}`;
  }
  if (base.nature && subject.startsWith('raquette') && field.startsWith('profil.')) {
    const id = subject.split(/\s+/)[1];
    natures.set(base.nature, [...new Set([...(natures.get(base.nature) ?? []), id])]);
  }
  if (verdict) {
    failures++;
    console.log(`  ECHEC ${subject} | ${field} | ${cited} — ${verdict}`);
  } else {
    console.log(`  OK    ${subject} | ${field} | ${cited}${base.nature && !field.startsWith('profil.') ? base.nature : ''}`);
  }
}

if (natures.size > 1) {
  failures++;
  console.log('  ECHEC profils de natures différentes dans le même article (charte F2) :');
  for (const [nature, ids] of natures) console.log(`          ${nature} : ${ids.join(', ')}`);
} else if (natures.size === 1) {
  const [nature] = [...natures.keys()];
  console.log(`  INFO  tous les profils cités sont de nature « ${nature} » — à dire dans l'article`);
}

if (checked === 0) {
  console.log("  AVERT aucune valeur listée — l'article ne cite-t-il vraiment aucune valeur produit (tableaux compris) ?");
}
console.log(`\n${checked} valeur(s) contrôlée(s), ${failures} écart(s)`);
process.exit(failures === 0 ? 0 : 1);
