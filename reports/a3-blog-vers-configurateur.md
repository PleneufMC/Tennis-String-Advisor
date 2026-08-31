# A3 — Taux blog → configurateur

> Propriétaire : `tsa-measure` · Créé le 31/08/2026
> Instrument gardé par `npm run audit:blog-funnel` (intégré à `audit:all`)

## 1. L'indicateur, exactement

**A3 = arrivées sur le configurateur en provenance directe d'une page
d'article, divisées par les vues de pages d'articles, par semaine (lun-dim).**

- **Numérateur** : événements `page_view` dont `page_location` est le
  configurateur (FR : `/configurator` ; EN : `/en/configurator.html`) et dont
  `page_referrer` est une page d'article (`/blog/…​.html` ou
  `/en/blog/…​.html`, **hors** `/blog/`, `/blog/index.html` et leurs
  équivalents EN — l'index est un hub, pas un article).
- **Dénominateur** : événements `page_view` dont `page_location` est une page
  d'article (même définition, index exclus).

Trois indicateurs voisins ont été écartés, et il faut savoir lesquels
(règle 5) :

| Voisin plus commode | Pourquoi ce n'est pas A3 |
|---|---|
| Clic sortant depuis un article | Compterait les clics dont la page cible ne charge jamais ; exigerait du code dans `public/blog/` (périmètre `tsa-acquisition`). |
| Session « blog » qui touche le configurateur | Dépend du modèle d'attribution de session GA4 ; un lecteur passé par la home entre les deux serait compté. A3 exige la provenance **directe**. |
| Configuration terminée par un lecteur d'article | C'est l'étage suivant de l'entonnoir (A3 × taux de complétion). Mesurable plus tard par exploration par session ; ne pas confondre les deux. |

### Ce que la mesure ne capte pas — assumé

- Le lecteur qui ouvre le configurateur **plus tard** (nouvel onglet tapé à la
  main, retour le lendemain) : referrer différent, non compté. A3 sous-estime
  l'influence totale du blog ; il mesure le **passage direct**, qui est bien la
  question posée (« quel article travaille ? »).
- Le lecteur qui passe par la home ou le header entre l'article et le
  configurateur : compté comme provenance home, pas blog.
- Les navigateurs qui suppriment le referrer par réglage privé (marginal en
  same-origin, la politique par défaut `strict-origin-when-cross-origin`
  transmet l'URL complète en same-origin).
- Le **numérateur et le dénominateur couvrent les deux univers** (app Next FR
  et statique EN), tous deux sur la propriété `G-YSSLHJ5WYD`. Le taux peut et
  doit se lire séparément FR et EN : les deux configurateurs ne sont pas la
  même surface.

### Pourquoi aucun événement custom n'a été ajouté

`page_referrer` est collecté automatiquement par GA4 sur chaque `page_view`.
Un clic article → configurateur est une navigation complète same-origin : le
referrer transmis est l'URL exacte de l'article. Un événement
`blog_to_configurator` émis côté configurateur ferait la même chose en
dupliquant l'information — et exigerait de toucher
`src/app/configurator/page.tsx` (verrou `tsa-revenue`). Le chaînon fragile
n'est pas le code, c'est l'hygiène des liens et l'unicité des `page_view` :
c'est précisément ce que `scripts/qa-blog-funnel.mjs` verrouille à chaque
`audit:all`.

## 2. Validité temporelle des données

- Les `page_view` ne sont **pas** concernés par la rupture de série du 14/08
  (`configurator_complete`), MAIS le double comptage du `page_view` initial
  côté Next n'a été corrigé que le 13/08. **Première semaine complète propre :
  lundi 17/08/2026.** Ne rien calculer avant.
- Le trafic n'est pas filtré (interne Monaco, datacenters — cf. chantier M2).
  À ~20 humains/mois, A3 se lit en **valeurs absolues d'abord** (N arrivées,
  N vues), le taux ensuite. Un taux sur un dénominateur < 50 vues/semaine ne
  permet pas de comparer deux articles entre eux (règle 9).

## 3. Relevé hebdomadaire

| Semaine (lun-dim) | Vues articles FR | Arrivées config. FR | Taux FR | Vues articles EN | Arrivées config. EN | Taux EN | Top article contributeur |
|---|---|---|---|---|---|---|---|
| 17-23/08/2026 | à relever | à relever | — | à relever | à relever | — | — |
| 24-30/08/2026 | à relever | à relever | — | à relever | à relever | — | — |
| 31/08-06/09/2026 | | | | | | | |

La ligne de base = les deux semaines 17-23/08 et 24-30/08, à relever par
Pierre via la procédure ci-dessous (les données existent déjà dans GA4,
`page_referrer` étant collecté depuis toujours). Tant que ces deux lignes sont
vides, la valeur de départ d'A3 est **inconnue**, pas nulle.

## 4. Procédure GA4 (Pierre, ~10 min, une fois — puis ~3 min/semaine)

Construction de l'exploration (une seule fois) :

1. GA4 → propriété de tennisstringadvisor.org (`G-YSSLHJ5WYD`) → **Explorer**
   → **Vide (exploration au format libre)**.
2. Nommer l'exploration : `A3 blog → configurateur`.
3. Colonne Variables → **Dimensions** → `+` → cocher **Chemin de la page et
   classe d'écran** (`page_path`) et **URL de provenance de la page**
   (`page_referrer`). Importer.
4. **Statistiques** → `+` → cocher **Vues** (ou **Nombre d'événements**).
   Importer.
5. Onglet Paramètres :
   - **Lignes** : `URL de provenance de la page`.
   - **Valeurs** : `Vues`.
   - **Filtre 1** : `Chemin de la page et classe d'écran` → *contient* →
     `configurator`.
   - **Filtre 2** : `URL de provenance de la page` → *contient* → `/blog/`.
6. La période en haut à gauche : régler sur la semaine voulue (lun → dim).

Lecture hebdomadaire (~3 min) :

7. **Numérateur** : la table affiche une ligne par article référent, avec le
   nombre d'arrivées. Ignorer les lignes `…/blog/` et `…/blog/index.html`
   (hub). Séparer FR (`/blog/`) et EN (`/en/blog/`) — la ligne par ligne donne
   directement le « top article contributeur ».
8. **Dénominateur** : dupliquer l'exploration (ou changer les filtres) :
   Filtre 1 : `Chemin de la page` *contient* `/blog/` ; supprimer le filtre
   referrer ; Lignes : `Chemin de la page`. Exclure les lignes d'index.
9. Reporter les quatre nombres et le top article dans le tableau du §3
   (commit `docs(reports): relevé A3 semaine du …`).

Contrôle de l'instrument (une fois, à la première lecture) : si le numérateur
est zéro sur les deux semaines de base alors que le dénominateur ne l'est pas,
suspecter l'instrument avant de conclure « personne ne clique » (règle 7) :
ouvrir un article en production, cliquer vers le configurateur, et vérifier
dans **Rapports → Temps réel** qu'un `page_view` avec la bonne provenance
apparaît (ou via DebugView avec `?debug_mode=1`).

## 5. Cible

Pas de cible chiffrée tant que la ligne de base n'est pas relevée (règle :
d'abord la valeur de départ, ensuite l'objectif). L'objectif M+3 du §8
(200 utilisateurs/mois, 80 complétions) suppose que le blog alimente le
configurateur : A3 est l'indicateur qui dira si c'est vrai, article par
article.
