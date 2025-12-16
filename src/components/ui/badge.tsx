import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-green-100 text-green-800',
        secondary: 'bg-gray-100 text-gray-800',
        destructive: 'bg-red-100 text-red-800',
        warning: 'bg-amber-100 text-amber-800',
        info: 'bg-blue-100 text-blue-800',
        success: 'bg-emerald-100 text-emerald-800',
        purple: 'bg-purple-100 text-purple-800',
        outline: 'border border-gray-300 text-gray-700 bg-transparent',
        // Tennis specific
        premium: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800',
        pro: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800',
        new: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800',
        // String material badges
        polyester: 'bg-blue-100 text-blue-800',
        multifilament: 'bg-purple-100 text-purple-800',
        naturalGut: 'bg-amber-100 text-amber-800',
        hybrid: 'bg-gradient-to-r from-blue-100 to-purple-100 text-indigo-800',
        // Racquet type badges
        power: 'bg-red-100 text-red-800',
        control: 'bg-blue-100 text-blue-800',
        comfort: 'bg-green-100 text-green-800',
        allround: 'bg-gray-100 text-gray-800',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2 py-0.5 text-2xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

// Specialized badges for tennis
interface RatingBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
}

function RatingBadge({ rating, maxRating = 10, className, ...props }: RatingBadgeProps) {
  const percentage = (rating / maxRating) * 100;
  let variant: 'success' | 'warning' | 'destructive' = 'success';
  
  if (percentage < 50) variant = 'destructive';
  else if (percentage < 75) variant = 'warning';
  
  return (
    <Badge variant={variant} className={cn('tabular-nums', className)} {...props}>
      {rating}/{maxRating}
    </Badge>
  );
}

interface PriceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  price: string;
}

function PriceBadge({ price, className, ...props }: PriceBadgeProps) {
  return (
    <Badge variant="secondary" className={cn('font-mono', className)} {...props}>
      {price}
    </Badge>
  );
}

export { Badge, badgeVariants, RatingBadge, PriceBadge };
