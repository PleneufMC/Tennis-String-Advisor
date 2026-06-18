import { PrismaClient } from '@prisma/client';

/**
 * Client Prisma partagé (singleton).
 *
 * En développement, Next.js recharge les modules à chaque requête (HMR), ce qui
 * créerait une nouvelle connexion à chaque fois et épuiserait le pool Neon. On
 * met donc le client en cache sur l'objet global hors production.
 *
 * En production (serverless Netlify), chaque instance crée son propre client ;
 * Neon gère le pooling côté serveur (utiliser l'URL "-pooler" dans DATABASE_URL).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
