import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isPremium?: boolean;
      premiumUntil?: Date | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    isPremium?: boolean;
    premiumUntil?: Date | null;
  }
}