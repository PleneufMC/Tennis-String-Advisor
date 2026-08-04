// Base de données complète des cordages de tennis - Top 50 2025

export interface TennisString {
  id: string;
  brand: string;
  model: string;
  type: 'Polyester' | 'Multifilament' | 'Natural Gut' | 'Synthetic' | 'Hybrid' | 'Biodegradable';
  gauges: string[];
  stiffness: number; // lb/in
  performance: number; // /10
  control: number; // /10
  comfort: number; // /10
  durability: number; // /10
  versatility: number; // /10
  innovation: number; // /10
  spin: number; // /10
  power: number; // /10
  recommendedTension: {
    min: number; // kg
    max: number; // kg
  };
  price: {
    europe: number; // EUR
    usa: number; // USD
  };
  description: string;
  proUsage?: string;
  color?: string;
}

export const stringsDatabase: TennisString[] = [
  {
    id: 'luxilon-alu-power',
    brand: 'Luxilon',
    model: 'ALU Power',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 230,
    performance: 9.8,
    control: 9.5,
    comfort: 7.0,
    durability: 9.0,
    versatility: 9.5,
    innovation: 8.0,
    spin: 8.5,
    power: 7.5,
    recommendedTension: { min: 23, max: 29 },
    price: { europe: 20, usa: 20 },
    description: 'Le standard absolu du tennis professionnel. Co-polyester avec aluminium pour un contrôle chirurgical.',
    proUsage: '20% des joueurs ATP Top 50',
    color: 'Silver'
  },
  {
    id: 'solinco-hyper-g',
    brand: 'Solinco',
    model: 'Hyper-G',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 218,
    performance: 9.5,
    control: 9.0,
    comfort: 8.5,
    durability: 8.5,
    versatility: 9.0,
    innovation: 8.5,
    spin: 9.0,
    power: 8.0,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 15, usa: 15 },
    description: 'Le "sea of green" du circuit. Polyester confortable avec excellent snapback pour le spin.',
    proUsage: 'Populaire chez les jeunes pros',
    color: 'Green'
  },
  {
    id: 'babolat-rpm-blast',
    brand: 'Babolat',
    model: 'RPM Blast',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30', '1.35'],
    stiffness: 240,
    performance: 9.2,
    control: 9.0,
    comfort: 7.5,
    durability: 8.0,
    versatility: 8.5,
    innovation: 8.0,
    spin: 9.5,
    power: 7.0,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 18, usa: 18 },
    description: 'Le cordage de Rafael Nadal. Octogonal pour un spin maximum.',
    proUsage: 'Rafael Nadal, Dominic Thiem',
    color: 'Black'
  },
  {
    id: 'luxilon-4g',
    brand: 'Luxilon',
    model: '4G',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 265,
    performance: 9.0,
    control: 10.0,
    comfort: 7.0,
    durability: 9.5,
    versatility: 8.5,
    innovation: 8.0,
    spin: 8.0,
    power: 6.5,
    recommendedTension: { min: 24, max: 30 },
    price: { europe: 22, usa: 22 },
    description: 'Contrôle absolu avec maintien de tension exceptionnel. Pour frappeurs lourds.',
    proUsage: 'Stefanos Tsitsipas',
    color: 'Gold'
  },
  {
    id: 'head-lynx-tour',
    brand: 'Head',
    model: 'Lynx Tour',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 210,
    performance: 8.5,
    control: 9.0,
    comfort: 8.0,
    durability: 8.5,
    versatility: 9.0,
    innovation: 7.5,
    spin: 8.5,
    power: 7.5,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 16, usa: 16 },
    description: 'Hexagonal pour un équilibre parfait entre contrôle et spin.',
    proUsage: 'Alexander Zverev',
    color: 'Grey'
  },
  {
    id: 'solinco-tour-bite',
    brand: 'Solinco',
    model: 'Tour Bite',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 255,
    performance: 9.0,
    control: 10.0,
    comfort: 6.5,
    durability: 9.0,
    versatility: 8.0,
    innovation: 8.0,
    spin: 9.5,
    power: 6.0,
    recommendedTension: { min: 22, max: 28 },
    price: { europe: 15, usa: 15 },
    description: '4 arêtes pour un grip et spin maximum. Contrôle extrême.',
    color: 'Silver'
  },
  {
    id: 'wilson-champions-choice',
    brand: 'Wilson',
    model: "Champion's Choice",
    type: 'Hybrid',
    gauges: ['1.25/1.30'],
    stiffness: 165,
    performance: 8.5,
    control: 9.0,
    comfort: 9.0,
    durability: 9.0,
    versatility: 9.5,
    innovation: 7.5,
    spin: 8.0,
    power: 8.5,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 45, usa: 45 },
    description: 'Setup de Roger Federer : boyau naturel en montants, ALU Power Rough en travers.',
    proUsage: 'Roger Federer (retraité)',
    color: 'Natural/Silver'
  },
  {
    id: 'babolat-vs-touch',
    brand: 'Babolat',
    model: 'VS Touch',
    type: 'Natural Gut',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 95,
    performance: 9.5,
    control: 8.0,
    comfort: 9.5,
    durability: 10.0,
    versatility: 8.5,
    innovation: 7.0,
    spin: 7.5,
    power: 9.5,
    recommendedTension: { min: 23, max: 32 },
    price: { europe: 48, usa: 48 },
    description: 'Le meilleur boyau naturel avec technologie Thermogut. Sensation incomparable.',
    proUsage: 'Nombreux pros en hybride',
    color: 'Natural'
  },
  {
    id: 'solinco-mach-10',
    brand: 'Solinco',
    model: 'Mach-10',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 195,
    performance: 9.5,
    control: 8.5,
    comfort: 8.0,
    durability: 9.5,
    versatility: 8.5,
    innovation: 10.0,
    spin: 8.5,
    power: 8.5,
    recommendedTension: { min: 20, max: 25 },
    price: { europe: 65, usa: 65 },
    description: 'Innovation CloudForm révolutionnaire. Premier cordage envoyé dans l\'espace.',
    color: 'Blue'
  },
  {
    id: 'msv-focus-hex',
    brand: 'MSV',
    model: 'Focus Hex',
    type: 'Polyester',
    gauges: ['1.18', '1.23', '1.27'],
    stiffness: 235,
    performance: 8.0,
    control: 9.5,
    comfort: 7.0,
    durability: 9.0,
    versatility: 8.5,
    innovation: 8.0,
    spin: 9.0,
    power: 7.0,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 12, usa: 14 },
    description: 'Excellence allemande. Hexagonal pour contrôle et spin à prix abordable.',
    color: 'Black'
  },
  {
    id: 'tecnifibre-x-one-biphase',
    brand: 'Tecnifibre',
    model: 'X-One Biphase',
    type: 'Multifilament',
    gauges: ['1.18', '1.24', '1.30'],
    stiffness: 160,
    performance: 9.0,
    control: 7.0,
    comfort: 8.5,
    durability: 7.5,
    versatility: 8.5,
    innovation: 8.0,
    spin: 7.0,
    power: 9.0,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 25, usa: 25 },
    description: 'Technologie Biphase pour 20% de puissance en plus. Confort exceptionnel.',
    color: 'Red'
  },
  {
    id: 'head-reflex-mlt',
    brand: 'Head',
    model: 'Reflex MLT',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 170,
    performance: 7.5,
    control: 7.0,
    comfort: 8.5,
    durability: 8.0,
    versatility: 9.0,
    innovation: 7.0,
    spin: 6.5,
    power: 8.0,
    recommendedTension: { min: 20, max: 25 },
    price: { europe: 18, usa: 18 },
    description: 'Excellent rapport qualité-prix en multifilament. Idéal club et compétition.',
    color: 'Natural'
  },
  {
    id: 'yonex-poly-tour-pro',
    brand: 'Yonex',
    model: 'Poly Tour Pro',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 220,
    performance: 8.0,
    control: 8.5,
    comfort: 7.5,
    durability: 8.5,
    versatility: 8.5,
    innovation: 7.5,
    spin: 8.0,
    power: 7.5,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 16, usa: 16 },
    description: 'Polyester équilibré japonais. Très populaire en Asie.',
    color: 'Yellow'
  },
  {
    id: 'kirschbaum-pro-line-evolution',
    brand: 'Kirschbaum',
    model: 'Pro Line Evolution',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 225,
    performance: 8.0,
    control: 8.5,
    comfort: 7.0,
    durability: 9.0,
    versatility: 8.0,
    innovation: 8.0,
    spin: 8.0,
    power: 7.0,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 10, usa: 12 },
    description: 'Qualité allemande au meilleur prix. Excellent maintien de tension.',
    color: 'White'
  },
  {
    id: 'signum-pro-x-perience',
    brand: 'Signum Pro',
    model: 'X-Perience',
    type: 'Polyester',
    gauges: ['1.18', '1.24', '1.30'],
    stiffness: 205,
    performance: 8.5,
    control: 9.0,
    comfort: 8.0,
    durability: 8.0,
    versatility: 8.5,
    innovation: 7.5,
    spin: 8.5,
    power: 7.5,
    recommendedTension: { min: 22, max: 26 },
    price: { europe: 11, usa: 13 },
    description: 'Référence allemande rapport qualité-prix. Très apprécié en Europe.',
    color: 'Orange'
  },
  {
    id: 'wilson-nxt-soft',
    brand: 'Wilson',
    model: 'NXT Soft',
    type: 'Multifilament',
    gauges: ['1.24', '1.30'],
    stiffness: 155,
    performance: 8.0,
    control: 6.5,
    comfort: 9.0,
    durability: 7.5,
    versatility: 8.5,
    innovation: 9.0,
    spin: 6.0,
    power: 8.5,
    recommendedTension: { min: 20, max: 25 },
    price: { europe: 22, usa: 22 },
    description: 'Innovation 2025 : +30% d\'allongement, +9% absorption des vibrations.',
    color: 'Natural'
  },
  {
    id: 'luxilon-element',
    brand: 'Luxilon',
    model: 'Element',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 190,
    performance: 8.0,
    control: 8.0,
    comfort: 8.5,
    durability: 7.5,
    versatility: 8.5,
    innovation: 9.0,
    spin: 7.5,
    power: 8.0,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 20, usa: 20 },
    description: 'Multi-Mono technology : sensation multifilament dans structure monofilament.',
    color: 'Bronze'
  },
  {
    id: 'solinco-confidential',
    brand: 'Solinco',
    model: 'Confidential',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 245,
    performance: 7.5,
    control: 9.5,
    comfort: 7.5,
    durability: 10.0,
    versatility: 8.0,
    innovation: 7.5,
    spin: 8.5,
    power: 6.5,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 15, usa: 15 },
    description: 'Maintien de tension exceptionnel. Pour joueurs cherchant la constance.',
    color: 'Grey'
  },
  {
    id: 'head-hawk-touch',
    brand: 'Head',
    model: 'Hawk Touch',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 215,
    performance: 8.0,
    control: 9.0,
    comfort: 7.0,
    durability: 8.5,
    versatility: 8.5,
    innovation: 7.0,
    spin: 8.5,
    power: 7.0,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 16, usa: 16 },
    description: 'Version plus souple du Hawk standard. Bon compromis contrôle/confort.',
    color: 'Anthracite'
  },
  {
    id: 'tecnifibre-black-code-4s',
    brand: 'Tecnifibre',
    model: 'Black Code 4S',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 200,
    performance: 8.5,
    control: 8.5,
    comfort: 7.5,
    durability: 8.0,
    versatility: 8.0,
    innovation: 8.0,
    spin: 9.0,
    power: 7.5,
    recommendedTension: { min: 22, max: 26 },
    price: { europe: 18, usa: 18 },
    description: 'Section carrée pour spin maximum. Thermocore technology.',
    color: 'Black'
  },
  // Ajoutons les 30 autres cordages de manière plus concise
  {
    id: 'weiss-cannon-ultra-cable',
    brand: 'Weiss Cannon',
    model: 'Ultra Cable',
    type: 'Polyester',
    gauges: ['1.18', '1.23'],
    stiffness: 250,
    performance: 8.0,
    control: 8.0,
    comfort: 6.5,
    durability: 8.5,
    versatility: 7.5,
    innovation: 8.5,
    spin: 9.5,
    power: 6.0,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 13, usa: 15 },
    description: 'Champion spin selon Tennis Warehouse. Texture unique.',
    color: 'White'
  },
  {
    id: 'wilson-natural-gut',
    brand: 'Wilson',
    model: 'Natural Gut',
    type: 'Natural Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 100,
    performance: 9.0,
    control: 7.5,
    comfort: 9.0,
    durability: 10.0,
    versatility: 8.0,
    innovation: 6.5,
    spin: 7.0,
    power: 9.0,
    recommendedTension: { min: 23, max: 30 },
    price: { europe: 42, usa: 42 },
    description: 'Boyau naturel premium Wilson. Excellence en puissance et confort.',
    color: 'Natural'
  },
  {
    id: 'isospeed-cream',
    brand: 'Isospeed',
    model: 'Cream',
    type: 'Polyester',
    gauges: ['1.20', '1.28'],
    stiffness: 165,
    performance: 7.0,
    control: 8.0,
    comfort: 9.5,
    durability: 8.0,
    versatility: 8.5,
    innovation: 7.5,
    spin: 7.5,
    power: 8.0,
    recommendedTension: { min: 20, max: 25 },
    price: { europe: 14, usa: 16 },
    description: 'Le polyester le plus doux du marché. Parfait pour transition du multi au poly.',
    color: 'Cream'
  },
  {
    id: 'tecnifibre-tgv',
    brand: 'Tecnifibre',
    model: 'TGV',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 145,
    performance: 7.0,
    control: 6.5,
    comfort: 9.5,
    durability: 7.0,
    versatility: 8.0,
    innovation: 7.0,
    spin: 6.0,
    power: 8.5,
    recommendedTension: { min: 19, max: 24 },
    price: { europe: 24, usa: 24 },
    description: 'PU400 technology : 400% d\'élasticité. Le plus confortable des multifilaments.',
    color: 'Pink'
  },
  {
    id: 'prince-synthetic-gut',
    brand: 'Prince',
    model: 'Synthetic Gut Duraflex',
    type: 'Synthetic',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 185,
    performance: 7.0,
    control: 6.5,
    comfort: 7.5,
    durability: 8.0,
    versatility: 8.5,
    innovation: 6.0,
    spin: 6.0,
    power: 7.5,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 8, usa: 8 },
    description: 'Le meilleur cordage budget. Valeur sûre pour tous niveaux.',
    color: 'White'
  },

  // ===== AJOUTS GAMMES PRINCIPALES (mise à jour Tennis Warehouse) =====

  // SOLINCO
  {
    id: 'solinco-tour-bite-soft',
    brand: 'Solinco',
    model: 'Tour Bite Soft',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 200,
    performance: 9.0,
    control: 8.5,
    comfort: 8.0,
    durability: 8.0,
    versatility: 8.5,
    innovation: 8.0,
    spin: 9.0,
    power: 8.0,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 14, usa: 14 },
    description: 'Version assouplie du Tour Bite : spin agressif des arêtes vives avec plus de confort.',
    color: 'Silver'
  },
  {
    id: 'solinco-hyper-g-soft',
    brand: 'Solinco',
    model: 'Hyper-G Soft',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 200,
    performance: 9.3,
    control: 8.8,
    comfort: 8.8,
    durability: 8.0,
    versatility: 9.0,
    innovation: 8.5,
    spin: 9.0,
    power: 8.2,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 16, usa: 16 },
    description: 'Hyper-G plus souple et confortable, conserve le spin et le snapback signature.',
    color: 'Green'
  },
  {
    id: 'solinco-outlast',
    brand: 'Solinco',
    model: 'Outlast',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 210,
    performance: 8.8,
    control: 9.0,
    comfort: 7.5,
    durability: 9.5,
    versatility: 8.5,
    innovation: 8.0,
    spin: 8.0,
    power: 7.5,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 15, usa: 15 },
    description: 'Polyester axé sur le maintien de tension et la durabilité longue durée.',
    color: 'Blue'
  },

  // LUXILON
  {
    id: 'luxilon-alu-power-soft',
    brand: 'Luxilon',
    model: 'ALU Power Soft',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 210,
    performance: 9.5,
    control: 9.2,
    comfort: 8.0,
    durability: 8.8,
    versatility: 9.3,
    innovation: 8.0,
    spin: 8.5,
    power: 7.8,
    recommendedTension: { min: 22, max: 28 },
    price: { europe: 21, usa: 21 },
    description: 'Version assouplie de l\'ALU Power, contrôle de référence avec plus de confort.',
    color: 'Silver'
  },
  {
    id: 'luxilon-smart',
    brand: 'Luxilon',
    model: 'Smart',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 215,
    performance: 8.8,
    control: 8.8,
    comfort: 7.8,
    durability: 8.5,
    versatility: 8.5,
    innovation: 9.0,
    spin: 8.0,
    power: 8.0,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 22, usa: 22 },
    description: 'Polyester adaptatif : se raidit dans les grosses frappes, plus souple en jeu de toucher.',
    color: 'Silver'
  },
  {
    id: 'luxilon-adrenaline',
    brand: 'Luxilon',
    model: 'Adrenaline',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 205,
    performance: 8.7,
    control: 8.8,
    comfort: 8.3,
    durability: 8.5,
    versatility: 8.5,
    innovation: 7.5,
    spin: 8.0,
    power: 7.8,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 18, usa: 18 },
    description: 'Co-polyester confortable et contrôlé, excellent maintien de tension pour le jeu quotidien.',
    color: 'Bronze'
  },

  // YONEX
  {
    id: 'yonex-poly-tour-strike',
    brand: 'Yonex',
    model: 'Poly Tour Strike',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 215,
    performance: 9.0,
    control: 9.0,
    comfort: 7.5,
    durability: 8.5,
    versatility: 8.5,
    innovation: 8.5,
    spin: 8.5,
    power: 7.5,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 18, usa: 18 },
    description: 'Poly mi-ferme orienté contrôle sur les grandes frappes. Choix de Denis Shapovalov.',
    proUsage: 'Denis Shapovalov',
    color: 'Grey'
  },
  {
    id: 'yonex-poly-tour-rev',
    brand: 'Yonex',
    model: 'Poly Tour Rev',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 205,
    performance: 8.8,
    control: 8.5,
    comfort: 7.8,
    durability: 8.0,
    versatility: 8.5,
    innovation: 8.5,
    spin: 9.2,
    power: 7.8,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 17, usa: 17 },
    description: 'Profil structuré orienté spin et contrôle, faible puissance pour les frappeurs.',
    color: 'Mint Green'
  },
  {
    id: 'yonex-poly-tour-spin',
    brand: 'Yonex',
    model: 'Poly Tour Spin',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 200,
    performance: 8.5,
    control: 8.3,
    comfort: 8.0,
    durability: 8.0,
    versatility: 8.5,
    innovation: 8.0,
    spin: 9.0,
    power: 8.0,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 16, usa: 16 },
    description: 'Profil hexagonal pour maximiser le spin avec un toucher accessible.',
    color: 'Black'
  },

  // TECNIFIBRE
  {
    id: 'tecnifibre-razor-code',
    brand: 'Tecnifibre',
    model: 'Razor Code',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 220,
    performance: 9.0,
    control: 9.0,
    comfort: 7.5,
    durability: 8.5,
    versatility: 8.5,
    innovation: 8.0,
    spin: 8.5,
    power: 7.5,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 17, usa: 17 },
    description: 'Polyester de contrôle réputé pour sa précision et son spin sur les frappes appuyées.',
    color: 'Carbon/Lime'
  },
  {
    id: 'tecnifibre-ice-code',
    brand: 'Tecnifibre',
    model: 'Ice Code',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 221,
    performance: 8.8,
    control: 8.8,
    comfort: 8.0,
    durability: 8.5,
    versatility: 8.5,
    innovation: 8.0,
    spin: 8.3,
    power: 7.8,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 16, usa: 16 },
    description: 'Équilibre puissance/contrôle avec un toucher net et confortable.',
    color: 'White'
  },
  {
    id: 'tecnifibre-multifeel',
    brand: 'Tecnifibre',
    model: 'Multifeel',
    type: 'Multifilament',
    gauges: ['1.30'],
    stiffness: 160,
    performance: 8.2,
    control: 7.5,
    comfort: 9.2,
    durability: 7.0,
    versatility: 8.0,
    innovation: 7.5,
    spin: 6.5,
    power: 8.5,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 14, usa: 14 },
    description: 'Multifilament confortable et puissant, idéal pour bras sensibles et débutants.',
    color: 'Black'
  },

  // HEAD
  {
    id: 'head-lynx-edge',
    brand: 'Head',
    model: 'Lynx Edge',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 205,
    performance: 8.5,
    control: 8.5,
    comfort: 8.0,
    durability: 8.0,
    versatility: 8.5,
    innovation: 7.5,
    spin: 8.8,
    power: 7.8,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 13, usa: 13 },
    description: 'Polyester structuré (profil pentagonal) orienté spin et confort à bon prix.',
    color: 'Anthracite'
  },
  {
    id: 'head-velocity-mlt',
    brand: 'Head',
    model: 'Velocity MLT',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 165,
    performance: 8.0,
    control: 7.5,
    comfort: 9.0,
    durability: 7.0,
    versatility: 8.0,
    innovation: 7.0,
    spin: 6.5,
    power: 8.5,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 13, usa: 13 },
    description: 'Multifilament polyvalent et confortable, bon rapport qualité-prix pour le bras.',
    color: 'Natural'
  },

  // BABOLAT
  {
    id: 'babolat-rpm-blast-rough',
    brand: 'Babolat',
    model: 'RPM Blast Rough',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 235,
    performance: 9.0,
    control: 8.8,
    comfort: 7.3,
    durability: 8.0,
    versatility: 8.3,
    innovation: 8.0,
    spin: 9.7,
    power: 7.0,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 19, usa: 19 },
    description: 'RPM Blast avec surface texturée pour un mordant et un spin encore supérieurs.',
    color: 'Black'
  },
  {
    id: 'babolat-rpm-soft',
    brand: 'Babolat',
    model: 'RPM Soft',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 205,
    performance: 8.7,
    control: 8.5,
    comfort: 8.3,
    durability: 7.8,
    versatility: 8.5,
    innovation: 8.0,
    spin: 9.0,
    power: 7.8,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 18, usa: 18 },
    description: 'Version souple de la gamme RPM, spin et confort pour un poly plus accessible.',
    color: 'Grey'
  },
  {
    id: 'babolat-xcel',
    brand: 'Babolat',
    model: 'Xcel',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 155,
    performance: 8.3,
    control: 7.5,
    comfort: 9.5,
    durability: 7.0,
    versatility: 8.0,
    innovation: 7.5,
    spin: 6.5,
    power: 8.8,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 16, usa: 16 },
    description: 'Multifilament premium ultra-confortable, proche du toucher boyau pour bras fragiles.',
    color: 'Natural'
  },

  // WILSON
  {
    id: 'wilson-revolve',
    brand: 'Wilson',
    model: 'Revolve',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 210,
    performance: 8.3,
    control: 8.3,
    comfort: 7.8,
    durability: 8.0,
    versatility: 8.3,
    innovation: 7.5,
    spin: 8.8,
    power: 7.8,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 12, usa: 12 },
    description: 'Polyester texturé pentagonal axé spin, bon rapport qualité-prix.',
    color: 'Orange'
  },

  // VÖLKL
  {
    id: 'volkl-cyclone',
    brand: 'Völkl',
    model: 'Cyclone',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 215,
    performance: 8.3,
    control: 8.5,
    comfort: 7.5,
    durability: 8.0,
    versatility: 8.0,
    innovation: 7.5,
    spin: 8.8,
    power: 7.5,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 11, usa: 11 },
    description: 'Polyester structuré (6 arêtes) très populaire pour le spin à petit prix.',
    color: 'Black'
  },

  // GOSEN
  {
    id: 'gosen-og-sheep-micro',
    brand: 'Gosen',
    model: 'OG-Sheep Micro',
    type: 'Synthetic',
    gauges: ['1.25', '1.30'],
    stiffness: 175,
    performance: 7.5,
    control: 7.0,
    comfort: 8.0,
    durability: 7.5,
    versatility: 8.5,
    innovation: 6.0,
    spin: 6.5,
    power: 7.8,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 7, usa: 7 },
    description: 'Boyau synthétique économique et polyvalent, valeur sûre pour tous niveaux.',
    color: 'White'
  },

  // GAMMA
  {
    id: 'gamma-moto',
    brand: 'Gamma',
    model: 'Moto',
    type: 'Polyester',
    gauges: ['1.24', '1.29'],
    stiffness: 205,
    performance: 8.3,
    control: 8.3,
    comfort: 7.8,
    durability: 8.0,
    versatility: 8.0,
    innovation: 7.5,
    spin: 9.0,
    power: 7.5,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 12, usa: 12 },
    description: 'Polyester à profil torsadé pour un spin maximal et un snapback marqué.',
    color: 'Orange'
  },

  // DIADEM
  {
    id: 'diadem-solstice-power',
    brand: 'Diadem',
    model: 'Solstice Power',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 200,
    performance: 8.5,
    control: 8.3,
    comfort: 8.3,
    durability: 8.0,
    versatility: 8.5,
    innovation: 8.0,
    spin: 8.5,
    power: 8.3,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 15, usa: 15 },
    description: 'Polyester souple mêlant puissance, confort et spin, apprécié des joueurs all-court.',
    color: 'Black'
  },

  // ============================================================
  // MULTIFILAMENTS — vague de rattrapage (run de sync 20260730)
  // Références relevées chez Tennis Warehouse (Europe) et absentes
  // de cette base jusqu'ici. Notes calées sur les playtests TW
  // (score /100 -> /10) quand ils existent.
  // ============================================================
  {
    id: 'tecnifibre-triax',
    brand: 'Tecnifibre',
    model: 'Triax',
    type: 'Multifilament',
    gauges: ['1.28', '1.33', '1.38'],
    stiffness: 162,
    performance: 8.1,
    control: 8.1,
    comfort: 8.5,
    durability: 7.9,
    versatility: 9.0,
    innovation: 9.0,
    spin: 7.6,
    power: 8.0,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 17, usa: 18 },
    description: 'Multifilament hybride unique : 50% polyamide / 50% fibres polyester (TPI). Le multi le plus orienté contrôle et spin testé par Tennis Warehouse, tout en restant très confortable. La passerelle idéale pour un joueur de poly qui veut préserver son bras.',
    proUsage: 'Recommandé en sortie de tendinite / tennis elbow',
    color: 'Natural'
  },
  {
    id: 'tecnifibre-nrg2',
    brand: 'Tecnifibre',
    model: 'NRG2',
    type: 'Multifilament',
    gauges: ['1.24', '1.32'],
    stiffness: 148,
    performance: 8.4,
    control: 7.2,
    comfort: 9.4,
    durability: 6.8,
    versatility: 8.0,
    innovation: 7.0,
    spin: 6.3,
    power: 8.8,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 18, usa: 18 },
    description: 'Grand classique du confort chez Tecnifibre. Polyuréthane très souple, puissance et toucher proches du boyau. Valeur sûre pour bras sensibles.',
    color: 'Natural'
  },
  {
    id: 'tecnifibre-duramix-hd',
    brand: 'Tecnifibre',
    model: 'Duramix HD',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 170,
    performance: 7.8,
    control: 7.5,
    comfort: 8.3,
    durability: 8.0,
    versatility: 8.0,
    innovation: 6.5,
    spin: 6.8,
    power: 8.0,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 13, usa: 13 },
    description: 'Multifilament renforcé haute densité : le compromis confort / durabilité de la gamme Tecnifibre, pour joueur qui casse un peu.',
    color: 'Natural'
  },
  {
    id: 'wilson-nxt',
    brand: 'Wilson',
    model: 'NXT',
    type: 'Multifilament',
    gauges: ['1.24', '1.30'],
    stiffness: 152,
    performance: 8.5,
    control: 7.6,
    comfort: 8.9,
    durability: 6.4,
    versatility: 8.5,
    innovation: 7.0,
    spin: 7.4,
    power: 8.6,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 23, usa: 24 },
    description: '1600 fibres pour une des meilleures sensations du marché. Puissance et confort généreux, référence historique du multifilament. Durabilité en retrait : à éviter si vous cassez souvent.',
    color: 'Natural'
  },
  {
    id: 'wilson-nxt-power',
    brand: 'Wilson',
    model: 'NXT Power',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 145,
    performance: 8.6,
    control: 7.0,
    comfort: 9.3,
    durability: 6.8,
    versatility: 8.0,
    innovation: 7.5,
    spin: 6.5,
    power: 9.2,
    recommendedTension: { min: 20, max: 25 },
    price: { europe: 24, usa: 24 },
    description: 'La version la plus puissante et la plus souple de la famille NXT. Puissance maximale, idéal pour frappes courtes ou joueur cherchant de la profondeur sans effort.',
    color: 'Natural'
  },
  {
    id: 'wilson-sensation',
    brand: 'Wilson',
    model: 'Sensation',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 165,
    performance: 8.0,
    control: 7.4,
    comfort: 8.6,
    durability: 7.0,
    versatility: 8.3,
    innovation: 6.0,
    spin: 7.2,
    power: 8.4,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 12, usa: 14 },
    description: 'Un des multifilaments les plus anciens et les plus vendus. Puissance proche du NXT pour la moitié du prix : le meilleur rapport qualité/prix du confort.',
    color: 'Natural'
  },
  {
    id: 'wilson-repel',
    brand: 'Wilson',
    model: 'Repel',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 175,
    performance: 7.8,
    control: 7.8,
    comfort: 8.0,
    durability: 8.2,
    versatility: 8.0,
    innovation: 7.5,
    spin: 7.5,
    power: 7.8,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 14, usa: 15 },
    description: 'Multifilament à revêtement anti-abrasion : meilleure tenue et meilleur snapback que la moyenne des multis, donc plus de spin.',
    color: 'Natural'
  },
  {
    id: 'babolat-xalt',
    brand: 'Babolat',
    model: 'Xalt',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 158,
    performance: 8.2,
    control: 7.5,
    comfort: 8.8,
    durability: 7.2,
    versatility: 8.3,
    innovation: 7.5,
    spin: 6.8,
    power: 8.5,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 16, usa: 17 },
    description: 'Multifilament polyamide Babolat orienté confort et puissance, alternative moderne au Xcel.',
    color: 'Natural'
  },
  {
    id: 'babolat-addixion',
    brand: 'Babolat',
    model: 'Addixion',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 168,
    performance: 7.6,
    control: 7.3,
    comfort: 8.4,
    durability: 7.3,
    versatility: 8.0,
    innovation: 6.5,
    spin: 6.8,
    power: 8.2,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 12, usa: 13 },
    description: 'Multifilament d\'entrée de gamme Babolat : confort accessible pour joueur loisir et club.',
    color: 'Natural'
  },
  {
    id: 'babolat-xplore',
    brand: 'Babolat',
    model: 'XPlore',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 178,
    performance: 7.0,
    control: 7.2,
    comfort: 7.8,
    durability: 7.8,
    versatility: 7.5,
    innovation: 5.5,
    spin: 6.5,
    power: 7.8,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 8, usa: 9 },
    description: 'Le multifilament le plus abordable de la gamme Babolat. Bon premier pas hors du synthétique pour un joueur débutant.',
    color: 'Natural'
  },
  {
    id: 'head-rip-control',
    brand: 'Head',
    model: 'RIP Control',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 180,
    performance: 7.8,
    control: 8.3,
    comfort: 7.8,
    durability: 8.0,
    versatility: 8.0,
    innovation: 7.5,
    spin: 7.3,
    power: 7.2,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 9, usa: 10 },
    description: 'Multifilament à fibres enveloppées orienté contrôle : la variante « sèche » du multi, pour joueur qui trouve les multis trop puissants.',
    color: 'Natural'
  },
  {
    id: 'head-velocity-power',
    brand: 'Head',
    model: 'Velocity Power',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 150,
    performance: 8.2,
    control: 7.0,
    comfort: 9.1,
    durability: 7.0,
    versatility: 8.0,
    innovation: 7.5,
    spin: 6.5,
    power: 9.0,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 10, usa: 11 },
    description: 'Déclinaison puissance du Velocity MLT : très souple, beaucoup de profondeur, excellent pour bras fragile.',
    color: 'Natural'
  },
  {
    id: 'solinco-vanquish',
    brand: 'Solinco',
    model: 'Vanquish',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 155,
    performance: 8.3,
    control: 7.5,
    comfort: 9.0,
    durability: 7.2,
    versatility: 8.3,
    innovation: 7.5,
    spin: 7.0,
    power: 8.6,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 11, usa: 12 },
    description: 'Le multifilament confort de Solinco, pensé pour être hybridé avec un Hyper-G ou un Tour Bite en montants.',
    color: 'Natural'
  },
  {
    id: 'solinco-x-natural',
    brand: 'Solinco',
    model: 'X-Natural',
    type: 'Multifilament',
    gauges: ['1.20', '1.30'],
    stiffness: 147,
    performance: 8.4,
    control: 7.3,
    comfort: 9.2,
    durability: 6.8,
    versatility: 8.0,
    innovation: 7.5,
    spin: 6.8,
    power: 8.9,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 13, usa: 14 },
    description: 'Imitation de boyau naturel signée Solinco : toucher et élasticité très proches du gut pour une fraction du prix.',
    color: 'Natural'
  },
  {
    id: 'volkl-power-fiber-ii',
    brand: 'Völkl',
    model: 'Power Fiber II',
    type: 'Multifilament',
    gauges: ['1.25'],
    stiffness: 152,
    performance: 8.3,
    control: 7.4,
    comfort: 9.1,
    durability: 7.0,
    versatility: 8.2,
    innovation: 8.0,
    spin: 7.0,
    power: 8.7,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 14, usa: 15 },
    description: 'Multifilament allemand haut de gamme : confort de premier ordre et très bonne tenue de tension.',
    color: 'Natural'
  },
  {
    id: 'volkl-power-fiber-pro',
    brand: 'Völkl',
    model: 'Power Fiber Pro',
    type: 'Multifilament',
    gauges: ['1.25'],
    stiffness: 165,
    performance: 8.1,
    control: 7.8,
    comfort: 8.5,
    durability: 7.5,
    versatility: 8.2,
    innovation: 7.5,
    spin: 7.2,
    power: 8.3,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 13, usa: 14 },
    description: 'Version plus nerveuse du Power Fiber, un cran plus de contrôle pour joueur de niveau club confirmé.',
    color: 'Natural'
  },
  {
    id: 'prince-premier-control',
    brand: 'Prince',
    model: 'Premier Control',
    type: 'Multifilament',
    gauges: ['1.30', '1.40'],
    stiffness: 176,
    performance: 7.6,
    control: 8.2,
    comfort: 8.0,
    durability: 7.8,
    versatility: 7.8,
    innovation: 6.5,
    spin: 6.8,
    power: 7.4,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 11, usa: 12 },
    description: 'Multifilament Prince orienté contrôle, disponible en grosse jauge 1.40 pour une durabilité maximale.',
    color: 'Natural'
  },
  {
    id: 'kirschbaum-touch-multifiber',
    brand: 'Kirschbaum',
    model: 'Touch Multifiber',
    type: 'Multifilament',
    gauges: ['1.30'],
    stiffness: 160,
    performance: 8.0,
    control: 7.6,
    comfort: 8.8,
    durability: 7.2,
    versatility: 8.0,
    innovation: 7.0,
    spin: 6.8,
    power: 8.4,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 15, usa: 16 },
    description: 'Multifilament artisanal allemand, toucher soyeux et confort marqué. Peu connu mais très apprécié des cordeurs.',
    color: 'Natural'
  },
  {
    id: 'isospeed-professional-classic',
    brand: 'Isospeed',
    model: 'Professional Classic',
    type: 'Multifilament',
    gauges: ['1.20', '1.30'],
    stiffness: 158,
    performance: 8.0,
    control: 7.8,
    comfort: 8.9,
    durability: 7.0,
    versatility: 8.0,
    innovation: 7.5,
    spin: 6.8,
    power: 8.3,
    recommendedTension: { min: 21, max: 26 },
    price: { europe: 11, usa: 12 },
    description: 'Multifilament autrichien réputé pour son amorti : marque historiquement positionnée sur la prévention des blessures.',
    color: 'Natural'
  },
  {
    id: 'isospeed-control-classic',
    brand: 'Isospeed',
    model: 'Control Classic',
    type: 'Multifilament',
    gauges: ['1.30'],
    stiffness: 178,
    performance: 7.8,
    control: 8.4,
    comfort: 8.0,
    durability: 7.6,
    versatility: 7.8,
    innovation: 7.0,
    spin: 7.0,
    power: 7.3,
    recommendedTension: { min: 23, max: 28 },
    price: { europe: 13, usa: 14 },
    description: 'La déclinaison contrôle d\'Isospeed : multifilament sec et précis pour joueur offensif sensible du bras.',
    color: 'Natural'
  },
  {
    id: 'signum-pro-fibercore',
    brand: 'Signum Pro',
    model: 'Fibercore',
    type: 'Multifilament',
    gauges: ['1.30'],
    stiffness: 170,
    performance: 7.5,
    control: 7.6,
    comfort: 8.3,
    durability: 7.5,
    versatility: 7.8,
    innovation: 6.5,
    spin: 6.8,
    power: 8.0,
    recommendedTension: { min: 22, max: 27 },
    price: { europe: 9, usa: 10 },
    description: 'Multifilament économique de la marque allemande Signum Pro : confort correct à petit prix.',
    color: 'Natural'
  },
  {
    id: 'ashaway-dynamite-natural',
    brand: 'Ashaway',
    model: 'Dynamite Natural',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 143,
    performance: 8.2,
    control: 7.0,
    comfort: 9.3,
    durability: 7.4,
    versatility: 7.8,
    innovation: 8.5,
    spin: 6.5,
    power: 9.0,
    recommendedTension: { min: 20, max: 25 },
    price: { europe: 16, usa: 17 },
    description: 'Cordage à âme Zyex : élasticité et tenue de tension exceptionnelles, un des multis les plus doux du marché. Choix de niche pour bras très sensibles.',
    color: 'Optic Green'
  }
];

