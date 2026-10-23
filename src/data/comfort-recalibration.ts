/**
 * D2 restreint — notes de confort recalées sur la rigidité mesurée (TWU), 23/10/2026.
 *
 * DÉCISION : avis d'Opus 5.5 du 23/10/2026, point 1, option (c) « D2 restreint » (Pierre : « je donne le La, vous exécutez ») ;
 * mesure préalable de `tsa-measure` (Q_mesure_D2, 22/10/2026, scénario « L2, tolérance 1,0, atterrissage sur la droite »).
 *
 * CONSTAT : la note de confort /10 d'un cordage est une appréciation éditoriale, non mesurée ; elle suit la rigidité du catalogue
 * (r ≈ −0,76 en polyester, −0,81 en multifilament). Sept fiches sont plus rigides, mesurées par TWU, que la rigidité sur laquelle
 * leur note avait été calée : leur note dépasse de plus de 1,0 point la droite que suivent les notes de leur famille.
 *
 * RÈGLE, appliquée une fois, le 23/10/2026, aux fiches qui portent une mesure TWU (table par jauge) et une note de confort :
 *   - droite L2 de la famille : note = ordonnée + pente × TWU. La pente est celle de la régression « note de confort ~ rigidité du
 *     catalogue » sur toutes les fiches notées de la famille ; l'ordonnée est recalée pour que la droite passe par la moyenne des
 *     notes et des mesures TWU des fiches notées qui portent une mesure (TWU = la plus rigide des jauges mesurées, règle C) ;
 *   - une fiche est concernée si sa note dépasse la droite de plus de `tolerance` (1,0, environ un écart-type résiduel) ET si sa
 *     mesure TWU est au moins égale à la médiane de rigidité de sa famille (220 lb/in en polyester, 162,3 en multifilament) : les
 *     cordages souples à note haute (Isospeed Cream, Tecnifibre Razor Soft, Luxilon Element) sont écartés, leur baisse n'ajoutait
 *     aucune alerte et ne faisait que dégrader l'affichage ;
 *   - la note est ramenée sur la droite (arrondie au dixième), jamais relevée ;
 *   - note harmonisée avec des avis de testeurs (`tester-ratings.ts`) : seule la composante éditoriale (l'ancienne note) est ramenée
 *     sur la droite, puis la moyenne avec l'avis des testeurs recalé est refaite selon la méthode publiée (`harmonizedRating`).
 *     La droite corrige une note calée sur une rigidité historique ; l'avis des testeurs, indépendant de cette rigidité, reste.
 * Aucun seuil ne bouge (alerte bras dès 32 / 35, second filet « confort » < 55 / < 45, gardé tel quel : avis d'Opus, point 6).
 * Une note qui baisse ne peut qu'ajouter des alertes : le contrôle 23 de `audit:ratings` vérifie qu'aucune ne disparaît.
 *
 * AFFICHAGE : partout où la note s'affiche, l'étiquette de nature des notes porte la mention `label` (FR) ou `labelEn` (EN).
 * CONTRÔLE : 22 de `audit:ratings` (règle rejouée, valeurs, sélection complète, étiquettes), 23 (aucune note ne monte, aucune alerte
 * ne disparaît). Ce fichier n'importe rien : le générateur des pages EN le lit par transpilation isolée.
 */

export const COMFORT_RECALIBRATION_RULE = {
  decision: "Avis d'Opus 5.5 du 23/10/2026, point 1, option (c) « D2 restreint » ; mesure Q de tsa-measure du 22/10/2026",
  date: '2026-10-23',
  line: 'L2',
  /** Une note est concernée si elle dépasse la droite de plus de cette tolérance (points /10). */
  tolerance: 1.0,
  /** Droites L2 figées le 23/10/2026, calculées sur le catalogue d'avant D2 (contrôle 22 : recalcul sur l'instantané de référence). */
  lines: {
    Polyester: { intercept: 13.957105124349543, slope: -0.031134330028640262 },
    Multifilament: { intercept: 15.676119583836105, slope: -0.043918668899310634 },
  },
  /** Médianes de rigidité de la famille (toutes ses fiches, lb/in), au 23/10/2026. */
  medians: { Polyester: 220, Multifilament: 162.3 },
  label: 'note de confort recalée sur la rigidité mesurée (TWU)',
  labelEn: 'comfort rating recalibrated on measured stiffness (TWU)',
} as const;

export type RecalibratedFamily = keyof typeof COMFORT_RECALIBRATION_RULE.lines;

export interface ComfortRecalibration {
  family: RecalibratedFamily;
  /** Mesure TWU retenue (lb/in) : la plus rigide des jauges mesurées de la fiche. */
  twu: number;
  /** Note de confort publiée avant D2, et après. */
  before: number;
  after: number;
  /** Note harmonisée seulement : composante éditoriale (ancienne note) avant et après D2. */
  editorialBefore?: number;
  editorialAfter?: number;
}

/** Les sept fiches recalées le 23/10/2026. */
export const COMFORT_RECALIBRATED: Readonly<Record<string, ComfortRecalibration>> = {
  // Harmonisées avec des avis de testeurs : composante éditoriale ramenée sur la droite, puis moyenne refaite.
  'luxilon-4g': { family: 'Polyester', twu: 286.9, before: 6.3, after: 5.3, editorialBefore: 7, editorialAfter: 5.0 },
  'solinco-mach-10': { family: 'Polyester', twu: 222.3, before: 8.8, after: 8.3, editorialBefore: 8, editorialAfter: 7.0 },
  'babolat-rpm-team': { family: 'Polyester', twu: 280.6, before: 6.8, after: 5.9, editorialBefore: 7, editorialAfter: 5.2 },
  // Notes éditoriales : ramenées sur la droite.
  'babolat-revenge': { family: 'Polyester', twu: 276, before: 7, after: 5.4 },
  'tecnifibre-black-code-4s': { family: 'Polyester', twu: 242.9, before: 7.5, after: 6.4 },
  'tecnifibre-razor-code': { family: 'Polyester', twu: 242.9, before: 7.5, after: 6.4 },
  'tecnifibre-tgv': { family: 'Multifilament', twu: 165.2, before: 9.5, after: 8.4 },
};
