#!/usr/bin/env node
/**
 * QA IMAGES DU BLOG — règle de Pierre du 10/10/2026 : « les articles doivent
 * être systématiquement assortis d'images, quitte à les générer ». La règle
 * complète (sources permises, interdits) est dans docs/redaction/CHARTE.md,
 * section « Images » ; ce script en vérifie la partie mesurable.
 *
 * Pour chaque article FR (public/blog) et EN (public/en/blog), hors index :
 *  1. Couverture : <figure class="tsa-fig tsa-fig--hero"> contenant une <img>
 *     locale, `alt` non vide, `width` et `height` déclarés, et une légende qui
 *     commence par « Photo » ou « Illustration » (la provenance se lit d'abord).
 *  2. Partage : og:image (URL absolue du site) identique à twitter:image,
 *     og:image:width 1200, og:image:height 630, og:image:alt non vide ; le
 *     fichier existe et mesure réellement 1200 × 630 (en-tête WebP/PNG/JPEG lu).
 *  3. JSON-LD : blocs valides, et un nœud Article/BlogPosting dont `image`
 *     pointe vers un fichier existant.
 *  4. Toute <img> : `alt` non vide, `width` et `height`, fichier présent.
 *  5. Provenance : toute image de /blog/images/ a sa ligne dans
 *     public/blog/images/CREDITS.md (les photos produit /images/products/
 *     relèvent du manifeste de tsa-core, contrôle 12 de audit:ratings).
 *  6. Au moins un visuel dans le corps : une <figure class="tsa-fig"> hors
 *     couverture, avec une <img> ou un <svg role="img"> titré, et une légende
 *     qui dit d'où vient le visuel.
 *     Exceptions : les articles publiés avant la règle et encore sans visuel de
 *     corps sont listés dans scripts/qa-blog-images.exceptions.json, chacun avec
 *     l'empreinte de son fichier. L'exception TOMBE dès que l'article est
 *     modifié : on ajoute alors un visuel, ou l'on renouvelle l'exception avec
 *     un motif daté — un acte visible dans le diff de la PR, jamais silencieux.
 *  7. Illustrations générées (voie 3 de la charte, générateur MCP de Pierre) :
 *     toute image inscrite dans la section « Illustrations générées » de
 *     CREDITS.md porte une légende qui le dit (« générée » / « generated »).
 *     Une image générée ne passe jamais pour une photo.
 * Index (/blog/, /en/blog/) : points 2 (sans JSON-LD) et 4 seulement.
 *
 * Usage :
 *   node scripts/qa-blog-images.mjs                     contrôle statique
 *   node scripts/qa-blog-images.mjs --url <base>        + chaque image répond 200 sur <base>
 *   node scripts/qa-blog-images.mjs --hash <fichier>    empreinte à reporter dans les exceptions
 * Sortie : 0 si conforme, 1 sinon. Les exceptions en cours sont affichées en AVERT.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://tennisstringadvisor.org';
const EXCEPTIONS_FILE = 'scripts/qa-blog-images.exceptions.json';
const CREDITS_FILE = 'public/blog/images/CREDITS.md';
const UNIVERSES = [
  { label: 'FR', dir: 'public/blog' },
  { label: 'EN', dir: 'public/en/blog' },
];

const fingerprint = (path) =>
  'sha256:' + createHash('sha256').update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n')).digest('hex');

// --hash : outil de renouvellement, ne contrôle rien
{
  const i = process.argv.indexOf('--hash');
  if (i !== -1) {
    const file = process.argv[i + 1];
    if (!file || !existsSync(file)) {
      process.stderr.write('usage : node scripts/qa-blog-images.mjs --hash public/blog/<article>.html\n');
      process.exit(2);
    }
    process.stdout.write(`${fingerprint(file)}\n`);
    process.exit(0);
  }
}

let failures = 0;
let warnings = 0;
const fail = (msg) => {
  failures++;
  process.stdout.write(`  ECHEC ${msg}\n`);
};
const warn = (msg) => {
  warnings++;
  process.stdout.write(`  AVERT ${msg}\n`);
};
const ok = (msg) => process.stdout.write(`  OK    ${msg}\n`);

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? m[1] : null;
};
const meta = (html, key, kind = 'property') => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (attr(tag, kind) === key) return attr(tag, 'content');
  }
  return null;
};
const text = (fragment) => fragment.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// Chemin web local (/blog/images/x.webp ou URL absolue du site) -> fichier dans public/
const toLocal = (src) => {
  if (!src) return null;
  let p = src;
  if (p.startsWith(SITE)) p = p.slice(SITE.length);
  if (!p.startsWith('/')) return null; // externe ou relatif : interdit pour un visuel d'article
  return join('public', decodeURIComponent(p.split(/[?#]/)[0]));
};

// Dimensions lues dans l'en-tête du fichier (WebP VP8/VP8L/VP8X, PNG, JPEG)
function imageSize(path) {
  const b = readFileSync(path);
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { w: 1 + (bits & 0x3fff), h: 1 + ((bits >> 14) & 0x3fff) };
    }
  }
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let o = 2;
    while (o < b.length) {
      if (b[o] !== 0xff) break;
      const marker = b[o + 1];
      const len = b.readUInt16BE(o + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { w: b.readUInt16BE(o + 7), h: b.readUInt16BE(o + 5) };
      }
      o += 2 + len;
    }
  }
  return null;
}

// CREDITS.md : première cellule de chaque ligne de tableau ; « a-fr.svg / -en.svg » couvre les deux.
// Les fichiers de la section « Illustrations générées » sont aussi relevés à part (point 7).
function creditedFiles() {
  const names = new Set();
  const generated = new Set();
  if (!existsSync(CREDITS_FILE)) return { names, generated };
  let section = '';
  for (const line of readFileSync(CREDITS_FILE, 'utf8').split(/\r?\n/)) {
    if (line.startsWith('## ')) section = line;
    const m = line.match(/^\|\s*([^|]+?)\s*\|/);
    if (!m) continue;
    const parts = m[1].split(/\s*\/\s*/);
    const first = parts[0];
    if (!/\.(webp|png|jpe?g|svg|gif|avif)$/i.test(first)) continue;
    const files = [first];
    for (const p of parts.slice(1)) {
      files.push(p.startsWith('-') ? first.replace(/-(fr|en)(\.[a-z0-9]+)$/i, '') + p : p);
    }
    for (const file of files) {
      names.add(file);
      if (/Illustrations générées/i.test(section)) generated.add(file);
    }
  }
  return { names, generated };
}

