'use client';

import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="tennis-advisor-theme"
    >
      <SessionProvider>
        <QueryProvider>
          {children}
          <ToastProvider />
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}