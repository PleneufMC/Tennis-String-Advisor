# Même tension demandée, tamis différent : comment comparer deux montages de cordage

| Champ | Valeur |
|---|---|
| Slug FR / EN | `comparer-deux-montages-cordage-tension` / `compare-two-string-setups-same-tension` (libres tous les deux, vérifié dans `public/blog/` et `public/en/blog/`) |
| Circuit | complet (nouvel article FR + EN) |
| Branche | `agent/redaction/comparer-deux-montages-cordage-tension`, partie de `main` @ `fe59141` ; poussée le 13/11/2026 ; PR #159 vers `main` (https://github.com/PleneufMC/Tennis-String-Advisor/pull/159), **non fusionnée** |
| Ouvert le | 2026-11-13 |
| Demande d'origine | Ligne 2 de « TSA · Idées d'articles » (ID `2026-W46-1`, score 3,84, proposée le 13/11/2026 à 08:05) ; Pierre, 13/11/2026 18:26 : « merci de faire un article sur le sujet ligne 2 » |
| Statut | rédigé, FR et EN (phase 2, 13/11/2026, sur demande de Pierre à 19:29) · contrôles passés · **PR #159 ouverte, non fusionnée : en attente du GO de Pierre** (charte §6) |
| Mise à jour planifiée | sans objet (ni année dans le titre, ni dans le slug) |

> Règles : `docs/redaction/CHARTE.md` (v1.2) et Agent Rédacteur v2.0. Régime de preuve **A** : chaque valeur vient d'une page ouverte le 2026-11-13, ou de la base (`src/data/`, `src/lib/`) lue au commit `fe59141`.
> Fiabilité (Agent Rédacteur v2.0) : **1** mesure instrumentée publiée avec sa méthode · **2** test structuré, conditions décrites mais incomplètes, ou documentation d'un fabricant sur son propre appareil · **3** signal (presse sans protocole, revendeur, cordeur, forum).
> **◊** : valeur lue dans le compte rendu de l'outil de récupération, sans recoupement par un extrait brut de la page. À relire sur la page avant publication (phase 2).
> **Relecture de phase 2 (13/11/2026)** : les valeurs ◊ de F14, F16, F23 et F25 ont été relues sur la page (mention « relu » dans la ligne). Celles de F2 et F28 ne l'ont pas été : elles ne sont pas dans l'article.

---

## 1. Brief (repris de la ligne du comité ; brief SEO complet à faire par `tsa-acquisition`)

- **Question** : pourquoi deux raquettes cordées à la même tension n'offrent-elles pas la même fermeté, et comment comparer deux montages sans se tromper ?
- **Mot-clé principal proposé** : « tension de cordage et taille de tamis ». Secondaires : « mesurer la tension de son cordage », « même tension, raquette différente », « raideur du tamis ». Volumes : NON DOCUMENTÉ (Search Console et GA4 en échec sur la ligne du comité). Le comité donne « tension cordage tennis » : c'est la requête du guide, elle n'est pas reprise ici.
- **Angle** : la tension demandée ne se compare pas d'un montage à l'autre. Ce qui se compare, c'est la fermeté du tamis : mesurée avec le même instrument au même délai, ou estimée par l'indice RCS, dans ses limites.
- **Durée de vie** : plusieurs années (mécanique du tamis, différence entre consigne, mesure et fermeté). À revérifier : les exemples de la base et la formule de l'indice.
- **Garde-fous de la ligne** : ne pas refaire l'écart demandé/réel du guide, y renvoyer ; garder la cinétique TWU telle que publiée ; distinguer consigne, mesure après pose, mesure après jeu ; ne comparer que des montages mesurés selon le même protocole ; « +4 lb » = usage sans source primaire ; confort par l'indice et le palier, aucun effet sur la santé ; pros : deux sources indépendantes ou rien ; forums = signaux.

### Cannibalisation (pages relues au commit `fe59141`)

| Article existant | Ce qu'il couvre déjà | Décision |
|---|---|---|
| `guide-tension-cordage-tennis` (révisé le 12/11/2026) | Consigne ≠ tension du tamis (tableau « quatre mesures, quatre protocoles ») ; perte par famille ; montants/travers et « +4 lb » ; tableau d'indices par cordage ; FAQ « Pourquoi deux raquettes cordées à la même tension n'ont-elles pas le même toucher ? », qui répond par le cordeur, la machine, la méthode et le délai | **Différencier et lier.** Le satellite prend ce que le guide ne traite pas : tamis et plan, instruments, protocole de comparaison, limites de l'indice entre deux cadres, perception. La FAQ du guide gagnerait un lien vers le satellite (circuit court, FR et EN) |
| `plan-de-cordage-tennis` | Densité du plan ; écrit déjà que « le plan de cordage n'entre pas dans l'indice » | Lier |
| `jauge-cordage-tennis` | Jauge | Lier |
| `combien-de-temps-dure-un-cordage` | Perte de tension cordage par cordage (base TWU) | Lier, ne rien dupliquer |

- **Paire signalée par la ligne** : `tennis-strings-for-clay-courts` (drapeau `paires_a_mettre_a_jour`). Hors périmètre de ce dossier ; à instruire par `tsa-acquisition`.
- **Feuille du comité** : la ligne reste marquée « En attente de ta réponse sur Telegram ». Non modifiée.

---

## 2. Dossier de faits

### Synthèse : réponses aux cinq questions du pigiste

**Q1. Quelle source primaire justifie ou réfute le « +4 lb aux travers » en deux pièces ?** Toujours aucune : **introuvable**, comme le 12/11. L'origine rouverte est un message de forum de 2011 qui présente une « méthode JC » sans mesure, et liste aussi l'usage inverse (F31). La recherche du jour n'a trouvé aucune prescription d'un fabricant de raquettes de tennis. → Une phrase et un renvoi vers le §3 du guide, rien de plus.

**Q2. Quelles mesures publiées montrent l'écart entre tension demandée et fermeté mesurée selon le plan de cordage ?** Aucune mesure n'isole le plan, ni la taille du tamis : **introuvable**. Ce qui existe :
- **Mesuré, à cadre et consigne constants** : le cordage change la raideur du tamis. Protocole USRSA (même cadre, 60 lb, machine à tirage constant, appareil RDC) : 69 unités avec un monofilament « poly », 78 avec le nylon témoin, 80 avec un multifilament, soit 16 % d'écart entre les extrêmes (F6).
- **Mesuré, à cadre, cordage et consigne constants** : la méthode de pose change le résultat (20,0 à 24,3 kg relevés pour 24 kg demandés ; instruments non nommés) (F16).
- **Établi comme mécanisme, sans mesure isolée** : cordes plus longues et mailles plus larges donnent un tamis plus souple à tension égale. Sources : TWU (qualitatif, F7), Cross et Bower (une mesure par déflexion dépend de la longueur et du nombre des cordes, F9), formule de fréquence de Cross (F10, F11).
- **Dit par des praticiens, sans mesure** : cordeurs (F14, F15) et fabricant d'instrument (F12).
- **Fédération** : le document ITF « Strings » (novembre 2019) énonce ce mécanisme et chiffre l'effet de la tension sur la vitesse, d'après les extraits de moteur. Le PDF n'a pas pu être ouvert, le 12/11 comme le 13/11 : **NON DOCUMENTÉ** (F8).

→ L'article peut écrire le sens de l'effet et son mécanisme. Il ne peut écrire **aucune règle chiffrée** du type « x kg par pouce carré » (charte F3).

**Q3. Comment l'indice RCS est-il mesuré, et permet-il de comparer deux montages sur des cadres différents ?** Il n'est pas mesuré, il est **calculé** à partir de trois entrées : le RA du cadre, la rigidité de la fiche du cordage et la tension (F33). Entre deux cadres, il ne voit que l'écart de RA. Le tamis, le plan, la jauge, la machine et le délai n'y entrent pas : deux raquettes de même RA ont le même indice avec le même cordage à la même tension, quels que soient leur tamis et leur plan (F34). Il compare donc bien deux cordages ou deux tensions sur un même cadre (F35), et l'effet du RA (F36). Il ne répond pas à la question « même tension, tamis différent ». → À écrire tel quel : c'est la limite honnête de l'outil, et l'article sur le plan de cordage le dit déjà.

**Q4. Existe-t-il une mesure (L1) reliant une variation de tension à une différence perçue ?** Oui, trois études publiées de Bower et Cross, lues sur leurs résumés :
- 41 joueurs récréatifs avancés : 27 % identifient correctement un écart de 5 kg ou moins ; 37 % ne détectent pas 10 kg (F25, relu en phase 2).
- 18 joueurs de niveau élite : 61 % ne détectent pas un écart de 75 N (7,6 kg) ; 11 % détectent 25 N (2,5 kg) (F26).
- Effet mesuré sur la balle, en jeu : 108,1 km/h à 180 N contre 105,3 km/h à 280 N, et un type de faute qui change (long à tension basse, filet à tension haute) (F27).

Limite à dire : ces protocoles utilisent des raquettes qui ne sont pas celles des joueurs (F30, signal de forum). L'article ne peut pas écrire « on ne sent pas la tension » ; il peut écrire que la sensation seule est un instrument peu fiable pour comparer deux montages.

