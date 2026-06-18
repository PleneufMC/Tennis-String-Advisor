# Audit Qualité des Données — Tennis String Advisor

> Audit complet des bases de données `racquets-database.ts` (**120 raquettes**) et
> `strings-database.ts` (47 cordages). Référence générationnelle : **modèles 2025**.
>
> Outil : `scripts/qa-database.mjs` (exécuter `node scripts/qa-database.mjs`).
> Dernière exécution : **0 problème HIGH / 0 MEDIUM / 0 LOW** après corrections.

---

## 0. Retraits commercialisation (v2.4.2)

Politique : **retirer les modèles introuvables à l'achat neuf** (pertinence affiliation —
inutile de lier vers un produit que le visiteur ne peut pas acheter neuf). Vérification
croisée via catalogues fabricants + grands revendeurs (Tennis Warehouse, Tennis-Point).

**7 raquettes retirées** (générations 2019-2021 non renouvelées, plus distribuées neuf en France) :

| ID retiré | Modèle | Motif |
|-----------|--------|-------|
| `tecnifibre-tflash-300` | Tecnifibre TFlash 300 | Gamme 2019 (CES), arrêtée — remplacée par Tempo/TFight |
| `tecnifibre-tflash-285` | Tecnifibre TFlash 285 | idem |
| `volkl-v-cell-v1-pro` | Völkl V-Cell V1 Pro | Modèle 2021, gamme remplacée (V8/V-Feel), quasi absent du marché FR |
| `prince-twistpower-x100` | Prince Twistpower X100 | Modèle 2021, ligne non renouvelée (déstockage résiduel US) |
| `prince-twistpower-x105` | Prince Twistpower X105 | idem |
| `prokennex-ki-q-tour-pro` | ProKennex Ki Q+ Tour Pro | Modèle 2021, remplacé par Black Ace 2025/26 ; introuvable neuf FR |
| `prokennex-ki-q-5` | ProKennex Ki Q+ 5 | idem |

**Conservés** (vérifiés encore vendus neuf, malgré leur ancienneté) :
Wilson Hyper Hammer 5.3 (vendu par Wilson), Head Ti.S6 (catalogue TW),
Head Prestige Classic (trouvable), Wilson Burn 100LS (v5/v6 actifs).

> Impact technique : aucun ID raquette n'est hardcodé dans les pages dynamiques
> (configurateur, comparateur, listing, stats consomment la base par filtres/`.find`).
> Les compteurs et filtres s'ajustent automatiquement. Base 127 → **120 raquettes**.

---

## 1. Méthodologie

Le script QA transpile les fichiers de données TypeScript et applique des règles
de validation :

- **Champs requis** présents (id, brand, model, variant, weight, headSize…).
- **Doublons d'`id`**.
- **Bornes physiques** réalistes, distinctes adultes / juniors / Power-Light :
  - Adultes : poids 250-360 g (220-360 pour Power/Light), tamis 85-125 in², RA 50-75, longueur 26.5-29".
  - Juniors : poids 150-280 g, tamis 78-110 in², longueur 19-27".
- **Plans de cordage** : format `NNxNN`, valeurs connues, cohérence tamis↔plan
  (un grand tamis ≥105 in² avec un plan très dense 18x20 est signalé), montants ≤ travers
  (sauf exception « Spin Effect » Wilson Burn 100LS, légitime).
- **Cordages** : type dans l'enum, rigidité 60-280 lb/in, notes 0-10, tension min ≤ max
  et plage réaliste (~17-32 kg), jauges au format `1.25` ou hybride `1.25/1.30`.

---

## 2. Corrections appliquées (v2.4.1)

### 2.1 Gamme Head Gravity — alignement génération 2025

La gamme mélangeait des specs 2023 et 2025. Référence retenue : **Gravity 2025**
(sources : HEAD officiel, Tennis Warehouse, Tennisnerd). Poids = **non cordé**.

| Modèle | Tamis | Poids | Plan | RA | Statut |
|--------|-------|-------|------|----|--------|
| Pro    | 100   | 315 g | 18x20 | 59 | déjà correct |
| Tour   | 98    | 305 g | **16x19** | 59 | corrigé (était 18x20) |
| MP     | 100   | 295 g | **16x20** | **57** | corrigé (était 18x20 / RA 59) |
| Team   | 104   | 285 g | 16x20 | 60 | déjà correct |
| MP L   | 100   | 280 g | **16x20** | 57 | corrigé (était 18x20) |

Descriptions mises à jour pour mentionner explicitement la génération 2025 et l'Auxetic 2.0.

### 2.2 Raquettes junior Wilson — `stringPattern` manquant

7 raquettes junior pré-cordées n'avaient aucun plan de cordage. Ajout des plans
standards par taille de cadre (cohérents avec les juniors Babolat/Head de la base) :

