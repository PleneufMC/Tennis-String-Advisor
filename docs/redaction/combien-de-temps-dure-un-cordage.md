# Cordage neuf qui perd sa tension dès les premières heures : est-ce normal, faut-il le corder plus tendu ?

| Champ | Valeur |
|---|---|
| Slug FR / EN | `combien-de-temps-dure-un-cordage` / `how-long-do-tennis-strings-last` (articles existants, slugs inchangés) |
| Circuit | court renforcé : mise à jour d'un article existant (section nouvelle), voir §1 |
| Branche | `agent/redaction/combien-de-temps-dure-un-cordage` |
| Ouvert le | 2026-11-21, par l'orchestrateur |
| Demande d'origine | Pierre, 21/11/2026 : « merci de lancer la rédaction d'un article sur ce thème », ligne du plan éditorial 2026-W46-1 (« Cordage neuf qui perd sa tension dès les premières heures : est-ce normal, et faut-il le corder plus tendu ? », type : mise à jour d'un article existant, score 3,78, circuit court) |
| Statut | faits |
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
| F12 | Une chute de tension constante n'a « pas de réelle conséquence » pour le joueur, qui choisit la consigne qu'il préfère ; elle ne pose problème que si elle n'est pas constante | qualitatif | MÉD (idem F4, « Discussion ») | idem F4 | 2026-11-21 | « players can specify whatever pull tension they prefer. » | F13 | — | confirmé |
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
| I1 | couverture | — | inchangée : la couverture actuelle de l'article (Jeuwre, Wikimedia Commons, CC0, recadrée) reste en place ; aucune nouvelle recherche (mise à jour d'une section) | — | — | — | — | |
| I2 | corps, nouvelle section | 2 | Schéma ou courbe tracé par script à partir des **seuls** points écrits dans le texte de Cross et Bower (F5) : 28,0 kg → 24,8 kg à 1 000 s → 21,9 kg à 72 h ; 18,0 → 15,86 → 14 kg. Échelle de temps logarithmique (la source dit la décroissance linéaire en log du temps après 100 s). Légende : « corde seule serrée à longueur fixe, pas une raquette ». Variante : schéma en trois étapes « consigne → juste après la pose (≈ −30 % nylon, ≈ −40 % polyester, F4) → heures suivantes (F5-F9) », sans additionner les pourcentages | Tennis String Advisor | — | légende de provenance : « d'après Cross et Bower, *Sports Engineering*, 2001 » | ne pas numériser la figure 3 de l'article (seuls trois points par courbe sont écrits) ; ne pas mêler sur un même axe tension (kg), raideur RDC et DT | |
| I3 | corps | 1 | aucune photo cherchée : une photo n'apprend rien sur la détente ; un schéma (I2) sert mieux le lecteur | — | — | — | — | |

---

## 4. Questions ouvertes

- **Q-1** · de `tsa-pigiste` à l'orchestrateur (pour Pierre) · 2026-11-21 — Les manuels de machines Babolat (Star 5, Sensor Dual, Evolution Tour) qui décrivent la fonction « prestretch » n'ont pas pu être ouverts (PDF officiel en 404 ; copies tierces refusées par robots.txt ou en 403). Si l'article doit citer un fabricant de machines au-delà de Gamma (F14), une voie autorisée serait que Pierre demande le manuel au service client Babolat, ou le consulte s'il possède une machine. Le dossier tient sans.
- **Q-2** · de `tsa-pigiste` à `tsa-redacteur` · 2026-11-21 — Pour Q2, le dossier ne permet que « aucune règle de compensation publiée » (F20) et la position de TWU et de Cross et Bower (F12, F13). Toute phrase « certains cordeurs ajoutent 1 à 2 kg » n'a pas de source écrivable (Tennis Express refusé, forums non admis) : à ne pas écrire, même au conditionnel.

---

## 5. Fact-check final — `tsa-pigiste`

### Valeurs produit (contrôle automatique)

Chaque valeur produit affichée par l'article, FR et EN, y compris dans les
tableaux, telle qu'elle est écrite. Champs : voir l'en-tête de
`scripts/redaction/verifier-valeurs.mts`.

```valeurs-produit
# sujet                                   | champ           | valeur citée | où
```

Sortie de `npm run redaction:valeurs -- docs/redaction/<slug-fr>.md` :

```
(coller la sortie)
```

### Affirmations

| # | Phrase de l'article (FR · EN) | Fait n° | Conforme | Correction demandée |
|---|---|---|---|---|

### Test de glissance

| Affirmation contestable | Par qui (fabricant · cordeur · médecin) | Défense (fait n°) ou « sans défense » |
|---|---|---|

---

## 6. Revue SEO — `tsa-acquisition`

### Contrôle on-page

- [ ] title, meta, H1 et slug FR et EN conformes au brief, ou écart motivé
- [ ] canonical ; hreflang réciproques sur la paire FR/EN
- [ ] JSON-LD Article valide (`image`, `datePublished`, `dateModified`) ; Breadcrumb ; FAQPage seulement si une FAQ visible lui correspond
- [ ] og:image et twitter:image en 1200 × 630, avec `og:image:alt`
- [ ] index du blog FR et EN ; sitemap (`BLOG_SLUGS`, `EN_BLOG_SLUGS`)
- [ ] maillage : liens entrants posés, sortants présents, lien vers le configurateur dans le corps (A3)
- [ ] `npm run audit:blog-funnel` et `npm run audit:blog-images` verts

### Propositions au rédacteur

| # | Où | Proposition | Motif SEO | Réponse du rédacteur |
|---|---|---|---|---|

### Vérification en production (après fusion)

- …

---

## 7. Journal

- 2026-11-21 · `tsa-pigiste` — étape 2, dossier de faits. Relus : prompt `tsa-pigiste`, `CLAUDE.md` §4 et §5 ter, `CHARTE.md` v1.2, `README.md`, les articles FR et EN (sources déjà citées : TWU « Go Dead » 1 et 2, « String Stiffness », « Compare Strings », base TWU, Tecnifibre), et les dossiers `guide-tension-cordage-tennis` et `comparer-deux-montages-cordage-tension` pour ne pas doublonner. 31 lignes au §2 : 27 confirmés (dont F7, F9, F14, F15, F18, F19 comme documentation ou avis de fabricant), 1 divergent entre sources (F26), 1 introuvable (F20), 2 signaux (F16, F17). Pages ouvertes le 21/11 : 18 (TWU ×4, PDF Cross et Bower, Ashaway ×2, Tennis Warehouse ×2, manualsdir, manualslib, Luxilon, Racketpedia, RacquetQuest ×3 dont une catégorie, Wilson, Tecnifibre). Règles d'hôte vérifiées avant toute requête (User-Agent d'agent automatisé) : `robots.txt` lu sur chaque hôte ; `agents.md` et `llms.txt` : absents sauf Tecnifibre et Wilson (instructions d'achat pour agents, consignées, non exécutées) et luxilon.be (page HTML générique). Refus et abandons : Tennis Express 403 (F9 de la charte, aucune nouvelle tentative) ; manualmachine.com 403 ; manualshive.com interdit par robots.txt (non requêté) ; PDF Babolat Evolution Tour 404 à l'adresse trouvée par moteur (aucune autre adresse essayée) ; page Wilson en-gb 404 (version en-de trouvée par moteur, ouverte). Médianes TWU recalculées sur le fichier brut local dont l'empreinte SHA-256 égale celle du relevé versionné. Aucune valeur produit de la base citée : `redaction:valeurs` sans objet à cette étape. RELAIS → `tsa-redacteur`.
