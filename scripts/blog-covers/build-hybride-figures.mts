/**
 * Figures de l'article « montage hybride » (FR + EN) — tirées de la base et du moteur de l'indice.
 *
 * POURQUOI. L'article chiffre la fermeté de quelques hybrides montés à la main (arbitrage A-1 du dossier
 * docs/redaction/montage-hybride-cordage-tennis.md : seulement ceux dont les DEUX cordages ont une rigidité
 * alignée sur une mesure du laboratoire TWU). Ces chiffres sont ceux que le configurateur affiche : ils sortent ici
 * du même moteur, jamais d'un calcul à la main, et le script se relance quand la base change.
 *
 * TROIS BLOCS, générés entre des repères HTML posés une fois à la main dans chaque article :
 *     <!-- figure-hybride:<bloc>:debut … --> … <!-- figure-hybride:<bloc>:fin -->
 *   1. `schema`   : schéma montants / travers d'un exemple (cordage et tension de chaque sens, indice de chacun
 *                   monté seul, estimation de l'hybride) ;
 *   2. `tableau`  : tableau des exemples (estimation, bornes, palier, sens inverse) et sa note ;
 *   3. `graphique`: « où tombe l'indice d'un hybride » : montants seuls, travers seuls et hybride sur l'échelle de
 *                   l'indice, bandes des paliers publiés, seuils d'alerte bras du configurateur.
 * Un bloc n'est jamais retouché à la main. SVG en ligne, classe `tsa-schema`, variables `--tsa-*` de
 * public/blog/blog-figures.css : thème clair et sombre.
 *
 * D'OÙ VIENNENT LES CHIFFRES (aucun n'est saisi à la main) :
 *   - indice d'un montage, hybride compris, et ses bornes : `setupFirmnessIndex` (src/lib/advanced-rcs.ts), la
 *     fonction que le configurateur, l'alerte bras et le PDF appellent ;
 *   - seuils d'alerte bras : `ARM_ALERT_RCS` (même fichier) ; paliers publiés : `getStringRecommendation`, sondée ;
 *   - montage de référence (charte F7) : `DEFAULT_RACQUET_RA` (src/lib/racquet-scoring.ts) et `REF_TENSION`, lu dans
 *     scripts/qa-ratings.mts ;
 *   - rigidités, noms : `stringsDatabase` ; « alignée sur une mesure TWU » (le † des articles) : même définition
 *     que `alignedOnTwu` de build-rigidite-figures.mts (provenance `appliquee`, ou commentaire « Rigidité : TWU « … » »
 *     de la base pour les 8 fiches Toroline). Le script ÉCHOUE si un cordage d'exemple ne l'est pas (A-1).
 *   Seules décisions éditoriales posées ici : la liste des exemples et l'exemple du schéma.
 *
 * USAGE (depuis la racine du dépôt) :
 *   npx --yes tsx scripts/blog-covers/build-hybride-figures.mts            écrit les blocs des deux articles
 *   npx --yes tsx scripts/blog-covers/build-hybride-figures.mts --check    exit 1 si un bloc ou un chiffre du texte
 *                                                                           (voir `expectations`) ne colle plus à la base
 *   npx --yes tsx scripts/blog-covers/build-hybride-figures.mts --facts    les chiffres, pour le dossier
 *   npx --yes tsx scripts/blog-covers/build-hybride-figures.mts --preview <dossier>   pages d'essai clair/sombre
 *
 * Après un changement de la base, relire AUSSI les phrases de l'article : `--check` en vérifie une liste, pas toutes.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { stringsDatabase, getStringRecommendation, type TennisString } from '../../src/data/strings-database';
import { STRING_STIFFNESS_PROVENANCE } from '../../src/data/string-stiffness-provenance';
import { setupFirmnessIndex, ARM_ALERT_RCS } from '../../src/lib/advanced-rcs';
import { DEFAULT_RACQUET_RA } from '../../src/lib/racquet-scoring';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
type Lang = 'fr' | 'en';

// ---------------------------------------------------------------------------------------------
// Décisions éditoriales (pas des données de la base)
// ---------------------------------------------------------------------------------------------
/** Date d'état de la base affichée (F11) : à mettre à jour quand on relance le script après un changement de la base. */
const AS_OF = { fr: '23 novembre 2026', en: 'November 23, 2026' };
/**
 * Les fiches Toroline sont « alignées sur TWU » par un commentaire de la base, sans entrée de provenance. Réponse de
 * `tsa-core` à Q-3 du dossier (23/11/2026) : 7 sur 8 comptent comme mesurées (appariement strict des contrôles 13 ter
 * et 13 quater de `audit:ratings`) ; Toroline Absolute NE compte PAS (sa ligne TWU n'a pas de jauge nominale). Cette
 * liste d'exclusion tombe quand `alignedOnTwu` ne lira plus que la provenance (chantier (a) de `tsa-core`).
 */
const NOT_MEASURED_DESPITE_COMMENT = new Set(['toroline-absolute']);
/** Hybrides montés à la main : [montants, travers]. Ce ne sont pas des sets prémontés (Q-1 du dossier). */
const EXAMPLES: readonly (readonly [string, string])[] = [
  ['tecnifibre-razor-code', 'tecnifibre-x-one-biphase'],
  ['luxilon-alu-power-soft', 'tecnifibre-x-one-biphase'],
  ['tecnifibre-ice-code', 'tecnifibre-nrg2'],
  ['solinco-hyper-g', 'solinco-vanquish'],
  ['luxilon-4g', 'wilson-nxt'],
  ['toroline-o-toro-tour', 'toroline-o-toro-snap'],
];
/** Exemple du schéma montants / travers (et de la réponse en tête de l'article). */
const SCHEMA_PAIR = ['tecnifibre-ice-code', 'tecnifibre-nrg2'] as const;

