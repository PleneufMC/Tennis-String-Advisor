# Veille — écarts de fiche du catalogue (23/10/2026)

| Champ | Valeur |
|---|---|
| Slug FR / EN | sans objet (dossier de veille : aucun article) |
| Circuit | veille |
| Branche | `agent/tsa-core/ecarts-de-fiche-cx200-kirschbaum` |
| Ouvert le | 2026-10-23, par `tsa-core` |
| Demande d'origine | avis d'Opus 5.5 du 23/10/2026 sur les arbitrages TSA, point 10 (« écarts de fiche ») ; Pierre : « je donne le La, vous exécutez » |
| Statut | faits relevés par `tsa-core` ; valeurs appliquées ou tenues dans `src/data/racquet-alignment-provenance.ts` |

> Même format que `docs/redaction/veille-2026-10-10-fiches-desynchronisees.md`, numérotation continue (V117 et suivants) : le contrôle 14 bis
> de `audit:ratings` relit les deux dossiers et refuse un numéro en double. Rien dans ce fichier n'est publiable.

## Méthode

- **Accès** : avant la première page d'un hôte, `robots.txt`, `agents.md` et `llms.txt` lus ; robot nommé
  (`TennisStringAdvisor-FactCheck/1.0 (automated agent; read-only verification of product specs)`), jamais de User-Agent de navigateur,
  3 s au moins entre deux requêtes vers un même hôte, horloge partagée avec les autres agents ; aucun refus rencontré.
  `kirschbaum-shop.de`, `us.dunlopsports.com` et `tennis-warehouse.com` : `agents.md` et `llms.txt` absents (404), pages produit non interdites.
- **Pages** : URL trouvées par recherche ou relevées par un autre agent sur une page lue (rapport U du 22-23/10), jamais composées.
  Chaque extrait a été retrouvé mot pour mot dans la copie enregistrée (non versionnée : contenus de tiers).
