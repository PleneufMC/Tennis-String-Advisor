# Cordage neuf qui perd sa tension dès les premières heures : est-ce normal, faut-il le corder plus tendu ?

| Champ | Valeur |
|---|---|
| Slug FR / EN | `combien-de-temps-dure-un-cordage` / `how-long-do-tennis-strings-last` (articles existants, slugs inchangés) |
| Circuit | court renforcé : mise à jour d'un article existant (section nouvelle), voir §1 |
| Branche | `agent/redaction/combien-de-temps-dure-un-cordage` |
| Ouvert le | 2026-11-21, par l'orchestrateur |
| Demande d'origine | Pierre, 21/11/2026 : « merci de lancer la rédaction d'un article sur ce thème », ligne du plan éditorial 2026-W46-1 (« Cordage neuf qui perd sa tension dès les premières heures : est-ce normal, et faut-il le corder plus tendu ? », type : mise à jour d'un article existant, score 3,78, circuit court) |
| Statut | faits |
| Mise à jour planifiée | sans objet (pas d'année dans le titre ni le slug) |

> Règles : `docs/redaction/CHARTE.md`. Déroulé : `docs/redaction/README.md`.
> On n'écrit que dans ses sections ; on répond aux questions qui nous sont
> adressées au §4 ; chaque passage laisse une entrée au §7.

---

## 1. Cadrage de l'orchestrateur (tient lieu de brief)

**Pourquoi une mise à jour et pas un article.** `combien-de-temps-dure-un-cordage` explique déjà que la perte de tension est la plus rapide juste après la pose (§5 « repos », §2 « panne 1 », FAQ). Il ne répond pas à la question « faut-il compenser cette détente initiale, à la pose ou en recordant ? ». Un nouvel article ferait doublon (relevé du plan éditorial). La FAQ actuelle répond « non » à « monter la tension pour compenser un cordage qui vieillit » : c'est le vieillissement, pas la détente des premières heures ; la nouvelle section doit s'articuler avec cette réponse sans la contredire.

**Question du lecteur.** Pourquoi un cordage neuf perd-il de la tension dès les premières heures, et faut-il compenser cette perte à la pose ou en recordant ?

**Signaux (non mesurés).** Fil r/10s « new strings notched up after 2 hours of playing » (https://reddit.com/r/10s/comments/1xc5x41/new_strings_notched_up_after_2_hours_of_playing/) ; Google associe « Quand changer de cordage de tennis ? » à « tension cordage tennis ». Audience 28 jours : NON DOCUMENTÉ (GA4 et Search Console indisponibles le 15/11). Les forums sont des signaux, jamais des sources.

**Hors périmètre.** Le tableau de tensions par profil (relève de `guide-tension-cordage-tennis`). L'écart montants/travers et le choix d'un montage deux pièces (relève de `comparer-deux-montages-cordage-tension` et du guide).

**Contraintes de la ligne du plan (impératives).**
- Présenter la détente initiale comme normale, conformément au passage publié, et non comme un défaut.
- Aucune règle universelle de compensation (kg en plus, +4 lb en travers) sans source primaire ; à défaut, écrire « introuvable ».
- Ne pas comparer les mesures de laboratoire aux sensations rapportées sur les forums.
- Confort qualifié uniquement par l'indice de fermeté (RCS) et son palier, sans effet sur la santé ; une douleur persistante renvoie vers un professionnel de santé.
- Tout réglage de pro exige deux sources indépendantes.
- Fin d'article : renvoi vers le configurateur (`/configurator` ; EN `/en/configurator`).
- Distinguer tension demandée, tension mesurée et fermeté du tamis (point du contradicteur).

**Questions de faits pour le pigiste.**
1. Quelle part de la tension un cordage perd-il dans les heures qui suivent la pose, et selon quelle mesure source (TWU ou autre base L1) ?
2. Existe-t-il une source primaire qui recommande de corder plus tendu pour compenser cette détente initiale ? Si oui, de combien ? (Pré-étirage, « prestretch », pourcentage machine : à couvrir.)
3. La vitesse de cette perte initiale diffère-t-elle entre polyester et multifilament dans les mesures publiées, à protocole identique ?
4. Une source primaire relie-t-elle la perte de tension mesurée à une évolution de l'indice de fermeté du tamis (ou de la raideur du tamis) ?

**Durée de vie.** Plusieurs années : la détente après la pose ne dépend ni de la saison ni des nouveautés.

**Paires à vérifier après la mise à jour** (cohérence, sans réécriture sauf contradiction) : `compare-two-string-setups-same-tension`, `tennis-strings-for-clay-courts`.

**Acquisition.** Non mobilisée sauf si le titre, la meta, les balises ou le maillage changent (circuit court) ; si le rédacteur ajoute une entrée de FAQ (JSON-LD dans le `<head>`), relais à `tsa-acquisition`.

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
