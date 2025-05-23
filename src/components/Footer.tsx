import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaYoutube, FaPinterest, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white pt-8 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Links */}
        <div className="bg-gray-100 py-8 px-8 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/about-us" className="text-gray-700 hover:text-primary-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/coupons-deals" className="text-gray-700 hover:text-primary-600">
                    Coupons & Deals
                  </Link>
                </li>
                <li>
                  <Link href="/cancellation-refund" className="text-gray-700 hover:text-primary-600">
                    Cancellation & Refund
                  </Link>
                </li>
                <li>
                  <Link href="/terms-conditions" className="text-gray-700 hover:text-primary-600">
                    Terms and Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/media" className="text-gray-700 hover:text-primary-600">
                    Media
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-700 hover:text-primary-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-gray-700 hover:text-primary-600">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-700 hover:text-primary-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="text-gray-700 hover:text-primary-600">
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link href="/quotes" className="text-gray-700 hover:text-primary-600">
                    Quotes
                  </Link>
                </li>
                <li>
                  <Link href="/corporate-gifts" className="text-gray-700 hover:text-primary-600">
                    Corporate Gifts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-700 hover:text-primary-600">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-gray-700 hover:text-primary-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="https://wa.me/919876543210" className="text-gray-700 hover:text-primary-600">
                    WhatsApp
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-gray-100 py-6 px-8 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-700 mb-4 md:mb-0">Spread The Love On Social Media</p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-2 rounded-full hover:opacity-90">
                <FaFacebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-black text-white p-2 rounded-full hover:opacity-90">
                <FaTwitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white p-2 rounded-full hover:opacity-90">
                <FaYoutube size={18} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="bg-red-500 text-white p-2 rounded-full hover:opacity-90">
                <FaPinterest size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-pink-600 text-white p-2 rounded-full hover:opacity-90">
                <FaInstagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white p-2 rounded-full hover:opacity-90">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Logo and Copyright */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <Image src="/images/logo.svg" alt="Mispri" width={120} height={40} />
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            <p>© 2023 Mispri. All rights reserved by Wipster Technologies Private Limited</p>
          </div>
        </div>

        {/* Floating Buttons */}
        <div>
          {/* Back to top button */}
          <a
            href="#top"
            className="fixed bottom-20 right-4 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition-colors"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </a>
          {/* WhatsApp button */}
          <a
            href="https://wa.me/919876543210"
            className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
            aria-label="Contact on WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
