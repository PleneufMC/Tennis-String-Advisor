// Base de données complète des raquettes de tennis - Liste officielle

export interface TennisRacquet {
  id: string;
  brand: string;
  model: string;
  variant: string;
  stiffness: number | null; // RA rating (null si ND)
  weight: number; // grammes
  headSize: number; // sq in
  // Propriétés calculées/estimées
  balance?: number; // mm depuis le manche
  length?: number; // pouces (27 par défaut sauf juniors)
  stringPattern?: string; // ex: "16x19"
  swingWeight?: number; // kg·cm²
  category?: 'Control' | 'Power' | 'Tweener' | 'Modern Player' | 'Classic Player' | 'Junior' | 'Light';
  playerLevel?: ('Beginner' | 'Intermediate' | 'Advanced' | 'Pro')[];
  price?: {
    europe: number; // EUR
    usa: number; // USD
  };
  description?: string;
  proUsage?: string;
}

export const racquetsDatabase: TennisRacquet[] = [
  // BABOLAT
  {
    id: 'babolat-pure-aero-standard',
    brand: 'Babolat',
    model: 'Pure Aero',
    variant: 'Standard',
    stiffness: 69,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced', 'Pro'],
    description: 'La raquette de Rafael Nadal. Optimisée pour le spin maximum.',
    proUsage: 'Rafael Nadal, Carlos Alcaraz',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'babolat-pure-aero-98',
    brand: 'Babolat',
    model: 'Pure Aero',
    variant: '98',
    stiffness: 66,
    weight: 305,
    headSize: 98,
    stringPattern: '16x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Version contrôle de la Pure Aero avec tamis réduit.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'babolat-pure-aero-team',
    brand: 'Babolat',
    model: 'Pure Aero',
    variant: 'Team',
    stiffness: 67,
    weight: 285,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Version allégée de la Pure Aero. Plus maniable.',
    price: { europe: 260, usa: 260 }
  },
  {
    id: 'babolat-pure-drive-standard',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: 'Standard',
    stiffness: 72,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'La raquette la plus vendue au monde. Puissance et polyvalence.',
    proUsage: 'Fabio Fognini, Garbiñe Muguruza',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'babolat-pure-drive-98',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: '98',
    stiffness: 67,
    weight: 305,
    headSize: 98,
    stringPattern: '16x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Pure Drive avec plus de contrôle et précision.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'babolat-pure-drive-107',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: '107',
    stiffness: 69,
    weight: 285,
    headSize: 107,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Grand tamis pour plus de puissance et tolérance.',
    price: { europe: 260, usa: 260 }
  },
  {
    id: 'babolat-pure-drive-team',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: 'Team',
    stiffness: 69,
    weight: 285,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate'],
    description: 'Version légère de la Pure Drive. Idéale pour progresser.',
    price: { europe: 260, usa: 260 }
  },
  {
    id: 'babolat-pure-drive-rg',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: 'Roland Garros Edition',
    stiffness: 72,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Édition spéciale Roland Garros. Design terre battue.',
    price: { europe: 290, usa: 290 }
  },

  // HEAD
  {
    id: 'head-extreme-standard',
    brand: 'Head',
    model: 'Extreme',
    variant: 'Standard',
    stiffness: 65,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Pour joueurs cherchant spin et puissance contrôlée.',
    proUsage: 'Matteo Berrettini',
    price: { europe: 270, usa: 270 }
  },
  {
    id: 'head-extreme-tour-mp',
    brand: 'Head',
    model: 'Extreme',
    variant: 'Tour (MP)',
    stiffness: 64,
    weight: 305,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Version tour avec plus de contrôle et stabilité.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'head-gravity-mp',
    brand: 'Head',
    model: 'Gravity',
    variant: 'MP',
    stiffness: 57,
    weight: 295,
    headSize: 100,
    stringPattern: '16x20',
    category: 'Control',
    playerLevel: ['Advanced'],
    description: 'Contrôle et confort avec un grand tamis. Plan 16x20 et profil très souple (Auxetic 2.0).',
    price: { europe: 270, usa: 270 }
  },
  {
    id: 'head-gravity-pro',
    brand: 'Head',
    model: 'Gravity',
    variant: 'Pro',
    stiffness: 59,
    weight: 315,
    headSize: 100,
    stringPattern: '18x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Version pro lourde pour stabilité maximale.',
    proUsage: 'Alexander Zverev, Andrey Rublev',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'head-gravity-team',
    brand: 'Head',
    model: 'Gravity',
    variant: 'Team',
    stiffness: 60,
    weight: 285,
    headSize: 104,
    stringPattern: '16x20',
    category: 'Tweener',
    playerLevel: ['Intermediate'],
    description: 'Version légère et accessible de la Gravity.',
    price: { europe: 250, usa: 250 }
  },
  {
    id: 'head-gravity-tour',
    brand: 'Head',
    model: 'Gravity',
    variant: 'Tour',
    stiffness: 59,
    weight: 305,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Nouveau tamis 98 et plan 16x19 (génération 2025) : contrôle précis avec un accès au spin.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'head-gravity-mp-l',
    brand: 'Head',
    model: 'Gravity',
    variant: 'MP L',
    stiffness: 57,
    weight: 280,
    headSize: 100,
    stringPattern: '16x20',
    category: 'Light',
    playerLevel: ['Intermediate'],
    description: 'Version allégée de la Gravity MP (plan 16x20).',
    price: { europe: 260, usa: 260 }
  },
  {
    id: 'head-instinct-mp',
    brand: 'Head',
    model: 'Instinct',
    variant: 'MP',
    stiffness: 65,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Polyvalente avec bon équilibre puissance/contrôle.',
    price: { europe: 260, usa: 260 }
  },
  {
    id: 'head-instinct-team',
    brand: 'Head',
    model: 'Instinct',
    variant: 'Team',
    stiffness: 63,
    weight: 285,
    headSize: 102,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Version légère et tolérante.',
    price: { europe: 240, usa: 240 }
  },
  {
    id: 'head-instinct-team-l',
    brand: 'Head',
    model: 'Instinct',
    variant: 'Team L',
    stiffness: 63,
    weight: 270,
    headSize: 107,
    stringPattern: '16x19',
    category: 'Light',
    playerLevel: ['Beginner'],
    description: 'Ultra légère avec grand tamis. Idéale débutants.',
    price: { europe: 220, usa: 220 }
  },
  {
    id: 'head-instinct-pwr-115',
    brand: 'Head',
    model: 'Instinct',
    variant: 'PWR 115',
    stiffness: 70,
    weight: 230,
    headSize: 115,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Beginner'],
    description: 'Maximum de puissance avec minimum d\'effort.',
    price: { europe: 200, usa: 200 }
  },
  {
    id: 'head-instinct-110',
    brand: 'Head',
    model: 'Instinct',
    variant: '110',
    stiffness: 67,
    weight: 265,
    headSize: 110,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Grand tamis pour facilité et puissance.',
    price: { europe: 210, usa: 210 }
  },
  {
    id: 'head-prestige-pro',
    brand: 'Head',
    model: 'Prestige',
    variant: 'Pro',
    stiffness: 58,
    weight: 310,
    headSize: 98,
    stringPattern: '18x20',
    category: 'Classic Player',
    playerLevel: ['Pro'],
    description: 'Pour joueurs experts cherchant feel et contrôle.',
    price: { europe: 290, usa: 290 }
  },
  {
    id: 'head-prestige-mp',
    brand: 'Head',
    model: 'Prestige',
    variant: 'MP',
    stiffness: 62,
    weight: 300,
    headSize: 98,
    stringPattern: '18x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Icône du contrôle. Préférée des puristes.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'head-prestige-tour',
    brand: 'Head',
    model: 'Prestige',
    variant: 'Tour',
    stiffness: 60,
    weight: 305,
    headSize: 95,
    stringPattern: '18x20',
    category: 'Classic Player',
    playerLevel: ['Pro'],
    description: 'Tamis compact pour contrôle chirurgical.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'head-prestige-mp-l',
    brand: 'Head',
    model: 'Prestige',
    variant: 'MP L',
    stiffness: 61,
    weight: 280,
    headSize: 99,
    stringPattern: '16x19',
    category: 'Control',
    playerLevel: ['Advanced'],
    description: 'Version allégée plus accessible.',
    price: { europe: 270, usa: 270 }
  },
  {
    id: 'head-prestige-classic',
    brand: 'Head',
    model: 'Prestige',
    variant: 'Classic',
    stiffness: 57,
    weight: 320,
    headSize: 93,
    stringPattern: '18x20',
    category: 'Classic Player',
    playerLevel: ['Pro'],
    description: 'Retour aux sources. Pour puristes uniquement.',
    price: { europe: 300, usa: 300 }
  },
  {
    id: 'head-radical-mp',
    brand: 'Head',
    model: 'Radical',
    variant: 'MP',
    stiffness: 65,
    weight: 300,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Polyvalente légendaire. Équilibre parfait.',
    proUsage: 'Andy Murray (ancien)',
    price: { europe: 270, usa: 270 }
  },
  {
    id: 'head-radical-pro',
    brand: 'Head',
    model: 'Radical',
    variant: 'Pro',
    stiffness: 64,
    weight: 315,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Version pro avec plus de masse et stabilité.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'head-radical-team',
    brand: 'Head',
    model: 'Radical',
    variant: 'Team',
    stiffness: 64,
    weight: 280,
    headSize: 102,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Version légère et accessible.',
    price: { europe: 250, usa: 250 }
  },
  {
    id: 'head-radical-team-l',
    brand: 'Head',
    model: 'Radical',
    variant: 'Team L',
    stiffness: 64,
    weight: 265,
    headSize: 102,
    stringPattern: '16x19',
    category: 'Light',
    playerLevel: ['Beginner'],
    description: 'Ultra légère pour débutants.',
    price: { europe: 240, usa: 240 }
  },
  {
    id: 'head-speed-mp',
    brand: 'Head',
    model: 'Speed',
    variant: 'MP',
    stiffness: 61,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'La série de Novak Djokovic. Vitesse et contrôle.',
    proUsage: 'Novak Djokovic (customisée), Jannik Sinner',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'head-speed-elite',
    brand: 'Head',
    model: 'Speed',
    variant: 'Elite',
    stiffness: 61,
    weight: 285,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate'],
    description: 'Version allégée de la Speed.',
    price: { europe: 240, usa: 240 }
  },
  {
    id: 'head-speed-legend-pro',
    brand: 'Head',
    model: 'Speed',
    variant: 'Legend Pro',
    stiffness: 62,
    weight: 310,
    headSize: 100,
    stringPattern: '18x20',
    category: 'Control',
    playerLevel: ['Pro'],
    description: 'Version pro avec plan de cordage dense.',
    price: { europe: 290, usa: 290 }
  },
  {
    id: 'head-titanium-tis6',
    brand: 'Head',
    model: 'Titanium',
    variant: 'Ti.S6',
    stiffness: 71,
    weight: 225,
    headSize: 115,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Beginner'],
    description: 'Classique ultra-légère. Maximum de puissance.',
    price: { europe: 150, usa: 150 }
  },

  // PRINCE
  {
    id: 'prince-ripcord-standard',
    brand: 'Prince',
    model: 'Ripcord',
    variant: 'Standard',
    stiffness: 61,
    weight: 280,
    headSize: 100,
    stringPattern: '16x18',
    category: 'Tweener',
    playerLevel: ['Intermediate'],
    description: 'Axée sur le spin avec technologie Spin.',
    price: { europe: 200, usa: 200 }
  },
  {
    id: 'prince-ripstick-standard',
    brand: 'Prince',
    model: 'Ripstick',
    variant: 'Standard',
    stiffness: 60,
    weight: 300,
    headSize: 100,
    stringPattern: '16x18',
    category: 'Modern Player',
    playerLevel: ['Advanced'],
    description: 'Pour joueurs avancés cherchant spin et contrôle.',
    price: { europe: 220, usa: 220 }
  },
  {
    id: 'prince-warrior-100-300g',
    brand: 'Prince',
    model: 'Warrior',
    variant: '100 (300g)',
    stiffness: 66,
    weight: 300,
    headSize: 100,
    stringPattern: '16x18',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Polyvalente avec bon équilibre.',
    price: { europe: 190, usa: 190 }
  },
  {
    id: 'prince-warrior-100-285g',
    brand: 'Prince',
    model: 'Warrior',
    variant: '100 (285g)',
    stiffness: 66,
    weight: 285,
    headSize: 100,
    stringPattern: '16x18',
    category: 'Tweener',
    playerLevel: ['Intermediate'],
    description: 'Version allégée du Warrior 100.',
    price: { europe: 180, usa: 180 }
  },
  {
    id: 'prince-warrior-107',
    brand: 'Prince',
    model: 'Warrior',
    variant: '107',
    stiffness: 65,
    weight: 285,
    headSize: 107,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Grand tamis pour puissance et tolérance.',
    price: { europe: 180, usa: 180 }
  },
  {
    id: 'prince-twistpower-x100',
    brand: 'Prince',
    model: 'Twistpower',
    variant: 'X100',
    stiffness: 66,
    weight: 290,
    headSize: 100,
    stringPattern: '16x18',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Technologie Twist Weight pour stabilité.',
    price: { europe: 210, usa: 210 }
  },
  {
    id: 'prince-twistpower-x105',
    brand: 'Prince',
    model: 'Twistpower',
    variant: 'X105',
    stiffness: 67,
    weight: 290,
    headSize: 105,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Intermediate'],
    description: 'Plus de puissance avec grand tamis.',
    price: { europe: 210, usa: 210 }
  },

  // TECNIFIBRE
  {
    id: 'tecnifibre-tf40-305',
    brand: 'Tecnifibre',
    model: 'TF40',
    variant: '305',
    stiffness: 63,
    weight: 305,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Foam Inside pour absorption des chocs.',
    price: { europe: 250, usa: 250 }
  },
  {
    id: 'tecnifibre-tf40-315',
    brand: 'Tecnifibre',
    model: 'TF40',
    variant: '315',
    stiffness: 64,
    weight: 315,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Control',
    playerLevel: ['Pro'],
    description: 'Version lourde pour stabilité maximale.',
    price: { europe: 250, usa: 250 }
  },
  {
    id: 'tecnifibre-tflash-300',
    brand: 'Tecnifibre',
    model: 'TFlash',
    variant: '300',
    stiffness: 68,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Puissance et vitesse de balle.',
    price: { europe: 220, usa: 220 }
  },
  {
    id: 'tecnifibre-tflash-285',
    brand: 'Tecnifibre',
    model: 'TFlash',
    variant: '285',
    stiffness: 68,
    weight: 285,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate'],
    description: 'Version allégée du TFlash.',
    price: { europe: 210, usa: 210 }
  },
  {
    id: 'tecnifibre-tfight-305s-id',
    brand: 'Tecnifibre',
    model: 'TFight',
    variant: '305S ID',
    stiffness: 65,
    weight: 305,
    headSize: 98,
    stringPattern: '18x19',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Isoflex et Dynacore HD pour stabilité et confort.',
    proUsage: 'Daniil Medvedev',
    price: { europe: 270, usa: 270 }
  },
  {
    id: 'tecnifibre-tfight-300-id',
    brand: 'Tecnifibre',
    model: 'TFight',
    variant: '300 ID',
    stiffness: 66,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Version 100 in² plus accessible.',
    proUsage: 'Iga Swiatek',
    price: { europe: 270, usa: 270 }
  },
  {
    id: 'tecnifibre-tfight-315s',
    brand: 'Tecnifibre',
    model: 'TFight',
    variant: '315S',
    stiffness: 64,
    weight: 315,
    headSize: 98,
    stringPattern: '18x19',
    category: 'Control',
    playerLevel: ['Pro'],
    description: 'Version pro lourde pour contrôle maximum.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'tecnifibre-tempo-298',
    brand: 'Tecnifibre',
    model: 'Tempo',
    variant: '298',
    stiffness: 66,
    weight: 298,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced'],
    description: 'Nouvelle gamme axée sur la vitesse.',
    price: { europe: 240, usa: 240 }
  },
  {
    id: 'tecnifibre-tempo-285',
    brand: 'Tecnifibre',
    model: 'Tempo',
    variant: '285',
    stiffness: 65,
    weight: 285,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate'],
    description: 'Version légère et accessible.',
    price: { europe: 230, usa: 230 }
  },

  // WILSON
  {
    id: 'wilson-blade-standard',
    brand: 'Wilson',
    model: 'Blade',
    variant: 'Standard',
    stiffness: 62,
    weight: 305,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Feel exceptionnel avec FORTYFIVE°.',
    proUsage: 'Stefanos Tsitsipas, Coco Gauff',
    price: { europe: 290, usa: 290 }
  },
  {
    id: 'wilson-blade-junior-25',
    brand: 'Wilson',
    model: 'Blade Feel',
    variant: 'Junior 25"',
    stiffness: null,
    weight: 240,
    headSize: 98,
    length: 25,
    balance: 320,
    stringPattern: '16x19',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Blade junior 25” — balle verte, 8-10 ans (130-145 cm). Cadre léger pour initier au jeu complétif.',
    price: { europe: 70, usa: 65 }
  },
  {
    id: 'wilson-blade-junior-26',
    brand: 'Wilson',
    model: 'Blade Feel',
    variant: 'Junior 26"',
    stiffness: null,
    weight: 255,
    headSize: 100,
    length: 26,
    balance: 325,
    stringPattern: '16x19',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Blade junior 26” — balle jaune, 10-12 ans (145-160 cm). Dernière étape avant la raquette adulte 27”.',
    price: { europe: 80, usa: 75 }
  },
  {
    id: 'wilson-burn-100ls-v5',
    brand: 'Wilson',
    model: 'Burn',
    variant: '100LS v5',
    stiffness: 72,
    weight: 280,
    headSize: 100,
    stringPattern: '18x16',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Orientée spin avec plan de cordage ouvert.',
    price: { europe: 240, usa: 240 }
  },
  {
    id: 'wilson-clash-100l-v3',
    brand: 'Wilson',
    model: 'Clash',
    variant: '100L V3',
    stiffness: 57,
    weight: 295,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate'],
    description: 'Version légère du Clash. Confort extrême.',
    price: { europe: 270, usa: 270 }
  },
  {
    id: 'wilson-clash-98-v2',
    brand: 'Wilson',
    model: 'Clash',
    variant: '98 v2',
    stiffness: 58,
    weight: 310,
    headSize: 98,
    stringPattern: '16x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Contrôle avec flexibilité révolutionnaire.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'wilson-clash-100-pro-v2',
    brand: 'Wilson',
    model: 'Clash',
    variant: '100 Pro v2',
    stiffness: 55,
    weight: 310,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Version pro du Clash 100.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'wilson-clash-100-v2',
    brand: 'Wilson',
    model: 'Clash',
    variant: '100 v2',
    stiffness: 57,
    weight: 295,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'FreeFlex + StableSmart. Révolution confort.',
    price: { europe: 270, usa: 270 }
  },
  {
    id: 'wilson-hyper-hammer-53',
    brand: 'Wilson',
    model: 'Hyper Hammer',
    variant: '5.3 Stretch OS',
    stiffness: 72,
    weight: 240,
    headSize: 110,
    stringPattern: '16x20',
    category: 'Power',
    playerLevel: ['Beginner'],
    description: 'Ultra-légère avec grand tamis. Maximum de puissance.',
    price: { europe: 130, usa: 130 }
  },
  {
    id: 'wilson-ultra-standard',
    brand: 'Wilson',
    model: 'Ultra',
    variant: 'Standard',
    stiffness: 74,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Puissance moderne avec Crush Zone.',
    price: { europe: 270, usa: 270 }
  },
  {
    id: 'wilson-ultra-99-pro',
    brand: 'Wilson',
    model: 'Ultra',
    variant: '99 Pro',
    stiffness: 70,
    weight: 305,
    headSize: 99,
    stringPattern: '16x20',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Version contrôle de l\'Ultra.',
    price: { europe: 280, usa: 280 }
  },

  // YONEX
  {
    id: 'yonex-ezone-98',
    brand: 'Yonex',
    model: 'EZONE',
    variant: '98',
    stiffness: 63,
    weight: 305,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Forme isométrique pour sweet spot élargi.',
    proUsage: 'Belinda Bencic',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'yonex-ezone-100',
    brand: 'Yonex',
    model: 'EZONE',
    variant: '100',
    stiffness: 64,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Polyvalente avec technologie 2G-Namd.',
    proUsage: 'Naomi Osaka, Nick Kyrgios',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'yonex-ezone-105',
    brand: 'Yonex',
    model: 'EZONE',
    variant: '105',
    stiffness: 64,
    weight: 275,
    headSize: 105,
    stringPattern: '16x18',
    category: 'Light',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Légère avec grand tamis.',
    price: { europe: 250, usa: 250 }
  },
  {
    id: 'yonex-ezone-115',
    brand: 'Yonex',
    model: 'EZONE',
    variant: '115',
    stiffness: 65,
    weight: 255,
    headSize: 115,
    stringPattern: '16x18',
    category: 'Power',
    playerLevel: ['Beginner'],
    description: 'Maximum de puissance et tolérance.',
    price: { europe: 220, usa: 220 }
  },
  {
    id: 'yonex-percept-97',
    brand: 'Yonex',
    model: 'Percept',
    variant: '97',
    stiffness: 60,
    weight: 310,
    headSize: 97,
    stringPattern: '16x19',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Nouveau modèle 2024. Servo Filter pour réduction vibrations.',
    price: { europe: 290, usa: 290 }
  },
  {
    id: 'yonex-percept-97d',
    brand: 'Yonex',
    model: 'Percept',
    variant: '97D',
    stiffness: 60,
    weight: 320,
    headSize: 97,
    stringPattern: '18x20',
    category: 'Control',
    playerLevel: ['Pro'],
    description: 'Version dense pour contrôle maximum.',
    price: { europe: 290, usa: 290 }
  },
  {
    id: 'yonex-percept-100',
    brand: 'Yonex',
    model: 'Percept',
    variant: '100',
    stiffness: 61,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced'],
    description: 'Équilibre parfait avec nouvelle technologie.',
    price: { europe: 290, usa: 290 }
  },
  {
    id: 'yonex-percept-100d',
    brand: 'Yonex',
    model: 'Percept',
    variant: '100D',
    stiffness: 61,
    weight: 305,
    headSize: 100,
    stringPattern: '18x19',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Version contrôle avec plan dense.',
    price: { europe: 290, usa: 290 }
  },
  {
    id: 'yonex-vcore-95',
    brand: 'Yonex',
    model: 'VCore',
    variant: '95',
    stiffness: 62,
    weight: 310,
    headSize: 95,
    stringPattern: '16x20',
    category: 'Classic Player',
    playerLevel: ['Pro'],
    description: 'Petit tamis pour contrôle précis.',
    proUsage: 'Stan Wawrinka',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'yonex-vcore-98',
    brand: 'Yonex',
    model: 'VCore',
    variant: '98',
    stiffness: 64,
    weight: 305,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Orientée spin avec Aero Trench.',
    proUsage: 'Denis Shapovalov',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'yonex-vcore-98-tour',
    brand: 'Yonex',
    model: 'VCore',
    variant: '98 Tour',
    stiffness: 63,
    weight: 315,
    headSize: 98,
    stringPattern: '18x20',
    category: 'Control',
    playerLevel: ['Pro'],
    description: 'Version tour avec plan dense.',
    price: { europe: 290, usa: 290 }
  },
  {
    id: 'yonex-vcore-100',
    brand: 'Yonex',
    model: 'VCore',
    variant: '100',
    stiffness: 65,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Spin et puissance avec String Sync Grommets.',
    price: { europe: 280, usa: 280 }
  },
  {
    id: 'yonex-vcore-100l',
    brand: 'Yonex',
    model: 'VCore',
    variant: '100L',
    stiffness: 64,
    weight: 280,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Light',
    playerLevel: ['Intermediate'],
    description: 'Version allégée du VCore 100.',
    price: { europe: 260, usa: 260 }
  },

  // ===== AJOUTS GAMMES PRINCIPALES (mise à jour Tennis Warehouse) =====

  // WILSON - Pro Staff v14
  {
    id: 'wilson-pro-staff-97-v14',
    brand: 'Wilson',
    model: 'Pro Staff',
    variant: '97 v14',
    stiffness: 66,
    weight: 315,
    headSize: 97,
    stringPattern: '16x19',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Le légendaire Pro Staff de Roger Federer. Précision, plow-through et toucher exceptionnels.',
    proUsage: 'Héritage Roger Federer',
    price: { europe: 270, usa: 259 }
  },
  {
    id: 'wilson-pro-staff-x-v14',
    brand: 'Wilson',
    model: 'Pro Staff',
    variant: 'X v14',
    stiffness: 66,
    weight: 315,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Pro Staff au tamis 100 plus tolérant, redoutable en retour grâce à sa stabilité.',
    price: { europe: 270, usa: 259 }
  },
  {
    id: 'wilson-pro-staff-97l-v14',
    brand: 'Wilson',
    model: 'Pro Staff',
    variant: '97L v14',
    stiffness: 67,
    weight: 290,
    headSize: 97,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Version allégée du Pro Staff 97, plus maniable tout en gardant le toucher.',
    price: { europe: 250, usa: 239 }
  },

  // WILSON - Blade v9
  {
    id: 'wilson-blade-98-16x19-v9',
    brand: 'Wilson',
    model: 'Blade',
    variant: '98 16x19 v9',
    stiffness: 64,
    weight: 305,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Blade 2024 plus stable, beam boîte 21mm. Contrôle, spin et feel signature.',
    proUsage: 'Stefanos Tsitsipas (custom)',
    price: { europe: 270, usa: 259 }
  },
  {
    id: 'wilson-blade-98-18x20-v9',
    brand: 'Wilson',
    model: 'Blade',
    variant: '98 18x20 v9',
    stiffness: 62,
    weight: 305,
    headSize: 98,
    stringPattern: '18x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Le Blade le plus précis, plan de cordage dense 18x20 pour un contrôle chirurgical.',
    price: { europe: 270, usa: 259 }
  },
  {
    id: 'wilson-blade-100-v9',
    brand: 'Wilson',
    model: 'Blade',
    variant: '100 v9',
    stiffness: 67,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Blade 100 plus accessible, équilibre contrôle/puissance pour le all-court.',
    price: { europe: 260, usa: 249 }
  },

  // WILSON - Shift
  {
    id: 'wilson-shift-99-pro-v1',
    brand: 'Wilson',
    model: 'Shift',
    variant: '99 Pro',
    stiffness: 62,
    weight: 315,
    headSize: 99,
    stringPattern: '18x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Cadre flexible et stable de la gamme W.Labs Shift, pour un contrôle redirigé fluide.',
    price: { europe: 260, usa: 249 }
  },
  {
    id: 'wilson-shift-99-v1',
    brand: 'Wilson',
    model: 'Shift',
    variant: '99',
    stiffness: 65,
    weight: 300,
    headSize: 99,
    stringPattern: '16x20',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Shift 99 polyvalent avec technologie de flexion dynamique pour stabilité et confort.',
    price: { europe: 250, usa: 239 }
  },

  // BABOLAT - Pure Strike (4e génération 2024)
  {
    id: 'babolat-pure-strike-98-16x19',
    brand: 'Babolat',
    model: 'Pure Strike',
    variant: '98 16x19',
    stiffness: 64,
    weight: 305,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Pure Strike 98 2024, mélange contrôle et puissance brute. Indéboulonnable en fond de court.',
    proUsage: 'Dominic Thiem (héritage)',
    price: { europe: 270, usa: 259 }
  },
  {
    id: 'babolat-pure-strike-98-18x20',
    brand: 'Babolat',
    model: 'Pure Strike',
    variant: '98 18x20',
    stiffness: 63,
    weight: 305,
    headSize: 98,
    stringPattern: '18x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Version 18x20 du Pure Strike 98, précision maximale et toucher amélioré.',
    price: { europe: 270, usa: 259 }
  },
  {
    id: 'babolat-pure-strike-100',
    brand: 'Babolat',
    model: 'Pure Strike',
    variant: '100',
    stiffness: 66,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Pure Strike 100 2024, plus de tolérance et de puissance avec le feel Pure Strike.',
    price: { europe: 260, usa: 249 }
  },
  {
    id: 'babolat-pure-strike-100-16x20',
    brand: 'Babolat',
    model: 'Pure Strike',
    variant: '100 16x20',
    stiffness: 64,
    weight: 305,
    headSize: 100,
    stringPattern: '16x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Pure Strike 100 16x20 : corde croisée supplémentaire et flex réduit pour plus de feel.',
    price: { europe: 260, usa: 249 }
  },
  {
    id: 'babolat-pure-strike-team',
    brand: 'Babolat',
    model: 'Pure Strike',
    variant: 'Team',
    stiffness: 67,
    weight: 285,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Version allégée du Pure Strike, plus maniable pour joueurs en progression.',
    price: { europe: 230, usa: 219 }
  },

  // BABOLAT - Pure Aero Rafa
  {
    id: 'babolat-pure-aero-rafa',
    brand: 'Babolat',
    model: 'Pure Aero',
    variant: 'Rafa Origin',
    stiffness: 67,
    weight: 315,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Édition Rafael Nadal, plus lourde et plus stable que la Pure Aero standard.',
    proUsage: 'Rafael Nadal',
    price: { europe: 290, usa: 279 }
  },

  // HEAD - Boom (2024, Auxetic 2.0)
  {
    id: 'head-boom-pro-2024',
    brand: 'Head',
    model: 'Boom',
    variant: 'Pro',
    stiffness: 64,
    weight: 310,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Boom Pro 2024 avec Auxetic 2.0, mélange puissance, spin et confort pour le joueur agressif.',
    price: { europe: 250, usa: 239 }
  },
  {
    id: 'head-boom-mp-2024',
    brand: 'Head',
    model: 'Boom',
    variant: 'MP',
    stiffness: 62,
    weight: 295,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Boom MP 2024, vitesse explosive et maniabilité avec swingweight sous 320.',
    price: { europe: 240, usa: 229 }
  },
  {
    id: 'head-boom-team-2024',
    brand: 'Head',
    model: 'Boom',
    variant: 'Team',
    stiffness: 64,
    weight: 275,
    headSize: 102,
    stringPattern: '16x19',
    category: 'Light',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Boom Team allégé, idéal pour joueurs cherchant puissance facile et confort.',
    price: { europe: 220, usa: 209 }
  },

  // YONEX - EZONE Tour & Osaka
  {
    id: 'yonex-ezone-tour',
    brand: 'Yonex',
    model: 'EZONE',
    variant: '98 Tour',
    stiffness: 64,
    weight: 315,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'EZONE Tour plus lourd et flexible, contrôle et confort pour le joueur exigeant.',
    price: { europe: 280, usa: 269 }
  },
  {
    id: 'yonex-ezone-100-osaka',
    brand: 'Yonex',
    model: 'EZONE',
    variant: '100 Osaka',
    stiffness: 67,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Édition Naomi Osaka de l\'EZONE 100, puissance et confort en coloris signature.',
    proUsage: 'Naomi Osaka',
    price: { europe: 280, usa: 269 }
  },

  // DUNLOP - CX / FX / SX
  {
    id: 'dunlop-cx-200',
    brand: 'Dunlop',
    model: 'CX',
    variant: '200',
    stiffness: 66,
    weight: 305,
    headSize: 98,
    stringPattern: '16x19',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'CX 200 2024, cadre contrôle de Dunlop avec toucher précis et plan de cordage maîtrisé.',
    price: { europe: 230, usa: 219 }
  },
  {
    id: 'dunlop-cx-200-tour-18x20',
    brand: 'Dunlop',
    model: 'CX',
    variant: '200 Tour 18x20',
    stiffness: 63,
    weight: 320,
    headSize: 95,
    stringPattern: '18x20',
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    description: 'CX 200 Tour, cadre 95 dense 18x20 pour les puristes du contrôle.',
    price: { europe: 240, usa: 229 }
  },
  {
    id: 'dunlop-fx-500',
    brand: 'Dunlop',
    model: 'FX',
    variant: '500',
    stiffness: 69,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Power',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'FX 500, le cadre puissance phare de Dunlop, beam épais et plan ouvert.',
    price: { europe: 230, usa: 219 }
  },
  {
    id: 'dunlop-fx-500-tour',
    brand: 'Dunlop',
    model: 'FX',
    variant: '500 Tour',
    stiffness: 67,
    weight: 305,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'FX 500 Tour, version plus lourde et stable pour le joueur de puissance confirmé.',
    price: { europe: 240, usa: 229 }
  },
  {
    id: 'dunlop-sx-300',
    brand: 'Dunlop',
    model: 'SX',
    variant: '300',
    stiffness: 69,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'SX 300, le cadre spin de Dunlop avec technologie Sonic Core pour le confort.',
    price: { europe: 220, usa: 209 }
  },
  {
    id: 'dunlop-sx-300-tour',
    brand: 'Dunlop',
    model: 'SX',
    variant: '300 Tour',
    stiffness: 65,
    weight: 305,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'SX 300 Tour, version Tour plus lourde pour un spin lourd et contrôlé.',
    price: { europe: 230, usa: 219 }
  },

  // VÖLKL - V-Cell / V8
  {
    id: 'volkl-v-cell-v1-pro',
    brand: 'Völkl',
    model: 'V-Cell',
    variant: 'V1 Pro',
    stiffness: 62,
    weight: 305,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'V-Cell V1 Pro, polyvalence et confort réputés de la marque allemande Völkl.',
    price: { europe: 200, usa: 199 }
  },
  {
    id: 'volkl-v8-pro',
    brand: 'Völkl',
    model: 'V8',
    variant: 'Pro',
    stiffness: 64,
    weight: 305,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Advanced'],
    description: 'Völkl V8 Pro, all-court équilibré avec toucher et stabilité.',
    price: { europe: 210, usa: 199 }
  },

  // PROKENNEX - Ki Q+ (technologie Kinetic anti-vibrations)
  {
    id: 'prokennex-ki-q-tour-pro',
    brand: 'ProKennex',
    model: 'Ki Q+',
    variant: 'Tour Pro',
    stiffness: 62,
    weight: 325,
    headSize: 97,
    stringPattern: '18x20',
    category: 'Classic Player',
    playerLevel: ['Advanced', 'Pro'],
    description: 'Ki Q+ Tour Pro avec technologie Kinetic, idéal pour bras sensibles et joueurs touchés par le tennis elbow.',
    price: { europe: 230, usa: 219 }
  },
  {
    id: 'prokennex-ki-q-5',
    brand: 'ProKennex',
    model: 'Ki Q+',
    variant: '5 (300)',
    stiffness: 63,
    weight: 300,
    headSize: 100,
    stringPattern: '16x19',
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Ki Q+ 5 avec masses kinétiques, confort maximal et protection articulaire.',
    price: { europe: 210, usa: 199 }
  },

  // ============================================================
  // RAQUETTES JUNIOR — système de tailles par longueur/âge
  // Rouge: 19"/21" · Orange: 23" · Verte: 25" · Jaune: 26"
  // ============================================================

  // --- BABOLAT Pure Drive Junior ---
  {
    id: 'babolat-pure-drive-junior-19',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: 'Junior 19"',
    stiffness: null,
    weight: 180,
    headSize: 82,
    length: 19,
    balance: 280,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner'],
    description: 'Pure Drive Junior 19" — balle rouge, 3-5 ans (≈ 95-105 cm). Cadre alu ultra-léger pour les premiers échanges.',
    price: { europe: 35, usa: 35 }
  },
  {
    id: 'babolat-pure-drive-junior-21',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: 'Junior 21"',
    stiffness: null,
    weight: 190,
    headSize: 85,
    length: 21,
    balance: 290,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner'],
    description: 'Pure Drive Junior 21" — balle rouge, 5-6 ans (≈ 105-115 cm). Maniable et tolérant.',
    price: { europe: 40, usa: 40 }
  },
  {
    id: 'babolat-pure-drive-junior-23',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: 'Junior 23"',
    stiffness: null,
    weight: 210,
    headSize: 90,
    length: 23,
    balance: 300,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Pure Drive Junior 23" — balle orange, 6-8 ans (≈ 115-130 cm). Transition vers le jeu structuré.',
    price: { europe: 50, usa: 50 }
  },
  {
    id: 'babolat-pure-drive-junior-25',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: 'Junior 25"',
    stiffness: null,
    weight: 235,
    headSize: 98,
    length: 25,
    balance: 315,
    swingWeight: 215,
    stringPattern: '16x17',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Pure Drive Junior 25" — balle verte, 8-10 ans (≈ 130-145 cm). Construction graphite, technologie adulte miniaturisée.',
    price: { europe: 70, usa: 65 }
  },
  {
    id: 'babolat-pure-drive-junior-26',
    brand: 'Babolat',
    model: 'Pure Drive',
    variant: 'Junior 26" (Gen11)',
    stiffness: null,
    weight: 250,
    headSize: 100,
    length: 26,
    balance: 320,
    swingWeight: 240,
    stringPattern: '16x19',
    category: 'Junior',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Pure Drive Junior 26" — balle jaune, 10-12 ans (≈ 145-160 cm). Le pont vers la raquette adulte pour jeunes compétiteurs.',
    price: { europe: 90, usa: 89 }
  },

  // --- BABOLAT Pure Aero Junior ---
  {
    id: 'babolat-pure-aero-junior-25',
    brand: 'Babolat',
    model: 'Pure Aero',
    variant: 'Junior 25"',
    stiffness: null,
    weight: 240,
    headSize: 98,
    length: 25,
    balance: 315,
    stringPattern: '16x17',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Pure Aero Junior 25" — balle verte, 8-10 ans. Orientée spin pour le jeune joueur agressif.',
    price: { europe: 75, usa: 70 }
  },
  {
    id: 'babolat-pure-aero-junior-26',
    brand: 'Babolat',
    model: 'Pure Aero',
    variant: 'Junior 26"',
    stiffness: null,
    weight: 250,
    headSize: 100,
    length: 26,
    balance: 320,
    swingWeight: 240,
    stringPattern: '16x19',
    category: 'Junior',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Pure Aero Junior 26" — balle jaune, 10-12 ans. Le spin du modèle d\'Alcaraz pour les juniors confirmés.',
    price: { europe: 95, usa: 89 }
  },

  // --- WILSON US Open Junior (gamme initiation alu) ---
  {
    id: 'wilson-us-open-junior-19',
    brand: 'Wilson',
    model: 'US Open',
    variant: 'Junior 19"',
    stiffness: null,
    weight: 170,
    headSize: 82,
    length: 19,
    balance: 275,
    stringPattern: '16x17',
    category: 'Junior',
    playerLevel: ['Beginner'],
    description: 'US Open Junior 19" — balle rouge, 3-5 ans. Cadre aluminium pré-cordé, idéal pour découvrir le tennis.',
    price: { europe: 25, usa: 25 }
  },
  {
    id: 'wilson-us-open-junior-21',
    brand: 'Wilson',
    model: 'US Open',
    variant: 'Junior 21"',
    stiffness: null,
    weight: 185,
    headSize: 85,
    length: 21,
    balance: 285,
    stringPattern: '16x17',
    category: 'Junior',
    playerLevel: ['Beginner'],
    description: 'US Open Junior 21" — balle rouge, 5-6 ans. Léger et coloré, parfait pour l\'école de tennis.',
    price: { europe: 28, usa: 27 }
  },
  {
    id: 'wilson-us-open-junior-23',
    brand: 'Wilson',
    model: 'US Open',
    variant: 'Junior 23"',
    stiffness: null,
    weight: 205,
    headSize: 90,
    length: 23,
    balance: 295,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner'],
    description: 'US Open Junior 23" — balle orange, 6-8 ans. Maniabilité maximale pour progresser.',
    price: { europe: 32, usa: 30 }
  },
  {
    id: 'wilson-us-open-junior-25',
    brand: 'Wilson',
    model: 'US Open',
    variant: 'Junior 25"',
    stiffness: null,
    weight: 225,
    headSize: 98,
    length: 25,
    balance: 310,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner'],
    description: 'US Open Junior 25" — balle verte, 8-10 ans. Tamis surdimensionné tolérant en alliage titane.',
    price: { europe: 35, usa: 32 }
  },

  // --- WILSON Roger Federer Junior ---
  {
    id: 'wilson-federer-junior-21',
    brand: 'Wilson',
    model: 'Roger Federer',
    variant: 'Junior 21"',
    stiffness: null,
    weight: 185,
    headSize: 85,
    length: 21,
    balance: 285,
    stringPattern: '16x17',
    category: 'Junior',
    playerLevel: ['Beginner'],
    description: 'Roger Federer Junior 21" — balle rouge, 5-6 ans. Look iconique pour inspirer les plus jeunes.',
    price: { europe: 30, usa: 28 }
  },
  {
    id: 'wilson-federer-junior-23',
    brand: 'Wilson',
    model: 'Roger Federer',
    variant: 'Junior 23"',
    stiffness: null,
    weight: 205,
    headSize: 90,
    length: 23,
    balance: 295,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner'],
    description: 'Roger Federer Junior 23" — balle orange, 6-8 ans. Cadre léger et équilibré.',
    price: { europe: 33, usa: 30 }
  },
  {
    id: 'wilson-federer-junior-25',
    brand: 'Wilson',
    model: 'Roger Federer',
    variant: 'Junior 25"',
    stiffness: null,
    weight: 225,
    headSize: 98,
    length: 25,
    balance: 310,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Roger Federer Junior 25" — balle verte, 8-10 ans. Pour le jeune joueur qui structure son jeu.',
    price: { europe: 38, usa: 35 }
  },

  // --- HEAD Speed Junior ---
  {
    id: 'head-speed-junior-21',
    brand: 'Head',
    model: 'Speed',
    variant: 'Junior 21"',
    stiffness: null,
    weight: 190,
    headSize: 85,
    length: 21,
    balance: 290,
    stringPattern: '16x17',
    category: 'Junior',
    playerLevel: ['Beginner'],
    description: 'Speed Junior 21" — balle rouge, 5-6 ans. La gamme de Sinner et Zverev déclinée pour les plus petits.',
    price: { europe: 40, usa: 38 }
  },
  {
    id: 'head-speed-junior-23',
    brand: 'Head',
    model: 'Speed',
    variant: 'Junior 23"',
    stiffness: null,
    weight: 210,
    headSize: 90,
    length: 23,
    balance: 300,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Speed Junior 23" — balle orange, 6-8 ans. Polyvalente et tolérante.',
    price: { europe: 45, usa: 42 }
  },
  {
    id: 'head-speed-junior-25',
    brand: 'Head',
    model: 'Speed',
    variant: 'Junior 25"',
    stiffness: null,
    weight: 235,
    headSize: 98,
    length: 25,
    balance: 315,
    swingWeight: 220,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Speed Junior 25" — balle verte, 8-10 ans. Graphite + technologie Graphene pour la stabilité.',
    price: { europe: 70, usa: 65 }
  },
  {
    id: 'head-speed-junior-26',
    brand: 'Head',
    model: 'Speed',
    variant: 'Junior 26"',
    stiffness: null,
    weight: 250,
    headSize: 100,
    length: 26,
    balance: 320,
    swingWeight: 240,
    stringPattern: '16x19',
    category: 'Junior',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Speed Junior 26" — balle jaune, 10-12 ans. La référence des jeunes compétiteurs avant le passage en 27".',
    price: { europe: 90, usa: 85 }
  },

  // --- HEAD Radical Junior ---
  {
    id: 'head-radical-junior-26',
    brand: 'Head',
    model: 'Radical',
    variant: 'Junior 26"',
    stiffness: null,
    weight: 245,
    headSize: 100,
    length: 26,
    balance: 320,
    swingWeight: 235,
    stringPattern: '16x19',
    category: 'Junior',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Radical Junior 26" — balle jaune, 10-12 ans. Full graphite, contrôle et précision pour joueurs avancés.',
    price: { europe: 90, usa: 85 }
  },

  // --- HEAD Gravity Junior ---
  {
    id: 'head-gravity-junior-25',
    brand: 'Head',
    model: 'Gravity',
    variant: 'Junior 25"',
    stiffness: null,
    weight: 235,
    headSize: 98,
    length: 25,
    balance: 315,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Gravity Junior 25" — balle verte, 8-10 ans. Technologie Innegra pour le confort, beaucoup de spin.',
    price: { europe: 70, usa: 65 }
  },
  {
    id: 'head-gravity-junior-26',
    brand: 'Head',
    model: 'Gravity',
    variant: 'Junior 26"',
    stiffness: null,
    weight: 250,
    headSize: 100,
    length: 26,
    balance: 320,
    swingWeight: 240,
    stringPattern: '16x19',
    category: 'Junior',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Gravity Junior 26" — balle jaune, 10-12 ans. Confort Innegra et spin pour le jeune joueur complet.',
    price: { europe: 90, usa: 85 }
  },

  // --- YONEX EZONE Junior ---
  {
    id: 'yonex-ezone-junior-25',
    brand: 'Yonex',
    model: 'EZONE',
    variant: 'Junior 25"',
    stiffness: null,
    weight: 240,
    headSize: 98,
    length: 25,
    balance: 315,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'EZONE Junior 25" — balle verte, 8-10 ans. Cadre isométrique Yonex pour une zone de frappe agrandie.',
    price: { europe: 75, usa: 70 }
  },
  {
    id: 'yonex-ezone-junior-26',
    brand: 'Yonex',
    model: 'EZONE',
    variant: 'Junior 26"',
    stiffness: null,
    weight: 255,
    headSize: 100,
    length: 26,
    balance: 320,
    swingWeight: 240,
    stringPattern: '16x19',
    category: 'Junior',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'EZONE Junior 26" — balle jaune, 10-12 ans. La gamme d\'Alcaraz/Osaka pour les jeunes compétiteurs.',
    price: { europe: 100, usa: 95 }
  },

  // --- TECNIFIBRE Tempo / TF-X1 Junior ---
  {
    id: 'tecnifibre-tempo-junior-25',
    brand: 'Tecnifibre',
    model: 'Tempo',
    variant: 'Junior 25"',
    stiffness: null,
    weight: 240,
    headSize: 98,
    length: 25,
    balance: 315,
    stringPattern: '16x18',
    category: 'Junior',
    playerLevel: ['Beginner', 'Intermediate'],
    description: 'Tempo Junior 25" — balle verte, 8-10 ans. Maniabilité et puissance pour la jeune joueuse/joueur.',
    price: { europe: 70, usa: 65 }
  },
  {
    id: 'tecnifibre-tempo-junior-26',
    brand: 'Tecnifibre',
    model: 'Tempo',
    variant: 'Junior 26"',
    stiffness: null,
    weight: 255,
    headSize: 100,
    length: 26,
    balance: 320,
    swingWeight: 240,
    stringPattern: '16x19',
    category: 'Junior',
    playerLevel: ['Intermediate', 'Advanced'],
    description: 'Tempo Junior 26" — balle jaune, 10-12 ans. Dernière étape avant la raquette adulte Tecnifibre.',
    price: { europe: 90, usa: 85 }
  }
];

