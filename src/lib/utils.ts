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
 * Calculate racquet-string compatibility score
 * Based on RA (stiffness) of racquet and rigidity of string
 */
export function calculateCompatibility(
  racquetRA: number,
  stringRigidity: number
): {
  score: number;
  level: 'excellent' | 'good' | 'moderate' | 'poor';
  message: string;
} {
  // Normalized stiffness contribution from string (centered around 200)
  const stringContribution = (stringRigidity - 200) / 10;
  const totalStiffness = racquetRA + stringContribution;

  let score: number;
  let level: 'excellent' | 'good' | 'moderate' | 'poor';
  let message: string;

  if (totalStiffness > 78) {
    score = 40;
    level = 'poor';
    message = 'Setup très rigide - Risque accru de tennis elbow. Considérez un cordage plus souple.';
  } else if (totalStiffness > 72) {
    score = 60;
    level = 'moderate';
    message = 'Setup assez rigide - Bon pour le contrôle mais surveillez votre bras.';
  } else if (totalStiffness > 65) {
    score = 85;
    level = 'good';
    message = 'Bon équilibre rigidité/confort - Setup polyvalent.';
  } else if (totalStiffness > 58) {
    score = 95;
    level = 'excellent';
    message = 'Excellente compatibilité - Équilibre optimal puissance/contrôle/confort.';
  } else {
    score = 75;
    level = 'good';
    message = 'Setup souple - Plus de puissance naturelle, moins de contrôle précis.';
  }

  return { score, level, message };
}

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
