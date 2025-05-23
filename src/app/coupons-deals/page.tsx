'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCopy, FiCheck, FiCalendar, FiInfo } from 'react-icons/fi';

// Mock coupon data
const coupons = [
  {
    id: '1',
    code: 'WELCOME20',
    discount: '20% OFF',
    description: 'Get 20% off on your first order',
    minOrder: 500,
    maxDiscount: 200,
    validUntil: '2023-12-31',
    terms: [
      'Valid for first-time customers only',
      'Minimum order value: ₹500',
      'Maximum discount: ₹200',
      'Cannot be combined with other offers'
    ],
    image: '/images/coupons/coupon1.jpg',
    category: 'New Users'
  },
  {
    id: '2',
    code: 'CAKE15',
    discount: '15% OFF',
    description: 'Get 15% off on all cakes',
    minOrder: 700,
    maxDiscount: 300,
    validUntil: '2023-10-31',
    terms: [
      'Valid on all cake products',
      'Minimum order value: ₹700',
      'Maximum discount: ₹300',
      'Cannot be combined with other offers'
    ],
    image: '/images/coupons/coupon2.jpg',
    category: 'Cakes'
  },
  {
    id: '3',
    code: 'FLOWER10',
    discount: '10% OFF',
    description: 'Get 10% off on all flower bouquets',
    minOrder: 600,
    maxDiscount: 250,
    validUntil: '2023-11-30',
    terms: [
      'Valid on all flower products',
      'Minimum order value: ₹600',
      'Maximum discount: ₹250',
      'Cannot be combined with other offers'
    ],
    image: '/images/coupons/coupon3.jpg',
    category: 'Flowers'
  },
  {
    id: '4',
    code: 'COMBO25',
    discount: '25% OFF',
    description: 'Get 25% off on all combo products',
    minOrder: 1000,
    maxDiscount: 500,
    validUntil: '2023-09-30',
    terms: [
      'Valid on all combo products',
      'Minimum order value: ₹1000',
      'Maximum discount: ₹500',
      'Cannot be combined with other offers'
    ],
    image: '/images/coupons/coupon4.jpg',
    category: 'Combos'
  },
  {
    id: '5',
    code: 'BIRTHDAY10',
    discount: '10% OFF',
    description: 'Special discount for birthday celebrations',
    minOrder: 800,
    maxDiscount: 300,
    validUntil: '2023-12-31',
    terms: [
      'Valid on birthday cakes and gifts',
      'Minimum order value: ₹800',
      'Maximum discount: ₹300',
      'Cannot be combined with other offers'
    ],
    image: '/images/coupons/coupon5.jpg',
    category: 'Occasions'
  },
  {
    id: '6',
    code: 'FREESHIP',
    discount: 'FREE SHIPPING',
    description: 'Free shipping on orders above ₹1000',
    minOrder: 1000,
    maxDiscount: 100,
    validUntil: '2023-12-31',
    terms: [
      'Valid on all products',
      'Minimum order value: ₹1000',
      'Maximum shipping discount: ₹100',
      'Valid only for delivery within Bhubaneswar'
    ],
    image: '/images/coupons/coupon6.jpg',
    category: 'Shipping'
  }
];

// Categories for filtering
const categories = ['All', 'New Users', 'Cakes', 'Flowers', 'Combos', 'Occasions', 'Shipping'];

export default function CouponsDealsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState<string | null>(null);

  const filteredCoupons = activeCategory === 'All' 
    ? coupons 
    : coupons.filter(coupon => coupon.category === activeCategory);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleTerms = (id: string) => {
    if (showTerms === id) {
      setShowTerms(null);
    } else {
      setShowTerms(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Coupons & Deals</h1>
        
        <p className="text-center text-gray-600 mb-12">
          Save more with our exclusive coupons and special deals. Use these codes at checkout to get discounts on your favorite products.
        </p>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 m-1 rounded-full text-sm font-medium transition-colors ${
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
        
        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {/* Coupon Image */}
              <div className="relative h-48">
                <Image
                  src={coupon.image}
                  alt={coupon.description}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary-600 text-white px-3 py-1 text-sm font-bold">
                  {coupon.discount}
                </div>
              </div>
              
              {/* Coupon Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{coupon.description}</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-1" />
                    <span>Valid until: {new Date(coupon.validUntil).toLocaleDateString()}</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    Min: ₹{coupon.minOrder}
                  </span>
                </div>
                
                {/* Coupon Code */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-3">
                  <div className="font-mono font-medium text-gray-800">{coupon.code}</div>
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <FiCheck className="mr-1" />
                        <span className="text-sm">Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="mr-1" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Terms Toggle */}
                <button
                  onClick={() => toggleTerms(coupon.id)}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <FiInfo className="mr-1" />
                  <span>{showTerms === coupon.id ? 'Hide Terms' : 'View Terms'}</span>
                </button>
                
                {/* Terms and Conditions */}
                {showTerms === coupon.id && (
                  <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                    <p className="font-medium mb-1">Terms & Conditions:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {coupon.terms.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Use Coupon Button */}
              <div className="px-4 pb-4">
                <Link
                  href="/"
                  className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center font-medium py-2 rounded-md transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No coupons available for this category at the moment.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Coupons
            </button>
          </div>
        )}
        
        {/* Newsletter Signup */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get Exclusive Deals</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive exclusive coupons, special offers, and updates about new products directly to your inbox.
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
