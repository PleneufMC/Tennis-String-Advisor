# Cohérence des chiffres des articles santé après la règle C de jauge (rigidités de laboratoire)

| Champ | Valeur |
|---|---|
| Slug FR / EN | `cordage-polyester-tennis-elbow`, `cordage-tennis-elbow` (+ `guide-materiel-tennis`, cartes des index) / `polyester-strings-tennis-elbow`, `best-tennis-strings-for-tennis-elbow` |
| Circuit | court : passe numérique sur des articles existants, avec un visuel de corps ajouté à chacun (règle images) |
| Branche | `agent/redaction/coherence-chiffres-regle-c`, créée depuis `origin/agent/tsa-core/c2-regle-jauge-c-lot2` (PR #110, non fusionnée) pour que `src/data/` porte déjà les nouvelles rigidités |
| Ouvert le | 2026-10-10, par l'orchestrateur |
| Demande d'origine | « mettre en cohérence avec la base, après les rigidités de laboratoire, les 4 articles santé (FR + EN) qui reposent sur la rigidité des cordages » (corps de la PR #110, § 9 « Chiffres d'articles qui changent à cause de cette PR ») |
| Statut | vérification : fact-check du pigiste à faire · PR #116 (à fusionner APRÈS #110) · GO de Pierre : en attente (aucune publication sans lui) |
| Mise à jour planifiée | sans objet (aucune année dans les titres ni les slugs) ; à refaire quand la règle D (rigidité par jauge) ou le lot 3 changeront la base : `npx --yes tsx scripts/blog-covers/build-rigidite-figures.mts --check` signale les écarts |

> Règles : `docs/redaction/CHARTE.md`. Déroulé : `docs/redaction/README.md`.
> Dossier rédigé par `tsa-redacteur` à la demande de l'orchestrateur ; les sections des autres agents sont renseignées « sans objet » ou laissées à leur auteur.

---

## 1. Brief SEO — `tsa-acquisition`

Sans objet : circuit court, correction de chiffres. Aucun titre éditorial, slug, canonical, hreflang, maillage ni sitemap n'est modifié.

Dérogation de l'orchestrateur (10/10/2026) pour cette passe NUMÉRIQUE, à relire par `tsa-acquisition` :

- `title`, `meta description`, Open Graph, Twitter et JSON-LD des quatre articles : modifiés pour les seuls chiffres (102 polyesters, 143 à 180 lb/in, `dateModified`, `article:modified_time` là où il existe) ;
- cartes des index FR (l. 659) et EN (l. 254) : « 104 » devient « 102 » ;
- seul écart au-delà des chiffres, voir Q-3 : la réponse n° 1 de la FAQ des deux articles « polyester » (visible et JSON-LD, identiques) lève un absolu.

---

## 2. Dossier de faits — `tsa-pigiste`

Niveaux : **L0** constructeur · **L1** laboratoire (TWU) · **L2** revendeur ·
**L3** test publié, presse · **L4** forum (signal seulement) · **MÉD** source
médicale ou étude publiée · **BASE** `src/data/`.
Statuts : **confirmé** · **divergent** (→ `tsa-core`) · **introuvable** · **signal**.

Faits recalculés par le rédacteur à partir de la base de la branche (fonctions du site : `calculateRCS`, `getStringRecommendation`), à confirmer par le pigiste. Sortie reproductible : `npx --yes tsx scripts/blog-covers/build-rigidite-figures.mts --facts`.

| # | Énoncé | Valeur | Niveau | Source | Consulté le | Extrait verbatim (25 mots au plus) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| F1 | Effectif du catalogue des cordages | 179 fiches : 102 polyesters, 45 multifilaments, 16 synthétiques, 9 hybrides, 7 boyaux | BASE | `src/data/strings-database.ts` (branche de la PR #110) | 2026-10-10 | — | CLAUDE.md §1 (179) | oui | confirmé (recalculé) |
| F2 | Rigidité des polyesters | de 164,6 (Toroline O-Toro Snap) à 265 (Luxilon 4G) lb/in ; médiane 217,3 (valeurs centrales 216,6 et 218) | BASE | idem | 2026-10-10 | — | PR #110 § 9 A | oui | confirmé (recalculé) |
| F3 | Polyesters à 200 lb/in ou moins ; à 240 lb/in ou plus ; entre les deux | 20 ; 19 ; 63 | BASE | idem | 2026-10-10 | — | PR #110 § 9 A (20 ; 19) | oui | confirmé (recalculé) |
| F4 | Rigidité des multifilaments | de 143 (Ashaway Dynamite Natural) à 180 (Head RIP Control) lb/in ; médiane 162 | BASE | idem | 2026-10-10 | — | PR #110 § 9 B (143 à 180, médiane 162) | oui | confirmé (recalculé) |
| F5 | Autres familles, inchangées | hybrides 158–192 (médiane 175) ; synthétiques 165–185 (180) ; boyaux 88–100 (95) | BASE | idem | 2026-10-10 | — | PR #110 § 9 B | oui | confirmé (recalculé) |
| F6 | Multifilaments dont la rigidité est alignée sur une mesure TWU | 6 sur 45 : tecnifibre-nrg2, wilson-nxt, volkl-power-fiber-ii, babolat-xcel-power, babolat-origin, tecnifibre-xr3 | BASE | `src/data/string-stiffness-provenance.ts` (statut « appliquee ») | 2026-10-10 | — | PR #110 § 9 A (« 6 multifilaments sur 45 ») | oui | confirmé (recalculé) |
| F7 | Règle de jauge de référence : pour une fiche alignée, la rigidité est la mesure TWU de la jauge la plus rigide mesurée parmi les jauges de la fiche ; sur-alerte assumée sur les jauges fines | décision de Pierre du 10/10/2026 | L1 + décision | `src/data/string-stiffness-provenance.ts` (en-tête) ; PR #110 § « Décisions de Pierre » ; TWU : https://twu.tennis-warehouse.com/learning_center/reporter2.php (51 lbs, balayage « Fast ») | 2026-10-10 | — | — | oui | confirmé (par la base ; le pigiste peut rouvrir la page TWU) |
| F8 | Tecnifibre Black Code, mesures TWU par jauge | 1,18 = 202.9 ; 1,24 = 236 ; 1,28 = 249.7 ; 1,32 = 210.3 lb/in ; la fiche porte 249,7 (jauge 1.28). Écart maximal 46,8 lb/in, soit environ 5,1 points d'indice (0,109 point par lb/in) | L1 | `data/reference/twu-releve-complet.json` ; `string-stiffness-provenance.ts` | 2026-10-10 | — | PR #110 § 1 (46,8) | oui | confirmé (à rouvrir par le pigiste) |
| F9 | Seuils d'alerte bras du configurateur | 32 (bras sensible), 35 (autres profils) | BASE | `src/lib/advanced-rcs.ts` (`armRisk`) | 2026-10-10 | `rcs >= 32 … rcs >= 35` | CHARTE F7 | oui | confirmé |
| F10 | Montage d'exemple de l'article (RA 65, 22 kg) : rigidité où l'indice atteint 32 et 35 ; nombre de polyesters concernés | 231,1 et 258,6 lb/in ; 28 polyesters à 32 ou plus (dont 4 à 35 ou plus), 74 en dessous | BASE | `calculateRCS` sur la base | 2026-10-10 | — | — | oui | confirmé (recalculé) |
| F11 | Part des multifilaments et des boyaux plus souples que le polyester le plus souple (164,6) | 28 multifilaments sur 45 ; 7 boyaux sur 7 | BASE | idem | 2026-10-10 | — | — | oui | confirmé (recalculé) |
| F12 | Les 18 polyesters à avis de testeurs ne sont pas touchés : leurs rigidités et leurs rangs de souplesse (Yonex Poly Tour Pro 10e, Signum Pro X-Perience 3e, Solinco Confidential 15e, Solinco Mach-10 2e, Toroline O-Toro 1er) sont inchangés | — | BASE | `string-stiffness-provenance.ts` : aucun des 18 en statut « appliquee » | 2026-10-10 | — | PR #110 § 9 A | oui | confirmé (recalculé) |
| F13 | La rigidité d'un hybride prémonté est propre au set, sans source, et n'est pas recalculée quand un composant est aligné sur une mesure | — | BASE | PR #110 § 7 (« Hybrides pré-montés ») | 2026-10-10 | — | — | oui | confirmé ; voir Q-1 |

### Introuvable

