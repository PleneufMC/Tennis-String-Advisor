# Configuration des Limitations Gratuites

Ce document explique comment activer les limitations pour le **Configurateur** et le **Calculateur RCS**.

## 🎯 Fonctionnalités de Limitation

### Configurateur
- **Utilisateurs non connectés** : 1 configuration gratuite (stockée en localStorage)
- **Comptes gratuits** : 1 configuration gratuite
- **Comptes Premium** : Configurations illimitées

### Calculateur RCS
- **Utilisateurs non connectés** : 1 calcul gratuit (stocké en localStorage)
- **Comptes gratuits** : 1 calcul gratuit
- **Comptes Premium** : Calculs illimités

## 📝 Étape 1 : Mise à jour de la Base de Données

### Option A : Nouvelle Installation

Si vous créez une nouvelle base de données, exécutez simplement le schema complet :

```sql
-- Exécuter dans Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- Coller tout le contenu de supabase/schema.sql
```

### Option B : Base Existante (Migration)

Si vous avez déjà une table `profiles`, exécutez cette migration :

1. Allez dans votre dashboard Supabase
2. Ouvrez **SQL Editor** (dans le menu de gauche)
3. Cliquez sur **New Query**
4. Copiez-collez le code suivant :

```sql
-- Ajouter les colonnes de tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS configurator_uses INTEGER DEFAULT 0;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rcs_calculations_used INTEGER DEFAULT 0;

-- Ajouter les commentaires pour documentation
COMMENT ON COLUMN public.profiles.configurator_uses IS 'Nombre de configurations utilisées (gratuit = 1)';
COMMENT ON COLUMN public.profiles.rcs_calculations_used IS 'Nombre de calculs RCS utilisés (gratuit = 1)';

-- Initialiser les valeurs pour les utilisateurs existants
UPDATE public.profiles 
SET configurator_uses = 0 
WHERE configurator_uses IS NULL;

UPDATE public.profiles 
SET rcs_calculations_used = 0 
WHERE rcs_calculations_used IS NULL;
```

5. Cliquez sur **Run** (ou `Ctrl+Enter`)

### Vérification

Pour vérifier que les colonnes ont bien été ajoutées :

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('configurator_uses', 'rcs_calculations_used');
```

Vous devriez voir :

```
column_name              | data_type | column_default
-------------------------|-----------|---------------
configurator_uses        | integer   | 0
rcs_calculations_used    | integer   | 0
```

## 🧪 Étape 2 : Test des Limitations

### Test du Configurateur

1. **Mode non connecté** :
   - Ouvrez https://tennisstringadvisor.org/configurator.html
   - Complétez une configuration → ✅ Devrait fonctionner
   - Recommencez (bouton "Recommencer") → 🔒 Devrait afficher le paywall

2. **Réinitialiser le test** :
   ```javascript
   // Dans la console navigateur (F12)
   localStorage.removeItem('configurator_free_used');
   location.reload();
   ```

3. **Mode compte gratuit** :
   - Créez un compte test sur `/auth.html`
   - Utilisez le configurateur une fois → ✅ OK
   - Recommencez → 🔒 Paywall

4. **Réinitialiser pour un utilisateur** :
   ```sql
   -- Dans Supabase SQL Editor
   UPDATE public.profiles 
   SET configurator_uses = 0 
   WHERE email = 'votre-email-test@example.com';
   ```

### Test du Calculateur RCS

1. **Mode non connecté** :
   - Ouvrez https://tennisstringadvisor.org/rcs-calculator.html
   - Effectuez un calcul → ✅ OK
   - Cliquez sur "Calculer" à nouveau → 🔒 Paywall

2. **Réinitialiser** :
   ```javascript
   localStorage.removeItem('rcs_free_trial_used');
   location.reload();
   ```

## 🎨 Personnalisation

### Modifier le nombre d'essais gratuits

Dans `/public/configurator.html` (ligne 520) :
```javascript
const FREE_CONFIGURATIONS = 1; // Modifier ici (ex: 3 pour 3 essais)
```

Dans `/public/rcs-calculator.html` :
```javascript
const FREE_CALCULATIONS = 1; // Modifier ici
```

### Modifier le prix Premium

Dans `/public/configurator.html` et `/public/rcs-calculator.html`, cherchez :
```html
<span class="text-3xl font-bold text-gray-900">2,99€</span>
```

## 🔧 Dépannage

### "Le compteur ne s'incrémente pas"

Vérifiez que :
1. Les colonnes existent bien dans Supabase
2. L'utilisateur est bien connecté (vérifiez avec `console.log(currentUser)`)
3. Les permissions RLS (Row Level Security) permettent l'UPDATE

```sql
-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### "Le paywall ne s'affiche pas"

Vérifiez la console navigateur (F12) pour les erreurs JavaScript. Assurez-vous que :
- Supabase est bien initialisé
- `canConfigure()` retourne `false`
- `showPaywall()` est bien appelée

### "Reset manuel d'un utilisateur"

```sql
-- Reset tous les compteurs pour un utilisateur
UPDATE public.profiles 
SET 
  configurator_uses = 0,
  rcs_calculations_used = 0
WHERE email = 'email@example.com';
```

### "Reset global (tous les utilisateurs)"

⚠️ **ATTENTION** : Ceci réinitialise tous les compteurs !

```sql
UPDATE public.profiles 
SET 
  configurator_uses = 0,
  rcs_calculations_used = 0;
```

## 📊 Monitoring

### Voir les statistiques d'usage

```sql
-- Utilisateurs ayant épuisé leur essai gratuit
SELECT email, configurator_uses, rcs_calculations_used, is_premium
FROM public.profiles
WHERE (configurator_uses >= 1 OR rcs_calculations_used >= 1)
  AND is_premium = FALSE
ORDER BY created_at DESC;

-- Taux de conversion (utilisateurs devenus premium après essai)
SELECT 
  COUNT(*) FILTER (WHERE configurator_uses >= 1 AND is_premium = FALSE) as free_users_blocked,
  COUNT(*) FILTER (WHERE is_premium = TRUE) as premium_users,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_premium = TRUE) / 
        NULLIF(COUNT(*) FILTER (WHERE configurator_uses >= 1), 0), 2) as conversion_rate
FROM public.profiles;
```

## ✅ Checklist Finale

- [ ] Migration SQL exécutée dans Supabase
- [ ] Colonnes `configurator_uses` et `rcs_calculations_used` présentes
- [ ] Test mode non connecté (configurateur) → paywall après 1 usage
- [ ] Test mode non connecté (RCS) → paywall après 1 calcul
- [ ] Test compte gratuit → paywall après 1 usage
- [ ] Test compte Premium → usage illimité
- [ ] Google Analytics configuré pour tracker les conversions

## 🚀 Prochaines Étapes

1. Intégrer Stripe pour les paiements Premium
2. Configurer les webhooks Stripe pour activer automatiquement le premium
3. Ajouter des événements GA4 pour tracker le paywall
4. Créer un dashboard admin pour monitorer les conversions

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou contactez contact@tennisstringadvisor.com
