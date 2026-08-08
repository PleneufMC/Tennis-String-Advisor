#!/usr/bin/env node
/**
 * Garde-fou : texte clair hérité sur fond clair (bug d'illisibilité mobile)
 * =============================================================================
 * MÉCANIQUE DU BUG
 * Le <body> porte `dark:text-slate-100`. En thème sombre, tout texte qui ne
 * définit pas sa propre couleur hérite donc d'un blanc cassé (#f1f5f9). Si son
 * conteneur impose un fond clair EN DUR (`bg-white`, `backgroundColor: 'white'`,
 * sans variante `dark:`), on obtient du blanc sur blanc : contraste 1.10:1,
 * texte littéralement invisible. C'est ce qu'ont montré les captures mobile.
 *
 * Ce script relit le HTML SERVI et simule l'héritage CSS descendant, ce qui
 * détecte le défaut même quand fond et texte sont déclarés dans des fichiers
 * différents (page, composant, composant de base).
 *
 * Prérequis : `npm run build && npx next start -p 3000` (ou --base <url>).
 * Usage :
 *   node scripts/qa-inherited-text.mjs
 *   node scripts/qa-inherited-text.mjs --base http://localhost:3000
 */

const args = process.argv.slice(2);
const baseIdx = args.indexOf('--base');
const BASE = baseIdx !== -1 ? args[baseIdx + 1] : 'http://localhost:3000';

const ROUTES = [
  '/',
  '/tennis-strings',
  '/racquets',
  '/compare',
  '/configurator',
  '/statistics',
  '/pricing',
  '/payment-success',
  '/payment-cancelled',
];

// Classes Tailwind fixant une couleur de texte (toute palette, toute nuance).
const TEXT_COLOR =
  /\btext-(?:gray|slate|zinc|neutral|stone|black|white|green|blue|red|amber|orange|purple|emerald|yellow|indigo|pink|rose|teal|cyan|lime|violet|fuchsia|sky)(?:-\d{2,3})?\b/;
// Fonds clairs en dur : le texte hérité y devient invisible en thème sombre.
const BG_LIGHT = /\bbg-(?:white|gray-50|gray-100|slate-50|slate-100|zinc-50|neutral-50|stone-50)\b/;
// Fonds foncés ou colorés : le texte clair hérité y reste lisible.
const BG_DARK =
  /\bbg-(?:(?:gray|slate|zinc|neutral|stone|green|blue|red|amber|orange|purple|emerald|indigo|teal|cyan|violet|rose|pink|sky)-(?:[5-9]00|950)|black)\b/;
// Un dégradé porte sa propre teinte : hors périmètre de ce contrôle.
const BG_GRADIENT = /\bbg-gradient-to-|\bfrom-\w+-\d{2,3}\b/;
// Variables de surface : elles basculent avec le thème, donc sûres.
const BG_VAR = /var\(--surface-(?:card|muted|input)\)/;
// Éléments non porteurs de texte visible.
const SKIP_TAGS = new Set([
  'script', 'style', 'svg', 'path', 'circle', 'line', 'rect', 'polygon',
  'polyline', 'ellipse', 'defs', 'g', 'use', 'head', 'meta', 'link', 'title',
  'noscript', 'template', 'br', 'img', 'hr', 'source', 'input',
]);
const VOID_TAGS = new Set([
  'br', 'img', 'hr', 'input', 'meta', 'link', 'source', 'area', 'base',
  'col', 'embed', 'param', 'track', 'wbr',
]);

/**
 * Parcourt le HTML en maintenant une pile d'états hérités {color, bg}.
 * color: 'INHERITED_LIGHT' (héritée du body en thème sombre) | 'OWN'
 * bg:    'LIGHT' (clair en dur) | 'SAFE' (foncé, dégradé, variable, ou body)
 */
