// Dictionnaire de traductions FR / EN
// Système léger basé sur React Context (pas de dépendance externe).

export type Locale = 'fr' | 'en';

export const LOCALES: Locale[] = ['fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'fr';

export const dictionaries = {
  fr: {
    // --- Header ---
    'nav.home': 'Accueil',
    'nav.configurator': 'Configurateur',
    'nav.racquets': 'Raquettes',
    'nav.strings': 'Cordages',
    'nav.compare': 'Comparateur',
    'nav.guides': 'Guides',
    'nav.faq': 'FAQ',
    'nav.premium': 'Premium',
    'nav.signin': 'Se connecter',
    'nav.signout': 'Se déconnecter',
    'nav.account': 'Mon compte',
    'nav.discoverPremium': 'Découvrir Premium',
    'nav.openMenu': 'Ouvrir le menu',
    'a11y.toggleTheme': 'Changer de thème',
    'a11y.toggleLanguage': 'Changer de langue',

    // --- Home: Hero ---
    'home.badge': 'Édition 2026 · base mise à jour',
    'home.title1': 'Le bon cordage,',
    'home.title2': 'pour votre jeu.',
    'home.subtitle':
      'Tennis String Advisor croise votre raquette, votre cordage et votre tension pour calculer un score de confort objectif (RCS) — et vous guider vers le montage idéal.',
    'home.cta.configurator': 'Lancer le configurateur',
    'home.cta.explore': 'Explorer la base',
    'home.stats.racquets': 'Raquettes',
    'home.stats.strings': 'Cordages',
    'home.stats.brands': 'Marques',

    // --- Home: carte RCS ---
    'home.rcs.preview': 'Aperçu RCS',
    'home.rcs.comfortable': 'Confortable',
    'home.rcs.racquet': 'Raquette',
    'home.rcs.string': 'Cordage',
    'home.rcs.tension': 'Tension',
    'home.rcs.note':
      'Configuration équilibrée : contrôle élevé avec un confort adapté à la majorité des joueurs.',
    'home.brands.label': 'Toutes les grandes marques',

    // --- Home: Features ---
    'home.features.title': 'Tout pour choisir, régler et suivre votre cordage',
    'home.features.subtitle':
      'Des outils concrets pensés pour les joueurs exigeants comme pour les cordeurs.',
    'home.feature.config.title': 'Configurateur expert',
    'home.feature.config.desc':
      'Croisez raquette, cordage, jauge et tension. Le résultat se met à jour en direct.',
    'home.feature.rcs.title': 'Analyse RCS',
    'home.feature.rcs.desc':
      'Un score de confort objectif pour anticiper la sensation de jeu et préserver votre bras.',
    'home.feature.journal.title': 'Journal de cordage',
    'home.feature.journal.desc':
      'Historisez vos montages, notez vos sensations et recevez des rappels de recordage.',
    'home.feature.database.title': 'Base de données complète',
    'home.feature.database.desc':
      'Specs vérifiées et tenues à jour pour les modèles vendus aujourd’hui.',

    // --- Home: RCS explication ---
    'home.rcsSection.eyebrow': 'Le score RCS',
    'home.rcsSection.title': 'Un indicateur de confort, pas une boîte noire',
    'home.rcsSection.desc':
      'Le RCS combine la rigidité de votre raquette, celle de votre cordage et votre tension pour estimer la fermeté ressentie. Plus il est bas, plus le montage est doux pour le bras.',
    'home.rcsSection.point1': 'Évite les montages trop rigides (risque de tennis elbow)',
    'home.rcsSection.point2': 'Compare objectivement plusieurs configurations',
    'home.rcsSection.point3': 'Adapté à votre niveau et à votre style de jeu',
    'home.rcsSection.scale': 'Échelle de lecture',
    'home.rcsSection.veryComfortable': 'Très confortable',
    'home.rcsSection.comfortable': 'Confortable',
    'home.rcsSection.standard': 'Standard',
    'home.rcsSection.firm': 'Ferme',
    'home.rcsSection.veryFirm': 'Très ferme',

    // --- Home: CTA final ---
    'home.finalCta.title': 'Prêt à trouver votre montage idéal ?',
    'home.finalCta.desc':
      'Testez gratuitement le configurateur. Passez Premium pour le journal complet, l’export PDF et les configurations illimitées.',
    'home.finalCta.start': 'Commencer gratuitement',
    'home.finalCta.premium': 'Voir Premium · 4,99 €/mois',

    // --- Footer ---
    'footer.tagline':
      'Le compagnon des passionnés de tennis pour choisir, régler et suivre leur cordage.',
    'footer.rights': 'Tous droits réservés.',
    'footer.madeWith': 'Développé pour les passionnés de tennis',
    'footer.col.product': 'Produits',
    'footer.col.resources': 'Ressources',
    'footer.col.company': 'Entreprise',
    'footer.col.legal': 'Légal',
    'footer.link.configurator': 'Configurateur',
    'footer.link.racquets': 'Raquettes',
    'footer.link.strings': 'Cordages',
    'footer.link.compare': 'Comparateur',
    'footer.link.recommendations': 'Recommandations',
    'footer.link.guides': 'Guides',
    'footer.link.blog': 'Blog',
    'footer.link.pricing': 'Premium',
    'footer.link.statistics': 'Statistiques',
    'footer.link.faq': 'FAQ',
    'footer.link.glossary': 'Glossaire',
    'footer.link.about': 'À propos',
    'footer.link.contact': 'Contact',
    'footer.link.press': 'Presse',
    'footer.link.careers': 'Carrières',
    'footer.link.privacy': 'Confidentialité',
    'footer.link.terms': 'CGU',
    'footer.link.cookies': 'Cookies',
    'footer.link.legal': 'Mentions légales',
    'footer.newsletter.title': 'Inscrivez-vous à notre newsletter',
    'footer.newsletter.desc':
      'Recevez les dernières actualités tennis, guides et offres exclusives.',
    'footer.newsletter.placeholder': 'Votre email',
    'footer.newsletter.emailLabel': 'Adresse email',
    'footer.newsletter.submit': 'S’inscrire',
  },

  en: {
    // --- Header ---
    'nav.home': 'Home',
    'nav.configurator': 'Configurator',
    'nav.racquets': 'Racquets',
    'nav.strings': 'Strings',
    'nav.compare': 'Compare',
    'nav.guides': 'Guides',
    'nav.faq': 'FAQ',
    'nav.premium': 'Premium',
    'nav.signin': 'Sign in',
    'nav.signout': 'Sign out',
    'nav.account': 'My account',
    'nav.discoverPremium': 'Discover Premium',
    'nav.openMenu': 'Open menu',
    'a11y.toggleTheme': 'Toggle theme',
    'a11y.toggleLanguage': 'Switch language',

    // --- Home: Hero ---
    'home.badge': '2026 Edition · database updated',
    'home.title1': 'The right string,',
    'home.title2': 'for your game.',
    'home.subtitle':
      'Tennis String Advisor combines your racquet, string and tension to compute an objective comfort score (RCS) — and guide you to the ideal setup.',
    'home.cta.configurator': 'Launch the configurator',
    'home.cta.explore': 'Explore the database',
    'home.stats.racquets': 'Racquets',
    'home.stats.strings': 'Strings',
    'home.stats.brands': 'Brands',

    // --- Home: RCS card ---
    'home.rcs.preview': 'RCS preview',
    'home.rcs.comfortable': 'Comfortable',
    'home.rcs.racquet': 'Racquet',
    'home.rcs.string': 'String',
    'home.rcs.tension': 'Tension',
    'home.rcs.note':
      'Balanced setup: high control with comfort suited to the majority of players.',
    'home.brands.label': 'All the major brands',

    // --- Home: Features ---
    'home.features.title': 'Everything to choose, tune and track your stringing',
    'home.features.subtitle':
      'Practical tools built for demanding players and stringers alike.',
    'home.feature.config.title': 'Expert configurator',
    'home.feature.config.desc':
      'Combine racquet, string, gauge and tension. The result updates in real time.',
    'home.feature.rcs.title': 'RCS analysis',
    'home.feature.rcs.desc':
      'An objective comfort score to anticipate feel and protect your arm.',
    'home.feature.journal.title': 'Stringing journal',
    'home.feature.journal.desc':
      'Log your setups, note your feel and get restringing reminders.',
    'home.feature.database.title': 'Complete database',
    'home.feature.database.desc':
      'Verified, up-to-date specs for the models sold today.',

    // --- Home: RCS explanation ---
    'home.rcsSection.eyebrow': 'The RCS score',
    'home.rcsSection.title': 'A comfort indicator, not a black box',
    'home.rcsSection.desc':
      'RCS combines your racquet stiffness, string stiffness and tension to estimate the perceived firmness. The lower it is, the gentler the setup is on your arm.',
    'home.rcsSection.point1': 'Avoid overly stiff setups (tennis elbow risk)',
    'home.rcsSection.point2': 'Objectively compare several configurations',
    'home.rcsSection.point3': 'Tailored to your level and playing style',
    'home.rcsSection.scale': 'Reading scale',
    'home.rcsSection.veryComfortable': 'Very comfortable',
    'home.rcsSection.comfortable': 'Comfortable',
    'home.rcsSection.standard': 'Standard',
    'home.rcsSection.firm': 'Firm',
    'home.rcsSection.veryFirm': 'Very firm',

    // --- Home: final CTA ---
    'home.finalCta.title': 'Ready to find your ideal setup?',
    'home.finalCta.desc':
      'Try the configurator for free. Go Premium for the full journal, PDF export and unlimited configurations.',
    'home.finalCta.start': 'Start for free',
    'home.finalCta.premium': 'See Premium · €4.99/mo',

    // --- Footer ---
    'footer.tagline':
      'The companion for tennis enthusiasts to choose, tune and track their stringing.',
    'footer.rights': 'All rights reserved.',
    'footer.madeWith': 'Built for tennis enthusiasts',
    'footer.col.product': 'Product',
    'footer.col.resources': 'Resources',
    'footer.col.company': 'Company',
    'footer.col.legal': 'Legal',
    'footer.link.configurator': 'Configurator',
    'footer.link.racquets': 'Racquets',
    'footer.link.strings': 'Strings',
    'footer.link.compare': 'Compare',
    'footer.link.recommendations': 'Recommendations',
    'footer.link.guides': 'Guides',
    'footer.link.blog': 'Blog',
    'footer.link.pricing': 'Premium',
    'footer.link.statistics': 'Statistics',
    'footer.link.faq': 'FAQ',
    'footer.link.glossary': 'Glossary',
    'footer.link.about': 'About',
    'footer.link.contact': 'Contact',
    'footer.link.press': 'Press',
    'footer.link.careers': 'Careers',
    'footer.link.privacy': 'Privacy',
    'footer.link.terms': 'Terms',
    'footer.link.cookies': 'Cookies',
    'footer.link.legal': 'Legal notice',
    'footer.newsletter.title': 'Subscribe to our newsletter',
    'footer.newsletter.desc':
      'Get the latest tennis news, guides and exclusive offers.',
    'footer.newsletter.placeholder': 'Your email',
    'footer.newsletter.emailLabel': 'Email address',
    'footer.newsletter.submit': 'Subscribe',
  },
} as const;

export type TranslationKey = keyof (typeof dictionaries)['fr'];
