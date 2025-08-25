import { Metadata } from 'next';
import { Hero } from '@/components/sections/hero';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { HowItWorks } from '@/components/sections/how-it-works';
import { PremiumFeatures } from '@/components/sections/premium-features';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';

export const metadata: Metadata = {
  title: 'Tennis String Advisor - Expert Racquet & String Recommendations',
  description: 'Get personalized tennis racquet and string recommendations from our expert system. Compare specifications, read reviews, and find the perfect equipment for your playing style.',
  openGraph: {
    title: 'Tennis String Advisor - Expert Equipment Recommendations',
    description: 'Get personalized tennis racquet and string recommendations from our expert system.',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Tennis String Advisor Homepage',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Premium Features Section */}
      <PremiumFeatures />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <Newsletter />
    </main>
  );
}