// Extraction EN LECTURE SEULE du catalogue TSA (Supabase + fichiers TS du site FR).
// Usage : node dump-catalogue.mjs <racine_depot> <sortie.json>
// Supabase : GET PostgREST uniquement (clé anon publique). Aucune écriture.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';

const repo = path.resolve(process.argv[2] || '.');
const out = process.argv[3] || 'catalogue.json';
const require = createRequire(path.join(repo, 'package.json'));
const ts = require('typescript');

// --- Identifiants Supabase : variables d'env, sinon ceux déjà publics dans public/en/configurator.html
let SUPABASE_URL = process.env.SUPABASE_URL;
let SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  const html = readFileSync(path.join(repo, 'public/en/configurator.html'), 'utf8');
  SUPABASE_URL ||= html.match(/SUPABASE_URL\s*=\s*'([^']+)'/)?.[1];
  SUPABASE_KEY ||= html.match(/SUPABASE_ANON_KEY\s*=\s*'([^']+)'/)?.[1];
}
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Identifiants Supabase introuvables');
const role = JSON.parse(Buffer.from(SUPABASE_KEY.split('.')[1], 'base64url').toString()).role;
if (role !== 'anon') throw new Error(`Clé de rôle "${role}" refusée : ce script n'utilise que la clé anon`);

async function fetchTable(table) {
  const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
  // count(*) exact, indépendant de la pagination
  const head = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    method: 'HEAD', headers: { ...H, Prefer: 'count=exact', Range: '0-0' } });
  const exact = Number((head.headers.get('content-range') || '').split('/')[1]);
  if (!Number.isFinite(exact)) throw new Error(`count exact illisible pour ${table} (HTTP ${head.status})`);
  const rows = []; const page = 500;
  for (let from = 0; ; from += page) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=id.asc`, {
      headers: { ...H, Range: `${from}-${from + page - 1}` } });
    if (!r.ok && r.status !== 206) throw new Error(`${table}: HTTP ${r.status} ${await r.text()}`);
    const batch = await r.json(); rows.push(...batch);
    if (batch.length < page) break;
  }
  if (rows.length !== exact) throw new Error(`${table}: ${rows.length} lignes lues ≠ count exact ${exact}`);
  // ordre des colonnes = ordre de la première ligne (ordre PostgREST = ordinal_position)
  const cols = []; rows.forEach(o => Object.keys(o).forEach(k => cols.includes(k) || cols.push(k)));
  return { table, count_exact: exact, columns: cols, rows };
}

// --- Commentaires attachés à chaque élément du tableau exporté (seule provenance présente dans le TS)
function commentsByElement(file, arrayName) {
  const src = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
  let arr;
  sf.forEachChild(function walk(n) {
    if (ts.isVariableDeclaration(n) && n.name.getText() === arrayName) arr = n.initializer;
    n.forEachChild(walk);
  });
  // lead    : bloc de commentaires juste avant l'objet (verbatim)
  // inner   : commentaires à l'intérieur de l'objet (verbatim)
  // section : dernier bandeau « ==== » rencontré en amont (s'applique au groupe qui suit)
  const map = {}; let section = '';
  const clean = ts_ => ts_.flatMap(t => t.split(/\r?\n/)).map(l => l.trim()).filter(Boolean).join('\n');
  for (const el of arr.elements) {
    const id = el.properties.find(p => p.name?.getText() === 'id').initializer.text;
    const lead = clean((ts.getLeadingCommentRanges(src, el.pos) || []).map(c => src.slice(c.pos, c.end)));
    if (lead.includes('====')) section = lead;
    const inner = []; const seen = new Set();
    const grab = (pos, fn) => (fn(src, pos) || []).forEach(c => { if (!seen.has(c.pos)) { seen.add(c.pos); inner.push(src.slice(c.pos, c.end)); } });
    el.forEachChild(function walk(n) { grab(n.pos, ts.getLeadingCommentRanges); grab(n.end, ts.getTrailingCommentRanges); n.forEachChild(walk); });
    grab(el.getEnd() - 1, ts.getLeadingCommentRanges);
    map[id] = { lead, inner: clean(inner), section };
  }
  return map;
}

function git(...a) { return execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8' }).trim(); }
function fileInfo(rel) {
  return { file: rel, head: git('rev-parse', '--short', 'HEAD'), branch: git('rev-parse', '--abbrev-ref', 'HEAD'),
    last_commit: git('log', '-1', '--format=%h %ci', '--', rel), dirty: git('status', '--porcelain', '--', rel) !== '' };
}

const sMod = await import(pathToFileURL(path.join(repo, 'src/data/strings-database.ts')).href);
const rMod = await import(pathToFileURL(path.join(repo, 'src/data/racquets-database.ts')).href);

const result = {
  generated_at: new Date().toISOString(),
  supabase: { url: SUPABASE_URL, key_role: role,
    racquets: await fetchTable('racquets'), strings: await fetchTable('strings') },
  ts: {
    racquets: { ...fileInfo('src/data/racquets-database.ts'), export: 'racquetsDatabase', rows: rMod.racquetsDatabase,
      comments: commentsByElement(path.join(repo, 'src/data/racquets-database.ts'), 'racquetsDatabase') },
    strings: { ...fileInfo('src/data/strings-database.ts'), export: 'stringsDatabase', rows: sMod.stringsDatabase,
      comments: commentsByElement(path.join(repo, 'src/data/strings-database.ts'), 'stringsDatabase'),
      removed_ids: sMod.REMOVED_STRING_IDS, legacy_aliases: sMod.LEGACY_STRING_ALIASES },
  },
};
for (const k of ['racquets', 'strings']) {
  const t = result.ts[k];
  if (Object.keys(t.comments).length !== t.rows.length) throw new Error(`${k}: commentaires/éléments désalignés`);
}
writeFileSync(out, JSON.stringify(result, null, 1));
console.log(`OK supabase racquets=${result.supabase.racquets.count_exact} strings=${result.supabase.strings.count_exact} | TS racquets=${result.ts.racquets.rows.length} strings=${result.ts.strings.rows.length}`);
