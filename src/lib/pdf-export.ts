/**
 * Export PDF d'une configuration de cordage — fonctionnalité Premium.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  POURQUOI CE FICHIER A ÉTÉ RÉÉCRIT (8 août 2026)
 * ─────────────────────────────────────────────────────────────────────────────
 * La version précédente produisait une page contenant sept lignes de tableau
 * (raquette, cordages, tensions, score RCS, compatibilité) et rien d'autre.
 * Elle n'apportait donc **aucune valeur** par rapport à ce que l'écran affiche
 * déjà gratuitement — alors que l'application calcule, via
 * `lib/advanced-rcs.ts`, une analyse réservée aux abonnés : cinq sous-scores
 * 0-100, un score global, des recommandations personnalisées et des alertes
 * de risque tennis elbow. **Rien de tout cela n'était exporté.**
 *
 * Cette version rend le PDF autoportant :
 *   1. identité de la configuration + verdict global ;
 *   2. specs complètes de la raquette (avec mention explicite des valeurs
 *      estimées, cf. `isRacquetStiffnessEstimated`) ;
 *   3. avis de testeurs (synthèse, /20) pour une raquette évaluée — aucune
 *      note déduite des caractéristiques (décision de Pierre du 10/10/2026) ;
 *   4. détail du cordage (montants / travers, jauges, tensions, notes /10) ;
 *   5. les cinq sous-scores de l'analyse avancée, en barres ;
 *   6. recommandations et alertes, en texte intégral ;
 *   7. rappel méthodologique — pour qu'un lecteur puisse contester un chiffre.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  CHOIX D'ARCHITECTURE (inchangé, il fonctionne)
 * ─────────────────────────────────────────────────────────────────────────────
 * Génération 100 % côté navigateur via jsPDF chargé dynamiquement depuis un
 * CDN au moment du clic : aucun ajout au bundle, aucune charge serveur, PDF
 * produit instantanément.
 *
 * ⚠️ CONTRAINTE D'ENCODAGE conservée de la version précédente : la police
 * Helvetica standard de jsPDF est en Latin-1. Les symboles Unicode (★, •, ≈,
 * — em-dash) déclenchent un encodage 16 bits qui casse l'espacement. Tout le
 * texte émis ici reste donc en Latin-1 ; `latin1()` en fait la garde.
 *
 * Le gating Premium est vérifié par l'appelant (UI) ; ce module est un pur
 * utilitaire de rendu.
 */

const JSPDF_CDN = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';

// Type minimal de l'API jsPDF que nous utilisons (évite une dépendance de types).
interface JsPdfDoc {
  setFont(font: string, style?: string): void;
  setFontSize(size: number): void;
  setTextColor(r: number, g: number, b: number): void;
  setFillColor(r: number, g: number, b: number): void;
  setDrawColor(r: number, g: number, b: number): void;
  text(text: string | string[], x: number, y: number, options?: unknown): void;
  rect(x: number, y: number, w: number, h: number, style?: string): void;
  roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style?: string): void;
  line(x1: number, y1: number, x2: number, y2: number): void;
  splitTextToSize(text: string, maxWidth: number): string[];
  save(filename: string): void;
  setLineWidth(width: number): void;
  addPage(): void;
  getNumberOfPages(): number;
  setPage(n: number): void;
}

interface JsPdfConstructor {
  new (options?: { orientation?: string; unit?: string; format?: string }): JsPdfDoc;
}

declare global {
  interface Window {
    jspdf?: { jsPDF: JsPdfConstructor };
  }
}

let loaderPromise: Promise<JsPdfConstructor> | null = null;

/** Charge jsPDF depuis le CDN une seule fois (mémoïsé). */
function loadJsPdf(): Promise<JsPdfConstructor> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('PDF export indisponible côté serveur.'));
  }
  if (window.jspdf?.jsPDF) {
    return Promise.resolve(window.jspdf.jsPDF);
  }
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<JsPdfConstructor>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = JSPDF_CDN;
    script.async = true;
    script.onload = () => {
      if (window.jspdf?.jsPDF) resolve(window.jspdf.jsPDF);
      else reject(new Error('jsPDF chargé mais introuvable.'));
    };
    script.onerror = () => {
      loaderPromise = null;
      reject(new Error('Échec du chargement de la librairie PDF.'));
    };
    document.head.appendChild(script);
  });
  return loaderPromise;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Données d'entrée
