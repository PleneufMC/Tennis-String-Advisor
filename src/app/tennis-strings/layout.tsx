import type { Metadata } from 'next';
import { buildRouteMetadata } from '@/lib/seo/route-metadata';

// Layout server minimal : il n'ajoute aucun markup, il existe uniquement pour
// porter les métadonnées de la route (le `page.tsx` est 'use client' et ne
// peut donc pas exporter `metadata`). Cf. lib/seo/route-metadata.
export const metadata: Metadata = buildRouteMetadata({
  path: '/tennis-strings',
  title: 'Catalogue des cordages de tennis',
  description:
    "190 cordages comparés : polyester, multifilament, boyau naturel, hybrides. Rigidité, contrôle, confort, effet et durabilité pour chaque référence.",
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
