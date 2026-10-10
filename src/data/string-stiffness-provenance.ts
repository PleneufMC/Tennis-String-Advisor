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
 *   - `retenue-serie-suspecte` (lot 3, 10/10/2026) : appariement strict établi et valeur C SUPÉRIEURE à l'actuelle (une hausse),
 *     mais la série du modèle est non monotone et la garde ci-dessous échoue : la hausse ne repose que sur une mesure contredite.
 *     `stiffness` = `before` ; la hausse attend l'arbitrage. Le contrôle 13 ter vérifie que la garde échoue bien.
 *   - `quarantaine` : appariement strict non établi (aucune ligne TWU à ce nom, ou jauge nominale / matière qui ne tombe pas sur la
 *     fiche) ; la valeur reste, le motif est écrit. Le contrôle 13 ter vérifie que l'appariement (strict ou manuel) n'établit réellement rien.
 *
 * GARDE DE SÉRIE SUSPECTE (lot 3, demande de l'orchestrateur du 10/10/2026). Une mesure est « contredite » si une jauge plus épaisse
 * du même modèle et de la même matière, hors fiche comprise, a été mesurée plus souple (D1 : série non monotone). Une hausse (règle C)
 * sur une fiche à série suspecte n'est appliquée que si
 *   (B) la mesure retenue (la plus rigide) n'est contredite par aucune jauge plus épaisse, ou
 *   (A) la plus rigide des mesures non contredites de la fiche reste ≥ la valeur actuelle (la hausse tient même sans la mesure contredite) ;
 * sinon elle est retenue (`retenue-serie-suspecte`). La valeur écrite est toujours celle de la règle C. Le contrôle 13 ter recalcule la
 * garde depuis le relevé versionné ; une hausse antérieure à la garde qui ne la satisfait pas porte `suspectGuardExemption` (motif daté).
 *
 * APPARIEMENT MANUEL (lot 3, décision de l'orchestrateur du 10/10/2026, Pierre ayant délégué) : SEULE exception au motif strict d'intitulé
 * (`<modèle> <calibre>`, `<modèle> <calibre> (<jauge>)`, `<modèle> <calibre>/<jauge>`, `<modèle> <jauge>`). Une ligne TWU dont l'intitulé n'est
 * écarté de ce motif que par un suffixe de coloris (« Babolat RPM Team 16 Black ») peut être appariée à la main si elle figure dans
 * `MANUAL_PAIRINGS`, liste blanche DATÉE et MOTIVÉE limitée à UNE entrée ; la mesure porte alors `pairing: 'manuel'`. Le contrôle 13 ter
 * vérifie la ligne dans le relevé versionné (intitulé = modèle + calibre + un mot, matière du type de la fiche, jauge nominale = celle déclarée
 * et d'une jauge de la fiche, ligne unique à cette jauge, motif strict qui ne la reconnaît pas) et refuse toute entrée sans date, décideur ou
 * motif, toute mesure manuelle hors liste blanche et toute entrée de la liste sans mesure. L'exception va dans le sens qui protège le bras
 * (règle 2) : une erreur d'identité ne peut produire qu'une SUR-alerte.
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
   * Copie versionnée n°2 (D0, 10/10/2026) : le relevé COMPLET du 29/09/2026, toutes matières, jauge nominale comprise,
   * 788 enregistrements normalisés (modèle, calibre). Remplace l'extrait de 35 lignes : la copie n°1 ne contient aucun
   * multifilament ni jauge nominale. Reconstruite HORS LIGNE depuis le relevé brut local (non versionné) par
   * `scripts/scraper/twu-releve.mts` ; le contrôle 13 ter vérifie nombre, sha256 du brut reconstruit et schéma.
   * Cet ancrage (date, nombre, sha256) est la référence : changer de relevé se fait ICI, délibérément.
   */
  fullSurvey: {
    file: 'data/reference/twu-releve-complet.json',
    raw: 'scripts/scraper/out/twu-strings.json',
    retrieved: '2026-09-29',
    verifiedIdentical: ['2026-10-10'],
    records: 788,
    sha256: '01c07ccea468d79ba3445753f788c1ff5ccdd852c5111d946c872f4488be8872',
  },
  /** Trois relevés concordants pour les lignes de ce fichier. */
  retrievals: [
    { date: '2026-08-08', records: 480, scope: 'polyesters', where: 'data/reference/twu-string-stiffness.json' },
    { date: '2026-09-29', records: 788, scope: 'tous matériaux', where: 'data/reference/twu-releve-complet.json (copie versionnée, D0) ; brut local scripts/scraper/out/twu-strings.json (non versionné)' },
    { date: '2026-10-10', records: 788, scope: 'tous matériaux', where: 'contrôle, identique octet pour octet au 29/09 (sha256 01c07ccea468d79ba3445753f788c1ff5ccdd852c5111d946c872f4488be8872)' },
  ],
} as const;

/**
 * Appariement manuel : voir l'en-tête. Liste blanche DATÉE et MOTIVÉE, UNE entrée au plus (le contrôle 13 ter refuse la seconde).
 * Jamais lue par une surface du site ; le générateur des tables par jauge (`scripts/scraper/c2-par-jauge.mts`) et le contrôle 13 quater
 * la relisent pour que la table de la fiche contienne cette mesure.
 */
export interface ManualPairing {
  /** Identifiant de la fiche. */
  id: string;
  /** Intitulé TWU exact de la ligne appariée à la main. */
  twu: string;
  /** Jauge de la fiche (mm) à laquelle la ligne est appariée. */
  gauge: string;
  /** Date de la décision (AAAA-MM-JJ). */
  date: string;
  /** Qui a décidé. */
  decidedBy: string;
  /** Ce qui établit l'identité malgré l'intitulé non reconnu par le motif strict. */
  reason: string;
}

export const MANUAL_PAIRINGS: readonly ManualPairing[] = [
  {
    id: 'babolat-rpm-team',
    twu: 'Babolat RPM Team 16 Black',
    gauge: '1.30',
    date: '2026-10-10',
    decidedBy: 'orchestrateur (Pierre ayant délégué les arbitrages le 10/10/2026)',
    reason:
      'Modèle RPM Team ; coloris Black (la fiche est noire depuis #114, sur main au 10/10/2026) ; jauge 1.30 de la fiche ; matière Polyester, celle du type de la fiche ; ligne unique à cette jauge ; ' +
      'intitulé écarté du motif strict uniquement à cause du suffixe de coloris « Black » (« 16 Black » au lieu de « 16 » ou « 16 (1.30) »). ' +
      'La ligne 1.25 « Babolat RPM Team 17 (1.25) » (matière TWU « Nylon/Polyester », 245,2) ne contredit pas : la règle C retient la plus rigide mesurée aux jauges de la fiche (1.25 et 1.30). ' +
      'Seule exception au motif strict ; elle va dans le sens qui protège le bras (règle 2) : une erreur d\'identité ne peut produire qu\'une sur-alerte.',
  },
];

export type StiffnessStatus = 'appliquee' | 'retenue-jauge' | 'retenue-serie-suspecte' | 'quarantaine';
export type StiffnessRule = 'jauge-unique' | 'plancher' | 'plus-rigide';

export interface TwuMeasure {
  /** Intitulé de la ligne TWU, tel que publié (modèle exact + calibre, éventuellement la jauge). */
  twu: string;
  /** Jauge nominale TWU (mm), au format des `gauges` de la fiche. */
  gauge: string;
  /** Rigidité mesurée (lb/in), 51 lbs, Fast. */
  lbIn: number;
  /** `'manuel'` : ligne appariée à la main (liste blanche `MANUAL_PAIRINGS`), seule exception au motif strict d'intitulé ; absent sinon. */
  pairing?: 'manuel';
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
  /** Garde de série suspecte : motif daté d'une hausse appliquée AVANT la garde et qui ne la satisfait pas ; absent sinon (le contrôle refuse une exemption inutile). */
  suspectGuardExemption?: string;
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
    suspectGuardExemption: 'Lot 2 approuvé par Pierre le 10/10/2026, avant la garde de série suspecte ; ses deux mesures (156 et 173,7) sont contredites par la 15L/1.35 (152, hors fiche, égale à l\'ancienne valeur), mesurée plus souple que la 16 (bruit d\'échantillon déjà consigné dans la note) : la hausse reste approuvée, non revue ici. Exemption confirmée par l\'orchestrateur le 10/10/2026 (Pierre ayant délégué).',
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

  // ---- Lot 3 : hausses établies par la règle C (10/10/2026), garde de série suspecte appliquée (voir l'en-tête) ----------
  'babolat-revenge': {
    status: 'appliquee', before: 230, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Babolat Revenge 17', gauge: '1.25', lbIn: 222.3 }, { twu: 'Babolat Revenge 16', gauge: '1.30', lbIn: 276 }],
    note:
      'Règle C : 1.30 (276) ; 1.25 (222,3) est plus souple (sur-alerte assumée de 53,7 lb/in sur la jauge fine). Avec Luxilon 4G (286,9), devient l\'une des deux rigidités les plus hautes du catalogue (le maximum était 265 avant ce lot).',
  },
  'solinco-mach-10': {
    status: 'appliquee', before: 195, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Solinco Mach 10 16 (1.30)', gauge: '1.30', lbIn: 222.3 }],
    note:
      'Règle C : 1.30 (222,3). Couverture partielle : 1.15, 1.20, 1.25 non mesurées ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens.',
  },
  'tecnifibre-razor-soft': {
    status: 'appliquee', before: 185, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Tecnifibre Razor Soft 17 (1.25)', gauge: '1.25', lbIn: 212 }],
    note:
      'Règle C : 1.25 (212). Couverture partielle : 1.20, 1.30 non mesurées ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens.',
  },
  'yonex-poly-tour-spin-g': {
    status: 'appliquee', before: 215, rule: 'jauge-unique', appliedGauge: '1.25',
    measures: [{ twu: 'Yonex Poly Tour Spin G 1.25', gauge: '1.25', lbIn: 237.2 }],
    note:
      'Jauge unique (1.25), c\'est la jauge mesurée : aucun choix de jauge. Hausse de 22,2 lb/in. Intitulé TWU sans calibre (« Yonex Poly Tour Spin G 1.25 »), jauge nominale 1.25 ; « Poly Tour Spin » est un autre produit (fiche distincte).',
  },
  'luxilon-4g': {
    status: 'appliquee', before: 265, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Luxilon 4G 16L (1.25)', gauge: '1.25', lbIn: 258.9 }, { twu: 'Luxilon 4G 16 (1.30)', gauge: '1.30', lbIn: 286.9 }],
    note:
      'Règle C : 1.30 (286,9) ; 1.25 (258,9) est plus souple (sur-alerte assumée de 28 lb/in sur la jauge fine). 265 → 286,9 : devient la rigidité la plus haute du catalogue. « 4G Rough » et « 4G Soft » sont d\'autres produits (fiches distinctes).',
  },
  'tecnifibre-tgv': {
    status: 'appliquee', before: 145, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Tecnifibre TGV 17/1.25', gauge: '1.25', lbIn: 165.2 }, { twu: 'Tecnifibre TGV 16', gauge: '1.30', lbIn: 157.2 }],
    note:
      'Règle C : 1.25 (165,2) ; 1.30 (157,2) est plus souple (sur-alerte assumée de 8 lb/in sur la jauge fine). Couverture partielle : 1.35 non mesurée ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens. Série suspecte (inversion 1.25 (165,2) > 1.30 (157,2)) ; garde (A) satisfaite : le maximum (165,2) est contredit par une jauge plus épaisse mesurée plus souple, mais la plus rigide des mesures non contredites (157,2) reste ≥ 145, valeur actuelle.',
  },
  'signum-pro-x-perience': {
    status: 'appliquee', before: 205, rule: 'plus-rigide', appliedGauge: '1.24',
    measures: [{ twu: 'Signum Pro X-Perience 17 (1.24)', gauge: '1.24', lbIn: 224.6 }],
    note:
      'Règle C : 1.24 (224,6). Couverture partielle : 1.18, 1.30 non mesurées ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens.',
  },
  'head-lynx-tour': {
    status: 'appliquee', before: 210, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Head Lynx Tour 17 (1.25)', gauge: '1.25', lbIn: 217.7 }, { twu: 'Head Lynx Tour 16 (1.30)', gauge: '1.30', lbIn: 228.6 }],
    note:
      'Règle C : 1.30 (228,6) ; 1.25 (217,7) est plus souple (sur-alerte assumée de 10,9 lb/in sur la jauge fine). Couverture partielle : 1.20 non mesurée ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens.',
  },
  'luxilon-element': {
    status: 'appliquee', before: 190, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Luxilon Element 16L (1.25)', gauge: '1.25', lbIn: 208 }, { twu: 'Luxilon Element 1.30', gauge: '1.30', lbIn: 191.5 }],
    note:
      'Règle C : 1.25 (208) ; 1.30 (191,5) est plus souple (sur-alerte assumée de 16,5 lb/in sur la jauge fine). Série suspecte (inversion 1.25 (208) > 1.30 (191,5)) ; garde (A) satisfaite : le maximum (208) est contredit par une jauge plus épaisse mesurée plus souple, mais la plus rigide des mesures non contredites (191,5) reste ≥ 190, valeur actuelle. Intitulé TWU sans calibre pour la 1.30 (« Luxilon Element 1.30 »). « Element Rough » et « Element Soft IR » sont d\'autres produits.',
  },
  'tecnifibre-pro-red-code-wax': {
    status: 'appliquee', before: 220, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Tecnifibre Pro Red Code Wax 17', gauge: '1.25', lbIn: 235.5 }],
    note:
      'Règle C : 1.25 (235,5). Couverture partielle : 1.20, 1.30 non mesurées ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens. « Pro Red Code » (fiche distincte) est un autre produit.',
  },
  'yonex-poly-tour-spin': {
    status: 'appliquee', before: 200, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Yonex Poly Tour Spin 16L (1.25)', gauge: '1.25', lbIn: 213.7 }],
    note:
      'Règle C : 1.25 (213,7). Couverture partielle : 1.20, 1.30 non mesurées ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens. « Poly Tour Spin G » (1.25 : 237,2) est un autre produit (fiche distincte).',
  },
  'isospeed-cream': {
    status: 'appliquee', before: 165, rule: 'plus-rigide', appliedGauge: '1.28',
    measures: [{ twu: 'IsoSpeed Cream 17 (1.28)', gauge: '1.28', lbIn: 177.7 }],
    note:
      'Règle C : 1.28 (177,7). Couverture partielle : 1.20 non mesurée ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens. TWU écrit « 17 (1.28) » alors que TW vend la 1.28 en 16L : la jauge en mm fait foi.',
  },
  'babolat-m7': {
    status: 'appliquee', before: 150, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Babolat M7 16 (1.30)', gauge: '1.30', lbIn: 160.6 }],
    note:
      'Règle C : 1.30 (160,6). Couverture partielle : 1.25, 1.35 non mesurées ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens.',
  },
  'wilson-synthetic-gut-extreme': {
    status: 'appliquee', before: 175, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Wilson Synthetic Gut Extreme 17', gauge: '1.25', lbIn: 185.2 }],
    note:
      'Règle C : 1.25 (185,2). Couverture partielle : 1.30 non mesurée ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens.',
  },
  'head-hawk-power': {
    status: 'appliquee', before: 195, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Head Hawk Power 17 (1.25)', gauge: '1.25', lbIn: 203.5 }],
    note:
      'Règle C : 1.25 (203,5). Couverture partielle : 1.30 non mesurée ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens.',
  },
  'luxilon-adrenaline': {
    status: 'appliquee', before: 205, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Luxilon Adrenaline 16L/1.25', gauge: '1.25', lbIn: 202.9 }, { twu: 'Luxilon Adrenaline 16', gauge: '1.30', lbIn: 212.6 }],
    note:
      'Règle C : 1.30 (212,6) ; 1.25 (202,9) est plus souple (sur-alerte assumée de 9,7 lb/in sur la jauge fine). Série suspecte (inversion 1.20 (208) > 1.25 (202,9)) ; garde (B) satisfaite : le maximum n\'est contredit par aucune jauge plus épaisse. Lecture hors fiche : « Luxilon Adrenaline 17/1.20 » = 208 (jauge 1.20 absente de la fiche). « Adrenaline Rough » est un autre produit.',
  },
  'babolat-xalt': {
    status: 'appliquee', before: 158, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Babolat Xalt 16 (1.30)', gauge: '1.30', lbIn: 165.2 }],
    note:
      'Règle C : 1.30 (165,2). Couverture partielle : 1.25 non mesurée ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens.',
  },
  'tecnifibre-x-one-biphase': {
    status: 'appliquee', before: 160, rule: 'plus-rigide', appliedGauge: '1.24',
    measures: [{ twu: 'Tecnifibre X-One Biphase 18', gauge: '1.18', lbIn: 145.7 }, { twu: 'Tecnifibre X-One Biphase 17', gauge: '1.24', lbIn: 166.9 }, { twu: 'Tecnifibre X-One Biphase 16', gauge: '1.30', lbIn: 162.9 }],
    note:
      'Règle C : 1.24 (166,9) ; 1.18 (145,7) et 1.30 (162,9) sont plus souples (sur-alerte assumée de 4 à 21,2 lb/in sur les jauges fines). Série suspecte (inversion 1.24 (166,9) > 1.30 (162,9)) ; garde (A) satisfaite : le maximum (166,9) est contredit par une jauge plus épaisse mesurée plus souple, mais la plus rigide des mesures non contredites (162,9) reste ≥ 160, valeur actuelle.',
  },
  'solinco-revolution': {
    status: 'appliquee', before: 210, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Solinco Revolution 17', gauge: '1.20', lbIn: 188.6 }, { twu: 'Solinco Revolution 16L (1.25)', gauge: '1.25', lbIn: 212.6 }, { twu: 'Solinco Revolution 16', gauge: '1.30', lbIn: 215.5 }],
    note:
      'Règle C : 1.30 (215,5) ; 1.20 (188,6) et 1.25 (212,6) sont plus souples (sur-alerte assumée de 2,9 à 26,9 lb/in sur les jauges fines). Série suspecte (inversion 1.16 (195,5) > 1.20 (188,6)) ; garde (B) satisfaite : le maximum n\'est contredit par aucune jauge plus épaisse. Lecture hors fiche : « Solinco Revolution 18 (1.16) » = 195,5 (jauge 1.16 absente de la fiche).',
  },
  'solinco-vanquish': {
    status: 'appliquee', before: 155, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Solinco Vanquish 16', gauge: '1.30', lbIn: 160 }],
    note:
      'Règle C : 1.30 (160). Couverture partielle : 1.25 non mesurée ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens. Lecture hors fiche : « Solinco Vanquish 17 (1.20) » = 145,7 (jauge 1.20 absente de la fiche).',
  },
  'solinco-hyper-g': {
    status: 'appliquee', before: 218, rule: 'plus-rigide', appliedGauge: '1.25',
    measures: [{ twu: 'Solinco Hyper-G 18 (1.15)', gauge: '1.15', lbIn: 180 }, { twu: 'Solinco Hyper-G 17 (1.20)', gauge: '1.20', lbIn: 194.9 }, { twu: 'Solinco Hyper-G 16L (1.25)', gauge: '1.25', lbIn: 218.3 }],
    note:
      'Règle C : 1.25 (218,3) ; 1.15 (180) et 1.20 (194,9) sont plus souples (sur-alerte assumée de 23,4 à 38,3 lb/in sur les jauges fines). Couverture partielle : 1.30 non mesurée ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens. Hors appariement : « Solinco Hyper-G 16 » (jauge nominale TWU 16 mm, faute de saisie probable pour 1.30 : 219,5, soit 1,2 lb/in de plus que la valeur appliquée) et « Hyper-G Round (1.30) » (226,3, produit distinct chez TW).',
  },
  'tecnifibre-ice-code': {
    status: 'appliquee', before: 221, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Tecnifibre Ice Code 16 (1.30)', gauge: '1.30', lbIn: 221.2 }],
    note:
      'Règle C : 1.30 (221,2). Couverture partielle : 1.25 non mesurée ; valeur plancher (une jauge non mesurée peut être plus rigide), hausse établie dans son sens. Hausse de 0,2 lb/in seulement.',
  },
  // Seule fiche du catalogue appariée à la main (MANUAL_PAIRINGS : décision de l'orchestrateur du 10/10/2026, Pierre ayant délégué).
  'babolat-rpm-team': {
    status: 'appliquee', before: 225, rule: 'plus-rigide', appliedGauge: '1.30',
    measures: [{ twu: 'Babolat RPM Team 16 Black', gauge: '1.30', lbIn: 280.6, pairing: 'manuel' }],
    note:
      'APPARIEMENT MANUEL, seule exception au motif strict (liste blanche MANUAL_PAIRINGS, décision de l\'orchestrateur du 10/10/2026) : « Babolat RPM Team 16 Black » = 280,6 lb/in, matière Polyester, jauge nominale 1.30, ligne unique à cette jauge ; ' +
      'l\'intitulé n\'est écarté du motif strict que par le suffixe de coloris « Black » (la fiche est noire depuis #114, sur main au 10/10/2026). Règle C : 1.30 (280,6). ' +
      'La ligne 1.25 « Babolat RPM Team 17 (1.25) » (matière TWU « Nylon/Polyester », 245,2) n\'est pas enregistrée (matière différente de celle de la fiche) et ne contredit pas : la règle C retient la plus rigide mesurée aux jauges de la fiche. ' +
      'Couverture partielle : seule la 1.30 est mesurée en polyester (1.25 : ligne « Nylon/Polyester » écartée ; 1.35, si la fiche la porte : non mesurée) ; valeur plancher, hausse établie dans son sens (+55,6 lb/in). Série non suspecte (une seule ligne polyester). ' +
      'Recoupement indirect (copie locale du 29/09 de la fiche Tennis Warehouse « RPM Team 17/1.25 », non versionnée) : co-polyester monofilament octogonal, noir, « l\'un des plus fermes des cordages Babolat testés » ; l\'étiquette TWU « Nylon/Polyester » de la ligne 1.25 n\'est donc probablement pas fiable. ' +
      'Une erreur d\'identité ne peut produire qu\'une sur-alerte (règle 2).',
  },

  // ---- Lot 3 : hausses établies mais NON appliquées -------------------------------------------------------------
  // Garde de série suspecte : la hausse ne repose que sur une mesure contredite par une jauge plus épaisse (voir l'en-tête).
  'solinco-x-natural': {
    status: 'retenue-serie-suspecte', before: 147,
    measures: [{ twu: 'Solinco X-Natural 17 (1.20)', gauge: '1.20', lbIn: 158.9 }, { twu: 'Solinco X-Natural 16 (1.30)', gauge: '1.30', lbIn: 144.6 }],
    note:
      'Hausse non appliquée (garde de série suspecte). La règle C donnerait 158,9 (1.20, +11,9 lb/in), mais cette mesure est contredite par la 1.30 (144,6), plus épaisse donc attendue plus rigide ; ' +
      'la seule mesure non contredite (144,6) est sous la valeur actuelle (147) : la hausse ne tient pas sans la mesure contredite. Sans effet sur les alertes de la grille au 10/10/2026 (0 -> 0 sur les trois indicateurs). À rouvrir avec la règle D ou une seconde mesure.',
  },
  'wilson-sensation': {
    status: 'retenue-serie-suspecte', before: 165,
    measures: [{ twu: 'Wilson Sensation 17', gauge: '1.25', lbIn: 163.4 }, { twu: 'Wilson Sensation 16', gauge: '1.30', lbIn: 168.6 }],
    note:
      'Hausse non appliquée (garde de série suspecte). La règle C donnerait 168,6 (1.30, +3,6 lb/in), mais les deux mesures de la fiche (163,4 et 168,6) sont contredites par la « Wilson Sensation 15 (1.35) » (154,3, hors fiche, jauge plus épaisse mesurée plus souple) : ' +
      'aucune mesure non contredite. Sans effet sur les alertes de la grille au 10/10/2026 (0 -> 0 sur les trois indicateurs). À rouvrir avec la règle D.',
  },

  // ---- Lot 3 : hausses candidates dont l'appariement strict n'est pas établi (quarantaine, aucune valeur écrite) ----
  // Tolérance de jauge de ± 0,01 mm REFUSÉE par l'orchestrateur le 10/10/2026 (Pierre ayant délégué) : l'appariement strict est maintenu.
  'gosen-og-sheep-micro': {
    status: 'quarantaine', before: 175, measures: [],
    note:
      'Hausse non appliquée : aucune jauge nominale TWU ne tombe sur une jauge de la fiche (1.25, 1.30). « Gosen OG-Sheep Micro 16 » (1.29, 183,5) est à 0,01 mm de la 1.30 ; tolérance de jauge refusée (décision de l\'orchestrateur du 10/10/2026) : appariement strict maintenu. ' +
      'Effet sur la grille au 10/10/2026 : 0 alerte standard, 3 sensibles, 2 de calculateCompatibility.',
  },
  'wilson-nxt-power': {
    status: 'quarantaine', before: 145, measures: [],
    note:
      'Hausse non appliquée : aucune jauge nominale TWU ne tombe sur une jauge de la fiche (1.25, 1.30). « Wilson NXT Power 17 (1.26) » (157,7) est à 0,01 mm de la 1.25 ; tolérance de jauge refusée (décision de l\'orchestrateur du 10/10/2026) : appariement strict maintenu. Effet sur la grille au 10/10/2026 : aucune alerte.',
  },
  'head-fxp': {
    status: 'quarantaine', before: 150, measures: [],
    note:
      'Hausse non appliquée : aucune jauge nominale TWU ne tombe sur une jauge de la fiche (1.25, 1.30). « Head FXP 17 » (1.24, 173,2) est à 0,01 mm de la 1.25 ; « Head FXP 16 » (1.32, 165,2, matière « Nylon/Polyester ») est à 0,02 mm de la 1.30 ; ' +
      'tolérance de jauge refusée (décision de l\'orchestrateur du 10/10/2026) : appariement strict maintenu. « Head FXP Power » et « Head FXP Tour » sont d\'autres produits. Effet sur la grille au 10/10/2026 : aucune alerte.',
  },
  'wilson-nxt-control': {
    status: 'quarantaine', before: 162, measures: [],
    note:
      'Hausse non appliquée : aucune jauge nominale TWU ne tombe sur une jauge de la fiche (1.24, 1.30). « Wilson NXT Control 16 (1.32) » (163,4, matière « Nylon/Polyester ») est à 0,02 mm de la 1.30 ; hausse de 1,4 lb/in seulement ; ' +
      'tolérance de jauge refusée (décision de l\'orchestrateur du 10/10/2026) : appariement strict maintenu. Effet sur la grille au 10/10/2026 : aucune alerte.',
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
