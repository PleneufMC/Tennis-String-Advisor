/**
 * Script to update racquets database with new 2024/2025 data
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

// Helper to parse weight (extract first number)
function parseWeight(weightStr) {
  const match = weightStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Helper to parse head size (extract first number)
function parseHeadSize(headStr) {
  const match = headStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// New racquets data from CSV
const racquetsData = [
  // HEAD
  { brand: 'Head', model: 'Extreme Pro', variant: '2024', head_size: 98, weight: 305, stiffness: 64, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Raquette de contrôle avec puissance mesurée pour joueurs offensifs.', price_eur: 270, price_usd: 270 },
  { brand: 'Head', model: 'Extreme MP', variant: '2024', head_size: 100, weight: 300, stiffness: 66, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Pour joueurs cherchant spin et puissance contrôlée.', pro_usage: 'Matteo Berrettini', price_eur: 270, price_usd: 270 },
  { brand: 'Head', model: 'Boom MP', variant: '2024', head_size: 100, weight: 295, stiffness: 66, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Raquette moderne axée sur le spin et la maniabilité.', price_eur: 260, price_usd: 260 },
  { brand: 'Head', model: 'Boom Pro', variant: '2024', head_size: 98, weight: 310, stiffness: 64, string_pattern: '16x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Version pro du Boom pour plus de contrôle et stabilité.', price_eur: 280, price_usd: 280 },
  { brand: 'Head', model: 'Gravity MP', variant: '2025', head_size: 100, weight: 295, stiffness: 57, string_pattern: '18x20', category: 'Control', player_level: ['Advanced'], description: 'Flexibilité exceptionnelle. Contrôle et confort maximaux.', price_eur: 270, price_usd: 270 },
  { brand: 'Head', model: 'Gravity Pro', variant: '2025', head_size: 100, weight: 315, stiffness: 59, string_pattern: '18x20', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Version pro lourde pour stabilité maximale.', pro_usage: 'Alexander Zverev, Andrey Rublev', price_eur: 280, price_usd: 280 },
  { brand: 'Head', model: 'Instinct MP', variant: '2025', head_size: 100, weight: 300, stiffness: 64, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Polyvalente avec bon équilibre puissance/contrôle.', price_eur: 260, price_usd: 260 },
  { brand: 'Head', model: 'Prestige Pro', variant: '2023/2025', head_size: 98, weight: 320, stiffness: 58, string_pattern: '18x20', category: 'Classic Player', player_level: ['Pro'], description: 'Pour joueurs experts cherchant feel et contrôle absolus.', price_eur: 290, price_usd: 290 },
  { brand: 'Head', model: 'Radical MP', variant: '2023/2025', head_size: 98, weight: 300, stiffness: 66, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Polyvalente légendaire. Équilibre parfait.', price_eur: 270, price_usd: 270 },
  { brand: 'Head', model: 'Radical Pro', variant: '2023/2025', head_size: 98, weight: 315, stiffness: 65, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Version pro avec plus de masse et stabilité.', price_eur: 280, price_usd: 280 },
  { brand: 'Head', model: 'Speed MP', variant: '2024 / Legend 2025', head_size: 100, weight: 300, stiffness: 60, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'La série de Novak Djokovic. Vitesse et contrôle.', pro_usage: 'Novak Djokovic, Jannik Sinner', price_eur: 280, price_usd: 280 },
  { brand: 'Head', model: 'Speed Pro', variant: '2024', head_size: 100, weight: 310, stiffness: 62, string_pattern: '18x20', category: 'Control', player_level: ['Pro'], description: 'Version pro avec plan de cordage dense.', pro_usage: 'Novak Djokovic (customisée)', price_eur: 290, price_usd: 290 },

  // BABOLAT
  { brand: 'Babolat', model: 'Pure Drive', variant: '2025', head_size: 100, weight: 300, stiffness: 69, string_pattern: '16x19', category: 'Power', player_level: ['Intermediate', 'Advanced'], description: 'La raquette la plus vendue au monde. Puissance et polyvalence.', price_eur: 280, price_usd: 280 },
  { brand: 'Babolat', model: 'Pure Drive Team', variant: '2025', head_size: 100, weight: 285, stiffness: 69, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate'], description: 'Version légère de la Pure Drive. Idéale pour progresser.', price_eur: 260, price_usd: 260 },
  { brand: 'Babolat', model: 'Pure Drive 98', variant: '2025', head_size: 98, weight: 305, stiffness: 69, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Pure Drive avec tamis réduit pour plus de contrôle.', price_eur: 280, price_usd: 280 },
  { brand: 'Babolat', model: 'Pure Drive Plus', variant: '2025', head_size: 100, weight: 300, stiffness: 69, string_pattern: '16x19', category: 'Power', player_level: ['Intermediate', 'Advanced'], description: 'Version allongée (27.5") pour plus de puissance.', price_eur: 280, price_usd: 280 },
  { brand: 'Babolat', model: 'Pure Drive Lite', variant: '2025', head_size: 100, weight: 270, stiffness: 69, string_pattern: '16x19', category: 'Light', player_level: ['Beginner', 'Intermediate'], description: 'Version légère pour joueurs en progression.', price_eur: 250, price_usd: 250 },
  { brand: 'Babolat', model: 'Pure Drive Super Lite', variant: '2025', head_size: 100, weight: 255, stiffness: 69, string_pattern: '16x19', category: 'Light', player_level: ['Beginner'], description: 'Ultra-légère pour débutants et seniors.', price_eur: 240, price_usd: 240 },
  { brand: 'Babolat', model: 'Pure Aero', variant: '2023', head_size: 100, weight: 300, stiffness: 67, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced', 'Pro'], description: 'La raquette de Rafael Nadal. Optimisée pour le spin maximum.', pro_usage: 'Rafael Nadal, Carlos Alcaraz', price_eur: 280, price_usd: 280 },
  { brand: 'Babolat', model: 'Pure Aero Team', variant: '2023', head_size: 100, weight: 285, stiffness: 72, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Version allégée de la Pure Aero. Plus maniable.', price_eur: 260, price_usd: 260 },
  { brand: 'Babolat', model: 'Pure Aero 98', variant: '2023', head_size: 98, weight: 305, stiffness: 66, string_pattern: '16x20', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Version contrôle de la Pure Aero avec tamis réduit.', price_eur: 280, price_usd: 280 },
  { brand: 'Babolat', model: 'Pure Strike Team', variant: '2025', head_size: 100, weight: 285, stiffness: 69, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate'], description: 'Version accessible de la Pure Strike.', price_eur: 260, price_usd: 260 },
  { brand: 'Babolat', model: 'Pure Strike 97', variant: '2025', head_size: 97, weight: 310, stiffness: 63, string_pattern: '18x20', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Contrôle maximal avec tamis compact.', price_eur: 280, price_usd: 280 },
  { brand: 'Babolat', model: 'Pure Strike 16x19', variant: '2025', head_size: 98, weight: 305, stiffness: 64, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Contrôle et précision pour joueurs offensifs.', pro_usage: 'Dominic Thiem', price_eur: 280, price_usd: 280 },
  { brand: 'Babolat', model: 'Pure Strike 26 Junior', variant: '', head_size: 100, weight: 250, stiffness: null, string_pattern: '16x19', category: 'Junior', player_level: ['Beginner'], description: 'Version junior 26 pouces de la Pure Strike.', price_eur: 130, price_usd: 130 },

  // WILSON
  { brand: 'Wilson', model: 'Blade 98 16x19', variant: 'v9', head_size: 98, weight: 305, stiffness: 60, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Feel exceptionnel avec FORTYFIVE°.', pro_usage: 'Stefanos Tsitsipas, Coco Gauff', price_eur: 290, price_usd: 290 },
  { brand: 'Wilson', model: 'Clash 100', variant: 'v3', head_size: 100, weight: 295, stiffness: 54, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'FreeFlex révolutionnaire. Confort et flexibilité uniques.', price_eur: 270, price_usd: 270 },
  { brand: 'Wilson', model: 'Pro Staff 97', variant: 'v14', head_size: 97, weight: 315, stiffness: 66, string_pattern: '16x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Icône légendaire du tennis. Contrôle ultime.', pro_usage: 'Roger Federer (retraité)', price_eur: 290, price_usd: 290 },
  { brand: 'Wilson', model: 'Ultra 99 Pro', variant: 'V5', head_size: 99, weight: 305, stiffness: 69, string_pattern: '16x20', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Version contrôle de l\'Ultra. Puissance canalisée.', price_eur: 280, price_usd: 280 },
  { brand: 'Wilson', model: 'Ultra 100', variant: 'V5', head_size: 100, weight: 300, stiffness: 67, string_pattern: '16x19', category: 'Power', player_level: ['Intermediate', 'Advanced'], description: 'Puissance moderne avec Crush Zone.', price_eur: 270, price_usd: 270 },
  { brand: 'Wilson', model: 'RF 01 PRO', variant: '', head_size: 98, weight: 320, stiffness: 67, string_pattern: '16x19', category: 'Control', player_level: ['Pro'], description: 'Raquette signature Roger Federer. Contrôle et précision.', pro_usage: 'Roger Federer', price_eur: 320, price_usd: 320 },

  // YONEX
  { brand: 'Yonex', model: 'Percept 100', variant: 'Midnight Navy', head_size: 100, weight: 300, stiffness: 66, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Servo Filter pour réduction des vibrations. Feel unique.', price_eur: 290, price_usd: 290 },
  { brand: 'Yonex', model: 'Percept 97', variant: 'Midnight Navy', head_size: 97, weight: 310, stiffness: 60, string_pattern: '16x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Contrôle précis avec nouveau matériau Servo Filter.', price_eur: 290, price_usd: 290 },
  { brand: 'Yonex', model: 'Percept 100 L', variant: 'Midnight Navy', head_size: 100, weight: 280, stiffness: 66, string_pattern: '16x19', category: 'Light', player_level: ['Intermediate'], description: 'Version légère de la Percept 100.', price_eur: 270, price_usd: 270 },
  { brand: 'Yonex', model: 'Percept Game', variant: 'Midnight Navy', head_size: 100, weight: 270, stiffness: 65, string_pattern: '16x19', category: 'Light', player_level: ['Beginner', 'Intermediate'], description: 'Version accessible de la série Percept.', price_eur: 250, price_usd: 250 },
  { brand: 'Yonex', model: 'Percept 100D', variant: '', head_size: 100, weight: 305, stiffness: 66, string_pattern: '18x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Version dense pour contrôle accru.', price_eur: 290, price_usd: 290 },
  { brand: 'Yonex', model: 'Percept 97 L', variant: '', head_size: 97, weight: 290, stiffness: 66, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Percept 97 en version allégée.', price_eur: 280, price_usd: 280 },
  { brand: 'Yonex', model: 'VCORE 100', variant: 'Sand Beige 2024', head_size: 100, weight: 300, stiffness: 65, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Spin et puissance avec String Sync Grommets.', price_eur: 280, price_usd: 280 },
  { brand: 'Yonex', model: 'VCORE 100L', variant: 'Sand Beige 2024', head_size: 100, weight: 280, stiffness: 66, string_pattern: '16x19', category: 'Light', player_level: ['Intermediate'], description: 'Version allégée du VCore 100.', price_eur: 260, price_usd: 260 },
  { brand: 'Yonex', model: 'VCORE 98', variant: 'Sand Beige 2024', head_size: 98, weight: 305, stiffness: 62, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Orientée spin avec Aero Trench.', pro_usage: 'Denis Shapovalov', price_eur: 280, price_usd: 280 },
  { brand: 'Yonex', model: 'VCORE 100', variant: '2023', head_size: 100, weight: 300, stiffness: 65, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Génération 2023 avec technologie Aero.', price_eur: 260, price_usd: 260 },
  { brand: 'Yonex', model: 'VCORE 98L', variant: '2023', head_size: 98, weight: 285, stiffness: 61, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'VCore 98 en version légère.', price_eur: 260, price_usd: 260 },
  { brand: 'Yonex', model: 'VCORE 95', variant: '2023', head_size: 95, weight: 310, stiffness: null, string_pattern: '16x20', category: 'Classic Player', player_level: ['Pro'], description: 'Petit tamis pour contrôle précis.', pro_usage: 'Stan Wawrinka', price_eur: 280, price_usd: 280 },
  { brand: 'Yonex', model: 'EZONE 98', variant: '2025', head_size: 98, weight: 305, stiffness: 63, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Forme isométrique pour sweet spot élargi.', price_eur: 280, price_usd: 280 },
  { brand: 'Yonex', model: 'EZONE 98 Tour', variant: '2025', head_size: 98, weight: 315, stiffness: 63, string_pattern: '16x19', category: 'Control', player_level: ['Pro'], description: 'Version tour lourde pour pros.', price_eur: 290, price_usd: 290 },
  { brand: 'Yonex', model: 'EZONE 100', variant: '2025', head_size: 100, weight: 300, stiffness: 64, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Polyvalente avec technologie 2G-Namd Flex Force.', pro_usage: 'Naomi Osaka, Nick Kyrgios', price_eur: 280, price_usd: 280 },
  { brand: 'Yonex', model: 'EZONE 100L', variant: '2025', head_size: 100, weight: 285, stiffness: 64, string_pattern: '16x19', category: 'Light', player_level: ['Intermediate'], description: 'EZONE 100 version légère.', price_eur: 260, price_usd: 260 },
  { brand: 'Yonex', model: 'EZONE 98L', variant: '2025', head_size: 98, weight: 285, stiffness: 62, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'EZONE 98 en version allégée.', price_eur: 270, price_usd: 270 },
  { brand: 'Yonex', model: 'EZONE 105', variant: '2025', head_size: 105, weight: 275, stiffness: 65, string_pattern: '16x18', category: 'Light', player_level: ['Beginner', 'Intermediate'], description: 'Grand tamis pour tolérance maximale.', price_eur: 250, price_usd: 250 },
  { brand: 'Yonex', model: 'EZONE Ace', variant: '', head_size: 102, weight: 260, stiffness: null, string_pattern: '16x18', category: 'Light', player_level: ['Beginner'], description: 'Raquette d\'initiation de la gamme EZONE.', price_eur: 200, price_usd: 200 },

  // PRINCE
  { brand: 'Prince', model: 'Ripstick 98', variant: '310g', head_size: 98, weight: 310, stiffness: 67, string_pattern: '16x18', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Contrôle et spin avec technologie TeXtreme.', price_eur: 240, price_usd: 240 },
  { brand: 'Prince', model: 'Ripstick 100', variant: '300g', head_size: 100, weight: 300, stiffness: 67, string_pattern: '16x18', category: 'Modern Player', player_level: ['Advanced'], description: 'Pour joueurs avancés cherchant spin et contrôle.', price_eur: 230, price_usd: 230 },
  { brand: 'Prince', model: 'Ripstick 100', variant: '280g', head_size: 100, weight: 280, stiffness: 66, string_pattern: '16x18', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Version légère du Ripstick 100.', price_eur: 220, price_usd: 220 },
  { brand: 'Prince', model: 'ATS Textreme Tour 98', variant: '', head_size: 98, weight: 305, stiffness: 62, string_pattern: '16x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Contrôle ultime avec technologie Textreme.', price_eur: 250, price_usd: 250 },
  { brand: 'Prince', model: 'Textreme Tour 100P', variant: '305g', head_size: 100, weight: 305, stiffness: 66, string_pattern: '16x18', category: 'Modern Player', player_level: ['Advanced'], description: 'Version puissante de la gamme Tour.', price_eur: 240, price_usd: 240 },
  { brand: 'Prince', model: 'Phantom 93P', variant: '18x20', head_size: 93, weight: 330, stiffness: 60, string_pattern: '18x20', category: 'Classic Player', player_level: ['Pro'], description: 'Pour puristes. Contrôle chirurgical.', price_eur: 260, price_usd: 260 },
  { brand: 'Prince', model: 'Vortex', variant: '300g', head_size: 100, weight: 300, stiffness: null, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Nouvelle gamme polyvalente Prince.', price_eur: 220, price_usd: 220 },
  { brand: 'Prince', model: 'Phantom 100X', variant: '290g', head_size: 100, weight: 290, stiffness: null, string_pattern: '16x18', category: 'Modern Player', player_level: ['Advanced'], description: 'Phantom avec tamis agrandi.', price_eur: 240, price_usd: 240 },
  { brand: 'Prince', model: 'O3 Legacy 110', variant: '', head_size: 110, weight: 270, stiffness: null, string_pattern: '16x19', category: 'Power', player_level: ['Beginner'], description: 'Grand tamis avec technologie O3.', price_eur: 200, price_usd: 200 },

  // TECNIFIBRE
  { brand: 'Tecnifibre', model: 'TF-X1 300', variant: 'V2', head_size: 100, weight: 300, stiffness: 71, string_pattern: '16x19', category: 'Power', player_level: ['Intermediate', 'Advanced'], description: 'Puissance avec technologie X-Damp.', price_eur: 270, price_usd: 270 },
  { brand: 'Tecnifibre', model: 'TF-X1 305', variant: 'V2', head_size: 98, weight: 305, stiffness: 70, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Contrôle et puissance équilibrés.', price_eur: 280, price_usd: 280 },
  { brand: 'Tecnifibre', model: 'TF-X1 285', variant: 'V2', head_size: 100, weight: 285, stiffness: null, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate'], description: 'Version légère du TF-X1.', price_eur: 260, price_usd: 260 },
  { brand: 'Tecnifibre', model: 'TFight 305S ID', variant: '', head_size: 98, weight: 305, stiffness: 63, string_pattern: '18x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Isoflex et Dynacore HD pour stabilité et confort.', pro_usage: 'Daniil Medvedev', price_eur: 270, price_usd: 270 },
  { brand: 'Tecnifibre', model: 'TFight 300 ID', variant: '', head_size: 100, weight: 300, stiffness: 65, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Version 100 in² plus accessible.', pro_usage: 'Iga Swiatek', price_eur: 270, price_usd: 270 },
  { brand: 'Tecnifibre', model: 'TFight 315S', variant: '', head_size: 98, weight: 315, stiffness: 65, string_pattern: '18x19', category: 'Control', player_level: ['Pro'], description: 'Version lourde pour stabilité maximale.', price_eur: 280, price_usd: 280 },
  { brand: 'Tecnifibre', model: 'TFight ISO 295', variant: '', head_size: 100, weight: 295, stiffness: 70, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate'], description: 'Confort et puissance accessibles.', price_eur: 250, price_usd: 250 },
  { brand: 'Tecnifibre', model: 'TFight ISO 300', variant: '', head_size: 98, weight: 300, stiffness: 66, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Version standard de la gamme ISO.', price_eur: 260, price_usd: 260 },
  { brand: 'Tecnifibre', model: 'TFight 300S', variant: '', head_size: 98, weight: 300, stiffness: null, string_pattern: '18x19', category: 'Control', player_level: ['Advanced'], description: 'Plan dense pour contrôle accru.', price_eur: 260, price_usd: 260 },
  { brand: 'Tecnifibre', model: 'TFight 285', variant: '', head_size: 100, weight: 285, stiffness: 63, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate'], description: 'Version légère et accessible.', price_eur: 250, price_usd: 250 },
  { brand: 'Tecnifibre', model: 'TF40 305', variant: '16x19', head_size: 98, weight: 305, stiffness: null, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Foam Inside pour absorption des chocs.', price_eur: 250, price_usd: 250 },
  { brand: 'Tecnifibre', model: 'TF40 315', variant: '16x19', head_size: 98, weight: 315, stiffness: 64, string_pattern: '16x19', category: 'Control', player_level: ['Pro'], description: 'Version lourde pour stabilité maximale.', price_eur: 260, price_usd: 260 },

  // DUNLOP
  { brand: 'Dunlop', model: 'CX 200', variant: '305g 2024', head_size: 98, weight: 305, stiffness: 64, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Contrôle et puissance avec Sonic Core.', price_eur: 260, price_usd: 260 },
  { brand: 'Dunlop', model: 'CX 200 LS', variant: '290g 2024', head_size: 98, weight: 290, stiffness: 65, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Version légère du CX 200.', price_eur: 250, price_usd: 250 },
  { brand: 'Dunlop', model: 'CX 200 Tour 16x19', variant: '310g 2024', head_size: 95, weight: 310, stiffness: 66, string_pattern: '16x19', category: 'Control', player_level: ['Pro'], description: 'Version tour avec tamis compact.', price_eur: 270, price_usd: 270 },
  { brand: 'Dunlop', model: 'CX 200 Tour 18x20', variant: '315g 2024', head_size: 95, weight: 315, stiffness: 66, string_pattern: '18x20', category: 'Classic Player', player_level: ['Pro'], description: 'Contrôle maximal avec plan dense.', price_eur: 270, price_usd: 270 },
  { brand: 'Dunlop', model: 'CX 200 OS', variant: '295g 2024', head_size: 105, weight: 295, stiffness: 65, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate'], description: 'CX 200 avec tamis agrandi.', price_eur: 250, price_usd: 250 },
  { brand: 'Dunlop', model: 'SX 300', variant: '2025', head_size: 100, weight: 300, stiffness: null, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Gamme orientée spin.', price_eur: 250, price_usd: 250 },
  { brand: 'Dunlop', model: 'SX 300 Tour', variant: '', head_size: 98, weight: 305, stiffness: null, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Version tour de la SX 300.', price_eur: 260, price_usd: 260 },
  { brand: 'Dunlop', model: 'FX 500 Tour', variant: '', head_size: 98, weight: 305, stiffness: null, string_pattern: '16x19', category: 'Power', player_level: ['Advanced'], description: 'Puissance avec technologie Power Boost.', price_eur: 260, price_usd: 260 },

  // SOLINCO
  { brand: 'Solinco', model: 'Blackout 300 XTD', variant: 'v2 Camo', head_size: 100, weight: 300, stiffness: 67, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Équilibre parfait puissance et contrôle.', price_eur: 250, price_usd: 250 },
  { brand: 'Solinco', model: 'Blackout 300', variant: 'v2 Camo', head_size: 100, weight: 300, stiffness: 66, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Polyvalente avec bonne maniabilité.', price_eur: 240, price_usd: 240 },
  { brand: 'Solinco', model: 'Blackout 100', variant: '300g', head_size: 100, weight: 300, stiffness: 71, string_pattern: '16x19', category: 'Power', player_level: ['Intermediate', 'Advanced'], description: 'Puissance brute avec rigidité élevée.', price_eur: 230, price_usd: 230 },
  { brand: 'Solinco', model: 'Blackout 100', variant: '285g', head_size: 100, weight: 285, stiffness: 70, string_pattern: '16x19', category: 'Power', player_level: ['Intermediate'], description: 'Version légère du Blackout 100.', price_eur: 220, price_usd: 220 },
  { brand: 'Solinco', model: 'Whiteout 305 XTD+', variant: '', head_size: 98, weight: 305, stiffness: 64, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Contrôle et feel premium.', price_eur: 260, price_usd: 260 },
  { brand: 'Solinco', model: 'Whiteout 305', variant: 'v2 Camo', head_size: 98, weight: 305, stiffness: null, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Nouvelle version du Whiteout 305.', price_eur: 250, price_usd: 250 },
  { brand: 'Solinco', model: 'Whiteout 305 XTD', variant: '18x20', head_size: 98, weight: 305, stiffness: null, string_pattern: '18x20', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Plan dense pour contrôle maximal.', price_eur: 260, price_usd: 260 },
  { brand: 'Solinco', model: 'Whiteout 98', variant: '305g', head_size: 98, weight: 305, stiffness: null, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Whiteout standard 305g.', price_eur: 240, price_usd: 240 },
  { brand: 'Solinco', model: 'Whiteout 98', variant: '290g', head_size: 98, weight: 290, stiffness: null, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Version légère du Whiteout 98.', price_eur: 230, price_usd: 230 },
  { brand: 'Solinco', model: 'Whiteout 98 XTD', variant: '305g', head_size: 98, weight: 305, stiffness: 67, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Version XTD avec meilleur équilibre.', price_eur: 260, price_usd: 260 },

  // VOLKL
  { brand: 'Volkl', model: 'V-Cell V1 Pro', variant: '', head_size: 99, weight: 305, stiffness: 68, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Précision allemande. Contrôle et feel.', price_eur: 270, price_usd: 270 },
  { brand: 'Volkl', model: 'V-Cell V1 MP', variant: '', head_size: 102, weight: 285, stiffness: 68, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Version plus accessible du V1.', price_eur: 250, price_usd: 250 },
  { brand: 'Volkl', model: 'V-Cell 1', variant: '', head_size: 115, weight: 255, stiffness: 70, string_pattern: '16x19', category: 'Power', player_level: ['Beginner'], description: 'Grand tamis pour maximum de tolérance.', price_eur: 200, price_usd: 200 },
  { brand: 'Volkl', model: 'C10 Pro', variant: '', head_size: 98, weight: 330, stiffness: 62, string_pattern: '18x20', category: 'Classic Player', player_level: ['Pro'], description: 'Raquette classique pour puristes.', price_eur: 280, price_usd: 280 },
  { brand: 'Volkl', model: 'V1 EVO', variant: '', head_size: 102, weight: 305, stiffness: 64, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Évolution de la série V1.', price_eur: 260, price_usd: 260 },
  { brand: 'Volkl', model: 'Power Bridge 10 Mid', variant: '', head_size: 93, weight: 330, stiffness: 61, string_pattern: '18x20', category: 'Classic Player', player_level: ['Pro'], description: 'Pour amateurs de raquettes classiques.', price_eur: 250, price_usd: 250 },
  { brand: 'Volkl', model: 'V-Cell 10', variant: '320g', head_size: 98, weight: 320, stiffness: 66, string_pattern: '16x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Contrôle et stabilité maximaux.', price_eur: 260, price_usd: 260 },
  { brand: 'Volkl', model: 'V-Cell 10', variant: '300g', head_size: 98, weight: 300, stiffness: 69, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Version standard du V-Cell 10.', price_eur: 250, price_usd: 250 },
  { brand: 'Volkl', model: 'V-Cell 9', variant: '', head_size: 100, weight: 305, stiffness: 68, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Polyvalente avec puissance contrôlée.', price_eur: 250, price_usd: 250 },
  { brand: 'Volkl', model: 'V-Cell 8', variant: '300g/285g', head_size: 100, weight: 300, stiffness: null, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate'], description: 'Accessible et polyvalente.', price_eur: 230, price_usd: 230 },
  { brand: 'Volkl', model: 'V-Cell 5', variant: '', head_size: 100, weight: 260, stiffness: null, string_pattern: '16x19', category: 'Light', player_level: ['Beginner'], description: 'Ultra-légère pour débutants.', price_eur: 200, price_usd: 200 },
  { brand: 'Volkl', model: 'V-Cell 2', variant: 'Oversize', head_size: 115, weight: 270, stiffness: null, string_pattern: '16x19', category: 'Power', player_level: ['Beginner'], description: 'Maximum de puissance et tolérance.', price_eur: 180, price_usd: 180 },
  { brand: 'Volkl', model: 'Vostra V10', variant: '320g', head_size: 98, weight: 320, stiffness: null, string_pattern: '16x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Nouvelle gamme Vostra.', price_eur: 270, price_usd: 270 },
  { brand: 'Volkl', model: 'Vostra V9', variant: '290g', head_size: 98, weight: 290, stiffness: null, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Version légère de la Vostra.', price_eur: 260, price_usd: 260 },
  { brand: 'Volkl', model: 'C10 EVO', variant: '', head_size: 98, weight: 305, stiffness: null, string_pattern: '18x20', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Évolution moderne du C10.', price_eur: 270, price_usd: 270 }
];

// Add IDs and normalize data
const normalizedData = racquetsData.map(r => ({
  id: generateId(r.brand, r.model + (r.variant ? '-' + r.variant : '')),
  brand: r.brand,
  model: r.model,
  variant: r.variant || null,
  stiffness: r.stiffness,
  weight: r.weight,
  head_size: r.head_size,
  string_pattern: r.string_pattern || null,
  category: r.category || null,
  player_level: r.player_level || null,
  description: r.description || null,
  pro_usage: r.pro_usage || null,
  price_eur: r.price_eur || 250,
  price_usd: r.price_usd || 250
}));

async function clearTable() {
  console.log('🗑️  Clearing existing racquets...');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/racquets?id=neq.`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  console.log('   Delete status:', response.status);
}

async function insertData() {
  console.log(`\n📦 Inserting ${normalizedData.length} racquets...`);
  
  let success = 0;
  let failed = 0;
  
  for (const item of normalizedData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/racquets`, {
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
      process.stdout.write('.');
    } else {
      failed++;
      const text = await response.text();
      console.error(`\n❌ Failed: ${item.id} - ${text}`);
    }
  }
  
  console.log(`\n✅ Inserted: ${success}, Failed: ${failed}`);
}

async function countData() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/racquets?select=id`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  return Array.isArray(data) ? data.length : 0;
}

async function main() {
  console.log('🎾 Updating Racquets Database\n');
  
  await clearTable();
  await insertData();
  
  const count = await countData();
  console.log(`\n✅ Total racquets in database: ${count}`);
  console.log('🎉 Update complete!');
}

main().catch(console.error);
