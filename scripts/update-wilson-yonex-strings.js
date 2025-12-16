/**
 * Script to update Wilson and Yonex strings with complete lineup
 */

const SUPABASE_URL = 'https://yhhdkllbaxuhwrfpsmev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGRrbGxiYXh1aHdyZnBzbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjI0MDEsImV4cCI6MjA4MTMzODQwMX0.2aC_gYZf0xxz6MXi5zcaCH2S64RBaQvXU7a5qiuD0_k';

function generateId(brand, model) {
  return `${brand}-${model}`.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ==================== WILSON STRINGS ====================
const wilsonStrings = [
  // === REVOLVE FAMILY (Polyester) ===
  {
    brand: 'Wilson',
    model: 'Revolve',
    type: 'Polyester',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 220,
    stiffness_by_gauge: { "1.25": 230, "1.30": 222, "1.35": 212 },
    performance: 8.5, control: 8.5, comfort: 7, durability: 8.5, spin: 8.5, power: 7.5,
    tension_min: 22, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Polyester polyvalent avec bon équilibre spin/contrôle. Excellent rapport qualité/prix.',
    pro_usage: null,
    color: 'Green'
  },
  {
    brand: 'Wilson',
    model: 'Revolve Spin',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 225,
    stiffness_by_gauge: { "1.25": 232, "1.30": 220 },
    performance: 8.5, control: 8.5, comfort: 7, durability: 8, spin: 9.5, power: 7.5,
    tension_min: 21, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Version orientée spin du Revolve avec profil hexagonal pour plus d\'accroche.',
    pro_usage: null,
    color: 'Orange'
  },

  // === LUXILON ALU POWER (Wilson owns Luxilon but separate brand) ===
  
  // === SENSATION FAMILY (Multifilament) ===
  {
    brand: 'Wilson',
    model: 'Sensation',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 160,
    stiffness_by_gauge: { "1.25": 168, "1.30": 160, "1.35": 152 },
    performance: 8, control: 7.5, comfort: 9, durability: 7, spin: 7, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 16, price_usd: 18,
    description: 'Multifilament confortable et polyvalent. Bon choix pour joueurs de club.',
    pro_usage: null,
    color: 'Natural'
  },
  {
    brand: 'Wilson',
    model: 'Sensation Control',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 168,
    stiffness_by_gauge: { "1.25": 175, "1.30": 162 },
    performance: 8, control: 8, comfort: 8.5, durability: 7, spin: 7.5, power: 8,
    tension_min: 23, tension_max: 27,
    price_eur: 17, price_usd: 19,
    description: 'Version orientée contrôle du Sensation avec plus de précision.',
    pro_usage: null,
    color: 'Natural/Blue'
  },

  // === NXT FAMILY ===
  {
    brand: 'Wilson',
    model: 'NXT',
    type: 'Multifilament',
    gauges: ['1.24', '1.30'],
    stiffness: 155,
    stiffness_by_gauge: { "1.24": 162, "1.30": 150 },
    performance: 8.5, control: 7.5, comfort: 9.5, durability: 6.5, spin: 7, power: 9,
    tension_min: 24, tension_max: 27,
    price_eur: 22, price_usd: 25,
    description: 'Multifilament premium avec excellent confort et puissance. Proche du boyau naturel.',
    pro_usage: null,
    color: 'Natural'
  },
  {
    brand: 'Wilson',
    model: 'NXT Control',
    type: 'Multifilament',
    gauges: ['1.24', '1.30'],
    stiffness: 162,
    stiffness_by_gauge: { "1.24": 170, "1.30": 158 },
    performance: 8.5, control: 8.5, comfort: 9, durability: 6.5, spin: 7.5, power: 8.5,
    tension_min: 24, tension_max: 27,
    price_eur: 23, price_usd: 26,
    description: 'NXT avec plus de contrôle tout en gardant le confort exceptionnel.',
    pro_usage: null,
    color: 'Natural/Black'
  },
  {
    brand: 'Wilson',
    model: 'NXT Power',
    type: 'Multifilament',
    gauges: ['1.24', '1.30'],
    stiffness: 148,
    stiffness_by_gauge: { "1.24": 155, "1.30": 142 },
    performance: 8.5, control: 7, comfort: 9.5, durability: 6, spin: 7, power: 9.5,
    tension_min: 24, tension_max: 27,
    price_eur: 24, price_usd: 27,
    description: 'NXT orienté puissance pour maximum de dynamisme et confort.',
    pro_usage: null,
    color: 'Natural/Red'
  },
  {
    brand: 'Wilson',
    model: 'NXT Soft',
    type: 'Multifilament',
    gauges: ['1.27'],
    stiffness: 145,
    stiffness_by_gauge: { "1.27": 145 },
    performance: 8, control: 7, comfort: 10, durability: 6, spin: 7, power: 9,
    tension_min: 24, tension_max: 26,
    price_eur: 24, price_usd: 27,
    description: 'La version la plus confortable du NXT pour bras sensibles.',
    pro_usage: null,
    color: 'White'
  },

  // === NATURAL GUT ===
  {
    brand: 'Wilson',
    model: 'Natural Gut',
    type: 'Natural Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 100,
    stiffness_by_gauge: { "1.25": 105, "1.30": 96 },
    performance: 10, control: 8, comfort: 10, durability: 5, spin: 7, power: 9.5,
    tension_min: 25, tension_max: 29,
    price_eur: 42, price_usd: 48,
    description: 'Boyau naturel premium Wilson. Le nec plus ultra en confort et puissance.',
    pro_usage: 'Roger Federer (hybride)',
    color: 'Natural'
  },

  // === CHAMPION'S CHOICE ===
  {
    brand: 'Wilson',
    model: 'Champions Choice',
    type: 'Hybrid',
    gauges: ['1.25/1.30', '1.30/1.30'],
    stiffness: 165,
    stiffness_by_gauge: { "1.25/1.30": 168, "1.30/1.30": 162 },
    performance: 10, control: 9, comfort: 9, durability: 6.5, spin: 8.5, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 38, price_usd: 42,
    description: 'L\'hybride signature de Roger Federer : Luxilon ALU Power Rough en montants, Wilson Natural Gut en travers.',
    pro_usage: 'Roger Federer',
    color: 'Silver/Natural'
  },
  {
    brand: 'Wilson',
    model: 'Champions Choice Duo',
    type: 'Hybrid',
    gauges: ['1.25/1.30'],
    stiffness: 158,
    stiffness_by_gauge: { "1.25/1.30": 158 },
    performance: 9.5, control: 8.5, comfort: 9, durability: 6.5, spin: 8, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 32, price_usd: 36,
    description: 'Version alternative du Champions Choice avec Luxilon Element et Natural Gut.',
    pro_usage: null,
    color: 'Bronze/Natural'
  },

  // === SYNTHETIC GUT POWER ===
  {
    brand: 'Wilson',
    model: 'Synthetic Gut Power',
    type: 'Synthetic Gut',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 180,
    stiffness_by_gauge: { "1.25": 188, "1.30": 180, "1.35": 172 },
    performance: 7.5, control: 7.5, comfort: 8, durability: 8, spin: 6.5, power: 8,
    tension_min: 23, tension_max: 27,
    price_eur: 8, price_usd: 10,
    description: 'Synthetic gut polyvalent et économique. Le best-seller Wilson pour l\'entraînement.',
    pro_usage: null,
    color: 'White'
  },
  {
    brand: 'Wilson',
    model: 'Synthetic Gut Extreme',
    type: 'Synthetic Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 175,
    stiffness_by_gauge: { "1.25": 182, "1.30": 170 },
    performance: 7.5, control: 7, comfort: 8, durability: 7.5, spin: 7, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 9, price_usd: 11,
    description: 'Synthetic gut avec plus de puissance et de dynamisme.',
    pro_usage: null,
    color: 'Gold'
  },

  // === POLY PRO ===
  {
    brand: 'Wilson',
    model: 'Poly Pro',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 235,
    stiffness_by_gauge: { "1.25": 242, "1.30": 230 },
    performance: 8, control: 9, comfort: 6.5, durability: 9, spin: 8, power: 7,
    tension_min: 22, tension_max: 28,
    price_eur: 10, price_usd: 12,
    description: 'Polyester économique pour l\'entraînement. Bonne durabilité.',
    pro_usage: null,
    color: 'Black'
  },

  // === SAVAGE ===
  {
    brand: 'Wilson',
    model: 'Savage',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 228,
    stiffness_by_gauge: { "1.25": 235, "1.30": 222 },
    performance: 8.5, control: 8.5, comfort: 6.5, durability: 8.5, spin: 9, power: 7.5,
    tension_min: 21, tension_max: 27,
    price_eur: 12, price_usd: 14,
    description: 'Polyester avec profil octogonal pour spin accru.',
    pro_usage: null,
    color: 'Lime'
  },

  // === OPTIMUS ===
  {
    brand: 'Wilson',
    model: 'Optimus 16',
    type: 'Synthetic Gut',
    gauges: ['1.30'],
    stiffness: 178,
    stiffness_by_gauge: { "1.30": 178 },
    performance: 7, control: 7.5, comfort: 8, durability: 8, spin: 6.5, power: 7.5,
    tension_min: 23, tension_max: 27,
    price_eur: 7, price_usd: 9,
    description: 'Synthetic gut économique pour débutants et entraînement.',
    pro_usage: null,
    color: 'White'
  },

  // === ELEMENT ===
  {
    brand: 'Wilson',
    model: 'Element',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 195,
    stiffness_by_gauge: { "1.25": 202, "1.30": 190 },
    performance: 8.5, control: 8, comfort: 8, durability: 8, spin: 8, power: 8.5,
    tension_min: 22, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Polyester souple avec bon confort. Idéal pour hybrides.',
    pro_usage: null,
    color: 'Bronze'
  },

  // === VELOCITY ===
  {
    brand: 'Wilson',
    model: 'Velocity',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 152,
    stiffness_by_gauge: { "1.25": 158, "1.30": 148 },
    performance: 7.5, control: 7, comfort: 9, durability: 6.5, spin: 7, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Multifilament accessible avec bon confort pour joueurs occasionnels.',
    pro_usage: null,
    color: 'White'
  },

  // === ZONE PRO ===
  {
    brand: 'Wilson',
    model: 'Zone Pro',
    type: 'Polyester',
    gauges: ['1.23', '1.28'],
    stiffness: 215,
    stiffness_by_gauge: { "1.23": 225, "1.28": 210 },
    performance: 8.5, control: 8.5, comfort: 7.5, durability: 8, spin: 8.5, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 15, price_usd: 17,
    description: 'Polyester moderne avec bon toucher et spin.',
    pro_usage: null,
    color: 'Black/Blue'
  },

  // === CONTROL DUO ===
  {
    brand: 'Wilson',
    model: 'Duo Control',
    type: 'Hybrid',
    gauges: ['1.25/1.30'],
    stiffness: 188,
    stiffness_by_gauge: { "1.25/1.30": 188 },
    performance: 8.5, control: 8.5, comfort: 8, durability: 7.5, spin: 8, power: 8,
    tension_min: 22, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Set hybride Luxilon Element (montants) + Wilson NXT (travers) pour équilibre parfait.',
    pro_usage: null,
    color: 'Bronze/Natural'
  },

  // === POWER DUO ===
  {
    brand: 'Wilson',
    model: 'Duo Power',
    type: 'Hybrid',
    gauges: ['1.25/1.25'],
    stiffness: 175,
    stiffness_by_gauge: { "1.25/1.25": 175 },
    performance: 8.5, control: 8, comfort: 8.5, durability: 7, spin: 8, power: 9,
    tension_min: 22, tension_max: 27,
    price_eur: 20, price_usd: 22,
    description: 'Set hybride orienté puissance avec confort.',
    pro_usage: null,
    color: 'Silver/Natural'
  }
];

// ==================== YONEX STRINGS ====================
const yonexStrings = [
  // === POLY TOUR FAMILY (Polyester) ===
  {
    brand: 'Yonex',
    model: 'Poly Tour Pro',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 220,
    stiffness_by_gauge: { "1.15": 235, "1.20": 228, "1.25": 220, "1.30": 210 },
    performance: 9.5, control: 9, comfort: 7.5, durability: 8, spin: 9, power: 8,
    tension_min: 20, tension_max: 26,
    price_eur: 16, price_usd: 18,
    description: 'Polyester premium avec excellent toucher et contrôle. Le best-seller Yonex.',
    pro_usage: 'Stan Wawrinka, Nick Kyrgios',
    color: 'Graphite'
  },
  {
    brand: 'Yonex',
    model: 'Poly Tour Strike',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 235,
    stiffness_by_gauge: { "1.20": 245, "1.25": 238, "1.30": 228 },
    performance: 9, control: 9.5, comfort: 6.5, durability: 8.5, spin: 9, power: 7,
    tension_min: 21, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Polyester rigide pour contrôle maximal et frappe précise.',
    pro_usage: 'Angelique Kerber',
    color: 'Iron Grey'
  },
  {
    brand: 'Yonex',
    model: 'Poly Tour Rev',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 210,
    stiffness_by_gauge: { "1.20": 220, "1.25": 212, "1.30": 202 },
    performance: 9, control: 8.5, comfort: 8, durability: 8, spin: 10, power: 8,
    tension_min: 20, tension_max: 26,
    price_eur: 17, price_usd: 19,
    description: 'Polyester orienté spin avec profil octogonal pour maximum de rotation.',
    pro_usage: 'Casper Ruud',
    color: 'Purple'
  },
  {
    brand: 'Yonex',
    model: 'Poly Tour Fire',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 205,
    stiffness_by_gauge: { "1.20": 215, "1.25": 208, "1.30": 198 },
    performance: 9, control: 8, comfort: 8, durability: 7.5, spin: 9, power: 9,
    tension_min: 20, tension_max: 26,
    price_eur: 17, price_usd: 19,
    description: 'Polyester orienté puissance avec bon spin. Explosif et dynamique.',
    pro_usage: null,
    color: 'Red'
  },
  {
    brand: 'Yonex',
    model: 'Poly Tour Tough',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 245,
    stiffness_by_gauge: { "1.25": 245 },
    performance: 8.5, control: 9.5, comfort: 6, durability: 10, spin: 8, power: 6.5,
    tension_min: 22, tension_max: 28,
    price_eur: 15, price_usd: 17,
    description: 'Polyester ultra-durable pour les gros casseurs de cordage.',
    pro_usage: null,
    color: 'White'
  },
  {
    brand: 'Yonex',
    model: 'Poly Tour Spin',
    type: 'Polyester',
    gauges: ['1.20', '1.25'],
    stiffness: 218,
    stiffness_by_gauge: { "1.20": 228, "1.25": 215 },
    performance: 9, control: 8.5, comfort: 7, durability: 8, spin: 10, power: 7.5,
    tension_min: 20, tension_max: 26,
    price_eur: 16, price_usd: 18,
    description: 'Polyester avec profil 5 côtés pour un spin extrême.',
    pro_usage: null,
    color: 'Cobalt Blue'
  },
  {
    brand: 'Yonex',
    model: 'Poly Tour Spin G',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 215,
    stiffness_by_gauge: { "1.25": 215 },
    performance: 9, control: 8.5, comfort: 7.5, durability: 8, spin: 10, power: 8,
    tension_min: 20, tension_max: 26,
    price_eur: 17, price_usd: 19,
    description: 'Evolution du Poly Tour Spin avec silicone pour meilleur snapback.',
    pro_usage: null,
    color: 'Dark Gun Metallic'
  },
  {
    brand: 'Yonex',
    model: 'Poly Tour Air',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 195,
    stiffness_by_gauge: { "1.25": 195 },
    performance: 8.5, control: 8, comfort: 8.5, durability: 7.5, spin: 8.5, power: 8.5,
    tension_min: 21, tension_max: 26,
    price_eur: 17, price_usd: 19,
    description: 'Polyester souple pour confort accru sans sacrifier le spin.',
    pro_usage: null,
    color: 'Sky Blue'
  },

  // === REXIS FAMILY (Multifilament) ===
  {
    brand: 'Yonex',
    model: 'Rexis',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 155,
    stiffness_by_gauge: { "1.25": 162, "1.30": 150 },
    performance: 8.5, control: 8, comfort: 9.5, durability: 6.5, spin: 7.5, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 20, price_usd: 22,
    description: 'Multifilament premium avec technologie SIF pour un toucher exceptionnel.',
    pro_usage: null,
    color: 'White'
  },
  {
    brand: 'Yonex',
    model: 'Rexis Comfort',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 145,
    stiffness_by_gauge: { "1.25": 152, "1.30": 140 },
    performance: 8, control: 7.5, comfort: 10, durability: 6, spin: 7, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 22, price_usd: 24,
    description: 'Le multifilament le plus confortable de Yonex. Idéal pour bras sensibles.',
    pro_usage: null,
    color: 'Off White'
  },
  {
    brand: 'Yonex',
    model: 'Rexis Speed',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 160,
    stiffness_by_gauge: { "1.25": 168, "1.30": 155 },
    performance: 8.5, control: 8, comfort: 9, durability: 7, spin: 8, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 21, price_usd: 23,
    description: 'Multifilament orienté performance avec plus de dynamisme.',
    pro_usage: null,
    color: 'White/Silver'
  },

  // === DYNAWIRE ===
  {
    brand: 'Yonex',
    model: 'Dynawire',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 165,
    stiffness_by_gauge: { "1.25": 172, "1.30": 160 },
    performance: 8, control: 8, comfort: 8.5, durability: 7.5, spin: 7.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 16, price_usd: 18,
    description: 'Multifilament polyvalent avec bon équilibre entre confort et contrôle.',
    pro_usage: null,
    color: 'White/Gold'
  },

  // === TOUR SUPER ===
  {
    brand: 'Yonex',
    model: 'Tour Super 850',
    type: 'Synthetic Gut',
    gauges: ['1.27', '1.32'],
    stiffness: 185,
    stiffness_by_gauge: { "1.27": 192, "1.32": 180 },
    performance: 7.5, control: 8, comfort: 7.5, durability: 8, spin: 7, power: 7.5,
    tension_min: 23, tension_max: 27,
    price_eur: 10, price_usd: 12,
    description: 'Synthetic gut polyvalent et durable. Bon pour l\'entraînement.',
    pro_usage: null,
    color: 'White'
  },
  {
    brand: 'Yonex',
    model: 'Tour Super 850 Pro',
    type: 'Synthetic Gut',
    gauges: ['1.27', '1.32'],
    stiffness: 180,
    stiffness_by_gauge: { "1.27": 188, "1.32": 175 },
    performance: 8, control: 8, comfort: 8, durability: 8, spin: 7, power: 8,
    tension_min: 23, tension_max: 27,
    price_eur: 12, price_usd: 14,
    description: 'Version améliorée du Tour Super avec meilleur toucher.',
    pro_usage: null,
    color: 'Pearl White'
  },

  // === NATURAL GUT ===
  {
    brand: 'Yonex',
    model: 'Natural Gut',
    type: 'Natural Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 95,
    stiffness_by_gauge: { "1.25": 100, "1.30": 92 },
    performance: 10, control: 8, comfort: 10, durability: 5, spin: 7, power: 9.5,
    tension_min: 25, tension_max: 29,
    price_eur: 45, price_usd: 50,
    description: 'Boyau naturel premium Yonex. Confort et puissance exceptionnels.',
    pro_usage: null,
    color: 'Natural'
  },

  // === V-CON ===
  {
    brand: 'Yonex',
    model: 'V-Con',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 158,
    stiffness_by_gauge: { "1.25": 165, "1.30": 152 },
    performance: 8, control: 8, comfort: 9, durability: 7, spin: 7.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Multifilament accessible avec bon confort et toucher.',
    pro_usage: null,
    color: 'White'
  },

  // === AEROBITE ===
  {
    brand: 'Yonex',
    model: 'Aerobite',
    type: 'Hybrid',
    gauges: ['1.27/1.32'],
    stiffness: 205,
    stiffness_by_gauge: { "1.27/1.32": 205 },
    performance: 8.5, control: 8.5, comfort: 7, durability: 7.5, spin: 9.5, power: 7.5,
    tension_min: 21, tension_max: 26,
    price_eur: 18, price_usd: 20,
    description: 'Set hybride avec montants spin et travers confort pour maximum de rotation.',
    pro_usage: null,
    color: 'Red/White'
  },

  // === AERON SUPER ===
  {
    brand: 'Yonex',
    model: 'Aeron Super 850',
    type: 'Synthetic Gut',
    gauges: ['1.27'],
    stiffness: 178,
    stiffness_by_gauge: { "1.27": 178 },
    performance: 7, control: 7.5, comfort: 8, durability: 8.5, spin: 6.5, power: 7.5,
    tension_min: 23, tension_max: 27,
    price_eur: 8, price_usd: 10,
    description: 'Synthetic gut économique et durable pour débutants.',
    pro_usage: null,
    color: 'White'
  },

  // === POLY AIR ===
  {
    brand: 'Yonex',
    model: 'Poly Air Rush',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 200,
    stiffness_by_gauge: { "1.25": 200 },
    performance: 8.5, control: 8, comfort: 8, durability: 8, spin: 8.5, power: 8.5,
    tension_min: 21, tension_max: 26,
    price_eur: 15, price_usd: 17,
    description: 'Polyester équilibré avec bon confort pour joueurs polyvalents.',
    pro_usage: null,
    color: 'Blue'
  }
];

// Combine all strings
const allStrings = [...wilsonStrings, ...yonexStrings];

// Normalize data
const normalizedData = allStrings.map(s => ({
  id: generateId(s.brand, s.model),
  brand: s.brand,
  model: s.model,
  type: s.type,
  gauges: s.gauges,
  stiffness: s.stiffness,
  performance: s.performance,
  control: s.control,
  comfort: s.comfort,
  durability: s.durability,
  spin: s.spin,
  power: s.power,
  tension_min: s.tension_min,
  tension_max: s.tension_max,
  price_eur: s.price_eur,
  price_usd: s.price_usd,
  description: s.description + (s.stiffness_by_gauge ? `\n\nRigidité par jauge: ${Object.entries(s.stiffness_by_gauge).map(([g, v]) => `${g}mm: ${v} lb/in`).join(', ')}` : ''),
  pro_usage: s.pro_usage,
  color: s.color
}));

async function deleteExisting(brand) {
  console.log(`🗑️  Suppression des cordages ${brand} existants...`);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.${brand}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  console.log(`   Status: ${response.status}`);
}

async function insertData() {
  console.log(`\n📦 Insertion de ${normalizedData.length} cordages (Wilson + Yonex)...`);
  
  let success = 0;
  let failed = 0;
  
  for (const item of normalizedData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/strings`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(item)
    });
    
    if (response.ok) {
      success++;
      console.log(`   ✓ ${item.brand} ${item.model}`);
    } else {
      failed++;
      const text = await response.text();
      console.error(`   ✗ ${item.brand} ${item.model}: ${text}`);
    }
  }
  
  console.log(`\n✅ Insertions réussies: ${success}, Échecs: ${failed}`);
}

async function showResults(brand) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.${brand}&select=model,type,stiffness,gauges&order=type,model`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  
  console.log(`\n=== CORDAGES ${brand.toUpperCase()} ===\n`);
  
  const byType = {};
  data.forEach(s => {
    if (!byType[s.type]) byType[s.type] = [];
    byType[s.type].push(s);
  });
  
  Object.keys(byType).sort().forEach(type => {
    console.log(`--- ${type.toUpperCase()} ---`);
    byType[type].forEach(s => {
      console.log(`  • ${s.model} (RA: ${s.stiffness}) - Jauges: ${s.gauges.join(', ')}`);
    });
    console.log('');
  });
  
  console.log(`Total ${brand}: ${data.length} cordages`);
}

async function showGlobalStats() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?select=brand,type`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  
  const byBrand = {};
  const byType = {};
  data.forEach(s => {
    byBrand[s.brand] = (byBrand[s.brand] || 0) + 1;
    byType[s.type] = (byType[s.type] || 0) + 1;
  });
  
  console.log('\n========================================');
  console.log('=== STATISTIQUES GLOBALES FINALES ===');
  console.log('========================================\n');
  console.log('TOTAL CORDAGES:', data.length);
  console.log('');
  console.log('PAR MARQUE:');
  Object.keys(byBrand).sort((a, b) => byBrand[b] - byBrand[a]).forEach(brand => {
    console.log(`  ${brand}: ${byBrand[brand]}`);
  });
  console.log('');
  console.log('PAR TYPE:');
  Object.keys(byType).sort((a, b) => byType[b] - byType[a]).forEach(type => {
    console.log(`  ${type}: ${byType[type]}`);
  });
}

async function main() {
  console.log('🎾 Mise à jour des cordages Wilson et Yonex\n');
  
  await deleteExisting('Wilson');
  await deleteExisting('Yonex');
  await insertData();
  await showResults('Wilson');
  await showResults('Yonex');
  await showGlobalStats();
  
  console.log('\n🎉 Mise à jour terminée !');
}

main().catch(console.error);