// ─────────────────────────────────────────────────────────────────────────────

/** Notes /10 d'un cordage, telles qu'elles figurent dans la base (absentes = non publiées). */
export interface PdfStringRatings {
  control?: number;
  comfort?: number;
  spin?: number;
  power?: number;
  durability?: number;
}

/** Specs de la raquette. `raEstimated` signale une valeur non constructeur. */
export interface PdfRacquetSpecs {
  label: string;
  brand: string;
  weight: number;
  headSize: number;
  ra: number;
  raEstimated: boolean;
  stringPattern?: string;
  category?: string;
  balance?: number;
  swingWeight?: number;
  playerLevel?: string[];
  /**
   * Avis de testeurs (synthèse), raquettes évaluées seulement : moyenne des 20
   * critères et cinq critères, sur 20, tels quels. Absent = raquette non évaluée :
   * le PDF n'affiche alors que les caractéristiques (aucune note déduite).
   */
  testers?: {
    label: string;
    average20: number;
    /** Moyenne formatée comme partout ailleurs sur le site (`formatScore20`). */
    average20Text: string;
    criteria: Array<{ label: string; value20: number }>;
  };
}

export interface PdfStringDetail {
  label: string;
  type?: string;
  gauge: string;
  tension: number;
  stiffness?: number;
  ratings?: PdfStringRatings;
  /**
   * Nature des notes /10 ci-dessus (« Appréciation éditoriale TSA »…), fournie par
   * `lib/string-rating-nature`. Absente = aucune note publiée. Toute note imprimée porte
   * cette étiquette (principe décidé le 10/10/2026, contrôle 18 de `audit:ratings`).
   */
  ratingsLabel?: string;
  priceEur?: number;
}

/** Analyse avancée — le coeur de la valeur Premium. */
export interface PdfAdvancedAnalysis {
  overall: number | null;
  level: string;
  firmnessIndex: number;
  subScores: {
    power: number | null;
    control: number | null;
    comfort: number | null;
    spin: number | null;
    durability: number | null;
  };
  recommendations: string[];
  warnings: string[];
  summary: string;
}

export interface ConfigurationPdfData {
  name: string;
  racquetLabel: string;
  mainStringLabel: string;
  crossStringLabel: string | null;
  mainGauge: string;
  crossGauge: string;
  mainTension: number;
  crossTension: number;
  rating: number;
  notes: string | null;
  rcsScore: number;
  compatibility: number;
  createdAt: string;

  // ---- Enrichissements Premium (optionnels : un PDF reste produit sans eux) ----
  racquet?: PdfRacquetSpecs;
  mainString?: PdfStringDetail;
  crossString?: PdfStringDetail | null;
  advanced?: PdfAdvancedAnalysis;
  compatibilityAdvice?: string;
  /** Mention imprimée avec les notes du cordage : ce que sont ces notes, ce sur quoi repose le RCS. */
  ratingsNotice?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Palette et helpers de mise en page
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_GREEN: [number, number, number] = [16, 122, 61];
const DARK: [number, number, number] = [31, 41, 55];
const GRAY: [number, number, number] = [107, 114, 128];
const LIGHT: [number, number, number] = [243, 244, 246];
const BAR_BG: [number, number, number] = [226, 232, 240];
const WARN_BG: [number, number, number] = [254, 243, 199];
const WARN_FG: [number, number, number] = [120, 53, 15];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 16;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
/** Limite basse au-delà de laquelle on saute une page (place pour le pied). */
const PAGE_BOTTOM = 274;

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'configuration'
  );
}

/**
 * Réduit une chaîne à du Latin-1 imprimable.
 *
 * Indispensable : la police Helvetica standard de jsPDF ne gère pas l'Unicode
 * étendu. Un « — » ou un « ≈ » suffit à casser l'espacement de toute la ligne.
 * Les accents français (é, à, ç…) sont dans Latin-1 et donc préservés.
 */
function latin1(input: string): string {
  return input
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[\u2022\u25CF\u25AA]/g, '-')
    .replace(/\u2248/g, '~')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u2264]/g, '<=')
    .replace(/[\u2265]/g, '>=')
    .replace(/[^\x20-\xFF\n]/g, '');
}

/** Contexte de rendu : porte le curseur vertical et gère les sauts de page. */
class Layout {
  y = 0;
  constructor(readonly doc: JsPdfDoc) {}

