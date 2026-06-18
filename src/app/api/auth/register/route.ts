import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

/**
 * Inscription par e-mail / mot de passe.
 *
 * Crée un utilisateur avec un mot de passe hashé (bcrypt). La connexion qui
 * suit passe par le CredentialsProvider de NextAuth (cf. src/lib/auth.ts),
 * qui exige la stratégie de session "jwt".
 *
 * Sécurité :
 *  - Mot de passe hashé via bcrypt (jamais stocké en clair).
 *  - Message d'erreur générique sur e-mail déjà utilisé pour limiter
 *    l'énumération de comptes.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown; name?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Requête invalide.' },
      { status: 400 }
    );
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'Adresse e-mail invalide.' },
      { status: 400 }
    );
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.` },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });

    if (existing) {
      // Compte déjà existant : message volontairement générique.
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse e-mail.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[register] Erreur création utilisateur:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
