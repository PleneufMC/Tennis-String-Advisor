'use client';

import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/lib/i18n';

/**
 * Providers globaux : session (NextAuth), thème (clair/sombre) et langue (FR/EN).
 * SessionProvider est placé en racine pour que useSession() soit disponible
 * partout (header, pages compte, configurateur sauvegardé…).
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" storageKey="tennis-advisor-theme">
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
