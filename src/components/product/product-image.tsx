import Image from 'next/image';
import { getProductImage, productImageCredit, type ProductKind } from '@/lib/product-images';
import { cn } from '@/lib/utils';

/**
 * Photo produit hébergée chez nous (public/images/products/), ou illustration.
 *
 * Aucun appel à Tennis Warehouse à l'affichage (pas de hotlink). Les fichiers
 * sont déjà des webp de 600 px au plus : `unoptimized` évite de dépendre de
 * l'optimiseur d'images (build `standalone`, adaptateur Netlify).
 * La boîte a une hauteur fixe, image ou non : aucun saut de mise en page.
 *
 * Sans photo validée (drapeau coupé, quarantaine) : une ILLUSTRATION générique —
 * silhouette au trait, nom du produit en texte, mention « Illustration — photo
 * non disponible ». Elle ne doit jamais pouvoir passer pour la photo du produit
 * (règle 3) : pas d'image générée, pas de couleur de marque, cadre en pointillés.
 */
interface ProductImageProps {
  kind: ProductKind;
  id: string;
  /** Texte alternatif complet, ex. « Raquette Babolat Pure Aero 98 ». */
  alt: string;
  /** Nom affiché sur l'illustration ; par défaut, `alt` sans « Raquette » / « Cordage ». */
  name?: string;
  /** `card` : vignette de catalogue ; `detail` : fiche produit. */
  size?: 'card' | 'detail';
  /** Hors premier écran par défaut ; `eager` pour la fiche détail. */
  eager?: boolean;
  /** Légende « Photo : <source> » (fiche détail). */
  credit?: boolean;
  className?: string;
}

const BOX = {
  card: 'h-44',
  detail: 'h-72 sm:h-80',
} as const;

/** « Raquette Babolat Pure Aero undefined » -> « Babolat Pure Aero ». */
function displayName(alt: string): string {
  return alt
    .replace(/^(Raquette|Cordage)\s+/i, '')
    .replace(/\s+(undefined|null)\b/g, '')
    .trim();
}

export function ProductImage({ kind, id, alt, name, size = 'card', eager = false, credit = false, className }: ProductImageProps) {
  const image = getProductImage(kind, id);

  if (!image) {
    const label = name ?? displayName(alt);
    const detail = size === 'detail';
    return (
      <div
        className={cn(
          'flex items-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400',
          // Les cartes de catalogue restent claires dans les deux thèmes : seule
          // la fiche détail (fond sombre) bascule l'illustration en sombre.
          detail
            ? 'gap-6 px-6 sm:px-10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500'
            : 'flex-col justify-center gap-2 px-4 text-center',
          BOX[size],
          className,
        )}
        role="img"
        aria-label={`Illustration : ${label} (photo non disponible)`}
        data-product-image="illustration"
      >
        {kind === 'racquet' ? <RacquetSilhouette detail={detail} /> : <ReelSilhouette detail={detail} />}
        <div className="min-w-0 max-w-full" aria-hidden="true">
          {detail && (
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {kind === 'racquet' ? 'Raquette' : 'Cordage'}
            </p>
          )}
          <p
            className={cn(
              'font-semibold leading-snug text-slate-800',
              detail ? 'mt-1 line-clamp-3 text-xl dark:text-slate-100' : 'truncate text-sm',
            )}
          >
            {label}
          </p>
          <p className={cn('text-xs italic text-slate-600', detail ? 'mt-3 dark:text-slate-400' : 'mt-0.5')}>
            Illustration — photo non disponible
          </p>
        </div>
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
          Photo : {productImageCredit(image.source)}
        </figcaption>
      )}
    </figure>
  );
}

/** Silhouette de raquette, trait seul (currentColor) : suit le thème. */
function RacquetSilhouette({ detail }: { detail: boolean }) {
  return (
    <svg viewBox="0 0 64 128" className={cn('w-auto shrink-0', detail ? 'h-[85%]' : 'h-24')} fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <ellipse cx="32" cy="36" rx="24" ry="31" />
      <path d="M22 64 L29 84 M42 64 L35 84" strokeLinecap="round" />
      <rect x="28" y="84" width="8" height="38" rx="3" />
      <path d="M20 22h24M16 36h32M20 50h24M26 9v54M38 9v54" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/** Silhouette de garniture de cordage enroulée, trait seul. */
function ReelSilhouette({ detail }: { detail: boolean }) {
  return (
    <svg viewBox="0 0 96 96" className={cn('w-auto shrink-0', detail ? 'h-[70%]' : 'h-20')} fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <circle cx="48" cy="48" r="38" />
      <circle cx="48" cy="48" r="28" strokeWidth="1.5" opacity="0.7" />
      <circle cx="48" cy="48" r="20" strokeWidth="1.5" opacity="0.7" />
      <circle cx="48" cy="48" r="9" />
      <path d="M86 48 C 92 60, 88 76, 74 84" strokeLinecap="round" />
    </svg>
  );
}
