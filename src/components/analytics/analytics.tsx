'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface AnalyticsProps {
  measurementId?: string;
}

function AnalyticsInner({ measurementId }: AnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined' || !window.gtag) {
      return;
    }

    const url = pathname + (searchParams ? searchParams.toString() : '');
    
    // Track page view
    window.gtag('config', measurementId, {
      page_path: url,
    });
  }, [pathname, searchParams, measurementId]);

  // Analytics script is loaded in layout.tsx head
  return null;
}

export function Analytics({ measurementId }: AnalyticsProps) {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner measurementId={measurementId} />
    </Suspense>
  );
}

// Helper functions for tracking events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', 'engagement', searchTerm);
};

export const trackProductView = (productId: string, productName: string) => {
  trackEvent('view_item', 'ecommerce', productName, undefined);
};

export const trackAddToCart = (productId: string, productName: string, value: number) => {
  trackEvent('add_to_cart', 'ecommerce', productName, value);
};

export const trackPurchase = (transactionId: string, value: number) => {
  trackEvent('purchase', 'ecommerce', transactionId, value);
};

export const trackSignUp = (method: string) => {
  trackEvent('sign_up', 'engagement', method);
};

export const trackLogin = (method: string) => {
  trackEvent('login', 'engagement', method);
};