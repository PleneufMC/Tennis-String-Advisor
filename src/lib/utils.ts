import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class names with Tailwind CSS merge support
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Convert pounds to kilograms
 */
export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10;
}

/**
 * Convert kilograms to pounds
 */
export function kgToLbs(kg: number): number {
  return Math.round((kg / 0.453592) * 10) / 10;
}

/**
 * Format tension with unit
 */
export function formatTension(value: number, unit: 'kg' | 'lbs'): string {
  if (unit === 'lbs') {
    return `${kgToLbs(value)} lbs`;
  }
  return `${value} kg`;
}

/**
 * Format price range
 */
export function formatPriceRange(min: number, max: number, currency = '€'): string {
  if (min === max) {
    return `${min}${currency}`;
  }
  return `${min}-${max}${currency}`;
}

/**
 * ⚠️ `calculateCompatibility` A ÉTÉ SUPPRIMÉE D'ICI (audit du 8 août 2026).
 *
 * Une seconde fonction homonyme existait dans ce fichier, avec une signature
 * `(racquetRA, stringRigidity)` incompatible avec celle de
 * `data/racquets-database.ts` — signature `(racquet, stringStiffness, tension)`.
 * Elle ignorait la tension, renvoyait des scores figés (40/60/85/95/75) et une
 * échelle `level` que l'autre fonction n'a pas.
 *
 * Elle n'était importée par AUCUN fichier (vérifié : seul `cn` est consommé
 * depuis `lib/utils`). Deux fonctions de même nom donnant des verdicts
 * différents sur le même setup constituaient un piège à autocomplétion :
 * importer la mauvaise aurait produit des conseils de santé du bras erronés,
 * sans aucune erreur de compilation.
 *
 * La référence unique est désormais `calculateCompatibility` de
 * `data/racquets-database.ts`, dont les seuils ont été recalibrés sur la
 * distribution réelle. Voir `lib/racquet-scoring.ts` pour la notation raquette.
 */

/**
 * Get recommended tension range based on string type
 */
export function getRecommendedTension(stringMaterial: string): {
  min: number;
  max: number;
  unit: 'kg';
} {
  const ranges: Record<string, { min: number; max: number }> = {
    polyester: { min: 20, max: 26 },
    multifilament: { min: 22, max: 27 },
    natural_gut: { min: 23, max: 28 },
    synthetic_gut: { min: 22, max: 27 },
    hybrid: { min: 21, max: 26 },
    kevlar: { min: 20, max: 25 },
    copoly: { min: 20, max: 26 },
  };

  return {
    ...ranges[stringMaterial] || { min: 21, max: 26 },
    unit: 'kg',
  };
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string, locale = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if value is in range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number, locale = 'fr-FR'): string {
  return num.toLocaleString(locale);
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if we're on the client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Check if we're on the server side
 */
export const isServer = typeof window === 'undefined';

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