**Q5. Les tensions d'Alcaraz et de Sinner sont-elles confirmées par deux sources indépendantes ?** Non, inchangé depuis le 12/11. Les deux pages ouvertes aujourd'hui ne citent ni cordeur ni service de cordage (F37, F38) ; Sinner y est à 29 kg, ou « 28 à 29 kg ». → Aucun chiffre de joueur dans l'article. Une question de FAQ peut expliquer pourquoi la tension d'un pro ne se transpose pas (cadre pro stock, tamis, plan, cordage), avec renvoi au guide.

### Faits

| # | Énoncé | Valeur | Niveau | Fiab. | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 15 mots, un par source) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|---|
| **A** | **Consigne, pose, délai (rappel : le détail est dans le guide)** | | | | | | | | | |
| F1 | Cinq raquettes identiques (Völkl Pro Comp, 16 × 19, nylon 1,42 mm, tamis de 630 cm²) : tirage 18,0 / 21,0 / 23,0 / 25,2 / 28,4 kg → tension calculée après pose 12,1 / 14,4 / 15,2 / 17,1 / 19,8 kg (fréquences 504 à 645 Hz) | ≈ −30 % (−5,9 à −8,6 kg) | MÉD (Cross et Bower, *Sports Engineering* 4, 2001, p. 165-175) | 1 | https://www.physics.usyd.edu.au/~cross/CrossBower.pdf | 2026-11-13 | voir F9 | dossier du guide, F1 et F3 (mêmes valeurs le 12/11) | — | confirmé ; **déjà dans le guide : y renvoyer** |
| F2 | Causes de la perte pendant la pose, selon la même étude : relaxation de la corde, déformation du cadre (jusqu'à 30 mm de largeur sur une machine à deux points d'appui), frottement entre cordes, angle de tirage et frottement dans les œillets | dernier facteur : 1 à 2 kg (≈ 7 %) ; une interruption de pose peut changer la tension de 1 kg ou plus ◊ | MÉD | 1 | idem F1 | 2026-11-13 | — | F16 | — | confirmé |
| F3 | Banc TWU, corde seule tendue à 62 lb (28,1 kg) : perte dans la première minute puis sur les premières frappes ; le boyau n'est pas dans le panel testé | jusqu'à 15 lb en 1 min ; jusqu'à 20 lb en 20 frappes | L1 (TWU, C. Lindsey, 21/03/2013) | 1 | https://twu.tennis-warehouse.com/learning_center/deadstrings.php | 2026-11-13 | « Polyester loses more than nylon which loses more than gut. » | dossier du guide, F10 | — | confirmé ; **cinétique à garder telle que publiée, par renvoi au guide** |
| F4 | Même cadre, sans jouer, 24 h après la pose : la raideur du tamis baisse | 69 → 65 unités RDC (−6 %) ; 80 → 73 (−9 %) ; témoin 78 → 71 (−9 %) | L3 (essai USRSA reproduit par Tennis Warehouse) | 2 | voir F6 | 2026-11-13 | voir F6 | F5 | — | confirmé |
| F5 | Notice de l'ERT 300 : dans les 2 à 4 heures après la pose, perte fréquente dite « de stabilisation » | 2 à 4 points de DT (kp/cm) | L0 (Beers Technic, notice diffusée sous la marque Gamma) | 2 | https://www.manualsdir.com/manuals/769757/gamma-ert-300.html?page=5 | 2026-11-13 | — | F4 (même sens, autre instrument) | — | confirmé (documentation du fabricant) |
| **B** | **À consigne égale, ce qui change la fermeté du tamis** | | | | | | | | | |
| F6 | **Le cordage.** Protocole USRSA : Wilson Pro Staff 6.1 95 (16 × 18), 60 lb (27,2 kg), machine à tirage constant, raideur du tamis relevée à l'appareil RDC juste après la pose | Tourna Poly Big Hitter 16 : 69 unités · Prince Synthetic Gut Original Gold 16 (témoin) : 78 · Head FiberGel Power 16 : 80. Écart 69 → 80 : +16 % (calcul TSA) | L3 (essais de cordage USRSA, reproduits par Tennis Warehouse) | 2 | https://tennis-warehouse.com/reviews/ubighit/ubighitreview.html ; https://www.tennis-warehouse.com/learning_center/string_reviews/HFGPWR16review.html | 2026-11-13 | « stringbed stiffness measured 65 RDC units, representing a 6% tension loss » | F7 (sens identique) | — | confirmé ; **essais non datés ; l'unité RDC est propre à l'appareil** ; d'autres essais de la série (72, 74, 82 unités) vus en extrait seulement, non ouverts |
| F7 | TWU : la rigidité d'une corde n'est pas la raideur du tamis. Celle-ci dépend des matériaux, des tensions (égales ou non), de la longueur des cordes (taille et forme du tamis), de leur nombre (plan) et de la tension perdue. Autre page : « éléments » de la raideur du tamis = matériau, tension, plan, tamis, jauge | qualitatif, aucun chiffre | L1 (TWU, C. Lindsey, non daté) | 1 | https://twu.tennis-warehouse.com/learning_center/stringstiffness.php ; https://twu.tennis-warehouse.com/learning_center/stringsandpower1.php | 2026-11-13 | « individual string stiffness is not the same as stringbed stiffness » | F9, F10 | le plan et le tamis n'entrent pas dans l'indice (F33) | confirmé (qualitatif) |
| F8 | ITF, « Strings » (novembre 2019) : espacement des cordes plus grand → face plus souple ; cordes plus longues (tamis agrandi) → raideur du tamis plus basse ; −25 % de tension ↔ +2 % de vitesse en coup de fond | — | fédération | — | https://www.itftennis.com/media/2175/rackets-and-strings-strings.pdf (redirigé vers `world.tennis`, hors liste autorisée) | 2026-11-13 (échec, comme le 12/11) | — | passage vu en extrait de moteur seulement | — | **NON DOCUMENTÉ** : PDF non ouvrable, un extrait de moteur n'est pas une source (charte F10) |
| F9 | Les appareils qui mesurent la raideur du plan de cordage par déflexion donnent une lecture qui dépend de la tension, mais aussi de la longueur de chaque corde, du nombre de cordes et du diamètre de l'objet qui appuie. Ils servent à suivre l'évolution d'une raquette donnée | qualitatif | MÉD | 1 | idem F1 | 2026-11-13 | « the measured displacement depends not only on the string tension » | F7, F12 | — | confirmé |
| F10 | Fréquence de vibration du tamis : f = √(T / (4·m·L)), avec L = √A (A : surface du tamis) et m : masse d'une corde de longueur L. Erreur d'environ 1 % pour un tamis ovale. Exemple : cordes de 33 et 25 cm → A = 648 cm², L = 25,4 cm. Courbes calculées pour 580, 680 et 780 cm², nylon et polyester en 1,25 et 1,30 mm. Fréquences usuelles : 500 à 700 Hz | 10 % de tension en moins ↔ 5 % de fréquence en moins (600 → 570 Hz) | MÉD (R. Cross, université de Sydney, note technique « Measuring String Tension », juillet 2006) | 1 | https://www.physics.usyd.edu.au/~cross/StringTension.pdf | 2026-11-13 | « a 10% drop in tension leads to a 5% drop in frequency » | F1 (même formule, équation 1 de l'étude de 2001) | — | confirmé (note technique non revue par des pairs, adossée à l'étude de 2001) |
| F11 | Conséquence de F10, **calculée par nous** : à tension et cordage égaux, la fréquence varie comme 1/√A | 98 contre 105 in² : +3,5 % sur le plus petit · 100 contre 107 in² : +3,4 % · 580 contre 780 cm² : +16 % | calcul TSA d'après F10 | 1 (formule) | idem F10 | calcul 2026-11-13 | — | sens identique à F7, F14, F15 | — | **dérivé** : à étiqueter « calcul d'après la formule de Cross ». Une fréquence n'est pas une raideur : ne pas en tirer d'équivalence en kilos |
| F12 | ERT 300 : le DT (« dynamic tension ») est la raideur du tamis, soit la force en kilopond qui enfonce le tamis de 1 cm en son centre ; mesure par fréquence de résonance, convertie. La notice dit prendre en compte « automatiquement » le type et la taille de la raquette, le plan et le cordage. Disque de conversion DT ↔ tension à trois classes de tamis | plage 20 à 65 kp/cm ; précision ± 1 kp/cm ; classes : 540-610 cm² (83-94 in²), 611-680 (95-105), 681-740 (106-115) ; exemple : 98 in², DT 38 ↔ 25 kp (55 lb) | L0 | 2 | https://www.manualsdir.com/manuals/769757/gamma-ert-300.html?page=4 ; `?page=5` | 2026-11-13 | « DT is the string bed stiffness » | F13 (facteurs), F9 | — | confirmé comme **allégation du fabricant** ; aucune validation indépendante trouvée. Une autre page de la notice, vue en extrait seulement, lie un DT bas à un risque pour le coude : allégation **à ne pas reprendre** (charte F7) |
| F13 | Facteurs qui font varier le DT, selon la presse spécialisée : consigne, précision et état de la machine, technique du cordeur, matériau et diamètre du cordage, taille du tamis, plan | qualitatif | L3 (Tennisnerd, J. Eriksson, 18/09/2023) | 3 | https://www.tennisnerd.net/?p=32054 | 2026-11-13 | — | F7, F12 | — | signal |
| F14 | Glossaire d'un revendeur : une raquette cordée à 60 lb peut mesurer 50 à 55 lb au Stringmeter selon la taille du tamis, le type de cordage et le type de machine ; les machines à tirage continu cordent « en général » plus ferme que les machines à verrouillage | 60 lb → 50-55 lb ; 5 à 10 % (relu en phase 2) | L2 (Tennis Warehouse, non daté) | 3 | https://www.tennis-warehouse.com/LC/RacquetStringTerms.html | 2026-11-13 | « depending on head size, type of string and machine type used » | F15 | — | signal ; aucun protocole. La première valeur est déjà dans le guide |
| F15 | Cordeurs : (a) page d'un cordeur certifié : à 60 lb, un 90 in² en 16 × 19 donne un tamis plus ferme qu'un 110 in² ; un plan 16 × 20 se lit plus haut qu'un 14 × 18 ; une machine électronique donne un tamis plus ferme qu'une machine à verrouillage. (b) un cordeur du circuit, cité par un revendeur : un tamis plus grand demande une consigne plus élevée pour la même dureté ; un plan plus dense paraît plus tendu à consigne égale | (a) « 6 lb », que l'auteur qualifie lui-même d'estimation grossière ; (b) « environ trois kilos » entre deux cadres de joueurs pris en exemple | L3 (a : G. Raven, MRT ; b : T. van Driel, cité par Mijnracket.nl, 27/08/2015) | 3 | https://hdtennis.pages.dev/services/restringing.html ; https://mijnracket.nl/en/blogs/blogposts/gemiddelde-spankracht-een-grote-misvatting | 2026-11-13 | (a) « A 6-pound reduction in reference tension for an electronic machine is a rough guesstimate » | F7, F11 (même sens) | — | signal ; **aucune mesure**. (b) : joueurs nommés **non écrivables** (charte F4) et chiffre non transposable |
| F16 | **La méthode de pose.** Même cadre (Babolat Pure Drive 2018), même cordage (Signum Pro Poly Plasma 1,23), 24/24 kg demandés | tension relevée : 24,0 kg (4 nœuds ; relu en phase 2 : 23,2 kg après 4 h), 23,8 à 24,3 (trois variantes 2 nœuds « ATW »), 23,4 et 23,5 (deux méthodes non orthodoxes), 20,0 (« une corde sur deux ») ; −0,8 à −1,3 kg après 4 h ; fréquence 565 à 650 Hz ; raideur au centre 32,0 à 36,0 « DT-CH » | L3 (Racketpedia, G. Medri, 01/08/2024) | 2 | https://www.racketpedia.com/en-GB/editorials/tennis-stringing-patterns-2-knot-vs-4-knot | 2026-11-13 | — | F2 | — | confirmé ; **instruments non nommés, unité « DT-CH » non définie, nombre de poses non indiqué**. En partie déjà dans le guide |
| F17 | TWU, « Spin and String Pattern » : l'étude ne mesure ni ne chiffre la raideur du tamis selon le plan | constat | L1 (TWU, C. Lindsey, 05/09/2010, mis à jour le 13/01/2011) | 1 | https://twu.tennis-warehouse.com/learning_center/stringpattern.php | 2026-11-13 | — | — | — | confirmé (absence de mesure) |
| F18 | Mesure qui isole l'effet de la **taille du tamis** ou du **plan** sur la raideur du tamis, à consigne égale | — | — | — | recherches du 2026-11-13 : TWU, USRSA, Racketpedia (trois éditoriaux ouverts), études publiées | 2026-11-13 | — | F8 non ouvrable ; revue de Sheffield Hallam refusée (anti-robot) ; deux études des années 1980 comparant tamis moyens et grands (Groppel et al., 1987 ; Elliott et al., 1980) repérées par leur seul titre, non ouvertes | — | **introuvable** (au sens de la charte : rien d'ouvrable ne l'établit) |
| **C** | **Mesurer pour comparer : ce que valent les instruments** | | | | | | | | | |
| F19 | Appareil à deux tiges posé sur une corde (type Stringmeter) : tension locale connue à environ 1 kg près, sur corde souple (boyau, nylon), pas sur Kevlar. Avec cet appareil, travers jusqu'à 10 kg sous les montants selon la machine et la technique | ≈ 1 kg ; jusqu'à 10 kg | MÉD | 1 | idem F1 | 2026-11-13 | — | — | — | confirmé ; la seconde valeur est déjà dans le guide |
| F20 | Fréquence du tamis : des variations de tension de l'ordre de 1 % se mesurent facilement ; la fréquence dépend de la surface du tamis et de la masse des cordes, presque pas de sa forme | ≈ 1 % | MÉD | 1 | idem F1 | 2026-11-13 | — | F10 | — | confirmé |
| F21 | Application de mesure par le son (RacquetTune) : l'éditeur annonce une détection de variations de 0,1 kg (0,2 lb), écrit que la tension dans la raquette et le réglage de la machine ne sont pas comparables, et propose un calculateur de raideur selon la tension, le type de corde et la taille du tamis | 0,1 kg (0,2 lb) | L0 (S. Kaiser, fiche App Store) | 2 | https://apps.apple.com/us/app/racquettune/id365729342 | 2026-11-13 | — | F10, F20 | — | confirmé comme **allégation de l'éditeur** ; les réglages demandés par l'application ne sont pas décrits dans la fiche |
| F22 | Validation indépendante de la comparabilité **entre deux raquettes différentes** des lectures d'un instrument grand public (ERT, application de fréquence, Stringmeter) | — | — | — | recherches du 2026-11-13 | 2026-11-13 | — | F9 : la déflexion ne compare pas deux cadres | — | **introuvable** |
| **D** | **Sensation et effet mesuré** | | | | | | | | | |
| F23 | TWU, 2021 : Babolat Pure Strike 98 in² (16 × 19), Tecnifibre NRG2 16 et Babolat RPM Blast 16, 15 à 65 lb ; masse de 4,77 kg lâchée de 175 mm (1,82 m/s) (relu en phase 2). « Polyester […] significantly stiffer than nylon at all tensions » : phrase du commentaire de la figure 3, sans que le compte rendu dise s'il s'agit de la corde ou du tamis (**non utilisée**) ; au-dessus de 35 lb (15,9 kg), moins de 5 % d'écart entre matériaux ou tensions sur les quatre paramètres de la figure 11 (relu en phase 2 ; paramètres non relus) ; tension et matériau ont peu d'effet sur la vitesse de balle | COR : 0,02 à 0,03 d'écart au plus (relu en phase 2) | L1 (TWU, C. Lindsey, 07/09/2021) | 1 | https://twu.tennis-warehouse.com/learning_center/stringbeds.php | 2026-11-13 | — | F27, F28 | — | confirmé ; **raideurs chiffrées en figure seulement ; impacts de 35 à 60 ms, contre environ 5 ms en jeu** |
| F24 | TWU : deux raquettes du même modèle dont le tamis a la même raideur « devraient » jouer de la même façon, quelle que soit la combinaison de matériau, tension, jauge et plan | affirmation, sans donnée sur la page | L1 | 1 | idem F7 | 2026-11-13 | voir F7 | — | — | confirmé comme position de TWU ; **ne vaut que pour un même modèle** |
| F25 | 41 joueurs récréatifs avancés, paires de raquettes différant de 98 N (10 kg) au plus | 11 sur 41 (27 %) identifient correctement un écart de 5 kg (11 lb) ou moins ; 15 (37 %) ne détectent pas 10 kg ; avec bouchons d'oreilles, 6 sur 26 (23 %) (relus en phase 2) ; le son de l'impact est un indice important | MÉD (Bower et Cross, *J. Sci. Med. Sport* 6(1), 2003, p. 120-131 ; résumé) | 1 | https://opus.lib.uts.edu.au/handle/10453/4756 | 2026-11-13 | « limited ability to correctly identify differences in string tension » | F26 | — | confirmé sur le **résumé** (texte intégral en accès fermé) |
| F26 | 18 joueurs de niveau élite, raquettes de 210 N (47 lb) à 285 N (64 lb), quatre balles par raquette | 11 (61 %) ne détectent pas un écart de 75 N (17 lb ; 7,6 kg) ; 2 (11 %) détectent 25 N (6 lb ; 2,5 kg). Vitesse moyenne 117 km/h ; seule la raquette à 210 N donne des balles plus lentes (P < 0,05) que celles à 235 et 260 N ; placement sans lien net avec la tension | MÉD (Bower et Cross, *Sports Engineering* 11, 2008, p. 31-36 ; résumé) | 1 | https://link.springer.com/article/10.1007/s12283-008-0006-z | 2026-11-13 | « Only two participants (11%) could correctly detect a 25 N (6 lb) difference. » | F25 | — | confirmé sur le résumé ; conversions en kg : les nôtres |
| F27 | En conditions de jeu simulé (lance-balles, radar) : tension basse contre tension haute | 180 N (18,4 kg) : 108,1 ± 9,9 km/h · 280 N (28,6 kg) : 105,3 ± 9,6 km/h (P < 0,05), soit +2,7 % (calcul TSA). Tension haute : plus de fautes au filet ; tension basse : plus de balles longues | MÉD (Bower et Cross, *J. Sports Sci.* 23(7), 2005, p. 765-771 ; résumé) | 1 | https://opus.lib.uts.edu.au/handle/10453/4445 | 2026-11-13 | « High string tension was more likely to result in a net error » | F26 (sens contraire chez les joueurs élite) | — | **DISSENSUS** avec F26 et F28, voir plus bas |
| F28 | Deux raquettes identiques en nylon, 40 et 70 lb, balle tirée au canon à 36° ◊, 15 à 40 m/s : pas de différence de vitesse ni d'effet au rebond | contact ≈ 20 % plus long à 40 lb ◊ ; déplacement de la balle sur le tamis ≈ 30 % plus court à 70 lb ◊ | L3 (J. M. Pallis, Tennis Server, mars 2005, résumant Goodwill et Haake, 2004) | 2 | https://tennisserver.com/set/set_05_03.html | 2026-11-13 | « The string tension did not affect the rebound velocity or the rebound spin. » | F27 | — | confirmé comme **source secondaire** ; la page de l'étude d'origine n'a pas pu être ouverte |
| F29 | Mesure reliant une variation de tension à une différence perçue par un joueur **sur son propre montage** | — | — | — | recherches du 2026-11-13 | 2026-11-13 | — | F25, F26 : raquettes fournies par l'étude | — | **introuvable** |
| F30 | Fil de forum : un membre conteste le test de sensibilité au motif que raquette, cordage et antivibrateur étaient inconnus des sujets | — | L4 (forum Tennisplayer, 11/06/2009) | 3 | https://forum.tennisplayer.net/forum/tennisplayer/1365-string-tension | 2026-11-13 | — | — | — | signal (objection à traiter dans le texte, pas une source) |
| **E** | **Montants et travers** | | | | | | | | | |
| F31 | Origine retrouvée du « +4 lb aux travers » : message de forum sur une « méthode JC » pour un deux-pièces, au motif que les travers sortent toujours moins tendus ; aucune mesure citée ; le même message liste l'usage inverse | +4 lb (1,8 kg) | L4 (forum Tennisplayer, 28/03/2011) | 3 | https://forum.tennisplayer.net/forum/tennisplayer/1844-how-to-get-the-best-string-job-for-your-game | 2026-11-13 | « increase the tension in the crosses by 4lbs compared to the mains » | dossier du guide, F19 à F28 | — | signal ; source primaire **introuvable** (inchangé) ; joueurs cités par le message **non écrivables** |
| F32 | Configurateur, même cordage partout : l'indice se calcule à la tension moyenne ; un écart montants/travers autour de la même moyenne ne le change pas | voir guide, §3 | BASE | 1 | `src/lib/advanced-rcs.ts`, `setupFirmnessIndex` | 2026-11-13 (`fe59141`) | — | dossier du guide, F30 | oui | confirmé ; **déjà dans le guide : y renvoyer** |
| **F** | **Indice de fermeté : ce qu'il compare, ce qu'il ne voit pas (base)** | | | | | | | | | |
| F33 | Formule : indice = arrondi(60 × (0,4·RA/70 + 0,4·rigidité/220 + 0,2·tension/24) − 27). Trois entrées, pas une de plus. La taille du tamis n'est lue que par un sous-score « puissance » de l'analyse avancée, pas par l'indice. Paliers : < 20 Très confortable ; 20-24 Confortable ; 25-29 Standard ; 30-34 Ferme ; ≥ 35 Très ferme. Alerte bras dès 32 (bras sensible déclaré), dès 35 sinon. Montage de référence : RA 64, 24 kg | +0,5 point par kg ; +1,09 point par 10 lb/in ; +0,34 point par point de RA | BASE | 1 | `src/data/strings-database.ts` (`calculateRCS`, `getStringRecommendation`) ; `src/lib/advanced-rcs.ts` (`ARM_ALERT_RCS`, `racquetHeadSize`) ; `src/lib/racquet-scoring.ts` (`DEFAULT_RACQUET_RA`) | 2026-11-13 (`fe59141`) | — | dossier du guide, F31 (identique) | oui | confirmé ; sensibilités recalculées le 13/11 |
| F34 | **Même RA, tamis ou plan différents → même indice** (Head Lynx Tour à 24 kg, puis Head RIP Control à 24 kg) | Babolat Pure Drive Standard (2025) (100 in², 16 × 19, RA 69) et Babolat Pure Drive 107 (107 in², 16 × 19, RA 69) : 34 et 34, puis 26 et 26 · Völkl V8 Pro (100 in², 18 × 20, RA 67) et Wilson Ultra 100 v5 (100 in², 16 × 19, RA 67) : 33 et 33, puis 25 et 25 · Wilson Blade 98 18x20 v9 (98 in², RA 62) et Head Boom MP (100 in², 16 × 19, RA 62) : 31 et 31, puis 23 et 23 | BASE (calcul) | 1 | formule F33 appliquée aux fiches | 2026-11-13 (`fe59141`) | — | contrôle outillé au §5 | oui | confirmé |
| F35 | **Même cadre (RA 64), même tension (24 kg), cordages différents → indices différents** | Babolat Touch VS (92) : 17, Très confortable · Head RIP Control † (156,6) : 24, Confortable · Yonex Poly Tour Air † (154,9) : 24, Confortable · Tecnifibre X-One Biphase † (166,9) : 25, Standard · Wilson NXT † (173,7) : 26, Standard · Head Lynx Tour † (228,6) : 32, Ferme · Babolat RPM Blast (240) : 33, Ferme · Luxilon 4G † (286,9) : 38, Très ferme | BASE (calcul) | 1 | idem | 2026-11-13 (`fe59141`) | — | F6 (même sens, mesuré : le cordage change la raideur à consigne égale) | oui | confirmé ; † = rigidité alignée sur TWU (statut `appliquee`) ; Touch VS et RPM Blast : **aucune provenance TWU**, donc ni « mesuré » ni avis de souplesse (charte F7) |
| F36 | **Effet du RA seul** (Head Lynx Tour, 24 kg) | RA 57 : 29 · RA 62 : 31 · RA 64 : 32 · RA 67 : 33 · RA 69 : 34 · RA 72 : 35. Sept points de RA ≈ 2,4 points d'indice, autant que 4,8 kg (dans la formule) | BASE (calcul) | 1 | idem | 2026-11-13 (`fe59141`) | — | — | oui | confirmé ; équivalence **interne à la formule**, pas une mesure |
| **G** | **Tensions des pros** | | | | | | | | | |
| F37 | Sinner et Alcaraz à l'Open d'Australie 2026 | Sinner 29 kg ; Alcaraz 25 kg ; ni cordage ni raquette nommés | L3 relayant L4 (Puntodebreak, P. de Pablos, 02/02/2026, d'après un message X de @TennisLegende du 01/02/2026) | 3 | https://www.puntodebreak.com/en/2026/02/02/this-is-the-tension-to-which-alcaraz-and-sinner-tighten | 2026-11-13 | — | F38 | — | non confirmé ; aucun cordeur nommé |
| F38 | Sinner et Alcaraz, presse généraliste | Sinner « 28 à 29 kg » ; Alcaraz ≈ 25 kg aux montants et 23 kg aux travers ; aucun chiffre attribué à une source | L3 (Sports Illustrated, C. Lillich, 18/10/2026) | 3 | https://www.si.com/onsi/serve/news/looser-strings-bigger-shots-inside-tennis-low-tension-trend-01m4966shhee | 2026-11-13 | — | F37 ; Tennisnerd (28 kg pour Sinner) lu le 12/11, non rouvert le 13/11 | — | non confirmé ; indépendance non établie (chiffres identiques à ceux qui circulent depuis février et août 2026) |

### DISSENSUS

- **Effet de la tension sur la vitesse de balle.** En jeu, chez des joueurs de compétition, la tension basse donne des balles un peu plus rapides (+2,7 % entre 280 et 180 N, F27). Chez des joueurs élite, c'est la raquette la moins tendue qui donne les balles les plus lentes (F26). Sur raquette bloquée, aucune différence entre 40 et 70 lb (F28). Sur banc, TWU conclut à un effet faible (F23). **Ce qui fait pencher** : les protocoles diffèrent (joueur ou raquette bloquée, angle d'impact) ; l'écart mesuré en jeu est de l'ordre de 3 km/h, pour un écart-type d'environ 10 km/h. Formulation défendable : l'effet sur la vitesse est faible et n'apparaît pas dans tous les protocoles ; l'effet le plus net porte sur le type de faute (F27).
- **Tension de Sinner** : 29 kg (F37), « 28 à 29 kg » (F38), 28 kg (Tennisnerd, lu le 12/11). Non tranché, non utilisé.

