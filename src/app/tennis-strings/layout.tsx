import type { Metadata } from 'next';
import { buildRouteMetadata } from '@/lib/seo/route-metadata';
import { stringsDatabase } from '@/data/strings-database';

// Layout server minimal : il n'ajoute aucun markup, il existe uniquement pour
// porter les métadonnées de la route (le `page.tsx` est 'use client' et ne
// peut donc pas exporter `metadata`). Cf. lib/seo/route-metadata.
// Le nombre de cordages est lu dans le catalogue à chaque build : un nombre
// écrit en dur avait vieilli (« 190 » pour 181).
export const metadata: Metadata = buildRouteMetadata({
  path: '/tennis-strings',
  title: 'Catalogue des cordages de tennis',
  description: `${stringsDatabase.length} cordages comparés : polyester, multifilament, boyau naturel, hybrides. La rigidité de chaque référence ; contrôle, confort, effet et durabilité quand la note existe.`,
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
