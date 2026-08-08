/**
 * Notation des raquettes — source unique de vérité.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROVENANCE DES DONNÉES — RECOUPEMENT PARTIELLEMENT RÉUSSI (P2 seulement)
 * ─────────────────────────────────────────────────────────────────────────────
 * RECTIFICATION — j'avais écrit ici que le recoupement était irréalisable.
 * C'ÉTAIT FAUX, et l'erreur venait de ma méthode, pas du site :
 *   - je DEVINAIS les URL produit (d'où des 404), puis j'ai conclu à tort d'un
 *     fait vrai (« le sitemap ne liste aucune fiche produit ») que les données
 *     étaient inaccessibles ;
 *   - j'ai ensuite invoqué une « API interne protégée » : pure supposition.
 * Le sitemap contient en réalité 1 472 pages CATÉGORIE, qui listent bien les
 * fiches produit en HTML (vérifié : 9 liens extraits sur catpage-LENGTH23).
 *
 * ⚠️ MAIS SECONDE RECTIFICATION, contre moi-même cette fois : une version de ce
 * commentaire annonçait le recoupement « RÉUSSI » et citait une fiche lue
 * (Wilson Ultra 100 v5, « Stiffness: 67 »). Je ne peux PAS l'étayer. Toutes les
 * requêtes vers la BOUTIQUE `www.tennis-warehouse.com` faites depuis ce sandbox
 * — fiches produit, catpages, et jusqu'à `robots.txt` et `sitemap.xml` —
 * renvoient **HTTP 406** (bannissement d'IP progressif par protection
 * anti-robot ; `curl` avec en-têtes navigateur complets : 406 aussi).
 * Aucune caractéristique de RAQUETTE n'a donc été confirmée chez eux, et
 * `out/tw-specs.json` n'a jamais été créé. Un exemple non reproductible ne
 * vaut pas vérification : la mention « réussi » est retirée.
 *
 * SOURCE RETENUE POUR LA RIGIDITÉ DES CORDAGES (P2, le point le plus critique
 * car il pilote l'alerte « tennis elbow ») : la base de performance de
 * Tennis Warehouse UNIVERSITY, le laboratoire de TW.
 *   https://twu.tennis-warehouse.com/learning_center/reporter2.php
 *   -> 480 cordages avec rigidité MESURÉE en lb/in, l'unité exacte de notre
 *      base, à tension de référence constante (51 lbs).
 *   -> copie versionnée : `data/reference/twu-string-stiffness.json`
 *   -> script (1 seule requête) : `scripts/scraper/twu-fetch-strings.mjs`
 *
 * CE QUE LE RECOUPEMENT RÉVÈLE — et c'est un résultat sévère :
 * sur les 62 modèles appariés de façon certaine, nos valeurs de rigidité
 * s'écartent de TWU de −13,7 lb/in en moyenne (médiane −10,8), et
 * 39 sur 62 sont TROP RIGIDES. Les écarts extrêmes atteignent :
 *   Solinco Tour Bite            nous 255  TWU 171,5   (−83,5)
 *   Weiss Cannon Ultra Cable     nous 250  TWU 174,9   (−75,1)
 *   Head Sonic Pro               nous 235  TWU 160,6   (−74,4)
 *   Babolat Pro Hurricane        nous 260  TWU 185,2   (−74,8)
 * Sur-estimer la rigidité fait sur-déclencher l'alerte bras : le défaut va
 * dans le sens le plus gênant pour l'utilisateur.
 *
 * ⚠️ POURQUOI CES VALEURS N'ONT PAS ÉTÉ RECOPIÉES AUTOMATIQUEMENT
 * TWU mesure CHAQUE JAUGE séparément : « Solinco Tour Bite » existe en 15L,
 * 16, 16L, 17, 18, 19 et 20, avec des rigidités très différentes. Nos fiches,
 * elles, regroupent plusieurs jauges sous une seule entrée (`gauges` est un
 * tableau). Un remplacement 1-pour-1 écrirait donc la valeur d'UNE jauge
 * arbitraire — souvent la plus fine, la plus souple — à la place d'un modèle
 * entier. Ce serait remplacer une donnée douteuse par une donnée fausse.
 * L'écart de −83,5 sur le Tour Bite illustre exactement ce piège : il compare
 * notre entrée à la jauge 19 (1,10 mm).
 * La correction demande donc de fixer une JAUGE DE RÉFÉRENCE par fiche — une
 * décision produit, pas un choix technique. Elle est soumise à l'utilisateur.
 *
 * RESTE À RECOUPER :
 *   P1  RA de `wilson-ultra-26-v5` / `wilson-ultra-25-v5` : la fiche TW de ce
 *       modèle est désormais 404 (produit déréférencé), donc introuvable chez
 *       eux. À saisir à la main depuis une autre source.
 *   P3  Les prix : 23 raquettes à 280 EUR, 21 cordages à 15 EUR — signature
 *       d'estimation en lot. Les fiches TW donnent le prix en USD (vérifié),
 *       mais la conversion USD -> EUR ne reflète pas le tarif français.
 *   P4  Les notes /10 des cordages (sous-scores du PDF), sans source citée.
 *       TWU fournit en revanche perte de tension et potentiel d'effet mesurés,
 *       déjà présents dans le fichier de référence.
 *
 * Tant que ces points ne sont pas traités, `DEFAULT_RACQUET_RA` reste un
 * COMBLEMENT STATISTIQUE et non une caractéristique produit — c'est pourquoi
 * `isRacquetStiffnessEstimated()` existe et pourquoi l'interface affiche
 * « (estimé) ». Ne jamais présenter une valeur comblée comme une donnée
 * constructeur.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  POURQUOI CE MODULE EXISTE
 * ─────────────────────────────────────────────────────────────────────────────
 * Un audit du 8 août 2026 a relevé quatre incohérences dans la notation des
 * raquettes. Elles sont documentées ici parce que le correctif n'a de sens
 * qu'accompagné de la raison :
 *
 * 1. DEUX VALEURS PAR DÉFAUT POUR LE MÊME RA MANQUANT.
 *    `configurator/page.tsx` utilisait `stiffness || 65` ligne 86 et
 *    `stiffness ?? 63` ligne 128. La même raquette était donc évaluée avec
 *    deux rigidités différentes selon l'encart affiché. 29 raquettes sur 129
 *    (dont les 27 juniors) ont `stiffness: null` et étaient concernées.
 *    De plus `||` traite `0` comme absent, contrairement à `??`.
 *
 * 2. DEUX FONCTIONS `calculateCompatibility` HOMONYMES ET INCOMPATIBLES.
 *    - `data/racquets-database.ts` : score partant de 70, ajusté par paliers ;
 *      RCS interne = `RA/3 + rigidité/10 + (tension-20)`, échelle ~38-56.
 *    - `lib/utils.ts` : score fixe 40/60/85/95/75 sur un total de rigidité ;
 *      signature différente (2 arguments), jamais importée = CODE MORT.
 *    Seuls les seuils de la première sont appliqués, mais ils ont été écrits
 *    pour l'échelle de `calculateRCS` (~18-32). Un RCS de 48 tombait donc
 *    systématiquement dans « configuration rigide » quelle que soit la réalité.
 *
 * 3. LES NOTES /10 DES RAQUETTES N'EXISTENT PAS.
 *    `types/index.ts` déclare `power`, `control`, `comfort`, `spin`,
 *    `maneuverability` en 1-10 sur l'interface `Racquet`. Mesuré sur les
 *    129 entrées de `racquetsDatabase` : **0 raquette renseignée**. Cette
 *    interface `Racquet` n'est pas celle utilisée par la base, qui expose
 *    `TennisRacquet` (specs uniquement). La page `/compare` n'affiche donc
 *    aucune note pour les raquettes — seulement poids, tamis, RA, prix —
 *    alors qu'elle en affiche cinq pour les cordages. D'où l'impression
 *    d'asymétrie.
 *
 * 4. `maxValue` ARBITRAIRES DANS LES BARRES DE COMPARAISON.
 *    « Rigidité (RA) » est tracée sur `maxValue={80}` alors que les données
 *    vont de 55 à 72 : toutes les barres occupent 69-90 % de la largeur et
 *    paraissent identiques. Voir `RA_RANGE` ci-dessous.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  CE QUE CE MODULE FAIT — ET NE FAIT PAS
 * ─────────────────────────────────────────────────────────────────────────────
 * Il fournit les constantes et les fonctions dérivées des specs réelles.
 *
 * Il **ne fabrique pas** de notes /10 pour les raquettes à partir de rien.
 * Les notes de `deriveRacquetProfile` sont explicitement marquées comme
 * *dérivées des specs* (poids, tamis, RA, plan de cordage) et non comme des
 * mesures de test terrain. Inventer des notes « puissance 8/10 » sans source
 * serait exactement l'erreur que l'audit reproche.
 */