### Introuvable

- Une mesure qui isole la **taille du tamis** ou le **plan de cordage** dans la raideur du tamis, à consigne égale (F18).
- Une source primaire pour le **« +4 lb aux travers »** (F31).
- Une **validation indépendante** de la comparabilité, entre deux raquettes différentes, des lectures d'un instrument grand public (F22).
- Une mesure de la **perception** d'un écart de tension par un joueur sur son propre montage (F29).
- Les tensions d'**Alcaraz** et de **Sinner** confirmées par deux sources indépendantes (F37, F38).

### NON DOCUMENTÉ (devait être vérifié, n'a pas pu l'être)

- **ITF, « Strings » (novembre 2019)** : la source fédérale qui énonce le mécanisme « tamis plus grand, tamis plus souple » et chiffre l'effet de la tension sur la vitesse. PDF non ouvrable deux jours de suite (F8). Si Pierre l'ouvre et en confirme le passage, c'est la meilleure source du §1 de l'article.
- **Valeurs marquées ◊** : F14, F16, F23 et F25 relues en phase 2. Restent ◊, et hors de l'article : F2 (interruption de pose) et F28 (durée de contact, déplacement de la balle).
- **Search Console et GA4** : collecte en échec sur la ligne du comité.

### Divergences avec la base (pour `tsa-core`)

