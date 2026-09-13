import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { PRIX_A_VIE_CENTIMES, PRIX_ABONNEMENT_CENTIMES, DEVISE } from '@/lib/premium';
import { envoyerAchatGA4 } from '@/lib/ga4';

/**
 * Webhook Stripe — seul consommateur serveur des paiements.
 *
 * Sans cette route, un client qui paie reste plafonné au quota gratuit : les
 * Payment Links encaissent, mais rien n'écrit `isPremium`. C'est elle qui ferme
 * la chaîne entre Stripe et `src/lib/premium.ts`.
 *
 * ── Principe directeur : échouer FERMÉ ────────────────────────────────────
 * `premiumUntil = null` avec `isPremium = true` signifie premium PERMANENT,
 * c'est-à-dire l'offre à vie (cf. `premium.ts`). C'est l'état le plus coûteux à
 * accorder : il ne doit jamais être une valeur par défaut, ni le résultat d'un
 * calcul qui a échoué. Chaque activation exige ici une raison positive — un
 * mode connu, un montant au catalogue, un paiement réellement encaissé. Tout ce
 * qui n'est pas reconnu est acquitté sans écriture, avec une trace permettant
 * la reprise manuelle.
 *
 * ── Identité ──────────────────────────────────────────────────────────────
 * Seul `client_reference_id` rattache un paiement à un compte. L'e-mail du
 * payeur n'est PAS accepté en repli : Stripe ne vérifie pas qu'il appartient à
 * celui qui le saisit, et l'application ne renseigne jamais `emailVerified`.
 * S'y fier reviendrait à rapprocher deux affirmations non vérifiées, et
 * permettrait de faire créditer son propre compte du paiement d'autrui.
 *
 * ── Dette assumée ─────────────────────────────────────────────────────────
 * Il n'existe pas de table d'événements traités : l'idempotence repose sur des
 * affectations absolues et des écritures conditionnelles, ce qui couvre le
 * rejeu mais pas tous les ordres d'arrivée. Une table `StripeEvent` exigerait
 * une migration, donc le gate `db-guardian`.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
/** Renseigné, il prime sur le contrôle par montant — insensible à un changement de tarif. */
const priceAVie = process.env.STRIPE_PRICE_LIFETIME;

/** Un événement Stripe pèse quelques kilo-octets ; au-delà, on ne lit même pas. */
const TAILLE_MAX_OCTETS = 1_048_576;

// Client sans état : l'instancier par requête ne sert à rien. La version d'API
// est épinglée pour qu'une montée de version devienne une erreur de compilation
// visible plutôt qu'un changement de comportement silencieux.
const stripe = secretKey ? new Stripe(secretKey, { apiVersion: '2024-06-20' }) : null;

/** Acquittement explicite : Stripe ne doit pas rejouer ce qu'on refuse sciemment. */
function acquitte(motif: string, details: Record<string, unknown> = {}) {
  console.error('[stripe/webhook] non traite :', { motif, ...details });
  return NextResponse.json({ received: true, matched: false });
}

/**
 * Nature de l'achat, déduite de ce qui a RÉELLEMENT été payé.
 * `undefined` quand rien ne correspond : l'appelant doit alors s'abstenir.
 */
async function natureDeLAchat(
  session: Stripe.Checkout.Session,
  client: Stripe
): Promise<'a-vie' | 'abonnement' | undefined> {
  if (session.currency && session.currency.toLowerCase() !== DEVISE) return undefined;
  const montant = session.amount_total;

  if (session.mode === 'payment') {
    if (priceAVie) {
      const lignes = await client.checkout.sessions.listLineItems(session.id, { limit: 10 });
      return lignes.data.some((l) => l.price?.id === priceAVie) ? 'a-vie' : undefined;
    }
    return montant === PRIX_A_VIE_CENTIMES ? 'a-vie' : undefined;
  }

  if (session.mode === 'subscription') {
    return typeof montant === 'number' && PRIX_ABONNEMENT_CENTIMES.has(montant)
      ? 'abonnement'
      : undefined;
  }

  return undefined;
}

