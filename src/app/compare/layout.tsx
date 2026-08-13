import type { Metadata } from 'next';
import { buildRouteMetadata } from '@/lib/seo/route-metadata';

// Layout server minimal : il n'ajoute aucun markup, il existe uniquement pour
// porter les métadonnées de la route (le `page.tsx` est 'use client' et ne
// peut donc pas exporter `metadata`). Cf. lib/seo/route-metadata.
export const metadata: Metadata = buildRouteMetadata({
  path: '/compare',
  title: 'Comparateur de raquettes et de cordages',
  description:
    "Comparez plusieurs raquettes ou cordages côte à côte sur leurs spécifications réelles : rigidité, poids, confort, contrôle. Repérez les écarts qui comptent.",
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