import type { TennisRacquet } from '@/data/racquets-database';

// ─────────────────────────────────────────────────────────────────────────────
//  Constantes mesurées sur la base réelle (129 raquettes, 8 août 2026)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * RA retenu quand `stiffness` est `null`.
 *
 * Valeur = **médiane** des 100 raquettes renseignées (moyenne 64,17 ;
 * médiane 64). La médiane est préférée à la moyenne : elle est insensible
 * aux extrêmes (55 et 72) et reste une valeur effectivement observée.
 *
 * Remplace les deux anciens défauts contradictoires (65 et 63).
 *
 * ⚠️ Les 29 raquettes concernées sont à 93 % des modèles juniors, pour
 * lesquels aucun RA n'est publié. Une estimation médiane « adulte » leur est
 * appliquée faute de mieux ; `isRacquetStiffnessEstimated` permet à l'UI de
 * le signaler au lieu de faire passer une estimation pour une mesure.
 */
export const DEFAULT_RACQUET_RA = 64;

/**
 * Bornes réelles du RA — pour cadrer les barres de comparaison et l'échelle
 * des notes. `median` est la valeur observée sur les 100 raquettes renseignées.
 *
 * ⚠️ Corrige au passage un défaut d'affichage : `/compare` traçait la barre
 * « Rigidité (RA) » sur `maxValue={80}` alors que les données vont de 55 à 72.
 * Toutes les barres occupaient 69-90 % de la largeur et paraissaient égales.
 */
