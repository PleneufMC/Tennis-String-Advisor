# R2 — Activation de l'affiliation AWIN : procédure et vérification

> Établi le 31/08/2026 par `tsa-revenue`, intégré par l'orchestrateur.
> Statut : bascule **validée en exécution sur build de production**, en attente
> des identifiants AWIN réels (inscription en cours côté Pierre).

## 1. Ce qui est déjà prouvé

La bascule direct → Awin ne demande **aucune modification de code**. Vérifié en
exécution, quatre scénarios, parcours Babolat Pure Drive + RPM Blast :

| # | Scénario | Résultat observé |
|---|---|---|
| 1 | `next dev`, sans variables | Liens directs `tennis-point.fr/search?q=…`, `affiliate_click{link_type:"direct"}` |
| 2 | `next dev`, avec variables factices | `awin1.com/cread.php?awinmid=888002&awinaffid=999001&ued=…`, `link_type:"awin"` |
| 3 | `npm run build` + `next start`, sans variables | Liens directs, événement capté dans le **vrai** `window.dataLayer` |
| 4 | `npm run build` + `next start`, avec variables | Deep-links Awin identiques au cas 2, `link_type:"awin"` |

Entre 3 et 4, **aucune ligne de code changée** : seules les deux variables
d'environnement diffèrent. C'est le scénario Netlify exact.

Contrôles annexes : URL marchande sous-jacente en HTTP 200 ; deep-link conforme
au format Awin (`awinmid` + `awinaffid` + `ued` URL-encodé) ; alerte bras
(RCS 35) affichée **avant** les liens et jamais masquée — règle 2 du CLAUDE.md
respectée en exécution, pas seulement par lecture du code.

## 2. Activation (à faire une seule fois)

**Préalable** : programme Tennis-Point FR approuvé dans AWIN, et les deux
identifiants relevés via *Liens & outils → Générateur de liens* (le lien généré
par AWIN contient `awinmid=` et `awinaffid=`, aucune valeur devinée).

1. Netlify → Site configuration → Environment variables, **scope Production** :
   - `NEXT_PUBLIC_AWIN_ID` = ID éditeur AWIN
   - `NEXT_PUBLIC_AWIN_TENNISPOINT_MID` = MID Tennis-Point FR
2. Deploys → **Trigger deploy → Clear cache and deploy site**.
   Le *clear cache* élimine tout chunk gardant en cache l'ancienne valeur
   inlinée. Sans redéploiement, l'activation échoue **silencieusement** :
   ces variables `NEXT_PUBLIC_*` sont inlinées dans le bundle au build.

⚠️ **Les deux, ou rien.** `isAffiliateEnabled()` exige l'ID **et** le MID
(`src/lib/affiliate.ts:71`). Une seule variable renseignée laisse 100 % des
liens en direct, sans aucun signal d'erreur.

## 3. Vérification post-déploiement

À dérouler dans les minutes qui suivent, dans l'ordre.

1. Ouvrir `tennisstringadvisor.org/configurator` **en navigation privée**,
   choisir une raquette et un cordage, aller jusqu'au résultat.
2. Clic droit sur « Voir le prix sur Tennis-Point » → copier le lien.
   **Attendu** : `https://www.awin1.com/cread.php?awinmid=<MID>&awinaffid=<ID>&ued=https%3A%2F%2Fwww.tennis-point.fr%2F…`
3. Cliquer : la redirection doit aboutir sur Tennis-Point avec la recherche
   préremplie.
4. GA4 → Temps réel : `affiliate_click` doit arriver avec `link_type="awin"`.
5. Dashboard AWIN → rapport clics : le clic de test doit apparaître (délai de
   quelques minutes à quelques heures).
6. Contrôler aussi une fiche produit (ex. `/tennis-strings/luxilon-alu-power`) :
   même bascule attendue.

### Si le lien est encore en direct

À examiner dans cet ordre, du plus fréquent au plus rare :

1. Build non relancé après la saisie des variables (cause n° 1).
2. Nom de variable inexact — le préfixe `NEXT_PUBLIC_` en fait partie.
3. Valeur vide ou espace résiduel.
4. Scope Netlify autre que Production.
5. Une seule des deux variables renseignée (cf. §2).

Un `link_type` qui reste `"direct"` dans GA4 est **la** preuve côté mesure que
le build n'a pas été relancé.

Une erreur affichée par AWIN à l'étape 3 (et non un lien direct) pointe vers un
MID/ID invalide, ou un programme Tennis-Point pas encore approuvé.

## 4. Ce qui reste non vérifié

- Le bout-en-bout avec de **vrais** identifiants : les étapes 3 à 5 ne peuvent
  être déroulées qu'en production, après approbation du programme.
- L'ingestion effective des événements côté serveur Google : vérifié jusqu'au
  `dataLayer` inclus, pas au-delà.
- Tant que ces deux points ne sont pas faits, **l'affiliation n'est pas
  « activée »** au sens du §8 du CLAUDE.md — le jalon est le premier
  `affiliate_click` en `link_type: awin` observé en production.

## 5. Amélioration identifiée, volontairement différée

`buildProductLink` envoie vers une **recherche** marchande
(`/search?q=Babolat+RPM+Blast`) et non vers une fiche produit. Le cookie
d'affiliation est bien posé, mais le visiteur atterrit sur une liste de
résultats à l'instant où son intention est la plus forte.

À traiter **après** activation et premières mesures, pas avant : sans volume, on
ne saurait pas si le changement produit quoi que ce soit (règle 9).
