#!/usr/bin/env node
/**
 * QA JSON-LD — le logo existe, la FAQ balisée est la FAQ visible, le sitemap dit la vraie date
 * (tsa-acquisition, 11/10/2026).
 *
 * Origine. Trois défauts de données structurées relevés pendant la passe du 11/10/2026, tous silencieux :
 *   1. `publisher.logo` de 11 articles pointait vers `https://tennisstringadvisor.org/logo.png` (et
 *      `/assets/logo.png`) : HTTP 404 en production. Une URL de logo « devinée » (règle 4) ne vaut pas un logo.
 *   2. des `FAQPage` déclaraient des questions et des réponses que la page n'affiche pas, ou une réponse
 *      abrégée, reformulée ou prolongée par rapport au texte visible : la règle est « FAQPage seulement si la
 *      FAQ visible correspond mot pour mot » (prompt de `tsa-acquisition`, passe on-page).
 *   3. `src/app/sitemap.ts` donnait `lastModified: now` à chaque URL : une date que rien n'établit, relue
 *      par les moteurs (Bing d'abord) comme « tout a changé à chaque déploiement ».
 *
 * Ce que le script contrôle.
 *   LOGO     toute valeur `logo` d'un JSON-LD (chaîne ou ImageObject.url) qui pointe vers le site doit
 *            correspondre à un fichier réel de `public/` ; un logo hors du site est signalé (AVERT : non vérifiable).
 *   FAQ      pour chaque `FAQPage` : la question est dans le texte visible, et la réponse y figure en
 *            entier : les mêmes mots, du début à la fin d'un bloc (le texte visible lit les balises
 *            « en ligne » sans espace, un `<br>`, un paragraphe ou un titre comme une frontière). Une réponse
 *            abrégée, reformulée, prolongée ou absente échoue. Les emoji, les entités, les espaces insécables
 *            et les apostrophes typographiques ne comptent pas comme des différences de mots.
 *   SITEMAP  `src/app/sitemap.ts` : chaque article de `BLOG_ARTICLES` / `EN_BLOG_ARTICLES` porte
 *            `modified` = le `dateModified` du JSON-LD de l'article ; tout article de `public/blog` et de
 *            `public/en/blog` y figure et inversement ; aucun `new Date()` sans argument (date du build) ;
 *            quand le build est présent (`.next/server/app/sitemap.xml.body`), seule une URL d'article porte
 *            un `<lastmod>`, et c'est la bonne.
 *
 * Périmètre : toute page HTML de `public/` (articles compris : un JSON-LD d'article est un `<head>`,
 * propriété de `tsa-acquisition`) ; ÉCHEC partout. Exceptions : liste explicite, datée, motivée, vide à ce jour ;
 * une exception inutilisée échoue.
 *
 * Tests négatifs permanents (section finale) : logo absent, logo existant, hors site ; question absente, réponse
 * abrégée, reformulée, prolongée, tronquée à une phrase ; structures `<h3>` + `<p>`, `<p><strong>` + `<br>`, listes,
 * paragraphes multiples, balises en ligne, entités, emoji ; sitemap : date divergente, article manquant ou
 * inconnu, `new Date()`, `<lastmod>` d'une URL qui n'est pas un article. Un garde-fou muet échoue.
 *
 * Périmètre du script : `tsa-measure` (scripts/qa-*), écrit par `tsa-acquisition` — signalé dans la PR.
 *
 * Usage : node scripts/qa-jsonld.mjs    (npm run audit:jsonld)
 * Sortie : 0 si conforme, 1 sinon.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const ROOT = process.cwd();
const ts = createRequire(path.join(ROOT, 'package.json'))('typescript');

let failures = 0;
let warnings = 0;
const ok = (msg) => process.stdout.write(`  OK    ${msg}\n`);
const fail = (msg) => {
  failures++;
  process.stdout.write(`  ECHEC ${msg}\n`);
};
const warn = (msg) => {
  warnings++;
  process.stdout.write(`  AVERT ${msg}\n`);
};

const SITE_ORIGIN = 'https://tennisstringadvisor.org';

// Exceptions : { file, contains, date, reason } — `contains` est un extrait du message du constat.
const EXCEPTIONS = [];

function exceptionProblems(list) {
  const problems = [];
  list.forEach((e, i) => {
    const id = `exception n° ${i + 1}${e?.file ? ` (${e.file})` : ''}`;
    if (!e || typeof e.file !== 'string' || !e.file.trim()) problems.push(`${id} : « file » manquant`);
    if (!e || typeof e.contains !== 'string' || !e.contains.trim()) problems.push(`${id} : « contains » manquant`);
    if (!e || typeof e.reason !== 'string' || e.reason.trim().length < 15) problems.push(`${id} : « reason » absent ou trop court (15 caractères au moins : un motif, pas une étiquette)`);
    if (!e || typeof e.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || Number.isNaN(Date.parse(e.date))) problems.push(`${id} : « date » absente ou invalide (AAAA-MM-JJ)`);
  });
  return problems;
}
function applyExceptions(findings, list) {
  const used = new Set();
  const kept = findings.filter((f) => {
    const idx = list.findIndex((e) => e && e.file === f.file && typeof e.contains === 'string' && f.message.includes(e.contains));
    if (idx < 0) return true;
    used.add(idx);
    return false;
  });
  return { kept, unused: list.filter((_, i) => !used.has(i)) };
}

// ---------------------------------------------------------------------------
// Lecture d'une page : JSON-LD (avec sa ligne) et texte visible
// ---------------------------------------------------------------------------
const lineStarts = (text) => {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1);
  return starts;
};
const lineAt = (starts, offset) => {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
};

/** Les blocs JSON-LD d'une page : { json | null, error, offset, raw }. */
function jsonLdBlocks(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\btype\s*=\s*["']?application\/ld\+json/i.test(m[1])) continue;
    const raw = m[2];
    const offset = m.index + m[0].length - '</script>'.length - raw.length;
    try {
      out.push({ json: JSON.parse(raw), offset, raw });
    } catch (e) {
      out.push({ json: null, error: e.message, offset, raw });
    }
  }
  return out;
}

