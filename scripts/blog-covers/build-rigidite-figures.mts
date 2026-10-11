/**
 * Graphiques de rigidité des articles « tennis elbow » (FR + EN) — tirés de la base.
 *
 * POURQUOI. Les quatre articles santé qui reposent sur la rigidité des cordages
 * (polyester et tennis elbow ; cordage et tennis elbow, FR et EN) n'avaient aucun
 * visuel dans le corps (charte §4). Les deux graphiques ci-dessous les dotent d'un
 * VRAI visuel dont chaque valeur est lue dans `src/data/` — jamais saisie :
 *
 *   1. « polyesters » : un point par polyester, placé à la rigidité de sa fiche ;
 *      zones à 200 et 240 lb/in (celles des sections 2 et 3 de l'article) ; seuils
 *      d'alerte du configurateur situés, pour le montage d'exemple de l'article
 *      (raquette de RA 65, 22 kg), à la rigidité où l'indice les atteint ; médiane.
 *   2. « familles » : minimum, médiane et maximum de chaque famille de cordage,
 *      avec, au-dessus, l'indice RCS du même montage d'exemple.
 *
 * D'OÙ VIENNENT LES CHIFFRES (aucun n'est saisi à la main) :
 *   - rigidités, familles, effectifs : `stringsDatabase` (src/data/strings-database.ts) ;
 *   - indice RCS : `calculateRCS`, la fonction du site ; seuils des 5 paliers publiés :
 *     `getStringRecommendation` (sondée de 0 à 60) ; seuils d'alerte bras : lus dans le
 *     texte de src/lib/advanced-rcs.ts (le script ÉCHOUE si le code a changé de forme :
 *     F7, « relus au moment d'écrire ») ;
 *   - fiches « alignées sur une mesure TWU » (points cerclés du graphique 1, nombre EXACT dans les
 *     légendes : C-4 du fact-check, jamais « les mesures TWU » en bloc) : statut `appliquee` de
 *     src/data/string-stiffness-provenance.ts, ou commentaire « Rigidité : TWU « … » » de la base pour
 *     les fiches Toroline antérieures à ce fichier — même définition que le † des tableaux ;
 *   - seule décision éditoriale posée ici : les zones « ≤ 200 » et « ≥ 240 lb/in » et le
 *     montage d'exemple (RA 65, 22 kg), ceux des tableaux de l'article. Les axes (160-290 et 80-300 lb/in)
 *     sont fixés ici : le script ÉCHOUE si une rigidité en sort (le Luxilon 4G est à 286,9 depuis le lot 3).
 *
 * SORTIE. Un bloc `<figure class="tsa-fig">` (SVG en ligne, classe `tsa-schema`, variables
 * `--tsa-*` de public/blog/blog-figures.css : thème clair et sombre) inséré ENTRE deux
 * repères HTML de chaque article :
 *     <!-- figure-rigidite:polyesters:debut … --> … <!-- figure-rigidite:polyesters:fin -->
 * (`polyesters` ou `familles`). Les repères sont posés une fois à la main ; le script
 * remplit tout ce qu'ils encadrent — le bloc n'est jamais retouché à la main.
 *
 * ON LE RELANCE QUAND LA BASE CHANGE (nouvelle rigidité, règle D de rigidité par jauge,
 * lot 3, fusion de doublons…) :
 *   npx --yes tsx scripts/blog-covers/build-rigidite-figures.mts            écrit les 4 blocs
 *   npx --yes tsx scripts/blog-covers/build-rigidite-figures.mts --check    exit 1 si un bloc
 *                                    diffère de la base OU si un chiffre du texte (nombre de
 *                                    polyesters, médiane, zones…) ne colle plus à la base
 *   npx --yes tsx scripts/blog-covers/build-rigidite-figures.mts --facts    les chiffres dérivés
 *   npx --yes tsx scripts/blog-covers/build-rigidite-figures.mts --preview <dossier>
 *                                    pages d'essai clair/sombre (hors dépôt), pour regarder
 *
 * Après un changement de la base, relire AUSSI les phrases des articles qui citent ces
 * chiffres : `--check` en vérifie une liste (voir EXPECTED), pas toutes.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { stringsDatabase, calculateRCS, getStringRecommendation, type TennisString } from '../../src/data/strings-database';
import { STRING_STIFFNESS_PROVENANCE } from '../../src/data/string-stiffness-provenance';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
type Lang = 'fr' | 'en';

// ---------------------------------------------------------------------------------------------
// Décisions éditoriales de l'article (pas des données de la base)
// ---------------------------------------------------------------------------------------------
const EXAMPLE = { ra: 65, kg: 22 }; // montage d'exemple des tableaux : raquette de RA 65, 22 kg
const ZONE_SOFT_MAX = 200; // « les plus souples » : 200 lb/in ou moins (section 2)
const ZONE_FIRM_MIN = 240; // « les plus fermes » : 240 lb/in ou plus (section 3)
const AS_OF = { fr: '10 octobre 2026', en: 'October 10, 2026' }; // date de relevé affichée (F11) : à mettre à jour avec la base

const NB = '&nbsp;';
const TARGETS = [
  { kind: 'polyesters', lang: 'fr', file: 'public/blog/cordage-polyester-tennis-elbow.html' },
  { kind: 'polyesters', lang: 'en', file: 'public/en/blog/polyester-strings-tennis-elbow.html' },
  { kind: 'familles', lang: 'fr', file: 'public/blog/cordage-tennis-elbow.html' },
  { kind: 'familles', lang: 'en', file: 'public/en/blog/best-tennis-strings-for-tennis-elbow.html' },
] as const;

// ---------------------------------------------------------------------------------------------
// Faits dérivés de la base
// ---------------------------------------------------------------------------------------------
const label = (s: TennisString) => `${s.brand} ${s.model}`;
const byStiffnessThenName = (a: TennisString, b: TennisString) => a.stiffness - b.stiffness || label(a).localeCompare(label(b));
const median = (v: number[]) => {
  const b = [...v].sort((x, y) => x - y);
  const n = b.length;
  return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2;
};
const r1 = (v: number) => Math.round(v * 10) / 10;
const rcsOf = (s: TennisString) => calculateRCS(EXAMPLE.ra, s.stiffness, EXAMPLE.kg);

/**
 * Rigidité de la fiche ALIGNÉE sur une mesure du laboratoire TWU (règle de jauge C : mesure de la jauge la plus rigide
 * mesurée parmi les jauges de la fiche) : provenance `appliquee` dans src/data/string-stiffness-provenance.ts, ou, pour
 * les 8 fiches Toroline antérieures à ce fichier, commentaire « Rigidité : TWU « <modèle> <calibre> … » » de la base.
 * C'est la même définition que le marqueur † des tableaux des articles. Toute autre rigidité est celle de la fiche, pas
 * une mesure TWU : la légende des graphiques le dit (C-4 du fact-check) et donne ce nombre, jamais « les mesures TWU » en bloc.
 */
