# CLAUDE.md — Tennis String Advisor

> **Version** : 2.3.12
> **Date** : 10 octobre 2026
> **Remplace** : Custom Instructions v1.0 (janvier 2025)
> **Destination** : racine du dépôt (`/CLAUDE.md`)
> **Branche de référence** : `main` (seule branche longue ; la production Netlify en déploie)
> **Repo** : https://github.com/PleneufMC/Tennis-String-Advisor.git

**Changelog (numéro de version à fixer à la fusion)** — **Chiffres des articles santé alignés sur la base après
la règle C, et graphiques de rigidité tirés de la base** (demande de l'orchestrateur du 10/10/2026 ; `tsa-redacteur` ;
**à fusionner APRÈS la PR #110**, dont `src/data/` est le socle ; dossier `docs/redaction/coherence-chiffres-regle-c.md`).
Quatre articles (« polyester et tennis elbow » et « cordage et tennis elbow », FR et EN), le guide du matériel et les
cartes des deux index reprennent les chiffres de la base : 104 → **102 polyesters**, 181 → **179 fiches**, médiane des
polyesters 215 → **217,3**, polyesters à 200 lb/in ou moins 23 → **20** (Black Code 4S, Solstice Power et ALU Power Vibe
sortent ; Element Rough passe à 198,3, rang 16), à 240 lb/in ou plus 16 → **19** (Black Code 4S et Razor Code à 242,9,
Black Code à 249,7 entrent), multifilaments « 140 à 180, médiane 158 » → **143 à 180, médiane 162**, NRG2 148 → **164**
(indice 24) et NXT 152 → **173,7** (indice 25) dans le tableau des 17 cordages, leviers réordonnés (O-Toro −7, NXT −6) ;
la médiane citée en section 4 des articles « polyester » (215), absente de la liste de la PR #110, est corrigée aussi.
**Méthode dite au lecteur** : une rigidité alignée sur une mesure TWU (†) est celle de la jauge la plus rigide mesurée,
ce qui peut surestimer une jauge plus fine ; le configurateur fait foi ; les valeurs non marquées † peuvent s'écarter de
la mesure dans les deux sens ; seuls 6 des 45 multifilaments sont alignés. **Santé (F7)** : « safer than any polyester »
(absolu devenu faux : le NXT est plus rigide que les polyesters les plus souples) et « plus ferme qu'un multifilament »
deviennent « en général » ; « au-delà du seuil très ferme » à RA 70 corrigé (34 n'y est pas). **Graphiques** : un visuel
de corps par article (règle images), SVG en ligne produits par `scripts/blog-covers/build-rigidite-figures.mts` depuis
`src/data/` ; `--check` échoue si un graphique ou un chiffre clé du texte ne colle plus à la base (à relancer avec la
règle D, le lot 3 ou toute rigidité modifiée) ; les 4 exceptions correspondantes de `audit:blog-images` sont retirées.
**Instrument réparé** : sur `main`, `npm run redaction:valeurs` était inutilisable (import de `racquetProfile`, retiré de
`racquet-scoring.ts` par « aucune note déduite ») ; correctif minimal à valider par `tsa-pigiste` (échec fermé sur
`profil.*` ; cinq cas négatifs rejetés). ⚠️ Restent : le fact-check du pigiste ; les hybrides prémontés, dont la rigidité n'a
pas suivi celle de leurs composants (Razor Code + X-One à 180 pour un Razor Code à 242,9 ; Q-1 du dossier, `tsa-core`).

**Changelog (numéro de version à fixer à la fusion)** — **Règle C de jauge de référence, lot 2 des rigidités de
laboratoire (C2)** (décisions de Pierre du 10/10/2026 : règle C, « aucune correction qui baisse une alerte pour
l'instant », lot 2 approuvé ; `tsa-core`). **Règle C** : la rigidité d'une fiche = la mesure TWU de la jauge la plus
rigide mesurée parmi ses jauges (seule règle sans baisse d'alerte, sur-alerte assumée sur les jauges fines), en
attendant la règle D (rigidité par jauge). **16 fiches** : Black Code 210 → 249,7, Pro Red Code 225 → 232, Hawk
215 → 230,3, Gamma Moto 205 → 226,9, Black Code 4S 209,2 → 242,9, Razor Code 220 → 242,9 (ni les configurations
enregistrées sous « 4S », 222, ni sous « ATP Razor Code », 202, ne perdent une alerte) ; lot 2 : Völkl Power Fiber II
152 → 158,9, ALU Power Vibe 200 → 208, Element Rough 188 → 198,3, Eco Spin 213 → 213,2, Solstice Power 200 → 209,2,
NRG2 148 → 164, NXT 152 → 173,7, Xcel Power 140 → 162,3, Origin 155 → 171,5, XR3 158 → 162,9. **Effet** (grille du
contrôle 5, 138 546 combinaisons, contre `main`) : alerte bras avancée standard 5,24 → 5,77 %, sensible 19,76 →
21,23 % ; 2 774 alertes apparues, **0 disparue**. Aucune note /10, formule ni seuil modifié. Génération non
vérifiable (aucune fiche TW) pour Xcel Power, probablement ancien, Origin et XR3. **Non appliqué, GO de Pierre
requis** : 54 fiches mesurées dont la valeur C serait inférieure à l'actuelle (liste dans la PR), 25 autres hausses
hors lot. Contrôle 13 ter étendu (règle C, plancher des anciens identifiants, jauge nominale, matière,
15 tests négatifs), extrait versionné `data/reference/twu-lignes-citees.json` (la copie du 08/08 n'a aucun
multifilament), outil `c2-effet-alertes.mts --base=<commit>`. ⚠️ Chiffres d'articles à reprendre par
`tsa-redacteur` (liste dans la PR) : « polyester et tennis elbow » et « cordage et tennis elbow » (FR, EN), cartes
d'index du blog.

**Changelog v2.3.11 → v2.3.12** — **Deux garde-fous de `tsa-measure` corrigés** (contrôle
indépendant du lot du 10/10/2026 ; aucune donnée, aucun RCS, aucune alerte touchés). **(1) `audit:style-contrast`** : sur
Windows, `path.relative` rend des « \ » alors que les clés de `scripts/qa-style-contrast.baseline.json` sont en « / » :
aucune entrée de la baseline ne correspondait, les défauts antérieurs ressortaient tous comme nouveaux (34 « paires
illisibles », exit 1). Clé normalisée (`split(path.sep).join('/')`) : **31 des 34 constats sont reconnus par la baseline**.
Seuils, baseline et `--strict` (34 toujours listés) inchangés. **Le diagnostic « séparateurs » n'explique pas les 34** : 3
constats restent, **hors baseline sur tout système**, tous dans `src/app/pricing/page.tsx` (code introduit le 13/09 par
`6452105`, après la baseline du 08/08) et dans l'état « souscription fermée », aujourd'hui inactif (`CHECKOUT_DISPONIBLE =
true`) : le lien `mailto:` en `#047857` sur fond sombre (2,67:1, thème sombre : défaut réel dès que l'encart s'affiche) et le
bouton `#9ca3af` sur `#4b5563` (2,98:1, deux thèmes : couple qui ne peut pas coexister, le plan gratuit n'ayant pas de
`stripeLinks`, donc faux positif de l'analyse statique, qui n'évalue pas ces conditions). Non ajoutés à la baseline (« pas de
nouvelle entrée sans arbitrage ») : le contrôle reste rouge, pour trois raisons connues et nommées ; à traiter par
`tsa-revenue` (fichier) avec Pierre. **(2) `audit:database`** : borne basse de l'équilibre junior 260 → 220 mm. L'US Open Jr 21
a un équilibre officiel de 258 mm (« Unstrung Balance Cm 25.8 », wilson.com, L0, fait V75 de la veille du 10/10), soit 0,484 de
sa longueur ; 220 = 19 po × 0,459, le plus bas rapport équilibre/longueur du catalogue. Neutre sur `main` (56 problèmes
avant et après), 57 → 56 avec la PR des fiches désynchronisées ; une valeur de 200 mm reste signalée.

**Changelog v2.3.10 → v2.3.11** — **Comptages du catalogue : plus aucun
total écrit à la main sur les pages EN, et un garde-fou** (`tsa-acquisition`, demande du 10/10/2026
après la fusion des deux doublons, 181 → 179 cordages). **Constat** : quatre pages EN statiques
annonçaient encore « 181 strings » — `index.html` (méta, `og:description`, phrase d'accroche, tuile de
statistique, carte « String Catalog »), `strings.html` (méta, `og:description`, JSON-LD
`numberOfItems: 181`), `faq.html` (première réponse), `auth.html` (avantages du compte) — et rien ne
le signalait ; les 129 raquettes étaient justes mais écrites à la main de la même façon.
**Principe** : pas de comptage exact écrit à la main quand on peut l'éviter. Les textes statiques
(méta, accroches, tuiles) portent une **borne basse vraie** — « more than 120 racquets », « more than
170 strings », « 120+ », « 170+ » — lisible par les moteurs sans JavaScript et sans requête de plus
(`catalog.json` pèse 134 Ko : trop pour deux chiffres de l'accueil). Les pages catalogue lisaient
déjà le total dans `catalog.json` (« 179 strings from 22 different brands ») ; les pages FR le lisent
au build (`stringsDatabase.length`, relu dans la sortie de `npm run build` : « 129 raquettes »,
« 179 cordages »). `numberOfItems` est **retiré** de `strings.html` et `racquets.html` : une `ItemList`
de deux exemples ne peut pas déclarer un total qu'un JSON-LD statique ne tient pas à jour
(génération au build écartée : elle réécrirait des fichiers versionnés). Au passage, la description
JSON-LD de `racquets.html` (« detailed specs: weight, head size, balance, RA stiffness ») est alignée
sur la phrase de l'accueil corrigée le 10/10 : « where published » (RA absent de 29 fiches,
équilibre de 91, sur 129). **Garde-fou** `npm run audit:comptages` (`scripts/qa-comptages-catalogue.mjs`,
**périmètre `tsa-measure`, signalé dans la PR**, ajouté à `audit:all`) : les deux totaux sont lus dans
`src/data/` par le chargeur de `catalog.json` ; échec si une page de `public/` (hors blog), un texte de
`src/` (blocs `metadata`, JSON-LD, JSX ; analyse syntaxique, commentaires ignorés), un gabarit de
`scripts/en-products` ou la sortie du build (`.next`, si à jour) annonce un total « N
cordages|strings|raquettes|racquets » (N de 100 à 250 ; aussi « 181 fiches cordages », « 181 string
pages », une tuile en deux `<div>`, `numberOfItems`) différent du catalogue. Une borne (« more than »,
« 170+ », « plus de ») n'échoue que si elle est fausse ; « 102 polyesters » et « 102 polyester strings »
(sous-familles) ne déclenchent rien. Blog : AVERT seulement (5 aujourd'hui : 4 phrases datées du
9 octobre, et `guide-materiel-tennis.html:908`, « 181 cordages » sans date, au rédacteur).
Exceptions : liste explicite, datée, motivée, vide à ce jour ; une exception inutilisée échoue.
117 tests négatifs et 46 témoins positifs permanents ; **le contrôle échoue sur `origin/main`**
(760d835 : 10 échecs, lignes citées dans la PR). Aucune donnée, aucun RCS, aucune alerte bras,
aucune note touchés. **Rigidité « mesurée »** : balayage de 645 fichiers (pages EN, fiches générées,
`public/js`, sortie du build FR) — aucune formulation ne présente la rigidité d'un cordage comme
mesurée ; la mention d'étiquetage (« est la donnée du cordage utilisée par le RCS ») est inchangée.
⚠️ Restent, non traités ici : des textes français dans les pages EN (compteur de résultats
« cordage(s) trouvé(s) » / « raquette(s) trouvée(s) » de `strings.html` et `racquets.html`, noms
« Cordages » / « Raquettes » du fil d'Ariane JSON-LD) ; « 29 raquettes sur 129 » écrit en dur dans
`configurator/page.tsx` (verrou, et pas un total accolé à un nom : hors garde-fou) ; les cinq mentions
du blog ci-dessus (`tsa-redacteur`).

**Changelog v2.3.9 → v2.3.10** — **Fiches désynchronisées mises à jour : 11 raquettes, 4 cordages**
(`tsa-core`, décision de Pierre du 10/10/2026 : mise à jour approuvée, « Je laisse l'équipe faire les arbitrages » ; veille
de `tsa-pigiste`, 116 faits V01-V116 sur 73 pages, copiée telle quelle dans
`docs/redaction/veille-2026-10-10-fiches-desynchronisees.md`). Mise à jour **en place**, ids conservés (URL du sitemap,
configurations enregistrées). Arbitrages de l'orchestrateur : **Q-1** TW US et TWE sont du même groupe, donc non
indépendants : un RA ne change que s'il est établi par une **mesure L1** (TWU « Flex Rating Test ») ou par deux sources
indépendantes dont une hors groupe ; un RA que TW US seul établit reste un signal, listé et non appliqué ; **Q-2** Pure
Aero Team : aucun champ établi pour la Gen9, aucune valeur changée, fiche nommée « Team (2023) » (RA 67 = 2023 ; 66 en 2026
chez TW US seul ; le 70 ± 3 de Babolat est un RA non cordé, jamais saisi) ; **Q-3** Tempo 285 nommée « 285 V2 », specs
inchangées, RA 65 sans source conservé (ni comblé ni retiré), Tempo Tour 285 g 2026 (102 in²) non créée ; **Q-4** juniors
au poids et à l'équilibre **non cordés** officiels, comme les adultes ; **Q-5** rigidités des cordages hors de ce lot
(chantier D). **Appliqué** (source V-n au commentaire de chaque fiche et dans `src/data/racquet-alignment-provenance.ts`,
non affiché) : Clash 100 Pro « v2 » -> **V3** (16x20, 305 g, **RA 55 -> 57**, mesure TWU) ; T-Fight 315S (plan 16x19,
**RA 64 -> 65**, mesure TWU) ; EZONE 105 et VCORE 98 Tour (plan 16x19, RA conservés : 66 et 64 chez TW US seul) ; Burn
100LS nommée v6 ; US Open Jr 21/23/25 (tamis 95/95/106 in², plans, 171/185/205 g, équilibres 258/280/300 mm) ; Blade Feel
Comp Jr 25 (100 in², 243 g, nom) ; cordages : RPM Team sans 1.35 et en noir, TGV en noir, Multifeel + 1.25 (la Poly Tour
Strike garde sa 1.30, qui existe). **Non touchées, listées** : Extreme MP, Speed MP, Instinct MP, TF40 305, Pro Staff 97
v14 (le modèle standard est « épuisé » chez Wilson, pas retiré), Clash 100 v2 et 100L v3 (RA 54 chez TW US) ; rigidités
des cordages. **Effet mesuré** sur les 138 546 combinaisons du contrôle 5 : alerte bras avancée standard 5,24 -> 5,25 %
(+10), sensible 19,76 -> 19,80 % (+55), verdict de compatibilité 13,33 -> 13,36 % (+38) ; T-Fight 315S +5/+32/+17, Clash
100 Pro +5/+23/+21 ; **aucune baisse** (les juniors ne déplacent aucune alerte) ; formule RCS inchangée. `RA_RANGE.min`
55 -> 57 (la Clash 100 Pro était seule à 55 : contrôle 1). Photos : aucune des fiches modifiées n'avait de photo (toutes
en quarantaine de génération ou de specs), motifs périmés du mapping mis à jour ; l'association des images officielles est
renvoyée à un lot photos (images jamais téléchargées, aucune collecte réseau ici). Contrôle **14 bis** de `audit:ratings`
(18 raquettes et 4 cordages en provenance, 66 faits retrouvés dans le dossier, 17 tests négatifs) et outil rejouable
`scripts/scraper/fiches-effet-alertes.mts`.

**Changelog v2.3.8 → v2.3.9** — **Images officielles des fabricants**
(`tsa-core`, décision de Pierre du 10/10/2026, verbatim : « Il n'y a aucune restriction à utiliser
les images officielles des raquettes. Jamais un fabricant ne s'opposera à la promotion des produits
de sa marque. »). **Prise en connaissance du risque**, même cadre que le 29/09 sur Tennis Warehouse :
tolérance supposée, aucune licence écrite ; les conditions d'utilisation de Wilson, Babolat,
Tecnifibre et Yonex **interdisent la reproduction sans autorisation écrite** (texte exact dans la
PR). Couverture **65/129 raquettes et 60/181 cordages** (58 et 53 avant), **125 fiches EN sur 310**.
Quatorze photos nouvelles, source `fabricant:<marque>` au manifeste (page, image, date, crédit
« Photo : <Marque> ») : Wilson 4 (Ultra 25 et 26 V5, US Open Jr 19, Blade Feel Jr 26), Yonex 3
(Percept 97, 97D, 100D), Babolat 3 (Xcel, RPM Power, RPM Hurricane), Tecnifibre 4 (Red Code, XR3,
Razor Soft, Duramix HD). Packshot de face seulement, image PUBLIÉE par la page (aucune URL composée,
aucun hotlink), aplatie sur blanc et rognée ; les emballages Yonex à portraits de joueurs sont
écartés. Même rigueur d'association que pour TW (tamis, plan, poids non cordé, RA, millésime ou
génération lus dans l'intitulé, jauge, coloris), plus deux attestations humaines consignées au
mapping : `identification: nom+poids` (page sans tamis ni plan) et `colourVisual` (coloris non
publié, vu sur le packshot). Générations : la page officielle ne distingue que celle en vente ;
Pure Aero Team (fiche RA 67, Gen9 = 70) et Clash 100 Pro v2 (la v3 officielle est en 16x20, 305 g)
sont des générations antérieures, sans page ; TF40 305 et Tempo 285 ont leur génération en vente mais la fiche ne dit pas laquelle
(arbitrage de Pierre). **Collecte** : robots.txt lu, ≥ 3 s entre requêtes (10 s pour luxilon.com,
`Crawl-delay`), premier 403/406/429 ou page anti-robot = arrêt pour le site et hôte consigné
(`scripts/scraper/out/refused-hosts.json`). Incidents : **head.com a répondu 429 « Vercel Security
Checkpoint » dès robots.txt** (aucune page lue, 39 fiches Head sans photo) ; **luxilon.com a répondu
403 à la première requête du collecteur** alors que `curl` venait d'obtenir 200 : arrêt, non
retenté, non contourné. `purge fabricant:<marque>` retire une marque (testé : 4 photos Wilson
retirées, audit vert, manifeste identique après reconstruction). Le contrôle 12 de `audit:ratings`
vérifie l'hôte de chaque source, le crédit (table générée avec le manifeste, FR et EN), les hôtes
d'images absents de `src/` et des fiches EN ; tests négatifs rejetés : libellé de crédit manquant
(FR et EN) et hotlink dans `src/`.

**Changelog v2.3.7 → v2.3.8** — **Nature des notes /10 des cordages
étiquetée sur les surfaces EN, notes retirées des métadonnées** (principe décidé par Pierre le
10/10/2026 : « Cordages : garder les notes et les étiqueter partout », suite à la PR #103 ;
`tsa-acquisition`). **Aucune note modifiée**, aucune donnée, aucun RCS ni alerte bras touchés
(`audit:ratings` inchangé : 5,12 % / 19,56 %). Trois **libellés de référence arrêtés le
10/10/2026** (principe décidé par Pierre ; formulation exacte à valider par lui), dans
`public/js/rating-labels.js` (source unique, requise aussi par le générateur des fiches) :
« TSA editorial rating » (156 cordages), « TSA editorial rating, harmonised with tester reviews »
(les 18 de `tester-ratings.ts`), « Not published » (7 sans note), et la mention « Team
assessment, not laboratory-measured. Stiffness (lb/in) is the string data the
RCS uses. » ; référence FR pour l'étiquetage des surfaces FR :
« Appréciation de l'équipe, non mesurée en laboratoire. La rigidité (lb/in)
est la donnée du cordage utilisée par le RCS. » La mention n'affirme **pas** que la rigidité est
« mesurée » : ce n'est pas assuré pour les 181 fiches (règle 3 ; PR #105 : des rigidités n'ont
aucune source, TWU mesure chaque jauge séparément). Le libellé précède toujours la première
note : fiches `/en/strings/<id>.html` (181 ; les 7 sans note n'ont plus qu'une ligne « Not
published »), catalogue `strings.html` (cartes, filtres), comparateur (ligne « Rating basis »),
configurateur (carte du cordage recommandé). La liste des 18 est relue dans
`src/data/tester-ratings.ts` à chaque génération (`scripts/en-products/rating-basis.mjs`, échec
bruyant si un id manque au catalogue) et écrite dans `public/data/string-rating-basis.json` (non
versionné) pour les pages dynamiques : repère transitoire, le catalogue EN de `tsa-core` ne porte
pas ce drapeau (suivi prévu après la fusion de la PR FR de `tsa-core`). Repli si ce fichier est
injoignable : libellé éditorial simple et erreur en console, jamais une note sans libellé.
**Métadonnées** : plus aucune note
dans les `description`/`og:description` des 181 fiches EN (type, rigidité, tension et jauges à
la place), de `strings.html` ni du bloc `generateMetadata` de la fiche cordage FR
(`src/app/tennis-strings/[slug]/page.tsx`, ce bloc seul) ; aucune note dans le JSON-LD. Contrôle
`npm run audit:string-labels` (`scripts/qa-string-rating-labels.mjs`, périmètre `tsa-measure`,
ajouté à `audit:all`) : libellés comparés mot pour mot à sa constante de référence, fiches,
métadonnées EN et FR (y compris la sortie de `npm run build`), pages dynamiques, dérive de la
mention FR dans `src/` (inactive tant que l'étiquetage FR n'est pas fusionné), formule
« grandeur mesurée » écartée, 30 tests négatifs et 4 témoins positifs. ⚠️ Restent, non traités
ici : l'étiquetage des surfaces FR (`tsa-core`), la description FR de `/tennis-strings`
(`src/app/tennis-strings/layout.tsx` annonce encore « contrôle, confort, effet et durabilité »),
le tri des candidats du configurateur EN par note éditoriale avec un repli à 5 quand la note
manque, et deux articles EN qui citent ces notes dans leur corps
(`best-polyester-tennis-strings-2026`, `polyester-strings-tennis-elbow`, propositions au
rédacteur).

**Changelog v2.3.6 → v2.3.7** — **Notes /10 des cordages étiquetées sur
toutes les surfaces françaises** (principe décidé par Pierre le 10/10/2026, « Cordages : garder les
notes et les étiqueter partout », suite à la PR #103 ; `tsa-core`, C4). La **formulation** des
libellés et de la mention est une proposition de l'orchestrateur, **pas encore validée par Pierre**.
Chaque cordage porte la nature de ses notes : « Appréciation éditoriale TSA » (156 fiches),
« Appréciation éditoriale TSA, harmonisée avec des avis de testeurs » (les 18 de
`STRING_TESTER_RATINGS`), rien pour les 7 fiches sans note (« Non publié » sur chaque ligne).
Mention : « Appréciation de l'équipe, non mesurée en laboratoire. La rigidité (lb/in), indiquée à
part, est la donnée du cordage utilisée par le RCS. » Elle n'affirme pas que la rigidité est
« mesurée » : des rigidités du catalogue n'ont aucune source et TWU mesure chaque jauge séparément
(chantier C2, PR #105). Libellés et mention sont centralisés dans `src/lib/string-rating-nature.ts`
(composants `StringRatingLabel` et `StringRatingsNotice`) ; la liste des 18 vient de
`STRING_TESTER_RATINGS`, comme dans le générateur des fiches EN ; les chaînes de testeurs ne sont
jamais citées. Surfaces traitées : fiche `/tennis-strings/[slug]`, carte du catalogue (pleine et
compacte) et page du catalogue (tri, filtre « Notes minimum »), `/compare` en mode cordages
(étiquette par cordage, bloc « Nature des notes » avant les barres, avertissement si deux natures
sont mêlées), configurateur (résumé du cordage, analyse avancée), `/statistics` (classement des
cordages) et PDF Premium (notes, analyse avancée, méthodologie) ; la description du catalogue
(`tennis-strings/layout.tsx`) ne promet plus de notes. **Aucune note ni aucun calcul modifié** :
RCS, alertes bras (5,12 % / 19,56 %), second filet « confort » et `advanced-rcs.ts` inchangés. Tri
par défaut « Note globale » **mesuré, non modifié** : sur 174 cordages classés (41 valeurs
distinctes), les 18 harmonisés tiennent 5 des 10 premières places et 8 des 20 premières ; avec leur
ancienne note, 2 places du top 10 changeraient et un cordage bougerait jusqu'à 95 rangs — décision de
Pierre en attente. Contrôle 18 de `audit:ratings` (liste blanche de 8 surfaces, 543 rendus serveur,
4 PDF, 17 tests négatifs). ⚠️ Restent, non traités ici : fiches et pages EN, métadonnées de la fiche
(PR #106, `tsa-acquisition`), tableau « Les mieux notés » de l'article `meilleur-cordage-polyester-2026`
et notes citées dans `cordage-polyester-tennis-elbow` (`tsa-redacteur`), tri par défaut neutre proposé
par `tsa-revenue` (sous réserve d'avis juridique), et l'étiquette « Appréciation éditoriale TSA » reste
discutable pour les 12 notes de Tecnifibre Triax et Wilson NXT, recopiées de Tennis Warehouse et
conservées par décision de Pierre (PR #105) : à arbitrer.

**Changelog v2.3.5 → v2.3.6** — **Deux doublons fusionnés : 181 → 179 cordages**
(décision de Pierre du 10/10/2026 : « deux doublons probables : vérifier, puis fusionner » ; `tsa-core`).
**4S = Black Code 4S** : la fiche Tennis Warehouse « Tecnifibre 4S » dit « The name of this string has
changed from Black Code 4S to 4S. Same string, different name. » ; TW n'a qu'une revue (« Black Code 4S »),
TWU ne liste que « Black Code 4S », la fiche officielle Tecnifibre « 4S » donne les mêmes jauges (1.20, 1.25,
1.30), la même section carrée et le même procédé Thermocore. **ATP Razor Code = Razor Code**, preuve
indirecte (aucune source n'annonce de renommage) : la fiche TW « Razor Code » s'ouvre sur « Tecnifibre ATP
Razor Code 17 is… », TW n'a qu'une revue (« ATP Razor Code »), TWU ne liste que « Razor Code », la fiche
officielle « Razor Code » donne les mêmes jauges, des détaillants vendent les deux noms. Ids conservés : les
plus anciens (`tecnifibre-black-code-4s`, 29/08/2025 ; `tecnifibre-razor-code`, 03/06/2026 ; les deux autres
datent de la fusion b4e74ad du 07/08/2026). `LEGACY_STRING_ALIASES` : 8 → 10 alias ; redirections permanentes (308) FR et
EN (`/en/strings/<id>.html`, fiches générées depuis le 09/10) dans `next.config.js` ; photo de la 4S déplacée
vers la fiche conservée ; descriptions des fiches conservées citant l'autre nom ; provenance des notes à jour.
**Effet** (cette PR seule) : alerte bras avancée standard 5,12 → 5,16 %, sensible 19,56 → 19,54 % (deux
fiches de moins). **Règle 2** : les configurations enregistrées sous « 4S » (222, sans source) prennent la
rigidité de la fiche conservée, soit une baisse de 1,4 à 2,4 points d'indice ; celles de « ATP Razor Code »
(202) passent à 220, une hausse. Contrôle 10 (18 identifiants refusés) et nouveau contrôle 10 bis
(8 tests négatifs). **Notes TW conservées** : les 12 notes /10 de Tecnifibre Triax et Wilson NXT, recopiées de
Tennis Warehouse, sont conservées (décision de Pierre du 10/10/2026), en connaissance du risque (les
conditions de TW interdisent la reproduction sans permission écrite), et seront ajoutées à la demande
d'autorisation écrite ; non modifiées.

**Changelog v2.3.4 → v2.3.5** — **Rigidités de laboratoire, premier lot : les
8 polyesters (C2)** (décision de Pierre du 10/10/2026 : « on aligne leur rigidité sur la mesure faite sur
le bon modèle et la bonne jauge » ; `tsa-core`). TWU mesure chaque jauge séparément : l'écart entre jauges
d'un même polyester atteint 47 lb/in (Black Code : 202,9 en 1.18, 249,7 en 1.28), soit 5 points d'indice
RCS, alors qu'une fiche porte UNE rigidité. La jauge de référence est une **décision de produit, non
tranchée** (posée comme telle dans `racquet-scoring.ts`). N'est appliqué que ce qui n'en demande aucune :
**Savage** 220 → 234,3 (jauge unique) et **Black Code 4S** 200 → 209,2 (la plus basse des trois jauges
mesurées, toutes plus rigides que 200). **Retenus** (valeur dépendante de la jauge, certaines baisseraient
une alerte : règle 2, GO de Pierre) : Black Code, Pro Red Code, Hawk, Gamma Moto. **Quarantaine** (aucune
ligne TWU à ce nom) : 4S, ATP Razor Code. **Effet** sur les 140 094 combinaisons du contrôle 5 : alerte
bras avancée standard 5,12 → 5,20 %, sensible 19,56 → 19,78 % (+112 / +303). Aucune note /10, formule ni
seuil modifié. Provenance : `src/data/string-stiffness-provenance.ts` (non affiché), contrôle 13 ter de
`audit:ratings`, outil `scripts/scraper/c2-effet-alertes.mts` ; relevé TWU du 10/10 identique à celui du
29/09. **Notes TW conservées** : les 12 notes /10 de Tecnifibre Triax et Wilson NXT, recopiées de Tennis
Warehouse, sont conservées (décision de Pierre du 10/10/2026), en connaissance du risque (les conditions de
TW interdisent la reproduction sans permission écrite), et seront ajoutées à la demande d'autorisation
écrite ; non modifiées. ⚠️ L'article « polyester et tennis elbow » (FR, EN) cite le tableau des polyesters
à 200 lb/in ou moins : Black Code 4S en sort (23 → 22), à corriger par `tsa-redacteur` à la fusion.

**Changelog v2.3.3 → v2.3.4** — **Trois composants aux faux avis supprimés** (décision de Pierre du
10/10/2026, repérés par `tsa-acquisition` pendant la PR #102). `src/components/sections/testimonials.tsx`
(témoignages nominatifs inventés, « 4.9/5 », « 50,000+ Utilisateurs »), `featured-products.tsx` (4,8 sur
234 avis) et `hero.tsx` (« Happy Players 50K+ ») n'étaient importés nulle part — aucun effet sur le site —
mais portaient des chiffres et des avis sans source (règle 3). Vérifié avant suppression : aucun import de
`components/sections` dans `src/`. Les trois autres fichiers du dossier (`configurator.tsx`,
`how-it-works.tsx`, `newsletter.tsx`), également inutilisés, sont conservés.

**Changelog v2.3.2 → v2.3.3** — **Provenance des notes /10 des cordages**
(demande de Pierre du 10/10/2026 : « souvent les notes d'origines viennent de tennis warehouse »,
`tsa-core`, C4). 109 pages Tennis Warehouse lues (robots.txt respecté, robot nommé, ≥ 3 s, pages
trouvées par liens, 1 page 404, aucun refus). **Hypothèse non vérifiée** : sur 1 182 notes
publiées (174 cordages), 425 sont comparables à un score TW établi et **37 seulement sont
identiques** ; reprise intégrale sur **2 fiches** (Triax, NXT, lot du 04/08/2026), ailleurs au
niveau du hasard (25 égalités pour 16,6 attendues) ; 163 proches (≤ 0,5), 225 écarts. Les
anciennes notes des 18 cordages harmonisés ne viennent pas de TW et TW ne corrobore la synthèse
des testeurs sur aucun axe (n = 15) : indépendance non établie. Le confort publié suit la
rigidité du catalogue (ρ −0,92) ; le retirer ôterait 0,45 pt d'alertes bras (standard 5,12 →
4,67 %) et 0,84 pt (sensible 19,56 → 18,72 %), le remplacer par le confort TW en ajouterait.
**Aucune note modifiée** : provenance par champ dans `src/data/string-ratings-provenance.ts`
(non affichée), contrôle 13 bis de `audit:ratings` (tests négatifs) ; écarts et choix du confort
remontés à Pierre (C5).

**Changelog v2.3.1 → v2.3.2** — **Corrections d'affirmations fausses** (`tsa-acquisition`, PR #102,
relevées pendant la consultation du 10/10/2026 sur les notes de profil). (1) `public/en/index.html`
déclarait en JSON-LD un `aggregateRating` 4,8 sur 70 avis **sans aucun avis derrière**
(règle 3) : retiré, ainsi qu'un `Organization.logo` en 404 ; plus aucun `aggregateRating` /
`Review` / `ratingValue` / `reviewCount` sur les 678 pages HTML. (2) Le configurateur EN
codait en dur 12 fiches de secours aux valeurs périmées (Pure Drive RA 72 au lieu de 69,
RPM Blast 10/8/5 au lieu de 9,4/9,0/6,6, EZONE 100 RA 62 au lieu de 68…) : elles sont
désormais lues dans `public/data/catalog.json`, sans repli codé en dur ; le RCS du profil
« avancé polyvalent » passe de 36 à 35 (même palier, même alerte). Barre d'étapes du
configurateur EN : débordement de 27 px à 390 px corrigé. (3) Métadonnées de `/compare` :
plus aucune promesse de notes de confort ou de contrôle. (4) Comptages périmés (« 190
cordages », « 107+ / 173+ », « specs complètes ») remplacés par le nombre lu au build ou
une formulation qui ne vieillit pas. (5) Article « guerre du spin » : Pure Aero 98 en 16x20
comme sa fiche. Les trois articles modifiés (guerre du spin, challengers FR et EN) étaient
en exception de `audit:blog-images` : exceptions **renouvelées avec motif daté**
(correction d'exactitude urgente) ; leur visuel de corps reste à créer. ⚠️ Restent, non
traités : trois composants inutilisés aux faux avis (`src/components/sections/testimonials.tsx`,
`featured-products.tsx`, `hero.tsx`), l'étiquetage des notes cordages EN, le RA par défaut du
calculateur EN (63 contre 64 en FR), « Premium from €4.99 » affiché alors que le checkout EN
est fermé, la `SearchAction` de `layout.tsx` vers une route `/search` inexistante.

**Changelog v2.3.0 → v2.3.1** — **Plus aucune note de raquette déduite des
caractéristiques** (décision de Pierre du 10/10/2026, après consultation de `tsa-revenue`,
`tsa-acquisition` et `tsa-measure` ; `tsa-core`, suite au retrait de l'article Gravity MP
vs Tour, #99). Constat : `/compare` mettait côte à côte le profil **combiné** (specs +
testeurs) des 18 raquettes évaluées et le profil **dérivé** des autres, sans étiquette —
Gravity MP (dérivée) 3,3/6,2/7,4/5,3/4,7 contre Gravity Tour (combinée)
3,0/5,2/7,0/4,2/5,1 ; configurateur et PDF Premium affichaient l'un ou l'autre selon la
raquette. Mesure : même corrigé, le profil dérivé ne départage pas deux raquettes proches
(accord avec les testeurs ρ ≤ 0,31, négatif en maniabilité et stabilité : équilibre et
swingweight absents de la plupart des fiches). **Règle unique, FR, EN et PDF** : raquette
évaluée = « Avis de testeurs (synthèse) » **seul**, moyenne des 20 critères et cinq
critères **sur 20, tels quels** (ni recalage ni moyenne 50/50 avec le profil déduit :
invérifiable, la référence était dedans) ; raquette non évaluée = **caractéristiques
seules**. Comparateur : tamis, poids, RA, prix, plan (équilibre et swingweight quand ils
sont publiés), puis la moyenne /20 sur une ligne distincte, « non évaluée » sinon, sans
barre ni couleur de classement. Même moyenne partout (`/statistics`, comparateur,
configurateur, PDF). `deriveRacquetProfile` n'a plus d'appelant applicatif : formule
corrigée conservée (contrôle sans RA, masse en échelle linéaire), conservation ou retrait
à arbitrer. Contrôles : 16 (liste blanche des imports de `racquet-scoring`, libellés
interdits dans `src/`, `public/` et les fiches EN, comparateur et PDF vérifiés en
exécution, 7 tests négatifs), 17 (formule), 14 (avis affiché = synthèse telle quelle).
RCS, alertes bras (5,12 % / 19,56 %) et Top 10 inchangés. Au passage : en thème sombre,
les textes du bloc de comparaison (cartes restées blanches, texte éclairci) étaient
illisibles — corrigé.

**Changelog v2.2.12 → v2.3.0** — **Équipe éditoriale** (demande de Pierre du 10/10/2026 :
« 1 pigiste qui recherche l'info brute, un rédacteur qui fait les articles/blog et enfin un
spécialiste du SEO », avec « le réflexe de travailler ensemble », et des articles
« systématiquement assortis d'images quitte à les générer »). Deux agents créés,
`tsa-pigiste` et `tsa-redacteur` ; `tsa-acquisition` réorienté en spécialiste SEO et
acquisition (nom conservé : hook de démarrage, carte de propriété, rapports A3). Une chaîne
en huit étapes autour d'un dossier partagé par sujet (`docs/redaction/`), une charte
commune écrite une seule fois (`docs/redaction/CHARTE.md` : onze règles de fait, dont les
leçons du 10/10 — natures de données, pro stock, métadonnées internes, refus d'accès —,
test de glissance, images), trois circuits proportionnés (complet, court, veille). Règle
images outillée : `npm run audit:blog-images`, bloquant, dans `audit:all` ; 17 articles sur
33 sans visuel de corps sont listés en exception datée, qui tombe dès que l'article change.
Vérificateur des valeurs produit citées par un article : `npm run redaction:valeurs`. §2
(actualisation 31/08), §5, §5 bis (`seo-content-strategist` : ne plus invoquer), §5 ter
(nouveau), §6 et §9 mis à jour. Décisions de Pierre du même jour, intégrées à la charte
(v1.1) et aux prompts :
- images générées par **son outil MCP hébergé sur n8n** (voie ouverte dès qu'il est
  connecté, coût assumé par lui ; prompt en anglais, sans texte incrusté, contrôle
  visuel, légende « Illustration générée », prompt consigné dans `CREDITS.md`) ;
- **un article par semaine, evergreen d'abord** ;
- **aucune publication sans son consentement explicite**, son GO sur une PR ne valant
  que pour le site.

**Changelog v2.2.11 → v2.2.12** — **Filtres « Caractéristiques » inatteignables sur
`/racquets`** (signalement de Pierre du 10/10/2026, `tsa-core`). Dès `lg`, la colonne de
filtres est collante (`lg:sticky lg:top-24`) mais n'était pas bornée : 800 px de haut
sous 96 px d'en-tête, son bas (« Caractéristiques », poids/RA/prix) restait hors écran
jusqu'à 33 200 px de défilement sur 33 909 à 1280 × 800 — clic impossible. Défaut
antérieur à #97 : `304589b` (13/09) avait borné la colonne de `/tennis-strings`, pas
celle de `/racquets`. Corrigé par la même borne (`lg:max-h-[calc(100vh-7rem)]
lg:overflow-y-auto`). Garde-fou `npm run audit:sticky` (statique ; `--url` pour le
contrôle navigateur).

**Changelog v2.2.10 → v2.2.11** — **Photos produit manquantes** (`tsa-core`, demande de
Pierre du 09/10/2026). Couverture **58/129 raquettes, 53/181 cordages** (52/52 avant) :
seconde source **Tennis Warehouse Europe** (même groupe, plan du site publié, une fiche par
coloris et par jauge) ; TWE a **refusé la collecte automatisée (HTTP 406)** après ~160
pages, rien n'a été contourné. **Décision de Pierre du 10/10/2026, en connaissance du
risque** : les photos Tennis Warehouse (US et Europe) sont **conservées** (« on n'a aucune
raison de les jeter »), y compris les 5 photos TWE, sans autorisation écrite obtenue.
Puis **Tennis-Point** (demande de Pierre du 10/10, `tennis-point.fr`, plan du site Shopify,
débit 3 s) : **HTTP 429 après ~60 requêtes, collecte arrêtée, 0 photo retenue** (les 3
fiches lues restent ambiguës : Pure Aero Team, Pure Drive RG, Extreme MP). Tennis-Point
ne publie aucune clause de réutilisation des images (CGV, mentions légales :
« © Copyright Tennis-Point 2026 ») ; son programme d'affiliation Awin annonce des
« données produit détaillées » pour les partenaires, voie autorisée possible une fois
l'affiliation active. Source `tennis-point` prête dans le collecteur, `purge tennis-point`
opérationnelle. Les 7 raquettes alignées le 09/10
vérifiées : Boom Pro passait la photo 2024 (remplacée par la 2026), EZONE 100 et T-Fight 305S
sortent de quarantaine, Percept 100 illustrée (TWE), Percept 100D reste en quarantaine.
Contrôle poids non cordé ajouté (±5 g, TWE). Les **310 fiches EN statiques affichent la
même photo ou l'illustration** (`scripts/catalog/product-images.mjs`). Le visuel neutre
devient une **illustration** (trait SVG, nom du produit, « Illustration — photo non
disponible ») : aucune image générée d'un produit réel (règle 3). `purge <source>` retire
une seule source. Contrôle 12 étendu (deux sources, fiches EN sans photo en JSON-LD/og:image).

**Changelog v2.2.9 → v2.2.10** — **Fiches produit anglaises** (`tsa-acquisition`,
09/10/2026) : 129 raquettes et 181 cordages ont leur fiche EN, `/en/racquets/<id>.html`
et `/en/strings/<id>.html`, **HTML statique généré à chaque build** (`prebuild`/`predev`)
par `scripts/en-products/build-en-product-pages.mjs` depuis le catalogue TS (même
chargeur que `catalog.json`), non versionné. Pas de route Next : le layout racine
(verrou) impose `lang="fr"` et l'en-tête FR. hreflang réciproques fiche à fiche
(`fr-FR`/`en-US`/`x-default` FR), 310 URL au sitemap, `route-map.ts` envoie le
sélecteur de langue d'une fiche FR vers sa jumelle. Champ absent = « Not published » ;
descriptions du catalogue (en français) non reprises ; JSON-LD `Product` sans
`offers`, note, avis ni image ; aucun lien d'achat sur ces fiches.
**Changelog v2.2.8 → v2.2.9** — **Circuit de paiement EN fermé** (`tsa-revenue`,
09/10/2026). Le §2 point 1 affirmait que les deux circuits transmettent l'identifiant de
compte : c'est vrai, mais l'identifiant EN est un uuid **Supabase Auth**, et le webhook
ne cherche que dans la table Prisma `User` (cuid NextAuth) — recouvrement 0 sur 5
comptes. Un achat EN était acquitté « compte introuvable » et rien n'écrivait
`profiles.is_premium`, seul drapeau lu par les pages EN : **on encaissait sans rien
activer**. `CHECKOUT_DISPONIBLE = false` dans `en/premium.html`. Constats associés,
consignés au §2 point 1 : `profiles` est modifiable colonne par colonne par son
propriétaire (RLS `auth.uid() = id`, `UPDATE` accordé sur `is_premium`) — un compte EN
peut se déclarer premium ; aucun quota EN n'est appliqué côté serveur. Corrections
client dans #87 (configurateur et calculateur EN, quota aligné sur 3 setups sauvegardés,
paywall du calculateur qui masquait le RCS — règle 2 —, colonne `tension_mains`) et #88
(liens EN).

**Changelog v2.2.7 → v2.2.8** — **Source de vérité unique du catalogue (C3)**, demande
de Pierre du 09/10/2026 (« harmoniser les sites anglais et français ») : `src/data/*.ts`
fait foi. Les 7 pages EN qui lisaient les tables Supabase `racquets` / `strings`
lisent `public/data/catalog.json`, **généré à chaque build** (`prebuild`) par
`scripts/catalog/build-catalog-json.mjs`, non versionné, jamais édité. FR et EN
affichent donc les mêmes 129 raquettes / 181 cordages et le même RCS. Supabase garde
l'auth EN, `profiles`, `user_setups`, la newsletter ; ses tables catalogue ne sont plus
lues ni écrites par le site (rien n'y est supprimé). Contrôle 15 de `audit:ratings`.

**Changelog v2.2.6 → v2.2.7** — **Sept raquettes alignées sur la dernière génération**
(information de Pierre du 09/10/2026 : le document de notation porte sur les générations
en vente ; ce sont les fiches qui décrivaient une génération antérieure). Mise à jour
**en place**, id conservés (URL publiques au sitemap, configurations sauvegardées) :
Pure Aero 100 (2026) RA 69 → 66, Pure Drive (2025) 72 → 69, EZONE 100 (2025) 64 → 68,
Percept 100 et 100D 61 → 66, T-Fight 305S (2025, ex-« 305S ID ») 65 → 63, Boom Pro
datée 2026 (specs identiques). Source Tennis Warehouse Europe en commentaire de chaque
fiche. Elles reçoivent l'harmonisation testeurs (**18 raquettes**, décalages d'ancrage
recalculés sur les 18) ; seule Fire reste non rapprochable. **Effet RCS** : alerte bras
globale standard 5,12 % → 5,12 %, sensible 19,47 % → 19,56 %, compatibilité 13,23 % →
13,29 % (détail par fiche dans la PR). Contrôle 14 étendu.

**Changelog v2.2.5 → v2.2.6** — **Profil des raquettes harmonisé** avec des avis de
testeurs (mandat de Pierre du 09/10/2026, méthode tranchée par `tsa-core`) : même
méthode que les cordages — note affichée = moyenne (profil dérivé des specs, avis /20
recalé par décalage d'ancrage). **11 raquettes** sur 27 notées, celles dont la
génération testée est établie (tamis, poids, plan égaux et RA à ±1 de la fiche Tennis
Warehouse Europe) ; 7 en quarantaine de génération (dont Pure Aero 100, Pure Drive,
EZONE 100, Percept 100/100D : RA du catalogue à 3-5 points de la génération testée),
Fire non rapprochable, 8 absentes sans fiche créée. Libellé « Profil combiné : specs et
avis de testeurs » pour ces 11, « Profil dérivé des specs » inchangé ailleurs ;
`deriveRacquetProfile` reste purement dérivé. Provenance :
`src/data/racquet-tester-ratings.ts` ; contrôle 14 de `audit:ratings`. RCS et alertes
bras inchangés. Cordages : décisions a) et b) sans changement.

**Changelog v2.2.4 → v2.2.5** — **Notes /10 des cordages harmonisées** avec des avis
de testeurs (décision de Pierre du 09/10/2026) : 18 cordages couverts par sa notation
consolidée de trois chaînes (TennisNerd, TennCom, Rackets and Runners). Note publiée =
moyenne (ancienne note, note testeurs /20 recalée sur l'ancrage du site). Appréciation
éditoriale, non affichée comme source sur le site ; provenance dans
`src/data/tester-ratings.ts`, contrôle 13 dans `audit:ratings`. RCS inchangé. Supabase
(pages EN) n'est **pas** mis à jour. Raquettes : non appliqué (voir PR).

**Changelog v2.2.3 → v2.2.4** — Branche unique : les chantiers partent de `main`
et y reviennent par PR. `genspark_ai_developer` n'est plus la branche de
référence (décision de Pierre, 29/09/2026).

**Changelog v2.2.2 → v2.2.3** — **Photos produit** (décision de Pierre du 29/09/2026,
en connaissance du risque : les conditions de Tennis Warehouse interdisent la
reproduction sans permission écrite, demande en cours). 52 raquettes sur 129 et
52 cordages sur 181 illustrés par une photo TW **hébergée chez nous**
(`public/images/products/`, 3,7 Mo, pas de hotlink) ; 206 fiches en quarantaine
(visuel neutre). Un seul drapeau, `PRODUCT_IMAGES_ENABLED`
(`src/lib/product-images.ts`), coupe tout ; `python scripts/scraper/tw_product_images.py purge`
supprime images et manifeste. Aucune photo dans le JSON-LD ni `og:image`.
Contrôle 12 ajouté dans `audit:ratings`.

**Changelog v2.2.1 → v2.2.2** — **Option A** (décision de Pierre du 29/09/2026) :
aucune source ne publie les notes /10 des cordages, ni la tension recommandée,
ni pour certaines marques le prix EUR. Ces champs deviennent **optionnels** dans
`TennisString` ; absents = « Non publié », jamais comblés. Seule la rigidité
reste obligatoire — le RCS n'utilise qu'elle. Un sous-score avancé qui dépend
d'une note absente vaut `null` ; l'alerte bras fondée sur l'indice de fermeté
s'applique à toute fiche, le second filet « confort » seulement si la note
existe. Contrôle 11 ajouté dans `audit:ratings`. Puis lot 3 Toroline :
**174 → 181 cordages** (7 fiches à rigidité mesurée TWU, sans note ni tension
ni prix EUR) et `toroline-o-toro` passe de 210 (sans source) à **165,7 lb/in**
(TWU, 1.23). Le script TWU relève désormais tous les matériaux (il ne voyait
que le polyester). Supabase (pages EN) n'est **pas** mis à jour.

**Changelog v2.2.0 → v2.2.1** — Nettoyage du catalogue cordages (audit du
28/09/2026, lot 1 `tsa-core`) : **190 → 174 cordages**. Huit entrées fausses
retirées (trois cordages de badminton, quatre produits introuvables, une
référence article), huit doublons de renommage fusionnés via
`LEGACY_STRING_ALIASES`, marque et type de `neh-bio` et type de
`yonex-dynawire` corrigés. Garde-fou ajouté dans `audit:ratings`. Supabase
(pages EN) n'est **pas** nettoyé : il porte toujours ces entrées.

**Changelog v2.1.9 → v2.2.0** — Correction d'un fait du §2 point 8 : il y a bien
**un** événement clé dans GA4, `purchase`, et il n'a jamais rien compté parce que
**rien ne l'émettait** (« Aucune donnée de flux détectée »). Il est désormais envoyé
par le webhook. Consigne aussi les **six fonctions de tracking mortes** de
`public/js/analytics.js`, confirmées côté GA4 par leur absence des événements reçus.

**Changelog v2.1.8 → v2.1.9** — **Le paiement est ouvert.** Endpoint déclaré dans
Stripe, secrets posés dans Netlify (vérifié : l'endpoint de production répond 400
« Signature absente » au lieu de 500), les deux drapeaux `CHECKOUT_DISPONIBLE` sont
à `true`. Un trou repéré à l'ouverture est fermé au passage : un visiteur **non
connecté** partait vers Stripe sans `client_reference_id`, donc son paiement aurait
été inrattachable. Le CTA français passe désormais par la connexion avant le
paiement — le circuit anglais l'exigeait déjà.

**Changelog v2.1.7 → v2.1.8** — Le **webhook Stripe existe** (`src/app/api/stripe/webhook/`),
priorité 4 enfin traitée : aucune migration n'était nécessaire, le schéma portait
déjà les champs. Une revue de sécurité a opposé un veto (2 P0) ; les défauts sont
corrigés et couverts par 14 cas métier et 28 contrôles `audit:stripe-webhook`.
⚠️ **Les quatre gates du §5 bis sont inexécutables** — voir ce paragraphe.

**Changelog v2.1.6 → v2.1.7** — Trois Payment Links valides, vérifiés un par un
sur la page de paiement, remplacent les quatre anciens : 4,99 €/mois, 49,99 €/an
et **une offre à vie à 19,99 €** réservée aux 200 premiers. La grille passe donc
à trois offres, FR et EN. Le blocage n'est plus le prix ni les liens : **c'est le
webhook**, et les deux drapeaux `CHECKOUT_DISPONIBLE` restent à `false` pour cette
seule raison.

**Changelog v2.1.5 → v2.1.6** — Arbitrage de Pierre le 13/09/2026 : **le tarif
français fait foi** (4,99 € / 49,90 €). Les 21 montants des pages anglaises sont
alignés, les valeurs dérivées recalculées, et le **checkout EN est fermé** — ses
Payment Links vendent l'ancienne grille. UX-05 est donc tranché sur le prix ;
il reste à créer les liens au tarif en vigueur, et le webhook.

**Changelog v2.1.4 → v2.1.5** — Suite du 13/09/2026, même branche. Le
débordement de 92 px à 1024 px est **corrigé** (nav resserrée entre `lg` et
`xl`). Côté anglais, deux affirmations fausses sur le prix sont retirées :
l'offre « Lifetime 19,99 € » — annoncée 7 fois, vendue nulle part — et la
devise `$` sur 16 montants réellement facturés en euros. L'écart tarifaire
FR/EN lui-même reste ouvert (UX-05).

**Changelog v2.1.3 → v2.1.4** — Lot 1 de l'audit UX/UI du 13/09/2026
(UX-01, UX-02, UX-03, volet honnêteté d'UX-04), branche
`agent/ux-audit/ux01-ux02-reflow-mobile`. Le §2 n'était pas faux : ces quatre
défauts n'y figuraient simplement pas. Ajout du bloc « Utilisabilité mobile et
clavier » et complément du point 1 (le CTA Premium FR ne mène plus à un lien
Stripe mort). Constat non résolu consigné : à 1024 px, un groupe d'actions du
`header.tsx` fait déborder **toutes** les pages de 92 px — l'audit ne l'avait
pas vu, il ne teste que 390 et 1440 px.

**Changelog v2.1.2 → v2.1.3** — Actualisation du §2 au 31/08/2026 (chantier
A3 de `tsa-measure`), sur constat code, commandes et sorties dans la PR :
point 3 passé en résolu (`BuyButton` est dans le résultat du configurateur depuis
`15c6649` du 13/08 — non monétisé tant que le point 2 tient), point 5 réécrit
(échelle RCS unifiée FR/EN le 14/08 par `b227ba7`, miroir contrôlé par
`audit:ratings`), ajout du bloc « Actualisation vérifiée au
31 août 2026 » (comptages blog réels 14 FR + 8 EN hors index, Stripe et AWIN
revérifiés cassés, indice d'indexation daté, instrument A3 + garde-fou
`audit:blog-funnel`). Régularisation au passage : la v2.1.2 (14/08, bloc
« rupture de série » du §2) n'avait ni entrée de changelog ni pied de page à
jour.

**Changelog v2.1.0 → v2.1.1** — Corrections factuelles issues de l'audit
multi-agents du 13 août 2026 (4 rapports : revenue, acquisition, core, mesure),
conformément au §6 (« un agent qui découvre que le §2 est faux corrige le §2 »).
Réécriture du point 4 du §2 (il n'existe aucun mur d'authentification — le vrai
défaut est l'incitation inversée du quota), complément du point 1 (circuit de
paiement EN parallèle), nuance du point 2 (l'activation AWIN exige un
redéploiement), correction du point 7 (les scripts `audit:*` étaient
majoritairement cassés), retrait de Zustand de la pile (§1, zéro import), et
correction du §5 bis : les pondérations RCS « introuvables » existent bel et
bien dans `public/js/rcs-calculator*.js` — c'est le moteur des pages EN.

**Changelog v2.0.0 → v2.1.0** — Ajout du §5 bis « Articulation avec les agents
globaux ». La v2.0.0 a été rédigée hors session Claude Code, sans le contexte
des agents utilisateur préexistants (`~/.claude/agents/`) qui couvraient déjà
TSA : db-guardian, deploy-captain, security-auditor, qa-sentinel,
algorithm-validator, catalog-curator, feature-builder, seo-content-strategist.
Le §5 bis fixe qui fait quoi. Comptages 129 raquettes / 190 cordages vérifiés
dans `src/data/` le 9 août 2026.

**Changelog v1.0 → v2.0.0** — Refonte complète. Passage d'un persona unique
« Product Owner & Growth Manager » à une **équipe de 4 agents Claude Code** avec
périmètres de fichiers disjoints. Objectifs chiffrés recalibrés sur la mesure
réelle (les cibles v1.0 étaient hors d'atteinte d'un facteur ~150). Ajout de la
carte de propriété des fichiers, des garde-fous issus de la session du 8 août
2026, et des critères de fin mesurables par chantier.

---

## 1. Le produit en une page

**Tennis String Advisor** (tennisstringadvisor.org) aide un joueur de tennis à
choisir son cordage et sa tension en fonction de sa raquette, de son jeu et de
sa **sensibilité au bras**. Le cœur métier est le **RCS** (Recommandation
Confort Score) : un indice de fermeté du setup qui signale un risque de tennis
elbow.

| RCS | Niveau | Lecture |
|---|---|---|
| < 20 | Très confortable | Bras sensibles, débutants |
| 20-25 | Confortable | Joueurs récréatifs |
| 25-30 | Standard | Joueurs avancés |
| 30-35 | Ferme | Contrôle maximal |
| > 35 | Très ferme | Risque tennis elbow |

**Stack** : Next.js 14 (App Router), TypeScript strict, Tailwind,
Prisma + Supabase (PostgreSQL), NextAuth (Google OAuth + email), Stripe Payment
Links, déploiement Netlify (adaptateur OpenNext). (Zustand est déclaré dans
`package.json` mais n'a aucun import dans `src/` — retiré de la pile ici.)

**Architecture** : hybride assumé. L'application Next sert le FR à la racine
(`/configurator`, `/racquets`…). Le blog et la version anglaise sont des pages
**HTML statiques** dans `public/blog/*.html` et `public/en/*.html`. Le
`route-map.ts` fait le pont entre les deux univers.

**Base** : 129 raquettes, 179 cordages (`src/data/*.ts` ; 190 avant le
nettoyage du 28/09/2026, 174 après, 181 depuis le lot 3 Toroline du 29/09/2026,
179 depuis la fusion de deux doublons le 10/10/2026).

**Écosystème** : tennismatchfinder.net (même propriétaire) référence TSA.
⚠️ **Corrigé le 31/08/2026** — ce site était présenté ici comme « un canal de
trafic croisé sous-exploité ». Pierre a établi que **TMF ne trouve pas son
public** : l'audience supposée n'existe pas. Un lien depuis un site sans
visiteurs n'apporte pas de visiteurs. La prémisse n'avait jamais été mesurée.

---

## 2. État vérifié au 13 août 2026, actualisé le 31 août 2026

Ce qui suit a été **lu dans le code**, pas dans la documentation. Toute
divergence entre ce fichier et le code : le code gagne, et ce fichier doit être
corrigé dans la même PR.

### Corrigé et vérifié

- Sitemap natif Next (`src/app/sitemap.ts`) — plus d'URL fantômes.
- Open Graph : `resolveSiteUrl()` rejette localhost, fallback canonique.
- Instrumentation GA4 : 3 événements branchés et appelés
  (`configurator_complete`, `affiliate_click`, `premium_cta_click`).
- Paywall freemium appliqué côté serveur : `src/lib/premium.ts` est la source de
  vérité unique, `POST /api/configurations` renvoie 403 au-delà de 3 configs.
- Échelle d'alerte bras remise en monotonie (43,9 % → 13,9 % d'alertes).
- Export PDF, thème sombre, i18n FR/EN livrés.
- Photos produit Tennis Warehouse (29/09/2026), Tennis Warehouse Europe et
  sites officiels des fabricants (10/10/2026) : 65/129 raquettes, 60/179
  cordages, hébergées chez nous, FR (125 fiches EN sur 310 comprises) ;
  drapeau `PRODUCT_IMAGES_ENABLED` et commande `purge` (globale ou par source,
  ex. `purge fabricant:wilson`) pour le retrait ; associations vérifiées par
  script (tamis, plan de cordage, RA, poids, jauge, coloris), quarantaine sinon,
  illustration non photographique à la place. Autorisation TW non obtenue, TWE
  et fabricants non demandés : photos conservées / posées par décisions de
  Pierre du 10/10/2026, en connaissance du risque. Tennis-Point : collecte
  refusée (429), aucune photo. Fabricants : head.com (429) et luxilon.com (403)
  ont refusé le robot, wilson.com, babolat.com, tecnifibre.com et yonex.com
  l'ont accepté (14 photos).
- Notes de raquette (décision de Pierre du 10/10/2026) : **aucune note déduite
  des caractéristiques** n'est affichée, nulle part (comparateur, configurateur,
  PDF Premium, FR et EN). Raquette évaluée : « Avis de testeurs (synthèse) »,
  moyenne et cinq critères /20 tels quels ; sinon, caractéristiques seules.
  Garde-fou : contrôle 16 de `audit:ratings`.

### Cassé ou incomplet

| # | Problème | Impact |
|---|---|---|
| 1 | **Aucun webhook Stripe.** ⚠️ Complété le 13/09/2026 : les **deux Payment Links FR** renvoient « The link is no longer active. » (navigation réelle, HTTP 200 + page d'erreur Stripe), tandis que les **deux liens EN de `public/en/premium.html` sont actifs** — à **2,99 €/mois et 24,99 €/an**, soit la moitié des tarifs annoncés en FR (4,99 / 49,90). Un visiteur EN peut donc payer aujourd'hui, sans qu'aucun droit ne s'active. Côté FR, le CTA est désamorcé depuis `pricing/page.tsx` (drapeau `CHECKOUT_DISPONIBLE`) et annonce l'indisponibilité. **Grille unique depuis le 13/09/2026, trois offres** — 4,99 €/mois
(`…8Vi0b`), 49,99 €/an (`…8Vi0f`), 19,99 € une fois (`…8Vi0d`, « prix réservé aux
200 premiers »). Les trois liens ont été **ouverts et lus** avant d'être collés ;
trois candidats ont été écartés à la lecture, dont un intitulé « Annuel » qui
facturait 49,99 € **par mois**. Les deux circuits, FR et EN, portent les mêmes
liens et la même grille.

✅ **Le webhook existe** — `src/app/api/stripe/webhook/route.ts`, seul consommateur
serveur des paiements. Principe : **échouer fermé**. `premiumUntil = null` valant
premium permanent, il n'est jamais une valeur par défaut : chaque activation exige
un mode connu, un montant au catalogue (`premium.ts`) et un paiement encaissé
(`payment_status === 'paid'` — « completed » ne veut pas dire « payé » pour SEPA
et consorts). **Seul `client_reference_id` rattache un paiement** : l'e-mail du
payeur n'est pas un repli, Stripe ne le vérifie pas et l'application ne renseigne
jamais `emailVerified`. Remboursement et litige retirent l'accès. Les deux circuits
transmettent l'identifiant de compte — ⚠️ **mais seul le circuit FR est activable**
(constat du 09/10/2026) : l'id EN est un uuid Supabase Auth absent de la table Prisma
`User`, le webhook acquitte « compte introuvable » et n'écrit jamais
`profiles.is_premium`. Checkout EN **fermé** (`CHECKOUT_DISPONIBLE = false`) jusqu'à ce
que le webhook sache activer un compte Supabase (option à arbitrer par Pierre ; toute
écriture dans `profiles` passe par `db-guardian`). ⚠️ **`profiles.is_premium` est
auto-attribuable** : la policy `Users can update own profile` (`auth.uid() = id`, sans
restriction de colonne) et le `GRANT UPDATE` sur toutes les colonnes laissent un compte
EN écrire `is_premium = true` depuis le navigateur. Correctif = migration (révoquer
l'UPDATE sur les colonnes premium/Stripe) → `db-guardian` + GO de Pierre. Garde-fou : `npm run audit:stripe-webhook`,
28 contrôles, dans `audit:all`.

✅ **Le paiement est ouvert** depuis le 13/09/2026 — les deux drapeaux
`CHECKOUT_DISPONIBLE` sont à `true` (`pricing/page.tsx`, `en/premium.html`).
L'endpoint est déclaré dans Stripe sur six événements et les deux secrets sont dans
Netlify ; la preuve est que `POST /api/stripe/webhook` en production répond **400
« Signature absente »** et non plus 500. **Aucun paiement sans compte** : un visiteur
non connecté est envoyé vers `/auth/signin?callbackUrl=/pricing` plutôt que vers
Stripe, sans quoi son paiement arriverait sans `client_reference_id` et resterait
inrattachable. **Dette assumée** : pas de table `StripeEvent` (migration, donc gate
`db-guardian`), donc l'idempotence couvre le rejeu mais pas tous les ordres
d'arrivée. Deux points non tranchés : la **limite de
quantité** sur le lien à vie — `LIFETIME_SEATS` cesse d'afficher l'offre au 200ᵉ,
mais ne protège rien, une URL connue restant ouvrable ; seule une limite posée
dans Stripe l'empêche — et le fait que l'offre à vie, à 19,99 €, **rend les deux
abonnements sans objet** tant qu'elle dure. Le Payment Link FR ne transporte pas `client_reference_id`, rien n'écrit `isPremium`. Et un **second circuit de paiement EN** existe en parallèle (`public/en/premium.html` : Supabase Auth direct, **2** Payment Links libellés en **€** — et non 3 en $ —, tarifs divergents ; l'offre « Lifetime 19,99 € » affichée sur `public/en/configurator.html` n'a **aucun Payment Link** : son lien mène à `premium.html`, qui vend un abonnement) — **4** Payment Links au total, chacun ouvert et vérifié le 13/09/2026, 2 systèmes d'identité, 0 consommateur serveur. | Un client qui paie reste plafonné à 3 configs. La page `payment-success` a été désamorcée (13/08) : elle annonce désormais une activation manuelle sous 24 h au lieu de mentir. |
| 2 | **Affiliation câblée mais inactive.** `NEXT_PUBLIC_AWIN_ID` et `NEXT_PUBLIC_AWIN_TENNISPOINT_MID` vides → liens directs non rémunérés. ⚠️ Ces variables `NEXT_PUBLIC_*` sont inlinées au build : les renseigner dans Netlify **exige un redéploiement** (les commentaires « sans redéploiement » dans `affiliate.ts` et `.env.example` sont faux). | 0 € sur 100 % des clics. |
| 3 | **Résolu depuis le 13/08** (`15c6649`), constaté dans le code le 31/08 : import `BuyButton` ligne 16 de `configurator/page.tsx`, trois instances (cordage principal, travers, raquette) sous « Acheter ce setup — liens partenaires », placées après le bloc RCS conformément à la règle 1. Vérifié **en exécution** le 31/08 par `tsa-revenue` (Playwright, stub gtag) : liens `rel="sponsored"` vers tennis-point.fr en HTTP 200, alertes bras `role="alert"` affichées AVANT les liens (règle 2), séquence `configurator_step` → `arm_warning_shown` → `configurator_result_view` → `configurator_complete` → `affiliate_click` complète, bascule Awin vérifiée en dev ET sur build de production (`npm run build` exit 0 dans les deux cas ; sans variables : lien tennis-point.fr direct, `link_type: direct` ; avec `NEXT_PUBLIC_AWIN_ID`/`_TENNISPOINT_MID` factices : lien `awin1.com/cread.php?awinmid=…&awinaffid=…&ued=…`, `link_type: awin` — zéro changement de code entre les deux builds). L'entrée du 13/08 était périmée le jour même de sa rédaction. | Le moment de plus forte intention est équipé. Ces clics restent non rémunérés tant que le point 2 (AWIN) tient — c'est le point 2, pas celui-ci. Verrou `configurator/page.tsx` rendu par `tsa-revenue` le 31/08 (surface d'émission `location` propagée sur les 6 appelants, merge `c93ef38`). Procédure d'activation et de vérification : `reports/r2-activation-awin.md`. |
| 4 | **Incitation inversée du quota** (reformulé 13/08 — il n'existe **aucun mur d'authentification** : pas de middleware, configurateur 100 % public). L'anonyme sauvegarde en illimité dans `localStorage` ; se connecter impose le quota de 3 (`premium.ts` appliqué seulement dans `POST /api/configurations`). Créer un compte retire une capacité. Les chiffres (160 vues signin vs 45 configurateur, 39 `form_start` → 1 `form_submit`) décrivent un problème de navigation/attractivité, pas un blocage technique. | L'entonnoir compte → premium est à l'envers. Arbitrage A5 en attente. |
| 5 | **Largement résorbé le 14/08** (`b227ba7`, vérifié dans le code le 31/08) : `calculateRCS` (`strings-database.ts`, gain 2 / offset −27) est l'unique source de vérité ; `rcsIndex` y **délègue** (plus une copie) ; `public/js/rcs-calculator*.js` en est un **miroir exact**, comparé valeur par valeur à chaque `audit:ratings` (le script charge les moteurs JS). Reste : le miroir est une duplication par convention (toute évolution se fait dans `strings-database.ts` PUIS dans les 2 JS), et `calculateCompatibility` (`racquets-database.ts`) demeure une échelle homonyme distincte, documentée dans `racquet-scoring.ts`. | Un même montage affiche le même RCS FR/EN. La dette restante (miroir manuel, homonyme) est contrôlée par script, plus silencieuse. |
| 6 | **Résolu le 09/10/2026 (C3)** — la divergence FR/EN était structurelle : FR lisait `src/data/*.ts`, 7 pages EN lisaient les tables Supabase `racquets` (107) / `strings` (173) — 12 raquettes communes sur 129, 61 cordages communs en conflit hors description, 30 rigidités différentes (O-Toro 210 vs 165,7). **Le TypeScript fait foi** : `npm run build:catalog` (branché en `prebuild` et `predev`, donc exécuté par Netlify à chaque `npm run build`) sérialise `racquetsDatabase` / `stringsDatabase` au schéma snake_case que les pages EN consommaient, dans `public/data/catalog.json` (non versionné, `null` pour tout champ absent, aucune provenance testeurs) ; les pages le lisent via `public/js/catalog.js`. Le contrôle 15 de `audit:ratings` échoue si un fichier de `public/` relit le catalogue dans Supabase (`.from('racquets'|'strings')`, `/rest/v1/…`, jointure `racquets(*)`), si le JSON diffère du TS, s'il est versionné ou n'est plus généré au build. Les 95 raquettes et 17 cordages présents seulement dans Supabase disparaissent de l'EN ; aucune URL EN ne portait d'id produit. | Une correction de donnée se fait **une fois**, dans `src/data/`. Les tables Supabase `racquets` / `strings` sont orphelines : leur sort (miroir, archivage, suppression) relève de `deploy-captain` + GO de Pierre. |
| 7 | **0 fichier de test** dans le dépôt (`vitest` et `playwright` installés, aucune spec). Ni husky actif, ni CI, ni suivi d'erreurs en production. Les garde-fous réels sont les scripts `qa-*` — `audit:all` a été recâblé le 13/08 (4 maillons pointaient vers des fichiers inexistants et la chaîne mourait avant les scripts fonctionnels). | La garantie repose sur l'exécution manuelle de `audit:all` avant PR. |
> ⚠️ **RUPTURE DE SÉRIE — 14/08/2026.** `configurator_complete` était émis à
> chaque recalcul, sa signature de déduplication incluant les tensions : cinq
> essais de tension sur une même raquette comptaient pour cinq « complétions ».
> Il est désormais scindé en `configurator_result_view` (l'exploration) et
> `configurator_complete` (l'aboutissement, signature sans les tensions).
> **Le compteur va baisser par construction — ce n'est pas une régression.**
> Toute comparaison avec les chiffres antérieurs au 14/08 est invalide, y
> compris ceux de la ligne « La mesure » ci-dessous. Deux événements ajoutés
> au passage : `configurator_step` côté FR (il n'existait que côté EN, donc le
> taux de complétion rapportait deux univers à un seul) et `arm_warning_shown`,
> sans lequel le respect de la règle 2 n'est vérifiable que par lecture du code.

| 8 | **Un seul événement clé dans GA4 — `purchase` — et rien ne l'émettait.** Corrigé le 13/09/2026 : l'admin affichait « Aucune donnée de flux détectée » depuis toujours, d'où les colonnes « Événements clés » et « Revenu total » à zéro sur les 159 lignes des exports, alors que la collecte fonctionne (onze événements actifs sur 28 jours). `purchase` est maintenant envoyé par le webhook via le Measurement Protocol (`src/lib/ga4.ts`), avec l'identifiant de session Stripe en `transaction_id`. ⚠️ Restent **six fonctions de tracking déclarées et jamais appelées** dans `public/js/analytics.js` — `trackBlogView`, `trackProductView`, `trackSignupStart`, `trackRCSCalculation`, `trackCatalogFilter`, `trackConfiguratorSelection` — confirmées mortes par leur absence des événements reçus par GA4. `blog_view` manque alors que le blog est le seul canal qui fonctionne. ⚠️ Ni `configurator_complete` ni `affiliate_click` ne sont marqués comme clés : aucun taux de conversion n'est donc lisible dans l'interface. ⚠️ Préalable découvert le 13/08 : deux implémentations analytics (React vs `public/js/analytics.js`) émettent les mêmes noms d'événements avec des paramètres incompatibles, et `configurator_complete` se répète à chaque changement de tension (compte les essais, pas les complétions). Unifier le schéma avant de marquer. | Aucune conversion mesurable ; les taux du §2 (53 %) et l'objectif §8 ne sont pas interprétables en l'état. |

### Utilisabilité mobile et clavier — corrigé le 13 septembre 2026

Quatre défauts d'accès, absents des points 1 à 8 ci-dessus, relevés par l'audit
UX/UI du 13/09 puis reproduits en mesure Playwright avant correction :

- **Catalogues à 390 px** : filtres ouverts par défaut, aside `w-72` juxtaposé
  à la grille dans un `flex` sans wrap ; la carte produit tombait à 99 px.
  Corrigé : repliés par défaut sous `lg`, et pleine largeur au-dessus des
  résultats une fois ouverts. Carte 288 à 398 px selon la largeur, débordement
  75/35/5 px → 0.
- **Configurateur sous 532 px** : `minmax(500px, 1fr)` forçait le document à
  516 px. Corrigé par `minmax(min(500px, 100%), 1fr)` ; deux colonnes de 672 px
  conservées à 1440 px. Débordement 196/156/126/86 px → 0.
- **Configurateur au clavier** : les six en-têtes de section étaient des `div`
  ; aucune étape n'était atteignable au Tab. Corrigés en `button` avec
  `aria-expanded`/`aria-controls`, options de liste en `button[data-option]`,
  ArrowDown/ArrowUp et Échap, `htmlFor` sur les quatre champs jauge/tension,
  étoiles nommées, annonce `aria-live` du RCS. Tab atteint 6/6 en-têtes (0/6
  avant) ; parcours complet sans souris jusqu'à RCS 32,0 — la valeur relevée à
  la souris par l'audit.
- **CTA Premium FR** : menait à un Payment Link mort (voir point 1).

- **Toutes les pages entre 1024 et 1120 px** : la barre de navigation
  demandait 1061 px pour 960 px de rangée utile — la nav complète s'affiche dès
  `lg` sans jamais se compresser, au moment même où le bouton de menu mobile
  disparaît. Corrigé en resserrant la nav entre `lg` et `xl` ; espacements
  pleins retrouvés dès `xl`, aucun lien masqué. Débordement 69/36 px → 0.
  Défaut absent de l'audit, qui ne teste que 390 et 1440 px.
- **`/racquets` dès `lg` (corrigé le 10/10/2026)** : colonne de filtres collante
  non bornée, « Caractéristiques » hors écran et non cliquable à 1280 × 800 et
  1024 × 700 jusqu'au bout de la liste. Bornée comme `/tennis-strings` ;
  `npm run audit:sticky` échoue sur toute classe `sticky` sans `max-h-` ni
  `overflow-y-auto` (hors barres `top-0`).

### La mesure (1er janv. → 9 août 2026, 221 jours)

```
227 utilisateurs actifs          0 événement clé          0 € de revenu
first_visit          207
configurator_step     68   (33 % des nouveaux)
configurator_complete 36   (53 % de complétion une fois démarré)
premium_cta_click     11   (31 % des configs terminées)
affiliate_click        4   (11 % des configs terminées)
achat                  0
form_start → submit  39 → 1   (2,6 %)
```

Après retrait du trafic datacenter (CN 25 à 3,8 % d'engagement ; US concentré
sur Ashburn/Boydton/Council Bluffs) et du trafic interne (Monaco 18),
**l'audience humaine externe est d'environ 20 personnes par mois.**

**Lecture** : le produit convertit très bien — il n'a personne à convertir.
Le goulot est la distribution, pas la mécanique de monétisation.

### Actualisation vérifiée au 31 août 2026

Constats lus dans le code et exécutés en commande le 31/08 (sorties collées
dans la PR `agent/tsa-measure/a3-blog-vers-configurateur`) :

- **Blog** : `public/blog/` contient **14 articles + un index** (15 fichiers
  `.html`) ; `public/en/blog/` existe depuis le 14/08 et contient
  **8 articles + un index** (9 fichiers). Deux articles publiés les 27-28/08
  en FR et EN (« raquette : point fort ou point faible », « cordage &
  chaleur »). Toute mention antérieure de « 12 articles FR / 2 articles EN »
  est périmée (le prompt de `tsa-acquisition`, réécrit le 10/10/2026, n'en
  porte plus ; au 10/10, le blog compte 19 articles FR et 14 EN).
- **Toujours cassé, revérifié le 31/08** : `src/app/api/stripe/` absent
  (aucun webhook — point 1 inchangé) ; `NEXT_PUBLIC_AWIN_ID` et
  `NEXT_PUBLIC_AWIN_TENNISPOINT_MID` vides (point 2 inchangé).
- **Indexation** : le diagnostic implicite « site invisible en recherche » est
  contredit par un **indice daté** — le 31/08, la requête Google
  « configurateur cordage tennis tension raquette calculateur » fait
  ressortir `/blog/guide-tension-cordage-tennis.html` en page 1, aux côtés de
  Décathlon, Mouratoglou et Extreme Tennis. Niveau de preuve : une requête
  unique, personnalisable et non reproductible — un indice, **pas une mesure
  d'indexation**. L'établir proprement exige Search Console (couverture
  d'index + rapport Requêtes). La ligne « Articles indexés ~0 » du §8 est
  donc probablement pessimiste, sans qu'on sache de combien.
- **Entonnoir blog → configurateur (A3)** : l'indicateur est défini et outillé
  — définition, procédure GA4 et relevé hebdomadaire dans
  `reports/a3-blog-vers-configurateur.md`, instrument gardé par
  `npm run audit:blog-funnel` (intégré à `audit:all`). La mesure s'appuie sur
  le `page_referrer` GA4 natif : zéro code dans les périmètres d'autrui.
  Lacune détectée au passage : l'article EN
  `next-gen-tennis-racquets-fonseca-mensik-cobolli-jodar.html` n'a **aucun**
  lien vers le configurateur (à traiter par `tsa-acquisition`).

---

## 3. Ordre de priorité (arbitré, 90 jours)

1. **Affiliation dans le configurateur** — monétiser les 53 % qui terminent.
2. **SEO / contenu** — le blog est le seul canal qui apporte du trafic.
3. **Distribution externe** — forums, clubs et cordeurs. (TennisMatchFinder
   retiré de cette liste le 31/08/2026 : il n'a pas d'audience, cf. §1. Le
   seul lien croisé existant va d'ailleurs dans le mauvais sens — TSA envoie
   ses visiteurs vers TMF depuis son footer, et ne reçoit rien en retour.)
4. **Webhook Stripe** — débloquer le paiement (ou le retirer proprement).

Un agent ne remonte pas la file d'attente de son propre chef. S'il pense que
l'ordre est faux, il le dit dans son rapport et attend l'arbitrage.

---

## 4. Les neuf règles non négociables

Elles s'appliquent à tous les agents, sans exception, y compris quand elles
coûtent un indicateur.

1. **Le RCS n'est jamais influencé par une commission.** Les liens partenaires
   apparaissent *après* la recommandation. Ils n'entrent ni dans le calcul, ni
   dans l'ordre de tri, ni dans la sélection des cordages proposés.
2. **La santé prime sur la conversion.** Une alerte bras ne se supprime, ne se
   masque et ne s'adoucit jamais pour améliorer un taux.
3. **Jamais une valeur comblée présentée comme une donnée constructeur.** Un
   champ absent reste `null`. Une valeur dérivée est étiquetée comme dérivée.
4. **Jamais deviner une URL** pour obtenir une « source ».
5. **Mesurer l'indicateur qui compte**, pas un indicateur voisin plus commode.
6. **Un succès non reproductible n'est pas un succès.** Le dire coûte moins cher
   que de le laisser croire.
7. **Suspecter l'instrument avant les données** quand un résultat est absurde.
8. **Aucune affirmation « c'est corrigé » sans commande exécutée et sortie
   collée** dans le rapport. Pas de sortie, pas de correction.
9. **Ne pas optimiser un taux avant d'avoir du volume.** À 20 visiteurs par
   mois, un A/B test n'a aucune puissance statistique. Tout chantier
   d'optimisation fine attend 200 utilisateurs mensuels.

---

## 5. L'équipe et la carte de propriété des fichiers

Six agents, périmètres **disjoints**. Deux agents ne modifient jamais le même
fichier dans la même semaine — **sauf** dans la chaîne éditoriale (§5 ter), où
pigiste, rédacteur et acquisition se relaient sur la même branche, chacun dans
sa partie du fichier.

| Agent | Mission | Priorités couvertes |
|---|---|---|
| `tsa-revenue` | Monétisation et parcours de conversion | 1 et 4 |
| `tsa-acquisition` | Spécialiste SEO et acquisition : brief et passe on-page des articles, SEO technique, version anglaise, distribution externe | 2 et 3 |
| `tsa-pigiste` | L'information brute, vérifiée : dossier de faits, iconographie, fact-check, veille | 2 (transverse au contenu) |
| `tsa-redacteur` | Les articles FR et EN et leurs images | 2 |
| `tsa-core` | Algorithme RCS et intégrité des données | transverse |
| `tsa-measure` | Mesure, instrumentation, contrôle des affirmations | transverse, bloquant |

### Propriété

| Chemin | Propriétaire |
|---|---|
| `src/lib/affiliate.ts`, `src/lib/premium.ts` | `tsa-revenue` |
| `src/components/product/buy-button.tsx` | `tsa-revenue` |
| `src/app/pricing/`, `src/app/payment-*/`, `src/app/api/checkout*`, `src/app/api/stripe/` | `tsa-revenue` |
| `src/app/auth/`, `src/app/api/auth/`, `src/lib/auth*` | `tsa-revenue` |
| Articles `public/blog/*.html`, `public/en/blog/*.html` : **corps** (texte, tableaux, figures, liens, date visible, `dateModified` quand un chiffre change) | `tsa-redacteur` |
| Articles : **`<head>`** (title, meta, canonical, hreflang, og, JSON-LD) ; index `public/blog/index.html` et `public/en/blog/index.html` | `tsa-acquisition` |
| `public/blog/images/` (dont `CREDITS.md`), `public/blog/blog-figures.css`, `scripts/blog-covers/` | `tsa-redacteur` |
| `public/en/` hors blog (dont `public/en/racquets/` et `public/en/strings/`, générés, non versionnés), `scripts/en-products/` | `tsa-acquisition` |
| `docs/redaction/` : dossiers partagés, chaque section à son agent (§5 ter) ; `CHARTE.md`, `README.md`, `_modele.md` modifiés par PR validée par Pierre | chaîne éditoriale |
| `scripts/redaction/` (vérificateur des valeurs citées) | `tsa-pigiste` |
| `src/app/sitemap.ts`, `src/app/robots.ts`, `public/robots.txt` | `tsa-acquisition` |
| blocs `export const metadata` et JSON-LD dans les `page.tsx` | `tsa-acquisition` |
| `src/data/`, `src/lib/advanced-rcs.ts`, `src/lib/racquet-scoring.ts` | `tsa-core` |
| `src/lib/product-images.ts`, `src/components/product/product-image.tsx`, `public/images/products/` | `tsa-core` |
| `scripts/scraper/`, `scripts/qa-ratings.mts` | `tsa-core` |
| `scripts/catalog/` (générateur), `public/js/catalog.js` (chargeur EN), `public/data/catalog.json` (généré, non versionné) | `tsa-core` |
| `src/components/analytics/` | `tsa-measure` |
| `scripts/qa-*` (hors `qa-ratings`), `reports/` | `tsa-measure` |

### Fichiers partagés (verrou explicite)

`src/app/configurator/page.tsx`, `src/app/layout.tsx`,
`src/components/layout/header.tsx`, `src/app/page.tsx`.

Un seul agent à la fois. L'agent qui prend le verrou l'annonce dans le titre de
sa PR : `[verrou: configurator/page.tsx]`. Il le rend en fermant la PR.

---

## 5 bis. Articulation avec les agents globaux

Le compte utilisateur héberge des agents transverses (`~/.claude/agents/`)
antérieurs à cette équipe et qui mentionnent TSA. **Dans ce dépôt, l'équipe
`tsa-*` fait foi** — les connaissances TSA des agents globaux datent d'un état
antérieur du code (ils citent 104 raquettes / 165 cordages ; le réel vérifié
est 129 / 179 (190 avant le nettoyage du 28/09/2026, 181 avant la fusion du 10/10/2026), formule TypeScript dans `advanced-rcs.ts` et
`strings-database.ts`). Correction 13/08 : les pondérations RCS
W_RA=0.28 / W_Cordage=0.42 / W_Tension=0.22 / W_Interaction=0.08 citées par
`algorithm-validator` ne sont PAS introuvables — elles vivent dans
`public/js/rcs-calculator*.js:10`, le moteur statique qui sert les 3 pages EN
(`configurator.html`, `setups.html`, `rcs-calculator.html`). C'est une des 4
implémentations RCS du dépôt (cf. §2 point 5). Répartition :

| Agent global | Statut sur TSA |
|---|---|
| `catalog-curator`, `algorithm-validator` | **Ne plus invoquer sur TSA.** Mandat absorbé par `tsa-core` ; leurs règles de fond (source URL vérifiable, champ sans source = `null`, jamais de coefficient inventé) sont reprises aux règles 3 et 4 du §4. |
| `feature-builder` | **Ne plus invoquer sur TSA.** Reste l'agent de TennisMatchFinder. Sur TSA, chaque chantier a son propriétaire au §5. |
| `seo-content-strategist` | **Ne plus invoquer sur TSA** (10/10/2026). Mandat absorbé par la chaîne éditoriale (§5 ter) : brief SEO et clusters par `tsa-acquisition`, faits par `tsa-pigiste`, rédaction par `tsa-redacteur`. |
| `db-guardian` | **Gate conservé.** Toute modification de schéma (Prisma/Supabase) ou de policy RLS passe par lui — concerne le chantier C3 de `tsa-core` (source de vérité TS vs Supabase) et l'option B du chantier R5 de `tsa-revenue` (webhook Stripe écrivant `isPremium`). |
| `deploy-captain` | **Gate conservé.** Toute action irréversible ou de production — variables d'environnement Netlify (chantier R2, étape 4), migration prod, rollback — exige son passage et un « GO » explicite de Pierre. |
| `security-auditor` | **Gate conservé.** Review obligatoire avant merge pour : webhook Stripe (vérification de signature), tout changement d'auth (chantier R4), toute route API nouvelle. Findings sourcés (CWE/OWASP), veto possible. |
| `qa-sentinel` | **En sommeil sur TSA.** Son gate suppose une suite de tests ; ce dépôt n'en a pas (§2, point 7). Le mécanisme de garantie en vigueur ici est les scripts `npm run audit:*` plus le rôle bloquant de `tsa-measure` (§7). Si une suite vitest/playwright est introduite un jour, `qa-sentinel` reprend son rôle de gate. |

🔴 **Constat du 13/09/2026 : aucun de ces agents globaux n'est exécutable.** Les
huit fichiers de `~/.claude/agents/` déclarent des outils qui n'existent pas dans
Claude Code — `view`, `bash_tool`, `str_replace`, `create_file`,
`project_knowledge_search`, `web_fetch` : ce sont les noms de la plateforme
claude.ai. Invoquer `security-auditor` échoue sur « would be spawned with zero
tools ». **Les quatre gates de contrôle ci-dessus ne se déclenchent donc jamais**,
et le tableau décrit une gouvernance qui n'a pas cours. Correction : renommer les
outils (`Read`, `Bash`, `Edit`, `Write`, `Grep`, `WebFetch`, `WebSearch`) dans les
frontmatters. En attendant, une review de sécurité se commande à un agent
générique avec le brief du rôle — c'est ce qui a été fait pour le webhook Stripe.

Deux principes en résument l'esprit : les agents globaux **métier** sont
remplacés par l'équipe projet ; les agents globaux **de contrôle** (schéma,
prod, sécurité) gardent leur monopole. En cas de conflit entre ce fichier et la
description d'un agent global au sujet de TSA, ce fichier gagne.

---

## 5 ter. La chaîne éditoriale

Demande de Pierre du 10/10/2026 : un pigiste, un rédacteur et un spécialiste du
SEO qui ont « le réflexe de travailler ensemble », et des articles
« systématiquement assortis d'images quitte à les générer ». Le détail vit dans
`docs/redaction/` :

- `CHARTE.md` : les règles communes, écrites une seule fois ;
- `README.md` : le déroulé ;
- `_modele.md` : le dossier type.

**En une ligne par étape** :

| Étape | Qui | Ce qu'il fait |
|---|---|---|
| 0 | orchestrateur | ouvre le dossier `docs/redaction/<slug-fr>.md` et la branche `agent/redaction/<slug-fr>` |
| 1 | `tsa-acquisition` | brief SEO |
| 2 | `tsa-pigiste` | dossier de faits et iconographie |
| 3 | `tsa-redacteur` | article FR, adaptation EN, visuels |
| 4 | `tsa-pigiste` et `tsa-acquisition`, en parallèle | fact-check et test de glissance ; passe on-page |
| 5 | `tsa-redacteur` | passe finale |
| 6 | `tsa-redacteur` | contrôles |
| 7 | `tsa-redacteur` | PR, puis GO de Pierre |
| 8 | `tsa-acquisition` | vérification en production, relevé S+4 avec `tsa-measure` |

**Circuits.** Complet pour un nouvel article ; court (rédacteur et fact-check
ciblé) pour une correction ; veille (pigiste seul) sur demande.

**Relais.** Chaque rapport finit par `RELAIS → <agent>` et
`QUESTIONS À <agent>`. Les agents ne s'appellent pas entre eux : l'orchestrateur
relance le destinataire. Un désaccord remonte à Pierre, il ne se tranche pas en
silence. Faits : pigiste (et `tsa-core` pour la base). Mots : rédacteur.
Découvrabilité : acquisition. Publication : Pierre.

**Rythme.** Un article par semaine, **evergreen d'abord** (décision de Pierre du
10/10/2026, charte §1) : l'actualité reste l'exception, et chaque brief justifie
la durée de vie de son sujet.

**Consentement.** Rien ne se publie sans le consentement explicite de Pierre :
fusion sur `main`, forum, réseau social, newsletter, soumission externe
(charte §6). Son GO sur une PR vaut pour la mise en ligne de cette PR sur le
site, et pour rien d'autre.

**Contrôles propres à la chaîne** :

- `npm run audit:blog-images` vérifie la règle images. Il est bloquant et fait
  partie de `audit:all`. Le script est à `tsa-measure`. Les lignes de
  `scripts/qa-blog-images.exceptions.json` sont tenues par le rédacteur : retrait
  quand un visuel est ajouté, renouvellement daté et motivé en cas d'urgence.
- `npm run redaction:valeurs -- <dossier>` confronte chaque valeur produit
  citée à la base et refuse les profils de natures mélangées.

**Dérogation.** Un nouvel article FR et EN, avec son dossier et ses images, est
une unité indivisible : la limite de 400 lignes par PR (§6) ne s'y applique
pas. Les modifications d'articles existants y restent soumises.

---

## 6. Conventions de travail

- **Branche** : `agent/<nom-agent>/<slug-chantier>`, partant de `main`
  (chaîne éditoriale : `agent/redaction/<slug-fr>`, une branche partagée par
  sujet, §5 ter).
- **PR** : toujours **vers `main`**. Décision de Pierre du 29/09/2026 : plus
  aucun passage par `genspark_ai_developer`, qui n'est plus une branche de
  travail. Un merge dans `main` met en ligne en ~2 min 30 (Netlify).
- **Commits** : conventional commits en français —
  `fix(affiliate): ajouter le lien d'achat au résultat du configurateur`.
- **PR** : une par chantier, diff ≤ 400 lignes. Au-delà, découper.
- **Avant toute PR**, exécuter et coller la sortie :
  ```bash
  npm run type-check          # doit sortir en 0
  npm run build               # doit compiler toutes les pages
  npm run audit:ratings       # si src/data ou une formule est touchée
  npm run audit:rls           # si Supabase ou une route API est touchée
  npm run audit:contrast      # si un composant visuel est touché
  npm run audit:blog-funnel   # si public/blog ou public/en/blog est touché
  npm run audit:blog-images   # idem (règle images, §5 ter)
  npm run audit:comptages     # si une page publique, un bloc metadata ou src/data change
  ```
- **Pas de suite de tests dans le dépôt.** Tout agent qui modifie une fonction de
  calcul ou une règle métier **ajoute un contrôle** dans le script `qa-*`
  correspondant. C'est le mécanisme de garantie existant : on ne l'enjambe pas.
- **Scrapers** : ils n'écrivent que dans `scripts/scraper/out/` (non versionné).
  Aucune valeur n'entre dans `src/data/` sans revue explicite.
- **Ce fichier fait foi.** Un agent qui découvre que le §2 est faux corrige le §2
  dans sa PR et incrémente la version de `CLAUDE.md` (PATCH).

---

## 7. Definition of Done universelle

Un chantier n'est terminé que si les cinq points sont vrais :

1. Le code compile et `type-check` sort en 0, sorties collées.
2. Le comportement est vérifié **en exécution**, pas par lecture du code.
3. L'indicateur de succès du chantier est **mesurable** et son point de départ
   est enregistré (sinon `tsa-measure` bloque).
4. Ce qui n'a pas pu être vérifié est écrit noir sur blanc dans le rapport.
5. `CLAUDE.md` est à jour si l'état du §2 a changé.

---

## 8. Objectifs chiffrés recalibrés

Les cibles de la v1.0 (5 000 visiteurs/mois à M+3, MRR 500 €) supposaient un
trafic 150 fois supérieur au réel. Elles sont remplacées par des seuils
atteignables en 30 et 90 jours.

| Indicateur | Réel (moy. mensuelle) | M+1 | M+3 |
|---|---|---|---|
| Utilisateurs humains externes / mois | ~20 | 60 | 200 |
| `configurator_complete` / mois | ~5 | 25 | 80 |
| `affiliate_click` / `configurator_complete` | 11 % | 35 % | 45 % |
| Événements clés marqués dans GA4 | 0 | 3 | 3 |
| Trafic interne et bots filtrés | non | oui | oui |
| Articles indexés et visibles en recherche | ~0 | 8 | 20 |
| Première commission d'affiliation encaissée | non | — | oui (jalon binaire) |

Le premier euro d'affiliation est un **jalon binaire**, pas un montant : à
~9 % de commission sur un panier cordage d'environ 25 €, la question n'est pas
combien mais si la chaîne complète fonctionne bout en bout.

### Critères d'arrêt (à M+3)

Si **simultanément** : `affiliate_click / configurator_complete` < 20 %, **et**
zéro vente affiliée, **et** trafic organique < 100 utilisateurs/mois —
alors l'hypothèse « outil grand public monétisé par affiliation » est invalidée.
Bascule vers le segment B2B cordeurs, ou arrêt. Décision de Pierre, pas d'un
agent.

---

## 9. Mode d'emploi

```bash
# Depuis la racine du dépôt
mkdir -p .claude/agents
mv CLAUDE.md .                       # socle commun, chargé automatiquement
mv tsa-*.md .claude/agents/          # les 6 définitions d'agents
```

Redémarrer la session Claude Code pour que le dossier `.claude/agents/` soit
détecté (le surveillant de fichiers ne couvre que les dossiers existant au
démarrage).

Invocation explicite : *« Utilise l'agent tsa-revenue pour ajouter le lien
d'achat au résultat du configurateur. »*

Chaque agent hérite de ce fichier mais **pas** de la conversation principale :
tout ce dont il a besoin (chemins, messages d'erreur, décisions déjà prises)
doit figurer dans la consigne qu'on lui passe.

Le champ `model` de chaque agent est réglé sur `inherit`. Pour épingler un
modèle par agent, éditer la frontmatter du fichier concerné.

---

*CLAUDE.md v2.3.12 — Tennis String Advisor — « Mesurer avant d'affirmer. »*
