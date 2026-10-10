# <Titre de travail>

| Champ | Valeur |
|---|---|
| Slug FR / EN | `<slug-fr>` / `<slug-en>` |
| Circuit | complet · court · veille |
| Branche | `agent/redaction/<slug-fr>` |
| Ouvert le | AAAA-MM-JJ, par l'orchestrateur |
| Demande d'origine | « citation exacte de Pierre, ou ligne du plan éditorial » |
| Statut | brief · faits · rédaction · vérification · PR #… · en ligne le … · relevé S+4 le … |

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

| # | Emplacement | Page de l'image | Auteur | Licence (lue le) | Obligations | Risques (marque, personne) | Décision du rédacteur |
|---|---|---|---|---|---|---|---|
| I1 | couverture | | | | | | |

---

## 4. Questions ouvertes

- **Q-1** · de `<agent>` à `<agent>` · AAAA-MM-JJ — …
  - → `<agent>`, AAAA-MM-JJ : … (fait n° …)

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

- AAAA-MM-JJ · `<agent>` — ce qui a été fait. RELAIS → …
