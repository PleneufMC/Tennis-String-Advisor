# 🗺️ Roadmap & Suivi — Tennis String Advisor

> Document de pilotage. Stratégie issue de l'audit (`Audit-Full.md`) :
> **réparer → mesurer → monétiser**, une amélioration mesurée à la fois.
>
> **Dernière mise à jour** : 2026-06-19 · **Version courante** : `2.9.0`

---

## 📌 Méthode de travail (rappel)

- **Workflow Git** : branche de feature → PR ciblant **`main`** directement → merge (fast-forward) → resync de la branche `genspark_ai_developer` sur `main`.
  - On **ne passe plus** par `genspark_ai_developer` pour les PR.
  - `main` est auto-déployée par **Netlify** (`tennisstringadvisor.org`).
- **Definition of Done** : `npm run build` ✅ + `npm run type-check` ✅ + vérif fonctionnelle + bump de version (`package.json`).
- **Commits** : convention *Conventional Commits* (`feat`, `fix`, `content`, `docs`, `chore`).

---

## ✅ Fait (sessions précédentes)

| # | Sujet | Audit | PR | Commit `main` | Version |
|---|-------|-------|----|----|---------|
| 1 | Fix navigation | — | #22 | `928c99f` | — |
| 2 | **GA4 — mesure de bout en bout** + events funnel (`configurator_complete`, `premium_cta_click`, `affiliate_click` prêt) | #0.1–0.3 | #23 | `cfd0766` | 2.3.0 |
| 3 | **Article blog** « Actualité Matériel Tennis 2026 — Guerre du Spin » (+ sitemap + carte à la une) | Axe 1/2 | #24 | `9150eb5` | 2.3.1 |
| 4 | **Fix CSS blog** — `@apply` non compilé par le CDN Tailwind → CSS standard sur 4 articles | — | #25 | `067390b` | 2.3.2 |
| 5 | **Fix images Open Graph** (URL `localhost` en prod) + favicon vide régénéré | #2.1 | #26 | `3541a35` | 2.3.3 |
| 6 | **Affiliation Tennis-Point (Awin)** — infra paramétrable + `BuyButton` + disclosure | #3.0 | #27 | `3d1854d` | **2.4.0** |
| 7 | **Auth réelle** NextAuth + Prisma (Google + e-mail), docs ciblant Supabase | #3.1 | #33, #34 | `8135149`, `a688bda` | 2.5.x |
| 8 | **Mise en service auth** : fix build (ERESOLVE), génération Prisma sur Netlify CI, cleanup commentaires Neon→Supabase | — | #35, #36, #37 | `e5f8823` | 2.6.4 |
| 9 | **Magic link e-mail** activé en prod (SMTP **Resend**) + fix doc port 5432 | #3.1 | #38 | `76b4605` | 2.6.5 |
| 10 | **Connexion e-mail/mot de passe** (`CredentialsProvider` + migration session `database`→`jwt` + `/auth/signup` + `/api/auth/register` + `User.passwordHash`) | #3.1 | #39 | `cd45fd6` | **2.7.0** |
| — | **Documentation** (ROADMAP + AUTH-SETUP à jour, diagnostic premium) | — | #40 | `e6ac6c7` | 2.7.1 |
| 11 | **Journal de cordage synchronisé** (1ʳᵉ vraie fonctionnalité réservée aux connectés) : API CRUD `/api/configurations` (GET/POST/DELETE) protégée par session + scoping strict `userId`, page `/account/configurations`, sauvegarde serveur depuis le configurateur, lien « Mon journal » dans le menu compte, i18n FR/EN | #2.2 / #3.1 | #41 | `2c3161f` | **2.8.0** |
| 12 | **Honnêteté offre — quota gratuit appliqué** : `src/lib/premium.ts` (`isPremiumActive` + `maxConfigsFor`), **limite 3 configs/gratuit, illimité premium** (vérifiée en base : 4ᵉ → HTTP 403), jauge quota + CTA Premium sur `/account/configurations`, message dédié dans le configurateur, suppression du composant mort `premium-features.tsx` (fake features `$9.99`) | Option A | #42 | `8cae3c0` | **2.8.1** |
| 13 | **Export PDF Premium** : `src/lib/pdf-export.ts` (jsPDF chargé via CDN, 0 ajout au bundle, génération 100 % navigateur), bouton « 📄 Export PDF » par configuration sur `/account/configurations` — **réservé aux premium** (gratuit → 🔒 redirige `/pricing`). Fiche PDF de marque (en-tête vert, tableau raquette/cordages/tensions/RCS/compat, notes, pied de page). Rendu vérifié visuellement. | Option A / #3.2 | _en cours_ | _en cours_ | **2.9.0** |

### Détails utiles sur l'acquis récent

- **GA4** (`src/app/layout.tsx`, `src/components/analytics/analytics.tsx`)
  - `NEXT_PUBLIC_GA_ID` (fallback `G-YSSLHJ5WYD`), `anonymize_ip: true`.
  - Helpers : `trackConfiguratorComplete`, `trackPremiumCtaClick`, `trackAffiliateClick`.
