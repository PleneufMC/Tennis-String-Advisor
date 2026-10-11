/**
 * Empreinte de la grille complète du contrôle 5 (129 raquettes × 179 cordages × 6 tensions, profils standard et sensible) et des données,
 * pour PROUVER qu'un changement ne modifie aucune valeur affichée : exécuté sur deux états du dépôt, les empreintes doivent être égales.
 *   npx tsx scripts/scraper/c2-empreinte-grille.mts          (depuis la racine de l'état à mesurer)
 * Comparer deux états : `git archive <commit> | tar -x -C <dossier>`, y relier node_modules, puis lancer le script DEPUIS chaque racine
 * (`cd <dossier> && npx tsx <chemin>/c2-empreinte-grille.mts`) : l'alias `@/` des modules suit le tsconfig du dossier courant, lancer depuis
 * un autre dossier mélangerait deux états. Hors ligne ; ne lit que src/.
 * Empreintes : `sha256Grille` = RCS, recommandation et RCS avancé (deux profils) de chaque combinaison ; `sha256CordagesHorsChampsD1` =
 * les fiches sans `stiffnessByGauge` ni `stiffnessByGaugeSuspect` ; `sha256Raquettes`. Un changement de rigidité modifie la première.
 */
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const load = (rel: string) => import(pathToFileURL(path.join(root, rel)).href);
const [sdb, rdb, adv, rs] = await Promise.all([load('src/data/strings-database.ts'), load('src/data/racquets-database.ts'), load('src/lib/advanced-rcs.ts'), load('src/lib/racquet-scoring.ts')]);
const { stringsDatabase, calculateRCS, getStringRecommendation } = sdb;
const { racquetsDatabase } = rdb;
const { calculateAdvancedRcs, stringTypeToFamily } = adv;
const { effectiveRacquetRA } = rs;

const sha = (x: string) => createHash('sha256').update(x).digest('hex');
const isArm = (w: string) => /bras|elbow/i.test(w);
const D1_FIELDS = new Set(['stiffnessByGauge', 'stiffnessByGaugeSuspect']);
const grid = createHash('sha256');
let combos = 0, standard = 0, sensitive = 0;
for (const s of stringsDatabase) for (const r of racquetsDatabase) for (const t of [18, 20, 22, 24, 26, 28]) {
  const rcs = calculateRCS(effectiveRacquetRA(r), s.stiffness, t);
  const input = {
    racquetStiffness: effectiveRacquetRA(r), racquetWeight: r.weight, racquetHeadSize: r.headSize,
    mainStringStiffness: s.stiffness, mainStringFamily: stringTypeToFamily(s.type),
    mainRatings: { control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability },
    mainTension: t,
  };
  const std = calculateAdvancedRcs({ ...input, profile: { armSensitive: false } });
  const sen = calculateAdvancedRcs({ ...input, profile: { armSensitive: true } });
  grid.update(JSON.stringify([s.id, r.id, t, rcs, getStringRecommendation(rcs), std, sen]));
  combos++;
  if (std.warnings.some(isArm)) standard++;
  if (sen.warnings.some(isArm)) sensitive++;
}
const withoutD1 = stringsDatabase.map((s: Record<string, unknown>) => Object.fromEntries(Object.entries(s).filter(([k]) => !D1_FIELDS.has(k))));
console.log(JSON.stringify({
  racine: root,
  combinaisons: combos,
  alerteStandard: `${((standard / combos) * 100).toFixed(2)} % (${standard})`,
  alerteSensible: `${((sensitive / combos) * 100).toFixed(2)} % (${sensitive})`,
  sha256Grille: grid.digest('hex'),
  sha256CordagesHorsChampsD1: sha(JSON.stringify(withoutD1)),
  sha256Raquettes: sha(JSON.stringify(racquetsDatabase)),
  fichesAvecChampsD1: stringsDatabase.filter((s: Record<string, unknown>) => 'stiffnessByGauge' in s).length,
}, null, 1));