const DB_SOURCE = readFileSync(join(ROOT, 'src/data/strings-database.ts'), 'utf8').replace(/\r\n/g, '\n');
const reEscape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const alignedOnTwu = (s: TennisString): boolean =>
  STRING_STIFFNESS_PROVENANCE[s.id]?.status === 'appliquee' ||
  new RegExp(`Rigidité : TWU « ${reEscape(label(s))} \\d`, 'i').test(DB_SOURCE);

/** Seuils d'alerte bras du configurateur, lus dans le code (échec bruyant si la forme change). */
function armAlertThresholds(): { sensitive: number; standard: number } {
  const src = readFileSync(join(ROOT, 'src/lib/advanced-rcs.ts'), 'utf8');
  const m = src.match(/armSensitive\s*\?\s*rcs\s*>=\s*(\d+)[^:]*:\s*rcs\s*>=\s*(\d+)/);
  if (!m) throw new Error("seuils d'alerte bras introuvables dans src/lib/advanced-rcs.ts : le code a changé, relire la charte F7 et ce script");
  return { sensitive: Number(m[1]), standard: Number(m[2]) };
}

/** Bornes des 5 paliers publiés de l'indice RCS, par sondage de `getStringRecommendation`. */
function rcsBandEdges(): number[] {
  const edges: number[] = [];
  let prev = getStringRecommendation(0).level;
  for (let r = 1; r <= 60; r++) {
    const level = getStringRecommendation(r).level;
    if (level !== prev) edges.push(r);
    prev = level;
  }
  if (edges.length !== 4) throw new Error(`5 paliers RCS attendus, ${edges.length + 1} trouvés`);
  return edges;
}

/** Plus petite rigidité (pas de 0,01 lb/in) pour laquelle le montage d'exemple atteint l'indice `target`. */
function stiffnessReaching(target: number): number {
  for (let i = 8000; i <= 40000; i++) {
    const s = i / 100;
    if (calculateRCS(EXAMPLE.ra, s, EXAMPLE.kg) >= target) return s;
  }
  throw new Error(`indice ${target} inatteignable`);
}

// frOne/frMany, enOne/enMany : nom de la famille au singulier / pluriel, pour dénombrer les fiches alignées sur TWU dans la légende
const FAMILY_ORDER: { type: TennisString['type']; fr: string; en: string; frCount: string; enCount: string; frOne: string; frMany: string; enOne: string; enMany: string }[] = [
  { type: 'Natural Gut', fr: 'Boyau naturel', en: 'Natural gut', frCount: 'fiches', enCount: 'strings', frOne: 'boyau', frMany: 'boyaux', enOne: 'natural gut', enMany: 'natural guts' },
  { type: 'Multifilament', fr: 'Multifilament', en: 'Multifilament', frCount: 'fiches', enCount: 'strings', frOne: 'multifilament', frMany: 'multifilaments', enOne: 'multifilament', enMany: 'multifilaments' },
  { type: 'Hybrid', fr: 'Hybride', en: 'Hybrid', frCount: 'sets prémontés', enCount: 'pre-packed sets', frOne: 'set prémonté', frMany: 'sets prémontés', enOne: 'pre-packed set', enMany: 'pre-packed sets' },
  { type: 'Synthetic', fr: 'Synthétique', en: 'Synthetic gut', frCount: 'fiches', enCount: 'strings', frOne: 'synthétique', frMany: 'synthétiques', enOne: 'synthetic gut', enMany: 'synthetic guts' },
  { type: 'Polyester', fr: 'Polyester', en: 'Polyester', frCount: 'fiches', enCount: 'strings', frOne: 'polyester', frMany: 'polyesters', enOne: 'polyester', enMany: 'polyesters' },
];

