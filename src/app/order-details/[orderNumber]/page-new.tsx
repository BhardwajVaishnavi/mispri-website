'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiDownload, FiTruck, FiMapPin, FiPhone, FiMail, FiPackage, FiSend, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  subtotal?: number;
  shipping?: number;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    product: {
      id: string;
      name: string;
      imageUrl?: string;
    };
  }>;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  customer?: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

export default function OrderDetailsPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();

  const orderNumber = params.orderNumber as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    fetchOrderDetails();
  }, [isAuthenticated, orderNumber, router]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orders/by-number/${orderNumber}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch order details');
      }

      const orderData = await response.json();
      setOrderDetails(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order details');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'SHIPPED': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'CONFIRMED': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'PREPARING': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'PENDING_ASSIGNMENT': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'ASSIGNED': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
      case 'IN_PROGRESS': return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'FAILED': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'REFUNDED': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-primary-200/20 rounded w-1/4 mb-6"></div>
            <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
              <div className="h-6 bg-primary-200/20 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-primary-200/20 rounded"></div>
                <div className="h-4 bg-primary-200/20 rounded w-3/4"></div>
                <div className="h-4 bg-primary-200/20 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <FiPackage size={48} className="mx-auto mb-2" />
              <p className="text-lg font-medium">Failed to load order details</p>
              <p className="text-sm">{error}</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={fetchOrderDetails}
                className="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/orders"
                className="bg-dark-600 text-primary-200 px-6 py-2 rounded-md hover:bg-dark-500 border border-primary-200/30 transition-colors inline-block"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-dark-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <FiPackage size={48} className="mx-auto mb-4 text-primary-300" />
            <p className="text-lg font-medium text-primary-200">Order not found</p>
            <Link
              href="/orders"
              className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors inline-block"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/orders"
              className="flex items-center space-x-2 text-primary-200 hover:text-primary-100"
            >
              <FiArrowLeft size={20} />
              <span>Back to Orders</span>
            </Link>
          </div>
        </div>

        {/* Order Header */}
        <div className="bg-dark-700 rounded-lg shadow-md p-6 mb-6 border border-primary-200/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-100">Order #{orderDetails.orderNumber}</h1>
              <p className="text-primary-200/80 mt-1">
                Placed on {new Date(orderDetails.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
                {orderDetails.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(orderDetails.paymentStatus)}`}>
                {orderDetails.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
              <h2 className="text-xl font-bold text-primary-100 mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderDetails.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-primary-200/20 rounded-lg bg-dark-600">
                    <div className="w-16 h-16 bg-dark-500 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.imageUrl || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-primary-100">{item.product.name}</h3>
                      <p className="text-sm text-primary-200/80">Quantity: {item.quantity}</p>
                      <p className="text-sm text-primary-200/80">Unit Price: ₹{item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-100">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
              <h2 className="text-xl font-bold text-primary-100 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-lg font-bold border-t border-primary-200/20 pt-2">
                  <span className="text-primary-100">Total</span>
                  <span className="text-primary-100">₹{orderDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {orderDetails.address && (
              <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
                <h2 className="text-xl font-bold text-primary-100 mb-4 flex items-center">
                  <FiMapPin className="mr-2 text-primary-400" />
                  Delivery Address
                </h2>
                <div className="text-sm text-primary-200/80 space-y-1">
                  <p className="font-medium text-primary-100">
                    {orderDetails.customer?.firstName} {orderDetails.customer?.lastName}
                  </p>
                  <p>{orderDetails.address.street}</p>
                  <p>{orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.postalCode}</p>
                  {orderDetails.address.country && <p>{orderDetails.address.country}</p>}
                  {orderDetails.customer?.phone && (
                    <p className="flex items-center mt-2">
                      <FiPhone className="mr-1 text-primary-400" size={14} />
                      {orderDetails.customer.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
