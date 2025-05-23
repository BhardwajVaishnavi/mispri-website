import { prisma } from '@/lib/db';
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
  // First try exact match
  let products = await prisma.product.findMany({
    where: {
      category: {
        equals: category,
        mode: 'insensitive',
      },
      isActive: true,
    },
    include: {
      productImages: {
        where: {
          isMain: true,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // If no products found, try with capitalized first letter
  if (products.length === 0) {
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    products = await prisma.product.findMany({
      where: {
        category: {
          equals: capitalizedCategory,
          mode: 'insensitive',
        },
        isActive: true,
      },
      include: {
        productImages: {
          where: {
            isMain: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  return products;
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = await getProductsByCategory(params.slug);
  
  if (products.length === 0) {
    notFound();
  }

  const category = products[0].category;

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