  /** Garantit `needed` mm disponibles, sinon ouvre une nouvelle page. */
  ensure(needed: number): void {
    if (this.y + needed > PAGE_BOTTOM) {
      this.doc.addPage();
      this.y = 22;
    }
  }

  text(
    value: string,
    x: number,
    opts: { size?: number; bold?: boolean; color?: [number, number, number] } = {},
  ): void {
    const { size = 10, bold = false, color = DARK } = opts;
    this.doc.setFont('helvetica', bold ? 'bold' : 'normal');
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);
    this.doc.text(latin1(value), x, this.y);
  }
}

/** Titre de section avec filet vert. */
function sectionTitle(L: Layout, label: string): void {
  L.ensure(16);
  L.y += 4;
  L.doc.setFillColor(...BRAND_GREEN);
  L.doc.rect(MARGIN_X, L.y - 3.4, 2.4, 4.6, 'F');
  L.text(label.toUpperCase(), MARGIN_X + 5, { size: 10.5, bold: true, color: BRAND_GREEN });
  L.y += 6.5;
}

/** Tableau libellé / valeur à lignes alternées. */
function keyValueTable(L: Layout, rows: Array<[string, string]>, labelW = 52): void {
  const rowH = 7.4;
  rows.forEach(([label, value], i) => {
    L.ensure(rowH + 2);
    if (i % 2 === 0) {
      L.doc.setFillColor(...LIGHT);
      L.doc.rect(MARGIN_X, L.y - 4.6, CONTENT_W, rowH, 'F');
    }
    L.text(label, MARGIN_X + 2.5, { size: 9, bold: true });
    const lines = L.doc.splitTextToSize(latin1(value), CONTENT_W - labelW - 5);
    L.text(String(lines[0] ?? ''), MARGIN_X + labelW, { size: 9, color: GRAY });
    L.y += rowH;
    // Lignes de débordement, sans fond alterné pour rester lisible.
    for (let k = 1; k < lines.length; k++) {
      L.ensure(5);
      L.text(String(lines[k]), MARGIN_X + labelW, { size: 9, color: GRAY });
      L.y += 4.6;
    }
  });
}

/**
 * Barre horizontale de score.
 * @param max échelle haute (100 pour les sous-scores, 10 pour les notes).
 */
function scoreBar(
  L: Layout,
  label: string,
  value: number | null | undefined,
  max: number,
  missing = 'non publie',
): void {
  L.ensure(9);
  const barX = MARGIN_X + 46;
  const barW = CONTENT_W - 46 - 20;
  const barH = 3.6;

  L.text(label, MARGIN_X + 2.5, { size: 9 });

  // Valeur absente : aucune barre (une barre à zéro serait une donnée fausse).
  if (value === null || value === undefined) {
    L.text(missing, barX, { size: 8.5, color: GRAY });
    L.y += 7;
    return;
  }

  L.doc.setFillColor(...BAR_BG);
  L.doc.roundedRect(barX, L.y - 2.8, barW, barH, 1, 1, 'F');

  const ratio = Math.max(0, Math.min(1, value / max));
  if (ratio > 0) {
    L.doc.setFillColor(...BRAND_GREEN);
    L.doc.roundedRect(barX, L.y - 2.8, Math.max(1.4, barW * ratio), barH, 1, 1, 'F');
  }

  const shown = max === 10 ? value.toFixed(1) : String(Math.round(value));
  L.text(`${shown}/${max}`, barX + barW + 3, { size: 8.5, color: GRAY });
  L.y += 7;
}

/** Liste à puces (tiret Latin-1), avec retour à la ligne. */
function bulletList(L: Layout, items: string[], color = GRAY): void {
  items.forEach((item) => {
    const lines = L.doc.splitTextToSize(latin1(item), CONTENT_W - 8);
    L.ensure(lines.length * 4.6 + 2);
    lines.forEach((line: string, i: number) => {
      L.text(i === 0 ? `- ${line}` : `  ${line}`, MARGIN_X + 2.5, { size: 9, color });
      L.y += 4.6;
    });
    L.y += 1.4;
  });
}