- **Open Graph** (`src/app/layout.tsx`)
  - `resolveSiteUrl()` ignore toute valeur `localhost`/`127.0.0.1` → domaine canonique.
  - ✅ `NEXT_PUBLIC_APP_URL=https://tennisstringadvisor.org` est défini sur Netlify.
- **Affiliation** (`src/lib/affiliate.ts`, `src/components/product/buy-button.tsx`)
  - Marchand : **Tennis-Point FR** (Awin, jusqu'à 9 %, cookie 30 j).
  - Mode actuel : **liens directs non trackés** (en attente des IDs Awin).
  - Bascule **automatique** en deep-links Awin trackés dès que les 2 variables sont définies.
  - Architecture **multi-marchands** (ajout futur = 1 entrée dans `MERCHANTS`).

- **Authentification** (`src/lib/auth.ts`, `src/app/auth/*`, `src/app/api/auth/*`) — **3 modes actifs en prod** :
  1. 🔵 **Google OAuth** — fonctionnel de bout en bout (testé).
  2. ✉️ **Magic link e-mail** (Resend) — fonctionnel **mais limité** : tant que le domaine
     `tennisstringadvisor.org` n'est pas vérifié dans Resend, `EMAIL_FROM=onboarding@resend.dev`
     n'envoie qu'à l'adresse du compte Resend (`pleneuftrading@gmail.com`).
  3. 🔑 **E-mail / mot de passe** (`CredentialsProvider` + bcrypt) — fonctionnel pour tous (testé : inscription OK).
  - **Session : stratégie `jwt`** (et non plus `database`) — imposée par `CredentialsProvider`.
    Le callback `jwt()` recharge `isPremium`/`premiumUntil` depuis la DB à chaque rafraîchissement.
    ⚠️ **Conséquence** : un changement de premium en base n'est visible qu'après **reconnexion**.
  - **Premium** : piloté **uniquement** par `User.isPremium` / `User.premiumUntil`.
    **Il n'existe PAS de notion de compte admin/master** dans le code. Pour passer un compte
    premium aujourd'hui : modifier `isPremium=true` en base (Supabase) puis se reconnecter.
  - **⚠️ FINDINGS CRITIQUES Supabase (à ne pas oublier)** :
    - **Port `5432` (session pooler) FONCTIONNE** ; port `6543` (transaction pooler) **TIMEOUT**
      dans la région `aws-1-eu-west-2`. → `DATABASE_URL` doit utiliser le **5432**.
    - Username **doit** inclure le ref projet : `postgres.yhhdkllbaxuhwrfpsmev`
      (sinon `ENOIDENTIFIER: no tenant identifier provided`).
    - Génération du client Prisma sur Netlify CI via hook `postinstall: prisma generate`
      + `npx prisma generate` dans la commande de build (`netlify.toml`).

---

## ⏳ À FAIRE — Reprise

### 🔜 Action utilisateur (hors code) — pour ACTIVER la monétisation
1. S'inscrire sur **Awin** (éditeur / publisher).
2. Rejoindre le programme **Tennis-Point FR** (validation par l'annonceur).
3. Renseigner dans **Netlify → Environment variables**, puis *Redeploy* :
   - `NEXT_PUBLIC_AWIN_ID` = Publisher ID
   - `NEXT_PUBLIC_AWIN_TENNISPOINT_MID` = Advertiser ID Tennis-Point
4. Marquer **`affiliate_click`** comme *key event* dans l'admin GA4.

> ⚠️ Tant que ces IDs ne sont pas posés, les boutons « Voir le prix » restent en lien direct (fonctionnels, mais sans commission).

### 🔐 Reliquat AUTH (suite directe de la session du 2026-06-18)

| Priorité | Ticket | Description | État |
|----------|--------|-------------|------|
| Moyenne | **Vérifier le domaine Resend** | Resend → Domains → ajouter `tennisstringadvisor.org` + DNS (SPF/DKIM) chez le registrar, puis passer `EMAIL_FROM=noreply@tennisstringadvisor.org` sur Netlify + redeploy. Ouvre le **magic link à TOUS les visiteurs** (aujourd'hui limité au compte Resend). | À faire |
| Moyenne | **CTA « Premium » conditionnel** | Le bouton « Premium » du header pointe **toujours** vers `/pricing`, même pour un compte déjà premium. À adapter (masquer / rediriger vers un espace compte) une fois le premium réellement exploité. | À faire |
| Moyenne | **Audit du contenu réellement « gated »** | ✅ Diagnostiqué : `isPremium` était purement cosmétique. **Première vraie valeur livrée** = journal de cordage (ticket #11). ✅ **Premier vrai gating premium livré** = quota 3 configs/gratuit vs illimité premium (ticket #12). Reste : autres promesses de `/pricing` à implémenter ou marquer « à venir ». | Partiel |
| ✅ Fait | **Honnêteté de l'offre `/pricing`** (Option A) | ✅ Quota gratuit (3) **réellement appliqué** (ticket #12). ✅ Composant mort `premium-features.tsx` **supprimé**. ✅ **Export PDF Premium livré** (ticket #13). Reste à implémenter ou marquer « à venir » : **Rappels de recordage**, **RCS avancé / reco perso** (encore promis sur `/pricing` mais non implémentés). | Partiel |
| Basse | **Notion d'admin/owner (optionnel)** | Créer un vrai rôle admin (champ `role` ou liste d'e-mails) → premium auto + futur back-office (gestion abonnés, stats). Décision design en attente. | Idée |
| Basse | **Régénérer secrets exposés** | Le `GOOGLE_CLIENT_SECRET` et la clé Resend `re_…` ont transité en clair dans le chat → à régénérer par prudence. | À faire (utilisateur) |

### 🟢 Prochains tickets candidats (à prioriser ensemble)

| Priorité | Ticket | Audit | Description | État |
|----------|--------|-------|-------------|------|
| ⭐ Haute | **Affiliation in-article** | #3.0 / Axe 1-2 | Poser des liens « où acheter » dans les articles de blog à fort trafic (intention d'achat). C'est là que l'affiliation convertit le mieux. | À faire |
| Haute | **Liens internes blog → configurateur** | #1.1 | CTA in-article vers `/configurator` ; corriger les liens internes des articles statiques. | À faire |
| Haute | **Page Statistiques + bannière RGPD** | #1.5 / #0.4 | Empty states de `/statistics` ; bannière de consentement RGPD. | À faire |
| Moyenne | **Sitemap / 301** | #1.2 | Vérifier le sitemap (routes réelles) + redirections `.html`. | À faire |
| Moyenne | **Articles SEO longue traîne** | Axe 1/2 | 2-4 articles intention d'achat (cordage tennis elbow, tension, comparatifs). | À faire |
| Basse | **OG images par article** | #2.1+ | Générer des og:image dédiés par article (au lieu de l'image générique). | Idée |

### 🔵 Chantiers de fond (différés par l'audit)
- **#4.1 / #2.4** — Unifier l'architecture de rendu (tout Next, supprimer le statique parallèle `public/blog/*.html` + `public/en/*.html`).
- **#4.2** — Source unique de l'algo RCS, testée.
- **#2.2 / #3.1 / #3.2** — Rétention : ✅ **journal/historique synchronisé livré** (ticket #11). Reste **rappels** (re-cordage) + réactivation abonnement (paywall payant au-dessus du simple « connecté »).
- **#4.3** — Décider du sort du « moat » (calcul serveur ou retrait de la mention).
- **#3.3** — B2B cordeurs (landing `/pro`) — plus tard.

---

## 🧭 Point de reprise pour demain

- **Branche de travail** : repartir de `main` à jour (`git checkout main && git pull origin main --ff-only`).
- **Dernier état** : `main` = `8cae3c0` (avant Export PDF), `genspark_ai_developer` synchronisée. Version `2.9.0`.
  Acquis premium : journal de cordage (#11), **quota gratuit appliqué** (#12), **export PDF Premium** (#13).
  Prochaines vraies features premium candidates : **rappels de recordage**, **RCS avancé**.
- **Auth** : ✅ **terminée et opérationnelle** (Google + magic link + e-mail/mot de passe).
  Compte owner `pfermanian@gmail.com` passé **premium** manuellement en base (`isPremium=true`, permanent).
- **Journal de cordage (ticket #11)** : ✅ livré — API `/api/configurations` (GET/POST/DELETE, scoping `userId`),
  page `/account/configurations`, sauvegarde serveur depuis le configurateur, lien « Mon journal ».
  Testé en local : API → **401** non authentifié, page → **redirect** vers signin. ✅
- **Reliquat auth immédiat** (non bloquant) : vérifier le domaine Resend pour ouvrir le magic
  link à tous ; adapter le CTA « Premium » ; **honnêteté `/pricing`** (Option A).
- **Décision en attente** : choisir le prochain ticket (candidats : **Option A** honnêteté pricing, **affiliation in-article**, **rappels de re-cordage**).
- **Suivi monétisation** : dès réception des IDs Awin → vérifier ensemble que les deep-links se génèrent et que `affiliate_click` remonte dans GA4 (DebugView).
- **⚠️ Rappel technique critique** : `DATABASE_URL` = **port 5432** + user `postgres.<ref>` (le 6543 timeout dans cette région). `~/.git-credentials` se vide → relancer `setup_github_environment` avant chaque push/`gh`.

---

## 📎 Références projet

- **Prod** : https://tennisstringadvisor.org (Netlify, auto-deploy sur `main`)
- **Repo** : https://github.com/PleneufMC/Tennis-String-Advisor
- **Audit complet** : `Audit-Full.md` (findings #0.x à #4.x)
- **Stack** : Next.js 14 (App Router) · TypeScript strict · Tailwind · Netlify (`@netlify/plugin-nextjs`, `output: standalone`)
- **Variables d'env clés** : `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_AWIN_ID`, `NEXT_PUBLIC_AWIN_TENNISPOINT_MID` (cf. `.env.example`)
