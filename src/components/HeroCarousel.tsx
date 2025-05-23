'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
};

type HeroCarouselProps = {
  banners: Banner[];
};

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-[400px] md:h-[450px] w-full overflow-hidden rounded-lg">
      {/* Slides */}
      <div
        className="h-full w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        <div className="absolute inset-0 flex w-full">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="h-full w-full flex-shrink-0"
              style={{ transform: `translateX(${index * 100}%)` }}
            >
              <div className="relative h-full w-full">
                <div
                  className="absolute inset-0 rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${banner.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center rounded-lg">
                  <div className="px-8 md:px-16">
                    <div className="max-w-md bg-white/90 p-6 md:p-8 rounded-lg">
                      <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-800">{banner.title}</h1>
                      <p className="text-gray-600 mb-4 md:mb-6">{banner.description}</p>
                      <Link
                        href={banner.buttonLink}
                        className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                      >
                        {banner.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-primary-600 transition-all"
        onClick={goToPrevSlide}
      >
        <FiChevronLeft size={20} />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-primary-600 transition-all"
        onClick={goToNextSlide}
      >
        <FiChevronRight size={20} />
      </button>

      {/* Indicators - 4 dots as shown in the reference */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-primary-600' : 'bg-white bg-opacity-70'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
