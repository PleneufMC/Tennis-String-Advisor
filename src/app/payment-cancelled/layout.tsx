import type { Metadata } from 'next';

// Page de retour après abandon de paiement : transactionnelle.
// `noindex` explicite : sans ce layout, ces routes hériteraient du canonical
// de la home défini dans le layout racine, ce qui déclarerait à Google
// qu'elles en sont des doublons. Elles n'ont aucune valeur de recherche.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function UtilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
