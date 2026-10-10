import {
  PRODUCT_IMAGES,
  PRODUCT_IMAGE_CREDITS,
  type ProductImageEntry,
  type ProductImageSource,
} from '@/data/product-images';

/**
 * Photos produit (raquettes, cordages) — décision de Pierre du 29/09/2026.
 *
 * Les photos viennent de Tennis Warehouse et Tennis Warehouse Europe (dont les
 * conditions interdisent la reproduction sans permission écrite ; demande en
 * cours, photos conservées par décision de Pierre du 10/10/2026, en connaissance
 * du risque) et des sites officiels des fabricants (source `fabricant:<marque>`,
 * décision de Pierre du 10/10/2026 : « aucune restriction à utiliser les images
 * officielles », en connaissance du risque : leurs conditions interdisent aussi la
 * reproduction sans autorisation écrite). Tout le
 * dispositif passe donc par CE drapeau : à `false`, chaque carte et chaque
 * fiche — FR, et EN statique via scripts/catalog/product-images.mjs — retombe
 * sur l'illustration, sans autre modification.
 *
 * Retrait complet : drapeau à `false`, puis
 *   python scripts/scraper/tw_product_images.py purge
 * (supprime public/images/products/ et vide src/data/product-images.ts).
 * Retrait d'une seule source : `… purge tennis-warehouse-europe`, `… purge fabricant:wilson`.
 */
export const PRODUCT_IMAGES_ENABLED = true;

export type ProductKind = 'racquet' | 'string';

/**
 * Crédit « Photo : … » de la fiche détail, par source. La table est GÉNÉRÉE avec le manifeste
 * (src/data/product-images.ts) : une source sans libellé n'affiche aucune légende, et
 * `audit:ratings` (contrôle 12) échoue dans ce cas.
 */
export function productImageCredit(source: ProductImageSource): string {
  return PRODUCT_IMAGE_CREDITS[source] ?? '';
}

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