// Fonction helper pour obtenir les raquettes uniques (sans doublons de modèles)
export function getUniqueRacquetModels(): string[] {
  const models = new Set<string>();
  racquetsDatabase.forEach(racquet => {
    models.add(`${racquet.brand} ${racquet.model}`);
  });
  return Array.from(models).sort();
}

// Fonction helper pour filtrer les raquettes
export function filterRacquets(
  racquets: TennisRacquet[],
  filters: {
    brand?: string;
    maxWeight?: number;
    minWeight?: number;
    headSize?: number;
    maxStiffness?: number;
    minStiffness?: number;
    category?: string;
    playerLevel?: string;
  }
): TennisRacquet[] {
  return racquets.filter(racquet => {
    if (filters.brand && racquet.brand !== filters.brand) return false;
    if (filters.maxWeight && racquet.weight > filters.maxWeight) return false;
    if (filters.minWeight && racquet.weight < filters.minWeight) return false;
    if (filters.headSize && racquet.headSize !== filters.headSize) return false;
    if (filters.maxStiffness && racquet.stiffness && racquet.stiffness > filters.maxStiffness) return false;
    if (filters.minStiffness && racquet.stiffness && racquet.stiffness < filters.minStiffness) return false;
    if (filters.category && racquet.category !== filters.category) return false;
    if (filters.playerLevel && racquet.playerLevel && !racquet.playerLevel.includes(filters.playerLevel as any)) return false;
    return true;
  });
}