// Fonction helper pour filtrer les cordages
export function filterStrings(
  strings: TennisString[],
  filters: {
    type?: string;
    maxPrice?: number;
    minComfort?: number;
    minControl?: number;
    minSpin?: number;
  }
): TennisString[] {
  return strings.filter(string => {
    if (filters.type && string.type !== filters.type) return false;
    if (filters.maxPrice && string.price.europe > filters.maxPrice) return false;
    if (filters.minComfort && string.comfort < filters.minComfort) return false;
    if (filters.minControl && string.control < filters.minControl) return false;
    if (filters.minSpin && string.spin < filters.minSpin) return false;
    return true;
  });
}

// Fonction pour calculer le RCS (Recommandation Confort Score)
export function calculateRCS(racquetStiffness: number, stringStiffness: number, tension: number): number {
  // Formule RCS complète incluant raquette, cordage et tension
  // Plus les valeurs sont élevées, plus le RCS est élevé (moins confortable)
  const racquetFactor = racquetStiffness / 70; // Normalise autour de RA 70
  const stringFactor = stringStiffness / 220; // Normalise autour de 220 lb/in
  const tensionFactor = tension / 24; // Normalise autour de 24 kg
  
  const baseRCS = (racquetFactor * 0.4 + stringFactor * 0.4 + tensionFactor * 0.2) * 30;
  return Math.round(baseRCS);
}

