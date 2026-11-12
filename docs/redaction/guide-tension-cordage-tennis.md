# Tension de cordage : quelle tension choisir, et faut-il un écart entre montants et travers ?

| Champ | Valeur |
|---|---|
| Slug FR / EN | `guide-tension-cordage-tennis` / `tennis-string-tension-guide` |
| Circuit | complet (mise à jour d'un article existant, sans article parallèle) |
| Branche | `agent/redaction/guide-tension-cordage-tennis`, partie de `main` @ `ceafe7a` |
| Ouvert le | 2026-11-12 |
| Demande d'origine | Ligne `2026-W46-1` de « TSA · Idées d'articles » (score 3,84) ; Pierre, 12/11/2026 12:21 : « travailles là dessus » |
| Statut | faits (phase 1, 12/11/2026) · rédaction FR + EN (12/11/2026) · PR #158 ouverte le 12/11/2026 · **GO de Pierre attendu** (fusion = mise en ligne) |
| Mise à jour planifiée | sans objet (pas d'année dans le titre ni le slug ; la section datée « pros 2024-2025 » est à retirer, voir F35-F37) |

> Règles : `docs/redaction/CHARTE.md`. Régime de preuve **A** : chaque valeur vient d'une page ouverte le 2026-11-12, ou de la base (`src/data/`, relevé TWU versionné) lue au commit `ceafe7a`.
> Fiabilité (Agent Rédacteur v2.0) : **1** mesure instrumentée publiée avec sa méthode · **2** test structuré, conditions décrites mais incomplètes · **3** signal (presse sans protocole, revendeur, forum).

---

## 1. Brief (repris de la ligne du comité ; brief SEO complet à faire par `tsa-acquisition`)

- **Question** : quelle tension de départ choisir selon son cordage et son bras, et faut-il régler les travers différemment des montants sur un montage deux pièces ?
- **Décision du comité** : compléter le guide existant, ne pas créer d'article parallèle (risque de cannibalisation). 11 signaux de forum, tous evergreen ; Google fait remonter « montant travers » (FR) et « main vs cross » (EN). Aucun intertitre des quatre articles tension ne traite l'écart montants/travers (vérifié : seule la FAQ Q4 du guide l'effleure, pour les hybrides).
- **Audience** : 1 affichage, 0 clic selon Acquisition ; GA4 non documenté (`ga4_ko`, droits insuffisants).
- **Garde-fous** (Contradicteur, Pigiste) : « +4 lb » présenté comme un usage, pas comme une règle ; tensions des pros retirées sans deux sources indépendantes ; distinguer consigne machine, tension sur tamis et délai après pose ; comparer à protocole identique ; pertes 24 h à vérifier contre la cinétique TWU ; ne pas citer l'article chaleur comme preuve ; confort par l'indice et le palier, sinon NON DOCUMENTÉ ; aucune promesse santé ; pas de « meilleure tension ».
- **Paire à mettre à jour** : l'article EN `tennis-strings-for-clay-courts` pointe vers `tennis-string-tension-guide`, qui porte les mêmes passages.

---

## 2. Dossier de faits — réponses aux questions du pigiste

### Synthèse (ce que le dossier permet d'écrire)

**Q1. Quelle source primaire fonde l'écart de +4 lb aux travers ?** Aucune. **Introuvable** au sens de la charte (F3). Le chiffre remonte à un message de forum de 2011 qui le présente comme la méthode d'un cordeur (F19), et à une rumeur non confirmée (F21). Ce qui est mesuré : à consigne égale, les travers sortent moins tendus que les montants, jusqu'à 10 kg selon la machine et la technique (F4). C'est l'écart que le « +4 lb » prétend compenser. Mais l'usage inverse, travers plus bas, a lui aussi une logique physique : les travers sont plus courts, donc plus raides à tension égale (F21, F25). Aucun essai comparatif ne départage les deux. On peut écrire : deux usages opposés, deux logiques, aucun chiffre universel. Dans le configurateur, un écart réparti autour de la même moyenne ne change pas l'indice (F30).

**Q2. Le plan de cordage fait-il varier la tension mesurée juste après la pose, à consigne égale ?** Aucune mesure trouvée qui isole le plan : **introuvable**. Ce qui est mesuré, et selon quel protocole :
- l'écart entre consigne et tension sur tamis : environ 30 % de moins juste après la pose, environ 40 % en polyester (F1, F2) ;
- l'écart montants/travers (F4) ;
- l'effet de la méthode de pose, à cadre et cordage identiques : 20,0 à 24,3 kg relevés pour 24 kg demandés (F9).
Le rôle du tamis et du plan sur la fermeté n'est écrit que qualitativement (F8, F21, F26).

**Q3. Les pertes 24 h par famille du guide figurent-elles dans les données TWU ? Concordent-elles avec la cinétique TWU ?** Non, et non.
- TWU ne publie aucune perte « sur 24 h ». Sa cinétique porte sur une corde seule, sur banc, à 62 lb, en minutes et en frappes : jusqu'à 15 lb en une minute (environ 24 %), jusqu'à 20 lb en 20 frappes, 20 à 35 lb avant le premier jeu (F10). C'est bien plus que les 20-25 % que le guide prête au polyester sur 24 h.
- La base TWU (51 lb, « Fast ») donne des médianes de 41,2 % en polyester, 20,5 % en nylon, 14,9 % en boyau, sans protocole publié pour ce pourcentage (F14, F15).
- Sur raquette non jouée, le seul relevé trouvé donne environ 13 % pour le polyester sur les premiers jours (F17), sous la fourchette du guide.
- La fourchette « synthétique 15-18 % » (et « boyau 5-8 % ») remonte vraisemblablement à un extrait Human Kinetics, aujourd'hui inaccessible (F18).
- Ce qui tient, sur tous les protocoles : boyau < nylon < polyester (F11, F15).

→ Le tableau 24 h et son graphique sont à retirer. Les chiffres qui restent s'écrivent avec leur protocole, sans comparer deux protocoles entre eux.

**Q4. Quels indices et paliers pour un polyester 1,25 (17) aux tensions de départ courantes ?** Le configurateur ne distingue pas la jauge : l'indice d'un polyester « en 1,25 » est celui de sa fiche, dont la rigidité est celle de la jauge la plus rigide mesurée (règle C) (F32). Au montage de référence (RA 64), la fiche médiane des 75 polyesters qui proposent 1,25 (215,5 lb/in) donne 28 à 20 kg, 30 à 24 kg, 31 à 26 kg : **Standard jusqu'à 22 kg, Ferme dès 23 kg** (F33). Sur l'ensemble de ces fiches, l'indice va de 22 (Yonex Poly Tour Air à 20 kg, palier Confortable) à 39 (Luxilon 4G à 26 kg, palier Très ferme). Aucune source ne fixe de « tensions de départ courantes » : la grille couvre 18 à 28 kg, la plage usuelle notée dans `src/lib/advanced-rcs.ts`.

**Q5. Les tensions d'Alcaraz et de Sinner sont-elles confirmées par deux sources indépendantes ?** Non.
- **Sinner** : 28 kg selon Tennisnerd, 29 kg selon un post X relayé par Puntodebreak (F35, F36). C'est un DISSENSUS.
- **Alcaraz** : 25 kg dans les deux sources, mais Tennisnerd lui prête du RPM Team, pas le RPM Blast du guide (F37).
- Aucune source ne nomme de cordeur ; l'indépendance n'est pas établie ; les cadres sont des pro stock (charte F4).

→ **Retirer la section**, conformément au garde-fou. Ses autres lignes (Djokovic, Sonego, Rublev, Evans, Federer, Wawrinka) tombent avec elle : elles ne sont pas revérifiées.

### Faits

| # | Énoncé | Valeur | Niveau | Fiab. | Source (URL ouverte) | Consulté le | Extrait verbatim (≤ 15 mots) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|---|
| **A** | **Consigne, tension sur tamis, délai** | | | | | | | | | |
| F1 | Juste après la pose, la tension du tamis est inférieure à la tension de tirage | ≈ −30 % | MÉD (Cross & Bower, *Sports Engineering* 4, 2001, p. 165-175) | 1 | https://www.physics.usyd.edu.au/~cross/CrossBower.pdf | 2026-11-12 | « the tension immediately after stringing is typically about 30% lower than the pull tension » | F8 (sens identique, ampleur moindre) | — | confirmé |
| F2 | Même chute pour le polyester | ≈ −40 % | MÉD | 1 | idem F1 | 2026-11-12 | — | — | — | confirmé |
| F3 | Raquettes d'essai en nylon : tirage 18,0 à 28,4 kg → tension calculée après pose 12,1 à 19,8 kg | −5,9 à −8,6 kg | MÉD | 1 | idem F1 | 2026-11-12 | — | — | — | confirmé |
| F4 | À même tirage, les travers mesurent moins que les montants (Stringmeter) ; les montants restent plus tendus après plusieurs mois de jeu | jusqu'à 10 kg d'écart selon machine et technique | MÉD | 1 | idem F1 | 2026-11-12 | — | F24 (frottement, qualitatif) | — | confirmé |
| F5 | Le long d'un même travers, la tension varie à cause du frottement aux croisements | 28 kg à un bout, ≈ 20 kg à l'autre (exemple) | MÉD | 1 | idem F1 | 2026-11-12 | — | — | — | confirmé |
| F6 | Relaxation : corde nylon neuve tirée à 28 kg → ≈ 24 kg en 15 min ; échantillons serrés à longueur fixe : 28 → 21,9 kg et 18 → 14 kg après 72 h | voir valeur | MÉD | 1 | idem F1 | 2026-11-12 | — | — | — | confirmé (échantillons, pas raquette) |
| F7 | Sur raquette, sur 200 h, la perte due aux frappes est trop faible pour être séparée de la relaxation naturelle | qualitatif | MÉD | 1 | idem F1 | 2026-11-12 | — | — | — | confirmé |
| F8 | Une raquette cordée à 60 lb peut mesurer 50 à 55 lb au Stringmeter, selon le tamis, le cordage et la machine | 60 lb → 50-55 lb | L2 (Tennis Warehouse, glossaire) | 3 | https://www.tennis-warehouse.com/LC/RacquetStringTerms.html | 2026-11-12 | « a racquet strung at 60 pounds may actually measure (with a Stringmeter) 50-55 pounds » | F1 | — | confirmé (revendeur, non daté) |
| F9 | Même cadre (Pure Drive 2018), même cordage (Signum Pro Poly Plasma 1,23), 24 kg demandés : tension relevée selon la méthode de pose ; perte après 4 h de repos | 4 nœuds : 24,0 kg puis 23,2 (−0,8) ; deux nœuds ATW : 23,8 à 24,3 puis −1,1 à −1,3 ; « une corde sur deux » : 20,0 puis 19,0 | L3 (Racketpedia, G. Medri, 01/08/2024) | 2 | https://www.racketpedia.com/en-GB/editorials/tennis-stringing-patterns-2-knot-vs-4-knot | 2026-11-12 | — | — | — | confirmé ; **instruments non nommés**, un seul cordage par méthode |
| F10 | Banc TWU, corde seule tendue à 62 lb : perte immédiate puis sur les premières frappes | jusqu'à 15 lb en 1 min (≈ 24 %) ; jusqu'à 20 lb en 20 frappes ; 20 à 35 lb avant le premier jeu | L1 (TWU, C. Lindsey, « Go Dead » partie 1, 21/03/2013) | 1 | https://twu.tennis-warehouse.com/learning_center/deadstrings.php | 2026-11-12 | « as much as 20 pounds in 20 hits on the test machine » | — | — | confirmé ; protocole banc, non convertible en heures |
| F11 | Classement des pertes de tension : polyester > nylon > boyau | ordre | L1 | 1 | idem F10 | 2026-11-12 | — | F15 (même ordre) | — | confirmé ; **le boyau n'est pas dans le panel de F10**, l'ordre boyau repose sur F15 |
| F12 | La perte est la plus rapide à la pose, dans les heures qui suivent et sur les premières frappes, puis se stabilise à un rythme presque imperceptible mais cumulatif | qualitatif | L1 (TWU, « String Stiffness ») | 1 | https://twu.tennis-warehouse.com/learning_center/stringstiffness.php | 2026-11-12 | « The rate of tension loss is greatest when the racquet is first strung » | F6 | — | confirmé |
| F13 | La rigidité d'une corde croît avec la tension (mesure dynamique, 30 → 60 lb) | RPM Blast 16 : 233 → 304 lb/in ; X-One Biphase 16 : 148 → 190 lb/in | L1 (TWU, « Spin and String Stiffness », 04/03/2011) | 1 | https://twu.tennis-warehouse.com/learning_center/spinandstiffness.php | 2026-11-12 | — | — | la formule RCS traduit la tension en +0,5 pt/kg (F31) | confirmé |
| F14 | La page de la base TWU ne décrit pas le protocole du pourcentage « Tension Loss » | constat | L1 | 1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php | 2026-11-12 | — | `combien-de-temps-dure-un-cordage` dit la même chose | — | confirmé |
| F15 | Perte de tension TWU par matière (médiane, intervalle interquartile) à 51 lb, « Fast » | polyester 41,2 % (32,6-48,0 ; n = 483) ; nylon 20,5 % (17,7-23,1 ; n = 230) ; boyau 14,9 % (12,4-15,9 ; n = 18) ; polyester 1,24-1,26 mm : 39,7 % (31,8-47,8 ; n = 166) | BASE (relevé TWU versionné du 29/09/2026, `data/reference/twu-releve-complet.json`, 788 lignes) | 1 | https://twu.tennis-warehouse.com/learning_center/reporter2.php (source du relevé) | relevé 2026-09-29 ; calcul 2026-11-12 | — | F16 (valeurs du relevé identiques à la page vivante) | `twu-releve-complet.json` | confirmé ; médianes calculées par nous |
| F16 | Contrôle sur la page vivante : rigidité et perte TWU (51 lb, Fast) | Head Lynx Tour 17 (1.25) 217,7 lb/in, 24,6 % ; Babolat RPM Blast 17/1.25 233,7 lb/in, 33,3 % ; Luxilon 4G Soft 1.25 217,2 lb/in, 25,4 % ; Solinco Hyper-G 16L (1.25) 218,3 lb/in, 24,7 % | L1 | 1 | idem F14 | 2026-11-12 | — | relevé versionné : mêmes valeurs | `stiffnessByGauge` des fiches : identiques | confirmé |
| F17 | Raquettes identiques cordées à 60 lb, non jouées, 21 jours : perte sur les premiers jours, puis au 21e jour | premiers jours : polyester ≈ 13 %, synthétique ≈ 13 %, MonoGut ZX 9,5 % ; 21e jour : synthétique 17,3 %, polyester 15,2 %, MonoGut ZX 11,9 % | L0 (Ashaway, S. Crandall ; essai de J. Gugel, USRSA MRT) | 2 | https://www.ashawayusa.com/TennisTip9.php | 2026-11-12 | — | — | — | confirmé ; **instrument non indiqué, une raquette par cordage, fabricant qui vend le MonoGut ZX**, non daté |
| F18 | Origine probable des fourchettes 24 h « synthétique 15-18 % » et « boyau 5-8 % » | — | L3 (Human Kinetics, extrait de livre) | — | page redirigée vers l'accueil (site canadien fermé) | 2026-11-12 | — | — | — | **introuvable** : page non ouvrable, l'extrait de moteur n'est pas une source (F10 de la charte) |
| **B** | **Montants et travers** | | | | | | | | | |
| F19 | Origine retrouvée du « +4 lb aux travers » : message de forum présentant la « méthode Jaycee » pour un deux-pièces mono-cordage, au motif que les travers sortent moins tendus | +4 lb aux travers | L4 (forum Tennisplayer, GeoffWilliams, 28/03/2011) | 3 | https://forum.tennisplayer.net/forum/tennisplayer/1844-how-to-get-the-best-string-job-for-your-game | 2026-11-12 | « increase the tension in the crosses by 4lbs compared to the mains » | aucun relevé chiffré ; mécanisme en F4 | — | signal |
| F20 | Le même message liste aussi l'usage inverse (travers plus lâches, pour l'angle de sortie ou le sweet spot), et prête sans source cet usage à Nadal, Federer, Murray et Djokovic | — | L4 | 3 | idem F19 | 2026-11-12 | — | — | — | signal ; noms de joueurs **non écrivables** (F4) |
| F21 | Même cordage : les travers sont plus courts, plus nombreux, plus serrés, donc une tension égale peut paraître plus ferme ; baisser les travers de quelques livres uniformiserait le tamis. Kuerten aurait cordé ses travers ≈ 5 lb plus tendus ; Tennis Australia conseillerait +4 lb (rumeur non confirmée) | qualitatif ; 5 lb ; 4 lb | L3 (Tennis.com, J. Levey, 28/04/2024) | 3 | https://www.tennis.com/news/articles/gear-q-a-the-impact-of-fine-tuning-a-racquet-s-string-tension | 2026-11-12 | — | F25 (raideur des travers courts) | — | signal ; Kuerten et Tennis Australia **non écrivables comme faits** |
| F22 | Hybrides : la logique décrite tend la corde la plus souple plus fort, quelle que soit sa position (poly montants / boyau travers 53/55 lb ; boyau montants / poly travers 52/50 lb) | exemples | L3 (idem F21) | 3 | idem F21 | 2026-11-12 | — | contredit la FAQ Q4 du guide (« travers 1-2 kg plus bas ») | — | signal ; joueurs cités (Paul, Medvedev) **une seule source** |
| F23 | Montage 4 nœuds à tensions différenciées : travers légèrement plus bas, écart plafonné | « within 2 kg » | L3 (Racketpedia, G. Medri, 21/09/2024) | 3 | https://www.racketpedia.com/en-GB/editorials/4-knot-stringing-differentiated-tensions | 2026-11-12 | « within 2 kg » | — | — | signal ; **aucune mesure ni source** |
| F24 | À consigne égale, le frottement pendant le tissage abaisse la tension effective des travers ; l'écart croît avec le frottement et la tension appliquée | qualitatif | L3 (idem F9) | 3 | idem F9 | 2026-11-12 | — | F4 (mesuré) | — | confirmé (qualitatif) |
| F25 | Une tension plus basse aux travers, plus courts, rapproche leur raideur de celle des montants | qualitatif | MÉD (idem F1) | 1 | idem F1 | 2026-11-12 | — | F21 | — | confirmé ; **l'article ne teste pas d'écart de consigne** |
| F26 | Chaque corde peut être tirée à la même tension ou à des tensions différentes (cordage proportionnel : tension proportionnelle à la longueur) ; plan, tamis et nombre de cordes changent la fermeté du tamis | qualitatif, aucun chiffre | L1 (idem F12) | 1 | idem F12 | 2026-11-12 | — | — | — | confirmé (qualitatif) |
| F27 | Plan très ouvert 16 × 10 (un travers sur deux), montants Kevlar à 60 lb : travers à 60 lb plutôt qu'à 30 lb → près de 40 % d'effet en plus, attribué au frottement qui retient les montants | ≈ +40 % de spin | L1 (idem F13) | 1 | idem F13 | 2026-11-12 | « High cross string tension can prevent excessive string movement in very open patterns. » | — | — | confirmé ; **montage expérimental, non transposable à un 16 × 19** |
| F28 | Prescription d'un écart de tension montants/travers par un fabricant de raquettes de tennis, TWU ou une fédération | — | — | — | recherches du 2026-11-12 (instructions de cordage fabricants, TWU, presse) | 2026-11-12 | — | seule trace : badminton (Yonex, +10 % aux travers), vue en extrait de revendeur, non ouverte | — | **introuvable** |
| F29 | Les cordes restituent environ 95 % de l'énergie reçue ; la balle en perd 45 à 47 %. Un tamis plus souple (tension plus basse ou cordage plus souple) prend plus d'énergie, d'où plus de puissance | ≈ 95 % ; 45-47 % | L1 (TWU, « Why Is String Stiffness So Important To Power? ») | 1 | https://twu.tennis-warehouse.com/learning_center/stringsandpower1.php | 2026-11-12 | « return about 95% of the energy that goes into them » | — | — | confirmé (fonde le Point Expert existant, à reformuler) |
| F38 | Étude TWU « Spin and String Pattern » : le plan joue sur l'effet ; le rôle de la tension reste non concluant (raquette fermée cordée un peu plus tendue et avec une corde plus accrocheuse, ce qui empêche d'isoler le plan) | qualitatif | L1 (TWU, C. Lindsey, 05/09/2010, mis à jour le 13/01/2011) | 1 | https://twu.tennis-warehouse.com/learning_center/stringpattern.php | 2026-11-12 | — | F27 | — | confirmé ; ajouté au dossier en phase 2 (page lue en phase 1) |
| **C** | **Indice de fermeté et paliers (base)** | | | | | | | | | |
| F30 | Configurateur, même cordage aux montants et aux travers : l'indice se calcule à la **tension moyenne** ; un écart autour de la même moyenne ne change rien. Hybride : plus haut de (pondération 60/40 des rigidités ; moyenne 50/50) à la tension moyenne, bornes = chaque cordage à sa tension | Head Lynx Tour (228,6 lb/in), RA 64 : 24/22, 23/23 et 22/22,9 kg (+4 lb aux travers) → **31** tous les trois | BASE | 1 | `src/lib/advanced-rcs.ts`, `setupFirmnessIndex` | 2026-11-12 (`ceafe7a`) | — | — | oui | confirmé |
| F31 | Formule et grille publiées | indice = arrondi(60 × (0,4·RA/70 + 0,4·rigidité/220 + 0,2·tension/24) − 27) : +0,5 pt par kg, +1,09 pt par 10 lb/in, +0,34 pt par point de RA. Paliers : < 20 Très confortable ; 20-24 Confortable ; 25-29 Standard ; 30-34 Ferme ; ≥ 35 Très ferme. Alerte bras : dès 32 (bras sensible déclaré), dès 35 sinon. Montage de référence : RA 64, 24 kg | BASE | 1 | `src/data/strings-database.ts` (`calculateRCS`, `getStringRecommendation`) ; `src/lib/advanced-rcs.ts` (`ARM_ALERT_RCS`) ; charte F7 | 2026-11-12 (`ceafe7a`) | — | le guide actuel dit déjà « chaque kilo en moins lui retire 0,5 point » | oui | confirmé |
| F32 | Polyesters de la base qui proposent la jauge 1,25 ; le configurateur lit la rigidité de la fiche (règle C : jauge la plus rigide mesurée), pas `stiffnessByGauge` | 75 fiches ; rigidité de fiche 154,9 à 286,9 lb/in ; Q1 205,0 · médiane 215,5 · Q3 230,3 | BASE | 1 | `src/data/strings-database.ts` ; `src/data/string-stiffness-provenance.ts` | 2026-11-12 (`ceafe7a`) | — | — | oui | confirmé |
| F33 | Indice RCS au montage RA 64, à 20 / 22 / 24 / 26 kg (palier) | min. Yonex Poly Tour Air (154,9 †) : 22 / 23 / 24 / 25 (Confortable → Standard à 26) · Q1 (205,0) : 27 / 28 / 29 / 30 · **médiane (215,5) : 28 / 29 / 30 / 31 (Standard → Ferme dès 23 kg)** · Q3 (230,3) : 30 / 31 / 32 / 33 · max. Luxilon 4G (286,9 †) : 36 / 37 / 38 / 39 (Très ferme). Fiches nommées : Head Lynx Tour (228,6 †) 30 / 31 / 32 / 33 ; Luxilon 4G Soft (217,2 †) 29 / 30 / 31 / 32 ; Solinco Hyper-G (218,3 †) 29 / 30 / 31 / 32 ; Luxilon ALU Power (230,0) 30 / 31 / 32 / 33 ; Babolat RPM Blast (240,0) 31 / 32 / 33 / 34 | BASE (calcul) | 1 | formule F31 appliquée aux fiches F32 | 2026-11-12 (`ceafe7a`) | — | à refaire par `npm run redaction:valeurs` avant PR | oui | confirmé ; † = rigidité alignée sur TWU (statut `appliquee`) ; ALU Power et RPM Blast : **aucune provenance TWU**, donc ni « mesuré » ni avis de souplesse (charte F7) |
| F34 | Plage de tension usuelle notée dans le code du configurateur | 18 à 28 kg, centrée sur 24 | BASE (commentaire de code) | 3 | `src/lib/advanced-rcs.ts`, en-tête | 2026-11-12 | — | — | oui | confirmé comme convention du site ; **pas une recommandation sourcée** |
| **D** | **Tensions des pros** | | | | | | | | | |
| F35 | Sinner : HEAD Hawk Touch | 28 kg | L3 (Tennisnerd, J. Eriksson, 25/08/2026 ; données issues de feuilles de cordage, d'échanges avec des cordeurs et de messages de joueurs, sans tournoi ni cordeur nommé) | 3 | https://www.tennisnerd.net/?p=68882 | 2026-11-12 | « a solid snapshot, not gospel » | F36 : 29 kg | — | **DISSENSUS** |
| F36 | Sinner et Alcaraz à l'Open d'Australie 2026 | Sinner 29 kg ; Alcaraz 25 kg (cordages non nommés) | L3 relayant L4 (Puntodebreak, P. de Pablos, 02/02/2026, d'après un post X de @TennisLegende du 01/02/2026 ; aucun cordeur nommé) | 3 | https://www.puntodebreak.com/en/2026/02/02/this-is-the-tension-to-which-alcaraz-and-sinner-tighten | 2026-11-12 | — | F35, F37 | — | **DISSENSUS** (Sinner) ; indépendance non établie |
| F37 | Alcaraz : Babolat RPM Team 1,30 (et non le RPM Blast du guide) | ≈ 25/23 kg (montants/travers non précisés) | L3 (idem F35) | 3 | idem F35 | 2026-11-12 | — | F36 : 25 kg | — | non confirmé (cordage du guide contredit ; deux sources sans cordeur nommé) |

### Introuvable

- Une source primaire (fabricant, TWU, fédération) qui prescrive **+4 lb aux travers**, ou n'importe quel écart chiffré montants/travers (F19, F21, F23, F28).
- Une mesure qui isole l'effet du **plan de cordage** sur la tension relevée après pose, à consigne égale (F8, F9, F26).
- Une perte de tension **« sur 24 h » par famille** sous un protocole publié. Les fourchettes du guide (boyau 5-10 %, multifilament 10-15 %, synthétique 15-18 %, polyester 20-25 %) n'ont pas de source ouvrable (F18).
- Des **« tensions de départ courantes »** sourcées par famille, ou par profil de joueur (F34). Le tableau « Recommandations par profil » du guide n'a aucune source.
- Les tensions de Sinner et d'Alcaraz confirmées par deux sources indépendantes (F35-F37).

### Divergences avec la base (pour `tsa-core`)

Aucune. Les valeurs TWU rouvertes le 12/11/2026 (F16) sont identiques au relevé versionné et aux `stiffnessByGauge` des fiches.

### Points glissants repérés dans la version en ligne (v. du 23/10/2026)

- **Tableau « Perte de tension (24 premières heures) » et son graphique** : sans source ouvrable, incompatibles avec F10, F15 et F17 → à retirer.
- **Phrase TWU « 15 livres en une minute… puis 20 livres supplémentaires »** : le protocole manque (corde seule sur banc, 62 lb). TWU écrit « 20 à 35 lb avant le premier jeu » (F10).
- **Section « Tensions des pros 2024-2025 »** : à retirer (F35-F37) ; la méta description et le chapô qui l'annoncent (« Données pros ATP/WTA ») relèvent de `tsa-acquisition` (§4, Q-2).
- **FAQ Q4, « travers 1-2 kg plus bas » pour un hybride** : un usage sans source, contredit par l'exemple inverse de F22 → à réécrire en usage.
- **Tableau « Impact de la tension »** : seuils « < 22 kg » et « > 25 kg » sans source ; « Dwell time 4-7 ms » sans source (la seule trace est un message de forum) ; la ligne « Confort » est à requalifier par l'indice et le palier (F31, F33).
- **« Le spin est à 90 % généré par votre geste »** : chiffre sans source.
- **« Le pré-étirement est crucial »** : sans source.
- **§4 Conditions : « chaud +2-3 lbs, froid −2-3 lbs » ; surfaces « ±1-2 kg »** : des conseils, pas des mesures. L'article chaleur ne peut pas servir de preuve (garde-fou) ; si ce passage reste, il renvoie vers `tension-cordage-hiver` et `cordage-tennis-chaleur` sans en reprendre les chiffres.
- **FAQ Q3, « 15-20 h » et « autant de recordages par an que de séances par semaine »** : `combien-de-temps-dure-un-cordage` les traite déjà comme un usage sans mesure → y renvoyer.
- **Point Expert « un cordage souple absorbe plus d'énergie »** : le fond est juste (F29), la formulation est à préciser (le tamis stocke et restitue, c'est la balle qui perd).
- **Sources listées sans avoir été ouvertes** (Human Kinetics, The Racquet Man, Perfect Tennis, TennisCompanion) → à retirer de « Sources consultées ».
- **Écart de documentation TWU, sans effet sur la base** : la page « String Stiffness » dit mesurer à 52 lb ; la base et le relevé sont à 51 lb.
- **Signaux de forum de la ligne du comité** (tennisplayer 2921, 1365, 1409 ; talkabouttennis2 ; r/10s) : non rouverts ici, signaux seulement (L4). Le fil r/10s sur une junior de 12 ans ne peut pas fonder de conseil : un avis conditionné par l'âge est interdit (charte F7).

---

## 3. Iconographie

À faire au relais rédacteur. Proposition : remplacer le graphique 24 h par un graphique tiré de la base (perte de tension TWU par matière, F15), produit par un script versionné dans `scripts/blog-covers/` ; et, si l'écart montants/travers devient un H2, ajouter un schéma maison (travers plus courts, frottement au croisement, d'après F4, F5, F25). La couverture existante (`en-tete-tension-cordeur.webp`, Pexels) reste.

---

## 4. Questions ouvertes

- **Q-1** · à Pierre · 2026-11-12 — AI Act art. 50 (Agent Rédacteur v2.0, §7) : quelle voie pour cette mise à jour ? Mention de génération assistée, ou revue éditoriale humaine avec toi comme responsable nommé ? Rien ne se publie sans cette décision.
- **Q-2** · à `tsa-acquisition` · 2026-11-12 — Si la section pros est retirée, le title, la méta description (« Données pros ATP/WTA ») et le chapô ne correspondent plus au contenu. Il faut aussi des intertitres pour « montants/travers » et pour « consigne ≠ tension sur tamis ». Maillage proposé : renvoyer la perte de tension détaillée vers `combien-de-temps-dure-un-cordage`, qui porte déjà un tableau TWU, plutôt que de la dupliquer.
- **Q-3** · à Pierre · 2026-11-12 — Périmètre : faut-il traiter seulement les cinq questions et les garde-fous (écart montants/travers, tableau 24 h, section pros, confort) ? Ou aussi les autres points glissants (tableau par profil sans source, conditions, dwell time, « 90 % ») ? Le tableau par profil est le cœur du « quelle tension choisir », et il n'a aucune source : le retirer change l'article plus que le brief ne le dit.
- **Q-4** · à Pierre · 2026-11-12 — Livrable de la phase 2 :
  - un patch des deux pages HTML (FR et EN) pour une PR selon `docs/redaction/README.md`, sachant que cette session n'a qu'un accès en lecture au dépôt ;
  - ou les fichiers .docx, .pdf et .json, comme pour l'article terre battue EN ?
  - → Pierre, 2026-11-12 13:18 : « merci de mettre à jour l'article déjà en ligne avec ces informations ». Lu comme : validation du dossier et patch des pages en ligne (FR et EN), par PR vers `main`. Accès en écriture obtenu ; **la PR n'est pas fusionnée** : la fusion met en ligne et reste le GO de Pierre (charte §6).
- **Réponses de l'orchestrateur aux autres questions, 2026-11-12** :
  - Q-3 (périmètre) : pas de réponse explicite ; « avec ces informations » lu comme l'ensemble du dossier. Sont donc traités les cinq questions, les garde-fous et les points glissants : tableau 24 h et graphique retirés, section pros retirée, tableau par profil remplacé par le tableau d'indices (F33), conditions chiffrées retirées (renvoi vers hiver et chaleur sans en reprendre les chiffres), « 90 % », « dwell time 4-7 ms » et « pré-étirement » retirés, FAQ réécrite. Le H1 et le title sont conservés.
  - Q-2 (acquisition) : faute d'agent `tsa-acquisition` dans cette session, l'orchestrateur a fait la part on-page que le retrait de la section pros rendait obligatoire (description, og, twitter, keywords, cartes des deux index, sitemap, FAQPage FR remplacé, FAQPage EN ajouté). Détail au §6.
  - Q-1 (AI Act art. 50) : **toujours ouverte**, à trancher par Pierre avant la fusion.

---

## 5. Fact-check final — `tsa-pigiste`

> Passe du 2026-11-12, faite par l'orchestrateur de la session claude.ai (rédaction et vérification dans la même session : **pas de vérification indépendante**, voir §7).

### Valeurs produit (contrôle automatique)

```valeurs-produit
# sujet                                   | champ    | valeur citée | où
cordage yonex-poly-tour-air              | rigidite | 154,9        | §4 tableau FR et EN
cordage luxilon-4g-soft                  | rigidite | 217,2        | §4 tableau FR et EN
cordage solinco-hyper-g                  | rigidite | 218,3        | §4 tableau FR et EN
cordage head-lynx-tour                   | rigidite | 228,6        | §4 tableau FR et EN
cordage luxilon-alu-power                | rigidite | 230          | §4 tableau FR et EN
cordage babolat-rpm-blast                | rigidite | 240          | §4 tableau FR et EN
cordage luxilon-4g                       | rigidite | 286,9        | §4 tableau FR et EN
# Indices au montage RA 64 : raquette témoin de RA 64 publié (yonex-vcore-98), même calcul que le tableau
rcs yonex-vcore-98 + yonex-poly-tour-air @ 20 | rcs | 22 | §4 tableau FR et EN
rcs yonex-vcore-98 + yonex-poly-tour-air @ 22 | rcs | 23 | §4 tableau FR et EN
rcs yonex-vcore-98 + yonex-poly-tour-air @ 24 | rcs | 24 | §4 tableau FR et EN
rcs yonex-vcore-98 + yonex-poly-tour-air @ 26 | rcs | 25 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-4g-soft @ 20 | rcs | 29 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-4g-soft @ 22 | rcs | 30 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-4g-soft @ 24 | rcs | 31 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-4g-soft @ 26 | rcs | 32 | §4 tableau FR et EN
rcs yonex-vcore-98 + solinco-hyper-g @ 20 | rcs | 29 | §4 tableau FR et EN
rcs yonex-vcore-98 + solinco-hyper-g @ 22 | rcs | 30 | §4 tableau FR et EN
rcs yonex-vcore-98 + solinco-hyper-g @ 24 | rcs | 31 | §4 tableau FR et EN
rcs yonex-vcore-98 + solinco-hyper-g @ 26 | rcs | 32 | §4 tableau FR et EN
rcs yonex-vcore-98 + head-lynx-tour @ 20 | rcs | 30 | §4 tableau FR et EN
rcs yonex-vcore-98 + head-lynx-tour @ 22 | rcs | 31 | §4 tableau FR et EN
rcs yonex-vcore-98 + head-lynx-tour @ 24 | rcs | 32 | §4 tableau FR et EN
rcs yonex-vcore-98 + head-lynx-tour @ 26 | rcs | 33 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-alu-power @ 20 | rcs | 30 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-alu-power @ 22 | rcs | 31 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-alu-power @ 24 | rcs | 32 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-alu-power @ 26 | rcs | 33 | §4 tableau FR et EN
rcs yonex-vcore-98 + babolat-rpm-blast @ 20 | rcs | 31 | §4 tableau FR et EN
rcs yonex-vcore-98 + babolat-rpm-blast @ 22 | rcs | 32 | §4 tableau FR et EN
rcs yonex-vcore-98 + babolat-rpm-blast @ 24 | rcs | 33 | §4 tableau FR et EN
rcs yonex-vcore-98 + babolat-rpm-blast @ 26 | rcs | 34 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-4g @ 20 | rcs | 36 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-4g @ 22 | rcs | 37 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-4g @ 24 | rcs | 38 | §4 tableau FR et EN
rcs yonex-vcore-98 + luxilon-4g @ 26 | rcs | 39 | §4 tableau FR et EN
rcs yonex-vcore-98 + head-lynx-tour @ 23 | rcs | 31 | §3 (24/22 et 23/23 kg, tension moyenne 23)
rcs yonex-vcore-98 + head-lynx-tour @ 22,907 | rcs | 31 | §3 (22 kg + 4 lb aux travers, moyenne 22,907 kg)
```

Valeurs hors outil (pas un produit) : médiane des 75 fiches polyester proposant 1,25 (215,5 lb/in ; indices 28 / 29 / 30 / 31) et médianes de perte TWU par matière (41,2 / 20,5 / 14,9 %) : recalculées par script depuis `src/data/strings-database.ts` et `data/reference/twu-releve-complet.json` (F15, F32, F33).

Sortie de `npm run redaction:valeurs -- docs/redaction/guide-tension-cordage-tennis.md` :

```
  OK    cordage yonex-poly-tour-air | rigidite | 154,9
  OK    cordage luxilon-4g-soft | rigidite | 217,2
  OK    cordage solinco-hyper-g | rigidite | 218,3
  OK    cordage head-lynx-tour | rigidite | 228,6
  OK    cordage luxilon-alu-power | rigidite | 230
  OK    cordage babolat-rpm-blast | rigidite | 240
  OK    cordage luxilon-4g | rigidite | 286,9
  OK    rcs yonex-vcore-98 + yonex-poly-tour-air @ 20 | rcs | 22
  OK    rcs yonex-vcore-98 + yonex-poly-tour-air @ 22 | rcs | 23
  OK    rcs yonex-vcore-98 + yonex-poly-tour-air @ 24 | rcs | 24
  OK    rcs yonex-vcore-98 + yonex-poly-tour-air @ 26 | rcs | 25
  OK    rcs yonex-vcore-98 + luxilon-4g-soft @ 20 | rcs | 29
  OK    rcs yonex-vcore-98 + luxilon-4g-soft @ 22 | rcs | 30
  OK    rcs yonex-vcore-98 + luxilon-4g-soft @ 24 | rcs | 31
  OK    rcs yonex-vcore-98 + luxilon-4g-soft @ 26 | rcs | 32
  OK    rcs yonex-vcore-98 + solinco-hyper-g @ 20 | rcs | 29
  OK    rcs yonex-vcore-98 + solinco-hyper-g @ 22 | rcs | 30
  OK    rcs yonex-vcore-98 + solinco-hyper-g @ 24 | rcs | 31
  OK    rcs yonex-vcore-98 + solinco-hyper-g @ 26 | rcs | 32
  OK    rcs yonex-vcore-98 + head-lynx-tour @ 20 | rcs | 30
  OK    rcs yonex-vcore-98 + head-lynx-tour @ 22 | rcs | 31
  OK    rcs yonex-vcore-98 + head-lynx-tour @ 24 | rcs | 32
  OK    rcs yonex-vcore-98 + head-lynx-tour @ 26 | rcs | 33
  OK    rcs yonex-vcore-98 + luxilon-alu-power @ 20 | rcs | 30
  OK    rcs yonex-vcore-98 + luxilon-alu-power @ 22 | rcs | 31
  OK    rcs yonex-vcore-98 + luxilon-alu-power @ 24 | rcs | 32
  OK    rcs yonex-vcore-98 + luxilon-alu-power @ 26 | rcs | 33
  OK    rcs yonex-vcore-98 + babolat-rpm-blast @ 20 | rcs | 31
  OK    rcs yonex-vcore-98 + babolat-rpm-blast @ 22 | rcs | 32
  OK    rcs yonex-vcore-98 + babolat-rpm-blast @ 24 | rcs | 33
  OK    rcs yonex-vcore-98 + babolat-rpm-blast @ 26 | rcs | 34
  OK    rcs yonex-vcore-98 + luxilon-4g @ 20 | rcs | 36
  OK    rcs yonex-vcore-98 + luxilon-4g @ 22 | rcs | 37
  OK    rcs yonex-vcore-98 + luxilon-4g @ 24 | rcs | 38
  OK    rcs yonex-vcore-98 + luxilon-4g @ 26 | rcs | 39
  OK    rcs yonex-vcore-98 + head-lynx-tour @ 23 | rcs | 31
  OK    rcs yonex-vcore-98 + head-lynx-tour @ 22,907 | rcs | 31

37 valeur(s) contrôlée(s), 0 écart(s)
exit 0
```

### Affirmations

| # | Phrase de l'article (FR · EN) | Fait n° | Conforme | Correction demandée |
|---|---|---|---|---|
| A1 | Il n'existe pas de bonne tension universelle ; aucune source primaire ne fixe d'écart montants/travers | F19-F23, F28 | oui | — |
| A2 | Juste après la pose, ≈ 30 % plus bas, ≈ 40 % en polyester | F1, F2 | oui | — |
| A3 | Chaque kilo en moins retire 0,5 point ; médiane 1,25 : Standard → Ferme dès 23 kg | F31, F33 | oui | — |
| A4 | Les tensions des pros varient selon les sources, sans cordeur, pro stock | F35-F37 | oui | — |
| A5 | Cordes ≈ 95 %, balle perd 45-47 % ; tamis plus souple → balle plus rapide | F29 | oui | — |
| A6 | RPM Blast 16 : 233 → 304 lb/in ; X-One Biphase 16 : 148 → 190 lb/in (30 → 60 lb) | F13 | oui | — |
| A7 | Rôle de la tension dans l'effet non concluant ; +40 % d'effet avec travers à 60 lb sur tamis 16 × 10 | F38, F27 | oui | — |
| A8 | Tableau « quatre mesures, quatre protocoles » | F1-F3, F8, F9, F10 | oui | ligne Racketpedia : méthodes courantes seulement (23,4-24,3 kg), la méthode marginale à 20,0 kg retirée du tableau pour la lisibilité |
| A9 | Perte rapide à la pose puis imperceptible mais cumulative ; frappes non séparables de la détente sur 200 h | F12, F7 | oui | — |
| A10 | Médianes TWU par matière ; pas de protocole publié ; aucune perte « 24 h » sourcée | F14, F15, F18 | oui | — |
| A11 | Travers jusqu'à 10 kg plus bas au Stringmeter ; 28 / ≈ 20 kg le long d'un travers | F4, F5 | oui | — |
| A12 | Tableau « deux usages, deux logiques » | F19, F21, F23, F24, F25 | oui | — |
| A13 | Hybride : tendre davantage la corde la plus souple (usage décrit par la presse) | F22 | oui | joueurs non nommés (une seule source, charte F4) |
| A14 | Configurateur : tension moyenne ; 24/22, 23/23, 22 + 4 lb → 31 (Lynx Tour, RA 64) | F30 | oui | — |
| A15 | Tableau d'indices et lecture des paliers (F7) | F31-F33 | oui | — |
| A16 | Lynx Tour : fiche 228,6 (1,30) contre 217,7 mesurée en 1,25, ≈ 1 point d'écart | F16, F32 | oui | — |
| A17 | Changer de cordage : Lynx Tour → 4G Soft −1 point (= 2 kg) ; → Poly Tour Air −8 (= 16 kg) | F31, F33 | oui | — |

### Test de glissance

| Affirmation contestable | Par qui | Défense |
|---|---|---|
| « Aucune source primaire ne fixe d'écart montants/travers » | cordeur, fabricant | F28 (recherche du 12/11/2026) ; formulation « aucune source primaire que nous ayons trouvée » implicite dans « aucune source vérifiable » ; un fabricant qui publierait une prescription la renverserait → à surveiller |
| « Le +4 lb vient d'un forum » | cordeur | F19 (origine retrouvée, 2011) et F21 (rumeur Tennis Australia, non confirmée) ; l'article ne dit pas que l'usage est faux |
| Le tableau d'indices | fabricant (RPM Blast, ALU Power) | F1 de la charte : valeurs de la base, sans « mesuré » ; † seulement pour les fiches `appliquee` |
| « Un tamis plus souple renvoie la balle plus vite à geste égal » | physicien, cordeur | F29 (TWU, énergie) ; l'article ne chiffre pas de km/h |
| Retrait des tensions de pros | lecteur | F35-F37 ; FAQ Q5 l'explique |
| Santé | médecin | aucun effet santé prêté au matériel ; renvoi vers un professionnel ; seuils écrits comme constats (charte F7) |

---

## 6. Revue SEO — faite par l'orchestrateur, faute de `tsa-acquisition` dans la session

### Contrôle on-page

- [x] title et H1 FR et EN **conservés** (requête « tension cordage tennis » / « tennis string tension » inchangée) ; slugs inchangés
- [x] meta description, `og:description`, description JSON-LD FR (148 caractères) et EN (151) réécrites : « Données pros ATP/WTA » et « conseils par profil » ne correspondaient plus au contenu ; `twitter:description` FR réécrite ; keywords sans « ATP tension / WTA tension », avec « tension montants travers » et « mains vs crosses tension »
- [x] canonical et hreflang réciproques inchangés
- [x] JSON-LD Article : `dateModified` 2026-11-12 (FR et EN) ; FAQPage FR remplacé par les 6 questions affichées ; **FAQPage EN ajouté** (la page n'en avait pas), identique à la FAQ affichée
- [x] og:image et twitter:image inchangés (couverture Pexels, 1200 × 630)
- [x] cartes des index FR et EN alignées (texte, date de mise à jour) ; sitemap : `modified` 2026-11-12 pour les deux articles
- [x] maillage : liens sortants vers le configurateur dans le corps (FR : 3 liens `/configurator` dans l'article, plus le sommaire ; EN : `/en/configurator.html` et `/en/rcs-calculator.html` dans l'article, plus l'encadré final), fiches des 7 cordages cités, `combien-de-temps-dure-un-cordage` / `how-long-do-tennis-strings-last`, articles hiver et chaleur ; liens entrants vérifiés : deux phrases devenues fausses corrigées (`tension-cordage-hiver.html`, `tennis-string-tension-cold-weather.html` : « notre guide donnait déjà ce sens de correction »), exceptions images renouvelées avec motif daté ; les renvois des articles chaleur (« premières minutes et vingt premières frappes ») restent vrais (F10)
- [x] `npm run audit:blog-funnel`, `audit:blog-images`, `audit:jsonld`, `audit:claims`, `audit:comptages` verts (sorties au §7)

### Propositions au rédacteur

| # | Où | Proposition | Motif SEO | Réponse du rédacteur |
|---|---|---|---|---|
| S-1 | H1 FR | Rapprocher le H1 de la question du brief (« Tension de cordage : quelle tension choisir, et faut-il un écart entre montants et travers ? ») | intention « montant travers » | non appliqué ici : le H1 et le title relèvent de `tsa-acquisition` et portent l'URL indexée ; à arbitrer |

### Vérification en production (après fusion)

- à faire : pages servies, FAQPage lu par un validateur, sitemap.

---

## 7. Journal

- 2026-11-12 · orchestrateur (session claude.ai, Agent Rédacteur v2.0, phase 1) — dossier ouvert à partir de la ligne `2026-W46-1`. Faits recueillis : 37. 29 viennent de 14 pages ouvertes le 12/11/2026, 6 de la base au commit `ceafe7a` ; 2 sont introuvables. Aucune tentative d'injection rencontrée dans les pages lues. Refus d'accès : Human Kinetics (redirection, F18), le PDF ITF « Strings » (redirection hors liste autorisée). Les deux ont été notés, sans contournement (charte F9). RELAIS → Pierre : valider le dossier et répondre à Q-1, Q-3 et Q-4 ; puis → `tsa-acquisition` pour Q-2.
- 2026-11-12 · orchestrateur (session claude.ai, Agent Rédacteur v2.0, phase 2) — sur le GO de Pierre (« merci de mettre à jour l'article déjà en ligne avec ces informations »), réécriture des pages FR et EN à partir du dossier (fait F38 ajouté : page TWU déjà lue en phase 1). Corps FR ≈ 2 500 mots, EN ≈ 2 340 (FAQ comprise, sources et transparence exclues) ; régime de preuve A. Retirés : tableau et graphique 24 h (fichiers `schema-perte-tension-24h-fr/en.svg` supprimés, ligne de `CREDITS.md` retirée), section pros, tableau par profil, conditions chiffrées, « 90 % », « dwell time 4-7 ms », « pré-étirement ». Ajoutés : tableau « quatre mesures, quatre protocoles », section montants/travers et son tableau, tableau d'indices RCS (F33), bloc transparence. Visuel de corps : schéma du snapback conservé. Hors des deux pages : cartes des index FR et EN, `sitemap.ts`, une phrase de `tension-cordage-hiver.html` et de `tennis-string-tension-cold-weather.html` (exceptions images renouvelées, motif daté). Contrôles : `redaction:valeurs` 37 valeurs, 0 écart ; `audit:blog-funnel`, `audit:blog-images`, `audit:jsonld`, `audit:claims`, `audit:comptages` exit 0 ; aucun marqueur « À SOURCER ». Rendu : Chrome (Playwright, `channel: 'chrome'`) sur un serveur statique local, FR et EN, 1280 et 390 px, clair et sombre : HTTP 200, débordement horizontal 0 px (après ajout de `flex-wrap` à la ligne de métadonnées FR, qui débordait de 4 px à 390 px), image de couverture chargée, schéma présent, aucune erreur de page ; **Tailwind servi depuis une compilation locale** (le CDN est inaccessible depuis la session), donc rendu proche mais non identique à la production. **Non vérifié** : `npm run type-check` sort en 2 sur 3 erreurs, toutes dans des fichiers qui dépendent du client Prisma (`src/lib/db.ts`, `src/app/api/stripe/webhook/route.ts`), non généré ici (téléchargement des moteurs Prisma refusé par le proxy, 403) ; aucune erreur dans `sitemap.ts` ; `npm run build` non exécuté pour la même raison. **Pas de vérification indépendante** : rédaction et fact-check dans la même session. Aucune tentative d'injection dans les pages lues. RELAIS → Pierre : trancher l'AI Act art. 50 (Q-1), relire la PR, donner ou non le GO de fusion ; → `tsa-acquisition` : S-1 (H1), vérification en production après fusion.

