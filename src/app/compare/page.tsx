'use client';

import React, { useState, useMemo } from 'react';
import { racquetsDatabase, TennisRacquet } from '@/data/racquets-database';
import { stringsDatabase, TennisString } from '@/data/strings-database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  deriveRacquetProfile,
  effectiveRacquetRA,
  isRacquetStiffnessEstimated,
  RA_RANGE,
} from '@/lib/racquet-scoring';
import { 
  Search, 
  X, 
  Plus,
  Scale,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Trash2,
  ArrowLeftRight
} from 'lucide-react';

type CompareMode = 'racquets' | 'strings';

interface ComparisonItem {
  type: 'racquet' | 'string';
  item: TennisRacquet | TennisString;
}

// Category badge configs
const racquetCategoryConfig: Record<string, { variant: 'power' | 'control' | 'comfort' | 'allround' | 'secondary', label: string }> = {
  'Control': { variant: 'control', label: 'Contrôle' },
  'Power': { variant: 'power', label: 'Puissance' },
  'Tweener': { variant: 'allround', label: 'Polyvalent' },
  'Modern Player': { variant: 'power', label: 'Modern Player' },
  'Classic Player': { variant: 'control', label: 'Classic Player' },
  'Junior': { variant: 'secondary', label: 'Junior' },
  'Light': { variant: 'comfort', label: 'Légère' },
};

const stringTypeConfig: Record<string, { variant: 'polyester' | 'multifilament' | 'naturalGut' | 'hybrid' | 'secondary', label: string }> = {
  'Polyester': { variant: 'polyester', label: 'Polyester' },
  'Multifilament': { variant: 'multifilament', label: 'Multifilament' },
  'Natural Gut': { variant: 'naturalGut', label: 'Boyau Naturel' },
  'Synthetic': { variant: 'secondary', label: 'Synthétique' },
  'Hybrid': { variant: 'hybrid', label: 'Hybride' },
  'Biodegradable': { variant: 'secondary', label: 'Biodégradable' },
};

/**
 * Barre de comparaison.
 *
 * Échelles CALIBRÉES sur les plages réellement présentes en base (mesurées le
 * 8 août 2026 sur 129 raquettes et 190 cordages). Deux défauts corrigés ici :
 *
 * 1. Les échelles démarraient toutes à 0, alors qu'aucune donnée n'approche 0.
 *    Le RA (55-72) affiché sur une échelle 0-80 ne remplissait que 69 % -> 90 %
 *    de la barre : 21 points d'amplitude pour distinguer deux raquettes, soit
 *    des barres visuellement quasi identiques. Idem tamis (68->96 %) et
 *    contrôle cordage (65->100 %). `minValue` recadre la barre sur la plage
 *    utile, ce qui rend l'écart lisible.
 * 2. Le prix des cordages était borné à 50 € alors que le maximum réel est
 *    65 €. La largeur calculée atteignait 130 % et se faisait rogner en
 *    silence par `overflow-hidden` : un cordage à 65 € et un à 50 € donnaient
 *    exactement la même barre pleine. Les bornes sont désormais dérivées des
 *    données, et un `clamp` garantit qu'aucun débordement ne puisse revenir.
 *
 * `minValue` reste optionnel : sans lui, le comportement d'origine (base 0)
 * est conservé.
 */
