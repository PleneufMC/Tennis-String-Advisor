import { PRODUCT_IMAGES, type ProductImageEntry, type ProductImageSource } from '@/data/product-images';

/**
 * Photos produit (raquettes, cordages) — décision de Pierre du 29/09/2026.
 *
 * Les photos viennent de Tennis Warehouse (et, depuis le 09/10/2026, de Tennis
 * Warehouse Europe, même groupe), dont les conditions interdisent la
 * reproduction sans permission écrite ; une demande est en cours. Tout le
 * dispositif passe donc par CE drapeau : à `false`, chaque carte et chaque
 * fiche — FR, et EN statique via scripts/catalog/product-images.mjs — retombe
 * sur l'illustration, sans autre modification.
 *
 * Retrait complet : drapeau à `false`, puis
 *   python scripts/scraper/tw_product_images.py purge
 * (supprime public/images/products/ et vide src/data/product-images.ts).
 * Retrait d'une seule source : `… purge tennis-warehouse-europe`.
 */
export const PRODUCT_IMAGES_ENABLED = true;

export type ProductKind = 'racquet' | 'string';

/** Légende « Photo : … » de la fiche détail, par source. */
export const PRODUCT_IMAGE_CREDIT: Readonly<Record<ProductImageSource, string>> = {
  'tennis-warehouse': 'Tennis Warehouse',
  'tennis-warehouse-europe': 'Tennis Warehouse Europe',
};

const FOLDER: Record<ProductKind, string> = {
  racquet: '/images/products/racquets/',
  string: '/images/products/strings/',
};

/** Photo associée à un produit, ou `null` : drapeau coupé, ou produit sans photo validée. */
export function getProductImage(kind: ProductKind, id: string): ProductImageEntry | null {
  if (!PRODUCT_IMAGES_ENABLED) return null;
  const entry = PRODUCT_IMAGES[id];
  // Garde-fou : un id de cordage ne doit jamais récupérer une photo de raquette.
  if (!entry || !entry.file.startsWith(FOLDER[kind])) return null;
  return entry;
}
