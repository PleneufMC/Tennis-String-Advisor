/**
 * Prototype du protocole de notes base 100 (proposition v0.1, 29/09/2026).
 *
 * HORS SITE : ce script lit `src/data/strings-database.ts` en lecture seule et
 * les relevés TWU de `scripts/scraper/out/`, et n'écrit QUE dans
 * `scripts/scraper/out/`. Il ne touche ni au RCS, ni aux alertes, ni à l'UI.
 *
 * Entrées :
 *   out/twu-protocol-ref.json             (node scripts/scraper/twu-fetch-protocol.mjs)
 *   out/twu-protocol-all-conditions.json  (idem avec --all-conditions ; optionnel)
 *
 * Sorties :
 *   out/protocole-appariement.json  appariements (modèle, jauge) exacts + quarantaine
 *   out/protocole-notes-v0.1.json   notes par (fiche, jauge) avec provenance
 *   out/protocole-stats.json        couverture, distributions, conventions, validations
 *
 * Exécution : npx --yes tsx scripts/scraper/protocole-notes-base100.mts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { stringsDatabase, type TennisString } from '../../src/data/strings-database.ts';

const OUT = fileURLToPath(new URL('./out/', import.meta.url));
const PROTOCOL_VERSION = '0.1-proposition';

type TwuRow = {
  name: string;
  material: string | null;
  gaugeNominalMm: number | null;
  stiffnessLbIn: number | null;
  tensionLossPct: number | null;
  spinPotential: number | null;
  energyReturnPct: number | null;
  dwellTimeMs: number | null;
  stringToStringCof: number | null;
  stringToBallCof: number | null;
  gaugeSource?: string;
};

const refFile = JSON.parse(readFileSync(`${OUT}twu-protocol-ref.json`, 'utf8'));
const refCond = refFile.conditions.find((c: any) => c.isReference);
const TWU: TwuRow[] = refCond.records;
const TWU_FETCHED_AT: string = refFile.fetchedAt;

// ---------------------------------------------------------------- utilitaires
const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const quantile = (xs: number[], p: number) => {
  const s = [...xs].sort((a, b) => a - b);
  const i = (s.length - 1) * p;
  const lo = Math.floor(i);
  return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (i - lo);
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
  const n = a.length;
  const ma = a.reduce((s, v) => s + v, 0) / n;
  const mb = b.reduce((s, v) => s + v, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return num / Math.sqrt(da * db);
};
const spearman = (a: number[], b: number[]) => (a.length < 3 ? null : pearson(ranks(a), ranks(b)));
const r2 = (x: number | null) => (x === null ? null : Math.round(x * 100) / 100);
const gaugeKey = (mm: number) => mm.toFixed(2);

// ------------------------------------------------- analyse des noms TWU
const CATALOG_BRANDS = [...new Set(stringsDatabase.map((s) => s.brand))];
function parseTwuName(name: string) {
  let n = name;
  n = n.replace(/\(\s*\d\.\d+\s*(mm)?\s*\)/gi, ' '); // (1.30)
  n = n.replace(/\b1[0-4]\d\s*\/\s*1[5-9]L?\b/g, ' '); // 125/16L (notation Luxilon)
  n = n.replace(/\b1[5-9]L?\s*\/\s*\d\.\d+\b/gi, ' '); // 17/1.25
  n = n.replace(/\b\d\.\d+\s*(mm)?\b/gi, ' '); // 1.25
  const withAwg = n;
  n = n.replace(/\b(1[5-9]|2[0-1])L?\b/g, ' '); // 16, 16L, 17…
  const brand = CATALOG_BRANDS.find((b) => norm(name).startsWith(norm(b))) ?? null;
  const strip = (s: string) => {
    if (!brand) return norm(s);
    const ns = norm(s);
    return ns.startsWith(norm(brand)) ? ns.slice(norm(brand).length) : ns;
  };
  const tokens = (x: string) => {
    const t = x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const b = brand ? brand.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean) : [];
    return t.filter((w) => !b.includes(w)).sort().join(' ');
  };
  // Jauge lue dans le libellé TWU lui-même, pour les lignes dont la colonne est vide.
  const gm = name.match(/\(\s*(\d\.\d+)\s*\)|\b1[5-9]L?\s*\/\s*(\d\.\d+)|\b(1[0-4]\d)\s*\/\s*1[5-9]L?\b|\b(\d\.\d\d)\b/);
  const gaugeFromLabel = gm ? Number(gm[1] ?? gm[2] ?? (gm[3] ? Number(gm[3]) / 100 : gm[4])) : null;
  return { brand, modelNorm: strip(n), modelNormWithAwg: strip(withAwg), tokenSet: tokens(n), gaugeFromLabel };
}

// Cohérence matériau TWU / type catalogue (sinon doute d'identité -> quarantaine).
const MATERIAL_OK: Record<TennisString['type'], (m: string) => boolean> = {
  Polyester: (m) => /Polyester|Polyolefin/.test(m) && !/^Nylon/.test(m),
  Multifilament: (m) => /^Nylon/.test(m),
  Synthetic: (m) => /^Nylon/.test(m),
  'Natural Gut': (m) => m === 'Gut',
  Hybrid: () => false,
  Biodegradable: () => true,
};

// ------------------------------------------------------------ appariement
type Match = { stringId: string; gauge: string; twu: TwuRow };
const matches: Match[] = [];
const quarantine: any[] = [];
const parsed = TWU.map((r) => ({ r, p: parseTwuName(r.name) }));

for (const s of stringsDatabase) {
  const mNorm = norm(s.model);
  const bNorm = norm(s.brand);
  const mTokens = s.model.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).sort().join(' ');
  const exact = parsed.filter(
    ({ p }) => p.brand && norm(p.brand) === bNorm && (p.modelNorm === mNorm || p.modelNormWithAwg === mNorm),
  );
  const near = parsed.filter(
    ({ p }) =>
      p.brand && norm(p.brand) === bNorm && !exact.some((e) => e.p === p) &&
      p.modelNorm.length > 0 &&
      (p.tokenSet === mTokens ||
        ((p.modelNorm.startsWith(mNorm) || mNorm.startsWith(p.modelNorm) || p.modelNorm.endsWith(mNorm)) &&
          Math.abs(p.modelNorm.length - mNorm.length) <= 10)),
  );
  for (const { r, p } of near)
    quarantine.push({
      stringId: s.id, twuName: r.name,
      reason: p.tokenSet === mTokens ? 'mêmes mots, ordre différent (à valider)' : 'nom proche mais non identique (variante possible)',
    });
  if (s.type === 'Hybrid') {
    for (const { r } of exact) quarantine.push({ stringId: s.id, twuName: r.name, reason: 'fiche hybride' });
    continue;
  }
  const byGauge = new Map<string, TwuRow[]>();
  for (const { r: r0, p } of exact) {
    let r = r0;
    if (r.gaugeNominalMm === null && p.gaugeFromLabel !== null) {
      // Colonne vide mais jauge écrite dans le libellé TWU : on la reprend, marquée.
      r = { ...r, gaugeNominalMm: p.gaugeFromLabel, gaugeSource: 'libellé TWU' } as TwuRow;
    }
    if (r.gaugeNominalMm === null) {
      quarantine.push({ stringId: s.id, twuName: r.name, reason: 'jauge TWU non renseignée' });
      continue;
    }
    if (r.gaugeNominalMm > 2) {
      quarantine.push({ stringId: s.id, twuName: r.name, reason: `jauge TWU aberrante (${r.gaugeNominalMm} : calibre AWG saisi à la place des mm ?)` });
      continue;
    }
    if (r.material && !MATERIAL_OK[s.type](r.material)) {
      quarantine.push({ stringId: s.id, twuName: r.name, reason: `matériau TWU « ${r.material} » incohérent avec le type « ${s.type} »` });
      continue;
    }
    const g = gaugeKey(r.gaugeNominalMm);
    if (!s.gauges.includes(g)) {
      quarantine.push({ stringId: s.id, twuName: r.name, reason: `jauge TWU ${g} absente de la fiche (${s.gauges.join(', ')})` });
      continue;
    }
    byGauge.set(g, [...(byGauge.get(g) ?? []), r]);
  }
  for (const [g, rows] of byGauge) {
    const same = rows.every((x) => JSON.stringify({ ...x, name: '' }) === JSON.stringify({ ...rows[0], name: '' }));
    if (rows.length > 1 && !same) {
      quarantine.push({ stringId: s.id, gauge: g, twuNames: rows.map((x) => x.name), reason: 'plusieurs mesures TWU divergentes pour la même (modèle, jauge)' });
      continue;
    }
    matches.push({ stringId: s.id, gauge: g, twu: rows[0] });
  }
}

// Une ligne TWU appariée exactement à une AUTRE fiche n'est pas un doute pour
// celle-ci (ex. « RPM Blast Rough » vu depuis la fiche « RPM Blast ») : on la
// retire de la quarantaine « nom proche ». Idem pour une ligne dont le nom
// réduit correspond exactement à un autre modèle du catalogue de la même marque.
{
  const exactNames = new Set(matches.map((m) => m.twu.name));
  const catalogKeys = new Set(stringsDatabase.map((s) => norm(s.brand) + '|' + norm(s.model)));
  for (let i = quarantine.length - 1; i >= 0; i--) {
    const q = quarantine[i];
    if (!q.reason.startsWith('nom proche')) continue;
    const p = parseTwuName(q.twuName);
    const otherModel = p.brand && [p.modelNorm, p.modelNormWithAwg].some((m) => catalogKeys.has(norm(p.brand!) + '|' + m));
    if (exactNames.has(q.twuName) || otherModel) quarantine.splice(i, 1);
  }
}

// ------------------------------------------ conventions de la base 100
// Grandeurs brutes. Sens : + = plus la grandeur est haute, meilleur le critère.
const CRITERIA = {
  souplesse: { label: 'Souplesse (confort / puissance ↔ contrôle)', get: (r: TwuRow) => r.stiffnessLbIn, dir: -1 },
  spin: { label: 'Potentiel d’effet', get: (r: TwuRow) => r.spinPotential, dir: +1 },
  tenue: { label: 'Tenue de tension', get: (r: TwuRow) => (r.tensionLossPct === null ? null : 100 - r.tensionLossPct), dir: +1 },
} as const;
type Crit = keyof typeof CRITERIA;
const CRITS = Object.keys(CRITERIA) as Crit[];

const vals = (rows: TwuRow[], c: Crit) =>
  rows.map((r) => CRITERIA[c].get(r)).filter((v): v is number => v !== null && v > 0);

// (a) 100 = médiane des cordages du catalogue mesurés (une valeur par (fiche, jauge))
// (a') 100 = médiane de la population TWU entière (788 mesures, 51 lbs / Fast) — RECOMMANDÉE, figée par version
// (b) 100 = cordage de référence nommé
// (c) percentile 0-100 dans la population TWU
const REF_NAMED = { stringId: 'luxilon-alu-power', gauge: '1.25' };
const refNamedRow = matches.find((m) => m.stringId === REF_NAMED.stringId && m.gauge === REF_NAMED.gauge)?.twu ?? null;

const base: Record<string, Record<Crit, number | null>> = { a: {} as any, aPrime: {} as any, b: {} as any };
for (const c of CRITS) {
  base.a[c] = median(vals(matches.map((m) => m.twu), c));
  base.aPrime[c] = median(vals(TWU, c));
  base.b[c] = refNamedRow ? CRITERIA[c].get(refNamedRow) : null;
}
const index = (x: number, ref: number, dir: number) => (dir > 0 ? (100 * x) / ref : (100 * ref) / x);
const popSorted = Object.fromEntries(CRITS.map((c) => [c, vals(TWU, c).sort((a, b) => a - b)])) as Record<Crit, number[]>;
const percentile = (x: number, c: Crit) => {
  const s = popSorted[c];
  const below = s.filter((v) => v < x).length;
  const eq = s.filter((v) => v === x).length;
  const p = (100 * (below + eq / 2)) / s.length;
  return CRITERIA[c].dir > 0 ? p : 100 - p;
};

// ------------------------------------------------------------ notes
const notes = matches.map((m) => {
  const s = stringsDatabase.find((x) => x.id === m.stringId)!;
  const crit: any = {};
  for (const c of CRITS) {
    const raw = CRITERIA[c].get(m.twu);
    if (raw === null || raw <= 0) {
      crit[c] = { statut: 'absent', raison: 'grandeur non publiée par TWU pour cette mesure' };
      continue;
    }
    crit[c] = {
      statut: 'mesuré (TWU)',
      brut: raw,
      indice_recommande: Math.round(index(raw, base.aPrime[c]!, CRITERIA[c].dir)),
      variante_a_mediane_catalogue: Math.round(index(raw, base.a[c]!, CRITERIA[c].dir)),
      variante_b_reference_nommee: base.b[c] ? Math.round(index(raw, base.b[c]!, CRITERIA[c].dir)) : null,
      variante_c_percentile: Math.round(percentile(raw, c)),
    };
  }
  return {
    stringId: m.stringId, brand: s.brand, model: s.model, type: s.type, gauge: m.gauge,
    twuName: m.twu.name, twuMaterial: m.twu.material,
    criteres: crit,
    // Critères sans indicateur mesuré : jamais comblés.
    durabilite: { statut: 'absent', raison: 'aucune mesure labo ; voir sources tierces' },
    provenance: {
      source: 'TWU reporter2.php, POST, 51 lbs, Fast, tous matériaux',
      releve: TWU_FETCHED_AT,
      protocole: PROTOCOL_VERSION,
      confiance: 'mesure unique TWU, incertitude non publiée',
    },
  };
});

// ------------------------------------------------------------ couverture
const coveredIds = new Set(matches.map((m) => m.stringId));
const byKey = (k: 'brand' | 'type') => {
  const out: Record<string, { total: number; publiable: number }> = {};
  for (const s of stringsDatabase) {
    out[s[k]] ??= { total: 0, publiable: 0 };
    out[s[k]].total++;
    if (coveredIds.has(s.id)) out[s[k]].publiable++;
  }
  return Object.fromEntries(Object.entries(out).sort((a, b) => b[1].total - a[1].total));
};
const perCrit = Object.fromEntries(
  CRITS.map((c) => [c, new Set(notes.filter((n) => n.criteres[c].statut !== 'absent').map((n) => n.stringId)).size]),
);

// ------------------------------------------------ distributions
const dist = (xs: number[]) => ({
  n: xs.length, min: Math.min(...xs), p10: r2(quantile(xs, 0.1)), p25: r2(quantile(xs, 0.25)),
  mediane: r2(median(xs)), p75: r2(quantile(xs, 0.75)), p90: r2(quantile(xs, 0.9)), max: Math.max(...xs),
});
const distributions: any = {};
for (const c of CRITS) {
  const ix = notes.map((n) => n.criteres[c].indice_recommande).filter((v: any) => typeof v === 'number');
  distributions[c] = { indice_recommande: dist(ix) };
  for (const t of ['Polyester', 'Multifilament', 'Synthetic', 'Natural Gut']) {
    const sub = notes.filter((n) => n.type === t).map((n) => n.criteres[c].indice_recommande).filter((v: any) => typeof v === 'number');
    if (sub.length) distributions[c][t] = dist(sub);
  }
}

// ------------------------------------ validation 1 : redondance entre grandeurs
const both = (f: (r: TwuRow) => number | null, g: (r: TwuRow) => number | null) => {
  const pairs = TWU.map((r) => [f(r), g(r)]).filter(([a, b]) => a !== null && b !== null && a > 0 && b > 0) as number[][];
  return { n: pairs.length, spearman: r2(spearman(pairs.map((p) => p[0]), pairs.map((p) => p[1]))) };
};
const redundancy = {
  rigidite_vs_dwell_time: both((r) => r.stiffnessLbIn, (r) => r.dwellTimeMs),
  rigidite_vs_energy_return: both((r) => r.stiffnessLbIn, (r) => r.energyReturnPct),
  rigidite_vs_perte_tension: both((r) => r.stiffnessLbIn, (r) => r.tensionLossPct),
  rigidite_vs_spin: both((r) => r.stiffnessLbIn, (r) => r.spinPotential),
  perte_tension_vs_spin: both((r) => r.tensionLossPct, (r) => r.spinPotential),
};

// ---------------------- validation 2 : sensibilité à la condition de mesure
let conditionSensitivity: any = null;
if (existsSync(`${OUT}twu-protocol-all-conditions.json`)) {
  const all = JSON.parse(readFileSync(`${OUT}twu-protocol-all-conditions.json`, 'utf8'));
  const refMap = new Map(TWU.map((r) => [r.name, r]));
  conditionSensitivity = all.conditions
    .filter((c: any) => !c.isReference)
    .map((c: any) => {
      const out: any = { condition: `${c.tension} / ${c.speed}` };
      for (const crit of CRITS) {
        const pairs: number[][] = [];
        for (const r of c.records as TwuRow[]) {
          const ref = refMap.get(r.name);
          const a = ref ? CRITERIA[crit].get(ref) : null;
          const b = CRITERIA[crit].get(r);
          if (a && b) pairs.push([a, b]);
        }
        out[crit] = { n: pairs.length, spearman_vs_reference: r2(spearman(pairs.map((p) => p[0]), pairs.map((p) => p[1]))) };
      }
      return out;
    });
}

// ------------- validation 3 : comparaison aux notes /10 actuelles (SANS source)
// Analyse seulement : moyenne des indices des jauges appariées d'une fiche.
const fiche = [...coveredIds].map((id) => {
  const s = stringsDatabase.find((x) => x.id === id)!;
  const ns = notes.filter((n) => n.stringId === id);
  const avg = (c: Crit) => {
    const v = ns.map((n) => n.criteres[c].indice_recommande).filter((x: any) => typeof x === 'number');
    return v.length ? v.reduce((a: number, b: number) => a + b, 0) / v.length : null;
  };
  return { s, souplesse: avg('souplesse'), spin: avg('spin'), tenue: avg('tenue') };
});
const vsCurrent = (crit: Crit, field: keyof TennisString, sign = 1) => {
  const pairs = fiche
    .filter((f) => f[crit] !== null && typeof f.s[field] === 'number')
    .map((f) => [f[crit] as number, sign * (f.s[field] as number)]);
  return { n: pairs.length, spearman: r2(spearman(pairs.map((p) => p[0]), pairs.map((p) => p[1]))) };
};
const currentNotes = {
  avertissement: 'Les notes /10 actuelles n’ont aucune source : ce n’est pas une référence, seulement l’ampleur du changement visible.',
  souplesse_vs_comfort: vsCurrent('souplesse', 'comfort'),
  souplesse_vs_power: vsCurrent('souplesse', 'power'),
  souplesse_vs_control_inverse: vsCurrent('souplesse', 'control', -1),
  spin_vs_spin: vsCurrent('spin', 'spin'),
  tenue_vs_durability: vsCurrent('tenue', 'durability'),
};
// Stiffness du catalogue vs mesure TWU appariée (contrôle d'identité de l'appariement)
const stiffCheck = (() => {
  const pairs = matches.map((m) => [stringsDatabase.find((s) => s.id === m.stringId)!.stiffness, m.twu.stiffnessLbIn!]);
  return { n: pairs.length, spearman: r2(spearman(pairs.map((p) => p[0]), pairs.map((p) => p[1]))) };
})();

// ------------------ validation 4 : seconde source indépendante
// Volontairement absente. Les scores playtest de Tennis Warehouse ne peuvent pas
// entrer dans ce pipeline : leurs conditions d'utilisation (termsofuse.html,
// version du 01/04/2026, clause (g)) interdisent la collecte « whether automatic
// or manual » pour « develop or improve any […] algorithm ». Aucune autre source
// tierce licite et couvrante n'a été trouvée le 29/09/2026.
const playtest = null;

// ------------- validation 5 : répétabilité (mêmes (marque, modèle, jauge) mesurés deux fois par TWU)
const repeatability = (() => {
  const groups = new Map<string, TwuRow[]>();
  for (const { r, p } of parsed) {
    const g = r.gaugeNominalMm ?? p.gaugeFromLabel;
    if (!g || g > 2) continue;
    const k = `${norm(r.name.split(" ")[0])}|${p.modelNormWithAwg}|${gaugeKey(g)}`;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  const dup = [...groups.values()].filter((g) => g.length > 1);
  const out: any = { groupes: dup.length, detail: [] as any[] };
  for (const c of CRITS) {
    const diffs = dup
      .map((g) => g.map((r) => CRITERIA[c].get(r)).filter((v): v is number => v !== null && v > 0))
      .filter((v) => v.length > 1)
      .map((v) => {
        const m = v.reduce((a, b) => a + b, 0) / v.length;
        return (100 * (Math.max(...v) - Math.min(...v))) / m;
      });
    out[c] = { n: diffs.length, ecart_relatif_median_pct: diffs.length ? r2(median(diffs)) : null, ecart_relatif_max_pct: diffs.length ? r2(Math.max(...diffs)) : null };
  }
  out.detail = dup.map((g) => g.map((r) => ({ name: r.name, k: r.stiffnessLbIn, spin: r.spinPotential, loss: r.tensionLossPct })));
  return out;
})();

// ------------- validation 6 : cohérence intra-modèle (plusieurs jauges d'une même fiche)
const intraModel = (() => {
  const byId = new Map<string, Match[]>();
  for (const m of matches) byId.set(m.stringId, [...(byId.get(m.stringId) ?? []), m]);
  const multi = [...byId.entries()].filter(([, ms]) => ms.length > 1);
  const spread = (c: Crit) =>
    multi.map(([, ms]) => ms.map((m) => CRITERIA[c].get(m.twu)).filter((v): v is number => v !== null && v > 0))
      .filter((v) => v.length > 1)
      .map((v) => (100 * (Math.max(...v) - Math.min(...v))) / (v.reduce((a, b) => a + b, 0) / v.length));
  // Rigidité non monotone avec la jauge (physiquement, plus épais = plus rigide à matériau égal)
  const nonMono = multi.filter(([, ms]) => {
    const s = [...ms].sort((a, b) => Number(a.gauge) - Number(b.gauge)).map((m) => m.twu.stiffnessLbIn!);
    return s.some((v, i) => i > 0 && v < s[i - 1]);
  }).map(([id]) => id);
  return {
    fiches_multi_jauges: multi.length,
    ...Object.fromEntries(CRITS.map((c) => { const d = spread(c); return [c, { ecart_relatif_median_pct: r2(median(d)), ecart_relatif_max_pct: r2(Math.max(...d)) }]; })),
    rigidite_non_monotone_avec_jauge: { n: nonMono.length, fiches: nonMono },
  };
})();

// ------------- stabilité des conventions quand le catalogue grossit
const stability = (() => {
  // (a) médiane catalogue : avec / sans le lot 3 Toroline (ajouté le 29/09/2026)
  const noToro = matches.filter((m) => !m.stringId.startsWith('toroline-')).map((m) => m.twu);
  const res: any = {};
  for (const c of CRITS) {
    res[c] = {
      a_avec_toroline: r2(base.a[c]!), a_sans_toroline: r2(median(vals(noToro, c))), a_prime_population_twu: r2(base.aPrime[c]!),
    };
  }
  // (a) simulé : on ajoute 30 cordages TWU hors catalogue tirés au hasard (graine fixe), 200 tirages
  let seed = 42;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  const matchedNames = new Set(matches.map((m) => m.twu.name));
  const pool = TWU.filter((r) => !matchedNames.has(r.name));
  for (const c of CRITS) {
    const meds: number[] = [];
    for (let t = 0; t < 200; t++) {
      const add = Array.from({ length: 30 }, () => pool[Math.floor(rnd() * pool.length)]);
      meds.push(median(vals([...matches.map((m) => m.twu), ...add], c)));
    }
    res[c].a_apres_ajout_30_cordages = { p5: r2(quantile(meds, 0.05)), p95: r2(quantile(meds, 0.95)) };
  }
  return res;
})();

// ------------------------------------------------------------ exemples
const EXAMPLES = [
  'luxilon-alu-power', 'babolat-rpm-blast', 'solinco-hyper-g', 'wilson-nxt', 'babolat-touch-vs',
  'toroline-o-toro', 'tecnifibre-x-one-biphase', 'yonex-poly-tour-pro', 'luxilon-4g', 'head-lynx-tour',
  'tecnifibre-nrg2', 'solinco-tour-bite', 'tecnifibre-razor-code', 'wilson-natural-gut',
];
const examples = EXAMPLES.map((id) => {
  const s = stringsDatabase.find((x) => x.id === id);
  if (!s) return { id, absent_du_catalogue: true };
  const ns = notes.filter((n) => n.stringId === id);
  return {
    id, brand: s.brand, model: s.model, type: s.type, rigidite_catalogue: s.stiffness,
    notes10_actuelles: { comfort: s.comfort ?? null, power: s.power ?? null, control: s.control ?? null, spin: s.spin ?? null, durability: s.durability ?? null },
    mesures: ns.map((n) => ({
      gauge: n.gauge, twuName: n.twuName,
      souplesse: n.criteres.souplesse, spin: n.criteres.spin, tenue: n.criteres.tenue,
    })),
    quarantaine: quarantine.filter((q) => q.stringId === id),
  };
});

// ------------------------------------------------------------ écriture
writeFileSync(`${OUT}protocole-appariement.json`, JSON.stringify({ matches: matches.map((m) => ({ stringId: m.stringId, gauge: m.gauge, twuName: m.twu.name, material: m.twu.material })), quarantine }, null, 1));
writeFileSync(`${OUT}protocole-notes-v0.1.json`, JSON.stringify({ protocole: PROTOCOL_VERSION, bases: base, notes }, null, 1));
const stats = {
  protocole: PROTOCOL_VERSION,
  twu: { releve: TWU_FETCHED_AT, lignes: TWU.length },
  appariement: {
    paires_fiche_jauge: matches.length, fiches_couvertes: coveredIds.size, fiches_total: stringsDatabase.length,
    quarantaine: quarantine.length,
    quarantaine_par_motif: quarantine.reduce((acc: any, q) => { const k = q.reason.replace(/[«»].*$/, '').replace(/\d\.\d\d.*$/, '').trim(); acc[k] = (acc[k] ?? 0) + 1; return acc; }, {}),
    fiches_quarantaine_seule: [...new Set(quarantine.map((q) => q.stringId))].filter((id) => !coveredIds.has(id)).length,
    controle_identite_rigidite_catalogue_vs_twu: stiffCheck,
  },
  couverture: { par_critere: perCrit, par_type: byKey('type'), par_marque: byKey('brand') },
  bases: base, distributions, redundancy, conditionSensitivity, repeatability, intraModel, stability, currentNotes, playtest, examples,
};
writeFileSync(`${OUT}protocole-stats.json`, JSON.stringify(stats, null, 1));

console.log(`Protocole ${PROTOCOL_VERSION} — TWU relevé ${TWU_FETCHED_AT} (${TWU.length} lignes)`);
console.log(`Appariements exacts (fiche, jauge) : ${matches.length} ; fiches couvertes ${coveredIds.size}/${stringsDatabase.length} ; quarantaine ${quarantine.length}`);
console.log('Couverture par type :', JSON.stringify(byKey('type')));
console.log('Bases :', JSON.stringify(base));
console.log('Redondance :', JSON.stringify(redundancy));
console.log('Notes /10 actuelles :', JSON.stringify(currentNotes));
console.log('-> out/protocole-appariement.json, out/protocole-notes-v0.1.json, out/protocole-stats.json');
