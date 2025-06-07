'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductActions from '@/components/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery';
import QuantitySelector from '@/components/QuantitySelector';
import SizeSelector from '@/components/SizeSelector';

interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  sku?: string;
  imageUrl?: string;
  productImages?: Array<{ url: string; isMain?: boolean }>;
}

export default function ClientProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const productId = params.id as string;

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Client Product Page: Fetching product with ID:', productId);
      const response = await fetch(`/api/products/${productId}`);
      console.log('Client Product Page: Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
        } else {
          setError(`Failed to load product: ${response.status}`);
        }
        return;
      }

      const productData = await response.json();
      console.log('Client Product Page: Product data:', productData);
      setProduct(productData);

      // Fetch related products
      if (productData.category) {
        fetchRelatedProducts(productData.category, productData.id);
      }
    } catch (err) {
      console.error('Client Product Page: Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string, excludeId: string) => {
    try {
      const response = await fetch(`/api/products?categoryId=${encodeURIComponent(category)}`);
      if (response.ok) {
        const products = await response.json();
        const filtered = Array.isArray(products)
          ? products.filter((p: Product) => p.id !== excludeId).slice(0, 4)
          : [];
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <p className="text-gray-600 mt-2">{error || 'The product you are looking for does not exist.'}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Go Back
            </button>
            <Link
              href="/"
              className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Prepare images for gallery
  const galleryImages = product.productImages && product.productImages.length > 0
    ? product.productImages
    : [{ url: product.imageUrl || `https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop`, isMain: true }];

  // Prepare size options
  const sizeOptions = [
    { id: 'small', name: 'Small', description: '500g', priceModifier: 0 },
    { id: 'medium', name: 'Medium', description: '1kg', priceModifier: 100 },
    { id: 'large', name: 'Large', description: '1.5kg', priceModifier: 200 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/category/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-primary-600">
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Interactive Image Gallery */}
          <ProductImageGallery
            images={galleryImages}
            productName={product.name}
          />

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8) 124 reviews</span>
                </div>
              </div>

              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">{product.name}</h1>

              <div className="flex items-baseline space-x-3">
                <span className="text-xl font-semibold text-gray-900">₹{product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">₹{(product.price * 1.2).toFixed(2)}</span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                  17% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description ||
                  (product.category === 'Cakes' ? `Delicious ${product.name} made with premium ingredients. Perfect for celebrations and special moments. Freshly baked to order with love and care.` :
                   product.category === 'Flowers' ? `Beautiful ${product.name} arrangement featuring fresh, vibrant blooms. Perfect for expressing your feelings and brightening any occasion.` :
                   product.category === 'Plants' ? `Healthy ${product.name} plant that brings natural beauty to your space. Easy to care for and perfect for home or office decoration.` :
                   `Premium quality ${product.name} crafted with care and attention to detail. Perfect for special occasions and everyday enjoyment.`)
                }
              </p>
            </div>

            {/* Size/Variant Options */}
            <SizeSelector
              sizes={sizeOptions}
              onSizeChange={(size) => console.log('Size changed:', size)}
            />

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <QuantitySelector
                unit={product.unit}
                onChange={(quantity) => console.log('Quantity changed:', quantity)}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <ProductActions
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: galleryImages[0]?.url || product.imageUrl || `https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop`
                }}
              />

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Add to Wishlist</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Product Details</h3>
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
                  <dt className="text-xs font-medium text-gray-900">Availability</dt>
                  <dd className="text-green-600 text-xs font-medium">In Stock</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h2 className="text-green-800 font-semibold">✅ Client-Side Product Page Working!</h2>
          <p className="text-green-700">Product loaded successfully using client-side rendering.</p>
        </div>
      </div>
    </div>
  );
}
