/**
 * RCS Avancé — analyse multi-facteurs réservée Premium.
 *
 * Le « RCS simple » existant (cf. `calculateRCS` dans `data/strings-database.ts`)
 * ne renvoie qu'un indice de fermeté global. Le RCS avancé conserve cet indice
 * comme socle puis le complète par :
 *   - 5 sous-scores 0-100 (puissance / contrôle / confort / spin / durabilité)
 *   - des recommandations personnalisées et actionnables (pondérées par le
 *     profil joueur : niveau, style, sensibilité du bras).
 *
 * ⚠️ Fonction PURE et NOUVELLE : elle ne modifie aucune formule existante
 * (non-régression). Elle prend des entrées primitives normalisées — les
 * helpers `fromConfiguration*` adaptent les objets des bases de données.
 *
 * Repères issus des données réelles (mesurés le 8 août 2026) :
 *   - Raquette RA (`stiffness`) : 55–72, médiane **64** (moyenne 64,17).
 *     29 des 129 raquettes n'ont pas de RA publié (27 juniors + 2 «Power»).
 *   - Cordage rigidité (`stiffness`, lb/in) : poly ~205–235, multi ~165–190,
 *     boyau ~150–170. Centré ~195.
 *   - Tension : plage usuelle 18–28 kg, centrée 24.
 */

// =====================
// Types
// =====================

import { calculateRCS } from '@/data/strings-database';

export type RcsLevel = 'excellent' | 'good' | 'moderate' | 'poor';
export type StringFamily = 'polyester' | 'multifilament' | 'gut' | 'synthetic' | 'hybrid' | 'other';

export interface AdvancedRcsInput {
  /**
   * RA de la raquette (rigidité cadre).
   * Utilisez `effectiveRacquetRA()` de `lib/racquet-scoring` pour l'obtenir :
   * il applique le RA par défaut (64, convention du site) quand la donnée est absente.
   */
  racquetStiffness: number;
  /** Poids de la raquette en grammes (optionnel). */
  racquetWeight?: number;
  /** Taille de tamis en sq.in (optionnel). */
  racquetHeadSize?: number;

  /** Rigidité du cordage principal (lb/in). */
  mainStringStiffness: number;
  /** Famille du cordage principal (pour spin / durabilité / confort). */
  mainStringFamily: StringFamily;
  /** Ratings 1-10 du cordage principal (issus de la base). */
  mainRatings: StringRatings;
  /** Jauge du cordage principal en mm (ex. 1.25). Optionnel. */
  mainGaugeMm?: number;

  /** Cordage croisé (hybride) — optionnel. */
  crossStringStiffness?: number;
  crossStringFamily?: StringFamily;
  crossRatings?: StringRatings;
  crossGaugeMm?: number;

  /** Tension principale (kg). */
  mainTension: number;
  /** Tension croisée (kg). Défaut = mainTension. */
  crossTension?: number;

  /** Profil joueur (optionnel) : personnalise les recommandations. */
  profile?: PlayerProfile;
}

/**
 * Notes /10 optionnelles (option A, 29/09/2026) : aucune source ne les publie.
 * Un sous-score qui dépend d'une note absente vaut `null` (« non disponible »),
 * jamais une valeur par défaut.
 */
export interface StringRatings {
  control?: number; // /10
  comfort?: number; // /10
  spin?: number; // /10
  power?: number; // /10
  durability?: number; // /10
}

export interface PlayerProfile {
  level?: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  style?: 'baseline' | 'all-court' | 'serve-volley' | 'defensive';
  /** Sensibilité du bras / antécédents de tennis elbow. */
  armSensitive?: boolean;
}

export interface AdvancedRcsResult {
  /**
   * Indice de fermeté du montage (formule RCS simple existante), hybride compris : cf. `setupFirmnessIndex`. C'est l'indice que
   * l'alerte bras lit, que le configurateur affiche et que le PDF imprime.
   */
  rcs: number;
  /** Hybride seulement (`null` sinon) : bornes de l'estimation et mention à afficher à côté de l'indice. */
  hybrid: HybridIndexBounds | null;
  /** Niveau de synthèse — `null` si un sous-score n'est pas calculable. */
  level: RcsLevel | null;
  /** Score global 0-100 — `null` si un sous-score n'est pas calculable. */
  overall: number | null;
  /** Sous-scores 0-100 — `null` quand la note /10 dont ils dépendent est absente. */
  subScores: {
    power: number | null;
    control: number | null;
    comfort: number | null;
    spin: number | null;
    durability: number | null;
  };
  /** Recommandations actionnables (personnalisées si profil fourni). */
  recommendations: string[];
  /** Alertes (ex. risque tennis elbow). */
  warnings: string[];
  /** Synthèse courte. */
  summary: string;
}

