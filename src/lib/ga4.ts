/**
 * Envoi d'événements à GA4 depuis le serveur (Measurement Protocol).
 *
 * Pourquoi pas depuis le navigateur : l'événement `purchase` est le seul
 * marqué comme événement clé dans la propriété, et c'est lui qui portera le
 * revenu. Le mesurer sur la page de retour supposerait que l'acheteur revienne
 * sur le site après Stripe — ce qu'il ne fait pas toujours — et qu'aucun
 * bloqueur ne s'interpose. Le webhook, lui, est le seul point du système qui
 * sache de façon certaine qu'un paiement a été encaissé, pour quel montant.
 *
 * Limite assumée : le `client_id` transmis ici est l'identifiant applicatif du
 * compte, pas celui que GA4 pose dans le navigateur. L'achat est donc compté
 * correctement, mais rattaché à sa propre session serveur : l'attribution à la
 * source de trafic d'origine est perdue. À ce volume, compter vaut mieux que
 * ne rien voir ; la corriger exigerait de transporter le `client_id` GA4
 * jusqu'à Stripe, ce que les Payment Links ne permettent pas sans code.
 *
 * Sans `GA4_API_SECRET`, la fonction ne fait rien et le dit une fois. Elle
 * n'échoue jamais bruyamment : une mesure ratée ne doit pas faire échouer une
 * activation de compte déjà payée.
 */

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-YSSLHJ5WYD';
const API_SECRET = process.env.GA4_API_SECRET;

export interface AchatGA4 {
  /** Identifiant de la session de paiement Stripe : déduplique côté GA4. */
  transactionId: string;
  /** Montant encaissé, en centimes, tel que Stripe le rapporte. */
  montantCentimes: number;
  devise: string;
  /** 'a-vie' ou 'abonnement' — devient le nom de l'article acheté. */
  nature: 'a-vie' | 'abonnement';
  /** Identifiant du compte activé. */
  userId: string;
}

export async function envoyerAchatGA4(achat: AchatGA4): Promise<void> {
  if (!API_SECRET) {
    console.warn('[ga4] GA4_API_SECRET absent : achat non transmis à Analytics.');
    return;
  }

  const valeur = achat.montantCentimes / 100;
  const article =
    achat.nature === 'a-vie' ? 'Premium à vie' : 'Abonnement Premium';

  const corps = {
    client_id: achat.userId,
    user_id: achat.userId,
    non_personalized_ads: true,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: achat.transactionId,
          value: valeur,
          currency: achat.devise.toUpperCase(),
          items: [
            {
              item_id: achat.nature,
              item_name: article,
              price: valeur,
              quantity: 1,
            },
          ],
        },
      },
    ],
  };

  try {
    const reponse = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
        MEASUREMENT_ID
      )}&api_secret=${encodeURIComponent(API_SECRET)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(corps),
      }
    );
    // Le Measurement Protocol répond 204 sans corps, y compris sur un payload
    // invalide : seul l'endpoint /debug/mp/collect signale les erreurs.
    if (!reponse.ok) {
      console.error('[ga4] achat refusé par Analytics :', { status: reponse.status });
    }
  } catch (error) {
    console.error('[ga4] achat non transmis :', { message: (error as Error).message });
  }
}
