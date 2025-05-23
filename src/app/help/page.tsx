'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

// FAQ data
const faqs = [
  {
    question: 'How do I track my order?',
    answer: 'You can track your order by visiting the "Track Order" page and entering your order number and email address. Alternatively, you can find tracking information in the order confirmation email we sent you.',
  },
  {
    question: 'What is your delivery area?',
    answer: 'We currently deliver only in Bhubaneswar. You can check if we deliver to your area by entering your pincode on the website.',
  },
  {
    question: 'How can I cancel my order?',
    answer: 'You can cancel your order within 1 hour of placing it by contacting our customer service team. Please note that orders that have already been dispatched cannot be cancelled.',
  },
  {
    question: 'Do you offer same-day delivery?',
    answer: 'Yes, we offer same-day delivery for orders placed before 4 PM. Orders placed after 4 PM will be delivered the next day.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards, UPI, net banking, and cash on delivery.',
  },
  {
    question: 'How can I return a product?',
    answer: 'If you are not satisfied with your purchase, please contact our customer service team within 24 hours of delivery. Please note that perishable items like flowers and cakes cannot be returned.',
  },
  {
    question: 'Can I customize my order?',
    answer: 'Yes, we offer customization options for most of our products. You can add a personalized message, choose specific colors for flower arrangements, or request special decorations for cakes.',
  },
  {
    question: 'How do I redeem a coupon code?',
    answer: 'You can enter your coupon code in the designated field during checkout. The discount will be automatically applied to your order if the coupon is valid.',
  },
];

export default function HelpPage() {
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter((i) => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Help & FAQs</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <button
                    className="flex justify-between items-center w-full text-left font-medium"
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    {expandedFaqs.includes(index) ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedFaqs.includes(index) && (
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <FiPhone className="text-primary-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">+91 9876543210</p>
                  <p className="text-sm text-gray-500">Mon-Sat, 9 AM - 8 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMail className="text-primary-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">support@mispri.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMessageSquare className="text-primary-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-gray-600">Available on our website</p>
                  <p className="text-sm text-gray-500">Mon-Sat, 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/track-order" className="text-primary-600 hover:text-primary-800">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-600 hover:text-primary-800">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-600 hover:text-primary-800">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary-600 hover:text-primary-800">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary-600 hover:text-primary-800">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-primary-600 hover:text-primary-800">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
