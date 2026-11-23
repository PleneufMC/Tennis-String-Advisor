# Montage hybride : quel cordage en montants, lequel en travers, et quelle fermeté pour le bras

| Champ | Valeur |
|---|---|
| Slug FR / EN | `montage-hybride-cordage-tennis` / `hybrid-tennis-string-setup` (slugs de travail du classeur de veille, à confirmer par `tsa-acquisition` au §1) |
| Circuit | complet (nouvel article FR + EN) |
| Branche | `agent/redaction/montage-hybride-cordage-tennis` (worktree `C:\Users\plene\Documents\_wt\redac-hybride`) |
| Ouvert le | 2026-11-23, par l'orchestrateur |
| Demande d'origine | Pierre, 23/11/2026 : « allez chercher là dedans des idées d'articles pour le blog complémentaire à ce qui est déjà en ligne » (classeur « TSA · Idées d'articles », idée 2026-W46-2) ; puis « GO sur le montage hybride en anglais et en français » ; puis « je te laisse faire tous les arbitrages nécéssaires à la rédaction de cet article » (délégation à l'orchestrateur ; la mise en ligne reste soumise au GO de Pierre sur la PR, charte §6) |
| Statut | brief (étape 1) |
| Mise à jour planifiée | sans objet (aucune année dans le titre ni le slug de travail) |

> Règles : `docs/redaction/CHARTE.md`. Déroulé : `docs/redaction/README.md`.
> On n'écrit que dans ses sections ; on répond aux questions qui nous sont
> adressées au §4 ; chaque passage laisse une entrée au §7.

---

## 1. Brief SEO — `tsa-acquisition`

### Requête et intention

- Requête principale FR : …
- Requête principale EN : …
- Requêtes secondaires : …
- Intention, en une phrase (ce que le lecteur veut savoir ou décider) : …

### Durée de vie (evergreen d'abord, charte §1)

- Durée de vie attendue : … (des années · une saison · quelques semaines)
- Pourquoi : … (intention durable, ou raison qui justifie l'exception d'actualité)
- Année dans le titre ou le slug : non · oui, parce que … → date de mise à jour planifiée en en-tête

### SERP observée

Un relevé est un indice (personnalisation, localisation), pas une mesure : moteur, date et requête exacte.

| Moteur | Date | Rang | Résultat | Ce qu'il couvre | Ce qu'il rate |
|---|---|---|---|---|---|
| Bing | | | | | |
| Google | | | | | |

### Angle différenciant

Ce que TSA peut dire et que les résultats ci-dessus ne disent pas (le bras, l'indice RCS, les données de la base) : …

### Cannibalisation

| Article existant | Requête proche | Décision (lier · fusionner · différencier) |
|---|---|---|
| | | |

### Balises proposées

| | FR | EN |
|---|---|---|
| title (60 caractères au plus) | | |
| meta description (155 au plus) | | |
| H1 | | |
| slug | | |

### Plan proposé (H2, H3)

1. …

### Maillage

- Entrants (articles existants qui pointeront vers celui-ci, avec l'ancre envisagée) : …
- Sortants (lien vers le configurateur dans le corps, obligatoire ; fiches produit ; articles) : …

### Questions de faits pour le pigiste

- Q1. …

### Visuels suggérés

- Couverture : …
- Corps : … (schéma, graphique tiré de la base, photo légendée)

---

## 2. Dossier de faits — `tsa-pigiste`

Niveaux : **L0** constructeur · **L1** laboratoire (TWU) · **L2** revendeur ·
**L3** test publié, presse · **L4** forum (signal seulement) · **MÉD** source
médicale ou étude publiée · **BASE** `src/data/`.
Statuts : **confirmé** · **divergent** (→ `tsa-core`) · **introuvable** · **signal**.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (25 mots au plus) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| F1 | | | | | | | | | |

### Introuvable

- …

### Divergences avec la base (pour `tsa-core`)

| Produit | Champ | Base | Source externe (niveau, URL) | Écart |
|---|---|---|---|---|

### Points glissants repérés

- …

---

## 3. Iconographie — `tsa-pigiste` (candidats) · `tsa-redacteur` (décision)

Voies (charte §4) : **1** photo à licence explicite · **2** visuel généré par
script · **3** illustration générée par l'outil MCP de Pierre (seulement s'il est
connecté). Le visuel qui sert le mieux le lecteur l'emporte. Pour la voie 3, le
rédacteur note ici le prompt employé, puis le recopie dans `CREDITS.md`.

| # | Emplacement | Voie | Page de l'image ou prompt | Auteur | Licence (lue le) | Obligations | Risques (marque, personne, texte incrusté) | Décision du rédacteur |
|---|---|---|---|---|---|---|---|---|
| I1 | couverture | | | | | | | |

---

## 4. Questions ouvertes

- **A-1** · arbitrage de l'orchestrateur (délégation de Pierre du 23/11/2026, citée en en-tête) · 2026-11-23 — **Chiffrer ou non la fermeté d'un hybride ?** `cordage-polyester-tennis-elbow` §6 (26/10/2026) refuse de la chiffrer : « seuls 15 de nos 45 multifilaments ont une rigidité alignée sur une mesure de laboratoire, et un set prémonté n'a pas de mesure propre dans notre base ; un indice calculé dessus afficherait une précision qu'il n'a pas ». Le configurateur affiche pourtant l'indice d'un hybride monté à la main (`setupFirmnessIndex`, « estimation pour un hybride, entre X et Y »).
  - **Décision** : l'article chiffre **seulement** les hybrides dont les **deux** cordages ont une rigidité alignée sur une mesure de laboratoire (le pigiste et `tsa-core` disent lesquels, d'après la base). Le chiffre est présenté comme le fait le configurateur : une **estimation dérivée des mesures de chaque cordage**, en fourchette, jamais comme une mesure du montage (règle 3). Pas de chiffre pour un hybride dont un cordage n'a pas de rigidité mesurée (boyau naturel compris) : l'article le dit et dit pourquoi. Les sets prémontés reprennent la rigidité dérivée de `prepacked-hybrids.ts` avec son étiquette, ou rien si la composition n'est pas publiée. Aucune formule ni pondération RCS ne change.
  - **Pourquoi** : la raison du refus du 26/10 est la fausse précision ; elle tient pour les cordages sans mesure et pour un indice présenté seul, pas pour une fourchette étiquetée sur deux cordages mesurés, que le configurateur publie déjà. Écrire l'article sans aucun chiffre laisserait l'outil seul à les donner, sans explication.
  - **Suite** : la phrase du 26/10 reste vraie pour cet article-là ; `tsa-acquisition` propose au 4b un lien de ce §6 vers le nouvel article (circuit court, dans la même PR).
