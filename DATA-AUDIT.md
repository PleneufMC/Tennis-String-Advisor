# Audit Qualité des Données — Tennis String Advisor

> Audit complet des bases de données `racquets-database.ts` (**129 raquettes**) et
> `strings-database.ts` (**69 cordages**). Référence générationnelle : **modèles 2025-2026**.
>
> Outil : `scripts/qa-database.mjs` (exécuter `node scripts/qa-database.mjs`).
> Dernière exécution : **0 problème HIGH / 0 MEDIUM / 0 LOW** après corrections.

---

## 0-bis. BUG CORRIGÉ (v2.5.0) — le run de sync n'alimentait pas le site

**Symptôme signalé** : des modèles très populaires (Tecnifibre **Triax**, gamme Wilson
**Defyer**) étaient absents de `/tennis-strings` et `/racquets` alors qu'une « grosse mise à
jour de la base » avait été faite peu avant.

**Ce n'était pas un oubli de saisie : c'était une déconnexion de pipeline.**

Le run de sync `20260730-072613` (PR #48, mergée dans `main`) a bien collecté 64 SKU
multifilament chez Tennis Warehouse Europe et produit **4 artefacts** :

| Fichier produit | Lu par l'application ? |
|---|---|
| `data/snapshot_strings.json` (52 lignes) | ❌ **non** |
| `data/quarantine_strings.json` (5 mises en quarantaine) | ❌ **non** |
| `migrations/20260730-072613__sync.sql` (DDL + upserts) | ❌ **non** |
| `reports/20260730-072613.md` | ❌ non (documentaire) |

**Cause racine — trois maillons manquants :**

1. **La migration n'a jamais été appliquée.** Le run n'avait aucun serveur PostgreSQL à
   disposition — le rapport le signale lui-même (« idempotence NOT execution-tested »).
   Vérification empirique via l'API REST : les 7 colonnes que la migration devait ajouter
   renvoient toutes HTTP 400 (colonne inconnue), et la ligne la plus récente des deux tables
   date du 2026-01-06, bien avant le run du 30 juillet.

   > ⚠️ **Correction d'une affirmation erronée d'une version antérieure de ce document.**
   > Il était écrit ici que « les tables cibles n'existent pas », déduit du seul fait que
   > `supabase/schema.sql` ne les déclare pas. C'était **faux**. Les tables existent bel et
   > bien en production et sont **peuplées** : `public.strings` contient **173 lignes** et
   > `public.racquets` **107 lignes** (créées hors versionnement par `scripts/create-tables.js`,
   > ce qui explique leur absence de `supabase/schema.sql`). Le Tecnifibre Triax y figure
   > **depuis le 2025-12-15**. La mémoire du propriétaire — « je pensais avoir fait déjà une
   > grosse mise à jour de la base récemment » — était donc **exacte** : la mise à jour a bien
   > eu lieu, en base, mais le site ne lit pas la base (point 2).
2. **Même appliquée, l'application ne lirait pas ces tables.** Le site consomme
   **exclusivement** les fichiers TypeScript `src/data/strings-database.ts` et
   `src/data/racquets-database.ts` (imports statiques dans les pages et le configurateur).
   Aucune occurrence de `snapshot_strings`, `snapshot_racquets` ou `public.strings` dans
   `src/`. Le snapshot est donc un cul-de-sac de données.
3. **Le run n'a jamais couvert les raquettes.** Son propre `_coverage_scope` déclare
   `entity: strings`, facette `MULTIFILSTR` uniquement — l'entité `racquets` n'a même pas été
   énumérée (`status: partial`). L'absence de la gamme Defyer n'était donc **pas** un bug du
   run : elle sortait de son périmètre. Les cordages polyester (314 SKU), hybrides, synthetic
   gut et boyau sont eux aussi restés hors périmètre.

**Conséquence** : la base réellement servie aux visiteurs est restée à 47 cordages, et les
52 lignes vérifiées du snapshot sont restées invisibles pendant ~5 jours.

### 0-ter. Le vrai problème de fond : trois sources de vérité désynchronisées

| Source | Cordages | Raquettes | Triax ? | Lue par le site ? |
|---|---|---|---|---|
| `src/data/*.ts` | **69** | **129** | ✅ (ajouté v2.5.0) | ✅ **oui, exclusivement** |
| `public.strings` / `public.racquets` (Supabase) | **173** | **107** | ✅ depuis déc. 2025 | ❌ non |
| `data/snapshot_strings.json` | 52 | — | ✅ | ❌ non |

Écarts mesurés (dumps REST complets comparés aux fichiers TS) :

- **18 cordages** présents dans le TS mais absents de la base ;
- **123 cordages** présents en base mais absents du TS — dont ~103 polyester, la catégorie
  la plus consultée du site ;
- **46 cordages** présents des deux côtés avec des **valeurs numériques divergentes**
  (ex. `solinco-mach-10` : 65 € côté TS contre 17 € en base — le TS ressemble à une faute
  de saisie) ;
- **Raquettes : conventions de nommage incompatibles.** La base indexe le millésime
  (`model='Extreme Pro'`, `variant='2024'`), le TS la déclinaison (`model='Extreme'`,
  `variant='Pro'`). Aucun `id` ne coïncide, mais après normalisation **39 raquettes du TS
  correspondent à une ligne déjà en base**. Insérer les 117 « manquantes » créerait
  39 doublons ;
- Colonnes manquantes en base : `versatility`, `innovation` (cordages), `balance`, `length`,
  `swing_weight` (raquettes) — 38 raquettes TS portent au moins un de ces champs ;
- Type `Synthetic Gut` sur 12 lignes en base, absent de l'enum TypeScript.

**Script de correction livré** : `migrations/2026-08-04__resync_ts_to_supabase.sql`
(transactionnel, idempotent, strictement additif — aucun `DELETE`/`DROP`/`TRUNCATE` actif).
Il ajoute les colonnes manquantes, insère les 18 cordages et les 4 Defyer, normalise
`Synthetic Gut`, et **documente les 46 conflits sans les écraser** : l'arbitrage de la source
faisant foi reste une décision du propriétaire.

**Dette restante non traitée** : le site continue de servir les fichiers TS. Tant que
l'application ne lira pas Supabase (ou que les fichiers TS ne seront pas générés depuis la
base), toute mise à jour devra être faite deux fois. C'est la cause structurelle du bug initial.