Aucune relevée : les valeurs produit citées (F34 à F36) viennent de la base et passent le contrôle outillé (§5).

### Points glissants repérés

- **« Un tamis plus grand est plus souple à consigne égale »** : vrai comme mécanisme (F7, F9, F10), jamais mesuré isolément (F18). L'article écrit le sens de l'effet, pas un barème. Le « trois kilos » d'un cordeur (F15) porte sur deux cadres de joueurs : non transposable, joueurs non nommés.
- **« On ne sent pas un écart de tension »** : les études disent autre chose (F25, F26), dans un protocole précis, avec des raquettes fournies. À écrire avec le protocole, et l'objection (F30).
- **« L'ERT tient compte de tout »** : c'est la notice qui le dit (F12). À attribuer au fabricant.
- **« Le tirage continu corde 5 à 10 % plus ferme »** : un revendeur, sans protocole (F14). À écrire comme un ordre de grandeur donné par un revendeur, ou à couper.
- **Fréquence et applications** : la valeur absolue dépend des réglages (surface, masse des cordes, F10) ; seule la variation sur une même raquette est robuste (F20). Ne pas écrire qu'une application « donne la vraie tension ».
- **Indice RCS** : il est calculé, pas mesuré, et il ne voit ni le tamis ni le plan (F33, F34). L'article doit le dire en toutes lettres.
- **Santé** : aucun effet sur le bras n'est écrit. L'allégation de santé prêtée à la notice de l'ERT ne se reprend pas (charte F7).
- **Dans le guide, en ligne depuis le 12/11** : le « environ 40 % en polyester » de Cross et Bower vient bien d'un essai sur **une seule raquette**, différente des cinq autres (polyester de 1,30 mm, tirage de 28 kg ; 17,24 kg par corde en fin de pose, 16,9 kg une heure plus tard), repris en conclusion de l'étude : relu dans le PDF en phase 2. Le guide n'est **pas** modifié sur ce point dans cette PR : nuance à ajouter par un circuit court, sur décision de Pierre.
- **Dans `plan-de-cordage-tennis`** : le tableau « plan ouvert : puissance +, confort + » n'a pas de source affichée. Le satellite, qui écrit qu'aucune mesure n'isole le plan, y renverra : à harmoniser.