const TARGETS = [
  { lang: 'fr', file: 'public/blog/montage-hybride-cordage-tennis.html' },
  { lang: 'en', file: 'public/en/blog/hybrid-tennis-string-setup.html' },
] as const;
const BLOCKS = ['schema', 'tableau', 'graphique'] as const;
type Block = (typeof BLOCKS)[number];

// ---------------------------------------------------------------------------------------------
// Base, moteur, montage de référence
// ---------------------------------------------------------------------------------------------
const DB = stringsDatabase as TennisString[];
const DB_SOURCE = readFileSync(join(ROOT, 'src/data/strings-database.ts'), 'utf8').replace(/\r\n/g, '\n');
const reEscape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const label = (s: TennisString) => `${s.brand} ${s.model}`;
const viaProvenance = (s: TennisString) => STRING_STIFFNESS_PROVENANCE[s.id]?.status === 'appliquee';
const viaComment = (s: TennisString) => new RegExp(`Rigidité : TWU « ${reEscape(label(s))} \\d`, 'i').test(DB_SOURCE);
/** Le † des articles : définition de `alignedOnTwu` (build-rigidite-figures.mts), moins l'exclusion de Q-3. */
const measured = (s: TennisString) => viaProvenance(s) || (viaComment(s) && !NOT_MEASURED_DESPITE_COMMENT.has(s.id));

const get = (id: string): TennisString => {
  const s = DB.find((x) => x.id === id);
  if (!s) throw new Error(`cordage absent de la base : ${id}`);
  return s;
};

const RA = DEFAULT_RACQUET_RA;
const KG = Number((readFileSync(join(ROOT, 'scripts/qa-ratings.mts'), 'utf8').match(/const REF_TENSION = (\d+(?:\.\d+)?);/) ?? [])[1]);
// Le texte de l'article nomme ce montage (« raquette de RA 64, 24 kg ») : un changement doit faire relire l'article.
if (RA !== 64 || KG !== 24) throw new Error(`montage de référence changé (RA ${RA}, ${KG} kg) : relire l'article et ce script`);
const ALERT = ARM_ALERT_RCS;

/** Paliers publiés, par sondage de `getStringRecommendation` : [début, libellé FR du code]. */
function bands(): { from: number; level: string }[] {
  const out = [{ from: 0, level: getStringRecommendation(0).level }];
  for (let r = 1; r <= 60; r++) {
    const level = getStringRecommendation(r).level;
    if (level !== out[out.length - 1].level) out.push({ from: r, level });
  }
  if (out.length !== 5) throw new Error(`5 paliers attendus, ${out.length} trouvés`);
  return out;
}
const BANDS = bands();
/** Libellés affichés : FR du code en casse de phrase ; EN de `STRING_LEVEL_EN` (src/lib/i18n/configurator.ts, non exporté). */
const LEVEL: Record<string, { fr: string; en: string }> = {
  'Très Confortable': { fr: 'Très confortable', en: 'Very Comfortable' },
  Confortable: { fr: 'Confortable', en: 'Comfortable' },
  Standard: { fr: 'Standard', en: 'Standard' },
  Ferme: { fr: 'Ferme', en: 'Firm' },
  'Très Ferme': { fr: 'Très ferme', en: 'Very Firm' },
};
const level = (rcs: number, lang: Lang) => {
  const l = LEVEL[getStringRecommendation(rcs).level];
  if (!l) throw new Error(`palier inconnu : ${getStringRecommendation(rcs).level}`);
  return l[lang];
};

type Setup = { rcs: number; mains: number; crosses: number };
function hybrid(mainsId: string, crossesId: string, tm = KG, tc = KG): Setup {
  const r = setupFirmnessIndex({
    racquetStiffness: RA,
    mainStringStiffness: get(mainsId).stiffness,
    crossStringStiffness: get(crossesId).stiffness,
    mainTension: tm,
    crossTension: tc,
  });
  if (!r.hybrid) throw new Error(`pas d'hybride pour ${mainsId} / ${crossesId}`);
  return { rcs: r.rcs, mains: r.hybrid.mains, crosses: r.hybrid.crosses };
}
const fullBed = (id: string) => setupFirmnessIndex({ racquetStiffness: RA, mainStringStiffness: get(id).stiffness, mainTension: KG }).rcs;

