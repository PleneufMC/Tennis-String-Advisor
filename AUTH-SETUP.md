# Mise en service de la connexion (NextAuth + Neon)

L'authentification est **codée et prête**. Il reste à fournir les variables
d'environnement et à pousser le schéma vers la base Neon. Tant que les clés ne
sont pas renseignées, le bouton « Se connecter » reste visible mais la page
`/auth/signin` affiche un message « connexion bientôt disponible » (aucun crash,
aucun 404).

## Architecture

- **NextAuth v4** (App Router) — route `src/app/api/auth/[...nextauth]/route.ts`
- **Config centrale** — `src/lib/auth.ts` (`authOptions`, providers conditionnels)
- **Persistance** — Prisma + Neon (PostgreSQL), stratégie de session `database`
- **Tables** — `User`, `Account`, `Session`, `VerificationToken` (schéma Prisma)
- **UI** — page `/auth/signin`, `/auth/error`, `/auth/verify-request`, bouton
  compte dans le header (`src/components/layout/auth-button.tsx`)

Les providers s'activent **automatiquement** dès que leurs variables sont
présentes (Google si `GOOGLE_CLIENT_ID`+`GOOGLE_CLIENT_SECRET`, Email si
`EMAIL_SERVER_*`).

## Étape 1 — Pousser les tables vers Neon

Le schéma `prisma/schema.prisma` contient déjà toutes les tables. Depuis un
environnement où `DATABASE_URL` pointe vers Neon :

```bash
# Crée/met à jour les tables User, Account, Session, VerificationToken,
# Configuration sur la base Neon (sans migration formelle) :
npx prisma db push

# (Alternative versionnée, recommandée à terme :)
# npx prisma migrate dev --name add_auth_tables
```

`prisma db push` est non destructif pour les tables existantes : il ajoute
seulement ce qui manque.

## Étape 2 — Variables d'environnement Netlify

Dans **Netlify → Site settings → Environment variables**, ajouter :

| Variable | Valeur | Requis |
|---|---|---|
| `DATABASE_URL` | URL Neon **-pooler** (`...?sslmode=require`) | ✅ (déjà présente) |
| `NEXTAUTH_URL` | `https://tennisstringadvisor.org` | ✅ |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | ✅ |
| `GOOGLE_CLIENT_ID` | ID client OAuth Google | recommandé |
| `GOOGLE_CLIENT_SECRET` | Secret client OAuth Google | recommandé |
| `EMAIL_SERVER_HOST` | ex. `smtp.gmail.com` | optionnel |
| `EMAIL_SERVER_PORT` | `587` | optionnel |
| `EMAIL_SERVER_USER` | utilisateur SMTP | optionnel |
| `EMAIL_SERVER_PASSWORD` | mot de passe SMTP / app password | optionnel |
| `EMAIL_FROM` | `noreply@tennisstringadvisor.org` | optionnel |

## Étape 3 — Google OAuth (recommandé)

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**
2. **Create credentials → OAuth client ID → Web application**
3. **Authorized redirect URIs** :
   - `https://tennisstringadvisor.org/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (dev)
4. Copier l'ID + le secret dans Netlify.

## Étape 4 — Redéployer

Un redéploiement Netlify suffit (les variables sont lues au runtime). Le bouton
« Se connecter » devient alors pleinement fonctionnel.

## Vérification

- `https://tennisstringadvisor.org/api/auth/providers` doit lister les providers actifs.
- La page `/auth/signin` affiche les boutons Google / e-mail.
- Après connexion, le header affiche l'avatar + menu « Se déconnecter ».
