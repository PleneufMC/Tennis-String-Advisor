/**
 * Provenance des avis de testeurs sur les RAQUETTES — appréciation éditoriale.
 *
 * NATURE : synthèse interprétative de vidéos de test consolidée par Pierre
 * (document du 09/10/2026), PAS une mesure ni une donnée constructeur
 * (règle 3). Comme pour les cordages (PR #73), la provenance reste dans le
 * code et n'est pas affichée : le site dit « avis de testeurs », sans citer
 * de chaîne.
 *
 * MÉTHODE (identique à celle des cordages, `tester-ratings.ts`) :
 *   1. critère /20 -> /10 par x/2, puis + décalage d'ancrage par axe
 *      (`RACQUET_ANCHOR_SHIFT`) = moyenne(profil dérivé des specs) −
 *      moyenne(x/2) sur les raquettes rapprochées, arrondi au dixième ;
 *   2. note affichée = moyenne (profil dérivé des specs, note testeurs
 *      recalée), bornée à [0, 10], arrondie au dixième ;
 *   3. raquette sans entrée ici -> profil dérivé des specs seul, inchangé.
 * Axes : puissance = PUI, contrôle = PRE (précision), confort = CNF,
 * maniabilité = MAN, stabilité = STA. Les 15 autres critères sont conservés
 * ici (classement Top 10, futurs usages) et ne sont pas affichés.
 *
 * RAPPROCHEMENT DE GÉNÉRATION (décision tsa-core du 09/10/2026) :
 * une fiche du catalogue reçoit les avis d'une raquette testée seulement si
 *   (a) marque, gamme et variante désignent une seule fiche ;
 *   (b) tamis, poids non cordé et plan de cordage sont ÉGAUX à ceux de la
 *       génération testée, lus sur la fiche Tennis Warehouse Europe trouvée
 *       par recherche (jamais une URL devinée, règle 4) ;
 *   (c) le RA de la fiche est à ±1 du RA publié pour cette génération — le
 *       RA est la seule spec qui discrimine les générations (Pure Drive :
 *       72 sur la génération 2021, 69 sur la 2025) ;
 *   (d) aucun marqueur de la fiche (id, variante, année) ne contredit la
 *       génération testée.
 * Sinon : quarantaine (`RACQUET_TESTER_QUARANTINE`), aucun avis appliqué.
 * Information de Pierre (09/10/2026) : le document porte sur les DERNIÈRES
 * générations. Sept fiches qui décrivaient une génération antérieure (RA
 * divergent) ont donc été alignées en place sur la génération en vente, specs
 * sourcées, puis rapprochées (`racquets-database.ts`, commentaire par fiche).
 * Les décalages d'ancrage sont mesurés sur les 18 rapprochements.
 * Contrôle : `npm run audit:ratings` (contrôle 14) recalcule tout depuis ce fichier.
 */

export const RACQUET_TESTER_SOURCE = {
  document: 'Raquettes_2026_notation_consolidee_v4.docx',
  date: '2026-10-09',
  channels: ['Rackets and Runners', 'TennCom', 'AC Tennis'],
  scale: 20,
  criteria: {
    PUI: 'Puissance', PEN: 'Pénétration', PRE: 'Précision', CST: 'Constance',
    TOL: 'Tolérance', STA: 'Stabilité', MAN: 'Maniabilité', EFF: 'Effets',
    PLA: 'Frappe à plat', TOU: 'Toucher', CNF: 'Confort', SER: 'Service',
    VOL: 'Volée', RET: 'Retour', DEF: 'Défense', POL: 'Polyvalence',
    ACC: 'Accessibilité', ORI: "Jouabilité d'origine", PER: 'Personnalisation',
    MAR: 'Positionnement',
  },
} as const;

export type RacquetTesterCriterion = keyof typeof RACQUET_TESTER_SOURCE.criteria;
export type RacquetProfileAxis = 'power' | 'control' | 'comfort' | 'maneuverability' | 'stability';

/** Axe du profil affiché -> critère du document. */
export const RACQUET_AXIS_TO_CRITERION: Readonly<Record<RacquetProfileAxis, RacquetTesterCriterion>> = {
  power: 'PUI', control: 'PRE', comfort: 'CNF', maneuverability: 'MAN', stability: 'STA',
};

/**
 * Décalage d'ancrage par axe (/10), mesuré sur les raquettes rapprochées.
 * Recalculé le 10/10/2026 après la révision de `deriveRacquetProfile` (contrôle
 * sans RA, masse en échelle linéaire) : contrôle −2,8 → −2,2, confort −2,2 →
 * −2,4, maniabilité −2,9 → −2,4, stabilité −1,7 → −2,3 ; puissance inchangée.
 */
