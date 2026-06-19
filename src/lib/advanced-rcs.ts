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
 * Repères issus des données réelles :
 *   - Raquette RA (`stiffness`) : 55–72, centré ~63.
 *   - Cordage rigidité (`stiffness`, lb/in) : poly ~205–235, multi ~165–190,
 *     boyau ~150–170. Centré ~195.
 *   - Tension : plage usuelle 18–28 kg, centrée 24.
 */

// =====================
// Types
// =====================

export type RcsLevel = 'excellent' | 'good' | 'moderate' | 'poor';
export type StringFamily = 'polyester' | 'multifilament' | 'gut' | 'synthetic' | 'hybrid' | 'other';

export interface AdvancedRcsInput {
  /** RA de la raquette (rigidité cadre). Défaut 63 si inconnu. */
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

export interface StringRatings {
  control: number; // /10
  comfort: number; // /10
  spin: number; // /10
  power: number; // /10
  durability: number; // /10
}

export interface PlayerProfile {
  level?: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  style?: 'baseline' | 'all-court' | 'serve-volley' | 'defensive';
  /** Sensibilité du bras / antécédents de tennis elbow. */
  armSensitive?: boolean;
}

export interface AdvancedRcsResult {
  /** Indice de fermeté global (réutilise la formule RCS simple existante). */
  rcs: number;
  /** Niveau de synthèse. */
  level: RcsLevel;
  /** Score global 0-100. */
  overall: number;
  /** Sous-scores 0-100. */
  subScores: {
    power: number;
    control: number;
    comfort: number;
    spin: number;
    durability: number;
  };
  /** Recommandations actionnables (personnalisées si profil fourni). */
  recommendations: string[];
  /** Alertes (ex. risque tennis elbow). */
  warnings: string[];
  /** Synthèse courte. */
  summary: string;
}

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
export function rcsIndex(racquetStiffness: number, stringStiffness: number, tension: number): number {
  const racquetFactor = racquetStiffness / 70;
  const stringFactor = stringStiffness / 220;
  const tensionFactor = tension / 24;
  return round((racquetFactor * 0.4 + stringFactor * 0.4 + tensionFactor * 0.2) * 30);
}

/** Pondération hybride : le cordage principal domine le ressenti (60/40). */
function blend(main: number, cross: number | undefined): number {
  if (cross === undefined || Number.isNaN(cross)) return main;
  return main * 0.6 + cross * 0.4;
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

  // Rigidité de cordage effective (pondérée hybride).
  const effStringStiffness = blend(mainStringStiffness, crossStringStiffness);
  const effGauge = blend(mainGaugeMm ?? 1.25, crossGaugeMm);

  // Ratings effectifs (pondérés hybride, sur 10).
  const r = (key: keyof StringRatings) =>
    blend(mainRatings[key], crossRatings ? crossRatings[key] : undefined);

  // Indice de fermeté global (socle, formule existante).
  const rcs = rcsIndex(racquetStiffness, effStringStiffness, avgTension);

  // --- Écarts normalisés (autour des centres "données réelles") ---
  // RA : 55-72, centré 63. >0 => cadre rigide.
  const raDev = racquetStiffness - 63;
  // Tension : centrée 24. >0 => tension haute (plus de contrôle, moins de puissance/confort).
  const tDev = avgTension - 24;
  // Rigidité cordage : centrée 195. >0 => cordage raide.
  const stiffDev = effStringStiffness - 195;

  // --- Sous-score CONTRÔLE ---
  // Ratings contrôle + tension haute + cordage/cadre rigides.
  // On part d'une base à 90% du rating pour laisser de la marge aux bonus.
  let control = r('control') * 9;
  control += tDev * 1.3; // +1 kg ≈ +1.3 contrôle
  control += stiffDev * 0.05;
  control += raDev * 0.35;
  control = clamp(control);

  // --- Sous-score PUISSANCE (souvent inverse du contrôle) ---
  let power = r('power') * 10;
  power -= tDev * 1.8; // tension basse => plus de puissance
  if (racquetHeadSize) power += (racquetHeadSize - 98) * 0.6; // grand tamis => trampoline
  power += raDev * 0.5; // cadre rigide => restitue plus d'énergie
  power = clamp(power);

  // --- Sous-score CONFORT (pénalisé par la rigidité globale) ---
  let comfort = r('comfort') * 10;
  comfort += familyComfortBonus(mainStringFamily);
  comfort -= raDev * 0.7; // cadre rigide => moins confortable
  comfort -= stiffDev * 0.08; // cordage raide => moins confortable
  comfort -= tDev * 1.2; // tension haute => moins confortable
  if (racquetWeight && racquetWeight >= 300) comfort += 4; // masse => absorbe les vibrations
  comfort = clamp(comfort);

  // --- Sous-score SPIN ---
  let spin = r('spin') * 9;
  spin += familySpinBonus(mainStringFamily);
  if (effGauge) spin += (1.25 - effGauge) * 25; // jauge fine => plus de morsure
  spin = clamp(spin);

  // --- Sous-score DURABILITÉ ---
  let durability = r('durability') * 10;
  if (effGauge) durability += (effGauge - 1.25) * 40; // jauge épaisse => plus durable
  if (mainStringFamily === 'polyester') durability += 6;
  if (mainStringFamily === 'gut') durability -= 8;
  durability = clamp(durability);

  // --- Score global (moyenne pondérée) ---
  // Le confort pèse plus lourd (santé du bras = priorité TSA).
  const overall = round(
    control * 0.22 + power * 0.2 + comfort * 0.3 + spin * 0.18 + durability * 0.1
  );

  const level: RcsLevel =
    overall >= 82 ? 'excellent' : overall >= 68 ? 'good' : overall >= 52 ? 'moderate' : 'poor';

  // --- Recommandations & alertes personnalisées ---
  const recommendations: string[] = [];
  const warnings: string[] = [];

  const armSensitive = profile?.armSensitive ?? false;
  const isPoly = mainStringFamily === 'polyester';

  // Risque tennis elbow. Seuils abaissés pour les profils sensibles du bras.
  const armRisk = armSensitive
    ? rcs >= 28 || comfort < 55
    : rcs >= 33 || comfort < 45;
  if (armRisk) {
    if (armSensitive) {
      warnings.push(
        `Setup rigide (indice ${rcs}) alors que votre profil est sensible du bras : ` +
          `baissez la tension de 1 à 2 kg${isPoly ? ' ou passez à un multifilament/boyau sur le montant' : ''} pour limiter le risque de tennis elbow.`
      );
    } else {
      warnings.push(
        `Setup rigide (indice ${rcs}) : surveillez votre bras, surtout en cas de jeu intensif.`
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
  if (profile?.level === 'beginner' && (isPoly || rcs >= 30)) {
    recommendations.push(
      `Profil débutant : un cordage souple (multifilament) à tension modérée serait plus indulgent ` +
        `et plus confortable qu'un polyester rigide.`
    );
  }
  if (profile?.level === 'pro' && comfort > 75 && control < 55) {
    recommendations.push(
      `Profil expert : vous pourriez gagner en contrôle avec un cordage plus rigide ou +1 kg de tension.`
    );
  }
  if (profile?.style === 'baseline' && spin < 55) {
    recommendations.push(
      `Jeu de fond de court : un polyester texturé en jauge fine (1.20–1.25) maximiserait le lift.`
    );
  }

  // Renfort durabilité.
  if (durability < 40) {
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

  return {
    rcs,
    level,
    overall,
    subScores: {
      power: round(power),
      control: round(control),
      comfort: round(comfort),
      spin: round(spin),
      durability: round(durability),
    },
    recommendations,
    warnings,
    summary: summaryByLevel[level],
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
