/**
 * Script to update Luxilon strings with complete lineup
 * Including ALU Power family, 4G, Element, Ace, Savage, Natural Gut, etc.
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

// Luxilon complete string lineup
const luxilonStrings = [
  // === ALU POWER FAMILY ===
  {
    brand: 'Luxilon',
    model: 'ALU Power',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30', '1.38'],
    stiffness: 230,
    stiffness_by_gauge: { "1.15": 245, "1.20": 238, "1.25": 230, "1.30": 222, "1.38": 210 },
    performance: 10, control: 9.5, comfort: 6.5, durability: 9, spin: 8.5, power: 7.5,
    tension_min: 20, tension_max: 26,
    price_eur: 20, price_usd: 22,
    description: 'Le cordage polyester de référence mondiale. Utilisé par plus de joueurs du Top 100 que tout autre cordage. Contrôle et sensation exceptionnels.',
    pro_usage: 'Roger Federer, Andy Murray, Serena Williams, Victoria Azarenka',
    color: 'Silver'
  },
  {
    brand: 'Luxilon',
    model: 'ALU Power Rough',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 230,
    stiffness_by_gauge: { "1.25": 235, "1.30": 225 },
    performance: 10, control: 9, comfort: 6.5, durability: 8.5, spin: 9.5, power: 7.5,
    tension_min: 20, tension_max: 26,
    price_eur: 22, price_usd: 24,
    description: 'ALU Power avec surface texturée pour un grip et spin accrus. Même contrôle légendaire avec plus de rotation.',
    pro_usage: 'John Isner',
    color: 'Silver'
  },
  {
    brand: 'Luxilon',
    model: 'ALU Power Spin',
    type: 'Polyester',
    gauges: ['1.27'],
    stiffness: 225,
    stiffness_by_gauge: { "1.27": 225 },
    performance: 9.5, control: 9, comfort: 6.5, durability: 8, spin: 10, power: 7.5,
    tension_min: 20, tension_max: 26,
    price_eur: 22, price_usd: 24,
    description: 'Version orientée spin de l\'ALU Power avec profil pentagonal pour un effet maximal.',
    pro_usage: null,
    color: 'Silver/Black'
  },
  {
    brand: 'Luxilon',
    model: 'ALU Power Soft',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 205,
    stiffness_by_gauge: { "1.25": 205 },
    performance: 9.5, control: 9, comfort: 7.5, durability: 8.5, spin: 8.5, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 22, price_usd: 24,
    description: 'Version assouplie de l\'ALU Power. Même performance avec plus de confort pour les bras sensibles.',
    pro_usage: null,
    color: 'Grey'
  },
  {
    brand: 'Luxilon',
    model: 'ALU Power Vibe',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 200,
    stiffness_by_gauge: { "1.25": 200 },
    performance: 9, control: 8.5, comfort: 8, durability: 8, spin: 8.5, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 23, price_usd: 25,
    description: 'ALU Power avec technologie anti-vibration intégrée. Confort optimal sans sacrifier les performances.',
    pro_usage: null,
    color: 'Lime Green'
  },
  {
    brand: 'Luxilon',
    model: 'ALU Power Ice',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 228,
    stiffness_by_gauge: { "1.25": 232, "1.30": 224 },
    performance: 10, control: 9.5, comfort: 6.5, durability: 9, spin: 8.5, power: 7.5,
    tension_min: 20, tension_max: 26,
    price_eur: 20, price_usd: 22,
    description: 'ALU Power en version blanche/translucide. Mêmes performances que l\'original.',
    pro_usage: null,
    color: 'White/Ice'
  },
  {
    brand: 'Luxilon',
    model: 'ALU Power Fluoro',
    type: 'Polyester',
    gauges: ['1.23'],
    stiffness: 232,
    stiffness_by_gauge: { "1.23": 232 },
    performance: 10, control: 9.5, comfort: 6.5, durability: 9, spin: 8.5, power: 7.5,
    tension_min: 20, tension_max: 26,
    price_eur: 20, price_usd: 22,
    description: 'ALU Power en version fluo. Performance identique à l\'original avec look distinctif.',
    pro_usage: null,
    color: 'Fluoro Yellow'
  },

  // === 4G FAMILY ===
  {
    brand: 'Luxilon',
    model: '4G',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 265,
    stiffness_by_gauge: { "1.25": 272, "1.30": 260 },
    performance: 9.5, control: 10, comfort: 5.5, durability: 10, spin: 8.5, power: 6,
    tension_min: 21, tension_max: 27,
    price_eur: 22, price_usd: 24,
    description: 'Le cordage le plus rigide et durable de Luxilon. Contrôle absolu et maintien de tension exceptionnel.',
    pro_usage: 'Angelique Kerber',
    color: 'Gold'
  },
  {
    brand: 'Luxilon',
    model: '4G Soft',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 235,
    stiffness_by_gauge: { "1.25": 235 },
    performance: 9, control: 9.5, comfort: 7, durability: 9.5, spin: 8.5, power: 7,
    tension_min: 21, tension_max: 27,
    price_eur: 23, price_usd: 25,
    description: 'Version assouplie du 4G. Garde le contrôle et la durabilité avec plus de confort.',
    pro_usage: null,
    color: 'Gold/Grey'
  },
  {
    brand: 'Luxilon',
    model: '4G Rough',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 262,
    stiffness_by_gauge: { "1.25": 262 },
    performance: 9.5, control: 9.5, comfort: 5.5, durability: 9.5, spin: 9.5, power: 6.5,
    tension_min: 21, tension_max: 27,
    price_eur: 23, price_usd: 25,
    description: '4G avec surface texturée pour plus de spin tout en gardant le contrôle caractéristique.',
    pro_usage: null,
    color: 'Gold'
  },

  // === ELEMENT FAMILY ===
  {
    brand: 'Luxilon',
    model: 'Element',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 190,
    stiffness_by_gauge: { "1.25": 198, "1.30": 185 },
    performance: 8.5, control: 8, comfort: 8.5, durability: 7.5, spin: 8, power: 8.5,
    tension_min: 22, tension_max: 27,
    price_eur: 20, price_usd: 22,
    description: 'Le polyester le plus souple de Luxilon. Excellent pour les joueurs cherchant confort et puissance.',
    pro_usage: 'Grigor Dimitrov',
    color: 'Bronze/Copper'
  },
  {
    brand: 'Luxilon',
    model: 'Element Rough',
    type: 'Polyester',
    gauges: ['1.30'],
    stiffness: 188,
    stiffness_by_gauge: { "1.30": 188 },
    performance: 8.5, control: 8, comfort: 8.5, durability: 7, spin: 9, power: 8.5,
    tension_min: 22, tension_max: 27,
    price_eur: 21, price_usd: 23,
    description: 'Element avec surface texturée. Combine le confort de l\'Element avec plus de potentiel de spin.',
    pro_usage: null,
    color: 'Bronze'
  },

  // === ACE ===
  {
    brand: 'Luxilon',
    model: 'Ace 112',
    type: 'Polyester',
    gauges: ['1.12'],
    stiffness: 255,
    stiffness_by_gauge: { "1.12": 255 },
    performance: 9.5, control: 9.5, comfort: 5.5, durability: 7, spin: 9.5, power: 8,
    tension_min: 18, tension_max: 24,
    price_eur: 24, price_usd: 26,
    description: 'Cordage ultra-fin pour un maximum de spin et de mordant. Réservé aux joueurs experts.',
    pro_usage: null,
    color: 'White'
  },
  {
    brand: 'Luxilon',
    model: 'Ace 118',
    type: 'Polyester',
    gauges: ['1.18'],
    stiffness: 248,
    stiffness_by_gauge: { "1.18": 248 },
    performance: 9.5, control: 9.5, comfort: 6, durability: 7.5, spin: 9.5, power: 7.5,
    tension_min: 19, tension_max: 25,
    price_eur: 24, price_usd: 26,
    description: 'Version 1.18mm de l\'Ace. Bon compromis entre spin, durabilité et contrôle.',
    pro_usage: null,
    color: 'White'
  },

  // === SAVAGE ===
  {
    brand: 'Luxilon',
    model: 'Savage',
    type: 'Polyester',
    gauges: ['1.27'],
    stiffness: 220,
    stiffness_by_gauge: { "1.27": 220 },
    performance: 9, control: 8.5, comfort: 7, durability: 8, spin: 10, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 21, price_usd: 23,
    description: 'Profil en étoile à 7 branches pour un spin agressif. Excellent accrochage de la balle.',
    pro_usage: null,
    color: 'Lime Green'
  },
  {
    brand: 'Luxilon',
    model: 'Savage Black',
    type: 'Polyester',
    gauges: ['1.27'],
    stiffness: 222,
    stiffness_by_gauge: { "1.27": 222 },
    performance: 9, control: 8.5, comfort: 7, durability: 8, spin: 10, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 21, price_usd: 23,
    description: 'Savage en version noire. Même performance de spin avec un look plus discret.',
    pro_usage: null,
    color: 'Black'
  },

  // === ADRENALINE ===
  {
    brand: 'Luxilon',
    model: 'Adrenaline',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 215,
    stiffness_by_gauge: { "1.20": 225, "1.25": 218, "1.30": 208 },
    performance: 9, control: 8.5, comfort: 7.5, durability: 8, spin: 9, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 18, price_usd: 20,
    description: 'Polyester polyvalent avec bon équilibre entre spin, puissance et confort. Plus accessible que l\'ALU Power.',
    pro_usage: null,
    color: 'Ice Blue'
  },
  {
    brand: 'Luxilon',
    model: 'Adrenaline Rough',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 212,
    stiffness_by_gauge: { "1.25": 212 },
    performance: 9, control: 8.5, comfort: 7.5, durability: 7.5, spin: 9.5, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 19, price_usd: 21,
    description: 'Adrenaline avec surface texturée pour plus de spin et d\'accroche.',
    pro_usage: null,
    color: 'Ice Blue'
  },

  // === ORIGINAL ===
  {
    brand: 'Luxilon',
    model: 'Original',
    type: 'Polyester',
    gauges: ['1.30'],
    stiffness: 240,
    stiffness_by_gauge: { "1.30": 240 },
    performance: 9, control: 9.5, comfort: 6, durability: 9, spin: 8, power: 7,
    tension_min: 22, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Le premier cordage polyester Luxilon. Classique et fiable avec excellent contrôle.',
    pro_usage: 'Gustavo Kuerten (ancien)',
    color: 'Amber'
  },

  // === SMART ===
  {
    brand: 'Luxilon',
    model: 'Smart',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 195,
    stiffness_by_gauge: { "1.25": 202, "1.30": 190 },
    performance: 8.5, control: 8, comfort: 8, durability: 7.5, spin: 8.5, power: 8.5,
    tension_min: 22, tension_max: 27,
    price_eur: 19, price_usd: 21,
    description: 'Technologie thermoplastique pour un toucher plus doux et un confort amélioré.',
    pro_usage: null,
    color: 'Black/Orange'
  },

  // === NATURAL GUT ===
  {
    brand: 'Luxilon',
    model: 'Natural Gut',
    type: 'Natural Gut',
    gauges: ['1.25', '1.30'],
    stiffness: 98,
    stiffness_by_gauge: { "1.25": 102, "1.30": 95 },
    performance: 10, control: 8, comfort: 10, durability: 5, spin: 7, power: 9.5,
    tension_min: 25, tension_max: 29,
    price_eur: 45, price_usd: 50,
    description: 'Boyau naturel premium Luxilon. Confort ultime et excellente puissance pour les joueurs exigeants.',
    pro_usage: null,
    color: 'Natural'
  },

  // === TIMO FAMILY ===
  {
    brand: 'Luxilon',
    model: 'Timo 117',
    type: 'Polyester',
    gauges: ['1.17'],
    stiffness: 245,
    stiffness_by_gauge: { "1.17": 245 },
    performance: 9, control: 9, comfort: 6, durability: 7, spin: 9.5, power: 8,
    tension_min: 19, tension_max: 25,
    price_eur: 21, price_usd: 23,
    description: 'Cordage fin pour maximum de spin. Profil carré pour un excellent snapback.',
    pro_usage: null,
    color: 'Grey'
  },

  // === SPIN SERIES ===
  {
    brand: 'Luxilon',
    model: 'Big Banger',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 235,
    stiffness_by_gauge: { "1.20": 245, "1.25": 238, "1.30": 228 },
    performance: 9, control: 9, comfort: 6.5, durability: 8.5, spin: 8.5, power: 7.5,
    tension_min: 21, tension_max: 27,
    price_eur: 17, price_usd: 19,
    description: 'Le classique Luxilon. Bon contrôle et durabilité à un prix accessible.',
    pro_usage: null,
    color: 'Silver'
  },
  {
    brand: 'Luxilon',
    model: 'Big Banger Rough',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 232,
    stiffness_by_gauge: { "1.25": 238, "1.30": 225 },
    performance: 9, control: 9, comfort: 6.5, durability: 8, spin: 9, power: 7.5,
    tension_min: 21, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Big Banger avec surface texturée pour plus de spin.',
    pro_usage: null,
    color: 'Silver'
  },

  // === M2 SERIES ===
  {
    brand: 'Luxilon',
    model: 'M2 Pro',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 210,
    stiffness_by_gauge: { "1.25": 210 },
    performance: 8.5, control: 8.5, comfort: 7.5, durability: 8, spin: 8.5, power: 8,
    tension_min: 22, tension_max: 27,
    price_eur: 19, price_usd: 21,
    description: 'Polyester polyvalent avec technologie double monofilament pour plus de confort.',
    pro_usage: null,
    color: 'Black'
  },
  {
    brand: 'Luxilon',
    model: 'M2 Plus',
    type: 'Polyester',
    gauges: ['1.30'],
    stiffness: 205,
    stiffness_by_gauge: { "1.30": 205 },
    performance: 8.5, control: 8, comfort: 8, durability: 8, spin: 8, power: 8.5,
    tension_min: 22, tension_max: 27,
    price_eur: 18, price_usd: 20,
    description: 'Version plus épaisse du M2 pour plus de durabilité et de confort.',
    pro_usage: null,
    color: 'Black'
  },

  // === NEXT GEN ===
  {
    brand: 'Luxilon',
    model: 'Eco Power',
    type: 'Polyester',
    gauges: ['1.25', '1.30'],
    stiffness: 225,
    stiffness_by_gauge: { "1.25": 232, "1.30": 220 },
    performance: 9, control: 8.5, comfort: 7, durability: 8.5, spin: 8.5, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 16, price_usd: 18,
    description: 'Cordage polyester éco-responsable avec des matériaux recyclés. Performance comparable à l\'ALU Power.',
    pro_usage: null,
    color: 'Green'
  },

  // === WRZ SERIES ===
  {
    brand: 'Luxilon',
    model: 'WRZ',
    type: 'Polyester',
    gauges: ['1.25'],
    stiffness: 218,
    stiffness_by_gauge: { "1.25": 218 },
    performance: 8.5, control: 8.5, comfort: 7.5, durability: 8, spin: 8.5, power: 8,
    tension_min: 21, tension_max: 26,
    price_eur: 17, price_usd: 19,
    description: 'Polyester polyvalent avec bon équilibre pour joueurs de club exigeants.',
    pro_usage: null,
    color: 'Grey/Blue'
  }
];

// Normalize data
const normalizedData = luxilonStrings.map(s => ({
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

async function deleteExistingLuxilon() {
  console.log('🗑️  Suppression des cordages Luxilon existants...');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Luxilon`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  console.log('   Status:', response.status);
}

async function insertData() {
  console.log(`\n📦 Insertion de ${normalizedData.length} cordages Luxilon...`);
  
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
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Luxilon&select=model,type,stiffness,gauges&order=model`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  
  console.log('\n=== CORDAGES LUXILON DANS LA BASE ===\n');
  
  data.forEach(s => {
    console.log(`  • ${s.model} (${s.type}) - RA: ${s.stiffness} - Jauges: ${s.gauges.join(', ')}`);
  });
  
  console.log(`\nTotal: ${data.length} cordages Luxilon`);
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
  console.log('🎾 Mise à jour des cordages Luxilon\n');
  
  await deleteExistingLuxilon();
  await insertData();
  await showResults();
  await showGlobalStats();
  
  console.log('\n🎉 Mise à jour terminée !');
}

main().catch(console.error);
