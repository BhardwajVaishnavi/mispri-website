'use client';

import { useState, useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import CategoryCard from './CategoryCard';

type CategoryCarouselProps = {
  title: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
  }[];
  itemsPerView?: number;
};

export default function CategoryCarousel({
  title,
  categories,
  itemsPerView = 6
}: CategoryCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrowVisibility = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateArrowVisibility);
      // Initial check
      updateArrowVisibility();
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', updateArrowVisibility);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;
    const scrollAmount = carousel.clientWidth * 0.8; // Scroll 80% of visible width

    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    carousel.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });

    setScrollPosition(newPosition);
  };

  return (
    <div className="relative bg-white rounded-lg p-4 shadow-sm h-full">
      <h3 className="text-sm font-semibold mb-3 text-gray-800">{title}</h3>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide gap-3 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <div key={category.id} className="flex-shrink-0" style={{ width: `calc(100% / ${itemsPerView})` }}>
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button
          className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md text-primary-600 z-10"
          onClick={() => scroll('left')}
        >
          <FiChevronLeft size={16} />
        </button>
      )}

      {showRightArrow && (
        <button
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md text-primary-600 z-10"
          onClick={() => scroll('right')}
        >
          <FiChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
