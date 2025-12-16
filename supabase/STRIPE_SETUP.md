# Configuration Stripe - Tennis String Advisor

Ce document explique comment finaliser l'intégration Stripe pour les paiements Premium.

## 📋 Price IDs Configurés

| Plan | Price ID | Prix | Type |
|------|----------|------|------|
| Mensuel | `price_1Sf3qpIkmQ7vFcvcYHBFjCf2` | 2,99€/mois | Subscription |
| Annuel | `price_1Sf3vFIkmQ7vFcvc1QPO5kaQ` | 24,99€/an | Subscription |
| Lifetime | `price_1Sf3w1IkmQ7vFcvcQ63qylGG` | 19,99€ (unique) | Payment |

## 🔑 Étape 1 : Récupérer votre Clé Publique Stripe

1. Allez sur https://dashboard.stripe.com/apikeys
2. Copiez la **Publishable key** :
   - **Mode Test** : `pk_test_xxxxxxxxxxxxxxxx`
   - **Mode Live** : `pk_live_xxxxxxxxxxxxxxxx`

3. Remplacez dans `public/premium.html` :

```javascript
// Ligne ~520
const STRIPE_PUBLISHABLE_KEY = 'pk_live_VOTRE_CLE_PUBLIQUE';  // ← Remplacez ici
```

## 🔗 Étape 2 : Configurer les Webhooks Stripe

Les webhooks permettent à Stripe de notifier votre app quand un paiement réussit.

### 2.1 Créer le Webhook

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez **"Add endpoint"**
3. Configuration :
   - **Endpoint URL** : `https://yhhdkllbaxuhwrfpsmev.supabase.co/functions/v1/stripe-webhook`
   - **Events to listen** :
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`

4. Cliquez **"Add endpoint"**
5. Copiez le **Webhook Signing Secret** : `whsec_xxxxxxxx`

### 2.2 Créer la Supabase Edge Function

Créez un fichier `supabase/functions/stripe-webhook/index.ts` :

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Webhook Error', { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      const customerId = session.customer as string
      
      if (userId) {
        // Determine plan type from metadata or price
        let premiumType = 'monthly'
        if (session.mode === 'payment') {
          premiumType = 'lifetime'
        } else if (session.metadata?.plan === 'annual') {
          premiumType = 'annual'
        }
        
        // Calculate expiry
        let expiresAt = null
        if (premiumType === 'monthly') {
          expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        } else if (premiumType === 'annual') {
          expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
        // lifetime = null (never expires)
        
        // Update user profile
        const { error } = await supabase
          .from('profiles')
          .update({
            is_premium: true,
            premium_type: premiumType,
            premium_started_at: new Date().toISOString(),
            premium_expires_at: expiresAt,
            stripe_customer_id: customerId,
            stripe_subscription_id: session.subscription as string || null
          })
          .eq('id', userId)
        
        if (error) {
          console.error('Error updating profile:', error)
        } else {
          console.log(`User ${userId} upgraded to ${premiumType}`)
        }
        
        // If lifetime, decrement counter
        if (premiumType === 'lifetime') {
          await supabase.rpc('decrement_lifetime_counter')
        }
      }
      break
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      
      // Find user by stripe_customer_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()
      
      if (profile) {
        await supabase
          .from('profiles')
          .update({
            is_premium: false,
            premium_expires_at: new Date().toISOString()
          })
          .eq('id', profile.id)
        
        console.log(`User ${profile.id} subscription cancelled`)
      }
      break
    }
    
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      
      console.log(`Payment failed for customer ${customerId}`)
      // Optionally send email notification
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
```

### 2.3 Déployer la Edge Function

```bash
# Installer Supabase CLI si pas fait
npm install -g supabase

# Login
supabase login

# Lier au projet
supabase link --project-ref yhhdkllbaxuhwrfpsmev

# Configurer les secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET

# Déployer
supabase functions deploy stripe-webhook
```

## ✅ Étape 3 : Tester en Mode Test

1. Utilisez les clés **test** de Stripe (`pk_test_xxx`, `sk_test_xxx`)
2. Utilisez la carte de test : `4242 4242 4242 4242`
3. Date d'expiration : n'importe quelle date future
4. CVC : n'importe quels 3 chiffres

### Test Checklist

- [ ] Cliquer sur "Choisir ce plan" (Mensuel)
- [ ] Se connecter si non connecté
- [ ] Cliquer "Payer maintenant"
- [ ] Redirection vers Stripe Checkout
- [ ] Payer avec carte de test
- [ ] Redirection vers `/account.html?payment=success`
- [ ] Vérifier dans Supabase que `is_premium = true`

## 🚀 Étape 4 : Passer en Production

1. Remplacez les clés test par les clés live
2. Testez un vrai paiement (vous pouvez rembourser après)
3. Vérifiez les webhooks dans Stripe Dashboard

## 📊 Monitoring

### Voir les Paiements

Dans Stripe Dashboard : https://dashboard.stripe.com/payments

### Voir les Abonnements

Dans Stripe Dashboard : https://dashboard.stripe.com/subscriptions

### Voir les Utilisateurs Premium dans Supabase

```sql
SELECT email, is_premium, premium_type, premium_started_at, premium_expires_at
FROM profiles
WHERE is_premium = TRUE
ORDER BY premium_started_at DESC;
```

## 🔧 Configuration Alternative : Stripe Payment Links

Si vous préférez une solution plus simple sans code :

1. Allez sur https://dashboard.stripe.com/payment-links
2. Créez un Payment Link pour chaque plan
3. Remplacez les boutons dans `premium.html` par des liens directs

```html
<a href="https://buy.stripe.com/VOTRE_PAYMENT_LINK_MENSUEL" class="...">
  Choisir ce plan
</a>
```

⚠️ Note : Avec les Payment Links, vous devrez configurer les webhooks pour activer le premium automatiquement.

## 🛟 Dépannage

### "Clé Stripe invalide"

Vérifiez que vous utilisez la bonne clé (test vs live) et qu'elle est correctement copiée.

### "Webhook non reçu"

1. Vérifiez l'URL du webhook dans Stripe
2. Vérifiez que la Edge Function est déployée
3. Consultez les logs : `supabase functions logs stripe-webhook`

### "Premium non activé après paiement"

1. Vérifiez les logs du webhook
2. Vérifiez que `client_reference_id` contient bien l'user ID
3. Vérifiez les permissions dans Supabase

## 📞 Support

- **Stripe** : https://support.stripe.com/
- **Supabase** : https://supabase.com/docs
- **Tennis String Advisor** : contact@tennisstringadvisor.com
