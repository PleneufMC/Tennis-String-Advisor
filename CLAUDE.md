# CLAUDE.md — Tennis String Advisor

> **Version** : 2.1.3
> **Date** : 31 août 2026
> **Remplace** : Custom Instructions v1.0 (janvier 2025)
> **Destination** : racine du dépôt (`/CLAUDE.md`)
> **Branche de référence** : `genspark_ai_developer`
> **Repo** : https://github.com/PleneufMC/Tennis-String-Advisor.git

**Changelog v2.1.2 → v2.1.3** — Actualisation du §2 au 31/08/2026 (chantier
A3 de `tsa-measure`), sur constat code, commandes et sorties dans la PR :
point 3 passé en résolu (`BuyButton` est dans le résultat du configurateur depuis
`15c6649` du 13/08 — non monétisé tant que le point 2 tient), point 5 réécrit
(échelle RCS unifiée FR/EN le 14/08 par `b227ba7`, miroir contrôlé par
`audit:ratings`), ajout du bloc « Actualisation vérifiée au
31 août 2026 » (comptages blog réels 14 FR + 8 EN hors index, Stripe et AWIN
revérifiés cassés, indice d'indexation daté, instrument A3 + garde-fou
`audit:blog-funnel`). Régularisation au passage : la v2.1.2 (14/08, bloc
« rupture de série » du §2) n'avait ni entrée de changelog ni pied de page à
jour.

**Changelog v2.1.0 → v2.1.1** — Corrections factuelles issues de l'audit
multi-agents du 13 août 2026 (4 rapports : revenue, acquisition, core, mesure),
conformément au §6 (« un agent qui découvre que le §2 est faux corrige le §2 »).
Réécriture du point 4 du §2 (il n'existe aucun mur d'authentification — le vrai
défaut est l'incitation inversée du quota), complément du point 1 (circuit de
paiement EN parallèle), nuance du point 2 (l'activation AWIN exige un
redéploiement), correction du point 7 (les scripts `audit:*` étaient
majoritairement cassés), retrait de Zustand de la pile (§1, zéro import), et
correction du §5 bis : les pondérations RCS « introuvables » existent bel et
bien dans `public/js/rcs-calculator*.js` — c'est le moteur des pages EN.

**Changelog v2.0.0 → v2.1.0** — Ajout du §5 bis « Articulation avec les agents
globaux ». La v2.0.0 a été rédigée hors session Claude Code, sans le contexte
des agents utilisateur préexistants (`~/.claude/agents/`) qui couvraient déjà
TSA : db-guardian, deploy-captain, security-auditor, qa-sentinel,
algorithm-validator, catalog-curator, feature-builder, seo-content-strategist.
Le §5 bis fixe qui fait quoi. Comptages 129 raquettes / 190 cordages vérifiés
dans `src/data/` le 9 août 2026.

**Changelog v1.0 → v2.0.0** — Refonte complète. Passage d'un persona unique
« Product Owner & Growth Manager » à une **équipe de 4 agents Claude Code** avec
périmètres de fichiers disjoints. Objectifs chiffrés recalibrés sur la mesure
réelle (les cibles v1.0 étaient hors d'atteinte d'un facteur ~150). Ajout de la
carte de propriété des fichiers, des garde-fous issus de la session du 8 août
2026, et des critères de fin mesurables par chantier.

---

## 1. Le produit en une page

**Tennis String Advisor** (tennisstringadvisor.org) aide un joueur de tennis à
choisir son cordage et sa tension en fonction de sa raquette, de son jeu et de
sa **sensibilité au bras**. Le cœur métier est le **RCS** (Recommandation
Confort Score) : un indice de fermeté du setup qui signale un risque de tennis
elbow.

| RCS | Niveau | Lecture |
|---|---|---|
| < 20 | Très confortable | Bras sensibles, débutants |
| 20-25 | Confortable | Joueurs récréatifs |
| 25-30 | Standard | Joueurs avancés |
| 30-35 | Ferme | Contrôle maximal |
| > 35 | Très ferme | Risque tennis elbow |

