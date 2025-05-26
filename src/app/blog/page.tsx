'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiUser, FiTag, FiSearch } from 'react-icons/fi';

// Note: In a real application, blog posts would be fetched from a CMS or API
// For now, we'll show a coming soon message
const blogPosts: any[] = [
  {
    id: 1,
    title: 'The Art of Cake Decoration: Tips and Techniques',
    slug: 'art-of-cake-decoration',
    excerpt: 'Learn the fundamentals of cake decoration and discover professional techniques to elevate your baking skills. From buttercream flowers to fondant designs, this guide covers it all.',
    content: '',
    image: '/images/blog/blog1.jpg',
    date: '2023-06-15',
    author: 'Priya Sharma',
    category: 'Baking Tips',
    tags: ['Cake Decoration', 'Baking', 'Techniques']
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Flowers for Every Occasion',
    slug: 'perfect-flowers-for-occasions',
    excerpt: 'Selecting the right flowers for different occasions can be challenging. This guide helps you understand flower symbolism and create the perfect arrangement for birthdays, anniversaries, and more.',
    content: '',
    image: '/images/blog/blog2.jpg',
    date: '2023-06-01',
    author: 'Rahul Patel',
    category: 'Flower Guide',
    tags: ['Flowers', 'Occasions', 'Gift Ideas']
  },
  {
    id: 3,
    title: 'Creative Gift Ideas for Every Relationship',
    slug: 'creative-gift-ideas',
    excerpt: 'Struggling to find the perfect gift? Discover unique and thoughtful gift ideas for friends, family, partners, and colleagues that go beyond the ordinary.',
    content: '',
    image: '/images/blog/blog3.jpg',
    date: '2023-05-20',
    author: 'Ananya Gupta',
    category: 'Gift Ideas',
    tags: ['Gifts', 'Relationships', 'Celebrations']
  },
  {
    id: 4,
    title: 'The Science Behind Baking: Understanding Ingredients',
    slug: 'science-behind-baking',
    excerpt: 'Baking is both an art and a science. Learn how different ingredients interact and how to adjust recipes for perfect results every time.',
    content: '',
    image: '/images/blog/blog4.jpg',
    date: '2023-05-10',
    author: 'Vikram Singh',
    category: 'Baking Tips',
    tags: ['Baking', 'Ingredients', 'Food Science']
  },
  {
    id: 5,
    title: 'Sustainable Floristry: Eco-Friendly Flower Arrangements',
    slug: 'sustainable-floristry',
    excerpt: 'Discover how to create beautiful flower arrangements while minimizing environmental impact. Learn about sustainable practices in floristry and eco-friendly alternatives.',
    content: '',
    image: '/images/blog/blog5.jpg',
    date: '2023-04-25',
    author: 'Neha Reddy',
    category: 'Flower Guide',
    tags: ['Sustainability', 'Flowers', 'Eco-Friendly']
  },
  {
    id: 6,
    title: 'Personalized Gifts: Adding a Special Touch',
    slug: 'personalized-gifts',
    excerpt: 'Personalized gifts show thoughtfulness and care. Explore creative ways to customize gifts for your loved ones and make every occasion memorable.',
    content: '',
    image: '/images/blog/blog6.jpg',
    date: '2023-04-15',
    author: 'Arjun Mehta',
    category: 'Gift Ideas',
    tags: ['Personalization', 'Gifts', 'DIY']
  }
];

// For now, show empty blog to avoid demo data
const actualBlogPosts: any[] = [];

// Categories for filtering
const categories = [
  'All Categories',
  'Baking Tips',
  'Flower Guide',
  'Gift Ideas',
  'Celebrations',
  'DIY Projects'
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');

  // Filter blog posts based on search query and category
  const filteredPosts = actualBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'All Categories' || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Blog</h1>

        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Discover tips, ideas, and inspiration for cakes, flowers, gifts, and celebrations. Stay updated with our latest articles and guides.
        </p>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <select
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <Image
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6 md:p-8">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <FiCalendar className="mr-2" />
                    <span>{new Date(filteredPosts[0].date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                    <span className="mx-2">•</span>
                    <FiUser className="mr-2" />
                    <span>{filteredPosts[0].author}</span>
                  </div>

                  <h2 className="text-2xl font-semibold mb-4">{filteredPosts[0].title}</h2>
                  <p className="text-gray-600 mb-6">{filteredPosts[0].excerpt}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {filteredPosts[0].tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${filteredPosts[0].slug}`}
                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {filteredPosts.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <FiCalendar className="mr-1" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 flex items-center">
                      <FiUser className="mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Coming Soon!</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We're working on creating amazing content about flowers, cakes, and gift ideas.
              Stay tuned for helpful tips, tutorials, and inspiration!
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">In the meantime, explore our products:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/products?category=Flowers"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Shop Flowers
                </Link>
                <Link
                  href="/products?category=Cakes"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Shop Cakes
                </Link>
                <Link
                  href="/products?category=Gifts"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Shop Gifts
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Stay updated with our latest articles, tips, and special offers. Subscribe to our newsletter and never miss an update.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-r-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
