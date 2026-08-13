import type { Metadata } from 'next';
import { buildRouteMetadata } from '@/lib/seo/route-metadata';

// Layout server minimal : il n'ajoute aucun markup, il existe uniquement pour
// porter les métadonnées de la route (le `page.tsx` est 'use client' et ne
// peut donc pas exporter `metadata`). Cf. lib/seo/route-metadata.
export const metadata: Metadata = buildRouteMetadata({
  path: '/pricing',
  title: 'Offre Premium',
  description:
    "Configurations illimitées, analyse RCS avancée et export PDF de vos setups. Le configurateur et le calcul RCS restent gratuits et sans compte.",
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
