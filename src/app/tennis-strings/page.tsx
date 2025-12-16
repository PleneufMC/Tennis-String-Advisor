'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { stringsDatabase, TennisString } from '@/data/strings-database';
import { StringCard, StringCardSkeleton } from '@/components/product/string-card';
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
type SortOption = 'name' | 'price-asc' | 'price-desc' | 'control' | 'comfort' | 'spin' | 'durability' | 'rating';
type ViewMode = 'grid' | 'list';

interface Filters {
  search: string;
  brands: string[];
  types: string[];
  priceRange: [number, number];
  controlMin: number;
  comfortMin: number;
  spinMin: number;
}

// Extract unique values from database
const brands = [...new Set(stringsDatabase.map(s => s.brand))].sort();
const types = [...new Set(stringsDatabase.map(s => s.type))].sort();

// Get min/max values for ranges
const minPrice = Math.min(...stringsDatabase.map(s => s.price.europe));
const maxPrice = Math.max(...stringsDatabase.map(s => s.price.europe));

const defaultFilters: Filters = {
  search: '',
  brands: [],
  types: [],
  priceRange: [minPrice, maxPrice],
  controlMin: 0,
  comfortMin: 0,
  spinMin: 0,
};

// Type translation
const typeLabels: Record<string, string> = {
  'Polyester': 'Polyester',
  'Multifilament': 'Multifilament',
  'Natural Gut': 'Boyau Naturel',
  'Synthetic': 'Synthétique',
  'Hybrid': 'Hybride',
  'Biodegradable': 'Biodégradable',
};

export default function StringsPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brands: true,
    types: true,
    ratings: true,
    price: false,
  });

  // Filter and sort strings
  const filteredStrings = useMemo(() => {
    let result = stringsDatabase.filter(stringItem => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          stringItem.brand.toLowerCase().includes(searchLower) ||
          stringItem.model.toLowerCase().includes(searchLower) ||
          stringItem.description?.toLowerCase().includes(searchLower) ||
          stringItem.proUsage?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(stringItem.brand)) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(stringItem.type)) {
        return false;
      }

      // Price range filter
      if (stringItem.price.europe < filters.priceRange[0] || stringItem.price.europe > filters.priceRange[1]) {
        return false;
      }

      // Rating filters
      if (stringItem.control < filters.controlMin) return false;
      if (stringItem.comfort < filters.comfortMin) return false;
      if (stringItem.spin < filters.spinMin) return false;

      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
        case 'price-asc':
          return a.price.europe - b.price.europe;
        case 'price-desc':
          return b.price.europe - a.price.europe;
        case 'control':
          return b.control - a.control;
        case 'comfort':
          return b.comfort - a.comfort;
        case 'spin':
          return b.spin - a.spin;
        case 'durability':
          return b.durability - a.durability;
        case 'rating':
          const ratingA = (a.performance + a.control + a.comfort + a.durability) / 4;
          const ratingB = (b.performance + b.control + b.comfort + b.durability) / 4;
          return ratingB - ratingA;
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
      filters.types.length > 0 ||
      filters.priceRange[0] !== minPrice ||
      filters.priceRange[1] !== maxPrice ||
      filters.controlMin > 0 ||
      filters.comfortMin > 0 ||
      filters.spinMin > 0
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

  const toggleType = useCallback((type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
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
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Catalogue des Cordages
          </h1>
          <p className="text-purple-100 text-lg">
            {stringsDatabase.length} cordages de {brands.length} marques différentes
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
                placeholder="Rechercher un cordage, marque, joueur pro..."
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
                className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="rating">Note globale</option>
                <option value="name">Nom</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="control">Contrôle</option>
                <option value="comfort">Confort</option>
                <option value="spin">Spin</option>
                <option value="durability">Durabilité</option>
              </select>
            </div>

            {/* View mode and filter toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'list' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'
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
              {filters.types.map(type => (
                <Badge key={type} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleType(type)}>
                  {typeLabels[type] || type}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {filters.controlMin > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Contrôle ≥ {filters.controlMin}
                </Badge>
              )}
              {filters.comfortMin > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Confort ≥ {filters.comfortMin}
                </Badge>
              )}
              {filters.spinMin > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Spin ≥ {filters.spinMin}
                </Badge>
              )}
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
                  <Filter className="h-5 w-5 text-purple-600" />
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
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                          {brand}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          ({stringsDatabase.filter(s => s.brand === brand).length})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Types */}
              <div className="mb-6">
                <button 
                  onClick={() => toggleSection('types')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
                >
                  Types
                  {expandedSections.types ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.types && (
                  <div className="space-y-2">
                    {types.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.types.includes(type)}
                          onChange={() => toggleType(type)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                          {typeLabels[type] || type}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          ({stringsDatabase.filter(s => s.type === type).length})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <button 
                  onClick={() => toggleSection('ratings')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
                >
                  Notes minimum
                  {expandedSections.ratings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.ratings && (
                  <div className="space-y-4">
                    {/* Control */}
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        Contrôle: {filters.controlMin}+
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={0.5}
                        value={filters.controlMin}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          controlMin: Number(e.target.value)
                        }))}
                        className="w-full accent-purple-600"
                      />
                    </div>

                    {/* Comfort */}
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        Confort: {filters.comfortMin}+
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={0.5}
                        value={filters.comfortMin}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          comfortMin: Number(e.target.value)
                        }))}
                        className="w-full accent-purple-600"
                      />
                    </div>

                    {/* Spin */}
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        Spin: {filters.spinMin}+
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={0.5}
                        value={filters.spinMin}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          spinMin: Number(e.target.value)
                        }))}
                        className="w-full accent-purple-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div>
                <button 
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
                >
                  Prix
                  {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.price && (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 mb-2 block">
                      {filters.priceRange[0]}€ - {filters.priceRange[1]}€
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
                        className="flex-1 accent-purple-600"
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
                        className="flex-1 accent-purple-600"
                      />
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
                <span className="font-semibold text-gray-900">{filteredStrings.length}</span> cordage{filteredStrings.length !== 1 ? 's' : ''} trouvé{filteredStrings.length !== 1 ? 's' : ''}
              </p>
              {favorites.size > 0 && (
                <Badge variant="secondary">
                  {favorites.size} favori{favorites.size !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {/* Strings Grid */}
            {filteredStrings.length > 0 ? (
              <div className={cn(
                'gap-6',
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'flex flex-col'
              )}>
                {filteredStrings.map((stringItem) => (
                  <StringCard
                    key={stringItem.id}
                    string={stringItem}
                    compact={viewMode === 'list'}
                    onFavorite={toggleFavorite}
                    isFavorite={favorites.has(stringItem.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow">
                <div className="text-6xl mb-4">🎾</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun cordage trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={resetFilters} className="bg-purple-600 hover:bg-purple-700">
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
