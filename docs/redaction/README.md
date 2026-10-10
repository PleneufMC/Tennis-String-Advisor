# La chaîne éditoriale de Tennis String Advisor

> **Version 1.1 — 10 octobre 2026.** Demande de Pierre : « il me semble important
> qu'en tant que site sérieux, il y ait 1 pigiste qui recherche l'info brute, un
> rédacteur qui fait les articles/blog et enfin un spécialiste du SEO […] qu'ils
> aient le réflexe de travailler ensemble ». Et : « les articles doivent être
> systématiquement assortis d'images quitte à les générer ».
>
> Ses décisions du même jour sont intégrées :
> - « Un article semaine serait top mais il faut viser le plus evergreen
>   possible » (charte §1) ;
> - un générateur d'images en MCP sur n8n (charte §4, voie 3) ;
> - « pas de publication sans mon consentement » (charte §6).
>
> Ce fichier dit **qui fait quoi, dans quel ordre**. Les règles de fond (faits,
> santé, images, typographie) sont dans [`CHARTE.md`](CHARTE.md). Le modèle de
> dossier est [`_modele.md`](_modele.md).

---

## 1. Trois métiers, une chaîne

| Agent | Métier | Il décide | Il ne fait jamais |
|---|---|---|---|
| `tsa-acquisition` | Spécialiste SEO et acquisition | ce que les joueurs cherchent et comment l'article se trouve : requête, titre, balises, maillage, distribution | modifier un fait, un chiffre, un verdict ou un conseil de santé |
| `tsa-pigiste` | L'information brute, vérifiée | ce qui est un fait, et ce qui est introuvable | écrire un texte publiable, toucher à `public/` ou `src/` |
| `tsa-redacteur` | L'article et ses images | les mots, l'angle, la structure, les visuels | ajouter un fait absent du dossier |

Autour de la chaîne :

- **`tsa-core`** tranche toute donnée de la base (`src/data/`). Le pigiste lui
  signale les écarts, personne d'autre ne corrige.
- **`tsa-measure`** relève l'effet à S+4 et refuse le mot « efficace » sans
  mesure.
- **L'orchestrateur** (le fil principal de la session) lance les agents,
  transmet le contexte, relaie les questions. Il ne rédige rien et ne tranche
  aucun fait.
- **Pierre** décide des sujets et des arbitrages. **Rien n'est publié sans son
  consentement explicite** (charte §6) ; son GO sur une PR vaut pour la mise en
  ligne de cette PR sur le site, et pour rien d'autre.

---

## 2. Le dossier partagé

Un sujet, c'est :
- un fichier `docs/redaction/<slug-fr>.md`, copié de `_modele.md` ;
- une branche `agent/redaction/<slug-fr>`, dans un worktree dédié ;
- une PR vers `main`.

| § | Section | Qui l'écrit |
|---|---|---|
| 1 | Brief SEO | `tsa-acquisition` |
| 2 | Dossier de faits | `tsa-pigiste` |
| 3 | Iconographie | `tsa-pigiste` (candidats) ; `tsa-redacteur` (colonne « Décision ») |
| 4 | Questions ouvertes | tout agent ; chacun répond aux questions qui lui sont adressées |
| 5 | Fact-check final et test de glissance | `tsa-pigiste` |
| 6 | Revue SEO | `tsa-acquisition` ; `tsa-redacteur` (colonne « Réponse ») |
| 7 | Journal | chaque agent, une entrée datée par passage |

Règles d'écriture :

- On n'écrit **que dans ses sections**, par une édition ciblée (jamais en
  réécrivant le fichier entier).
