/**
 * Hybrides prémontés : composition du set et rigidité DÉRIVÉE (23/10/2026, point 9 de l'avis d'Opus 5.5 ; Pierre : « je donne le La,
 * vous exécutez » ; tsa-core).
 *
 * POURQUOI. Une fiche de type « Hybrid » porte UNE rigidité, sans source, alors que le configurateur calcule l'indice d'un hybride monté à
 * la main à partir de ses deux cordages (`setupFirmnessIndex`, le plus haut du 60/40 et du 50/50). Six prémontés sur sept calculables
 * étaient SOUS la valeur de leurs composants (0,2 à 3,6 points d'indice) : le même montage, choisi comme set, sortait moins ferme que
 * choisi cordage par cordage (rapport P du 22/10/2026). La règle 2 permet la hausse vers la valeur des composants ; la règle 3 exige de
 * l'étiqueter comme dérivée.
 *
 * RÈGLE. Composition publiée (page ouverte, règle 4) et deux cordages de la base : rigidité de la fiche = celle que le moteur prête au
 * montage des deux cordages à la même tension, max(0,6 × montants + 0,4 × travers ; moyenne), le plus haut des deux sens si l'ordre
 * n'est pas fixé par la source, arrondie au dixième SUPÉRIEUR (jamais sous la valeur des composants) ; jamais sous la valeur d'avant
 * (une baisse exigerait une mesure, règle 2). Un composant qui BAISSE sur mesure (lot P6 du 26/10/2026) ne fait pas baisser le set en
 * silence : la valeur d'avant est TENUE (`held`, datée et motivée) tant que la baisse du set n'a pas son propre GO. Composition introuvable sur les pages ouvertes : même calcul sur la composition que la
 * fiche annonçait, étiqueté comme tel. Composition non publiée (aucun cordage nommé) : valeur de la fiche conservée, alerte comprise,
 * mention « composition non publiée, rigidité de fiche sans source », exclue des classements (`isStiffnessRankable`).
 *
 * Le contrôle 24 de `audit:ratings` recalcule chaque valeur, la compare au moteur sur une grille et vérifie sources, jauges et mention.
 */

export interface PrepackedSource {
  url: string;
  /** L0 constructeur · L2 revendeur · L3 test publié (niveaux de `docs/redaction/CHARTE.md`). */
  level: 'L0' | 'L2' | 'L3';
  /** Date de lecture (AAAA-MM-JJ). */
  read: string;
  /** Extrait verbatim, 40 mots au plus. */
  excerpt: string;
}

export interface PrepackedHybrid {
  /**
   * `publiee` : les deux cordages sont nommés par une page ouverte ; `fiche` : set introuvable sur les pages ouvertes, composition
   * annoncée par l'ancienne fiche ; `non-publiee` : aucun cordage nommé, rien à calculer.
   */
  composition: 'publiee' | 'fiche' | 'non-publiee';
  /** Les deux cordages du set (ids de la base, jamais un hybride), le premier en montants si `orderFixed`. `null` si non publiée. */
  components: readonly [string, string] | null;
  /** `true` : la source fixe l'ordre ; `false` : au choix ou non publié, le plus haut des deux sens. */
  orderFixed: boolean;
  /** Rigidité de la fiche avant le 23/10/2026 (sans source). */
  before: number;
  /** Jauges du set lues sur les sources (format de `gauges`) ; absent : jauges de la fiche non vérifiées. */
  gauges?: readonly string[];
  sources: readonly PrepackedSource[];
  note: string;
  /**
   * Valeur TENUE au-dessus de la valeur dérivée (règle 2) : un composant a baissé sur mesure, la valeur dérivée retirerait des alertes et
   * la baisse du set attend le GO explicite de Pierre. Absent sinon ; le contrôle 24 refuse une tenue inutile, sans date ou sans motif.
   */
  held?: {
    value: number; date: string; why: string;
    /** Le composant abaissé sur mesure : sa valeur d'avant (celle qui donnait `value`) et sa valeur mesurée d'aujourd'hui. */
    lowered: { id: string; before: number; after: number };
    /** Valeur dérivée d'aujourd'hui, NON appliquée (le contrôle 24 la recalcule). */
    derived: number;
  };
}

