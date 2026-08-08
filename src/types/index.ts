// Types principaux pour Tennis String Advisor

// =====================
// RACQUETS
// =====================

export type RacquetType = 'puissance' | 'controle' | 'polyvalent' | 'confort';

export interface Racquet {
  id: string;
  name: string;
  brand: string;
  model?: string;
  year?: number;
  
  // Technical specs
  weight: number; // grams
  weightRange?: string; // "300g"
  balance?: number; // points
  length?: number; // inches
  headSize: number; // sq inches
  headSizeDisplay?: string; // "100in²"
  stringPattern?: string; // "16x19"
  swingWeight?: number;
  stiffness: number; // RA
  beamWidth?: string; // "23-26-22mm"
  
  // Characteristics
  type: RacquetType;
  
  // Commercial info
  price?: number;
  currency?: string;
  availability?: string;
  images?: string[];
  description?: string;
  
  /**
   * ⚠️ NOTES JAMAIS RENSEIGNÉES — NE PAS LIRE CES CHAMPS (audit du 8 août 2026).
   *
   * Ces 5 notes sont déclarées ici depuis l'origine, mais la mesure sur les
   * 129 raquettes réelles donne **0 raquette renseignée**. Elles valent donc
   * toujours `undefined`.
   *
   * C'est la cause de l'asymétrie que l'on constatait dans l'interface : les
   * cordages affichaient 5 notes (contrôle / confort / spin / puissance /
   * durabilité, toutes peuplées) et les raquettes des barres vides ou absentes.
   *
   * Deux points à comprendre avant d'y toucher :
   *  - La base réellement utilisée par le site est `TennisRacquet` de
   *    `data/racquets-database.ts`, PAS cette interface. Celle-ci n'est
   *    référencée que par d'autres types de ce même fichier (`RacquetBrand`,
   *    etc.), eux-mêmes non consommés par les pages.
   *  - Pour obtenir un profil de jeu de raquette, utiliser
   *    `deriveRacquetProfile()` de `lib/racquet-scoring.ts` : il CALCULE les
   *    5 notes à partir des specs réelles (poids, tamis, RA, plan de cordage)
   *    au lieu d'attendre des données que les fabricants ne publient pas.
   *
   * Conservées en `@deprecated` plutôt que supprimées : la suppression sèche
   * romprait tout code externe typé sur cette interface, alors que le vrai
   * problème est qu'il ne faut pas s'y fier.
   *
   * @deprecated Utiliser `deriveRacquetProfile()` de `lib/racquet-scoring.ts`.
   */
  power?: number;
  /** @deprecated Voir `power` ci-dessus : jamais renseigné. */
  control?: number;
  /** @deprecated Voir `power` ci-dessus : jamais renseigné. */
  comfort?: number;
  /** @deprecated Voir `power` ci-dessus : jamais renseigné. */
  spin?: number;
  /** @deprecated Voir `power` ci-dessus : jamais renseigné. */
  maneuverability?: number;
}

export interface RacquetBrand {
  id: string;
  name: string;
  logo?: string;
  racquets: Racquet[];
}

// =====================
// STRINGS
// =====================

export type StringMaterial = 
  | 'polyester' 
  | 'multifilament' 
  | 'natural_gut' 
  | 'synthetic_gut' 
  | 'hybrid'
  | 'kevlar'
  | 'copoly';

export type StringCategory = 
  | 'elite' 
  | 'premium' 
  | 'standard' 
  | 'comfort' 
  | 'budget' 
  | 'innovation';

export type StringPlayStyle = 
  | 'controle' 
  | 'puissance' 
  | 'spin' 
  | 'confort' 
  | 'polyvalent'
  | 'eco'
  | 'innovation';

export interface TennisString {
  id: string;
  name: string;
  brand: string;
  
  // Technical specs
  material: StringMaterial;
  gauge?: string; // "16", "17", "18"
  gaugeInMm?: number;
  color?: string;
  
  // Performance ratings (1-10)
  rigidity: number; // lb/in (stiffness)
  performance: number;
  control: number;
  comfort: number;
  durability?: number;
  spin?: number;
  power?: number;
  
  // Characteristics
  category: StringCategory;
  playStyle: StringPlayStyle;
  
  // Commercial info
  price: string; // "18-22€"
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  availability?: string;
  images?: string[];
  description: string;
  
  // Tension recommendations
  tensionMin?: number;
  tensionMax?: number;
}

// =====================
// CONFIGURATION
// =====================

export interface StringConfiguration {
  isHybrid: boolean;
  mainString: TennisString | null;
  crossString: TennisString | null;
  mainTension: number;
  crossTension: number;
  tensionUnit: 'kg' | 'lbs';
}

export interface SetupConfiguration {
  racquet: Racquet | null;
  strings: StringConfiguration;
}

export interface SetupAnalysis {
  compatibility: 'excellent' | 'good' | 'moderate' | 'poor';
  compatibilityScore: number;
  stiffnessScore: number;
  recommendations: string[];
  warnings: string[];
  pros: string[];
  cons: string[];
}

// =====================
// USER
// =====================

export type PlayerLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';
export type PlayStyle = 'aggressive' | 'defensive' | 'all-court' | 'serve-volley';
export type DominantHand = 'right' | 'left' | 'ambidextrous';

export interface UserPreferences {
  playerLevel?: PlayerLevel;
  playStyle?: PlayStyle;
  dominantHand?: DominantHand;
  preferredTension?: number;
  preferredBrands?: string[];
  budgetMin?: number;
  budgetMax?: number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: 'USER' | 'PREMIUM' | 'ADMIN';
  preferences?: UserPreferences;
}

// =====================
// REVIEWS
// =====================

export interface Review {
  id: string;
  userId: string;
  racquetId?: string;
  stringId?: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  playerLevel?: PlayerLevel;
  playStyle?: PlayStyle;
  verified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// =====================
// API RESPONSES
// =====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =====================
// FILTERS
// =====================

export interface RacquetFilters {
  brands?: string[];
  types?: RacquetType[];
  weightMin?: number;
  weightMax?: number;
  headSizeMin?: number;
  headSizeMax?: number;
  stiffnessMin?: number;
  stiffnessMax?: number;
  priceMin?: number;
  priceMax?: number;
}

export interface StringFilters {
  brands?: string[];
  materials?: StringMaterial[];
  categories?: StringCategory[];
  playStyles?: StringPlayStyle[];
  rigidityMin?: number;
  rigidityMax?: number;
  priceMin?: number;
  priceMax?: number;
}

// =====================
// COMPARISONS
// =====================

export interface Comparison {
  id: string;
  name: string;
  userId: string;
  racquets: Racquet[];
  strings: TennisString[];
  createdAt: Date;
  updatedAt: Date;
}