function jsonLdImages(html, rel) {
  const blocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const images = [];
  let articleFound = false;
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    const types = [].concat(node['@type'] ?? []);
    if (types.some((t) => /^(Article|BlogPosting|NewsArticle|TechArticle)$/.test(t))) {
      articleFound = true;
      for (const img of [].concat(node.image ?? [])) {
        if (typeof img === 'string') images.push(img);
        else if (img && typeof img === 'object' && img.url) images.push(img.url);
      }
    }
    Object.values(node).forEach(walk);
  };
  for (const [, body] of blocks) {
    try {
      walk(JSON.parse(body));
    } catch (e) {
      fail(`${rel} : bloc JSON-LD illisible (${e.message.split('\n')[0]})`);
    }
  }
  return { articleFound, images };
}

const loadExceptions = () => {
  if (!existsSync(EXCEPTIONS_FILE)) return new Map();
  const data = JSON.parse(readFileSync(EXCEPTIONS_FILE, 'utf8'));
  return new Map((data.articles ?? []).map((a) => [a.fichier, a]));
};

const { names: credited, generated } = creditedFiles();
const exceptions = loadExceptions();
const usedExceptions = new Set();
const remoteChecks = []; // [rel, url]

process.stdout.write('--- qa-blog-images : couverture, partage, visuel de corps, provenance ---\n');

