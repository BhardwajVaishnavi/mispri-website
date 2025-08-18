'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaYoutube, FaPinterest, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';

export default function Footer() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <footer className="bg-dark-800 pt-2 pb-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Links */}
        <div className="bg-dark-700 border border-primary-200/20 py-1 sm:py-2 px-8 sm:px-12 lg:px-16 rounded-lg mb-1">
          {/* Mobile: Compact 2-column grid */}
          <div className="grid grid-cols-2 sm:hidden gap-4">
            {/* Mobile Column 1 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/about-us" className="text-xs text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-xs text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-xs text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-xs text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Column 2 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-xs text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-xs text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="text-xs text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/care-instructions" className="text-xs text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                    Care Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Tablet & Desktop: Full layout */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Column 1 - Company Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary-100 mb-3 lg:mb-4 transition-all duration-300 hover:text-primary-400 hover:translate-x-1">Company</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link href="/about-us" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    About Us
                  </Link>
                </li>

                <li>
                  <Link href="/refund-policy" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Cancellation & Refund
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
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
              <h3 className="text-sm font-semibold text-primary-100 mb-3 lg:mb-4">Services</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link href="/help" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Help & FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/care-instructions" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Care Instructions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Contact Us
                  </Link>
                </li>

              </ul>
            </div>

            {/* Column 3 - Support */}
            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-semibold text-primary-100 mb-3 lg:mb-4">Support</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link href="/help" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-primary-200 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 hover:font-semibold">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="https://wa.me/919938938780" className="text-sm text-primary-200 hover:text-primary-400 transition-colors">
                    WhatsApp Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-dark-700 border border-primary-200/20 py-1 px-8 sm:px-12 lg:px-16 rounded-lg mb-1">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-primary-200 mb-1 transition-all duration-300 hover:text-primary-400 hover:font-semibold cursor-default">
              Follow Us On Social Media
            </p>
            <div className="flex justify-center gap-2 sm:gap-3">
              <a
                href="https://www.facebook.com/Misprithecakeshop/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </a>
              <a
                href="https://www.instagram.com/mispri_cakeshop/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 text-white p-1.5 sm:p-2 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:-rotate-12"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </a>
              <a
                href="https://www.youtube.com/@mispricakeshop"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white p-1.5 sm:p-2 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                aria-label="Subscribe to our YouTube channel"
              >
                <FaYoutube size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
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
            <p className="text-xs text-primary-200 leading-tight px-2">
              © 2025 Mispri. All rights reserved by{' '}
              <a
                href="https://www.wipstertechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 font-semibold transition-all duration-300 hover:underline"
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
              <p className="text-sm text-primary-200 leading-tight">
                © 2025 Mispri. All rights reserved by{' '}
                <a
                  href="https://www.wipstertechnologies.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 font-semibold transition-all duration-300 hover:underline"
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
            className="bg-primary-600 text-white p-2.5 sm:p-3 rounded-full shadow-lg transition-colors hover:bg-primary-700"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </a>
          {/* WhatsApp button */}
          <a
            href="https://wa.me/919938938780"
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