export function computeFacts() {
  const examples = EXAMPLES.map(([m, c]) => {
    for (const id of [m, c]) if (!measured(get(id))) throw new Error(`${id} n'a pas de rigidité alignée sur une mesure TWU : exemple interdit (A-1)`);
    const d = hybrid(m, c);
    const inv = hybrid(c, m);
    if (d.mains !== fullBed(m) || d.crosses !== fullBed(c)) throw new Error('borne différente de l\'intégral au même montage');
    return { mainsStr: get(m), crossesStr: get(c), ...d, inverse: inv.rcs };
  });
  // Écart de tension autour de la même moyenne (exemple du schéma)
  const [sm, sc] = SCHEMA_PAIR;
  const tension = {
    t2424: hybrid(sm, sc, 24, 24),
    t2422: hybrid(sm, sc, 24, 22),
    t2323: hybrid(sm, sc, 23, 23),
    razor2422: hybrid('tecnifibre-razor-code', 'tecnifibre-x-one-biphase', 24, 22).rcs,
    razor2323: hybrid('tecnifibre-razor-code', 'tecnifibre-x-one-biphase', 23, 23).rcs,
  };
  // Grilles : paires de cordages mesurés, le plus rigide en montants, comparé au sens inverse et au plus rigide monté seul
  const all = DB.filter(measured);
  const gridOf = (A: TennisString[], B: TennisString[]) => {
    const g = { pairs: 0, diff: {} as Record<number, number>, levelChanged: 0, dropMin: 99, dropMax: -99, levelVsFull: 0 };
    for (const a of A) for (const b of B) {
      if (a.id === b.id || a.stiffness <= b.stiffness) continue;
      g.pairs++;
      const d = hybrid(a.id, b.id).rcs;
      const i = hybrid(b.id, a.id).rcs;
      g.diff[d - i] = (g.diff[d - i] ?? 0) + 1;
      if (level(d, 'fr') !== level(i, 'fr')) g.levelChanged++;
      const drop = fullBed(a.id) - d;
      g.dropMin = Math.min(g.dropMin, drop);
      g.dropMax = Math.max(g.dropMax, drop);
      if (level(d, 'fr') !== level(fullBed(a.id), 'fr')) g.levelVsFull++;
    }
    return g;
  };
  const grid = gridOf(all, all);
  const gridPolyMulti = gridOf(all.filter((s) => s.type === 'Polyester'), all.filter((s) => s.type === 'Multifilament'));
  const byType = (t: TennisString['type']) => DB.filter((s) => s.type === t);
  return {
    asOf: AS_OF,
    ra: RA,
    kg: KG,
    alert: ALERT,
    bands: BANDS,
    nMeasured: all.length,
    nStrings: DB.length,
    nGut: byType('Natural Gut').length,
    nGutMeasured: byType('Natural Gut').filter(measured).length,
    examples,
    tension,
    grid,
    gridPolyMulti,
  };
}
type Facts = ReturnType<typeof computeFacts>;
type Example = Facts['examples'][number];

// ---------------------------------------------------------------------------------------------
// Outils de rendu
// ---------------------------------------------------------------------------------------------
const NB = '&nbsp;';
const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
const f1 = (v: number) => (Math.round(v * 10) / 10).toString();
const num = (v: number, lang: Lang) => (lang === 'fr' ? String(v).replace('.', ',') : String(v));
const esc = (t: string) => t.replace(/&(?!nbsp;|#\d+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const href = (s: TennisString, lang: Lang) => (lang === 'fr' ? `/tennis-strings/${s.id}` : `/en/strings/${s.id}.html`);
const lbIn = (kg: number) => Math.round(kg * 2.20462); // conversion affichée en EN (lb, arrondi à l'unité)
const T = (lang: Lang) => (fr: string, en: string) => (lang === 'fr' ? fr : en);

function wrapFigure(svg: string, caption: string): string {
  return `<figure class="tsa-fig">\n${svg}\n<figcaption>${caption}</figcaption>\n</figure>`;
}

// ---------------------------------------------------------------------------------------------
// 1. Schéma montants / travers d'un exemple
// ---------------------------------------------------------------------------------------------
function schemaFigure(fa: Facts, lang: Lang): string {
  const t = T(lang);
  const ex = fa.examples.find((e) => e.mainsStr.id === SCHEMA_PAIR[0] && e.crossesStr.id === SCHEMA_PAIR[1]);
  if (!ex) throw new Error('l\'exemple du schéma doit figurer parmi les exemples');
  const W = 640, H = 380;
  const id = `fig-hybride-schema-${lang}`;
  const kg = lang === 'fr' ? `${fa.kg}${NB}kg` : `${lbIn(fa.kg)}${NB}lb (${fa.kg}${NB}kg)`;
  const title = t(
    `Schéma d'un montage hybride : ${label(ex.mainsStr)} en montants (cordes verticales) et ${label(ex.crossesStr)} en travers (cordes horizontales), ${fa.kg} kg dans les deux sens, sur une raquette de RA ${fa.ra}. Montés seuls, ces cordages donnent un indice de ${ex.mains} et de ${ex.crosses} ; l'hybride est estimé à ${ex.rcs}, palier ${level(ex.rcs, 'fr')}.`,
    `Diagram of a hybrid setup: ${label(ex.mainsStr)} in the mains (vertical strings) and ${label(ex.crossesStr)} in the crosses (horizontal strings), ${lbIn(fa.kg)} lb (${fa.kg} kg) both ways, on an RA ${fa.ra} racquet. Strung on their own, these strings give an index of ${ex.mains} and ${ex.crosses}; the hybrid is estimated at ${ex.rcs}, ${level(ex.rcs, 'en')} tier.`,
  );
  const o: string[] = [];
  o.push(`<svg class="tsa-schema" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${id}"><title id="${id}">${esc(title)}</title>`);
  o.push(`<g font-family="${FONT}">`);
  // Tamis : ellipse, travers (horizontaux, a2) puis montants (verticaux, a1) par-dessus
  const cx = 160, cy = 190, rx = 120, ry = 162;
  for (let j = -9; j <= 9; j++) {
    const y = cy + j * 16;
    const w = rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2)) - 3;
    o.push(`<line x1="${f1(cx - w)}" y1="${f1(y)}" x2="${f1(cx + w)}" y2="${f1(y)}" style="stroke:var(--tsa-a2);stroke-width:3;fill:none"/>`);
  }
  for (let i = -8; i <= 8; i++) {
    const x = cx + i * 13.5;
    const h = ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)) - 3;
    o.push(`<line x1="${f1(x)}" y1="${f1(cy - h)}" x2="${f1(x)}" y2="${f1(cy + h)}" style="stroke:var(--tsa-a1);stroke-width:4;fill:none"/>`);
  }
  o.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" style="stroke:currentColor;stroke-width:7;fill:none"/>`);
  // Légende à droite
  const X = 318, TX = 350;
  const line = (y: number, text: string, size: number, opts: { bold?: boolean; muted?: boolean } = {}) =>
    o.push(`<text x="${TX}" y="${y}" font-size="${size}"${opts.bold ? ' font-weight="700"' : ''} ${opts.muted ? 'style="fill:var(--tsa-muted)"' : 'fill="currentColor"'}>${text}</text>`);
  o.push(`<line x1="${X + 12}" y1="26" x2="${X + 12}" y2="62" style="stroke:var(--tsa-a1);stroke-width:8;fill:none;stroke-linecap:round"/>`);
  line(42, t('Montants', 'Mains'), 22, { bold: true });
  line(68, `${esc(label(ex.mainsStr))}${NB}†`, 19);
  line(94, t(`${kg} · seul${NB}: ${ex.mains}, ${level(ex.mains, 'fr')}`, `${kg} · alone: ${ex.mains}, ${level(ex.mains, 'en')}`), 18, { muted: true });
  o.push(`<line x1="${X}" y1="146" x2="${X + 24}" y2="146" style="stroke:var(--tsa-a2);stroke-width:7;fill:none;stroke-linecap:round"/>`);
  line(152, t('Travers', 'Crosses'), 22, { bold: true });
  line(178, `${esc(label(ex.crossesStr))}${NB}†`, 19);
  line(204, t(`${kg} · seul${NB}: ${ex.crosses}, ${level(ex.crosses, 'fr')}`, `${kg} · alone: ${ex.crosses}, ${level(ex.crosses, 'en')}`), 18, { muted: true });
  o.push(`<line x1="${X}" y1="236" x2="${W - 8}" y2="236" style="stroke:var(--tsa-grid);stroke-width:1.5;fill:none"/>`);
  line(272, t(`Hybride${NB}: ${ex.rcs}, ${level(ex.rcs, 'fr')}`, `Hybrid: ${ex.rcs}, ${level(ex.rcs, 'en')}`), 22, { bold: true });
  line(300, t(`estimation, entre ${ex.crosses} et ${ex.mains}`, `estimate, between ${ex.crosses} and ${ex.mains}`), 18, { muted: true });
  line(326, t(`raquette de RA${NB}${fa.ra}`, `racquet with an RA of${NB}${fa.ra}`), 18, { muted: true });
  line(352, t(`†${NB}rigidité alignée sur une mesure TWU`, `†${NB}TWU-aligned stiffness`), 17, { muted: true });
  o.push(`</g>`);
  o.push(`</svg>`);
  const caption = t(
    `Un cordage dans chaque sens. Indices du moteur du configurateur, raquette de RA${NB}${fa.ra}, ${fa.kg}${NB}kg dans les deux sens${NB}; celui de l'hybride est une estimation. Schéma Tennis String Advisor, d'après la base du site, état au ${AS_OF.fr}.`,
    `One string each way. Index values from the configurator's engine, RA${NB}${fa.ra} racquet, ${lbIn(fa.kg)}${NB}lb (${fa.kg}${NB}kg) both ways; the hybrid's is an estimate. Diagram by Tennis String Advisor, based on the site's database, as of ${AS_OF.en}.`,
  );
  return wrapFigure(o.join('\n'), caption);
}

