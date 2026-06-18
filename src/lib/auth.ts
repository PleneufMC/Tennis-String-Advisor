import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

/**
 * Configuration centrale NextAuth.
 *
 * Providers activés conditionnellement selon les variables d'environnement
 * disponibles, pour que le build n'échoue jamais si une clé manque :
 *  - Google OAuth        : GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET
 *  - E-mail (magic link) : EMAIL_SERVER_* + EMAIL_FROM
 *  - E-mail / mot de passe (Credentials) : toujours actif (table User.passwordHash)
 *
 * Persistance : tables User/Account/Session/VerificationToken sur Supabase
 * (Postgres) via l'adaptateur Prisma.
 *
 * Stratégie de session : "jwt" (OBLIGATOIRE car CredentialsProvider ne
 * supporte PAS la stratégie "database"). Les champs métier (id, isPremium,
 * premiumUntil) sont propagés via les callbacks jwt() puis session().
 *
 * Variables requises en production (Netlify) :
 *  - DATABASE_URL          (Supabase, session pooler port 5432, user postgres.<ref>)
 *  - NEXTAUTH_URL          (https://tennisstringadvisor.org)
 *  - NEXTAUTH_SECRET       (openssl rand -base64 32)
 *  - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (Google OAuth — actif)
 *  - EMAIL_SERVER_HOST/PORT/USER/PASSWORD + EMAIL_FROM (magic link — actif via Resend)
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

// Connexion e-mail / mot de passe classique (toujours active).
// Vérifie le hash bcrypt stocké sur User.passwordHash. Les comptes créés via
// Google ou magic link n'ont pas de passwordHash : on refuse alors la connexion
// par mot de passe (l'utilisateur doit passer par son provider d'origine).
providers.push(
  CredentialsProvider({
    id: 'credentials',
    name: 'E-mail et mot de passe',
    credentials: {
      email: { label: 'E-mail', type: 'email' },
      password: { label: 'Mot de passe', type: 'password' },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password;
      if (!email || !password) return null;

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          passwordHash: true,
          isPremium: true,
          premiumUntil: true,
        },
      });

      if (!user || !user.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        isPremium: user.isPremium,
        premiumUntil: user.premiumUntil,
      };
    },
  })
);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    // "jwt" requis par CredentialsProvider. Google et magic link fonctionnent
    // aussi en jwt (l'adaptateur Prisma persiste toujours User/Account).
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    // Stratégie "jwt" : le token est la source de vérité.
    // À la connexion (`user` présent), on initialise le token. Sinon, on
    // recharge les champs métier depuis la base pour rester à jour (premium).
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isPremium = (user as { isPremium?: boolean }).isPremium ?? false;
        token.premiumUntil =
          (user as { premiumUntil?: Date | null }).premiumUntil ?? null;
        return token;
      }

      // Rafraîchissement : recharge isPremium/premiumUntil depuis la DB.
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isPremium: true, premiumUntil: true },
        });
        if (dbUser) {
          token.isPremium = dbUser.isPremium;
          token.premiumUntil = dbUser.premiumUntil;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? '';
        session.user.isPremium = (token.isPremium as boolean) ?? false;
        session.user.premiumUntil =
          (token.premiumUntil as Date | null) ?? null;
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