export const RACQUET_ANCHOR_SHIFT: Readonly<Record<RacquetProfileAxis, number>> = {
  power: -2.5, control: -2.2, comfort: -2.4, maneuverability: -2.4, stability: -2.3,
};

export interface RacquetTesterEntry {
  docxName: string;
  docxAverage20: number;
  tier: string;
  confidence: string;
  /** Génération testée, et specs qui ont permis le rapprochement. */
  testedGeneration: string;
  specCheck: { url: string; headSize: number; unstrungWeight: number; pattern: string; ra: number };
  /** 20 critères, dans l'ordre du document. */
  raw20: Record<RacquetTesterCriterion, number>;
}

const CRIT_ORDER: readonly RacquetTesterCriterion[] = [
  'PUI', 'PEN', 'PRE', 'CST', 'TOL', 'STA', 'MAN', 'EFF', 'PLA', 'TOU',
  'CNF', 'SER', 'VOL', 'RET', 'DEF', 'POL', 'ACC', 'ORI', 'PER', 'MAR',
];
const row = (v: readonly number[]) =>
  Object.fromEntries(CRIT_ORDER.map((c, i) => [c, v[i]])) as Record<RacquetTesterCriterion, number>;

const TWE = 'https://www.tenniswarehouse-europe.com';

/** Fiche du catalogue (id) -> avis de testeurs. 18 rapprochements établis (dont 7 fiches alignées
 * sur la dernière génération le 09/10/2026, cf. commentaires de racquets-database.ts). */
