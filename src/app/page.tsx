import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { FiArrowRight, FiClock, FiGift, FiHeart, FiStar } from 'react-icons/fi';
import SimpleCarousel from '@/components/SimpleCarousel';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import CategoryCarousel from '@/components/CategoryCarousel';

async function getCategories() {
  const categories = await prisma.product.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  });

  return categories.map(c => c.category);
}

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
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
    take: 8,
  });
}

async function getBestSellingProducts() {
  return prisma.product.findMany({
    where: {
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
    orderBy: {
      price: 'desc', // In a real app, this would be based on sales data
    },
  });
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
    <div className="bg-gray-50">
      {/* Hero Banner Carousel */}
      <section className="relative px-2 sm:px-4 md:px-6 py-2 sm:py-4 max-w-7xl mx-auto">
        <SimpleCarousel banners={banners} />
      </section>

      {/* Mobile Shop By Category - Circular Images */}
      <section className="sm:hidden py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Shop By Category</h2>
            <Link href="/products" className="text-[#0D9488] text-sm">View All</Link>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
            <div className="flex-shrink-0 w-20">
              <Link href="/category/mothers-day" className="block text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-gray-200">
                  <img src="/images/occasions/celebration.jpg" alt="Mothers Day" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs">Mothers Day</span>
              </Link>
            </div>
            <div className="flex-shrink-0 w-20">
              <Link href="/category/flowers" className="block text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-gray-200">
                  <img src="/images/flowers/pink_bouquet.jpg" alt="Flowers" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs">Flowers</span>
              </Link>
            </div>
            <div className="flex-shrink-0 w-20">
              <Link href="/category/cakes" className="block text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-gray-200">
                  <img src="/images/cakes/cake_display.jpg" alt="Cakes" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs">Cakes</span>
              </Link>
            </div>
            <div className="flex-shrink-0 w-20">
              <Link href="/category/combos" className="block text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-gray-200">
                  <img src="/images/combos/gift_combo.jpg" alt="Combos" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs">Combos</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Shop By Occasions & Relations */}
      <section className="sm:hidden py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">Shop By Occasions & Relations</h2>
            <p className="text-gray-600 text-sm mt-1">Surprise Your Loved Ones</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/category/birthday-gifts" className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square">
                  <img
                    src="/images/cakes/birthday_cake.jpg"
                    alt="Birthday Gifts"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium">Birthday Gifts</h3>
                </div>
              </div>
            </Link>

            <Link href="/category/anniversary-gifts" className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square">
                  <img
                    src="/images/cakes/white_cake.jpg"
                    alt="Anniversary Gifts"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium">Anniversary Gifts</h3>
                </div>
              </div>
            </Link>

            <Link href="/category/gifts-for-him" className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square">
                  <img
                    src="/images/flowers/flower_basket.jpg"
                    alt="Gifts for Him"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium">Gifts for Him</h3>
                </div>
              </div>
            </Link>

            <Link href="/category/gifts-for-her" className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square">
                  <img
                    src="/images/flowers/rose_bouquet.jpg"
                    alt="Gifts for Her"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium">Gifts for Her</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Bestselling Products */}
      <section className="sm:hidden py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Bestselling Products</h2>
            <Link href="/products" className="text-[#0D9488] text-sm">View All</Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Link href="/product/1">
                <div className="aspect-square">
                  <img
                    src="/images/flowers/mixed_bouquet.jpg"
                    alt="Mixed Roses Bouquet"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-gray-800 text-sm">Mixed Roses Bouquet</h3>
                  <p className="text-sm font-bold text-gray-800 mt-1">₹599</p>
                </div>
              </Link>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Link href="/product/2">
                <div className="aspect-square">
                  <img
                    src="/images/cakes/chocolate_cake.jpg"
                    alt="Chocolate Truffle Cake"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-gray-800 text-sm">Chocolate Truffle Cake</h3>
                  <p className="text-sm font-bold text-gray-800 mt-1">₹799</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Link href="/product/3">
                <div className="aspect-square">
                  <img
                    src="/images/combos/cake_flower_combo.jpg"
                    alt="Flower & Cake Combo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-gray-800 text-sm">Flower & Cake Combo</h3>
                  <p className="text-sm font-bold text-gray-800 mt-1">₹1299</p>
                </div>
              </Link>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Link href="/product/4">
                <div className="aspect-square">
                  <img
                    src="/images/flowers/rose_bouquet.jpg"
                    alt="Rose Bouquet"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-gray-800 text-sm">Rose Bouquet</h3>
                  <p className="text-sm font-bold text-gray-800 mt-1">₹899</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Desktop Features */}
          <div className="hidden sm:flex flex-wrap justify-between">
            <div className="flex items-center py-2 w-auto">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiClock className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium">Same Day Delivery</h3>
                <p className="text-sm text-gray-600">Order before 4 PM</p>
              </div>
            </div>
            <div className="flex items-center py-2 w-auto">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiGift className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium">Free Gift Message</h3>
                <p className="text-sm text-gray-600">With every order</p>
              </div>
            </div>
            <div className="flex items-center py-2 w-auto">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiHeart className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium">100% Love Guarantee</h3>
                <p className="text-sm text-gray-600">Satisfaction guaranteed</p>
              </div>
            </div>
            <div className="flex items-center py-2 w-auto">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiStar className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium">Premium Quality</h3>
                <p className="text-sm text-gray-600">Handcrafted with care</p>
              </div>
            </div>
          </div>

          {/* Mobile Features - First Row */}
          <div className="sm:hidden grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center py-2">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiClock className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium">Same Day Delivery</h3>
                <p className="text-sm text-gray-600">Order before 4 PM</p>
              </div>
            </div>
            <div className="flex items-center py-2">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiGift className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium">Free Gift Message</h3>
                <p className="text-sm text-gray-600">With every order</p>
              </div>
            </div>
          </div>

          {/* Mobile Features - Second Row */}
          <div className="sm:hidden grid grid-cols-2 gap-4">
            <div className="flex items-center py-2">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiHeart className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium">100% Love Guarantee</h3>
                <p className="text-sm text-gray-600">Satisfaction guaranteed</p>
              </div>
            </div>
            <div className="flex items-center py-2">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <FiStar className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium">Premium Quality</h3>
                <p className="text-sm text-gray-600">Handcrafted with care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Shop by Occasion</h2>
            <Link href="/occasions" className="text-primary-600 hover:text-primary-700 flex items-center">
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Best Selling Products</h2>
            <Link href="/products" className="text-primary-600 hover:text-primary-700 flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isBestSeller={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link href="/products" className="text-primary-600 hover:text-primary-700 flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard
                key={category}
                category={{
                  id: category,
                  name: category,
                  slug: category.toLowerCase(),
                  imageUrl:
                    category.toLowerCase().includes('cake') ? `/images/cakes/cake_display.jpg` :
                    category.toLowerCase() === 'flowers' ? `/images/flowers/pink_bouquet.jpg` :
                    category.toLowerCase() === 'personalised' ? `/images/personalised/personalized_gift.jpg` :
                    category.toLowerCase() === 'plants' ? `/images/plants/potted_plant.jpg` :
                    category.toLowerCase() === 'combos' ? `/images/combos/gift_combo.jpg` :
                    category.toLowerCase() === 'international' ? `/images/international/tiramisu.jpg` :
                    category.toLowerCase() === 'occasions' ? `/images/occasions/celebration.jpg` :
                    category.toLowerCase() === 'cookies' ? `/images/cookies/chocolate_chip.jpg` :
                    category.toLowerCase() === 'chocolate' ? `/images/chocolate/truffles.jpg` :
                    `/images/flowers/rose_bouquet.jpg`
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-primary-600 hover:text-primary-700 flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex text-yellow-400 mb-4">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                </div>
                <p className="text-gray-600 mb-4">
                  "The flowers were absolutely beautiful and delivered on time. The recipient was thrilled with the arrangement. Will definitely order again!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-medium">Customer {i}</h4>
                    <p className="text-sm text-gray-500">Bhubaneswar</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Stay updated with our latest products, offers, and gifting ideas.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-l-md border-y border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-r-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