/** Tous les nœuds d'un JSON-LD (récursif, @graph compris). */
function nodesOf(json, out = []) {
  if (Array.isArray(json)) json.forEach((n) => nodesOf(n, out));
  else if (json && typeof json === 'object') {
    out.push(json);
    Object.values(json).forEach((v) => nodesOf(v, out));
  }
  return out;
}
const typesOf = (n) => [].concat(n['@type'] ?? []);

const NAMED = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"', laquo: '«', raquo: '»', hellip: '…', mdash: '—', ndash: '–', thinsp: ' ', ensp: ' ', emsp: ' ', middot: '·', times: '×', deg: '°', eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', ecirc: 'ê', euro: '€' };
const decodeEntities = (s) =>
  s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
// balises « en ligne » : lues sans espace (« 4<sup>e</sup> série » = « 4e série ») ; toute autre balise, y compris <br>, est une frontière de bloc
const INLINE = /^(?:a|strong|em|b|i|span|sup|sub|code|abbr|mark|small|u|cite|q|s|del|ins|time|var|kbd|samp|font|bdi|bdo)$/i;
const BOUNDARY = String.fromCharCode(1);

/** Le texte visible d'une page : { text, boundary } (boundary : positions des espaces qui sont des frontières de bloc). */
function visibleText(html) {
  let s = html.replace(/<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<noscript\b[\s\S]*?<\/noscript>/gi, BOUNDARY);
  s = s.replace(/<\/?([a-zA-Z][\w:-]*)(?:"[^"]*"|'[^']*'|[^>"'])*>/g, (m, tag) => (INLINE.test(tag) ? '' : BOUNDARY));
  s = decodeEntities(s)
    .replace(/[     ​]/g, ' ')
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[\p{Extended_Pictographic}️‍]/gu, '');
  let text = '';
  const boundary = new Set();
  for (const ch of s) {
    const isBoundary = ch === BOUNDARY;
    if (isBoundary || /\s/.test(ch)) {
      if (text.length === 0 || text.endsWith(' ')) {
        if (isBoundary && text.length > 0) boundary.add(text.length - 1);
        continue;
      }
      if (isBoundary) boundary.add(text.length);
      text += ' ';
    } else text += ch;
  }
  return { text: text.trimEnd(), boundary };
}

/** Un texte de JSON-LD (qui peut porter du HTML), ramené à la même forme que le texte visible. */
const flat = (s) => visibleText(String(s)).text.replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------------------
// LOGO
// ---------------------------------------------------------------------------
function logoUrls(json) {
  const out = [];
  for (const n of nodesOf(json)) {
    if (!('logo' in n)) continue;
    const l = n.logo;
    if (typeof l === 'string') out.push(l);
    else if (l && typeof l === 'object') {
      const u = l.url ?? l.contentUrl ?? l['@id'];
      if (typeof u === 'string') out.push(u);
      else out.push(null); // un `logo` sans URL exploitable
    }
  }
  return out;
}