export const RACQUET_TESTER_RATINGS: Readonly<Record<string, RacquetTesterEntry>> = {
  'babolat-pure-aero-standard': {
    docxName: 'Babolat Pure Aero 100', docxAverage20: 16.55, tier: 'S', confidence: 'Moyenne',
    testedGeneration: '2026 (fiche alignée le 09/10/2026)',
    specCheck: { url: `${TWE}/Babolat_Pure_Aero_2026_Racket/descpageRCQBA-BPAR26-EN.html`, headSize: 100, unstrungWeight: 300, pattern: '16x19', ra: 66 },
    raw20: row([18, 19, 15, 17, 18, 17, 17, 19, 14, 17, 16, 16, 14, 16, 16, 16, 16, 18, 13, 19]),
  },
  'babolat-pure-drive-standard': {
    docxName: 'Babolat Pure Drive', docxAverage20: 16.3, tier: 'S', confidence: 'Élevée',
    testedGeneration: '2025 (fiche alignée le 09/10/2026)',
    specCheck: { url: `${TWE}/Babolat_Pure_Drive_2025_Racket_/descpageRCQBA-BPD25R-EN.html`, headSize: 100, unstrungWeight: 300, pattern: '16x19', ra: 69 },
    raw20: row([18, 17, 15, 17, 18, 16, 16, 15, 16, 15, 14, 18, 14, 16, 16, 17, 19, 18, 13, 18]),
  },
  'tecnifibre-tfight-305s-id': {
    docxName: 'Tecnifibre T-Fight 305S', docxAverage20: 15.95, tier: 'A', confidence: 'Élevée',
    testedGeneration: '2025 (fiche alignée le 09/10/2026)',
    specCheck: { url: `${TWE}/Tecnifibre_TFight_305S_Racket/descpageRCTECNIH-TF305S-EN.html`, headSize: 98, unstrungWeight: 305, pattern: '18x19', ra: 63 },
    raw20: row([15, 16, 19, 19, 15, 18, 17, 15, 18, 18, 10, 18, 13, 17, 14, 15, 12, 17, 14, 19]),
  },
  'yonex-ezone-100': {
    docxName: 'Yonex EZONE 100', docxAverage20: 15.55, tier: 'A', confidence: 'Élevée',
    testedGeneration: '2025 (fiche alignée le 09/10/2026)',
    specCheck: { url: `${TWE}/Yonex_EZONE_100_300g_Blast_Blue_Racket/descpageRCYONEX-EZ10BB-EN.html`, headSize: 100, unstrungWeight: 300, pattern: '16x19', ra: 68 },
    raw20: row([18, 18, 16, 16, 18, 17, 12, 17, 15, 13, 16, 15, 15, 16, 15, 13, 15, 16, 13, 17]),
  },
  'yonex-percept-100d': {
    docxName: 'Yonex Percept 100D', docxAverage20: 14.85, tier: 'B', confidence: 'Élevée',
    testedGeneration: 'en vente (fiche alignée le 09/10/2026)',
    specCheck: { url: `${TWE}/Yonex_Percept_100D_Racket/descpageRCYONEX-PERCY-EN.html`, headSize: 100, unstrungWeight: 305, pattern: '18x19', ra: 66 },
    raw20: row([13, 15, 18, 18, 11, 18, 13, 14, 18, 16, 14, 15, 16, 16, 12, 12, 11, 16, 14, 17]),
  },
  'yonex-percept-100': {
    docxName: 'Yonex Percept 100', docxAverage20: 14.55, tier: 'B', confidence: 'Faible',
    testedGeneration: 'en vente (fiche alignée le 09/10/2026)',
    specCheck: { url: `${TWE}/Yonex_Percept_100_Racket/descpageRCYONEX-PERC1-EN.html`, headSize: 100, unstrungWeight: 300, pattern: '16x19', ra: 66 },
    raw20: row([15, 15, 15, 14, 15, 15, 13, 15, 15, 15, 14, 15, 15, 14, 14, 16, 14, 15, 14, 13]),
  },
  'head-boom-pro-2024': {
    docxName: 'Head Boom Pro', docxAverage20: 13.1, tier: 'C', confidence: 'Faible',
    testedGeneration: '2026 (specs identiques à la 2024 ; fiche datée 2026 le 09/10/2026)',
    specCheck: { url: `${TWE}/Head_Boom_Pro_2026_Racket/descpageRCHEAD-HBOOP6-EN.html`, headSize: 98, unstrungWeight: 310, pattern: '16x19', ra: 64 },
    raw20: row([14, 13, 13, 11, 15, 14, 13, 13, 13, 13, 14, 13, 13, 13, 13, 13, 15, 14, 12, 10]),
  },
  'yonex-vcore-98': {
    docxName: 'Yonex VCORE 98', docxAverage20: 15.0, tier: 'A', confidence: 'Élevée',
    testedGeneration: '2026 (8e génération)',
    specCheck: { url: `${TWE}/Yonex_VCORE_98_Ruby_Red_305g_Racket/descpageRCYONEX-YVC986-EN.html`, headSize: 98, unstrungWeight: 305, pattern: '16x19', ra: 63 },
    raw20: row([17, 17, 14, 15, 17, 15, 14, 16, 15, 13, 15, 15, 14, 14, 14, 14, 14, 15, 14, 18]),
  },
  'wilson-defyer-98-pro-v1': {
    docxName: 'Wilson Defy 98 (Defyer P98)', docxAverage20: 14.9, tier: 'B', confidence: 'Moyenne',
    testedGeneration: 'v1 — seule raquette 98 de la gamme Defyer',
    specCheck: { url: `${TWE}/Wilson_Defyer_98_Pro_Racket/descpageRCWILSON-WRL98-EN.html`, headSize: 98, unstrungWeight: 305, pattern: '16x20', ra: 64 },
    raw20: row([15, 15, 17, 17, 12, 12, 18, 16, 15, 18, 14, 15, 15, 11, 13, 17, 12, 12, 17, 17]),
  },
  'dunlop-fx-500': {
    docxName: 'Dunlop FX 500', docxAverage20: 14.75, tier: 'B', confidence: 'Élevée',
    testedGeneration: '2025',
    specCheck: { url: `${TWE}/Dunlop_FX_500_Racket/descpageRCDUNHGER-DFX526-EN.html`, headSize: 100, unstrungWeight: 300, pattern: '16x19', ra: 68 },
    raw20: row([15, 16, 17, 17, 15, 17, 12, 14, 16, 14, 12, 15, 16, 16, 13, 12, 13, 16, 13, 16]),
  },
  'yonex-vcore-100': {
    docxName: 'Yonex VCORE 100', docxAverage20: 14.65, tier: 'B', confidence: 'Moyenne',
    testedGeneration: '2026 (8e génération)',
    specCheck: { url: `${TWE}/Yonex_VCORE_100_Ruby_Red_300g_Racket/descpageRCYONEX-YVC106-EN.html`, headSize: 100, unstrungWeight: 300, pattern: '16x19', ra: 65 },
    raw20: row([18, 18, 13, 13, 17, 15, 12, 18, 12, 13, 14, 15, 13, 14, 15, 13, 15, 16, 13, 16]),
  },
  'head-speed-mp': {
    docxName: 'Head Speed MP', docxAverage20: 14.6, tier: 'B', confidence: 'Moyenne',
    testedGeneration: '2026',
    specCheck: { url: `${TWE}/Head_Speed_MP_2026_Racket/descpageRCHEAD-HSPMP6-EN.html`, headSize: 100, unstrungWeight: 300, pattern: '16x19', ra: 60 },
    raw20: row([15, 16, 15, 16, 13, 14, 14, 14, 15, 13, 14, 14, 14, 14, 14, 17, 16, 16, 13, 15]),
  },
  'yonex-vcore-95': {
    docxName: 'Yonex VCORE 95', docxAverage20: 14.5, tier: 'B', confidence: 'Moyenne',
    testedGeneration: '2026 (8e génération)',
    specCheck: { url: `${TWE}/learning_center/racquet_reviews/YVC956review.html`, headSize: 95, unstrungWeight: 310, pattern: '16x20', ra: 62 },
    raw20: row([14, 15, 17, 16, 13, 14, 16, 16, 15, 15, 13, 14, 14, 13, 13, 15, 12, 15, 14, 16]),
  },
  'yonex-ezone-98': {
    docxName: 'Yonex EZONE 98', docxAverage20: 14.3, tier: 'B', confidence: 'Faible',
    testedGeneration: '2025',
    specCheck: { url: `${TWE}/Yonex_EZONE_98_305g_Blast_Blue_Racket/descpageRCYONEX-EZ98BB-EN.html`, headSize: 98, unstrungWeight: 305, pattern: '16x19', ra: 63 },
    raw20: row([16, 15, 14, 13, 15, 12, 15, 16, 12, 12, 15, 16, 14, 12, 14, 15, 16, 15, 13, 16]),
  },
  'wilson-defyer-100-v1': {
    docxName: 'Wilson Defy 100 (Defyer P100)', docxAverage20: 14.25, tier: 'B', confidence: 'Moyenne',
    testedGeneration: 'v1',
    specCheck: { url: `${TWE}/Wilson_Defyer_100_Racket/descpageRCWILSON-WRL100-EN.html`, headSize: 100, unstrungWeight: 300, pattern: '16x19', ra: 66 },
    raw20: row([14, 13, 14, 12, 14, 13, 18, 16, 12, 17, 15, 15, 14, 13, 13, 13, 15, 15, 14, 15]),
  },
  'babolat-pure-aero-98': {
    docxName: 'Babolat Pure Aero 98', docxAverage20: 13.6, tier: 'C', confidence: 'Moyenne',
    testedGeneration: '2026',
    specCheck: { url: `${TWE}/Babolat_Pure_Aero_98_SINGLE_Racket/descpageRCQBA-BPA98R-EN.html`, headSize: 98, unstrungWeight: 305, pattern: '16x20', ra: 66 },
    raw20: row([17, 18, 13, 14, 15, 16, 10, 18, 12, 11, 12, 12, 11, 14, 14, 10, 12, 13, 16, 14]),
  },
  'head-gravity-tour': {
    docxName: 'Head Gravity Tour', docxAverage20: 13.6, tier: 'C', confidence: 'Élevée',
    testedGeneration: '2025 (la génération précédente avait un tamis 100 et un plan 18x20)',
    specCheck: { url: `${TWE}/Head_Gravity_Tour_2025_Racket/descpageRCHEAD-HGTRR-EN.html`, headSize: 98, unstrungWeight: 305, pattern: '16x19', ra: 59 },
    raw20: row([10, 11, 15, 12, 10, 11, 15, 15, 14, 19, 18, 17, 18, 11, 11, 15, 9, 12, 15, 14]),
  },
  'wilson-ultra-100-v5': {
    docxName: 'Wilson Ultra 100 V5', docxAverage20: 13.2, tier: 'C', confidence: 'Élevée',
    testedGeneration: 'v5 (RA 67, contre 70 sur la v4)',
    specCheck: { url: `${TWE}/learning_center/racquet_reviews/WU1005review.html`, headSize: 100, unstrungWeight: 300, pattern: '16x19', ra: 67 },
    raw20: row([13, 15, 14, 15, 15, 16, 13, 11, 15, 9, 16, 11, 12, 15, 14, 10, 15, 14, 11, 10]),
  },
};

