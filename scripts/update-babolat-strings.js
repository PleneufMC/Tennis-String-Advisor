/**
 * Script to update Babolat strings with complete lineup
 * Including RPM family, Xcel, Addiction, Origin, SG, etc.
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

// Babolat complete string lineup
const babolatStrings = [
  // === RPM FAMILY (Polyester) ===
  {
    brand: 'Babolat',
    model: 'RPM Blast',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30', '1.35'],
    stiffness: 240,
    stiffness_by_gauge: { "1.20": 250, "1.25": 242, "1.30": 235, "1.35": 228 },
    performance: 9.5, control: 9.5, comfort: 6.5, durability: 8.5, spin: 10, power: 7,
    tension_min: 21, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Le cordage signature de Rafael Nadal. Polyester octogonal pour un spin extrême et un contrôle maximal.',
    pro_usage: 'Rafael Nadal, Dominic Thiem',
    color: 'Black'
  },
  {
    brand: 'Babolat',
    model: 'RPM Blast Rough',
    type: 'Polyester',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 235,
    stiffness_by_gauge: { "1.25": 240, "1.30": 232, "1.35": 225 },
    performance: 9.5, control: 9, comfort: 6.5, durability: 8, spin: 10, power: 7.5,
    tension_min: 21, tension_max: 27,
    price_eur: 19, price_usd: 21,
    description: 'RPM Blast avec surface texturée pour encore plus d\'accroche et de spin.',
    pro_usage: 'Jo-Wilfried Tsonga',
    color: 'Black'
  },
  {
    brand: 'Babolat',
    model: 'RPM Power',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 220,
    stiffness_by_gauge: { "1.25": 225, "1.30": 215 },
    performance: 9, control: 8, comfort: 7.5, durability: 8, spin: 9, power: 9,
    tension_min: 22, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Polyester orienté puissance avec plus de confort que le RPM Blast. Bon compromis spin/puissance.',
    pro_usage: 'Benoît Paire',
    color: 'Electric Brown'
  },
  {
    brand: 'Babolat',
    model: 'RPM Hurricane',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30', '1.35'],
    stiffness: 255,
    stiffness_by_gauge: { "1.20": 265, "1.25": 258, "1.30": 250, "1.35": 242 },
    performance: 9, control: 10, comfort: 5.5, durability: 9, spin: 9.5, power: 6,
    tension_min: 22, tension_max: 28,
    price_eur: 15, price_usd: 17,
    description: 'Polyester très rigide pour un contrôle maximal. Idéal pour les gros frappeurs cherchant à canaliser leur puissance.',
    pro_usage: null,
    color: 'Yellow'
  },
  {
    brand: 'Babolat',
    model: 'RPM Team',
    type: 'Polyester',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 225,
    stiffness_by_gauge: { "1.25": 232, "1.30": 225, "1.35": 218 },
    performance: 8.5, control: 8.5, comfort: 7, durability: 8.5, spin: 9, power: 8,
    tension_min: 22, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Version plus accessible du RPM Blast avec un bon équilibre entre spin, contrôle et confort.',
    pro_usage: null,
    color: 'Pink'
  },
  {
    brand: 'Babolat',
    model: 'RPM Soft',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 200,
    stiffness_by_gauge: { "1.25": 208, "1.30": 195 },
    performance: 8.5, control: 8, comfort: 8, durability: 7.5, spin: 8.5, power: 8.5,
    tension_min: 22, tension_max: 26,
    price_eur: 17, price_usd: 19,
    description: 'Polyester souple de la gamme RPM. Confort amélioré tout en gardant les caractéristiques de spin.',
    pro_usage: null,
    color: 'Grey'
  },
  {
    brand: 'Babolat',
    model: 'RPM Rough',
    type: 'Polyester',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 235,
    stiffness_by_gauge: { "1.25": 242, "1.30": 235, "1.35": 228 },
    performance: 9, control: 9, comfort: 6.5, durability: 8, spin: 10, power: 7,
    tension_min: 21, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Cordage texturé pour un accrochage maximum de la balle et un spin dévastateur.',
    pro_usage: null,
    color: 'Red'
  },

  // === PRO HURRICANE FAMILY ===
  {
    brand: 'Babolat',
    model: 'Pro Hurricane',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30', '1.35'],
    stiffness: 260,
    stiffness_by_gauge: { "1.20": 272, "1.25": 265, "1.30": 255, "1.35": 248 },
    performance: 8.5, control: 10, comfort: 5, durability: 9.5, spin: 9, power: 5.5,
    tension_min: 23, tension_max: 29,
    price_eur: 12, price_usd: 14,
    description: 'Polyester classique très rigide. Durabilité exceptionnelle et contrôle maximal pour casseurs de cordage.',
    pro_usage: 'Andy Roddick (ancien)',
    color: 'Yellow'
  },
  {
    brand: 'Babolat',
    model: 'Pro Hurricane Tour',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 250,
    stiffness_by_gauge: { "1.20": 260, "1.25": 252, "1.30": 242 },
    performance: 9, control: 9.5, comfort: 6, durability: 9, spin: 9.5, power: 6.5,
    tension_min: 22, tension_max: 28,
    price_eur: 14, price_usd: 16,
    description: 'Version améliorée du Pro Hurricane avec profil octogonal pour plus de spin.',
    pro_usage: null,
    color: 'Yellow'
  },

  // === NATURAL GUT ===
  {
    brand: 'Babolat',
    model: 'VS Touch',
    type: 'Natural Gut',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 95,
    stiffness_by_gauge: { "1.25": 100, "1.30": 95, "1.35": 88 },
    performance: 10, control: 8, comfort: 10, durability: 5, spin: 7, power: 9.5,
    tension_min: 24, tension_max: 28,
    price_eur: 48, price_usd: 55,
    description: 'Le boyau naturel de référence mondiale. Confort ultime, puissance et maintien de tension inégalés.',
    pro_usage: 'Roger Federer, Pete Sampras (anciens)',
    color: 'Natural'
  },
  {
    brand: 'Babolat',
    model: 'VS Team',
    type: 'Natural Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 100,
    stiffness_by_gauge: { "1.25": 105, "1.30": 98 },
    performance: 9.5, control: 8, comfort: 10, durability: 5.5, spin: 7, power: 9,
    tension_min: 24, tension_max: 28,
    price_eur: 38, price_usd: 44,
    description: 'Boyau naturel plus accessible que le VS Touch. Excellent rapport qualité/prix en boyau.',
    pro_usage: null,
    color: 'Natural'
  },

  // === MULTIFILAMENTS ===
  {
    brand: 'Babolat',
    model: 'Xcel',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 145,
    stiffness_by_gauge: { "1.25": 152, "1.30": 145, "1.35": 138 },
    performance: 8.5, control: 7.5, comfort: 9.5, durability: 6.5, spin: 7, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 22, price_usd: 25,
    description: 'Multifilament premium avec excellent confort et puissance. Sensation proche du boyau naturel.',
    pro_usage: 'Kim Clijsters (ancienne)',
    color: 'White'
  },
  {
    brand: 'Babolat',
    model: 'Xcel Power',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 140,
    stiffness_by_gauge: { "1.25": 145, "1.30": 135 },
    performance: 8.5, control: 7, comfort: 9.5, durability: 6, spin: 7, power: 9.5,
    tension_min: 23, tension_max: 26,
    price_eur: 24, price_usd: 27,
    description: 'Version orientée puissance du Xcel avec encore plus de dynamisme.',
    pro_usage: null,
    color: 'Blue'
  },
  {
    brand: 'Babolat',
    model: 'Addiction',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 165,
    stiffness_by_gauge: { "1.25": 172, "1.30": 165, "1.35": 158 },
    performance: 8, control: 8, comfort: 8.5, durability: 7, spin: 7.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 16, price_usd: 18,
    description: 'Multifilament polyvalent avec bon équilibre entre confort, contrôle et durabilité.',
    pro_usage: null,
    color: 'White'
  },
  {
    brand: 'Babolat',
    model: 'Origin',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 155,
    stiffness_by_gauge: { "1.25": 160, "1.30": 150 },
    performance: 8.5, control: 8, comfort: 9, durability: 6.5, spin: 7.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 20, price_usd: 23,
    description: 'Multifilament haut de gamme avec toucher exceptionnel et excellent confort.',
    pro_usage: null,
    color: 'Natural/White'
  },
  {
    brand: 'Babolat',
    model: 'M7',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 150,
    stiffness_by_gauge: { "1.25": 158, "1.30": 150, "1.35": 142 },
    performance: 8, control: 7.5, comfort: 9, durability: 6.5, spin: 7, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Multifilament accessible avec bon confort et puissance. Idéal pour débuter en multifilament.',
    pro_usage: null,
    color: 'White'
  },

  // === SYNTHETIC GUT ===
  {
    brand: 'Babolat',
    model: 'Synthetic Gut',
    type: 'Synthetic Gut',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 185,
    stiffness_by_gauge: { "1.25": 192, "1.30": 185, "1.35": 178 },
    performance: 7, control: 7.5, comfort: 7.5, durability: 7.5, spin: 6.5, power: 7.5,
    tension_min: 23, tension_max: 27,
    price_eur: 8, price_usd: 10,
    description: 'Cordage synthétique polyvalent et économique. Bon pour l\'entraînement et les joueurs occasionnels.',
    pro_usage: null,
    color: 'White'
  },
  {
    brand: 'Babolat',
    model: 'SG SpiralTek',
    type: 'Synthetic Gut',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 180,
    stiffness_by_gauge: { "1.25": 188, "1.30": 180, "1.35": 172 },
    performance: 7.5, control: 7.5, comfort: 8, durability: 7.5, spin: 7, power: 8,
    tension_min: 23, tension_max: 27,
    price_eur: 10, price_usd: 12,
    description: 'Synthetic gut amélioré avec construction spirale pour plus de confort et de puissance.',
    pro_usage: null,
    color: 'White/Yellow'
  },

  // === HYBRID SETS ===
  {
    brand: 'Babolat',
    model: 'Hybrid RPM Blast + VS Touch',
    type: 'Hybrid',
    gauges: ['1.25/1.30', '1.30/1.30'],
    stiffness: 168,  // Average of both strings
    stiffness_by_gauge: { "1.25/1.30": 172, "1.30/1.30": 165 },
    performance: 10, control: 9, comfort: 8.5, durability: 6.5, spin: 9.5, power: 8.5,
    tension_min: 22, tension_max: 26,
    price_eur: 35, price_usd: 40,
    description: 'Combo hybride ultime : RPM Blast en montants pour le spin, VS Touch en travers pour le confort et la puissance.',
    pro_usage: 'Roger Federer',
    color: 'Black/Natural'
  },
  {
    brand: 'Babolat',
    model: 'Hybrid RPM Blast + Xcel',
    type: 'Hybrid',
    gauges: ['1.25/1.25', '1.25/1.30'],
    stiffness: 192,
    stiffness_by_gauge: { "1.25/1.25": 197, "1.25/1.30": 188 },
    performance: 9, control: 8.5, comfort: 8, durability: 7, spin: 9, power: 8,
    tension_min: 22, tension_max: 26,
    price_eur: 22, price_usd: 25,
    description: 'Hybride populaire : spin du RPM Blast avec le confort du Xcel. Excellent compromis.',
    pro_usage: null,
    color: 'Black/White'
  },

  // === TOUCH SERIES ===
  {
    brand: 'Babolat',
    model: 'Touch VS',
    type: 'Natural Gut',
    gauges: ['1.30'],
    stiffness: 92,
    stiffness_by_gauge: { "1.30": 92 },
    performance: 10, control: 8, comfort: 10, durability: 5, spin: 7, power: 9.5,
    tension_min: 25, tension_max: 28,
    price_eur: 55, price_usd: 62,
    description: 'La version ultime du boyau Babolat. Performance et confort au plus haut niveau.',
    pro_usage: null,
    color: 'Natural'
  },
  {
    brand: 'Babolat',
    model: 'Touch Tonic',
    type: 'Natural Gut',
    gauges: ['1.35', '1.40'],
    stiffness: 88,
    stiffness_by_gauge: { "1.35": 92, "1.40": 85 },
    performance: 9.5, control: 7.5, comfort: 10, durability: 5.5, spin: 6.5, power: 9.5,
    tension_min: 24, tension_max: 27,
    price_eur: 42, price_usd: 48,
    description: 'Boyau naturel avec traitement Thermogut pour plus de durabilité. Jauges épaisses disponibles.',
    pro_usage: null,
    color: 'Natural'
  },

  // === IFeel ===
  {
    brand: 'Babolat',
    model: 'iFeel 66',
    type: 'Multifilament',
    gauges: ['1.27'],
    stiffness: 160,
    stiffness_by_gauge: { "1.27": 160 },
    performance: 8, control: 8, comfort: 8.5, durability: 7, spin: 7.5, power: 8,
    tension_min: 23, tension_max: 26,
    price_eur: 14, price_usd: 16,
    description: 'Multifilament accessible avec bon équilibre général. Idéal pour les joueurs de club.',
    pro_usage: null,
    color: 'White'
  },
  {
    brand: 'Babolat',
    model: 'iFeel 68',
    type: 'Multifilament',
    gauges: ['1.30'],
    stiffness: 155,
    stiffness_by_gauge: { "1.30": 155 },
    performance: 7.5, control: 7.5, comfort: 9, durability: 7, spin: 7, power: 8.5,
    tension_min: 23, tension_max: 26,
    price_eur: 14, price_usd: 16,
    description: 'Version plus souple de l\'iFeel pour plus de confort et de puissance.',
    pro_usage: null,
    color: 'White'
  },

  // === REVENGE ===
  {
    brand: 'Babolat',
    model: 'Revenge',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 230,
    stiffness_by_gauge: { "1.25": 238, "1.30": 225 },
    performance: 8, control: 8.5, comfort: 7, durability: 8.5, spin: 8.5, power: 7.5,
    tension_min: 22, tension_max: 27,
    price_eur: 12, price_usd: 14,
    description: 'Polyester polyvalent et accessible. Bon rapport qualité/prix pour les casseurs de cordage.',
    pro_usage: null,
    color: 'Red'
  }
];

// Normalize data
const normalizedData = babolatStrings.map(s => ({
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

async function deleteExistingBabolat() {
  console.log('🗑️  Suppression des cordages Babolat existants...');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Babolat`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  console.log('   Status:', response.status);
}

async function insertData() {
  console.log(`\n📦 Insertion de ${normalizedData.length} cordages Babolat...`);
  
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
      console.log(`   ✓ ${item.model}`);
    } else {
      failed++;
      const text = await response.text();
      console.error(`   ✗ ${item.model}: ${text}`);
    }
  }
  
  console.log(`\n✅ Insertions réussies: ${success}, Échecs: ${failed}`);
}

async function showResults() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Babolat&select=model,type,stiffness,gauges&order=type,model`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  
  console.log('\n=== CORDAGES BABOLAT DANS LA BASE ===\n');
  
  // Group by type
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
  
  console.log(`Total: ${data.length} cordages Babolat`);
}

async function main() {
  console.log('🎾 Mise à jour des cordages Babolat\n');
  
  await deleteExistingBabolat();
  await insertData();
  await showResults();
  
  console.log('\n🎉 Mise à jour terminée !');
}

main().catch(console.error);