- Génération et coloris des échantillons TWU : TWU ne les publie pas (PR #110 § 11). Les articles ne s'en servent pas.

### Divergences avec la base (pour `tsa-core`)

| Produit | Champ | Base | Source externe (niveau, URL) | Écart |
|---|---|---|---|---|
| Tecnifibre Hybrid Razor Code + X-One | rigidité | 180 lb/in (fiche du set) | base elle-même : son composant Razor Code est à 242,9 lb/in (TWU, jauge 1.30) | le set est inférieur à son composant ; voir Q-1 |

### Points glissants repérés

- « En général, un multifilament ou un boyau reste plus prudent qu'un polyester » : vrai en tendance (F11), faux en absolu ; les articles disent « en général ».
- « Mesure TWU = une seule mesure par couple (modèle, jauge), sans incertitude publiée » : le bruit entre jauges atteint 10 à 20 lb/in (PR #110 § 11). Les articles ne présentent pas la rigidité comme exacte à la décimale.

---

## 3. Iconographie — `tsa-pigiste` (candidats) · `tsa-redacteur` (décision)

| # | Emplacement | Voie | Page de l'image ou prompt | Auteur | Licence (lue le) | Obligations | Risques (marque, personne, texte incrusté) | Décision du rédacteur |
|---|---|---|---|---|---|---|---|---|
| I1 | corps, section 1 des deux articles « polyester » (FR et EN) | 2 : visuel généré par script | `scripts/blog-covers/build-rigidite-figures.mts` (graphique « polyesters », lu dans `src/data/`) | Tennis String Advisor | propriété TSA | légende de provenance : « Schéma Tennis String Advisor, d'après la base du site et les mesures TWU » | aucun produit ni marque en image ; noms de cordages en infobulle (`<title>`) seulement | retenu : un point par polyester, zones 200 et 240 lb/in, médiane, seuils d'alerte du montage d'exemple |
| I2 | corps, section 2 des deux articles « tennis elbow » (FR et EN) | 2 : visuel généré par script | idem, graphique « familles » | Tennis String Advisor | propriété TSA | idem | aucun | retenu : minimum, médiane et maximum par famille, avec la bande d'indice RCS |

---

## 4. Questions ouvertes

- **Q-1** · de `tsa-redacteur` à `tsa-core` · 2026-10-10 — Les trois hybrides prémontés qui contiennent un cordage aligné sur une mesure gardent leur rigidité d'avant : Razor Code + X-One 180 (composant Razor Code désormais 242,9), Ice Code + NRG2 172 (NRG2 164), Duo Control 188 (NXT 173,7). Le tableau des 17 cordages des articles « cordage et tennis elbow » cite Razor Code + X-One à 180 (indice 26 dans l'exemple). Les articles affichent la valeur de la base et disent qu'elle n'est pas mesurée ni recalculée à partir des composants. Recalculer les hybrides, les retirer du RCS, ou laisser tel quel ? Décision de la base ; le rédacteur suivra (retrait de la ligne du tableau si besoin).
- **Q-2** · de `tsa-redacteur` à `tsa-pigiste` · 2026-10-10 — Vérifier les seules valeurs touchées (§ 5), et en particulier : (a) Black Code 202,9 lb/in en 1.18 et 249,7 en 1.28 (TWU, `data/reference/twu-releve-complet.json`) et « environ 5 points d'indice » ; (b) « seuls 6 de nos 45 multifilaments » (F6) ; (c) les effectifs du graphique « polyesters » : 74, 24, 4 et 28 (F10) ; (d) la formule « peuvent s'en écarter, dans un sens comme dans l'autre » pour les fiches non marquées † (PR #110 § 5 : 54 fiches plus rigides que la mesure ; § 6 : 25 plus souples).
  - → `tsa-pigiste`, 2026-10-10 : valeurs touchées recalculées par des scripts à moi (méthode, sorties et faits F14 à F23 au § 5). **(a) Confirmé.** Relevé TWU (51 lbs, balayage « Fast ») : « Tecnifibre Black Code 18 » (jauge nominale 1,18) = 202,9 ; « Black Code 17 » (1,24) = 236 ; « Black Code 16 » (1,28) = 249,7 ; « Black Code 15L » (1,32) = 210,3 lb/in. Trois copies concordantes : `data/reference/twu-releve-complet.json` (#110), `data/reference/twu-releve-complet.json` (branche de #113) et le relevé brut local, dont j'ai recalculé le sha256 (`01c07cc…8872`, celui qu'enregistrent les deux fichiers). Écart maximal 249,7 − 202,9 = 46,8 lb/in, soit 46,8 × 0,109 = 5,1 points d'indice : « environ 5 points » est exact. **(b) Confirmé** : six fiches au statut « appliquee » (Völkl Power Fiber II, NRG2, NXT, Xcel Power, Origin, XR3), chacune égale à la mesure de la jauge appliquée ; aucun autre multifilament n'a la valeur de la règle C ; les trois sets hybrides n'ont aucune ligne TWU. **(c) Confirmé** : 74 / 24 / 4, donc 28 à 32 ou plus ; seuils 32 et 35 relus par un motif à moi dans `src/lib/advanced-rcs.ts` (l. 337-339) ; l'indice atteint 32 à 231,14 lb/in et 35 à 258,64 ; les 102 points des deux SVG (titre, abscisse, couleur) concordent avec la base. **(d) Exacte à la lettre, portée plus large que la phrase** : 80 fiches non alignées ont au moins une mesure TWU à une jauge de la fiche, 25 plus rigides que la base et 55 plus souples (les 54 de #110, plus `wilson-optimus-16`, 178 → 140, absente de sa liste) ; écart absolu médian 17,8 lb/in (environ 1,9 point d'indice), 32 fiches à 20 lb/in ou plus, extrêmes −75,1 (Weiss Cannon Ultra Cable) et +46,0 (Babolat Revenge). La phrase est vraie ; elle ne dit pas que ces fiches sont nombreuses ni que plusieurs figurent dans les listes et les phrases des articles (F15, F16, G2, G3, G13 à G15 et D-1 au § 5).
- **Q-3** · de `tsa-redacteur` à `tsa-acquisition` · 2026-10-10 — Au-delà de la dérogation numérique : la réponse n° 1 de la FAQ des deux articles « polyester » disait « safer than any polyester » (EN) et « reste plus prudent qu'un polyester » (FR). L'absolu « any » est faux depuis que le Wilson NXT (173,7, indice 25) est plus rigide que les polyesters les plus souples (164,6 à 165,7, indice 24). Reformulé en « En général… » / « In general… », texte visible et JSON-LD identiques. À valider.
- **Q-4** · de `tsa-redacteur` à l'orchestrateur · 2026-10-10 — La liste de la PR #110 (§ 9) ne cite pas la médiane de la section 4 des articles « polyester » (« juste au-dessus de la médiane du catalogue (215) », FR l. 375, EN l. 321) : corrigée en 217,3. Elle ne dit pas non plus que la transparence EN de l'article « tennis elbow » n'avait pas la ligne « une rigidité par cordage, pas par jauge » de la version FR : ajoutée pour que FR et EN disent la même chose.
- **Q-5** · de `tsa-redacteur` à `tsa-core` · 2026-10-10 — Information : la règle D (rigidité par jauge) et le lot 3 changeront de nouveau ces chiffres. `scripts/blog-covers/build-rigidite-figures.mts --check` échoue si un graphique ou un chiffre clé du texte ne colle plus à la base ; il peut être branché dans `audit:all` (propriétaire `tsa-measure`).
- **Q-6** · de `tsa-redacteur` à `tsa-pigiste` · 2026-10-10 — `npm run redaction:valeurs` était inutilisable sur `main` : `scripts/redaction/verifier-valeurs.mts` importe `racquetProfile`, retiré de `racquet-scoring.ts` par « aucune note déduite » (CLAUDE.md v2.3.1). Correctif minimal dans un commit isolé de cette PR (un champ `profil.*` est refusé, le reste est inchangé ; cinq cas négatifs rejetés). Le vérificateur est à `tsa-pigiste` : valider, ou le reprendre dans sa propre PR (le commit se retire sans effet sur le reste de la PR).
  - → `tsa-pigiste`, 2026-10-10 : **le correctif `4d128e0` me convient ; il reste tel quel dans #116.** (1) Il échoue fermé : toute ligne `profil.*` donne ECHEC et exit 1, au lieu de valider un chiffre qui n'existe plus. (2) Il ne relâche rien : `cordage`, `rcs` et les autres champs de raquette sont inchangés. (3) Il tient l'esprit de F2 : la règle d'origine refusait de mêler des profils de natures différentes ; le correctif refuse tout profil, mêlé ou non, puisque le site n'en affiche plus (CLAUDE.md v2.3.1) ; l'invariant (aucun profil de nature incertaine dans un article) est préservé, par un chemin plus strict. Essais sur 11 dossiers factices : anciennes valeurs NXT 152, NRG2 148 et Black Code 210 → ECHEC, exit 1 ; une ou deux lignes `profil.*` → ECHEC, exit 1 ; valeurs actuelles → OK, exit 0 ; indice RCS faux → ECHEC ; `ra` juste → OK ; « non publié » refusé quand la base a la donnée ; dossier sans bloc → exit 2. Trois suites, que je ferai sur **une branche dédiée de l'outil** (la PR est à ouvrir par l'orchestrateur ; aucune ne bloque #116 ; texte exact ci-dessous, essayé sur une copie jetable aussitôt supprimée : le dossier garde 173 valeurs et 0 écart, et le cas « 250 » pour 249,7 échoue) :
    - (a) l'en-tête est périmé : l'exemple `profil.controle` (l. 16) et la phrase « Les profils cités doivent tous être de même nature (dérivé des specs, ou combiné avec des avis) : sinon ECHEC (charte F2). » (l. 28-29) décrivent un contrôle qui n'existe plus. Remplacer la seconde par : « Aucun profil de raquette (`profil.*`) n'est accepté : le site n'en affiche plus depuis « aucune note de raquette déduite des caractéristiques » (CLAUDE.md v2.3.1), il n'y a donc plus de natures à mélanger (charte F2) ; toute ligne `profil.*` échoue. » et retirer la ligne d'exemple.
    - (b) le code mort ne peut plus se déclencher et laisse croire que la nature est contrôlée : retirer `const natures = new Map<string, string[]>();` (l. 147), le bloc `if (base.nature && subject.startsWith('raquette') && field.startsWith('profil.')) { … }` (l. 181-184), le bloc final `if (natures.size > 1) { … } else if (natures.size === 1) { … }` (l. 193-200) et simplifier la sortie OK en `${base.nature ?? ''}`.
    - (c) **trou de précision, qui touche cette PR** : `rigidite` n'a pas de `decimals`, donc la tolérance est de ±0,5 et « 250 » passe pour 249,7, « 243 » pour 242,9 (dossier factice d'une ligne, `cordage tecnifibre-black-code | rigidite | 250` : OK, exit 0, alors que la fiche affiche 249,7). Ajouter `const decimalsOf = (v: number | undefined) => (v === undefined ? 0 : (String(v).split('.')[1] ?? '').length);` et remplacer `case 'rigidite': return { value: s.stiffness };` par `case 'rigidite': return { value: s.stiffness, decimals: decimalsOf(s.stiffness) };` : « 250 » pour 249,7 échoue alors avec « écrire 1 décimale(s), comme la fiche ». Ce n'est qu'un durcissement. Je ne l'applique pas ici (le brief de cette passe limite mes écritures au dossier) ; les 542 contrôles stricts du § 5 ont tenu lieu de garde-fou pour ce lot.
    - Limite restante, antérieure au correctif : le vérificateur ne contrôle que les natures de profil ; il ne voit pas qu'on compare une note « éditoriale » à une note « harmonisée avec des avis de testeurs » (CLAUDE.md v2.3.8). Le tableau du § 4 des articles « polyester » ne cite que les 18 harmonisées, donc il n'y a pas d'écart ici. Et la panne a duré parce que le contrôle n'est pas dans `audit:all` : à proposer à `tsa-measure` (un `audit:redaction-valeurs` à cas négatifs et positif).

---

## 5. Fact-check final — `tsa-pigiste`

### Valeurs produit (contrôle automatique)

Chaque valeur produit affichée par l'article, FR et EN, y compris dans les
tableaux, telle qu'elle est écrite (les valeurs EN sont identiques, avec le point
décimal). Champs : voir l'en-tête de `scripts/redaction/verifier-valeurs.mts`.
Le bloc a été généré depuis la base puis relu ; la raquette citée par chaque ligne `rcs` n'est qu'un
support de calcul (RA 60 : `head-gravity-team`, RA 65 : `head-extreme-standard`, RA 70 : `head-instinct-pwr-115`) : les articles parlent de « RA 60, 65, 70 », pas de ces raquettes.