/** Bornes de l'indice d'un hybride (cf. `setupFirmnessIndex`). */
export interface HybridIndexBounds {
  /** Indice des montants seuls, à la tension des montants. */
  mains: number;
  /** Indice des travers seuls, à la tension des travers. */
  crosses: number;
  /** Mention affichée et imprimée à côté de l'indice : « estimation pour un hybride, entre X et Y ». */
  note: string;
}

// =====================
// Seuils d'alerte bras
// =====================

/**
 * Seuils d'alerte bras sur l'indice de fermeté (RCS), tels que `armRisk` les applique plus bas dans `calculateAdvancedRcs` : dès 32
 * pour un bras sensible déclaré, dès 35 sinon. Le second filet « confort » est un autre critère, non repris ici.
 *
 * MIROIR EXPORTÉ, pas la source : les littéraux de `armRisk` restent écrits en clair parce que
 * `scripts/blog-covers/build-rigidite-figures.mts` les relit dans ce fichier par expression régulière. Cette paire sert aux textes
 * qui doivent citer les seuils sans les recopier à la main (la méthodologie du PDF, via `lib/pdf-configuration-data`). Le contrôle
 * 21 bis de `audit:ratings` la compare au comportement du moteur (sondage de `calculateAdvancedRcs`) : changer l'un sans l'autre échoue.
 */
export const ARM_ALERT_RCS = { sensitive: 32, standard: 35 } as const;

// =====================
// Helpers internes
// =====================

const clamp = (v: number, min = 0, max = 100) => Math.min(max, Math.max(min, v));
const round = (v: number) => Math.round(v);

/**
 * Indice de fermeté RCS (identique à la formule simple de strings-database).
 * Réexposé ici pour garder la fonction avancée autonome et testable.
 * Plus la valeur est haute, plus le setup est rigide (moins confortable).
 */
/**
 * Indice de fermeté — délègue à `calculateRCS` (data/strings-database), qui est
 * la source unique depuis le 14/08/2026.
 *
 * Cette fonction était auparavant une COPIE caractère pour caractère de
 * `calculateRCS`. Deux copies d'une même formule finissent toujours par
 * diverger : c'est exactement ce qui s'est produit avec le moteur statique
 * anglais, resté figé sur une calibration de janvier pendant que le TypeScript
 * était recalibré. On garde le nom (utilisé par l'analyse avancée) mais plus
 * l'implémentation.
 */
export function rcsIndex(racquetStiffness: number, stringStiffness: number, tension: number): number {
  return calculateRCS(racquetStiffness, stringStiffness, tension);
}

/** Pondération hybride : le cordage principal domine le ressenti (60/40). */
function blend(main: number, cross: number | undefined): number {
  if (cross === undefined || Number.isNaN(cross)) return main;
  return main * 0.6 + cross * 0.4;
}

/** Entrées de l'indice d'un montage : un sous-ensemble de celles du moteur. */
export type SetupFirmnessInput = Pick<
  AdvancedRcsInput,
  'racquetStiffness' | 'mainStringStiffness' | 'crossStringStiffness' | 'mainTension' | 'crossTension'
>;

/**
 * Indice de fermeté d'un montage, hybride compris. SOURCE UNIQUE de l'indice que l'alerte bras lit (`calculateAdvancedRcs`), que
 * le configurateur affiche et que le PDF imprime (22/10/2026). Sans travers, rien ne change : indice du cordage à la tension
 * moyenne.
 *
 * Hybride (décision (b)+(a) de l'orchestrateur, 22/10/2026) : l'indice est le PLUS HAUT de deux estimations, pour qu'aucune ne
 * fasse disparaître une alerte que l'autre déclenche :
 *   - la pondération 60/40 des rigidités (montants dominants) à la tension moyenne, l'indice du moteur jusqu'ici ;
 *   - la moyenne 50/50 des indices des montants et des travers, CHACUN À SA TENSION : le « RCS Moyen » que la page calculait à
 *     part, corrigé (elle prenait les montants à la tension moyenne, soit 0,25 point de moins en moyenne aux tensions par défaut).
 * La formule est linéaire avant l'arrondi : la moyenne des deux indices à leur tension est l'indice de la rigidité moyenne à la
 * tension moyenne. Le plus haut des deux est donc l'indice d'une rigidité effective égale à la moyenne des deux rigidités plus
 * 0,1 × (montants − travers) quand les montants sont plus rigides, à la tension moyenne. Un seul arrondi, celui de
 * `calculateRCS` : le palier (`getStringRecommendation`) et le seuil d'alerte lisent le même entier.
 *
 * Bornes : indices des montants seuls et des travers seuls, chacun à sa tension. La mention dit « estimation » : aucune mesure
 * n'existe pour un hybride. Le contrôle 21 ter de `audit:ratings` vérifie tout cela sur une grille d'hybrides.
 */
