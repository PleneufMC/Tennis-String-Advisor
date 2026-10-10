/**
 * Provenance des rigidités de cordage mesurées en laboratoire (C2, 10/10/2026).
 *
 * Décision de Pierre du 10/10/2026 : « Rigidités de laboratoire, en commençant par ces 8 polyesters :
 * on aligne leur rigidité sur la mesure faite sur le bon modèle et la bonne jauge ».
 *
 * POURQUOI UN FICHIER À PART. TWU mesure CHAQUE jauge séparément (un cordage a une ligne par jauge) ;
 * nos fiches regroupent plusieurs jauges sous UNE rigidité. Écrire la valeur d'une jauge arbitraire
 * remplacerait une donnée douteuse par une donnée fausse : l'écart entre jauges d'un même polyester
 * atteint 47 lb/in (Black Code), soit environ 5 points d'indice RCS, la largeur d'un palier de
 * l'échelle publiée. Ce fichier consigne, pour chaque fiche, TOUTES les mesures TWU du couple exact
 * (modèle, jauge) et dit ce qui est appliqué, retenu ou mis en quarantaine, et pourquoi.
 *
 * Statuts :
 *   - `appliquee` : la rigidité de la fiche (`stiffness`) EST la mesure TWU enregistrée ici, selon une
 *     règle qui ne demande aucun choix de produit :
 *       · `jauge-unique` : la fiche n'a qu'une jauge, c'est celle qui est mesurée ;
 *       · `plancher` : les jauges de la fiche sont TOUTES mesurées et TOUTES plus rigides que la valeur
 *         antérieure ; on écrit la plus basse, vraie quelle que soit la jauge de référence retenue.
 *   - `retenue-jauge` : couple (modèle, jauge) mesuré, mais la valeur dépend de la jauge de référence,
 *     qui est une décision de produit (arbitrage de Pierre). Rien n'est appliqué : `stiffness` reste
 *     égale à `before`. Règle 2 : une correction qui baisserait une alerte attend son GO explicite.
 *   - `quarantaine` : appariement non établi (aucune ligne TWU à ce nom) ; la valeur reste, le motif est écrit.
 *
 * Conditions de mesure (identiques pour toutes les lignes) : tension de référence 51 lbs, vitesse de
 * balayage « Fast », unité lb/in. Une seule mesure par couple (modèle, jauge), sans incertitude publiée.
 *
 * NON AFFICHÉ sur le site : aucun composant, générateur ni moteur statique ne lit ce fichier (contrôle
 * 13 ter de `audit:ratings`, qui vérifie aussi chaque mesure contre la copie versionnée du relevé TWU).
 */

export const STIFFNESS_SOURCE = {
  url: 'https://twu.tennis-warehouse.com/learning_center/reporter2.php',
  request: 'POST zbrand=all, zmaterial=all, zref_tension=23 (51 lbs), zhammer=1 (Fast), colonne « Gauge Nominal (mm) » demandée',
  referenceTensionLbs: 51,
  swingSpeed: 'Fast',
  /** Copie versionnée (polyesters, 480 lignes) : les mesures ci-dessous y sont retrouvées par le contrôle. */
  versionedCopy: 'data/reference/twu-string-stiffness.json',
  /** Trois relevés concordants pour les lignes de ce fichier. */
  retrievals: [
    { date: '2026-08-08', records: 480, scope: 'polyesters', where: 'data/reference/twu-string-stiffness.json' },
    { date: '2026-09-29', records: 788, scope: 'tous matériaux', where: 'scripts/scraper/out/twu-strings.json (non versionné)' },
    { date: '2026-10-10', records: 788, scope: 'tous matériaux', where: 'contrôle, identique octet pour octet au 29/09 (sha256 01c07ccea468d79ba3445753f788c1ff5ccdd852c5111d946c872f4488be8872)' },
  ],
} as const;

export type StiffnessStatus = 'appliquee' | 'retenue-jauge' | 'quarantaine';
export type StiffnessRule = 'jauge-unique' | 'plancher';

