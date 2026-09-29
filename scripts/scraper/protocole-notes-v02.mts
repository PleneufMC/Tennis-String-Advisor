/**
 * Prototype du protocole de notes base 100 — proposition v0.2 (29/09/2026).
 *
 * Six critères attendus par le joueur : Confort, Puissance, Contrôle, Effet,
 * Durabilité, Tenue de tension. Chaque critère est un MODÈLE PUBLIÉ (entrées,
 * sens, poids fixés a priori, voir MODELE ci-dessous) ; chaque note porte un
 * statut (« Mesurée » / « Estimée (modèle TSA v0.2) » / « Non publié ») et un
 * niveau de confiance (3 = ●●●, 2 = ●●○, 1 = ●○○).
 *
 * HORS SITE : lit src/data en lecture seule, les relevés TWU et l'appariement
 * v0.1 de scripts/scraper/out/, et n'écrit QUE dans scripts/scraper/out/.
 * Ne touche ni au RCS, ni aux alertes, ni à l'UI.
 *
 * Prérequis :
 *   node scripts/scraper/twu-fetch-protocol.mjs
 *   npx --yes tsx scripts/scraper/protocole-notes-base100.mts   (appariement)
 * Exécution :
 *   npx --yes tsx scripts/scraper/protocole-notes-v02.mts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { stringsDatabase, type TennisString } from '../../src/data/strings-database.ts';

const OUT = fileURLToPath(new URL('./out/', import.meta.url));
const VERSION = '0.2-proposition';

type Row = Record<string, any>;
const ref = JSON.parse(readFileSync(`${OUT}twu-protocol-ref.json`, 'utf8'));
const TWU: Row[] = ref.conditions.find((c: any) => c.isReference).records;
const TWU_DATE: string = ref.fetchedAt;
const app = JSON.parse(readFileSync(`${OUT}protocole-appariement.json`, 'utf8'));

// ------------------------------------------------------------------ outils
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const sd = (xs: number[]) => {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
};
const ranks = (xs: number[]) => {
  const idx = xs.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]);
  const r = new Array(xs.length);
  for (let i = 0; i < idx.length; ) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r as number[];
};
const pearson = (a: number[], b: number[]) => {
  const n = a.length, ma = a.reduce((s, v) => s + v, 0) / n, mb = b.reduce((s, v) => s + v, 0) / n;
  let x = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) { x += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; }
  return x / Math.sqrt(da * db);
};
const spearman = (a: number[], b: number[]) => (a.length < 3 ? null : pearson(ranks(a), ranks(b)));
const r2 = (x: number | null) => (x === null || x === undefined || Number.isNaN(x) ? null : Math.round(x * 100) / 100);
const round5 = (x: number) => Math.round(x / 5) * 5;

// ------------------------------------------------ grandeurs mesurées (TWU)
// Chaque grandeur : lecture sur une ligne TWU. Valeur <= 0 ou null = absente.
const MEASURES: Record<string, (r: Row) => number | null> = {
  rigidite: (r) => r.stiffnessLbIn,
  forceMax: (r) => r.peakForceLbs,
  deflexion: (r) => r.deflectionMm,
  dureeImpact: (r) => r.dwellTimeMs,
  effet: (r) => r.spinPotential,
  tensionConservee: (r) => (r.tensionLossPct === null ? null : 100 - r.tensionLossPct),
};
const ok = (v: any) => typeof v === 'number' && v > 0;

// Références figées de la version : médiane et écart-type de ln(x) sur la
// population TWU entière (51 lbs / Fast, tous matériaux).
const REF: Record<string, { mediane: number; sdLog: number; n: number }> = {};
for (const [k, f] of Object.entries(MEASURES)) {
  const v = TWU.map(f).filter(ok) as number[];
  REF[k] = { mediane: median(v), sdLog: sd(v.map(Math.log)), n: v.length };
}
// Dispersion commune de tous les indices : celle de la rigidité (ln). Ainsi un
// critère composite a la même « amplitude » qu'un rapport de rigidités.
const SIGMA_COMMUNE = REF.rigidite.sdLog;

// ------------------------------------------------------------------ modèle
// sens : +1 = la grandeur haute augmente le critère ; -1 = la diminue.
// Poids fixés A PRIORI (justification dans le document), somme = 1.
type Input = { mesure: string; sens: 1 | -1; poids: number; justification: string };
type Crit = {
  label: string;
  entrees: Input[];
  directe?: boolean; // une seule entrée = note « Mesurée »
  seuilPoids: number; // part minimale du poids disponible pour publier
  confianceMax?: number; // plafond quand le lien physique est contesté
};
export const MODELE: Record<string, Crit> = {
  confort: {
    label: 'Confort',
    entrees: [
      { mesure: 'forceMax', sens: -1, poids: 0.5, justification: '« An increase in string stiffness also results in an increase in the force and torque on the hand » (Cross, Impact forces…) ; force max. = choc (TWU)' },
      { mesure: 'rigidite', sens: -1, poids: 0.5, justification: 'rigidité dynamique : « higher stiffness means … less comfort » (TWU, Lindsey)' },
    ],
    seuilPoids: 1,
  },
  puissance: {
    label: 'Puissance',
    entrees: [
      { mesure: 'deflexion', sens: 1, poids: 0.5, justification: 'énergie stockée dans le cordage plutôt que perdue dans la balle (TWU, Lindsey) — effet faible selon Cross et al. 2000' },
      { mesure: 'rigidite', sens: -1, poids: 0.5, justification: '« higher stiffness means … less power » (TWU, Lindsey)' },
    ],
    seuilPoids: 1,
    // Cross et al. 2000 : « almost no difference in the speed of a ball rebounding off gut or polyester strings »
    confianceMax: 2,
  },
  controle: {
    label: 'Contrôle',
    entrees: [
      { mesure: 'dureeImpact', sens: -1, poids: 0.5, justification: '« the rotation angle is proportional to the impact duration » (Cross et al. 2000) ; « less time on the strings » (TWU, Lindsey)' },
      { mesure: 'rigidite', sens: 1, poids: 0.5, justification: '« higher stiffness means more control » (TWU, Lindsey)' },
    ],
    seuilPoids: 1,
  },
  effet: {
    label: 'Effet',
    entrees: [{ mesure: 'effet', sens: 1, poids: 1, justification: 'Spin Potential TWU = friction cordage-balle / friction cordage-cordage' }],
    directe: true,
    seuilPoids: 1,
  },
  tenue: {
    label: 'Tenue de tension',
    entrees: [{ mesure: 'tensionConservee', sens: 1, poids: 1, justification: '100 − perte de tension TWU (%)' }],
    directe: true,
    seuilPoids: 1,
  },
};

// Score standardisé d'une ligne TWU pour un critère (null si seuil non atteint).
function scoreZ(r: Row, c: Crit, poids?: number[]) {
  let z = 0, wDispo = 0;
  c.entrees.forEach((e, i) => {
    const w = poids ? poids[i] : e.poids;
    const v = MEASURES[e.mesure](r);
    if (!ok(v)) return;
    z += w * e.sens * (Math.log(v as number / REF[e.mesure].mediane) / REF[e.mesure].sdLog);
    wDispo += w;
  });
  const wTot = poids ? poids.reduce((a, b) => a + b, 0) : c.entrees.reduce((a, e) => a + e.poids, 0);
  if (wDispo / wTot < c.seuilPoids - 1e-9) return null;
  return z / wDispo;
}
// Normalisation figée : écart-type et médiane du score composite sur la population TWU.
const NORM: Record<string, { med: number; sd: number }> = {};
for (const [k, c] of Object.entries(MODELE)) {
  const zs = TWU.map((r) => scoreZ(r, c)).filter((v): v is number => v !== null);
  NORM[k] = { med: median(zs), sd: sd(zs) };
}
const toIndex = (k: string, z: number) => 100 * Math.exp(SIGMA_COMMUNE * ((z - NORM[k].med) / NORM[k].sd));

// ------------------------------------------------------ appariements v0.1
const byName = new Map<string, Row>();
for (const r of TWU) if (!byName.has(r.name)) byName.set(r.name, r);
const matches = (app.matches as any[]).map((m) => ({ ...m, twu: byName.get(m.twuName)! }));

// ------------------------------------------------------------------ notes
const CRITS = [...Object.keys(MODELE), 'durabilite'];
type Note = { statut: string; indice?: number; rang?: number; classe?: string; affiche?: number; confiance?: number; entrees?: any; raison?: string };
function noteMesuree(k: string, twu: Row, gaugeFromLabel: boolean): Note {
  const c = MODELE[k];
  const z = scoreZ(twu, c);
  if (z === null) return { statut: 'Non publié', raison: 'entrée mesurée manquante' };
  const idx = toIndex(k, z);
  return {
    statut: c.directe ? 'Mesurée' : 'Estimée (modèle TSA v0.2)',
    indice: Math.round(idx),
    affiche: round5(idx),
    confiance: Math.min(gaugeFromLabel ? 2 : 3, c.confianceMax ?? 3),
    entrees: Object.fromEntries(c.entrees.map((e) => [e.mesure, MEASURES[e.mesure](twu)])),
  };
}

// Durabilité : branchée plus bas (DURABILITE), estimée par construction.
import { DURABILITE } from './protocole-durabilite-v02.mts';

const notes = matches.map((m) => {
  const s = stringsDatabase.find((x) => x.id === m.stringId)!;
  const gaugeFromLabel = !m.twu.gaugeNominalMm;
  const n: Record<string, Note> = {};
  for (const k of Object.keys(MODELE)) n[k] = noteMesuree(k, m.twu, gaugeFromLabel);
  n.durabilite = DURABILITE.noter(s, m.gauge);
  return { stringId: s.id, brand: s.brand, model: s.model, type: s.type, gauge: m.gauge, twuName: m.twu.name, notes: n };
});

// Fiches sans mesure appariée : seule la durabilité (estimée) peut exister, par jauge de la fiche.
const covered = new Set(matches.map((m) => m.stringId));
const notesSansMesure = stringsDatabase
  .filter((s) => !covered.has(s.id))
  .flatMap((s) => s.gauges.map((g) => ({
    stringId: s.id, brand: s.brand, model: s.model, type: s.type, gauge: g, twuName: null,
    notes: {
      ...Object.fromEntries(Object.keys(MODELE).map((k) => [k, { statut: 'Non publié', raison: 'aucune mesure appariée' }])),
      durabilite: DURABILITE.noter(s, g),
    } as Record<string, Note>,
  })));
const toutes = [...notes, ...notesSansMesure];

// ------------------------------------------------------------- couverture
// Scénario A : usage TWU autorisé. Scénario B : refus -> aucune entrée TWU.
const types = ['Polyester', 'Multifilament', 'Synthetic', 'Natural Gut', 'Hybrid'];
const couverture = (scen: 'A' | 'B') => {
  const res: any = {};
  for (const k of CRITS) {
    const ids = new Set(
      toutes.filter((x) => {
        const n = x.notes[k];
        if (n.statut === 'Non publié') return false;
        if (scen === 'B' && k !== 'durabilite') return false; // toutes les autres notes reposent sur TWU
        if (scen === 'B' && k === 'durabilite' && n.entrees?.utiliseTWU) return false;
        return true;
      }).map((x) => x.stringId),
    );
    res[k] = { total: ids.size, parType: Object.fromEntries(types.map((t) => [t, stringsDatabase.filter((s) => s.type === t && ids.has(s.id)).length])) };
  }
  return res;
};

// ------------------------------------------ distinction entre critères
// Durabilité : rang de classe (0, 1, 2) à la place d'un indice.
const val = (n: Note) => n.indice ?? n.rang;
const pairsOf = (a: string, b: string) => {
  const p = notes.filter((x) => val(x.notes[a]) !== undefined && val(x.notes[b]) !== undefined);
  return { n: p.length, spearman: r2(spearman(p.map((x) => val(x.notes[a])!), p.map((x) => val(x.notes[b])!))) };
};
const distinction: any = {};
for (let i = 0; i < CRITS.length; i++) for (let j = i + 1; j < CRITS.length; j++) distinction[`${CRITS[i]}~${CRITS[j]}`] = pairsOf(CRITS[i], CRITS[j]);

// ------------------------------------------------- sensibilité des poids
// Chaque poids d'un critère composite varie de -20 % puis +20 % (les autres
// renormalisés). On compte : paires de cordages dont l'ordre s'inverse, et
// notes affichées (arrondies à 5) qui changent.
const sensibilite: any = {};
for (const [k, c] of Object.entries(MODELE)) {
  if (c.entrees.length < 2) continue;
  const base = notes.map((x) => scoreZ(x.twu ?? matches.find((m) => m.stringId === x.stringId && m.gauge === x.gauge)!.twu, c));
  const rows: any[] = [];
  c.entrees.forEach((e, i) => {
    for (const f of [0.8, 1.2]) {
      const w = c.entrees.map((x, j) => (j === i ? x.poids * f : x.poids));
      const sum = w.reduce((a, b) => a + b, 0);
      const wn = w.map((x) => x / sum);
      let inv = 0, tot = 0, chg = 0;
      const alt = notes.map((x) => scoreZ(matches.find((m) => m.stringId === x.stringId && m.gauge === x.gauge)!.twu, c, wn));
      // renormaliser l'alternative avec sa propre dispersion population
      const zsPop = TWU.map((r) => scoreZ(r, c, wn)).filter((v): v is number => v !== null);
      const med = median(zsPop), s = sd(zsPop);
      for (let a = 0; a < base.length; a++) {
        if (base[a] === null || alt[a] === null) continue;
        const shown = round5(toIndex(k, base[a]!));
        const shownAlt = round5(100 * Math.exp(SIGMA_COMMUNE * ((alt[a]! - med) / s)));
        if (shown !== shownAlt) chg++;
        for (let b = a + 1; b < base.length; b++) {
          if (base[b] === null || alt[b] === null) continue;
          tot++;
          if (Math.sign(base[a]! - base[b]!) * Math.sign(alt[a]! - alt[b]!) < 0) inv++;
        }
      }
      rows.push({ entree: e.mesure, facteur: f, paires_inversees_pct: r2((100 * inv) / tot), notes_affichees_changees: chg, sur: base.filter((v) => v !== null).length });
    }
  });
  sensibilite[k] = rows;
}

// --------------------------------------------- cas contre-intuitifs
// Un polyester plus confortable (ou puissant) que la médiane des multifilaments.
const med = (t: string, k: string) => median(notes.filter((x) => x.type === t && x.notes[k].indice !== undefined).map((x) => x.notes[k].indice!));
const contre: any = {};
for (const k of ['confort', 'puissance']) {
  const mMulti = med('Multifilament', k);
  contre[k] = {
    mediane_multifilament: mMulti,
    mediane_polyester: med('Polyester', k),
    polyesters_au_dessus_mediane_multi: notes.filter((x) => x.type === 'Polyester' && (x.notes[k].indice ?? 0) > mMulti)
      .map((x) => ({ id: x.stringId, gauge: x.gauge, indice: x.notes[k].indice, entrees: x.notes[k].entrees })),
    multis_sous_mediane_poly: notes.filter((x) => x.type === 'Multifilament' && (x.notes[k].indice ?? 999) < med('Polyester', k))
      .map((x) => ({ id: x.stringId, gauge: x.gauge, indice: x.notes[k].indice, entrees: x.notes[k].entrees })),
  };
}
{
  const mPoly = med('Polyester', 'controle');
  contre.controle = {
    mediane_polyester: mPoly, mediane_multifilament: med('Multifilament', 'controle'),
    multis_au_dessus_mediane_poly: notes.filter((x) => x.type === 'Multifilament' && (x.notes.controle.indice ?? 0) > mPoly)
      .map((x) => ({ id: x.stringId, gauge: x.gauge, indice: x.notes.controle.indice, entrees: x.notes.controle.entrees })),
  };
}

// --------------------------------------------- distributions par famille
const dist: any = {};
for (const k of CRITS) {
  dist[k] = {};
  for (const t of ['Polyester', 'Multifilament', 'Synthetic', 'Natural Gut']) {
    const v = toutes.filter((x) => x.type === t && x.notes[k].indice !== undefined).map((x) => x.notes[k].indice!);
    if (v.length) dist[k][t] = { n: v.length, min: Math.min(...v), mediane: median(v), max: Math.max(...v) };
  }
}
const classesDurabilite: any = {};
for (const t of types) {
  const v = toutes.filter((x) => x.type === t && x.notes.durabilite.classe);
  if (v.length) classesDurabilite[t] = Object.fromEntries(['Moins durable', 'Standard', 'Plus durable'].map((c) => [c, v.filter((x) => x.notes.durabilite.classe === c).length]));
}

// --------------------------------------------- comparaison notes /10 actuelles
const cur: any = {};
for (const [k, f] of [['confort', 'comfort'], ['puissance', 'power'], ['controle', 'control'], ['effet', 'spin'], ['durabilite', 'durability']] as const) {
  const byId = new Map<string, number[]>();
  for (const x of toutes) if (val(x.notes[k]) !== undefined) byId.set(x.stringId, [...(byId.get(x.stringId) ?? []), val(x.notes[k])!]);
  const p = [...byId.entries()].map(([id, v]) => [v.reduce((a, b) => a + b, 0) / v.length, (stringsDatabase.find((s) => s.id === id) as any)[f]]).filter((q) => typeof q[1] === 'number');
  cur[k] = { n: p.length, spearman: r2(spearman(p.map((q) => q[0]), p.map((q) => q[1]))) };
}

// ------------------------------------------------------------ exemples
const EX = ['luxilon-alu-power', 'babolat-rpm-blast', 'solinco-hyper-g', 'wilson-nxt', 'babolat-touch-vs', 'toroline-o-toro',
  'tecnifibre-x-one-biphase', 'yonex-poly-tour-pro', 'luxilon-4g', 'head-lynx-tour', 'tecnifibre-razor-code', 'solinco-tour-bite', 'wilson-natural-gut'];
const exemples = EX.map((id) => ({ id, lignes: toutes.filter((x) => x.stringId === id) }));

const out = {
  version: VERSION, twu: { releve: TWU_DATE, lignes: TWU.length },
  references_figees: { ...REF, sigma_commune: SIGMA_COMMUNE, normalisation: NORM },
  modele: MODELE, durabilite_modele: DURABILITE.description,
  couverture: { A: couverture('A'), B: couverture('B'), total: stringsDatabase.length },
  distinction, sensibilite, contre_intuitifs: contre, distributions: dist, classesDurabilite, notes10: cur, exemples,
};
writeFileSync(`${OUT}protocole-v02-notes.json`, JSON.stringify({ version: VERSION, notes: toutes }, null, 1));
writeFileSync(`${OUT}protocole-v02-stats.json`, JSON.stringify(out, null, 1));
console.log(`Protocole ${VERSION} — ${notes.length} (fiche, jauge) mesurées, ${notesSansMesure.length} sans mesure`);
console.log('Couverture A :', JSON.stringify(Object.fromEntries(Object.entries(out.couverture.A).map(([k, v]: any) => [k, v.total]))));
console.log('Couverture B :', JSON.stringify(Object.fromEntries(Object.entries(out.couverture.B).map(([k, v]: any) => [k, v.total]))));
console.log('Distinction :', JSON.stringify(distinction));
console.log('Notes /10 :', JSON.stringify(cur));
console.log('-> out/protocole-v02-notes.json, out/protocole-v02-stats.json');