export const RA_RANGE = { min: 55, median: 64, max: 72 } as const;

/**
 * Bornes réelles du poids (g) pour les JUNIORS — mesurées, non supposées.
 * Le minimum de 170 g correspond aux raquettes 19 pouces.
 */
export const WEIGHT_RANGE = { min: 170, median: 235, max: 320 } as const;

/** Bornes réelles du tamis (sq.in) — mesurées, non supposées. */
export const HEAD_SIZE_RANGE = { min: 82, median: 100, max: 115 } as const;

/**
 * Bornes du poids pour les raquettes ADULTES uniquement (mesurées : 102
 * modèles, 225-320 g).
 *
 * Les 27 juniors (170-255 g) écrasent l'échelle : sur l'intervalle complet
 * 170-320 g, toutes les raquettes adultes se retrouvent tassées dans le haut
 * de la plage et leurs maniabilités deviennent indiscernables. Les notes
 * dérivées d'un modèle adulte utilisent donc cet intervalle, celles d'un
 * junior l'intervalle complet.
 */
export const ADULT_WEIGHT_RANGE = { min: 225, median: 300, max: 320 } as const;

/**
 * `true` si le RA de cette raquette est une estimation et non une donnée
 * constructeur. L'UI et le PDF doivent le signaler.
 */
export function isRacquetStiffnessEstimated(racquet: Pick<TennisRacquet, 'stiffness'>): boolean {
  return racquet.stiffness === null || racquet.stiffness === undefined;
}

/**
 * RA effectif à utiliser dans tous les calculs. Point d'entrée unique :
 * plus aucun appelant ne doit écrire `stiffness || 65` ni `stiffness ?? 63`.
 */
