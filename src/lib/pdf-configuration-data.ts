/**
 * Assemblage des données d'un PDF de configuration.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  POURQUOI CE MODULE
 * ─────────────────────────────────────────────────────────────────────────────
 * Les configurations enregistrées ne stockent que des **identifiants**
 * (`racquetId`, `mainStringId`, …) plus deux scores agrégés (`rcsScore`,
 * `compatibility`). L'analyse avancée — sous-scores, recommandations, alertes
 * — n'est calculée qu'à l'écran du configurateur et n'est **pas persistée**.
 *
 * Conséquence : l'export PDF ne pouvait afficher que ce que la ligne
 * contenait, d'où un document quasi vide.
 *
 * Deux options existaient :
 *   (a) persister l'analyse en base — impose une migration de schéma, et rend
 *       les PDF anciens figés sur une version périmée des formules ;
 *   (b) **recalculer l'analyse à l'export** depuis les identifiants.
 *
 * L'option (b) est retenue : les fonctions de calcul sont pures et rapides,
 * aucune migration n'est nécessaire, et un PDF réexporté bénéficie
 * automatiquement des corrections de formules (comme le recalibrage des
 * seuils du 8 août 2026). Ce module est cette couche d'assemblage.
 *
 * Il est volontairement séparé du composant React : pur, sans dépendance à
 * l'UI, donc testable en isolation.
 */

import { racquetsDatabase, calculateCompatibility } from '@/data/racquets-database';
import { stringsDatabase, calculateRCS } from '@/data/strings-database';
import {
  calculateAdvancedRcs,
  stringTypeToFamily,
  parseGaugeMm,
} from '@/lib/advanced-rcs';
import {
  effectiveRacquetRA,
  isRacquetStiffnessEstimated,
  deriveRacquetProfile,
} from '@/lib/racquet-scoring';
import type {
  ConfigurationPdfData,
  PdfRacquetSpecs,
  PdfStringDetail,
  PdfAdvancedAnalysis,
} from '@/lib/pdf-export';

/** Forme minimale d'une configuration enregistrée, cf. `ServerConfiguration`. */
export interface StoredConfiguration {
  name: string;
  racquetId: string;
  mainStringId: string;
  crossStringId: string | null;
  mainGauge: string;
  crossGauge: string;
  mainTension: number;
  crossTension: number;
  rating: number;
  notes: string | null;
  rcsScore: number;
  compatibility: number;
  createdAt: string;
}

/** Traduit le niveau interne en libellé français lisible. */
const LEVEL_LABEL: Record<string, string> = {
  excellent: 'Excellent',
  good: 'Bon',
  moderate: 'Correct',
  poor: 'Desequilibre',
};

/**
 * Construit l'objet complet attendu par `exportConfigurationPdf`.
 *
 * Robustesse : si la raquette ou le cordage n'est pas retrouvé dans la base
 * (identifiant obsolète après une refonte du catalogue), les blocs concernés
 * sont simplement omis. Le PDF reste produit avec les informations de base
 * plutôt que d'échouer — et **aucune valeur n'est inventée** pour compenser.
 */
