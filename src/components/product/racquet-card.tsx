'use client';

import React from 'react';
import Link from 'next/link';
import { TennisRacquet } from '@/data/racquets-database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Scale, 
  Ruler, 
  Zap, 
  Target, 
  TrendingUp, 
  Star,
  ChevronRight,
  Heart
} from 'lucide-react';

interface RacquetCardProps {
  racquet: TennisRacquet;
  compact?: boolean;
  showActions?: boolean;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  className?: string;
}

// Map category to badge variant and display text
const categoryConfig: Record<string, { variant: 'power' | 'control' | 'comfort' | 'allround' | 'secondary', label: string }> = {
  'Control': { variant: 'control', label: 'Contrôle' },
  'Power': { variant: 'power', label: 'Puissance' },
  'Tweener': { variant: 'allround', label: 'Polyvalent' },
  'Modern Player': { variant: 'power', label: 'Modern Player' },
  'Classic Player': { variant: 'control', label: 'Classic Player' },
  'Junior': { variant: 'secondary', label: 'Junior' },
  'Light': { variant: 'comfort', label: 'Légère' },
};

// Map player level to display and color
const levelColors: Record<string, string> = {
  'Beginner': 'bg-green-100 text-green-700',
  'Intermediate': 'bg-blue-100 text-blue-700',
  'Advanced': 'bg-purple-100 text-purple-700',
  'Pro': 'bg-amber-100 text-amber-800',
};

export function RacquetCard({ 
  racquet, 
  compact = false, 
  showActions = true,
  onFavorite,
  isFavorite = false,
  className 
}: RacquetCardProps) {
  const categoryInfo = categoryConfig[racquet.category || 'Tweener'] || categoryConfig['Tweener'];
  
  // Calculate stiffness rating for visual display
  const stiffnessLevel = racquet.stiffness 
    ? racquet.stiffness > 70 ? 'Rigide' : racquet.stiffness > 65 ? 'Moyenne' : 'Souple'
    : 'N/D';
  
  const stiffnessColor = racquet.stiffness 
    ? racquet.stiffness > 70 ? 'text-red-600' : racquet.stiffness > 65 ? 'text-amber-600' : 'text-green-600'
    : 'text-gray-400';

  if (compact) {
    return (
      <Card className={cn('group relative overflow-hidden', className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {racquet.brand}
                </span>
                <Badge variant={categoryInfo.variant} size="sm">
                  {categoryInfo.label}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-900 truncate">
                {racquet.model} {racquet.variant}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5" />
                  {racquet.weight}g
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  {racquet.headSize}in²
                </span>
                {racquet.stiffness && (
                  <span className={cn('flex items-center gap-1', stiffnessColor)}>
                    <Zap className="h-3.5 w-3.5" />
                    RA {racquet.stiffness}
                  </span>
                )}
              </div>
            </div>
            {racquet.price && (
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">
                  {racquet.price.europe}€
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
      className
    )}>
      {/* Favorite button */}
      {showActions && onFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavorite(racquet.id);
          }}
          className={cn(
            'absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200',
            isFavorite 
              ? 'bg-red-100 text-red-500' 
              : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500'
          )}
        >
          <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
        </button>
      )}

      {/* Brand header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            {racquet.brand}
          </span>
          <Badge variant={categoryInfo.variant}>
            {categoryInfo.label}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Model name */}
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl">
            {racquet.model}
            {racquet.variant && racquet.variant !== 'Standard' && (
              <span className="text-gray-500 font-normal ml-2">{racquet.variant}</span>
            )}
          </CardTitle>
          {racquet.proUsage && (
            <p className="text-sm text-amber-600 flex items-center gap-1 mt-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Utilisé par: {racquet.proUsage}
            </p>
          )}
        </CardHeader>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Scale className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Poids</p>
              <p className="font-semibold text-gray-900">{racquet.weight}g</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Target className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Tamis</p>
              <p className="font-semibold text-gray-900">{racquet.headSize} in²</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className={cn('p-2 rounded-lg', 
              racquet.stiffness && racquet.stiffness > 70 ? 'bg-red-50' : 
              racquet.stiffness && racquet.stiffness > 65 ? 'bg-amber-50' : 'bg-green-50'
            )}>
              <Zap className={cn('h-4 w-4', stiffnessColor)} />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Rigidité (RA)</p>
              <p className={cn('font-semibold', stiffnessColor)}>
                {racquet.stiffness || 'N/D'} - {stiffnessLevel}
              </p>
            </div>
          </div>

          {racquet.stringPattern && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Plan de cordage</p>
                <p className="font-semibold text-gray-900">{racquet.stringPattern}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {racquet.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {racquet.description}
          </p>
        )}

        {/* Player levels */}
        {racquet.playerLevel && racquet.playerLevel.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {racquet.playerLevel.map((level) => (
              <span 
                key={level}
                className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  levelColors[level] || 'bg-gray-100 text-gray-700'
                )}
              >
                {level === 'Beginner' ? 'Débutant' : 
                 level === 'Intermediate' ? 'Intermédiaire' : 
                 level === 'Advanced' ? 'Avancé' : level}
              </span>
            ))}
          </div>
        )}

        {/* Footer with price and action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {racquet.price ? (
            <div>
              <span className="text-2xl font-bold text-green-600">
                {racquet.price.europe}€
              </span>
              <span className="text-sm text-gray-500 ml-2">
                / ${racquet.price.usa}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">Prix non disponible</span>
          )}

          {showActions && (
            <Link href={`/racquets/${racquet.id}`}>
              <Button variant="outline" size="sm" className="group/btn">
                Détails
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function RacquetCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="bg-gray-100 px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
      <CardContent className="p-6">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              <div>
                <div className="h-3 w-12 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-12 w-full bg-gray-200 rounded mb-4" />
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="h-8 w-20 bg-gray-200 rounded" />
          <div className="h-9 w-24 bg-gray-200 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
