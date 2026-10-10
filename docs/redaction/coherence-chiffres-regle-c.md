# Cohérence des chiffres des articles santé après la règle C de jauge (rigidités de laboratoire)

| Champ | Valeur |
|---|---|
| Slug FR / EN | `cordage-polyester-tennis-elbow`, `cordage-tennis-elbow` (+ `guide-materiel-tennis`, cartes des index) / `polyester-strings-tennis-elbow`, `best-tennis-strings-for-tennis-elbow` |
| Circuit | court : passe numérique sur des articles existants, avec un visuel de corps ajouté à chacun (règle images) |
| Branche | `agent/redaction/coherence-chiffres-regle-c`, créée depuis `origin/agent/tsa-core/c2-regle-jauge-c-lot2` (PR #110, non fusionnée) pour que `src/data/` porte déjà les nouvelles rigidités |
| Ouvert le | 2026-10-10, par l'orchestrateur |
| Demande d'origine | « mettre en cohérence avec la base, après les rigidités de laboratoire, les 4 articles santé (FR + EN) qui reposent sur la rigidité des cordages » (corps de la PR #110, § 9 « Chiffres d'articles qui changent à cause de cette PR ») |
| Statut | vérification : fact-check du pigiste à faire · PR à fusionner APRÈS #110 · GO de Pierre : en attente (aucune publication sans lui) |
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
| F8 | Tecnifibre Black Code, mesures TWU par jauge | 1,18 = 202.9 ; 1,24 = 236 ; 1,28 = 249.7 ; 1,32 = 210.3 lb/in ; la fiche porte 249,7 (jauge 1.28). Écart maximal 46,8 lb/in, soit environ 5,1 points d'indice (0,109 point par lb/in) | L1 | `data/reference/twu-lignes-citees.json` ; `string-stiffness-provenance.ts` | 2026-10-10 | — | PR #110 § 1 (46,8) | oui | confirmé (à rouvrir par le pigiste) |
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
- **Q-2** · de `tsa-redacteur` à `tsa-pigiste` · 2026-10-10 — Vérifier les seules valeurs touchées (§ 5), et en particulier : (a) Black Code 202,9 lb/in en 1.18 et 249,7 en 1.28 (TWU, `data/reference/twu-lignes-citees.json`) et « environ 5 points d'indice » ; (b) « seuls 6 de nos 45 multifilaments » (F6) ; (c) les effectifs du graphique « polyesters » : 74, 24, 4 et 28 (F10) ; (d) la formule « peuvent s'en écarter, dans un sens comme dans l'autre » pour les fiches non marquées † (PR #110 § 5 : 54 fiches plus rigides que la mesure ; § 6 : 25 plus souples).
- **Q-3** · de `tsa-redacteur` à `tsa-acquisition` · 2026-10-10 — Au-delà de la dérogation numérique : la réponse n° 1 de la FAQ des deux articles « polyester » disait « safer than any polyester » (EN) et « reste plus prudent qu'un polyester » (FR). L'absolu « any » est faux depuis que le Wilson NXT (173,7, indice 25) est plus rigide que les polyesters les plus souples (164,6 à 165,7, indice 24). Reformulé en « En général… » / « In general… », texte visible et JSON-LD identiques. À valider.
- **Q-4** · de `tsa-redacteur` à l'orchestrateur · 2026-10-10 — La liste de la PR #110 (§ 9) ne cite pas la médiane de la section 4 des articles « polyester » (« juste au-dessus de la médiane du catalogue (215) », FR l. 375, EN l. 321) : corrigée en 217,3. Elle ne dit pas non plus que la transparence EN de l'article « tennis elbow » n'avait pas la ligne « une rigidité par cordage, pas par jauge » de la version FR : ajoutée pour que FR et EN disent la même chose.
- **Q-5** · de `tsa-redacteur` à `tsa-core` · 2026-10-10 — Information : la règle D (rigidité par jauge) et le lot 3 changeront de nouveau ces chiffres. `scripts/blog-covers/build-rigidite-figures.mts --check` échoue si un graphique ou un chiffre clé du texte ne colle plus à la base ; il peut être branché dans `audit:all` (propriétaire `tsa-measure`).
- **Q-6** · de `tsa-redacteur` à `tsa-pigiste` · 2026-10-10 — `npm run redaction:valeurs` était inutilisable sur `main` : `scripts/redaction/verifier-valeurs.mts` importe `racquetProfile`, retiré de `racquet-scoring.ts` par « aucune note déduite » (CLAUDE.md v2.3.1). Correctif minimal dans un commit isolé de cette PR (un champ `profil.*` est refusé, le reste est inchangé ; cinq cas négatifs rejetés). Le vérificateur est à `tsa-pigiste` : valider, ou le reprendre dans sa propre PR (le commit se retire sans effet sur le reste de la PR).

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

