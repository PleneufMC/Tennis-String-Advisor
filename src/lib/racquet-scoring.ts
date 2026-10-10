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
import { RACQUET_TESTER_RATINGS, blendRacquetNote } from '@/data/racquet-tester-ratings';

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
 * Bornes réelles du poids (g) des JUNIORS (longueur < 27 pouces) — mesurées
 * sur les 29 fiches junior le 10/10/2026 : 170-255 g, médiane 235 g.
 * Le minimum de 170 g correspond aux raquettes 19 pouces.
 *
 * (Jusqu'au 10/10/2026, `WEIGHT_RANGE` portait ici `max: 320`, le maximum
 * ADULTE : l'échelle junior n'était donc pas celle des juniors au-dessus de la
 * médiane.) Contrôle 17 de `audit:ratings` : ces bornes doivent rester celles
 * du catalogue.
 */
export const JUNIOR_WEIGHT_RANGE = { min: 170, median: 235, max: 255 } as const;

/** Bornes réelles du tamis (sq.in) — mesurées, non supposées. */
export const HEAD_SIZE_RANGE = { min: 82, median: 100, max: 115 } as const;

/**
 * Bornes du poids pour les raquettes ADULTES uniquement (mesurées : 100
 * modèles de 27 pouces et plus, 225-320 g, médiane 300 g).
 *
 * Les juniors (170-255 g) écrasent l'échelle : sur l'intervalle complet
 * 170-320 g, toutes les raquettes adultes se retrouvent tassées dans le haut
 * de la plage et leurs maniabilités deviennent indiscernables. Les notes
 * dérivées d'un modèle adulte utilisent donc cet intervalle, celles d'un
 * junior `JUNIOR_WEIGHT_RANGE`.
 */
export const ADULT_WEIGHT_RANGE = { min: 225, median: 300, max: 320 } as const;

/**
 * Nombre de cordes du plan (montants + travers) — bornes réelles du catalogue :
 * 33 (16x17) à 38 (18x20), médiane 35 (16x19). Contrôle 17 de `audit:ratings`.
 */
export const STRING_COUNT_RANGE = { min: 33, median: 35, max: 38 } as const;

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
 * Échelle LINÉAIRE unique ancrée sur la médiane (médiane -> 5), de pente fixée
 * par le plus grand des deux demi-intervalles du catalogue. Une même différence
 * de valeur donne donc partout la même différence de note, et aucune valeur du
 * catalogue n'atteint la saturation du côté le plus court.
 *
 * Pourquoi pour le poids (10/10/2026) : `scale()` est linéaire par morceaux.
 * Sur l'échelle adulte (225 / 300 / 320 g), 5 g valaient 0,33 point sous 300 g
 * et 1,25 point au-dessus ; 320 g saturait à 10/10 en stabilité (0/10 en
 * maniabilité). Rien en physique ne justifie qu'un même écart de masse compte
 * près de quatre fois plus au-dessus de 300 g : l'inertie et la quantité de
 * mouvement sont proportionnelles à la masse. Ici, 10 g = 0,67 point partout
 * (5 / 75 g par gramme) ; 225 g -> 0, 300 g -> 5, 320 g -> 6,3.
 * Sous la médiane, la pente est inchangée (elle était déjà 5 / 75 g).
 */
export function linearScore(value: number, range: { min: number; median: number; max: number }): number {
  const half = Math.max(range.median - range.min, range.max - range.median);
  if (half <= 0) return 5;
  return Math.min(10, Math.max(0, 5 + (5 * (value - range.median)) / half));
}

/**
 * Nombre de cordes du plan (montants + travers), `null` si le plan est illisible.
 * « 16x19 » -> 35. Un plan absent reste absent : la note de plan devient alors
 * neutre (5) et `basis` l'affiche « ND ».
 */
export function stringCount(pattern: string | null | undefined): number | null {
  const m = /^\s*(\d{2})\s*x\s*(\d{2})\s*$/i.exec(pattern ?? '');
  return m ? Number(m[1]) + Number(m[2]) : null;
}

/** Début du `basis` de tout profil déduit des specs (contrôlé par `audit:ratings`). */
export const PROFILE_BASIS_PREFIX = 'Déduit des caractéristiques';

