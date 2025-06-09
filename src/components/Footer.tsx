'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaYoutube, FaPinterest, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';

export default function Footer() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <footer style={{ backgroundColor: '#5F9EA0' }} className="pt-2 pb-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Links */}
        <div className="bg-white py-1 sm:py-2 px-8 sm:px-12 lg:px-16 rounded-lg mb-1">
          {/* Mobile: Compact 2-column grid */}
          <div className="grid grid-cols-2 sm:hidden gap-4">
            {/* Mobile Column 1 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/pages/about-us" className="text-xs text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/pages/coupons-deals" className="text-xs text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Coupons & Deals
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-xs text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-xs text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/delivery-areas" className="text-xs text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Delivery Areas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Column 2 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/pages/media" className="text-xs text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Media
                  </Link>
                </li>
                <li>
                  <Link href="/pages/privacy-policy" className="text-xs text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/pages/reviews" className="text-xs text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/pages/blog" className="text-xs text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Tablet & Desktop: Full layout */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Column 1 - Company Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 lg:mb-4 transition-all duration-300 hover:text-primary-600 hover:translate-x-1">Company</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link href="/pages/about-us" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/pages/coupons-deals" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Coupons & Deals
                  </Link>
                </li>
                <li>
                  <Link href="/pages/cancellation-refund" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Cancellation & Refund
                  </Link>
                </li>
                <li>
                  <Link href="/pages/terms-conditions" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Terms and Conditions
                  </Link>
                </li>
              </ul>

              {/* Logo below Terms and Conditions */}
              <div className="mt-4">
                <Link href="/" className="inline-block" style={{ marginRight: '164px', height: '65px', width: '196px' }}>
                  <Image
                    src="/images/LOGO.png"
                    alt="Mispri"
                    width={196}
                    height={65}
                    style={{ width: '196px', height: '65px' }}
                  />
                </Link>
              </div>
            </div>

            {/* Column 2 - Services */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 lg:mb-4">Services</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link href="/pages/media" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Media
                  </Link>
                </li>
                <li>
                  <Link href="/pages/privacy-policy" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/pages/reviews" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/pages/blog" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/pages/sitemap" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link href="/pages/quotes" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Quotes
                  </Link>
                </li>
                <li className="hidden lg:block">
                  <Link href="/pages/corporate-gifts" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Corporate Gifts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Support */}
            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 lg:mb-4">Support</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link href="/pages/faq" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/pages/contact-us" className="text-sm text-gray-700 hover:text-primary-600 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="https://wa.me/919876543210" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    WhatsApp Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white py-1 px-8 sm:px-12 lg:px-16 rounded-lg mb-1">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-700 mb-1 transition-all duration-300 hover:text-primary-600 hover:font-semibold cursor-default">
              Follow Us On Social Media
            </p>
            <div className="flex justify-center gap-2 sm:gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white p-1.5 sm:p-2 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:-rotate-12"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white p-1.5 sm:p-2 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                aria-label="Subscribe to our YouTube channel"
              >
                <FaYoutube size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 text-white p-1.5 sm:p-2 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:-rotate-12"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 text-white p-1.5 sm:p-2 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                aria-label="Connect with us on LinkedIn"
              >
                <FaLinkedin size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Logo and Copyright */}
        <div className="pt-0.5">
          {/* Mobile: Centered layout */}
          <div className="text-center sm:hidden">
            <Link href="/" className="inline-block mb-0.5">
              <Image
                src="/images/LOGO.png"
                alt="Mispri"
                width={70}
                height={24}
              />
            </Link>
            <p className="text-xs text-white leading-tight px-2">
              © 2025 Mispri. All rights reserved by{' '}
              <a
                href="https://www.wipstertechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-200 font-semibold transition-all duration-300 hover:underline"
              >
                Wipster Technologies
              </a>
            </p>
          </div>

          {/* Tablet & Desktop: Side-by-side layout */}
          <div className="hidden sm:flex sm:flex-row justify-between items-center">
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/images/LOGO.png"
                  alt="Mispri"
                  width={100}
                  height={33}
                />
              </Link>
            </div>
            <div className="text-right">
              <p className="text-sm text-white leading-tight">
                © 2025 Mispri. All rights reserved by{' '}
                <a
                  href="https://www.wipstertechnologies.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-200 font-semibold transition-all duration-300 hover:underline"
                >
                  Wipster Technologies Private Limited
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Floating Buttons */}
        <div className="fixed bottom-4 right-4 flex flex-col space-y-3 z-50">
          {/* Back to top button */}
          <a
            href="#top"
            className="text-white p-2.5 sm:p-3 rounded-full shadow-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: '#5F9EA0' }}
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </a>
          {/* WhatsApp button */}
          <a
            href="https://wa.me/919876543210"
            className="bg-green-500 text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
            aria-label="Contact on WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
