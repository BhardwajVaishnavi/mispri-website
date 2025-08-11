import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return {
    title: `${category} - Bakery Shop`,
    description: `Browse our collection of ${params.slug} products.`,
  };
}

async function getProductsByCategory(categorySlug: string) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    console.log('Fetching products for category slug:', categorySlug);

    // Get products by category slug
    const response = await fetch(`${API_BASE_URL}/public/products?categoryId=${encodeURIComponent(categorySlug)}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch products for category:', categorySlug, response.status);
      return [];
    }

    const products = await response.json();
    console.log(`Found ${products.length} products for category:`, categorySlug);

    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products for category:', categorySlug, error);
    return [];
  }
}

async function getCategoryInfo(categorySlug: string) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    // Get category information
    const response = await fetch(`${API_BASE_URL}/public/categories`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch categories');
      return null;
    }

    const categories = await response.json();
    const category = categories.find((cat: any) => cat.slug === categorySlug);

    return category || null;
  } catch (error) {
    console.error('Error fetching category info:', error);
    return null;
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, categoryInfo] = await Promise.all([
    getProductsByCategory(params.slug),
    getCategoryInfo(params.slug)
  ]);

  // Use category info if available, otherwise format from slug
  const displayCategory = categoryInfo?.name || params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const categoryDescription = categoryInfo?.description || `Browse our ${displayCategory.toLowerCase()} collection`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{displayCategory}</h1>
        <p className="text-gray-600 mb-2">{categoryDescription}</p>
        <p className="text-sm text-gray-500">
          {products.length > 0
            ? `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`
            : 'No products found in this category'
          }
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              We don't have any products in the "{displayCategory}" category yet.
              Check back soon or browse our other categories.
            </p>
            <div className="space-y-3">
              <a
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Browse All Products
              </a>
              <div>
                <a
                  href="/"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  ← Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
