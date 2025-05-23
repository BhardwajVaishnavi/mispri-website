'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiStar, FiThumbsUp, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Mock review data
const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    avatar: '/images/avatars/avatar1.jpg',
    rating: 5,
    date: '2023-06-10',
    title: 'Exceptional Quality and Service',
    review: 'I ordered a birthday cake for my daughter and it exceeded all expectations. The cake was not only beautiful but also delicious. The delivery was prompt and the staff was very courteous. Will definitely order again!',
    product: 'Chocolate Truffle Cake',
    helpful: 24,
    verified: true,
    category: 'Cakes'
  },
  {
    id: 2,
    name: 'Rahul Patel',
    avatar: '/images/avatars/avatar2.jpg',
    rating: 4,
    date: '2023-05-28',
    title: 'Beautiful Flower Arrangement',
    review: 'The flower arrangement I ordered for my anniversary was stunning. Fresh flowers and beautifully arranged. The only reason for 4 stars instead of 5 is that the delivery was slightly delayed, but they did call to inform me about it.',
    product: 'Mixed Flower Bouquet',
    helpful: 18,
    verified: true,
    category: 'Flowers'
  },
  {
    id: 3,
    name: 'Ananya Gupta',
    avatar: '/images/avatars/avatar3.jpg',
    rating: 5,
    date: '2023-05-15',
    title: 'Perfect Gift Combo',
    review: "I ordered the cake and flower combo for my mother's birthday and it was perfect! The cake was fresh and delicious, and the flowers were beautiful. The packaging was also very elegant. Highly recommend!",
    product: 'Cake & Flower Combo',
    helpful: 32,
    verified: true,
    category: 'Combos'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    avatar: '/images/avatars/avatar4.jpg',
    rating: 3,
    date: '2023-04-22',
    title: 'Good but Could Be Better',
    review: 'The cake tasted good but the design was not exactly as shown in the picture. The delivery was on time though, and the customer service was helpful when I called to inquire about my order.',
    product: 'Vanilla Cake with Fruits',
    helpful: 7,
    verified: true,
    category: 'Cakes'
  },
  {
    id: 5,
    name: 'Neha Reddy',
    avatar: '/images/avatars/avatar5.jpg',
    rating: 5,
    date: '2023-04-10',
    title: 'Saved My Day!',
    review: "I needed a last-minute gift for a friend's birthday and Mispri came to the rescue! I was able to order a beautiful gift basket and have it delivered the same day. The quality was excellent and my friend loved it!",
    product: 'Deluxe Gift Basket',
    helpful: 15,
    verified: true,
    category: 'Gifts'
  },
  {
    id: 6,
    name: 'Arjun Mehta',
    avatar: '/images/avatars/avatar6.jpg',
    rating: 4,
    date: '2023-03-28',
    title: 'Great Personalized Gift',
    review: "I ordered a personalized photo cake for my parents' anniversary. The photo quality on the cake was good and the cake itself was delicious. The only improvement could be in the packaging, as the box was slightly damaged during delivery.",
    product: 'Personalized Photo Cake',
    helpful: 12,
    verified: true,
    category: 'Personalised'
  },
  {
    id: 7,
    name: 'Kavita Joshi',
    avatar: '/images/avatars/avatar7.jpg',
    rating: 5,
    date: '2023-03-15',
    title: 'Excellent Plant Quality',
    review: 'I ordered a money plant and it arrived in perfect condition. The plant was healthy and well-packaged. The pot was also very elegant. Very happy with my purchase!',
    product: 'Money Plant',
    helpful: 9,
    verified: true,
    category: 'Plants'
  },
  {
    id: 8,
    name: 'Sanjay Kumar',
    avatar: '/images/avatars/avatar8.jpg',
    rating: 2,
    date: '2023-02-20',
    title: 'Disappointed with Delivery',
    review: "The cake itself was good, but it was delivered 3 hours late, which ruined our surprise party. The customer service was apologetic but couldn't do much to fix the situation.",
    product: 'Black Forest Cake',
    helpful: 5,
    verified: true,
    category: 'Cakes'
  }
];

// Categories for filtering
const categories = ['All', 'Cakes', 'Flowers', 'Gifts', 'Combos', 'Plants', 'Personalised'];

// Ratings for filtering
const ratings = [5, 4, 3, 2, 1];

export default function ReviewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRating, setActiveRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<number[]>([]);

  // Filter reviews based on selected category and rating
  const filteredReviews = reviews.filter(review => {
    const categoryMatch = activeCategory === 'All' || review.category === activeCategory;
    const ratingMatch = activeRating === null || review.rating === activeRating;
    return categoryMatch && ratingMatch;
  });

  // Sort reviews based on selected sort option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else if (sortBy === 'lowest') {
      return a.rating - b.rating;
    } else if (sortBy === 'helpful') {
      return b.helpful - a.helpful;
    }
    return 0;
  });

  const markHelpful = (id: number) => {
    if (!helpfulReviews.includes(id)) {
      setHelpfulReviews([...helpfulReviews, id]);
    }
  };

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Calculate rating distribution
  const ratingDistribution = ratings.map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = (count / reviews.length) * 100;
    return { rating, count, percentage };
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Customer Reviews</h1>

        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Read what our customers have to say about their experiences with our products and services.
        </p>

        {/* Rating Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-gray-800 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } h-5 w-5`}
                  />
                ))}
              </div>
              <p className="text-gray-600">Based on {reviews.length} reviews</p>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center">
                    <div className="w-12 text-sm text-gray-600">{item.rating} stars</div>
                    <div className="flex-grow mx-3 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm text-gray-600 text-right">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="md:flex justify-between items-center">
            <div className="mb-4 md:mb-0">
              <button
                className="flex items-center text-gray-700 hover:text-gray-900"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter className="mr-2" />
                <span>Filter Reviews</span>
                {showFilters ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
              </button>
            </div>

            <div className="flex items-center">
              <label htmlFor="sort" className="text-gray-700 mr-2">
                Sort by:
              </label>
              <select
                id="sort"
                className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Filter by Rating</h3>
                <div className="flex flex-wrap gap-2">
                  {ratings.map((rating) => (
                    <button
                      key={rating}
                      className={`px-3 py-1 rounded-full text-sm flex items-center ${
                        activeRating === rating
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveRating(activeRating === rating ? null : rating)}
                    >
                      {rating} <FiStar className={`ml-1 ${activeRating === rating ? '' : 'text-yellow-400'}`} />
                    </button>
                  ))}
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeRating === null
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveRating(null)}
                  >
                    All Ratings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{review.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={`${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                } h-4 w-4`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    <h4 className="font-medium mt-3">{review.title}</h4>
                    <p className="text-gray-600 mt-2">{review.review}</p>

                    <div className="mt-4 text-sm text-gray-500">
                      Product: {review.product}
                    </div>

                    <div className="mt-4 flex items-center">
                      <button
                        className={`flex items-center text-sm ${
                          helpfulReviews.includes(review.id)
                            ? 'text-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => markHelpful(review.id)}
                        disabled={helpfulReviews.includes(review.id)}
                      >
                        <FiThumbsUp className="mr-1" />
                        <span>Helpful ({review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No reviews match your selected filters.</p>
              <button
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => {
                  setActiveCategory('All');
                  setActiveRating(null);
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Write a Review CTA */}
        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Share Your Experience</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We value your feedback! If you've purchased from us, please take a moment to share your experience and help other customers make informed decisions.
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
}