```valeurs-produit
# sujet                                   | champ           | valeur citée | où
# ===== Polyester et tennis elbow (FR + EN) : section 2, tableau des 20 polyesters à 200 lb/in ou moins (rigidité, puis indice RA 60 / 65 / 70 à 22 kg)
cordage toroline-o-toro-snap                 | rigidite | 164,6  | poly §2 tableau
rcs head-gravity-team + toroline-o-toro-snap @ 22                      | rcs | 23     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-o-toro-snap @ 22                  | rcs | 24     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-o-toro-snap @ 22                  | rcs | 26     | poly §2 tableau RA 70
cordage isospeed-cream                       | rigidite | 165    | poly §2 tableau
rcs head-gravity-team + isospeed-cream @ 22                            | rcs | 23     | poly §2 tableau RA 60
rcs head-extreme-standard + isospeed-cream @ 22                        | rcs | 24     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + isospeed-cream @ 22                        | rcs | 26     | poly §2 tableau RA 70
cordage toroline-o-toro                      | rigidite | 165,7  | poly §2 tableau
rcs head-gravity-team + toroline-o-toro @ 22                           | rcs | 23     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-o-toro @ 22                       | rcs | 24     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-o-toro @ 22                       | rcs | 26     | poly §2 tableau RA 70
cordage toroline-o-toro-spin                 | rigidite | 173,2  | poly §2 tableau
rcs head-gravity-team + toroline-o-toro-spin @ 22                      | rcs | 23     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-o-toro-spin @ 22                  | rcs | 25     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-o-toro-spin @ 22                  | rcs | 27     | poly §2 tableau RA 70
cordage solinco-hyper-g-heaven               | rigidite | 175    | poly §2 tableau
rcs head-gravity-team + solinco-hyper-g-heaven @ 22                    | rcs | 24     | poly §2 tableau RA 60
rcs head-extreme-standard + solinco-hyper-g-heaven @ 22                | rcs | 25     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + solinco-hyper-g-heaven @ 22                | rcs | 27     | poly §2 tableau RA 70
cordage toroline-absolute                    | rigidite | 180,6  | poly §2 tableau
rcs head-gravity-team + toroline-absolute @ 22                         | rcs | 24     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-absolute @ 22                     | rcs | 26     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-absolute @ 22                     | rcs | 28     | poly §2 tableau RA 70
cordage toroline-cash                        | rigidite | 182,9  | poly §2 tableau
rcs head-gravity-team + toroline-cash @ 22                             | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-cash @ 22                         | rcs | 26     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-cash @ 22                         | rcs | 28     | poly §2 tableau RA 70
cordage tecnifibre-razor-soft                | rigidite | 185    | poly §2 tableau
rcs head-gravity-team + tecnifibre-razor-soft @ 22                     | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + tecnifibre-razor-soft @ 22                 | rcs | 26     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + tecnifibre-razor-soft @ 22                 | rcs | 28     | poly §2 tableau RA 70
cordage toroline-super-toro                  | rigidite | 189,7  | poly §2 tableau
rcs head-gravity-team + toroline-super-toro @ 22                       | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-super-toro @ 22                   | rcs | 27     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-super-toro @ 22                   | rcs | 29     | poly §2 tableau RA 70
cordage luxilon-eco-rough                    | rigidite | 190    | poly §2 tableau
rcs head-gravity-team + luxilon-eco-rough @ 22                         | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + luxilon-eco-rough @ 22                     | rcs | 27     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + luxilon-eco-rough @ 22                     | rcs | 29     | poly §2 tableau RA 70
cordage luxilon-element                      | rigidite | 190    | poly §2 tableau
rcs head-gravity-team + luxilon-element @ 22                           | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + luxilon-element @ 22                       | rcs | 27     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + luxilon-element @ 22                       | rcs | 29     | poly §2 tableau RA 70
cordage toroline-snapper                     | rigidite | 190,9  | poly §2 tableau
rcs head-gravity-team + toroline-snapper @ 22                          | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-snapper @ 22                      | rcs | 27     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-snapper @ 22                      | rcs | 29     | poly §2 tableau RA 70
cordage head-hawk-power                      | rigidite | 195    | poly §2 tableau
rcs head-gravity-team + head-hawk-power @ 22                           | rcs | 26     | poly §2 tableau RA 60
rcs head-extreme-standard + head-hawk-power @ 22                       | rcs | 28     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + head-hawk-power @ 22                       | rcs | 29     | poly §2 tableau RA 70
cordage solinco-mach-10                      | rigidite | 195    | poly §2 tableau
rcs head-gravity-team + solinco-mach-10 @ 22                           | rcs | 26     | poly §2 tableau RA 60
rcs head-extreme-standard + solinco-mach-10 @ 22                       | rcs | 28     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + solinco-mach-10 @ 22                       | rcs | 29     | poly §2 tableau RA 70
cordage yonex-poly-tour-air                  | rigidite | 195    | poly §2 tableau
rcs head-gravity-team + yonex-poly-tour-air @ 22                       | rcs | 26     | poly §2 tableau RA 60
rcs head-extreme-standard + yonex-poly-tour-air @ 22                   | rcs | 28     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + yonex-poly-tour-air @ 22                   | rcs | 29     | poly §2 tableau RA 70
cordage luxilon-element-rough                | rigidite | 198,3  | poly §2 tableau
rcs head-gravity-team + luxilon-element-rough @ 22                     | rcs | 26     | poly §2 tableau RA 60
rcs head-extreme-standard + luxilon-element-rough @ 22                 | rcs | 28     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + luxilon-element-rough @ 22                 | rcs | 30     | poly §2 tableau RA 70
cordage solinco-hyper-g-soft                 | rigidite | 200    | poly §2 tableau
rcs head-gravity-team + solinco-hyper-g-soft @ 22                      | rcs | 26     | poly §2 tableau RA 60
rcs head-extreme-standard + solinco-hyper-g-soft @ 22                  | rcs | 28     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + solinco-hyper-g-soft @ 22                  | rcs | 30     | poly §2 tableau RA 70
cordage solinco-tour-bite-soft               | rigidite | 200    | poly §2 tableau
rcs head-gravity-team + solinco-tour-bite-soft @ 22                    | rcs | 26     | poly §2 tableau RA 60
rcs head-extreme-standard + solinco-tour-bite-soft @ 22                | rcs | 28     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + solinco-tour-bite-soft @ 22                | rcs | 30     | poly §2 tableau RA 70
cordage yonex-poly-air-rush                  | rigidite | 200    | poly §2 tableau
rcs head-gravity-team + yonex-poly-air-rush @ 22                       | rcs | 26     | poly §2 tableau RA 60
rcs head-extreme-standard + yonex-poly-air-rush @ 22                   | rcs | 28     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + yonex-poly-air-rush @ 22                   | rcs | 30     | poly §2 tableau RA 70
cordage yonex-poly-tour-spin                 | rigidite | 200    | poly §2 tableau
rcs head-gravity-team + yonex-poly-tour-spin @ 22                      | rcs | 26     | poly §2 tableau RA 60
rcs head-extreme-standard + yonex-poly-tour-spin @ 22                  | rcs | 28     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + yonex-poly-tour-spin @ 22                  | rcs | 30     | poly §2 tableau RA 70
# ===== section 3, liste des 19 polyesters à 240 lb/in ou plus (rigidité ; indice RA 65 à 22 kg donné par groupe ; RA 70 : bornes 34 et 37)
cordage babolat-rpm-blast                    | rigidite | 240    | poly §3 liste
rcs head-extreme-standard + babolat-rpm-blast @ 22                     | rcs | 32     | poly §3 indice du groupe, RA 65
cordage luxilon-original                     | rigidite | 240    | poly §3 liste
rcs head-extreme-standard + luxilon-original @ 22                      | rcs | 32     | poly §3 indice du groupe, RA 65
cordage tecnifibre-black-code-4s             | rigidite | 242,9  | poly §3 liste
rcs head-extreme-standard + tecnifibre-black-code-4s @ 22              | rcs | 33     | poly §3 indice du groupe, RA 65
cordage tecnifibre-razor-code                | rigidite | 242,9  | poly §3 liste
rcs head-extreme-standard + tecnifibre-razor-code @ 22                 | rcs | 33     | poly §3 indice du groupe, RA 65
cordage head-master                          | rigidite | 245    | poly §3 liste
rcs head-extreme-standard + head-master @ 22                           | rcs | 33     | poly §3 indice du groupe, RA 65
cordage luxilon-timo-117                     | rigidite | 245    | poly §3 liste
rcs head-extreme-standard + luxilon-timo-117 @ 22                      | rcs | 33     | poly §3 indice du groupe, RA 65
cordage solinco-confidential                 | rigidite | 245    | poly §3 liste
rcs head-extreme-standard + solinco-confidential @ 22                  | rcs | 33     | poly §3 indice du groupe, RA 65
cordage yonex-poly-tour-tough                | rigidite | 245    | poly §3 liste
rcs head-extreme-standard + yonex-poly-tour-tough @ 22                 | rcs | 33     | poly §3 indice du groupe, RA 65
cordage luxilon-ace-118                      | rigidite | 248    | poly §3 liste
rcs head-extreme-standard + luxilon-ace-118 @ 22                       | rcs | 33     | poly §3 indice du groupe, RA 65
cordage tecnifibre-black-code                | rigidite | 249,7  | poly §3 liste
rcs head-extreme-standard + tecnifibre-black-code @ 22                 | rcs | 34     | poly §3 indice du groupe, RA 65
cordage solinco-barb-wire                    | rigidite | 250    | poly §3 liste
rcs head-extreme-standard + solinco-barb-wire @ 22                     | rcs | 34     | poly §3 indice du groupe, RA 65
cordage weiss-cannon-ultra-cable             | rigidite | 250    | poly §3 liste
rcs head-extreme-standard + weiss-cannon-ultra-cable @ 22              | rcs | 34     | poly §3 indice du groupe, RA 65
cordage babolat-rpm-hurricane                | rigidite | 255    | poly §3 liste
rcs head-extreme-standard + babolat-rpm-hurricane @ 22                 | rcs | 34     | poly §3 indice du groupe, RA 65
cordage luxilon-ace-112                      | rigidite | 255    | poly §3 liste
rcs head-extreme-standard + luxilon-ace-112 @ 22                       | rcs | 34     | poly §3 indice du groupe, RA 65
cordage solinco-tour-bite                    | rigidite | 255    | poly §3 liste
rcs head-extreme-standard + solinco-tour-bite @ 22                     | rcs | 34     | poly §3 indice du groupe, RA 65
cordage babolat-pro-hurricane                | rigidite | 260    | poly §3 liste
rcs head-extreme-standard + babolat-pro-hurricane @ 22                 | rcs | 35     | poly §3 indice du groupe, RA 65
cordage solinco-tour-bite-diamond-rough      | rigidite | 260    | poly §3 liste
rcs head-extreme-standard + solinco-tour-bite-diamond-rough @ 22       | rcs | 35     | poly §3 indice du groupe, RA 65
cordage luxilon-4g-rough                     | rigidite | 262    | poly §3 liste
rcs head-extreme-standard + luxilon-4g-rough @ 22                      | rcs | 35     | poly §3 indice du groupe, RA 65
cordage luxilon-4g                           | rigidite | 265    | poly §3 liste
rcs head-extreme-standard + luxilon-4g @ 22                            | rcs | 35     | poly §3 indice du groupe, RA 65
rcs head-instinct-pwr-115 + babolat-rpm-blast @ 22                     | rcs | 34     | poly §3 borne basse RA 70
rcs head-instinct-pwr-115 + luxilon-4g @ 22                            | rcs | 37     | poly §3 borne haute RA 70
# ===== section 4, tableau confort ressenti / rigidité (rigidité et note de confort de la fiche, une décimale) et phrases voisines
cordage yonex-poly-tour-pro                  | rigidite | 220    | poly §4 tableau
cordage yonex-poly-tour-pro                  | confort  | 8,6    | poly §4 tableau, note de confort
cordage signum-pro-x-perience                | rigidite | 205    | poly §4 tableau
cordage signum-pro-x-perience                | confort  | 7,3    | poly §4 tableau, note de confort
cordage solinco-confidential                 | rigidite | 245    | poly §4 tableau
cordage solinco-confidential                 | confort  | 7,3    | poly §4 tableau, note de confort
cordage solinco-mach-10                      | rigidite | 195    | poly §4 tableau
cordage solinco-mach-10                      | confort  | 8,8    | poly §4 tableau, note de confort
cordage toroline-o-toro                      | rigidite | 165,7  | poly §4 tableau
cordage toroline-o-toro                      | confort  | 8,1    | poly §4 tableau, note de confort
cordage head-lynx-tour                       | rigidite | 210    | poly §4 phrase « plus rigide que le Head Lynx Tour »
cordage yonex-poly-tour-rev                  | rigidite | 205    | poly §4 note sous le tableau (égalité à 205 avec le Signum Pro X-Perience)
# ===== section 5, leviers (Luxilon 4G à 22 kg, RA 65 ; autre cadre ; autre tension ; autre cordage)
rcs head-extreme-standard + luxilon-4g @ 22                            | rcs | 35     | poly §5 point de départ
rcs head-extreme-standard + toroline-o-toro @ 22                       | rcs | 24     | poly §5 changer de cordage
rcs head-gravity-team + luxilon-4g @ 22                                | rcs | 33     | poly §5 changer de cadre, RA 60
rcs head-instinct-pwr-115 + luxilon-4g @ 22                            | rcs | 37     | poly §5 cadre RA 70
rcs head-extreme-standard + luxilon-4g @ 18                            | rcs | 33     | poly §5 baisser la tension de 4 kg
# ===== Cordage et tennis elbow (FR + EN) : tableau des 17 cordages (RA 65, 22 kg) — rigidité et indice de chaque ligne
cordage babolat-touch-vs                     | rigidite | 92     | tennis elbow tableau 17
rcs head-extreme-standard + babolat-touch-vs @ 22                      | rcs | 16     | tennis elbow tableau 17
cordage babolat-xcel                         | rigidite | 155    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-xcel @ 22                          | rcs | 23     | tennis elbow tableau 17
cordage tecnifibre-x-one-biphase             | rigidite | 160    | tennis elbow tableau 17
rcs head-extreme-standard + tecnifibre-x-one-biphase @ 22              | rcs | 24     | tennis elbow tableau 17
cordage tecnifibre-nrg2                      | rigidite | 164    | tennis elbow tableau 17
rcs head-extreme-standard + tecnifibre-nrg2 @ 22                       | rcs | 24     | tennis elbow tableau 17
cordage head-velocity-mlt                    | rigidite | 165    | tennis elbow tableau 17
rcs head-extreme-standard + head-velocity-mlt @ 22                     | rcs | 24     | tennis elbow tableau 17
cordage toroline-o-toro                      | rigidite | 165,7  | tennis elbow tableau 17
rcs head-extreme-standard + toroline-o-toro @ 22                       | rcs | 24     | tennis elbow tableau 17
cordage babolat-hybrid-rpm-blast-vs-touch    | rigidite | 168    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-hybrid-rpm-blast-vs-touch @ 22     | rcs | 25     | tennis elbow tableau 17
cordage wilson-nxt                           | rigidite | 173,7  | tennis elbow tableau 17
rcs head-extreme-standard + wilson-nxt @ 22                            | rcs | 25     | tennis elbow tableau 17
cordage tecnifibre-hybrid-razor-code-x-one   | rigidite | 180    | tennis elbow tableau 17
rcs head-extreme-standard + tecnifibre-hybrid-razor-code-x-one @ 22    | rcs | 26     | tennis elbow tableau 17
cordage prince-synthetic-gut                 | rigidite | 185    | tennis elbow tableau 17
rcs head-extreme-standard + prince-synthetic-gut @ 22                  | rcs | 26     | tennis elbow tableau 17
cordage luxilon-element                      | rigidite | 190    | tennis elbow tableau 17
rcs head-extreme-standard + luxilon-element @ 22                       | rcs | 27     | tennis elbow tableau 17
cordage babolat-hybrid-rpm-blast-xcel        | rigidite | 192    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-hybrid-rpm-blast-xcel @ 22         | rcs | 27     | tennis elbow tableau 17
cordage yonex-poly-tour-air                  | rigidite | 195    | tennis elbow tableau 17
rcs head-extreme-standard + yonex-poly-tour-air @ 22                   | rcs | 28     | tennis elbow tableau 17
cordage babolat-rpm-soft                     | rigidite | 205    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-rpm-soft @ 22                      | rcs | 29     | tennis elbow tableau 17
cordage luxilon-alu-power                    | rigidite | 230    | tennis elbow tableau 17
rcs head-extreme-standard + luxilon-alu-power @ 22                     | rcs | 31     | tennis elbow tableau 17
cordage babolat-rpm-blast                    | rigidite | 240    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-rpm-blast @ 22                     | rcs | 32     | tennis elbow tableau 17
cordage luxilon-4g                           | rigidite | 265    | tennis elbow tableau 17
rcs head-extreme-standard + luxilon-4g @ 22                            | rcs | 35     | tennis elbow tableau 17
# ===== leviers (point de départ Luxilon ALU Power à 22 kg, RA 65) : cordage, tension, cadre
rcs head-extreme-standard + luxilon-alu-power @ 18                     | rcs | 29     | tennis elbow leviers, tension 18 kg
rcs head-gravity-team + luxilon-alu-power @ 22                         | rcs | 30     | tennis elbow leviers, RA 60
```

Sortie de `npm run redaction:valeurs -- docs/redaction/coherence-chiffres-regle-c.md` :