// Fonction pour obtenir une recommandation de raquette basée sur le profil
export function getRacquetRecommendation(profile: {
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  style: 'Baseline' | 'All-Court' | 'Serve-Volley' | 'Defensive';
  priority: 'control' | 'power' | 'comfort' | 'spin';
  strength: 'low' | 'medium' | 'high';
  age?: 'junior' | 'adult' | 'senior';
}): TennisRacquet[] {
  let filtered = [...racquetsDatabase];
  
  // Filtrage selon l'âge
  if (profile.age === 'junior') {
    filtered = filtered.filter(r => r.category === 'Junior' || r.weight <= 280);
  } else if (profile.age === 'senior') {
    filtered = filtered.filter(r => r.weight <= 300 && (!r.stiffness || r.stiffness <= 68));
  }
  
  // Filtrage selon le niveau
  if (profile.level === 'Beginner') {
    filtered = filtered.filter(r => 
      r.weight <= 300 && 
      r.headSize >= 100 &&
      (!r.stiffness || r.stiffness <= 70)
    );
  } else if (profile.level === 'Intermediate') {
    filtered = filtered.filter(r => 
      r.weight >= 270 && r.weight <= 310
    );
  } else if (profile.level === 'Advanced' || profile.level === 'Pro') {
    filtered = filtered.filter(r => 
      r.weight >= 290
    );
  }
  
  // Filtrage selon la force physique
  if (profile.strength === 'low') {
    filtered = filtered.filter(r => r.weight <= 290);
  } else if (profile.strength === 'medium') {
    filtered = filtered.filter(r => r.weight <= 305);
  }
  
  // Filtrage selon la priorité
  switch (profile.priority) {
    case 'control':
      filtered = filtered.filter(r => 
        (r.stringPattern && r.stringPattern.includes('18x20')) ||
        r.headSize <= 98 ||
        r.category === 'Control' || 
        r.category === 'Classic Player'
      );
      break;
    case 'power':
      filtered = filtered.filter(r => 
        r.headSize >= 100 ||
        (r.stiffness && r.stiffness >= 68) ||
        r.category === 'Power'
      );
      break;
    case 'comfort':
      filtered = filtered.filter(r => 
        !r.stiffness || r.stiffness <= 65
      );
      break;
    case 'spin':
      filtered = filtered.filter(r => 
        r.stringPattern === '16x19' || 
        r.stringPattern === '16x18' ||
        r.model.includes('Aero') ||
        r.model.includes('VCore')
      );
      break;
  }
  
  // Tri par pertinence
  filtered.sort((a, b) => {
    // Prioriser les raquettes avec usage pro
    if (a.proUsage && !b.proUsage) return -1;
    if (!a.proUsage && b.proUsage) return 1;
    
    // Puis par poids (plus proche de 300g = mieux)
    const aDiff = Math.abs(a.weight - 300);
    const bDiff = Math.abs(b.weight - 300);
    return aDiff - bDiff;
  });
  
  return filtered.slice(0, 5);
}

