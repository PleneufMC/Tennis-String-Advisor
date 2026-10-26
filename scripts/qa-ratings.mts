/**
 * Garde-fou de cohérence de la NOTATION (raquettes + cordages).
 *
 * Créé après l'audit du 8 août 2026, qui a mis au jour quatre défauts que
 * rien n'empêchait de réapparaître silencieusement :
 *
 *   1. Deux valeurs par défaut de RA différentes pour la même raquette
 *      (`|| 65` et `?? 63` dans le même fichier).
 *   2. Des seuils de verdict inatteignables : « configuration très
 *      confortable » sortait dans 0,0 % des cas, et 43,9 % des utilisateurs
 *      recevaient une alerte bras — les seuils avaient été écrits pour une
 *      échelle RCS puis appliqués à une autre.
 *   3. Deux modules donnant des verdicts d'alerte bras contradictoires sur
 *      le même setup.
 *   4. Des barres d'affichage bornées hors de la plage réelle des données
 *      (RA sur 0-80 pour des valeurs 55-72, prix cordage sur 0-50 € pour
 *      des valeurs allant jusqu'à 65 €).
 *
 * Ce script échoue (exit 1) si l'un de ces défauts revient. Il ne teste pas
 * des valeurs « attendues » figées : il MESURE la distribution réelle et
 * vérifie des propriétés structurelles (atteignabilité, monotonie, bornes).
 *
 * Usage : npm run audit:ratings
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import ts from 'typescript';
// @ts-ignore -- module JS sans déclaration de types (générateur du catalogue EN, C3)
import { buildCatalog, serializeCatalog, CATALOG_JSON_PATH } from './catalog/catalog-json.mjs';
import { racquetsDatabase, calculateCompatibility } from '../src/data/racquets-database';
import {
  stringsDatabase,
  calculateRCS,
  getStringRecommendation,
  LEGACY_STRING_ALIASES,
  REMOVED_STRING_IDS,
  meetsMinRating,
  compareOptionalDesc,
  stringStiffnessAt,
  STIFFNESS_UNMEASURED_LABEL,
} from '../src/data/strings-database';
import {
  STRING_TESTER_RATINGS,
  TESTER_RATINGS_SOURCE,
  FIELD_TO_CRITERION,
  ANCHOR_SHIFT,
  harmonizedRating,
  type HarmonizedField,
  type TesterCriterion,
} from '../src/data/tester-ratings';
import { COMFORT_RECALIBRATED, COMFORT_RECALIBRATION_RULE } from '../src/data/comfort-recalibration';
import { calculateAdvancedRcs, stringTypeToFamily } from '../src/lib/advanced-rcs';
import {
  DEFAULT_RACQUET_RA,
  RA_RANGE,
  ADULT_WEIGHT_RANGE,
  JUNIOR_WEIGHT_RANGE,
  STRING_COUNT_RANGE,
  effectiveRacquetRA,
  deriveRacquetProfile,
  racquetsForComparison,
  racquetTesterSynthesis,
  formatScore20,
  rankRacquetsByTesterAverage,
  stringCount,
  linearScore,
  TESTER_SYNTHESIS_LABEL,
  PROFILE_BASIS_PREFIX,
} from '../src/lib/racquet-scoring';
import {
  RACQUET_TESTER_RATINGS,
  RACQUET_TESTER_QUARANTINE,
  RACQUET_TESTER_SOURCE,
  RACQUET_AXIS_TO_CRITERION,
  RACQUET_DISPLAYED_CRITERIA,
  type RacquetTesterCriterion,
} from '../src/data/racquet-tester-ratings';

const TENSIONS = [18, 20, 22, 24, 26, 28];
const failures: string[] = [];
const notes: string[] = [];

const fail = (msg: string) => failures.push(msg);
const ok = (msg: string) => notes.push(`  ok   ${msg}`);

// ---------------------------------------------------------------------------
// 1. Le RA par défaut (convention) reste à ±1 de la médiane MESURÉE, et unique.
// ---------------------------------------------------------------------------
{
  const published = racquetsDatabase
    .map((r) => r.stiffness)
    .filter((v): v is number => typeof v === 'number')
    .sort((a, b) => a - b);
  const median = published[Math.floor(published.length / 2)];

  // Le RA par défaut est une CONVENTION du site (64, non mesurée), choisie le 08/08/2026 comme médiane des RA publiés. Elle doit
  // rester à ±1 de la médiane mesurée : la médiane oscille entre 64 et 65 au gré des corrections de RA sur mesure L1 (65 depuis les
  // hausses V8 Pro et Ripstick du 23/10/2026 ; deux baisses en attente la ramèneraient à 64). Au-delà d'un point, l'arbitrage est
  // rouvert (avis d'Opus 5.5 du 26/10/2026, R4 de la revue de #152). Recaler à 65 élèverait l'indice des 29 raquettes sans RA, toutes
  // juniors (+319 alertes standard, +841 bras sensible, +377 compatibilité sur 31 146 montages), sans rien savoir de nouveau sur elles.
  const DEFAULT_RA_BAND = 1;
  const defaultRaVerdict = (defaultRa: number, ras: readonly number[]): string | null => {
    const sorted = ras.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
    if (sorted.length === 0) return 'aucun RA publié : médiane indéfinie';
    const m = sorted[Math.floor(sorted.length / 2)];
    if (!Number.isFinite(defaultRa)) return `RA par défaut non fini (${defaultRa})`;
    const gap = Math.abs(defaultRa - m);
    return gap <= DEFAULT_RA_BAND
      ? null
      : `DEFAULT_RACQUET_RA = ${defaultRa} à ${gap} points de la médiane mesurée des ${sorted.length} RA publiés (${m}) : ` +
          `au-delà de ±${DEFAULT_RA_BAND}, rouvrir l'arbitrage de la convention (lib/racquet-scoring.ts)`;
  };
  const verdict = defaultRaVerdict(DEFAULT_RACQUET_RA, published);
  if (verdict !== null) {
    fail(verdict);
  } else {
    ok(
      `RA par défaut ${DEFAULT_RACQUET_RA} (convention du site), médiane mesurée ${median} sur ${published.length} raquettes : ` +
        `écart ${Math.abs(DEFAULT_RACQUET_RA - median)}, dans la bande ±${DEFAULT_RA_BAND}`
    );
  }
  if (RA_RANGE.median !== DEFAULT_RACQUET_RA) {
    fail(`RA_RANGE.median = ${RA_RANGE.median} ≠ DEFAULT_RACQUET_RA = ${DEFAULT_RACQUET_RA} : le comparateur afficherait une autre valeur par défaut que celle du calcul`);
  } else {
    ok(`RA_RANGE.median = DEFAULT_RACQUET_RA (${DEFAULT_RACQUET_RA}), valeur citée par le comparateur`);
  }
  // Tests négatifs : un écart de 2 points, dans un sens ou dans l'autre, une valeur non finie et une base vide doivent échouer ;
  // un écart de 0 ou 1 point doit passer (témoins). La base réelle, déplacée de ±2 points, doit aussi échouer.
  {
    const shifted = (d: number) => published.map((v) => v + d);
    const negatives: Array<[string, number, readonly number[]]> = [
      ['médiane 66, défaut 64', 64, [60, 64, 66, 66, 72]],
      ['médiane 62, défaut 64', 64, [57, 60, 62, 64, 70]],
      ['base réelle +2', DEFAULT_RACQUET_RA, shifted(DEFAULT_RACQUET_RA + 2 - median)],
      ['base réelle −2', DEFAULT_RACQUET_RA, shifted(DEFAULT_RACQUET_RA - 2 - median)],
      ['défaut NaN', Number.NaN, published],
      ['base vide', DEFAULT_RACQUET_RA, []],
    ];
    const witnesses: Array<[string, number, readonly number[]]> = [
      ['médiane 65, défaut 64', 64, [60, 64, 65, 66, 72]],
      ['médiane 63, défaut 64', 64, [57, 62, 63, 64, 70]],
      ['médiane 64, défaut 64', 64, [57, 63, 64, 66, 70]],
    ];
    const missed = negatives.filter(([, d, ras]) => defaultRaVerdict(d, ras) === null).map(([n]) => n);
    const refused = witnesses.filter(([, d, ras]) => defaultRaVerdict(d, ras) !== null).map(([n]) => n);
    if (missed.length > 0 || refused.length > 0) {
      fail(`contrôle 1, bande ±${DEFAULT_RA_BAND} : tests négatifs non détectés [${missed.join(' ; ')}], témoins refusés [${refused.join(' ; ')}]`);
    } else {
      ok(`contrôle 1, bande ±${DEFAULT_RA_BAND} : ${negatives.length} tests négatifs détectés, ${witnesses.length} témoins acceptés`);
    }
  }

  if (RA_RANGE.min !== published[0] || RA_RANGE.max !== published[published.length - 1]) {
    fail(
      `RA_RANGE = {min:${RA_RANGE.min}, max:${RA_RANGE.max}} ne correspond plus aux ` +
        `données réelles {min:${published[0]}, max:${published[published.length - 1]}}. ` +
        `Les barres d'affichage seraient mal cadrées.`
    );
  } else {
    ok(`RA_RANGE colle aux données (${RA_RANGE.min}-${RA_RANGE.max})`);
  }

  // Aucune raquette ne doit ressortir avec un RA absent après normalisation.
  const unresolved = racquetsDatabase.filter((r) => !Number.isFinite(effectiveRacquetRA(r)));
  if (unresolved.length > 0) {
    fail(`${unresolved.length} raquette(s) sans RA exploitable après effectiveRacquetRA().`);
  } else {
    ok('effectiveRacquetRA() renvoie une valeur finie pour les 129 raquettes');
  }
}

// ---------------------------------------------------------------------------
// 2. Aucune valeur par défaut de RA concurrente ne doit réapparaître.
// ---------------------------------------------------------------------------
{
  const fs = await import('node:fs/promises');
  const files = [
    'src/app/configurator/page.tsx',
    'src/app/compare/page.tsx',
    'src/lib/pdf-configuration-data.ts',
    'src/data/racquets-database.ts',
  ];
  // Motifs du type `stiffness || 65` / `stiffness ?? 63` : chaque littéral
  // codé en dur est une seconde source de vérité en puissance.
  const pattern = /stiffness\s*(\|\||\?\?)\s*(\d+)/g;
  for (const f of files) {
    const src = await fs.readFile(f, 'utf-8');
    for (const m of src.matchAll(pattern)) {
      const literal = Number(m[2]);
      if (literal !== DEFAULT_RACQUET_RA) {
        fail(
          `${f} contient « ${m[0]} » : valeur de repli codée en dur (${literal}) ` +
            `différente de DEFAULT_RACQUET_RA (${DEFAULT_RACQUET_RA}). ` +
            `Utiliser effectiveRacquetRA().`
        );
      }
    }
  }
  if (failures.length === 0) ok('aucun repli RA codé en dur divergent');
}

// ---------------------------------------------------------------------------
// 3. Le profil dérivé doit rester centré (pas de calibrage qui écrase tout).
// ---------------------------------------------------------------------------
{
  const profiles = racquetsDatabase.map((r) => deriveRacquetProfile(r));
  const axes = ['power', 'control', 'comfort', 'maneuverability', 'stability'] as const;
  for (const axis of axes) {
    const vals = profiles.map((p) => p[axis]);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (mean < 3.5 || mean > 6.5) {
      fail(
        `Profil dérivé « ${axis} » : moyenne ${mean.toFixed(2)}/10 hors de la plage ` +
          `saine 3,5-6,5. Un calibrage déséquilibré fait passer des raquettes ` +
          `courantes pour mauvaises (cas vécu : 300 g noté 2,1/10 en maniabilité).`
      );
    }
    if (Math.min(...vals) === Math.max(...vals)) {
      fail(`Profil dérivé « ${axis} » : toutes les raquettes ont la même note — axe inutile.`);
    }
  }
  if (!failures.some((f) => f.includes('Profil dérivé'))) {
    ok('profil dérivé centré et discriminant sur les 5 axes');
  }
}

// ---------------------------------------------------------------------------
// 4. Tous les verdicts de calculateCompatibility doivent être ATTEIGNABLES.
// ---------------------------------------------------------------------------
{
  // `recommendation` est une CHAÎNE de phrases (verdict de fermeté, puis des
  // remarques sur le poids, la tension, la raquette). Regrouper sur la chaîne
  // entière produisait ~24 « verdicts » dont beaucoup à 0,1 % — un faux positif
  // du garde-fou lui-même. Seule la PREMIÈRE phrase est le verdict de fermeté.
  const buckets = new Map<string, number>();
  let total = 0;
  let armWarnings = 0;
  for (const r of racquetsDatabase) {
    for (const s of stringsDatabase) {
      for (const t of TENSIONS) {
        const res = calculateCompatibility(r, s.stiffness, t);
        const verdict = res.recommendation.split('.')[0].trim();
        buckets.set(verdict, (buckets.get(verdict) ?? 0) + 1);
        total++;
        if (/tennis elbow|problèmes de bras/i.test(res.recommendation)) armWarnings++;
      }
    }
  }
  // 5 verdicts sont écrits dans la fonction : les 5 doivent sortir.
  const EXPECTED_BUCKETS = 5;
  if (buckets.size < EXPECTED_BUCKETS) {
    fail(
      `calculateCompatibility ne produit que ${buckets.size} verdicts distincts sur ` +
        `${EXPECTED_BUCKETS} écrits : certains seuils sont mathématiquement ` +
        `inatteignables (défaut historique : « très confortable » sortait 0 fois).`
    );
  }
  // Critère d'atteignabilité : PAS une part minimale du total.
  //
  // Un verdict extrême (« très rigide, risque de tennis elbow ») DOIT être rare
  // en part de combinaisons — c'est le signe qu'il discrimine. Le seuil global
  // de 2 % que j'avais posé au départ signalait à tort ce verdict à 1,96 %,
  // ce qui aurait poussé à élargir l'alerte bras... l'inverse du but recherché.
  //
  // La bonne question est celle que se pose l'utilisateur : « MA raquette peut-elle
  // produire ce verdict ? ». On vérifie donc qu'une part significative du parc
  // peut y accéder, et non que le verdict soit fréquent.
  for (const [verdict, count] of buckets) {
    if (count === 0) {
      fail(`Verdict jamais produit : « ${verdict.slice(0, 60)}… » — seuil inatteignable.`);
    }
  }
  const verdictOf = (r: (typeof racquetsDatabase)[number], sStiff: number, t: number) =>
    calculateCompatibility(r, sStiff, t).recommendation.split('.')[0].trim();
  for (const verdict of buckets.keys()) {
    let racquetsAble = 0;
    for (const r of racquetsDatabase) {
      let able = false;
      for (const s of stringsDatabase) {
        for (const t of TENSIONS) {
          if (verdictOf(r, s.stiffness, t) === verdict) {
            able = true;
            break;
          }
        }
        if (able) break;
      }
      if (able) racquetsAble++;
    }
    const share = (racquetsAble / racquetsDatabase.length) * 100;
    if (share < 25) {
      fail(
        `Verdict « ${verdict.slice(0, 55)}… » accessible à seulement ${racquetsAble}/` +
          `${racquetsDatabase.length} raquettes (${share.toFixed(0)} %) : pour la plupart ` +
          `des joueurs, aucun cordage ni aucune tension ne permet de l'atteindre.`
      );
    }
  }
  // Seuil à 30 % : les deux paliers les plus rigides sont TOUS DEUX des alertes
  // bras. Égaliser les 5 buckets à 20 % chacun laissait donc mécaniquement 40 %
  // d'alertes — c'est exactement l'erreur commise lors du premier recalibrage.
  const armShare = (armWarnings / total) * 100;
  if (armShare > 30) {
    fail(
      `calculateCompatibility alerte sur le bras dans ${armShare.toFixed(1)} % des cas : ` +
        `au-delà de 30 %, l'avertissement perd son sens (fatigue d'alerte). ` +
        `Attention : équilibrer les 5 verdicts ne suffit pas, les deux paliers ` +
        `les plus rigides sont tous deux des alertes.`
    );
  }
  ok(
    `calculateCompatibility : ${buckets.size} verdicts tous atteignables, ` +
      `alerte bras ${armShare.toFixed(1)} % (${total} combinaisons)`
  );
}

// ---------------------------------------------------------------------------
// 5. L'alerte bras du module avancé doit être atteignable ET monotone.
// ---------------------------------------------------------------------------
{
  const rate = (armSensitive: boolean) => {
    let n = 0;
    let warn = 0;
    for (const r of racquetsDatabase) {
      const ra = effectiveRacquetRA(r);
      for (const s of stringsDatabase) {
        const fam = stringTypeToFamily(s.type);
        for (const t of TENSIONS) {
          const adv = calculateAdvancedRcs({
            racquetStiffness: ra,
            racquetWeight: r.weight,
            racquetHeadSize: r.headSize,
            mainStringStiffness: s.stiffness,
            mainStringFamily: fam,
            mainRatings: {
              control: s.control,
              comfort: s.comfort,
              spin: s.spin,
              power: s.power,
              durability: s.durability,
            },
            mainTension: t,
            profile: { armSensitive },
          });
          n++;
          if (adv.warnings.some((w) => /bras|elbow/i.test(w))) warn++;
        }
      }
    }
    return (warn / n) * 100;
  };

  const standard = rate(false);
  const sensitive = rate(true);

  if (standard < 2) {
    fail(
      `Alerte bras (profil standard) : ${standard.toFixed(2)} % — seuil quasi mort. ` +
        `Un setup réellement rigide doit déclencher un avertissement.`
    );
  }
  if (sensitive > 45) {
    fail(
      `Alerte bras (profil sensible) : ${sensitive.toFixed(1)} % — trop fréquente, ` +
        `l'avertissement ne veut plus rien dire (défaut historique : 47,7 %).`
    );
  }
  if (sensitive <= standard) {
    fail(
      `Échelle non monotone : profil sensible ${sensitive.toFixed(1)} % <= profil ` +
        `standard ${standard.toFixed(1)} %. Un joueur sensible du bras doit être ` +
        `alerté AU MOINS aussi souvent.`
    );
  }
  ok(`alerte bras avancée : standard ${standard.toFixed(2)} %, sensible ${sensitive.toFixed(2)} % (monotone)`);

  // Cas témoin : le setup le plus rigide du catalogue DOIT alerter.
  const hardestR = [...racquetsDatabase].sort((a, b) => (b.stiffness ?? 0) - (a.stiffness ?? 0))[0];
  const hardestS = [...stringsDatabase].sort((a, b) => b.stiffness - a.stiffness)[0];
  const worst = calculateAdvancedRcs({
    racquetStiffness: effectiveRacquetRA(hardestR),
    racquetWeight: hardestR.weight,
    racquetHeadSize: hardestR.headSize,
    mainStringStiffness: hardestS.stiffness,
    mainStringFamily: stringTypeToFamily(hardestS.type),
    mainRatings: {
      control: hardestS.control,
      comfort: hardestS.comfort,
      spin: hardestS.spin,
      power: hardestS.power,
      durability: hardestS.durability,
    },
    mainTension: 28,
  });
  if (!worst.warnings.some((w) => /bras|elbow/i.test(w))) {
    fail(
      `Cas témoin muet : ${hardestR.brand} ${hardestR.model} (RA ${hardestR.stiffness}) + ` +
        `${hardestS.model} (${hardestS.stiffness} lb/in) à 28 kg — le setup le plus ` +
        `rigide du catalogue ne déclenche AUCUNE alerte bras.`
    );
  } else {
    ok(`cas témoin le plus rigide : alerte bien émise (indice ${worst.rcs})`);
  }
}

// ---------------------------------------------------------------------------
// 6. Les bornes d'affichage doivent contenir les données réelles.
// ---------------------------------------------------------------------------
{
  const fs = await import('node:fs/promises');
  const src = await fs.readFile('src/app/compare/page.tsx', 'utf-8');

  const realMax = {
    'Poids (g)': Math.max(...racquetsDatabase.map((r) => r.weight)),
    'Taille tamis (in²)': Math.max(...racquetsDatabase.map((r) => r.headSize)),
  } as const;

  for (const [label, max] of Object.entries(realMax)) {
    const re = new RegExp(
      `label="${label.replace(/[()²]/g, (c) => `\\${c}`)}"[\\s\\S]{0,320}?maxValue=\\{(\\d+)\\}`
    );
    const m = src.match(re);
    if (!m) {
      fail(`Barre « ${label} » introuvable dans /compare : garde-fou à mettre à jour.`);
      continue;
    }
    if (Number(m[1]) < max) {
      fail(
        `/compare barre « ${label} » : maxValue=${m[1]} < maximum réel ${max}. ` +
          `La barre déborderait et serait rognée en silence par overflow-hidden.`
      );
    }
  }

  // La barre RA est bornée par `RA_RANGE` (constante, pas un littéral) : on
  // vérifie que le lien symbolique est bien en place plutôt qu'un chiffre
  // codé en dur, qui se désynchroniserait des données.
  if (!/label="Rigidité \(RA\)"[\s\S]{0,320}?maxValue=\{RA_RANGE\.max\}/.test(src)) {
    fail(
      `/compare barre « Rigidité (RA) » : la borne haute doit être RA_RANGE.max ` +
        `(lib/racquet-scoring), pas un littéral — c'est ce découplage qui avait ` +
        `laissé passer maxValue={80} pour des données allant de 55 à 72.`
    );
  }

  // Le prix des cordages était le cas concret : borne 50 € pour des données à 65 €.
  // Prix optionnel depuis l'option A (29/09/2026) : maximum sur les prix présents.
  const stringMax = Math.max(
    ...stringsDatabase.map((s) => s.price?.europe).filter((p): p is number => p !== undefined),
  );
  const priceBars = [...src.matchAll(/maxValue=\{(\d+)\}[\s\S]{0,120}?unit=" €"/g)].map((m) => Number(m[1]));
  if (priceBars.length > 0 && !priceBars.some((v) => v >= stringMax)) {
    fail(
      `/compare : aucune barre de prix ne couvre le maximum cordage réel ${stringMax} € ` +
        `(bornes trouvées : ${priceBars.join(', ')}).`
    );
  }
  if (!failures.some((f) => f.includes('/compare'))) {
    ok(`bornes d'affichage /compare cohérentes avec les données (prix cordage max ${stringMax} €)`);
  }
}

// ---------------------------------------------------------------------------
// 6bis. Cohérence interne des fiches : la longueur doit s'accorder avec la
//       catégorie. Détecté le 8 août 2026 : deux Wilson Ultra juniors (25" et
//       26", `variant` disant « Junior ») étaient classées « Power ». Notées
//       sur l'échelle de poids ADULTE, elles ressortaient à 9,0/10 en
//       maniabilité et 1,0/10 en stabilité, valeurs absurdes pour des
//       raquettes d'enfant. Aucune source externe n'est nécessaire pour
//       détecter ce genre de faute : la fiche se contredit elle-même.
// ---------------------------------------------------------------------------
{
  const mismatched = racquetsDatabase.filter((r) => {
    const len = (r as { length?: number }).length;
    if (typeof len !== 'number' || len <= 0) return false;
    return len < 27 !== (r.category === 'Junior');
  });
  if (mismatched.length > 0) {
    for (const r of mismatched) {
      fail(
        `Fiche incohérente : ${r.id} a length=${(r as { length?: number }).length}" ` +
          `mais category="${r.category}". Une raquette de moins de 27" est une junior ` +
          `par définition ; l'incohérence fausse l'échelle de poids du profil dérivé.`
      );
    }
  } else {
    ok('longueur et catégorie cohérentes sur toutes les fiches');
  }

  // Le `variant` mentionnant « Junior » doit lui aussi s'accorder.
  const variantMismatch = racquetsDatabase.filter((r) => {
    const v = (r as { variant?: string }).variant ?? '';
    return /junior/i.test(v) && r.category !== 'Junior';
  });
  for (const r of variantMismatch) {
    fail(`Fiche incohérente : ${r.id} variant="${(r as { variant?: string }).variant}" mais category="${r.category}".`);
  }
}

// ---------------------------------------------------------------------------
// 7. Pas de seconde fonction de compatibilité homonyme.
// ---------------------------------------------------------------------------
{
  const fs = await import('node:fs/promises');
  const utils = await fs.readFile('src/lib/utils.ts', 'utf-8');
  if (/export\s+function\s+calculateCompatibility/.test(utils)) {
    fail(
      `lib/utils.ts réexporte une fonction calculateCompatibility : deux homonymes ` +
        `aux signatures incompatibles constituent un piège à autocomplétion ` +
        `(importer la mauvaise donne des conseils de santé du bras erronés, sans ` +
        `erreur de compilation).`
    );
  } else {
    ok('une seule calculateCompatibility dans le code (data/racquets-database.ts)');
  }
}

// ---------------------------------------------------------------------------
// 8. ÉCHELLE RCS — paliers atteignables et parité avec le moteur statique
// ---------------------------------------------------------------------------
// Deux défauts que ce bloc rend impossibles à réintroduire silencieusement :
//
// a) Un palier publié inatteignable. Jusqu'au 14/08/2026, « ≥ 35 : très ferme,
//    risque tennis elbow » ne pouvait JAMAIS s'afficher (maximum réel 34) : le
//    signal de sécurité qui justifie l'existence du RCS était mort, et rien ne
//    le détectait. Ce script testait l'atteignabilité des verdicts de
//    `calculateCompatibility`, mais pas ceux de `getStringRecommendation`.
//
// b) La divergence FR/EN. Le moteur statique `public/js/rcs-calculator*.js`
//    sert 3 pages anglaises et était resté figé sur une calibration de janvier
//    2026 : un même montage sortait à 28 côté FR et 58 côté EN. Aucun script
//    ne regardait dans `public/js/`.
{
  const TENSIONS = [19, 21, 23, 25, 27, 29];
  const values: number[] = [];
  for (const r of racquetsDatabase) {
    const ra = effectiveRacquetRA(r);
    for (const s of stringsDatabase)
      for (const t of TENSIONS) values.push(calculateRCS(ra, s.stiffness, t));
  }

  // a) les 5 paliers publiés doivent tous être atteignables
  const levels = new Map<string, number>();
  for (const v of values) {
    const l = getStringRecommendation(v).level;
    levels.set(l, (levels.get(l) ?? 0) + 1);
  }
  const EXPECTED = ['Très Confortable', 'Confortable', 'Standard', 'Ferme', 'Très Ferme'];
  const dead = EXPECTED.filter((l) => (levels.get(l) ?? 0) === 0);
  if (dead.length > 0) {
    fail(
      `paliers RCS inatteignables : ${dead.join(', ')}. getStringRecommendation ` +
        `annonce une graduation qu'aucune combinaison réelle ne produit ` +
        `(plage observée ${Math.min(...values)}-${Math.max(...values)}).`
    );
  } else {
    const top = ((levels.get('Très Ferme') ?? 0) / values.length) * 100;
    ok(`les 5 paliers RCS publiés sont atteignables (alerte « Très Ferme » : ${top.toFixed(1)} %)`);
  }

  // b) le moteur statique doit renvoyer exactement la même valeur
  const engines = ['public/js/rcs-calculator.js', 'public/js/rcs-calculator-en.js'];
  for (const path of engines) {
    let engine: any;
    try {
      const src = readFileSync(path, 'utf8');
      engine = new Function(
        'window',
        'document',
        `${src}; return typeof RCS !== 'undefined' ? RCS : window.RCS;`
      )({}, { addEventListener() {} });
    } catch (e) {
      fail(`${path} : moteur statique illisible (${(e as Error).message})`);
      continue;
    }
    let diff = 0;
    let sample = '';
    for (const r of racquetsDatabase) {
      const ra = effectiveRacquetRA(r);
      for (const s of stringsDatabase)
        for (const t of TENSIONS) {
          const expected = calculateRCS(ra, s.stiffness, t);
          const got = engine.calculate(ra, s.stiffness, t).rcs;
          if (got !== expected) {
            diff++;
            if (!sample) sample = `RA${ra} + ${s.stiffness} lb/in @ ${t} kg : TS=${expected} vs statique=${got}`;
          }
        }
    }
    if (diff > 0) {
      fail(
        `${path} diverge de calculateRCS sur ${diff} combinaisons (ex. ${sample}). ` +
          `Le site anglais et le site français afficheraient deux indices ` +
          `différents sous le même nom « RCS ».`
      );
    } else {
      ok(`${path} : parité exacte avec calculateRCS (${values.length} combinaisons)`);
    }
  }
}

// c) Le curseur de rigidité du calculateur EN couvre toute la base (22/10/2026). Plafonné à 275 lb/in, il ramenait Luxilon 4G
//    (286,9), RPM Team (280,6) et Revenge (276) à 275 : indice affiché sous-estimé (4G à RA 64 et 24 kg : 37 au lieu de 38). Une
//    rigidité choisie dans la liste ne doit jamais être rabotée par le curseur (règle 2 : l'indice ne baisse pas). Échoue si les
//    bornes du curseur (min, max) n'encadrent pas toutes les rigidités de `src/data`, si une rigidité de la base n'est pas une
//    valeur atteignable au pas du curseur, si le paramètre d'URL « cordage » est borné par des littéraux au lieu des bornes du
//    curseur, si le libellé de la borne haute n'est pas la borne, ou si `CORDAGE_MIN` / `CORDAGE_MAX` d'un moteur statique
//    n'encadrent pas la base. Bornes lues dans `src/data`, jamais recopiées ; tests négatifs sur des copies altérées.
{
  const before = failures.length;
  const PAGE = 'public/en/rcs-calculator.html';
  const ENGINES = ['public/js/rcs-calculator.js', 'public/js/rcs-calculator-en.js'];
  const stiff = stringsDatabase.map((s) => s.stiffness);
  const lo = Math.min(...stiff);
  const hi = Math.max(...stiff);
  const top = stringsDatabase.filter((s) => s.stiffness === hi).map((s) => s.id).join(', ');
  const pageFindings = (html: string): string[] => {
    const out: string[] = [];
    const tag = /<input\b[^>]*\bid="cordageSlider"[^>]*>/.exec(html)?.[0];
    if (!tag) return ['curseur : <input id="cordageSlider"> introuvable'];
    const attr = (n: string): number => Number(new RegExp(`\\b${n}="([^"]*)"`).exec(tag)?.[1]);
    const [min, max, step] = [attr('min'), attr('max'), attr('step')];
    if (!(min <= lo)) out.push(`curseur : min ${min} au-dessus de la plus basse rigidité de la base (${lo})`);
    if (!(max >= hi)) out.push(`curseur : max ${max} sous la plus haute rigidité de la base (${hi}, ${top}) : le curseur la ramène à ${max}, indice sous-estimé`);
    if (!(step > 0)) out.push(`curseur : pas « ${step} » illisible`);
    else {
      const off = stringsDatabase.filter((s) => {
        const k = (s.stiffness - min) / step;
        return Math.abs(k - Math.round(k)) > 1e-6;
      });
      if (off.length > 0) out.push(`curseur : ${off.length} rigidités hors du pas ${step} depuis ${min} (ex. ${off[0].id} ${off[0].stiffness}) : le curseur les arrondit`);
    }
    if (/\bcordage\s*[<>]=?\s*\d/.test(html)) out.push("URL : le paramètre « cordage » est borné par des littéraux : lire les bornes du curseur (cordageSlider.min / .max)");
    const labels = [...html.matchAll(/<span>([\d.]+) \(Stiff Poly\)<\/span>/g)].map((m) => Number(m[1]));
    if (labels.length !== 1 || labels[0] !== max) out.push(`libellé : la borne haute affichée (${labels.join(', ') || 'absente'}) n'est pas le max du curseur (${max})`);
    return out;
  };
  const engineFindings = (path: string, src: string): string[] => {
    try {
      const e = new Function('window', 'document', `${src}; return typeof RCS !== 'undefined' ? RCS : window.RCS;`)({}, { addEventListener() {} });
      const out: string[] = [];
      if (!(e.CORDAGE_MAX >= hi)) out.push(`${path} : CORDAGE_MAX ${e.CORDAGE_MAX} sous la plus haute rigidité de la base (${hi})`);
      if (!(e.CORDAGE_MIN <= lo)) out.push(`${path} : CORDAGE_MIN ${e.CORDAGE_MIN} au-dessus de la plus basse rigidité de la base (${lo})`);
      return out;
    } catch (err) {
      return [`${path} : moteur statique illisible (${(err as Error).message})`];
    }
  };
  const html = readFileSync(PAGE, 'utf8');
  const engineSrcs = ENGINES.map((p) => [p, readFileSync(p, 'utf8')] as const);
  pageFindings(html).forEach((i) => fail(`calculateur EN : ${i}`));
  engineSrcs.flatMap(([p, s]) => engineFindings(p, s)).forEach((i) => fail(`calculateur EN : ${i}`));
  // Tests négatifs (copies altérées) et témoin positif.
  const sub = (s: string, a: string, b: string): string | null => (s.includes(a) ? s.replace(a, b) : null);
  const tagMax = /(<input\b[^>]*\bid="cordageSlider"[^>]*\bmax=")([^"]*)(")/;
  const maxNow = tagMax.exec(html)?.[2] ?? '';
  const PAGE_NEG: Array<[string, string | null, string]> = [
    ['max remis à 275', html.replace(tagMax, '$1275$3'), 'sous la plus haute rigidité'],
    ['pas de 1 lb/in', sub(html, 'step="0.1" value="180"', 'step="1" value="180"'), 'hors du pas'],
    ['borne d\'URL recopiée', sub(html, 'cordage <= Number(cordageSlider.max)', 'cordage <= 275'), 'littéraux'],
    ['libellé de la borne haute périmé', sub(html, `<span>${maxNow} (Stiff Poly)</span>`, '<span>275 (Stiff Poly)</span>'), 'libellé'],
  ];
  let detected = 0;
  for (const [name, mutated, needle] of PAGE_NEG) {
    if (mutated === null || mutated === html) fail(`calculateur EN : prémisse du test négatif « ${name} » fausse (motif absent de ${PAGE})`);
    else if (pageFindings(mutated).some((i) => i.includes(needle))) detected++;
    else fail(`calculateur EN : garde-fou muet sur « ${name} »`);
  }
  for (const [p, src] of engineSrcs) {
    const mutated = src.replace(/(_c: \[54, 72, 63, 88, )[\d.]+(, 18, 30\])/, '$1275$2');
    if (mutated === src) fail(`calculateur EN : prémisse du test négatif « CORDAGE_MAX remis à 275 » fausse (motif absent de ${p})`);
    else if (engineFindings(p, mutated).some((i) => i.includes('CORDAGE_MAX'))) detected++;
    else fail(`calculateur EN : garde-fou muet sur « CORDAGE_MAX remis à 275 » (${p})`);
  }
  const witness = sub(html, '// Bornes lues sur le curseur', '// Bornes lues sur le curseur (min, max)');
  if (witness === null) fail(`calculateur EN : prémisse du témoin positif fausse (commentaire absent de ${PAGE})`);
  else if (pageFindings(witness).length > 0) fail(`calculateur EN : témoin positif « commentaire reformulé » rejeté à tort`);
  if (failures.length === before) {
    ok(`calculateur EN : le curseur de rigidité couvre la base (${lo} à ${hi} lb/in, max ${hi} = ${top}), chaque rigidité au pas du curseur, borne d'URL lue sur le curseur, CORDAGE_MIN/MAX des deux moteurs statiques ; ${detected} tests négatifs détectés, 1 témoin positif accepté`);
  }
}

// Seuils d'alerte bras du configurateur (`calculateAdvancedRcs`), sondés une fois pour les contrôles 9 et 20 : plus petit indice
// qui déclenche l'alerte, sans second filet (aucune note de confort). Au 11/10/2026 : 32 pour un bras sensible, 35 sinon.
const probeArmAlert = (armSensitive: boolean): number | null => {
  for (let st = 60; st <= 400; st++) {
    const adv = calculateAdvancedRcs({
      racquetStiffness: DEFAULT_RACQUET_RA,
      mainStringStiffness: st,
      mainStringFamily: 'polyester',
      mainRatings: {},
      mainTension: 24,
      profile: { armSensitive },
    });
    if (adv.warnings.length > 0) return adv.rcs;
  }
  return null;
};
const ARM_ALERT_SENSITIVE = probeArmAlert(true);
const ARM_ALERT_STANDARD = probeArmAlert(false);

// ---------------------------------------------------------------------------
// 9. ALERTE SANTÉ — aucun profil ne peut la désactiver, aucune surface ne
//    peut afficher un RCS sans chemin vers un avertissement
// ---------------------------------------------------------------------------
// Défaut corrigé le 14/08/2026 : `evaluateForProfile` renvoyait « Configuration
// optimale ✅ » pour un RCS de 40 dès que l'utilisateur cochait le profil
// « Pro » (plage 31-41) — c'est-à-dire en pleine zone « très ferme, risque
// tennis elbow ». L'alerte était désactivée par la personne qu'elle protège.
// Et 3 des 4 surfaces affichant un RCS n'appelaient jamais getHealthWarning.
//
// Complété le 11/10/2026 (règle 2) : le moteur EN n'alertait qu'à 35, même pour un visiteur ayant déclaré une douleur (le
// configurateur EN pose le profil `tennis_elbow` pour « Sensitive arm » et « Fragile shoulder »), alors que l'alerte bras du
// configurateur (`advanced-rcs.ts`) se déclenche dès 32 pour un bras sensible. Les profils à bras sensible déclaré
// (`reeducation`, `tennis_elbow`, `senior`) reçoivent désormais le verdict `risque_sante` dès ce seuil, les autres dès 35.
// Échoue si : (a) un profil, de son seuil à RCS 45, ne reçoit pas `risque_sante` (ou reçoit un verdict favorable) ; (b) le
// drapeau `armSensitive` d'un profil n'est pas celui attendu (la liste des profils sensibles ne dérive pas en silence) ;
// (c) le profil que la page configurateur pose quand le visiteur déclare une douleur n'est pas à bras sensible. Chaque garde
// est rejouée sur des copies altérées du moteur ou de la page.
{
  const engines = ['public/js/rcs-calculator.js', 'public/js/rcs-calculator-en.js'];
  const PROFILS = [
    'reeducation', 'tennis_elbow', 'senior', 'debutant',
    'club', 'confirme', 'competiteur', 'expert', 'pro',
  ];
  // Profils à bras sensible déclaré : alerte dès le seuil « bras sensible » du configurateur. `reeducation` et `senior`
  // ne viennent que du sélecteur de la calculatrice ; `tennis_elbow` est aussi celui du configurateur.
  const SENSIBLES = ['reeducation', 'tennis_elbow', 'senior'];
  const before9 = failures.length;
  const S9 = ARM_ALERT_SENSITIVE;
  const N9 = ARM_ALERT_STANDARD;
  const loadEngine = (src: string): any =>
    new Function('window', 'document', `${src}; return typeof RCS !== 'undefined' ? RCS : window.RCS;`)({}, { addEventListener() {} });
  const replaceFirst = (s: string, find: string | RegExp, replace: string): string | null => {
    const out = s.replace(find, replace);
    return out === s ? null : out;
  };
  // Ce que le moteur laisse passer : pour chaque profil, tout RCS de son seuil à 45 doit recevoir `risque_sante`.
  const leaksOf = (engine: any, S: number, N: number): string[] => {
    const leaks: string[] = [];
    for (const p of PROFILS) {
      const sensible = SENSIBLES.includes(p);
      const flag = engine.getRecommendations?.(p)?.armSensitive;
      if (flag !== sensible) leaks.push(`${p} : armSensitive = ${flag} au lieu de ${sensible}`);
      for (let rcs = sensible ? S : N; rcs <= 45; rcs++) {
        const verdict = engine.evaluateForProfile(rcs, p);
        if (verdict?.isOk !== false || verdict?.status !== 'risque_sante') leaks.push(`${p} @ RCS ${rcs}`);
      }
    }
    return leaks;
  };

  if (S9 === null || N9 === null) {
    fail("alerte santé : seuils d'alerte bras introuvables dans calculateAdvancedRcs (sonde muette)");
  } else {
    let negatives = 0;
    for (const path of engines) {
      let src = '';
      let engine: any;
      try {
        src = readFileSync(path, 'utf8');
        engine = loadEngine(src);
      } catch {
        continue; // l'absence du moteur est déjà signalée par le contrôle 8
      }

      const leaks = leaksOf(engine, S9, N9);
      if (leaks.length > 0) {
        fail(
          `${path} : ${leaks.length} verdict(s) sans alerte ou favorable(s) au-delà du seuil du profil ` +
            `(ex. ${leaks.slice(0, 3).join(', ')}). Aucun profil de joueur ne doit pouvoir transformer un risque tennis elbow ` +
            `en « configuration optimale », et un profil à bras sensible est alerté dès ${S9} (les autres dès ${N9}).`
        );
      } else {
        ok(
          `${path} : aucun profil ne neutralise l'alerte santé (${SENSIBLES.length} profils à bras sensible alertés dès RCS ${S9}, ` +
            `${PROFILS.length - SENSIBLES.length} autres dès ${N9}, jusqu'à RCS 45)`
        );
      }

      if (!engine.getHealthWarning || !engine.getHealthWarning(40)) {
        fail(`${path} : getHealthWarning n'émet aucune alerte à RCS 40.`);
      }

      // Tests négatifs : le moteur altéré doit être refusé.
      const MUTATIONS: Array<[string, string | RegExp, string]> = [
        ['seuil remis à 35 pour tennis_elbow (profil à bras sensible rendu standard)', /('tennis_elbow':[^\n]*armSensitive: )true/, '$1false'],
        ['seuil « bras sensible » du moteur remis à 35', 'HEALTH_ALERT_SENSITIVE_RCS: 32,', 'HEALTH_ALERT_SENSITIVE_RCS: 35,'],
        ['seuil « bras sensible » du moteur décalé à 33', 'HEALTH_ALERT_SENSITIVE_RCS: 32,', 'HEALTH_ALERT_SENSITIVE_RCS: 33,'],
        ['alerte des profils sensibles supprimée', 'if (rec.armSensitive && rcs >= this.HEALTH_ALERT_SENSITIVE_RCS) {', 'if (false) {'],
        ['profil sensible qui perd son drapeau (senior)', /('senior':[^\n]*armSensitive: )true/, '$1false'],
        ['profil standard rendu sensible sans décision (club)', /('club':[^\n]*armSensitive: )false/, '$1true'],
        ['alerte standard décalée à 36', 'HEALTH_ALERT_RCS: 35,', 'HEALTH_ALERT_RCS: 36,'],
      ];
      for (const [name, find, replace] of MUTATIONS) {
        const mutated = replaceFirst(src, find, replace);
        if (mutated === null) {
          fail(`${path} : prémisse du test négatif « ${name} » fausse (motif absent du moteur).`);
          continue;
        }
        let caught = false;
        try {
          caught = leaksOf(loadEngine(mutated), S9, N9).length > 0;
        } catch {
          caught = false; // un moteur altéré illisible ne prouve rien : le test doit échouer bruyamment
        }
        if (caught) negatives++;
        else fail(`${path} : garde-fou muet sur « ${name} » (le moteur altéré passe le contrôle d'alerte).`);
      }
    }
    if (failures.length === before9 && negatives > 0) ok(`alerte santé par profil : ${negatives} tests négatifs détectés (seuil remis à 35 pour tennis_elbow, drapeau perdu, alerte supprimée, seuils décalés)`);
  }

  // Les surfaces qui affichent un RCS doivent avoir un chemin vers une alerte.
  const SURFACES = [
    'public/en/configurator.html',
    'public/en/rcs-calculator.html',
  ];
  for (const surface of SURFACES) {
    let html = '';
    try {
      html = readFileSync(surface, 'utf8');
    } catch {
      fail(`${surface} : surface introuvable.`);
      continue;
    }
    if (!html.includes('getHealthWarning')) {
      fail(
        `${surface} affiche un RCS sans jamais appeler getHealthWarning : ` +
          `un utilisateur peut y lire un score en zone de risque sans aucun avertissement.`
      );
    } else {
      ok(`${surface} : chemin d'appel vers l'alerte santé présent`);
    }
  }

  // (c) Le profil que le configurateur EN pose quand le visiteur déclare une douleur (« Sensitive arm », « Fragile shoulder »)
  //     doit être un profil à bras sensible : sinon l'alerte dès le seuil « bras sensible » ne s'appliquerait à personne.
  if (S9 !== null) {
    const declared = (html: string): { profile: string | null; shoulderSharesBranch: boolean } => {
      const m = /currentSelections\.physical === 'bras'[\s\S]{0,1500}?rcsProfile = '([a-z_]+)'/.exec(html);
      return {
        profile: m ? m[1] : null,
        shoulderSharesBranch: /currentSelections\.physical === 'bras' \|\| currentSelections\.physical === 'epaule'/.test(html),
      };
    };
    const mappingIssues = (html: string): string[] => {
      const { profile, shoulderSharesBranch } = declared(html);
      const issues: string[] = [];
      if (profile === null) issues.push("le profil posé quand le visiteur déclare une douleur (physical === 'bras') est introuvable : la page a changé, relire le contrôle 9");
      else if (!SENSIBLES.includes(profile)) issues.push(`la douleur déclarée pose le profil « ${profile} », qui n'est pas à bras sensible : l'alerte dès ${S9} ne s'appliquerait pas`);
      if (!shoulderSharesBranch) issues.push("la douleur à l'épaule (physical === 'epaule') ne partage plus la branche de la douleur au bras : relire le contrôle 9");
      return issues;
    };
    const PAGE = 'public/en/configurator.html';
    let page = '';
    try {
      page = readFileSync(PAGE, 'utf8'); // surface introuvable : déjà signalée plus haut
    } catch {
      page = '';
    }
    if (page) {
      const real = mappingIssues(page);
      real.forEach((i) => fail(`${PAGE} : ${i}`));
      const PAGE_MUTATIONS: Array<[string, string, string, string]> = [
        ['la douleur déclarée pose un profil standard (club)', "rcsProfile = 'tennis_elbow';", "rcsProfile = 'club';", 'pas à bras sensible'],
        ['l\'épaule ne partage plus la branche du bras', "currentSelections.physical === 'bras' || currentSelections.physical === 'epaule'", "currentSelections.physical === 'bras'", 'épaule'],
        ['la branche de la douleur déclarée disparaît', "currentSelections.physical === 'bras'", "currentSelections.physical === 'xxx'", 'introuvable'],
      ];
      let caught = 0;
      for (const [name, find, replace, needle] of PAGE_MUTATIONS) {
        const mutated = replaceFirst(page, find, replace);
        if (mutated === null) {
          fail(`${PAGE} : prémisse du test négatif « ${name} » fausse (motif absent de la page).`);
          continue;
        }
        if (mappingIssues(mutated).some((i) => i.includes(needle))) caught++;
        else fail(`${PAGE} : garde-fou muet sur « ${name} » (motif attendu « ${needle} »).`);
      }
      if (real.length === 0) {
        ok(`${PAGE} : la douleur déclarée (bras ou épaule) pose « ${declared(page).profile} », profil à bras sensible (alerte dès RCS ${S9}) ; ${caught} tests négatifs détectés`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 10. INTÉGRITÉ DU CATALOGUE CORDAGES — nettoyage du 28/09/2026
// ---------------------------------------------------------------------------
// La fusion Supabase -> TS du 07/08/2026 (b4e74ad) avait fait entrer des
// cordages de badminton (0,66-0,68 mm), des produits inexistants et des
// doublons de renommage. Ces contrôles empêchent leur retour silencieux.
{
  const before = failures.length;
  const ids = new Set(stringsDatabase.map((s) => s.id));

  // a) jauge < 1.00 mm : aucun cordage de tennis n'en a, le badminton si.
  for (const s of stringsDatabase) {
    const thin = s.gauges.filter((g) => !(parseFloat(g) >= 1.0));
    if (thin.length > 0) fail(`${s.id} : jauge(s) ${thin.join(', ')} < 1.00 mm ou illisible(s) — cordage de badminton ?`);
  }

  // b) doublon (marque, modèle) après normalisation de la casse et des espaces.
  const seen = new Map<string, string>();
  for (const s of stringsDatabase) {
    const key = `${s.brand} ${s.model}`.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(key)) fail(`doublon (marque, modèle) « ${key} » : ${seen.get(key)} et ${s.id}`);
    else seen.set(key, s.id);
  }

  // c) liste de refus : aucun identifiant retiré ne doit réapparaître.
  const refused = [...REMOVED_STRING_IDS, ...Object.keys(LEGACY_STRING_ALIASES)];
  if (refused.length !== 18) fail(`liste de refus : ${refused.length} identifiants au lieu des 18 retirés (16 le 28/09/2026, 2 doublons fusionnés le 10/10/2026)`);
  for (const id of refused) if (ids.has(id)) fail(`identifiant retiré réapparu dans la base : ${id}`);

  // d) chaque alias doit pointer vers un identifiant présent.
  for (const [from, to] of Object.entries(LEGACY_STRING_ALIASES)) {
    if (!ids.has(to)) fail(`alias ${from} -> ${to} : cible absente de la base`);
  }

  if (failures.length === before) {
    ok(
      `catalogue cordages : ${stringsDatabase.length} fiches, jauges >= 1.00 mm, aucun doublon ` +
        `(marque, modèle), ${refused.length} identifiants retirés absents, ` +
        `${Object.keys(LEGACY_STRING_ALIASES).length} alias vers des cibles présentes`
    );
  }
}

// ---------------------------------------------------------------------------
// 10 bis. DOUBLONS FUSIONNÉS DU 10/10/2026 (décision de Pierre : « deux doublons probables :
//         vérifier, puis fusionner »)
// ---------------------------------------------------------------------------
// tecnifibre-4s -> tecnifibre-black-code-4s (TW : « Same string, different name ») et
// tecnifibre-atp-razor-code -> tecnifibre-razor-code. La fiche la plus ancienne reste, l'autre devient un
// alias : les anciennes URL et configurations doivent continuer de répondre. Échoue si : (a) un alias de
// fusion ne pointe pas vers la fiche conservée, ou l'ancien id est encore au catalogue ; (b) la fiche
// conservée perd une jauge de l'ancienne, ne dit plus sous quel autre nom le produit se vend, ou n'a plus la
// photo déplacée ; (c) l'ancien id reste au manifeste de photos, dans la provenance des notes ou dans les
// décisions du collecteur ; (d) un ancien id, parmi les 10 alias, n'a plus sa redirection permanente FR vers
// la fiche conservée dans next.config.js, ou, pour les 2 fusions (fiches EN générées depuis le 09/10), sa
// redirection EN. Chaque garde est rejouée sur une copie altérée.
{
  const before = failures.length;
  const MERGED = {
    'tecnifibre-4s': { into: 'tecnifibre-black-code-4s', gauges: ['1.20', '1.25', '1.30'], alsoSoldAs: '« 4S »', photoMoved: true },
    'tecnifibre-atp-razor-code': { into: 'tecnifibre-razor-code', gauges: ['1.20', '1.25', '1.30'], alsoSoldAs: '« ATP Razor Code »', photoMoved: false },
  } as const;
  const { PRODUCT_IMAGES: IMAGES } = await import('../src/data/product-images');
  const { STRING_RATINGS_PROVENANCE: NOTE_PROVENANCE } = await import('../src/data/string-ratings-provenance');
  const decisions = JSON.parse(readFileSync('scripts/scraper/product-images-mapping.json', 'utf8')).strings as Record<string, unknown>;
  const redirectsSrc = readFileSync('next.config.js', 'utf8');
  const hasRedirect = (src: string, from: string, to: string) =>
    new RegExp(`source:\\s*'${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*destination:\\s*'${to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*permanent:\\s*true`).test(src);
  const checkMerges = (
    strings: readonly (typeof stringsDatabase)[number][], aliases: Readonly<Record<string, string>>,
    images: Record<string, unknown>, notes: Record<string, unknown>, mapping: Record<string, unknown>, redirects: string,
  ): string[] => {
    const issues: string[] = [];
    for (const [from, m] of Object.entries(MERGED)) {
      if (aliases[from] !== m.into) issues.push(`${from} : alias vers « ${aliases[from] ?? 'rien'} », « ${m.into} » attendu`);
      if (strings.some((s) => s.id === from)) issues.push(`${from} : fiche fusionnée encore au catalogue`);
      const kept = strings.find((s) => s.id === m.into);
      if (!kept) { issues.push(`${from} : fiche conservée ${m.into} absente`); continue; }
      const lost = m.gauges.filter((g) => !kept.gauges.includes(g));
      if (lost.length > 0) issues.push(`${m.into} : jauge(s) ${lost.join(', ')} de l'ancienne fiche ${from} perdue(s)`);
      if (!kept.description.includes(m.alsoSoldAs)) issues.push(`${m.into} : la description ne dit plus que le produit se vend aussi sous ${m.alsoSoldAs}`);
      if (m.photoMoved && !(m.into in images)) issues.push(`${m.into} : la photo de ${from} n'a pas suivi`);
      if (from in images) issues.push(`${from} : photo restée au manifeste`);
      if (from in notes) issues.push(`${from} : provenance des notes d'une fiche fusionnée`);
      if (from in mapping) issues.push(`${from} : décision du collecteur d'images d'une fiche fusionnée`);
      if (!hasRedirect(redirects, `/en/strings/${from}.html`, `/en/strings/${m.into}.html`)) issues.push(`${from} : redirection permanente EN vers ${m.into} absente de next.config.js`);
    }
    for (const [from, to] of Object.entries(aliases)) {
      if (!hasRedirect(redirects, `/tennis-strings/${from}`, `/tennis-strings/${to}`)) issues.push(`${from} : redirection permanente FR vers ${to} absente de next.config.js`);
    }
    return issues;
  };
  checkMerges(stringsDatabase, LEGACY_STRING_ALIASES, IMAGES, NOTE_PROVENANCE, decisions, redirectsSrc).forEach((i) => fail(`doublons fusionnés : ${i}`));
  const keptBc4s = stringsDatabase.find((s) => s.id === 'tecnifibre-black-code-4s')!;
  const ghost = { ...keptBc4s, id: 'tecnifibre-4s' };
  const negatives: Array<[string, string[], string]> = [
    ['alias de fusion retiré', checkMerges(stringsDatabase, { ...LEGACY_STRING_ALIASES, 'tecnifibre-4s': undefined as unknown as string }, IMAGES, NOTE_PROVENANCE, decisions, redirectsSrc), 'tecnifibre-4s : alias vers'],
    ['ancienne fiche revenue au catalogue', checkMerges([...stringsDatabase, ghost], LEGACY_STRING_ALIASES, IMAGES, NOTE_PROVENANCE, decisions, redirectsSrc), 'fiche fusionnée encore au catalogue'],
    ['jauge de l\'ancienne fiche perdue', checkMerges(stringsDatabase.map((s) => (s.id === 'tecnifibre-razor-code' ? { ...s, gauges: ['1.25'] } : s)), LEGACY_STRING_ALIASES, IMAGES, NOTE_PROVENANCE, decisions, redirectsSrc), 'perdue(s)'],
    ['autre nom du produit effacé de la description', checkMerges(stringsDatabase.map((s) => (s.id === 'tecnifibre-black-code-4s' ? { ...s, description: 'Section carrée.' } : s)), LEGACY_STRING_ALIASES, IMAGES, NOTE_PROVENANCE, decisions, redirectsSrc), 'se vend aussi sous'],
    ['photo restée sur l\'ancien id', checkMerges(stringsDatabase, LEGACY_STRING_ALIASES, { ...IMAGES, 'tecnifibre-4s': {} }, NOTE_PROVENANCE, decisions, redirectsSrc), 'photo restée au manifeste'],
    ['photo non déplacée vers la fiche conservée', checkMerges(stringsDatabase, LEGACY_STRING_ALIASES, Object.fromEntries(Object.entries(IMAGES).filter(([k]) => k !== 'tecnifibre-black-code-4s')), NOTE_PROVENANCE, decisions, redirectsSrc), 'la photo de tecnifibre-4s n\'a pas suivi'],
    ['provenance des notes d\'une fiche fusionnée', checkMerges(stringsDatabase, LEGACY_STRING_ALIASES, IMAGES, { ...NOTE_PROVENANCE, 'tecnifibre-atp-razor-code': {} }, decisions, redirectsSrc), 'provenance des notes d\'une fiche fusionnée'],
    ['redirections permanentes retirées', checkMerges(stringsDatabase, LEGACY_STRING_ALIASES, IMAGES, NOTE_PROVENANCE, decisions, ''), 'redirection permanente FR'],
  ];
  for (const [name, found, needle] of negatives) {
    if (!found.some((i) => i.includes(needle))) fail(`doublons fusionnés : garde-fou muet sur « ${name} » (${needle})`);
  }
  if (!negatives.some(([, found]) => found.some((i) => i.includes('redirection permanente EN')))) fail('doublons fusionnés : garde-fou muet sur la redirection EN');
  if (failures.length === before) {
    ok(`doublons fusionnés : ${Object.keys(MERGED).length} fiches (tecnifibre-4s, tecnifibre-atp-razor-code) -> fiches les plus anciennes ; jauges conservées, autre nom cité, photo déplacée, ` +
      `plus d'ancien id au manifeste, aux notes ni au collecteur, ${Object.keys(LEGACY_STRING_ALIASES).length} redirections permanentes FR + ${Object.keys(MERGED).length} EN dans next.config.js, ${negatives.length} tests négatifs détectés`);
  }
}

// ---------------------------------------------------------------------------
// 11. OPTION A (29/09/2026) — notes /10, tension recommandée et prix optionnels.
// ---------------------------------------------------------------------------
// Le RCS ne dépend que de la rigidité : elle seule est obligatoire. Une fiche
// sans notes doit rester calculable, et l'alerte bras fondée sur l'indice de
// fermeté doit s'appliquer à elle comme aux autres (règle 2).
{
  const before = failures.length;

  // a) aucune fiche sans rigidité exploitable.
  const noStiff = stringsDatabase.filter((s) => !(Number.isFinite(s.stiffness) && s.stiffness > 0));
  for (const s of noStiff) fail(`${s.id} : rigidité absente ou invalide (${s.stiffness}) — le RCS n'est pas calculable`);

  // b) RCS fini pour toutes les fiches, toutes raquettes, toutes tensions.
  let combos = 0;
  for (const s of stringsDatabase) {
    for (const rq of racquetsDatabase) {
      const ra = effectiveRacquetRA(rq);
      for (const t of TENSIONS) {
        combos++;
        const v = calculateRCS(ra, s.stiffness, t);
        if (!Number.isFinite(v)) {
          fail(`${s.id} + ${rq.id} @ ${t} kg : RCS non fini (${v})`);
          break;
        }
      }
    }
  }

  // c) aucun rendu de note sans garde : `.toFixed` direct sur une note optionnelle
  //    planterait (TypeError) sur une fiche sans notes.
  const UI = [
    'src/components/product/string-card.tsx',
    'src/app/compare/page.tsx',
    'src/app/tennis-strings/[slug]/page.tsx',
    'src/app/statistics/page.tsx',
  ];
  for (const path of UI) {
    const src = readFileSync(path, 'utf8');
    const hits = src.match(/\b(?:string|stringItem|s)\??\.(?:performance|control|comfort|durability|spin|power)\.toFixed\(/g);
    if (hits) fail(`${path} : ${hits.length} rendu(s) de note sans garde (${hits.join(', ')})`);
  }

  // d) fiche synthétique sans notes, sans tension, sans prix : RCS calculé,
  //    sous-scores null (jamais 0), alerte bras émise sur un setup rigide.
  const bare = calculateAdvancedRcs({
    racquetStiffness: 72,
    mainStringStiffness: 262,
    mainStringFamily: 'polyester',
    mainRatings: {},
    mainTension: 28,
  });
  const subs = Object.values(bare.subScores);
  if (!Number.isFinite(bare.rcs)) fail(`fiche sans notes : RCS non fini (${bare.rcs})`);
  if (subs.some((v) => v !== null) || bare.overall !== null) {
    fail(`fiche sans notes : sous-scores ou score global fabriqués (${JSON.stringify(bare.subScores)}, ${bare.overall})`);
  }
  if (!bare.warnings.some((w) => /bras|elbow/i.test(w))) {
    fail(`fiche sans notes : aucune alerte bras sur un setup rigide (indice ${bare.rcs}) — règle 2`);
  }
  const bareSensitive = calculateAdvancedRcs({
    racquetStiffness: 64,
    mainStringStiffness: 220,
    mainStringFamily: 'polyester',
    mainRatings: {},
    mainTension: 26,
    profile: { armSensitive: true },
  });
  if (bareSensitive.rcs >= 32 && !bareSensitive.warnings.some((w) => /bras|elbow/i.test(w))) {
    fail(`fiche sans notes, profil sensible : indice ${bareSensitive.rcs} >= 32 sans alerte — règle 2`);
  }

  // e) filtres et tris : note absente => exclue d'un seuil > 0, rangée en fin de tri.
  if (meetsMinRating(undefined, 5) || !meetsMinRating(undefined, 0) || !meetsMinRating(7, 5)) {
    fail(`meetsMinRating : une fiche sans note passe un seuil > 0, ou le seuil nul exclut`);
  }
  // (objets, car Array.sort range les `undefined` nus sans appeler le comparateur)
  const sorted = [{ v: undefined }, { v: 3 }, { v: 8 }]
    .sort((a, b) => compareOptionalDesc(a.v, b.v))
    .map((o) => o.v);
  if (sorted[0] !== 8 || sorted[2] !== undefined) {
    fail(`compareOptionalDesc : les notes absentes ne sont pas en fin de liste (${JSON.stringify(sorted)})`);
  }

  if (failures.length === before) {
    const unrated = stringsDatabase.filter((s) => s.comfort === undefined).length;
    ok(
      `option A : ${stringsDatabase.length} fiches avec rigidité, RCS fini sur ${combos} combinaisons, ` +
        `aucune note rendue sans garde (${UI.length} fichiers), fiche sans notes => sous-scores null + ` +
        `alerte bras émise (indice ${bare.rcs}) ; ${unrated} fiche(s) sans note de confort`
    );
  }
}

// ---------------------------------------------------------------------------
// 12. PHOTOS PRODUIT (Tennis Warehouse, décision de Pierre du 29/09/2026 ;
//     Tennis Warehouse Europe et fiches EN depuis le 09/10/2026 ;
//     images officielles des fabricants, source `fabricant:<marque>`, depuis le 10/10/2026)
// ---------------------------------------------------------------------------
// Dispositif désactivable et purgeable (src/lib/product-images.ts). Une photo
// fausse est une information fausse : chaque entrée du manifeste doit viser un
// produit existant, du bon type, avec un fichier hébergé chez nous, sa
// provenance (page et image servies par l'hôte de SA source) et un crédit
// affichable. Aucune URL de source ne doit servir une image (hotlink), et aucune
// page ne doit propager ces photos (JSON-LD, og:image).
{
  const before = failures.length;
  const { PRODUCT_IMAGES, PRODUCT_IMAGE_CREDITS } = await import('../src/data/product-images');
  // Liste blanche : pour chaque source, les préfixes de page et d'image admis. Une source absente
  // (Head et Luxilon, fermés au robot, ou tout revendeur sans décision de Pierre) est refusée.
  // Babolat : site FR et, depuis le 22/10/2026, site US (produit absent du site FR).
  const SOURCE_HOSTS: Record<string, { pages: string[]; images: string[] }> = {
    'tennis-warehouse': { pages: ['https://www.tennis-warehouse.com/'], images: ['https://img.tennis-warehouse.com/'] },
    'tennis-warehouse-europe': { pages: ['https://www.tenniswarehouse-europe.com/'], images: ['https://img.tenniswarehouse-europe.com/'] },
    'tennis-point': { pages: ['https://www.tennis-point.fr/products/'], images: ['https://cdn.shopify.com/s/files/1/0638/1885/8538/'] },
    'fabricant:wilson': { pages: ['https://www.wilson.com/en-us/products/'], images: ['https://www.wilson.com/cdn/shop/files/'] },
    'fabricant:babolat': { pages: ['https://www.babolat.com/fr/', 'https://www.babolat.com/us/'], images: ['https://media.babolat.com/image/upload/'] },
    'fabricant:tecnifibre': { pages: ['https://www.tecnifibre.com/products/'], images: ['https://cdn.shopify.com/s/files/1/0907/5425/3144/files/'] },
    'fabricant:yonex': { pages: ['https://www.yonex.com/tennis/'], images: ['https://www.yonex.com/media/catalog/product/'] },
    // Lot du 22/10/2026 : sites dont agents.md et llms.txt ne refusent pas ce robot.
    'fabricant:solinco': { pages: ['https://solincosports.com/equipment/'], images: ['https://solincosports.com/wp-content/uploads/'] },
    'fabricant:dunlop': { pages: ['https://us.dunlopsports.com/dunlop/tennis/'], images: ['https://us.dunlopsports.com/on/demandware.static/'] },
    'fabricant:kirschbaum': { pages: ['https://www.kirschbaum-shop.de/'], images: ['https://www.kirschbaum-shop.de/out/pictures/'] },
    // Envois manuels de Pierre : toute page https, image https ou fichier envoyé (« upload:<fichier> ») ;
    // contrôles propres plus bas (crédit par image, ni moteur de recherche ni filigrane, crédit honnête).
    'upload:pierre': { pages: ['https://'], images: ['https://', 'upload:'] },
  };
  // Hôtes d'images de toutes les sources : jamais appelés par l'application ni par les fiches EN.
  const IMAGE_HOSTS_RE = /img\.tennis-?warehouse(-europe)?\.com|cdn\.shopify\.com\/s\/files|wilson\.com\/cdn\/shop|media\.babolat\.com|yonex\.com\/media\/catalog|solincosports\.com\/wp-content|dunlopsports\.com\/on\/demandware|kirschbaum-shop\.de\/out\/pictures/;
  const SEARCH_ENGINE_RE = /(^|\.)(google|bing|yandex|duckduckgo|baidu|qwant|yahoo|ecosia|startpage|tineye)\./i;
  const BRANDS = [...new Set([...racquetsDatabase, ...stringsDatabase].map((x) => x.brand))];
  const squash = (x: string) => x.toLowerCase().replace(/ö/g, 'o').replace(/[^a-z0-9]/g, '');
  const { existsSync, readdirSync, statSync } = await import('node:fs');
  const racquetIds = new Set(racquetsDatabase.map((r) => r.id));
  const stringById = new Map(stringsDatabase.map((s) => [s.id, s]));
  type PhotoEntry = (typeof PRODUCT_IMAGES)[string];
  // Contrôles d'une entrée (provenance, crédit, légende de produit voisin), rejoués plus bas sur des
  // copies altérées : un garde-fou muet fait échouer l'audit.
  const entryIssues = (id: string, e: PhotoEntry, credits: Readonly<Record<string, string>>): string[] => {
    const issues: string[] = [];
    const hosts = SOURCE_HOSTS[e.source];
    if (!hosts) return [`photo ${id} : source inattendue ${e.source}`];
    if (!credits[e.source]) issues.push(`photo ${id} : aucun libellé de crédit pour la source ${e.source}`);
    if (!hosts.pages.some((h) => e.sourcePageUrl.startsWith(h))) issues.push(`photo ${id} : page source invalide pour ${e.source}`);
    if (!hosts.images.some((h) => e.sourceImageUrl.startsWith(h))) issues.push(`photo ${id} : image source invalide pour ${e.source}`);
    if (!e.twProduct) issues.push(`photo ${id} : intitulé du produit source absent (association non auditable)`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.retrievedAt)) issues.push(`photo ${id} : date de collecte invalide`);
    // Crédit propre à l'image : réservé aux envois manuels, obligatoire pour eux, et honnête (le nom d'une
    // marque seulement pour une image prise sur un site de cette marque).
    if (e.source !== 'upload:pierre' && e.credit !== undefined) issues.push(`photo ${id} : crédit propre à l'image hors envoi manuel`);
    if (e.source === 'upload:pierre') {
      const host = (() => { try { return new URL(e.sourcePageUrl).hostname; } catch { return ''; } })();
      if (!e.credit?.trim()) issues.push(`photo ${id} : envoi manuel sans crédit propre (la source réelle)`);
      if (!host || SEARCH_ENGINE_RE.test(host)) issues.push(`photo ${id} : page d'origine absente ou moteur de recherche (${host || '?'})`);
      if (/watermark|filigrane/i.test(`${e.sourcePageUrl} ${e.sourceImageUrl}`)) issues.push(`photo ${id} : URL qui annonce un filigrane`);
      const brand = BRANDS.find((b) => squash(b) === squash(e.credit ?? ''));
      if (brand && !squash(host).includes(squash(brand))) issues.push(`photo ${id} : crédit « ${e.credit} » pour une image prise sur ${host}`);
    }
    // Produit voisin (22/10/2026) : une autre jauge seulement si la fiche la liste ; un autre coloris
    // seulement si la fiche n'en fixe aucun (aucune fiche raquette n'a de coloris). La légende dit ce
    // que la photo montre.
    const str = stringById.get(id);
    if (e.shownGauge !== undefined) {
      const gauges = new Set((str?.gauges ?? []).flatMap((g) => g.split('/')));
      if (!str) issues.push(`photo ${id} : « jauge présentée » sur une raquette`);
      else if (!/^\d\.\d{2}$/.test(e.shownGauge) || !gauges.has(e.shownGauge)) {
        issues.push(`photo ${id} : jauge présentée ${e.shownGauge} absente de la fiche (${(str.gauges ?? []).join(', ')})`);
      }
    }
    if (e.shownColour !== undefined) {
      if (str?.color) issues.push(`photo ${id} : coloris présenté « ${e.shownColour} » alors que la fiche fixe « ${str.color} »`);
      else if (!e.shownColour.trim()) issues.push(`photo ${id} : coloris présenté vide`);
    }
    return issues;
  };
  let bytes = 0;
  const listed = new Set<string>();
  for (const [id, e] of Object.entries(PRODUCT_IMAGES)) {
    const folder = racquetIds.has(id) ? 'racquets' : stringById.has(id) ? 'strings' : null;
    if (!folder) { fail(`photo ${id} : aucun produit de ce nom dans la base`); continue; }
    if (e.file !== `/images/products/${folder}/${id}.webp`) fail(`photo ${id} : chemin inattendu ${e.file}`);
    const disk = `public${e.file}`;
    listed.add(disk.replace(/\\/g, '/'));
    if (!existsSync(disk)) { fail(`photo ${id} : fichier absent ${disk}`); continue; }
    const size = statSync(disk).size;
    bytes += size;
    if (size > 120_000) fail(`photo ${id} : ${Math.round(size / 1024)} Ko (> 120 Ko)`);
    entryIssues(id, e, PRODUCT_IMAGE_CREDITS).forEach(fail);
  }
  // Tests négatifs, un jeu par source de la liste blanche : une entrée témoin (réelle si la source a des
  // photos) doit passer, puis être refusée avec une page ou une image hors de la liste, et sans crédit.
  {
    const negatives: Array<[string, string[], string]> = [];
    let witnesses = 0;
    const multiGauge = stringsDatabase.find((s) => (s.gauges ?? []).length > 1 && s.color)!;
    // Entrée témoin construite depuis la liste blanche : le contrôle ne dépend pas des photos présentes
    // (une source purgée doit laisser l'audit vert).
    const synthetic = (source: string, id: string): PhotoEntry => ({
      file: `/images/products/${racquetIds.has(id) ? 'racquets' : 'strings'}/${id}.webp`, width: 1, height: 1, retrievedAt: '2026-10-22', source,
      sourcePageUrl: `${SOURCE_HOSTS[source].pages[0]}${source === 'upload:pierre' ? 'www.exemple-photographe.test/' : ''}temoin`,
      sourceImageUrl: `${SOURCE_HOSTS[source].images[0]}temoin.jpg`, twProduct: 'témoin',
      ...(source === 'upload:pierre' ? { credit: 'Exemple Photographe' } : {}),
    } as PhotoEntry);
    for (const source of Object.keys(SOURCE_HOSTS)) {
      const real = Object.entries(PRODUCT_IMAGES).find(([, e]) => e.source === source);
      const [id, base] = real ?? [multiGauge.id, synthetic(source, multiGauge.id)];
      const credits: Record<string, string> = { ...PRODUCT_IMAGE_CREDITS, [source]: PRODUCT_IMAGE_CREDITS[source] ?? 'Témoin' };
      const witness = entryIssues(id, base, credits);
      if (witness.length) fail(`photos produit : témoin de la source ${source} refusé (${witness.join(' ; ')})`);
      else witnesses++;
      const noCredit = Object.fromEntries(Object.entries(credits).filter(([k]) => k !== source));
      if (source === 'upload:pierre') {
        // Toute page https est admise : les négatifs portent sur le crédit, les moteurs et le filigrane.
        negatives.push(
          [`${source} : page en http`, entryIssues(id, { ...base, sourcePageUrl: 'http://www.exemple-photographe.test/x' }, credits), 'page source invalide'],
          [`${source} : crédit propre manquant`, entryIssues(id, { ...base, credit: undefined }, credits), 'sans crédit propre'],
          [`${source} : page de moteur de recherche`, entryIssues(id, { ...base, sourcePageUrl: 'https://www.google.com/imgres?x' }, credits), 'moteur de recherche'],
          [`${source} : image filigranée annoncée`, entryIssues(id, { ...base, sourceImageUrl: 'https://img.exemple.test/watermark/x.jpg' }, credits), 'filigrane'],
          [`${source} : marque créditée pour une image de tiers`, entryIssues(id, { ...base, credit: 'Head', sourcePageUrl: 'https://www.exemple-revendeur.test/head-speed' }, credits), 'pour une image prise sur'],
        );
        continue;
      }
      negatives.push(
        [`${source} : page hors liste blanche`, entryIssues(id, { ...base, sourcePageUrl: 'https://www.exemple-revendeur.test/produit' }, credits), 'page source invalide'],
        [`${source} : image hors liste blanche`, entryIssues(id, { ...base, sourceImageUrl: 'https://cdn.exemple-revendeur.test/image.jpg' }, credits), 'image source invalide'],
        [`${source} : crédit manquant`, entryIssues(id, base, noCredit), 'aucun libellé de crédit'],
        [`${source} : crédit propre hors envoi manuel`, entryIssues(id, { ...base, credit: 'Quelqu’un' }, credits), 'hors envoi manuel'],
      );
    }
    const bId = multiGauge.id;
    const bEntry = synthetic('fabricant:babolat', bId);
    const strEntry = bEntry;
    // Crédits du témoin : la table générée ne liste que les sources présentes au manifeste (purge comprise).
    const bCredits = { ...PRODUCT_IMAGE_CREDITS, 'fabricant:babolat': 'Babolat' };
    negatives.push(
      ['Luxilon fermé (403) présenté comme source', entryIssues(bId, { ...bEntry, source: 'fabricant:luxilon', sourcePageUrl: 'https://www.luxilon.com/en-us/product/x' }, { ...PRODUCT_IMAGE_CREDITS, 'fabricant:luxilon': 'Luxilon' }), 'source inattendue'],
      ['Head fermé (429) présenté comme source', entryIssues(bId, { ...bEntry, source: 'fabricant:head', sourcePageUrl: 'https://www.head.com/x' }, { ...PRODUCT_IMAGE_CREDITS, 'fabricant:head': 'Head' }), 'source inattendue'],
      ['Babolat : site d’un autre pays que FR et US', entryIssues(bId, { ...bEntry, sourcePageUrl: 'https://www.babolat.com/de/x/101576.html' }, bCredits), 'page source invalide'],
      ['jauge présentée absente de la fiche', entryIssues(multiGauge.id, { ...strEntry, shownGauge: '1.18' }, bCredits), 'absente de la fiche'],
      ['jauge présentée sur une raquette', entryIssues(racquetsDatabase[0].id, { ...synthetic('fabricant:babolat', racquetsDatabase[0].id), shownGauge: '1.25' }, bCredits), 'sur une raquette'],
      ['coloris présenté sur une fiche qui fixe un coloris', entryIssues(multiGauge.id, { ...strEntry, shownColour: 'Pink' }, bCredits), 'alors que la fiche fixe'],
      ['coloris présenté vide (raquette)', entryIssues(racquetsDatabase[0].id, { ...synthetic('fabricant:babolat', racquetsDatabase[0].id), shownColour: ' ' }, bCredits), 'coloris présenté vide'],
    );
    // Témoin : raquette (sans coloris de fiche) photographiée dans un des coloris de la page, avec la légende.
    const racquetColour = entryIssues(racquetsDatabase[0].id, { ...synthetic('fabricant:babolat', racquetsDatabase[0].id), shownColour: 'Espresso Brown' }, bCredits);
    if (racquetColour.length) fail(`photos produit : témoin « coloris présenté sur une raquette » refusé (${racquetColour.join(' ; ')})`);
    else witnesses++;
    // Témoin : fiche sans coloris (aucune au catalogue aujourd'hui), le coloris présenté est admis.
    const blank = '__temoin-sans-coloris__';
    stringById.set(blank, { ...multiGauge, id: blank, color: undefined } as (typeof stringsDatabase)[number]);
    const accepted = entryIssues(blank, { ...strEntry, shownColour: 'Black' }, bCredits);
    stringById.delete(blank);
    if (accepted.length) fail(`photos produit : témoin « coloris présenté sur une fiche sans coloris » refusé (${accepted.join(' ; ')})`);
    else witnesses++;
    for (const [name, found, needle] of negatives) {
      if (!found.some((i) => i.includes(needle))) fail(`photos produit : garde-fou muet sur « ${name} » (${needle})`);
    }
    // Légende FR : le composant lit les deux champs et les annonce tels quels.
    const captionIssues = (src: string): string[] => [
      ...(/Photo : \{image\.credit \?\? productImageCredit\(image\.source\)\}/.test(src) ? [] : ['crédit propre à l\'image non lu par le composant FR']),
      ...(/image\.shownGauge\s*&&[^\n]*jauge présentée : \{image\.shownGauge/.test(src) ? [] : ['légende « jauge présentée » absente du composant FR']),
      ...(/image\.shownColour\s*&&[^\n]*coloris présenté : \{image\.shownColour\}/.test(src) ? [] : ['légende « coloris présenté » absente du composant FR']),
    ];
    const fig = readFileSync('src/components/product/product-image.tsx', 'utf8');
    captionIssues(fig).forEach((i) => fail(`photos produit : ${i}`));
    if (!captionIssues(fig.replace('jauge présentée', 'jauge')).length) fail('photos produit : garde-fou muet sur la légende FR retirée');
    if (failures.length === before) {
      ok(`photos produit : ${Object.keys(SOURCE_HOSTS).length} sources en liste blanche, ${witnesses} témoins acceptés, ${negatives.length + 1} tests négatifs détectés ` +
        '(page ou image hors liste et crédit manquant pour chaque source, envois manuels : crédit propre, moteur, filigrane, marque créditée à tort ; Head et Luxilon, Babolat hors FR/US, jauge ou coloris présentés hors règle ou vides, légende et crédit FR)');
    }
  }
  for (const folder of ['racquets', 'strings']) {
    const dir = `public/images/products/${folder}`;
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!listed.has(`${dir}/${f}`)) fail(`${dir}/${f} : fichier hors manifeste (purge incomplète ?)`);
    }
  }
  const flag = readFileSync('src/lib/product-images.ts', 'utf8');
  if (!/^export const PRODUCT_IMAGES_ENABLED = (true|false);$/m.test(flag)) {
    fail('src/lib/product-images.ts : le drapeau PRODUCT_IMAGES_ENABLED doit rester un littéral booléen unique');
  }
  // Pas de hotlink ni de propagation : seuls le manifeste, l'accesseur et le
  // composant d'affichage connaissent ces photos.
  const allowed = new Set(['src/data/product-images.ts', 'src/lib/product-images.ts', 'src/components/product/product-image.tsx']);
  const walk = (d: string): string[] =>
    readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walk(`${d}/${n}`) : [`${d}/${n}`]));
  for (const file of walk('src').filter((f) => /\.(tsx?|mts)$/.test(f) && !allowed.has(f))) {
    const src = readFileSync(file, 'utf8');
    if (IMAGE_HOSTS_RE.test(src) || /\/images\/products\/|PRODUCT_IMAGES|getProductImage|productImageCredit/.test(src)) {
      fail(`${file} : référence directe aux photos (hotlink ou propagation hors du composant)`);
    }
  }
  // Fiches EN statiques (générées au build) : rendues ici en mémoire avec le même
  // manifeste. Chaque photo validée y est affichée, chaque fiche sans photo porte
  // l'illustration ; aucune photo dans le JSON-LD ni og:image, aucun hotlink.
  {
    const { loadProductImages } = await import('./catalog/product-images.mjs');
    const { racquetPage, stringPage } = await import('./en-products/build-en-product-pages.mjs');
    const { images } = await loadProductImages(process.cwd());
    const { racquets: enR, strings: enS } = buildCatalog(racquetsDatabase, stringsDatabase);
    let shown = 0;
    let captioned = 0;
    let illustrated = 0;
    for (const [kind, list, render] of [['racquets', enR, racquetPage], ['strings', enS, stringPage]] as const) {
      for (const item of list as Array<{ id: string }>) {
        const html: string = (render as (x: unknown, i: unknown) => string)(item, images);
        const expected = (images as Record<string, { file: string; shownGauge?: string; shownColour?: string }>)[item.id];
        const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
        if (/"image"|\/images\/products\//.test(ld)) fail(`fiche EN ${kind}/${item.id} : photo propagée dans le JSON-LD`);
        if (/og:image/.test(html)) fail(`fiche EN ${kind}/${item.id} : og:image présent`);
        if (IMAGE_HOSTS_RE.test(html)) fail(`fiche EN ${kind}/${item.id} : hotlink vers la source`);
        if (expected) {
          const credit = (expected as unknown as { credit?: string }).credit
            ?? (PRODUCT_IMAGE_CREDITS as Record<string, string>)[(expected as unknown as { source: string }).source];
          if (!html.includes(`<img src="${expected.file}"`)) fail(`fiche EN ${kind}/${item.id} : photo validée non affichée`);
          else if (!credit || !html.includes(`Photo: ${credit}`)) fail(`fiche EN ${kind}/${item.id} : crédit « Photo: ${credit} » absent`);
          else if (expected.shownGauge && !html.includes(`gauge shown: ${expected.shownGauge} mm`)) fail(`fiche EN ${kind}/${item.id} : légende « gauge shown » absente`);
          else if (expected.shownColour && !html.includes(`colour shown: ${expected.shownColour}`)) fail(`fiche EN ${kind}/${item.id} : légende « colour shown » absente`);
          else { shown++; if (expected.shownGauge || expected.shownColour) captioned++; }
        } else if (!html.includes('data-product-image="illustration"')) {
          fail(`fiche EN ${kind}/${item.id} : ni photo ni illustration`);
        } else illustrated++;
      }
    }
    ok(`fiches EN : ${shown} photo(s) affichée(s) dont ${captioned} avec la légende du produit voisin, ${illustrated} illustration(s), aucune photo en JSON-LD/og:image`);
  }
  if (failures.length === before) {
    const n = Object.keys(PRODUCT_IMAGES).length;
    ok(`photos produit : ${n} entrée(s) valides, ${(bytes / 1e6).toFixed(2)} Mo hébergés, aucun hotlink ni propagation`);
  }
}

// ---------------------------------------------------------------------------
// 13. NOTES HARMONISÉES AVEC LES AVIS DE TESTEURS (décision de Pierre, 09/10/2026)
// ---------------------------------------------------------------------------
// Toute note harmonisée doit porter sa provenance et se recalculer depuis elle :
// une retouche à la main d'une note couverte, ou un décalage d'ancrage modifié
// sans ses données, fait échouer l'audit.
{
  const before = failures.length;
  const fields = Object.keys(FIELD_TO_CRITERION) as HarmonizedField[];
  const entries = Object.entries(STRING_TESTER_RATINGS);
  if (entries.length !== 18) fail(`notes testeurs : ${entries.length} cordages en provenance, 18 attendus (17 exacts + Signum validé)`);
  for (const [id, e] of entries) {
    const s = stringsDatabase.find((x) => x.id === id);
    if (!s) { fail(`notes testeurs : ${id} absent du catalogue`); continue; }
    const crit = Object.keys(TESTER_RATINGS_SOURCE.criteria) as TesterCriterion[];
    if (crit.some((c) => !Number.isInteger(e.raw20[c]) || e.raw20[c] < 0 || e.raw20[c] > TESTER_RATINGS_SOURCE.scale)) {
      fail(`notes testeurs : ${id} porte une note source hors de l'échelle /20`);
    }
    const avg = crit.reduce((a, c) => a + e.raw20[c], 0) / crit.length;
    if (Math.abs(avg - e.docxAverage20) > 0.005) fail(`notes testeurs : ${id} moyenne source ${avg} ≠ ${e.docxAverage20}`);
    for (const f of fields) {
      // D2 (23/10/2026) : note de confort recalée, la composante éditoriale est la valeur recalée (méthode, étape 4).
      const expected = harmonizedRating(e, f, f === 'comfort' ? COMFORT_RECALIBRATED[id]?.editorialAfter : undefined);
      if (s[f] !== expected) fail(`notes testeurs : ${id}.${f} = ${s[f]} au catalogue, ${expected} attendu par la provenance`);
    }
  }
  for (const f of fields) {
    const pts = entries.filter(([, e]) => e.before10[f] !== undefined);
    const shift = pts.reduce((a, [, e]) => a + (e.before10[f] as number) - e.raw20[FIELD_TO_CRITERION[f]] / 2, 0) / pts.length;
    if (Math.abs(Math.round(shift * 10 + 1e-9) / 10 - ANCHOR_SHIFT[f]) > 1e-9) {
      fail(`notes testeurs : décalage d'ancrage ${f} = ${ANCHOR_SHIFT[f]}, ${shift.toFixed(3)} mesuré sur les produits communs`);
    }
  }
  const ratingKeys = ['performance', 'control', 'comfort', 'durability', 'versatility', 'innovation', 'spin', 'power'] as const;
  for (const s of stringsDatabase) {
    for (const k of ratingKeys) {
      const v = s[k];
      if (v !== undefined && !(v >= 0 && v <= 10)) fail(`${s.id}.${k} = ${v} hors de l'échelle /10`);
    }
  }
  if (failures.length === before) {
    ok(`notes testeurs : ${entries.length} cordages harmonisés, provenance complète, ${entries.length * fields.length} notes recalculées à l'identique, toutes les notes dans [0, 10]`);
  }
}

// ---------------------------------------------------------------------------
// 13 bis. PROVENANCE DES NOTES /10 DES CORDAGES, CHAMP PAR CHAMP (C4, 10/10/2026)
// ---------------------------------------------------------------------------
// src/data/string-ratings-provenance.ts décrit chaque note publiée face aux revues
// Tennis Warehouse lues le 10/10/2026, sans modifier aucune note. Échoue si :
// (a) une note publiée n'a pas de provenance, ou une provenance vise une note absente
//     ou un cordage inconnu ; (b) un code ne se recalcule plus depuis les données (note
//     retouchée, score TW modifié, « tw » sans reprise systématique) ; (c) une revue est
//     mal formée ou citée par aucune fiche ; (d) une surface du site lit la provenance
//     (code de src/ hors données, générateurs EN, catalogue EN, fiches EN), ou l'export
//     catalog.json porte un code ou une clé de provenance au lieu de la seule nature
//     (`rating_basis`, 22/10/2026). Chaque garde
//     est rejouée sur une copie altérée : un garde-fou muet fait échouer l'audit.
{
  const before = failures.length;
  const P = await import('../src/data/string-ratings-provenance');
  type Field = keyof typeof P.FIELD_TO_TW;
  type Prov = Readonly<Record<string, (typeof P.STRING_RATINGS_PROVENANCE)[string]>>;
  type Reviews = Readonly<Record<string, (typeof P.TW_REVIEWS)[string]>>;
  const FIELDS = Object.keys(P.FIELD_TO_TW) as Field[];
  const HARM = Object.keys(FIELD_TO_CRITERION) as string[];
  const checkProvenance = (strings: readonly (typeof stringsDatabase)[number][], prov: Prov, reviews: Reviews): string[] => {
    const issues: string[] = [];
    const ids = new Set(strings.map((s) => s.id));
    for (const id of Object.keys(prov)) if (!ids.has(id)) issues.push(`${id} : provenance d'un cordage absent du catalogue`);
    const cited = new Set<string>();
    for (const s of strings) {
      const published = FIELDS.filter((f) => s[f] !== undefined);
      const e = prov[s.id];
      if (!e) { if (published.length > 0) issues.push(`${s.id} : ${published.length} note(s) publiée(s) sans provenance`); continue; }
      for (const f of FIELDS) {
        if (s[f] === undefined && e.fields[f] !== undefined) issues.push(`${s.id}.${f} : provenance d'une note absente`);
        if (s[f] !== undefined && e.fields[f] === undefined) issues.push(`${s.id}.${f} : note publiée sans provenance`);
      }
      e.reviews.forEach((k) => cited.add(k));
      const revs = e.reviews.map((k) => reviews[k]);
      if (revs.some((r) => !r)) { issues.push(`${s.id} : revue inconnue (${e.reviews.join(', ')})`); continue; }
      if ((e.match === 'aucune-revue') !== (e.reviews.length === 0)) issues.push(`${s.id} : statut ${e.match} et ${e.reviews.length} revue(s)`);
      const tester = STRING_TESTER_RATINGS[s.id];
      const comps: Array<[Field, boolean, string | null]> = [];
      for (const f of published) {
        const harm = !!tester && HARM.includes(f);
        // D2 (23/10/2026) : la note de confort recalée vient de la droite de comfort-recalibration.ts, plus d'une comparaison à TW.
        if (f === 'comfort' && Object.prototype.hasOwnProperty.call(COMFORT_RECALIBRATED, s.id)) { comps.push([f, harm, 'recalee-twu']); continue; }
        const v = harm ? tester.before10[f as HarmonizedField] : s[f];
        if (v === undefined) { comps.push([f, harm, null]); continue; }
        const cats = P.FIELD_TO_TW[f];
        let c: string;
        if (!cats) c = 'sans-categorie';
        else if (e.match === 'aucune-revue') c = 'sans-test';
        else if (e.match === 'non-etabli') c = 'non-etabli';
        else {
          const per = revs.flatMap((r) => {
            const cat = cats.find((k) => r.scores[k] !== undefined);
            if (!cat || r.scale === null) return [];
            const tw = r.scale === 100 ? r.scores[cat] / 10 : r.scores[cat];
            const d = Math.abs(v - tw);
            return [{ tw, cls: d < 0.05 ? 'identique' : d <= 0.5 + 1e-9 ? 'proche' : 'ecart' }];
          });
          const classes = new Set(per.map((p) => p.cls));
          c = per.length === 0 ? 'sans-test' : classes.has('identique') ? 'identique'
            : new Set(per.map((p) => p.tw)).size > 1 && classes.size > 1 ? 'non-etabli' : per[0].cls;
        }
        comps.push([f, harm, c]);
      }
      const systematic = comps.filter(([, , c]) => c === 'identique').length >= P.MIN_IDENTICAL_FOR_TW;
      for (const [f, harm, c] of comps) {
        const base = c === null ? null : c === 'recalee-twu' ? c : c === 'identique' && systematic ? 'tw' : `inconnue:${c}`;
        const expected = base === null ? 'testeurs' : harm ? `harmonisee+${base}` : base;
        if (e.fields[f] !== expected) issues.push(`${s.id}.${f} : « ${e.fields[f]} » enregistré, « ${expected} » recalculé depuis les données`);
      }
    }
    for (const [k, r] of Object.entries(reviews)) {
      const vals = Object.values(r.scores);
      if (!cited.has(k)) issues.push(`revue ${k} citée par aucune fiche`);
      if (!r.url.startsWith('https://www.tennis-warehouse.com/')) issues.push(`revue ${k} hors de tennis-warehouse.com`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(r.consultedAt) || (r.reviewDate !== null && !/^\d{4}-\d{2}$/.test(r.reviewDate))) issues.push(`revue ${k} : date mal formée`);
      if ((r.scale === null) !== (vals.length === 0) || vals.some((v) => !(v >= 0 && v <= (r.scale ?? 0)))) issues.push(`revue ${k} : scores hors échelle ou échelle absente`);
    }
    return issues;
  };
  // (d) aucune surface du site ne lit la provenance ni ne publie une URL de revue.
  const MARKER = /string-ratings-provenance|STRING_RATINGS_PROVENANCE|TW_REVIEWS/;
  const scanDisplay = (files: { path: string; src: string }[]) =>
    files.filter((f) => f.path !== 'src/data/string-ratings-provenance.ts' && MARKER.test(f.src)).map((f) => `${f.path} lit la provenance des notes`);
  const walkSrc = (d: string): string[] =>
    readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walkSrc(`${d}/${n}`) : [`${d}/${n}`]));
  const surfaces = [...walkSrc('src'), ...walkSrc('scripts/catalog'), ...walkSrc('scripts/en-products'), ...walkSrc('public/js')]
    .filter((f) => /\.(tsx?|m?js)$/.test(f)).map((p) => ({ path: p, src: readFileSync(p, 'utf8') }));
  const issues = [...checkProvenance(stringsDatabase, P.STRING_RATINGS_PROVENANCE, P.TW_REVIEWS), ...scanDisplay(surfaces)];
  const reviewPaths = Object.values(P.TW_REVIEWS).map((r) => r.url.replace('https://www.tennis-warehouse.com', '').split('?')[0]);
  const { stringPage } = await import('./en-products/build-en-product-pages.mjs');
  const enStrings = buildCatalog(racquetsDatabase, stringsDatabase).strings as Array<{ id: string }>;
  const published = [serializeCatalog(buildCatalog(racquetsDatabase, stringsDatabase)), ...enStrings.map((x) => (stringPage as (s: unknown) => string)(x))].join('\n');
  for (const p of reviewPaths) if (published.includes(p)) issues.push(`URL de revue TW publiée sur le site (catalogue ou fiche EN) : ${p}`);
  // (d bis, 22/10/2026) l'export catalog.json porte la NATURE des notes (`rating_basis`), jamais un code de provenance ni une clé
  // qui en annonce une : la nature se déduit de la liste des 18, pas de ce fichier.
  const PROVENANCE_CODE = /^(tw|testeurs|inconnue:[a-z-]+|harmonisee\+[a-z:-]+)$/;
  const exportLeaks = (json: string): string[] => {
    const found: string[] = [];
    JSON.parse(json, (k, v) => {
      if (/provenance|reviews?$/i.test(k)) found.push(`clé « ${k} » dans l'export`);
      if (typeof v === 'string' && PROVENANCE_CODE.test(v)) found.push(`code de provenance « ${k} = ${v} » dans l'export`);
      return v;
    });
    return found;
  };
  const exported = serializeCatalog(buildCatalog(racquetsDatabase, stringsDatabase));
  issues.push(...exportLeaks(exported));
  issues.forEach((i) => fail(`provenance des notes : ${i}`));
  // Tests négatifs : chaque altération doit être détectée.
  const triax = stringsDatabase.find((s) => s.id === 'tecnifibre-triax')!;
  const nudged = stringsDatabase.map((s) => (s === triax ? { ...s, comfort: (s.comfort ?? 0) + 0.1 } : s));
  const without = { ...P.STRING_RATINGS_PROVENANCE, 'wilson-nxt': { ...P.STRING_RATINGS_PROVENANCE['wilson-nxt'], fields: { ...P.STRING_RATINGS_PROVENANCE['wilson-nxt'].fields, power: undefined } } };
  const ghost = { ...P.STRING_RATINGS_PROVENANCE, 'solinco-revolution': { ...P.STRING_RATINGS_PROVENANCE['solinco-revolution'], fields: { ...P.STRING_RATINGS_PROVENANCE['solinco-revolution'].fields, versatility: 'inconnue:sans-categorie' as const } } };
  const promoted = { ...P.STRING_RATINGS_PROVENANCE, 'luxilon-original': { ...P.STRING_RATINGS_PROVENANCE['luxilon-original'], fields: { ...P.STRING_RATINGS_PROVENANCE['luxilon-original'].fields, control: 'tw' as const } } };
  const negatives: Array<[string, string[], string]> = [
    ['note reprise de TW retouchée (+0,1)', checkProvenance(nudged, P.STRING_RATINGS_PROVENANCE, P.TW_REVIEWS), 'tecnifibre-triax.comfort'],
    ['note publiée sans provenance', checkProvenance(stringsDatabase, without, P.TW_REVIEWS), 'wilson-nxt.power'],
    ["provenance d'une note absente", checkProvenance(stringsDatabase, ghost, P.TW_REVIEWS), 'solinco-revolution.versatility'],
    ['égalité isolée promue en reprise TW', checkProvenance(stringsDatabase, promoted, P.TW_REVIEWS), 'luxilon-original.control'],
    ['composant du site lisant la provenance', scanDisplay([{ path: 'src/app/x.tsx', src: "import { STRING_RATINGS_PROVENANCE } from '@/data/string-ratings-provenance';" }]), 'src/app/x.tsx'],
    ["export : nature remplacée par un code de provenance", exportLeaks(exported.replace('"rating_basis":"editorial"', '"rating_basis":"inconnue:ecart"')), 'inconnue:ecart'],
    ["export : clé de provenance ajoutée", exportLeaks(exported.replace('"rating_basis":', '"rating_provenance":"x","rating_basis":')), 'rating_provenance'],
  ];
  for (const [name, found, needle] of negatives) {
    if (!found.some((i) => i.includes(needle))) fail(`provenance des notes : garde-fou muet sur « ${name} » (${needle})`);
  }
  if (failures.length === before) {
    const codes = Object.values(P.STRING_RATINGS_PROVENANCE).flatMap((e) => Object.values(e.fields)) as string[];
    const n = (re: RegExp) => codes.filter((c) => re.test(c)).length;
    ok(`provenance des notes : ${Object.keys(P.STRING_RATINGS_PROVENANCE).length} cordages, ${codes.length} notes publiées décrites ` +
      `(${n(/^tw$/)} reprises TW établies, ${n(/^harmonisee\+/)} harmonisées, ${n(/^testeurs$/)} testeurs seuls, ${n(/^inconnue:/)} de source inconnue, ${n(/recalee-twu$/)} notes de confort recalées sur la rigidité mesurée, D2), ` +
      `${Object.keys(P.TW_REVIEWS).length} revues TW, recalcul identique, aucune surface du site ne lit la provenance, l'export ne porte que la nature des notes, ${negatives.length} tests négatifs détectés`);
  }
}

// ---------------------------------------------------------------------------
// 13 ter. RIGIDITÉS DE LABORATOIRE, champ `stiffness` (C2, 10/10/2026)
// ---------------------------------------------------------------------------
// src/data/string-stiffness-provenance.ts consigne, pour chaque fiche réappariée sur le couple exact
// (modèle, jauge), les mesures TWU et le sort de la rigidité : appliquée, retenue (la règle C la BAISSERAIT,
// GO de Pierre requis) ou en quarantaine. RÈGLE C (décision de Pierre du 10/10/2026) : rigidité = mesure de la
// jauge la plus rigide mesurée. Échoue si : (a) une fiche « appliquée » n'a pas pour rigidité la mesure TWU
// enregistrée ou ne respecte pas sa règle (jauge unique ; plancher = toutes les jauges mesurées, toutes plus
// rigides que l'ancienne valeur, valeur la plus basse ; plus-rigide = la plus haute des mesures) ; (b) une rigidité
// baisse sans GO enregistré (règle 2), un ancien identifiant fusionné retrouve une valeur inférieure à celle
// d'avant la fusion, une fiche est « retenue » alors que C la hausserait, ou une fiche non appliquée a bougé en
// silence ; (c) une mesure n'est pas celle du modèle exact, d'une jauge de la fiche, ni retrouvée (valeur, 51 lbs /
// Fast, matière, jauge nominale) dans le relevé TWU COMPLET versionné (D0) et la copie des polyesters ; (d) une surface
// du site importe la provenance. Chaque garde est rejouée sur une copie altérée : un garde-fou muet fait échouer l'audit.
{
  const before = failures.length;
  const SP = await import('../src/data/string-stiffness-provenance');
  type SProv = Readonly<Record<string, (typeof SP.STRING_STIFFNESS_PROVENANCE)[string]>>;
  type TwuRow = { name: string; model?: string; suffix?: string | null; refTensionLbs: number; swingSpeed: string; material: string | null; stiffnessLbIn: number; gaugeNominalMm?: number | null };
  const load = (p: string) => new Map((JSON.parse(readFileSync(p, 'utf8')).records as TwuRow[]).map((r) => [r.name, r]));
  const SV = SP.STIFFNESS_SOURCE.fullSurvey;
  const surveyRows = (JSON.parse(readFileSync(SV.file, 'utf8')).records as TwuRow[]);
  const twuRef = load(SP.STIFFNESS_SOURCE.versionedCopy); // 480 polyesters du 08/08, sans jauge nominale
  const surveyRef = load(SV.file); // le relevé COMPLET du 29/09 (788 enregistrements, toutes matières, jauge nominale) — D0
  // TWU range multifilaments et synthétiques sous « Nylon… » : la matière se vérifie par famille, pas par égalité.
  const MATERIALS: Record<string, RegExp> = { Polyester: /^Polyester$/, 'Natural Gut': /^Gut$/, Multifilament: /^(Nylon|Polyolefin)/, Synthetic: /^(Nylon|Polyolefin)/ };
  const fold = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  // Les quatre formats de suffixe du relevé : « 16 », « 16L (1.30) », « 17/1.24 » et (lot 3) la jauge seule, « 1.25 » (intitulé sans calibre).
  const TWU_SUFFIX = /\s+(?:\d{2}L?(?:\s*\((\d\.\d+)\)|\s*\/\s*(\d\.\d+))?|(\d\.\d+))$/;
  // Appariement STRICT, recalculé depuis le relevé versionné (jamais lu dans la provenance) : par jauge de la fiche, l'UNIQUE ligne du modèle
  // exact (suffixe reconnu), de cette jauge nominale (± 0,005 mm) et de la même matière. Deux lignes ou aucune : jauge non établie.
  // Seule exception (lot 3) : les lignes de la liste blanche MANUAL_PAIRINGS, appariées à la main (vérifiées par checkManualPairings).
  type Pairable = { id?: string; brand: string; model: string; type: string; gauges: string[] };
  const modelRows = (s: Pairable) => [
    ...surveyRows.filter((r) => r.suffix != null && r.gaugeNominalMm != null
      && MATERIALS[s.type]?.test(r.material ?? '') === true && fold(r.model ?? '') === fold(`${s.brand} ${s.model}`)),
    ...surveyRows.filter((r) => r.gaugeNominalMm != null && MATERIALS[s.type]?.test(r.material ?? '') === true
      && SP.MANUAL_PAIRINGS.some((p) => p.id === s.id && p.twu === r.name)),
  ];
  const strictTable = (s: Pairable): Map<string, number> => {
    const rows = modelRows(s);
    return new Map(s.gauges.flatMap((g): [string, number][] => {
      const l = rows.filter((r) => Math.abs(r.gaugeNominalMm! - Number(g)) <= 0.005);
      return l.length === 1 ? [[g, l[0].stiffnessLbIn]] : [];
    }));
  };
  // GARDE DE SÉRIE SUSPECTE (lot 3) : une mesure est « contredite » si une jauge plus épaisse du même modèle (hors fiche comprise) a été
  // mesurée plus souple. Série non monotone = au moins une inversion. Une hausse est défendable si (B) la mesure la plus rigide n'est contredite
  // par aucune jauge plus épaisse, ou (A) la plus rigide des mesures non contredites de la fiche reste >= la valeur d'avant.
  const suspectGuard = (s: Pairable, before: number) => {
    const rows = modelRows(s), table = strictTable(s);
    const gs = [...new Set(rows.map((r) => r.gaugeNominalMm!))].sort((a, b) => a - b);
    const hi = (g: number) => Math.max(...rows.filter((r) => r.gaugeNominalMm === g).map((r) => r.stiffnessLbIn));
    const lo = (g: number) => Math.min(...rows.filter((r) => r.gaugeNominalMm === g).map((r) => r.stiffnessLbIn));
    const suspect = table.size > 0 && gs.some((g, i) => i > 0 && hi(gs[i - 1]) > lo(g));
    const contradicted = (g: string) => rows.some((r) => r.gaugeNominalMm! > Number(g) + 0.005 && r.stiffnessLbIn < table.get(g)!);
    const top = table.size > 0 ? Math.max(...table.values()) : NaN;
    const maxHolds = [...table].some(([g, v]) => v === top && !contradicted(g)); // (B)
    const free = [...table].filter(([g]) => !contradicted(g)).map(([, v]) => v);
    const supportHolds = free.length > 0 && Math.max(...free) >= before; // (A)
    return { suspect, top, holds: !suspect || maxHolds || supportHolds, maxHolds, supportHolds };
  };
  const checkStiffness = (strings: readonly (typeof stringsDatabase)[number][], prov: SProv, ref: Map<string, TwuRow>,
    aliases: Readonly<Record<string, string>> = LEGACY_STRING_ALIASES, cited: Map<string, TwuRow> = surveyRef): string[] => {
    const issues: string[] = [];
    for (const [id, e] of Object.entries(prov)) {
      const s = strings.find((x) => x.id === id);
      // Une fiche fusionnée depuis (alias hérité) garde son entrée comme historique et comme PLANCHER : ses configurations
      // enregistrées retrouvent la fiche conservée, dont la rigidité ne doit pas être inférieure (règle 2).
      if (!s) {
        const target = strings.find((x) => x.id === aliases[id]);
        if (aliases[id] === undefined) issues.push(`${id} : provenance d'un cordage absent du catalogue`);
        else if (target && target.stiffness < e.before && !e.loweringApprovedBy) {
          issues.push(`${id} : ancien identifiant fusionné dans ${target.id} : ses configurations passeraient de ${e.before} à ${target.stiffness} lb/in sans GO de Pierre (règle 2)`);
        }
        continue;
      }
      if (!e.note.trim()) issues.push(`${id} : motif absent`);
      const seen = new Set<string>();
      for (const m of e.measures) {
        // Modèle EXACT : « Black Code » ne prend pas « Black Code 4S 17 (1.25) », seul le calibre suit le nom ; casse,
        // accents et tirets ne comptent pas (« Volkl Power-Fiber II » = « Völkl Power Fiber II »). Seule exception au motif strict :
        // une mesure marquée `pairing: 'manuel'`, dont l'identité est contrôlée par checkManualPairings (liste blanche datée et motivée).
        const sfx = TWU_SUFFIX.exec(m.twu);
        if (m.pairing === 'manuel') { /* identité : checkManualPairings ; valeur, conditions et jauge : ci-dessous, comme toute mesure */ }
        else if (!sfx || fold(m.twu.slice(0, sfx.index)) !== fold(`${s.brand} ${s.model}`)) issues.push(`${id} : ligne TWU « ${m.twu} » d'un autre modèle`);
        else if ((sfx[1] ?? sfx[2] ?? sfx[3]) !== undefined && Math.abs(Number(sfx[1] ?? sfx[2] ?? sfx[3]) - Number(m.gauge)) > 0.005) {
          issues.push(`${id} : « ${m.twu} » mesurée en ${sfx[1] ?? sfx[2] ?? sfx[3]} mm, enregistrée en ${m.gauge}`);
        }
        if (!s.gauges.includes(m.gauge)) issues.push(`${id} : jauge ${m.gauge} absente de la fiche (${s.gauges.join(', ')})`);
        if (seen.has(m.gauge)) issues.push(`${id} : jauge ${m.gauge} mesurée deux fois`);
        seen.add(m.gauge);
        const c = cited.get(m.twu), r = ref.get(m.twu);
        if (!c || c.stiffnessLbIn !== m.lbIn || (s.type === 'Polyester' && (!r || r.stiffnessLbIn !== m.lbIn))) {
          issues.push(`${id} : « ${m.twu} » = ${m.lbIn} lb/in absente de la copie versionnée du relevé TWU${c ? ` (${c.stiffnessLbIn} publié)` : ''}`);
        } else if (c.refTensionLbs !== SP.STIFFNESS_SOURCE.referenceTensionLbs || c.swingSpeed !== SP.STIFFNESS_SOURCE.swingSpeed || !MATERIALS[s.type]?.test(c.material ?? '')) {
          issues.push(`${id} : « ${m.twu} » hors conditions de référence ou d'un autre matériau (${c.refTensionLbs} lbs, ${c.swingSpeed}, ${c.material})`);
        } else if (c.gaugeNominalMm == null || Math.abs(c.gaugeNominalMm - Number(m.gauge)) > 0.005) {
          issues.push(`${id} : « ${m.twu} » : jauge nominale TWU ${c.gaugeNominalMm} mm, enregistrée en ${m.gauge}`);
        }
      }
      const lbs = e.measures.map((m) => m.lbIn);
      const top = lbs.length > 0 ? Math.max(...lbs) : undefined;
      const floorHolds = lbs.length > 0 && s.gauges.every((g) => e.measures.some((m) => m.gauge === g)) && Math.min(...lbs) > e.before;
      if (e.status === 'appliquee') {
        const used = e.measures.find((m) => m.gauge === e.appliedGauge);
        if (!used) { issues.push(`${id} : jauge appliquée ${e.appliedGauge} sans mesure enregistrée`); continue; }
        if (s.stiffness !== used.lbIn) issues.push(`${id} : rigidité ${s.stiffness} ≠ mesure TWU enregistrée ${used.lbIn} (« ${used.twu} »)`);
        if (e.rule === undefined) issues.push(`${id} : règle d'application absente`);
        if (e.rule === 'jauge-unique' && s.gauges.length !== 1) issues.push(`${id} : règle « jauge-unique » sur ${s.gauges.length} jauges`);
        if (e.rule === 'plancher' && !(floorHolds && used.lbIn === Math.min(...lbs))) {
          issues.push(`${id} : règle « plancher » non remplie (toutes les jauges mesurées, toutes > ${e.before}, valeur la plus basse)`);
        }
        if (e.rule === 'plus-rigide' && used.lbIn !== top) issues.push(`${id} : règle « plus-rigide » non remplie (la mesure la plus rigide est ${top}, appliquée : ${used.lbIn})`);
        if (s.stiffness < e.before && !e.loweringApprovedBy) issues.push(`${id} : rigidité abaissée de ${e.before} à ${s.stiffness} sans GO de Pierre (règle 2)`);
        // Garde de série suspecte (lot 3) : rejouée depuis le relevé. Une hausse qui ne la satisfait pas exige une exemption datée ; une exemption inutile échoue.
        const guard = suspectGuard(s, e.before);
        if (guard.suspect && !guard.holds && !e.suspectGuardExemption) {
          issues.push(`${id} : série suspecte : la hausse repose sur une mesure contredite par une jauge plus épaisse et aucune mesure non contredite ne l'appuie (garde de série suspecte), sans exemption datée`);
        }
        if (e.suspectGuardExemption && (!guard.suspect || guard.holds)) issues.push(`${id} : exemption de la garde de série suspecte inutile (la garde est satisfaite)`);
      } else {
        if (s.stiffness !== e.before) issues.push(`${id} : « ${e.status} » mais la rigidité a bougé (${e.before} -> ${s.stiffness}) sans passer par « appliquee »`);
        if (e.status === 'quarantaine' && e.measures.length > 0) issues.push(`${id} : en quarantaine avec des mesures`);
        if (e.status === 'quarantaine' && strictTable(s).size > 0) issues.push(`${id} : en quarantaine alors que l'appariement strict établit ${strictTable(s).size} mesure(s) (modèle exact, jauge nominale, matière)`);
        if (e.suspectGuardExemption) issues.push(`${id} : exemption de la garde de série suspecte sur une fiche non appliquée`);
        if (e.status === 'retenue-serie-suspecte') {
          const guard = suspectGuard(s, e.before);
          if (e.measures.length === 0) issues.push(`${id} : retenue sans mesure`);
          if (!(guard.top > e.before)) issues.push(`${id} : retenue (série suspecte) sans hausse : la règle C ne dépasse pas ${e.before}`);
          else if (guard.holds) issues.push(`${id} : hausse applicable (la garde de série suspecte est satisfaite : ${guard.top} > ${e.before}), mais non appliquée`);
        }
        if (e.status === 'retenue-jauge' && e.measures.length === 0) issues.push(`${id} : retenue sans mesure`);
        if (e.status === 'retenue-jauge' && top !== undefined && top >= e.before) {
          issues.push(`${id} : hausse applicable sans choix de jauge (règle C : ${top} ≥ ${e.before}), mais non appliquée`);
        }
      }
    }
    return issues;
  };
  // APPARIEMENT MANUEL (lot 3) : la liste blanche MANUAL_PAIRINGS est la SEULE exception au motif strict d'intitulé. Échoue si : (a) elle compte plus
  // d'UNE entrée ; (b) une entrée n'a pas de date (AAAA-MM-JJ), de décideur ou de motif (>= 60 caractères) ; (c) une mesure marquée `pairing: 'manuel'`
  // n'y figure pas, ou une entrée n'est utilisée par aucune mesure ; (d) la ligne n'est pas dans le relevé versionné, ou le motif strict la reconnaît déjà
  // (exception inutile), ou son intitulé n'est pas « <modèle> <calibre> <un mot> », ou sa matière n'est pas celle du type de la fiche, ou sa jauge
  // nominale n'est pas la jauge déclarée, elle-même jauge de la fiche, ou elle n'est pas la seule ligne de même matière à cette jauge.
  const checkManualPairings = (strings: readonly (typeof stringsDatabase)[number][], prov: SProv, pairings: readonly (typeof SP.MANUAL_PAIRINGS)[number][] = SP.MANUAL_PAIRINGS): string[] => {
    const out: string[] = [];
    if (pairings.length > 1) out.push(`appariement manuel : ${pairings.length} entrées, une seule exception au motif strict est admise`);
    const flagged = Object.entries(prov).flatMap(([id, e]) => e.measures.filter((m) => m.pairing === 'manuel').map((m) => ({ id, m })));
    for (const { id, m } of flagged) {
      if (!pairings.some((p) => p.id === id && p.twu === m.twu && p.gauge === m.gauge)) out.push(`${id} : mesure « ${m.twu} » marquée appariement manuel, absente de la liste blanche`);
    }
    for (const p of pairings) {
      const where = `appariement manuel ${p.id}`;
      const s = strings.find((x) => x.id === p.id);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) out.push(`${where} : date absente ou mal formée`);
      if (!p.decidedBy.trim()) out.push(`${where} : décideur absent`);
      if (p.reason.trim().length < 60) out.push(`${where} : motif absent ou trop court`);
      if (!flagged.some((f) => f.id === p.id && f.m.twu === p.twu && f.m.gauge === p.gauge)) out.push(`${where} : aucune mesure de la provenance ne l'utilise`);
      if (!s) { out.push(`${where} : fiche absente du catalogue`); continue; }
      if (!s.gauges.includes(p.gauge)) out.push(`${where} : jauge ${p.gauge} absente de la fiche (${s.gauges.join(', ')})`);
      const r = surveyRef.get(p.twu);
      if (!r) { out.push(`${where} : ligne « ${p.twu} » absente du relevé versionné`); continue; }
      if (r.suffix != null) out.push(`${where} : exception inutile, le motif strict reconnaît déjà « ${p.twu} »`);
      if (!MATERIALS[s.type]?.test(r.material ?? '')) out.push(`${where} : matière TWU « ${r.material} » incompatible avec le type ${s.type}`);
      if (r.gaugeNominalMm == null || Math.abs(r.gaugeNominalMm - Number(p.gauge)) > 0.005) out.push(`${where} : jauge nominale TWU ${r.gaugeNominalMm} mm ≠ jauge déclarée ${p.gauge}`);
      const prefix = fold(`${s.brand} ${s.model}`), name = fold(r.name);
      if (!name.startsWith(`${prefix} `) || !/^\d{2}l? [a-z]+$/.test(name.slice(prefix.length + 1))) out.push(`${where} : l'intitulé « ${p.twu} » n'est pas « <modèle> <calibre> <un mot> »`);
      const same = surveyRows.filter((x) => fold(x.name).startsWith(`${prefix} `) && MATERIALS[s.type]?.test(x.material ?? '') && x.gaugeNominalMm != null && Math.abs(x.gaugeNominalMm - Number(p.gauge)) <= 0.005);
      if (same.length !== 1) out.push(`${where} : ${same.length} lignes de même matière à la jauge ${p.gauge} (ligne unique exigée)`);
    }
    return out;
  };
  // (d) aucune surface du site n'importe la provenance (les commentaires peuvent citer le fichier).
  const IMPORTS = /from\s*['"][^'"]*string-stiffness-provenance['"]|import\(\s*['"][^'"]*string-stiffness-provenance['"]\s*\)|STRING_STIFFNESS_PROVENANCE|STIFFNESS_SOURCE|MANUAL_PAIRINGS/;
  const scanSurfaces = (files: { path: string; src: string }[]) =>
    files.filter((f) => f.path !== 'src/data/string-stiffness-provenance.ts' && IMPORTS.test(f.src)).map((f) => `${f.path} lit la provenance des rigidités`);
  const walkAll = (d: string): string[] =>
    readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walkAll(`${d}/${n}`) : [`${d}/${n}`]));
  const surfaceFiles = [...walkAll('src'), ...walkAll('scripts/catalog'), ...walkAll('scripts/en-products'), ...walkAll('public/js')]
    .filter((f) => /\.(tsx?|m?js)$/.test(f)).map((p) => ({ path: p, src: readFileSync(p, 'utf8') }));
  const P0 = SP.STRING_STIFFNESS_PROVENANCE;
  const issues = [...checkStiffness(stringsDatabase, P0, twuRef), ...checkManualPairings(stringsDatabase, P0), ...scanSurfaces(surfaceFiles)];
  issues.forEach((i) => fail(`rigidités de laboratoire : ${i}`));
  // Tests négatifs : chaque altération doit être détectée.
  const withStiffness = (id: string, v: number) => stringsDatabase.map((s) => (s.id === id ? { ...s, stiffness: v } : s));
  const patch = (id: string, f: (e: SProv[string]) => SProv[string]): SProv => ({ ...P0, [id]: f(P0[id]) });
  const negatives: Array<[string, string[], string]> = [
    ['rigidité appliquée retouchée (+0,1)', checkStiffness(withStiffness('luxilon-savage', 234.4), P0, twuRef), 'luxilon-savage : rigidité'],
    ['mesure inventée, absente du relevé TWU', checkStiffness(stringsDatabase, patch('luxilon-savage', (e) => ({ ...e, measures: [{ ...e.measures[0], lbIn: 236 }] })), twuRef), 'absente de la copie versionnée'],
    ['fiche retenue appliquée en silence', checkStiffness(withStiffness('head-hawk', 204.6), patch('head-hawk', (e) => ({ ...e, status: 'retenue-jauge' as const })), twuRef), 'head-hawk : « retenue-jauge »'],
    ['baisse appliquée sans GO (règle 2)', checkStiffness(stringsDatabase, patch('luxilon-savage', (e) => ({ ...e, before: 250 })), twuRef), 'sans GO de Pierre'],
    ['plancher sur des jauges non toutes mesurées', checkStiffness(stringsDatabase, patch('tecnifibre-black-code-4s', (e) => ({ ...e, rule: 'plancher' as const, appliedGauge: '1.25', measures: e.measures.filter((m) => m.gauge !== '1.30') })), twuRef), 'règle « plancher » non remplie'],
    ['ligne TWU d\'un autre modèle', checkStiffness(stringsDatabase, patch('tecnifibre-black-code', (e) => ({ ...e, measures: [{ twu: 'Tecnifibre Black Code 4S 17 (1.25)', gauge: '1.24', lbIn: 209.2 }, ...e.measures.slice(1)] })), twuRef), 'd\'un autre modèle'],
    ['jauge absente de la fiche', checkStiffness(stringsDatabase, patch('gamma-moto', (e) => ({ ...e, measures: [{ ...e.measures[0], gauge: '1.30' }, e.measures[1]] })), twuRef), 'absente de la fiche'],
    ['hausse sûre laissée de côté', checkStiffness(withStiffness('tecnifibre-black-code-4s', 200), patch('tecnifibre-black-code-4s', (e) => ({ ...e, status: 'retenue-jauge' as const })), twuRef), 'hausse applicable sans choix de jauge'],
    ['surface qui importe la provenance', scanSurfaces([{ path: 'src/app/x.tsx', src: "import { STRING_STIFFNESS_PROVENANCE } from '@/data/string-stiffness-provenance';" }]), 'src/app/x.tsx'],
    ['provenance d\'une fiche absente sans alias', checkStiffness(stringsDatabase, { ...P0, 'cordage-inconnu': P0['luxilon-savage'] }, twuRef), 'cordage-inconnu : provenance d\'un cordage absent'],
    ['règle C : une mesure moins rigide retenue', checkStiffness(withStiffness('head-hawk', 204.6), patch('head-hawk', (e) => ({ ...e, appliedGauge: '1.25' })), twuRef), 'règle « plus-rigide » non remplie'],
    ['règle C : une baisse sans GO (règle 2)', checkStiffness(stringsDatabase, patch('head-hawk', (e) => ({ ...e, before: 250 })), twuRef), 'head-hawk : rigidité abaissée'],
    ['ancien identifiant : valeur d\'avant la fusion non respectée', checkStiffness(stringsDatabase, patch('tecnifibre-4s', (e) => ({ ...e, before: 250 })), twuRef), 'tecnifibre-4s : ancien identifiant fusionné'],
    ['jauge nominale TWU différente de celle enregistrée', checkStiffness(stringsDatabase, patch('gamma-moto', (e) => ({ ...e, measures: [e.measures[0], { ...e.measures[1], gauge: '1.24' }] })), twuRef), 'jauge nominale TWU'],
    ['matière TWU incompatible avec le type de la fiche', checkStiffness(stringsDatabase.map((s) => (s.id === 'wilson-nxt' ? { ...s, type: 'Natural Gut' as const } : s)), P0, twuRef), 'd\'un autre matériau'],
  ];
  for (const [name, found, needle] of negatives) {
    if (!found.some((i) => i.includes(needle))) fail(`rigidités de laboratoire : garde-fou muet sur « ${name} » (${needle})`);
  }
  // Lot 3 (10/10/2026) : baisse sans GO, hausse partielle, fiche à série suspecte et garde, quarantaine, intitulé à jauge seule. Chaque essai part de
  // l'entrée réelle (valeurs, mesures) mais FORCE le statut en jeu, pour ne dépendre ni du statut réel de la fiche ni de sa valeur ; s'il ne peut pas
  // être construit (entrée de provenance retirée), il est signalé proprement au lieu de faire planter l'audit.
  const withEntry = (id: string, over: Partial<SProv[string]>): SProv => ({ ...P0, [id]: { ...P0[id], ...over } });
  const APPLIED = { status: 'appliquee' as const, rule: 'plus-rigide' as const };
  const RETAINED = { status: 'retenue-serie-suspecte' as const };
  const lot3Negatives: Array<[string, () => string[], string]> = [
    ['baisse sans GO (règle 2)', () => checkStiffness(stringsDatabase, withEntry('luxilon-4g', { before: 300 }), twuRef), 'luxilon-4g : rigidité abaissée'],
    ['hausse partielle, valeur intermédiaire entre l\'ancienne et la mesure', () => checkStiffness(withStiffness('tecnifibre-razor-soft', 200), P0, twuRef), 'tecnifibre-razor-soft : rigidité 200'],
    ['hausse partielle, jauge la moins rigide retenue', () => checkStiffness(withStiffness('luxilon-4g', 258.9), withEntry('luxilon-4g', { ...APPLIED, appliedGauge: '1.25' }), twuRef), 'luxilon-4g : règle « plus-rigide » non remplie'],
    ['hausse laissée de côté (fiche retenue sans série suspecte)', () => checkStiffness(withStiffness('babolat-revenge', 230), withEntry('babolat-revenge', { ...RETAINED, before: 230 }), twuRef), 'babolat-revenge : hausse applicable'],
    ['fiche à série suspecte, hausse sans appui', () => checkStiffness(withStiffness('solinco-x-natural', 158.9), withEntry('solinco-x-natural', { ...APPLIED, appliedGauge: '1.20', before: 147 }), twuRef), 'solinco-x-natural : série suspecte'],
    ['fiche retenue alors que la garde est satisfaite', () => checkStiffness(withStiffness('luxilon-element', 190), withEntry('luxilon-element', { ...RETAINED, before: 190 }), twuRef), 'luxilon-element : hausse applicable'],
    ['fiche retenue sans hausse', () => checkStiffness(withStiffness('solinco-x-natural', 147), withEntry('solinco-x-natural', { ...RETAINED, before: 160 }), twuRef), 'retenue (série suspecte) sans hausse'],
    ['exemption de garde inutile', () => checkStiffness(stringsDatabase, withEntry('babolat-revenge', { suspectGuardExemption: 'x' }), twuRef), 'babolat-revenge : exemption'],
    ['exemption de garde retirée', () => checkStiffness(stringsDatabase, withEntry('wilson-nxt', { suspectGuardExemption: undefined }), twuRef), 'wilson-nxt : série suspecte'],
    ['exemption de garde sur une fiche non appliquée', () => checkStiffness(withStiffness('solinco-x-natural', 147), withEntry('solinco-x-natural', { ...RETAINED, before: 147, suspectGuardExemption: 'x' }), twuRef), 'exemption de la garde de série suspecte sur une fiche non appliquée'],
    ['quarantaine alors que l\'appariement strict établit des mesures', () => checkStiffness(withStiffness('luxilon-4g', 265), withEntry('luxilon-4g', { status: 'quarantaine' as const, before: 265, measures: [] }), twuRef), 'luxilon-4g : en quarantaine alors que'],
    ['intitulé à jauge seule d\'un autre modèle', () => checkStiffness(stringsDatabase, withEntry('luxilon-element', { measures: [P0['luxilon-element'].measures[0], { twu: 'Luxilon Element Soft IR 1.27', gauge: '1.30', lbIn: 197.7 }] }), twuRef), 'd\'un autre modèle'],
    ['intitulé à jauge seule, autre jauge enregistrée', () => checkStiffness(stringsDatabase, withEntry('luxilon-element', { measures: [P0['luxilon-element'].measures[0], { ...P0['luxilon-element'].measures[1], gauge: '1.20' }] }), twuRef), 'mesurée en 1.30 mm, enregistrée en 1.20'],
  ];
  for (const [name, run, needle] of lot3Negatives) {
    try {
      if (!run().some((i) => i.includes(needle))) fail(`rigidités de laboratoire : garde-fou muet sur « lot 3 : ${name} » (${needle})`);
    } catch (e) {
      fail(`rigidités de laboratoire : essai négatif « lot 3 : ${name} » impossible à construire (${(e as Error).message}) : l'entrée de provenance qu'il utilise a-t-elle été retirée ?`);
    }
  }
  // Appariement manuel (lot 3) : liste blanche à UNE entrée, datée et motivée. Mêmes principes : fixtures explicites, essai non constructible signalé.
  const MP0 = SP.MANUAL_PAIRINGS[0];
  const RPM = () => P0['babolat-rpm-team'].measures[0];
  const manualNegatives: Array<[string, () => string[], string]> = [
    ['appariement manuel sans motif', () => checkManualPairings(stringsDatabase, P0, [{ ...MP0, reason: '' }]), 'motif absent ou trop court'],
    ['appariement manuel sans date', () => checkManualPairings(stringsDatabase, P0, [{ ...MP0, date: '' }]), 'date absente ou mal formée'],
    ['appariement manuel sans décideur', () => checkManualPairings(stringsDatabase, P0, [{ ...MP0, decidedBy: ' ' }]), 'décideur absent'],
    ['deuxième appariement manuel (une seule exception admise)', () => checkManualPairings(stringsDatabase, P0, [MP0, { ...MP0, id: 'babolat-rpm-soft' }]), 'une seule exception au motif strict'],
    ['mesure manuelle absente de la liste blanche', () => checkManualPairings(stringsDatabase, P0, []), 'absente de la liste blanche'],
    ['entrée de la liste blanche sans mesure en provenance', () => checkManualPairings(stringsDatabase, withEntry('babolat-rpm-team', { measures: [{ ...RPM(), pairing: undefined }] }), [MP0]), 'aucune mesure de la provenance ne l\'utilise'],
    ['ligne absente du relevé versionné', () => { const p = { ...MP0, twu: 'Babolat RPM Team 16 Red' }; return checkManualPairings(stringsDatabase, withEntry('babolat-rpm-team', { measures: [{ ...RPM(), twu: p.twu }] }), [p]); }, 'absente du relevé versionné'],
    ['exception inutile : le motif strict reconnaît déjà la ligne', () => { const p = { ...MP0, twu: 'Babolat RPM Team 17 (1.25)', gauge: '1.25' }; return checkManualPairings(stringsDatabase, withEntry('babolat-rpm-team', { measures: [{ ...RPM(), twu: p.twu, gauge: '1.25' }] }), [p]); }, 'exception inutile'],
    ['jauge nominale TWU différente de la jauge déclarée', () => checkManualPairings(stringsDatabase, withEntry('babolat-rpm-team', { measures: [{ ...RPM(), gauge: '1.25' }] }), [{ ...MP0, gauge: '1.25' }]), 'jauge nominale TWU'],
    ['matière TWU incompatible avec le type de la fiche', () => checkManualPairings(stringsDatabase.map((s) => (s.id === 'babolat-rpm-team' ? { ...s, type: 'Natural Gut' as const } : s)), P0), 'matière TWU'],
    ['mesure à intitulé non reconnu SANS drapeau manuel', () => checkStiffness(stringsDatabase, withEntry('babolat-rpm-team', { measures: [{ ...RPM(), pairing: undefined }] }), twuRef), 'd\'un autre modèle'],
    ['valeur de la mesure manuelle différente du relevé', () => checkStiffness(stringsDatabase, withEntry('babolat-rpm-team', { measures: [{ ...RPM(), lbIn: 281 }] }), twuRef), 'absente de la copie versionnée'],
  ];
  for (const [name, run, needle] of manualNegatives) {
    try {
      if (!run().some((i) => i.includes(needle))) fail(`rigidités de laboratoire : garde-fou muet sur « appariement manuel : ${name} » (${needle})`);
    } catch (e) {
      fail(`rigidités de laboratoire : essai négatif « appariement manuel : ${name} » impossible à construire (${(e as Error).message}) : l'entrée de provenance ou de la liste blanche qu'il utilise a-t-elle été retirée ?`);
    }
  }
  // Cas permis : fiche fusionnée depuis (alias) ; son entrée reste comme historique, sans alerte.
  const afterMerge = checkStiffness(stringsDatabase.filter((s) => s.id !== 'tecnifibre-4s'), P0, twuRef, { ...LEGACY_STRING_ALIASES, 'tecnifibre-4s': 'tecnifibre-black-code-4s' });
  if (afterMerge.length > 0) fail(`rigidités de laboratoire : une fiche fusionnée (alias) fait échouer le contrôle : ${afterMerge[0]}`);
  // Cas permis : fiche retenue parce que la règle C la BAISSERAIT (GO requis) : valeur inchangée, aucune alerte.
  const held = checkStiffness(withStiffness('head-hawk', 250), patch('head-hawk', (e) => ({ ...e, status: 'retenue-jauge' as const, before: 250 })), twuRef);
  if (held.length > 0) fail(`rigidités de laboratoire : une fiche retenue (C la baisserait) fait échouer le contrôle : ${held[0]}`);
  // D0 : le relevé complet versionné est la référence de tout ce qui précède. Contrôlés : nombre d'enregistrements, sha256 du
  // relevé brut RECONSTRUIT depuis les 8 champs bruts (aucun fichier local requis), schéma, champs dérivés de l'intitulé ; et,
  // si le brut local (non versionné) est présent, son sha256 et sa régénération doivent redonner le fichier versionné.
  const RV = await import('./scraper/twu-releve.mts');
  type Survey = { records: any[]; [k: string]: unknown };
  const SHAPE = [...RV.RAW_KEYS, ...RV.DERIVED_KEYS].join();
  const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
  const str = (v: unknown) => typeof v === 'string' && v !== '';
  const orNull = (v: unknown, valid: (x: unknown) => boolean) => v === null || valid(v);
  const rowIssue = (r: any): string | null => {
    if (Object.keys(r).join() !== SHAPE) return "champs ≠ schéma (8 bruts puis 4 dérivés, dans l'ordre)";
    if (r.refTensionLbs !== SP.STIFFNESS_SOURCE.referenceTensionLbs || r.swingSpeed !== SP.STIFFNESS_SOURCE.swingSpeed) return 'hors 51 lbs / Fast';
    if (!str(r.name) || !str(r.model) || !num(r.stiffnessLbIn) || r.stiffnessLbIn <= 0 || !num(r.tensionLossPct)) return 'intitulé, modèle, rigidité ou perte de tension invalide';
    if (!orNull(r.material, str) || !orNull(r.suffix, str) || !orNull(r.calibre, str) || !orNull(r.gaugeNominalMm, num) || !orNull(r.gaugeNameMm, num) || !orNull(r.spinPotential, num)) return 'type de champ';
    if (r.name !== (r.suffix === null ? r.model : `${r.model} ${r.suffix}`)) return 'intitulé ≠ modèle + suffixe';
    const cal = r.suffix?.match(/^\d{2}L?/i)?.[0], mm = r.suffix?.match(/(\d\.\d+)\)?$/)?.[1];
    if (r.calibre !== (cal === undefined ? null : cal.toUpperCase())) return 'calibre ≠ suffixe';
    if (r.gaugeNameMm !== (mm === undefined ? null : Number(mm))) return 'jauge du nom ≠ suffixe';
    return null;
  };
  const checkSurvey = (f: Survey): string[] => {
    const out: string[] = [];
    const rows = Array.isArray(f.records) ? f.records : [];
    if (rows.length !== SV.records || f.rawRecords !== SV.records) out.push(`${rows.length} enregistrements, en-tête ${f.rawRecords}, ancrage ${SV.records}`);
    if (f.rawSha256 !== SV.sha256 || f.retrieved !== SV.retrieved || f.url !== SP.STIFFNESS_SOURCE.url) out.push('en-tête ≠ ancrage (sha256, date, URL) de string-stiffness-provenance.ts');
    const cond = f.conditions as { refTensionLbs?: number; swingSpeed?: string } | undefined;
    if (cond?.refTensionLbs !== SP.STIFFNESS_SOURCE.referenceTensionLbs || cond?.swingSpeed !== SP.STIFFNESS_SOURCE.swingSpeed) out.push("conditions de l'en-tête ≠ 51 lbs / Fast");
    const bad = rows.map((r, i) => [i, rowIssue(r)] as const).filter(([, m]) => m !== null);
    if (bad.length > 0) out.push(`enregistrement ${bad[0][0]} (« ${rows[bad[0][0]].name} ») : ${bad[0][1]}${bad.length > 1 ? ` (+ ${bad.length - 1} autre(s))` : ''}`);
    if (RV.sha256(RV.rawTextOf(rows)) !== SV.sha256) out.push("le relevé brut reconstruit depuis les champs bruts n'a pas le sha256 ancré");
    return out;
  };
  const survey = JSON.parse(readFileSync(SV.file, 'utf8')) as Survey;
  checkSurvey(survey).forEach((i) => fail(`relevé TWU versionné : ${i}`));
  const mutate = (f: (s: Survey) => void): Survey => { const c = structuredClone(survey); f(c); return c; };
  const surveyNegatives: Array<[string, Survey, string]> = [
    ['une rigidité retouchée (+0,1)', mutate((s) => { s.records[10].stiffnessLbIn += 0.1; }), 'sha256'],
    ['un enregistrement retiré', mutate((s) => { s.records.pop(); }), 'enregistrements'],
    ['une vitesse de balayage différente', mutate((s) => { s.records[3].swingSpeed = 'Medium'; }), '51 lbs / Fast'],
    ["un modèle qui n'est plus celui de l'intitulé", mutate((s) => { s.records[5].model += 'X'; }), 'intitulé ≠ modèle'],
    ["un calibre qui n'est plus celui du suffixe", mutate((s) => { s.records.find((r) => r.calibre === '16')!.calibre = '17'; }), 'calibre ≠ suffixe'],
    ['un champ inconnu', mutate((s) => { s.records[0].extra = 1; }), 'champs ≠ schéma'],
    ["un sha256 d'en-tête modifié", mutate((s) => { s.rawSha256 = '0'.repeat(64); }), 'en-tête ≠ ancrage'],
  ];
  for (const [name, f, needle] of surveyNegatives) {
    if (!checkSurvey(f).some((i) => i.includes(needle))) fail(`relevé TWU versionné : garde-fou muet sur « ${name} » (${needle})`);
  }
  const rawBytes = existsSync(SV.raw) ? readFileSync(SV.raw) : null;
  if (rawBytes && RV.sha256(rawBytes) !== SV.sha256) fail(`relevé TWU versionné : le relevé brut local a un autre sha256 (${RV.sha256(rawBytes).slice(0, 7)}…) que l'ancrage`);
  else if (rawBytes && JSON.stringify(RV.normaliseRows(JSON.parse(rawBytes.toString('utf8')))) !== JSON.stringify(survey.records)) {
    fail('relevé TWU versionné : la régénération depuis le relevé brut local diffère du fichier versionné (npx tsx scripts/scraper/twu-releve.mts)');
  }
  if (failures.length === before) {
    const count = (st: string) => Object.values(P0).filter((e) => e.status === st).length;
    const measures = Object.values(P0).reduce((a, e) => a + e.measures.length, 0);
    const merged = Object.keys(P0).filter((id) => !stringsDatabase.some((s) => s.id === id)).length;
    const ruleC = Object.values(P0).filter((e) => e.rule === 'plus-rigide').length;
    const onSuspect = Object.entries(P0).filter(([id, e]) => e.status === 'appliquee' && stringsDatabase.some((s) => s.id === id && suspectGuard(s, e.before).suspect));
    const exempt = onSuspect.filter(([, e]) => e.suspectGuardExemption).length;
    ok(`rigidités de laboratoire : ${Object.keys(P0).length} fiches en provenance (${count('appliquee')} appliquées dont ${ruleC} par la règle C, ${count('retenue-jauge')} retenues car C baisserait, ` +
      `${count('retenue-serie-suspecte')} retenues par la garde de série suspecte, ` +
      `${count('quarantaine')} en quarantaine${merged > 0 ? `, dont ${merged} ancien(s) identifiant(s) fusionné(s) servant de plancher` : ''}), ` +
      `garde de série suspecte rejouée sur ${onSuspect.length} fiches appliquées à série suspecte (${exempt} exemptée(s) par motif daté), appariement manuel : ${SP.MANUAL_PAIRINGS.length} exception au motif strict (${SP.MANUAL_PAIRINGS.map((p) => `${p.id} « ${p.twu} » en ${p.gauge}`).join(', ')}, liste blanche datée et motivée, ${manualNegatives.length} essais négatifs), ${measures} mesures TWU retrouvées dans ${SV.file} ` +
      `(${SV.records} enregistrements, sha256 du brut reconstruit ${SV.sha256.slice(0, 7)}…${SV.sha256.slice(-4)}${rawBytes ? ', = relevé brut local' : ''}) et ${SP.STIFFNESS_SOURCE.versionedCopy} ` +
      `(modèle exact, jauge nominale, matière, ${SP.STIFFNESS_SOURCE.referenceTensionLbs} lbs / ${SP.STIFFNESS_SOURCE.swingSpeed}), ` +
      `aucune baisse sans GO, aucune surface ne lit la provenance, ${negatives.length + lot3Negatives.length + manualNegatives.length + surveyNegatives.length} tests négatifs détectés`);
  }
}

// ---------------------------------------------------------------------------
// 13 quater. RIGIDITÉ PAR JAUGE : `stiffnessByGauge` et `stringStiffnessAt` (D1, 10/10/2026)
// ---------------------------------------------------------------------------
// Table GÉNÉRÉE (scripts/scraper/c2-par-jauge.mts) depuis le relevé TWU complet versionné. Échoue si : (a) une valeur par jauge n'est
// pas celle de l'UNIQUE ligne du relevé de ce modèle exact, de cette jauge nominale (± 0,005 mm) et de la même matière, si une jauge
// établie est omise, ou si une jauge ambiguë (deux lignes) ou d'une autre matière est écrite ; (b) une clé n'est pas une jauge de la
// fiche, ou un hybride porte une table ; (c) le drapeau « suspecte » diffère de la non-monotonie recalculée sur TOUTES les lignes du
// modèle (jauges hors fiche comprises) ; (d) stringStiffnessAt s'écarte du contrat : la mesure pour une jauge mesurée d'une série
// saine, sinon la rigidité de la fiche étiquetée « jauge non mesurée », jamais interpolée ; (e) une fiche appliquée par la règle C
// n'a pas pour rigidité le maximum de sa table, ou sa table contredit la provenance ; (f) une surface du site lit la table (liste
// blanche de deux fichiers jusqu'à D2/D3). Chaque garde est rejouée sur une copie altérée : un garde-fou muet fait échouer l'audit.
{
  const before = failures.length;
  const SP = await import('../src/data/string-stiffness-provenance');
  type Rec = { name: string; model: string; suffix: string | null; material: string | null; gaugeNominalMm: number | null; stiffnessLbIn: number; f: string };
  const fold = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const records = (JSON.parse(readFileSync(SP.STIFFNESS_SOURCE.fullSurvey.file, 'utf8')).records as Rec[]).map((r) => ({ ...r, f: fold(r.model) }));
  const FAMILY: Record<string, RegExp> = { Polyester: /^Polyester$/, 'Natural Gut': /^Gut$/, Multifilament: /^(Nylon|Polyolefin)/, Synthetic: /^(Nylon|Polyolefin)/ };
  type Str = (typeof stringsDatabase)[number];
  const sameMaterial = (s: Str) => (r: Rec) => FAMILY[s.type]?.test(r.material ?? '') === true;
  // Les lignes du modèle : appariement strict, plus la liste blanche MANUAL_PAIRINGS (lot 3 : seule exception, vérifiée par le contrôle 13 ter).
  const modelLines = (s: Str) => [
    ...records.filter((r) => r.suffix !== null && r.gaugeNominalMm !== null && r.f === fold(`${s.brand} ${s.model}`)),
    ...records.filter((r) => r.gaugeNominalMm !== null && SP.MANUAL_PAIRINGS.some((p) => p.id === s.id && p.twu === r.name)),
  ];
  // Table attendue : par jauge de la fiche, l'UNIQUE ligne de même matière (aucune ligne : non mesurée ; deux : ambiguë).
  const expectedTable = (s: Str): Record<string, number> => {
    const lines = modelLines(s);
    return Object.fromEntries(s.gauges.flatMap((g): [string, number][] => {
      const l = lines.filter((r) => Math.abs(r.gaugeNominalMm! - Number(g)) <= 0.005);
      return l.length === 1 && sameMaterial(s)(l[0]) ? [[g, l[0].stiffnessLbIn]] : [];
    }));
  };
  // Non monotone : la mesure la plus basse d'une jauge est sous la plus haute de la jauge précédente (suffit pour toutes les paires).
  const nonMonotone = (s: Str): boolean => {
    const byG = new Map<number, number[]>();
    for (const r of modelLines(s).filter(sameMaterial(s))) byG.set(r.gaugeNominalMm!, [...(byG.get(r.gaugeNominalMm!) ?? []), r.stiffnessLbIn]);
    const g = [...byG.keys()].sort((a, b) => a - b);
    return g.some((x, i) => i > 0 && Math.max(...byG.get(g[i - 1])!) > Math.min(...byG.get(x)!));
  };
  const SYMBOLS = /stiffnessByGauge|stiffness_by_gauge|stringStiffnessAt|STIFFNESS_UNMEASURED_LABEL/;
  const ALLOWED = ['src/data/strings-database.ts', 'scripts/catalog/catalog-json.mjs'];
  const checkByGauge = (strings: readonly Str[], at: typeof stringStiffnessAt, files: { path: string; src: string }[], label: string = STIFFNESS_UNMEASURED_LABEL): string[] => {
    const out: string[] = [];
    if (label !== 'jauge non mesurée') out.push(`étiquette de repli « ${label} » ≠ « jauge non mesurée »`);
    for (const s of strings) {
      const want = expectedTable(s), have: Record<string, number> = s.stiffnessByGauge ?? {};
      if (s.type === 'Hybrid' && Object.keys(have).length > 0) out.push(`${s.id} : un hybride ne peut pas porter de table (aucune ligne TWU de ce modèle)`);
      for (const g of new Set([...Object.keys(want), ...Object.keys(have)])) {
        if (!s.gauges.includes(g)) out.push(`${s.id} : jauge ${g} absente de la fiche (${s.gauges.join(', ')})`);
        else if (have[g] === undefined) out.push(`${s.id} : jauge ${g} établie dans le relevé (${want[g]}) mais omise de la table`);
        else if (want[g] === undefined) out.push(`${s.id} : jauge ${g} = ${have[g]} sans ligne unique de même matière dans le relevé (invention, ambiguïté ou autre matière)`);
        else if (have[g] !== want[g]) out.push(`${s.id} : jauge ${g} = ${have[g]} ≠ relevé ${want[g]}`);
      }
      const suspect = Object.keys(have).length > 0 && nonMonotone(s);
      if (Boolean(s.stiffnessByGaugeSuspect) !== suspect) out.push(`${s.id} : série ${suspect ? 'non monotone non marquée suspecte' : 'monotone ou sans table marquée suspecte'}`);
      // Lot 3 : une hausse établie (règle C, appariement strict) est appliquée ou explicitement retenue en provenance (garde de série suspecte).
      const top = Object.keys(want).length > 0 ? Math.max(...Object.values(want)) : NaN;
      if (top > s.stiffness && SP.STRING_STIFFNESS_PROVENANCE[s.id]?.status !== 'retenue-serie-suspecte') {
        out.push(`${s.id} : hausse applicable (règle C : ${top} > ${s.stiffness}) ni appliquée ni retenue en provenance (série suspecte) : hausse laissée de côté`);
      }
      for (const g of [...s.gauges, '1.275', 'abc']) {
        const r = at(s, g), m = have[g], measured = m !== undefined && !s.stiffnessByGaugeSuspect;
        const wantAt = measured ? { lbIn: m, basis: 'mesure-twu-jauge' } : { lbIn: s.stiffness, basis: m !== undefined ? 'serie-suspecte' : 'jauge-non-mesuree' };
        if (r.lbIn !== wantAt.lbIn || r.basis !== wantAt.basis || (r.basis === 'jauge-non-mesuree' && r.label !== 'jauge non mesurée')) {
          out.push(`${s.id} @${g} : stringStiffnessAt = ${r.lbIn} (${r.basis}, « ${r.label} »), attendu ${wantAt.lbIn} (${wantAt.basis}) : repli = rigidité de la fiche, jamais interpolé`);
        }
        if (Number.isFinite(Number(g)) && at(s, Number(g)).lbIn !== r.lbIn) out.push(`${s.id} @${g} : la jauge numérique donne une autre rigidité que la chaîne`);
      }
    }
    for (const [id, e] of Object.entries(SP.STRING_STIFFNESS_PROVENANCE)) {
      const s = strings.find((x) => x.id === id);
      if (!s || e.status !== 'appliquee') continue;
      for (const m of e.measures) if (s.stiffnessByGauge?.[m.gauge] !== m.lbIn) out.push(`${id} : la mesure de la provenance (${m.gauge} = ${m.lbIn}) n'est pas dans la table`);
      const top = Math.max(...Object.values(s.stiffnessByGauge ?? { none: NaN }));
      if (e.rule !== 'plancher' && s.stiffness !== top) out.push(`${id} : règle C, rigidité ${s.stiffness} ≠ maximum de la table (${top})`);
    }
    for (const f of files) if (!ALLOWED.includes(f.path) && SYMBOLS.test(f.src)) out.push(`${f.path} lit la rigidité par jauge (liste blanche : ${ALLOWED.join(', ')}) : pas avant D2/D3`);
    return out;
  };
  const walkFiles = (d: string): string[] => readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walkFiles(`${d}/${n}`) : [`${d}/${n}`]));
  const surfaces = [...walkFiles('src'), ...walkFiles('scripts/catalog'), ...walkFiles('scripts/en-products'), ...walkFiles('public')]
    .filter((f) => /\.(tsx?|m?js|html?)$/.test(f)).map((p) => ({ path: p, src: readFileSync(p, 'utf8') }));
  checkByGauge(stringsDatabase, stringStiffnessAt, surfaces).forEach((i) => fail(`rigidité par jauge : ${i}`));
  // Tests négatifs : chaque altération doit être détectée.
  const tab = (id: string) => stringsDatabase.find((s) => s.id === id)!.stiffnessByGauge!;
  const mod = (id: string, patch: Partial<Str>): Str[] => stringsDatabase.map((s) => (s.id === id ? { ...s, ...patch } : s));
  const interpolating: typeof stringStiffnessAt = (s, g) => {
    const r = stringStiffnessAt(s, g), v = Object.values(s.stiffnessByGauge ?? {});
    return r.basis === 'jauge-non-mesuree' && v.length > 1 ? { ...r, lbIn: v.reduce((a, b) => a + b, 0) / v.length } : r;
  };
  const none: { path: string; src: string }[] = [];
  const negatives: Array<[string, string[], string]> = [
    ['une valeur par jauge retouchée (+0,1)', checkByGauge(mod('wilson-nxt', { stiffnessByGauge: { ...tab('wilson-nxt'), '1.30': 173.8 } }), stringStiffnessAt, none), 'wilson-nxt : jauge 1.30'],
    ['une jauge établie omise', checkByGauge(mod('wilson-nxt', { stiffnessByGauge: { '1.30': 173.7 } }), stringStiffnessAt, none), 'omise de la table'],
    ['une jauge inventée (non mesurée)', checkByGauge(mod('solinco-hyper-g', { stiffnessByGauge: { ...tab('solinco-hyper-g'), '1.30': 221 } }), stringStiffnessAt, none), 'sans ligne unique'],
    ["une clé qui n'est pas une jauge de la fiche", checkByGauge(mod('wilson-nxt', { stiffnessByGauge: { ...tab('wilson-nxt'), '1.35': 152 } }), stringStiffnessAt, none), 'absente de la fiche'],
    ['une jauge ambiguë (deux lignes TWU) écrite', checkByGauge(mod('wilson-natural-gut', { stiffnessByGauge: { ...tab('wilson-natural-gut'), '1.30': 96.6 } }), stringStiffnessAt, none), 'wilson-natural-gut : jauge 1.30'],
    ["une jauge d'une autre matière écrite", checkByGauge(mod('babolat-rpm-soft', { stiffnessByGauge: { '1.30': 154.9 } }), stringStiffnessAt, none), 'babolat-rpm-soft : jauge 1.30'],
    ['une table sur un hybride', checkByGauge(mod('wilson-duo-control', { stiffnessByGauge: { '1.25/1.30': 160 } }), stringStiffnessAt, none), 'un hybride ne peut pas'],
    ['une série non monotone non marquée', checkByGauge(mod('tecnifibre-black-code', { stiffnessByGaugeSuspect: undefined }), stringStiffnessAt, none), 'non monotone non marquée'],
    ['une série monotone marquée suspecte', checkByGauge(mod('luxilon-savage', { stiffnessByGaugeSuspect: true }), stringStiffnessAt, none), 'monotone ou sans table marquée'],
    ['une interpolation entre jauges mesurées', checkByGauge(stringsDatabase, interpolating, none), 'jamais interpolé'],
    ["une valeur de calcul tirée d'une série suspecte", checkByGauge(stringsDatabase, (s, g) => stringStiffnessAt({ ...s, stiffnessByGaugeSuspect: undefined }, g), none), 'attendu'],
    ['un libellé de repli modifié', checkByGauge(stringsDatabase, (s, g) => { const r = stringStiffnessAt(s, g); return r.basis === 'jauge-non-mesuree' ? { ...r, label: 'inconnue' } : r; }, none), '« inconnue »'],
    ["l'étiquette exportée modifiée", checkByGauge(stringsDatabase, stringStiffnessAt, none, 'non mesurée'), 'étiquette de repli'],
    ['règle C : rigidité de la fiche ≠ maximum de sa table', checkByGauge(mod('head-hawk', { stiffness: 215 }), stringStiffnessAt, none), 'règle C'],
    ['lot 3 : une hausse établie laissée de côté, sans motif en provenance', checkByGauge(mod('luxilon-4g', { stiffness: 265 }), stringStiffnessAt, none), 'ni appliquée ni retenue'],
    ['lot 3 : la mesure appariée à la main omise de la table', checkByGauge(mod('babolat-rpm-team', { stiffnessByGauge: undefined }), stringStiffnessAt, none), 'omise de la table'],
    ['lot 3 : la mesure appariée à la main écrite avec une autre valeur', checkByGauge(mod('babolat-rpm-team', { stiffnessByGauge: { '1.30': 281 } }), stringStiffnessAt, none), 'babolat-rpm-team : jauge 1.30'],
    ['une mesure de la provenance absente de la table', checkByGauge(mod('head-hawk', { stiffnessByGauge: { '1.20': 194.3, '1.25': 204.6 } }), stringStiffnessAt, none), 'provenance'],
    ['une surface FR qui lit la table', checkByGauge(stringsDatabase, stringStiffnessAt, [{ path: 'src/app/x.tsx', src: 'stringStiffnessAt(s, g)' }]), 'src/app/x.tsx'],
    ['un lecteur EN du catalogue', checkByGauge(stringsDatabase, stringStiffnessAt, [{ path: 'public/en/strings.html', src: 'row.stiffness_by_gauge' }]), 'public/en/strings.html'],
  ];
  for (const [name, found, needle] of negatives) {
    if (!found.some((i) => i.includes(needle))) fail(`rigidité par jauge : garde-fou muet sur « ${name} » (${needle})`);
  }
  if (failures.length === before) {
    const withTable = stringsDatabase.filter((s) => s.stiffnessByGauge);
    const measured = withTable.reduce((n, s) => n + Object.keys(s.stiffnessByGauge!).length, 0);
    const total = stringsDatabase.filter((s) => s.type !== 'Hybrid').reduce((n, s) => n + s.gauges.length, 0);
    const c = [0, 0, 0]; // fiche = maximum de sa table, fiche supérieure (une baisse), fiche inférieure (une hausse)
    for (const s of withTable) { const top = Math.max(...Object.values(s.stiffnessByGauge!)); c[top === s.stiffness ? 0 : top < s.stiffness ? 1 : 2]++; }
    ok(`rigidité par jauge : ${withTable.length} fiches avec table (${measured}/${total} jauges mesurées, hors hybrides), ${withTable.filter((s) => s.stiffnessByGaugeSuspect).length} séries suspectes marquées (valeurs conservées, non utilisées), ` +
      `chaque valeur retrouvée dans ${SP.STIFFNESS_SOURCE.fullSurvey.file} (modèle exact, jauge nominale, même matière, ligne unique), repli = rigidité de la fiche étiquetée « ${STIFFNESS_UNMEASURED_LABEL} » sur ${stringsDatabase.length} fiches, jamais interpolé ; ` +
      `règle C : ${c[0]} fiches égales au maximum de leur table, ${c[1]} à valeur de fiche supérieure (baisse sans GO : non appliquée), ${c[2]} inférieure (hausse retenue en provenance par la garde de série suspecte) ; ` +
      `aucune surface du site ne lit la table (${surfaces.length} fichiers lus, ${ALLOWED.length} autorisés), ${negatives.length} tests négatifs détectés`);
  }
}

// ---------------------------------------------------------------------------
// 14. RAQUETTES — AVIS DE TESTEURS (09/10/2026 ; affiché seul depuis le 10/10/2026)
// ---------------------------------------------------------------------------
// Garde trois choses : (a) aucun avis n'est appliqué à une fiche dont les specs
// ne correspondent pas à la génération testée ; (b) l'avis affiché est la
// synthèse TELLE QUELLE (moyenne et cinq critères /20, ni recalage ni moyenne
// avec un profil déduit — décision de Pierre du 10/10/2026) ; (c) une raquette
// sans avis n'en reçoit aucun. Les surfaces relèvent du contrôle 16.
{
  const before = failures.length;
  const crit = Object.keys(RACQUET_TESTER_SOURCE.criteria) as RacquetTesterCriterion[];
  const entries = Object.entries(RACQUET_TESTER_RATINGS);
  const quarantined = Object.keys(RACQUET_TESTER_QUARANTINE).length;
  if (crit.length !== 20) fail(`raquettes testeurs : ${crit.length} critères, 20 attendus`);
  if (entries.length + quarantined + 8 !== 27) {
    fail(`raquettes testeurs : ${entries.length} appliquées + ${quarantined} en quarantaine + 8 absentes ≠ 27 du document`);
  }
  for (const [id, e] of entries) {
    const r = racquetsDatabase.find((x) => x.id === id);
    if (!r) { fail(`raquettes testeurs : ${id} absent du catalogue`); continue; }
    if (crit.some((c) => !Number.isInteger(e.raw20[c]) || e.raw20[c] < 0 || e.raw20[c] > RACQUET_TESTER_SOURCE.scale)) {
      fail(`raquettes testeurs : ${id} porte une note source hors de l'échelle /20`);
    }
    const avg = crit.reduce((a, c) => a + e.raw20[c], 0) / crit.length;
    if (Math.abs(avg - e.docxAverage20) > 0.005) fail(`raquettes testeurs : ${id} moyenne source ${avg} ≠ ${e.docxAverage20}`);
    // (a) rapprochement de génération : specs égales, RA à ±1.
    const sc = e.specCheck;
    if (!sc.url.startsWith('https://www.tenniswarehouse-europe.com/')) fail(`raquettes testeurs : ${id} source de specs hors TWE`);
    if (r.headSize !== sc.headSize || r.weight !== sc.unstrungWeight || r.stringPattern !== sc.pattern) {
      fail(`raquettes testeurs : ${id} specs catalogue (${r.headSize}/${r.weight} g/${r.stringPattern}) ≠ génération testée (${sc.headSize}/${sc.unstrungWeight} g/${sc.pattern})`);
    }
    if (r.stiffness === null || Math.abs(r.stiffness - sc.ra) > 1) {
      fail(`raquettes testeurs : ${id} RA catalogue ${r.stiffness} hors de ±1 du RA publié ${sc.ra} — génération non établie`);
    }
    // (b) avis affiché = synthèse telle quelle.
    const t = racquetTesterSynthesis(r);
    if (!t || t.label !== TESTER_SYNTHESIS_LABEL || t.average20 !== e.docxAverage20) {
      fail(`raquettes testeurs : ${id} — avis affiché ≠ synthèse (moyenne ${t?.average20} pour ${e.docxAverage20})`);
    } else if (t.criteria.map((c) => c.key).join() !== RACQUET_DISPLAYED_CRITERIA.join() || t.criteria.some((c) => c.value20 !== e.raw20[c.key])) {
      fail(`raquettes testeurs : ${id} — critères affichés transformés ou dans le désordre (attendu ${RACQUET_DISPLAYED_CRITERIA.join('/')} tels quels)`);
    }
  }
  for (const name of Object.keys(RACQUET_TESTER_QUARANTINE)) {
    if (entries.some(([, e]) => e.docxName === name)) fail(`raquettes testeurs : « ${name} » à la fois appliquée et en quarantaine`);
  }
  // (c) sans avis : aucune note (ni avis, ni profil de substitution).
  let withoutReview = 0;
  for (const r of racquetsDatabase.filter((x) => !RACQUET_TESTER_RATINGS[x.id])) {
    if (racquetTesterSynthesis(r) !== null) fail(`raquettes testeurs : ${r.id} sans avis mais reçoit un avis`);
    else withoutReview++;
  }
  // Classement Top raquettes : uniquement les fiches à avis, ordre décroissant.
  const ranked = rankRacquetsByTesterAverage(racquetsDatabase);
  if (ranked.length !== entries.length) fail(`classement raquettes : ${ranked.length} classées, ${entries.length} attendues`);
  if (ranked.some((x, i) => i > 0 && ranked[i - 1].testerAverage20 < x.testerAverage20)) fail('classement raquettes : ordre non décroissant');
  // Les 7 fiches alignées sur la dernière génération (09/10/2026) doivent
  // porter leur source et leur RA publié : un retour à l'ancienne valeur, ou
  // une source retirée, fait échouer l'audit.
  const ALIGNED: Readonly<Record<string, number>> = {
    'babolat-pure-aero-standard': 66, 'babolat-pure-drive-standard': 69, 'yonex-ezone-100': 68,
    'yonex-percept-100': 66, 'yonex-percept-100d': 66, 'tecnifibre-tfight-305s-id': 63, 'head-boom-pro-2024': 64,
  };
  const dbSrc = readFileSync('src/data/racquets-database.ts', 'utf8');
  for (const [id, ra] of Object.entries(ALIGNED)) {
    const r = racquetsDatabase.find((x) => x.id === id);
    if (!r) { fail(`génération alignée : ${id} absent (id public à conserver)`); continue; }
    if (r.stiffness !== ra) fail(`génération alignée : ${id} RA ${r.stiffness}, ${ra} publié pour la génération en vente`);
    const i = dbSrc.indexOf(`id: '${id}'`);
    const comment = dbSrc.slice(Math.max(0, i - 400), i);
    if (!/Source[s]? : https:\/\/www\.tenniswarehouse-europe\.com\//.test(comment)) fail(`génération alignée : ${id} sans source de specs en commentaire`);
    if (!RACQUET_TESTER_RATINGS[id]) fail(`génération alignée : ${id} non rapproché`);
  }
  if (failures.length === before) {
    ok(`raquettes testeurs : ${entries.length} fiches rapprochées (génération vérifiée, dont ${Object.keys(ALIGNED).length} alignées sur la dernière génération), ${quarantined} en quarantaine, ` +
      `avis affiché = synthèse telle quelle (${entries.length} moyennes + ${entries.length * RACQUET_DISPLAYED_CRITERIA.length} critères /20), ${withoutReview} raquettes sans avis -> aucune note`);
  }
}

// ---------------------------------------------------------------------------
// 14 bis. FICHES ALIGNÉES SUR LE PRODUIT EN VENTE (veille du 10/10/2026)
// ---------------------------------------------------------------------------
// La provenance consigne, par fiche alignée, l'avant/après, les faits du dossier qui l'établissent et ce qui n'a PAS bougé
// faute de preuve. Échoue si : (a) le catalogue ne porte pas la valeur consignée (« après », ou valeur tenue pour un champ
// « held ») ou une fiche perd son id public ; (b) un fait cité est absent du dossier copié dans le dépôt, d'un autre niveau,
// sans la valeur (énoncé, valeur ou extrait) ou, pour un champ changé, de statut « signal » / « introuvable » ; (c) un RA
// change sans MESURE L1 (Q-1 : TW US et TWE sont du même groupe ; L1 = page d'essai TW, RDC ou TWU, règle du 26/10/2026) ou baisse
// sans revue `tsa-measure` ; (d) l'édition annoncée n'est pas dans le nom ; (e) une surface du site lit la provenance ; (f) une mesure
// L1 du dossier du 23/10/2026 (V117 et suivants) ne dit pas son instrument ou le contredit. Chaque garde est rejouée sur une copie altérée.
{
  const before = failures.length;
  const AP = await import('../src/data/racquet-alignment-provenance');
  type AProv = Readonly<Record<string, (typeof AP.RACQUET_ALIGNMENT)[string]>>;
  type Row = { level: string; status: string; text: string; instrument: string; extract: string };
  type AItem = { id: string; variant?: string; gauges?: string[] } & Record<string, unknown>;
  const norm = (x: string) => x.toLowerCase().replace(/[\s ]/g, '').replace(/×/g, 'x');
  const readRows = (md: string): Map<string, Row> => {
    const rows = new Map<string, Row>();
    for (const m of md.matchAll(/^\| (V\d{2,3}) \|(.*)\|\s*$/gm)) {
      const cells = m[2].replace(/\\\|/g, '\u0001').split('|').map((c) => c.trim());
      rows.set(m[1], {
        level: cells[2].split(/[\s(]/)[0], status: cells[cells.length - 1].replace(/\*/g, ''),
        text: norm([cells[0], cells[1], cells[5]].join(' ')), // énoncé, valeur, extrait : ni « Recoupement » ni « Base TSA »
        instrument: (/\((RDC|TWU)\)/.exec(cells[2]) ?? ['', ''])[1], extract: cells[5] ?? '',
      });
    }
    return rows;
  };
  // Plusieurs dossiers (veille du 10/10/2026, écarts de fiche du 23/10/2026) : numérotation continue, un numéro en double échoue.
  const mergeDossiers = (texts: readonly string[]): { rows: Map<string, Row>; dup: string[] } => {
    const rows = new Map<string, Row>();
    const dup: string[] = [];
    for (const t of texts) for (const [k, v] of readRows(t)) { if (rows.has(k)) dup.push(k); rows.set(k, v); }
    return { rows, dup };
  };
  const dossiers = mergeDossiers(AP.ALIGNMENT_DOSSIERS.map((p) => (existsSync(p) ? readFileSync(p, 'utf8') : '')));
  AP.ALIGNMENT_DOSSIERS.filter((p) => !existsSync(p)).forEach((p) => fail(`fiches alignées : dossier ${p} absent du dépôt`));
  dossiers.dup.forEach((k) => fail(`fiches alignées : fait ${k} numéroté dans deux dossiers`));
  const dossierRows = dossiers.rows;
  // (f) Règle des mesures L1 (avis d'Opus 5.5 du 26/10/2026, R2 de la revue de #152) : une mesure RDC d'une page d'essai TW est L1, comme le
  // « Flex Rating Test » TWU ; depuis le dossier du 23/10/2026, chaque mesure L1 dit laquelle (« L1 (RDC) » ou « L1 (TWU) ») et l'extrait cité
  // ne la contredit pas. Le dossier du 10/10/2026, copie telle quelle de la veille, n'est pas concerné.
  const checkInstruments = (rows: Map<string, Row>): string[] => {
    const issues: string[] = [];
    for (const [k, r] of rows) {
      if (Number(k.slice(1)) < 117 || r.level !== 'L1') continue;
      if (r.instrument !== 'RDC' && r.instrument !== 'TWU') issues.push(`${k} : mesure L1 sans instrument (« L1 (RDC) » ou « L1 (TWU) »)`);
      else if (/\bRDC\b/.test(r.extract) && r.instrument !== 'RDC') issues.push(`${k} : extrait RDC, libellé « L1 (${r.instrument}) »`);
      else if (/Flex Rating Test/i.test(r.extract) && r.instrument !== 'TWU') issues.push(`${k} : extrait « Flex Rating Test », libellé « L1 (${r.instrument}) »`);
    }
    return issues;
  };
  checkInstruments(dossierRows).forEach((i) => fail(`fiches alignées : ${i}`));
  const checkAlignment = (items: readonly AItem[], prov: AProv, rows: Map<string, Row> = dossierRows): string[] => {
    const issues: string[] = [];
    const val = (it: AItem, f: string) => (f === 'gauges' ? it.gauges?.join(',') : it[f]);
    const facts = (id: string, f: string, list: readonly (readonly [string, string, string])[], applied: boolean) => {
      if (list.length === 0) issues.push(`${id}.${f} : aucun fait cité`);
      for (const [v, level, has] of list) {
        const row = rows.get(v);
        if (!row) { issues.push(`${id}.${f} : fait ${v} absent du dossier`); continue; }
        if (row.level !== level) issues.push(`${id}.${f} : ${v} est de niveau ${row.level}, ${level} annoncé`);
        if (has && !row.text.includes(norm(has))) issues.push(`${id}.${f} : « ${has} » absent de la ligne ${v} du dossier`);
        if (applied && /signal|introuvable/.test(row.status)) issues.push(`${id}.${f} : appliqué d'après ${v}, statut « ${row.status} »`);
      }
    };
    for (const [id, a] of Object.entries(prov)) {
      const it = items.find((x) => x.id === id);
      if (!it) { issues.push(`${id} : fiche absente du catalogue (id public à conserver)`); continue; }
      for (const [f, c] of Object.entries(a.changes)) {
        if (val(it, f) !== c.after) issues.push(`${id}.${f} : ${val(it, f)} ≠ ${c.after} consigné`);
        facts(id, f, c.facts, true);
        if (f === 'stiffness' && !c.facts.some(([, level]) => level === 'L1')) issues.push(`${id}.stiffness : RA changé sans mesure L1 (Q-1 : un RA que TW US seul établit reste un signal)`);
        if (f === 'stiffness' && (c.after as number) < (c.before as number) && !a.loweringReview) {
          issues.push(`${id}.stiffness : baisse de RA ${c.before} -> ${c.after} sans mesure exacte, série non suspecte ni revue tsa-measure`);
        }
      }
      for (const [f, h] of Object.entries(a.held)) {
        if (val(it, f) !== h.value) issues.push(`${id}.${f} : ${val(it, f)} ≠ ${h.value} tenu faute de preuve (${h.why})`);
        if (f in a.changes) issues.push(`${id}.${f} : à la fois changé et tenu`);
        facts(id, f, h.facts, false);
      }
      if (a.edition && !String(it.variant).includes(a.edition)) issues.push(`${id} : l'édition « ${a.edition} » n'est pas dans le nom « ${it.variant} »`);
    }
    return issues;
  };
  // (e) aucune surface du site n'importe la provenance (les commentaires peuvent citer le fichier).
  const IMPORTS = /from\s*['"][^'"]*racquet-alignment-provenance['"]|RACQUET_ALIGNMENT|STRING_ALIGNMENT|ALIGNMENT_DOSSIER/;
  const walkAlign = (d: string): string[] =>
    readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walkAlign(`${d}/${n}`) : [`${d}/${n}`]));
  const scanAlign = (files: { path: string; src: string }[]) =>
    files.filter((f) => f.path !== 'src/data/racquet-alignment-provenance.ts' && IMPORTS.test(f.src)).map((f) => `${f.path} lit la provenance des alignements`);
  const surfaces = [...walkAlign('src'), ...walkAlign('scripts/catalog'), ...walkAlign('scripts/en-products'), ...walkAlign('public/js')]
    .filter((f) => /\.(tsx?|m?js)$/.test(f)).map((p) => ({ path: p, src: readFileSync(p, 'utf8') }));
  const R0 = AP.RACQUET_ALIGNMENT, S0 = AP.STRING_ALIGNMENT;
  const races = racquetsDatabase as unknown as AItem[], strs = stringsDatabase as unknown as AItem[];
  [...checkAlignment(races, R0), ...checkAlignment(strs, S0), ...scanAlign(surfaces)].forEach((i) => fail(`fiches alignées : ${i}`));
  // Tests négatifs : chaque altération doit être détectée.
  const setItem = (list: readonly AItem[], id: string, patch: Record<string, unknown>) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)) as AItem[];
  const withFacts = (id: string, part: 'changes' | 'held', key: string, facts: [string, string, string][]): AProv => ({
    ...R0, [id]: { ...R0[id], [part]: { ...R0[id][part], [key]: { ...(R0[id][part] as Record<string, object>)[key], facts } } } as AProv[string],
  });
  const tfight = R0['tecnifibre-tfight-315s'];
  const negatives: Array<[string, string[], string]> = [
    ['RA en signal appliqué (EZONE 105 -> 66)', checkAlignment(setItem(races, 'yonex-ezone-105', { stiffness: 66 }), R0), 'yonex-ezone-105.stiffness : 66 ≠ 64'],
    ['RA non cordé de Babolat saisi (Pure Aero Team -> 70)', checkAlignment(setItem(races, 'babolat-pure-aero-team', { stiffness: 70 }), R0), 'babolat-pure-aero-team.stiffness : 70 ≠ 67'],
    ['plan ramené à l\'ancienne valeur (T-Fight 315S 18x19)', checkAlignment(setItem(races, 'tecnifibre-tfight-315s', { stringPattern: '18x19' }), R0), 'tecnifibre-tfight-315s.stringPattern : 18x19 ≠ 16x19'],
    ['poids junior recollé au poids cordé (US Open Jr 21 : 186 g)', checkAlignment(setItem(races, 'wilson-us-open-junior-21', { weight: 186 }), R0), 'wilson-us-open-junior-21.weight : 186 ≠ 171'],
    ['équilibre du Blade Jr 25 converti sans unité écrite (305)', checkAlignment(setItem(races, 'wilson-blade-junior-25', { balance: 305 }), R0), 'wilson-blade-junior-25.balance : 305 ≠ 320'],
    ['RA changé sans mesure L1 (Clash 100 Pro : V10 seul)', checkAlignment(races, withFacts('wilson-clash-100-pro-v2', 'changes', 'stiffness', [['V10', 'L2', '57']])), 'RA changé sans mesure L1'],
    ['baisse de RA sans revue tsa-measure', checkAlignment(races, { ...R0, 'tecnifibre-tfight-315s': { ...tfight, changes: { ...tfight.changes, stiffness: { ...tfight.changes.stiffness!, before: 66 } } } }), 'sans mesure exacte, série non suspecte ni revue tsa-measure'],
    ['fait inexistant (V999)', checkAlignment(races, withFacts('yonex-ezone-105', 'changes', 'stringPattern', [['V999', 'L0', '16x19']])), 'fait V999 absent du dossier'],
    ['changement appuyé sur un fait « signal » (plan EZONE 105 cite V04)', checkAlignment(races, withFacts('yonex-ezone-105', 'changes', 'stringPattern', [['V04', 'L2', '66']])), 'statut « signal »'],
    ['niveau erroné (V07 annoncé L1)', checkAlignment(races, withFacts('wilson-clash-100-pro-v2', 'changes', 'weight', [['V07', 'L1', '305g']])), 'V07 est de niveau L0, L1 annoncé'],
    ['valeur absente de la ligne citée (V07 : 310 g)', checkAlignment(races, withFacts('wilson-clash-100-pro-v2', 'changes', 'weight', [['V07', 'L0', '310g']])), 'absent de la ligne V07'],
    ['édition absente du nom (Pure Aero Team « Team »)', checkAlignment(setItem(races, 'babolat-pure-aero-team', { variant: 'Team' }), R0), 'n\'est pas dans le nom'],
    ['id public perdu (Clash 100 Pro)', checkAlignment(races.filter((x) => x.id !== 'wilson-clash-100-pro-v2'), R0), 'fiche absente du catalogue'],
    ['dossier absent du dépôt', checkAlignment(races, R0, new Map()), 'absent du dossier'],
    ['fait numéroté dans deux dossiers', mergeDossiers(['| V01 | a | b | L0 | u | d | e | r | x | **confirmé** |', '| V01 | a | b | L0 | u | d | e | r | x | **confirmé** |']).dup, 'V01'],
    ['RA tenu remis à la valeur du constructeur (CX 200 -> 65)', checkAlignment(setItem(races, 'dunlop-cx-200', { stiffness: 65 }), R0), 'dunlop-cx-200.stiffness : 65 ≠ 66'],
    ['nom du cordage ramené à son ancienne graphie (Touch Multifiber)', checkAlignment(setItem(strs, 'kirschbaum-touch-multifiber', { model: 'Touch Multifiber' }), S0), 'kirschbaum-touch-multifiber.model'],
    ['1.30 retirée de la Poly Tour Strike', checkAlignment(setItem(strs, 'yonex-poly-tour-strike', { gauges: ['1.20', '1.25'] }), S0), 'yonex-poly-tour-strike.gauges'],
    ['1.35 réintroduite sur la RPM Team', checkAlignment(setItem(strs, 'babolat-rpm-team', { gauges: ['1.25', '1.30', '1.35'] }), S0), 'babolat-rpm-team.gauges'],
    ['surface qui importe la provenance', scanAlign([{ path: 'src/app/x.tsx', src: "import { RACQUET_ALIGNMENT } from '@/data/racquet-alignment-provenance';" }]), 'src/app/x.tsx'],
    ['mesure L1 sans instrument', checkInstruments(readRows('| V150 | a | b | L1 | u | d | « Flex Rating Test 60 » | r | x | **confirmé** |')), 'V150 : mesure L1 sans instrument'],
    ['extrait RDC libellé TWU', checkInstruments(readRows('| V151 | a | b | L1 (TWU) | u | d | « Babolat RDC Ratings Score Grade Flex Rating 64 » | r | x | **confirmé** |')), 'V151 : extrait RDC'],
    ['extrait TWU libellé RDC', checkInstruments(readRows('| V152 | a | b | L1 (RDC) | u | d | « Lab Data Score Grade Flex Rating Test 64 » | r | x | **confirmé** |')), 'V152 : extrait « Flex Rating Test »'],
    ['génération retirée du nom (Ripstick « Standard »)', checkAlignment(setItem(races, 'prince-ripstick-standard', { variant: 'Standard' }), R0), 'prince-ripstick-standard.variant'],
  ];
  for (const [name, found, needle] of negatives) {
    if (!found.some((i) => i.includes(needle))) fail(`fiches alignées : garde-fou muet sur « ${name} » (${needle})`);
  }
  if (failures.length === before) {
    const nR = Object.keys(R0).length;
    const changed = Object.values(R0).filter((a) => Object.keys(a.changes).length > 0).length;
    const nFacts = [...Object.values(R0), ...Object.values(S0)].reduce(
      (n, a) => n + Object.values(a.changes).reduce((m, c) => m + c.facts.length, 0) + Object.values(a.held).reduce((m, h) => m + h.facts.length, 0), 0);
    const nRa = Object.values(R0).filter((a) => a.changes.stiffness).length;
    const l1 = [...dossierRows].filter(([k, r]) => Number(k.slice(1)) >= 117 && r.level === 'L1').map(([, r]) => r.instrument);
    ok(`fiches alignées : ${nR} raquettes en provenance (${changed} modifiées, ${nR - changed} tenues faute de preuve), ${Object.keys(S0).length} cordages (nom, jauges, coloris), ` +
      `${nFacts} faits retrouvés dans ${AP.ALIGNMENT_DOSSIERS.length} dossiers (niveau, valeur, statut ; ${dossierRows.size} faits, aucun numéro en double), ${nRa} RA changés tous sur mesure L1, aucune baisse de RA, instrument dit pour les ${l1.length} mesures L1 du 23/10 (${l1.filter((i) => i === 'RDC').length} RDC, ${l1.filter((i) => i === 'TWU').length} TWU), aucune surface ne lit la provenance, ${negatives.length} tests négatifs détectés`);
  }
}

// ---------------------------------------------------------------------------
// 15. SOURCE UNIQUE DU CATALOGUE (C3, 09/10/2026)
// ---------------------------------------------------------------------------
// Le TypeScript fait foi ; les pages EN lisent public/data/catalog.json, généré
// au build. Échoue si : (a) un fichier servi sous public/ lit encore le
// catalogue dans Supabase ; (b) le JSON servi diffère du TS ; (c) le JSON est
// versionné (il serait éditable à la main) ou n'est plus généré au build ;
// (d) il cite une chaîne de testeurs ; (e) une valeur absente y est comblée ; (f) sa rigidité par jauge (D1) diffère du TS.
{
  const before = failures.length;
  const READ_PATTERNS: RegExp[] = [
    /\.from\(\s*['"`](racquets|strings)['"`]\s*\)/,
    /\/rest\/v1\/(racquets|strings)\b/,
    /\.select\(\s*['"`][^'"`]*\b(racquets|strings)\s*\(/,
  ];
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const p = path.join(dir, f);
      return statSync(p).isDirectory() ? walk(p) : /\.(html?|m?js)$/.test(f) ? [p] : [];
    });
  let scanned = 0;
  for (const file of walk('public')) {
    scanned++;
    const src = readFileSync(file, 'utf8');
    for (const re of READ_PATTERNS) {
      const m = src.match(re);
      if (m) fail(`source unique : ${file.split(path.sep).join('/')} lit le catalogue dans Supabase (« ${m[0]} ») — lire /data/catalog.json`);
    }
  }
  const expected = serializeCatalog(buildCatalog(racquetsDatabase, stringsDatabase));
  let state = 'absent (généré au build)';
  if (existsSync(CATALOG_JSON_PATH)) {
    const served = readFileSync(CATALOG_JSON_PATH, 'utf8');
    if (served !== expected) fail(`source unique : ${CATALOG_JSON_PATH} diffère du TS — relancer npm run build:catalog, ne jamais l'éditer`);
    state = 'identique au TS';
  }
  const tracked = execFileSync('git', ['ls-files', '--', CATALOG_JSON_PATH], { encoding: 'utf8' }).trim();
  if (tracked) fail(`source unique : ${CATALOG_JSON_PATH} est versionné — il doit rester généré (.gitignore)`);
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  if (!/build:catalog/.test(pkg.scripts?.prebuild ?? '')) fail('source unique : prebuild ne génère plus le catalogue EN (Netlify servirait un JSON absent)');
  const channels = [...TESTER_RATINGS_SOURCE.channels, ...RACQUET_TESTER_SOURCE.channels];
  for (const c of channels) if (expected.includes(c)) fail(`source unique : le catalogue public cite la chaîne « ${c} »`);
  const cat = JSON.parse(expected);
  const absentR = racquetsDatabase.filter((r) => r.stiffness === null).length;
  const nullR = cat.racquets.filter((r: { stiffness: number | null }) => r.stiffness === null).length;
  if (absentR !== nullR) fail(`source unique : ${absentR} RA absents dans le TS, ${nullR} null dans le JSON (valeur comblée ?)`);
  const absentS = stringsDatabase.filter((s) => s.comfort === undefined).length;
  const nullS = cat.strings.filter((s: { comfort: number | null }) => s.comfort === null).length;
  if (absentS !== nullS) fail(`source unique : ${absentS} notes confort absentes dans le TS, ${nullS} null dans le JSON`);
  if (cat.racquets.length !== racquetsDatabase.length || cat.strings.length !== stringsDatabase.length) fail('source unique : comptes JSON ≠ TS');
  // (f) rigidité par jauge (D1) : table et drapeau « suspecte » du JSON = ceux du TS, `null` quand le TS n'en a pas (jamais comblée).
  type ByGaugeRow = { id: string; stiffness_by_gauge: unknown; stiffness_by_gauge_suspect: unknown };
  const jsonRows = new Map<string, ByGaugeRow>((cat.strings as ByGaugeRow[]).map((r) => [r.id, r]));
  for (const s of stringsDatabase) {
    const j = jsonRows.get(s.id);
    if (JSON.stringify(j?.stiffness_by_gauge) !== JSON.stringify(s.stiffnessByGauge ?? null) || JSON.stringify(j?.stiffness_by_gauge_suspect) !== JSON.stringify(s.stiffnessByGaugeSuspect ?? null)) {
      fail(`source unique : ${s.id} : rigidité par jauge du JSON ≠ TS (absente = null, jamais comblée)`);
    }
  }
  const jsonTables = (cat.strings as ByGaugeRow[]).filter((r) => r.stiffness_by_gauge !== null).length;
  if (failures.length === before) {
    ok(`source unique : ${scanned} fichiers public/ sans lecture Supabase du catalogue, catalog.json ${state} ` +
      `(${cat.racquets.length} raquettes / ${cat.strings.length} cordages, ${nullR} RA null, ${nullS} notes null, ${jsonTables} tables de rigidité par jauge), non versionné, généré en prebuild, aucune chaîne citée`);
  }
}

// ---------------------------------------------------------------------------
// 18. NATURE DES NOTES DE CORDAGE — ÉTIQUETÉE SUR CHAQUE SURFACE FRANÇAISE
//     (principe décidé par Pierre le 10/10/2026 : « garder les notes et les étiqueter partout » ;
//      formulation des libellés et de la mention tranchée par Opus 5.5 le 23/10/2026, délégation de l'orchestrateur)
// ---------------------------------------------------------------------------
// Les notes /10 des cordages ne sont pas des mesures (PR #103 : 12 notes sur 1 182 viennent
// de Tennis Warehouse, l'origine de 1 062 est inconnue). Elles s'affichent donc avec leur
// nature, cordage par cordage : « Appréciation éditoriale TSA » (fiches à note éditoriale
// seule), « …, harmonisée avec des avis de testeurs » (les 18 de `STRING_TESTER_RATINGS`),
// rien pour une fiche sans note (« Non publié »). Bloc DISTINCT et groupé : tout ce qui
// concerne cette règle est ici. Échoue si :
// (a) un libellé ou la mention dévie du texte figé ci-dessous, cite une chaîne de testeurs ou
//     Tennis Warehouse, ou affirme que la rigidité du catalogue est « mesurée » (faux tant que
//     le chantier C2 n'a pas apparié les rigidités sur (modèle, jauge) : TWU mesure chaque
//     jauge séparément et des rigidités du catalogue n'ont aucune source) ;
// (b) la nature d'une fiche ne se déduit plus de ses notes et de la liste des 18 ;
// (c) un fichier de la liste blanche des surfaces perd son étiquette (composant ou
//     constante de src/lib/string-rating-nature.ts), ou un fichier de src/ lit des notes de
//     cordage sans être déclaré dans cette liste ;
// (d) en exécution, la fiche et la carte du catalogue (pleine et compacte) de CHAQUE cordage
//     n'affichent pas l'étiquette de leur nature (ou affichent celle d'une autre, ou une
//     étiquette pour un cordage sans note) ;
// (e) en exécution, le PDF d'une configuration (données assemblées, puis rendu enregistré
//     par un jsPDF factice) omet l'étiquette des notes imprimées ;
// (f) la description du catalogue (métadonnées) promet des notes ;
// (g) un des tests négatifs permanents ne détecte plus l'altération qu'il plante ;
// (h) (22/10/2026) un cordage n'a pas la même nature en FR (ce module) et dans l'export catalog.json lu par les pages EN ;
// (i) (22/10/2026) un cordage sans note (les 7 Toroline du lot 3, option A) reçoit, sur sa fiche, ses cartes ou son PDF, une
//     barre, un zéro, un NaN ou moins de « Non publié » que de notes absentes.
// Affichage seulement : aucune note ni aucun calcul n'est touché. La provenance détaillée
// des notes n'est lue par aucun de ces fichiers (contrôle 13 bis, qui scanne tout src/).
{
  const before = failures.length;
  const N = await import('../src/lib/string-rating-nature');
  const { default: React } = await import('react');
  (globalThis as { React?: unknown }).React ??= React; // JSX « classique » sous tsx (Next : runtime automatique)
  const { renderToStaticMarkup } = await import('react-dom/server');
  type Nature = 'editorial' | 'harmonized' | 'third_party' | 'none';
  // Les cinq notes affichées (comme côté EN) : « sans note » = aucune des cinq n'est publiée.
  const FIELDS5 = ['control', 'comfort', 'spin', 'power', 'durability'] as const;
  const EXPECT: Readonly<Record<Nature, string>> = {
    editorial: "Note de l'équipe TSA, non mesurée",
    harmonized: "Moyenne de la note de l'équipe TSA et d'avis de testeurs publiés, non mesurée",
    third_party: "Note reprise, en tout ou en partie, d'un test publié par un revendeur, non mesurée",
    none: 'Non publié',
  };
  const NOTICE =
    "Notes /10 non mesurées : la nature de chaque note est indiquée à côté. L'indice RCS n'utilise que la rigidité (lb/in) ; l'alerte bras peut aussi se déclencher sur la note de confort.";
  const OVERALL = 'Moyenne de quatre notes non mesurées : performance, contrôle, confort, durabilité';
  const PROPOSED = 'formulation tranchée par Opus 5.5 le 23/10/2026 : la changer ici ET dans src/lib/string-rating-nature.ts, sur nouvel arbitrage';

  // (a) textes figés, sans chaîne de testeurs ni revendeur nommé, sans « rigidité mesurée », et jamais « mesurée » sans négation :
  //     aucune note /10 n'est une mesure.
  if (N.STRING_OVERALL_RATING_LABEL !== OVERALL) fail(`nature des notes : libellé de la note globale = « ${N.STRING_OVERALL_RATING_LABEL} » (${PROPOSED})`);
  const affirmsMeasure = (t: string) => /(?<!non )mesur/i.test(t);
  for (const t of [...Object.values(N.STRING_RATING_LABELS), N.STRING_RATINGS_NOTICE, N.STRING_OVERALL_RATING_LABEL]) {
    if (affirmsMeasure(t)) fail(`nature des notes : « ${t} » présente une note comme mesurée`);
  }
  for (const k of ['editorial', 'harmonized', 'third_party', 'none'] as const) {
    if (N.STRING_RATING_LABELS[k] !== EXPECT[k]) fail(`nature des notes : libellé « ${k} » = « ${N.STRING_RATING_LABELS[k]} », « ${EXPECT[k]} » attendu (${PROPOSED})`);
  }
  // Mention D2 (23/10/2026) : texte figé, et TWU n'y est que la source de la mesure de rigidité (« rigidité mesurée (TWU) »).
  const D2_LABEL = 'note de confort recalée sur la rigidité mesurée (TWU)';
  if (N.COMFORT_RECALIBRATED_LABEL !== D2_LABEL || COMFORT_RECALIBRATION_RULE.label !== D2_LABEL) {
    fail(`nature des notes : mention D2 « ${N.COMFORT_RECALIBRATED_LABEL} », « ${D2_LABEL} » attendue`);
  }
  // Seule exception, exacte et unique, à « mesurée » sans négation : « rigidité mesurée (TWU) » de la mention D2, où c'est la
  // rigidité TWU qui est mesurée, jamais la note (avis d'Opus 5.5 du 23/10/2026 : AA point 1, AH « Mot à proscrire »).
  const D2_MEASURED_STIFFNESS = 'rigidité mesurée (TWU)';
  const d2AffirmsMeasure = (t: string) => affirmsMeasure(t.split(D2_MEASURED_STIFFNESS).join(''));
  if (d2AffirmsMeasure(N.COMFORT_RECALIBRATED_LABEL)) {
    fail(`nature des notes : mention D2 « ${N.COMFORT_RECALIBRATED_LABEL} » présente une note comme mesurée (seule « ${D2_MEASURED_STIFFNESS} » est admise)`);
  }
  if (N.STRING_RATINGS_NOTICE !== NOTICE) {
    fail(`nature des notes : la mention a changé — « ${N.STRING_RATINGS_NOTICE} » (${PROPOSED})`);
  }
  const wording = [...Object.values(N.STRING_RATING_LABELS), N.STRING_RATINGS_NOTICE].join('\n');
  for (const c of [...TESTER_RATINGS_SOURCE.channels, ...RACQUET_TESTER_SOURCE.channels]) {
    if (wording.includes(c)) fail(`nature des notes : un libellé cite la chaîne de testeurs « ${c} » (jamais cités comme auteurs des notes)`);
  }
  if (/Tennis Warehouse|\bTWU?\b/.test(wording)) fail('nature des notes : un libellé cite Tennis Warehouse (les notes ne viennent pas de TW)');
  if (/rigidit[^.]*mesur|mesur[^.]*rigidit/i.test(N.STRING_RATINGS_NOTICE)) {
    fail('nature des notes : la mention affirme que la rigidité est mesurée — faux tant que le chantier C2 (réappariement TWU sur (modèle, jauge), PR #105) n’a pas couvert le catalogue (règle 3) ; adapter ce contrôle à ce moment-là');
  }

  // (b) la nature se déduit des notes publiées, de la liste des 18 et de la provenance : `third_party` dès qu'une note affichée est
  //     `tw` ou `harmonisee+tw`. La liste dérivée lue par les surfaces doit être exactement ce recalcul (dans les deux sens).
  const harmonizedIds = new Set(Object.keys(STRING_TESTER_RATINGS));
  const { STRING_RATINGS_PROVENANCE: PROV } = await import('../src/data/string-ratings-provenance');
  const { THIRD_PARTY_RATED_STRING_IDS } = await import('../src/data/string-ratings-third-party');
  const recomputeThirdParty = (prov: typeof PROV): string[] =>
    Object.entries(prov).filter(([, e]) => FIELDS5.some((f) => e.fields[f] === 'tw' || e.fields[f] === 'harmonisee+tw')).map(([id]) => id).sort();
  const thirdPartyIds = new Set(recomputeThirdParty(PROV));
  const thirdPartyListFindings = (list: readonly string[], prov: typeof PROV): string[] => {
    const want = recomputeThirdParty(prov);
    const got = [...list].sort();
    return want.join() === got.join() ? [] : [`liste des notes reprises [${got.join(', ')}] ≠ recalcul depuis la provenance [${want.join(', ')}]`];
  };
  for (const msg of thirdPartyListFindings(THIRD_PARTY_RATED_STRING_IDS, PROV)) fail(`nature des notes : ${msg}`);
  const expectedNature = (s: (typeof stringsDatabase)[number]): Nature =>
    FIELDS5.every((f) => s[f] === undefined) ? 'none' : thirdPartyIds.has(s.id) ? 'third_party' : harmonizedIds.has(s.id) ? 'harmonized' : 'editorial';
  const natureCount: Record<Nature, number> = { editorial: 0, harmonized: 0, third_party: 0, none: 0 };
  for (const s of stringsDatabase) {
    const n = N.stringRatingNature(s);
    natureCount[n]++;
    if (n !== expectedNature(s)) fail(`nature des notes : ${s.id} classé « ${n} », « ${expectedNature(s)} » attendu`);
    const label = N.stringRatingLabel(s);
    // D2 (23/10/2026) : une note de confort recalée sur la rigidité mesurée ajoute sa mention à l'étiquette, partout.
    const recal = n !== 'none' && s.comfort !== undefined && Object.prototype.hasOwnProperty.call(COMFORT_RECALIBRATED, s.id);
    const wantLabel = n === 'none' ? null : recal ? `${EXPECT[n]} ; ${D2_LABEL}` : EXPECT[n];
    if (label !== wantLabel) fail(`nature des notes : ${s.id} (${n}) porte l’étiquette « ${label} », « ${wantLabel} » attendue`);
  }
  for (const id of harmonizedIds) {
    const s = stringsDatabase.find((x) => x.id === id);
    if (s && !thirdPartyIds.has(id) && N.stringRatingNature(s) !== 'harmonized') fail(`nature des notes : ${id} (18 harmonisés) n’est pas classé « harmonized »`);
  }
  const harmonizedOnly = [...harmonizedIds].filter((id) => !thirdPartyIds.has(id)).length;
  if (natureCount.harmonized !== harmonizedOnly) fail(`nature des notes : ${natureCount.harmonized} fiches harmonisées pour ${harmonizedOnly} en provenance (hors notes reprises)`);
  if (natureCount.editorial + natureCount.harmonized + natureCount.third_party + natureCount.none !== stringsDatabase.length) fail('nature des notes : une fiche sans nature');
  // Sémantique sur des fiches synthétiques (le catalogue actuel est « tout ou rien » et ne l'éprouve pas) : chacune des
  // cinq notes affichées suffit à faire « une note » ; performance, polyvalence et innovation n'en font pas une à elles
  // seules (elles ne s'affichent pas seules) ; un identifiant harmonisé sans note reste « sans note ».
  const aHarmonizedId = [...harmonizedIds][0];
  for (const f of FIELDS5) {
    if (N.stringRatingNature({ id: 'zz-synthetique', [f]: 5 } as never) !== 'editorial') fail(`nature des notes : la seule note « ${f} » ne fait pas une fiche à note éditoriale`);
    if (N.stringRatingNature({ id: aHarmonizedId, [f]: 5 } as never) !== 'harmonized') fail(`nature des notes : la seule note « ${f} » d'un cordage harmonisé ne le classe pas « harmonized »`);
  }
  for (const f of ['performance', 'versatility', 'innovation']) {
    if (N.stringRatingNature({ id: 'zz-synthetique', [f]: 5 } as never) !== 'none') fail(`nature des notes : « ${f} » seul compte comme une note affichée (cinq notes affichées seulement, comme côté EN)`);
  }
  if (N.stringRatingNature({ id: aHarmonizedId } as never) !== 'none') fail('nature des notes : un cordage harmonisé sans aucune note n’est pas « none »');

  // (c) liste blanche des surfaces + découverte des surfaces non déclarées.
  const stripComments = (raw: string) => raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  type Need = [pattern: RegExp, min: number, what: string];
  const SURFACES: Readonly<Record<string, Need[]>> = {
    'src/app/tennis-strings/[slug]/page.tsx': [
      [/<StringRatingLabel\b/g, 1, 'étiquette des notes de jeu'],
      [/<StringRatingsNotice\b/g, 1, 'mention sous « Notes de jeu »'],
    ],
    'src/components/product/string-card.tsx': [[/<StringRatingLabel\b/g, 2, 'étiquette (carte complète et carte compacte)']],
    'src/app/tennis-strings/page.tsx': [
      [/<StringRatingsNotice\b/g, 2, 'mention (barre d’outils du tri et filtre « Notes minimum »)'],
      [/<StringCard\b/g, 1, 'cartes étiquetées'],
    ],
    'src/app/compare/page.tsx': [
      [/<StringRatingLabel\b/g, 3, 'étiquette (ligne par cordage, carte sélectionnée, liste de choix)'],
      [/<StringRatingsNotice\b/g, 1, 'mention'],
      [/<StringRatingsNatureBlock\b/g, 1, 'bloc « Nature des notes » avant les barres'],
    ],
    'src/app/configurator/page.tsx': [
      [/<StringRatingLabel\b/g, 3, 'étiquette (résumé du cordage, analyse avancée : principal et travers)'],
      [/<StringRatingsNotice\b/g, 1, 'mention sous l’analyse avancée'],
    ],
    'src/app/statistics/page.tsx': [
      [/STRING_RATING_LABELS\[/g, 1, 'libellé de nature dans la légende du classement'],
      [/<StringRatingsNotice\b/g, 1, 'mention'],
      [/<StringRatingLabel\b/g, 1, 'étiquette par ligne si les natures sont mêlées'],
    ],
    'src/lib/pdf-configuration-data.ts': [
      [/\bstringRatingLabel\(/g, 2, 'étiquette des notes du montant et du travers'],
      [/\bSTRING_RATINGS_NOTICE\b/g, 2, 'mention imprimée'],
    ],
    'src/lib/pdf-export.ts': [
      [/\bratingsLabel\b/g, 4, 'étiquette imprimée près des notes et de l’analyse'],
      [/\bratingsNotice\b/g, 4, 'mention imprimée près des notes et dans la méthodologie'],
    ],
  };
  const surfaceFindings = (file: string, raw: string): string[] => {
    const needs = SURFACES[file];
    if (!needs) return [];
    const code = stripComments(raw);
    return needs.flatMap(([re, min, what]) => {
      const n = (code.match(re) ?? []).length;
      return n >= min ? [] : [`${file} : ${what} — ${n} occurrence(s) de ${re.source}, ${min} attendue(s)`];
    });
  };
  const NOTE_READ = /\.(performance|control|comfort|durability|versatility|innovation|spin|power)\b|const\s*\{[^}]*\b(performance|control|comfort|durability|versatility|innovation|spin|power)\b[^}]*\}\s*=\s*(string|s|stringItem)\b/;
  const DATA_IMPORT = /from\s*['"][^'"]*(strings-database|\/tester-ratings|string-card|pdf-configuration-data)['"]/;
  const undeclaredFindings = (file: string, raw: string): string[] => {
    if (file.startsWith('src/data/') || file in SURFACES) return [];
    const code = stripComments(raw);
    return NOTE_READ.test(code) && DATA_IMPORT.test(code)
      ? [`${file} : lit des notes de cordage sans être déclaré parmi les surfaces étiquetées (liste blanche du contrôle 18)`]
      : [];
  };
  const walkTree = (d: string): string[] =>
    readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walkTree(`${d}/${n}`) : [`${d}/${n}`]));
  const srcTs = walkTree('src').filter((f) => /\.(tsx?|mts)$/.test(f));
  const sources = new Map<string, string>();
  for (const file of Object.keys(SURFACES)) {
    if (!existsSync(file)) { fail(`nature des notes : surface déclarée absente (${file})`); continue; }
    sources.set(file, readFileSync(file, 'utf8'));
    for (const msg of surfaceFindings(file, sources.get(file)!)) fail(`nature des notes : ${msg}`);
  }
  for (const file of srcTs) for (const msg of undeclaredFindings(file, readFileSync(file, 'utf8'))) fail(`nature des notes : ${msg}`);

  // (d) exécution : fiche et carte (pleine, compacte) de CHAQUE cordage, rendues côté serveur.
  // Texte tel que React l'écrit dans le HTML (l'apostrophe des libellés devient &#x27;).
  const htmlText = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
  // D2 (23/10/2026) : l'étiquette d'une note de confort recalée porte en plus la mention, sur chaque surface rendue.
  const labelTag = (n: Nature, recal = false) => `>${htmlText(`${EXPECT[n]}${recal ? ` ; ${D2_LABEL}` : ''}`)}<`;
  const isRecal = (s: (typeof stringsDatabase)[number]) => Object.prototype.hasOwnProperty.call(COMFORT_RECALIBRATED, s.id);
  const RATED = ['editorial', 'harmonized', 'third_party'] as const;
  // (i) notes affichées par surface : une fiche sans note dit « Non publié » autant de fois, sans barre, zéro ni NaN.
  const NONE_LINES: Readonly<Record<string, number>> = { fiche: 5, carte: 5, 'carte compacte': 4 };
  const renderFindings = (surface: string, id: string, html: string, nature: Nature, recal = false): string[] => {
    const found: string[] = [];
    if (nature === 'none') {
      if (html.includes('data-rating-nature=') || RATED.some((k) => html.includes(htmlText(EXPECT[k])))) found.push(`${surface} ${id} : étiquette affichée pour un cordage sans note`);
      if (!html.includes('Non publié')) found.push(`${surface} ${id} : « Non publié » absent`);
      const missing = (html.match(/Non publié(?!e)/g) ?? []).length;
      if (missing < (NONE_LINES[surface] ?? 1)) found.push(`${surface} ${id} : ${missing} « Non publié » pour ${NONE_LINES[surface]} notes absentes`);
      if (/NaN|sur 10"|>0\.0</.test(html)) found.push(`${surface} ${id} : barre, zéro ou NaN rendu pour une note absente`);
      return found;
    }
    if (!html.includes(`data-rating-nature="${nature}"`) || !html.includes(labelTag(nature, recal))) {
      found.push(`${surface} ${id} : étiquette « ${EXPECT[nature]}${recal ? ` ; ${D2_LABEL}` : ''} » absente alors que des notes sont rendues`);
    }
    for (const other of RATED) {
      if (other !== nature && html.includes(labelTag(other))) found.push(`${surface} ${id} : étiquette d’une autre nature (« ${EXPECT[other]} »)`);
    }
    return found;
  };
  const ficheMod = (await import('../src/app/tennis-strings/[slug]/page')) as { default: (p: { params: { slug: string } }) => never };
  const { StringCard } = await import('../src/components/product/string-card');
  let renders = 0;
  let sample: { fiche: string; id: string } | null = null;
  let sampleNone: { fiche: string; card: string; id: string } | null = null;
  let sampleOverall: { card: string; id: string } | null = null;
  // Note globale ★ de la carte : dérivée, elle porte son libellé si (et seulement si) elle s'affiche.
  const overallFindings = (id: string, card: string, shown: boolean): string[] =>
    shown === (card.includes('data-overall-rating-label') && card.includes(htmlText(OVERALL))) ? [] : [`carte ${id} : note globale ${shown ? 'sans' : 'absente mais avec'} son libellé`];
  const renderBad: string[] = [];
  for (const s of stringsDatabase) {
    const n = N.stringRatingNature(s);
    const fiche = renderToStaticMarkup(ficheMod.default({ params: { slug: s.id } }));
    const card = renderToStaticMarkup(React.createElement(StringCard, { string: s }));
    const compact = renderToStaticMarkup(React.createElement(StringCard, { string: s, compact: true }));
    renders += 3;
    const rc = isRecal(s);
    renderBad.push(...renderFindings('fiche', s.id, fiche, n, rc), ...renderFindings('carte', s.id, card, n, rc), ...renderFindings('carte compacte', s.id, compact, n, rc));
    if (n !== 'none' && !fiche.includes('data-rating-notice="full"')) renderBad.push(`fiche ${s.id} : mention absente sous « Notes de jeu »`);
    if (n === 'harmonized' && !sample) sample = { fiche, id: s.id };
    if (n === 'none' && !sampleNone) sampleNone = { fiche, card, id: s.id };
    const overallShown = s.performance !== undefined && s.control !== undefined && s.comfort !== undefined && s.durability !== undefined;
    renderBad.push(...overallFindings(s.id, card, overallShown));
    if (overallShown && !sampleOverall) sampleOverall = { card, id: s.id };
  }
  if (renderBad.length > 0) fail(`nature des notes : ${renderBad.length} défaut(s) de rendu serveur (fiche, carte pleine, carte compacte), par exemple : ${renderBad.slice(0, 3).join(' | ')}`);

  // (e) exécution : PDF. Données assemblées, puis rendu par un jsPDF factice qui enregistre le texte.
  const { buildConfigurationPdfData } = await import('../src/lib/pdf-configuration-data');
  const { exportConfigurationPdf } = await import('../src/lib/pdf-export');
  const printed: string[] = [];
  class FakePdf {
    setFont() {} setFontSize() {} setTextColor() {} setFillColor() {} setDrawColor() {} rect() {} roundedRect() {} line() {} setLineWidth() {}
    addPage() {} setPage() {} save() {}
    getNumberOfPages() { return 1; }
    splitTextToSize(t: string) { return [t]; }
    text(t: string | string[]) { printed.push(...(Array.isArray(t) ? t : [t])); }
  }
  const harmonizedMain = stringsDatabase.find((s) => N.stringRatingNature(s) === 'harmonized')!;
  const editorialCross = stringsDatabase.find((s) => N.stringRatingNature(s) === 'editorial')!;
  const noneString = stringsDatabase.find((s) => N.stringRatingNature(s) === 'none');
  const pdfFor = async (main: string, cross: string | null) => {
    printed.length = 0;
    const data = buildConfigurationPdfData({
      name: 'audit', racquetId: racquetsDatabase[0].id, mainStringId: main, crossStringId: cross, mainGauge: '1.25', crossGauge: '1.25',
      mainTension: 23, crossTension: 22, rating: 0, notes: null, rcsScore: 0, compatibility: 0, createdAt: '2026-10-10T00:00:00.000Z',
    });
    (globalThis as { window?: unknown }).window = { jspdf: { jsPDF: FakePdf } };
    try { await exportConfigurationPdf(data); } finally { delete (globalThis as { window?: unknown }).window; }
    return { data, text: printed.join('\n') };
  };
  const pdfFindings = (name: string, data: { mainString?: { ratingsLabel?: string }; crossString?: { ratingsLabel?: string } | null; ratingsNotice?: string }, text: string, main: Nature, cross: Nature | null): string[] => {
    const found: string[] = [];
    const expected = (n: Nature | null) => (n === null || n === 'none' ? undefined : EXPECT[n]);
    if (data.mainString?.ratingsLabel !== expected(main)) found.push(`${name} : étiquette des données du montant « ${data.mainString?.ratingsLabel} », « ${expected(main)} » attendue`);
    if (cross !== null && data.crossString?.ratingsLabel !== expected(cross)) found.push(`${name} : étiquette des données du travers « ${data.crossString?.ratingsLabel} », « ${expected(cross)} » attendue`);
    const anyLabel = expected(main) !== undefined || expected(cross) !== undefined;
    if (anyLabel !== (data.ratingsNotice === NOTICE)) found.push(`${name} : mention des données ${data.ratingsNotice === undefined ? 'absente' : 'inattendue'}`);
    // Chaque emplacement d'impression est vérifié séparément (une étiquette présente à un seul endroit ne
    // doit pas masquer l'absence aux autres) : le bloc « Notes du cordage » imprime l'étiquette SEULE sur sa
    // ligne, l'analyse avancée la précède de « Notes utilisees - … : », la méthodologie reprend la mention.
    const lines = text.split('\n');
    const mainLabel = expected(main);
    const crossLabel = expected(cross);
    if (mainLabel !== undefined) {
      if (!lines.some((l) => l === mainLabel)) found.push(`${name} : étiquette « ${mainLabel} » absente du bloc « Notes du cordage » imprimé`);
      if (!lines.some((l) => l.includes('Notes utilisees') && l.includes(mainLabel))) found.push(`${name} : étiquette du montant absente de l’analyse avancée imprimée`);
    }
    if (crossLabel !== undefined && !lines.some((l) => l.includes('Notes utilisees') && l.includes('Travers') && l.includes(crossLabel))) {
      found.push(`${name} : étiquette du travers absente de l’analyse avancée imprimée`);
    }
    if (anyLabel) {
      if (!lines.some((l) => l === NOTICE)) found.push(`${name} : mention absente du bloc « Notes du cordage » imprimé`);
      if (!lines.some((l) => l.includes(`Notes /10 du cordage : ${NOTICE}`))) found.push(`${name} : mention absente de la méthodologie imprimée`);
    }
    if (!anyLabel && (text.includes('Appréciation') || text.includes('non mesurée en laboratoire'))) found.push(`${name} : étiquette ou mention imprimée pour des notes qui n’existent pas`);
    // (i) montant sans note : les cinq notes imprimées « non publie » (libellé historique du PDF), ni zéro, ni valeur, ni NaN.
    if (main === 'none' && cross === null) {
      if (lines.filter((l) => l === 'non publie').length !== 5) found.push(`${name} : les cinq notes absentes ne sont pas toutes imprimées « non publie »`);
      if (/NaN|\d[.,]\d\/10/.test(text)) found.push(`${name} : une note (zéro, valeur ou NaN) imprimée pour un cordage sans note`);
    }
    return found;
  };
  const pdfCases: Array<[string, string, string | null, Nature, Nature | null]> = [
    ['PDF montant harmonisé', harmonizedMain.id, null, 'harmonized', null],
    ['PDF hybride harmonisé + éditorial', harmonizedMain.id, editorialCross.id, 'harmonized', 'editorial'],
    ['PDF montant éditorial', editorialCross.id, null, 'editorial', null],
  ];
  if (noneString) pdfCases.push(['PDF cordage sans note', noneString.id, null, 'none', null]);
  const thirdPartyString = stringsDatabase.find((s) => N.stringRatingNature(s) === 'third_party');
  if (thirdPartyString) pdfCases.push(['PDF montant à note reprise d’un revendeur', thirdPartyString.id, null, 'third_party', null]);
  const pdfRuns: Array<{ data: Awaited<ReturnType<typeof pdfFor>>['data']; text: string }> = [];
  for (const [name, main, cross, nm, nc] of pdfCases) {
    const run = await pdfFor(main, cross);
    pdfRuns.push(run);
    for (const msg of pdfFindings(name, run.data, run.text, nm, nc)) fail(`nature des notes : ${msg}`);
  }

  // (f) métadonnées du catalogue : la description d'un extrait de recherche ne peut pas porter le libellé,
  //     elle ne promet donc aucune note (relevé par tsa-acquisition le 10/10/2026).
  const LAYOUT = 'src/app/tennis-strings/layout.tsx';
  const layoutFindings = (raw: string): string[] => {
    const m = /description:\s*`([^`]*)`/.exec(stripComments(raw));
    if (!m) return [`${LAYOUT} : description introuvable`];
    const promise = /(?<![\wéèêàâîôûç])(notes?|not[ée]e?s?|contr[ôo]le|confort|effets?|durabilit[ée]|puissance|spin)(?![\wéèêàâîôûç])|\/\s*10/i;
    return promise.test(m[1])
      ? [`${LAYOUT} : la description annonce des notes (« ${m[1].slice(0, 90)}… »)`]
      : [];
  };
  const layoutSource = readFileSync(LAYOUT, 'utf8');
  for (const msg of layoutFindings(layoutSource)) fail(`nature des notes : ${msg}`);

  // (h) même nature en FR (ce module) et dans l'export catalog.json lu par les pages EN (public/js/rating-labels.js).
  const EN_OF: Readonly<Record<Nature, string>> = { editorial: 'editorial', harmonized: 'harmonised', third_party: 'third_party', none: 'none' };
  type ExportRow = { id: string; rating_basis?: string };
  const natureMismatch = (rows: readonly ExportRow[]): string[] =>
    stringsDatabase.flatMap((s) => {
      const r = rows.find((x) => x.id === s.id);
      return r?.rating_basis === EN_OF[N.stringRatingNature(s)] ? [] : [`${s.id} : « ${N.stringRatingNature(s)} » en FR, « ${r?.rating_basis} » dans l’export`];
    });
  const exportRows = buildCatalog(racquetsDatabase, stringsDatabase).strings as ExportRow[];
  const mismatched = natureMismatch(exportRows);
  if (mismatched.length > 0) fail(`nature des notes : ${mismatched.length} cordage(s) de nature différente en FR et dans l’export EN, par exemple ${mismatched.slice(0, 3).join(' | ')}`);

  // (g) tests négatifs permanents : chaque altération plantée doit être détectée.
  const srcOf = (f: string) => sources.get(f) ?? '';
  const planted: Array<[string, string[]]> = [
    ['étiquette retirée de /compare', surfaceFindings('src/app/compare/page.tsx', srcOf('src/app/compare/page.tsx').replace(/<StringRatingLabel\b/g, '<Removed'))],
    ['étiquette retirée de la carte du catalogue', surfaceFindings('src/components/product/string-card.tsx', srcOf('src/components/product/string-card.tsx').replace(/<StringRatingLabel\b/g, '<Removed'))],
    ['étiquette retirée du configurateur', surfaceFindings('src/app/configurator/page.tsx', srcOf('src/app/configurator/page.tsx').replace(/<StringRatingLabel\b/g, '<Removed'))],
    ['mention retirée de la fiche', surfaceFindings('src/app/tennis-strings/[slug]/page.tsx', srcOf('src/app/tennis-strings/[slug]/page.tsx').replace(/<StringRatingsNotice\b/g, '<Removed'))],
    ['étiquette retirée du PDF (données)', surfaceFindings('src/lib/pdf-configuration-data.ts', srcOf('src/lib/pdf-configuration-data.ts').replace(/\bstringRatingLabel\(/g, 'noop('))],
    ['étiquette citée en commentaire seulement', surfaceFindings('src/app/statistics/page.tsx', srcOf('src/app/statistics/page.tsx').replace(/<StringRatingLabel\b/g, '// <StringRatingLabel').replace(/STRING_RATING_LABELS\[/g, '// STRING_RATING_LABELS['))],
    ['surface non déclarée', undeclaredFindings('src/app/top/page.tsx', "import { stringsDatabase } from '@/data/strings-database';\nexport default () => stringsDatabase.map((s) => s.control.toFixed(1));")],
    ['fiche rendue sans étiquette', sample ? renderFindings('fiche', sample.id, sample.fiche.split(htmlText(EXPECT.harmonized)).join(''), 'harmonized') : []],
    ['fiche rendue avec l’étiquette d’une autre nature', sample ? renderFindings('fiche', sample.id, sample.fiche.split(htmlText(EXPECT.harmonized)).join(htmlText(EXPECT.editorial)), 'harmonized') : []],
    ['étiquette sur un cordage sans note', renderFindings('carte', 'sans-note', `<p data-rating-nature="editorial">${EXPECT.editorial}</p>Non publié`, 'none')],
    ['PDF imprimé sans étiquette', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split(EXPECT.harmonized).join(''), 'harmonized', null)],
    ['PDF imprimé sans mention', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split(NOTICE).join(''), 'harmonized', null)],
    ['PDF : étiquette seule retirée du bloc des notes', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split('\n').filter((l) => l !== EXPECT.harmonized).join('\n'), 'harmonized', null)],
    ['PDF : étiquette retirée de l’analyse avancée', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split('\n').filter((l) => !l.includes('Notes utilisees')).join('\n'), 'harmonized', null)],
    ['PDF : mention retirée de la méthodologie', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split('\n').filter((l) => !l.includes('Notes /10 du cordage')).join('\n'), 'harmonized', null)],
    ['PDF hybride : étiquette du travers retirée', pdfFindings('PDF', pdfRuns[1].data, pdfRuns[1].text.split('\n').filter((l) => !l.includes('Travers')).join('\n'), 'harmonized', 'editorial')],
    ['description du catalogue annonçant des notes', layoutFindings(layoutSource.replace('de chaque référence', 'de chaque référence ; contrôle, confort, effet et durabilité quand la note existe'))],
    ['export EN : cordage harmonisé exporté « editorial »', natureMismatch(exportRows.map((r) => (r.id === harmonizedMain.id ? { ...r, rating_basis: 'editorial' } : r)))],
    ['export EN sans nature', natureMismatch(exportRows.map(({ id }) => ({ id })))],
    ['fiche sans note rendue avec une barre à zéro', sampleNone ? renderFindings('fiche', sampleNone.id, sampleNone.fiche.replace('Non publié', '<div role="img" aria-label="Contrôle : 0 sur 10"></div>'), 'none') : []],
    ['carte sans note avec une note globale NaN', sampleNone ? renderFindings('carte', sampleNone.id, `${sampleNone.card}<span>NaN</span>`, 'none') : []],
    ['export EN : Triax (note reprise) exporté « editorial »', natureMismatch(exportRows.map((r) => (r.id === 'tecnifibre-triax' ? { ...r, rating_basis: 'editorial' } : r)))],
    ['liste des notes reprises sans Triax', thirdPartyListFindings(THIRD_PARTY_RATED_STRING_IDS.filter((id) => id !== 'tecnifibre-triax'), PROV)],
    ['note `tw` ajoutée à une fiche hors liste', thirdPartyListFindings(THIRD_PARTY_RATED_STRING_IDS, { ...PROV, 'luxilon-original': { ...PROV['luxilon-original'], fields: { ...PROV['luxilon-original'].fields, control: 'tw' } } })],
    ['libellé affirmant une note mesurée', affirmsMeasure('Note de l’équipe TSA, mesurée en laboratoire') ? ['mesurée'] : []],
    ['mention D2 : note de confort dite mesurée', d2AffirmsMeasure('note de confort mesurée') ? ['mesurée'] : []],
    ['mention D2 : « rigidité mesurée » sans « (TWU) »', d2AffirmsMeasure('note de confort recalée sur la rigidité mesurée') ? ['mesurée'] : []],
    ['carte : note globale sans son libellé', sampleOverall ? overallFindings(sampleOverall.id, sampleOverall.card.split(htmlText(OVERALL)).join(''), true) : []],
    ['PDF sans note : zéro imprimé', noneString ? pdfFindings('PDF', pdfRuns[3].data, pdfRuns[3].text.replace('non publie', '0.0/10'), 'none', null) : []],
  ];
  for (const [name, hits] of planted) if (hits.length === 0) fail(`nature des notes : garde-fou muet sur « ${name} »`);

  if (failures.length === before) {
    ok(`nature des notes : ${stringsDatabase.length} cordages = ${natureCount.harmonized} harmonisés + ${natureCount.third_party} à note reprise d’un revendeur (liste = recalcul depuis la provenance) + ${natureCount.editorial} de l’équipe + ${natureCount.none} sans note ; ` +
      `textes figés (formulation tranchée par Opus 5.5 ; aucune chaîne de testeurs ni revendeur nommé, jamais « mesurée » sans négation) ; note globale ★ libellée sur chaque carte qui l’affiche ; description du catalogue sans promesse de note ; ${Object.keys(SURFACES).length} surfaces déclarées portent l’étiquette ` +
      `et aucune surface de ${srcTs.length} fichiers src/ n’est restée hors liste ; ${renders} rendus serveur (fiche + carte pleine + carte compacte) étiquetés selon la nature ; ` +
      `${pdfCases.length} PDF vérifiés (données et texte imprimé) ; même nature en FR et dans l’export EN (${exportRows.length} cordages) ; ` +
      `${natureCount.none} sans note : « Non publié » à chaque note, ni barre, ni zéro, ni NaN (fiche, cartes, PDF) ; ${planted.length} tests négatifs détectés`);
  }
}

// ---------------------------------------------------------------------------
// 16. AUCUNE NOTE DE RAQUETTE DÉDUITE DES CARACTÉRISTIQUES N'EST AFFICHÉE
//     (décision de Pierre du 10/10/2026)
// ---------------------------------------------------------------------------
// Historique : `/compare` mettait côte à côte le profil combiné (specs +
// testeurs) des raquettes évaluées et le profil dérivé des autres, sans
// étiquette (Gravity MP « gagnait » 4 axes sur 5 contre la Gravity Tour) ; le
// configurateur et le PDF Premium affichaient l'un ou l'autre selon la raquette.
// Règle, FR, EN et PDF : l'avis des testeurs SEUL pour une raquette évaluée,
// les caractéristiques seules sinon ; même moyenne /20 partout.
// Garde : (a) aucun fichier de src/ n'importe de `racquet-scoring` autre chose
// que la liste blanche (ni `deriveRacquetProfile`, ni un futur profil) ; (b)
// aucun libellé de profil de raquette dans src/, public/ ni les fiches EN
// générées ; (c) en exécution, comparateur et PDF ne portent que les
// caractéristiques et l'avis tel quel ; (d) tests négatifs permanents.
{
  const before = failures.length;
  const SCORING = 'src/lib/racquet-scoring.ts';
  const ALLOWED = new Set([
    'effectiveRacquetRA', 'isRacquetStiffnessEstimated', 'DEFAULT_RACQUET_RA', 'RA_RANGE',
    'racquetsForComparison', 'racquetTesterSynthesis', 'formatScore20', 'TESTER_SYNTHESIS_LABEL',
    'rankRacquetsByTesterAverage', 'ComparableRacquet', 'RacquetTesterSynthesis', 'RankedRacquet',
  ]);
  const SRC_LABELS = /Profil (de jeu|déduit|dérivé|derive|combiné|combine)\b|d[ée]riv[ée]e? des (sp[ée]cifications|specs)|DERIVE de ses specifications/i;
  const PUBLIC_LABELS = /Profil (déduit|dérivé|combiné)\b|d[ée]riv[ée]e? des (sp[ée]cifications|specs)\b|derived (racquet )?profile|profile derived|derived from (the )?spec/i;
  const stripComments = (raw: string) => raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  // (a)+(b) détecteur src/, réutilisé par les tests négatifs.
  const srcFindings = (file: string, raw: string): string[] => {
    if (file === SCORING) return [];
    const code = stripComments(raw);
    const found: string[] = [];
    for (const m of code.matchAll(/import\s+(type\s+)?([^;]*?)\s+from\s*['"][^'"]*racquet-scoring['"]/g)) {
      const clause = m[2].trim();
      const named = /^\{([\s\S]*)\}$/.exec(clause);
      if (!named) { found.push(`${file} : import global de racquet-scoring (${clause}) — importer nommément`); continue; }
      for (const raw of named[1].split(',')) {
        const name = raw.replace(/^\s*type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name && !ALLOWED.has(name)) found.push(`${file} : importe « ${name} » de racquet-scoring (hors liste blanche : aucune note déduite ne s'affiche)`);
      }
    }
    if (/import\(\s*['"][^'"]*racquet-scoring['"]\s*\)/.test(code)) found.push(`${file} : import dynamique de racquet-scoring`);
    if (/\bderiveRacquetProfile\b/.test(code)) found.push(`${file} : référence deriveRacquetProfile`);
    const label = SRC_LABELS.exec(code);
    if (label) found.push(`${file} : libellé de profil de raquette « ${label[0]} »`);
    return found;
  };
  const publicFindings = (file: string, html: string): string[] => {
    const m = PUBLIC_LABELS.exec(html);
    return m ? [`${file} : libellé de profil de raquette « ${m[0]} »`] : [];
  };
  const walk = (d: string): string[] =>
    readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walk(`${d}/${n}`) : [`${d}/${n}`]));
  const srcFiles = walk('src').filter((f) => /\.(tsx?|mts)$/.test(f));
  for (const f of srcFiles) for (const msg of srcFindings(f, readFileSync(f, 'utf8'))) fail(`notes déduites : ${msg}`);
  const publicFiles = walk('public').filter((f) => /\.(html?|m?js)$/.test(f));
  for (const f of publicFiles) for (const msg of publicFindings(f, readFileSync(f, 'utf8'))) fail(`notes déduites : ${msg}`);
  // Fiches EN générées au build (rendues en mémoire, générateur non modifié).
  const { racquetPage } = await import('./en-products/build-en-product-pages.mjs');
  const { racquets: enRacquets } = buildCatalog(racquetsDatabase, stringsDatabase);
  for (const item of enRacquets as Array<{ id: string }>) {
    for (const msg of publicFindings(`fiche EN ${item.id}`, (racquetPage as (x: unknown, i: unknown) => string)(item, {}))) fail(`notes déduites : ${msg}`);
  }
  // Comparateur : passe par racquetsForComparison, avis à part, plus de profil.
  const cmp = readFileSync('src/app/compare/page.tsx', 'utf8');
  if (!/racquetsForComparison\s*\(/.test(cmp) || !/non évaluée/.test(cmp)) fail('notes déduites : /compare n’affiche pas l’avis de testeurs à part (« non évaluée » si absent)');

  // (c) exécution : comparateur, configurateur (même fonction) et PDF.
  const rows = racquetsForComparison(racquetsDatabase);
  for (const row of rows) {
    const keys = Object.keys(row).sort().join();
    if (keys !== 'racquet,testerAverage20') fail(`notes déduites : ligne de comparaison ${row.racquet.id} porte « ${keys} »`);
    const e = RACQUET_TESTER_RATINGS[row.racquet.id];
    if (e ? row.testerAverage20 !== e.docxAverage20 : row.testerAverage20 !== null) fail(`notes déduites : moyenne comparée de ${row.racquet.id} = ${row.testerAverage20}`);
  }
  const { buildConfigurationPdfData } = await import('../src/lib/pdf-configuration-data');
  const SPEC_KEYS = new Set(['label', 'brand', 'weight', 'headSize', 'ra', 'raEstimated', 'stringPattern', 'category', 'balance', 'swingWeight', 'playerLevel']);
  const pdfFindings = (id: string, block: Record<string, unknown> | undefined): string[] => {
    if (!block) return [`PDF ${id} : bloc raquette absent`];
    const found: string[] = [];
    for (const k of Object.keys(block)) if (!SPEC_KEYS.has(k) && k !== 'testers') found.push(`PDF ${id} : champ « ${k} » hors caractéristiques et avis`);
    const e = RACQUET_TESTER_RATINGS[id];
    const t = block.testers as { label: string; average20: number; average20Text: string; criteria: Array<{ label: string; value20: number }> } | undefined;
    if (!e) { if (t) found.push(`PDF ${id} : avis de testeurs sur une raquette non évaluée`); return found; }
    if (!t) return [...found, `PDF ${id} : avis de testeurs absent`];
    if (t.label !== TESTER_SYNTHESIS_LABEL || t.average20 !== e.docxAverage20 || t.average20Text !== formatScore20(e.docxAverage20)) found.push(`PDF ${id} : moyenne ${t.average20Text} ≠ ${formatScore20(e.docxAverage20)}`);
    if (t.criteria.map((c) => c.value20).join() !== RACQUET_DISPLAYED_CRITERIA.map((c) => e.raw20[c]).join()) found.push(`PDF ${id} : critères transformés`);
    return found;
  };
  let pdfChecked = 0;
  for (const r of racquetsDatabase) {
    const data = buildConfigurationPdfData({
      name: 'audit', racquetId: r.id, mainStringId: stringsDatabase[0].id, crossStringId: null,
      mainGauge: '1.25', crossGauge: '1.25', mainTension: 23, crossTension: 23, rating: 0, notes: null,
      rcsScore: 0, compatibility: 0, createdAt: '2026-10-10T00:00:00.000Z',
    });
    for (const msg of pdfFindings(r.id, data.racquet as Record<string, unknown> | undefined)) fail(`notes déduites : ${msg}`);
    pdfChecked++;
  }
  // Même moyenne /20 partout : /statistics formate comme formatScore20.
  if (!/toLocaleString\('fr-FR', \{ minimumFractionDigits: 1, maximumFractionDigits: 2 \}\)/.test(readFileSync('src/app/statistics/page.tsx', 'utf8'))) {
    fail('notes déduites : /statistics ne formate plus la moyenne /20 comme formatScore20 (même valeur partout)');
  }

  // (d) tests négatifs permanents : chaque forme de retour doit être rejetée.
  const planted: Array<[string, string[]]> = [
    ['import deriveRacquetProfile', srcFindings('src/app/top/page.tsx', "import { deriveRacquetProfile } from '@/lib/racquet-scoring';")],
    ['profil hors liste blanche', srcFindings('src/app/top/page.tsx', "import { racquetProfile } from '../lib/racquet-scoring';")],
    ['import global', srcFindings('src/app/top/page.tsx', "import * as S from '@/lib/racquet-scoring';")],
    ['libellé src', srcFindings('src/app/top/page.tsx', '<p>Profil déduit des caractéristiques</p>')],
    ['libellé EN', publicFindings('public/en/top.html', '<td>Derived profile</td>')],
    ['champ PDF', pdfFindings('head-gravity-mp', { label: 'x', weight: 295, profile: { power: 3.3 } })],
    ['PDF recalé', pdfFindings('head-gravity-tour', { label: 'x', testers: { label: TESTER_SYNTHESIS_LABEL, average20: 13.6, average20Text: '13,6', criteria: [5, 7.5, 9, 7.5, 5.5].map((v) => ({ label: 'x', value20: v })) } })],
  ];
  for (const [name, hits] of planted) if (hits.length === 0) fail(`notes déduites : test négatif « ${name} » non détecté`);

  if (failures.length === before) {
    ok(`notes déduites : aucune sur les surfaces — ${srcFiles.length} fichiers src/ (liste blanche d'imports, aucun libellé), ${publicFiles.length} fichiers public/ et ${enRacquets.length} fiches EN sans libellé, ` +
      `comparateur sur ${rows.length} raquettes (caractéristiques + moyenne /20 à part), PDF de ${pdfChecked} raquettes (avis tel quel pour ${Object.keys(RACQUET_TESTER_RATINGS).length}, caractéristiques seules sinon), ` +
      `${planted.length} tests négatifs rejetés`);
  }
}

// ---------------------------------------------------------------------------
// 17. FORMULE DU PROFIL DÉDUIT DES CARACTÉRISTIQUES (révision du 10/10/2026)
// ---------------------------------------------------------------------------
// Ce qui a été corrigé, et que ce bloc empêche de revenir :
//   - le RA entrait dans le CONTRÔLE (souple = contrôle) : la Gravity MP (RA 57)
//     passait devant la Gravity Tour (RA 59, tamis 98, +10 g) ; il est neutre ;
//   - la règle de plan pénalisait le 16x19 et laissait 16x17 / 18x16 neutres :
//     un plan plus ouvert était mieux noté qu'un plus dense ;
//   - l'échelle de poids saturait (320 g = 10/10) et valait 0,25 pt/g au-dessus
//     de 300 g contre 0,067 au-dessous ;
//   - le poids n'entrait pas dans le contrôle.
// Les accords avec les avis de testeurs sont IMPRIMÉS (information), pas exigés :
// le but est un sens physique correct, pas de coller aux 18 raquettes évaluées.
// ⚠️ Depuis la décision de Pierre du 10/10/2026, ce profil n'est plus affiché
// (contrôle 16) ; ce bloc garde la formule tant qu'elle est conservée.
{
  const before = failures.length;
  const axes = ['power', 'control', 'comfort', 'maneuverability', 'stability'] as const;
  const isJunior = (r: (typeof racquetsDatabase)[number]) => {
    const len = (r as { length?: number }).length;
    return typeof len === 'number' && len > 0 ? len < 27 : r.category === 'Junior';
  };
  // (a) bornes des échelles = bornes réelles du catalogue (sinon saturation ou trou).
  const bounds = (v: number[]) => { const s = [...v].sort((a, b) => a - b); return { min: s[0], median: s[Math.floor(s.length / 2)], max: s[s.length - 1] }; };
  const same = (a: { min: number; median: number; max: number }, b: typeof a) => a.min === b.min && a.median === b.median && a.max === b.max;
  const adult = bounds(racquetsDatabase.filter((r) => !isJunior(r)).map((r) => r.weight));
  const junior = bounds(racquetsDatabase.filter(isJunior).map((r) => r.weight));
  const counts = racquetsDatabase.map((r) => stringCount(r.stringPattern));
  if (!same(ADULT_WEIGHT_RANGE, adult)) fail(`formule : ADULT_WEIGHT_RANGE ${JSON.stringify(ADULT_WEIGHT_RANGE)} ≠ catalogue ${JSON.stringify(adult)}`);
  if (!same(JUNIOR_WEIGHT_RANGE, junior)) fail(`formule : JUNIOR_WEIGHT_RANGE ${JSON.stringify(JUNIOR_WEIGHT_RANGE)} ≠ catalogue ${JSON.stringify(junior)}`);
  const unreadable = racquetsDatabase.filter((_, i) => counts[i] === null);
  for (const r of unreadable) fail(`formule : plan « ${r.stringPattern} » illisible pour ${r.id} (la note de plan serait neutre par défaut)`);
  if (unreadable.length === 0 && !same(STRING_COUNT_RANGE, bounds(counts as number[]))) {
    fail(`formule : STRING_COUNT_RANGE ${JSON.stringify(STRING_COUNT_RANGE)} ≠ catalogue ${JSON.stringify(bounds(counts as number[]))}`);
  }
  // (b) masse linéaire et sans saturation : deux poids adultes différents ne
  //     partagent jamais la même stabilité, et 5 g valent autant sous et sur 300 g.
  const base = racquetsDatabase.find((r) => r.id === 'babolat-pure-drive-standard')!;
  const at = (patch: Partial<typeof base>) => deriveRacquetProfile({ ...base, ...patch });
  const byWeight = new Map<number, number>();
  for (const r of racquetsDatabase.filter((x) => !isJunior(x))) byWeight.set(r.weight, deriveRacquetProfile(r).stability);
  const ws = [...byWeight.keys()].sort((a, b) => a - b);
  if (ws.some((w, i) => i > 0 && !(byWeight.get(w)! > byWeight.get(ws[i - 1])!))) fail('formule : la stabilité sature ou n’est pas strictement croissante sur la plage adulte');
  const below = at({ weight: 300 }).stability - at({ weight: 295 }).stability;
  const above = at({ weight: 305 }).stability - at({ weight: 300 }).stability;
  if (Math.abs(below - above) > 0.11) fail(`formule : 5 g valent ${below.toFixed(2)} sous 300 g et ${above.toFixed(2)} au-dessus — échelle de poids coudée`);
  // (c) contrôle : sens physique de chaque facteur, RA neutre.
  const c = (patch: Partial<typeof base>) => at(patch).control;
  if (!(c({ headSize: 98 }) > c({ headSize: 100 }))) fail('formule : un tamis plus petit ne donne pas plus de contrôle');
  if (!(c({ stringPattern: '18x20' }) > c({ stringPattern: '16x19' }))) fail('formule : un plan plus dense ne donne pas plus de contrôle');
  if (!(c({ stringPattern: '16x19' }) > c({ stringPattern: '16x17' })) || !(c({ stringPattern: '16x19' }) > c({ stringPattern: '18x16' }))) {
    fail('formule : un plan plus ouvert (16x17, 18x16) est noté au moins aussi bien qu’un 16x19 en contrôle');
  }
  if (!(c({ weight: 310 }) > c({ weight: 300 }))) fail('formule : la masse n’entre pas dans le contrôle');
  if (c({ stiffness: 57 }) !== c({ stiffness: 72 })) fail('formule : le RA modifie le contrôle (« souple = contrôle » compté deux fois avec la puissance)');
  if (!(at({ stiffness: 72 }).power > at({ stiffness: 57 }).power) || !(at({ stiffness: 57 }).comfort > at({ stiffness: 72 }).comfort)) {
    fail('formule : le RA ne joue plus son rôle en puissance (rigide = puissant) ou en confort (rigide = moins confortable)');
  }
  // (d) paires de contrôle documentées (une seule spec ou un sens physique non ambigu).
  const g = (id: string) => deriveRacquetProfile(racquetsDatabase.find((r) => r.id === id)!);
  const PAIRS: [string, string, (typeof axes)[number]][] = [
    ['wilson-blade-98-18x20-v9', 'wilson-blade-98-16x19-v9', 'control'],
    ['babolat-pure-strike-98-18x20', 'babolat-pure-strike-98-16x19', 'control'],
    ['yonex-percept-100d', 'yonex-percept-100', 'control'],
    ['babolat-pure-aero-98', 'babolat-pure-aero-standard', 'control'],
    ['wilson-pro-staff-97-v14', 'babolat-pure-drive-standard', 'control'],
    ['babolat-pure-drive-standard', 'wilson-pro-staff-97-v14', 'power'],
    ['wilson-pro-staff-97-v14', 'babolat-pure-drive-standard', 'stability'],
    ['head-radical-pro', 'head-radical-mp', 'stability'],
    ['head-radical-mp', 'head-radical-pro', 'maneuverability'],
    ['head-gravity-tour', 'head-gravity-mp', 'stability'],
    ['head-gravity-mp', 'head-gravity-tour', 'maneuverability'],
  ];
  for (const [a, b, ax] of PAIRS) if (!(g(a)[ax] > g(b)[ax])) fail(`formule : paire de contrôle inversée — ${a} ${g(a)[ax]} ≤ ${b} ${g(b)[ax]} en ${ax}`);
  if (racquetsDatabase.some((r) => !deriveRacquetProfile(r).basis.startsWith(PROFILE_BASIS_PREFIX))) {
    fail(`formule : deriveRacquetProfile ne doit contenir que des specs (libellé « ${PROFILE_BASIS_PREFIX} »)`);
  }
  // (e) accord avec les avis de testeurs sur les 18 (Spearman, inversions
  //     flagrantes = écart testeurs ≥ 3 /20 classé à l'envers) : IMPRIMÉ.
  const rank = (v: number[]) => { const o = v.map((x, i) => [x, i] as const).sort((p, q) => p[0] - q[0]); const r = new Array<number>(v.length); let i = 0;
    while (i < o.length) { let j = i; while (j + 1 < o.length && o[j + 1][0] === o[i][0]) j++; for (let k = i; k <= j; k++) r[o[k][1]] = (i + j) / 2 + 1; i = j + 1; } return r; };
  const pearson = (x: number[], y: number[]) => { const n = x.length, mx = x.reduce((p, q) => p + q) / n, my = y.reduce((p, q) => p + q) / n;
    let sxy = 0, sx = 0, sy = 0; for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sx += (x[i] - mx) ** 2; sy += (y[i] - my) ** 2; } return sxy / Math.sqrt(sx * sy); };
  const tested = Object.entries(RACQUET_TESTER_RATINGS).map(([id, e]) => ({ d: g(id), e }));
  const agreement = axes.map((ax) => {
    const d = tested.map((t) => t.d[ax]), t = tested.map((x) => x.e.raw20[RACQUET_AXIS_TO_CRITERION[ax]]);
    let inv = 0, n = 0;
    for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) { if (Math.abs(t[i] - t[j]) < 3) continue; n++; if ((d[i] - d[j]) * (t[i] - t[j]) < 0) inv++; }
    return `${ax} ρ=${pearson(rank(d), rank(t)).toFixed(2)} inv ${inv}/${n}`;
  });
  if (failures.length === before) {
    const mp = g('head-gravity-mp'), tour = g('head-gravity-tour');
    ok(`formule : échelles = bornes du catalogue (adulte ${adult.min}-${adult.max} g, junior ${junior.min}-${junior.max} g, ${STRING_COUNT_RANGE.min}-${STRING_COUNT_RANGE.max} cordes), ` +
      `masse linéaire sans saturation (10 g = ${(linearScore(310, ADULT_WEIGHT_RANGE) - linearScore(300, ADULT_WEIGHT_RANGE)).toFixed(2)} pt partout), contrôle = tamis + plan + masse avec RA neutre, ${PAIRS.length} paires dans le sens physique ; ` +
      `Gravity MP/Tour contrôle ${mp.control}/${tour.control}`);
    ok(`formule (non affichée) : accord avec les avis de testeurs (18 raquettes, information) — ${agreement.join(' · ')}`);
  }
}

// ---------------------------------------------------------------------------
// 19. DESCRIPTIONS DES CORDAGES — aucun absolu de santé, aucune promesse de confort
//     que la rigidité contredit (décision de l'orchestrateur du 11/10/2026)
// ---------------------------------------------------------------------------
// Constat (contrôle indépendant de tsa-measure, réserve R1) : après la règle C et le lot 3 de rigidités
// (PR #116), 39 cordages étaient plus rigides qu'avant et 21 d'entre eux gardaient une `description` qui
// parlait de « souple », de « confort », de « doux » ou de « bras sensible », affichée sur leur fiche juste à
// côté d'un chiffre qui la contredit. Ce bloc rend ce défaut, et les absolus de santé de la charte F7
// (« jamais "idéal pour le coude", ni aucun absolu »), impossibles à réintroduire. Il échoue si :
//   (a) une description parle du bras, du coude ou de blessure, ou promet un effet sur la santé : le confort
//       d'un montage se dit par l'indice RCS et ses alertes, pas par l'argumentaire d'une fiche ;
//   (b) une description contient un mot de confort, de douceur ou de toucher alors que la fiche est plus rigide
//       que la médiane de sa famille (le `type`, médiane relue dans les données à chaque exécution) ET que le
//       montage médian (RA 64, 24 kg) sort du palier publié « Confortable », OU alors que l'alerte bras du
//       profil standard se déclenche à ce montage (même moteur que le configurateur, notes de la fiche
//       comprises). Les fiches réellement souples gardent leurs mots ;
//   (c) une description annonce un rang de rigidité (« deuxième polyester le plus rigide du catalogue ») qui
//       n'est pas le rang réel : un fait de la base se vérifie, il ne se recopie pas ;
//   (d) `getStringRecommendation` contient un absolu de santé, cite un seuil d'alerte qui n'est pas celui que
//       le moteur applique (sondé dans `calculateAdvancedRcs`), ou si la borne du palier « Très Ferme » n'est
//       plus le seuil d'alerte du profil standard.
// Chaque garde est rejouée sur des copies altérées ; des témoins positifs prouvent que les fiches souples
// gardent leurs mots (dont un boyau plus rigide que la médiane des boyaux, mais à indice « Confortable »).
{
  const before = failures.length;
  type Fiche = (typeof stringsDatabase)[number];
  const REF_TENSION = 24; // kg : centre de l'échelle RCS (calculateRCS normalise autour de 24 kg)
  // « Sensation » capitalisé est un nom de produit (Wilson Sensation) : seul « sensation(s) » minuscule compte.
  const HEALTH = /\bbras\b|coude|elbow|blessure|épicondyl|tendin|sans (?:aucun )?(?:danger|risque)|prot[eé]g|soulag|pr[eé]vien|pr[eé]vention|thérap|rééduc/i;
  const COMFORT = /soupl|\bdou(?:x|ce(?:ur)?)\b|confort|moelleu|amorti|indulgen|ménag|\btoucher\b/i;
  const FEEL = /\bsensations?\b/;
  const RANK = /(premier|première|deuxième|troisième|quatrième|cinquième|sixième|septième|huitième|neuvième|dixième) (polyester|multifilament|boyau|synthétique|hybride) le (plus|moins) rigide du catalogue/gi;
  const ORDINAL: Record<string, number> = { premier: 1, première: 1, deuxième: 2, troisième: 3, quatrième: 4, cinquième: 5, sixième: 6, septième: 7, huitième: 8, neuvième: 9, dixième: 10 };
  const TYPE_OF: Record<string, Fiche['type']> = { polyester: 'Polyester', multifilament: 'Multifilament', boyau: 'Natural Gut', synthétique: 'Synthetic', hybride: 'Hybrid' };
  const ABSOLUTE = /idéal|parfait|optimal|sans (?:aucun )?(?:danger|risque)|garanti|prot[eé]g|soulag|pr[eé]vien|réservé aux|convient à la majorité/i;

  // Dernier indice RCS entier encore dans un palier « confortable » publié par getStringRecommendation (24).
  let comfortableMax = -Infinity;
  for (let v = -50; v <= 100; v++) if (/confortable/i.test(getStringRecommendation(v).level)) comfortableMax = v;

  const median = (v: number[]) => { const s = [...v].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  // L'alerte bras du profil standard se déclenche-t-elle sur ce cordage au montage médian (RA 64, 24 kg) ?
  const standardAlertAtReference = (s: Fiche) =>
    calculateAdvancedRcs({
      racquetStiffness: DEFAULT_RACQUET_RA,
      mainStringStiffness: s.stiffness,
      mainStringFamily: stringTypeToFamily(s.type),
      mainRatings: { control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability },
      mainTension: REF_TENSION,
      profile: { armSensitive: false },
    }).warnings.length > 0;

  const descriptionFindings = (catalog: readonly Fiche[]): string[] => {
    const issues: string[] = [];
    const medians = new Map<string, number>();
    for (const t of new Set(catalog.map((s) => s.type))) medians.set(t, median(catalog.filter((s) => s.type === t).map((s) => s.stiffness)));
    for (const s of catalog) {
      const d = s.description;
      const health = HEALTH.exec(d);
      if (health) issues.push(`${s.id} : la description parle de santé (« ${health[0]} »)`);
      const comfort = COMFORT.exec(d) ?? FEEL.exec(d);
      if (comfort) {
        const med = medians.get(s.type)!;
        const rcs = calculateRCS(DEFAULT_RACQUET_RA, s.stiffness, REF_TENSION);
        const stiffer = s.stiffness > med && rcs > comfortableMax;
        if (stiffer) issues.push(`${s.id} : mot de confort (« ${comfort[0]} ») sur une fiche plus rigide que la médiane des ${s.type} (${s.stiffness} > ${med} lb/in, indice ${rcs} au montage médian)`);
        else if (standardAlertAtReference(s)) issues.push(`${s.id} : mot de confort (« ${comfort[0]} ») sur une fiche dont l'alerte bras standard se déclenche au montage médian`);
      }
      for (const m of d.matchAll(RANK)) {
        const n = ORDINAL[m[1].toLowerCase()];
        const family = TYPE_OF[m[2].toLowerCase()];
        const inFamily = catalog.filter((x) => x.type === family);
        const ahead = inFamily.filter((x) => (m[3].toLowerCase() === 'plus' ? x.stiffness > s.stiffness : x.stiffness < s.stiffness)).length;
        const tied = inFamily.filter((x) => x.id !== s.id && x.stiffness === s.stiffness).length;
        if (s.type !== family || ahead + 1 !== n || tied > 0) issues.push(`${s.id} : rang de rigidité inexact (« ${m[0]} ») — rang réel ${ahead + 1} parmi les ${family}${tied > 0 ? ', ex æquo' : ''}`);
      }
    }
    return issues;
  };

  // (d) Seuils d'alerte sondés dans le moteur : plus petit indice qui déclenche l'alerte, sans second filet (aucune note).
  const probe = (armSensitive: boolean): number | null => {
    for (let st = 60; st <= 400; st++) {
      const adv = calculateAdvancedRcs({ racquetStiffness: DEFAULT_RACQUET_RA, mainStringStiffness: st, mainStringFamily: 'polyester', mainRatings: {}, mainTension: REF_TENSION, profile: { armSensitive } });
      if (adv.warnings.length > 0) return adv.rcs;
    }
    return null;
  };
  const SENSITIVE_AT = probe(true);
  const STANDARD_AT = probe(false);
  const recommendationFindings = (texts: readonly string[], sensitive: number | null, standard: number | null, levelAt: (v: number) => string): string[] => {
    const issues: string[] = [];
    const all = texts.join(' | ');
    const absolute = ABSOLUTE.exec(all);
    if (absolute) issues.push(`absolu de santé « ${absolute[0]} »`);
    const cited = (re: RegExp) => [...all.matchAll(re)].map((m) => Number(m[1]));
    const sens = cited(/dès (\d+) pour un bras sensible/g);
    const std = cited(/dès (\d+) sinon/g);
    if (sens.length === 0 || sens.some((v) => v !== sensitive)) issues.push(`seuil « bras sensible » cité (${sens.join(', ') || 'aucun'}) ≠ seuil du moteur (${sensitive})`);
    if (std.length === 0 || std.some((v) => v !== standard)) issues.push(`seuil « sinon » cité (${std.join(', ') || 'aucun'}) ≠ seuil du moteur (${standard})`);
    if (standard === null || levelAt(standard) !== 'Très Ferme' || levelAt(standard - 1) === 'Très Ferme') issues.push(`la borne du palier « Très Ferme » n'est plus le seuil d'alerte standard (${standard})`);
    return issues;
  };
  const byLevel = new Map<string, string[]>();
  for (let v = 0; v <= 60; v++) { const r = getStringRecommendation(v); byLevel.set(r.level, [r.description, r.suggestion]); }
  const recoTexts = [...byLevel.values()].flat();
  const recoLevel = (v: number) => getStringRecommendation(v).level;

  // --- Le catalogue réel -----------------------------------------------------------------------------------------
  if (SENSITIVE_AT === null || STANDARD_AT === null) fail('descriptions : seuils d\'alerte introuvables dans calculateAdvancedRcs (sonde muette)');
  descriptionFindings(stringsDatabase).forEach((i) => fail(`descriptions : ${i}`));
  recommendationFindings(recoTexts, SENSITIVE_AT, STANDARD_AT, recoLevel).forEach((i) => fail(`getStringRecommendation : ${i}`));
  if (byLevel.size !== 5) fail(`getStringRecommendation : ${byLevel.size} paliers au lieu de 5 sur l'intervalle sondé (0-60)`);

  // --- Tests négatifs et témoins positifs, sur des copies altérées ------------------------------------------------
  const get = (id: string): Fiche => stringsDatabase.find((s) => s.id === id) ?? (fail(`descriptions : fiche témoin ${id} absente`), stringsDatabase[0]);
  // Une fiche altérée dans le catalogue entier ; seuls les constats de CETTE fiche comptent (un défaut réel ailleurs ne doit
  // ni fabriquer une détection, ni faire rejeter un témoin).
  const on = (id: string, patch: Partial<Fiche>): string[] =>
    descriptionFindings(stringsDatabase.map((s) => (s.id === id ? { ...s, ...patch } : s))).filter((i) => i.startsWith(`${id} :`));
  const softMulti = get('head-intellitour'); // multifilament souple, sous la médiane des multifilaments
  const gut = get('wilson-natural-gut'); // boyau le plus rigide du catalogue : au-dessus de la médiane des boyaux, mais indice « Confortable »
  const gutMedian = median(stringsDatabase.filter((s) => s.type === gut.type).map((s) => s.stiffness));
  const alertingSoft = { stiffness: 150, comfort: 2, description: 'Multifilament confortable.' }; // sous la médiane, mais note de confort très basse : l'alerte se déclenche
  if (!(softMulti.stiffness <= median(stringsDatabase.filter((s) => s.type === softMulti.type).map((s) => s.stiffness)))) fail('descriptions : témoin souple head-intellitour n\'est plus sous la médiane des multifilaments');
  if (!(gut.stiffness > gutMedian && calculateRCS(DEFAULT_RACQUET_RA, gut.stiffness, REF_TENSION) <= comfortableMax)) fail('descriptions : témoin boyau wilson-natural-gut n\'est plus « au-dessus de la médiane des boyaux et à indice Confortable »');
  if (!standardAlertAtReference({ ...softMulti, ...alertingSoft })) fail('descriptions : prémisse du test d\'alerte fausse (la fiche altérée ne déclenche pas l\'alerte standard)');

  const negatives: Array<[string, string[], string]> = [
    ['absolu de santé sur une fiche souple', on(softMulti.id, { description: 'Multifilament souple, idéal pour bras sensibles.' }), 'parle de santé'],
    ['« sans risque pour le coude »', on(softMulti.id, { description: 'Montage sans risque pour le coude.' }), 'parle de santé'],
    ['« prévention des blessures »', on(softMulti.id, { description: 'Réputé pour la prévention des blessures.' }), 'parle de santé'],
    ['confort promis sur le 2e polyester le plus rigide', on('babolat-rpm-team', { description: 'Polyester avec bon équilibre entre spin, contrôle et confort.' }), 'plus rigide que la médiane'],
    ['« le plus confortable des multifilaments » au-dessus de la médiane', on('tecnifibre-tgv', { description: 'PU400 technology : 400% d\'élasticité. Le plus confortable des multifilaments.' }), 'plus rigide que la médiane'],
    ['« excellent toucher » au-dessus de la médiane', on('wilson-nxt', { description: 'Multifilament avec âme en polyuréthane pour un excellent toucher.' }), 'plus rigide que la médiane'], // NXT 173,7 : XR3 (162,9) est devenu la médiane le 23/10/2026
    ['« sensation multifilament » sur un polyester durci', on('luxilon-element', { description: 'Multi-Mono technology : sensation multifilament dans structure monofilament.', stiffness: 232 }), 'plus rigide que la médiane'],
    ['douceur promise quand l\'alerte standard se déclenche (sous la médiane)', on(softMulti.id, alertingSoft), 'alerte bras standard'],
    ['rang de rigidité inexact (3e au lieu de 2e)', on('babolat-rpm-team', { description: 'Troisième polyester le plus rigide du catalogue.' }), 'rang de rigidité inexact'],
    ['rang de rigidité inexact (côté « moins » inversé)', on('isospeed-cream', { description: 'Cinquième polyester le plus rigide du catalogue.' }), 'rang de rigidité inexact'],
    ['rang annoncé pour la mauvaise famille', on('tecnifibre-tgv', { description: 'Deuxième polyester le plus rigide du catalogue.' }), 'rang de rigidité inexact'],
    ['recommandation : ancien absolu « idéal pour … sensibilité du bras »', recommendationFindings([...recoTexts, 'Idéal pour les joueurs avec sensibilité du bras ou recherchant le maximum de confort'], SENSITIVE_AT, STANDARD_AT, recoLevel), 'absolu de santé'],
    ['recommandation : « réservé aux professionnels »', recommendationFindings([...recoTexts, 'risque élevé de tennis elbow, réservé aux professionnels'], SENSITIVE_AT, STANDARD_AT, recoLevel), 'absolu de santé'],
    ['recommandation : seuil sensible cité faux (30 au lieu de 32)', recommendationFindings(recoTexts.map((t) => t.replace('dès 32', 'dès 30')), SENSITIVE_AT, STANDARD_AT, recoLevel), 'seuil « bras sensible » cité'],
    ['recommandation : seuil standard cité faux (36 au lieu de 35)', recommendationFindings(recoTexts.map((t) => t.replace('dès 35', 'dès 36')), SENSITIVE_AT, STANDARD_AT, recoLevel), 'seuil « sinon » cité'],
    ['recommandation : plus aucun seuil cité', recommendationFindings(['Configuration très souple', 'Configuration rigide'], SENSITIVE_AT, STANDARD_AT, recoLevel), 'seuil « bras sensible » cité'],
    ['recommandation : palier « Très Ferme » décalé du seuil d\'alerte', recommendationFindings(recoTexts, SENSITIVE_AT, STANDARD_AT, (v) => recoLevel(v + 1)), 'borne du palier'],
  ];
  for (const [name, found, needle] of negatives) {
    if (!found.some((i) => i.includes(needle))) fail(`descriptions : garde-fou muet sur « ${name} » (${needle})`);
  }
  const positives: Array<[string, string[]]> = [
    ['une fiche souple garde « très confortable » et « toucher »', on(softMulti.id, { description: 'Multifilament très confortable, toucher soyeux.' })],
    ['un boyau au-dessus de la médiane des boyaux garde « confort » (indice Confortable)', on(gut.id, { description: 'Boyau naturel premium. Confort et puissance exceptionnels.' })],
    ['un rang exact est accepté', on('babolat-rpm-team', { description: 'Deuxième polyester le plus rigide du catalogue.' })],
  ];
  for (const [name, found] of positives) if (found.length > 0) fail(`descriptions : témoin positif « ${name} » rejeté à tort : ${found.join(' ; ')}`);

  if (failures.length === before) {
    const medians = [...new Set(stringsDatabase.map((s) => s.type))].map((t) => `${t} ${median(stringsDatabase.filter((s) => s.type === t).map((s) => s.stiffness))}`).join(', ');
    const above = stringsDatabase.filter((s) => s.stiffness > median(stringsDatabase.filter((x) => x.type === s.type).map((x) => x.stiffness)) && calculateRCS(DEFAULT_RACQUET_RA, s.stiffness, REF_TENSION) > comfortableMax).length;
    const alerting = stringsDatabase.filter(standardAlertAtReference).length;
    const keepers = stringsDatabase.filter((s) => COMFORT.test(s.description) || FEEL.test(s.description)).length;
    const ranks = stringsDatabase.reduce((n, s) => n + [...s.description.matchAll(RANK)].length, 0);
    ok(`descriptions : ${stringsDatabase.length} fiches sans mot de santé ; aucun mot de confort sur les ${above} fiches plus rigides que la médiane de leur famille (hors indice « Confortable » ≤ ${comfortableMax}) ni sur les ${alerting} à alerte standard au montage médian (RA ${DEFAULT_RACQUET_RA}, ${REF_TENSION} kg ; médianes : ${medians}) ; ` +
      `${keepers} fiches souples gardent leurs mots ; ${ranks} rang(s) de rigidité annoncé(s) exact(s) ; getStringRecommendation : 5 paliers sans absolu, seuils cités = seuils du moteur (${SENSITIVE_AT} sensible, ${STANDARD_AT} sinon), palier « Très Ferme » dès ${STANDARD_AT} ; ` +
      `${negatives.length} tests négatifs détectés, ${positives.length} témoins positifs acceptés`);
  }
}

// ---------------------------------------------------------------------------
// 20. TEXTES DES MOTEURS STATIQUES RCS — aucune allégation thérapeutique ou protectrice, des chiffres qui sont
//     ceux du moteur (décision de l'orchestrateur du 11/10/2026, charte F7 « la santé d'abord »)
// ---------------------------------------------------------------------------
// Constat (relevé par tsa-core pendant la PR #119) : `public/js/rcs-calculator-en.js` (chargé par configurator.html,
// rcs-calculator.html et setups.html) et sa jumelle FR portaient les allégations médicales les plus graves du dépôt :
// « Post-injury rehabilitation », « Chronic tennis elbow », « Seniors / Fragile arm », « Therapeutic Comfort Zone »,
// « Maximum arm protection », « Recommended under medical supervision »... Sans source médicale, c'est contraire à la
// charte F7 et à la règle 2. Les textes décrivent désormais ce que l'indice mesure (plage, position par rapport aux
// seuils d'alerte bras du configurateur) ; ce bloc rend les allégations impossibles à réintroduire. Il échoue si :
//   (a) une chaîne du source (littéraux de chaîne et de gabarit ; clés de structure et codes machine exclus) ou une
//       sortie du moteur (niveaux, zones, profils, évaluations et alertes pour RCS 0 à 60, gabarits HTML) contient une
//       allégation thérapeutique, médicale, protectrice, de public médicalisé ou un absolu de santé, hors la mise en
//       garde du message d'alerte (« Non recommandé pour ... antécédents de blessures »), qui doit rester présente et
//       n'apparaître nulle part ailleurs ;
//   (b) un chiffre cité n'est pas celui du moteur : plage de chaque niveau et de chaque zone (bornes du moteur), marge
//       au seuil d'alerte, seuils cités (sondés dans `calculateAdvancedRcs`), exemples de valeurs (recalculés, ils
//       doivent tomber dans leur niveau), levier « 1 kg de tension = 0,5 point » (mesuré sur la formule), plage des
//       profils ;
//   (c) une alerte santé est supprimée ou déplacée : seuils du moteur ≠ seuils sondés, « tennis elbow » absent d'un
//       message d'alerte, conseil de consulter un professionnel de santé disparu ; un profil à bras sensible (drapeau
//       `armSensitive`, tenu par le contrôle 9) est alerté dès le seuil « bras sensible », les autres dès le seuil standard, et
//       le verdict d'un profil sensible entre les deux seuils cite les deux.
// Chaque garde est rejouée sur des copies altérées du source ; des témoins positifs prouvent que les avertissements
// légitimes et les reformulations inoffensives passent. L'équivalence « code identique, seules les chaînes changent »
// se prouve hors de ce script (squelette syntaxique comparé à `origin/main`, PR du 11/10/2026).
{
  const before = failures.length;
  type Lang = 'en' | 'fr';
  const ENGINES: Array<{ path: string; lang: Lang }> = [
    { path: 'public/js/rcs-calculator-en.js', lang: 'en' },
    { path: 'public/js/rcs-calculator.js', lang: 'fr' },
  ];
  const PROFILS = ['reeducation', 'tennis_elbow', 'senior', 'debutant', 'club', 'confirme', 'competiteur', 'expert', 'pro'];
  const SWEEP = Array.from({ length: 61 }, (_, i) => i); // RCS 0 à 60

  // Les familles d'allégations de la décision du 11/10/2026 (therapeutic|thérap|rehabilit|rééduc|injur|blessure|
  // protection|prévent|prevent|soulag|relieve|heal|guér|medical|médical|supervision|chronic|chronique|fragile|seniors?),
  // élargies aux formes voisines qui portaient les mêmes allégations (épicondylite, coudière, kiné, « santé articulaire »,
  // icône d'hôpital, « absorbe les vibrations »...) et aux absolus de la charte F7. « heal » est pris en mot entier et « health » /
  // « santé » ne sont permis que dans « health professional » / « professionnel de santé » (le conseil de consulter).
  const CLAIMS: Array<[string, RegExp]> = [
    ['thérapeutique', /therap|thérap|rehabilit|rééduc|reeduc|physio|kin[ée]sith/i],
    ['médical', /injur|bless[eéèuû]|medical|médical|supervision|tendin|surgery|chirurg|opératoire|operatoire|post-op|épicondyl|epicondyl|arthr(?:it|os)|\bbrace\b|coudière|[\u{1F3E5}\u{1FA7A}\u{1F48A}\u{1FA79}\u{1F691}⚕]/iu],
    ['protection', /protect|prot[eéè]g|pr[eé]ven|soulag|relie(?:f|ve)|allevia|\bheal(?:s|ed|ing)?\b|guér|\bcure[sd]?\b|aggravat|pr[eé]serv|\bhealth\b(?! professional)|(?<!professionnel de )\bsant[eé](?![a-zà-ÿ_])/i],
    ['effet sur le bras', /absorb|dampen|(?:reduce|reduces|reducing|lessen|lessens)\s+(?:the\s+|significantly\s+)?(?:stress|strain|vibration|shock|pain)|absorbe|amortit|(?:réduit|diminue)\s+(?:considérablement\s+)?(?:le\s+|les\s+)?(?:stress|vibration|choc|douleur|sollicitation)/i],
    ['public médicalisé', /chronic|chronique|fragile|\bs[eé]niors?\b|âgé|elderly/i],
    ['absolu', /\bideal|\bidéal|perfect|parfait|optimal|\bsafe\b|\bsafely\b|\bsûr|sans (?:aucun )?(?:danger|risque)|without (?:any )?risk|risk-free|guarantee|garanti|ultimate|ultime/i],
  ];
  // La seule mise en garde qui nomme les antécédents de blessure : elle DÉCONSEILLE, elle ne promet rien.
  const ALERT_PHRASE: Record<Lang, string> = {
    en: 'Not recommended for occasional players or those with injury history',
    fr: 'Non recommandé pour les joueurs occasionnels ou ayant des antécédents de blessures',
  };
  const clip = (s: string) => (s.length > 80 ? `${s.slice(0, 77)}…` : s);
  const claimsIn = (text: string, lang: Lang): string[] => {
    const t = text.split(ALERT_PHRASE[lang]).join(' ');
    const hits: string[] = [];
    for (const [family, re] of CLAIMS) {
      const m = re.exec(t);
      if (m) hits.push(`${family} « ${m[0]} » dans « ${clip(text)} »`);
    }
    return hits;
  };

  // Chaînes du source : littéraux et gabarits, hors clés de structure ('senior', 'reeducation'...) et codes machine
  // (status, level) que les pages lisent mais n'affichent pas.
  const sourceStrings = (src: string): string[] => {
    const sf = ts.createSourceFile('engine.js', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    const out: string[] = [];
    const MACHINE = new Set(['status', 'level']);
    const visit = (node: ts.Node): void => {
      if (ts.isStringLiteral(node)) {
        const p = node.parent;
        const isKey = ts.isPropertyAssignment(p) && p.name === node;
        const isCode = ts.isPropertyAssignment(p) && p.initializer === node && MACHINE.has(p.name.getText(sf).replace(/['"]/g, ''));
        if (!isKey && !isCode) out.push(node.text);
      } else if (ts.isNoSubstitutionTemplateLiteral(node)) {
        out.push(node.text);
      } else if (ts.isTemplateExpression(node)) {
        out.push(node.head.text + node.templateSpans.map((s) => `\${…}${s.literal.text}`).join(''));
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return out;
  };

  // Sorties du moteur : tout ce qu'un visiteur peut lire.
  const runtimeStrings = (engine: any): string[] => {
    const out = new Set<string>();
    const SKIP = new Set(['status', 'level']);
    const walk = (v: unknown, key?: string): void => {
      if (key && SKIP.has(key)) return;
      if (typeof v === 'string') out.add(v);
      else if (Array.isArray(v)) v.forEach((x) => walk(x));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v as Record<string, unknown>)) walk(x, k);
    };
    walk(engine.DECILES);
    walk(engine.QUINTILES);
    for (const p of PROFILS) {
      walk(engine.getRecommendations(p));
      for (const rcs of SWEEP) walk(engine.evaluateForProfile(rcs, p));
    }
    for (const rcs of SWEEP) walk(engine.getHealthWarning(rcs));
    engine.DECILES.forEach((d: any, i: number) => out.add(engine.generateDecileDetailHTML({ number: i + 1, ...d })));
    engine.QUINTILES.forEach((q: any, i: number) => out.add(engine.generateQuintileHTML({ number: i + 1, ...q })));
    for (const [ra, st, tn] of [[56, 95, 19], [64, 160, 23], [68, 220, 26], [70, 250, 28]]) out.add(engine.generateReport(engine.calculate(ra, st, tn), ra, st, tn));
    return [...out];
  };

  // Seuils d'alerte bras sondés dans le moteur du configurateur (`probeArmAlert`, plus haut, partagé avec le contrôle 9).
  const SENSITIVE_AT = ARM_ALERT_SENSITIVE;
  const STANDARD_AT = ARM_ALERT_STANDARD;

  const nums = (t: string): string[] => [...t.matchAll(/\d+(?:[.,]\d+)?/g)].map((m) => m[0].replace(',', '.'));
  const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);
  const rangeOf = (bounds: number[], i: number, count: number) => ({ lo: i === 0 ? null : bounds[i - 1], hi: i === count - 1 ? null : bounds[i] - 1 });
  const rangeNums = (lo: number | null, hi: number | null): string[] =>
    lo === null ? [String(hi)] : hi === null || hi === lo ? [String(lo)] : [String(lo), String(hi)];

  const analyse = (src: string, lang: Lang, S: number, N: number): { issues: string[]; scanned: [number, number]; examples: number } => {
    const issues: string[] = [];
    let engine: any;
    try {
      engine = new Function('window', 'document', `${src}; return typeof RCS !== 'undefined' ? RCS : window.RCS;`)({}, { addEventListener() {} });
    } catch (e) {
      return { issues: [`moteur illisible (${(e as Error).message})`], scanned: [0, 0], examples: 0 };
    }

    // (a) allégations : source puis sorties
    const fromSource = sourceStrings(src);
    const fromRuntime = runtimeStrings(engine);
    for (const s of fromSource) issues.push(...claimsIn(s, lang));
    for (const s of fromRuntime) issues.push(...claimsIn(s, lang));
    const carriers = fromSource.filter((s) => s.includes(ALERT_PHRASE[lang]));
    if (carriers.length !== 1) issues.push(`phrase d'alerte « ${ALERT_PHRASE[lang]} » présente dans ${carriers.length} chaînes du source au lieu de 1 (le message d'alerte seul)`);

    // (b) chiffres vrais
    const decs: any[] = engine.DECILES;
    const quis: any[] = engine.QUINTILES;
    const bounds: number[] = engine.DECILE_BOUNDS;
    const qb: number[] = engine.QUINTILE_BOUNDS;
    if (decs.length !== 10 || bounds.length !== 9 || quis.length !== 5 || qb.length !== 4) {
      issues.push(`structure : ${decs.length} niveaux / ${bounds.length} bornes, ${quis.length} zones / ${qb.length} bornes (attendu 10 / 9 et 5 / 4) — les textes citent ces plages`);
      return { issues, scanned: [fromSource.length, fromRuntime.length], examples: 0 };
    }
    const lever = Math.round(2 * (engine.calculate(64, 160, 24).details.score_brut - engine.calculate(64, 160, 23).details.score_brut) * 10) / 10;
    let examples = 0;
    decs.forEach((d, i) => {
      const tag = `D${i + 1}`;
      const { lo, hi } = rangeOf(bounds, i, decs.length);
      const range = rangeNums(lo, hi);
      const cls = hi !== null && hi < S ? 'A' : lo !== null && hi !== null && lo >= S && hi < N ? 'B' : hi === null && lo !== null && lo >= S && lo < N ? 'C' : '?';
      if (cls === '?') {
        issues.push(`plage : ${tag} (${lo ?? '…'} à ${hi ?? '…'}) n'entre dans aucune des trois classes de texte (sous les deux seuils ${S}/${N}, entre eux, à cheval sur ${N}) — réécrire ce niveau`);
        return;
      }
      let margin: string[];
      if (cls === 'A') {
        const hiM = S - (hi as number);
        margin = lo === null || S - lo === hiM ? [String(hiM), String(S)] : [String(hiM), String(S - lo), String(S)];
      } else margin = cls === 'B' ? [String(S)] : [String(S), String(N)];
      if (!same(nums(d.description), margin)) issues.push(`marge : ${tag} « ${d.description} » cite ${nums(d.description).join(', ')} au lieu de ${margin.join(', ')} (seuils ${S}/${N}, plage ${range.join('-')})`);
      const comment = cls === 'C' ? [...range, String(N)] : range;
      if (!same(nums(d.detailedComment), comment)) issues.push(`plage : ${tag} « ${clip(d.detailedComment)} » cite ${nums(d.detailedComment).join(', ')} au lieu de ${comment.join(', ')}`);
      const chips: string[] = d.targetPlayers;
      if (chips.length !== 3 || !same(nums(chips[0] ?? ''), range) || !same(nums(chips[1] ?? ''), [String(S)]) || !same(nums(chips[2] ?? ''), [String(N)])) {
        issues.push(`plage : ${tag} repères ${JSON.stringify(chips)} ≠ plage ${range.join('-')}, seuils ${S} et ${N}`);
      }
      const advice = nums(d.recommendations.advice);
      if (advice.length !== 4 || !same(advice.slice(0, 3), [String(S), String(N), '1'])) issues.push(`seuil : ${tag} conseil « ${clip(d.recommendations.advice)} » cite ${advice.join(', ')} au lieu de ${S}, ${N}, 1, ${lever}`);
      else if (advice[3] !== String(lever)) issues.push(`levier : ${tag} conseil « ${clip(d.recommendations.advice)} » annonce ${advice[3]} point par kg de tension, la formule du moteur en donne ${lever}`);
      const ra = /RA\s*(\d+(?:[.,]\d+)?)/.exec(d.recommendations.racquet);
      const st = /(\d+(?:[.,]\d+)?)\s*lb\/in/.exec(d.recommendations.string);
      const tn = /(\d+(?:[.,]\d+)?)\s*kg/.exec(d.recommendations.tension);
      if (!ra || !st || !tn) issues.push(`exemple : ${tag} valeurs illisibles (« ${d.recommendations.racquet} », « ${d.recommendations.string} », « ${d.recommendations.tension} »)`);
      else {
        const [r, s, t] = [ra[1], st[1], tn[1]].map((x) => Number(x.replace(',', '.')));
        const got = engine.calculate(r, s, t);
        const expected = calculateRCS(r, s, t);
        if (got.rcs !== expected || got.decile.number !== i + 1 || (lo !== null && expected < lo) || (hi !== null && expected > hi)) {
          issues.push(`exemple : ${tag} RA ${r} · ${s} lb/in · ${t} kg donne RCS ${expected} (moteur ${got.rcs}, niveau D${got.decile.number}) hors de la plage ${range.join('-')}`);
        } else examples++;
      }
    });
    quis.forEach((q, j) => {
      const { lo, hi } = rangeOf(qb, j, quis.length);
      const place = hi !== null ? hi < S : lo !== null && lo >= S;
      if (!place) issues.push(`plage : zone Q${j + 1} (${lo ?? '…'} à ${hi ?? '…'}) à cheval sur le seuil ${S} — réécrire cette zone`);
      const want = [...rangeNums(lo, hi), String(S), String(N)];
      if (!same(nums(q.description), want)) issues.push(`plage : Q${j + 1} « ${clip(q.description)} » cite ${nums(q.description).join(', ')} au lieu de ${want.join(', ')}`);
    });
    for (const p of PROFILS) {
      const rec = engine.getRecommendations(p);
      if (!same(nums(rec.description), rec.rcsRange.map(String))) issues.push(`plage : profil ${p} « ${rec.description} » cite ${nums(rec.description).join(', ')} au lieu de ${rec.rcsRange.join(', ')}`);
    }

    // (c) alertes : seuils du moteur = seuils sondés, texte du risque présent, jamais supprimées
    if (engine.HEALTH_ALERT_RCS !== N) issues.push(`alerte : HEALTH_ALERT_RCS = ${engine.HEALTH_ALERT_RCS} alors que l'alerte standard du configurateur est à ${N}`);
    if (engine.HEALTH_ALERT_SENSITIVE_RCS !== S) issues.push(`alerte : HEALTH_ALERT_SENSITIVE_RCS = ${engine.HEALTH_ALERT_SENSITIVE_RCS} alors que l'alerte bras sensible du configurateur est à ${S}`);
    const levelAt = (v: number): string | null => engine.getHealthWarning(v)?.level ?? null;
    if (levelAt(S - 1) !== null || levelAt(S) !== 'warning' || levelAt(N - 1) !== 'warning' || levelAt(N) !== 'danger' || levelAt(N + 10) !== 'danger') {
      issues.push(`alerte : getHealthWarning ne bascule pas aux seuils du configurateur (${S - 1}:${levelAt(S - 1)}, ${S}:${levelAt(S)}, ${N - 1}:${levelAt(N - 1)}, ${N}:${levelAt(N)}) — attendu null, warning, warning, danger`);
    }
    const danger = engine.getHealthWarning(N);
    const amber = engine.getHealthWarning(S);
    if (danger) {
      if (!same(nums(danger.message), [String(N)])) issues.push(`alerte : message de l'alerte rouge cite ${nums(danger.message).join(', ')} au lieu de ${N}`);
      if (!/tennis elbow/i.test(danger.message)) issues.push(`alerte : le message de l'alerte rouge ne dit plus le risque de tennis elbow`);
      if (!danger.message.includes(ALERT_PHRASE[lang])) issues.push(`alerte : le message de l'alerte rouge ne porte plus sa mise en garde (« ${ALERT_PHRASE[lang]} »)`);
      if (!Array.isArray(danger.tips) || danger.tips.length < 4) issues.push(`alerte : l'alerte rouge n'a plus ses 4 conseils (${danger.tips?.length ?? 0})`);
      else if (!danger.tips.some((t: string) => (lang === 'en' ? /health professional/i : /professionnel de santé/i).test(t))) issues.push(`alerte : l'alerte rouge ne conseille plus de consulter un professionnel de santé si la douleur persiste`);
    }
    if (amber) {
      if (!same(nums(amber.message), [String(S), String(N - 1), String(N)])) issues.push(`alerte : message de l'alerte orange cite ${nums(amber.message).join(', ')} au lieu de ${S}, ${N - 1}, ${N}`);
      if (!Array.isArray(amber.tips) || amber.tips.length < 3) issues.push(`alerte : l'alerte orange n'a plus ses 3 conseils (${amber.tips?.length ?? 0})`);
    }
    for (const p of PROFILS) {
      // Profil à bras sensible déclaré : alerte dès S ; les autres dès N (drapeau lu dans le moteur, dont la liste est tenue par le contrôle 9).
      const alertAt = engine.getRecommendations(p).armSensitive === true ? S : N;
      for (let rcs = 0; rcs <= 60; rcs++) {
        const ev = engine.evaluateForProfile(rcs, p);
        if (rcs >= alertAt) {
          if (ev.status !== 'risque_sante' || ev.isOk !== false || !/tennis elbow/i.test(ev.message)) issues.push(`alerte : profil ${p} à RCS ${rcs} : « ${clip(String(ev.message))} » (statut ${ev.status}) ne signale plus le risque de tennis elbow`);
          // Entre S et N, le verdict d'un profil à bras sensible cite les deux seuils : l'alerte ne dépend plus du seul profil standard.
          if (rcs < N && !same(nums(String(ev.suggestion)), [String(S), String(N)])) issues.push(`seuil : profil ${p} à RCS ${rcs} : « ${clip(String(ev.suggestion))} » cite ${nums(String(ev.suggestion)).join(', ') || 'aucun seuil'} au lieu de ${S}, ${N}`);
        } else {
          if (ev.status === 'risque_sante') issues.push(`alerte : profil ${p} à RCS ${rcs} signale un risque sous son seuil ${alertAt}`);
          if (ev.status === 'trop_souple' || ev.status === 'trop_rigide') {
            const tail = nums(ev.suggestion).slice(-2);
            if (!same(tail, [String(S), String(N)])) issues.push(`seuil : profil ${p} à RCS ${rcs} : « ${clip(ev.suggestion)} » cite ${tail.join(', ')} au lieu de ${S}, ${N}`);
          }
        }
      }
    }
    return { issues: [...new Set(issues)], scanned: [fromSource.length, fromRuntime.length], examples };
  };

  // --- Les moteurs réels -----------------------------------------------------------------------------------------
  if (SENSITIVE_AT === null || STANDARD_AT === null) fail('textes des moteurs : seuils d\'alerte introuvables dans calculateAdvancedRcs (sonde muette)');
  else {
    const S = SENSITIVE_AT;
    const N = STANDARD_AT;
    const sources = new Map<string, string>();
    let scanned = '';
    let examplesChecked = 0;
    for (const { path: file, lang } of ENGINES) {
      let src = '';
      try {
        src = readFileSync(file, 'utf8');
      } catch {
        fail(`${file} : moteur introuvable`);
        continue;
      }
      sources.set(file, src);
      const res = analyse(src, lang, S, N);
      res.issues.forEach((i) => fail(`${file} : ${i}`));
      scanned += `${scanned ? ' + ' : ''}${res.scanned[0]} chaînes du source et ${res.scanned[1]} sorties (${lang.toUpperCase()})`;
      examplesChecked += res.examples;
    }

    // --- Tests négatifs : le source altéré doit être refusé, pour la bonne raison ---------------------------------
    type Mutation = { name: string; find: string; replace: string; needle: string };
    const NEGATIVES: Record<Lang, Mutation[]> = {
      en: [
        { name: 'libellé « Therapeutic »', find: "label: 'Very Soft'", replace: "label: 'Therapeutic Comfort+'", needle: 'thérapeutique' },
        { name: '« Post-injury rehabilitation »', find: "description: 'At least 11 points under the sensitive-arm alert (32)'", replace: "description: 'Post-injury rehabilitation'", needle: 'thérapeutique' },
        { name: '« Recommended under medical supervision »', find: "description: '6 points under the sensitive-arm alert (32)'", replace: "description: 'Recommended under medical supervision'", needle: 'médical' },
        { name: '« Chronic tennis elbow » dans un commentaire', find: "detailedComment: 'RCS 22 to 23. Below both arm alert thresholds of the configurator.'", replace: "detailedComment: 'Therapeutic setup for chronic tennis elbow. It significantly reduces stress transmitted to the arm.'", needle: 'public médicalisé' },
        { name: '« Seniors / Fragile arm »', find: "label: 'Medium-Soft'", replace: "label: 'Seniors / Fragile arm'", needle: 'public médicalisé' },
        { name: '« Maximum arm protection »', find: "summary: 'Lowest firmness index'", replace: "summary: 'Maximum arm protection'", needle: 'protection' },
        { name: '« Helps prevent injuries »', find: "summary: 'Lower-middle firmness index'", replace: "summary: 'Helps prevent injuries'", needle: 'protection' },
        { name: '« Ideal for beginners »', find: "summary: 'Middle of the scale'", replace: "summary: 'Ideal for beginners'", needle: 'absolu' },
        { name: 'protection dans un gabarit de chaîne', find: 'moves the index up toward this range (more control, less comfort).', replace: 'moves the index up toward this range to protect your arm.', needle: 'protection' },
        { name: '« Absolute priority on joint health »', find: "summary: 'Sensitive-arm alert reached or exceeded'", replace: "summary: 'Absolute priority on joint health'", needle: 'protection' },
        { name: '« absorbs vibrations and reduces stress »', find: "summary: 'Upper-middle, approaching the sensitive-arm alert'", replace: "summary: 'Absorbs vibrations and significantly reduces stress transmitted to the arm'", needle: 'effet sur le bras' },
        { name: 'icône d\'hôpital', find: "icon: '☁️'", replace: "icon: '🏥'", needle: 'médical' },
        { name: 'blessure hors du message d\'alerte', find: "'Consult a health professional if pain or discomfort persists'", replace: "'Recommended after an injury'", needle: 'médical' },
        { name: 'mise en garde recopiée hors du message d\'alerte', find: "summary: 'Lowest firmness index'", replace: "summary: 'Not recommended for occasional players or those with injury history'", needle: 'phrase d\'alerte' },
        { name: 'seuil du moteur décalé (HEALTH_ALERT_RCS)', find: 'HEALTH_ALERT_RCS: 35,', replace: 'HEALTH_ALERT_RCS: 36,', needle: 'alerte :' },
        { name: 'alerte orange décalée à 33', find: '} else if (rcs >= 32) {', replace: '} else if (rcs >= 33) {', needle: 'alerte :' },
        { name: 'seuil cité faux (30 au lieu de 32)', find: 'from 32 for a sensitive arm, from 35 otherwise. A change of 1 kg', replace: 'from 30 for a sensitive arm, from 35 otherwise. A change of 1 kg', needle: 'seuil :' },
        { name: 'plage citée fausse (24 à 26 au lieu de 24 à 25)', find: "'RCS 24 to 25', 'Sensitive-arm alert: 32'", replace: "'RCS 24 to 26', 'Sensitive-arm alert: 32'", needle: 'plage :' },
        { name: 'marge citée fausse (7 au lieu de 6)', find: "description: '6 points under the sensitive-arm alert (32)'", replace: "description: '7 points under the sensitive-arm alert (32)'", needle: 'marge :' },
        { name: 'exemple hors de son niveau', find: "string: '95 lb/in'", replace: "string: '250 lb/in'", needle: 'exemple :' },
        { name: 'levier faux (1 point au lieu de 0,5)', find: 'moves the index by 0.5 point', replace: 'moves the index by 1 point', needle: 'levier :' },
        { name: 'plage de zone fausse', find: "description: 'RCS 27 to 28. Below", replace: "description: 'RCS 27 to 29. Below", needle: 'plage :' },
        { name: 'plage de profil fausse', find: "description: 'Club player (RCS 26 to 29)'", replace: "description: 'Club player (RCS 26 to 30)'", needle: 'plage :' },
        { name: 'l\'alerte rouge ne dit plus le risque', find: '(tennis elbow risk). This configuration generates', replace: '. This configuration generates', needle: 'alerte :' },
        { name: 'le verdict de profil ne dit plus le risque', find: '): tennis elbow risk', replace: '): risk', needle: 'alerte :' },
        { name: 'le verdict du profil sensible (32-34) ne dit plus le risque', find: '): tennis elbow risk for a sensitive arm', replace: '): risk for a sensitive arm', needle: 'alerte :' },
        { name: 'le verdict du profil sensible cite un seuil faux (30 au lieu de 32)', find: 'Lower the tension or switch to a softer string in the mains. Arm alerts of the configurator: from 32', replace: 'Lower the tension or switch to a softer string in the mains. Arm alerts of the configurator: from 30', needle: 'seuil :' },
        { name: 'le seuil « bras sensible » du moteur décalé à 31', find: 'HEALTH_ALERT_SENSITIVE_RCS: 32,', replace: 'HEALTH_ALERT_SENSITIVE_RCS: 31,', needle: 'alerte :' },
        { name: 'l\'alerte des profils sensibles supprimée', find: 'if (rec.armSensitive && rcs >= this.HEALTH_ALERT_SENSITIVE_RCS) {', replace: 'if (false) {', needle: 'alerte :' },
        { name: 'le conseil de consulter disparaît', find: "'Consult a health professional if pain or discomfort persists'", replace: "'Take a rest'", needle: 'alerte :' },
      ],
      fr: [
        { name: 'libellé « thérapeutique »', find: "label: 'Très souple'", replace: "label: 'Confort thérapeutique'", needle: 'thérapeutique' },
        { name: '« Rééducation post-blessure »', find: "description: 'Au moins 11 points sous l\\'alerte bras sensible (32)'", replace: "description: 'Rééducation post-blessure'", needle: 'thérapeutique' },
        { name: '« supervision médicale »', find: "description: '6 points sous l\\'alerte bras sensible (32)'", replace: "description: 'Recommandé sous supervision médicale'", needle: 'médical' },
        { name: '« tennis elbow chronique » dans un commentaire', find: "detailedComment: 'RCS 22 à 23. Sous les deux seuils d\\'alerte bras du configurateur.'", replace: "detailedComment: 'Setup thérapeutique pour tennis elbow chronique.'", needle: 'public médicalisé' },
        { name: '« Seniors / Bras fragile »', find: "label: 'Moyennement souple'", replace: "label: 'Seniors / Bras fragile'", needle: 'public médicalisé' },
        { name: '« Protection maximale du bras »', find: "summary: 'Indice de fermeté le plus bas'", replace: "summary: 'Protection maximale du bras'", needle: 'protection' },
        { name: '« prévenir les blessures »', find: "summary: 'Indice de fermeté moyen-bas'", replace: "summary: 'Aide à prévenir les blessures'", needle: 'protection' },
        { name: '« Idéal pour les débutants »', find: "summary: 'Milieu de l\\'échelle'", replace: "summary: 'Idéal pour les débutants'", needle: 'absolu' },
        { name: 'protection dans un gabarit de chaîne', find: "rapproche l'indice de cette plage (plus de contrôle, moins de confort).", replace: 'protège votre bras (plus de contrôle, moins de confort).', needle: 'protection' },
        { name: '« Priorité absolue à la santé articulaire »', find: "summary: 'Alerte bras sensible atteinte ou dépassée'", replace: "summary: 'Priorité absolue à la santé articulaire'", needle: 'protection' },
        { name: '« absorbe les vibrations et réduit le stress »', find: "summary: 'Moyen-haut, à l\\'approche de l\\'alerte bras sensible'", replace: "summary: 'Absorbe les vibrations et réduit considérablement le stress transmis au bras'", needle: 'effet sur le bras' },
        { name: 'icône d\'hôpital', find: "icon: '☁️'", replace: "icon: '🏥'", needle: 'médical' },
        { name: 'blessure hors du message d\'alerte', find: "'Consultez un professionnel de santé en cas de douleur ou de gêne persistante'", replace: "'Reprise après blessure'", needle: 'médical' },
        { name: 'mise en garde recopiée hors du message d\'alerte', find: "summary: 'Indice de fermeté le plus bas'", replace: "summary: 'Non recommandé pour les joueurs occasionnels ou ayant des antécédents de blessures'", needle: 'phrase d\'alerte' },
        { name: 'seuil du moteur décalé (HEALTH_ALERT_RCS)', find: 'HEALTH_ALERT_RCS: 35,', replace: 'HEALTH_ALERT_RCS: 36,', needle: 'alerte :' },
        { name: 'alerte orange décalée à 33', find: '} else if (rcs >= 32) {', replace: '} else if (rcs >= 33) {', needle: 'alerte :' },
        { name: 'seuil cité faux (30 au lieu de 32)', find: 'dès 32 pour un bras sensible, dès 35 sinon. Une variation de 1 kg', replace: 'dès 30 pour un bras sensible, dès 35 sinon. Une variation de 1 kg', needle: 'seuil :' },
        { name: 'plage citée fausse (24 à 26 au lieu de 24 à 25)', find: "'RCS 24 à 25', 'Alerte bras sensible : 32'", replace: "'RCS 24 à 26', 'Alerte bras sensible : 32'", needle: 'plage :' },
        { name: 'marge citée fausse (7 au lieu de 6)', find: "description: '6 points sous l\\'alerte bras sensible (32)'", replace: "description: '7 points sous l\\'alerte bras sensible (32)'", needle: 'marge :' },
        { name: 'exemple hors de son niveau', find: "string: '95 lb/in'", replace: "string: '250 lb/in'", needle: 'exemple :' },
        { name: 'levier faux (1 point au lieu de 0,5)', find: "déplace l\\'indice de 0,5 point", replace: "déplace l\\'indice de 1 point", needle: 'levier :' },
        { name: 'plage de zone fausse', find: "description: 'RCS 27 à 28. Sous", replace: "description: 'RCS 27 à 29. Sous", needle: 'plage :' },
        { name: 'plage de profil fausse', find: "description: 'Joueur de club (RCS 26 à 29)'", replace: "description: 'Joueur de club (RCS 26 à 30)'", needle: 'plage :' },
        { name: 'l\'alerte rouge ne dit plus le risque', find: '(risque de tennis elbow). Cette configuration', replace: '. Cette configuration', needle: 'alerte :' },
        { name: 'le verdict de profil ne dit plus le risque', find: ') : risque de tennis elbow', replace: ') : risque', needle: 'alerte :' },
        { name: 'le verdict du profil sensible (32-34) ne dit plus le risque', find: ') : risque de tennis elbow pour un bras sensible', replace: ') : risque pour un bras sensible', needle: 'alerte :' },
        { name: 'le verdict du profil sensible cite un seuil faux (30 au lieu de 32)', find: "Baissez la tension ou passez à un cordage plus souple sur les montants. Seuils d'alerte bras du configurateur : dès 32", replace: "Baissez la tension ou passez à un cordage plus souple sur les montants. Seuils d'alerte bras du configurateur : dès 30", needle: 'seuil :' },
        { name: 'le seuil « bras sensible » du moteur décalé à 31', find: 'HEALTH_ALERT_SENSITIVE_RCS: 32,', replace: 'HEALTH_ALERT_SENSITIVE_RCS: 31,', needle: 'alerte :' },
        { name: 'l\'alerte des profils sensibles supprimée', find: 'if (rec.armSensitive && rcs >= this.HEALTH_ALERT_SENSITIVE_RCS) {', replace: 'if (false) {', needle: 'alerte :' },
        { name: 'le conseil de consulter disparaît', find: "'Consultez un professionnel de santé en cas de douleur ou de gêne persistante'", replace: "'Reposez-vous'", needle: 'alerte :' },
      ],
    };
    // --- Témoins positifs : ce qui est légitime passe ----------------------------------------------------------
    const POSITIVES: Record<Lang, Array<{ name: string; find: string; replace: string }>> = {
      en: [
        { name: 'un libellé reformulé sans allégation', find: "label: 'Very Soft'", replace: "label: 'Very soft setup'" },
        { name: 'un conseil d\'alerte complété sans allégation', find: "'Stay well hydrated'", replace: "'Stay well hydrated and listen to your arm'" },
        { name: 'un conseil reformulé, mêmes chiffres', find: 'Arm alerts of the configurator: from 32', replace: 'Arm alert thresholds: from 32' },
        { name: 'un message d\'alerte qui dit « tennis elbow »', find: "summary: 'Lowest firmness index'", replace: "summary: 'Lowest index, far from the tennis elbow alerts'" },
      ],
      fr: [
        { name: 'un libellé reformulé sans allégation', find: "label: 'Très souple'", replace: "label: 'Montage très souple'" },
        { name: 'un conseil d\'alerte complété sans allégation', find: "'Hydratation importante'", replace: "'Hydratation importante et écoute du bras'" },
        { name: 'un conseil reformulé, mêmes chiffres', find: "Seuils d\\'alerte bras du configurateur : dès 32", replace: "Seuils d\\'alerte bras : dès 32" },
        { name: 'un message d\'alerte qui dit « tennis elbow »', find: "summary: 'Indice de fermeté le plus bas'", replace: "summary: 'Indice le plus bas, loin des alertes de tennis elbow'" },
      ],
    };
    const replaceFirst = (s: string, find: string, replace: string): string | null => {
      const i = s.indexOf(find);
      return i < 0 ? null : s.slice(0, i) + replace + s.slice(i + find.length);
    };
    let detected = 0;
    let accepted = 0;
    for (const { path: file, lang } of ENGINES) {
      const src = sources.get(file);
      if (src === undefined) continue;
      for (const m of NEGATIVES[lang]) {
        const mutated = replaceFirst(src, m.find, m.replace);
        if (mutated === null) {
          fail(`textes des moteurs : prémisse du test négatif « ${m.name} » fausse (${file} ne contient plus « ${clip(m.find)} »)`);
          continue;
        }
        if (analyse(mutated, lang, S, N).issues.some((i) => i.includes(m.needle))) detected++;
        else fail(`textes des moteurs : garde-fou muet sur « ${m.name} » (${file}, motif attendu « ${m.needle} »)`);
      }
      for (const p of POSITIVES[lang]) {
        const mutated = replaceFirst(src, p.find, p.replace);
        if (mutated === null) {
          fail(`textes des moteurs : prémisse du témoin positif « ${p.name} » fausse (${file} ne contient plus « ${clip(p.find)} »)`);
          continue;
        }
        const found = analyse(mutated, lang, S, N).issues;
        if (found.length > 0) fail(`textes des moteurs : témoin positif « ${p.name} » rejeté à tort (${file}) : ${found.join(' ; ')}`);
        else accepted++;
      }
      // L'avertissement légitime passe : le verdict de risque et l'alerte rouge, tels que le moteur les émet.
      const engine: any = new Function('window', 'document', `${src}; return RCS;`)({}, { addEventListener() {} });
      for (const text of [
        engine.evaluateForProfile(40, 'club').message,
        engine.getHealthWarning(40).message,
        engine.getHealthWarning(40).tips.join(' '),
        engine.evaluateForProfile(33, 'tennis_elbow').message,
        engine.evaluateForProfile(33, 'tennis_elbow').suggestion,
      ]) {
        if (claimsIn(text, lang).length > 0) fail(`textes des moteurs : l'avertissement légitime est rejeté à tort (${file}) : ${clip(text)}`);
        else accepted++;
      }
    }

    if (failures.length === before) {
      ok(
        `textes des moteurs statiques : ${scanned} sans allégation thérapeutique, médicale, protectrice ni de public médicalisé (6 familles dont les absolus de la charte F7, mise en garde « antécédents de blessure » limitée au message d'alerte) ; ` +
          `plages des 10 niveaux, des 5 zones et des 9 profils, marges, seuils cités (${S} bras sensible, ${N} sinon, sondés dans le moteur du configurateur), levier 1 kg = 0,5 point et ${examplesChecked} exemples de valeurs recalculés ; ` +
          `alertes : seuils du moteur = seuils sondés, risque de tennis elbow dit à chaque verdict, conseils conservés ; ${detected} tests négatifs détectés, ${accepted} témoins positifs acceptés`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 21. CONFIGURATEUR FR — le bras sensible se DÉCLARE (case facultative), sans rien enregistrer ni envoyer
//     (décision de l'orchestrateur du 11/10/2026, règle 2 ; suite de la PR #122)
// ---------------------------------------------------------------------------
// Constat : l'alerte bras « dès 32 pour un bras sensible, dès 35 sinon » (`advanced-rcs.ts`) était INATTEIGNABLE depuis le
// configurateur français : ni `configurator/page.tsx` ni `pdf-configuration-data.ts` ne passaient `profile` à `calculateAdvancedRcs`
// (`armSensitive` valait toujours false) et la page n'avait aucun champ pour le déclarer. Un visiteur ayant déjà eu mal au coude
// n'avait donc aucune alerte entre 32 et 34, alors que ce site la promet ; le configurateur anglais, lui, pose le profil
// `tennis_elbow` quand le visiteur déclare une douleur (contrôle 9). Ce bloc échoue si :
//   (a) un appel à `calculateAdvancedRcs` de la page ou du PDF ne passe pas `profile.armSensitive` ; si, dans la page, aucun appel ne
//       le relie à un état `useState(false)` que modifie une case à cocher nommée et décrite (un `armSensitive: false` en dur
//       passerait le premier test et laisserait l'alerte inatteignable) ; si le PDF ne le tire pas d'un paramètre de sa fonction ;
//   (b) le VRAI moteur, sur la grille du contrôle 5, n'alerte pas dès l'indice 32 pour `armSensitive: true`, alerte avant 35 pour
//       `false` autrement que par le second filet « confort » (seuils 55 et 45, inchangés), ne traite plus l'absence de profil comme
//       `false`, laisse la déclaration modifier autre chose que l'alerte, ou si le texte d'une alerte ne dit plus sa cause réelle
//       (indice au seuil, ou second filet « confort » sous le seuil), le seuil franchi, le profil appliqué, le risque de tennis elbow
//       comme raison du seuil, l'action en effet sur l'indice (points à perdre exacts) et le renvoi vers un professionnel de santé,
//       ou s'il promet un effet du matériel sur le bras (texte réécrit le 22/10/2026, charte F7 v1.2) ;
//   (c) la déclaration atteint la mesure ou un stockage : second argument de `trackArmWarningShown` différent de false ; événement GA4
//       piloté par un résultat qui dépend de la déclaration (un indice de 32 à 34 la révélerait par déduction) ; variable lue hors de
//       ses usages autorisés (profil du moteur, case à cocher, tableaux de dépendances) ; champ « bras » dans la charge utile ou dans
//       une configuration enregistrée ; localStorage, sessionStorage, cookie ou URL dans la page ;
//   (d) le texte d'aide cite d'autres seuils que ceux du moteur (sondés), ne renvoie plus vers un professionnel de santé, promet une
//       protection, ou ne dit plus que l'information n'est ni enregistrée ni envoyée ;
//   (e) (22/10/2026) la page recalcule un indice (`calculateRCS`) au lieu d'afficher celui du moteur, que l'alerte lit et cite ; le
//       palier, l'indice enregistré ou celui des événements GA4 lisent un autre nombre ; les bornes d'un hybride ne viennent pas du
//       moteur ou sa mention d'estimation n'est plus affichée ; un montage sans travers reçoit des bornes d'hybride.
// Chaque garde est rejouée sur des copies altérées de la page, du PDF, de l'enregistrement et du moteur ; des témoins positifs
// prouvent que les reformulations inoffensives passent. Le comportement réel (case, alerte, GA4, réseau, clavier) se vérifie en
// exécution, hors de ce script (Playwright, PR du 11/10/2026).
{
  const before21 = failures.length;
  const S21 = ARM_ALERT_SENSITIVE;
  const N21 = ARM_ALERT_STANDARD;
  const PAGE21 = 'src/app/configurator/page.tsx';
  const PDF21 = 'src/lib/pdf-configuration-data.ts';
  const STORAGE21 = 'src/lib/storage.ts';
  const ENGINE21 = 'src/lib/advanced-rcs.ts';
  // Fins de ligne normalisées : Windows (core.autocrlf) écrit des CRLF dans l'arbre de travail, le dépôt et Netlify des LF ; les
  // motifs multilignes des tests négatifs ci-dessous doivent valoir pour les deux.
  const readOr = (f: string): string => {
    try {
      return readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
    } catch {
      fail(`configurateur FR : ${f} introuvable`);
      return '';
    }
  };

  if (S21 === null || N21 === null) {
    fail("configurateur FR : seuils d'alerte bras introuvables dans calculateAdvancedRcs (sonde muette)");
  } else {
    const S = S21;
    const N = N21;
    const pageSrc = readOr(PAGE21);
    const pdfSrc = readOr(PDF21);
    const storageSrc = readOr(STORAGE21);
    const engineSrc = readOr(ENGINE21);

    // --- Outils d'analyse syntaxique ---------------------------------------------------------------------------------
    const parse = (file: string, src: string): ts.SourceFile =>
      ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const nameOf = (p: ts.ObjectLiteralElementLike): string | null =>
      p.name !== undefined && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null;
    const valueOf = (p: ts.ObjectLiteralElementLike): ts.Expression | null =>
      ts.isPropertyAssignment(p) ? p.initializer : ts.isShorthandPropertyAssignment(p) ? p.name : null;
    const idsIn = (node: ts.Node): Set<string> => {
      const out = new Set<string>();
      const walk = (n: ts.Node): void => {
        if (ts.isIdentifier(n)) out.add(n.text);
        ts.forEachChild(n, walk);
      };
      walk(node);
      return out;
    };
    const lineOf = (sf: ts.SourceFile, n: ts.Node): number => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
    const nums21 = (t: string): string[] => [...t.matchAll(/\d+(?:[.,]\d+)?/g)].map((m) => m[0].replace(',', '.'));
    const strValue = (e: ts.Expression | undefined): string | null => {
      if (!e) return null;
      if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
      if (ts.isParenthesizedExpression(e)) return strValue(e.expression);
      if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.PlusToken) {
        const l = strValue(e.left);
        const r = strValue(e.right);
        return l !== null && r !== null ? l + r : null;
      }
      return null;
    };
    const constText = (sf: ts.SourceFile, name: string): string | null => {
      let found: string | null = null;
      const walk = (n: ts.Node): void => {
        if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === name) found = strValue(n.initializer);
        ts.forEachChild(n, walk);
      };
      walk(sf);
      return found;
    };
    const interfaceMembers = (sf: ts.SourceFile, name: string): string[] => {
      const out: string[] = [];
      const walk = (n: ts.Node): void => {
        if (ts.isInterfaceDeclaration(n) && n.name.text === name) n.members.forEach((m) => m.name && out.push(m.name.getText(sf)));
        ts.forEachChild(n, walk);
      };
      walk(sf);
      return out;
    };

    type Call = {
      kind: 'absent' | 'sans-armSensitive' | 'false' | 'true' | 'dynamique';
      value: ts.Expression | null;
      text: string;
      owner: string | null;
      fn: ts.FunctionDeclaration | null;
      line: number;
    };
    // Les appels à `calculateAdvancedRcs` : ce que `profile.armSensitive` y vaut (absent, false, true, ou une expression).
    const advancedCalls = (sf: ts.SourceFile): Call[] => {
      const out: Call[] = [];
      const walk = (n: ts.Node, owner: string | null, fn: ts.FunctionDeclaration | null): void => {
        const o = ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) ? n.name.text : owner;
        const f = ts.isFunctionDeclaration(n) ? n : fn;
        if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'calculateAdvancedRcs') {
          let kind: Call['kind'] = 'absent';
          let value: ts.Expression | null = null;
          const arg = n.arguments[0];
          if (arg && ts.isObjectLiteralExpression(arg)) {
            const prof = arg.properties.find((p) => nameOf(p) === 'profile');
            if (prof) {
              kind = 'sans-armSensitive';
              const pv = valueOf(prof);
              if (pv && ts.isObjectLiteralExpression(pv)) {
                const flag = pv.properties.find((p) => nameOf(p) === 'armSensitive');
                value = flag ? valueOf(flag) : null;
                if (value) kind = value.kind === ts.SyntaxKind.FalseKeyword ? 'false' : value.kind === ts.SyntaxKind.TrueKeyword ? 'true' : 'dynamique';
              }
            }
          }
          out.push({ kind, value, text: value ? value.getText(sf) : '', owner: o, fn: f, line: lineOf(sf, n) });
        }
        ts.forEachChild(n, (c) => walk(c, o, f));
      };
      walk(sf, null, null);
      return out;
    };
    const stateVars = (sf: ts.SourceFile): Map<string, { setter: string; init: string }> => {
      const out = new Map<string, { setter: string; init: string }>();
      const walk = (n: ts.Node): void => {
        if (
          ts.isVariableDeclaration(n) &&
          ts.isArrayBindingPattern(n.name) &&
          n.initializer &&
          ts.isCallExpression(n.initializer) &&
          ts.isIdentifier(n.initializer.expression) &&
          n.initializer.expression.text === 'useState'
        ) {
          const [a, b] = n.name.elements;
          if (a && ts.isBindingElement(a) && ts.isIdentifier(a.name) && b && ts.isBindingElement(b) && ts.isIdentifier(b.name)) {
            out.set(a.name.text, { setter: b.name.text, init: n.initializer.arguments[0]?.getText(sf) ?? '' });
          }
        }
        ts.forEachChild(n, walk);
      };
      walk(sf);
      return out;
    };
    const openings = (sf: ts.SourceFile): ts.JsxOpeningLikeElement[] => {
      const out: ts.JsxOpeningLikeElement[] = [];
      const walk = (n: ts.Node): void => {
        if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) out.push(n);
        ts.forEachChild(n, walk);
      };
      walk(sf);
      return out;
    };
    const jsxAttr = (el: ts.JsxOpeningLikeElement, sf: ts.SourceFile, name: string): string | null => {
      for (const p of el.attributes.properties) {
        if (ts.isJsxAttribute(p) && p.name.getText(sf) === name) {
          const init = p.initializer;
          return !init ? '' : ts.isStringLiteral(init) ? init.text : ts.isJsxExpression(init) ? (init.expression?.getText(sf) ?? '') : '';
        }
      }
      return null;
    };
    // Le texte entier de l'élément JSX dont l'ouverture porte `attr="value"` (tout nom de balise).
    const elementTextWith = (sf: ts.SourceFile, tag: string | null, attr: string, value: string): string | null => {
      if (!value) return null;
      let found: string | null = null;
      const walk = (n: ts.Node): void => {
        if (ts.isJsxElement(n) && (tag === null || n.openingElement.tagName.getText(sf) === tag) && jsxAttr(n.openingElement, sf, attr) === value) found = n.getText(sf);
        ts.forEachChild(n, walk);
      };
      walk(sf);
      return found;
    };

    const CLAIM = /prot[eéè]g|pr[eé]ven|soulag|gu[eé]ri|therap|thérap|m[eé]dical|traitement|sans (?:aucun )?(?:danger|risque)|\bid[eé]al|parfait|optimal|\bsûr\b|garanti/i;
    const STORE_IDS = new Set(['localStorage', 'sessionStorage', 'indexedDB', 'sendBeacon', 'URLSearchParams', 'cookie', 'pushState', 'replaceState']);
    const BAD_MEMBER = /^(?:arm|bras|sensib|physical|douleur|pain|health)/i;

    // --- L'analyse : la page, le PDF, l'enregistrement --------------------------------------------------------------
    const analyse = (page: string, pdf: string, storage: string): string[] => {
      const issues: string[] = [];
      const sf = parse(PAGE21, page);
      const states = stateVars(sf);
      const calls = advancedCalls(sf);

      // (a) la page passe le profil, relié à une case à cocher
      if (calls.length === 0) issues.push('profil : aucun appel à calculateAdvancedRcs dans la page');
      for (const c of calls) {
        if (c.kind === 'absent' || c.kind === 'sans-armSensitive') {
          issues.push(`profil : l'appel de calculateAdvancedRcs de la page (${c.owner ?? '?'}, ligne ${c.line}) ne passe pas profile.armSensitive : l'alerte dès l'indice ${S} reste inatteignable depuis le configurateur`);
        }
      }
      const bound = calls.filter((c) => c.kind === 'dynamique' && states.has(c.text));
      if (bound.length === 0) issues.push("profil : aucun appel de calculateAdvancedRcs ne relie profile.armSensitive à un état de la page (useState) : aucun appel relié à la case, la déclaration ne changerait rien");
      const X = bound[0]?.text ?? '';
      const st = states.get(X);
      if (st && st.init !== 'false') issues.push(`profil : l'état « ${X} » démarre à ${st.init} au lieu de false : l'alerte « bras sensible » ne s'impose pas sans que le visiteur la déclare`);
      const shown = new Set(bound.map((c) => c.owner).filter((o): o is string => o !== null));
      const standardOwners = new Set(calls.filter((c) => c.kind === 'false').map((c) => c.owner).filter((o): o is string => o !== null));

      const boxes = openings(sf).filter((el) => el.tagName.getText(sf) === 'input' && jsxAttr(el, sf, 'type') === 'checkbox');
      const box = st ? boxes.find((el) => jsxAttr(el, sf, 'checked') === X && (jsxAttr(el, sf, 'onChange') ?? '').includes(`${st.setter}(`)) : undefined;
      if (X && !box) issues.push(`case : aucune case à cocher (input type="checkbox" checked={${X}} dont onChange appelle ${st?.setter ?? '…'}) : le visiteur ne peut pas déclarer le bras sensible`);
      if (box) {
        const id = jsxAttr(box, sf, 'id') ?? '';
        const by = jsxAttr(box, sf, 'aria-describedby') ?? '';
        if (!(elementTextWith(sf, 'label', 'htmlFor', id) ?? '').includes('ARM_SENSITIVE_LABEL')) issues.push(`accessibilité : la case n'a pas de libellé accessible (label htmlFor="${id}" affichant ARM_SENSITIVE_LABEL)`);
        if (!(elementTextWith(sf, null, 'id', by) ?? '').includes('ARM_SENSITIVE_HELP')) issues.push(`accessibilité : l'aide n'est pas liée à la case (aria-describedby="${by}" vers un élément affichant ARM_SENSITIVE_HELP)`);
      }

      // (c) la mesure : GA4 ne reçoit jamais la déclaration, ni directement ni par déduction
      let gaCalls = 0;
      const walkGa = (n: ts.Node): void => {
        if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'trackArmWarningShown') {
          gaCalls++;
          const second = n.arguments[1];
          if (!second || second.kind !== ts.SyntaxKind.FalseKeyword) issues.push(`GA4 : trackArmWarningShown reçoit « ${second ? second.getText(sf) : 'rien'} » comme second argument (ligne ${lineOf(sf, n)}) : attendu false, la déclaration ne part jamais à GA4`);
          let fnNode: ts.Node | undefined = n.parent;
          while (fnNode && !(ts.isArrowFunction(fnNode) || ts.isFunctionExpression(fnNode) || ts.isFunctionDeclaration(fnNode))) fnNode = fnNode.parent;
          if (fnNode) {
            const ids = idsIn(fnNode);
            const hook = fnNode.parent;
            if (hook && ts.isCallExpression(hook) && hook.arguments[0] === fnNode && hook.arguments[1]) idsIn(hook.arguments[1]).forEach((i) => ids.add(i));
            const tainted = [...ids].filter((i) => shown.has(i) || (X !== '' && i === X) || i === st?.setter);
            if (tainted.length > 0) issues.push(`GA4 : l'événement arm_warning_shown (ligne ${lineOf(sf, n)}) suit « ${tainted.join(', ')} », qui dépend de la déclaration : un indice de ${S} à ${N - 1} la révélerait par déduction (suivre le résultat du profil standard)`);
            else if (![...ids].some((i) => standardOwners.has(i))) issues.push(`GA4 : l'événement arm_warning_shown (ligne ${lineOf(sf, n)}) n'est piloté par aucun résultat calculé sans la déclaration (profile.armSensitive: false en dur)`);
          }
        }
        ts.forEachChild(n, walkGa);
      };
      walkGa(sf);
      if (gaCalls === 0) issues.push("GA4 : la page n'appelle plus trackArmWarningShown (la mesure des alertes affichées serait muette)");

      // (c) usages autorisés de la variable d'état et de son setter
      if (X && st) {
        const setter = st.setter;
        const allowed = (id: ts.Identifier): boolean => {
          const p = id.parent;
          if (ts.isArrayLiteralExpression(p) && ts.isCallExpression(p.parent) && ts.isIdentifier(p.parent.expression) && /^use(?:Memo|Effect|Callback)$/.test(p.parent.expression.text) && p.parent.arguments[1] === p) return true;
          if ((ts.isShorthandPropertyAssignment(p) || (ts.isPropertyAssignment(p) && p.initializer === id)) && nameOf(p) === 'armSensitive') {
            const obj = p.parent;
            const prof = obj.parent;
            if (ts.isObjectLiteralExpression(obj) && prof && ts.isPropertyAssignment(prof) && nameOf(prof) === 'profile') {
              const arg = prof.parent;
              const call = arg?.parent;
              if (arg && ts.isObjectLiteralExpression(arg) && call && ts.isCallExpression(call) && ts.isIdentifier(call.expression) && call.expression.text === 'calculateAdvancedRcs') return true;
            }
          }
          let n: ts.Node | undefined = id;
          while (n && !ts.isJsxAttribute(n) && !ts.isSourceFile(n)) n = n.parent;
          if (n && ts.isJsxAttribute(n)) {
            const el = n.parent.parent;
            if ((ts.isJsxSelfClosingElement(el) || ts.isJsxOpeningElement(el)) && el.tagName.getText(sf) === 'input' && jsxAttr(el, sf, 'type') === 'checkbox') {
              const attr = n.name.getText(sf);
              if (attr === 'checked' && id.text === X) return true;
              if (attr === 'onChange' && id.text === setter) return true;
            }
          }
          return false;
        };
        // Un nom de propriété ou d'attribut (`armSensitive:` dans un profil, `x.armSensitive`) n'est pas une lecture de la variable.
        const isNameOnly = (id: ts.Identifier): boolean =>
          (ts.isBindingElement(id.parent) && id.parent.name === id) ||
          (ts.isPropertyAssignment(id.parent) && id.parent.name === id) ||
          (ts.isPropertyAccessExpression(id.parent) && id.parent.name === id) ||
          (ts.isJsxAttribute(id.parent) && id.parent.name === id);
        const walkUse = (n: ts.Node): void => {
          if (ts.isIdentifier(n) && (n.text === X || n.text === setter) && !isNameOnly(n) && !allowed(n)) {
            issues.push(`déclaration : « ${n.text} » utilisé hors de ses usages autorisés (ligne ${lineOf(sf, n)} : ${n.parent.getText(sf).replace(/\s+/g, ' ').slice(0, 70)}) : seuls le profil du moteur, la case à cocher et les tableaux de dépendances peuvent le lire`);
          }
          ts.forEachChild(n, walkUse);
        };
        walkUse(sf);
      }
      const walkStore = (n: ts.Node): void => {
        if (ts.isIdentifier(n) && STORE_IDS.has(n.text)) issues.push(`stockage : « ${n.text} » dans la page (ligne ${lineOf(sf, n)}) : la déclaration ne doit être ni stockée, ni passée dans l'URL ou un cookie`);
        if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === 'payload' && n.initializer && ts.isObjectLiteralExpression(n.initializer)) {
          for (const p of n.initializer.properties) {
            const key = nameOf(p) ?? '';
            if (BAD_MEMBER.test(key)) issues.push(`enregistrement : la charge utile enregistrée porte « ${key} » (ligne ${lineOf(sf, p)}) : la déclaration ne s'enregistre pas`);
          }
        }
        ts.forEachChild(n, walkStore);
      };
      walkStore(sf);
      for (const [file, src, name] of [[STORAGE21, storage, 'SavedConfiguration'], [PDF21, pdf, 'StoredConfiguration']] as const) {
        for (const m of interfaceMembers(parse(file, src), name)) if (BAD_MEMBER.test(m)) issues.push(`enregistrement : ${name} (${file}) gagne le champ « ${m} » : la déclaration ne s'enregistre pas`);
      }

      // (a) le PDF tire le profil d'un paramètre de sa fonction
      const pf = parse(PDF21, pdf);
      const pcalls = advancedCalls(pf);
      if (pcalls.length === 0) issues.push('profil : aucun appel à calculateAdvancedRcs dans le PDF');
      for (const c of pcalls) {
        if (c.kind === 'absent' || c.kind === 'sans-armSensitive') {
          issues.push(`profil : l'appel de calculateAdvancedRcs du PDF (ligne ${c.line}) ne passe pas profile.armSensitive : le PDF ne peut pas refléter la déclaration`);
        } else if (c.kind !== 'dynamique') {
          issues.push(`profil : le PDF passe armSensitive : ${c.text} en dur (ligne ${c.line}) : il doit le tirer d'un paramètre de sa fonction pour refléter la déclaration de l'appelant`);
        } else {
          const params = new Set<string>();
          c.fn?.parameters.forEach((p) => idsIn(p.name).forEach((i) => params.add(i)));
          if (!c.value || ![...idsIn(c.value)].some((i) => params.has(i))) issues.push(`profil : profile.armSensitive du PDF (« ${c.text} ») ne vient d'aucun paramètre de ${c.fn?.name?.text ?? 'sa fonction'}`);
        }
      }

      // (d) le texte d'aide
      const label = constText(sf, 'ARM_SENSITIVE_LABEL');
      const help = constText(sf, 'ARM_SENSITIVE_HELP');
      if (label === null || help === null) issues.push('texte : ARM_SENSITIVE_LABEL ou ARM_SENSITIVE_HELP introuvable dans la page');
      else {
        const got = nums21(help);
        const want = [String(S), String(N)];
        if (got.length !== want.length || got.some((x, i) => x !== want[i])) issues.push(`seuil : le texte d'aide cite ${got.join(', ') || 'aucun chiffre'} au lieu de ${want.join(', ')} (seuils du moteur, sondés dans calculateAdvancedRcs)`);
        if (!/professionnel de santé/i.test(help)) issues.push("texte : l'aide ne renvoie plus vers un professionnel de santé si la douleur persiste (charte F7)");
        if (!/ni enregistrée ni envoyée/i.test(help)) issues.push("texte : l'aide ne dit plus que l'information n'est ni enregistrée ni envoyée (promesse tenue par les contrôles (c) et en exécution)");
        for (const t of [label, help]) {
          const m = CLAIM.exec(t);
          if (m) issues.push(`allégation : « ${m[0]} » dans « ${t.slice(0, 70)} » (charte F7 : aucun absolu, aucune allégation médicale ou protectrice)`);
        }
        if (!/bras/i.test(label) || !/coude/i.test(label) || !/épaule/i.test(label)) issues.push("libellé : le libellé ne nomme plus le bras, le coude et l'épaule");
      }

      // (e) l'indice affiché est celui du moteur, que l'alerte lit et cite (22/10/2026) : aucun second calcul dans la page ; le palier,
      //     l'indice enregistré et celui des événements GA4 lisent ce même entier ; la mention d'estimation d'un hybride est affichée.
      const seen = { ret: null as ts.ObjectLiteralExpression | null, engine: new Map<string, string>(), calcRcs: [] as number[], note: false, payloadRcs: '', ga: [] as string[] };
      const walkIdx = (n: ts.Node): void => {
        if (ts.isCallExpression(n) && ts.isIdentifier(n.expression)) {
          if (n.expression.text === 'calculateRCS') seen.calcRcs.push(lineOf(sf, n));
          if (n.expression.text === 'trackConfiguratorResultView' || n.expression.text === 'trackConfiguratorComplete') seen.ga.push(`${n.expression.text}(${n.arguments[0]?.getText(sf) ?? ''})`);
        }
        // Propriétés du résultat du moteur (profil standard) déstructurées dans la page : nom de la propriété -> nom local.
        if (ts.isVariableDeclaration(n) && n.initializer?.getText(sf) === 'standardAdvancedRcs' && ts.isObjectBindingPattern(n.name)) {
          for (const el of n.name.elements) if (ts.isIdentifier(el.name)) seen.engine.set(el.propertyName ? el.propertyName.getText(sf) : el.name.text, el.name.text);
        }
        if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === 'rcsData' && n.initializer) {
          const w = (m: ts.Node): void => {
            if (ts.isReturnStatement(m) && m.expression && ts.isObjectLiteralExpression(m.expression)) seen.ret = m.expression;
            ts.forEachChild(m, w);
          };
          w(n.initializer);
        }
        if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === 'payload' && n.initializer && ts.isObjectLiteralExpression(n.initializer)) {
          const p = n.initializer.properties.find((q) => nameOf(q) === 'rcsScore');
          const v = p ? valueOf(p) : null;
          seen.payloadRcs = v ? v.getText(sf) : '';
        }
        if (ts.isJsxExpression(n) && n.expression?.getText(sf) === 'rcsData.hybrid.note') seen.note = true;
        ts.forEachChild(n, walkIdx);
      };
      walkIdx(sf);
      for (const l of seen.calcRcs) issues.push(`indice : la page recalcule un indice (calculateRCS, ligne ${l}) au lieu d'afficher celui du moteur, que l'alerte lit et cite`);
      const ret = seen.ret;
      const prop = (name: string): string => {
        const p = ret?.properties.find((q) => nameOf(q) === name);
        const v = p ? valueOf(p) : null;
        return v ? v.getText(sf) : '';
      };
      const engRcs = seen.engine.get('rcs');
      const engHybrid = seen.engine.get('hybrid');
      if (!ret) issues.push("indice : rcsData ne renvoie plus d'objet lisible (indice, palier, bornes)");
      else {
        if (!engRcs || prop('rcs') !== engRcs) issues.push(`indice : l'indice affiché (rcsData.rcs = « ${prop('rcs') || 'absent'} ») ne vient pas du moteur (standardAdvancedRcs.rcs)`);
        if (!engRcs || prop('recommendation') !== `getStringRecommendation(${engRcs})`) issues.push(`palier : le palier affiché lit « ${prop('recommendation') || 'absent'} » au lieu de l'indice du moteur : palier et seuil d'alerte doivent lire le même entier`);
        if (!engHybrid || prop('hybrid') !== engHybrid) issues.push(`hybride : les bornes affichées (rcsData.hybrid = « ${prop('hybrid') || 'absent'} ») ne viennent pas du moteur`);
      }
      if (!seen.note) issues.push("hybride : la mention d'estimation du moteur ({rcsData.hybrid.note}) n'est plus affichée : l'indice d'un hybride serait présenté sans dire que c'est une estimation");
      if (seen.payloadRcs !== 'rcsData.rcs') issues.push(`indice : l'indice enregistré (rcsScore: ${seen.payloadRcs || 'absent'}) n'est pas l'indice affiché (rcsData.rcs)`);
      if (seen.ga.length !== 2 || seen.ga.some((g) => !g.endsWith('(rcsData.rcs)'))) issues.push(`GA4 : configurator_result_view et configurator_complete doivent envoyer l'indice affiché (rcsData.rcs) : ${seen.ga.join(', ') || 'aucun appel'}`);
      return [...new Set(issues)];
    };

    const realIssues = analyse(pageSrc, pdfSrc, storageSrc);
    realIssues.forEach((i) => fail(`configurateur FR : ${i}`));

    // Aucun autre appelant de `trackArmWarningShown` dans src/ ne peut lui passer autre chose que false.
    const srcFiles: string[] = [];
    const listSrc = (d: string): void => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) listSrc(p);
        else if (/\.(?:ts|tsx)$/.test(e.name)) srcFiles.push(p);
      }
    };
    listSrc('src');
    let gaCallers = 0;
    for (const f of srcFiles) {
      const text = readFileSync(f, 'utf8');
      if (!text.includes('trackArmWarningShown(')) continue;
      const sf = parse(f, text);
      const walk = (n: ts.Node): void => {
        if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'trackArmWarningShown') {
          gaCallers++;
          if (n.arguments[1]?.kind !== ts.SyntaxKind.FalseKeyword) fail(`configurateur FR : GA4 : ${f}:${lineOf(sf, n)} appelle trackArmWarningShown sans false en second argument`);
        }
        ts.forEachChild(n, walk);
      };
      walk(sf);
    }

    // --- (b) le VRAI moteur, sur la grille réelle -------------------------------------------------------------------
    type Calc = typeof calculateAdvancedRcs;
    const COMFORT_NET = { sensitive: 55, standard: 45 }; // second filet « confort » de calculateAdvancedRcs (advanced-rcs.ts, 11/10/2026)
    // Textes de l'alerte (22/10/2026, charte F7 v1.2) : la cause réelle (indice au seuil ou au-delà / second filet « confort »
    // sous le seuil), le seuil franchi, le profil appliqué, le risque nommé comme raison du seuil, l'action en effet sur l'indice,
    // le renvoi vers un professionnel de santé. Chaque nombre cité est relu contre le résultat du moteur et les seuils sondés.
    const INDEX_TEXT = /^Alerte bras : indice (\d+), seuil d'alerte de (\d+) (atteint|dépassé) \((bras sensible déclaré|profil standard)\), seuil fixé par le site pour le risque de tennis elbow\. Il faut (\d+) (points?) d'indice de moins pour repasser sous (\d+) : 1 kg de tension en moins retire 0,5 point, un cordage moins rigide aux montants( \(un multifilament ou un boyau, par exemple\))? l'abaisse aussi\. Douleur persistante : consultez un professionnel de santé\.$/;
    const COMFORT_TEXT = /^Alerte bras : note de confort calculée du montage sous (\d+) sur 100( avant arrondi, affichée (\d+))? \((bras sensible déclaré|profil standard)\), second seuil d'alerte fixé par le site pour le risque de tennis elbow ; elle part de la note de confort de l'équipe, non mesurée, et l'indice \((\d+)\) reste sous le seuil de (\d+)\. Une tension plus basse ou un cordage mieux noté en confort relève cette note\. Douleur persistante : consultez un professionnel de santé\.$/;
    // Une alerte ne promet jamais un effet du matériel sur le bras (charte F7) : « limiter / réduire / éviter le risque », protéger…
    const ALERT_PROMISE = /limit|rédui|diminu|évit|prot[eéè]g|préserv|ménag|soulag|prévien|prévent/i;
    // Relit une alerte bras du moteur : forme, cause, seuil, profil, points à perdre, incise réservée au montant polyester, mention
    // de l'arrondi quand la note de confort AFFICHÉE (arrondie, `subScores.comfort`) vaut la limite citée ; renvoie le défaut ou null.
    const readAlert = (w: string, profileSensitive: boolean, rcs: number, shownComfort: number | null, polyMains: boolean): string | null => {
      const T = profileSensitive ? S : N;
      const label = profileSensitive ? 'bras sensible déclaré' : 'profil standard';
      const who = profileSensitive ? '« bras sensible »' : 'standard';
      if (ALERT_PROMISE.test(w)) return `texte : l'alerte ${who} promet un effet sur le bras : « ${w.slice(0, 90)} »`;
      if (rcs >= T) {
        const m = INDEX_TEXT.exec(w);
        if (!m) return `texte : l'alerte ${who} (indice au seuil) n'a plus sa forme (indice, seuil, profil, risque nommé, action sur l'indice, renvoi) : « ${w.slice(0, 90)} »`;
        const [, idx, seuil, verb, prof, pts, word, sous, incise] = m;
        const want = rcs - T + 1;
        if (!!incise !== polyMains) return `texte : l'alerte ${who} ${incise ? 'propose' : 'ne propose plus'} « un multifilament ou un boyau » pour un montant ${polyMains ? 'polyester' : 'non polyester'} : « ${w.slice(0, 90)} »`;
        if (Number(idx) !== rcs || Number(seuil) !== T || Number(sous) !== T || prof !== label || verb !== (rcs > T ? 'dépassé' : 'atteint') || Number(pts) !== want || word !== (want > 1 ? 'points' : 'point')) {
          return `texte : l'alerte ${who} cite indice ${idx}, seuil ${seuil}/${sous}, « ${verb} », « ${prof} », ${pts} ${word} au lieu de indice ${rcs}, seuil ${T}, ${want} point(s), « ${label} »`;
        }
        return null;
      }
      const m = COMFORT_TEXT.exec(w);
      if (!m) return `texte : l'alerte ${who} du second filet (indice ${rcs} sous ${T}) n'a plus sa forme (cause, seuil, profil, risque nommé, renvoi) : « ${w.slice(0, 90)} »`;
      const [, limite, arrondi, affichee, prof, idx, seuil] = m;
      const wantLimit = profileSensitive ? COMFORT_NET.sensitive : COMFORT_NET.standard;
      const atLimit = shownComfort !== null && shownComfort >= wantLimit;
      if (!!arrondi !== atLimit || (arrondi !== undefined && Number(affichee) !== shownComfort)) {
        return `texte : l'alerte ${who} du second filet ${arrondi ? `dit « affichée ${affichee} »` : "ne dit pas l'arrondi"} alors que la note affichée vaut ${shownComfort} (limite ${wantLimit}) : « ${w.slice(0, 90)} »`;
      }
      if (Number(limite) !== wantLimit || prof !== label || Number(idx) !== rcs || Number(seuil) !== T) {
        return `texte : l'alerte ${who} du second filet cite note < ${limite}, « ${prof} », indice ${idx}, seuil ${seuil} au lieu de note < ${wantLimit}, « ${label} », indice ${rcs}, seuil ${T}`;
      }
      return null;
    };
    // La note de confort du résultat est arrondie : exactement à la limite, on ne tranche pas.
    const net = (c: number | null, limit: number): 'oui' | 'non' | 'incertain' => (c === null || c > limit ? 'non' : c < limit ? 'oui' : 'incertain');
    const checkEngine = (calc: Calc, stride: number, withBand: boolean) => {
      const issues = new Set<string>();
      const band = new Map<number, { n: number; std: number; sen: number; only: number }>();
      for (let k = S; k < N; k++) band.set(k, { n: 0, std: 0, sen: 0, only: 0 });
      let n = 0;
      let stdAlerts = 0;
      let senAlerts = 0;
      let seen = 0;
      const arm = (w: string[]) => w.filter((x) => /bras|elbow/i.test(x));
      for (const r of racquetsDatabase) {
        const ra = effectiveRacquetRA(r);
        for (const s of stringsDatabase) {
          const fam = stringTypeToFamily(s.type);
          for (const t of TENSIONS) {
            if (seen++ % stride !== 0) continue;
            const base = {
              racquetStiffness: ra,
              racquetWeight: r.weight,
              racquetHeadSize: r.headSize,
              mainStringStiffness: s.stiffness,
              mainStringFamily: fam,
              mainRatings: { control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability },
              mainTension: t,
            };
            const none = calc(base);
            const std = calc({ ...base, profile: { armSensitive: false } });
            const sen = calc({ ...base, profile: { armSensitive: true } });
            if (std.hybrid) issues.add("hybride : un montage sans travers reçoit des bornes d'hybride (hybrid doit valoir null)");
            const [aNone, aStd, aSen] = [arm(none.warnings), arm(std.warnings), arm(sen.warnings)];
            n++;
            if (aStd.length > 0) stdAlerts++;
            if (aSen.length > 0) senAlerts++;
            if (none.rcs !== std.rcs || JSON.stringify(aNone) !== JSON.stringify(aStd)) issues.add("défaut : sans profil, le moteur ne se comporte plus comme armSensitive: false");
            if (sen.rcs !== std.rcs || sen.overall !== std.overall || JSON.stringify(sen.subScores) !== JSON.stringify(std.subScores)) issues.add("profil : la déclaration change l'indice ou les sous-scores (elle ne doit changer que l'alerte)");
            const c = std.subScores.comfort;
            const where = `indice ${std.rcs}, confort ${c ?? '—'}, ${r.id} + ${s.id} à ${t} kg`;
            const expSen = std.rcs >= S ? 'oui' : net(c, COMFORT_NET.sensitive);
            const expStd = std.rcs >= N ? 'oui' : net(c, COMFORT_NET.standard);
            if (expSen !== 'incertain' && aSen.length > 0 !== (expSen === 'oui')) issues.add(`sensible : ${aSen.length > 0 ? 'alerte à tort' : 'alerte manquante'} (${where} ; attendu dès l'indice ${S}, second filet confort < ${COMFORT_NET.sensitive})`);
            if (expStd !== 'incertain' && aStd.length > 0 !== (expStd === 'oui')) issues.add(`standard : ${aStd.length > 0 ? 'alerte à tort' : 'alerte manquante'} (${where} ; attendu dès l'indice ${N}, second filet confort < ${COMFORT_NET.standard})`);
            if (aSen.length > 1 || aStd.length > 1) issues.add("texte : plus d'une alerte bras pour un même montage");
            for (const w of aSen) {
              const bad = readAlert(w, true, sen.rcs, sen.subScores.comfort, fam === 'polyester');
              if (bad) issues.add(bad);
            }
            for (const w of aStd) {
              const bad = readAlert(w, false, std.rcs, std.subScores.comfort, fam === 'polyester');
              if (bad) issues.add(bad);
            }
            const b = band.get(std.rcs);
            if (b) {
              b.n++;
              if (aStd.length > 0) b.std++;
              if (aSen.length > 0) b.sen++;
              if (aSen.length > 0 && aStd.length === 0) b.only++;
            }
          }
        }
      }
      if (withBand) {
        for (const [idx, b] of band) {
          if (b.n === 0) issues.add(`bande : aucun montage de la grille n'atteint l'indice ${idx}`);
          else if (b.only === 0) issues.add(`bande : à l'indice ${idx}, la déclaration ne déclenche aucune alerte que le profil standard n'émet pas`);
        }
      }
      return { issues: [...issues], n, stdAlerts, senAlerts, band };
    };

    const real = checkEngine(calculateAdvancedRcs, 1, true);
    real.issues.forEach((i) => fail(`configurateur FR : moteur : ${i}`));

    // Le moteur est rechargé depuis son source pour les tests négatifs : la copie fidèle doit d'abord passer.
    const stringsModule = await import('../src/data/strings-database');
    const loadEngine = (src: string): Calc => {
      const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
      const mod: { exports: Record<string, unknown> } = { exports: {} };
      new Function('exports', 'require', 'module', js)(
        mod.exports,
        (id: string) => {
          if (id === '@/data/strings-database') return stringsModule;
          throw new Error(`require inattendu : ${id}`);
        },
        mod
      );
      return mod.exports.calculateAdvancedRcs as Calc;
    };
    const STRIDE = 5;
    let engineOk = true;
    try {
      const copy = checkEngine(loadEngine(engineSrc), STRIDE, true);
      if (copy.issues.length > 0) {
        engineOk = false;
        fail(`configurateur FR : le moteur rechargé depuis son source (instrument des tests négatifs) ne passe pas son propre contrôle : ${copy.issues.join(' ; ')}`);
      }
    } catch (e) {
      engineOk = false;
      fail(`configurateur FR : moteur illisible pour les tests négatifs (${(e as Error).message})`);
    }

    // --- Tests négatifs et témoins positifs --------------------------------------------------------------------------
    const replaceFirst = (s: string, find: string, replace: string): string | null => {
      const i = s.indexOf(find);
      return i < 0 ? null : s.slice(0, i) + replace + s.slice(i + find.length);
    };
    const replaceAll = (s: string, find: string, replace: string): string | null => (s.includes(find) ? s.split(find).join(replace) : null);
    let detected = 0;
    let accepted = 0;
    type Mut = { name: string; needle: string; apply: (s: string) => string | null };
    const edit = (name: string, needle: string, find: string, replace: string): Mut => ({ name, needle, apply: (s) => replaceFirst(s, find, replace) });

    const HELP_32_35 = "Active l'alerte bras dès l'indice 32 au lieu de 35.";
    const STATE = 'const [armSensitive, setArmSensitive] = useState(false);';
    const CALL_SHOWN = 'calculateAdvancedRcs({ ...advancedInput, profile: { armSensitive } })';
    const GA_CALL = 'trackArmWarningShown(standardAdvancedRcs.rcs, false)';
    const ENGINE_IDX = '    const { rcs, hybrid } = standardAdvancedRcs;\n';
    const PAGE_NEGATIVES: Mut[] = [
      edit('profil retiré de l\'appel affiché', 'profil : l\'appel de calculateAdvancedRcs de la page', CALL_SHOWN, 'calculateAdvancedRcs({ ...advancedInput })'),
      edit('armSensitive: false en dur dans l\'appel affiché', 'aucun appel relié à la case', CALL_SHOWN, 'calculateAdvancedRcs({ ...advancedInput, profile: { armSensitive: false } })'),
      edit('case à cocher retirée (type="text")', 'case : aucune case à cocher', 'type="checkbox"', 'type="text"'),
      edit('la case ne modifie plus l\'état', 'case : aucune case à cocher', 'onChange={(e) => setArmSensitive(e.target.checked)}', 'onChange={() => undefined}'),
      edit('état initial vrai', 'démarre à true', STATE, 'const [armSensitive, setArmSensitive] = useState(true);'),
      edit('libellé non lié à la case', 'pas de libellé accessible', 'htmlFor="arm-sensitive"', 'htmlFor="autre-champ"'),
      edit('aide non liée à la case', 'l\'aide n\'est pas liée', 'aria-describedby="arm-sensitive-help"', 'aria-describedby="autre-aide"'),
      edit('drapeau envoyé à GA4 (variable d\'état)', 'GA4 : trackArmWarningShown reçoit', GA_CALL, 'trackArmWarningShown(standardAdvancedRcs.rcs, armSensitive)'),
      edit('drapeau true en dur envoyé à GA4', 'GA4 : trackArmWarningShown reçoit', GA_CALL, 'trackArmWarningShown(standardAdvancedRcs.rcs, true)'),
      {
        name: "événement GA4 piloté par l'alerte affichée (retour à l'ancien code)",
        needle: 'qui dépend de la déclaration',
        apply: (s) => {
          let out = replaceFirst(s, 'if (!standardAdvancedRcs || standardAdvancedRcs.warnings.length === 0) return;', 'if (!advancedRcs || advancedRcs.warnings.length === 0) return;');
          out = out && replaceFirst(out, GA_CALL, 'trackArmWarningShown(advancedRcs.rcs, false)');
          return out && replaceFirst(out, '[standardAdvancedRcs, formData.racquet', '[advancedRcs, formData.racquet');
        },
      },
      edit('événement GA4 supprimé', 'la page n\'appelle plus trackArmWarningShown', GA_CALL, 'void 0'),
      edit('drapeau ajouté à la charge utile enregistrée', 'enregistrement : la charge utile enregistrée porte', 'rcsScore: rcsData.rcs,', 'rcsScore: rcsData.rcs,\n      armSensitive,'),
      edit('drapeau écrit dans localStorage', 'stockage : « localStorage »', STATE, `${STATE}\n  useEffect(() => { window.localStorage.setItem('arm', String(armSensitive)); }, [armSensitive]);`),
      edit('drapeau dans l\'URL', 'stockage : « replaceState »', STATE, `${STATE}\n  useEffect(() => { window.history.replaceState(null, '', '?arm=' + String(armSensitive)); }, [armSensitive]);`),
      edit('drapeau lu hors des usages autorisés', 'utilisé hors de ses usages autorisés', STATE, `${STATE}\n  const leak = armSensitive ? 'oui' : 'non';\n  void leak;`),
      edit('texte d\'aide : seuil faux (30)', 'seuil : le texte d\'aide cite', HELP_32_35, "Active l'alerte bras dès l'indice 30 au lieu de 35."),
      edit('texte d\'aide : seuil standard faux (36)', 'seuil : le texte d\'aide cite', HELP_32_35, "Active l'alerte bras dès l'indice 32 au lieu de 36."),
      edit('texte d\'aide : conseil de santé retiré', 'professionnel de santé', ' Douleur persistante : consultez un professionnel de santé.', ''),
      edit('texte d\'aide : promesse de protection', 'allégation', "Active l'alerte bras", "Protège votre bras : active l'alerte bras"),
      edit('texte d\'aide : « ni enregistrée ni envoyée » retiré', 'ni enregistrée ni envoyée', " Cette information n'est ni enregistrée ni envoyée.", ''),
      edit('libellé : le coude n\'est plus nommé', 'libellé : le libellé ne nomme plus', 'ARM_SENSITIVE_LABEL = "Bras sensible ou douleur au coude / à l\'épaule";', 'ARM_SENSITIVE_LABEL = "Bras sensible ou douleur à l\'épaule";'),
      // (e) l'indice du moteur est affiché, sans second calcul (22/10/2026)
      edit('second calcul de l\'indice réintroduit (« RCS Moyen » de la page)', 'la page recalcule un indice', ENGINE_IDX, "    const { hybrid } = standardAdvancedRcs;\n    const rcs = (calculateRCS(effectiveRacquetRA(selectedRacquet), selectedMainString.stiffness, (formData.mainTension + formData.crossTension) / 2) + standardAdvancedRcs.rcs) / 2;\n"),
      edit('palier lu sur un autre nombre que l\'indice affiché', 'palier : le palier affiché lit', 'recommendation: getStringRecommendation(rcs),', 'recommendation: getStringRecommendation(rcs - 0.5),'),
      edit('bornes de l\'hybride hors du moteur', 'hybride : les bornes affichées', 'rcs,\n      hybrid,\n      recommendation', 'rcs,\n      hybrid: null,\n      recommendation'),
      edit('mention d\'estimation de l\'hybride retirée', 'la mention d\'estimation du moteur', '{rcsData.hybrid.note}', '{null}'),
      edit('indice enregistré différent de l\'indice affiché', 'l\'indice enregistré', 'rcsScore: rcsData.rcs,', 'rcsScore: Math.round(rcsData.compatibility),'),
      edit('GA4 : configurator_result_view envoie un autre nombre', 'GA4 : configurator_result_view et configurator_complete', 'trackConfiguratorResultView(rcsData.rcs);', 'trackConfiguratorResultView(rcsData.compatibility);'),
    ];
    const PAGE_POSITIVES: Mut[] = [
      edit('libellé reformulé', '', 'ARM_SENSITIVE_LABEL = "Bras sensible ou douleur au coude / à l\'épaule";', 'ARM_SENSITIVE_LABEL = "Bras sensible, douleur au coude ou à l\'épaule";'),
      edit('aide reformulée, mêmes chiffres et mêmes engagements', '', HELP_32_35, "Alerte bras dès l'indice 32 pour vous, au lieu de 35 sinon."),
      edit('commentaire qui nomme localStorage et GA4', '', '// Déclaration du visiteur (bras sensible).', '// Déclaration du visiteur (bras sensible) : jamais de localStorage, de cookie ni de GA4.'),
      edit('état renommé dans le commentaire seulement', '', 'Elle ne sert qu\'au profil passé au moteur plus bas.', 'Elle ne sert qu\'au profil passé au moteur (armSensitive).'),
      edit('palier commenté, même entier que l\'alerte', '', 'recommendation: getStringRecommendation(rcs),', 'recommendation: getStringRecommendation(rcs), // même entier que le seuil d\'alerte'),
    ];
    for (const m of PAGE_NEGATIVES) {
      const mutated = m.apply(pageSrc);
      if (mutated === null) {
        fail(`configurateur FR : prémisse du test négatif « ${m.name} » fausse (motif absent de ${PAGE21})`);
        continue;
      }
      if (analyse(mutated, pdfSrc, storageSrc).some((i) => i.includes(m.needle))) detected++;
      else fail(`configurateur FR : garde-fou muet sur « ${m.name} » (motif attendu « ${m.needle} »)`);
    }
    for (const m of PAGE_POSITIVES) {
      const mutated = m.apply(pageSrc);
      if (mutated === null) {
        fail(`configurateur FR : prémisse du témoin positif « ${m.name} » fausse (motif absent de ${PAGE21})`);
        continue;
      }
      const found = analyse(mutated, pdfSrc, storageSrc);
      if (found.length > 0) fail(`configurateur FR : témoin positif « ${m.name} » rejeté à tort : ${found.join(' ; ')}`);
      else accepted++;
    }
    const PDF_NEGATIVES: Mut[] = [
      edit('profil retiré de l\'appel du PDF', 'profil : l\'appel de calculateAdvancedRcs du PDF', '      profile: { armSensitive: options.armSensitive === true },\n', ''),
      edit('armSensitive: false en dur dans le PDF', 'en dur', 'profile: { armSensitive: options.armSensitive === true }', 'profile: { armSensitive: false }'),
      edit('armSensitive: true en dur dans le PDF', 'en dur', 'profile: { armSensitive: options.armSensitive === true }', 'profile: { armSensitive: true }'),
      edit('paramètre du PDF retiré', 'ne vient d\'aucun paramètre', ',\n  options: PdfAnalysisOptions = {},\n', ',\n'),
      edit('déclaration persistée dans la configuration enregistrée', 'StoredConfiguration', '  rcsScore: number;\n  compatibility: number;\n  createdAt: string;\n}', '  rcsScore: number;\n  compatibility: number;\n  armSensitive?: boolean;\n  createdAt: string;\n}'),
    ];
    for (const m of PDF_NEGATIVES) {
      const mutated = m.apply(pdfSrc);
      if (mutated === null) {
        fail(`configurateur FR : prémisse du test négatif « ${m.name} » fausse (motif absent de ${PDF21})`);
        continue;
      }
      if (analyse(pageSrc, mutated, storageSrc).some((i) => i.includes(m.needle))) detected++;
      else fail(`configurateur FR : garde-fou muet sur « ${m.name} » (motif attendu « ${m.needle} »)`);
    }
    const mutatedStorage = replaceFirst(storageSrc, '  rcsScore: number;\n', '  rcsScore: number;\n  armSensitive?: boolean;\n');
    if (mutatedStorage === null) fail(`configurateur FR : prémisse du test négatif « déclaration persistée dans SavedConfiguration » fausse (motif absent de ${STORAGE21})`);
    else if (analyse(pageSrc, pdfSrc, mutatedStorage).some((i) => i.includes('SavedConfiguration'))) detected++;
    else fail('configurateur FR : garde-fou muet sur « déclaration persistée dans SavedConfiguration »');

    if (engineOk) {
      const ENGINE_NEGATIVES: Array<[string, string, string, string]> = [
        ['seuil « bras sensible » remis à 35', '? rcs >= 32 ||', '? rcs >= 35 ||', 'sensible :'],
        ['seuil « bras sensible » décalé à 33', '? rcs >= 32 ||', '? rcs >= 33 ||', 'sensible :'],
        ['seuil standard avancé à 32', ': rcs >= 35 ||', ': rcs >= 32 ||', 'standard :'],
        ['second filet « confort » du profil sensible abaissé (55 → 45)', 'comfort < 55', 'comfort < 45', 'sensible :'],
        ['second filet « confort » du profil standard relevé (45 → 55)', 'comfort < 45', 'comfort < 55', 'standard :'],
        ['absence de profil traitée comme un bras sensible', 'profile?.armSensitive ?? false', 'profile?.armSensitive ?? true', 'défaut :'],
        ['alerte « bras sensible » supprimée', 'if (armRisk) {', 'if (armRisk && !armSensitive) {', 'sensible :'],
        // Textes (22/10/2026) : une alerte qui ne dit plus le risque, qui promet un effet, qui perd son renvoi, qui se trompe de
        // cause, de profil ou de nombre de points est rejetée. Un test par alerte : indice (deux profils) et second filet.
        ['alerte « indice » : le risque n\'est plus nommé', "`seuil fixé par le site pour le risque de tennis elbow. ` +", '', 'texte :'],
        ['alerte « second filet » : le risque n\'est plus nommé', "`second seuil d'alerte fixé par le site pour le risque de tennis elbow ; ` +", "`second seuil d'alerte ; ` +", 'texte :'],
        ['alerte : promesse d\'effet sur le bras réintroduite', " l'abaisse aussi. ${consulter}`", " l'abaisse aussi, pour limiter le risque de tennis elbow. ${consulter}`", 'texte :'],
        ['alerte : renvoi vers un professionnel de santé retiré', "const consulter = 'Douleur persistante : consultez un professionnel de santé.';", "const consulter = '';", 'texte :'],
        ['alerte « indice » : nombre de points à perdre faux', 'const points = rcs - seuil + 1;', 'const points = rcs - seuil;', 'texte :'],
        ['alerte : second filet présenté comme un indice au seuil', 'if (rcs >= seuil) {', 'if (true) {', 'texte :'],
        ['alerte « bras sensible » : profil non dit', "const profil = armSensitive ? 'bras sensible déclaré' : 'profil standard';", "const profil = armSensitive ? 'sensible' : 'profil standard';", 'texte :'],
        ['alerte standard : profil non dit', "const profil = armSensitive ? 'bras sensible déclaré' : 'profil standard';", "const profil = armSensitive ? 'bras sensible déclaré' : 'standard';", 'texte :'],
        ['alerte : seuil cité au lieu du seuil appliqué', 'const seuil = armSensitive ? ARM_ALERT_RCS.sensitive : ARM_ALERT_RCS.standard;', 'const seuil = ARM_ALERT_RCS.standard;', 'texte :'],
        ['alerte « indice » : incise polyester inversée', "${isPoly ? ' (un multifilament ou un boyau, par exemple)' : ''}", "${isPoly ? '' : ' (un multifilament ou un boyau, par exemple)'}", 'texte :'],
        ['alerte « second filet » : arrondi à la limite non dit', 'const arrondiALaLimite = comfort !== null && round(comfort) >= limite;', 'const arrondiALaLimite = false;', 'texte :'],
        ['alerte « second filet » : la note éditoriale non mesurée n\'est plus nommée', "elle part de la note de confort de l'équipe, non mesurée, et ", '', 'texte :'],
        ['alerte « second filet » : arrondi dit à tort', 'const arrondiALaLimite = comfort !== null && round(comfort) >= limite;', 'const arrondiALaLimite = comfort !== null;', 'texte :'],
        ['la déclaration change l\'indice', 'const { rcs, hybrid } = setupFirmnessIndex(input);', 'const { rcs: rcs0, hybrid } = setupFirmnessIndex(input);\n  const rcs = rcs0 - (profile?.armSensitive ? 2 : 0);', 'profil :'],
        ['bornes d\'hybride sur un montage sans travers', 'return { rcs: rcsIndex(racquetStiffness, main, avgTension), hybrid: null };', "return { rcs: rcsIndex(racquetStiffness, main, avgTension), hybrid: { mains: 0, crosses: 0, note: 'estimation' } };", 'hybride :'],
      ];
      for (const [name, find, replace, needle] of ENGINE_NEGATIVES) {
        const mutated = replaceFirst(engineSrc, find, replace);
        if (mutated === null) {
          fail(`configurateur FR : prémisse du test négatif « ${name} » fausse (motif absent de ${ENGINE21})`);
          continue;
        }
        let issues: string[] = [];
        try {
          issues = checkEngine(loadEngine(mutated), STRIDE, true).issues;
        } catch (e) {
          fail(`configurateur FR : moteur altéré « ${name} » illisible (${(e as Error).message}) : le test doit échouer bruyamment`);
          continue;
        }
        if (issues.some((i) => i.startsWith(needle))) detected++;
        else fail(`configurateur FR : garde-fou muet sur « ${name} » (le moteur altéré passe le contrôle ; motif attendu « ${needle} »)`);
      }
      const harmless = replaceFirst(engineSrc, 'const round = (v: number) => Math.round(v);', 'const round = (v: number) => Math.round(v + 0);');
      if (harmless === null) fail(`configurateur FR : prémisse du témoin positif « moteur reformulé, même comportement » fausse (motif absent de ${ENGINE21})`);
      else {
        const found = checkEngine(loadEngine(harmless), STRIDE, true).issues;
        if (found.length > 0) fail(`configurateur FR : témoin positif « moteur reformulé, même comportement » rejeté à tort : ${found.join(' ; ')}`);
        else accepted++;
      }
    }

    if (failures.length === before21) {
      const rate = (k: number) => ((k / real.n) * 100).toFixed(2);
      const bandText = [...real.band].map(([idx, b]) => `${idx} : ${b.n} montages, ${b.sen} alertés (profil sensible), ${b.std} par le seul second filet (profil standard)`).join(' ; ');
      ok(
        `configurateur FR : le bras sensible se déclare (case à cocher reliée à profile.armSensitive, état initial false, en mémoire seulement ; PDF : paramètre de sa fonction) ; ` +
          `moteur réel sur ${real.n} montages : alerte dès l'indice ${S} pour armSensitive: true, dès ${N} sinon, second filet confort inchangé (< ${COMFORT_NET.sensitive} / < ${COMFORT_NET.standard}), absence de profil = false, texte de chaque alerte relu (cause, indice, seuil, profil, risque nommé, points à perdre, incise polyester, arrondi de la note affichée, renvoi, aucune promesse) ; ` +
          `taux d'alerte standard ${rate(real.stdAlerts)} % -> sensible ${rate(real.senAlerts)} % ; bande ${bandText} ; ` +
          `GA4 : ${gaCallers} appel(s) de trackArmWarningShown, second argument false, événement piloté par le résultat du profil standard ; aucun stockage, URL ni cookie ; ` +
          `texte d'aide : seuils ${S} et ${N} (sondés), professionnel de santé, « ni enregistrée ni envoyée » ; ` +
          `indice affiché = indice du moteur (aucun second calcul ; palier, enregistrement et GA4 sur le même entier ; bornes et mention d'estimation d'un hybride affichées) ; ` +
          `${detected} tests négatifs détectés, ${accepted} témoins positifs acceptés`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 21 quinquies. NOTES /10 SANS VALEUR COMBLÉE — configurateur et catalogue EN (23/10/2026)
// Décision (avis d'Opus 5.5 du 23/10/2026, AH §2 et §3 ; tsa-acquisition, propriétaire de public/en) : une note /10 ou un prix
// absents ne sont jamais remplacés par un nombre, ni pour choisir, ni pour trier, ni pour filtrer, ni pour afficher (règle 3).
// (a) Aucun `|| <nombre>` ni `?? <nombre>` sur un champ de note (comfort, spin, control, durability, power) dans public/ (HTML
//     et JS, blog compris), ni dans pickBestString du configurateur EN, ni dans la barre de note du catalogue EN (ratingBar).
// (b) pickBestString du configurateur EN, évalué tel quel avec chaque critère de la page, le tirage du top 3 forcé sur ses
//     trois rangs : un cordage sans note injecté en tête du catalogue n'est jamais choisi ; le cordage choisi a l'une des trois
//     meilleures notes du critère (recalcul indépendant) ; sur une liste où une note comblée à 5 le placerait en tête, il
//     n'est pas choisi non plus ; sans aucun candidat noté : aucun cordage et « No rated string matches these criteria. ».
// (c) La raison d'un cordage choisi par une note nomme la nature de SA note (TSARatingLabels.label du cordage choisi) ; tout appel de
//     pickBestString passe par ratedStringView, sauf dans la branche de la douleur déclarée (remplacée par la PR #148 :
//     cordage le moins rigide, contrôle 21 quater).
// (d) Catalogue EN : tris par prix et par note avec les fiches sans prix ou sans note en fin de liste dans les deux sens ;
//     prix maximal : un prix absent ne passe pas (comme filterStrings en FR) ; phrase des filtres « … the ratings out of 10
//     shown on each card (not measured). ».
{
  const beforeQ5 = failures.length;
  const CONFQ5 = 'public/en/configurator.html';
  const CATQ5 = 'public/en/strings.html';
  const NUM_FALLBACK = /(?:\|\||\?\?)\s*-?\d/;
  const FIELD_FALLBACK = /\b(?:comfort|spin|control|durability|power)\b\)?\s*(?:\|\||\?\?)\s*-?\d/;
  const NO_RATED = 'No rated string matches these criteria.';
  const CARD_SENTENCE = 'The spin, control, comfort and durability filters and sort options use the ratings out of 10 shown on each card (not measured). ';
  let confQ5 = '';
  let catQ5 = '';
  try {
    confQ5 = readFileSync(CONFQ5, 'utf8').replace(/\r\n/g, '\n');
    catQ5 = readFileSync(CATQ5, 'utf8').replace(/\r\n/g, '\n');
  } catch (e) {
    fail(`notes sans valeur comblée (EN) : fichier illisible (${(e as Error).message})`);
  }
  if (confQ5 && catQ5) {
    const stringsQ5: any[] = buildCatalog(racquetsDatabase, stringsDatabase).strings;
    const sliceQ5 = (src: string, start: string, end: string): string | null => {
      const i = src.indexOf(start);
      const j = i < 0 ? -1 : src.indexOf(end, i + start.length);
      return i < 0 || j < 0 ? null : src.slice(i, j + end.length);
    };
    // Fonction seule ; stringPickNote est déclarée par l'évaluation : le contrôle tourne aussi sur une page qui ne la
    // déclare pas (main avant cette PR).
    const pickerOf = (html: string) => sliceQ5(html, 'function pickBestString(criteria) {', "return picked;\n    }\n");
    const reasonOf = (html: string) => sliceQ5(html, 'function ratedStringView(s, criterion) {', '\n    }\n');
    const barOf = (html: string) => sliceQ5(html, 'function ratingBar(label, value) {', '\n    }\n');
    const filterOf = (html: string) => sliceQ5(html, 'function filterStrings() {', '\n      renderStrings();\n    }\n');
    const criteriaOf = (html: string): any[] =>
      [...html.matchAll(/stringCriteria = (\{[^{}]*\});/g)].map((m) => new Function(`return (${m[1]});`)());
    const KEYS: Array<[string, string]> = [['preferComfort', 'comfort'], ['preferSpin', 'spin'], ['preferControl', 'control']];
    const unrated = (type: string) => ({ id: 'test-sans-note', brand: 'Test', model: 'Unrated', type, stiffness: 200, spin: null, control: null, comfort: null, power: null, durability: null, price_eur: null });
    const rated = (id: string, type: string, v: number) => ({ id, brand: 'Test', model: id, type, stiffness: 150, spin: v, control: v, comfort: v, power: v, durability: v, price_eur: 10 });

    // (a) Repli numérique sur un champ de note, partout dans public/, et dans les deux fonctions qui manipulent une note anonyme.
    const scanFallbacks = (file: string, src: string): string[] =>
      src
        .split('\n')
        .map((l, i) => [l, i + 1] as [string, number])
        .filter(([l]) => FIELD_FALLBACK.test(l))
        .map(([l, n]) => `${file}:${n} : note /10 remplacée par un nombre (« ${l.trim().slice(0, 100)} »)`);
    const walkQ5 = (d: string): string[] =>
      readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walkQ5(`${d}/${n}`) : [`${d}/${n}`]));
    const publicFiles = walkQ5('public').filter((f) => /\.(?:html|js|mjs)$/.test(f));
    for (const f of publicFiles) scanFallbacks(f, readFileSync(f, 'utf8')).forEach((m) => fail(m));
    const bodyIssues = (html: string, catHtml: string): string[] => {
      const out: string[] = [];
      const picker = pickerOf(html);
      const bar = barOf(catHtml);
      if (picker === null) out.push(`${CONFQ5} : pickBestString introuvable, relire le contrôle 21 quinquies`);
      else if (NUM_FALLBACK.test(picker)) out.push(`${CONFQ5} : pickBestString remplace une valeur absente par un nombre`);
      if (bar === null) out.push(`${CATQ5} : ratingBar introuvable, relire le contrôle 21 quinquies`);
      else if (NUM_FALLBACK.test(bar)) out.push(`${CATQ5} : ratingBar remplace une note absente par un nombre`);
      return out;
    };

    // (b) pickBestString évalué tel quel ; (c) raison et appels.
    let picksQ5 = 0;
    const pickerIssues = (html: string): string[] => {
      const out: string[] = [];
      const add = (m: string) => { if (out.length < 10) out.push(`${CONFQ5} : ${m}`); };
      const picker = pickerOf(html);
      if (picker === null) return [`${CONFQ5} : pickBestString introuvable, relire le contrôle 21 quinquies`];
      const criteria = criteriaOf(html);
      if (criteria.length < 5) add(`${criteria.length} critères de cordage seulement, relire le contrôle 21 quinquies`);
      const run = (db: any[], crit: any, k: number) => {
        const M = Object.create(Math);
        M.random = () => k;
        const api = new Function('stringsDB', 'console', 'Math', `let stringPickNote = null;\n${picker}\nreturn { picked: pickBestString(${JSON.stringify(crit)}), note: stringPickNote };`)(
          db, { log() {} }, M);
        return api as { picked: any; note: string | null };
      };
      for (const crit of criteria) {
        const keys = KEYS.filter(([flag]) => crit[flag]).map(([, key]) => key);
        if (keys.length === 0) continue;
        const key = keys[keys.length - 1];
        const type = crit.types?.[0] ?? 'Polyester';
        const typed = stringsQ5.filter((s) => !crit.types || crit.types.some((t: string) => String(s.type ?? '').toLowerCase().includes(t.toLowerCase())));
        const ratedVals = typed.filter((s) => keys.every((x) => typeof s[x] === 'number')).map((s) => s[key]).sort((a, b) => b - a);
        const third = ratedVals[Math.min(2, ratedVals.length - 1)];
        for (const k of [0, 0.34, 0.67, 0.99]) {
          const real = run([unrated(type), ...stringsQ5], crit, k);
          picksQ5++;
          if (!real.picked) add(`critère ${JSON.stringify(crit)} : aucun cordage choisi sur le catalogue`);
          else if (real.picked.id === 'test-sans-note') add(`critère ${JSON.stringify(crit)} : le cordage sans note injecté en tête est choisi`);
          else if (!keys.every((x) => typeof real.picked[x] === 'number') || real.picked[key] < third) {
            add(`critère ${JSON.stringify(crit)} : ${real.picked.id} (${key} ${real.picked[key]}) n'est pas parmi les trois meilleures notes (${ratedVals.slice(0, 3).join(', ')})`);
          }
          const low = run([unrated(type), rated('test-note-4', type, 4), rated('test-note-3', type, 3)], crit, k);
          if (!low.picked || low.picked.id === 'test-sans-note') add(`critère ${JSON.stringify(crit)} : liste où une note comblée à 5 passerait en tête, choisi ${low.picked?.id ?? 'aucun'}`);
        }
        const none = run([unrated(type)], crit, 0);
        if (none.picked || none.note !== NO_RATED) add(`critère ${JSON.stringify(crit)} : sans candidat noté, choisi ${none.picked?.id ?? 'aucun'}, note « ${none.note} »`);
      }
      const reason = reasonOf(html);
      if (reason === null) add('ratedStringView introuvable, relire le contrôle 21 quinquies');
      else {
        // Libellé témoin propre à chaque cordage : la raison doit porter celui du cordage choisi, tel que label(s) le rend.
        const labels = { label: (s: any) => `nature de ${s.id}` };
        const view = new Function('stringView', 'TSARatingLabels', `${reason}\nreturn ratedStringView;`)((s: any, r: string) => (s ? { reason: r } : null), labels);
        for (const s of stringsQ5.filter((x) => typeof x.comfort === 'number').slice(0, 20)) {
          const want = `Criterion (nature de ${s.id}).`;
          if (view(s, 'Criterion')?.reason !== want) { add(`raison : « ${view(s, 'Criterion')?.reason} » au lieu de « ${want} »`); break; }
        }
        if (view(null, 'Criterion') !== null) add('raison : un cordage absent produit une fiche');
      }
      const painStart = html.indexOf('// PRIORITY 2');
      const painEnd = html.indexOf('// PRIORITY 3', painStart);
      const outsidePain = painStart < 0 || painEnd < 0 ? html : html.slice(0, painStart) + html.slice(painEnd);
      const calls = [...outsidePain.matchAll(/(\w+)\(pickBestString\(/g)].map((m) => m[1]);
      if (calls.length === 0) add('aucun appel de pickBestString trouvé, relire le contrôle 21 quinquies');
      const bad = calls.filter((c) => c !== 'ratedStringView');
      if (bad.length > 0) add(`${bad.length} cordage(s) choisi(s) par une note sans nature dans la raison (${bad.join(', ')}(pickBestString(…)))`);
      if (!/showGenerateError\(!string && stringPickNote\b/.test(html)) add('la note « No rated string… » n\'est plus affichée quand aucun cordage noté ne reste');
      return out;
    };

    // (d) Catalogue EN : filterStrings évalué tel quel sur le catalogue, chaque tri et le prix maximal.
    let sortsQ5 = 0;
    const catalogIssues = (html: string): string[] => {
      const out: string[] = [];
      const add = (m: string) => { if (out.length < 10) out.push(`${CATQ5} : ${m}`); };
      if (!html.includes(`ratingNote.textContent = '${CARD_SENTENCE}' + TSARatingLabels.NOTE;`)) add('phrase des filtres et des tris absente ou modifiée');
      if (/TSA editorial ratings out of 10/.test(html)) add('phrase « TSA editorial ratings out of 10 » encore présente');
      const src = filterOf(html);
      if (src === null) return [...out, `${CATQ5} : filterStrings introuvable, relire le contrôle 21 quinquies`];
      const run = (values: Record<string, string>) => {
        const doc = { getElementById: (id: string) => ({ value: values[id] ?? '' }) };
        return new Function('document', 'allStrings', 'updateActiveFilters', 'renderStrings', `let filteredStrings = [];\n${src}\nfilterStrings();\nreturn filteredStrings;`)(
          doc, stringsQ5, () => {}, () => {}) as any[];
      };
      const SORTS: Array<[string, string, number]> = [
        ['price-asc', 'price_eur', 1], ['price-desc', 'price_eur', -1], ['spin-desc', 'spin', -1],
        ['control-desc', 'control', -1], ['comfort-desc', 'comfort', -1], ['durability-desc', 'durability', -1],
      ];
      for (const [sort, field, dir] of SORTS) {
        sortsQ5++;
        const list = run({ sortFilter: sort });
        const firstAbsent = list.findIndex((s) => typeof s[field] !== 'number');
        const present = firstAbsent < 0 ? list : list.slice(0, firstAbsent);
        if (list.slice(present.length).some((s) => typeof s[field] === 'number')) add(`tri ${sort} : une fiche sans ${field} n'est pas en fin de liste`);
        if (present.some((s, i) => i > 0 && dir * (s[field] - present[i - 1][field]) < 0)) add(`tri ${sort} : ordre faux sur les fiches renseignées`);
        if (list.length !== stringsQ5.length) add(`tri ${sort} : ${list.length} fiches au lieu de ${stringsQ5.length}`);
      }
      const capped = run({ sortFilter: 'brand', priceFilter: '20' });
      if (capped.some((s) => typeof s.price_eur !== 'number' || s.price_eur > 20)) add('prix maximal 20 € : une fiche sans prix ou plus chère passe le filtre');
      return out;
    };

    bodyIssues(confQ5, catQ5).forEach((m) => fail(m));
    pickerIssues(confQ5).forEach((m) => fail(m));
    catalogIssues(catQ5).forEach((m) => fail(m));
    const realPicks = picksQ5;
    const realSorts = sortsQ5;
    const ratedCriteria = criteriaOf(confQ5).filter((c) => KEYS.some(([flag]) => c[flag])).length;
    const absentPrices = stringsQ5.filter((s) => typeof s.price_eur !== 'number').length;
    const absentRatings = stringsQ5.filter((s) => typeof s.comfort !== 'number').length;

    // Tests négatifs : chaque altération doit être détectée ; témoins positifs : chaque variante neutre doit être acceptée.
    let detectedQ5 = 0;
    let acceptedQ5 = 0;
    const once = (s: string, find: string, rep: string): string | null => (s.includes(find) ? s.replace(find, () => rep) : null);
    const NEG: Array<[string, 'conf' | 'cat', Array<[string, string]>]> = [
      ['note comblée à 5 rétablie dans pickBestString', 'conf', [
        ["const rated = candidates.filter(s => typeof s[key] === 'number');", 'const rated = candidates;'],
        ['candidates = rated.sort((a, b) => b[key] - a[key]);', 'candidates = rated.sort((a, b) => (b[key] || 5) - (a[key] || 5));'],
      ]],
      ['cordages sans note gardés (lus comme 0)', 'conf', [["const rated = candidates.filter(s => typeof s[key] === 'number');", 'const rated = candidates;']]],
      ['note « aucun cordage noté » jamais posée', 'conf', [["if (candidates.length > 0 && rated.length === 0) stringPickNote = 'No rated string matches these criteria.';", '']]],
      ['raison sans la nature de la note', 'conf', [["return stringView(s, s ? criterion + ' (' + TSARatingLabels.label(s) + ').' : '');", "return stringView(s, s ? criterion + '.' : '');"]]],
      ['cordage choisi par une note sans ratedStringView', 'conf', [["string = ratedStringView(pickBestString(stringCriteria), 'One of the polyester strings with the highest control rating in the catalog');", "string = stringView(pickBestString(stringCriteria), 'One of the polyester strings with the highest control rating in the catalog.');"]]],
      ['tri prix croissant : prix absent lu comme 0', 'cat', [["case 'price-asc': return absentLast(a.price_eur, b.price_eur, 1);", "case 'price-asc': return a.price_eur - b.price_eur;"]]],
      ['tri confort : note absente lue comme 0 (en tête si croissant)', 'cat', [["case 'comfort-desc': return absentLast(a.comfort, b.comfort, -1);", "case 'comfort-desc': return (a.comfort ?? 0) - (b.comfort ?? 0);"]]],
      ['prix maximal : prix absent accepté', 'cat', [["if (maxPrice && !(typeof string.price_eur === 'number' && string.price_eur <= parseInt(maxPrice))) return false;", 'if (maxPrice && string.price_eur > parseInt(maxPrice)) return false;']]],
      ['barre de note : note absente comblée à 0', 'cat', [["${typeof value === 'number' ? `<div class=\"rating-fill ${getRatingColor(value)}\" style=\"width: ${value * 10}%\"></div>` : ''}", '<div class="rating-fill ${getRatingColor(value)}" style="width: ${(value ?? 0) * 10}%"></div>']]],
      ['phrase « TSA editorial ratings » rétablie', 'cat', [[CARD_SENTENCE, 'The spin, control, comfort and durability filters and sort options use TSA editorial ratings out of 10. ']]],
    ];
    for (const [name, target, edits] of NEG) {
      let m: string | null = target === 'conf' ? confQ5 : catQ5;
      for (const [find, rep] of edits) m = m === null ? null : once(m, find, rep);
      if (m === null) { fail(`notes sans valeur comblée : prémisse du test négatif « ${name} » fausse (motif absent)`); continue; }
      const found = target === 'conf' ? [...bodyIssues(m, catQ5), ...pickerIssues(m)] : [...bodyIssues(confQ5, m), ...catalogIssues(m)];
      if (found.length > 0) detectedQ5++;
      else fail(`notes sans valeur comblée : garde-fou muet sur « ${name} »`);
    }
    // Balayage : un repli sur un champ de note ajouté à un fichier de public/js doit être vu ; une note lue sans repli ou un
    // repli sur un compteur ne le sont pas.
    if (scanFallbacks('public/js/x.js', 'const c = (s.comfort ?? 0) * 10;').length > 0) detectedQ5++;
    else fail('notes sans valeur comblée : garde-fou muet sur « repli ?? 0 sur comfort dans public/js »');
    if (scanFallbacks('public/js/x.js', "const c = typeof s.comfort === 'number' ? s.comfort : null;\nconst n = profile.count || 0;").length === 0) acceptedQ5++;
    else fail('notes sans valeur comblée : témoin positif « note lue sans repli, compteur à 0 » rejeté à tort');
    const POS: Array<[string, 'conf' | 'cat', string, string]> = [
      ['raison reformulée', 'conf', "'One of the polyester strings with the highest control rating in the catalog'", "'A polyester string among the three best control ratings in the catalog'"],
      ['comparateur « absent en fin » écrit autrement', 'cat', 'if (!hasX || !hasY) return hasX === hasY ? 0 : (hasX ? -1 : 1);', 'if (!hasX || !hasY) return Number(hasY) - Number(hasX);'],
    ];
    for (const [name, target, find, rep] of POS) {
      const m = once(target === 'conf' ? confQ5 : catQ5, find, rep);
      if (m === null) { fail(`notes sans valeur comblée : prémisse du témoin positif « ${name} » fausse (motif absent)`); continue; }
      const found = target === 'conf' ? [...bodyIssues(m, catQ5), ...pickerIssues(m)] : [...bodyIssues(confQ5, m), ...catalogIssues(m)];
      if (found.length === 0) acceptedQ5++;
      else fail(`notes sans valeur comblée : témoin positif « ${name} » rejeté à tort : ${found[0]}`);
    }

    if (failures.length === beforeQ5) {
      ok(
        `notes sans valeur comblée (EN) : aucun repli numérique sur une note dans ${publicFiles.length} fichiers de public/, ni dans pickBestString ni ratingBar ; ` +
          `configurateur : pickBestString évalué tel quel (${ratedCriteria} critères de la page triés par une note, ${realPicks} tirages forcés sur le catalogue), cordage sans note injecté en tête jamais choisi, ` +
          `choix parmi les trois meilleures notes, « ${NO_RATED} » sans candidat noté, raison avec la nature de la note ; ` +
          `catalogue : ${realSorts} tris évalués tels quels sur ${stringsQ5.length} fiches, ${absentPrices} fiches sans prix et ${absentRatings} sans note en fin de liste, prix maximal sans fiche non chiffrée, phrase des filtres à jour ; ` +
          `${detectedQ5} tests négatifs détectés, ${acceptedQ5} témoins positifs acceptés`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 21 bis. PDF : la méthodologie imprimée cite les deux seuils d'alerte bras, lus dans le moteur
//         (option C de l'arbitrage de la PR #124, décision de l'orchestrateur du 11/10/2026)
// ---------------------------------------------------------------------------
// Constat : le PDF est recalculé à l'export depuis une configuration ENREGISTRÉE, qui ne porte pas la déclaration « bras sensible »
// (rien n'est enregistré, contrôle 21) : un PDF exporté du compte applique donc le seuil standard et n'a aucune alerte aux indices 32 à 34,
// alors que la page en aurait une pour un bras sensible. La méthodologie imprimée cite maintenant les deux seuils et dit lequel ce
// document a appliqué, sans rien enregistrer. Ce bloc échoue si :
//   (a) la paire exportée `ARM_ALERT_RCS` (que le PDF cite) n'est pas ce que le moteur applique, sondé dans `calculateAdvancedRcs` ;
//   (b) le constructeur de données du PDF recopie un seuil à la main au lieu de lire `ARM_ALERT_RCS`, ou n'indique pas le profil appliqué
//       d'après la même condition que celle passée au moteur ;
//   (c) la ligne manque dans le texte imprimé d'un PDF, y figure deux fois, sort de la méthodologie, cite d'autres seuils que ceux du
//       moteur, annonce le mauvais profil, ne renvoie plus vers un professionnel de santé ou porte une allégation de protection ou un
//       absolu (charte F7). Quatre PDF sont imprimés : export du compte, hybride, bras sensible déclaré, sans analyse avancée (la ligne
//       est imprimée dans tous : les seuils sont un fait général, pas un résultat d'analyse) ;
//   (d) (22/10/2026) l'indice imprimé n'est pas celui du moteur (`setupFirmnessIndex`, l'indice que la page affiche et que l'alerte
//       cite), y figure deux fois, ou diffère de l'indice cité par une alerte ; la mention d'estimation d'un hybride manque sous
//       l'indice, diffère de celle du moteur ou s'imprime pour un montage sans travers ; `recomputeRcs` diffère du moteur. Un cinquième
//       PDF, hybride avec bras sensible déclaré, porte une alerte que seul l'indice unique déclenche (60/40 : 31, indice : 32).
// Chaque garde est rejouée sur des copies altérées (constantes, moteur, données, source d'impression, constructeur) ; des témoins positifs
// prouvent qu'une reformulation inoffensive passe.
{
  const before21b = failures.length;
  const S = ARM_ALERT_SENSITIVE;
  const N = ARM_ALERT_STANDARD;
  if (S === null || N === null) {
    fail("PDF : seuils d'alerte bras introuvables dans calculateAdvancedRcs (sonde muette)");
  } else {
    const read = (f: string): string => readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
    const engineSrc = read('src/lib/advanced-rcs.ts');
    const exportSrc = read('src/lib/pdf-export.ts');
    const dataSrc = read('src/lib/pdf-configuration-data.ts');
    const replaceFirst = (s: string, find: string, replace: string): string | null => {
      const i = s.indexOf(find);
      return i < 0 ? null : s.slice(0, i) + replace + s.slice(i + find.length);
    };

    // --- Chargement de modules (copies altérées) et sonde générique -------------------------------------------------
    const stringsModule = await import('../src/data/strings-database');
    const loadModule = (src: string, deps: Record<string, unknown> = {}): Record<string, any> => {
      const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
      const mod: { exports: Record<string, unknown> } = { exports: {} };
      new Function('exports', 'require', 'module', js)(
        mod.exports,
        (id: string) => {
          if (id in deps) return deps[id];
          throw new Error(`require inattendu : ${id}`);
        },
        mod
      );
      return mod.exports;
    };
    type Calc = typeof calculateAdvancedRcs;
    const probeWith = (calc: Calc, armSensitive: boolean): number | null => {
      for (let st = 60; st <= 400; st++) {
        const adv = calc({ racquetStiffness: DEFAULT_RACQUET_RA, mainStringStiffness: st, mainStringFamily: 'polyester', mainRatings: {}, mainTension: 24, profile: { armSensitive } });
        if (adv.warnings.length > 0) return adv.rcs;
      }
      return null;
    };

    // --- (a) la paire exportée = ce que le moteur applique -----------------------------------------------------------
    const constantsIssues = (calc: Calc, consts: { sensitive?: number; standard?: number } | undefined): string[] => {
      if (!consts || typeof consts.sensitive !== 'number' || typeof consts.standard !== 'number') return ['constantes : ARM_ALERT_RCS (seuils exportés par advanced-rcs.ts) introuvable'];
      const s = probeWith(calc, true);
      const n = probeWith(calc, false);
      if (s === null || n === null) return ['constantes : seuils du moteur introuvables (sonde muette)'];
      const issues: string[] = [];
      if (consts.sensitive !== s) issues.push(`constantes : ARM_ALERT_RCS.sensitive = ${consts.sensitive} alors que le moteur alerte un bras sensible dès ${s}`);
      if (consts.standard !== n) issues.push(`constantes : ARM_ALERT_RCS.standard = ${consts.standard} alors que le moteur alerte dès ${n}`);
      return issues;
    };
    const engineModule = (await import('../src/lib/advanced-rcs')) as Record<string, any>;
    constantsIssues(calculateAdvancedRcs, engineModule.ARM_ALERT_RCS).forEach((i) => fail(`PDF : ${i}`));

    // --- (b) le constructeur de données lit la paire, il ne recopie rien -----------------------------------------------
    const builderFindings = (src: string): string[] => {
      const issues: string[] = [];
      const sf = ts.createSourceFile('pdf-configuration-data.ts', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
      const propName = (p: ts.ObjectLiteralElementLike): string | null => (p.name !== undefined && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null);
      const propValue = (p: ts.ObjectLiteralElementLike): ts.Expression | null => (ts.isPropertyAssignment(p) ? p.initializer : ts.isShorthandPropertyAssignment(p) ? p.name : null);
      let imported = false;
      let armAlert: ts.ObjectLiteralExpression | null = null;
      let engineFlag = '';
      const walk = (n: ts.Node): void => {
        if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier) && n.moduleSpecifier.text === '@/lib/advanced-rcs') {
          const nb = n.importClause?.namedBindings;
          if (nb && ts.isNamedImports(nb) && nb.elements.some((e) => e.name.text === 'ARM_ALERT_RCS')) imported = true;
        }
        if (ts.isObjectLiteralExpression(n)) {
          const aa = n.properties.find((p) => propName(p) === 'armAlert');
          const v = aa ? propValue(aa) : null;
          if (v && ts.isObjectLiteralExpression(v)) armAlert = v;
        }
        if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'calculateAdvancedRcs') {
          const arg = n.arguments[0];
          const prof = arg && ts.isObjectLiteralExpression(arg) ? arg.properties.find((p) => propName(p) === 'profile') : undefined;
          const pv = prof ? propValue(prof) : null;
          const flag = pv && ts.isObjectLiteralExpression(pv) ? pv.properties.find((p) => propName(p) === 'armSensitive') : undefined;
          const fv = flag ? propValue(flag) : null;
          if (fv) engineFlag = fv.getText(sf);
        }
        ts.forEachChild(n, walk);
      };
      walk(sf);
      if (!imported) issues.push("constructeur : ARM_ALERT_RCS n'est pas importé de @/lib/advanced-rcs (les seuils du PDF doivent être lus dans le moteur)");
      if (!armAlert) return [...issues, "constructeur : armAlert absent des données du PDF (la méthodologie n'aurait plus de seuils à citer)"];
      const at = (name: string): string => {
        const p = (armAlert as ts.ObjectLiteralExpression).properties.find((q) => propName(q) === name);
        const v = p ? propValue(p) : null;
        return v ? v.getText(sf) : '';
      };
      if (at('standardAt') !== 'ARM_ALERT_RCS.standard') issues.push(`constructeur : standardAt vaut « ${at('standardAt') || 'absent'} » au lieu de ARM_ALERT_RCS.standard : seuil recopié à la main`);
      if (at('sensitiveAt') !== 'ARM_ALERT_RCS.sensitive') issues.push(`constructeur : sensitiveAt vaut « ${at('sensitiveAt') || 'absent'} » au lieu de ARM_ALERT_RCS.sensitive : seuil recopié à la main`);
      if (engineFlag === '' || at('sensitiveApplied') !== engineFlag) issues.push(`constructeur : sensitiveApplied vaut « ${at('sensitiveApplied') || 'absent'} » alors que le profil passé au moteur est « ${engineFlag || 'absent'} » : le PDF doit annoncer le profil réellement appliqué (même condition)`);
      return issues;
    };
    builderFindings(dataSrc).forEach((i) => fail(`PDF : ${i}`));

    // --- (c) la ligne dans le texte imprimé de chaque PDF ----------------------------------------------------------------
    const printed: string[] = [];
    class FakePdf {
      setFont() {} setFontSize() {} setTextColor() {} setFillColor() {} setDrawColor() {} rect() {} roundedRect() {} line() {} setLineWidth() {}
      addPage() {} setPage() {} save() {}
      getNumberOfPages() { return 1; }
      splitTextToSize(t: string) { return [t]; }
      text(t: string | string[]) { printed.push(...(Array.isArray(t) ? t : [t])); }
    }
    const printPdf = async (exportFn: (d: unknown) => Promise<void>, data: unknown): Promise<string[]> => {
      printed.length = 0;
      (globalThis as { window?: unknown }).window = { jspdf: { jsPDF: FakePdf } };
      try {
        await exportFn(data);
      } finally {
        delete (globalThis as { window?: unknown }).window;
      }
      return [...printed];
    };
    const { buildConfigurationPdfData } = await import('../src/lib/pdf-configuration-data');
    const { exportConfigurationPdf } = await import('../src/lib/pdf-export');
    const BASE_CFG = { name: 'audit 21 bis', crossStringId: null, mainGauge: '1.25', crossGauge: '1.25', mainTension: 24, crossTension: 22, rating: 0, notes: null, rcsScore: 32, compatibility: 90, createdAt: '2026-10-11T00:00:00.000Z' };
    type PdfCase = { name: string; cfg: Record<string, unknown>; opt?: { armSensitive?: boolean } };
    const CASES: PdfCase[] = [
      { name: 'PDF exporté du compte (sans option)', cfg: { racquetId: 'wilson-blade-98-16x19-v9', mainStringId: 'luxilon-alu-power' } },
      { name: 'PDF hybride', cfg: { racquetId: 'wilson-blade-98-16x19-v9', mainStringId: 'luxilon-alu-power', crossStringId: 'babolat-rpm-blast' } },
      { name: 'PDF bras sensible déclaré', cfg: { racquetId: 'wilson-blade-98-16x19-v9', mainStringId: 'luxilon-alu-power' }, opt: { armSensitive: true } },
      { name: 'PDF sans analyse avancée (raquette et cordage introuvables)', cfg: { racquetId: 'raquette-inconnue', mainStringId: 'cordage-inconnu' } },
      { name: 'PDF hybride, bras sensible déclaré (alerte par l\'indice du montage)', cfg: { racquetId: 'babolat-pure-aero-98', mainStringId: 'luxilon-alu-power', crossStringId: 'solinco-tour-bite', mainTension: 20, crossTension: 18, rcsScore: 31.5 }, opt: { armSensitive: true } },
    ];
    const digits = (t: string): number[] => [...t.matchAll(/\d+/g)].map((m) => Number(m[0]));
    const CLAIM21B = /prot[eéè]g|pr[eé]ven|soulag|gu[eé]ri|therap|thérap|m[eé]dical|traitement|sans (?:aucun )?(?:danger|risque)|\bid[eé]al|parfait|optimal|\bsûr\b|garanti/i;
    const lineFindings = (name: string, lines: string[], declared: boolean): string[] => {
      const hits = lines.map((l, i) => [l, i] as const).filter(([l]) => typeof l === 'string' && l.startsWith('- Alerte bras :'));
      if (hits.length === 0) return [`${name} : la ligne sur les seuils d'alerte bras est absente du texte imprimé`];
      const found: string[] = [];
      if (hits.length > 1) found.push(`${name} : la ligne sur les seuils d'alerte bras est imprimée ${hits.length} fois`);
      const [line, at] = hits[0];
      const title = lines.indexOf('METHODOLOGIE');
      const foot = lines.findIndex((l) => l.startsWith('Genere par Tennis String Advisor'));
      if (title < 0 || foot < 0 || !(title < at && at < foot)) found.push(`${name} : la ligne sort de la méthodologie (titre ${title}, ligne ${at}, pied de page ${foot})`);
      const want = declared ? [N, S, S] : [N, S, N, S];
      const got = digits(line);
      if (got.length !== want.length || got.some((v, i) => v !== want[i])) found.push(`${name} : seuils cités ${got.join(', ') || 'aucun'} au lieu de ${want.join(', ')} (le moteur alerte dès ${N} en standard, dès ${S} pour un bras sensible)`);
      const profile = declared ? new RegExp(`bras sensible déclaré : seuil ${S} appliqué`) : new RegExp(`applique le seuil ${N}\\b`);
      if (!profile.test(line)) found.push(`${name} : la ligne annonce un autre profil que celui appliqué (${declared ? 'bras sensible déclaré' : 'standard'})`);
      if (!/professionnel de santé/i.test(line)) found.push(`${name} : la ligne ne renvoie plus vers un professionnel de santé si la douleur persiste`);
      const claim = CLAIM21B.exec(line);
      if (claim) found.push(`${name} : allégation « ${claim[0]} » dans la ligne (charte F7 : aucun absolu, aucune promesse de protection)`);
      return found;
    };
    type Run = { c: PdfCase; data: any; lines: string[] };
    const runAll = async (exportFn: (d: unknown) => Promise<void>, mutateData?: (c: PdfCase, d: any) => void): Promise<Run[]> => {
      const out: Run[] = [];
      for (const c of CASES) {
        const data: any = buildConfigurationPdfData({ ...BASE_CFG, ...c.cfg } as never, c.opt);
        mutateData?.(c, data);
        out.push({ c, data, lines: await printPdf(exportFn, data) });
      }
      return out;
    };
    const runFindings = (runs: Run[]): string[] => runs.flatMap((r) => lineFindings(r.c.name, r.lines, r.c.opt?.armSensitive === true));

    const real = await runAll(exportConfigurationPdf as (d: unknown) => Promise<void>);
    for (const r of real) {
      const want = { standardAt: N, sensitiveAt: S, sensitiveApplied: r.c.opt?.armSensitive === true };
      if (JSON.stringify(r.data.armAlert) !== JSON.stringify(want)) fail(`PDF : ${r.c.name} : armAlert = ${JSON.stringify(r.data.armAlert)} au lieu de ${JSON.stringify(want)}`);
    }
    runFindings(real).forEach((i) => fail(`PDF : ${i}`));
    const analysed = real.filter((r) => r.data.advanced !== undefined).length;
    if (analysed !== 4 || real.length !== 5) fail(`PDF : ${analysed} PDF avec analyse avancée sur ${real.length} (attendu 4 sur 5) : le cas « sans analyse » ne l'est plus, relire le contrôle`);

    // --- (d) l'indice imprimé est celui du moteur, que la page affiche et que l'alerte cite (22/10/2026) ---------------------------
    type Setup = (i: unknown) => { rcs: number; hybrid: { mains: number; crosses: number; note: string } | null };
    const setupIndex = engineModule.setupFirmnessIndex as Setup | undefined;
    const { recomputeRcs } = await import('../src/lib/pdf-configuration-data');
    // L'indice que la page affiche pour la configuration du cas : `setupFirmnessIndex` sur les mêmes entrées.
    const shownIndex = (c: PdfCase): ReturnType<Setup> | null => {
      const cfg = { ...BASE_CFG, ...c.cfg } as Record<string, any>;
      const racquet = racquetsDatabase.find((x) => x.id === cfg.racquetId);
      const main = stringsModule.getStringById(cfg.mainStringId);
      if (!setupIndex || !racquet || !main) return null;
      return setupIndex({
        racquetStiffness: effectiveRacquetRA(racquet),
        mainStringStiffness: main.stiffness,
        crossStringStiffness: stringsModule.getStringById(cfg.crossStringId)?.stiffness,
        mainTension: cfg.mainTension,
        crossTension: cfg.crossTension,
      });
    };
    if (!setupIndex) fail('PDF : setupFirmnessIndex (indice du montage) n\'est plus exporté par advanced-rcs.ts');
    const indexFindings = (r: Run): string[] => {
      const want = shownIndex(r.c);
      const a = r.data.advanced;
      if (!want || !a) return [];
      const out: string[] = [];
      const name = r.c.name;
      if (a.firmnessIndex !== want.rcs) out.push(`${name} : indice ${a.firmnessIndex} dans les données du PDF, ${want.rcs} pour le moteur (indice affiché par la page)`);
      const idx = r.lines.map((l, i) => [l, i] as const).filter(([l]) => l.startsWith('Indice de fermete : '));
      if (idx.length !== 1 || idx[0][0] !== `Indice de fermete : ${want.rcs}`) out.push(`${name} : indice imprimé « ${idx.map(([l]) => l).join(' | ') || 'absent'} » au lieu de « Indice de fermete : ${want.rcs} » (indice du moteur)`);
      if (want.hybrid) {
        if (a.hybridNote !== want.hybrid.note) out.push(`${name} : mention de l'hybride « ${a.hybridNote ?? 'absente'} » dans les données au lieu de celle du moteur « ${want.hybrid.note} »`);
        else if (idx.length === 1 && r.lines[idx[0][1] + 1] !== want.hybrid.note) out.push(`${name} : mention de l'hybride non imprimée sous l'indice (ligne suivante : « ${r.lines[idx[0][1] + 1] ?? 'rien'} »)`);
      } else if (a.hybridNote !== undefined || r.lines.some((l) => l.startsWith('estimation pour un hybride'))) {
        out.push(`${name} : mention d'hybride pour un montage sans travers`);
      }
      for (const w of a.warnings as string[]) {
        const m = /^Alerte bras : indice (\d+),/.exec(w);
        if (m && Number(m[1]) !== want.rcs) out.push(`${name} : l'alerte cite l'indice ${m[1]}, le PDF imprime ${want.rcs}`);
      }
      const rec = recomputeRcs({ ...BASE_CFG, ...r.c.cfg } as never);
      if (rec !== want.rcs) out.push(`${name} : recomputeRcs vaut ${rec}, le moteur ${want.rcs}`);
      return out;
    };
    real.forEach((r) => indexFindings(r).forEach((i) => fail(`PDF : ${i}`)));
    const hybridAlert = real.find((r) => r.c.name.startsWith('PDF hybride, bras sensible'));
    const hybridWant = hybridAlert ? shownIndex(hybridAlert.c) : null;
    if (!hybridAlert || !hybridWant || !(hybridAlert.data.advanced?.warnings as string[] | undefined)?.some((w) => w.startsWith(`Alerte bras : indice ${hybridWant.rcs},`)) || !hybridWant.hybrid?.note.includes(' entre ')) {
      fail('PDF : le cas « hybride, bras sensible déclaré » n\'a pas l\'alerte que l\'indice du montage déclenche (indice 32, le 60/40 seul donnerait 31) ou sa mention « entre » : indice du moteur, ou contrôle, à relire');
    }

    // --- Tests négatifs et témoins positifs -----------------------------------------------------------------------------
    let detected = 0;
    let accepted = 0;
    const expectDetected = (name: string, issues: string[], needle: string): void => {
      if (issues.some((i) => i.includes(needle))) detected++;
      else fail(`PDF : garde-fou muet sur « ${name} » (motif attendu « ${needle} »${issues.length ? `, trouvé : ${issues[0].slice(0, 90)}` : ''})`);
    };
    // 1. texte imprimé altéré (défauts de l'exporteur simulés sur le texte)
    const std = real[0];
    const printedMuts: Array<[string, (l: string[]) => string[], string]> = [
      ['ligne retirée du texte imprimé', (l) => l.filter((x) => !x.startsWith('- Alerte bras :')), 'absente'],
      ['ligne imprimée deux fois', (l) => l.flatMap((x) => (x.startsWith('- Alerte bras :') ? [x, x] : [x])), '2 fois'],
      ['ligne placée avant la méthodologie', (l) => { const i = l.findIndex((x) => x.startsWith('- Alerte bras :')); const rest = l.filter((_, k) => k !== i); rest.splice(rest.indexOf('METHODOLOGIE'), 0, l[i]); return rest; }, 'sort de la méthodologie'],
      ['seuil standard faux dans le texte (36)', (l) => l.map((x) => (x.startsWith('- Alerte bras :') ? x.replace(`dès l'indice ${N}`, `dès l'indice ${N + 1}`) : x)), 'seuils cités'],
      ['seuil bras sensible faux dans le texte (30)', (l) => l.map((x) => (x.startsWith('- Alerte bras :') ? x.replace(`dès ${S} si`, `dès ${S - 2} si`) : x)), 'seuils cités'],
      ['renvoi vers un professionnel de santé retiré', (l) => l.map((x) => (x.startsWith('- Alerte bras :') ? x.split('professionnel de santé').join('spécialiste') : x)), 'professionnel de santé'],
      ['promesse de protection ajoutée', (l) => l.map((x) => (x.startsWith('- Alerte bras :') ? x.replace('reportez-vous', 'protégez votre bras en vous reportant') : x)), 'allégation'],
    ];
    if (!std.lines.some((x) => x.startsWith('- Alerte bras :'))) fail(`PDF : prémisse des tests négatifs sur le texte imprimé fausse (la ligne est absente du PDF de référence « ${std.c.name} »)`);
    else for (const [name, mut, needle] of printedMuts) expectDetected(name, lineFindings(std.c.name, mut(std.lines), false), needle);
    // 2. données altérées passées à l'exporteur réel (défauts du constructeur simulés)
    const dataMuts: Array<[string, (c: PdfCase, d: any) => void, string]> = [
      ['seuil standard faux dans les données', (_c, d) => { d.armAlert.standardAt = N + 1; }, 'seuils cités'],
      ['seuil bras sensible faux dans les données', (_c, d) => { d.armAlert.sensitiveAt = S - 2; }, 'seuils cités'],
      ['profil appliqué faux dans les données (déclaré annoncé, standard appliqué)', (c, d) => { if (c.opt?.armSensitive !== true) d.armAlert.sensitiveApplied = true; }, 'autre profil'],
      ['profil appliqué faux dans les données (standard annoncé, déclaré appliqué)', (c, d) => { if (c.opt?.armSensitive === true) d.armAlert.sensitiveApplied = false; }, 'autre profil'],
    ];
    if (real.some((r) => !r.data.armAlert)) fail('PDF : prémisse des tests négatifs sur les données fausse (armAlert absent des données du constructeur)');
    else for (const [name, mut, needle] of dataMuts) expectDetected(name, runFindings(await runAll(exportConfigurationPdf as (d: unknown) => Promise<void>, mut)), needle);
    // 3. source d'impression altérée (module rechargé depuis le texte)
    const exportMuts: Array<[string, string, string, string]> = [
      ['ligne retirée de la méthodologie (source)', '    armAlertLine(data.armAlert),\n', '', 'absente'],
      ['seuil recopié à la main dans l\'exporteur', 'dès l\'indice ${a.standardAt}', 'dès l\'indice 36', 'seuils cités'],
      ['renvoi vers un professionnel de santé retiré (source)', ' et consultez un professionnel de santé si la douleur persiste.', '.', 'professionnel de santé'],
      ['promesse de protection (source)', 'reportez-vous au seuil', 'protégez votre bras au seuil', 'allégation'],
      ['profil annoncé inversé (source)', 'return a.sensitiveApplied\n    ?', 'return !a.sensitiveApplied\n    ?', 'autre profil'],
    ];
    for (const [name, find, replace, needle] of exportMuts) {
      const mutated = replaceFirst(exportSrc, find, replace);
      if (mutated === null) {
        fail(`PDF : prémisse du test négatif « ${name} » fausse (motif absent de src/lib/pdf-export.ts)`);
        continue;
      }
      let issues: string[] = [];
      try {
        issues = runFindings(await runAll(loadModule(mutated).exportConfigurationPdf as (d: unknown) => Promise<void>));
      } catch (e) {
        fail(`PDF : exporteur altéré « ${name} » illisible (${(e as Error).message}) : le test doit échouer bruyamment`);
        continue;
      }
      expectDetected(name, issues, needle);
    }
    const harmless = replaceFirst(exportSrc, 'reportez-vous au seuil', 'référez-vous au seuil');
    if (harmless === null) fail('PDF : prémisse du témoin positif « exporteur reformulé » fausse (motif absent de src/lib/pdf-export.ts)');
    else {
      const found = runFindings(await runAll(loadModule(harmless).exportConfigurationPdf as (d: unknown) => Promise<void>));
      if (found.length > 0) fail(`PDF : témoin positif « exporteur reformulé » rejeté à tort : ${found.join(' ; ')}`);
      else accepted++;
    }
    // 4. constructeur de données altéré (analyse syntaxique)
    const builderMuts: Array<[string, string, string, string]> = [
      ['seuil standard recopié à la main', 'standardAt: ARM_ALERT_RCS.standard,', `standardAt: ${N},`, 'recopié à la main'],
      ['seuil bras sensible recopié à la main', 'sensitiveAt: ARM_ALERT_RCS.sensitive,', `sensitiveAt: ${S},`, 'recopié à la main'],
      ['profil annoncé indépendant du profil du moteur', 'sensitiveApplied: options.armSensitive === true,', 'sensitiveApplied: false,', 'même condition'],
      ['import de la paire retiré', '  ARM_ALERT_RCS,\n  calculateAdvancedRcs,', '  calculateAdvancedRcs,', 'pas importé'],
    ];
    for (const [name, find, replace, needle] of builderMuts) {
      const mutated = replaceFirst(dataSrc, find, replace);
      if (mutated === null) fail(`PDF : prémisse du test négatif « ${name} » fausse (motif absent de src/lib/pdf-configuration-data.ts)`);
      else expectDetected(name, builderFindings(mutated), needle);
    }
    const noArmAlert = dataSrc.replace(/\n {4}armAlert: \{[\s\S]*?\n {4}\},\n/, '\n');
    if (noArmAlert === dataSrc) fail('PDF : prémisse du test négatif « armAlert retiré des données » fausse (bloc introuvable)');
    else expectDetected('armAlert retiré des données', builderFindings(noArmAlert), 'armAlert absent');
    const reformatted = dataSrc.replace('sensitiveApplied: options.armSensitive === true,', 'sensitiveApplied: options.armSensitive === true, // profil réellement appliqué');
    if (builderFindings(reformatted).length > 0) fail(`PDF : témoin positif « commentaire ajouté dans le constructeur » rejeté à tort : ${builderFindings(reformatted).join(' ; ')}`);
    else accepted++;
    // 4 bis. indice et mention imprimés (22/10/2026) : données altérées, puis source d'impression altérée
    const idxDataMuts: Array<[string, (c: PdfCase, d: any) => void, string]> = [
      ['indice des données décalé d\'un point (hybride)', (c, d) => { if (d.advanced && c.cfg.crossStringId) d.advanced.firmnessIndex -= 1; }, 'pour le moteur'],
      ['mention de l\'hybride retirée des données', (_c, d) => { if (d.advanced) delete d.advanced.hybridNote; }, 'mention de l\'hybride'],
      ['mention d\'hybride sur un montage sans travers', (c, d) => { if (d.advanced && !c.cfg.crossStringId) d.advanced.hybridNote = 'estimation pour un hybride, entre 30 et 34'; }, 'sans travers'],
    ];
    for (const [name, mut, needle] of idxDataMuts) expectDetected(name, (await runAll(exportConfigurationPdf as (d: unknown) => Promise<void>, mut)).flatMap(indexFindings), needle);
    const idxExportMuts: Array<[string, string, string, string]> = [
      ['exporteur : indice enregistré imprimé au lieu de l\'indice du moteur', 'L.text(`Indice de fermete : ${a.firmnessIndex}`', 'L.text(`Indice de fermete : ${data.rcsScore}`', 'indice imprimé'],
      ['exporteur : mention de l\'hybride non imprimée', 'for (const line of noteLines) {', 'for (const line of [] as string[]) {', 'non imprimée'],
    ];
    for (const [name, find, replace, needle] of idxExportMuts) {
      const mutated = replaceFirst(exportSrc, find, replace);
      if (mutated === null) {
        fail(`PDF : prémisse du test négatif « ${name} » fausse (motif absent de src/lib/pdf-export.ts)`);
        continue;
      }
      expectDetected(name, (await runAll(loadModule(mutated).exportConfigurationPdf as (d: unknown) => Promise<void>)).flatMap(indexFindings), needle);
    }
    // 5. constantes et moteur (modules rechargés depuis le texte)
    const engineDeps = { '@/data/strings-database': stringsModule };
    const loadEngine = (src: string): { calc: Calc; consts: { sensitive?: number; standard?: number } | undefined } => {
      const m = loadModule(src, engineDeps);
      return { calc: m.calculateAdvancedRcs as Calc, consts: m.ARM_ALERT_RCS };
    };
    try {
      const copy = loadEngine(engineSrc);
      const issues = constantsIssues(copy.calc, copy.consts);
      if (issues.length > 0) fail(`PDF : le moteur rechargé depuis son source (instrument des tests négatifs) ne passe pas son propre contrôle : ${issues.join(' ; ')}`);
    } catch (e) {
      fail(`PDF : moteur illisible pour les tests négatifs (${(e as Error).message})`);
    }
    const CONSTS = 'export const ARM_ALERT_RCS = { sensitive: 32, standard: 35 } as const;';
    const engineMuts: Array<[string, string, string]> = [
      ['constante « bras sensible » changée (31) sans toucher au moteur', CONSTS, 'export const ARM_ALERT_RCS = { sensitive: 31, standard: 35 } as const;'],
      ['constante « standard » changée (36) sans toucher au moteur', CONSTS, 'export const ARM_ALERT_RCS = { sensitive: 32, standard: 36 } as const;'],
      ['seuil du moteur « bras sensible » décalé (33) sans toucher à la constante', '? rcs >= 32 ||', '? rcs >= 33 ||'],
      ['seuil du moteur standard décalé (34) sans toucher à la constante', ': rcs >= 35 ||', ': rcs >= 34 ||'],
    ];
    for (const [name, find, replace] of engineMuts) {
      const mutated = replaceFirst(engineSrc, find, replace);
      if (mutated === null) {
        fail(`PDF : prémisse du test négatif « ${name} » fausse (motif absent de src/lib/advanced-rcs.ts)`);
        continue;
      }
      try {
        const m = loadEngine(mutated);
        expectDetected(name, constantsIssues(m.calc, m.consts), 'constantes : ARM_ALERT_RCS');
      } catch (e) {
        fail(`PDF : moteur altéré « ${name} » illisible (${(e as Error).message}) : le test doit échouer bruyamment`);
      }
    }
    const engineWitness = replaceFirst(engineSrc, 'MIROIR EXPORTÉ, pas la source', 'MIROIR EXPORTÉ (relu), pas la source');
    if (engineWitness === null) fail('PDF : prémisse du témoin positif « commentaire du moteur reformulé » fausse (motif absent de src/lib/advanced-rcs.ts)');
    else {
      const m = loadEngine(engineWitness);
      const found = constantsIssues(m.calc, m.consts);
      if (found.length > 0) fail(`PDF : témoin positif « commentaire du moteur reformulé » rejeté à tort : ${found.join(' ; ')}`);
      else accepted++;
    }

    if (failures.length === before21b) {
      ok(
        `PDF : la méthodologie imprimée cite les deux seuils d'alerte bras (${N} en standard, ${S} pour un bras sensible), lus dans le moteur : ARM_ALERT_RCS = seuils sondés dans calculateAdvancedRcs, ` +
          `lus par le constructeur de données sans aucun littéral ; ligne imprimée une fois, dans la méthodologie, dans les ${real.length} PDF vérifiés ` +
          `(${real.map((r) => r.c.name).join(', ')}), avec le profil réellement appliqué et le renvoi vers un professionnel de santé ; ` +
          `indice imprimé = indice du moteur = indice cité par l'alerte = recomputeRcs, mention d'estimation imprimée sous l'indice des hybrides et seulement eux ; ` +
          `${detected} tests négatifs détectés, ${accepted} témoins positifs acceptés`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 21 quater. CONFIGURATEUR EN — douleur déclarée : la tension affichée est CALCULÉE, sous le seuil d'alerte bras sensible (23/10/2026)
// Décision (avis d'Opus 5.5 du 23/10/2026, point 5 ; tsa-acquisition, propriétaire de public/en) : le conseil « 21-23 kg »
// pour un bras sensible, sans aucune source, est retiré. La page dit à la place jusqu'à quelle tension N l'indice du montage
// qu'elle propose reste sous le seuil d'alerte bras sensible, et montre l'indice à cette tension.
// (a) Le bloc <seuil-bras-sensible> de public/en/configurator.html, évalué TEL QUEL avec le moteur statique EN, donne sur
//     toutes les raquettes à RA connu × tous les cordages du catalogue (catalog.json, buildCatalog) la même N qu'un recalcul
//     indépendant par calculateRCS (src/data), sur la plage du curseur de tension de rcs-calculator.html : indice à N sous le
//     seuil, à N + un pas au seuil ou au-dessus ; « toute la plage » et « aucune tension » exacts ; la valeur et la phrase
//     affichées portent les indices du recalcul ; seuil = ARM_ALERT_SENSITIVE (sondé dans calculateAdvancedRcs) = HEALTH_ALERT_SENSITIVE_RCS du moteur EN ;
//     cordage proposé = le moins rigide du catalogue, sa rigidité de fiche citée (le statut « mesure TWU » n'est pas lisible
//     par une surface : provenance et table par jauge leur sont fermées par les garde-fous de tsa-core).
// (b) Les montages que la branche peut proposer (raquettes de RA ≤ son plafond × cordage le moins rigide) passent sous le seuil.
// (c) Plus aucune tension fixe pour une douleur déclarée : la branche n'écrit aucune tension en dur et ne trie plus par note
//     de confort ; aucune chaîne des pages EN hors blog ni de public/js ne met une tension fixe à côté d'un bras sensible ou
//     d'une douleur.
{
  const beforeQ21 = failures.length;
  const PAGEQ21 = 'public/en/configurator.html';
  const ENGINEQ21 = 'public/js/rcs-calculator-en.js';
  const CALCQ21 = 'public/en/rcs-calculator.html';
  let pageQ21 = '';
  let engineSrcQ21 = '';
  let calcHtmlQ21 = '';
  try {
    pageQ21 = readFileSync(PAGEQ21, 'utf8').replace(/\r\n/g, '\n');
    engineSrcQ21 = readFileSync(ENGINEQ21, 'utf8').replace(/\r\n/g, '\n');
    calcHtmlQ21 = readFileSync(CALCQ21, 'utf8');
  } catch (e) {
    fail(`seuil bras sensible (configurateur EN) : fichier illisible (${(e as Error).message})`);
  }
  if (pageQ21 && engineSrcQ21 && calcHtmlQ21) {
    const loadEngineQ21 = (src: string): any =>
      new Function('window', 'document', `${src}; return typeof RCS !== 'undefined' ? RCS : window.RCS;`)({}, { addEventListener() {} });
    const OPENQ21 = '// <seuil-bras-sensible>';
    const CLOSEQ21 = '// </seuil-bras-sensible>';
    const blockOfQ21 = (html: string): string | null => {
      const i = html.indexOf(OPENQ21);
      const j = html.indexOf(CLOSEQ21);
      if (i < 0 || j < i || html.indexOf(OPENQ21, i + 1) >= 0) return null;
      return html.slice(i, j);
    };
    const BRANCH_OPEN = "if (currentSelections.physical === 'bras' || currentSelections.physical === 'epaule') {";
    const branchOfQ21 = (html: string): string | null => {
      const i = html.indexOf(BRANCH_OPEN);
      const j = html.indexOf('// PRIORITY 3', i);
      return i < 0 || j < 0 ? null : html.slice(i, j);
    };
    const catalogQ21: any = buildCatalog(racquetsDatabase, stringsDatabase);
    const racqQ21: any[] = catalogQ21.racquets.filter((r: any) => typeof r.stiffness === 'number');
    const strQ21: any[] = catalogQ21.strings.filter((s: any) => typeof s.stiffness === 'number');
    const SQ21 = ARM_ALERT_SENSITIVE;
    const sliderQ21 = /id="tensionSlider"[^>]*min="([\d.]+)"[^>]*max="([\d.]+)"[^>]*step="([\d.]+)"/.exec(calcHtmlQ21);
    const RANGEQ21 = sliderQ21 ? { min: Number(sliderQ21[1]), max: Number(sliderQ21[2]), step: Number(sliderQ21[3]) } : null;
    if (!RANGEQ21) fail(`${CALCQ21} : curseur de tension introuvable, relire le contrôle 21 quater`);
    const tallyQ21 = { combos: 0, mid: 0, whole: 0, none: 0, proposals: 0 };

    // (a) et (b) : le bloc de la page contre le recalcul indépendant ; renvoie les écarts (vide = conforme).
    const checkPageQ21 = (html: string, engine: any, count = false): string[] => {
      const issues: string[] = [];
      const add = (m: string) => { if (issues.length < 12) issues.push(m); };
      const block = blockOfQ21(html);
      if (block === null) return ['bloc <seuil-bras-sensible> absent ou en double dans la page'];
      let api: any;
      try {
        api = new Function(`${block}\nreturn { SENSITIVE_TENSION_RANGE, pickLowestStiffnessString, sensitiveTensionLimit, sensitiveTension };`)();
      } catch (e) {
        return [`bloc illisible (${(e as Error).message})`];
      }
      if (engine.HEALTH_ALERT_SENSITIVE_RCS !== SQ21) add(`seuil : HEALTH_ALERT_SENSITIVE_RCS du moteur EN (${engine.HEALTH_ALERT_SENSITIVE_RCS}) ≠ seuil bras sensible sondé dans calculateAdvancedRcs (${SQ21})`);
      const R = api.SENSITIVE_TENSION_RANGE;
      if (!RANGEQ21 || R.min !== RANGEQ21.min || R.max !== RANGEQ21.max || R.step !== RANGEQ21.step) {
        add(`plage : la page raisonne sur ${JSON.stringify(R)}, le curseur du calculateur RCS sur ${JSON.stringify(RANGEQ21)}`);
      }
      const ref = RANGEQ21 ?? R;
      const steps = Math.round((ref.max - ref.min) / ref.step);
      for (const r of racqQ21) {
        for (const s of strQ21) {
          const idx = (t: number) => calculateRCS(r.stiffness, s.stiffness, t);
          let refN: number | null = null;
          let blocked = false;
          let prev = -Infinity;
          for (let i = 0; i <= steps; i++) {
            const t = ref.min + i * ref.step;
            const x = idx(t);
            if (x < prev) add(`recalcul : indice non monotone en tension (${r.id} × ${s.id} à ${t} kg)`);
            prev = x;
            if (!blocked && x < SQ21) refN = t;
            else blocked = true;
          }
          const L = api.sensitiveTensionLimit(engine, r.stiffness, s.stiffness);
          if (count) tallyQ21.combos++;
          if (L.n !== refN) { add(`tension : ${r.id} × ${s.id}, la page dit N = ${L.n}, le recalcul N = ${refN}`); continue; }
          if (L.threshold !== SQ21) add(`seuil : la page compare à ${L.threshold} au lieu de ${SQ21}`);
          const out = api.sensitiveTension(engine, r.stiffness, s.stiffness);
          const shown = engine.calculate(r.stiffness, s.stiffness, out.numValue).rcs;
          if (shown !== idx(out.numValue)) add(`indice montré : ${shown} au lieu de ${idx(out.numValue)} (${r.id} × ${s.id} à ${out.numValue} kg)`);
          if (!String(out.title).includes(`(${SQ21})`) || !String(out.reason).includes(`(index ${SQ21})`)) add(`texte : le seuil ${SQ21} n'est pas cité (${r.id} × ${s.id})`);
          if (refN === null) {
            if (count) tallyQ21.none++;
            if (!L.none || idx(ref.min) < SQ21) add(`aucune tension : cas mal établi (${r.id} × ${s.id})`);
            if (out.value !== `None from ${ref.min} to ${ref.max} kg` || out.numValue !== ref.min || !out.reason.includes(`it is ${idx(ref.min)} at ${ref.min} kg`)) {
              add(`texte « aucune tension » faux : ${r.id} × ${s.id} → « ${out.value} »`);
            }
          } else if (refN === ref.max) {
            if (count) tallyQ21.whole++;
            if (!L.whole || idx(ref.max) >= SQ21) add(`toute la plage : cas mal établi (${r.id} × ${s.id})`);
            if (out.value !== `Whole range (${ref.min}-${ref.max} kg)` || out.numValue !== ref.max || !out.reason.includes(`${idx(ref.max)} at ${ref.max} kg`)) {
              add(`texte « toute la plage » faux : ${r.id} × ${s.id} → « ${out.value} »`);
            }
          } else {
            if (count) tallyQ21.mid++;
            if (idx(refN) >= SQ21) add(`à N = ${refN} kg l'indice ${idx(refN)} n'est pas sous ${SQ21} (${r.id} × ${s.id})`);
            if (idx(refN + ref.step) < SQ21) add(`à N + ${ref.step} kg l'indice reste sous ${SQ21} (${r.id} × ${s.id})`);
            const want = `${idx(refN)} at ${refN} kg, ${idx(refN + ref.step)} at ${refN + ref.step} kg`;
            if (out.value !== `Up to ${refN} kg` || out.numValue !== refN || !out.reason.includes(want)) {
              add(`texte « jusqu'à N kg » faux : ${r.id} × ${s.id} → « ${out.value} » (attendu « Up to ${refN} kg » et « ${want} »)`);
            }
          }
        }
      }
      // Cordage proposé : le moins rigide du catalogue.
      const lowest = api.pickLowestStiffnessString(catalogQ21.strings);
      const minStiff = Math.min(...strQ21.map((s) => s.stiffness));
      if (!lowest || lowest.stiffness !== minStiff) add(`cordage proposé : ${lowest ? `${lowest.id} (${lowest.stiffness} lb/in)` : 'aucun'} au lieu du moins rigide (${minStiff} lb/in)`);
      // (b) Ce que la branche peut proposer : raquettes de RA ≤ son plafond × cordage le moins rigide, sous le seuil.
      const branch = branchOfQ21(html);
      const cap = branch ? /maxStiffness:\s*(\d+)/.exec(branch) : null;
      if (!cap) add('branche de la douleur déclarée : plafond de RA introuvable, relire le contrôle 21 quater');
      else if (lowest) {
        for (const r of racqQ21.filter((x) => x.stiffness <= Number(cap[1]))) {
          if (count) tallyQ21.proposals++;
          if (api.sensitiveTensionLimit(engine, r.stiffness, lowest.stiffness).none) add(`proposition : ${r.id} × ${lowest.id} ne passe sous ${SQ21} à aucune tension`);
        }
      }
      return issues;
    };

    // (c1) La branche de la douleur déclarée : contrainte de seuil, aucune tension en dur, plus de tri par note de confort.
    const branchIssuesQ21 = (html: string): string[] => {
      const b = branchOfQ21(html);
      if (b === null) return ['branche : la branche de la douleur déclarée est introuvable, relire le contrôle 21 quater'];
      const issues: string[] = [];
      if (!b.includes("rcsProfile = 'tennis_elbow'")) issues.push("branche : le profil tennis_elbow (seuil 32) n'est plus posé");
      if (!/tension = sensitiveTension\(RCS, racquet\.stiffness, string\.stiffness\)/.test(b)) issues.push('branche : la tension ne vient plus du calcul sensitiveTension');
      if (/if \([^\n]*\)\s*\{\s*tension = sensitiveTension\(/.test(b)) issues.push('branche : tension calculée sous condition, la tension héritée du niveau peut rester affichée');
      if (!/pickLowestStiffnessString\(stringsDB\)/.test(b)) issues.push("branche : le cordage n'est plus le moins rigide du catalogue");
      if (/tension\s*=\s*\{/.test(b) || /numValue:\s*\d/.test(b) || /\d{2}(?:\.\d)?\s*(?:-|–|to)\s*\d{2}(?:\.\d)?\s*kg/.test(b)) issues.push('branche : tension fixe écrite en dur');
      if (/pickBestString\(/.test(b)) issues.push('branche : cordage choisi par pickBestString (tri par note, non mesurée)');
      if (!b.includes("'Lowest stiffness in our catalogue: ' + lowest.stiffness + ' lb/in, the value of its string page")) {
        issues.push('branche : la raison du cordage ne cite plus sa rigidité de fiche');
      }
      if (/TWU measurement/.test(b)) issues.push('branche : « mesure TWU » affirmé sans source lisible par la page');
      return issues;
    };

    // (c2) Aucune chaîne des pages EN hors blog ni de public/js ne met une tension fixe (deux chiffres, kg ou lb) à côté d'un bras
    //      sensible ou d'une douleur. Une tension calculée (${…} kg) ou un levier (« 1 kg ») ne sont pas des tensions fixes.
    const FIXED_KG = /(?<![\w${}.])\d{2}(?:[.,]\d)?(?:\s*(?:-|–|to|à)\s*\d{2}(?:[.,]\d)?)?\s*(?:kg|lbs?)\b/;
    const ARMQ21 = /sensitive[- ](?:arm|shoulder)|tennis[ _]elbow|elbow pain|painful arm|arm pain|shoulder pain|bras sensible|douleur|coude/i;
    const JS_STRINGS = /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g;
    const noCommentsQ21 = (js: string) => js.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"\\\w])\/\/[^\n]*/g, '$1');
    const jsStringsQ21 = (js: string): string[] => [...noCommentsQ21(js).matchAll(JS_STRINGS)].map((m) => m[0]);
    const chunksOfQ21 = (file: string, src: string): string[] => {
      if (file.endsWith('.js')) return jsStringsQ21(src);
      const scripts = [...src.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
      const rest = src
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ');
      return [
        ...scripts.flatMap(jsStringsQ21),
        ...[...rest.matchAll(/>([^<>]+)</g)].map((m) => m[1]),
        ...[...rest.matchAll(/"[^"\n]*"/g)].map((m) => m[0]),
      ];
    };
    const scanFixedQ21 = (file: string, src: string): string[] =>
      chunksOfQ21(file, src)
        .filter((c) => FIXED_KG.test(c) && ARMQ21.test(c))
        .map((c) => `${file} : tension fixe à côté d'un bras sensible ou d'une douleur (« ${c.replace(/\s+/g, ' ').slice(0, 90)} »)`);
    const SCANQ21 = [
      ...readdirSync('public/en').filter((f) => f.endsWith('.html')).map((f) => `public/en/${f}`),
      ...readdirSync('public/js').filter((f) => f.endsWith('.js')).map((f) => `public/js/${f}`),
    ];

    const engineQ21 = loadEngineQ21(engineSrcQ21);
    const realIssues = checkPageQ21(pageQ21, engineQ21, true);
    realIssues.forEach((i) => fail(`${PAGEQ21} : ${i}`));
    branchIssuesQ21(pageQ21).forEach((i) => fail(`${PAGEQ21} : ${i}`));
    let scanned = 0;
    for (const f of SCANQ21) {
      scanned++;
      scanFixedQ21(f, readFileSync(f, 'utf8')).forEach((i) => fail(i));
    }

    // Tests négatifs : chaque altération doit être détectée ; témoins positifs : chaque variante neutre doit être acceptée.
    const replaceOnceQ21 = (s: string, find: string, rep: string): string | null => (s.includes(find) ? s.replace(find, () => rep) : null);
    let detectedQ21 = 0;
    let acceptedQ21 = 0;
    const PAGE_NEG: Array<[string, string, string]> = [
      ['N d\'un pas trop haut (≤ au lieu de <)', 'if (engine.calculate(ra, stiffness, t).rcs < threshold) n = t;', 'if (engine.calculate(ra, stiffness, t).rcs <= threshold) n = t;'],
      ['seuil standard (35) au lieu du seuil bras sensible', 'const threshold = engine.HEALTH_ALERT_SENSITIVE_RCS;', 'const threshold = engine.HEALTH_ALERT_RCS;'],
      ['plage tronquée à 28 kg', 'const SENSITIVE_TENSION_RANGE = { min: 18, max: 30, step: 0.5 };', 'const SENSITIVE_TENSION_RANGE = { min: 18, max: 28, step: 0.5 };'],
      ['phrase : indice cité à N + 1 kg', "L.indexNext + ' at ' + (L.n + r.step) + ' kg.'", "L.indexNext + ' at ' + (L.n + 1) + ' kg.'"],
      ['cordage le plus RIGIDE au lieu du moins rigide', 'if (!best || s.stiffness < best.stiffness) best = s;', 'if (!best || s.stiffness > best.stiffness) best = s;'],
      ['indice montré à la tension minimale dans le cas « jusqu\'à N »', "return { title: title, value: 'Up to ' + L.n + ' kg', numValue: L.n,", "return { title: title, value: 'Up to ' + L.n + ' kg', numValue: r.min,"],
      ['marqueur du bloc retiré', OPENQ21, '// seuil'],
    ];
    const BRANCH_NEG: Array<[string, string, string]> = [
      ['tension fixe « 21-23 kg » rétablie', 'tension = sensitiveTension(RCS, racquet.stiffness, string.stiffness);', "tension = { value: '21-23 kg', numValue: 22, reason: 'Lower tension.' };"],
      ['cordage rechoisi par note de confort', 'const lowest = pickLowestStiffnessString(stringsDB);', "const lowest = pickBestString({ types: ['Multifilament'], preferComfort: true });"],
      ['profil tennis_elbow retiré', "rcsProfile = 'tennis_elbow';", "rcsProfile = 'club';"],
      ['tension calculée sous condition (repli sur la tension du niveau)', 'tension = sensitiveTension(RCS, racquet.stiffness, string.stiffness);', 'if (racquet && string && racquet.stiffness !== null && string.stiffness !== null) {\n          tension = sensitiveTension(RCS, racquet.stiffness, string.stiffness);\n        }'],
      ['raison du cordage sans sa rigidité', "'Lowest stiffness in our catalogue: ' + lowest.stiffness + ' lb/in, the value of its string page", "'Lowest-stiffness string, the value of its string page"],
      ['« mesure TWU » affirmé', "the value of its string page (the stiffness the RCS index uses).", "a TWU measurement."],
    ];
    const ENGINE_NEG_SRC = "'For a sensitive arm, string at 21-23 kg.'";
    const POSITIVES: Array<[string, string, string]> = [
      ['phrase de fin reformulée', "' Each kg changes the index by 0.5 point.", "' One kg of tension moves the index by half a point."],
      ['titre reformulé, seuil cité', "const title = 'Tension and the alert threshold (' + L.threshold + ')';", "const title = 'Tension below the alert threshold (' + L.threshold + ')';"],
    ];
    for (const [name, find, rep] of PAGE_NEG) {
      const m = replaceOnceQ21(pageQ21, find, rep);
      if (m === null) { fail(`${PAGEQ21} : prémisse du test négatif « ${name} » fausse (motif absent)`); continue; }
      if (checkPageQ21(m, engineQ21).length > 0) detectedQ21++;
      else fail(`${PAGEQ21} : garde-fou muet sur « ${name} »`);
    }
    for (const [name, find, rep] of BRANCH_NEG) {
      const m = replaceOnceQ21(pageQ21, find, rep);
      if (m === null) { fail(`${PAGEQ21} : prémisse du test négatif « ${name} » fausse (motif absent)`); continue; }
      if (branchIssuesQ21(m).length > 0) detectedQ21++;
      else fail(`${PAGEQ21} : garde-fou muet sur « ${name} »`);
    }
    // Moteur : seuil bras sensible changé (31) sans toucher à la page : la page doit diverger du recalcul.
    const engMut = replaceOnceQ21(engineSrcQ21, 'HEALTH_ALERT_SENSITIVE_RCS: 32,', 'HEALTH_ALERT_SENSITIVE_RCS: 31,');
    if (engMut === null) fail(`${ENGINEQ21} : prémisse du test négatif « seuil du moteur à 31 » fausse (motif absent)`);
    else if (checkPageQ21(pageQ21, loadEngineQ21(engMut)).length > 0) detectedQ21++;
    else fail(`${ENGINEQ21} : garde-fou muet sur « seuil du moteur à 31 »`);
    // Balayage : une tension fixe pour un bras sensible ajoutée au moteur EN doit être vue ; un levier « 1 kg » ne l'est pas.
    if (scanFixedQ21(ENGINEQ21, `${engineSrcQ21}\nconst x = ${ENGINE_NEG_SRC};`).length > 0) detectedQ21++;
    else fail(`${ENGINEQ21} : garde-fou muet sur « tension fixe pour un bras sensible ajoutée au moteur »`);
    if (scanFixedQ21(ENGINEQ21, `${engineSrcQ21}\nconst y = 'For a sensitive arm, 1 kg less lowers the index by 0.5 point.';\nconst z = \`For a sensitive arm: \${n} kg\`;`).length === 0) acceptedQ21++;
    else fail(`${ENGINEQ21} : témoin positif « levier de 1 kg et tension calculée » rejeté à tort`);
    // Balayage des pages : une tension fixe pour une douleur en texte HTML, dans une chaîne d'un script ou dans un attribut
    // doit être vue ; la même dans un commentaire de script (jamais affiché) ne l'est pas.
    const SCAN_NEGQ21: Array<[string, string, string]> = [
      ['texte HTML', '</body>', '<p>For a sensitive arm, string at 21-23 kg.</p>\n</body>'],
      ['chaîne d\'un script', OPENQ21, `const adviceQ21 = 'Elbow pain? String at 22 kg.';\n    ${OPENQ21}`],
      ['attribut', '</body>', '<meta name="description" content="Tennis elbow: string at 21 kg">\n</body>'],
    ];
    for (const [name, find, rep] of SCAN_NEGQ21) {
      const m = replaceOnceQ21(pageQ21, find, rep);
      if (m === null) { fail(`${PAGEQ21} : prémisse du test négatif « balayage, ${name} » fausse (motif absent)`); continue; }
      if (scanFixedQ21(PAGEQ21, m).length > 0) detectedQ21++;
      else fail(`${PAGEQ21} : garde-fou muet sur « tension fixe pour une douleur, ${name} »`);
    }
    const commentedQ21 = replaceOnceQ21(pageQ21, OPENQ21, `// ancien conseil « 21-23 kg » pour un bras sensible, retiré\n    ${OPENQ21}`);
    if (commentedQ21 !== null && scanFixedQ21(PAGEQ21, commentedQ21).length === 0) acceptedQ21++;
    else fail(`${PAGEQ21} : témoin positif « tension citée dans un commentaire de script » rejeté à tort`);
    for (const [name, find, rep] of POSITIVES) {
      const m = replaceOnceQ21(pageQ21, find, rep);
      if (m === null) { fail(`${PAGEQ21} : prémisse du témoin positif « ${name} » fausse (motif absent)`); continue; }
      const found = [...checkPageQ21(m, engineQ21), ...branchIssuesQ21(m)];
      if (found.length === 0) acceptedQ21++;
      else fail(`${PAGEQ21} : témoin positif « ${name} » rejeté à tort : ${found[0]}`);
    }

    if (failures.length === beforeQ21) {
      ok(
        `configurateur EN, douleur déclarée : tension calculée sous le seuil d'alerte bras sensible (${SQ21} = seuil bras sensible sondé dans calculateAdvancedRcs = HEALTH_ALERT_SENSITIVE_RCS du moteur EN) ; ` +
          `bloc de la page évalué tel quel avec le moteur EN sur ${tallyQ21.combos} montages (${racqQ21.length} raquettes à RA connu × ${strQ21.length} cordages), ` +
          `plage du curseur ${RANGEQ21?.min}-${RANGEQ21?.max} kg par ${RANGEQ21?.step} : N identique au recalcul par calculateRCS (« jusqu'à N kg » ${tallyQ21.mid}, ` +
          `toute la plage ${tallyQ21.whole}, aucune tension ${tallyQ21.none}), indice à N sous ${SQ21} et à N + ${RANGEQ21?.step} kg au seuil ou au-dessus, valeur et phrase ` +
          `affichées exactes ; cordage proposé = le moins rigide du catalogue, rigidité de fiche citée ; ${tallyQ21.proposals} raquettes proposables sous le seuil ; ` +
          `aucune tension fixe dans la branche ni à côté d'un bras sensible dans ${scanned} fichiers (public/en hors blog, public/js) ; ` +
          `${detectedQ21} tests négatifs détectés, ${acceptedQ21} témoins positifs acceptés`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 21 ter. HYBRIDES : UN SEUL INDICE, celui que l'alerte lit, que la page affiche et que le PDF imprime (22/10/2026)
// ---------------------------------------------------------------------------
// Constat : pour un hybride, la page affichait un « RCS Moyen » (moyenne des indices des montants, pris à la tension MOYENNE, et des
// travers) et le moteur alertait sur un autre indice (rigidités pondérées 60/40, tension moyenne) : écart d'au moins 1 point dans 27 à
// 30 % des montages hybrides, palier « Très Ferme » affiché sans alerte. Décision (b)+(a) de l'orchestrateur : un indice unique, le plus
// haut du 60/40 et du 50/50 corrigé (chaque jeu de cordes à SA tension), calculé par `setupFirmnessIndex`. Ce bloc échoue si, sur une
// grille d'hybrides (raquettes regroupées par RA effectif et poids ≥ 300 g, chaque groupe compté pour son nombre de raquettes ; couples
// ordonnés de cordages distincts, hybrides prémontés exclus ; montants à 18, 24 et 28 kg ; travers à −2, 0 et +2 kg) et sur quatre
// montages construits :
//   (a) l'indice n'est pas l'arrondi EXACT (demi vers le haut, comme `calculateRCS`) du plus haut du 60/40 et du 50/50 de chaque jeu à
//       sa tension, calculé en entiers ; s'il diffère de la forme équivalente (moyenne des rigidités + 0,1 × max(0, montants −
//       travers), à la tension moyenne) ; si la déclaration « bras sensible » le change ;
//   (b) les bornes ne sont pas les indices des montants seuls et des travers seuls, chacun à sa tension, ou l'indice passe sous les deux ;
//   (c) la mention ne dit pas « estimation », parle de mesure, dit « entre » avec d'autres nombres que les bornes, ou ne dit pas que
//       l'indice dépasse les deux bornes quand il les dépasse (montants plus rigides montés moins tendus que les travers) ;
//   (d) une alerte manque : indice au seuil (sondés : 35 standard, 32 bras sensible) sans alerte, palier « Très Ferme » sans alerte
//       standard ; ou une alerte cite un autre indice ;
//   (e) un montage sans travers reçoit des bornes, ou un autre indice que celui de son cordage à la tension moyenne.
// Le calcul exact reproduit la formule de `calculateRCS` (gain 2, décalage −27) : il est d'abord comparé à `calculateRCS` sur chaque
// cordage, et le contrôle échoue si la formule change. Les tests négatifs rejouent les gardes sur des copies altérées du moteur (un
// montage sur 41 de la grille, plus les montages construits).
{
  const before21t = failures.length;
  const S = ARM_ALERT_SENSITIVE;
  const N = ARM_ALERT_STANDARD;
  if (S === null || N === null) {
    fail("hybrides : seuils d'alerte bras introuvables dans calculateAdvancedRcs (sonde muette)");
  } else {
    type Calc = typeof calculateAdvancedRcs;
    // Valeur exacte : raw = 2 × 30 × (RA/70 × 0,4 + s/220 × 0,4 + t/24 × 0,2) − 27 = 12 RA/35 + 6 s/55 + t/2 − 27. Multipliée par
    // 38 500, elle est entière pour un RA entier, une rigidité au dixième (s100 = 100 × s) et une somme de deux tensions entières (t2).
    const D = 38500;
    const K = (ra: number, s100: number, t2: number): number => 13200 * ra + 42 * s100 + 9625 * t2 - 1039500;
    const roundExact = (num: number): number => Math.floor((2 * num + D) / (2 * D));
    const groups = new Map<string, { ra: number; weight: number | undefined; head: number | undefined; n: number }>();
    for (const r of racquetsDatabase) {
      const ra = effectiveRacquetRA(r);
      const k = `${ra}|${!!(r.weight && r.weight >= 300)}`;
      const g = groups.get(k);
      if (g) g.n++;
      else groups.set(k, { ra, weight: r.weight, head: r.headSize, n: 1 });
    }
    const comps = stringsDatabase.filter((s) => s.type !== 'Hybrid');
    let formulaOk = true;
    for (const s of stringsDatabase) {
      if (Math.abs(s.stiffness * 10 - Math.round(s.stiffness * 10)) > 1e-9) {
        formulaOk = false;
        fail(`hybrides : rigidité de ${s.id} (${s.stiffness}) au-delà du dixième : le calcul exact du contrôle 21 ter ne la représente pas, le relire`);
      }
      for (const g of groups.values()) {
        for (let t2 = 36; t2 <= 60; t2++) {
          if (formulaOk && calculateRCS(g.ra, s.stiffness, t2 / 2) !== roundExact(K(g.ra, Math.round(s.stiffness * 10) * 10, t2))) {
            formulaOk = false;
            fail(`hybrides : calculateRCS(${g.ra}, ${s.stiffness}, ${t2 / 2}) ≠ calcul exact du contrôle 21 ter : la formule de l'indice a changé, relire ce contrôle`);
          }
        }
      }
    }
    const ratingsOf = (s: (typeof stringsDatabase)[number]) => ({ control: s.control, comfort: s.comfort, spin: s.spin, power: s.power, durability: s.durability });
    const isArm = (w: string): boolean => /bras|elbow/i.test(w);
    const noteIssue = (note: string, rcs: number, mains: number, crosses: number): string | null => {
      const lo = Math.min(mains, crosses);
      const hi = Math.max(mains, crosses);
      if (!/estimation/i.test(note)) return `« ${note} » ne dit pas que l'indice est une estimation`;
      if (/mesur/i.test(note)) return `« ${note} » parle de mesure`;
      const nums = (note.match(/\d+/g) ?? []).map(Number);
      const between = /entre (\d+) et (\d+)/.exec(note);
      if (rcs > hi) {
        if (between || !/au-dessus|dépasse|supérieur/i.test(note)) return `« ${note} » ne dit pas que l'indice ${rcs} dépasse les deux bornes (${mains}, ${crosses})`;
        if (!nums.includes(mains) || !nums.includes(crosses)) return `« ${note} » ne donne pas les deux bornes ${mains} et ${crosses}`;
        return null;
      }
      if (lo === hi) return nums.includes(lo) && (!between || (Number(between[1]) === lo && Number(between[2]) === hi)) ? null : `« ${note} » ne donne pas la borne ${lo}`;
      if (!between || Number(between[1]) !== lo || Number(between[2]) !== hi) return `« ${note} » au lieu de « entre ${lo} et ${hi} »`;
      return null;
    };
    // Montages construits (rigidités hors catalogue) : chaque forme de la mention, dont l'indice au-dessus des deux bornes.
    const PROBES = [
      { what: 'au-dessus de deux bornes égales', ra: 57, m: 228.6, x: 218.3, mT: 18, xT: 20 },
      { what: 'au-dessus de deux bornes différentes', ra: 64, m: 205.5, x: 151.5, mT: 18, xT: 28 },
      { what: 'entre les bornes', ra: 64, m: 230, x: 160, mT: 24, xT: 22 },
      { what: 'bornes égales à l\'indice', ra: 64, m: 200, x: 200.5, mT: 24, xT: 24 },
    ];
    const MAINS_T = [18, 24, 28];
    const OFFSETS = [-2, 0, 2];
    const checkHybrids = (calc: Calc, stride: number) => {
      const issues = new Map<string, string>();
      const add = (cat: string, msg: string): void => {
        if (!issues.has(cat)) issues.set(cat, `${cat} ${msg}`);
      };
      const tally = { n: 0, std: 0, sen: 0, entre: 0, egal: 0, dessus: 0, probes: new Set<string>() };
      // Entrées du moteur précalculées par cordage ; le lieu d'un défaut n'est écrit qu'en cas de défaut.
      type Comp = { id: string; stiffness: number; family: ReturnType<typeof stringTypeToFamily>; ratings: ReturnType<typeof ratingsOf>; s100: number };
      const noteMemo = new Map<string, string | null>();
      const tresFerme: boolean[] = [];
      const one = (ra: number, weight: number | undefined, head: number | undefined, m: Comp, x: Comp, mT: number, xT: number, w: number, probe: string | null): void => {
        const input = {
          racquetStiffness: ra, racquetWeight: weight, racquetHeadSize: head,
          mainStringStiffness: m.stiffness, mainStringFamily: m.family, mainRatings: m.ratings,
          crossStringStiffness: x.stiffness, crossStringFamily: x.family, crossRatings: x.ratings,
          mainTension: mT, crossTension: xT,
        };
        const std = calc({ ...input, profile: { armSensitive: false } });
        const sen = calc({ ...input, profile: { armSensitive: true } });
        const where = (): string => `(${probe ? `montage construit, ${probe} : ` : ''}RA ${ra}, montants ${m.id} ${m.stiffness} à ${mT} kg, travers ${x.id} ${x.stiffness} à ${xT} kg)`;
        const rcs = std.rcs;
        const h = std.hybrid;
        tally.n += w;
        if (sen.rcs !== rcs || h?.mains !== sen.hybrid?.mains || h?.crosses !== sen.hybrid?.crosses || h?.note !== sen.hybrid?.note) add('indice :', `la déclaration « bras sensible » change l'indice ou les bornes ${where()}`);
        const exact = roundExact(Math.max(K(ra, (6 * m.s100 + 4 * x.s100) / 10, mT + xT), K(ra, (5 * m.s100 + 5 * x.s100) / 10, mT + xT)));
        if (rcs !== exact) add('indice :', `${rcs} au lieu de ${exact}, arrondi exact du plus haut du 60/40 et du 50/50 de chaque jeu à sa tension ${where()}`);
        const equiv = calculateRCS(ra, (m.stiffness + x.stiffness) / 2 + 0.1 * Math.max(0, m.stiffness - x.stiffness), (mT + xT) / 2);
        if (rcs !== equiv) add('indice (forme équivalente) :', `${rcs} au lieu de ${equiv} (moyenne + 0,1 × max(0, montants − travers), à la tension moyenne) ${where()}`);
        const bm = calculateRCS(ra, m.stiffness, mT);
        const bx = calculateRCS(ra, x.stiffness, xT);
        if (!h) add('bornes :', `hybride sans bornes ni mention ${where()}`);
        else {
          if (h.mains !== bm || h.crosses !== bx) add('bornes :', `${h.mains} / ${h.crosses} au lieu de ${bm} / ${bx}, indices des montants seuls et des travers seuls à leur tension ${where()}`);
          if (rcs < Math.min(bm, bx)) add('bornes :', `indice ${rcs} sous les deux bornes ${bm} et ${bx} ${where()}`);
          const key = `${rcs}|${bm}|${bx}|${h.note}`;
          let bad = noteMemo.get(key);
          if (bad === undefined) {
            bad = noteIssue(h.note, rcs, bm, bx);
            noteMemo.set(key, bad);
          }
          if (bad) add('mention :', `${bad} ${where()}`);
          if (rcs > Math.max(bm, bx)) tally.dessus += w;
          else if (bm === bx) tally.egal += w;
          else tally.entre += w;
        }
        const aStd = std.warnings.filter(isArm);
        const aSen = sen.warnings.filter(isArm);
        if (aStd.length > 0) tally.std += w;
        if (aSen.length > 0) tally.sen += w;
        if (rcs >= N && aStd.length === 0) add('alerte :', `indice ${rcs} sans alerte standard (seuil ${N}) ${where()}`);
        if (rcs >= S && aSen.length === 0) add('alerte :', `indice ${rcs} sans alerte bras sensible (seuil ${S}) ${where()}`);
        const tf = (tresFerme[rcs] ??= getStringRecommendation(rcs).level === 'Très Ferme');
        if (tf && aStd.length === 0) add('palier :', `« Très Ferme » (indice ${rcs}) sans alerte standard ${where()}`);
        for (const a of aStd.length + aSen.length > 0 ? [...aStd, ...aSen] : []) {
          const cited = /^Alerte bras : indice (\d+),/.exec(a) ?? /l'indice \((\d+)\)/.exec(a);
          if (!cited || Number(cited[1]) !== rcs) add('alerte :', `l'alerte cite l'indice ${cited?.[1] ?? '(aucun)'} au lieu de ${rcs} ${where()}`);
        }
        if (probe) tally.probes.add(probe);
      };
      const toComp = (st: { id: string; stiffness: number; type: string; control?: number; comfort?: number; spin?: number; power?: number; durability?: number }): Comp => ({
        id: st.id,
        stiffness: st.stiffness,
        family: stringTypeToFamily(st.type),
        ratings: { control: st.control, comfort: st.comfort, spin: st.spin, power: st.power, durability: st.durability },
        s100: Math.round(st.stiffness * 10) * 10,
      });
      const compsX = comps.map(toComp);
      let seen = 0;
      for (const g of groups.values()) {
        for (const m of compsX) {
          for (const x of compsX) {
            if (m.id === x.id) continue;
            for (const mT of MAINS_T) {
              for (const off of OFFSETS) {
                if (seen++ % stride !== 0) continue;
                one(g.ra, g.weight, g.head, m, x, mT, mT + off, g.n, null);
              }
            }
          }
        }
      }
      const fake = (id: string, stiffness: number) => toComp({ id, stiffness, type: 'Polyester', control: 8, comfort: 7, spin: 8, power: 7, durability: 8 });
      for (const p of PROBES) one(p.ra, 300, 100, fake('montants', p.m), fake('travers', p.x), p.mT, p.xT, 0, p.what);
      // (e) sans travers : aucune borne, indice du cordage à la tension moyenne
      for (const g of groups.values()) {
        for (const m of compsX) {
          for (const mT of MAINS_T) {
            if (seen++ % stride !== 0) continue;
            const o = calc({ racquetStiffness: g.ra, racquetWeight: g.weight, racquetHeadSize: g.head, mainStringStiffness: m.stiffness, mainStringFamily: m.family, mainRatings: m.ratings, mainTension: mT, crossTension: mT - 2 });
            if (o.hybrid) add('sans travers :', `bornes d'hybride sur ${m.id} seul (RA ${g.ra}, ${mT} / ${mT - 2} kg)`);
            if (o.rcs !== calculateRCS(g.ra, m.stiffness, mT - 1)) add('sans travers :', `indice ${o.rcs} au lieu de ${calculateRCS(g.ra, m.stiffness, mT - 1)} pour ${m.id} seul (RA ${g.ra}, ${mT} / ${mT - 2} kg)`);
          }
        }
      }
      return { issues: [...issues.values()], tally };
    };

    if (formulaOk) {
      const t0 = Date.now();
      const real = checkHybrids(calculateAdvancedRcs, 1);
      real.issues.forEach((i) => fail(`hybrides : ${i}`));
      if (real.tally.probes.size !== PROBES.length) fail(`hybrides : ${real.tally.probes.size} montages construits vérifiés sur ${PROBES.length}`);
      if (real.tally.dessus === 0 || real.tally.entre === 0 || real.tally.egal === 0) fail(`hybrides : la grille n'exerce plus chaque forme de la mention (entre ${real.tally.entre}, bornes égales ${real.tally.egal}, au-dessus ${real.tally.dessus}) : relire le contrôle`);
      const realMs = Date.now() - t0;

      // --- Tests négatifs (moteur rechargé depuis son source) et témoins positifs --------------------------------------
      const engineSrc = readFileSync('src/lib/advanced-rcs.ts', 'utf8').replace(/\r\n/g, '\n');
      const stringsModule = await import('../src/data/strings-database');
      const loadEngine = (src: string): Calc => {
        const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
        const mod: { exports: Record<string, unknown> } = { exports: {} };
        new Function('exports', 'require', 'module', js)(
          mod.exports,
          (id: string) => {
            if (id === '@/data/strings-database') return stringsModule;
            throw new Error(`require inattendu : ${id}`);
          },
          mod
        );
        return mod.exports.calculateAdvancedRcs as Calc;
      };
      const STRIDE = 41;
      let detected = 0;
      let accepted = 0;
      const copyIssues = checkHybrids(loadEngine(engineSrc), STRIDE).issues;
      if (copyIssues.length > 0) fail(`hybrides : le moteur rechargé depuis son source (instrument des tests négatifs) ne passe pas son propre contrôle : ${copyIssues.join(' ; ')}`);
      const IDX = 'const rcs = rcsIndex(racquetStiffness, Math.max(blend(main, cross), (main + cross) / 2), avgTension);';
      const NOTE = '`estimation pour un hybride, entre ${lo} et ${hi}`';
      const NEGATIVES: Array<[string, string, string, string]> = [
        ['60/40 seul (l\'indice du moteur d\'avant)', IDX, 'const rcs = rcsIndex(racquetStiffness, blend(main, cross), avgTension);', 'indice :'],
        ['50/50 seul', IDX, 'const rcs = rcsIndex(racquetStiffness, (main + cross) / 2, avgTension);', 'indice :'],
        ['50/50 de la page d\'avant (montants à la tension moyenne, deux arrondis)', IDX, 'const rcs = Math.max(rcsIndex(racquetStiffness, blend(main, cross), avgTension), Math.round((rcsIndex(racquetStiffness, main, avgTension) + rcsIndex(racquetStiffness, cross, crossTension)) / 2));', 'indice :'],
        ['la déclaration change l\'indice d\'un hybride', 'const { rcs, hybrid } = setupFirmnessIndex(input);', 'const { rcs: rcs0, hybrid } = setupFirmnessIndex(input);\n  const rcs = rcs0 + (profile?.armSensitive && input.crossStringStiffness !== undefined ? 1 : 0);', 'indice :'],
        ['borne des montants à la tension moyenne', 'const mains = rcsIndex(racquetStiffness, main, mainTension);', 'const mains = rcsIndex(racquetStiffness, main, avgTension);', 'bornes :'],
        ['hybride sans bornes ni mention', 'return { rcs, hybrid: { mains, crosses, note: hybridIndexNote(rcs, mains, crosses) } };', 'return { rcs, hybrid: null };', 'bornes :'],
        ['bornes inversées dans la mention', NOTE, '`estimation pour un hybride, entre ${hi} et ${lo}`', 'mention :'],
        ['mention sans « estimation »', NOTE, '`hybride, entre ${lo} et ${hi}`', 'mention :'],
        ['mention qui parle de mesure', NOTE, '`indice mesuré pour un hybride, entre ${lo} et ${hi}`', 'mention :'],
        ['« au-dessus » non dit (« entre » ou bornes égales à la place)', '  if (rcs > hi) return `estimation pour un hybride, au-dessus des montants seuls (${mains}) et des travers seuls (${crosses})`;\n', '', 'mention :'],
        ['alerte « bras sensible » qui lit encore le 60/40', '? rcs >= 32 ||', '? rcsIndex(racquetStiffness, effStringStiffness, avgTension) >= 32 ||', 'alerte :'],
        ['alerte standard qui lit encore le 60/40', ': rcs >= 35 ||', ': rcsIndex(racquetStiffness, effStringStiffness, avgTension) >= 35 ||', 'alerte :'],
        ['bornes sur un montage sans travers', 'return { rcs: rcsIndex(racquetStiffness, main, avgTension), hybrid: null };', "return { rcs: rcsIndex(racquetStiffness, main, avgTension), hybrid: { mains: 0, crosses: 0, note: 'estimation' } };", 'sans travers :'],
      ];
      const POSITIVES: Array<[string, string, string]> = [
        ['mention reformulée, mêmes bornes', NOTE, '`estimation pour un hybride : entre ${lo} et ${hi}`'],
        ['commentaire du moteur reformulé', "Mention de l'indice d'un hybride", "Mention de l'indice d'un montage hybride"],
      ];
      for (const [name, find, replace, needle] of NEGATIVES) {
        const i = engineSrc.indexOf(find);
        if (i < 0) {
          fail(`hybrides : prémisse du test négatif « ${name} » fausse (motif absent de src/lib/advanced-rcs.ts)`);
          continue;
        }
        let issues: string[] = [];
        try {
          issues = checkHybrids(loadEngine(engineSrc.slice(0, i) + replace + engineSrc.slice(i + find.length)), STRIDE).issues;
        } catch (e) {
          fail(`hybrides : moteur altéré « ${name} » illisible (${(e as Error).message}) : le test doit échouer bruyamment`);
          continue;
        }
        if (issues.some((x) => x.startsWith(needle))) detected++;
        else fail(`hybrides : garde-fou muet sur « ${name} » (motif attendu « ${needle} »${issues.length ? `, trouvé : ${issues[0].slice(0, 90)}` : ''})`);
      }
      for (const [name, find, replace] of POSITIVES) {
        const i = engineSrc.indexOf(find);
        if (i < 0) {
          fail(`hybrides : prémisse du témoin positif « ${name} » fausse (motif absent de src/lib/advanced-rcs.ts)`);
          continue;
        }
        const found = checkHybrids(loadEngine(engineSrc.slice(0, i) + replace + engineSrc.slice(i + find.length)), STRIDE).issues;
        if (found.length > 0) fail(`hybrides : témoin positif « ${name} » rejeté à tort : ${found.join(' ; ')}`);
        else accepted++;
      }

      if (failures.length === before21t) {
        const t = real.tally;
        const pc = (k: number) => ((100 * k) / t.n).toFixed(2);
        ok(
          `hybrides : un seul indice sur ${t.n} montages hybrides (${groups.size} groupes pour ${racquetsDatabase.length} raquettes, ${comps.length} cordages hors hybrides prémontés, montants à ${MAINS_T.join('/')} kg, travers à ${OFFSETS.map((o) => (o > 0 ? `+${o}` : `${o}`)).join('/')} kg) et ${PROBES.length} montages construits : ` +
            `indice = arrondi exact du plus haut du 60/40 et du 50/50 de chaque jeu à sa tension = forme équivalente (moyenne + 0,1 × max(0, montants − travers)) ; bornes = montants seuls et travers seuls à leur tension ; ` +
            `mention « estimation » (entre les bornes ${t.entre}, bornes égales ${t.egal}, au-dessus des deux bornes ${t.dessus}) ; alerte dès l'indice ${N} (standard, ${pc(t.std)} % de la grille) et ${S} (bras sensible, ${pc(t.sen)} %), aucun palier « Très Ferme » sans alerte, alerte qui cite l'indice ; ` +
            `sans travers : aucune borne ; ${detected} tests négatifs détectés, ${accepted} témoins positifs acceptés (grille réelle en ${(realMs / 1000).toFixed(1)} s)`
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 22. D2 RESTREINT : NOTES DE CONFORT RECALÉES SUR LA RIGIDITÉ MESURÉE (TWU), 23/10/2026
// ---------------------------------------------------------------------------
// Décision : avis d'Opus 5.5 du 23/10/2026, point 1, option (c). Une note de confort qui dépasse de plus de 1,0 point la droite
// L2 de sa famille est ramenée sur la droite, seulement si la mesure TWU de la fiche est au moins la médiane de rigidité de la
// famille ; pour une note harmonisée avec des avis de testeurs, seule la composante éditoriale est ramenée, puis la moyenne avec
// l'avis recalé est refaite (`harmonizedRating`). Jamais une note ne monte, aucun seuil ne bouge. Ce bloc échoue si :
//   (a) une entrée de `comfort-recalibration.ts` ne respecte pas la règle (mesure TWU de la fiche, écart à la droite, médiane,
//       nouvelle note = droite arrondie, ou moyenne refaite pour une note harmonisée ; note d'avant = note harmonisée d'avant) ;
//       ou si la note du catalogue n'est pas la nouvelle note, ou si une note monte ou ne bouge pas ;
//   (b) les droites ou les médianes figées ne sont pas celles du catalogue d'AVANT D2, reconstruit depuis l'instantané de
//       référence du 23/10/2026 (`data/reference/second-filet-2026-10-23.json`) en y remettant les notes d'avant ;
//   (c) la sélection n'est pas complète : une fiche de l'instantané relève de la règle sans être dans la table, ou l'inverse ;
//   (d) D2 fait disparaître une alerte bras (grille du contrôle 5, moteur réel, deux profils : catalogue d'avant contre catalogue
//       courant), ou les libellés ne portent pas la mention (FR : contrôle 18 ; EN : `rating-labels.js`, audit:string-labels).
// Les tests négatifs rejouent ces gardes sur des copies altérées de la table, de la règle et du catalogue.
{
  const before22 = failures.length;
  const REF22 = 'data/reference/second-filet-2026-10-23.json';
  type Rule = typeof COMFORT_RECALIBRATION_RULE;
  type Table = Readonly<Record<string, (typeof COMFORT_RECALIBRATED)[string]>>;
  type RefString = { type: string; stiffness: number; twu: number | null; comfort: number | null };
  type RefRacquet = { ra: number; weight: number | null };
  type Ref = { strings: Record<string, RefString>; racquets: Record<string, RefRacquet> };
  const FAMILIES = ['Polyester', 'Multifilament'] as const;
  const rnd1 = (x: number) => Math.floor(x * 10 + 0.5) / 10;
  const median = (v: number[]) => { const s = [...v].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const slopeOf = (xs: number[], ys: number[]) => {
    const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
    const my = ys.reduce((a, b) => a + b, 0) / ys.length;
    let sxy = 0;
    let sxx = 0;
    xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; });
    return sxy / sxx;
  };
  let ref: Ref | null = null;
  try {
    ref = JSON.parse(readFileSync(REF22, 'utf8')) as Ref;
  } catch (e) {
    fail(`D2 : instantané de référence ${REF22} illisible (${(e as Error).message})`);
  }
  type Cat = readonly (typeof stringsDatabase)[number][];
  const checkD2 = (table: Table, rule: Rule, catalog: Cat, refStrings: Record<string, RefString>) => {
    const issues: string[] = [];
    const lineOf = (fam: keyof Rule['lines'], twu: number) => rule.lines[fam].intercept + rule.lines[fam].slope * twu;
    // (a) chaque entrée
    for (const [id, e] of Object.entries(table)) {
      const s = catalog.find((x) => x.id === id);
      if (!s) { issues.push(`${id} : dans la table D2, absent du catalogue`); continue; }
      if (s.type !== e.family) issues.push(`${id} : famille ${s.type} au catalogue, ${e.family} dans la table`);
      const tab = s.stiffnessByGauge ? Object.values(s.stiffnessByGauge) : [];
      const twu = tab.length > 0 ? Math.max(...tab) : null;
      if (twu !== e.twu) issues.push(`${id} : mesure TWU ${twu} au catalogue (la plus rigide des jauges mesurées), ${e.twu} dans la table`);
      const line = lineOf(e.family, e.twu);
      if (!(e.before - line > rule.tolerance + 1e-9)) issues.push(`${id} : note d'avant ${e.before} à moins de ${rule.tolerance} de la droite (${line.toFixed(3)}) : hors règle`);
      if (!(e.twu >= rule.medians[e.family])) issues.push(`${id} : mesure TWU ${e.twu} sous la médiane des ${e.family} (${rule.medians[e.family]}) : hors règle (D2 restreint)`);
      const tester = STRING_TESTER_RATINGS[id];
      let want: number;
      if (tester) {
        if (e.editorialBefore !== tester.before10.comfort) issues.push(`${id} : composante éditoriale d'avant ${e.editorialBefore}, ${tester.before10.comfort} dans tester-ratings.ts`);
        const edWant = Math.min(tester.before10.comfort ?? Infinity, rnd1(line));
        if (e.editorialAfter !== edWant) issues.push(`${id} : composante éditoriale recalée ${e.editorialAfter}, ${edWant} attendue (droite arrondie, jamais au-dessus de l'ancienne)`);
        if (e.before !== harmonizedRating(tester, 'comfort')) issues.push(`${id} : note d'avant ${e.before}, ${harmonizedRating(tester, 'comfort')} = note harmonisée d'avant`);
        want = harmonizedRating(tester, 'comfort', edWant);
      } else {
        if (e.editorialBefore !== undefined || e.editorialAfter !== undefined) issues.push(`${id} : composante éditoriale renseignée pour une note qui n'est pas harmonisée`);
        want = rnd1(line);
      }
      if (e.after !== want) issues.push(`${id} : nouvelle note ${e.after}, ${want} attendue par la règle${tester ? ' (moyenne refaite avec l\'avis des testeurs)' : ' (droite arrondie au dixième)'}`);
      if (!(e.after < e.before)) issues.push(`${id} : note ${e.before} -> ${e.after} : une note D2 ne fait que baisser`);
      if (s.comfort !== e.after) issues.push(`${id} : note de confort ${s.comfort} au catalogue, ${e.after} attendue (table D2)`);
    }
    // (b) droites et médianes, recalculées sur le catalogue d'AVANT D2 (instantané, notes d'avant remises) ; (c) sélection complète
    const pre = Object.entries(refStrings).map(([id, r]) => ({ id, ...r, comfort: table[id] ? table[id].before : r.comfort }));
    const excluded: string[] = [];
    for (const fam of FAMILIES) {
      const all = pre.filter((r) => r.type === fam);
      const rated = all.filter((r) => r.comfort !== null);
      const withT = rated.filter((r) => r.twu !== null);
      const slope = slopeOf(rated.map((r) => r.stiffness), rated.map((r) => r.comfort as number));
      const intercept = withT.reduce((a, r) => a + (r.comfort as number), 0) / withT.length - slope * (withT.reduce((a, r) => a + (r.twu as number), 0) / withT.length);
      if (Math.abs(slope - rule.lines[fam].slope) > 1e-9 || Math.abs(intercept - rule.lines[fam].intercept) > 1e-9) {
        issues.push(`droite ${fam} figée ${rule.lines[fam].intercept} + ${rule.lines[fam].slope} × TWU, ${intercept} + ${slope} × TWU recalculée sur le catalogue d'avant D2`);
      }
      const med = median(all.map((r) => r.stiffness));
      if (med !== rule.medians[fam]) issues.push(`médiane ${fam} figée ${rule.medians[fam]}, ${med} recalculée`);
      for (const r of withT) {
        const over = (r.comfort as number) - lineOf(fam, r.twu as number) > rule.tolerance + 1e-9;
        const sel = over && (r.twu as number) >= rule.medians[fam];
        if (over && !sel) excluded.push(r.id);
        if (sel !== Object.prototype.hasOwnProperty.call(table, r.id)) issues.push(`${r.id} : ${sel ? 'relève de D2 mais absente de la table' : 'dans la table mais hors règle'}`);
      }
    }
    for (const id of Object.keys(table)) if (!(id in refStrings)) issues.push(`${id} : absent de l'instantané de référence`);
    return { issues, excluded };
  };
  // (d) alertes : catalogue d'avant D2 contre catalogue courant, moteur réel, grille du contrôle 5.
  const isArm22 = (w: string) => /bras|elbow/i.test(w);
  const alertsDelta = (comfortBefore: (s: (typeof stringsDatabase)[number]) => number | undefined, catalog: Cat) => {
    const out = { std: { added: 0, gone: 0 }, sen: { added: 0, gone: 0 }, n: 0 };
    for (const r of racquetsDatabase) {
      const ra = effectiveRacquetRA(r);
      for (const s of catalog) {
        const c0 = comfortBefore(s);
        if (c0 === s.comfort) continue; // même note : mêmes alertes
        for (const t of TENSIONS) {
          for (const [k, armSensitive] of [['std', false], ['sen', true]] as const) {
            const base = { racquetStiffness: ra, racquetWeight: r.weight, racquetHeadSize: r.headSize, mainStringStiffness: s.stiffness, mainStringFamily: stringTypeToFamily(s.type), mainTension: t, profile: { armSensitive } };
            const a0 = calculateAdvancedRcs({ ...base, mainRatings: { comfort: c0 } }).warnings.some(isArm22);
            const a1 = calculateAdvancedRcs({ ...base, mainRatings: { comfort: s.comfort } }).warnings.some(isArm22);
            if (a0 && !a1) out[k].gone++;
            if (!a0 && a1) out[k].added++;
          }
          out.n++;
        }
      }
    }
    return out;
  };
  if (ref) {
    const refStrings = ref.strings;
    const real = checkD2(COMFORT_RECALIBRATED, COMFORT_RECALIBRATION_RULE, stringsDatabase, refStrings);
    real.issues.forEach((i) => fail(`D2 : ${i}`));
    const delta = alertsDelta((s) => COMFORT_RECALIBRATED[s.id]?.before ?? s.comfort, stringsDatabase);
    if (delta.std.gone + delta.sen.gone > 0) fail(`D2 : ${delta.std.gone} alerte(s) standard et ${delta.sen.gone} bras sensible disparue(s) : une note D2 ne doit que baisser`);
    // Libellé EN : la mention de la règle est celle de public/js/rating-labels.js (contrat mot pour mot : audit:string-labels).
    const { createRequire } = await import('node:module');
    const EN = createRequire(import.meta.url)('../public/js/rating-labels.js') as { RECALIBRATED?: string; labelOf?: (s: unknown, h: unknown, t: unknown, r: unknown) => string };
    if (EN.RECALIBRATED !== COMFORT_RECALIBRATION_RULE.labelEn) fail(`D2 : mention EN « ${EN.RECALIBRATED} » dans rating-labels.js, « ${COMFORT_RECALIBRATION_RULE.labelEn} » dans la règle`);
    const recalIds = new Set(Object.keys(COMFORT_RECALIBRATED));
    const harmIds = new Set(Object.keys(STRING_TESTER_RATINGS));
    const { THIRD_PARTY_RATED_STRING_IDS: thirdIds } = await import('../src/data/string-ratings-third-party');
    for (const s of stringsDatabase) {
      const lab = EN.labelOf ? EN.labelOf({ id: s.id, comfort: s.comfort ?? null, control: s.control ?? null, spin: s.spin ?? null, power: s.power ?? null, durability: s.durability ?? null }, harmIds, new Set(thirdIds), recalIds) : '';
      if (recalIds.has(s.id) !== lab.endsWith(`; ${COMFORT_RECALIBRATION_RULE.labelEn}`)) fail(`D2 : libellé EN de ${s.id} « ${lab} » (mention attendue sur les fiches recalées et elles seules)`);
    }
    // Tests négatifs : chaque altération DOIT être détectée.
    let detected = 0;
    const T = COMFORT_RECALIBRATED;
    const withEntry = (id: string, patch: Record<string, unknown>) => ({ ...T, [id]: { ...T[id], ...patch } }) as Table;
    const withCatalog = (id: string, comfort: number) => stringsDatabase.map((s) => (s.id === id ? { ...s, comfort } : s));
    const iso = stringsDatabase.find((s) => s.id === 'isospeed-cream');
    const negatives: Array<[string, () => string[], string]> = [
      ['note D2 relevée dans la table (Revenge 5,4 -> 7,0)', () => checkD2(withEntry('babolat-revenge', { after: 7.0 }), COMFORT_RECALIBRATION_RULE, stringsDatabase, refStrings).issues, 'babolat-revenge'],
      ['note harmonisée écrasée par la droite (4G 5,3 -> 5,0, sans la moyenne testeurs)', () => checkD2(withEntry('luxilon-4g', { after: 5.0 }), COMFORT_RECALIBRATION_RULE, stringsDatabase, refStrings).issues, 'moyenne refaite'],
      ['composante éditoriale d\'avant fausse (Mach-10 8 -> 9)', () => checkD2(withEntry('solinco-mach-10', { editorialBefore: 9 }), COMFORT_RECALIBRATION_RULE, stringsDatabase, refStrings).issues, 'composante éditoriale d\'avant'],
      ['fiche souple ajoutée (Isospeed Cream, sous la médiane)', () => checkD2({ ...T, 'isospeed-cream': { family: 'Polyester', twu: 177.7, before: iso?.comfort ?? 9.5, after: 8.4 } }, COMFORT_RECALIBRATION_RULE, stringsDatabase, refStrings).issues, 'sous la médiane'],
      ['fiche retirée de la table (TGV)', () => { const { ['tecnifibre-tgv']: _gone, ...rest } = T; void _gone; return checkD2(rest, COMFORT_RECALIBRATION_RULE, stringsDatabase, refStrings).issues; }, 'droite Multifilament'],
      ['tolérance abaissée à 0,5 sans appliquer la règle', () => checkD2(T, { ...COMFORT_RECALIBRATION_RULE, tolerance: 0.5 } as unknown as Rule, stringsDatabase, refStrings).issues, 'relève de D2 mais absente'],
      ['pente de la droite polyester modifiée', () => checkD2(T, { ...COMFORT_RECALIBRATION_RULE, lines: { ...COMFORT_RECALIBRATION_RULE.lines, Polyester: { ...COMFORT_RECALIBRATION_RULE.lines.Polyester, slope: -0.03 } } } as unknown as Rule, stringsDatabase, refStrings).issues, 'droite Polyester'],
      ['médiane multifilament modifiée', () => checkD2(T, { ...COMFORT_RECALIBRATION_RULE, medians: { ...COMFORT_RECALIBRATION_RULE.medians, Multifilament: 170 } } as unknown as Rule, stringsDatabase, refStrings).issues, 'médiane Multifilament'],
      ['note du catalogue remise à sa valeur d\'avant (Revenge 7)', () => checkD2(T, COMFORT_RECALIBRATION_RULE, withCatalog('babolat-revenge', 7), refStrings).issues, 'au catalogue, 5.4 attendue'],
      ['note du catalogue harmonisée écrasée (Mach-10 7,0)', () => checkD2(T, COMFORT_RECALIBRATION_RULE, withCatalog('solinco-mach-10', 7.0), refStrings).issues, 'au catalogue, 8.3 attendue'],
      ['D2 qui relève une note (Razor Code 7,5 -> 9,0 : alertes disparues)', () => { const d = alertsDelta((s) => (s.id === 'tecnifibre-razor-code' ? 6.4 : s.comfort), withCatalog('tecnifibre-razor-code', 9.0)); return d.std.gone + d.sen.gone > 0 ? ['alerte(s) disparue(s)'] : []; }, 'disparue'],
    ];
    for (const [name, run, needle] of negatives) {
      let found: string[] = [];
      try {
        found = run();
      } catch (e) {
        fail(`D2 : test négatif « ${name} » inexécutable (${(e as Error).message})`);
        continue;
      }
      if (found.some((i) => i.includes(needle))) detected++;
      else fail(`D2 : garde-fou muet sur « ${name} » (motif attendu « ${needle} »${found.length ? `, trouvé : ${found[0].slice(0, 90)}` : ''})`);
    }
    // Témoin positif : la table réordonnée passe.
    const reordered = Object.fromEntries(Object.entries(T).reverse()) as Table;
    const witness = checkD2(reordered, COMFORT_RECALIBRATION_RULE, stringsDatabase, refStrings).issues;
    if (witness.length > 0) fail(`D2 : témoin positif « table réordonnée » rejeté à tort : ${witness[0]}`);
    if (failures.length === before22) {
      const lines = Object.entries(T).map(([id, e]) => `${id} ${e.before} -> ${e.after}${e.editorialAfter !== undefined ? ` (éditoriale ${e.editorialBefore} -> ${e.editorialAfter})` : ''}`).join(', ');
      ok(
        `D2 : ${Object.keys(T).length} notes de confort recalées sur la rigidité mesurée (${lines}) ; droites L2 et médianes recalculées sur le catalogue d'avant D2 ; ` +
          `sélection complète (écartées par la médiane : ${real.excluded.join(', ')}) ; alertes de la grille du contrôle 5 : 0 disparue, ` +
          `+${delta.std.added} standard et +${delta.sen.added} bras sensible ajoutées ; mention FR et EN sur les fiches recalées et elles seules ; ${detected} tests négatifs détectés, 1 témoin positif accepté`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 23. SECOND FILET : AUCUNE NOTE DE CONFORT NE MONTE, AUCUNE ALERTE NE DISPARAÎT (référence du 23/10/2026)
// ---------------------------------------------------------------------------
// Garde-fou asymétrique (avis d'Opus 5.5 du 23/10/2026, point 6) : le second filet « confort » de l'alerte bras lit une note
// éditoriale, non mesurée ; elle peut descendre (D2), jamais monter sans mesure et sans GO. Plus généralement, une alerte bras ne
// disparaît pas en silence (règle 2). Référence : `data/reference/second-filet-2026-10-23.json` (rigidité, mesure TWU, note de
// confort de chaque cordage ; RA effectif et poids de chaque raquette ; `scripts/scraper/reference-second-filet.mts`). Ce bloc
// échoue si, par rapport à la référence : une note de confort monte, disparaît, ou apparaît sur une fiche « Non publié » (valeur
// comblée) ; une fiche ou une raquette disparaît ; ou une alerte bras de la grille du contrôle 5 disparaît (moteur réel, deux
// profils, mêmes entrées que la référence sauf les données changées). Exceptions : liste explicite, datée, motivée, avec le GO de
// Pierre ; 10 au 26/10/2026 (lot P6) ; une exception inutilisée échoue. Tests négatifs sur des copies altérées du catalogue.
{
  const before23 = failures.length;
  const REF23 = 'data/reference/second-filet-2026-10-23.json';
  // P6 (26/10/2026) : rigidités abaissées à leur mesure TWU (règle C, trois critères de la mesure AD de tsa-measure), GO explicite de Pierre.
  // Head Reflex MLT, Head RIP Control et Isospeed Control Classic baissent aussi, sans alerte à retirer sur cette grille : pas d'exception.
  const P6_GO = "Pierre, GO explicite du 26/10/2026 (transmis par l'orchestrateur) : baisses P6";
  const P6_MOTIVE = 'rigidité abaissée à la mesure TWU de la fiche (règle C ; mesure AD de tsa-measure du 23/10/2026 ; provenance string-stiffness-provenance.ts)';
  // Une exception est BORNÉE : elle n'excuse que la disparition d'une alerte due à la baisse de la rigidité de ce cordage à la valeur écrite
  // (`stiffness`), quand rien d'autre n'a changé dans le montage (raquette, note de confort, type). Elle ne couvre jamais une note de confort
  // relevée, retirée ou créée, ni le retrait de la fiche, ni une autre baisse de rigidité (revue indépendante de #153, défaut n° 1).
  const EXCEPTIONS23: ReadonlyArray<{ id: string; stiffness: number; date: string; motive: string; go: string }> = [
    { id: 'solinco-tour-bite-diamond-rough', stiffness: 192.6, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
    { id: 'yonex-poly-tour-tough', stiffness: 193.7, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
    { id: 'luxilon-4g-soft', stiffness: 217.2, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
    { id: 'luxilon-4g-rough', stiffness: 216, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
    { id: 'head-lynx', stiffness: 185.7, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
    { id: 'luxilon-alu-power-soft', stiffness: 197.7, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
    { id: 'luxilon-adrenaline-rough', stiffness: 202.9, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
    { id: 'head-hawk-rough', stiffness: 201.2, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
    { id: 'tecnifibre-ruff-code', stiffness: 207.5, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
    { id: 'yonex-poly-tour-air', stiffness: 154.9, date: '2026-10-26', motive: P6_MOTIVE, go: P6_GO },
  ];
  type RefS = { type: string; stiffness: number; twu: number | null; comfort: number | null };
  type RefR = { ra: number; weight: number | null };
  let ref: { strings: Record<string, RefS>; racquets: Record<string, RefR> } | null = null;
  try {
    ref = JSON.parse(readFileSync(REF23, 'utf8'));
  } catch (e) {
    fail(`second filet : référence ${REF23} illisible (${(e as Error).message})`);
  }
  type CurS = { id: string; type: string; stiffness: number; comfort: number | null };
  type CurR = { id: string; ra: number; weight: number | null };
  const isArm23 = (w: string) => /bras|elbow/i.test(w);
  const check23 = (strings: readonly CurS[], racquets: readonly CurR[], exceptions: typeof EXCEPTIONS23 = EXCEPTIONS23) => {
    const issues: string[] = [];
    const used = new Set<string>();
    for (const x of exceptions) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.motive.trim().length < 20 || !x.go.trim()) issues.push(`exception ${x.id} : date, motif ou GO absent`);
    }
    // Disparition excusée seulement si : type et note de confort du cordage inchangés, rigidité abaissée à la valeur écrite, et l'alerte existe
    // encore avec la raquette d'aujourd'hui et la rigidité d'avant (`stillWithOld`) : c'est la baisse de rigidité, et elle seule, qui la retire.
    const excused = (sid: string, s0: RefS, s1: CurS, stillWithOld: boolean) => {
      const x = exceptions.find((e) => e.id === sid);
      const hit = x !== undefined && stillWithOld && s0.type === s1.type && s0.comfort === s1.comfort &&
        s1.stiffness === x.stiffness && s1.stiffness < s0.stiffness;
      if (hit) used.add(sid);
      return hit;
    };
    const sById = new Map(strings.map((s) => [s.id, s]));
    const rById = new Map(racquets.map((r) => [r.id, r]));
    for (const [id, r] of Object.entries(ref!.strings)) {
      const s = sById.get(id);
      if (!s) { issues.push(`${id} : fiche retirée depuis la référence (ses alertes disparaissent)`); continue; }
      if (r.comfort !== null && s.comfort === null) issues.push(`${id} : note de confort retirée (${r.comfort} -> non publiée) : le second filet de la fiche disparaît`);
      if (r.comfort !== null && s.comfort !== null && s.comfort > r.comfort + 1e-9) issues.push(`${id} : note de confort relevée (${r.comfort} -> ${s.comfort}) sans mesure ni GO`);
      if (r.comfort === null && s.comfort !== null) issues.push(`${id} : note de confort créée (${s.comfort}) sur une fiche « Non publié » : valeur comblée`);
    }
    for (const id of Object.keys(ref!.racquets)) if (!rById.has(id)) issues.push(`${id} : raquette retirée depuis la référence (ses alertes disparaissent)`);
    let gone = 0;
    let added = 0;
    let example = '';
    for (const [rid, r0] of Object.entries(ref!.racquets)) {
      const r1 = rById.get(rid);
      if (!r1) continue;
      for (const [sid, s0] of Object.entries(ref!.strings)) {
        const s1 = sById.get(sid);
        if (!s1) continue;
        if (r0.ra === r1.ra && r0.weight === r1.weight && s0.stiffness === s1.stiffness && s0.comfort === s1.comfort && s0.type === s1.type) continue;
        for (const t of TENSIONS) {
          for (const armSensitive of [false, true]) {
            const inp = (r: RefR | CurR, s: RefS | CurS) => ({
              racquetStiffness: r.ra, racquetWeight: r.weight ?? undefined, mainStringStiffness: s.stiffness, mainStringFamily: stringTypeToFamily(s.type),
              mainRatings: { comfort: s.comfort ?? undefined }, mainTension: t, profile: { armSensitive },
            });
            const a0 = calculateAdvancedRcs(inp(r0, s0)).warnings.some(isArm23);
            const a1 = calculateAdvancedRcs(inp(r1, s1)).warnings.some(isArm23);
            if (a0 && !a1 && !excused(sid, s0, s1, calculateAdvancedRcs(inp(r1, s0)).warnings.some(isArm23))) { gone++; if (!example) example = `${rid} + ${sid} à ${t} kg (${armSensitive ? 'bras sensible' : 'standard'})`; }
            if (!a0 && a1) added++;
          }
        }
      }
    }
    if (gone > 0) issues.push(`${gone} alerte(s) bras disparue(s) depuis la référence, par exemple ${example}`);
    for (const x of exceptions) if (!used.has(x.id)) issues.push(`exception inutilisée : ${x.id} (${x.date})`);
    return { issues, gone, added };
  };
  if (ref) {
    const curS: CurS[] = stringsDatabase.map((s) => ({ id: s.id, type: s.type, stiffness: s.stiffness, comfort: s.comfort ?? null }));
    const curR: CurR[] = racquetsDatabase.map((r) => ({ id: r.id, ra: effectiveRacquetRA(r), weight: r.weight ?? null }));
    const real = check23(curS, curR);
    real.issues.forEach((i) => fail(`second filet : ${i}`));
    const mod = (id: string, patch: Partial<CurS>) => curS.map((s) => (s.id === id ? { ...s, ...patch } : s));
    const aRacquet = curR.find((r) => r.ra === 66)!;
    const negatives: Array<[string, () => string[], string]> = [
      ['note de confort relevée (Revenge 5,4 -> 7,0)', () => check23(mod('babolat-revenge', { comfort: 7.0 }), curR).issues, 'note de confort relevée'],
      ['note relevée : alertes disparues (Revenge 5,4 -> 7,0)', () => check23(mod('babolat-revenge', { comfort: 7.0 }), curR).issues, 'alerte(s) bras disparue(s)'],
      ['note de confort retirée (Revenge)', () => check23(mod('babolat-revenge', { comfort: null }), curR).issues, 'note de confort retirée'],
      ['note créée sur une fiche « Non publié » (O-Toro)', () => check23(mod(curS.find((s) => s.comfort === null)!.id, { comfort: 7 }), curR).issues, 'note de confort créée'],
      ['rigidité baissée (4G 286,9 -> 265)', () => check23(mod('luxilon-4g', { stiffness: 265 }), curR).issues, 'alerte(s) bras disparue(s)'],
      ['fiche retirée (4G)', () => check23(curS.filter((s) => s.id !== 'luxilon-4g'), curR).issues, 'fiche retirée'],
      [`RA baissé (${aRacquet.id} 66 -> 60)`, () => check23(curS, curR.map((r) => (r.id === aRacquet.id ? { ...r, ra: 60 } : r))).issues, 'alerte(s) bras disparue(s)'],
      ['raquette retirée', () => check23(curS, curR.filter((r) => r.id !== aRacquet.id)).issues, 'raquette retirée'],
      ['fiche exemptée : note de confort relevée (Poly Tour Tough 6 -> 9)', () => check23(mod('yonex-poly-tour-tough', { comfort: 9 }), curR).issues, 'yonex-poly-tour-tough : note de confort relevée'],
      ['fiche exemptée : note relevée, alertes disparues (Poly Tour Tough 6 -> 9)', () => check23(mod('yonex-poly-tour-tough', { comfort: 9 }), curR).issues, 'alerte(s) bras disparue(s)'],
      ['fiche exemptée : note de confort retirée (Head Lynx)', () => check23(mod('head-lynx', { comfort: null }), curR).issues, 'head-lynx : note de confort retirée'],
      ['fiche exemptée : retirée du catalogue (4G Rough)', () => check23(curS.filter((s) => s.id !== 'luxilon-4g-rough'), curR).issues, 'luxilon-4g-rough : fiche retirée'],
      ['fiche exemptée : rigidité abaissée sous la valeur écrite (4G Rough 216 -> 200)', () => check23(mod('luxilon-4g-rough', { stiffness: 200 }), curR).issues, 'alerte(s) bras disparue(s)'],
      ['fiche exemptée : RA d\'une raquette abaissé en même temps', () => check23(curS, curR.map((r) => (r.id === aRacquet.id ? { ...r, ra: 60 } : r))).issues, 'alerte(s) bras disparue(s)'],
      ['exception sans GO', () => check23(curS, curR, EXCEPTIONS23.map((x, i) => (i === 0 ? { ...x, go: '' } : x))).issues, 'date, motif ou GO absent'],
    ];
    let detected = 0;
    for (const [name, run, needle] of negatives) {
      const found = run();
      if (found.some((i) => i.includes(needle))) detected++;
      else fail(`second filet : garde-fou muet sur « ${name} » (motif attendu « ${needle} »${found.length ? `, trouvé : ${found[0].slice(0, 90)}` : ''})`);
    }
    // Témoins positifs : une note qui descend encore, une rigidité qui monte (seulement des alertes ajoutées).
    const lower = check23(mod('babolat-revenge', { comfort: 5.0 }), curR);
    const stiffer = check23(mod('luxilon-alu-power', { stiffness: 240 }), curR);
    let accepted = 0;
    if (lower.issues.length > 0 || lower.added === 0) fail(`second filet : témoin positif « note qui descend » rejeté ou sans effet (${lower.issues[0] ?? `${lower.added} ajoutée`})`);
    else accepted++;
    if (stiffer.issues.length > 0 || stiffer.added === 0) fail(`second filet : témoin positif « rigidité qui monte » rejeté ou sans effet (${stiffer.issues[0] ?? `${stiffer.added} ajoutée`})`);
    else accepted++;
    if (failures.length === before23) {
      ok(
        `second filet : par rapport à la référence du 23/10/2026 (${Object.keys(ref.strings).length} cordages, ${Object.keys(ref.racquets).length} raquettes), aucune note de confort ` +
          `relevée, retirée ni créée, aucune fiche ni raquette retirée, 0 alerte bras disparue hors exceptions (${real.added} ajoutée(s)) ; ${EXCEPTIONS23.length} exception(s) datée(s), motivée(s), avec le GO de Pierre (${[...new Set(EXCEPTIONS23.map((x) => x.date))].join(', ')}), bornées à la seule baisse de rigidité à la valeur écrite ; ` +
          `${detected} tests négatifs détectés, ${accepted} témoins positifs acceptés`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 24. HYBRIDES PRÉMONTÉS : composition du set et rigidité dérivée (23/10/2026)
// ---------------------------------------------------------------------------
// src/data/prepacked-hybrids.ts consigne, pour chaque fiche de type « Hybrid », la composition du set et sa source (point 9 de l'avis
// d'Opus 5.5 du 23/10/2026). Échoue si : (a) une fiche « Hybrid » n'y figure pas, ou une entrée ne désigne aucune fiche « Hybrid » ;
// (b) un composant manque, est lui-même un hybride ou figure deux fois ; (c) la rigidité d'un set à composition connue n'est pas le plus
// haut de sa valeur d'avant et de la valeur dérivée de ses composants, recalculée, ou, sur une grille de RA et de tensions, l'indice de
// la fiche est SOUS celui que le moteur (`setupFirmnessIndex`) donne aux deux cordages montés à la même tension (le plus haut des sens
// permis) ; (d) un set à composition non publiée a bougé, nomme des composants ou entre dans les classements ; (e) une source n'a pas
// d'URL https, de niveau, de date ou d'extrait de 1 à 40 mots, une composition « publiée » n'a aucune source, une composition « fiche »
// en cite une ; (f) les jauges consignées ne sont pas celles de la fiche ; (g) la fiche FR ne marque pas la rigidité dérivée « estimé »
// ou n'affiche pas la mention, ou la mention ne dit pas « dérivée » avec les deux cordages, ou « composition non publiée … sans source ».
{
  const before24 = failures.length;
  const PH = await import('../src/data/prepacked-hybrids');
  const { setupFirmnessIndex, rcsIndex } = await import('../src/lib/advanced-rcs');
  type PEntry = (typeof PH.PREPACKED_HYBRIDS)[string];
  type PItem = { id: string; type: string; stiffness: number; gauges: string[]; brand: string; model: string };
  const PAGE_22 = 'src/app/tennis-strings/[slug]/page.tsx';
  const RAS_22 = [55, 58, 61, 64, 66, 68, 70, 72];
  const TENS_22 = [18, 20, 22, 24, 26, 28];
  let above22 = 0;
  const checkPrepacked = (items: readonly PItem[], table: Readonly<Record<string, PEntry>>, pageSrc: string): string[] => {
    const issues: string[] = [];
    const byId = new Map(items.map((x) => [x.id, x]));
    const label = (x: string) => (byId.get(x) ? `${byId.get(x)!.brand} ${byId.get(x)!.model}` : x);
    for (const s of items) if (s.type === 'Hybrid' && !table[s.id]) issues.push(`${s.id} : fiche « Hybrid » sans composition consignée`);
    for (const [id, e] of Object.entries(table)) {
      const s = byId.get(id);
      if (!s || s.type !== 'Hybrid') { issues.push(`${id} : entrée qui ne désigne aucune fiche « Hybrid »`); continue; }
      for (const src of e.sources) {
        if (!/^https:\/\/\S+$/.test(src.url)) issues.push(`${id} : source sans URL https`);
        if (!['L0', 'L2', 'L3'].includes(src.level)) issues.push(`${id} : niveau de source « ${src.level} »`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(src.read)) issues.push(`${id} : date de lecture absente`);
        const words = src.excerpt.trim().split(/\s+/).filter(Boolean).length;
        if (words === 0 || words > 40) issues.push(`${id} : extrait de ${words} mots (1 à 40)`);
      }
      if (e.composition === 'publiee' && e.sources.length === 0) issues.push(`${id} : composition « publiée » sans source`);
      if (e.composition === 'fiche' && e.sources.length > 0) issues.push(`${id} : composition « fiche » qui cite une source`);
      if (!e.note.trim()) issues.push(`${id} : motif absent`);
      if (e.gauges && e.gauges.join(',') !== s.gauges.join(',')) issues.push(`${id} : jauges ${s.gauges.join(', ')} ≠ ${e.gauges.join(', ')} consignées`);
      const notice = PH.prepackedHybridNotice(id, label) ?? '';
      if (e.composition === 'non-publiee') {
        if (e.components !== null) issues.push(`${id} : composition non publiée mais composants nommés`);
        if (s.stiffness !== e.before) issues.push(`${id} : rigidité ${s.stiffness} ≠ ${e.before} (composition non publiée : valeur de fiche conservée)`);
        if (PH.isStiffnessRankable(s)) issues.push(`${id} : composition non publiée mais classable`);
        if (!/composition non publiée/i.test(notice) || !/sans source/.test(notice)) issues.push(`${id} : mention « composition non publiée, rigidité de fiche sans source » absente`);
        continue;
      }
      if (!e.components) { issues.push(`${id} : composants absents`); continue; }
      const [a, b] = e.components;
      const ca = byId.get(a), cb = byId.get(b);
      if (!ca || !cb) { issues.push(`${id} : composant ${!ca ? a : b} absent du catalogue`); continue; }
      if (a === b) issues.push(`${id} : deux fois le même composant`);
      if (ca.type === 'Hybrid' || cb.type === 'Hybrid') issues.push(`${id} : un composant est lui-même un hybride`);
      const derived = PH.prepackedHybridStiffness(ca.stiffness, cb.stiffness, e.orderFixed);
      // Tenue (règle 2) : un composant a baissé sur mesure, le set garde sa valeur jusqu'à un GO ; une tenue inutile, sans date ou sans motif échoue.
      const expected = e.held ? e.held.value : Math.max(e.before, derived);
      if (e.held && !(e.held.value > Math.max(e.before, derived))) issues.push(`${id} : tenue inutile (${e.held.value} ≤ ${Math.max(e.before, derived)}, plus haut de la valeur d'avant et de la valeur dérivée)`);
      if (e.held && (!/^\d{4}-\d{2}-\d{2}$/.test(e.held.date) || e.held.why.trim().length < 60)) issues.push(`${id} : tenue sans date ou sans motif`);
      // La tenue nomme le composant abaissé (sa valeur d'aujourd'hui = la fiche) et la valeur dérivée non appliquée (recalculée), que la mention affiche.
      if (e.held && (![a, b].includes(e.held.lowered.id) || byId.get(e.held.lowered.id)?.stiffness !== e.held.lowered.after || !(e.held.lowered.before > e.held.lowered.after))) {
        issues.push(`${id} : tenue : composant abaissé ${e.held.lowered.id} mal consigné (composant du set, valeur d'aujourd'hui, baisse)`);
      }
      if (e.held && Math.abs(e.held.derived - Math.max(e.before, derived)) > 1e-9) issues.push(`${id} : tenue : valeur dérivée consignée ${e.held.derived} ≠ ${Math.max(e.before, derived)} recalculée`);
      if (e.held && (!notice.includes(String(e.held.derived).replace('.', ',')) || !notice.includes(label(e.held.lowered.id)))) issues.push(`${id} : tenue : la mention ne nomme pas le cordage abaissé ou la valeur dérivée`);
      if (Math.abs(s.stiffness - expected) > 1e-9) issues.push(`${id} : rigidité ${s.stiffness} ≠ ${expected} (plus haut de ${e.before} et de la valeur dérivée de ${a} ${ca.stiffness} et ${b} ${cb.stiffness})`);
      const orders: [number, number][] = e.orderFixed ? [[ca.stiffness, cb.stiffness]] : [[ca.stiffness, cb.stiffness], [cb.stiffness, ca.stiffness]];
      grid: for (const ra of RAS_22) for (const t of TENS_22) {
        const eng = Math.max(...orders.map(([m, c]) => setupFirmnessIndex({ racquetStiffness: ra, mainStringStiffness: m, crossStringStiffness: c, mainTension: t, crossTension: t }).rcs));
        const mine = rcsIndex(ra, s.stiffness, t);
        if (mine < eng) { issues.push(`${id} : indice ${mine} sous ${eng}, celui du moteur pour ${a} et ${b} à RA ${ra}, ${t} kg`); break grid; }
        if (mine > eng) above22++;
      }
      if (PH.isStiffnessRankable(s) !== (e.composition === 'publiee')) issues.push(`${id} : classable alors que la composition n'est pas publiée, ou l'inverse`);
      if (!/dérivée/.test(notice) || !notice.includes(label(a)) || !notice.includes(label(b))) issues.push(`${id} : mention sans « dérivée » ou sans les deux cordages`);
    }
    if (!/prepackedHybridNotice\(/.test(pageSrc) || !/data-testid="prepacked-hybrid-notice"/.test(pageSrc)) issues.push('fiche FR : la mention des hybrides prémontés n\'est pas affichée');
    if (!/estimated:\s*Boolean\(PREPACKED_HYBRIDS\[string\.id\]\?\.components\)/.test(pageSrc)) issues.push('fiche FR : rigidité dérivée non marquée « estimé »');
    return issues;
  };
  const items22 = stringsDatabase as unknown as PItem[];
  const T0 = PH.PREPACKED_HYBRIDS;
  const page22 = existsSync(PAGE_22) ? readFileSync(PAGE_22, 'utf8') : '';
  checkPrepacked(items22, T0, page22).forEach((i) => fail(`hybrides prémontés : ${i}`));
  const nAbove = above22;
  const set22 = (id: string, patch: Partial<PItem>) => items22.map((x) => (x.id === id ? { ...x, ...patch } : x));
  const with22 = (id: string, patch: Partial<PEntry>) => ({ ...T0, [id]: { ...T0[id], ...patch } });
  const without22 = Object.fromEntries(Object.entries(T0).filter(([k]) => k !== 'wilson-duo-power'));
  const src22 = T0['wilson-duo-control'].sources[0];
  const neg24: Array<[string, string[], string]> = [
    ['fiche « Hybrid » sans entrée', checkPrepacked(items22, without22, page22), 'wilson-duo-power : fiche « Hybrid » sans composition'],
    ['rigidité dérivée non appliquée (Duo Control 188)', checkPrepacked(set22('wilson-duo-control', { stiffness: 188 }), T0, page22), 'wilson-duo-control : rigidité 188 ≠ 222'],
    ['baisse sous la valeur d\'avant', checkPrepacked(items22, with22('wilson-duo-power', { before: 230 }), page22), 'wilson-duo-power : rigidité 196 ≠ 230'],
    ['sens défavorable fixé à tort (Ice Code + NRG2)', checkPrepacked(items22, with22('tecnifibre-hybrid-ice-code-nrg2', { orderFixed: true, components: ['tecnifibre-nrg2', 'tecnifibre-ice-code'] }), page22), 'tecnifibre-hybrid-ice-code-nrg2 : rigidité 198.4 ≠ 192.6'],
    ['composant absent', checkPrepacked(items22, with22('wilson-duo-control', { components: ['x-inexistant', 'wilson-nxt-control'] }), page22), 'composant x-inexistant absent'],
    ['composant hybride', checkPrepacked(items22, with22('wilson-duo-control', { components: ['wilson-duo-power', 'wilson-nxt-control'] }), page22), 'lui-même un hybride'],
    ['composition non publiée qui bouge', checkPrepacked(set22('head-gravity-hybrid', { stiffness: 190 }), T0, page22), 'valeur de fiche conservée'],
    ['composition non publiée qui nomme des composants', checkPrepacked(items22, with22('head-gravity-hybrid', { components: ['head-lynx', 'head-hawk'] }), page22), 'composants nommés'],
    ['source sans URL https', checkPrepacked(items22, with22('wilson-duo-control', { sources: [{ ...src22, url: 'tennis-warehouse.com/x' }] }), page22), 'sans URL https'],
    ['extrait de plus de 40 mots', checkPrepacked(items22, with22('wilson-duo-control', { sources: [{ ...src22, excerpt: 'mot '.repeat(41) }] }), page22), 'extrait de 41 mots'],
    ['composition publiée sans source', checkPrepacked(items22, with22('wilson-duo-control', { sources: [] }), page22), 'publiée » sans source'],
    ['composition de fiche qui cite une source', checkPrepacked(items22, with22('tecnifibre-hybrid-ice-code-nrg2', { sources: [src22] }), page22), 'composition « fiche » qui cite'],
    ['jauges ramenées à 1.25/1.25 (Duo Power)', checkPrepacked(set22('wilson-duo-power', { gauges: ['1.25/1.25'] }), T0, page22), 'wilson-duo-power : jauges'],
    ['fiche FR sans mention', checkPrepacked(items22, T0, page22.replace(/data-testid="prepacked-hybrid-notice"/g, '')), 'mention des hybrides prémontés n\'est pas affichée'],
    ['tenue inutile (Duo Control tenu à 190, sous la valeur dérivée)', checkPrepacked(set22('wilson-duo-control', { stiffness: 190 }), with22('wilson-duo-control', { held: { ...T0['wilson-duo-control'].held!, value: 190 } }), page22), 'wilson-duo-control : tenue inutile'],
    ['tenue sans motif', checkPrepacked(items22, with22('wilson-duo-control', { held: { ...T0['wilson-duo-control'].held!, why: '' } }), page22), 'tenue sans date ou sans motif'],
    ['tenue : valeur dérivée consignée fausse (190)', checkPrepacked(items22, with22('wilson-duo-control', { held: { ...T0['wilson-duo-control'].held!, derived: 190 } }), page22), 'valeur dérivée consignée 190'],
    ['tenue : composant abaissé hors du set', checkPrepacked(items22, with22('wilson-duo-control', { held: { ...T0['wilson-duo-control'].held!, lowered: { id: 'luxilon-4g', before: 300, after: 286.9 } } }), page22), 'composant abaissé luxilon-4g mal consigné'],
    ['tenue retirée en silence (Duo Control laissé à 222)', checkPrepacked(items22, with22('wilson-duo-control', { held: undefined }), page22), 'wilson-duo-control : rigidité 222 ≠ 194.4'],
    ['fiche FR sans « estimé »', checkPrepacked(items22, T0, page22.replace(/estimated:\s*Boolean\(PREPACKED_HYBRIDS\[string\.id\]\?\.components\)/, 'estimated: false')), 'non marquée « estimé »'],
  ];
  for (const [name, found, needle] of neg24) {
    if (!found.some((i) => i.includes(needle))) fail(`hybrides prémontés : garde-fou muet sur « ${name} » (${needle})`);
  }
  if (failures.length === before24) {
    const v = Object.values(T0);
    const n = (c: string) => v.filter((e) => e.composition === c).length;
    ok(`hybrides prémontés : ${v.length} fiches « Hybrid » consignées (${n('publiee')} à composition publiée, ${n('fiche')} à composition de fiche, set introuvable, ${n('non-publiee')} non publiée : valeur conservée, hors classements) ; ` +
      `rigidité = plus haut de la valeur d'avant et de la valeur dérivée des deux cordages, recalculée, sauf ${v.filter((e) => e.held).length} tenue(s) datée(s) au-dessus (règle 2 : ${Object.keys(T0).filter((k) => T0[k].held).join(', ')}) ; indice de la fiche jamais sous celui du moteur pour les deux cordages à la même tension (${RAS_22.length} RA × ${TENS_22.length} tensions ; ${nAbove} montage(s) au-dessus, par l'arrondi au dixième supérieur) ; ` +
      `sources (URL, niveau, date, extrait), jauges et mention de la fiche FR vérifiées ; ${neg24.length} tests négatifs détectés`);
  }
}

// ---------------------------------------------------------------------------
console.log('--- audit notation raquettes/cordages ---');
notes.forEach((n) => console.log(n));
if (failures.length > 0) {
  console.error(`\n${failures.length} defaut(s) de coherence detecte(s) :\n`);
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}\n`));
  process.exit(1);
}
console.log('\nAucune incoherence de notation detectee.');
