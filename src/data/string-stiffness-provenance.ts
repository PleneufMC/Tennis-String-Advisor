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
 * RÈGLE DE JAUGE DE RÉFÉRENCE (décision de Pierre du 10/10/2026, « GO » sur la règle C) : la rigidité d'une
 * fiche = la mesure TWU de la JAUGE LA PLUS RIGIDE mesurée parmi les jauges de la fiche. Seule règle qui ne
 * baisse aucune alerte ; sur-alerte assumée sur les jauges fines, en attendant la règle D (rigidité PAR jauge).
 * Pierre a aussi décidé qu'aucune correction ne baisse une alerte pour l'instant (« une par une avec mon GO,
 * quand D sera là ») : une fiche dont la valeur C serait INFÉRIEURE à l'actuelle n'est pas modifiée.
 *
 * Statuts :
 *   - `appliquee` : la rigidité de la fiche (`stiffness`) EST la mesure TWU enregistrée ici, selon une règle :
 *       · `plus-rigide` : règle C (ci-dessus), valeur ≥ `before` ;
 *       · `jauge-unique` : la fiche n'a qu'une jauge, c'est celle qui est mesurée (cas particulier de C) ;
 *       · `plancher` : toutes les jauges mesurées, toutes plus rigides que `before`, on écrit la plus basse
 *         (règle du lot 1, antérieure à C ; plus aucune fiche ne l'utilise).
 *   - `retenue-jauge` : mesure disponible mais rien n'est appliqué (`stiffness` = `before`) parce que la règle C
 *     BAISSERAIT la valeur (règle 2 : GO explicite de Pierre). Une fiche dont C ≥ `before` doit être appliquée.
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
  /** Copie versionnée n°1 (polyesters, 480 lignes, sans jauge nominale) : les mesures de polyesters y sont retrouvées par le contrôle. */
  versionedCopy: 'data/reference/twu-string-stiffness.json',
  /**
   * Copie versionnée n°2 : extrait VERBATIM du relevé du 10/10/2026 (toutes matières, jauge nominale) des seules lignes citées
   * ici. Nécessaire : la copie n°1 ne contient aucun multifilament, et ses lignes sans jauge dans le nom n'ont pas de jauge.
   */
  citedLines: 'data/reference/twu-lignes-citees.json',
  /** Trois relevés concordants pour les lignes de ce fichier. */
  retrievals: [
    { date: '2026-08-08', records: 480, scope: 'polyesters', where: 'data/reference/twu-string-stiffness.json' },
    { date: '2026-09-29', records: 788, scope: 'tous matériaux', where: 'scripts/scraper/out/twu-strings.json (non versionné)' },
    { date: '2026-10-10', records: 788, scope: 'tous matériaux', where: 'contrôle, identique octet pour octet au 29/09 (sha256 01c07ccea468d79ba3445753f788c1ff5ccdd852c5111d946c872f4488be8872)' },
  ],
} as const;

