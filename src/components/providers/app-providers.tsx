'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/lib/i18n';

/**
 * Providers légers nécessaires au thème (clair/sombre) et à la langue (FR/EN).
 * Volontairement isolé de SessionProvider/QueryProvider pour ne dépendre que
 * de ce qui est requis par le lifting UI.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="tennis-advisor-theme">
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