```

> tennis-string-advisor@2.10.0 redaction:valeurs
> npx --yes tsx scripts/redaction/verifier-valeurs.mts docs/redaction/coherence-chiffres-regle-c.md

  OK    cordage toroline-o-toro-snap | rigidite | 164,6
  OK    rcs head-gravity-team + toroline-o-toro-snap @ 22 | rcs | 23
  OK    rcs head-extreme-standard + toroline-o-toro-snap @ 22 | rcs | 24
  OK    rcs head-instinct-pwr-115 + toroline-o-toro-snap @ 22 | rcs | 26
  OK    cordage isospeed-cream | rigidite | 165
  OK    rcs head-gravity-team + isospeed-cream @ 22 | rcs | 23
  OK    rcs head-extreme-standard + isospeed-cream @ 22 | rcs | 24
  OK    rcs head-instinct-pwr-115 + isospeed-cream @ 22 | rcs | 26
  OK    cordage toroline-o-toro | rigidite | 165,7
  OK    rcs head-gravity-team + toroline-o-toro @ 22 | rcs | 23
  OK    rcs head-extreme-standard + toroline-o-toro @ 22 | rcs | 24
  OK    rcs head-instinct-pwr-115 + toroline-o-toro @ 22 | rcs | 26
  OK    cordage toroline-o-toro-spin | rigidite | 173,2
  OK    rcs head-gravity-team + toroline-o-toro-spin @ 22 | rcs | 23
  OK    rcs head-extreme-standard + toroline-o-toro-spin @ 22 | rcs | 25
  OK    rcs head-instinct-pwr-115 + toroline-o-toro-spin @ 22 | rcs | 27
  OK    cordage solinco-hyper-g-heaven | rigidite | 175
  OK    rcs head-gravity-team + solinco-hyper-g-heaven @ 22 | rcs | 24
  OK    rcs head-extreme-standard + solinco-hyper-g-heaven @ 22 | rcs | 25
  OK    rcs head-instinct-pwr-115 + solinco-hyper-g-heaven @ 22 | rcs | 27
  OK    cordage toroline-absolute | rigidite | 180,6
  OK    rcs head-gravity-team + toroline-absolute @ 22 | rcs | 24
  OK    rcs head-extreme-standard + toroline-absolute @ 22 | rcs | 26
  OK    rcs head-instinct-pwr-115 + toroline-absolute @ 22 | rcs | 28
  OK    cordage toroline-cash | rigidite | 182,9
  OK    rcs head-gravity-team + toroline-cash @ 22 | rcs | 25
  OK    rcs head-extreme-standard + toroline-cash @ 22 | rcs | 26
  OK    rcs head-instinct-pwr-115 + toroline-cash @ 22 | rcs | 28
  OK    cordage tecnifibre-razor-soft | rigidite | 185
  OK    rcs head-gravity-team + tecnifibre-razor-soft @ 22 | rcs | 25
  OK    rcs head-extreme-standard + tecnifibre-razor-soft @ 22 | rcs | 26
  OK    rcs head-instinct-pwr-115 + tecnifibre-razor-soft @ 22 | rcs | 28
  OK    cordage toroline-super-toro | rigidite | 189,7
  OK    rcs head-gravity-team + toroline-super-toro @ 22 | rcs | 25
  OK    rcs head-extreme-standard + toroline-super-toro @ 22 | rcs | 27
  OK    rcs head-instinct-pwr-115 + toroline-super-toro @ 22 | rcs | 29
  OK    cordage luxilon-eco-rough | rigidite | 190
  OK    rcs head-gravity-team + luxilon-eco-rough @ 22 | rcs | 25
  OK    rcs head-extreme-standard + luxilon-eco-rough @ 22 | rcs | 27
  OK    rcs head-instinct-pwr-115 + luxilon-eco-rough @ 22 | rcs | 29
  OK    cordage luxilon-element | rigidite | 190
  OK    rcs head-gravity-team + luxilon-element @ 22 | rcs | 25
  OK    rcs head-extreme-standard + luxilon-element @ 22 | rcs | 27
  OK    rcs head-instinct-pwr-115 + luxilon-element @ 22 | rcs | 29
  OK    cordage toroline-snapper | rigidite | 190,9
  OK    rcs head-gravity-team + toroline-snapper @ 22 | rcs | 25
  OK    rcs head-extreme-standard + toroline-snapper @ 22 | rcs | 27
  OK    rcs head-instinct-pwr-115 + toroline-snapper @ 22 | rcs | 29
  OK    cordage head-hawk-power | rigidite | 195
  OK    rcs head-gravity-team + head-hawk-power @ 22 | rcs | 26
  OK    rcs head-extreme-standard + head-hawk-power @ 22 | rcs | 28
  OK    rcs head-instinct-pwr-115 + head-hawk-power @ 22 | rcs | 29
  OK    cordage solinco-mach-10 | rigidite | 195
  OK    rcs head-gravity-team + solinco-mach-10 @ 22 | rcs | 26
  OK    rcs head-extreme-standard + solinco-mach-10 @ 22 | rcs | 28
  OK    rcs head-instinct-pwr-115 + solinco-mach-10 @ 22 | rcs | 29
  OK    cordage yonex-poly-tour-air | rigidite | 195
  OK    rcs head-gravity-team + yonex-poly-tour-air @ 22 | rcs | 26
  OK    rcs head-extreme-standard + yonex-poly-tour-air @ 22 | rcs | 28
  OK    rcs head-instinct-pwr-115 + yonex-poly-tour-air @ 22 | rcs | 29
  OK    cordage luxilon-element-rough | rigidite | 198,3
  OK    rcs head-gravity-team + luxilon-element-rough @ 22 | rcs | 26
  OK    rcs head-extreme-standard + luxilon-element-rough @ 22 | rcs | 28
  OK    rcs head-instinct-pwr-115 + luxilon-element-rough @ 22 | rcs | 30
  OK    cordage solinco-hyper-g-soft | rigidite | 200
  OK    rcs head-gravity-team + solinco-hyper-g-soft @ 22 | rcs | 26
  OK    rcs head-extreme-standard + solinco-hyper-g-soft @ 22 | rcs | 28
  OK    rcs head-instinct-pwr-115 + solinco-hyper-g-soft @ 22 | rcs | 30
  OK    cordage solinco-tour-bite-soft | rigidite | 200
  OK    rcs head-gravity-team + solinco-tour-bite-soft @ 22 | rcs | 26
  OK    rcs head-extreme-standard + solinco-tour-bite-soft @ 22 | rcs | 28
  OK    rcs head-instinct-pwr-115 + solinco-tour-bite-soft @ 22 | rcs | 30
  OK    cordage yonex-poly-air-rush | rigidite | 200
  OK    rcs head-gravity-team + yonex-poly-air-rush @ 22 | rcs | 26
  OK    rcs head-extreme-standard + yonex-poly-air-rush @ 22 | rcs | 28
  OK    rcs head-instinct-pwr-115 + yonex-poly-air-rush @ 22 | rcs | 30
  OK    cordage yonex-poly-tour-spin | rigidite | 200
  OK    rcs head-gravity-team + yonex-poly-tour-spin @ 22 | rcs | 26
  OK    rcs head-extreme-standard + yonex-poly-tour-spin @ 22 | rcs | 28
  OK    rcs head-instinct-pwr-115 + yonex-poly-tour-spin @ 22 | rcs | 30
  OK    cordage babolat-rpm-blast | rigidite | 240
  OK    rcs head-extreme-standard + babolat-rpm-blast @ 22 | rcs | 32
  OK    cordage luxilon-original | rigidite | 240
  OK    rcs head-extreme-standard + luxilon-original @ 22 | rcs | 32
  OK    cordage tecnifibre-black-code-4s | rigidite | 242,9
  OK    rcs head-extreme-standard + tecnifibre-black-code-4s @ 22 | rcs | 33
  OK    cordage tecnifibre-razor-code | rigidite | 242,9
  OK    rcs head-extreme-standard + tecnifibre-razor-code @ 22 | rcs | 33
  OK    cordage head-master | rigidite | 245
  OK    rcs head-extreme-standard + head-master @ 22 | rcs | 33
  OK    cordage luxilon-timo-117 | rigidite | 245
  OK    rcs head-extreme-standard + luxilon-timo-117 @ 22 | rcs | 33
  OK    cordage solinco-confidential | rigidite | 245
  OK    rcs head-extreme-standard + solinco-confidential @ 22 | rcs | 33
  OK    cordage yonex-poly-tour-tough | rigidite | 245
  OK    rcs head-extreme-standard + yonex-poly-tour-tough @ 22 | rcs | 33
  OK    cordage luxilon-ace-118 | rigidite | 248
  OK    rcs head-extreme-standard + luxilon-ace-118 @ 22 | rcs | 33
  OK    cordage tecnifibre-black-code | rigidite | 249,7
  OK    rcs head-extreme-standard + tecnifibre-black-code @ 22 | rcs | 34
  OK    cordage solinco-barb-wire | rigidite | 250
  OK    rcs head-extreme-standard + solinco-barb-wire @ 22 | rcs | 34
  OK    cordage weiss-cannon-ultra-cable | rigidite | 250
  OK    rcs head-extreme-standard + weiss-cannon-ultra-cable @ 22 | rcs | 34
  OK    cordage babolat-rpm-hurricane | rigidite | 255
  OK    rcs head-extreme-standard + babolat-rpm-hurricane @ 22 | rcs | 34
  OK    cordage luxilon-ace-112 | rigidite | 255
  OK    rcs head-extreme-standard + luxilon-ace-112 @ 22 | rcs | 34
  OK    cordage solinco-tour-bite | rigidite | 255
  OK    rcs head-extreme-standard + solinco-tour-bite @ 22 | rcs | 34
  OK    cordage babolat-pro-hurricane | rigidite | 260
  OK    rcs head-extreme-standard + babolat-pro-hurricane @ 22 | rcs | 35
  OK    cordage solinco-tour-bite-diamond-rough | rigidite | 260
  OK    rcs head-extreme-standard + solinco-tour-bite-diamond-rough @ 22 | rcs | 35
  OK    cordage luxilon-4g-rough | rigidite | 262
  OK    rcs head-extreme-standard + luxilon-4g-rough @ 22 | rcs | 35
  OK    cordage luxilon-4g | rigidite | 265
  OK    rcs head-extreme-standard + luxilon-4g @ 22 | rcs | 35
  OK    rcs head-instinct-pwr-115 + babolat-rpm-blast @ 22 | rcs | 34
  OK    rcs head-instinct-pwr-115 + luxilon-4g @ 22 | rcs | 37
  OK    cordage yonex-poly-tour-pro | rigidite | 220
  OK    cordage yonex-poly-tour-pro | confort | 8,6
  OK    cordage signum-pro-x-perience | rigidite | 205
  OK    cordage signum-pro-x-perience | confort | 7,3
  OK    cordage solinco-confidential | rigidite | 245
  OK    cordage solinco-confidential | confort | 7,3
  OK    cordage solinco-mach-10 | rigidite | 195
  OK    cordage solinco-mach-10 | confort | 8,8
  OK    cordage toroline-o-toro | rigidite | 165,7
  OK    cordage toroline-o-toro | confort | 8,1
  OK    cordage head-lynx-tour | rigidite | 210
  OK    cordage yonex-poly-tour-rev | rigidite | 205
  OK    rcs head-extreme-standard + luxilon-4g @ 22 | rcs | 35
  OK    rcs head-extreme-standard + toroline-o-toro @ 22 | rcs | 24
  OK    rcs head-gravity-team + luxilon-4g @ 22 | rcs | 33
  OK    rcs head-instinct-pwr-115 + luxilon-4g @ 22 | rcs | 37
  OK    rcs head-extreme-standard + luxilon-4g @ 18 | rcs | 33
  OK    cordage babolat-touch-vs | rigidite | 92
  OK    rcs head-extreme-standard + babolat-touch-vs @ 22 | rcs | 16
  OK    cordage babolat-xcel | rigidite | 155
  OK    rcs head-extreme-standard + babolat-xcel @ 22 | rcs | 23
  OK    cordage tecnifibre-x-one-biphase | rigidite | 160
  OK    rcs head-extreme-standard + tecnifibre-x-one-biphase @ 22 | rcs | 24
  OK    cordage tecnifibre-nrg2 | rigidite | 164
  OK    rcs head-extreme-standard + tecnifibre-nrg2 @ 22 | rcs | 24
  OK    cordage head-velocity-mlt | rigidite | 165
  OK    rcs head-extreme-standard + head-velocity-mlt @ 22 | rcs | 24
  OK    cordage toroline-o-toro | rigidite | 165,7
  OK    rcs head-extreme-standard + toroline-o-toro @ 22 | rcs | 24
  OK    cordage babolat-hybrid-rpm-blast-vs-touch | rigidite | 168
  OK    rcs head-extreme-standard + babolat-hybrid-rpm-blast-vs-touch @ 22 | rcs | 25
  OK    cordage wilson-nxt | rigidite | 173,7
  OK    rcs head-extreme-standard + wilson-nxt @ 22 | rcs | 25
  OK    cordage tecnifibre-hybrid-razor-code-x-one | rigidite | 180
  OK    rcs head-extreme-standard + tecnifibre-hybrid-razor-code-x-one @ 22 | rcs | 26
  OK    cordage prince-synthetic-gut | rigidite | 185
  OK    rcs head-extreme-standard + prince-synthetic-gut @ 22 | rcs | 26
  OK    cordage luxilon-element | rigidite | 190
  OK    rcs head-extreme-standard + luxilon-element @ 22 | rcs | 27
  OK    cordage babolat-hybrid-rpm-blast-xcel | rigidite | 192
  OK    rcs head-extreme-standard + babolat-hybrid-rpm-blast-xcel @ 22 | rcs | 27
  OK    cordage yonex-poly-tour-air | rigidite | 195
  OK    rcs head-extreme-standard + yonex-poly-tour-air @ 22 | rcs | 28
  OK    cordage babolat-rpm-soft | rigidite | 205
  OK    rcs head-extreme-standard + babolat-rpm-soft @ 22 | rcs | 29
  OK    cordage luxilon-alu-power | rigidite | 230
  OK    rcs head-extreme-standard + luxilon-alu-power @ 22 | rcs | 31
  OK    cordage babolat-rpm-blast | rigidite | 240
  OK    rcs head-extreme-standard + babolat-rpm-blast @ 22 | rcs | 32
  OK    cordage luxilon-4g | rigidite | 265
  OK    rcs head-extreme-standard + luxilon-4g @ 22 | rcs | 35
  OK    rcs head-extreme-standard + luxilon-alu-power @ 18 | rcs | 29
  OK    rcs head-gravity-team + luxilon-alu-power @ 22 | rcs | 30

173 valeur(s) contrôlée(s), 0 écart(s)
```

### Passe du pigiste — 2026-10-10

