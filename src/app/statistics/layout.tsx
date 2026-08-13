import type { Metadata } from 'next';
import { buildRouteMetadata } from '@/lib/seo/route-metadata';

// Layout server minimal : il n'ajoute aucun markup, il existe uniquement pour
// porter les métadonnées de la route (le `page.tsx` est 'use client' et ne
// peut donc pas exporter `metadata`). Cf. lib/seo/route-metadata.
export const metadata: Metadata = buildRouteMetadata({
  path: '/statistics',
  title: 'Statistiques de votre matériel',
  description:
    "Analyse de vos configurations sauvegardées : RCS moyen, raquette et cordage les plus utilisés, évolution de vos setups au fil du temps.",
  hasEnglishEquivalent: false,
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
