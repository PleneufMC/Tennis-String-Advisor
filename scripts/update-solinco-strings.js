/**
 * Script to update Solinco strings with Soft versions and more models
 * Also adds gauge-specific stiffness data
 */

const SUPABASE_URL = 'https://yhhdkllbaxuhwrfpsmev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGRrbGxiYXh1aHdyZnBzbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjI0MDEsImV4cCI6MjA4MTMzODQwMX0.2aC_gYZf0xxz6MXi5zcaCH2S64RBaQvXU7a5qiuD0_k';

// Helper to generate slug ID
function generateId(brand, model) {
  return `${brand}-${model}`.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Solinco strings - complete lineup with gauge-specific data
// Note: stiffness values are approximate averages, real values vary by gauge
// Format: stiffness_by_gauge = { "1.15": value, "1.20": value, etc. }
const solincoStrings = [
  // Hyper-G Family
  {
    brand: 'Solinco',
    model: 'Hyper-G',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 218,  // Average - 1.15 is stiffer (~225), 1.30 is softer (~210)
    stiffness_by_gauge: { "1.15": 225, "1.20": 220, "1.25": 215, "1.30": 210 },
    performance: 9.5, control: 9, comfort: 7, durability: 8.5, spin: 9.5, power: 8,
    tension_min: 21, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Le cordage vert iconique du circuit. Polyester carré avec excellent snapback pour un spin maximal.',
    pro_usage: 'Denis Shapovalov, Nick Kyrgios',
    color: 'Green'
  },
  {
    brand: 'Solinco',
    model: 'Hyper-G Soft',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 195,  // ~10-12% plus souple que Hyper-G
    stiffness_by_gauge: { "1.15": 205, "1.20": 198, "1.25": 192, "1.30": 185 },
    performance: 9, control: 8.5, comfort: 8.5, durability: 8, spin: 9, power: 8.5,
    tension_min: 21, tension_max: 26,
    price_eur: 16, price_usd: 18,
    description: 'Version assouplie du Hyper-G avec plus de confort et de puissance tout en conservant le spin.',
    pro_usage: null,
    color: 'Light Green'
  },
  {
    brand: 'Solinco',
    model: 'Hyper-G Heaven',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 175,  // Version très souple
    stiffness_by_gauge: { "1.20": 180, "1.25": 175, "1.30": 168 },
    performance: 8.5, control: 8, comfort: 9, durability: 7.5, spin: 8.5, power: 8.5,
    tension_min: 20, tension_max: 25,
    price_eur: 17, price_usd: 19,
    description: 'La version la plus confortable de la famille Hyper-G. Idéale pour les bras sensibles.',
    pro_usage: null,
    color: 'Teal'
  },

  // Tour Bite Family
  {
    brand: 'Solinco',
    model: 'Tour Bite',
    type: 'Polyester',
    gauges: ['1.05', '1.10', '1.15', '1.20', '1.25', '1.30', '1.35'],
    stiffness: 255,  // Average - très rigide
    stiffness_by_gauge: { "1.05": 275, "1.10": 268, "1.15": 262, "1.20": 255, "1.25": 248, "1.30": 242, "1.35": 235 },
    performance: 9, control: 10, comfort: 6, durability: 9, spin: 10, power: 6,
    tension_min: 20, tension_max: 28,
    price_eur: 15, price_usd: 17,
    description: 'Profil pentagonal à 5 arêtes pour un mordant et spin extrêmes. Contrôle chirurgical.',
    pro_usage: 'Jack Sock (hybride)',
    color: 'Silver'
  },
  {
    brand: 'Solinco',
    model: 'Tour Bite Soft',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 225,  // ~12% plus souple que Tour Bite
    stiffness_by_gauge: { "1.15": 235, "1.20": 228, "1.25": 222, "1.30": 215 },
    performance: 8.5, control: 9.5, comfort: 7.5, durability: 8.5, spin: 9.5, power: 7,
    tension_min: 20, tension_max: 27,
    price_eur: 16, price_usd: 18,
    description: 'Tour Bite avec formulation plus souple. Garde le spin et le contrôle avec plus de confort.',
    pro_usage: null,
    color: 'Dark Silver'
  },
  {
    brand: 'Solinco',
    model: 'Tour Bite Diamond Rough',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 260,
    stiffness_by_gauge: { "1.20": 268, "1.25": 260, "1.30": 252 },
    performance: 9, control: 9.5, comfort: 6, durability: 8, spin: 10, power: 6.5,
    tension_min: 20, tension_max: 27,
    price_eur: 17, price_usd: 19,
    description: 'Tour Bite avec surface texturée pour encore plus de mordant sur la balle.',
    pro_usage: null,
    color: 'Silver/Black'
  },

  // Confidential
  {
    brand: 'Solinco',
    model: 'Confidential',
    type: 'Polyester',
    gauges: ['1.15', '1.20', '1.25', '1.30'],
    stiffness: 245,
    stiffness_by_gauge: { "1.15": 255, "1.20": 248, "1.25": 242, "1.30": 235 },
    performance: 8, control: 9.5, comfort: 7, durability: 10, spin: 8.5, power: 6.5,
    tension_min: 22, tension_max: 28,
    price_eur: 15, price_usd: 17,
    description: 'Maintien de tension exceptionnel. Idéal pour ceux qui espacent les cordages.',
    pro_usage: null,
    color: 'Grey'
  },

  // Revolution
  {
    brand: 'Solinco',
    model: 'Revolution',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 210,
    stiffness_by_gauge: { "1.20": 218, "1.25": 210, "1.30": 202 },
    performance: 8.5, control: 8.5, comfort: 8, durability: 8, spin: 8, power: 8,
    tension_min: 22, tension_max: 27,
    price_eur: 14, price_usd: 16,
    description: 'Polyester polyvalent avec bon équilibre entre puissance, contrôle et confort.',
    pro_usage: null,
    color: 'Blue'
  },

  // Vanquish
  {
    brand: 'Solinco',
    model: 'Vanquish',
    type: 'Multifilament',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 155,
    stiffness_by_gauge: { "1.20": 160, "1.25": 155, "1.30": 148 },
    performance: 8, control: 7.5, comfort: 9.5, durability: 6.5, spin: 7, power: 8.5,
    tension_min: 22, tension_max: 26,
    price_eur: 18, price_usd: 20,
    description: 'Multifilament premium avec excellent confort et toucher proche du boyau naturel.',
    pro_usage: null,
    color: 'White'
  },

  // Outlast
  {
    brand: 'Solinco',
    model: 'Outlast',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 235,
    stiffness_by_gauge: { "1.20": 242, "1.25": 235, "1.30": 228 },
    performance: 8, control: 9, comfort: 7, durability: 10, spin: 8, power: 7,
    tension_min: 22, tension_max: 28,
    price_eur: 14, price_usd: 16,
    description: 'Conçu pour une durabilité maximale sans sacrifier les performances.',
    pro_usage: null,
    color: 'Black'
  },

  // Pro Stacked
  {
    brand: 'Solinco',
    model: 'Pro Stacked',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 220,
    stiffness_by_gauge: { "1.20": 228, "1.25": 220, "1.30": 212 },
    performance: 8.5, control: 8.5, comfort: 7.5, durability: 8.5, spin: 8.5, power: 8,
    tension_min: 22, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Construction en couches pour un meilleur maintien de tension et confort.',
    pro_usage: null,
    color: 'Yellow/Black'
  },

  // X-Natural
  {
    brand: 'Solinco',
    model: 'X-Natural',
    type: 'Multifilament',
    gauges: ['1.25', '1.30'],
    stiffness: 140,
    stiffness_by_gauge: { "1.25": 145, "1.30": 135 },
    performance: 7.5, control: 7, comfort: 10, durability: 6, spin: 6.5, power: 8.5,
    tension_min: 23, tension_max: 26,
    price_eur: 20, price_usd: 22,
    description: 'Le multifilament le plus confortable de Solinco. Sensation proche du boyau.',
    pro_usage: null,
    color: 'Natural'
  },

  // Barb Wire
  {
    brand: 'Solinco',
    model: 'Barb Wire',
    type: 'Polyester',
    gauges: ['1.20', '1.25', '1.30'],
    stiffness: 250,
    stiffness_by_gauge: { "1.20": 258, "1.25": 250, "1.30": 242 },
    performance: 8.5, control: 9, comfort: 6.5, durability: 8, spin: 9.5, power: 7,
    tension_min: 21, tension_max: 27,
    price_eur: 15, price_usd: 17,
    description: 'Surface texturée agressive pour un accrochage maximum de la balle.',
    pro_usage: null,
    color: 'Black/Yellow'
  }
];

// Normalize data
const normalizedData = solincoStrings.map(s => ({
  id: generateId(s.brand, s.model),
  brand: s.brand,
  model: s.model,
  type: s.type,
  gauges: s.gauges,
  stiffness: s.stiffness,
  // Store gauge-specific stiffness as JSON in description or a new field
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

async function deleteExistingSolinco() {
  console.log('🗑️  Suppression des cordages Solinco existants...');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Solinco`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  console.log('   Status:', response.status);
}

async function insertData() {
  console.log(`\n📦 Insertion de ${normalizedData.length} cordages Solinco...`);
  
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
  const response = await fetch(`${SUPABASE_URL}/rest/v1/strings?brand=eq.Solinco&select=model,stiffness,gauges&order=model`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  console.log('\n=== CORDAGES SOLINCO DANS LA BASE ===');
  data.forEach(s => {
    console.log(`  • ${s.model} (RA: ${s.stiffness}) - Jauges: ${s.gauges.join(', ')}`);
  });
  console.log(`\nTotal: ${data.length} cordages Solinco`);
}

async function main() {
  console.log('🎾 Mise à jour des cordages Solinco\n');
  
  await deleteExistingSolinco();
  await insertData();
  await showResults();
  
  console.log('\n🎉 Mise à jour terminée !');
}

main().catch(console.error);