// ---------------------------------------------------------------------------------------------
// 2. Tableau des exemples
// ---------------------------------------------------------------------------------------------
function tableBlock(fa: Facts, lang: Lang): string {
  const t = T(lang);
  const cell = (s: TennisString) => `<a href="${href(s, lang)}">${esc(label(s))}</a>${NB}† (${num(s.stiffness, lang)})`;
  const head = t(
    `<tr><th>Montants (lb/in)</th><th>Travers (lb/in)</th><th>Hybride (estimation)</th><th>Bornes${NB}: montants seuls · travers seuls</th><th>Sens inverse</th></tr>`,
    `<tr><th>Mains (lb/in)</th><th>Crosses (lb/in)</th><th>Hybrid (estimate)</th><th>Bounds: mains alone · crosses alone</th><th>Reversed</th></tr>`,
  );
  const rows = fa.examples.map((e) =>
    `<tr><td>${cell(e.mainsStr)}</td><td>${cell(e.crossesStr)}</td><td class="num"><strong>${e.rcs}</strong>, ${level(e.rcs, lang)}</td><td class="num">${e.mains} · ${e.crosses}</td><td class="num">${e.inverse}, ${level(e.inverse, lang)}</td></tr>`,
  );
  const note = t(
    `Raquette de RA${NB}${fa.ra}, ${fa.kg}${NB}kg en montants et en travers${NB}; moteur du configurateur, base au ${AS_OF.fr}. Les bornes sont aussi l'indice de chaque cordage monté seul. †${NB}Rigidité alignée sur une mesure du laboratoire TWU. Couples montés à partir de deux garnitures, pas des sets prémontés.`,
    `RA${NB}${fa.ra} racquet, ${lbIn(fa.kg)}${NB}lb (${fa.kg}${NB}kg) in both mains and crosses; configurator engine, database as of ${AS_OF.en}. The bounds are also each string's index when strung on its own. †${NB}Stiffness aligned on a measurement by the TWU lab. Pairs strung from two separate sets of string, not pre-packed hybrids.`,
  );
  return `<div class="overflow-x-auto">\n<table>\n<thead>${head}</thead>\n<tbody>\n${rows.join('\n')}\n</tbody>\n</table>\n</div>\n<p class="table-note">${note}</p>`;
}