### Affirmations

Les valeurs agrégées (effectifs, extrêmes, médianes, effectifs du graphique) ne se vérifient pas ligne à ligne : elles sont recalculées par `build-rigidite-figures.mts --facts` (F1 à F5, F10, F11) et contrôlées dans le texte par `--check`.

| # | Phrase de l'article (FR · EN) | Fait n° | Conforme | Correction demandée |
|---|---|---|---|---|
| A1 | « Nos 102 polyesters vont de 164,6 à 265 lb/in (médiane 217,3) » · « Our 102 polys range from 164.6 to 265 lb/in (median 217.3) » | F1, F2 | recalculé ; pigiste à confirmer | |
| A2 | « Les 20 polyesters les plus souples… Sur 102, ils sont 20 » · « The 20 softest… Out of 102, there are 20 » ; tableau de 20 lignes, rangs 1 à 17 avec égalités | F3 | recalculé ; pigiste à confirmer | |
| A3 | « 19 polyesters… à 240 lb/in ou plus » ; groupes « 240 (32) », « 242,9 à 248 (33) », « 249,7 à 255 (34) », « 260 à 265 (35) » | F3 | recalculé ; pigiste à confirmer | |
| A4 | « sur un cadre de RA 70, de 34 à 37, et la plupart atteignent alors le seuil « très ferme » (35 et plus) » (remplace « au-delà du seuil », inexact à 34) | F3 | 15 polyesters sur 19 à 35 ou plus en RA 70 (calcul) ; pigiste à confirmer | |
| A5 | « Yonex Poly Tour Pro… juste au-dessus de la médiane du catalogue (217,3 lb/in) » | F2 | recalculé | |
| A6 | Tableau des familles : multifilament 45, 143 – 180, 162 ; polyester 102, 164,6 – 265, 217,3 ; « 179 fiches cordages, état au 10 octobre 2026 » ; « multifilaments de 143 à 180 » (4 occurrences par article, JSON-LD compris) | F1, F4, F5 | recalculé ; `--check` | |
| A7 | Tableau des 17 cordages : NRG2 164 (24), NXT 173,7 (25), ordre par rigidité ; « les multifilaments se regroupent entre 23 et 25 » (Xcel 23, X-One 24, NRG2 24, Velocity MLT 24, NXT 25) ; « RCS 23 à 25 dans la raquette d'exemple » | F4 | recalculé | |
| A8 | Leviers : ALU Power 31 → O-Toro 24 (−7), → NXT 25 (−6), → tension 18 kg 29 (−2), → RA 60 30 (−1) ; ordre inversé par rapport à la version du 9/10 ; « de 31 à 25 » dans « L'essentiel » | F4 | recalculé | |
| A9 | « † Rigidité alignée sur une mesure du laboratoire TWU : quand la fiche regroupe plusieurs jauges, c'est celle de la jauge la plus rigide que TWU a mesurée » ; † posé sur les 7 Toroline et Element Rough (jauge unique), Black Code 4S, Razor Code, Black Code (plusieurs jauges), et, dans le tableau des 17, NRG2, NXT et O-Toro | F7 | à confirmer (liste des † = statut « appliquee » + fiches Toroline) | |
| A10 | « Cela peut surestimer la rigidité d'une jauge plus fine : l'indice RCS peut alors sembler sévère pour cette jauge. C'est voulu, par prudence pour le bras. Pour votre montage exact, c'est l'indice du configurateur qui fait foi. » | F7 | à confirmer (décision de Pierre, PR #110) | |
| A11 | « le Tecnifibre Black Code mesure 202,9 lb/in en 1.18 et 249,7 lb/in en 1.28, soit environ 5 points d'indice RCS d'écart » | F8 | à confirmer (TWU) | |
| A12 | « Seules celles marquées † sont alignées sur une mesure de laboratoire identifiée (TWU) ; les autres ne le sont pas et peuvent s'en écarter, dans un sens comme dans l'autre » | F7 | à confirmer (PR #110 § 5 et § 6) | |
| A13 | « seuls 6 de nos 45 multifilaments ont une rigidité alignée sur une mesure de laboratoire, et un set prémonté n'a pas de mesure propre dans notre base » | F6, F13 | recalculé | |
| A14 | « En général, un multifilament ou un boyau reste plus prudent qu'un polyester » (FAQ, texte visible et JSON-LD) · « In general, a multifilament or natural gut remains a more prudent choice than a polyester » | F11 | vrai en tendance, pas en absolu | |
| A15 | « Même le plus souple de ce tableau reste un monofilament : en général plus ferme qu'un multifilament, et nettement plus ferme qu'un boyau » | F11 | recalculé (28 multifilaments sur 45 sont plus souples que lui : « en général » et non « toujours ») | |
| A16 | Graphiques : un point par polyester ; zones 200 et 240 (20 et 19) ; médiane 217,3 ; repères RCS 32 et 35 situés à 231,1 et 258,6 lb/in pour RA 65, 22 kg ; 74 sous 32, 24 de 32 à 34, 4 à 35 ou plus ; minimum, médiane et maximum par famille | F2 à F5, F9, F10 | recalculé ; `--check` | |
| A17 | Dates : `dateModified` 2026-10-10 (quatre articles et guide), `article:modified_time` 2026-10-10 là où il existe, date visible « mis à jour le 10 octobre 2026 » | CHARTE F11 | oui | |

### Test de glissance

À dresser par `tsa-pigiste` (étape 4a). Candidats relevés par le rédacteur :

| Affirmation contestable | Par qui (fabricant · cordeur · médecin) | Défense (fait n°) ou « sans défense » |
|---|---|---|
| « C'est voulu, par prudence pour le bras » (sur-alerte sur les jauges fines) | cordeur | F7 : décision de Pierre du 10/10/2026, consignée dans la PR #110 et `string-stiffness-provenance.ts` |
| « En général, un multifilament ou un boyau reste plus prudent qu'un polyester » | cordeur, médecin | F11 (tendance chiffrée) ; l'article ne dit pas « toujours » et renvoie au configurateur |
| Black Code 202,9 lb/in en 1.18 et 249,7 lb/in en 1.28 | fabricant | F8 : une mesure TWU par jauge, conditions publiées (51 lbs, balayage « Fast ») ; l'article ne présente pas la valeur comme exacte à la décimale |
| Les valeurs non marquées † « peuvent s'écarter » de la mesure, dans les deux sens | fabricant | F7 ; PR #110 § 5 et § 6 |

---

## 6. Revue SEO — `tsa-acquisition`

### Contrôle on-page

- [ ] title, meta, H1 et slug FR et EN : seuls les chiffres ont changé (voir § 1)
- [ ] canonical ; hreflang réciproques : non touchés
- [ ] JSON-LD : `dateModified` à 2026-10-10 ; FAQ identique au texte visible ; aucun nœud ajouté
- [ ] og:image et twitter:image : non touchés
- [ ] index du blog FR et EN : « 104 » devient « 102 » ; sitemap : non touché
- [ ] `npm run audit:blog-funnel` et `npm run audit:blog-images` verts (voir la PR)

### Propositions au rédacteur

| # | Où | Proposition | Motif SEO | Réponse du rédacteur |
|---|---|---|---|---|

### Vérification en production (après fusion)

- À faire après la fusion de la PR #110 puis de celle-ci : ouvrir les quatre articles, le guide et les deux index en production, vérifier « 102 polyesters », le graphique (clair et sombre) et les dates.

---

## 7. Journal

- 2026-10-10 · `tsa-redacteur` — Passe numérique après la règle C (PR #110) : chiffres des quatre articles, du guide et des cartes d'index recalculés depuis la base de la branche ; phrases de santé relues (« en général » à la place d'absolus, hybrides, jauge fine) ; phrase de méthode et marqueur † adaptés (jauge la plus rigide mesurée) ; deux graphiques tirés de la base ajoutés (`scripts/blog-covers/build-rigidite-figures.mts`), exceptions de `audit:blog-images` retirées pour les quatre articles. Instrument : `scripts/redaction/verifier-valeurs.mts` réparé (import cassé sur `main`), commit isolé. RELAIS → `tsa-pigiste` : fact-check des seules valeurs touchées (§ 5, Q-2) et avis sur le correctif du vérificateur (Q-6). RELAIS → `tsa-acquisition` : relire la dérogation (§ 1, Q-3). QUESTIONS À `tsa-core` : Q-1, Q-5.
