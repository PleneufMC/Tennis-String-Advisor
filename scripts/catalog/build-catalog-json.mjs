#!/usr/bin/env node
/**
 * Génère public/data/catalog.json depuis src/data/*.ts (chantier C3).
 * Branché en `prebuild` et `predev` : Netlify l'exécute à chaque `npm run build`.
 * Usage : npm run build:catalog
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOG_JSON_PATH, buildCatalog, loadTsCatalog, serializeCatalog } from './catalog-json.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const { racquetsDatabase, stringsDatabase } = await loadTsCatalog(repoRoot);
const catalog = buildCatalog(racquetsDatabase, stringsDatabase);
const out = path.join(repoRoot, CATALOG_JSON_PATH);
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, serializeCatalog(catalog));
console.log(`catalog.json : ${catalog.meta.counts.racquets} raquettes, ${catalog.meta.counts.strings} cordages -> ${CATALOG_JSON_PATH}`);
