import type { Metadata, Viewport } from 'next';
import { Header, Footer } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tennisstringadvisor.org'),
  title: {
    default: 'Tennis String Advisor - Expert en Cordages et Raquettes de Tennis',
    template: '%s | Tennis String Advisor',
  },
  description:
    'Trouvez le cordage et la raquette de tennis parfaits pour votre style de jeu. Configurateur expert, comparateur, recommandations IA personnalisées et base de données complète.',
  keywords: [
    'tennis',
    'cordage tennis',
    'raquette tennis',
    'string advisor',
    'tennis string',
    'cordage polyester',
    'cordage multifilament',
    'boyau naturel',
    'tennis equipment',
    'tennis gear',
    'Babolat',
    'Wilson',
    'Head',
    'Yonex',
    'Luxilon',
  ],
  authors: [{ name: 'Tennis String Advisor Team' }],
  creator: 'Tennis String Advisor',
  publisher: 'Tennis String Advisor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: 'en_US',
    url: 'https://tennisstringadvisor.org',
    siteName: 'Tennis String Advisor',
    title: 'Tennis String Advisor - Expert en Cordages et Raquettes',
    description:
      'Trouvez le cordage et la raquette parfaits pour votre jeu. Configurateur expert et recommandations personnalisées.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tennis String Advisor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tennis String Advisor - Expert en Cordages',
    description: 'Trouvez le cordage parfait pour votre style de jeu.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#22c55e' },
    { media: '(prefers-color-scheme: dark)', color: '#166534' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Tennis String Advisor',
              url: 'https://tennisstringadvisor.org',
              description: 'Expert en cordages et raquettes de tennis',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://tennisstringadvisor.org/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased font-sans">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-green-700"
        >
          Aller au contenu principal
        </a>
        
        {/* Main application */}
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
