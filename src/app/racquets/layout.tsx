import type { Metadata } from 'next';
import { buildRouteMetadata } from '@/lib/seo/route-metadata';

// Layout server minimal : il n'ajoute aucun markup, il existe uniquement pour
// porter les métadonnées de la route (le `page.tsx` est 'use client' et ne
// peut donc pas exporter `metadata`). Cf. lib/seo/route-metadata.
export const metadata: Metadata = buildRouteMetadata({
  path: '/racquets',
  title: 'Catalogue des raquettes de tennis',
  description:
    "129 raquettes avec leurs caractéristiques : poids, tamis, rigidité RA, plan de cordage, équilibre. Filtrez par marque, niveau et style de jeu pour comparer.",
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