export function computeFacts() {
  const all = stringsDatabase as TennisString[];
  const polys = all.filter((s) => s.type === 'Polyester').sort(byStiffnessThenName);
  const stiff = polys.map((s) => s.stiffness);
  const alert = armAlertThresholds();
  const edges = rcsBandEdges();
  const thrSens = stiffnessReaching(alert.sensitive);
  const thrStd = stiffnessReaching(alert.standard);
  const soft = polys.filter((s) => s.stiffness <= ZONE_SOFT_MAX);
  const firm = polys.filter((s) => s.stiffness >= ZONE_FIRM_MIN);
  const families = FAMILY_ORDER.map((f) => {
    const v = all.filter((s) => s.type === f.type).map((s) => s.stiffness);
    if (v.length === 0) throw new Error(`famille vide : ${f.type}`);
    const nAligned = all.filter((s) => s.type === f.type && alignedOnTwu(s)).length;
    return { ...f, n: v.length, min: Math.min(...v), med: r1(median(v)), max: Math.max(...v), nAligned };
  }).sort((a, b) => a.med - b.med);
  const known = families.reduce((t, f) => t + f.n, 0);
  if (known !== all.length) throw new Error(`${all.length - known} cordage(s) hors des 5 familles : ajouter la famille au script`);
  // chiffres cités dans le texte des articles (voir expectations) : trois plus souples, plus rigide, écart entre le plus souple et le plus rigide
  const softest = polys[0], stiffest = polys[polys.length - 1];
  const soft3Rcs = polys.slice(0, 3).map(rcsOf);
  const gaps = [60, 65, 70].map((ra) => calculateRCS(ra, stiffest.stiffness, EXAMPLE.kg) - calculateRCS(ra, softest.stiffness, EXAMPLE.kg));
  return {
    topLabel: label(stiffest),
    topRcs: rcsOf(stiffest),
    soft3Rcs: [Math.min(...soft3Rcs), Math.max(...soft3Rcs)] as [number, number],
    gap: { min: Math.min(...gaps), max: Math.max(...gaps) },
    total: all.length,
    polys,
    nPolys: polys.length,
    min: Math.min(...stiff),
    max: Math.max(...stiff),
    median: r1(median(stiff)),
    nSoft: soft.length,
    nFirm: firm.length,
    nMid: polys.length - soft.length - firm.length,
    alert,
    edges,
    thrSens: r1(thrSens),
    thrStd: r1(thrStd),
    nSens: polys.filter((s) => rcsOf(s) >= alert.sensitive).length,
    nStd: polys.filter((s) => rcsOf(s) >= alert.standard).length,
    nAlignedPolys: polys.filter(alignedOnTwu).length,
    nAlignedAll: all.filter(alignedOnTwu).length,
    families,
    example: { ...EXAMPLE },
  };
}
type Facts = ReturnType<typeof computeFacts>;

