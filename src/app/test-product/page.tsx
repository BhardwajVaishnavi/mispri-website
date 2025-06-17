'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TestProductPage() {
  const [productId, setProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the first product with variants to test
    const fetchTestProduct = async () => {
      try {
        const response = await fetch('https://mispri24.vercel.app/api/products-with-variants');
        if (response.ok) {
          const data = await response.json();
          if (data.products && data.products.length > 0) {
            setProductId(data.products[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching test product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestProduct();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5F9EA0]"></div>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Test Product Found</h1>
          <p className="text-gray-600 mb-6">Please run the seed script first to create test products.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#5F9EA0] text-white px-6 py-2 rounded-lg hover:bg-[#5F9EA0]/90 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Product Page Test</h1>
          <p className="text-gray-600 mb-6">
            This page demonstrates the new product page with weight-based pricing and delivery location selection.
          </p>
          
          <div className="space-y-4">
            <Link
              href={`/product-enhanced/${productId}`}
              className="inline-flex items-center gap-2 bg-[#5F9EA0] text-white px-6 py-3 rounded-lg hover:bg-[#5F9EA0]/90 transition-colors text-lg font-medium"
            >
              View Enhanced Product Page
            </Link>
            
            <div className="text-sm text-gray-500">
              <p>Product ID: {productId}</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Weight-Based Pricing</h3>
              <p className="text-gray-600 text-sm">
                Products now support multiple weight options with different prices. Customers can select from 0.5 Kg, 1 Kg, 1.5 Kg, and 2 Kg options.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Location Check</h3>
              <p className="text-gray-600 text-sm">
                Customers can enter their pincode to check if delivery is available to their location. Currently supports all Bhubaneswar pincodes.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Enhanced Cart</h3>
              <p className="text-gray-600 text-sm">
                Cart now handles product variants properly, allowing customers to add the same product with different weights as separate items.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Test Delivery Locations</h4>
            <p className="text-xs text-blue-700">
              Try these pincodes: 751001, 751006, 751007, 751010, 751021 (free delivery) or 751028, 751029 (₹50 delivery fee)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
