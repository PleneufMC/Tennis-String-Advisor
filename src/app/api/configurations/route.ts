import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Journal de cordage — configurations sauvegardées côté serveur (Supabase).
 *
 * Fonctionnalité réservée aux utilisateurs connectés : leurs configurations
 * sont persistées dans leur compte et synchronisées entre appareils
 * (contrairement au localStorage du configurateur, propre au navigateur).
 *
 * Toutes les opérations sont strictement scopées par `userId` (sécurité :
 * un utilisateur ne voit/supprime que ses propres configurations).
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_CONFIGS_PER_USER = 200;

// GET /api/configurations — liste les configurations de l'utilisateur connecté.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  try {
    const configurations = await prisma.configuration.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ configurations });
  } catch (error) {
    console.error('[configurations][GET]', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

// POST /api/configurations — crée une configuration pour l'utilisateur connecté.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  // Validation minimale des champs requis.
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const racquetId = typeof body.racquetId === 'string' ? body.racquetId : '';
  const mainStringId = typeof body.mainStringId === 'string' ? body.mainStringId : '';

  if (!name || !racquetId || !mainStringId) {
    return NextResponse.json(
      { error: 'Nom, raquette et cordage principal sont requis.' },
      { status: 400 }
    );
  }

  try {
    // Quota anti-abus par utilisateur.
    const count = await prisma.configuration.count({ where: { userId: session.user.id } });
    if (count >= MAX_CONFIGS_PER_USER) {
      return NextResponse.json(
        { error: `Limite de ${MAX_CONFIGS_PER_USER} configurations atteinte.` },
        { status: 409 }
      );
    }

    const num = (v: unknown, fallback = 0) =>
      typeof v === 'number' && Number.isFinite(v) ? v : fallback;
    const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);

    const configuration = await prisma.configuration.create({
      data: {
        userId: session.user.id,
        name,
        racquetId,
        mainStringId,
        crossStringId: typeof body.crossStringId === 'string' && body.crossStringId
          ? body.crossStringId
          : null,
        mainGauge: str(body.mainGauge, '1.25'),
        crossGauge: str(body.crossGauge, '1.25'),
        mainTension: num(body.mainTension, 24),
        crossTension: num(body.crossTension, 22),
        rating: Math.max(0, Math.min(5, Math.round(num(body.rating, 0)))),
        notes: typeof body.notes === 'string' ? body.notes : null,
        rcsScore: num(body.rcsScore, 0),
        compatibility: num(body.compatibility, 0),
      },
    });

    return NextResponse.json({ configuration }, { status: 201 });
  } catch (error) {
    console.error('[configurations][POST]', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
