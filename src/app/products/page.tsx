import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const metadata = {
  title: 'All Products - Bakery Shop',
  description: 'Browse our complete collection of bakery products, flowers, and gifts.',
};

async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'}/public/categories`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      console.error('Failed to fetch categories');
      return [];
    }
    const categories = await response.json();
    return Array.isArray(categories) ? categories.map((c: any) => c.name || c.category || c) : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'}/public/products`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      console.error('Failed to fetch products');
      return [];
    }
    const products = await response.json();
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4 lg:w-1/5">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-primary-600 font-semibold">
                  All Products
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/category/${category.toLowerCase()}`}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:w-3/4 lg:w-4/5">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-8xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-4">No Products Available</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                There are currently no products in our catalog. Please check back later or contact us for more information.
              </p>
              <div className="text-sm text-gray-400">
                Admin: Add products in the admin panel to see them here.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
