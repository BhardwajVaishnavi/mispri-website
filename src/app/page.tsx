import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiClock, FiGift, FiHeart, FiStar } from 'react-icons/fi';
import SimpleCarousel from '@/components/SimpleCarousel';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import CategoryCarousel from '@/components/CategoryCarousel';
import MobileCategorySection from '@/components/MobileCategorySection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

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
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'}/public/products`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      console.error('Failed to fetch products');
      return [];
    }
    const products = await response.json();
    return Array.isArray(products) ? products.slice(0, 8) : [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}



async function getBestSellingProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'}/public/products`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      console.error('Failed to fetch products');
      return [];
    }
    const products = await response.json();
    // Sort by price descending to simulate best selling
    const sortedProducts = Array.isArray(products) ? products.sort((a: any, b: any) => b.price - a.price) : [];
    return sortedProducts.slice(0, 4);
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();
  const bestSellingProducts = await getBestSellingProducts();

  // Banner data
  const banners = [
    {
      id: 1,
      title: "Celebrate Special Moments",
      subtitle: "Exclusive Gifts for Your Loved Ones",
      description: "Find the perfect gift for every occasion. Same day delivery available in Bhubaneswar.",
      buttonText: "Shop Now",
      buttonLink: "/products",
      image: "https://mispri-pi.vercel.app/1st.jpg",
    },
    {
      id: 2,
      title: "Fresh Flowers Collection",
      subtitle: "Handcrafted Bouquets",
      description: "Express your feelings with our beautiful flower arrangements.",
      buttonText: "Explore",
      buttonLink: "/category/flowers",
      image: "https://mispri-pi.vercel.app/2nd.avif",
    },
    {
      id: 3,
      title: "Delicious Cakes",
      subtitle: "Freshly Baked Delights",
      description: "Celebrate with our premium cakes made with the finest ingredients.",
      buttonText: "Order Now",
      buttonLink: "/category/cakes",
      image: "https://mispri-pi.vercel.app/3rd.avif",
    },
    {
      id: 4,
      title: "Gift Combos",
      subtitle: "Perfect Combinations",
      description: "Make your gift extra special with our thoughtfully curated combos.",
      buttonText: "View Combos",
      buttonLink: "/category/combos",
      image: "https://mispri-pi.vercel.app/4th.jpg",
    },
  ];

  // Occasion categories
  const occasions = [
    { name: "Birthday", image: "/images/cakes/birthday_cake.jpg", slug: "birthday" },
    { name: "Anniversary", image: "/images/cakes/white_cake.jpg", slug: "anniversary" },
    { name: "Wedding", image: "/images/flowers/flower_basket.jpg", slug: "wedding" },
    { name: "Congratulations", image: "/images/flowers/rose_bouquet.jpg", slug: "congratulations" },
  ];

  return (
    <div className="bg-dark-800">
      {/* Hero Banner Carousel */}
      <section className="relative px-2 sm:px-4 md:px-6 py-2 sm:py-4 max-w-7xl mx-auto">
        <SimpleCarousel banners={banners} />
      </section>

      {/* Mobile Category Sections */}
      <MobileCategorySection categories={categories} />

      {/* Mobile Bestselling Products */}
      <section className="sm:hidden py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary-100">Bestselling Products</h2>
            <Link href="/products" className="text-primary-400 text-sm">View All</Link>
          </div>

          {bestSellingProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {bestSellingProducts.slice(0, 4).map((product, index) => {
                const imageUrl = product.productImages && product.productImages.length > 0
                  ? product.productImages.find((img: any) => img.isMain)?.url || product.productImages[0].url
                  : product.imageUrl;

                return (
                  <div key={product.id} className="bg-dark-700 rounded-lg overflow-hidden shadow-sm border border-primary-200/20">
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-square">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-4xl">📦</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-primary-100 text-sm">{product.name}</h3>
                        <p className="text-sm font-bold text-primary-300 mt-1">₹{product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-primary-400 text-4xl mb-2">📦</div>
              <p className="text-primary-300 text-sm">No products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-dark-700 py-4 shadow-sm border-y border-primary-200/20">
        <div className="container mx-auto px-4">
          {/* Desktop Features */}
          <div className="hidden sm:flex flex-wrap justify-between">
            <div className="flex items-center py-2 w-auto">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiClock className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-primary-100">Same Day Delivery</h3>
                <p className="text-sm text-primary-300">Order before 4 PM</p>
              </div>
            </div>
            <div className="flex items-center py-2 w-auto">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiGift className="text-primary-400 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-primary-100">Free Gift Message</h3>
                <p className="text-sm text-primary-300">With every order</p>
              </div>
            </div>
            <div className="flex items-center py-2 w-auto">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiHeart className="text-primary-400 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-primary-100">100% Love Guarantee</h3>
                <p className="text-sm text-primary-300">Satisfaction guaranteed</p>
              </div>
            </div>
            <div className="flex items-center py-2 w-auto">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiStar className="text-primary-400 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-primary-100">Premium Quality</h3>
                <p className="text-sm text-primary-300">Handcrafted with care</p>
              </div>
            </div>
          </div>

          {/* Mobile Features - First Row */}
          <div className="sm:hidden grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center py-2">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiClock className="text-primary-400 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-primary-100">Same Day Delivery</h3>
                <p className="text-sm text-primary-300">Order before 4 PM</p>
              </div>
            </div>
            <div className="flex items-center py-2">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiGift className="text-primary-400 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-primary-100">Free Gift Message</h3>
                <p className="text-sm text-primary-300">With every order</p>
              </div>
            </div>
          </div>

          {/* Mobile Features - Second Row */}
          <div className="sm:hidden grid grid-cols-2 gap-4">
            <div className="flex items-center py-2">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiHeart className="text-primary-400 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-primary-100">100% Love Guarantee</h3>
                <p className="text-sm text-primary-300">Satisfaction guaranteed</p>
              </div>
            </div>
            <div className="flex items-center py-2">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiStar className="text-primary-400 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-primary-100">Premium Quality</h3>
                <p className="text-sm text-primary-300">Handcrafted with care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary-100">Shop by Occasion</h2>
            <Link href="/occasions" className="text-primary-400 hover:text-primary-300 flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {occasions.map((occasion) => (
              <Link
                key={occasion.name}
                href={`/category/${occasion.slug}`}
                className="group"
              >
                <div className="relative rounded-lg overflow-hidden aspect-square">
                  <Image
                    src={occasion.image}
                    alt={occasion.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="text-white text-lg font-medium">{occasion.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-12 bg-dark-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary-100">Best Selling Products</h2>
            <Link href="/products" className="text-primary-400 hover:text-primary-300 flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          {bestSellingProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {bestSellingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isBestSeller={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-primary-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-primary-200 mb-2">No Products Available</h3>
              <p className="text-primary-300">Add products in the admin panel to see them here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary-100">Shop by Category</h2>
            <Link href="/products" className="text-primary-400 hover:text-primary-300 flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard
                  key={category.id || category}
                  category={{
                    id: category.id || category,
                    name: category.name || category,
                    slug: category.slug || category.toLowerCase().replace(/\s+/g, '-'),
                    imageUrl: category.imageUrl || `/categories/${(category.name || category).toLowerCase()}.svg`
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-primary-400 text-6xl mb-4">📂</div>
              <h3 className="text-xl font-medium text-primary-200 mb-2">No Categories Available</h3>
              <p className="text-primary-300">Add products in the admin panel to create categories.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-dark-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary-100">Featured Products</h2>
            <Link href="/products" className="text-primary-400 hover:text-primary-300 flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-primary-400 text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-medium text-primary-200 mb-2">No Featured Products</h3>
              <p className="text-primary-300">Mark products as featured in the admin panel to see them here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/images/combos/celebration_combo.jpg"
                alt="Special Offers"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
                <div className="text-white max-w-xs">
                  <h3 className="text-2xl font-bold mb-2">Special Offers</h3>
                  <p className="mb-4">Get up to 20% off on selected items</p>
                  <Link
                    href="/products"
                    className="inline-block bg-white text-primary-600 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/images/combos/special_combo.jpg"
                alt="New Arrivals"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
                <div className="text-white max-w-xs">
                  <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
                  <p className="mb-4">Check out our latest collection</p>
                  <Link
                    href="/products"
                    className="inline-block bg-white text-primary-600 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel limit={8} />

      {/* Newsletter */}
      <section className="py-16 bg-dark-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2 text-primary-100">Subscribe to Our Newsletter</h2>
          <p className="text-primary-300 mb-6 max-w-xl mx-auto">
            Stay updated with our latest products, offers, and gifting ideas.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-l-md border-y border-l border-primary-200/30 bg-primary-50 text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-r-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
