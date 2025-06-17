'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, Share2, ShoppingCart, ArrowLeft } from 'lucide-react';
import WeightSelector from '@/components/WeightSelector';
import DeliveryLocationSelector from '@/components/DeliveryLocationSelector';
import { useCart } from '@/contexts/CartContext';

interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  costPrice: number;
  sku: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

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
  variants?: ProductVariant[];
}

interface DeliveryLocation {
  id: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
  deliveryFee: number;
  isActive: boolean;
}

export default function EnhancedProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from the enhanced API first, then fallback to regular API
      const apiUrls = [
        `/api/products-with-variants/${productId}`,
        `/api/products/${productId}`,
        `https://mispri24.vercel.app/api/public/products/${productId}`,
      ];

      let productData = null;
      for (const apiUrl of apiUrls) {
        try {
          const response = await fetch(apiUrl);
          if (response.ok) {
            productData = await response.json();
            break;
          }
        } catch (fetchError) {
          console.log('API failed:', apiUrl);
        }
      }

      if (!productData) {
        setError('Product not found');
        return;
      }

      setProduct(productData);

      // Set default variant if available
      if (productData.variants && productData.variants.length > 0) {
        const defaultVariant = productData.variants.find((v: ProductVariant) => v.isDefault) || productData.variants[0];
        setSelectedVariant(defaultVariant);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleWeightChange = (weightOption: any) => {
    const variant = product?.variants?.find(v => v.id === weightOption.id);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedVariant.price,
      image: product.productImages?.[0]?.url || product.imageUrl || '',
      variant: selectedVariant,
      quantity: quantity,
      weight: selectedVariant.weight,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const currentPrice = selectedVariant?.price || product?.price || 0;
  const galleryImages = product?.productImages && product.productImages.length > 0
    ? product.productImages
    : [{ url: product?.imageUrl || '/images/placeholder-product.jpg', isMain: true }];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5F9EA0]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#5F9EA0] text-white px-6 py-2 rounded-lg hover:bg-[#5F9EA0]/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const weightOptions = product.variants?.map(variant => ({
    id: variant.id,
    weight: variant.weight,
    price: variant.price,
    isDefault: variant.isDefault,
  })) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-[#5F9EA0] hover:underline">Home</Link>
            <span className="text-gray-500">›</span>
            <Link href="/products" className="text-[#5F9EA0] hover:underline">Products</Link>
            <span className="text-gray-500">›</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={galleryImages[0]?.url || '/images/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 2}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Eggless</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.8</span>
                </div>
                <span className="text-sm text-gray-600">324 Reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-b pb-6">
              <div className="text-3xl font-bold text-gray-900">₹{currentPrice}</div>
              <p className="text-sm text-gray-600 mt-1">Make this gift extra special</p>
            </div>

            {/* Weight Selection */}
            {weightOptions.length > 0 && (
              <WeightSelector
                weights={weightOptions}
                selectedWeight={selectedVariant?.id}
                onWeightChange={handleWeightChange}
              />
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-[#5F9EA0] text-white hover:bg-[#5F9EA0]/90'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5" />
                  Wishlist
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Delivery Location */}
            <DeliveryLocationSelector
              onLocationChange={setSelectedLocation}
            />

            {/* Product Information */}
            <div className="space-y-4 pt-6 border-t">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600">
                  {product.description || `Premium quality ${product.name} crafted with care and attention to detail. Perfect for special occasions and everyday enjoyment.`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="text-gray-600 ml-2">{selectedVariant?.sku || product.sku || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="text-gray-600 ml-2">{product.category}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Weight:</span>
                  <span className="text-gray-600 ml-2">{selectedVariant?.weight || product.unit}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Availability:</span>
                  <span className="text-green-600 ml-2 font-medium">In Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
