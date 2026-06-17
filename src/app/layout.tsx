import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Header, Footer } from '@/components/layout';
import { AppProviders } from '@/components/providers/app-providers';
import { Analytics } from '@/components/analytics/analytics';
import './globals.css';

// ID de mesure GA4. Surchargé par NEXT_PUBLIC_GA_ID en prod ;
// fallback sur l'ID historique du site (cf. public/js/analytics.js).
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-YSSLHJ5WYD';

// URL canonique du site (production). Sert de base aux balises Open Graph /
// Twitter (og:image, twitter:image, etc.).
const CANONICAL_SITE_URL = 'https://tennisstringadvisor.org';

// Résout l'URL de base de manière robuste (cf. Audit #2.1).
// Bug historique : NEXT_PUBLIC_APP_URL="http://localhost:3000" (héritée de
// .env.example) était utilisée telle quelle en prod, produisant des
// og:image/twitter:image pointant vers localhost → previews de partage cassées.
// Règle : on n'utilise NEXT_PUBLIC_APP_URL que si elle est définie ET qu'elle
// ne pointe pas vers localhost / 127.0.0.1 ; sinon on retombe sur l'URL canonique.
function resolveSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(envUrl)) {
    return envUrl;
  }
  return CANONICAL_SITE_URL;
}

const SITE_URL = resolveSiteUrl();

// Script anti-flash : applique le thème (clair/sombre) avant le premier paint.
const themeInitScript = `(function(){try{var k='tennis-advisor-theme';var t=localStorage.getItem(k)||'system';var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=(t==='dark')||(t==='system'&&m);var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(d?'dark':'light');var l=localStorage.getItem('tennis-advisor-locale');if(l){r.lang=l;}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
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
  manifest: '/manifest.webmanifest',
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
        {/* Anti-flash thème : doit s'exécuter avant le rendu */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
      <body className="antialiased font-sans bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        {/* Google Analytics 4 — chargé après l'hydratation (perf), IP anonymisée (RGPD). */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
              `}
            </Script>
            <Analytics measurementId={GA_MEASUREMENT_ID} />
          </>
        )}

        <AppProviders>
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
        </AppProviders>
      </body>
    </html>
  );
}
