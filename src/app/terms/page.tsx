import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary-100">Terms and Conditions – Mispri Foods</h1>
        
        <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
          <div className="prose prose-lg max-w-none">
            <p className="text-primary-200 mb-6">
              Welcome to Mispri Foods. These Terms and Conditions govern your use of our website, products, and services. By accessing or purchasing from our website, you agree to comply with these terms.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">General Terms</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>By placing an order, you confirm that you are at least 18 years old or have parental permission.</li>
              <li>All products are subject to availability. We reserve the right to modify or discontinue items at any time.</li>
              <li>Prices, discounts, and promotions are subject to change without prior notice.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Orders & Payments</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>Orders must be placed through our website, WhatsApp, or in-store.</li>
              <li>Full payment is required at the time of purchase (via credit/debit cards, UPI, or net banking).</li>
              <li>We are not responsible for payment failures due to incorrect details or technical issues.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Shipping & Delivery</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>We offer home delivery within your pin code area and pickup options.</li>
              <li>Delivery times are estimated and may vary due to traffic, weather, or unforeseen delays.</li>
              <li>The customer must provide the correct address and contact details to avoid delivery failures.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Cancellation & Refund Policy</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>Orders can be cancelled within 12 hours of placement for a full refund.</li>
              <li>Custom cakes and bulk orders cannot be cancelled once preparation has begun.</li>
              <li>Refunds are only provided for wrong, damaged, or undelivered products. (Refer to our Refund Policy for details.)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Quality & Food Safety</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>All our products are freshly baked and made with high-quality ingredients.</li>
              <li>Cakes and pastries should be stored as per the recommended storage instructions to maintain freshness.</li>
              <li>We are not responsible for issues arising from improper storage after delivery.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Customer Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>Customers must check their order upon delivery and report any issues within 1 hours.</li>
              <li>We are not liable for errors due to incorrect order details provided by the customer.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Intellectual Property</h2>
            <p className="text-primary-200 mb-6">
              All website content, including images, logos, and designs, is owned by Mispri Foods and cannot be used without permission.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Privacy Policy</h2>
            <p className="text-primary-200 mb-6">
              By using our website, you agree to our Privacy Policy regarding data collection and usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
