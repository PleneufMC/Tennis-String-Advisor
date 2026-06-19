/**
 * Mapping des routes entre l'application Next (FR, servie à la racine `/`) et
 * le site statique anglais (pages `.html` servies sous `/en/`).
 *
 * Contexte : la version anglaise du site n'est PAS une route Next — c'est un
 * ensemble de pages HTML statiques (`public/en/*.html`). Le sélecteur de langue
 * doit donc *naviguer* d'un univers à l'autre, et non se contenter de traduire
 * l'UI en place (sinon le contenu EN — dont le blog — reste inaccessible).
 *
 * Règle : on ne cible QUE des URL qui résolvent réellement. Quand une route
 * FR n'a pas d'équivalent EN (ou inversement), on retombe sur la home de la
 * langue cible (`/en/` ou `/`) plutôt que d'exposer un 404.
 */

/** Préfixe des pages statiques anglaises. */
export const EN_PREFIX = '/en';

/**
 * Équivalences FR (route app) -> EN (page statique).
 * La clé est le chemin app SANS slash final (sauf la racine `/`).
 */
const FR_TO_EN: Record<string, string> = {
  '/': '/en/',
  '/configurator': '/en/configurator.html',
  '/racquets': '/en/racquets.html',
  '/tennis-strings': '/en/strings.html',
  '/compare': '/en/compare.html',
  '/pricing': '/en/premium.html',
  '/blog': '/en/blog/',
  '/account/configurations': '/en/setups.html',
};

/** Équivalences EN (page statique) -> FR (route app), dérivées de FR_TO_EN. */
const EN_TO_FR: Record<string, string> = Object.entries(FR_TO_EN).reduce(
  (acc, [fr, en]) => {
    acc[normalizeEn(en)] = fr;
    return acc;
  },
  {} as Record<string, string>
);

/** Normalise un chemin : retire le slash final (sauf racine), enlève la query/hash. */
function normalizePath(path: string): string {
  const clean = path.split('#')[0].split('?')[0];
  if (clean === '/' || clean === '') return '/';
  return clean.replace(/\/+$/, '');
}

/** Normalise un chemin EN pour la table inverse (slash final retiré sauf racines). */
function normalizeEn(path: string): string {
  if (path === '/en/' || path === '/en') return '/en/';
  if (path === '/en/blog/' || path === '/en/blog') return '/en/blog/';
  return path.replace(/\/+$/, '');
}

/** Indique si un chemin appartient au site statique anglais. */
export function isEnglishPath(path: string): boolean {
  const p = normalizePath(path);
  return p === EN_PREFIX || p.startsWith(`${EN_PREFIX}/`);
}

/**
 * Renvoie l'URL équivalente dans la langue cible.
 * - FR -> EN : utilise FR_TO_EN, fallback `/en/`.
 * - EN -> FR : utilise EN_TO_FR (avec gestion des articles de blog), fallback `/`.
 */
export function getAlternateUrl(
  currentPath: string,
  target: 'fr' | 'en'
): string {
  const p = normalizePath(currentPath);

  if (target === 'en') {
    // Article de blog FR -> index blog EN (pas de mapping 1:1 des articles).
    if (p.startsWith('/blog/') && p !== '/blog') return '/en/blog/';
    return FR_TO_EN[p] ?? '/en/';
  }

  // target === 'fr'
  if (p.startsWith('/en/blog/') && normalizeEn(p) !== '/en/blog/') return '/blog/';
  return EN_TO_FR[normalizeEn(p)] ?? '/';
}
