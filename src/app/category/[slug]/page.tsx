import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return {
    title: `${category} - Bakery Shop`,
    description: `Browse our collection of ${params.slug} products.`,
  };
}

async function getProductsByCategory(category: string) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    // Try to get products by category
    const response = await fetch(`${API_BASE_URL}/products?categoryId=${encodeURIComponent(category)}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch products for category:', category);
      return [];
    }

    const products = await response.json();

    // If no products found with exact match, try with capitalized first letter
    if (!Array.isArray(products) || products.length === 0) {
      const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      const retryResponse = await fetch(`${API_BASE_URL}/products?categoryId=${encodeURIComponent(capitalizedCategory)}`, {
        cache: 'no-store'
      });

      if (retryResponse.ok) {
        const retryProducts = await retryResponse.json();
        return Array.isArray(retryProducts) ? retryProducts : [];
      }
    }

    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products for category:', category, error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = await getProductsByCategory(params.slug);

  if (products.length === 0) {
    notFound();
  }

  const category = products[0]?.category || params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{category}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
