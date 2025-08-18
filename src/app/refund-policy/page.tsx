import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary-100">Cancellation and Refund Policy – Mispri</h1>
        
        <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
          <div className="prose prose-lg max-w-none">
            <p className="text-primary-200 mb-6">
              At Mispri Foods, we strive to provide fresh and high-quality baked goods for our customers. However, we understand that plans may change, and you may need to cancel or request a refund. Below are the details of our Cancellation and Refund Policy.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Order Cancellation Policy</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-primary-100">Cancellation by Customer</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>Orders can be cancelled within 12 hours of placing the order for a full refund.</li>
              <li>Custom cakes and bulk orders must be cancelled at least 12 hours/days in advance.</li>
              <li>Once an order is processed or prepared, it cannot be cancelled.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3 text-primary-100">Cancellation by Bakery</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>We reserve the right to cancel an order due to unforeseen circumstances (e.g., ingredient shortages, technical issues, or force majeure).</li>
              <li>In such cases, customers will receive a full refund or an option to reschedule their order.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Refund Policy</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-primary-100">Eligibility for Refunds</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>Wrong item delivered (different flavor, size, or design).</li>
              <li>Order not delivered within the promised time (except for delays due to unforeseen reasons).</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3 text-primary-100">Damage and Defective Products</h3>
            <p className="text-primary-200 mb-4">
              If any product received by you is damaged or defective, you can let us know the same.
            </p>
            <p className="text-primary-200 mb-4">
              You can call us this no 9938938780 (10:00 hours to 18:00 hours, 7 days a week) or send us an e-mail with the photographs of the same contactus@mispri.in, within 1 hours of receiving the product. We will either deliver to you the new product or refund the amount to you after investigation the same
            </p>
            <p className="text-primary-300 mb-6">
              <strong className="text-primary-100">Note:</strong> Customers must provide proof (photo/video) of the issue within 1 hours of receiving the product.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-primary-100">Non-Refundable Items</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>Custom cakes, personalized designs, and bulk orders are non-refundable once prepared.</li>
              <li>Orders canceled after preparation or dispatch will not be refunded.</li>
              <li>Change of mind or personal preference will not be considered for a refund.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Exchange Policy</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>If you receive a defective product, we may offer a replacement instead of a refund.</li>
              <li>Exchanges are only valid for the same item and must be reported within 8 hours of delivery.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">How to Request a Refund or Cancellation?</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>Contact our customer support team at contactus@mispri.in or 9938938780.</li>
              <li>Provide your order details and reason for cancellation or refund.</li>
              <li>Attach supporting photos/videos if applicable.</li>
              <li>Our team will review and respond within 2 hours/days.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
