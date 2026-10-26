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
- **Niveaux** : **L0** constructeur · **L1** laboratoire (TWU) · **L2** revendeur · **L3** test publié. Statuts : *confirmé*, *divergent*,
  *signal*, *introuvable* (définitions du dossier du 10/10/2026). Tennis Warehouse US et Europe sont un seul groupe.
- **Natures des RA** (charte F2) : le RA du constructeur (protocole non publié par Dunlop) et la mesure de laboratoire « Flex Rating
  Test » de TWU ne se comparent pas sans le dire ; chaque ligne dit laquelle elle porte. Règle Q-1 du 10/10/2026 : un RA ne change que
  sur une mesure L1.

## Kirschbaum Touch Multifibre — `kirschbaum-touch-multifiber`

Base : nom « Touch Multifiber » · jauge 1.30 · rigidité 160 lb/in (sans source).

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V117 | Nom officiel du produit | Touch Multifibre | L0 | https://www.kirschbaum-shop.de/Polyamid-Darmsaiten/Sets-Polyamid-Darmsaiten/Touch-Multifibre-12-Meter-Set.html | 2026-10-23 | « KIRSCHBAUM Touch Multifibre - 12 Meter Set » | TWU écrit aussi « Kirschbaum Touch Multifibre 16 » et « 17 (1.25) » (relevé versionné `data/reference/twu-releve-complet.json`) | Touch Multifiber | **divergent** |
| V118 | Jauges | 1.25, 1.30 et 1.35 mm | L0 | https://www.kirschbaum-shop.de/Polyamid-Darmsaiten/Sets-Polyamid-Darmsaiten/Touch-Multifibre-12-Meter-Set.html | 2026-10-23 | « Farbe natur Durchmesser 1.25, 1.30 und 1.35 mm Länge 12 m » | Le sélecteur « Stärke » du set n'offre que 1,25 mm et 1,30 mm ; la 1.35 est dans la description du fabricant | 1.30 | **divergent** |
| V119 | Rigidité mesurée (1.25) | 165,7 lb/in | L1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php (relevé versionné du 29/09/2026, 51 lbs, Fast) | 2026-10-23 | « Kirschbaum Touch Multifibre 17 (1.25) 51 Fast Nylon 1.25 165.7 » | 1.30 : « Kirschbaum Touch Multifibre 16 », 161,7 lb/in ; 1.35 non mesurée | 160 lb/in | **divergent** |

## Dunlop CX 200 (2024) — `dunlop-cx-200`

Base : RA 66 · 98 in² · 305 g · 16x19 · description « CX 200 2024 ».

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V120 | RA déclaré par le constructeur (protocole non publié) | 65 | L0 | https://us.dunlopsports.com/dunlop/tennis/rackets/cx-series/cx-200-tennis-racket/CX200-24.html | 2026-10-23 | « 315 / 9 pts hl UN-STRUNG BALANCE (MM) 21.5 BEAM WIDTH (MM) 65 RA/STIFFNESS 16 X 19 STRING PATTERN » | Code article CX200-24 (série 2024) ; même page : 632 / 98 in², 305 g non cordée | 66 | **divergent** |
| V121 | RA (mesure de laboratoire, CX 200 2024) | 64 | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/DCX2Sreview.html | 2026-10-23 | « Tennis Warehouse University Lab Data Score Grade Flex Rating Test 64 MEDIUM Swing Weight 314 LOW » | Titre de la page : « Dunlop CX 200 2024 Racquet Review » (juillet 2024) ; le constructeur déclare 65 (ligne précédente) | 66 | **divergent** |
| V122 | Tamis et plan (page d'essai 2024) | 98 in² ; 16x19 | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/DCX2Sreview.html | 2026-10-23 | « Head Size 98 sq in Weight 11.3 oz Balance Point 12.63 in Construction 21.5mm / 21.5mm / 21.5mm String Pattern 16x19 » | Dunlop (V120) : 98 in², 16 x 19 ; le poids de la page d'essai (320 g) est cordé | 98 in² ; 16x19 | **confirmé** |

## Journal

- 2026-10-23 · `tsa-core` — 6 faits sur 2 fiches. Kirschbaum : nom et jauges alignés sur le fabricant, rigidité 160 → 165,7 par la règle C
  (l'appariement strict devient possible avec le nom officiel ; hausse, garde de série suspecte satisfaite). CX 200 : RA 66 **tenu** ; la mesure
  L1 (64) établirait une baisse de 2 points de RA, mesurée dans la PR et soumise à la revue de `tsa-measure` (règle 2) avant tout changement.
