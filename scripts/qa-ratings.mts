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
import { racquetsDatabase, calculateCompatibility } from '../src/data/racquets-database';
import { stringsDatabase } from '../src/data/strings-database';
import { calculateAdvancedRcs, stringTypeToFamily } from '../src/lib/advanced-rcs';
import {
  DEFAULT_RACQUET_RA,
  RA_RANGE,
  effectiveRacquetRA,
  deriveRacquetProfile,
} from '../src/lib/racquet-scoring';

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
  const stringMax = Math.max(...stringsDatabase.map((s) => s.price.europe));
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
console.log('--- audit notation raquettes/cordages ---');
notes.forEach((n) => console.log(n));
if (failures.length > 0) {
  console.error(`\n${failures.length} defaut(s) de coherence detecte(s) :\n`);
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}\n`));
  process.exit(1);
}
console.log('\nAucune incoherence de notation detectee.');