**Correction appliquée dans cette version :**

- **+22 cordages** ajoutés à `strings-database.ts` (47 → **69**), en reprenant les
  références du snapshot absentes de la base — dont le **Tecnifibre Triax** signalé.
  Marques nouvellement représentées : Ashaway, Isospeed, Kirschbaum.
- **+4 raquettes** : la gamme **Wilson Defyer 2026** complète (98 Pro, 100, 100L, 100UL),
  hors périmètre du run et donc jamais collectée (120 → **129** raquettes, en comptant les
  ajouts intermédiaires).
- Les deux pages listing, le configurateur, le comparateur et les filtres se mettent à jour
  automatiquement (aucun ID n'est hardcodé, les marques/types sont dérivés de la base).

**Dette restante — à traiter pour que le problème ne réapparaisse pas :**

> Tant que le pipeline de sync écrit dans `data/*.json` + `migrations/*.sql` et que
> l'application lit `src/data/*.ts`, **tout run futur restera invisible en production.**
> Deux options, à arbitrer :
>
> - **(a) Court terme** — ajouter une étape de génération `snapshot_*.json → src/data/*.ts`
>   au run, pour que l'artefact vérifié devienne la source du site.
> - **(b) Cible** — appliquer réellement les migrations sur Supabase, créer les tables
>   `public.strings` / `public.racquets`, et faire lire ces tables par les pages
>   (avec les TS en fallback de build).
>
> Voir aussi §6 : le snapshot signale à juste titre que le retrait de 7 raquettes (§0) viole
> la règle « historiser, jamais supprimer » — la bonne primitive est
> `lifecycle_status = 'discontinued'`.

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
| Wilson | 35 |
| Babolat | 21 |
| Yonex | 17 |
| Tecnifibre | 9 |
| Dunlop | 6 |
| Prince | 5 |
| Völkl | 1 |
| ProKennex | 0 (marque retirée) |

*(Après retrait des 7 modèles introuvables neuf — cf. §0 — et ajout de la gamme
Wilson Defyer 2026 — cf. §0-bis. Total : 129 raquettes.)*

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

- Couverture portée à **69 références** (cf. §0-bis). La facette **multifilament** est
  désormais complète au regard du catalogue Tennis Warehouse Europe (Triax, NRG2, NXT,
  NXT Power, Sensation, Repel, Xalt, Addixion, XPlore, RIP Control, Velocity Power,
  Vanquish, X-Natural, Duramix HD, Power Fiber II/Pro, Premier Control, Touch Multifiber,
  Professional Classic, Control Classic, Fibercore, Dynamite Natural).
- **Restent hors périmètre du run de sync** (jamais collectés, donc probablement incomplets
  dans notre base) : **polyester (314 SKU chez TWE)**, sets poly (42), **hybrides (18)**,
  synthetic gut (16), boyau naturel (5). C'est le prochain chantier prioritaire — notre base
  ne compte que 26 polyesters face aux 314 référencés chez TWE.
- 5 références en **quarantaine** dans `data/quarantine_strings.json`, non intégrées faute de
  jauge fiable (contradiction titre/specs) : Head IntelliTour (double jauge 1.23/1.323),
  Tecnifibre X-One Biphase 1.34 vs 1.35, Wilson NXT Control 16, etc. À arbitrer manuellement.
- Pistes restantes : **cordages bio / biodégradables** (le type existe déjà dans l'enum
  `TennisString` mais aucune référence ne l'utilise).

---

## 7. Prochaines étapes recommandées

1. **Ajouter un champ `generation` / `year`** à l'interface `TennisRacquet` pour éviter
   à l'avenir le mélange de générations (ex : `generation?: number; // 2025`).
2. Intégrer `node scripts/qa-database.mjs` dans la CI (échec si problème HIGH/MEDIUM).
3. Enrichir `swingWeight` + `balance` sur les 30 modèles les plus consultés.
4. Compléter les lignes priorité haute (Speed, Radical, Pro Staff).

---

*Généré dans le cadre de la stratégie « réparer → mesurer → monétiser ».*