/**
 * Raquettes notées par le document mais NON appliquées au catalogue, avec la
 * raison. Aucune note n'est déduite pour elles. Les 8 raquettes absentes du
 * catalogue (Acro Strike, Extreme Pro, VCORE 100D, Acro Speed, Squared,
 * Blade 98 V10, Axis 98, Speed Tour 97) n'ont pas de fiche et n'en reçoivent pas.
 */
export const RACQUET_TESTER_QUARANTINE: Readonly<Record<string, string>> = {
  'Tecnifibre Fire (300 / 305 S)': 'Ligne qui agrège deux tamis (100 et 98) : non rapprochable.',
};

const round1 = (v: number) => Math.round(v * 10 + 1e-9) / 10;

/** Note testeurs recalée sur l'échelle du profil (/10), avant moyenne. */
export function recalibratedTesterNote(entry: RacquetTesterEntry, axis: RacquetProfileAxis): number {
  return Math.min(10, Math.max(0, entry.raw20[RACQUET_AXIS_TO_CRITERION[axis]] / 2 + RACQUET_ANCHOR_SHIFT[axis]));
}

/** Note affichée : moyenne (profil dérivé, note testeurs recalée), au dixième. */
export function blendRacquetNote(derived: number, entry: RacquetTesterEntry, axis: RacquetProfileAxis): number {
  return round1(Math.min(10, Math.max(0, (derived + recalibratedTesterNote(entry, axis)) / 2)));
}
