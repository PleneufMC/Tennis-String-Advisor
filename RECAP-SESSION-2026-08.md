# Récapitulatif des travaux — tennisstringadvisor.org

**Période couverte :** 4 août → 8 août 2026
**Branche de travail :** `genspark_ai_developer` → `main`
**Pull requests :** #49, #50, #51, #52, #53 (toutes fusionnées)

Les dates et chiffres de ce document sont issus de l'historique Git et des
sorties d'audit réelles, pas de mémoire.

---

## 1. Vue d'ensemble

| Date | PR | Livraison | Verdict |
|---|---|---|---|
| 4 août | #49 | Le run de synchronisation n'alimentait pas le site (+22 cordages, +4 raquettes) | ✅ Résolu |
| 4 août | #50 | Script SQL de resynchronisation TS → Supabase | ⚠️ **Mauvaise direction** (voir §3) |
| 7 août | #50 | Mode sombre réel sur les 5 pages en styles inline + `qa-contrast` | ⚠️ Incomplet (2 reprises) |
| 7 août | #51 | Fusion Supabase → TS : 69 → 190 cordages | ✅ Résolu |
| 8 août | #52 | Textes invisibles restants + garde-fou d'héritage | ⚠️ Incomplet (défaut introduit) |
| 8 août | #53 | Texte jaune sur fond jaune + garde-fou AST | ✅ Résolu, **validation visuelle en attente** |

> La PR #50 est restée ouverte du 4 au 7 août et regroupe donc deux sujets
> distincts : le script SQL du 4 août et le mode sombre du 7 août
> (commits `f02c9e5`, `f8cb69e`, `a5118af`).

**Trois des six livraisons ont nécessité une reprise.** Le détail est en §7,
car ces reprises sont plus instructives que les succès.

---

## 2. Base de données : de 69 à 190 cordages

### 4 août — La synchronisation n'atteignait pas les visiteurs (PR #49)

Un run de synchronisation antérieur (`20260730-072613`) avait été fusionné,
mais les produits n'apparaissaient pas sur le site. Cause : le site lit les
fichiers TypeScript, or le run n'avait alimenté que la base Supabase.

**Livré :** +22 cordages (dont la gamme Triax) et +4 raquettes Defyer dans
`strings-database.ts` / `racquets-database.ts`. 620 lignes ajoutées.

### 7 août — Fusion Supabase → TypeScript (PR #51)

**121 nouveaux cordages réels importés : 69 → 190.**

Trois vérifications ont conditionné cette importation :

**Les unités de tension.** Avant d'importer quoi que ce soit, il fallait
établir si `tension_min/max` de Supabase était en kg ou en livres — une erreur
aurait faussé les recommandations de tous les cordages importés. Comparaison
sur les 51 identifiants communs : ratio **1,005** (jamais 2,2). 173 valeurs sur
173 plausibles en kg, **0 en livres**. La rigidité est sur la même échelle
lb/in des deux côtés. **Aucune conversion nécessaire** — conclusion établie par
la mesure, pas supposée.

**L'abandon des expressions régulières.** Mon analyseur par regex trouvait 68
entrées TypeScript sur 69 — d'où un décompte erroné de « 123 nouveaux
produits » que j'ai annoncé avant correction. Passage à une **transpilation par
`tsc`** : 122 produits absents par identifiant, moins 1 doublon réel
(`signum-pro-xperience` = `signum-pro-x-perience`) = **121 produits réels**.

**Le champ `versatility`.** J'avais affirmé qu'il n'était utilisé nulle part.
**C'était faux** : mon `grep` excluait le fichier lui-même. `tsc` a levé
l'erreur `TS18048: 's.versatility' is possibly 'undefined'`. Sans le test
`=== undefined` ajouté, **les 121 cordages importés auraient été
silencieusement exclus** des recommandations pour les joueurs intermédiaires.

### Garanties du script `scripts/merge-db-to-ts.mjs`

| Garantie | Mise en œuvre |
|---|---|
| Additif uniquement | Aucune écriture sur un produit existant |
| Idempotent | Filtre sur `id` **et** sur `marque+modèle` normalisés |
| Unités vérifiées | Assertions **avant** écriture, arrêt si échec |
| Réversible | Sauvegarde `.ts.bak` |
| Vérifié après coup | Relecture du fichier écrit |
| Simulation | `--dry-run` |

