import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from '@/lib/db';

/**
 * Configuration centrale NextAuth.
 *
 * Providers activés conditionnellement selon les variables d'environnement
 * disponibles, pour que le build n'échoue jamais si une clé manque :
 *  - Google OAuth   : GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET
 *  - E-mail (magic) : EMAIL_SERVER_* + EMAIL_FROM
 *
 * Persistance : tables User/Account/Session/VerificationToken sur Neon
 * (Postgres) via l'adaptateur Prisma. Stratégie de session : "database".
 *
 * Variables requises en production (Netlify) :
 *  - DATABASE_URL          (Neon, URL -pooler recommandée)
 *  - NEXTAUTH_URL          (https://tennisstringadvisor.org)
 *  - NEXTAUTH_SECRET       (openssl rand -base64 32)
 *  - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (optionnel mais recommandé)
 *  - EMAIL_SERVER_HOST/PORT/USER/PASSWORD + EMAIL_FROM (optionnel)
 */

const providers: NextAuthOptions['providers'] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (
  process.env.EMAIL_SERVER_HOST &&
  process.env.EMAIL_SERVER_USER &&
  process.env.EMAIL_SERVER_PASSWORD
) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@tennisstringadvisor.org',
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async session({ session, user }) {
      // Stratégie "database" : `user` provient de la table User (Prisma).
      if (session.user && user) {
        session.user.id = user.id;
        // Champs métier (chantier abonnement) exposés à la session client.
        session.user.isPremium = (user as { isPremium?: boolean }).isPremium ?? false;
        session.user.premiumUntil =
          (user as { premiumUntil?: Date | null }).premiumUntil ?? null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Indique si au moins un provider d'authentification est configuré.
 * Sert à l'UI (page /auth/signin) pour afficher un message clair quand l'auth
 * n'est pas encore branchée côté variables d'environnement.
 */
export const isAuthConfigured = providers.length > 0;
