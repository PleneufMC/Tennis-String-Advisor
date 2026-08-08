#!/usr/bin/env node
/**
 * Récupération de la base officielle de performance des cordages de
 * Tennis Warehouse University (TWU).
 *
 * POURQUOI CETTE SOURCE PLUTÔT QUE LA BOUTIQUE
 * --------------------------------------------
 * La rigidité des cordages est la donnée la plus critique de notre base :
 * elle alimente directement l'alerte « risque de tennis elbow ». Or nos
 * valeurs présentaient une signature d'estimation en lot (8 valeurs revenant
 * 7 à 11 fois chacune : 205, 210, 215, 165, 235, 220, 225, 200 lb/in).
 *
 * TWU est le laboratoire de Tennis Warehouse. Il publie la rigidité MESURÉE
 * en `lb/in` — exactement l'unité de notre base — sur `reporter2.php`, avec
 * en plus le matériau, la perte de tension et le potentiel d'effet.
 *
 * Définition TWU de la rigidité : « Stiffness (k) is how many pounds force
 * are necessary to stretch the string lengthwise by 1 inch during a dynamic
 * impact. » Toutes les mesures sont faites à une tension de référence
 * identique (51 lbs), ce qui rend les cordages comparables entre eux.
 *
 * NOTE D'ACCÈS : le domaine boutique `www.tennis-warehouse.com` nous a
 * renvoyé des HTTP 406 après quelques centaines de requêtes (limitation par
 * IP). Le sous-domaine `twu.tennis-warehouse.com` répond normalement, et
 * surtout ce script ne fait qu'UNE SEULE requête : toute la base tient dans
 * une page. Aucune charge n'est imposée au site.
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';

const OUT_DIR = new URL('./out/', import.meta.url).pathname;
const URL_DB = 'https://twu.tennis-warehouse.com/learning_center/reporter2.php';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const stripTags = (s) => s.replace(/<[^>]+>/g, '');
const unescapeHtml = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x?[0-9A-Fa-f]+;/g, '');

const numOrNull = (s) => {
  const m = String(s).match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  console.log('Lecture de la base TWU (1 requête)...');
  const res = await fetch(URL_DB, { headers: HEADERS });
  if (!res.ok) throw new Error(`TWU inaccessible (HTTP ${res.status})`);
  const html = await res.text();

  const rows = [...html.matchAll(/<tr>(.*?)<\/tr>/gs)].map((m) => m[1]);
  const records = [];
  for (const row of rows) {
    const cells = [...row.matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gs)].map((c) =>
      unescapeHtml(stripTags(c[1])).replace(/\s+/g, ' ').trim()
    );
    // Colonnes attendues :
    // Item | String | Ref. Ten. (lbs) | Swing Speed | Material | Stiffness (lb/in) | Tension Loss (%) | Spin Potential
    if (cells.length < 8) continue;
    if (!/^\d+$/.test(cells[0])) continue; // ignore la ligne d'en-tête
    const stiffness = numOrNull(cells[5]);
    if (stiffness === null) continue;
    records.push({
      name: cells[1],
      refTensionLbs: numOrNull(cells[2]),
      swingSpeed: cells[3] || null,
      material: cells[4] || null,
      stiffnessLbIn: stiffness,
      tensionLossPct: numOrNull(cells[6]),
      spinPotential: numOrNull(cells[7]),
    });
  }

  writeFileSync(`${OUT_DIR}twu-strings.json`, JSON.stringify(records, null, 2));

  const st = records.map((r) => r.stiffnessLbIn).sort((a, b) => a - b);
  const pct = (p) => st[Math.min(st.length - 1, Math.floor((p / 100) * st.length))];
  console.log(`\n${records.length} cordages mesurés -> out/twu-strings.json`);
  console.log(`  rigidité : min ${st[0]} | p25 ${pct(25)} | médiane ${pct(50)} | p75 ${pct(75)} | max ${st[st.length - 1]} lb/in`);
  const mats = {};
  for (const r of records) mats[r.material ?? '?'] = (mats[r.material ?? '?'] ?? 0) + 1;
  console.log('  matériaux :', Object.entries(mats).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
