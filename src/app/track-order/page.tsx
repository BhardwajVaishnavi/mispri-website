'use client';

import { useState } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';

// Mock order tracking data
const mockOrderData = {
  orderNumber: 'ORD123456',
  orderDate: '2023-05-15',
  status: 'In Transit',
  estimatedDelivery: '2023-05-18',
  trackingNumber: 'TRK789012345',
  items: [
    { name: 'Red Rose Bouquet', quantity: 1, price: 799 },
    { name: 'Chocolate Truffle Cake', quantity: 1, price: 899 },
  ],
  shippingAddress: {
    name: 'John Doe',
    street: '123 Main Street',
    city: 'Bhubaneswar',
    state: 'Odisha',
    postalCode: '751001',
    country: 'India',
  },
  trackingHistory: [
    { status: 'Order Placed', date: '2023-05-15 10:30 AM', description: 'Your order has been placed successfully.' },
    { status: 'Order Processed', date: '2023-05-15 02:45 PM', description: 'Your order has been processed and is being prepared for shipping.' },
    { status: 'Order Shipped', date: '2023-05-16 11:20 AM', description: 'Your order has been shipped and is on its way to you.' },
    { status: 'In Transit', date: '2023-05-17 09:15 AM', description: 'Your order is in transit and will be delivered soon.' },
  ],
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<typeof mockOrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (orderNumber === 'ORD123456') {
        setOrderData(mockOrderData);
      } else {
        setError('Order not found. Please check your order number and email.');
      }
    } catch (err) {
      setError('An error occurred while tracking your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

      {!orderData ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-6">
            Enter your order number and email address to track your order.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. ORD123456"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold">Order #{orderData.orderNumber}</h2>
              <p className="text-gray-600">Placed on {orderData.orderDate}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <FiClock className="mr-1" /> {orderData.status}
              </span>
              <p className="text-gray-600 text-sm mt-1">
                Estimated Delivery: {orderData.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Tracking Progress */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Tracking Progress</h3>
            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>
              <div className="space-y-8">
                {orderData.trackingHistory.map((step, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className={`absolute left-5 -ml-3 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                      index === orderData.trackingHistory.length - 1 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-green-500 bg-green-50'
                    }`}>
                      {index === orderData.trackingHistory.length - 1 ? (
                        <FiClock className="text-primary-500 h-3 w-3" />
                      ) : (
                        <FiCheckCircle className="text-green-500 h-3 w-3" />
                      )}
                    </div>
                    <div className="ml-10">
                      <h4 className="font-medium">{step.status}</h4>
                      <p className="text-sm text-gray-500">{step.date}</p>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Tracking Number: {orderData.trackingNumber}</p>
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-2">Items</h4>
                  <ul className="space-y-2">
                    {orderData.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{item.quantity} x {item.name}</span>
                        <span>₹{item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t mt-3 pt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{orderData.shippingAddress.name}</p>
                <p className="text-sm text-gray-600">{orderData.shippingAddress.street}</p>
                <p className="text-sm text-gray-600">
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600">{orderData.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
