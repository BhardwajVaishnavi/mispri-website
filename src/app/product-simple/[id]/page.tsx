import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

async function getProduct(id: string) {
  try {
    console.log('Simple Product Page: Fetching product with ID:', id);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const url = `${API_BASE_URL}/products/${id}`;
    console.log('Simple Product Page: API URL:', url);

    const response = await fetch(url, {
      cache: 'no-store'
    });

    console.log('Simple Product Page: Response status:', response.status);

    if (!response.ok) {
      console.log('Simple Product Page: Response not OK');
      return null;
    }

    const product = await response.json();
    console.log('Simple Product Page: Product data:', product);
    return product;
  } catch (error) {
    console.error('Simple Product Page: Error fetching product:', error);
    return null;
  }
}

export default async function SimpleProductPage({ params }: { params: { id: string } }) {
  console.log('Simple Product Page: Starting with params:', params);

  const product = await getProduct(params.id);

  if (!product) {
    console.log('Simple Product Page: Product not found, showing 404');
    notFound();
  }

  console.log('Simple Product Page: Rendering product:', product.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-yellow-800 font-semibold">Debug Info</h2>
          <p className="text-yellow-700">✅ Product loaded successfully</p>
          <p className="text-yellow-700">Product ID: {product.id}</p>
          <p className="text-yellow-700">Product Name: {product.name}</p>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary-600">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/debug-products" className="text-gray-500 hover:text-primary-600">Debug Products</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <span className="inline-block bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded mb-2">
                {product.category}
              </span>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-semibold text-primary-600">₹{product.price.toFixed(2)}</span>
                <span className="text-xs text-gray-500">per {product.unit}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-700">
                {product.description || `Beautiful ${product.name} perfect for all occasions.`}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Product Details</h3>
              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="text-xs font-medium text-gray-900">SKU</dt>
                  <dd className="text-gray-600">{product.sku || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-900">Category</dt>
                  <dd className="text-gray-600">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-900">Unit</dt>
                  <dd className="text-gray-600">{product.unit}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-900">Price</dt>
                  <dd className="text-gray-600">₹{product.price.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors">
                Add to Cart
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Raw Data Debug */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold mb-2">Raw Product Data</h2>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(product, null, 2)}
          </pre>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/debug-products"
            className="inline-block bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            ← Back to Products List
          </Link>
        </div>
      </div>
    </div>
  );
}