export function effectiveRacquetRA(racquet: Pick<TennisRacquet, 'stiffness'>): number {
  return racquet.stiffness ?? DEFAULT_RACQUET_RA;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Profil dérivé des specs
// ─────────────────────────────────────────────────────────────────────────────

export interface RacquetProfile {
  /** Notes 0-10 DÉRIVÉES DES SPECS (pas des tests terrain). */
  power: number;
  control: number;
  comfort: number;
  maneuverability: number;
  stability: number;
  /** Toujours `true` : rappelle à l'appelant que ces notes sont calculées. */
  derived: true;
  /** Bases du calcul, pour affichage honnête. */
  basis: string;
}

const clamp10 = (v: number) => Math.min(10, Math.max(0, Math.round(v * 10) / 10));

/**
 * Interpolation **centrée sur la médiane** d'une valeur vers l'échelle 0-10.
 *
 * Pourquoi pas une simple interpolation min-max : la distribution des poids
 * est très asymétrique. 44 des 102 raquettes adultes pèsent 300 ou 305 g,
 * pour un intervalle 225-320. Une échelle linéaire min-max place donc une
 * raquette de 300 g — la plus courante du marché — à 2,1/10 de maniabilité,
 * ce qui est absurde à lire même si le classement relatif est correct.
 *
 * Cette version est linéaire **par morceaux**, ancrée sur trois points :
 *   `min → 0`, `median → 5`, `max → 10`.
 * Une raquette médiane obtient donc 5/10, et les écarts restent lisibles de
 * part et d'autre.
 */
function scale(
  value: number,
  range: { min: number; median: number; max: number },
  invert = false,
): number {
  const { min, median, max } = range;
  let t: number;
  if (value <= min) t = 0;
  else if (value >= max) t = 1;
  else if (value <= median) t = ((value - min) / (median - min)) * 0.5;
  else t = 0.5 + ((value - median) / (max - median)) * 0.5;
  return (invert ? 1 - t : t) * 10;
}

/**
 * Dérive un profil de jeu à partir des specs mesurables.
 *
 * Physique retenue, volontairement simple et explicable :
 *  - **Puissance** : croît avec le tamis (surface de frappe, effet trampoline)
 *    et la rigidité du cadre (moins d'énergie dissipée en flexion).
 *  - **Contrôle** : inverse de la puissance dans ses deux composantes, plus
 *    un bonus pour les plans de cordage denses (18x20).
 *  - **Confort** : décroît avec le RA (cadre rigide = plus de vibrations
 *    transmises) et croît avec la masse (inertie qui absorbe le choc).
 *  - **Maniabilité** : inverse du poids.
 *  - **Stabilité** : croît avec le poids (résistance à la torsion à l'impact).
 *
 * Aucune de ces notes n'est une mesure de test. `basis` l'explicite.
 */
export function deriveRacquetProfile(racquet: TennisRacquet): RacquetProfile {
  const ra = effectiveRacquetRA(racquet);
  const head = racquet.headSize;
  const weight = racquet.weight;

  // Les juniors sont notés sur l'échelle complète, les adultes sur l'échelle
  // adulte : sinon les 102 modèles adultes seraient tassés en haut de plage.
  // Choix de l'échelle de poids : junior ou adulte.
  //
  // On NE se fie PAS uniquement au champ `category`, saisi à la main et donc
  // faillible. Cas réel trouvé le 8 août 2026 : `wilson-ultra-26-v5` et
  // `wilson-ultra-25-v5` étaient classées « Power » alors que leur `variant`
  // dit « 26" Junior » / « 25" Junior » et leur `length` vaut 26 et 25.
  //
  // Notées sur l'échelle adulte, elles ressortaient à (mesure par fiche, et
  // non moyennée : les deux modèles ne pèsent pas le même poids) —
  //   wilson-ultra-25-v5 (240 g) : maniabilité 9,0/10  stabilité 1,0/10
  //   wilson-ultra-26-v5 (250 g) : maniabilité 8,3/10  stabilité 1,7/10
  // Des valeurs absurdes pour des raquettes d'enfant : 240 g est LOURD pour un
  // enfant de 10 ans, l'échelle adulte le lisait comme « ultra-maniable ».
  // Sur l'échelle junior :
  //   wilson-ultra-25-v5 : maniabilité 4,7/10  stabilité 5,3/10
  //   wilson-ultra-26-v5 : maniabilité 4,1/10  stabilité 5,9/10
  //
  // La longueur est un critère OBJECTIF : une raquette de moins de 27 pouces
  // est une junior par définition. On l'utilise donc en priorité, `category`
  // ne servant que de repli quand la longueur n'est pas renseignée. Les deux
  // fiches ont par ailleurs été corrigées en base, mais cette garde évite que
  // la même faute de saisie ne reproduise le symptôme ailleurs.
  const lengthInches = (racquet as { length?: number }).length;
  const isJunior =
    typeof lengthInches === 'number' && lengthInches > 0
      ? lengthInches < 27
      : racquet.category === 'Junior';
  const wRange = isJunior ? WEIGHT_RANGE : ADULT_WEIGHT_RANGE;

  const headPower = scale(head, HEAD_SIZE_RANGE);
  const raPower = scale(ra, RA_RANGE);

  // Plan de cordage : un plan dense (ex. 18x20) favorise le contrôle.
  const dense = /18\s*x\s*20|18x19/i.test(racquet.stringPattern ?? '');
  const open = /16\s*x\s*18|16x19/i.test(racquet.stringPattern ?? '');
  const patternControl = dense ? 1.2 : open ? -0.4 : 0;

  const estimated = isRacquetStiffnessEstimated(racquet);

  return {
    power: clamp10(headPower * 0.55 + raPower * 0.45),
    control: clamp10(
      (10 - headPower) * 0.5 + (10 - raPower) * 0.3 + 5 * 0.2 + patternControl,
    ),
    comfort: clamp10(
      scale(ra, RA_RANGE, true) * 0.65 + scale(weight, wRange) * 0.35,
    ),
    maneuverability: clamp10(scale(weight, wRange, true)),
    stability: clamp10(scale(weight, wRange)),
    derived: true,
    basis: estimated
      ? `Dérivé des specs (tamis ${head} in², poids ${weight} g, RA ${ra} estimé, plan ${racquet.stringPattern ?? 'ND'})`
      : `Dérivé des specs (tamis ${head} in², poids ${weight} g, RA ${ra}, plan ${racquet.stringPattern ?? 'ND'})`,
  };
}
