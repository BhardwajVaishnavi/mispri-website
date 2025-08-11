'use client';

import { useState } from 'react';
import { FiTag, FiCheck, FiX, FiPercent, FiDollarSign } from 'react-icons/fi';

interface CouponSectionProps {
  customerId: string;
  orderAmount: number;
  onCouponApplied: (couponData: any) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: any;
}

export default function CouponSection({ 
  customerId, 
  orderAmount, 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon 
}: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  const validateCoupon = async (code: string) => {
    if (!code.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: code,
          customerId,
          orderAmount,
        }),
      });

      const result = await response.json();

      if (result.valid) {
        onCouponApplied(result);
        setCouponCode('');
        setError('');
      } else {
        setError(result.error || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setError('Failed to validate coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    validateCoupon(couponCode);
  };

  const handleRemoveCoupon = () => {
    onCouponRemoved();
    setCouponCode('');
    setError('');
  };

  const fetchAvailableCoupons = async () => {
    try {
      const response = await fetch(`/api/coupons/customer/${customerId}`);
      if (response.ok) {
        const coupons = await response.json();
        setAvailableCoupons(coupons);
        setShowAvailableCoupons(true);
      }
    } catch (error) {
      console.error('Error fetching available coupons:', error);
    }
  };

  const applyCouponFromList = (coupon: any) => {
    setCouponCode(coupon.code);
    setShowAvailableCoupons(false);
    validateCoupon(coupon.code);
  };

  const getDiscountDisplay = (coupon: any) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `₹${coupon.discountValue} OFF`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <FiTag className="w-5 h-5 text-green-600" />
        <h3 className="font-medium text-gray-900">Apply Coupon</h3>
      </div>

      {appliedCoupon ? (
        // Applied Coupon Display
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <FiCheck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-green-900">{appliedCoupon.coupon.code}</span>
                  <span className="text-sm text-green-700">
                    {appliedCoupon.coupon.discountType === 'PERCENTAGE' ? (
                      <span className="flex items-center gap-1">
                        <FiPercent className="w-3 h-3" />
                        {appliedCoupon.coupon.discountValue}% OFF
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <FiDollarSign className="w-3 h-3" />
                        ₹{appliedCoupon.coupon.discountValue} OFF
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  You saved ₹{appliedCoupon.discountAmount}
                </p>
                {appliedCoupon.coupon.name && (
                  <p className="text-xs text-green-600">{appliedCoupon.coupon.name}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-600 hover:text-green-700 p-1"
              title="Remove coupon"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Coupon Input
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={loading || !couponCode.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Apply'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Available Coupons Button */}
          <div className="text-center">
            <button
              onClick={fetchAvailableCoupons}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              View available coupons
            </button>
          </div>

          {/* Available Coupons Modal */}
          {showAvailableCoupons && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Available Coupons</h3>
                  <button
                    onClick={() => setShowAvailableCoupons(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto">
                  {availableCoupons.length === 0 ? (
                    <div className="text-center py-8">
                      <FiTag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No coupons available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {availableCoupons.map((coupon: any) => (
                        <div
                          key={coupon.id}
                          className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => applyCouponFromList(coupon)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{coupon.code}</span>
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {getDiscountDisplay(coupon)}
                                </span>
                              </div>
                              {coupon.name && (
                                <p className="text-sm text-gray-600 mt-1">{coupon.name}</p>
                              )}
                              {coupon.minimumAmount && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Min order: ₹{coupon.minimumAmount}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAvailableCoupons(false)}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
