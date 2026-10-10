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
// 1. Le RA par défaut doit être la médiane MESURÉE, et unique.
// ---------------------------------------------------------------------------
{
  const published = racquetsDatabase
    .map((r) => r.stiffness)
    .filter((v): v is number => typeof v === 'number')
    .sort((a, b) => a - b);
  const median = published[Math.floor(published.length / 2)];

  if (DEFAULT_RACQUET_RA !== median) {
    fail(
      `DEFAULT_RACQUET_RA = ${DEFAULT_RACQUET_RA} alors que la médiane mesurée ` +
        `des ${published.length} RA publiés est ${median}. Recaler la constante ` +
        `(ou justifier l'écart) dans lib/racquet-scoring.ts.`
    );
  } else {
    ok(`RA par défaut = médiane mesurée (${median}) sur ${published.length} raquettes`);
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

// ---------------------------------------------------------------------------
// 9. ALERTE SANTÉ — aucun profil ne peut la désactiver, aucune surface ne
//    peut afficher un RCS sans chemin vers un avertissement
// ---------------------------------------------------------------------------
// Défaut corrigé le 14/08/2026 : `evaluateForProfile` renvoyait « Configuration
// optimale ✅ » pour un RCS de 40 dès que l'utilisateur cochait le profil
// « Pro » (plage 31-41) — c'est-à-dire en pleine zone « très ferme, risque
// tennis elbow ». L'alerte était désactivée par la personne qu'elle protège.
// Et 3 des 4 surfaces affichant un RCS n'appelaient jamais getHealthWarning.
{
  const engines = ['public/js/rcs-calculator.js', 'public/js/rcs-calculator-en.js'];
  const PROFILS = [
    'reeducation', 'tennis_elbow', 'senior', 'debutant',
    'club', 'confirme', 'competiteur', 'expert', 'pro',
  ];

  for (const path of engines) {
    let engine: any;
    try {
      const src = readFileSync(path, 'utf8');
      engine = new Function(
        'window',
        'document',
        `${src}; return typeof RCS !== 'undefined' ? RCS : window.RCS;`
      )({}, { addEventListener() {} });
    } catch {
      continue; // l'absence du moteur est déjà signalée par le contrôle 8
    }

    const leaks: string[] = [];
    for (const p of PROFILS) {
      for (let rcs = 35; rcs <= 45; rcs++) {
        const verdict = engine.evaluateForProfile(rcs, p);
        if (verdict?.isOk === true) leaks.push(`${p} @ RCS ${rcs}`);
      }
    }
    if (leaks.length > 0) {
      fail(
        `${path} : ${leaks.length} verdict(s) favorable(s) sur un montage en zone ` +
          `d'alerte (ex. ${leaks.slice(0, 3).join(', ')}). Aucun profil de joueur ne ` +
          `doit pouvoir transformer un risque tennis elbow en « configuration optimale ».`
      );
    } else {
      ok(`${path} : aucun profil ne neutralise l'alerte santé (9 profils × RCS 35-45)`);
    }

    if (!engine.getHealthWarning || !engine.getHealthWarning(40)) {
      fail(`${path} : getHealthWarning n'émet aucune alerte à RCS 40.`);
    }
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
  const SOURCE_HOSTS: Record<string, { page: string; image: string }> = {
    'tennis-warehouse': { page: 'https://www.tennis-warehouse.com/', image: 'https://img.tennis-warehouse.com/' },
    'tennis-warehouse-europe': { page: 'https://www.tenniswarehouse-europe.com/', image: 'https://img.tenniswarehouse-europe.com/' },
    'tennis-point': { page: 'https://www.tennis-point.fr/products/', image: 'https://cdn.shopify.com/s/files/1/0638/1885/8538/' },
    'fabricant:wilson': { page: 'https://www.wilson.com/en-us/products/', image: 'https://www.wilson.com/cdn/shop/files/' },
    'fabricant:babolat': { page: 'https://www.babolat.com/fr/', image: 'https://media.babolat.com/image/upload/' },
    'fabricant:tecnifibre': { page: 'https://www.tecnifibre.com/products/', image: 'https://cdn.shopify.com/s/files/1/0907/5425/3144/files/' },
    'fabricant:yonex': { page: 'https://www.yonex.com/tennis/', image: 'https://www.yonex.com/media/catalog/product/' },
  };
  // Hôtes d'images de toutes les sources : jamais appelés par l'application ni par les fiches EN.
  const IMAGE_HOSTS_RE = /img\.tennis-?warehouse(-europe)?\.com|cdn\.shopify\.com\/s\/files|wilson\.com\/cdn\/shop|media\.babolat\.com|yonex\.com\/media\/catalog/;
  const { existsSync, readdirSync, statSync } = await import('node:fs');
  const racquetIds = new Set(racquetsDatabase.map((r) => r.id));
  const stringIds = new Set(stringsDatabase.map((s) => s.id));
  let bytes = 0;
  const listed = new Set<string>();
  for (const [id, e] of Object.entries(PRODUCT_IMAGES)) {
    const folder = racquetIds.has(id) ? 'racquets' : stringIds.has(id) ? 'strings' : null;
    if (!folder) { fail(`photo ${id} : aucun produit de ce nom dans la base`); continue; }
    if (e.file !== `/images/products/${folder}/${id}.webp`) fail(`photo ${id} : chemin inattendu ${e.file}`);
    const disk = `public${e.file}`;
    listed.add(disk.replace(/\\/g, '/'));
    if (!existsSync(disk)) { fail(`photo ${id} : fichier absent ${disk}`); continue; }
    const size = statSync(disk).size;
    bytes += size;
    if (size > 120_000) fail(`photo ${id} : ${Math.round(size / 1024)} Ko (> 120 Ko)`);
    const hosts = SOURCE_HOSTS[e.source];
    if (!hosts) { fail(`photo ${id} : source inattendue ${e.source}`); continue; }
    if (!PRODUCT_IMAGE_CREDITS[e.source]) fail(`photo ${id} : aucun libellé de crédit pour la source ${e.source}`);
    if (!e.sourcePageUrl.startsWith(hosts.page)) fail(`photo ${id} : page source invalide pour ${e.source}`);
    if (!e.sourceImageUrl.startsWith(hosts.image)) fail(`photo ${id} : image source invalide pour ${e.source}`);
    if (!e.twProduct) fail(`photo ${id} : intitulé du produit source absent (association non auditable)`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.retrievedAt)) fail(`photo ${id} : date de collecte invalide`);
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
    let illustrated = 0;
    for (const [kind, list, render] of [['racquets', enR, racquetPage], ['strings', enS, stringPage]] as const) {
      for (const item of list as Array<{ id: string }>) {
        const html: string = (render as (x: unknown, i: unknown) => string)(item, images);
        const expected = (images as Record<string, { file: string }>)[item.id];
        const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
        if (/"image"|\/images\/products\//.test(ld)) fail(`fiche EN ${kind}/${item.id} : photo propagée dans le JSON-LD`);
        if (/og:image/.test(html)) fail(`fiche EN ${kind}/${item.id} : og:image présent`);
        if (IMAGE_HOSTS_RE.test(html)) fail(`fiche EN ${kind}/${item.id} : hotlink vers la source`);
        if (expected) {
          const credit = (PRODUCT_IMAGE_CREDITS as Record<string, string>)[(expected as unknown as { source: string }).source];
          if (!html.includes(`<img src="${expected.file}"`)) fail(`fiche EN ${kind}/${item.id} : photo validée non affichée`);
          else if (!credit || !html.includes(`Photo: ${credit}`)) fail(`fiche EN ${kind}/${item.id} : crédit « Photo: ${credit} » absent`);
          else shown++;
        } else if (!html.includes('data-product-image="illustration"')) {
          fail(`fiche EN ${kind}/${item.id} : ni photo ni illustration`);
        } else illustrated++;
      }
    }
    ok(`fiches EN : ${shown} photo(s) affichée(s), ${illustrated} illustration(s), aucune photo en JSON-LD/og:image`);
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
      const expected = harmonizedRating(e, f);
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
//     (code de src/ hors données, générateurs EN, catalogue EN, fiches EN). Chaque garde
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
        const base = c === null ? null : c === 'identique' && systematic ? 'tw' : `inconnue:${c}`;
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
  ];
  for (const [name, found, needle] of negatives) {
    if (!found.some((i) => i.includes(needle))) fail(`provenance des notes : garde-fou muet sur « ${name} » (${needle})`);
  }
  if (failures.length === before) {
    const codes = Object.values(P.STRING_RATINGS_PROVENANCE).flatMap((e) => Object.values(e.fields)) as string[];
    const n = (re: RegExp) => codes.filter((c) => re.test(c)).length;
    ok(`provenance des notes : ${Object.keys(P.STRING_RATINGS_PROVENANCE).length} cordages, ${codes.length} notes publiées décrites ` +
      `(${n(/^tw$/)} reprises TW établies, ${n(/^harmonisee\+/)} harmonisées, ${n(/^testeurs$/)} testeurs seuls, ${n(/^inconnue:/)} de source inconnue), ` +
      `${Object.keys(P.TW_REVIEWS).length} revues TW, recalcul identique, aucune surface du site ne lit la provenance, ${negatives.length} tests négatifs détectés`);
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
// Fast, matière, jauge nominale) dans l'extrait VERSIONNÉ du relevé TWU et la copie des polyesters ; (d) une surface
// du site importe la provenance. Chaque garde est rejouée sur une copie altérée : un garde-fou muet fait échouer l'audit.
{
  const before = failures.length;
  const SP = await import('../src/data/string-stiffness-provenance');
  type SProv = Readonly<Record<string, (typeof SP.STRING_STIFFNESS_PROVENANCE)[string]>>;
  type TwuRow = { name: string; refTensionLbs: number; swingSpeed: string; material: string | null; stiffnessLbIn: number; gaugeNominalMm?: number | null };
  const load = (p: string) => new Map((JSON.parse(readFileSync(p, 'utf8')).records as TwuRow[]).map((r) => [r.name, r]));
  const twuRef = load(SP.STIFFNESS_SOURCE.versionedCopy); // 480 polyesters du 08/08, sans jauge nominale
  const citedRef = load(SP.STIFFNESS_SOURCE.citedLines); // extrait verbatim du relevé du 10/10 (toutes matières)
  // TWU range multifilaments et synthétiques sous « Nylon… » : la matière se vérifie par famille, pas par égalité.
  const MATERIALS: Record<string, RegExp> = { Polyester: /^Polyester$/, 'Natural Gut': /^Gut$/, Multifilament: /^(Nylon|Polyolefin)/, Synthetic: /^(Nylon|Polyolefin)/ };
  const fold = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const TWU_SUFFIX = /\s+\d{2}L?(?:\s*\((\d\.\d+)\)|\s*\/\s*(\d\.\d+))?$/;
  const checkStiffness = (strings: readonly (typeof stringsDatabase)[number][], prov: SProv, ref: Map<string, TwuRow>,
    aliases: Readonly<Record<string, string>> = LEGACY_STRING_ALIASES, cited: Map<string, TwuRow> = citedRef): string[] => {
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
        // accents et tirets ne comptent pas (« Volkl Power-Fiber II » = « Völkl Power Fiber II »).
        const sfx = TWU_SUFFIX.exec(m.twu);
        if (!sfx || fold(m.twu.slice(0, sfx.index)) !== fold(`${s.brand} ${s.model}`)) issues.push(`${id} : ligne TWU « ${m.twu} » d'un autre modèle`);
        else if ((sfx[1] ?? sfx[2]) !== undefined && Math.abs(Number(sfx[1] ?? sfx[2]) - Number(m.gauge)) > 0.005) {
          issues.push(`${id} : « ${m.twu} » mesurée en ${sfx[1] ?? sfx[2]} mm, enregistrée en ${m.gauge}`);
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
      } else {
        if (s.stiffness !== e.before) issues.push(`${id} : « ${e.status} » mais la rigidité a bougé (${e.before} -> ${s.stiffness}) sans passer par « appliquee »`);
        if (e.status === 'quarantaine' && e.measures.length > 0) issues.push(`${id} : en quarantaine avec des mesures`);
        if (e.status === 'retenue-jauge' && e.measures.length === 0) issues.push(`${id} : retenue sans mesure`);
        if (e.status === 'retenue-jauge' && top !== undefined && top >= e.before) {
          issues.push(`${id} : hausse applicable sans choix de jauge (règle C : ${top} ≥ ${e.before}), mais non appliquée`);
        }
      }
    }
    return issues;
  };
  // (d) aucune surface du site n'importe la provenance (les commentaires peuvent citer le fichier).
  const IMPORTS = /from\s*['"][^'"]*string-stiffness-provenance['"]|import\(\s*['"][^'"]*string-stiffness-provenance['"]\s*\)|STRING_STIFFNESS_PROVENANCE|STIFFNESS_SOURCE/;
  const scanSurfaces = (files: { path: string; src: string }[]) =>
    files.filter((f) => f.path !== 'src/data/string-stiffness-provenance.ts' && IMPORTS.test(f.src)).map((f) => `${f.path} lit la provenance des rigidités`);
  const walkAll = (d: string): string[] =>
    readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walkAll(`${d}/${n}`) : [`${d}/${n}`]));
  const surfaceFiles = [...walkAll('src'), ...walkAll('scripts/catalog'), ...walkAll('scripts/en-products'), ...walkAll('public/js')]
    .filter((f) => /\.(tsx?|m?js)$/.test(f)).map((p) => ({ path: p, src: readFileSync(p, 'utf8') }));
  const P0 = SP.STRING_STIFFNESS_PROVENANCE;
  const issues = [...checkStiffness(stringsDatabase, P0, twuRef), ...scanSurfaces(surfaceFiles)];
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
  // Cas permis : fiche fusionnée depuis (alias) ; son entrée reste comme historique, sans alerte.
  const afterMerge = checkStiffness(stringsDatabase.filter((s) => s.id !== 'tecnifibre-4s'), P0, twuRef, { ...LEGACY_STRING_ALIASES, 'tecnifibre-4s': 'tecnifibre-black-code-4s' });
  if (afterMerge.length > 0) fail(`rigidités de laboratoire : une fiche fusionnée (alias) fait échouer le contrôle : ${afterMerge[0]}`);
  // Cas permis : fiche retenue parce que la règle C la BAISSERAIT (GO requis) : valeur inchangée, aucune alerte.
  const held = checkStiffness(withStiffness('head-hawk', 250), patch('head-hawk', (e) => ({ ...e, status: 'retenue-jauge' as const, before: 250 })), twuRef);
  if (held.length > 0) fail(`rigidités de laboratoire : une fiche retenue (C la baisserait) fait échouer le contrôle : ${held[0]}`);
  // Relevé brut local (non versionné) : s'il est présent, l'extrait versionné lui est identique ligne à ligne.
  const RAW = 'scripts/scraper/out/twu-strings.json';
  const raw = existsSync(RAW) ? new Map((JSON.parse(readFileSync(RAW, 'utf8')) as TwuRow[]).map((r) => [r.name, r])) : null;
  if (raw) for (const [n, c] of citedRef) if (JSON.stringify(raw.get(n)) !== JSON.stringify(c)) fail(`rigidités de laboratoire : « ${n} » de l'extrait diffère du relevé brut local`);
  if (failures.length === before) {
    const count = (st: string) => Object.values(P0).filter((e) => e.status === st).length;
    const measures = Object.values(P0).reduce((a, e) => a + e.measures.length, 0);
    const merged = Object.keys(P0).filter((id) => !stringsDatabase.some((s) => s.id === id)).length;
    const ruleC = Object.values(P0).filter((e) => e.rule === 'plus-rigide').length;
    ok(`rigidités de laboratoire : ${Object.keys(P0).length} fiches en provenance (${count('appliquee')} appliquées dont ${ruleC} par la règle C, ${count('retenue-jauge')} retenues car C baisserait, ` +
      `${count('quarantaine')} en quarantaine${merged > 0 ? `, dont ${merged} ancien(s) identifiant(s) fusionné(s) servant de plancher` : ''}), ${measures} mesures TWU retrouvées dans ${SP.STIFFNESS_SOURCE.citedLines}` +
      `${raw ? ' (= relevé brut local)' : ''} et ${SP.STIFFNESS_SOURCE.versionedCopy} (modèle exact, jauge nominale, matière, ${SP.STIFFNESS_SOURCE.referenceTensionLbs} lbs / ${SP.STIFFNESS_SOURCE.swingSpeed}), ` +
      `aucune baisse sans GO, aucune surface ne lit la provenance, ${negatives.length} tests négatifs détectés`);
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
// 15. SOURCE UNIQUE DU CATALOGUE (C3, 09/10/2026)
// ---------------------------------------------------------------------------
// Le TypeScript fait foi ; les pages EN lisent public/data/catalog.json, généré
// au build. Échoue si : (a) un fichier servi sous public/ lit encore le
// catalogue dans Supabase ; (b) le JSON servi diffère du TS ; (c) le JSON est
// versionné (il serait éditable à la main) ou n'est plus généré au build ;
// (d) il cite une chaîne de testeurs ; (e) une valeur absente y est comblée.
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
  if (failures.length === before) {
    ok(`source unique : ${scanned} fichiers public/ sans lecture Supabase du catalogue, catalog.json ${state} ` +
      `(${cat.racquets.length} raquettes / ${cat.strings.length} cordages, ${nullR} RA null, ${nullS} notes null), non versionné, généré en prebuild, aucune chaîne citée`);
  }
}

// ---------------------------------------------------------------------------
// 18. NATURE DES NOTES DE CORDAGE — ÉTIQUETÉE SUR CHAQUE SURFACE FRANÇAISE
//     (principe décidé par Pierre le 10/10/2026 : « garder les notes et les étiqueter partout » ;
//      formulation des libellés et de la mention proposée par l'orchestrateur, pas encore validée)
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
// (g) un des tests négatifs permanents ne détecte plus l'altération qu'il plante.
// Affichage seulement : aucune note ni aucun calcul n'est touché. La provenance détaillée
// des notes n'est lue par aucun de ces fichiers (contrôle 13 bis, qui scanne tout src/).
{
  const before = failures.length;
  const N = await import('../src/lib/string-rating-nature');
  const { default: React } = await import('react');
  (globalThis as { React?: unknown }).React ??= React; // JSX « classique » sous tsx (Next : runtime automatique)
  const { renderToStaticMarkup } = await import('react-dom/server');
  type Nature = 'editorial' | 'harmonized' | 'none';
  // Les cinq notes affichées (comme côté EN) : « sans note » = aucune des cinq n'est publiée.
  const FIELDS5 = ['control', 'comfort', 'spin', 'power', 'durability'] as const;
  const EXPECT: Readonly<Record<Nature, string>> = {
    editorial: 'Appréciation éditoriale TSA',
    harmonized: 'Appréciation éditoriale TSA, harmonisée avec des avis de testeurs',
    none: 'Non publié',
  };
  const NOTICE =
    "Appréciation de l'équipe, non mesurée en laboratoire. La rigidité (lb/in) est la donnée du cordage utilisée par le RCS.";
  const PROPOSED = 'formulation proposée le 10/10/2026, pas encore validée par Pierre : la changer ici ET dans src/lib/string-rating-nature.ts, en connaissance de cause';

  // (a) textes figés (formulation proposée, à valider), sans chaîne de testeurs ni Tennis Warehouse, sans « rigidité mesurée ».
  for (const k of ['editorial', 'harmonized', 'none'] as const) {
    if (N.STRING_RATING_LABELS[k] !== EXPECT[k]) fail(`nature des notes : libellé « ${k} » = « ${N.STRING_RATING_LABELS[k]} », « ${EXPECT[k]} » attendu (${PROPOSED})`);
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

  // (b) la nature se déduit des notes publiées et de la liste des 18.
  const harmonizedIds = new Set(Object.keys(STRING_TESTER_RATINGS));
  const expectedNature = (s: (typeof stringsDatabase)[number]): Nature =>
    FIELDS5.every((f) => s[f] === undefined) ? 'none' : harmonizedIds.has(s.id) ? 'harmonized' : 'editorial';
  const natureCount: Record<Nature, number> = { editorial: 0, harmonized: 0, none: 0 };
  for (const s of stringsDatabase) {
    const n = N.stringRatingNature(s);
    natureCount[n]++;
    if (n !== expectedNature(s)) fail(`nature des notes : ${s.id} classé « ${n} », « ${expectedNature(s)} » attendu`);
    const label = N.stringRatingLabel(s);
    if ((n === 'none') !== (label === null) || (label !== null && label !== EXPECT[n])) fail(`nature des notes : ${s.id} (${n}) porte l’étiquette « ${label} »`);
  }
  for (const id of harmonizedIds) {
    const s = stringsDatabase.find((x) => x.id === id);
    if (s && N.stringRatingNature(s) !== 'harmonized') fail(`nature des notes : ${id} (18 harmonisés) n’est pas classé « harmonized »`);
  }
  if (natureCount.harmonized !== harmonizedIds.size) fail(`nature des notes : ${natureCount.harmonized} fiches harmonisées pour ${harmonizedIds.size} en provenance`);
  if (natureCount.editorial + natureCount.harmonized + natureCount.none !== stringsDatabase.length) fail('nature des notes : une fiche sans nature');
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
  const labelTag = (n: Nature) => `>${EXPECT[n]}<`;
  const renderFindings = (surface: string, id: string, html: string, nature: Nature): string[] => {
    const found: string[] = [];
    if (nature === 'none') {
      if (html.includes('data-rating-nature=') || html.includes('Appréciation')) found.push(`${surface} ${id} : étiquette affichée pour un cordage sans note`);
      if (!html.includes('Non publié')) found.push(`${surface} ${id} : « Non publié » absent`);
      return found;
    }
    if (!html.includes(`data-rating-nature="${nature}"`) || !html.includes(labelTag(nature))) {
      found.push(`${surface} ${id} : étiquette « ${EXPECT[nature]} » absente alors que des notes sont rendues`);
    }
    for (const other of ['editorial', 'harmonized'] as const) {
      if (other !== nature && html.includes(labelTag(other))) found.push(`${surface} ${id} : étiquette d’une autre nature (« ${EXPECT[other]} »)`);
    }
    return found;
  };
  const ficheMod = (await import('../src/app/tennis-strings/[slug]/page')) as { default: (p: { params: { slug: string } }) => never };
  const { StringCard } = await import('../src/components/product/string-card');
  let renders = 0;
  let sample: { fiche: string; id: string } | null = null;
  const renderBad: string[] = [];
  for (const s of stringsDatabase) {
    const n = N.stringRatingNature(s);
    const fiche = renderToStaticMarkup(ficheMod.default({ params: { slug: s.id } }));
    const card = renderToStaticMarkup(React.createElement(StringCard, { string: s }));
    const compact = renderToStaticMarkup(React.createElement(StringCard, { string: s, compact: true }));
    renders += 3;
    renderBad.push(...renderFindings('fiche', s.id, fiche, n), ...renderFindings('carte', s.id, card, n), ...renderFindings('carte compacte', s.id, compact, n));
    if (n !== 'none' && !fiche.includes('data-rating-notice="full"')) renderBad.push(`fiche ${s.id} : mention absente sous « Notes de jeu »`);
    if (n === 'harmonized' && !sample) sample = { fiche, id: s.id };
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
    return found;
  };
  const pdfCases: Array<[string, string, string | null, Nature, Nature | null]> = [
    ['PDF montant harmonisé', harmonizedMain.id, null, 'harmonized', null],
    ['PDF hybride harmonisé + éditorial', harmonizedMain.id, editorialCross.id, 'harmonized', 'editorial'],
    ['PDF montant éditorial', editorialCross.id, null, 'editorial', null],
  ];
  if (noneString) pdfCases.push(['PDF cordage sans note', noneString.id, null, 'none', null]);
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
    ['fiche rendue sans étiquette', sample ? renderFindings('fiche', sample.id, sample.fiche.split(EXPECT.harmonized).join(''), 'harmonized') : []],
    ['fiche rendue avec l’étiquette d’une autre nature', sample ? renderFindings('fiche', sample.id, sample.fiche.split(EXPECT.harmonized).join(EXPECT.editorial), 'harmonized') : []],
    ['étiquette sur un cordage sans note', renderFindings('carte', 'sans-note', `<p data-rating-nature="editorial">${EXPECT.editorial}</p>Non publié`, 'none')],
    ['PDF imprimé sans étiquette', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split(EXPECT.harmonized).join(''), 'harmonized', null)],
    ['PDF imprimé sans mention', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split(NOTICE).join(''), 'harmonized', null)],
    ['PDF : étiquette seule retirée du bloc des notes', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split('\n').filter((l) => l !== EXPECT.harmonized).join('\n'), 'harmonized', null)],
    ['PDF : étiquette retirée de l’analyse avancée', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split('\n').filter((l) => !l.includes('Notes utilisees')).join('\n'), 'harmonized', null)],
    ['PDF : mention retirée de la méthodologie', pdfFindings('PDF', pdfRuns[0].data, pdfRuns[0].text.split('\n').filter((l) => !l.includes('Notes /10 du cordage')).join('\n'), 'harmonized', null)],
    ['PDF hybride : étiquette du travers retirée', pdfFindings('PDF', pdfRuns[1].data, pdfRuns[1].text.split('\n').filter((l) => !l.includes('Travers')).join('\n'), 'harmonized', 'editorial')],
    ['description du catalogue annonçant des notes', layoutFindings(layoutSource.replace('de chaque référence', 'de chaque référence ; contrôle, confort, effet et durabilité quand la note existe'))],
  ];
  for (const [name, hits] of planted) if (hits.length === 0) fail(`nature des notes : garde-fou muet sur « ${name} »`);

  if (failures.length === before) {
    ok(`nature des notes : ${stringsDatabase.length} cordages = ${natureCount.harmonized} harmonisés + ${natureCount.editorial} à note éditoriale + ${natureCount.none} sans note ; ` +
      `textes figés (formulation proposée, à valider par Pierre ; aucune chaîne de testeurs, ni TW, ni « rigidité mesurée ») ; description du catalogue sans promesse de note ; ${Object.keys(SURFACES).length} surfaces déclarées portent l’étiquette ` +
      `et aucune surface de ${srcTs.length} fichiers src/ n’est restée hors liste ; ${renders} rendus serveur (fiche + carte pleine + carte compacte) étiquetés selon la nature ; ` +
      `${pdfCases.length} PDF vérifiés (données et texte imprimé) ; ${planted.length} tests négatifs détectés`);
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
console.log('--- audit notation raquettes/cordages ---');
notes.forEach((n) => console.log(n));
if (failures.length > 0) {
  console.error(`\n${failures.length} defaut(s) de coherence detecte(s) :\n`);
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}\n`));
  process.exit(1);
}
console.log('\nAucune incoherence de notation detectee.');
