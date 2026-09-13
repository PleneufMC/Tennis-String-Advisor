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
 *    côté anglais — pendant des mois. Les deux circuits doivent porter les
 *    mêmes liens, et ce script échoue dès qu'ils divergent.
 *
 * Contrôles :
 *  1. le webhook lit le corps brut et appelle `webhooks.constructEvent` ;
 *  2. aucun accès base avant cette vérification ;
 *  3. signature absente ou invalide => 400 ;
 *  4. aucun secret en dur dans le source ;
 *  5. un accès à vie (premium sans échéance) n'est jamais révoqué par la fin
 *     d'un abonnement ;
 *  6. les circuits FR et EN portent exactement les mêmes Payment Links ;
 *  7. aucun lien buy.stripe.com ailleurs que dans ces deux fichiers ;
 *  8. les deux drapeaux CHECKOUT_DISPONIBLE existent (la fermeture reste
 *     pilotable d'un seul endroit par circuit) ;
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
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const WEBHOOK = 'src/app/api/stripe/webhook/route.ts';
const FR = 'src/app/pricing/page.tsx';
const EN = 'public/en/premium.html';

const echecs = [];
const ok = [];
const verifier = (condition, message) => (condition ? ok : echecs).push(message);

for (const f of [WEBHOOK, FR, EN]) {
  if (!existsSync(f)) {
    console.error(`✗ fichier absent : ${f}`);
    process.exit(1);
  }
}

const webhook = readFileSync(WEBHOOK, 'utf8');
const fr = readFileSync(FR, 'utf8');
const en = readFileSync(EN, 'utf8');

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

// 6 et 7. Une seule grille de liens pour les deux circuits
const liens = (src) => [...new Set(src.match(/https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+/g) || [])].sort();
const lFR = liens(fr);
const lEN = liens(en);
verifier(lFR.length === 3, `le circuit FR déclare 3 Payment Links (trouvé ${lFR.length})`);
verifier(lEN.length === 3, `le circuit EN déclare 3 Payment Links (trouvé ${lEN.length})`);
verifier(
  lFR.length > 0 && JSON.stringify(lFR) === JSON.stringify(lEN),
  'les circuits FR et EN portent exactement les mêmes Payment Links'
);

let ailleurs = '';
try {
  ailleurs = execSync(
    `git grep -l "buy\.stripe\.com" -- src public || true`,
    { encoding: 'utf8', cwd: process.cwd() }
  );
} catch {
  ailleurs = '';
}
const fichiersAvecLiens = ailleurs.split('\n').map((l) => l.trim().split(String.fromCharCode(92)).join('/')).filter(Boolean);
const inattendus = fichiersAvecLiens.filter((f) => f !== FR && f !== EN);
verifier(inattendus.length === 0, `aucun lien de paiement hors des deux circuits${inattendus.length ? ` (trouvés : ${inattendus.join(', ')})` : ''}`);

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

// 8. La fermeture reste pilotable
verifier(/const CHECKOUT_DISPONIBLE\s*=/.test(fr), 'le circuit FR garde son drapeau CHECKOUT_DISPONIBLE');
verifier(/const CHECKOUT_DISPONIBLE\s*=/.test(en), 'le circuit EN garde son drapeau CHECKOUT_DISPONIBLE');

console.log('\n─── QA chaîne de paiement Stripe ───');
for (const m of ok) console.log(`  OK   ${m}`);
for (const m of echecs) console.log(`  ÉCHEC ${m}`);
console.log(`\n  ${ok.length} contrôle(s) au vert, ${echecs.length} en échec.`);

if (echecs.length > 0) process.exit(1);
console.log('  La chaîne de paiement tient ses invariants.\n');
