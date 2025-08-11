'use client';

import { useState, useEffect } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';

interface OrderStatus {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

interface OrderTrackingProps {
  orderNumber: string;
  className?: string;
}

const statusSteps = [
  { key: 'PENDING', label: 'Order Placed', icon: FiClock },
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: FiCheckCircle },
  { key: 'PREPARING', label: 'Preparing', icon: FiPackage },
  { key: 'SHIPPED', label: 'Shipped', icon: FiTruck },
  { key: 'DELIVERED', label: 'Delivered', icon: FiCheckCircle },
];

export default function OrderTracking({ orderNumber, className = '' }: OrderTrackingProps) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderStatus();
  }, [orderNumber]);

  const fetchOrderStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching order status for:', orderNumber);

      // Fetch real order status from API
      const response = await fetch(`/api/orders/by-number/${orderNumber}`);

      if (response.ok) {
        const orderData = await response.json();
        console.log('✅ Order status fetched:', orderData);

        // Calculate estimated delivery
        const orderDate = new Date(orderData.createdAt);
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 1); // Next day delivery

        const estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const orderStatus: OrderStatus = {
          id: orderData.id,
          status: orderData.status || 'PENDING',
          paymentStatus: orderData.paymentStatus || 'PENDING',
          createdAt: orderData.createdAt,
          estimatedDelivery: estimatedDelivery,
          trackingNumber: orderData.trackingNumber || `TRK${orderNumber.slice(-6)}`
        };

        setOrderStatus(orderStatus);
      } else {
        console.log('❌ Order not found, using fallback');
        // Fallback to basic status if order not found
        const fallbackStatus: OrderStatus = {
          id: orderNumber,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          createdAt: new Date().toISOString(),
          estimatedDelivery: 'Processing...',
          trackingNumber: `TRK${orderNumber.slice(-6)}`
        };
        setOrderStatus(fallbackStatus);
      }
    } catch (err) {
      console.error('❌ Error fetching order status:', err);
      setError('Failed to fetch order status');

      // Fallback to basic status on error
      const fallbackStatus: OrderStatus = {
        id: orderNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        estimatedDelivery: 'Processing...',
        trackingNumber: `TRK${orderNumber.slice(-6)}`
      };
      setOrderStatus(fallbackStatus);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600';
      case 'SHIPPED': return 'text-blue-600';
      case 'PREPARING': return 'text-yellow-600';
      case 'CONFIRMED': return 'text-purple-600';
      case 'CANCELLED': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-600 bg-green-50';
      case 'FAILED': return 'text-red-600 bg-red-50';
      case 'REFUNDED': return 'text-orange-600 bg-orange-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchOrderStatus}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orderStatus) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-600">
          <p>Order not found</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(orderStatus.status);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order #{orderNumber}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Placed on {new Date(orderStatus.createdAt).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(orderStatus.paymentStatus)}`}>
            {orderStatus.paymentStatus}
          </span>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
        <div className="relative">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const IconComponent = step.icon;

            return (
              <div key={step.key} className="flex items-center mb-4 last:mb-0">
                {/* Timeline Line */}
                {index < statusSteps.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 h-8 ${
                      isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                    style={{ marginTop: '1rem' }}
                  />
                )}

                {/* Status Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <IconComponent size={16} />
                </div>

                {/* Status Label */}
                <div className="ml-4 flex-1">
                  <p
                    className={`font-medium ${
                      isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-primary-600 font-medium">
                      Current Status
                    </p>
                  )}
                </div>

                {/* Timestamp (mock) */}
                {isCompleted && (
                  <div className="text-sm text-gray-500">
                    {index === 0 && new Date(orderStatus.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Information */}
      {orderStatus.estimatedDelivery && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <FiTruck className="text-blue-600 mr-2" size={20} />
            <div>
              <p className="font-medium text-blue-900">Estimated Delivery</p>
              <p className="text-sm text-blue-700">{orderStatus.estimatedDelivery}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Number */}
      {orderStatus.trackingNumber && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Tracking Number</p>
              <p className="text-sm text-gray-600 font-mono">{orderStatus.trackingNumber}</p>
            </div>
            <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Track Package
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
          View Order Details
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
