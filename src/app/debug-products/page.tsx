'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export default function DebugProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products from API...');
      const response = await fetch('/api/products');
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products data:', data);
      
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const testProductDetail = async (productId: string) => {
    try {
      console.log(`Testing product detail for ID: ${productId}`);
      const response = await fetch(`/api/products/${productId}`);
      console.log('Product detail response status:', response.status);
      
      if (response.ok) {
        const product = await response.json();
        console.log('Product detail data:', product);
        alert(`Product loaded successfully: ${product.name}`);
      } else {
        const error = await response.text();
        console.error('Product detail error:', error);
        alert(`Error loading product: ${response.status} - ${error}`);
      }
    } catch (err) {
      console.error('Error testing product detail:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Debug: Products API Test</h1>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Debug: Products API Test</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Debug: Products API Test</h1>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-blue-800 font-semibold mb-2">API Status</h2>
        <p className="text-blue-700">✅ Products API is working</p>
        <p className="text-blue-700">📦 Found {products.length} products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-3">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-xs text-gray-400 font-mono">ID: {product.id}</p>
            </div>
            
            <div className="space-y-2">
              <Link
                href={`/product/${product.id}`}
                className="block w-full bg-primary-600 text-white text-center py-2 rounded hover:bg-primary-700 transition-colors"
              >
                View Product Page
              </Link>
              
              <button
                onClick={() => testProductDetail(product.id)}
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Test API Call
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found. Make sure you have seeded the mock data.</p>
          <Link
            href="/"
            className="inline-block mt-4 bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
          >
            Go to Homepage
          </Link>
        </div>
      )}

      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h2 className="font-semibold mb-2">Debug Information</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• API Base URL: {process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'}</p>
          <p>• Current URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
          <p>• Products loaded: {products.length}</p>
          <p>• Check browser console for detailed logs</p>
        </div>
      </div>
    </div>
  );
}
