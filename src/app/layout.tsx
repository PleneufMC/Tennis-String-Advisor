import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@/components/analytics/analytics';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tennisstringadvisor.org'),
  title: {
    default: 'Tennis String Advisor - Expert Racquet & String Recommendations',
    template: '%s | Tennis String Advisor',
  },
  description: 'Get expert recommendations for tennis racquets and strings. Compare specs, read reviews, and find the perfect equipment for your playing style. Premium features available.',
  keywords: [
    'tennis strings',
    'tennis racquets',
    'racquet reviews',
    'string recommendations',
    'tennis equipment',
    'tennis gear advisor',
    'string tension',
    'racquet specs',
    'tennis comparison'
  ],
  authors: [{ name: 'Tennis String Advisor Team' }],
  creator: 'Tennis String Advisor',
  publisher: 'Tennis String Advisor',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Tennis String Advisor',
    title: 'Tennis String Advisor - Expert Racquet & String Recommendations',
    description: 'Get expert recommendations for tennis racquets and strings. Compare specs, read reviews, and find the perfect equipment for your playing style.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tennis String Advisor - Expert Equipment Recommendations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tennis String Advisor - Expert Racquet & String Recommendations',
    description: 'Get expert recommendations for tennis racquets and strings. Compare specs, read reviews, and find the perfect equipment.',
    images: ['/twitter-image.jpg'],
    creator: '@tennisstringadv',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'fr-FR': '/fr',
      'es-ES': '/es',
    },
  },
  category: 'sports',
  classification: 'Tennis Equipment & Reviews',
  other: {
    'application-name': 'Tennis String Advisor',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Tennis String Advisor',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Favicon and app icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="theme-color" content="#16a34a" />

        {/* Structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Tennis String Advisor',
              url: process.env.NEXT_PUBLIC_APP_URL,
              description: 'Expert recommendations for tennis racquets and strings',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Tennis String Advisor',
                url: process.env.NEXT_PUBLIC_APP_URL,
                logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1" id="main-content">
            {children}
          </div>
        </div>

        {/* Analytics - only in production */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <Analytics measurementId={process.env.NEXT_PUBLIC_GA_ID} />
        )}

        {/* Service Worker registration */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}