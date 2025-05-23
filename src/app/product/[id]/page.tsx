import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductActions from '@/components/ProductActions';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Bakery Shop`,
    description: product.metaDescription || product.description || `Buy ${product.name} from Bakery Shop.`,
  };
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      productImages: true,
      relatedProducts: {
        include: {
          relatedProduct: {
            include: {
              productImages: {
                where: {
                  isMain: true,
                },
                take: 1,
              },
            },
          },
        },
        take: 4,
      },
    },
  });

  return product;
}

async function getRelatedProducts(category: string, excludeId: string) {
  const products = await prisma.product.findMany({
    where: {
      category,
      id: { not: excludeId },
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
    take: 4,
  });

  return products;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Get related products either from relatedProducts or by category
  let relatedProducts = product.relatedProducts.map(relation => relation.relatedProduct);

  if (relatedProducts.length === 0) {
    relatedProducts = await getRelatedProducts(product.category, product.id);
  }

  // Get main image
  const mainImage = product.productImages.find(img => img.isMain) ||
                    product.productImages[0] ||
                    { url: product.imageUrl || `https://picsum.photos/seed/${product.id}/800/600` };

  // Get additional images
  const additionalImages = product.productImages
    .filter(img => !img.isMain)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href={`/category/${product.category.toLowerCase()}`} className="text-primary-600 hover:underline">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="relative h-80 md:h-96 w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={mainImage.url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {additionalImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {additionalImages.map((image) => (
                <div key={image.id} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-primary-600 font-bold mb-4">₹{product.price.toFixed(2)}</p>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{product.description || `Beautiful ${product.name} for all occasions.`}</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Category:</span> {product.category}</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Unit:</span> {product.unit}</p>
            {product.sku && <p className="text-gray-600 mb-2"><span className="font-semibold">SKU:</span> {product.sku}</p>}
          </div>

          <ProductActions
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: mainImage.url
            }}
          />

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
            <p className="text-gray-600 mb-4">Free delivery for orders above ₹500. Standard delivery within 2-3 business days.</p>

            <h3 className="text-lg font-semibold mb-2">Return Policy</h3>
            <p className="text-gray-600">We accept returns within 7 days of delivery. Please contact our customer service for more details.</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