for (const { label, dir } of UNIVERSES) {
  const pages = readdirSync(dir).filter((f) => f.endsWith('.html'));
  if (pages.length === 0) {
    fail(`${dir} : aucune page HTML — le dossier a-t-il changé ?`);
    continue;
  }
  let articles = 0;
  let exempted = 0;
  const failuresBefore = failures;

  for (const name of pages) {
    const rel = `${dir}/${name}`;
    const html = readFileSync(rel, 'utf8');
    const isIndex = name === 'index.html';
    if (!isIndex) articles++;

    // 2. Partage
    const og = meta(html, 'og:image');
    const tw = meta(html, 'twitter:image', 'name');
    if (!og) fail(`${rel} : og:image absente`);
    else {
      if (!og.startsWith(`${SITE}/`)) fail(`${rel} : og:image doit être une URL absolue du site (${og})`);
      if (tw !== og) fail(`${rel} : twitter:image (${tw ?? 'absente'}) différente de og:image`);
      if (meta(html, 'og:image:width') !== '1200' || meta(html, 'og:image:height') !== '630') {
        fail(`${rel} : og:image:width/height doivent valoir 1200/630`);
      }
      if (!meta(html, 'og:image:alt')) fail(`${rel} : og:image:alt absent ou vide`);
      const file = toLocal(og);
      if (!file || !existsSync(file)) fail(`${rel} : fichier og:image introuvable (${og})`);
      else {
        const size = imageSize(file);
        if (!size) fail(`${rel} : og:image dans un format illisible ici (WebP, PNG ou JPEG attendus) : ${og}`);
        else if (size.w !== 1200 || size.h !== 630) fail(`${rel} : og:image mesure ${size.w} × ${size.h}, 1200 × 630 attendu`);
        remoteChecks.push([rel, og]);
      }
    }

    // 4 + 5. Toute <img>
    for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
      const src = attr(tag, 'src');
      const alt = attr(tag, 'alt');
      if (!alt || !alt.trim()) fail(`${rel} : <img src="${src}"> sans alt`);
      if (!attr(tag, 'width') || !attr(tag, 'height')) fail(`${rel} : <img src="${src}"> sans width/height (décalage de mise en page)`);
      const file = toLocal(src);
      if (!file) {
        fail(`${rel} : <img src="${src}"> hors du site — les visuels sont hébergés chez nous`);
        continue;
      }
      if (!existsSync(file)) {
        fail(`${rel} : <img src="${src}"> introuvable dans public/`);
        continue;
      }
      remoteChecks.push([rel, `${SITE}${src.startsWith(SITE) ? src.slice(SITE.length) : src}`]);
      const base = src.split('/').pop().split(/[?#]/)[0];
      if (src.includes('/blog/images/') && !credited.has(base)) {
        fail(`${rel} : ${base} n'a pas de ligne dans ${CREDITS_FILE}`);
      } else if (!src.includes('/blog/images/') && !src.includes('/images/products/')) {
        fail(`${rel} : ${src} hors de /blog/images/ et /images/products/ — provenance non tracée`);
      }
    }

    if (isIndex) continue;

    // 1. Couverture
    const figures = [...html.matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/gi)];
    const hero = figures.find(([, attrs]) => /\btsa-fig--hero\b/.test(attrs));
    if (!hero) fail(`${rel} : pas de couverture (<figure class="tsa-fig tsa-fig--hero">)`);
    else {
      if (!/<img\b/i.test(hero[2])) fail(`${rel} : la couverture ne contient pas d'<img>`);
      const cap = (hero[2].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) ?? [])[1];
      if (!cap) fail(`${rel} : couverture sans légende`);
      else if (!/^(Photo|Illustration)\b/.test(text(cap))) {
        fail(`${rel} : la légende de couverture doit commencer par « Photo » ou « Illustration » (lu : « ${text(cap).slice(0, 40)}… »)`);
      }
    }

    // 7. Illustrations générées : légendées comme telles
    for (const [, , inner] of figures) {
      const src = attr((inner.match(/<img\b[^>]*>/i) ?? [''])[0], 'src');
      const base = src ? src.split('/').pop().split(/[?#]/)[0] : null;
      if (!base || !generated.has(base)) continue;
      const cap = (inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) ?? [])[1];
      if (!cap || !/(générée|generated)/i.test(text(cap))) {
        fail(`${rel} : ${base} est une illustration générée (CREDITS.md) mais sa légende ne le dit pas — « Illustration générée » / « Illustration (AI-generated) »`);
      }
    }

    // 3. JSON-LD
    const { articleFound, images } = jsonLdImages(html, rel);
    if (!articleFound) fail(`${rel} : aucun nœud JSON-LD Article/BlogPosting`);
    else if (images.length === 0) fail(`${rel} : JSON-LD Article sans "image"`);
    else {
      for (const img of images) {
        const file = toLocal(img);
        if (!file || !existsSync(file)) fail(`${rel} : image du JSON-LD introuvable (${img})`);
      }
    }

    // 6. Visuel de corps
    const bodyVisuals = figures.filter(([, attrs, inner]) => {
      if (!/\btsa-fig\b/.test(attrs) || /\btsa-fig--hero\b/.test(attrs)) return false;
      const hasImg = /<img\b/i.test(inner);
      const svg = inner.match(/<svg\b[^>]*>/i);
      const svgOk = svg && /role="img"/.test(svg[0]) && (/<title\b/i.test(inner) || /aria-label="[^"]+"/.test(svg[0]));
      if (svg && !hasImg && !svgOk) {
        fail(`${rel} : schéma SVG sans role="img" ni titre — illisible pour un lecteur d'écran`);
        return false;
      }
      const cap = (inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) ?? [])[1];
      const provenance = cap && /(Tennis String Advisor|Photo|Illustration|[Ss]ource|Wikimedia|Unsplash|Pexels|d'après|based on)/.test(text(cap));
      if ((hasImg || svgOk) && !provenance) {
        fail(`${rel} : visuel de corps sans légende de provenance`);
        return false;
      }
      return hasImg || svgOk;
    });
    const exception = exceptions.get(rel);
    if (bodyVisuals.length > 0) {
      if (exception) {
        usedExceptions.add(rel);
        warn(`${rel} : a désormais un visuel de corps — retirer son exception de ${EXCEPTIONS_FILE}`);
      }
    } else if (!exception) {
      fail(`${rel} : aucun visuel dans le corps (schéma, graphique ou photo légendée) — obligatoire pour tout article nouveau ou modifié`);
    } else {
      usedExceptions.add(rel);
      const current = fingerprint(rel);
      if (current !== exception.empreinte) {
        fail(`${rel} : modifié depuis son exception du ${exception.depuis} — ajouter un visuel de corps, ou renouveler l'exception avec un motif daté (empreinte actuelle : ${current})`);
      } else {
        exempted++;
        warn(`${rel} : sans visuel de corps — exception du ${exception.depuis}, à résorber`);
      }
    }
  }
  if (failures === failuresBefore) {
    ok(`${dir} : ${articles} articles ${label} + index — couverture, partage, JSON-LD et provenance conformes${exempted ? ` ; ${exempted} en exception (visuel de corps)` : ''}`);
  }
}

