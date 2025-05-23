export default function CancellationRefundPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Cancellation & Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="mb-6">
            At Mispri, we strive to provide the best products and services to our customers. We understand that sometimes you may need to cancel an order or request a refund. This policy outlines our guidelines for cancellations and refunds.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Order Cancellation</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Cancellation Timeframe</h3>
          <p className="mb-4">
            Orders can be cancelled up to 24 hours before the scheduled delivery time without any cancellation charges. For cancellations made within 24 hours of the scheduled delivery time, the following conditions apply:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>12-24 hours before delivery: 25% cancellation fee</li>
            <li>6-12 hours before delivery: 50% cancellation fee</li>
            <li>Less than 6 hours before delivery: 75% cancellation fee</li>
            <li>After the order has been dispatched: No cancellation possible</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">How to Cancel an Order</h3>
          <p className="mb-4">
            To cancel an order, you can:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Log in to your account and cancel the order from the "My Orders" section</li>
            <li>Contact our customer service team at +91 9876543210</li>
            <li>Email us at support@mispri.com with your order number and cancellation request</li>
          </ul>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">
              <strong>Note:</strong> For same-day delivery orders, cancellation may not be possible once the order preparation has begun.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Refund Policy</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Refund Eligibility</h3>
          <p className="mb-4">
            Refunds are provided in the following cases:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Order cancellation (as per the cancellation policy)</li>
            <li>Product quality issues (reported within 24 hours of delivery)</li>
            <li>Incorrect or incomplete delivery</li>
            <li>Significant delay in delivery (more than 2 hours from the promised time)</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Non-Refundable Items</h3>
          <p className="mb-4">
            The following items are non-refundable:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Perishable items like cakes and flowers after 24 hours of delivery</li>
            <li>Customized products (unless there's a quality issue)</li>
            <li>Gift cards and vouchers</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Refund Process</h3>
          <p className="mb-4">
            Once your refund request is approved, the refund will be processed as follows:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>For online payments: Refund to the original payment method within 5-7 business days</li>
            <li>For Cash on Delivery: Bank transfer or store credit (as per your preference)</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">How to Request a Refund</h3>
          <p className="mb-4">
            To request a refund, please:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Contact our customer service team at +91 9876543210</li>
            <li>Email us at support@mispri.com with your order number and refund request details</li>
            <li>For quality issues, please include photos of the received product</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Special Circumstances</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Force Majeure</h3>
          <p className="mb-4">
            In case of events beyond our control (natural disasters, severe weather conditions, civil unrest, etc.), delivery may be delayed or cancelled. In such cases, we will provide a full refund or reschedule the delivery as per your preference.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Delivery Failures</h3>
          <p className="mb-4">
            If a delivery fails due to:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Incorrect address provided by the customer: Redelivery will incur additional charges</li>
            <li>Recipient not available: We will attempt to contact the recipient and reschedule delivery</li>
            <li>Inaccessible location: We will contact you to arrange an alternative delivery method</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our Cancellation & Refund Policy, please contact us:
          </p>
          <p className="mb-8">
            Email: support@mispri.com<br />
            Phone: +91 9876543210
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm my-8">
            <p className="text-sm text-gray-600">
              Last updated: June 1, 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
