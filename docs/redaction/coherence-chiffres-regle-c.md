# Cohérence des chiffres des articles santé après la règle C de jauge (rigidités de laboratoire)

| Champ | Valeur |
|---|---|
| Slug FR / EN | `cordage-polyester-tennis-elbow`, `cordage-tennis-elbow`, `meilleur-cordage-polyester-2026`, `meilleures-raquettes-tennis-2026`, `materiel-next-gen-fonseca-mensik-cobolli-jodar` (+ `guide-materiel-tennis`, cartes des index) / `polyester-strings-tennis-elbow`, `best-tennis-strings-for-tennis-elbow`, `best-polyester-tennis-strings-2026`, `best-tennis-racquets-2026` |
| Circuit | court : passe numérique sur des articles existants ; visuel de corps ajouté aux quatre articles santé (règle images) ; exceptions d'`audit:blog-images` renouvelées, datées et motivées, pour les cinq autres articles modifiés (§ 3, I3 à I5) |
| Branche | `agent/redaction/coherence-chiffres-regle-c` ; tête `0001f9f` à la reprise du 10/10 : `main` (v2.3.12) + pile rigidités (#110 règle C et lot 2, #113 relevé TWU complet, #115 rigidité par jauge, #118 lot 3) + relecture SEO + fact-check du pigiste. À la fusion, #110, #113, #115 et #118 passent avec les articles, en une seule fois : aucune fenêtre d'incohérence |
| Ouvert le | 2026-10-10, par l'orchestrateur |
| Demande d'origine | « mettre en cohérence avec la base, après les rigidités de laboratoire, les 4 articles santé (FR + EN) qui reposent sur la rigidité des cordages » (corps de la PR #110, § 9 « Chiffres d'articles qui changent à cause de cette PR ») |
| Statut | reprise du 10/10 (passe n° 2) : C-1 à C-4, O-1 à O-4, S-1 à S-4 traités (§ 4 et § 6) ; chiffres recalculés sur la base finale ; `redaction:valeurs` exit 0 sur 288 valeurs ; fact-check du pigiste à refaire sur les seules valeurs et phrases touchées · PR #116 non fusionnée · D-1 : la base finale porte le lot 3 ; 53 baisses restent en attente du GO de Pierre · GO de Pierre pour publier : en attente |
| Mise à jour planifiée | à refaire à la première décision de Pierre sur les 53 baisses restantes ou sur la règle D (rigidité par jauge) : `npx --yes tsx scripts/blog-covers/build-rigidite-figures.mts` puis `--check` signalent les écarts des quatre articles santé ; relire à la main les cinq autres articles (tableaux des 18, indices des raquettes, tableau 3 de l'article next gen) |

> Règles : `docs/redaction/CHARTE.md`. Déroulé : `docs/redaction/README.md`.
> Dossier rédigé par `tsa-redacteur` à la demande de l'orchestrateur ; les sections des autres agents sont renseignées « sans objet » ou laissées à leur auteur.

---

## 1. Brief SEO — `tsa-acquisition`

Sans objet : circuit court, correction de chiffres. Aucun titre éditorial, slug, canonical, hreflang, maillage ni sitemap n'est modifié.

Dérogation de l'orchestrateur (10/10/2026) pour cette passe NUMÉRIQUE, à relire par `tsa-acquisition` :

- `title`, `meta description`, Open Graph, Twitter et JSON-LD des quatre articles : modifiés pour les seuls chiffres (102 polyesters, 143 à 180 lb/in, `dateModified`, `article:modified_time` là où il existe) ;
- cartes des index FR (l. 659) et EN (l. 254) : « 104 » devient « 102 » ;
- seul écart au-delà des chiffres, voir Q-3 : la réponse n° 1 de la FAQ des deux articles « polyester » (visible et JSON-LD, identiques) lève un absolu.
- passe n° 2 (reprise du 10/10) : `guide-materiel-tennis` : « 2025 » retiré de `og:title` et `twitter:title` (S-3, `<title>` et H1 n'ont pas d'année) ; FAQ n° 1 des deux articles « polyester » : phrase de prudence passée en 2e position, mêmes mots (S-1) ; FAQ n° 3 des deux articles « tennis elbow » : « en général » et comparatif (S-2 = C-2) ; source TWU rendue cliquable et nœud `citation` ajouté au JSON-LD de six articles (S-4, voir § 6) ; `dateModified` et date visible « mis à jour le 10 octobre 2026 » sur les cinq articles ajoutés à la passe (`article:modified_time` aussi pour l'article next gen). Aucun title, aucune meta description ni Open Graph des articles ajoutés n'est modifié (leurs chiffres n'y figurent pas).

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
| F2 | Rigidité des polyesters | de 164,6 (Toroline O-Toro Snap) à 286,9 (Luxilon 4G) lb/in ; médiane 220 (valeurs centrales 220 et 220) | BASE | idem (tête `0001f9f` : pile rigidités #110, #113, #115, #118) | 2026-10-10 | — | PR #118 § 6 (220 ; 286,9) | oui | confirmé (recalculé) |
| F3 | Polyesters à 200 lb/in ou moins ; à 240 lb/in ou plus ; entre les deux | 15 ; 21 ; 66 | BASE | idem | 2026-10-10 | — | PR #118 § 6 (15 ; 21) | oui | confirmé (recalculé) |
| F4 | Rigidité des multifilaments | de 143 (Ashaway Dynamite Natural) à 180 (Head RIP Control) lb/in ; médiane 162,3 | BASE | idem | 2026-10-10 | — | PR #118 § 6 (162,3) | oui | confirmé (recalculé) |
| F5 | Autres familles | hybrides 158–192 (médiane 175) et boyaux 88–100 (95) inchangés ; synthétiques 165–185,2 (180) : le maximum passe de 185 à 185,2 (Wilson Synthetic Gut Extreme, alignée sur TWU) | BASE | idem | 2026-10-10 | — | PR #118 § 6 (185,2) | oui | confirmé (recalculé) |
| F6 | Multifilaments dont la rigidité est alignée sur une mesure TWU | 11 sur 45 : tecnifibre-x-one-biphase, tecnifibre-tgv, tecnifibre-nrg2, wilson-nxt, babolat-xalt, solinco-vanquish, volkl-power-fiber-ii, babolat-xcel-power, babolat-origin, babolat-m7, tecnifibre-xr3 (6 avant le lot 3) | BASE | `src/data/string-stiffness-provenance.ts` (statut « appliquee ») | 2026-10-10 | — | — | oui | confirmé (recalculé) |
| F7 | Règle de jauge de référence : pour une fiche alignée, la rigidité est la mesure TWU de la jauge la plus rigide mesurée parmi les jauges de la fiche ; sur-alerte assumée sur les jauges fines | décision de Pierre du 10/10/2026 | L1 + décision | `src/data/string-stiffness-provenance.ts` (en-tête) ; PR #110 § « Décisions de Pierre » ; TWU : https://twu.tennis-warehouse.com/learning_center/reporter2.php (51 lbs, balayage « Fast ») | 2026-10-10 | — | — | oui | confirmé (par la base ; le pigiste peut rouvrir la page TWU) |
| F8 | Tecnifibre Black Code, mesures TWU par jauge | 1,18 = 202.9 ; 1,24 = 236 ; 1,28 = 249.7 ; 1,32 = 210.3 lb/in ; la fiche porte 249,7 (jauge 1.28). Écart maximal 46,8 lb/in, soit environ 5,1 points d'indice (0,109 point par lb/in) | L1 | `data/reference/twu-releve-complet.json` ; `string-stiffness-provenance.ts` | 2026-10-10 | — | PR #110 § 1 (46,8) | oui | confirmé (à rouvrir par le pigiste) |
| F9 | Seuils d'alerte bras du configurateur | 32 (bras sensible), 35 (autres profils) | BASE | `src/lib/advanced-rcs.ts` (`armRisk`) | 2026-10-10 | `rcs >= 32 … rcs >= 35` | CHARTE F7 | oui | confirmé |
| F10 | Montage d'exemple de l'article (RA 65, 22 kg) : rigidité où l'indice atteint 32 et 35 ; nombre de polyesters concernés | 231,1 et 258,6 lb/in ; 32 polyesters à 32 ou plus (dont 6 à 35 ou plus), 70 en dessous (26 de 32 à 34) | BASE | `calculateRCS` sur la base | 2026-10-10 | — | — | oui | confirmé (recalculé) |
| F11 | Part des multifilaments et des boyaux plus souples que le polyester le plus souple (164,6) | 25 multifilaments sur 45 ; 7 boyaux sur 7 (45 multifilaments sur 45 sous la médiane des polyesters, 220) | BASE | idem | 2026-10-10 | — | — | oui | confirmé (recalculé) |
| F12 | Les 18 polyesters à avis de testeurs : 7 sont désormais alignés sur TWU (Lynx Tour 228,6 · Mach-10 222,3 · Hyper-G 218,3 · X-Perience 224,6 · RPM Team 280,6 · 4G 286,9 · O-Toro 165,7). Rangs de souplesse sur 18 (égalité de rigidité départagée par l'ordre alphabétique) : O-Toro 1er, Poly Tour Rev 2e, ReString Zero 3e, Head Hawk Touch 4e, Völkl Cyclone 5e, Hyper-G 6e, Poly Tour Pro 7e, Mach-10 8e, X-Perience 9e, Lynx Tour 10e, ALU Power 11e, RPM Rough 12e, RPM Blast 13e, Confidential 14e, Weiss Cannon Ultra Cable 15e, Tour Bite 16e, RPM Team 17e, 4G 18e ; rigidité moyenne 230,4 (230,39). Rangs de confort inchangés : Mach-10 1er, Poly Tour Pro 2e, O-Toro 3e, Poly Tour Rev 4e, quatre ex aequo au 5e (Hawk Touch, ReString Zero, Cyclone, Lynx Tour), Hyper-G 9e | — | BASE | `string-stiffness-provenance.ts` (7 des 18 en « appliquee ») ; `tester-ratings.ts` | 2026-10-10 | — | PR #118 § 6 (mêmes rangs et moyenne) | oui | confirmé (recalculé) |
| F13 | La rigidité d'un hybride prémonté est propre au set, sans source, et n'est pas recalculée quand un composant est aligné sur une mesure | — | BASE | PR #110 § 7 (« Hybrides pré-montés ») | 2026-10-10 | — | — | oui | confirmé ; voir Q-1 |
| F24 | Head Lynx Tour, cordage de l'exemple des articles « meilleures raquettes » et « next gen » | 228,6 lb/in : mesure TWU de la jauge 1.30 (1.25 = 217,7 ; 2 jauges sur 3 mesurées) ; 210 avant le lot 3 | L1 + BASE | `string-stiffness-provenance.ts` (« appliquee », règle plus-rigide) | 2026-10-10 | — | PR #118 § 6 | oui | confirmé (recalculé) |
| F25 | Fiches dont la rigidité est alignée sur une mesure TWU (définition du † et des points cerclés) | 48 sur 179 : 36 polyesters sur 102 (28 « appliquee » + 8 Toroline signalées par un commentaire « Rigidité : TWU » de la base), 11 multifilaments sur 45, 1 synthétique sur 16 ; aucun boyau ni hybride | BASE | `string-stiffness-provenance.ts` ; commentaires de `strings-database.ts` | 2026-10-10 | — | PR #118 § 6 (19 polyesters avant le lot 3) | oui | confirmé (recalculé) |
| F26 | Écart entre le polyester le plus rigide (4G, 286,9) et le plus souple (O-Toro Snap, 164,6) | 13,3 points avant arrondi ; 13 à RA 60, 14 à RA 65, 13 à RA 70 (donc « 13 à 14 points » quelle que soit la raquette) | BASE | `calculateRCS` | 2026-10-10 | — | PR #118 § 6 (14 points à RA 65) | oui | confirmé (recalculé) |
| F27 | Leviers autour du Luxilon 4G (RA 65, 22 kg) | 4G = 38 ; O-Toro 24 (−14) ; cadre RA 60 : 36 ; cadre RA 70 : 39 ; 18 kg : 36 (−2) | BASE | `calculateRCS` | 2026-10-10 | — | PR #118 § 6 | oui | confirmé (recalculé) |
| F28 | Plages des listes (RA 65 / RA 70, 22 kg) | 21 polyesters à 240 ou plus : 32 à 38 à RA 65 (groupes : 32 × 2, 33 × 7, 34 × 6, 35 × 3, 36, 37, 38), 34 à 39 à RA 70 (17 sur 21 à 35 ou plus) ; 15 polyesters à 200 ou moins : 23 à 26 (RA 60), 24 à 28 (RA 65), 26 à 30 (RA 70) | BASE | `calculateRCS` | 2026-10-10 | — | — | oui | confirmé (recalculé) |
| F29 | Yonex Poly Tour Pro | 220 lb/in, exactement la médiane des 102 polyesters (51e et 52e valeurs à 220) ; 7e plus souple des 18 | BASE | idem | 2026-10-10 | — | — | oui | confirmé (recalculé) |
| F30 | Raquettes : indice avec le Head Lynx Tour (228,6) à 22 kg | RA 59 : 29 · RA 61–62 : 30 · RA 63–65 : 31 · RA 66–68 : 32 · RA 69 : 33 ; chaque indice monte de 2 par rapport à l'exemple à 210 ; 9 raquettes sur 18 (RA 66 ou plus) atteignent 32 (seuil « bras sensible »), aucune n'atteint 35 | BASE | `calculateRCS` ; `src/lib/advanced-rcs.ts` (seuils 32 et 35) | 2026-10-10 | — | PR #118 § 6 (colonne RCS « environ +2 ») | oui | confirmé (recalculé) |
| F31 | Article next gen, tableau 3 (22 / 24 / 26 kg ; seuil 35 en kg) | VCORE 98 + Poly Tour Strike (RA 64, 215) : 29 / 30 / 31, seuil 33 kg · Blade 98 18×20 V9 + ALU Power (RA 62, 230) : 30 / 31 / 32, seuil 31 kg · Speed MP + Lynx Tour (RA 61, 228,6) : 30 (29,85) / 31 (30,85) / 32 (31,85), seuil 32 kg (36 kg avec 210) ; plage des neuf cases : 29 à 32 | BASE | `calculateRCS` (valeurs avant arrondi : formule du site) | 2026-10-10 | — | — | oui | confirmé (recalculé) |

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
| I1 | corps, section 1 des deux articles « polyester » (FR et EN) | 2 : visuel généré par script | `scripts/blog-covers/build-rigidite-figures.mts` (graphique « polyesters », lu dans `src/data/`) | Tennis String Advisor | propriété TSA | légende de provenance (C-4) : « Schéma Tennis String Advisor, d'après la base du site, état au 10 octobre 2026 », avec le nombre exact de fiches alignées sur TWU (36 sur 102) | aucun produit ni marque en image ; noms de cordages en infobulle (`<title>`) seulement | retenu : un point par polyester, cerclé si la rigidité est alignée sur une mesure TWU (36 sur 102), zones 200 et 240 lb/in, médiane, seuils d'alerte du montage d'exemple ; axe 160-290 (4G à 286,9) |
| I2 | corps, section 2 des deux articles « tennis elbow » (FR et EN) | 2 : visuel généré par script | idem, graphique « familles » | Tennis String Advisor | propriété TSA | légende (C-4) : « Ces valeurs sont celles de nos fiches : 48 des 179 sont alignées sur une mesure du laboratoire TWU (36 polyesters, 11 multifilaments, 1 synthétique), les autres ne sont pas des mesures TWU » | aucun | retenu : minimum, médiane et maximum par famille, avec la bande d'indice RCS ; axe 80-300 |
| I3 | corps des deux articles « meilleur cordage polyester 2026 » (FR et EN) | — | aucun visuel ajouté | — | — | — | — | exception de `audit:blog-images` renouvelée (empreinte, date 2026-10-10, motif : « corrigé le 10/10/2026 (PR #116 : rigidités, indices et rangs alignés sur la base après la règle C et le lot 3, urgence d'exactitude) — visuel de corps à créer »). Même motif que la PR #102. Un graphique dédié (rigidité des 18 contre moyenne des testeurs) serait une création éditoriale, hors d'une passe numérique : à confier à l'équipe éditoriale |
| I4 | corps des deux articles « meilleures raquettes 2026 » (FR et EN) | — | aucun visuel ajouté | — | — | — | — | idem I3 (exceptions renouvelées) |
| I5 | corps de l'article « matériel next gen » (FR) | — | aucun visuel ajouté | — | — | — | — | idem I3 (exception renouvelée) ; la version EN n'est pas modifiée : son exception reste inchangée (empreinte intacte) |

---

## 4. Questions ouvertes

- **Q-1** · de `tsa-redacteur` à `tsa-core` · 2026-10-10 — Les trois hybrides prémontés qui contiennent un cordage aligné sur une mesure gardent leur rigidité d'avant : Razor Code + X-One 180 (composant Razor Code désormais 242,9), Ice Code + NRG2 172 (NRG2 164), Duo Control 188 (NXT 173,7). Le tableau des 17 cordages des articles « cordage et tennis elbow » cite Razor Code + X-One à 180 (indice 26 dans l'exemple). Les articles affichent la valeur de la base et disent qu'elle n'est pas mesurée ni recalculée à partir des composants. Recalculer les hybrides, les retirer du RCS, ou laisser tel quel ? Décision de la base ; le rédacteur suivra (retrait de la ligne du tableau si besoin).
- **Q-2** · de `tsa-redacteur` à `tsa-pigiste` · 2026-10-10 — Vérifier les seules valeurs touchées (§ 5), et en particulier : (a) Black Code 202,9 lb/in en 1.18 et 249,7 en 1.28 (TWU, `data/reference/twu-releve-complet.json`) et « environ 5 points d'indice » ; (b) « seuls 6 de nos 45 multifilaments » (F6) ; (c) les effectifs du graphique « polyesters » : 74, 24, 4 et 28 (F10) ; (d) la formule « peuvent s'en écarter, dans un sens comme dans l'autre » pour les fiches non marquées † (PR #110 § 5 : 54 fiches plus rigides que la mesure ; § 6 : 25 plus souples).
  - → `tsa-pigiste`, 2026-10-10 : valeurs touchées recalculées par des scripts à moi (méthode, sorties et faits F14 à F23 au § 5). **(a) Confirmé.** Relevé TWU (51 lbs, balayage « Fast ») : « Tecnifibre Black Code 18 » (jauge nominale 1,18) = 202,9 ; « Black Code 17 » (1,24) = 236 ; « Black Code 16 » (1,28) = 249,7 ; « Black Code 15L » (1,32) = 210,3 lb/in. Trois copies concordantes : l'extrait `data/reference/twu-lignes-citees.json` (#110, depuis remplacé par le relevé complet), `data/reference/twu-releve-complet.json` (branche de #113) et le relevé brut local, dont j'ai recalculé le sha256 (`01c07cc…8872`, celui qu'enregistrent les deux fichiers). Écart maximal 249,7 − 202,9 = 46,8 lb/in, soit 46,8 × 0,109 = 5,1 points d'indice : « environ 5 points » est exact. **(b) Confirmé** : six fiches au statut « appliquee » (Völkl Power Fiber II, NRG2, NXT, Xcel Power, Origin, XR3), chacune égale à la mesure de la jauge appliquée ; aucun autre multifilament n'a la valeur de la règle C ; les trois sets hybrides n'ont aucune ligne TWU. **(c) Confirmé** : 74 / 24 / 4, donc 28 à 32 ou plus ; seuils 32 et 35 relus par un motif à moi dans `src/lib/advanced-rcs.ts` (l. 337-339) ; l'indice atteint 32 à 231,14 lb/in et 35 à 258,64 ; les 102 points des deux SVG (titre, abscisse, couleur) concordent avec la base. **(d) Exacte à la lettre, portée plus large que la phrase** : 80 fiches non alignées ont au moins une mesure TWU à une jauge de la fiche, 25 plus rigides que la base et 55 plus souples (les 54 de #110, plus `wilson-optimus-16`, 178 → 140, absente de sa liste) ; écart absolu médian 17,8 lb/in (environ 1,9 point d'indice), 32 fiches à 20 lb/in ou plus, extrêmes −75,1 (Weiss Cannon Ultra Cable) et +46,0 (Babolat Revenge). La phrase est vraie ; elle ne dit pas que ces fiches sont nombreuses ni que plusieurs figurent dans les listes et les phrases des articles (F15, F16, G2, G3, G13 à G15 et D-1 au § 5).
- **Q-3** · de `tsa-redacteur` à `tsa-acquisition` · 2026-10-10 — Au-delà de la dérogation numérique : la réponse n° 1 de la FAQ des deux articles « polyester » disait « safer than any polyester » (EN) et « reste plus prudent qu'un polyester » (FR). L'absolu « any » est faux depuis que le Wilson NXT (173,7, indice 25) est plus rigide que les polyesters les plus souples (164,6 à 165,7, indice 24). Reformulé en « En général… » / « In general… », texte visible et JSON-LD identiques. À valider.
- **Q-4** · de `tsa-redacteur` à l'orchestrateur · 2026-10-10 — La liste de la PR #110 (§ 9) ne cite pas la médiane de la section 4 des articles « polyester » (« juste au-dessus de la médiane du catalogue (215) », FR l. 375, EN l. 321) : corrigée en 217,3. Elle ne dit pas non plus que la transparence EN de l'article « tennis elbow » n'avait pas la ligne « une rigidité par cordage, pas par jauge » de la version FR : ajoutée pour que FR et EN disent la même chose.
- **Q-5** · de `tsa-redacteur` à `tsa-core` · 2026-10-10 — Information : la règle D (rigidité par jauge) et le lot 3 changeront de nouveau ces chiffres. `scripts/blog-covers/build-rigidite-figures.mts --check` échoue si un graphique ou un chiffre clé du texte ne colle plus à la base ; il peut être branché dans `audit:all` (propriétaire `tsa-measure`).
- **Q-6** · de `tsa-redacteur` à `tsa-pigiste` · 2026-10-10 — `npm run redaction:valeurs` était inutilisable sur `main` : `scripts/redaction/verifier-valeurs.mts` importe `racquetProfile`, retiré de `racquet-scoring.ts` par « aucune note déduite » (CLAUDE.md v2.3.1). Correctif minimal dans un commit isolé de cette PR (un champ `profil.*` est refusé, le reste est inchangé ; cinq cas négatifs rejetés). Le vérificateur est à `tsa-pigiste` : valider, ou le reprendre dans sa propre PR (le commit se retire sans effet sur le reste de la PR).
  - → `tsa-pigiste`, 2026-10-10 : **le correctif `4d128e0` me convient ; il reste tel quel dans #116.** (1) Il échoue fermé : toute ligne `profil.*` donne ECHEC et exit 1, au lieu de valider un chiffre qui n'existe plus. (2) Il ne relâche rien : `cordage`, `rcs` et les autres champs de raquette sont inchangés. (3) Il tient l'esprit de F2 : la règle d'origine refusait de mêler des profils de natures différentes ; le correctif refuse tout profil, mêlé ou non, puisque le site n'en affiche plus (CLAUDE.md v2.3.1) ; l'invariant (aucun profil de nature incertaine dans un article) est préservé, par un chemin plus strict. Essais sur 11 dossiers factices : anciennes valeurs NXT 152, NRG2 148 et Black Code 210 → ECHEC, exit 1 ; une ou deux lignes `profil.*` → ECHEC, exit 1 ; valeurs actuelles → OK, exit 0 ; indice RCS faux → ECHEC ; `ra` juste → OK ; « non publié » refusé quand la base a la donnée ; dossier sans bloc → exit 2. Trois suites, que je ferai sur **une branche dédiée de l'outil** (la PR est à ouvrir par l'orchestrateur ; aucune ne bloque #116 ; texte exact ci-dessous, essayé sur une copie jetable aussitôt supprimée : le dossier garde 173 valeurs et 0 écart, et le cas « 250 » pour 249,7 échoue) :
    - (a) l'en-tête est périmé : l'exemple `profil.controle` (l. 16) et la phrase « Les profils cités doivent tous être de même nature (dérivé des specs, ou combiné avec des avis) : sinon ECHEC (charte F2). » (l. 28-29) décrivent un contrôle qui n'existe plus. Remplacer la seconde par : « Aucun profil de raquette (`profil.*`) n'est accepté : le site n'en affiche plus depuis « aucune note de raquette déduite des caractéristiques » (CLAUDE.md v2.3.1), il n'y a donc plus de natures à mélanger (charte F2) ; toute ligne `profil.*` échoue. » et retirer la ligne d'exemple.
    - (b) le code mort ne peut plus se déclencher et laisse croire que la nature est contrôlée : retirer `const natures = new Map<string, string[]>();` (l. 147), le bloc `if (base.nature && subject.startsWith('raquette') && field.startsWith('profil.')) { … }` (l. 181-184), le bloc final `if (natures.size > 1) { … } else if (natures.size === 1) { … }` (l. 193-200) et simplifier la sortie OK en `${base.nature ?? ''}`.
    - (c) **trou de précision, qui touche cette PR** : `rigidite` n'a pas de `decimals`, donc la tolérance est de ±0,5 et « 250 » passe pour 249,7, « 243 » pour 242,9 (dossier factice d'une ligne, `cordage tecnifibre-black-code | rigidite | 250` : OK, exit 0, alors que la fiche affiche 249,7). Ajouter `const decimalsOf = (v: number | undefined) => (v === undefined ? 0 : (String(v).split('.')[1] ?? '').length);` et remplacer `case 'rigidite': return { value: s.stiffness };` par `case 'rigidite': return { value: s.stiffness, decimals: decimalsOf(s.stiffness) };` : « 250 » pour 249,7 échoue alors avec « écrire 1 décimale(s), comme la fiche ». Ce n'est qu'un durcissement. Je ne l'applique pas ici (le brief de cette passe limite mes écritures au dossier) ; les 542 contrôles stricts du § 5 ont tenu lieu de garde-fou pour ce lot.
    - Limite restante, antérieure au correctif : le vérificateur ne contrôle que les natures de profil ; il ne voit pas qu'on compare une note « éditoriale » à une note « harmonisée avec des avis de testeurs » (CLAUDE.md v2.3.8). Le tableau du § 4 des articles « polyester » ne cite que les 18 harmonisées, donc il n'y a pas d'écart ici. Et la panne a duré parce que le contrôle n'est pas dans `audit:all` : à proposer à `tsa-measure` (un `audit:redaction-valeurs` à cas négatifs et positif).

### Réponses du rédacteur à la passe du pigiste (§ 5, § 6) — reprise du 10/10/2026, tête `0001f9f` et suivantes

Méthode : toute valeur est recalculée par script sur la base finale (`build-rigidite-figures.mts`, générateurs de tableaux et de listes écrits pour l'occasion, puis un contrôle strict INDÉPENDANT qui relit les articles tels qu'écrits : 965 contrôles, 0 écart ; `--check` : 15 altérations volontaires, 15 détectées). Le pigiste désigne le fait ; la formulation est celle du rédacteur.

| # | Avant | Après | Fait |
|---|---|---|---|
| C-1 | FR « L'essentiel » : « prenez le plus souple : le Toroline O-Toro (165,7 lb/in) se place au niveau d'un multifilament sur l'indice » · EN « pick the softest: Toroline O-Toro (165.7 lb/in) plays close to a multifilament on the index » | « prenez l'un des plus souples : le Toroline O-Toro Snap (164,6 lb/in) et le Toroline O-Toro (165,7) se placent au niveau d'un multifilament sur l'indice » · EN « pick one of the softest: Toroline O-Toro Snap (164.6 lb/in) and Toroline O-Toro (165.7) play close to a multifilament on the index » | F2, F3 : Snap 164,6 (1er), O-Toro 165,7 (2e), Spin 173,2 (3e) ; indices 24, 24, 25 |
| C-1 | FR § 3 : « Sur l'indice, c'est la façon la plus douce pour le bras de continuer à jouer du polyester parmi les cordages que nous documentons. » · EN « it is the most arm-friendly way to keep playing poly among the strings we document » | « Le Toroline O-Toro Snap (164,6 lb/in), le polyester le plus souple du catalogue, fait de même ; sur l'indice, ce sont les deux polyesters les moins fermes que nous documentons. » · EN « So does Toroline O-Toro Snap (164.6 lb/in), the softest polyester in the catalogue; on the index, these are the two least firm polys we document. » | superlatif de santé retiré (F7) ; seuls deux polyesters ont l'indice 24 (assertion par script) |
| C-2 = S-2 | FAQ « Peut-on garder un polyester… » (visible et JSON-LD) : « un multifilament ou un boyau reste le choix le plus prudent » · EN « remains the safer choice » | « un multifilament ou un boyau reste en général plus prudent qu'un polyester » · EN « generally remains a more prudent choice than a polyester » ; 265 → 286,9 et 35 → 38 dans la même phrase | F14 : vrai en général (45 sur 45 sous la médiane), pas pour tous (NXT 173,7 > O-Toro 165,7) ; même formule que la FAQ n° 1 des articles polyester, FR et EN |
| C-3 | 8 occurrences : « Cela peut surestimer la rigidité d'une jauge plus fine » · « can overstate the stiffness of a finer gauge » | « Cela peut surestimer la rigidité d'une autre jauge de la fiche, mesurée plus souple (pas toujours la plus fine) » · EN « another gauge on the product page, one measured softer (not always the finest) » ; « pour une jauge fine » devient « pour cette jauge » / « pour ces jauges » | F17, F18 : la valeur † est la mesure de la jauge la plus rigide mesurée ; l'autre jauge est plus souple, pas toujours plus fine (NRG2, Black Code 1,32, Origin, Solstice Power) |
| C-4 | 4 légendes : « d'après la base du site et les mesures TWU » · ligne type de `CREDITS.md` | graphique polyesters : « Les points cerclés sont les 36 polyesters dont la rigidité est alignée sur une mesure du laboratoire TWU ; pour les 66 autres, c'est la valeur de notre fiche, pas une mesure TWU. Schéma Tennis String Advisor, d'après la base du site, état au 10 octobre 2026. » · graphique familles : « Ces valeurs sont celles de nos fiches : 48 des 179 sont alignées sur une mesure du laboratoire TWU (36 polyesters, 11 multifilaments, 1 synthétique), les autres ne sont pas des mesures TWU. » · `CREDITS.md` : même règle, nombre calculé par le script | F25 : 36 / 102, 11 / 45, 1 / 16, soit 48 / 179 ; le nombre est calculé par le script (jamais saisi) ; points cerclés dans le graphique, légende et `<title>` SVG |
| O-1 | Verdict express : « cet écart vaut 11 points d'indice RCS » | « cet écart vaut 13 à 14 points d'indice RCS » (EN « 13 to 14 RCS points ») | F26 : 13,3 avant arrondi ; 13, 14, 13 à RA 60, 65, 70 : vrai quelle que soit la raquette |
| O-2 | puce « Les rigidités sont celles de nos fiches » : « le Tecnifibre Black Code mesure 202,9 lb/in en 1.18 et 249,7 lb/in en 1.28 » | « TWU mesure le Tecnifibre Black Code à 202,9 lb/in en 1.18 et à 249,7 lb/in en 1.28, soit environ 5 points d'indice RCS d'écart » (EN « TWU measures the Tecnifibre Black Code at … ») | F17 : TWU, 51 lbs, « Fast » ; 46,8 lb/in = 5,1 points |
| O-3 | FR « cordage et tennis elbow » § 2 : « 92 lb/in, la valeur la plus basse des familles courantes du catalogue » | « 92 lb/in, l'une des valeurs les plus basses du catalogue » (corrigé au passage, hors liste de la reprise) | F23 : Touch Tonic 88, puis Touch VS et TGut à 92 |
| O-4 | FR « C'est la direction sûre pour le bras » · EN « It is the safe direction for the arm » ; FR « la voie la plus prudente reste de quitter le polyester » · EN « the safest route is still to leave polyester » | « C'est le sens établi par TWU : tension plus basse, rigidité plus basse » · EN « It is the direction established by TWU: lower tension, lower stiffness » ; « quitter le polyester reste en général plus prudent » · EN « leaving polyester generally remains the more prudent choice » ; mêmes retouches (« en général plus prudent ») dans l'encadré et la FAQ de l'article « meilleur cordage » | F7 : plus d'absolu ni de superlatif de santé ; les faits soutiennent le sens (TWU), pas le mot « sûre » |
| D-1 | « 20 plus souples », « 19 plus fermes », Verdict express « 35 », Mach-10 195, Lynx Tour 210, Poly Tour Pro 10e, « l'un des plus souples des 18 », « 11 points » | recalculés sur la base finale : 15 plus souples, 21 plus fermes (jusqu'à 286,9, indices 32 à 38), Mach-10 222,3, Lynx Tour 228,6, Poly Tour Pro 7e, 13 à 14 points | les hausses du lot 3 sont appliquées : les articles les suivent (F1). Il reste 53 baisses en attente du GO de Pierre : `--check` signalera les écarts à la première décision |
| Phrases devenues fausses (lot 3) | « O-Toro et Mach-10 sont les deux polyesters les plus souples des 18 » · « Poly Tour Pro 10e en souplesse, plus rigide que le Lynx Tour » · « Signum Pro X-Perience, un des plus souples des 18 (3e) » · « Mach-10 et O-Toro ressortent sur les deux tableaux » · « 260 à 265 lb/in (35) » · « les plus rigides donnent 35 » | « O-Toro de loin le plus souple des 18 (4e au classement), devant le Poly Tour Rev (2e plus souple, 14e) » · « Poly Tour Pro 7e en souplesse, rigidité égale à la médiane (220) » ; « Mach-10 1er en confort, 8e en souplesse » ; « Hyper-G 6e en souplesse, 9e en confort » à la place de la X-Perience · « O-Toro et Poly Tour Rev dans les quatre premiers sur les deux critères » · 262 (35), 276 (36), 280,6 (37), 286,9 (38) · « les plus rigides donnent 36 à 38 » | F12, F27, F28, F29 ; le tableau du § 4 passe de 5 à 6 lignes (Poly Tour Rev ajouté, Hyper-G à la place de la X-Perience) |
| Nouvelle phrase de santé | raquettes (FR et EN), § 4 | « avec ce même exemple : le configurateur avertit un profil « bras sensible » dès l'indice 32 (35 pour les autres profils). Neuf des 18 raquettes, celles dont le RA est de 66 ou plus, atteignent 32 avec ce cordage à 22 kg ; aucune n'atteint 35. » · next gen : « Pour un profil « bras sensible », le configurateur avertit dès 32 : à 26 kg, la Blade en ALU Power et la Speed MP en Lynx Tour y arrivent. » | F30, F31 : la colonne RCS monte de 2 points, et l'exemple atteint maintenant le seuil de 32 |

---

## 5. Fact-check final — `tsa-pigiste`

### Valeurs produit (contrôle automatique)

Chaque valeur produit affichée par l'article, FR et EN, y compris dans les
tableaux, telle qu'elle est écrite (les valeurs EN sont identiques, avec le point
décimal). Champs : voir l'en-tête de `scripts/redaction/verifier-valeurs.mts`.
Le bloc a été généré depuis la base puis relu ; la raquette citée par chaque ligne `rcs` n'est qu'un
support de calcul (RA 60 : `head-gravity-team`, RA 65 : `head-extreme-standard`, RA 70 : `head-instinct-pwr-115`) : les articles parlent de « RA 60, 65, 70 », pas de ces raquettes.

Passe n° 2 (reprise du 10/10/2026, base finale) : le bloc est regénéré en entier et couvre, en plus des quatre articles santé (sections A et B), « meilleur cordage polyester 2026 » (C), « meilleures raquettes 2026 » (D, avec les vrais identifiants de raquette) et le tableau 3 de l'article « matériel next gen » (E). Les rigidités sont écrites avec TOUTES leurs décimales : le vérificateur n'impose pas la précision de la fiche pour `rigidite` (§ 4, Q-6 c), un « 250 » passerait pour 249,7. Les agrégats (médiane, plages et effectifs par famille, nombre de fiches alignées sur TWU, seuils en kg du tableau 3, rangs de souplesse sur 18) ne se vérifient pas ligne à ligne : ils sont couverts par `build-rigidite-figures.mts --check` (qui relit le texte des quatre articles santé) et par le § 2 (F2 à F12, F24 à F31). Le contrôle des tableaux et des listes tels qu'écrits dans les articles est fait à part, par un script indépendant des générateurs (965 contrôles, 0 écart ; résultat au journal du § 7, script non versionné).

```valeurs-produit
# sujet                                   | champ           | valeur citée | où
# ===== A. Polyester et tennis elbow (FR + EN) — § 2 : tableau des 15 polyesters à 200 lb/in ou moins (rigidité, puis indice RA 60 / 65 / 70 à 22 kg)
cordage toroline-o-toro-snap                 | rigidite | 164,6  | poly §2 tableau
rcs head-gravity-team + toroline-o-toro-snap @ 22                      | rcs | 23     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-o-toro-snap @ 22                  | rcs | 24     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-o-toro-snap @ 22                  | rcs | 26     | poly §2 tableau RA 70
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
cordage isospeed-cream                       | rigidite | 177,7  | poly §2 tableau
rcs head-gravity-team + isospeed-cream @ 22                            | rcs | 24     | poly §2 tableau RA 60
rcs head-extreme-standard + isospeed-cream @ 22                        | rcs | 26     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + isospeed-cream @ 22                        | rcs | 27     | poly §2 tableau RA 70
cordage toroline-absolute                    | rigidite | 180,6  | poly §2 tableau
rcs head-gravity-team + toroline-absolute @ 22                         | rcs | 24     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-absolute @ 22                     | rcs | 26     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-absolute @ 22                     | rcs | 28     | poly §2 tableau RA 70
cordage toroline-cash                        | rigidite | 182,9  | poly §2 tableau
rcs head-gravity-team + toroline-cash @ 22                             | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-cash @ 22                         | rcs | 26     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-cash @ 22                         | rcs | 28     | poly §2 tableau RA 70
cordage toroline-super-toro                  | rigidite | 189,7  | poly §2 tableau
rcs head-gravity-team + toroline-super-toro @ 22                       | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-super-toro @ 22                   | rcs | 27     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-super-toro @ 22                   | rcs | 29     | poly §2 tableau RA 70
cordage luxilon-eco-rough                    | rigidite | 190    | poly §2 tableau
rcs head-gravity-team + luxilon-eco-rough @ 22                         | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + luxilon-eco-rough @ 22                     | rcs | 27     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + luxilon-eco-rough @ 22                     | rcs | 29     | poly §2 tableau RA 70
cordage toroline-snapper                     | rigidite | 190,9  | poly §2 tableau
rcs head-gravity-team + toroline-snapper @ 22                          | rcs | 25     | poly §2 tableau RA 60
rcs head-extreme-standard + toroline-snapper @ 22                      | rcs | 27     | poly §2 tableau RA 65
rcs head-instinct-pwr-115 + toroline-snapper @ 22                      | rcs | 29     | poly §2 tableau RA 70
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
# ===== A. § 3 : liste des 21 polyesters à 240 lb/in ou plus (rigidité ; indice RA 65 à 22 kg donné par groupe) et bornes RA 70 (34 à 39)
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
cordage babolat-revenge                      | rigidite | 276    | poly §3 liste
rcs head-extreme-standard + babolat-revenge @ 22                       | rcs | 36     | poly §3 indice du groupe, RA 65
cordage babolat-rpm-team                     | rigidite | 280,6  | poly §3 liste
rcs head-extreme-standard + babolat-rpm-team @ 22                      | rcs | 37     | poly §3 indice du groupe, RA 65
cordage luxilon-4g                           | rigidite | 286,9  | poly §3 liste
rcs head-extreme-standard + luxilon-4g @ 22                            | rcs | 38     | poly §3 indice du groupe, RA 65
rcs head-instinct-pwr-115 + babolat-rpm-blast @ 22                     | rcs | 34     | poly §3 borne basse RA 70
rcs head-instinct-pwr-115 + luxilon-4g @ 22                            | rcs | 39     | poly §3 borne haute RA 70
# ===== A. § 4 : tableau confort ressenti / rigidité (rigidité et note de confort de la fiche, une décimale)
cordage yonex-poly-tour-pro                  | rigidite | 220    | poly §4 tableau
cordage yonex-poly-tour-pro                  | confort  | 8,6    | poly §4 tableau, note de confort
cordage solinco-mach-10                      | rigidite | 222,3  | poly §4 tableau
cordage solinco-mach-10                      | confort  | 8,8    | poly §4 tableau, note de confort
cordage solinco-confidential                 | rigidite | 245    | poly §4 tableau
cordage solinco-confidential                 | confort  | 7,3    | poly §4 tableau, note de confort
cordage solinco-hyper-g                      | rigidite | 218,3  | poly §4 tableau
cordage solinco-hyper-g                      | confort  | 7,6    | poly §4 tableau, note de confort
cordage toroline-o-toro                      | rigidite | 165,7  | poly §4 tableau
cordage toroline-o-toro                      | confort  | 8,1    | poly §4 tableau, note de confort
cordage yonex-poly-tour-rev                  | rigidite | 205    | poly §4 tableau
cordage yonex-poly-tour-rev                  | confort  | 8,0    | poly §4 tableau, note de confort
# ===== A. § 5 : leviers (Luxilon 4G à 22 kg, RA 65 ; autre cadre ; autre tension ; autre cordage)
rcs head-extreme-standard + luxilon-4g @ 22                            | rcs | 38     | poly §5 point de départ
rcs head-extreme-standard + toroline-o-toro @ 22                       | rcs | 24     | poly §5 changer de cordage
rcs head-gravity-team + luxilon-4g @ 22                                | rcs | 36     | poly §5 changer de cadre, RA 60
rcs head-instinct-pwr-115 + luxilon-4g @ 22                            | rcs | 39     | poly §5 cadre RA 70
rcs head-extreme-standard + luxilon-4g @ 18                            | rcs | 36     | poly §5 baisser la tension de 4 kg
# ===== B. Cordage et tennis elbow (FR + EN) — tableau des 17 cordages (RA 65, 22 kg) : rigidité et indice de chaque ligne
cordage babolat-touch-vs                     | rigidite | 92     | tennis elbow tableau 17
rcs head-extreme-standard + babolat-touch-vs @ 22                      | rcs | 16     | tennis elbow tableau 17
cordage babolat-xcel                         | rigidite | 155    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-xcel @ 22                          | rcs | 23     | tennis elbow tableau 17
cordage tecnifibre-nrg2                      | rigidite | 164    | tennis elbow tableau 17
rcs head-extreme-standard + tecnifibre-nrg2 @ 22                       | rcs | 24     | tennis elbow tableau 17
cordage head-velocity-mlt                    | rigidite | 165    | tennis elbow tableau 17
rcs head-extreme-standard + head-velocity-mlt @ 22                     | rcs | 24     | tennis elbow tableau 17
cordage toroline-o-toro                      | rigidite | 165,7  | tennis elbow tableau 17
rcs head-extreme-standard + toroline-o-toro @ 22                       | rcs | 24     | tennis elbow tableau 17
cordage tecnifibre-x-one-biphase             | rigidite | 166,9  | tennis elbow tableau 17
rcs head-extreme-standard + tecnifibre-x-one-biphase @ 22              | rcs | 24     | tennis elbow tableau 17
cordage babolat-hybrid-rpm-blast-vs-touch    | rigidite | 168    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-hybrid-rpm-blast-vs-touch @ 22     | rcs | 25     | tennis elbow tableau 17
cordage wilson-nxt                           | rigidite | 173,7  | tennis elbow tableau 17
rcs head-extreme-standard + wilson-nxt @ 22                            | rcs | 25     | tennis elbow tableau 17
cordage tecnifibre-hybrid-razor-code-x-one   | rigidite | 180    | tennis elbow tableau 17
rcs head-extreme-standard + tecnifibre-hybrid-razor-code-x-one @ 22    | rcs | 26     | tennis elbow tableau 17
cordage prince-synthetic-gut                 | rigidite | 185    | tennis elbow tableau 17
rcs head-extreme-standard + prince-synthetic-gut @ 22                  | rcs | 26     | tennis elbow tableau 17
cordage babolat-hybrid-rpm-blast-xcel        | rigidite | 192    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-hybrid-rpm-blast-xcel @ 22         | rcs | 27     | tennis elbow tableau 17
cordage yonex-poly-tour-air                  | rigidite | 195    | tennis elbow tableau 17
rcs head-extreme-standard + yonex-poly-tour-air @ 22                   | rcs | 28     | tennis elbow tableau 17
cordage babolat-rpm-soft                     | rigidite | 205    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-rpm-soft @ 22                      | rcs | 29     | tennis elbow tableau 17
cordage luxilon-element                      | rigidite | 208    | tennis elbow tableau 17
rcs head-extreme-standard + luxilon-element @ 22                       | rcs | 29     | tennis elbow tableau 17
cordage luxilon-alu-power                    | rigidite | 230    | tennis elbow tableau 17
rcs head-extreme-standard + luxilon-alu-power @ 22                     | rcs | 31     | tennis elbow tableau 17
cordage babolat-rpm-blast                    | rigidite | 240    | tennis elbow tableau 17
rcs head-extreme-standard + babolat-rpm-blast @ 22                     | rcs | 32     | tennis elbow tableau 17
cordage luxilon-4g                           | rigidite | 286,9  | tennis elbow tableau 17
rcs head-extreme-standard + luxilon-4g @ 22                            | rcs | 38     | tennis elbow tableau 17
# ===== B. leviers (point de départ Luxilon ALU Power à 22 kg, RA 65) : tension, cadre ; FAQ n° 3 et « L'essentiel » : O-Toro Snap, O-Toro, 4G
rcs head-extreme-standard + luxilon-alu-power @ 18                     | rcs | 29     | tennis elbow leviers, tension 18 kg
rcs head-gravity-team + luxilon-alu-power @ 22                         | rcs | 30     | tennis elbow leviers, RA 60
cordage toroline-o-toro-snap                 | rigidite | 164,6  | tennis elbow « L'essentiel » et § 3 « une surprise »
rcs head-extreme-standard + toroline-o-toro-snap @ 22                  | rcs | 24     | tennis elbow § 3 « une surprise » (même indice que l'O-Toro)
cordage luxilon-4g                           | rigidite | 286,9  | tennis elbow FAQ n° 3
rcs head-extreme-standard + luxilon-4g @ 22                            | rcs | 38     | tennis elbow FAQ n° 3
# ===== C. Meilleur cordage polyester 2026 (FR + EN) — tableau des 18 : rigidité, indice (RA 65, 22 kg), avis testeurs /20 et niveau (ces deux colonnes ne sont pas touchées, contrôlées par prudence)
cordage head-lynx-tour                       | rigidite | 228,6  | meilleur cordage tableau des 18
rcs head-extreme-standard + head-lynx-tour @ 22                        | rcs | 31     | meilleur cordage tableau des 18
cordage head-lynx-tour                       | testeurs20 | 16,3   | meilleur cordage tableau des 18
cordage head-lynx-tour                       | palier   | S      | meilleur cordage tableau des 18
cordage solinco-confidential                 | rigidite | 245    | meilleur cordage tableau des 18
rcs head-extreme-standard + solinco-confidential @ 22                  | rcs | 33     | meilleur cordage tableau des 18
cordage solinco-confidential                 | testeurs20 | 15,6   | meilleur cordage tableau des 18
cordage solinco-confidential                 | palier   | A      | meilleur cordage tableau des 18
cordage solinco-mach-10                      | rigidite | 222,3  | meilleur cordage tableau des 18
rcs head-extreme-standard + solinco-mach-10 @ 22                       | rcs | 31     | meilleur cordage tableau des 18
cordage solinco-mach-10                      | testeurs20 | 15,5   | meilleur cordage tableau des 18
cordage solinco-mach-10                      | palier   | A      | meilleur cordage tableau des 18
cordage toroline-o-toro                      | rigidite | 165,7  | meilleur cordage tableau des 18
rcs head-extreme-standard + toroline-o-toro @ 22                       | rcs | 24     | meilleur cordage tableau des 18
cordage toroline-o-toro                      | testeurs20 | 15,3   | meilleur cordage tableau des 18
cordage toroline-o-toro                      | palier   | A      | meilleur cordage tableau des 18
cordage head-hawk-touch                      | rigidite | 215    | meilleur cordage tableau des 18
rcs head-extreme-standard + head-hawk-touch @ 22                       | rcs | 30     | meilleur cordage tableau des 18
cordage head-hawk-touch                      | testeurs20 | 14,8   | meilleur cordage tableau des 18
cordage head-hawk-touch                      | palier   | B      | meilleur cordage tableau des 18
cordage restring-zero                        | rigidite | 210    | meilleur cordage tableau des 18
rcs head-extreme-standard + restring-zero @ 22                         | rcs | 29     | meilleur cordage tableau des 18
cordage restring-zero                        | testeurs20 | 14,8   | meilleur cordage tableau des 18
cordage restring-zero                        | palier   | B      | meilleur cordage tableau des 18
cordage solinco-hyper-g                      | rigidite | 218,3  | meilleur cordage tableau des 18
rcs head-extreme-standard + solinco-hyper-g @ 22                       | rcs | 30     | meilleur cordage tableau des 18
cordage solinco-hyper-g                      | testeurs20 | 14,6   | meilleur cordage tableau des 18
cordage solinco-hyper-g                      | palier   | B      | meilleur cordage tableau des 18
cordage luxilon-4g                           | rigidite | 286,9  | meilleur cordage tableau des 18
rcs head-extreme-standard + luxilon-4g @ 22                            | rcs | 38     | meilleur cordage tableau des 18
cordage luxilon-4g                           | testeurs20 | 14,5   | meilleur cordage tableau des 18
cordage luxilon-4g                           | palier   | B      | meilleur cordage tableau des 18
cordage solinco-tour-bite                    | rigidite | 255    | meilleur cordage tableau des 18
rcs head-extreme-standard + solinco-tour-bite @ 22                     | rcs | 34     | meilleur cordage tableau des 18
cordage solinco-tour-bite                    | testeurs20 | 14,4   | meilleur cordage tableau des 18
cordage solinco-tour-bite                    | palier   | B      | meilleur cordage tableau des 18
cordage signum-pro-x-perience                | rigidite | 224,6  | meilleur cordage tableau des 18
rcs head-extreme-standard + signum-pro-x-perience @ 22                 | rcs | 31     | meilleur cordage tableau des 18
cordage signum-pro-x-perience                | testeurs20 | 13,6   | meilleur cordage tableau des 18
cordage signum-pro-x-perience                | palier   | C      | meilleur cordage tableau des 18
cordage babolat-rpm-rough                    | rigidite | 235    | meilleur cordage tableau des 18
rcs head-extreme-standard + babolat-rpm-rough @ 22                     | rcs | 32     | meilleur cordage tableau des 18
cordage babolat-rpm-rough                    | testeurs20 | 13,3   | meilleur cordage tableau des 18
cordage babolat-rpm-rough                    | palier   | C      | meilleur cordage tableau des 18
cordage volkl-cyclone                        | rigidite | 215    | meilleur cordage tableau des 18
rcs head-extreme-standard + volkl-cyclone @ 22                         | rcs | 30     | meilleur cordage tableau des 18
cordage volkl-cyclone                        | testeurs20 | 13,3   | meilleur cordage tableau des 18
cordage volkl-cyclone                        | palier   | C      | meilleur cordage tableau des 18
cordage luxilon-alu-power                    | rigidite | 230    | meilleur cordage tableau des 18
rcs head-extreme-standard + luxilon-alu-power @ 22                     | rcs | 31     | meilleur cordage tableau des 18
cordage luxilon-alu-power                    | testeurs20 | 13,2   | meilleur cordage tableau des 18
cordage luxilon-alu-power                    | palier   | C      | meilleur cordage tableau des 18
cordage yonex-poly-tour-rev                  | rigidite | 205    | meilleur cordage tableau des 18
rcs head-extreme-standard + yonex-poly-tour-rev @ 22                   | rcs | 29     | meilleur cordage tableau des 18
cordage yonex-poly-tour-rev                  | testeurs20 | 13,0   | meilleur cordage tableau des 18
cordage yonex-poly-tour-rev                  | palier   | C      | meilleur cordage tableau des 18
cordage babolat-rpm-blast                    | rigidite | 240    | meilleur cordage tableau des 18
rcs head-extreme-standard + babolat-rpm-blast @ 22                     | rcs | 32     | meilleur cordage tableau des 18
cordage babolat-rpm-blast                    | testeurs20 | 12,4   | meilleur cordage tableau des 18
cordage babolat-rpm-blast                    | palier   | D      | meilleur cordage tableau des 18
cordage yonex-poly-tour-pro                  | rigidite | 220    | meilleur cordage tableau des 18
rcs head-extreme-standard + yonex-poly-tour-pro @ 22                   | rcs | 30     | meilleur cordage tableau des 18
cordage yonex-poly-tour-pro                  | testeurs20 | 12,3   | meilleur cordage tableau des 18
cordage yonex-poly-tour-pro                  | palier   | D      | meilleur cordage tableau des 18
cordage babolat-rpm-team                     | rigidite | 280,6  | meilleur cordage tableau des 18
rcs head-extreme-standard + babolat-rpm-team @ 22                      | rcs | 37     | meilleur cordage tableau des 18
cordage babolat-rpm-team                     | testeurs20 | 11,9   | meilleur cordage tableau des 18
cordage babolat-rpm-team                     | palier   | D      | meilleur cordage tableau des 18
cordage weiss-cannon-ultra-cable             | rigidite | 250    | meilleur cordage tableau des 18
rcs head-extreme-standard + weiss-cannon-ultra-cable @ 22              | rcs | 34     | meilleur cordage tableau des 18
cordage weiss-cannon-ultra-cable             | testeurs20 | 11,6   | meilleur cordage tableau des 18
cordage weiss-cannon-ultra-cable             | palier   | D      | meilleur cordage tableau des 18
# ===== C. phrases : § 4 (le 4G à 18 kg ; RA 70 pour le 4G et le Tour Bite), moyenne des 18 citée à 230,4 (agrégat : voir le § 2 du dossier), Poly Tour Rev (205) et Poly Tour Pro (220)
rcs head-extreme-standard + luxilon-4g @ 18                            | rcs | 36     | meilleur cordage § 4, 4G à 18 kg
rcs head-instinct-pwr-115 + luxilon-4g @ 22                            | rcs | 39     | meilleur cordage § 4, 4G en RA 70
rcs head-instinct-pwr-115 + solinco-tour-bite @ 22                     | rcs | 36     | meilleur cordage § 4, Tour Bite en RA 70
# ===== D. Meilleures raquettes 2026 (FR + EN) — tableau des 18 : RA et indice avec le Head Lynx Tour à 22 kg ; rigidité du Head Lynx Tour
cordage head-lynx-tour                       | rigidite | 228,6  | raquettes § 2, cordage de l'exemple
raquette babolat-pure-aero-standard     | ra | 66     | raquettes tableau des 18
rcs babolat-pure-aero-standard + head-lynx-tour @ 22                   | rcs | 32     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette babolat-pure-drive-standard    | ra | 69     | raquettes tableau des 18
rcs babolat-pure-drive-standard + head-lynx-tour @ 22                  | rcs | 33     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette tecnifibre-tfight-305s-id      | ra | 63     | raquettes tableau des 18
rcs tecnifibre-tfight-305s-id + head-lynx-tour @ 22                    | rcs | 31     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette yonex-ezone-100                | ra | 68     | raquettes tableau des 18
rcs yonex-ezone-100 + head-lynx-tour @ 22                              | rcs | 32     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette yonex-vcore-98                 | ra | 64     | raquettes tableau des 18
rcs yonex-vcore-98 + head-lynx-tour @ 22                               | rcs | 31     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette wilson-defyer-98-pro-v1        | ra | 64     | raquettes tableau des 18
rcs wilson-defyer-98-pro-v1 + head-lynx-tour @ 22                      | rcs | 31     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette yonex-percept-100d             | ra | 66     | raquettes tableau des 18
rcs yonex-percept-100d + head-lynx-tour @ 22                           | rcs | 32     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette dunlop-fx-500                  | ra | 69     | raquettes tableau des 18
rcs dunlop-fx-500 + head-lynx-tour @ 22                                | rcs | 33     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette yonex-vcore-100                | ra | 65     | raquettes tableau des 18
rcs yonex-vcore-100 + head-lynx-tour @ 22                              | rcs | 31     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette head-speed-mp                  | ra | 61     | raquettes tableau des 18
rcs head-speed-mp + head-lynx-tour @ 22                                | rcs | 30     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette yonex-percept-100              | ra | 66     | raquettes tableau des 18
rcs yonex-percept-100 + head-lynx-tour @ 22                            | rcs | 32     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette yonex-vcore-95                 | ra | 62     | raquettes tableau des 18
rcs yonex-vcore-95 + head-lynx-tour @ 22                               | rcs | 30     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette yonex-ezone-98                 | ra | 63     | raquettes tableau des 18
rcs yonex-ezone-98 + head-lynx-tour @ 22                               | rcs | 31     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette wilson-defyer-100-v1           | ra | 66     | raquettes tableau des 18
rcs wilson-defyer-100-v1 + head-lynx-tour @ 22                         | rcs | 32     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette babolat-pure-aero-98           | ra | 66     | raquettes tableau des 18
rcs babolat-pure-aero-98 + head-lynx-tour @ 22                         | rcs | 32     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette head-gravity-tour              | ra | 59     | raquettes tableau des 18
rcs head-gravity-tour + head-lynx-tour @ 22                            | rcs | 29     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette wilson-ultra-100-v5            | ra | 67     | raquettes tableau des 18
rcs wilson-ultra-100-v5 + head-lynx-tour @ 22                          | rcs | 32     | raquettes tableau des 18, § 3 profils, § 4 par RA
raquette head-boom-pro-2024             | ra | 64     | raquettes tableau des 18
rcs head-boom-pro-2024 + head-lynx-tour @ 22                           | rcs | 31     | raquettes tableau des 18, § 3 profils, § 4 par RA
# ===== E. Matériel next gen (FR) — tableau 2 (Lynx Tour) et tableau 3 : RA, raideur, indice à 22 / 24 / 26 kg des trois montages du commerce (seuils de kg : agrégat, voir le § 2 du dossier)
cordage head-lynx-tour                       | rigidite | 228,6  | next gen tableau 2 et tableau 3, ligne Jódar
cordage luxilon-alu-power                    | rigidite | 230    | next gen tableau 2 et tableau 3, ligne Mensík
cordage yonex-poly-tour-strike               | rigidite | 215    | next gen tableau 3, ligne Fonseca
raquette yonex-vcore-98                 | ra | 64     | next gen tableau 3
rcs yonex-vcore-98 + yonex-poly-tour-strike @ 22                       | rcs | 29     | next gen tableau 3
rcs yonex-vcore-98 + yonex-poly-tour-strike @ 24                       | rcs | 30     | next gen tableau 3
rcs yonex-vcore-98 + yonex-poly-tour-strike @ 26                       | rcs | 31     | next gen tableau 3
raquette wilson-blade-98-18x20-v9       | ra | 62     | next gen tableau 3
rcs wilson-blade-98-18x20-v9 + luxilon-alu-power @ 22                  | rcs | 30     | next gen tableau 3
rcs wilson-blade-98-18x20-v9 + luxilon-alu-power @ 24                  | rcs | 31     | next gen tableau 3
rcs wilson-blade-98-18x20-v9 + luxilon-alu-power @ 26                  | rcs | 32     | next gen tableau 3
raquette head-speed-mp                  | ra | 61     | next gen tableau 3
rcs head-speed-mp + head-lynx-tour @ 22                                | rcs | 30     | next gen tableau 3
rcs head-speed-mp + head-lynx-tour @ 24                                | rcs | 31     | next gen tableau 3
rcs head-speed-mp + head-lynx-tour @ 26                                | rcs | 32     | next gen tableau 3
```

Sortie de `npm run redaction:valeurs -- docs/redaction/coherence-chiffres-regle-c.md` :

```


> tennis-string-advisor@2.10.0 redaction:valeurs
> npx --yes tsx scripts/redaction/verifier-valeurs.mts docs/redaction/coherence-chiffres-regle-c.md

  OK    cordage toroline-o-toro-snap | rigidite | 164,6
  OK    rcs head-gravity-team + toroline-o-toro-snap @ 22 | rcs | 23
  OK    rcs head-extreme-standard + toroline-o-toro-snap @ 22 | rcs | 24
  OK    rcs head-instinct-pwr-115 + toroline-o-toro-snap @ 22 | rcs | 26
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
  OK    cordage isospeed-cream | rigidite | 177,7
  OK    rcs head-gravity-team + isospeed-cream @ 22 | rcs | 24
  OK    rcs head-extreme-standard + isospeed-cream @ 22 | rcs | 26
  OK    rcs head-instinct-pwr-115 + isospeed-cream @ 22 | rcs | 27
  OK    cordage toroline-absolute | rigidite | 180,6
  OK    rcs head-gravity-team + toroline-absolute @ 22 | rcs | 24
  OK    rcs head-extreme-standard + toroline-absolute @ 22 | rcs | 26
  OK    rcs head-instinct-pwr-115 + toroline-absolute @ 22 | rcs | 28
  OK    cordage toroline-cash | rigidite | 182,9
  OK    rcs head-gravity-team + toroline-cash @ 22 | rcs | 25
  OK    rcs head-extreme-standard + toroline-cash @ 22 | rcs | 26
  OK    rcs head-instinct-pwr-115 + toroline-cash @ 22 | rcs | 28
  OK    cordage toroline-super-toro | rigidite | 189,7
  OK    rcs head-gravity-team + toroline-super-toro @ 22 | rcs | 25
  OK    rcs head-extreme-standard + toroline-super-toro @ 22 | rcs | 27
  OK    rcs head-instinct-pwr-115 + toroline-super-toro @ 22 | rcs | 29
  OK    cordage luxilon-eco-rough | rigidite | 190
  OK    rcs head-gravity-team + luxilon-eco-rough @ 22 | rcs | 25
  OK    rcs head-extreme-standard + luxilon-eco-rough @ 22 | rcs | 27
  OK    rcs head-instinct-pwr-115 + luxilon-eco-rough @ 22 | rcs | 29
  OK    cordage toroline-snapper | rigidite | 190,9
  OK    rcs head-gravity-team + toroline-snapper @ 22 | rcs | 25
  OK    rcs head-extreme-standard + toroline-snapper @ 22 | rcs | 27
  OK    rcs head-instinct-pwr-115 + toroline-snapper @ 22 | rcs | 29
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
  OK    cordage babolat-revenge | rigidite | 276
  OK    rcs head-extreme-standard + babolat-revenge @ 22 | rcs | 36
  OK    cordage babolat-rpm-team | rigidite | 280,6
  OK    rcs head-extreme-standard + babolat-rpm-team @ 22 | rcs | 37
  OK    cordage luxilon-4g | rigidite | 286,9
  OK    rcs head-extreme-standard + luxilon-4g @ 22 | rcs | 38
  OK    rcs head-instinct-pwr-115 + babolat-rpm-blast @ 22 | rcs | 34
  OK    rcs head-instinct-pwr-115 + luxilon-4g @ 22 | rcs | 39
  OK    cordage yonex-poly-tour-pro | rigidite | 220
  OK    cordage yonex-poly-tour-pro | confort | 8,6
  OK    cordage solinco-mach-10 | rigidite | 222,3
  OK    cordage solinco-mach-10 | confort | 8,8
  OK    cordage solinco-confidential | rigidite | 245
  OK    cordage solinco-confidential | confort | 7,3
  OK    cordage solinco-hyper-g | rigidite | 218,3
  OK    cordage solinco-hyper-g | confort | 7,6
  OK    cordage toroline-o-toro | rigidite | 165,7
  OK    cordage toroline-o-toro | confort | 8,1
  OK    cordage yonex-poly-tour-rev | rigidite | 205
  OK    cordage yonex-poly-tour-rev | confort | 8,0
  OK    rcs head-extreme-standard + luxilon-4g @ 22 | rcs | 38
  OK    rcs head-extreme-standard + toroline-o-toro @ 22 | rcs | 24
  OK    rcs head-gravity-team + luxilon-4g @ 22 | rcs | 36
  OK    rcs head-instinct-pwr-115 + luxilon-4g @ 22 | rcs | 39
  OK    rcs head-extreme-standard + luxilon-4g @ 18 | rcs | 36
  OK    cordage babolat-touch-vs | rigidite | 92
  OK    rcs head-extreme-standard + babolat-touch-vs @ 22 | rcs | 16
  OK    cordage babolat-xcel | rigidite | 155
  OK    rcs head-extreme-standard + babolat-xcel @ 22 | rcs | 23
  OK    cordage tecnifibre-nrg2 | rigidite | 164
  OK    rcs head-extreme-standard + tecnifibre-nrg2 @ 22 | rcs | 24
  OK    cordage head-velocity-mlt | rigidite | 165
  OK    rcs head-extreme-standard + head-velocity-mlt @ 22 | rcs | 24
  OK    cordage toroline-o-toro | rigidite | 165,7
  OK    rcs head-extreme-standard + toroline-o-toro @ 22 | rcs | 24
  OK    cordage tecnifibre-x-one-biphase | rigidite | 166,9
  OK    rcs head-extreme-standard + tecnifibre-x-one-biphase @ 22 | rcs | 24
  OK    cordage babolat-hybrid-rpm-blast-vs-touch | rigidite | 168
  OK    rcs head-extreme-standard + babolat-hybrid-rpm-blast-vs-touch @ 22 | rcs | 25
  OK    cordage wilson-nxt | rigidite | 173,7
  OK    rcs head-extreme-standard + wilson-nxt @ 22 | rcs | 25
  OK    cordage tecnifibre-hybrid-razor-code-x-one | rigidite | 180
  OK    rcs head-extreme-standard + tecnifibre-hybrid-razor-code-x-one @ 22 | rcs | 26
  OK    cordage prince-synthetic-gut | rigidite | 185
  OK    rcs head-extreme-standard + prince-synthetic-gut @ 22 | rcs | 26
  OK    cordage babolat-hybrid-rpm-blast-xcel | rigidite | 192
  OK    rcs head-extreme-standard + babolat-hybrid-rpm-blast-xcel @ 22 | rcs | 27
  OK    cordage yonex-poly-tour-air | rigidite | 195
  OK    rcs head-extreme-standard + yonex-poly-tour-air @ 22 | rcs | 28
  OK    cordage babolat-rpm-soft | rigidite | 205
  OK    rcs head-extreme-standard + babolat-rpm-soft @ 22 | rcs | 29
  OK    cordage luxilon-element | rigidite | 208
  OK    rcs head-extreme-standard + luxilon-element @ 22 | rcs | 29
  OK    cordage luxilon-alu-power | rigidite | 230
  OK    rcs head-extreme-standard + luxilon-alu-power @ 22 | rcs | 31
  OK    cordage babolat-rpm-blast | rigidite | 240
  OK    rcs head-extreme-standard + babolat-rpm-blast @ 22 | rcs | 32
  OK    cordage luxilon-4g | rigidite | 286,9
  OK    rcs head-extreme-standard + luxilon-4g @ 22 | rcs | 38
  OK    rcs head-extreme-standard + luxilon-alu-power @ 18 | rcs | 29
  OK    rcs head-gravity-team + luxilon-alu-power @ 22 | rcs | 30
  OK    cordage toroline-o-toro-snap | rigidite | 164,6
  OK    rcs head-extreme-standard + toroline-o-toro-snap @ 22 | rcs | 24
  OK    cordage luxilon-4g | rigidite | 286,9
  OK    rcs head-extreme-standard + luxilon-4g @ 22 | rcs | 38
  OK    cordage head-lynx-tour | rigidite | 228,6
  OK    rcs head-extreme-standard + head-lynx-tour @ 22 | rcs | 31
  OK    cordage head-lynx-tour | testeurs20 | 16,3
  OK    cordage head-lynx-tour | palier | S
  OK    cordage solinco-confidential | rigidite | 245
  OK    rcs head-extreme-standard + solinco-confidential @ 22 | rcs | 33
  OK    cordage solinco-confidential | testeurs20 | 15,6
  OK    cordage solinco-confidential | palier | A
  OK    cordage solinco-mach-10 | rigidite | 222,3
  OK    rcs head-extreme-standard + solinco-mach-10 @ 22 | rcs | 31
  OK    cordage solinco-mach-10 | testeurs20 | 15,5
  OK    cordage solinco-mach-10 | palier | A
  OK    cordage toroline-o-toro | rigidite | 165,7
  OK    rcs head-extreme-standard + toroline-o-toro @ 22 | rcs | 24
  OK    cordage toroline-o-toro | testeurs20 | 15,3
  OK    cordage toroline-o-toro | palier | A
  OK    cordage head-hawk-touch | rigidite | 215
  OK    rcs head-extreme-standard + head-hawk-touch @ 22 | rcs | 30
  OK    cordage head-hawk-touch | testeurs20 | 14,8
  OK    cordage head-hawk-touch | palier | B
  OK    cordage restring-zero | rigidite | 210
  OK    rcs head-extreme-standard + restring-zero @ 22 | rcs | 29
  OK    cordage restring-zero | testeurs20 | 14,8
  OK    cordage restring-zero | palier | B
  OK    cordage solinco-hyper-g | rigidite | 218,3
  OK    rcs head-extreme-standard + solinco-hyper-g @ 22 | rcs | 30
  OK    cordage solinco-hyper-g | testeurs20 | 14,6
  OK    cordage solinco-hyper-g | palier | B
  OK    cordage luxilon-4g | rigidite | 286,9
  OK    rcs head-extreme-standard + luxilon-4g @ 22 | rcs | 38
  OK    cordage luxilon-4g | testeurs20 | 14,5
  OK    cordage luxilon-4g | palier | B
  OK    cordage solinco-tour-bite | rigidite | 255
  OK    rcs head-extreme-standard + solinco-tour-bite @ 22 | rcs | 34
  OK    cordage solinco-tour-bite | testeurs20 | 14,4
  OK    cordage solinco-tour-bite | palier | B
  OK    cordage signum-pro-x-perience | rigidite | 224,6
  OK    rcs head-extreme-standard + signum-pro-x-perience @ 22 | rcs | 31
  OK    cordage signum-pro-x-perience | testeurs20 | 13,6
  OK    cordage signum-pro-x-perience | palier | C
  OK    cordage babolat-rpm-rough | rigidite | 235
  OK    rcs head-extreme-standard + babolat-rpm-rough @ 22 | rcs | 32
  OK    cordage babolat-rpm-rough | testeurs20 | 13,3
  OK    cordage babolat-rpm-rough | palier | C
  OK    cordage volkl-cyclone | rigidite | 215
  OK    rcs head-extreme-standard + volkl-cyclone @ 22 | rcs | 30
  OK    cordage volkl-cyclone | testeurs20 | 13,3
  OK    cordage volkl-cyclone | palier | C
  OK    cordage luxilon-alu-power | rigidite | 230
  OK    rcs head-extreme-standard + luxilon-alu-power @ 22 | rcs | 31
  OK    cordage luxilon-alu-power | testeurs20 | 13,2
  OK    cordage luxilon-alu-power | palier | C
  OK    cordage yonex-poly-tour-rev | rigidite | 205
  OK    rcs head-extreme-standard + yonex-poly-tour-rev @ 22 | rcs | 29
  OK    cordage yonex-poly-tour-rev | testeurs20 | 13,0
  OK    cordage yonex-poly-tour-rev | palier | C
  OK    cordage babolat-rpm-blast | rigidite | 240
  OK    rcs head-extreme-standard + babolat-rpm-blast @ 22 | rcs | 32
  OK    cordage babolat-rpm-blast | testeurs20 | 12,4
  OK    cordage babolat-rpm-blast | palier | D
  OK    cordage yonex-poly-tour-pro | rigidite | 220
  OK    rcs head-extreme-standard + yonex-poly-tour-pro @ 22 | rcs | 30
  OK    cordage yonex-poly-tour-pro | testeurs20 | 12,3
  OK    cordage yonex-poly-tour-pro | palier | D
  OK    cordage babolat-rpm-team | rigidite | 280,6
  OK    rcs head-extreme-standard + babolat-rpm-team @ 22 | rcs | 37
  OK    cordage babolat-rpm-team | testeurs20 | 11,9
  OK    cordage babolat-rpm-team | palier | D
  OK    cordage weiss-cannon-ultra-cable | rigidite | 250
  OK    rcs head-extreme-standard + weiss-cannon-ultra-cable @ 22 | rcs | 34
  OK    cordage weiss-cannon-ultra-cable | testeurs20 | 11,6
  OK    cordage weiss-cannon-ultra-cable | palier | D
  OK    rcs head-extreme-standard + luxilon-4g @ 18 | rcs | 36
  OK    rcs head-instinct-pwr-115 + luxilon-4g @ 22 | rcs | 39
  OK    rcs head-instinct-pwr-115 + solinco-tour-bite @ 22 | rcs | 36
  OK    cordage head-lynx-tour | rigidite | 228,6
  OK    raquette babolat-pure-aero-standard | ra | 66
  OK    rcs babolat-pure-aero-standard + head-lynx-tour @ 22 | rcs | 32
  OK    raquette babolat-pure-drive-standard | ra | 69
  OK    rcs babolat-pure-drive-standard + head-lynx-tour @ 22 | rcs | 33
  OK    raquette tecnifibre-tfight-305s-id | ra | 63
  OK    rcs tecnifibre-tfight-305s-id + head-lynx-tour @ 22 | rcs | 31
  OK    raquette yonex-ezone-100 | ra | 68
  OK    rcs yonex-ezone-100 + head-lynx-tour @ 22 | rcs | 32
  OK    raquette yonex-vcore-98 | ra | 64
  OK    rcs yonex-vcore-98 + head-lynx-tour @ 22 | rcs | 31
  OK    raquette wilson-defyer-98-pro-v1 | ra | 64
  OK    rcs wilson-defyer-98-pro-v1 + head-lynx-tour @ 22 | rcs | 31
  OK    raquette yonex-percept-100d | ra | 66
  OK    rcs yonex-percept-100d + head-lynx-tour @ 22 | rcs | 32
  OK    raquette dunlop-fx-500 | ra | 69
  OK    rcs dunlop-fx-500 + head-lynx-tour @ 22 | rcs | 33
  OK    raquette yonex-vcore-100 | ra | 65
  OK    rcs yonex-vcore-100 + head-lynx-tour @ 22 | rcs | 31
  OK    raquette head-speed-mp | ra | 61
  OK    rcs head-speed-mp + head-lynx-tour @ 22 | rcs | 30
  OK    raquette yonex-percept-100 | ra | 66
  OK    rcs yonex-percept-100 + head-lynx-tour @ 22 | rcs | 32
  OK    raquette yonex-vcore-95 | ra | 62
  OK    rcs yonex-vcore-95 + head-lynx-tour @ 22 | rcs | 30
  OK    raquette yonex-ezone-98 | ra | 63
  OK    rcs yonex-ezone-98 + head-lynx-tour @ 22 | rcs | 31
  OK    raquette wilson-defyer-100-v1 | ra | 66
  OK    rcs wilson-defyer-100-v1 + head-lynx-tour @ 22 | rcs | 32
  OK    raquette babolat-pure-aero-98 | ra | 66
  OK    rcs babolat-pure-aero-98 + head-lynx-tour @ 22 | rcs | 32
  OK    raquette head-gravity-tour | ra | 59
  OK    rcs head-gravity-tour + head-lynx-tour @ 22 | rcs | 29
  OK    raquette wilson-ultra-100-v5 | ra | 67
  OK    rcs wilson-ultra-100-v5 + head-lynx-tour @ 22 | rcs | 32
  OK    raquette head-boom-pro-2024 | ra | 64
  OK    rcs head-boom-pro-2024 + head-lynx-tour @ 22 | rcs | 31
  OK    cordage head-lynx-tour | rigidite | 228,6
  OK    cordage luxilon-alu-power | rigidite | 230
  OK    cordage yonex-poly-tour-strike | rigidite | 215
  OK    raquette yonex-vcore-98 | ra | 64
  OK    rcs yonex-vcore-98 + yonex-poly-tour-strike @ 22 | rcs | 29
  OK    rcs yonex-vcore-98 + yonex-poly-tour-strike @ 24 | rcs | 30
  OK    rcs yonex-vcore-98 + yonex-poly-tour-strike @ 26 | rcs | 31
  OK    raquette wilson-blade-98-18x20-v9 | ra | 62
  OK    rcs wilson-blade-98-18x20-v9 + luxilon-alu-power @ 22 | rcs | 30
  OK    rcs wilson-blade-98-18x20-v9 + luxilon-alu-power @ 24 | rcs | 31
  OK    rcs wilson-blade-98-18x20-v9 + luxilon-alu-power @ 26 | rcs | 32
  OK    raquette head-speed-mp | ra | 61
  OK    rcs head-speed-mp + head-lynx-tour @ 22 | rcs | 30
  OK    rcs head-speed-mp + head-lynx-tour @ 24 | rcs | 31
  OK    rcs head-speed-mp + head-lynx-tour @ 26 | rcs | 32

288 valeur(s) contrôlée(s), 0 écart(s)
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
| F17 | Tecnifibre Black Code par jauge (TWU, 51 lbs, « Fast ») | 1,18 = 202,9 · 1,24 = 236 · 1,28 = 249,7 · 1,32 = 210,3 lb/in ; écart maximal 46,8 lb/in = 5,1 points (46,8 × 0,10909) | L1 | `data/reference/twu-lignes-citees.json` (#110, extrait de 35 lignes, depuis remplacé par le relevé complet) ; `data/reference/twu-releve-complet.json` (#113, sha256 du brut identique) ; relevé brut local | confirmé (complète F8) |
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

### Passe n° 2 du pigiste — 2026-10-11

Circuit court, tête de PR `8b52189` (`main` v2.3.12 + #110 + #113 + #115 + lot 3 #118 + passe n° 2 du rédacteur : C-1 à C-4, O-1 à O-4, S-1 à S-4, cinq articles ajoutés), worktree `coherence-chiffres-factcheck2`, branche `agent/redaction/coherence-chiffres-regle-c-factcheck2`. Seul ce dossier est modifié. Les valeurs de fiche sont celles de `src/data/` de la tête. Les scripts sont les miens (hors dépôt, non versionnés), pas ceux du rédacteur. Cette passe remplace la conclusion « Pas conforme en l'état » de la passe n° 1.

**Verdict : conforme sur toutes les valeurs et phrases touchées.** Aucune phrase ajoutée ou réécrite n'est sans défense. Une retouche de mot est demandée hors du diff (K-1 : « mesure 220 lb/in », deux phrases, FR et EN). Ce qui reste ouvert ne relève plus du texte : les 53 baisses du lot 3 attendent le GO de Pierre (D-1 résiduel). Elles vont dans le sens de la prudence : aucune fiche affichée n'a une mesure TWU plus rigide que la base ; si Pierre les applique, huit blocs de phrases devront être refaits (tableau plus bas).

**La demande en six points**

| # | Demande de l'orchestrateur | Résultat |
|---|---|---|
| 1 | Effectifs, listes, groupes : 102 polyesters, 164,6 à 286,9, médiane 220, 15 à 200 ou moins, 21 à 240 ou plus (262, 276, 280,6, 286,9 aux indices 35, 36, 37, 38), multifilaments, « 11 sur 45 », 36 polyesters et 48 fiches alignés | confirmés à la décimale, FR et EN (R1 à R5, R7) ; les 288 lignes du bloc du § 5 relues sans la tolérance du vérificateur (R9) |
| 2 | Classement des 18 (Poly Tour Pro 7e, Mach-10 8e, X-Perience 9e, Lynx Tour 10e, RPM Team 17e, moyenne 230,4) et chaque phrase de « meilleur cordage » FR et EN | confirmés (R6, R8) ; N17 à N20 |
| 3 | Colonne RCS de « meilleures raquettes » avec le Head Lynx Tour (228,6 à 22 kg), phrases « bras sensible dès 32 », article next gen | confirmés (R8) : indices 29, 30, 31, 32, 33 selon le RA ; 9 raquettes sur 18 (RA 66 ou plus) à 32, aucune à 35 ; next gen : neuf cases de 29 à 32, seuil de 35 à 33, 31 et 32 kg ; N21 à N24 |
| 4 | C-1 à C-4, S-2, O-1, O-2, O-4 et formulations nouvelles | soldés, chacun défendu par un fait (tableau « Points de la passe n° 1 ») |
| 5 | Test de glissance des phrases ajoutées ou réécrites | 26 affirmations : 0 sans défense dans le diff, 1 hors diff (K-1), 9 défendues sous réserve D-1 résiduel |
| 6 | URL TWU (S-4, F10) | reconfirmée le 2026-10-11 : deux pages ouvertes, une requête chacune, aucun refus (F9 respectée) |

**Commandes exécutées**

| Commande | Résultat |
|---|---|
| `npm run redaction:valeurs -- docs/redaction/coherence-chiffres-regle-c.md` | **exit 0** · « 288 valeur(s) contrôlée(s), 0 écart(s) » · relancée après l'écriture de cette passe : même sortie |
| `npx --yes tsx scripts/blog-covers/build-rigidite-figures.mts --check` (outil du rédacteur, à titre de recoupement) | exit 0 · « figures et chiffres du texte conformes à la base » |
| `npm run audit:blog-images` · `npm run audit:blog-funnel` · `npm run audit:comptages` | exit 0 · exit 0 · exit 0 (0 échec, 3 avertissements : voir O-7) |
| scripts du pigiste p2a à p2n (hors dépôt) | exit 0 · extraits ci-dessous |
| sha256 du relevé TWU brut local `scripts/scraper/out/twu-strings.json` (29/09/2026, 186 872 octets) | `01c07cc…8872`, identique au `rawSha256` de `data/reference/twu-releve-complet.json` et au brut reconstruit depuis ce fichier versionné (788 enregistrements) |
| diff de phrases visibles et de réponses JSON-LD entre `e67d64e` et `8b52189`, sur les dix fichiers | 346 phrases ou lignes ajoutées ou réécrites (41, 38, 35, 35, 17 et 1 pour les six pages ajoutées à la reprise ou touchées par elle ; 64, 62, 27 et 26 pour les quatre articles santé), toutes relues ; celles qui portent une affirmation sont au test de glissance ci-dessous |
| lecture des deux pages TWU, une requête chacune | voir « URL TWU » |

Scripts : p2a effectifs, extrêmes, médianes, listes, graphique, multifilaments, alignement, les 18 testés · p2c fiches affichées face au relevé TWU · p2e tableaux, listes, graphiques et phrases chiffrées des quatre articles santé, FR et EN · p2f « meilleur cordage », « meilleures raquettes », next gen, JSON-LD, FAQ, citations, dates · p2g fiches dont la rigidité a monté depuis `main`, recoupées avec les mots de douceur · p2h les 18 testés face à TWU, séries par jauge · p2i scénario indicatif des baisses · p2j rapport de chaque liste affichée au relevé · p2k bloc du § 5 relu sans tolérance · p2l notes /10 citées (confort, puissance, contrôle, effets, durabilité) · p2m et p2n Poly Tour Strike (tableau 3 du next gen).

**Sorties (extraits)**

```
R1 Polyester n=102 164.6–286.9 médiane 220 (51e et 52e valeurs : 220 et 220) · Multifilament n=45 143–180 médiane 162.3 · Hybrid 9 158–192 (175) · Natural Gut 7 88–100 (95) · Synthetic 16 165–185.2 (180) · total 179
R2 polyesters <=200 : 15 · >=240 : 21 · entre : 66 · plages des 15 : 23 à 26 (RA 60), 24 à 28 (RA 65), 26 à 30 (RA 70) · groupes des 21 à RA 65 : 32 (240 x2) · 33 (242.9/245/248 x7) · 34 (249.7/250/255 x6) · 35 (260 x2, 262) · 36 (276) · 37 (280.6) · 38 (286.9) ; à RA 70 : 34 à 39, 17 sur 21 à 35 ou plus · les 3 plus souples 164.6/165.7/173.2 = 24/24/25 · les 3 plus rigides 286.9/280.6/276 = 38/37/36
R3 indice RA 65, 22 kg : <32 : 70 · 32-34 : 26 · >=35 : 6 · seuils lus dans advanced-rcs.ts : 32 / 35 (l'indice atteint 32 à 231.14 et 35 à 258.64 lb/in) · écart 4G – O-Toro Snap : 13.34 avant arrondi, soit 13 (RA 60), 14 (RA 65), 13 (RA 70) · leviers du 4G : 22 kg 38 · O-Toro 24 · RA 60 36 · RA 70 39 · 18 kg 36
R4 multifilaments : 25 sur 45 plus souples que 164.6 · 45 sur 45 sous la médiane des polyesters · 4 541 des 4 590 paires (multifilament, polyester) en faveur du multifilament (98,9 %) · NXT 173.7 plus rigide que 3 polyesters (O-Toro Snap, O-Toro, O-Toro Spin) · boyaux 88–100 (Touch Tonic 88, Touch VS 92)
R5 fiches alignées : 48 = 46 égales à la mesure de la jauge de la fiche (appariement strict : 34 polyesters, 11 multifilaments, 1 synthétique) + Babolat RPM Team (appariement manuel) + Toroline Absolute (ligne TWU sans jauge nominale) ; polyesters : 36 = 28 « appliquee » + 8 Toroline ; boyaux et hybrides : 0
R6 les 18 : rigidité moyenne 230.389 · rangs de souplesse : O-Toro 1 · Poly Tour Rev 2 · ReString Zero 3 · Hawk Touch 4 · Cyclone 5 (ex æquo à 215, départagés par l'ordre alphabétique) · Hyper-G 6 · Poly Tour Pro 7 · Mach-10 8 · X-Perience 9 · Lynx Tour 10 · ALU Power 11 · RPM Rough 12 · RPM Blast 13 · Confidential 14 · Ultra Cable 15 · Tour Bite 16 · RPM Team 17 · 4G 18 · plus grand écart entre voisins : 39.3 (O-Toro – Rev), puis 25.6 (Tour Bite – RPM Team) · confort : Mach-10 8.8 · Poly Tour Pro 8.6 · O-Toro 8.1 · Poly Tour Rev 8.0 · quatre ex æquo à 7.8 · puissance : Mach-10 8.7 (la plus haute des 18)
R7 quatre articles santé, FR + EN : 1 457 contrôles stricts, 0 écart (tableaux de 15 lignes, tableau du § 4, groupes de la liste des 21, tableau des 17, tableau des familles, leviers, phrases chiffrées par motif ; SVG : 102 points et 36 cerclés)
R8 « meilleur cordage », « meilleures raquettes », next gen (FR + EN), JSON-LD, FAQ, citations TWU, dates : 685 contrôles stricts, 4 écarts de formulation (FAQ n° 1, mêmes nombres : O-8) · tableau des 18 : les quatre « contrôle » 38, 34, 33, 31 · raquettes : RA >= 66 sur 9 des 18, indices 29 30 30 31 31 31 32 32 33 · next gen : neuf cases de 29 à 32
R9 bloc valeurs-produit : 288 lignes, 288 exactes à la décimale, 0 écart (rigidité 83 · rcs 142 · ra 21 · testeurs20 18 · palier 18 · confort 6), sans la tolérance de ±0,5 du vérificateur
```

**Faits.** F24 à F31 (rédacteur) : confirmés par recalcul indépendant, sans écart ; F25 est précisé par F32. Faits ajoutés par cette passe (à reporter au § 2 à la prochaine mise à jour du dossier) :

| # | Énoncé | Valeur | Niveau | Source | Statut |
|---|---|---|---|---|---|
| F32 | Fiches alignées sur une mesure TWU (définition du † et des points cerclés) | 48 = 46 fiches égales à la mesure de la jauge de la fiche (34 polyesters, 11 multifilaments, 1 synthétique) + Babolat RPM Team (appariement manuel, « Babolat RPM Team 16 Black », 1.30 = 280,6) + Toroline Absolute (ligne TWU sans jauge nominale, 180,6) ; aucune autre fiche n'est égale à une mesure | BASE + L1 | scripts p2a, p2j ; `string-stiffness-provenance.ts` | confirmé (précise F25) |
| F33 | Les 18 polyesters à avis de testeurs face à TWU (jauges de la fiche) | 7 alignés (Lynx Tour, Mach-10, O-Toro, Hyper-G, X-Perience, RPM Team, 4G) · 7 avec une mesure plus basse : Confidential 245 → 222,3 (1 jauge sur 4), Hawk Touch 215 → 196 (2 sur 4), Cyclone 215 → 197,2 (3 sur 3), Tour Bite 255 → 237,7 (4 sur 4), RPM Blast 240 → 236,6 (4 sur 4), Poly Tour Pro 220 → 188,6 (1 sur 4), Ultra Cable 250 → 174,9 (1 sur 2) · 4 sans mesure (ReString Zero, RPM Rough, ALU Power, Poly Tour Rev) · aucune mesure plus rigide que la base | L1 + BASE | script p2h | confirmé |
| F34 | La rigidité mesurée ne croît pas toujours avec la jauge | 43 fiches ont au moins deux jauges mesurées aux jauges de la fiche ; pour 20 d'entre elles la série n'est pas monotone ou son maximum n'est pas sur la jauge la plus grosse. Exemples (TWU, 51 lbs, « Fast ») : MSV Focus Hex 1,18 = 224 · 1,23 = 218,9 · 1,27 = 185,7 (la plus fine est la plus rigide) ; Luxilon Element 1,25 = 208 · 1,30 = 191,5 ; Tecnifibre NRG2 1,24 = 164 · 1,32 = 158,3 ; X-One Biphase 1,18 = 145,7 · 1,24 = 166,9 · 1,30 = 162,9 ; Black Code 1,18 = 202,9 · 1,24 = 236 · 1,28 = 249,7 · 1,32 = 210,3 | L1 | script p2h | confirmé (complète F18) |
| F35 | Les listes affichées face à TWU | 15 polyesters à 200 ou moins : 9 alignés, 3 avec une mesure plus basse (Tour Bite Soft 200 → 192, Hyper-G Soft 200 → 172, Poly Tour Air 195 → 154,9), 3 sans mesure · 21 polyesters à 240 ou plus : 6 alignés, 9 avec une mesure plus basse (Poly Tour Tough 245 → 193,7, Diamond Rough 260 → 192,6, Ultra Cable 250 → 174,9, Pro Hurricane 260 → 204, 4G Rough 262 → 216, Barb Wire 250 → 214,3, Confidential 245 → 222,3, Tour Bite 255 → 237,7, RPM Blast 240 → 236,6), 6 sans mesure · tableau des 17 : 6 alignés, 4 avec une mesure plus basse (Xcel 155 → 150,9, Velocity MLT 165 → 153,2, Poly Tour Air 195 → 154,9, RPM Blast 240 → 236,6), 7 sans mesure (dont RPM Soft : sa seule ligne TWU a la matière « Nylon », H-5). **Aucune fiche affichée n'a une mesure plus rigide que la base** | BASE + L1 | script p2j | confirmé |
| F36 | Mesures TWU plus rigides que la base, non appliquées | 2, affichées dans aucun des neuf articles : Wilson Sensation 165 → 168,6 et Solinco X-Natural 147 → 158,9 (statut « retenue-serie-suspecte ») ; les 4 fiches en quarantaine (Gosen OG Sheep Micro, Wilson NXT Power, Head FXP, Wilson NXT Control) n'apparaissent pas non plus. Mesures plus basses en attente : 53 (32 polyesters, 15 multifilaments, 2 boyaux, 4 synthétiques) | BASE + L1 | scripts p2c, p2g | confirmé |
| F37 | Pages TWU rouvertes le 2026-10-11 | voir « URL TWU » : « As tension goes down, so does stiffness. » | L1 | lecture de page, une requête chacune | confirmé |
| F38 | Relevé TWU brut | sha256 recalculé sur le fichier local (29/09/2026) = `01c07ccea468d79ba3445753f788c1ff5ccdd852c5111d946c872f4488be8872`, identique au `rawSha256` du fichier versionné et au brut reconstruit depuis lui ; `retrieved` 2026-09-29, `verifiedIdentical` 2026-10-10 ; l'article next gen cite « relevé du 29/09/2026 » | L1 | calcul | confirmé |
| F39 | Scénario indicatif « les 53 baisses appliquées » (rien n'est proposé : décision de Pierre) | polyesters : minimum 154,9 (Yonex Poly Tour Air), maximum 286,9, médiane 210, 30 à 200 ou moins, 12 à 240 ou plus · multifilaments : 116,6 à 178, médiane 160 · les 18 : moyenne 230,4 → 220,0 ; rangs de souplesse O-Toro 1er (165,7), Ultra Cable 2e (174,9), Poly Tour Pro 3e (188,6), Hawk Touch 4e (196), Cyclone 5e (197,2), Poly Tour Rev 6e, Confidential 9e (222,3), Mach-10 10e · next gen : VCORE 98 + Poly Tour Strike (215 → 199,5 sur 1 jauge de 3) passerait de 29 / 30 / 31 et 33 kg à 28 / 29 / 30 et 36 kg | BASE + L1 | scripts p2i, p2n | indicatif |

**Points de la passe n° 1**

| # | Phrase après correction (FR · EN) | Fait | Statut |
|---|---|---|---|
| C-1 (« L'essentiel ») | « prenez l'un des plus souples : le Toroline O-Toro Snap (164,6 lb/in) et le Toroline O-Toro (165,7) se placent au niveau d'un multifilament sur l'indice » · « pick one of the softest … play close to a multifilament on the index » | F2, F3, R2 : Snap 164,6 (indice 24,2), O-Toro 165,7 (24,4), Spin 173,2 (25,2) ; seuls deux polyesters ont l'indice 24 ; le multifilament X-One Biphase (166,9) est à 24 | soldé |
| C-1 (§ 3) | « Le Toroline O-Toro Snap (164,6 lb/in), le polyester le plus souple du catalogue, fait de même ; sur l'indice, ce sont les deux polyesters les moins fermes que nous documentons » · « So does Toroline O-Toro Snap … the softest polyester in the catalogue … the two least firm polys we document » | F1, F2, R2 : le superlatif de santé (« la façon la plus douce pour le bras ») est retiré ; il reste un classement du catalogue, vrai dans la base | soldé ; réserve D-1 résiduel (N12) |
| C-2 = S-2 | « reste en général plus prudent qu'un polyester » · « generally remains a more prudent choice than a polyester » (FAQ visible et JSON-LD, FR et EN ; mêmes mots que la FAQ n° 1 des articles polyester et que l'encadré de « meilleur cordage ») ; 286,9 et 38 dans la même phrase | F14, R4 : 98,9 % des paires, 45 sur 45 sous la médiane des polyesters, 7 boyaux sur 7 ; le NXT (173,7) reste plus rigide que trois polyesters, d'où « en général » | soldé |
| C-3 | « Cela peut surestimer la rigidité d'une autre jauge de la fiche, mesurée plus souple (pas toujours la plus fine) » (8 occurrences) ; « pour cette jauge » · « another gauge on the product page, one measured softer (not always the finest) » | F17, F18, F34 : la valeur † est la mesure de la jauge la plus rigide mesurée, les autres jauges sont donc plus souples par construction ; la plus fine n'est pas toujours la plus souple (MSV Focus Hex : la plus fine est la plus rigide ; Element, NRG2 : la plus grosse est plus souple) | soldé |
| C-4 | « Les points cerclés sont les 36 polyesters dont la rigidité est alignée sur une mesure du laboratoire TWU ; pour les 66 autres, c'est la valeur de notre fiche, pas une mesure TWU » · « 48 des 179 sont alignées sur une mesure du laboratoire TWU (36 polyesters, 11 multifilaments, 1 synthétique) » ; ligne type de `CREDITS.md` | F25, F32, R5, R7 : 36 sur 102, 11 sur 45, 1 sur 16 ; SVG : 102 points et 36 cerclés, FR et EN | soldé |
| O-1 | « cet écart vaut 13 à 14 points d'indice RCS » · « 13 to 14 RCS points » | R3 : 13,34 avant arrondi ; 13, 14, 13 à RA 60, 65, 70 | soldé |
| O-2 | « TWU mesure le Tecnifibre Black Code à 202,9 lb/in en 1.18 et à 249,7 lb/in en 1.28, soit environ 5 points d'indice RCS d'écart » | F17, F34 : 46,8 lb/in × 0,10909 = 5,1 points ; attribué à TWU dans la phrase | soldé |
| O-3 | « notre fiche du Babolat Touch VS indique 92 lb/in, l'une des valeurs les plus basses du catalogue » | F23, R4 : Touch Tonic 88, puis Touch VS et TGut à 92 | soldé |
| O-4 | « C'est le sens établi par TWU : tension plus basse, rigidité plus basse » ; « quitter le polyester reste en général plus prudent » (et leurs EN) | F37 : « As tension goes down, so does stiffness. » (page rouverte) ; F14 ; plus aucun « direction sûre », « voie la plus prudente », « safest route », « safe direction », « choix le plus prudent », « safer choice » dans les neuf articles ni le guide (balayage par motifs) | soldé |
| S-1 | FAQ n° 1 des articles polyester : phrase de prudence en 2e position, mêmes mots, trio de la base finale (Snap 164,6, O-Toro 165,7, Spin 173,2 ; « 24 à 25, contre 38 ») | R7 : texte visible et JSON-LD identiques, FR et EN | soldé |
| S-3 | `guide-materiel-tennis.html` : « 2025 » retiré de `og:title` et `twitter:title` | `git diff e67d64e 8b52189` sur le guide : ces deux lignes de `<head>` et les guillemets de la FAQ (retouche de `tsa-acquisition`, `8f049f2`) ; `<title>` et H1 sans année | soldé |
| S-4 | Lien et nœud `citation` vers `https://twu.tennis-warehouse.com/learning_center/reporter2.php` | URL de `STIFFNESS_SOURCE.url` (`string-stiffness-provenance.ts` l. 59) ; 9 liens « Sources » (`rel="noopener"`), 6 nœuds `citation` (polyester, « tennis elbow » et « meilleur cordage », FR et EN) ; page rouverte (F37) | soldé |
| Phrases du lot 3 réécrites | « O-Toro de loin le plus souple des 18 (4e), devant le Poly Tour Rev (14e) » · « Poly Tour Pro 7e en souplesse, rigidité égale à la médiane » · « Mach-10 1er en confort, 8e en souplesse » · « Hyper-G 6e en souplesse, 9e en confort » · « O-Toro et Poly Tour Rev dans les quatre premiers sur les deux critères » · « 262 (35), 276 (36), 280,6 (37), 286,9 (38) » | R2, R6 | soldé |

**Test de glissance de la passe n° 2**

Candidats : les affirmations ajoutées ou réécrites qu'un fabricant, un cordeur ou un médecin pourrait contester, plus toute phrase non touchée qui nomme une fiche dont la rigidité a monté depuis `main` (39 fiches ; script p2g : 14 phrases la nomment à côté d'un mot de douceur ou de confort, dont 4 faux positifs de nom — « Hyper-G Soft », « Confidential Soft », « Hyper-G Round » — et 10 reprises ci-dessous en N6, N9, N16, N19, N20). Règle : une fiche plus rigide n'est plus dite « douce » sans que la phrase le dise ; aucun absolu de santé. « Défendue » : un fait soutient la phrase telle qu'elle est écrite. « Réserve D-1 résiduel » : défendue par F1 (l'article suit la base), mais une mesure TWU, non appliquée, dit autre chose pour la fiche nommée, dans le sens de la sur-alerte.

| # | Affirmation contestable (FR · EN) | Par qui | Défense (fait n°) | Verdict |
|---|---|---|---|---|
| N1 | « Le critère, c'est la rigidité. Nos 102 polyesters vont de 164,6 à 286,9 lb/in (médiane 220) … cet écart vaut 13 à 14 points d'indice RCS » | fabricant (Toroline, Luxilon) | F2, F26, R1, R3 : les deux extrêmes sont des mesures TWU (Snap 164,6 ; 4G 286,9) | défendue ; réserve D-1 résiduel (Poly Tour Air 154,9) |
| N2 | « Toroline O-Toro Snap (164,6), O-Toro (165,7) et Spin (173,2) donnent un indice de 24 à 25 … les plus rigides, 4G (286,9), RPM Team (280,6) et Revenge (276), donnent 36 à 38 » | fabricants (Toroline, Luxilon, Babolat) | F27, F28, R2 ; les six fiches nommées sont alignées sur TWU (F32) | défendue |
| N3 | « Le Yonex Poly Tour Pro est le 2e mieux noté en confort … mais seulement le 7e plus souple (220 lb/in) … exactement la médiane du catalogue » (visible, FAQ n° 2 et JSON-LD ; « meilleur cordage » aussi) | Yonex | F29, R1, R6 : 51e et 52e valeurs à 220 ; 7e sur 18 | défendue ; réserve D-1 résiduel (TWU 188,6 sur 1 jauge de 4 : 3e, indice 27) |
| N4 | « La tension ne rattrape pas le cordage : 4 kg de moins retirent 2 points ; changer de cordage peut en retirer 14 » ; FAQ « Pas selon l'indice RCS du site … Le choix du cordage pèse bien plus que la tension. Ce n'est pas un traitement : une douleur qui persiste relève d'un médecin » | cordeur, médecin | F27, R3 : 0,5 point par kg ; 38 → 24 ; la phrase est bornée par « peut » et par « selon l'indice RCS du site », et renvoie au médecin | défendue |
| N5 | Légendes : « Les points cerclés sont les 36 polyesters dont la rigidité est alignée … pour les 66 autres, c'est la valeur de notre fiche, pas une mesure TWU » ; « 48 des 179 sont alignées sur une mesure du laboratoire TWU » | TWU, fabricants | F25, F32, R5, R7 | défendue |
| N6 | « Cela peut surestimer la rigidité d'une autre jauge de la fiche, mesurée plus souple (pas toujours la plus fine) » (8 occurrences) ; méthode : « nous affichons celle de la jauge la plus rigide que TWU a mesurée … C'est voulu, par prudence pour le bras » | cordeur, Tecnifibre | F17, F18, F34, F7 | défendue |
| N7 | « TWU mesure le Tecnifibre Black Code à 202,9 lb/in en 1.18 et à 249,7 lb/in en 1.28, soit environ 5 points d'indice RCS d'écart » | Tecnifibre | F17 | défendue |
| N8 | « Les 15 polyesters les plus souples … Sur 102, ils sont 15 » ; « 21 polyesters … à 240 lb/in ou plus … de 32 à 38 (RA 65), de 34 à 39 (RA 70), et la plupart atteignent alors le seuil très ferme » | fabricants | F3, F28, F35, R2 : 17 des 21 à 35 ou plus à RA 70 | défendue ; réserve D-1 résiduel (12 lignes sur 36 ont une mesure plus basse, aucune une mesure plus rigide) |
| N9 | « Deux cas se détachent … Mach-10 : 1er en confort, mais 8e en souplesse (222,3 lb/in) … Hyper-G : 6e en souplesse, 9e en confort » ; tableau de 6 lignes | Solinco | F12, F20, F33, R6 : Mach-10 et Hyper-G sont alignés (†) | défendue |
| N10 | « Les deux polyesters qui se classent parmi les quatre premiers sur les deux critères sont le Toroline O-Toro (1er en souplesse, 3e en confort) et le Yonex Poly Tour Rev (2e, 4e) » | Toroline, Yonex | R6 : souplesse 1 O-Toro, 2 Rev, 3 Zero, 4 Hawk Touch ; confort 1 Mach-10, 2 Poly Tour Pro, 3 O-Toro, 4 Rev | défendue ; le Rev n'a aucune mesure TWU, son 205 est la valeur de la fiche, dite telle ; réserve D-1 résiduel (Rev 6e) |
| N11 | « prenez l'un des plus souples : le Toroline O-Toro Snap … et le Toroline O-Toro … se placent au niveau d'un multifilament sur l'indice » (C-1) | cordeur | F2, F3, R2 | défendue |
| N12 | « Le Toroline O-Toro Snap (164,6 lb/in), le polyester le plus souple du catalogue … les deux polyesters les moins fermes que nous documentons » | Toroline, Yonex | F1, F2, R2 : seuls Snap et O-Toro ont l'indice 24 ; classement du catalogue, pas un absolu de santé | défendue ; réserve D-1 résiduel (Yonex Poly Tour Air, mesuré à 154,9 sur sa seule jauge) |
| N13 | « un multifilament ou un boyau reste en général plus prudent qu'un polyester » (FAQ visible et JSON-LD, FR et EN, trois articles ; encadré de « meilleur cordage ») | cordeur, médecin | F14, R4 ; « prudent » se lit à l'indice RCS, que les pages disent ne pas prédire une blessure | défendue |
| N14 | « Avec une douleur actuelle … reste en général plus prudent » ; « Si votre coude a déjà été touché, quitter le polyester reste en général plus prudent » ; « Une douleur … relève d'un avis médical » | médecin | F14, F7 : aucun absolu, renvoi médical dans chaque article | défendue |
| N15 | « C'est le sens établi par TWU : tension plus basse, rigidité plus basse » · « the direction established by TWU: lower tension, lower stiffness » | cordeur, TWU | F37 : la page TWU dit « As tension goes down, so does stiffness. » ; la phrase donne le sens, pas l'ampleur | défendue |
| N16 | « Les polyesters « souples » vendus pour le confort, Element, Poly Tour Air, RPM Soft, arrivent entre 28 et 29 : plus souples qu'un polyester classique, encore plus fermes que n'importe quel multifilament du tableau » | Luxilon, Yonex, Babolat | tableau des 17 : Element † 208 = 29, Poly Tour Air 195 = 28, RPM Soft 205 = 29 ; multifilaments de 23 à 25 | défendue ; réserve D-1 résiduel (Poly Tour Air 154,9 : indice 23, au niveau des multifilaments) |
| N17 | « Le mieux classé n'est pas le plus doux. Le Confidential, 2e, est l'un des plus rigides du lot (245 lb/in). Le Luxilon 4G, 8e, est le plus rigide (286,9 lb/in) » | Solinco, Luxilon | R6 : Lynx Tour 10e plus souple ; Confidential 5e plus rigide des 18 ; 4G 18e | défendue ; réserve D-1 résiduel (Confidential : TWU 222,3 sur 1 jauge de 4, 9e plus souple : la phrase tomberait) |
| N18 | « le Toroline O-Toro (165,7 lb/in) est de loin le plus souple des 18, et il se classe 4e. Le suivant, le Yonex Poly Tour Rev (205 lb/in), est 14e » ; « près de 40 lb/in de moins que le suivant » ; FAQ « de loin le moins rigide des 18 » | Toroline, Yonex, Weiss | R6 : 39,3 lb/in avec le suivant, le plus grand des 17 écarts du classement par rigidité ; Rev 14e au classement | défendue ; réserve D-1 résiduel (Ultra Cable 174,9 à 9,2 lb/in : « de loin » et « le suivant » tomberaient) |
| N19 | « Head Lynx Tour … 228,6 lb/in, à peine sous la moyenne des 18 (230,4) » ; « Mach-10 … 222,3 lb/in, la 8e plus basse des 18 … c'est l'un des premiers à essayer, à condition de vérifier l'indice de son montage (31 dans notre exemple) » | Head, Solinco, médecin | R6 : moyenne 230,389 ; Mach-10 8e ; note de confort 8,8 et puissance 8,7, les plus hautes des 18 ; Lynx Tour † et Mach-10 † ; l'indice 31 est écrit dans la phrase | défendue ; voir O-6 |
| N20 | « Le Poly Tour Pro est noté confortable mais mesure 220 lb/in (voir § 4) » · « rated comfortable but measures 220 lb/in » (hors diff, tableau « Le meilleur selon ce que vous cherchez ») | Yonex | 220 est la valeur de la fiche (F29), sans †, donc pas une mesure ; la même page écrit que les valeurs sans † « ne sont pas alignées sur une mesure de laboratoire » ; la seule mesure TWU est 188,6 en 1.20 (F33) | **sans défense (le verbe « mesure ») → K-1** |
| N21 | Raquettes : colonne RCS +2 ; « le configurateur avertit un profil « bras sensible » dès l'indice 32 (35 pour les autres profils). Neuf des 18 raquettes, celles dont le RA est de 66 ou plus, atteignent 32 avec ce cordage à 22 kg ; aucune n'atteint 35 » | médecin, Head | F30, F9 : seuils lus dans `advanced-rcs.ts` ; R8 : 9 sur 18 ; maximum 33 ; la phrase suivante renvoie au calcul sur le montage réel | défendue ; voir O-5 |
| N22 | Raquettes : « cordage Head Lynx Tour (228,6 lb/in, rigidité alignée sur une mesure du laboratoire TWU) » ; « avec le même cordage à la même tension, l'indice passe de 29 sur la Head Gravity Tour (RA 59) à 33 sur la Pure Drive (RA 69) » | Head | F24 : TWU 1.30 = 228,6 (1.25 = 217,7 ; 2 jauges sur 3) ; F30 | défendue |
| N23 | Next gen : tableau 3 (neuf cases de 29 à 32 ; seuil de 35 à 33, 31 et 32 kg) ; « Pour un profil « bras sensible », le configurateur avertit dès 32 : à 26 kg, la Blade en ALU Power et la Speed MP en Lynx Tour y arrivent » ; « Rester sous 35 ne veut pas dire « sans risque » » | médecin | F31, F9 : 32,35 et 31,85 à 26 kg, arrondis à 32 ; « sans risque » n'apparaît qu'en négation | défendue ; réserve D-1 résiduel pour la ligne Poly Tour Strike (F39) |
| N24 | Next gen, FAQ : « notre formule donne de 29 à 32 : des montages standard à fermes, sous le seuil d'alerte de 35, mais déjà déconseillés à un bras sensible » | médecin | F31 ; échelle du site (25-30 standard, 30-35 ferme) ; « déconseillés » est la prudence de l'article, qui réserve aux bras sensibles la zone sous 20 | défendue |
| N25 | « notre fiche du Babolat Touch VS indique 92 lb/in, l'une des valeurs les plus basses du catalogue » (O-3) | Babolat | F23 | défendue |
| N26 | Sources : lien et nœud `citation` vers `reporter2.php` ; « base de rigidités mesurées (tension de référence 51 lb, balayage « Fast ») — pour les cordages marqués †, rigidité mesurée (jauge la plus rigide mesurée …) » | TWU | F37 ; F10 respectée (page ouverte) ; 9 liens, 6 `citation` | défendue |

**Bilan** : 26 affirmations ; 16 défendues (N2, N4, N5, N6, N7, N9, N11, N13, N14, N15, N19, N21, N22, N24, N25, N26) ; 9 défendues sous réserve D-1 résiduel (N1, N3, N8, N10, N12, N16, N17, N18, N23) ; 0 sans défense dans le diff ; 1 sans défense hors diff (N20, K-1).

### Correction demandée à `tsa-redacteur` (passe n° 2)

Chaque ligne cite la phrase visée et le fait qui la corrige ; le pigiste ne propose aucune formulation.

| # | Phrase visée | Fait qui la corrige |
|---|---|---|
| K-1 | FR `meilleur-cordage-polyester-2026.html`, § 3, tableau « Le meilleur selon ce que vous cherchez », ligne « Du confort », colonne « À surveiller » : « Le Poly Tour Pro est noté confortable mais mesure 220 lb/in (voir § 4) » · EN `best-polyester-tennis-strings-2026.html` : « Poly Tour Pro is rated comfortable but measures 220 lb/in (see § 4) » | F29, F33 : 220 lb/in est la valeur de la fiche ; elle n'est pas alignée sur une mesure (pas de †) ; la même page écrit que les valeurs sans † « ne sont pas alignées sur une mesure de laboratoire » ; la seule mesure TWU du Poly Tour Pro est 188,6 en 1.20 (1 jauge sur 4). Le verbe « mesure » attribue à la fiche une mesure qui n'existe pas (charte F2 ; c'est la confusion que C-4 a retirée des légendes). Phrase antérieure à la PR, devenue incohérente avec la règle du † posée par cette passe |

### Observations non bloquantes (passe n° 2)

- **O-5** · facultatif · Raquettes FR et EN, « aucune n'atteint 35 » : le fait est exact (F30, maximum 33). Dans un article de santé, la phrase peut se lire comme une assurance. La phrase suivante renvoie au calcul sur le montage réel ; l'article next gen a l'équivalent explicite (« Rester sous 35 ne veut pas dire « sans risque » »). Non demandé.
- **O-6** · facultatif · « meilleur cordage » FR et EN, Mach-10 : « sans renoncer au confort » s'appuie sur la note de confort de la fiche (8,8, la plus haute des 18), pas sur la rigidité : 222,3 lb/in est maintenant au-dessus de la médiane des 102 polyesters (220) et l'indice est 31, bande « ferme ». La phrase est conditionnelle et donne l'indice ; le § 4 distingue les deux lectures (« "Confortable" selon les testeurs n'est pas "souple" selon la mesure »). Non demandé.
- **O-7** · `audit:comptages` (exit 0) signale trois avertissements, dont un dans le périmètre : EN `best-tennis-strings-for-tennis-elbow.html` l. 309, « 102 strings » (étiquette de la ligne Polyester de la figure des familles) lu comme un total du catalogue (179), « à corriger par le rédacteur » selon le garde-fou. Le chiffre est juste (F1) ; la version FR dit « 102 fiches », que le garde-fou ne lit pas. « 102 polys » ou une exception de sous-famille règle le cas (`tsa-measure` pour le garde-fou).
- **O-8** · FAQ n° 1 de « meilleur cordage » et de « meilleures raquettes » (FR et EN) : texte visible et JSON-LD de formulation différente (« couverts par la synthèse » contre « couverts par une synthèse d'avis de testeurs spécialisés », « de la synthèse » ajouté), mêmes nombres (16,3 · 15,6 · 15,5 et 16,55 · 16,30 · 15,95). Antérieur à la PR, déclaré par le rédacteur (§ 7). À aligner par `tsa-acquisition`, comme les 21 réponses des cinq autres fichiers (§ 6).
- **O-9** · Les trois suites du correctif du vérificateur (Q-6 a, b, c : en-tête périmé, code mort, `decimals` de la rigidité) restent à faire sur une branche dédiée de l'outil ; non faites dans cette passe (hors mission). Le trou de précision n'a rien masqué ici : R9 relit les 288 lignes sans tolérance.

### D-1 résiduel — les 53 baisses du lot 3 (décision de Pierre, indépendante de la fusion)

État. Les 23 hausses du lot 3 sont dans la base ; les 2 mesures plus rigides non appliquées (Wilson Sensation, Solinco X-Natural, série suspecte) ne sont affichées nulle part ; il reste 53 mesures TWU plus basses que la base (32 polyesters, 15 multifilaments, 2 boyaux, 4 synthétiques), que Pierre n'a pas autorisées (« aucune correction qui baisse une alerte pour l'instant »). Les articles suivent la base (F1). Le sens est celui que la règle C assume : les valeurs affichées sont plus rigides, donc les indices plus hauts, que la mesure. **Rien n'est à corriger dans le texte tant que la base ne bouge pas.**

Si Pierre applique ces baisses (scénario indicatif F39, appariement strict, rien n'est proposé), huit blocs de phrases sont à refaire ; `build-rigidite-figures.mts --check` et `redaction:valeurs` les signaleront :

| # | Bloc | Fiches (base → TWU, jauges mesurées) | Ce que dirait l'article |
|---|---|---|---|
| 1 | « 164,6 à 286,9 (médiane 220) », « 13 à 14 points » (polyester et « tennis elbow », FR et EN) | Yonex Poly Tour Air 195 → 154,9 (1 sur 1) | 154,9 à 286,9, médiane 210, 14 points |
| 2 | « 15 plus souples », « 21 plus fermes » et leurs groupes (polyester, FR et EN) | 12 lignes sur 36, F35 | 30 et 12 ; plus de groupe à 260-262 |
| 3 | Poly Tour Pro « 7e plus souple », « exactement la médiane » (polyester et « meilleur cordage », FR et EN) | 220 → 188,6 (1 sur 4) | 3e plus souple, indice 27 |
| 4 | « parmi les quatre premiers sur les deux critères : O-Toro et Poly Tour Rev » (polyester, FR et EN) | Weiss Ultra Cable 250 → 174,9 (1 sur 2) ; Poly Tour Pro | Rev 6e ; O-Toro et Poly Tour Pro |
| 5 | « le polyester le plus souple du catalogue », « les deux polyesters les moins fermes » (« tennis elbow », FR et EN) ; trio de la FAQ n° 1 (polyester, FR et EN) | Poly Tour Air 154,9 ; Head Sonic Pro 235 → 164,6 | Poly Tour Air, puis Sonic Pro et Snap à égalité |
| 6 | Tableau des 17 et « Element, Poly Tour Air, RPM Soft … plus fermes que n'importe quel multifilament » (« tennis elbow », FR et EN) | Poly Tour Air 154,9 ; Xcel 155 → 150,9 ; Velocity MLT 165 → 153,2 ; RPM Blast 240 → 236,6 | Poly Tour Air à 23, au niveau des multifilaments |
| 7 | « meilleur cordage » (FR et EN) : tableau des 18 (Confidential 222,3, Ultra Cable 174,9, Poly Tour Pro 188,6, Hawk Touch 196, Cyclone 197,2, Tour Bite 237,7, RPM Blast 236,6), « Confidential … l'un des plus rigides », « de loin le plus souple … Le suivant, le Poly Tour Rev, est 14e », « L'O-Toro est le seul souple de ce groupe », moyenne des 18 « 230,4 », « Lynx Tour à peine sous la moyenne », « Mach-10 8e plus basse » | F33 ; moyenne 230,4 → 220,0 | Ultra Cable à 9,2 lb/in de l'O-Toro ; Rev 6e ; Confidential 9e ; Lynx Tour au-dessus de la moyenne ; Mach-10 10e |
| 8 | Next gen, tableau 3 : ligne VCORE 98 + Poly Tour Strike et plage « de 29 à 32 » | Poly Tour Strike 215 → 199,5 (1 sur 3) | 28 / 29 / 30, seuil de 35 à 36 kg, plage de 28 à 32 |

Non touchés par ce scénario : « meilleures raquettes » (FR et EN : le Lynx Tour est aligné), le guide, les cartes d'index. Le Blade + ALU Power du next gen n'a pas d'appariement strict (aucune ligne TWU au nom « Luxilon ALU Power » ; les lignes « ALU Power 125/16L » et dérivées ne sont pas des appariements établis) : sa valeur n'est ni confirmée ni contredite, et l'article le dit (« les autres peuvent différer des mesures de laboratoire publiées »).

### URL TWU (S-4, F10) — reconfirmée le 2026-10-11

Deux pages ouvertes, une requête (GET) chacune, aucune seconde tentative ; ni refus (403, 406, 429) ni page anti-robot : la charte F9 est respectée.

- `https://twu.tennis-warehouse.com/learning_center/reporter2.php` : se charge normalement ; titre « String Performance Database » ; la page propose la tension de référence (High 62 lbs, Medium 51 lbs, Low 40 lbs), la vitesse de frappe (Fast, Medium, Slow), la matière (dont Polyester), les colonnes « Gauge nominal » et « Stiffness (lbs/in) ». C'est l'URL de `STIFFNESS_SOURCE.url`, celle des 9 liens et des 6 nœuds `citation`. Les mesures sont servies par une requête POST, que je n'ai pas rejouée : la fidélité des valeurs repose sur le sha256 du relevé brut local (F38).
- `https://twu.tennis-warehouse.com/learning_center/stringstiffness.php` : se charge normalement ; extrait verbatim : « As tension goes down, so does stiffness. » (soutient N15, le sens et non l'ampleur) ; auteur Crawford Lindsey.

### Non vérifié (passe n° 2)

- La levée de la réserve de la passe n° 1 ne porte que sur les deux pages ci-dessus. La page « Understanding Tennis String Stiffness » de Tennis Warehouse (nœud `citation` de l'article « cordage et tennis elbow ») n'a pas été rouverte : antérieure à la PR, non touchée.
- Le lien entre la rigidité de la corde (force de pointe, temps de contact : TWU) et « la charge que reçoit votre bras à l'impact » (§ 1 et encadré de l'article « cordage et tennis elbow », FR et EN : « c'est le choc qui remonte jusqu'à la main et l'avant-bras », « Un montage plus souple réduit la charge que reçoit votre bras à l'impact ») est une inférence de l'auteur : TWU mesure la corde, pas le bras, et le dossier ne porte pas de source médicale. Antérieur à la PR (présent sur `main`), non touché, non évalué ici ; l'article dit lui-même qu'il ne donne aucun conseil médical.
- Les phrases fondées sur la consolidation interne des avis de testeurs (document non fourni) : « Les testeurs le décrivent comme rond et souple au contact » ; « La synthèse le reconnaît elle-même : le confort y est souvent déduit de la description du cordage … ». Antérieures à la PR. Les notes et rangs eux-mêmes sont lus dans la base (F1).
- Rendu visuel des figures et des tableaux (colonne †, thèmes clair et sombre, 390 px) : non relu, seules les données le sont.

### Divergences et constats hors PR (passe n° 2)

- **H-1** · toujours présent : `public/en/blog/index.html` l. 415, « How to choose your strings and tension to prevent or relieve tennis elbow » (allégation de prévention et de traitement sans source médicale, F7), `tsa-acquisition`.
- **H-2** · soldé : plus aucun « 181 strings » sur les pages EN citées (v2.3.11).
- **H-3** · connu de `tsa-core` : « descriptions « souple » / « confort » de 21 fiches à revoir dans une PR de textes » (CLAUDE.md v2.3.17). Aucune de ces descriptions n'est reprise dans les articles (p2g).
- **H-6** · toujours présent : `src/data/strings-database.ts` l. 3794, « Idéal pour les joueurs avec sensibilité du bras ou recherchant le maximum de confort » (`tsa-core`, charte F7).
- Q-1 (hybrides prémontés) et H-5 (RPM Soft, matière TWU « Nylon ») : sans changement, à `tsa-core`.

### Conclusion de la passe n° 2

**Conforme.** Les valeurs et phrases touchées par la reprise du rédacteur sont confirmées à la décimale, en FR et en EN : 288 valeurs au vérificateur et 288 lignes relues sans tolérance, 1 457 + 685 contrôles stricts, 0 écart de chiffre, le contrôle du rédacteur (`--check`) et les trois audits au vert. Les corrections C-1 à C-4 et les observations O-1 à O-4 sont soldées par des faits ; les formulations nouvelles sont défendues. Une retouche de mot hors diff est demandée (K-1). Les 53 baisses du lot 3 relèvent de Pierre, pas du texte : le sens est celui de la prudence, et le tableau D-1 résiduel donne les huit blocs à refaire s'il les applique. Rien ne se publie sans le GO de Pierre.

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
| S-1 | FAQ n° 1 des deux articles polyester (FR et EN), texte visible et JSON-LD | Faire passer la phrase de prudence en 2e position, sans ajouter ni retirer un mot (texte exact sous le tableau). Facultatif : la formulation actuelle est conforme (voir « Réponse à Q-3 »). | Un moteur de réponse reprend en pratique le début d'une réponse, rarement la fin (pratique courante, non mesurée ici). Aujourd'hui la prudence est la 4e phrase, qui commence après une soixantaine de mots, donc la première à tomber ; permutée, elle tombe dans les 22 premiers mots (FR) ou 25 (EN) et les deux premières phrases portent la réponse et sa réserve. Contrepartie : les noms des trois cordages passent de la 2e à la 3e phrase. Si acceptée : visible et JSON-LD changés ensemble (parité contrôlée au caractère près). | Accepté (10/10). Phrase de prudence en 2e position, mêmes mots, texte visible et JSON-LD identiques, FR et EN. Les trois noms sont ceux de la base finale : Isospeed Cream passe à 177,7 (lot 3) et sort du trio, qui devient Toroline O-Toro Snap (164,6), Toroline O-Toro (165,7) et Toroline O-Toro Spin (173,2) ; « un indice RCS de 24 à 25, contre 38 pour le plus rigide ». |
| S-2 | FAQ n° 3 des deux articles « tennis elbow » (FR : « un multifilament ou un boyau reste le choix le plus prudent » ; EN : « remains the safer choice »), texte visible et JSON-LD | À faire examiner par le pigiste (test de glissance) puis par le rédacteur : même type de formule sans nuance que celle corrigée à Q-3, et la raison de Q-3 (Wilson NXT 173,7, indice 25, au-dessus du O-Toro, 24) vaut aussi ici. Je ne propose pas de texte : c'est un conseil de santé. | Cohérence entre les pages : un moteur qui lit les deux articles reprendrait une réserve nuancée dans l'un et un absolu dans l'autre. | Fait (10/10), c'est C-2 : « reste en général plus prudent qu'un polyester » (FR), « generally remains a more prudent choice than a polyester » (EN), texte visible et JSON-LD identiques, mêmes mots que la FAQ n° 1 des articles polyester. À re-tester par le pigiste (glissance). Le même « en général » est posé dans l'encadré et la FAQ de l'article « meilleur cordage » (FR et EN). |
| S-3 | `guide-materiel-tennis.html`, `og:title` et `twitter:title` (l. 15 et 29) | Retirer « 2025 » : « … : Guide Expert 2025 » devient « … : Guide Expert », comme le title et le H1 de la page, qui n'ont pas d'année. Je ne l'ai pas fait moi-même : c'est un chiffre dans un titre. | La PR date le guide « mis à jour le 10 octobre 2026 » (texte visible et `dateModified`) ; l'aperçu de partage annonce 2025 ; charte § 1 : pas d'année dans un titre sauf nécessité. | Fait (10/10) : « 2025 » retiré de `og:title` et `twitter:title` (l. 15 et 29) ; le `<title>` et le H1 n'avaient pas d'année, aucun autre texte du guide n'est modifié. |
| S-4 | « Sources » des deux articles polyester | Facultatif : rendre cliquable la source TWU (aujourd'hui du texte : « twu.tennis-warehouse.com »), avec l'URL du dossier (F7) à reconfirmer par le pigiste (F10). Si acceptée, j'ajoute `citation` au JSON-LD, comme dans les deux articles « tennis elbow ». | Source primaire des valeurs † ; les deux articles « tennis elbow » la lient déjà. | Accepté (10/10). La source TWU est un lien (`https://twu.tennis-warehouse.com/learning_center/reporter2.php`, tension de référence 51 lb, balayage « Fast ») dans « Sources » des articles polyester, « tennis elbow », « meilleur cordage » et « raquettes » (FR et EN) et de l'article next gen (FR) ; nœud `citation` ajouté au JSON-LD des articles polyester (nouveau), « tennis elbow » (3e entrée) et « meilleur cordage » (nouveau). URL à reconfirmer par le pigiste (F10) : c'est celle de `STIFFNESS_SOURCE` dans `string-stiffness-provenance.ts`. |

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

- 2026-10-10 · `tsa-redacteur` — Reprise de la PR #116 (passe n° 2), tête `0001f9f` : base finale (pile rigidités #110, #113, #115, #118 incluse dans la branche). Tout recalculé par script : quatre articles santé (15 plus souples, 21 plus fermes, 164,6 à 286,9, médiane 220, indices 32 à 38, leviers autour du 4G, tableau des 17 : X-One Biphase 166,9, Element 208, 4G 286,9) ; trois articles et leurs jumeaux ajoutés : « meilleur cordage » ×2 (tableau des 18, phrases devenues fausses réécrites), « meilleures raquettes » ×2 (colonne RCS +2, repère « bras sensible » à 32), « matériel next gen » FR (Lynx Tour 228,6, tableau 3, seuil de la Speed MP à 32 kg). Corrections du pigiste : C-1 à C-4, O-1, O-2, O-4 (et O-3 au passage), S-1 à S-4 (§ 4, § 6). Graphiques : axes étendus (160-290 et 80-300), points cerclés pour les 36 polyesters alignés TWU, légendes à nombre exact (C-4). FAQ de la paire « meilleur cordage » : texte visible aligné sur le JSON-LD pour les réponses n° 2 et 3 réécrites (la n° 1, non touchée, garde son écart antérieur de formulation ; même écart, non touché, sur la réponse n° 1 de la paire « raquettes »). Contrôles : `redaction:valeurs` exit 0 (288 valeurs, rigidités à toutes leurs décimales) ; contrôle strict indépendant 965 / 0 écart ; `--check` exit 0 et 15 altérations volontaires détectées ; `audit:blog-funnel`, `audit:blog-images` (cinq exceptions renouvelées, datées, motivées : I3 à I5), `build` verts. RELAIS → `tsa-pigiste` : revérifier les seules valeurs et phrases touchées (§ 4, tableau « Réponses du rédacteur »). RELAIS → `tsa-acquisition` : relire S-1 à S-4 (§ 6) et la dérogation étendue (§ 1). RELAIS → orchestrateur : D-1 (53 baisses restantes) ; rien ne se fusionne avant le fact-check.

- 2026-10-11 · `tsa-pigiste` — Fact-check de la passe n° 2 du rédacteur (circuit court), tête `8b52189`, branche `agent/redaction/coherence-chiffres-regle-c-factcheck2`. Valeurs et phrases touchées relues par des scripts à moi : 1 457 + 685 contrôles stricts, bloc de 288 lignes relu sans la tolérance du vérificateur, 0 écart de chiffre ; `redaction:valeurs` exit 0 (288 valeurs) ; `--check` exit 0 ; `audit:blog-images`, `audit:blog-funnel`, `audit:comptages` exit 0. C-1 à C-4, O-1 à O-4, S-1, S-3, S-4 soldés, chacun par un fait ; test de glissance : 26 affirmations, 0 sans défense dans le diff, 9 défendues sous réserve D-1 résiduel, 1 hors diff (K-1 : « mesure 220 lb/in », FR et EN, deux phrases). URL TWU reconfirmée le 11/10 : deux pages, une requête chacune, aucun refus. Verdict : **conforme**. Correction de deux chemins de fichier dans mon texte de la passe n° 1 (réponse à Q-2 et F17 : l'extrait `twu-lignes-citees.json` de #110, depuis remplacé). RELAIS → `tsa-redacteur` : K-1 (puis `redaction:valeurs` et `--check` si le texte change). RELAIS → orchestrateur : D-1 résiduel à porter à Pierre, indépendamment de la fusion (53 baisses, huit blocs de phrases à refaire s'il les applique, § 5) ; rien ne se publie sans son GO. RELAIS → `tsa-acquisition` : O-7, O-8, H-1. RELAIS → `tsa-core` : Q-1, H-5, H-6. RELAIS → `tsa-measure` : suites Q-6 (a), (b), (c) du vérificateur, O-9 ; `audit:comptages` (O-7). QUESTIONS À `tsa-redacteur` : aucune.