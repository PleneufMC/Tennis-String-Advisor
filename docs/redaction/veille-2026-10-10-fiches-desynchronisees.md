# Veille — fiches du catalogue désynchronisées (mise à jour du 10/10/2026)

| Champ | Valeur |
|---|---|
| Slug FR / EN | sans objet (dossier de veille : aucun article) |
| Circuit | veille |
| Branche | `agent/redaction/veille-fiches-desynchronisees` |
| Ouvert le | 2026-10-10, par l'orchestrateur |
| Demande d'origine | « GO » de Pierre le 10/10/2026 : mise à jour des fiches du catalogue qui ne correspondent plus au modèle en vente (écarts relevés par `tsa-core` en collectant les photos officielles) |
| Statut | faits livrés par `tsa-pigiste` · relais vers `tsa-core` (valeurs) et `tsa-acquisition` (sujets) |
| Mise à jour planifiée | sans objet. Les disponibilités et prix de ce dossier sont datés du 2026-10-10 et vieillissent (charte F11) |

> Règles : `docs/redaction/CHARTE.md`. Modèle : §2 de `docs/redaction/_modele.md` (dépassé ici : une ligne par fiche et par champ).
> Rien dans ce fichier n'est publiable. **Aucune valeur de la base n'a été modifiée** (`src/` et `public/` non touchés) : les écarts sont consignés pour `tsa-core`, qui décide.

---

## 0. Lecture rapide

- **116 faits** : 50 confirmés · 42 divergents · 17 signaux · 7 introuvables. Numérotés V01 à V116 (le préfixe V évite la confusion avec les règles F1–F11 de la charte).
- **73 pages citées** (ouvertes le 2026-10-10) : L0 29 · L1 8 · L2 25 · L3 11. Aucune citation ne vient de mémoire : chaque extrait a été vérifié mécaniquement contre le texte de la page enregistrée.
- **Quatre points qui nuancent la commande** (détail au §2, « Points glissants ») :
  1. **Poly Tour Strike 1.30 : la jauge existe** chez Yonex USA (modèle PTGST130, épuisé au 10/10) — l'hypothèse « non fabriqué » n'est pas établie ;
  2. **Babolat Pure Aero Team : le RA 70 ± 3 de Babolat est un RA de raquette non cordée** ; la base suit le RA cordé de Tennis Warehouse (66 pour la Pure Aero 2026, 67 pour la Team 2023) : saisir 70 mélangerait deux natures (F2) ;
  3. **Tempo 285 : la génération en vente (Tempo Tour 285 g, 2026) a un tamis de 102 in²**, pas 100 ; la fiche à 100 in² est celle de la V2, aujourd'hui en Outlet ;
  4. **Burn 100LS et Pro Staff 97 v14 : la génération précédente reste visible** chez Wilson (V5 à 144 €, Pro Staff standard « épuisé »), avec les mêmes valeurs que la génération en vente.
