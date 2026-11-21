/**
 * QA — aucune donnée d'URL hors liste blanche ne part vers GA4 (21/11/2026, tsa-measure).
 *
 * gtag.js joint à chaque événement `page_location` (URL complète, query comprise) et `page_referrer`. Un formulaire en GET,
 * un lien qui porte un nom ou un numéro, un terme de recherche : tout partait chez Google. Le caviardage du flux GA4 ne
 * remplace que ce qui a la forme d'une adresse e-mail (mesuré : un nom, un téléphone, une adresse doublement encodée
 * passaient en clair). Côté Next, `src/components/analytics/` ne transmet plus que la liste blanche de `url-allowlist.ts`.
 *
 * Ce script échoue si :
 *  (a) le filtre laisse passer un paramètre hors liste blanche, une adresse e-mail (même dans un utm, même encodée), un
 *      fragment, des identifiants, ou abîme ce qui doit passer (chemin lu par A3, utm dans leur encodage d'origine) ;
 *  (b) la liste blanche change sans que ce script change avec elle (un ajout exige un rapport qui lit le paramètre) ;
 *  (c) `analytics.tsx` émet un événement sans le contexte nettoyé : `set` puis `page_view` nettoyés à chaque navigation,
 *      contexte joint EN DERNIER dans `gaEvent` (aucun appelant ne peut le remplacer), aucune URL brute ;
 *  (d) un fichier de `src/` (hors `components/analytics/` et l'initialisation du layout) appelle gtag directement ;
 *  (e) tests négatifs : un filtre ou un composant dégradé est détecté.
 * Avertissement seulement (hors périmètre, à traiter par son propriétaire) : `public/js/analytics.js`, chargé par les pages
 * statiques, configure gtag sans `page_location` nettoyé.
 * Hors de portée du code, donc de ce script : le page_view que GA4 émet SEUL à chaque navigation côté client (amélioration
 * de la mesure, « Page changes based on browser history events ») lit l'URL de la barre d'adresse ; il se coupe dans
 * l'administration GA4, et il double le page_view du composant (mesuré le 21/11/2026).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  GA4_URL_PARAM_ALLOWLIST,
  analyticsPageContext,
  sanitizeUrlForAnalytics,
} from '../src/components/analytics/url-allowlist';

let failures = 0;
let warnings = 0;
const ok = (m: string) => process.stdout.write(`  OK    ${m}\n`);
const fail = (m: string) => {
  failures++;
  process.stdout.write(`  ECHEC ${m}\n`);
};
const warn = (m: string) => {
  warnings++;
  process.stdout.write(`  AVERT ${m}\n`);
};
// Windows écrit des CRLF dans l'arbre de travail (core.autocrlf) : normalisés à la lecture.
const read = (p: string) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

process.stdout.write('--- qa-analytics-url : liste blanche des paramètres d\'URL envoyés à GA4 ---\n');

type Sanitize = (raw: string, base?: string) => string;
const SITE = 'https://tennisstringadvisor.org';

// (a) Le filtre, sur des cas écrits à la main : [entrée, sortie attendue].
const CASES: Array<[string, string]> = [
  [`${SITE}/?email-address=test%40example.com&utm_source=essai`, `${SITE}/?utm_source=essai`],
  [
    `${SITE}/configurator?utm_source=a&utm_medium=b&utm_campaign=hiver%202026&utm_term=c+d&utm_content=e`,
    `${SITE}/configurator?utm_source=a&utm_medium=b&utm_campaign=hiver%202026&utm_term=c+d&utm_content=e`,
  ],
  [`${SITE}/?nom=Jean%20Dupont&tel=0612345678&e=test%2540example.com&utm_source=essai`, `${SITE}/?utm_source=essai`],
  [`${SITE}/?utm_source=x%40y.fr&utm_medium=x@y.fr&utm_campaign=x%2540y.fr&utm_term=ok`, `${SITE}/?utm_term=ok`],
  [`${SITE}/en/configurator?utm_source=a#access_token=secret&type=recovery`, `${SITE}/en/configurator?utm_source=a`],
  [`${SITE}/?UTM_SOURCE=a&Utm_Medium=b&utm_source_platform=c&gclid=d&debug_mode=1`, `${SITE}/`],
  [`${SITE}/blog/guide-tension-cordage-tennis.html`, `${SITE}/blog/guide-tension-cordage-tennis.html`],
  [`${SITE}/en/blog/tennis-elbow-strings.html?ref=x`, `${SITE}/en/blog/tennis-elbow-strings.html`],
  ['https://www.google.com/search?q=cordage+tennis&client=x', 'https://www.google.com/search'],
  ['https://user:motdepasse@tennisstringadvisor.org/compte?token=abc', `${SITE}/compte`],
  ['android-app://com.google.android.gm/', 'android-app://com.google.android.gm/'],
  [`${SITE}/?&&utm_source=a&&`, `${SITE}/?utm_source=a`],
  [`${SITE}/?utm_source=%E0%A4%A&email=%E0%A4%A`, `${SITE}/?utm_source=%E0%A4%A`],
  ['pas une url?email=test@example.com#x', 'pas une url'],
];

// Propriété, sur un échantillon construit : la sortie ne porte jamais de fragment, d'@ ni de clé hors liste blanche.
const PROPERTY_INPUTS: string[] = [];
const keys = [...GA4_URL_PARAM_ALLOWLIST, 'email', 'email-address', 'mail', 'name', 'q', 'search', 'token', 'code', 'utm_id'];
const values = ['essai', 'test@example.com', 'test%40example.com', 'test%2540example.com', 'Jean+Dupont', '0612345678', ''];
for (const k of keys) for (const v of values) PROPERTY_INPUTS.push(`${SITE}/p?${k}=${v}&utm_source=ok#frag=${v}`);

const allowed = new Set<string>(GA4_URL_PARAM_ALLOWLIST);
function checkSanitizer(sanitize: Sanitize): string[] {
  const problems: string[] = [];
  for (const [input, expected] of CASES) {
    const got = sanitize(input);
    if (got !== expected) problems.push(`${input} -> ${got} (attendu : ${expected})`);
  }
  for (const input of PROPERTY_INPUTS) {
    const got = sanitize(input);
    if (got.includes('#')) problems.push(`${input} -> fragment conservé`);
    if (/@|%40/i.test(got)) problems.push(`${input} -> adresse e-mail conservée`);
    const q = got.indexOf('?');
    if (q !== -1) {
      for (const pair of got.slice(q + 1).split('&')) {
        const key = decodeURIComponent(pair.split('=')[0]);
        if (!allowed.has(key)) problems.push(`${input} -> clé hors liste blanche « ${key} »`);
      }
    }
  }
  const ctx = analyticsPageContext(`${SITE}/?email=a%40b.fr`, '');
  if ('page_referrer' in ctx) problems.push('analyticsPageContext : page_referrer présent sans provenance');
  if (ctx.page_location !== `${SITE}/`) problems.push(`analyticsPageContext : page_location = ${ctx.page_location}`);
  const ctx2 = analyticsPageContext(`${SITE}/x`, `${SITE}/blog/a.html?email=a%40b.fr`);
  if (ctx2.page_referrer !== `${SITE}/blog/a.html`) problems.push(`analyticsPageContext : page_referrer = ${ctx2.page_referrer}`);
  return problems;
}

{
  const problems = checkSanitizer(sanitizeUrlForAnalytics);
  if (problems.length) for (const p of problems) fail(`filtre : ${p}`);
  else ok(`filtre : ${CASES.length} cas écrits et ${PROPERTY_INPUTS.length} URL construites, aucune donnée hors liste blanche`);
}

// (b) La liste blanche est épinglée ici. Un ajout se justifie par un rapport qui lit le paramètre (reports/, §2).
{
  const expected = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const actual = [...GA4_URL_PARAM_ALLOWLIST];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`liste blanche modifiée (${actual.join(', ')}) : nommer le rapport qui lit le paramètre, puis mettre ce script à jour`);
  } else {
    ok(`liste blanche : ${actual.join(', ')}`);
  }
}

// (c) Le composant.
const ANALYTICS = 'src/components/analytics/analytics.tsx';
function checkComponent(src: string): string[] {
  const problems: string[] = [];
  if (!/from '\.\/url-allowlist'/.test(src)) problems.push('n\'importe plus url-allowlist');
  const calls = src.match(/window\.gtag\(/g) ?? [];
  if (calls.length !== 3) problems.push(`${calls.length} appels window.gtag (attendu : 3, set + page_view + gaEvent)`);
  // Navigation : contexte construit depuis l'URL des hooks NETTOYÉE, posé par `set`, puis joint au page_view.
  if (!/analyticsPageContext\(\s*sanitizeUrlForAnalytics\(\s*url\s*,/.test(src)) {
    problems.push('page_view : l\'URL de la navigation ne passe plus par sanitizeUrlForAnalytics');
  }
  if (!/window\.gtag\('set',\s*context\)/.test(src)) problems.push('page_view : plus de gtag(\'set\', context)');
  const pv = src.match(/window\.gtag\('event',\s*'page_view',\s*\{([\s\S]*?)\}\);/);
  if (!pv) problems.push('page_view : appel introuvable');
  else {
    if (!/\.\.\.context/.test(pv[1])) problems.push('page_view : contexte nettoyé absent');
    if (/page_path:\s*url\b|searchParams|location\.(href|search)/.test(pv[1])) problems.push('page_view : URL brute transmise');
  }
  // gaEvent : le contexte nettoyé est la DERNIÈRE propagation, après les paramètres de l'appelant.
  const ev = src.match(/const gaEvent = [\s\S]*?window\.gtag\('event',\s*name,\s*\{([\s\S]*?)\}\);/);
  if (!ev) problems.push('gaEvent : appel introuvable');
  else {
    const body = ev[1].trim().replace(/,\s*$/, '');
    if (!/\.\.\.analyticsPageContext\(window\.location\.href,\s*document\.referrer\)$/.test(body)) {
      problems.push('gaEvent : le contexte nettoyé n\'est plus joint en dernier');
    }
    if (!/^\.\.\.params,/.test(body)) problems.push('gaEvent : paramètres de l\'appelant non reconnus');
  }
  return problems;
}
const component = read(ANALYTICS);
{
  const problems = checkComponent(component);
  if (problems.length) for (const p of problems) fail(`${ANALYTICS} : ${p}`);
  else ok(`${ANALYTICS} : set + page_view nettoyés à chaque navigation, contexte joint en dernier à chaque événement`);
}

// (d) Aucun appel direct à gtag ailleurs dans src/ (il échapperait au contexte joint par gaEvent ; `set` ne le couvre
// qu'une fois le composant monté).
// Exception connue, épinglée à sa ligne (tout autre appel du même fichier échoue) : `auth-config.js` (tsa-revenue), callback
// `events.signIn` de NextAuth, exécuté côté serveur où `window` est indéfini — la branche ne s'exécute jamais, et le fichier
// n'est importé nulle part au 21/11/2026.
const KNOWN_DIRECT_CALLS: Array<{ file: string; line: RegExp }> = [
  { file: 'src/lib/auth/auth-config.js', line: /^window\.gtag\('event', 'login', \{$/ },
];
{
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) {
        if (p.replace(/\\/g, '/') !== 'src/components/analytics') walk(p);
      } else if (/\.(tsx?|jsx?|mjs)$/.test(name)) {
        const src = read(p);
        const rel = p.replace(/\\/g, '/');
        for (const line of src.split('\n')) {
          if (!/\bgtag\s*\(/.test(line)) continue;
          // Seule exception : l'initialisation du layout (définition de la file, js, config).
          if (rel === 'src/app/layout.tsx' && /function gtag\(\)|gtag\('js'|gtag\('config'/.test(line)) continue;
          if (KNOWN_DIRECT_CALLS.some((k) => k.file === rel && k.line.test(line.trim()))) continue;
          offenders.push(`${rel} : ${line.trim().slice(0, 100)}`);
        }
      }
    }
  };
  walk('src');
  if (offenders.length) for (const o of offenders) fail(`appel direct à gtag hors src/components/analytics/ : ${o}`);
  else ok('src/ : aucun appel direct à gtag hors du composant (et de l\'initialisation du layout)');
}

// (e) Tests négatifs : chaque dégradation doit être détectée.
{
  const sanitizerMutants: Array<[string, Sanitize]> = [
    ['URL brute', (raw) => raw],
    ['query conservée, fragment retiré', (raw) => raw.split('#')[0]],
    ['tout utm_* accepté', (raw) => {
      try {
        const u = new URL(raw);
        const kept = u.search.slice(1).split('&').filter((p) => /^utm_/.test(p));
        return `${u.origin}${u.pathname}${kept.length ? `?${kept.join('&')}` : ''}`;
      } catch {
        return raw;
      }
    }],
    ['e-mail dans un utm accepté', (raw, base) => sanitizeUrlForAnalytics(raw.replace(/%40|@/g, '_AT_'), base).replace(/_AT_/g, '%40')],
  ];
  const componentMutants: Array<[string, string]> = [
    ['gaEvent sans contexte', component.replace(/\{\s*\.\.\.params,\s*\.\.\.analyticsPageContext\(window\.location\.href, document\.referrer\),?\s*\}/, 'params')],
    ['contexte avant les paramètres', component.replace(/\.\.\.params,(\s*)\.\.\.analyticsPageContext\(window\.location\.href, document\.referrer\),/, '...analyticsPageContext(window.location.href, document.referrer),$1...params,')],
    ['page_path brut', component.replace(/page_path: `\$\{cleaned\.pathname\}\$\{cleaned\.search\}`/, 'page_path: url')],
    ['sans set', component.replace(/\s*window\.gtag\('set', context\);/, '')],
    ['URL de navigation non nettoyée', component.replace(/sanitizeUrlForAnalytics\(url, window\.location\.origin\)/, 'url')],
  ];
  let detected = 0;
  let total = 0;
  for (const [label, mutant] of sanitizerMutants) {
    total++;
    if (checkSanitizer(mutant).length > 0) detected++;
    else fail(`test négatif non détecté (filtre) : ${label}`);
  }
  for (const [label, mutant] of componentMutants) {
    total++;
    if (mutant === component) fail(`test négatif inopérant (composant) : ${label} — motif introuvable`);
    else if (checkComponent(mutant).length > 0) detected++;
    else fail(`test négatif non détecté (composant) : ${label}`);
  }
  if (detected === total) ok(`tests négatifs : ${detected}/${total} dégradations détectées`);
}

// Pages statiques : hors périmètre (public/js/analytics.js), signalé à chaque passage tant que rien ne change.
{
  const js = read('public/js/analytics.js');
  if (!/page_location/.test(js)) {
    warn('public/js/analytics.js : gtag(\'config\') sans page_location nettoyé — les pages statiques envoient la query complète et le referrer complet (caviardage GA4 des seules adresses e-mail)');
  } else {
    ok('public/js/analytics.js : page_location renseigné');
  }
}

if (warnings > 0) process.stdout.write(`\n${warnings} avertissement(s) — hors du périmètre de ce contrôle\n`);
process.stdout.write(
  failures === 0
    ? '\nle code de l\'application Next ne transmet à GA4 aucune donnée d\'URL hors liste blanche\n' +
        '(reste hors de portée du code : le page_view « historique » que GA4 émet seul à chaque navigation côté client,\n' +
        ' réglage d\'administration « Page changes based on browser history events »)\n'
    : `\n${failures} échec(s) — des paramètres d'URL hors liste blanche peuvent partir vers GA4\n`
);
process.exit(failures === 0 ? 0 : 1);