export function setupFirmnessIndex(input: SetupFirmnessInput): { rcs: number; hybrid: HybridIndexBounds | null } {
  const { racquetStiffness, mainStringStiffness: main, crossStringStiffness: cross, mainTension } = input;
  const crossTension = input.crossTension ?? mainTension;
  const avgTension = (mainTension + crossTension) / 2;
  if (cross === undefined || Number.isNaN(cross)) {
    return { rcs: rcsIndex(racquetStiffness, main, avgTension), hybrid: null };
  }
  const rcs = rcsIndex(racquetStiffness, Math.max(blend(main, cross), (main + cross) / 2), avgTension);
  const mains = rcsIndex(racquetStiffness, main, mainTension);
  const crosses = rcsIndex(racquetStiffness, cross, crossTension);
  return { rcs, hybrid: { mains, crosses, note: hybridIndexNote(rcs, mains, crosses) } };
}

/**
 * Mention de l'indice d'un hybride : « entre X et Y » seulement quand c'est vrai. L'indice n'est jamais sous les deux bornes (il
 * vaut au moins la moyenne 50/50). Il peut les dépasser quand des montants plus rigides sont montés moins tendus que les travers :
 * le 60/40 à la tension moyenne excède alors l'indice de chaque cordage seul d'au plus 0,05 point par kg de tension de plus aux
 * travers, avant arrondi, et l'arrondi peut en faire un point. La mention le dit au lieu d'un « entre » faux ; l'indice n'est
 * jamais ramené dans les bornes, ce serait baisser l'indice que l'alerte lit (règle 2).
 */
function hybridIndexNote(rcs: number, mains: number, crosses: number): string {
  const lo = Math.min(mains, crosses);
  const hi = Math.max(mains, crosses);
  if (rcs > hi) return `estimation pour un hybride, au-dessus des montants seuls (${mains}) et des travers seuls (${crosses})`;
  if (lo === hi) return `estimation pour un hybride, montants seuls et travers seuls à ${lo}`;
  return `estimation pour un hybride, entre ${lo} et ${hi}`;
}

/** Bonus/malus spin selon la famille de cordage (poly > synthétique > multi > boyau). */
function familySpinBonus(family: StringFamily): number {
  switch (family) {
    case 'polyester':
      return 12;
    case 'synthetic':
      return 4;
    case 'hybrid':
      return 6;
    case 'multifilament':
      return -4;
    case 'gut':
      return -8;
    default:
      return 0;
  }
}

/** Bonus confort selon la famille (boyau/multi confortables, poly raide). */
function familyComfortBonus(family: StringFamily): number {
  switch (family) {
    case 'gut':
      return 12;
    case 'multifilament':
      return 8;
    case 'synthetic':
      return 2;
    case 'polyester':
      return -10;
    default:
      return 0;
  }
}

// =====================
// Cœur du calcul
// =====================

