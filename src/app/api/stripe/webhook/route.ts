import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

/**
 * Webhook Stripe — seul consommateur serveur des paiements.
 *
 * Sans cette route, un client qui paie reste plafonné au quota gratuit :
 * les Payment Links encaissent, mais rien n'écrit `isPremium`. C'est elle qui
 * ferme la chaîne entre Stripe et `src/lib/premium.ts`.
 *
 * Trois natures d'événements sont traitées :
 *   - `checkout.session.completed`      : première activation (abonnement ou à vie) ;
 *   - `invoice.payment_succeeded`       : renouvellement, repousse l'échéance ;
 *   - `customer.subscription.deleted`   : fin d'abonnement, retrait du premium.
 *
 * Sémantique de `premiumUntil`, fixée par `premium.ts` : une date = échéance ;
 * `null` avec `isPremium` à true = premium permanent, donc l'offre à vie.
 *
 * Idempotence : toutes les écritures sont des affectations absolues, jamais des
 * incréments. Un même événement rejoué par Stripe produit le même état final.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/** Convertit un timestamp Stripe (secondes) en Date, ou null s'il est absent. */
function toDate(seconds: number | null | undefined): Date | null {
  return typeof seconds === 'number' ? new Date(seconds * 1000) : null;
}

/**
 * Retrouve le compte concerné. `client_reference_id` est la source la plus
 * fiable : il porte l'identifiant applicatif, transmis par le CTA. L'e-mail du
 * payeur ne sert que de repli, et n'est retenu que s'il correspond à un compte
 * existant — on ne crée jamais de compte depuis un webhook.
 */
async function findUserId(
  clientReferenceId: string | null | undefined,
  email: string | null | undefined
): Promise<string | null> {
  if (clientReferenceId) {
    const byId = await prisma.user.findUnique({ where: { id: clientReferenceId } });
    if (byId) return byId.id;
  }
  if (email) {
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) return byEmail.id;
  }
  return null;
}

export async function POST(request: Request) {
  if (!secretKey || !webhookSecret) {
    // Mauvaise configuration serveur : on le dit sans détailler quelle clé manque.
    console.error('[stripe/webhook] STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET absent.');
    return NextResponse.json({ error: 'Webhook non configuré.' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Signature absente.' }, { status: 400 });
  }

  // Corps BRUT obligatoire : toute reserialisation invalide la signature.
  const payload = await request.text();
  const stripe = new Stripe(secretKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    // Signature invalide : la requête n'est pas de Stripe, on ne la traite pas.
    console.error('[stripe/webhook] signature refusée :', (error as Error).message);
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = await findUserId(
          session.client_reference_id,
          session.customer_details?.email ?? session.customer_email
        );
        if (!userId) {
          // Paiement sans compte rattachable : on ne devine pas. L'activation
          // sera manuelle, et la trace ci-dessous permet de la retrouver.
          console.error(
            `[stripe/webhook] session ${session.id} sans compte rattachable ` +
              `(client_reference_id=${session.client_reference_id ?? 'absent'}).`
          );
          return NextResponse.json({ received: true, matched: false });
        }

        // mode « payment » = achat unique, donc l'offre à vie : premium permanent.
        // mode « subscription » = échéance portée par l'abonnement.
        let premiumUntil: Date | null = null;
        if (session.mode === 'subscription' && typeof session.subscription === 'string') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          premiumUntil = toDate((subscription as unknown as { current_period_end?: number }).current_period_end);
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            isPremium: true,
            premiumUntil,
            ...(typeof session.customer === 'string' ? { stripeCustomerId: session.customer } : {}),
          },
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        // Renouvellement : on repousse l'échéance sans rien incrémenter.
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : null;
        if (!customerId) break;

        const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
        if (!user) break;

        const periodEnd = toDate(
          (invoice as unknown as { lines?: { data?: Array<{ period?: { end?: number } }> } })
            .lines?.data?.[0]?.period?.end
        );
        // Sans échéance lisible, ne pas transformer un abonnement en premium
        // permanent : on laisse l'état tel quel plutôt que d'offrir l'à-vie.
        if (!periodEnd) break;

        await prisma.user.update({
          where: { id: user.id },
          data: { isPremium: true, premiumUntil: periodEnd },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === 'string' ? subscription.customer : null;
        if (!customerId) break;

        const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
        if (!user) break;

        // Un premium permanent (offre à vie) ne dépend d'aucun abonnement et
        // ne doit jamais être retiré par la fin de l'un d'eux.
        if (user.isPremium && user.premiumUntil === null) break;

        await prisma.user.update({
          where: { id: user.id },
          data: { isPremium: false, premiumUntil: null },
        });
        break;
      }

      default:
        // Les autres événements sont acquittés sans traitement : répondre 200
        // évite que Stripe ne les rejoue indéfiniment.
        break;
    }
  } catch (error) {
    // Une erreur serveur doit rendre un 500 pour que Stripe rejoue l'événement.
    console.error(`[stripe/webhook] échec du traitement de ${event.type} :`, error);
    return NextResponse.json({ error: 'Traitement impossible.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
