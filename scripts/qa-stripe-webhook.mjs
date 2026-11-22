#!/usr/bin/env node
/**
 * QA paiement — garde-fou de la chaîne Stripe.
 *
 * Deux choses peuvent casser sans que rien ne paraisse anormal.
 *
 * 1. La vérification de signature du webhook. Si quelqu'un remplace
 *    `request.text()` par `request.json()` — réflexe naturel dans une route
 *    Next — la signature devient invérifiable et Stripe la rejette ; pire, si
 *    la vérification est retirée « pour déboguer », n'importe qui peut POSTER
 *    un faux `checkout.session.completed` et s'offrir `isPremium`. Rien dans
 *    l'interface ne le montrerait.
 *
 * 2. La divergence des grilles tarifaires. Le site a vécu avec deux jeux de
 *    Payment Links — 4,99 € affiché côté français, 2,99 € réellement facturé
 *    côté anglais — pendant des mois. Depuis le 22/11/2026, le circuit anglais
 *    est le composant français rendu sous `/en/pricing` : la grille ne vit que
 *    dans `src/app/pricing/page.tsx`, et ce script vérifie que cela reste vrai
 *    par construction, quel que soit l'état de la route EN et de l'ancienne
 *    page statique `public/en/premium.html` (présentes ou absentes).
 *
 * Contrôles :
 *  1. le webhook lit le corps brut et appelle `webhooks.constructEvent` ;
 *  2. aucun accès base avant cette vérification ;
 *  3. signature absente ou invalide => 400 ;
 *  4. aucun secret en dur dans le source ;
 *  5. un accès à vie (premium sans échéance) n'est jamais révoqué par la fin
 *     d'un abonnement ;
 *  6. le circuit EN ne peut porter que la grille FR (contrôle structurel) :
 *     a. le circuit FR déclare 3 Payment Links ;
 *     b. la route `src/app/en/pricing/page.tsx`, si elle existe, rend le
 *        composant FR : import d'exécution de `src/app/pricing/page.tsx`, ou
 *        d'un composant de `src/app/pricing/` que la page FR rend aussi ;
 *     c. son graphe d'imports locaux atteint `src/app/pricing/page.tsx` ;
 *     d. elle ne contient ni lien buy.stripe.com ni drapeau
 *        CHECKOUT_DISPONIBLE propre (elle suit celui du FR) ;
 *     e. `public/en/premium.html`, tant qu'il existe, reste fermé
 *        (CHECKOUT_DISPONIBLE = false) et ne contient aucun lien
 *        buy.stripe.com ;
 *     l'absence de la route ou de la page statique est un état valide, dit en
 *     sortie ;
 *  7. aucun lien buy.stripe.com ailleurs que dans `src/app/pricing/page.tsx`,
 *     dans les fichiers de src/ et public/, suivis ou non suivis (hors
 *     .gitignore) ; un `git grep` en erreur est un échec, pas un vert ;
 *  8. le drapeau CHECKOUT_DISPONIBLE du circuit FR existe : il pilote seul
 *     l'ouverture des deux circuits ;
 *  9. « completed » n'est pas confondu avec « payé » : les moyens à
 *     notification différée (SEPA, ACH...) émettent l'événement avec
 *     payment_status « unpaid », et un prélèvement qui échouera ensuite
 *     donnerait un accès à vie irrévocable ;
 * 10. l'e-mail du payeur ne rattache aucun paiement à un compte : Stripe ne
 *     vérifie pas qu'il appartient à celui qui le saisit, et l'application ne
 *     renseigne jamais emailVerified ;
 * 11. aucun cast `as unknown as` : ils neutralisent le seul vérificateur
 *     automatique de ce fichier, et masqueraient un changement de forme de
 *     l'API Stripe qui transformerait chaque abonnement en accès à vie ;
 * 12. la version d'API Stripe est épinglée, pour qu'une montée de version
 *     devienne une erreur de compilation plutôt qu'un changement muet ;
 * 13. remboursement et litige retirent l'accès ;
 * 14. les retraits d'accès passent par des écritures conditionnelles
 *     (updateMany), sans lecture préalable : une lecture suivie d'une écriture
 *     laisse une fenêtre pendant laquelle un autre événement s'intercale ;
 * 15. une erreur de base permanente est acquittée, pas rejouée : Stripe
 *     désactive un endpoint durablement en échec, et les événements de tous
 *     les autres clients seraient perdus avec.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { posix } from 'node:path';

const WEBHOOK = 'src/app/api/stripe/webhook/route.ts';
const FR = 'src/app/pricing/page.tsx';
// Circuit EN : la route Next qui rend le composant FR (décision de Pierre du 22/11/2026), et
// l'ancienne page statique (Supabase, paiement fermé depuis le 09/10/2026) tant qu'elle existe.
// L'une et l'autre peuvent manquer selon l'ordre de fusion : aucune n'est exigée.
const EN_ROUTE = 'src/app/en/pricing/page.tsx';
const EN_STATIQUE = 'public/en/premium.html';

const echecs = [];
const ok = [];
const mentions = [];
const verifier = (condition, message) => (condition ? ok : echecs).push(message);

for (const f of [WEBHOOK, FR]) {
  if (!existsSync(f)) {
    console.error(`✗ fichier absent : ${f}`);
    process.exit(1);
  }
}

const webhook = readFileSync(WEBHOOK, 'utf8');
const fr = readFileSync(FR, 'utf8');
const enRoute = existsSync(EN_ROUTE) ? readFileSync(EN_ROUTE, 'utf8') : null;
const enStatique = existsSync(EN_STATIQUE) ? readFileSync(EN_STATIQUE, 'utf8') : null;

// Imports d'exécution d'un source TS/TSX (les `import type` ne rendent rien et sont écartés),
// réexportations comprises. Les commentaires sont retirés avant la lecture : un en-tête qui cite
// `@/app/pricing/page` ne doit pas compter comme un import.
const sansCommentaires = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
function importsDe(src) {
  const res = [];
  const re = /\b(import|export)\s+(?!type\b)([^;'"]*?)\s*\bfrom\s*['"]([^'"]+)['"]/g;
  for (const [, genre, clause, specifier] of sansCommentaires(src).matchAll(re)) {
    const liaisons = []; // { exporte, local } ; exporte = 'default' pour l'export par défaut, '*' pour un espace de noms
    const defaut = clause.match(/^\s*([A-Za-z_$][\w$]*)\s*(,|$)/);
    if (genre === 'import' && defaut) liaisons.push({ exporte: 'default', local: defaut[1] });
    const espace = clause.match(/\*(?:\s+as\s+([A-Za-z_$][\w$]*))?/);
    if (espace) liaisons.push({ exporte: '*', local: espace[1] || null });
    const nommes = clause.match(/\{([^}]*)\}/);
    for (const brut of nommes ? nommes[1].split(',') : []) {
      const t = brut.trim();
      if (!t || /^type\s/.test(t)) continue; // liaison de type : rien à l'exécution
      const [exporte, local] = t.split(/\s+as\s+/);
      liaisons.push({ exporte, local: local || exporte });
    }
    if (liaisons.length > 0) res.push({ genre, specifier, liaisons });
  }
  return res;
}
// `@/` vaut `src/` (tsconfig.json) ; un paquet npm n'est pas résolu.
function resoudre(depuis, specifier) {
  let base;
  if (specifier.startsWith('@/')) base = posix.join('src', specifier.slice(2));
  else if (specifier.startsWith('.')) base = posix.join(posix.dirname(depuis), specifier);
  else return null;
  for (const c of [base, `${base}.tsx`, `${base}.ts`, `${base}.jsx`, `${base}.js`, `${base}/index.tsx`, `${base}/index.ts`]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}
const rendDansJsx = (src, nom) => new RegExp(`<${nom.replace(/\$/g, '\\$')}[\\s/>]`).test(sansCommentaires(src));

// 1. Corps brut + vérification de signature
verifier(/await\s+request\.text\(\)/.test(webhook), 'le webhook lit le corps brut (request.text)');
verifier(!/await\s+request\.json\(\)/.test(webhook), 'le webhook n’appelle pas request.json (invaliderait la signature)');
verifier(/webhooks\.constructEvent\(/.test(webhook), 'la signature est vérifiée par webhooks.constructEvent');

// 2. Rien en base avant la vérification — l'ordre qui compte est celui de
// l'EXÉCUTION dans POST, pas celui des déclarations dans le fichier : les
// fonctions utilitaires peuvent parfaitement être définies plus haut.
const corpsPost = webhook.slice(webhook.indexOf('export async function POST'));
const posConstruct = corpsPost.indexOf('constructEvent(');
const posPrisma = corpsPost.indexOf('prisma.');
verifier(
  posConstruct !== -1 && (posPrisma === -1 || posPrisma > posConstruct),
  'aucun accès base avant la vérification de signature'
);

// 3. Refus explicite
verifier(/Signature absente/.test(webhook) && /status:\s*400/.test(webhook), 'une signature absente est refusée en 400');
verifier(/Signature invalide/.test(webhook), 'une signature invalide est refusée en 400');

// 4. Pas de secret en dur
verifier(!/whsec_[A-Za-z0-9]/.test(webhook), 'aucun secret de webhook en dur dans le source');
verifier(!/sk_(live|test)_[A-Za-z0-9]/.test(webhook), 'aucune clé secrète Stripe en dur dans le source');
verifier(/process\.env\.STRIPE_WEBHOOK_SECRET/.test(webhook), 'le secret vient de l’environnement');

// 5. L'accès à vie survit à la fin d'un abonnement
// La protection n'est plus une lecture puis un test, mais une clause SQL :
// `premiumUntil: { not: null }` exclut les titulaires permanents au moment
// meme de l'ecriture, ce qui supprime la fenetre de course.
const blocSubDeleted = webhook.slice(
  webhook.indexOf("case 'customer.subscription.deleted'"),
  webhook.indexOf("case 'charge.refunded'")
);
verifier(
  /retirerPremium\([^)]*'sauf-a-vie'\)/.test(blocSubDeleted),
  'un accès à vie n’est pas révoqué par customer.subscription.deleted'
);
verifier(
  /'sauf-a-vie'[\s\S]{0,400}premiumUntil:\s*\{\s*not:\s*null\s*\}/.test(webhook),
  'la portée « sauf-a-vie » se traduit bien par une clause premiumUntil non nul'
);

// 6 et 7. Une seule grille de liens, celle du composant FR. Le circuit EN ne la recopie plus : il
// rend le même composant. « Mêmes liens des deux côtés » devient une propriété de structure (6b-6d)
// adossée au monopole du fichier FR (7), au lieu d'une comparaison de deux listes.
const liens = (src) => [...new Set(src.match(/https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+/g) || [])].sort();
const compterLiens = (src) => (src.match(/buy\.stripe\.com/g) || []).length;
const lFR = liens(fr);
verifier(lFR.length === 3, `le circuit FR déclare 3 Payment Links (trouvé ${lFR.length})`);

if (enRoute === null) {
  mentions.push(`route EN ${EN_ROUTE} absente : contrôles 6b à 6d sans objet (aucune page de paiement anglaise dans l'application)`);
} else {
  mentions.push(`route EN ${EN_ROUTE} présente : contrôles 6b à 6d appliqués`);
  const avecChemin = (depuis, src) => importsDe(src).map((i) => ({ ...i, chemin: resoudre(depuis, i.specifier) }));
  const importsEn = avecChemin(EN_ROUTE, enRoute);
  const importsFr = avecChemin(FR, fr);

  // 6b. Le composant rendu est celui du FR : l'export par défaut de la page FR, ou un composant de
  // src/app/pricing/ que la page FR importe et rend elle aussi. `export { default } from` vaut rendu.
  const rendus = [];
  for (const imp of importsEn) {
    if (!imp.chemin || !imp.chemin.startsWith('src/app/pricing/')) continue;
    for (const l of imp.liaisons) {
      const estRendu = imp.genre === 'export' ? l.local === 'default' : !!l.local && l.exporte !== '*' && rendDansJsx(enRoute, l.local);
      if (!estRendu) continue;
      if (imp.chemin === FR) {
        if (l.exporte === 'default') rendus.push(`export par défaut de ${FR}`);
      } else if (
        importsFr.some(
          (f) => f.genre === 'import' && f.chemin === imp.chemin
            && f.liaisons.some((fl) => fl.exporte === l.exporte && fl.local && rendDansJsx(fr, fl.local))
        )
      ) {
        rendus.push(`${l.exporte === 'default' ? 'export par défaut' : l.exporte} de ${imp.chemin}, rendu aussi par ${FR}`);
      }
    }
  }
  verifier(
    rendus.length > 0,
    `route EN : rend le composant du circuit FR${rendus.length ? ` (${rendus.join(' ; ')})` : ` — introuvable : ni export par défaut de ${FR} rendu, ni composant de src/app/pricing/ rendu aussi par la page FR`}`
  );

  // 6c. Les liens qu'elle affiche ne peuvent venir que de la page FR : son graphe d'imports locaux y mène.
  const vus = new Set([EN_ROUTE]);
  const aLire = [EN_ROUTE];
  while (aLire.length > 0 && vus.size < 300) {
    const courant = aLire.shift();
    for (const imp of importsDe(readFileSync(courant, 'utf8'))) {
      const c = resoudre(courant, imp.specifier);
      if (c && !vus.has(c)) {
        vus.add(c);
        aLire.push(c);
      }
    }
  }
  verifier(vus.has(FR), `route EN : son graphe d'imports locaux atteint ${FR}, seul porteur des Payment Links (${vus.size} module(s) lus)`);

  // 6d. Ni grille ni interrupteur à elle.
  const nRoute = compterLiens(enRoute);
  verifier(nRoute === 0, `route EN : aucun lien buy.stripe.com dans ${EN_ROUTE} (trouvé ${nRoute})`);
  verifier(
    !/\bCHECKOUT_DISPONIBLE\b/.test(sansCommentaires(enRoute)),
    `route EN : aucun drapeau CHECKOUT_DISPONIBLE propre (elle suit celui de ${FR})`
  );
}

// 6e. L'ancienne page statique (Supabase Auth, incapable d'activer un compte du site) reste fermée et
// sans lien tant qu'elle existe ; la rouvrir recréerait un second circuit.
if (enStatique === null) {
  mentions.push(`page statique ${EN_STATIQUE} absente : contrôle 6e sans objet (ancien circuit EN retiré)`);
} else {
  mentions.push(`page statique ${EN_STATIQUE} présente : contrôle 6e appliqué`);
  const drapeaux = [...enStatique.matchAll(/const CHECKOUT_DISPONIBLE\s*=\s*([^;\s]+)/g)].map((m) => m[1]);
  verifier(
    drapeaux.length > 0 && drapeaux.every((v) => v === 'false'),
    `page statique EN : paiement fermé (CHECKOUT_DISPONIBLE = ${drapeaux.join(', ') || 'absent'})`
  );
  const nStatique = compterLiens(enStatique);
  verifier(nStatique === 0, `page statique EN : aucun lien buy.stripe.com dans ${EN_STATIQUE} (trouvé ${nStatique})`);
}

// 7. Aucun lien ailleurs que dans la page FR. `--untracked` : un fichier pas encore ajouté à l'index
// compte aussi (ceux du .gitignore restent hors champ). git grep sort en 1 quand rien ne correspond ;
// tout autre code est une panne de l'instrument, jamais un vert.
const grep = spawnSync('git', ['grep', '-l', '--untracked', '-e', 'buy\\.stripe\\.com', '--', 'src', 'public'], { encoding: 'utf8' });
if (grep.status !== 0 && grep.status !== 1) {
  verifier(false, `recherche des liens hors du circuit FR impossible (git grep, code ${grep.status ?? grep.error?.code}) : ${(grep.stderr || '').trim()}`);
} else {
  const fichiersAvecLiens = grep.stdout.split('\n').map((l) => l.trim().split('\\').join('/')).filter(Boolean);
  const inattendus = fichiersAvecLiens.filter((f) => f !== FR);
  verifier(inattendus.length === 0, `aucun lien buy.stripe.com hors de ${FR}${inattendus.length ? ` (trouvés : ${inattendus.join(', ')})` : ''}`);
}

// 9 a 15. Invariants issus de la revue de securite
verifier(/payment_status\s*!==\s*'paid'/.test(webhook), 'un paiement non encaisse (SEPA en attente) n active rien');
verifier(/async_payment_succeeded/.test(webhook), 'la confirmation tardive d un paiement differe est traitee');
verifier(
  !/findUnique\(\s*\{\s*where:\s*\{\s*email/.test(webhook),
  'aucun rattachement de paiement par l e-mail du payeur'
);
verifier(!/as unknown as/.test(webhook), 'aucun cast `as unknown as` ne neutralise le typage Stripe');
verifier(/apiVersion:\s*'[0-9]{4}-[0-9]{2}-[0-9]{2}'/.test(webhook), 'la version d API Stripe est epinglee');
verifier(/case 'charge\.refunded'/.test(webhook), 'un remboursement retire l acces');
verifier(/case 'charge\.dispute\.created'/.test(webhook), 'un litige retire l acces');
verifier(
  /updateMany\(/.test(webhook) && !/findUnique[\s\S]{0,400}?isPremium:\s*false/.test(webhook),
  'les retraits d acces sont des ecritures conditionnelles, sans lecture prealable'
);
verifier(/PrismaClientKnownRequestError/.test(webhook), 'une erreur de base permanente est acquittee, pas rejouee');
verifier(/content-length/.test(webhook), 'la taille du corps est bornee avant lecture');
verifier(
  /PRIX_A_VIE_CENTIMES/.test(webhook) && /PRIX_ABONNEMENT_CENTIMES/.test(webhook),
  'seuls les montants au catalogue declenchent une activation'
);

// 8. La fermeture reste pilotable d'un seul endroit : le drapeau FR, que la route EN suit (6d).
verifier(/const CHECKOUT_DISPONIBLE\s*=/.test(fr), 'le circuit FR garde son drapeau CHECKOUT_DISPONIBLE (il pilote aussi la route EN)');

console.log('\n─── QA chaîne de paiement Stripe ───');
for (const m of mentions) console.log(`  NOTE ${m}`);
for (const m of ok) console.log(`  OK   ${m}`);
for (const m of echecs) console.log(`  ÉCHEC ${m}`);
console.log(`\n  ${ok.length} contrôle(s) au vert, ${echecs.length} en échec.`);

if (echecs.length > 0) process.exit(1);
console.log('  La chaîne de paiement tient ses invariants.\n');
