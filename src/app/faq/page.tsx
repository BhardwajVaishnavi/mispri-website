'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// FAQ data
const faqCategories = [
  {
    name: 'Orders & Delivery',
    faqs: [
      {
        question: 'How do I place an order?',
        answer: 'You can place an order through our website by browsing our products, selecting the items you want, and proceeding to checkout. You can also place orders via phone at +91 9876543210.'
      },
      {
        question: 'What are your delivery hours?',
        answer: 'We deliver from 9 AM to 9 PM every day. For specific time slot deliveries, please select your preferred time during checkout.'
      },
      {
        question: 'Do you offer same-day delivery?',
        answer: 'Yes, we offer same-day delivery for orders placed before 4 PM. Orders placed after 4 PM will be delivered the next day or on your selected date.'
      },
      {
        question: 'Which areas do you deliver to?',
        answer: 'We currently deliver to all areas within Bhubaneswar. You can check if we deliver to your location by entering your pincode on our website.'
      },
      {
        question: 'Is there a delivery charge?',
        answer: 'Delivery is free for orders above ₹500. For orders below ₹500, a delivery charge of ₹50 is applicable.'
      }
    ]
  },
  {
    name: 'Products & Customization',
    faqs: [
      {
        question: 'Can I customize my cake?',
        answer: 'Yes, we offer customization options for cakes. You can specify your requirements in the "Special Instructions" section during checkout or contact our customer service for more complex customizations.'
      },
      {
        question: 'Are your cakes eggless?',
        answer: 'We offer both egg and eggless cake options. You can select your preference when ordering.'
      },
      {
        question: 'Do you offer vegan options?',
        answer: 'Yes, we have a range of vegan cakes and treats. Look for the "Vegan" tag on our products or filter by "Vegan" in our product categories.'
      },
      {
        question: 'How long do your flowers stay fresh?',
        answer: 'Our flowers typically stay fresh for 3-5 days with proper care. We provide care instructions with each flower delivery.'
      },
      {
        question: 'Can I add a personalized message with my gift?',
        answer: 'Absolutely! You can add a personalized message during checkout, and we will include a beautifully printed message card with your gift.'
      }
    ]
  },
  {
    name: 'Payments & Refunds',
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards, UPI, net banking, and cash on delivery.'
      },
      {
        question: 'Is online payment secure?',
        answer: 'Yes, all our online payments are processed through secure payment gateways with industry-standard encryption.'
      },
      {
        question: 'Can I cancel my order?',
        answer: 'Orders can be cancelled up to 24 hours before the scheduled delivery time. For cancellations made after this time, we reserve the right to charge a cancellation fee.'
      },
      {
        question: 'What is your refund policy?',
        answer: 'If you are not satisfied with our products, please contact us within 24 hours of delivery. Refunds are processed according to our Cancellation & Refund Policy.'
      },
      {
        question: 'How long does it take to process a refund?',
        answer: 'Refunds are typically processed within 5-7 business days, depending on your payment method and bank.'
      }
    ]
  },
  {
    name: 'Account & Orders',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'You can create an account by clicking on the "Sign In" button at the top of the page and selecting "Create Account". You can also create an account during checkout.'
      },
      {
        question: 'How can I track my order?',
        answer: 'You can track your order by logging into your account and visiting the "My Orders" section. You will also receive tracking updates via email and SMS.'
      },
      {
        question: 'Can I modify my order after placing it?',
        answer: 'Minor modifications can be made to your order up to 24 hours before the scheduled delivery time. Please contact our customer service for assistance.'
      },
      {
        question: 'How do I view my order history?',
        answer: 'You can view your order history by logging into your account and visiting the "My Orders" section.'
      },
      {
        question: 'Can I save my delivery address for future orders?',
        answer: 'Yes, you can save multiple delivery addresses in your account for easy selection during checkout.'
      }
    ]
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter((i) => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        
        <p className="text-center text-gray-600 mb-12">
          Find answers to common questions about our products, services, and policies.
        </p>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {faqCategories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 m-1 rounded-full text-sm font-medium transition-colors ${
                activeCategory === index
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => {
                setActiveCategory(index);
                setExpandedFaqs([]);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* FAQ Accordion */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {faqCategories[activeCategory].faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedFaqs.includes(index) ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </button>
              {expandedFaqs.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Contact Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer to your question, please feel free to contact our customer support team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contact-us"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Contact Us
            </a>
            <a
              href="https://wa.me/919876543210"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
