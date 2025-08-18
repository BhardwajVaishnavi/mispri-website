'use client';

import { useState, useEffect } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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

interface TestimonialsCarouselProps {
  limit?: number;
}

export default function TestimonialsCarousel({ limit = 8 }: TestimonialsCarouselProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reviews?limit=${limit}`);
        
        if (response.ok) {
          const reviewsData = await response.json();
          // Filter only 5-star reviews for testimonials
          const topReviews = reviewsData.filter((review: Review) => review.rating >= 4);
          setReviews(topReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [limit]);

  // Auto-advance carousel
  useEffect(() => {
    if (reviews.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, reviews.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length, itemsPerView]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, reviews.length - itemsPerView);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, reviews.length - itemsPerView);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-12 bg-dark-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-primary-100">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-dark-700 border border-primary-200/20 p-6 rounded-lg animate-pulse">
                <div className="flex space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 bg-primary-300/30 rounded"></div>
                  ))}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-primary-300/30 rounded w-full"></div>
                  <div className="h-4 bg-primary-300/30 rounded w-3/4"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-300/30 rounded-full mr-3"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-primary-300/30 rounded w-20"></div>
                    <div className="h-3 bg-primary-300/30 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-12 bg-dark-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-primary-100">What Our Customers Say</h2>
          <div className="text-center text-primary-300">
            <p>No reviews available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const maxIndex = Math.max(0, reviews.length - itemsPerView);
  const showNavigation = reviews.length > itemsPerView;

  return (
    <section className="py-12 bg-dark-800">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-primary-100">What Our Customers Say</h2>
        
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(reviews.length / itemsPerView) * 100}%`
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / reviews.length}%` }}
                >
                  <div className="bg-dark-700 border border-primary-200/20 p-6 rounded-lg h-full">
                    {/* Rating */}
                    <div className="flex text-yellow-400 mb-4">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Title */}
                    {review.title && (
                      <h4 className="font-semibold text-primary-100 mb-2 line-clamp-1">
                        {review.title}
                      </h4>
                    )}

                    {/* Review Text */}
                    <p className="text-primary-200 mb-4 line-clamp-3">
                      "{review.review}"
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-500/20 rounded-full mr-3 flex items-center justify-center">
                        <span className="text-primary-300 font-semibold text-sm">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-100 flex items-center">
                          {review.name}
                          {review.verified && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-600/20 text-green-400">
                              ✓
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-primary-300">
                          {review.product} • {review.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {showNavigation && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-dark-700 border border-primary-200/20 rounded-full p-2 shadow-lg text-primary-200 hover:text-primary-400 hover:bg-primary-600/20 transition-colors z-10"
                aria-label="Previous testimonials"
              >
                <FiChevronLeft size={20} />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-dark-700 border border-primary-200/20 rounded-full p-2 shadow-lg text-primary-200 hover:text-primary-400 hover:bg-primary-600/20 transition-colors z-10"
                aria-label="Next testimonials"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {showNavigation && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary-400' : 'bg-primary-200/30'
                  }`}
                  aria-label={`Go to testimonial group ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
