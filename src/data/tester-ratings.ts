/**
 * Provenance des notes /10 harmonisées des cordages — avis de testeurs.
 *
 * NATURE : appréciation éditoriale sourcée (avis de testeurs consolidés par
 * Pierre), PAS une mesure ni une donnée constructeur (règle 3). Décision de
 * Pierre du 09/10/2026 : provenance conservée dans le code, non affichée.
 *
 * MÉTHODE (3 lignes) :
 *   1. note docx /20 -> /10 par x/2, puis recalage d'ancrage : + décalage par
 *      critère = moyenne des anciennes notes − moyenne des docx/2 sur les
 *      produits communs (`ANCHOR_SHIFT`), borné à [0, 10] ;
 *   2. note publiée = moyenne (ancienne note /10, note docx recalée), arrondie
 *      au dixième ; ancienne note absente -> note docx recalée seule ;
 *   3. critères docx sans champ (TOU, CST, TEN, VAL) : conservés ici, non affichés.
 * Contrôle : `npm run audit:ratings` recalcule chaque note publiée depuis ce fichier.
 */

export const TESTER_RATINGS_SOURCE = {
  document: 'Cordages_2026_notation_consolidee.docx',
  date: '2026-10-09',
  channels: ['TennisNerd', 'TennCom', 'Rackets and Runners'],
  scale: 20,
  criteria: {
    CON: 'Contrôle', EFF: 'Effets', PUI: 'Puissance', TOU: 'Toucher', CNF: 'Confort',
    CST: 'Constance', TEN: 'Maintien de tension', DUR: 'Durabilité',
    VAL: 'Rapport qualité-prix (prix US)', POL: 'Polyvalence',
  },
} as const;

export type TesterCriterion = keyof typeof TESTER_RATINGS_SOURCE.criteria;
export type HarmonizedField = 'control' | 'spin' | 'power' | 'comfort' | 'durability' | 'versatility';

/** Champ /10 du site -> critère docx. `performance` et `innovation` : aucun équivalent, inchangés. */
export const FIELD_TO_CRITERION: Readonly<Record<HarmonizedField, TesterCriterion>> = {
  control: 'CON', spin: 'EFF', power: 'PUI', comfort: 'CNF', durability: 'DUR', versatility: 'POL',
};

/** Décalage d'ancrage par critère (/10), mesuré sur les produits communs. */
export const ANCHOR_SHIFT: Readonly<Record<HarmonizedField, number>> = { control: 1.5, spin: 1.3, power: 0.8, comfort: 1.1, durability: 1.8, versatility: 1.2 };

export interface TesterRatingsEntry {
  docxName: string;
  docxAverage20: number;
  tier: string;
  confidence: string;
  raw20: Record<TesterCriterion, number>;
  /** Notes /10 avant harmonisation (établies par Pierre par croisement de sources). */
  before10: Record<HarmonizedField, number | undefined>;
}

const round1 = (v: number) => Math.round(v * 10 + 1e-9) / 10;

/** Note publiée attendue pour un champ, recalculée depuis la provenance. */
export function harmonizedRating(entry: TesterRatingsEntry, field: HarmonizedField): number {
  const recal = Math.min(10, Math.max(0, entry.raw20[FIELD_TO_CRITERION[field]] / 2 + ANCHOR_SHIFT[field]));
  const before = entry.before10[field];
  return round1(before === undefined ? recal : (before + recal) / 2);
}

/** Cordage (id du catalogue) -> provenance. Rapprochement exact marque + modèle.
 * « Signum Pro Experience » (nom transcrit) = `signum-pro-x-perience` : validé par Pierre le 09/10/2026. */