**Stack** : Next.js 14 (App Router), TypeScript strict, Tailwind,
Prisma + Supabase (PostgreSQL), NextAuth (Google OAuth + email), Stripe Payment
Links, déploiement Netlify (adaptateur OpenNext). (Zustand est déclaré dans
`package.json` mais n'a aucun import dans `src/` — retiré de la pile ici.)

**Architecture** : hybride assumé. L'application Next sert le FR à la racine
(`/configurator`, `/racquets`…). Le blog et la version anglaise sont des pages
**HTML statiques** dans `public/blog/*.html` et `public/en/*.html`. Le
`route-map.ts` fait le pont entre les deux univers.

**Base** : 129 raquettes, 190 cordages (`src/data/*.ts`).

**Écosystème** : tennismatchfinder.net (même propriétaire) référence TSA.
⚠️ **Corrigé le 31/08/2026** — ce site était présenté ici comme « un canal de
trafic croisé sous-exploité ». Pierre a établi que **TMF ne trouve pas son
public** : l'audience supposée n'existe pas. Un lien depuis un site sans
visiteurs n'apporte pas de visiteurs. La prémisse n'avait jamais été mesurée.

---

## 2. État vérifié au 13 août 2026, actualisé le 31 août 2026

Ce qui suit a été **lu dans le code**, pas dans la documentation. Toute
divergence entre ce fichier et le code : le code gagne, et ce fichier doit être
corrigé dans la même PR.

### Corrigé et vérifié

- Sitemap natif Next (`src/app/sitemap.ts`) — plus d'URL fantômes.
- Open Graph : `resolveSiteUrl()` rejette localhost, fallback canonique.
- Instrumentation GA4 : 3 événements branchés et appelés
  (`configurator_complete`, `affiliate_click`, `premium_cta_click`).
- Paywall freemium appliqué côté serveur : `src/lib/premium.ts` est la source de
  vérité unique, `POST /api/configurations` renvoie 403 au-delà de 3 configs.
- Échelle d'alerte bras remise en monotonie (43,9 % → 13,9 % d'alertes).
- Export PDF, thème sombre, i18n FR/EN livrés.

### Cassé ou incomplet

