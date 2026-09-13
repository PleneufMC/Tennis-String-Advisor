import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { LIFETIME_SEATS, LIFETIME_USER_WHERE } from '@/lib/premium';

/**
 * Disponibilité de l'offre à vie.
 *
 * Sert uniquement à l'affichage : l'interface cesse de proposer l'offre quand
 * les places sont prises. La prévention réelle d'un 201ᵉ achat est la limite de
 * quantité du Payment Link, côté Stripe — voir `LIFETIME_SEATS`.
 *
 * Ne renvoie qu'un booléen. Le nombre exact de clients à vie est une métrique
 * commerciale : publiée sur une route anonyme, elle donnerait la courbe de
 * vente à qui l'échantillonne, et trahirait au passage les débloquages
 * manuels, qui partagent la même signature en base.
 *
 * Le résultat est mémorisé une minute : la route est publique et sans limite de
 * débit, or chaque appel ouvre un `count()` sur le pooler Supabase.
 *
 * En cas d'erreur de base, on répond « disponible » plutôt que de masquer une
 * offre valide : un incident de lecture ne doit pas fermer la vente.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DUREE_CACHE_MS = 60_000;
let cache: { valeur: boolean; expire: number } | null = null;

export async function GET() {
  if (cache && cache.expire > Date.now()) {
    return NextResponse.json({ available: cache.valeur });
  }

  try {
    const pris = await prisma.user.count({ where: LIFETIME_USER_WHERE });
    const disponible = pris < LIFETIME_SEATS;
    cache = { valeur: disponible, expire: Date.now() + DUREE_CACHE_MS };
    return NextResponse.json({ available: disponible });
  } catch (error) {
    console.error('[premium/lifetime-seats] lecture impossible :', {
      message: (error as Error).message,
    });
    // Pas de mise en cache d'un état dégradé : on retentera au prochain appel.
    return NextResponse.json({ available: true });
  }
}