function ComparisonBar({ label, values, maxValue, minValue = 0, unit, colors }: {
  label: string;
  values: (number | null)[];
  maxValue: number;
  minValue?: number;
  unit?: string;
  colors: string[];
}) {
  const span = maxValue - minValue;
  const widthOf = (value: number) => {
    if (span <= 0) return 0;
    // Plancher à 4 % pour que la valeur la plus basse reste visible,
    // plafond à 100 % pour interdire tout débordement rogné.
    const ratio = ((value - minValue) / span) * 100;
    return Math.min(100, Math.max(4, ratio));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
        <div className="flex gap-2">
          {values.map((value, index) => (
            <span key={index} className={cn('text-xs font-semibold', colors[index])}>
              {value !== null ? value.toFixed(1) : 'N/A'}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-1 h-3">
        {values.map((value, index) => (
          <div key={index} className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-500', colors[index].replace('text-', 'bg-'))}
              style={{ width: value !== null ? `${widthOf(value)}%` : '0%' }}
            />
          </div>
        ))}
      </div>
      {/* L'échelle ne démarrant plus à 0, elle doit être annoncée explicitement,
          sinon une barre courte se lirait à tort comme une valeur proche de 0. */}
      <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">
        <span>{minValue}{unit ?? ''}</span>
        <span>{maxValue}{unit ?? ''}</span>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [mode, setMode] = useState<CompareMode>('racquets');
  const [selectedItems, setSelectedItems] = useState<ComparisonItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelector, setShowSelector] = useState(false);

  const maxItems = 4;
  const colors = ['text-green-600', 'text-blue-600', 'text-purple-600', 'text-amber-600'];

  // Filter items based on search
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (mode === 'racquets') {
      return racquetsDatabase.filter(r => 
        r.brand.toLowerCase().includes(query) ||
        r.model.toLowerCase().includes(query) ||
        r.variant.toLowerCase().includes(query)
      );
    } else {
      return stringsDatabase.filter(s =>
        s.brand.toLowerCase().includes(query) ||
        s.model.toLowerCase().includes(query)
      );
    }
  }, [mode, searchQuery]);

  // Add item to comparison
  const addItem = (item: TennisRacquet | TennisString) => {
    if (selectedItems.length >= maxItems) return;
    
    const type = mode === 'racquets' ? 'racquet' : 'string';
    const alreadySelected = selectedItems.some(
      si => si.type === type && si.item.id === item.id
    );
    
    if (!alreadySelected) {
      setSelectedItems([...selectedItems, { type, item }]);
    }
    setShowSelector(false);
    setSearchQuery('');
  };

  // Remove item from comparison
  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  // Clear all items
  const clearAll = () => {
    setSelectedItems([]);
  };

  // Switch mode
  const switchMode = (newMode: CompareMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setSelectedItems([]);
      setSearchQuery('');
    }
  };

  // Get comparison specs
  const comparisonSpecs = useMemo(() => {
    if (selectedItems.length === 0) return null;

    if (mode === 'racquets') {
      const racquets = selectedItems.map(si => si.item as TennisRacquet);
      // Les cordages exposent 5 notes interprétables, les raquettes n'avaient que
      // des specs brutes : la comparaison était asymétrique. `deriveRacquetProfile`
      // calcule 5 notes équivalentes à partir des specs réelles (poids, tamis, RA,
      // plan de cordage) — les champs `power`/`control`/... de l'interface
      // `Racquet` de types/index.ts sont, eux, renseignés sur 0 des 129 raquettes.
      const profiles = racquets.map(r => deriveRacquetProfile(r));
      return {
        weight: racquets.map(r => r.weight),
        headSize: racquets.map(r => r.headSize),
        // RA effectif : la médiane mesurée (64) comble les 29 raquettes sans RA
        // publié, et `raEstimated` permet de le signaler au lieu d'afficher N/A.
        stiffness: racquets.map(r => effectiveRacquetRA(r)),
        raEstimated: racquets.map(r => isRacquetStiffnessEstimated(r)),
        price: racquets.map(r => r.price?.europe ?? null),
        power: profiles.map(p => p.power),
        control: profiles.map(p => p.control),
        comfort: profiles.map(p => p.comfort),
        maneuverability: profiles.map(p => p.maneuverability),
        stability: profiles.map(p => p.stability),
      };
    } else {
      const strings = selectedItems.map(si => si.item as TennisString);
      return {
        control: strings.map(s => s.control),
        comfort: strings.map(s => s.comfort),
        spin: strings.map(s => s.spin),
        durability: strings.map(s => s.durability),
        power: strings.map(s => s.power),
        price: strings.map(s => s.price.europe),
      };
    }
  }, [selectedItems, mode]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <ArrowLeftRight className="h-10 w-10" />
            Comparateur
          </h1>
          <p className="text-amber-100 text-lg">
            Comparez jusqu&apos;à {maxItems} produits côte à côte
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => switchMode('racquets')}
                className={cn(
                  'px-6 py-2 rounded-lg font-semibold transition-all',
                  mode === 'racquets' 
                    ? 'bg-white shadow text-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                🎾 Raquettes
              </button>
              <button
                onClick={() => switchMode('strings')}
                className={cn(
                  'px-6 py-2 rounded-lg font-semibold transition-all',
                  mode === 'strings' 
                    ? 'bg-white shadow text-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                🧵 Cordages
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {selectedItems.length}/{maxItems} sélectionnés
              </span>
              {selectedItems.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Tout effacer
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Selected Items Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(maxItems)].map((_, index) => {
            const item = selectedItems[index];
            
            if (!item) {
              return (
                <button
                  key={index}
                  onClick={() => setShowSelector(true)}
                  className="bg-white rounded-2xl shadow border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <Plus className="h-10 w-10 text-gray-300 group-hover:text-green-500 transition-colors" />
                  <span className="text-sm text-gray-500 mt-2 group-hover:text-green-600">
                    Ajouter {mode === 'racquets' ? 'une raquette' : 'un cordage'}
                  </span>
                </button>
              );
            }

            const isRacquet = item.type === 'racquet';
            const racquet = isRacquet ? item.item as TennisRacquet : null;
            const stringItem = !isRacquet ? item.item as TennisString : null;

            return (
              <Card key={index} className={cn(
                'relative overflow-hidden',
                `border-2`,
                index === 0 ? 'border-green-200' : 
                index === 1 ? 'border-blue-200' : 
                index === 2 ? 'border-purple-200' : 'border-amber-200'
              )}>
                {/* Remove button */}
                <button
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-red-100 rounded-full text-red-500 hover:bg-red-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Color indicator */}
                <div className={cn(
                  'h-1',
                  index === 0 ? 'bg-green-500' : 
                  index === 1 ? 'bg-blue-500' : 
                  index === 2 ? 'bg-purple-500' : 'bg-amber-500'
                )} />

                <CardContent className="p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {isRacquet ? racquet?.brand : stringItem?.brand}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {isRacquet ? `${racquet?.model} ${racquet?.variant}` : stringItem?.model}
                  </h3>
                  
                  {isRacquet && racquet && (
                    <>
                      <Badge variant={racquetCategoryConfig[racquet.category || 'Tweener']?.variant || 'secondary'} size="sm" className="mb-3">
                        {racquetCategoryConfig[racquet.category || 'Tweener']?.label}
                      </Badge>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Scale className="h-3 w-3" />
                          {racquet.weight}g
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {racquet.headSize} in²
                        </div>
                        {racquet.stiffness && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            RA {racquet.stiffness}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {!isRacquet && stringItem && (
                    <>
                      <Badge variant={stringTypeConfig[stringItem.type]?.variant || 'secondary'} size="sm" className="mb-3">
                        {stringTypeConfig[stringItem.type]?.label}
                      </Badge>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Ctrl: {stringItem.control.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Conf: {stringItem.comfort.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Spin: {stringItem.spin.toFixed(1)}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className={cn('text-lg font-bold', colors[index])}>
                      {isRacquet ? racquet?.price?.europe : stringItem?.price.europe}€
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        {selectedItems.length >= 2 && comparisonSpecs && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Comparaison détaillée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === 'racquets' ? (
                <>
                  {/* Bornes = plages réelles mesurées en base, pas des chiffres ronds. */}
                  <ComparisonBar
                    label="Poids (g)"
                    values={comparisonSpecs.weight as number[]}
                    minValue={170}
                    maxValue={320}
                    unit=" g"
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Taille tamis (in²)"
                    values={comparisonSpecs.headSize as number[]}
                    minValue={82}
                    maxValue={115}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Rigidité (RA)"
                    values={comparisonSpecs.stiffness as (number | null)[]}
                    minValue={RA_RANGE.min}
                    maxValue={RA_RANGE.max}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  {(comparisonSpecs.raEstimated as boolean[]).some(Boolean) && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 -mt-4">
                      RA estimé à {RA_RANGE.median} (médiane mesurée) pour les raquettes
                      dont le fabricant ne publie pas cette valeur.
                    </p>
                  )}
                  <ComparisonBar
                    label="Prix (€)"
                    values={comparisonSpecs.price as (number | null)[]}
                    minValue={25}
                    maxValue={300}
                    unit=" €"
                    colors={colors.slice(0, selectedItems.length)}
                  />

                  {/* Profil dérivé : rétablit la symétrie avec les cordages. */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                      Profil de jeu (calculé)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Notes déduites des specs ci-dessus (poids, tamis, RA, plan de
                      cordage) et non fournies par les fabricants.
                    </p>
                  </div>
                  <ComparisonBar
                    label="Puissance"
                    values={comparisonSpecs.power as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Contrôle"
                    values={comparisonSpecs.control as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Confort"
                    values={comparisonSpecs.comfort as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Maniabilité"
                    values={comparisonSpecs.maneuverability as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Stabilité"
                    values={comparisonSpecs.stability as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                </>
              ) : (
                <>
                  <ComparisonBar
                    label="Contrôle"
                    values={comparisonSpecs.control as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Confort"
                    values={comparisonSpecs.comfort as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Spin"
                    values={comparisonSpecs.spin as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Durabilité"
                    values={comparisonSpecs.durability as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  <ComparisonBar
                    label="Puissance"
                    values={comparisonSpecs.power as number[]}
                    maxValue={10}
                    colors={colors.slice(0, selectedItems.length)}
                  />
                  {/* 65 € est le maximum réel mesuré ; la borne à 50 € produisait
                      une largeur de 130 % rognée en silence par overflow-hidden. */}
                  <ComparisonBar
                    label="Prix (€)"
                    values={comparisonSpecs.price as number[]}
                    minValue={6}
                    maxValue={65}
                    unit=" €"
                    colors={colors.slice(0, selectedItems.length)}
                  />
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {selectedItems.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🎾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Commencez à comparer
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Sélectionnez au moins 2 {mode === 'racquets' ? 'raquettes' : 'cordages'} pour voir une comparaison détaillée de leurs caractéristiques.
              </p>
              <Button onClick={() => setShowSelector(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter {mode === 'racquets' ? 'une raquette' : 'un cordage'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Selection need message */}
        {selectedItems.length === 1 && (
          <Card className="text-center py-8 bg-amber-50 border-amber-200">
            <CardContent>
              <p className="text-amber-700">
                Ajoutez au moins un autre {mode === 'racquets' ? 'raquette' : 'cordage'} pour voir la comparaison.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Item Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle>
                  Sélectionner {mode === 'racquets' ? 'une raquette' : 'un cordage'}
                </CardTitle>
                <button 
                  onClick={() => {
                    setShowSelector(false);
                    setSearchQuery('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[50vh]">
              <div className="divide-y divide-gray-100">
                {filteredItems.slice(0, 20).map((item) => {
                  const isRacquet = mode === 'racquets';
                  const racquet = isRacquet ? item as TennisRacquet : null;
                  const stringItem = !isRacquet ? item as TennisString : null;
                  const alreadySelected = selectedItems.some(
                    si => si.item.id === item.id
                  );

                  return (
                    <button
                      key={item.id}
                      onClick={() => !alreadySelected && addItem(item)}
                      disabled={alreadySelected || selectedItems.length >= maxItems}
                      className={cn(
                        'w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                        alreadySelected && 'opacity-50 cursor-not-allowed bg-gray-50',
                        selectedItems.length >= maxItems && !alreadySelected && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase">
                          {isRacquet ? racquet?.brand : stringItem?.brand}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {isRacquet ? `${racquet?.model} ${racquet?.variant}` : stringItem?.model}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {isRacquet ? (
                            <span>{racquet?.weight}g • {racquet?.headSize}in² • RA {racquet?.stiffness || 'N/A'}</span>
                          ) : (
                            <span>{stringItem?.type} • Ctrl: {stringItem?.control.toFixed(1)} • Conf: {stringItem?.comfort.toFixed(1)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-green-600">
                          {isRacquet ? racquet?.price?.europe : stringItem?.price.europe}€
                        </span>
                        {alreadySelected ? (
                          <Badge variant="secondary">Sélectionné</Badge>
                        ) : (
                          <Plus className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
                {filteredItems.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    Aucun résultat trouvé
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