/**
 * Dérive un profil de jeu à partir des specs mesurables — mêmes règles pour
 * toutes les raquettes. Aucune de ces notes n'est une mesure de test ni un avis
 * de testeur. `basis` l'explicite.
 *
 * Physique retenue (révision du 10/10/2026, une justification par règle) :
 *  - **Puissance** (inchangée) : croît avec le tamis (cordes plus longues, tamis
 *    plus souple et zone de frappe plus large) et avec la rigidité du cadre
 *    (moins d'énergie perdue en flexion du cadre).
 *  - **Contrôle** = moyenne, à parts égales, de trois facteurs physiques :
 *      1. tamis plus petit : cordes plus courtes, tamis moins déformable, angle
 *         de sortie plus régulier ;
 *      2. plan plus dense (plus de cordes, montants + travers) : tamis plus
 *         raide, sortie plus basse et plus prévisible. Variable continue : une
 *         corde de plus compte toujours dans le même sens (l'ancienne règle
 *         pénalisait le 16x19 de 0,4 mais laissait le 16x17 et le 18x16 neutres,
 *         donc mieux notés qu'un 16x19, plus dense) ;
 *      3. masse : à l'impact, une raquette plus lourde recule et tourne moins,
 *         la direction de la balle est moins perturbée.
 *    Le RA est NEUTRE en contrôle : la balle quitte le tamis (~4-5 ms) avant que
 *    le cadre n'ait achevé sa flexion (mode fondamental vers 120-180 Hz, soit
 *    une demi-période de 3 à 4 ms et plus) ; l'effet de la rigidité porte sur
 *    la vitesse de sortie, déjà comptée en puissance. Le compter aussi en
 *    contrôle (« souple = contrôle ») le comptait deux fois.
 *    À l'ordre près, un travers de plus (+1 corde) pèse environ trois fois plus
 *    que 2 in² de tamis en moins, ce qui correspond à l'estimation membrane
 *    (raideur du tamis ~ cordes / longueur : +3 % contre +1 %).
 *  - **Confort** : décroît avec le RA (cadre rigide = plus de vibrations
 *    transmises) et croît avec la masse (inertie qui absorbe le choc).
 *  - **Maniabilité** : inverse de la masse. **Stabilité** : croît avec la masse.
 *    La masse est notée sur une échelle LINÉAIRE (`linearScore`) : 10 g = 0,67
 *    point sur toute la plage adulte (225-320 g), sans saturation.
 *
 * Limite connue, mesurée : l'équilibre et le swingweight, qui décident souvent
 * de la maniabilité et de la stabilité ressenties, manquent pour la plupart des
 * fiches ; ce profil ne peut donc pas départager deux raquettes de specs
 * proches. Accord avec les avis de testeurs : PR du 10/10/2026 et contrôle 17.
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
  const wRange = isJunior ? JUNIOR_WEIGHT_RANGE : ADULT_WEIGHT_RANGE;

  const headPower = scale(head, HEAD_SIZE_RANGE);
  const raPower = scale(ra, RA_RANGE);
  // Masse : échelle linéaire, sans coude ni saturation (voir `linearScore`).
  const mass = linearScore(weight, wRange);
  // Plan : nombre de cordes, échelle linéaire ; plan illisible -> neutre (5).
  const strings = stringCount(racquet.stringPattern);
  const pattern = strings === null ? 5 : linearScore(strings, STRING_COUNT_RANGE);

  const estimated = isRacquetStiffnessEstimated(racquet);
  const plan = strings === null ? 'ND' : racquet.stringPattern;

  return {
    power: clamp10(headPower * 0.55 + raPower * 0.45),
    // Trois facteurs à parts égales ; le RA n'y entre pas (voir ci-dessus).
    control: clamp10(((10 - headPower) + pattern + mass) / 3),
    comfort: clamp10(scale(ra, RA_RANGE, true) * 0.65 + mass * 0.35),
    maneuverability: clamp10(10 - mass),
    stability: clamp10(mass),
    derived: true,
    basis: estimated
      ? `${PROFILE_BASIS_PREFIX} (tamis ${head} in², poids ${weight} g, RA ${ra} estimé, plan ${plan})`
      : `${PROFILE_BASIS_PREFIX} (tamis ${head} in², poids ${weight} g, RA ${ra}, plan ${plan})`,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
//  Profil affiché : dérivé des specs, harmonisé avec les avis de testeurs
// ─────────────────────────────────────────────────────────────────────────────
//
// Décision tsa-core du 09/10/2026 (mandat de Pierre : « harmoniser les notes »),
// même méthode que les cordages (PR #73) : pour les raquettes rapprochées avec
// certitude de génération (18 au 10/10/2026), chaque note = moyenne (profil
// dérivé des specs, avis de testeurs recalé sur l'échelle du profil). Les autres
// gardent le profil dérivé seul. `deriveRacquetProfile` reste PUREMENT dérivé
// des specs : son libellé n'est donc jamais rendu faux (règle 3). Provenance et
// règles de rapprochement : `src/data/racquet-tester-ratings.ts`.
//
// ⚠️ Ce profil a DEUX natures possibles. Il ne sert qu'aux vues d'UNE raquette
// (configurateur, PDF), où son libellé dit ce qu'il contient. Une vue qui met
// plusieurs raquettes côte à côte passe par `racquetsForComparison` (ci-dessous) :
// le 10/10/2026, `/compare` affichait dans un même bloc le profil combiné de la
// Gravity Tour et le profil dérivé de la Gravity MP, sans étiquette par raquette
// (contrôle 16 de `audit:ratings`).

/** Nature d'un profil affiché : ce que les notes contiennent. */
export type RacquetProfileNature = 'specs' | 'specs+testeurs';

export interface DisplayedRacquetProfile extends Omit<RacquetProfile, 'derived'> {
  /** `true` si l'avis de testeurs entre dans les notes. */
  withTesters: boolean;
  /** Nature des notes, vérifiable par programme (une seule par vue comparative). */
  nature: RacquetProfileNature;
  /** Libellé à afficher au-dessus des notes : il dit ce que les notes contiennent. */
  label: string;
}