/** Active le premium à la suite d'une session effectivement réglée. */
async function activerDepuisSession(session: Stripe.Checkout.Session, client: Stripe) {
  // « completed » ne veut pas dire « payé » : les moyens à notification
  // différée (SEPA, ACH, Boleto...) émettent l'événement avec payment_status
  // « unpaid », puis async_payment_succeeded — ou async_payment_failed.
  if (session.payment_status !== 'paid') {
    return acquitte('paiement non encaisse', {
      sessionId: session.id,
      paymentStatus: session.payment_status,
    });
  }

  const userId = session.client_reference_id;
  if (!userId) {
    return acquitte('aucun compte rattache (client_reference_id absent)', {
      sessionId: session.id,
    });
  }

  const nature = await natureDeLAchat(session, client);
  if (!nature) {
    return acquitte('achat non reconnu au catalogue', {
      sessionId: session.id,
      mode: session.mode,
      montant: session.amount_total,
      devise: session.currency,
    });
  }

  // Tout ce qui peut invalider l'événement se résout AVANT d'ouvrir la base :
  // interroger Supabase pour un événement de toute façon inexploitable coûte
  // une connexion du pooler, et rendrait un 500 là où un acquittement suffit.
  let echeance: Date | null = null;
  if (nature === 'abonnement') {
    if (typeof session.subscription !== 'string') {
      return acquitte('abonnement sans identifiant exploitable', { sessionId: session.id });
    }
    const abonnement = await client.subscriptions.retrieve(session.subscription);
    if (typeof abonnement.current_period_end !== 'number') {
      return acquitte('echeance d abonnement illisible', { sessionId: session.id });
    }
    echeance = new Date(abonnement.current_period_end * 1000);
  }

  const utilisateur = await prisma.user.findUnique({ where: { id: userId } });
  if (!utilisateur) {
    return acquitte('compte introuvable', { sessionId: session.id });
  }

  const customerId = typeof session.customer === 'string' ? session.customer : null;
  // Ne jamais réattribuer un identifiant client Stripe déjà posé : laisser
  // faire permettrait de détourner les événements d'un abonné existant, et donc
  // de lui retirer son accès en résiliant.
  const conflitDeClient =
    customerId !== null &&
    utilisateur.stripeCustomerId !== null &&
    utilisateur.stripeCustomerId !== customerId;
  if (conflitDeClient) {
    console.error('[stripe/webhook] identifiant client Stripe divergent, non ecrase :', {
      userId,
      sessionId: session.id,
    });
  }
  const clientAEcrire = customerId && !conflitDeClient ? { stripeCustomerId: customerId } : {};

  if (nature === 'a-vie') {
    await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true, premiumUntil: null, ...clientAEcrire },
    });
    await signalerAchat(session, 'a-vie', userId);
    return NextResponse.json({ received: true, matched: true });
  }

  // Un accès à vie déjà acquis ne se dégrade jamais en abonnement : la clause
  // écarte les seuls titulaires permanents (isPremium true ET premiumUntil null).
  await prisma.user.updateMany({
    where: { id: userId, NOT: { isPremium: true, premiumUntil: null } },
    data: { isPremium: true, premiumUntil: echeance, ...clientAEcrire },
  });
  await signalerAchat(session, 'abonnement', userId);
  return NextResponse.json({ received: true, matched: true });
}

/**
 * Remonte l'achat à GA4, ou il resterait invisible : `purchase` est le seul
 * evenement cle declare dans la propriete, et rien ne l'emettait. La mesure ne
 * doit jamais faire echouer une activation deja payee — d'ou le catch muet.
 */
async function signalerAchat(
  session: Stripe.Checkout.Session,
  nature: 'a-vie' | 'abonnement',
  userId: string
) {
  try {
    await envoyerAchatGA4({
      transactionId: session.id,
      montantCentimes: session.amount_total ?? 0,
      devise: session.currency ?? DEVISE,
      nature,
      userId,
    });
  } catch {
    /* deja trace dans lib/ga4 */
  }
}

/** Retire le premium d'un client Stripe, sans lecture préalable : pas de fenêtre de course. */
async function retirerPremium(customerId: string, portee: 'tous' | 'sauf-a-vie') {
  const where: Prisma.UserWhereInput =
    portee === 'tous'
      ? { stripeCustomerId: customerId }
      : { stripeCustomerId: customerId, premiumUntil: { not: null } };
  await prisma.user.updateMany({ where, data: { isPremium: false, premiumUntil: null } });
}

export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    console.error('[stripe/webhook] STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET absent.');
    return NextResponse.json({ error: 'Webhook non configure.' }, { status: 500 });
  }

  const taille = Number(request.headers.get('content-length') ?? '0');
  if (taille > TAILLE_MAX_OCTETS) {
    return NextResponse.json({ error: 'Charge utile trop volumineuse.' }, { status: 413 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Signature absente.' }, { status: 400 });
  }

  // Corps BRUT obligatoire : toute resérialisation invalide la signature.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('[stripe/webhook] signature refusee :', (error as Error).message);
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Paiement immédiat, et confirmation tardive des moyens différés.
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        return await activerDepuisSession(event.data.object as Stripe.Checkout.Session, stripe);

      case 'invoice.payment_succeeded': {
        // Renouvellement : on repousse l'échéance sans toucher un accès à vie
        // ni ressusciter un compte déjà résilié.
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : null;
        if (!customerId) break;

        const fin = invoice.lines?.data?.[0]?.period?.end;
        if (typeof fin !== 'number') {
          return acquitte('echeance de facture illisible', { invoiceId: invoice.id });
        }

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId, premiumUntil: { not: null } },
          data: { isPremium: true, premiumUntil: new Date(fin * 1000) },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === 'string' ? subscription.customer : null;
        if (!customerId) break;
        // Un accès à vie ne dépend d'aucun abonnement : il survit à sa fin.
        await retirerPremium(customerId, 'sauf-a-vie');
        break;
      }

      case 'charge.refunded': {
        // Remboursé : l'accès part avec l'argent, y compris l'accès à vie.
        const charge = event.data.object as Stripe.Charge;
        const customerId = typeof charge.customer === 'string' ? charge.customer : null;
        if (!customerId) break;
        await retirerPremium(customerId, 'tous');
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        const charge = dispute.charge;
        const customerId =
          typeof charge === 'string'
            ? null
            : typeof charge.customer === 'string'
              ? charge.customer
              : null;
        if (!customerId) {
          return acquitte('litige sans client identifiable', { disputeId: dispute.id });
        }
        await retirerPremium(customerId, 'tous');
        break;
      }

      default:
        // Acquitté sans traitement : un 200 évite un rejeu perpétuel.
        break;
    }
  } catch (error) {
    // Une erreur PERMANENTE ne réussira jamais. La rejouer trois jours durant
    // finit par faire désactiver l'endpoint par Stripe, et les événements de
    // tous les autres clients seraient perdus avec.
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return acquitte('erreur base permanente, reprise manuelle requise', {
        code: error.code,
        eventType: event.type,
      });
    }
    console.error('[stripe/webhook] echec transitoire :', {
      eventType: event.type,
      message: (error as Error).message,
    });
    return NextResponse.json({ error: 'Traitement impossible.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
