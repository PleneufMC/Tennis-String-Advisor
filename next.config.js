/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    domains: [
      'tennisstringadvisor.org',
      'tennis-warehouse.com',
      'www.tennis-warehouse.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'cloudinary.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://tennisstringadvisor.org' 
              : '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      // Cache static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/strings',
        destination: '/tennis-strings',
        permanent: true,
      },
      {
        source: '/rackets',
        destination: '/racquets',
        permanent: true,
      },
      // --- 301 : anciennes URL `.html` du site statique historique vers les
      // routes Next réelles. Filet de sécurité SEO : ces URL sont déjà
      // indexées (Bing/Google) et présentes dans des liens externes/sitemap.
      // On préserve l'autorité en redirigeant au lieu de servir des 404.
      // (cf. Audit v1.1 §1.1 / §1.2)
      // Liens de navigation de l'app vers des routes inexistantes (404 en
      // prod). On redirige vers la cible réelle pour ne plus exposer de 404
      // et préserver d'éventuels partages/indexations.
      { source: '/premium', destination: '/pricing', permanent: true },
      { source: '/guides', destination: '/blog/', permanent: true },
      { source: '/recommendations', destination: '/configurator', permanent: true },
      // --- 301 : anciennes URL `.html` ---
      { source: '/configurator.html', destination: '/configurator', permanent: true },
      { source: '/rcs-calculator.html', destination: '/configurator', permanent: true },
      { source: '/rcs.html', destination: '/configurator', permanent: true },
      { source: '/strings.html', destination: '/tennis-strings', permanent: true },
      { source: '/cordages.html', destination: '/tennis-strings', permanent: true },
      { source: '/racquets.html', destination: '/racquets', permanent: true },
      { source: '/raquettes.html', destination: '/racquets', permanent: true },
      { source: '/compare.html', destination: '/compare', permanent: true },
      { source: '/comparateur.html', destination: '/compare', permanent: true },
      { source: '/setups.html', destination: '/configurator', permanent: true },
      { source: '/premium.html', destination: '/pricing', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      // Auth/compte désactivés (cf. Audit §3.2) -> home en attendant réactivation.
      { source: '/auth.html', destination: '/', permanent: true },
      { source: '/account.html', destination: '/', permanent: true },
      { source: '/journal-cordage.html', destination: '/', permanent: true },
      // Pages légales non encore implémentées -> home (à remplacer par de
      // vraies pages /cgu, /confidentialite quand elles existeront).
      { source: '/cgu.html', destination: '/', permanent: true },
      { source: '/confidentialite.html', destination: '/', permanent: true },
      { source: '/privacy.html', destination: '/', permanent: true },
      { source: '/faq.html', destination: '/', permanent: true },
      // Pages de test résiduelles (cf. Audit §4.5) -> home, pour ne plus les exposer.
      { source: '/configurator-fixed.html', destination: '/configurator', permanent: true },
      { source: '/configurator-radio.html', destination: '/configurator', permanent: true },
      // Redirect old Expo routes if any
      {
        source: '/expo-router/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },

  // NB : plus aucun rewrite vers /api/sitemap ni /api/robots.
  // Ces routes API n'existaient pas -> /sitemap.xml et /robots.txt étaient
  // cassés (cf. Audit v1.1 §1.2). Désormais :
  //  - /sitemap.xml est généré nativement par `src/app/sitemap.ts`
  //  - /robots.txt est servi par le fichier statique `public/robots.txt`

  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Output configuration
  output: 'standalone',
  
  // Environment variables available to client
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };

    // Ignore unused dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      dns: false,
      child_process: false,
      tls: false,
    };

    // Add bundle analysis in development
    if (dev && !isServer) {
      config.devtool = 'cheap-module-source-map';
    }

    return config;
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // PoweredByHeader removal for security
  poweredByHeader: false,

  // Compression
  compress: true,

  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
};

module.exports = withBundleAnalyzer(nextConfig);