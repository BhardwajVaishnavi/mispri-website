import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductActions from '@/components/ProductActions';

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const response = await fetch(`${API_BASE_URL}/products/${params.id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        title: 'Product Not Found',
      };
    }

    const product = await response.json();
    return {
      title: `${product.name} - Bakery Shop`,
      description: product.metaDescription || product.description || `Buy ${product.name} from Bakery Shop.`,
    };
  } catch (error) {
    return {
      title: 'Product Not Found',
    };
  }
}

async function getProduct(id: string) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(category: string, excludeId: string) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const response = await fetch(`${API_BASE_URL}/products?categoryId=${encodeURIComponent(category)}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return [];
    }

    const products = await response.json();
    return Array.isArray(products) ? products.filter((p: any) => p.id !== excludeId).slice(0, 4) : [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Get related products by category
  const relatedProducts = await getRelatedProducts(product.category, product.id);

  // Get main image
  const mainImage = product.productImages?.find((img: any) => img.isMain) ||
                    product.productImages?.[0] ||
                    { url: product.imageUrl || `https://picsum.photos/seed/${product.id}/800/600` };

  // Get additional images
  const additionalImages = product.productImages
    ?.filter((img: any) => !img.isMain)
    ?.slice(0, 3) || [];

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