export type StiffnessStatus = 'appliquee' | 'retenue-jauge' | 'quarantaine';
export type StiffnessRule = 'jauge-unique' | 'plancher' | 'plus-rigide';

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
    rule: 'plus-rigide',
    appliedGauge: '1.30',
    measures: [
      { twu: 'Tecnifibre Black Code 4S 18 (1.20)', gauge: '1.20', lbIn: 210.3 },
      { twu: 'Tecnifibre Black Code 4S 17 (1.25)', gauge: '1.25', lbIn: 209.2 },
      { twu: 'Tecnifibre Black Code 4S 16 (1.30)', gauge: '1.30', lbIn: 242.9 },
    ],
    note:
      'Règle C : 1.30 (242,9), la plus rigide des trois jauges ; 1.20 (210,3) et 1.25 (209,2) sont plus souples (sur-alerte assumée). Lot 1 : 209,2 (plancher). ' +
      'Même produit que tecnifibre-4s (fusion du 10/10/2026, TW : « Same string, different name ») : l\'ancien id valait 222, 242,9 ne baisse aucune alerte. ' +
      'TW « 4S 17/1.25 » (copie locale du 29/09) : co-polyester monofilament, Thermocore.',
  },
  'tecnifibre-black-code': {
    status: 'appliquee',
    before: 210,
    rule: 'plus-rigide',
    appliedGauge: '1.28',
    measures: [
      { twu: 'Tecnifibre Black Code 18', gauge: '1.18', lbIn: 202.9 },
      { twu: 'Tecnifibre Black Code 17', gauge: '1.24', lbIn: 236 },
      { twu: 'Tecnifibre Black Code 16', gauge: '1.28', lbIn: 249.7 },
      { twu: 'Tecnifibre Black Code 15L (1.32)', gauge: '1.32', lbIn: 210.3 },
    ],
    note:
      'Règle C : 1.28 (249,7), la plus rigide des quatre jauges ; 1.18 (202,9), 1.24 (236) et 1.32 (210,3) sont plus souples (sur-alerte assumée sur 1.18-1.24). ' +
      'La mesure en 1.32, plus souple que 1.24 et 1.28 malgré une jauge plus épaisse, est suspecte mais sans effet sur C. TW « Black Code 17/1.24 » (copie locale du 29/09) : co-polyester monofilament.',
  },
  'tecnifibre-pro-red-code': {
    status: 'appliquee',
    before: 225,
    rule: 'plus-rigide',
    appliedGauge: '1.30',
    measures: [
      { twu: 'Tecnifibre Pro Red Code 18', gauge: '1.20', lbIn: 217.2 },
      { twu: 'Tecnifibre Pro Red Code 17', gauge: '1.25', lbIn: 225.7 },
      { twu: 'Tecnifibre Pro Red Code 16', gauge: '1.30', lbIn: 232 },
    ],
    note: 'Règle C : 1.30 (232) ; 1.20 (217,2) et 1.25 (225,7) sont plus souples. « Pro Red Code Wax » est un autre produit (fiche distincte). TW « Pro Red Code 17/1.25 » (copie locale du 29/09) : polyester monofilament.',
  },
  'head-hawk': {
    status: 'appliquee',
    before: 215,
    rule: 'plus-rigide',
    appliedGauge: '1.30',
    measures: [
      { twu: 'Head Hawk 18 (1.20)', gauge: '1.20', lbIn: 194.3 },
      { twu: 'Head Hawk 17 (1.25)', gauge: '1.25', lbIn: 204.6 },
      { twu: 'Head Hawk 16 (1.30)', gauge: '1.30', lbIn: 230.3 },
    ],
    note:
      'Règle C : 1.30 (230,3) ; 1.20 (194,3) et 1.25 (204,6) sont plus souples : sur-alerte assumée de 26 à 36 lb/in sur les jauges fines. ' +
      '« Hawk Touch », « Hawk Power » et « Hawk Rough » sont d\'autres produits. TW « Hawk 17/1.25 » (copie locale du 29/09) : co-polyester monofilament.',
  },
  'gamma-moto': {
    status: 'appliquee',
    before: 205,
    rule: 'plus-rigide',
    appliedGauge: '1.29',
    measures: [
      { twu: 'Gamma Moto 17 (1.24)', gauge: '1.24', lbIn: 201.7 },
      { twu: 'Gamma Moto 16', gauge: '1.29', lbIn: 226.9 },
    ],
    note:
      'Règle C : 1.29 (226,9) ; 1.24 (201,7) est plus souple. Tennis Warehouse vend ce produit sous le nom « AMP Moto » (17/1.24, co-polyester monofilament, ' +
      'copie locale du 29/09), TWU le liste « Gamma Moto » ; « Moto Soft » est un autre produit (pas de fiche).',
  },
  'tecnifibre-razor-code': {
    status: 'appliquee',
    before: 220,
    rule: 'plus-rigide',
    appliedGauge: '1.30',
    measures: [
      { twu: 'Tecnifibre Razor Code 18 (1.20)', gauge: '1.20', lbIn: 216.6 },
      { twu: 'Tecnifibre Razor Code 17 (1.25)', gauge: '1.25', lbIn: 229.2 },
      { twu: 'Tecnifibre Razor Code 16 (1.30)', gauge: '1.30', lbIn: 242.9 },
    ],
    note:
      'Règle C : 1.30 (242,9) ; 1.20 (216,6) et 1.25 (229,2) sont plus souples. Même produit que tecnifibre-atp-razor-code (fusion du 10/10/2026) : ' +
      'l\'ancien id valait 202, 242,9 ne baisse aucune alerte. TW « Razor Code 17/1.25 » (copie locale du 29/09) : co-polyester monofilament.',
  },

  // ---- Lot 2 : hausses sûres approuvées par Pierre (10/10/2026), toutes les jauges de la fiche sont mesurées ----------
  'volkl-power-fiber-ii': {
    status: 'appliquee', before: 152, rule: 'jauge-unique', appliedGauge: '1.25',
    measures: [{ twu: 'Volkl Power-Fiber II 17', gauge: '1.25', lbIn: 158.9 }],
    note: 'Jauge unique (1.25) ; TWU mesure bien la génération II (16/1.32 et 18/1.18, hors fiche : 158,9 et 157,2). TW « Power Fiber II 17/1.25 » (copie locale du 29/09) : multifilament, matériau amélioré vs le Power Fibre d\'origine.',
  },
  'luxilon-alu-power-vibe': {
    status: 'appliquee', before: 200, rule: 'jauge-unique', appliedGauge: '1.25',
    measures: [{ twu: 'Luxilon Alu Power Vibe 16 (1.25)', gauge: '1.25', lbIn: 208 }],
    note: 'Jauge unique (1.25). TWU écrit « 16 (1.25) », ancien calibre (TW : « 1.25mm is now 17 gauge ») : la jauge en mm fait foi. TW (copie locale du 29/09) : co-polymère monofilament.',
  },
  'luxilon-element-rough': {
    status: 'appliquee', before: 188, rule: 'jauge-unique', appliedGauge: '1.30',
    measures: [{ twu: 'Luxilon Element Rough 16 (1.30)', gauge: '1.30', lbIn: 198.3 }],
    note: 'Jauge unique (1.30). TW « Element Rough 16/1.30 » (copie locale du 29/09) : co-polymère monofilament. « Element » et « Element Soft IR » sont d\'autres produits.',
  },
  'luxilon-eco-spin': {
    status: 'appliquee', before: 213, rule: 'jauge-unique', appliedGauge: '1.25',
    measures: [{ twu: 'Luxilon ECO Spin 17 (1.25)', gauge: '1.25', lbIn: 213.2 }],
    note: 'Jauge unique (1.25) ; hausse de 0,2 lb/in seulement. TW « ECO Spin 17/1.25 » (copie locale du 29/09) : co-polymère monofilament recyclé.',
  },
  'diadem-solstice-power': {
    status: 'appliquee', before: 200, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Diadem Solstice Power 16L (1.25)', gauge: '1.25', lbIn: 209.2 }, { twu: 'Diadem Solstice Power 16 (1.30)', gauge: '1.30', lbIn: 202.9 }],
    note: 'Règle C : 1.25 (209,2) ; 1.30 (202,9) est plus souple. TWU mesure aussi 15L/1.35 (228,6) et 17/1.20 (196,6), hors des jauges de la fiche. TW « Solstice Power 16L/1.25 » (copie locale du 29/09) : co-polyester.',
  },
  'tecnifibre-nrg2': {
    status: 'appliquee', before: 148, rule: 'plus-rigide', appliedGauge: '1.24',
    measures: [{ twu: 'Tecnifibre NRG2 17/1.24', gauge: '1.24', lbIn: 164 }, { twu: 'Tecnifibre NRG2 16', gauge: '1.32', lbIn: 158.3 }],
    note: 'Règle C : 1.24 (164) ; 1.32 (158,3) est plus souple. 18/1.18 (150,9, matière « Nylon/Polyurethane ») est hors fiche. TW « NRG2 17/1.24 » (copie locale du 29/09) : multifilament.',
  },
  'wilson-nxt': {
    status: 'appliquee', before: 152, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Wilson NXT 17', gauge: '1.24', lbIn: 156 }, { twu: 'Wilson NXT 16', gauge: '1.30', lbIn: 173.7 }],
    note: 'Règle C : 1.30 (173,7) ; 1.24 (156) est plus souple (sur-alerte assumée de 17,7). 15L/1.35 (152, hors fiche) est plus souple que 16 : bruit d\'échantillon. TW « NXT 17/1.24 » (copie locale du 29/09) : multifilament.',
  },
  'babolat-xcel-power': {
    status: 'appliquee', before: 140, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Babolat Xcel Power 17', gauge: '1.25', lbIn: 145.7 }, { twu: 'Babolat Xcel Power 16', gauge: '1.30', lbIn: 162.3 }],
    note: 'Règle C : 1.30 (162,3) ; 1.25 (145,7) est plus souple (sur-alerte assumée de 16,6). « Xcel » et « Xcel Premium » sont d\'autres produits. Génération non vérifiable : ni fiche ni revue TW, aucune fiche « Xcel Power » chez TW, TWE ni Babolat (recherche du 10/10), un seul avis TW d\'environ 2009 le cite : produit probablement ancien, existence à vérifier.',
  },
  'babolat-origin': {
    status: 'appliquee', before: 155, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Babolat Origin 17', gauge: '1.25', lbIn: 171.5 }, { twu: 'Babolat Origin 16 (1.30)', gauge: '1.30', lbIn: 166.9 }],
    note: 'Règle C : 1.25 (171,5) ; 1.30 (166,9) est plus souple alors que la jauge est plus épaisse : bruit d\'échantillon. Génération non vérifiable : ni fiche ni revue TW (absent du catalogue TW du 29/09) ; vendu en 16 et 17 (1.25 mm) par des détaillants, polyamide, classé tantôt multifilament, tantôt monofilament.',
  },
  'tecnifibre-xr3': {
    status: 'appliquee', before: 158, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Tecnifibre XR3 17', gauge: '1.25', lbIn: 160.6 }, { twu: 'Tecnifibre XR3 16', gauge: '1.30', lbIn: 162.9 }],
    note: 'Règle C : 1.30 (162,9) ; 1.25 (160,6) est plus souple. Matière TWU « Nylon/Polyurethane », cohérente avec la fiche. Génération non vérifiable : ni fiche ni revue TW (absent du catalogue TW du 29/09) ; le produit figure au catalogue Tecnifibre (page « XR3 Natural Multifilament Reel », 10/10), description illisible.',
  },

  // ---- Anciens identifiants fusionnés (alias) : leur valeur d'avant la fusion sert de plancher (règle 2) ----
  'tecnifibre-4s': {
    status: 'quarantaine',
    before: 222,
    measures: [],
    note:
      'Aucune ligne TWU « 4S » : TWU ne liste que « Black Code 4S ». Fusionné le 10/10/2026 dans tecnifibre-black-code-4s : les configurations enregistrées ' +
      'sous cet id valaient 222 ; le contrôle exige que la fiche conservée ne descende pas sous ce plancher sans GO de Pierre (règle 2).',
  },
  'tecnifibre-atp-razor-code': {
    status: 'quarantaine',
    before: 202,
    measures: [],
    note:
      'Aucune ligne TWU « ATP Razor Code » : TWU ne liste que « Razor Code ». Fusionné le 10/10/2026 dans tecnifibre-razor-code : les configurations enregistrées ' +
      'sous cet id valaient 202 ; le contrôle exige que la fiche conservée ne descende pas sous ce plancher sans GO de Pierre (règle 2).',
  },
};
