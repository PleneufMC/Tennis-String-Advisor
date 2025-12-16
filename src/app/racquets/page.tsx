'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { racquetsDatabase, TennisRacquet } from '@/data/racquets-database';
import { RacquetCard, RacquetCardSkeleton } from '@/components/product/racquet-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  LayoutGrid,
  List,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

// Types for filters
type SortOption = 'name' | 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc' | 'stiffness';
type ViewMode = 'grid' | 'list';

interface Filters {
  search: string;
  brands: string[];
  categories: string[];
  playerLevels: string[];
  weightRange: [number, number];
  stiffnessRange: [number, number];
  priceRange: [number, number];
}

// Extract unique values from database
const brands = [...new Set(racquetsDatabase.map(r => r.brand))].sort();
const categories = [...new Set(racquetsDatabase.map(r => r.category).filter(Boolean))] as string[];
const playerLevels = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];

// Get min/max values for ranges
const minWeight = Math.min(...racquetsDatabase.map(r => r.weight));
const maxWeight = Math.max(...racquetsDatabase.map(r => r.weight));
const minStiffness = Math.min(...racquetsDatabase.filter(r => r.stiffness).map(r => r.stiffness!));
const maxStiffness = Math.max(...racquetsDatabase.filter(r => r.stiffness).map(r => r.stiffness!));
const minPrice = Math.min(...racquetsDatabase.filter(r => r.price).map(r => r.price!.europe));
const maxPrice = Math.max(...racquetsDatabase.filter(r => r.price).map(r => r.price!.europe));

const defaultFilters: Filters = {
  search: '',
  brands: [],
  categories: [],
  playerLevels: [],
  weightRange: [minWeight, maxWeight],
  stiffnessRange: [minStiffness, maxStiffness],
  priceRange: [minPrice, maxPrice],
};

// Category translation
const categoryLabels: Record<string, string> = {
  'Control': 'Contrôle',
  'Power': 'Puissance',
  'Tweener': 'Polyvalent',
  'Modern Player': 'Modern Player',
  'Classic Player': 'Classic Player',
  'Junior': 'Junior',
  'Light': 'Légère',
};

// Level translation
const levelLabels: Record<string, string> = {
  'Beginner': 'Débutant',
  'Intermediate': 'Intermédiaire',
  'Advanced': 'Avancé',
  'Pro': 'Professionnel',
};

