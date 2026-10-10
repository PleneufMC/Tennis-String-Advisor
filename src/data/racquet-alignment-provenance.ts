/**
 * Provenance des fiches alignées sur le produit en vente (veille du 10/10/2026, PR « fiches désynchronisées »).
 * Faits : `docs/redaction/veille-2026-10-10-fiches-desynchronisees.md` (V01-V116 ; L0 constructeur, L1 laboratoire TWU,
 * L2 revendeur, L3 test publié). Arbitrages Q-1 à Q-5 de l'orchestrateur : entrée de CLAUDE.md du 10/10/2026 (un RA ne
 * change que sur MESURE L1 ; un RA que TW US seul établit reste un signal ; juniors au poids non cordé ; ids conservés).
 * `changes` : valeur avant/après et faits [numéro, niveau, fragment que la ligne du dossier doit contenir] qui
 * l'établissent. `held` : une autre valeur circule mais n'est PAS établie, le champ ne bouge pas. Une BAISSE de RA
 * exigerait `loweringReview` (mesure exacte, série non suspecte, revue `tsa-measure`) : aucune dans ce lot.
 * NON AFFICHÉ : aucune surface ne lit ce fichier ; le contrôle 14 bis de `audit:ratings` relit le dossier et le vérifie.
 */

export const ALIGNMENT_DOSSIER = 'docs/redaction/veille-2026-10-10-fiches-desynchronisees.md';

export type Fact = readonly [id: string, level: string, has: string];
export type AlignedField = 'variant' | 'stiffness' | 'weight' | 'headSize' | 'stringPattern' | 'balance' | 'gauges' | 'color';
export interface Change { before: string | number; after: string | number; facts: readonly Fact[] }
export interface Held { value: string | number; facts: readonly Fact[]; why: string }
export interface Alignment {
  /** Fragment que le nom (`variant`) doit porter pour désigner l'édition ; absent = nom inchangé. */
  edition?: string;
  changes: Partial<Record<AlignedField, Change>>;
  held: Partial<Record<AlignedField, Held>>;
  loweringReview?: string;
}

