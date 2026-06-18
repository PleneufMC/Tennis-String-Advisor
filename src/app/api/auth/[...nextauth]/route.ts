import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Route handler NextAuth (App Router). Délègue toute la config à src/lib/auth.ts
// pour que `getServerSession(authOptions)` partage exactement les mêmes options.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// NextAuth a besoin du runtime Node (Prisma, nodemailer) — pas Edge.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
