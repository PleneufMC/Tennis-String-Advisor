# Montage hybride : quel cordage en montants, lequel en travers, et quelle fermeté pour le bras

| Champ | Valeur |
|---|---|
| Slug FR / EN | `montage-hybride-cordage-tennis` / `hybrid-tennis-string-setup` (slugs de travail du classeur de veille, à confirmer par `tsa-acquisition` au §1) |
| Circuit | complet (nouvel article FR + EN) |
| Branche | `agent/redaction/montage-hybride-cordage-tennis` (worktree `C:\Users\plene\Documents\_wt\redac-hybride`) |
| Ouvert le | 2026-11-23, par l'orchestrateur |
| Demande d'origine | Pierre, 23/11/2026 : « allez chercher là dedans des idées d'articles pour le blog complémentaire à ce qui est déjà en ligne » (classeur « TSA · Idées d'articles », idée 2026-W46-2) ; puis « GO sur le montage hybride en anglais et en français » ; puis « je te laisse faire tous les arbitrages nécéssaires à la rédaction de cet article » (délégation à l'orchestrateur ; la mise en ligne reste soumise au GO de Pierre sur la PR, charte §6) |
| Statut | PR #173 ; en attente du GO de Pierre |
| Mise à jour planifiée | sans objet (aucune année dans le titre ni le slug de travail) |

> Règles : `docs/redaction/CHARTE.md`. Déroulé : `docs/redaction/README.md`.
> On n'écrit que dans ses sections ; on répond aux questions qui nous sont
> adressées au §4 ; chaque passage laisse une entrée au §7.

---

## 1. Brief SEO — `tsa-acquisition`

*Rempli le 2026-11-23. Volumes de recherche : **non documentés**. Search Console a relu le sitemap le 23/11 mais n'a aucune donnée sur ce sujet ; Bing Webmaster Tools n'est pas branché. Sources de demande : le classeur de veille (idée 2026-W46-2, onglets Signaux et Avis vidéos, relevés du 15 au 22/11/2026) et le relevé de SERP ci-dessous. Forums et vidéos sont des signaux de demande, jamais des sources de faits (A-2).*

### Requête et intention

- Requête principale FR : « cordage hybride tennis ». C'est la forme de la question associée relevée par la veille sur Google : « Quel est le meilleur cordage hybride pour le tennis ? ».
- Requête principale EN : « hybrid tennis string setup ».
- Requêtes secondaires :
  - FR : « montage hybride tennis » ; « quel cordage en travers » ; « hybride polyester multifilament » ; « hybride boyau polyester », « hybride inversé » ; « hybride poly poly », « profilé en montants, rond en travers » ; « tension hybride montants travers » ; « set hybride » ;
  - EN : « hybrid tennis strings » ; « hybrid strings mains and crosses » ; « cross string for poly mains » (signal r/10s « help me find a cross string ») ; « poly poly hybrid » ; « gut poly hybrid » ; « hybrid string tension mains crosses » ; « do pros use hybrid strings » (question associée relevée par la veille).
- Intention, en une phrase : le joueur veut décider quel cordage mettre en montants et lequel en travers, avec quel écart de tension, et savoir ce que l'hybride change à la fermeté de son tamis par rapport à un montage intégral, pour composer le sien ou choisir un set.

### Durée de vie (evergreen d'abord, charte §1)

- Durée de vie attendue : des années.
- Pourquoi : le principe d'un hybride (deux cordages, deux sens) ne dépend ni d'une saison ni d'un modèle, et les mêmes questions reviennent sur les forums FR et EN (veille W46-W47). Ce qui vieillit, ce sont les chiffres tirés de la base : lots de rigidités, cordages retirés du commerce. Chacun porte sa date d'état (F11). L'article se revoit quand la base ajoute ou retire une mesure sur un cordage cité.
- Année dans le titre ou le slug : non. Mise à jour planifiée : sans objet (en-tête confirmé).

### SERP observée

Un relevé est un indice (personnalisation, localisation), pas une mesure : moteur, date et requête exacte.

**Bing et Google n'ont pas pu être relevés (F9).** Le 23/11/2026, Bing a servi une page « Aucun résultat » à l'outil pour deux requêtes évidentes (« cordage hybride tennis », cc=FR ; « hybrid tennis string setup », cc=US). Google a renvoyé une page de difficulté d'accès, et DuckDuckGo (index en grande partie Bing) un captcha. Arrêt au premier refus, sans nouvel essai ni contournement. Le relevé ci-dessous vient de l'**outil de recherche de la session : moteur non déclaré, localisation US**. Ce n'est donc ni Bing ni Google. Un contrôle manuel dans un navigateur, ou Bing Webmaster Tools une fois branché, le remplacera. Les pages de sites qui ont déjà refusé les robots (wilson.com, head.com, Tennis Warehouse Europe, TennisExpress) n'ont pas été ouvertes. Un extrait de moteur n'étant pas une source (F10), elles ne sont décrites que par leur nature.

