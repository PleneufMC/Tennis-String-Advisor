/**
 * Infrastructure d'affiliation (Audit #3.0).
 *
 * Marchand principal : Tennis-Point FR (programme Awin, jusqu'à 9 %, cookie 30 j).
 *
 * Activation SANS redéploiement de code :
 *   - Tant que NEXT_PUBLIC_AWIN_ID n'est pas défini, les liens « Acheter »
 *     pointent en DIRECT (non tracké) vers Tennis-Point → fonctionnels et
 *     utiles dès maintenant, mais sans commission.
 *   - Dès que tu renseignes NEXT_PUBLIC_AWIN_ID (ton Publisher/Affiliate ID
 *     Awin) dans les variables d'env Netlify, les liens deviennent
 *     automatiquement des deep-links Awin trackés → rémunérateurs.
 *
 * Architecture multi-marchands : ajouter un marchand = ajouter une entrée dans
 * MERCHANTS (avec son awinmid). Aucun autre changement nécessaire.
 */

/** Identifiant Awin de l'éditeur (toi). Vide = affiliation désactivée. */
const AWIN_AFFILIATE_ID = (process.env.NEXT_PUBLIC_AWIN_ID || '').trim();

/** Endpoint de deep-linking Awin. */
const AWIN_DEEPLINK_BASE = 'https://www.awin1.com/cread.php';

export type MerchantKey = 'tennis-point';

export interface MerchantConfig {
  /** Clé interne stable (utilisée pour le tracking GA4). */
  key: MerchantKey;
  /** Nom affiché à l'utilisateur. */
  label: string;
  /** Domaine boutique (base des liens directs et de la recherche). */
  baseUrl: string;
  /**
   * Advertiser/Merchant ID Awin (awinmid) du marchand.
   * Surchargeable par variable d'env pour éviter tout redéploiement.
   * Laisser '' tant que l'advertiser n'est pas approuvé : on retombe alors
   * sur le lien direct non tracké.
   */
  awinMid: string;
}

/**
 * Catalogue des marchands. Pour l'instant : Tennis-Point FR uniquement.
 * Pour ajouter Tennis Pro / Decathlon plus tard : nouvelle entrée + awinmid.
 */
export const MERCHANTS: Record<MerchantKey, MerchantConfig> = {
  'tennis-point': {
    key: 'tennis-point',
    label: 'Tennis-Point',
    baseUrl: 'https://www.tennis-point.fr',
    // MID Awin de Tennis-Point FR à renseigner après approbation.
    awinMid: (process.env.NEXT_PUBLIC_AWIN_TENNISPOINT_MID || '').trim(),
  },
};

/** Marchand par défaut pour les boutons « Acheter ». */
export const DEFAULT_MERCHANT: MerchantKey = 'tennis-point';

/**
 * Vrai si l'affiliation Awin est pleinement opérationnelle pour ce marchand :
 * il faut à la fois l'ID éditeur (NEXT_PUBLIC_AWIN_ID) ET le MID du marchand.
 */
export function isAffiliateEnabled(merchant: MerchantKey = DEFAULT_MERCHANT): boolean {
  const cfg = MERCHANTS[merchant];
  return Boolean(AWIN_AFFILIATE_ID) && Boolean(cfg?.awinMid);
}

/**
 * Enrobe une URL marchande dans un deep-link Awin tracké si l'affiliation est
 * active ; sinon retourne l'URL directe inchangée.
 */
export function buildAwinDeepLink(targetUrl: string, merchant: MerchantKey = DEFAULT_MERCHANT): string {
  const cfg = MERCHANTS[merchant];
  if (!cfg) return targetUrl;

  if (!isAffiliateEnabled(merchant)) {
    return targetUrl;
  }

  const params = new URLSearchParams({
    awinmid: cfg.awinMid,
    awinaffid: AWIN_AFFILIATE_ID,
    ued: targetUrl,
  });
  return `${AWIN_DEEPLINK_BASE}?${params.toString()}`;
}

/**
 * Construit l'URL de recherche d'un produit (marque + modèle) sur la boutique
 * du marchand, puis l'enrobe (ou non) dans le deep-link Awin.
 *
 * On vise une page de RECHERCHE plutôt qu'une fiche produit précise : robuste
 * aux changements de catalogue et aux variantes (jauge, couleur, longueur).
 */
export function buildProductLink(
  brand: string,
  model: string,
  merchant: MerchantKey = DEFAULT_MERCHANT
): string {
  const cfg = MERCHANTS[merchant] ?? MERCHANTS[DEFAULT_MERCHANT];
  const query = [brand, model].filter(Boolean).join(' ').trim();
  // Tennis-Point : moteur de recherche sur /search?q=... (les espaces sont
  // encodés en « + » par URLSearchParams, format attendu par le site).
  const searchUrl = `${cfg.baseUrl}/search?${new URLSearchParams({ q: query }).toString()}`;
  return buildAwinDeepLink(searchUrl, merchant);
}

/** Libellé du marchand (pour l'UI). */
export function getMerchantLabel(merchant: MerchantKey = DEFAULT_MERCHANT): string {
  return MERCHANTS[merchant]?.label ?? 'la boutique';
}