Circuit court, tête de PR `e67d64e`, worktree `coherence-chiffres-factcheck`. Seul ce dossier est modifié par cette passe. Les valeurs de fiche sont celles de `src/data/` de la branche (socle : PR #110).

**Commandes exécutées**

| Commande | Résultat |
|---|---|
| `npm run redaction:valeurs -- docs/redaction/coherence-chiffres-regle-c.md` | **exit 0** · « 173 valeur(s) contrôlée(s), 0 écart(s) » · sortie identique à celle collée ci-dessus (diff vide, hors lignes vides) · le bloc couvre toutes les valeurs de fiche affichées : 80 (tableau des 20) + 40 (liste des 19) + 12 (§ 4) + 5 (§ 5) + 34 (tableau des 17) + 2 (leviers) |
| scripts du pigiste A à E (hors dépôt) | exit 0 · extraits ci-dessous |
| `npx --yes tsx scripts/blog-covers/build-rigidite-figures.mts --check` (outil du rédacteur, à titre de recoupement) | exit 0 · « figures et chiffres du texte conformes à la base » |
| `npm run audit:blog-images` · `npm run audit:blog-funnel` | exit 0 · exit 0 |
| JSON-LD des 4 articles et du guide ; liens internes ; nombres FR et EN | JSON-LD valide, `dateModified` 2026-10-10 sur les 5 pages, réponses de FAQ identiques au texte visible (3, 3, 5 et 4 réponses, 0 écart) ; 181 liens internes, 0 cassé ; nombres FR et EN identiques, hors conversions en lb, sommaire, présentation de l'auteur, dates d'en-tête et deux phrases propres à la version FR de l'article « cordage et tennis elbow » (Touch VS à 92, « 140 à 160 » de la version de décembre 2025) |

Les scripts A à E lisent `src/data/strings-database.ts` (`stringsDatabase`, `calculateRCS`), `string-stiffness-provenance.ts`, `tester-ratings.ts`, `src/lib/advanced-rcs.ts` (seuils lus par un motif à moi) et le relevé TWU brut, dont j'ai recalculé le sha256 (`01c07cc…8872`, celui qu'enregistrent #110 et #113). A : effectifs, médianes, listes, graphique, tableau des 17, leviers. B : les 18 polyesters à avis de testeurs, rangs du § 4, statuts de provenance. C : recoupement des fiches affichées avec le relevé TWU. D : les quatre SVG relus contre la base. E : tableaux et listes des articles relus à la décimale. Ils ne sont pas versionnés (le brief limite mes écritures à ce dossier).

**Sorties (extraits)**

```
A1 Polyester n=102 164.6–265 médiane 217.3 (valeurs centrales 216.6 et 218) · Multifilament n=45 143–180 médiane 162 · Hybrid 9 158–192 (175) · Natural Gut 7 88–100 (95) · Synthetic 16 165–185 (180) · total 179
A2 polyesters <=200 : 20 · >=240 : 19 · entre : 63 · liste des 20 : rangs 1 à 17 avec égalités (10,10 · 13,13,13 · 17 x4) · sur les 19, RA 65 : 32 (240 x2) · 33 (242.9/245/248 x7) · 34 (249.7/250/255 x6) · 35 (260/262/265 x4) ; RA 70 : min 34, max 37, >=35 : 15/19
A4 indice RA 65, 22 kg : <32 : 74 · 32-34 : 24 · >=35 : 4 · >=32 : 28 ; seuils lus : 32 / 35 ; l'indice atteint 20/25/30/35 à 121.14 / 166.97 / 212.8 / 258.64 lb/in, et 32 à 231.14
A4 coefficients : 0.10909 par lb/in · 0.5 par kg · 0.34286 par point de RA ; écart 4G (265) – O-Toro Snap (164.6) : RA 60 = 10 | RA 65 = 11 | RA 70 = 11
A5 départ ALU Power (RA 65, 22 kg) = 31 -> O-Toro 24 (-7) · NXT 25 (-6) · 18 kg 29 (-2) · RA 60 30 (-1) ; 4G : 35 -> RA 60 33 · RA 70 37 · 18 kg 33
A5 tableau des 17 : multifilaments 23,24,24,24,25 · hybrides 25,26,27 · Element / Poly Tour Air / RPM Soft 27,28,29 · boyau 16 · ordre croissant
A7 multifilaments plus souples que 164.6 : 28/45 · sous la médiane des polyesters : 45/45 · boyaux : 7/7 · paires (multifilament, polyester) en faveur du multifilament : 4531/4590 (98.7 %) · polyesters plus souples que le NXT (173.7) : 4
B1 STRING_TESTER_RATINGS : 18 entrées, 18 polyesters, rigidité moyenne 222.4
B2 souplesse sur 18 : O-Toro 1 · Mach-10 2 · Signum 3 · Poly Tour Pro 10 · Confidential 15 ; confort : Mach-10 1 · Poly Tour Pro 2 · O-Toro 3 · Signum et Confidential 10 ex aequo
B4 string-stiffness-provenance : 17 « appliquee » (11 polyesters, 6 multifilaments : volkl-power-fiber-ii, tecnifibre-nrg2, wilson-nxt, babolat-xcel-power, babolat-origin, tecnifibre-xr3), 2 « quarantaine » ; 17/17 égales à la mesure de la jauge appliquée, 12/12 « plus-rigide » égales au maximum des mesures
B5 aucun des 18 polyesters à avis de testeurs n'a de ligne de provenance
C  fiches avec au moins une mesure TWU aux jauges de la fiche : 104 ; TWU plus rigide que la base : 25 · plus souple : 55 · égal : 24 (PR #110 : 103 · 25 · 54 · 24) ; les 54 et les 25 de #110 sont tous retrouvés ; en plus : wilson-optimus-16 (178 -> 140)
D  SVG polyesters FR et EN : 102/102 titres, abscisses et couleurs conformes · familles FR et EN : 5/5 (effectif, minimum, médiane, maximum) · légendes 74 / 24 / 4 et médiane 217,3 / 217.3
E  tableaux et listes, FR + EN : 542 contrôles stricts, 0 écart (identité et ordre des lignes, rigidité à la décimale, indices RA 60/65/70, rangs avec égalités, †, groupes de la liste des 19, tableau des 17)
```

**Faits du § 2.** F1 à F13 : **confirmés** par recalcul indépendant. F7 (règle de jauge) est confirmée par le code et par `string-stiffness-provenance.ts` ; la page TWU n'a pas été rouverte en direct (voir « Non vérifié »). F8 est complété par F17. Faits ajoutés par ce fact-check (à reporter au § 2 à la prochaine passe du pigiste) :

| # | Énoncé | Valeur | Niveau | Source | Statut |
|---|---|---|---|---|---|
| F14 | Multifilaments et boyaux face aux polyesters | 28 multifilaments sur 45 sont plus souples que le polyester le plus souple (164,6) ; 45 sur 45 sont sous la médiane des polyesters (217,3) ; les 7 boyaux (88 à 100) sont tous plus souples ; dans 4 531 des 4 590 paires (multifilament, polyester), soit 98,7 %, le multifilament est le plus souple ; le NXT (173,7) est plus rigide que 4 polyesters (O-Toro Snap, Isospeed Cream, O-Toro, O-Toro Spin) et plus souple que 98 | BASE | script A | confirmé |
| F15 | Les fiches affichées face au relevé TWU (aux jauges de la fiche ; C = mesure la plus rigide) | tableau ci-dessous | L1 contre BASE | relevé brut ; PR #110 § 5 et 6 | **divergent** (→ `tsa-core`, déjà connu : GO de Pierre en attente) |
| F16 | Taille des écarts fiche / TWU | 80 fiches non alignées ont une mesure aux jauges de la fiche : 25 plus rigides que la base, 55 plus souples ; écart absolu médian 17,8 lb/in (environ 1,9 point d'indice) ; 61 écarts à 10 lb/in ou plus, 32 à 20 ou plus, 7 à 50 ou plus ; extrêmes −75,1 (Weiss Cannon Ultra Cable) et +46,0 (Babolat Revenge), soit 8,2 points d'indice. **Indicatif, non proposé** : si les 25 hausses étaient appliquées, 15 polyesters seraient à 200 ou moins, 21 à 240 ou plus, la médiane serait 220 et le maximum 286,9 ; si hausses et baisses l'étaient, 31, 12, 210 et de 154,9 à 286,9 | BASE + L1 | script C | divergent (→ `tsa-core`) |
| F17 | Tecnifibre Black Code par jauge (TWU, 51 lbs, « Fast ») | 1,18 = 202,9 · 1,24 = 236 · 1,28 = 249,7 · 1,32 = 210,3 lb/in ; écart maximal 46,8 lb/in = 5,1 points (46,8 × 0,10909) | L1 | `data/reference/twu-releve-complet.json` (#110) ; `data/reference/twu-releve-complet.json` (#113, sha256 du brut identique) ; relevé brut local | confirmé (complète F8) |
| F18 | Dans le relevé, la jauge la plus fine n'est pas toujours la plus souple | NRG2 : 1,24 = 164 > 1,32 = 158,3 · Babolat Origin : 1,25 = 171,5 > 1,30 = 166,9 · Diadem Solstice Power : 1,25 = 209,2 > 1,30 = 202,9 · Black Code : 1,28 = 249,7 > 1,32 = 210,3 | L1 | `string-stiffness-provenance.ts` | confirmé |
| F19 | Coefficients de la formule du site | 0,10909 point par lb/in · 0,5 par kg · 0,34286 par point de RA ; écart entre le 4G (265) et l'O-Toro Snap (164,6) : 10 à RA 60, 11 à RA 65 et RA 70 (10,95 avant arrondi) | BASE | `calculateRCS` | confirmé |
| F20 | Rangs du § 4 (sur 18 ; égalité de rigidité départagée par ordre alphabétique) | souplesse : O-Toro 1er, Mach-10 2e, Signum 3e, Poly Tour Pro 10e, Confidential 15e ; confort : Mach-10 1er, Poly Tour Pro 2e, O-Toro 3e, Signum et Confidential 10e ex aequo ; rigidité moyenne des 18 : 222,4 | BASE | script B | confirmé |
| F21 | Les 18 polyesters à avis de testeurs ne sont pas touchés (confirme F12) | aucun n'a de ligne dans `string-stiffness-provenance.ts` | BASE | script B | confirmé |
| F22 | Fiches alignées sur une mesure TWU | 25 : 17 « appliquee » (11 polyesters, 6 multifilaments) et 8 Toroline à jauge unique, soit 19 des 102 polyesters ; 13 portent † dans les articles (7 Toroline, Element Rough, Black Code 4S, Razor Code, Black Code, NRG2, NXT) ; aucune fiche des tableaux, listes et phrases sans † n'est alignée (les points du graphique n'ont pas de †) | BASE | scripts B, C, E | confirmé |
| F23 | Boyaux du catalogue | Babolat Touch Tonic 88 · Babolat Touch VS 92 · Tecnifibre TGut 92 · Head Natural Gut 95 · Yonex Natural Gut 95 · Luxilon Natural Gut 98 · Wilson Natural Gut 100 | BASE | script A | confirmé |

Détail de F15 (nombre de fiches de chaque liste affichée par l'article selon leur rapport au relevé TWU) :

| Liste de l'article | Alignées (†) | TWU plus rigide que la fiche | TWU plus souple que la fiche | Sans mesure |
|---|---|---|---|---|
| 20 plus souples (≤ 200) | 8 | 6 : Isospeed Cream 165 → 177,7 · Razor Soft 185 → 212 · Element 190 → 208 · Hawk Power 195 → 203,5 · Mach-10 195 → 222,3 · Poly Tour Spin 200 → 213,7 | 3 : Poly Tour Air 195 → 154,9 · Hyper-G Soft 200 → 172 · Tour Bite Soft 200 → 192 | 3 |
| 19 plus fermes (≥ 240) | 3 | 1 : 4G 265 → 286,9 | 9 : Poly Tour Tough 245 → 193,7 · Diamond Rough 260 → 192,6 · Weiss Cannon Ultra Cable 250 → 174,9 · Pro Hurricane 260 → 204 · 4G Rough 262 → 216 · Barb Wire 250 → 214,3 · Confidential 245 → 222,3 · Tour Bite 255 → 237,7 · RPM Blast 240 → 236,6 | 6 |
| Tableau des 17 | 3 (NRG2, O-Toro, NXT) | 3 : X-One Biphase 160 → 166,9 · Element 190 → 208 · 4G 265 → 286,9 | 5 : Xcel 155 → 150,9 · Velocity MLT 165 → 153,2 · Poly Tour Air 195 → 154,9 · RPM Soft 205 → 154,9 · RPM Blast 240 → 236,6 | 6 |
| § 4 (5 lignes et le Head Lynx Tour) | 1 (O-Toro) | 3 : Signum 205 → 224,6 · Mach-10 195 → 222,3 · Head Lynx Tour 210 → 228,6 | 2 : Poly Tour Pro 220 → 188,6 · Confidential 245 → 222,3 | 1 (Poly Tour Rev) |

Couverture des jauges de la fiche : complète pour 4G Rough (1 sur 1), Poly Tour Tough (1 sur 1), Diamond Rough (3 sur 3), Barb Wire (3 sur 3), Tour Bite (4 sur 4), RPM Blast (4 sur 4), Element (2 sur 2) ; partielle ailleurs (Weiss 1 sur 2, Confidential 1 sur 4, Pro Hurricane 3 sur 4, Poly Tour Pro 1 sur 4, Mach-10 1 sur 4, Signum 1 sur 3…) : C est alors un plancher de la rigidité maximale réelle, la baisse est une hypothèse et la hausse un minimum (PR #110 § 5, groupe C).

### Affirmations

Les valeurs agrégées (effectifs, extrêmes, médianes, effectifs du graphique) ne se vérifient pas ligne à ligne : elles sont recalculées par `build-rigidite-figures.mts --facts` (F1 à F5, F10, F11) et contrôlées dans le texte par `--check`.

| # | Phrase de l'article (FR · EN) | Fait n° | Conforme | Correction demandée |
|---|---|---|---|---|
| A1 | « Nos 102 polyesters vont de 164,6 à 265 lb/in (médiane 217,3) » · « Our 102 polys range from 164.6 to 265 lb/in (median 217.3) » | F1, F2 | oui — recalculé : 102 ; 164,6 (O-Toro Snap) ; 265 (4G) ; médiane 217,3 (moyenne de 216,6 et 218) | — |
| A2 | « Les 20 polyesters les plus souples… Sur 102, ils sont 20 » · « The 20 softest… Out of 102, there are 20 » ; tableau de 20 lignes, rangs 1 à 17 avec égalités | F3 | oui — 20 lignes dans l'ordre (rigidité puis nom), rangs 1 à 17 avec égalités, 20 rigidités à la décimale et 60 indices recalculés ; les 8 † du tableau sont des fiches alignées | — |
| A3 | « 19 polyesters… à 240 lb/in ou plus » ; groupes « 240 (32) », « 242,9 à 248 (33) », « 249,7 à 255 (34) », « 260 à 265 (35) » | F3 | oui — 19 fiches : groupes de 2, 7, 6 et 4 aux indices 32, 33, 34 et 35 (RA 65) ; fourchettes de rigidité exactes | — |
| A4 | « sur un cadre de RA 70, de 34 à 37, et la plupart atteignent alors le seuil « très ferme » (35 et plus) » (remplace « au-delà du seuil », inexact à 34) | F3 | oui — 34 à 37 ; 15 des 19 à 35 ou plus | — |
| A5 | « Yonex Poly Tour Pro… juste au-dessus de la médiane du catalogue (217,3 lb/in) » | F2 | oui — 220 contre 217,3 (+2,7) | — (réserve D-1 : TWU 188,6 sur 1 jauge de 4) |
| A6 | Tableau des familles : multifilament 45, 143 – 180, 162 ; polyester 102, 164,6 – 265, 217,3 ; « 179 fiches cordages, état au 10 octobre 2026 » ; « multifilaments de 143 à 180 » (4 occurrences par article, JSON-LD compris) | F1, F4, F5 | oui — 45, 143–180, 162 ; 102, 164,6–265, 217,3 ; 7, 88–100, 95 ; 9, 158–192, 175 ; 16, 165–185, 180 ; total 179 ; JSON-LD identique au texte visible | — |
| A7 | Tableau des 17 cordages : NRG2 164 (24), NXT 173,7 (25), ordre par rigidité ; « les multifilaments se regroupent entre 23 et 25 » (Xcel 23, X-One 24, NRG2 24, Velocity MLT 24, NXT 25) ; « RCS 23 à 25 dans la raquette d'exemple » | F4 | oui — 17 rigidités et 17 indices, ordre croissant ; multifilaments 23 à 25, hybrides 25 à 27, boyau 16 | — (réserve Q-1 sur la ligne Razor Code + X-One) |
| A8 | Leviers : ALU Power 31 → O-Toro 24 (−7), → NXT 25 (−6), → tension 18 kg 29 (−2), → RA 60 30 (−1) ; ordre inversé par rapport à la version du 9/10 ; « de 31 à 25 » dans « L'essentiel » | F4 | oui — −7, −6, −2, −1 ; « de 31 à 25 » ; O-Toro avant NXT | — |
| A9 | « † Rigidité alignée sur une mesure du laboratoire TWU : quand la fiche regroupe plusieurs jauges, c'est celle de la jauge la plus rigide que TWU a mesurée » ; † posé sur les 7 Toroline et Element Rough (jauge unique), Black Code 4S, Razor Code, Black Code (plusieurs jauges), et, dans le tableau des 17, NRG2, NXT et O-Toro | F7 | oui — 13 † distincts, tous des fiches alignées (F22) ; aucune fiche des tableaux et listes sans † n'est alignée | — |
| A10 | « Cela peut surestimer la rigidité d'une jauge plus fine : l'indice RCS peut alors sembler sévère pour cette jauge. C'est voulu, par prudence pour le bras. Pour votre montage exact, c'est l'indice du configurateur qui fait foi. » | F7 | partiel — l'intention est défendue (F7) ; « une jauge plus fine » n'est pas vrai de toute fiche † (F18) | C-3 |
| A11 | « le Tecnifibre Black Code mesure 202,9 lb/in en 1.18 et 249,7 lb/in en 1.28, soit environ 5 points d'indice RCS d'écart » | F8 | oui — F8 et F17 (TWU, 51 lbs, « Fast » ; 46,8 lb/in = 5,1 points) | — (O-2) |
| A12 | « Seules celles marquées † sont alignées sur une mesure de laboratoire identifiée (TWU) ; les autres ne le sont pas et peuvent s'en écarter, dans un sens comme dans l'autre » | F7 | oui à la lettre — 25 fiches plus rigides et 55 plus souples que la base (F16) ; portée sous-dite | — (voir D-1) |
| A13 | « seuls 6 de nos 45 multifilaments ont une rigidité alignée sur une mesure de laboratoire, et un set prémonté n'a pas de mesure propre dans notre base » | F6, F13 | oui — 6 sur 45 (F6) ; aucun set hybride n'a de ligne TWU | — |
| A14 | « En général, un multifilament ou un boyau reste plus prudent qu'un polyester » (FAQ, texte visible et JSON-LD) · « In general, a multifilament or natural gut remains a more prudent choice than a polyester » | F11 | oui — F11 et F14 : 98,7 % des paires ; 45 sur 45 sous la médiane des polyesters ; 7 boyaux sur 7 | — |
| A15 | « Même le plus souple de ce tableau reste un monofilament : en général plus ferme qu'un multifilament, et nettement plus ferme qu'un boyau » | F11 | oui — F11 et F14 : 28 multifilaments sur 45 (62 %) plus souples que 164,6 ; 7 boyaux sur 7 ; « en général » est la limite | — |
| A16 | Graphiques : un point par polyester ; zones 200 et 240 (20 et 19) ; médiane 217,3 ; repères RCS 32 et 35 situés à 231,1 et 258,6 lb/in pour RA 65, 22 kg ; 74 sous 32, 24 de 32 à 34, 4 à 35 ou plus ; minimum, médiane et maximum par famille | F2 à F5, F9, F10 | oui pour les données — 102 points, 74 / 24 / 4, 231,1 et 258,6, familles (F2 à F5, F10) ; la légende « et les mesures TWU » surévalue la part de TWU (F22) | C-4 |
| A17 | Dates : `dateModified` 2026-10-10 (quatre articles et guide), `article:modified_time` 2026-10-10 là où il existe, date visible « mis à jour le 10 octobre 2026 » | CHARTE F11 | oui — 5 pages à `dateModified` 2026-10-10 ; `article:modified_time` 2026-10-10 sur l'article « cordage » FR, seul à en avoir un ; dates visibles posées | — |

### Test de glissance

À dresser par `tsa-pigiste` (étape 4a). Candidats relevés par le rédacteur :

| Affirmation contestable | Par qui (fabricant · cordeur · médecin) | Défense (fait n°) ou « sans défense » |
|---|---|---|
| « C'est voulu, par prudence pour le bras » (sur-alerte sur les jauges fines) | cordeur | F7 : décision de Pierre du 10/10/2026, consignée dans la PR #110 et `string-stiffness-provenance.ts` |
| « En général, un multifilament ou un boyau reste plus prudent qu'un polyester » | cordeur, médecin | F11 (tendance chiffrée) ; l'article ne dit pas « toujours » et renvoie au configurateur |
| Black Code 202,9 lb/in en 1.18 et 249,7 lb/in en 1.28 | fabricant | F8 : une mesure TWU par jauge, conditions publiées (51 lbs, balayage « Fast ») ; l'article ne présente pas la valeur comme exacte à la décimale |
| Les valeurs non marquées † « peuvent s'écarter » de la mesure, dans les deux sens | fabricant | F7 ; PR #110 § 5 et § 6 |

**Verdict du pigiste (étape 4a, 2026-10-10).** Les quatre candidats du rédacteur sont repris (G7, G6, G8, G10) et leurs défenses confirmées. « Défendue » : un fait du § 2 ou du présent § 5 soutient la phrase telle qu'elle est écrite. « Sous réserve » : défendue par F1 (l'article suit la base), mais une mesure de laboratoire que l'article cite lui-même (TWU) dit autre chose pour la fiche nommée ; voir D-1.

| # | Affirmation contestable (FR · EN) | Par qui | Défense (fait n°) | Verdict |
|---|---|---|---|---|
| G1 | « Nos 102 polyesters vont de 164,6 à 265 lb/in (médiane 217,3) » | fabricant | F1, F2 | défendue : trois chiffres de la base ; 19 des 102 valeurs sont des mesures TWU (F22) |
| G2 | « Les 20 polyesters les plus souples du catalogue » (titre, tableau, rangs) | fabricant (Solinco, Luxilon, Head, Yonex, Tecnifibre), cordeur | F3, F1 | **sous réserve D-1** : 9 lignes sur 20 ont une mesure TWU différente (6 plus rigides, 3 plus souples, F15) ; le Poly Tour Air, mesuré à 154,9, serait plus souple que tous les polyesters du catalogue (minimum actuel 164,6) |
| G3 | « Les 19 plus fermes » ; Verdict express : « les plus rigides, Luxilon 4G et 4G Rough, Babolat Pro Hurricane, Solinco Tour Bite Diamond Rough, donnent 35 » | fabricant (Luxilon, Babolat, Solinco, Weiss, Yonex) | F3, F1 | **sous réserve D-1** : 10 lignes sur 19 ont une mesure TWU différente (9 plus souples, jusqu'à −75,1) ; 3 des 4 fiches nommées au Verdict (4G Rough 216, Pro Hurricane 204, Diamond Rough 192,6) sont contredites, seul le 4G va dans le même sens (286,9, plus rigide encore) |
| G4 | « sur un cadre de RA 70, de 34 à 37, et la plupart atteignent alors le seuil « très ferme » (35 et plus) » | cordeur | F3 (15 sur 19), F9 | défendue |
| G5 | « Même le plus souple de ce tableau reste un monofilament : en général plus ferme qu'un multifilament, et nettement plus ferme qu'un boyau » | fabricant (multifilament), cordeur | F11, F14 (28 sur 45, soit 62 %, plus souples que 164,6 ; 7 boyaux sur 7, à plus de 64 lb/in) | défendue ; « en général » est la limite : la médiane des multifilaments (162) n'est qu'à 2,6 lb/in du polyester le plus souple |
| G6 | « En général, un multifilament ou un boyau reste plus prudent qu'un polyester » (FAQ, texte visible et JSON-LD) · « In general, a multifilament or natural gut remains a more prudent choice than a polyester » | cordeur, médecin | F11, F14 (98,7 % des paires ; 45 sur 45 sous la médiane des polyesters ; 7 sur 7), F9 | défendue : « plus prudent » se lit à l'indice RCS, que l'article dit ne pas prédire une blessure (F7) |
| G7 | « C'est voulu, par prudence pour le bras » | cordeur | F7 : décision de Pierre du 10/10/2026 (règle C, seule règle sans baisse d'alerte), règle 2 | défendue : c'est un choix de conception déclaré, pas une allégation médicale |
| G8 | « le Tecnifibre Black Code mesure 202,9 lb/in en 1.18 et 249,7 lb/in en 1.28, soit environ 5 points d'indice RCS d'écart » | fabricant (Tecnifibre) | F8, F17 | défendue (TWU, 51 lbs, « Fast », une mesure par jauge, trois copies concordantes) ; voir O-2 |
| G9 | « Cela peut surestimer la rigidité d'une jauge plus fine » (8 occurrences) · « That can overstate the stiffness of a finer gauge » | cordeur, fabricant | F17 le soutient pour le Black Code 1,18 ; F18 le contredit pour le NRG2 † et le Black Code 1,32 (l'autre jauge est plus épaisse et plus souple) | **sans défense en généralité → C-3** |
| G10 | « Seules celles marquées † sont alignées … ; les autres ne le sont pas et peuvent s'en écarter, dans un sens comme dans l'autre » | fabricant | F15, F16, F22 | défendue : vraie (25 plus rigides, 55 plus souples ; écart médian 17,8 lb/in) ; portée : D-1 |
| G11 | « seuls 6 de nos 45 multifilaments ont une rigidité alignée sur une mesure de laboratoire … un set prémonté n'a pas de mesure propre dans notre base » | fabricant | F6, F13 | défendue |
| G12 | Tableau des 17 : « Tecnifibre Razor Code + X-One, 180, 26 » | fabricant (Tecnifibre), cordeur | F13 | **sous réserve Q-1** : le composant Razor Code est à 242,9 et le set reste à 180 ; l'article le dit (« n'a pas été recalculée à partir de ses composants », « ordre de grandeur ») |
| G13 | « Yonex Poly Tour Pro : 2e en confort, mais 10e en souplesse, plus rigide que le Head Lynx Tour (210 lb/in) » | Yonex, Head | F1, F20 | **sous réserve D-1** : TWU donne 188,6 au Poly Tour Pro (1 jauge sur 4) et 228,6 au Lynx Tour (2 sur 3) ; l'ordre s'inverserait |
| G14 | « le Signum Pro X-Perience est l'un des plus souples des 18 » (3e, 205) | Signum | F20 | **sous réserve D-1** : TWU 224,6 (1 jauge sur 3), donc plus rigide que la base ; sens défavorable au bras (indice 31 au lieu de 29) |
| G15 | « Les deux polyesters qui ressortent sur les deux tableaux à la fois sont le Solinco Mach-10 et le Toroline O-Toro » ; Mach-10 : 2e en souplesse, 1er en confort | Solinco, cordeur | F20 | **sous réserve D-1** : TWU 222,3 (1 jauge sur 4), au-dessus de la médiane des polyesters (217,3), indice 31 au lieu de 28 ; même sens défavorable |
| G16 | « Si vous gardez du polyester, prenez le plus souple : le Toroline O-Toro (165,7 lb/in) » ; « c'est la façon la plus douce pour le bras de continuer à jouer du polyester parmi les cordages que nous documentons » · « pick the softest: Toroline O-Toro » ; « the most arm-friendly way to keep playing poly » | Toroline (O-Toro Snap), cordeur | F2, F3 : l'O-Toro est 3e | **sans défense → C-1** |
| G17 | « Avec une douleur actuelle, un multifilament ou un boyau reste le choix le plus prudent » · « With current pain, a multifilament or natural gut remains the safer choice » | médecin, cordeur | F14 pour la tendance et pour le boyau ; mais le NXT (25) est plus rigide que l'O-Toro (24) que la phrase précédente met « comme un multifilament » | **sans défense (absolu ; FR superlatif, EN comparatif) → C-2** |
| G18 | Légende des graphiques : « d'après la base du site et les mesures TWU » · « based on the site's database and TWU measurements » | TWU, fabricants | F15, F22 : 19 des 102 polyesters seulement sont des mesures TWU | **sans défense → C-4** |
| G19 | « très ferme (35 et plus, zone de risque pour le coude) » ; « au-delà de 35 : très ferme, risque de tennis elbow » | médecin | F9 : échelle publiée du site, seuils de l'alerte exprimés en percentiles (p80, p95) dans `advanced-rcs.ts` | défendue comme échelle du site ; ce n'est pas un seuil médical et l'article l'écrit |
| G20 | « Le cordage est le premier levier, de loin » ; « Changer de cordage pèse plus que changer de tension » | cordeur | F10, F19 (11 contre 2 contre 1 sur l'exemple) | défendue (dans la formule du site, exemple RA 65) |
| G21 | « Sur une même raquette, cet écart vaut 11 points d'indice RCS » | cordeur | F19 | défendue (10,95 ; 10 seulement à RA 60) ; voir O-1 |
| G22 | Hors diff : « C'est la direction sûre pour le bras » · « the safe direction for the arm » ; « la voie la plus prudente reste de quitter le polyester » · « the safest route is still to leave polyester » | médecin | F7 : aucun absolu de santé ni superlatif sans source MÉD ; les faits soutiennent le sens (TWU : tension plus basse, rigidité plus basse ; F14), pas le mot « sûre » | hors PR, **sans défense → O-4** |

**Bilan** : 22 affirmations contestables ; 11 défendues ; 6 défendues sous réserve (D-1 : G2, G3, G13, G14, G15 ; Q-1 : G12) ; 4 sans défense dans le diff ou son voisinage immédiat (G9, G16, G17, G18, soit C-3, C-1, C-2, C-4) ; 1 sans défense hors diff (G22, O-4).

### Corrections demandées (à `tsa-redacteur`)

Chaque ligne cite la phrase visée et le fait qui la corrige ; le pigiste ne propose aucune formulation.

| # | Phrase visée | Fait qui la corrige |
|---|---|---|
| C-1 | FR `cordage-tennis-elbow.html` : « L'essentiel », 4e puce, « Si vous gardez du polyester, prenez le plus souple : le Toroline O-Toro (165,7 lb/in) se place au niveau d'un multifilament sur l'indice. » ; § 3, « Sur l'indice, c'est la façon la plus douce pour le bras de continuer à jouer du polyester parmi les cordages que nous documentons. » · EN `best-tennis-strings-for-tennis-elbow.html` : « If you keep polyester, pick the softest: Toroline O-Toro (165.7 lb/in) plays close to a multifilament on the index. » ; « On the index, it is the most arm-friendly way to keep playing poly among the strings we document. » (4 phrases) | F2, F3 : le polyester le plus souple est le Toroline O-Toro Snap (164,6), puis l'Isospeed Cream (165) ; l'O-Toro (165,7) est 3e ; les trois donnent 24 (RA 65, 22 kg). L'article « polyester » écrit lui-même « les trois moins rigides » |
| C-2 | FR : « Avec une douleur actuelle, un multifilament ou un boyau reste le choix le plus prudent. » · EN : « With current pain, a multifilament or natural gut remains the safer choice. » (FAQ « Peut-on garder un polyester avec un tennis elbow ? », texte visible et JSON-LD, FR et EN) | F14 : vrai en général (45 sur 45 sous la médiane des polyesters, 98,7 % des paires, 7 boyaux sur 7), pas pour tous (NXT 173,7 > O-Toro 165,7) ; F7 : pas d'absolu ; la PR pose déjà « en général » sur la même idée dans la FAQ des articles « polyester » (Q-3) ; la force des deux langues diffère (superlatif contre comparatif) |
| C-3 | « peut surestimer une jauge plus fine » et ses équivalents : FR `cordage-polyester-tennis-elbow.html` (note de méthode du § 1 ; puce « Les rigidités sont celles de nos fiches »), EN `polyester-strings-tennis-elbow.html` (« A note on method » ; transparence), FR `cordage-tennis-elbow.html` (note du tableau des 17 ; transparence), EN `best-tennis-strings-for-tennis-elbow.html` (note du tableau ; transparence) (8 occurrences) | F17, F18 : la valeur † est la mesure de la jauge la plus rigide *mesurée* ; les autres jauges de la fiche sont plus souples, mais pas toujours plus fines : NRG2 † (1,24 = 164 > 1,32 = 158,3), Black Code (1,28 = 249,7 > 1,32 = 210,3), Babolat Origin, Solstice Power. L'exemple du Black Code 1,18 est exact |
| C-4 | Légende des quatre figures : FR « Schéma Tennis String Advisor, d'après la base du site et les mesures TWU, état au 10 octobre 2026. » (×2) · EN « Chart by Tennis String Advisor, based on the site's database and TWU measurements, as of October 10, 2026. » (×2) ; ligne type de `public/blog/images/CREDITS.md` (section « Graphiques générés depuis la base ») | F15, F22 : les points sont les rigidités de la base ; 19 des 102 polyesters du premier graphique sont alignés sur TWU, les autres valeurs ne sont pas des mesures TWU ; la mention de TWU comme source ne vaut que pour ces fiches |

### Observations non bloquantes

- **O-1** · Verdict express, « Sur une même raquette, cet écart vaut 11 points d'indice RCS » · « In the same frame, that gap is worth 11 RCS points » : F19. Vrai à RA 65 et RA 70 ; 10 à RA 60 (10,95 avant arrondi). À préciser si la phrase est reprise.
- **O-2** · « le Tecnifibre Black Code mesure 202,9 … » (puce « Les rigidités sont celles de nos fiches », FR · EN) : la mesure est celle de TWU à 51 lbs ; la phrase ne la rattache à TWU que par la puce qui la contient. Une attribution explicite dans la phrase la rendrait lisible seule (charte F5 : TWU source d'un fait).
- **O-3** · FR `cordage-tennis-elbow.html`, § 2 : « notre fiche du Babolat Touch VS indique 92 lb/in, la valeur la plus basse des familles courantes du catalogue » : F23, le boyau le plus souple est le Babolat Touch Tonic (88) ; le Touch VS (92) est à égalité avec le Tecnifibre TGut. Phrase antérieure à la PR, hors diff.
- **O-4** · Absolus de santé antérieurs à la PR, hors diff (G22) : FR `cordage-tennis-elbow.html` « C'est la direction sûre pour le bras », EN « It is the safe direction for the arm » ; FR `cordage-polyester-tennis-elbow.html` « la voie la plus prudente reste de quitter le polyester », EN « the safest route is still to leave polyester ». F7 : aucun absolu ni superlatif de santé sans source médicale ; l'article dit lui-même ne donner aucun conseil médical.

### Décision préalable à la fusion — D-1 (Pierre, par l'orchestrateur)

Les articles suivent la base (F1) ; la base attend les décisions de Pierre du 10/10/2026 (« aucune correction qui baisse une alerte pour l'instant » ; hausses du lot 3 non confirmées). La PR #110 liste 54 baisses (§ 5) et 25 hausses (§ 6) non appliquées. Or plusieurs de ces fiches portent une phrase ou une liste des articles :

| Où dans les articles | Fiche | Base | TWU (jauges de la fiche mesurées) | Indice RA 65, 22 kg : base → TWU |
|---|---|---|---|---|
| Verdict express « les plus rigides … donnent 35 » | Luxilon 4G Rough | 262 | 216 (1 sur 1) | 35 → 30 |
| idem | Babolat Pro Hurricane | 260 | 204 (3 sur 4) | 35 → 29 |
| idem | Solinco Tour Bite Diamond Rough | 260 | 192,6 (3 sur 3) | 35 → 27 |
| idem | Luxilon 4G | 265 | 286,9 (2 sur 2) | 35 → 38 |
| « 19 plus fermes » | Weiss Cannon Ultra Cable | 250 | 174,9 (1 sur 2) | 34 → 25 |
| idem | Yonex Poly Tour Tough | 245 | 193,7 (1 sur 1) | 33 → 27 |
| « 20 plus souples » | Solinco Mach-10 | 195 | 222,3 (1 sur 4) | 28 → 31 |
| idem | Tecnifibre Razor Soft | 185 | 212 (1 sur 3) | 26 → 29 |
| idem | Yonex Poly Tour Spin | 200 | 213,7 (1 sur 3) | 28 → 30 |
| idem | Luxilon Element | 190 | 208 (2 sur 2) | 27 → 29 |
| idem | Yonex Poly Tour Air | 195 | 154,9 (1 sur 1) | 28 → 23 |
| § 4 « l'un des plus souples des 18 » | Signum Pro X-Perience | 205 | 224,6 (1 sur 3) | 29 → 31 |
| § 4 « plus rigide que le Head Lynx Tour (210) » | Head Lynx Tour | 210 | 228,6 (2 sur 3) | 29 → 31 |
| § 4 « 2e en confort, 10e en souplesse » | Yonex Poly Tour Pro | 220 | 188,6 (1 sur 4) | 30 → 27 |

Indices recalculés avec `calculateRCS`, à titre indicatif. **Sens** : quand TWU est plus rigide que la base (Mach-10, Razor Soft, Poly Tour Spin, Element, Signum, Lynx Tour, 4G), l'article affiche un indice plus bas que la mesure, donc côté bras une sous-estimation ; quand TWU est plus souple (Weiss, Poly Tour Tough, 4G Rough, Pro Hurricane, Diamond Rough, Poly Tour Air, Poly Tour Pro), il affiche un indice plus haut, la sur-alerte que la règle C assume. **Ce qui est certain** : aucune de ces phrases n'est une erreur de recopie, l'article suit la base. **Ce qui reste ouvert** : la base restera-t-elle ce qu'elle est le jour de la publication ? Les listes « 20 plus souples » et « 19 plus fermes » et le Verdict express changeraient à la première décision de Pierre sur le lot 3 ou sur les baisses (F16, scénarios indicatifs).

Options, sans préférence du pigiste : (a) publier en l'état, avec la réserve † et « peuvent s'en écarter » déjà écrites ; (b) trancher d'abord le lot 3 des hausses et, au choix, des baisses, puis relancer `build-rigidite-figures.mts` (`--check` signale les écarts) et `redaction:valeurs` avant la fusion ; (c) retirer des phrases les fiches contredites (charte F1 : « l'article suit la base ou se tait ») ; (d) laisser la PR en attente. Un arbitrage matériel se présente en page HTML autonome (convention de Pierre).

### Divergences et constats hors PR

- **H-1** · `tsa-acquisition` (index EN, `public/en/blog/index.html` l. 404-416) : carte « Tennis Elbow & String Guide — How to choose your strings and tension to prevent or relieve tennis elbow. » (🇫🇷 French, December 2025), lien vers `/blog/cordage-tennis-elbow.html` : allégation de prévention et de traitement sans source médicale (F7), contraire à « Un cordage n'est pas un traitement » de l'article réécrit le 9 octobre. Carte obsolète.
- **H-2** · `tsa-acquisition` : des pages EN écrivent encore « 181 strings » (`public/en/index.html` l. 6, 9, 144 et 230 ; `public/en/faq.html` l. 139 ; `public/en/auth.html` l. 245) ; la base en a 179 (CLAUDE.md § 1).
- **H-3** · `tsa-core` : des descriptions de fiche disent « souple » ou « confort » pour des cordages dont la rigidité a monté : `diadem-solstice-power` (209,2 : « Polyester souple mêlant puissance, confort et spin »), `luxilon-alu-power-vibe` (208 : « Confort optimal sans sacrifier les performances »), `wilson-nxt` (173,7 : « Puissance et confort généreux »). Notes de confort inchangées (8,3 · 8 · 8,9).
- **H-4** · `tsa-core` : `wilson-optimus-16` (synthétique, jauge 1,30) : base 178, TWU « Wilson Optimus 16 (1.30) » = 140 (mesure certaine, jauge unique) ; absent des listes de #110. Non affiché dans les articles.
- **H-5** · `tsa-core` : `babolat-rpm-soft` : la base est un polyester à 205 ; la ligne TWU rattachée par #110 (« Babolat RPM Soft 16 (1.30) », 154,9) a la matière « Nylon » dans le relevé. Appariement à vérifier avant tout GO de baisse ; la fiche figure au tableau des 17.
- **H-6** · `tsa-core` : `getStringRecommendation` (`src/data/strings-database.ts`), palier < 20 : « Idéal pour les joueurs avec sensibilité du bras ou recherchant le maximum de confort » ; absolu du type « idéal pour le coude » (charte F7). Affichage par le configurateur non vérifié.

### Non vérifié

- La page TWU n'a pas été rouverte en direct : le relevé est une requête POST, je me suis appuyé sur trois copies concordantes (extrait de #110, relevé complet de #113, relevé brut local dont le sha256 est recalculé). Génération et coloris des échantillons TWU : non publiés (§ 2, « Introuvable »).
- Rendu visuel des quatre graphiques (thèmes clair et sombre, 390 px) : non relu ; seules les données le sont.
- Phrases fondées sur la consolidation interne des avis de testeurs, document non fourni : « Les testeurs le décrivent comme rond et souple au contact » ; « La synthèse le reconnaît elle-même : le confort y est souvent déduit de la description du cordage … ». Antérieures à la PR.
- Citations de Tennis Warehouse et de TWU (Crawford Lindsey) du FAQ et des § 1 et 2 de l'article « cordage et tennis elbow » : antérieures à la PR, pages non rouvertes.
- Pages de fiche `/tennis-strings/<slug>` : leur affichage de la rigidité (valeur brute de `string.stiffness`, `src/app/tennis-strings/[slug]/page.tsx` l. 82) est lu dans le code, pas en exécution.

### Conclusion du fact-check

**Pas conforme en l'état : quatre corrections de texte (C-1 à C-4) et un arbitrage de Pierre (D-1).** Tous les chiffres de fiche, d'indice, d'effectif et de rang des quatre articles, du guide et des deux cartes d'index sont confirmés à la décimale, en FR et en EN : 173 valeurs au vérificateur, 542 contrôles stricts de tableaux et de listes, 204 points de graphique, 0 écart. Les faits de laboratoire cités (Black Code 202,9 et 249,7 ; 46,8 lb/in ; environ 5 points) sont confirmés. Ce qui reste est de l'ordre des mots (C-1 à C-4) et du statut de la base elle-même (D-1). Conforme dès que C-1 à C-4 sont soldées et que D-1 est tranché ou assumé par Pierre.

---

## 6. Revue SEO — `tsa-acquisition`

### Contrôle on-page

Passe du 2026-10-10 sur la tête de la PR #116 (`e67d64e`), branche `agent/redaction/coherence-chiffres-regle-c-onpage`. Contrôles faits par script (`jsdom` ; Chrome 155 via Playwright à 1280 px) et par lecture du diff du `<head>` ; les scripts ne sont pas versionnés.

- [x] title, meta, H1 et slug FR et EN : seuls les chiffres ont changé (voir § 1) — `git diff origin/main...HEAD` limité au `<head>` : title, `og:title`, `twitter:title`, H1 et slugs inchangés ; `meta description`, `og:description`, `twitter:description` et `Article.description` : « 104 » devient « 102 », rien d'autre (même longueur) ; FAQ n° 1 des deux articles « tennis elbow » : « 140 à 180 » devient « 143 à 180 ». Seul écart au-delà des chiffres : la FAQ n° 1 des deux articles polyester (Q-3), jugée conforme (réponse plus bas).
- [x] canonical ; hreflang réciproques : non touchés — canonical = URL du fichier = `og:url` ; pour les deux paires (polyester ; « tennis elbow »), `fr`, `en` et `x-default` (vers le FR) sont les mêmes dans les deux fichiers jumeaux et visent des fichiers qui existent ; les sept URL (quatre articles, guide, deux index) répondent 200 en production, dans la version actuellement en ligne, et figurent au sitemap de production.
- [x] JSON-LD : `dateModified` à 2026-10-10 ; FAQ identique au texte visible ; aucun nœud ajouté — chaque bloc se parse (`JSON.parse`) ; `Article` (polyester) ou `BlogPosting` (« tennis elbow », sous-type d'`Article`) avec `image` (= `og:image`, fichier existant), `datePublished`, `dateModified`, auteur, `mainEntityOfPage` = canonical ; `BreadcrumbList` ; `FAQPage` ; aucun `aggregateRating`, `Review`, `ratingValue` ni `reviewCount`. `dateModified` = date visible (« mis à jour le 10 octobre 2026 », EN « updated October 10, 2026 ») sur les quatre articles et le guide ; `article:modified_time` (présent sur le seul article FR « tennis elbow ») = `dateModified`. **FAQ : texte visible et JSON-LD identiques au caractère près** sur les 21 réponses des cinq fichiers (3 + 3 + 5 + 4 + 6), après la retouche du guide ci-dessous.
- [x] og:image et twitter:image : non touchés — fichiers existants, 1200 × 630 (en-tête WebP lu), `og:image:alt` présent, `og:image` = `twitter:image`.
- [x] index du blog FR et EN : « 104 » devient « 102 » ; sitemap : non touché — cartes l. 659 (FR) et l. 254 (EN) à 102 ; plus aucun « 104 polyesters » dans `public/` ni `src/` ; `BLOG_SLUGS` et `EN_BLOG_SLUGS` contiennent les cinq slugs (`lastModified` y vaut la date du build, pour toutes les URL).
- [x] `npm run audit:blog-funnel` et `npm run audit:blog-images` verts (voir la PR) — exit 0 l'un et l'autre, avant et après ma retouche ; lien vers le configurateur dans le corps de chacun des quatre articles (FR `/configurator`, EN `/en/configurator.html`), trois ou quatre occurrences dans le corps, aucun `rel` ni `referrerpolicy`.
- [x] rendu — Chrome 155, 1280 px : les quatre articles répondent 200 ; titre et H1 visibles ; aucun débordement horizontal ; en-tête et graphique chargés ; JSON-LD relu par le navigateur ; aucune erreur console, aucune requête en 4xx ou 5xx (seule la mesure d'audience est neutralisée volontairement pendant le test).

### Retouches faites par `tsa-acquisition`

- `public/blog/guide-materiel-tennis.html` l. 111 et 114 (commit `8f049f2`) : dans le JSON-LD de la FAQ, `'pro stock'` et `'meilleures'` (apostrophes droites) deviennent « pro stock » et « meilleures », comme dans le texte visible (l. 827 et 830). Aucun mot ni chiffre modifié. Écart antérieur à la PR, présent sur `main`. Rien d'autre n'a été touché dans les sept fichiers.

### Longueur des balises (relevé, rien de changé)

Le brief vise 60 caractères au plus pour le title et 155 pour la meta description. La PR ne change la longueur d'aucun title ni d'aucune description (« 104 » devient « 102 »).

| Page | title | meta description | `og:description` |
|---|---|---|---|
| FR polyester | 75 | 242 | 163 |
| EN polyester | 68 | 222 | 142 |
| FR « tennis elbow » | 96 | 209 | 157 |
| EN « tennis elbow » | 78 | 192 | 144 |
| guide | 106 | 198 | 122 |

Jugé acceptable pour cette PR : le mot-clé principal ouvre chaque title et le chiffre tombe dans les 155 premiers caractères de la description (position 40 pour « 102 », 70 à 75 pour « 17 »), donc une troncature ne l'enlève pas. L'écart est général (32 pages du blog sur 35, index compris, dépassent 60 caractères de title ; 19 sur 35 dépassent 155 de description) : à traiter dans un chantier « balises » séparé, pas ici.

### Propositions au rédacteur

| # | Où | Proposition | Motif SEO | Réponse du rédacteur |
|---|---|---|---|---|
| S-1 | FAQ n° 1 des deux articles polyester (FR et EN), texte visible et JSON-LD | Faire passer la phrase de prudence en 2e position, sans ajouter ni retirer un mot (texte exact sous le tableau). Facultatif : la formulation actuelle est conforme (voir « Réponse à Q-3 »). | Un moteur de réponse reprend en pratique le début d'une réponse, rarement la fin (pratique courante, non mesurée ici). Aujourd'hui la prudence est la 4e phrase, qui commence après une soixantaine de mots, donc la première à tomber ; permutée, elle tombe dans les 22 premiers mots (FR) ou 25 (EN) et les deux premières phrases portent la réponse et sa réserve. Contrepartie : les noms des trois cordages passent de la 2e à la 3e phrase. Si acceptée : visible et JSON-LD changés ensemble (parité contrôlée au caractère près). | |
| S-2 | FAQ n° 3 des deux articles « tennis elbow » (FR : « un multifilament ou un boyau reste le choix le plus prudent » ; EN : « remains the safer choice »), texte visible et JSON-LD | À faire examiner par le pigiste (test de glissance) puis par le rédacteur : même type de formule sans nuance que celle corrigée à Q-3, et la raison de Q-3 (Wilson NXT 173,7, indice 25, au-dessus du O-Toro, 24) vaut aussi ici. Je ne propose pas de texte : c'est un conseil de santé. | Cohérence entre les pages : un moteur qui lit les deux articles reprendrait une réserve nuancée dans l'un et un absolu dans l'autre. | |
| S-3 | `guide-materiel-tennis.html`, `og:title` et `twitter:title` (l. 15 et 29) | Retirer « 2025 » : « … : Guide Expert 2025 » devient « … : Guide Expert », comme le title et le H1 de la page, qui n'ont pas d'année. Je ne l'ai pas fait moi-même : c'est un chiffre dans un titre. | La PR date le guide « mis à jour le 10 octobre 2026 » (texte visible et `dateModified`) ; l'aperçu de partage annonce 2025 ; charte § 1 : pas d'année dans un titre sauf nécessité. | |
| S-4 | « Sources » des deux articles polyester | Facultatif : rendre cliquable la source TWU (aujourd'hui du texte : « twu.tennis-warehouse.com »), avec l'URL du dossier (F7) à reconfirmer par le pigiste (F10). Si acceptée, j'ajoute `citation` au JSON-LD, comme dans les deux articles « tennis elbow ». | Source primaire des valeurs † ; les deux articles « tennis elbow » la lient déjà. | |

Texte de S-1 (mêmes mots, autre ordre).

FR :

```
Si vous gardez un polyester, prenez l'un des plus souples. En général, un multifilament ou un boyau reste plus prudent qu'un polyester. Dans notre catalogue de 102 polyesters, les trois moins rigides sont le Toroline O-Toro Snap (164,6 lb/in), l'Isospeed Cream (165) et le Toroline O-Toro (165,7). Sur une raquette de RA 65 montée à 22 kg, ils donnent un indice RCS de 24, contre 35 pour les plus rigides.
```

EN :

```
If you keep a polyester, pick one of the softest. In general, a multifilament or natural gut remains a more prudent choice than a polyester. In our catalogue of 102 polys, the three least stiff are Toroline O-Toro Snap (164.6 lb/in), Isospeed Cream (165) and Toroline O-Toro (165.7). In a racquet with an RA of 65 strung at 22 kg, they give an RCS index of 24, against 35 for the stiffest.
```

### Réponse à Q-3 (FAQ n° 1 des deux articles polyester)

Conforme, sans retouche nécessaire.

- Réponse d'abord : la 1re phrase répond (« prenez l'un des plus souples »), la 2e nomme les trois cordages avec leur rigidité ; les deux premières phrases donnent donc la réponse (charte § 1).
- Prudence conservée : FR, « En général » est ajouté devant « un multifilament ou un boyau reste plus prudent qu'un polyester » ; EN, « In general » est ajouté et « safer than any polyester » devient « a more prudent choice than a polyester ». Aucun absolu du type « sans risque » ou « idéal pour le coude » (charte F7), et FR et EN disent la même chose.
- Parité : texte visible et JSON-LD identiques au caractère près, FR et EN.
- Réserve, non bloquante : la prudence arrive en 4e phrase (voir S-1).

### Constats sur ces pages, hors périmètre de la PR (non modifiés)

- Guide : `publisher.logo` (`https://tennisstringadvisor.org/logo.png`) répond 404 en production, le fichier n'existe pas dans `public/` ; même défaut sur dix autres pages du blog. À retirer ou à créer dans un chantier séparé (`tsa-acquisition`), pas dans cette PR.
- `article:modified_time` n'existe que sur 7 pages du blog sur 35 (dont l'article FR « tennis elbow ») : facultatif, non ajouté sur les trois autres articles ; la date visible et `dateModified` restent les deux repères tenus à jour (charte F11).

### Vérification en production (après fusion)

- À faire après la fusion de la PR #110 puis de celle-ci : ouvrir les quatre articles, le guide et les deux index en production, vérifier « 102 polyesters », le graphique (clair et sombre) et les dates.
- Avant fusion (2026-10-10) : les sept URL répondent 200 et figurent au sitemap de production, dans leur version actuelle.

---

## 7. Journal

- 2026-10-10 · `tsa-redacteur` — Passe numérique après la règle C (PR #110) : chiffres des quatre articles, du guide et des cartes d'index recalculés depuis la base de la branche ; phrases de santé relues (« en général » à la place d'absolus, hybrides, jauge fine) ; phrase de méthode et marqueur † adaptés (jauge la plus rigide mesurée) ; deux graphiques tirés de la base ajoutés (`scripts/blog-covers/build-rigidite-figures.mts`), exceptions de `audit:blog-images` retirées pour les quatre articles. Instrument : `scripts/redaction/verifier-valeurs.mts` réparé (import cassé sur `main`), commit isolé. RELAIS → `tsa-pigiste` : fact-check des seules valeurs touchées (§ 5, Q-2) et avis sur le correctif du vérificateur (Q-6). RELAIS → `tsa-acquisition` : relire la dérogation (§ 1, Q-3). QUESTIONS À `tsa-core` : Q-1, Q-5.
- 2026-10-10 · `tsa-pigiste` — Fact-check final (étape 4a, circuit court) de la PR #116, tête `e67d64e`, sur la branche `agent/redaction/coherence-chiffres-regle-c-factcheck`. Chiffres de fiche, d'indice, d'effectif et de rang des quatre articles, du guide et des cartes d'index confirmés à la décimale en FR et en EN (173 valeurs au vérificateur, exit 0 ; 542 contrôles stricts ; 204 points de graphique ; 0 écart). Faits de laboratoire (Black Code 202,9 et 249,7 ; 46,8 lb/in ; environ 5 points) confirmés sur trois copies du relevé TWU. Réponses à Q-2 et Q-6 au § 4 : le correctif du vérificateur me convient, trois suites seront faites sur une branche dédiée de l'outil (PR à ouvrir par l'orchestrateur). Test de glissance : 22 affirmations, 4 sans défense (C-1 à C-4), 6 sous réserve (D-1, Q-1), 1 hors diff (O-4). Faits F14 à F23 ajoutés au § 5 (à reporter au § 2). RELAIS → `tsa-redacteur` : C-1 à C-4 (§ 5), puis relancer `redaction:valeurs` et `build-rigidite-figures.mts --check`. RELAIS → orchestrateur : D-1 à porter à Pierre avant la fusion (page HTML d'arbitrage) ; H-1 et H-2 à `tsa-acquisition`, H-3 à H-6 à `tsa-core` ; proposer à `tsa-measure` un `audit:redaction-valeurs` (Q-6). QUESTIONS À `tsa-core` : Q-1 (sans changement), H-4, H-5.