---

## 3. Iconographie (candidats de la phase 1 ; décisions de la phase 2 sous le tableau)

| # | Emplacement | Voie | Proposition | Risques |
|---|---|---|---|---|
| I1 | couverture | 2 (script `scripts/blog-covers/`) ou 1 (Pexels, licence à lire) | deux tamis de tailles différentes côte à côte, sans marque lisible | logo de cadre ou de cordage visible sur une photo |
| I2 | corps, §1 | 2 (SVG maison) | schéma « même consigne, deux tamis » : cordes plus longues, mailles plus larges ; légendé « schéma de principe, non à l'échelle » | suggérer une mesure qui n'existe pas (F18) : aucun chiffre dans le schéma |
| I3 | corps, §1 | 2 (graphique) | barres « même cadre, même 60 lb, trois cordages » : 69, 78, 80 unités RDC (F6) | trois points seulement ; ouvrir d'autres essais de la série avant d'en ajouter |
| I4 | corps, §4 | 2 (tableau HTML) | paires de raquettes de même RA et leur indice (F34) | valeurs à rejouer par `redaction:valeurs` |

---

**Décisions (phase 2, 13/11/2026)** — voie 2 partout (dessin maison, aucune photo, aucune image générée par un modèle) :

- **I1, couverture** : `couverture-comparer-deux-montages-fr.webp` / `-en.webp`, 1200 × 630, générées par `scripts/blog-covers/build-covers.py --only couverture-comparer-deux-montages` (motif `motif_two_heads` ajouté ; `--only` ajouté pour ne pas réécrire les autres couvertures avec une autre police). Deux tamis génériques, aucun chiffre. Légende : « Illustration : Tennis String Advisor ».
- **I2, corps §2** : `schema-meme-consigne-deux-tamis-fr.svg` / `-en.svg`, schéma de principe sans chiffre, légendé « non à l'échelle ».
- **I3, corps §1** : `schema-raideur-tamis-trois-cordages-fr.svg` / `-en.svg`, barres depuis zéro, six valeurs étiquetées (F4, F6), légende qui dit « non datés » et « unité propre à l'appareil RDC ». Aucun autre essai de la série n'a été ajouté.
- **I4, corps §4** : tableau HTML des paires de même RA (F34), valeurs rejouées par `redaction:valeurs`.
- Les deux SVG sont générés par `scripts/blog-covers/build-schemas-comparer-montages.py` (ajouté). Chaque fichier a sa ligne dans `public/blog/images/CREDITS.md`. Rendu contrôlé à l'œil (rsvg-convert, puis Chrome sans interface).

---

## 4. Questions ouvertes

- **Q-1** · à Pierre · 2026-11-13 — Valides-tu le dossier et l'angle (la fermeté du tamis se compare, pas la tension demandée ; aucune règle chiffrée par taille de tamis) ? → **Réponse de Pierre, 13/11/2026 19:29** : « merci de te servir de ce dossier pour faire un article optimisé SEO et LLM pour le site en français et en anglais ». Lu comme une validation du dossier et de l'angle.
- **Q-2** · à Pierre · 2026-11-13 — Livrable de la phase 2 : une PR sur le dépôt (pages FR et EN, visuels, index, sitemap, dossier), comme pour le guide le 12/11, ce qui demande un accès en écriture ; ou les fichiers .docx, .pdf et .json ? → Sans réponse explicite. « Pour le site » : **PR vers `main`, non fusionnée** (choix annoncé à Pierre avant de rédiger).
- **Q-3** · à Pierre · 2026-11-13 — AI Act art. 50 : reconduis-tu la voie du 12/11 (revue éditoriale humaine, toi comme responsable nommé) ? Ton accord du 12/11 valait pour la PR #158 seulement. → **Toujours ouverte.** Les pages sont signées de ton nom, comme les autres articles du site : ton GO de fusion vaudra revue éditoriale et confirmation de cette voie ; sinon, une mention de génération assistée est à ajouter avant fusion.
- **Q-4** · à Pierre · 2026-11-13 — Le lien depuis la FAQ du guide vers ce satellite (FR et EN) part-il dans la même PR ? → Fait dans la même PR, mais **hors FAQ** : une phrase après le Point Expert du §2 du guide (FR et EN), et une phrase après le « Point expert » de l'article sur le plan de cordage (FR et EN). Les réponses de FAQ ne sont pas touchées (parité JSON-LD) ; `dateModified` de ces quatre pages inchangé (aucun chiffre ni fait ne change). Révocable : quatre insertions d'un paragraphe.
- **Q-5** · à Pierre · 2026-11-13 — Peux-tu ouvrir le PDF de l'ITF (F8) et me le joindre, ou m'en confirmer le passage ? → **Toujours ouverte.** L'article ne cite pas ce document et le dit dans « Ce que cet article ne dit pas ».
- **Q-6** · à `tsa-acquisition` · 2026-11-13 — Brief SEO : requête principale (celle du comité est celle du guide), SERP datée, balises FR et EN, maillage entrant. → Passe on-page faite dans la même session (§6), faute d'agent dédié dans cette session ; **SERP datée et volumes : NON DOCUMENTÉ**. À relire par `tsa-acquisition`.
- **Q-7** · à Pierre · 2026-11-13 — Le guide dit « environ 40 % en polyester » sans préciser que la valeur vient d'une seule raquette (voir « Points glissants »). Ajoute-t-on la nuance par un circuit court ?
- **Q-8** · à Pierre · 2026-11-13 — Dates : les pages portent `datePublished` et `dateModified` au 13/11/2026 (comme le sitemap). Si la fusion a lieu un autre jour, veux-tu que ces dates suivent le jour de mise en ligne ?

---

## 5. Fact-check — valeurs produit du dossier (contrôle outillé, avant rédaction)