export const STRING_TESTER_RATINGS: Readonly<Record<string, TesterRatingsEntry>> = {
  'head-lynx-tour': {
    docxName: "Head Lynx Tour",
    docxAverage20: 16.3, tier: 'S', confidence: 'Élevée',
    raw20: { CON: 18, EFF: 16, PUI: 13, TOU: 18, CNF: 13, CST: 17, TEN: 16, DUR: 17, VAL: 17, POL: 18 },
    before10: { control: 9, spin: 8.5, power: 7.5, comfort: 8, durability: 8.5, versatility: 9 },
  },
  'solinco-confidential': {
    docxName: "Solinco Confidential",
    docxAverage20: 15.6, tier: 'A', confidence: 'Moyenne',
    raw20: { CON: 17, EFF: 15, PUI: 12, TOU: 15, CNF: 12, CST: 17, TEN: 18, DUR: 18, VAL: 17, POL: 15 },
    before10: { control: 9.5, spin: 8.5, power: 6.5, comfort: 7.5, durability: 10, versatility: 8 },
  },
  'solinco-mach-10': {
    docxName: "Solinco Mach 10",
    docxAverage20: 15.5, tier: 'A', confidence: 'Élevée',
    raw20: { CON: 14, EFF: 18, PUI: 16, TOU: 13, CNF: 17, CST: 14, TEN: 16, DUR: 14, VAL: 16, POL: 17 },
    before10: { control: 8.5, spin: 8.5, power: 8.5, comfort: 8, durability: 9.5, versatility: 8.5 },
  },
  'toroline-o-toro': {
    docxName: "Toroline O-Toro",
    docxAverage20: 15.3, tier: 'A', confidence: 'Moyenne',
    raw20: { CON: 15, EFF: 18, PUI: 15, TOU: 14, CNF: 16, CST: 15, TEN: 15, DUR: 13, VAL: 16, POL: 16 },
    before10: { control: 8, spin: 10, power: 8, comfort: 7, durability: 7.5, versatility: undefined },
  },
  'head-hawk-touch': {
    docxName: "Head Hawk Touch",
    docxAverage20: 14.8, tier: 'B', confidence: 'Élevée',
    raw20: { CON: 16, EFF: 13, PUI: 13, TOU: 15, CNF: 15, CST: 17, TEN: 15, DUR: 15, VAL: 12, POL: 17 },
    before10: { control: 9, spin: 8.5, power: 7, comfort: 7, durability: 8.5, versatility: 8.5 },
  },
  'restring-zero': {
    docxName: "ReString Zero",
    docxAverage20: 14.8, tier: 'B', confidence: 'Moyenne',
    raw20: { CON: 13, EFF: 15, PUI: 16, TOU: 15, CNF: 15, CST: 14, TEN: 16, DUR: 17, VAL: 13, POL: 14 },
    before10: { control: 8.5, spin: 9, power: 7.5, comfort: 7, durability: 10, versatility: undefined },
  },
  'solinco-hyper-g': {
    docxName: "Solinco Hyper-G",
    docxAverage20: 14.6, tier: 'B', confidence: 'Élevée',
    raw20: { CON: 16, EFF: 17, PUI: 12, TOU: 17, CNF: 11, CST: 14, TEN: 14, DUR: 14, VAL: 15, POL: 16 },
    before10: { control: 9, spin: 9, power: 8, comfort: 8.5, durability: 8.5, versatility: 9 },
  },
  'luxilon-4g': {
    docxName: "Luxilon 4G",
    docxAverage20: 14.5, tier: 'B', confidence: 'Élevée',
    raw20: { CON: 18, EFF: 12, PUI: 10, TOU: 14, CNF: 9, CST: 18, TEN: 19, DUR: 19, VAL: 13, POL: 13 },
    before10: { control: 10, spin: 8, power: 6.5, comfort: 7, durability: 9.5, versatility: 8.5 },
  },
  'solinco-tour-bite': {
    docxName: "Solinco Tour Bite",
    docxAverage20: 14.4, tier: 'B', confidence: 'Moyenne',
    raw20: { CON: 17, EFF: 17, PUI: 11, TOU: 16, CNF: 10, CST: 15, TEN: 13, DUR: 15, VAL: 16, POL: 14 },
    before10: { control: 10, spin: 9.5, power: 6, comfort: 6.5, durability: 9, versatility: 8 },
  },
  'signum-pro-x-perience': {
    docxName: "Signum Pro Experience",
    docxAverage20: 13.6, tier: 'C', confidence: 'Faible',
    raw20: { CON: 15, EFF: 16, PUI: 12, TOU: 15, CNF: 11, CST: 14, TEN: 14, DUR: 14, VAL: 11, POL: 14 },
    before10: { control: 9, spin: 8.5, power: 7.5, comfort: 8, durability: 8, versatility: 8.5 },
  },
  'babolat-rpm-rough': {
    docxName: "Babolat RPM Rough",
    docxAverage20: 13.3, tier: 'C', confidence: 'Élevée',
    raw20: { CON: 14, EFF: 19, PUI: 12, TOU: 15, CNF: 10, CST: 14, TEN: 12, DUR: 12, VAL: 12, POL: 13 },
    before10: { control: 9, spin: 10, power: 7, comfort: 6.5, durability: 8, versatility: undefined },
  },
  'volkl-cyclone': {
    docxName: "Völkl Cyclone",
    docxAverage20: 13.3, tier: 'C', confidence: 'Moyenne',
    raw20: { CON: 13, EFF: 14, PUI: 14, TOU: 13, CNF: 14, CST: 13, TEN: 11, DUR: 11, VAL: 16, POL: 14 },
    before10: { control: 8.5, spin: 8.8, power: 7.5, comfort: 7.5, durability: 8, versatility: 8 },
  },
  'luxilon-alu-power': {
    docxName: "Luxilon Alu Power",
    docxAverage20: 13.2, tier: 'C', confidence: 'Élevée',
    raw20: { CON: 17, EFF: 14, PUI: 13, TOU: 19, CNF: 11, CST: 16, TEN: 9, DUR: 8, VAL: 9, POL: 16 },
    before10: { control: 9.5, spin: 8.5, power: 7.5, comfort: 7, durability: 9, versatility: 9.5 },
  },
  'yonex-poly-tour-rev': {
    docxName: "Yonex Poly Tour Rev",
    docxAverage20: 13.0, tier: 'C', confidence: 'Faible',
    raw20: { CON: 14, EFF: 14, PUI: 13, TOU: 13, CNF: 14, CST: 14, TEN: 13, DUR: 13, VAL: 9, POL: 13 },
    before10: { control: 8.5, spin: 9.2, power: 7.8, comfort: 7.8, durability: 8, versatility: 8.5 },
  },
  'babolat-rpm-blast': {
    docxName: "Babolat RPM Blast",
    docxAverage20: 12.4, tier: 'D', confidence: 'Élevée',
    raw20: { CON: 15, EFF: 16, PUI: 11, TOU: 13, CNF: 9, CST: 15, TEN: 10, DUR: 11, VAL: 11, POL: 13 },
    before10: { control: 9, spin: 9.5, power: 7, comfort: 7.5, durability: 8, versatility: 8.5 },
  },
  'yonex-poly-tour-pro': {
    docxName: "Yonex Poly Tour Pro",
    docxAverage20: 12.3, tier: 'D', confidence: 'Faible',
    raw20: { CON: 11, EFF: 10, PUI: 16, TOU: 11, CNF: 17, CST: 12, TEN: 11, DUR: 12, VAL: 9, POL: 14 },
    before10: { control: 8.5, spin: 8, power: 7.5, comfort: 7.5, durability: 8.5, versatility: 8.5 },
  },
  'babolat-rpm-team': {
    docxName: "Babolat RPM Team",
    docxAverage20: 11.9, tier: 'D', confidence: 'Moyenne',
    raw20: { CON: 13, EFF: 14, PUI: 12, TOU: 11, CNF: 11, CST: 13, TEN: 11, DUR: 12, VAL: 11, POL: 11 },
    before10: { control: 8.5, spin: 9, power: 8, comfort: 7, durability: 8.5, versatility: undefined },
  },
  'weiss-cannon-ultra-cable': {
    docxName: "WeissCannon Ultra Cable",
    docxAverage20: 11.6, tier: 'D', confidence: 'Moyenne',
    raw20: { CON: 11, EFF: 18, PUI: 12, TOU: 11, CNF: 10, CST: 10, TEN: 12, DUR: 11, VAL: 12, POL: 9 },
    before10: { control: 8, spin: 9.5, power: 6, comfort: 6.5, durability: 8.5, versatility: 7.5 },
  },
};
