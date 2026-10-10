import type { Metadata } from 'next';
import { buildRouteMetadata } from '@/lib/seo/route-metadata';
import { racquetsDatabase } from '@/data/racquets-database';

// Layout server minimal : il n'ajoute aucun markup, il existe uniquement pour
// porter les métadonnées de la route (le `page.tsx` est 'use client' et ne
// peut donc pas exporter `metadata`). Cf. lib/seo/route-metadata.
// Le nombre de raquettes est lu dans le catalogue à chaque build, comme pour
// les cordages ; RA et équilibre manquent sur une partie des fiches.
export const metadata: Metadata = buildRouteMetadata({
  path: '/racquets',
  title: 'Catalogue des raquettes de tennis',
  description: `${racquetsDatabase.length} raquettes avec leurs caractéristiques : poids, tamis, plan de cordage, et rigidité RA ou équilibre lorsqu'ils sont renseignés. Filtrez par marque, niveau et style de jeu pour comparer.`,
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