// Fonction simple pour obtenir une recommandation basée sur le RCS
export function getStringRecommendation(rcs: number): {
  level: string;
  description: string;
  suggestion: string;
} {
  if (rcs < 20) {
    return {
      level: 'Très Confortable',
      description: 'Configuration très souple, excellente pour le confort du bras',
      suggestion: 'Idéal pour les joueurs avec sensibilité du bras ou recherchant le maximum de confort'
    };
  } else if (rcs < 25) {
    return {
      level: 'Confortable',
      description: 'Bon équilibre entre confort et performance',
      suggestion: 'Convient à la majorité des joueurs récréatifs et intermédiaires'
    };
  } else if (rcs < 30) {
    return {
      level: 'Standard',
      description: 'Configuration équilibrée avec bon contrôle',
      suggestion: 'Approprié pour les joueurs avancés sans problème de bras'
    };
  } else if (rcs < 35) {
    return {
      level: 'Ferme',
      description: 'Configuration rigide favorisant le contrôle',
      suggestion: 'Pour les joueurs expérimentés avec une technique solide'
    };
  } else {
    return {
      level: 'Très Ferme',
      description: 'Configuration très rigide, contrôle maximal',
      suggestion: 'Attention: risque élevé de tennis elbow, réservé aux professionnels'
    };
  }
}

