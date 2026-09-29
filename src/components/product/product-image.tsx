import Image from 'next/image';
import { getProductImage, type ProductKind } from '@/lib/product-images';
import { cn } from '@/lib/utils';

/**
 * Photo produit hébergée chez nous (public/images/products/), ou visuel neutre.
 *
 * Aucun appel à Tennis Warehouse à l'affichage (pas de hotlink). Les fichiers
 * sont déjà des webp de 600 px au plus : `unoptimized` évite de dépendre de
 * l'optimiseur d'images (build `standalone`, adaptateur Netlify).
 * La boîte a une hauteur fixe, image ou non : aucun saut de mise en page.
 */
interface ProductImageProps {
  kind: ProductKind;
  id: string;
  /** Texte alternatif complet, ex. « Raquette Babolat Pure Aero 98 ». */
  alt: string;
  /** `card` : vignette de catalogue ; `detail` : fiche produit. */
  size?: 'card' | 'detail';
  /** Hors premier écran par défaut ; `eager` pour la fiche détail. */
  eager?: boolean;
  /** Légende « Photo : Tennis Warehouse » (fiche détail). */
  credit?: boolean;
  className?: string;
}

const BOX = {
  card: 'h-44',
  detail: 'h-72 sm:h-80',
} as const;

export function ProductImage({ kind, id, alt, size = 'card', eager = false, credit = false, className }: ProductImageProps) {
  const image = getProductImage(kind, id);

  if (!image) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-slate-100 text-slate-400',
          // Les cartes de catalogue restent blanches dans les deux thèmes : seule
          // la fiche détail (fond sombre) bascule le visuel neutre en sombre.
          size === 'detail' && 'dark:bg-slate-800 dark:text-slate-500',
          BOX[size],
          className,
        )}
        data-product-image="placeholder"
      >
        {kind === 'racquet' ? <RacquetSilhouette /> : <ReelSilhouette />}
      </div>
    );
  }

  return (
    <figure className={className} data-product-image="photo">
      {/* Fond blanc dans les deux thèmes : les photos sont détourées sur blanc. */}
      <div className={cn('relative overflow-hidden rounded-lg bg-white', BOX[size])}>
        <Image
          src={image.file}
          alt={alt}
          width={image.width}
          height={image.height}
          unoptimized
          loading={eager ? 'eager' : 'lazy'}
          className="h-full w-full object-contain p-2"
        />
      </div>
      {credit && (
        <figcaption className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Photo : Tennis Warehouse
        </figcaption>
      )}
    </figure>
  );
}

/** Silhouette de raquette, trait seul (currentColor) : suit le thème. */
function RacquetSilhouette() {
  return (
    <svg viewBox="0 0 64 128" className="h-3/4 w-auto" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <ellipse cx="32" cy="36" rx="24" ry="31" />
      <path d="M22 64 L29 84 M42 64 L35 84" strokeLinecap="round" />
      <rect x="28" y="84" width="8" height="38" rx="3" />
      <path d="M20 22h24M16 36h32M20 50h24M26 9v54M38 9v54" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/** Silhouette de garniture de cordage enroulée, trait seul. */
function ReelSilhouette() {
  return (
    <svg viewBox="0 0 96 96" className="h-3/5 w-auto" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <circle cx="48" cy="48" r="38" />
      <circle cx="48" cy="48" r="28" strokeWidth="1.5" opacity="0.7" />
      <circle cx="48" cy="48" r="20" strokeWidth="1.5" opacity="0.7" />
      <circle cx="48" cy="48" r="9" />
      <path d="M86 48 C 92 60, 88 76, 74 84" strokeLinecap="round" />
    </svg>
  );
}
