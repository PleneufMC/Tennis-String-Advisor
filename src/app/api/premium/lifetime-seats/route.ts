import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { LIFETIME_SEATS, LIFETIME_USER_WHERE } from '@/lib/premium';

/**
 * Places restantes sur l'offre à vie.
 *
 * Sert uniquement à l'affichage : l'interface cesse de proposer l'offre quand
 * les places sont prises. La prévention réelle d'un 201ᵉ achat est la limite de
 * quantité du Payment Link, côté Stripe — voir `LIFETIME_SEATS`.
 *
 * En cas d'erreur de base, on répond « disponible » plutôt que de masquer une
 * offre valide : un incident de lecture ne doit pas fermer la vente.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const taken = await prisma.user.count({ where: LIFETIME_USER_WHERE });
    const remaining = Math.max(0, LIFETIME_SEATS - taken);
    return NextResponse.json({
      seats: LIFETIME_SEATS,
      taken,
      remaining,
      available: remaining > 0,
    });
  } catch (error) {
    console.error('[premium/lifetime-seats] lecture impossible :', error);
    return NextResponse.json({
      seats: LIFETIME_SEATS,
      taken: null,
      remaining: null,
      available: true,
    });
  }
}
