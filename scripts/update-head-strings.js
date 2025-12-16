/**
 * Script to update Head strings with complete lineup
 * Including Hawk family, Lynx family, Sonic Pro, Velocity, RIP Control, etc.
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

// Head complete string lineup
const headStrings = [
  // === HAWK FAMILY (Polyester) ===
  {
    brand: 'Head',
    model: 'Hawk',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 215,
    stiffness_by_gauge: { "1.20": 225, "1.25": 218, "1.30": 208 },
    performance: 8.5, control: 9, comfort: 7, durability: 9, spin: 8.5, power: 7,
    tension_min: 22, tension_max: 27,
    price_eur: 12, price_usd: 14,
    description: 'Polyester polyvalent et économique. Bon contrôle et durabilité pour les casseurs de cordage.',
    pro_usage: null,
    color: 'Grey'
  },
  {
    brand: 'Head',
    model: 'Hawk Touch',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 200,
    stiffness_by_gauge: { "1.15": 212, "1.20": 205, "1.25": 198, "1.30": 190 },
    performance: 9, control: 9, comfort: 8, durability: 8, spin: 8.5, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 16, price_usd: 18,
    description: 'Version premium du Hawk avec plus de confort et de toucher. Excellent compromis performance/confort.',
    pro_usage: 'Novak Djokovic (hybride), Andy Murray (hybride)',
    color: 'Anthracite'
  },
  {
    brand: 'Head',
    model: 'Hawk Power',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 195,
    stiffness_by_gauge: { "1.25": 202, "1.30": 190 },
    performance: 8.5, control: 8, comfort: 8, durability: 8, spin: 8, power: 9,
    tension_min: 22, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Hawk orienté puissance avec plus de dynamisme et de confort.',
    pro_usage: null,
    color: 'Blue'
  },
  {
    brand: 'Head',
    model: 'Hawk Rough',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 212,
    stiffness_by_gauge: { "1.25": 212 },
    performance: 8.5, control: 8.5, comfort: 7, durability: 8.5, spin: 9.5, power: 7.5,
    tension_min: 22, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Hawk avec surface texturée pour plus de spin et d\'accroche sur la balle.',
    pro_usage: null,
    color: 'Grey'
  },

  // === LYNX FAMILY ===
  {
    brand: 'Head',
    model: 'Lynx',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 225,
    stiffness_by_gauge: { "1.20": 235, "1.25": 228, "1.30": 218 },
    performance: 9, control: 9, comfort: 6.5, durability: 8.5, spin: 9, power: 7.5,
    tension_min: 21, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Polyester co-poly avec excellent spin et contrôle. Populaire sur le circuit.',
    pro_usage: 'Borna Coric',
    color: 'Yellow'
  },
  {
    brand: 'Head',
    model: 'Lynx Tour',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 210,
    stiffness_by_gauge: { "1.20": 220, "1.25": 212, "1.30": 202 },
    performance: 9.5, control: 9, comfort: 7.5, durability: 8, spin: 9.5, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 16, price_usd: 18,
    description: 'Version tour du Lynx avec plus de confort et un toucher amélioré. Excellent spin.',
    pro_usage: 'Alexander Zverev, Jannik Sinner',
    color: 'Champagne'
  },
  {
    brand: 'Head',
    model: 'Lynx Edge',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 218,
    stiffness_by_gauge: { "1.25": 218 },
    performance: 9, control: 9, comfort: 7, durability: 8, spin: 10, power: 7.5,
    tension_min: 21, tension_max: 26,
    price_eur: 15, price_usd: 17,
    description: 'Profil carré pour un spin maximal. Excellent snapback et accroche.',
    pro_usage: null,
    color: 'Blue'
  },

  // === SONIC PRO FAMILY ===
  {
    brand: 'Head',
    model: 'Sonic Pro',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 235,
    stiffness_by_gauge: { "1.25": 242, "1.30": 230 },
    performance: 8.5, control: 9, comfort: 6.5, durability: 9, spin: 8, power: 7,
    tension_min: 22, tension_max: 28,
    price_eur: 11, price_usd: 13,
    description: 'Polyester économique avec bon contrôle et durabilité. Idéal pour l\'entraînement.',
    pro_usage: null,
    color: 'Black'
  },
  {
    brand: 'Head',
    model: 'Sonic Pro Edge',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 230,
    stiffness_by_gauge: { "1.25": 238, "1.30": 225 },
    performance: 8.5, control: 9, comfort: 6.5, durability: 8.5, spin: 9, power: 7,
    tension_min: 22, tension_max: 28,
    price_eur: 12, price_usd: 14,
    description: 'Sonic Pro avec profil angulaire pour plus de spin à prix accessible.',
    pro_usage: null,
    color: 'Blue'
  },

  // === GRAVITY ===
  {
    brand: 'Head',
    model: 'Gravity',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 205,
    stiffness_by_gauge: { "1.20": 215, "1.25": 208, "1.30": 198 },
    performance: 9, control: 8.5, comfort: 8, durability: 8, spin: 9, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 15, price_usd: 17,
    description: 'Cordage signature de la gamme Gravity. Confort et spin pour jeu moderne.',
    pro_usage: 'Alexander Zverev',
    color: 'Teal/Lime'
  },
  {
    brand: 'Head',
    model: 'Gravity Hybrid',
    type: 'Hybrid',
    gauges: ['1.25/1.30'],
    stiffness: 178,
    stiffness_by_gauge: { "1.25/1.30": 178 },
    performance: 9, control: 8.5, comfort: 8.5, durability: 7.5, spin: 8.5, power: 8.5,
    tension_min: 22, tension_max: 26,
    price_eur: 22, price_usd: 25,
    description: 'Set hybride Gravity poly + multi pour un excellent équilibre confort/performance.',
    pro_usage: null,
    color: 'Teal/White'
  },

  // === RIP CONTROL ===
  {
    brand: 'Head',
    model: 'RIP Control',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 165,
    stiffness_by_gauge: { "1.25": 172, "1.30": 160 },
    performance: 8, control: 8, comfort: 9, durability: 7, spin: 7.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Multifilament avec bon contrôle et confort. Idéal pour joueurs cherchant du toucher.',
    pro_usage: null,
    color: 'Black'
  },

  // === VELOCITY MLT ===
  {
    brand: 'Head',
    model: 'Velocity MLT',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 155,
    stiffness_by_gauge: { "1.25": 162, "1.30": 150 },
    performance: 8, control: 7.5, comfort: 9.5, durability: 6.5, spin: 7, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 20, price_usd: 22,
    description: 'Multifilament premium pour maximum de confort et puissance. Sensation proche du boyau.',
    pro_usage: null,
    color: 'Natural/Yellow'
  },

  // === REFLEX MLT ===
  {
    brand: 'Head',
    model: 'Reflex MLT',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 160,
    stiffness_by_gauge: { "1.25": 168, "1.30": 155 },
    performance: 7.5, control: 8, comfort: 9, durability: 7, spin: 7, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Multifilament accessible avec bon équilibre confort et contrôle.',
    pro_usage: null,
    color: 'Natural'
  },

  // === FXP ===
  {
    brand: 'Head',
    model: 'FXP',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 150,
    stiffness_by_gauge: { "1.25": 158, "1.30": 145 },
    performance: 8, control: 7.5, comfort: 9.5, durability: 6.5, spin: 7, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 22, price_usd: 25,
    description: 'Multifilament haut de gamme avec fibre FXP pour un confort exceptionnel.',
    pro_usage: null,
    color: 'Gold'
  },
  {
    brand: 'Head',
    model: 'FXP Tour',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 158,
    stiffness_by_gauge: { "1.25": 165, "1.30": 152 },
    performance: 8.5, control: 8, comfort: 9, durability: 7, spin: 7.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 24, price_usd: 27,
    description: 'Version tour du FXP avec plus de contrôle tout en gardant le confort.',
    pro_usage: null,
    color: 'Gold'
  },

  // === SYNTHETIC GUT ===
  {
    brand: 'Head',
    model: 'Synthetic Gut PPS',
    type: 'Synthetic Gut',
    gauges: ['1.24', '1.30'],
    stiffness: 185,
    stiffness_by_gauge: { "1.24": 192, "1.30": 180 },
    performance: 7, control: 7.5, comfort: 7.5, durability: 8, spin: 6.5, power: 7.5,
    tension_min: 23, tension_max: 27,
    price_eur: 8, price_usd: 10,
    description: 'Synthetic gut polyvalent et économique avec technologie PPS pour plus de durabilité.',
    pro_usage: null,
    color: 'White'
  },
  {
    brand: 'Head',
    model: 'Synthetic Gut Spiral',
    type: 'Synthetic Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 180,
    stiffness_by_gauge: { "1.25": 188, "1.30": 175 },
    performance: 7.5, control: 7.5, comfort: 8, durability: 7.5, spin: 7, power: 8,
    tension_min: 23, tension_max: 27,
    price_eur: 9, price_usd: 11,
    description: 'Synthetic gut avec construction spirale pour meilleur confort et dynamisme.',
    pro_usage: null,
    color: 'White/Blue'
  },

  // === MASTER ===
  {
    brand: 'Head',
    model: 'Master',
    type: 'Polyester',
    gauges: ['1.27'],
    stiffness: 245,
    stiffness_by_gauge: { "1.27": 245 },
    performance: 8.5, control: 9.5, comfort: 6, durability: 9.5, spin: 8, power: 6.5,
    tension_min: 23, tension_max: 28,
    price_eur: 10, price_usd: 12,
    description: 'Polyester économique et durable. Bon pour l\'entraînement intensif.',
    pro_usage: null,
    color: 'Red'
  },

  // === PERFECT POWER ===
  {
    brand: 'Head',
    model: 'Perfect Power',
    type: 'Synthetic Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 175,
    stiffness_by_gauge: { "1.25": 182, "1.30": 170 },
    performance: 7.5, control: 7.5, comfort: 8, durability: 7.5, spin: 6.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 10, price_usd: 12,
    description: 'Synthetic gut orienté puissance pour joueurs récréatifs.',
    pro_usage: null,
    color: 'White'
  },

  // === INTELLITOUR ===
  {
    brand: 'Head',
    model: 'IntelliTour',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 145,
    stiffness_by_gauge: { "1.25": 152, "1.30": 140 },
    performance: 8.5, control: 8, comfort: 9.5, durability: 6, spin: 7, power: 9,
    tension_min: 23, tension_max: 26,
    price_eur: 25, price_usd: 28,
    description: 'Multifilament premium avec technologie Intellifiber pour un confort ultime.',
    pro_usage: null,
    color: 'Natural/Gold'
  },

  // === PRIMAL ===
  {
    brand: 'Head',
    model: 'Primal',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 220,
    stiffness_by_gauge: { "1.25": 228, "1.30": 215 },
    performance: 8.5, control: 8.5, comfort: 7.5, durability: 8.5, spin: 8.5, power: 8,
    tension_min: 22, tension_max: 27,
    price_eur: 13, price_usd: 15,
    description: 'Polyester moderne avec bon équilibre entre spin, confort et durabilité.',
    pro_usage: null,
    color: 'Orange'
  },

  // === EVOLUTION PRO ===
  {
    brand: 'Head',
    model: 'Evolution Pro',
    type: 'Polyester',
    gauges: ['1.22', '1.28'],
    stiffness: 208,
    stiffness_by_gauge: { "1.22": 218, "1.28": 202 },
    performance: 9, control: 8.5, comfort: 8, durability: 8, spin: 9, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 15, price_usd: 17,
    description: 'Polyester évolué avec formule souple pour plus de confort sans perdre en spin.',
    pro_usage: null,
    color: 'Purple'
  },

  // === NATURAL GUT ===
  {
    brand: 'Head',
    model: 'Natural Gut',
    type: 'Natural Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 95,
    stiffness_by_gauge: { "1.25": 100, "1.30": 92 },
    performance: 10, control: 8, comfort: 10, durability: 5, spin: 7, power: 9.5,
    tension_min: 25, tension_max: 29,
    price_eur: 42, price_usd: 48,
    description: 'Boyau naturel premium Head. Confort et puissance au plus haut niveau.',
    pro_usage: null,
    color: 'Natural'
  },

  // === HAWK XTREME ===
  {
    brand: 'Head',
    model: 'Hawk Xtreme',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 208,
    stiffness_by_gauge: { "1.25": 215, "1.30": 202 },
    performance: 9, control: 8.5, comfort: 7.5, durability: 8.5, spin: 9.5, power: 8,
    tension_min: 21, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Hawk version spin extrême avec profil optimisé pour maximum de rotation.',
    pro_usage: null,
    color: 'Red'
  },

  // === ULTRA TOUR ===
  {
    brand: 'Head',
    model: 'Ultra Tour',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 202,
    stiffness_by_gauge: { "1.25": 210, "1.30": 198 },
    performance: 9, control: 9, comfort: 7.5, durability: 8, spin: 8.5, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 17, price_usd: 19,
    description: 'Polyester tour avec excellent toucher et contrôle pour joueurs avancés.',
    pro_usage: null,
    color: 'Blue/Black'
  },

  // === TRIUMPHANT ===
  {
    brand: 'Head',
    model: 'Triumphant',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 215,
    stiffness_by_gauge: { "1.25": 222, "1.30": 210 },
    performance: 8.5, control: 9, comfort: 7, durability: 8.5, spin: 8.5, power: 7.5,
    tension_min: 22, tension_max: 27,
    price_eur: 13, price_usd: 15,
    description: 'Polyester polyvalent avec bon rapport qualité/prix.',
    pro_usage: null,
    color: 'Green'
  }
];

// Normalize data
const normalizedData = headStrings.map(s => ({
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

async function deleteExistingHead() {
  console.log('🗑️  Suppression des cordages Head existants...');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Head`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  console.log('   Status:', response.status);
}

async function insertData() {
  console.log(`\n📦 Insertion de ${normalizedData.length} cordages Head...`);
  
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
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Head&select=model,type,stiffness,gauges&order=type,model`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  
  console.log('\n=== CORDAGES HEAD DANS LA BASE ===\n');
  
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
  
  console.log(`Total: ${data.length} cordages Head`);
}

async function showGlobalStats() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?select=brand`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  
  const byBrand = {};
  data.forEach(s => {
    byBrand[s.brand] = (byBrand[s.brand] || 0) + 1;
  });
  
  console.log('\n=== STATISTIQUES GLOBALES ===\n');
  console.log('Total cordages:', data.length);
  console.log('');
  Object.keys(byBrand).sort().forEach(brand => {
    console.log(`  ${brand}: ${byBrand[brand]}`);
  });
}

async function main() {
  console.log('🎾 Mise à jour des cordages Head\n');
  
  await deleteExistingHead();
  await insertData();
  await showResults();
  await showGlobalStats();
  
  console.log('\n🎉 Mise à jour terminée !');
}

main().catch(console.error);
