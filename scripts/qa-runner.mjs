#!/usr/bin/env node
/**
 * Runner QA — exécute TOUS les contrôles, puis rend un verdict agrégé.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * `audit:all` était une chaîne `&&` : le premier maillon rouge tuait la suite.
 * Comme `audit:style-contrast` sort en 1 (33 contrastes sous le seuil AA,
 * dette antérieure et connue), la chaîne mourait au 2e maillon sur 5 —
 * `audit:database`, `audit:ratings` et `audit:security` n'étaient JAMAIS
 * atteints. Le §6 fait pourtant de `audit:all` le préalable à toute PR : la
 * Definition of Done était donc inatteignable.
 *
 * Ici, chaque maillon s'exécute quoi qu'il arrive. Le script sort en 1 si au
 * moins un contrôle échoue — on voit l'état complet, on ne perd pas le signal.
 */

import { spawnSync } from 'node:child_process';

const CHECKS = [
  { name: 'contrast', cmd: 'npm', args: ['run', '--silent', 'audit:contrast'] },
  { name: 'style-contrast', cmd: 'npm', args: ['run', '--silent', 'audit:style-contrast'] },
  { name: 'database', cmd: 'npm', args: ['run', '--silent', 'audit:database'] },
  { name: 'ratings', cmd: 'npm', args: ['run', '--silent', 'audit:ratings'] },
  { name: 'security', cmd: 'npm', args: ['run', '--silent', 'audit:security'] },
];

const results = [];
for (const check of CHECKS) {
  process.stdout.write(`\n=== ${check.name} ===\n`);
  const r = spawnSync(check.cmd, check.args, { stdio: 'inherit', shell: process.platform === 'win32' });
  results.push({ name: check.name, code: r.status ?? 1 });
}

process.stdout.write('\n--- recapitulatif ---\n');
for (const r of results) {
  process.stdout.write(`  ${r.code === 0 ? 'OK   ' : 'ECHEC'} ${r.name}\n`);
}
const failed = results.filter((r) => r.code !== 0);
process.stdout.write(`\n${results.length - failed.length}/${results.length} controles verts\n`);
if (failed.length > 0) {
  process.stdout.write(`Echecs : ${failed.map((f) => f.name).join(', ')}\n`);
  process.exit(1);
}
