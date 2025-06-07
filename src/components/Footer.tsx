import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaYoutube, FaPinterest, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white pt-6 sm:pt-8 pb-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Links */}
        <div className="bg-gray-100 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 rounded-lg mb-4 sm:mb-6 lg:mb-8">
          {/* Mobile: Compact 2-column grid */}
          <div className="grid grid-cols-2 sm:hidden gap-4">
            {/* Mobile Column 1 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/about-us" className="text-xs text-gray-700 hover:text-primary-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/coupons-deals" className="text-xs text-gray-700 hover:text-primary-600 transition-colors">
                    Coupons & Deals
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-xs text-gray-700 hover:text-primary-600 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-xs text-gray-700 hover:text-primary-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/delivery-areas" className="text-xs text-gray-700 hover:text-primary-600 transition-colors">
                    Delivery Areas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Column 2 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-xs text-gray-700 hover:text-primary-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-conditions" className="text-xs text-gray-700 hover:text-primary-600 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-xs text-gray-700 hover:text-primary-600 transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="https://wa.me/919876543210" className="text-xs text-gray-700 hover:text-primary-600 transition-colors">
                    WhatsApp Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Tablet & Desktop: Full layout */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Column 1 - Company Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 lg:mb-4">Company</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link href="/about-us" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/coupons-deals" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    Coupons & Deals
                  </Link>
                </li>
                <li>
                  <Link href="/cancellation-refund" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    Cancellation & Refund
                  </Link>
                </li>
                <li>
                  <Link href="/terms-conditions" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    Terms and Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 - Services */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 lg:mb-4">Services</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link href="/media" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    Media
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link href="/quotes" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    Quotes
                  </Link>
                </li>
                <li className="hidden lg:block">
                  <Link href="/corporate-gifts" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
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
                  <Link href="/faq" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
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
        <div className="bg-gray-100 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8 rounded-lg mb-4 sm:mb-6 lg:mb-8">
          <div className="text-center">
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-3 sm:mb-4">
              Follow Us On Social Media
            </p>
            <div className="flex justify-center gap-3 sm:gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-2 sm:p-2.5 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook size={14} className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white p-2 sm:p-2.5 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter size={14} className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white p-2 sm:p-2.5 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Subscribe to our YouTube channel"
              >
                <FaYoutube size={14} className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 text-white p-2 sm:p-2.5 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram size={14} className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 text-white p-2 sm:p-2.5 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Connect with us on LinkedIn"
              >
                <FaLinkedin size={14} className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
              </a>
            </div>
          </div>
        </div>

        {/* Logo and Copyright */}
        <div className="pt-3 sm:pt-4 lg:pt-6">
          {/* Mobile: Centered layout */}
          <div className="text-center sm:hidden">
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/images/LOGO.png"
                alt="Mispri"
                width={80}
                height={27}
              />
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed px-4">
              © 2025 Mispri. All rights reserved by{' '}
              <a
                href="https://www.wipstertechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 font-semibold transition-colors duration-300"
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
                  width={120}
                  height={40}
                />
              </Link>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 leading-relaxed">
                © 2025 Mispri. All rights reserved by{' '}
                <a
                  href="https://www.wipstertechnologies.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 font-semibold transition-colors duration-300"
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
            className="bg-teal-600 text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-teal-700 transition-colors"
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