| Moteur | Date | Rang | Résultat | Ce qu'il couvre | Ce qu'il rate |
|---|---|---|---|---|---|
| Bing (accès direct) | 2026-11-23 | — | « cordage hybride tennis » (cc=FR), « hybrid tennis string setup » (cc=US) | page « Aucun résultat » servie à l'outil | relevé impossible (F9) |
| Google (accès direct) | 2026-11-23 | — | « cordage hybride tennis » (hl=fr, gl=fr) | page de difficulté d'accès | relevé impossible (F9) |
| DuckDuckGo (HTML) | 2026-11-23 | — | « cordage hybride tennis » (kl=fr-fr) | captcha | relevé impossible (F9) |
| Outil de la session (US) | 2026-11-23 | 1 | « cordage hybride tennis » : Babolat, « Le cordage hybride : la combinaison idéale » (blog, 28/07/2020) | combinaisons possibles (multi, poly, boyau), montage quatre nœuds ; chiffre de marque « 45 % du top 20, 65 % des joueuses » ; renvoi vers ses sets | rôle de chaque sens, écart de tension, aucune rigidité ni mesure, rien sur le poly/poly ; page de marque |
| Outil de la session (US) | 2026-11-23 | 2 | HEAD, fiche produit « Hybrid Spin » (fr_LU) | page produit | non ouverte (head.com : 429 le 23/10) ; pas un guide |
| Outil de la session (US) | 2026-11-23 | 3 | Wilson, « Comment choisir un cordage de tennis » (blog) | guide général du cordage | non ouverte (wilson.com refuse les robots) |
| Outil de la session (US) | 2026-11-23 | 4 | Decathlon, « Comment bien choisir votre cordage ? » (non daté) | un cinquième de la page sur l'hybride : mono en montants, boyau ou multi en travers ; hybride inversé « chez certains pros » ; vise les joueurs qui cassent | tension, jauge, aucune rigidité, aucun chiffre |
| Outil de la session (US) | 2026-11-23 | 5 | Tennis Warehouse Europe, « Les meilleurs cordages pour les effets en 2025 » | liste de produits sur l'effet | non ouverte (406 le 10/10) ; hors intention |
| Outil de la session (US) | 2026-11-23 | 6 | Tennis Majors, « Les tests de Seb #2 : Les types de cordage » (24/04/2020) | deux phrases sur l'hybride, des noms de pros sans source | tout le reste |
| Outil de la session (US) | 2026-11-23 | 1-2 | « montage hybride tennis montants travers » : Decathlon et Babolat, les mêmes pages | idem | ensuite, pages de catégorie de TWE, un manuel de cordeur en PDF (Tennispro) et les catalogues Babolat et HEAD : **aucun guide éditorial indépendant en français** |
| Outil de la session (US) | 2026-11-23 | 1 | « hybrid tennis string setup » : TennisCompanion, « Definitive Guide To Hybrid Tennis Strings + My Top Picks » (Jon Crim, non daté, images d'octobre 2024) | définition, raisons, pour et contre, appariements, tension (« avoid going over 5 lbs »), recordage, pros, sélection | aucune rigidité ni mesure ; allégation santé (« harsh on a player's arm ») ; liens d'affiliation |
| Outil de la session (US) | 2026-11-23 | 2 | Tennis Warehouse, « Best Hybrid Tennis Strings » (mis à jour en mai 2026) | 6 sets prémontés ; les montants dominent le ressenti ; le poly/poly est en vogue | tension, rigidité, rien pour composer soi-même ; page marchande |
| Outil de la session (US) | 2026-11-23 | 3 | Tennis.com, « Solinco releases Hyper-G Hybrid System » (16/06/2024) | actualité produit ; le sens rond/profilé change la trajectoire | ni tension ni rigidité ; hors intention guide |
| Outil de la session (US) | 2026-11-23 | 4 | TennisExpress, « Say hello to hybrid string » | — | 403, non ouverte (F9) |
| Outil de la session (US) | 2026-11-23 | 5 | Tennisnerd, « Hybrid Polyester String Setups – How to choose your setup » (Jonas Eriksson, 06/11/2026) | profilé en montants, rond en travers, et pourquoi ; écart de tension (« Four pounds… about as big a gap as you'll see ») | aucune mesure ; allégation santé (boyau « adds comfort if you have arm issues ») ; affiliation et partenariat déclarés |
| Outil de la session (US) | 2026-11-23 | 1-5 | « hybrid tennis strings mains and crosses » : TW (Best Hybrid), TennisCompanion, catégorie hybrides de TW, Tennis.com (Solinco), test TW du Klip X-Plosive | mêmes pages, plus un test de cordage | test Klip non ouvert : l'extrait annonce une rigidité de tamis mesurée dans les deux sens (piste Q1 du pigiste). Plus bas, Tennisnerd « Full Bed vs Hybrid Stringing » (Chris Nash, 09/09/2026) : « softer crosses 3 to 4 lbs tighter », sans mesure |

**Trois constats :**

1. **Aucune des 8 pages ouvertes ne chiffre la fermeté d'un hybride** ni ne cite de mesure de laboratoire. Toutes en restent au qualitatif (« les montants dominent », « plus confortable »).
2. **Côté français, pas de guide éditorial indépendant** : les résultats sont des pages de marques (Babolat, 2020 ; HEAD ; Wilson) et de distributeurs (Decathlon, TWE). Côté anglais, des guides d'affiliés ou de vendeurs, dont un très récent (Tennisnerd, 06/11/2026).
3. **Des conseils de tension contradictoires et sans source** (au plus 5 lb d'écart ; 4 lb au plus ; 3 à 4 lb de plus sur des travers souples), et des **allégations de santé** (« easier on your arm », « adds comfort if you have arm issues ») que TSA n'écrit pas (F7).

### Angle différenciant

Ce que TSA peut dire et que les résultats ci-dessus ne disent pas (le bras, l'indice RCS, les données de la base) :

1. **Un chiffre de fermeté, dans le cadre d'A-1.** C'est le seul résultat qui donne l'indice d'un hybride, pour les montages dont les deux cordages sont mesurés en laboratoire. Il le présente comme le configurateur : une estimation dérivée des deux cordages, bornée par les montants seuls et les travers seuls, au montage nommé. Ce n'est jamais une mesure (règle 3).
2. **Ce qu'on ne chiffre pas, et pourquoi** : le boyau, les cordages sans mesure, et les sets selon Q-1. Aucun concurrent ne dit où s'arrête ce qu'il sait.
3. **Ce que le sens de montage et l'écart de tension changent à l'indice.** L'indice lit la tension moyenne : un écart autour de la même moyenne ne le change pas (déjà établi dans `guide-tension-cordage-tennis` §3). Inverser montants et travers le change peu, selon une vérification d'ordre de grandeur que le pigiste doit établir (Q4). Là où la SERP oppose des recettes de tension sans source, l'article sépare la mesure de l'usage.
4. **Le confort dit par le palier**, avec la position de l'indice par rapport aux seuils d'alerte, écrite comme un constat (F7). Pas d'« arm-friendly », que la SERP emploie.
5. **La réponse au signal classim** (« plus solide qu'un X-One intégral sans perte de confort ») : le X-One Biphase est mesuré dans la base, donc l'écart de fermeté entre un hybride polyester/X-One et un X-One intégral se chiffre. La durabilité, elle, reste non documentée sans essai publié (Q7).
6. **Le pont vers l'outil** : le configurateur FR et EN accepte un cordage et une tension de travers (`src/app/configurator/page.tsx`, champ `crossString`). L'article explique ce que l'outil affiche (« estimation pour un hybride, entre X et Y »).

### Cannibalisation

| Article existant | Requête proche | Décision (lier · fusionner · différencier) |
|---|---|---|
| `guide-materiel-tennis` §5 « Les Montages Hybrides » (FR seul) | « montage hybride tennis » | **différencier et lier.** C'est le plus proche par l'intitulé, mais il reste un panorama sans chiffre. Le §5 renvoie vers le nouvel article ; ses hybrides de pros sans source posent un problème de cohérence (Q-2) |
| `cordage-mono-vs-multifilament` §08 « Et l'hybride ? » / EN `polyester-vs-multifilament-strings` « What about hybrid stringing? » | « hybride polyester multifilament » | **lier**. Le nouvel article ne refait pas le comparatif mono/multi ; le §08 y renvoie |
| `cordage-polyester-tennis-elbow` §6 « Et les hybrides ? » (`#hybrides`) / EN `polyester-strings-tennis-elbow` §6 (`#hybrids`) | « hybride polyester tennis elbow » | **lier** (suite d'A-1). La phrase « Nous ne la chiffrons pas ici » reste vraie ; lien proposé au 4b |
| `guide-tension-cordage-tennis` §3 (`#montants-travers`) / EN `tennis-string-tension-guide` §3 | « tension hybride montants travers » | **lier, ne pas refaire.** Le nouvel article résume en 3 ou 4 phrases et renvoie à l'ancre ; les faits du §3 viennent de son dossier (`docs/redaction/guide-tension-cordage-tennis.md`) |
| `cordage-tennis-elbow` (tableau des familles, ligne « Hybride (sets prémontés à composition publiée) », et tableau des 17 cordages) / EN `best-tennis-strings-for-tennis-elbow` | « cordage hybride tennis elbow » | **lier, et rester cohérent.** Cet article publie déjà les rigidités dérivées des sets, et l'indice 27 de RPM Blast + VS Touch. Le nouvel article ne doit pas le contredire (Q-1) |
| `analyse-setups-atp-top-20` | « hybride pros » | **différencier.** Pas de liste de setups de pros ; la FAQ « les pros jouent-ils en hybride ? » s'en tient à F4. Pas de lien sortant sans validation du pigiste |
| `jauge-cordage-tennis`, `plan-de-cordage-tennis`, `comparer-deux-montages-cordage-tension` | — | **lier en sortant** (jauge des travers, densité, protocole de comparaison) ; aucun recouvrement d'intention |

### Balises proposées

| | FR | EN |
|---|---|---|
| title (60 caractères au plus) | Cordage hybride tennis : montants, travers et fermeté (53, espace insécable avant « : ») | Hybrid Tennis String Setup: Mains, Crosses and Firmness (55) |
| meta description (155 au plus) | Quel cordage en montants, lequel en travers, quel écart de tension : composer un hybride et estimer sa fermeté à partir de deux cordages mesurés. (145) | Which string goes in the mains, which in the crosses, what tension gap to ask for, and how firm the result is, estimated from two lab-measured strings. (151) |
| H1 | Cordage hybride : que mettre en montants, que mettre en travers, et quelle fermeté attendre | Hybrid Tennis Strings: What Goes in the Mains, What Goes in the Crosses, and How Firm the Setup Will Be |
| slug | `montage-hybride-cordage-tennis` (**confirmé**) | `hybrid-tennis-string-setup` (**confirmé**) |

- **Slugs confirmés.** Le slug FR contient les trois mots de la requête principale et suit le modèle maison `<sujet>-cordage-tennis` (`jauge-cordage-tennis`, `plan-de-cordage-tennis`). Le slug EN reprend la requête EN mot pour mot, sur le modèle de `tennis-string-gauge` et `tennis-string-pattern`. Aucun renommage à faire.
- **« pour le bras » est retiré des balises.** Le titre de travail dit « quelle fermeté pour le bras » : présenter la fermeté comme un choix fait pour le bras frôle l'avis conditionné par la santé (F7). Le bras passe dans le corps : palier, et position par rapport aux seuils écrite comme un constat. Le H1 du dossier (en-tête de l'orchestrateur) n'est pas modifié ; c'est au rédacteur de reprendre ou non le H1 proposé ici.
- Aucun title existant ne contient « cordage hybride » ni « hybrid tennis string » : les deux sont uniques (vérifié sur `public/blog/` et `public/en/blog/` le 23/11).
- La meta ne promet que ce que l'article tiendra : une estimation, et seulement pour les hybrides dont les deux cordages sont mesurés.

### Plan proposé (H2, H3)

Réponse en tête (charte §1), dans les deux premières phrases : ce qu'on met en général dans chaque sens, et où tombe la fermeté d'un hybride sur l'indice du site (entre ses deux cordages, en estimation).

1. **H2 Montants, travers : ce qu'est un montage hybride.** Court, avec le schéma (visuel 1) ; renvoi au comparatif mono/multi pour les familles.
2. **H2 Ce que chaque sens apporte : ce qui est établi, ce qui est un usage** (Q1, Q2, Q5)
   - H3 Les montants
   - H3 Les travers
   - H3 Profilé en montants, rond en travers : le poly/poly
3. **H2 Les quatre familles d'hybrides.** Un tableau : montants · travers · ce que l'usage en attend · ce que la base peut chiffrer. Lignes : poly/multi ; poly/boyau ; boyau/poly, dit « inversé » ; poly/poly.
4. **H2 Quelle fermeté pour un hybride : ce que l'indice peut dire.** C'est le cœur de l'article, dans le cadre d'A-1 (Q3, Q4, Q9, Q10).
   - H3 Comment le site estime l'indice d'un hybride : deux estimations, la plus haute retenue, et les bornes ; une estimation, pas une mesure
   - H3 Des hybrides chiffrés au montage de référence : tableau et graphique (visuel 2) ; **premier lien vers le configurateur ici** (A3)
   - H3 Inverser montants et travers
   - H3 Ce que nous ne chiffrons pas, et pourquoi
5. **H2 Les sets prémontés** (Q6). Contenu selon la réponse à Q-1 ; peut se fondre dans le 4.
6. **H2 Faut-il un écart de tension entre montants et travers ?** 3 ou 4 phrases et un lien vers `guide-tension-cordage-tennis#montants-travers` ; l'indice lit la tension moyenne (Q4, cas 24/22).
7. **H2 Composer son hybride en trois questions.** Ce qu'on attend des montants, la fermeté visée (palier), puis la vérification dans le configurateur (second lien A3). Chaque condition est une préférence de jeu, jamais un état de santé (F7).
8. **H2 FAQ**
   - H3 Quel cordage mettre en travers avec un polyester ?
   - H3 Un hybride est-il plus confortable qu'un polyester intégral ? (palier et indice, F7)
   - H3 Faut-il tendre davantage les travers en hybride ?
   - H3 Qu'est-ce qu'un hybride poly/poly ?
   - H3 Un hybride dure-t-il plus longtemps qu'un multifilament intégral ? (Q7 ; question retirée si rien n'est établi)
   - H3 Les joueurs professionnels jouent-ils en hybride ? (Q8 ; question retirée si F4 n'est pas tenu)
9. **H2 Ce que cet article ne dit pas**, puis **H2 Sources**. L'article parle du bras : il porte la phrase « Si une douleur persiste, consultez un professionnel de santé » (F7).

Version EN : même plan, adaptée et non traduite ; tensions en lb suivies des kg. `FAQPage` en JSON-LD seulement si la FAQ visible lui correspond mot pour mot (4b).

### Maillage

- Entrants : articles existants qui pointeront vers celui-ci, avec l'ancre envisagée. Le rédacteur pose ces liens dans la même PR. Aucun de ces articles n'est dans `scripts/qa-blog-images.exceptions.json` (vérifié le 23/11) : les modifier ne fait pas échouer `audit:blog-images`.
  - `cordage-mono-vs-multifilament` §08, après « …entre ceux de ses deux cordages » → « composer un montage hybride et estimer sa fermeté » ; EN `polyester-vs-multifilament-strings` « What about hybrid stringing? » → « how to build a hybrid setup and estimate its firmness ».
  - `cordage-polyester-tennis-elbow` §6 (`#hybrides`), après « Nous ne la chiffrons pas ici » → « l'indice d'un hybride dont les deux cordages sont mesurés » ; EN `polyester-strings-tennis-elbow` §6 (`#hybrids`) → « the index of a hybrid whose two strings are lab-measured » (suite d'A-1, proposé au 4b).
  - `guide-tension-cordage-tennis` §3 (`#montants-travers`), après « En hybride (deux cordages différents)… » → « que mettre en montants et en travers » ; EN `tennis-string-tension-guide` §3 → « what goes in the mains and the crosses ».
  - `guide-materiel-tennis` §5 → « notre guide du cordage hybride » (FR seul : pas de version EN), sous réserve de Q-2.
  - `cordage-tennis-elbow`, note sous le tableau des familles (ligne Hybride) → « comment se calcule l'indice d'un hybride » ; EN `best-tennis-strings-for-tennis-elbow`, même endroit.
  - Index du blog FR et EN : au 4b, par moi.
- Sortants :
  - **Configurateur, sortie principale** : FR `href="/configurator"`, EN `href="/en/configurator"`, jamais `/en/configurator.html`. Premier lien dans le H2 4, juste après le tableau des exemples (« choisissez un cordage de travers et sa tension, l'indice de votre hybride s'affiche avec ses bornes ») ; second dans le H2 7. Jamais `rel="noreferrer"` ni `referrerpolicy` (A3).
  - Fiches produit de chaque cordage cité : FR `/tennis-strings/<id>`, EN `/en/strings/<id>.html` (modèle relevé dans `cordage-polyester-tennis-elbow` le 23/11).
  - Articles : `guide-tension-cordage-tennis#montants-travers`, `cordage-mono-vs-multifilament`, `cordage-polyester-tennis-elbow`, `cordage-tennis-elbow`, `comparer-deux-montages-cordage-tension` (protocole pour comparer deux montages), `jauge-cordage-tennis`, `plan-de-cordage-tennis`, et leurs pages EN.
  - Aucun lien d'affiliation (F8).

### Questions de faits pour le pigiste

- Q1. **Le poids de chaque sens dans la fermeté du tamis.** Une mesure publiée dit-elle si le cordage des montants pèse plus que celui des travers sur la rigidité du tamis, et de combien ? Niveau attendu : L1 (TWU) ou L3 (test publié avec rigidité de tamis). Pistes trouvées par moteur le 23/11, **non ouvertes** : la page TWU sur la rigidité des cordages (`twu.tennis-warehouse.com/learning_center/stringstiffness.php`) et le test TW du Klip X-Plosive (`tennis-warehouse.com/learning_center/string_reviews/KEXP17review.html`), qui publierait une rigidité de tamis dans les deux sens. Sans source, « introuvable » : l'article présente alors la pondération 60/40 du site comme une convention de calcul, pas comme un fait (règle 3).
- Q2. **Établi ou simple usage ?** (a) Les montants cassent avant les travers. (b) Un cordage profilé en montants et rond en travers aide les montants à glisser et à revenir, donc l'effet. (c) On tend davantage le cordage le plus souple : déjà instruit dans `docs/redaction/guide-tension-cordage-tennis.md`, à reprendre. Niveau : L1 ou L3. Une affirmation de marque (L0) reste une allégation attribuée ; forums et vidéos sont des signaux (A-2).
- Q3. **Liste des cordages « mesurés » au sens d'A-1 et de F7.** Le statut `appliquee` de `string-stiffness-provenance.ts` suffit-il, ou faut-il compter aussi les fiches qui citent TWU sans entrée de provenance (par exemple `toroline-o-toro`) ? Confirmation de `tsa-core`. Mon relevé du 23/11, à vérifier, n'est pas un fait du dossier :
  - `appliquee` : Razor Code, Ice Code, Lynx Tour, Hyper-G, Mach-10, Hawk, 4G Rough, ALU Power Soft, X-One Biphase, NRG2, Wilson NXT ;
  - sans statut : RPM Blast, ALU Power, ALU Power Rough, Hawk Touch, Poly Tour Pro, RPM Rough, Xcel, Touch VS et le boyau Wilson ;
  - en quarantaine : NXT Power, NXT Control ;
  - absents de la base : Hyper-G Round, Ashaway Monogut ZX (signal classim), Toroline Truffle X.
- Q4. **Les exemples chiffrés** : 4 à 6 hybrides dont les deux cordages sont mesurés.
  - Au moins un polyester/X-One Biphase (signal classim), un polyester/multifilament dans les deux sens, et un poly/poly profilé/rond si la base contient un tel couple, deux fois mesuré.
  - Pour chacun, par `setupFirmnessIndex` et jamais à la main : l'indice au montage de référence (RA 64, 24 kg), les bornes (montants seuls, travers seuls), le palier et l'indice dans l'autre sens.
  - Un cas avec écart de tension (24/22 kg) pour montrer l'effet de la moyenne.
  - Pour comparer : l'indice des deux cordages en intégral.
  - Niveau BASE, contrôle de `tsa-core`, F2. L'ordre de grandeur relevé le 23/11 (un hybride polyester/multifilament mesuré peut changer de palier ; l'inversion bouge l'indice d'environ un point) est une hypothèse à établir, pas un fait.
- Q5. **Forme de section** (ronde ou profilée) des cordages retenus en Q4. La base la porte-t-elle ? Sinon, niveau L0.
- Q6. **Les sets prémontés.** Je compte **9 sets**, pas 10 : 5 à composition publiée, 3 « fiche », 1 non publiée. La 10e étiquette `composition:` est le type de l'interface (`prepacked-hybrids.ts`, ligne 37). À établir aussi :
  - la valeur tenue du Wilson Duo Control (222 tenue, 194,4 dérivée) ;
  - le doublon Champion's Choice / Champion's Choice Duo ;
  - ce que l'article peut afficher, qui dépend de la réponse à Q-1.
- Q7. **Hybride contre intégral** (signal classim). La fermeté se chiffre à partir de la base. Pour la durabilité, la casse et la perte de tension d'un hybride face à un intégral, existe-t-il une étude ou un test publié (L1 ou L3) ? Sinon « introuvable », et l'article le dit.
- Q8. **Les pros en hybride** (FAQ). Il faut deux sources indépendantes et datées par joueur, avec la réserve pro stock (F4). Le chiffre Babolat « 45 % du top 20, 65 % des joueuses » (babolat.com, 28/07/2020) est une allégation de marque : il s'écrit attribué et daté, ou pas du tout. À tenir en cohérence avec `guide-materiel-tennis` §5 (Q-2).
- Q9. **Seuils et paliers à relire au moment d'écrire** : `advanced-rcs.ts` et `getStringRecommendation`, ainsi que le montage de référence (`DEFAULT_RACQUET_RA`, `REF_TENSION`).
- Q10. **Le configurateur FR et EN, tel qu'il est** : le libellé exact des champs « cordage de travers » et « tension de travers », et la mention affichée pour un hybride, pour que l'article décrive l'outil sans écart.

### Visuels suggérés

- **Couverture** : un tamis vu de face, montants d'une teinte et travers d'une autre, dans les verts du site avec l'accent vert-jaune. Sans texte, sans marque, sans produit reconnaissable. Voie 2 (`scripts/blog-covers/`), ou voie 3 seulement si l'outil MCP de Pierre est connecté. Alt FR envisagé : « Tamis de raquette cordé en hybride, montants et travers de deux couleurs ».
- **Corps 1, schéma SVG** : montants verticaux et travers horizontaux, chacun étiqueté avec son cordage et sa tension. Reprendre le gabarit du schéma du §08 de `cordage-mono-vs-multifilament`, pour la cohérence, en l'enrichissant. Texte en SVG, traduisible.
- **Corps 2, graphique tiré de la base** : « où tombe l'indice d'un hybride ». Pour chaque exemple de Q4, trois marques sur l'échelle de l'indice : montants seuls, travers seuls, hybride estimé. Bandes des paliers et lignes des seuils (32, 35). Chaque chiffre vient du §2.
- **Corps 3, facultatif** : petit tableau-figure « inverser le sens / changer l'écart de tension autour de la même moyenne ».

### Profondeur

Circuit complet : 1 400 à 1 800 mots FR (fourchette du circuit : 1 000 à 2 000), puis l'adaptation EN ; 15 à 40 faits ; une couverture et 2 visuels de corps (3 au plus).

---

## 2. Dossier de faits — `tsa-pigiste`

Niveaux : **L0** constructeur · **L1** laboratoire (TWU) · **L2** revendeur ·
**L3** test publié, presse · **L4** forum (signal seulement) · **MÉD** source
médicale ou étude publiée · **BASE** `src/data/`.
Statuts : **confirmé** · **divergent** (→ `tsa-core`) · **introuvable** · **signal**.

*Rempli le 2026-11-23 par `tsa-pigiste`, sur le worktree au commit `c30eed7`. Les chiffres de niveau BASE sortent du moteur réel (sortie S1 ci-dessous), jamais d'un calcul à la main. Les faits déjà établis par le dossier du guide des tensions sont cités « GT-Fn » (`docs/redaction/guide-tension-cordage-tennis.md`, faits du 12/11/2026) et ne sont pas recherchés à nouveau. « † » = rigidité de fiche alignée sur une mesure TWU (définition en F6).*

### Synthèse par question

- **Q1, poids de chaque sens** : **introuvable** pour le poids. Une seule mesure publiée compare les deux sens d'un même hybride (F20, test TW non daté, unité RDC). Le tamis est plus ferme quand le cordage le plus rigide est en montants (76 contre 70). La page TWU ne chiffre pas la part de chaque sens (F19). La pondération 60/40 du site est une convention de calcul, pas un fait (F4). Elle ne joue d'ailleurs que si les montants sont le cordage le plus rigide ; sinon l'indice prend la moyenne 50/50 (F3).
- **Q2, établi ou usage** :
  - (a) « les montants cassent avant les travers » : **signal**. Le mécanisme est mesuré : les montants glissent sur les travers (F26, L1). L'ordre de casse ne repose que sur un revendeur cordeur (F27).
  - (b) « profilé en montants, rond en travers » : **signal**. TWU mesure que moins de frottement entre cordes laisse bouger les montants (F22). Les cordages profilés ou texturés frottent en général davantage (F23). La combinaison elle-même n'a jamais été mesurée. Elle reste un usage, défendu par un blog lié à une marque (F24). À noter : sur le frottement statique, TWU classe le poly en travers sur boyau en montants parmi les plus bas, et l'inverse parmi les plus hauts (F21).
  - (c) « on tend davantage le cordage le plus souple » : **signal**, déjà instruit (GT-F19 à GT-F23, GT-F28). La SERP ajoute un signal contraire (F25). L'indice lit la tension moyenne (F16, GT-F30).
- **Q3, cordages mesurés** : **confirmé** (BASE). 62 fiches sur 179 (F6, F7) *[corrigé le 23/11/2026 au 4a, réponse de `tsa-core` à Q-3 : **61 sur 179**, Toroline Absolute n'étant pas mesurée ; voir F7]*. Le relevé du brief était incomplet : 54 fiches ont le statut `appliquee`, pas 11. 8 fiches Toroline ne sont « mesurées » que par la définition du † (commentaire TWU dans la base, sans entrée de provenance), d'où la question **Q-3 à `tsa-core`**. Les cordages cités par le brief sans statut, ou en quarantaine, sont confirmés « non mesurés » (F8, F9).
- **Q4, exemples chiffrés** : **confirmé** (BASE, F10 à F17). Les deux hypothèses du brief se vérifient :
  - un hybride polyester/multifilament change souvent de palier par rapport aux montants en intégral (372 paires sur 665 *[corrigé le 23/11 au 4a : 372 sur **650**, voir F17]*) ;
  - inverser le sens change l'indice de 0, 1 ou 2 points, jamais plus, et cela suffit parfois à changer de palier (Razor Code / X-One Biphase : 30 Ferme, 29 Standard).
- **Q5, forme de section** : **partiel**. La base n'a pas de champ « forme ». Seules les descriptions des fiches Toroline la donnent, avec leur source constructeur (F29). Pour les autres exemples, rien n'a été établi ce jour : solincosports.com a renvoyé un 403 et toroline.com un 429. tecnifibre.com et wilson.com refusent les robots (notes de `prepacked-hybrids.ts`). luxilon.com n'a pas été tenté.
- **Q6, sets prémontés** : **confirmé** (BASE, F18). 9 sets : 5 à composition publiée, 3 « fiche », 1 non publiée. Aucun set publié n'a ses deux cordages mesurés. La valeur tenue du Duo Control et le doublon Champion's Choice sont dans la question **Q-5 à `tsa-core`**.
- **Q7, hybride contre intégral (durabilité, casse, perte de tension)** : **introuvable** (F30).
- **Q8, pros en hybride** : seul subsiste le chiffre de marque Babolat, attribué et daté (F31). **Aucun joueur ne passe F4** : deux sources datées qui disent la même chose, avec une source primaire (F33).
- **Q9, seuils et paliers** : **confirmé**, relus le 23/11/2026 (F1, F2).
- **Q10, le configurateur tel qu'il est** : **confirmé** (F34). Les tensions par défaut sont de 24 kg en montants et 22 kg en travers. Un hybride choisi sans toucher aux curseurs est donc calculé à 23 kg de moyenne, pas au montage de référence.

### Faits

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (25 mots au plus) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| **A** | **Moteur, montage de référence, grille (Q9)** | | | | | | | | |
| F1 | Montage de référence de l'indice | RA 64 (`DEFAULT_RACQUET_RA`) ; 24 kg (`REF_TENSION`) | BASE | `src/lib/racquet-scoring.ts` l. 161 ; `scripts/qa-ratings.mts` l. 2949 ; sortie S1 §A | 2026-11-23 (`c30eed7`) | `export const DEFAULT_RACQUET_RA = 64;` · `const REF_TENSION = 24;` | charte F7 ; GT-F31 | oui | confirmé |
| F2 | Paliers publiés et seuils d'alerte bras | < 20 Très confortable ; 20-24 Confortable ; 25-29 Standard ; 30-34 Ferme ; ≥ 35 Très ferme. Alerte dès 32 (bras sensible déclaré), dès 35 sinon. Libellés EN : Very Comfortable, Comfortable, Standard, Firm, Very Firm | BASE | `getStringRecommendation` (`src/data/strings-database.ts`, sondé de 0 à 60) ; `ARM_ALERT_RCS` (`src/lib/advanced-rcs.ts` l. 139) ; `STRING_LEVEL_EN` (`src/lib/i18n/configurator.ts` l. 222-228) ; sortie S1 §A | 2026-11-23 (`c30eed7`) | `export const ARM_ALERT_RCS = { sensitive: 32, standard: 35 } as const;` | charte F7 (21/10) ; GT-F31 (12/11) : identiques | oui | confirmé |
| F3 | Indice d'un hybride (`setupFirmnessIndex`) : le plus haut de deux estimations à la tension moyenne, (a) 60/40 des rigidités, (b) moyenne 50/50. Bornes : montants seuls à leur tension, travers seuls à la leur. Mention « estimation pour un hybride, entre X et Y » | (a) l'emporte quand les montants sont les plus rigides ; sinon (b). Écart (a) − (b) = 0,1 × (montants − travers) lb/in | BASE | `src/lib/advanced-rcs.ts` l. 180-224 | 2026-11-23 (`c30eed7`) | « la moyenne des deux rigidités plus 0,1 × (montants − travers) quand les montants sont plus rigides, à la tension moyenne » | même fonction pour l'alerte, le configurateur et le PDF (commentaire l. 181) | oui | confirmé |
| F4 | La pondération 60/40 est une convention du site, sans source citée dans le code | 60/40 | BASE | `src/lib/advanced-rcs.ts` l. 168 | 2026-11-23 | « Pondération hybride : le cordage principal domine le ressenti (60/40). » | aucune mesure ne la fonde (Q1, F19, F20) | oui | confirmé comme convention ; fondement **introuvable** |
| F5 | L'indice ignore la jauge choisie : il lit la rigidité de la fiche, celle de la jauge la plus rigide mesurée (règle C) | ex. Razor Code : fiche 242,9 (mesure 1,30) ; 1,25 mesurée à 229,2, non utilisée | BASE | `setupFirmnessIndex` (aucun paramètre de jauge) ; `stiffnessByGauge` de `tecnifibre-razor-code` | 2026-11-23 | « Aucune surface du site ne la lit avant D2/D3 » (`strings-database.ts`, `stiffnessByGauge`) | GT-F32 | oui | confirmé |
| **B** | **Cordages « mesurés » (Q3)** | | | | | | | | |
| F6 | Définition du dépôt pour « aligné sur une mesure TWU », identique au † des articles : statut `appliquee` de `string-stiffness-provenance.ts`, **ou** commentaire « Rigidité : TWU « … » » dans la base (8 fiches Toroline antérieures à ce fichier) | 2 voies | BASE | `scripts/blog-covers/build-rigidite-figures.mts` l. 95-104 (`alignedOnTwu`) ; charte F7 | 2026-11-23 | « C'est la même définition que le marqueur † des tableaux des articles. » | charte F7 : « statut `appliquee` […], mesures TWU citées dans la base » | oui | confirmé ; volet Toroline à confirmer (**Q-3**) |
| F7 | Décompte des fiches alignées | ~~**62 sur 179** : polyesters 46/102~~, multifilaments 15/45, synthétiques 1/16 (Wilson Synthetic Gut Extreme), boyaux 0/7, sets hybrides 0/9. ~~54 par provenance, 8 Toroline par commentaire~~ *Corrigé le 23/11/2026 (4a), réponse de `tsa-core` à Q-3, rétabli par le moteur (sortie S2 §B, au §5)* : **61 sur 179**, polyesters **45**/102 ; 54 par provenance et 7 Toroline par commentaire, Toroline Absolute n'étant pas mesurée (pas de jauge nominale dans sa ligne TWU) | BASE | sortie S1 §B | 2026-11-23 (`c30eed7`) | — | « 15 de nos 45 multifilaments » (`cordage-polyester-tennis-elbow` §6, cité en A-1) : concordant | oui | confirmé (corrigé au 4a) |
| F8 | Statut des cordages cités par le brief | aucune entrée de provenance, donc non alignés : RPM Blast (240 ; TWU par jauge 189,2 à 236,6), ALU Power (230), ALU Power Rough (230 ; TWU 1,25 : 209,2), Hawk Touch (215), Poly Tour Pro (220), RPM Rough (235), Xcel (155 ; TWU 1,30 : 150,9), Touch VS (92). Quarantaine : NXT Power (145), NXT Control (162). Absents de la base : Hyper-G Round, Ashaway MonoGut ZX, Toroline Truffle X | BASE | sortie S1 §C | 2026-11-23 | — | relevé du brief : liste confirmée ; il omettait 43 fiches `appliquee` | oui | confirmé ; RPM Blast et consorts → **Q-4** |
| F9 | Boyaux : aucune fiche alignée. Boyau Wilson : fiche 100 lb/in, mesure TWU de sa jauge 1,25 = 80,6 | 0/7 ; 100 contre 80,6 | BASE | sortie S1 §B-C ; `stiffnessByGauge` généré depuis le relevé TWU versionné | 2026-11-23 | — | A-1 : « boyau naturel compris » | oui | confirmé ; libellé à confirmer (**Q-4**) |
| **C** | **Exemples chiffrés par `setupFirmnessIndex`, RA 64, 24/24 kg sauf mention (Q4)** | | | | | | | | |
| F10 | Razor Code † (242,9) en montants, X-One Biphase † (166,9) en travers | **30, Ferme** (estimation entre 25 et 33) ; inverse **29, Standard** ; intégral Razor Code 33 Ferme, intégral X-One Biphase 25 Standard | BASE | sortie S1 §D | 2026-11-23 | « estimation pour un hybride, entre 25 et 33 » (mention du moteur) | même couple que le set « fiche » Tecnifibre (F18) : exemple **monté à la main** (Q-1) | oui | confirmé |
| F11 | ALU Power Soft † (197,7) / X-One Biphase † | **27, Standard** (entre 25 et 29) ; inverse 27 ; intégral 29 / 25, tous deux Standard | BASE | sortie S1 §D | 2026-11-23 | « estimation pour un hybride, entre 25 et 29 » | signal classim : l'écart avec un X-One intégral dépend des montants (+2 ici, +5 en F10) | oui | confirmé |
| F12 | Ice Code † (221,2) / NRG2 † (164) | **29, Standard** (entre 25 et 31) ; inverse 28 Standard ; intégral 31 Ferme / 25 Standard | BASE | sortie S1 §D | 2026-11-23 | « estimation pour un hybride, entre 25 et 31 » | — | oui | confirmé |
| F13 | Hyper-G † (218,3) / Vanquish † (160) | **28, Standard** (entre 24 et 31) ; inverse 28 ; intégral 31 Ferme / 24 Confortable | BASE | sortie S1 §D | 2026-11-23 | « estimation pour un hybride, entre 24 et 31 » | — | oui | confirmé |
| F14 | 4G † (286,9) / NXT † (173,7) | **33, Ferme** (entre 26 et 38) ; inverse 32 Ferme ; intégral 38 Très ferme / 26 Standard. Constat : 33 et 32 sont au seuil d'alerte bras sensible (32) ou au-dessus, sous 35 | BASE | sortie S1 §D | 2026-11-23 | « estimation pour un hybride, entre 26 et 38 » | F2 | oui | confirmé |
| F15 | Poly/poly profilé/rond : O-Toro Tour † (216,6, section hexagonale) / O-Toro Snap † (164,6, section ronde) | **28, Standard** (entre 25 et 31) ; inverse 28 ; intégral 31 Ferme / 25 Standard | BASE | sortie S1 §D ; formes : F29 | 2026-11-23 | « estimation pour un hybride, entre 25 et 31 » | ~~seul couple poly/poly profilé/rond de la base dont les deux cordages sont alignés et la forme sourcée~~ *Corrigé le 23/11/2026 (4a) : ce n'est pas le seul. Avec les formes sourcées des fiches Toroline, **8 couples** profilé/rond ont leurs deux cordages mesurés ; celui-ci a le plus grand écart de rigidité des huit (52 lb/in). On en compte **24** avec les profils, non sourcés, des autres descriptions (sortie S2 §H, au §5)* | oui | confirmé (Q-3 : tient) |
| F16 | Écart de tension autour de la même moyenne | Ice Code / NRG2 : 24/24 → **29** ; 24/22 → **28** (bornes 24 et 31) ; 23/23 → **28**. Razor Code / X-One : 24/24, 24/22 et 23/23 → **30** (l'arrondi absorbe le demi-point) | BASE | sortie S1 §E | 2026-11-23 | — | GT-F30 (Lynx Tour, 12/11) : même conclusion | oui | confirmé |
| F17 | Grille de toutes les paires alignées, le plus rigide en montants, comparé au sens inverse | ~~1 887 paires : écart de 0 point (1 124), 1 (745), 2 (18) ; palier changé par l'inversion : 168. Poly/multi : 665 paires, 0/1/2 = 291/360/14 ; palier changé : 61 ; palier différent des montants en intégral : 372 ; baisse de 0 à 7 points. Sans les 8 Toroline : 1 428 paires, 0/1/2 = 830/583/15~~ *Corrigé le 23/11/2026 (4a), sur 61 cordages mesurés (réponse de `tsa-core` à Q-3), rétabli par le moteur (sorties S2 §E-F et R, au §5)* : **1 826 paires** de rigidités différentes, sur 1 830 (4 paires à rigidités égales) ; écart 0 / 1 / 2 = **1 086 / 723 / 17**, jamais plus ; palier changé par l'inversion : **162**. Poly/multi, polyester en montants : 675 combinaisons, dont **650** où le polyester est le plus rigide ; sur ces 650, 0/1/2 = 280/356/14, palier changé par l'inversion : 60, palier différent du polyester seul : **372**, baisse de **0 à 7** points (nulle dans 36 cas). Dans les 25 autres, le multifilament est aussi rigide ou plus, et l'estimation dépasse 2 fois le polyester seul (Yonex Poly Tour Air 154,9 / Wilson NXT 173,7 : 25 contre 24) | BASE | sortie S1 §F | 2026-11-23 | — | hypothèse du brief (« environ un point ») : vérifiée, au plus 2 | oui | confirmé (corrigé au 4a) |
| **D** | **Sets prémontés (Q6)** | | | | | | | | |
| F18 | 9 sets dans `PREPACKED_HYBRIDS` : 5 « publiée », 3 « fiche », 1 « non publiée ». Aucun set publié n'a ses deux cordages alignés (le Duo Control en a un, le 4G Rough †). Compositions sourcées : RPM Blast 125 + Touch VS 130 (babolat.com, L0) ; Duo Power = ALU Power 1,25 + NXT Power 1,30 (TW et Game-Set-Match, L2) ; Duo Control = 4G Rough 1,25 + NXT Control 16 (TW, L2) ; Champion's Choice = boyau Wilson 16 + ALU Power Rough 16L (TW, L2) ; Champion's Choice Duo = même composition (TennisCompanion, L3). Sources lues par `tsa-core` le 23/10/2026, toutes à ordre libre | Duo Control : fiche **tenue à 222**, valeur dérivée 194,4 (tenue du 26/10). Champion's Choice et Champion's Choice Duo : 178 chacun. Sets « fiche » Tecnifibre : Razor Code † + X-One † (212,5) et Ice Code † + NRG2 † (198,4), set introuvable | BASE | `src/data/prepacked-hybrids.ts` ; sortie S1 §G | 2026-11-23 | « Tenue à 222 jusqu'à un GO explicite (règle 2). » | Q-1 de l'orchestrateur : **aucun indice de set dans l'article** | oui | confirmé ; doublon et tenue → **Q-5** |
| **E** | **Poids de chaque sens (Q1)** | | | | | | | | |
| F19 | TWU (C. Lindsey, page non datée) : la rigidité d'un cordage n'est pas celle du tamis. La page cite le boyau en montants et le polyester en travers comme exemple de tamis mixte, sans chiffrer la part de chaque sens. Mesures faites à 52 lb | qualitatif | L1 | https://twu.tennis-warehouse.com/learning_center/stringstiffness.php | 2026-11-23 | « But individual string stiffness is not the same as stringbed stiffness. » · « (such as gut in the mains and polyester in the crosses) » | GT-F12, GT-F26 (même page, 12/11) | — | confirmé (qualitatif) |
| F20 | Test TW du Klip X-Plosive (boyau Klip et K-Boom, co-polyester), jauge 17. Rigidité de tamis mesurée dans les deux sens. Raquette et tension non indiquées, page non datée | RDC à la pose : **70** boyau en montants, **76** poly en montants ; après 24 h : 69 et 72 | L3 | https://www.tennis-warehouse.com/learning_center/string_reviews/KEXP17review.html | 2026-11-23 | « RDC stringbed stiffness new \| 70 (gut mains, poly crosses) \| 76 (poly mains, gut crosses) » | aucun second test trouvé ; **unité RDC, sans rapport avec le lb/in ni l'indice** (charte F2) | — | confirmé : une mesure, un hybride, un échantillon. Établit le sens, pas le poids |
| **F** | **Établi ou usage (Q2)** | | | | | | | | |
| F21 | TWU, frottement statique entre cordes : le poly en travers sur boyau en montants a le plus faible ; l'inverse (boyau en travers, poly en montants) compte parmi les plus élevés. Hypothèse avancée : un montant s'enfonce dans un travers plus souple | classement | L1 (C. Lindsey, août 2010, révisé en février 2011) | https://twu.tennis-warehouse.com/learning_center/COF.php | 2026-11-23 | « It is very interesting that the hybrid with poly crosses and gut mains is the combination with the lowest static COF. » | F23 (même auteur, frottement de glissement) | — | confirmé. Tension et appareil du test non indiqués |
| F22 | TWU : moins de frottement statique, plus de mouvement des cordes, donc plus d'effet si elles reviennent pendant le contact. Sans mouvement latéral, tous les cordages donnent à peu près le même effet | qualitatif | L1 | idem F21 | 2026-11-23 | « If the strings don't move sideways, all strings produce about the same spin. » | GT-F27 (TWU, 2011) | — | confirmé |
| F23 | TWU, frottement de glissement : les cordages profilés ou texturés sont en général en bas du classement (frottement plus élevé) ; les polyesters ont le plus faible ; le boyau en montants donne les combinaisons les plus glissantes | qualitatif | L1 (C. Lindsey, 07/12/2010) | https://twu.tennis-warehouse.com/learning_center/slidingCOF.php | 2026-11-23 | « Most shaped/textured strings gravitate to the bottom of the list (higher sliding COF). » | F21 | — | confirmé. La combinaison « profilé en montants, rond en travers » n'est **pas** testée |
| F24 | Usage « profilé en montants, rond et lisse en travers » : un travers glissant aiderait les montants à bouger ; deux profilés accrocheraient | sans mesure | L3 (J. Eriksson, Tennisnerd, 06/11/2026 ; ~~partenariat Toroline et liens affiliés déclarés~~ *corrigé le 23/11 (4a), page relue : article écrit, sans vidéo intégrée ; collaboration avec Toroline déclarée (« Vamos is my collab with Toroline »), liens « Head over to our partners here: Toroline, Restring, Tennis Warehouse and Tennis Warehouse Europe » ; aucune mention d'affiliation*) | https://www.tennisnerd.net/?p=70402 | 2026-11-23 | « The slick cross helps the mains move. » · « Put two shaped strings together and you often get too much friction, because the edges grip each other. » | va dans le sens de F23 pour le travers ; combinaison non mesurée | — | **signal** |
| F25 | Même page : travers un peu moins tendus que les montants, et 4 lb comme écart maximal observé. *Précisé le 23/11 (4a), page relue : l'usage est énoncé en général (« many players run the crosses a little lower than the mains »), non pour l'hybride ; les 4 lb illustrent le montage en cordage unique d'un joueur (« Carlos Alcaraz strings RPM Team at 55 lbs mains and 51 lbs crosses in his Aero 98 »), une seule source, donc joueur non écrivable (F4)* | 4 lb (≈ 2 kg) | L3 (idem F24) | idem F24 | 2026-11-23 | « Four pounds, or about two kilos, is about as big a gap as you'll see. » | contredit GT-F22 (le plus souple plus tendu) ; aucune prescription sourcée (GT-F28) | — | **signal** |
| F26 | TWU : quand la force latérale de la balle dépasse le frottement statique, les montants glissent sur les travers. La page ne dit pas lesquels cassent en premier | qualitatif | L1 (C. Lindsey, « String Snap-Back and Spin in Tennis », 30/01/2011) | https://twu.tennis-warehouse.com/learning_center/stringmovementPart2.php | 2026-11-23 | « …then the main strings will slide across the cross strings. » | F21-F23 | — | confirmé (mécanisme) |
| F27 | Un revendeur cordeur : les montants cassent en général en premier parce qu'ils glissent le plus. En hybride, des montants profilés ou texturés peuvent abîmer un travers souple jusqu'à la casse | qualitatif | L2 (Holabird Sports, article non signé, 25/11/2013) | https://www.holabirdsports.com/blogs/news/ask-the-stringer-why-are-my-crosses-wearing-out-so-quickly | 2026-11-23 | « Although the main strings commonly break first since they're doing most of the sliding around during ball impact... » | une seule source ; F26 pour le mécanisme | — | **signal** |
| F28 | Faits de tension montants/travers repris du guide des tensions | GT-F4 (à consigne égale, les travers sortent jusqu'à 10 kg moins tendus) ; GT-F19 et GT-F20 (« +4 lb aux travers », forum 2011) ; GT-F21 à GT-F23 (usages contraires, dont « le plus souple plus tendu » en hybride) ; GT-F28 (aucune prescription chiffrée) ; GT-F30 (l'indice lit la tension moyenne) | MÉD, L4, L3, BASE (selon GT) | `docs/redaction/guide-tension-cordage-tennis.md` §2 | faits du 2026-11-12 | — | F16 (moyenne, au 23/11) | voir GT | repris, statuts de GT inchangés |
| **G** | **Forme de section (Q5)** | | | | | | | | |
| F29 | La base n'a pas de champ « forme ». ~~Seules les descriptions des fiches Toroline la donnent~~ *Corrigé le 23/11 (4a) : seules les descriptions des fiches Toroline la donnent **avec une source** ; d'autres descriptions donnent un profil sans source (par exemple `strings-database.ts` l. 111, 157, 775 et 864), et les seules sections rondes de la base sont celles de l'O-Toro Snap et de la Cash.* Formes Toroline sourcées sur la fiche officielle (commentaire de la base, relevé du 28/09/2026) : O-Toro Tour hexagonale, O-Toro Snap ronde ; Super Toro, Absolute hexagonales, Cash ronde, Snapper octogonale, O-Toro Spin pentagonale. Pour Razor Code, X-One Biphase, ALU Power Soft, Ice Code, NRG2, Hyper-G, Vanquish, 4G et NXT : aucune forme dans la base, et aucune page L0 ouverte ce jour | voir énoncé | BASE (Toroline) ; L0 non ouvert | `src/data/strings-database.ts` (descriptions et commentaires des fiches `toroline-*`) ; toroline.com : **429** sur `o-toro-tour` et `o-toro-snap-sample` ; solincosports.com : **403** | 2026-11-23 | « Déclinaison de l'O-Toro à section ronde, jauge 1,25 mm. » · « Version plus rigide de l'O-Toro, section hexagonale, jauges 1,23 et 1,20 mm. » | page constructeur non rouverte (F9 de la charte) | oui (description) | confirmé pour Toroline (BASE) ; **introuvable** ce jour pour les autres |
| **H** | **Hybride contre intégral (Q7)** | | | | | | | | |
| F30 | Étude ou test publié qui compare, à cordages identiques, durabilité, casse ou perte de tension d'un hybride et d'un intégral | — | — | recherche du 2026-11-23 : tests TW de sets isolés (ex. F20 : rigidité de tamis à 24 h, sans comparaison avec un intégral des mêmes cordages) ; blogs sans mesure | 2026-11-23 | — | — | — | **introuvable** |
| **I** | **Pros et chiffres de marque (Q8)** | | | | | | | | |
| F31 | Chiffre de marque : part des joueurs en hybride. **Ni source ni saison** sur la page. « 65 % » porte sur « the WTA », sans « top 20 » : le brief écrivait « 65 % des joueuses » | 45 % du top 20 ATP ; 65 % « in the WTA » | L0 (Babolat, « Hybrid stringing: the ideal combination », 28/07/2020 ; expert cité : Lucien Noguès) | https://www.babolat.com/us/news-articles-blog-tennis-hybrid/tennis-hybrid.html | 2026-11-23 | « 45% of players in the top 20 ATP and 65% in the WTA are using this “magic formula.” » | aucun | — | confirmé comme **allégation de marque** : attribuée et datée, ou rien |
| F32 | Même page : un hybride impose un cordage à quatre nœuds, qui tiendrait mieux la tension | qualitatif | L0 (idem F31) | idem F31 | 2026-11-23 | « it implies a string job with four knots. This allows for better tension hold. » | GT-F9 (un seul essai, Racketpedia : 4 nœuds −0,8 kg en 4 h, 2 nœuds −1,1 à −1,3) | — | allégation de marque ; **signal** |
| F33 | Federer en hybride boyau / polyester Luxilon. Tennisnerd (J. Eriksson, 26/01/2018) : « Champions Choice », boyau et ALU Power, sans dire le sens. Tennis.com (J. Levey, 20/07/2025) : « le montage que Federer a popularisé ». La phrase ne nomme pas les cordages ; seul son contexte, un passage sur le boyau en montants, les désigne. Ni l'une ni l'autre ne cite de source primaire. Djokovic, Paul et Zverev : une seule source chacun (Tennis.com 2025) | — | L3 | https://www.tennisnerd.net/?p=7952 ; https://www.tennis.com/news/articles/gear-qa-when-it-comes-to-tennis-string-go-with-your-gut | 2026-11-23 | « Federer strung his racquets with Champions Choice strings, a hybrid of natural gut and Luxilon Alu Power. » · « This was the setup Roger Federer made popular, and Novak Djokovic still employs today. » | les deux ne disent ni la même variante (Rough ou non) ni explicitement le sens | — | ~~**signal** : charte F4 non tenue, aucun joueur citable~~ *Mis à jour le 23/11 (4a, Q-8) : **confirmé pour Federer**, boyau en montants et polyester en travers, par F37 et F38 (deux sources indépendantes et datées, 2009 et 2014), avec F39 en appui ; Djokovic, Paul et Zverev : inchangés, une source chacun* |
| **J** | **Configurateur (Q10)** | | | | | | | | |
| F34 | Libellés et comportement du configurateur, même composant en FR (`/configurator`) et en EN (`/en/configurator`) | FR : champ « Cordage Travers (Hybride optionnel) » ; aide « 💡 Laissez vide pour un cordage uniforme, ou choisissez un autre cordage pour un hybride » ; curseurs « Principal » et « Travers » (15 à 35 kg) ; en-tête « Tension {moyenne arrondie} kg » ; résultats « Montants seuls (X kg): », « Travers seuls (X kg): », « Indice RCS: », puis la mention « estimation pour un hybride, entre X et Y ». EN : « Cross String (optional hybrid) » ; « 💡 Leave empty to use one string throughout, or pick another string for a hybrid » ; « Mains » / « Crosses » ; « Mains only (X kg): », « Crosses only (X kg): », « RCS index: » ; « estimate for a hybrid, between X and Y ». **Tensions par défaut : 24 kg montants, 22 kg travers.** Le cordage de travers n'a pas de jauge propre dans l'indice (F5) | BASE | `src/lib/i18n/configurator.ts` l. 58-91, 184-188, 265-298 ; `src/app/configurator/page.tsx` l. 133-143, 1151, 1305-1336 ; `src/app/en/configurator/page.tsx` | 2026-11-23 (`c30eed7`) | « Cette route rend LE MÊME composant que `/configurator` » (`src/app/en/configurator/page.tsx`) | brief §1, angle 6 | oui | confirmé |
| **K** | **Ajouts du fact-check (4a, 23/11/2026)** | | | | | | | | |
| F35 | Le configurateur affiche un set prémonté comme tout cordage, `{string.type} \| {tx.stiffness}: {string.stiffness} lb/in`, sans mention de dérivation. La fiche produit, elle, marque comme estimée la rigidité d'un set à composition et affiche la mention de `prepackedHybridNotice` (« Rigidité dérivée des deux cordages du set… ») | — | BASE | `src/app/configurator/page.tsx` l. 98, 923 et 1050 ; `src/app/tennis-strings/[slug]/page.tsx` l. 83-91 ; `src/components/product/spec-list.tsx` l. 9 et 44 ; `src/data/prepacked-hybrids.ts` l. 163-167 | 2026-11-23 (`ff3e85a`) | « Une valeur dérivée passe `estimated` et porte une mention explicite. » (`spec-list.tsx`, l. 9) | contredit la réponse à Q-1 sur un point (« Le configurateur […] étiquetée comme telle ») ; vrai pour la fiche produit | oui | confirmé |
| F36 | X-One Biphase en travers, chacun des 45 polyesters mesurés en montants (RA 64, 24/24 kg) | indices 24 (1), 25 (2), 26 (4), 27 (7), 28 (14), 29 (8), 30 (5), 31 (1), 32 (1), 33 (2) ; X-One Biphase intégral : 25. À 25 ou moins : Yonex Poly Tour Air (154,9) → 24 ; Toroline O-Toro (165,7) → 25 ; Toroline O-Toro Snap (164,6) → 25 | BASE | sortie S2 §G (§5) | 2026-11-23 (`ff3e85a`) | — | F10, F11 | oui | confirmé |
| F37 | Federer : boyau en montants, Luxilon ALU Power Rough en travers | — | L3 (Tennis.com, J. Levey, « Winning Combination », 02/10/2009 ; l'article ne cite pas sa source) | https://www.tennis.com/news/articles/winning-combination | 2026-11-23 | « He uses natural gut in his mains, and Luxilon Alu Power Rough in his crosses. » | F38, indépendante ; F39 | — | confirmé (F4, avec F38) |
| F38 | Federer : boyau sur les seize montants, polyester sur les dix-neuf travers, dans un reportage auprès de son cordeur (« Yu » dans l'extrait) | — | L3 (The New Yorker, M. Steinberger, 2014, lu dans l'extrait publié par Longreads le 04/09/2014 ; newyorker.com n'a pas pu être ouvert par l'outil : arrêt sans nouvel essai, F9) | https://longreads.com/2014/09/04/meet-the-team-that-tennis-pros-pay-40k-a-year-to-string-their-rackets/ (lien de la page vers l'original : `newyorker.com/news/sporting-scene/stringing-roger-federers-nine-rackets`) | 2026-11-23 | « Federer was using natural gut for the sixteen main strings and polyester for the nineteen cross strings » | F37, indépendante (2009) ; F39 | — | confirmé (F4, avec F37) |
| F39 | Federer, selon Tennis-X, après sa victoire sur Sam Groth à l'US Open 2014 : boyau en montants, « synthetic » en travers ; un demi-demi boyau et Luxilon depuis 2002-2003, jamais inversé | — | L3 (Tennis-X, T. Gainey, 30/08/2014 ; propos rapportés, sans nom de média ni de conférence) | https://www.tennis-x.com/xblog/2014-08-30/16887.php | 2026-11-23 | « Federer explained his stringing preference of gut in the main, synthetic in the crosses. » · « I’ve never switched Luxilon or gut in the main or the crosses. » | appui de F37 et F38 ; « synthetic » ne dit pas « polyester » | — | appui |

### Calculs de la base : commande et sortie (S1)

Script hors dépôt, non versionné : `C:\Users\plene\AppData\Local\Temp\claude\9519414f725d5b3e\cbc91433-ac54-48b8-b83a-537568efd73b\scratchpad\pig-hybride\dossier-faits.mts`. Il importe, par chemin absolu dans le worktree :
- `setupFirmnessIndex` et `ARM_ALERT_RCS` (`src/lib/advanced-rcs.ts`) ;
- `getStringRecommendation` et `stringsDatabase` (`src/data/strings-database.ts`) ;
- `DEFAULT_RACQUET_RA` (`src/lib/racquet-scoring.ts`) ;
- `STRING_STIFFNESS_PROVENANCE` et `PREPACKED_HYBRIDS`, avec `prepackedHybridStiffness`.

Il lit `REF_TENSION` dans `scripts/qa-ratings.mts`. Il reprend la définition `alignedOnTwu` (F6) sans importer `build-rigidite-figures.mts`, qui écrit des fichiers. Aucun chiffre n'est saisi à la main.

```
$ cd C:\Users\plene\Documents\_wt\redac-hybride && npx --yes tsx <scratchpad>\pig-hybride\dossier-faits.mts
2026-11-23T10:20:59+01:00 · commit c30eed7
A. Montage et grille
  DEFAULT_RACQUET_RA=64 ; REF_TENSION=24 kg ; ARM_ALERT_RCS={"sensitive":32,"standard":35}
  paliers (sondage 0-60) : 0→Très Confortable 20→Confortable 25→Standard 30→Ferme 35→Très Ferme
B. Cordages alignés sur une mesure TWU (définition du † : provenance `appliquee` ou commentaire « Rigidité : TWU « … » »)
  Polyester : 46 sur 102
  Hybrid : 0 sur 9
  Multifilament : 15 sur 45
  Natural Gut : 0 sur 7
  Synthetic : 1 sur 16
  total : 62 sur 179 (provenance 54 ; commentaire seul toroline-o-toro, toroline-absolute, toroline-o-toro-snap, toroline-o-toro-spin, toroline-super-toro, toroline-o-toro-tour, toroline-cash, toroline-snapper)
C. Cordages cités par le brief, statut et rigidité de fiche
  babolat-rpm-blast : 240 lb/in ; statut aucune entrée ; aligné non ; stiffnessByGauge {"1.20":189.2,"1.25":233.7,"1.30":232.6,"1.35":236.6}
  luxilon-alu-power : 230 lb/in ; statut aucune entrée ; aligné non ; stiffnessByGauge {}
  luxilon-alu-power-rough : 230 lb/in ; statut aucune entrée ; aligné non ; stiffnessByGauge {"1.25":209.2}
  head-hawk-touch : 215 lb/in ; statut aucune entrée ; aligné non ; stiffnessByGauge {"1.15":192,"1.20":196}
  yonex-poly-tour-pro : 220 lb/in ; statut aucune entrée ; aligné non ; stiffnessByGauge {"1.20":188.6}
  babolat-rpm-rough : 235 lb/in ; statut aucune entrée ; aligné non ; stiffnessByGauge {}
  babolat-xcel : 155 lb/in ; statut aucune entrée ; aligné non ; stiffnessByGauge {"1.30":150.9}
  babolat-touch-vs : 92 lb/in ; statut aucune entrée ; aligné non ; stiffnessByGauge {}
  wilson-natural-gut : 100 lb/in ; statut aucune entrée ; aligné non ; stiffnessByGauge {"1.25":80.6}
  wilson-nxt-power : 145 lb/in ; statut quarantaine ; aligné non ; stiffnessByGauge {}
  wilson-nxt-control : 162 lb/in ; statut quarantaine ; aligné non ; stiffnessByGauge {}
  solinco-hyper-g-round : absent de la base
  ashaway-monogut-zx : absent de la base
  toroline-truffle-x : absent de la base
D. Exemples, RA 64, 24/24 kg (montants / travers)
  Razor Code (242.9) / X-One Biphase (166.9) : 30 [montants seuls 33, travers seuls 25] « estimation pour un hybride, entre 25 et 33 » Ferme ; inverse 29 Standard ; intégral 33 Ferme / 25 Standard
  ALU Power Soft (197.7) / X-One Biphase (166.9) : 27 [montants seuls 29, travers seuls 25] « estimation pour un hybride, entre 25 et 29 » Standard ; inverse 27 Standard ; intégral 29 Standard / 25 Standard
  Ice Code (221.2) / NRG2 (164) : 29 [montants seuls 31, travers seuls 25] « estimation pour un hybride, entre 25 et 31 » Standard ; inverse 28 Standard ; intégral 31 Ferme / 25 Standard
  Hyper-G (218.3) / Vanquish (160) : 28 [montants seuls 31, travers seuls 24] « estimation pour un hybride, entre 24 et 31 » Standard ; inverse 28 Standard ; intégral 31 Ferme / 24 Confortable
  4G (286.9) / NXT (173.7) : 33 [montants seuls 38, travers seuls 26] « estimation pour un hybride, entre 26 et 38 » Ferme ; inverse 32 Ferme ; intégral 38 Très Ferme / 26 Standard
  O-Toro Tour (216.6) / O-Toro Snap (164.6) : 28 [montants seuls 31, travers seuls 25] « estimation pour un hybride, entre 25 et 31 » Standard ; inverse 28 Standard ; intégral 31 Ferme / 25 Standard
E. Écart de tension (montants/travers, kg)
  Ice Code / NRG2 24/24 : 29 [montants seuls 31, travers seuls 25] « estimation pour un hybride, entre 25 et 31 »
  Ice Code / NRG2 24/22 : 28 [montants seuls 31, travers seuls 24] « estimation pour un hybride, entre 24 et 31 »
  Ice Code / NRG2 23/23 : 28 [montants seuls 31, travers seuls 24] « estimation pour un hybride, entre 24 et 31 »
  Razor Code / X-One Biphase 24/24 : 30 [montants seuls 33, travers seuls 25] « estimation pour un hybride, entre 25 et 33 »
  Razor Code / X-One Biphase 24/22 : 30 [montants seuls 33, travers seuls 24] « estimation pour un hybride, entre 24 et 33 »
  Razor Code / X-One Biphase 23/23 : 30 [montants seuls 33, travers seuls 25] « estimation pour un hybride, entre 25 et 33 »
F. Grille : toutes les paires de cordages alignés, le plus rigide en montants, comparé au sens inverse
  toutes (62) : 1887 paires ; écart sens direct − inverse {"0":1124,"1":745,"2":18} ; palier changé par l'inversion 168 ; baisse vs montants en intégral 0 à 7 pts, palier différent 673
  polyester / multifilament : 665 paires ; écart sens direct − inverse {"0":291,"1":360,"2":14} ; palier changé par l'inversion 61 ; baisse vs montants en intégral 0 à 7 pts, palier différent 372
  polyester / polyester : 1033 paires ; écart sens direct − inverse {"0":683,"1":346,"2":4} ; palier changé par l'inversion 93 ; baisse vs montants en intégral 0 à 6 pts, palier différent 270
  toutes, sans les 8 Toroline : 1428 paires ; écart sens direct − inverse {"0":830,"1":583,"2":15} ; palier changé par l'inversion 131 ; baisse vs montants en intégral 0 à 7 pts, palier différent 515
G. Sets prémontés (PREPACKED_HYBRIDS)
  babolat-hybrid-rpm-blast-vs-touch : publiee ; babolat-rpm-blast + babolat-touch-vs ; fiche 180.8 ; dérivée recalculée 180.8
  wilson-duo-power : publiee ; luxilon-alu-power + wilson-nxt-power ; fiche 196 ; dérivée recalculée 196
  wilson-duo-control : publiee ; luxilon-4g-rough † + wilson-nxt-control ; fiche 222 ; dérivée recalculée 194.4 ; TENUE 222 (dérivée 194.4, 2026-10-26)
  wilson-champions-choice : publiee ; wilson-natural-gut + luxilon-alu-power-rough ; fiche 178 ; dérivée recalculée 178
  wilson-champions-choice-duo : publiee ; wilson-natural-gut + luxilon-alu-power-rough ; fiche 178 ; dérivée recalculée 178
  babolat-hybrid-rpm-blast-xcel : fiche ; babolat-rpm-blast + babolat-xcel ; fiche 206 ; dérivée recalculée 206
  tecnifibre-hybrid-razor-code-x-one : fiche ; tecnifibre-razor-code † + tecnifibre-x-one-biphase † ; fiche 212.5 ; dérivée recalculée 212.5
  tecnifibre-hybrid-ice-code-nrg2 : fiche ; tecnifibre-ice-code † + tecnifibre-nrg2 † ; fiche 198.4 ; dérivée recalculée 198.4
  head-gravity-hybrid : non-publiee ; — ; fiche 178 ; dérivée recalculée —
```

### Introuvable

- **Q1** : une mesure publiée du **poids** de chaque sens dans la fermeté du tamis (F19, F20). La convention 60/40 du site n'a pas de fondement externe (F4).
- **Q2 (b)** : une mesure de la combinaison « profilé en montants, rond en travers » (F23, F24).
- **Q2 (a)** : une seconde source indépendante pour « les montants cassent en premier » (F27). La prescription chiffrée d'un écart de tension reste introuvable (GT-F28).
- **Q5** : la forme de section, en page constructeur ouverte ce jour, des cordages d'exemple hors Toroline (F29).
- **Q7** : un test qui compare un hybride et un intégral des mêmes cordages, en durabilité, casse ou perte de tension (F30).
- **Q8** : un hybride de joueur professionnel tenu par deux sources indépendantes et datées qui disent la même chose (F33). La source et la saison du chiffre Babolat (F31). *Mis à jour le 23/11 (4a) : trouvé pour Federer (F37, F38) ; introuvable pour les autres joueurs.*

### Divergences avec la base (pour `tsa-core`)

Aucune nouvelle divergence de **valeur** entre une source externe et la base : aucune page ouverte ce jour ne donne la rigidité d'un cordage de la base. Les ambiguïtés **internes** à la base passent au §4 :
- Q-3 : statut « mesuré » des 8 fiches Toroline ;
- Q-4 : fiches mesurées par TWU sans entrée de provenance, dont le RPM Blast et le boyau Wilson ;
- Q-5 : valeur tenue du Duo Control et doublon Champion's Choice.

| Produit | Champ | Base | Source externe (niveau, URL) | Écart |
|---|---|---|---|---|
| — | — | — | — | aucun |

### Points glissants repérés

- **« Mesuré » ne qualifie jamais un hybride.** Seules les rigidités de ses deux cordages le sont. L'indice est une estimation dérivée (F3, A-1). L'article ne parle pas d'« indice mesuré d'un hybride ».
- **La « pondération 60/40 » n'est vraie que montants plus rigides.** Avec des montants plus souples, l'indice prend la moyenne 50/50 (F3). Écrire « les montants comptent pour 60 % » sans cette condition serait faux pour un hybride inversé.
- **Pas de comparaison de natures.** Les 76 et 70 RDC du test TW (F20) ne se comparent ni aux lb/in ni à l'indice (charte F2). On peut en tirer le sens, pas un nombre.
- **« Inverser change peu »** doit être chiffré : 0 à 2 points sur ~~1 887~~ **1 826** paires (F17, corrigé le 23/11 au 4a). Cela peut faire changer de palier (F10 : 30 Ferme contre 29 Standard).
- **Le signal classim** (« plus solide qu'un X-One intégral sans perte de confort ») :
  - la base le contredit pour Razor Code / X-One : 30, palier Ferme, contre 25 en intégral (F10) ;
  - elle le nuance pour ALU Power Soft / X-One : 27 contre 25, palier Standard dans les deux cas (F11) ;
  - la durabilité reste introuvable (F30).
- **Confort.** Il ne se dit que par le palier et l'indice, montage nommé (charte F7). 4G / NXT (33, Ferme) ne peut pas être dit confortable. Sa position est un constat : au-dessus du seuil bras sensible (32), sous 35 (F14).
- **Montage nommé et curseurs du configurateur.** Le configurateur part de 24/22 kg (F34) : un lecteur qui y entre Ice Code / NRG2 sans toucher aux curseurs lit 28, pas 29 (F16). L'article doit nommer la tension de ses exemples et dire de régler les deux curseurs à 24 kg pour retrouver ses chiffres.
- **Jauge.** L'indice ignore la jauge choisie (F5). Un exemple ne doit pas laisser croire que l'indice vaut pour « le Razor Code en 1,25 ».
- **Sets.** Aucun indice de set (Q-1). Les deux sets « fiche » Tecnifibre ne sont pas présentés comme des sets (F18). Si l'article cite les compositions, la question du doublon Champion's Choice se pose (Q-5).
- **Exemples Toroline.** Le seul guide récent qui défend le poly/poly profilé/rond déclare un partenariat avec Toroline (F24). L'exemple F15 vient de la base, pas de ce guide. Il ne doit pas se lire comme une recommandation de marque (charte F8), et il tombe si Q-3 répond non.
- **Chiffre Babolat.** Il s'écrit « selon Babolat, en 2020 », sans saison ni source. « 65 % » porte sur « the WTA », pas sur « 65 % des joueuses du top 20 » (F31).
- **Allégations à ne pas reprendre comme des faits** :
  - « les montants cassent d'abord » (F27) ;
  - « quatre nœuds, meilleure tenue de tension » (F32) ;
  - « 4 lb d'écart au plus » et « le plus souple plus tendu » (F25, GT-F22) ;
  - tout hybride de joueur nommé (F33).
- **Santé.** Les deux guides de la SERP qui parlent du bras (TennisCompanion, Tennisnerd) restent des allégations. Aucune source MÉD n'a été cherchée ni trouvée sur un effet d'un hybride sur le bras. L'article n'en écrit aucun (charte F7).

---

## 3. Iconographie — `tsa-pigiste` (candidats) · `tsa-redacteur` (décision)

Voies (charte §4) : **1** photo à licence explicite · **2** visuel généré par
script · **3** illustration générée par l'outil MCP de Pierre (seulement s'il est
connecté). Le visuel qui sert le mieux le lecteur l'emporte. Pour la voie 3, le
rédacteur note ici le prompt employé, puis le recopie dans `CREDITS.md`.

| # | Emplacement | Voie | Page de l'image ou prompt | Auteur | Licence (lue le) | Obligations | Risques (marque, personne, texte incrusté) | Décision du rédacteur |
|---|---|---|---|---|---|---|---|---|
| I1 | couverture (**recommandée**) | 2 | à produire par `scripts/blog-covers/`, comme les `couverture-*.webp` : tamis vu de face, montants d'une teinte et travers d'une autre, dans les verts du site avec l'accent vert-jaune ; sans texte ni cadre reconnaissable | Tennis String Advisor | création du site | une ligne dans `CREDITS.md` ; légende commençant par « Illustration » ; 1200 × 630 pour `og:image` | aucun, si le rendu reste sans texte, sans logo et sans forme de cadre identifiable | **Retenue (voie 2).** `couverture-montage-hybride-fr.webp` et `-en.webp`, 1200 × 630, générées le 23/11 par `scripts/blog-covers/build-covers.py --only couverture-montage-hybride` (nouveau motif `motif_hybrid` : tamis générique, montants blancs, travers vert-jaune). Titre du site seul, aucun chiffre, aucune marque, aucun cadre identifiable ; images ouvertes et regardées avant intégration. Ligne `CREDITS.md` ajoutée. Légende « Illustration : Tennis String Advisor ». |
| I2 | couverture (photo, **non recommandée**) | 1 | https://commons.wikimedia.org/wiki/File:Tennis_string_broken_001.jpg (« Tennis racket with broken cross string ») | Jeuwre (Wikimedia Commons, travail personnel, 04/06/2025) | CC0 1.0 Universal (lue le 2026-11-23) | aucune ; « recadrée » si recadrée (charte §4) ; original 3 744 × 5 616 px, portrait | aperçu de 500 px examiné le 23/11 : cadre rouge et noir reconnaissable, logo sur le cœur, étiquette sur le manche. Tamis d'une seule couleur, donc pas un hybride. La corde de travers cassée suggère un fait non établi (F27). Seul un recadrage serré sur le tamis enlève la marque, et l'image ne sert alors plus le sujet | Écartée : marque reconnaissable, tamis d'une seule couleur (pas un hybride), et la corde cassée suggère un fait non établi (F27). I1 sert mieux le sujet. |
| I3 | couverture (**écartée**) | 1 | https://unsplash.com/photos/a-close-up-of-a-tennis-racket-on-a-table-aYxIwQOtbfg | Franck V. (publiée le 10/12/2021) | Unsplash License, « Free to use under the Unsplash License » (lue le 2026-11-23) | aucune obligatoire | image examinée le 23/11 : logo Yonex et inscriptions lisibles sur le cadre, texte « PRO » sur la housse | Écartée (logo et inscriptions lisibles). |
| I4 | couverture (**écartée**) | 1 | https://unsplash.com/photos/a-close-up-of-a-tennis-racket-on-a-table-I1VRbEHSpw0 | Jonathan Castañeda (publiée le 14/09/2023) | Unsplash License, « Free to use under the Unsplash License » (lue le 2026-11-23) | aucune obligatoire | image examinée le 23/11 : cadre jaune et noir avec un logo sur le pont, pochoir noir sur le tamis, page étiquetée « squash » | Écartée (logo, pochoir, photo de squash). |
| I5 | couverture (secours décoratif seulement) | 1 | https://www.pexels.com/photo/close-up-shot-of-tennis-racket-on-dark-background-29102005/ | Arbiansyah Sulud (publiée le 25/10/2024) | « Free », lien vers la licence Pexels (mention lue le 2026-11-23 ; texte de la licence non rouvert) | crédit conseillé | aperçu de 519 × 750 px examiné le 23/11 : raquette ancienne en métal, tamis d'une seule couleur (pas un hybride), marque au pochoir peut-être visible au centre, portrait à recadrer en 1200 × 630. Ne sert pas le sujet | Écartée : ne sert pas le sujet ; I1 suffit. |
| I6 | corps 1 : schéma montants / travers | 2 | partir de `public/blog/images/schema-hybride-montants-travers-fr.svg` et `-en.svg`, appelés par `<use href>` au §08 de `cordage-mono-vs-multifilament`, et étiqueter chaque sens avec son cordage et sa tension. Exemple tiré du §2 : Ice Code à 24 kg en montants, NRG2 à 22 kg en travers, indice 28 (F16) | Tennis String Advisor | création du site | légende « Schéma Tennis String Advisor » ; aucun fichier dans `CREDITS.md` si le SVG est écrit dans la page | texte en SVG, traduisible ; aucun logo dessiné | **Retenu, adapté.** Bloc `schema` généré par `scripts/blog-covers/build-hybride-figures.mts` (SVG en ligne, `tsa-schema`, thèmes clair et sombre), géométrie reprise du schéma du §08 de `cordage-mono-vs-multifilament`. Exemple Ice Code / NRG2 à **24/24 kg** (seuls 31 et 25, hybride 29 Standard, F12) et non 24/22 kg : même montage que le tableau, comme le demande la consigne (RA 64, 24 kg dans les deux sens). Le cas 24/22 kg (28, F16) est dans le texte (§4 configurateur, §5). Aucun fichier dans `public/blog/images/` ; ligne ajoutée à la section « Graphiques générés depuis la base » de `CREDITS.md`. |
| I7 | corps 2 : graphique « où tombe l'indice d'un hybride » | 2 | script à écrire dans `scripts/blog-covers/`, qui relit la base et le moteur, sur le modèle de `build-rigidite-figures.mts`, qui échoue si le code change. Données exactes dans le tableau ci-dessous | Tennis String Advisor | création du site | date d'état de la base dans la légende (charte F11) ; « estimation, pas une mesure » (F3) | l'exemple O-Toro Tour / O-Toro Snap tombe si Q-3 répond non | **Retenu.** Bloc `graphique` du même script : six exemples (F10 à F15 ; F15 maintenu après la réponse de `tsa-core` à Q-3), montants seuls, travers seuls et estimation, bandes des paliers publiés, seuils d'alerte 32 et 35 posés entre deux entiers. Le script échoue si un cordage d'exemple n'est pas mesuré (Toroline Absolute exclue, Q-3) ; `--check` compare les blocs à la base et vérifie 12 phrases chiffrées par langue et 4 cohérences. Le tableau des exemples est généré par le même script (bloc `tableau`). |
| I8 | corps 3, facultatif : « inverser le sens, changer l'écart autour de la même moyenne » | 2 | tableau-figure (F10, F12, F16, F17) : Ice Code / NRG2 donne 29 à 24/24 kg, 28 à 24/22 kg, 28 à 23/23 kg et 28 dans le sens inverse ; Razor Code / X-One Biphase donne 30 (Ferme) et 29 (Standard) dans le sens inverse ; sur ~~1 887~~ **1 826** paires mesurées (corrigé le 23/11 au 4a, F17), l'inversion change l'indice de 0, 1 ou 2 points | Tennis String Advisor | création du site | même légende que I7 | — | Non produit : l'inversion tient dans la colonne « Sens inverse » du tableau et l'écart de tension dans le texte (§4, §5). Chiffre de grille du texte : **1 826 paires** (réponse de `tsa-core` à Q-3), pas 1 887. |

Photos vues et écartées sans ligne propre :
- `Cordagenoir.jpg` (Commons) : bobine attribuée à Babolat, auteur et source « Babolat » ;
- `Tennis-bespannen (cropped & touched-up).jpg` : machine Tecnifibre, 618 × 320 px ;
- `Tennis strings ruined 001.jpg` (Jeuwre, CC0) : l'original a renvoyé un **429**, l'image n'a donc pas été examinée.

La recherche Commons a parcouru la catégorie « Tennis stringing » (14 fichiers). **Aucune photo libre ne montre un tamis hybride sans marque** : la couverture passe par la voie 2, comme le brief le suggérait. La voie 3 est fermée : l'outil de Pierre n'est pas connecté à cette session.

**Données du graphique I7.** Montage RA 64, 24/24 kg, sortie S1 du §2 au 23/11/2026, commit `c30eed7`.

| Hybride (montants / travers), rigidités en lb/in | Montants seuls | Travers seuls | Hybride (estimation) | Palier | Sens inverse | Fait |
|---|---|---|---|---|---|---|
| Tecnifibre Razor Code † 242,9 / Tecnifibre X-One Biphase † 166,9 | 33 | 25 | 30 | Ferme | 29 (Standard) | F10 |
| Luxilon ALU Power Soft † 197,7 / Tecnifibre X-One Biphase † 166,9 | 29 | 25 | 27 | Standard | 27 (Standard) | F11 |
| Tecnifibre Ice Code † 221,2 / Tecnifibre NRG2 † 164 | 31 | 25 | 29 | Standard | 28 (Standard) | F12 |
| Solinco Hyper-G † 218,3 / Solinco Vanquish † 160 | 31 | 24 | 28 | Standard | 28 (Standard) | F13 |
| Luxilon 4G † 286,9 / Wilson NXT † 173,7 | 38 | 26 | 33 | Ferme | 32 (Ferme) | F14 |
| Toroline O-Toro Tour † 216,6 / Toroline O-Toro Snap † 164,6 | 31 | 25 | 28 | Standard | 28 (Standard) | F15, sous réserve de Q-3 |

Le fond du graphique porte :
- les bandes des paliers : < 20, 20-24, 25-29, 30-34, ≥ 35 ;
- les lignes des seuils d'alerte : 32 (bras sensible déclaré) et 35 (F2).

L'intégral de chaque cordage est la borne « seul » de la même ligne : au même montage, l'indice d'un intégral est celui de ce cordage seul (sortie S1 §D).

---

## 4. Questions ouvertes

- **A-1** · arbitrage de l'orchestrateur (délégation de Pierre du 23/11/2026, citée en en-tête) · 2026-11-23 — **Chiffrer ou non la fermeté d'un hybride ?** `cordage-polyester-tennis-elbow` §6 (26/10/2026) refuse de la chiffrer : « seuls 15 de nos 45 multifilaments ont une rigidité alignée sur une mesure de laboratoire, et un set prémonté n'a pas de mesure propre dans notre base ; un indice calculé dessus afficherait une précision qu'il n'a pas ». Le configurateur affiche pourtant l'indice d'un hybride monté à la main (`setupFirmnessIndex`, « estimation pour un hybride, entre X et Y »).
  - **Décision** : l'article chiffre **seulement** les hybrides dont les **deux** cordages ont une rigidité alignée sur une mesure de laboratoire (le pigiste et `tsa-core` disent lesquels, d'après la base). Le chiffre est présenté comme le fait le configurateur : une **estimation dérivée des mesures de chaque cordage**, en fourchette, jamais comme une mesure du montage (règle 3). Pas de chiffre pour un hybride dont un cordage n'a pas de rigidité mesurée (boyau naturel compris) : l'article le dit et dit pourquoi. Les sets prémontés reprennent la rigidité dérivée de `prepacked-hybrids.ts` avec son étiquette, ou rien si la composition n'est pas publiée. Aucune formule ni pondération RCS ne change.
  - **Pourquoi** : la raison du refus du 26/10 est la fausse précision ; elle tient pour les cordages sans mesure et pour un indice présenté seul, pas pour une fourchette étiquetée sur deux cordages mesurés, que le configurateur publie déjà. Écrire l'article sans aucun chiffre laisserait l'outil seul à les donner, sans explication.
  - **Suite** : la phrase du 26/10 reste vraie pour cet article-là ; `tsa-acquisition` propose au 4b un lien de ce §6 vers le nouvel article (circuit court, dans la même PR).
- **A-2** · arbitrage de l'orchestrateur · 2026-11-23 — **Sources.** Les vidéos et fils de forum du classeur de veille sont des **signaux** (questions des joueurs), jamais des sources de faits : les testeurs cités sont vendeurs, affiliés ou partenaires des marques. Un hybride de joueur professionnel n'est cité qu'avec deux sources (F4) ; sinon il n'est pas cité.
- **Q-1** · `tsa-acquisition` → orchestrateur · 2026-11-23 — **A-1 et les sets prémontés : deux clauses qui se contredisent.**
  - **Le constat**, relevé le 23/11 dans `prepacked-hybrids.ts` et `string-stiffness-provenance.ts` et à confirmer par le pigiste (Q3 et Q6 du §1). **Aucun des 5 sets à composition publiée n'a ses deux cordages à rigidité alignée sur une mesure** :
    - RPM Blast + Touch VS : le RPM Blast n'a pas le statut `appliquee`, le Touch VS est un boyau ;
    - Duo Power : l'ALU Power n'a pas ce statut, le NXT Power est en quarantaine ;
    - Duo Control : le 4G Rough est mesuré, le NXT Control est en quarantaine, et la valeur du set est tenue à 222 ;
    - Champion's Choice et Champion's Choice Duo : boyau Wilson et ALU Power Rough, tous deux sans statut.

    À l'inverse, les deux sets « fiche » de Tecnifibre (Razor Code + X-One Biphase, Ice Code + NRG2) ont leurs deux cordages mesurés, mais leur composition n'est pas établie.
  - **La contradiction.** La clause « pas de chiffre pour un hybride dont un cordage n'a pas de rigidité mesurée » exclut les 5 sets publiés ; la clause « les sets prémontés reprennent la rigidité dérivée de `prepacked-hybrids.ts` avec son étiquette » les chiffre. Or `cordage-tennis-elbow` publie déjà l'indice de RPM Blast + VS Touch (27).
  - **Question** : un set publié dont un cordage n'est pas mesuré se cite-t-il avec sa rigidité dérivée étiquetée, ou sans chiffre ?
  - **Avis d'acquisition**, sur la seule découvrabilité : l'intention est de composer son hybride. L'article tient sans chiffrer les sets, et les montages faits à la main avec deux cordages mesurés suffisent aux exemples, Razor Code + X-One et Ice Code + NRG2 compris, montés hors set.
  - Non bloquant pour l'étape 2 ; bloquant pour la section « sets » de l'étape 3.
  - → orchestrateur, 2026-11-23 (délégation de Pierre) : **sans chiffre.** Un set prémonté n'est chiffré dans l'article que si ses deux cordages ont une rigidité alignée sur une mesure ; aujourd'hui, aucun des 5 sets à composition publiée ne l'est. L'article peut citer leur composition sourcée (utile au lecteur) et dit en une phrase pourquoi il ne leur donne pas d'indice. Le configurateur et `cordage-tennis-elbow` §3 affichent une rigidité de fiche ou dérivée, étiquetée comme telle ; ce n'est pas une mesure du set, puisqu'au moins un de ses deux cordages n'est pas mesuré. La phrase n'invalide pas ces pages et ne les contredit pas : elle dit le statut de leur chiffre. Les deux sets « fiche » de Tecnifibre ne sont pas présentés comme des sets, faute de composition établie. Razor Code + X-One Biphase et Ice Code + NRG2 peuvent servir d'exemples **montés à la main**, sans les attribuer à ces sets. La clause d'A-1 sur les sets prémontés est remplacée par cette réponse. `cordage-tennis-elbow` n'est pas modifié dans cette PR.
- **Q-2** · `tsa-acquisition` → orchestrateur · 2026-11-23 — **`guide-materiel-tennis` §5 cite trois hybrides de pros sans source de page** (Federer, Djokovic, Serena Williams). A-2 et F4 interdisent d'en citer un sans deux sources indépendantes.
  - Ce §5 recevra un lien vers le nouvel article. Le site afficherait alors d'un côté des hybrides de pros sans source, de l'autre un article qui refuse de les citer.
  - **Question** : faut-il ouvrir un circuit court sur ce §5 (vérification F4 par le pigiste, puis coupe ou source par le rédacteur), dans la même PR que le lien entrant ou à part ?
  - Non bloquant pour l'étape 2. Sans réponse, je retire ce lien entrant de la liste au 4b.
  - → orchestrateur, 2026-11-23 : **pas de circuit court dans cette PR, et pas de lien entrant depuis `guide-materiel-tennis` §5.** Corriger ce §5 sort du périmètre de l'article. Ce correctif fait partie de la refonte du guide matériel (proposition P3 du 23/11, soumise à Pierre, sans GO à ce jour), où les trois hybrides de pros seront sourcés selon F4 ou retirés, et où le lien vers le nouvel article sera posé. L'orchestrateur signale le point à Pierre.
- **Q-3** · `tsa-pigiste` → `tsa-core` · 2026-11-23 — **Les 8 fiches Toroline comptent-elles comme « mesurées » au sens d'A-1 ?**
  - **Le constat** (F6, F7) :
    - `alignedOnTwu`, dans `scripts/blog-covers/build-rigidite-figures.mts`, les compte comme alignées sur TWU. Sa raison : un commentaire « Rigidité : TWU « … » » dans la base. Le script le présente comme « la même définition que le marqueur † des tableaux » ;
    - ces fiches n'ont pourtant aucune entrée dans `string-stiffness-provenance.ts`, donc pas de contrôle 13 ter ;
    - `toroline-o-toro-tour` porte deux jauges (1,23 et 1,20) pour une seule mesurée (216,6 en 1,23) : c'est une couverture partielle, que la provenance noterait « valeur plancher ».
  - **Question** : un hybride dont un cordage est une fiche Toroline peut-il être chiffré dans l'article (exemple F15, O-Toro Tour / O-Toro Snap) ?
  - **Sans réponse** : le rédacteur retire F15. Les chiffres de grille valables sont alors ceux de la ligne « sans les 8 Toroline » (F17 : 1 428 paires, inversion de 0 à 2 points). Non bloquant pour l'étape 3.
  - → `tsa-core`, 2026-11-23 : **oui pour 7 fiches sur 8, non pour Toroline Absolute ; l'exemple F15 (O-Toro Tour / O-Toro Snap) tient.** Établi au commit `18d657e` en rejouant l'appariement strict des contrôles 13 ter et 13 quater (`scripts/qa-ratings.mts` l. 1575-1587 et 1897-1908) sur `data/reference/twu-releve-complet.json`. Script et sortie hors dépôt : `C:\Users\plene\AppData\Local\Temp\claude\9519414f725d5b3e\cbc91433-ac54-48b8-b83a-537568efd73b\scratchpad\core-hybride\q3-q5.mts` et `sortie.txt`.
    - **Oui, jauge unique mesurée** : O-Toro (165,7), O-Toro Snap (164,6), O-Toro Spin (173,2), Super Toro (189,7), Cash (182,9), Snapper (190,9). La rigidité de chaque fiche est l'unique ligne TWU du modèle exact à la jauge nominale de la fiche (polyester, 51 lbs, Fast), identique dans les deux copies versionnées du relevé. Le contrôle 13 quater vérifie déjà leur `stiffnessByGauge` contre ce relevé : elles sont parmi les « 61 fiches égales au maximum de leur table » (`npm run audit:ratings` du 23/11, vert). Il ne leur manque que l'entrée de provenance (`appliquee`, règle `jauge-unique`) : c'est un défaut d'écriture, pas de mesure. Le † de l'O-Toro dans `cordage-tennis-elbow` §3 est donc juste.
    - **Oui, avec une couverture partielle** : O-Toro Tour (216,6, mesurée en 1,23 ; la 1,20 de la fiche n'est pas mesurée, `src/data/strings-database.ts` l. 3530-3531). C'est le cas de Mach-10, d'Ice Code ou d'Hyper-G (F13), qui sont `appliquee` avec la mention « valeur plancher » (`src/data/string-stiffness-provenance.ts` l. 315, 429 et 435). Réserve de F5 : l'exemple ne vaut pas « en 1,20 ».
    - **Non : Toroline Absolute (180,6).** Sa ligne TWU, « Toroline Absolute 17 (1.20) », n'a pas de jauge nominale ; seul l'intitulé porte 1,20 (la base le dit, `strings-database.ts` l. 3466). Or l'appariement strict exige la jauge nominale (13 ter l. 1576 et 1639-1640 ; 13 quater l. 1898). La fiche n'a donc pas de table, et une entrée `appliquee` ferait échouer 13 ter. `alignedOnTwu` (`scripts/blog-covers/build-rigidite-figures.mts` l. 101-103) la compte sur le seul commentaire. Elle n'est dans aucun exemple de l'article.
    - **Chiffres à reprendre** (même méthode que S1 §F, sans Absolute) : **61 cordages mesurés sur 179** (polyesters 45 sur 102 ; multifilaments 15 ; synthétiques 1 ; boyaux 0 ; sets 0). Grille F17 : **1 826 paires** ; l'inversion change l'indice de 0, 1 ou 2 points (1 086 / 723 / 17 paires) et le palier dans 162 cas. Polyester/multifilament : 650 paires (280 / 356 / 14) ; palier changé par l'inversion : 60 ; palier différent des montants en intégral : 372 ; baisse de 0 à 7 points. Les conclusions ne changent pas. Le chiffre « 1 887 paires » de F17 et de I8 devient 1 826.
    - Correction de la base : chantier (a), proposé sous Q-5. Hors de cette PR.
- **Q-4** · `tsa-pigiste` → `tsa-core` · 2026-11-23 — **Fiches mesurées par TWU sans entrée de provenance.**
  - **Le constat** (F8, F9) : ces fiches ont une `stiffnessByGauge` tirée du relevé TWU, mais leur rigidité de fiche dépasse la plus haute mesure et elles n'ont aucune entrée de provenance :
    - RPM Blast : 240 contre 236,6 au plus, ses 4 jauges étant mesurées ;
    - boyau Wilson : 100 contre 80,6 ;
    - ALU Power Rough : 230 contre 209,2 ;
    - Xcel : 155 contre 150,9 ;
    - Poly Tour Pro : 220 contre 188,6 ;
    - Hawk Touch : 215 contre 196.
  - L'en-tête de `string-stiffness-provenance.ts` dit qu'une fiche « dont la valeur C serait INFÉRIEURE à l'actuelle » relève du statut `retenue-jauge`. Aucune entrée n'a ce statut aujourd'hui.
  - **Questions** :
    1. Cette absence est-elle voulue ?
    2. L'article peut-il écrire, pour dire pourquoi il ne chiffre pas un hybride à boyau, que « la rigidité de fiche du boyau n'est pas alignée sur une mesure de laboratoire » ?
  - Rien ne change dans les exemples : ces cordages restent non chiffrés. Non bloquant.
  - → `tsa-core`, 2026-11-23 : **non, ces fiches ne sont pas « mesurées » au sens d'A-1. La valeur est voulue, l'absence de trace ne l'est pas, et elles sont 40, pas 6.**
    - **Pourquoi non** : l'indice lit la rigidité de fiche (F5). Pour ces six fiches, c'est l'ancienne valeur sans source, au-dessus de toutes leurs jauges mesurées (`src/data/strings-database.ts` : RPM Blast l. 98, boyau Wilson l. 495, ALU Power Rough l. 1931, Xcel l. 916, Poly Tour Pro l. 300, Hawk Touch l. 428). Aucune surface du site ne lit leur table par jauge avant D2/D3.
    - **La valeur est voulue** : aligner ces fiches sur la mesure ferait BAISSER leur rigidité et retirerait des alertes. La règle 2 et la décision de Pierre du 10/10 l'interdisent sans GO donné fiche par fiche (`src/data/string-stiffness-provenance.ts` l. 17-18). Le seul GO de baisse (P6, 26/10) portait sur les 13 fiches qui remplissaient les trois critères de la mesure AD : toutes les jauges mesurées, appariement strict, série non suspecte (`CLAUDE.md` l. 152-159). Aucune des six ne les remplit :
      - le RPM Blast a ses 4 jauges mesurées, mais sa série est suspecte (1,25 = 233,7 > 1,30 = 232,6) ;
      - la jauge 1,30 du boyau Wilson est ambiguë (deux lignes TWU, 96,6 et 92,6) ;
      - les quatre autres ont des jauges non mesurées.
    - **La trace manque** : le statut `retenue-jauge` est prévu pour ce cas exact (en-tête, l. 26-27), mais il n'a jamais été écrit. `audit:ratings` du 23/11 le montre : 13 ter annonce « 0 retenues car C baisserait », tandis que 13 quater compte « 40 à valeur de fiche supérieure (baisse sans GO : non appliquée) », sans les nommer. Ce sont 22 polyesters, 12 multifilaments, 4 synthétiques et 2 boyaux ; aucun ne remplit les critères de P6. Les six de Q-4 en font partie.
    - **Question 2 : oui**, sous cette forme : « la rigidité que notre base retient pour le boyau n'est pas alignée sur une mesure de laboratoire ». C'est vrai des 7 boyaux de la base (0 sur 7, F7). Deux limites :
      - ne pas écrire que le boyau n'a jamais été mesuré : TWU l'a mesuré ;
      - ne calculer aucun indice avec 80,6 ni avec une rigidité de jauge. Ce serait publier une baisse non validée (règle 2), sur une jauge que l'indice ignore (F5).
    - Correction de la base : chantier (b), proposé sous Q-5. Hors de cette PR.
- **Q-5** · `tsa-pigiste` → `tsa-core` · 2026-11-23 — **Sets prémontés : valeur tenue et doublon** (F18).
  1. **Wilson Duo Control.** La fiche est tenue à 222 depuis le 26/10, pour une valeur dérivée de 194,4, en attente d'un GO de Pierre. Est-ce toujours l'état voulu ?
  2. **Champion's Choice et Champion's Choice Duo.** Les deux fiches ont la même composition (boyau Wilson et ALU Power Rough) et la même valeur (178). Leurs sources diffèrent : TW pour l'une, TennisCompanion pour l'autre. Est-ce un même produit sous deux noms ?
  - **Sans réponse** : l'article cite la composition une seule fois, sous le nom de la source L2 (« Champion's Choice », Tennis Warehouse), et ne dit rien du « Duo ».
  - Non bloquant pour l'étape 2 ; à trancher avant la phrase « sets » de l'étape 3.
  - → `tsa-core`, 2026-11-23 :
    - **1. Duo Control : oui, toujours tenu à 222.**
      - Où : `src/data/prepacked-hybrids.ts` l. 91-94 (`held` du 26/10) ; fiche à `src/data/strings-database.ts` l. 3105.
      - Valeur dérivée recalculée ce jour : 194,4 (4G Rough à 216, `appliquee` ; NXT Control à 162, en quarantaine).
      - Le contrôle 24 accepte la tenue (« sauf 1 tenue(s) datée(s) au-dessus (règle 2 : wilson-duo-control) », `audit:ratings` du 23/11).
      - Aucun GO depuis : le dernier commit sur le fichier est `c0a0811` (26/10), et `origin/main` (`dba4f8d`) n'a pas bougé.
      - C'est l'état qu'exige la règle 2 tant que Pierre n'a pas tranché. L'effet de la baisse, relevé le 26/10, serait de −16 alertes standard, −274 bras sensible et −198 compatibilité (`CLAUDE.md` l. 162-163) ; il est à remesurer avant tout GO.
      - **Pour l'article** : ni 222, ni 194,4, ni le mot « tenue ». Le set ne se chiffre pas de toute façon : NXT Control n'est pas mesuré (A-1, Q-1). Composition citable : Luxilon 4G Rough 1,25 + Wilson NXT Control 16, sens au choix (Tennis Warehouse, L2, lu le 23/10).
    - **2. Champion's Choice et Champion's Choice Duo : doublon probable, non établi.**
      - En commun : la composition (boyau Wilson + ALU Power Rough), le sens au choix, les jauges de fiche (1.25/1.30) et la valeur dérivée (178).
      - Différents : le nom ; la source (Tennis Warehouse, « Champions Choice Hybrid 16 », L2 ; TennisCompanion, « Champion's Choice Duo », L3) ; le prix (45 € et 32 €) ; le coloris ; les notes /10, sans source.
      - Un indice : le 22/10, le catalogue Wilson ne listait que le « Champion's Choice Duo » (`scripts/scraper/product-images-mapping.json` l. 141 et 279).
      - Mais aucune page ouverte ne dit que les deux noms désignent le même produit. La base écrit elle-même « doublon probable, fusion à arbitrer » (`prepacked-hybrids.ts` l. 110 ; `CLAUDE.md` l. 97-98). Je ne tranche pas à la plausibilité (C5).
      - **Pour l'article** : le repli prévu par Q-5 est juste. La composition se cite une fois, sous le nom que lui donne sa source, sans dire ni nier que le « Duo » est le même set.
      - **Piège** : la fiche `wilson-champions-choice` (`strings-database.ts` l. 201-202) fixe un sens (« boyau naturel en montants ») et un joueur (« Roger Federer »), sans source. Or la source donne les deux sens (`orderFixed: false`), et F33 ne tient aucun joueur. L'article ne les reprend pas.
    - **Chantiers de base pour plus tard, hors de cette PR.** Chacun relève de `tsa-core`, a sa propre PR et finit avec `npm run audit:ratings` à 0. Depuis C3, le TypeScript fait foi : rien à reporter dans Supabase.
      - (a) **Toroline** :
        - écrire 6 entrées `appliquee` en `jauge-unique`, et O-Toro Tour en `plus-rigide` (couverture partielle) ;
        - la baisse de l'O-Toro (210 → 165,7 : `fa8594d`, PR #62 fusionnée le 29/09, avant la règle du 10/10) se consigne en `loweringApprovedBy` ou va à Pierre, sinon 13 ter échoue (l. 1656) ;
        - Absolute part en quarantaine ou reçoit une exception datée. Si elle reste non mesurée, son † et le décompte « 46 polyesters » des articles publiés se recalculent par `build-rigidite-figures.mts` (circuit court) ;
        - enfin, `alignedOnTwu` ne lit plus que la provenance : une seule définition, contrôlée.
      - (b) **Les 40 fiches** « à valeur de fiche supérieure » passent en `retenue-jauge`, pour que l'audit les nomme (RPM Blast : série suspecte en plus).
      - (c) **Duo Control** : dossier de GO pour Pierre (222 → 194,4), avec un effet remesuré.
      - (d) **Champion's Choice** :
        - dossier C5 (deux noms, sources, prix, coloris) ;
        - si Pierre tranche « même produit », fusion avec alias et plancher, sur le modèle de `tecnifibre-4s` ;
        - retirer de la description le sens et le joueur non sourcés.
- **Q-6** · `tsa-pigiste` → orchestrateur · 2026-11-23 — **Le fact-check de l'étape 4 ne pourra pas contrôler les indices d'hybride par `redaction:valeurs`.**
  - **Le constat** : `scripts/redaction/verifier-valeurs.mts` n'accepte que `rcs <raquette> + <cordage> @ <kg>`. Il ne connaît ni l'hybride, ni le montage de référence sans raquette nommée (RA 64).
  - **Proposition** : à l'étape 4, ajouter à mon outil une ligne `rcs ref + <montants> / <travers> @ <tm>/<tc> | rcs | <valeur>`, qui appelle `setupFirmnessIndex`. Le contrôle devient plus strict, jamais plus souple. Sinon, le contrôle des chiffres F10 à F16 se fera en relançant le script S1, dont la sortie sera collée au §5.
  - **Question** : GO pour cette évolution à l'étape 4 ? Le brief de l'étape 2 m'interdisait tout autre fichier. Non bloquant pour l'étape 3.
  - → orchestrateur, 2026-11-23 : **pas d'extension de `redaction:valeurs` dans cette PR.** Au 4a, le fact-check relance le moteur réel (le script `dossier-faits.mts` du scratchpad, ou son équivalent) sur **chaque** indice et chaque borne du texte FR et EN final, et colle au §5 la commande et la sortie, avec la date et le commit. Le contrôle est aussi strict, et la PR reste limitée à l'article. L'extension du vérificateur aux hybrides est un chantier séparé de `tsa-pigiste` (propriétaire de `scripts/redaction/`) ; l'orchestrateur la propose à Pierre après la fusion.
- **Q-7** · `tsa-redacteur` → `tsa-acquisition` · 2026-11-23 — **Passe on-page (4b) : ce que j'ai posé, ce qui reste à toi.**
  - `<head>` de départ posé d'après le §1 : title, meta, H1 (celui du §1), canonical, hreflang réciproques, og et twitter (couverture 1200 × 630), JSON-LD Article / BlogPosting avec `citation`, et `FAQPage` recopiée mot pour mot de la FAQ visible (`audit:jsonld` ne relève aucun écart de FAQ). Tout est à réviser par toi.
  - Une `citation` s'écarte du titre exact : la page Babolat s'intitule « Hybrid stringing: the ideal combination ». « ideal combination » déclenche le motif `absolu/parfait-ideal-en` d'`audit:claims` (AVERT) ; le texte visible dit « page de blog sur le cordage hybride » (EN « blog page on hybrid stringing ») et la `citation` « Hybrid stringing (Babolat blog) ». À garder ou à remplacer par le titre exact, à ton choix.
  - À faire : `src/app/sitemap.ts` (`BLOG_ARTICLES`, `EN_BLOG_ARTICLES`, `modified` = 2026-11-23) et les deux index du blog. D'ici là, `audit:jsonld` échoue sur ces deux lignes, comme prévu.
  - Maillage entrant posé dans cette PR, une phrase chacun, sans changement de chiffre ni de date : `cordage-mono-vs-multifilament` §08 et `polyester-vs-multifilament-strings`, `guide-tension-cordage-tennis` §3 et `tennis-string-tension-guide` §3 (la page EN n'a pas d'ancre de section : lien vers la page). **Non posés** : `cordage-polyester-tennis-elbow` §6 / `polyester-strings-tennis-elbow` §6, que le §1 et A-1 renvoient à ta proposition du 4b (je l'appliquerai au 5) ; `cordage-tennis-elbow` / `best-tennis-strings-for-tennis-elbow`, non modifiés selon la réponse à Q-1 ; `guide-materiel-tennis` §5 (Q-2).
  - → `tsa-acquisition`, 2026-11-23 : **`<head>` repris, sitemap et index faits, `audit:jsonld` vert.** Détail et sorties au §6.
    - **Conservé** : title, meta, canonical, H1, slugs, hreflang, `Article` / `BlogPosting`, `BreadcrumbList`, `FAQPage` (4 questions identiques à la FAQ visible). Dates : 2026-11-23, celle de la page.
    - **Modifié** : espaces insécables (charte §5) dans la meta, `og`, `twitter` et les `alt` de partage ; `og:title` et `twitter:title` raccourcis (FR 63 caractères au lieu de 89, EN 68 au lieu de 103), car les cartes de partage coupent le H1.
    - **`citation` Babolat** : « Hybrid stringing », le titre principal de la page sans son sous-titre. « the ideal combination » est une formule de la marque que le site ne reprend pas, et qui déclencherait `parfait-ideal-en`. L'URL identifie la page.
    - **Trois autres `citation` portaient un libellé descriptif**, pas le titre de la page (pages ouvertes le 23/11) :
      - `COF.php` : « Static Friction and Spin » (août 2010, révisé en février 2011) ;
      - `slidingCOF.php` : « Sliding Friction and Spin » ;
      - test TW : « Klip X-Plosive Tennis String Review ».

      Holabird porte désormais son titre complet, « Ask the Stringer: Why Are My Crosses Wearing Out so Quickly? ».
    - **hreflang** : `fr`, `en` et `x-default` vers le FR, et non `fr-FR` / `en-US`. C'est la convention des 37 articles du blog ; les codes régionaux ne servent qu'aux routes Next et aux fiches EN générées. `fr` vise tous les francophones.
    - **Lien depuis `cordage-polyester-tennis-elbow` §6** : proposé au §6 (P1), FR et EN.
- **Q-8** · `tsa-redacteur` → orchestrateur (copie `tsa-pigiste`) · 2026-11-23 — **Deux articles qui reçoivent un lien entrant citent un hybride de pro sans source.** Non bloquant.
  - `cordage-mono-vs-multifilament` §08 (« le célèbre montage de Roger Federer ») et `polyester-vs-multifilament-strings` (« Roger Federer's famous gut mains, poly crosses ») nomment un joueur que F33 ne tient pas (charte F4). Le même §08 écrit « la combinaison la plus courante en club » sans source au dossier. C'est le cas de Q-2, sur deux articles qui recevront désormais un lien vers le nouvel article.
  - **Question** : circuit court séparé (vérification par le pigiste, coupe ou source par le rédacteur), ou rattachement à P3 ? Je n'ai rien touché d'autre que la phrase du lien.
  - Pour information, sans contradiction : `cordage-tennis-elbow` l. 499 écrit « Nous n'avons aucune mesure indiquant si le cordage souple travaille mieux en montants ou en travers ». C'est toujours vrai ; F20 établit seulement un sens de raideur du tamis, sur un essai.
  - → orchestrateur, 2026-11-23 : **circuit court dans cette PR, limité à la mention de Federer** de `cordage-mono-vs-multifilament` §08 (l. 618, plus la ligne de sources l. 664) et de son pendant EN (`polyester-vs-multifilament-strings`, l. 387 et 464). Contrairement à `guide-materiel-tennis` §5 (trois joueurs et une refonte entière, renvoyés à P3), il s'agit ici d'une phrase dans le paragraphe même qui reçoit le lien.
    - **Au 4a**, `tsa-pigiste` vérifie si deux sources indépendantes et datées (F4, pages ouvertes, jamais une URL devinée) établissent ce montage.
    - **Au 5**, `tsa-redacteur` agit selon le résultat :
      - si les deux sources existent, il les cite à la place des noms de sites ;
      - sinon, il retire le nom du joueur et garde la configuration décrite comme un usage (« boyau en montants, polyester en travers »), sans autre retouche.
    - **Date** : `dateModified` et date visible suivent la charte (F11) selon que le fait change ou non.
  - → `tsa-pigiste`, 2026-11-23 (4a), **à `tsa-redacteur`** : **F4 tenu pour Federer, boyau en montants et polyester en travers.** Deux sources indépendantes et datées, pages ouvertes le 23/11 (F37 et F38 du §2) :
    - **Tennis.com**, Jon Levey, « Winning Combination », 2 octobre 2009 : https://www.tennis.com/news/articles/winning-combination — « He uses natural gut in his mains, and Luxilon Alu Power Rough in his crosses. »
    - **The New Yorker**, Michael Steinberger, 2014, lu dans l'extrait publié par Longreads le 4 septembre 2014 : https://longreads.com/2014/09/04/meet-the-team-that-tennis-pros-pay-40k-a-year-to-string-their-rackets/ — « Federer was using natural gut for the sixteen main strings and polyester for the nineteen cross strings ». La page de The New Yorker n'a pas pu être ouverte par l'outil : arrêt sans nouvel essai (F9). À citer comme « The New Yorker (2014), cité par Longreads », avec le lien de Longreads.
    - En appui, les propos de Federer rapportés par **Tennis-X** (Tom Gainey, 30 août 2014) : https://www.tennis-x.com/xblog/2014-08-30/16887.php — « Federer explained his stringing preference of gut in the main, synthetic in the crosses. » (F39).
    - **Pour la phrase corrigée** :
      - dater le montage (F11), par exemple « selon Tennis.com en 2009 et The New Yorker en 2014 », jamais au présent : ces pages ne disent rien d'après 2014 ;
      - « mono aux travers » / « poly crosses » est tenu : les deux sources disent polyester, et Tennis.com nomme l'ALU Power Rough ;
      - la réserve pro stock de F4 porte sur le cadre ; pour un cordage, la date en tient lieu ;
      - ne pas en tirer que le set Champion's Choice « est » le montage de Federer (Q-5).
    - **Hors de Q-8, non vérifié et non demandé** : la suite des deux phrases (« privilégie le toucher avec un soupçon de contrôle — mais il s'use vite chez les gros lifteurs » ; « prioritises touch with a hint of control, but it wears out fast for heavy topspin players ») et « la combinaison la plus courante en club » n'ont aucun fait au dossier. L'orchestrateur a limité le circuit court à la mention de Federer : je les signale sans demander de coupe.
    - **Conséquence pour le nouvel article** : sa FAQ sur les joueurs professionnels écrit qu'« aucun montage de professionnel ne réunit deux sources indépendantes ». C'est devenu faux : correction C10 du §5.

- **A-3** · arbitrage de l'orchestrateur · 2026-11-23 — **La phrase sur Federer dans les articles existants.** Le fact-check (4a) établit le montage de Federer par deux sources (réponse sous Q-8). Il relève aussi que la suite de la même phrase n'a aucune source : « il s'use vite chez les gros lifteurs » (`cordage-mono-vs-multifilament` §08, l. 618) et « it wears out fast for heavy topspin players » (`polyester-vs-multifilament-strings`, l. 387).
  - **Décision.** Dans les seules phrases retouchées par Q-8, **rien ne reste sans source**. Le montage est cité daté, avec ses deux sources (ou sa source principale et un renvoi vers le dossier), jamais au présent. La fin non sourcée est retirée.
  - **Périmètre.** Les autres phrases de ces articles ne sont pas touchées. « La combinaison la plus courante en club » et ses équivalents relèvent d'un circuit court séparé, signalé à Pierre.
  - **Pourquoi.** Poser deux sources sur une phrase qui garde une affirmation non sourcée ferait croire que tout est sourcé.
  - → orchestrateur, 2026-11-23, après la passe finale (`8d4f1c6`) : **retrait validé** de « le célèbre » et de « privilégie le toucher avec un soupçon de contrôle » (EN « famous », « prioritises touch with a hint of control »), retirés dans la même phrase par le rédacteur. Aucun n'avait de source ; c'est l'application d'A-3 et non un écart. Les dates (`dateModified` 2026-11-23) des deux articles suivent la charte.
- **A-4** · arbitrage de l'orchestrateur · 2026-11-23 — **Federer dans le nouvel article.** Il passe désormais la règle d'A-2. Le rédacteur choisit de le citer ou non (correction C10). S'il le cite, c'est daté (2009 et 2014), avec la réserve pro stock (F4), sans en tirer de conseil pour le lecteur.

---

## 5. Fact-check final — `tsa-pigiste`

*Passe du 2026-11-23 (étape 4a, circuit complet), sur le worktree au commit `ff3e85a`. Le corps des deux articles y est celui de `246dba2` : la passe 4b n'a touché que le `<head>`, les index et le sitemap. Articles lus en entier, FR et EN : texte, tableaux, légendes, SVG en ligne (titres, libellés, données), FAQ visible et `FAQPage`. Faits ajoutés ou corrigés au §2 ce jour : F7, F15, F17, F24, F25, F29, F33 corrigés ; F35 à F39 ajoutés.*

**Verdict : corrections demandées, 13 (C1 à C13 ci-dessous).**
- **Les chiffres du moteur sont tous justes.** Deux implémentations indépendantes (S2 et `--check` / `--facts`) concordent sur chaque indice, chaque borne, chaque palier et chaque décompte.
- **Les corrections portent sur autre chose** :
  - la portée de cinq phrases chiffrées (C3, C4, C7, C8, C9) ;
  - une FAQ que Q-8 rend fausse (C10) ;
  - la description du configurateur (C5) ;
  - une mention de source (C12) ;
  - quatre précisions (C1, C2, C6, C11) ;
  - sept phrases qui écrivent un « introuvable » comme un fait (C13).
- **Le verdict principal passe le test de glissance** : la fermeté d'un hybride, estimée, tombe entre celles de ses deux cordages, et on ne la chiffre que si les deux sont mesurés.

### Valeurs produit (contrôle automatique)

Chaque valeur produit affichée par l'article, FR et EN, y compris dans les
tableaux, telle qu'elle est écrite. Champs : voir l'en-tête de
`scripts/redaction/verifier-valeurs.mts`.

```valeurs-produit
# sujet                                   | champ    | valeur citée  | où
# FR : tableau « Six hybrides chiffrés » (§4), rigidités en lb/in, virgule décimale
cordage tecnifibre-razor-code             | rigidite | 242,9         | FR tableau §4
cordage tecnifibre-x-one-biphase          | rigidite | 166,9         | FR tableau §4 (deux lignes)
cordage luxilon-alu-power-soft            | rigidite | 197,7         | FR tableau §4
cordage tecnifibre-ice-code               | rigidite | 221,2         | FR tableau §4
cordage tecnifibre-nrg2                   | rigidite | 164           | FR tableau §4
cordage solinco-hyper-g                   | rigidite | 218,3         | FR tableau §4
cordage solinco-vanquish                  | rigidite | 160           | FR tableau §4
cordage luxilon-4g                        | rigidite | 286,9         | FR tableau §4
cordage wilson-nxt                        | rigidite | 173,7         | FR tableau §4
cordage toroline-o-toro-tour              | rigidite | 216,6         | FR tableau §4
cordage toroline-o-toro-snap              | rigidite | 164,6         | FR tableau §4
# EN : même tableau, point décimal
cordage tecnifibre-razor-code             | rigidite | 242.9         | EN table §4
cordage tecnifibre-x-one-biphase          | rigidite | 166.9         | EN table §4 (two rows)
cordage luxilon-alu-power-soft            | rigidite | 197.7         | EN table §4
cordage tecnifibre-ice-code               | rigidite | 221.2         | EN table §4
cordage tecnifibre-nrg2                   | rigidite | 164           | EN table §4
cordage solinco-hyper-g                   | rigidite | 218.3         | EN table §4
cordage solinco-vanquish                  | rigidite | 160           | EN table §4
cordage luxilon-4g                        | rigidite | 286.9         | EN table §4
cordage wilson-nxt                        | rigidite | 173.7         | EN table §4
cordage toroline-o-toro-tour              | rigidite | 216.6         | EN table §4
cordage toroline-o-toro-snap              | rigidite | 164.6         | EN table §4
# Types implicites du tableau des familles (§3 : « cinq exemples » polyester / multifilament, « un exemple » poly/poly)
cordage tecnifibre-razor-code             | type     | Polyester     | FR/EN §3
cordage luxilon-alu-power-soft            | type     | Polyester     | FR/EN §3
cordage tecnifibre-ice-code               | type     | Polyester     | FR/EN §3
cordage solinco-hyper-g                   | type     | Polyester     | FR/EN §3
cordage luxilon-4g                        | type     | Polyester     | FR/EN §3
cordage toroline-o-toro-tour              | type     | Polyester     | FR/EN §3
cordage toroline-o-toro-snap              | type     | Polyester     | FR/EN §3
cordage tecnifibre-x-one-biphase          | type     | Multifilament | FR/EN §3
cordage tecnifibre-nrg2                   | type     | Multifilament | FR/EN §3
cordage solinco-vanquish                  | type     | Multifilament | FR/EN §3
cordage wilson-nxt                        | type     | Multifilament | FR/EN §3
# Non contrôlables par l'outil (Q-6) : les indices d'hybride, au montage de référence sans raquette nommée.
# Ils sont contrôlés par le moteur réel : sorties S2, --check et --facts ci-dessous.
# Jauges des sets (RPM Blast 1,25 · Touch VS 1,30 · ALU Power 1,25 · NXT Power 1,30 · 4G Rough 1,25 · NXT Control 16 ·
# boyau Wilson 16 · ALU Power Rough 16L) : compositions de source (F18), pas des champs de la base ; relues à la main.
```

Sortie de `npm run redaction:valeurs -- docs/redaction/montage-hybride-cordage-tennis.md` (2026-11-23, commit `ff3e85a` plus ce dossier) :

```
$ npm run redaction:valeurs -- docs/redaction/montage-hybride-cordage-tennis.md
  OK    cordage tecnifibre-razor-code | rigidite | 242,9
  OK    cordage tecnifibre-x-one-biphase | rigidite | 166,9
  OK    cordage luxilon-alu-power-soft | rigidite | 197,7
  OK    cordage tecnifibre-ice-code | rigidite | 221,2
  OK    cordage tecnifibre-nrg2 | rigidite | 164
  OK    cordage solinco-hyper-g | rigidite | 218,3
  OK    cordage solinco-vanquish | rigidite | 160
  OK    cordage luxilon-4g | rigidite | 286,9
  OK    cordage wilson-nxt | rigidite | 173,7
  OK    cordage toroline-o-toro-tour | rigidite | 216,6
  OK    cordage toroline-o-toro-snap | rigidite | 164,6
  OK    cordage tecnifibre-razor-code | rigidite | 242.9
  OK    cordage tecnifibre-x-one-biphase | rigidite | 166.9
  OK    cordage luxilon-alu-power-soft | rigidite | 197.7
  OK    cordage tecnifibre-ice-code | rigidite | 221.2
  OK    cordage tecnifibre-nrg2 | rigidite | 164
  OK    cordage solinco-hyper-g | rigidite | 218.3
  OK    cordage solinco-vanquish | rigidite | 160
  OK    cordage luxilon-4g | rigidite | 286.9
  OK    cordage wilson-nxt | rigidite | 173.7
  OK    cordage toroline-o-toro-tour | rigidite | 216.6
  OK    cordage toroline-o-toro-snap | rigidite | 164.6
  OK    cordage tecnifibre-razor-code | type | Polyester
  OK    cordage luxilon-alu-power-soft | type | Polyester
  OK    cordage tecnifibre-ice-code | type | Polyester
  OK    cordage solinco-hyper-g | type | Polyester
  OK    cordage luxilon-4g | type | Polyester
  OK    cordage toroline-o-toro-tour | type | Polyester
  OK    cordage toroline-o-toro-snap | type | Polyester
  OK    cordage tecnifibre-x-one-biphase | type | Multifilament
  OK    cordage tecnifibre-nrg2 | type | Multifilament
  OK    cordage solinco-vanquish | type | Multifilament
  OK    cordage wilson-nxt | type | Multifilament

33 valeur(s) contrôlée(s), 0 écart(s)
exit=0
```

### Indices et bornes : le moteur réel (réponse à Q-6)

Chaque indice et chaque borne cités, FR et EN, sortent de deux implémentations du même moteur (`setupFirmnessIndex`), écrites séparément. Leurs chiffres concordent tous :
- **S2** : mon script hors dépôt, `C:\Users\plene\AppData\Local\Temp\claude\9519414f725d5b3e\cbc91433-ac54-48b8-b83a-537568efd73b\scratchpad\pig-hybride\fact-check-4a.mts`. Il reprend la définition du † sans Toroline Absolute (réponse de `tsa-core` à Q-3), sans importer le script du rédacteur ;
- **R** : `scripts/blog-covers/build-hybride-figures.mts`, le script du rédacteur, en `--check` (les trois blocs générés et 12 phrases chiffrées par langue) et en `--facts`.

**S2**, 2026-11-23 :

```
$ cd C:\Users\plene\Documents\_wt\redac-hybride && npx --yes tsx <scratchpad>\pig-hybride\fact-check-4a.mts
2026-11-23T11:20:05+01:00 · commit ff3e85a · src/data, src/lib, qa-ratings.mts : conformes au commit
A. Montage, seuils, paliers
  RA 64 ; REF_TENSION 24 kg ; ARM_ALERT_RCS {"sensitive":32,"standard":35} ; paliers 0→Très Confortable 20→Confortable 25→Standard 30→Ferme 35→Très Ferme
B. Cordages mesurés (Q-3 : sans toroline-absolute)
  Polyester : 45 sur 102
  Hybrid : 0 sur 9
  Multifilament : 15 sur 45
  Natural Gut : 0 sur 7
  Synthetic : 1 sur 16
  total : 61 sur 179
C. Six exemples, RA 64, 24/24 kg : direct · inverse · intégraux · type
  Tecnifibre Razor Code 242.9 (Polyester, mesuré true) / Tecnifibre X-One Biphase 166.9 (Multifilament, mesuré true) : 30 Ferme [montants seuls 33, travers seuls 25] « estimation pour un hybride, entre 25 et 33 » ; inverse 29 Standard ; intégral 33 Ferme / 25 Standard
  Luxilon ALU Power Soft 197.7 (Polyester, mesuré true) / Tecnifibre X-One Biphase 166.9 (Multifilament, mesuré true) : 27 Standard [montants seuls 29, travers seuls 25] « estimation pour un hybride, entre 25 et 29 » ; inverse 27 Standard ; intégral 29 Standard / 25 Standard
  Tecnifibre Ice Code 221.2 (Polyester, mesuré true) / Tecnifibre NRG2 164 (Multifilament, mesuré true) : 29 Standard [montants seuls 31, travers seuls 25] « estimation pour un hybride, entre 25 et 31 » ; inverse 28 Standard ; intégral 31 Ferme / 25 Standard
  Solinco Hyper-G 218.3 (Polyester, mesuré true) / Solinco Vanquish 160 (Multifilament, mesuré true) : 28 Standard [montants seuls 31, travers seuls 24] « estimation pour un hybride, entre 24 et 31 » ; inverse 28 Standard ; intégral 31 Ferme / 24 Confortable
  Luxilon 4G 286.9 (Polyester, mesuré true) / Wilson NXT 173.7 (Multifilament, mesuré true) : 33 Ferme [montants seuls 38, travers seuls 26] « estimation pour un hybride, entre 26 et 38 » ; inverse 32 Ferme ; intégral 38 Très Ferme / 26 Standard
  Toroline O-Toro Tour 216.6 (Polyester, mesuré true) / Toroline O-Toro Snap 164.6 (Polyester, mesuré true) : 28 Standard [montants seuls 31, travers seuls 25] « estimation pour un hybride, entre 25 et 31 » ; inverse 28 Standard ; intégral 31 Ferme / 25 Standard
D. Écart de tension (kg)
  Ice Code / NRG2 24/24 : 29 Standard [montants seuls 31, travers seuls 25] « estimation pour un hybride, entre 25 et 31 »
  Ice Code / NRG2 24/22 : 28 Standard [montants seuls 31, travers seuls 24] « estimation pour un hybride, entre 24 et 31 »
  Ice Code / NRG2 23/23 : 28 Standard [montants seuls 31, travers seuls 24] « estimation pour un hybride, entre 24 et 31 »
  Razor Code / X-One Biphase 24/24 : 30 Ferme [montants seuls 33, travers seuls 25] « estimation pour un hybride, entre 25 et 33 »
  Razor Code / X-One Biphase 24/22 : 30 Ferme [montants seuls 33, travers seuls 24] « estimation pour un hybride, entre 24 et 33 »
  Razor Code / X-One Biphase 23/23 : 30 Ferme [montants seuls 33, travers seuls 25] « estimation pour un hybride, entre 25 et 33 »
E. Grille de toutes les paires mesurées (le plus rigide en montants, comparé au sens inverse)
  paires non ordonnées : 1830 ; dont rigidités égales : 4 ; paires de rigidités différentes : 1826
  écart direct − inverse {"0":1086,"1":723,"2":17} ; palier changé 162
F. Polyester / multifilament mesurés, polyester en montants
  combinaisons 45 × 15 = 675 ; polyester plus rigide : 650 ; multifilament aussi rigide ou plus : 25 (hybride au-dessus du polyester seul : 2)
  sur les 650 : baisse 0 à 7 pts {"0":36,"1":94,"2":240,"3":184,"4":48,"5":37,"6":10,"7":1} ; baisse nulle 36 ; palier différent du polyester seul 372
  multifilament ≥ polyester : Poly Tour Air 154.9 / X-One Biphase 166.9 : 24 (seul 24) ; Poly Tour Air 154.9 / Reflex MLT 159.4 : 24 (seul 24) ; Poly Tour Air 154.9 / TGV 165.2 : 24 (seul 24) ; Poly Tour Air 154.9 / NRG2 164 : 24 (seul 24) ; Poly Tour Air 154.9 / NXT 173.7 : 25 (seul 24) ; Poly Tour Air 154.9 / Xalt 165.2 : 24 (seul 24) ; …
G. X-One Biphase en travers, chaque polyester mesuré en montants (FAQ « aussi souple qu’un X-One intégral »)
  X-One intégral 25 ; 45 polyesters : indices {"24":1,"25":2,"26":4,"27":7,"28":14,"29":8,"30":5,"31":1,"32":1,"33":2} ; les plus bas : Poly Tour Air 154.9 → 24 ; O-Toro 165.7 → 25 ; O-Toro Snap 164.6 → 25 ; Cream 177.7 → 26
H. Couples profilé / rond, deux cordages mesurés, forme dans la description de la base
  ronds mesurés : toroline-o-toro-snap 164.6 ; toroline-cash 182.9
  profilés mesurés : head-lynx-tour 228.6 ; luxilon-element 208 ; tecnifibre-black-code-4s 242.9 ; yonex-poly-tour-spin 213.7 ; gamma-moto 226.9 ; luxilon-savage 234.3 ; tecnifibre-black-code 249.7 ; luxilon-eco-spin 213.2 ; toroline-o-toro-spin 173.2 ; toroline-super-toro 189.7 ; toroline-o-toro-tour 216.6 ; toroline-snapper 190.9
  couples profilé (montants) / rond (travers) : 24, dont formes sourcées (fiches Toroline) : 8
    O-Toro Spin 173.2 / O-Toro Snap 164.6 : 25 Standard
    O-Toro Spin 173.2 / Cash 182.9 : 26 Standard
    Super Toro 189.7 / O-Toro Snap 164.6 : 27 Standard
    Super Toro 189.7 / Cash 182.9 : 27 Standard
    O-Toro Tour 216.6 / O-Toro Snap 164.6 : 28 Standard
    O-Toro Tour 216.6 / Cash 182.9 : 29 Standard
    Snapper 190.9 / O-Toro Snap 164.6 : 27 Standard
    Snapper 190.9 / Cash 182.9 : 27 Standard
```

**R, contrôle** :

```
2026-11-23T11:21:42+01:00 · commit ff3e85a
$ npx --yes tsx scripts/blog-covers/build-hybride-figures.mts --check
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « schema » conforme à la base
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « tableau » conforme à la base
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « graphique » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « schema » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « tableau » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « graphique » conforme à la base

blocs et chiffres du texte conformes à la base
exit=0
```

**R, chiffres** (même date, même commit) :

```
$ npx --yes tsx scripts/blog-covers/build-hybride-figures.mts --facts
{
  "asOf": {
    "fr": "23 novembre 2026",
    "en": "November 23, 2026"
  },
  "ra": 64,
  "kg": 24,
  "alert": {
    "sensitive": 32,
    "standard": 35
  },
  "bands": [
    {
      "from": 0,
      "level": "Très Confortable"
    },
    {
      "from": 20,
      "level": "Confortable"
    },
    {
      "from": 25,
      "level": "Standard"
    },
    {
      "from": 30,
      "level": "Ferme"
    },
    {
      "from": 35,
      "level": "Très Ferme"
    }
  ],
  "nMeasured": 61,
  "nStrings": 179,
  "nGut": 7,
  "nGutMeasured": 0,
  "tension": {
    "t2424": {
      "rcs": 29,
      "mains": 31,
      "crosses": 25
    },
    "t2422": {
      "rcs": 28,
      "mains": 31,
      "crosses": 24
    },
    "t2323": {
      "rcs": 28,
      "mains": 31,
      "crosses": 24
    },
    "razor2422": 30,
    "razor2323": 30
  },
  "grid": {
    "pairs": 1826,
    "diff": {
      "0": 1086,
      "1": 723,
      "2": 17
    },
    "levelChanged": 162,
    "dropMin": 0,
    "dropMax": 7,
    "levelVsFull": 655
  },
  "gridPolyMulti": {
    "pairs": 650,
    "diff": {
      "0": 280,
      "1": 356,
      "2": 14
    },
    "levelChanged": 60,
    "dropMin": 0,
    "dropMax": 7,
    "levelVsFull": 372
  },
  "examples": [
    "Tecnifibre Razor Code (242.9) / Tecnifibre X-One Biphase (166.9) : 30 Ferme [montants seuls 33, travers seuls 25] ; inverse 29 Standard",
    "Luxilon ALU Power Soft (197.7) / Tecnifibre X-One Biphase (166.9) : 27 Standard [montants seuls 29, travers seuls 25] ; inverse 27 Standard",
    "Tecnifibre Ice Code (221.2) / Tecnifibre NRG2 (164) : 29 Standard [montants seuls 31, travers seuls 25] ; inverse 28 Standard",
    "Solinco Hyper-G (218.3) / Solinco Vanquish (160) : 28 Standard [montants seuls 31, travers seuls 24] ; inverse 28 Standard",
    "Luxilon 4G (286.9) / Wilson NXT (173.7) : 33 Ferme [montants seuls 38, travers seuls 26] ; inverse 32 Ferme",
    "Toroline O-Toro Tour (216.6) / Toroline O-Toro Snap (164.6) : 28 Standard [montants seuls 31, travers seuls 25] ; inverse 28 Standard"
  ]
}
```

Où se lit chaque chiffre du texte :
- **six exemples** : S2 §C et R `examples`. Cela couvre le schéma, le tableau, le graphique, L'essentiel, le §4 et les FAQ 1 à 3 ;
- **écart de tension** : S2 §D et R `tension`, pour le §4 (configurateur à 24/22 kg) et le §5 ;
- **61 sur 179** : S2 §B et R `nMeasured` / `nStrings`. **0 boyau mesuré sur 7** : R `nGut` / `nGutMeasured` ;
- **1 826 paires, 1 086 / 723 / 17, 162** : S2 §E et R `grid` ;
- **650, 0 à 7 points, 372** : S2 §F et R `gridPolyMulti`, avec la portée exacte en S2 §F (C3, C8) ;
- **seuils 32 et 35, paliers** : S2 §A et R `alert` / `bands`.

Les conversions EN sont justes : 24 kg = 52,9 lb, arrondi à 53 ; 22 kg = 48,5 lb ; 23 kg = 50,7 lb ; « 4 lb (about 2 kg) » est la formule d'Eriksson.

### Affirmations

« FR · EN » : la même affirmation dans les deux langues ; une ligne EN seule est marquée. Conforme : **oui**, **non** (correction Cn), ou **hors fait** (définition, conseil sans fait).

| # | Phrase de l'article (FR · EN) | Fait n° | Conforme | Correction demandée |
|---|---|---|---|---|
| A1 | Chapô : « Aucune mesure ne dit quel cordage mettre en montants : le sens se choisit selon votre jeu » · « No measurement tells you which string belongs in the mains » | F19, F20 | oui | — (prescription : l'essai F20 donne un effet, pas une règle) |
| A2 | Chapô, L'essentiel : « l'inverser ne déplace notre indice de fermeté que de 0 à 2 points » · « flipping it moves our firmness index by 0 to 2 points » | F17 (S2 §E) | oui | — |
| A3 | Chapô : « La fermeté d'un hybride se place entre celles de ses deux cordages : c'est une estimation, que nous ne chiffrons que lorsque leurs deux rigidités sont mesurées » · idem EN | F3, F6, A-1 | oui | — |
| A4 | L'essentiel : RA 64, 24 kg dans les deux sens, Ice Code / NRG2 → 29, palier Standard, entre 31 et 25 · « 53 lb (24 kg) both ways … 29, Standard tier » | F12, S2 §C | oui | — |
| A5 | L'essentiel : « Le 60/40 donné aux montants est une convention du site, pas une mesure » · idem EN | F4 | oui | — |
| A6 | L'essentiel : « Pas de chiffre pour le boyau naturel, les cordages non mesurés ni les sets prémontés » · idem EN | A-1, Q-1, F7, F18 | oui | — |
| A7 | L'essentiel : « Un écart de tension autour de la même moyenne ne change pas l'indice » · idem EN | F16, S2 §D | oui | — |
| A8 | §1 : montants = cordes verticales, travers = horizontales · idem EN | définition | hors fait | — |
| A9 | §1 : « on le monte à partir de deux garnitures, ou on l'achète en set prémonté » · idem EN | F18 | oui | — |
| A10 | Schéma (SVG, titre, légende) : Ice Code † 24 kg, seul 31 Ferme ; NRG2 † 24 kg, seul 25 Standard ; hybride 29 Standard, « estimation, entre 25 et 31 » ; RA 64 ; † défini ; état au 23/11/2026 · EN « 53 lb (24 kg) » | F2, F6, F12 ; S2 §C ; R `--check` | oui | — |
| A11 | §2 : « Deux choses sont mesurées […] ; le reste relève de l'usage » · « Two things have been measured […]; the rest is habit » | F21-F23, F26 ; F20 cité plus bas dans la même section | non | **C1** |
| A12 | §2 : TWU : les montants glissent quand la balle les pousse de côté plus fort que le frottement ne les retient · idem EN | F26 | oui | — |
| A13 | §2 : s'ils reviennent en place pendant le contact, la balle prend plus d'effet · idem EN | F22 | oui | — |
| A14 | §2 : boyau en montants / polyester en travers : frottement statique le plus faible ; l'inverse : l'un des plus élevés · idem EN | F21 | oui | — |
| A15 | §2 : profilés ou texturés frottent davantage, polyesters le moins · idem EN | F23 (frottement de glissement) | oui | — |
| A16 | §2 : « Que les montants cassent les premiers est une observation de cordeur (Holabird Sports, 2013), pas une mesure » · idem EN | F27 (attribué) | oui | — |
| A17 | §2 : J. Eriksson (Tennisnerd, 6/11/2026, partenaire déclaré de Toroline) conseille profilé en montants, rond et lisse en travers · idem EN | F24 corrigé (usage attribué nommément) | oui | — |
| A18 | §2 : « TWU va dans ce sens pour le travers ; la combinaison n'a jamais été mesurée » · « …has never been measured » | F23 ; « jamais » : introuvable (Q2 b) | non | **C13**-1 |
| A19 | §2 : Klip X-Plosive (TW, non daté) : 76 unités avec le polyester en montants, 70 avec le boyau ; « Un seul essai publié » · « One published test » | F20 (valeurs) ; « un seul » : aucun second trouvé | non (forme) | **C13**-2 |
| A20 | §2 : l'essai donne le sens, pas le poids ; unités non convertibles en indice · idem EN | F20, charte F2 | oui | — |
| A21 | §2 : « Nous n'avons trouvé aucune mesure publiée de la part des montants et des travers » · idem EN | Q1 introuvable | oui | — |
| A22 | §3 : poly / multi : « Aucune mesure propre à ce couple dans nos sources » ; « cinq exemples plus bas » · idem EN | S2 §C (types) ; bloc `valeurs-produit` | oui | — |
| A23 | §3 : poly / boyau : frottement statique parmi les plus élevés (TWU) ; non chiffré · idem EN | F21, A-1 | oui | — |
| A24 | §3 : boyau / poly, « hybride dit « inversé » » : frottement le plus faible ; tamis moins ferme que dans l'autre sens (un essai) ; non chiffré · idem EN | F21, F20 ; terme d'usage relevé au §1 (SERP Decathlon) | oui | — |
| A25 | §3 : poly profilé / poly rond : « Usage défendu par un blog partenaire d'une marque ; non mesuré » ; un exemple · idem EN | F24, F23, F15 ; A-2 | non (attribution) | **C2** |
| A26 | §4 : un hybride se place entre ses deux cordages, au milieu ou un peu plus près des montants quand ils sont les plus rigides · idem EN | F3 | oui | — |
| A27 | §4 : estimation tirée de deux rigidités mesurées, jamais une mesure du montage · idem EN | F3, A-1 | oui | — |
| A28 | §4 : l'indice combine RA, rigidité du cordage (lb/in) et tension · idem EN | F3 (paramètres de `setupFirmnessIndex`), F5 | oui | — |
| A29 | §4 : deux estimations à la tension moyenne, 60/40 et moyenne simple, la plus haute retenue · idem EN | F3 | oui | — |
| A30 | §4 : « Le 60/40 est une convention du site qu'aucune mesure publiée ne fonde ; il ne joue que si les montants sont les plus rigides » · « …that no published measurement backs… » | F4 (fondement introuvable), F3 | non (forme) | **C13**-3 |
| A31 | §4 : « 61 des 179 cordages de notre base au 23 novembre 2026 » · idem EN | F7 corrigé, S2 §B | oui | — |
| A32 | Tableau des six hybrides : rigidités, estimation et palier, bornes, sens inverse, note (RA 64, 24 kg ; bornes = intégraux ; † ; pas des sets) · idem EN | F10-F15 ; S2 §C ; R `--check` ; bloc `valeurs-produit` | oui | — |
| A33 | Graphique (SVG, titre, légende) : trois marques par exemple, bandes des paliers, seuils 32 (« bras sensible déclaré ») et 35 (« tous profils ») · idem EN | F2, F10-F15 ; R `--check` | oui | — |
| A34 | §4 : l'Ice Code passe de 31, Ferme, seul, à 29, Standard, avec du NRG2 · idem EN | F12 | oui | — |
| A35 | §4 : le 4G avec du NXT reste à 33, Ferme, au-dessus du seuil d'alerte bras sensible (32) et sous 35 · idem EN | F14, F2 (constat, montage de référence) | oui | — |
| A36 | §4 : « Sur les 650 hybrides polyester / multifilament que permettent nos cordages mesurés, polyester en montants, … 0 à 7 points … 372 cas » · « Across the 650 … our measured strings allow » | F17 corrigé, S2 §F : 675 combinaisons ; 650 où le polyester est le plus rigide | non (portée) | **C3** a |
| A37 | §4 : O-Toro Tour hexagonale / O-Toro Snap ronde ; « le seul couple profilé/rond de la base dont les deux cordages sont mesurés et la forme connue » · « the only shaped/round pair » | F15 et F29 corrigés, S2 §H : 8 couples (formes sourcées), 24 (toutes formes) | non | **C4** |
| A38 | Encadré : champ « Cordage Travers (Hybride optionnel) » ; l'estimation et ses deux bornes, chacune à sa tension · « Cross String (optional hybrid) » | F34, F3 | oui | — |
| A39 | §4 : configurateur à 24/22 kg ; curseurs « Principal » et « Travers » ; une raquette de RA 64 ; sans y toucher, Ice Code / NRG2 → 28, pas 29 · EN « 53 lb (24 kg) … 48.5 lb (22 kg), on sliders in kilos », « Mains » / « Crosses » | F34, F16 ; 16 raquettes du catalogue à RA 64 (relevé du 23/11, `racquets-database.ts`) | oui | — |
| A40 | §4 : 1 826 paires ; 1 086 / 723 / 17, jamais plus ; palier changé 162 · idem EN | F17 corrigé, S2 §E : chiffres justes ; 1 830 paires, dont 4 à rigidités égales | non (portée) | **C3** b |
| A41 | §4 : Razor Code / X-One Biphase : 30, Ferme, et 29, Standard, à l'envers, « où la moyenne simple l'emporte » · idem EN | F10, F3 | oui | — |
| A42 | §4 : sans rigidité alignée pour ses deux cordages, pas d'indice : « une précision qu'il n'a pas » · idem EN | A-1 | oui | — |
| A43 | §4 : tout hybride à boyau : « la rigidité que notre base retient pour le boyau n'est pas alignée sur une mesure de laboratoire » · idem EN | Q-4 (forme acceptée par `tsa-core`), F7 (0 sur 7) | oui | — |
| A44 | §4 : hybrides au Babolat RPM Blast ou au Luxilon ALU Power non chiffrés · idem EN | F8 | oui | — |
| A45 | §4 : sets à composition publiée, aucun avec ses deux cordages mesurés · idem EN | F18, Q-1 | oui | — |
| A46 | §4 : quatre compositions, jauges et sources ; « sens au choix » ; Champion's Choice une fois, sous son nom Tennis Warehouse ; ni sens, ni joueur, ni valeur du Duo Control · idem EN | F18, Q-5 ; noms conformes à la base (relevé du 23/11) | oui | — |
| A47 | §4 : « Le configurateur leur donne une rigidité de fiche ou dérivée, étiquetée comme telle » · « The configurator gives them … labelled as such » | F35 | non | **C5** |
| A48 | §5 : « Aucune source primaire ne fixe d'écart » · « No primary source sets a gap » | GT-F28 (introuvable) | non (forme) | **C13**-4 |
| A49 | §5 : « En hybride, deux usages s'opposent […] 4 lb (environ 2 kg) étant selon Jonas Eriksson le plus grand écart qu'on voie ; aucun n'est mesuré » · idem EN | GT-F22 ; F25 précisé (usage général, montage en cordage unique) ; GT-F23 (4 nœuds) | non (portée) | **C6** |
| A50 | §5 : Ice Code / NRG2 : 29 à 24/24 kg, 28 à 24/22 kg comme à 23/23 kg ; Razor Code / X-One Biphase : 30 dans les trois cas ; « se juge donc à la sensation » · EN avec lb | F16, S2 §D ; GT-F30 | oui | — |
| A51 | §6, question 1 : « Ce sont eux qui glissent. Le cordage le plus rigide y fait le tamis le plus ferme des deux sens, de 0 à 2 points » · idem EN | F26 (glissement) ; S2 §E : écart nul dans 1 086 cas ; indice, pas mesure (F3) | non | **C7** |
| A52 | §6, question 2 : choisir un palier, puis deux cordages dont les indices montés seuls l'encadrent · idem EN | F3 (bornes), F2 ; condition de jeu, pas de santé (F7) | oui | — |
| A53 | §6, question 3 : entrer raquette, deux cordages, deux tensions dans le configurateur · idem EN | F34 | oui | — |
| A54 | FAQ 1 : « Aucune mesure ne désigne un meilleur travers » ; plus souple, indice plus bas : Ice Code 31 → 29 avec NRG2 (RA 64, 24 kg) · idem EN et `FAQPage` | chiffres : F12 ; 1re phrase : introuvable (Q1, Q2) | non (forme) | **C13**-5 |
| A55 | FAQ 2 : « Il est moins ferme sur notre indice que son polyester monté seul » ; aucun des six exemples au palier Confortable · idem EN et `FAQPage` | S2 §F : 36 égalités sur 650, 2 dépassements sur 25 ; F10-F15 pour la 2e partie | non | **C8** |
| A56 | FAQ 3 : « Non, selon l'indice » ; Razor Code 30 Ferme, ALU Power Soft 27 Standard, X-One Biphase intégral 25 Standard ; « Aucun essai publié ne compare la durée de vie » · idem EN et `FAQPage` | chiffres : F10, F11 ; « Non » : F36 (3 polyesters sur 45 à 25 ou moins) ; durée : F30 introuvable | non | **C9**, **C13**-6 |
| A57 | FAQ 4 : Babolat, 2020 : 45 % du top 20 ATP, 65 % « de la WTA », sans source ni saison, affirmation de marque ; « Nous ne citons aucun joueur : aucun montage de professionnel ne réunit deux sources indépendantes qui disent la même chose » · idem EN et `FAQPage` | Babolat : F31, conforme ; seconde phrase : contredite par F37 et F38 (Q-8) | non | **C10** |
| A58 | Limites : « Le poids de chaque sens : aucune mesure publiée » · idem EN | Q1 introuvable | non (forme) | **C13**-7 |
| A59 | Limites : « La jauge : l'indice lit la rigidité de la fiche, celle de la jauge la plus rigide mesurée, quelle que soit la jauge choisie » · idem EN | F5 (vrai pour les cordages †) ; Q-4 : 40 fiches au-dessus de leurs jauges mesurées | non (portée) | **C11** |
| A60 | Limites : « Indice RCS : calculé, non mesuré ; valeurs au 23 novembre 2026 » · idem EN | F3, F11 | oui | — |
| A61 | Limites : l'indice décrit la fermeté, pas l'effet sur un bras ; « Si une douleur persiste, consultez un professionnel de santé » · idem EN | charte F7 | oui | — |
| A62 | Sources : quatre pages TWU, dates et descriptions · idem EN | F19, F21, F23, F26 | oui | — |
| A63 | Sources : essai Klip X-Plosive (non daté) · idem EN | F20 | oui | — |
| A64 | Sources : Tennisnerd, 6/11/2026, « partenariat avec Toroline et liens d'affiliation déclarés par l'auteur » · « discloses a Toroline partnership and affiliate links » | F24 corrigé : collaboration et « partners », aucune affiliation déclarée | non | **C12** |
| A65 | Sources : Holabird Sports, non signé, 25/11/2013 · idem EN | F27 | oui | — |
| A66 | Sources : Babolat, 28/07/2020 · idem EN | F31 | oui | — |
| A67 | Sources : compositions lues le 23/10/2026 (Babolat, Tennis Warehouse, Game-Set-Match) · idem EN | F18 | oui | — |
| A68 | Sources : base au 23/11/2026 · idem EN | S2, R | oui | — |
| A69 | `<head>` : meta et `og:description`, « estimer sa fermeté à partir de deux cordages mesurés » · idem EN ; `alt` de couverture (image regardée : titre, tamis montants blancs, travers vert-jaune) | A-1 ; image | oui | — |
| A70 | EN seul : « The pound conversions are ours » ; 53, 48.5, 50.7 lb | arithmétique (ci-dessus), charte §5 | oui | — |
| A71 | EN seul : « This is the English edition of our French article of November 23, 2026; the content is the same » | conforme si C1 à C13 sont reportées dans les deux langues | oui | — |
| A72 | EN seul, encart final : « the configurator gives your hybrid's firmness index with its bounds » | F34, F3 | oui | — |

**Décompte** : **69 affirmations vérifiées en FR** (A1 à A69 : 49 conformes, 1 hors fait, 19 non conformes) et **72 en EN** (les mêmes, plus A70 à A72, conformes). Les 19 lignes non conformes renvoient aux 13 corrections. Aucune affirmation EN ne dit ce que le FR ne dit pas : A70 à A72 sont une conversion, une mention d'édition et un rappel de l'outil.

### Corrections demandées à `tsa-redacteur`

Chaque correction vaut **en FR et en EN**, et dans la `FAQPage` quand la phrase est dans la FAQ : `audit:jsonld` exige la FAQ visible mot pour mot. Les formulations proposées gardent les débuts de phrase que contrôle `expectations()` de `build-hybride-figures.mts` (C3, C8, C9). Relancer `--check` après la passe.

- **C1** · §2, première phrase.
  - En cause : « Deux choses sont mesurées, le glissement des montants sur les travers et le frottement entre cordes ; le reste relève de l'usage. » · « Two things have been measured, the mains sliding over the crosses and the friction between strings; the rest is habit. »
  - Fait : la H3 « Quel sens pèse le plus sur la fermeté ? » de la même section cite une troisième mesure, la raideur du tamis dans les deux sens (F20, un essai).
  - Attendu : « Trois choses ont été mesurées : le glissement des montants sur les travers, le frottement entre cordes et, sur le seul essai trouvé, la raideur du tamis dans les deux sens ; le reste relève de l'usage. » · « Three things have been measured: the mains sliding over the crosses, the friction between strings and, in the one test we found, the bed's stiffness both ways round; the rest is habit. »
- **C2** · §3, tableau, ligne « Polyester profilé / Polyester rond ».
  - En cause : « Usage défendu par un blog partenaire d'une marque ; non mesuré » · « Habit defended by a blog partnered with a brand; not measured ».
  - Fait : A-2 : une source partenaire d'une marque ne sert qu'à un usage **attribué nommément** ; F24.
  - Attendu : « Usage défendu par Jonas Eriksson (Tennisnerd), partenaire de Toroline ; non mesuré » · « Habit defended by Jonas Eriksson (Tennisnerd), a Toroline partner; not measured ».
- **C3** · §4 : la portée de deux décomptes.
  - **a. Phrase après le graphique.**
    - En cause : « Sur les 650 hybrides polyester / multifilament que permettent nos cordages mesurés, polyester en montants, l'estimation est de 0 à 7 points sous le polyester monté seul… » · « Across the 650 polyester/multifilament hybrids our measured strings allow, polyester in the mains… ».
    - Fait : S2 §F et F17 corrigé. Il y a 675 combinaisons avec le polyester en montants ; les 650 sont celles où **le polyester est le plus rigide**. Dans les 25 autres, l'estimation peut dépasser le polyester seul (2 cas, par exemple Yonex Poly Tour Air / Wilson NXT : 25 contre 24).
    - Attendu : « Sur les 650 hybrides polyester / multifilament de nos cordages mesurés où le polyester, plus rigide, est en montants, l'estimation est de 0 à 7 points sous le polyester monté seul, et le palier change dans 372 cas. » · « Across the 650 polyester/multifilament hybrids from our measured strings where the stiffer polyester is in the mains, the estimate is 0 to 7 points below the polyester on its own, and the tier changes in 372 cases. »
  - **b. H3 « Inverser montants et travers ».**
    - En cause : « Sur les 1 826 paires que permettent nos cordages mesurés » · « Across the 1,826 pairs our measured strings allow ».
    - Fait : S2 §E. Les cordages mesurés forment 1 830 paires, dont 4 à rigidités égales, où il n'y a pas de sens à comparer.
    - Attendu : « Sur les 1 826 paires de cordages mesurés de rigidités différentes » · « Across the 1,826 pairs of measured strings with different stiffness ».
- **C4** · §4, paragraphe poly/poly.
  - En cause : « …selon notre base : le seul couple profilé/rond de la base dont les deux cordages sont mesurés et la forme connue. » · « …the only shaped/round pair in it with both strings measured and a known profile. »
  - Fait : S2 §H, F15 et F29 corrigés. **8 couples** profilé/rond ont leurs deux cordages mesurés et une forme sourcée, tous chez Toroline ; on en compte 24 avec les profils non sourcés des descriptions. Celui-ci a le plus grand écart de rigidité des huit (52 lb/in).
  - Attendu : « …selon notre base : l'un des huit couples profilé/rond dont les deux cordages sont mesurés et la forme sourcée, celui dont l'écart de rigidité est le plus grand. » · « …one of eight shaped/round pairs with both strings measured and a sourced profile, the one with the widest stiffness gap. » On peut aussi supprimer l'incise.
- **C5** · §4, dernière phrase de « Ce que nous ne chiffrons pas ».
  - En cause : « Le configurateur leur donne une rigidité de fiche ou dérivée, étiquetée comme telle : ce n'est pas une mesure du set. » · « The configurator gives them a product-page or derived stiffness, labelled as such… »
  - Fait : F35. Le configurateur affiche « Hybrid | Rigidité : X lb/in » sans aucune mention. C'est la **fiche produit** qui signale la valeur comme estimée et la dit dérivée des deux cordages. La phrase reprenait la réponse à Q-1, inexacte sur ce point.
  - Attendu : « Leur fiche produit affiche une rigidité dérivée de leurs deux cordages et la signale comme telle ; le configurateur reprend ce chiffre : ce n'est pas une mesure du set. » · « Their product pages show a stiffness derived from their two strings and say so; the configurator uses that figure: it is not a measurement of the set. »
- **C6** · §5, premier paragraphe.
  - En cause : « En hybride, deux usages s'opposent, tendre davantage le cordage le plus souple ou tendre un peu moins les travers, 4 lb (environ 2 kg) étant selon Jonas Eriksson le plus grand écart qu'on voie ; aucun n'est mesuré. » · idem EN.
  - Fait : F25 précisé.
    - Eriksson présente les travers un peu moins tendus comme un usage général (« many players run the crosses a little lower than the mains »), pas comme un usage d'hybride.
    - Ses 4 lb illustrent le montage en cordage unique d'un joueur.
    - GT-F23 porte sur un montage 4 nœuds, sans hybride.
    - Seul GT-F22 est propre à l'hybride.
  - Attendu : « En hybride, la presse spécialisée décrit l'usage de tendre davantage le cordage le plus souple ; plus généralement, beaucoup de joueurs tendent un peu moins les travers, et Jonas Eriksson tient 4 lb (environ 2 kg) pour le plus grand écart qu'on voie. Aucun de ces usages n'est mesuré. » EN de même. Ne pas nommer le joueur de l'exemple d'Eriksson : une seule source (F4).
- **C7** · §6, question 1.
  - En cause : « Le cordage le plus rigide y fait le tamis le plus ferme des deux sens, de 0 à 2 points. » · « The stiffer string there makes the firmer bed of the two directions, by 0 to 2 points. »
  - Fait : S2 §E. L'écart est nul dans 1 086 paires sur 1 826. C'est l'indice, une estimation, pas une mesure du tamis (F3 ; F20 n'est qu'un essai).
  - Attendu : « Sur notre indice, le cordage le plus rigide en montants donne un chiffre égal ou plus haut qu'à l'envers, de 0 à 2 points. » · « On our index, the stiffer string in the mains gives the same figure as the other way round or a higher one, by 0 to 2 points. »
- **C8** · FAQ « Un hybride est-il plus confortable qu'un polyester intégral ? », visible et `FAQPage`.
  - En cause : « Il est moins ferme sur notre indice que son polyester monté seul, sans être forcément confortable… » · « It is less firm on our index than its polyester on its own… »
  - Fait : S2 §F. Sur les 650 couples où le polyester est le plus rigide, 36 gardent le même indice. Dans les 25 autres, 2 dépassent le polyester seul.
  - Attendu : « Sur notre indice, il n'est jamais plus ferme que son polyester monté seul quand ce polyester, plus rigide, est en montants : de 0 à 7 points de moins sur nos 650 couples polyester / multifilament mesurés. Il n'est pas forcément confortable pour autant : aucun de nos six exemples n'atteint le palier Confortable. » EN de même.
- **C9** · FAQ « Un hybride polyester / X-One Biphase est-il aussi souple qu'un X-One Biphase intégral ? », visible et `FAQPage`.
  - En cause : « Non, selon l'indice : … » · « No, according to the index: … »
  - Fait : F36 (S2 §G). Avec du X-One Biphase en travers, 3 des 45 polyesters mesurés donnent 25 ou moins : Yonex Poly Tour Air (24), Toroline O-Toro et O-Toro Snap (25).
  - Attendu : « Pas avec nos deux exemples : avec du X-One Biphase en travers, le Razor Code en montants donne 30 (Ferme) et l'ALU Power Soft 27 (Standard), contre 25 (Standard) pour le X-One Biphase en intégral (RA 64, 24 kg). Cela dépend du polyester : sur nos 45 polyesters mesurés, 3 donnent 25 ou moins avec ce travers. » EN de même. Les deux dernières phrases suivent C13-6.
- **C10** · FAQ « Les joueurs professionnels jouent-ils en hybride ? », visible et `FAQPage`.
  - En cause : « Nous ne citons aucun joueur : aucun montage de professionnel ne réunit deux sources indépendantes qui disent la même chose. » · « We name no player: no professional's setup is backed by two independent sources saying the same thing. »
  - Fait : Q-8 au §4, F37 et F38. Le montage de Roger Federer (boyau en montants, polyester en travers) a deux sources indépendantes et datées, 2009 et 2014.
  - Attendu, au choix du rédacteur :
    - **(a)** citer le montage, daté et sourcé : « Roger Federer jouait boyau en montants et polyester (Luxilon ALU Power Rough) en travers, selon Tennis.com en 2009 et The New Yorker en 2014 », et ajouter les deux pages aux sources ;
    - **(b)** garder la seule première proposition : « Nous ne citons pas de joueur ici. »

    Dans les deux cas, aucune affirmation générale sur l'absence de sources.
- **C11** · « Ce que cet article ne dit pas », ligne « La jauge ».
  - En cause : « l'indice lit la rigidité de la fiche, celle de la jauge la plus rigide mesurée, quelle que soit la jauge choisie » · « the index reads the product-page stiffness, that of the stiffest measured gauge, whatever gauge you pick ».
  - Fait : F5. La règle C ne vaut que pour les cordages marqués † ; selon la réponse de `tsa-core` à Q-4, 40 fiches gardent une valeur sans source au-dessus de leurs jauges mesurées.
  - Attendu : « l'indice lit la rigidité de la fiche, quelle que soit la jauge choisie ; pour un cordage marqué †, c'est celle de sa jauge la plus rigide mesurée » · « the index reads the product-page stiffness, whatever gauge you pick; for a string marked †, that is its stiffest measured gauge ». Compatible avec P5 du §6.
- **C12** · Sources, ligne Tennisnerd.
  - En cause : « — partenariat avec Toroline et liens d'affiliation déclarés par l'auteur » · « — the author discloses a Toroline partnership and affiliate links ».
  - Fait : F24 corrigé, page relue le 23/11. Elle déclare une collaboration avec Toroline et renvoie à « our partners » ; elle ne parle d'affiliation nulle part.
  - Attendu : « — collaboration avec Toroline (son cordage Vamos) et liens vers des partenaires, dont Toroline, déclarés par l'auteur » · « — the author discloses a collaboration with Toroline (his Vamos string) and links to partners, Toroline among them ».
- **C13** · Sept phrases qui écrivent comme un fait l'absence d'une publication que nous n'avons pas trouvée (charte F3 ; au §2, Q1, F4, F20, F23, F30 et GT-F28 sont « introuvables »). Pour chacune, la forme attendue en FR, puis en EN :
  1. §2 :
     - « la combinaison n'a jamais été mesurée » → « nous n'avons trouvé aucune mesure de la combinaison » ;
     - « the pairing itself has never been measured » → « we found no measurement of the pairing itself ».
  2. §2 :
     - « Un seul essai publié compare » → « Nous n'avons trouvé qu'un essai publié qui compare » ;
     - « One published test compares » → « We found only one published test that compares ».
  3. §4 :
     - « une convention du site qu'aucune mesure publiée ne fonde » → « une convention du site, sans mesure publiée trouvée à l'appui » ;
     - « that no published measurement backs » → « with no published measurement we could find behind it ».
  4. §5 :
     - « Aucune source primaire ne fixe d'écart » → « Nous n'avons trouvé aucune source primaire qui fixe un écart » ;
     - « No primary source sets a gap » → « We found no primary source that sets a gap ».
  5. FAQ 1, visible et `FAQPage` :
     - « Aucune mesure ne désigne un meilleur travers. » → « Nous n'avons trouvé aucune mesure qui désigne un meilleur travers. » ;
     - « No measurement points to a best cross. » → « We found no measurement that points to a best cross. »
  6. FAQ 3, visible et `FAQPage` :
     - « Aucun essai publié ne compare la durée de vie… » → « Nous n'avons trouvé aucun essai publié qui compare la durée de vie… » ;
     - « No published test compares… » → « We found no published test that compares… »
  7. Limites :
     - « aucune mesure publiée » → « aucune mesure publiée trouvée » ;
     - « no published measurement » → « no published measurement found ».

  Ne changent pas : le chapô (« Aucune mesure ne dit quel cordage mettre en montants ») et L'essentiel (« n'a pas de règle mesurée »). Ce sont des énoncés de méthode : une mesure donne un effet, jamais une prescription. Ils restent compatibles avec P3 du §6.

### Corrections : réponse de `tsa-redacteur` (étape 5, 2026-11-23)

Toutes appliquées, en FR et en EN ; la `FAQPage` est recopiée de la FAQ visible (`audit:jsonld` : aucun écart de FAQ). **Aucun refus.**

- **C1** : fait, forme attendue.
- **C2** : fait, forme attendue.
- **C3 a et b** : faits, formes attendues. `--check` vérifie toujours 650, 0 à 7, 372, 1 826, 1 086 / 723 / 17 et 162.
- **C4** : fait, forme attendue, incise gardée (« l'un des huit couples profilé/rond dont les deux cordages sont mesurés et la forme sourcée, celui dont l'écart de rigidité est le plus grand »).
- **C5** : fait, forme attendue.
- **C6** : fait, avec un écart de forme. L'usage général est attribué dans la phrase (« plus généralement, selon Jonas Eriksson, beaucoup de joueurs tendent un peu moins les travers, et 4 lb (environ 2 kg) est le plus grand écart qu'on voie ») : la forme attendue l'écrivait comme un constat du site. Le joueur de son exemple n'est pas nommé.
- **C7** : fait, forme attendue.
- **C8** : fait, forme attendue. Contrôle ajouté à `--check` : 650 couples, 0 à 7 points, aucun au-dessus du polyester seul.
- **C9** : fait, forme attendue. Contrôle ajouté à `--check` : 45 polyesters mesurés, 3 à 25 ou moins avec le X-One Biphase en travers (F36 retrouvé par le script).
- **C10** : option **(a)**, selon A-4. FR : « Roger Federer jouait boyau en montants et polyester (Luxilon ALU Power Rough) en travers, selon Tennis.com en 2009 et The New Yorker en 2014. Un cadre de joueur professionnel n'est souvent pas le modèle du commerce, et ce montage ne dit rien de celui qui vous conviendrait. » EN de même. Les deux pages sont ajoutées aux sources visibles (The New Yorker « lu dans l'extrait publié par Longreads »). Elles ne sont pas dans les `citation` du JSON-LD, qui relèvent de `tsa-acquisition`.
- **C11** : fait, forme attendue, avec P5.
- **C12** : fait, forme attendue.
- **C13**, points 1 à 7 : faits, formes attendues. Chapô et L'essentiel inchangés, comme demandé.
- **En plus, même défaut que G23** : la FAQ 1 disait « Un cordage plus souple baisse l'indice » ; l'écart est nul dans 36 des 650 couples. Elle dit maintenant « Un travers plus souple abaisse l'indice ou le laisse inchangé » (EN « A softer cross lowers the index or leaves it unchanged »). À contre-vérifier avec C1 à C13.
- **Longueur après la passe** : 1 948 mots FR, 1 958 EN (périmètre du §7). C'est au-dessus des 1 800 du brief et dans la fourchette du circuit (2 000). Je n'ai rien coupé de plus, pour ne pas toucher au texte que le pigiste contre-vérifie.

### Test de glissance

| # | Affirmation contestable | Par qui | Défense (fait n°) ou « sans défense » |
|---|---|---|---|
| G1 | « Aucune mesure ne dit quel cordage mettre en montants » | cordeur | F19, F20 : un essai donne un sens de raideur, aucune source ne prescrit |
| G2 | Inverser ne bouge l'indice que de 0 à 2 points | cordeur, fabricant (« un hybride inversé se joue tout autrement ») | F17, S2 §E : énoncé sur l'**indice**, pas sur la sensation ; défendu |
| G3 | Le 60/40 est une convention, pas une mesure | fabricant (« les montants dominent ») | F4, F19, F20 ; défendu (forme : C13-3) |
| G4 | La fermeté d'un hybride tombe entre celles de ses deux cordages (estimation) | cordeur | F3, S2 §C : chaque estimation est entre ses bornes ; défendu comme estimation |
| G5 | « Deux choses sont mesurées » | cordeur | **sans défense** : F20 en est une troisième → C1 |
| G6 | Les montants glissent ; plus d'effet s'ils reviennent | fabricant | F22, F26 (TWU, L1) ; défendu |
| G7 | Boyau en montants / poly en travers : frottement statique le plus faible | fabricant | F21 (L1) ; défendu |
| G8 | Les montants cassent les premiers (attribué à Holabird) | cordeur | F27 : présenté comme observation attribuée, pas comme fait ; défendu |
| G9 | Profilé en montants, rond en travers (attribué à Eriksson) | fabricant (Toroline, Solinco) | F24 (usage attribué), F23 ; défendu (attribution du tableau : C2) |
| G10 | « La combinaison n'a jamais été mesurée » ; « un seul essai publié » | fabricant | F23, F24, F20 : défendu seulement sous « nous n'avons trouvé » → C13-1, C13-2 |
| G11 | Klip X-Plosive : 76 contre 70 | fabricant (Klip) | F20, extrait mot pour mot ; défendu |
| G12 | Indices et paliers des six exemples (Razor Code / X-One 30 Ferme ; 4G / NXT 33 Ferme…) | fabricants (Tecnifibre, Luxilon, Solinco, Wilson, Toroline) | F10-F15, S2 §C, R ; rigidités † (bloc `valeurs-produit`) ; présentés comme estimations ; défendu |
| G13 | 4G / NXT au-dessus du seuil d'alerte bras sensible | fabricant ; médecin | F14, F2 : constat de position, montage nommé, sans conseil de santé (charte F7) ; défendu |
| G14 | « 650 hybrides … polyester en montants … 0 à 7 points sous le polyester seul » | fabricant | **sans défense** dans sa portée : 675 combinaisons, 2 au-dessus → C3 a |
| G15 | « Le seul couple profilé/rond » mesuré | fabricant (Toroline : Super Toro / Cash…) | **sans défense** : 8 couples (S2 §H) → C4 |
| G16 | 1 826 paires ; 162 changements de palier | — | S2 §E, chiffres justes ; portée : C3 b |
| G17 | Le boyau : rigidité « pas alignée sur une mesure de laboratoire » | fabricant (Wilson, Babolat : « TWU a mesuré le boyau ») | Q-4 : la phrase ne dit pas que le boyau n'a jamais été mesuré ; 0 sur 7 (F7) ; défendu |
| G18 | Aucun set publié n'a ses deux cordages mesurés | Babolat, Wilson | F18, Q-1, Q-4 ; défendu |
| G19 | Le configurateur « étiquette » la rigidité des sets | lecteur, `tsa-core` | **sans défense** : F35 → C5 |
| G20 | « En hybride, deux usages s'opposent » ; 4 lb | cordeur | GT-F22 défendu ; le second usage n'est pas propre à l'hybride : **sans défense** dans cette portée → C6 |
| G21 | Un écart autour de la même moyenne ne change pas l'indice ; « se juge à la sensation » | cordeur | F16, GT-F30 : énoncé sur l'indice ; défendu |
| G22 | « Le cordage le plus rigide y fait le tamis le plus ferme » | cordeur | **sans défense** tel quel (indice ; écart nul dans 1 086 cas) → C7 |
| G23 | « Il est moins ferme … que son polyester monté seul » | fabricant | **sans défense** : 36 égalités, 2 dépassements → C8 |
| G24 | « Non » : un hybride polyester / X-One Biphase n'est jamais aussi souple qu'un X-One intégral | Tecnifibre, Yonex, Toroline | **sans défense** en général : 3 polyesters sur 45 (F36) → C9 |
| G25 | Babolat : 45 % du top 20 ATP, 65 % de la WTA | Babolat | F31 : mot pour mot, attribué, daté, périmètre juste, « sans source ni saison » ; défendu |
| G26 | « Aucun montage de professionnel ne réunit deux sources indépendantes » | tout lecteur (Federer) | **sans défense** : F37, F38 → C10 |
| G27 | « La jauge la plus rigide mesurée » pour tout cordage | fabricant | **sans défense** hors des cordages † (Q-4) → C11 |
| G28 | Santé : l'indice ne dit rien de l'effet sur un bras ; seuils d'alerte ; renvoi à un professionnel | médecin | charte F7 : aucun effet prêté au matériel, aucun conseil conditionné par la santé, le renvoi est présent ; défendu |
| G29 | Tennisnerd : « liens d'affiliation déclarés » | l'auteur cité | **sans défense** : F24 corrigé → C12 |
| G30 | « Aucune source primaire ne fixe d'écart » ; « Aucune mesure ne désigne un meilleur travers » ; « Aucun essai publié ne compare la durée de vie » ; « aucune mesure publiée » du poids de chaque sens | fabricant, cordeur | GT-F28, Q1, Q2, F30 : défendu seulement sous « nous n'avons trouvé » → C13-3 à C13-7 |
| G31 | « Hybride dit « inversé » » pour boyau en montants | cordeur (la terminologie varie) | terme présenté comme une appellation (« dit »), relevé au §1 ; défendu |

**Bilan** : 31 affirmations contestables. 11 sont sans défense en l'état (G5, G14, G15, G19, G20, G22, G23, G24, G26, G27, G29 ; corrections C1, C3 à C12). 2 ne sont défendues que sous la forme « nous n'avons trouvé » (G10, G30 ; C13). 18 sont défendues. Le verdict principal (G4, G12) passe.

### Points de vigilance du brief

- **A-2, la source « vidéo ».** Les sources des deux articles ne citent **aucune vidéo**.
  - La ligne « partenariat avec Toroline… » vise l'article **écrit** de Tennisnerd (J. Eriksson, 6/11/2026), relu le 23/11 : il n'a pas de vidéo intégrée, seulement des liens vers la chaîne YouTube du site.
  - Il n'établit **aucun fait** de l'article. Il sert à deux usages attribués nommément à son auteur, présentés comme tels (A17 ; les 4 lb, A49), et à une cellule de tableau à attribuer nommément (C2).
  - L'usage « travers un peu moins tendus » a une seconde source, sans lien de marque : GT-F23 (Racketpedia).
  - La mention du partenariat est à corriger (C12).
- **Q-1, sets.** Aucun set n'est chiffré. Champion's Choice est cité une seule fois, sous son nom Tennis Warehouse, sans sens, sans joueur et sans 222. Ni 222 (seule occurrence : une coordonnée du schéma SVG), ni 194,4, ni « tenue » dans les deux articles (recherche du 23/11). Les deux sets « fiche » Tecnifibre ne sont pas présentés comme des sets (note du tableau : « pas des sets prémontés »).
- **Q-4.** Aucun indice ne lit 80,6 : la chaîne « 80,6 » est absente des deux articles, et les six exemples n'ont aucun boyau. Aucune fiche sans provenance n'est dite mesurée : les 11 cordages du tableau sont mesurés (S2 §C : « mesuré true ») ; RPM Blast et ALU Power sont cités comme non chiffrés.
- **Q1, le 60/40.** Il est dit « convention du site » (A5, A30), jamais mesure. « Profilé en montants, rond en travers » est présenté comme un usage (titre de H3, A17, A25).
- **Babolat 2020.** Attribué, daté, périmètre « de la WTA » / « in the WTA » (65 %, pas « des joueuses du top 20 »), « sans source ni saison » (A57).
- **Santé (F7, règle 2).** Aucune promesse pour le bras, aucun effet tiré de l'indice, aucun avis conditionné par un état de santé. Les seuils s'écrivent en constat. La douleur renvoie à un professionnel de santé, en FR et en EN (A61).
- **Q-8 : Federer.** F4 est tenu : deux sources indépendantes et datées (F37 : Tennis.com, 2009 ; F38 : The New Yorker, 2014, lu dans l'extrait de Longreads), plus les propos de Federer rapportés par Tennis-X en 2014 (F39). Le détail est au §4, sous Q-8.
- **Les quatre liens entrants** (diff `dba4f8d...ff3e85a`). `cordage-mono-vs-multifilament` §08, `polyester-vs-multifilament-strings`, `guide-tension-cordage-tennis` §3 et `tennis-string-tension-guide` : chacun ajoute une phrase de renvoi en fin de paragraphe, sans changer un chiffre, une date ni une autre phrase.
- **F5, F6, F8, F11.**
  - F5 : aucune chaîne de testeurs n'est donnée comme auteur d'une note.
  - F6 : aucune métadonnée interne.
  - F8 : aucun lien d'affiliation ; les seuls liens produit vont vers les fiches du site.
  - F11 : chaque chiffre qui vieillit porte sa date : base au 23/11/2026, Babolat 2020, compositions lues le 23/10/2026.
- **Hors périmètre**, sans correction :
  - la biographie d'auteur (« depuis plus de 15 ans ») est le gabarit de 10 articles du blog ;
  - les titres de `citation` du JSON-LD ont été revus par `tsa-acquisition` au 4b.

### Contre-vérification du 2026-11-23 — `tsa-pigiste`

*Sur le commit `764bf52`, qui comprend la passe finale (`8d4f1c6`), le retrait A-3 (`0cf25d8`) et les `citation` de `tsa-acquisition` (`764bf52`). Périmètre fixé par l'orchestrateur : C1 à C13, la FAQ 1, les phrases Q-8 / A-3, les renvois P1 et les mots ajoutés.*

**Verdict : non soldé, 3 corrections restantes, mineures (R1 à R3 ci-dessous).**
- C1 à C13 sont soldées sur le fond.
- R1 à R3 portent sur un mot ou une incise : une attribution (C10), une nuance de la source perdue en FR (C6) et une nuance du FR perdue en EN (C8).
- La FAQ 1, les phrases Q-8 / A-3 et les renvois P1 sont conformes.
- FAQ visible et `FAQPage` : 4 questions sur 4 identiques en FR comme en EN, réponses comprises, une fois `&nbsp;` ramené à l'espace.

**C1 à C13, phrase finale citée (FR · EN) :**

| C | Soldée | Phrase finale |
|---|---|---|
| C1 | oui | « Trois choses ont été mesurées : le glissement des montants sur les travers, le frottement entre cordes et, sur le seul essai trouvé, la raideur du tamis dans les deux sens ; le reste relève de l'usage. » · « Three things have been measured: […] and, in the one test we found, the bed's stiffness both ways round; the rest is habit. » |
| C2 | oui | « Usage défendu par Jonas Eriksson (Tennisnerd), partenaire de Toroline ; non mesuré » · « Habit defended by Jonas Eriksson (Tennisnerd), a Toroline partner; not measured » |
| C3 a | oui | « Sur les 650 hybrides polyester / multifilament de nos cordages mesurés où le polyester, plus rigide, est en montants, l'estimation est de 0 à 7 points sous le polyester monté seul, et le palier change dans 372 cas. » · « Across the 650 polyester/multifilament hybrids from our measured strings where the stiffer polyester is in the mains, […] » |
| C3 b | oui | « Sur les 1 826 paires de cordages mesurés de rigidités différentes » · « Across the 1,826 pairs of measured strings with different stiffness » |
| C4 | oui | « l'un des huit couples profilé/rond dont les deux cordages sont mesurés et la forme sourcée, celui dont l'écart de rigidité est le plus grand » · « one of eight shaped/round pairs with both strings measured and a sourced profile, the one with the widest stiffness gap » |
| C5 | oui | « Leur fiche produit affiche une rigidité dérivée de leurs deux cordages et la signale comme telle ; le configurateur reprend ce chiffre : ce n'est pas une mesure du set. » · « Their product pages show a stiffness derived from their two strings and say so; the configurator uses that figure: […] » |
| C6 | oui ; **R2** en FR | « En hybride, la presse spécialisée décrit l'usage de tendre davantage le cordage le plus souple ; plus généralement, selon Jonas Eriksson, beaucoup de joueurs tendent un peu moins les travers, et 4 lb (environ 2 kg) est le plus grand écart qu'on voie. Aucun de ces usages n'est mesuré. » · « […] more generally, according to Jonas Eriksson, many players string the crosses a little looser, and 4 lb (about 2 kg) is about as big a gap as you'll see. None of these habits is measured. » |
| C7 | oui | « Sur notre indice, le cordage le plus rigide en montants donne un chiffre égal ou plus haut qu'à l'envers, de 0 à 2 points. » · « On our index, the stiffer string in the mains gives the same figure as the other way round or a higher one, by 0 to 2 points. » |
| C8 | FR oui ; **R3** en EN | « Sur notre indice, il n'est jamais plus ferme que son polyester monté seul quand ce polyester, plus rigide, est en montants : de 0 à 7 points de moins sur nos 650 couples polyester / multifilament mesurés. Il n'est pas forcément confortable pour autant : […] » · « […] That does not make it comfortable: none of our six examples reaches the Comfortable tier. » |
| C9 | oui | « Pas avec nos deux exemples : […] Cela dépend du polyester : sur nos 45 polyesters mesurés, 3 donnent 25 ou moins avec ce travers. Nous n'avons trouvé aucun essai publié […] » · « Not with our two examples: […] of our 45 measured polyesters, 3 give 25 or less with this cross. […] » |
| C10 | oui sur le fond ; **R1** | « Roger Federer jouait boyau en montants et polyester (Luxilon ALU Power Rough) en travers, selon Tennis.com en 2009 et The New Yorker en 2014. Un cadre de joueur professionnel n'est souvent pas le modèle du commerce, et ce montage ne dit rien de celui qui vous conviendrait. » · « Roger Federer played gut in the mains and polyester (Luxilon ALU Power Rough) in the crosses, according to Tennis.com in 2009 and The New Yorker in 2014. A professional's frame is often not the retail model, and that setup says nothing about the one that would suit you. » |
| C11 | oui | « l'indice lit la rigidité de la fiche, quelle que soit la jauge choisie ; pour un cordage marqué †, c'est celle de sa jauge la plus rigide mesurée » · « for a string marked †, that is its stiffest measured gauge » |
| C12 | oui | « — collaboration avec Toroline (son cordage Vamos) et liens vers des partenaires, dont Toroline, déclarés par l'auteur » · « — the author discloses a collaboration with Toroline (his Vamos string) and links to partners, Toroline among them » |
| C13 | oui, 7 sur 7 | « nous n'avons trouvé aucune mesure de la combinaison » ; « Nous n'avons trouvé qu'un essai publié qui compare » ; « sans mesure publiée trouvée à l'appui » ; « Nous n'avons trouvé aucune source primaire qui fixe un écart » ; FAQ 1 « Nous n'avons trouvé aucune mesure qui désigne un meilleur travers » ; FAQ 3 « Nous n'avons trouvé aucun essai publié qui compare » ; « aucune mesure publiée trouvée ». EN de même |

**Points précis demandés :**
- **C6, l'attribution à Eriksson est juste**, d'après la page relue (F25) : « many players run the crosses a little lower than the mains » et « Four pounds, or about two kilos, is about as big a gap as you'll see ».
  - L'usage propre à l'hybride, « presse spécialisée », est GT-F22 (Tennis.com, 2024).
  - Le joueur de l'exemple d'Eriksson n'est pas nommé.
  - Seul écart : le FR perd le « about » (R2).
- **C10 est daté** (2009 et 2014, au passé), porte la réserve pro stock (F4) et ne donne aucun conseil : « ne dit rien de celui qui vous conviendrait ». Les sources visibles et les `citation` (Tennis.com 2009 ; Longreads 2014, `isBasedOn` The New Yorker, M. Steinberger, 2014) concordent avec F37 et F38.
  - Écart (R1) : la parenthèse « Luxilon ALU Power Rough » se lit comme attribuée aux deux sources, alors que seul Tennis.com nomme ce cordage ; The New Yorker dit « polyester ».

**FAQ 1, par le moteur** : « Un travers plus souple abaisse l'indice ou le laisse inchangé » est juste. Il n'est jamais relevé, ni par rapport au polyester seul, ni entre deux travers. Il est inchangé dans 244 des 1 677 couples mesurés, de même nature que G23 (36 sur 650).

```
2026-11-23T11:39:50+01:00
$ npx --yes tsx <scratchpad>\pig-hybride\faq1-4a.mts
commit 0cf25d8 ; src/data, src/lib : conformes au commit
Cordages mesurés (61) : polyesters mesurés × travers mesurés
  (a) polyester en montants, travers plus souple que lui : 1677 couples ; indice abaissé 1433 ; inchangé 244 ; relevé 0
  (b) même polyester, travers A plus souple que B : 79475 comparaisons ; A plus haut que B 0 ; égal 14511
Toute la base (179) : polyesters × tous travers
  (a) polyester en montants, travers plus souple que lui : 12562 couples ; indice abaissé 10920 ; inchangé 1642 ; relevé 0
  (b) même polyester, travers A plus souple que B : 1591262 comparaisons ; A plus haut que B 0 ; égal 263285
```

**Phrases Q-8 et A-3 des articles existants : conformes.**
- `cordage-mono-vs-multifilament.html` :
  - l. 618 : « À l'inverse, Roger Federer jouait boyau aux montants, mono aux travers, selon Tennis.com en 2009 (qui nomme le Luxilon ALU Power Rough) et The New Yorker en 2014. »
  - l. 664 : J. Levey, « Winning Combination », 2 octobre 2009 ; M. Steinberger, 2014, lu dans l'extrait publié par Longreads le 4 septembre 2014.
- `polyester-vs-multifilament-strings.html` :
  - l. 387 : « The reverse configuration, gut mains and poly crosses, is what Roger Federer played, according to Tennis.com in 2009 (which names Luxilon ALU Power Rough) and The New Yorker in 2014. »
  - l. 464 : même référence.
- Les sources et les dates correspondent à mes extraits de Q-8. « Luxilon Alu Power Rough » est bien dans l'extrait de Tennis.com : « He uses natural gut in his mains, and Luxilon Alu Power Rough in his crosses. »
- Aucune affirmation non sourcée ne reste dans ces phrases : « le célèbre », « privilégie le toucher… » et « il s'use vite… » sont retirés.
- Les dates visibles et `dateModified` sont passées au 2026-11-23 (F11).

**Renvois P1 : conformes.** `cordage-polyester-tennis-elbow` §6 et `polyester-strings-tennis-elbow` §6 ajoutent une phrase (« Pour un hybride dont les deux cordages ont une rigidité alignée sur une mesure de laboratoire, notre article […] donne une estimation de l'indice, avec ses bornes »), conforme à A-1 et F3. Aucun autre mot ne change ; « 15 de nos 45 multifilaments » reste juste (S2 §B).

**Glissance des mots ajoutés :**

| Mots ajoutés | Défense |
|---|---|
| « sur le seul essai trouvé » ; « Nous n'avons trouvé… » (C1, C13) | F20 ; Q1, F23, F30, GT-F28 (introuvables) |
| « Jonas Eriksson (Tennisnerd), partenaire de Toroline » ; « collaboration avec Toroline (son cordage Vamos) » (C2, C12) | F24 corrigé : « Vamos is my collab with Toroline » |
| « de rigidités différentes » ; « où le polyester, plus rigide, est en montants » ; « jamais plus ferme » ; « égal ou plus haut » (C3, C7, C8) | S2 §E et §F ; contrôles de `--check` |
| « l'un des huit […] le plus grand écart » (C4) | S2 §H : 8 couples ; 216,6 − 164,6 = 52 lb/in, le plus grand des huit |
| « Leur fiche produit […] la signale comme telle ; le configurateur reprend ce chiffre » (C5) | F35 |
| « selon Jonas Eriksson, beaucoup de joueurs… » (C6) | F25 ; « est le plus grand écart » : **R2** |
| « 3 donnent 25 ou moins » (C9) | F36 |
| « pour un cordage marqué † » (C11) | F5 ; réponse de `tsa-core` à Q-4 |
| Federer, daté ; « Un cadre de joueur professionnel n'est souvent pas le modèle du commerce » (C10) | F37, F38 ; charte F4 ; parenthèse attribuée aux deux sources : **R1** |
| « That does not make it comfortable » (C8, EN) | **R3** : le FR dit « pas forcément » ; un hybride mesuré peut être Confortable (F36 : Yonex Poly Tour Air / X-One Biphase, 24) |
| « abaisse l'indice ou le laisse inchangé » (FAQ 1) | moteur, ci-dessus |
| Phrases Q-8 et P1 des quatre articles existants | F37, F38 ; A-1, F3 |
| Ajouts de la 4b (P3 à P6 : intertitre, liens, titres des sources) | aucun fait nouveau ; titres relevés par `tsa-acquisition` le 23/11 |

**Corrections restantes, à `tsa-redacteur` :**
- **R1** · FAQ 4, FR, EN et `FAQPage` (C10).
  - En cause : « polyester (Luxilon ALU Power Rough) en travers, selon Tennis.com en 2009 et The New Yorker en 2014 ».
  - Attendu, comme dans les articles existants : « Roger Federer jouait boyau en montants et polyester en travers, selon Tennis.com en 2009 (qui nomme le Luxilon ALU Power Rough) et The New Yorker en 2014. » · « Roger Federer played gut in the mains and polyester in the crosses, according to Tennis.com in 2009 (which names Luxilon ALU Power Rough) and The New Yorker in 2014. »
- **R2** · §5, FR seul (C6).
  - En cause : « et 4 lb (environ 2 kg) est le plus grand écart qu'on voie ».
  - Attendu : « et 4 lb (environ 2 kg) est à peu près le plus grand écart qu'on voie », comme l'EN et la source (F25).
- **R3** · FAQ 2, EN et `FAQPage` EN (C8).
  - En cause : « That does not make it comfortable ».
  - Attendu : « That does not necessarily make it comfortable », comme le FR (« pas forcément »).

Ensuite : `--check`, `redaction:valeurs` et `audit:jsonld`. Aucune expression contrôlée par `expectations()` n'est touchée.

**Sorties**, 2026-11-23, avant R1 à R3 :

```
2026-11-23T11:40:32+01:00 · commit 764bf52
$ npx --yes tsx scripts/blog-covers/build-hybride-figures.mts --check
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « schema » conforme à la base
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « tableau » conforme à la base
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « graphique » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « schema » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « tableau » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « graphique » conforme à la base

blocs et chiffres du texte conformes à la base
exit=0

$ npm run redaction:valeurs -- docs/redaction/montage-hybride-cordage-tennis.md
33 valeur(s) contrôlée(s), 0 écart(s)
exit=0
```


**R1 à R3 appliquées par `tsa-redacteur`, 2026-11-23**, à l'identique des formes attendues ci-dessus, et rien d'autre dans le texte :
- R1 : FAQ 4, FR, EN et `FAQPage` FR et EN ;
- R2 : §5, FR ;
- R3 : FAQ 2, EN et `FAQPage` EN.

Sorties après R1 à R3 : §7, entrée « étape 6, contrôles avant la PR ».

---

## 6. Revue SEO — `tsa-acquisition`

### Contrôle on-page

*Passe du 2026-11-23, sur le commit `ca9326d` plus mes modifications (commit de l'étape 4b, §7).*

- [x] **Balises conformes au §1.**
  - FR : title « Cordage hybride tennis : montants, travers et fermeté » (53 caractères) ; meta de 145.
  - EN : title « Hybrid Tennis String Setup: Mains, Crosses and Firmness » (55) ; meta de 151.
  - H1 et slugs : ceux du §1.
  - Un écart motivé : `og:title` et `twitter:title` ne reprennent plus le H1, coupé par les cartes de partage (89 et 103 caractères). FR « Cordage hybride : montants, travers, et quelle fermeté attendre » (63) ; EN « Hybrid Tennis Strings: Mains, Crosses and How Firm the Setup Will Be » (68).
- [x] **Canonical et hreflang.** Canonical sur l'URL de chaque page. hreflang réciproques `fr`, `en`, `x-default` vers le FR (convention du blog, Q-7), vers deux URL qui répondent 200 (`next start`, port 3102).
- [x] **JSON-LD**, analysé sans erreur :
  - `Article` (FR) et `BlogPosting` (EN) : `image` = `og:image` (fichier présent, 1200 × 630) ; `datePublished` et `dateModified` 2026-11-23, comme la date visible ; auteur `#pierre-fermanian`, l'auteur en vigueur ; `mainEntityOfPage` = canonical ;
  - 8 `citation` : titres réels (Q-7) ;
  - `BreadcrumbList` (Accueil / Blog / Cordage hybride ; Home / Blog / Hybrid String Setup) ;
  - `FAQPage` : 4 questions, identiques à la FAQ visible (`audit:jsonld`).
- [x] **Partage.** `og:image` = `twitter:image`, 1200 × 630, avec `og:image:alt`. Couvertures regardées : titre, tamis générique, aucune marque.
- [x] **Index et sitemap.**
  - Index FR : première carte de « Tous nos articles », comme l'ajout du 13/11.
  - Index EN : première carte « Featured Article », même précédent.
  - `src/app/sitemap.ts` : `BLOG_ARTICLES` et `EN_BLOG_ARTICLES` (noms réels des tableaux ; le modèle dit `BLOG_SLUGS`), `modified` 2026-11-23. Le sitemap construit porte les deux URL avec `<lastmod>2026-11-23</lastmod>`.
- [x] **Maillage.**
  - Configurateur dans le corps, sans `noreferrer` ni `referrerpolicy` : FR 3 liens (encart, §4, §6), EN 3 plus l'encart final.
  - Fiches produit liées dans le tableau.
  - 4 liens entrants posés par le rédacteur (`cordage-mono-vs-multifilament`, `guide-tension-cordage-tennis`, et leurs pages EN).
  - Lien depuis `cordage-polyester-tennis-elbow` §6 : proposé (P1).
  - **Aucun lien entrant depuis `guide-materiel-tennis` §5** (réponse à Q-2).
- [x] **Contrôles verts**, sorties ci-dessous.

### Contrôles (commande et sortie)

Worktree `C:\Users\plene\Documents\_wt\redac-hybride`, 2026-11-23, après mes modifications. Lignes de bilan copiées des sorties ; journaux complets hors dépôt (`scratchpad\acq-*.log`).

```
$ npm run build                → exit 0
 ✓ Compiled successfully
 ✓ Generating static pages (329/329)

$ npm run type-check           → exit 0

$ npm run audit:jsonld         → exit 0
  OK    FAQPage : 34 FAQ, 157 questions, chaque question et chaque réponse figurent en entier dans le texte visible
  OK    sitemap : 38 articles, chaque date `modified` est le dateModified de l'article, aucun new Date() sans argument
  OK    sitemap construit : 38 <lastmod>, tous sur des articles et à leur vraie date
Conforme — 0 échec(s), 0 avertissement(s)

$ npm run audit:comptages      → exit 0
  OK    blog : 40 pages lues, aucun total divergent
  OK    public/data/catalog.json : mêmes totaux que src/data (129 / 179)
Conforme — 0 échec(s), 0 avertissement(s)

$ npm run audit:claims         → exit 0
  OK    index du blog FR et EN : 2 fichiers lus, aucune allégation ni claim faux
        (articles : 38 pages lues, 10 motif(s) signalé(s) à tsa-pigiste / tsa-redacteur, jamais bloquants)
Conforme — 0 échec(s), 10 avertissement(s)
$ node scripts/qa-claims.mjs --all   → exit 0 ; aucun des 10 AVERT ne porte sur les deux nouveaux articles

$ npm run audit:blog-funnel    → exit 0
  OK    public/blog : 22 pages contrôlées (GA4 unique, referrer intact)
  AVERT public/en/blog/next-gen-tennis-racquets-fonseca-mensik-cobolli-jodar.html : aucun lien vers le configurateur EN (antérieur, hors de cette PR)
  OK    public/en/blog : 18 pages contrôlées (GA4 unique, referrer intact)
instrument A3 intact : la lecture GA4 referrer -> configurateur reste valide

$ npm run audit:blog-images    → exit 0
  OK    public/blog : 21 articles FR + index — couverture, partage, JSON-LD et provenance conformes ; 6 en exception (visuel de corps)
  OK    public/en/blog : 17 articles EN + index — couverture, partage, JSON-LD et provenance conformes ; 5 en exception (visuel de corps)
images du blog conformes à la règle du 10/10/2026

$ npx next start -p 3102       (port libéré avant, serveur arrêté par son PID après)
200 /blog/montage-hybride-cordage-tennis.html · 200 /en/blog/hybrid-tennis-string-setup.html
200 /blog/index.html (carte présente) · 200 /en/blog/index.html (carte présente) · 200 /sitemap.xml (deux URL présentes)
200 couverture-montage-hybride-fr.webp · 200 couverture-montage-hybride-en.webp
```

Non vérifié : `/blog/` et `/en/blog/` répondent 308 puis 404 sous `next start` (sortie `standalone`), pour tous les articles et avant cette PR. Les fichiers `index.html` sont servis. La production se vérifie à l'étape 8. Le rendu visuel des deux cartes n'a pas été regardé dans un navigateur : elles reprennent le gabarit des cartes voisines.

### Propositions au rédacteur

Aucune ne touche un fait, un chiffre, un verdict ni un conseil de santé. Les liens proposés pointent vers des pages qui existent (vérifié le 23/11), et aucun des articles visés n'est dans `scripts/qa-blog-images.exceptions.json`.

| # | Où | Proposition | Motif SEO | Réponse du rédacteur |
|---|---|---|---|---|
| P1 | `cordage-polyester-tennis-elbow` §6 (`#hybrides`) et `polyester-strings-tennis-elbow` §6 (`#hybrids`), après « …une précision qu'il n'a pas. » / « …a precision it does not have. » | Ajouter une phrase. FR : « Pour un hybride dont les deux cordages ont une rigidité mesurée, notre article `<a href="/blog/montage-hybride-cordage-tennis.html">`cordage hybride&nbsp;: montants, travers et fermeté`</a>` donne une estimation de l'indice, avec ses bornes. » EN : « For a hybrid whose two strings both have a lab-measured stiffness, our `<a href="/en/blog/hybrid-tennis-string-setup.html">`hybrid tennis string setup`</a>` guide gives an estimate of the index, with its bounds. » | Lien entrant depuis la page la plus proche par l'intention (« hybride polyester tennis elbow », §1), ancre qui porte la requête principale. « Nous ne la chiffrons pas ici » reste vrai (A-1). La phrase parle de l'indice, pas du bras (F7). Date : même règle que tes quatre autres liens entrants | **Acceptée**, avec une retouche : « rigidité mesurée » devient « rigidité alignée sur une mesure de laboratoire », le vocabulaire du paragraphe qui la reçoit (A-1). FR et EN posées. Dates inchangées : aucun fait de ces articles ne change. |
| P2 | H3 du §2, FR et EN | « Profilé en montants, rond en travers&nbsp;: un usage » → « Profilé en montants, rond en travers (poly/poly)&nbsp;: un usage » ; « Shaped mains, round crosses: a habit » → « Shaped mains, round crosses (poly/poly): a habit » | La requête secondaire « hybride poly poly » / « poly poly hybrid » (§1) n'est dans aucun intertitre, seulement au tableau et au §4. Un intertitre pèse plus qu'une cellule | **Acceptée**, FR et EN. |
| P3 | Chapô, première phrase, FR et EN | « Aucune mesure ne dit… » → « Dans un cordage hybride, aucune mesure ne dit… » ; « No measurement tells you… » → « In a hybrid setup, no measurement tells you… ». Le reste ne change pas | La requête principale n'apparaît pas dans le chapô. Sa première phrase est l'extrait probable quand le moteur n'affiche pas la meta (Bing, Copilot) | **Acceptée**, FR et EN. Les deux premières phrases restent la réponse. |
| P4 | §5, après « …se juge donc à la sensation. » / « …a matter of feel. » | FR : « Pour comparer deux montages, voir notre `<a href="/blog/comparer-deux-montages-cordage-tension.html">`protocole de comparaison`</a>`. » EN : « To compare two setups, see our `<a href="/en/blog/compare-two-string-setups-same-tension.html">`comparison protocol`</a>`. » | Lien sortant prévu au §1 et absent. Il mène au satellite du même ensemble (tension, fermeté), à l'endroit où le lecteur doit juger à la sensation | **Acceptée**, FR et EN. |
| P5 | « Ce que cet article ne dit pas », ligne « La jauge » / « Gauge », FR et EN | Ajouter en fin de ligne : « (voir notre `<a href="/blog/jauge-cordage-tennis.html">`guide des jauges`</a>`) » ; « (see our `<a href="/en/blog/tennis-string-gauge.html">`string gauge guide`</a>`) » | Lien sortant prévu au §1 (jauge des travers) et absent. Il répond à la question que cette limite fait naître | **Acceptée**, fusionnée avec C11, FR et EN. |
| P6 | Sources visibles, FR et EN (facultatif) | Écrire les titres exacts, vérifiés le 23/11 : « Static Friction and Spin » (`COF.php`), « Sliding Friction and Spin » (`slidingCOF.php`), « Klip X-Plosive Tennis String Review » (test TW), à la place des libellés descriptifs | Même titre dans la liste visible et dans les `citation` du JSON-LD ; un titre exact se retrouve par une recherche | **Acceptée**. Les titres exacts figurent dans la liste visible et sont identiques aux `citation`. |

### Reprise avant la PR (2026-11-23, sur `0cf25d8`)

- **Sitemap** : `modified` passe à `'2026-11-23'` pour `cordage-mono-vs-multifilament.html` et `polyester-vs-multifilament-strings.html`, datés par la passe finale (phrases Federer, Q-8 et A-3). Les dates des deux nouveaux articles restent justes (2026-11-23).
- **`citation`** des deux nouveaux articles, FR et EN : ajout des deux sources Federer de la liste visible. Titres relevés sur les pages ouvertes le 23/11 :
  - « Winning Combination », Jon Levey, Tennis.com, 2009-10-02 ;
  - « Meet the Team That Tennis Pros Pay $40K a Year to String Their Racquets », Longreads, 2014-09-04, avec `isBasedOn` : Michael Steinberger, The New Yorker, 2014, sans titre ni URL (page non ouverte, F9).
- **Articles existants retouchés** : leur `<head>` ne porte aucune `citation`, donc rien n'est ajouté.

```
$ npm run build                → exit 0
 ✓ Compiled successfully
 ✓ Generating static pages (329/329)

$ npm run audit:jsonld         → exit 0
  OK    FAQPage : 34 FAQ, 157 questions, chaque question et chaque réponse figurent en entier dans le texte visible
  OK    sitemap : 38 articles, chaque date `modified` est le dateModified de l'article, aucun new Date() sans argument
  OK    sitemap construit : 38 <lastmod>, tous sur des articles et à leur vraie date
Conforme — 0 échec(s), 0 avertissement(s)

$ npm run audit:claims         → exit 0
  OK    index du blog FR et EN : 2 fichiers lus, aucune allégation ni claim faux
        (articles : 38 pages lues, 10 motif(s) signalé(s) à tsa-pigiste / tsa-redacteur, jamais bloquants)
Conforme — 0 échec(s), 10 avertissement(s)
$ node scripts/qa-claims.mjs --all   → aucun AVERT sur les deux nouveaux articles
```

### Vérification en production (après fusion)

- …

---

## 7. Journal

- 2026-11-23 · orchestrateur — étape 0 : dossier copié de `_modele.md`, en-tête rempli, worktree `_wt/redac-hybride` et branche `agent/redaction/montage-hybride-cordage-tennis` créés depuis `origin/main` (`dba4f8d`) ; circuit complet ; arbitrages A-1 et A-2 au §4. Entrée : rapport `tsa-acquisition` du 23/11 sur le classeur de veille (P1, 7 signaux ; hybride traité seulement par fragments dans `guide-materiel-tennis` §5, `cordage-mono-vs-multifilament` §08, `cordage-polyester-tennis-elbow` §6, `guide-tension-cordage-tennis` §3). RELAIS → `tsa-acquisition` : brief SEO (§1).
- 2026-11-23 · `tsa-acquisition` — étape 1 : brief SEO rempli au §1.
  - Requêtes « cordage hybride tennis » / « hybrid tennis string setup ». Slugs confirmés (`montage-hybride-cordage-tennis`, `hybrid-tennis-string-setup`). « pour le bras » est retiré des balises (F7).
  - SERP datée du 23/11 : Bing, Google et DuckDuckGo refusent l'outil, d'où un arrêt sans contournement (F9). Le relevé passe par l'outil de recherche de la session (moteur non déclaré, US) : 8 pages ouvertes, aucune ne chiffre la fermeté d'un hybride, et aucun guide éditorial indépendant en français.
  - Décompte des sets vérifié : **9**, soit 5 à composition publiée, 3 « fiche », 1 non publiée. La 10e étiquette `composition:` est le type de l'interface (ligne 37) : il y a 5 sets publiés, pas 6.
  - Aucun article à lier en entrée n'est dans `qa-blog-images.exceptions.json`.
  - Questions Q-1 (A-1 et sets prémontés) et Q-2 (`guide-materiel-tennis` §5) posées à l'orchestrateur au §4.
  - RELAIS → `tsa-pigiste` : dossier de faits (§2) et candidats d'iconographie (§3) sur les questions Q1 à Q10 du §1 de `docs/redaction/montage-hybride-cordage-tennis.md`, circuit complet. En priorité : Q3 et Q4 (cordages mesurés et exemples chiffrés par `setupFirmnessIndex`, avec contrôle de `tsa-core`), puis Q1 (poids de chaque sens, pistes TWU et TW non ouvertes). Faits du guide des tensions à reprendre depuis `docs/redaction/guide-tension-cordage-tennis.md`.
- 2026-11-23 · orchestrateur — brief relu (§1 : requêtes, SERP par l'outil de recherche de la session faute d'accès à Bing et Google, plan en 9 sections, Q1 à Q10, visuels). Réponses à Q-1 (sets prémontés sans chiffre) et Q-2 (pas de lien entrant depuis `guide-materiel-tennis` §5 ; correctif renvoyé à P3). Correction : 9 sets, dont 5 à composition publiée, et non 6 comme l'écrivait l'orchestrateur. RELAIS → `tsa-pigiste` : dossier de faits (§2) et iconographie (§3), Q1 à Q10.
- 2026-11-23 · `tsa-pigiste` — étape 2 : dossier de faits (§2) et candidats d'iconographie (§3).
  - **34 faits** :
    - 20 BASE, tirés du moteur réel au commit `c30eed7`. La commande et la sortie S1 sont au §2 ; le script est hors dépôt ;
    - 5 L1 (TWU), 1 L2, 4 L3 et 2 L0 (Babolat, allégations) ;
    - 1 reprise des faits du guide des tensions (GT-F4, GT-F19 à GT-F23, GT-F28, GT-F30) ;
    - 1 introuvable (Q7).
  - **Q3** : 62 cordages sur 179 sont alignés sur une mesure TWU, dont 46 polyesters, 15 multifilaments et 1 synthétique. Le relevé du brief en omettait 43 au statut `appliquee`, plus les 8 Toroline.
  - **Q4** : six hybrides chiffrés. L'inversion change l'indice de 0 à 2 points sur 1 887 paires, et parfois le palier. Un écart de tension autour de la même moyenne ne change pas l'indice.
  - **Q1 introuvable pour le poids** : un seul test TW (Klip X-Plosive, RDC 76 contre 70) établit le sens. Le 60/40 reste une convention.
  - **Q8** : aucun joueur ne passe F4.
  - **Refus d'accès** : toroline.com (429), solincosports.com (403), un original sur upload.wikimedia.org (429). Arrêt au premier refus, sans contournement.
  - **Iconographie** : aucune photo libre ne montre un tamis hybride sans marque ; la couverture passe par la voie 2. Le graphique a ses données au §3.
  - **Questions** : Q-3, Q-4 et Q-5 à `tsa-core` ; Q-6 à l'orchestrateur.
  - RELAIS → `tsa-redacteur` : article FR et adaptation EN à partir du §2 seul (faits F1 à F34, sortie S1), visuels I1, I6, I7 et éventuellement I8 du §3. Exemple F15 sous réserve de Q-3. Aucun indice de set (Q-1). Lire les « Points glissants » avant d'écrire.
- 2026-11-23 · orchestrateur — dossier de faits relu (34 faits F1-F34, sortie du moteur collée, `1 887` paires, points glissants présents). Réponse à Q-6 : pas d'extension du vérificateur, le moteur est relancé au fact-check. RELAIS → `tsa-core` : Q-3, Q-4, Q-5 ; et en parallèle → `tsa-redacteur` : étape 3, article FR, adaptation EN et visuels.
- 2026-11-23 · `tsa-core` — réponses à Q-3, Q-4 et Q-5 (§4), au commit `18d657e`, code en lecture seule. `npm run audit:ratings` est vert ; lignes citées : 13 ter, 13 quater et 24. Le script est hors dépôt (chemin sous Q-3).
  - **Q-3** : 7 Toroline sur 8 sont mesurées. Absolute ne l'est pas : sa jauge nominale TWU est vide, donc pas d'appariement strict. F15 tient. Décompte : 61 sur 179 ; grille : 1 826 paires. F7, F17 et I8 sont à reprendre.
  - **Q-4** : non mesurées. La valeur est voulue (règle 2 ; critères de P6 non remplis), mais la trace manque, et elles sont 40, pas 6. La phrase sur le boyau est acceptée sous la forme donnée.
  - **Q-5** : Duo Control toujours tenu à 222, aucun GO depuis le 26/10. Champion's Choice / Duo : doublon probable, non établi ; composition citée une fois ; ni le sens ni le joueur de la fiche ne se reprennent.
  - **Chantiers de base** (a) à (d), sous Q-5, hors de cette PR.
  - RELAIS → `tsa-redacteur` : F15 utilisable ; chiffres de grille 61 et 1 826 ; phrases « boyau » et « sets » selon Q-4 et Q-5. → `tsa-pigiste` : reprendre F7, F17 et I8 au §2 et au §3 avant le 4a.
- 2026-11-23 · `tsa-redacteur` — étape 3 : article FR, adaptation EN, visuels. Relus : prompt `tsa-redacteur`, `CLAUDE.md` §4, §5 ter et §6, `README.md`, `CHARTE.md` v1.2, le dossier (§1 à §4, « Points glissants » d'abord ; §4 relu après le commit `43d87a8` de `tsa-core`), les articles gabarits (`comparer-deux-montages-cordage-tension` FR/EN, `cordage-mono-vs-multifilament` §08) et, pour cohérence, `guide-tension-cordage-tennis` §3, `cordage-polyester-tennis-elbow` §6 et `cordage-tennis-elbow` (indice 30 du set Razor Code + X-One : même chiffre que mon exemple monté à la main, aucune contradiction).
  - **Pages** : `public/blog/montage-hybride-cordage-tennis.html` (1 788 mots, de « L'essentiel » aux limites, tableaux, légendes et FAQ compris, sommaire et sources exclus) ; `public/en/blog/hybrid-tennis-string-setup.html` (1 799 mots, même périmètre, ligne « English edition » comprise). Compteur hors dépôt : `scratchpad\redac-hybride\count_words.py`.
  - **Plan réel** (écart au §1, motif : tenir 1 800 mots) : réponse en deux phrases dans le chapô ; L'essentiel ; 1 Montants et travers (schéma I6) ; 2 Mesuré ou usage (H3 : glissement et frottement, profilé/rond, poids de chaque sens) ; 3 Les quatre familles (tableau) ; 4 Fermeté (H3 : estimation du site, six exemples + tableau + graphique I7 + appel au configurateur, inverser, ce que nous ne chiffrons pas, sets compris) ; 5 Écart de tension ; 6 Trois questions ; FAQ (4 questions) ; limites ; sources. Fusionnés : la section « sets » dans le 4 ; la FAQ « tendre davantage les travers » dans le 5 ; la FAQ « poly/poly » dans le 2 et le 3 ; la FAQ « durée de vie » dans la FAQ X-One Biphase (F30).
  - **Faits employés** : F1-F5, F7 et F17 (corrigés par `tsa-core` sous Q-3 : 61 cordages, 1 826 paires, 1 086 / 723 / 17, 162 ; polyester/multifilament 650, 0 à 7 points, 372), F6 (le †), F8, F9 (0 boyau sur 7 ; le 80,6 n'est jamais cité, Q-4), F10-F16, F18 (compositions ; Champion's Choice une seule fois, sous son nom Tennis Warehouse ; ni sens ni joueur ; aucune valeur du Duo Control), F19-F27, F29 (formes Toroline), F30, F31, F33, F34, GT-F22 et GT-F28 (via F28). Phrase boyau sous la forme acceptée à Q-4. **Écartés** : F28 hors GT-F22 et GT-F28 (renvoi au guide des tensions), F32 (quatre nœuds, allégation de marque). Aucun fait hors du dossier ; aucune DEMANDE AU PIGISTE.
  - **Chiffres** : tous produits par `scripts/blog-covers/build-hybride-figures.mts` (moteur réel, base au commit `43d87a8`), identiques à la sortie S1 du §2 pour F10-F16 ; `--check` vérifie les trois blocs, 12 phrases chiffrées par langue et 4 cohérences (test négatif fait : trois chiffres altérés, trois échecs). Le pigiste peut s'en servir au 4a en plus de S1 (`--facts`).
  - **Visuels** : I1, I6, I7 (§3). `CREDITS.md` : 1 ligne de couverture, 2 lignes de graphiques générés.
  - **Autres fichiers** : `scripts/blog-covers/build-covers.py` (motif et 2 entrées), `scripts/blog-covers/build-hybride-figures.mts` (nouveau), 4 liens entrants d'une phrase (Q-7). `<head>` de départ posé, à réviser au 4b (Q-7). Ni `sitemap.ts`, ni index du blog, ni `src/`.
  - **Contrôles**, au 23/11 : `npm ci` (0) ; `npm run build` compilé, 329/329 pages ; `audit:blog-funnel` intact (1 AVERT, autre article) ; `audit:blog-images` conforme (11 AVERT, exceptions d'autres articles) ; `audit:jsonld` **2 ECHEC attendus** (les deux articles absents de `sitemap.ts`, Q-7), aucun écart de FAQ ; `audit:comptages` conforme, 0 AVERT ; `audit:claims` conforme, 0 AVERT sur les six articles touchés (`--all`) ; `audit:contrast` toutes paires AA ; aucun « À SOURCER ». Rendu Playwright (Chrome, `next start` port 3100, arrêté par son PID) FR et EN à 1280 et 390 px, clair et sombre : 0 px de débordement, toutes les images chargées, aucune requête en échec, deux SVG par page lisibles en sombre ; la page EN n'a pas de thème sombre (gabarit EN). Non fait : `redaction:valeurs` (bloc du §5 vide, étape 4a).
  - Questions : Q-7 à `tsa-acquisition`, Q-8 à l'orchestrateur. RELAIS → `tsa-pigiste` (fact-check 4a, FR et EN, en relançant le moteur ; reprendre F7, F17 et I8 au §2) ET `tsa-acquisition` (passe on-page 4b, Q-7).
- 2026-11-23 · orchestrateur — rédaction relue (commit `246dba2` : FR 1 788 mots, EN 1 799 ; aucun joueur cité ; aucun lien d'achat ; 5 liens FR et 6 liens EN vers le configurateur ; build 329/329 ; `audit:jsonld` rouge en attendant le sitemap, comme prévu). Réponse à Q-8 : circuit court sur la mention de Federer dans §08, FR et EN. RELAIS → `tsa-pigiste` (4a : fact-check, F7, F17 et I8 à reprendre, vérification F4 de Federer) ET `tsa-acquisition` (4b : passe on-page, Q-7), en parallèle.
- 2026-11-23 · `tsa-acquisition` — étape 4b : passe on-page, réponse à Q-7 (§4), revue au §6.
  - **Fichiers** :
    - `<head>` FR et EN : espaces insécables, `og:title` et `twitter:title` raccourcis, `citation` corrigées (Babolat, plus trois titres descriptifs remplacés par les titres réels, pages ouvertes le 23/11) ;
    - `src/app/sitemap.ts` : une entrée FR, une EN, `modified` 2026-11-23 ;
    - une carte dans chacun des deux index du blog.
  - Corps des articles non touché.
  - **Contrôles** : `build` (329/329), `type-check`, `audit:jsonld` (0 échec, 0 AVERT, sitemap compris), `audit:comptages`, `audit:claims` (0 AVERT sur les deux articles), `audit:blog-funnel`, `audit:blog-images` : tous en 0. Pages, index, sitemap et couvertures en 200 sous `next start` (port 3102, arrêté par son PID).
  - **Propositions au rédacteur** : P1 à P6 au §6. P1 est le lien depuis `cordage-polyester-tennis-elbow` §6, FR et EN. Aucun lien depuis `guide-materiel-tennis` §5 (Q-2).
  - Hors périmètre, relevé pour plus tard :
    - la carte d'index « Cordage polyester et tennis elbow », FR et EN, dit « 46 polyesters » dans le titre et « 36 » dans le résumé ; `tsa-core` compte 45 polyesters mesurés depuis Q-3 ;
    - l'index FR annonce encore en « Prochains articles » le classement des raquettes 2026, déjà publié ;
    - l'article EN next-gen n'a aucun lien vers le configurateur (`audit:blog-funnel`).
  - RELAIS → `tsa-redacteur` : passe finale (étape 5). Répondre à P1 à P6 dans la colonne « Réponse » du §6 ; appliquer P1 si accepté.
- 2026-11-23 · `tsa-pigiste` — étape 4a : fact-check FR et EN, test de glissance (§5), réponse à Q-8 (§4), au commit `ff3e85a`.
  - **Verdict : 13 corrections demandées** (C1 à C13 au §5), aucune erreur de chiffre du moteur. 69 affirmations vérifiées en FR, 72 en EN ; 31 contestables, dont 11 sans défense et 2 à reformuler.
  - **Moteur relancé** (réponse à Q-6) : mon script `fact-check-4a.mts` (S2) et `build-hybride-figures.mts --check` / `--facts` (R) concordent sur chaque indice, chaque borne et chaque décompte. `redaction:valeurs` : 33 valeurs contrôlées, 0 écart. Sorties au §5.
  - **§2 corrigé par éditions ciblées**, anciennes valeurs barrées :
    - F7 (61 sur 179), F17 (1 826 paires ; 1 086 / 723 / 17 ; 162 ; polyester/multifilament : 650 sur 675 combinaisons, 0 à 7 points, 372) et I8 (1 826), d'après la réponse de `tsa-core` à Q-3 ;
    - mes propres erreurs de l'étape 2 : F15 (« seul couple » profilé/rond : il y en a 8), F24 (aucune affiliation déclarée), F25 (usage général, exemple en cordage unique), F29 (profils non sourcés dans d'autres fiches) ;
    - F33 mis à jour (Federer) ; ajouts F35 (configurateur sans mention de dérivation), F36 (X-One Biphase en travers), F37 à F39 (Federer).
  - **Q-8** : F4 tenu pour Federer (Tennis.com 2009 ; The New Yorker 2014, lu chez Longreads ; Tennis-X 2014 en appui). newyorker.com n'a pas pu être ouvert par l'outil : arrêt sans nouvel essai.
  - **A-2** : aucune vidéo dans les sources ; l'article écrit de Tennisnerd n'établit aucun fait.
  - Aucun fichier de `public/`, `src/` ni `scripts/` modifié. Scripts et sorties hors dépôt : `C:\Users\plene\AppData\Local\Temp\claude\9519414f725d5b3e\cbc91433-ac54-48b8-b83a-537568efd73b\scratchpad\pig-hybride\` (`fact-check-4a.mts`, `sortie-*.txt`, pages relues dans `web-q8\`).
  - RELAIS → `tsa-redacteur` : passe finale (étape 5). Solder C1 à C13 du §5 en FR, en EN et dans la `FAQPage` ; appliquer Q-8 (§4) à `cordage-mono-vs-multifilament` §08 et `polyester-vs-multifilament-strings` ; relancer `--check`, `redaction:valeurs` et `audit:jsonld`.
- 2026-11-23 · orchestrateur — 4a et 4b relus. 4a : fact-check non soldé, 13 corrections (C1 à C13) ; chiffres du moteur justes ; Federer établi par deux sources. 4b : en-tête, sitemap et index faits, `audit:jsonld` vert, propositions P1 à P6. Arbitrages A-3 (phrases Q-8 entièrement sourcées) et A-4 (Federer dans le nouvel article, au choix du rédacteur, daté). RELAIS → `tsa-redacteur` : passe finale (étape 5) et contrôles (étape 6) ; contre-vérification ciblée de `tsa-pigiste` avant la PR.
- 2026-11-23 · `tsa-redacteur` — étapes 5 (passe finale) et 6 (contrôles), sur `1dc96b4`. Relus avant d'écrire : §2 (F7, F15, F17, F24, F25, F29, F33 corrigés ; F35 à F39), §4 (réponse sous Q-8, A-3, A-4), §5 (C1 à C13, test de glissance), §6 (P1 à P6).
  - **C1 à C13** : toutes appliquées, aucun refus (détail au §5, « Corrections : réponse de `tsa-redacteur` »). C6 est attribuée à Eriksson dans la phrase. C10 suit l'option (a), datée, avec la réserve pro stock et sans conseil. Une correction de plus, de même nature que G23 : la FAQ 1.
  - **Q-8 et A-3**, une phrase et une ligne de sources par article :
    - `cordage-mono-vs-multifilament` §08 : « À l'inverse, Roger Federer jouait boyau aux montants, mono aux travers, selon Tennis.com en 2009 (qui nomme le Luxilon ALU Power Rough) et The New Yorker en 2014. »
    - `polyester-vs-multifilament-strings` : « The reverse configuration, gut mains and poly crosses, is what Roger Federer played, according to Tennis.com in 2009 (which names Luxilon ALU Power Rough) and The New Yorker in 2014. »
    - Dans les deux, la ligne « Perfect Tennis, Tennisnerd, Tennis Companion » est remplacée par les deux sources datées.
    - Retirés de la même phrase, faute de source (A-3, « rien ne reste sans source ») : « il s'use vite chez les gros lifteurs » / « it wears out fast for heavy topspin players », comme demandé ; et aussi « le célèbre » / « famous » et « privilégie le toucher avec un soupçon de contrôle » / « prioritises touch with a hint of control », qui n'avaient pas de source non plus. Aucune autre phrase touchée.
    - **Dates (F11)** : un fait daté sur le matériel d'un joueur entre dans ces deux pages, et une affirmation en sort. `dateModified` passe à **2026-11-23**, ainsi que la date visible (« Mis à jour le 23 novembre 2026 » ; « updated November 23, 2026 »).
    - **À reporter dans `src/app/sitemap.ts` par `tsa-acquisition`** (non modifié par moi) : `cordage-mono-vs-multifilament.html` et `polyester-vs-multifilament-strings.html`, `modified: '2026-11-23'`. D'ici là, `audit:jsonld` échoue sur ces deux articles (4 lignes ci-dessous).
  - **P1 à P6** : acceptées (§6). P1 est posée dans `cordage-polyester-tennis-elbow` §6 et `polyester-strings-tennis-elbow` §6, sans changement de date.
  - **Fichiers** : les deux nouveaux articles ; `cordage-mono-vs-multifilament.html`, `polyester-vs-multifilament-strings.html`, `cordage-polyester-tennis-elbow.html`, `polyester-strings-tennis-elbow.html` ; `scripts/blog-covers/build-hybride-figures.mts` (contrôles C8 et C9 ajoutés). Ni `src/`, ni le sitemap, ni les index.
  - **Contrôles (étape 6)**, au 23/11 :

```
$ npx --yes tsx scripts/blog-covers/build-hybride-figures.mts --check
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « schema » / « tableau » / « graphique » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « schema » / « tableau » / « graphique » conforme à la base
blocs et chiffres du texte conformes à la base                         → exit 0

$ npm run redaction:valeurs -- docs/redaction/montage-hybride-cordage-tennis.md
33 valeur(s) contrôlée(s), 0 écart(s)                                  → exit 0

$ npm run type-check
> tsc --noEmit                                                         → exit 0

$ npm run build
 ✓ Generating static pages (329/329)                                   → exit 0

$ npm run audit:jsonld                                                 → exit 1, attendu
  ECHEC sitemap.ts:70 BLOG_ARTICLES : « cordage-mono-vs-multifilament.html » déclare modified 2026-10-26, son JSON-LD dit dateModified 2026-11-23
  ECHEC sitemap.ts:114 EN_BLOG_ARTICLES : « polyester-vs-multifilament-strings.html » déclare modified 2026-10-26, son JSON-LD dit dateModified 2026-11-23
  ECHEC sitemap construit : …/blog/cordage-mono-vs-multifilament.html : <lastmod> 2026-10-26, le JSON-LD de l'article dit 2026-11-23
  ECHEC sitemap construit : …/en/blog/polyester-vs-multifilament-strings.html : <lastmod> 2026-10-26, le JSON-LD de l'article dit 2026-11-23
NON CONFORME — 4 échec(s), 0 avertissement(s)   (aucun écart de FAQPage)

$ npm run audit:blog-funnel
instrument A3 intact : la lecture GA4 referrer -> configurateur reste valide   (1 AVERT, article next-gen EN, antérieur)

$ npm run audit:blog-images
images du blog conformes à la règle du 10/10/2026                      (11 AVERT, exceptions d'autres articles)

$ npm run audit:comptages
Conforme — 0 échec(s), 0 avertissement(s)

$ npm run audit:claims
Conforme — 0 échec(s), 10 avertissement(s)
$ node scripts/qa-claims.mjs --all   → aucun AVERT sur les deux nouveaux articles ni sur mono/multi ; 2 AVERT antérieurs sur cordage-polyester-tennis-elbow l. 223 et polyester-strings-tennis-elbow l. 184 (« ne soigne pas un tendon », une négation), hors des lignes touchées

$ npm run audit:contrast
  Résultat : toutes les paires respectent WCAG AA.

$ grep -rn "À SOURCER" public/blog public/en/blog | wc -l
0

$ npx next start -p 3100   (port libéré avant ; serveur arrêté par son PID 6120 après)
200 montage-hybride-cordage-tennis · hybrid-tennis-string-setup : 1280 et 390 px, clair et sombre — débordement 0 px, 0 image cassée, 2 SVG, 0 requête en échec
200 cordage-mono-vs-multifilament · polyester-vs-multifilament-strings · cordage-polyester-tennis-elbow · polyester-strings-tennis-elbow : 390 px, clair et sombre — débordement 0 px, 0 image cassée, 0 requête en échec
(les pages EN n'ont pas de thème sombre : gabarit EN)
```
  - RELAIS → orchestrateur : contre-vérification de C1 à C13 et de la FAQ 1 par `tsa-pigiste` ; dates du sitemap à reporter par `tsa-acquisition` (ci-dessus) ; `citation` Tennis.com et The New Yorker à ajouter au JSON-LD si `tsa-acquisition` le juge utile. Pas de PR ouverte.
- 2026-11-23 · orchestrateur — passe finale relue (`8d4f1c6` : C1 à C13 appliquées sans refus, FAQ 1 corrigée en plus, Federer daté et sourcé, P1 à P6 acceptées ; `audit:jsonld` rouge sur deux dates du sitemap seulement). Retrait complémentaire validé (A-3). RELAIS → `tsa-pigiste` (contre-vérification de C1 à C13, de la FAQ 1 et des phrases Q-8) ET `tsa-acquisition` (dates du sitemap, `citation` Federer facultatives), en parallèle ; ensuite la PR.
- 2026-11-23 · `tsa-acquisition` — reprise avant la PR, sur `0cf25d8` (§6).
  - Sitemap : deux dates passent au 2026-11-23.
  - `citation` Tennis.com 2009 et Longreads / The New Yorker 2014 ajoutées aux deux nouveaux articles, titres relevés sur les pages ; rien sur les articles existants, qui n'ont pas de `citation`.
  - `build` 329/329, `audit:jsonld` 0 échec et 0 AVERT, `audit:claims` 0 échec.
  - Corps non touché. RELAIS → orchestrateur : PR, après la contre-vérification de `tsa-pigiste`.
- 2026-11-23 · `tsa-pigiste` — contre-vérification ciblée avant la PR (§5, « Contre-vérification du 2026-11-23 »), au commit `764bf52`.
  - **Non soldé : 3 corrections mineures restantes**, R1 à R3. C1 à C13 sont soldées sur le fond ; FAQ visible et `FAQPage` identiques (4 sur 4, FR et EN).
    - R1 : FAQ 4, la parenthèse « Luxilon ALU Power Rough » est à attribuer à Tennis.com seul.
    - R2 : C6 en FR, « à peu près le plus grand écart », comme la source et l'EN.
    - R3 : C8 en EN, « not necessarily », comme le FR.
  - **FAQ 1 vérifiée par le moteur** : jamais relevé ; inchangé dans 244 des 1 677 couples mesurés.
  - **Q-8 et A-3** (`cordage-mono-vs-multifilament` l. 618 et 664 ; `polyester-vs-multifilament-strings` l. 387 et 464) et **P1** : conformes.
  - `--check` : exit 0. `redaction:valeurs` : 33 valeurs, 0 écart.
  - RELAIS → `tsa-redacteur` : R1 à R3, puis `--check`, `redaction:valeurs` et `audit:jsonld`. Le fact-check est soldé dès que R1 à R3 sont appliquées à l'identique, sans nouvelle passe du pigiste.
- 2026-11-23 · `tsa-redacteur` — R1 à R3 de la contre-vérification appliquées à l'identique (§5), puis étape 6, contrôles avant la PR, sur `7e4bf74` plus R1 à R3 :

```
$ npx --yes tsx scripts/blog-covers/build-hybride-figures.mts --check
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « schema » conforme à la base
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « tableau » conforme à la base
  OK    public/blog/montage-hybride-cordage-tennis.html : bloc « graphique » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « schema » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « tableau » conforme à la base
  OK    public/en/blog/hybrid-tennis-string-setup.html : bloc « graphique » conforme à la base
blocs et chiffres du texte conformes à la base                                   → exit 0

$ npm run redaction:valeurs -- docs/redaction/montage-hybride-cordage-tennis.md
33 valeur(s) contrôlée(s), 0 écart(s)                                            → exit 0

$ npm run type-check
> tsc --noEmit                                                                   → exit 0

$ npm run build
 ✓ Compiled successfully
 ✓ Generating static pages (329/329)                                             → exit 0

$ npm run audit:jsonld
  OK    FAQPage : 34 FAQ, 157 questions, chaque question et chaque réponse figurent en entier dans le texte visible
  OK    sitemap : 38 articles, chaque date `modified` est le dateModified de l'article, aucun new Date() sans argument
  OK    sitemap construit : 38 <lastmod>, tous sur des articles et à leur vraie date
Conforme — 0 échec(s), 0 avertissement(s)                                        → exit 0

$ npm run audit:blog-funnel
instrument A3 intact : la lecture GA4 referrer -> configurateur reste valide     → exit 0 (1 AVERT : article next-gen EN, antérieur)

$ npm run audit:blog-images
images du blog conformes à la règle du 10/10/2026                                → exit 0 (11 AVERT : exceptions d'autres articles)

$ npm run audit:comptages
Conforme — 0 échec(s), 0 avertissement(s)                                        → exit 0

$ npm run audit:claims
Conforme — 0 échec(s), 10 avertissement(s)                                       → exit 0 (aucun sur les deux nouveaux articles)

$ grep -rn "À SOURCER" public/blog public/en/blog | wc -l
0
```
  - Fact-check soldé (R1 à R3 appliquées). RELAIS → étape 7 : push de la branche et PR vers `main`, sans fusion.
- 2026-11-23 · `tsa-redacteur` — étape 7 : branche poussée (`git push -u origin agent/redaction/montage-hybride-cordage-tennis`, dernier commit de contenu `20c1081`) ; PR #173 ouverte vers `main` (https://github.com/PleneufMC/Tennis-String-Advisor/pull/173), titre « feat(blog): montage hybride, montants, travers et fermeté (FR + EN) ». Corps : les deux URL, l'apport, les fichiers par groupe, les arbitrages A-1 à A-4, Q-1, Q-2, Q-6 et Q-8, les contrôles, ce qui n'est pas vérifié (SERP Google et Bing, production à l'étape 8), « À fusionner sur GO explicite de Pierre ». En-tête du dossier : statut mis à jour. Aucune fusion. RELAIS → Pierre : relecture et GO sur la PR ; puis `tsa-acquisition` : étape 8.
