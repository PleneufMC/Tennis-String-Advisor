import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Suppression d'une configuration du journal de cordage.
 * Scopée par `userId` : impossible de supprimer la config d'un autre compte.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Identifiant manquant.' }, { status: 400 });
  }

  try {
    // deleteMany avec filtre userId : pas d'erreur si l'id n'appartient pas à
    // l'utilisateur (on renvoie simplement count=0), et aucune fuite d'info.
    const result = await prisma.configuration.deleteMany({
      where: { id, userId: session.user.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Configuration introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[configurations][DELETE]', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