export function buildConfigurationPdfData(
  config: StoredConfiguration,
): ConfigurationPdfData {
  const racquet = racquetsDatabase.find((r) => r.id === config.racquetId);
  const mainString = stringsDatabase.find((s) => s.id === config.mainStringId);
  const crossString = config.crossStringId
    ? stringsDatabase.find((s) => s.id === config.crossStringId)
    : undefined;

  // ---------------------------------------------------------------- Libellés
  const racquetLabel = racquet
    ? `${racquet.brand} ${racquet.model} ${racquet.variant}`.trim()
    : config.racquetId;
  const mainStringLabel = mainString
    ? `${mainString.brand} ${mainString.model}`.trim()
    : config.mainStringId;
  const crossStringLabel = crossString
    ? `${crossString.brand} ${crossString.model}`.trim()
    : config.crossStringId;

  // ------------------------------------------------------- Bloc raquette
  let racquetSpecs: PdfRacquetSpecs | undefined;
  if (racquet) {
    const profile = deriveRacquetProfile(racquet);
    racquetSpecs = {
      label: racquetLabel,
      brand: racquet.brand,
      weight: racquet.weight,
      headSize: racquet.headSize,
      ra: effectiveRacquetRA(racquet),
      raEstimated: isRacquetStiffnessEstimated(racquet),
      stringPattern: racquet.stringPattern,
      category: racquet.category,
      balance: racquet.balance,
      swingWeight: racquet.swingWeight,
      playerLevel: racquet.playerLevel,
      profile: {
        power: profile.power,
        control: profile.control,
        comfort: profile.comfort,
        maneuverability: profile.maneuverability,
        stability: profile.stability,
        basis: profile.basis,
      },
    };
  }

  // ------------------------------------------------------- Blocs cordages
  const mainDetail: PdfStringDetail | undefined = mainString
    ? {
        label: mainStringLabel,
        type: mainString.type,
        gauge: config.mainGauge,
        tension: config.mainTension,
        stiffness: mainString.stiffness,
        ratings: {
          control: mainString.control,
          comfort: mainString.comfort,
          spin: mainString.spin,
          power: mainString.power,
          durability: mainString.durability,
        },
        priceEur: mainString.price?.europe,
      }
    : undefined;

  const crossDetail: PdfStringDetail | null = crossString
    ? {
        label: crossStringLabel ?? config.crossStringId ?? '',
        type: crossString.type,
        gauge: config.crossGauge,
        tension: config.crossTension,
        stiffness: crossString.stiffness,
        ratings: {
          control: crossString.control,
          comfort: crossString.comfort,
          spin: crossString.spin,
          power: crossString.power,
          durability: crossString.durability,
        },
        priceEur: crossString.price?.europe,
      }
    : null;

  // -------------------------------------------- Analyse avancée recalculée
  let advanced: PdfAdvancedAnalysis | undefined;
  let compatibilityAdvice: string | undefined;

  if (racquet && mainString) {
    const avgTension = (config.mainTension + config.crossTension) / 2;

    const result = calculateAdvancedRcs({
      // RA effectif : source unique, cf. lib/racquet-scoring.
      racquetStiffness: effectiveRacquetRA(racquet),
      racquetWeight: racquet.weight,
      racquetHeadSize: racquet.headSize,
      mainStringStiffness: mainString.stiffness,
      mainStringFamily: stringTypeToFamily(mainString.type),
      mainRatings: {
        control: mainString.control,
        comfort: mainString.comfort,
        spin: mainString.spin,
        power: mainString.power,
        durability: mainString.durability,
      },
      mainGaugeMm: parseGaugeMm(config.mainGauge),
      crossStringStiffness: crossString?.stiffness,
      crossStringFamily: crossString ? stringTypeToFamily(crossString.type) : undefined,
      crossRatings: crossString
        ? {
            control: crossString.control,
            comfort: crossString.comfort,
            spin: crossString.spin,
            power: crossString.power,
            durability: crossString.durability,
          }
        : undefined,
      crossGaugeMm: parseGaugeMm(config.crossGauge),
      mainTension: config.mainTension,
      crossTension: config.crossTension,
    });

    advanced = {
      overall: result.overall,
      level: LEVEL_LABEL[result.level] ?? result.level,
      firmnessIndex: result.rcs,
      subScores: result.subScores,
      recommendations: result.recommendations,
      warnings: result.warnings,
      summary: result.summary,
    };

    // ─────────────────────────────────────────────────────────────────────
    //  Pourquoi on n'affiche PAS la phrase de `calculateCompatibility`
    // ─────────────────────────────────────────────────────────────────────
    // `calculateCompatibility` et `calculateAdvancedRcs` évaluent le même
    // setup avec des modèles indépendants. À la découverte du problème, leurs
    // verdicts d'alerte bras se **contredisaient dans 62 % des cas**. Exemple
    // constaté — Blade 98 18x20 + ALU Power / boyau à 24-26 kg : l'analyse
    // avancée concluait « bon compromis, aucune alerte », tandis que la
    // compatibilité annonçait « risque de tennis elbow ».
    //
    // Faire figurer les deux phrases dans un même document produirait un
    // PDF qui se contredit lui-même — pire que le PDF vide qu'on corrige.
    //
    // Après recalibrage des DEUX modules sur la distribution réelle (mesure du
    // 8 août 2026, 147 060 combinaisons), la contradiction est tombée à
    // **8,4 %** (91,6 % d'accord). Le filtrage ci-dessous est néanmoins
    // CONSERVÉ : 8,4 % de contradictions résiduelles représentent encore
    // 12 330 configurations, et un seul PDF qui s'auto-contredit sur la santé
    // du bras est un PDF de trop. Deux modèles indépendants ne convergeront
    // jamais complètement ; l'arbitrage doit rester explicite dans le code.
    //
    // L'analyse avancée fait autorité : elle intègre la jauge, la famille de
    // cordage, l'hybridation et le profil joueur, là où `calculateCompatibility`
    // ne connaît que trois nombres. On ne conserve donc de cette dernière que
    // les observations FACTUELLES (poids, plage de tension), et jamais son
    // jugement de confort.
    const compat = calculateCompatibility(racquet, mainString.stiffness, avgTension);
    const factualOnly = compat.recommendation
      .split('.')
      .map((s) => s.trim())
      .filter(
        (s) =>
          s.length > 0 &&
          !/confortable|equilibre|équilibre|rigide|elbow|confort moyen/i.test(s),
      );
    compatibilityAdvice = factualOnly.length > 0 ? `${factualOnly.join('. ')}.` : undefined;
  }

  return {
    name: config.name,
    racquetLabel,
    mainStringLabel,
    crossStringLabel,
    mainGauge: config.mainGauge,
    crossGauge: config.crossGauge,
    mainTension: config.mainTension,
    crossTension: config.crossTension,
    rating: config.rating,
    notes: config.notes,
    // Les scores stockés restent affichés tels quels : ils datent de
    // l'enregistrement et servent de référence historique.
    rcsScore: config.rcsScore,
    compatibility: config.compatibility,
    createdAt: config.createdAt,
    racquet: racquetSpecs,
    mainString: mainDetail,
    crossString: crossDetail,
    advanced,
    compatibilityAdvice,
  };
}

/**
 * Recalcule l'indice RCS d'une configuration stockée.
 * Exporté pour permettre à l'UI de signaler un écart entre le score
 * enregistré et le score courant (utile après un recalibrage de formule).
 */
export function recomputeRcs(config: StoredConfiguration): number | null {
  const racquet = racquetsDatabase.find((r) => r.id === config.racquetId);
  const mainString = stringsDatabase.find((s) => s.id === config.mainStringId);
  if (!racquet || !mainString) return null;
  const avgTension = (config.mainTension + config.crossTension) / 2;
  return calculateRCS(effectiveRacquetRA(racquet), mainString.stiffness, avgTension);
}
