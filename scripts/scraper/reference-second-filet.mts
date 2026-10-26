/**
 * Instantané de référence du second filet de l'alerte bras (23/10/2026, avis d'Opus 5.5, point 6 : « aucune note de confort lue
 * par le second filet ne MONTE sans mesure et sans GO » ; point 1 : D2 ne fait que baisser des notes).
 *
 * Fige, pour chaque cordage, ce dont l'alerte bras dépend côté données (famille, rigidité, mesure TWU retenue, note de confort) et,
 * pour chaque raquette, son RA effectif et son poids (≥ 300 g : +4 au confort). Le contrôle 23 de `audit:ratings` compare le
 * catalogue courant à cet instantané : aucune note de confort ne monte ni ne disparaît, aucune alerte de la grille du contrôle 5
 * ne disparaît (moteur réel, deux profils). Le contrôle 22 y retrouve le catalogue d'avant D2 (notes d'avant restaurées).
 *
 *   npx tsx scripts/scraper/reference-second-filet.mts          # vérifie que le fichier versionné est à jour (lecture seule)
 *   npx tsx scripts/scraper/reference-second-filet.mts --write  # le réécrit : seulement après une décision qui le justifie
 *                                                                 (une alerte retirée exige mesure exacte, revue et GO de Pierre)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { stringsDatabase } from '../../src/data/strings-database';
import { racquetsDatabase } from '../../src/data/racquets-database';
import { effectiveRacquetRA } from '../../src/lib/racquet-scoring';

export const REFERENCE_PATH = 'data/reference/second-filet-2026-10-23.json';

export function buildReference(): string {
  const strings = [...stringsDatabase]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((s) => {
      const tab = s.stiffnessByGauge ? Object.values(s.stiffnessByGauge) : [];
      const twu = tab.length > 0 ? Math.max(...tab) : null;
      return `    ${JSON.stringify(s.id)}: ${JSON.stringify({ type: s.type, stiffness: s.stiffness, twu, comfort: s.comfort ?? null })}`;
    });
  const racquets = [...racquetsDatabase]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((r) => `    ${JSON.stringify(r.id)}: ${JSON.stringify({ ra: effectiveRacquetRA(r), weight: r.weight ?? null })}`);
  return [
    '{',
    '  "date": "2026-10-23",',
    '  "description": "Instantané du second filet de l\'alerte bras, après D2 restreint (comfort-recalibration.ts). Contrôles 22 et 23 de audit:ratings.",',
    '  "generator": "scripts/scraper/reference-second-filet.mts",',
    '  "strings": {',
    strings.join(',\n'),
    '  },',
    '  "racquets": {',
    racquets.join(',\n'),
    '  }',
    '}',
    '',
  ].join('\n');
}

const isMain = process.argv[1] && /reference-second-filet\.mts$/.test(process.argv[1].replace(/\\/g, '/'));
if (isMain) {
  const next = buildReference();
  if (process.argv.includes('--write')) {
    writeFileSync(REFERENCE_PATH, next);
    console.log(`${REFERENCE_PATH} écrit (${stringsDatabase.length} cordages, ${racquetsDatabase.length} raquettes)`);
  } else {
    const current = existsSync(REFERENCE_PATH) ? readFileSync(REFERENCE_PATH, 'utf8').replace(/\r\n/g, '\n') : null;
    if (current === next) console.log(`${REFERENCE_PATH} à jour`);
    else {
      console.log(`${REFERENCE_PATH} ${current === null ? 'absent' : 'différent du catalogue courant'} (relancer avec --write seulement si une décision le justifie)`);
      process.exitCode = 1;
    }
  }
}