export default function RacquetsPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brands: true,
    categories: true,
    levels: true,
    specs: false,
  });

  // Filter and sort racquets
  const filteredRacquets = useMemo(() => {
    let result = racquetsDatabase.filter(racquet => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          racquet.brand.toLowerCase().includes(searchLower) ||
          racquet.model.toLowerCase().includes(searchLower) ||
          racquet.variant.toLowerCase().includes(searchLower) ||
          racquet.description?.toLowerCase().includes(searchLower) ||
          racquet.proUsage?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(racquet.brand)) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && racquet.category && !filters.categories.includes(racquet.category)) {
        return false;
      }

      // Player level filter
      if (filters.playerLevels.length > 0) {
        if (!racquet.playerLevel || !racquet.playerLevel.some(level => filters.playerLevels.includes(level))) {
          return false;
        }
      }

      // Weight range filter
      if (racquet.weight < filters.weightRange[0] || racquet.weight > filters.weightRange[1]) {
        return false;
      }

      // Stiffness range filter
      if (racquet.stiffness) {
        if (racquet.stiffness < filters.stiffnessRange[0] || racquet.stiffness > filters.stiffnessRange[1]) {
          return false;
        }
      }

      // Price range filter
      if (racquet.price) {
        if (racquet.price.europe < filters.priceRange[0] || racquet.price.europe > filters.priceRange[1]) {
          return false;
        }
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
        case 'price-asc':
          return (a.price?.europe || 9999) - (b.price?.europe || 9999);
        case 'price-desc':
          return (b.price?.europe || 0) - (a.price?.europe || 0);
        case 'weight-asc':
          return a.weight - b.weight;
        case 'weight-desc':
          return b.weight - a.weight;
        case 'stiffness':
          return (a.stiffness || 0) - (b.stiffness || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [filters, sortBy]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.brands.length > 0 ||
      filters.categories.length > 0 ||
      filters.playerLevels.length > 0 ||
      filters.weightRange[0] !== minWeight ||
      filters.weightRange[1] !== maxWeight ||
      filters.stiffnessRange[0] !== minStiffness ||
      filters.stiffnessRange[1] !== maxStiffness ||
      filters.priceRange[0] !== minPrice ||
      filters.priceRange[1] !== maxPrice
    );
  }, [filters]);

  // Toggle functions
  const toggleBrand = useCallback((brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  }, []);

  const toggleLevel = useCallback((level: string) => {
    setFilters(prev => ({
      ...prev,
      playerLevels: prev.playerLevels.includes(level)
        ? prev.playerLevels.filter(l => l !== level)
        : [...prev.playerLevels, level]
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Catalogue des Raquettes
          </h1>
          <p className="text-green-100 text-lg">
            {racquetsDatabase.length} raquettes de {brands.length} marques différentes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une raquette, marque, joueur..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 h-12"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Trier par:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Nom</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="weight-asc">Poids croissant</option>
                <option value="weight-desc">Poids décroissant</option>
                <option value="stiffness">Rigidité (RA)</option>
              </select>
            </div>

            {/* View mode and filter toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'grid' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'list' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Active filters pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Filtres actifs:</span>
              {filters.brands.map(brand => (
                <Badge key={brand} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleBrand(brand)}>
                  {brand}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {filters.categories.map(cat => (
                <Badge key={cat} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleCategory(cat)}>
                  {categoryLabels[cat] || cat}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {filters.playerLevels.map(level => (
                <Badge key={level} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleLevel(level)}>
                  {levelLabels[level] || level}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-red-600 hover:text-red-700">
                <RotateCcw className="h-3 w-3 mr-1" />
                Réinitialiser
              </Button>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={cn(
            'w-72 flex-shrink-0 transition-all duration-300',
            showFilters ? 'block' : 'hidden lg:block'
          )}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5 text-green-600" />
                  Filtres
                </h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-red-600">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Brands */}
              <div className="mb-6">
                <button 
                  onClick={() => toggleSection('brands')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
                >
                  Marques
                  {expandedSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.brands && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-green-600 transition-colors">
                          {brand}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          ({racquetsDatabase.filter(r => r.brand === brand).length})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <button 
                  onClick={() => toggleSection('categories')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
                >
                  Catégories
                  {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.categories && (
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-green-600 transition-colors">
                          {categoryLabels[category] || category}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          ({racquetsDatabase.filter(r => r.category === category).length})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Player Levels */}
              <div className="mb-6">
                <button 
                  onClick={() => toggleSection('levels')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
                >
                  Niveau de jeu
                  {expandedSections.levels ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.levels && (
                  <div className="space-y-2">
                    {playerLevels.map(level => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.playerLevels.includes(level)}
                          onChange={() => toggleLevel(level)}
                          className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-green-600 transition-colors">
                          {levelLabels[level] || level}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Advanced Specs */}
              <div>
                <button 
                  onClick={() => toggleSection('specs')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
                >
                  Caractéristiques
                  {expandedSections.specs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.specs && (
                  <div className="space-y-4">
                    {/* Weight Range */}
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        Poids: {filters.weightRange[0]}g - {filters.weightRange[1]}g
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min={minWeight}
                          max={maxWeight}
                          value={filters.weightRange[0]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            weightRange: [Number(e.target.value), prev.weightRange[1]]
                          }))}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min={minWeight}
                          max={maxWeight}
                          value={filters.weightRange[1]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            weightRange: [prev.weightRange[0], Number(e.target.value)]
                          }))}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Stiffness Range */}
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        Rigidité (RA): {filters.stiffnessRange[0]} - {filters.stiffnessRange[1]}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min={minStiffness}
                          max={maxStiffness}
                          value={filters.stiffnessRange[0]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            stiffnessRange: [Number(e.target.value), prev.stiffnessRange[1]]
                          }))}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min={minStiffness}
                          max={maxStiffness}
                          value={filters.stiffnessRange[1]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            stiffnessRange: [prev.stiffnessRange[0], Number(e.target.value)]
                          }))}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        Prix: {filters.priceRange[0]}€ - {filters.priceRange[1]}€
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min={minPrice}
                          max={maxPrice}
                          value={filters.priceRange[0]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            priceRange: [Number(e.target.value), prev.priceRange[1]]
                          }))}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min={minPrice}
                          max={maxPrice}
                          value={filters.priceRange[1]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            priceRange: [prev.priceRange[0], Number(e.target.value)]
                          }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredRacquets.length}</span> raquette{filteredRacquets.length !== 1 ? 's' : ''} trouvée{filteredRacquets.length !== 1 ? 's' : ''}
              </p>
              {favorites.size > 0 && (
                <Badge variant="secondary">
                  {favorites.size} favori{favorites.size !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {/* Racquets Grid */}
            {filteredRacquets.length > 0 ? (
              <div className={cn(
                'gap-6',
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'flex flex-col'
              )}>
                {filteredRacquets.map((racquet) => (
                  <RacquetCard
                    key={racquet.id}
                    racquet={racquet}
                    compact={viewMode === 'list'}
                    onFavorite={toggleFavorite}
                    isFavorite={favorites.has(racquet.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow">
                <div className="text-6xl mb-4">🎾</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune raquette trouvée
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={resetFilters}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
