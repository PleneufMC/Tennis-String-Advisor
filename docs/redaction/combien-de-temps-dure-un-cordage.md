# Cordage neuf qui perd sa tension dès les premières heures : est-ce normal, faut-il le corder plus tendu ?

| Champ | Valeur |
|---|---|
| Slug FR / EN | `combien-de-temps-dure-un-cordage` / `how-long-do-tennis-strings-last` (articles existants, slugs inchangés) |
| Circuit | court renforcé : mise à jour d'un article existant (section nouvelle), voir §1 |
| Branche | `agent/redaction/combien-de-temps-dure-un-cordage` |
| Ouvert le | 2026-11-21, par l'orchestrateur |
| Demande d'origine | Pierre, 21/11/2026 : « merci de lancer la rédaction d'un article sur ce thème », ligne du plan éditorial 2026-W46-1 (« Cordage neuf qui perd sa tension dès les premières heures : est-ce normal, et faut-il le corder plus tendu ? », type : mise à jour d'un article existant, score 3,78, circuit court) |
| Statut | rédigé (étapes 3, 6, 7 ; PR ouverte) — en attente du fact-check ciblé (`tsa-pigiste`) et de la passe `<head>` (`tsa-acquisition`) |
| Mise à jour planifiée | sans objet (pas d'année dans le titre ni le slug) |

> Règles : `docs/redaction/CHARTE.md`. Déroulé : `docs/redaction/README.md`.
> On n'écrit que dans ses sections ; on répond aux questions qui nous sont
> adressées au §4 ; chaque passage laisse une entrée au §7.

---

## 1. Cadrage de l'orchestrateur (tient lieu de brief)

**Pourquoi une mise à jour et pas un article.** `combien-de-temps-dure-un-cordage` explique déjà que la perte de tension est la plus rapide juste après la pose (§5 « repos », §2 « panne 1 », FAQ). Il ne répond pas à la question « faut-il compenser cette détente initiale, à la pose ou en recordant ? ». Un nouvel article ferait doublon (relevé du plan éditorial). La FAQ actuelle répond « non » à « monter la tension pour compenser un cordage qui vieillit » : c'est le vieillissement, pas la détente des premières heures ; la nouvelle section doit s'articuler avec cette réponse sans la contredire.

**Question du lecteur.** Pourquoi un cordage neuf perd-il de la tension dès les premières heures, et faut-il compenser cette perte à la pose ou en recordant ?

**Signaux (non mesurés).** Fil r/10s « new strings notched up after 2 hours of playing » (https://reddit.com/r/10s/comments/1xc5x41/new_strings_notched_up_after_2_hours_of_playing/) ; Google associe « Quand changer de cordage de tennis ? » à « tension cordage tennis ». Audience 28 jours : NON DOCUMENTÉ (GA4 et Search Console indisponibles le 15/11). Les forums sont des signaux, jamais des sources.

**Hors périmètre.** Le tableau de tensions par profil (relève de `guide-tension-cordage-tennis`). L'écart montants/travers et le choix d'un montage deux pièces (relève de `comparer-deux-montages-cordage-tension` et du guide).

**Contraintes de la ligne du plan (impératives).**
- Présenter la détente initiale comme normale, conformément au passage publié, et non comme un défaut.
- Aucune règle universelle de compensation (kg en plus, +4 lb en travers) sans source primaire ; à défaut, écrire « introuvable ».
- Ne pas comparer les mesures de laboratoire aux sensations rapportées sur les forums.
- Confort qualifié uniquement par l'indice de fermeté (RCS) et son palier, sans effet sur la santé ; une douleur persistante renvoie vers un professionnel de santé.
- Tout réglage de pro exige deux sources indépendantes.
- Fin d'article : renvoi vers le configurateur (`/configurator` ; EN `/en/configurator`).
- Distinguer tension demandée, tension mesurée et fermeté du tamis (point du contradicteur).

**Questions de faits pour le pigiste.**
1. Quelle part de la tension un cordage perd-il dans les heures qui suivent la pose, et selon quelle mesure source (TWU ou autre base L1) ?
2. Existe-t-il une source primaire qui recommande de corder plus tendu pour compenser cette détente initiale ? Si oui, de combien ? (Pré-étirage, « prestretch », pourcentage machine : à couvrir.)
3. La vitesse de cette perte initiale diffère-t-elle entre polyester et multifilament dans les mesures publiées, à protocole identique ?
4. Une source primaire relie-t-elle la perte de tension mesurée à une évolution de l'indice de fermeté du tamis (ou de la raideur du tamis) ?

**Durée de vie.** Plusieurs années : la détente après la pose ne dépend ni de la saison ni des nouveautés.

**Paires à vérifier après la mise à jour** (cohérence, sans réécriture sauf contradiction) : `compare-two-string-setups-same-tension`, `tennis-strings-for-clay-courts`.

**Acquisition.** Non mobilisée sauf si le titre, la meta, les balises ou le maillage changent (circuit court) ; si le rédacteur ajoute une entrée de FAQ (JSON-LD dans le `<head>`), relais à `tsa-acquisition`.

---

## 2. Dossier de faits — `tsa-pigiste`

Niveaux : **L0** constructeur · **L1** laboratoire (TWU) · **L2** revendeur ·
**L3** test publié, presse · **L4** forum (signal seulement) · **MÉD** source
médicale ou étude publiée · **BASE** `src/data/`.
Statuts : **confirmé** · **divergent** (→ `tsa-core`) · **introuvable** · **signal**.

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (25 mots au plus) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
### Synthèse par question (ce que le dossier permet d'écrire)

**Q1. Quelle part de la tension se perd dans les heures qui suivent la pose ?** **Confirmé, mais aucun chiffre unique.** Les mesures publiées ne mesurent pas la même chose et ne s'additionnent pas :
- **pendant la pose** (consigne → tension du tamis juste après) : environ −30 % en nylon, −40 % en polyester (F4). Cette chute inclut la déformation du cadre et les frottements : ce n'est pas de la « détente des premières heures » ;
- **corde seule sur banc** : jusqu'à 15 lb (≈ 6,8 kg) en une minute à 62 lb, puis stabilisation rapide (F1) ; corde nylon serrée à longueur fixe : 28 → 24,8 kg en 1 000 s (≈ 17 min), 21,9 kg à 72 h (F5) ; ou 28 → environ 24 kg en 15 min, puis 1 à 2 kg de plus sur 24 h (F6) ;
- **raquette cordée, non jouée** : environ 13 % sur « les deux premiers jours » en polyester et en synthétique (F7, fabricant) ; 6 à 9 % de raideur du tamis perdus en 24 h sur trois cordages (F8) ; 2 à 4 points de DT dans les 2 à 4 h (F9, notice d'appareil).
Le sens est établi par trois sources indépendantes (TWU F1-F3, Cross et Bower F4-F6, USRSA F8) : la perte est la plus rapide à la pose et dans les heures qui suivent, puis ralentit sans s'arrêter.
*Rectificatif du fact-check (21/11, `tsa-pigiste`)* : l'essai USRSA (F8) n'a que deux points (pose, 24 h) ; il établit qu'une part se perd dans les 24 premières heures sans jouer, pas le ralentissement. Le ralentissement repose sur TWU (F1-F3) et Cross et Bower (F5, F6), qui ne sont pas entièrement indépendants (R. Cross cosigne avec TWU, F10).

**Q2. Une source primaire recommande-t-elle de corder plus tendu pour compenser ?** **Introuvable.** Ni USRSA, ni ERSA, ni TWU, ni un fabricant de machines, ni un fabricant de cordages ouvert ne prescrit de « +x kg » ou de « +x % » contre la détente initiale (voir « Introuvable »). Ce qui existe :
- deux sources L1/MÉD disent au contraire que cette perte compte peu si elle est constante, puisque le joueur choisit sa consigne (F12, F13) ;
- le pré-étirage réduit la vitesse de perte qui suit (MÉD, qualitatif, sans chiffre : F11) ;
- les machines proposent un pré-étirage de 10 % ou 20 % au-dessus de la consigne (L0, description de fonction, sans recommandation : F14) ;
- un fabricant juge le pré-étirage de son boyau « généralement pas nécessaire » (F15) ;
- un éditorial (L3) conseille de **baisser** la consigne du pourcentage de pré-étirage (F16) : le sens inverse d'une compensation à la hausse ;
- un fabricant conseille de corder le polyester 1 kg **plus bas** que le nylon, pour sa raideur, pas pour sa perte (F18).

**Q3. Polyester et multifilament perdent-ils à la même vitesse, à protocole identique ?** **Divergent.** TWU (banc, F21) et Cross et Bower (échantillons, F22) écrivent que le polyester perd plus et plus vite que le nylon ; la base TWU le confirme en médiane (41,2 % contre 20,5 %, F24). Mais les deux seuls essais **sur raquettes identiques** trouvés donnent autre chose : polyester et synthétique à égalité (≈ 13 %) sur les deux premiers jours (F7) ; polyester 6 % contre 9 % pour un multifilament et un synthétique en 24 h (F8). Aucune source ne compare un **multifilament** nommé comme tel à un polyester sous protocole publié sur les premières heures ; TWU range synthétiques et multifilaments sous « Nylon » (F24).

**Q4. Une source relie-t-elle la perte de tension à la raideur du tamis ?** **Confirmé pour la raideur du tamis, introuvable pour l'indice RCS.** TWU : la raideur suit la tension (F27, F29), et ce qui compte est la raideur qui résulte de la perte (F28). L'essai USRSA exprime la perte de 24 h directement en raideur du tamis (F8). Cross et Bower : c'est la raideur du tamis, non la tension, qui est le paramètre important (F30). L'indice de fermeté du site est calculé sur la **tension demandée** et ne contient aucun terme de perte (F31) : aucune source ne relie la perte mesurée à un écart d'indice.

### Faits

| # | Énoncé | Valeur | Niveau | Source (URL ouverte) | Consulté le | Extrait verbatim (25 mots au plus) | Recoupement | Base TSA | Statut |
|---|---|---|---|---|---|---|---|---|---|
| **Q1** | **Ampleur et cinétique de la perte après la pose** | | | | | | | | |
| F1 | Banc TWU, corde seule tendue à 62 lb : perte dès la mise en place, stabilisation rapide après les premières minutes ; puis forte perte sur les premières frappes ; 20 à 35 lb perdues « avant le premier jeu » | jusqu'à 15 lb en 1 min (≈ 24 % de 62 lb, calcul TSA) ; jusqu'à 20 lb en 20 frappes ; 20 à 35 lb au total | L1 (TWU, C. Lindsey, « How Tennis Strings "Go Dead" », partie 1, 21/03/2013) | https://twu.tennis-warehouse.com/learning_center/deadstrings.php | 2026-11-21 | « all strings lose tension from the second they are put into the racquet — up to 15 pounds in one minute. » | F4, F5 (même cinétique) ; déjà cité par l'article | — | confirmé ; **corde seule sur banc, pas une raquette** |
| F2 | La vitesse de perte est maximale à la pose, reste élevée pendant « plusieurs heures » et sur les premières frappes, puis devient presque imperceptible mais cumulative | qualitatif | L1 (TWU, C. Lindsey, « String Stiffness », non daté) | https://twu.tennis-warehouse.com/learning_center/stringstiffness.php | 2026-11-21 | « The rate of tension loss is greatest when the racquet is first strung » / « and for the next several hours and for the very first few hits. » | F3, F6 | — | confirmé ; déjà cité par l'article (§5) |
| F3 | L'essentiel de la perte survient pendant et juste après la pose, et sur les « deux premières douzaines » de frappes ; ensuite chaque impact retire une fraction de livre | qualitatif | L1 (TWU, « Compare Strings », non daté) | https://twu.tennis-warehouse.com/learning_center/comparestrings.php | 2026-11-21 | « Most is lost during and immediately after stringing and with your first couple of dozen hits. » | F2 | — | confirmé |
| F4 | Tension du tamis juste après la pose, comparée à la consigne : environ 30 % plus basse en nylon, 40 % en polyester. Quatre causes : relaxation de la corde, déformation du cadre, frottement montants/travers, alignement de la tête de tirage et frottement dans les œillets | ≈ −30 % (nylon) ; ≈ −40 % (polyester) | MÉD (R. Cross et R. Bower, « String tension in a tennis racket », *Sports Engineering* 4, 2001, p. 165-175) | https://www.physics.usyd.edu.au/~cross/CrossBower.pdf | 2026-11-21 | « the tension immediately after stringing with a polyester string is about 40% lower than the pull tension. » | F8 du dossier `guide-tension-cordage-tennis` (60 lb → 50-55 lb, revendeur) | — | confirmé ; **chute pendant la pose, pas détente des heures suivantes** |
| F5 | Corde serrée à longueur fixe (banc), après 10 s à la tension : 28,0 → 24,8 kg après 1 000 s ; 28,0 → 21,9 kg après 72 h. À 18 kg : 15,86 kg puis 14 kg. Après les 100 premières secondes, la tension décroît linéairement avec le logarithme du temps ; extrapolation : 19,1 kg après un an | 28 kg : −11,4 % à 1 000 s, −21,8 % à 72 h ; 18 kg : −11,9 %, −22,2 % (pourcentages : calcul TSA) | MÉD (idem F4) | idem F4 | 2026-11-21 | « After three days (72 h), the tensions dropped, respectively, from 18 to 14 kg and from 28.0 to 21.9 kg. » | F6 (même ordre de grandeur) | — | confirmé ; **échantillon de corde, pas raquette** ; matériau de cet essai non relu dans le passage cité |
| F6 | Échantillon neuf de **nylon** tendu à 28 kg puis bloqué : environ 24 kg en 15 min, puis 1 à 2 kg de plus sur 24 h selon le cordage et son histoire | ≈ −4 kg en 15 min (≈ −14 %, calcul TSA) ; −1 à −2 kg sur les 24 h suivantes | MÉD (idem F4) | idem F4 | 2026-11-21 | « will drop to about 24 kg within 15 min. Over the next 24 h, the tension may drop by a further 1 or 2 kg » | F5 | — | confirmé |
| F7 | Trois raquettes identiques cordées à 60 lb, non jouées, conditions stables, 21 jours (essai de J. Gugel, Racquet Quest) : perte « dans les deux premiers jours » ; le polyester regagne de la tension jusqu'au 8e jour puis la reperd vite ; total à 21 jours | 2 premiers jours : polyester ≈ 13 %, synthétique ≈ 13 %, MonoGut ZX 9,5 % ; 21 j : synthétique 17,3 %, polyester 15,2 %, MonoGut ZX 11,9 % | L0 (Ashaway, S. Crandall, non daté) | https://www.ashawayusa.com/TennisTip9.php ; même essai sur https://www.ashawayusa.com/TennisTip6.php | 2026-11-21 | « The polyester and synthetic gut both lost about 13% during this period, while the MonoGut ZX lost 9.5%. » | les deux pages sont du même auteur : **une seule source** | — | confirmé comme essai publié par un fabricant ; **instrument et modèle de raquette non indiqués, une raquette par cordage, fabricant qui vend le MonoGut ZX** ; valeurs jour par jour en image seulement |
| F8 | Essais USRSA reproduits par Tennis Warehouse : Wilson Pro Staff 6.1 95 (16 × 18), 60 lb, machine à tirage constant ; raideur du tamis à l'appareil RDC juste après la pose puis après 24 h sans jouer, exprimée en « % de perte de tension » | Tourna Poly Big Hitter 16 : 69 → 65 (6 %) ; Head FiberGel Power 16 : 80 → 73 (9 %) ; témoin Prince Synthetic Gut Original Gold 16 : 78 → 71 (9 %) | L3 (USRSA, « Reprinted with permission of the United States Racquet Stringer's Association », non daté ; la page FiberGel renvoie à des numéros de 2002-2004) | https://tennis-warehouse.com/reviews/ubighit/ubighitreview.html ; https://www.tennis-warehouse.com/learning_center/string_reviews/HFGPWR16review.html | 2026-11-21 | « After 24 hours (no playing), stringbed stiffness measured 65 RDC units, representing a 6% tension loss. » | F7 (même ordre de grandeur sur 1 à 2 jours) ; F4-F5 du dossier `comparer-deux-montages-cordage-tension` (mêmes valeurs le 13/11) | — | confirmé ; **une pose par cordage, essais non datés, unité RDC propre à l'appareil** ; produits nommés : ne pas en tirer de verdict |
| F9 | Notice de l'appareil ERT 300 : dans les 2 à 4 h après la pose, perte fréquente dite « de stabilisation » | 2 à 4 points de DT | L0 (notice Gamma, © Beers Technic GmbH) | https://www.manualsdir.com/manuals/769757/gamma-ert-300.html?page=5 | 2026-11-21 | « Within the first 2 to 4 hours after stringing, there is often a remarkable tension loss of 2...4 DT, called the stabilization losses. » | F2 (même fenêtre de quelques heures) | — | confirmé comme **documentation d'un fabricant d'appareil** ; pas de protocole |
| F10 | TWU et Univ. de Sydney, 2016 : une corde montre d'abord une chute très rapide, puis ralentit et se stabilise. Corde tendue à 28 kg : celle amenée à la tension en 1 s perd près de 3 kg de plus (après environ 1 000 s) que celle amenée en 26 s | ≈ 3 kg d'écart selon la vitesse de tirage | L1 (C. Lindsey et R. Cross, « temperature », 06/06/2016) | https://twu.tennis-warehouse.com/learning_center/temperature.php | 2026-11-21 | « the string that took only 1 second to stretch to target tension » / « lost almost 3 Kg more tension than the one that took 26 seconds. » | F5 | — | confirmé ; **matériau de cette corde non indiqué** ; même page : « string lower for cold and higher for hot » (température, pas détente initiale) |
| **Q2** | **Compenser à la pose : pré-étirage, consigne plus haute** | | | | | | | | |
| F11 | Le pré-étirage réduit la vitesse de perte qui suit ; une corde déjà étirée perd plus lentement qu'une corde neuve (rupture progressive de liaisons chimiques, maximale au début) | qualitatif, **aucun chiffre** | MÉD (idem F4) | idem F4 | 2026-11-21 | « which explains why prestretching a string reduces the subsequent rate of loss in tension. » | F16, F17 (même sens, L3 sans mesure) | — | confirmé (sens seulement) |
| F12 | Une chute de tension constante n'a « pas de réelle conséquence » pour le joueur, qui choisit la consigne qu'il préfère ; elle ne pose problème que si elle n'est pas constante | qualitatif | MÉD (idem F4, « Discussion ») | idem F4 | 2026-11-21 | « players can specify whatever pull tension they prefer. » | F13 | — | confirmé ; **portée précisée au fact-check (21/11)** : la phrase vise « the drop in tension during the stringing process » (la chute de 30-40 % pendant la pose, F4), pas la détente des heures suivantes ; seul TWU (F13) parle de la perte « préliminaire » qui suit la pose |
| F13 | TWU : la perte préliminaire « ne compte pas tant que ça » ; ce qui importe est la sensation au début du jeu et sa durée | qualitatif | L1 (idem F1) | idem F1 | 2026-11-21 | « None of this preliminary tension loss matters that much. » / « The important thing is how the string feels when you begin play » | F12 | — | confirmé |
| F14 | Fonction de pré-étirage d'une machine électronique : tirage à 10 % ou 20 % au-dessus de la consigne (90 lb / 40,8 kg au plus), relâchement, puis retour à la consigne | 10 % ou 20 % | L0 (manuel Gamma 8800 ELS) | https://www.manualslib.com/manual/939925/Gamma-8800-Els.html?page=10 | 2026-11-21 | « Pulls string 10% or 20% over the tension setting (up to 90 lbs / 40.8 kgs) » / « releases the string, and repulls to the tension setting. » | manuels Babolat (Star 5, Sensor Dual) vus en extrait seulement : non ouverts (voir « Introuvable ») | — | confirmé comme **description d'une fonction**, aucune recommandation d'emploi ni d'effet |
| F15 | Luxilon : le pré-étirage de son boyau LXN n'est en général pas nécessaire ; tirer doucement sur la corde déroulée suffit | qualitatif | L0 (Luxilon Industries NV, non daté) | https://luxilon.be/sport/natural-gut | 2026-11-21 | « Generally, pre-stretching of the LXN natural casing is not necessary » | — | — | confirmé (un produit, un fabricant) |
| F16 | Éditorial : le pré-étirage est une légère tension préalable ; la corde se détend moins pendant les premières heures ; il raidit la corde ; il est conseillé de **baisser** la consigne du même pourcentage (ex. 25 kg à 10 % → 22,5 kg) | 10 % → −10 % de consigne | L3 (Racketpedia, G. Medri, 29/04/2025) | https://www.racketpedia.com/en-GB/editorials/string-pre-stretch-what-why-when | 2026-11-21 | « it is advisable to reduce the stringing tension by the same percentage in order to maintain a balanced playing response. » | aucune mesure ; sens de la moindre détente : F11 | — | **signal** : un auteur, aucun essai |
| F17 | Blog d'un cordeur : le pré-étirage stabilise la corde et réduit le fluage à court terme ; « meilleur » pré-étirage : 25 à 30 lb pendant 30 à 35 s ; aucun chiffre de perte | 25-30 lb, 30-35 s | L3 (RacquetQuest, 30/10/2024) | https://racquetquest.tennis/2024/10/30/to-pre-stretch-or-not-to-pre-stretch/ | 2026-11-21 | « Pre-stretching stabilizes the string and reduces short-term creep (tension loss). » | F11 (sens) ; F16 (méthode différente) | — | **signal** ; même site, autre billet (11/03/2024) : 35 à 40 lb, sans mesure |
| F18 | Wilson : corder le polyester environ 1 kg (2 lb) **plus bas** que le nylon, parce qu'il est plus raide | −2 lb (−1 kg) | L0 (Wilson, mis à jour le 09/05/2024) | https://www.wilson.com/en-de/blogs/blog/what-string-tension-should-i-use-in-my-tennis-racket | 2026-11-21 | « Because polyester is a stiffer material, string 2lbs (1kg) looser than nylon » | — | — | confirmé ; **motif : raideur, pas perte de tension** ; la page ne parle ni de perte ni de pré-étirage |
| F19 | Tecnifibre : le cordage perd de la tension « tout seul, avec le temps » (« effet statique ») ; de nombreux joueurs de tournoi font corder le matin du match ; ajustements de ±1 kg proposés pour la surface et la météo, aucun pour la détente initiale | qualitatif | L0 (Tecnifibre, Tecnimag, 30/04/2025) | https://www.tecnifibre.com/blogs/tecnimag/quelle-tension-pour-votre-cordage-nos-conseils | 2026-11-21 | « le cordage fatigue et perd en tension… tout seul, avec le temps. » | F2 (sens) | — | confirmé comme **avis de fabricant** ; « matin du match » : pratique de pros, **une seule source**, aucun joueur nommé (F4) |
| F20 | Recommandation chiffrée de corder plus tendu pour compenser la détente initiale (USRSA, ERSA, TWU, fabricants de machines ou de cordages) | — | — | recherches du 2026-11-21 : TWU (4 pages), Cross et Bower, Ashaway (2 pages), Luxilon, Wilson, Tecnifibre, manuel Gamma ; USRSA, ERSA : rien d'ouvrable | 2026-11-21 | — | seule trace : revendeur Tennis Express (« 1-2 lbs over », vu en extrait de moteur) **refusé en 403** | — | **introuvable** |
| **Q3** | **Polyester contre nylon / multifilament** | | | | | | | | |
| F21 | Banc TWU : le polyester perd plus que le nylon, qui perd plus que le boyau | ordre | L1 (idem F1) | idem F1 | 2026-11-21 | « Polyester loses more than nylon which loses more than gut. » | F22, F24 ; **le boyau n'est pas dans le panel de seize cordages de l'essai** (dossier `guide-tension-cordage-tennis`, F11) | — | confirmé (ordre) |
| F22 | Échantillons : le polyester perd sa tension plus vite que le nylon | qualitatif | MÉD (idem F4) | idem F4 | 2026-11-21 | « Polyester strings lose tension more rapidly than nylon » | F21 | — | confirmé |
| F23 | Introduction de l'étude température : pertes « très spécifiques au matériau », boyau, nylon et polyester perdant le moins dans cet ordre | ordre, non mesuré dans cette étude | L1 (idem F10) | idem F10 | 2026-11-21 | « The amount is highly material specific, with gut, nylon, and polyester losing the least tension in that order. » | F21 | — | confirmé comme rappel ; même auteur que F21 |
| F24 | Base TWU (51 lb, « Fast »), pourcentage « Tension Loss » par matériau : médiane (intervalle interquartile) | Polyester 41,2 % (32,6-48,0 ; n = 483) ; Nylon 20,5 % (17,7-23,1 ; n = 230) ; Nylon/Polyuréthane 20,0 % (18,1-21,3 ; n = 17) ; Boyau 14,9 % (12,4-15,9 ; n = 18) | BASE (relevé TWU du 29/09/2026, `data/reference/twu-releve-complet.json`, empreinte `01c07cce…8872` identique au fichier brut) | https://twu.tennis-warehouse.com/learning_center/reporter2.php (source du relevé) | calcul 2026-11-21 | — | dossier `guide-tension-cordage-tennis` F15 : mêmes médianes le 12/11 | relevé versionné ; **les fiches du site ne portent pas ce champ** | confirmé ; **protocole non décrit par TWU (F25), rien ne dit qu'il s'agit d'une perte « initiale »** ; TWU ne distingue pas « multifilament » : synthétiques et multifilaments sont sous « Nylon » |
| F25 | TWU ne décrit pas le protocole du pourcentage de perte ; il écrit qu'une perte plus forte « tend » à indiquer une perte plus rapide | qualitatif | L1 (idem F3) | idem F3 | 2026-11-21 | « Higher tension loss tends to indicate faster loss also. » | F24 | — | confirmé |
| F26 | Essais sur raquettes identiques : F7 (polyester ≈ synthétique sur 2 jours) et F8 (polyester 6 % contre 9 % pour multifilament et synthétique en 24 h) | voir F7, F8 | L0 et L3 | voir F7, F8 | 2026-11-21 | voir F7, F8 | contredisent en tendance F21, F22, F24 sur les premières 24 à 48 h | — | **divergent** (entre sources, pas avec la base) : une raquette par cordage, deux essais |
| **Q4** | **Perte de tension et raideur du tamis** | | | | | | | | |
| F27 | La raideur d'une corde dépend de sa tension ; quand la tension baisse, la raideur aussi. Ce qui compte en entrant sur le court : la raideur de départ et la vitesse de perte qui mène à la raideur du tamis actuelle. Deux cordages à moins de 10 % l'un de l'autre au départ : différence peut-être imperceptible | 10 % | L1 (idem F2) | idem F2 | 2026-11-21 | « As tension goes down, so does stiffness. » / « and the tension loss rate to get you to the stringbed stiffness you now have, » | F28, F29 | — | confirmé ; le « 10 % » est un avis, sans mesure sur la page |
| F28 | Ce qui compte n'est pas le taux de perte mais la raideur de la corde qui résulte de la perte | qualitatif | L1 (idem F3) | idem F3 | 2026-11-21 | « It is the stiffness of the string as a result of the tension loss that is the key. » | F27 | — | confirmé |
| F29 | La raideur perpendiculaire (celle que la balle ressent) dépend presque entièrement de la tension avant l'impact ; même après 20 à 35 lb perdues, un polyester plus raide peut donner un tamis plus raide qu'un nylon qui n'a perdu que quelques livres | qualitatif | L1 (idem F1) | idem F1 | 2026-11-21 | « stiffer polyester strings can produce a stiffer stringbed » / « than softer nylon strings that lose only a few pounds. » | F27 | — | confirmé |
| F30 | La tension seule n'est pas un paramètre important ; le paramètre important est la raideur du tamis, qui dépend aussi de la taille du tamis et du type de cordage | qualitatif | MÉD (idem F4) | idem F4 | 2026-11-21 | « The important parameter is the string-bed stiffness, which depends on factors such as head size and string type as well as string tension. » | F27 | — | confirmé |
| F31 | L'indice de fermeté (RCS) est calculé sur la **tension demandée** ; la formule ne contient aucun terme de perte de tension : +0,5 point par kg de consigne. Paliers : < 20 Très confortable ; 20-24 Confortable ; 25-29 Standard ; 30-34 Ferme ; ≥ 35 Très ferme ; alerte dès 32 (bras sensible) ou 35 | +0,5 pt/kg | BASE | `src/data/strings-database.ts` (`calculateRCS` l. 3798, `getStringRecommendation` l. 3818) ; `src/lib/advanced-rcs.ts` (`ARM_ALERT_RCS` l. 139) | 2026-11-21 (`7a1b06f`) | — | dossier `guide-tension-cordage-tennis` F31 (même formule) | oui | confirmé ; **aucune source ne convertit une perte mesurée en points d'indice** : ne pas écrire « 2 kg perdus = 1 point de moins » |

### Introuvable

- **Une règle de compensation à la pose** (« +x kg », « +x % », « +1-2 lb ») publiée par l'USRSA, l'ERSA, TWU, un fabricant de machines ou un fabricant de cordages (F20). La seule trace d'un « 1-2 lbs over » est un revendeur (Tennis Express) vu en extrait de moteur, page refusée en 403 : non documenté.
- **Une mesure chiffrée de l'effet du pré-étirage** sur la perte des heures suivantes (avec / sans, même cordage, même raquette). Les sources disent le sens (F11, F16, F17), aucune ne donne d'ampleur ouvrable.
- **Une recommandation d'emploi du pré-étirage** par un fabricant de machines : le manuel Gamma décrit la fonction (F14) ; les manuels Babolat (Star 5, Sensor Dual, Evolution Tour) n'ont pas pu être ouverts (voir §7).
- **Une position de l'USRSA ou de l'ERSA** sur le pré-étirage ou la compensation : aucune page de ces organismes trouvée ni ouverte.
- **Une comparaison polyester / multifilament nommé comme tel, sous un protocole publié, sur les premières heures** (F24, F26).
- **Une conversion de la perte de tension en écart d'indice RCS** (F31).

### Divergences avec la base (pour `tsa-core`)

Aucune. Aucune valeur produit de la base n'est citée ; le relevé TWU versionné est identique au fichier brut (empreinte vérifiée le 21/11, F24).

### Points glissants repérés

- **« Un cordage perd 30 à 40 % dans les heures qui suivent »** : faux attelage. Le 30-40 % de Cross et Bower est l'écart entre consigne et tamis **juste après la pose** (cadre, frottements compris, F4) ; la détente des heures suivantes se mesure autrement (F5-F9). Ne pas additionner les chiffres de F1, F4, F5, F7 et F8 : protocoles différents (corde seule, échantillon, raquette ; tension, raideur RDC, DT).
- **« Corder 1 à 2 kg plus tendu pour compenser »** ou tout « +x » : introuvable (F20). Les sources primaires vont plutôt dans l'autre sens : la perte constante est sans conséquence puisque la consigne est un choix (F12, F13).
- **« Le pré-étirage supprime la détente »** : seul le sens (moins vite) est établi (F11) ; aucune ampleur. Il raidit aussi la corde (F16, une source L3) et un éditorial conseille alors de **baisser** la consigne (F16) : deux usages possibles, aucune règle.
- **« Le polyester se détend plus vite que le multifilament dans les premières heures »** : vrai en tendance sur banc et en base TWU (F21, F22, F24), contredit par les deux essais sur raquette (F7, F8). À écrire avec son protocole, ou en tendance de laboratoire.
- **Ashaway (F7)** : fabricant qui vend le cordage le mieux classé ; une raquette par cordage, instrument non nommé. À citer comme essai d'un fabricant.
- **USRSA RDC (F8)** : le « % de perte de tension » est une perte de **raideur du tamis** lue sur un appareil ; un seul cadre, une pose par cordage.
- **« Les pros cordent le matin du match »** (F19, déjà publié) : une seule source, un fabricant ; aucun joueur nommé ne peut s'y ajouter (F4 de la charte).
- **La FAQ « Faut-il monter la tension pour compenser un cordage qui vieillit ? Non »** : F12 et F13 soutiennent une réponse cohérente pour la détente initiale (choisir sa consigne d'après la sensation après détente), mais ne parlent pas de vieillissement ; ne pas les fusionner.
- **Indice RCS et perte** : l'indice est calculé sur la consigne (F31). Écrire que la détente « fait baisser l'indice » serait une extrapolation du site, non sourcée.

---

## 3. Iconographie — `tsa-pigiste` (candidats) · `tsa-redacteur` (décision)

Voies (charte §4) : **1** photo à licence explicite · **2** visuel généré par
script · **3** illustration générée par l'outil MCP de Pierre (seulement s'il est
connecté). Le visuel qui sert le mieux le lecteur l'emporte. Pour la voie 3, le
rédacteur note ici le prompt employé, puis le recopie dans `CREDITS.md`.

| # | Emplacement | Voie | Page de l'image ou prompt | Auteur | Licence (lue le) | Obligations | Risques (marque, personne, texte incrusté) | Décision du rédacteur |
|---|---|---|---|---|---|---|---|---|
| I1 | couverture | — | inchangée : la couverture actuelle de l'article (Jeuwre, Wikimedia Commons, CC0, recadrée) reste en place ; aucune nouvelle recherche (mise à jour d'une section) | — | — | — | — |  **Retenu tel quel** : couverture inchangée. |
| I2 | corps, nouvelle section | 2 | Schéma ou courbe tracé par script à partir des **seuls** points écrits dans le texte de Cross et Bower (F5) : 28,0 kg → 24,8 kg à 1 000 s → 21,9 kg à 72 h ; 18,0 → 15,86 → 14 kg. Échelle de temps logarithmique (la source dit la décroissance linéaire en log du temps après 100 s). Légende : « corde seule serrée à longueur fixe, pas une raquette ». Variante : schéma en trois étapes « consigne → juste après la pose (≈ −30 % nylon, ≈ −40 % polyester, F4) → heures suivantes (F5-F9) », sans additionner les pourcentages | Tennis String Advisor | — | légende de provenance : « d'après Cross et Bower, *Sports Engineering*, 2001 » | ne pas numériser la figure 3 de l'article (seuls trois points par courbe sont écrits) ; ne pas mêler sur un même axe tension (kg), raideur RDC et DT |  **Retenu, voie 2, version courbe** : `scripts/blog-covers/build-schema-detente-cordage-neuf.py` → `public/blog/images/schema-detente-cordage-neuf-{fr,en}.svg`. Seuls les six points de F5 ; temps en échelle log ; départ placé à 10 s ; trait plein de 1 000 s à 72 h (décroissance linéaire en log selon la source), pointillé avant (aucun point publié). Variante « trois étapes » écartée : elle aurait placé côte à côte des pourcentages de natures différentes. Ligne ajoutée à `CREDITS.md`. |
| I3 | corps | 1 | aucune photo cherchée : une photo n'apprend rien sur la détente ; un schéma (I2) sert mieux le lecteur | — | — | — | — |  Sans objet. |

---

## 4. Questions ouvertes

- **Q-1** · de `tsa-pigiste` à l'orchestrateur (pour Pierre) · 2026-11-21 — Les manuels de machines Babolat (Star 5, Sensor Dual, Evolution Tour) qui décrivent la fonction « prestretch » n'ont pas pu être ouverts (PDF officiel en 404 ; copies tierces refusées par robots.txt ou en 403). Si l'article doit citer un fabricant de machines au-delà de Gamma (F14), une voie autorisée serait que Pierre demande le manuel au service client Babolat, ou le consulte s'il possède une machine. Le dossier tient sans.
- **Q-2** · de `tsa-pigiste` à `tsa-redacteur` · 2026-11-21 — Pour Q2, le dossier ne permet que « aucune règle de compensation publiée » (F20) et la position de TWU et de Cross et Bower (F12, F13). Toute phrase « certains cordeurs ajoutent 1 à 2 kg » n'a pas de source écrivable (Tennis Express refusé, forums non admis) : à ne pas écrire, même au conditionnel.
  - **Réponse** · `tsa-redacteur` · 2026-11-21 — Appliqué : aucune phrase de ce type, FR comme EN. Le texte dit « introuvable », daté au 21/11/2026, et renvoie à F12-F13.
- **Q-3** · de `tsa-redacteur` à `tsa-acquisition` · 2026-11-21 — **Le `<head>` doit suivre le corps** (je n'y ai touché que pour `dateModified`, passé à `2026-11-21` en FR et EN) :
  1. **FAQPage** : une question visible a été ajoutée en dernière position de la FAQ, FR et EN. Texte exact à baliser (identique au texte visible) :
     - FR — question : `Un cordage neuf perd de la tension dès les premières heures : faut-il le corder plus tendu ?` ; réponse : `Cette détente est normale : tout cordage perd de la tension dès la pose, très vite au début, puis de plus en plus lentement. Nous n'avons trouvé aucune règle publiée qui chiffre une compensation. Pour Cross et Bower comme pour TWU, cette perte compte peu : vous jouez toujours sur un tamis déjà détendu, et la tension qui vous convient en tient compte. Si le cordage neuf vous paraît trop mou, revoyez la consigne au prochain recordage.`
     - EN — question : `New strings lose tension in the first few hours: should I string tighter?` ; réponse : `That settling is normal: every string loses tension from the moment it's installed, very fast at first, then more and more slowly. We found no published rule that puts a number on compensation. For Cross and Bower, as for TWU, this loss matters little: you always play on a bed that has already settled, and the tension you like accounts for it. If fresh strings feel too soft, revisit the reference tension at your next restring.`
  2. **Sitemap** : `src/app/sitemap.ts` l. 76 et l. 122, `modified` de `2026-10-23` à `2026-11-21`. `npm run audit:jsonld` échoue sur ces deux lignes tant que ce n'est pas fait (2 ECHEC, voir §7).
  3. **`citation` du BlogPosting** (facultatif) : nouvelles sources du corps — Cross et Bower 2001 (« Measurements of string tension in a tennis racket », *Sports Engineering* 4, p. 165-175, https://www.physics.usyd.edu.au/~cross/CrossBower.pdf), Ashaway TennisTip9, essais USRSA chez Tennis Warehouse (2 URL), manuel Gamma 8800 ELS, Wilson (en-de).
  4. Titre, meta, og : inchangés. À toi de juger si la meta doit mentionner la détente du cordage neuf.
  5. Hors périmètre, signalé : l'article EN pointe encore vers `/en/configurator.html` (en-tête, CTA, pied de page ; 301 vers `/en/configurator` depuis le 20/11). Seul le lien de la nouvelle section vise `/en/configurator`.
- **Q-4** · de `tsa-redacteur` à `tsa-pigiste` · 2026-11-21 — Titre de l'étude : F4 écrit « String tension in a tennis racket » ; les JSON-LD des articles existants et le corps EN de `compare-two-string-setups-same-tension` écrivent « Measurements of string tension in a tennis racket ». J'ai suivi la seconde forme : à confirmer sur le PDF. À vérifier aussi : prénoms « Rod Cross » et « Rob Bower » (repris des JSON-LD existants) ; « l'ERSA, les associations de cordeurs » (développé du sigle absent du dossier) ; « l'USRSA, l'association américaine des cordeurs » (d'après F8) ; départ de la courbe I2 placé à 10 s (lecture de « après 10 s à la tension », F5) ; titres donnés aux liens Ashaway (« Tennis Tip ») et Wilson (« blog, choix de la tension du cordage »), le dossier ne donnant que l'URL.
  - **Réponse** · `tsa-pigiste` · 2026-11-21 (pages rouvertes ce jour, règles d'hôte lues avant chaque requête) :
    - **Titre** : « **Measurements of string tension in a tennis racket** » est le titre de l'article (page de titre du PDF, p. 165). « String tension in a tennis racket » n'est que le titre courant imprimé en haut des pages paires (« String tension in a tennis racket • R. Cross and R. Bower »). La forme retenue par le rédacteur est la bonne ; F4 est corrigé ici.
    - **Prénoms** : le PDF écrit « R. Cross and R. Bower » ; l'adresse de correspondance donne « **Rod Cross**, University of Sydney » : confirmé. Le prénom de Bower n'apparaît ni dans le PDF (« University of Technology, Sydney ») ni dans la notice du dépôt UTS d'un article ultérieur (https://opus.lib.uts.edu.au/handle/10453/4445 : « Bower, R ») : « **Rob Bower** » est **introuvable** → écrire « R. Bower » (correction C5).
    - **ERSA** : « **European Racquet Stringers Association** », fondée à l'été 2001 (L0, https://www.ersa-international.com/, titre de page « ERSA INTERNATIONAL – The European Racquet Stringers Association », 21/11). « Les associations de cordeurs » est trop vague → C6.
    - **USRSA** : « **United States Racquet Stringers Association** » (L0, https://www.racquettech.com/, titre de page, 21/11) ; « l'association américaine des cordeurs » (FR) et le développé EN sont exacts. L'apostrophe de F8 (« Stringer's ») est celle de la page Tennis Warehouse.
    - **Départ de la courbe à 10 s** : **justifié en approximation, aucune correction**. Le texte dit « tensioned to either 18 or 28 kg, held at that tension for 10 s, and then clamped » ; la figure 3 du PDF (temps en heures, échelle log dès 0,001 h) montre la mise en tension vers 0,002-0,004 h (≈ 7 à 15 s) et le sommet de chaque courbe juste après. L'ajustement imprimé sur la figure, T = 24,1 − 1,256 log t (t en h), redonne 24,8 kg à 1 000 s et ≈ 21,8 kg à 72 h : les instants 1 000 s et 72 h sont bien sur l'axe de la figure, où le point de départ tombe entre 10 et 15 s environ. Trait plein depuis 1 000 s conforme (« After the first 100 s, a plot of T vs. log(t) is closely linear ») ; le pointillé avant 1 000 s est honnête (pas de point publié, la vraie courbe est plus raide avant 100 s).
    - **Libellés des liens** : Ashaway — la page n'a pas de titre « Tennis Tip » : rubrique « Steve Crandall's Tennis Stringing Tips », article « **The Art of Selecting a Monofilament String: Perception versus Reality** », by Steve Crandall ; Wilson — titre H1 « **What String Tension Should I Use in My Tennis Racket?** », « Updated May 9, 2024 ». Correction C7 (corps et `citation`).
- **Q-5** · de `tsa-redacteur` à `tsa-acquisition` · 2026-11-21 — **À reporter dans le `<head>` après la passe finale** (je n'y ai pas touché ; `audit:jsonld` échoue tant que ce n'est pas fait, 2 ECHEC sur la question 7 de la FAQPage) :
  1. **FAQPage, question 7** (question inchangée, réponse modifiée par C2) — texte final exact du corps :
     - FR — question : `Un cordage neuf perd de la tension dès les premières heures : faut-il le corder plus tendu ?` ; réponse : `Cette détente est normale : tout cordage perd de la tension dès la pose, très vite au début, puis de plus en plus lentement. Nous n'avons trouvé aucune règle publiée qui chiffre une compensation. Pour TWU, cette perte compte peu, et Cross et Bower en disent autant de la chute pendant la pose si elle est constante : vous jouez toujours sur un tamis déjà détendu, et la tension qui vous convient en tient compte. Si le cordage neuf vous paraît trop mou, revoyez la consigne au prochain recordage.`
     - EN — question : `New strings lose tension in the first few hours: should I string tighter?` ; réponse : `That settling is normal: every string loses tension from the moment it's installed, very fast at first, then more and more slowly. We found no published rule that puts a number on compensation. TWU says this loss matters little, and Cross and Bower say the same of the drop during stringing if it is consistent: you always play on a bed that has already settled, and the tension you like accounts for it. If fresh strings feel too soft, revisit the reference tension at your next restring.`
  2. **`citation`, FR et EN** :
     - C5 : `"author": "Rod Cross, Rob Bower"` → `"author": "R. Cross, R. Bower"` (FR l. 95, EN l. 96) ;
     - C7 Ashaway : `"name": "Tennis Tip"` → `"name": "The Art of Selecting a Monofilament String: Perception versus Reality"` (auteur : S. Crandall) ;
     - C7 Wilson : `"name": "Wilson — blog, choix de la tension du cordage"` (FR) et `"name": "Wilson blog: choosing your string tension"` (EN) → `"name": "What String Tension Should I Use in My Tennis Racket?"` dans les deux langues.

---

## 5. Fact-check final — `tsa-pigiste`

### Valeurs produit (contrôle automatique)

Chaque valeur produit affichée par l'article, FR et EN, y compris dans les
tableaux, telle qu'elle est écrite. Champs : voir l'en-tête de
`scripts/redaction/verifier-valeurs.mts`.

```valeurs-produit
# sujet                                   | champ           | valeur citée | où
# Aucune valeur produit de la base dans la section 6, la FAQ ajoutée ni les sources (FR et EN).
# Les produits nommés (Tourna Poly Big Hitter 16, Head FiberGel Power 16) ne le sont que dans
# les libellés de sources ; les 6 % / 9 % sont des valeurs USRSA (F8), pas des valeurs de la base.
```

Sortie de `npm run redaction:valeurs -- docs/redaction/combien-de-temps-dure-un-cordage.md` (21/11/2026, après `git pull`, tête `714eb0f`) :

```
  AVERT aucune valeur listée — l'article ne cite-t-il vraiment aucune valeur produit (tableaux compris) ?

0 valeur(s) contrôlée(s), 0 écart(s)
```

Code de sortie 0. L'avertissement est attendu : la section ne cite aucune valeur de la base.

Périmètre : circuit court renforcé. Contrôlés : section 6 (`#cordage-neuf` / `#new-strings`), entrée de sommaire, 7e question de FAQ visible, 5 sources ajoutées, ligne de transparence ajoutée, figure `schema-detente-cordage-neuf-{fr,en}.svg` et son script. Pages rouvertes pour ce contrôle : PDF Cross et Bower (texte et figure 3), TWU « Go Dead » partie 1, Ashaway TennisTip9, Wilson (en-de), ersa-international.com, racquettech.com, notice UTS OPUS. F8 (Tennis Warehouse) et F14 (manuel Gamma) : relus au dossier du même jour, non rouverts.

### Affirmations

| # | Phrase de l'article (FR · EN) | Fait n° | Conforme | Correction demandée |
|---|---|---|---|---|
| A1 | Chapeau : détente normale, très rapide d'abord puis de plus en plus lente · idem | F1, F2, F3, F5 | oui | — |
| A2 | Chapeau : « Aucune source primaire que nous ayons trouvée ne le recommande ni ne donne de barème » · idem | F20 | oui | — |
| A3 | Chapeau : « les deux équipes qui l'ont mesurée en laboratoire, TWU et celle de Cross et Bower, jugent qu'elle compte peu » · « the two teams that measured this loss… consider that it matters little » | F13 ; F12 (portée) | **non** | **C2** : la phrase de Cross et Bower vise la chute *pendant la pose*, pas la détente qui suit |
| A4 | Trois tensions (demandée, mesurée, fermeté du tamis) · idem | F4, F27, F30 | oui | — |
| A5 | Pendant la pose : ≈ 30 % (nylon), ≈ 40 % (polyester), quatre causes ; étude 2001, *Sports Engineering* · idem | F4 (PDF rouvert : Conclusions) | oui, sauf noms | **C5** (« Rob Bower ») |
| A6 | Banc : 28,0 → 24,8 kg à 1 000 s (≈ 17 min) → 21,9 kg à 3 jours ; 18 → 15,86 → 14 kg ; « un peu plus de 11 % », « environ 22 % » ; linéaire en log après 100 s ; « dix fois plus longtemps pour perdre à nouveau autant » · EN, mêmes valeurs + conversions lb (62, 55, 48, 40, 35, 31 lb : recalculées, justes à la livre) | F5 (PDF rouvert, p. 169) | oui | — (calculs : −11,4 % / −11,9 % ; −21,8 % / −22,2 % ; 1 000 s = 16,7 min ; la conséquence « ×10 » découle de la linéarité en log t) |
| A7 | Figure : six points de F5, départ à 10 s, plein après 1 000 s, pointillé avant ; légende « corde seule… pas une raquette » · idem (« in kg as published ») | F5 + figure 3 du PDF | oui | — (voir réponse Q-4) |
| A8 | Ashaway : « trois raquettes identiques cordées à 60 lb (environ 27 kg) ont perdu environ 13 % de tension en deux jours, en polyester comme en synthétique » · idem EN | F7 (page rouverte) | **non** | **C1** : le troisième (MonoGut ZX) a perdu 9,5 % ; la phrase prête 13 % aux trois |
| A9 | USRSA : « sur un même cadre cordé à 60 lb, la raideur du tamis a baissé de 6 à 9 % en 24 heures selon le cordage » · « on the same frame » | F8 | à préciser | **C8** (mineure) : un même *modèle* de cadre, une pose par cordage |
| A10 | « Ce que TWU, Cross et Bower et l'USRSA établissent ensemble, c'est le sens : … puis elle ralentit sans s'arrêter » · idem | F1-F3, F5, F6 ; F8 n'a que deux points | **non** | **C3** : l'USRSA ne mesure pas le ralentissement (rectificatif au §2) |
| A11 | « Au 21 novembre 2026, … aucune règle publiée … rien chez TWU, … manuel de machine, … fabricants de cordages lus » · idem | F20, F14, F15, F18, F19 | oui | — |
| A12 | « Aucune page de l'USRSA ni de l'ERSA, les associations de cordeurs » · « the stringers' associations » | F20 ; développé ERSA (Q-4) | à préciser | **C6** |
| A13 | Cross et Bower : « une chute de tension constante n'a pas de réelle conséquence… » · idem | F12 | **non** (portée) | **C2** |
| A14 | TWU : « ne compte pas tant que ça » ; la sensation au début du jeu, et combien de temps elle dure · idem | F13 (page rouverte : « how long the string maintains that feel ») | oui | — |
| A15 | « vous jouez toujours sur un tamis qui a déjà perdu une partie de sa consigne : la tension qui vous convient en tient donc déjà compte » ; revoir la consigne au prochain recordage · idem | F12, F13 (raisonnement du site, présenté comme tel) | oui | — |
| A16 | Distinction avec le cordage qui vieillit (FAQ) · idem | FAQ existante ; F12-F13 non fusionnés | oui | — |
| A17 | Wilson : polyester ≈ 1 kg (2 lb) plus bas que le nylon, pour sa raideur ; rien sur la perte · idem | F18 (page rouverte) | oui | — |
| A18 | « Pré-étirer, c'est tirer la corde au-delà de la consigne pendant la pose, la relâcher, puis revenir à la consigne » · idem | F14 (fonction machine) ; F15, F17 (pré-étirage hors machine) | à préciser | **C10** (mineure) : définition limitée à la fonction machine |
| A19 | Gamma 8800 ELS : 10 ou 20 % au-dessus, décrite sans recommandation · idem | F14 | oui | — |
| A20 | Pré-étirage : effet établi en sens seulement (Cross et Bower), ampleur non mesurée · idem | F11 (PDF rouvert) | oui | — |
| A21 | Laboratoire : le polyester perd plus, et plus vite, que le nylon (banc TWU, échantillons Cross et Bower) ; le tableau de la section 5 le montre en tendance · idem | F21, F22, F25 ; tableau publié | oui | — |
| A22 | « Sur raquette et sur les premières heures, les deux seuls essais… » · « over the first hours » | F7 (2 jours), F8 (24 h) | à préciser | **C9** (mineure) : 24 à 48 h, pas « les premières heures » |
| A23 | Ashaway 13 % / 13 % ; USRSA 6 % (polyester) contre 9 % (multifilament, synthétique) ; une raquette par cordage ; Ashaway fabrique le 3e cordage ; l'appareil lit une raideur · idem | F7, F8, F26 | oui | — |
| A24 | « aucune ne compare un multifilament à un polyester, sous un protocole publié, sur les premières heures » · idem | F26 | **non** | **C4** : contredit le paragraphe précédent (l'essai USRSA compare bien un multifilament et un polyester sous un protocole publié) |
| A25 | « TWU range les multifilaments avec les nylons dans sa base » · idem | F24 | oui | — |
| A26 | Fermeté du tamis : TWU (baisse avec la tension ; la raideur résultante compte) ; Cross et Bower (paramètre important = raideur du tamis) · idem | F27, F28, F30 (PDF rouvert) | oui | — |
| A27 | RCS calculé sur la tension demandée, sans terme de détente, aucune conversion ; paliers « Très confortable » < 20 … « Très ferme » ≥ 35 · « Very Comfortable » / « Very Firm » | F31 ; relu ce jour : `calculateRCS` (l. 3798), `getStringRecommendation` (l. 3818), `src/lib/i18n/configurator.ts` l. 214 et 218 | oui | — |
| A28 | Renvoi santé (« Si une douleur au coude ou au poignet persiste, consultez un professionnel de santé ») · idem | charte F7 | oui | — |
| A29 | Lien configurateur `/configurator` · `/en/configurator` | brief §1 | oui | — |
| A30 | FAQ ajoutée : « Pour Cross et Bower comme pour TWU, cette perte compte peu » · « For Cross and Bower, as for TWU, this loss matters little » | F12 (portée), F13 | **non** | **C2** (et report dans la FAQPage du `<head>`) |
| A31 | Sources : titre « Measurements of string tension in a tennis racket », *Sports Engineering* 4, 2001, p. 165-175 · idem | PDF p. 165 | oui | — |
| A32 | Sources : « Ashaway — Tennis Tip » ; « Wilson — blog, choix de la tension du cordage » · « Ashaway: Tennis Tip » ; « Wilson blog: choosing your string tension » | pages rouvertes | **non** | **C7** |
| A33 | Transparence : mesures non comparables ; une raquette par cordage ; Ashaway vend l'un des cordages ; rien trouvé au 21/11/2026 · idem | F7, F8, F20, F11 | oui | — |

**Fidélité EN / FR** : mêmes faits, même ordre, mêmes réserves. Ajouts EN admis (charte §5) : conversions en livres avant les kilos, « in kg as published » dans la légende. Aucune perte détectée. Les corrections C1 à C10 valent pour les deux langues.

**Règles hors script** : F5 sans objet (aucune note du site) ; F6 conforme (aucune métadonnée interne) ; F7 conforme (aucun effet santé, palier par l'indice, renvoi vers un professionnel) ; F11 conforme (« Au 21 novembre 2026 », Wilson daté, essais « non datés »).

### Corrections pour `tsa-redacteur` (avant → après)

**C1 — Ashaway, trois raquettes (bloquante).** F7 : « The polyester and synthetic gut both lost about 13% during this period, while the MonoGut ZX lost 9.5%. »
- FR : « trois raquettes identiques cordées à 60&nbsp;lb (environ 27&nbsp;kg) ont perdu environ 13&nbsp;% de tension en deux jours, en polyester comme en synthétique. » → « trois raquettes identiques cordées à 60&nbsp;lb (environ 27&nbsp;kg)&nbsp;; en deux jours, le polyester et le synthétique ont perdu chacun environ 13&nbsp;% de tension, le troisième cordage, fabriqué par Ashaway, 9,5&nbsp;%. »
- EN : « three identical racquets strung at 60 lb (about 27 kg) lost about 13% of their tension in two days, with polyester and with synthetic gut alike. » → « three identical racquets strung at 60 lb (about 27 kg): over two days, the polyester and the synthetic gut each lost about 13% of their tension, and the third string, made by Ashaway, 9.5%. »

**C2 — portée de Cross et Bower (bloquante).** PDF, « Discussion » : « Provided that the tension is lower by a consistent amount, then the drop in tension during the stringing process is of no real consequence to a player ». Seul TWU parle de la perte qui suit la pose (F13).
- FR chapeau : « et les deux équipes qui l'ont mesurée en laboratoire, TWU et celle de Cross et Bower, jugent qu'elle compte peu, puisque c'est vous qui choisissez votre tension. » → « TWU, qui l'a mesurée en laboratoire, juge qu'elle compte peu, et Cross et Bower en disent autant de la chute de tension pendant la pose, si elle reste constante&nbsp;: c'est vous qui choisissez votre tension. »
- EN chapeau : « and the two teams that measured this loss in the lab, TWU and Cross and Bower, consider that it matters little, because you choose your own tension. » → « TWU, which measured this loss in the lab, considers that it matters little, and Cross and Bower say the same of the drop during stringing, as long as it is consistent: you choose your own tension. »
- FR : « Les deux équipes qui l'ont mesurée en laboratoire vont même dans l'autre sens. Pour Cross et Bower, une chute de tension constante n'a pas de réelle conséquence pour le joueur, puisqu'il peut demander la consigne qu'il préfère&nbsp;; elle ne pose problème que si elle n'est pas constante. » → « Les deux équipes de laboratoire vont même dans l'autre sens. Pour Cross et Bower, la chute de tension pendant la pose n'a pas de réelle conséquence pour le joueur si elle est constante, puisqu'il peut demander la consigne qu'il préfère&nbsp;; elle ne pose problème que si elle ne l'est pas. »
- EN : « The two teams that measured the loss in the lab point the other way. For Cross and Bower, a constant drop in tension has no real consequence for the player, who can ask for whatever reference tension they prefer; it's only a problem if it isn't constant. » → « The two lab teams point the other way. For Cross and Bower, the drop in tension during stringing has no real consequence for the player as long as it is consistent, since the player can ask for whatever reference tension they prefer; it's only a problem if it isn't consistent. »
- FAQ FR (visible **et** FAQPage du `<head>`) : « Pour Cross et Bower comme pour TWU, cette perte compte peu&nbsp;: » → « Pour TWU, cette perte compte peu, et Cross et Bower en disent autant de la chute pendant la pose si elle est constante&nbsp;: »
- FAQ EN (visible **et** FAQPage) : « For Cross and Bower, as for TWU, this loss matters little: » → « TWU says this loss matters little, and Cross and Bower say the same of the drop during stringing if it is consistent: »

**C3 — « établissent ensemble » (bloquante).** F8 n'a que deux points (pose, 24 h).
- FR : « Ce que TWU, Cross et Bower et l'USRSA établissent ensemble, c'est le sens&nbsp;: la perte est la plus rapide à la pose et dans les heures qui suivent, puis elle ralentit sans s'arrêter. » → « Ce que TWU et Cross et Bower établissent, c'est le sens&nbsp;: la perte est la plus rapide à la pose et dans les heures qui suivent, puis elle ralentit sans s'arrêter. L'essai de l'USRSA confirme qu'une part se perd dès les premières 24&nbsp;heures, sans jouer. »
- EN : « What TWU, Cross and Bower and the USRSA establish together is the direction: the loss is fastest during stringing and in the hours after, then slows without ever stopping. » → « What TWU and Cross and Bower establish is the direction: the loss is fastest during stringing and in the hours after, then slows without ever stopping. The USRSA test confirms that some of it goes in the first 24 hours, unplayed. »

**C4 — contradiction multifilament (bloquante).** Le paragraphe précédent cite l'essai USRSA, qui compare un polyester et un multifilament sur le même modèle de cadre, à 60 lb, machine à tirage constant (F8).
- FR : « aucune ne compare un multifilament à un polyester, sous un protocole publié, sur les premières heures. » → « aucune ne compare multifilament et polyester sur plus d'une raquette par cordage, en tension mesurée, sur les premières heures. »
- EN : « none compares a multifilament with a polyester, under a published protocol, over the first hours. » → « none compares multifilament and polyester on more than one racquet per string, in measured tension, over the first hours. »

**C5 — prénom de Bower (bloquante, règle 3).** « Rob » introuvable (Q-4).
- FR : « Selon une étude de Rod Cross et Rob Bower publiée en 2001 » → « Selon une étude de R. Cross et R. Bower publiée en 2001 »
- EN : « According to a study by Rod Cross and Rob Bower published in 2001 » → « According to a study by R. Cross and R. Bower published in 2001 »
- `citation` FR et EN (`tsa-acquisition`) : `"author": "Rod Cross, Rob Bower"` → `"author": "R. Cross, R. Bower"`.
- Hors périmètre, signalé : même forme « Rob Bower » dans `public/blog/comparer-deux-montages-cordage-tension.html` et `public/en/blog/compare-two-string-setups-same-tension.html`, à corriger lors de leur prochaine modification.

**C6 — ERSA (mineure).**
- FR : « Aucune page de l'USRSA ni de l'ERSA, les associations de cordeurs, n'a pu être trouvée » → « Aucune page de l'USRSA ni de l'ERSA, les associations américaine et européenne de cordeurs, n'a pu être trouvée »
- EN : « from the USRSA or the ERSA, the stringers' associations, on the question » → « from the USRSA or the ERSA, its European counterpart, on the question »

**C7 — libellés des sources (mineure ; corps et `citation`).**
- FR : « Ashaway — Tennis Tip » → « Ashaway — S. Crandall, The Art of Selecting a Monofilament String: Perception versus Reality » (et retirer « S. Crandall » de la parenthèse : « (non daté) ») ; EN : « Ashaway: Tennis Tip » → « Ashaway: S. Crandall, The Art of Selecting a Monofilament String: Perception versus Reality » (« (undated) »).
- FR : « Wilson — blog, choix de la tension du cordage » → « Wilson — What String Tension Should I Use in My Tennis Racket? » ; EN : « Wilson blog: choosing your string tension » → « Wilson: What String Tension Should I Use in My Tennis Racket? »
- `citation` FR et EN : `"name": "Tennis Tip"` → `"name": "The Art of Selecting a Monofilament String: Perception versus Reality"` ; nom Wilson → `"What String Tension Should I Use in My Tennis Racket?"`.

**C8 — même cadre (mineure).** FR « sur un même cadre cordé à 60&nbsp;lb » → « sur un même modèle de cadre cordé à 60&nbsp;lb » ; EN « on the same frame strung at 60 lb » → « on the same frame model strung at 60 lb ».

**C9 — fenêtre des essais (mineure).** FR « Sur raquette et sur les premières heures, les deux seuls essais trouvés » → « Sur raquette, sur les 24 à 48 premières heures, les deux seuls essais trouvés » ; EN « On racquets and over the first hours, the only two tests we found » → « On racquets, over the first 24 to 48 hours, the only two tests we found ».

**C10 — définition du pré-étirage (mineure).** FR « Pré-étirer, c'est tirer la corde » → « Sur une machine, pré-étirer, c'est tirer la corde » ; EN « Pre-stretching means pulling the string » → « On a machine, pre-stretching means pulling the string ». Motif : le pré-étirage se pratique aussi hors machine (F15, F17).

### Test de glissance

| Affirmation contestable | Par qui (fabricant · cordeur · médecin) | Défense (fait n°) ou « sans défense » |
|---|---|---|
| La détente initiale est normale, pas un défaut | fabricant, cordeur | F1, F2, F3, F5, F9 |
| Aucune règle « +x kg » / « +x % » de compensation publiée (au 21/11/2026) | cordeur (« on ajoute toujours 1 à 2 kg ») | F20 : introuvable ; la seule trace (Tennis Express) est refusée en 403 ; l'article ne dit pas que la pratique n'existe pas, seulement qu'aucune règle publiée n'a été trouvée |
| La perte compte peu, la consigne est un choix | cordeur | F13 (TWU, perte préliminaire) ; F12 seulement pour la chute pendant la pose → **après C2** |
| Pas d'addition de 40 % + 13 % | — | conforme : l'article l'interdit explicitement (F4, F5, F7, F8, protocoles différents) |
| Les chiffres du banc (28,0 → 24,8 → 21,9 kg) | cordeur (« ce n'est pas une raquette ») | F5 ; légende et texte disent « corde seule, pas une raquette » |
| Ashaway : 13 % pour polyester et synthétique | fabricant concurrent | F7 ; essai d'un fabricant, une raquette par cordage, dit dans le texte et la transparence ; **la phrase des « trois raquettes » doit suivre C1** |
| USRSA : 6 % contre 9 % | fabricant (Tourna, Head) | F8 ; raideur RDC, une pose par cordage, dit dans le texte ; aucun verdict produit tiré |
| Polyester contre multifilament : divergence non tranchée | fabricant, cordeur | F21, F22, F24, F26 ; protocole dit pour chaque source ; **la phrase de clôture doit suivre C4** |
| Le sens (rapide puis lent) établi par plusieurs sources | — | F1-F3, F5, F6 ; **sans défense pour l'USRSA → C3** |
| Le pré-étirage ralentit la perte, ampleur inconnue | fabricant de machines | F11 (sens), « Introuvable » (ampleur) ; aucune recommandation prêtée à Gamma (F14) |
| Wilson : polyester 1 kg plus bas, pour la raideur | fabricant | F18 ; motif fidèle à la page |
| L'indice RCS est calculé sur la consigne ; aucune conversion perte → points ; aucune phrase « la perte fait baisser l'indice » | — | F31 ; conforme |
| Effet santé | médecin | aucun : pas d'effet prêté au matériel, pas de condition de santé, renvoi vers un professionnel si la douleur persiste (charte F7) |
| « Rob Bower » | lecteur, auteur | **sans défense → C5** |

### Verdict

**Corrections demandées : 10** (C1 à C5 bloquantes, C6 à C10 mineures), FR et EN, plus le report de C2 (FAQ), C5 et C7 dans le JSON-LD par `tsa-acquisition`. Figure conforme (départ à 10 s justifié, voir Q-4). `redaction:valeurs` : 0 valeur, 0 écart, sortie 0. Aucun effet santé, aucune règle « +x kg », aucune addition de chiffres, aucune conversion perte → indice.

---

## 6. Revue SEO — `tsa-acquisition`

### Contrôle on-page

- [x] **title** FR et EN : inchangés. Motif : l'intention principale de la page reste « quand changer son cordage / how long do strings last » ; la nouvelle section est une sous-question. Les deux titles dépassent déjà 60 caractères (78 et 82, préexistant) : y ajouter la détente les allongerait encore. Slugs et H1 inchangés.
- [x] **meta description** FR et EN réécrites (et `description` du BlogPosting alignée) : la requête « cordage neuf qui perd sa tension » / « new strings losing tension » y entre, la requête principale reste en tête, et la longueur passe sous 155 (147 FR, 150 EN ; 196 et 197 avant, tronquées en SERP). Elles ne promettent que ce que la section tient (« ce qu'il faut faire » = rien à la pose, revoir la consigne au prochain recordage).
  - FR : `Quand changer son cordage de tennis : deux pannes mesurées par TWU, le diagnostic par symptôme, et le cordage neuf qui perd sa tension dès la pose.`
  - EN : `When to restring tennis strings: two opposite failures measured by TWU, diagnosed by symptom, and what to do when new strings lose tension right away.`
- [x] **og / twitter** : inchangés (texte de partage, centré sur le diagnostic, toujours exact).
- [x] **keywords** (meta et BlogPosting) : + « cordage neuf qui perd sa tension » / « new strings losing tension » (une expression, pas de bourrage).
- [x] canonical ; hreflang réciproques FR/EN et `x-default` vers le FR : inchangés, conformes (valeurs `fr` / `en`, convention du site).
- [x] JSON-LD : `dateModified` 2026-11-21 (posé par le rédacteur) ; Breadcrumb inchangé ; **FAQPage** : 7e question ajoutée, FR et EN, mot pour mot celle de la FAQ visible (`audit:jsonld` : 149 questions, toutes présentes en entier dans le texte visible).
- [x] **`citation`** : + 6 sources du corps, FR et EN — Cross et Bower 2001 (`ScholarlyArticle`, même forme que dans les articles existants), Ashaway Tennis Tip, les 2 essais USRSA chez Tennis Warehouse, le manuel Gamma 8800 ELS, Wilson. Noms neutres pour Ashaway et Wilson (le dossier ne donne que l'URL, Q-4). **Dépendance Q-4** : si le pigiste corrige le titre de l'étude ou les prénoms « Rod Cross, Rob Bower », je reporte la correction dans `citation` (FR et EN).
- [x] og:image et twitter:image : couverture inchangée, 1200 × 630 déclarés, `og:image:alt` présent.
- [x] **index du blog** : temps de lecture alignés sur l'article (FR 13 → 19 min, EN 12 → 18 min) ; résumé et titre inchangés. **Sitemap** : `modified` 2026-11-21 pour les deux slugs (`audit:jsonld` passe de 2 ECHEC à 0, sitemap construit compris).
- [x] **Liens `/en/configurator.html` dans mes zones** : en-tête (l. 149) et pied de page (l. 681) → `/en/configurator`.
- [x] maillage : lien vers le configurateur dans le corps, FR (`/configurator`, l. 547 et 589) et EN (`/en/configurator`, l. 512) ; liens entrants existants depuis le guide des tensions et le comparatif de montages (FR et EN), vers la page, sans ancre de section (voir P2).
- [x] `audit:blog-funnel` (0 échec, 1 AVERT sur un autre article) et `audit:blog-images` (conforme, 11 AVERT sur d'autres articles) verts.
- **Cannibalisation** : le guide des tensions porte déjà la FAQ « Combien de tension un cordage perd-il juste après la pose ? ». Pas de doublon : le guide répond « combien », la nouvelle section répond « faut-il compenser ». Les deux pages se complètent ; P2 les relie.

### Propositions au rédacteur

| # | Où | Proposition | Motif SEO | Réponse du rédacteur |
|---|---|---|---|---|
| P1 | EN, bloc CTA de fin (`<section>` après `</article>`, l. 650 : « ⚙️ Open the Configurator ») | `href="/en/configurator.html"` → `href="/en/configurator"`. Je l'ai laissé : zone de page hors `<head>`, en-tête et pied, que tu avais toi-même listée. Aucun autre `/en/configurator.html` dans l'article (l. 149 et 681 corrigées par moi). | Règle A3 du prompt : ne plus écrire l'ancienne URL ; un 301 en moins sur le CTA principal de la page. |  **Acceptée** (21/11) : CTA EN pointé vers `/en/configurator`. Plus aucun `/en/configurator.html` dans l'article. |
| P2 | FR `guide-tension-cordage-tennis.html` l. 375 ; EN `tennis-string-tension-guide.html` l. 313 (renvois « Détail cordage par cordage » / « String-by-string figures ») | Ajouter, à la suite, un renvoi vers la section : FR « Faut-il corder plus tendu pour compenser&nbsp;? Voir <a href="/blog/combien-de-temps-dure-un-cordage.html#cordage-neuf">cordage neuf qui perd de la tension</a>. » ; EN « Should you string tighter to compensate? See <a href="/en/blog/how-long-do-tennis-strings-last.html#new-strings">new strings losing tension</a>. » | Le guide est la page FR la plus lue du blog et parle déjà de la détente après la pose : un lien ancré transmet la question exacte à la section qui y répond. Circuit court : à faire dans cette PR si tu l'acceptes, sinon plus tard. |  **Acceptée** (21/11), texte repris mot pour mot, à la suite du renvoi existant, FR l. 375 et EN l. 313, même classe de lien que le renvoi voisin. Aucun chiffre changé : date du guide inchangée (F11). |

**Point de vigilance (non bloquant)** : la FAQPage du `<head>` reprend mot pour mot les sept réponses visibles. Toute retouche du texte d'une question ou d'une réponse de la FAQ en passe finale doit m'être signalée (ou reportée dans le JSON-LD) : `audit:jsonld` échoue sinon.

`RELAIS → tsa-redacteur` (P1, P2 ; puis passe finale).

### Vérification en production (après fusion)

- …

---

## 7. Journal

- 2026-11-21 · `tsa-pigiste` — étape 2, dossier de faits. Relus : prompt `tsa-pigiste`, `CLAUDE.md` §4 et §5 ter, `CHARTE.md` v1.2, `README.md`, les articles FR et EN (sources déjà citées : TWU « Go Dead » 1 et 2, « String Stiffness », « Compare Strings », base TWU, Tecnifibre), et les dossiers `guide-tension-cordage-tennis` et `comparer-deux-montages-cordage-tension` pour ne pas doublonner. 31 lignes au §2 : 27 confirmés (dont F7, F9, F14, F15, F18, F19 comme documentation ou avis de fabricant), 1 divergent entre sources (F26), 1 introuvable (F20), 2 signaux (F16, F17). Pages ouvertes le 21/11 : 18 (TWU ×4, PDF Cross et Bower, Ashaway ×2, Tennis Warehouse ×2, manualsdir, manualslib, Luxilon, Racketpedia, RacquetQuest ×3 dont une catégorie, Wilson, Tecnifibre). Règles d'hôte vérifiées avant toute requête (User-Agent d'agent automatisé) : `robots.txt` lu sur chaque hôte ; `agents.md` et `llms.txt` : absents sauf Tecnifibre et Wilson (instructions d'achat pour agents, consignées, non exécutées) et luxilon.be (page HTML générique). Refus et abandons : Tennis Express 403 (F9 de la charte, aucune nouvelle tentative) ; manualmachine.com 403 ; manualshive.com interdit par robots.txt (non requêté) ; PDF Babolat Evolution Tour 404 à l'adresse trouvée par moteur (aucune autre adresse essayée) ; page Wilson en-gb 404 (version en-de trouvée par moteur, ouverte). Médianes TWU recalculées sur le fichier brut local dont l'empreinte SHA-256 égale celle du relevé versionné. Aucune valeur produit de la base citée : `redaction:valeurs` sans objet à cette étape. RELAIS → `tsa-redacteur`.
- 2026-11-21 · `tsa-redacteur` — étapes 3, 6 et 7 (circuit court renforcé). Relus : prompt `tsa-redacteur`, `CLAUDE.md` §4, §5, §5 ter, §6, `CHARTE.md` v1.2, `README.md`, §1 à §4 du dossier, les deux articles, et pour cohérence `comparer-deux-montages-cordage-tension` (FR/EN) et `cordage-terre-battue` / `tennis-strings-for-clay-courts` (aucune contradiction : le « ≈ 30 % plus bas juste après la pose » de l'article EN de comparaison est F4). **Plan** : nouvelle section 6 `#cordage-neuf` / `#new-strings`, insérée après la section « repos » (anciennes sections 6 et 7 renumérotées 7 et 8) : réponse en deux phrases ; trois tensions (demandée, mesurée, fermeté du tamis) ; trois moments qui ne s'additionnent pas (pose F4 ; corde seule F5 + figure I2 ; raquette au repos F7, F8) ; compensation introuvable (F20, F12, F13, F18), articulée avec la FAQ « vieillissement » sans la fusionner ; pré-étirage, sens seulement (F11, F14) ; polyester / multifilament avec protocole et divergence dite (F21, F22, F24, F26) ; fermeté du tamis et indice RCS calculé sur la tension demandée (F27, F28, F30, F31), paliers, renvoi santé ; lien `/configurator` (EN `/en/configurator`) en fin de section. Faits non employés délibérément : F1 (déjà cité plus haut dans l'article), F6, F9 (unité DT à expliquer), F10, F15-F17 (signaux ou un seul produit), F19 (pratique des pros : source unique, déjà publiée, rien ajouté), médianes F24 (date de relevé différente de celle du tableau publié). Longueur de la section : environ 1 460 mots FR, 1 330 mots EN. Ajouts associés : entrée de sommaire, entrée de FAQ visible (FR/EN), 5 sources, 1 ligne de transparence, date visible et `dateModified` au 21/11/2026, temps de lecture 19 min (FR) / 18 min (EN). Visuel I2 généré par script ; les deux articles sortent de `scripts/qa-blog-images.exceptions.json` (visuel de corps présent). Aucune valeur produit de la base citée. **Contrôles** : `audit:blog-images` conforme (11 AVERT, toutes d'autres articles) ; `audit:blog-funnel` intact (1 AVERT, autre article) ; `audit:comptages` conforme (0 échec, 2 AVERT préexistants) ; `audit:contrast` toutes paires AA ; `audit:claims` aucun motif sur les deux articles ; `npm run build` compilé, 328/328 pages ; `redaction:valeurs` 0 valeur, 0 écart ; aucun « À SOURCER » ; **`audit:jsonld` NON CONFORME, 2 ECHEC** : `sitemap.ts` l. 76 et 122 déclarent `2026-10-23` (Q-3, à `tsa-acquisition`). Rendu Playwright (Chrome, `next start` port 3100, arrêté par PID) FR 1280/390 clair et sombre, EN 1280/390 (page EN sans thème sombre) : figure chargée, lisible en sombre ; débordement de 7 px à 390 px sur la page FR dû à la barre de navigation de l'en-tête (préexistant, hors section). RELAIS → `tsa-pigiste` (fact-check des valeurs touchées, Q-4) et `tsa-acquisition` (Q-3).
- 2026-11-21 · `tsa-acquisition` — étape 4b, passe on-page (Q-3 soldée). Relus : prompt `tsa-acquisition`, `CLAUDE.md` §5, §5 ter, §6, `README.md`, §1 et §4 du dossier, `<head>` et FAQ visibles des deux articles, index FR/EN, `sitemap.ts`. **Changé** : `sitemap.ts` (2 dates `modified` → 2026-11-21) ; FR et EN : meta description et `description` BlogPosting réécrites (≤ 155), keywords (+1 expression), FAQPage (+1 question, mot pour mot), `citation` (+6 sources) ; EN : liens en-tête et pied → `/en/configurator` ; index FR/EN : temps de lecture 19 / 18 min. Title, og, twitter, canonical, hreflang inchangés (motifs au §6). **Contrôles** : `audit:jsonld` conforme, 0 échec, 0 AVERT (après build : sitemap construit, 36 lastmod justes) ; `audit:blog-funnel` 0 échec, 1 AVERT (autre article) ; `audit:comptages` conforme, 0 échec, 0 AVERT ; `audit:blog-images` conforme (11 AVERT, autres articles) ; `npm run build` compilé, 328/328 pages. 2 propositions au rédacteur (P1 CTA EN, P2 maillage ancré depuis le guide des tensions). Dépendance Q-4 notée (titre et auteurs de Cross et Bower dans `citation`). RELAIS → `tsa-redacteur`.
- 2026-11-21 · `tsa-pigiste` — étape 4, fact-check ciblé (circuit court renforcé) de la section 6, de la FAQ ajoutée, des 5 sources, de la ligne de transparence et de la figure I2, FR et EN, à la tête `714eb0f` (`git pull` : passe on-page de `tsa-acquisition` incluse). Relus : prompt `tsa-pigiste`, `CHARTE.md` v1.2, `README.md`, dossier §1-§4 et §6. Pages ouvertes ce jour, règles d'hôte lues avant chaque requête (`robots.txt`, `agents.md`, `llms.txt`) : PDF Cross et Bower (texte et figure 3 rendue en image), TWU « Go Dead » partie 1, Ashaway TennisTip9, Wilson en-de (`agents.md` / `llms.txt` : instructions d'achat pour agents, consignées, non exécutées), ersa-international.com (`crawl-delay: 60` respecté avant la page d'accueil), racquettech.com, notice UTS OPUS (`crawl-delay: 5`) ; tenniseurope.org lu sans résultat utile. Aucun refus d'accès. Base relue : `calculateRCS`, `getStringRecommendation`, `ARM_ALERT_RCS`, libellés EN des paliers. `redaction:valeurs` : 0 valeur, 0 écart, sortie 0. **Résultat** : 33 affirmations, 24 conformes ; **10 corrections** (C1-C5 bloquantes : Ashaway « trois raquettes à 13 % », portée de la phrase de Cross et Bower limitée à la chute pendant la pose, USRSA retiré du « sens établi », contradiction multifilament, « Rob Bower » introuvable ; C6-C10 mineures : ERSA, libellés de sources, modèle de cadre, fenêtre 24-48 h, définition du pré-étirage). Figure conforme, départ à 10 s justifié. Q-4 répondue. Rectificatifs dans mes sections : synthèse Q1 (USRSA) et F12 (portée). EN fidèle au FR. RELAIS → `tsa-redacteur` (C1-C10, FR et EN) ; → `tsa-acquisition` (reporter C2 dans la FAQPage, C5 et C7 dans `citation`, FR et EN).
- 2026-11-21 · `tsa-redacteur` — étape 5, passe finale (après `git pull` : `eb37087` fact-check, `714eb0f` passe on-page). **Fact-check soldé, aucune contestation** : C1 à C10 appliquées mot pour mot, FR et EN, dans le corps seulement (C2 en trois endroits : chapeau, « Faut-il corder plus tendu », FAQ visible). **SEO** : P1 et P2 acceptées (§6). Le `<head>` est intact : le texte de la FAQPage et les formes de `citation` sont au §4, Q-5. Section ensuite : environ 1 480 mots FR, 1 350 mots EN. **Contrôles** : `audit:blog-images` conforme (11 AVERT, toutes d'autres articles) ; `audit:blog-funnel` intact (1 AVERT, autre article) ; `audit:comptages` conforme, 0 échec, 0 avertissement ; `audit:claims` conforme, 0 échec, 10 AVERT, aucun sur les articles touchés ; `npm run build` compilé, 328/328 pages ; `audit:jsonld` NON CONFORME, 2 ECHEC, attendus : la question 7 de la FAQPage n'a pas encore reçu le texte C2 (Q-5). Rendu Playwright à 390 px : FR en clair et en sombre, EN en clair. Aucune ressource en erreur, figure chargée ; à 390 px, le débordement de 7 px de l'en-tête FR existait déjà. RELAIS → `tsa-acquisition` (Q-5).
