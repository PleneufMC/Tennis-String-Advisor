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
  // Des caractéristiques seulement, aucune promesse de note : les notes /10 sont une appréciation de l'équipe
  // et se lisent dans le catalogue avec leur libellé, pas dans un extrait de recherche (10/10/2026).
  description: `${stringsDatabase.length} cordages comparés : polyester, multifilament, boyau naturel, hybrides. Type, rigidité (lb/in) et jauges de chaque référence ; recherche et filtres.`,
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