for (const rel of exceptions.keys()) {
  if (!usedExceptions.has(rel)) warn(`${EXCEPTIONS_FILE} : exception orpheline (${rel} n'existe plus ou n'est plus concerné) — la retirer`);
}

// --url : chaque image répond 200 sur le domaine contrôlé
{
  const i = process.argv.indexOf('--url');
  if (i !== -1) {
    const base = (process.argv[i + 1] ?? '').replace(/\/$/, '');
    if (!/^https?:\/\//.test(base)) {
      fail('--url attend une base http(s)');
    } else {
      const unique = [...new Map(remoteChecks.map(([rel, u]) => [u.replace(SITE, base), rel])).entries()];
      let okCount = 0;
      for (const [url, rel] of unique) {
        try {
          const res = await fetch(url, { method: 'GET', redirect: 'follow' });
          const type = res.headers.get('content-type') ?? '';
          if (res.status !== 200) fail(`${rel} : ${url} répond ${res.status}`);
          else if (!/^image\//.test(type)) fail(`${rel} : ${url} servi en « ${type} », pas en image`);
          else okCount++;
          await res.arrayBuffer();
        } catch (e) {
          fail(`${rel} : ${url} injoignable (${e.message})`);
        }
      }
      process.stdout.write(`  ${okCount}/${unique.length} images répondent 200 sur ${base}\n`);
    }
  }
}

if (warnings > 0) process.stdout.write(`\n${warnings} avertissement(s) — exceptions en cours, à résorber\n`);
process.stdout.write(
  failures === 0
    ? '\nimages du blog conformes à la règle du 10/10/2026\n'
    : `\n${failures} manquement(s) à la règle images — voir docs/redaction/CHARTE.md, section « Images »\n`
);
process.exit(failures === 0 ? 0 : 1);