- **A-2** · arbitrage de l'orchestrateur · 2026-11-23 — **Sources.** Les vidéos et fils de forum du classeur de veille sont des **signaux** (questions des joueurs), jamais des sources de faits : les testeurs cités sont vendeurs, affiliés ou partenaires des marques. Un hybride de joueur professionnel n'est cité qu'avec deux sources (F4) ; sinon il n'est pas cité.

---

## 5. Fact-check final — `tsa-pigiste`

### Valeurs produit (contrôle automatique)

Chaque valeur produit affichée par l'article, FR et EN, y compris dans les
tableaux, telle qu'elle est écrite. Champs : voir l'en-tête de
`scripts/redaction/verifier-valeurs.mts`.

```valeurs-produit
# sujet                                   | champ           | valeur citée | où
```

Sortie de `npm run redaction:valeurs -- docs/redaction/<slug-fr>.md` :

```
(coller la sortie)
```

### Affirmations

| # | Phrase de l'article (FR · EN) | Fait n° | Conforme | Correction demandée |
|---|---|---|---|---|

### Test de glissance

| Affirmation contestable | Par qui (fabricant · cordeur · médecin) | Défense (fait n°) ou « sans défense » |
|---|---|---|

---

## 6. Revue SEO — `tsa-acquisition`

### Contrôle on-page

- [ ] title, meta, H1 et slug FR et EN conformes au brief, ou écart motivé
- [ ] canonical ; hreflang réciproques sur la paire FR/EN
- [ ] JSON-LD Article valide (`image`, `datePublished`, `dateModified`) ; Breadcrumb ; FAQPage seulement si une FAQ visible lui correspond
- [ ] og:image et twitter:image en 1200 × 630, avec `og:image:alt`
- [ ] index du blog FR et EN ; sitemap (`BLOG_SLUGS`, `EN_BLOG_SLUGS`)
- [ ] maillage : liens entrants posés, sortants présents, lien vers le configurateur dans le corps (A3)
- [ ] `npm run audit:blog-funnel` et `npm run audit:blog-images` verts

### Propositions au rédacteur

| # | Où | Proposition | Motif SEO | Réponse du rédacteur |
|---|---|---|---|---|

### Vérification en production (après fusion)

- …

---

## 7. Journal

- 2026-11-23 · orchestrateur — étape 0 : dossier copié de `_modele.md`, en-tête rempli, worktree `_wt/redac-hybride` et branche `agent/redaction/montage-hybride-cordage-tennis` créés depuis `origin/main` (`dba4f8d`) ; circuit complet ; arbitrages A-1 et A-2 au §4. Entrée : rapport `tsa-acquisition` du 23/11 sur le classeur de veille (P1, 7 signaux ; hybride traité seulement par fragments dans `guide-materiel-tennis` §5, `cordage-mono-vs-multifilament` §08, `cordage-polyester-tennis-elbow` §6, `guide-tension-cordage-tennis` §3). RELAIS → `tsa-acquisition` : brief SEO (§1).
