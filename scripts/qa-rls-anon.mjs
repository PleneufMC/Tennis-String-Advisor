#!/usr/bin/env node
/**
 * qa-rls-anon.mjs
 * ---------------------------------------------------------------------------
 * Verifie ce que la clef ANONYME peut reellement faire sur public.strings et
 * public.racquets. A lancer AVANT et APRES la migration
 * migrations/2026-08-08__durcir_rls_strings_racquets.sql pour constater l'effet.
 *
 * NON DESTRUCTIF : aucune donnee existante n'est modifiee ni supprimee.
 *
 * METHODE — et pourquoi les sondes naives sont trompeuses
 * -------------------------------------------------------
 * 1. DELETE sur un identifiant inexistant renvoie 204 MEME si RLS bloque :
 *    « zero ligne concernee » est un succes vide. Ce 204 ne prouve rien.
 *    => On teste donc le DELETE sur une ligne SONDE qu'on vient d'inserer,
 *       et seulement si l'INSERT a reussi.
 *
 * 2. Un POST avec une colonne inexistante renvoie 400 PGRST204, emis par
 *    PostgREST AVANT toute evaluation RLS. Ce 400 ne prouve rien non plus.
 *    => On envoie donc une charge utile aux colonnes VALIDES, et on lit le
 *       code PostgreSQL 42501 qui, lui, atteste du blocage par RLS.
 *
 * Usage :
 *   node scripts/qa-rls-anon.mjs
 *   SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/qa-rls-anon.mjs
 */

const URL_BASE = process.env.SUPABASE_URL
  || 'https://yhhdkllbaxuhwrfpsmev.supabase.co';
const ANON = process.env.SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGRrbGxiYXh1aHdyZnBzbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjI0MDEsImV4cCI6MjA4MTMzODQwMX0.2aC_gYZf0xxz6MXi5zcaCH2S64RBaQvXU7a5qiuD0_k';

const PROBE_ID = '__qa_rls_probe__';
const TABLES = ['strings', 'racquets'];

const H = {
  apikey: ANON,
  Authorization: `Bearer ${ANON}`,
  'Content-Type': 'application/json',
};

/** Charge utile minimale valide pour chaque table (colonnes NOT NULL). */
const PAYLOAD = {
  strings: { id: PROBE_ID, brand: 'QA_PROBE', model: 'QA_PROBE', type: 'Polyester' },
  racquets: { id: PROBE_ID, brand: 'QA_PROBE', model: 'QA_PROBE', weight: 300, head_size: 100 },
};

let anonCanWrite = false;
const blockingMechanisms = new Set();
const results = [];

/** Nombre de lignes visibles, via l'en-tete Content-Range. */
async function countRows(table) {
  const r = await fetch(`${URL_BASE}/rest/v1/${table}?select=*`, {
    method: 'HEAD',
    headers: { ...H, Prefer: 'count=exact', Range: '0-0' },
  });
  const cr = r.headers.get('content-range');
  return cr ? (cr.split('/')[1] ?? '?') : '?';
}

async function probe(table) {
  const before = await countRows(table);

  // --- SELECT : doit rester autorise (le site public en depend) -----------
  const sel = await fetch(`${URL_BASE}/rest/v1/${table}?select=id&limit=1`, { headers: H });
  results.push({
    table, op: 'SELECT', code: sel.status,
    verdict: sel.ok ? 'autorise (attendu)' : 'BLOQUE — le site public casserait',
    ok: sel.ok,
  });

  // --- INSERT : le code 42501 atteste d'un blocage par RLS ----------------
  const ins = await fetch(`${URL_BASE}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify(PAYLOAD[table]),
  });
  const insBody = await ins.text();
  const inserted = ins.ok;
  if (inserted) anonCanWrite = true;

  // Le code 42501 (insufficient_privilege) ne dit PAS quel mecanisme a refuse.
  // Il faut lire le MESSAGE pour distinguer les deux barrieres :
  //   "permission denied for table X"                    -> GRANT (privilege de table)
  //   "new row violates row-level security policy"       -> RLS  (politique)
  // Ma version precedente concluait "bloque par RLS" sur le seul code : faux.
  const byGrant = /permission denied for table/i.test(insBody);
  const byRls = /row-level security/i.test(insBody);
  const mechanism = byGrant ? 'GRANT (privilege de table)'
    : byRls ? 'RLS (politique)'
    : `autre (${ins.status})`;
  if (!inserted) blockingMechanisms.add(mechanism);

  results.push({
    table, op: 'INSERT', code: ins.status,
    verdict: inserted
      ? 'AUTORISE — un visiteur peut ecrire dans le catalogue'
      : `bloque par ${mechanism}`,
    ok: !inserted,
  });

  // --- DELETE : concluant UNIQUEMENT sur la ligne sonde inseree -----------
  if (inserted) {
    const del = await fetch(`${URL_BASE}/rest/v1/${table}?id=eq.${PROBE_ID}`, {
      method: 'DELETE', headers: H,
    });
    const still = await fetch(
      `${URL_BASE}/rest/v1/${table}?id=eq.${PROBE_ID}&select=id`, { headers: H });
    const gone = (await still.json()).length === 0;

    results.push({
      table, op: 'DELETE', code: del.status,
      verdict: gone
        ? 'AUTORISE — un visiteur peut supprimer le catalogue'
        : 'bloque (la sonde subsiste)',
      ok: !gone,
    });

    if (!gone) {
      console.error(`\n  ⚠️  La ligne sonde "${PROBE_ID}" subsiste dans ${table}.`);
      console.error('      A supprimer manuellement :');
      console.error(`      DELETE FROM public.${table} WHERE id = '${PROBE_ID}';`);
    }
  } else {
    results.push({
      table, op: 'DELETE', code: '—',
      verdict: 'non teste : INSERT bloque, donc pas de ligne sonde a supprimer',
      ok: true, skipped: true,
    });
  }

  const after = await countRows(table);
  if (before !== after) {
    console.error(`\n  ⚠️  ${table} : ${before} -> ${after} lignes. Verifiez manuellement.`);
  }
  return { before, after };
}

console.log('=== Droits reels de la clef ANONYME ===\n');
console.log(`Instance : ${URL_BASE}\n`);

const counts = {};
for (const t of TABLES) counts[t] = await probe(t);

console.log('  Table     Operation  HTTP  Verdict');
console.log('  ' + '-'.repeat(74));
for (const r of results) {
  const flag = r.skipped ? '·' : (r.ok ? '✓' : '✗');
  console.log(`  ${flag} ${r.table.padEnd(9)} ${r.op.padEnd(9)} ${String(r.code).padEnd(5)} ${r.verdict}`);
}

console.log('\n  Lignes (inchangees si la sonde est propre) :');
for (const t of TABLES) console.log(`    ${t.padEnd(10)} ${counts[t].before} -> ${counts[t].after}`);

console.log();
if (anonCanWrite) {
  console.log('❌ ECRITURE ANONYME POSSIBLE — appliquez la migration :');
  console.log('   migrations/2026-08-08__durcir_rls_strings_racquets.sql');
  process.exit(1);
}
console.log('✅ La clef anonyme est en LECTURE SEULE sur strings et racquets.');
console.log(`   Mecanisme(s) de blocage observe(s) : ${[...blockingMechanisms].join(', ')}`);
console.log('   Note : le code 42501 seul ne prouve pas que RLS soit la cause ;');
console.log('   c\'est le message qui distingue GRANT de RLS.');
process.exit(0);