- **Niveaux** : **L0** constructeur · **L1** laboratoire : mesure de flexibilité affichée par Tennis Warehouse sur une page d'essai,
  « L1 (TWU) » (« Flex Rating Test » de Tennis Warehouse University, depuis 2023 ; aussi le relevé TWU des cordages) ou « L1 (RDC) »
  (appareil RDC, « Babolat RDC Ratings », jusqu'en 2023) · **L2** revendeur (la fiche produit de TW comprise) · **L3** test publié.
  Statuts : *confirmé*, *divergent*, *signal*, *introuvable* (définitions du dossier du 10/10/2026). Tennis Warehouse US et Europe sont
  un seul groupe.
- **Natures des RA** (charte F2) : le RA du constructeur (protocole non publié par Dunlop) et la mesure de laboratoire « Flex Rating
  Test » de TWU ne se comparent pas sans le dire ; chaque ligne dit laquelle elle porte. Règle Q-1 du 10/10/2026 : un RA ne change que
  sur une mesure L1.
- **Règle des mesures L1** (avis d'Opus 5.5 du 26/10/2026, R2 de la revue de la PR #152 ; précise Q-1) : **une mesure RDC d'une page
  d'essai TW est L1** (même grandeur que le « Flex Rating Test », le RA cordé, mesurée par un instrument ; la fiche produit d'un
  revendeur reste L2) ; **une hausse admet la mesure d'une génération voisine si une valeur L2 concorde** pour la génération retenue ;
  **une baisse exige la mesure de la génération exacte**, la revue de `tsa-measure` et la liste des alertes retirées (inchangé).
  Asymétrie de la règle C : une erreur de génération ne peut produire, en hausse, qu'une sur-alerte. Hausses qui en relèvent : TF40 305
  (V133, RDC 64 ; L2 64, V36 et V37 du 10/10) et V8 Pro (V129, RDC 67 sur la V-Feel 2020 ; L2 67 pour la v3, V130). Le contrôle 14 bis
  vérifie que chaque mesure L1 de ce dossier dit son instrument et que le libellé s'accorde avec l'extrait.

## Kirschbaum Touch Multifibre — `kirschbaum-touch-multifiber`

Base : nom « Touch Multifiber » · jauge 1.30 · rigidité 160 lb/in (sans source).

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V117 | Nom officiel du produit | Touch Multifibre | L0 | https://www.kirschbaum-shop.de/Polyamid-Darmsaiten/Sets-Polyamid-Darmsaiten/Touch-Multifibre-12-Meter-Set.html | 2026-10-23 | « KIRSCHBAUM Touch Multifibre - 12 Meter Set » | TWU écrit aussi « Kirschbaum Touch Multifibre 16 » et « 17 (1.25) » (relevé versionné `data/reference/twu-releve-complet.json`) | Touch Multifiber | **divergent** |
| V118 | Jauges | 1.25, 1.30 et 1.35 mm | L0 | https://www.kirschbaum-shop.de/Polyamid-Darmsaiten/Sets-Polyamid-Darmsaiten/Touch-Multifibre-12-Meter-Set.html | 2026-10-23 | « Farbe natur Durchmesser 1.25, 1.30 und 1.35 mm Länge 12 m » | Le sélecteur « Stärke » du set n'offre que 1,25 mm et 1,30 mm ; la 1.35 est dans la description du fabricant | 1.30 | **divergent** |
| V119 | Rigidité mesurée (1.25) | 165,7 lb/in | L1 (TWU) | https://twu.tennis-warehouse.com/learning_center/reporter2.php (relevé versionné du 29/09/2026, 51 lbs, Fast) | 2026-10-23 | « Kirschbaum Touch Multifibre 17 (1.25) 51 Fast Nylon 1.25 165.7 » | 1.30 : « Kirschbaum Touch Multifibre 16 », 161,7 lb/in ; 1.35 non mesurée | 160 lb/in | **divergent** |

## Dunlop CX 200 (2024) — `dunlop-cx-200`

Base : RA 66 · 98 in² · 305 g · 16x19 · description « CX 200 2024 ».

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V120 | RA déclaré par le constructeur (protocole non publié) | 65 | L0 | https://us.dunlopsports.com/dunlop/tennis/rackets/cx-series/cx-200-tennis-racket/CX200-24.html | 2026-10-23 | « 315 / 9 pts hl UN-STRUNG BALANCE (MM) 21.5 BEAM WIDTH (MM) 65 RA/STIFFNESS 16 X 19 STRING PATTERN » | Code article CX200-24 (série 2024) ; même page : 632 / 98 in², 305 g non cordée | 66 | **divergent** |
| V121 | RA (mesure de laboratoire, CX 200 2024) | 64 | L1 (TWU) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/DCX2Sreview.html | 2026-10-23 | « Tennis Warehouse University Lab Data Score Grade Flex Rating Test 64 MEDIUM Swing Weight 314 LOW » | Titre de la page : « Dunlop CX 200 2024 Racquet Review » (juillet 2024) ; le constructeur déclare 65 (ligne précédente) | 66 | **divergent** |
| V122 | Tamis et plan (page d'essai 2024) | 98 in² ; 16x19 | L1 (TWU) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/DCX2Sreview.html | 2026-10-23 | « Head Size 98 sq in Weight 11.3 oz Balance Point 12.63 in Construction 21.5mm / 21.5mm / 21.5mm String Pattern 16x19 » | Dunlop (V120) : 98 in², 16 x 19 ; le poids de la page d'essai (320 g) est cordé | 98 in² ; 16x19 | **confirmé** |

## Fiches G et S de l'inventaire photos (23/10/2026)

Inventaire : `AB_inventaire_photos.md` (catégories G, génération non établie ; S, caractéristiques ≠ produit trouvé). Décisions fiche par fiche :
`AC_fiches_g_s_v.md` (rapport de `tsa-core`). Les pages d'essai de Tennis Warehouse portent soit la mesure TWU (« Flex Rating Test »), soit,
jusqu'en 2023, la mesure RDC affichée par TW : niveau L1, « L1 (TWU) » ou « L1 (RDC) » (règle des mesures L1, ci-dessus), comme V19 de la
veille du 10/10. Les poids des pages d'essai sont CORDÉS. Une fiche sans génération est rattachée à la génération en vente dont le tamis et
le plan concordent ; quand la valeur retenue n'est exacte que pour elle, la génération est nommée dans la fiche (Ripstick 100 300g (2025)).

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V123 | Tamis, plan et RA, Dunlop FX 500 Tour (page d'essai d'octobre 2020) | 98 in² ; 16x19 ; RA 69 | L1 (RDC) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/FX500Treview.html | 2026-10-23 | « Head Size 98 sq in 632 sq cm » ; « String Pattern 16 Mains / 19 Crosses Babolat RDC Ratings Score Grade Flex Rating 69 » | Générations suivantes : 98 in² (V124, V125) | `dunlop-fx-500-tour` : 100 in² ; RA 67 | **divergent** |
| V124 | Tamis, plan et RA, Dunlop FX 500 Tour (page d'essai de mai 2023) | 98 in² ; 16x19 ; RA 65 | L1 (RDC) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/FX5TRreview.html | 2026-10-23 | « Head Size 98 sq in 632 sq cm » ; « String Pattern 16 Mains / 19 Crosses Babolat RDC Ratings Score Grade Flex Rating 65 » | — | 100 in² ; RA 67 | **divergent** |
| V125 | Tamis, plan et RA, Dunlop FX 500 Tour (page d'essai de décembre 2025) | 98 in² ; 16x19 ; RA 65 | L1 (TWU) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/DF50Treview.html | 2026-10-23 | « Head Size 98 sq in Weight 11.4 oz » ; « String Pattern 16x19 Tennis Warehouse University Lab Data Score Grade Flex Rating Test 65 » | Dunlop (rapport AB) : MFX500TR26 en 98 in² | 100 in² ; RA 67 | **divergent** |
| V126 | Tamis, plan et RA, Head Prestige Tour 2023 (page d'essai) | 95 in² ; 16x19 ; RA 62 | L1 (TWU) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/THPRTRreview.html | 2026-10-23 | « Head Size 95 sq in Weight 11.7 oz Balance Point 12.79 in Construction 22mm / 22mm / 22mm String Pattern 16x19 » ; « Flex Rating Test 62 » | TW US, fiche produit (V128) : 16x19, 62 | `head-prestige-tour` : 18x20 ; RA 60 | **divergent** |
| V127 | Plan et RA, Head Prestige Tour 2021 (page d'essai de décembre 2021) | 16x19 ; RA 65 | L1 (RDC) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/TOUPREreview.html | 2026-10-23 | « String Pattern 16 Mains / 19 Crosses Babolat RDC Ratings Score Grade Flex Rating 65 » | — | 18x20 ; RA 60 | **divergent** |
| V128 | Head Prestige Tour, fiche produit TW US | 95 in² ; 16x19 ; RA 62 | L2 | https://www.tennis-warehouse.com/Head_Prestige_Tour/descpageRCHEAD-THPRTR.html | 2026-10-23 | « Head Size: 95 in² / 612.9 cm² » ; « 16 Mains / 19 Crosses » ; « Stiffness: 62 » | Recoupe V126 (même groupe) | 18x20 ; RA 60 | **divergent** |
| V129 | Tamis, plan et RA, Völkl V-Feel V8 Pro (page d'essai de mars 2020) | 100 in² ; 18x20 ; RA 67 | L1 (RDC) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/VKLV8review.html | 2026-10-23 | « Head Size 100 sq in 645 sq cm » ; « Composition VCell/Graphite String Pattern 18 Mains / 20 Crosses Babolat RDC Ratings Score Grade Flex Rating 67 » | TW US, V8 Pro v3 (V130) : 18x20, 67 | `volkl-v8-pro` : 16x19 ; RA 64 | **divergent** |
| V130 | Völkl V8 Pro v3, fiche produit TW US | 100 in² ; 18x20 ; RA 67 | L2 | https://www.tennis-warehouse.com/Volkl_V8_Pro_v3/descpageRCVOLKL-V8PV3.html | 2026-10-23 | « Head Size: 100 in² / 645.16 cm² » ; « 18 Mains / 20 Crosses » ; « Stiffness: 67 » | Génération en vente chez TW US | 16x19 ; RA 64 | **divergent** |
| V131 | RA, Prince Ripstick 100 300g, seconde génération (page d'essai de juillet 2025) | RA 67 ; 100 in² | L1 (TWU) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/25RIPHreview.html | 2026-10-23 | « Now in its second generation, the Prince Ripstick 100 300g » ; « Tennis Warehouse University Lab Data Score Grade Flex Rating Test 67 » | Première génération (avril 2021) : RDC 64 (https://www.tennis-warehouse.com/learning_center/racquet_reviews/PRIPSreview.html) | `prince-ripstick-standard` : RA 60 | **divergent** |
| V132 | Prince Ripstick 100 300g 2025, fiche produit TW US | 100 in² ; 16x18 ; RA 67 | L2 | https://www.tennis-warehouse.com/Prince_Ripstick_100_300g/descpageRCTWABG-25RIPH.html | 2026-10-23 | « Head Size: 100 in² / 645.16 cm² » ; « 16 Mains / 18 Crosses » ; « Stiffness: 67 » | La page d'essai (V131) écrit « String Pattern 16x19 » dans ses caractéristiques et « very open 16x18 » dans son texte : plan de la fiche (16x18) conservé | 16x18 ; RA 60 | **divergent** |
| V133 | RA, Tecnifibre TF40 305 16x19 (page d'essai) | RA 64 | L1 (RDC) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/TF40R1review.html | 2026-10-23 | « String Pattern 16 Mains / 19 Crosses Babolat RDC Ratings Score Grade Flex Rating 64 » | TW US (V36, V37) : 64 ; la 18x20 mesure aussi 64 | `tecnifibre-tf40-305` : RA 63 | **divergent** |
| V134 | Tamis, poids et plan, Yonex EZONE Junior 25 (08EZJ25G) | 100 in² ; 230 g ; 16x18 | L0 | https://www.yonex.com/ezj25g | 2026-10-23 | « Head Size 100 sq.in. Weight 230g / 8.1oz Grip Size G02 Length 25 in. » ; « Stringing Pattern 16 x 18 » | Équilibre 315 mm, comme la fiche | 98 in² ; 240 g ; 16x18 | **divergent** |
| V135 | Tamis, poids et plan, Yonex EZONE Junior 26 (08EZJ26G) | 100 in² ; 240 g ; 16x18 | L0 | https://www.yonex.com/ezj26g | 2026-10-23 | « Head Size 100 sq.in. Weight 240 g / 8.5 oz Grip Size G02 Length 26 in. » ; « Stringing Pattern 16 x 18 » | Équilibre 320 mm, comme la fiche | 100 in² ; 255 g ; 16x19 | **divergent** |
| V136 | Tamis et poids non cordé, Babolat Pure Aero Junior 25 Gen9 | 98 in² ; 235 g (± 7) | L0 | https://www.babolat.com/us/pure-aero-junior-25-gen9/140538.html | 2026-10-23 | « Head Size 630 cm² / 98 in² Length 635 mm / 25 in Weight (unstrung) 235 g +/- 7 g / 8.3 oz » | Plan 16x17 dans le texte de la même page, comme la fiche | 98 in² ; 240 g | **divergent** |
| V137 | Jauges, Solinco Pro Stacked | 1.20, 1.30, 1.35 | L0 | https://solincosports.com/equipment/pro-stacked/ | 2026-10-23 | « String Gauge Choose an option 15L (1.35) 16 (1.30) 17 (1.20) » | Aucune 1.25 chez les revendeurs trouvés | 1.20, 1.25, 1.30 | **divergent** |
| V138 | Tamis, plan et RA, Babolat Pure Strike 100 16x20 2024 (page d'essai) | 100 in² ; 16x20 ; RA 61 | L1 (TWU) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/PS1020review.html | 2026-10-23 | « Head Size 100 sq in Weight 11.4 oz Balance Point 12.59 in Construction 21 mm / 23 mm / 21 mm String Pattern 16x20 » ; « Flex Rating Test 61 » | Babolat (rapport U) : « 65 +/ - 3 », RA non cordé (autre nature) | `babolat-pure-strike-100-16x20` : RA 64 | **divergent** |
| V139 | Tamis, plan et RA, Wilson Blade 98 16x19 v7 (page d'essai d'août 2019) | 98 in² ; 16x19 ; RA 62 | L1 (RDC) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/WB98Rreview.html | 2026-10-23 | « Head Size 98 sq in 632 sq cm » ; « String Pattern 16 Mains / 19 Crosses Babolat RDC Ratings Score Grade Flex Rating 62 » | Le texte de la page nomme la « Wilson Blade 98 16x19 v7 » | `wilson-blade-standard` : 98 in² ; 16x19 ; RA 62 | **confirmé** |
| V140 | Tamis, plan et RA, Dunlop FX 500 (page d'essai de mars 2023) | 100 in² ; 16x19 ; RA 69 | L1 (RDC) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/DFX500review.html | 2026-10-23 | « Head Size 100 sq in 645 sq cm » ; « String Pattern 16 Mains / 19 Crosses Babolat RDC Ratings Score Grade Flex Rating 69 » | 2020 : 71 (FX500Rreview) ; janvier 2026 : 68 (DF500review) | `dunlop-fx-500` : 100 in² ; RA 69 | **confirmé** |
| V141 | Tamis, plan et RA, Dunlop SX 300 Tour (page d'essai d'avril 2020) | 100 in² ; 16x19 ; RA 65 | L1 (RDC) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/SX300Treview.html | 2026-10-23 | « Head Size 100 sq in 645 sq cm » ; « String Pattern 16 Mains / 19 Crosses Babolat RDC Ratings Score Grade Flex Rating 65 » | 2025 : 98 in², RA 69 (DSXTRreview) | `dunlop-sx-300-tour` : 100 in² ; RA 65 | **confirmé** |
| V142 | Tamis, plan et RA, Prince Textreme Warrior 100 (page d'essai de janvier 2016) | 100 in² ; 16x18 ; RA 66 | L1 (RDC) | https://www.tennis-warehouse.com/learning_center/shoe_reviews/W100review.html | 2026-10-23 | « Head Size 100 sq in 645 sq cm » ; « Composition Graphite/Textreme String Pattern 16 Mains / 18 Crosses Babolat RDC Ratings Score Grade Flex Rating 66 » | URL de redirection de TW (page « Prince Textreme Warrior 100 Racquet Review ») ; Warrior 100 (300g) actuelle : 16x19, 64 (V-hors dossier, P5WA30) | `prince-warrior-100-300g` : 100 in² ; 16x18 ; RA 66 | **confirmé** |
| V143 | Génération, Babolat Pure Strike 100 16x20 : nouveau modèle de 2024, quatrième génération de la gamme | première Pure Strike 100 en 16x20 (2024) | L3 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/PS1020review.html | 2026-10-26 | « Babolat answers the call in a big way by introducing a brand new model, the Babolat Pure Strike 100 16x20 » ; « the fourth generation Pure Strike line » | Même page que V138 (mesure, L1 (TWU)) ; aucune Pure Strike 100 en 16x20 antérieure trouvée | `babolat-pure-strike-100-16x20` : génération non nommée | **confirmé** |

## Journal

- 2026-10-23 · `tsa-core` — 6 faits sur 2 fiches. Kirschbaum : nom et jauges alignés sur le fabricant, rigidité 160 → 165,7 par la règle C
  (l'appariement strict devient possible avec le nom officiel ; hausse, garde de série suspecte satisfaite). CX 200 : RA 66 **tenu** ; la mesure
  L1 (64) établirait une baisse de 2 points de RA, mesurée dans la PR et soumise à la revue de `tsa-measure` (règle 2) avant tout changement.
- 2026-10-23 · `tsa-core` — 20 faits (V123 à V142) sur 13 fiches des catégories G et S de l'inventaire photos (`AC_fiches_g_s_v`) : corrections de tamis, plan, poids et jauges sur L0 ou L1 ; hausses de RA sur mesure L1 ; aucune baisse appliquée (Pure Strike 100 16x20 et FX 500 Tour tenus) ; quatre générations établies sans changement de valeur.
- 2026-10-26 · `tsa-core` — avis d'Opus 5.5 sur les réserves R2 et R3 de la revue de la PR #152 : règle des mesures L1 écrite (Méthode),
  instrument dit fait par fait (« L1 (RDC) » : 9 faits ; « L1 (TWU) » : 7 faits) ; Ripstick : génération nommée dans la fiche,
  « Ripstick 100 300g (2025) » (V131, V132). Aucune valeur de RA ni aucun fait nouveau ; aucune page relue.
- 2026-10-26 · `tsa-core` — GO explicite de Pierre sur les baisses de RA mesurées par TWU, règle des mesures L1 (une baisse exige la mesure
  de la génération exacte). **Appliquées** : CX 200 66 → 64 (V121 : CX 200 2024, génération nommée par la fiche) et Pure Strike 100 16x20
  64 → 61 (V138 : la 2024, seule Pure Strike 100 en 16x20). **Tenues** : FX 500 Tour 67 (V123 à V125 : 69 en 2020, 65 en 2023 et 2025, la
  fiche ne nomme aucune génération), Speed MP 61 (dossier du 10/10 : 60 en 2024 et 2026 ; 62 en 2022 selon une page d'essai
  relevée dans le rapport AC, hors dossier) et Instinct MP 65 (64 en 2025 ; 65 en 2019, même rapport, hors dossier) : génération de la fiche non établie, la mesure de la génération exacte manque. Aucun fait nouveau, aucune page relue.