| Raquette | Plan ajouté |
|----------|-------------|
| Wilson US Open Junior 19" | 16x17 |
| Wilson US Open Junior 21" | 16x17 |
| Wilson US Open Junior 23" | 16x18 |
| Wilson US Open Junior 25" | 16x18 |
| Wilson Roger Federer Junior 21" | 16x17 |
| Wilson Roger Federer Junior 23" | 16x18 |
| Wilson Roger Federer Junior 25" | 16x18 |

---

## 3. Faux positifs analysés (aucune correction nécessaire)

Ces points ont été examinés et confirmés **corrects** — la donnée est juste :

- **Wilson Burn 100LS v5 — plan 18x16** : design « Spin Effect » volontaire de Wilson
  (montants > travers). Légitime → whitelisté dans le script.
- **Raquettes Power ultra-légères** (Head Instinct PWR 115 = 230 g, Head Ti.S6 = 225 g,
  Wilson Hyper Hammer 5.3 = 240 g) : raquettes débutants, poids réellement bas et corrects.
- **Wilson Champion's Choice — jauge `1.25/1.30`** : cordage hybride (boyau + ALU Power),
  notation à deux jauges normale.
- **Raquettes junior** : poids/longueur/tamis/SW réduits = normaux par nature.

---

## 4. Complétude des champs optionnels (information)

Champs optionnels souvent absents (non bloquants pour le configurateur actuel,
mais axes d'enrichissement futur) :

| Champ | Absent sur |
|-------|-----------|
| swingWeight | 118 / 127 raquettes |
| length      | 100 / 127 raquettes (27" par défaut implicite) |
| balance     | 100 / 127 raquettes |
| stiffness (RA) | 27 / 127 raquettes (souvent ND constructeur) |

**Recommandation** : enrichir progressivement `swingWeight` et `balance` sur les
modèles phares (meilleure pertinence des recommandations cordage/tension).

---

## 5. Couverture catalogue par marque

| Marque | Modèles |
|--------|---------|
| Head | 35 |
| Wilson | 26 |
| Babolat | 21 |
| Yonex | 17 |
| Tecnifibre | 9 |
| Prince | 5 |
| Dunlop | 6 |
| Völkl | 1 |
| ProKennex | 0 (marque retirée) |

*(Après retrait des 7 modèles introuvables neuf — cf. §0.)*

---

## 6. Produits manquants — pistes d'enrichissement (2024-2026)

Lignes **incomplètes** ou modèles populaires absents repérés lors de l'inventaire.
À prioriser selon le trafic et l'intérêt commercial (affiliation).

### Priorité haute (modèles à fort volume)

- **Wilson Pro Staff** : la **Pro Staff Six.One / 97 v14** est présente, mais il manque
  la **Pro Staff 97UL** et surtout la déclinaison historique **RF97** (si distincte).
- **Babolat Pure Strike** : génération **Gen4 (2024)** — vérifier que les specs sont à jour
  (la base liste 98 16x19, 98 18x20, 100, 100 16x20, Team : OK pour la couverture).
- **Yonex VCore / EZONE** : génération **2025** sortie — confirmer que VCore (95/98/100)
  et EZONE (98/100) sont bien sur les specs 2025.
- **Head Speed** : ligne adulte réduite (MP, Elite, Legend Pro). Manquent **Speed Pro**,
  **Speed Team**, **Speed MP L** (génération 2024 Auxetic 2.0).
- **Head Radical** : manque **Radical MP L** (présent : MP, Pro, Team, Team L, Junior 26").

### Priorité moyenne

- **Babolat Pure Aero** : génération **2023** complète, mais manque **Pure Aero 98**
  variante VS / **Pure Aero+** (longueur 27.5").
- **Dunlop** : lignes CX/FX/SX réduites à 2 variantes chacune — manquent les versions
  **Tour**, **LS**, **Team** selon les gammes.
- **Tecnifibre TF40 / TFight** : compléter avec **TFight 255/270** (versions légères).
- **Wilson Clash v3 (2024)** : vérifier la génération (base liste « V3 »/« v2 » mélangés).

### Priorité basse (niche)

- **Prince** : catalogue restreint (Ripcord, Ripstick, Twistpower, Warrior).
- **Völkl / ProKennex** : 1-2 modèles chacun (marques de niche, faible trafic FR).

### Cordages

- Couverture solide (47 références, top marchés). Pistes : ajouter quelques
  **multifilaments confort** récents et **cordages bio** (segment en croissance).

---

## 7. Prochaines étapes recommandées

1. **Ajouter un champ `generation` / `year`** à l'interface `TennisRacquet` pour éviter
   à l'avenir le mélange de générations (ex : `generation?: number; // 2025`).
2. Intégrer `node scripts/qa-database.mjs` dans la CI (échec si problème HIGH/MEDIUM).
3. Enrichir `swingWeight` + `balance` sur les 30 modèles les plus consultés.
4. Compléter les lignes priorité haute (Speed, Radical, Pro Staff).

---

*Généré dans le cadre de la stratégie « réparer → mesurer → monétiser ».*
