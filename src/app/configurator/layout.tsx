import type { Metadata } from 'next';
import { buildRouteMetadata } from '@/lib/seo/route-metadata';

// Layout server minimal : il n'ajoute aucun markup, il existe uniquement pour
// porter les métadonnées de la route (le `page.tsx` est 'use client' et ne
// peut donc pas exporter `metadata`). Cf. lib/seo/route-metadata.
export const metadata: Metadata = buildRouteMetadata({
  path: '/configurator',
  title: 'Configurateur de cordage et tension',
  description:
    "Trouvez le cordage et la tension adaptés à votre raquette, votre jeu et votre sensibilité au bras. Le score RCS signale les setups trop fermes, à risque de tennis elbow.",
});

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