```bash
node scripts/merge-db-to-ts.mjs --dry-run   # simulation
node scripts/merge-db-to-ts.mjs             # exécution
```

### Décision que vous avez arbitrée

Les champs `versatility` et `innovation` sont **absents du schéma Supabase**.
Vous avez retenu l'**option A** : les rendre optionnels et les omettre, plutôt
que de leur attribuer une moyenne calculée. **Aucune donnée inventée** n'a été
introduite dans la base.

---

## 3. Le script SQL du 4 août : une erreur de direction que vous avez relevée

Le 4 août, j'ai livré `migrations/2026-08-04__resync_ts_to_supabase.sql`
(737 lignes) synchronisant **TypeScript → Supabase**.

Vous avez posé la question : *« ne devrait-on pas merger la base de données SQL
avec un script ? »* — en mettant en cause la **direction** du transfert.

**Vous aviez raison.** Vérification faite : **0 référence** à `public.strings`
ou `from('strings')` dans tout `src/`. Le site lit exclusivement les fichiers
TypeScript. Écrire vers Supabase **ne peut donc rien changer pour un
visiteur**. J'avais livré un script techniquement correct et fonctionnellement
inutile.

D'où la PR #51, qui va dans le sens inverse — le bon.

---

## 4. Lisibilité mobile : trois rounds sur le même problème

### La cause racine

Le `<body>` porte `dark:text-slate-100`. En thème sombre, **tout texte sans
couleur propre** hérite d'un blanc cassé. Si son conteneur impose un fond clair
**codé en dur**, on obtient du blanc sur blanc : **1,10:1**, invisible.

Ce n'était **ni une police, ni un problème propre au mobile** : simplement le
thème sombre du système, actif par défaut sur beaucoup de téléphones. Votre
signalement initial parlait de « police illisible » — le symptôme était bien
réel, la cause était ailleurs.

### 7 août — Round 1 (PR #50)

Cinq pages sont écrites en **styles inline**, qui ne peuvent pas porter de
variante `dark:` de Tailwind. Mise en place de **variables CSS basculant sous
`.dark`** : `--surface-*`, `--text-*`, `--tint-*`. Création de
`scripts/qa-contrast.mjs`.

### 8 août — Round 2 (PR #52)

Vous avez demandé : *« as-tu réglé mon souci de police illisible sur version
mobile ? »*

**Le correctif était incomplet.** Cas non traités découverts :

- **`ui/input.tsx` et `ui/select.tsx`** — les composants de base de **tous les
  champs du site** (recherche, formulaires, connexion). La saisie de
  l'utilisateur était invisible en thème sombre. C'était le plus grave.
- Deux `<select>` de tri, et un `<h2>` « Filtres » que j'avais **écarté à tort
  comme faux positif** (la page contient deux libellés « Filtres » : un bouton
  correct et ce titre sans couleur).
- Trois `text-gray-400` préexistants (2,54:1) relevés en `text-gray-500` (4,83:1).