- **Priorité par l'effet sur l'indice RCS** : les rigidités de cordage sont les écarts les plus lourds (**RPM Team +2,2 à +6,1 points d'indice**, TGV +1,3 à +2,2) et relèvent du chantier C2 ; côté raquettes, EZONE 105 et Clash 100 Pro (RA +2) et Extreme MP 2026 (RA +2), puis les RA à ±1. Le tableau du §3 les classe.

| Fiche (id) | Base | Constat principal | Preuve | Effet RCS moyen (calcul §3) | Proposition neutre pour `tsa-core` |
|---|---|---|---|---|---|
| `yonex-ezone-105` | RA 64 · 16x18 | plan officiel 16x19 ; RA 66 chez TW US pour l'EZONE 105 (2025) | L0 (plan) ; L2 unique (RA) | +0,72 | corriger le plan ; RA 66 si la règle RA du 09/10 s'applique |
| `wilson-clash-100-pro-v2` | RA 55 · 310 g · 16x19 | seule la V3 (15/01/2025) : 16x20, 305 g non cordée, RA 57 | L0 ; L1 (RA) ; L3 ×2 (date) | +0,72 | aligner sur la V3 (plan, poids, RA), renommer, id conservé |
| `babolat-pure-aero-team` | RA 67 · 285 g | seule la Gen9/2026 en vente ; RA 67 = génération 2023 ; 2026 : 66 (TW, cordée) ; Babolat 70 ± 3 (non cordée) | L0 ; L2 ; L3 | −0,34 (RA 66) ; +1,01 si 70 (à ne pas saisir) | choisir la génération ; RA 66 si Gen9 (convention cordée) ; ne pas saisir 70 |
| `tecnifibre-tfight-315s` | RA 64 · 18x19 | plan officiel 16x19 ; RA 65 (TWU) | L0 ; L1 | +0,37 | corriger le plan et le RA (65) |
| `yonex-vcore-98-tour` | RA 63 · 18x20 | plan officiel 16x19 ; VCORE 8e génération ; RA 64 chez TW US | L0 ; L3 ; L2 unique (RA) | +0,29 | corriger le plan ; RA 64 (signal) |
| `tecnifibre-tf40-305` | RA 63 | caractéristiques conformes (V3) ; RA 64 chez TW US, identique pour la v1 ; Tecnifibre ne publie pas de RA | L0 ; L2 unique (RA) | +0,29 | laisser les caractéristiques ; RA à trancher (L0 absent) |
| `head-extreme-standard` (Extreme MP) | RA 65 | RA 66 (2024, TWU) / 67 (2026, TW US) ; Head L0 inaccessible | L1 ; L2 | +0,35 (66) ; +0,69 (67) | laisser ou aligner ; génération non établie |
| `head-speed-mp` | RA 61 | RA 60 en 2024 (TWU) et 2026 (TW US) | L1 ; L2 | −0,35 | laisser (écart 1) ou RA 60 |
| `head-instinct-mp` | RA 65 | RA 64 pour l'Instinct MP 2025 (TWU + TW US) | L1 ; L2 | −0,37 | laisser (écart 1) ou RA 64 |
| `tecnifibre-tempo-285` | RA 65 · 100 in² | la fiche = Tempo 285 V2 (Outlet) ; en vente : Tempo Tour 285 g 2026 = 102 in² ; RA introuvable | L0 | inconnu (RA sans source) | décider V2 ou Tempo Tour 2026 ; RA sans source |
| `wilson-burn-100ls-v5` | RA 72 | V6 = mêmes valeurs (cosmétique 2026) ; V5 encore vendue chez Wilson DE | L0 ; L2 | 0 | renommer v6 ; aucune valeur à changer |
| `wilson-pro-staff-97-v14` | RA 66 | édition Roland-Garros 2026 aux mêmes valeurs ; modèle standard « épuisé » chez Wilson DE | L0 ; L2 | 0 | laisser ou nommer l'édition |
| `wilson-us-open-junior-21/23/25` | sans RA | tamis, plan, poids et équilibre tous différents de l'officiel | L0 (+ L2 pour le 21) | nul (pas de RA) | corriger ; trancher la convention de poids junior |
| `wilson-blade-junior-25` | sans RA | tamis 100 in² (base 98) ; 243 g (base 240) ; nom officiel « Blade Feel Comp Jr 25 » | L0 | nul | corriger le tamis |
| `babolat-rpm-team` | 225 lb/in · Pink | noir ; jauges 1.25/1.30 (pas de 1.35) ; TWU 245,2 (1.25) / 280,6 (1.30) | L0 ; L1 | +2,2 à +6,1 | coloris ; jauge 1.35 ; rigidité → C2 |
| `tecnifibre-tgv` | 145 lb/in · Pink | noir ou naturel ; TWU 157,2 (1.30) / 165,2 (1.25) | L0 ; L1 | +1,3 à +2,2 | coloris ; rigidité → C2 |
| `tecnifibre-multifeel` | 160 lb/in · 1.30 | jauges 1.25 et 1.30 (1.35 en naturel) ; TWU 148,6 à 154,9 | L0 ; L1 ; L2 | −0,6 à −1,2 | ajouter 1.25 ; rigidité → C2 |
| `yonex-poly-tour-strike` | 215 lb/in · 1.30 | la 1.30 existe (épuisée) ; TWU 199,5 (1.25) | L0 ; L1 | −1,7 | laisser les jauges ; rigidité → C2 |

---

## 1. Méthode, accès et refus

- **Robot** : « TennisStringAdvisor-Pigiste/1.0 (+https://tennisstringadvisor.org) » ; au moins 3,5 s entre deux requêtes vers un même hôte ; `robots.txt` lu avant toute page et respecté (jokers compris) ; arrêt à la première réponse 403, 406 ou 429 ou à la première page anti-robot ; aucune nouvelle tentative. **Aucune URL composée** : chaque adresse vient d'un lien de page, d'un plan du site ou d'un moteur de recherche (charte F10). Volume : 114 pages enregistrées sur 16 hôtes (dont plans du site, pages de navigation et catégories), 20 fichiers `robots.txt` demandés.
- **Boutique Wilson** : `www.wilson.com` renvoie ce poste vers la boutique allemande (`/de-de/…`), même quand l'adresse demandée est `/en-us/…` : les libellés sont en allemand, les valeurs sont celles de Wilson. Les « US Open Jr » ne sont pas sur la boutique allemande (elle vend, sous le nom « Slam Jr », des raquettes aux caractéristiques publiées identiques) : ils sont lus sur la boutique officielle australienne `au.wilson.com`.
- **Hôtes non rouverts, sur consigne** : `head.com` (429 « Vercel Security Checkpoint », constat de `tsa-core`), `tenniswarehouse-europe.com` (406), `tennis-point.fr` (429), `luxilon.com` (403). Aucune requête n'est partie vers eux.
- **Refus constaté pendant la veille** : `tennisexpress.com` → **HTTP 403** à la première page (annonce du TF40 V3) : arrêt pour ce site, hôte consigné, aucune autre requête.
- **Non suivis** : `racquetguys.com` (301 vers `racquetguys.ca`, autre hôte) ; `tennisnow.com` (redirigé vers une page de recherche interdite par son `robots.txt`) ; `galaxus.ch` (délai dépassé dès `robots.txt`, non retenté) ; `tennisgear.com.au` (page rendue côté client, sans texte exploitable). Deux adresses données par un moteur répondent **404** : `www.yonex.com/…/polytour-strike/ptgst120` et la fiche TW US du Poly Tour Strike 17/1.20.
- **Tennis Warehouse University** : une seule requête POST au formulaire public `twu.tennis-warehouse.com/learning_center/reporter2.php` (mêmes paramètres que le script de `tsa-core` : tous matériaux, 51 lb, vitesse « Fast »). Ce sous-domaine n'a pas de `robots.txt` (404). Les pages d'essai de raquettes (`/learning_center/racquet_reviews/…`) ont été trouvées par le lien « Racquet Reviews » des fiches TW US.
- **Natures des RA** (charte F2). Trois grandeurs portent le même nom et ne se comparent pas : le **RA déclaré non cordé ± 3** (Babolat), le **RA « Stiffness » cordé** des fiches Tennis Warehouse (celui que la base suit pour la Pure Aero 2026 : 66) et la **mesure de laboratoire « Flex Rating Test »** de TWU (cordée). Chaque ligne ci-dessous dit laquelle elle porte.
- **Provenance** : les copies des pages lues ne sont pas versionnées (contenus de tiers, volumineux). L'URL, la date et l'extrait de chaque ligne suffisent à recontrôler ; chaque extrait a été retrouvé mot pour mot dans la copie enregistrée avant l'écriture du dossier, et les citations secondaires (intitulés, dates, plans de cordage) ont été contrôlées de la même façon.
- **Statuts** : *confirmé* = établi par L0, L1, ou deux sources indépendantes ; *divergent* = établi et différent de la base ; *signal* = une seule source L2/L3, ou équivalence non écrite ; *introuvable* = rien d'ouvert ne l'établit. Tennis Warehouse US et Europe appartiennent au même groupe : leurs fiches ne comptent pas pour deux sources.

---

## 2. Dossier de faits — `tsa-pigiste`

Niveaux : **L0** constructeur · **L1** laboratoire (TWU) · **L2** revendeur · **L3** test publié, presse · **L4** forum (signal seulement) · **BASE** `src/data/`.
Statuts : **confirmé** · **divergent** (→ `tsa-core`) · **introuvable** · **signal**.

### Section A — Raquettes dont le RA change ou peut changer (effet direct sur l'indice RCS)

#### Yonex EZONE 105 — `yonex-ezone-105`

Base : tamis 105 in² · 275 g · plan 16x18 · RA 64.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V01 | Plan de cordage officiel | 16 x 19 | L0 | https://www.yonex.com/tennis/racquets/ezone/ez105 | 2026-10-10 | « Stringing Pattern 16 x 19 » | Tennis Warehouse US (fiche « EZONE 105 (2025) ») : 16 mains / 19 travers | 16x18 | **divergent** |
| V02 | Tamis et poids | 105 in² ; 275 g (non cordée : la fiche TW US donne 289 g cordée) | L0 | https://www.yonex.com/tennis/racquets/ezone/ez105 | 2026-10-10 | « Head Size 105 sq.in. Weight 275 g / 9.7 oz » | TW US : tamis 105 in² | 105 in² ; 275 g | **confirmé** |
| V03 | Plan, tamis et poids non cordé (seconde source L2, hors groupe Tennis Warehouse) | 16x19 ; 105 in² ; 275 g non cordée — fiche intitulée « Yonex Ezone 105 2025 » | L2 | https://centralsports.co.uk/products/yonex-ezone-105-2025-tennis-racket-275g-blast-blue | 2026-10-10 | « Head Size: 105 sq.in. Unstrung Weight: 275g Length: 27 inches Balance: Even String Pattern: 16x19 » | Concorde avec Yonex (L0) et avec Tennis Warehouse US : le plan 16x19 est établi par trois sources, dont un revendeur britannique indépendant du groupe Tennis Warehouse | 16x18 ; 275 g | **confirmé** |
| V04 | RA (cordée) | 66 | L2 | https://www.tennis-warehouse.com/Yonex_EZONE_105_2025/descpageRCYONEX-EZ105B.html | 2026-10-10 | « Strung Weight: 10.2oz / 289g Balance: 13.38in / 33.99cm / 1 pts HL Swingweight: 312 Stiffness: 66 » | Yonex ne publie aucun RA (page constructeur sans champ de rigidité). Aucune seconde source indépendante trouvée : L2 unique | 64 | **signal** |
| V05 | Génération en vente et date | EZONE 2025 (« Play Full Power »), disponible dans le monde le 10/01/2025 | L3 | https://www.tennisnerd.net/gear/racquets/yonex-ezone-2025/42542 | 2026-10-10 | « Release date: The Yonex Ezone will be available globally from January 10, 2025. » | TW US intitule la fiche « Yonex EZONE 105 (2025) Racquet » (L2) ; la page Yonex ne porte ni année ni numéro de génération | fiche sans millésime | **confirmé** |

#### Wilson Clash 100 Pro (fiche « v2 ») — `wilson-clash-100-pro-v2`

Base : tamis 100 in² · 310 g · plan 16x19 · RA 55.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V06 | Tamis et plan de cordage | 100 in² ; 16 x 20 (Clash 100 Pro V3) | L0 | https://www.wilson.com/de-de/products/clash-100-pro-v3-tennis-racket-wr17270 | 2026-10-10 | « Kopfgröße 645 sq cm / 100 sq in Schlägerkontrolle 4 Serie/Franchise Clash Saitenmuster 16 x 20 » | TW US : 16 mains / 20 travers ; page d'essai TWU : String Pattern 16x20 | 100 in² ; 16x19 | **divergent** |
| V07 | Poids non cordé | 305 g (320 g cordée) | L0 | https://www.wilson.com/de-de/products/clash-100-pro-v3-tennis-racket-wr17270 | 2026-10-10 | « Balance unbespannt 31.0 Gewicht unbespannt 305.0 Model Number WR17270 » | TennisNerd (ligne suivante) : la V3 passe de 310 g à 305 g non cordée | 310 g | **divergent** |
| V08 | Poids non cordé v2 → v3 | 310 g (v2) → 305 g (v3) | L3 | https://www.tennisnerd.net/gear/racchette/wilson-clash-v3/43217 | 2026-10-10 | « they have reduced the weight of it from 310g unstrung to 305g unstrung » | Wilson DE (ligne précédente) : 305.0 g | 310 g (= v2) | **confirmé** |
| V09 | RA (mesure de laboratoire) | 57 | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/CL1P3Vreview.html | 2026-10-10 | « Tennis Warehouse University Lab Data Score Grade Flex Rating Test 57 LOW Swing Weight 327 MEDIUM » | TW US (fiche produit) : Stiffness 57 — même groupe, mais la page d'essai est une mesure (L1). Wilson ne publie pas de RA sur les pages lues | 55 | **divergent** |
| V10 | RA (fiche produit TW US) | 57 | L2 | https://www.tennis-warehouse.com/Wilson_Clash_100_Pro_v3/descpageRCWILSON-CL1P3V.html | 2026-10-10 | « Strung Weight: 11.4oz / 323g Balance: 12.59in / 31.98cm / 7 pts HL Swingweight: 327 Stiffness: 57 » | Recoupe la mesure TWU de la ligne précédente | 55 | **divergent** |
| V11 | Génération en vente et date de sortie | V3, lancée le 15/01/2025 | L3 | https://www.tennisnerd.net/gear/racchette/wilson-clash-v3/43217 | 2026-10-10 | « Release date : January 15, 2025 » | Seconde source indépendante : tennishead.net (ligne suivante) | fiche « v2 » | **divergent** |
| V12 | Date de sortie (seconde source) | 15/01/2025 ; gamme V3 : Clash 100, 100 Pro, 100L et 108 (publication du 16/01/2025) | L3 | https://tennishead.net/wilson-launches-clash-v3-redefining-performance-and-comfort/ | 2026-10-10 | « Launched on January 15, 2025, the Clash v3 offers cutting-edge upgrades » | Concorde avec TennisNerd (24/12/2024) | — | **confirmé** |
| V13 | Offre actuelle chez Wilson | la collection Clash liste « Clash 100 Pro V3 » (WR17270) et sa variante Reverse ; aucune « Clash 100 Pro V2 » | L0 | https://www.wilson.com/de-de/collections/clash-tennis-rackets | 2026-10-10 | — (constat sur une liste ou un refus : pas de texte unique à citer) | Fait d'absence constaté sur la boutique allemande : liste de 17 produits de la collection (balisage JSON-LD de la page), « Clash 100 V2 Heritage Edition » comprise | fiche « v2 » | **confirmé** |
| V14 | Signal : le 16x20 serait déjà celui de la v2 | un testeur TWU attribue à la seconde version le plan 16x20 que la V3 conserve (extrait ci-contre) : la fiche « v2 » à 16x19 pourrait être inexacte même pour la v2 | L3 (avis de testeur, page TWU) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/CL1P3Vreview.html | 2026-10-10 | « the more controlled 16x20 string pattern of the second version has remained » | Témoignage d'un testeur dans un test publié (L3) ; aucune page constructeur sur la v2 ouverte | 16x19 | **signal** |

#### Babolat Pure Aero Team — `babolat-pure-aero-team`

Base : tamis 100 in² · 285 g · plan 16x19 · RA 67.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V15 | Tamis et poids non cordé (Gen9) | 645 cm² (100 in²) ; 285 g ± 7 | L0 | https://www.babolat.com/fr/pure-aero-team-gen9-non-cordee/100-101571.html | 2026-10-10 | « Taille du tamis 645 cm² Longueur 685 mm Poids (non cordée) 285 g +/- 7 » | TW US (Team 2026 et Team 2023) : 100 in², 301 g cordée | 100 in² ; 285 g | **confirmé** |
| V16 | RA déclaré par Babolat (raquette « non cordée ») | 70 ± 3 — plan 16x19 conforme à la base | L0 | https://www.babolat.com/fr/pure-aero-team-gen9-non-cordee/100-101571.html | 2026-10-10 | « Plan de cordage 16x19 Rigidité (RA) 70 +/- 3 Section 23/26/23 » | Nature différente de la base (F2) : la page Babolat de la Pure Aero Gen9 standard donne 69,01 ± 3 (« Rigidité (RA) 69.01 +/- 3 »), que la base porte à 66 (valeur Tennis Warehouse, cordée) | RA 67 ; 16x19 | **divergent** |
| V17 | Nature du RA : cordée ou non cordée | Pure Aero 100 (2026) : RA 66 cordée, 69 non cordée | L3 | https://www.tennisnerd.net/gear/racquets/babolat-pure-aero-2026/62418 | 2026-10-10 | « Stiffness (RA): 66 strung, 69 unstrung » | Explique l'écart Babolat 69 ± 3 / Tennis Warehouse 66 ; la fiche standard de la base (66) suit la valeur cordée de TW US | standard : 66 | **confirmé** |
| V18 | RA Pure Aero Team 2023 (cordée) | 67 | L2 | https://www.tennis-warehouse.com/Babolat_Pure_Aero_Team_2023/descpageRCBAB-BAROTM.html | 2026-10-10 | « Strung Weight: 10.6oz / 301g Balance: 12.85in / 32.64cm / 5 pts HL Swingweight: 302 Stiffness: 67 » | Page d'essai TW (ligne suivante) : Flex Rating 67 | 67 | **confirmé** |
| V19 | RA Pure Aero Team 2023 (mesure Babolat RDC affichée par TW) | 67 | L1 (mesure RDC de Babolat, affichée par TW) | https://www.tennis-warehouse.com/learning_center/racquet_reviews/BAROTMreview.html | 2026-10-10 | « Babolat RDC Ratings Score Grade Flex Rating 67 Range: 0-100 Swing Weight 302 Range: 200-400 » | La valeur de la fiche (67) est celle de la génération 2023 | 67 | **confirmé** |
| V20 | RA Pure Aero Team 2026 (cordée) | 66 | L2 | https://www.tennis-warehouse.com/Babolat_Pure_Aero_Team_2026/descpageRCBAB-BPAT26.html | 2026-10-10 | « Strung Weight: 10.6oz / 301g Balance: 13in / 33.02cm / 4 pts HL Swingweight: 306 Stiffness: 66 » | Aucune seconde source pour la Team ; TennisNerd donne 66 cordée pour la Pure Aero 100 2026 (autre modèle) : L2 unique | 67 | **signal** |
| V21 | Génération en vente | Gen9 = « 2026 » | L3 | https://tennisaddict.fr/tests/babolat-pure-aero-2026-en/ | 2026-10-10 | « The Babolat Pure Aero Gen9 “2026” keeps the DNA that made this line iconic » | TennisNerd, 07/01/2026 : Pure Aero 2026 attendue en début d'année (ligne « Date de sortie » ci-dessous) ; TW US solde la Team 2023 (−22 %) | fiche sans millésime (RA = 2023) | **divergent** |
| V22 | Offre chez Babolat | seule la Gen9 est listée (« Team Gen9 Non Cordée » et « Cordée ») | L0 | https://www.babolat.com/fr/tennis/collections/pure-aero.html | 2026-10-10 | « Pure Aero Team Gen9 Non... 269,95 € TVA incl. » | Aucune page Team Gen8/2023 sur babolat.com/fr (liste de 17 produits) | — | **confirmé** |
| V23 | Date de sortie Pure Aero 2026 | début 2026 (annonce 07/01/2026 ; test publié le 17/02/2026) | L3 | https://www.tennisnerd.net/gear/racquets/babolat-pure-aero-2026/62418 | 2026-10-10 | « They will be out in the beginning of the year » | TennisAddict : test « publié le : 17 février 2026 » | — | **confirmé** |

#### Tecnifibre T-Fight 315S — `tecnifibre-tfight-315s`

Base : tamis 98 in² · 315 g · plan 18x19 · RA 64.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V24 | Plan, tamis et poids non cordé | 16x19 ; 98 in² (630 cm²) ; 315 g | L0 | https://www.tecnifibre.com/en/collections/raquettes-t-fight/products/t-fight-315s | 2026-10-10 | « Weight 315g / 11.1oz Material Graphite Head size 630cm² / 98in² Length 68.6cm Stringing pattern 16x19 - Unstrung » | TW US : 16 mains / 19 travers ; page d'essai TWU : String Pattern 16x19 | 18x19 ; 98 in² ; 315 g | **divergent** |
| V25 | RA (mesure de laboratoire) | 65 | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/TF315Sreview.html | 2026-10-10 | « Tennis Warehouse University Lab Data Score Grade Flex Rating Test 65 MED Swing Weight 325 MED » | TW US : Stiffness 65 (ligne suivante) | 64 | **divergent** |
| V26 | RA (fiche produit TW US) | 65 | L2 | https://www.tennis-warehouse.com/Tecnifibre_TFight_315S/descpageRCTFUSA-TF315S.html | 2026-10-10 | « Strung Weight: 11.7oz / 332g Balance: 12.59in / 31.98cm / 7 pts HL Swingweight: 325 Stiffness: 65 » | Recoupe la mesure TWU | 64 | **divergent** |
| V27 | Génération et date de sortie | non écrites : ni la page Tecnifibre ni la fiche TW US ne portent d'année ou de version pour la 315S | L0 | https://www.tecnifibre.com/en/collections/raquettes-t-fight/products/t-fight-315s | 2026-10-10 | — (constat sur une liste ou un refus : pas de texte unique à citer) | Fait d'absence sur les deux pages ouvertes (intitulés « T-Fight 315S Tennis Racket » et « Tecnifibre TFight 315S Racquet ») | fiche sans génération | **introuvable** |
| V28 | Fiche voisine T-Fight 305S (contrôle) | 18x19 chez Tecnifibre : la fiche 305S (2025) est juste ; seul le plan de la 315S est faux | L0 | https://www.tecnifibre.com/en/collections/raquettes-t-fight/products/t-fight-305s | 2026-10-10 | « Stringing pattern 18x19 - Unstrung » | TW US 305S : 18 mains / 19 travers, Stiffness 63 = base | 305S (2025) : 18x19 ; RA 63 | **confirmé** |

#### Yonex VCORE 98 Tour — `yonex-vcore-98-tour`

Base : tamis 98 in² · 315 g · plan 18x20 · RA 63.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V29 | Plan de cordage | 16 x 19 | L0 | https://www.yonex.com/tennis/racquets/vcore/08vc98tr | 2026-10-10 | « Stringing Pattern 16 x 19 Stringing Advice 45 - 60 lbs Item Code 08VC98TR » | TennisNerd 14/12/2025 : 16×19 ; TW US : 16 mains / 19 travers | 18x20 | **divergent** |
| V30 | Tamis et poids | 98 in² ; 315 g | L0 | https://www.yonex.com/tennis/racquets/vcore/08vc98tr | 2026-10-10 | « Head Size 98 sq.in. Weight 315g / 11.1oz Grip Size 1 - 4 Length 27 in. » | TW US : 98 in², 332 g cordée | 98 in² ; 315 g | **confirmé** |
| V31 | Plan de cordage (seconde source) | 16×19 | L3 | https://www.tennisnerd.net/gear/racquets/yonex-vcore-2026/62013 | 2026-10-10 | « VCORE 98 Tour – Slightly heavier, very stable choice for advanced hitters. ~315g, 98 sq.in., 16×19. » | Concorde avec Yonex | 18x20 | **confirmé** |
| V32 | RA (cordée) | 64 | L2 | https://www.tennis-warehouse.com/Yonex_VCORE_98_Tour_8th_Gen/descpageRCYONEX-VC9T8G.html | 2026-10-10 | « Strung Weight: 11.7oz / 332g Balance: 13in / 33.02cm / 4 pts HL Swingweight: 334 Stiffness: 64 » | Yonex ne publie aucun RA ; aucune page d'essai TWU pour la Tour : L2 unique | 63 | **signal** |
| V33 | Génération en vente | 8e génération (gamme VCORE 2026), présentée le 14/12/2025 | L3 | https://www.tennisnerd.net/gear/racquets/yonex-vcore-2026/62013 | 2026-10-10 | « The VCORE is in its 8th generation with a focus on sweet spot, snapback, speed and stability. » | TW US intitule la fiche « Yonex VCORE 98 Tour 8th Gen Racquet » ; la page Yonex ne donne pas de numéro de génération | fiche sans génération | **confirmé** |

#### Tecnifibre TF40 305 (V3) — `tecnifibre-tf40-305`

Base : tamis 98 in² · 305 g · plan 16x19 · RA 63.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V34 | Tamis, plan et poids non cordé | 98 in² (630 cm²) ; 16x19 ; 305 g — nom officiel « TF-40 305 16M V3 » | L0 | https://www.tecnifibre.com/en/collections/tf-40/products/tf-40-305-16m-v3 | 2026-10-10 | « Weight 305g / 10.8oz Material Graphite Head size 630cm² / 98in² Length 68.6cm Stringing pattern 16x19 - Unstrung » | TW US « TF40 305g (16x19) Racquet 2024 » : 98 in², 16/19 | 98 in² ; 305 g ; 16x19 | **confirmé** |
| V35 | Génération : V3 en vente, rapprochement avec « 2024 » | nouvelle ligne TF40 sortie en août 2024 ; l'équivalence nominale V3 = 2024 n'est écrite telle quelle sur aucune page ouverte | L3 | https://www.tennisnerd.net/gear/racquets/new-tecnifibre-tf40-2024/40413 | 2026-10-10 | « There is a new Tecnifibre TF40 out. » | TW US intitule la fiche 305 g 16x19 « Racquet 2024 » ; la collection Tecnifibre TF-40 ne liste que des V3 (5 produits) | fiche sans génération | **signal** |
| V36 | RA (cordée) | 64 | L2 | https://www.tennis-warehouse.com/Tecnifibre_TF40_305g_16x19/descpageRCTFUSA-TF40R1.html | 2026-10-10 | « Strung Weight: 11.3oz / 320g Balance: 13.07in / 33.2cm / 3 pts HL Swingweight: 320 Stiffness: 64 » | L2 unique (pas de page d'essai TWU pour la 305 g 16x19) | 63 | **signal** |
| V37 | Génération antérieure (TF40 v1 305 16x19, toujours listée par TW US) | mêmes valeurs que la 2024 : 98 in², 16x19, 320 g cordée, RA 64 — les deux générations sont indiscernables par leurs caractéristiques | L2 | https://www.tennis-warehouse.com/Tecnifibre_TF40_v1_305_16x19_Racquet/descpageRCTFUSA-TF4016.html | 2026-10-10 | « Strung Weight: 11.3oz / 320g Balance: 13.07in / 33.2cm / 3 pts HL Swingweight: 321 Stiffness: 64 » | Confirme la remarque de la mission (génération non dite par la fiche, mêmes caractéristiques) ; la base (RA 63) ne correspond à aucune des deux | 63 | **signal** |
| V38 | RA publié par Tecnifibre | aucun | L3 | https://www.tennisnerd.net/gear/racquets/new-tecnifibre-tf40-2024/40413 | 2026-10-10 | « there is no mention there of stiffness or swing weight » | Constat de TennisNerd sur le site Tecnifibre (26/08/2024) ; aucun champ de rigidité sur les pages Tecnifibre ouvertes | RA 63 sans source constructeur | **introuvable** |

#### Head Extreme MP — `head-extreme-standard` (variante « Standard » de la base)

Base : tamis 100 in² · 300 g · plan 16x19 · RA 65.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V39 | Fiche constructeur Head | head.com a refusé le robot (HTTP 429, 10/10/2026, constat de tsa-core) : aucune page lue, hôte non rouvert | — | — | — | — (constat sur une liste ou un refus : pas de texte unique à citer) | — | — | **introuvable** |
| V40 | RA Extreme MP 2024 (mesure de laboratoire) | 66 | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/HREM24review.html | 2026-10-10 | « Tennis Warehouse University Lab Data Score Grade Flex Rating Test 66 MEDIUM Swing Weight 323 MEDIUM » | TW US « Head Extreme MP 2024 » : Stiffness 66 (ligne suivante) | 65 | **divergent** |
| V41 | RA Extreme MP 2024 (fiche TW US) | 66 | L2 | https://www.tennis-warehouse.com/Head_Extreme_MP_2024/descpageRCHEAD-HREM24.html | 2026-10-10 | « Strung Weight: 11.2oz / 318g Balance: 12.99in / 32.99cm / 4 pts HL Swingweight: 323 Stiffness: 66 » | Recoupe la mesure TWU | 65 | **divergent** |
| V42 | RA Extreme MP (modèle courant TW US, code HREM26) | 67 | L2 | https://www.tennis-warehouse.com/Head_Extreme_MP_Racquet/descpageRCHEAD-HREM26.html | 2026-10-10 | « Strung Weight: 11.2oz / 318g Balance: 12.99in / 32.99cm / 4 pts HL Swingweight: 318 Stiffness: 67 » | L2 unique ; la page ne porte pas d'année dans son titre (le code HREM26 et la composition Boron/Auxetic 2 la rattachent à la gamme 2026) | 65 | **signal** |
| V43 | RA Graphene 360+ Extreme MP (génération 2022) | 66 | L2 | https://www.tennis-warehouse.com/Head_Graphene_360_Extreme_MP/descpageRCHEAD-360XM.html | 2026-10-10 | « Strung Weight: 11.2oz / 318g Balance: 13.18in / 33.48cm / 3 pts HL Swingweight: 325 Stiffness: 66 » | L2 unique ; parmi les trois générations lues (2022, 2024, 2026), aucune n'est à 65 (valeur de la base) | 65 | **signal** |
| V44 | Tamis, plan et poids (page d'essai 2024) | 100 in² ; 16x19 ; 318 g cordée (poids non cordé non publié sur les pages ouvertes) | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/HREM24review.html | 2026-10-10 | « Length 27 in Head Size 100 sq in Weight 11.2 oz Balance Point 12.99 in Construction 23mm / 26mm / 21mm String Pattern 16x19 » | TW US : 100 in², 16 mains / 19 travers | 100 in² ; 300 g ; 16x19 | **confirmé** |
| V45 | Génération 2026 : lancement | gamme Extreme 2026 (Hy-Bor) disponible le 16/07/2026 ; l'Extreme MP 2026 pèse 300 g | L3 | https://www.tennisnerd.net/gear/racquets/head-extreme-2026-racquet-line-preview/66459 | 2026-10-10 | « the new HEAD Extreme 2026 series launches July 16 with a new Hy-Bor technology » | TW US liste l'Extreme MP 2024 en solde (« Reduced ») à côté du modèle courant HREM26 | fiche sans millésime | **confirmé** |

#### Head Speed MP — `head-speed-mp`

Base : tamis 100 in² · 300 g · plan 16x19 · RA 61.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V46 | RA Speed MP 2024 (mesure de laboratoire) | 60 | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/HSPDMreview.html | 2026-10-10 | « Tennis Warehouse University Lab Data Score Grade Flex Rating Test 60 LOW Swing Weight 330 HIGH » | TW US « Head Speed MP 2024 » : Stiffness 60 | 61 | **divergent** |
| V47 | RA Speed MP 2026 (fiche TW US) | 60 | L2 | https://www.tennis-warehouse.com/Head_Speed_MP_2026/descpageRCHEAD-HSPMP6.html | 2026-10-10 | « Strung Weight: 11.2oz / 318g Balance: 13in / 33.02cm / 4 pts HL Swingweight: 329 Stiffness: 60 » | Même RA que la 2024 : les deux générations ne se distinguent pas par le RA (poids cordé 315 g en 2024, 318 g en 2026) | 61 | **signal** |
| V48 | Tamis et plan (page d'essai 2024) | 100 in² ; 16x19 | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/HSPDMreview.html | 2026-10-10 | « Head Size 100 sq in Weight 11.1 oz Balance Point 13 in Construction 23 mm / 23 mm / 23 mm String Pattern 16x19 » | TW US : 100 in², 16 mains / 19 travers | 100 in² ; 16x19 | **confirmé** |
| V49 | Génération 2026 : lancement | Speed 2026 lancée (article du 09/12/2025, mis à jour le 15/01/2026) | L3 | https://www.tennisnerd.net/gear/racquets/new-head-speed-2026-racquet-series/61934 | 2026-10-10 | « HEAD has just launched the next generation of its iconic Speed racquet line, the Speed 2026 » | TW US liste Speed MP 2024 (soldé) et Speed MP 2026 | fiche sans millésime | **confirmé** |

#### Head Instinct MP — `head-instinct-mp`

Base : tamis 100 in² · 300 g · plan 16x19 · RA 65.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V50 | RA Instinct MP 2025 (mesure de laboratoire) | 64 | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/HINMPreview.html | 2026-10-10 | « Tennis Warehouse University Lab Data Score Grade Flex Rating Test 64 MEDIUM Swing Weight 317 MEDIUM » | TW US (page « Head Instinct MP 2025 Demo », ligne suivante) : Stiffness 64 | 65 | **divergent** |
| V51 | RA Instinct MP 2025 (TW US, version démo) | 64 | L2 | https://www.tennis-warehouse.com/Head_Instinct_MP_2025_Demo/descpageRCHEAD-HINMPD.html | 2026-10-10 | « Strung Weight: 11.2oz / 318g Balance: 13in / 33.02cm / 4 pts HL Swingweight: 317 Stiffness: 64 » | Recoupe la mesure TWU ; TW US ne propose que la version « Demo » de l'Instinct MP adulte | 65 | **divergent** |
| V52 | Présence chez Tennis Warehouse US | la catégorie Head de TW US (lue en direct) ne liste que les Instinct juniors ; l'Instinct MP adulte n'apparaît que sous forme de page « Demo » | L2 | https://www.tennis-warehouse.com/Headracquets.html | 2026-10-10 | — (constat sur une liste ou un refus : pas de texte unique à citer) | Fait d'absence ; Tennis Warehouse Europe non rouvert (refus 406 du 10/10) | — | **signal** |
| V53 | Génération en vente | Instinct MP 2025 ; date de sortie introuvable | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/HINMPreview.html | 2026-10-10 | « Head Instinct MP 2025 Tennis Racquet Review » | tennisshopen.se intitule sa fiche « Head Instinct Mp 300g - 2025 » (L2) ; aucune page ouverte ne donne la date de sortie | fiche sans millésime | **confirmé** |
| V54 | Tamis, poids non cordé, plan | 100 in² ; 300 g ; 16/19 | L2 | https://tennisshopen.se/en/brands/head/tennisracket/head-instinct-mp-300g-2025/ | 2026-10-10 | « Weight: 300 g / 10.6 oz Strung pattern: 16/19 Hitting surface: 100 in² » | Page d'essai TWU : tamis 100 in², plan 16x19, 318 g cordée | 100 in² ; 300 g ; 16x19 | **confirmé** |

### Section B — Raquettes dont le RA ne change pas, ou sans RA (identification, génération, tamis, plan, poids)

#### Tecnifibre Tempo 285 (V2) — `tecnifibre-tempo-285`

Base : tamis 100 in² · 285 g · plan 16x19 · RA 65.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V55 | Tempo 285 V2 : caractéristiques | 100 in² (645 cm²) ; 285 g non cordée ; 16x19 ; longueur 67,5 cm | L0 | https://www.tecnifibre.com/en/collections/outlet-raquettes-de-tennis/products/tempo-285-v2 | 2026-10-10 | « Weight 285g / 10.1oz Material Graphite Head size 645cm² / 100in² Length 67.5cm Stringing pattern 16x19 - Unstrung » | Conforme à la base ; le produit n'est plus qu'en Outlet (ligne suivante) | 100 in² ; 285 g ; 16x19 | **confirmé** |
| V56 | Statut de vente de la V2 | Outlet : 116,99 € au lieu de 179,99 € (−35 %) | L0 | https://www.tecnifibre.com/en/collections/outlet-raquettes-de-tennis/products/tempo-285-v2 | 2026-10-10 | « TEMPO 285 V2 Grip 1 • 179,99€ 116,99€ -35% Add to cart » | Absente de la collection « Tempo » courante (Tour, Team, L, OS) | — | **confirmé** |
| V57 | Génération en vente : Tempo Tour 285 g (2026) | 102 in² (660 cm²) ; 285 g ; 16x19 ; longueur 68,5 cm | L0 | https://www.tecnifibre.com/en/collections/raquettes-tempo/products/tempo-tour | 2026-10-10 | « Weight 285 g / 10,05 oz Material Graphite Head size 660 cm² / 102 in² Length 68,5 cm » | Page Tecnifibre seule (TW US ne référence pas le Tempo) | 100 in² | **divergent** |
| V58 | Génération : 2026 face à « Tempo 285 2024 » | la page Tempo Tour compare le produit 2026 au « Tempo 285 2024 » ; l'équivalence V2 = 2024 n'est pas écrite | L0 | https://www.tecnifibre.com/en/collections/raquettes-tempo/products/tempo-tour | 2026-10-10 | « comparing the TEMPO TOUR 285g 2026 product with the TEMPO 285 2024 » | — | fiche sans génération | **signal** |
| V59 | RA | aucun RA publié par Tecnifibre ; le Tempo n'est pas référencé par Tennis Warehouse US | L2 | https://www.tennis-warehouse.com/Tecnifibreracquets.html | 2026-10-10 | — (constat sur une liste ou un refus : pas de texte unique à citer) | Fait d'absence : catégorie Tecnifibre de TW US lue en direct le 10/10/2026 (23 fiches : Fire, TF40, TFight), aucun Tempo. La valeur 65 de la base n'a retrouvé aucune source | 65 | **introuvable** |

#### Wilson Burn 100LS v5 — `wilson-burn-100ls-v5`

Base : tamis 100 in² · 280 g · plan 18x16 · RA 72.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V60 | Tamis (V6.0) | 100 in² | L0 | https://www.wilson.com/de-de/products/burn-100ls-v60-ecom-wr22000 | 2026-10-10 | « Kopfgröße 645 sq cm / 100 sq in » | TW US : 100 in² | 100 in² | **confirmé** |
| V61 | Plan et poids non cordé (V6.0) | 18x16 ; 280 g (296 g cordée) | L0 | https://www.wilson.com/de-de/products/burn-100ls-v60-ecom-wr22000 | 2026-10-10 | « Saitenmuster 18 x 16 Balance bespannt 33.8 Gewicht bespannt 296.0 Balance unbespannt 32.8 Gewicht unbespannt 280.0 » | V5 aux mêmes valeurs (ligne suivante) ; TW US : 18 mains / 16 travers, 298 g cordée | 18x16 ; 280 g | **confirmé** |
| V62 | La V5 est toujours en vente chez Wilson DE | V5 : mêmes valeurs, 144 € (remise) ; la collection Burn liste V5 et V6.0 | L0 | https://www.wilson.com/de-de/products/burn-100ls-v5-rkt-ecom-wr17080 | 2026-10-10 | « In den Warenkorb legen \| €144,00 Produktdetails Produkttabelle Geschlecht Unisex Kopfform Oval Kopfgröße 645 sq cm / 100 sq in » | Écart avec la commande (« seule la V6 ») : constat daté sur la boutique allemande ; TW US ne liste que la V6 | V5 | **confirmé** |
| V63 | RA V6 (cordée) | 72 | L2 | https://www.tennis-warehouse.com/Wilson_Burn_100_LS_v6/descpageRCWILSON-BRNLS6.html | 2026-10-10 | « Strung Weight: 10.5oz / 298g Balance: 13.12in / 33.32cm / 3 pts HL Swingweight: 313 Stiffness: 72 » | L2 unique, identique à la base : aucune action | 72 | **confirmé** |
| V64 | V6 = mise à jour cosmétique 2026 | nouvelle cosmétique 2026 ; le texte TW la place dans la lignée de la génération précédente (« Like the previous generation ») ; aucun changement de caractéristiques annoncé | L2 | https://www.tennis-warehouse.com/Wilson_Burn_100_LS_v6/descpageRCWILSON-BRNLS6.html | 2026-10-10 | « Introducing the Burn 100LS v6! Updated with a new cosmetic for 2026 » | Wilson DE : V5 et V6.0 ont les mêmes valeurs publiées. Date de sortie non publiée (introuvable) | V5 | **confirmé** |

#### Wilson Pro Staff 97 v14 — `wilson-pro-staff-97-v14`

Base : tamis 97 in² · 315 g · plan 16x19 · RA 66.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V65 | Édition Roland-Garros 2026 « Session de Soirée » : tamis | 97 in² (626 cm²) | L0 | https://www.wilson.com/de-de/products/pro-staff-97-v14-rolandgarros-2026-session-de-soire-tennis-racket-wr20890 | 2026-10-10 | « Kopfgröße 626 sq cm / 97 sq in » | TW US « Pro Staff 97 v14 Session Soiree » : 97 in² | 97 in² | **confirmé** |
| V66 | Édition RG 2026 : plan et poids non cordé | 16x19 ; 315 g (330 g cordée) | L0 | https://www.wilson.com/de-de/products/pro-staff-97-v14-rolandgarros-2026-session-de-soire-tennis-racket-wr20890 | 2026-10-10 | « Saitenmuster 16 x 19 Balance bespannt 32.0 Gewicht bespannt 330.0 Balance unbespannt 31.0 Gewicht unbespannt 315.0 » | TW US : 16 mains / 19 travers, 332 g cordée | 16x19 ; 315 g | **confirmé** |
| V67 | Nature de l'édition RG | édition limitée de la Pro Staff 97 V14 | L0 | https://www.wilson.com/de-de/products/pro-staff-97-v14-rolandgarros-2026-session-de-soire-tennis-racket-wr20890 | 2026-10-10 | « this limited-edition version of the Pro Staff 97 V14 » | TW US ne liste que l'édition « Session Soiree » (pas de Pro Staff 97 v14 standard dans sa catégorie Wilson) | « 97 v14 » | **confirmé** |
| V68 | Modèle standard chez Wilson DE | affiché épuisé (« Ausverkauft ») | L0 | https://www.wilson.com/de-de/products/pro-staff-97-v14-tennis-racket-wr12570 | 2026-10-10 | « Ausverkauft Anpassen Spielstil: 3 Power 2 Spin 5 Control » | La collection Pro Staff liste encore la fiche standard (WR12570) | — | **confirmé** |
| V69 | Incohérence Wilson sur le tamis du modèle standard | 98 in² (632 cm²) sur la page du modèle standard, 97 in² sur l'édition RG | L0 | https://www.wilson.com/de-de/products/pro-staff-97-v14-tennis-racket-wr12570 | 2026-10-10 | « Kopfgröße 632 sq cm / 98 sq in » | TW US et page RG : 97 in². Ne justifie pas de modifier la base | 97 in² | **signal** |
| V70 | RA (cordée) | 66 | L2 | https://www.tennis-warehouse.com/Wilson_Pro_Staff_97_v14_Session_Soiree/descpageRCWILSON-PS14SS.html | 2026-10-10 | « Strung Weight: 11.7oz / 332g Balance: 12.6in / 32cm / 7 pts HL Swingweight: 325 Stiffness: 66 » | L2 unique, identique à la base : aucune action | 66 | **confirmé** |
| V71 | Date de sortie de la V14 | février 2023 | L3 | https://www.tennis.com/baseline/articles/roger-federer-introduces-the-new-wilson-pro-staff | 2026-10-10 | « Published February 16, 2023 » | tennismajors.com, 17/02/2023 (ligne suivante) | — | **confirmé** |
| V72 | Date de sortie de la V14 (seconde source) | 17/02/2023 : lancement de la V14 | L3 | https://www.tennismajors.com/others-news/federer-launches-new-wilson-pro-staff-racquet-661309.html | 2026-10-10 | « Wilson Tennis roped in 20-time Grand Slam winner Roger Federer for the launching of their new Wilson Pro Staff V14 » | Concorde avec tennis.com | — | **confirmé** |

#### Wilson US Open Junior 21 — `wilson-us-open-junior-21`

Base : tamis 85 in² · 185 g · plan 16x17 · équilibre 285 mm · RA non publié.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V73 | Tamis, longueur, plan (officiel) | 95 in² ; 21 in ; 16 x 18 | L0 | https://au.wilson.com/products/us-open-jr-21-tennis-racket | 2026-10-10 | « Head Sq In 95 Length In 21 Model Number WR198610U+ String Pattern 16 x 18 » | TW US « US Open 21" Junior » : 95 in² ; boutique DE : « Slam Jr 21 », 95 in², 16 x 18 | 85 in² ; 16x17 | **divergent** |
| V74 | Poids cordé et équilibre cordé | 186 g ; 26,8 cm | L0 | https://au.wilson.com/products/us-open-jr-21-tennis-racket | 2026-10-10 | « Strung Balance Cm 26.8 Strung Weight Grams 186 » | Le texte de la page DE (« Slam Jr 21 ») donne aussi 186 g cordée | 185 g (≈ cordée) ; 285 mm | **divergent** |
| V75 | Poids non cordé et équilibre non cordé | 171 g ; 25,8 cm | L0 | https://au.wilson.com/products/us-open-jr-21-tennis-racket | 2026-10-10 | « Unstrung Balance Cm 25.8 Unstrung Balance Pts -2 Unstrung Weight Grams 171 » | Convention de poids junior à trancher par tsa-core (la base annonce 185) | 185 g ; 285 mm | **divergent** |
| V76 | Génération et date de sortie (US Open Jr 21, 23 et 25) | non écrites : aucune des pages ouvertes (Wilson AU, Wilson DE, TW US) ne porte d'année ni de version | L0 | https://au.wilson.com/products/us-open-jr-21-tennis-racket | 2026-10-10 | — (constat sur une liste ou un refus : pas de texte unique à citer) | Fait d'absence ; les références produit (WR198610U+, WR198510U+, WR198410U+) sont les seules marques de génération | fiche sans génération | **introuvable** |
| V77 | Tamis (seconde source L2) | 95 in² (593,54 cm²) | L2 | https://www.tennis-warehouse.com/Wilson_US_Open_21_Junior/descpageRCWILSON-WSB21.html | 2026-10-10 | « Head Size: 95 in² / 593.54 cm² Length: 21 in / 53.34 cm » | Concorde avec Wilson | 85 in² | **confirmé** |

#### Wilson US Open Junior 23 — `wilson-us-open-junior-23`

Base : tamis 90 in² · 205 g · plan 16x18 · équilibre 295 mm · RA non publié.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V78 | Tamis, longueur, plan (officiel) | 95 in² ; 23 in ; 16 x 19 | L0 | https://au.wilson.com/products/us-open-jr-23-tennis-racket | 2026-10-10 | « Head Sq In 95 Length In 23 Model Number WR198510U+ String Pattern 16 x 19 » | Boutique DE : « Slam Jr 23 », 95 in², 16 x 19 | 90 in² ; 16x18 | **divergent** |
| V79 | Poids cordé et équilibre cordé | 200 g ; 28,5 cm | L0 | https://au.wilson.com/products/us-open-jr-23-tennis-racket | 2026-10-10 | « Strung Balance Cm 28.5 Strung Balance Pts -2 Strung Weight Grams 200 » | Le texte de la page DE (« Slam Jr 23 ») donne aussi 200 g cordée | 205 g ; 295 mm | **divergent** |
| V80 | Poids non cordé et équilibre non cordé | 185 g ; 28 cm | L0 | https://au.wilson.com/products/us-open-jr-23-tennis-racket | 2026-10-10 | « Unstrung Balance Cm 28 Unstrung Balance Pts -3 Unstrung Weight Grams 185 » | Convention de poids junior à trancher | 205 g ; 295 mm | **divergent** |

#### Wilson US Open Junior 25 — `wilson-us-open-junior-25`

Base : tamis 98 in² · 225 g · plan 16x18 · équilibre 310 mm · RA non publié.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V81 | Tamis, longueur, plan (officiel) | 106 in² ; 25 in ; 16 x 19 | L0 | https://au.wilson.com/products/us-open-jr-25-tennis-racket | 2026-10-10 | « Head Sq In 106 Length In 25 Model Number WR198410U+ String Pattern 16 x 19 » | Boutique DE : « Slam Jr 25 », 106 in² (684 cm²), 16 x 19 | 98 in² ; 16x18 | **divergent** |
| V82 | Poids cordé et équilibre cordé | 220 g ; 31 cm | L0 | https://au.wilson.com/products/us-open-jr-25-tennis-racket | 2026-10-10 | « Strung Balance Cm 31 Strung Balance Pts -2 Strung Weight Grams 220 » | — | 225 g ; 310 mm | **divergent** |
| V83 | Poids non cordé et équilibre non cordé | 205 g ; 30 cm | L0 | https://au.wilson.com/products/us-open-jr-25-tennis-racket | 2026-10-10 | « Unstrung Balance Cm 30 Unstrung Balance Pts -5 Unstrung Weight Grams 205 » | Convention de poids junior à trancher | 225 g ; 310 mm | **divergent** |

#### Wilson Blade Junior 25 (Blade Feel) — `wilson-blade-junior-25`

Base : tamis 98 in² · 240 g · plan 16x19 · équilibre 320 mm · RA non publié.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V84 | Tamis et plan (Blade Feel Comp Jr 25) | 100 in² (645 cm²) ; 16 x 19 | L0 | https://www.wilson.com/de-de/products/blade-feel-comp-jr-25-tennis-racket-wr12530 | 2026-10-10 | « Kopfgröße 645 sq cm / 100 sq in Serie/Franchise Blade Saitenmuster 16 x 19 » | Un seul L0 : TW US ne vend pas ce modèle (il vend les « Blade 25 v10 Junior ») | 98 in² ; 16x19 | **divergent** |
| V85 | Poids cordé / non cordé et équilibre | 258 g cordée ; 243 g non cordée ; équilibre non cordé 30,5 (unité non écrite sur la page) | L0 | https://www.wilson.com/de-de/products/blade-feel-comp-jr-25-tennis-racket-wr12530 | 2026-10-10 | « Gewicht bespannt 258.0 Balance unbespannt 30.5 Gewicht unbespannt 243.0 » | Écart de 3 g avec la base, dans la tolérance de ±5 g utilisée par tsa-core | 240 g ; 320 mm | **divergent** |
| V86 | Génération et date de sortie | non écrites : la page Wilson ne porte ni année ni version (référence WR12530) | L0 | https://www.wilson.com/de-de/products/blade-feel-comp-jr-25-tennis-racket-wr12530 | 2026-10-10 | — (constat sur une liste ou un refus : pas de texte unique à citer) | Fait d'absence sur la page ouverte | fiche sans génération | **introuvable** |
| V87 | Disponibilité chez Wilson DE | épuisé ; public visé : 9-10 ans | L0 | https://www.wilson.com/de-de/products/blade-feel-comp-jr-25-tennis-racket-wr12530 | 2026-10-10 | « Ausverkauft Übersicht Wilson's Blade Feel Comp Jr is a great racket for 9 to 10 year old players » | Nom officiel : « Blade Feel Comp Jr 25 » (la base : « Blade Feel » / « Junior 25" »). Disponibilité datée du 10/10/2026 | — | **confirmé** |

### Section C — Cordages (rigidité, puis jauges, puis coloris)

#### Babolat RPM Team — `babolat-rpm-team`

Base : polyester · jauges 1.25 / 1.30 / 1.35 · rigidité 225 lb/in · coloris Pink.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V88 | Rigidité mesurée (1.30) | 280,6 lb/in | L1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php (formulaire public, POST : tous matériaux, 51 lb, vitesse Fast) | 2026-10-10 | « Babolat RPM Team 16 Black 51 Fast Polyester 1.3 280.6 22 3.9 » | TWU mesure chaque jauge ; la jauge de référence d'une fiche est une décision de produit non tranchée (chantier C2) | 225 lb/in | **divergent** |
| V89 | Rigidité mesurée (1.25) | 245,2 lb/in | L1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php (formulaire public, POST : tous matériaux, 51 lb, vitesse Fast) | 2026-10-10 | « Babolat RPM Team 17 (1.25) 51 Fast Nylon/Polyester 1.25 245.2 23.2 5.3 » | Idem | 225 lb/in | **divergent** |
| V90 | Jauges proposées | 1.25 et 1.30 seulement (1.35 absente) | L0 | https://www.babolat.com/fr/rpm-team-12m/241108.html | 2026-10-10 | « Coloris Noir selected Jauge Sélectionner Jauge 125 130 » | Babolat US : jauges 17 et 16 ; TW US : 17/1.25 et 16/1.30. La 1.35 est introuvable sur ces trois sources | 1.25 / 1.30 / 1.35 | **divergent** |
| V91 | Coloris officiel | Noir | L0 | https://www.babolat.com/fr/rpm-team-12m/241108.html | 2026-10-10 | « RPM Team 12M cordage de tennis 18,95 € TVA incl. 1,58 €/Mètre Retour gratuit Coloris Noir selected Jauge Sélectionner Jauge 125 130 » | Babolat US : Color Black ; TW US : Color: Black (16/1.30 et 17/1.25) | Pink | **divergent** |
| V92 | Coloris (Babolat US) | Black ; jauges 17 et 16 | L0 | https://www.babolat.com/us/rpm-team-12m/241108.html | 2026-10-10 | « Color Black selected Gauge Select Gauge 17 16 » | Concorde avec Babolat FR | Pink | **confirmé** |
| V93 | Coloris (Tennis Warehouse US) | Black | L2 | https://www.tennis-warehouse.com/Babolat_RPM_Team_16_130_String/descpageACBAB-BRPM16.html | 2026-10-10 | « Gauge: 16/1.30mm Length: 40ft/12m Construction: Extruded co-poly monofilament with an octagonal profile Color: Black » | Concorde | Pink | **confirmé** |

#### Tecnifibre TGV — `tecnifibre-tgv`

Base : multifilament · jauges 1.25 / 1.30 / 1.35 · rigidité 145 lb/in · coloris Pink.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V94 | Rigidité mesurée (1.30) | 157,2 lb/in | L1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php (formulaire public, POST : tous matériaux, 51 lb, vitesse Fast) | 2026-10-10 | « Tecnifibre TGV 16 51 Fast Nylon/Polyurethane 1.3 157.2 24.8 3.1 » | TWU mesure chaque jauge | 145 lb/in | **divergent** |
| V95 | Rigidité mesurée (1.25) | 165,2 lb/in | L1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php (formulaire public, POST : tous matériaux, 51 lb, vitesse Fast) | 2026-10-10 | « Tecnifibre TGV 17/1.25 51 Fast Nylon/Polyurethane 1.25 165.2 21.2 3 » | Idem | 145 lb/in | **divergent** |
| V96 | Coloris officiel (noir) | Noir ; jauges 1.25 / 1.30 / 1.35 | L0 | https://www.tecnifibre.com/en/collections/cordages-de-tennis-multifilament/products/garniture-tgv-black | 2026-10-10 | « Color - Black Gauge 1.25 1.30 1.35 Add to cart » | Page Tecnifibre seule : TW US ne référence pas le TGV (ligne « Présence chez TW US ») et Tennis-Point a refusé le robot de tsa-core (429) | Pink | **divergent** |
| V97 | Présence chez Tennis Warehouse US | aucune fiche TGV parmi les 105 cordages Tecnifibre listés (catégorie lue en direct) | L2 | https://www.tennis-warehouse.com/TecnifibreString.html | 2026-10-10 | — (constat sur une liste ou un refus : pas de texte unique à citer) | Fait d'absence ; les Multifeel y sont (16/1.30 et 17/1.25, noir et naturel) | — | **confirmé** |
| V98 | Coloris officiel (naturel) | Naturel ; jauges 1.25 à 1.40 | L0 | https://www.tecnifibre.com/en/collections/cordages-de-tennis-multifilament/products/garniture-tgv-naturel | 2026-10-10 | « Color - Natural Gauge 1.25 1.30 1.35 1.40 Add to cart » | Idem | Pink | **divergent** |
| V99 | Coloris « Pink » | aucune page ouverte ne donne un TGV rose | — | — | — | — (constat sur une liste ou un refus : pas de texte unique à citer) | Introuvable | Pink | **introuvable** |

#### Tecnifibre Multifeel — `tecnifibre-multifeel`

Base : multifilament · jauge 1.30 seule · rigidité 160 lb/in · coloris Black.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V100 | Rigidité mesurée (16 Black, 1.30) | 148,6 lb/in | L1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php (formulaire public, POST : tous matériaux, 51 lb, vitesse Fast) | 2026-10-10 | « Tecnifibre Multifeel 16 Black (1.30) 51 Fast Nylon/Polyurethane 1.3 148.6 18.1 6.9 » | TWU liste aussi « Multi-Feel 16 » (1.30) à 154,9 et « Multi-Feel 17 (1.25) » à 150,3 | 160 lb/in | **divergent** |
| V101 | Rigidité mesurée (Multi-Feel 17, 1.25) | 150,3 lb/in | L1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php (formulaire public, POST : tous matériaux, 51 lb, vitesse Fast) | 2026-10-10 | « Tecnifibre Multi-Feel 17 (1.25) 51 Fast Nylon/Polyurethane 1.25 150.3 20.9 2.6 » | Idem | 160 lb/in | **divergent** |
| V102 | Jauges (noir) | 1.25 et 1.30 | L0 | https://www.tecnifibre.com/en/collections/cordages-de-tennis-multifilament/products/garniture-multifeel-black | 2026-10-10 | « Color - Black Gauge 1.25 1.30 Add to cart » | TW US : Multifeel 16/1.30 (Black) et 17/1.25 (Natural) en vente | 1.30 seule | **divergent** |
| V103 | Jauges (naturel) | 1.25, 1.30 et 1.35 | L0 | https://www.tecnifibre.com/en/collections/cordages-de-tennis-multifilament/products/garniture-multifeel-naturel | 2026-10-10 | « Color - Natural Gauge 1.25 1.30 1.35 Add to cart » | Idem | 1.30 seule | **divergent** |
| V104 | Coloris | noir et naturel | L0 | https://www.tecnifibre.com/en/collections/cordages-de-tennis-multifilament/products/garniture-multifeel-black | 2026-10-10 | « Available in Colour: natural/black. » | TW US : Multifeel Black et Natural | Black | **confirmé** |
| V105 | Présence chez Tennis Warehouse US | Multifeel 16/1.30 et 17/1.25, en noir et en naturel (aiguillettes et bobines) | L2 | https://www.tennis-warehouse.com/TecnifibreString.html | 2026-10-10 | — (constat sur une liste ou un refus : pas de texte unique à citer) | Fiches ouvertes : 16/1.30 Black (« Color : Black ») et 17/1.25 Natural (« Gauge: 17/1.25mm … Color: Natural ») | 1.30 seule | **confirmé** |

#### Yonex Poly Tour Strike — `yonex-poly-tour-strike`

Base : polyester · jauges 1.20 / 1.25 / 1.30 · rigidité 215 lb/in · coloris Grey.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V106 | Rigidité mesurée (16L, 1.25) | 199,5 lb/in | L1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php (formulaire public, POST : tous matériaux, 51 lb, vitesse Fast) | 2026-10-10 | « Yonex Poly Tour Strike 16L (1.25) 51 Fast Polyester 1.25 199.5 27.9 4.6 » | Aucune ligne TWU pour les jauges 1.20 et 1.30 | 215 lb/in | **divergent** |
| V107 | Jauge 1.30 : le produit existe | POLYTOUR STRIKE 130 — modèle PTGST130, 16 (1.30 mm) | L0 | https://us.yonex.com/products/polytour-strike-130-set | 2026-10-10 | « Material POLYESTER (MONOFILAMENT) Gauge 16 (1.30mm) Model Number PTGST130 » | La collection « tennis-string » de us.yonex.com liste aussi polytour-strike-130-set. Contredit l'hypothèse « non fabriqué » | 1.30 présent | **confirmé** |
| V108 | Jauge 1.30 : disponibilité | épuisé pour les trois coloris au 10/10/2026 | L0 | https://us.yonex.com/products/polytour-strike-130-set | 2026-10-10 | « POLYTOUR STRIKE 130 - SET Sold out Notify Me Get notified when this product is back in stock » | Disponibilité datée du 10/10/2026 (charte F11) : elle peut changer à tout moment | — | **confirmé** |
| V109 | Jauge 1.25 | 16L (1.25 mm), modèle PTGST125 | L0 | https://us.yonex.com/products/polytour-strike-125-set | 2026-10-10 | « Material POLYESTER (MONOFILAMENT) Gauge 16L (1.25mm) Model Number PTGST125 » | — | 1.25 présent | **confirmé** |
| V110 | Jauge 1.20 | 17 (1.20 mm), modèle PTGST120 | L0 | https://us.yonex.com/products/polytour-strike-120-set | 2026-10-10 | « Material POLYESTER (MONOFILAMENT) Gauge 17 (1.20mm) Model Number PTGST120 » | — | 1.20 présent | **confirmé** |
| V111 | Coloris | Iron Gray, Cool Black, Blue | L0 | https://us.yonex.com/products/polytour-strike-125-set | 2026-10-10 | « Color: IRON GRAY COOL BLACK Variant sold out or unavailable BLUE Variant sold out or unavailable » | Un revendeur britannique liste Blue, Iron Grey, Cool Black | Grey (= Iron Gray) | **confirmé** |
| V112 | Page www.yonex.com du produit | page produit vide ; produit absent de la liste « Polyester » du site | L0 | https://www.yonex.com/tennis/strings/polyester/polytour-strike | 2026-10-10 | « We can't find products matching the selection. » | La liste de 8 produits de la catégorie Polyester (POLYTOUR PRO, FORCE, REV, FIRE, SPIN, AIR, DRIVE, DRIVE SOFT) ne contient pas le Strike ; l'URL www.yonex.com/…/ptgst120 répond 404 ; la page TW US du Strike 17/1.20 répond 404 | — | **signal** |
| V113 | Présence chez Tennis Warehouse US | aucun Poly Tour Strike parmi les 46 cordages Yonex listés (catégorie lue en direct) | L2 | https://www.tennis-warehouse.com/YonexString.html | 2026-10-10 | — (constat sur une liste ou un refus : pas de texte unique à citer) | Fait d'absence ; la fiche TW US du Strike 17/1.20 répond 404. Le produit n'est donc plus vendu par TW US, sans que cela dise s'il est fabriqué | — | **confirmé** |

### Section D — Fiches voisines, hors liste de la mission

#### Fiches voisines non listées par la mission (signaux)

Base : voir lignes.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 25 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| V114 | `wilson-clash-100-v2` : RA de la v3 en vente | 54 (fiche produit et mesure TWU) | L1 | https://www.tennis-warehouse.com/learning_center/racquet_reviews/CL103Vreview.html | 2026-10-10 | « Tennis Warehouse University Lab Data Score Grade Flex Rating Test 54 LOW Swing Weight 308 LOW » | TW US Clash 100 v3 : Stiffness 54 (ligne suivante) | 57 (fiche « v2 ») | **signal** |
| V115 | `wilson-clash-100-v2` (fiche produit TW US) | 54 | L2 | https://www.tennis-warehouse.com/Wilson_Clash_100_v3/descpageRCWILSON-CL103V.html | 2026-10-10 | « Strung Weight: 11oz / 312g Balance: 12.59in / 31.98cm / 7 pts HL Swingweight: 308 Stiffness: 54 » | Idem | 57 | **signal** |
| V116 | `wilson-clash-100l-v3` : RA | 54 ; la base porte 295 g, qui est le poids cordé de la fiche TW US | L2 | https://www.tennis-warehouse.com/Wilson_Clash_100L_v3/descpageRCWILSON-CL1L3V.html | 2026-10-10 | « Strung Weight: 10.4oz / 295g Balance: 12.79in / 32.49cm / 6 pts HL Swingweight: 301 Stiffness: 54 » | L2 unique | 57 ; 295 g | **signal** |

### Introuvable

- **RA des constructeurs** : Tecnifibre (T-Fight 315S, TF40 305, Tempo), Yonex (EZONE 105, VCORE 98 Tour) et Wilson (Clash 100 Pro V3, Burn 100LS V6, Pro Staff 97 V14) ne publient aucun RA sur les pages ouvertes. Seul Babolat en publie un, **non cordé et à ± 3**. Les RA du dossier viennent de Tennis Warehouse ou de TWU (cordée).
- **RA du Tempo 285** (et de la génération Tempo Tour 2026) : ni Tecnifibre ni Tennis Warehouse US (qui ne référence pas le Tempo). La valeur 65 de la base n'a retrouvé aucune source.
- **Tout L0 Head** (Extreme MP, Speed MP, Instinct MP) : `head.com` a refusé le robot. Les RA Head du dossier sont L1 (TWU) et L2 (Tennis Warehouse US) ; leur génération est datée par la presse (L3). Le poids non cordé des Head n'est publié sur aucune page ouverte (seul le poids cordé l'est).
- **Dates de sortie** : Burn 100LS V6 (aucune page ouverte ne la donne ; un moteur cite un revendeur suisse, page non ouverte), Instinct MP 2025, édition Roland-Garros 2026 de la Pro Staff 97, Tempo Tour 2026, US Open Jr actuels.
- **Équivalences de génération non écrites** : TF40 « V3 » = « 2024 » ; Tempo « 285 V2 » = « 285 2024 » ; « Extreme MP » de la base = 2022, 2024 ou 2026. Les pages donnent des intitulés différents pour des cadres de mêmes caractéristiques ; aucune ne dit l'équivalence.
- **Coloris « Pink »** de la RPM Team et du TGV : aucune page ouverte ne donne un cordage rose. **Jauge 1.35 de la RPM Team** : absente de Babolat FR, de Babolat US et de Tennis Warehouse US (elle peut exister sur un marché non lu).
- **Unité de l'« équilibre »** des pages Wilson DE (« Balance unbespannt 30.5 ») : non écrite sur la page ; centimètres probables, non affirmé.

### Divergences avec la base (pour `tsa-core`)

Lignes dont le statut est *divergent* ou *signal*, reprises du dossier ci-dessus (les valeurs externes ne sont pas « la bonne valeur » : elles sont consignées).

| Produit | Champ | Base | Source externe (niveau · fait) | Valeur externe | Statut |
|---|---|---|---|---|---|
| Yonex EZONE 105 | Plan de cordage officiel | 16x18 | L0 · V01 | 16 x 19 | divergent |
| Yonex EZONE 105 | RA (cordée) | 64 | L2 · V04 | 66 | signal |
| Wilson Clash 100 Pro (fiche « v2 ») | Tamis et plan de cordage | 100 in² ; 16x19 | L0 · V06 | 100 in² ; 16 x 20 (Clash 100 Pro V3) | divergent |
| Wilson Clash 100 Pro (fiche « v2 ») | Poids non cordé | 310 g | L0 · V07 | 305 g (320 g cordée) | divergent |
| Wilson Clash 100 Pro (fiche « v2 ») | RA (mesure de laboratoire) | 55 | L1 · V09 | 57 | divergent |
| Wilson Clash 100 Pro (fiche « v2 ») | RA (fiche produit TW US) | 55 | L2 · V10 | 57 | divergent |
| Wilson Clash 100 Pro (fiche « v2 ») | Génération en vente et date de sortie | fiche « v2 » | L3 · V11 | V3, lancée le 15/01/2025 | divergent |
| Wilson Clash 100 Pro (fiche « v2 ») | Signal : le 16x20 serait déjà celui de la v2 | 16x19 | L3 · V14 | un testeur TWU attribue à la seconde version le plan 16x20 que la V3 conserve (extrait ci-contre) : la fiche « v2 » à 16x19 pourrait être inexacte même pour la v2 | signal |
| Babolat Pure Aero Team | RA déclaré par Babolat (raquette « non cordée ») | RA 67 ; 16x19 | L0 · V16 | 70 ± 3 — plan 16x19 conforme à la base | divergent |
| Babolat Pure Aero Team | RA Pure Aero Team 2026 (cordée) | 67 | L2 · V20 | 66 | signal |
| Babolat Pure Aero Team | Génération en vente | fiche sans millésime (RA = 2023) | L3 · V21 | Gen9 = « 2026 » | divergent |
| Tecnifibre T-Fight 315S | Plan, tamis et poids non cordé | 18x19 ; 98 in² ; 315 g | L0 · V24 | 16x19 ; 98 in² (630 cm²) ; 315 g | divergent |
| Tecnifibre T-Fight 315S | RA (mesure de laboratoire) | 64 | L1 · V25 | 65 | divergent |
| Tecnifibre T-Fight 315S | RA (fiche produit TW US) | 64 | L2 · V26 | 65 | divergent |
| Yonex VCORE 98 Tour | Plan de cordage | 18x20 | L0 · V29 | 16 x 19 | divergent |
| Yonex VCORE 98 Tour | RA (cordée) | 63 | L2 · V32 | 64 | signal |
| Tecnifibre TF40 305 (V3) | Génération : V3 en vente, rapprochement avec « 2024 » | fiche sans génération | L3 · V35 | nouvelle ligne TF40 sortie en août 2024 ; l'équivalence nominale V3 = 2024 n'est écrite telle quelle sur aucune page ouverte | signal |
| Tecnifibre TF40 305 (V3) | RA (cordée) | 63 | L2 · V36 | 64 | signal |
| Tecnifibre TF40 305 (V3) | Génération antérieure (TF40 v1 305 16x19, toujours listée par TW US) | 63 | L2 · V37 | mêmes valeurs que la 2024 : 98 in², 16x19, 320 g cordée, RA 64 — les deux générations sont indiscernables par leurs caractéristiques | signal |
| Head Extreme MP | RA Extreme MP 2024 (mesure de laboratoire) | 65 | L1 · V40 | 66 | divergent |
| Head Extreme MP | RA Extreme MP 2024 (fiche TW US) | 65 | L2 · V41 | 66 | divergent |
| Head Extreme MP | RA Extreme MP (modèle courant TW US, code HREM26) | 65 | L2 · V42 | 67 | signal |
| Head Extreme MP | RA Graphene 360+ Extreme MP (génération 2022) | 65 | L2 · V43 | 66 | signal |
| Head Speed MP | RA Speed MP 2024 (mesure de laboratoire) | 61 | L1 · V46 | 60 | divergent |
| Head Speed MP | RA Speed MP 2026 (fiche TW US) | 61 | L2 · V47 | 60 | signal |
| Head Instinct MP | RA Instinct MP 2025 (mesure de laboratoire) | 65 | L1 · V50 | 64 | divergent |
| Head Instinct MP | RA Instinct MP 2025 (TW US, version démo) | 65 | L2 · V51 | 64 | divergent |
| Head Instinct MP | Présence chez Tennis Warehouse US | — | L2 · V52 | la catégorie Head de TW US (lue en direct) ne liste que les Instinct juniors ; l'Instinct MP adulte n'apparaît que sous forme de page « Demo » | signal |
| Tecnifibre Tempo 285 (V2) | Génération en vente : Tempo Tour 285 g (2026) | 100 in² | L0 · V57 | 102 in² (660 cm²) ; 285 g ; 16x19 ; longueur 68,5 cm | divergent |
| Tecnifibre Tempo 285 (V2) | Génération : 2026 face à « Tempo 285 2024 » | fiche sans génération | L0 · V58 | la page Tempo Tour compare le produit 2026 au « Tempo 285 2024 » ; l'équivalence V2 = 2024 n'est pas écrite | signal |
| Wilson Pro Staff 97 v14 | Incohérence Wilson sur le tamis du modèle standard | 97 in² | L0 · V69 | 98 in² (632 cm²) sur la page du modèle standard, 97 in² sur l'édition RG | signal |
| Wilson US Open Junior 21 | Tamis, longueur, plan (officiel) | 85 in² ; 16x17 | L0 · V73 | 95 in² ; 21 in ; 16 x 18 | divergent |
| Wilson US Open Junior 21 | Poids cordé et équilibre cordé | 185 g (≈ cordée) ; 285 mm | L0 · V74 | 186 g ; 26,8 cm | divergent |
| Wilson US Open Junior 21 | Poids non cordé et équilibre non cordé | 185 g ; 285 mm | L0 · V75 | 171 g ; 25,8 cm | divergent |
| Wilson US Open Junior 23 | Tamis, longueur, plan (officiel) | 90 in² ; 16x18 | L0 · V78 | 95 in² ; 23 in ; 16 x 19 | divergent |
| Wilson US Open Junior 23 | Poids cordé et équilibre cordé | 205 g ; 295 mm | L0 · V79 | 200 g ; 28,5 cm | divergent |
| Wilson US Open Junior 23 | Poids non cordé et équilibre non cordé | 205 g ; 295 mm | L0 · V80 | 185 g ; 28 cm | divergent |
| Wilson US Open Junior 25 | Tamis, longueur, plan (officiel) | 98 in² ; 16x18 | L0 · V81 | 106 in² ; 25 in ; 16 x 19 | divergent |
| Wilson US Open Junior 25 | Poids cordé et équilibre cordé | 225 g ; 310 mm | L0 · V82 | 220 g ; 31 cm | divergent |
| Wilson US Open Junior 25 | Poids non cordé et équilibre non cordé | 225 g ; 310 mm | L0 · V83 | 205 g ; 30 cm | divergent |
| Wilson Blade Junior 25 (Blade Feel) | Tamis et plan (Blade Feel Comp Jr 25) | 98 in² ; 16x19 | L0 · V84 | 100 in² (645 cm²) ; 16 x 19 | divergent |
| Wilson Blade Junior 25 (Blade Feel) | Poids cordé / non cordé et équilibre | 240 g ; 320 mm | L0 · V85 | 258 g cordée ; 243 g non cordée ; équilibre non cordé 30,5 (unité non écrite sur la page) | divergent |
| Babolat RPM Team | Rigidité mesurée (1.30) | 225 lb/in | L1 · V88 | 280,6 lb/in | divergent |
| Babolat RPM Team | Rigidité mesurée (1.25) | 225 lb/in | L1 · V89 | 245,2 lb/in | divergent |
| Babolat RPM Team | Jauges proposées | 1.25 / 1.30 / 1.35 | L0 · V90 | 1.25 et 1.30 seulement (1.35 absente) | divergent |
| Babolat RPM Team | Coloris officiel | Pink | L0 · V91 | Noir | divergent |
| Tecnifibre TGV | Rigidité mesurée (1.30) | 145 lb/in | L1 · V94 | 157,2 lb/in | divergent |
| Tecnifibre TGV | Rigidité mesurée (1.25) | 145 lb/in | L1 · V95 | 165,2 lb/in | divergent |
| Tecnifibre TGV | Coloris officiel (noir) | Pink | L0 · V96 | Noir ; jauges 1.25 / 1.30 / 1.35 | divergent |
| Tecnifibre TGV | Coloris officiel (naturel) | Pink | L0 · V98 | Naturel ; jauges 1.25 à 1.40 | divergent |
| Tecnifibre Multifeel | Rigidité mesurée (16 Black, 1.30) | 160 lb/in | L1 · V100 | 148,6 lb/in | divergent |
| Tecnifibre Multifeel | Rigidité mesurée (Multi-Feel 17, 1.25) | 160 lb/in | L1 · V101 | 150,3 lb/in | divergent |
| Tecnifibre Multifeel | Jauges (noir) | 1.30 seule | L0 · V102 | 1.25 et 1.30 | divergent |
| Tecnifibre Multifeel | Jauges (naturel) | 1.30 seule | L0 · V103 | 1.25, 1.30 et 1.35 | divergent |
| Yonex Poly Tour Strike | Rigidité mesurée (16L, 1.25) | 215 lb/in | L1 · V106 | 199,5 lb/in | divergent |
| Yonex Poly Tour Strike | Page www.yonex.com du produit | — | L0 · V112 | page produit vide ; produit absent de la liste « Polyester » du site | signal |
| Fiches voisines non listées par la mission (signaux) | `wilson-clash-100-v2` : RA de la v3 en vente | 57 (fiche « v2 ») | L1 · V114 | 54 (fiche produit et mesure TWU) | signal |
| Fiches voisines non listées par la mission (signaux) | `wilson-clash-100-v2` (fiche produit TW US) | 57 | L2 · V115 | 54 | signal |
| Fiches voisines non listées par la mission (signaux) | `wilson-clash-100l-v3` : RA | 57 ; 295 g | L2 · V116 | 54 ; la base porte 295 g, qui est le poids cordé de la fiche TW US | signal |

### Points glissants repérés

- **« Non fabriqué » (Poly Tour Strike 1.30)** : Yonex USA vend un POLYTOUR STRIKE 130 (PTGST130), épuisé au 10/10/2026. Le site `www.yonex.com`, lui, ne liste plus le Strike dans sa catégorie Polyester et sa page produit est vide, et Tennis Warehouse US ne le vend plus : cela peut expliquer une lecture « 1.20/1.25 » (hypothèse du pigiste, non vérifiée). Écrire « non fabriqué » serait faux ; « épuisé chez Yonex USA, au 10/10/2026 » est exact et daté.
- **RA Babolat 70 ± 3 et RA Tennis Warehouse 66** : la page Babolat vend la raquette « non cordée », et TennisNerd écrit « 66 strung, 69 unstrung » pour la Pure Aero 2026. Les deux valeurs sont justes, de natures différentes. La base suit la valeur cordée pour la Pure Aero standard.
- **Pages Wilson incohérentes avec elles-mêmes** : la page DE du Pro Staff 97 V14 standard donne 98 in² (632 cm²) alors que l'édition Roland-Garros donne 97 in² (626 cm²) ; la page « Slam Jr 21 » affiche 95 in² dans le tableau et « 92 Quadratzoll (594 cm²) » dans le texte. Ne pas corriger la base d'après ces seuls chiffres.
- **Deux noms pour des caractéristiques identiques** : « US Open Jr 21/23/25 » (États-Unis, Australie) et « Slam Jr 21/23/25 » (boutique allemande) publient les mêmes tamis, plans et poids cordés ; Wilson n'écrit pas qu'il s'agit du même cadre.
- **Poids junior** : la base annonce 185/205/225 g, proche du poids **cordé** officiel (186/200/220) ; les adultes sont en poids **non cordé**. Convention à trancher avant toute correction.
- **La fiche « Clash 100 Pro v2 » est peut-être fausse même pour la v2** : un testeur TWU attribue à la seconde version le plan 16x20 que la V3 conserve (V14). À vérifier avant de la présenter comme « la v2 ».
- **Fiches voisines** : `wilson-clash-100-v2` (RA 57, la v3 en vente est à 54) et `wilson-clash-100l-v3` (RA 57 et 295 g, alors que Tennis Warehouse donne 54 et 295 g **cordée**) paraissent désynchronisées à leur tour (section D). Une passe dédiée est proposée au §3.
- **Disponibilités et prix** (Wilson DE, Tecnifibre Outlet, Yonex USA) sont des relevés du 10/10/2026 : à dater si un article les reprend (charte F11).

---

## 3. Liste pour `tsa-core` — champs à modifier, classés par effet décroissant sur l'indice RCS

**Effet RCS** : calcul avec la fonction `calculateRCS` du dépôt (`src/data/strings-database.ts`, lecture seule) sur **179 cordages × 6 tensions (20 à 30 kg)**, soit 1 074 montages ; moyenne du changement d'indice, et nombre de montages dont l'indice franchit **32** ou **35** (seuils d'alerte de la charte F7). Le facteur est constant : **+0,34 point d'indice par point de RA** et **+0,11 point par lb/in de rigidité de cordage**. Les sous-scores avancés qui lisent le poids ou le tamis ne sont pas recalculés.

| Priorité | Fiche | Champs à modifier (si l'option est retenue) | Valeur proposée | Effet RCS moyen · montages franchissant 32 / 35 | Preuve | Option neutre alternative |
|---|---|---|---|---|---|---|
| 1 | `babolat-rpm-team` | rigidité (lb/in) | 245,2 (1.25) ou 280,6 (1.30) | +2,2 à +6,1 ; la base **sous-estime** la fermeté | L1 | laisser jusqu'à la décision de jauge de référence du chantier C2 |
| 2 | `tecnifibre-tgv` | rigidité (lb/in) | 157,2 (1.30) ou 165,2 (1.25) | +1,3 à +2,2 | L1 | rigidité → C2 |
| 3 | `yonex-poly-tour-strike` | rigidité (lb/in) | 199,5 (1.25) | −1,7 | L1 | rigidité → C2 (rien d'autre : les 3 jauges existent) |
| 4 | `tecnifibre-multifeel` | rigidité (lb/in) | 148,6 à 154,9 (1.30) ; 150,3 (1.25) | −0,6 à −1,2 | L1 | rigidité → C2 |
| 5 | `yonex-ezone-105` | plan ; RA | 16x19 ; 66 | +0,72 · 59 / 32 | L0 (plan) ; L2 unique (RA) | corriger le plan seul, RA inchangé |
| 6 | `wilson-clash-100-pro-v2` | plan ; poids ; RA ; nom | 16x20 ; 305 g ; 57 ; « 100 Pro v3 » (id conservé) | +0,72 · 37 / 6 | L0 ; L1 ; L3 ×2 | laisser et marquer « v2 » (génération qui n'est plus en vente) |
| 7 | `head-extreme-standard` | RA (et génération) | 66 (2024, L1) ou 67 (2026, L2) | +0,35 (66) · 27 / 17 ; +0,69 (67) · 55 / 40 | L1 ; L2 ; L3 | laisser (écart ≤ 2, Head L0 inaccessible) |
| 8 | `tecnifibre-tfight-315s` | plan ; RA | 16x19 ; 65 | +0,37 · 32 / 15 | L0 ; L1 ; L2 | — |
| 9 | `head-instinct-mp` | RA | 64 | −0,37 · 32 / 15 | L1 ; L2 | laisser (écart 1) |
| 10 | `babolat-pure-aero-team` | génération ; RA | Gen9/2026 : RA 66 (cordée, TW US) ; poids, tamis, plan inchangés | −0,34 · 28 / 23 ; (+1,01 · 91 / 67 si 70 non cordée : **à ne pas saisir**) | L0 ; L2 ; L3 | laisser la génération 2023 (RA 67) en la nommant |
| 11 | `head-speed-mp` | RA | 60 | −0,35 · 26 / 13 | L1 ; L2 | laisser (écart 1) |
| 12 | `yonex-vcore-98-tour` | plan ; RA | 16x19 ; 64 | +0,29 · 22 / 15 | L0 ; L3 ; L2 unique | corriger le plan seul |
| 13 | `tecnifibre-tf40-305` | RA ; nom | 64 ; « 305 16M V3 » | +0,29 · 22 / 15 | L2 unique | laisser (RA non publiée par Tecnifibre) |
| 14 | `tecnifibre-tempo-285` | identité : V2 (100 in², Outlet) ou Tempo Tour 2026 (102 in², 68,5 cm) ; RA | RA sans source | inconnu | L0 | laisser la fiche comme « 285 V2 » |
| 15 | `wilson-us-open-junior-21`, `-23`, `-25` | tamis ; plan ; poids ; équilibre | 95 / 95 / 106 in² ; 16x18 / 16x19 / 16x19 ; 171·185·205 g non cordée (186·200·220 cordée) ; équilibre non cordé 258·280·300 mm | nul (RA absent) | L0 ; L2 (21 : tamis) | — |
| 16 | `wilson-blade-junior-25` | tamis ; nom | 100 in² ; « Blade Feel Comp Jr 25 » | nul | L0 | poids 240 → 243 facultatif (dans les ±5 g) |
| 17 | `wilson-burn-100ls-v5` | nom | « 100LS v6 », id conservé | 0 | L0 ; L2 | laisser |
| 18 | `wilson-pro-staff-97-v14` | nom | mention de l'édition RG 2026 (facultatif) | 0 | L0 ; L2 | laisser |
| 19 | fiches voisines `wilson-clash-100-v2`, `wilson-clash-100l-v3` | RA (et poids de la 100L v3) | 54 ; 54 | −1,0 par fiche (RA 57 → 54), si retenu | L1 ; L2 | passe de veille dédiée aux Clash |
| 20 | **Écarts de coloris et de jauges (classés en bas)** : `babolat-rpm-team`, `tecnifibre-tgv`, `tecnifibre-multifeel` | coloris ; jauges | RPM Team : Black, jauge 1.35 introuvable ; TGV : Black / Natural (aucun « Pink » trouvé) ; Multifeel : ajouter 1.25 (et 1.35 en naturel), Natural | nul (seule la rigidité entre dans le RCS) | L0 (×2 pour RPM Team) ; L2 | à corriger si l'on veut lever la quarantaine photo : l'appariement des photos officielles compare le coloris et les jauges (ces trois cordages y sont retenus pour cette raison) |

Remarques de méthode pour `tsa-core` :

- **Source du RA** : le 09/10, la règle retenue était Tennis Warehouse Europe. Pour six fiches de cette liste, le seul L2 ouvert est Tennis Warehouse US (même groupe) : si la règle du 09/10 s'applique, les RA « signal » peuvent être repris ; sinon ils restent des signaux. Le pigiste ne tranche pas.
- **Jauge de référence des cordages** : TWU mesure chaque jauge séparément (RPM Team : 245,2 en 1.25, 280,6 en 1.30) ; la base porte une rigidité par fiche. Décision de produit non tranchée (C2).
- **Convention de poids** (juniors) et **identité d'une fiche** (Tempo 285 : V2 ou Tempo Tour) : arbitrages de fond, à porter à Pierre si `tsa-core` ne les tranche pas.
- **Noms et ids** : le précédent du 09/10 (mise à jour en place, ids conservés pour les URL publiques et les configurations sauvegardées) vaut pour toutes les propositions de renommage.

### Questions ouvertes

- **Q-1** · de `tsa-pigiste` à `tsa-core` · 2026-10-10 — La source de RA retenue le 09/10 (Tennis Warehouse Europe) est-elle étendue à Tennis Warehouse US pour les six fiches « signal » (EZONE 105, VCORE 98 Tour, TF40 305, Pure Aero Team 2026, Extreme MP 2026, Speed MP 2026) ? Sans réponse, elles restent des signaux.
- **Q-2** · à `tsa-core` — Pure Aero Team : la fiche décrit-elle la génération 2023 (RA 67, plus en vente chez Babolat) ou la Gen9/2026 (RA 66 cordée) ? Le RA déclaré par Babolat (70 ± 3, raquette non cordée) n'est pas une valeur à saisir dans une base de RA cordée.
- **Q-3** · à `tsa-core` — Tempo 285 : la fiche reste-t-elle la V2 (100 in², aujourd'hui en Outlet) ou passe-t-elle au Tempo Tour 285 g 2026 (102 in², RA introuvable) ?
- **Q-4** · à `tsa-core` — Poids des raquettes junior : non cordé (comme les adultes) ou cordé (comme la base paraît le faire) ?
- **Q-5** · à `tsa-core` (puis Pierre si besoin) — Jauge de référence de la rigidité des cordages (chantier C2) : préalable à toute correction de RPM Team, TGV, Multifeel et Poly Tour Strike.

---

## 4. Sujets d'article possibles — pour `tsa-acquisition`

`tsa-acquisition` juge s'ils correspondent à une recherche réelle et mesure le recouvrement avec les 19 articles FR existants (non vérifié ici). Evergreen d'abord (charte §1) ; l'actualité reste l'exception et doit dire pourquoi.

| # | Sujet | Type | Durée de vie attendue | Faits du dossier | Réserves (charte) |
|---|---|---|---|---|---|
| 1 | Lire le RA d'une fiche raquette : cordée ou non cordée, déclaré ou mesuré | evergreen | des années (la confusion persiste tant que les marques publient des RA différents) | RA Pure Aero : V16, V17, V18 ; mesure TWU : V09 | F2 (natures) ; pas d'allégation de santé sans source médicale (F7) : le lien avec le bras passe par l'indice RCS publié |
| 2 | Reconnaître la génération d'une raquette (année, RA, poids, plan) quand deux générations se ressemblent | evergreen | des années | TF40 v1 / 2024 : V37 ; Speed MP 2024 / 2026 : V46, V47 ; Extreme MP : V40, V41, V42, V43 | Head sans L0 : n'écrire que ce que TWU et TW US établissent ; équivalences V3 = 2024 non écrites (signal) |
| 3 | Raquettes junior : de 19 à 26 pouces, tamis, poids et plan par taille | evergreen | plusieurs années (gamme stable), à dater | US Open Jr : V73, V78, V81 ; Blade Feel Comp Jr 25 : V84 | poids cordé / non cordé à distinguer ; âges seulement s'ils sont écrits par le constructeur ; pas de RA pour les juniors |
| 4 | Choisir sa jauge : 1.25 ou 1.30, ce que mesure la rigidité du cordage | evergreen | des années | RPM Team : V88, V89 ; TGV : V94, V95 ; Multifeel : V100, V101 | conditions TWU (51 lb, vitesse Fast) à écrire ; jauge de référence non tranchée (C2) : attendre la décision de `tsa-core` avant de citer une rigidité de fiche |
| 5 | Plan de cordage 16x19, 16x20, 18x19 : lire la fiche avant d'interpréter | evergreen (partie descriptive) | des années | Clash 100 Pro V3 : V06 ; T-Fight 305S / 315S : V24, V28 | l'effet d'un plan sur le jeu est une règle répétée sans source primaire (F3) : à chercher avant d'écrire autre chose que la description |
| 6 | Babolat Pure Aero Gen9 (2026) : ce qui change par rapport à la 2023 | actualité (exception) | quelques mois à deux ans ; à rattacher au sujet 1 pour durer | V20, V21, V22, V23 | justification de l'exception : forte intention de recherche probable sur la génération en vente (à mesurer par `tsa-acquisition`) ; date de mise à jour planifiée requise si l'année est dans le titre |
| 7 | Wilson Clash V3 face à la V2 : RA, plan 16x20, 305 g | actualité (exception) | deux ans environ | V06, V07, V08, V09, V11, V12 | les données de la V2 elles-mêmes sont un signal (plan peut-être déjà 16x20) : les établir avant |
| 8 | Raquette en fin de série ou en solde : que perd-on en choisissant la génération précédente ? (Tempo 285 V2 → Tempo Tour 2026, Extreme MP 2024 soldée) | actualité (exception) | quelques mois | V55, V56, V57, V58 ; V45 | prix et soldes : datés et jamais présentés comme durables (F11) ; aucun lien d'affiliation sans `tsa-revenue` (F8) |

---

## 5. Journal

- 2026-10-10 · `tsa-pigiste` — veille livrée : 116 faits sur 20 fiches de la mission et 2 fiches voisines. Aucun fichier de `src/`, `public/`, `docs/arbitrages/` ni `exports/` touché. RELAIS → `tsa-core` : §3 (champs à modifier, effet RCS) ; RELAIS → `tsa-acquisition` : §4.