// Fonction pour calculer la compatibilité raquette-cordage
export function calculateCompatibility(
  racquet: TennisRacquet,
  stringStiffness: number,
  tension: number
): {
  score: number;
  recommendation: string;
  rcs: number; // Recommandation Confort Score
} {
  let score = 70; // Score de base
  let recommendation = '';
  
  // Calcul du RCS basé sur rigidité raquette + cordage + tension
  const racquetStiffness = racquet.stiffness || 65; // Valeur par défaut si ND
  const rcs = Math.round(
    (racquetStiffness / 3) + 
    (stringStiffness / 10) + 
    (tension - 20)
  );
  
  // Ajustement du score selon le RCS
  if (rcs < 25) {
    score += 20;
    recommendation = 'Configuration très confortable, excellent pour le bras.';
  } else if (rcs < 35) {
    score += 15;
    recommendation = 'Bon équilibre confort/contrôle.';
  } else if (rcs < 45) {
    score += 10;
    recommendation = 'Configuration orientée contrôle, confort moyen.';
  } else if (rcs < 55) {
    score += 5;
    recommendation = 'Configuration rigide, attention si problèmes de bras.';
  } else {
    score -= 5;
    recommendation = 'Configuration très rigide, risque de tennis elbow.';
  }
  
  // Ajustement selon le poids de la raquette
  if (racquet.weight >= 290 && racquet.weight <= 310) {
    score += 5;
    recommendation += ' Poids idéal pour la plupart des joueurs.';
  } else if (racquet.weight < 280) {
    recommendation += ' Raquette légère, bonne maniabilité.';
  } else if (racquet.weight > 320) {
    recommendation += ' Raquette lourde, stabilité maximale.';
  }
  
  // Ajustement selon la tension
  if (tension >= 22 && tension <= 26) {
    score += 5;
    recommendation += ' Tension dans la plage optimale.';
  } else if (tension < 22) {
    recommendation += ' Tension basse = plus de puissance et confort.';
  } else {
    recommendation += ' Tension haute = plus de contrôle et précision.';
  }
  
  return { 
    score: Math.min(100, Math.max(0, score)), 
    recommendation,
    rcs 
  };
}