// Fonction complète pour obtenir une recommandation basée sur le profil joueur
export function getStringRecommendationByProfile(profile: {
  level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  style: 'baseline' | 'all-court' | 'serve-volley' | 'defensive';
  priority: 'control' | 'power' | 'comfort' | 'spin' | 'durability';
  armIssues: boolean;
}): TennisString[] {
  let filtered = [...stringsDatabase];
  
  // Filtrage selon le niveau
  if (profile.level === 'beginner') {
    filtered = filtered.filter(s => s.comfort >= 7 && s.stiffness < 200);
  } else if (profile.level === 'intermediate') {
    filtered = filtered.filter(s => s.versatility >= 7.5);
  } else if (profile.level === 'advanced' || profile.level === 'pro') {
    filtered = filtered.filter(s => s.control >= 8);
  }
  
  // Filtrage selon le style
  if (profile.style === 'baseline') {
    filtered = filtered.filter(s => s.spin >= 7.5 && s.control >= 8);
  } else if (profile.style === 'serve-volley') {
    filtered = filtered.filter(s => s.control >= 8.5 && s.comfort >= 7);
  }
  
  // Filtrage selon la priorité
  switch (profile.priority) {
    case 'control':
      filtered.sort((a, b) => b.control - a.control);
      break;
    case 'power':
      filtered.sort((a, b) => b.power - a.power);
      break;
    case 'comfort':
      filtered.sort((a, b) => b.comfort - a.comfort);
      break;
    case 'spin':
      filtered.sort((a, b) => b.spin - a.spin);
      break;
    case 'durability':
      filtered.sort((a, b) => b.durability - a.durability);
      break;
  }
  
  // Si problèmes de bras, filtrer les cordages trop rigides
  if (profile.armIssues) {
    filtered = filtered.filter(s => s.stiffness < 200 && s.comfort >= 8);
  }
  
  return filtered.slice(0, 5); // Retourner le top 5
}