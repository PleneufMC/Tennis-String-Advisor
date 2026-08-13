import type { Metadata } from 'next';

/**
 * Fabrique de métadonnées par route (Phase 3 SEO, audit du 13/08/2026).
 *
 * PROBLÈME RÉSOLU
 * ---------------
 * Les 7 routes publiques de l'app sont toutes des composants `'use client'`,
 * ce qui interdit l'export d'un objet `metadata` depuis le `page.tsx`. Elles
 * héritaient donc TOUTES du `title.default` et de la `description` du layout
 * racine : sept pages, un seul titre, une seule description, aucun canonical.
 * C'était la faiblesse SEO la plus coûteuse du site.
 *
 * SOLUTION
 * --------
 * Chaque route reçoit un `layout.tsx` server (qui n'entoure rien, se contente
 * de rendre `children`) exportant un `metadata` construit ici. Le `page.tsx`
 * reste client et n'est pas touché.
 *
 * hreflang : la table d'équivalence FR↔EN vit déjà dans `lib/i18n/route-map`.
 * On la réutilise plutôt que d'en écrire une seconde, qui divergerait.
 */

import { getAlternateUrl } from '@/lib/i18n/route-map';

/**
 * URL canonique du site. Même garde que `layout.tsx` : une
 * `NEXT_PUBLIC_APP_URL` pointant sur localhost (valeur par défaut de
 * `.env.example`) ne doit jamais fuiter dans un canonical de production.
 */
const CANONICAL_SITE_URL = 'https://tennisstringadvisor.org';

export function resolveSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(envUrl)) {
    return envUrl.replace(/\/$/, '');
  }
  return CANONICAL_SITE_URL;
}

interface RouteSeoInput {
  /** Chemin de la route, sans slash final (sauf la racine). Ex. '/configurator'. */
  path: string;
  /** Titre de la page (le layout racine y ajoute « | Tennis String Advisor »). */
  title: string;
  /** Description — doit décrire CETTE page, pas le site en général. */
  description: string;
  /**
   * `false` si la route n'a pas de véritable équivalent anglais. On n'émet
   * alors aucun `alternates.languages` : un cluster hreflang où plusieurs
   * pages pointent vers la même cible est ignoré par Google (c'est le défaut
   * constaté sur 4 pages EN existantes).
   */
  hasEnglishEquivalent?: boolean;
}

export function buildRouteMetadata({
  path,
  title,
  description,
  hasEnglishEquivalent = true,
}: RouteSeoInput): Metadata {
  const siteUrl = resolveSiteUrl();
  const canonical = `${siteUrl}${path === '/' ? '' : path}`;

  const languages = hasEnglishEquivalent
    ? {
        'fr-FR': canonical,
        'en-US': `${siteUrl}${getAlternateUrl(path, 'en')}`,
      }
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: canonical,
      siteName: 'Tennis String Advisor',
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
