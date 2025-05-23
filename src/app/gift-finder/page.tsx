'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Red Rose Bouquet',
    price: 799,
    image: '/images/flowers/rose_bouquet.jpg',
    category: 'Flowers',
    occasion: ['Birthday', 'Anniversary', 'Valentine\'s Day'],
    recipient: ['Partner', 'Mother', 'Friend'],
    priceRange: '500-1000',
  },
  {
    id: '2',
    name: 'Chocolate Truffle Cake',
    price: 899,
    image: '/images/cakes/chocolate_cake.jpg',
    category: 'Cakes',
    occasion: ['Birthday', 'Anniversary', 'Celebration'],
    recipient: ['Partner', 'Friend', 'Colleague'],
    priceRange: '500-1000',
  },
  {
    id: '3',
    name: 'Mixed Flower Bouquet',
    price: 599,
    image: '/images/flowers/mixed_bouquet.jpg',
    category: 'Flowers',
    occasion: ['Birthday', 'Get Well Soon', 'Congratulations'],
    recipient: ['Mother', 'Friend', 'Colleague'],
    priceRange: '500-1000',
  },
  {
    id: '4',
    name: 'Birthday Gift Hamper',
    price: 1499,
    image: '/images/combos/gift_combo.jpg',
    category: 'Combos',
    occasion: ['Birthday'],
    recipient: ['Partner', 'Friend', 'Colleague'],
    priceRange: '1000-2000',
  },
  {
    id: '5',
    name: 'Anniversary Special Combo',
    price: 2499,
    image: '/images/combos/cake_flower_combo.jpg',
    category: 'Combos',
    occasion: ['Anniversary'],
    recipient: ['Partner'],
    priceRange: '2000+',
  },
  {
    id: '6',
    name: 'Potted Plant',
    price: 699,
    image: '/images/plants/potted_plant.jpg',
    category: 'Plants',
    occasion: ['Housewarming', 'Get Well Soon'],
    recipient: ['Friend', 'Colleague', 'Mother'],
    priceRange: '500-1000',
  },
];

// Filter options
const occasions = ['Birthday', 'Anniversary', 'Valentine\'s Day', 'Get Well Soon', 'Congratulations', 'Housewarming'];
const recipients = ['Partner', 'Mother', 'Father', 'Friend', 'Colleague'];
const categories = ['Flowers', 'Cakes', 'Plants', 'Combos', 'Personalised'];
const priceRanges = ['Under 500', '500-1000', '1000-2000', '2000+'];

export default function GiftFinderPage() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    occasion: true,
    recipient: true,
    category: true,
    price: true,
  });

  // Filter products based on selected filters
  const filteredProducts = mockProducts.filter(product => {
    if (selectedOccasion && !product.occasion.includes(selectedOccasion)) return false;
    if (selectedRecipient && !product.recipient.includes(selectedRecipient)) return false;
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (selectedPriceRange && product.priceRange !== selectedPriceRange) return false;
    return true;
  });

  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters({
      ...expandedFilters,
      [filter]: !expandedFilters[filter],
    });
  };

  const clearFilters = () => {
    setSelectedOccasion(null);
    setSelectedRecipient(null);
    setSelectedCategory(null);
    setSelectedPriceRange(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gift Finder</h1>
      
      <div className="mb-8">
        <p className="text-gray-600">
          Find the perfect gift for your loved ones. Use our gift finder to filter by occasion, recipient, category, and price range.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            className="w-full bg-white border rounded-md px-4 py-2 flex items-center justify-between shadow-sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span className="flex items-center">
              <FiFilter className="mr-2" />
              Filters
            </span>
            <span className="text-primary-600 text-sm font-medium" onClick={(e) => {
              e.stopPropagation();
              clearFilters();
            }}>
              Clear All
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className={`lg:w-1/4 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                className="text-primary-600 text-sm font-medium"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>

            {/* Occasion Filter */}
            <div className="mb-6 border-b pb-4">
              <button
                className="flex justify-between items-center w-full text-left font-medium mb-2"
                onClick={() => toggleFilter('occasion')}
              >
                Occasion
                {expandedFilters.occasion ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {expandedFilters.occasion && (
                <div className="space-y-2">
                  {occasions.map((occasion) => (
                    <div key={occasion} className="flex items-center">
                      <input
                        type="radio"
                        id={`occasion-${occasion}`}
                        name="occasion"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        checked={selectedOccasion === occasion}
                        onChange={() => setSelectedOccasion(occasion)}
                      />
                      <label htmlFor={`occasion-${occasion}`} className="ml-2 text-sm text-gray-700">
                        {occasion}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recipient Filter */}
            <div className="mb-6 border-b pb-4">
              <button
                className="flex justify-between items-center w-full text-left font-medium mb-2"
                onClick={() => toggleFilter('recipient')}
              >
                Recipient
                {expandedFilters.recipient ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {expandedFilters.recipient && (
                <div className="space-y-2">
                  {recipients.map((recipient) => (
                    <div key={recipient} className="flex items-center">
                      <input
                        type="radio"
                        id={`recipient-${recipient}`}
                        name="recipient"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        checked={selectedRecipient === recipient}
                        onChange={() => setSelectedRecipient(recipient)}
                      />
                      <label htmlFor={`recipient-${recipient}`} className="ml-2 text-sm text-gray-700">
                        {recipient}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6 border-b pb-4">
              <button
                className="flex justify-between items-center w-full text-left font-medium mb-2"
                onClick={() => toggleFilter('category')}
              >
                Category
                {expandedFilters.category ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {expandedFilters.category && (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category}`}
                        name="category"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <button
                className="flex justify-between items-center w-full text-left font-medium mb-2"
                onClick={() => toggleFilter('price')}
              >
                Price Range
                {expandedFilters.price ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {expandedFilters.price && (
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${range}`}
                        name="price"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        checked={selectedPriceRange === range}
                        onChange={() => setSelectedPriceRange(range)}
                      />
                      <label htmlFor={`price-${range}`} className="ml-2 text-sm text-gray-700">
                        ₹{range}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <div className="lg:hidden">
              <button
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-md transition-colors"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">No products match your selected filters.</p>
              <button
                className="text-primary-600 font-medium"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-primary-600 font-bold mt-1">₹{product.price.toFixed(2)}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.occasion.slice(0, 1).map((occ) => (
                          <span key={occ} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {occ}
                          </span>
                        ))}
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
