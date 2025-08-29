# 💳 Configuration Stripe pour Tennis String Advisor

## 🚀 Guide de configuration rapide

### 1. Créer un compte Stripe
1. Allez sur [stripe.com](https://stripe.com) et créez un compte
2. Activez le mode Test pour commencer

### 2. Récupérer vos clés API
1. Dans le Dashboard Stripe, allez dans **Developers** → **API keys**
2. Copiez votre **Publishable key** (commence par `pk_test_`)
3. Copiez votre **Secret key** (commence par `sk_test_`)

### 3. Créer les produits et prix
Dans le Dashboard Stripe :

#### Plan Premium Mensuel
1. Allez dans **Products** → **Add product**
2. Nom : "Tennis String Advisor Premium - Mensuel"
3. Prix : 9.99 EUR / mois
4. Copiez l'ID du prix (commence par `price_`)

#### Plan Premium Annuel
1. Créez un nouveau prix pour le même produit
2. Prix : 99 EUR / an
3. Copiez l'ID du prix

#### Plan Pro Mensuel
1. Créez un nouveau produit "Tennis String Advisor Pro - Mensuel"
2. Prix : 19.99 EUR / mois
3. Copiez l'ID du prix

#### Plan Pro Annuel
1. Créez un nouveau prix pour le produit Pro
2. Prix : 199 EUR / an
3. Copiez l'ID du prix

### 4. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE

# URLs de l'application
NEXT_PUBLIC_APP_URL=https://votre-site.netlify.app

# NextAuth (générez une clé secrète aléatoire)
NEXTAUTH_URL=https://votre-site.netlify.app
NEXTAUTH_SECRET=votre-cle-secrete-aleatoire

# Database (utilisez une base PostgreSQL gratuite comme Supabase ou Neon)
DATABASE_URL=postgresql://user:password@host:5432/database
```

### 5. Mettre à jour les prix dans le code

Dans `/src/app/pricing/page.tsx`, remplacez les placeholders :

```javascript
stripePriceId: {
  monthly: 'price_ID_PREMIUM_MENSUEL',
  yearly: 'price_ID_PREMIUM_ANNUEL'
}
```

### 6. Configurer les webhooks Stripe (Production)

1. Dans Stripe Dashboard → **Webhooks** → **Add endpoint**
2. URL : `https://votre-site.netlify.app/api/stripe-webhook`
3. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 7. Variables d'environnement sur Netlify

Dans Netlify → **Site settings** → **Environment variables**, ajoutez :

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🧪 Tester les paiements

Utilisez ces cartes de test Stripe :
- **Succès** : 4242 4242 4242 4242
- **Décliné** : 4000 0000 0000 0002
- **Authentification requise** : 4000 0025 0000 3155

Date d'expiration : N'importe quelle date future
CVV : N'importe quel nombre à 3 chiffres

## 📝 Checklist de déploiement

- [ ] Compte Stripe créé et vérifié
- [ ] Produits et prix créés dans Stripe
- [ ] Clés API récupérées
- [ ] Variables d'environnement configurées localement
- [ ] Variables d'environnement configurées sur Netlify
- [ ] Base de données PostgreSQL configurée
- [ ] Webhooks Stripe configurés
- [ ] Mode Test validé avec paiement test
- [ ] Migration vers le mode Live

## 🔒 Sécurité

- **Ne jamais** commiter les clés API dans le code
- Utilisez toujours des variables d'environnement
- Vérifiez les signatures des webhooks
- Utilisez HTTPS en production
- Activez l'authentification à deux facteurs sur Stripe

## 📧 Support

Pour toute question sur l'intégration Stripe :
- Documentation : [stripe.com/docs](https://stripe.com/docs)
- Support : support@stripe.com