// ---------------------------------------------------------------------------------------------
// 3. Graphique « où tombe l'indice d'un hybride »
// ---------------------------------------------------------------------------------------------
function chartFigure(fa: Facts, lang: Lang): string {
  const t = T(lang);
  const W = 640;
  const S0 = 19.5, S1 = 40; // échelle de l'indice ; le script échoue si une valeur en sort
  const X0 = 236, X1 = 626;
  const X = (v: number) => X0 + ((v - S0) * (X1 - X0)) / (S1 - S0);
  const lo = Math.min(...fa.examples.map((e) => e.crosses)), hi = Math.max(...fa.examples.map((e) => e.mains));
  if (lo < S0 + 0.5 || hi > S1 - 0.5) throw new Error(`indice hors de l'échelle ${S0}-${S1} : ${lo}-${hi}`);
  const PITCH = 62, Y_FIRST = 92; // 62 : l'étiquette « seul » d'une ligne ne touche pas celle de l'hybride de la suivante
  const Y_AXIS = Y_FIRST + PITCH * (fa.examples.length - 1) + 34;
  const H = Y_AXIS + 150;
  const id = `fig-hybride-indices-${lang}`;
  const rows = fa.examples
    .map((e) => t(
      `${label(e.mainsStr)} / ${label(e.crossesStr)} : ${e.rcs} (${level(e.rcs, 'fr')}), entre ${e.crosses} et ${e.mains}`,
      `${label(e.mainsStr)} / ${label(e.crossesStr)}: ${e.rcs} (${level(e.rcs, 'en')}), between ${e.crosses} and ${e.mains}`,
    ))
    .join(t(' ; ', '; '));
  const title = t(
    `Où tombe l'indice d'un hybride, raquette de RA ${fa.ra}, ${fa.kg} kg dans les deux sens. Pour chaque exemple, l'indice des montants seuls, celui des travers seuls et l'estimation de l'hybride : ${rows}. Bandes des paliers publiés et seuils d'alerte bras du configurateur, ${fa.alert.sensitive} (bras sensible déclaré) et ${fa.alert.standard} (tous les profils).`,
    `Where a hybrid's index falls, RA ${fa.ra} racquet, ${lbIn(fa.kg)} lb (${fa.kg} kg) both ways. For each example, the index of the mains alone, of the crosses alone, and the hybrid estimate: ${rows}. Bands of the published tiers and the configurator's arm-alert thresholds, ${fa.alert.sensitive} (declared sensitive arm) and ${fa.alert.standard} (every profile).`,
  );
  const o: string[] = [];
  o.push(`<svg class="tsa-schema" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${id}"><title id="${id}">${esc(title)}</title>`);
  o.push(`<g font-family="${FONT}">`);

  // Bandes des paliers (bornes entre deux entiers : l'indice est un entier)
  const tints: Record<string, string> = {
    'Très Confortable': 'var(--tsa-a1-soft)',
    Confortable: 'var(--tsa-a1-soft)',
    Standard: 'var(--tsa-card)',
    Ferme: 'var(--tsa-a2-soft)',
    'Très Ferme': 'var(--tsa-a4-soft)',
  };
  const yTop = 48, yBot = Y_AXIS;
  fa.bands.forEach((b, i) => {
    const from = Math.max(S0, b.from - 0.5);
    const to = i + 1 < fa.bands.length ? fa.bands[i + 1].from - 0.5 : S1;
    if (to <= S0) return;
    o.push(`<rect x="${f1(X(from))}" y="${yTop}" width="${f1(X(to) - X(from))}" height="${yBot - yTop}" style="fill:${tints[b.level]}"/>`);
    const name = LEVEL[b.level][lang];
    o.push(`<text x="${f1((X(from) + X(to)) / 2)}" y="${yTop - 12}" font-size="16" font-weight="600" text-anchor="middle" fill="currentColor">${esc(name)}</text>`);
    if (b.from > S0) o.push(`<line x1="${f1(X(from))}" y1="${yTop}" x2="${f1(X(from))}" y2="${yBot}" style="stroke:var(--tsa-grid);stroke-width:1;fill:none"/>`);
  });
  // Seuils d'alerte : l'alerte vaut à partir de l'entier, le trait est posé juste avant
  for (const thr of [fa.alert.sensitive, fa.alert.standard]) {
    const x = X(thr - 0.5);
    o.push(`<line x1="${f1(x)}" y1="${yTop}" x2="${f1(x)}" y2="${yBot}" style="stroke:var(--tsa-a4);stroke-width:2;fill:none;stroke-dasharray:6 4"/>`);
  }

  // Lignes : une par exemple
  fa.examples.forEach((e, i) => {
    const yc = Y_FIRST + PITCH * i;
    o.push(`<text x="8" y="${yc - 4}" font-size="17" font-weight="600" fill="currentColor">${esc(e.mainsStr.model)}</text>`);
    o.push(`<text x="8" y="${yc + 17}" font-size="17" style="fill:var(--tsa-muted)">${esc(t(`/ ${e.crossesStr.model}`, `/ ${e.crossesStr.model}`))}</text>`);
    o.push(`<line x1="${f1(X(e.crosses))}" y1="${yc}" x2="${f1(X(e.mains))}" y2="${yc}" style="stroke:var(--tsa-muted);stroke-width:3;fill:none"/>`);
    o.push(`<circle cx="${f1(X(e.crosses))}" cy="${yc}" r="7" style="fill:var(--tsa-card);stroke:var(--tsa-a2);stroke-width:3.5"/>`);
    o.push(`<rect x="${f1(X(e.mains) - 7)}" y="${yc - 7}" width="14" height="14" style="fill:var(--tsa-a1)"/>`);
    o.push(`<path d="M${f1(X(e.rcs))} ${yc - 11} l11 11 l-11 11 l-11 -11 z" fill="currentColor" style="stroke:var(--tsa-card);stroke-width:2"/>`);
    o.push(`<text x="${f1(X(e.rcs))}" y="${yc - 16}" font-size="17" font-weight="700" text-anchor="middle" fill="currentColor" style="paint-order:stroke;stroke:var(--tsa-card);stroke-width:5px;stroke-linejoin:round">${e.rcs}</text>`);
    o.push(`<text x="${f1(X(e.crosses))}" y="${yc + 25}" font-size="15" text-anchor="middle" style="fill:var(--tsa-muted);paint-order:stroke;stroke:var(--tsa-card);stroke-width:4px;stroke-linejoin:round">${e.crosses}</text>`);
    o.push(`<text x="${f1(X(e.mains))}" y="${yc + 25}" font-size="15" text-anchor="middle" style="fill:var(--tsa-muted);paint-order:stroke;stroke:var(--tsa-card);stroke-width:4px;stroke-linejoin:round">${e.mains}</text>`);
  });

  // Axe
  o.push(`<line x1="${X0}" y1="${Y_AXIS}" x2="${X1}" y2="${Y_AXIS}" style="stroke:var(--tsa-muted);stroke-width:1.5;fill:none"/>`);
  for (let v = 20; v <= 40; v += 5) {
    o.push(`<line x1="${f1(X(v))}" y1="${Y_AXIS}" x2="${f1(X(v))}" y2="${Y_AXIS + 6}" style="stroke:var(--tsa-muted);stroke-width:1.5;fill:none"/>`);
    o.push(`<text x="${f1(X(v))}" y="${Y_AXIS + 26}" font-size="17" text-anchor="middle" style="fill:var(--tsa-muted)">${v}</text>`);
  }
  o.push(`<text x="${f1((X0 + X1) / 2)}" y="${Y_AXIS + 50}" font-size="17" text-anchor="middle" style="fill:var(--tsa-muted)">${t(`Indice de fermeté (RCS), RA${NB}${fa.ra}, ${fa.kg}${NB}kg`, `Firmness index (RCS), RA${NB}${fa.ra}, ${lbIn(fa.kg)}${NB}lb (${fa.kg}${NB}kg)`)}</text>`);

  // Légende
  let y = Y_AXIS + 84;
  o.push(`<rect x="8" y="${y - 12}" width="14" height="14" style="fill:var(--tsa-a1)"/>`);
  o.push(`<text x="30" y="${y}" font-size="17" fill="currentColor">${t('montants seuls', 'mains alone')}</text>`);
  o.push(`<circle cx="${8 + 7 + 196}" cy="${y - 5}" r="7" style="fill:var(--tsa-card);stroke:var(--tsa-a2);stroke-width:3.5"/>`);
  o.push(`<text x="${30 + 196}" y="${y}" font-size="17" fill="currentColor">${t('travers seuls', 'crosses alone')}</text>`);
  o.push(`<path d="M${8 + 11 + 392} ${y - 16} l11 11 l-11 11 l-11 -11 z" fill="currentColor"/>`);
  o.push(`<text x="${30 + 396}" y="${y}" font-size="17" fill="currentColor">${t('hybride (estimation)', 'hybrid (estimate)')}</text>`);
  y += 30;
  o.push(`<line x1="8" y1="${y - 5}" x2="22" y2="${y - 5}" style="stroke:var(--tsa-a4);stroke-width:2;fill:none;stroke-dasharray:6 4"/>`);
  o.push(`<text x="30" y="${y}" font-size="17" fill="currentColor">${t(
    `seuils d'alerte${NB}: dès ${fa.alert.sensitive} (bras sensible déclaré), dès ${fa.alert.standard} (tous profils)`,
    `alert thresholds: from ${fa.alert.sensitive} (declared sensitive arm), from ${fa.alert.standard} (every profile)`,
  )}</text>`);
  o.push(`</g>`);
  o.push(`</svg>`);

  const caption = t(
    `L'hybride tombe entre ses deux cordages montés seuls (raquette de RA${NB}${fa.ra}, ${fa.kg}${NB}kg dans les deux sens). Bandes${NB}: paliers publiés${NB}; traits${NB}: seuils d'alerte bras du configurateur. Estimation dérivée de deux rigidités mesurées, pas une mesure du montage. Graphique Tennis String Advisor, d'après la base du site, état au ${AS_OF.fr}.`,
    `A hybrid lands between its two strings strung on their own (RA${NB}${fa.ra} racquet, ${lbIn(fa.kg)}${NB}lb (${fa.kg}${NB}kg) both ways). Bands: published tiers; dashed lines: the configurator's arm-alert thresholds. An estimate derived from two measured stiffness values, not a measurement of the setup. Chart by Tennis String Advisor, based on the site's database, as of ${AS_OF.en}.`,
  );
  return wrapFigure(o.join('\n'), caption);
}

