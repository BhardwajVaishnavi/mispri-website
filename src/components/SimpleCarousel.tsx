'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type Banner = {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
};

type SimpleCarouselProps = {
  banners: Banner[];
};

export default function SimpleCarousel({ banners }: SimpleCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, banners.length]);

  const goToPrevSlide = () => {
    setAutoplay(false);
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setAutoplay(false);
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setAutoplay(false);
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[250px] sm:h-[350px] md:h-[450px] w-full overflow-hidden rounded-lg">
      {/* Current Slide */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Banner Image */}
          <div className="absolute inset-0">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Content - Different for mobile and desktop */}
          <div className="absolute inset-0 flex items-end sm:items-center">
            {/* Mobile Content - Matching reference */}
            <div className="sm:hidden w-full px-4 pb-12">
              <div className="bg-white/90 p-4 rounded-lg max-w-xs mx-auto">
                <h1 className="text-xl font-bold text-gray-800">{banner.title}</h1>
                <p className="text-sm text-gray-600 mt-1">{banner.subtitle || "Express Love, Joy & Gratitude!"}</p>
              </div>
            </div>

            {/* Desktop Content */}
            <div className="hidden sm:block px-8 md:px-16 w-full">
              <div className="max-w-md bg-white/90 p-6 md:p-8 rounded-lg">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-800">{banner.title}</h1>
                <p className="text-base text-gray-600 mb-4 md:mb-6">{banner.description}</p>
                <Link
                  href={banner.buttonLink}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium text-base py-2 px-6 rounded-md transition-colors"
                >
                  {banner.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
      <div className="hidden sm:block">
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-primary-600 transition-all z-10"
          onClick={goToPrevSlide}
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-primary-600 transition-all z-10"
          onClick={goToNextSlide}
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Indicators - Minimalist on mobile */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white/40'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
