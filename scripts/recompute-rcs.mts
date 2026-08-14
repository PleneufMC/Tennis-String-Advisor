#!/usr/bin/env tsx
/**
 * Recalcul des scores RCS stockés, après l'harmonisation d'échelle du
 * 14/08/2026 (cf. `calculateRCS` dans src/data/strings-database.ts).
 *
 * POURQUOI RECALCULER PLUTÔT QU'EFFACER
 * -------------------------------------
 * Les deux tables stockent les ENTRÉES du calcul à côté du résultat :
 *   - Prisma  `Configuration` : racquetId, mainStringId, crossStringId,
 *     mainTension, crossTension
 *   - Supabase `user_setups` : racquet_id, string_id, tension
 * Le score est donc une donnée dérivée, entièrement reconstructible. Aucun
 * historique n'est perdu — contrairement à un effacement.
 *
 * SÉCURITÉ
 * --------
 * Le script est en LECTURE SEULE par défaut : il affiche ce qu'il changerait
 * et sort. Il n'écrit qu'avec `--apply` explicite.
 *
 *   npx tsx scripts/recompute-rcs.mts            # simulation (défaut)
 *   npx tsx scripts/recompute-rcs.mts --apply    # écriture réelle
 *
 * Prérequis : DATABASE_URL (Prisma) et/ou SUPABASE_URL + SUPABASE_SERVICE_KEY.
 * Chaque source absente est ignorée avec un message, sans faire échouer le run.
 */

import { existsSync, readFileSync } from 'node:fs';
import { stringsDatabase, calculateRCS } from '../src/data/strings-database';
import { racquetsDatabase } from '../src/data/racquets-database';
import { effectiveRacquetRA } from '../src/lib/racquet-scoring';

/**
 * Charge `.env` (puis `.env.local`) sans dépendance externe.
 * `tsx` ne le fait pas tout seul — sans ceci le script sortait toujours
 * « identifiants absents », même avec un .env correctement rempli.
 * Une variable déjà présente dans l'environnement n'est jamais écrasée.
 */
function loadEnvFiles() {
  for (const file of ['.env', '.env.local']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i.exec(line);
      if (!m || line.trimStart().startsWith('#')) continue;
      const key = m[1];
      let value = m[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (value && process.env[key] === undefined) process.env[key] = value;
    }
  }
}
loadEnvFiles();

const APPLY = process.argv.includes('--apply');

const racquetById = new Map(racquetsDatabase.map((r) => [r.id, r]));
const stringById = new Map(stringsDatabase.map((s) => [s.id, s]));

/** Recalcule un score, ou explique pourquoi c'est impossible. */
function recompute(
  racquetId: string | null,
  mainStringId: string | null,
  crossStringId: string | null,
  mainTension: number | null,
  crossTension: number | null
): { value: number } | { skip: string } {
  const racquet = racquetId ? racquetById.get(racquetId) : undefined;
  const main = mainStringId ? stringById.get(mainStringId) : undefined;
  if (!racquet) return { skip: `raquette introuvable au catalogue : ${racquetId ?? 'null'}` };
  if (!main) return { skip: `cordage introuvable au catalogue : ${mainStringId ?? 'null'}` };
  if (mainTension == null) return { skip: 'tension absente' };

  const ra = effectiveRacquetRA(racquet);
  const cross = crossStringId ? stringById.get(crossStringId) : undefined;
  const tCross = crossTension ?? mainTension;

  // Même logique que le configurateur : moyenne des deux emplacements quand
  // le montage est hybride, sinon l'indice du cordage unique.
  const avgTension = (mainTension + tCross) / 2;
  const mainRcs = calculateRCS(ra, main.stiffness, avgTension);
  if (!cross) return { value: mainRcs };
  const crossRcs = calculateRCS(ra, cross.stiffness, tCross);
  return { value: Math.round((mainRcs + crossRcs) / 2) };
}

