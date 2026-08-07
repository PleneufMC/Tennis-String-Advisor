# 🎾 Tennis String Advisor Premium

Un système avancé de configuration de cordage de tennis avec journal professionnel et recommandations basées sur l'analyse RCS (Recommandation Confort Score).

![Tennis String Advisor](https://img.shields.io/badge/Tennis-String%20Advisor-green)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Premium](https://img.shields.io/badge/Premium-€4.99%2Fmois-gold)

## 🌐 Accès Direct

**🔗 Site en production :** [https://votre-site.netlify.app](https://votre-site.netlify.app)

### Pages principales :
- **Accueil** : `/`
- **Configurateur** : `/configurator`
- **Tarification** : `/pricing`
- **Statistiques** : `/statistics`
- **Blog** : `/blog/`
- **Guide plan de cordage** : `/blog/plan-de-cordage-tennis.html`
- **Guide jauge de cordage** : `/blog/jauge-cordage-tennis.html`

## ✨ Fonctionnalités Principales

### 🆓 Version Gratuite
- ✅ **Configurateur de base** avec calcul RCS simple
- ✅ **3 configurations sauvegardées** en local storage
- ✅ **Base de données complète** :
  - 129 raquettes de tennis (toutes marques, jusqu'aux gammes 2026)
  - 190 cordages professionnels
- ✅ **Recommandations basiques** selon le RCS

### ⭐ Version Premium (4,99€/mois ou 49,90€/an)
- ✅ **Configurations illimitées**
- ✅ **Journal de cordage complet** avec historique
- ✅ **Analyse RCS avancée** avec recommandations personnalisées
- ✅ **Export PDF** des configurations
- ✅ **Statistiques détaillées** et graphiques
- ✅ **Rappels de recondage**
- ✅ **Support prioritaire**

## 🚀 Fonctionnalités Implémentées

### 1. 📊 Base de Données Complète

#### Raquettes (129 modèles)
- **Marques** : Babolat, Head, Wilson, Yonex, Prince, Tecnifibre, Dunlop, Völkl
- **Données** : RA (rigidité), poids, taille du tamis
- **Exemples** :
  - Babolat Pure Aero (RA: 69, 300g, 100 sq in)
  - Wilson Blade 98 (RA: 62, 305g, 98 sq in)
  - Head Speed MP (RA: 62, 300g, 100 sq in)
  - Wilson Defyer 98 Pro (RA: 64, 305g, 98 sq in, 16x20) — gamme 2026

#### Cordages (190 références)
- **Types** : Polyester, Multifilament, Boyau naturel, Hybride
- **Données** : Rigidité (lb/in), contrôle, confort, durabilité, spin
- **Top cordages** :
  - Luxilon ALU Power (230 lb/in)
  - Babolat RPM Blast (225 lb/in)
  - Solinco Hyper-G (190 lb/in)
  - Tecnifibre Triax (162 lb/in — multifilament hybride nylon/polyester)
  - Wilson Natural Gut (120 lb/in)

### 2. 🧮 Système RCS (Recommandation Confort Score)

**Formule de calcul** :
```javascript
RCS = (racquetStiffness/70 × 0.4) + (stringStiffness/220 × 0.4) + (tension/24 × 0.2) × 30
```

**Interprétation** :
- **< 20** : Très Confortable (idéal pour bras sensibles)
- **20-25** : Confortable (majorité des joueurs)
- **25-30** : Standard (joueurs avancés)
- **30-35** : Ferme (contrôle maximal)
- **> 35** : Très Ferme (risque de tennis elbow)

### 3. 💻 Interface Utilisateur

#### Design
- **Thème vert** inspiré des courts de tennis
- **Image de fond** : Court de tennis professionnel
- **Layout responsive** : Desktop, tablet, mobile
- **Glassmorphism** : Effets de transparence modernes
- **Animations** : Transitions fluides

#### Configurateur
- **Recherche intelligente** : Filtrage en temps réel
- **Dropdowns searchables** : Pour raquettes et cordages
- **Sliders de tension** : 15-35 kg avec visualisation
- **Calcul RCS en temps réel** : Mise à jour instantanée
- **Sauvegarde locale** : Persistence des configurations

### 4. 💳 Système de Paiement Stripe

#### Intégration Ultra Simple
- **Payment Links directs** : Pas d'API complexe
- **Mensuel** : `https://buy.stripe.com/4gMcN56mL5wS3l44XO8Vi01`
- **Annuel** : `https://buy.stripe.com/9B600jeThbVgcVEfCs8Vi02`
- **Pages de retour** :
  - `/payment-success` : Confirmation avec animation
  - `/payment-cancelled` : Options de retry

#### Tarification
- **Mensuel** : 4,99€/mois
- **Annuel** : 49,90€/an (2 mois gratuits)
- **Économie annuelle** : 9,98€

### 5. 📈 Page Statistiques

- **Top 10 cordages** : Classés par performance
- **Top 10 raquettes** : Les plus populaires
- **Statistiques globales** : Totaux et moyennes
- **Tables visuelles** : Avec codes couleur

### 6. 📰 Blog & Guides

- ✅ **Blog statique** avec articles experts et SEO
- ✅ **Guide Plan de cordage** (ouvert vs dense, spectre 16×15 → 18×20)
- ✅ **Guide Jauge de cordage** (1,15–1,40 mm, impacts spin/puissance/durabilité)

### 7. 🛒 Affiliation (Tennis-Point via Awin)

- **Boutons « Voir le prix sur Tennis-Point »** sur les fiches cordages et raquettes
- **Liens partenaires trackés** via deep-links Awin (commission jusqu'à 9 %, cookie 30 j)
- **Activation sans redéploiement** : renseigner `NEXT_PUBLIC_AWIN_ID` + `NEXT_PUBLIC_AWIN_TENNISPOINT_MID` dans Netlify
  - Tant que non renseignées → liens directs (non trackés) vers tennis-point.fr, l'UX reste fonctionnelle
- **Tracking GA4** : événement `affiliate_click` (marchand + produit) à chaque clic
- **Mention d'affiliation** affichée dans le footer (conformité FR / Google)
- **Architecture multi-marchands** : ajout d'un futur marchand = une entrée de config (`src/lib/affiliate.ts`)

### 8. 🔧 Technologies Utilisées

#### Frontend
- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Type safety
- **Styles inline** : CSS-in-JS pour fiabilité
- **Local Storage** : Sauvegarde des configurations

#### Backend & Services
- **Stripe Payment Links** : Paiements sécurisés
- **Netlify** : Hébergement et CI/CD
- **PM2** : Process management (développement)

#### Base de Code
- **Structure modulaire** : Composants réutilisables
- **Type-safe** : Interfaces TypeScript complètes
- **Fonctions utilitaires** : Calculs RCS, filtrage, tri

## 📁 Structure du Projet

```
/home/user/webapp/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Page d'accueil
│   │   ├── configurator/
│   │   │   └── page.tsx             # Configurateur principal
│   │   ├── pricing/
│   │   │   └── page.tsx             # Page de tarification
│   │   ├── statistics/
│   │   │   └── page.tsx             # Statistiques et top produits
│   │   ├── payment-success/
│   │   │   └── page.tsx             # Confirmation de paiement
│   │   └── payment-cancelled/
│   │       └── page.tsx             # Annulation de paiement
│   ├── data/
│   │   ├── strings-database.ts      # Base de données des cordages
│   │   └── racquets-database.ts     # Base de données des raquettes
│   └── lib/
│       └── storage.ts               # Gestion du local storage
├── public/
│   └── images/
│       └── tennis-court-bg.jpg     # Image de fond
├── netlify.toml                    # Configuration Netlify
├── package.json                    # Dépendances
└── README.md                       # Ce fichier
```

## 🔄 Synchronisation base Supabase ↔ fichiers TypeScript

> **Le site lit les fichiers TS, jamais la base.** Aucune référence à
> `public.strings` ni à `from('strings')` n'existe dans `src/`. Les pages
> importent `stringsDatabase` depuis `src/data/strings-database.ts`.

Conséquence pratique, à garder en tête pour tout ajout de produit :

| Sens | Script | Effet pour le visiteur |
|---|---|---|
| TS → base | `migrations/2026-08-04__resync_ts_to_supabase.sql` | **aucun** : nettoie la base, que le site ne lit pas |
| **base → TS** | **`scripts/merge-db-to-ts.mjs`** | **visible** : les cordages apparaissent sur le site |

### `scripts/merge-db-to-ts.mjs`

```bash
node scripts/merge-db-to-ts.mjs --dry-run          # rapport, n'écrit rien
node scripts/merge-db-to-ts.mjs                    # applique la fusion
node scripts/merge-db-to-ts.mjs --from-file db.json # source hors ligne
```

Garanties :

- **additif seul** — aucune entrée existante n'est modifiée ni supprimée, donc
  les conflits de valeurs TS/base restent en attente d'arbitrage sans bloquer ;
- **idempotent** — filtrage sur `id` *et* sur `brand + model` normalisé, ce qui
  écarte les doublons sous identifiant différent (ex. `signum-pro-xperience`
  en base = `signum-pro-x-perience` sur le site) ;
- **aucune donnée fabriquée** — voir ci-dessous ;
- **contrôle des unités avant écriture** — refuse d'écrire si les tensions ne
  sont pas en kg (bornes 15-35 et ratio base/TS sur les ids communs) ou si la
  rigidité sort de 60-280 lb/in. Un écart d'unité silencieux fausserait les
  recommandations de tension ;
- **relecture de contrôle** après écriture (nombre d'entrées, ids uniques), avec
  sauvegarde `.ts.bak` (ignorée par git).

Transformations appliquées à l'import :

- `type: 'Synthetic Gut'` → `'Synthetic'` — hors enum TS, aligné sur le
  précédent déjà présent dans le projet (`Synthetic Gut Duraflex`) ;
- description : seule la partie principale est conservée. La base y ajoute un
  bloc `\n\nRigidité par jauge: …`, or `string-card.tsx` rend
  `{string.description}` en texte JSX brut — les `\n` ne produisent aucun saut
  de ligne en HTML et le bloc s'afficherait collé à la phrase.

### ⚠️ `versatility` et `innovation`

Ces deux notes sont **absentes du schéma Supabase**. Elles sont donc
**optionnelles** dans l'interface `TennisString` et **omises** sur les cordages
importés, plutôt que remplies par une moyenne inventée : cette base sert à
conseiller des achats, une note fabriquée y serait indiscernable d'une mesure.

Deux conséquences à ne pas défaire :

1. `qa-database.mjs` ne signale pas leur absence (`OPTIONAL_RATING_FIELDS`),
   mais contrôle toujours une valeur fournie ;
2. `getRecommendedStrings` filtre avec `s.versatility === undefined || s.versatility >= 7.5`.
   Sans le test d'`undefined`, les cordages importés seraient **tous** écartés
   des recommandations pour les joueurs intermédiaires.

## 🎨 Thème clair / sombre et palette « surface »

Le site suit le thème du système (`ThemeProvider`, `defaultTheme="system"`) :
en mode sombre, `<html>` reçoit la classe `dark`.

**Cinq pages sont écrites en styles inline** — `configurator`, `statistics`,
`pricing`, `payment-success`, `payment-cancelled`. Un style inline ne peut pas
porter de variante `dark:` Tailwind, ce qui avait provoqué un bug de texte
blanc sur carte blanche en mode sombre. Ces pages consomment donc des
**variables CSS** définies dans `src/app/globals.css`, dont la valeur bascule
automatiquement sous `.dark` :

| Variable | Rôle |
|---|---|
| `--surface-card` | fond des cartes |
| `--surface-muted` | en-têtes de sections repliables |
| `--surface-input` | fond des champs de saisie |
| `--surface-border`, `--surface-border-soft` | bordures |
| `--text-strong`, `--text-muted`, `--text-faint` | hiérarchie de texte |
| `--tint-{blue,green,amber,red}-{bg,fg}` | pastilles catégorielles |

> ⚠️ **Dans ces cinq pages, ne jamais réintroduire une couleur de surface en
> dur** (`backgroundColor: 'white'`, `color: '#1f2937'`…). Utilisez les
> variables : sinon le mode sombre casse à nouveau. Les seules exceptions
> légitimes sont les textes blancs posés sur un fond coloré (boutons verts,
> sous-titres sur l'image de fond) et les boutons désactivés en gris.

Un test empêche la régression :

```bash
npm run audit:contrast
```

Il relit la palette dans `globals.css` et recalcule le contraste de chaque
paire texte/fond réellement utilisée, **dans les deux thèmes**. Il échoue
(code 1) si une paire descend sous le seuil WCAG AA de 4.5:1. Il est inclus
dans `npm run audit:all`.

## 🚀 Installation et Développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/PleneufMC/Tennis-String-Advisor.git
cd Tennis-String-Advisor

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Ouvrir http://localhost:3000
```

### Build de production
```bash
npm run build
npm start
```

## 🔧 Configuration Stripe

### 1. Créer les Payment Links dans Stripe
- Produit : "Tennis String Advisor Premium"
- Prix mensuel : 4,99€
- Prix annuel : 49,90€

### 2. Configurer les URLs de retour
- Success URL : `https://votre-site.netlify.app/payment-success`
- Cancel URL : `https://votre-site.netlify.app/payment-cancelled`

### 3. Tester avec carte de test
- Numéro : `4242 4242 4242 4242`
- Date : N'importe quelle date future
- CVC : N'importe quel nombre à 3 chiffres

## 📊 Métriques et Performance

- **Lighthouse Score** : 95+
- **Temps de chargement** : < 2s
- **Bundle size** : Optimisé avec Next.js
- **SEO** : Meta tags optimisés
- **Accessibilité** : WCAG 2.1 AA

## 🔒 Sécurité

### Base de données Supabase
- [x] **RLS (Row Level Security)** activé sur toutes les tables
- [x] **Politiques RLS sécurisées** : lecture seule pour données publiques (racquets, strings)
- [x] **Functions sécurisées** : `search_path` défini sur toutes les fonctions
- [x] **Mot de passe minimum** : 8 caractères requis

### Authentification
- [x] **Google OAuth** : Connexion sécurisée
- [x] **Secure email change** : Double confirmation requise
- [ ] **Leaked Password Protection** : Disponible sur plan Pro uniquement

### Application
- [x] **Headers de sécurité** : X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [x] **CORS configuré** : Origines autorisées définies
- [x] **Stripe Payment Links** : Paiements sécurisés PCI-DSS

## 🛣️ Roadmap

### ✅ Complété (Janvier 2025)
- [x] Configurateur RCS avancé
- [x] Base de données 129 raquettes + 190 cordages
- [x] Intégration Stripe (paiements)
- [x] Authentification Google OAuth
- [x] **Corrections sécurité Supabase** (RLS, fonctions, politiques)

### Court terme
- [ ] Mode sombre
- [ ] Multi-langue (EN, ES, DE)
- [ ] PWA (Progressive Web App)
- [ ] Notifications push

### Moyen terme
- [ ] Application mobile (React Native)
- [ ] API publique
- [ ] Intégration boutiques partenaires
- [ ] Forum communautaire

### Long terme
- [ ] IA pour recommandations
- [ ] Tracking de performance
- [ ] Coaching personnalisé
- [ ] Marketplace de cordages

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés.

## 📧 Support

- **Email** : support@tennisadvisor.com
- **GitHub Issues** : [Créer une issue](https://github.com/PleneufMC/Tennis-String-Advisor/issues)

## 🙏 Remerciements

- **Stripe** pour la solution de paiement simple
- **Netlify** pour l'hébergement gratuit
- **Next.js** pour le framework React
- **La communauté tennis** pour les retours et suggestions

---

**Développé avec ❤️ pour les passionnés de tennis**

*Dernière mise à jour : 29 Janvier 2025*