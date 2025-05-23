'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiMapPin, FiEdit2, FiMoreVertical, FiHeart, FiPhone, FiHelpCircle } from 'react-icons/fi';
import { FaGift, FaShoppingCart, FaUser } from 'react-icons/fa';
import Logo from './Logo';
import { Category } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import AuthModal from './AuthModal';

// Default categories until we fetch from backend - limited to 10
const defaultCategories = [
  { id: 'express', name: 'Express Delivery', slug: 'express-delivery' },
  { id: 'flowers', name: 'Flowers', slug: 'flowers' },
  { id: 'cakes', name: 'Cakes', slug: 'cakes' },
  { id: 'birthday', name: 'Birthday', slug: 'birthday' },
  { id: 'anniversary', name: 'Anniversary', slug: 'anniversary' },
  { id: 'gifts', name: 'Gifts', slug: 'gifts' },
  { id: 'personalised', name: 'Personalised', slug: 'personalised' },
  { id: 'plants', name: 'Plants', slug: 'plants' },
  { id: 'combos', name: 'Combos', slug: 'combos' },
  { id: 'international', name: 'International', slug: 'international' },
];

// Note: Bhubaneswar pincodes are now checked via the API

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [pincode, setPincode] = useState('751001'); // Default Bhubaneswar pincode
  const [location, setLocation] = useState('Bhubaneswar');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cartCount } = useCart();
  const [categories, setCategories] = useState<Category[]>(
    defaultCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug
    }))
  );

  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close more menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    // Fetch categories from the API
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Keep using default categories on error
      }
    }

    fetchCategories();
  }, []);

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate pincode using the API
      const response = await fetch(`/api/pincode?code=${pincode}`);
      const data = await response.json();

      if (response.ok && data.isDeliverable) {
        setLocation(data.city);
        setIsLocationModalOpen(false);
      } else {
        alert('Sorry, we currently only deliver in Bhubaneswar. Please enter a valid Bhubaneswar pincode.');
      }
    } catch (error) {
      console.error('Error checking pincode:', error);
      alert('Error checking pincode. Please try again.');
    }
  };

  return (
    <header className="bg-white">
      {/* Top Bar */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Delivery Location */}
            <button
              className="hidden md:flex items-center text-sm text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center mr-1">
                  <FiMapPin className="text-primary-600" />
                </div>
                <span>Deliver To {location}</span>
                <FiEdit2 className="ml-1 text-gray-400" size={14} />
              </div>
            </button>

            {/* Search Bar */}
            <div className="hidden md:block flex-grow max-w-xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your gifts"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/track-order" className="hidden md:flex flex-col items-center text-xs text-gray-700 hover:text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Track Order</span>
              </Link>

              <Link href="/gift-finder" className="hidden md:flex flex-col items-center text-xs text-gray-700 hover:text-primary-600">
                <FaGift className="h-6 w-6" />
                <span>Gift Finder</span>
              </Link>

              <Link href="/cart" className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-600 relative">
                <FaShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span>Cart</span>
              </Link>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-600"
              >
                <FaUser className="h-6 w-6" />
                <span>Sign In</span>
              </button>

              {/* More Menu (Three Dots) */}
              <div className="hidden md:block relative" ref={moreMenuRef}>
                <button
                  className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                >
                  <FiMoreVertical className="h-6 w-6" />
                  <span>More</span>
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/wishlist" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiHeart className="mr-2" />
                      Wishlist
                    </Link>
                    <Link href="/contact" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiPhone className="mr-2" />
                      Contact Us
                    </Link>
                    <Link href="/help" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiHelpCircle className="mr-2" />
                      Help & FAQs
                    </Link>
                  </div>
                )}
              </div>

              <button className="md:hidden text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation - Limited to 10 */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex justify-center">
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.slug}`}
                className="px-4 py-3 text-sm text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-2 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search your gifts"
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-2 border-b">
            <button
              className="flex items-center text-sm text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <FiMapPin className="mr-2 text-primary-600" />
              <span>Deliver To {location}</span>
              <FiEdit2 className="ml-1 text-gray-400" size={14} />
            </button>
          </div>
          <nav className="py-2">
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.slug}`}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <div className="border-t mt-2 pt-2">
              <Link
                href="/track-order"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link
                href="/gift-finder"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Gift Finder
              </Link>
              <Link
                href="/account"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
              >
                Sign In
              </Link>

              <Link
                href="/wishlist"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist
              </Link>

              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>

              <Link
                href="/help"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Help & FAQs
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Enter Delivery Location</h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleLocationSubmit}>
              <div className="mb-4">
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  placeholder="Enter pincode"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={pincode}
                  onChange={handlePincodeChange}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  We currently deliver only in Bhubaneswar
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
