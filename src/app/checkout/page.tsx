'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiCreditCard, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { getAllCityNames, isValidOdishaPostalCode, getCityByPostalCode } from '@/data/odisha-cities';
import CouponSection from '@/components/cart/CouponSection';

function CheckoutContent() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderComplete, setOrderComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [buyNowLoaded, setBuyNowLoaded] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
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

  const [postalCodeError, setPostalCodeError] = useState('');

  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle Buy Now functionality
  useEffect(() => {
    const isBuyNow = searchParams.get('buyNow') === 'true';
    if (isBuyNow) {
      const storedItem = localStorage.getItem('buyNowItem');
      if (storedItem) {
        try {
          const item = JSON.parse(storedItem);
          setBuyNowItem(item);
          // Clear the stored item
          localStorage.removeItem('buyNowItem');
          console.log('✅ Buy Now item loaded:', item);
        } catch (error) {
          console.error('Error parsing buy now item:', error);
        }
      } else {
        console.log('⚠️ No buy now item found in localStorage');
      }
    }
    setBuyNowLoaded(true);
  }, [searchParams]);

  // Redirect if not authenticated (but wait for auth to load)
  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    // and we're not in a loading state
    if (isAuthenticated === false && user === null && buyNowLoaded) {
      console.log('🔒 User not authenticated, redirecting to home');
      router.push('/');
    }
  }, [isAuthenticated, user, buyNowLoaded, router]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Calculate totals - handle both cart items and buy now item
  const currentItems = buyNowItem ? [buyNowItem] : cartItems;
  const subtotal = currentItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 1000 ? 0 : 100;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = subtotal + shipping - discountAmount;

  // Coupon handlers
  const handleCouponApplied = (couponData: any) => {
    setAppliedCoupon(couponData);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
  };

  // Redirect if cart is empty and not buy now (but wait for everything to load)
  useEffect(() => {
    // Only redirect if we're sure there are no items and buy now has been processed
    if (buyNowLoaded && !buyNowItem && cartItems.length === 0 && !orderComplete && isAuthenticated) {
      console.log('🛒 No items found, redirecting to cart');
      router.push('/cart');
    }
  }, [buyNowItem, cartItems.length, orderComplete, buyNowLoaded, isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validate postal code for Odisha
    if (name === 'postalCode') {
      if (value && !isValidOdishaPostalCode(value)) {
        setPostalCodeError('Please enter a valid Odisha postal code');
      } else {
        setPostalCodeError('');

        // Auto-fill city if postal code is valid
        if (value) {
          const city = getCityByPostalCode(value);
          if (city) {
            setFormData(prev => ({ ...prev, [name]: value, city: city.name }));
            return;
          }
        }
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate postal code before proceeding to step 2
      if (postalCodeError) {
        alert('Please enter a valid Odisha postal code before proceeding.');
        return;
      }
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      // Final validation before order submission
      if (postalCodeError) {
        alert('Please enter a valid Odisha postal code before placing the order.');
        return;
      }

      setIsSubmitting(true);

      try {
        // Debug authentication
        console.log('🔍 Checkout Debug Info:');
        console.log('- User:', user);
        console.log('- User ID:', user?.id);
        console.log('- User ID type:', typeof user?.id);
        console.log('- User ID length:', user?.id?.length);
        console.log('- User email:', user?.email);
        console.log('- Is Authenticated:', isAuthenticated);
        console.log('- Cart Items:', cartItems);

        if (!user?.id || user.id.trim() === '') {
          console.error('❌ Invalid user ID:', user?.id);
          throw new Error('User authentication error. Please log out and log in again.');
        }

        if (!user?.email || user.email.trim() === '') {
          console.error('❌ Invalid user email:', user?.email);
          throw new Error('User email missing. Please log out and log in again.');
        }

        if (!currentItems || currentItems.length === 0) {
          throw new Error('No items to checkout. Please add items to your cart or try again.');
        }

        // Validate required form fields
        const requiredFields = ['firstName', 'address', 'city', 'state', 'postalCode', 'phone'];
        const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');

        if (missingFields.length > 0) {
          throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        }

        // Create order
        const orderData = {
          userId: user.id,
          items: currentItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            variantId: item.variantId,
            weight: item.weight,
            customName: item.customName,
          })),
          shippingAddress: {
            street: formData.address || '',
            city: formData.city || '',
            state: formData.state || '',
            pincode: formData.postalCode || '',
            country: formData.country || 'India',
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            phone: formData.phone || '',
            email: user.email || '', // Include user email for user lookup
          },
          paymentMethod: paymentMethod.toUpperCase(),
          totalAmount: total,
          subtotal: subtotal,
          shipping: shipping,
          discountAmount: discountAmount,
          couponCode: appliedCoupon?.coupon?.code || null,
          couponId: appliedCoupon?.coupon?.id || null,
        };

        console.log('📦 Order Data:', orderData);
        console.log('🔍 Order data validation:');
        console.log('- User object:', user);
        console.log('- User ID:', orderData.userId);
        console.log('- User ID type:', typeof orderData.userId);
        console.log('- User ID length:', orderData.userId?.length);
        console.log('- Items count:', orderData.items?.length);
        console.log('- Items details:', orderData.items);
        console.log('- Shipping address:', orderData.shippingAddress);

        const response = await fetch('/api/customer-orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        console.log('📡 API Response Status:', response.status);

        if (response.ok) {
          const order = await response.json();
          console.log('✅ Order Created Successfully:', order);

          const orderNum = order.orderNumber || order.id;
          setOrderNumber(orderNum);

          // Only clear cart if it's not a buy now purchase
          if (!buyNowItem) {
            clearCart();
          }

          // Redirect to order success page
          router.push(`/order-success?orderNumber=${orderNum}`);
        } else {
          const errorText = await response.text();
          console.error('❌ API Error Response:', errorText);

          let errorMessage = 'Failed to create order';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }

          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('Order creation error:', error);
        alert(`Failed to place order: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-primary-600 mb-6">
            <FiCheckCircle size={64} className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            We have sent a confirmation email with your order details.
          </p>
          <p className="text-gray-800 font-medium mb-8">
            Order Number: #{orderNumber || 'Processing...'}
          </p>
          <Link
            href="/"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
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
                      First Name
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
                      Last Name
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
                    Email Address
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
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
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select City</option>
                      {getAllCityNames().map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value="Odisha"
                      readOnly
                      className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code (Odisha only)
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        postalCodeError
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-primary-500'
                      }`}
                      placeholder="e.g., 751001"
                      required
                    />
                    {postalCodeError && (
                      <p className="text-red-500 text-sm mt-1">{postalCodeError}</p>
                    )}
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value="India"
                    readOnly
                    className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                    required
                  />
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
                      UPI
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
                  <div className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="nameOnCard"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="mb-6">
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="yourname@upi"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          {/* Coupon Section */}
          {isAuthenticated && user?.id && (
            <div className="mb-6">
              <CouponSection
                customerId={user.id}
                orderAmount={subtotal}
                onCouponApplied={handleCouponApplied}
                onCouponRemoved={handleCouponRemoved}
                appliedCoupon={appliedCoupon}
              />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="divide-y">
              {currentItems.map((item) => (
                <div key={item.id} className="py-3 flex">
                  <div className="h-16 w-16 relative flex-shrink-0 mr-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                    <div className="absolute -top-2 -right-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{item.name}</p>
                    {item.customName && (
                      <p className="text-orange-600 text-sm font-medium">🎂 Name: "{item.customName}"</p>
                    )}
                    <p className="text-gray-600 text-sm">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800 font-medium">
                  {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Discount ({appliedCoupon.coupon.code})</span>
                  <span className="text-green-600 font-medium">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-800 font-semibold">Total</span>
                <span className="text-primary-600 font-bold">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