**Le garde-fou livré ne fonctionnait pas.** J'ai réintroduit volontairement un
défaut pour le tester : il n'a **rien détecté**. Trois bugs corrigés avant
livraison (traitement de la couleur du `<body>`, commentaires HTML de Next.js,
asymétrie d'empilage). Livré seulement après validation détection → sortie 1 et
restauration → sortie 0.

### 8 août — Round 3 (PR #53)

Vous avez signalé : *« "journal synchronisé" en jaune sur jaune : ce n'est pas
malin... »*

**Défaut que j'avais introduit moi-même**, et le piège exactement symétrique du
précédent : j'avais converti le **texte** en variable en laissant le **fond**
en dur.

```jsx
color: 'var(--tint-amber-fg)',                           // bascule
background: 'linear-gradient(135deg, #fef3c7, #fde68a)', // ne bascule PAS
```

En thème sombre `--tint-amber-fg` vaut `#fde68a` — **exactement** l'arrêt du
dégradé resté en dur. **1,00:1.**

**L'audit a révélé cinq encarts illisibles, pas un :**

| Emplacement | Encart | Sombre |
|---|---|---|
| configurator | RCS bleu | 1,00:1 |
| configurator | RCS avancé | 1,02:1 |
| configurator | journal vert (connecté) | 1,00:1 |
| configurator | **journal jaune — celui que vous avez vu** | **1,00:1** |
| payment-success | avantages Premium | 1,16:1 |

Plus le badge **PREMIUM** (1,00:1) et les libellés de `/statistics`.

**Deux défauts préexistants découverts au passage :**

- un `rgba(255,255,255,0.5)` codé en dur délavait le fond sombre d'une
  pastille → variable `--tint-inset` ;
- `#eab308` sur pastille bleue ne donnait que **1,57:1 même en thème clair** →
  variables `--state-{good,warn,bad}`.

---

## 5. Un point que je dois signaler clairement

**`audit:contrast` sortait en succès pendant que cinq encarts étaient à
1,00:1.**

Il ne vérifie que les paires **déclarées** dans `globals.css`
(`--tint-amber-bg` face à `--tint-amber-fg`). Ces paires étaient correctes. Ce
sont les paires **réellement employées dans le JSX** qui ne l'étaient pas.

Mon garde-fou du round 2 ne le voyait pas davantage : il détecte le blanc
*hérité* sur fond clair, pas deux couleurs identiques explicitement posées.

**Deux contrôles verts, et le défaut visible à l'œil nu sur votre écran.**
C'est précisément le reproche que vous m'aviez fait au round précédent. La
leçon : un test qui passe ne prouve rien sur ce qu'il ne regarde pas.

---

## 6. Outillage de contrôle livré

| Script | Rôle | Serveur requis |
|---|---|---|
| `qa-database.mjs` | Cohérence des bases produits | non |
| `qa-contrast.mjs` | Paires **déclarées** dans `globals.css` | non |
| `qa-style-contrast.mjs` | Paires **réellement utilisées** dans le JSX | non |
| `qa-inherited-text.mjs` | Héritage CSS sur le **HTML servi** | **oui** |
| `qa-rls-anon.mjs` | Droits réels de la clef anonyme sur Supabase | non (réseau) |
| `merge-db-to-ts.mjs` | Fusion Supabase → TypeScript | non |

```bash
npm run audit:contrast          # palette déclarée
npm run audit:style-contrast    # usage réel (AST TypeScript)
npm run audit:inherited-text    # HTML servi — démarrer le serveur d'abord
npm run audit:rls               # droits reels de la clef anonyme
npm run audit:all               # inclut les deux premiers contrôles de contraste
```

Ces contrôles sont **complémentaires, pas redondants** : chacun a laissé passer
ce que l'autre détecte.

### `qa-style-contrast.mjs` — méthode

Analyse par l'**AST du compilateur TypeScript**, pas par expression régulière
(une regex m'avait déjà fait manquer 1 entrée sur 69). Reconstitution du fond
hérité en remontant la chaîne des parents, résolution des `var()` **dans les
deux thèmes**, calcul du contraste réel. Gère les voiles semi-transparents, les
arrêts de dégradé et le seuil réduit à 3:1 du grand texte.

Il **n'apparie pas les branches opposées d'un même ternaire** : sans cela,
`bg: actif?'white':'transparent'` avec `color: actif?'#2d7a3d':'white'`
remontait un faux « blanc sur blanc » qui n'existe jamais à l'écran.

**Auto-validé** : défaut réintroduit → détecté, sortie 1 ; restauré → sortie 0.

### La baseline : 33 défauts que je n'ai pas corrigés

Le site comporte 33 défauts de contraste **antérieurs au thème sombre** : blanc
sur votre vert de marque `#10b981` (2,54:1), gris `#9ca3af` sur blanc…

Ils échouent **identiquement dans les deux thèmes** : ce ne sont pas des
régressions mais des **choix de charte graphique**. Toucher à votre vert de
marque relève de votre décision, pas de la mienne. Ils sont gelés dans
`qa-style-contrast.baseline.json` pour que le contrôle échoue sur toute
**nouvelle** occurrence sans être noyé par l'existant.

Le fichier compte **24 clés pour 33 occurrences** : les clés sont volontairement
indépendantes du numéro de ligne (fichier + couleur + fond + thème), de sorte
qu'un même défaut répété à plusieurs endroits d'un fichier partage une clé, et
qu'un simple ajout de code au-dessus ne fasse pas resurgir un défaut déjà connu.

```bash
node scripts/qa-style-contrast.mjs --strict   # les affiche tous
```

---

## 7. Mes erreurs de cette session

Consigné pour que ce document ait une valeur d'audit, et non de promotion.

| Erreur | Détection | Conséquence si non détectée |
|---|---|---|
| Script SQL dans le mauvais sens | **Par vous** (PR #50) | Travail sans effet pour les visiteurs |
| « `versatility` : 0 usage » — faux | Par `tsc` | Les 121 cordages exclus des recommandations |
| Décompte par regex (68/69) | Par `tsc` | Chiffre « 123 » erroné annoncé |
| `<h2>` « Filtres » écarté à tort | Au réexamen | Titre invisible en thème sombre |
| Garde-fou ne détectant rien | Par auto-test | Fausse assurance permanente |
| Texte en variable, fond en dur | **Par vous** (PR #53) | 5 encarts illisibles |
| `audit:contrast` faussement rassurant | À l'audit du round 3 | Défauts masqués par un test vert |
| **« Faille RLS » annoncée sans vérification** | Par sonde REST, après votre demande | **Alarme injustifiée** sur un risque inexistant |
| Sondes RLS invalides (`204`, `400 PGRST204`) | Par réexamen immédiat | « Faille confirmée » sur une preuve nulle |
| `FORCE ROW LEVEL SECURITY` dans le script | Avant livraison | **Vos écritures dashboard silencieusement filtrées** |
| `pg_policies.roles` traité comme des OID | Avant livraison | Filet de sécurité ne détectant rien |
| Commentaire 5.3 annonçant `relforcerowsecurity = true` | À la relecture | Conclusion d'échec sur une migration réussie |
| **`supabase/migrations/` jamais inspecté** | **Par votre vérification 5.1** | 2 politiques `{public}` ignorées de l'inventaire |
| **`REVOKE` incomplet (`REFERENCES`, `TRIGGER`)** | **Par votre vérification 5.2** | Privilèges DDL inutiles laissés à `anon` |
| **`42501` interprété comme spécifique à RLS** | En lisant le message réel | Mécanisme de protection mal identifié |

**Quatre des quatorze ont été relevées par vous, pas par mes contrôles.**
Chaque fois, votre demande de vérification concrète — ou une simple requête
exécutée dans le dashboard — a établi l'état réel plus sûrement que mon
analyse statique.

**Sept de ces quatorze erreurs portent sur le seul sujet RLS.** Trois fois de
suite j'ai affirmé quelque chose de faux sur la sécurité de cette base : la
faille inexistante, puis les sondes qui ne prouvaient rien, puis le mauvais
mécanisme de blocage. La leçon n'est pas « vérifier plus » mais **ne rien
affirmer sur l'état d'un système vivant à partir de la lecture de fichiers**.

---

## 8. État final vérifié

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit` | 0 erreur |
| `npm run build` | 19/19 pages |
| `qa-database.mjs` | **0 problème** (HIGH:0 MEDIUM:0 LOW:0) |
| Cordages | **190** |
| Raquettes | **129** |
| `audit:contrast` | sortie 0 |
| `audit:style-contrast` | sortie 0 |
| `audit:inherited-text` | 9/9 pages, sortie 0 |
| `audit:rls` | sortie 0 — `SELECT` 200, `INSERT` 401 bloqué par `GRANT` |
| Lecture publique après `REVOKE ALL` | **173/173 et 107/107 lignes réellement renvoyées** |
| Migrations RLS | exécutées par le propriétaire, `Success. No rows returned` |

---

## 9. Points en attente

### 🔴 Sécurité — CORRECTION D'UNE AFFIRMATION ERRONÉE DE MA PART

**Ce document affirmait initialement que « n'importe quel visiteur peut
supprimer l'intégralité du catalogue ». C'était faux, et je m'en excuse.**

J'avais déduit cette conclusion de la **lecture** de `scripts/create-tables.js`,
qui crée effectivement des politiques `anon insert` / `anon delete`. Je n'avais
pas vérifié si elles étaient encore en place. **Ce fichier décrit une intention
passée, pas l'état actuel de l'instance.**

Sonde réelle effectuée le 8 août sur l'API REST :

| Opération | Résultat | Verdict |
|---|---|---|
| `SELECT` | HTTP 200 | autorisé — normal, le site public en dépend |
| `INSERT` | **HTTP 401, code PostgreSQL `42501`** | **bloqué — voir la correction ci-dessous** |
| `DELETE` | non concluant — voir ci-dessous | — |

**L'écriture anonyme est déjà bloquée.** Les politiques permissives ont été
retirées de cette instance à un moment donné.

#### Correction du 8 août (troisième erreur sur ce même sujet)

J'ai d'abord écrit ici que `42501` signifiait *« new row violates row-level
security policy »* et donc que le blocage venait de **RLS**. **C'était faux.**
Le message réel renvoyé par l'instance est :

```json
{"code":"42501","message":"permission denied for table strings"}
```

`42501` est `insufficient_privilege` : il couvre **deux mécanismes distincts**,
et seul le message permet de les séparer.

| Message accompagnant `42501` | Mécanisme réel |
|---|---|
| `permission denied for table X` | **`GRANT`** — privilège de table |
| `new row violates row-level security policy` | **RLS** — politique |

Ma sonde ne testait que le **code**, donc elle ne pouvait pas distinguer les
deux : elle affirmait « bloqué par RLS » quelle que soit la cause.
**L'écriture anonyme est en réalité bloquée par les `GRANT`, pas par RLS.**
`scripts/qa-rls-anon.mjs` lit désormais le message et nomme le mécanisme observé.

**Deux de mes sondes initiales étaient méthodologiquement fausses :**

- un `DELETE` sur un identifiant inexistant renvoie `204` **même quand RLS
  bloque** (zéro ligne concernée = succès vide) — j'ai d'abord interprété ce
  `204` comme une faille confirmée ;
- un `POST` avec une colonne inexistante renvoie `400 PGRST204`, émis par
  PostgREST **avant** toute évaluation RLS.

Le seul test concluant pour `DELETE` serait de supprimer une ligne réellement
présente : destructif, donc non effectué. L'`INSERT` étant bloqué, il est très
probable que `DELETE` le soit aussi.

**Livré malgré tout, par précaution :**
`migrations/2026-08-08__durcir_rls_strings_racquets.sql` — intégralement
idempotent, **sans effet si tout est déjà correct**. Il ajoute une seconde
barrière au niveau des `GRANT` (indépendante des politiques) et fournit
4 requêtes de vérification.

Contrôle permanent : `npm run audit:rls` — sonde non destructive,
**sortie 1 si l'écriture anonyme devient possible**.

#### Ce que les vérifications exécutées par le propriétaire ont révélé

Les deux scripts ont été exécutés dans le SQL Editor le 8 août
(`Success. No rows returned`). Les vérifications **5.1 et 5.2 ont contredit mes
résultats attendus** et mis au jour deux lacunes supplémentaires :

| Vérification | J'annonçais | Réalité observée |
|---|---|---|
| 5.1 politiques | 2 lignes `SELECT` | **4 lignes** — doublons `Anyone can read …` en `{public}` |
| 5.2 privilèges de `anon` | `SELECT` seul | **`SELECT` + `REFERENCES` + `TRIGGER`** |

- **Doublons :** `"Anyone can read strings"` / `"… racquets"` viennent de
  `supabase/migrations/20250129_security_fixes.sql`, **un répertoire que je
  n'avais jamais inspecté** — je m'étais limité à `scripts/create-tables.js` et
  `migrations/`. Sans clause `TO`, elles s'appliquent à `{public}`. Les
  politiques `SELECT` s'additionnant en **OR** et les deux disant `USING (true)`,
  **aucun droit supplémentaire n'était ouvert** ; mais l'état de sécurité
  devenait illisible.
- **`REVOKE` incomplet :** je listais `INSERT, UPDATE, DELETE, TRUNCATE`.
  `REFERENCES` et `TRIGGER` sont des privilèges **DDL** (clef étrangère,
  déclencheur) : aucun ne permet de modifier une ligne, donc le catalogue
  n'était pas exposé — mais ils sont inutiles à un rôle anonyme.

Correctif : `migrations/2026-08-08b__correctif_politiques_doublons_et_grants.sql`
(`DROP` des doublons + `REVOKE ALL` puis `GRANT SELECT`), exécuté avec succès.

**Vérification après `REVOKE ALL`** — l'opération retirant *tous* les
privilèges avant de re-accorder `SELECT`, le risque était de casser la lecture
publique. Contrôlé sur l'API REST : `173/173` et `107/107` lignes **réellement
renvoyées** à un visiteur anonyme (`content-range: 0-172/173`), pas un simple
`200` sur tableau vide.

**Bilan :** le catalogue n'a jamais été en danger. Ce que j'avais décrit comme
une faille béante était une configuration **fonctionnellement correcte mais
désordonnée**. Deux requêtes exécutées par le propriétaire ont établi l'état
réel plus sûrement que toute mon analyse statique.

### 🟠 Décisions qui vous appartiennent

1. **46 conflits de valeurs** entre TypeScript et Supabase — par exemple
   `solinco-mach-10` à 65 € côté TS contre 17 € côté base. Je n'ai rien
   arbitré : ce sont vos données commerciales. Aucune valeur existante n'a été
   modifiée.
2. **33 défauts de contraste préexistants**, dont votre vert de marque.
3. **5 cordages en quarantaine** pour conflit de jauge, non traités.

### 🟡 Cause racine non résolue

**Le site lit les fichiers TypeScript tandis que la base Supabase est
alimentée séparément. La divergence réapparaîtra.** Les PR #49 et #51 ont
corrigé les symptômes, pas la cause. Deux options durables : générer le
TypeScript à la construction, ou lire Supabase à l'exécution. C'est une
décision d'architecture qui vous revient.

### ⚠️ Validation visuelle indispensable

**Je n'ai produit aucune capture d'écran de toute la session.** Playwright est
inutilisable dans cet environnement (`libatk-1.0.so.0` absente, pas de droits
root).

**Tous les ratios de contraste de ce document sont calculés, pas constatés.**
Le calcul garantit la lisibilité, **pas l'esthétique** : je n'ai jamais vu le
rendu du thème sombre. Merci de vérifier sur votre téléphone en mode sombre,
en particulier le configurateur et l'encart « Journal synchronisé ».

---

## 10. Règles à ne pas enfreindre

Issues des défauts réels de cette session.

**1. Fond et texte proviennent du même registre.**
Un fond en variable avec un texte en dur — ou l'inverse — produit le défaut
« jaune sur jaune ». On utilise `var(--tint-X-bg)` **avec**
`var(--tint-X-fg)`.

**2. Tout fond clair en dur impose une couleur de texte explicite.**
Sinon le texte hérite du blanc du `<body>` en thème sombre. Cela vaut
**particulièrement pour `<input>` et `<select>`** : sans couleur, la saisie de
l'utilisateur devient invisible.

**3. Pas de couleur de surface en dur dans les 5 pages en styles inline.**
`configurator`, `statistics`, `pricing`, `payment-success`,
`payment-cancelled`. Exceptions légitimes : texte blanc sur fond de marque
coloré, boutons désactivés en gris.

**4. Un garde-fou doit être auto-testé avant d'être livré.**
Réintroduire le défaut, vérifier la sortie 1, restaurer, vérifier la sortie 0.
Sans cela, on livre une fausse assurance — ce que j'ai fait au round 2.

**5. Vérifier les unités avant tout import de données.**
Une confusion kg/livres sur les tensions fausserait toutes les
recommandations.

---

*Document établi le 8 août 2026 à partir de l'historique Git et des sorties
d'audit. Les mentions « en attente » et « non résolu » sont volontaires : elles
délimitent ce qui est fait de ce qui reste à décider ou à vérifier.*
