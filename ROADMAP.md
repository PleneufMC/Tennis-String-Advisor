# 🗺️ Roadmap & Suivi — Tennis String Advisor

> Document de pilotage. Stratégie issue de l'audit (`Audit-Full.md`) :
> **réparer → mesurer → monétiser**, une amélioration mesurée à la fois.
>
> **Dernière mise à jour** : 2026-06-17 · **Version courante** : `2.4.0`

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
- **#2.2 / #3.1 / #3.2** — *(Différé)* Rétention (journal, rappels, historique) → puis réactivation abonnement (auth + persistance + paywall).
- **#4.3** — Décider du sort du « moat » (calcul serveur ou retrait de la mention).
- **#3.3** — B2B cordeurs (landing `/pro`) — plus tard.

---

## 🧭 Point de reprise pour demain

- **Branche de travail** : repartir de `main` à jour (`git checkout main && git pull origin main --ff-only`).
- **Dernier état** : `main` = `3d1854d`, `genspark_ai_developer` synchronisée, version `2.4.0`.
- **Décision en attente** : choisir le prochain ticket (recommandation : **affiliation in-article**, fort levier de revenu).
- **Suivi monétisation** : dès réception des IDs Awin → vérifier ensemble que les deep-links se génèrent et que `affiliate_click` remonte dans GA4 (DebugView).

---

## 📎 Références projet

- **Prod** : https://tennisstringadvisor.org (Netlify, auto-deploy sur `main`)
- **Repo** : https://github.com/PleneufMC/Tennis-String-Advisor
- **Audit complet** : `Audit-Full.md` (findings #0.x à #4.x)
- **Stack** : Next.js 14 (App Router) · TypeScript strict · Tailwind · Netlify (`@netlify/plugin-nextjs`, `output: standalone`)
- **Variables d'env clés** : `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_AWIN_ID`, `NEXT_PUBLIC_AWIN_TENNISPOINT_MID` (cf. `.env.example`)