// ---------------------------------------------------------------------------------------------
// Insertion, contrôle
// ---------------------------------------------------------------------------------------------
const marker = (b: Block, edge: 'debut' | 'fin') =>
  edge === 'debut'
    ? `<!-- figure-hybride:${b}:debut — généré par scripts/blog-covers/build-hybride-figures.mts depuis src/data/ et le moteur de l'indice ; ne pas modifier à la main -->`
    : `<!-- figure-hybride:${b}:fin -->`;

function render(b: Block, lang: Lang, fa: Facts): string {
  if (b === 'schema') return schemaFigure(fa, lang);
  if (b === 'tableau') return tableBlock(fa, lang);
  return chartFigure(fa, lang);
}

function injected(html: string, b: Block) {
  const a = html.indexOf(`<!-- figure-hybride:${b}:debut`);
  const end = marker(b, 'fin');
  const z = html.indexOf(end);
  if (a < 0 || z < a) return null;
  const aEnd = html.indexOf('-->', a) + 3;
  return { before: html.slice(0, aEnd), block: html.slice(aEnd, z), after: html.slice(z) };
}

/** Chiffres du texte qui doivent coller à la base (liste volontairement courte ; voir l'en-tête). */
function expectations(fa: Facts, lang: Lang): { re: RegExp; what: string }[] {
  // une espace du texte peut être une espace insécable ; la casse n'est pas contrôlée (début de phrase)
  const rx = (src: string) => new RegExp(src.replace(/ /g, '(?: |&nbsp;|\\s)+'), 'i');
  const NEVER = /(?!)/;
  const ex = (m: string) => {
    const e = fa.examples.find((x) => x.mainsStr.id === m);
    if (!e) throw new Error(`exemple absent : ${m}`);
    return e;
  };
  const ice = ex('tecnifibre-ice-code');
  const razor = ex('tecnifibre-razor-code');
  const alu = ex('luxilon-alu-power-soft');
  const g = fa.grid, pm = fa.gridPolyMulti, tn = fa.tension;
  // nombres à quatre chiffres : « 1 826 » en FR (espace insécable), « 1,826 » en EN
  const n = (v: number) => (lang === 'fr' ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : v.toLocaleString('en-US'));
  const out: { re: RegExp; what: string }[] = [];
  // le texte dit « 24/22 kg comme 23/23 kg » et « le Razor Code reste à … dans les trois cas »
  if (tn.t2422.rcs !== tn.t2323.rcs) out.push({ re: NEVER, what: 'Ice Code / NRG2 : 24/22 et 23/23 kg ne donnent plus le même indice' });
  if (razor.rcs !== tn.razor2422 || razor.rcs !== tn.razor2323) out.push({ re: NEVER, what: 'Razor Code / X-One Biphase : les trois tensions ne donnent plus le même indice' });
  if (fa.examples.some((e) => e.rcs < Math.min(e.mains, e.crosses) || e.rcs > Math.max(e.mains, e.crosses))) out.push({ re: NEVER, what: 'une estimation sort de ses bornes (« reste entre les deux cordages »)' });
  if (fa.examples.some((e) => level(e.rcs, 'fr') === 'Confortable' || level(e.rcs, 'fr') === 'Très confortable')) out.push({ re: NEVER, what: 'un exemple atteint le palier Confortable (FAQ : « aucun de nos exemples »)' });
  if (lang === 'fr') {
    out.push(
      { re: rx(`l'Ice Code en montants et le NRG2 en travers donnent ${ice.rcs}, palier ${level(ice.rcs, 'fr')}, entre ${ice.mains} pour l'Ice Code seul et ${ice.crosses} pour le NRG2 seul`), what: "L'essentiel : Ice Code / NRG2" },
      { re: rx(`${fa.nMeasured} des ${fa.nStrings} cordages de notre base`), what: 'nombre de cordages mesurés' },
      { re: rx(`sur les ${n(pm.pairs)} hybrides polyester / multifilament`), what: 'grille polyester / multifilament : paires' },
      { re: rx(`l'estimation est de ${pm.dropMin} à ${pm.dropMax} points sous le polyester monté seul, et le palier change dans ${pm.levelVsFull} cas`), what: 'grille polyester / multifilament : baisse et paliers' },
      { re: rx(`sur les ${n(g.pairs)} paires`), what: 'inversion : nombre de paires' },
      { re: rx(`l'indice ne bouge pas ${n(g.diff[0] ?? 0)} fois, d'un point ${n(g.diff[1] ?? 0)} fois, de deux points ${n(g.diff[2] ?? 0)} fois, jamais plus`), what: 'inversion : répartition des écarts' },
      { re: rx(`le palier change dans ${g.levelChanged} cas`), what: 'inversion : paliers changés' },
      { re: rx(`donne ${razor.rcs}, ${level(razor.rcs, 'fr')}, et ${razor.inverse}, ${level(razor.inverse, 'fr')}, à l'envers`), what: 'inversion : Razor Code / X-One Biphase' },
      { re: rx(`l'Ice Code / NRG2 affiche ${tn.t2422.rcs}, pas ${ice.rcs}`), what: 'configurateur à 24/22 kg' },
      { re: rx(`l'Ice Code / NRG2 donne ${tn.t2424.rcs} à 24/24 kg ; il donne ${tn.t2422.rcs} à 24/22 kg comme à 23/23 kg`), what: 'écart de tension : Ice Code / NRG2' },
      { re: rx(`le Razor Code / X-One Biphase reste à ${razor.rcs} dans les trois cas`), what: 'écart de tension : Razor Code / X-One Biphase' },
      { re: rx(`le Razor Code en montants donne ${razor.rcs} \\(${level(razor.rcs, 'fr')}\\) et l'ALU Power Soft ${alu.rcs} \\(${level(alu.rcs, 'fr')}\\), contre ${razor.crosses} \\(${level(razor.crosses, 'fr')}\\) pour le X-One Biphase`), what: 'FAQ : polyester / X-One Biphase' },
    );
  } else {
    out.push(
      { re: rx(`Ice Code in the mains with NRG2 in the crosses gives ${ice.rcs}, ${level(ice.rcs, 'en')} tier, between ${ice.mains} for Ice Code alone and ${ice.crosses} for NRG2 alone`), what: 'Short version : Ice Code / NRG2' },
      { re: rx(`${fa.nMeasured} of the ${fa.nStrings} strings in our database`), what: 'nombre de cordages mesurés' },
      { re: rx(`across the ${n(pm.pairs)} polyester/multifilament hybrids`), what: 'grille polyester / multifilament : paires' },
      { re: rx(`the estimate is ${pm.dropMin} to ${pm.dropMax} points below the polyester on its own, and the tier changes in ${pm.levelVsFull} cases`), what: 'grille polyester / multifilament : baisse et paliers' },
      { re: rx(`across the ${n(g.pairs)} pairs`), what: 'inversion : nombre de paires' },
      { re: rx(`the index stays put ${n(g.diff[0] ?? 0)} times, moves by one point ${n(g.diff[1] ?? 0)} times and by two points ${n(g.diff[2] ?? 0)} times, never more`), what: 'inversion : répartition des écarts' },
      { re: rx(`the tier changes in ${g.levelChanged} cases`), what: 'inversion : paliers changés' },
      { re: rx(`gives ${razor.rcs}, ${level(razor.rcs, 'en')}, and ${razor.inverse}, ${level(razor.inverse, 'en')}, the other way round`), what: 'inversion : Razor Code / X-One Biphase' },
      { re: rx(`Ice Code / NRG2 shows ${tn.t2422.rcs}, not ${ice.rcs}`), what: 'configurateur à 24/22 kg' },
      { re: rx(`Ice Code / NRG2 gives ${tn.t2424.rcs} at 53/53 lb \\(24/24 kg\\), and ${tn.t2422.rcs} at both 53/48.5 lb \\(24/22 kg\\) and 50.7/50.7 lb \\(23/23 kg\\)`), what: 'écart de tension : Ice Code / NRG2' },
      { re: rx(`Razor Code / X-One Biphase stays at ${razor.rcs} in all three cases`), what: 'écart de tension : Razor Code / X-One Biphase' },
      { re: rx(`Razor Code in the mains gives ${razor.rcs} \\(${level(razor.rcs, 'en')}\\) and ALU Power Soft ${alu.rcs} \\(${level(alu.rcs, 'en')}\\), against ${razor.crosses} \\(${level(razor.crosses, 'en')}\\) for X-One Biphase`), what: 'FAQ : polyester / X-One Biphase' },
    );
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const fa = computeFacts();

  if (args.includes('--facts')) {
    const { examples, ...rest } = fa;
    console.log(JSON.stringify({
      ...rest,
      examples: examples.map((e) => `${label(e.mainsStr)} (${e.mainsStr.stiffness}) / ${label(e.crossesStr)} (${e.crossesStr.stiffness}) : ${e.rcs} ${level(e.rcs, 'fr')} [montants seuls ${e.mains}, travers seuls ${e.crosses}] ; inverse ${e.inverse} ${level(e.inverse, 'fr')}`),
    }, null, 2));
    return;
  }

  const pv = args.indexOf('--preview');
  if (pv !== -1) {
    const dir = args[pv + 1];
    if (!dir) throw new Error('--preview <dossier>');
    mkdirSync(dir, { recursive: true });
    const css = readFileSync(join(ROOT, 'public/blog/blog-figures.css'), 'utf8');
    for (const theme of ['clair', 'sombre'] as const) {
      const body = (['fr', 'en'] as const).flatMap((lang) => BLOCKS.map((b) => `<h3 style="font:600 14px system-ui;margin:24px 0 4px">${b} · ${lang}</h3><div style="max-width:${args.includes('--mobile') ? 358 : 800}px">${render(b, lang, fa)}</div>`)).join('\n');
      const page = `<!doctype html><html lang="fr" class="${theme === 'sombre' ? 'dark' : ''}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}\nbody{margin:16px;font-family:system-ui;background:${theme === 'sombre' ? '#111827' : '#f9fafb'};color:${theme === 'sombre' ? '#f3f4f6' : '#1f2937'}}</style></head><body>${body}</body></html>`;
      writeFileSync(join(dir, `apercu-${theme}.html`), page);
    }
    console.log(`aperçus écrits dans ${dir}`);
    return;
  }

  const check = args.includes('--check');
  let problems = 0;
  for (const tg of TARGETS) {
    const path = join(ROOT, tg.file);
    const raw = readFileSync(path, 'utf8');
    const crlf = raw.includes('\r\n');
    let html = raw.replace(/\r\n/g, '\n');
    for (const b of BLOCKS) {
      const parts = injected(html, b);
      if (!parts) {
        console.log(`  ECHEC ${tg.file} : repères figure-hybride:${b} absents`);
        problems++;
        continue;
      }
      const indent = (parts.block.match(/\n([ \t]*)$/) ?? ['', ''])[1];
      const block = `\n${render(b, tg.lang, fa)}\n${indent}`;
      if (check) {
        if (parts.block !== block) {
          console.log(`  ECHEC ${tg.file} : le bloc « ${b} » ne correspond plus à la base — relancer le script sans --check`);
          problems++;
        } else console.log(`  OK    ${tg.file} : bloc « ${b} » conforme à la base`);
      } else html = parts.before + block + parts.after;
    }
    if (check) {
      for (const e of expectations(fa, tg.lang)) {
        if (!e.re.test(html)) {
          console.log(`  ECHEC ${tg.file} : ${e.what} ne colle plus à la base (attendu : ${e.re.source})`);
          problems++;
        }
      }
    } else {
      writeFileSync(path, crlf ? html.replace(/\n/g, '\r\n') : html);
      console.log(`  écrit ${tg.file} : ${BLOCKS.length} blocs (${fa.examples.length} exemples)`);
    }
  }
  if (check) console.log(problems === 0 ? '\nblocs et chiffres du texte conformes à la base' : `\n${problems} écart(s) avec la base`);
  process.exit(problems === 0 ? 0 : 1);
}

main();
