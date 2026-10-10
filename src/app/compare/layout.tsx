import type { Metadata } from 'next';
import { buildRouteMetadata } from '@/lib/seo/route-metadata';

// Layout server minimal : il n'ajoute aucun markup, il existe uniquement pour
// porter les métadonnées de la route (le `page.tsx` est 'use client' et ne
// peut donc pas exporter `metadata`). Cf. lib/seo/route-metadata.
// La description décrit ce que le comparateur affiche (décision de Pierre du
// 10/10/2026, PR #100) : les caractéristiques, et à part la moyenne des avis de
// testeurs /20 pour les raquettes évaluées. Aucune note de confort ou de
// contrôle n'y est promise.
export const metadata: Metadata = buildRouteMetadata({
  path: '/compare',
  title: 'Comparer les caractéristiques des raquettes et des cordages',
  description:
    "Comparez raquettes ou cordages côte à côte sur leurs caractéristiques (poids, tamis et rigidité RA pour les raquettes). La moyenne des avis de testeurs sur 20 est donnée à part pour les raquettes évaluées.",
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
