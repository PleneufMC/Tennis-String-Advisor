# Charte éditoriale — Tennis String Advisor

> **Version 1.0 — 10 octobre 2026.** Règles communes à la chaîne éditoriale :
> `tsa-pigiste`, `tsa-redacteur`, `tsa-acquisition` et l'orchestrateur. Elles
> sont écrites **ici, une seule fois** ; les prompts des agents y renvoient sans
> les recopier. Le déroulé du travail (qui fait quoi, dans quel ordre) est dans
> [`README.md`](README.md).
>
> **Rang.** Les neuf règles non négociables de `CLAUDE.md` §4 passent avant
> tout ; cette charte les applique au contenu. En cas de conflit, `CLAUDE.md`
> gagne. Toute modification de la charte passe par une PR validée par Pierre ;
> un agent qui découvre une règle manquante la propose dans son rapport.

---

## 1. Ce qu'un article de TSA doit faire

Un article aide un joueur à **choisir** un cordage, une tension ou une raquette
en gardant **son bras** comme premier critère. C'est ce qui distingue TSA des
sites qui notent aussi des cordages : la prévention du tennis elbow, avec un
indice (le RCS) et des seuils publiés.

Trois conséquences :

- un article répond à **une** question, complètement, et ses deux premières
  phrases donnent la réponse ;
- un article qui n'aide pas un joueur à choisir ne se publie pas, même si un
  mot-clé le justifie ;
- chaque article mène au configurateur, à l'endroit où le lecteur en a besoin
  (règle A3, prompt de `tsa-acquisition`).

---

## 2. Les faits

**F1 — Un chiffre produit est celui de la base.** Toute valeur sur une raquette
ou un cordage (RA, poids, tamis, plan, rigidité, note /10, moyenne des testeurs
/20, rang, RCS) est celle de `src/data/`, telle que la fiche du site l'affiche :
même échelle, même unité, même arrondi. Le contrôle est outillé :
`npm run redaction:valeurs -- docs/redaction/<slug>.md` doit sortir en 0 avant
la PR. Une source externe qui contredit la base ne corrige pas l'article :
l'écart est signalé à `tsa-core`, et l'article suit la base ou se tait.

**F2 — On ne compare que des données de même nature.** Un profil dérivé des
specs, un profil combiné avec des avis de testeurs, une mesure de laboratoire,
une valeur constructeur et une note de testeur ne se comparent pas entre eux.
Si l'un des deux produits n'a pas la donnée, pas de verdict chiffré sur ce
point : on écrit qu'elle manque. Une conclusion qui contredit le consensus des
tests publiés est d'abord un **signal d'erreur de méthode**, à instruire avant
publication, pas une révélation.
*Origine : l'article « Gravity MP vs Gravity Tour », retiré le 10/10/2026
(« glissant », selon Pierre), donnait la MP gagnante sur quatre axes sur cinq en
opposant son profil dérivé au profil combiné de la Tour.*

**F3 — Une règle répétée sans source primaire n'est pas un fait.** Une valeur
que tout le monde cite et que personne ne source est notée **introuvable** et
ne s'écrit pas comme un fait.
*Origine : le « +2 kg » pour passer d'un cordage à un autre, introuvable en
octobre 2026, qui bloque l'article sur l'équivalence de tension.*

**F4 — Matériel des pros : « pro stock » n'est pas le modèle du commerce.** Le
cadre d'un joueur professionnel est souvent un modèle ancien ou personnalisé,
peint aux couleurs du modèle courant. Toute affirmation sur le matériel d'un
joueur exige deux sources indépendantes et la mention explicite de cette
réserve ; elle ne reprend jamais les specs de la fiche du commerce.
*Origine : Zverev présenté avec une « Gravity Tour 100 in², 18 × 20 », modèle
qui n'existe pas au catalogue (corrigé le 10/10/2026).*

**F5 — Les testeurs ne sont pas les auteurs des notes du site.** Les notes de
TSA sont une appréciation éditoriale du site. Les trois chaînes de testeurs dont
l'harmonisation s'inspire ne sont **jamais** citées comme auteurs ni comme
source de ces notes. Elles restent citables comme source d'un **fait** (une
mesure, une observation datée d'un test publié).

**F6 — Pas de métadonnée interne d'évaluation dans un article.** Niveau de
confiance, pondérations, nombre d'avis, décalages d'ancrage : rien de cela
n'apparaît dans un article public sans validation de Pierre. Le palier
(S, A, B, C, D) et la moyenne /20, publiés sur `/statistics`, ne sont pas
concernés.
*Origine : colonne « Confiance » retirée des quatre classements le 10/10/2026,
à la demande de Pierre.*

