# 🚀 Configuration Ultra Simple avec Stripe Payment Links

## ✅ Configuration actuelle

Les liens de paiement Stripe sont **déjà intégrés** dans le code :

- **Mensuel (4.99€)** : `https://buy.stripe.com/4gMcN56mL5wS3l44XO8Vi01`
- **Annuel (49.90€)** : `https://buy.stripe.com/9B600jeThbVgcVEfCs8Vi02`

## 📝 Configuration dans Stripe Dashboard

### 1. Pages de retour
Dans votre Dashboard Stripe, configurez les URLs de retour :

1. Allez dans **Payment Links** → Cliquez sur votre lien
2. Dans **After payment** → **Confirmation page**
3. Configurez :
   - **Success URL** : `https://votre-site.netlify.app/payment-success`
   - **Cancel URL** : `https://votre-site.netlify.app/payment-cancelled`

### 2. Activer les essais gratuits (optionnel)
Pour offrir 7 jours d'essai gratuit :
1. Éditez votre Payment Link
2. Dans **Subscription trials** → Enable free trial
3. Définir : 7 days

### 3. Collecter les informations client
1. Dans **Customer information**
2. Activez :
   - Email (requis)
   - Nom
   - Adresse (optionnel)

## 🎨 Personnalisation (dans Stripe)

### Couleurs de marque
1. **Settings** → **Branding**
2. Couleur principale : `#10b981` (vert Tennis Advisor)
3. Logo : Uploadez votre logo

### Messages personnalisés
1. Dans chaque Payment Link
2. **Description** : "Accès Premium à Tennis String Advisor"
3. **Thank you page text** : "Bienvenue dans la communauté Premium !"

## 📊 Suivi des conversions

### Google Analytics (optionnel)
Ajoutez à `/payment-success/page.tsx` :
```javascript
// Tracking de conversion
if (typeof gtag !== 'undefined') {
  gtag('event', 'purchase', {
    value: 4.99, // ou 49.90 pour annuel
    currency: 'EUR',
    items: [{
      item_name: 'Tennis String Advisor Premium'
    }]
  });
}
```

### Facebook Pixel (optionnel)
```javascript
// Tracking Facebook
if (typeof fbq !== 'undefined') {
  fbq('track', 'Purchase', {
    value: 4.99,
    currency: 'EUR'
  });
}
```

## ✅ Checklist de déploiement

- [x] Liens Stripe intégrés dans le code
- [x] Page de succès créée (`/payment-success`)
- [x] Page d'annulation créée (`/payment-cancelled`)
- [ ] URLs de retour configurées dans Stripe
- [ ] Mode Test validé avec carte 4242 4242 4242 4242
- [ ] Passage en mode Live dans Stripe
- [ ] Liens Live remplacés dans le code

## 🔄 Passer en mode Production

1. Dans Stripe, activez le mode **Live**
2. Créez les mêmes Payment Links en mode Live
3. Remplacez les liens dans `/src/app/pricing/page.tsx` :
```javascript
stripeLinks: {
  monthly: 'https://buy.stripe.com/VOTRE_LIEN_LIVE_MENSUEL',
  yearly: 'https://buy.stripe.com/VOTRE_LIEN_LIVE_ANNUEL'
}
```

## 💡 Avantages de cette approche

✅ **Ultra simple** : Pas d'API à configurer
✅ **Sécurisé** : Tout est géré par Stripe
✅ **Rapide** : Déployé en 5 minutes
✅ **Fiable** : Pas de webhooks à gérer
✅ **Flexible** : Modifiable depuis Stripe Dashboard

## 📧 Emails automatiques

Stripe enverra automatiquement :
- Email de confirmation de paiement
- Facture PDF
- Rappels de renouvellement
- Notifications d'échec de paiement

## 🆘 Support

- **Email** : support@tennisadvisor.com
- **Stripe Support** : support.stripe.com