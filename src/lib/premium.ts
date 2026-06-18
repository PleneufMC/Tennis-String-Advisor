/**
 * Logique « premium » centralisée.
 *
 * Le statut premium d'un compte est porté par deux champs en base :
 *   - `isPremium`     : drapeau d'activation.
 *   - `premiumUntil`  : date d'expiration (null = pas d'échéance / non premium).
 *
 * Un compte est considéré **premium ACTIF** lorsque `isPremium === true` ET
 * que l'abonnement n'est pas expiré. Si `premiumUntil` est défini, il doit être
 * dans le futur ; s'il est `null` alors que `isPremium === true`, on considère
 * le premium comme permanent (cas des comptes débloqués manuellement).
 *
 * Cette fonction est la **source de vérité unique** pour tout gating premium
 * (quota de configurations, futures fonctionnalités réservées, etc.).
 */
export interface PremiumStatusInput {
  isPremium?: boolean | null;
  premiumUntil?: Date | string | null;
}

export function isPremiumActive(user: PremiumStatusInput | null | undefined): boolean {
  if (!user || !user.isPremium) return false;

  // Premium permanent (pas de date d'expiration).
  if (user.premiumUntil === null || user.premiumUntil === undefined) return true;

  const until =
    user.premiumUntil instanceof Date
      ? user.premiumUntil
      : new Date(user.premiumUntil);

  if (Number.isNaN(until.getTime())) return false;
  return until.getTime() > Date.now();
}

/**
 * Quotas de configurations sauvegardées (journal de cordage).
 *
 * - Plan gratuit : 3 configurations maximum (aligné sur la page `/pricing`).
 * - Plan premium : illimité (plafonné par `PREMIUM_MAX_CONFIGS` anti-abus).
 */
export const FREE_PLAN_MAX_CONFIGS = 3;
export const PREMIUM_MAX_CONFIGS = 500;

/** Plafond de configurations applicable à un utilisateur selon son statut. */
export function maxConfigsFor(user: PremiumStatusInput | null | undefined): number {
  return isPremiumActive(user) ? PREMIUM_MAX_CONFIGS : FREE_PLAN_MAX_CONFIGS;
}
