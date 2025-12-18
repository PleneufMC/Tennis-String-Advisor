'use client';

import React from 'react';
import Link from 'next/link';
import { TennisString } from '@/data/strings-database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Target, 
  Zap, 
  Shield, 
  TrendingUp,
  Star,
  ChevronRight,
  Heart,
  Palette
} from 'lucide-react';

interface StringCardProps {
  string: TennisString;
  compact?: boolean;
  showActions?: boolean;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  className?: string;
}

// Map string type to badge variant
const typeConfig: Record<string, { variant: 'polyester' | 'multifilament' | 'naturalGut' | 'hybrid' | 'secondary', label: string }> = {
  'Polyester': { variant: 'polyester', label: 'Polyester' },
  'Multifilament': { variant: 'multifilament', label: 'Multifilament' },
  'Natural Gut': { variant: 'naturalGut', label: 'Boyau Naturel' },
  'Synthetic': { variant: 'secondary', label: 'Synthétique' },
  'Hybrid': { variant: 'hybrid', label: 'Hybride' },
  'Biodegradable': { variant: 'secondary', label: 'Biodégradable' },
};

// Rating bar component
function RatingBar({ label, value, maxValue = 10, color = 'green' }: { 
  label: string; 
  value: number; 
  maxValue?: number;
  color?: 'green' | 'blue' | 'amber' | 'purple' | 'red';
}) {
  const percentage = (value / maxValue) * 100;
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

export function StringCard({ 
  string, 
  compact = false, 
  showActions = true,
  onFavorite,
  isFavorite = false,
  className 
}: StringCardProps) {
  const typeInfo = typeConfig[string.type] || { variant: 'secondary' as const, label: string.type };
  
  // Calculate overall rating
  const overallRating = (
    (string.performance + string.control + string.comfort + string.durability) / 4
  ).toFixed(1);

  if (compact) {
    return (
      <Card className={cn('group relative overflow-hidden', className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {string.brand}
                </span>
                <Badge variant={typeInfo.variant} size="sm">
                  {typeInfo.label}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-900 truncate">
                {string.model}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  {string.control.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  {string.comfort.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {string.spin.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">
                {string.price.europe}€
              </span>
            </div>
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
            onFavorite(string.id);
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
            {string.brand}
          </span>
          <Badge variant={typeInfo.variant}>
            {typeInfo.label}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Model name and rating */}
        <CardHeader className="p-0 mb-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">
              {string.model}
            </CardTitle>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg">
              <Star className="h-4 w-4 fill-green-500 text-green-500" />
              <span className="font-bold text-sm">{overallRating}</span>
            </div>
          </div>
          {string.proUsage && (
            <p className="text-sm text-amber-600 flex items-center gap-1 mt-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {string.proUsage}
            </p>
          )}
        </CardHeader>

        {/* Quick specs */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Jauges</p>
            <p className="text-sm font-semibold text-gray-900">
              {string.gauges.slice(0, 2).join(', ')}
              {string.gauges.length > 2 && '...'}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Tension</p>
            <p className="text-sm font-semibold text-gray-900">
              {string.recommendedTension.min}-{string.recommendedTension.max}kg
            </p>
          </div>
          {string.color && (
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Couleur</p>
              <div className="flex items-center justify-center gap-1">
                <Palette className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-900">{string.color}</span>
              </div>
            </div>
          )}
        </div>

        {/* Ratings */}
        <div className="space-y-2 mb-4">
          <RatingBar label="Contrôle" value={string.control} color="blue" />
          <RatingBar label="Confort" value={string.comfort} color="green" />
          <RatingBar label="Spin" value={string.spin} color="amber" />
          <RatingBar label="Durabilité" value={string.durability} color="purple" />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {string.description}
        </p>

        {/* Footer with price and action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-green-600">
              {string.price.europe}€
            </span>
            <span className="text-sm text-gray-500 ml-2">
              / ${string.price.usa}
            </span>
          </div>

          {showActions && (
            <Link href={`/tennis-strings/${string.id}`}>
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

export function StringCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="bg-gray-100 px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-7 w-12 bg-gray-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="space-y-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full" />
              <div className="h-3 w-6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="h-10 w-full bg-gray-200 rounded mb-4" />
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-9 w-24 bg-gray-200 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
