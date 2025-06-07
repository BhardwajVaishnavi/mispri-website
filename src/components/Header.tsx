'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiMapPin, FiEdit2, FiMoreVertical, FiHeart, FiPhone, FiHelpCircle } from 'react-icons/fi';
import { FaGift, FaShoppingCart, FaUser } from 'react-icons/fa';
import Logo from './Logo';
import { Category } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

// No default categories - only show real categories from admin panel
const defaultCategories: any[] = [];

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
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

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
        const response = await fetch('/api/public/categories');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            // Transform the data to ensure proper format
            const formattedCategories = data.map((cat: any) => ({
              id: cat.id || cat.name?.toLowerCase(),
              name: cat.name || cat,
              slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || cat.toLowerCase().replace(/\s+/g, '-')
            }));
            setCategories(formattedCategories);
            console.log('Categories loaded from admin panel:', formattedCategories);
          } else {
            // Use fallback categories if API returns empty
            setCategories(defaultCategories);
            console.log('Using fallback categories');
          }
        } else {
          // Use fallback categories if API fails
          setCategories(defaultCategories);
          console.log('API failed, using fallback categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use fallback categories on error
        setCategories(defaultCategories);
        console.log('Error occurred, using fallback categories');
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

        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        successDiv.innerHTML = `✅ Delivery confirmed for ${pincode} - ${data.city}`;
        document.body.appendChild(successDiv);
        setTimeout(() => {
          document.body.removeChild(successDiv);
        }, 3000);
      } else {
        alert(`❌ Sorry, pincode ${pincode} is not in our delivery area.\n\n📍 We currently deliver only in Bhubaneswar (751001 - 751100).\n\n💡 Please check your pincode or contact us for assistance.`);
      }
    } catch (error) {
      console.error('Error checking pincode:', error);
      alert('⚠️ Error checking pincode. Please check your internet connection and try again.');
    }
  };

  return (
    <header style={{ backgroundColor: '#5F9EA0' }}>
      {/* Top Bar */}
      <div className="border-b border-white/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Delivery Location */}
            <button
              className="hidden md:flex items-center text-sm text-white hover:text-yellow-200 transition-colors"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center mr-1">
                  <FiMapPin className="text-yellow-300" />
                </div>
                <span>Deliver To {location}</span>
                <FiEdit2 className="ml-1 text-white/70" size={14} />
              </div>
            </button>

            {/* Search Bar */}
            <div className="hidden md:block flex-grow max-w-xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your gifts"
                  className="w-full border border-white/30 rounded-md py-2 px-4 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/track-order" className="hidden md:flex flex-col items-center text-xs text-white hover:text-yellow-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Track Order</span>
              </Link>

              <Link href="/gift-finder" className="hidden md:flex flex-col items-center text-xs text-white hover:text-yellow-200">
                <FaGift className="h-6 w-6" />
                <span>Gift Finder</span>
              </Link>

              <Link href="/cart" className="flex flex-col items-center text-xs text-white hover:text-yellow-200 relative">
                <FaShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span>Cart</span>
              </Link>

              {isAuthenticated ? (
                <Link href="/account" className="flex flex-col items-center text-xs text-white hover:text-yellow-200">
                  <FaUser className="h-6 w-6" />
                  <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex flex-col items-center text-xs text-white hover:text-yellow-200"
                >
                  <FaUser className="h-6 w-6" />
                  <span>Sign In</span>
                </button>
              )}

              {/* More Menu (Three Dots) */}
              <div className="hidden md:block relative" ref={moreMenuRef}>
                <button
                  className="flex flex-col items-center text-xs text-white hover:text-yellow-200"
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                >
                  <FiMoreVertical className="h-6 w-6" />
                  <span>More</span>
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/wishlist" className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <FiHeart className="mr-2" />
                        Wishlist
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link href="/contact" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiPhone className="mr-2" />
                      Contact Us
                    </Link>
                    <Link href="/help" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiHelpCircle className="mr-2" />
                      Help & FAQs
                    </Link>
                    {isAuthenticated && (
                      <>
                        <hr className="my-1" />
                        <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Orders
                        </Link>
                        <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaUser className="mr-2" />
                          My Account
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsMoreMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiEdit2 className="mr-2" />
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button className="md:hidden text-white hover:text-yellow-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation - Limited to 10 */}
      <div className="bg-white border-b">
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
      <div className="md:hidden bg-white px-4 py-2 border-b">
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
          <div className="px-4 py-2 border-b" style={{ backgroundColor: '#5F9EA0' }}>
            <button
              className="flex items-center text-sm text-white hover:text-yellow-200 transition-colors"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <FiMapPin className="mr-2 text-yellow-300" />
              <span>Deliver To {location}</span>
              <FiEdit2 className="ml-1 text-white/70" size={14} />
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
              {isAuthenticated ? (
                <>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                </>
              ) : (
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                >
                  Sign In
                </button>
              )}

              <Link
                href="/wishlist"
                className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
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

              {isAuthenticated && (
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </button>
              )}
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

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <FiMapPin className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Delivery Areas</span>
              </div>
              <p className="text-xs text-blue-700">
                We deliver to all areas in Bhubaneswar including:
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Central Bhubaneswar • IT Corridor • Airport Area • Industrial Areas • All Suburbs
              </p>
              <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                <strong>Supported Pincodes:</strong> 751001, 751002, 751003... (100+ pincodes)
                <br />
                <a
                  href="https://mispri24.vercel.app/delivery-areas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View all supported pincodes →
                </a>
              </div>
            </div>

            <form onSubmit={handleLocationSubmit}>
              <div className="mb-4">
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Your Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  placeholder="e.g., 751001"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={pincode}
                  onChange={handlePincodeChange}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  📍 All Bhubaneswar pincodes (751001 - 751100) are supported
                </p>
              </div>

              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-800">Free delivery on orders above ₹500</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Check Delivery
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