export const PROFILE_LABEL_SPECS = 'Profil déduit des caractéristiques';
export const PROFILE_LABEL_BLENDED = 'Profil combiné : caractéristiques et avis de testeurs';

/** Profil à afficher pour UNE raquette (configurateur, PDF). */
export function racquetProfile(racquet: TennisRacquet): DisplayedRacquetProfile {
  const d = deriveRacquetProfile(racquet);
  const entry = RACQUET_TESTER_RATINGS[racquet.id];
  if (!entry) {
    return {
      power: d.power, control: d.control, comfort: d.comfort,
      maneuverability: d.maneuverability, stability: d.stability,
      basis: d.basis, withTesters: false, nature: 'specs', label: PROFILE_LABEL_SPECS,
    };
  }
  return {
    power: blendRacquetNote(d.power, entry, 'power'),
    control: blendRacquetNote(d.control, entry, 'control'),
    comfort: blendRacquetNote(d.comfort, entry, 'comfort'),
    maneuverability: blendRacquetNote(d.maneuverability, entry, 'maneuverability'),
    stability: blendRacquetNote(d.stability, entry, 'stability'),
    basis:
      `Moyenne de deux lectures : ${d.basis.charAt(0).toLowerCase()}${d.basis.slice(1)} ; ` +
      `avis de testeurs consolidés (génération ${entry.testedGeneration.split(' ')[0]}). ` +
      `Appréciation, pas une mesure.`,
    withTesters: true,
    nature: 'specs+testeurs',
    label: PROFILE_LABEL_BLENDED,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Vues comparatives : une seule nature de profil par vue
// ─────────────────────────────────────────────────────────────────────────────
//
// Règle (10/10/2026) : on ne met jamais côte à côte des profils de natures
// différentes. Dans une vue qui compare plusieurs raquettes, TOUTES sont notées
// sur le même profil déduit des caractéristiques ; l'avis de testeurs, quand il
// existe, est donné À PART (moyenne /20), et son absence n'est ni un bonus ni
// une pénalité (« non évaluée »).

export interface ComparableRacquet {
  racquet: TennisRacquet;
  /** Profil déduit des caractéristiques — même règle pour toutes les raquettes. */
  profile: DisplayedRacquetProfile;
  /** Moyenne des 20 critères testeurs, /20 ; `null` = non évaluée (jamais 0). */
  testerAverage20: number | null;
}

/** Échoue si une vue s'apprête à mêler des profils de natures différentes. */
export function assertSingleProfileNature(natures: readonly RacquetProfileNature[]): void {
  const distinct = new Set(natures);
  if (distinct.size > 1) {
    throw new Error(`Vue comparative : profils de natures mélangées (${[...distinct].join(', ')})`);
  }
}

/** Données d'une vue comparative (comparateur) : profils homogènes + avis à part. */
export function racquetsForComparison(racquets: readonly TennisRacquet[]): ComparableRacquet[] {
  const rows = racquets.map((racquet) => {
    const d = deriveRacquetProfile(racquet);
    const profile: DisplayedRacquetProfile = {
      power: d.power, control: d.control, comfort: d.comfort,
      maneuverability: d.maneuverability, stability: d.stability,
      basis: d.basis, withTesters: false, nature: 'specs', label: PROFILE_LABEL_SPECS,
    };
    return { racquet, profile, testerAverage20: RACQUET_TESTER_RATINGS[racquet.id]?.docxAverage20 ?? null };
  });
  assertSingleProfileNature(rows.map((r) => r.profile.nature));
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Classement « Top raquettes » — critère recommandé pour /statistics
// ─────────────────────────────────────────────────────────────────────────────
//
// Pourquoi pas le profil dérivé : il décrit des COMPROMIS (puissance contre
// contrôle, maniabilité contre stabilité), pas une qualité — sa moyenne classe
// des specs, pas des raquettes. Pourquoi pas le RA : « proche de 68 » n'a aucun
// fondement. Le seul jugement global sourcé est la moyenne des 20 critères des
// avis de testeurs. On ne classe donc QUE les raquettes rapprochées ; une
// raquette sans avis n'est ni classée ni comptée comme zéro (même règle que
// le Top cordages). Un écart < 0,5 /20 se lit comme une égalité (document source).

export interface RankedRacquet {
  racquet: TennisRacquet;
  /** Moyenne des 20 critères testeurs, /20. */
  testerAverage20: number;
}

export function rankRacquetsByTesterAverage(racquets: readonly TennisRacquet[]): RankedRacquet[] {
  return racquets
    .filter((r) => RACQUET_TESTER_RATINGS[r.id] !== undefined)
    .map((r) => ({ racquet: r, testerAverage20: RACQUET_TESTER_RATINGS[r.id].docxAverage20 }))
    .sort((a, b) => b.testerAverage20 - a.testerAverage20 || a.racquet.id.localeCompare(b.racquet.id));
}