function scan(rawHtml) {
  // Retire les commentaires HTML : Next.js insère des marqueurs Suspense
  // (<!--$-->, <!--/$-->) que le parcours prendrait pour du texte visible.
  const html = rawHtml.replace(/<!--[\s\S]*?-->/g, '');
  const findings = [];
  // Racine : le body impose une couleur claire héritée en thème sombre.
  const stack = [{ color: 'INHERITED_LIGHT', bg: 'SAFE' }];
  const skipDepth = { n: 0 };

  const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const [, closing, rawTag, attrs, selfClose, text] = m;

    if (text !== undefined) {
      if (skipDepth.n > 0) continue;
      const t = text.replace(/\s+/g, ' ').trim();
      if (t.length < 3) continue;
      const st = stack[stack.length - 1];
      if (st.bg === 'LIGHT' && st.color === 'INHERITED_LIGHT') {
        findings.push(t.slice(0, 60));
      }
      continue;
    }

    const tag = rawTag.toLowerCase();

    if (closing) {
      if (SKIP_TAGS.has(tag) && skipDepth.n > 0) skipDepth.n--;
      // Les balises ignorées (svg, script…) ne sont jamais empilées : les
      // dépiler ferait perdre l'état du parent réel. Sans cette symétrie, un
      // bouton contenant une icône <svg> voyait son propre `text-white`
      // disparaître, et son libellé était signalé à tort.
      if (!VOID_TAGS.has(tag) && !SKIP_TAGS.has(tag) && stack.length > 1) stack.pop();
      continue;
    }

    const cls = (/\bclass=["']([^"']*)["']/.exec(attrs) || [, ''])[1];
    const style = (/\bstyle=["']([^"']*)["']/.exec(attrs) || [, ''])[1];

    const st = { ...stack[stack.length - 1] };
    // Le <body> est un cas à part : il porte `text-slate-900 dark:text-slate-100`.
    // En thème sombre c'est la variante `dark:` qui l'emporte, donc sa couleur
    // « claire » doit rester considérée comme héritée — sinon tous ses
    // descendants passent à tort pour colorés et le contrôle ne détecte rien.
    const isBody = tag === 'body';
    if (!isBody && (TEXT_COLOR.test(cls) || /(?:^|;)\s*color\s*:/.test(style))) st.color = 'OWN';
    if (BG_VAR.test(style) || BG_GRADIENT.test(cls)) st.bg = 'SAFE';
    else if (BG_LIGHT.test(cls) || /background(?:-color)?\s*:\s*(?:white|#fff)/i.test(style)) st.bg = 'LIGHT';
    else if (BG_DARK.test(cls)) st.bg = 'SAFE';

    if (SKIP_TAGS.has(tag) && !VOID_TAGS.has(tag)) skipDepth.n++;
    // Symétrique du dépilement ci-dessus : on n'empile pas les balises ignorées.
    if (!VOID_TAGS.has(tag) && !SKIP_TAGS.has(tag) && !selfClose) stack.push(st);
  }
  return findings;
}

console.log('═══ Texte clair hérité sur fond clair (thème sombre) ═══\n');
console.log(`  base : ${BASE}\n`);

let total = 0;
let unreachable = 0;

for (const route of ROUTES) {
  let html;
  try {
    const res = await fetch(`${BASE}${route}`);
    if (!res.ok) {
      console.log(`  ${route.padEnd(22)} HTTP ${res.status} — ignorée`);
      unreachable++;
      continue;
    }
    html = await res.text();
  } catch (e) {
    console.log(`  ${route.padEnd(22)} injoignable (${e.message})`);
    unreachable++;
    continue;
  }

  const findings = scan(html);
  total += findings.length;
  const mark = findings.length === 0 ? '✓' : '✗';
  console.log(`  ${mark} ${route.padEnd(22)} ${findings.length}`);
  for (const f of findings.slice(0, 10)) console.log(`        « ${f} »`);
  if (findings.length > 10) console.log(`        … et ${findings.length - 10} autre(s)`);
}

console.log('\n' + '─'.repeat(66));
if (unreachable === ROUTES.length) {
  console.log('  Aucune page atteignable : le serveur est-il démarré ?');
  console.log('  → npm run build && npx next start -p 3000');
  process.exit(1);
}
if (total > 0) {
  console.log(`  ✗ ${total} texte(s) invisible(s) en thème sombre.`);
  console.log('  Corriger en donnant une couleur explicite au texte (ex. text-gray-900)');
  console.log('  ou en faisant porter le fond par var(--surface-card).');
  process.exit(1);
}
console.log('  ✓ Aucun texte hérité sur fond clair en dur.');
process.exit(0);
