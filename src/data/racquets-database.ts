// Base de données complète des raquettes de tennis 2025

export interface TennisRacquet {
  id: string;
  brand: string;
  model: string;
  headSize: number; // sq in
  weight: {
    unstrung: number; // grammes
    strung: number; // grammes
  };
  balance: {
    unstrung: number; // mm depuis le manche
    strung: number; // mm depuis le manche
  };
  length: number; // pouces
  stringPattern: string; // ex: "16x19"
  stiffness: number; // RA rating
  beamWidth: string; // ex: "23mm"
  swingWeight: number; // kg·cm²
  category: 'Control' | 'Power' | 'Tweener' | 'Modern Player' | 'Classic Player';
  playerLevel: ('Beginner' | 'Intermediate' | 'Advanced' | 'Pro')[];
  playStyle: ('Baseline' | 'All-Court' | 'Serve-Volley' | 'Defensive')[];
  price: {
    europe: number; // EUR
    usa: number; // USD
  };
  description: string;
  proUsage?: string;
  year: number;
  color?: string;
}

export const racquetsDatabase: TennisRacquet[] = [
  // BABOLAT
  {
    id: 'babolat-pure-drive-2024',
    brand: 'Babolat',
    model: 'Pure Drive 2024',
    headSize: 100,
    weight: { unstrung: 300, strung: 318 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 71,
    beamWidth: '23-26mm',
    swingWeight: 324,
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    playStyle: ['Baseline', 'All-Court'],
    price: { europe: 280, usa: 280 },
    description: 'La raquette la plus vendue au monde. Puissance et contrôle équilibrés avec HTR System.',
    proUsage: 'Fabio Fognini, Garbiñe Muguruza',
    year: 2024,
    color: 'Blue/White'
  },
  {
    id: 'babolat-pure-aero-2023',
    brand: 'Babolat',
    model: 'Pure Aero 2023',
    headSize: 100,
    weight: { unstrung: 300, strung: 318 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 67,
    beamWidth: '23-26mm',
    swingWeight: 324,
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced', 'Pro'],
    playStyle: ['Baseline'],
    price: { europe: 280, usa: 280 },
    description: 'La raquette de Rafael Nadal. Optimisée pour le spin maximum avec Aeromodular 3.',
    proUsage: 'Rafael Nadal, Carlos Alcaraz, Felix Auger-Aliassime',
    year: 2023,
    color: 'Yellow/Black'
  },
  {
    id: 'babolat-pure-strike-18x20',
    brand: 'Babolat',
    model: 'Pure Strike 18x20 (3rd Gen)',
    headSize: 98,
    weight: { unstrung: 305, strung: 323 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '18x20',
    stiffness: 66,
    beamWidth: '21-23mm',
    swingWeight: 326,
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['All-Court', 'Baseline'],
    price: { europe: 280, usa: 280 },
    description: 'Contrôle précis avec plan de cordage dense. Pour joueurs techniques.',
    proUsage: 'Dominic Thiem',
    year: 2024,
    color: 'White/Red/Black'
  },

  // WILSON
  {
    id: 'wilson-pro-staff-rf97',
    brand: 'Wilson',
    model: 'Pro Staff RF97 Autograph',
    headSize: 97,
    weight: { unstrung: 340, strung: 357 },
    balance: { unstrung: 315, strung: 310 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 68,
    beamWidth: '21.5mm',
    swingWeight: 359,
    category: 'Classic Player',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['All-Court', 'Serve-Volley'],
    price: { europe: 320, usa: 320 },
    description: 'La raquette de Roger Federer. Lourde, stable, précise. Pour experts uniquement.',
    proUsage: 'Roger Federer (retraité)',
    year: 2023,
    color: 'Black/White'
  },
  {
    id: 'wilson-blade-98-v9',
    brand: 'Wilson',
    model: 'Blade 98 v9',
    headSize: 98,
    weight: { unstrung: 305, strung: 323 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 62,
    beamWidth: '21mm',
    swingWeight: 327,
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced', 'Pro'],
    playStyle: ['Baseline', 'All-Court'],
    price: { europe: 290, usa: 290 },
    description: 'DirectConnect + FORTYFIVE° pour un feel exceptionnel. La plus flexible des raquettes modernes.',
    proUsage: 'Stefanos Tsitsipas, Coco Gauff',
    year: 2024,
    color: 'Green/Bronze'
  },
  {
    id: 'wilson-clash-100-v2',
    brand: 'Wilson',
    model: 'Clash 100 v2',
    headSize: 100,
    weight: { unstrung: 295, strung: 313 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 55,
    beamWidth: '24mm',
    swingWeight: 312,
    category: 'Tweener',
    playerLevel: ['Beginner', 'Intermediate', 'Advanced'],
    playStyle: ['All-Court'],
    price: { europe: 270, usa: 270 },
    description: 'FreeFlex + Stable Smart. La plus flexible avec stabilité. Révolution confort.',
    year: 2023,
    color: 'Red/Black'
  },
  {
    id: 'wilson-ultra-100-v4',
    brand: 'Wilson',
    model: 'Ultra 100 v4',
    headSize: 100,
    weight: { unstrung: 300, strung: 318 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 68,
    beamWidth: '24.5-26.5mm',
    swingWeight: 320,
    category: 'Power',
    playerLevel: ['Intermediate', 'Advanced'],
    playStyle: ['Baseline', 'All-Court'],
    price: { europe: 270, usa: 270 },
    description: 'FortyFive construction pour plus de puissance et stabilité. Crush Zone grommet.',
    year: 2023,
    color: 'Blue/White'
  },

  // HEAD
  {
    id: 'head-speed-mp-2024',
    brand: 'Head',
    model: 'Speed MP 2024',
    headSize: 100,
    weight: { unstrung: 300, strung: 318 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 64,
    beamWidth: '23mm',
    swingWeight: 328,
    category: 'Modern Player',
    playerLevel: ['Intermediate', 'Advanced', 'Pro'],
    playStyle: ['Baseline', 'All-Court'],
    price: { europe: 280, usa: 280 },
    description: 'Auxetic 2.0 pour un feel amélioré. La raquette de Novak Djokovic (version pro).',
    proUsage: 'Novak Djokovic (version customisée), Jannik Sinner',
    year: 2024,
    color: 'White/Black'
  },
  {
    id: 'head-radical-mp-2023',
    brand: 'Head',
    model: 'Radical MP 2023',
    headSize: 98,
    weight: { unstrung: 295, strung: 313 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 64,
    beamWidth: '20-23mm',
    swingWeight: 324,
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    playStyle: ['All-Court'],
    price: { europe: 270, usa: 270 },
    description: 'Auxetic construction. Polyvalente et accessible. Sound Grommets.',
    proUsage: 'Andy Murray (retraité)',
    year: 2023,
    color: 'Orange/Black'
  },
  {
    id: 'head-gravity-pro-2023',
    brand: 'Head',
    model: 'Gravity Pro 2023',
    headSize: 100,
    weight: { unstrung: 315, strung: 333 },
    balance: { unstrung: 315, strung: 310 },
    length: 27,
    stringPattern: '18x20',
    stiffness: 62,
    beamWidth: '20mm',
    swingWeight: 332,
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['Baseline'],
    price: { europe: 280, usa: 280 },
    description: 'Massive sweet spot. Pour joueurs cherchant contrôle et stabilité.',
    proUsage: 'Alexander Zverev, Andrey Rublev',
    year: 2023,
    color: 'Turquoise/Navy'
  },
  {
    id: 'head-boom-mp-2024',
    brand: 'Head',
    model: 'Boom MP 2024',
    headSize: 100,
    weight: { unstrung: 295, strung: 313 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 65,
    beamWidth: '24mm',
    swingWeight: 315,
    category: 'Tweener',
    playerLevel: ['Beginner', 'Intermediate'],
    playStyle: ['All-Court'],
    price: { europe: 250, usa: 250 },
    description: 'Auxetic 2.0 pour débutants/intermédiaires. Facile et confortable.',
    year: 2024,
    color: 'Black/Orange'
  },

  // YONEX
  {
    id: 'yonex-ezone-100-2024',
    brand: 'Yonex',
    model: 'EZONE 100 (7th Gen)',
    headSize: 100,
    weight: { unstrung: 300, strung: 318 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 67,
    beamWidth: '23.5-26mm',
    swingWeight: 321,
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    playStyle: ['Baseline', 'All-Court'],
    price: { europe: 280, usa: 280 },
    description: '2G-Namd Speed graphite. Isometric head shape. Sweet spot élargi de 7%.',
    proUsage: 'Naomi Osaka, Nick Kyrgios',
    year: 2024,
    color: 'Sky Blue'
  },
  {
    id: 'yonex-vcore-98-2023',
    brand: 'Yonex',
    model: 'VCORE 98 (2023)',
    headSize: 98,
    weight: { unstrung: 305, strung: 323 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 65,
    beamWidth: '22-23mm',
    swingWeight: 324,
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['Baseline'],
    price: { europe: 280, usa: 280 },
    description: 'Aero Trench et String Sync Grommets pour spin maximum.',
    proUsage: 'Denis Shapovalov, Stan Wawrinka',
    year: 2023,
    color: 'Scarlet Red'
  },
  {
    id: 'yonex-percept-97-2024',
    brand: 'Yonex',
    model: 'Percept 97',
    headSize: 97,
    weight: { unstrung: 310, strung: 328 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 63,
    beamWidth: '21mm',
    swingWeight: 330,
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['All-Court'],
    price: { europe: 290, usa: 290 },
    description: 'Nouveau modèle 2024. Servo Filter pour réduire les vibrations. Contrôle précis.',
    year: 2024,
    color: 'Olive Green'
  },

  // TECNIFIBRE
  {
    id: 'tecnifibre-tfight-305-rs',
    brand: 'Tecnifibre',
    model: 'TFight 305 RS',
    headSize: 98,
    weight: { unstrung: 305, strung: 323 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 66,
    beamWidth: '22mm',
    swingWeight: 327,
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['Baseline', 'All-Court'],
    price: { europe: 270, usa: 270 },
    description: 'RS Section pour plus de stabilité. Dynacore HD pour le confort.',
    proUsage: 'Daniil Medvedev, Iga Swiatek',
    year: 2023,
    color: 'White/Red/Black'
  },
  {
    id: 'tecnifibre-tf40-305',
    brand: 'Tecnifibre',
    model: 'TF40 305',
    headSize: 98,
    weight: { unstrung: 305, strung: 323 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 65,
    beamWidth: '21.7mm',
    swingWeight: 325,
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['All-Court'],
    price: { europe: 250, usa: 250 },
    description: 'Foam Inside pour absorption des chocs. Excellent rapport qualité-prix.',
    year: 2023,
    color: 'White/Blue'
  },

  // PRINCE
  {
    id: 'prince-beast-100-2024',
    brand: 'Prince',
    model: 'Beast 100 (2024)',
    headSize: 100,
    weight: { unstrung: 300, strung: 318 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 68,
    beamWidth: '24mm',
    swingWeight: 320,
    category: 'Power',
    playerLevel: ['Intermediate', 'Advanced'],
    playStyle: ['Baseline'],
    price: { europe: 220, usa: 220 },
    description: 'Textreme x Twaron pour puissance et stabilité. ATS Technology.',
    year: 2024,
    color: 'Black/Green'
  },
  {
    id: 'prince-phantom-100x',
    brand: 'Prince',
    model: 'Phantom 100X',
    headSize: 100,
    weight: { unstrung: 305, strung: 323 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '18x20',
    stiffness: 63,
    beamWidth: '20mm',
    swingWeight: 325,
    category: 'Control',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['All-Court'],
    price: { europe: 240, usa: 240 },
    description: 'TeXtreme x Twaron. Plan de cordage dense pour contrôle maximum.',
    year: 2023,
    color: 'Black/Purple'
  },

  // DUNLOP
  {
    id: 'dunlop-fx-500-2023',
    brand: 'Dunlop',
    model: 'FX 500 2023',
    headSize: 100,
    weight: { unstrung: 300, strung: 318 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 65,
    beamWidth: '23mm',
    swingWeight: 318,
    category: 'Tweener',
    playerLevel: ['Intermediate', 'Advanced'],
    playStyle: ['All-Court'],
    price: { europe: 200, usa: 200 },
    description: 'Power Boost Groove et Flex Booster. Bon rapport qualité-prix.',
    year: 2023,
    color: 'Blue/Black'
  },
  {
    id: 'dunlop-cx-200-tour',
    brand: 'Dunlop',
    model: 'CX 200 Tour 18x20',
    headSize: 95,
    weight: { unstrung: 315, strung: 333 },
    balance: { unstrung: 315, strung: 310 },
    length: 27,
    stringPattern: '18x20',
    stiffness: 65,
    beamWidth: '20mm',
    swingWeight: 328,
    category: 'Classic Player',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['All-Court', 'Serve-Volley'],
    price: { europe: 210, usa: 210 },
    description: 'Sonic Core avec Infinergy. Pour joueurs classiques.',
    year: 2023,
    color: 'Red/Black'
  },

  // VOLKL
  {
    id: 'volkl-v-feel-v1-pro',
    brand: 'Volkl',
    model: 'V-Feel V1 Pro',
    headSize: 98,
    weight: { unstrung: 310, strung: 328 },
    balance: { unstrung: 315, strung: 310 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 64,
    beamWidth: '21mm',
    swingWeight: 325,
    category: 'Modern Player',
    playerLevel: ['Advanced', 'Pro'],
    playStyle: ['All-Court'],
    price: { europe: 190, usa: 190 },
    description: 'REVA technology pour réduction des vibrations. Excellent feel.',
    year: 2023,
    color: 'Black/Yellow'
  },

  // PROKENNEX
  {
    id: 'prokennex-ki-q-tour',
    brand: 'ProKennex',
    model: 'Ki Q+ Tour',
    headSize: 98,
    weight: { unstrung: 315, strung: 333 },
    balance: { unstrung: 315, strung: 310 },
    length: 27,
    stringPattern: '16x20',
    stiffness: 63,
    beamWidth: '20mm',
    swingWeight: 325,
    category: 'Control',
    playerLevel: ['Advanced'],
    playStyle: ['All-Court'],
    price: { europe: 250, usa: 250 },
    description: 'Kinetic technology avec billes de micro-roulement. Réduit les vibrations de 43%.',
    year: 2023,
    color: 'Black/Gold'
  },

  // LACOSTE
  {
    id: 'lacoste-l20l-100',
    brand: 'Lacoste',
    model: 'L20L 100',
    headSize: 100,
    weight: { unstrung: 295, strung: 313 },
    balance: { unstrung: 320, strung: 315 },
    length: 27,
    stringPattern: '16x19',
    stiffness: 66,
    beamWidth: '23mm',
    swingWeight: 315,
    category: 'Tweener',
    playerLevel: ['Intermediate'],
    playStyle: ['All-Court'],
    price: { europe: 180, usa: 180 },
    description: 'Développée avec Tecnifibre. Style et performance.',
    year: 2023,
    color: 'White/Green'
  }
];

// Fonction helper pour filtrer les raquettes
export function filterRacquets(
  racquets: TennisRacquet[],
  filters: {
    category?: string;
    maxWeight?: number;
    minHeadSize?: number;
    maxPrice?: number;
    playerLevel?: string;
    brand?: string;
  }
): TennisRacquet[] {
  return racquets.filter(racquet => {
    if (filters.category && racquet.category !== filters.category) return false;
    if (filters.maxWeight && racquet.weight.unstrung > filters.maxWeight) return false;
    if (filters.minHeadSize && racquet.headSize < filters.minHeadSize) return false;
    if (filters.maxPrice && racquet.price.europe > filters.maxPrice) return false;
    if (filters.playerLevel && !racquet.playerLevel.includes(filters.playerLevel as any)) return false;
    if (filters.brand && racquet.brand !== filters.brand) return false;
    return true;
  });
}

// Fonction pour obtenir une recommandation de raquette
export function getRacquetRecommendation(profile: {
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  style: 'Baseline' | 'All-Court' | 'Serve-Volley' | 'Defensive';
  priority: 'control' | 'power' | 'comfort' | 'spin';
  strength: 'low' | 'medium' | 'high';
}): TennisRacquet[] {
  let filtered = [...racquetsDatabase];
  
  // Filtrage selon le niveau
  filtered = filtered.filter(r => r.playerLevel.includes(profile.level));
  
  // Filtrage selon le style
  filtered = filtered.filter(r => r.playStyle.includes(profile.style));
  
  // Filtrage selon la force physique
  if (profile.strength === 'low') {
    filtered = filtered.filter(r => r.weight.unstrung <= 295);
  } else if (profile.strength === 'medium') {
    filtered = filtered.filter(r => r.weight.unstrung <= 310);
  }
  
  // Tri selon la priorité
  switch (profile.priority) {
    case 'control':
      filtered = filtered.filter(r => r.category === 'Control' || r.category === 'Classic Player');
      break;
    case 'power':
      filtered = filtered.filter(r => r.category === 'Power' || r.category === 'Tweener');
      break;
    case 'comfort':
      filtered = filtered.filter(r => r.stiffness <= 65);
      break;
    case 'spin':
      filtered = filtered.filter(r => r.stringPattern === '16x19' || r.stringPattern === '16x18');
      break;
  }
  
  // Trier par popularité (ceux avec proUsage en premier)
  filtered.sort((a, b) => {
    if (a.proUsage && !b.proUsage) return -1;
    if (!a.proUsage && b.proUsage) return 1;
    return 0;
  });
  
  return filtered.slice(0, 5); // Retourner le top 5
}

// Fonction pour calculer la compatibilité raquette-cordage
export function calculateCompatibility(
  racquet: TennisRacquet,
  stringStiffness: number,
  tension: number
): {
  score: number;
  recommendation: string;
} {
  let score = 70; // Score de base
  let recommendation = '';
  
  // Ajuster selon la rigidité de la raquette et du cordage
  const totalStiffness = racquet.stiffness + (stringStiffness / 4);
  
  if (totalStiffness < 100) {
    score += 15;
    recommendation = 'Excellent confort, bon pour le bras';
  } else if (totalStiffness < 120) {
    score += 10;
    recommendation = 'Bon équilibre contrôle/confort';
  } else if (totalStiffness < 140) {
    score += 5;
    recommendation = 'Contrôle élevé, confort moyen';
  } else {
    score -= 5;
    recommendation = 'Très rigide, attention au tennis elbow';
  }
  
  // Ajuster selon la tension
  if (tension >= 22 && tension <= 26) {
    score += 10;
    recommendation += '. Tension optimale.';
  } else if (tension < 22) {
    score += 5;
    recommendation += '. Tension basse = plus de puissance.';
  } else {
    score += 5;
    recommendation += '. Tension haute = plus de contrôle.';
  }
  
  return { score: Math.min(100, score), recommendation };
}