# Authentification — état déployé (NextAuth + Prisma + Supabase)

> **Statut : ✅ EN PRODUCTION** (depuis v2.7.0, 2026-06-18).
> 3 modes de connexion actifs. Ce document décrit la config **réelle** qui tourne.

## Modes de connexion actifs

| Mode | Statut | Couverture |
|------|--------|-----------|
| 🔵 **Google OAuth** | ✅ Actif | Utilisateurs Google |
| 🔑 **E-mail / mot de passe** | ✅ Actif | **Tout le monde** (immédiat) |
| ✉️ **Magic link e-mail** | ⚠️ Actif mais limité | Voir *Limite Resend* ci-dessous |

## Architecture

- **NextAuth v4** (App Router) — route `src/app/api/auth/[...nextauth]/route.ts`
- **Config centrale** — `src/lib/auth.ts` (`authOptions`, 3 providers)
- **Inscription** — `src/app/api/auth/register/route.ts` (bcrypt cost 12)
- **Pages** — `/auth/signin`, `/auth/signup`, `/auth/error`, `/auth/verify-request`
- **Persistance** — Prisma + Supabase (PostgreSQL)
- **Tables** — `User` (+ `passwordHash`), `Account`, `Session`, `VerificationToken`
- **Session : stratégie `jwt`** ⚠️ (et non `database`) — imposée par le `CredentialsProvider`.
  Les comptes Google/magic link sont toujours persistés via l'adaptateur Prisma, mais la
  session elle-même vit dans un JWT signé. Callback `jwt()` → recharge `isPremium`/`premiumUntil`
  depuis la DB à chaque rafraîchissement.

## Variables d'environnement Netlify (en place)

| Variable | Valeur (prod) | Note |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.<ref>:<pwd>@aws-1-eu-west-2.pooler.supabase.com:**5432**/postgres?connection_limit=1` | ⚠️ **port 5432** (cf. findings) |
| `NEXTAUTH_URL` | `https://tennisstringadvisor.org` | sans chemin ! pas de `/api/...` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | — |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth Google | Redirect URI : `https://tennisstringadvisor.org/api/auth/callback/google` |
| `EMAIL_SERVER_HOST` | `smtp.resend.com` | magic link |
| `EMAIL_SERVER_PORT` | `465` | — |
| `EMAIL_SERVER_USER` | `resend` | — |
| `EMAIL_SERVER_PASSWORD` | `re_…` (clé API Resend) | — |
| `EMAIL_FROM` | `onboarding@resend.dev` | ⚠️ à passer à `noreply@tennisstringadvisor.org` après vérif domaine |

> Les variables sont lues au **runtime** : un simple *Redeploy* suffit après modification.

## ⚠️ Findings critiques Supabase (NE PAS OUBLIER)

1. **Port `5432` (session pooler) FONCTIONNE** depuis serverless/sandbox.
   Le port **`6543` (transaction pooler) TIMEOUT** dans la région `aws-1-eu-west-2`.
   → `DATABASE_URL` **doit** utiliser le **5432**.
2. **Username = `postgres.<ref>`** (ex. `postgres.yhhdkllbaxuhwrfpsmev`), pas juste `postgres`
   (sinon `FATAL: ENOIDENTIFIER: no tenant identifier provided`).
3. **Client Prisma sur Netlify CI** : hook `postinstall: prisma generate` (package.json)
   + `npx prisma generate` dans la commande de build (`netlify.toml`).

## Premium & comptes

- Le premium est piloté **uniquement** par `User.isPremium` (bool) et `User.premiumUntil` (date|null).
- **Il n'existe AUCUNE notion de compte admin/master** dans le code.
- Pour passer un compte premium manuellement :
  1. Supabase → table `User` → mettre `isPremium = true` (et éventuellement `premiumUntil`).
  2. **Se déconnecter / reconnecter** sur le site (session `jwt` → le statut n'est rechargé qu'au refresh du token).
- Le bouton « Premium » du header pointe **toujours** vers `/pricing` (CTA marketing, pas un accès gated).
- Owner `pfermanian@gmail.com` : déjà passé premium permanent (`isPremium=true`, `premiumUntil=null`).

## Limite Resend (magic link)

Tant que le domaine `tennisstringadvisor.org` n'est **pas vérifié** dans Resend,
l'expéditeur `onboarding@resend.dev` n'envoie **qu'à l'adresse du compte Resend**
(`pleneuftrading@gmail.com`). Pour ouvrir le magic link à tous :

1. Resend → **Domains** → Add Domain → `tennisstringadvisor.org`
2. Ajouter les DNS (SPF/DKIM) chez le registrar, attendre la vérification.
3. Netlify → `EMAIL_FROM = noreply@tennisstringadvisor.org` → *Redeploy*.

> L'e-mail/mot de passe couvre déjà tous les visiteurs non-Google : la vérif domaine n'est pas bloquante.

## Vérification rapide

- `https://tennisstringadvisor.org/api/auth/providers` liste `google`, `email`, `credentials`.
- `/auth/signin` : bouton Google + champ e-mail/mot de passe + bouton magic link + lien « Créer un compte ».
- `/auth/signup` : inscription → **auto-connexion**.
- Après connexion, le header affiche l'avatar + menu (badge premium si `isPremium`).

## Sécurité — à régénérer (exposés en clair durant la mise en service)

- `GOOGLE_CLIENT_SECRET`
- Clé API Resend `re_…`
