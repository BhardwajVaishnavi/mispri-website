import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary-100">Shipping Policy</h1>
        
        <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Normal Delivery</h2>
            <p className="text-primary-200 mb-6">
              All Order are delivered between 11 am till 6.30 pm in normal delivery time.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Fixed Delivery</h2>
            <p className="text-primary-200 mb-6">
              If customer requires the items to be delivered in fixe time then customer has to select the fixed time delivery in checkout, the order will be delivered in time. We request customer to take prior confirmation in written format before selecting the fixed time delivery.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Substitution Policy</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>If any product you have ordered is not available for delivery on your requested delivery date and delivery address, it may be substituted with next best available flavour, color, shape, size.</li>
              <li>If flowers are not available in requested delivery city then chocolates will be delivered instead of flowers.</li>
              <li>Any Festival/Occasion/Offer Deliveries may be done prior to the occasion to ensure guaranteed delivery.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Delivery Date Policy</h2>
            <p className="text-primary-200 mb-6">
              Delivery date is the tentative delivery date on which your product will arrive. In rare conditions there are chances that products might arrive early or later than requested delivery date in delivery address form.
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}