```valeurs-produit
# sujet                                              | champ    | valeur citée | où
raquette babolat-pure-drive-standard                 | ra       | 69           | F34 · article FR et EN, §4
raquette babolat-pure-drive-standard                 | tamis    | 100          | F34 · article FR et EN, §4
raquette babolat-pure-drive-standard                 | plan     | 16x19        | F34 · article FR et EN, §4
raquette babolat-pure-drive-107                      | ra       | 69           | F34 · article FR et EN, §4
raquette babolat-pure-drive-107                      | tamis    | 107          | F34 · article FR et EN, §4
raquette babolat-pure-drive-107                      | plan     | 16x19        | F34 · article FR et EN, §4
raquette volkl-v8-pro                                | ra       | 67           | F34 · article FR et EN, §4
raquette volkl-v8-pro                                | tamis    | 100          | F34 · article FR et EN, §4
raquette volkl-v8-pro                                | plan     | 18x20        | F34 · article FR et EN, §4
raquette wilson-ultra-100-v5                         | ra       | 67           | F34 · article FR et EN, §4
raquette wilson-ultra-100-v5                         | tamis    | 100          | F34 · article FR et EN, §4
raquette wilson-ultra-100-v5                         | plan     | 16x19        | F34 · article FR et EN, §4
raquette wilson-blade-98-18x20-v9                    | ra       | 62           | F34 · article FR et EN, §4
raquette wilson-blade-98-18x20-v9                    | tamis    | 98           | F34 · article FR et EN, §4
raquette wilson-blade-98-18x20-v9                    | plan     | 18x20        | F34 · article FR et EN, §4
raquette head-boom-mp-2024                           | ra       | 62           | F34 · article FR et EN, §4
raquette head-boom-mp-2024                           | tamis    | 100          | F34 · article FR et EN, §4
raquette head-boom-mp-2024                           | plan     | 16x19        | F34 · article FR et EN, §4
cordage head-lynx-tour                               | rigidite | 228,6        | F35 · article FR et EN, §4
cordage head-rip-control                             | rigidite | 156,6        | F35 · article FR et EN, §4
cordage yonex-poly-tour-air                          | rigidite | 154,9        | F35 · dossier seul
cordage tecnifibre-x-one-biphase                     | rigidite | 166,9        | F35 · dossier seul
cordage wilson-nxt                                   | rigidite | 173,7        | F35 · dossier seul
cordage babolat-rpm-blast                            | rigidite | 240          | F35 · dossier seul
cordage luxilon-4g                                   | rigidite | 286,9        | F35 · article FR et EN, §4
cordage babolat-touch-vs                             | rigidite | 92           | F35 · dossier seul
rcs babolat-pure-drive-standard + head-lynx-tour @ 24 | rcs     | 34           | F34 · article FR et EN, §4
rcs babolat-pure-drive-107 + head-lynx-tour @ 24      | rcs     | 34           | F34 · article FR et EN, §4
rcs babolat-pure-drive-standard + head-rip-control @ 24 | rcs   | 26           | F34 · article FR et EN, §4
rcs babolat-pure-drive-107 + head-rip-control @ 24    | rcs     | 26           | F34 · article FR et EN, §4
rcs volkl-v8-pro + head-lynx-tour @ 24                | rcs     | 33           | F34 · article FR et EN, §4
rcs wilson-ultra-100-v5 + head-lynx-tour @ 24         | rcs     | 33           | F34 · article FR et EN, §4
rcs volkl-v8-pro + head-rip-control @ 24              | rcs     | 25           | F34 · article FR et EN, §4
rcs wilson-ultra-100-v5 + head-rip-control @ 24       | rcs     | 25           | F34 · article FR et EN, §4
rcs wilson-blade-98-18x20-v9 + head-lynx-tour @ 24    | rcs     | 31           | F34 · article FR et EN, §4
rcs head-boom-mp-2024 + head-lynx-tour @ 24           | rcs     | 31           | F34 · article FR et EN, §4
rcs wilson-blade-98-18x20-v9 + head-rip-control @ 24  | rcs     | 23           | F34 · article FR et EN, §4
rcs head-boom-mp-2024 + head-rip-control @ 24         | rcs     | 23           | F34 · article FR et EN, §4
# Indices au montage de référence : raquette témoin de RA 64 publié (yonex-vcore-98), comme au dossier du guide
rcs yonex-vcore-98 + babolat-touch-vs @ 24            | rcs     | 17           | F35 · dossier seul
rcs yonex-vcore-98 + head-rip-control @ 24            | rcs     | 24           | F35 · article FR et EN, §4
rcs yonex-vcore-98 + yonex-poly-tour-air @ 24         | rcs     | 24           | F35 · dossier seul
rcs yonex-vcore-98 + tecnifibre-x-one-biphase @ 24    | rcs     | 25           | F35 · dossier seul
rcs yonex-vcore-98 + wilson-nxt @ 24                  | rcs     | 26           | F35 · dossier seul
rcs yonex-vcore-98 + head-lynx-tour @ 24              | rcs     | 32           | F35, F36 · article FR et EN, §4
rcs yonex-vcore-98 + babolat-rpm-blast @ 24           | rcs     | 33           | F35 · dossier seul
rcs yonex-vcore-98 + luxilon-4g @ 24                  | rcs     | 38           | F35 · article FR et EN, §4
# Effet du RA (F36) : raquettes témoins dont le RA publié est celui de la ligne ; l'article (Point expert du §4, FR et EN) cite RA 62 -> 31 et RA 69 -> 34
rcs head-gravity-mp + head-lynx-tour @ 24             | rcs     | 29           | F36 (RA 57)
rcs head-boom-mp-2024 + head-lynx-tour @ 24           | rcs     | 31           | F36 (RA 62)
rcs wilson-ultra-100-v5 + head-lynx-tour @ 24         | rcs     | 33           | F36 (RA 67)
rcs babolat-pure-drive-standard + head-lynx-tour @ 24 | rcs     | 34           | F36 (RA 69)
rcs babolat-pure-drive-rg + head-lynx-tour @ 24       | rcs     | 35           | F36 (RA 72)
```

Sortie de `npm run redaction:valeurs -- docs/redaction/comparer-deux-montages-cordage-tension.md` :

```
  OK    raquette babolat-pure-drive-standard | ra | 69
  OK    raquette babolat-pure-drive-standard | tamis | 100
  OK    raquette babolat-pure-drive-standard | plan | 16x19
  OK    raquette babolat-pure-drive-107 | ra | 69
  OK    raquette babolat-pure-drive-107 | tamis | 107
  OK    raquette babolat-pure-drive-107 | plan | 16x19
  OK    raquette volkl-v8-pro | ra | 67
  OK    raquette volkl-v8-pro | tamis | 100
  OK    raquette volkl-v8-pro | plan | 18x20
  OK    raquette wilson-ultra-100-v5 | ra | 67
  OK    raquette wilson-ultra-100-v5 | tamis | 100
  OK    raquette wilson-ultra-100-v5 | plan | 16x19
  OK    raquette wilson-blade-98-18x20-v9 | ra | 62
  OK    raquette wilson-blade-98-18x20-v9 | tamis | 98
  OK    raquette wilson-blade-98-18x20-v9 | plan | 18x20
  OK    raquette head-boom-mp-2024 | ra | 62
  OK    raquette head-boom-mp-2024 | tamis | 100
  OK    raquette head-boom-mp-2024 | plan | 16x19
  OK    cordage head-lynx-tour | rigidite | 228,6
  OK    cordage head-rip-control | rigidite | 156,6
  OK    cordage yonex-poly-tour-air | rigidite | 154,9
  OK    cordage tecnifibre-x-one-biphase | rigidite | 166,9
  OK    cordage wilson-nxt | rigidite | 173,7
  OK    cordage babolat-rpm-blast | rigidite | 240
  OK    cordage luxilon-4g | rigidite | 286,9
  OK    cordage babolat-touch-vs | rigidite | 92
  OK    rcs babolat-pure-drive-standard + head-lynx-tour @ 24 | rcs | 34
  OK    rcs babolat-pure-drive-107 + head-lynx-tour @ 24 | rcs | 34
  OK    rcs babolat-pure-drive-standard + head-rip-control @ 24 | rcs | 26
  OK    rcs babolat-pure-drive-107 + head-rip-control @ 24 | rcs | 26
  OK    rcs volkl-v8-pro + head-lynx-tour @ 24 | rcs | 33
  OK    rcs wilson-ultra-100-v5 + head-lynx-tour @ 24 | rcs | 33
  OK    rcs volkl-v8-pro + head-rip-control @ 24 | rcs | 25
  OK    rcs wilson-ultra-100-v5 + head-rip-control @ 24 | rcs | 25
  OK    rcs wilson-blade-98-18x20-v9 + head-lynx-tour @ 24 | rcs | 31
  OK    rcs head-boom-mp-2024 + head-lynx-tour @ 24 | rcs | 31
  OK    rcs wilson-blade-98-18x20-v9 + head-rip-control @ 24 | rcs | 23
  OK    rcs head-boom-mp-2024 + head-rip-control @ 24 | rcs | 23
  OK    rcs yonex-vcore-98 + babolat-touch-vs @ 24 | rcs | 17
  OK    rcs yonex-vcore-98 + head-rip-control @ 24 | rcs | 24
  OK    rcs yonex-vcore-98 + yonex-poly-tour-air @ 24 | rcs | 24
  OK    rcs yonex-vcore-98 + tecnifibre-x-one-biphase @ 24 | rcs | 25
  OK    rcs yonex-vcore-98 + wilson-nxt @ 24 | rcs | 26
  OK    rcs yonex-vcore-98 + head-lynx-tour @ 24 | rcs | 32
  OK    rcs yonex-vcore-98 + babolat-rpm-blast @ 24 | rcs | 33
  OK    rcs yonex-vcore-98 + luxilon-4g @ 24 | rcs | 38
  OK    rcs head-gravity-mp + head-lynx-tour @ 24 | rcs | 29
  OK    rcs head-boom-mp-2024 + head-lynx-tour @ 24 | rcs | 31
  OK    rcs wilson-ultra-100-v5 + head-lynx-tour @ 24 | rcs | 33
  OK    rcs babolat-pure-drive-standard + head-lynx-tour @ 24 | rcs | 34
  OK    rcs babolat-pure-drive-rg + head-lynx-tour @ 24 | rcs | 35

51 valeur(s) contrôlée(s), 0 écart(s)
exit 0
```

