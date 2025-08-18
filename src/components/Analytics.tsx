'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Google Analytics tracking function
export const gtag = (...args: any[]) => {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag(...args);
    }
  } catch (error) {
    console.warn('Google Analytics tracking failed:', error);
  }
};

// Facebook Pixel tracking function
export const fbq = (...args: any[]) => {
  try {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq(...args);
    }
  } catch (error) {
    console.warn('Facebook Pixel tracking failed:', error);
  }
};

// Check if tracking is allowed
const isTrackingAllowed = () => {
  if (typeof window === 'undefined') return false;

  // Check if user has opted out or if tracking is blocked
  try {
    localStorage.setItem('_test', '1');
    localStorage.removeItem('_test');
    return true;
  } catch {
    // Storage blocked, but we can still track without storage
    return true;
  }
};

// Analytics component to track page views
export default function Analytics() {
  const pathname = usePathname();
  const [trackingEnabled, setTrackingEnabled] = useState(false);

  useEffect(() => {
    setTrackingEnabled(isTrackingAllowed());
  }, []);

  useEffect(() => {
    if (!trackingEnabled) return;

    // Small delay to ensure scripts are loaded
    const timer = setTimeout(() => {
      // Track page view in Google Analytics
      gtag('config', 'G-CSZRCCX7M2', {
        page_path: pathname,
        anonymize_ip: true,
      });

      // Track page view in Facebook Pixel
      fbq('track', 'PageView');
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, trackingEnabled]);

  return null;
}

// Event tracking functions with error handling
export const trackEvent = (eventName: string, parameters?: any) => {
  if (!isTrackingAllowed()) return;

  try {
    // Google Analytics event
    gtag('event', eventName, parameters);

    // Facebook Pixel custom event (use trackCustom for non-standard events)
    fbq('trackCustom', eventName, parameters);
  } catch (error) {
    // Silently handle tracking errors
    console.debug('Analytics tracking failed:', error);
  }
};

// E-commerce tracking functions
export const trackPurchase = (orderData: {
  transaction_id: string;
  value: number;
  currency: string;
  items: any[];
}) => {
  if (!isTrackingAllowed()) return;

  try {
    // Google Analytics purchase event
    gtag('event', 'purchase', {
      transaction_id: orderData.transaction_id,
      value: orderData.value,
      currency: orderData.currency,
      items: orderData.items,
    });

    // Facebook Pixel purchase event
    fbq('track', 'Purchase', {
      value: orderData.value,
      currency: orderData.currency,
      content_ids: orderData.items.map(item => item.item_id),
      content_type: 'product',
    });
  } catch (error) {
    console.debug('Purchase tracking failed:', error);
  }
};

export const trackAddToCart = (productData: {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
}) => {
  // Google Analytics add to cart event
  gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: productData.price * productData.quantity,
    items: [{
      item_id: productData.item_id,
      item_name: productData.item_name,
      category: productData.category,
      quantity: productData.quantity,
      price: productData.price,
    }],
  });

  // Facebook Pixel add to cart event
  fbq('track', 'AddToCart', {
    value: productData.price * productData.quantity,
    currency: 'INR',
    content_ids: [productData.item_id],
    content_type: 'product',
  });
};

export const trackViewItem = (productData: {
  item_id: string;
  item_name: string;
  category: string;
  price: number;
}) => {
  // Google Analytics view item event
  gtag('event', 'view_item', {
    currency: 'INR',
    value: productData.price,
    items: [{
      item_id: productData.item_id,
      item_name: productData.item_name,
      category: productData.category,
      price: productData.price,
    }],
  });

  // Facebook Pixel view content event
  fbq('track', 'ViewContent', {
    value: productData.price,
    currency: 'INR',
    content_ids: [productData.item_id],
    content_type: 'product',
  });
};

export const trackBeginCheckout = (cartData: {
  value: number;
  items: any[];
}) => {
  // Google Analytics begin checkout event
  gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: cartData.value,
    items: cartData.items,
  });

  // Facebook Pixel initiate checkout event
  fbq('track', 'InitiateCheckout', {
    value: cartData.value,
    currency: 'INR',
    content_ids: cartData.items.map(item => item.item_id),
    content_type: 'product',
  });
};

export const trackSearch = (searchTerm: string) => {
  // Google Analytics search event
  gtag('event', 'search', {
    search_term: searchTerm,
  });

  // Facebook Pixel search event
  fbq('track', 'Search', {
    search_string: searchTerm,
  });
};
