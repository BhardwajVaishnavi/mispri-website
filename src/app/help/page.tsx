'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

// FAQ data
const faqs = [
  {
    question: "How can I place an order?",
    answer: "You can place an order through our website, www.MispriFoods.in & WhatsApp, or by calling us at 9938938780"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards, UPI, net banking, and cash on delivery (COD) for select locations."
  },
  {
    question: "Can I modify or cancel my order after placing it?",
    answer: "Orders can be modified or canceled within 10 hours of placing them. Custom cakes cannot be canceled once preparation begins."
  },
  {
    question: "Do you offer home delivery?",
    answer: "Yes, we provide home delivery in selected pin code areas. Delivery charges may apply."
  },
  {
    question: "How long does it take to deliver an order?",
    answer: "Standard orders are delivered within 4 hours/days. Custom cakes may take 1 days to prepare."
  },
  {
    question: "Can I pick up my order from your store?",
    answer: "Yes, you can choose the self-pickup option at checkout."
  },
  {
    question: "Do you make customized cakes?",
    answer: "Yes! We specialize in custom cakes. You can share your design ideas via WhatsApp or email."
  },
  {
    question: "Do you offer eggless or sugar-free cakes?",
    answer: "Yes, all our cakes are eggless and sugar-free options are available. Please mention your preference while ordering."
  },
  {
    question: "How should I store my cake after delivery?",
    answer: "Place it in an airtight container and refrigerate it if it contains fillings like cream cheese or whipped cream that need to be kept cold."
  },
  {
    question: "What if I receive a damaged or incorrect order?",
    answer: "Please contact us within 30 min. with a photo of the issue, and we will replace or refund your order as per our policy."
  },
  {
    question: "Do you offer refunds?",
    answer: "Refunds are issued only for damaged, incorrect, or undelivered orders. (Refer to our Refund Policy for more details.)"
  },
  {
    question: "Do you have any discounts or offers?",
    answer: "Yes! We run special discounts and loyalty programs. Follow us on Instagram and our whatsapp community for updates."
  },
  {
    question: "How can I stay updated about new products and promotions?",
    answer: "Subscribe to our newsletter or follow us on Facebook, Instagram, and WhatsApp for the latest updates."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us at: Email: contactus@MispriFoods.in, Phone: 9938938780, Address: Mangalpur, Pipili, Puri, Odisha"
  },
  {
    question: "What are your working hours?",
    answer: "We are open from 9.30 am to 9.30 pm all days."
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
    <div className="min-h-screen bg-dark-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary-100">Help & FAQs</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
              <h2 className="text-xl font-semibold mb-6 text-primary-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <button
                    className="flex justify-between items-center w-full text-left font-medium text-primary-100"
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    <span className="text-primary-400">
                      {expandedFaqs.includes(index) ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </button>
                  {expandedFaqs.includes(index) && (
                    <p className="mt-2 text-primary-300">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-dark-700 rounded-lg shadow-md p-6 mb-6 border border-primary-200/20">
            <h2 className="text-xl font-semibold mb-4 text-primary-100">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <FiPhone className="text-primary-400 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-primary-100">Phone</h3>
                  <p className="text-primary-300">9938938780</p>
                  <p className="text-sm text-primary-400">9.30 AM - 9.30 PM, All days</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMail className="text-primary-400 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-primary-100">Email</h3>
                  <p className="text-primary-300">contactus@mispri.in</p>
                  <p className="text-sm text-primary-400">We'll respond within 24 hours</p>
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


        </div>
        </div>
      </div>
    </div>
  );
}