type Row = { id: string; before: number | null; after: number };
const summary: Array<{ source: string; updated: Row[]; skipped: string[] }> = [];

// ---------------------------------------------------------------------------
// Source 1 — Prisma / Postgres (site français)
// ---------------------------------------------------------------------------
async function runPrisma() {
  if (!process.env.DATABASE_URL) {
    console.log('· Prisma ignoré : DATABASE_URL absent de l\'environnement.');
    return;
  }
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.configuration.findMany();
    const updated: Row[] = [];
    const skipped: string[] = [];
    for (const c of rows) {
      const res = recompute(c.racquetId, c.mainStringId, c.crossStringId, c.mainTension, c.crossTension);
      if ('skip' in res) {
        skipped.push(`${c.id} — ${res.skip}`);
        continue;
      }
      if (res.value === c.rcsScore) continue;
      updated.push({ id: c.id, before: c.rcsScore, after: res.value });
      if (APPLY) {
        await prisma.configuration.update({ where: { id: c.id }, data: { rcsScore: res.value } });
      }
    }
    summary.push({ source: `Prisma Configuration (${rows.length} lignes)`, updated, skipped });
  } finally {
    await prisma.$disconnect();
  }
}

// ---------------------------------------------------------------------------
// Source 2 — Supabase (pages anglaises statiques)
// ---------------------------------------------------------------------------
async function runSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.log('· Supabase ignoré : SUPABASE_URL et/ou SUPABASE_SERVICE_KEY absents.');
    return;
  }
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  const res = await fetch(`${url}/rest/v1/user_setups?select=id,racquet_id,string_id,tension,rcs_score`, { headers });
  if (!res.ok) throw new Error(`Supabase ${res.status} ${await res.text()}`);
  const rows = (await res.json()) as Array<{
    id: string; racquet_id: string | null; string_id: string | null;
    tension: number | null; rcs_score: number | null;
  }>;

  const updated: Row[] = [];
  const skipped: string[] = [];
  for (const s of rows) {
    const out = recompute(s.racquet_id, s.string_id, null, s.tension, null);
    if ('skip' in out) {
      skipped.push(`${s.id} — ${out.skip}`);
      continue;
    }
    if (out.value === s.rcs_score) continue;
    updated.push({ id: s.id, before: s.rcs_score, after: out.value });
    if (APPLY) {
      const up = await fetch(`${url}/rest/v1/user_setups?id=eq.${s.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ rcs_score: out.value }),
      });
      if (!up.ok) throw new Error(`PATCH ${s.id} : ${up.status} ${await up.text()}`);
    }
  }
  summary.push({ source: `Supabase user_setups (${rows.length} lignes)`, updated, skipped });
}

// ---------------------------------------------------------------------------
async function main() {
  console.log(APPLY ? '=== RECALCUL RCS — ÉCRITURE RÉELLE ===' : '=== RECALCUL RCS — SIMULATION (aucune écriture) ===');
  await runPrisma();
  await runSupabase();

  if (summary.length === 0) {
    console.log('\nAucune source de données accessible. Renseignez DATABASE_URL et/ou SUPABASE_URL + SUPABASE_SERVICE_KEY.');
    return;
  }
  for (const s of summary) {
    console.log(`\n--- ${s.source}`);
    console.log(`    ${s.updated.length} score(s) à mettre à jour, ${s.skipped.length} ignoré(s)`);
    for (const r of s.updated.slice(0, 20)) console.log(`      ${r.id} : ${r.before} -> ${r.after}`);
    if (s.updated.length > 20) console.log(`      … et ${s.updated.length - 20} autres`);
    for (const k of s.skipped.slice(0, 10)) console.log(`      ignoré ${k}`);
  }
  if (!APPLY) console.log('\nSimulation terminée. Relancez avec --apply pour écrire.');
}

main().catch((e) => {
  console.error('Échec :', e instanceof Error ? e.message : e);
  process.exit(1);
});