export const RACQUET_ALIGNMENT: Readonly<Record<string, Alignment>> = {
  'yonex-ezone-105': {
    changes: { stringPattern: { before: '16x18', after: '16x19', facts: [['V01', 'L0', '16x19'], ['V03', 'L2', '16x19']] } },
    held: { stiffness: { value: 64, facts: [['V04', 'L2', '66']], why: 'RA 66 chez TW US seul (L2), non indépendant de TWE ; Yonex ne publie aucun RA' } },
  },
  'wilson-clash-100-pro-v2': {
    edition: 'V3',
    changes: {
      variant: { before: '100 Pro v2', after: '100 Pro V3', facts: [['V06', 'L0', 'V3'], ['V11', 'L3', 'V3']] },
      weight: { before: 310, after: 305, facts: [['V07', 'L0', '305g']] },
      stringPattern: { before: '16x19', after: '16x20', facts: [['V06', 'L0', '16x20']] },
      stiffness: { before: 55, after: 57, facts: [['V09', 'L1', '57'], ['V10', 'L2', '57']] },
    },
    held: {},
  },
  'tecnifibre-tfight-315s': {
    changes: {
      stringPattern: { before: '18x19', after: '16x19', facts: [['V24', 'L0', '16x19']] },
      stiffness: { before: 64, after: 65, facts: [['V25', 'L1', '65'], ['V26', 'L2', '65']] },
    },
    held: {},
  },
  'yonex-vcore-98-tour': {
    changes: { stringPattern: { before: '18x20', after: '16x19', facts: [['V29', 'L0', '16x19'], ['V31', 'L3', '16x19']] } },
    held: { stiffness: { value: 63, facts: [['V32', 'L2', '64']], why: 'RA 64 chez TW US seul (L2) ; Yonex ne publie aucun RA, aucune page d\'essai TWU' } },
  },
  'babolat-pure-aero-team': {
    edition: '2023',
    changes: { variant: { before: 'Team', after: 'Team (2023)', facts: [['V18', 'L2', '2023'], ['V19', 'L1', '2023']] } },
    held: {
      stiffness: {
        value: 67, facts: [['V20', 'L2', '66'], ['V16', 'L0', '70']],
        why: 'Gen9/2026 : 66 chez TW US seul (L2), non établi ; le 70 ± 3 de Babolat est un RA NON cordé (nature différente), jamais saisi',
      },
    },
  },
  'tecnifibre-tempo-285': {
    edition: 'V2',
    changes: { variant: { before: '285', after: '285 V2', facts: [['V55', 'L0', 'V2'], ['V56', 'L0', 'V2']] } },
    held: { stiffness: { value: 65, facts: [['V59', 'L2', '']], why: 'RA sans source (Tecnifibre n\'en publie pas, TW US ne référence pas le Tempo) : conservé, ni comblé ni retiré (règle 3)' } },
  },
  'wilson-burn-100ls-v5': {
    edition: 'v6',
    changes: { variant: { before: '100LS v5', after: '100LS v6', facts: [['V61', 'L0', '280g'], ['V64', 'L2', 'v6']] } },
    held: {},
  },
  'wilson-us-open-junior-21': {
    changes: {
      headSize: { before: 85, after: 95, facts: [['V73', 'L0', '95in²'], ['V77', 'L2', '95in²']] },
      stringPattern: { before: '16x17', after: '16x18', facts: [['V73', 'L0', '16x18']] },
      weight: { before: 185, after: 171, facts: [['V75', 'L0', '171g']] },
      balance: { before: 285, after: 258, facts: [['V75', 'L0', '25,8']] },
    },
    held: {},
  },
  'wilson-us-open-junior-23': {
    changes: {
      headSize: { before: 90, after: 95, facts: [['V78', 'L0', '95in²']] },
      stringPattern: { before: '16x18', after: '16x19', facts: [['V78', 'L0', '16x19']] },
      weight: { before: 205, after: 185, facts: [['V80', 'L0', '185g']] },
      balance: { before: 295, after: 280, facts: [['V80', 'L0', '28cm']] },
    },
    held: {},
  },
  'wilson-us-open-junior-25': {
    changes: {
      headSize: { before: 98, after: 106, facts: [['V81', 'L0', '106in²']] },
      stringPattern: { before: '16x18', after: '16x19', facts: [['V81', 'L0', '16x19']] },
      weight: { before: 225, after: 205, facts: [['V83', 'L0', '205g']] },
      balance: { before: 310, after: 300, facts: [['V83', 'L0', '30cm']] },
    },
    held: {},
  },
  'wilson-blade-junior-25': {
    edition: 'Comp',
    changes: {
      variant: { before: 'Junior 25"', after: 'Comp Junior 25"', facts: [['V84', 'L0', 'bladefeelcomp'], ['V87', 'L0', 'bladefeelcomp']] },
      headSize: { before: 98, after: 100, facts: [['V84', 'L0', '100in²']] },
      weight: { before: 240, after: 243, facts: [['V85', 'L0', '243g']] },
    },
    held: { balance: { value: 320, facts: [['V85', 'L0', '30,5']], why: 'équilibre non cordé 30,5 sans unité écrite sur la page Wilson : non converti' } },
  },
  // Fiches listées par la veille et NON modifiées (arbitrage de l'orchestrateur du 10/10/2026 : générations ambiguës ou RA en signal).
  'tecnifibre-tf40-305': {
    changes: {},
    held: { stiffness: { value: 63, facts: [['V36', 'L2', '64'], ['V37', 'L2', '64']], why: 'génération (V3 ou « 2024 ») non écrite, RA 64 chez TW US seul ; Tecnifibre ne publie aucun RA' } },
  },
  'head-extreme-standard': {
    changes: {},
    held: { stiffness: { value: 65, facts: [['V40', 'L1', '66'], ['V42', 'L2', '67']], why: 'génération ambiguë (2022, 2024 ou 2026 en vente) et Head L0 inaccessible (429)' } },
  },
  'head-speed-mp': {
    changes: {},
    held: { stiffness: { value: 61, facts: [['V46', 'L1', '60'], ['V47', 'L2', '60']], why: 'génération ambiguë (2024 et 2026 au même RA 60), Head L0 inaccessible ; baisse de RA : revue tsa-measure requise' } },
  },
  'head-instinct-mp': {
    changes: {},
    held: { stiffness: { value: 65, facts: [['V50', 'L1', '64'], ['V51', 'L2', '64']], why: 'génération ambiguë, Head L0 inaccessible, TW US ne vend que la version Demo ; baisse de RA : revue tsa-measure requise' } },
  },
  'wilson-pro-staff-97-v14': {
    changes: {},
    held: { variant: { value: '97 v14', facts: [['V67', 'L0', 'limited-edition'], ['V68', 'L0', 'ausverkauft']], why: 'le modèle standard est « épuisé » (stock du 10/10) chez Wilson DE, non « retiré » ; l\'édition RG 2026 a les mêmes valeurs' } },
  },
  'wilson-clash-100-v2': {
    changes: {},
    held: { stiffness: { value: 57, facts: [['V114', 'L1', '54'], ['V115', 'L2', '54']], why: 'mesure de la V3, autre génération que la fiche « v2 » : génération et autres champs de la V3 non établis' } },
  },
  'wilson-clash-100l-v3': {
    changes: {},
    held: {
      stiffness: { value: 57, facts: [['V116', 'L2', '54']], why: 'RA 54 chez TW US seul (L2)' },
      weight: { value: 295, facts: [['V116', 'L2', '295']], why: '295 g est le poids CORDÉ de la fiche TW US ; poids non cordé non établi' },
    },
  },
};

export const STRING_ALIGNMENT: Readonly<Record<string, Alignment>> = {
  'babolat-rpm-team': {
    changes: {
      gauges: { before: '1.25,1.30,1.35', after: '1.25,1.30', facts: [['V90', 'L0', '1.25et1.30']] },
      color: { before: 'Pink', after: 'Black', facts: [['V91', 'L0', 'noir'], ['V92', 'L0', 'black'], ['V93', 'L2', 'black']] },
    },
    held: {},
  },
  'tecnifibre-tgv': {
    changes: { color: { before: 'Pink', after: 'Black', facts: [['V96', 'L0', 'noir']] } },
    held: {},
  },
  'tecnifibre-multifeel': {
    changes: { gauges: { before: '1.30', after: '1.25,1.30', facts: [['V102', 'L0', '1.25et1.30'], ['V105', 'L2', '1.25']] } },
    held: {},
  },
  'yonex-poly-tour-strike': {
    changes: {},
    held: { gauges: { value: '1.20,1.25,1.30', facts: [['V107', 'L0', 'PTGST130'], ['V109', 'L0', 'PTGST125'], ['V110', 'L0', 'PTGST120']], why: 'la 1.30 existe (épuisée chez Yonex USA au 10/10/2026) : ne pas la retirer' } },
  },
};
