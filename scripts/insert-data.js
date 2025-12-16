/**
 * Script to insert tennis data into Supabase - one by one
 */

const SUPABASE_URL = 'https://yhhdkllbaxuhwrfpsmev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGRrbGxiYXh1aHdyZnBzbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjI0MDEsImV4cCI6MjA4MTMzODQwMX0.2aC_gYZf0xxz6MXi5zcaCH2S64RBaQvXU7a5qiuD0_k';

// Racquets data - normalized with all fields
const racquetsData = [
  { id: 'babolat-pure-aero-standard', brand: 'Babolat', model: 'Pure Aero', variant: 'Standard', stiffness: 69, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced', 'Pro'], description: 'La raquette de Rafael Nadal. Optimisée pour le spin maximum.', pro_usage: 'Rafael Nadal, Carlos Alcaraz', price_eur: 280, price_usd: 280 },
  { id: 'babolat-pure-aero-98', brand: 'Babolat', model: 'Pure Aero', variant: '98', stiffness: 66, weight: 305, head_size: 98, string_pattern: '16x20', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Version contrôle de la Pure Aero avec tamis réduit.', pro_usage: null, price_eur: 280, price_usd: 280 },
  { id: 'babolat-pure-aero-team', brand: 'Babolat', model: 'Pure Aero', variant: 'Team', stiffness: 67, weight: 285, head_size: 100, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Version allégée de la Pure Aero. Plus maniable.', pro_usage: null, price_eur: 260, price_usd: 260 },
  { id: 'babolat-pure-drive-standard', brand: 'Babolat', model: 'Pure Drive', variant: 'Standard', stiffness: 72, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Power', player_level: ['Intermediate', 'Advanced'], description: 'La raquette la plus vendue au monde. Puissance et polyvalence.', pro_usage: 'Fabio Fognini', price_eur: 280, price_usd: 280 },
  { id: 'babolat-pure-drive-98', brand: 'Babolat', model: 'Pure Drive', variant: '98', stiffness: 67, weight: 305, head_size: 98, string_pattern: '16x20', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Pure Drive avec plus de contrôle et précision.', pro_usage: null, price_eur: 280, price_usd: 280 },
  { id: 'babolat-pure-drive-107', brand: 'Babolat', model: 'Pure Drive', variant: '107', stiffness: 69, weight: 285, head_size: 107, string_pattern: '16x19', category: 'Power', player_level: ['Beginner', 'Intermediate'], description: 'Grand tamis pour plus de puissance et tolérance.', pro_usage: null, price_eur: 260, price_usd: 260 },
  { id: 'babolat-pure-drive-team', brand: 'Babolat', model: 'Pure Drive', variant: 'Team', stiffness: 69, weight: 285, head_size: 100, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate'], description: 'Version légère de la Pure Drive. Idéale pour progresser.', pro_usage: null, price_eur: 260, price_usd: 260 },
  { id: 'babolat-pure-strike-100', brand: 'Babolat', model: 'Pure Strike', variant: '100', stiffness: 70, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Contrôle et précision pour joueurs offensifs.', pro_usage: 'Dominic Thiem', price_eur: 280, price_usd: 280 },
  { id: 'head-speed-mp', brand: 'Head', model: 'Speed', variant: 'MP', stiffness: 61, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'La série de Novak Djokovic. Vitesse et contrôle.', pro_usage: 'Novak Djokovic, Jannik Sinner', price_eur: 280, price_usd: 280 },
  { id: 'head-speed-pro', brand: 'Head', model: 'Speed', variant: 'Pro', stiffness: 62, weight: 310, head_size: 100, string_pattern: '18x20', category: 'Control', player_level: ['Pro'], description: 'Version pro avec plan de cordage dense.', pro_usage: 'Novak Djokovic (customisée)', price_eur: 290, price_usd: 290 },
  { id: 'head-extreme-mp', brand: 'Head', model: 'Extreme', variant: 'MP', stiffness: 65, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Pour joueurs cherchant spin et puissance contrôlée.', pro_usage: 'Matteo Berrettini', price_eur: 270, price_usd: 270 },
  { id: 'head-gravity-pro', brand: 'Head', model: 'Gravity', variant: 'Pro', stiffness: 59, weight: 315, head_size: 100, string_pattern: '18x20', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Version pro lourde pour stabilité maximale.', pro_usage: 'Alexander Zverev, Andrey Rublev', price_eur: 280, price_usd: 280 },
  { id: 'head-gravity-mp', brand: 'Head', model: 'Gravity', variant: 'MP', stiffness: 59, weight: 295, head_size: 100, string_pattern: '18x20', category: 'Control', player_level: ['Advanced'], description: 'Contrôle extrême avec grand tamis. Très flexible.', pro_usage: null, price_eur: 270, price_usd: 270 },
  { id: 'head-prestige-mp', brand: 'Head', model: 'Prestige', variant: 'MP', stiffness: 62, weight: 300, head_size: 98, string_pattern: '18x20', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Icône du contrôle. Préférée des puristes.', pro_usage: null, price_eur: 280, price_usd: 280 },
  { id: 'head-radical-mp', brand: 'Head', model: 'Radical', variant: 'MP', stiffness: 65, weight: 300, head_size: 98, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Polyvalente légendaire. Équilibre parfait.', pro_usage: 'Andy Murray (ancien)', price_eur: 270, price_usd: 270 },
  { id: 'wilson-blade-98', brand: 'Wilson', model: 'Blade', variant: '98 v9', stiffness: 62, weight: 305, head_size: 98, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Feel exceptionnel avec FORTYFIVE°.', pro_usage: 'Stefanos Tsitsipas, Coco Gauff', price_eur: 290, price_usd: 290 },
  { id: 'wilson-blade-100', brand: 'Wilson', model: 'Blade', variant: '100 v9', stiffness: 64, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Version 100 plus accessible.', pro_usage: null, price_eur: 280, price_usd: 280 },
  { id: 'wilson-pro-staff-97', brand: 'Wilson', model: 'Pro Staff', variant: '97 v14', stiffness: 63, weight: 315, head_size: 97, string_pattern: '16x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Icône légendaire du tennis. Contrôle ultime.', pro_usage: 'Roger Federer (retraité)', price_eur: 290, price_usd: 290 },
  { id: 'wilson-clash-100-v2', brand: 'Wilson', model: 'Clash', variant: '100 v2', stiffness: 57, weight: 295, head_size: 100, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'FreeFlex + StableSmart. Révolution confort.', pro_usage: null, price_eur: 270, price_usd: 270 },
  { id: 'wilson-ultra-100', brand: 'Wilson', model: 'Ultra', variant: '100 v4', stiffness: 74, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Power', player_level: ['Intermediate', 'Advanced'], description: 'Puissance moderne avec Crush Zone.', pro_usage: null, price_eur: 270, price_usd: 270 },
  { id: 'wilson-burn-100', brand: 'Wilson', model: 'Burn', variant: '100 v5', stiffness: 72, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Power', player_level: ['Intermediate', 'Advanced'], description: 'Puissance et spin pour jeu offensif.', pro_usage: null, price_eur: 250, price_usd: 250 },
  { id: 'yonex-ezone-100', brand: 'Yonex', model: 'EZONE', variant: '100', stiffness: 64, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Polyvalente avec technologie 2G-Namd.', pro_usage: 'Naomi Osaka, Nick Kyrgios', price_eur: 280, price_usd: 280 },
  { id: 'yonex-ezone-98', brand: 'Yonex', model: 'EZONE', variant: '98', stiffness: 63, weight: 305, head_size: 98, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Forme isométrique pour sweet spot élargi.', pro_usage: 'Belinda Bencic', price_eur: 280, price_usd: 280 },
  { id: 'yonex-vcore-100', brand: 'Yonex', model: 'VCore', variant: '100', stiffness: 65, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Spin et puissance avec String Sync Grommets.', pro_usage: null, price_eur: 280, price_usd: 280 },
  { id: 'yonex-vcore-98', brand: 'Yonex', model: 'VCore', variant: '98', stiffness: 64, weight: 305, head_size: 98, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Orientée spin avec Aero Trench.', pro_usage: 'Denis Shapovalov', price_eur: 280, price_usd: 280 },
  { id: 'yonex-percept-100', brand: 'Yonex', model: 'Percept', variant: '100', stiffness: 61, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Nouveau modèle 2024. Servo Filter pour réduction vibrations.', pro_usage: null, price_eur: 290, price_usd: 290 },
  { id: 'yonex-percept-97', brand: 'Yonex', model: 'Percept', variant: '97', stiffness: 60, weight: 310, head_size: 97, string_pattern: '16x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Contrôle précis avec nouveau matériau.', pro_usage: null, price_eur: 290, price_usd: 290 },
  { id: 'tecnifibre-tf40-305', brand: 'Tecnifibre', model: 'TF40', variant: '305', stiffness: 63, weight: 305, head_size: 98, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced', 'Pro'], description: 'Foam Inside pour absorption des chocs.', pro_usage: null, price_eur: 250, price_usd: 250 },
  { id: 'tecnifibre-tfight-300-id', brand: 'Tecnifibre', model: 'TFight', variant: '300 ID', stiffness: 66, weight: 300, head_size: 100, string_pattern: '16x19', category: 'Modern Player', player_level: ['Intermediate', 'Advanced'], description: 'Version 100 in² plus accessible.', pro_usage: 'Iga Swiatek', price_eur: 270, price_usd: 270 },
  { id: 'tecnifibre-tfight-305s-id', brand: 'Tecnifibre', model: 'TFight', variant: '305S ID', stiffness: 65, weight: 305, head_size: 98, string_pattern: '18x19', category: 'Control', player_level: ['Advanced', 'Pro'], description: 'Isoflex et Dynacore HD pour stabilité et confort.', pro_usage: 'Daniil Medvedev', price_eur: 270, price_usd: 270 },
  { id: 'tecnifibre-tempo-298', brand: 'Tecnifibre', model: 'Tempo', variant: '298', stiffness: 66, weight: 298, head_size: 98, string_pattern: '16x19', category: 'Modern Player', player_level: ['Advanced'], description: 'Nouvelle gamme axée sur la vitesse.', pro_usage: null, price_eur: 240, price_usd: 240 },
  { id: 'prince-ripstick-100', brand: 'Prince', model: 'Ripstick', variant: '100', stiffness: 60, weight: 300, head_size: 100, string_pattern: '16x18', category: 'Modern Player', player_level: ['Advanced'], description: 'Pour joueurs avancés cherchant spin et contrôle.', pro_usage: null, price_eur: 220, price_usd: 220 },
  { id: 'prince-warrior-100', brand: 'Prince', model: 'Warrior', variant: '100', stiffness: 66, weight: 300, head_size: 100, string_pattern: '16x18', category: 'Tweener', player_level: ['Intermediate', 'Advanced'], description: 'Polyvalente avec bon équilibre.', pro_usage: null, price_eur: 190, price_usd: 190 },
  { id: 'prince-phantom-100', brand: 'Prince', model: 'Phantom', variant: '100', stiffness: 62, weight: 305, head_size: 100, string_pattern: '16x18', category: 'Modern Player', player_level: ['Advanced'], description: 'Contrôle et toucher exceptionnels.', pro_usage: null, price_eur: 230, price_usd: 230 }
];

// Strings data - normalized with all fields
const stringsData = [
  { id: 'luxilon-alu-power', brand: 'Luxilon', model: 'ALU Power', type: 'Polyester', gauges: ['1.15', '1.20', '1.25', '1.30'], stiffness: 230, performance: 9.8, control: 9.5, comfort: 7.0, durability: 9.0, spin: 8.5, power: 7.5, tension_min: 23, tension_max: 29, price_eur: 20, price_usd: 20, description: 'Le standard absolu du tennis professionnel. Co-polyester avec aluminium.', pro_usage: '20% des joueurs ATP Top 50', color: 'Silver' },
  { id: 'luxilon-alu-power-rough', brand: 'Luxilon', model: 'ALU Power Rough', type: 'Polyester', gauges: ['1.25', '1.30'], stiffness: 230, performance: 9.5, control: 9.0, comfort: 7.0, durability: 8.5, spin: 9.0, power: 7.5, tension_min: 23, tension_max: 29, price_eur: 22, price_usd: 22, description: 'Version texturée pour plus de spin.', pro_usage: 'Roger Federer (hybride)', color: 'Silver' },
  { id: 'luxilon-4g', brand: 'Luxilon', model: '4G', type: 'Polyester', gauges: ['1.25', '1.30'], stiffness: 265, performance: 9.0, control: 10.0, comfort: 7.0, durability: 9.5, spin: 8.0, power: 6.5, tension_min: 24, tension_max: 30, price_eur: 22, price_usd: 22, description: 'Contrôle absolu avec maintien de tension exceptionnel.', pro_usage: 'Stefanos Tsitsipas', color: 'Gold' },
  { id: 'luxilon-element', brand: 'Luxilon', model: 'Element', type: 'Polyester', gauges: ['1.25', '1.30'], stiffness: 190, performance: 8.0, control: 8.0, comfort: 8.5, durability: 7.5, spin: 7.5, power: 8.0, tension_min: 21, tension_max: 26, price_eur: 20, price_usd: 20, description: 'Multi-Mono : sensation multifilament dans structure poly.', pro_usage: null, color: 'Bronze' },
  { id: 'solinco-hyper-g', brand: 'Solinco', model: 'Hyper-G', type: 'Polyester', gauges: ['1.15', '1.20', '1.25', '1.30'], stiffness: 218, performance: 9.5, control: 9.0, comfort: 8.5, durability: 8.5, spin: 9.0, power: 8.0, tension_min: 22, tension_max: 27, price_eur: 15, price_usd: 15, description: 'Le "sea of green" du circuit. Polyester confortable avec excellent snapback.', pro_usage: 'Populaire chez les jeunes pros', color: 'Green' },
  { id: 'solinco-tour-bite', brand: 'Solinco', model: 'Tour Bite', type: 'Polyester', gauges: ['1.15', '1.20', '1.25', '1.30'], stiffness: 255, performance: 9.0, control: 10.0, comfort: 6.5, durability: 9.0, spin: 9.5, power: 6.0, tension_min: 22, tension_max: 28, price_eur: 15, price_usd: 15, description: '4 arêtes pour un grip et spin maximum. Contrôle extrême.', pro_usage: null, color: 'Silver' },
  { id: 'solinco-confidential', brand: 'Solinco', model: 'Confidential', type: 'Polyester', gauges: ['1.15', '1.20', '1.25', '1.30'], stiffness: 245, performance: 7.5, control: 9.5, comfort: 7.5, durability: 10.0, spin: 8.5, power: 6.5, tension_min: 23, tension_max: 28, price_eur: 15, price_usd: 15, description: 'Maintien de tension exceptionnel.', pro_usage: null, color: 'Grey' },
  { id: 'babolat-rpm-blast', brand: 'Babolat', model: 'RPM Blast', type: 'Polyester', gauges: ['1.20', '1.25', '1.30', '1.35'], stiffness: 240, performance: 9.2, control: 9.0, comfort: 7.5, durability: 8.0, spin: 9.5, power: 7.0, tension_min: 23, tension_max: 28, price_eur: 18, price_usd: 18, description: 'Le cordage de Rafael Nadal. Octogonal pour un spin maximum.', pro_usage: 'Rafael Nadal, Dominic Thiem', color: 'Black' },
  { id: 'babolat-rpm-rough', brand: 'Babolat', model: 'RPM Rough', type: 'Polyester', gauges: ['1.25', '1.30', '1.35'], stiffness: 235, performance: 9.0, control: 8.5, comfort: 7.5, durability: 7.5, spin: 10.0, power: 7.0, tension_min: 23, tension_max: 28, price_eur: 18, price_usd: 18, description: 'Version texturée du RPM Blast pour encore plus de spin.', pro_usage: null, color: 'Orange' },
  { id: 'babolat-vs-touch', brand: 'Babolat', model: 'VS Touch', type: 'Natural Gut', gauges: ['1.25', '1.30', '1.35'], stiffness: 95, performance: 9.5, control: 8.0, comfort: 9.5, durability: 10.0, spin: 7.5, power: 9.5, tension_min: 23, tension_max: 32, price_eur: 48, price_usd: 48, description: 'Le meilleur boyau naturel avec technologie Thermogut.', pro_usage: 'Nombreux pros en hybride', color: 'Natural' },
  { id: 'head-lynx-tour', brand: 'Head', model: 'Lynx Tour', type: 'Polyester', gauges: ['1.20', '1.25', '1.30'], stiffness: 210, performance: 8.5, control: 9.0, comfort: 8.0, durability: 8.5, spin: 8.5, power: 7.5, tension_min: 22, tension_max: 27, price_eur: 16, price_usd: 16, description: 'Hexagonal pour un équilibre parfait entre contrôle et spin.', pro_usage: 'Alexander Zverev', color: 'Grey' },
  { id: 'head-hawk', brand: 'Head', model: 'Hawk', type: 'Polyester', gauges: ['1.20', '1.25', '1.30'], stiffness: 215, performance: 8.0, control: 9.0, comfort: 7.0, durability: 8.5, spin: 8.5, power: 7.0, tension_min: 22, tension_max: 27, price_eur: 12, price_usd: 12, description: 'Bon rapport qualité/prix. Contrôle solide.', pro_usage: 'Novak Djokovic (customisé)', color: 'Grey' },
  { id: 'head-hawk-touch', brand: 'Head', model: 'Hawk Touch', type: 'Polyester', gauges: ['1.15', '1.20', '1.25', '1.30'], stiffness: 200, performance: 8.0, control: 8.5, comfort: 8.0, durability: 8.0, spin: 8.0, power: 7.5, tension_min: 22, tension_max: 26, price_eur: 16, price_usd: 16, description: 'Version plus souple du Hawk standard.', pro_usage: null, color: 'Anthracite' },
  { id: 'wilson-nxt', brand: 'Wilson', model: 'NXT', type: 'Multifilament', gauges: ['1.24', '1.30'], stiffness: 155, performance: 8.0, control: 6.5, comfort: 9.0, durability: 7.5, spin: 6.0, power: 8.5, tension_min: 20, tension_max: 25, price_eur: 22, price_usd: 22, description: 'Multifilament confortable avec puissance naturelle.', pro_usage: null, color: 'Natural' },
  { id: 'wilson-natural-gut', brand: 'Wilson', model: 'Natural Gut', type: 'Natural Gut', gauges: ['1.25', '1.30'], stiffness: 100, performance: 9.0, control: 7.5, comfort: 9.0, durability: 10.0, spin: 7.0, power: 9.0, tension_min: 23, tension_max: 30, price_eur: 42, price_usd: 42, description: 'Boyau naturel premium Wilson.', pro_usage: null, color: 'Natural' },
  { id: 'wilson-revolve', brand: 'Wilson', model: 'Revolve', type: 'Polyester', gauges: ['1.25', '1.30', '1.35'], stiffness: 220, performance: 8.0, control: 8.5, comfort: 7.5, durability: 8.5, spin: 8.5, power: 7.5, tension_min: 22, tension_max: 27, price_eur: 14, price_usd: 14, description: 'Polyester équilibré Wilson.', pro_usage: null, color: 'Green' },
  { id: 'tecnifibre-x-one-biphase', brand: 'Tecnifibre', model: 'X-One Biphase', type: 'Multifilament', gauges: ['1.18', '1.24', '1.30'], stiffness: 160, performance: 9.0, control: 7.0, comfort: 8.5, durability: 7.5, spin: 7.0, power: 9.0, tension_min: 21, tension_max: 26, price_eur: 25, price_usd: 25, description: 'Technologie Biphase pour 20% de puissance en plus.', pro_usage: null, color: 'Red' },
  { id: 'tecnifibre-razor-code', brand: 'Tecnifibre', model: 'Razor Code', type: 'Polyester', gauges: ['1.20', '1.25', '1.30'], stiffness: 200, performance: 8.5, control: 8.5, comfort: 7.5, durability: 8.0, spin: 9.0, power: 7.5, tension_min: 22, tension_max: 26, price_eur: 15, price_usd: 15, description: 'Profil pentagonal pour spin accru.', pro_usage: 'Daniil Medvedev', color: 'Blue' },
  { id: 'tecnifibre-black-code', brand: 'Tecnifibre', model: 'Black Code', type: 'Polyester', gauges: ['1.24', '1.28', '1.32'], stiffness: 210, performance: 8.0, control: 8.5, comfort: 7.0, durability: 8.5, spin: 8.5, power: 7.0, tension_min: 22, tension_max: 27, price_eur: 14, price_usd: 14, description: 'Section carrée pour spin et contrôle.', pro_usage: null, color: 'Black' },
  { id: 'tecnifibre-tgv', brand: 'Tecnifibre', model: 'TGV', type: 'Multifilament', gauges: ['1.25', '1.30', '1.35'], stiffness: 145, performance: 7.0, control: 6.5, comfort: 9.5, durability: 7.0, spin: 6.0, power: 8.5, tension_min: 19, tension_max: 24, price_eur: 24, price_usd: 24, description: 'Le plus confortable des multifilaments.', pro_usage: null, color: 'Pink' },
  { id: 'yonex-poly-tour-pro', brand: 'Yonex', model: 'Poly Tour Pro', type: 'Polyester', gauges: ['1.15', '1.20', '1.25', '1.30'], stiffness: 220, performance: 8.0, control: 8.5, comfort: 7.5, durability: 8.5, spin: 8.0, power: 7.5, tension_min: 22, tension_max: 27, price_eur: 16, price_usd: 16, description: 'Polyester équilibré japonais.', pro_usage: null, color: 'Yellow' },
  { id: 'yonex-poly-tour-strike', brand: 'Yonex', model: 'Poly Tour Strike', type: 'Polyester', gauges: ['1.20', '1.25', '1.30'], stiffness: 235, performance: 8.5, control: 9.0, comfort: 7.0, durability: 8.0, spin: 8.5, power: 7.0, tension_min: 22, tension_max: 27, price_eur: 18, price_usd: 18, description: 'Pour joueurs offensifs cherchant contrôle.', pro_usage: null, color: 'Blue' },
  { id: 'kirschbaum-pro-line-evolution', brand: 'Kirschbaum', model: 'Pro Line Evolution', type: 'Polyester', gauges: ['1.20', '1.25', '1.30'], stiffness: 225, performance: 8.0, control: 8.5, comfort: 7.0, durability: 9.0, spin: 8.0, power: 7.0, tension_min: 23, tension_max: 28, price_eur: 10, price_usd: 12, description: 'Qualité allemande au meilleur prix.', pro_usage: null, color: 'White' },
  { id: 'signum-pro-xperience', brand: 'Signum Pro', model: 'X-Perience', type: 'Polyester', gauges: ['1.18', '1.24', '1.30'], stiffness: 205, performance: 8.5, control: 9.0, comfort: 8.0, durability: 8.0, spin: 8.5, power: 7.5, tension_min: 22, tension_max: 26, price_eur: 11, price_usd: 13, description: 'Référence allemande rapport qualité-prix.', pro_usage: null, color: 'Orange' },
  { id: 'isospeed-cream', brand: 'Isospeed', model: 'Cream', type: 'Polyester', gauges: ['1.20', '1.28'], stiffness: 165, performance: 7.0, control: 8.0, comfort: 9.5, durability: 8.0, spin: 7.5, power: 8.0, tension_min: 20, tension_max: 25, price_eur: 14, price_usd: 16, description: 'Le polyester le plus doux du marché.', pro_usage: null, color: 'Cream' },
  { id: 'weiss-cannon-ultra-cable', brand: 'Weiss Cannon', model: 'Ultra Cable', type: 'Polyester', gauges: ['1.18', '1.23'], stiffness: 250, performance: 8.0, control: 8.0, comfort: 6.5, durability: 8.5, spin: 9.5, power: 6.0, tension_min: 23, tension_max: 28, price_eur: 13, price_usd: 15, description: 'Champion spin selon Tennis Warehouse.', pro_usage: null, color: 'White' },
  { id: 'msv-focus-hex', brand: 'MSV', model: 'Focus Hex', type: 'Polyester', gauges: ['1.18', '1.23', '1.27'], stiffness: 235, performance: 8.0, control: 9.5, comfort: 7.0, durability: 9.0, spin: 9.0, power: 7.0, tension_min: 23, tension_max: 28, price_eur: 12, price_usd: 14, description: 'Excellence allemande hexagonale.', pro_usage: null, color: 'Black' },
  { id: 'prince-synthetic-gut', brand: 'Prince', model: 'Synthetic Gut', type: 'Synthetic', gauges: ['1.25', '1.30', '1.35'], stiffness: 185, performance: 7.0, control: 6.5, comfort: 7.5, durability: 8.0, spin: 6.0, power: 7.5, tension_min: 22, tension_max: 27, price_eur: 8, price_usd: 8, description: 'Le meilleur cordage budget. Valeur sûre.', pro_usage: null, color: 'White' }
];

async function insertData(table, data) {
  console.log(`\n📦 Inserting ${data.length} items into ${table}...`);
  
  let success = 0;
  let failed = 0;
  
  for (const item of data) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
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
      console.error(`\n❌ Failed to insert ${item.id}: ${text}`);
    }
  }
  
  console.log(`\n✅ Inserted: ${success}, Failed: ${failed}`);
  return success;
}

async function countData(table) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await response.json();
  return Array.isArray(data) ? data.length : 0;
}

async function main() {
  console.log('🚀 Inserting Tennis Data into Supabase\n');
  
  // Check current count
  const currentRacquets = await countData('racquets');
  const currentStrings = await countData('strings');
  console.log(`Current data: ${currentRacquets} racquets, ${currentStrings} strings`);
  
  if (currentRacquets > 0 || currentStrings > 0) {
    console.log('\n⚠️  Data already exists. Clearing tables first...');
    
    // Delete existing data
    await fetch(`${SUPABASE_URL}/rest/v1/racquets?id=neq.`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    await fetch(`${SUPABASE_URL}/rest/v1/strings?id=neq.`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
  }
  
  // Insert racquets
  await insertData('racquets', racquetsData);
  
  // Insert strings
  await insertData('strings', stringsData);
  
  // Verify
  const finalRacquets = await countData('racquets');
  const finalStrings = await countData('strings');
  
  console.log(`\n✅ Final count: ${finalRacquets} racquets, ${finalStrings} strings`);
  console.log('🎉 Setup complete!');
}

main().catch(console.error);
