// Local storage management for configurations
// In production, this would be stored in a database

export interface SavedConfiguration {
  id: string;
  name: string;
  racquetId: string;
  mainStringId: string;
  crossStringId?: string;
  mainGauge: string;
  crossGauge: string;
  mainTension: number;
  crossTension: number;
  rating: number;
  notes: string;
  rcsScore: number;
  compatibility: number;
  createdAt: string;
  lastUsed: string;
}

const STORAGE_KEY = 'tennis_configurations';

export const ConfigurationStorage = {
  // Get all configurations
  getAll(): SavedConfiguration[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  // Get a single configuration
  get(id: string): SavedConfiguration | null {
    const configs = this.getAll();
    return configs.find(c => c.id === id) || null;
  },

  // Save a configuration
  save(config: Omit<SavedConfiguration, 'id' | 'createdAt' | 'lastUsed'>): SavedConfiguration {
    const configs = this.getAll();
    const newConfig: SavedConfiguration = {
      ...config,
      id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
    
    configs.unshift(newConfig); // Add to beginning
    
    // Keep only last 100 configurations
    const trimmed = configs.slice(0, 100);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return newConfig;
  },

  // Update a configuration
  update(id: string, updates: Partial<SavedConfiguration>): SavedConfiguration | null {
    const configs = this.getAll();
    const index = configs.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    configs[index] = {
      ...configs[index],
      ...updates,
      lastUsed: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
    return configs[index];
  },

  // Delete a configuration
  delete(id: string): boolean {
    const configs = this.getAll();
    const filtered = configs.filter(c => c.id !== id);
    
    if (filtered.length === configs.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Get recent configurations
  getRecent(limit: number = 5): SavedConfiguration[] {
    return this.getAll().slice(0, limit);
  },

  // Get statistics
  getStats() {
    const configs = this.getAll();
    if (configs.length === 0) {
      return {
        total: 0,
        avgRating: 0,
        avgRCS: 0,
        favoriteRacquet: null,
        favoriteString: null
      };
    }

    const avgRating = configs.reduce((sum, c) => sum + c.rating, 0) / configs.length;
    const avgRCS = configs.reduce((sum, c) => sum + c.rcsScore, 0) / configs.length;
    
    // Find most used racquet
    const racquetCounts = configs.reduce((acc, c) => {
      acc[c.racquetId] = (acc[c.racquetId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteRacquet = Object.entries(racquetCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || null;
    
    // Find most used string
    const stringCounts = configs.reduce((acc, c) => {
      acc[c.mainStringId] = (acc[c.mainStringId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteString = Object.entries(stringCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || null;

    return {
      total: configs.length,
      avgRating: avgRating,
      avgRCS: avgRCS,
      favoriteRacquet,
      favoriteString
    };
  }
};