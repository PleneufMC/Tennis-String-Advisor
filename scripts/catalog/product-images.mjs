/**
 * Photos produit pour les fiches EN statiques (public/en/racquets|strings/<id>.html).
 *
 * Même dispositif que le FR (src/lib/product-images.ts + src/components/product/
 * product-image.tsx), relu ici sans dupliquer la donnée :
 *   - le drapeau PRODUCT_IMAGES_ENABLED est lu dans src/lib/product-images.ts ;
 *   - le manifeste est src/data/product-images.ts (généré par
 *     scripts/scraper/tw_product_images.py, purgeable).
 * Drapeau à false ou manifeste vidé par `purge` : chaque fiche retombe sur
 * l'illustration, sans autre modification.
 *
 * Règles :
 *   - fichiers hébergés chez nous (/images/products/…), jamais de hotlink ;
 *   - aucune photo dans le JSON-LD ni og:image (ce module ne rend qu'un <figure>) ;
 *   - sans photo validée, une ILLUSTRATION générique (trait SVG, nom du produit en
 *     texte, mention « Illustration — photo not available ») : jamais une image
 *     qui pourrait passer pour la photo du produit (règle 3).
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const FOLDER = { racquet: '/images/products/racquets/', string: '/images/products/strings/' };
export const SOURCE_CREDIT = {
  'tennis-warehouse': 'Tennis Warehouse',
  'tennis-warehouse-europe': 'Tennis Warehouse Europe',
  'tennis-point': 'Tennis-Point',
};

const esc = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** { enabled, images } — images vaut {} si le drapeau est coupé. */
export async function loadProductImages(repoRoot) {
  const flagSrc = readFileSync(path.join(repoRoot, 'src/lib/product-images.ts'), 'utf8');
  const flag = flagSrc.match(/^export const PRODUCT_IMAGES_ENABLED = (true|false);$/m);
  if (!flag) throw new Error('PRODUCT_IMAGES_ENABLED introuvable dans src/lib/product-images.ts');
  const enabled = flag[1] === 'true';
  if (!enabled) return { enabled, images: {} };

  const require = createRequire(path.join(repoRoot, 'package.json'));
  const ts = require('typescript');
  const rel = 'src/data/product-images.ts';
  const js = ts.transpileModule(readFileSync(path.join(repoRoot, rel), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
    fileName: rel,
  }).outputText;
  if (/^\s*import\s/m.test(js)) throw new Error(`${rel} importe un autre module : chargeur à adapter`);
  const dir = path.join(tmpdir(), 'tsa-product-images');
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `product-images-${process.pid}-${Date.now()}.mjs`);
  writeFileSync(file, js);
  try {
    const { PRODUCT_IMAGES } = await import(pathToFileURL(file).href);
    return { enabled, images: PRODUCT_IMAGES ?? {} };
  } finally {
    rmSync(file, { force: true });
  }
}

/** Entrée du manifeste pour ce produit, ou null (garde-fou : bon dossier pour le bon type). */
export function productImageFor(images, kind, id) {
  const e = images?.[id];
  return e && e.file.startsWith(FOLDER[kind]) ? e : null;
}

const RACQUET_SVG = `<svg viewBox="0 0 64 128" class="h-[85%] w-auto shrink-0" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><ellipse cx="32" cy="36" rx="24" ry="31"/><path d="M22 64 L29 84 M42 64 L35 84" stroke-linecap="round"/><rect x="28" y="84" width="8" height="38" rx="3"/><path d="M20 22h24M16 36h32M20 50h24M26 9v54M38 9v54" stroke-width="1.2" opacity="0.6"/></svg>`;
const REEL_SVG = `<svg viewBox="0 0 96 96" class="h-[70%] w-auto shrink-0" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><circle cx="48" cy="48" r="38"/><circle cx="48" cy="48" r="28" stroke-width="1.5" opacity="0.7"/><circle cx="48" cy="48" r="20" stroke-width="1.5" opacity="0.7"/><circle cx="48" cy="48" r="9"/><path d="M86 48 C 92 60, 88 76, 74 84" stroke-linecap="round"/></svg>`;

/**
 * <figure> de la fiche EN : photo hébergée (avec crédit) ou illustration.
 * `name` : nom complet du produit (texte, déjà connu de la page).
 */
export function productFigureHtml(images, kind, id, name) {
  const e = productImageFor(images, kind, id);
  const kindLabel = kind === 'racquet' ? 'Racquet' : 'String';
  if (e) {
    const credit = SOURCE_CREDIT[e.source] ?? 'Tennis Warehouse';
    return `    <figure class="mt-6" data-product-image="photo">
      <div class="relative h-72 sm:h-80 overflow-hidden rounded-lg bg-white"><img src="${esc(e.file)}" alt="${esc(`${kindLabel} ${name}`)}" width="${e.width}" height="${e.height}" loading="eager" decoding="async" class="h-full w-full object-contain p-2"></div>
      <figcaption class="mt-1.5 text-xs text-gray-600 dark:text-gray-400">Photo: ${esc(credit)}</figcaption>
    </figure>
`;
  }
  return `    <div class="mt-6 flex h-72 sm:h-80 items-center gap-6 overflow-hidden rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-6 sm:px-10 text-gray-400 dark:text-gray-500" data-product-image="illustration" role="img" aria-label="${esc(`Illustration: ${name} (photo not available)`)}">
      ${kind === 'racquet' ? RACQUET_SVG : REEL_SVG}
      <div class="min-w-0" aria-hidden="true">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">${kindLabel}</p>
        <p class="mt-1 text-xl font-semibold leading-snug text-gray-800 dark:text-gray-100">${esc(name)}</p>
        <p class="mt-3 text-xs italic text-gray-600 dark:text-gray-400">Illustration — photo not available</p>
      </div>
    </div>
`;
}
