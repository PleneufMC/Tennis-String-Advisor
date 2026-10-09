# Pages légales TSA — inventaire, constats et brouillons (NON PUBLIÉ)

> **Statut** : brouillon de travail, `tsa-revenue`, 09/10/2026. **Rien de ce fichier n'est en ligne.**
> Aucune information d'identité n'a été inventée : chaque `[À FOURNIR : …]` est une
> information que seul Pierre peut donner. Les traitements décrits sont ceux **lus dans
> le code et dans la base** le 09/10/2026 (`main` = `5e46818`), pas ceux qu'on suppose.
> Une relecture juridique est nécessaire avant publication (§ 6).

---

## 1. Inventaire des liens légaux morts

Aucune page légale n'existe. `next.config.js` redirige en 301 vers l'accueil :
`/cgu.html`, `/confidentialite.html`, `/privacy.html`, `/faq.html` (FR).

| Fichier | Lien | Traitement |
|---|---|---|
| `public/en/faq.html` (pied) | `/confidentialite.html`, `/cgu.html` | repointé « in preparation » + contact (#88) |
| `public/en/premium.html` (pied) | `/confidentialite.html`, `/cgu.html` | idem (#88) |
| `public/en/auth.html` (inscription) | case **obligatoire** « I accept the terms of use and privacy policy », liens `href="#"` | **non modifié** — on fait accepter des documents qui n'existent pas |
| `src/app/auth/signin/page.tsx`, `signup/page.tsx` | « En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité » (sans lien) | non modifié — même problème |
| `public/blog/guide-tension-cordage-tennis.html` | `/faq.html`, `/cgu.html`, `/privacy.html` | **non modifié** (blog = `tsa-acquisition`, en cours) |
| `public/blog/analyse-setups-atp-top-20.html` | `/cgu.html`, `/privacy.html` | idem |
| `public/blog/nouveautes-equipement-tennis-2025-2026.html` | `/cgu.html`, `/confidentialite.html` | idem |
| `src/components/layout/footer.tsx` | liens légaux retirés le 13/08 (« DOIVENT être recréés… prérequis RGPD ») | — |

Pour `tsa-acquisition` : les trois articles ci-dessus peuvent pointer vers `/en/faq.html`
ou rien, en attendant les vraies pages ; une FAQ FR n'existe pas (`/faq.html` → accueil).

## 2. Ce que le site collecte réellement (constaté)

| Traitement | Où (code / base) | Données | Prestataire / localisation |
|---|---|---|---|
| Mesure d'audience | `src/app/layout.tsx` (GA4 `G-YSSLHJ5WYD`, `anonymize_ip`), `public/js/analytics.js` + `gtag` sur les pages EN et le blog | pages vues, événements (configurateur, clics affiliés, CTA), identifiant cookie `_ga`, IP tronquée | Google Ireland / Google LLC (transfert US) |
| Compte FR | NextAuth (`src/lib/auth.ts`) : Google OAuth, lien magique e-mail (SMTP, commentaire « via Resend »), e-mail + mot de passe (hash bcrypt) ; Prisma tables `User`, `Account`, `Session` | e-mail, nom, photo Google, hash, cookies de session | Supabase (Postgres, `eu-west-2` Londres), Google, Resend [À CONFIRMER] |
| Compte EN | Supabase Auth (`public/en/auth.html`) : e-mail + mot de passe, Google, **Facebook** ; jeton en `localStorage` | e-mail, nom, métadonnées OAuth | Supabase (Londres), Google, Meta |
| Profil EN | table `profiles` | niveau, fréquence, style de jeu, **`physical_issues`** (douleurs bras / épaule), statut premium | Supabase |
| Setups | `user_setups` (EN), `Configuration` (FR) | raquette, cordage, tension, RCS, notes libres | Supabase |
| Paiement | Payment Links Stripe, webhook `src/app/api/stripe/webhook` | e-mail prérempli, `client_reference_id`, statut premium ; carte gérée par Stripe | Stripe (Irlande / US) |
| Mesure d'achat | `src/lib/ga4.ts` (Measurement Protocol) | `purchase` avec id de session Stripe | Google |
| Newsletter EN | `public/en/index.html` → `newsletter_subscribers` (e-mail, date, langue) | e-mail | Supabase |
| Newsletter FR | `footer.tsx` : formulaire **sans gestionnaire** | rien n'est enregistré ; le navigateur soumet en GET et l'e-mail atterrit dans l'URL (constaté : `/racquets?email-address=test%40example.invalid`, aucune requête d'inscription) — exposé aux journaux et à toute mesure qui lirait l'URL ; envoi à GA4 non observé lors du test | — |
| Stockage local | `localStorage` : `theme`, `tennis-advisor-locale`, `tennisConfigurations`, `newsletter_subscribed`, jeton Supabase, `configurator_free_used` / `rcs_free_used` (retirés par #87) | préférences, setups anonymes | navigateur |
| Liens partenaires | `src/lib/affiliate.ts` (Awin inactif à ce jour) | aucun cookie posé par TSA ; le marchand pose les siens après le clic | Awin / Tennis-Point (à l'activation) |
| Ressources tierces | `cdn.tailwindcss.com`, `cdn.jsdelivr.net`, `unpkg.com` (pages EN) | IP et user-agent transmis au CDN | jsDelivr, unpkg, Tailwind |
| Hébergement | Netlify (déploiement), journaux serveur | IP, URL, horodatage | Netlify (US) |

### Constats à traiter avant toute publication

1. **GA4 se charge sans consentement** : aucun bandeau ni mécanisme de consentement
   dans le code (`consent`, `cookie-banner`… : zéro occurrence) ; constaté au
   navigateur : `g/collect … en=page_view` part dès le chargement de `/racquets`. Les cookies de mesure
   d'audience Google nécessitent un consentement préalable en France (CNIL). Une
   politique de confidentialité ne régularise pas ce point : il faut soit un bandeau,
   soit une configuration exemptée.
2. **`profiles.physical_issues`** enregistre des douleurs bras / épaule déclarées :
   donnée **susceptible d'être une donnée de santé** (RGPD art. 9). Base légale
   (consentement explicite ?) et nécessité à trancher — ou ne plus la stocker.
3. **Suppression de compte EN impossible** : `profiles` n'a pas de policy `DELETE`,
   `auth.users` n'est pas supprimable côté client. Le bouton « Delete account » ne
   supprime que les setups (message rendu honnête par #87). Droit à l'effacement :
   aujourd'hui seulement par e-mail, traité à la main.
4. **Newsletter FR factice** (formulaire sans gestionnaire, e-mail dans l'URL).
5. **Deux systèmes d'identité** (NextAuth FR, Supabase Auth EN) : une même personne peut
   avoir deux comptes ; la politique doit décrire les deux.
6. Pied des pages EN : « A brand of **Pleneuf Trading LLC** » — mention d'éditeur
   publiée dont l'exactitude n'est pas vérifiable dans le dépôt [À CONFIRMER].

## 3. Informations à demander à Pierre (liste exacte)

**Éditeur**
1. Raison sociale exacte de l'éditeur du site (personne physique ou morale ; « Pleneuf Trading LLC » est-elle la bonne entité, existe-t-elle, sous quel droit ?).
2. Forme juridique, capital social le cas échéant.
3. Numéro d'immatriculation (RCS / RCI Monaco / registre de l'État de l'LLC) et numéro de TVA intracommunautaire si applicable.
4. Adresse du siège (adresse postale publiable).
5. Directeur ou directrice de la publication (nom).
6. Adresse e-mail de contact publique à utiliser (`pleneuftrading@gmail.com`, déjà affichée sur le site, est-elle la bonne ?) et téléphone si souhaité.

**Hébergement et prestataires**
7. Confirmation de l'hébergeur à citer (Netlify, Inc. — adresse à reprendre de leurs conditions) et du plan Netlify (région des journaux).
8. Confirmation du prestataire d'e-mail transactionnel (Resend ? autre SMTP ?).
9. Facebook Login est-il réellement configuré dans Supabase (bouton présent sur `/en/auth.html`) ? Si non, le retirer plutôt que le déclarer.
10. Le DPA (accord de sous-traitance) est-il accepté chez Supabase, Stripe, Google Analytics, Netlify ?

**Traitements**
11. Durées de conservation voulues : comptes inactifs, setups, newsletter, journaux, données de paiement (obligations comptables).
12. Responsable du traitement = l'éditeur ? Un DPO est-il désigné (non obligatoire a priori à cette échelle) — sinon, l'adresse de contact pour exercer les droits.
13. Décision sur `physical_issues` : la conserver (avec consentement explicite) ou cesser de la stocker.
14. Décision sur la mesure d'audience : bandeau de consentement, ou bascule vers une mesure exemptée.
15. La newsletter a-t-elle un usage réel (envois ?) ; sinon, retirer les deux formulaires.

**Commercial (CGU / CGV)**
16. Le premium est-il vendu en tant que particulier ou société (conditionne les CGV, la TVA, la facturation) ?
17. Droit de rétractation : renonciation expresse pour un service numérique exécuté immédiatement — oui / non.
18. Politique de remboursement et de résiliation (abonnements mensuel / annuel, offre à vie).
19. Droit applicable et juridiction compétente souhaités (France ? Monaco ?), médiateur de la consommation (obligatoire en France pour la vente B2C).
20. Mention d'affiliation : formulation validée (le RCS est calculé sans aucune donnée commerciale — règle 1).

## 4. Brouillon — Politique de confidentialité (FR)

> Les passages entre crochets sont à compléter. Ne pas publier en l'état.

**Qui sommes-nous.** Tennis String Advisor (tennisstringadvisor.org) est édité par
[À FOURNIR : raison sociale, forme, immatriculation, adresse]. Contact pour toute
question relative à vos données : [À FOURNIR : e-mail].

**Ce que nous collectons et pourquoi.**
- *Sans compte* : le configurateur et le calculateur RCS fonctionnent dans votre
  navigateur. Vos choix peuvent être conservés dans le stockage local de votre
  navigateur (thème, langue, setups non connectés) ; ils ne nous sont pas transmis.
- *Mesure d'audience* : [À FOURNIR : décision § 3 point 14]. Nous utilisons Google
  Analytics 4 (adresse IP anonymisée) pour compter les pages vues et l'usage des outils.
- *Compte* : adresse e-mail, nom, et selon le mode de connexion la photo de profil
  Google [et Facebook — À CONFIRMER] ; mot de passe stocké sous forme chiffrée (hash).
  Finalité : vous permettre de sauvegarder vos setups. Base : exécution du service
  que vous demandez.
- *Profil de jeu (facultatif)* : niveau, fréquence, style, [gêne physique déclarée —
  À FOURNIR : décision § 3 point 13].
- *Setups sauvegardés* : raquette, cordage, tension, indice RCS, notes.
- *Paiement Premium* : traité par Stripe ; nous ne voyons ni ne stockons votre carte.
  Nous conservons l'identifiant client Stripe et votre statut Premium.
- *Newsletter* : [À FOURNIR : décision § 3 point 15].

**Liens partenaires.** Certains liens vers des marchands sont des liens partenaires.
Le site ne dépose pas de cookie à cette occasion ; le marchand peut en déposer après
votre clic, selon sa propre politique. La recommandation et l'indice RCS ne dépendent
d'aucune donnée commerciale.

**Destinataires et sous-traitants.** Supabase (base de données et authentification,
région Londres), Netlify (hébergement), Stripe (paiement), Google (mesure d'audience,
connexion Google), [Resend — À CONFIRMER] (e-mails de connexion), [Meta — À CONFIRMER].
Certains de ces prestataires peuvent transférer des données hors de l'Union
européenne, encadrés par [À FOURNIR : clauses contractuelles types / décision
d'adéquation, selon les DPA acceptés].

**Durées de conservation.** [À FOURNIR : § 3 point 11].

**Vos droits.** Accès, rectification, effacement, opposition, limitation, portabilité,
directives post-mortem, et réclamation auprès de la CNIL (ou de l'autorité compétente
[À FOURNIR : CCIN si l'éditeur est monégasque]). Pour les exercer : [À FOURNIR :
e-mail]. La suppression complète d'un compte est aujourd'hui traitée sur demande, par
e-mail.

**Cookies et stockage local.** [À FOURNIR après décision § 3 point 14 : liste exacte
des cookies Google Analytics, cookies de session de connexion, stockage local.]

## 5. Draft — Privacy policy (EN)

> Bracketed passages are placeholders. Do not publish as is.

**Who we are.** Tennis String Advisor (tennisstringadvisor.org) is published by
[TO PROVIDE: legal name, form, registration, address]. Contact for any data question:
[TO PROVIDE: email].

**What we collect and why.**
- *Without an account*: the configurator and the RCS calculator run in your browser.
  Your choices may be kept in your browser's local storage (theme, language, setups
  saved while signed out); they are not sent to us.
- *Audience measurement*: [TO PROVIDE: decision § 3 item 14]. We use Google Analytics 4
  (anonymised IP) to count page views and tool usage.
- *Account*: email address, name and, depending on the sign-in method, your Google
  [and Facebook — TO CONFIRM] profile picture; passwords are stored hashed. Purpose:
  letting you save your setups. Legal basis: performance of the service you request.
- *Playing profile (optional)*: level, frequency, style, [declared physical discomfort —
  TO PROVIDE: decision § 3 item 13].
- *Saved setups*: racquet, string, tension, RCS index, notes.
- *Premium payment*: processed by Stripe; we never see or store your card. We keep the
  Stripe customer identifier and your Premium status.
- *Newsletter*: [TO PROVIDE: decision § 3 item 15].

**Partner links.** Some links to retailers are partner links. The site sets no cookie
when you click them; the retailer may set its own afterwards, under its own policy. The
recommendation and the RCS index never depend on any commercial data.

**Recipients and processors.** Supabase (database and authentication, London region),
Netlify (hosting), Stripe (payment), Google (analytics, Google sign-in), [Resend — TO
CONFIRM] (sign-in emails), [Meta — TO CONFIRM]. Some of these providers may transfer data
outside the European Union, under [TO PROVIDE: standard contractual clauses / adequacy
decision, depending on the DPAs accepted].

**Retention.** [TO PROVIDE: § 3 item 11].

**Your rights.** Access, rectification, erasure, objection, restriction, portability, and
the right to lodge a complaint with the CNIL (or [TO PROVIDE: the competent authority]).
To exercise them: [TO PROVIDE: email]. Full account deletion is currently handled on
request, by email.

**Cookies and local storage.** [TO PROVIDE after decision § 3 item 14.]

## 6. Brouillon — Conditions générales d'utilisation (FR)

1. **Objet.** Les présentes conditions régissent l'usage de tennisstringadvisor.org,
   édité par [À FOURNIR].
2. **Service.** Outil d'aide au choix de raquette, cordage et tension, et indice de
   fermeté RCS. **L'indice RCS est une aide à la décision fondée sur des données
   techniques ; il ne constitue ni un avis médical ni un diagnostic.** En cas de douleur,
   consultez un professionnel de santé.
3. **Accès.** Le configurateur et le calculateur RCS sont gratuits et sans compte. Un
   compte gratuit permet de sauvegarder jusqu'à 3 setups ; l'offre Premium les rend
   illimités.
4. **Compte.** Vous êtes responsable de la confidentialité de vos identifiants.
5. **Premium.** [À FOURNIR : CGV — prix, durée, renouvellement, résiliation,
   rétractation, remboursement, médiateur ; § 3 points 16 à 19.]
6. **Données produit.** Les caractéristiques proviennent de sources publiques citées ;
   une valeur non publiée est affichée comme telle, jamais estimée. Aucune garantie
   d'exhaustivité.
7. **Liens partenaires.** Le site peut percevoir une commission sur certains achats ;
   cela n'influence ni le calcul, ni l'ordre, ni la sélection des recommandations.
8. **Propriété intellectuelle.** [À FOURNIR : titulaire des droits.]
9. **Responsabilité.** [À FOURNIR après relecture juridique.]
10. **Droit applicable et litiges.** [À FOURNIR : § 3 point 19.]

## 7. Draft — Terms of use (EN)

1. **Purpose.** These terms govern the use of tennisstringadvisor.org, published by
   [TO PROVIDE].
2. **Service.** A tool to help choose a racquet, string and tension, and the RCS
   firmness index. **The RCS index is decision support based on technical data; it is
   neither medical advice nor a diagnosis.** If you feel pain, see a health professional.
3. **Access.** The configurator and the RCS calculator are free and need no account. A
   free account saves up to 3 setups; Premium makes them unlimited.
4. **Account.** You are responsible for keeping your credentials confidential.
5. **Premium.** [TO PROVIDE: terms of sale — price, term, renewal, cancellation,
   withdrawal, refunds, mediator; § 3 items 16 to 19.] Premium is not sold on the English
   site at the moment.
6. **Product data.** Specifications come from cited public sources; an unpublished value
   is shown as such, never estimated. No guarantee of completeness.
7. **Partner links.** The site may earn a commission on some purchases; this never
   affects the calculation, the order or the selection of recommendations.
8. **Intellectual property.** [TO PROVIDE: rights holder.]
9. **Liability.** [TO PROVIDE after legal review.]
10. **Governing law and disputes.** [TO PROVIDE: § 3 item 19.]

## 8. Avant publication

- Réponses de Pierre aux 20 points du § 3.
- Relecture juridique (le pôle n'a pas de juriste : `legal-regulatory-analyst` ne tranche
  pas le droit ; un avocat pour les CGV B2C).
- Décision consentement / GA4 et `physical_issues` **avant** de publier la politique,
  sinon elle décrirait une non-conformité.
- Création des pages (`/confidentialite`, `/cgu`, `/en/privacy.html`, `/en/terms.html`),
  remplacement des 301 de `next.config.js`, des liens du pied de page (`footer.tsx`,
  pages EN) et des articles du blog (`tsa-acquisition`), liens réels sur la case
  d'inscription de `/en/auth.html` et sur `/auth/signin`.