- On ne réécrit jamais l'entrée d'un autre.
- Une question a un destinataire nommé ; une réponse est datée.
- Le dossier est versionné avec l'article : c'est sa **provenance** (qui a dit
  quoi, d'après quoi). Il n'est pas servi par le site (`docs/` n'est pas dans
  `public/`).

Git, sur la branche partagée :

- chacun commite **ses** fichiers par chemin explicite, jamais `git add -A` ;
- si git signale un verrou (`index.lock`), on attend et l'on recommence. Le
  verrou d'un autre ne se supprime jamais.

---

## 3. L'ordre des relais

```
(0) orchestrateur ─ ouvre le dossier (_modele.md), le worktree, la branche ; choisit le circuit
        │
(1) tsa-acquisition ─ BRIEF SEO (§1)
        │   requête, intention, SERP datée, angle, cannibalisation, balises FR/EN,
        │   plan Hn, maillage, questions de faits, visuels suggérés
        │   RELAIS → tsa-pigiste
(2) tsa-pigiste ─ DOSSIER DE FAITS (§2) + ICONOGRAPHIE (§3)
        │   RELAIS → tsa-redacteur
(3) tsa-redacteur ─ ARTICLE FR + ADAPTATION EN + VISUELS
        │   fait manquant ? → §4 « DEMANDE AU PIGISTE » → retour en (2) sur ce seul point
        │   RELAIS → tsa-pigiste ET tsa-acquisition
        ├──────────────────────────────┐
(4a) tsa-pigiste ─ FACT-CHECK (§5)      (4b) tsa-acquisition ─ PASSE ON-PAGE (§6)
     chaque chiffre, chaque affirmation,      <head>, JSON-LD, hreflang, sitemap,
     FR et EN ; npm run redaction:valeurs ;   index du blog, maillage ;
     test de glissance                        propositions au rédacteur
        └──────────────┬───────────────┘
        │   RELAIS → tsa-redacteur
(5) tsa-redacteur ─ PASSE FINALE
        │   solde le fact-check, coupe ce qui n'a pas de défense,
        │   accepte ou refuse chaque proposition SEO (motif au §6)
(6) tsa-redacteur ─ CONTRÔLES : build, audit:blog-funnel, audit:blog-images,
        │   redaction:valeurs, aucun marqueur « À SOURCER », rendu Playwright
        │   (chrome) FR + EN à 1280 et 390 px, thèmes clair et sombre
(7) tsa-redacteur ─ PR vers main (dossier + articles + images + index + sitemap)
        │   → GO de Pierre = son consentement à la mise en ligne sur le site, rien d'autre
(8) tsa-acquisition ─ VÉRIFICATION EN PRODUCTION ; relevé S+4 avec tsa-measure
```

Les étapes 4a et 4b tournent en parallèle sur la même branche : elles
touchent des fichiers disjoints, sauf le dossier, où chacune n'édite que sa
section.

---

## 4. Trois circuits : la profondeur suit l'enjeu

Pierre demande une vérification **proportionnée** : une retouche de trois
lignes ne justifie ni brief, ni rendu multirésolution, ni relecture du
catalogue. Le circuit se choisit à l'étape 0, et il se dit dans le brief de
chaque agent.

| Circuit | Quand | Qui | Profondeur indicative |
|---|---|---|---|
| **Complet** | nouvel article, refonte, classement | les trois agents, étapes 0 à 8 | brief d'une page ; 15 à 40 faits ; article FR de 1 000 à 2 000 mots, plus l'EN ; couverture et 1 à 3 visuels de corps ; rendu FR et EN à 1280 et 390 px |
| **Court** | correction ponctuelle d'un article existant (chiffre, phrase, lien, retrait) | rédacteur, puis fact-check du pigiste sur les **seules** valeurs touchées ; acquisition seulement si le titre, le slug, les balises ou le maillage changent | pas de brief ; contrôles automatiques ; rendu de la page touchée à 390 px |
| **Veille** | sur demande : nouvelles générations, matériel des pros, études sur le tennis elbow | pigiste seul | 10 faits au plus, dans `docs/redaction/veille-AAAA-MM-JJ.md` (§2 du modèle) ; propositions de sujets à `tsa-acquisition` ; écarts de base à `tsa-core` |

Un article modifié par le circuit court perd son exception éventuelle dans
`scripts/qa-blog-images.exceptions.json`, et `audit:blog-images` échoue. Deux
façons d'en sortir :

- **ajouter un visuel de corps**, ce qui est la règle ;
- en cas d'urgence, **renouveler l'exception** avec un motif daté. Le renouvellement
  se voit dans le diff, et il se dit dans la PR.

---

## 5. Le relais

Les agents ne s'appellent pas entre eux. Chacun termine son rapport par :

```
RELAIS → <agent> : <ce qu'il doit faire, avec les chemins>
QUESTIONS À <agent> : <Q-n du §4> | aucune
```

L'orchestrateur lit le relais et lance le destinataire. Il lui transmet :
- le chemin du dossier et le circuit ;
- le contexte de la base de connaissances : plan éditorial, décisions récentes
  de Pierre, citées mot pour mot. Les agents ne lisent pas le vault d'eux-mêmes.

**Désaccord.** Les deux positions s'écrivent au §4, chacune avec ses raisons ou
ses faits. Personne ne tranche en silence :
- l'orchestrateur porte le désaccord à Pierre ;
- un arbitrage matériel se présente en page HTML autonome, selon la convention
  de Pierre.

**Qui décide quoi :**

| Question | Décide |
|---|---|
| ce qui est un fait, et sa source | le pigiste ; pour toute donnée de la base, `tsa-core` |
| les mots, l'angle, les visuels | le rédacteur |
| la découvrabilité : requête, titre, balises, maillage | `tsa-acquisition` |
| le sujet, tout arbitrage | Pierre |
| toute publication (fusion, forum, réseau social, newsletter, soumission externe) | Pierre, par un consentement explicite, chaque fois (charte §6) |

---

## 6. Ce que fait l'orchestrateur

- **Étape 0** :
  - choisir le sujet (plan éditorial ou demande de Pierre) et le circuit ;
  - copier `_modele.md` et en remplir l'en-tête ;
  - créer le worktree et la branche depuis `origin/main`.
- **Entre deux étapes** :
  - lire le relais ;
  - vérifier qu'aucune section attendue n'est vide ;
  - relancer le bon agent avec le contexte.
- **Avant la PR** : vérifier que le fact-check est soldé, que les contrôles sont
  verts et que le test de glissance est passé.
- **Après la fusion** :
  - faire vérifier la production par `tsa-acquisition` ;
  - planifier le relevé S+4 avec `tsa-measure`.
- **Jamais** :
  - rédiger un paragraphe ;
  - décider d'un fait ;
  - publier quoi que ce soit (fusion, forum, réseau social, newsletter,
    soumission externe) sans le consentement explicite de Pierre. Quand il le
    donne, l'orchestrateur le cite mot pour mot dans le brief de l'agent qui
    agit.

---

## 7. Hors de la chaîne

| Sujet | Qui s'en charge |
|---|---|
| fiches produit EN générées (`scripts/en-products/`), sitemap, robots, métadonnées des pages de l'application | `tsa-acquisition`, seul |
| données de la base | `tsa-core` |
| liens d'affiliation | `tsa-revenue` |
| message sur un forum, publication sur un réseau social, newsletter, soumission à un moteur ou à un annuaire | préparé par `tsa-acquisition` ; diffusé **seulement avec le consentement explicite de Pierre**, chaque fois (charte §6) |
| rythme de publication | **cible : un article par semaine**, evergreen d'abord (charte §1). Un article publié et indexé vaut mieux que trois brouillons |