**F7 — La santé d'abord (règle 2).** Jamais « sans danger », « sans risque »,
« idéal pour le coude », ni aucun absolu. Le confort d'un montage se dit par son
**indice RCS** et par les seuils d'alerte du configurateur, relus dans
`src/lib/advanced-rcs.ts` au moment d'écrire (au 10/10/2026 : alerte dès 32
pour un bras sensible, dès 35 sinon). Une allégation médicale (cause,
prévention, traitement d'une épicondylite) exige une source médicale ou une
étude publiée ; à défaut, elle ne s'écrit pas. Tout article qui parle de
douleur conseille de consulter un professionnel de santé si elle persiste.

**F8 — L'affiliation ne pèse sur rien (règle 1).** Ni sur un classement, ni sur
un verdict, ni sur le choix des produits cités. Aucun lien d'affiliation dans
un article sans `tsa-revenue` et sans mention d'affiliation visible.

**F9 — Un refus d'accès est une réponse.** Au premier 403, 406 ou 429, ou à la
première page anti-robot, on s'arrête : pas de nouvelle tentative, pas de
changement d'identité, pas de contournement. On le signale et l'on cherche une
voie autorisée (flux partenaire, autorisation écrite).
*Origine : Tennis Warehouse Europe (406) et Tennis-Point (429), 10/10/2026.*

**F10 — Jamais d'URL devinée (règle 4).** Une source est une page réellement
ouverte, à une adresse trouvée par un lien, un plan du site ou un moteur de
recherche. Un extrait de moteur de recherche n'est pas une source : on ouvre
la page.

**F11 — Une date pour chaque chiffre qui vieillit.** Prix, disponibilité,
matériel d'un joueur, classement : ces faits portent leur date de relevé dans
l'article. Toute mise à jour d'un chiffre change la date de mise à jour visible
et le `dateModified` du JSON-LD.

---

## 3. Le test de glissance

Avant toute PR d'article, le pigiste dresse dans le dossier (section 5) la
liste des affirmations qu'**un fabricant, un cordeur expérimenté ou un
médecin** pourrait contester : chaque verdict, chaque comparaison, chaque
affirmation de santé, chaque chiffre surprenant. En face de chacune, le numéro
du fait qui la défend.

- Une affirmation sans défense est **coupée** par le rédacteur, ou reformulée
  jusqu'à ce que le dossier la soutienne.
- Un article dont le verdict principal ne passe pas le test ne se publie pas :
  le rédacteur le dit à l'orchestrateur, qui le dit à Pierre.

---

## 4. Images

Règle de Pierre du 10/10/2026 : **les articles sont systématiquement assortis
d'images, quitte à les générer.**

**Ce que chaque article porte, en FR comme en EN :**

- une **couverture** : image d'en-tête (`<figure class="tsa-fig tsa-fig--hero">`),
  reprise en `og:image` et `twitter:image` (1200 × 630) et dans le champ `image`
  du JSON-LD ;
- **au moins un visuel dans le corps** qui aide à comprendre : schéma, graphique
  tiré des données du site, photo légendée (`<figure class="tsa-fig">`) ;
- pour chaque visuel :
  - WebP (photo) ou SVG (schéma), avec `width` et `height` explicites ;
  - un `alt` dans la langue de la page, qui décrit ce que l'image montre ;
  - une légende qui dit sa provenance (« Photo : … », « Illustration : … »,
    « Schéma Tennis String Advisor… ») ; celle de la couverture commence par
    « Photo » ou « Illustration » ;
  - une ligne dans `public/blog/images/CREDITS.md` pour tout fichier image
    (un schéma SVG écrit dans la page n'en a pas besoin : sa légende suffit).

**D'où viennent les images, dans cet ordre :**

1. **Photos à licence de réutilisation explicite**, trouvées par le pigiste :
   Wikimedia Commons (CC0, CC BY, CC BY-SA, avec crédit visible, lien de
   licence et mention « recadrée » si l'on recadre), Unsplash et Pexels selon
   leur licence lue (jamais Unsplash+). Page de la photo ouverte, licence lue et
   datée dans le dossier.
2. **Visuels générés par script**, produits par le rédacteur : couvertures,
   schémas de principe, graphiques dont **chaque chiffre vient de la base ou du
   dossier** (`scripts/blog-covers/`, SVG dessinés à la main, thème clair et
   sombre par `public/blog/blog-figures.css`).
3. **Images générées par IA**, seulement si un outil de génération est configuré
   dans le projet **et** si Pierre en a validé le coût. Légende « Illustration
   générée ». *Au 10/10/2026, aucun outil n'est configuré : cette voie est
   fermée.*

**Toujours interdit, quelle que soit la source :**

- une image générée ou retouchée d'un **produit réel**, présentée comme sa
  photo (règle 3) ;
- une **personne réelle identifiable**, a fortiori un joueur nommé ;
- un **logo** ou une marque lisible ;
- une fausse scène présentée comme un reportage ;
- une photo de produit prise sur un site marchand. Seules les photos du
  manifeste `public/images/products/`, déjà associées et vérifiées par
  `tsa-core`, peuvent illustrer un produit, et sous le drapeau
  `PRODUCT_IMAGES_ENABLED`.

**Contrôle.** `npm run audit:blog-images` est bloquant et fait partie de
`audit:all`. Il vérifie la couverture, le partage, le JSON-LD, les `alt`, les
dimensions, les crédits et le visuel de corps. Les articles antérieurs à la
règle et encore sans visuel de corps sont listés dans
`scripts/qa-blog-images.exceptions.json`. Une exception tombe dès que l'article
est modifié.

---

## 5. Langue et typographie

Elles valent pour le texte (rédacteur) comme pour les titres, descriptions et
`alt` (acquisition).

- **FR** :
  - guillemets « » ;
  - espace insécable avant `:` `;` `?` `!`, après « et avant », et entre un
    nombre et son unité (`22&nbsp;kg`, `305&nbsp;g`, `98&nbsp;in²`) ;
  - virgule décimale (13,6) ;
  - plan de cordage écrit « 16 × 19 » dans le texte.
- **EN** :
  - point décimal ;
  - tension en lb suivie des kg entre parenthèses ;
  - « racquet », pas « racket » ;
  - une adaptation au lecteur anglophone, jamais une traduction mot à mot.
- **Produits** : nommés comme dans la base (marque, modèle, variante).
- **Ton** :
  - pas d'emphase marketing ;
  - pas de superlatif sans donnée ;
  - « le meilleur » seulement adossé à un classement du site, et dans ses
    limites.

---

*Charte éditoriale v1.0 — Tennis String Advisor — « Mesurer avant d'affirmer. »*