export function calculateAdvancedRcs(input: AdvancedRcsInput): AdvancedRcsResult {
  const {
    racquetStiffness,
    racquetWeight,
    racquetHeadSize,
    mainStringStiffness,
    mainStringFamily,
    mainRatings,
    mainGaugeMm,
    crossStringStiffness,
    crossRatings,
    crossGaugeMm,
    mainTension,
    profile,
  } = input;

  const crossTension = input.crossTension ?? mainTension;
  const avgTension = (mainTension + crossTension) / 2;

  // Rigidité de cordage effective des sous-scores (pondérée hybride 60/40). L'indice, lui, vient de `setupFirmnessIndex`.
  const effStringStiffness = blend(mainStringStiffness, crossStringStiffness);
  const effGauge = blend(mainGaugeMm ?? 1.25, crossGaugeMm);

  // Ratings effectifs (pondérés hybride, sur 10). Note absente sur le montant
  // ou sur le travers d'un hybride => `null` : on ne mélange pas une note
  // connue avec une note inconnue, et on n'en fabrique pas.
  const r = (key: keyof StringRatings): number | null => {
    const main = mainRatings[key];
    if (main === undefined) return null;
    if (!crossRatings) return main;
    const cross = crossRatings[key];
    return cross === undefined ? null : blend(main, cross);
  };

  // Indice de fermeté du montage (socle, formule existante), hybride compris : celui que l'alerte bras lit plus bas. Les
  // sous-scores gardent la pondération 60/40 ; pour un hybride, seuls l'indice et l'alerte qui le lit changent (22/10/2026).
  const { rcs, hybrid } = setupFirmnessIndex(input);

  // --- Écarts normalisés (autour des centres "données réelles") ---
  // RA : 55-72. Centre = RA par défaut (64, convention du site ; médiane des RA publiés : 64 le 08/08, 65 le 26/10/2026) — choisi sur les 100 raquettes dont le RA
  // est publié — et non 63 comme écrit initialement de mémoire. Aligné sur
  // DEFAULT_RACQUET_RA de lib/racquet-scoring.ts. >0 => cadre rigide.
  const raDev = racquetStiffness - 64;
  // Tension : centrée 24. >0 => tension haute (plus de contrôle, moins de puissance/confort).
  const tDev = avgTension - 24;
  // Rigidité cordage : centrée 195. >0 => cordage raide.
  const stiffDev = effStringStiffness - 195;

  // --- Sous-score CONTRÔLE ---
  // Ratings contrôle + tension haute + cordage/cadre rigides.
  // On part d'une base à 90% du rating pour laisser de la marge aux bonus.
  const rControl = r('control');
  let control: number | null = null;
  if (rControl !== null) {
    let c = rControl * 9;
    c += tDev * 1.3; // +1 kg ≈ +1.3 contrôle
    c += stiffDev * 0.05;
    c += raDev * 0.35;
    control = clamp(c);
  }

  // --- Sous-score PUISSANCE (souvent inverse du contrôle) ---
  const rPower = r('power');
  let power: number | null = null;
  if (rPower !== null) {
    let p = rPower * 10;
    p -= tDev * 1.8; // tension basse => plus de puissance
    if (racquetHeadSize) p += (racquetHeadSize - 98) * 0.6; // grand tamis => trampoline
    p += raDev * 0.5; // cadre rigide => restitue plus d'énergie
    power = clamp(p);
  }

  // --- Sous-score CONFORT (pénalisé par la rigidité globale) ---
  const rComfort = r('comfort');
  let comfort: number | null = null;
  if (rComfort !== null) {
    let c = rComfort * 10;
    c += familyComfortBonus(mainStringFamily);
    c -= raDev * 0.7; // cadre rigide => moins confortable
    c -= stiffDev * 0.08; // cordage raide => moins confortable
    c -= tDev * 1.2; // tension haute => moins confortable
    if (racquetWeight && racquetWeight >= 300) c += 4; // masse => absorbe les vibrations
    comfort = clamp(c);
  }

  // --- Sous-score SPIN ---
  const rSpin = r('spin');
  let spin: number | null = null;
  if (rSpin !== null) {
    let s = rSpin * 9;
    s += familySpinBonus(mainStringFamily);
    if (effGauge) s += (1.25 - effGauge) * 25; // jauge fine => plus de morsure
    spin = clamp(s);
  }

  // --- Sous-score DURABILITÉ ---
  const rDurability = r('durability');
  let durability: number | null = null;
  if (rDurability !== null) {
    let d = rDurability * 10;
    if (effGauge) d += (effGauge - 1.25) * 40; // jauge épaisse => plus durable
    if (mainStringFamily === 'polyester') d += 6;
    if (mainStringFamily === 'gut') d -= 8;
    durability = clamp(d);
  }

  // --- Score global (moyenne pondérée) ---
  // Le confort pèse plus lourd (santé du bras = priorité TSA).
  // Un seul sous-score absent suffit à rendre le score global non calculable.
  const overall =
    control === null || power === null || comfort === null || spin === null || durability === null
      ? null
      : round(control * 0.22 + power * 0.2 + comfort * 0.3 + spin * 0.18 + durability * 0.1);

  const level: RcsLevel | null =
    overall === null
      ? null
      : overall >= 82 ? 'excellent' : overall >= 68 ? 'good' : overall >= 52 ? 'moderate' : 'poor';

  // --- Recommandations & alertes personnalisées ---
  const recommendations: string[] = [];
  const warnings: string[] = [];

  const armSensitive = profile?.armSensitive ?? false;
  const isPoly = mainStringFamily === 'polyester';

  // Risque tennis elbow.
  //
  // Les seuils sont exprimés en PERCENTILES de la distribution réelle, jamais
  // en valeurs absolues — c'est la seule formulation qui survit à un changement
  // d'échelle ou à un élargissement du catalogue. Cible retenue depuis le
  // 8 août 2026, inchangée :
  //   - sensible du bras : p80 (le quintile le plus rigide)
  //   - profil standard  : p95 (le vingtile le plus rigide)
  //
  // Deux dérives corrigées le 14/08/2026 :
  //
  // 1. Les seuils 29 / 31 visaient p80 / p95 mais ne les atteignaient plus :
  //    mesurés sur les 147 060 combinaisons actuelles, ils frappaient 34,9 % et
  //    8,2 % des setups. La base cordages est passée de 69 à 190 références le
  //    7 août (fusion Supabase), donc APRÈS le calcul des percentiles : les
  //    seuils absolus sont restés, la distribution sous eux a bougé.
  // 2. L'échelle a été recalibrée (cf. `calculateRCS`) pour rendre les 5
  //    paliers publiés atteignables. Les valeurs absolues devaient suivre.
  //
  // Seuils recalculés sur la nouvelle échelle (mesure du 14/08/2026) :
  //   - sensible      rcs >= 32  => 23,2 % des setups  (~p80)
  //   - non sensible  rcs >= 35  => 6,3 % des setups   (~p95)
  // Le seuil standard coïncide volontairement avec la borne du palier publié
  // « ≥ 35 : très ferme, risque tennis elbow » : l'alerte et l'échelle affichée
  // disent désormais la même chose au même moment.
  //
  // Les conditions de confort restent en second filet et rattrapent les setups
  // souples-mais-inconfortables que l'indice de fermeté seul ignore.
  // Option A (29/09/2026) : ce second filet n'existe que si la note de confort
  // existe ; le seuil sur l'indice de fermeté s'applique, lui, à toute fiche.
  const armRisk = armSensitive
    ? rcs >= 32 || (comfort !== null && comfort < 55)
    : rcs >= 35 || (comfort !== null && comfort < 45);
  // Textes de l'alerte (22/10/2026, charte F7 v1.2) : la condition `armRisk` ci-dessus est inchangée, seul le texte change.
  // Chaque alerte dit sa cause réelle (l'indice au seuil ou au-delà, ou le second filet « confort » alors que l'indice reste
  // sous le seuil), le seuil franchi, le profil appliqué, le risque comme raison du seuil (fixé par le site, pas une mesure
  // médicale), l'action en effet sur l'INDICE et jamais sur le bras, et le renvoi vers un professionnel de santé. Les seuils
  // d'indice viennent de `ARM_ALERT_RCS` ; ceux du second filet (55 / 45) reprennent les littéraux de `armRisk`. Le contrôle 21
  // de `audit:ratings` relit chaque nombre cité sur la grille réelle.
  if (armRisk) {
    const seuil = armSensitive ? ARM_ALERT_RCS.sensitive : ARM_ALERT_RCS.standard;
    const profil = armSensitive ? 'bras sensible déclaré' : 'profil standard';
    const consulter = 'Douleur persistante : consultez un professionnel de santé.';
    if (rcs >= seuil) {
      const points = rcs - seuil + 1;
      warnings.push(
        `Alerte bras : indice ${rcs}, seuil d'alerte de ${seuil} ${rcs > seuil ? 'dépassé' : 'atteint'} (${profil}), ` +
          `seuil fixé par le site pour le risque de tennis elbow. ` +
          `Il faut ${points} point${points > 1 ? 's' : ''} d'indice de moins pour repasser sous ${seuil} : ` +
          `1 kg de tension en moins retire 0,5 point, un cordage moins rigide aux montants` +
          `${isPoly ? ' (un multifilament ou un boyau, par exemple)' : ''} l'abaisse aussi. ${consulter}`
      );
    } else {
      const limite = armSensitive ? 55 : 45;
      // Cause : une note ÉDITORIALE (note de confort de l'équipe, non mesurée), ajustée par la rigidité et la tension ; le texte
      // le dit, sans la présenter comme une rigidité (avis Opus, section G). La note comparée est la valeur non arrondie ; le
      // sous-score affiché (page, PDF) est `round(comfort)`. Quand l'arrondi affiche la limite elle-même (note de 54,5 à 55 exclu,
      // par exemple), le texte le dit au lieu d'un « sous 55 » que la page contredirait.
      const arrondiALaLimite = comfort !== null && round(comfort) >= limite;
      warnings.push(
        `Alerte bras : note de confort calculée du montage sous ${limite} sur 100` +
          `${arrondiALaLimite ? ` avant arrondi, affichée ${limite}` : ''} (${profil}), ` +
          `second seuil d'alerte fixé par le site pour le risque de tennis elbow ; ` +
          `elle part de la note de confort de l'équipe, non mesurée, et l'indice (${rcs}) reste sous le seuil de ${seuil}. ` +
          `Une tension plus basse ou un cordage mieux noté en confort relève cette note. ${consulter}`
      );
    }
  }

  // Conseils tension selon profil/priorité.
  if (avgTension > 26) {
    recommendations.push(
      `Tension élevée (${avgTension.toFixed(0)} kg) : excellent contrôle mais peu de puissance. ` +
        `Descendre vers 24 kg gagnerait en confort et en tolérance.`
    );
  } else if (avgTension < 21) {
    recommendations.push(
      `Tension basse (${avgTension.toFixed(0)} kg) : beaucoup de puissance et de confort, ` +
        `mais le contrôle peut manquer. Monter d'1 kg resserrerait la précision.`
    );
  }

  // Cohérence profil ↔ setup.
  // Seuil rescalé le 14/08/2026 : l'ancien 30 (~p65 de l'ancienne échelle)
  // correspond à 33 sur la nouvelle (~16 % des setups les plus fermes).
  if (profile?.level === 'beginner' && (isPoly || rcs >= 33)) {
    recommendations.push(
      `Profil débutant : un cordage souple (multifilament) à tension modérée serait plus indulgent ` +
        `et plus confortable qu'un polyester rigide.`
    );
  }
  if (profile?.level === 'pro' && comfort !== null && control !== null && comfort > 75 && control < 55) {
    recommendations.push(
      `Profil expert : vous pourriez gagner en contrôle avec un cordage plus rigide ou +1 kg de tension.`
    );
  }
  if (profile?.style === 'baseline' && spin !== null && spin < 55) {
    recommendations.push(
      `Jeu de fond de court : un polyester texturé en jauge fine (1.20–1.25) maximiserait le lift.`
    );
  }

  // Renfort durabilité.
  if (durability !== null && durability < 40) {
    recommendations.push(
      `Faible durabilité : si vous cassez souvent, optez pour une jauge plus épaisse (1.30+) ou un polyester.`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('Configuration cohérente : aucun ajustement majeur recommandé.');
  }

  // --- Synthèse ---
  const summaryByLevel: Record<RcsLevel, string> = {
    excellent: 'Excellent équilibre puissance / contrôle / confort pour ce profil.',
    good: 'Bon compromis global, quelques ajustements possibles.',
    moderate: 'Configuration correcte mais perfectible selon vos priorités.',
    poor: 'Configuration déséquilibrée : voir les recommandations ci-dessous.',
  };

  const roundOrNull = (v: number | null) => (v === null ? null : round(v));

  return {
    rcs,
    hybrid,
    level,
    overall,
    subScores: {
      power: roundOrNull(power),
      control: roundOrNull(control),
      comfort: roundOrNull(comfort),
      spin: roundOrNull(spin),
      durability: roundOrNull(durability),
    },
    recommendations,
    warnings,
    summary:
      level === null
        ? 'Analyse détaillée non disponible : les notes de ce cordage ne sont pas publiées.'
        : summaryByLevel[level],
  };
}

// =====================
// Adaptateurs depuis les types des bases de données
// =====================

/** Mappe un `type` de cordage (base) vers une famille normalisée. */
export function stringTypeToFamily(type: string | undefined): StringFamily {
  const t = (type ?? '').toLowerCase();
  if (t.includes('poly')) return 'polyester';
  if (t.includes('multi')) return 'multifilament';
  if (t.includes('gut') || t.includes('boyau')) return 'gut';
  if (t.includes('synth')) return 'synthetic';
  if (t.includes('hybrid')) return 'hybrid';
  return 'other';
}

/** Parse une jauge "1.25" (string) en nombre, sinon undefined. */
export function parseGaugeMm(gauge: string | number | undefined): number | undefined {
  if (gauge === undefined) return undefined;
  const n = typeof gauge === 'number' ? gauge : parseFloat(gauge);
  return Number.isFinite(n) ? n : undefined;
}