/** Encart d'alerte sur fond ambre. Fond ET texte fixés ensemble (contraste). */
function warningBox(L: Layout, items: string[]): void {
  items.forEach((item) => {
    const lines = L.doc.splitTextToSize(latin1(item), CONTENT_W - 10);
    const boxH = lines.length * 4.6 + 5;
    L.ensure(boxH + 3);
    L.doc.setFillColor(...WARN_BG);
    L.doc.roundedRect(MARGIN_X, L.y - 4.4, CONTENT_W, boxH, 1.6, 1.6, 'F');
    L.y += 0.6;
    lines.forEach((line: string, i: number) => {
      L.text(i === 0 ? `! ${line}` : `  ${line}`, MARGIN_X + 3.5, {
        size: 9,
        bold: i === 0,
        color: WARN_FG,
      });
      L.y += 4.6;
    });
    L.y += 3;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  Génération
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère et déclenche le téléchargement d'un PDF récapitulatif complet d'une
 * configuration de cordage.
 *
 * Les blocs enrichis (`racquet`, `mainString`, `advanced`) sont optionnels :
 * si l'appelant ne les fournit pas, le document reste valide et se limite aux
 * informations de base — aucune donnée n'est inventée pour combler un trou.
 */
export async function exportConfigurationPdf(data: ConfigurationPdfData): Promise<void> {
  const JsPDF = await loadJsPdf();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const L = new Layout(doc);

  // ---------------------------------------------------------------- En-tête
  doc.setFillColor(...BRAND_GREEN);
  doc.rect(0, 0, PAGE_W, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Tennis String Advisor', MARGIN_X, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(latin1('Fiche technique de configuration - edition Premium'), MARGIN_X, 22);

  // ------------------------------------------------- Identité + date + note
  L.y = 42;
  L.text(data.name, MARGIN_X, { size: 15, bold: true });
  L.y += 6;

  const dateStr = new Date(data.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const ratingStr = data.rating > 0 ? `   -   Votre note : ${data.rating}/5` : '';
  L.text(`Enregistree le ${dateStr}${ratingStr}`, MARGIN_X, { size: 9, color: GRAY });
  L.y += 5;

  doc.setDrawColor(...LIGHT);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, L.y, PAGE_W - MARGIN_X, L.y);
  L.y += 4;

  // ------------------------------------------------------- Verdict global
  if (data.advanced) {
    const a = data.advanced;
    L.ensure(30);
    doc.setFillColor(...LIGHT);
    doc.roundedRect(MARGIN_X, L.y, CONTENT_W, 22, 2, 2, 'F');
    L.y += 8.5;
    L.text(a.overall === null ? 'Score global : non disponible' : `Score global : ${a.overall}/100`, MARGIN_X + 4, {
      size: 13,
      bold: true,
      color: BRAND_GREEN,
    });
    L.text(`Indice de fermete : ${a.firmnessIndex}`, MARGIN_X + 86, { size: 9, color: GRAY });
    L.y += 6;
    const sumLines = doc.splitTextToSize(latin1(a.summary), CONTENT_W - 8);
    L.text(String(sumLines[0] ?? ''), MARGIN_X + 4, { size: 9, color: DARK });
    L.y += 10;
  }

  // ---------------------------------------------------------- La raquette
  if (data.racquet) {
    const r = data.racquet;
    sectionTitle(L, 'Raquette');

    const specs: Array<[string, string]> = [
      ['Modele', r.label],
      ['Poids', `${r.weight} g`],
      ['Tamis', `${r.headSize} in2`],
      [
        'Rigidite (RA)',
        r.raEstimated
          ? `${r.ra} (estime : valeur non publiee par le fabricant)`
          : String(r.ra),
      ],
    ];
    if (r.stringPattern) specs.push(['Plan de cordage', r.stringPattern]);
    if (r.category) specs.push(['Categorie', r.category]);
    if (typeof r.balance === 'number') specs.push(['Equilibre', `${r.balance} mm`]);
    if (typeof r.swingWeight === 'number') specs.push(['Swingweight', String(r.swingWeight)]);
    if (r.playerLevel?.length) specs.push(['Niveaux visees', r.playerLevel.join(', ')]);
    keyValueTable(L, specs);

    if (r.testers) {
      const t = r.testers;
      L.y += 3;
      L.ensure(14);
      L.text(t.label, MARGIN_X + 2.5, { size: 9, bold: true });
      L.y += 4.4;
      L.text(`Moyenne des 20 criteres : ${t.average20Text}/20. Synthese d'avis publies, pas une mesure.`, MARGIN_X + 2.5, {
        size: 7.6,
        color: GRAY,
      });
      L.y += 6.2;
      t.criteria.forEach((c) => scoreBar(L, c.label, c.value20, 20));
    }
  }

  // ---------------------------------------------------------- Le cordage
  sectionTitle(L, 'Cordage et tensions');

  const stringRows: Array<[string, string]> = [];
  const m = data.mainString;
  stringRows.push([
    'Montants',
    m
      ? `${m.label} - ${m.type ?? 'type ND'} - jauge ${m.gauge} mm - ${m.tension} kg`
      : `${data.mainStringLabel} - jauge ${data.mainGauge} mm - ${data.mainTension} kg`,
  ]);

  const c = data.crossString;
  if (data.crossStringLabel || c) {
    stringRows.push([
      'Travers',
      c
        ? `${c.label} - ${c.type ?? 'type ND'} - jauge ${c.gauge} mm - ${c.tension} kg`
        : `${data.crossStringLabel} - jauge ${data.crossGauge} mm - ${data.crossTension} kg`,
    ]);
    stringRows.push(['Montage', 'Hybride (montants et travers differents)']);
  } else {
    stringRows.push(['Travers', `Identique aux montants - ${data.crossTension} kg`]);
    stringRows.push(['Montage', 'Cordage unique']);
  }

  if (m?.stiffness) stringRows.push(['Rigidite montants', `${m.stiffness} lb/in`]);
  if (c?.stiffness) stringRows.push(['Rigidite travers', `${c.stiffness} lb/in`]);
  // Hybride dont le travers n'a pas de prix : aucun total plutôt qu'un total faux.
  if (typeof m?.priceEur === 'number' && (!c || typeof c.priceEur === 'number')) {
    const total = m.priceEur + (typeof c?.priceEur === 'number' ? c.priceEur : 0);
    stringRows.push([
      'Cout indicatif',
      c && typeof c.priceEur === 'number'
        ? `${total.toFixed(2)} EUR (montants ${m.priceEur.toFixed(2)} + travers ${c.priceEur.toFixed(2)})`
        : `${m.priceEur.toFixed(2)} EUR`,
    ]);
  }
  keyValueTable(L, stringRows);

  // Notes du cordage principal.
  if (m?.ratings) {
    L.y += 3;
    // Avec l'étiquette, le bloc (titre, étiquette, mention, cinq barres : ~55 mm) reste d'un seul tenant :
    // sans cela le titre et l'étiquette restaient seuls en bas d'une page, leurs barres sur la suivante.
    L.ensure(m.ratingsLabel ? 58 : 12);
    L.text(`Notes du cordage montants (base TSA)`, MARGIN_X + 2.5, { size: 9, bold: true });
    L.y += 5.6;
    // Nature des notes, avant les barres : appréciation de l'équipe, jamais une mesure.
    if (m.ratingsLabel) {
      L.text(m.ratingsLabel, MARGIN_X + 2.5, { size: 8.4, bold: true, color: DARK });
      L.y += 4.4;
      if (data.ratingsNotice) {
        doc
          .splitTextToSize(latin1(data.ratingsNotice), CONTENT_W - 5)
          .forEach((line: string) => {
            L.text(line, MARGIN_X + 2.5, { size: 7.6, color: GRAY });
            L.y += 3.8;
          });
      }
      L.y += 2.2;
    }
    scoreBar(L, 'Controle', m.ratings.control, 10);
    scoreBar(L, 'Confort', m.ratings.comfort, 10);
    scoreBar(L, 'Effet (spin)', m.ratings.spin, 10);
    scoreBar(L, 'Puissance', m.ratings.power, 10);
    scoreBar(L, 'Durabilite', m.ratings.durability, 10);
  }

  // ------------------------------------------- Analyse avancée (Premium)
  if (data.advanced) {
    const a = data.advanced;
    // Titre, phrase d'intro, étiquettes des notes et cinq barres (~70 mm) d'un seul tenant quand des notes
    // sont étiquetées ; sans étiquette, la pagination d'origine est conservée.
    if (m?.ratingsLabel || c?.ratingsLabel) L.ensure(72);
    sectionTitle(L, 'Analyse avancee du setup');
    L.ensure(10);
    L.text(
      'Sous-scores 0-100 calcules sur la combinaison raquette + cordage + tension.',
      MARGIN_X + 2.5,
      { size: 8.2, color: GRAY },
    );
    L.y += 6;
    // Les sous-scores partent des notes /10 du cordage : on dit de quelle nature elles sont
    // (montants, puis travers pour un hybride), cordage par cordage. Rien si l'analyse n'est
    // pas calculable (note absente) : on n'affirme pas que des notes alimentent un calcul vide.
    if (Object.values(a.subScores).some((v) => v !== null)) {
      const feeding: Array<[string, string | undefined]> = [
        [c ? 'Montants' : 'Cordage', m?.ratingsLabel],
        ['Travers', c?.ratingsLabel],
      ];
      feeding.forEach(([who, label]) => {
        if (!label) return;
        L.ensure(6);
        L.text(`Notes utilisees - ${who} : ${label}`, MARGIN_X + 2.5, { size: 8.2, color: GRAY });
        L.y += 4.6;
      });
      L.y += 1.4;
    }
    scoreBar(L, 'Puissance', a.subScores.power, 100, 'non disponible');
    scoreBar(L, 'Controle', a.subScores.control, 100, 'non disponible');
    scoreBar(L, 'Confort', a.subScores.comfort, 100, 'non disponible');
    scoreBar(L, 'Effet (spin)', a.subScores.spin, 100, 'non disponible');
    scoreBar(L, 'Durabilite', a.subScores.durability, 100, 'non disponible');

    if (a.warnings.length > 0) {
      sectionTitle(L, 'Points de vigilance');
      warningBox(L, a.warnings);
    }

    if (a.recommendations.length > 0) {
      sectionTitle(L, 'Recommandations');
      bulletList(L, a.recommendations);
    }
  }

  // ------------------------------------------------------- Rappel historique
  // Ces deux scores sont ceux ENREGISTRES au moment de la sauvegarde. Ils sont
  // conserves comme reference historique, et explicitement distingues des
  // scores de l'analyse ci-dessus : les formules ont ete recalibrees le
  // 8 aout 2026, une configuration ancienne peut donc afficher un ecart.
  sectionTitle(L, 'Valeurs enregistrees a la sauvegarde');
  keyValueTable(L, [
    ['Score compatibilite', `${data.compatibility.toFixed(0)} %`],
    ['Indice RCS', data.rcsScore.toFixed(1)],
  ]);
  if (data.compatibilityAdvice) {
    L.y += 2;
    bulletList(L, [data.compatibilityAdvice]);
  }

  // -------------------------------------------------------- Vos remarques
  if (data.notes && data.notes.trim()) {
    sectionTitle(L, 'Vos remarques');
    const noteLines = doc.splitTextToSize(latin1(data.notes.trim()), CONTENT_W - 5);
    noteLines.forEach((line: string) => {
      L.ensure(5);
      L.text(line, MARGIN_X + 2.5, { size: 9, color: GRAY });
      L.y += 4.6;
    });
  }

  // ------------------------------------------------------- Méthodologie
  sectionTitle(L, 'Methodologie');
  bulletList(L, [
    "L'indice de fermete combine la rigidite du cadre (RA), celle du cordage (lb/in) et la tension. Plus il est eleve, plus le montage est ferme.",
    'Les sous-scores 0-100 partent des notes du cordage puis sont ajustes par la tension, la jauge, le tamis et le RA du cadre.',
    ...(data.ratingsNotice ? [`Notes /10 du cordage : ${data.ratingsNotice}`] : []),
    "Aucune note de la raquette n'est deduite de ses caracteristiques. Pour une raquette evaluee, l'avis de testeurs est une synthese d'avis publies (moyenne de 20 criteres, sur 20), reproduite telle quelle.",
    'Un RA signale comme estime signifie que le fabricant ne publie pas cette valeur : la mediane de la base est utilisee a la place.',
    'Le confort est pondere plus fortement que les autres criteres dans le score global : la sante du bras est prioritaire.',
  ]);

  // ------------------------------------------------------------ Pied de page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.6);
    doc.setTextColor(...GRAY);
    doc.text(
      latin1('Genere par Tennis String Advisor - tennisstringadvisor.org'),
      MARGIN_X,
      PAGE_H - 8,
    );
    doc.text(`Page ${p}/${pages}`, PAGE_W - MARGIN_X - 14, PAGE_H - 8);
  }

  doc.save(`tsa-${slugify(data.name)}.pdf`);
}