export const PREPACKED_HYBRIDS: Readonly<Record<string, PrepackedHybrid>> = {
  'babolat-hybrid-rpm-blast-vs-touch': {
    composition: 'publiee', components: ['babolat-rpm-blast', 'babolat-touch-vs'], orderFixed: false, before: 168, gauges: ['1.25/1.30'],
    sources: [{
      url: 'https://www.babolat.com/us/rpm-blast-125-touch-vs-130/281037.html', level: 'L0', read: '2026-10-23',
      excerpt: 'RPM Blast 125 + Touch VS 130 … Gauge 125/130 … we recommend disposing it in crosses. However, you can decide also to use it in mains',
    }],
    note: 'Babolat recommande le Touch VS en travers et l\'autorise en montants : ordre au choix. Seule jauge vendue : 125/130 (la fiche portait aussi 1.30/1.30).',
  },
  'wilson-duo-power': {
    composition: 'publiee', components: ['luxilon-alu-power', 'wilson-nxt-power'], orderFixed: false, before: 175, gauges: ['1.25/1.30'],
    sources: [
      {
        url: 'https://www.tennis-warehouse.com/Wilson_Duo_Power_ALU_Power_125__NXT_Power_16_String/descpageACWILSON-DUOPALUNXT.html', level: 'L2', read: '2026-10-23',
        excerpt: 'To emphasize control, spin and durability, put ALU Power in the mains. To emphasize comfort, feel and power, put Wilson NXT Power in the mains. Gauge : Luxilon ALU Power - 1.25mm / Wilson NXT Power - 1.30mm',
      },
      {
        url: 'https://shop.gamesetmatchinc.com/duo-power-alu-pwr-16l-nxt-pwr-16.html', level: 'L2', read: '2026-10-23',
        excerpt: 'Either string can be installed in the mains for superior power and performance. Gauge17/16mm 1.25/1.30',
      },
    ],
    note: 'Deux revendeurs indépendants (Tennis Warehouse, Game-Set-Match) : ALU Power 1.25 et NXT Power 1.30, ordre au choix. wilson.com non lu (Web Bot Auth).',
  },
  'wilson-duo-control': {
    composition: 'publiee', components: ['luxilon-4g-rough', 'wilson-nxt-control'], orderFixed: false, before: 188,
    sources: [{
      url: 'https://www.tennis-warehouse.com/Wilson_Duo_Control_4GR_125__NXT_Control_16_String/descpageACWILSON-DUOC4GNXT.html', level: 'L2', read: '2026-10-23',
      excerpt: 'This set-up includes Luxilon 4G Rough 1.25 … The other string is NXT Control 16 … put 4G Rough in the mains … put NXT Control in the mains',
    }],
    note: 'La fiche annonçait Luxilon Element + Wilson NXT : c\'est la composition du Duo Feel (« Wilson Duo Feel Element 1.25 & NXT 16 », même revendeur). Ordre au choix. wilson.com non lu (Web Bot Auth).',
    held: {
      value: 222, date: '2026-10-26', lowered: { id: 'luxilon-4g-rough', before: 262, after: 216 }, derived: 194.4,
      why: 'Valeur dérivée du 23/10/2026 (4G Rough 262, sans source ; NXT Control 162). Le lot P6 du 26/10/2026 abaisse le 4G Rough à sa mesure TWU (216) : la valeur dérivée devient 194,4 et retirerait des alertes ; le GO de Pierre couvre les 13 cordages du lot, pas ce set. Tenue à 222 jusqu\'à un GO explicite (règle 2).',
    },
  },
  'wilson-champions-choice': {
    composition: 'publiee', components: ['wilson-natural-gut', 'luxilon-alu-power-rough'], orderFixed: false, before: 165,
    sources: [{
      url: 'https://www.tennis-warehouse.com/Wilson_Champions_Choice_Hybrid_16_String/descpageACWILSON-WCC16.html', level: 'L2', read: '2026-10-23',
      excerpt: 'For durability and control, use the Luxilon ALU Power Rough in the mains. For a softer feel and playability, use the Wilson Natural Gut in the mains.',
    }],
    note: 'Boyau Wilson 16 et ALU Power Rough 16L ; le revendeur donne les deux ordres : le plus haut des deux sens.',
  },
  'wilson-champions-choice-duo': {
    composition: 'publiee', components: ['wilson-natural-gut', 'luxilon-alu-power-rough'], orderFixed: false, before: 158,
    sources: [{
      url: 'https://tenniscompanion.org/wilson-champions-choice-duo/', level: 'L3', read: '2026-10-23',
      excerpt: 'Wilson Champion’s Choice Duo combines Wilson’s premium natural gut with Luxilon ALU Power Rough … Stringing Luxilon ALU Power Rough in the mains and Wilson Natural Gut in the crosses',
    }],
    note: 'La fiche annonçait Luxilon Element + boyau : le Champion\'s Choice Duo associe le boyau Wilson et l\'ALU Power Rough, la composition de la fiche wilson-champions-choice (doublon probable, fusion à arbitrer). wilson.com et TWE non lus (Web Bot Auth, 406).',
  },
  'babolat-hybrid-rpm-blast-xcel': {
    composition: 'fiche', components: ['babolat-rpm-blast', 'babolat-xcel'], orderFixed: false, before: 192,
    sources: [],
    note: 'Set introuvable : la liste des hybrides de babolat.com (US, lue le 23/10/2026) ne compte que RPM Blast 125 + Touch VS 130 ; l\'hybride Xcel de Babolat associait le RPM Power (page « RPM Power 125 + Xcel 130 » retirée, redirigée vers les cordages). Calcul sur la composition de la fiche ; retrait à arbitrer.',
  },
  'tecnifibre-hybrid-razor-code-x-one': {
    composition: 'fiche', components: ['tecnifibre-razor-code', 'tecnifibre-x-one-biphase'], orderFixed: false, before: 180,
    sources: [],
    note: 'Set introuvable sur les pages ouvertes (tecnifibre.com refuse les robots non signés, aucun set de ce nom chez Tennis Warehouse US). Calcul sur la composition de la fiche, les deux sens.',
  },
  'tecnifibre-hybrid-ice-code-nrg2': {
    composition: 'fiche', components: ['tecnifibre-ice-code', 'tecnifibre-nrg2'], orderFixed: false, before: 172,
    sources: [],
    note: 'Set introuvable sur les pages ouvertes (tecnifibre.com refuse les robots non signés, aucun set de ce nom chez Tennis Warehouse US). Calcul sur la composition de la fiche, les deux sens.',
  },
  'head-gravity-hybrid': {
    composition: 'non-publiee', components: null, orderFixed: false, before: 178,
    sources: [{
      url: 'https://www.tennis-warehouse.com/learning_center/string_reviews/HGRAVreview.html', level: 'L3', read: '2026-10-23',
      excerpt: 'Head Gravity is a hybrid tennis string featuring an unlikely combination of two co-polyester monofilaments.',
    }],
    note: 'Deux co-polyesters propres au set, ni l\'un ni l\'autre vendu seul sous un nom de la base (la fiche disait « poly + multi ») ; head.com refuse les robots (429). Rien à calculer : valeur de la fiche conservée, alerte comprise.',
  },
};