| # | Problème | Impact |
|---|---|---|
| 1 | **Aucun webhook Stripe.** Le Payment Link FR ne transporte pas `client_reference_id`, rien n'écrit `isPremium`. Et un **second circuit de paiement EN** existe en parallèle (`public/en/premium.html` : Supabase Auth direct, 3 Payment Links en $, tarifs divergents, offre « Lifetime » sans équivalent code) — 5 Payment Links, 2 systèmes d'identité, 0 consommateur serveur. | Un client qui paie reste plafonné à 3 configs. La page `payment-success` a été désamorcée (13/08) : elle annonce désormais une activation manuelle sous 24 h au lieu de mentir. |
| 2 | **Affiliation câblée mais inactive.** `NEXT_PUBLIC_AWIN_ID` et `NEXT_PUBLIC_AWIN_TENNISPOINT_MID` vides → liens directs non rémunérés. ⚠️ Ces variables `NEXT_PUBLIC_*` sont inlinées au build : les renseigner dans Netlify **exige un redéploiement** (les commentaires « sans redéploiement » dans `affiliate.ts` et `.env.example` sont faux). | 0 € sur 100 % des clics. |
| 3 | **Résolu depuis le 13/08** (`15c6649`), constaté dans le code le 31/08 : import `BuyButton` ligne 16 de `configurator/page.tsx`, trois instances (cordage principal, travers, raquette) sous « Acheter ce setup — liens partenaires », placées après le bloc RCS conformément à la règle 1. Vérifié **en exécution** le 31/08 par `tsa-revenue` (Playwright, stub gtag) : liens `rel="sponsored"` vers tennis-point.fr en HTTP 200, alertes bras `role="alert"` affichées AVANT les liens (règle 2), séquence `configurator_step` → `arm_warning_shown` → `configurator_result_view` → `configurator_complete` → `affiliate_click` complète, bascule Awin vérifiée en dev ET sur build de production (`npm run build` exit 0 dans les deux cas ; sans variables : lien tennis-point.fr direct, `link_type: direct` ; avec `NEXT_PUBLIC_AWIN_ID`/`_TENNISPOINT_MID` factices : lien `awin1.com/cread.php?awinmid=…&awinaffid=…&ued=…`, `link_type: awin` — zéro changement de code entre les deux builds). L'entrée du 13/08 était périmée le jour même de sa rédaction. | Le moment de plus forte intention est équipé. Ces clics restent non rémunérés tant que le point 2 (AWIN) tient — c'est le point 2, pas celui-ci. Verrou `configurator/page.tsx` rendu par `tsa-revenue` le 31/08 (surface d'émission `location` propagée sur les 6 appelants, merge `c93ef38`). Procédure d'activation et de vérification : `reports/r2-activation-awin.md`. |
| 4 | **Incitation inversée du quota** (reformulé 13/08 — il n'existe **aucun mur d'authentification** : pas de middleware, configurateur 100 % public). L'anonyme sauvegarde en illimité dans `localStorage` ; se connecter impose le quota de 3 (`premium.ts` appliqué seulement dans `POST /api/configurations`). Créer un compte retire une capacité. Les chiffres (160 vues signin vs 45 configurateur, 39 `form_start` → 1 `form_submit`) décrivent un problème de navigation/attractivité, pas un blocage technique. | L'entonnoir compte → premium est à l'envers. Arbitrage A5 en attente. |
| 5 | **Largement résorbé le 14/08** (`b227ba7`, vérifié dans le code le 31/08) : `calculateRCS` (`strings-database.ts`, gain 2 / offset −27) est l'unique source de vérité ; `rcsIndex` y **délègue** (plus une copie) ; `public/js/rcs-calculator*.js` en est un **miroir exact**, comparé valeur par valeur à chaque `audit:ratings` (le script charge les moteurs JS). Reste : le miroir est une duplication par convention (toute évolution se fait dans `strings-database.ts` PUIS dans les 2 JS), et `calculateCompatibility` (`racquets-database.ts`) demeure une échelle homonyme distincte, documentée dans `racquet-scoring.ts`. | Un même montage affiche le même RCS FR/EN. La dette restante (miroir manuel, homonyme) est contrôlée par script, plus silencieuse. |
| 6 | **Divergence non résolue et creusée** : le site FR lit les fichiers TypeScript, les 6 pages EN lisent Supabase. Catalogues raquettes quasi disjoints (12 ids communs sur 129 TS / 107 base), 98 conflits de valeurs cordages dont 16 changent le RCS. | Chaque correction d'un côté recrée l'écart de l'autre. Arbitrage A1 en attente. |
| 7 | **0 fichier de test** dans le dépôt (`vitest` et `playwright` installés, aucune spec). Ni husky actif, ni CI, ni suivi d'erreurs en production. Les garde-fous réels sont les scripts `qa-*` — `audit:all` a été recâblé le 13/08 (4 maillons pointaient vers des fichiers inexistants et la chaîne mourait avant les scripts fonctionnels). | La garantie repose sur l'exécution manuelle de `audit:all` avant PR. |
> ⚠️ **RUPTURE DE SÉRIE — 14/08/2026.** `configurator_complete` était émis à
> chaque recalcul, sa signature de déduplication incluant les tensions : cinq
> essais de tension sur une même raquette comptaient pour cinq « complétions ».
> Il est désormais scindé en `configurator_result_view` (l'exploration) et
> `configurator_complete` (l'aboutissement, signature sans les tensions).
> **Le compteur va baisser par construction — ce n'est pas une régression.**
> Toute comparaison avec les chiffres antérieurs au 14/08 est invalide, y
> compris ceux de la ligne « La mesure » ci-dessous. Deux événements ajoutés
> au passage : `configurator_step` côté FR (il n'existait que côté EN, donc le
> taux de complétion rapportait deux univers à un seul) et `arm_warning_shown`,
> sans lequel le respect de la règle 2 n'est vérifiable que par lecture du code.

| 8 | **Aucun événement clé marqué dans GA4.** Le code émet, l'admin GA4 n'enregistre pas (« Taux d'événements clés » = 0 sur tous les pays). ⚠️ Préalable découvert le 13/08 : deux implémentations analytics (React vs `public/js/analytics.js`) émettent les mêmes noms d'événements avec des paramètres incompatibles, et `configurator_complete` se répète à chaque changement de tension (compte les essais, pas les complétions). Unifier le schéma avant de marquer. | Aucune conversion mesurable ; les taux du §2 (53 %) et l'objectif §8 ne sont pas interprétables en l'état. |

### La mesure (1er janv. → 9 août 2026, 221 jours)

```
227 utilisateurs actifs          0 événement clé          0 € de revenu
first_visit          207
configurator_step     68   (33 % des nouveaux)
configurator_complete 36   (53 % de complétion une fois démarré)
premium_cta_click     11   (31 % des configs terminées)
affiliate_click        4   (11 % des configs terminées)
achat                  0
form_start → submit  39 → 1   (2,6 %)
```

Après retrait du trafic datacenter (CN 25 à 3,8 % d'engagement ; US concentré
sur Ashburn/Boydton/Council Bluffs) et du trafic interne (Monaco 18),
**l'audience humaine externe est d'environ 20 personnes par mois.**

**Lecture** : le produit convertit très bien — il n'a personne à convertir.
Le goulot est la distribution, pas la mécanique de monétisation.

### Actualisation vérifiée au 31 août 2026

Constats lus dans le code et exécutés en commande le 31/08 (sorties collées
dans la PR `agent/tsa-measure/a3-blog-vers-configurateur`) :

- **Blog** : `public/blog/` contient **14 articles + un index** (15 fichiers
  `.html`) ; `public/en/blog/` existe depuis le 14/08 et contient
  **8 articles + un index** (9 fichiers). Deux articles publiés les 27-28/08
  en FR et EN (« raquette : point fort ou point faible », « cordage &
  chaleur »). Toute mention antérieure de « 12 articles FR / 2 articles EN »
  est périmée — il en reste une dans `.claude/agents/tsa-acquisition.md`.
- **Toujours cassé, revérifié le 31/08** : `src/app/api/stripe/` absent
  (aucun webhook — point 1 inchangé) ; `NEXT_PUBLIC_AWIN_ID` et
  `NEXT_PUBLIC_AWIN_TENNISPOINT_MID` vides (point 2 inchangé).
- **Indexation** : le diagnostic implicite « site invisible en recherche » est
  contredit par un **indice daté** — le 31/08, la requête Google
  « configurateur cordage tennis tension raquette calculateur » fait
  ressortir `/blog/guide-tension-cordage-tennis.html` en page 1, aux côtés de
  Décathlon, Mouratoglou et Extreme Tennis. Niveau de preuve : une requête
  unique, personnalisable et non reproductible — un indice, **pas une mesure
  d'indexation**. L'établir proprement exige Search Console (couverture
  d'index + rapport Requêtes). La ligne « Articles indexés ~0 » du §8 est
  donc probablement pessimiste, sans qu'on sache de combien.
- **Entonnoir blog → configurateur (A3)** : l'indicateur est défini et outillé
  — définition, procédure GA4 et relevé hebdomadaire dans
  `reports/a3-blog-vers-configurateur.md`, instrument gardé par
  `npm run audit:blog-funnel` (intégré à `audit:all`). La mesure s'appuie sur
  le `page_referrer` GA4 natif : zéro code dans les périmètres d'autrui.
  Lacune détectée au passage : l'article EN
  `next-gen-tennis-racquets-fonseca-mensik-cobolli-jodar.html` n'a **aucun**
  lien vers le configurateur (à traiter par `tsa-acquisition`).

---

## 3. Ordre de priorité (arbitré, 90 jours)

1. **Affiliation dans le configurateur** — monétiser les 53 % qui terminent.
2. **SEO / contenu** — le blog est le seul canal qui apporte du trafic.
3. **Distribution externe** — forums, clubs et cordeurs. (TennisMatchFinder
   retiré de cette liste le 31/08/2026 : il n'a pas d'audience, cf. §1. Le
   seul lien croisé existant va d'ailleurs dans le mauvais sens — TSA envoie
   ses visiteurs vers TMF depuis son footer, et ne reçoit rien en retour.)
4. **Webhook Stripe** — débloquer le paiement (ou le retirer proprement).

Un agent ne remonte pas la file d'attente de son propre chef. S'il pense que
l'ordre est faux, il le dit dans son rapport et attend l'arbitrage.

---

## 4. Les neuf règles non négociables

Elles s'appliquent à tous les agents, sans exception, y compris quand elles
coûtent un indicateur.

1. **Le RCS n'est jamais influencé par une commission.** Les liens partenaires
   apparaissent *après* la recommandation. Ils n'entrent ni dans le calcul, ni
   dans l'ordre de tri, ni dans la sélection des cordages proposés.
2. **La santé prime sur la conversion.** Une alerte bras ne se supprime, ne se
   masque et ne s'adoucit jamais pour améliorer un taux.
3. **Jamais une valeur comblée présentée comme une donnée constructeur.** Un
   champ absent reste `null`. Une valeur dérivée est étiquetée comme dérivée.
4. **Jamais deviner une URL** pour obtenir une « source ».
5. **Mesurer l'indicateur qui compte**, pas un indicateur voisin plus commode.
6. **Un succès non reproductible n'est pas un succès.** Le dire coûte moins cher
   que de le laisser croire.
7. **Suspecter l'instrument avant les données** quand un résultat est absurde.
8. **Aucune affirmation « c'est corrigé » sans commande exécutée et sortie
   collée** dans le rapport. Pas de sortie, pas de correction.
9. **Ne pas optimiser un taux avant d'avoir du volume.** À 20 visiteurs par
   mois, un A/B test n'a aucune puissance statistique. Tout chantier
   d'optimisation fine attend 200 utilisateurs mensuels.

---

## 5. L'équipe et la carte de propriété des fichiers

Quatre agents, périmètres **disjoints**. Deux agents ne modifient jamais le même
fichier dans la même semaine.

| Agent | Mission | Priorités couvertes |
|---|---|---|
| `tsa-revenue` | Monétisation et parcours de conversion | 1 et 4 |
| `tsa-acquisition` | SEO, contenu, distribution externe | 2 et 3 |
| `tsa-core` | Algorithme RCS et intégrité des données | transverse |
| `tsa-measure` | Mesure, instrumentation, contrôle des affirmations | transverse, bloquant |

### Propriété

| Chemin | Propriétaire |
|---|---|
| `src/lib/affiliate.ts`, `src/lib/premium.ts` | `tsa-revenue` |
| `src/components/product/buy-button.tsx` | `tsa-revenue` |
| `src/app/pricing/`, `src/app/payment-*/`, `src/app/api/checkout*`, `src/app/api/stripe/` | `tsa-revenue` |
| `src/app/auth/`, `src/app/api/auth/`, `src/lib/auth*` | `tsa-revenue` |
| `public/blog/`, `public/en/` | `tsa-acquisition` |
| `src/app/sitemap.ts`, `src/app/robots.ts`, `public/robots.txt` | `tsa-acquisition` |
| blocs `export const metadata` et JSON-LD dans les `page.tsx` | `tsa-acquisition` |
| `src/data/`, `src/lib/advanced-rcs.ts`, `src/lib/racquet-scoring.ts` | `tsa-core` |
| `scripts/scraper/`, `scripts/qa-ratings.mts` | `tsa-core` |
| `src/components/analytics/` | `tsa-measure` |
| `scripts/qa-*` (hors `qa-ratings`), `reports/` | `tsa-measure` |

### Fichiers partagés (verrou explicite)

`src/app/configurator/page.tsx`, `src/app/layout.tsx`,
`src/components/layout/header.tsx`, `src/app/page.tsx`.

Un seul agent à la fois. L'agent qui prend le verrou l'annonce dans le titre de
sa PR : `[verrou: configurator/page.tsx]`. Il le rend en fermant la PR.

---

## 5 bis. Articulation avec les agents globaux

Le compte utilisateur héberge des agents transverses (`~/.claude/agents/`)
antérieurs à cette équipe et qui mentionnent TSA. **Dans ce dépôt, l'équipe
`tsa-*` fait foi** — les connaissances TSA des agents globaux datent d'un état
antérieur du code (ils citent 104 raquettes / 165 cordages ; le réel vérifié
est 129 / 190, formule TypeScript dans `advanced-rcs.ts` et
`strings-database.ts`). Correction 13/08 : les pondérations RCS
W_RA=0.28 / W_Cordage=0.42 / W_Tension=0.22 / W_Interaction=0.08 citées par
`algorithm-validator` ne sont PAS introuvables — elles vivent dans
`public/js/rcs-calculator*.js:10`, le moteur statique qui sert les 3 pages EN
(`configurator.html`, `setups.html`, `rcs-calculator.html`). C'est une des 4
implémentations RCS du dépôt (cf. §2 point 5). Répartition :

| Agent global | Statut sur TSA |
|---|---|
| `catalog-curator`, `algorithm-validator` | **Ne plus invoquer sur TSA.** Mandat absorbé par `tsa-core` ; leurs règles de fond (source URL vérifiable, champ sans source = `null`, jamais de coefficient inventé) sont reprises aux règles 3 et 4 du §4. |
| `feature-builder` | **Ne plus invoquer sur TSA.** Reste l'agent de TennisMatchFinder. Sur TSA, chaque chantier a son propriétaire au §5. |
| `seo-content-strategist` | Consultable par `tsa-acquisition` pour les clusters de mots-clés et briefs éditoriaux. La propriété des fichiers (`public/blog/`, métadonnées) reste à `tsa-acquisition`. |
| `db-guardian` | **Gate conservé.** Toute modification de schéma (Prisma/Supabase) ou de policy RLS passe par lui — concerne le chantier C3 de `tsa-core` (source de vérité TS vs Supabase) et l'option B du chantier R5 de `tsa-revenue` (webhook Stripe écrivant `isPremium`). |
| `deploy-captain` | **Gate conservé.** Toute action irréversible ou de production — variables d'environnement Netlify (chantier R2, étape 4), migration prod, rollback — exige son passage et un « GO » explicite de Pierre. |
| `security-auditor` | **Gate conservé.** Review obligatoire avant merge pour : webhook Stripe (vérification de signature), tout changement d'auth (chantier R4), toute route API nouvelle. Findings sourcés (CWE/OWASP), veto possible. |
| `qa-sentinel` | **En sommeil sur TSA.** Son gate suppose une suite de tests ; ce dépôt n'en a pas (§2, point 7). Le mécanisme de garantie en vigueur ici est les scripts `npm run audit:*` plus le rôle bloquant de `tsa-measure` (§7). Si une suite vitest/playwright est introduite un jour, `qa-sentinel` reprend son rôle de gate. |

Deux principes en résument l'esprit : les agents globaux **métier** sont
remplacés par l'équipe projet ; les agents globaux **de contrôle** (schéma,
prod, sécurité) gardent leur monopole. En cas de conflit entre ce fichier et la
description d'un agent global au sujet de TSA, ce fichier gagne.

---

## 6. Conventions de travail

- **Branche** : `agent/<nom-agent>/<slug-chantier>`, partant de
  `genspark_ai_developer`.
- **Commits** : conventional commits en français —
  `fix(affiliate): ajouter le lien d'achat au résultat du configurateur`.
- **PR** : une par chantier, diff ≤ 400 lignes. Au-delà, découper.
- **Avant toute PR**, exécuter et coller la sortie :
  ```bash
  npm run type-check          # doit sortir en 0
  npm run build               # doit compiler toutes les pages
  npm run audit:ratings       # si src/data ou une formule est touchée
  npm run audit:rls           # si Supabase ou une route API est touchée
  npm run audit:contrast      # si un composant visuel est touché
  ```
- **Pas de suite de tests dans le dépôt.** Tout agent qui modifie une fonction de
  calcul ou une règle métier **ajoute un contrôle** dans le script `qa-*`
  correspondant. C'est le mécanisme de garantie existant : on ne l'enjambe pas.
- **Scrapers** : ils n'écrivent que dans `scripts/scraper/out/` (non versionné).
  Aucune valeur n'entre dans `src/data/` sans revue explicite.
- **Ce fichier fait foi.** Un agent qui découvre que le §2 est faux corrige le §2
  dans sa PR et incrémente la version de `CLAUDE.md` (PATCH).

---

## 7. Definition of Done universelle

Un chantier n'est terminé que si les cinq points sont vrais :

1. Le code compile et `type-check` sort en 0, sorties collées.
2. Le comportement est vérifié **en exécution**, pas par lecture du code.
3. L'indicateur de succès du chantier est **mesurable** et son point de départ
   est enregistré (sinon `tsa-measure` bloque).
4. Ce qui n'a pas pu être vérifié est écrit noir sur blanc dans le rapport.
5. `CLAUDE.md` est à jour si l'état du §2 a changé.

---

## 8. Objectifs chiffrés recalibrés

Les cibles de la v1.0 (5 000 visiteurs/mois à M+3, MRR 500 €) supposaient un
trafic 150 fois supérieur au réel. Elles sont remplacées par des seuils
atteignables en 30 et 90 jours.

| Indicateur | Réel (moy. mensuelle) | M+1 | M+3 |
|---|---|---|---|
| Utilisateurs humains externes / mois | ~20 | 60 | 200 |
| `configurator_complete` / mois | ~5 | 25 | 80 |
| `affiliate_click` / `configurator_complete` | 11 % | 35 % | 45 % |
| Événements clés marqués dans GA4 | 0 | 3 | 3 |
| Trafic interne et bots filtrés | non | oui | oui |
| Articles indexés et visibles en recherche | ~0 | 8 | 20 |
| Première commission d'affiliation encaissée | non | — | oui (jalon binaire) |

Le premier euro d'affiliation est un **jalon binaire**, pas un montant : à
~9 % de commission sur un panier cordage d'environ 25 €, la question n'est pas
combien mais si la chaîne complète fonctionne bout en bout.

### Critères d'arrêt (à M+3)

Si **simultanément** : `affiliate_click / configurator_complete` < 20 %, **et**
zéro vente affiliée, **et** trafic organique < 100 utilisateurs/mois —
alors l'hypothèse « outil grand public monétisé par affiliation » est invalidée.
Bascule vers le segment B2B cordeurs, ou arrêt. Décision de Pierre, pas d'un
agent.

---

## 9. Mode d'emploi

```bash
# Depuis la racine du dépôt
mkdir -p .claude/agents
mv CLAUDE.md .                       # socle commun, chargé automatiquement
mv tsa-*.md .claude/agents/          # les 4 définitions d'agents
```

Redémarrer la session Claude Code pour que le dossier `.claude/agents/` soit
détecté (le surveillant de fichiers ne couvre que les dossiers existant au
démarrage).

Invocation explicite : *« Utilise l'agent tsa-revenue pour ajouter le lien
d'achat au résultat du configurateur. »*

Chaque agent hérite de ce fichier mais **pas** de la conversation principale :
tout ce dont il a besoin (chemins, messages d'erreur, décisions déjà prises)
doit figurer dans la consigne qu'on lui passe.

Le champ `model` de chaque agent est réglé sur `inherit`. Pour épingler un
modèle par agent, éditer la frontmatter du fichier concerné.

---

*CLAUDE.md v2.1.3 — Tennis String Advisor — « Mesurer avant d'affirmer. »*
