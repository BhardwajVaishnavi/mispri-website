'use client';

import { trackEvent, trackAddToCart, trackViewItem, trackBeginCheckout, trackPurchase, trackSearch } from '@/components/Analytics';

export default function TestAnalyticsPage() {
  const testEvents = () => {
    // Test custom event
    trackEvent('test_event', {
      event_category: 'test',
      event_label: 'analytics_test',
      value: 1
    });

    // Test product view
    trackViewItem({
      item_id: 'test-product-123',
      item_name: 'Test Chocolate Cake',
      category: 'Cakes',
      price: 599
    });

    // Test add to cart
    trackAddToCart({
      item_id: 'test-product-123',
      item_name: 'Test Chocolate Cake',
      category: 'Cakes',
      quantity: 1,
      price: 599
    });

    // Test begin checkout
    trackBeginCheckout({
      value: 599,
      items: [{
        item_id: 'test-product-123',
        item_name: 'Test Chocolate Cake',
        category: 'Cakes',
        quantity: 1,
        price: 599
      }]
    });

    // Test purchase
    trackPurchase({
      transaction_id: 'TEST-ORDER-123',
      value: 599,
      currency: 'INR',
      items: [{
        item_id: 'test-product-123',
        item_name: 'Test Chocolate Cake',
        category: 'Cakes',
        quantity: 1,
        price: 599
      }]
    });

    // Test search
    trackSearch('chocolate cake');

    alert('Analytics events sent! Check your browser console and analytics dashboards.');
  };

  return (
    <div className="min-h-screen bg-dark-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8 text-primary-100">Analytics Test Page</h1>
          
          <div className="bg-dark-700 rounded-lg p-8 border border-primary-200/20">
            <h2 className="text-xl font-semibold mb-6 text-primary-100">Test Analytics Integration</h2>
            
            <div className="space-y-4 text-primary-200 mb-8">
              <p><strong className="text-primary-100">Google Analytics ID:</strong> G-CSZRCCX7M2</p>
              <p><strong className="text-primary-100">Facebook Pixel ID:</strong> 1077453346222580</p>
            </div>
            
            <button
              onClick={testEvents}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Send Test Events
            </button>
            
            <div className="mt-8 text-sm text-primary-300">
              <p className="mb-4">This will send the following test events:</p>
              <ul className="text-left space-y-2">
                <li>• Custom Event</li>
                <li>• Product View</li>
                <li>• Add to Cart</li>
                <li>• Begin Checkout</li>
                <li>• Purchase</li>
                <li>• Search</li>
              </ul>
            </div>
            
            <div className="mt-8 p-4 bg-primary-900/20 rounded-lg">
              <p className="text-sm text-primary-300">
                <strong className="text-primary-100">Note:</strong> Check your browser's developer console (F12)
                and your Google Analytics/Facebook Analytics dashboards to verify the events are being sent.
              </p>
            </div>

            <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/30">
              <p className="text-sm text-yellow-200">
                <strong className="text-yellow-100">Privacy Notice:</strong> If you see "Tracking Prevention" warnings
                in the console, this is normal browser privacy protection. Analytics still work but some storage
                features may be limited. This protects user privacy and is expected behavior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
