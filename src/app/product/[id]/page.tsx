'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductActions from '@/components/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery';

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

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      console.log('ProductPage: Fetching product with ID:', productId);
      console.log('ProductPage: Current URL:', window.location.href);

      // Try multiple API endpoints
      const apiUrls = [
        `/api/products/${productId}`, // Website API
        `https://mispri24.vercel.app/api/public/products/${productId}`, // Admin public API
        `https://mispri24.vercel.app/api/products/${productId}` // Admin direct API
      ];

      let productData = null;
      let lastError = null;

      for (const apiUrl of apiUrls) {
        try {
          console.log('ProductPage: Trying API:', apiUrl);
          const response = await fetch(apiUrl);
          console.log('ProductPage: Response status:', response.status);

          if (response.ok) {
            productData = await response.json();
            console.log('ProductPage: Product loaded successfully from:', apiUrl);
            break;
          } else {
            const errorText = await response.text();
            lastError = `${response.status} - ${errorText}`;
            console.log('ProductPage: API failed:', apiUrl, lastError);
          }
        } catch (fetchError) {
          lastError = fetchError instanceof Error ? fetchError.message : 'Network error';
          console.log('ProductPage: Network error for:', apiUrl, lastError);
        }
      }

      if (!productData) {
        console.error('ProductPage: All APIs failed. Last error:', lastError);
        setError(`Product not found (ID: ${productId}). Error: ${lastError}`);
        return;
      }

      setProduct(productData);

      // Fetch related products
      if (productData.category) {
        fetchRelatedProducts(productData.category, productData.id);
      }
    } catch (err) {
      console.error('ProductPage: Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string, excludeId: string) => {
    try {
      // Use the website's own API endpoint which forwards to admin panel
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-x-auto">
            <Link href="/" className="text-gray-500 hover:text-primary-600 whitespace-nowrap">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/category/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-primary-600 whitespace-nowrap">
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {/* Interactive Image Gallery */}
          <div className="order-1">
            <ProductImageGallery
              images={galleryImages}
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="order-2 space-y-4 lg:space-y-6">
            {/* Header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
                <span className="text-sm text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded mb-2 sm:mb-0 w-fit">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">(4.8) 124 reviews</span>
                </div>
              </div>

              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 leading-tight">{product.name}</h1>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3 space-y-2 sm:space-y-0">
                <span className="text-xl sm:text-2xl font-semibold text-gray-900">₹{product.price.toFixed(2)}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 line-through">₹{(product.price * 1.2).toFixed(2)}</span>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                    17% OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {product.description ||
                  (product.category === 'Cakes' ? `Delicious ${product.name} made with premium ingredients. Perfect for celebrations and special moments. Freshly baked to order with love and care.` :
                   product.category === 'Flowers' ? `Beautiful ${product.name} arrangement featuring fresh, vibrant blooms. Perfect for expressing your feelings and brightening any occasion.` :
                   product.category === 'Plants' ? `Healthy ${product.name} plant that brings natural beauty to your space. Easy to care for and perfect for home or office decoration.` :
                   product.category === 'Birthday' ? `Special ${product.name} designed to make birthdays memorable. Crafted with attention to detail for your loved one's special day.` :
                   product.category === 'Anniversary' ? `Romantic ${product.name} perfect for celebrating your special moments together. Created to express your love and appreciation.` :
                   product.category === 'Gifts' ? `Thoughtful ${product.name} that makes the perfect gift for any occasion. Beautifully presented and sure to bring joy.` :
                   `Premium quality ${product.name} crafted with care and attention to detail. Perfect for special occasions and everyday enjoyment.`)
                }
              </p>
            </div>

            {/* Size/Variant Options */}
            <SizeSelector
              sizes={sizeOptions}
              onSizeChange={(size) => console.log('Size changed:', size)}
            />

            {/* Action Buttons */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 lg:mb-4">Quantity & Add to Cart</h3>
                <ProductActions
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: galleryImages[0]?.url || product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`,
                    unit: product.unit
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="hidden sm:inline">Add to Wishlist</span>
                  <span className="sm:hidden">Wishlist</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Product Information Section - Full Width */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 lg:mb-16">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 lg:mb-4">Product Information</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about this product
            </p>
          </div>

          {/* Information Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Description */}
            <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Description</h4>
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p className="mb-4">
                  {product.description ||
                    (product.category === 'Cakes' ? `Freshly baked ${product.name} using premium ingredients. Made to order for maximum freshness and quality.` :
                     product.category === 'Flowers' ? `Beautiful ${product.name} arrangement with hand-selected fresh blooms sourced from finest growers.` :
                     product.category === 'Plants' ? `Healthy ${product.name} plant grown in optimal conditions with proper care instructions.` :
                     `Premium quality ${product.name} crafted with care and attention to detail.`)
                  }
                </p>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center text-xs sm:text-sm">
                    <span className="font-medium text-gray-900">SKU:</span>
                    <span className="ml-2 text-gray-600">{product.sku || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="ml-2 bg-primary-100 text-primary-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    <span className="font-medium text-gray-900">Unit:</span>
                    <span className="ml-2 text-gray-600">{product.unit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-yellow-50 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Reviews</h4>
              <div className="text-xs sm:text-sm text-gray-700">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm sm:text-lg font-semibold text-gray-900">4.8</span>
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">(124 reviews)</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="border-l-4 border-green-200 pl-2 sm:pl-3">
                    <p className="text-xs sm:text-sm font-medium">"Excellent quality and fresh delivery!"</p>
                    <p className="text-xs text-gray-500 mt-1">- Priya S.</p>
                  </div>
                  <div className="border-l-4 border-blue-200 pl-2 sm:pl-3">
                    <p className="text-xs sm:text-sm font-medium">"Perfect for our anniversary celebration."</p>
                    <p className="text-xs text-gray-500 mt-1">- Raj M.</p>
                  </div>
                  <div className="border-l-4 border-purple-200 pl-2 sm:pl-3">
                    <p className="text-xs sm:text-sm font-medium">"Beautiful presentation and taste!"</p>
                    <p className="text-xs text-gray-500 mt-1">- Anita K.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Delivery Info</h4>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-xs sm:text-sm">Free Delivery</div>
                    <div className="text-gray-600 text-xs">Within Bhubaneswar</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-xs sm:text-sm">Same Day Delivery</div>
                    <div className="text-gray-600 text-xs">Order before 2 PM</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-xs sm:text-sm">Quality Guarantee</div>
                    <div className="text-gray-600 text-xs">100% Fresh</div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 p-2 sm:p-3 bg-white rounded-lg">
                  <span className="font-semibold">Special Handling:</span> {
                    product.category === 'Cakes' ? 'Temperature controlled delivery to maintain freshness' :
                    product.category === 'Flowers' ? 'Fresh and hydrated packaging for maximum bloom life' :
                    'Secure and safe packaging with care instructions'
                  }
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Care Instructions</h4>
              <div className="text-xs sm:text-sm text-gray-700">
                {product.category === 'Cakes' ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">Storage:</p>
                      <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                        <li>Keep refrigerated at 2-4°C</li>
                        <li>Consume within 2-3 days</li>
                        <li>Bring to room temperature before serving</li>
                        <li>Store in original packaging</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">Serving:</p>
                      <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                        <li>Use clean knife for cutting</li>
                        <li>Serve at room temperature for best taste</li>
                        <li>Cut into portions as needed</li>
                      </ul>
                    </div>
                  </div>
                ) : product.category === 'Flowers' ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">Freshness Tips:</p>
                      <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                        <li>Cut stems at 45° angle under running water</li>
                        <li>Use clean vase with fresh, cool water</li>
                        <li>Add flower food if provided</li>
                        <li>Change water every 2-3 days</li>
                        <li>Remove wilted flowers to extend life</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">Placement:</p>
                      <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                        <li>Keep away from direct sunlight</li>
                        <li>Avoid heat sources and drafts</li>
                        <li>Maintain cool room temperature</li>
                      </ul>
                    </div>
                  </div>
                ) : product.category === 'Plants' ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">Plant Care:</p>
                      <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                        <li>Place in bright, indirect sunlight</li>
                        <li>Water when top inch of soil feels dry</li>
                        <li>Ensure pot has proper drainage holes</li>
                        <li>Fertilize monthly during growing season</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">Environment:</p>
                      <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                        <li>Maintain temperature between 18-24°C</li>
                        <li>Rotate weekly for even growth</li>
                        <li>Keep away from air conditioning vents</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">General Care:</p>
                      <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                        <li>Handle with care during unpacking</li>
                        <li>Store in cool, dry place</li>
                        <li>Keep away from moisture and humidity</li>
                        <li>Follow any specific instructions provided</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">Maintenance:</p>
                      <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                        <li>Clean gently when needed</li>
                        <li>Avoid direct sunlight exposure</li>
                        <li>Store properly when not in use</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8 lg:mb-16">
            <div className="text-center mb-6 lg:mb-12">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 lg:mb-4">You Might Also Like</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Discover more delicious options from our {product.category.toLowerCase()} collection
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
