# Configuration OAuth pour Tennis String Advisor

## URLs importantes

- **URL du projet Supabase** : `https://yhhdkllbaxuhwrfpsmev.supabase.co`
- **URL de callback OAuth** : `https://yhhdkllbaxuhwrfpsmev.supabase.co/auth/v1/callback`

---

## 1. Configuration Google OAuth

### Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API" (ou "Google Identity")

### Étape 2 : Configurer l'écran de consentement OAuth

1. Allez dans **APIs & Services** > **OAuth consent screen**
2. Choisissez **External** (pour les utilisateurs externes)
3. Remplissez :
   - **App name** : Tennis String Advisor
   - **User support email** : votre email
   - **Developer contact** : votre email
4. Ajoutez les scopes :
   - `email`
   - `profile`
   - `openid`
5. Publiez l'application

### Étape 3 : Créer les identifiants OAuth

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez **Create Credentials** > **OAuth client ID**
3. Type d'application : **Web application**
4. Nom : `Tennis String Advisor`
5. **Origines JavaScript autorisées** :
   ```
   https://yhhdkllbaxuhwrfpsmev.supabase.co
   https://votre-domaine-production.com
   https://3000-izkmno3nc96g5pk5vjjvu-c07dda5e.sandbox.novita.ai
   ```
6. **URIs de redirection autorisées** :
   ```
   https://yhhdkllbaxuhwrfpsmev.supabase.co/auth/v1/callback
   ```
7. Copiez le **Client ID** et **Client Secret**

### Étape 4 : Configurer dans Supabase

1. Allez dans [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Authentication** > **Providers**
4. Trouvez **Google** et cliquez pour configurer
5. Activez Google
6. Collez le **Client ID** et **Client Secret**
7. **Redirect URL** doit être : `https://yhhdkllbaxuhwrfpsmev.supabase.co/auth/v1/callback`
8. Sauvegardez

---

## 2. Configuration Facebook OAuth

### Étape 1 : Créer une App Facebook

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Cliquez **My Apps** > **Create App**
3. Choisissez **Consumer** ou **Business**
4. Nom de l'app : `Tennis String Advisor`

### Étape 2 : Configurer Facebook Login

1. Dans votre app, allez dans **Add Product**
2. Ajoutez **Facebook Login**
3. Allez dans **Facebook Login** > **Settings**
4. Dans **Valid OAuth Redirect URIs**, ajoutez :
   ```
   https://yhhdkllbaxuhwrfpsmev.supabase.co/auth/v1/callback
   ```
5. Sauvegardez

### Étape 3 : Configurer les paramètres de l'App

1. Allez dans **Settings** > **Basic**
2. Copiez l'**App ID** et **App Secret**
3. Ajoutez le **Privacy Policy URL** (requis pour la production)
4. Ajoutez le **Domain** de votre site

### Étape 4 : Configurer dans Supabase

1. Allez dans [Supabase Dashboard](https://supabase.com/dashboard)
2. Allez dans **Authentication** > **Providers**
3. Trouvez **Facebook** et cliquez pour configurer
4. Activez Facebook
5. Collez l'**App ID** (Client ID) et **App Secret** (Client Secret)
6. Sauvegardez

---

## 3. Configuration des URLs de redirection dans Supabase

1. Allez dans **Authentication** > **URL Configuration**
2. Configurez :
   - **Site URL** : `https://votre-domaine-production.com`
   - **Redirect URLs** (ajoutez toutes ces URLs) :
     ```
     https://votre-domaine-production.com/auth.html
     https://votre-domaine-production.com/account.html
     https://3000-izkmno3nc96g5pk5vjjvu-c07dda5e.sandbox.novita.ai/auth.html
     https://3000-izkmno3nc96g5pk5vjjvu-c07dda5e.sandbox.novita.ai/account.html
     http://localhost:3000/auth.html
     http://localhost:3000/account.html
     ```

---

## 4. Test de l'authentification

### Test manuel

1. Ouvrez la page `/auth.html`
2. Cliquez sur **Google** ou **Facebook**
3. Vous devriez être redirigé vers la page de connexion du provider
4. Après connexion, vous serez redirigé vers `/auth.html`
5. Si la connexion réussit, vous serez automatiquement redirigé vers `/account.html`

### Debugging

Ouvrez la console du navigateur (F12) et vérifiez :
- Les logs `Auth event: ...`
- Les erreurs éventuelles

### Erreurs communes

| Erreur | Solution |
|--------|----------|
| `redirect_uri_mismatch` | Vérifiez que l'URI de callback est exactement `https://yhhdkllbaxuhwrfpsmev.supabase.co/auth/v1/callback` |
| `invalid_client` | Vérifiez le Client ID/Secret dans Supabase |
| `access_denied` | L'utilisateur a refusé l'accès ou l'app n'est pas publiée |

---

## 5. Production Checklist

- [ ] Google OAuth configuré et testé
- [ ] Facebook OAuth configuré et testé
- [ ] URLs de production ajoutées dans Supabase
- [ ] App Facebook en mode "Live" (pas "Development")
- [ ] Politique de confidentialité publiée
- [ ] Conditions d'utilisation publiées
- [ ] HTTPS activé sur le domaine de production

---

## Support

Pour toute question sur la configuration :
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Facebook OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-facebook)