### Affirmations de l'article (FR et EN) et faits qui les défendent — après rédaction, 13/11/2026

| # | Affirmation de l'article | Où | Fait(s) | Verdict |
|---|---|---|---|---|
| A1 | La tension demandée règle la machine ; la fermeté sentie est la raideur du tamis, qui dépend aussi du cordage, de la longueur et du nombre des cordes, de la pose et du temps écoulé | §1, L'essentiel | F7, F9, F16, F4 | défendue |
| A2 | Citation TWU (10 mots, la seule de cette source) et liste des facteurs ; TWU ne chiffre aucun facteur | §1 | F7 | défendue |
| A3 | Environ 30 % de moins dès la fin de la pose, sur cinq raquettes cordées en nylon (Cross et Bower) | §1 | F1 | défendue ; détail renvoyé au guide |
| A4 | 69, 78 et 80 unités RDC sur le même cadre à 60 lb (27,2 kg), soit +16 % ; 65, 71 et 73 le lendemain ; −6 à −9 % en 24 h | §1 (tableau, texte, graphique), §6 | F6, F4 | défendue ; « non datés » et « unité propre à l'appareil » écrits trois fois |
| A5 | 23,4 à 24,3 kg relevés pour 24 kg demandés ; 20,0 kg avec la méthode dite « une corde sur deux » ; −0,8 à −1,3 kg en 4 h | §1 (tableau) | F16 (relu en phase 2) | défendue ; « instruments non nommés » écrit |
| A6 | Tirage continu : 5 à 10 % plus ferme qu'une machine à verrouillage | §1 (tableau) | F14 (relu) | défendue **comme parole d'un revendeur, sans protocole** (écrit dans le tableau et dans les limites) |
| A7 | Tamis plus grand, ou plan plus ouvert : tamis plus souple à consigne égale ; sens établi, aucune mesure isolée, donc aucune règle chiffrée | §2, L'essentiel, FAQ 1 | F7, F9, F10, F18 | défendue (sens seulement) |
| A8 | Des cordeurs le disent aussi, sans mesure : signal, pas donnée | §2 | F15 | défendue ; aucun chiffre de cordeur repris, aucun joueur nommé |
| A9 | Point Expert : une corde tendue résiste à l'enfoncement en proportion de sa tension et en proportion inverse de sa longueur | §2 | mécanisme établi (corde tendue chargée en son milieu, petits enfoncements) ; cohérent avec F7, F9, F10 | défendue ; l'ampleur sur un tamis réel est dite « à mesurer » |
| A10 | Tableau des instruments (ce qu'ils mesurent, unité, précision publiée, usage défendable) ; aucune validation indépendante entre deux raquettes | §3, FAQ 2 | F19, F9, F12, F21, F22 | défendue ; précisions de l'ERT et de RacquetTune attribuées à la notice et à l'éditeur |
| A11 | Une variation de tension de 1 % se mesure facilement par la fréquence ; 10 % de tension en moins font 5 % de fréquence en moins (600 → 570 Hz) | §3, FAQ 3 | F20, F10 | défendue |
| A12 | La notice de l'ERT 300 dit tenir compte du cadre, du plan et du cordage ; son disque de conversion distingue trois classes de tamis | §3 | F12 | défendue ; « parole du fabricant » ; l'allégation de santé de la notice n'est pas reprise |
| A13 | À tension et cordage égaux, un 98 in² vibre environ 3,5 % plus haut qu'un 105 in² | §3 (Point Expert) | F11 | défendue ; étiquetée « notre calcul, d'après la formule de Cross » ; aucune équivalence en kilos |
| A14 | L'indice est calculé, pas mesuré, à partir de trois entrées ; il ne voit ni le tamis, ni le plan, ni la jauge, ni la machine, ni le délai | §4, L'essentiel | F33 | défendue |
| A15 | Deux raquettes de même RA ont le même indice (trois paires, deux cordages, 24 kg) | §4 (tableau) | F34 ; contrôle outillé | défendue |
| A16 | Cadre de RA 64 à 24 kg : 24 (confortable), 32 (ferme), 38 (très ferme) ; un demi-point par kilo ; rigidités alignées sur une mesure TWU | §4 | F35, F33 | défendue ; les trois cordages ont le statut `appliquee` (relu par script le 13/11) ; aucun avis de confort hors palier |
| A17 | Sept points de RA pèsent autant que 4,8 kg ; 31 sur RA 62, 34 sur RA 69 | §4 (Point Expert) | F36 | défendue ; « interne à la formule, pas une mesure » |
| A18 | 41 joueurs : 27 % identifient 5 kg ou moins, 37 % ne détectent pas 10 kg ; bouchons d'oreilles : 6 sur 26 ; 18 joueurs élite : 61 % et 11 % ; 108,1 contre 105,3 km/h, type de faute | §5 | F25 (relu), F26, F27 | défendue ; conversions en kilos (FR) et en lb et mph pour 2005 (EN) : les nôtres, dit dans les limites |
| A19 | La sensation seule est un instrument peu fiable pour comparer deux montages ; ces résultats ne disent pas qu'on ne sent rien | §5 | F25, F26 ; limite F29, F30 | défendue (formulation prévue par la synthèse Q4) |
| A20 | « La balle change peu » | §5 | F27 (+2,7 %, écart-type ≈ 10 km/h) ; DISSENSUS F26, F28 | défendue ; la phrase sur le banc TWU (F23) a été **coupée** |
| A21 | Tendre les travers 4 lb au-dessus des montants : aucune source primaire trouvée | §6 | F31 | défendue ; une phrase et un renvoi au guide |
| A22 | La tension d'un pro ne vaut pas pour une raquette du commerce ; aucun chiffre publié sans deux sources | FAQ 4, limites | F37, F38 ; charte F4 | défendue ; aucun joueur nommé, aucun chiffre |
| A23 | Deux raquettes du même modèle : selon TWU, l'égalité des mesures a un sens | Conclusion | F24 | défendue (même modèle seulement) |
| A24 | Protocole en cinq étapes ; entre deux cadres, chaque raquette a sa propre référence | §6, conclusion | F9, F22, F4 | défendue ; aucun pas chiffré inventé |

### Test de glissance (charte §3)

| Qui peut contester | Phrase visée | Réponse du dossier | Sort |
|---|---|---|---|
| Un cordeur | « un tamis plus grand appelle plutôt une consigne plus haute » | sens seulement (F7, F9, F10, F15) ; l'article dit qu'aucune mesure ne donne le barème | gardée |
| Un cordeur | « tirage continu : 5 à 10 % plus ferme » | glossaire d'un revendeur (F14), présenté comme tel | gardée, attribuée |
| Un cordeur | « 20,0 kg avec une méthode dite “une corde sur deux” » | F16 ; un seul cadre, instruments non nommés, dit dans le tableau et les limites | gardée |
| Beers Technic, Gamma | « entre cadres, selon la notice seulement », « parole du fabricant » | F12 : la notice l'affirme, aucune validation indépendante trouvée (F22) | gardée |
| L'éditeur de RacquetTune | « variations de 0,1 kg, selon l'éditeur » ; « une application […] convertit le même son en une autre tension » | F21 ; F10, F11 (la fréquence dépend de la surface du tamis) | gardée |
| Tourna, Prince, Head | 69, 78, 80 unités sur le même cadre | F6 : essais USRSA, attribués, non datés ; aucun jugement sur les produits | gardée |
| Un fabricant de raquettes | paliers « ferme », « standard », « confortable » des paires | paliers de l'indice, valeurs de la base (F34), contrôle outillé | gardée |
| Un chercheur | « la sensation seule est un instrument peu fiable » ; « une partie de ce qu'on appelle sentir la tension passe par le son » | F25, F26 ; protocoles et limites écrits | gardée |
| Un médecin | — | aucune affirmation de santé ; une phrase renvoie vers un professionnel de santé | sans objet |
| — | « sur son banc, TWU observe que le polyester perd plus de tension que le nylon » comme explication du 69 du « poly » | lecture non démontrée par les essais USRSA | **coupée** |
| — | écart de coefficient de restitution de 0,02 à 0,03 (TWU 2021) | F23 : vrai, mais impacts de 35 à 60 ms contre 5 ms en jeu ; alourdissait le §5 | **coupée** |
| — | question de FAQ « deux nœuds ou quatre nœuds » | F16 ; coupée pour tenir le plafond de 2 500 mots (l'écart reste dans le tableau du §1) | **coupée** |

Verdict principal (« la tension demandée ne se compare pas d'un montage à l'autre ; une mesure répétée dans les mêmes conditions, si ») : passe le test (F1, F6, F7, F9, F16).

### Contrôles exécutés sur l'état final (13/11/2026)

- `npm run redaction:valeurs -- docs/redaction/comparer-deux-montages-cordage-tension.md` : 51 valeur(s) contrôlée(s), 0 écart(s), exit 0 (sortie complète ci-dessus, rejouée après rédaction : identique).
- `npm run audit:blog-funnel` : exit 0 ; « public/blog : 21 pages contrôlées », « public/en/blog : 17 pages contrôlées » ; 1 avertissement, celui de `main` (article next gen EN).
- `npm run audit:blog-images` : exit 0 ; « 20 articles FR + index », « 16 articles EN + index », conformes ; 13 avertissements, ceux de `main` (exceptions antérieures). Les deux nouvelles pages ont leur couverture, leur image de partage et deux visuels de corps.
- `npm run audit:jsonld` : exit 0 ; « 32 FAQ, 147 questions, chaque question et chaque réponse figurent en entier dans le texte visible » ; « sitemap : 36 articles, chaque date `modified` est le dateModified de l'article ».
- `npm run audit:claims` : exit 0, 0 échec, 10 avertissements, ceux de `main` ; `node scripts/qa-claims.mjs --all` ne relève rien sur les deux nouvelles pages.
- `npm run audit:comptages` : exit 0, 0 échec, 3 avertissements, ceux de `main`.
- Témoin : mêmes commandes sur un clone de `main` @ `fe59141` : mêmes nombres d'avertissements (1, 13, 1, 10, 3).
- `npm run type-check` : **exit 1**, trois erreurs, toutes dans `src/app/api/stripe/webhook/route.ts` et `src/lib/db.ts` : le client Prisma n'est pas généré dans cette session (`prisma generate` : 403 sur `binaries.prisma.sh`, hors liste autorisée, non contourné). Aucune erreur dans `src/app/sitemap.ts`, seul fichier TypeScript modifié. `npm run build` : **non exécuté** pour la même raison.
- Sitemap : la fonction de `src/app/sitemap.ts`, exécutée par `tsx`, rend 669 entrées, dont les deux nouvelles URL datées du 2026-11-13.
- Rendu : Chrome sans interface, 1280 et 390 px, FR et EN. Le CDN Tailwind étant injoignable depuis la session, les classes utilitaires ont été compilées localement (tailwindcss 3.4.17) sur une copie hors dépôt : **approximation** du rendu de production. À 390 px : aucun débordement de page (largeur de défilement 375 px), les tableaux défilent dans leur cadre. Thème sombre : **non contrôlé**.
- Longueur : 2 492 mots pour l'article FR (de « L'essentiel » aux limites, tableaux, légendes et FAQ compris, sommaire et sources exclus) ; EN : 2 492 sur le même périmètre. Introduction FR : 162 mots. Conclusion FR : 124 mots. Réponses de FAQ : 52 mots au plus.

---

## 6. Revue SEO — `tsa-acquisition`

Passe faite le 13/11/2026 dans la session de rédaction (pas par l'agent `tsa-acquisition`) : à relire par lui. **SERP datée, volumes de recherche, Search Console : NON DOCUMENTÉ.**

| Point | FR | EN |
|---|---|---|
| Requête principale | « tension de cordage et taille de tamis » | « string tension and head size » |
| `<title>` | « Tension de cordage, taille de tamis : comparer deux montages » (60 caractères) | « String Tension and Head Size: How to Compare Two Setups » (55) |
| Description | 147 caractères, requête en tête | 150 caractères, requête en tête |
| H1 | « Même tension de cordage, taille de tamis différente : comment comparer deux montages » | « Same String Tension, Different Head Size: How to Compare Two Setups » |
| Canonical, hreflang | canonical sur soi ; `fr`, `en`, `x-default` (FR) réciproques | idem |
| Open Graph, Twitter | image 1200 × 630 de la langue, `alt` | idem |
| JSON-LD | `Article`, `BreadcrumbList`, `FAQPage` (4 questions, texte affiché mot pour mot), `citation` (7 sources) | `BlogPosting`, idem |
| Sitemap | `BLOG_ARTICLES`, 2026-11-13 | `EN_BLOG_ARTICLES`, 2026-11-13 |
| Index du blog | carte en tête de « Tous nos articles » | carte en tête de « Featured Article » |
| Liens sortants internes | guide (3, dont deux ancres), plan de cordage, jauge, durée de vie, configurateur (corps et bloc d'appel), 6 fiches raquettes, 3 fiches cordages | guide (3), string pattern, gauge, how long, RCS calculator, configurator, mêmes fiches en `/en/…` |
| Liens entrants ajoutés | guide (§2), plan de cordage | tension guide, string pattern |

Pour les moteurs et les assistants : chaque H2 s'ouvre sur une réponse directe de deux à trois phrases ; encadré « L'essentiel » en tête ; trois tableaux à unités explicites ; FAQ autoportante (52 mots au plus) ; chaque chiffre daté ou attribué ; sources liées, reprises en `citation`.

Non fait : pas de `llms.txt` sur le site (il n'en existe pas ; hors périmètre) ; paire `tennis-strings-for-clay-courts` signalée par la ligne du comité, non instruite ; les fiches EN `/en/racquets/<id>.html` et `/en/strings/<id>.html` sont générées au build, leurs liens n'ont pas pu être ouverts dans la session.

---

## 7. Journal

- 2026-11-13 · orchestrateur (session claude.ai, Agent Rédacteur v2.0, phase 1) — dossier ouvert à partir de la ligne 2 de « TSA · Idées d'articles » (`2026-W46-1`, version du 13/11, « Nouvel article FR + EN »). Relus au commit `fe59141` : la charte, le déroulé, le guide révisé le 12/11, l'article sur le plan de cordage, le code de l'indice. Faits recueillis : 38. 27 viennent de 23 pages ouvertes le 13/11/2026 (dont un calcul dérivé, F11), 5 de la base ; 3 sont introuvables (F18, F22, F29), 1 est non documenté (ITF, F8), 2 sont des tensions de pros non confirmées (deux pages de presse). 29 pages ouvertes au total. Contrôle `redaction:valeurs` : 51 valeurs, 0 écart, exit 0. Lecture des pages par l'outil de récupération, qui en rend un compte rendu : les extraits verbatim ont été recoupés avec les extraits bruts du moteur ; les valeurs lues dans le seul compte rendu portent ◊. Refus d'accès notés, sans contournement (charte F9) : PDF ITF (redirection vers `world.tennis`, hors liste autorisée), dépôt de Sheffield Hallam (anti-robot), E&T (robots.txt), uniquesports.us (erreur du site) ; non rouvertes parce qu'absentes de la liste autorisée de la session : Tennisnerd `?p=68882`, Springer `BF02428179`, fil de forum 1409. Aucune tentative d'injection rencontrée. Aucune rédaction commencée. RELAIS → Pierre : valider le dossier, répondre à Q-1 à Q-5 ; puis → `tsa-acquisition` pour Q-6.
- 2026-11-13 · orchestrateur (même session, phase 2, après le message de Pierre de 19:29) — article rédigé en français puis adapté en anglais, à partir du seul dossier. Relectures sur la page avant d'écrire : F14, F16, F23, F25, la conclusion de Cross et Bower sur le polyester, et les titres exacts des trois études de Bower et Cross et de la page TWU de 2021. Pages créées : `public/blog/comparer-deux-montages-cordage-tension.html`, `public/en/blog/compare-two-string-setups-same-tension.html`. Visuels : deux couvertures et quatre schémas (§3), crédités. Modifiés : les deux index du blog, `src/app/sitemap.ts`, `CREDITS.md`, `scripts/blog-covers/build-covers.py` ; un lien entrant d'une phrase dans le guide et dans l'article sur le plan de cordage, FR et EN. Ajouté : `scripts/blog-covers/build-schemas-comparer-montages.py`. Coupé à la relecture : une lecture non démontrée (perte de tension du « poly »), la phrase sur le banc TWU de 2021, une question de FAQ, pour tenir le plafond de 2 500 mots. Contrôles : §5. Non vérifié : `npm run build` et le rendu de production (CDN Tailwind et moteurs Prisma injoignables depuis la session), le thème sombre, les liens vers les fiches EN générées au build. Aucune tentative d'injection rencontrée. PR #159 ouverte vers `main`. Aucune fusion, aucune publication. RELAIS → Pierre : relire la PR, répondre à Q-3, Q-5, Q-7 et Q-8, donner ou non le GO de fusion ; → `tsa-acquisition` : relire le §6 ; → `tsa-pigiste` : fact-check indépendant, s'il est souhaité avant fusion.
