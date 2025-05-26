'use client';

import { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';

interface CheckoutFormProps {
  onSubmit: (formData: any, paymentMethod: string) => Promise<void>;
  isSubmitting: boolean;
  step: number;
  onStepChange: (step: number) => void;
}

export default function CheckoutForm({ onSubmit, isSubmitting, step, onStepChange }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Odisha',
    postalCode: '',
    country: 'India',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      onStepChange(2);
      window.scrollTo(0, 0);
    } else {
      await onSubmit(formData, paymentMethod);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex mb-6">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <span className="ml-2 font-medium">Shipping</span>
        </div>
        <div className="mx-4 border-t border-gray-300 flex-1 self-center"></div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Bhubaneswar"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="Odisha">Odisha</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
              </select>
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="751001"
                pattern="[0-9]{6}"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          
          <div className="space-y-4 mb-6">
            <div className="border rounded-md p-4 flex items-center">
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="card" className="ml-3 flex items-center cursor-pointer">
                <FiCreditCard className="mr-2" />
                <span>Credit / Debit Card</span>
              </label>
            </div>
            
            <div className="border rounded-md p-4 flex items-center">
              <input
                type="radio"
                id="upi"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="upi" className="ml-3 cursor-pointer">
                UPI Payment
              </label>
            </div>
            
            <div className="border rounded-md p-4 flex items-center">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="cod" className="ml-3 cursor-pointer">
                Cash on Delivery
              </label>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Card payment integration will be available soon. 
                For now, please select Cash on Delivery or UPI.
              </p>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>UPI Payment:</strong> You will receive payment instructions after placing the order.
              </p>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Cash on Delivery:</strong> Pay when your order is delivered. 
                Additional charges may apply for COD orders.
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => onStepChange(1)}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Back to Shipping
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-2 px-6 rounded-md transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