export interface TwuMeasure {
  /** Intitulé de la ligne TWU, tel que publié (modèle exact + calibre, éventuellement la jauge). */
  twu: string;
  /** Jauge nominale TWU (mm), au format des `gauges` de la fiche. */
  gauge: string;
  /** Rigidité mesurée (lb/in), 51 lbs, Fast. */
  lbIn: number;
}

export interface StringStiffnessProvenance {
  status: StiffnessStatus;
  /** Rigidité de la fiche avant ce chantier (main au 10/10/2026), sans source. */
  before: number;
  /** Mesures TWU du couple exact (modèle, jauge), une par jauge de la fiche mesurée ; vide en quarantaine. */
  measures: readonly TwuMeasure[];
  /** `appliquee` : règle qui désigne la mesure écrite dans `stiffness`. */
  rule?: StiffnessRule;
  /** `appliquee` : jauge dont la mesure est écrite dans `stiffness`. */
  appliedGauge?: string;
  /** Règle 2 : GO explicite de Pierre (qui, quand) pour une correction qui BAISSE la rigidité ; absent sinon. */
  loweringApprovedBy?: string;
  /** Motif : pourquoi cette valeur, ou pourquoi rien n'est appliqué. */
  note: string;
}

export const STRING_STIFFNESS_PROVENANCE: Readonly<Record<string, StringStiffnessProvenance>> = {
  // ---- Appliquées -------------------------------------------------------------------------------
  'luxilon-savage': {
    status: 'appliquee',
    before: 220,
    rule: 'jauge-unique',
    appliedGauge: '1.27',
    measures: [{ twu: 'Luxilon Savage 16/1.27', gauge: '1.27', lbIn: 234.3 }],
    note:
      'Jauge unique de la fiche (1.27), c\'est la jauge mesurée : aucun choix de jauge. Hausse de 14,3 lb/in. ' +
      'TWU ne publie pas le coloris de l\'échantillon ; « Savage Black » (fiche distincte) n\'a aucune ligne TWU et reste inchangée.',
  },
  'tecnifibre-black-code-4s': {
    status: 'appliquee',
    before: 200,
    rule: 'plancher',
    appliedGauge: '1.25',
    measures: [
      { twu: 'Tecnifibre Black Code 4S 18 (1.20)', gauge: '1.20', lbIn: 210.3 },
      { twu: 'Tecnifibre Black Code 4S 17 (1.25)', gauge: '1.25', lbIn: 209.2 },
      { twu: 'Tecnifibre Black Code 4S 16 (1.30)', gauge: '1.30', lbIn: 242.9 },
    ],
    note:
      'Les trois jauges de la fiche sont mesurées et dépassent toutes 200 : 209,2 (1.25) est la plus basse, donc vraie quelle que ' +
      'soit la jauge de référence que Pierre retiendra. Une référence plus rigide (1.30 : 242,9) relève de son arbitrage. ' +
      'Même produit que tecnifibre-4s (fusion des doublons du 10/10/2026).',
  },

  // ---- Retenues : la valeur dépend de la jauge de référence (décision de produit) ---------------
  'tecnifibre-black-code': {
    status: 'retenue-jauge',
    before: 210,
    measures: [
      { twu: 'Tecnifibre Black Code 18', gauge: '1.18', lbIn: 202.9 },
      { twu: 'Tecnifibre Black Code 17', gauge: '1.24', lbIn: 236 },
      { twu: 'Tecnifibre Black Code 16', gauge: '1.28', lbIn: 249.7 },
      { twu: 'Tecnifibre Black Code 15L (1.32)', gauge: '1.32', lbIn: 210.3 },
    ],
    note:
      'Quatre jauges, 47 lb/in d\'écart. 1.18 baisserait la rigidité (202,9) ; 1.24 et 1.28 la hausseraient de 26 à 40. La mesure en 1.32 ' +
      '(210,3) est plus souple que celles en 1.24 et 1.28 alors que la jauge est plus épaisse : échantillon suspect, à ne pas retenir comme référence.',
  },
  'tecnifibre-pro-red-code': {
    status: 'retenue-jauge',
    before: 225,
    measures: [
      { twu: 'Tecnifibre Pro Red Code 18', gauge: '1.20', lbIn: 217.2 },
      { twu: 'Tecnifibre Pro Red Code 17', gauge: '1.25', lbIn: 225.7 },
      { twu: 'Tecnifibre Pro Red Code 16', gauge: '1.30', lbIn: 232 },
    ],
    note: 'La valeur actuelle (225) tombe sur la mesure en 1.25 (225,7) ; 1.20 la baisserait de 7,8, 1.30 la hausserait de 7. « Pro Red Code Wax » est un autre produit (fiche distincte).',
  },
  'head-hawk': {
    status: 'retenue-jauge',
    before: 215,
    measures: [
      { twu: 'Head Hawk 18 (1.20)', gauge: '1.20', lbIn: 194.3 },
      { twu: 'Head Hawk 17 (1.25)', gauge: '1.25', lbIn: 204.6 },
      { twu: 'Head Hawk 16 (1.30)', gauge: '1.30', lbIn: 230.3 },
    ],
    note: '1.20 et 1.25 baisseraient la rigidité (de 20,7 et 10,4), 1.30 la hausserait de 15,3. « Hawk Touch », « Hawk Power » et « Hawk Rough » sont d\'autres produits.',
  },
  'gamma-moto': {
    status: 'retenue-jauge',
    before: 205,
    measures: [
      { twu: 'Gamma Moto 17 (1.24)', gauge: '1.24', lbIn: 201.7 },
      { twu: 'Gamma Moto 16', gauge: '1.29', lbIn: 226.9 },
    ],
    note:
      'Deux jauges de part et d\'autre de la valeur actuelle : 1.24 la baisserait de 3,3, 1.29 la hausserait de 21,9. Tennis Warehouse vend ce produit ' +
      'sous le nom « AMP Moto » (17/1.24), TWU le liste « Gamma Moto » ; « Moto Soft » est un autre produit (pas de fiche).',
  },
  // Hors des 8 : même produit que tecnifibre-atp-razor-code (fusion des doublons du 10/10/2026), consigné pour mémoire.
  'tecnifibre-razor-code': {
    status: 'retenue-jauge',
    before: 220,
    measures: [
      { twu: 'Tecnifibre Razor Code 18 (1.20)', gauge: '1.20', lbIn: 216.6 },
      { twu: 'Tecnifibre Razor Code 17 (1.25)', gauge: '1.25', lbIn: 229.2 },
      { twu: 'Tecnifibre Razor Code 16 (1.30)', gauge: '1.30', lbIn: 242.9 },
    ],
    note: 'Hors des 8 polyesters. 1.20 baisserait la rigidité de 3,4 ; 1.25 et 1.30 la hausseraient de 9,2 et 22,9. Même produit que tecnifibre-atp-razor-code (fusion des doublons du 10/10/2026).',
  },

  // ---- Quarantaine : appariement non établi ------------------------------------------------------
  'tecnifibre-4s': {
    status: 'quarantaine',
    before: 222,
    measures: [],
    note:
      'Aucune ligne TWU « 4S » : TWU ne liste que « Black Code 4S ». Même produit chez TW (« Same string, different name ») : l\'identité est établie par la fusion ' +
      'des doublons (10/10/2026) ; tant que la fiche existe, la valeur actuelle reste.',
  },
  'tecnifibre-atp-razor-code': {
    status: 'quarantaine',
    before: 202,
    measures: [],
    note:
      'Aucune ligne TWU « ATP Razor Code » : TWU ne liste que « Razor Code » (TW décrit sa fiche comme « ATP Razor Code »). L\'identité est établie par la fusion ' +
      'des doublons (10/10/2026) ; tant que la fiche existe, la valeur actuelle reste.',
  },
};
