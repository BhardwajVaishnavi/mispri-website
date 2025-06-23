'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductActions from '@/components/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery';
import SizeSelector from '@/components/SizeSelector';

interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  hasDiscount?: boolean;
  costPrice?: number;
  sku?: string;
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
  discountedPrice?: number;
  discountPercentage?: number;
  hasDiscount?: boolean;
  unit: string;
  sku?: string;
  imageUrl?: string;
  productImages?: Array<{ url: string; isMain?: boolean }>;
  variants?: ProductVariant[];
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);

  const productId = params.id as string;

  // Fallback category information when admin panel data is not available
  const getFallbackCategoryInfo = (category: string) => {
    const categoryLower = category.toLowerCase();

    // Check for cake-related categories
    if (categoryLower.includes('cake') || categoryLower.includes('dessert') || categoryLower.includes('sweet')) {
      return {
        productContains: [
          { label: 'Flavour', value: 'Chocolate Truffle' },
          { label: 'Shape', value: 'Round' },
          { label: 'Type', value: 'Cream Cake' },
          { label: 'Toppings', value: 'Dark Chocolate' },
          { label: 'Net Quantity', value: '1' },
          { label: 'Ingredients', value: 'Flour, Caster Sugar, Milk, Cocoa Powder, Baking Powder, Baking Soda, Oil, Chocolate, Fresh Cream' },
          { label: 'Allergens', value: 'Milk, Nuts, Wheat (Gluten)' }
        ],
        careInstructions: [
          'Cream cakes must be refrigerated.',
          'Fondant cakes should be kept in a cool, air-conditioned space—avoid the fridge.',
          'Bring the cake to room temperature before serving for best taste.',
          'Use a serrated knife for clean slices.',
          'Decorative elements may contain toothpicks or wires—remove before serving, especially to kids.',
          'Consume the cake within 24 hours for best freshness.',
          'Always keep the cake flat and away from direct heat.'
        ],
        badges: ['EGGLESS', 'FRESH', 'QUALITY', 'FSSAI'],
        showNameField: true,
        weightLabel: 'Weight'
      };
    }

    // Check for flower-related categories
    if (categoryLower.includes('flower') || categoryLower.includes('bouquet') || categoryLower.includes('rose') || categoryLower.includes('lily')) {
      return {
        productContains: [
          { label: 'Flower Type', value: 'Fresh Flowers' },
          { label: 'Color', value: 'Mixed Colors' },
          { label: 'Arrangement', value: 'Hand Bouquet' },
          { label: 'Stems Count', value: '12 Stems' },
          { label: 'Wrapping', value: 'Premium Paper' },
          { label: 'Includes', value: 'Flower Food Packet' }
        ],
        careInstructions: [
          'Cut stems at 45° angle under running water immediately upon arrival.',
          'Use clean vase with fresh, cool water.',
          'Add flower food if provided to extend life.',
          'Change water every 2-3 days.',
          'Remove wilted flowers to extend life of remaining blooms.',
          'Keep away from direct sunlight and heat sources.',
          'Maintain cool room temperature for maximum freshness.'
        ],
        badges: ['FRESH', 'PREMIUM', 'HAND-PICKED'],
        showNameField: false,
        weightLabel: 'Size'
      };
    }

    // Check for plant-related categories
    if (categoryLower.includes('plant') || categoryLower.includes('green') || categoryLower.includes('indoor') || categoryLower.includes('garden')) {
      return {
        productContains: [
          { label: 'Plant Type', value: 'Indoor Plant' },
          { label: 'Pot Material', value: 'Ceramic' },
          { label: 'Plant Height', value: '15-20 cm' },
          { label: 'Pot Size', value: '4 inch' },
          { label: 'Light Requirement', value: 'Bright Indirect Light' },
          { label: 'Watering', value: 'Moderate' },
          { label: 'Care Level', value: 'Easy' }
        ],
        careInstructions: [
          'Place in bright, indirect sunlight.',
          'Water when top inch of soil feels dry.',
          'Ensure pot has proper drainage holes.',
          'Fertilize monthly during growing season.',
          'Maintain temperature between 18-24°C.',
          'Rotate weekly for even growth.',
          'Keep away from air conditioning vents.',
          'Wipe leaves gently with damp cloth to remove dust.'
        ],
        badges: ['AIR-PURIFYING', 'LOW-MAINTENANCE', 'INDOOR'],
        showNameField: false,
        weightLabel: 'Size'
      };
    }

    // Check for gift-related categories
    if (categoryLower.includes('gift') || categoryLower.includes('present') || categoryLower.includes('hamper') || categoryLower.includes('combo')) {
      return {
        productContains: [
          { label: 'Material', value: 'Premium Quality' },
          { label: 'Dimensions', value: 'Standard Size' },
          { label: 'Weight', value: 'As per variant' },
          { label: 'Color', value: 'As shown' },
          { label: 'Packaging', value: 'Gift Wrapped' },
          { label: 'Includes', value: 'Gift Card' }
        ],
        careInstructions: [
          'Handle with care during unpacking.',
          'Store in cool, dry place.',
          'Keep away from moisture and humidity.',
          'Follow any specific instructions provided.',
          'Clean gently when needed.',
          'Avoid direct sunlight exposure.',
          'Store properly when not in use.'
        ],
        badges: ['PREMIUM', 'QUALITY', 'GIFT-READY'],
        showNameField: false,
        weightLabel: 'Size'
      };
    }

    // Default for any other category
    return {
      productContains: [
        { label: 'Product Type', value: category },
        { label: 'Quality', value: 'Premium' },
        { label: 'Unit', value: 'piece' },
        { label: 'Category', value: category },
        { label: 'Packaging', value: 'Standard' }
      ],
      careInstructions: [
        'Handle with care during unpacking.',
        'Store in cool, dry place.',
        'Keep away from moisture and humidity.',
        'Follow any specific instructions provided.',
        'Clean gently when needed.',
        'Avoid direct sunlight exposure.',
        'Store properly when not in use.'
      ],
      badges: ['PREMIUM', 'QUALITY', 'AUTHENTIC'],
      showNameField: false,
      weightLabel: 'Size'
    };
  };

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

      // Try to fetch from variants API first, then fallback to regular API
      const apiUrls = [
        `/api/products-with-variants/${productId}`, // Enhanced API with variants
        `https://mispri24.vercel.app/api/products-with-variants/${productId}`, // Admin variants API
        `/api/products/${productId}`, // Website API
        `https://mispri24.vercel.app/api/public/products/${productId}`, // Admin public API
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

      console.log('📦 Product data loaded:', {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        variantsCount: productData.variants?.length || 0,
        variants: productData.variants?.map((v: any) => ({
          id: v.id,
          weight: v.weight,
          price: v.price,
          isDefault: v.isDefault,
          isActive: v.isActive
        })) || []
      });

      setProduct(productData);

      // Set default variant if variants exist
      if (productData.variants && productData.variants.length > 0) {
        const defaultVariant = productData.variants.find((v: ProductVariant) => v.isDefault) || productData.variants[0];
        console.log('🎯 Setting default variant:', {
          id: defaultVariant.id,
          weight: defaultVariant.weight,
          price: defaultVariant.price,
          isDefault: defaultVariant.isDefault
        });
        setSelectedVariant(defaultVariant);
      } else {
        console.log('⚠️ No variants found, using product base price:', productData.price);
      }

      // Fetch category-specific information
      if (productData.category) {
        fetchCategoryInfo(productData.category);
        fetchRelatedProducts(productData.category, productData.id);
      }
    } catch (err) {
      console.error('ProductPage: Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryInfo = async (category: string) => {
    try {
      // Try to fetch from admin panel first, then fallback to default
      const apiUrls = [
        `https://mispri24.vercel.app/api/product-category-info?category=${encodeURIComponent(category)}`,
        `/api/product-category-info?category=${encodeURIComponent(category)}`
      ];

      let categoryData = null;
      for (const apiUrl of apiUrls) {
        try {
          const response = await fetch(apiUrl);
          if (response.ok) {
            categoryData = await response.json();
            break;
          }
        } catch (fetchError) {
          console.log('Category info API failed:', apiUrl);
        }
      }

      if (categoryData) {
        setCategoryInfo(categoryData);
      } else {
        // Use fallback category info
        setCategoryInfo(getFallbackCategoryInfo(category));
      }
    } catch (err) {
      console.error('Error fetching category info:', err);
      setCategoryInfo(getFallbackCategoryInfo(category));
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

  // Prepare size options from variants or use default
  const sizeOptions = product.variants && product.variants.length > 0
    ? product.variants
        .filter(variant => variant.isActive) // Only show active variants
        .sort((a, b) => a.sortOrder - b.sortOrder) // Sort by sortOrder
        .map(variant => ({
          id: variant.id,
          name: variant.weight.split(' ')[0], // Extract number part (e.g., "0.5" from "0.5 Kg")
          description: variant.weight, // Full weight description (e.g., "0.5 Kg")
          price: variant.price, // Use actual variant price
          priceModifier: 0 // Not needed since we're showing actual prices
        }))
    : [
        { id: 'small', name: 'Small', description: '500g', price: product.price || 595, priceModifier: 0 },
        { id: 'medium', name: 'Medium', description: '1kg', price: (product.price || 595) + 450, priceModifier: 450 },
        { id: 'large', name: 'Large', description: '1.5kg', price: (product.price || 595) + 950, priceModifier: 950 }
      ];

  console.log('🎛️ Size options prepared:', {
    hasVariants: !!(product.variants && product.variants.length > 0),
    variantsCount: product.variants?.length || 0,
    sizeOptionsCount: sizeOptions.length,
    sizeOptions: sizeOptions.map(opt => ({
      id: opt.id,
      description: opt.description,
      price: opt.price
    }))
  });

  // Get current price and discount based on selected variant
  const currentPrice = selectedVariant?.price || product.price;
  const currentDiscountedPrice = selectedVariant?.discountedPrice || product.discountedPrice;
  const currentDiscountPercentage = selectedVariant?.discountPercentage || product.discountPercentage;
  const currentHasDiscount = selectedVariant?.hasDiscount || product.hasDiscount;

  // Calculate original price if discounted price exists
  const originalPrice = currentDiscountedPrice && currentHasDiscount ? currentPrice : null;
  const displayPrice = currentDiscountedPrice && currentHasDiscount ? currentDiscountedPrice : currentPrice;



  // Use categoryInfo from state, fallback to default if not loaded
  const currentCategoryInfo = categoryInfo || getFallbackCategoryInfo(product.category);

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
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {currentCategoryInfo.badges.map((badge, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {badge}
                </span>
              ))}
            </div>

            {/* Header */}
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">4.9</span>
                </div>
                <span className="text-sm text-gray-600">124 Reviews</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3 space-y-2 sm:space-y-0">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{displayPrice.toFixed(0)}</span>
                {currentHasDiscount && originalPrice && currentDiscountPercentage && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-500 line-through">₹{originalPrice.toFixed(0)}</span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      {currentDiscountPercentage}% OFF
                    </span>
                  </div>
                )}
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

            {/* Weight/Size Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{currentCategoryInfo.weightLabel}</h3>
              <SizeSelector
                sizes={sizeOptions}
                selectedSize={selectedVariant?.id}
                onSizeChange={(size) => {
                  console.log('Size changed:', size);
                  // Find the corresponding variant
                  if (product.variants && product.variants.length > 0) {
                    const variant = product.variants.find(v => v.id === size.id);
                    if (variant) {
                      setSelectedVariant(variant);
                    }
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-2">Serving Info</p>
            </div>

            {/* Name on Product - Dynamic based on category */}
            {currentCategoryInfo.showNameField && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {product.category.toLowerCase().includes('cake') ? 'Name on Cake' : `Name on ${product.category}`}
                </h3>
                <input
                  type="text"
                  placeholder={`Enter name for ${product.category.toLowerCase()} (optional)`}
                  maxLength={25}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">0 / 25</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 lg:mb-4">Quantity & Add to Cart</h3>
                <ProductActions
                  product={{
                    id: product.id,
                    name: product.name,
                    price: displayPrice,
                    image: galleryImages[0]?.url || product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`,
                    unit: product.unit,
                    variant: selectedVariant
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

        {/* Product Contains Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Contains</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCategoryInfo.productContains.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-700">{item.label}:</span>
                <span className="text-sm text-gray-900">{item.value}</span>
              </div>
            ))}
            {/* Add SKU from product data */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm font-medium text-gray-700">SKU:</span>
              <span className="text-sm text-gray-900">{product.sku || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {product.description ||
              (product.category === 'Cakes' ?
                `This round cream cake is full of chocolate sponge and chocolate cream. It's perfect for every celebration like a birthday or anniversary, and everyone can enjoy it as it comes in an eggless only. This is one of the best selling cake and most loved product on our platform.` :
                product.category === 'Flowers' ?
                `Beautiful ${product.name} arrangement featuring fresh, vibrant blooms. Perfect for expressing your feelings and brightening any occasion with natural beauty and fragrance.` :
                product.category === 'Plants' ?
                `Healthy ${product.name} plant that brings natural beauty to your space. Easy to care for and perfect for home or office decoration with air-purifying qualities.` :
                `Premium quality ${product.name} crafted with care and attention to detail. Perfect for special occasions and everyday enjoyment.`)
            }
          </p>
        </div>

        {/* Care Instructions Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Care Instructions</h2>
          <ul className="space-y-2">
            {currentCategoryInfo.careInstructions.map((instruction, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span className="text-gray-700 text-sm">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SKU and Additional Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SKU Number</h3>
          <p className="text-gray-700 font-mono">{product.sku || 'N/A'}</p>

          <div className="flex items-center space-x-4 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Fresh</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Certified</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Note:</span> The icing, design of the cake may vary from the image depending upon local availability.
            </p>
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