// ---------------------------------------------------------------------------------------------
// Outils de dessin
// ---------------------------------------------------------------------------------------------
const f1 = (v: number) => (Math.round(v * 10) / 10).toString();
const num = (v: number, lang: Lang) => (lang === 'fr' ? r1(v).toString().replace('.', ',') : r1(v).toString());
const esc = (t: string) => t.replace(/&(?!nbsp;|#\d+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const STYLE = {
  grid: 'stroke:var(--tsa-grid);stroke-width:1;fill:none',
  muted: 'fill:var(--tsa-muted)',
};
const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

type Dot = { x: number; h: number; s: TennisString };

/** Nuage de points (un point par fiche) : x exact, empilement vertical sans recouvrement. */
function swarm(items: { x: number; s: TennisString }[], r: number, gap: number): Dot[] {
  const D = 2 * r + gap;
  const placed: Dot[] = [];
  for (const it of items) {
    const candidates = [r];
    for (const p of placed) {
      const dx = Math.abs(p.x - it.x);
      if (dx < D) candidates.push(p.h + Math.sqrt(D * D - dx * dx));
    }
    candidates.sort((a, b) => a - b);
    const h = candidates.find((c) => placed.every((p) => Math.hypot(p.x - it.x, p.h - c) >= D - 1e-9));
    if (h === undefined) throw new Error('empilement impossible');
    placed.push({ x: it.x, h, s: it.s });
  }
  return placed;
}

// ---------------------------------------------------------------------------------------------
// Graphique 1 : répartition de la rigidité des polyesters
// ---------------------------------------------------------------------------------------------
function polyestersFigure(fa: Facts, lang: Lang): string {
  const W = 640;
  const X0 = 44, X1 = 616, D0 = 160, D1 = 290; // axe 160-290 : le polyester le plus rigide (Luxilon 4G) est à 286,9 lb/in depuis le lot 3
  const kx = (X1 - X0) / (D1 - D0);
  const X = (v: number) => X0 + (v - D0) * kx;
  const Y_AXIS = 222;
  const R = 4.4;
  const H = Y_AXIS + 218; // 5 lignes de légende (descendantes comprises)
  const T = (fr: string, en: string) => (lang === 'fr' ? fr : en);
  const id = `fig-rigidite-polyesters-${lang}`;
  const [aSens, aStd] = [fa.alert.sensitive, fa.alert.standard];

  if (fa.min < D0 || fa.max > D1) throw new Error(`rigidité hors de l'axe ${D0}-${D1} : ${fa.min}-${fa.max}`);

  const dots = swarm(fa.polys.map((s) => ({ x: X(s.stiffness), s })), R, 0.9);
  const top = Math.min(...dots.map((d) => Y_AXIS - 1.5 - d.h)) - R;
  if (top < 112) throw new Error(`pile de points trop haute (${top}) : revoir la géométrie`);

  const title = T(
    `Répartition de la rigidité des ${fa.nPolys} polyesters du catalogue, de ${num(fa.min, 'fr')} à ${num(fa.max, 'fr')} lb/in, médiane ${num(fa.median, 'fr')} : ${fa.nSoft} à ${ZONE_SOFT_MAX} lb/in ou moins, ${fa.nFirm} à ${ZONE_FIRM_MIN} lb/in ou plus. Dans le montage d'exemple (raquette de RA ${fa.example.ra}, ${fa.example.kg} kg), l'indice atteint ${aSens} à partir d'environ ${Math.round(fa.thrSens)} lb/in (${fa.nSens} polyesters) et ${aStd} à partir d'environ ${Math.round(fa.thrStd)} lb/in (${fa.nStd} polyesters). ${fa.nAlignedPolys} polyesters, représentés par un point cerclé, ont une rigidité alignée sur une mesure du laboratoire TWU ; pour les autres, c'est la valeur de la fiche.`,
    `Distribution of the stiffness of the ${fa.nPolys} polyesters in the catalogue, from ${num(fa.min, 'en')} to ${num(fa.max, 'en')} lb/in, median ${num(fa.median, 'en')}: ${fa.nSoft} at ${ZONE_SOFT_MAX} lb/in or less, ${fa.nFirm} at ${ZONE_FIRM_MIN} lb/in or more. In the example setup (racquet with an RA of ${fa.example.ra}, ${fa.example.kg} kg), the index reaches ${aSens} from about ${Math.round(fa.thrSens)} lb/in (${fa.nSens} polyesters) and ${aStd} from about ${Math.round(fa.thrStd)} lb/in (${fa.nStd} polyesters). ${fa.nAlignedPolys} polyesters, drawn as outlined dots, have a stiffness aligned on a measurement by the TWU lab; for the others, it is the value on the product page.`,
  );

  const o: string[] = [];
  o.push(`<svg class="tsa-schema" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${id}"><title id="${id}">${esc(title)}</title>`);
  o.push(`<g font-family="${FONT}">`);

  // Bandes d'alerte du montage d'exemple (derrière les points)
  const yBand = 98;
  o.push(`<rect x="${f1(X(fa.thrSens))}" y="${yBand}" width="${f1(X(fa.thrStd) - X(fa.thrSens))}" height="${Y_AXIS - yBand}" style="fill:var(--tsa-a2-soft)"/>`);
  o.push(`<rect x="${f1(X(fa.thrStd))}" y="${yBand}" width="${f1(X1 - X(fa.thrStd))}" height="${Y_AXIS - yBand}" style="fill:var(--tsa-a4-soft)"/>`);

  // Axe, graduations
  o.push(`<line x1="${X0}" y1="${Y_AXIS}" x2="${X1}" y2="${Y_AXIS}" style="stroke:var(--tsa-muted);stroke-width:1.5;fill:none"/>`);
  for (let v = 160; v <= 280; v += 20) {
    o.push(`<line x1="${f1(X(v))}" y1="${Y_AXIS}" x2="${f1(X(v))}" y2="${Y_AXIS + 6}" style="stroke:var(--tsa-muted);stroke-width:1.5;fill:none"/>`);
    o.push(`<text x="${f1(X(v))}" y="${Y_AXIS + 27}" font-size="18" text-anchor="middle" style="${STYLE.muted}">${v}</text>`);
  }
  o.push(`<text x="${f1((X0 + X1) / 2)}" y="${Y_AXIS + 53}" font-size="18" text-anchor="middle" style="${STYLE.muted}">${T('Rigidité de la fiche (lb/in) · un point = un polyester', 'Stiffness on the product page (lb/in) · one dot = one polyester')}</text>`);

  // Zones 200 et 240 (traits pointillés + effectifs)
  for (const [v, side] of [[ZONE_SOFT_MAX, 'end'], [ZONE_FIRM_MIN, 'start']] as const) {
    o.push(`<line x1="${f1(X(v))}" y1="60" x2="${f1(X(v))}" y2="${Y_AXIS}" style="stroke:var(--tsa-muted);stroke-width:1;fill:none;stroke-dasharray:5 4"/>`);
    const tx = side === 'end' ? X(v) - 8 : X(v) + 8;
    const n = side === 'end' ? fa.nSoft : fa.nFirm;
    o.push(`<text x="${f1(tx)}" y="32" font-size="20" font-weight="600" text-anchor="${side}" fill="currentColor">${side === 'end' ? '≤' : '≥'}${NB}${v}${NB}lb/in</text>`);
    o.push(`<text x="${f1(tx)}" y="54" font-size="18" text-anchor="${side}" style="${STYLE.muted}">${n}${NB}${T('polyesters', 'polys')}</text>`);
  }

  // Repères d'indice (seuils d'alerte) : pastilles + traits
  for (const [thr, idx] of [[fa.thrSens, aSens], [fa.thrStd, aStd]] as const) {
    const x = X(thr);
    o.push(`<line x1="${f1(x)}" y1="${yBand}" x2="${f1(x)}" y2="${Y_AXIS}" style="stroke:var(--tsa-muted);stroke-width:1.5;fill:none"/>`);
    o.push(`<rect x="${f1(x - 38)}" y="68" width="76" height="26" rx="13" style="fill:var(--tsa-card);stroke:var(--tsa-muted);stroke-width:1.5"/>`);
    o.push(`<text x="${f1(x)}" y="87" font-size="18" font-weight="600" text-anchor="middle" fill="currentColor">RCS${NB}${idx}</text>`);
  }

  // Points : un par polyester, colorés selon l'alerte atteinte dans le montage d'exemple
  for (const d of dots) {
    const rcs = rcsOf(d.s);
    const colour = rcs >= aStd ? 'var(--tsa-a4)' : rcs >= aSens ? 'var(--tsa-a2)' : 'var(--tsa-a3)';
    const cy = Y_AXIS - 1.5 - d.h;
    // point cerclé = rigidité alignée sur une mesure TWU ; même rayon extérieur (4,8) pour tous les points
    const aligned = alignedOnTwu(d.s);
    const ring = aligned ? `r="${f1(R - 0.4)}" style="fill:${colour};stroke:currentColor;stroke-width:1.6"` : `r="${R}" style="fill:${colour};stroke:var(--tsa-card);stroke-width:0.8"`;
    o.push(`<circle cx="${f1(d.x)}" cy="${f1(cy)}" ${ring}><title>${esc(label(d.s))}${T(NB + ':', ':')} ${num(d.s.stiffness, lang)}${NB}lb/in${aligned ? T(`${NB}(mesure TWU)`, `${NB}(TWU measurement)`) : ''}</title></circle>`);
  }

  // Médiane : repère sous l'axe
  const xm = X(fa.median);
  o.push(`<path d="M${f1(xm)} ${Y_AXIS + 2} l-7 11 h14 z" fill="currentColor"/>`);

  // Légende
  let y = Y_AXIS + 88;
  const legend = (swatch: string, text: string) => {
    o.push(swatch.replace('{y}', String(y)));
    o.push(`<text x="${X0 + 26}" y="${y + 6}" font-size="18" fill="currentColor">${text}</text>`);
    y += 28;
  };
  const nBand = fa.nSens - fa.nStd; // indices de 32 à 34 : alerte pour un bras sensible seulement
  const nBelow = fa.nPolys - fa.nSens;
  legend(`<circle cx="${X0 + 8}" cy="{y}" r="6" style="fill:var(--tsa-a3)"/>`,
    T(`Indice RCS &lt;${NB}${aSens}${NB}: ${nBelow}${NB}polyesters`, `RCS index &lt;${NB}${aSens}: ${nBelow}${NB}polys`));
  legend(`<rect x="${X0}" y="{y}" width="16" height="16" transform="translate(0 -8)" style="fill:var(--tsa-a2-soft);stroke:var(--tsa-a2);stroke-width:2"/>`,
    T(`Indice RCS de ${aSens}${NB}à${NB}${aStd - 1}${NB}: alerte pour un bras sensible, ${nBand}${NB}polyesters`, `RCS index ${aSens}${NB}to${NB}${aStd - 1}: sensitive-arm alert, ${nBand}${NB}polys`));
  legend(`<rect x="${X0}" y="{y}" width="16" height="16" transform="translate(0 -8)" style="fill:var(--tsa-a4-soft);stroke:var(--tsa-a4);stroke-width:2"/>`,
    T(`Indice RCS ≥${NB}${aStd}${NB}: alerte pour tous les profils, ${fa.nStd}${NB}polyesters`, `RCS index ≥${NB}${aStd}: alert for every profile, ${fa.nStd}${NB}polys`));
  legend(`<path d="M${X0 + 8} {y} l-8 9 h16 z" transform="translate(0 -5)" fill="currentColor"/>`,
    T(`Médiane : ${num(fa.median, 'fr')}${NB}lb/in`, `Median: ${num(fa.median, 'en')}${NB}lb/in`));
  legend(`<circle cx="${X0 + 8}" cy="{y}" r="5.2" style="fill:var(--tsa-a3);stroke:currentColor;stroke-width:1.6"/>`,
    T(`Point cerclé${NB}: rigidité alignée sur une mesure TWU (${fa.nAlignedPolys}${NB}polyesters)`, `Outlined dot: stiffness aligned on a TWU measurement (${fa.nAlignedPolys}${NB}polys)`));
  o.push(`</g>`);
  o.push(`</svg>`);

  const caption = T(
    `Où se placent les ${fa.nPolys}${NB}polyesters du catalogue : chaque point est une fiche, à la rigidité qu'elle indique. Les repères d'indice situent, pour le montage d'exemple de l'article (raquette de RA${NB}${fa.example.ra}, ${fa.example.kg}${NB}kg), les seuils d'alerte du configurateur : ${aSens} pour un bras sensible, ${aStd} pour tous les profils. Les points cerclés sont les ${fa.nAlignedPolys}${NB}polyesters dont la rigidité est alignée sur une mesure du laboratoire TWU${NB}; pour les ${fa.nPolys - fa.nAlignedPolys}${NB}autres, c'est la valeur de notre fiche, pas une mesure TWU. Schéma Tennis String Advisor, d'après la base du site, état au ${AS_OF.fr}.`,
    `Where the catalogue's ${fa.nPolys}${NB}polyesters sit: each dot is one product page, at the stiffness it shows. The index markers show, for the article's example setup (racquet with an RA of${NB}${fa.example.ra}, ${fa.example.kg}${NB}kg), where the configurator's alert thresholds fall: ${aSens} for a sensitive arm, ${aStd} for every profile. Outlined dots are the ${fa.nAlignedPolys}${NB}polyesters whose stiffness is aligned on a measurement by the TWU lab; for the other ${fa.nPolys - fa.nAlignedPolys}, it is the value on our product page, not a TWU measurement. Chart by Tennis String Advisor, based on the site's database, as of ${AS_OF.en}.`,
  );
  return wrapFigure(o.join('\n'), caption);
}

// ---------------------------------------------------------------------------------------------
// Graphique 2 : rigidité par famille de cordage (minimum, médiane, maximum)
// ---------------------------------------------------------------------------------------------
function famillesFigure(fa: Facts, lang: Lang): string {
  const W = 640;
  const P0 = 178, P1 = 580, E0 = 80, E1 = 300; // axe 80-300 : le polyester le plus rigide est à 286,9 lb/in ; la place à droite sert à l'étiquette du maximum
  const kx = (P1 - P0) / (E1 - E0);
  const X = (v: number) => P0 + (v - E0) * kx;
  const T = (fr: string, en: string) => (lang === 'fr' ? fr : en);
  const id = `fig-rigidite-familles-${lang}`;
  const fMin = Math.min(...fa.families.map((f) => f.min)), fMax = Math.max(...fa.families.map((f) => f.max));
  if (fMin < E0 || fMax > E1) throw new Error(`rigidité hors de l'axe ${E0}-${E1} : ${fMin}-${fMax}`);
  const PITCH = 44, Y_FIRST = 112;
  const Y_AXIS = Y_FIRST + PITCH * (fa.families.length - 1) + 32;
  const H = Y_AXIS + 118;
  const edges = fa.edges;
  const edgeX = edges.map((e) => stiffnessReaching(e));
  // « 36 polyesters, 11 multifilaments, 1 synthétique » : les fiches alignées sur une mesure TWU, par famille (C-4)
  const alignedList = (l: Lang) =>
    [...fa.families].filter((f) => f.nAligned > 0).sort((a, b) => b.nAligned - a.nAligned || a.fr.localeCompare(b.fr))
      .map((f) => `${f.nAligned}${NB}${l === 'fr' ? (f.nAligned === 1 ? f.frOne : f.frMany) : (f.nAligned === 1 ? f.enOne : f.enMany)}`)
      .join(', ');

  const parts = fa.families.map((f) => `${T(f.fr, f.en)} ${num(f.min, lang)} ${T('à', 'to')} ${num(f.max, lang)} (${T('médiane', 'median')} ${num(f.med, lang)})`).join(T(' ; ', '; '));
  const title = T(
    `Rigidité des cordages par famille, en lb/in, du minimum au maximum avec la médiane : ${parts}. Dans le montage d'exemple (raquette de RA ${fa.example.ra}, ${fa.example.kg} kg), l'indice RCS atteint ${edges.join(', ')} à partir d'environ ${edgeX.map(Math.round).join(', ')} lb/in. Ces valeurs sont celles des fiches : ${fa.nAlignedAll} des ${fa.total} sont alignées sur une mesure du laboratoire TWU (${alignedList('fr')}).`,
    `String stiffness by family, in lb/in, from minimum to maximum with the median: ${parts}. In the example setup (racquet with an RA of ${fa.example.ra}, ${fa.example.kg} kg), the RCS index reaches ${edges.join(', ')} from about ${edgeX.map(Math.round).join(', ')} lb/in. These values are those of the product pages: ${fa.nAlignedAll} of the ${fa.total} are aligned on a measurement by the TWU lab (${alignedList('en')}).`,
  );

  const o: string[] = [];
  o.push(`<svg class="tsa-schema" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${id}"><title id="${id}">${esc(title)}</title>`);
  o.push(`<g font-family="${FONT}">`);

  // Bande d'indice RCS du montage d'exemple (5 paliers publiés)
  o.push(`<text x="${P0}" y="26" font-size="18" style="${STYLE.muted}">${T(`Indice RCS du montage d'exemple (RA${NB}${fa.example.ra}, ${fa.example.kg}${NB}kg)`, `RCS index of the example setup (RA${NB}${fa.example.ra}, ${fa.example.kg}${NB}kg)`)}</text>`);
  const bounds = [E0, ...edgeX, E1];
  const tints = ['var(--tsa-a1-soft)', 'var(--tsa-a1-soft)', 'var(--tsa-a2-soft)', 'var(--tsa-a2-soft)', 'var(--tsa-a4-soft)'];
  for (let i = 0; i < 5; i++) {
    o.push(`<rect x="${f1(X(bounds[i]))}" y="38" width="${f1(X(bounds[i + 1]) - X(bounds[i]))}" height="16" style="fill:${tints[i]}"/>`);
  }
  edges.forEach((e, i) => {
    o.push(`<line x1="${f1(X(edgeX[i]))}" y1="38" x2="${f1(X(edgeX[i]))}" y2="${Y_AXIS}" style="${STYLE.grid};stroke-dasharray:4 4"/>`);
    o.push(`<text x="${f1(X(edgeX[i]))}" y="76" font-size="18" font-weight="600" text-anchor="middle" fill="currentColor">${e}</text>`);
  });

  // Lignes : une par famille
  fa.families.forEach((f, i) => {
    const yc = Y_FIRST + PITCH * i;
    o.push(`<text x="8" y="${yc - 1}" font-size="20" font-weight="600" fill="currentColor">${esc(T(f.fr, f.en))}</text>`);
    o.push(`<text x="8" y="${yc + 19}" font-size="18" style="${STYLE.muted}">${f.n}${NB}${T(f.frCount, f.enCount)}</text>`);
    o.push(`<line x1="${f1(X(f.min))}" y1="${yc}" x2="${f1(X(f.max))}" y2="${yc}" style="stroke:var(--tsa-a3);stroke-width:8;fill:none;stroke-linecap:round"/>`);
    o.push(`<circle cx="${f1(X(f.min))}" cy="${yc}" r="6.5" style="fill:var(--tsa-a3)"/>`);
    o.push(`<circle cx="${f1(X(f.max))}" cy="${yc}" r="6.5" style="fill:var(--tsa-a3)"/>`);
    o.push(`<path d="M${f1(X(f.med))} ${yc - 11} l10 11 l-10 11 l-10 -11 z" fill="currentColor" style="stroke:var(--tsa-card);stroke-width:2"/>`);
    o.push(`<text x="${f1(X(f.min) - 12)}" y="${yc + 6}" font-size="18" text-anchor="end" fill="currentColor" style="paint-order:stroke;stroke:var(--tsa-card);stroke-width:5px;stroke-linejoin:round">${num(f.min, lang)}</text>`);
    o.push(`<text x="${f1(X(f.max) + 12)}" y="${yc + 6}" font-size="18" text-anchor="start" fill="currentColor" style="paint-order:stroke;stroke:var(--tsa-card);stroke-width:5px;stroke-linejoin:round">${num(f.max, lang)}</text>`);
    o.push(`<text x="${f1(X(f.med))}" y="${yc - 17}" font-size="18" font-weight="600" text-anchor="middle" fill="currentColor" style="paint-order:stroke;stroke:var(--tsa-card);stroke-width:5px;stroke-linejoin:round">${num(f.med, lang)}</text>`);
  });

  // Axe
  o.push(`<line x1="${P0}" y1="${Y_AXIS}" x2="${P1}" y2="${Y_AXIS}" style="stroke:var(--tsa-muted);stroke-width:1.5;fill:none"/>`);
  for (let v = 100; v <= 300; v += 50) {
    o.push(`<line x1="${f1(X(v))}" y1="${Y_AXIS}" x2="${f1(X(v))}" y2="${Y_AXIS + 6}" style="stroke:var(--tsa-muted);stroke-width:1.5;fill:none"/>`);
    o.push(`<text x="${f1(X(v))}" y="${Y_AXIS + 27}" font-size="18" text-anchor="middle" style="${STYLE.muted}">${v}</text>`);
  }
  o.push(`<text x="${f1((P0 + P1) / 2)}" y="${Y_AXIS + 53}" font-size="18" text-anchor="middle" style="${STYLE.muted}">${T('Rigidité de la fiche (lb/in)', 'Stiffness on the product page (lb/in)')}</text>`);

  // Légende
  const yl = Y_AXIS + 86;
  o.push(`<circle cx="${P0 - 130 + 8}" cy="${yl - 5}" r="6.5" style="fill:var(--tsa-a3)"/>`);
  o.push(`<text x="${P0 - 130 + 24}" y="${yl}" font-size="18" fill="currentColor">${T('minimum et maximum', 'minimum and maximum')}</text>`);
  const lx2 = P0 + 190;
  o.push(`<path d="M${lx2 + 8} ${yl - 16} l9 11 l-9 11 l-9 -11 z" fill="currentColor"/>`);
  o.push(`<text x="${lx2 + 28}" y="${yl}" font-size="18" fill="currentColor">${T('médiane', 'median')}</text>`);
  o.push(`</g>`);
  o.push(`</svg>`);

  const caption = T(
    `Rigidité des fiches par famille de cordage, de la plus souple à la plus rigide : minimum, médiane et maximum. La bande du haut situe l'indice RCS d'un montage d'exemple (raquette de RA${NB}${fa.example.ra}, ${fa.example.kg}${NB}kg) selon la rigidité du cordage. Ces valeurs sont celles de nos fiches${NB}: ${fa.nAlignedAll} des ${fa.total} sont alignées sur une mesure du laboratoire TWU (${alignedList('fr')}), les autres ne sont pas des mesures TWU. Schéma Tennis String Advisor, d'après la base du site, état au ${AS_OF.fr}.`,
    `Stiffness of the product pages by string family, softest to stiffest: minimum, median and maximum. The band at the top shows the RCS index of an example setup (racquet with an RA of${NB}${fa.example.ra}, ${fa.example.kg}${NB}kg) according to string stiffness. These values are the ones on our product pages: ${fa.nAlignedAll} of the ${fa.total} are aligned on a measurement by the TWU lab (${alignedList('en')}), the others are not TWU measurements. Chart by Tennis String Advisor, based on the site's database, as of ${AS_OF.en}.`,
  );
  return wrapFigure(o.join('\n'), caption);
}

function wrapFigure(svg: string, caption: string): string {
  return `<figure class="tsa-fig">\n${svg}\n<figcaption>${caption}</figcaption>\n</figure>`;
}

// ---------------------------------------------------------------------------------------------
// Insertion dans les articles, contrôle
// ---------------------------------------------------------------------------------------------
const marker = (kind: string, edge: 'debut' | 'fin') =>
  edge === 'debut'
    ? `<!-- figure-rigidite:${kind}:debut — généré par scripts/blog-covers/build-rigidite-figures.mts depuis src/data/ ; ne pas modifier à la main -->`
    : `<!-- figure-rigidite:${kind}:fin -->`;

function render(kind: string, lang: Lang, fa: Facts): string {
  return kind === 'polyesters' ? polyestersFigure(fa, lang) : famillesFigure(fa, lang);
}

const EOL_LF = (t: string) => t.replace(/\r\n/g, '\n');

function injected(html: string, kind: string): { before: string; block: string; after: string } | null {
  const a = html.indexOf(`<!-- figure-rigidite:${kind}:debut`);
  const endTag = marker(kind, 'fin');
  const b = html.indexOf(endTag);
  if (a < 0 || b < a) return null;
  const aEnd = html.indexOf('-->', a) + 3;
  return { before: html.slice(0, aEnd), block: html.slice(aEnd, b), after: html.slice(b) };
}

/** Chiffres du texte qui doivent coller à la base (liste volontairement courte ; voir l'en-tête). */
function expectations(fa: Facts, lang: Lang, kind: string): { re: RegExp; what: string }[] {
  const n = (v: number) => num(v, lang);
  // une espace du texte peut être une espace insécable (&nbsp;)
  const rx = (src: string) => new RegExp(src.replace(/ /g, '(?: |&nbsp;)'));
  const fam = (t: string) => fa.families.find((f) => f.type === t)!;
  const mm = fam('Multifilament');
  const dot = (v: string) => v.replace(/\./g, '\\.'); // le point d'un nombre ou d'une phrase est littéral dans l'expression
  if (kind === 'polyesters') {
    return lang === 'fr'
      ? [
          { re: rx(`Nos ${fa.nPolys} polyesters vont de ${n(fa.min)} à ${n(fa.max)} lb/in \\(médiane ${n(fa.median)}\\)`), what: 'effectif, étendue et médiane des polyesters' },
          { re: rx(`Les ${fa.nSoft} polyesters les plus souples`), what: `effectif des ≤ ${ZONE_SOFT_MAX} lb/in` },
          { re: rx(`Sur ${fa.nPolys}, ils sont ${fa.nSoft}\\.`), what: 'phrase « Sur N, ils sont n »' },
          { re: rx(`${fa.nFirm} polyesters du catalogue sont à ${ZONE_FIRM_MIN} lb/in ou plus`), what: `effectif des ≥ ${ZONE_FIRM_MIN} lb/in` },
          { re: rx(`Les ${fa.nFirm} plus fermes`), what: 'titre des plus fermes' },
          { re: rx(`seuls ${mm.nAligned} de nos ${mm.n} multifilaments ont une rigidité alignée`), what: 'hybrides : multifilaments alignés sur une mesure TWU' },
          { re: rx(`un indice RCS de ${fa.soft3Rcs[0]} à ${fa.soft3Rcs[1]}, contre ${fa.topRcs} pour le plus rigide`), what: 'FAQ n° 1 : indices des trois plus souples et du plus rigide' },
          { re: rx(`cet écart vaut ${fa.gap.min} à ${fa.gap.max} points d'indice RCS`), what: 'Verdict express : écart entre le plus souple et le plus rigide' },
          { re: rx(`avec un ${fa.topLabel} à 22 kg \\(indice ${fa.topRcs}\\)`), what: 'leviers : indice du polyester le plus rigide' },
        ]
      : [
          { re: rx(`Our ${fa.nPolys} polys range from ${n(fa.min)} to ${n(fa.max)} lb/in \\(median ${n(fa.median)}\\)`), what: 'effectif, étendue et médiane des polyesters' },
          { re: rx(`The ${fa.nSoft} softest polys`), what: `effectif des ≤ ${ZONE_SOFT_MAX} lb/in` },
          { re: rx(`Out of ${fa.nPolys}, there are ${fa.nSoft}\\.`), what: 'phrase « Out of N, there are n »' },
          { re: rx(`${fa.nFirm} polys in the catalogue are at ${ZONE_FIRM_MIN} lb/in or more`), what: `effectif des ≥ ${ZONE_FIRM_MIN} lb/in` },
          { re: rx(`The ${fa.nFirm} firmest`), what: 'titre des plus fermes' },
          { re: rx(`only ${mm.nAligned} of our ${mm.n} multifilaments have a stiffness aligned`), what: 'hybrides : multifilaments alignés sur une mesure TWU' },
          { re: rx(`an RCS index of ${fa.soft3Rcs[0]} to ${fa.soft3Rcs[1]}, against ${fa.topRcs} for the stiffest`), what: 'FAQ n° 1 : indices des trois plus souples et du plus rigide' },
          { re: rx(`that gap is worth ${fa.gap.min} to ${fa.gap.max} RCS points`), what: 'short version : écart entre le plus souple et le plus rigide' },
          { re: rx(`with ${fa.topLabel} at 22 kg \\(index ${fa.topRcs}\\)`), what: 'leviers : indice du polyester le plus rigide' },
        ];
  }
  const row = (word: string, f: ReturnType<typeof fam>) =>
    rx(`<tr><td><strong>${word}[^<]*</strong></td><td class="num">${f.n}</td><td class="num">${n(f.min).replace('.', '\\.')} – ${n(f.max)}</td><td class="num">${n(f.med).replace('.', '\\.')}</td></tr>`);
  const p = fam('Polyester'), m = fam('Multifilament');
  return lang === 'fr'
    ? [
        { re: row('Multifilament', m), what: 'ligne multifilament du tableau des familles' },
        { re: row('Polyester', p), what: 'ligne polyester du tableau des familles' },
        { re: rx(`${fa.total} fiches cordages`), what: 'effectif du catalogue' },
        { re: rx(`multifilaments de ${m.min} à ${m.max}`), what: 'étendue des multifilaments dans le texte' },
        { re: rx(dot(`les polyesters de ${n(p.min)} à ${n(p.max)}.`)), what: '« L\'essentiel » : étendue des polyesters' },
        { re: rx(dot(`contre ${n(p.min)} à ${n(p.max)} lb/in pour les polyesters`)), what: 'FAQ n° 1 : étendue des polyesters' },
      ]
    : [
        { re: row('Multifilament', m), what: 'ligne multifilament du tableau des familles' },
        { re: row('Polyester', p), what: 'ligne polyester du tableau des familles' },
        { re: rx(`${fa.total} string pages`), what: 'effectif du catalogue' },
        { re: rx(`multifilaments at ${m.min}-${m.max}`), what: 'étendue des multifilaments dans le texte' },
        { re: rx(dot(`polyesters at ${n(p.min)}-${n(p.max)}.`)), what: 'short version : étendue des polyesters' },
        { re: rx(dot(`against ${n(p.min)} to ${n(p.max)} lb/in for polyesters`)), what: 'FAQ n° 1 : étendue des polyesters' },
      ];
}

function main() {
  const args = process.argv.slice(2);
  const fa = computeFacts();

  if (args.includes('--facts')) {
    const { polys, ...rest } = fa;
    console.log(JSON.stringify({ ...rest, polysSoft: polys.filter((s) => s.stiffness <= ZONE_SOFT_MAX).map((s) => `${label(s)} ${s.stiffness}`), polysFirm: polys.filter((s) => s.stiffness >= ZONE_FIRM_MIN).map((s) => `${label(s)} ${s.stiffness}`) }, null, 2));
    return;
  }

  const pv = args.indexOf('--preview');
  if (pv !== -1) {
    const dir = args[pv + 1];
    if (!dir) throw new Error('--preview <dossier>');
    mkdirSync(dir, { recursive: true });
    const css = readFileSync(join(ROOT, 'public/blog/blog-figures.css'), 'utf8');
    for (const theme of ['clair', 'sombre'] as const) {
      const body = TARGETS.map((t) => `<h3 style="font:600 14px system-ui;margin:24px 0 4px">${t.kind} · ${t.lang}</h3><div style="max-width:${args.includes('--mobile') ? 358 : 800}px">${render(t.kind, t.lang, fa)}</div>`).join('\n');
      const page = `<!doctype html><html lang="fr" class="${theme === 'sombre' ? 'dark' : ''}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}\nbody{margin:16px;font-family:system-ui;background:${theme === 'sombre' ? '#111827' : '#f9fafb'};color:${theme === 'sombre' ? '#f3f4f6' : '#1f2937'}}</style></head><body>${body}</body></html>`;
      writeFileSync(join(dir, `apercu-${theme}.html`), page);
    }
    console.log(`aperçus écrits dans ${dir}`);
    return;
  }

  const check = args.includes('--check');
  let problems = 0;
  for (const t of TARGETS) {
    const path = join(ROOT, t.file);
    const raw = readFileSync(path, 'utf8');
    const crlf = raw.includes('\r\n');
    const html = EOL_LF(raw);
    const parts = injected(html, t.kind);
    if (!parts) {
      console.log(`  ECHEC ${t.file} : repères figure-rigidite:${t.kind} absents`);
      problems++;
      continue;
    }
    // l'indentation du repère de fin est conservée : le script est idempotent
    const indent = (parts.block.match(/\n([ \t]*)$/) ?? ['', ''])[1];
    const block = `\n${render(t.kind, t.lang, fa)}\n${indent}`;
    if (check) {
      if (parts.block !== block) {
        console.log(`  ECHEC ${t.file} : le graphique « ${t.kind} » ne correspond plus à la base — relancer le script sans --check`);
        problems++;
      } else console.log(`  OK    ${t.file} : graphique « ${t.kind} » conforme à la base`);
      for (const e of expectations(fa, t.lang, t.kind)) {
        if (!e.re.test(html)) {
          console.log(`  ECHEC ${t.file} : ${e.what} ne colle plus à la base (attendu : ${e.re.source})`);
          problems++;
        }
      }
    } else {
      const out = parts.before + block + parts.after;
      writeFileSync(path, crlf ? out.replace(/\n/g, '\r\n') : out);
      console.log(`  écrit ${t.file} : graphique « ${t.kind} » (${fa.nPolys} polyesters, ${fa.total} cordages)`);
    }
  }
  if (check) console.log(problems === 0 ? '\nfigures et chiffres du texte conformes à la base' : `\n${problems} écart(s) avec la base`);
  process.exit(problems === 0 ? 0 : 1);
}

main();
