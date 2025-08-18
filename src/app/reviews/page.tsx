'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiStar, FiThumbsUp, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface Review {
  id: string;
  name: string;
  rating: number;
  title: string;
  review: string;
  date: string;
  product: string;
  category: string;
  verified: boolean;
  helpful: number;
}

// Categories for filtering
const categories = ['All', 'Cakes', 'Flowers', 'Gifts', 'Combos', 'Plants', 'Personalised'];

// Ratings for filtering
const ratings = [5, 4, 3, 2, 1];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRating, setActiveRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<number[]>([]);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching reviews from API...');
        const response = await fetch('/api/reviews');
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const reviewsData = await response.json();
        console.log('✅ Received reviews:', reviewsData.length);
        
        setReviews(reviewsData);
      } catch (err) {
        console.error('❌ Error fetching reviews:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
        // Set empty array on error to prevent breaking the page
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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

  // Handle marking review as helpful
  const handleHelpful = (reviewId: number) => {
    if (!helpfulReviews.includes(reviewId)) {
      setHelpfulReviews([...helpfulReviews, reviewId]);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Count reviews by rating
  const ratingCounts = ratings.map(rating => 
    reviews.filter(review => review.rating === rating).length
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read what our customers have to say about their experience with Mispri
          </p>
        </div>

        {/* Reviews Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {ratings.map((rating, index) => (
                <div key={rating} className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {rating}
                  </span>
                  <FiStar className="w-4 h-4 text-yellow-400 fill-current mx-1" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: reviews.length > 0 
                          ? `${(ratingCounts[index] / reviews.length) * 100}%` 
                          : '0%'
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {ratingCounts[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">
              {error}. Showing cached reviews if available.
            </p>
          </div>
        )}

        {/* No Reviews Message */}
        {!loading && reviews.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiStar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">
              Be the first to share your experience with our products!
            </p>
          </div>
        )}

        {/* Filters and Sort */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-gray-700 hover:text-primary-600 lg:hidden"
              >
                <FiFilter className="w-5 h-5 mr-2" />
                Filters
                {showFilters ? (
                  <FiChevronUp className="w-5 h-5 ml-2" />
                ) : (
                  <FiChevronDown className="w-5 h-5 ml-2" />
                )}
              </button>

              {/* Filters */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={activeRating || ''}
                      onChange={(e) => setActiveRating(e.target.value ? parseInt(e.target.value) : null)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Ratings</option>
                      {ratings.map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} Stars
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(activeCategory !== 'All' || activeRating !== null) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeCategory !== 'All' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {activeCategory}
                    <button
                      onClick={() => setActiveCategory('All')}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {activeRating !== null && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {activeRating} Stars
                    <button
                      onClick={() => setActiveRating(null)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reviews List */}
        {sortedReviews.length > 0 && (
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        {review.name}
                        {review.verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Verified Purchase
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{review.product}</div>
                    <div className="text-xs text-gray-500">{review.category}</div>
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                )}

                <p className="text-gray-700 mb-4 leading-relaxed">{review.review}</p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleHelpful(parseInt(review.id))}
                    className={`flex items-center text-sm ${
                      helpfulReviews.includes(parseInt(review.id))
                        ? 'text-primary-600'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    <FiThumbsUp className="w-4 h-4 mr-1" />
                    Helpful ({review.helpful + (helpfulReviews.includes(parseInt(review.id)) ? 1 : 0)})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Filtered Results */}
        {reviews.length > 0 && sortedReviews.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiFilter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-600 mb-4">
              No reviews match your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setActiveRating(null);
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