/** Rigidité effective que le moteur prête à deux cordages montés à la même tension (`setupFirmnessIndex`) : max(60/40, moyenne). */
function engineStiffness(mains: number, crosses: number): number {
  return Math.max(mains * 0.6 + crosses * 0.4, (mains + crosses) / 2);
}

/** Rigidité dérivée d'un set : le plus haut des deux sens si l'ordre n'est pas fixé, arrondie au dixième supérieur. */
export function prepackedHybridStiffness(first: number, second: number, orderFixed: boolean): number {
  const v = orderFixed ? engineStiffness(first, second) : Math.max(engineStiffness(first, second), engineStiffness(second, first));
  return Math.ceil(v * 10 - 1e-9) / 10;
}

/** Une rigidité de set entre dans un classement ou une liste comparative seulement si sa composition est publiée. */
export function isStiffnessRankable(s: { id: string; type: string }): boolean {
  return s.type !== 'Hybrid' || PREPACKED_HYBRIDS[s.id]?.composition === 'publiee';
}

/** Mention affichée sous la rigidité d'un hybride prémonté (règle 3) ; `null` pour toute autre fiche. */
export function prepackedHybridNotice(id: string, names: (id: string) => string): string | null {
  const h = PREPACKED_HYBRIDS[id];
  if (!h) return null;
  if (!h.components) return 'Composition non publiée, rigidité de fiche sans source : valeur conservée pour le calcul et l\'alerte, hors classements.';
  const pair = `${names(h.components[0])} et ${names(h.components[1])}`;
  const order = h.orderFixed ? '' : ', le plus haut des deux sens de montage';
  if (h.held) {
    const fr = (v: number) => String(v).replace('.', ',');
    const { lowered, derived, value } = h.held;
    return `Rigidité tenue à ${fr(value)} lb/in : valeur dérivée des deux cordages du set, ${pair}${order}, calculée avec ${names(lowered.id)} à ${fr(lowered.before)} lb/in (valeur de fiche sans source). ` +
      `Mesuré depuis par TWU à ${fr(lowered.after)} lb/in, ce cordage donne au set une valeur dérivée de ${fr(derived)} lb/in, plus basse, qui n'est pas appliquée tant que cette baisse n'est pas validée. Aucune mesure du set n'est publiée.`;
  }
  if (h.composition === 'fiche') return `Rigidité dérivée de ${pair}, la composition annoncée par cette fiche (set introuvable sur les pages ouvertes), comme le configurateur calcule un hybride${order} ; aucune mesure du set.`;
  return `Rigidité dérivée des deux cordages du set, ${pair}, comme le configurateur calcule un hybride${order} ; aucune mesure du set n'est publiée.`;
}