/** Problèmes de logo d'une page : { message, severity }. `exists(chemin)` dit si un fichier de public/ existe. */
function logoProblems(html, exists) {
  const problems = [];
  for (const b of jsonLdBlocks(html)) {
    if (!b.json) continue;
    for (const u of logoUrls(b.json)) {
      if (u === null) {
        problems.push({ severity: 'fail', message: 'logo sans URL : ni url, ni contentUrl, ni @id' });
        continue;
      }
      if (!u.startsWith(`${SITE_ORIGIN}/`)) {
        problems.push({ severity: 'warn', message: `logo hors du site (${u}) : non vérifiable ici` });
        continue;
      }
      const rel = decodeURIComponent(u.slice(SITE_ORIGIN.length + 1).split(/[?#]/)[0]);
      if (!rel || !exists(`public/${rel}`)) problems.push({ severity: 'fail', message: `logo ${u} : aucun fichier public/${rel} (URL devinée : HTTP 404 en production)` });
    }
  }
  return problems;
}

// ---------------------------------------------------------------------------
// FAQ : la question et la réponse balisées sont celles du texte visible
// ---------------------------------------------------------------------------
function faqProblems(html) {
  const problems = [];
  const starts = lineStarts(html);
  const vis = visibleText(html);
  for (const b of jsonLdBlocks(html)) {
    if (!b.json) continue;
    for (const node of nodesOf(b.json)) {
      if (!typesOf(node).includes('FAQPage')) continue;
      const qs = [].concat(node.mainEntity ?? []);
      qs.forEach((q, i) => {
        const name = flat(q.name ?? '');
        const answer = flat(q.acceptedAnswer?.text ?? '');
        const at = b.raw.indexOf(String(q.name ?? '').slice(0, 30));
        const line = lineAt(starts, b.offset + Math.max(at, 0));
        const label = `question ${i + 1} « ${name.slice(0, 70)} »`;
        if (!name) return problems.push({ line, message: `${label} : question vide` });
        if (!answer) return problems.push({ line, message: `${label} : réponse vide` });
        if (!vis.text.includes(name)) return problems.push({ line, message: `${label} : la question n'est pas dans le texte visible` });
        // la réponse : les mêmes mots, du début à la fin d'un bloc (ou juste après la question), et après
        // la question (une réponse qui ne figure qu'avant elle, ailleurs dans la page, n'est pas la sienne)
        const qEnd = vis.text.indexOf(name) + name.length;
        let found = false;
        let inside = false;
        for (let from = 0; ; ) {
          const idx = vis.text.indexOf(answer, from);
          if (idx < 0) break;
          if (idx >= qEnd) {
            inside = true;
            const end = idx + answer.length;
            const startsOk = idx === 0 || vis.boundary.has(idx - 1) || vis.text.slice(0, idx).trimEnd().endsWith(name);
            const endsOk = end === vis.text.length || vis.boundary.has(end);
            if (startsOk && endsOk) {
              found = true;
              break;
            }
          }
          from = idx + 1;
        }
        if (found) return;
        if (inside) problems.push({ line, message: `${label} : la réponse balisée n'est qu'une partie du bloc visible (abrégée ou prolongée à l'affichage)` });
        else problems.push({ line, message: `${label} : la réponse balisée (« ${answer.slice(0, 60)}… ») n'est pas dans le texte visible après la question ; on y lit « ${vis.text.slice(qEnd, qEnd + 60).trim()}… »` });
      });
    }
  }
  return problems;
}

// ---------------------------------------------------------------------------
// SITEMAP : dates des articles
// ---------------------------------------------------------------------------
/** `dateModified` (AAAA-MM-JJ) du JSON-LD d'un article, ou null. */
function articleDateModified(html) {
  for (const b of jsonLdBlocks(html)) {
    if (!b.json) continue;
    for (const n of nodesOf(b.json)) {
      if (typesOf(n).some((t) => /^(?:Article|BlogPosting|NewsArticle)$/.test(t)) && typeof n.dateModified === 'string') return n.dateModified.slice(0, 10);
    }
  }
  return null;
}

/** Lit sitemap.ts : les tables d'articles { slug, modified } et les `new Date()` sans argument. */
function readSitemap(src) {
  const sf = ts.createSourceFile('sitemap.ts', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const tables = {};
  const dateNow = [];
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && /^(?:EN_)?BLOG_ARTICLES$/.test(n.name.text) && n.initializer && ts.isArrayLiteralExpression(n.initializer)) {
      tables[n.name.text] = n.initializer.elements.map((e) => {
        const o = { slug: null, modified: null, line: sf.getLineAndCharacterOfPosition(e.getStart(sf)).line + 1 };
        if (ts.isObjectLiteralExpression(e)) {
          for (const p of e.properties) {
            if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && ts.isStringLiteral(p.initializer)) o[p.name.text] = p.initializer.text;
          }
        }
        return o;
      });
    }
    if (ts.isNewExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'Date' && (n.arguments?.length ?? 0) === 0) {
      dateNow.push(sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return { tables, dateNow };
}

/**
 * Problèmes du sitemap source. `articles` : { fr: Map(slug -> dateModified|null), en: Map(...) } lu dans les pages.
 */
function sitemapProblems(src, articles) {
  const problems = [];
  const { tables, dateNow } = readSitemap(src);
  for (const line of dateNow) problems.push(`sitemap.ts:${line} new Date() sans argument : la date du build n'est la date de modification de rien`);
  for (const [name, key] of [['BLOG_ARTICLES', 'fr'], ['EN_BLOG_ARTICLES', 'en']]) {
    const table = tables[name];
    if (!table) {
      problems.push(`sitemap.ts : la table ${name} (liste de { slug, modified }) est introuvable`);
      continue;
    }
    const seen = new Set();
    for (const e of table) {
      if (!e.slug || !e.modified) {
        problems.push(`sitemap.ts:${e.line} ${name} : entrée sans « slug » ou sans « modified »`);
        continue;
      }
      seen.add(e.slug);
      if (!articles[key].has(e.slug)) {
        problems.push(`sitemap.ts:${e.line} ${name} : « ${e.slug} » n'est pas un article de public/${key === 'fr' ? 'blog' : 'en/blog'}`);
        continue;
      }
      const real = articles[key].get(e.slug);
      if (real === null) problems.push(`sitemap.ts:${e.line} ${name} : l'article « ${e.slug} » n'a pas de dateModified dans son JSON-LD : la date du sitemap n'est pas vérifiable`);
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(e.modified)) problems.push(`sitemap.ts:${e.line} ${name} : « ${e.modified} » n'est pas une date AAAA-MM-JJ`);
      else if (e.modified !== real) problems.push(`sitemap.ts:${e.line} ${name} : « ${e.slug} » déclare modified ${e.modified}, son JSON-LD dit dateModified ${real}`);
    }
    for (const slug of articles[key].keys()) if (!seen.has(slug)) problems.push(`sitemap.ts : l'article public/${key === 'fr' ? 'blog' : 'en/blog'}/${slug} n'est pas dans ${name}`);
  }
  return problems;
}

/** Problèmes du sitemap construit : seul un article porte un <lastmod>, et c'est la bonne date. */
function builtSitemapProblems(xml, urlToDate) {
  const problems = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(m[1])?.[1];
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(m[1])?.[1];
    if (!loc || !lastmod) continue;
    const real = urlToDate.get(loc);
    if (real === undefined) problems.push(`${loc} : <lastmod> ${lastmod} sur une URL qui n'est pas un article (aucune date de modification connue)`);
    else if (lastmod.slice(0, 10) !== real) problems.push(`${loc} : <lastmod> ${lastmod}, le JSON-LD de l'article dit ${real}`);
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Parcours
// ---------------------------------------------------------------------------
function walk(dir, { exts, skipDirs = [] }) {
  const abs = path.join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) {
      if (!skipDirs.includes(rel)) out.push(...walk(rel, { exts, skipDirs }));
    } else if (exts.some((x) => e.name.endsWith(x))) out.push(rel);
  }
  return out;
}
const read = (f) => readFileSync(path.join(ROOT, f), 'utf8');
const fileExists = (rel) => existsSync(path.join(ROOT, rel)) && statSync(path.join(ROOT, rel)).isFile();

// ---------------------------------------------------------------------------
// Exécution
// ---------------------------------------------------------------------------
{
  const problems = exceptionProblems(EXCEPTIONS);
  if (problems.length) problems.forEach((p) => fail(`EXCEPTIONS : ${p}`));
  else ok(`exceptions : ${EXCEPTIONS.length} déclarée(s), toutes datées et motivées`);
}

const pages = walk('public', { exts: ['.html'], skipDirs: ['public/js', 'public/images', 'public/data', 'public/css'] });
const findings = [];
let blocks = 0;
let faqPages = 0;
let faqQuestions = 0;
let logos = 0;
for (const file of pages) {
  const html = read(file);
  const starts = lineStarts(html);
  for (const b of jsonLdBlocks(html)) {
    blocks++;
    if (!b.json) findings.push({ file, severity: 'fail', message: `${file}:${lineAt(starts, b.offset)} JSON-LD illisible (${b.error})` });
  }
  for (const p of logoProblems(html, fileExists)) findings.push({ file, severity: p.severity, message: `${file} ${p.message}` });
  logos += jsonLdBlocks(html).reduce((n, b) => n + (b.json ? logoUrls(b.json).length : 0), 0);
  const faq = faqProblems(html);
  const nFaq = jsonLdBlocks(html).reduce((n, b) => n + (b.json ? nodesOf(b.json).filter((x) => typesOf(x).includes('FAQPage')).length : 0), 0);
  if (nFaq) {
    faqPages += nFaq;
    faqQuestions += jsonLdBlocks(html).reduce((n, b) => n + (b.json ? nodesOf(b.json).filter((x) => typesOf(x).includes('FAQPage')).reduce((m, x) => m + [].concat(x.mainEntity ?? []).length, 0) : 0), 0);
  }
  for (const p of faq) findings.push({ file, severity: 'fail', message: `${file}:${p.line} FAQPage, ${p.message}` });
}

const { kept, unused } = applyExceptions(findings, EXCEPTIONS);
unused.forEach((e) => fail(`exception inutilisée (${e.file} : « ${e.contains} », ${e.date}) : le défaut a disparu, la retirer`));
for (const f of kept) (f.severity === 'warn' ? warn : fail)(f.message);
const logoFailed = kept.some((f) => f.severity === 'fail' && /logo/.test(f.message));
const faqFailed = kept.some((f) => f.severity === 'fail' && /FAQPage/.test(f.message));
const jsonFailed = kept.some((f) => f.severity === 'fail' && /JSON-LD illisible/.test(f.message));
if (!jsonFailed) ok(`JSON-LD : ${blocks} blocs lisibles dans ${pages.length} pages`);
if (!logoFailed) ok(`logo : ${logos} URL de logo, toutes celles du site pointent vers un fichier de public/`);
if (!faqFailed) ok(`FAQPage : ${faqPages} FAQ, ${faqQuestions} questions, chaque question et chaque réponse figurent en entier dans le texte visible`);

// Sitemap
{
  const sitemapFile = 'src/app/sitemap.ts';
  const articles = { fr: new Map(), en: new Map() };
  for (const [dir, key] of [['public/blog', 'fr'], ['public/en/blog', 'en']]) {
    for (const f of walk(dir, { exts: ['.html'] })) if (!f.endsWith('/index.html')) articles[key].set(path.posix.basename(f), articleDateModified(read(f)));
  }
  const problems = sitemapProblems(read(sitemapFile), articles);
  problems.forEach(fail);
  if (!problems.length) ok(`sitemap : ${articles.fr.size + articles.en.size} articles, chaque date \`modified\` est le dateModified de l'article, aucun new Date() sans argument`);

  const built = '.next/server/app/sitemap.xml.body';
  if (!fileExists(built)) warn(`${built} absent (npm run build) : sitemap construit non vérifié`);
  else if (statSync(path.join(ROOT, built)).mtimeMs < statSync(path.join(ROOT, sitemapFile)).mtimeMs) warn(`${built} plus ancien que ${sitemapFile} : relancer npm run build pour vérifier le sitemap construit`);
  else {
    const urlToDate = new Map();
    for (const [key, base] of [['fr', `${SITE_ORIGIN}/blog/`], ['en', `${SITE_ORIGIN}/en/blog/`]]) for (const [slug, d] of articles[key]) urlToDate.set(`${base}${slug}`, d);
    const bp = builtSitemapProblems(read(built), urlToDate);
    bp.forEach((p) => fail(`sitemap construit : ${p}`));
    if (!bp.length) {
      const dated = [...read(built).matchAll(/<lastmod>/g)].length;
      ok(`sitemap construit : ${dated} <lastmod>, tous sur des articles et à leur vraie date`);
    }
  }
}

// ---------------------------------------------------------------------------
// Tests négatifs permanents
// ---------------------------------------------------------------------------
{
  const before = failures;
  const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
  const faqLd = (qa) => ld({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) });
  const page = (head, body) => `<!DOCTYPE html>\n<html lang="fr">\n<head>\n<meta charset="UTF-8">\n${head}\n<title>t</title>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
  const faq = (qa, body) => faqProblems(page(faqLd(qa), body));
  const cases = [];
  const add = (name, run, expected) => cases.push([name, run, expected]);

  const Q = 'Peut-on changer le plan de cordage ?';
  const A = "Non. Il est fixé par le cadre. Pour ajuster le ressenti, jouez sur la jauge, le type de corde et la tension.";

  // -- FAQ : ce qui DOIT passer ------------------------------------------------------------------
  add('FAQ : <h3> + <p>, mêmes mots', () => faq([[Q, A]], `<h3>${Q}</h3><p>${A}</p>`), 'propre');
  add('FAQ : <p><strong>Question</strong><br>Réponse</p>', () => faq([[Q, A]], `<p><strong>${Q}</strong><br>${A}</p>`), 'propre');
  add('FAQ : réponse sur plusieurs paragraphes', () => faq([[Q, `${A} Deuxième paragraphe.`]], `<h3>${Q}</h3><p>${A}</p><p>Deuxième paragraphe.</p>`), 'propre');
  add('FAQ : réponse en liste', () => faq([[Q, 'Trois choses : la jauge le type de corde la tension']], `<h3>${Q}</h3><p>Trois choses :</p><ul><li>la jauge</li><li>le type de corde</li><li>la tension</li></ul>`), 'propre');
  add('FAQ : balises en ligne, exposant, lien', () => faq([['Quelle série ?', 'À partir de la 4e série (30/1), voir le guide.']], `<h3>Quelle série ?</h3><p>À partir de la 4<sup>e</sup> série (30/1), voir <a href="/g">le guide</a>.</p>`), 'propre');
  add('FAQ : entités, espaces insécables, apostrophes typographiques', () => faq([["Quel est l'écart ?", "L'écart est de 2 kg : c'est tout."]], `<h3>Quel est l&rsquo;écart&nbsp;?</h3><p>L’écart est de 2&nbsp;kg&nbsp;: c’est tout.</p>`), 'propre');
  add('FAQ : emoji décoratifs ignorés', () => faq([['Gratuit ?', 'Oui. Tout est gratuit.']], `<h3>❓ Gratuit ?</h3><p>✅ Oui. Tout est gratuit.</p>`), 'propre');
  add('FAQ : titre « Q1 : » devant la question', () => faq([['Quelle tension ?', 'Entre 22 et 24 kg.']], `<h4>Q1 : Quelle tension ?</h4><p>Entre 22 et 24 kg.</p>`), 'propre');
  add('FAQ : réponse dans le même bloc que la question', () => faq([['Quelle tension ?', 'Entre 22 et 24 kg.']], `<p><strong>Quelle tension ?</strong> Entre 22 et 24 kg.</p>`), 'propre');
  add('page sans FAQPage : rien à vérifier', () => faqProblems(page(ld({ '@type': 'Article', headline: 'h' }), '<p>x</p>')), 'propre');
  add('FAQ : question présente deux fois (sommaire, puis FAQ), mêmes mots', () => faq([[Q, A]], `<ul><li>${Q}</li></ul><h3>${Q}</h3><p>${A}</p>`), 'propre');

  // -- FAQ : ce qui DOIT échouer -----------------------------------------------------------------
  add('FAQ : réponse présente seulement avant la question (ailleurs dans la page)', () => faq([[Q, A]], `<p>${A}</p><h3>${Q}</h3><p>Une autre réponse.</p>`), 'echec');
  add('FAQ : question absente du texte visible', () => faq([[Q, A]], `<h3>Autre question ?</h3><p>${A}</p>`), 'echec');
  add('FAQ : réponse absente du texte visible', () => faq([[Q, A]], `<h3>${Q}</h3>`), 'echec');
  add('FAQ : réponse reformulée', () => faq([[Q, "Non. Le cadre fixe le plan. Jouez sur la jauge, la corde et la tension."]], `<h3>${Q}</h3><p>${A}</p>`), 'echec');
  add('FAQ : réponse abrégée en fin de phrase (une phrase sur trois)', () => faq([[Q, 'Non.']], `<h3>${Q}</h3><p>${A}</p>`), 'echec');
  add('FAQ : réponse abrégée en milieu de phrase, point ajouté', () => faq([[Q, 'Non. Il est fixé par le cadre. Pour ajuster le ressenti, jouez sur la jauge.']], `<h3>${Q}</h3><p>${A}</p>`), 'echec');
  add('FAQ : réponse prolongée dans le JSON-LD', () => faq([[Q, `${A} Un ajout que la page ne dit pas.`]], `<h3>${Q}</h3><p>${A}</p>`), 'echec');
  add('FAQ : réponse prolongée dans la page (le JSON-LD s\'arrête avant la fin du bloc)', () => faq([[Q, 'Non. Il est fixé par le cadre.']], `<h3>${Q}</h3><p>Non. Il est fixé par le cadre. Pour ajuster le ressenti, jouez sur la jauge.</p>`), 'echec');
  add('FAQ : texte présent seulement dans le JSON-LD (les scripts ne comptent pas)', () => faqProblems(`<html><head>${faqLd([[Q, A]])}</head><body><p>rien</p></body></html>`), 'echec');
  add('FAQ : réponse vide', () => faq([[Q, '']], `<h3>${Q}</h3><p>${A}</p>`), 'echec');
  add('FAQ : une question sur deux est absente', () => faq([[Q, A], ['Quelle jauge ?', 'La 17.']], `<h3>${Q}</h3><p>${A}</p>`), 'echec');
  add('FAQ : numéro de ligne', () => {
    const html = page(`${'<meta name="a" content="b">\n'.repeat(3)}${faqLd([[Q, A]])}`, `<h3>${Q}</h3>`);
    const p = faqProblems(html);
    return p.length === 1 && p[0].line === 8 ? p : [];
  }, 'echec');

  // -- LOGO ----------------------------------------------------------------------------------
  const FILES = new Set(['public/apple-touch-icon.png', 'public/icon.svg']);
  const logoOf = (url) => page(ld({ '@type': 'Article', publisher: { '@type': 'Organization', name: 'x', logo: typeof url === 'string' ? { '@type': 'ImageObject', url } : url } }), '<p>x</p>');
  add('logo : /logo.png (absent de public/)', () => logoProblems(logoOf(`${SITE_ORIGIN}/logo.png`), (p) => FILES.has(p)), 'echec');
  add('logo : /assets/logo.png (absent de public/)', () => logoProblems(logoOf(`${SITE_ORIGIN}/assets/logo.png`), (p) => FILES.has(p)), 'echec');
  add('logo : fichier existant', () => logoProblems(logoOf(`${SITE_ORIGIN}/apple-touch-icon.png`), (p) => FILES.has(p)), 'propre');
  add('logo : fichier existant avec ?v=2', () => logoProblems(logoOf(`${SITE_ORIGIN}/icon.svg?v=2`), (p) => FILES.has(p)), 'propre');
  add('logo : chaîne simple vers un fichier absent', () => logoProblems(page(ld({ '@type': 'Organization', logo: `${SITE_ORIGIN}/logo.png` }), ''), (p) => FILES.has(p)), 'echec');
  add('logo : ImageObject sans URL', () => logoProblems(logoOf({ '@type': 'ImageObject', width: 180 }), (p) => FILES.has(p)), 'echec');
  add('logo : hors du site = AVERT, pas un échec', () => logoProblems(logoOf('https://cdn.example.org/logo.png'), (p) => FILES.has(p)), 'avert');
  add('logo : dans un @graph', () => logoProblems(page(ld({ '@context': 'https://schema.org', '@graph': [{ '@type': 'Organization', name: 'x', logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/logo.png` } }] }), ''), (p) => FILES.has(p)), 'echec');

  // -- SITEMAP -------------------------------------------------------------------------------
  const ARTS = { fr: new Map([['a.html', '2026-10-10'], ['b.html', '2026-06-01']]), en: new Map([['c.html', '2026-10-09']]) };
  const SM = (fr, en, extra = '') => `export const BLOG_ARTICLES: Array<{ slug: string; modified: string }> = [${fr}];\nexport const EN_BLOG_ARTICLES: Array<{ slug: string; modified: string }> = [${en}];\n${extra}`;
  const GOOD_FR = "{ slug: 'a.html', modified: '2026-10-10' }, { slug: 'b.html', modified: '2026-06-01' }";
  const GOOD_EN = "{ slug: 'c.html', modified: '2026-10-09' }";
  add('sitemap : dates justes, tous les articles', () => sitemapProblems(SM(GOOD_FR, GOOD_EN), ARTS), 'propre');
  add('sitemap : date qui diverge', () => sitemapProblems(SM("{ slug: 'a.html', modified: '2026-10-11' }, { slug: 'b.html', modified: '2026-06-01' }", GOOD_EN), ARTS), 'echec');
  add('sitemap : article absent de la table', () => sitemapProblems(SM("{ slug: 'a.html', modified: '2026-10-10' }", GOOD_EN), ARTS), 'echec');
  add('sitemap : entrée qui n\'est pas un article', () => sitemapProblems(SM(`${GOOD_FR}, { slug: 'zz.html', modified: '2026-10-10' }`, GOOD_EN), ARTS), 'echec');
  add('sitemap : new Date() sans argument', () => sitemapProblems(SM(GOOD_FR, GOOD_EN, 'const now = new Date();'), ARTS), 'echec');
  add('sitemap : new Date(argument) accepté', () => sitemapProblems(SM(GOOD_FR, GOOD_EN, "const d = new Date('2026-10-10');"), ARTS), 'propre');
  add('sitemap : table absente', () => sitemapProblems("export const BLOG_ARTICLES = [];\n", ARTS), 'echec');
  add('sitemap : date mal formée', () => sitemapProblems(SM("{ slug: 'a.html', modified: '10/10/2026' }, { slug: 'b.html', modified: '2026-06-01' }", GOOD_EN), ARTS), 'echec');
  add('sitemap : article sans dateModified', () => sitemapProblems(SM(GOOD_FR, GOOD_EN), { fr: new Map([['a.html', null], ['b.html', '2026-06-01']]), en: ARTS.en }), 'echec');
  const URLS = new Map([[`${SITE_ORIGIN}/blog/a.html`, '2026-10-10']]);
  const xml = (items) => `<urlset>${items.map(([loc, lm]) => `<url><loc>${loc}</loc>${lm ? `<lastmod>${lm}</lastmod>` : ''}</url>`).join('')}</urlset>`;
  add('sitemap construit : <lastmod> juste sur un article, rien ailleurs', () => builtSitemapProblems(xml([[`${SITE_ORIGIN}/blog/a.html`, '2026-10-10'], [`${SITE_ORIGIN}/racquets/x`, null]]), URLS), 'propre');
  add('sitemap construit : <lastmod> sur une page qui n\'est pas un article', () => builtSitemapProblems(xml([[`${SITE_ORIGIN}/racquets/x`, '2026-10-11T10:00:00.000Z']]), URLS), 'echec');
  add('sitemap construit : <lastmod> d\'un article à la mauvaise date', () => builtSitemapProblems(xml([[`${SITE_ORIGIN}/blog/a.html`, '2026-10-11T10:00:00.000Z']]), URLS), 'echec');

  // -- JSON-LD illisible et exceptions -------------------------------------------------------
  add('JSON-LD illisible détecté', () => jsonLdBlocks(page('<script type="application/ld+json">{"a":</script>', '')).filter((b) => !b.json), 'echec');

  let nFail = 0;
  let nClean = 0;
  let nWarn = 0;
  for (const [name, run, expected] of cases) {
    let found;
    try {
      found = run();
    } catch (e) {
      fail(`test négatif « ${name} » inexécutable : ${e.message}`);
      continue;
    }
    const hardFail = found.some((x) => (x.severity ?? 'fail') === 'fail');
    if (expected === 'echec') {
      nFail++;
      if (!(found.length > 0 && hardFail)) fail(`test négatif : garde-fou muet sur « ${name} » (échec attendu, ${found.length} constat(s))`);
    } else if (expected === 'propre') {
      nClean++;
      if (found.length > 0) fail(`témoin positif refusé : « ${name} » → ${found.map((x) => x.message ?? x).join(' ; ')}`);
    } else {
      nWarn++;
      if (found.length === 0 || hardFail) fail(`test négatif (sévérité) : « ${name} » doit donner un AVERT et aucun échec`);
    }
  }

  // exceptions
  {
    const f = [{ file: 'public/blog/x.html', severity: 'fail', message: 'public/blog/x.html logo https://tennisstringadvisor.org/logo.png : aucun fichier' }];
    const good = [{ file: 'public/blog/x.html', contains: 'logo.png', date: '2026-10-11', reason: 'page historique conservée telle quelle, décision de Pierre' }];
    const r = applyExceptions(f, good);
    if (!(r.kept.length === 0 && r.unused.length === 0)) fail('exception valide : le constat devrait être retiré');
    if (applyExceptions([], good).unused.length !== 1) fail('exception sans constat : doit être signalée inutilisée');
    if (applyExceptions(f, [{ ...good[0], file: 'public/blog/autre.html' }]).kept.length !== 1) fail('exception d\'un autre fichier : ne doit rien retirer');
    if (exceptionProblems(good).length !== 0) fail('exception valide refusée');
    if (exceptionProblems([{ ...good[0], reason: 'court' }]).length === 0) fail('exception au motif d\'une étiquette acceptée');
    if (exceptionProblems([{ ...good[0], date: '11/10/2026' }]).length === 0) fail('exception à la date mal formée acceptée');
  }

  if (failures === before) {
    ok(`tests négatifs : ${nFail} altérations détectées (question absente, réponse reformulée, abrégée, prolongée ; logo absent ; date de sitemap fausse, article oublié, new Date()), ${nClean} témoins acceptés (structures de FAQ, balises en ligne, entités, emoji ; logo existant ; sitemap juste), ${nWarn} cas en AVERT ; lignes et exceptions éprouvées`);
  }
}

process.stdout.write(`\n${failures === 0 ? 'Conforme' : 'NON CONFORME'} — ${failures} échec(s), ${warnings} avertissement(s)\n`);
process.exit(failures === 0 ? 0 : 1);
