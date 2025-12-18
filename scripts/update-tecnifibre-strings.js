/**
 * Script to update Tecnifibre strings with complete lineup
 * Including Black Code, Razor Code, Ice Code, Red Code, X-One, TGV, NRG2, etc.
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

// Tecnifibre complete string lineup
const tecnifibreStrings = [
  // === BLACK CODE FAMILY (Polyester) ===
  {
    brand: 'Tecnifibre',
    model: 'Black Code',
    type: 'Polyester',
    gauges: ['1.18', '1.24', '1.28', '1.32'],
    stiffness: 210,
    stiffness_by_gauge: { "1.18": 225, "1.24": 215, "1.28": 208, "1.32": 198 },
    performance: 9, control: 9, comfort: 7, durability: 8.5, spin: 9, power: 7.5,
    tension_min: 21, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Polyester pentagonal signature de Tecnifibre. Excellent spin et contrôle à prix accessible.',
    pro_usage: null,
    color: 'Black'
  },
  {
    brand: 'Tecnifibre',
    model: 'Black Code 4S',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 218,
    stiffness_by_gauge: { "1.20": 228, "1.25": 220, "1.30": 210 },
    performance: 9, control: 9, comfort: 7, durability: 8, spin: 10, power: 7,
    tension_min: 21, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Profil carré à 4 arêtes pour un spin maximal. Accroche exceptionnelle sur la balle.',
    pro_usage: null,
    color: 'Black'
  },

  // === RAZOR CODE FAMILY ===
  {
    brand: 'Tecnifibre',
    model: 'Razor Code',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 200,
    stiffness_by_gauge: { "1.20": 212, "1.25": 202, "1.30": 192 },
    performance: 9, control: 8.5, comfort: 8, durability: 8, spin: 9, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 15, price_usd: 17,
    description: 'Polyester souple avec excellent toucher. Bon compromis entre spin et confort.',
    pro_usage: 'Daniil Medvedev',
    color: 'White'
  },
  {
    brand: 'Tecnifibre',
    model: 'Razor Soft',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 185,
    stiffness_by_gauge: { "1.20": 195, "1.25": 188, "1.30": 178 },
    performance: 8.5, control: 8, comfort: 8.5, durability: 7.5, spin: 8.5, power: 8.5,
    tension_min: 21, tension_max: 26,
    price_eur: 16, price_usd: 18,
    description: 'Version assouplie du Razor Code pour plus de confort et de puissance.',
    pro_usage: null,
    color: 'Carbon Grey'
  },

  // === ICE CODE ===
  {
    brand: 'Tecnifibre',
    model: 'Ice Code',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 195,
    stiffness_by_gauge: { "1.20": 205, "1.25": 198, "1.30": 188 },
    performance: 9, control: 8.5, comfort: 8, durability: 8, spin: 9, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 16, price_usd: 18,
    description: 'Polyester avec technologie Thermocore pour un confort amélioré. Excellent spin.',
    pro_usage: 'Iga Swiatek',
    color: 'White/Ice Blue'
  },

  // === RED CODE FAMILY ===
  {
    brand: 'Tecnifibre',
    model: 'Red Code',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 230,
    stiffness_by_gauge: { "1.20": 242, "1.25": 232, "1.30": 222 },
    performance: 8.5, control: 9.5, comfort: 6.5, durability: 9, spin: 8.5, power: 7,
    tension_min: 22, tension_max: 28,
    price_eur: 12, price_usd: 14,
    description: 'Polyester rigide pour un contrôle maximal. Idéal pour les gros frappeurs.',
    pro_usage: null,
    color: 'Red'
  },
  {
    brand: 'Tecnifibre',
    model: 'Pro Red Code',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 225,
    stiffness_by_gauge: { "1.20": 235, "1.25": 228, "1.30": 218 },
    performance: 9, control: 9, comfort: 7, durability: 8.5, spin: 9, power: 7.5,
    tension_min: 22, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Version améliorée du Red Code avec meilleur toucher et spin accru.',
    pro_usage: null,
    color: 'Red'
  },
  {
    brand: 'Tecnifibre',
    model: 'Pro Red Code Wax',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 220,
    stiffness_by_gauge: { "1.20": 230, "1.25": 222, "1.30": 212 },
    performance: 9, control: 9, comfort: 7.5, durability: 8, spin: 9, power: 7.5,
    tension_min: 22, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Pro Red Code avec traitement cire pour plus de glissement et de confort.',
    pro_usage: null,
    color: 'Red'
  },

  // === MULTIFEEL ===
  {
    brand: 'Tecnifibre',
    model: 'Multifeel',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 155,
    stiffness_by_gauge: { "1.25": 162, "1.30": 155, "1.35": 148 },
    performance: 8, control: 7.5, comfort: 9.5, durability: 6.5, spin: 7, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Multifilament polyvalent avec excellent confort. Idéal pour les bras sensibles.',
    pro_usage: null,
    color: 'Natural'
  },

  // === NRG2 ===
  {
    brand: 'Tecnifibre',
    model: 'NRG2',
    type: 'Multifilament',
    gauges: ['1.24', '1.32'],
    stiffness: 148,
    stiffness_by_gauge: { "1.24": 155, "1.32": 142 },
    performance: 8.5, control: 7.5, comfort: 10, durability: 6, spin: 7, power: 9,
    tension_min: 24, tension_max: 27,
    price_eur: 22, price_usd: 25,
    description: 'Multifilament premium avec PU inside pour un confort proche du boyau naturel.',
    pro_usage: null,
    color: 'Natural'
  },

  // === X-ONE BIPHASE ===
  {
    brand: 'Tecnifibre',
    model: 'X-One Biphase',
    type: 'Multifilament',
    gauges: ['1.18', '1.24', '1.30'],
    stiffness: 160,
    stiffness_by_gauge: { "1.18": 170, "1.24": 162, "1.30": 152 },
    performance: 9, control: 8, comfort: 9.5, durability: 6.5, spin: 7.5, power: 9,
    tension_min: 23, tension_max: 27,
    price_eur: 25, price_usd: 28,
    description: 'Le multifilament haut de gamme de Tecnifibre. Toucher exceptionnel proche du boyau.',
    pro_usage: 'Justine Henin (ancienne)',
    color: 'Natural/Red'
  },

  // === TGV ===
  {
    brand: 'Tecnifibre',
    model: 'TGV',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 145,
    stiffness_by_gauge: { "1.25": 152, "1.30": 145, "1.35": 138 },
    performance: 8, control: 7.5, comfort: 10, durability: 6, spin: 7, power: 9.5,
    tension_min: 23, tension_max: 27,
    price_eur: 24, price_usd: 27,
    description: 'Multifilament ultra-confortable avec technologie Thermocore. Puissance et douceur.',
    pro_usage: null,
    color: 'Natural/Pink'
  },

  // === TRIAX ===
  {
    brand: 'Tecnifibre',
    model: 'Triax',
    type: 'Multifilament',
    gauges: ['1.28', '1.33'],
    stiffness: 165,
    stiffness_by_gauge: { "1.28": 172, "1.33": 160 },
    performance: 8.5, control: 8, comfort: 9, durability: 7, spin: 7.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 20, price_usd: 22,
    description: 'Multifilament à 3 composants pour un bon équilibre confort/contrôle/durabilité.',
    pro_usage: null,
    color: 'Natural'
  },

  // === HDX TOUR ===
  {
    brand: 'Tecnifibre',
    model: 'HDX Tour',
    type: 'Multifilament',
    gauges: ['1.24', '1.30'],
    stiffness: 170,
    stiffness_by_gauge: { "1.24": 178, "1.30": 165 },
    performance: 8, control: 8.5, comfort: 8.5, durability: 7.5, spin: 7.5, power: 8,
    tension_min: 23, tension_max: 27,
    price_eur: 16, price_usd: 18,
    description: 'Multifilament avec bon contrôle et confort. Excellent rapport qualité/prix.',
    pro_usage: null,
    color: 'White/Blue'
  },

  // === SYNTHETIC GUT ===
  {
    brand: 'Tecnifibre',
    model: 'Synthetic Gut',
    type: 'Synthetic Gut',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 185,
    stiffness_by_gauge: { "1.25": 192, "1.30": 185, "1.35": 178 },
    performance: 7, control: 7.5, comfort: 7.5, durability: 8, spin: 6.5, power: 7.5,
    tension_min: 23, tension_max: 27,
    price_eur: 8, price_usd: 10,
    description: 'Synthetic gut polyvalent et économique pour l\'entraînement.',
    pro_usage: null,
    color: 'White'
  },

  // === DURAMIX HD ===
  {
    brand: 'Tecnifibre',
    model: 'Duramix HD',
    type: 'Multifilament',
    gauges: ['1.25', '1.30', '1.35'],
    stiffness: 175,
    stiffness_by_gauge: { "1.25": 182, "1.30": 175, "1.35": 168 },
    performance: 7.5, control: 8, comfort: 8, durability: 8, spin: 7, power: 8,
    tension_min: 23, tension_max: 27,
    price_eur: 12, price_usd: 14,
    description: 'Multifilament durable avec bon équilibre pour joueurs de club.',
    pro_usage: null,
    color: 'White'
  },

  // === RUFF CODE ===
  {
    brand: 'Tecnifibre',
    model: 'Ruff Code',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 215,
    stiffness_by_gauge: { "1.25": 222, "1.30": 210 },
    performance: 8.5, control: 8.5, comfort: 7, durability: 8, spin: 9.5, power: 7.5,
    tension_min: 21, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Polyester texturé pour un maximum de spin et d\'accroche.',
    pro_usage: null,
    color: 'Orange'
  },

  // === ATP RAZOR CODE ===
  {
    brand: 'Tecnifibre',
    model: 'ATP Razor Code',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 202,
    stiffness_by_gauge: { "1.20": 212, "1.25": 205, "1.30": 195 },
    performance: 9.5, control: 9, comfort: 8, durability: 8, spin: 9, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 18, price_usd: 20,
    description: 'Version officielle ATP du Razor Code. Performance tour.',
    pro_usage: 'Joueurs ATP',
    color: 'Carbon'
  },

  // === NATURAL GUT ===
  {
    brand: 'Tecnifibre',
    model: 'TGut',
    type: 'Natural Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 92,
    stiffness_by_gauge: { "1.25": 98, "1.30": 88 },
    performance: 10, control: 8, comfort: 10, durability: 5, spin: 7, power: 9.5,
    tension_min: 25, tension_max: 29,
    price_eur: 45, price_usd: 50,
    description: 'Boyau naturel premium Tecnifibre. Confort et puissance exceptionnels.',
    pro_usage: null,
    color: 'Natural'
  },

  // === XR3 ===
  {
    brand: 'Tecnifibre',
    model: 'XR3',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 158,
    stiffness_by_gauge: { "1.25": 165, "1.30": 152 },
    performance: 8.5, control: 8, comfort: 9, durability: 7, spin: 7.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 19, price_usd: 21,
    description: 'Multifilament avec âme en polyuréthane pour un excellent toucher.',
    pro_usage: null,
    color: 'Natural/Black'
  },

  // === PRO PLAYER ===
  {
    brand: 'Tecnifibre',
    model: 'Pro Players',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 208,
    stiffness_by_gauge: { "1.25": 215, "1.30": 202 },
    performance: 9, control: 9, comfort: 7.5, durability: 8, spin: 9, power: 8,
    tension_min: 21, tension_max: 27,
    price_eur: 16, price_usd: 18,
    description: 'Polyester conçu pour les joueurs de compétition. Bon équilibre performance/confort.',
    pro_usage: null,
    color: 'Black/Yellow'
  },

  // === 4S CODE ===
  {
    brand: 'Tecnifibre',
    model: '4S',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 222,
    stiffness_by_gauge: { "1.20": 232, "1.25": 225, "1.30": 215 },
    performance: 9, control: 9, comfort: 7, durability: 8.5, spin: 10, power: 7,
    tension_min: 21, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Polyester à profil carré pour spin extrême. Similaire au Black Code 4S.',
    pro_usage: null,
    color: 'Black'
  },

  // === DYNAMIX ===
  {
    brand: 'Tecnifibre',
    model: 'Dynamix VP',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 168,
    stiffness_by_gauge: { "1.25": 175, "1.30": 162 },
    performance: 8, control: 8, comfort: 8.5, durability: 7, spin: 7.5, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Multifilament polyvalent avec bon équilibre entre les caractéristiques.',
    pro_usage: null,
    color: 'White/Green'
  },

  // === E-MATRIX ===
  {
    brand: 'Tecnifibre',
    model: 'E-Matrix',
    type: 'Multifilament',
    gauges: ['1.26', '1.32'],
    stiffness: 162,
    stiffness_by_gauge: { "1.26": 168, "1.32": 158 },
    performance: 7.5, control: 7.5, comfort: 9, durability: 7, spin: 7, power: 8.5,
    tension_min: 23, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Multifilament accessible avec bon confort pour joueurs occasionnels.',
    pro_usage: null,
    color: 'White'
  },

  // === HYBRID SETS ===
  {
    brand: 'Tecnifibre',
    model: 'Hybrid Razor Code + X-One',
    type: 'Hybrid',
    gauges: ['1.25/1.24', '1.30/1.30'],
    stiffness: 180,
    stiffness_by_gauge: { "1.25/1.24": 182, "1.30/1.30": 172 },
    performance: 9.5, control: 8.5, comfort: 9, durability: 7, spin: 8.5, power: 8.5,
    tension_min: 22, tension_max: 26,
    price_eur: 22, price_usd: 25,
    description: 'Set hybride officiel : Razor Code en montants, X-One Biphase en travers.',
    pro_usage: null,
    color: 'White/Red'
  },
  {
    brand: 'Tecnifibre',
    model: 'Hybrid Ice Code + NRG2',
    type: 'Hybrid',
    gauges: ['1.25/1.24'],
    stiffness: 172,
    stiffness_by_gauge: { "1.25/1.24": 172 },
    performance: 9, control: 8.5, comfort: 9.5, durability: 7, spin: 8.5, power: 9,
    tension_min: 22, tension_max: 26,
    price_eur: 22, price_usd: 25,
    description: 'Set hybride : Ice Code pour le spin, NRG2 pour le confort et la puissance.',
    pro_usage: null,
    color: 'Ice Blue/Natural'
  }
];

// Normalize data
const normalizedData = tecnifibreStrings.map(s => ({
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

async function deleteExistingTecnifibre() {
  console.log('🗑️  Suppression des cordages Tecnifibre existants...');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Tecnifibre`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  console.log('   Status:', response.status);
}

async function insertData() {
  console.log(`\n📦 Insertion de ${normalizedData.length} cordages Tecnifibre...`);
  
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
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Tecnifibre&select=model,type,stiffness,gauges&order=type,model`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  
  console.log('\n=== CORDAGES TECNIFIBRE DANS LA BASE ===\n');
  
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
  
  console.log(`Total: ${data.length} cordages Tecnifibre`);
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
  console.log('🎾 Mise à jour des cordages Tecnifibre\n');
  
  await deleteExistingTecnifibre();
  await insertData();
  await showResults();
  await showGlobalStats();
  
  console.log('\n🎉 Mise à jour terminée !');
}

main().catch(console.error);
