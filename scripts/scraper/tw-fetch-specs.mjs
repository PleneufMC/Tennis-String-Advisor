#!/usr/bin/env node
/**
 * ÉTAPE 2/3 — Récupération des caractéristiques depuis les pages produit
 * Tennis Warehouse découvertes par `tw-discover.mjs`.
 *
 * ⚠️ CE SCRIPT N'A JAMAIS ABOUTI — À LIRE AVANT DE S'EN SERVIR
 * ─────────────────────────────────────────────────────────────────────────────
 * Il n'a produit AUCUN résultat : `out/tw-specs.json` n'a jamais été créé, et
 * pas une seule caractéristique n'a été récupérée. Le site renvoie HTTP 406
 * (bannissement d'IP progressif par protection anti-robot) sur les fiches
 * produit, et finalement sur tout — y compris `robots.txt` et `sitemap.xml`.
 *
 * Conséquence : **aucune valeur de la base du site n'est sourcée chez Tennis
 * Warehouse.** Les points P1–P4 du récapitulatif restent entiers.
 *
 * Le format ci-dessous décrit la structure ATTENDUE des pages produit. Elle est
 * plausible mais NON CONFIRMÉE par une lecture réussie de ma part : les sélecteurs
 * sont donc à revalider sur une vraie page avant d'accorder foi à une extraction.
 * (Une version antérieure de ce commentaire présentait ces valeurs comme
 * « vérifiées sur Wilson Ultra 100 v5 » : je ne peux pas l'étayer, cette fiche
 * n'a jamais renvoyé autre chose qu'un 406. Corrigé.)
 *
 * Structure attendue (À REVALIDER) :
 *   <strong>Head Size:</strong> 100 in² / 645.16 cm²
 *   <strong>Length:</strong> 27in / 68.58cm
 *   <strong>Strung Weight: </strong>11.2oz / 318g
 *   <strong>Balance:</strong> 13in / 33.02cm / 4 pts HL
 *   <strong>Swingweight:</strong> 322
 *   <strong>Stiffness:</strong> 67            <-- le RA que nous cherchons
 *   <meta itemprop="price" content="299.00">  <-- prix USD
 *
 * Aucune valeur n'est inventée : un champ absent de la page reste `null`.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const OUT_DIR = new URL('./out/', import.meta.url).pathname;
const DELAY_MS = 300;
const CONCURRENCY = 5;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    if (!res.ok) {
      if ((res.status === 429 || res.status >= 500) && attempt <= 3) {
        await sleep(2000 * attempt);
        return fetchText(url, attempt + 1);
      }
      return { ok: false, status: res.status, body: '' };
    }
    return { ok: true, status: 200, body: await res.text() };
  } catch {
    if (attempt <= 3) {
      await sleep(1000 * attempt);
      return fetchText(url, attempt + 1);
    }
    return { ok: false, status: 0, body: '' };
  }
}

async function pool(items, worker) {
  const queue = [...items];
  const runners = Array.from({ length: CONCURRENCY }, async () => {
    for (;;) {
      const item = queue.shift();
      if (!item) return;
      await worker(item);
      await sleep(DELAY_MS);
    }
  });
  await Promise.all(runners);
}

/** Récupère le texte qui suit `<strong>Label:</strong>` dans le HTML normalisé. */
function field(html, label) {
  const re = new RegExp(`<strong>\\s*${label}\\s*:?\\s*</strong>\\s*([^<]*)`, 'i');
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

const num = (s) => {
  if (!s) return null;
  const m = s.match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};

/** « 11.2oz / 318g » -> 318 ; « 100 in² / 645.16 cm² » -> 100 */
function grams(s) {
  if (!s) return null;
  const m = s.match(/(\d+(?:\.\d+)?)\s*g\b/i);
  return m ? Number(m[1]) : null;
}
function inches(s) {
  if (!s) return null;
  const m = s.match(/(\d+(?:\.\d+)?)\s*in\b/i);
  return m ? Number(m[1]) : null;
}
function headSizeIn2(s) {
  if (!s) return null;
  const m = s.match(/(\d+(?:\.\d+)?)\s*in/i);
  return m ? Number(m[1]) : null;
}

function parseProduct(code, url, raw) {
  // Même normalisation que dans la découverte : TW insère des \r dans le HTML.
  const html = raw.replace(/[\r\n]+/g, ' ');

  const title = (html.match(/<title>([^<]*)/) || [])[1]?.replace(/\s*\|\s*Tennis Warehouse\s*$/, '').trim() ?? null;

  // Prix : on prend le plus petit prix affiché (les tailles de grip partagent
  // le même prix ; un éventuel accessoire plus cher ne doit pas primer).
  const prices = [...html.matchAll(/<meta itemprop="price" content="([0-9.]+)"/g)].map((m) => Number(m[1]));
  const priceUsd = prices.length ? Math.min(...prices) : null;

  return {
    code,
    url,
    title,
    priceUsd,
    // --- raquettes ---
    stiffnessRA: num(field(html, 'Stiffness')),
    headSizeIn2: headSizeIn2(field(html, 'Head Size')),
    lengthIn: inches(field(html, 'Length')),
    strungWeightG: grams(field(html, 'Strung Weight')),
    unstrungWeightG: grams(field(html, 'Unstrung Weight')),
    balance: field(html, 'Balance'),
    swingweight: num(field(html, 'Swingweight')),
    beamWidth: field(html, 'Beam Width'),
    powerLevel: field(html, 'Power Level'),
    stringPatternRaw: (html.match(/(\d+)\s*Mains\s*\/\s*(\d+)\s*Crosses/i) || []).slice(1, 3).join('x') || null,
    stringTension: field(html, 'String Tension'),
    composition: field(html, 'Composition'),
    // --- cordages ---
    gauge: field(html, 'Gauge'),
    stringComposition: field(html, 'Composition'),
    stringLength: field(html, 'String Length'),
    colorRaw: field(html, 'String Color') ?? field(html, 'Color'),
  };
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const listPath = `${OUT_DIR}product-urls.json`;
  if (!existsSync(listPath)) {
    console.error('product-urls.json absent — lancez d\'abord `node scripts/scraper/tw-discover.mjs`');
    process.exit(1);
  }
  const list = JSON.parse(readFileSync(listPath, 'utf8'));
  const only = process.argv.includes('--racquets')
    ? list.filter((p) => p.code.startsWith('RC'))
    : process.argv.includes('--strings')
      ? list.filter((p) => p.code.startsWith('ST') || p.code.startsWith('AM'))
      : list;

  console.log(`Récupération de ${only.length} pages produit (concurrence ${CONCURRENCY}, délai ${DELAY_MS} ms)...`);
  const results = [];
  const failures = [];
  let done = 0;
  await pool(only, async (p) => {
    const res = await fetchText(p.url);
    done += 1;
    if (!res.ok) {
      failures.push({ ...p, status: res.status });
    } else {
      results.push(parseProduct(p.code, p.url, res.body));
    }
    if (done % 50 === 0) console.log(`  ${done}/${only.length} — ${results.length} ok, ${failures.length} échecs`);
  });

  results.sort((a, b) => a.code.localeCompare(b.code));
  writeFileSync(`${OUT_DIR}tw-specs.json`, JSON.stringify(results, null, 2));
  writeFileSync(`${OUT_DIR}tw-failures.json`, JSON.stringify(failures, null, 2));

  const withRA = results.filter((r) => typeof r.stiffnessRA === 'number').length;
  const withPrice = results.filter((r) => typeof r.priceUsd === 'number').length;
  console.log(`\nTerminé : ${results.length} fiches, ${failures.length} échecs`);
  console.log(`  avec RA (stiffness) : ${withRA}`);
  console.log(`  avec prix USD       : ${withPrice}`);
  console.log(`  -> ${OUT_DIR}tw-specs.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
