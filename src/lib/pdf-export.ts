/**
 * Export PDF d'une configuration de cordage — fonctionnalité Premium.
 *
 * Choix d'architecture : génération 100 % côté navigateur via jsPDF chargé
 * dynamiquement depuis un CDN au moment du clic. Avantages :
 *   - aucun ajout au bundle de l'application (jsPDF ne pèse rien tant qu'on
 *     n'exporte pas) ;
 *   - aucune charge serveur ni dépendance incompatible avec l'edge Netlify ;
 *   - le PDF est produit instantanément, hors ligne possible une fois la
 *     librairie en cache.
 *
 * Le gating Premium est vérifié par l'appelant (UI) ; cette fonction est un
 * pur utilitaire de rendu.
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
  line(x1: number, y1: number, x2: number, y2: number): void;
  splitTextToSize(text: string, maxWidth: number): string[];
  save(filename: string): void;
  setLineWidth(width: number): void;
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
}

const BRAND_GREEN: [number, number, number] = [16, 122, 61];
const DARK: [number, number, number] = [31, 41, 55];
const GRAY: [number, number, number] = [107, 114, 128];
const LIGHT: [number, number, number] = [243, 244, 246];

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
 * Génère et déclenche le téléchargement d'un PDF récapitulatif d'une
 * configuration de cordage.
 */
export async function exportConfigurationPdf(data: ConfigurationPdfData): Promise<void> {
  const JsPDF = await loadJsPdf();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = 210;
  const marginX = 18;
  const contentW = pageW - marginX * 2;

  // En-tête de marque.
  doc.setFillColor(...BRAND_GREEN);
  doc.rect(0, 0, pageW, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Tennis String Advisor', marginX, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Fiche de configuration de cordage', marginX, 24);

  // Titre de la configuration.
  let y = 46;
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(data.name, marginX, y);

  // Date + note.
  // NB : on n'utilise QUE des caractères Latin1 ici. Les symboles Unicode
  // (étoiles ★, puce •) ne sont pas supportés par la police standard Helvetica
  // de jsPDF et déclenchent un encodage 16-bit qui casse l'espacement. On
  // exprime donc la note en texte ASCII (« Note : 4/5 »).
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  const dateStr = new Date(data.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const rating = data.rating > 0 ? `   -   Note : ${data.rating}/5` : '';
  doc.text(`Enregistrée le ${dateStr}${rating}`, marginX, y);

  // Ligne de séparation.
  y += 6;
  doc.setDrawColor(...LIGHT);
  doc.setLineWidth(0.5);
  doc.line(marginX, y, pageW - marginX, y);

  // Tableau de détails (libellé / valeur).
  const rows: Array<[string, string]> = [
    ['Raquette', data.racquetLabel],
    ['Cordage principal', `${data.mainStringLabel}  (${data.mainGauge} mm)`],
    [
      'Cordage travers',
      data.crossStringLabel
        ? `${data.crossStringLabel}  (${data.crossGauge} mm)`
        : 'Identique au principal',
    ],
    ['Tension principale', `${data.mainTension} kg`],
    ['Tension travers', `${data.crossTension} kg`],
    ['Score RCS', data.rcsScore.toFixed(1)],
    ['Compatibilité', `${data.compatibility.toFixed(0)} %`],
  ];

  y += 8;
  const rowH = 11;
  doc.setFontSize(11);
  rows.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(...LIGHT);
      doc.rect(marginX, y - 7, contentW, rowH, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text(label, marginX + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    const valueLines = doc.splitTextToSize(value, contentW - 70);
    doc.text(valueLines, marginX + 70, y);
    y += rowH;
  });

  // Notes éventuelles.
  if (data.notes && data.notes.trim()) {
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text('Notes', marginX, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...GRAY);
    const noteLines = doc.splitTextToSize(data.notes.trim(), contentW);
    doc.text(noteLines, marginX, y);
    y += noteLines.length * 5;
  }

  // Pied de page.
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(
    'Généré par Tennis String Advisor — tennisstringadvisor.org',
    marginX,
    287,
  );

  doc.save(`tsa-${slugify(data.name)}.pdf`);
}
